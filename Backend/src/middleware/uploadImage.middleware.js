const upload = require("../lib/multer.js")

const uploadImage = (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message })
        next()
    })

}


module.exports = uploadImage