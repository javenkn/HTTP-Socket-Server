var net = require('net');
var fs = require('fs');

var CONFIG = require('./config');

var htmlFiles = [];

var server = net.createServer(function (socket) { //readable socket
  // connection listener
  console.log('Somebody connected!');
  socket.on('data', (data) => {
    var dateNow = new Date();
    var UTCDate = dateNow.toUTCString();

    var requestMethod = data.toString().split('\n')[0];
    var path = requestMethod.split(' ')[1];
    socket.write('\n' + requestMethod.slice(6) + '\n' +
                   'Date: ' + UTCDate + '\n' +
                   'Server: localhost' + '\n');
  });
});

server.listen(CONFIG.PORT, () => {
  var PORT = server.address().port;
  console.log('Listening on port', PORT);
});

server.on('error', function (error) {
  console.error(error);
});