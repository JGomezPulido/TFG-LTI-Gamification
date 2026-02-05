import { useNavigate } from "react-router-dom";
import { useCourse } from "../../context/courseContext"

export default function BadgeView(){
    const { role} = useCourse();
    const navigate = useNavigate();
    function createBadge(){
        navigate('/badge/create');
    }
    return (
        <div>
            {role ==="Instructor" && <button className="flex-1 my-5 py-5 px-5 border-2 border-zinc-400 hover:border-zinc-600"
                onClick={createBadge}>Create new</button>}

        </div>
    )
}