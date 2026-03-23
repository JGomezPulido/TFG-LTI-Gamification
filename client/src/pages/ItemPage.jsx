import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import FormInput from "../components/FormInput";
import { useForm } from "react-hook-form";
import { useState } from "react";
import UsersView from "../components/CourseView/UserView";
import { useCourse } from "../context/courseContext";
import { Card, Button, Flex } from "@radix-ui/themes";
import { useInventory } from "../context/inventoryContext";

export default function ItemPage() {
    const params = useParams();
    const {current, getItem, updateItem, deleteItem, giveItem} = useInventory();
    const {register, handleSubmit} = useForm({values: {
        name: current?.name,
        description: current?.description,
        image: current?.image,
    }});
    const {role} = useCourse();
    const [showUsers, setShow] = useState(false);

    const navigate = useNavigate();
    useEffect( () => {
        getItem(params.item_id);
    }, [])

    async function onDelete(){
        await deleteItem(params.item_id);
        navigate(`/course/${params.course_id}`);
    }
    function onShow(){
        console.log(setShow);
        setShow(!showUsers);
    }
    async function onAward(user){
        console.log()
        await giveItem(user, {item: params.item_id})
    }
    return (
    <Card>
        <form  
        onSubmit={handleSubmit(async (values) => {
                    try{
                        await updateItem(params.item_id, values);
                    }catch (error){
                        console.log("Could not create badge: ", error.response.data.message);
                    }
                })}>
        <Flex direction={"column"} gap="3">
            <FormInput type='text' title='Name' register={register('name')} readonly={role!=="Instructor"}/>
            <FormInput type='text' title='Description' register={register('description')} readonly={role!=="Instructor"}/>
            <FormInput type='text' title='Image' register={register('image')}  readonly={role!=="Instructor"}/>
            {role === "Instructor" && 
            <Flex dir="row" gap={"3"} align={"center"} justify={"center"}>
                <Button type="button" onClick={onDelete}>Delete</Button>
                <Button type='submit' >Update</Button>
                <Button  type="button" onClick={onShow}>Show Users</Button>
            </Flex>}
        </Flex>
        </form>
        {showUsers && <UsersView onClick={onAward}/>}
    </Card>
    )
}