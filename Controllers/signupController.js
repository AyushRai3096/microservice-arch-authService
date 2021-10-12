const  bcrypt = require('bcryptjs')

exports.signup = (req, res, next) => {
    var password = req.body.password;
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            req.body.password = hashedPassword;
            next()
        })
        .catch(err => {
            next(err);
        })
}