import axios from './axios.js'

export const createItemRequest   = async (data)            => axios.post(`/item`, data);
export const getItemRequest      = async (id)              => axios.get(`/item/${id}`);
export const getAllItemsRequest  = async ()                => axios.get(`/item`);
export const deleteItemRequest   = async (id)              => axios.delete(`/item/${id}`);
export const updateItemRequest   = async (id, data)        => axios.put(`/item/${id}`, data);

export const getInventoryRequest   = async (user)          => axios.get(`/inventory/${user}`);
export const giveItemRequest       = async (user,data)     => axios.put(`/inventory/${user}`, data);
export const delFromInvRequest     = async (user)          => axios.delete(`/inventory/${user}`, data);