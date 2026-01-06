import axios from "axios"

export const api = axios.create({
    baseURL: import.meta.env.MODE === "developement" ? "http://localhost:5001/api" : import.meta.env.VITE_API_URL,
    withCredentials: true
})