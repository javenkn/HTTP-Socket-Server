var net = require('net');
var url = require('url');

var args = process.argv;
var urlServer = args[2].split('/')[0];
var path = args[2].split('/')[1];
var methodToUse;
var portToUse;

if(args.length === 3 || args.length === 4 ) {
  methodToUse = 'GET';
  portToUse = 80;
}else if(args.length === 5 || args.length === 6) {
  if(typeof parseInt(args[4]) === 'number') {
    methodToUse = 'GET';
    portToUse = args[4];
  }else{
    methodToUse = args[4].toUpperCase();
    portToUse = 80;
  }
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
    socket.write(methodToUse + ' /' + path + ' HTTP/1.1\n' +
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
    var dataContent = data.toString().split('\n');
    var statusCode = dataContent[0].slice(9,11);
    if(statusCode === '40') {
      console.log('There is a client error.');
    }else if(statusCode === '50') {
      console.log('There is a server error.');
    }

    if(args[7] === '--headers' || args[5] === '--headers'){
      if(methodToUse === 'HEAD'){
        console.log(data.toString());
      }else{
        var headerBodySeperator = [];
        headerBodySeperator.push(dataContent.indexOf('\r'));
        console.log(dataContent.slice(0, headerBodySeperator[0]).join('\n'));
      }
    }else{
      console.log(data.toString());
    }
    socket.end();
  });

  socket.on('error', (error) => {
    if(error.code === 'ENOTFOUND'){ // Handle the case where the host can not be reached
      console.log('This host cannot be reached.');
    }else if(error.code === 'ECONNREFUSED'){
      // Handle the case where the host is found, and not listening on port 80
      console.log('Host is found but not listening on port 80.');
    }
  });

  socket.on('end', () => {
    console.log('Disconnected from the server');
  });
}