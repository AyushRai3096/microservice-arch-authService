const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const errorMessages = require('../en');
const userService = require('../dbServices/UserService');
const sendMessageToQueue = require('../helpers/sender');

exports.login = (req, res, next) => {
    var emailId = req.body.emailId;
    var password = req.body.password;
    var fetchedUser;
    var userPassword; //password saved in db
    
    userService.getUser({ emailId })
        .then(user => {
            if (!user) {
                const error = new Error(errorMessages.LOGIN_USER_NOT_FOUND);
                error.statusCode = 404;
                error.message = errorMessages.LOGIN_USER_NOT_FOUND;
                next(error);
            } else {
                fetchedUser = user;
                userPassword = user.password;
                return bcrypt.compare(password, userPassword)
            }
        })
        .then(isPasswordCorrect => {
            if (isPasswordCorrect == false) {
                const error = new Error(errorMessages.LOGIN_INCORRECT_PASSWORD);
                error.statusCode = 403;
                error.message = errorMessages.LOGIN_INCORRECT_PASSWORD;
                next(error);
            } else if(isPasswordCorrect) {
                //generate a jwt token
                const token = jwt.sign({
                    emailId: fetchedUser.emailId,
                    userId: fetchedUser._id
                }, "SecretKey");
                sendMessageToQueue(`User ${fetchedUser.emailId} is logged in`)
                res.send({
                    status: "Login success",
                    token,
                    userId: fetchedUser._id
                });
            }
        })
        .catch(err => {
            next(err);
        });
}