const userSchema = require('../models/userModel');
const _ = require('lodash') 

exports.getUser = (opts) => {
    var query = {};

    if(_.has(opts, 'userId')) {
        query._id = opts.userId;
    }

    if(_.has(opts, 'emailId')) {
        query.emailId = opts.emailId;
    }
    return userSchema.findOne(query);
}

exports.createUser = (details) => {
    var newUser = new userSchema({ 
        userName: details.userName, 
        password: details.password, 
        emailId: details.emailId 
    });
    
    return newUser.save();
}

