const http = require("http")
const { Server } = require("socket.io")
const express = require("express")
const Message = require("../models/message.model")

const app = express()
const server = new http.createServer(app)


const usersocketMap = new Map()

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    }
})
io.on("connection", async (socket) => {
    const userId = socket.handshake.auth.userId
    if (!userId) return

    if (!usersocketMap.has(userId)) {
        usersocketMap.set(userId, new Set())
    }
    usersocketMap.get(userId).add(socket.id)

    io.emit("online-users", Array.from(usersocketMap.keys()))

    const undelivered = await Message.find({
        receiverId: userId,
        status: "sent"
    })

    const messageIds = undelivered.map(m => m._id)

    await Message.updateMany(
        { _id: { $in: messageIds } },
        { $set: { status: "delivered" } }
    )

    undelivered.forEach(msg => {
        const senderSockets = usersocketMap.get(msg.senderId.toString())
        senderSockets?.forEach(socketId => {
            io.to(socketId).emit("message-delivered", {
                messageIds: [msg._id.toString()]
            })
        })
    })


    socket.on("mark-read", async ({ senderId }) => {
        try {
            const messages = await Message.find({
                senderId,
                receiverId: userId,
                status: { $ne: "read" }
            }).select("_id")

            if (messages.length === 0) return
            const messageIds = messages.map(m => m._id.toString())
            await Message.updateMany(
                {
                    _id: { $in: messageIds }
                }
                ,
                { $set: { status: "read" } }
            )

            const senderSocket = usersocketMap.get(senderId)
            senderSocket?.forEach((socketId) => {
                io.to(socketId).emit("message-read", {
                    messageIds
                })
            })

        } catch (error) {
            console.log("Error making messages as read", error.message)
        }
    })

    socket.on("disconnect", () => {
        const sockets = usersocketMap.get(userId)
        sockets?.delete(socket.id)
        if (sockets?.size === 0) usersocketMap.delete(userId)
        io.emit("online-users", Array.from(usersocketMap.keys()))
    })
})



module.exports = { io, app, server, usersocketMap }

