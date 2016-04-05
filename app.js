//hey look charts
var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/pdata");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Mongo Connected");
});
//https://jsfiddle.net/api/post/library/pure/ 
var count = 0;

app.get("/",function(req,res){
	res.send("Ayy yo I got your request");
	console.log("Recieved Request "+String(count));
	count++;
})

app.listen(80);
console.log("Server Started");