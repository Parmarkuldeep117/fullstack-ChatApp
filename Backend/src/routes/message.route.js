const express = require("express")
const protectRoute = require("../middleware/auth.middleware.js")
const { getSideUsers, getMessages, sendMessages } = require("../controller/message.controller.js")
const uploadImage = require("../middleware/uploadImage.middleware.js")

const router = express.Router()

router.get("/users", protectRoute, getSideUsers)
router.get("/:id", protectRoute, getMessages)

router.post("/send/:id", protectRoute, uploadImage, sendMessages)

module.exports = router