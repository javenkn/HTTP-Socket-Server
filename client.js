var net = require('net');
var url = require('url');

var args = process.argv;
var urlServer = args[2];
var methodToUse;
var portToUse;

if(args.length === 3 || args.length === 4 ) {
  methodToUse = 'GET';
  portToUse = 80;
}else if(args.length === 5 || args.length === 6) {
  methodToUse = args[4].toUpperCase();
  portToUse = 80;
}else if(args.length === 7 || args.length === 8) {
  methodToUse = args[4].toUpperCase();
  portToUse = args[6];
}

//arguments 8 --method method --port port# --headers
if(urlServer === undefined || args.indexOf('--help') !== -1){
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
    if(urlServer === 'localhost' && methodToUse === 'HEAD'){
      var headDataContent = data.toString().split('\n');
      console.log(headDataContent.slice(0, 4).join('\n'));
    }else if(args[7] === '--headers' || args[5] === '--headers'){
      if(urlServer === 'localhost'){
        var localDataContent = data.toString().split('\n');
        console.log(localDataContent.slice(0, 4).join('\n'));
      }else{
        var dataContent = data.toString().split('\n');
        var headerBodySeperator = [];
        headerBodySeperator.push(dataContent.indexOf('\r'));
        console.log(dataContent.slice(0, headerBodySeperator[0]).join('\n'));
      }
    }else{
      console.log(data.toString());
    }
    socket.end();
  });

  socket.on('error', () => {
    console.log('This host cannot be reached.');
  });

  socket.on('end', () => {
    console.log('Disconnected from the server');
  });
}