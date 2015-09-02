/**
 * Starting Industrial Physics
 * 
 * @author Dominik Serve
 * @date 2015-07-31
 */

var IPdefaults = {
	exeName: "industrialPhysics.exe",
	path: "C:\\Program Files\\machineering\\industrialPhysics(x64)\\bin"
};

var simuDefaults = {
	document: "C:\\svn\\xts\\Projekte\\01_km\\Simulation\\simu_setup.iphz"
};

/**
 * Start Simulation in Industrial Physics
 * 
 * @param callback
 */
 
exports.startIndPhys = function(display) {
	display('startIndPhys', 'loading');
	var exec = require('child_process').exec;
	var cmd = IPdefaults.exeName + ' "' + simuDefaults.document + '"';
	var child = exec(cmd, {cwd: IPdefaults.path}, function(error, stdout, stderr){
		display('startIndPhys', 'reset');		
		if(!error){
			display('startIndPhys', 'running');
		} else {
			display('startIndPhys', 'error');
		}
	});
}