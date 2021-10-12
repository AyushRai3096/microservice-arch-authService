const jwt = require("jsonwebtoken");
const userService = require('../dbServices/UserService');
const mailService = require('../helpers/mailer');
const errorMessages = require('../en');
const sendMessageToQueue = require('../helpers/sender');

exports.createNewUser = (req, res, next) => {
    var userName = req.body.userName;
    var password = req.body.password;
    var emailId = req.body.emailId;

    //first check if email id already exists
    userService.getUser({ emailId })
        .then(user => {
            if (user) {
                const error = new Error(errorMessages.SIGNUP_USER_EXISTS);
                error.statusCode = 409;
                next(error);
            } else {
                return userService.createUser({
                    userName, 
                    password, 
                    emailId
                });
            }
        })
        .then((createdUser) => {
            if (!createdUser) {
                next(createdUser)
            } else {
                //send email to new user
                var to = createdUser.emailId;
                var details = {
                    subject: "New Signup",
                    body: "Hi, You have been successfully signed up"
                }
                mailService(to, details);
                sendMessageToQueue(`New user ${createdUser.emailId} signed up`)
                res.send(createdUser);
            }
        })
        .catch((err) => {
            next(err);
        });
}

exports.getUserById = (req, res, next) => {
    var userId = req.params.id;

    userService.getUser({ userId })
        .then((user) => {
            if(!user) {
                const error = new Error(errorMessages.USER_NOT_FOUND);
                error.statusCode = 404;
                next(error);
            }
            res.send(user)
        }).catch((err) => {
            next(err);
        });
}

exports.authenticateUser = (req, res, next) => {
    const authHeader = req.get('authorization');
    if(!authHeader) {
        var error = new Error('No auth token attached');
        error.message = "No auth token attached"
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(" ")[1];
    var decodedToken;
    try {
        decodedToken = jwt.verify(token, "SecretKey");
    } catch (error) {
        error.statusCode = 500;
        throw error;
    }

    if(!decodedToken) {
        const error = new Error(errorMessages.USER_UNAUTHORIZED);
        error.statusCode = 401;
        throw error;
    } else {
        //token validated, fetch the user
        userService.getUser({ userId: decodedToken.userId })
        .then((user) => {
            if(!user) {
                const error = new Error(errorMessages.USER_NOT_FOUND);
                error.statusCode = 404;
                next(error);
            }
            else {
                res.send(user);
            }
        }).catch((err) => {
            next(err);
        });
    }
}