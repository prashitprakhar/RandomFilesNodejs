var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use('/assets', express.static('stuff'));
var urlEncodedParser = bodyParser.urlencoded({extended: false});
//http.createServer() --- no need of this as expess already knows it.. We need to only listen with app

var data = {
  age: 27,
  job: 'Employee',
  address: 'India',
  phone: 7022456968,
  hobbies: ['Eating', 'Fighting', 'Gym']
}

//To use ejs Engine, we need to tell node.js that we are going to use view with EJS module
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('index');
});

app.get('/profile/:name', function(req, res){
  res.render('profile', {person: req.params.name, data: data});
});

app.get('/input', function(req, res){

  res.render('input');
});

app.post('/contact-info', urlEncodedParser, function(req, res){
  console.log(req.body);
  res.render('contact-info', {data: req.body});
});

app.listen(3003);
console.log('Listening to port 3003');
