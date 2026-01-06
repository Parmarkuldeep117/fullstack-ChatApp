const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    text: {
        type: String,
        trim: true,
    },

    media: {
        url: String,
        filename: String,
        type: {
            type: String,
            enum: ["image", "video", "pdf"],
            required: false,
        },
        mimetype: String,
        size: Number
    },

    status: {
        type: String,
        enum: ["sent", "delivered", "read"],
        default: "sent"
    }
},
    { timestamps: true }
)


messageSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret._id = ret._id.toString()
        ret.senderId = ret.senderId.toString()
        ret.receiverId = ret.receiverId.toString()
        return ret
    }
})

const Message = mongoose.model("Message", messageSchema)

module.exports = Message