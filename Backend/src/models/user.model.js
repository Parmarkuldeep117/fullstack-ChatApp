const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    profilepic:{
        type:String,
        default:""
    }
},
{timestamps:true},
)

const User = mongoose.model("User",userSchema)
module.exports = User