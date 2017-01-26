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
	var win = nw.Window.get();
	win.setAlwaysOnTop(true);
	
	global.$(global.window.document).ready(function(){
		//refresh
		$("body").on('click', "#refresh", function(e) {
			e.preventDefault();
			//var $btn = $(this).button('loading');
			win.reload();
		});
		
		var gui = require('nw.gui');
		$('a[target=_blank').on('click', function(e){
			e.preventDefault();
			gui.Shell.openExternal(this.href);
			return false;
		});
		
		
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
					swal("This functionality has not been implemented, yet.");
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
		
		var $btnHMI = global.$('#startHMI');
		
		HMI.on('close', function(error){
			if(!error){
				$btnHMI.button('reset');
				$btnHMI.attr('class', 'btn btn-primary');
				$btnHMI.attr('title', 'closed');
			} else {
				$btnHMI.button('reset');
				console.log("stderr: "+error);
				$btnHMI.attr('class', 'btn btn-warning');
				$btnHMI.attr('title', 'error');
			}
		});
		HMI.on('starting', function(){
			$btnHMI.attr('data-loading-text', "Starting ...");
			$btnHMI.attr('class', 'btn btn-primary');
			$btnHMI.button('reset');
			$btnHMI.button('loading');
		});
		HMI.on('running', function(){
			$btnHMI.attr('class', 'btn btn-success');
			$btnHMI.attr('data-loading-text', "Running ...");
			$btnHMI.button('reset');
			$btnHMI.button('loading');
		});
		HMI.on('offline', function(){
			$btnHMI.button('reset');
			$btnHMI.attr('class', 'btn btn-primary');
		});
		
		var HMIwarningsDeactivated = false;
		HMI.on('warning', function(message){
			$btnHMI.attr('class', 'btn btn-warning');
			$btnHMI.attr('title', message);
			if(!HMIwarningsDeactivated){
				swal({
				  title: "Warning!",
				  text: message,
				  type: "warning",
				  showCancelButton: true,
				  //confirmButtonColor: "green",
				  confirmButtonText: "Done!",
				  cancelButtonText: "Don't show again.",
				  closeOnConfirm: true,
				  closeOnCancel: true
				},
				function(isConfirm){
					if(!isConfirm)
						HMIwarningsDeactivated = true;
				});
			}
		});
		
		HMI.monitorHMI(20000);		
		
		$("body").on('click', "#startHMI", function(e) {
			e.preventDefault();
			HMI.startHMI();
		});
		$("body").on('click', "#startBrowser", function(e) {
			e.preventDefault();
			HMI.startBrowser(function(error){});
		});
		
		/**
		 * XTS
		 ********************************************************
		 */
		 
		var XTS = require(process.cwd()+"/js/modules/XTS.js");
		var xtsEnableBtn = global.$('#enableXTS');
		var xtsDisableBtn = global.$('#disableXTS');
		var xtsWarmupBtn = global.$('#XTSwarmup');
		var restartXtsBtn = global.$('#restartXTS');
		var resetSkillsXtsBtn = global.$('#resetSkills');
		
		XTS.init();
		XTS.on('enabled',displayXTSenabled);
		XTS.on('init', function(){
			global.$('#xtsConnectionIndicator').html('connected');
			global.$('#xtsConnectionIndicator').attr('class', 'label label-success');
			global.$('#xtsConnectionSpinner').toggleClass('hidden');
		});
		function displayXTSenabled(value){
			var xtsEnableIndicator = global.$('#xtsEnableIndicator');
			if(value){
				xtsEnableBtn.button('loading');
				xtsEnableBtn.attr('class','btn btn-success');
				xtsEnableIndicator.html('enabled');
				xtsEnableIndicator.attr('class','label label-success hidden');
				xtsDisableBtn.attr('class', 'btn btn-default');
			} else {
				xtsEnableBtn.button('reset');
				xtsEnableBtn.attr('class','btn btn-primary');
				xtsEnableIndicator.html('disabled');
				xtsEnableIndicator.attr('class','label label-warning');	
				xtsDisableBtn.attr('class', 'btn btn-default hidden');			
			}
		}
		XTS.on('warmup', function(value){
			if(value){
				xtsWarmupBtn.html('Deactivate warmup.');
			} else {
				xtsWarmupBtn.html('Activate warmup.');
			}
		});
		
		$("body").on('click', "#enableXTS", function(e) {
			e.preventDefault();
			XTS.enable();
		});
		$("body").on('click', "#disableXTS", function(e) {
			e.preventDefault();
			XTS.disable();
		});
		$("body").on('click', "#XTSwarmup", function(e) {
			e.preventDefault();
			XTS.toggleWarmup();
		});
		$("body").on('click', "#restartXTS", function(e) {
			e.preventDefault();
			XTS.restart();
		});
		$("body").on('click', "#resetSkills", function(e) {
			e.preventDefault();
			XTS.resetSkills();
		});

		
		/**
		 * UA Expert
		 ********************************************************
		 */
		console.log('UAexpert');
		var UAexpert = require(process.cwd()+"/js/modules/UAexpert2");
		
		var $btnUAexpert = global.$('#startUAexpert');
		UAexpert.on('starting', function(){
			$btnUAexpert.attr("data-loading-text", "Starting ...");
			$btnUAexpert.attr('class', 'btn btn-primary');
			$btnUAexpert.button('reset');
			$btnUAexpert.button('loading');
		});
		UAexpert.on('running', function(){
			$btnUAexpert.attr("data-loading-text", "Running ...");
			$btnUAexpert.attr('class', 'btn btn-success');
			$btnUAexpert.button('reset');
			$btnUAexpert.button('loading');
			UAexpert.unmonitor();
		});
		UAexpert.on('offline', function(){
			$btnUAexpert.button('reset');
			$btnUAexpert.attr('class', 'btn btn-primary');
		});
		UAexpert.monitor(60000);
		
		$("body").on('click', "#startUAexpert", function(e) {
			e.preventDefault();
			UAexpert.start();
		});
		
		
		/**
		 * Industrial Physics
		 ********************************************************
		 */
		/*var indPhys = require(process.cwd()+"/js/modules/industrialPhysics");*/
		var indPhys = {};
		indPhys.startIndPhys = function(callback){
			console.log('isconfirm');
			swal({
			  title: "Please start Industrial Physics on the laptop.",
			  text: 'Double click on "simu_setup.iphz" on the laptop desktop.',
			  type: "warning",
			  showCancelButton: true,
			  //confirmButtonColor: "green",
			  confirmButtonText: "Done!",
			  cancelButtonText: "Cancel.",
			  closeOnConfirm: false,
			  //closeOnCancel: true
			},
			function(isConfirm){
			  if (isConfirm) {
				instructionPlayButton(callback);
			  } else {
				callback(true);
			  }
			});
		};
				
		function instructionPlayButton(callback){
			swal({
			  title: "Play button",
			  text: 'Press the play button on the top right corner of IndustrialPhysics'+
			  ' and make sure that HIL (next to it) is activated (green).',
			  type: "warning",
			  showCancelButton: true,
			  //confirmButtonColor: "green",
			  confirmButtonText: "Done!",
			  cancelButtonText: "Cancel.",
			  //closeOnConfirm: true,
			  //closeOnCancel: true
			},
			function(isConfirm){
			  if (isConfirm) {
				global.$('#startIndPhys').attr('class', 'btn');
				callback()
			  } else {
				callback(true);
			  }
			});
		}	
		
		
		$("body").on('click', "#startIndPhys", function(e) {
			e.preventDefault();
			indPhys.startIndPhys(function(){});
			
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
		var interruptStartup = false; 
		$("body").on('click', "#completeStartup", function(e) {
			e.preventDefault();
			interruptStartup = false;
			completeStartup();
		});
		$("body").on('click', "#interruptStartup", function(e) {
			e.preventDefault();
			interruptStartup = true;
		});
		
		function completeStartup(){
			var $btn = $('#completeStartup');
			$btn.button('loading');
			var $btnInterrupt = $('#interruptStartup');
			$btnInterrupt.attr('class', 'btn btn-default');
			global.async.series([
				function(callback){
					VMs.startDefaults(function(error){
						if(interruptStartup)
							callback('user interrupted Startup');
						else 
							callback(error);
					});
				},
				function(callback){
					if(HMI.running)
						return callback();
					HMI.startHMI();
					HMI.once('running', function(){
						if(interruptStartup)
							callback('user interrupted Startup');
						else 
							callback()
					});
				},
				function(callback){
					HMI.startBrowser(function(error){
						if(interruptStartup)
							callback('user interrupted Startup');
						else
							callback(null);
					});
				},
				function(callback){
					if(XTS.connected)
						callback();
					else
						callback('XTS is not connected.');
				},
				function(callback){
					swal({
					  title: "Attention!",
					  text: "The next step starts the XTS. Do you want to proceed?",
					  type: "warning",
					  showCancelButton: true,
					  //confirmButtonColor: "green",
					  confirmButtonText: "Done!",
					  cancelButtonText: "Cancel.",
					  //closeOnConfirm: true,
					  //closeOnCancel: true
					},
					function(isConfirm){
					  if (isConfirm) {
						XTS.enable();
						setTimeout(function(){
							XTS.restart();
						},1000);
						setTimeout(function(){
							XTS.resetSkills();
						},2000);
						setTimeout(function(){
							callback();
						},3000);
						
					  } else {
						callback(true);
					  }
					});
				},
				function(callback){
					setTimeout(function(){indPhys.startIndPhys(callback)},1000);
				},
				function(callback){
					if(UAexpert.running)
						setTimeout(callback,1000);
					else {
						UAexpert.start();
						UAexpert.once('running', function(){
							if(interruptStartup)
								callback('user interrupted startup');
							else
								callback();
					});
					}
				},
				function(callback){
					swal({
					  title: "Please assist.",
					  text: 'In Unified Automation UaExpert, go to the tab InputModes and do the following: ' +
					  'Set the mode of Topping Bosch (Module: 2302) from "0" to "2" to "1".',
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
				},
				function(callback){
					processTool.startProcessTool();
					callback(null);
				}			
			],
			function(err) {
				$btn.button('reset');
				if(!err){

					$btn.attr('class', 'btn btn-success');
					$btn.attr('title', 'Completed');
					$btnInterrupt.attr('class', 'btn btn-default hidden');
				} else {
					console.log('An error occurred '+err);
					$btn.attr('class', 'btn btn-warning');
					$btn.attr('title', 'error');
					$btnInterrupt.attr('class', 'btn btn-default hidden');
				}
				
			});
		}
		
		
		
		

	});
}