/**
 * Functions concerning the XTS
 * 
 * @author Dominik Serve
 * @date 2016-01-25
 */
var OpcuaClient = require('mi5-simple-opcua').OpcuaClient;
var OpcuaVariable = require('mi5-simple-opcua').OpcuaVariable; 

var xtsConfig = global.config.XTS;
var endpointURL = xtsConfig.endpointURL;
var enableNode = xtsConfig.enableNode;
var warmupNode = xtsConfig.warmupNode;
var restartNode = xtsConfig.restartNode;
var resetSkillsNode = xtsConfig.resetSkillsNode;

var EventEmitter = require('events').EventEmitter;
var util = require('util');
util.inherits(XTS, EventEmitter);

function XTS(){
	
}
	
XTS.prototype.init = function(){
	var self = this;
	console.log('waiting for connection to xts');
	this.client = new OpcuaClient(endpointURL, function(err){
		if(err)
			console.log(err);
		self.emit('init');
		self.connected = true;
		console.log('connected to xts');
		self.enableXTSvariable = new OpcuaVariable(self.client, enableNode, true);
		self.enableXTSvariable.once('init', function(){
			self.enableXTSvariable.read(function(err, value){
			  if(err)
				return console.error(err);
			  self.enabled = value;
			  console.log('xts enabled: ' + self.enabled);
			  if(self.enabled)
				self.emit('enabled', true);
			});
		});
		self.enableXTSvariable.onChange(function(value){
			self.emit('enabled', value);
			self.enabled = value;
			console.log('xts enabled: '+ value);
		});
		self.warmupXTSvariable = new OpcuaVariable(self.client, warmupNode, true);
		self.warmupXTSvariable.once('init', function(){
			self.warmupXTSvariable.read(function(err, value){
			  if(err)
				return console.error(err);
			  self.warmup = value;
			  console.log('xts warmup: ' + self.enabled);
			  if(self.warmup)
				self.emit('warmup', true);
			});
		});
		self.warmupXTSvariable.onChange(function(value){
			self.emit('warmup', value);
			self.warmup = value;
			console.log('warmup enabled: '+ value);
		});
		self.restartXTSvariable = new OpcuaVariable(self.client, restartNode);
		self.resetSkillsVarible = new OpcuaVariable(self.client, resetSkillsNode);
	});
}

XTS.prototype.enable = function(){
	var self = this;
	this.enableXTSvariable.writeCB(true, function(err){
		if(err)
			self.emit('error', err.toString());
		else
			self.emit('enabled', true);
	});
};

XTS.prototype.disable = function(){
	this.enableXTSvariable.writeCB(false, function(err){
		if(err)
			self.emit('error', err.toString());
		else
			self.emit('enabled', false);
	});
};

XTS.prototype.toggleWarmup = function(){
	var self = this;
	this.warmupXTSvariable.writeCB(!self.warmup, function(err){
		self.warmup = !self.warmup;
		if(err)
			self.emit('error', err.toString());
		else
			self.emit('warmup', self.warmup);
	});
};

XTS.prototype.resetSkills = function(){
	var self = this;
	this.resetSkillsVarible.writeCB(true, function(err){
		if(err)
			self.emit('error', err.toString());
	});
};

XTS.prototype.restart = function(){
	var self = this;
	this.restartXTSvariable.writeCB(true, function(err){
		if(err)
			self.emit('error', err.toString());
	});
};




module.exports = new XTS();

	



