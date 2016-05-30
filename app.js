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
app.get("/grajax/:watid/:detail",function(req,res){
	var wat = req.params.watid;
	var detail = req.params.detail || 1;
	console.log("detail",detail)
	Snapshot.
		find({'id': wat}).
		limit(20*detail).
		sort({serverTime:-1}).
		select({serverTime:1,power:1,current:1,voltage:1,'_id':0}).
		exec(function(err,data){
			if (err) return;//not good practice
			var rows = [];
			for(var i=0;i<data.length/detail;i++){
				var avCurrent = 0;
				var avPower = 0;
				var avVoltage = 0;
				var samples = Math.min(detail,data.length-detail*i);
				for(var j = 0; j < samples; j++){
					var index = detail*i+j;
					avPower += data[index].power;
					avCurrent += data[index].current;
					avVoltage += data[index].voltage;
				}
				var datDate = new Date();
				datDate.setTime(data[detail*i].serverTime);
				var datString = "Date("+datDate.getYear()+","+datDate.getMonth()+","+datDate.getDate()+","+datDate.getHours()+","+datDate.getMinutes()+","+datDate.getSeconds()+")";

				rows.push({'c':[{'v':datString,'f':datDate.toGMTString()}
									,{'v':avPower/samples}
									,{'v':avCurrent/samples}
									,{'v':avVoltage/samples}]})
			}
			var dataTable = {
				'cols':[{type:'date',label:'time'}
						,{type:'number',label:'power'}
						,{type:'number',label:'current'}
						,{type:'number',label:'voltage'}]
				,'rows':rows
			};
			
			/*console.log(data);
			var dataTable = [];
			dataTable.push(['Time','Power(W)']);
			for(var i=data.length-1;i>=0;i--){
				dataTable.push([data[i].serverTime,data[i].power]);
			}*/
			console.log(dataTable);
			res.send(dataTable);

		});
});

app.listen(3000);
console.log("Server Started");