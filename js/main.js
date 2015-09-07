function init(){
	global.config = require("./../config").config;
	
	global.$(global.window.document).ready(function(){
		var exp = require("./../js/modules/exp.js"); //note: In nw require always starts at index.html
		global.$("body").on('click', "#startTest", function(e) {
			e.preventDefault();
			exp.doSomething();
		});
		
	// Display state on a button
	function displayState(ID, state){
		var $btn = $('#'+ID);
		switch(state) {
			case 'loading':
				$btn.button('loading');
				break;
			case 'reset':
				$btn.button('reset');
				break;
			case 'poweroff':
			case 'saved':
				$btn.attr('class', 'btn btn-default');
				break;
			case 'running':
				$btn.attr('class', 'btn btn-success');
				break;
			case 'error':
				$btn.attr('class', 'btn danger');
				$btn.append('<span class="glyphicon glyphicon-flash" aria-hidden="true"></span>');
				break;
			default:
				$btn.attr('class', 'btn btn-warning');
		} 
		if((state != 'loading')&&(state != 'reset')){
				$btn.attr('title', state);
		}
	}



	/**
	 * Manage Virtual Machines
	 ****************************
	 */
	var VMs = require(process.cwd()+"/js/modules/VMs"); // NW.js does not support normal require

	VMs.listVMs(function(data){
		VMs.interpretData(data, function(item){
			// Create Buttons
			$('#VMbuttons').append(
				'<button title="Start '+ item.name
					+'" id="'+ item.UUID
					+'" data-loading-text="Starting...'
					+'" "type="button" class="btn btn-default startVM">'
					+ item.name
					+ '</button>');

			// Mark Default
			VMs.checkDefault(item.UUID, function(result){
				if(result){
					$('#'+item.UUID).append(' <span class="glyphicon glyphicon-star"></span>');
				}
				});
			// Check State
			VMs.checkState(item.UUID, function(result){
				$('#'+item.UUID).attr('title', item.name + ' is ' + result + '.');
				if((result != 'poweroff')&&(result != 'saved')){
					$('#'+item.UUID).toggleClass('btn-default btn-success');
				}
			});
		});
	});
	
	
	// Single VM's button click events
	$("body").on('click', ".startVM", function(e) {
		var $btn = $(this);
        e.preventDefault();
		console.log('pressed '+$btn.attr('id'));
		VMs.checkState($btn.attr('id'), function(result){
			// Start VMs that are poweroff or saved
			if((result == 'poweroff')|(result == 'saved')){
					VMs.startVM($btn.attr('id'), displayState, function(result){});
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
		VMs.startDefaults(displayState, function(out, UUID){});
	});
	
	
	/**
	 * HMI
	 ****************************
	 */
	var HMI = require(process.cwd()+"/js/modules/HMI");
	$("body").on('click', "#startHMI", function(e) {
		e.preventDefault();
		HMI.startHMI(displayState);
	});
	
	$("body").on('click', "#bgDebugResetSkillsXTS", function(e) {
	e.preventDefault();
	HMI.resetXTS(displayState);
	});
	});
}