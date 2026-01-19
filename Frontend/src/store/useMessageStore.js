import { toast } from "react-hot-toast"
import { create } from "zustand"
import { api } from "../lib/axios"
import { useAuthStore } from "./useAuthStore"

export const useMessageStore = create((set, get) => ({
    messages: [],
    users: [],
    userReadCount: {},
    selectedUsers: null,
    isUserLoading: false,
    isMessageLoading: false,
    isUploadingFile: false,


    getUsers: async () => {
        set({ isUserLoading: true, users: [] })
        try {
            const res = await api.get("/messages/users")
            set({ users: res.data })
        } catch (error) {
            console.log('Eror while getting the users', error);
            toast.error(error.response?.data?.message)
        }
        finally {
            set({ isUserLoading: false })
        }
    },

    listenToMessages: () => {
        const { socket } = useAuthStore.getState()
        if (!socket) return

        socket.off("new-message")

        socket.on("new-message", (message) => {
            set((state) => {
                const isCurrentChat =
                    state.selectedUsers &&
                    (state.selectedUsers._id === message.senderId)

                const unReadBadge = isCurrentChat ? state.userReadCount : { ...state.userReadCount, [message.senderId]: ((state.userReadCount[message.senderId] || 0) + 1) }

                // Update users list
                const updatedUsers = state.users.map((user) => {
                    if (user._id === message.senderId) {
                        return { ...user, lastMessage: message }
                    }
                    return user
                })

                // Move active user to top
                updatedUsers.sort(
                    (a, b) =>
                        new Date(b.lastMessage?.createdAt || 0) -
                        new Date(a.lastMessage?.createdAt || 0)
                )

                return {
                    messages: isCurrentChat
                        ? [...state.messages, message]
                        : state.messages,
                    users: updatedUsers,
                    unReadCount: unReadBadge
                }
            })
        })

        socket.off("message-delivered")

        socket.on("message-delivered", ({ messageIds }) => {
            set((state) => ({
                messages: state.messages.map((msg) =>
                    messageIds.includes(msg._id)
                        ? { ...msg, status: "delivered" }
                        : msg
                ),
                users: state.users.map((user) =>
                    messageIds.includes(user.lastMessage?._id)
                        ? {
                            ...user,
                            lastMessage: {
                                ...user.lastMessage,
                                status: "delivered"
                            }
                        }
                        : user
                )
            }))
        })

        socket.off("message-read")
        socket.on("message-read", ({ senderId, messageIds }) => {
            set(state => ({
                messages: state.messages.map(msg =>
                    messageIds.includes(msg._id.toString()) ? { ...msg, status: "read" } : msg
                ),

                users: state.users.map(user =>
                    user._id === senderId ? { ...user, lastMessage: user.lastMessage ? { ...user.lastMessage, status: "read" } : user.lastMessage } : user
                ),

                unReadCount: { ...state.unReadCount, [senderId]: 0 }
            }))
        })
    },


    stopListening: () => {
        const { socket } = useAuthStore.getState()
        if (!socket) return
        socket?.off("new-message")
        socket?.off("message-delivered")
        socket?.off("mark-read")
        socket?.off("message-read")
    },

    getMessages: async (userId) => {
        set({ isMessageLoading: true })
        try {
            const res = await api.get(`/messages/${userId}`)
            set({ messages: res.data })
            // console.log("Messages from backend:", res.data);
        } catch (error) {
            console.log('Error while getting messages', error);
            toast.error(error.response?.data?.message)
        }
        finally {
            set({ isMessageLoading: false })
        }
    },

    sendMessages: async (formData) => {
        set({ isUploadingFile: true })
        try {
            const { selectedUsers, messages, users } = get()

            if (!selectedUsers?._id) {
                toast.error("user not selected")
                return
            }
            const res = await api.post(`/messages/send/${selectedUsers._id}`, formData)
            const newMessage = res.data

            set({
                messages: [...messages, newMessage],
                users: users.map(u =>
                    u._id === selectedUsers._id
                        ? { ...u, lastMessage: newMessage }
                        : u
                )
            })
        } catch (error) {
            console.log('Error while sending message', error);
            toast.error(error?.response?.data.message)

        }
        finally {
            set({ isUploadingFile: false })
        }

    },

    setUser: async (user) => {

        set({ selectedUsers: user, isMessageLoading: true, messages: [], unReadCount: { ...state.unReadCount, [user._id]: 0 } });

        try {
            const res = await api.get(`/messages/${user._id}`);
            set({ messages: res.data });

        } catch (error) {
            toast.error(error.response?.data?.message);
        } finally {
            set({ isMessageLoading: false });
        }
    },

    reset: () => {
        set({ messages: [], selectedUsers: null })
    },

    setUserById: (userId) => {
        const { users, getUsers } = get()

        if (!users.length) {
            getUsers().then(() => {
                const user = get().users.find(u => u._id === userId)
                if (user) set({ selectedUsers: user })
            })
        } else {
            const user = users.find(u => u._id === userId)
            if (user) set({ selectedUsers: user })
        }
    }

}))
