var net = require('net');
var url = require('url');

var args = process.argv;
var urlServer = args[2];

var socket = new net.Socket();

socket.connect({ port: 80, host: urlServer}, () => {
  console.log('Connected to server!');
  var dateNow = new Date();
  var UTCDate = dateNow.toUTCString();
  socket.write('GET / HTTP/1.1\n' +
               'Host: ' + urlServer + ':80\n' +
               'Connection: close\n' +
               'Accept: text/html, application/json\n' +
               'User-Agent: http-client/0.1\n' +
               'Date: ' + UTCDate + '\n\n');
});

socket.on('connect', () => {
  console.log('Connected!');
});

socket.on('data', (data) => {
  console.log(data.toString());
  socket.end();
});

socket.on('end', () => {
  console.log('Disconnected from the server');
});