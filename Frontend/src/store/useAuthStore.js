import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { create } from "zustand";
import { api } from "../lib/axios.js";
import { useMessageStore } from "./useMessageStore.js";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await api.get("/auth/check")
            set({ authUser: res.data })

        } catch (error) {
            console.log('Error in checkAuth', error);
            if (error?.response?.status === 401) {
                set({ authUser: null })
            }

        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await api.post("/auth/signup", data)
            set({ authUser: res.data })
            toast.success(res.data.message || "Sign Up Successful 🎉")
            return true
        } catch (error) {
            console.log('Error in signup', error);
            set({ authUser: null })
            toast.error(error?.response?.data.message)
        }
        finally {
            set({ isSigningUp: false })
        }
    },

    logout: async () => {
        const { disconnectSocket } = get()
        try {
            const res = await api.post("/auth/logout")
            set({ authUser: null, selectedUsers: null })
            disconnectSocket()
            useMessageStore.getState().reset()
            toast.success(res.data.message || "Logged Out Successfully ✔️")
        } catch (error) {
            toast.error(error?.response?.data.message)

        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await api.post("/auth/login", data)
            set({ authUser: res.data })
            toast.success(res.data.message || "Logged In Successfully ✔️")
            return true
        } catch (error) {
            console.log('Error in signup', error);
            set({ authUser: null })
            toast.error(error?.response?.data?.message)
        } finally {
            set({ isLoggingIn: false })
        }
    },

    updateProfile: async (file) => {
        set({ isUpdatingProfile: true })
        try {
            const formData = new FormData()
            formData.append("profilepic", file)

            const res = await api.put("/auth/update-profile", formData)
            set({ authUser: res.data })
            toast.success("Profile updated successfully ✔️")
        } catch (error) {
            console.log('Error while updating-profile', error);
            toast.error(error?.response?.data?.message || "Failed to update profile")
        }
        finally {
            set({ isUpdatingProfile: false })
        }
    },

    connectSocket: () => {
        const { authUser } = get()

        if (!authUser || get().socket) return;
        const socket = io("https://fullstack-chatapp-wudv.onrender.com/api", {
            auth: {
                userId: authUser._id
            }
        })


        socket.on("connect", () => {
            console.log("user connected:", socket.id)
            useMessageStore.getState().listenToMessages()
        })

        socket.on("connect_error", (error) => {
            console.log("Error while connecting", error.message)
        })

        socket.on("online-users", (users) => {
            set({
                onlineUsers: users
            })
        })

        socket.on("disconnect", () => {
            console.log("user disconnected:", socket.id)
        })

        set({ socket: socket })
    },

    disconnectSocket: () => {
        const { socket } = get()
        if (socket?.connected) {
            socket.off("online-users")
            socket.removeAllListeners()
            socket.disconnect()
            set({ socket: null, onlineUsers: [] })
        }

    }
}))