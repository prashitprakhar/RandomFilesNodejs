var http = require('http');

var server = http.createServer(function(req, res){
  console.log("Url that made request is "+req.url);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("I am the response afternodemon is running");
});

//server.listen(3000, '127.0.0.1');
server.listen(3001, '127.0.0.1');
console.log("Listening to port "+3001);
