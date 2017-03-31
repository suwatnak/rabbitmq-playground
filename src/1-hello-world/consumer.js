require('dotenv').config();
var amqp = require('amqplib/callback_api')

var credential = `${process.env.USER}:${process.env.PASS}`
var host = `${process.env.HOST}`
var server = `amqp://${credential}@${host}`

//connect to rabbitmq-server
amqp.connect(server, function(error, connection) {
  //create channel for listening
  connection.createChannel(function(error, channel) {

    var queue = `${process.env.QUEUE}`;

    //aseert queue by name (hello)
    //because we may start consumer before publisher
    channel.assertQueue(queue, {durable: false});

    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    //consume message in queue without ack
    channel.consume(queue, function(message) {
      console.log(" [x] Received %s", message.content.toString());
    }, {noAck: true});
  });
});
