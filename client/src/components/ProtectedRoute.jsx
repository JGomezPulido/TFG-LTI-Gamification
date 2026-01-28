import { useAuth } from "../context/authContext";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute(){
    const {isAuthenticated, loading} = useAuth();
    if(loading) {
        return(<div className="bg-zinc-700"/>);
    }
    if(!loading && !isAuthenticated) return <Navigate to="/login" replace/>
    
    return <Outlet />
}