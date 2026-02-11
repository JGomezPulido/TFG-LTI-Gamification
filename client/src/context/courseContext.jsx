import { useEffect, useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { exitCourseRequest, getCourseRequest, getUsersRequest, loginCourseRequest } from "../api/course";
import { useParams } from "react-router-dom";

const CourseContext = createContext();

export const useCourse = () => {
    const context = useContext(CourseContext);
    if(!context){
        throw new Error("useCourse must be used within useCourse")
    }
    return context;
}

export const CourseProvider = ({children}) => {
    const [role, setRole] = useState("");
    const [course, setCourse] = useState(null);
    const [userList, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const params = useParams();

    useEffect(() => {
        if(params.courseId) getCourse(params.courseId);
    }, [params]);
    
    const loginCourse = async (id) => {
        const res = await loginCourseRequest(id);
        if(!res.data)
            throw new Error("Could not get course data");
        console.log("login: ", res);
        setCourse(res.data.course);
        setRole(res.data.role);
        setLoading(false);
    }
    const getCourse = async (id) => {
        try {
            const res = await getCourseRequest(id);
            if(!res.data)
                throw new Error("Could not get course data");
            console.log("getCourse:", res.data)
            setCourse(res.data.course);
            setRole(res.data.role);
        } catch (error) {
            setRole(null);
            setCourse("");
            console.log("Error when loading course: ", error.message);
        }
        setLoading(false);
        return;
    };

    const unloadCourse = async () => {
        const res = await exitCourseRequest(id);
        setCourse(null);
        setRole("");
        setUsers([]);
    }

    const getUserList = async (id) => {
        try {
            if(!course){
                throw new Error("You must load a course before trying to get its users");
            }
            const res = await getUsersRequest(id);
            setUsers(res.data);
        } catch (error){
            console.log(error.message);
            return null;
        }
    }

    return (
        <CourseContext.Provider value={{
            role, 
            course,
            getCourse,
            unloadCourse,
            getUserList,
            loginCourse,
            userList,
            loading,
        }}>
            {children}
        </CourseContext.Provider>
    )
}