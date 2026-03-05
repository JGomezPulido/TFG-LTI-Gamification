import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { useBadges } from "../context/badgeContext";
import FormInput from "../components/FormInput";
import { useForm } from "react-hook-form";
import { useState } from "react";
import UsersView from "../components/CourseView/UserView";
import { useCourse } from "../context/courseContext";
import { Card, Button, Flex } from "@radix-ui/themes";

export default function BadgePage() {
    const params = useParams();
    const {current, getBadge, updateBadge, deleteBadge, awardBadge} = useBadges();
    const {register, handleSubmit} = useForm();
    const {role} = useCourse();
    const [showUsers, setShow] = useState(false);

    const navigate = useNavigate();
    useEffect( () => {
        getBadge(params.badge_id);
    }, [])

    async function onDelete(){
        await deleteBadge(params.badge_id);
        navigate(`/course/${params.course_id}`);
    }
    function onShow(){
        console.log(setShow);
        setShow(!showUsers);
    }
    async function onAward(user){
        console.log()
        await awardBadge(params.badge_id, user)
    }

    console.log(current);
    return (
    <Card>
        <form  
        onSubmit={handleSubmit(async (values) => {
                    try{
                        await updateBadge(params.badge_id, values);
                    }catch (error){
                        console.log("Could not create badge: ", error.response.data.message);
                    }
                })}>
        <p>Name</p>
        <FormInput type='text' placeholder='Name' register={register('name')} readonly={role==="Intructor"} value={current?.name}/>
        <p>Descrition</p>
        <FormInput type='text' placeholder='Description' register={register('description')} readonly={role==="Intructor"} value={current?.description}/>
        <p>Image</p>
        <FormInput type='text' placeholder='Image' register={register('image')}  readonly={role==="Intructor"} value={current?.image}/>
        <p>Criteria</p>
        <FormInput type='text' placeholder='Criteria' register={register('criteria')} readonly={role==="Intructor"}  value={current?.criteria}/>
        {role === "Instructor" && 
        <Flex dir="row" gap={"3"} align={"center"} justify={"center"}>
            <Button type="button" onClick={onDelete}>Delete</Button>
            <Button type='submit' >Update</Button>
            <Button  type="button" onClick={onShow}>Show Users</Button>
        </Flex>}
        </form>
        {showUsers && <UsersView onClick={onAward}/>}
    </Card>
    )
}