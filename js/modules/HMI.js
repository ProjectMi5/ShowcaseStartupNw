/**
 * startHMI_externally
 * 
 * @author Dominik Serve
 * @date 2017-01-19
 *
 */

var EventEmitter = require('events').EventEmitter;
var util = require('util');
util.inherits(HMI, EventEmitter);

var http = require('http');

var options = {
  host: 'localhost',
  path: '/order'
};




// Define the constructor for your derived "class"
function HMI() {
   // call the super constructor to initialize `this`
   EventEmitter.call(this);
   // your own initialization of `this` follows here
   this.running = false;
   console.log('initializing HMI');
   
};

HMI.prototype.checkHMI = function(){
	var self = this;
	http.get(options, function(res) {
	  console.log("Got response from HMI: " + res.statusCode);
	  if((res.statusCode == 200)|(res.statusCode == 302)){
		  if(!self.running)
			self.emit('running');
		  self.running = true;
		  res.on("data", function(chunk) {
			if(chunk.toString().indexOf('no recipe')>0){
				self.emit('warning', 'The HMI is running, but it seems to have no connection to the central OPC UA server (see Virtual Machines).');
				}
		  });
	  }

	}).on('error', function(e) {
		console.log('HMI is offline');
		if(self.running)
			self.emit('offline');
		self.running = false;
	});
};

HMI.prototype.monitorHMI = function(interval){
	var self = this;
	console.log('monitor');
	self.checkHMI();
	setInterval(function(){
		self.checkHMI();
	}, interval);
};

// Declare that your class should use EventEmitter as its prototype.
// This is roughly equivalent to: Master.prototype = Object.create(EventEmitter.prototype)

 
HMI.prototype.startHMI = function(){
	var exec = require('child_process').execFile;
	var self = this;

	self.emit('starting');
	console.log('start HMI');
	
	var exec = require('child_process').exec;
	var child = exec('"'+process.cwd() + '\\config\\startHMI.cmd', function(error, stdout, stderr) {
		
		self.emit('close', error);
		self.running = false;
		
	});
	setTimeout(function(){
		self.checkHMI();
	},5000);
};

HMI.prototype.startBrowser = function(callback){
	var $btn = global.$('#startBrowser');
	$btn.button('loading');
	var exec = require('child_process').execFile;
	console.log("Starting HMI in Browser");
	
	var exec = require('child_process').exec;
	var child = exec('"'+process.cwd() + '\\config\\startBrowser.cmd', function(error, stdout, stderr) {
		$btn.button('reset');
				
		if(!error){
			console.log("stdout: " + stdout);
			$btn.attr('class', 'btn btn-default');
			$btn.attr('title', 'running');
		} else {
			console.log("stderr: "+stderr);
			$btn.attr('class', 'btn btn-warning');
			$btn.attr('title', 'error');
		}
		callback(error);
	});
};

module.exports = new HMI();

/**
 * startHMI_internally
 * 
 * @author Dominik Serve
 * @author Kilian Messmer
 * @date 2015-09-08
 * 
 * Note: This works fine, even if the paths in the executed File are not declared absolutely.
 * But you cannot reboot or close StartUp-Program. Otherwise the child process will be closed,
 * too.
 */

/*exports.startHMI_internally = function(){
	var $btn = global.$('#startHMI');
	//$btn.button('loading');
	$btn.attr('class', 'btn btn-success');
	
	var exec = require('child_process').execFile;

	console.log("Starting HMI");
	global.$('#console').append('<p>Starting HMI</p>');
	
	var spawn = require('child_process').spawn;
	var child = spawn('node', ['simpleOPCUA.js'], {cwd: "C:\\Users\\Dominik\\Dropbox\\Mi5\\opcua-server"});
	child.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
		global.$('#console').append('<p class="stdout">stdout: '+data+'</p>');
	});

	child.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
		global.$('#console').append('<p class="error">stderr: '+data+'</p>');
	});
	
	child.on('close', function(data){
		console.log('Closing code: ' + data);
		global.$('#console').append('<p class="error">Closed HMI with code: '+data+'</p>');
	});
};*/