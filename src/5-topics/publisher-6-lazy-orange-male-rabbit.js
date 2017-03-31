require('dotenv').config();
var amqp = require('amqplib/callback_api');

var credential = `${process.env.USER}:${process.env.PASS}`
var host = `${process.env.HOST}`
var server = `amqp://${credential}@${host}`

amqp.connect(server, function(error, connection) {
  connection.createChannel(function(error, channel) {
    var exchange = `${process.env.EXCHANGE}`;
    var topics = 'lazy.orange.male.rabbit';
    var message = 'I am lazy Orange Male Rabbit';

    //create exchange type "topic"
    channel.assertExchange(exchange, 'topic', {durable: false});

    //publish to exchange with specific queue (2nd param)
    channel.publish(exchange, topics, new Buffer(message));
    console.log(" [x] Sent %s: '%s'", topics, message);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
});


