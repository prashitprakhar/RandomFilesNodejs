var fs = require('fs');

var data = fs.readFile('readMe.txt', 'utf8', function(err, data){

  fs.writeFile('writeMe.txt', data, function(err, data){
    console.log("Written data : "+fs.readFileSync('writeMe.txt', 'utf8'));
  });

});
/*
fs.writeFileSync('readMe.txt', data);
  console.log("Data Written");

var writtenData = fs.readFileSync('readMe.txt', 'utf8');
console.log("Data after Write : "+data);
*/
