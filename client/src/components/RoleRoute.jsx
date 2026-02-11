
import { Navigate, Outlet } from "react-router-dom";
import { useCourse } from "../context/courseContext";


export default function RoleRoute({accepted}){
    const {loading, role, course} = useCourse();
    if(loading) return <div>Loading...</div>;
    if(!loading && (!course || role !== accepted)){
        return <Navigate to="/dashboard" replace/>
    }
    if(!loading) return <Outlet />
}