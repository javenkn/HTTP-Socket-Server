var net = require('net');
var fs = require('fs');

var CONFIG = require('./config');

var server = net.createServer(function (socket) { //readable socket
  // connection listener
  console.log('Somebody connected!');
  socket.on('data', (data) => {
    var dateNow = new Date();
    var UTCDate = dateNow.toUTCString();

    var requestMethod = data.toString().split('\n')[0];
    var httpVers = requestMethod.slice(-9).trim();
    var path = requestMethod.split(' ')[1].slice(1);
    if(path === ''){
      path = 'index.html';
    }
    fs.exists(path, function (exists) {
      if (exists) {
        var statusLine = ' 200 OK';
        fs.stat(path, function (error, stats) {
          if (error) throw error;
            fs.open(path, 'r', function (error, fileData) {
              if(error) throw error;
              var buffer = new Buffer(stats.size);
              fs.read(fileData, buffer, 0, buffer.length, null, function (error, bytesRead, buffer) {
                if(error) throw error;
                var htmlData = buffer.toString('utf8', 0, buffer.length);
                socket.write(httpVers + statusLine  + '\r\n' +
                                 'Date: ' + UTCDate + '\r\n' +
                                 'Server: localhost' + '\r\n' +
                                 'Content-Length: ' + bytesRead + '\n\r\n' +
                                 htmlData
                                 );

                socket.end();
              });
            });
        });
      }else{
        var errorStatusLine = ' 404 Not Found';
        path = '404.html';
        fs.stat(path, function (error, stats) {
          if (error) throw error;
            fs.open(path, 'r', function (error, fileData) {
              if(error) throw error;
              var buffer = new Buffer(stats.size);
              fs.read(fileData, buffer, 0, buffer.length, null, function (error, bytesRead, buffer) {
                if(error) throw error;
                var htmlData = buffer.toString('utf8', 0, buffer.length);
                socket.write(httpVers + errorStatusLine  + '\n' +
                                 'Date: ' + UTCDate + '\n' +
                                 'Server: localhost' + '\n' +
                                 'Content-Length: ' + bytesRead + '\n\n' +
                                 htmlData
                                 );


                socket.end();
              });
            });
        });
      }
    });
  });

});

server.listen(CONFIG.PORT, () => {
  var PORT = server.address().port;
  console.log('Listening on port', PORT);
});

server.on('error', function (error) {
  console.error(error);
});