import { useNavigate } from "react-router-dom"
import { useCourse } from "../context/courseContext";

export default function CourseButton({role}){
    const navigate = useNavigate();
    const {course, getCourse, loginCourse} = useCourse();
    async function click () {
        
        console.log("click:",role.course);
        try{
            await getCourse(role.course._id);
            
            console.log("CourseButton click: ",course);
            loginCourse(role.course._id);
            return navigate(`/course/${role.course._id}`);
        }catch (error){
            console.log("Error while logging into course:", error);
        }
    }
    return (
        <div className="rounded-md bg-zinc-700 flex items-center">
            <button onClick={click} className="rounded-md w-full py-5 px-5 hover:bg-zinc-600"> {role.course.name} (Role: {role.role})</button>
        </div>
    )
}