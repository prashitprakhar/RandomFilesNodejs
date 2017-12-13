var http = require('http');

var server = http.createServer(function(req, res){
  console.log('URL that asked for the information is '+req.url);
  res.writeHead(200, {'Content-Type': 'application/json'});
  var myObj = {
    name: 'Rahul',
    age: 23,
    location: 'India'
  };
  res.end(JSON.stringify(myObj));
});

server.listen(3000, '127.0.0.1');
console.log('Listening to port 3000');
