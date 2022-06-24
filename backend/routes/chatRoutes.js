const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authMiddlware');
const {accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup} = require("../controllers/chatControllers");

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").patch(protect, renameGroup);
router.route("/groupadd").patch(protect, addToGroup);
router.route("/groupremove").patch(protect, removeFromGroup);


module.exports = router;