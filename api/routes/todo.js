const express = require('express');
const router = express.Router();
require("dotenv").config();
const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/todo');

router.get("/v1/home", checkAuth,UserController.get_todo);
router.post("/v1/home/create", checkAuth,UserController.create_todo);
router.patch("/v1/home/edit/:todoId", checkAuth,UserController.update_todo);


module.exports = router;