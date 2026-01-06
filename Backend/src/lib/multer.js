const multer = require("multer")

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const date = Date.now()
        const name = file.originalname
        cb(null, `${date}-${name}`)
    }
})


const fileFilter = (req, file, cb) => {

    const allowedImageTypes = [
        "image/jpg",
        "image/png",
        "image/jpeg",
        "image/webp"
    ]

    const allowedVideoTypes = [
        "video/mp4",
        "video/webm",
        "video/quicktime",
        "video/ogg"
    ]

    const allowedDocument = [
        "application/pdf"
    ]

    if(allowedImageTypes.includes(file.mimetype) ||
        allowedVideoTypes.includes(file.mimetype) ||
        allowedDocument.includes(file.mimetype)
    ){
        cb(null, true)
    }
    else{
        cb(new Error("Only supported documents, images, videos are allowed"),false)
    }
}


const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 }
})


module.exports = upload