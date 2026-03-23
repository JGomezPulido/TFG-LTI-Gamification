import { createContext, useContext, useState } from "react";
import { createItemRequest, deleteItemRequest, delFromInvRequest, getAllItemsRequest, getInventoryRequest, getItemRequest, giveItemRequest, updateItemRequest } from "../api/inventory";


const InventoryContext = createContext();

export const useInventory = () => {
    const context = useContext(InventoryContext);
    if(!context){
        throw new Error("useBadges must be used within BadgeProvider")
    }
    return context;
}

export const InventoryProvider = ({children}) => {
    const [inventory, setInventory] = useState([]);
    const [current, setCurrent] = useState(null);
    const [items, setItems] = useState([])

    const createItem = async (data) => {
        try{
            const res = await createItemRequest(data);
            setCurrent(res.data);
        } catch (error) {
            throw error;
            console.log("Error: ", error.message);
        }
    };
    const deleteItem = async (id) => {
         try{
            const res = await deleteItemRequest(id);
            setCurrent(null);
        }catch(error){
            console.log(error);
        }
    };
    const updateItem = async (id, data) => {
        try{
            const res = await updateItemRequest(id, data);
            setCurrent(res.data);
        }catch(error){
            console.log(error);
        }
    };
    const getItem = async (id) => {
        try {
            const res = await getItemRequest(id);
            setCurrent(res.data);
        } catch (error) {
            console.log(error);
        }
    };
    const getAllItems = async () => {
         try{
            const res = await getAllItemsRequest();
            setItems(res.data);
        } catch (error) {
            throw error;
        }
    };

    const getInventory = async (user) => {
        try{
            const res = await getInventoryRequest(user);
            setInventory(res.data);
        } catch (error) {
            throw error;
        }
    };

    const giveItem = async (user, data) => {
        try{
            const res = await giveItemRequest(user, data);
        }catch(error){
            console.log(error);
        }
    };

    const deleteFromInventory = async (user, data) => {
        try{
            const res = await delFromInvRequest(user, data);
        }catch(error){
            console.log(error);
        }
    }

    return (
        <InventoryContext.Provider value={{
            items,
            current,
            inventory,
            getAllItems,
            getItem,
            createItem,
            updateItem,
            deleteItem,
            getInventory,
            giveItem,
            deleteFromInventory
        }}>
            {children}
        </InventoryContext.Provider>
    )

}