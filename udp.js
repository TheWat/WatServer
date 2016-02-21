var PORT = 33333;
var HOST = '127.0.0.1';

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
	time: Number
	,power: Number
	,current: Number
	,voltage: Number
});

var snapshot = mongoose.model('Snapshot',dSchema);

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
    //TODO
    /****************************************************************************
	Parse the message [timestamp, power(Watts), current(amps), voltage(volts)]

	Store in mongo database

    ****************************************************************************/
    console.log(message);
    message = message.split(" ");
    //TODO- store numbers in binary
    var row  = new Snapshot({
    	time:message[0]
    	,power:message[1]
    	,current:message[2]
    	,voltage:message[3]
    });
    row.save(function(err,row){
    	if(err) return console.error(err);
    })



});

server.bind(PORT, HOST);