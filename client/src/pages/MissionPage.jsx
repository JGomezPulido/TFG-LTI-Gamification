import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form";
import { useState } from "react";

import { useCourse } from "../context/courseContext";
import { useMissions } from "../context/missionContext";
import { useInventory } from "../context/inventoryContext";

import { Card, Button, Flex } from "@radix-ui/themes";
import FormInput from "../components/FormInput";
import UsersView from "../components/CourseView/UserView";
import ItemSelector from "../components/ItemSelector";

export default function MissionPage() {
    const params = useParams();
    const navigate = useNavigate();
    const {current, getMission, updateMission, deleteMission, giveMission} = useMissions();
    const {register, handleSubmit, getValues, setValue} = useForm({values: {
        name: current?.name,
        description: current?.description,
        rewards: current?.rewards,
    }});

    const {role} = useCourse();
    const {items, getAllItems} = useInventory();

    const [showUsers, setShow] = useState(false);

    useEffect( () => {
        getMission(params.mission_id)
        getAllItems();
    }, []);

    const itemsList = items.map((item) => ({type: item._id, name: item.name, amount: current?.rewards.find((r) => r.type === item._id)?.amount, selected: current?.rewards.some((r) => item._id===r.type)}));

    async function addItem(item){
        var rewards = getValues("rewards");
        var found = rewards.findIndex((r) => r.type === item.type);
        if(found >= 0) rewards[found] = item;
        else rewards.push(item);
        setValue("rewards", rewards);
    }
    async function removeItem(id){
        const {rewards} = getValues();
        setValue("rewards", rewards.map((item) => {
            if(item.type===id) item.amount = 0;
            return item;
        }));
    }
    function updateAmount(id, amount){
        const {rewards} = getValues();
        setValue("rewards", rewards.map((item) => {
            console.log("update: id: ", id, " check: ", item);
            if(item.type===id) item.amount = amount;
            return item;
        }))
    }

    async function onDelete(){
        await deleteMission(params.mission_id);
        navigate(`/course/${params.course_id}`);
    }
    function onShow(){
        setShow(!showUsers);
    }
    async function onGive(user){
        await giveMission(params.mission_id, user);
    }
    
    
    return (
    <Card>
        <form  
        onSubmit={handleSubmit(async (values) => {
                    try{
                        await updateMission(params.mission_id, values);
                    }catch (error){
                        console.log("Could not create mission: ", error.response.data.message);
                    }
                })}>
        <Flex direction={"column"} gap="3">
            <FormInput type='text' title='Name' register={register('name')} readonly={role!=="Instructor"}/>
            <FormInput type='text' title='Description' register={register('description')} readonly={role!=="Instructor"}/>
            <ItemSelector items={itemsList} onSelected={addItem} onDeselected={removeItem} updateAmount={updateAmount}/>
            {role === "Instructor" && 
            <Flex dir="row" gap={"3"} align={"center"} justify={"center"}>
                <Button type="button" onClick={onDelete}>Delete</Button>
                <Button type='submit' >Update</Button>
                <Button  type="button" onClick={onShow}>Show Users</Button>
            </Flex>}
        </Flex>
        </form>
        {showUsers && <UsersView onClick={onGive}/>}
    </Card>
    )
}