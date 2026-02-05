import axios from "./axios.js";

export const createBadgeRequest = async (data, course)     => axios.post(`/badges/${course}`, data);
export const deleteBadgeRequest = async (id)               => axios.delete(`/badges/${id}`);
export const awardBadgeRequest  = async (id, user, course) => axios.post(`/badges/award/course/${course}/badge/${id}/target/${user}`);
export const updateBadgeRequest = async (id, data)         => axios.put(`/badges/${id}`, data);
export const getBadgeRequest    = async (id)               => axios.get(`/badges/${course}/badge/${id}`);
export const getBadgesRequest   = async (course)           => axios.get(`/badges/${course}`);