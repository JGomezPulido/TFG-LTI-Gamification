import axios from "./axios.js";

export const getUsersRequest = (id) => axios.get(`/course/users/${id}`);
export const getCourseRequest = (id) => axios.get(`/course/${id}`);
export const loginCourseRequest = (id) => axios.post(`/course/${id}/login`);
export const exitCourseRequest = () => axios.post(`/course/logout`);