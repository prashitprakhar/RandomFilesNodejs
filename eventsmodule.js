var events = require('events');
var utils = require('util');

var Person = function(name){
  this.name = name;
};

utils.inherits(Person, events.EventEmitter);

var tauqueer = new Person('Tauqueer');
var prashit = new Person('Prashit');
var akash = new Person('Akash');

var people = [tauqueer, prashit, akash];


people.forEach(function(person){
  person.on('speak', function(msg){
    console.log(person.name+" said the message : "+msg);
  });
});

prashit.emit('speak', 'Prashit also came');
tauqueer.emit('speak', 'Tauqueer here');
