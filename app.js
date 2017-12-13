//var stuff = require('./stuff');
var events = require('events');
var time = 0;
var timer = setInterval(function(){
  time +=2;
  console.log(time+' seconds have passed');
  if(time >5)
    clearInterval(timer);
}, 2000);

/*
console.log(__dirname);
console.log(__filename);

console.log(stuff.counter([2,5,4,7]));
console.log(stuff.summ(4,5));

*/
/*
//Creating a EventEmitter Object
var myEventEmitter = new events.EventEmitter;

myEventEmitter.on('messageEvent', function(msg){
  console.log(msg);
});

myEventEmitter.emit('messageEvent', 'Message Event got Emitted');
*/
