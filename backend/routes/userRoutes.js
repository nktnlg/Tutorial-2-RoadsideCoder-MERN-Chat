const express = require('express');
const router = express.Router();
const {registerUser, authUser, allUsers} = require("../controllers/userControllers");
const {protect} = require('../middleware/authMiddlware')

router.route('/').post(registerUser).get(protect, allUsers)
router.post('/login', authUser)

module.exports = router;