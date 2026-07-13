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
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const createItem = async (data) => {
        try{
            setLoading(true);
            const res = await createItemRequest(data);
            setCurrent(res.data);
            setLoading(false);
        } catch (error) {
            setLoading(true)
            throw error;
        }
    };
    const deleteItem = async (id) => {
         try{
            setLoading(true);
            const res = await deleteItemRequest(id);
            setCurrent(null);
            setLoading(false);
        }catch(error){
            console.log(error);
        }
    };
    const updateItem = async (id, data) => {
        try{
            setLoading(true);
            const res = await updateItemRequest(id, data);
            setCurrent(res.data);
            setLoading(false);
        }catch(error){
            console.log(error);
        }
    };
    const getItem = async (id) => {
        try {
            setLoading(true);
            const res = await getItemRequest(id);
            setCurrent(res.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };
    const getAllItems = async () => {
         try{
            setLoading(true);
            const res = await getAllItemsRequest();
            setItems(res.data);
            setLoading(false);
        } catch (error) {
            setLoading(true);
            throw error;
        }
    };

    const getInventory = async (user) => {
        try{
            setLoading(true);
            const res = await getInventoryRequest(user);
            setInventory(res.data.items);
            setLoading(false);
        } catch (error) {
            setLoading(true);
            throw error;
        }
    };

    const giveItem = async (user, data) => {
        try{

            const res = await giveItemRequest(user, data);

        }catch(error){

            console.log(error);
            throw error;
        }
    };

    const deleteFromInventory = async (user, data) => {
        try{
 
            const res = await delFromInvRequest(user, data);

        }catch(error){
            console.log(error);
            throw error;
        }
    }

    return (
        <InventoryContext.Provider value={{
            items,
            current,
            inventory,
            loading,
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