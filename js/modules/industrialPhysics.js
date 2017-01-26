/**
 * startIndustrialPhysics_externally
 * 
 * @author Dominik Serve
 * @date 2015-09-10
 * 
 */
exports.startIndPhys = function(callback){
	swal.setDefaults({
	  input: 'text',
	  confirmButtonText: 'Next &rarr;',
	  showCancelButton: true,
	  animation: false,
	  progressSteps: ['1', '2', '3']
	})

	var steps = [
	  {
		title: 'Question 1',
		text: 'Chaining swal2 modals is easy'
	  },
	  'Question 2',
	  'Question 3'
	]

	swal.queue(steps).then(function (result) {
	  swal.resetDefaults()
	  swal({
		title: 'All done!',
		html:
		  'Your answers: <pre>' +
			JSON.stringify(result) +
		  '</pre>',
		confirmButtonText: 'Lovely!',
		showCancelButton: false
	  })
	}, function () {
	  swal.resetDefaults()
	});
	
	/*swal({
	  title: "Please start Industrial Physics on the laptop.",
	  text: 'Double click on "simu_setup.iphz" on the laptop desktop.',
	  type: "warning",
	  showCancelButton: true,
	  //confirmButtonColor: "green",
	  confirmButtonText: "Done!",
	  cancelButtonText: "Cancel."
	  //closeOnConfirm: true,
	  //closeOnCancel: true
	},
	function(isConfirm){
	  if (isConfirm) {
		instructionPlayButton(callback);
	  } else {
		callback(true);
	  }
	});*/
};
				
function instructionPlayButton(callback){
	swal({
	  title: "Play button",
	  text: 'Press the play button on the top right corner of industrial physics'+
	  'and make sure that HIL (next to it) is activated (green).',
	  type: "warning",
	  showCancelButton: true,
	  //confirmButtonColor: "green",
	  confirmButtonText: "Done!",
	  cancelButtonText: "Cancel."
	  //closeOnConfirm: true,
	  //closeOnCancel: true
	},
	function(isConfirm){
	  if (isConfirm) {
		callback(null);
	  } else {
		callback(true);
	  }
	});
}	


/*function(){
	var $btn = global.$('#startIndPhys');
	$btn.button('loading');
	$btn.attr('class', 'btn btn-success');
	
	var exec = require('child_process').execFile;

	console.log("Starting Industrial Physics");
	
	var exec = require('child_process').execFile;
	exec(process.cwd() + '\\config\\startIndustrialPhysics.cmd', function(error, stdout, stderr) {
		$btn.button('reset');
		if(!error){
			console.log("stdout: " + stdout);
			$btn.attr('class', 'btn btn-primary');
			$btn.attr('title', 'running');
		} else {
			console.log("stderr: "+stderr);
			$btn.attr('class', 'btn btn-warning');
			$btn.attr('title', 'error');
		}
	});
};*/