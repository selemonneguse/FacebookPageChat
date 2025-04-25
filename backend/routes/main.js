var express = require('express');
const multer = require("multer");
const path = require("path");
const fs = require("fs");
var router = express.Router();
const mainController = require("../controllers/main");

const storage = multer.memoryStorage();

const upload = multer({ storage });

router.post("/", mainController.handleChatRequest);

router.get("/postToFacebook", mainController.handlePostToFacebook);

router.post("/upload", upload.single("image"), mainController.handleUploadImage);

router.post("/uploadPhotoToFacebook", mainController.uploadPhotoToFacebook);


module.exports = router;