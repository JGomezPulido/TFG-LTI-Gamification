import { useEffect } from "react";
import { useCourse } from "../../context/courseContext"
import { useNavigate } from "react-router-dom";

function User({user, index, onClick}){
    const navigate = useNavigate();
    if(!onClick) {
        onClick = (user) =>{
        return navigate(`/profile:${user}`);
    }
    }   
    return (
        <button onClick={()=>onClick(user._id)} 
        className={`flex-1 flex flex-col py-3 border-zinc-500 ${index===0?"border-3":"border-x-3 border-b-3"} border-b-3 hover:bg-zinc-600 w-full`}>
            <p className="flex-3 text-2xl px-0.5"> {user.username} </p>
            <p className="flex-1 text-0.5 px-0.5"> {user.email} </p>
        </button>
    )
}
export default function UsersView({onClick}){
    const {role, course, userList, getUserList} = useCourse();

    useEffect( () => {
        getUserList(course.id);
    }, [])
    const users = userList?.map((user, index) => <User key={index} index={index} user={user} onClick={onClick}/>);
    return (
        <div className="flex-5 mx-auto flex flex-col container">
            {users}
        </div>
    )
}