import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LTILaunch(){
    const [searchParams,] = useSearchParams();
    const {getUser, isAuthenticated, loading} = useAuth();
    const navigate = useNavigate();
    const ltiUser = {
        username: searchParams.get('username'),
        email: searchParams.get('email'),
        role: searchParams.get('role'),
        course: searchParams.get('course'),
    };
    
    useEffect(() => {
        async function redirect() {
            if(loading) return (<div className="bg-zinc-700"/>);
            if(!loading && isAuthenticated) return navigate("/dashboard", {replace: true});
            const user = await getUser(ltiUser)
            if(!loading && !user.found) return navigate("/register",{ replace: true, state: {ltiUser: ltiUser}});
        
            return navigate("/login", {replace:true, state:{ltiUser}});
            
        }
        redirect();
    }, [loading, isAuthenticated, getUser, ltiUser, navigate])
    
    
        
      
    
}