var amqp = require('amqplib/callback_api');

const sendMessageToQueue = (message) => {
    amqp.connect('amqp://localhost', function(error0, connection) {
        if (error0) {
            throw error0;
        }
        //create channel
        connection.createChannel(function(error1, channel) {
            if (error1) {
            throw error1;
            }
            var queue = 'user-messages';

            channel.assertQueue(queue, {
            durable: false
            });

            //send message to queue
            channel.sendToQueue(queue, Buffer.from(message));
            console.log(" [x] Sent %s", message);
        });
    });
}

module.exports = sendMessageToQueue;
