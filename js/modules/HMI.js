/**
 * Starting the HMI
 * 
 * @author Dominik Serve
 * @date 2015-09-02
 */

var HMIdefaults = {
	path: "C:\\Users\\ITQ\\Documents\\HMI"
};
 
exports.startHMI = function(display) {
	display('startHMI', 'loading');
	var exec = require('child_process').exec;
	var cmd = "start node app.js -server=briefcase​";
	var child = exec(cmd, {cwd: HMIdefaults.path}, function(error, stdout, stderr){
		display('startHMI', 'reset');		
		if(!error){
			display('startHMI', 'running');
		} else {
			display('startHMI', 'error');
		}
	});
}

exports.resetXTS = function(display) {
	var opc = require(HMIdefaults.path + '/models/simpleOpcua').server(CONFIG.OPCUAXTS);
    opc.initialize(function(err) {
      if (err) {
        console.log(err);
        return 0;
      }

      var writethis = {
        XTS_ResetSkills : true
      };

      opc.mi5WriteObject('MI5.', writethis, Mi5DebugMapping, function(err) {
        console.log(preLog(), 'XTS - Reset XTS - written true');
        opc.disconnect();
      }); // end opc.Mi5WriteObject
    }); // end opc.initialize
}
