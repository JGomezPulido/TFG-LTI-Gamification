import { useNavigate } from "react-router-dom"
import { useCourse } from "../context/courseContext";

export default function CourseButton({course}){
    const navigate = useNavigate();
    const {loadCourse} = useCourse();
    function click () {
        loadCourse(course);
        console.log(course);
        return navigate(`/course/${course.course._id}`);
    }
    return (
        <div className="rounded-md bg-zinc-700 flex items-center">
            <button onClick={click} className="rounded-md w-full py-5 px-5 hover:bg-zinc-600"> {course.course.name} (Role: {course.role})</button>
        </div>
    )
}