require('dotenv').config();
var amqp = require('amqplib/callback_api');

var credential = `${process.env.USER}:${process.env.PASS}`
var host = `${process.env.HOST}`
var server = `amqp://${credential}@${host}`

amqp.connect(server, function(error, connection) {
  connection.createChannel(function(error, channel) {
    var queue = `${process.env.QUEUE}`;

    //get second argument value or it is Hello World!
    var message = process.argv.slice(2).join(' ') || "Hello World!";

    //set queue to durable
    //set message to persistent
    channel.assertQueue(queue, {durable: true});
    channel.sendToQueue(queue, new Buffer(message), {persistent: true});
    console.log(" [x] Sent %s", message);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
});


