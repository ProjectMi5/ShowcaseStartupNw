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
			VMs.startDefaults(function(err){});
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
		$("body").on('click', "#startBrowser", function(e) {
			e.preventDefault();
			HMI.startBrowser(function(error){});
		});
		
		/**
		 * UA Expert
		 ********************************************************
		 */
		var UAexpert = require(process.cwd()+"/js/modules/UAexpert");
		$("body").on('click', "#startUAexpert", function(e) {
			e.preventDefault();
			UAexpert.startUAexpert(function(error){});
		});
		
		/**
		 * Industrial Physics
		 ********************************************************
		 */
		var indPhys = require(process.cwd()+"/js/modules/industrialPhysics");
		$("body").on('click', "#startIndPhys", function(e) {
			e.preventDefault();
			indPhys.startIndPhys();
		});
		
		/**
		 * ProcessTool
		 ********************************************************
		 */
		var processTool = require(process.cwd()+"/js/modules/processTool");
		$("body").on('click', "#startProcessTool", function(e) {
			e.preventDefault();
			processTool.startProcessTool();
		});
		
		/**
		 * CompleteStartUP!
		 ********************************************************
		 */
		$("body").on('click', "#completeStartup", function(e) {
			e.preventDefault();
			completeStartup();
		});
		
		function completeStartup(){
			var $btn = $('#completeStartup');
			$btn.button('loading');
			global.async.series([
				function(callback){
					VMs.startDefaults(function(error){
						callback(error);
					});
				},
				function(callback){
					HMI.startHMI();
					setTimeout(function(){
						callback(null);
					}, 5000);
				},
				function(callback){
					HMI.startBrowser(function(error){
						alert('Please Enable XTS, Reset XTS and Reset Skills.');
						callback(null);
					});
				},
				function(callback){
					UAexpert.startUAexpert(function(error){
						if(!error){
							alert('Please fix the bugs within UA expert.');
							callback(null);
						} else {
							callback(error);
						}
					});
				},
				function(callback){
					processTool.startProcessTool();
					callback(null);
				},
				function(callback){
					indPhys.startIndPhys();
					setTimeout(function(){
						callback(null);
					}, 15000);
				},				
			],
			function(err) {
				$btn.button('reset');
				if(!err){

					$btn.attr('class', 'btn btn-success');
					$btn.attr('title', 'Completed');
				} else {
					console.log('An error occurred '+err);
					$btn.attr('class', 'btn btn-warning');
					$btn.attr('title', 'error');
				}
				
			});
		}
		
		
		
		

	});
}