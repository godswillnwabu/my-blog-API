//import User controller
const userController = require("./../controllers/userController")

//import authetication middleware
const authController = require('./../auth/authUsers')

//create router
const express = require('express');
const router = express.Router();

//API endpoint structure for an author
router.get("/author", authController.authenticate, userController.getAllPosts)

router.post("/auth/signup", authController.signup)

router.post("/auth/login", authController.login)


module.exports = router;