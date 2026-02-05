import { useState } from "react";
import { useCourse } from "../context/courseContext";
import UsersView from "../components/CourseView/UserView";
import BadgeView from "../components/CourseView/BadgeView";
import AssertionsView from "../components/CourseView/AssertionView";

function Render(state, course){
    if (state === "Users"){
        return <UsersView />
    } 
    else if (state === "Badges"){
        return <BadgeView />
    }
    else if(state === "Awarded"){
        return <AssertionsView />
    }
}

export default function CoursePage (){
    const {role, course} = useCourse();
    const [state, setState] = useState("Users");

    function changeState(newState) {
        return () => setState(newState);
    }

    return(
    <div className="flex flex-col container mx-auto items-center justify-between">
        <h1 className="flex-1 text-3xl text-center py-5">Curso: {course.name}</h1> 
        <div className="flex-1 flex flex-row items-center w-200 justify-between py-2 px-10 mb-2 border-b-white border-b-2">

            <button onClick={changeState("Users")} className="flex-5 text-center px-5 hover:bg-zinc-600">Users</button>
            <button onClick={changeState("Badges")} className="flex-5 text-center px-5 hover:bg-zinc-600">Badges</button>
            <button onClick={changeState("Awarded")} className="flex-5 text-1xl px-5 hover:bg-zinc-600">My Badges</button>
           
        </div>
        <div className="flex-3 ">
         { Render(state, course.id) }
        </div>
    </div>
    );
}