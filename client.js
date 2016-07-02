var net = require('net');
var url = require('url');

var args = process.argv;
var urlServer = args[2];
var methodToUse = args[4].toUpperCase();
var portToUse = args[6];

if(portToUse === undefined){
  portToUse = 80;
}

//arguments 8 --method method --port port# --headers
if(urlServer === undefined){
  console.log('Type out the following format in the command line.');
  console.log('[node] [client.js] [url/host] [--method] [method] [--port] [port] [--headers]');
} else{
  var socket = new net.Socket();

  socket.connect({ port: portToUse, host: urlServer}, () => {
    console.log('Connected to server!');
    var dateNow = new Date();
    var UTCDate = dateNow.toUTCString();
    socket.write(methodToUse + ' / HTTP/1.1\n' +
                 'Host: ' + urlServer + '\n' +
                 'Connection: close\n' +
                 'Accept: text/html, application/json\n' +
                 'User-Agent: http-client/0.1\n' +
                 'Date: ' + UTCDate + '\n\n');
  });

  socket.on('connect', () => {
    console.log('Connected!');
  });

  socket.on('data', (data) => {
    if(args[7] === '--headers'){
      var dataContent = data.toString().split('\n');
      var headerBodySeperator = [];
      headerBodySeperator.push(dataContent.indexOf('\r'));
      console.log(dataContent.slice(0, headerBodySeperator[0]).join('\n'));
    }else{
      console.log(data.toString());
    }
    socket.end();
  });

  socket.on('end', () => {
    console.log('Disconnected from the server');
  });
}