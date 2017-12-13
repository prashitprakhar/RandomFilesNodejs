var http = require('http');
var fs = require('fs');

var myReadStream = fs.createReadStream(__dirname+'/readMe.txt');
var myWriteStream = fs.createWriteStream(__dirname+'/writeMe.txt');

myReadStream.on('data', function(chunk){
  console.log('Read chunk of data');
  myWriteStream.write(chunk);
});
