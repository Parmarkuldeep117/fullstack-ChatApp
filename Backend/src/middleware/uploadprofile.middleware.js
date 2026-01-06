const upload = require("../lib/multer.js")

const uploadProfile = (req, res, next) => {
    upload.single("profilepic")(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message })
        next()
    })

}


module.exports = uploadProfile