import Course from "../components/CourseButton";
import { useAuth } from "../context/authContext";

export default function DashboardPage(){
    const BASE_IP=import.meta.env.BASE_URL;
    const {user} = useAuth();
    console.log(user);
    const courses = user.roles.map(role => <li key={role.course._id}><Course course={role}/></li>);
    return (
        <div className="flex items-center justify-center flex-col px-5 py-5">
            <h1 className="my-5 text-3xl">Dashboard</h1>
            <ul
            className="w-full text-center text-lg">Cursos:
                {courses}
            </ul>
        </div>
    );
}