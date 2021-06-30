const express = require('express');
const router = express.Router();
require("dotenv").config();
const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/users');

router.post("/v1/register", UserController.user_register);
router.post("/v1/login", UserController.user_login);
router.get("/v1/home/profile", UserController.user_profile);
// router.post("/v1/home/logout/:userId", checkAuth, UserController.user_logout);


module.exports = router;