import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useSearchParams } from "react-router-dom";

export default function LTILaunch(){
    const [searchParams,] = useSearchParams();
    const {getUser, isAuthenticated, loading} = useAuth();
    const ltiUser = {
        username: searchParams.get('username'),
        email: searchParams.get('email'),
        role: searchParams.get('role'),
        course: searchParams.get('course'),
    };
    if(loading) return(<div className="bg-zinc-700"/>);
    if(!loading){
        if(isAuthenticated) return <Navigate to="/dashboard" replace/>;
        getUser(ltiUser).then((res) => {
            if(!res) return <Navigate to="/register" replace state={{ltiUser: ltiUser}}/>;
        
            else return <Navigate to="/login" replace state={{ltiUser}}/>;
        })
        
    }
      
    
    
}