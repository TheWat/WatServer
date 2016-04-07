var PORT = 33333;
var HOST = '0.0.0.0';

var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/pdata");

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log("Mongo Connected");
});

var dSchema = mongoose.Schema({
	id: Number
	,time: Number
	,power: Number
	,current: Number
	,voltage: Number
});

var Snapshot = mongoose.model('Snapshot',dSchema);

server.on('message', function (message, remote) {
    //console.log(remote.address + ':' + remote.port +' - ' + message);
    //TODO
    /****************************************************************************
	Parse the message [timestamp, power(Watts), current(amps), voltage(volts)]

	Store in mongo database

    ****************************************************************************/
	var str = String(message);
	str = str.split(" ");
	//TODO- store numbers in binary
/*	var row  = new Snapshot({
		id:str[0]
		,time:str[1]
		,power:str[2]
		,current:str[3]
		,voltage:str[4]
	});*/
	var vlowkey = str[4];
	var clowkey = str[3];
	var plowkey = str[2];//lowkey schemando here
	console.log(remote.address + ':' + remote.port +' - ' + plowkey + " " + clowkey + " " + vlowkey);
	var row  = new Snapshot({
		id:str[0]
		,time:str[1]
		,power:plowkey
		,current:clowkey
		,voltage:vlowkey
	});
	row.save(function(err,row){
		if(err) return console.error(err);
	});



});

server.bind(PORT, HOST);