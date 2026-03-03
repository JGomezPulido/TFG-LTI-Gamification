import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { useBadges } from "../context/badgeContext";
import FormInput from "../components/FormInput";
import { useForm } from "react-hook-form";
import { useState } from "react";
import UsersView from "../components/CourseView/UserView";
import { useCourse } from "../context/courseContext";

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
        await awardBadge(params.badge_id, user)
    }

    console.log(current);
    return (
    <div 
    className="flex flex-col py-5 mx-auto items-center justify-center px-5">
        <form  
        onSubmit={handleSubmit(async (values) => {
                    try{
                        console.log("Updating");
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
        <div className="flex-row px-3 flex ">
            <button className="mx-3 bg-zinc-700 hover:bg-zinc-600 rounded-md my-2 p-2" type="button" onClick={onDelete}>Delete</button>
            <button className="mx-3 bg-zinc-700 hover:bg-zinc-600 rounded-md my-2 p-2" type='submit' >Update</button>
            <button className="mx-3 bg-zinc-700 hover:bg-zinc-600 rounded-md my-2 p-2" type="button" onClick={onShow}>Show Users</button>
        </div>}
        </form>
        {showUsers && <UsersView onClick={onAward}/>}
    </div>
    )
}