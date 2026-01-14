import axios from "axios"

export const api = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "https://fullstack-chatapp-wudv.onrender.com/api",
    withCredentials: true
})