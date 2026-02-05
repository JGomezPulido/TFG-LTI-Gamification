import axios from "./axios.js";

export const getUsers = (id) => axios.get(`/course/users/${id}`);