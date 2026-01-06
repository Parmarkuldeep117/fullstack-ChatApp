const express = require("express")
const { signup, login, logout, profileUpdate, checkAuth } = require("../controller/auth.controller.js")
const protectRoute = require("../middleware/auth.middleware.js")
const uploadProfile = require("../middleware/uploadprofile.middleware.js")

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.put("/update-profile", protectRoute, uploadProfile, profileUpdate)

router.get("/check", protectRoute, checkAuth)

module.exports = router