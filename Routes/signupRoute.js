const express = require('express')

//import controllers
const signupController = require('../Controllers/signupController');
const userController = require('../Controllers/userController');

const signupRouter = express.Router();

signupRouter.post("/", signupController.signup, userController.createNewUser)

module.exports = signupRouter;