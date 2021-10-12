const express = require('express')

//import controllers
const loginController = require('../Controllers/loginController');

const loginRouter = express.Router();

loginRouter.post("/", loginController.login)

module.exports = loginRouter;