import { useForm } from "react-hook-form";
import { useMissions } from "../context/missionContext";
import FormInput from "../components/FormInput";
import { useCourse } from "../context/courseContext";
import { useNavigate } from "react-router-dom";
import {useInventory} from "../context/inventoryContext"
import { Card, Flex, Button } from "@radix-ui/themes";
import { useEffect } from "react";
import ItemSelector from "../components/ItemSelector";

export default function CreateMissionPage(){
    const {register, handleSubmit, formState: {errors: formErrors}, setValue, getValues} = 
    useForm({defaultValues: {rewards: []}});
    const {items, getAllItems} = useInventory();
    const {createMission} = useMissions();
    const {course} = useCourse();
    const navigate = useNavigate();
    useEffect(()=>{
        getAllItems();
    }, []);
    async function addItem(item){
        setValue("rewards", [...getValues("rewards"), item]);
        console.log("Adding....: ", getValues("rewards"));
    }

    async function removeItem(id){
        const {rewards} = getValues();
        setValue("rewards", rewards.filter((item) => item.type===id));
        console.log("Removing....: ", getValues("rewards"));
    }

    function updateAmount(id, amount){
        const {rewards} = getValues();
        setValue("rewards", rewards.map((item) => {
            console.log("update: id: ", id, " check: ", item);
            if(item.type===id) item.amount = amount;
            return item;
        }))
        console.log("Updating....: ", getValues("rewards"));
    }
    var itemsList = items.map((item) => ({type: item._id, name: item.name, amount: 1, selected: false}));   
    return (
        <Card>
            <form onSubmit={handleSubmit(async (values) => {
                try{
                    console.log("rewards: ", values.rewards);
                    await createMission(values);
                    console.log("here");
                    navigate(`/course/${course.id}`);
                }catch (error){
                    console.log(error);
                }
            })}>
                <Flex direction={"column"} gap="3">
                
                    <h1 className="my-2 font-bold self-center content-center justify-center">Create new badge</h1>
                    <FormInput type='text' title='name' register={register('name', {required: "Name is required"})} error={formErrors.name}/>
                    <FormInput type='text' title='description' register={register('description', {required: "Description is required"})} error={formErrors.description}/>
                    {items && <ItemSelector items={itemsList} onDeselected={removeItem} onSelected={addItem} updateAmount={updateAmount}></ItemSelector>}
                    <Button type='submit'>
                        Create Badge
                    </Button>
                </Flex>
            </form>
           
        </Card>
    )
}