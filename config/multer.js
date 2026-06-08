const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary.js');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Reside_Avenue",   
        allowed_formats: ["jpg", "png", "jpeg", "webp"]
    }
});
const upload = multer({storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB in bytes
    }
});

module.exports = upload;