
import { Navigate, Outlet } from "react-router-dom";
import { useCourse } from "../context/courseContext";

export default function RoleRoute({accepted}){
    const {role} = useCourse();
    if(role !== accepted){
        return <Navigate to="/dashboard" replace/>
    }
    return <Outlet />
}