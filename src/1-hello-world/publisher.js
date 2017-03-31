require('dotenv').config();
var amqp = require('amqplib/callback_api');

var credential = `${process.env.USER}:${process.env.PASS}`
var host = `${process.env.HOST}`
var server = `amqp://${credential}@${host}`

//connect to rabbitmq-server
amqp.connect(server, function(error, connection) {
  console.log(error);
  //create channel for sending
  connection.createChannel(function(error, channel) {

    var queue = `${process.env.QUEUE}`;
    var message = 'Hello World!';

    //assert queue by name (hello)
    channel.assertQueue(queue, {durable: false});

    //send a message to queue
    channel.sendToQueue(queue, new Buffer(message));
    console.log(" [x] Sent %s", message);
  });

  //close connection after .5 second
  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
});


