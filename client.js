var net = require('net');
var url = require('url');

var args = process.argv;
var urlServer = args[2];


//arguments 8 --method method --port port# --headers
if(urlServer === undefined){
  console.log('Type out the following format in the command line.');
  console.log('[node] [client.js] [url/host] [--method] [method] [--port] [port] [--headers]');
  console.log('The first argument is running the javascript file through node.');
  console.log('The second argument is the javascript file that you want to run.');
  console.log('The third argument is the url/host that you want to obtain an HTTP response from.');
  console.log('The fourth argument is the CLI option that you would want to use.');
  console.log('CLI options: GET/POST/PUT/DELETE/HEAD/OPTIONS');
} else{
  var socket = new net.Socket();

  socket.connect({ port: 80, host: urlServer}, () => {
    console.log('Connected to server!');
    var dateNow = new Date();
    var UTCDate = dateNow.toUTCString();
    socket.write('GET / HTTP/1.1\n' +
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
    console.log(data.toString());
    socket.end();
  });

  socket.on('end', () => {
    console.log('Disconnected from the server');
  });
}