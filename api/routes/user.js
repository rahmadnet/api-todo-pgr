const express = require('express');
const router = express.Router();
require("dotenv").config();
const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/users');

router.post("/v1/register", UserController.user_register);
router.post("/v1/login", UserController.user_login);



module.exports = router;