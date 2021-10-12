const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdOn: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('User', userSchema);