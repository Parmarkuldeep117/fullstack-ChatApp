require("dotenv").config()
const { app, server } = require("./lib/socket.io.js")
const express = require("express")
const cors = require("cors")
const path = require("path")
const cookieParser = require("cookie-parser")
const userRoute = require("./routes/auth.route.js")
const messageRoute = require("./routes/message.route.js")
const connectDb = require("./lib/db.js")
const port = process.env.PORT


app.use(express.json({ limit: "5mb" }))
app.use(express.urlencoded({ extended: true, limit: "5mb" }))
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))


app.use("/api/auth", userRoute)
app.use("/api/messages", messageRoute)

if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "../../Frontend/dist");

    app.use(express.static(frontendPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}


server.listen(port, async () => {
    await connectDb()
    console.log(`server running on http://localhost:${port}`)
})

