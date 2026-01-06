const jwt = require("jsonwebtoken")

const generateToken = (email,userId,res)=>{
    const token = jwt.sign(
        {email,userId},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    )
    res.cookie("jwt",token,{
        maxAge: 7*1000*60*60*24,
        httpOnly:true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
    })
    return token
}

module.exports = generateToken