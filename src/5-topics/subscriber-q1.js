require('dotenv').config();
var amqp = require('amqplib/callback_api')

var credential = `${process.env.USER}:${process.env.PASS}`
var host = `${process.env.HOST}`
var server = `amqp://${credential}@${host}`

amqp.connect(server, function(error, connection) {
  connection.createChannel(function(error, channel) {
    var exchange = `${process.env.EXCHANGE}`;

    channel.assertExchange(exchange, 'topic', {durable: false});

    //create non-durable queue with generated name
    //when the connection close, queue dies as exclusive
    channel.assertQueue('', {exclusive: true}, function(error, queue) {
      console.log(" [*] Waiting for messages in *.orange.*");

      //bind for an orange animal
      channel.bindQueue(queue.queue, exchange, '*.orange.*');

      channel.consume(queue.queue, function(mesaage) {
        console.log(" [x] %s: '%s'", mesaage.fields.routingKey, mesaage.content.toString());
      }, {noAck: true});
    })
  });
});
