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
var dSchema = mongoose.Schema({
	id: Number
	,clienttime: Number
	,serverTime: Number
	,power: Number
	,current: Number
	,voltage: Number
});
var Snapshot = mongoose.model('Snapshot',dSchema);

//https://jsfiddle.net/api/post/library/pure/ 
var count = 0;
app.get("/test",function(req,res){
	res.send("yo so this works apparently");
	console.log("just a test");
});
app.get("/",function(req,res){
	res.sendFile("basicUI.html",{root: __dirname});
	console.log("rendering");
});
app.get("/graph",function(req,res){
	res.sendFile("graphUI.html",{root: __dirname});
	console.log("rendering");
});
app.get("/ajax/:watid",function(req,res){
	var wat = req.params.watid;
	Snapshot.findOne({'id':wat},'power current voltage',{sort:{serverTime:-1}},function(err,row){
		if (err) return;//not good practice
		if(row)//maybe this will stop the crashes
			res.send(row.power + " " + row.current + " " + row.voltage);
	})
});
app.get("/grajax/:watid",function(req,res){
	var wat = req.params.watid;
	Snapshot.
		find({'id': wat}).
		limit(20).
		sort({serverTime:-1}).
		select({power:1}).
		exec(function(err,data){
			if (err) return;//not good practice
			console.log(data);
		});
	})
});

app.listen(3000);
console.log("Server Started");