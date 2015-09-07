/**
 * Starting the HMI
 * 
 * @author Dominik Serve
 * @date 2015-09-02
 */
 
 var HMIdefaults = global.config.HMI;


exports.startHMI = function() {
	var $btn = global.$('#startHMI');
	$btn.button('loading');
	var exec = require('child_process').exec;
	var cmd = "node app.js -server=briefcase";
	var args = [];
	var child = exec(cmd, {cwd: HMIdefaults.path});
	child.stdout.on('data', function(data){
		console.log('stdout: ' + data);
		global.$('#HMIconsole').append('<p>stdout: '+data+'</p>');
	});
	child.stderr.on('data', function(data){
		console.log('stderr: ' + data);
		global.$('#HMIconsole').append('<p>stderr: '+data+'</p>');
	});
	child.on('close', function(data){
		console.log('closing code: ' + data);
		global.$('#HMIconsole').append('<p>closing code: '+data+'</p>');
		$btn.button('reset');
		$btn.attr('class', 'btn btn-success');
		$btn.attr('title', 'running');
	});
	
	var mongodb = '"C:\\Program Files\\MongoDB\\Server\\3.0\\bin\\mongod.exe" --dbpath C:\\Users\\ITQ\\Documents\\HMI-Cloud\\mongodb';
	
	console.log('starting mongoDB');
	exec(mongodb, function(error, stdout, stderr){
	  console.log('ChildProcess'.red, 'stdout:', stdout, 'stderr:', stderr);
	  if (error !== null) {
		console.log('ChildProcess'.red, 'exec error: ' + error);
	  }
	});
	
}

exports.resetXTS = function() {
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
