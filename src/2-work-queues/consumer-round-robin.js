require('dotenv').config();
var amqp = require('amqplib/callback_api')

var credential = `${process.env.USER}:${process.env.PASS}`
var host = `${process.env.HOST}`
var server = `amqp://${credential}@${host}`

amqp.connect(server, function(error, connection) {
  connection.createChannel(function(error, channel) {
    var queue = `${process.env.QUEUE}`;

    channel.assertQueue(queue, {durable: true});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

    channel.consume(queue, function(message) {
      var secs = message.content.toString().split('.').length - 1;
      console.log(" [x] Received %s", message.content.toString());

      setTimeout(function() {
        console.log(" [x] Done in %s second(s)", secs);
        channel.ack(message); //send Ack
      }, secs * 1000);
    }, {noAck: false});
  });
});
