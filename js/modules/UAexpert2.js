/**
 * startUAexpert_externally
 * 
 * @author Dominik Serve
 * @date 2016-01-19
 * 
 */
 
var ps = require('ps-node');

var EventEmitter = require('events').EventEmitter;
var util = require('util');
util.inherits(UAExpert, EventEmitter);
var exec = require('child_process').exec;


// Define the constructor for your derived "class"
function UAExpert() {
   // call the super constructor to initialize `this`
   EventEmitter.call(this);
   // your own initialization of `this` follows here
   this.running = false;
   console.log('initializing UAExpert');
   
}

UAExpert.prototype.check = function(){
	var self = this;
	
	console.log('check uaexpert');
	
	ps.lookup({
		command: 'UaExpert'
		}, function(err, resultList ) {
			console.log(resultList.length);
		if (err) {
			console.error(err);
		}
		if(resultList.length > 0){
			self.emit('running');
			self.running = true;
			console.log('uaexpert is running');
		} else {
			self.emit('offline');
			self.running = false
			console.log('uaexpert isn\'t running');
		}
	});
};
 
 
UAExpert.prototype.start = function(){
	var self = this;
	
	if(self.running)
		return;
	
	self.emit('starting');
	console.log("Starting UA Expert");

	exec(process.cwd() + '\\config\\startUAexpert.cmd', function(error, stdout, stderr) {
		if(!error){
			console.log("stdout: " + stdout);
		} else {
			console.log("stderr: "+stderr);
		}
	});
};

UAExpert.prototype.monitor = function(interval){
	var self = this;
	self.check();
	self.interval = setInterval(function(){
		self.check();
	}, interval);
};

UAExpert.prototype.unmonitor = function(interval){
	var self=this;
	clearInterval(self.interval);
};


module.exports = new UAExpert();