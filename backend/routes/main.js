var express = require('express');
var router = express.Router();
const mainController = require("../controllers/main");

router.post("/", mainController.handleChatRequest);

router.get("/postToFacebook", mainController.handlePostToFacebook);

module.exports = router;