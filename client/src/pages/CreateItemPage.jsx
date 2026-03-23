import { useForm } from "react-hook-form";
import { useInventory } from "../context/inventoryContext";
import FormInput from "../components/FormInput";
import { useCourse } from "../context/courseContext";
import { useNavigate } from "react-router-dom";
import { Card, Flex, Button, TextField } from "@radix-ui/themes";

export default function CreateItemPage(){
    const {register, handleSubmit} = useForm();
    const {createItem} = useInventory();
    const {course} = useCourse();
    const navigate = useNavigate();
    return (
        <Card>
            <form onSubmit={handleSubmit(async (values) => {
                try{
                    await createItem(values);
                    navigate(`/course/${course.id}`);
                }catch (error){
                    console.log("Could not create badge: ", error.response.data.message);
                }
            })}>
                <Flex direction={"column"} gap="3">
                
                    <h1 className="my-2 font-bold self-center content-center justify-center">Create new item</h1>
                    <FormInput type='text' title='name' register={register('name', {required: true})}/>
                    <FormInput type='text' title='description' register={register('description', {required: true})}/>
                    <FormInput type='text' title='image' register={register('image', {required: true})}/>
                    <Button type='submit'>
                        Create Item
                    </Button>
                </Flex>
            </form>
           
        </Card>
    )
}