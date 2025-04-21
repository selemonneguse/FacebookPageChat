var express = require('express');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
var router = express.Router();
const mainController = require("../controllers/main");

// יצירת תיקיית 'uploads' אם לא קיימת
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// הגדרת Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = Date.now() + ext;
        cb(null, filename);
    },
});

const upload = multer({ storage });

router.post("/", mainController.handleChatRequest);

router.get("/postToFacebook", mainController.handlePostToFacebook);

router.post("/upload", upload.single("image"), mainController.handleUploadImage);


module.exports = router;