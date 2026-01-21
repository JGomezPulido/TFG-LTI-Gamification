import axios from "axios";

const API =  import.meta.env.VITE_BACKEND_BASE_URL;

export const registerRequest = user => axios.post(`${API}/register`, user);
export const loginRequest = user => axios.post(`${API}/login`, user);