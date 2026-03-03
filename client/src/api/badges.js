import axios from "./axios.js";

export const createBadgeRequest   = async (data)      => axios.post(`/badges`, data);
export const deleteBadgeRequest   = async (id)        => axios.delete(`/badges/${id}`);
export const awardBadgeRequest    = async (id, user)  => axios.post(`/badges/award/${id}/target/${user}`);
export const getAssertionsRequest = async ()      => axios.get(`/assertions`)
export const updateBadgeRequest   = async (id, data)  => axios.put(`/badges/${id}`, data);
export const getBadgeRequest      = async (id)        => axios.get(`/badges/badge/${id}`);
export const getBadgesRequest     = async ()          => axios.get(`/badges`);