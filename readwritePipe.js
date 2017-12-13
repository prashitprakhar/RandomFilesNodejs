var http = require('http');
var fs = require('fs');

module.exports.myReadStream = fs.createReadStream(__dirname+'/readMe.txt', 'utf8');
var myWriteStream = fs.createWriteStream(__dirname+'/writeMe.txt');

//module.exports.writeStreamMyReadStream = myReadStream.pipe(myWriteStream);
