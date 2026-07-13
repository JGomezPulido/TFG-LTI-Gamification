import axios from './axios.js'

export const createMissionRequest   = async (data)      => axios.post(`/mission`, data);
export const getMissionRequest      = async (id)        => axios.get(`/mission/${id}`);
export const getAllMissionsRequest  = async ()          => axios.get(`/mission`);
export const updateMissionRequest   = async (id, data)  => axios.put(`mission/${id}`, data);
export const deleteMissionRequest   = async (id)        => axios.delete(`/mission/${id}`);

export const getUserMissionsRequest = async (user)      => axios.get(`/mission/user/${user}`);
export const giveMissionRequest     = async (id, user)  => axios.put(`/mission/${id}/user/${user}`);
export const completeMissionRequest = async (id, user)  => axios.put(`/mission/${id}/user/${user}/reward`);
export const enableMissionRequest   = async (id)        => axios.post(`/mission/${id}/enable`);
