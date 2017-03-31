require('dotenv').config();
var amqp = require('amqplib/callback_api');

var credential = `${process.env.USER}:${process.env.PASS}`
var host = `${process.env.HOST}`
var server = `amqp://${credential}@${host}`

amqp.connect(server, function(error, connection) {
  connection.createChannel(function(error, channel) {
    //change variable queue to exchange
    var exchange = `${process.env.EXCHANGE}`;
    var message = "This is broadcasting to all service!";

    //create exchange type "fanout" (broadcast)
    channel.assertExchange(exchange, 'fanout', {durable: false});

    //publish to exchange without specific queue (2nd param)
    //it means broadcast to every queues
    channel.publish(exchange, '', new Buffer(message));
    console.log(" [x] Sent %s", message);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
});


