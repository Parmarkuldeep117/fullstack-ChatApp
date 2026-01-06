const User = require("../models/user.model.js")
const bcrypt = require("bcrypt")
const generateToken = require("../lib/utils.js")
const cloudinary = require("../lib/cloudinary.js")
const fs = require("fs")


const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body
        if (!email || !fullName || !password) {
            return res.status(400).json({ message: "All fields required" });
        }
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({ message: "Email address already in use" })
        }
        const hashed = await bcrypt.hash(password, 10)
        const user = await User.create({
            email,
            fullName,
            password: hashed
        })
        generateToken(user.email, user._id, res)
        res.status(200).json({
            success: true,
            fullName: user.fullName,
            _id: user._id,
            email: user.email,
            profilepic: user.profilepic
        })
    } catch (error) {
        console.log("Error in signup controller", error.message);
        return res.status(500).json({ message: "Error signing up ❌" })
    }
}


const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(400).json({ message: "Invalid password" })
        }

        generateToken(user.email, user._id, res)
        res.status(200).json({
            success: true,
            fullName: user.fullName,
            _id: user._id,
            email: user.email,
            profilepic: user.profilepic
        })
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Login Error ❌", error: error.message })
    }

}


const logout = (req, res) => {
    res.clearCookie("jwt")
    res.status(200).json({ message: "Logout successful ✔️" })
}


const profileUpdate = async (req, res) => {
    try {
        const userId = req.user._id
        if (!req.file) {
            return res.status(400).json({ message: "Profile image is required" })
        }
        const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
            folder: "avatars",
            allowed_formats: ["jpg", "png", "jpeg"]
        })
        fs.unlinkSync(req.file.path);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilepic: uploadResponse.secure_url }, { new: true }).select("-password")
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json({
            message: "Profile update failed",
            error: error.message
        })
    }

}


const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal server Error" })
    }
}

module.exports = { signup, login, logout, checkAuth, profileUpdate }