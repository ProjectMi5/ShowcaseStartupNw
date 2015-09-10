/**
 * startUAexpert_externally
 * 
 * @author Dominik Serve
 * @date 2015-09-10
 * 
 */
exports.startUAexpert = function(callback){
	var $btn = global.$('#startUAexpert');
	$btn.button('loading');
	
	var exec = require('child_process').execFile;

	console.log("Starting UA Expert");
	
	var exec = require('child_process').execFile;
	exec(process.cwd() + '\\config\\startUAexpert.cmd', function(error, stdout, stderr) {
		$btn.button('reset');
		if(!error){
			console.log("stdout: " + stdout);
			$btn.attr('class', 'btn btn-success');
			$btn.attr('title', 'running');
		} else {
			console.log("stderr: "+stderr);
			$btn.attr('class', 'btn btn-warning');
			$btn.attr('title', 'error');
		}
		callback(error);
	});
};