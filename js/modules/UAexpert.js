/**
 * startUAexpert_externally
 * 
 * @author Dominik Serve
 * @date 2015-09-10
 * 
 */
exports.startUAexpert = function(){
	var $btn = global.$('#startUAexpert');
	$btn.button('loading');
	$btn.attr('class', 'btn btn-success');
	
	var exec = require('child_process').execFile;

	console.log("Starting UA Expert");
	
	var exec = require('child_process').execFile;
	exec(process.cwd() + '\\config\\startUAexpert.cmd', function(error, stdout, stderr) {
		$btn.button('reset');
		console.log("stdout: " + stdout);
		console.log('UA Expert closed');
				
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