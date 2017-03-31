require('dotenv').config();
var amqp = require('amqplib/callback_api');

var credential = `${process.env.USER}:${process.env.PASS}`
var host = `${process.env.HOST}`
var server = `amqp://${credential}@${host}`

amqp.connect(server, function(error, connection) {
  connection.createChannel(function(error, channel) {
    var queue = `${process.env.QUEUE}`;
    var message;

    channel.assertQueue(queue, {durable: true});

    for (var i = 0; i <= 100; i++) {
      if (i%2 == 0) {
        message = ' [easy]' + i + ' .';
      } else {
        message = ' [hard]' + i  + ' .....';
      }

      channel.sendToQueue(queue, new Buffer(message), {persistent: true});
      console.log(" [x] Sent %s", message);
    }
  });

  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
});


