const User = require("../models/user.model.js")
const Message = require("../models/message.model.js")
const cloudinary = require("../lib/cloudinary.js")
const { usersocketMap, io } = require("../lib/socket.io.js")
const fs = require("fs")

const getSideUsers = async (req, res) => {
    try {
        const loggedinId = req.user._id
        const filteredUser = await User.find({ _id: { $ne: loggedinId } }).select("-password")

        const userWithLastMessage = await Promise.all(filteredUser.map(async (user) => {

            // const unreadCount = await Message.countDocuments({
            //     senderId: user._id,
            //     receiverId: loggedinId,
            //     status: { $ne: "read" }
            // })

            const lastMessage = await Message.findOne({
                $or: [
                    { senderId: loggedinId, receiverId: user._id },
                    { senderId: user._id, receiverId: loggedinId }
                ]
            }).sort({ createdAt: -1 }).lean()

            return {
                ...user.toObject(),
                lastMessage,
                // unreadCount
            }
        }))

        userWithLastMessage.sort((a, b) => {
            if (!a.lastMessage) return 1
            if (!b.lastMessage) return -1
            return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
        })
        res.status(200).json(userWithLastMessage)
    } catch (error) {
        console.log("Error in getSideUsers controller", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}


const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })
            // .populate("senderId", "fullName profilepic")
            // .populate("receiverId", "fullName profilepic")
            .sort({ createdAt: 1 })
            .lean()

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in getMessage controller", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}


const uploadImageToCloud = async (filepath) => {
    const uploadResponse = await cloudinary.uploader.upload(filepath, {
        folder: "chat-images",
        resource_type: "image"
    })
    return {
        url: uploadResponse.secure_url,
    }
}


const uploadVideoToCloud = async (filepath) => {
    const uploadResponse = await cloudinary.uploader.upload(filepath, {
        folder: "chat-videos",
        resource_type: "video"
    })
    return {
        url: uploadResponse.secure_url,
    }
}

const uploadDocumentToCloud = async (filepath) => {
    const uploadResponse = await cloudinary.uploader.upload(filepath, {
        folder: "chat-pdf",
        resource_type: "raw",
    })
    return {
        url: uploadResponse.secure_url,
    }
}

const sendMessages = async (req, res) => {
    try {
        const { text } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user._id
        const file = req.file

        let media;

        if (file) {
            if (file.mimetype.startsWith("image/")) {
                const img = await uploadImageToCloud(file.path)
                media = {
                    url: img.url,
                    filename: file.originalname,
                    size: file.size,
                    type: "image",
                    mimetype: file.mimetype
                }
            }

            if (file.mimetype.startsWith("video/")) {
                const vid = await uploadVideoToCloud(file.path)
                media = {
                    url: vid.url,
                    filename: file.originalname,
                    size: file.size,
                    type: "video",
                    mimetype: file.mimetype
                }
            }

            if (file.mimetype === "application/pdf") {
                const doc = await uploadDocumentToCloud(file.path)
                media = {
                    url: doc.url,
                    filename: file.originalname,
                    size: file.size,
                    type: "pdf",
                    mimetype: file.mimetype
                }
            }
        }

        const receiverSockets = usersocketMap.get(receiverId)
        const status = receiverSockets ? "delivered" : "sent"

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text: text?.trim() || null,
            media,
            status
        })
        if (file) {
            fs.unlinkSync(file.path);
        }

        receiverSockets?.forEach(socketId => {
            io.to(socketId).emit("new-message", newMessage)
        })

        res.status(201).json(newMessage)

    } catch (error) {
        console.log("Error in sendMessages controller", error.message);
        res.status(500).json({ message: "Internal server error" })
    }
}


module.exports = { getSideUsers, getMessages, sendMessages }