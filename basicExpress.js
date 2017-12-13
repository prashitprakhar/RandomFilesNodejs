var express = require('express');

var app = express();

app.get('/', function(req, res){
res.send('I am home page');
});

app.get('/contact', function(req, res){
  res.send('I am Contact page');
});

app.get('/profile/:name', function(req,res){
  res.send("you requested aprofile for the name : "+req.params.name);
})


app.listen(3002);
