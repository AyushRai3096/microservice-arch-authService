var nodemailer = require('nodemailer');
var appConfigs = require('../app-config');
var Promise = require('bluebird');
const sendMessageToQueue = require('../helpers/sender');

const sendEmail = (to, details) => {
    var transporter = nodemailer.createTransport({
        service: appConfigs.domainEmailService,
        auth: {
          user: appConfigs.domainEmail,
          pass: appConfigs.domainEmailPass
        }
    });

    var mailOptions = {
        from: appConfigs.domainEmail,
        to,
        subject: details.subject,
        text: details.body
    };
      
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            sendMessageToQueue(`Error in sending e-mail to ${to}`);
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendEmail;
