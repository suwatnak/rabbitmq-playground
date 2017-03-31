require('dotenv').config();
var amqp = require('amqplib/callback_api')

var credential = `${process.env.USER}:${process.env.PASS}`
var host = `${process.env.HOST}`
var server = `amqp://${credential}@${host}`

amqp.connect(server, function(error, connection) {
  connection.createChannel(function(error, channel) {
    var exchange = `${process.env.EXCHANGE}`;

    channel.assertExchange(exchange, 'fanout', {durable: false});

    //create non-durable queue with generated name
    //when the connection close, queue dies as exclusive
    channel.assertQueue('', {exclusive: true}, function(error, queue) {
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

      //bind queue's name to exchange
      channel.bindQueue(queue.queue, exchange, '');

      channel.consume(queue.queue , function(message) {
        console.log(" [x] %s", message.content.toString());
      }, {noAck: true});
    })
  });
});
