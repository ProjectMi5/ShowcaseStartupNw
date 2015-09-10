/**
 * startHMI_externally
 * 
 * @author Dominik Serve
 * @author Kilian Messmer
 * @date 2015-09-08
 * 
 */
exports.startHMI = function(){
	var $btn = global.$('#startHMI');
	$btn.button('loading');
	$btn.attr('class', 'btn btn-success');
	
	var exec = require('child_process').execFile;

	console.log("Starting HMI");
	
	var exec = require('child_process').exec;
	var child = exec(process.cwd() + '\\config\\startHMI.cmd', function(error, stdout, stderr) {
		$btn.button('reset');
		console.log("stdout: " + stdout);
		console.log('HMI closed');
				
		if(!error){
			$btn.attr('class', 'btn btn-primary');
			$btn.attr('title', 'closed');
		} else {
			console.log("stderr: "+stderr);
			$btn.attr('class', 'btn btn-warning');
			$btn.attr('title', 'error');
		}
	});
};

exports.startBrowser = function(callback){
	var $btn = global.$('#startBrowser');
	$btn.button('loading');
	var exec = require('child_process').execFile;
	console.log("Starting HMI in Browser");
	
	var exec = require('child_process').exec;
	var child = exec(process.cwd() + '\\config\\startBrowser.cmd', function(error, stdout, stderr) {
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

exports.startHMI_internally = function(){
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
};