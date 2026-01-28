import { createContext, useState, useContext, useEffect } from "react";

import { registerRequest, loginRequest, requestUser, verifyTokenRequest} from "../api/auth";

import Cookies from "js-cookie";

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context;
}

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const signup = async (data) => {
        try{
            const res = await registerRequest(data);
            setUser(res.user);
            setAuthenticated(true);
        }catch(error){
            setUser(null);
            setAuthenticated(false);
            console.log(error);
        }
    }
    const signin = async (data) => {
        try{
            const res = await loginRequest(data);
            setUser(res.data);
            setAuthenticated(true);
        } catch (error) {
            setUser(null);
            setAuthenticated(false);
            console.log(error);
        }
    }

    const getUser = async (data) => {
        try{
            const res = await requestUser(data.email);
            console.log(res);
            return res.data;
        }catch {
            return false;
        }

    }

    useEffect(() => {
        async function checkToken() {
            const cookies = Cookies.get();
            if(cookies.token){
                try{
                    const res = await verifyTokenRequest();
                    if(!res.data){
                        setAuthenticated(false);
                        setUser(false);
                        setLoading(false);
                        return;
                    }
                    setAuthenticated(true);
                    setUser(res.data);
                    setLoading(false);
                }catch (error){
                    console.log("error", error)
                    setAuthenticated(false);
                    setUser(null);
                    setLoading(false);
                }
            }else{
                setAuthenticated(false);
                setUser(null);
                setLoading(false);
            }
        }

        checkToken();
    }, []);
    return (
        <AuthContext.Provider value={{
            signup,
            signin,
            getUser,
            isAuthenticated,
            user,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}
