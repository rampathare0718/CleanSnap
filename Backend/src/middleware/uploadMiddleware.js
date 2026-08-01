const multer = require("multer");
const path = require("path");

// ======================================
// Storage Configuration
// ======================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1E9);

        cb(null, uniqueName + path.extname(file.originalname));
    }
});

// ======================================
// File Filter
// ======================================
const fileFilter = (req, file, cb) => {

    console.log("================================");
    console.log("Original Name :", file.originalname);
    console.log("Mime Type     :", file.mimetype);
    console.log("Extension     :", path.extname(file.originalname));

    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png"
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {

        console.log("✅ Image Accepted");

        cb(null, true);

    } else {

        console.log("❌ Image Rejected");

        cb(
            new Error(
                `Only JPG, JPEG and PNG images are allowed. Received: ${file.mimetype}`
            )
        );

    }
};

// ======================================
// Upload Configuration
// ======================================
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    },
    fileFilter
});

module.exports = upload;