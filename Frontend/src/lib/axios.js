import axios from "axios"

export const api = axios.create({
    baseURL: "https://fullstack-chatapp-wudv.onrender.com/api",
    withCredentials: true
})