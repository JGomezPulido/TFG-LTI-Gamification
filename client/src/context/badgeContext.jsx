import { createContext, useContext, useState } from "react";
import { useCourse } from "./courseContext";
import { createBadgeRequest } from "../api/badges";

const BadgeContext = createContext();

export function useBadges (){
    const context = useContext(BadgeContext);
    if(!context){
        throw new Error("useBadges must be used within BadgeProvider")
    }
    return context;
}

export function BadgeProvider ({children}){
    const {course} = useCourse();

    const [badges, setBadges] = useState([]);

    const createBadge = async (data) => {
        try{
            const res = await createBadgeRequest(data, course._id);
            setBadges(res.data);
            console.log(res.data);
        } catch (error) {
            console.log("Error: ", error.message);
        }
    };
    const deleteBadge = async (id) => {};
    const awardBadge  = async (id, user) => {};
    const updateBadge = async (id, data) => {};
    const getBadge    = async (id) => {};
    const getBadges   = async () => {};

    return (
        <BadgeContext.Provider value={{
            badges,
            createBadge,
            deleteBadge,
            awardBadge,
            updateBadge,
            getBadge,
            getBadges,
        }}>
            {children}
        </BadgeContext.Provider>
    )

}