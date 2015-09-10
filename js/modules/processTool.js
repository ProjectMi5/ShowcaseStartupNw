/**
 * startProcessTool_externally
 * 
 * @author Dominik Serve
 * @date 2015-09-10
 * 
 */
exports.startProcessTool = function(){
	var $btn = global.$('#startProcessTool');
	$btn.button('loading');
	$btn.attr('class', 'btn btn-success');
	
	var exec = require('child_process').execFile;

	console.log("Starting Process Tool");
	
	var exec = require('child_process').execFile;
	exec(process.cwd() + '\\config\\startProcessTool.cmd', function(error, stdout, stderr) {
		$btn.button('reset');
		console.log("stdout: " + stdout);
		console.log('Process Tool closed');
				
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