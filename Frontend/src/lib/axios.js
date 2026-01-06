import axios from "axios"

export const api = axios.create({
    baseURL: import.meta.env.MODE === "developement" ? "http://localhost:5001/api" : "",
    withCredentials: true
})