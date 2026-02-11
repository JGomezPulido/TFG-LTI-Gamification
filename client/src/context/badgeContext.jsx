import { createContext, useContext, useState } from "react";
import { useCourse } from "./courseContext";
import { createBadgeRequest, getBadgesRequest } from "../api/badges";

const BadgeContext = createContext();

export const useBadges = () => {
    const context = useContext(BadgeContext);
    if(!context){
        throw new Error("useBadges must be used within BadgeProvider")
    }
    return context;
}

export const BadgeProvider = ({children}) => {
    const {course} = useCourse();

    const [badges, setBadges] = useState([]);

    const createBadge = async (data) => {
        try{
            const res = await createBadgeRequest(data, course.id);
            console.log(res);
            setBadges(res.data);
        } catch (error) {
            console.log("Error: ", error.message);
        }
    };
    const deleteBadge = async (id) => {};
    const awardBadge  = async (id, user) => {};
    const updateBadge = async (id, data) => {};
    const getBadge    = async (id) => {};
    const getBadges   = async () => {
         try{
            const res = await getBadgesRequest();
            setBadges(res.data);
            console.log("badges:",res.data);
        } catch (error) {
            console.log("Error: ", error.message);
        }
    };

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