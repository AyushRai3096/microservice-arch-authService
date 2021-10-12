const express = require('express');

//import controllers
const userController = require('../Controllers/userController');

const newUserRouter = express.Router();

newUserRouter.post("/authenticate", userController.authenticateUser)

module.exports = newUserRouter;