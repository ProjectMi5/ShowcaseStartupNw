/**
 * startProcessTool_externally
 * 
 * @author Dominik Serve
 * @date 2015-09-10
 * 
 */
exports.startProcessTool = function(){
	var bool = global.$('#ProcessToolWithInit').prop('checked');
	setINIT(bool, function(err){
		if(err){
			console.log(err);
			return;
		} else {
			startTool();
		}
	});
};

function startTool(){
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
}

function setINIT(bool, callback){
	fs = require('fs');
	var file = global.config.processTool.initPath;
	
	fs.readFile(file, function (err, data) {
		if (err){
			callback(err);
			return;
		}
		var result;
		if(bool){
			result = data.toString().replace('init,0', 'init,1');
		} else {
			result = data.toString().replace('init,1', 'init,0');
		}
		console.log("Replacing the init parameter in Mi5Config.ini!")
		fs.writeFile(file, result, function(err) {
			if(err) {
				callback(err);
				return;
			}
			console.log("The file was saved!");
			callback(null);
		}); 				
	});
}