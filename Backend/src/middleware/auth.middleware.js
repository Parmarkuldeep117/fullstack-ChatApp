const jwt = require("jsonwebtoken")
const User = require("../models/user.model.js")

const protectRoute = async(req, res, next) =>{
    const token = req.cookies.jwt
    try {
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(401).json({message:"User Not Found"})
        }

        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid or Expired Token " })
    }
}

module.exports = protectRoute