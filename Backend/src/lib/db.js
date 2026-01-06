const mongoose = require("mongoose")

const connectDb = async ()=>{
    try {
        const con = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Database connected successfully : ${con.connection.host}`);
    } catch (error) {
        console.log('MongoDb connection error'+ error);
                
    }
}

module.exports = connectDb