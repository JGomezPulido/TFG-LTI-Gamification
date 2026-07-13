import { useContext, createContext, useState} from "react";
import {
    createMissionRequest,
    getMissionRequest,
    getAllMissionsRequest,
    updateMissionRequest,
    deleteMissionRequest,
    getUserMissionsRequest,
    giveMissionRequest,
    completeMissionRequest,
    enableMissionRequest
} from "../api/mission.js"
const MissionContext = createContext();

export const useMissions = () => {
    const context = useContext(MissionContext);
    if(!context){
        throw new Error("useMissions must be used within MissionsProvider");
    }
    return context;
}

export const MissionProvider = ({children}) => {
    const [current, setCurrent] = useState(null);
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const createMission = async (data) => {
        try{
            setLoading(true);
            const res = await createMissionRequest(data);
            setCurrent(res.data);
            setLoading(false);
        } catch (error) {
            setLoading(true);
            setCurrent(null);
            throw error;
            console.log("Error: ", error.message);
        }
    };
    const deleteMission = async (id) => {
         try{
            setLoading(true);
            const res = await deleteMissionRequest(id);
            setCurrent(null);
            setLoading(false);
        }catch(error){
            setLoading(true);
            console.log(error);
        }
    };
    const updateMission = async (id, data) => {
        try{
            setLoading(true);
            const res = await updateMissionRequest(id, data);
            setCurrent(res.data);
            setLoading(false);
        }catch(error){
            setLoading(true);
            throw error;
        }
    };
    const getMission = async (id) => {
        try {
            setLoading(true);
            const res = await getMissionRequest(id);
            setCurrent(res.data);
            setLoading(false);
        } catch (error) {
            setLoading(true);
            setCurrent(null);
            throw error;
            console.log(error);
        }
    };
    const getAllMissions = async () => {
         try{
            setLoading(true);
            const res = await getAllMissionsRequest();
            setMissions(res.data);
            setLoading(false);
        } catch (error) {
            setMissions([]);
            setLoading(true);
            throw error;
        }
    };

    const getUserMissions = async (user) => {
        try{
            setLoading(true);
            const res = await getUserMissionsRequest(user);
            setMissions(res.data);
            setLoading(false);
        } catch (error) {
            setMissions([]);
            setLoading(true);
            throw error;
        }
    };

    const giveMission = async (id, user) => {
        try{
            const res = await giveMissionRequest(id, user);
        }catch(error){
            console.log(error);
            throw error;
        }
    };

    const enableMission = async (id) => {
        try{
            const res = await enableMissionRequest(id);
        } catch(error){

        }
    }
    const completeMission = async (id, user) => {
        try{
            const res = await completeMissionRequest(id, user);
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    return (
        <MissionContext.Provider value={{
            missions,
            current,
            loading,
            getMission,
            createMission,
            updateMission,
            deleteMission,
            getAllMissions,
            giveMission,
            completeMission,
            enableMission
        }}>
            {children}
        </MissionContext.Provider>
    )

}