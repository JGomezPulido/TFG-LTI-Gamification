import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { getUsers } from "../api/course";

const CourseContext = createContext();

export const useCourse = () => {
    const context = useContext(CourseContext);
    if(!context){
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context;
}

export function CourseProvider({children}){
    const [role, setRole] = useState("");
    const [course, setCourse] = useState(null);
    const [userList, setUsers] = useState([]);

    const loadCourse = (courseData) => {
        setRole(courseData.role);
        setCourse(courseData.course);
    };

    const getUserList = async () => {
        try {
            if(!course){
                throw new Error("You must load a course before trying to get its users");
            }
            const res = await getUsers(course._id);
            console.log(res);
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
            loadCourse,
            getUserList,
            userList
        }}>
            {children}
        </CourseContext.Provider>
    )
}