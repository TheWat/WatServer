var express = require('express');

var app = express();

var count = 0;

app.get("/",function(req,res){
	res.send("Ayy yo I got your request");
	console.log("Recieved Request "+String(count));
	count++;
})

app.listen(80);
console.log("Server Started");