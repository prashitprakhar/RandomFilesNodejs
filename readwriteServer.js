var http = require('http');
var fs = require('fs');
var readwritePipe = require('./readwritePipe');

var server = http.createServer(function(req, res){
  res.writeHead(200, {'Content-Type' : 'text/plain'});
  //res.end(readwritePipe.writeStreamMyReadStream);
  readwritePipe.myReadStream.pipe(res);
});

server.listen(3000, '127.0.0.1');

console.log("Listening to Port 3000 on the Localhost");
