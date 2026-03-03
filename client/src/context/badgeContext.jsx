import { createContext, useContext, useState } from "react";
import { awardBadgeRequest, createBadgeRequest, deleteBadgeRequest, getBadgeRequest, getBadgesRequest, updateBadgeRequest, getAssertionsRequest } from "../api/badges";

const BadgeContext = createContext();

export const useBadges = () => {
    const context = useContext(BadgeContext);
    if(!context){
        throw new Error("useBadges must be used within BadgeProvider")
    }
    return context;
}

export const BadgeProvider = ({children}) => {
    const [badges, setBadges] = useState([]);
    const [current, setCurrent] = useState(null);
    const [assertions, setAssertions] = useState([]);

    const createBadge = async (data) => {
        try{
            const res = await createBadgeRequest(data);
            setBadges(res.data);
        } catch (error) {
            throw error;
            console.log("Error: ", error.message);
        }
    };
    const deleteBadge = async (id) => {
         try{
            const res = await deleteBadgeRequest(id);
            setCurrent(null);
        }catch(error){
            console.log(error);
        }
    };
    const awardBadge  = async (id, user) => {
        try{
            const res = await awardBadgeRequest(id, user);
        }catch(error){
            console.log(error);
        }
    };
    const updateBadge = async (id, data) => {
        try{
            const res = await updateBadgeRequest(id, data);
            setCurrent(res.data);
        }catch(error){
            console.log(error);
        }
    };
    const getBadge    = async (id) => {
        try {
            const res = await getBadgeRequest(id);
            setCurrent(res.data);
        } catch (error) {
            console.log(error);
        }
    };
    const getBadges   = async () => {
         try{
            const res = await getBadgesRequest();
            setBadges(res.data);
        } catch (error) {
            throw error;
        }
    };

    const getAssertions = async () => {
        try{
            const res = await getAssertionsRequest();
            setAssertions(res.data);
        } catch (error) {
            throw error;
        }
    };

    return (
        <BadgeContext.Provider value={{
            badges,
            current,
            assertions,
            createBadge,
            deleteBadge,
            awardBadge,
            updateBadge,
            getBadge,
            getBadges,
            getAssertions
        }}>
            {children}
        </BadgeContext.Provider>
    )

}