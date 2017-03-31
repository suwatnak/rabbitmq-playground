require('dotenv').config();
var amqp = require('amqplib/callback_api');

var credential = `${process.env.USER}:${process.env.PASS}`
var host = `${process.env.HOST}`
var server = `amqp://${credential}@${host}`

amqp.connect(server, function(error, connection) {
  connection.createChannel(function(error, channel) {
    var exchange = `${process.env.EXCHANGE}`;
    var args = process.argv.slice(2);
    var message = 'Something went wrong!';
    var routingKey = 'error';

    //create exchange type "direct"
    channel.assertExchange(exchange, 'direct', {durable: false});

    //publish to exchange with specific queue (2nd param)
    //it means send direct to routingKey
    channel.publish(exchange, routingKey, new Buffer(message));
    console.log(" [x] Sent %s: '%s'", routingKey, message);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
});


