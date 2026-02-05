import { useEffect } from "react";
import { useCourse } from "../../context/courseContext"
import { useNavigate } from "react-router-dom";

function User({user, index}){
    const navigate = useNavigate();
    function onClick() {
        return navigate(`/profile:${user._id}`);
    }
    return (
        <button onClick={onClick} 
        className={`flex-1 flex flex-col py-3 border-zinc-500 ${index===0?"border-3":"border-x-3 border-b-3"} border-b-3 hover:bg-zinc-600  mx-auto`}>
            <p className="flex-3 text-2xl"> {user.username} </p>
            <p className="flex-1 text-0.5"> {user.email} </p>
        </button>
    )
}
export default function UsersView(){
    const {userList, getUserList} = useCourse();

    useEffect( () => {
        getUserList();
    }, [])
    console.log(userList);
    const users = userList?.map((user, index) => <User key={index} index={index} user={user}/>);
    return (
        <div className="flex-5 mx-auto flex flex-col container">
            {users}
        </div>
    )
}