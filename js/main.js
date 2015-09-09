function init(){
	/*NODE MODULES*/
	global.async = require('async');
	/* OWN MODULES:
	 * Note: NW.js does not support normal require for
	 * own modules.
	 * Either use direct path from index.html file 
	 * or process.cwd() i.e. main folder with package.json! 
	 */
	global.config = require("./../config/config").config;
	global.prnt = require("./../js/modules/printToConsole").prnt;
	
	global.$(global.window.document).ready(function(){
		/**
		 * VMs
		 ********************************************************
		 */
		var VMs = require(process.cwd()+"/js/modules/VMs"); 
		VMs.init();
		
		// Single VM's button click events
		$("body").on('click', ".startVM", function(e) {
			var $btn = $(this);
			e.preventDefault();
			console.log('pressed '+$btn.attr('id'));
			VMs.checkState($btn.attr('id'), function(result){
				// Start VMs that are poweroff or saved
				if((result == 'poweroff')|(result == 'saved')){
						VMs.startVM($btn.attr('id'), function(result){});
				// To do: Turn off running machines etc.
				} else {
					alert("This functionality has not been implemented, yet.");
				}
			});
		});
		
		//Start all default VMs
		$("body").on('click', "#startAllDefaults", function(e) {
			e.preventDefault();
			//var $btn = $(this).button('loading');
			VMs.startDefaults(function(out, UUID){});
		});
		
		
		/**
		 * HMI
		 ********************************************************
		 */
		var HMI = require(process.cwd()+"/js/modules/HMI");
		$("body").on('click', "#startHMI", function(e) {
			e.preventDefault();
			HMI.startHMI();
		});
		
		
		
		

	});
}