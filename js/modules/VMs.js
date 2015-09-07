/**
 * Functions concerning the Virtual Machines
 * 
 * @author Dominik Serve
 * @date 2015-07-09
 */

var VMdefaults = global.config.VMdefaults,
	vboxmanage = global.config.vboxmanage;

	
exports.init = function(){
	listVMs(function(data){
		interpretData(data, function(item){
			// Create Buttons
			global.$('#VMbuttons').append(
				'<button title="Start '+ item.name
					+'" id="'+ item.UUID
					+'" data-loading-text="Starting...'
					+'" "type="button" class="btn btn-default startVM">'
					+ item.name
					+ '</button>');

			// Mark Default
			checkDefault(item.UUID, function(result){
				if(result){
					global.$('#'+item.UUID).append(' <span class="glyphicon glyphicon-star"></span>');
				}
				});
			// Check State
			exports.checkState(item.UUID, function(result){
				$('#'+item.UUID).attr('title', item.name + ' is ' + result + '.');
				if((result != 'poweroff')&&(result != 'saved')){
					$('#'+item.UUID).toggleClass('btn-default btn-success');
				}
			});
		});
	});
}

	



/**
 * List VirtualBoxes on the Computer.
 * 
 * @param callback
 */
function listVMs(callback) {
	var exec = require('child_process').exec;
	var cmd = 'VBoxManage list vms';
	exec(cmd, {cwd: vboxmanage.path}, function (error, stdout, stderr) {
		if (!error) {
			console.log('Existing VMs on this machine:\n'+stdout);
			// return an array containing the machines.
			callback(stdout.toString().split('\n').slice(0,-1));
		} else {
			console.log(stderr);
			callback();
		}
	});
}

/**
 * Interpret the data of listVMs()
 * 
 * @param data
 * @param callback
 */
function interpretData(data, callback){
		data.forEach(function(item){
			callback({
				name: item.substring(1,item.lastIndexOf('"')),
				UUID: item.substring(item.lastIndexOf('{')+1,item.lastIndexOf('}'))
			});
		});
	}

/**
 * Return State of VM
 * 
 * @param UUID
 * @param callback
 */
exports.checkState = function(UUID, callback){
	var exec = require('child_process').exec;
	var cmd = 'VBoxManage showvminfo --machinereadable ' + UUID;
	exec(cmd, {cwd: vboxmanage.path}, function (error, stdout, stderr) {
		if (!error) {
			var newout = stdout.toString().split('\n').forEach(function (content) {
				if(content.indexOf('VMState=') > -1){
					console.log("State of "+UUID + ": " + content);
					callback(content.substring(content.lastIndexOf('=')+2, content.lastIndexOf('"')));
				}
			});
		} else {
			console.log(stderr);
			callback();			
		}
	});
 }
 
 /**
 * Check, if VM is running
 * 
 * @param UUID
 * @param callback
 */
  exports.isRunning = function(UUID, callback){
	exports.checkState(UUID, function(result){
		if (result == "poweroff"){
			callback(false);
		} else {
			callback(true);
		}
	});
 }
 
 

/**
 * Check, if VM is Default
 * 
 * @param UUID
 * @param callback
 */
function checkDefault(UUID, callback) {
	VMdefaults.forEach(function(item){
		if(item.UUID == UUID){
			console.log(UUID + " is favourite.");
			callback(true);
		} else {
			callback(false);
		}
	});
}



/**
 * Start one VM
 * 
 * @param UUID
 * @param callback
 */
function startVMsimple(UUID, callback) {
	var exec = require('child_process').exec;
	var cmd = 'VBoxManage startvm ' + UUID;
	exec(cmd, {cwd: vboxmanage.path}, function (error, stdout, stderr) {
		var $btn = global.$('#'+UUID);
		$btn.button('reset');
		if(!error){
			$btn.attr('class', 'btn btn-success');
			$btn.attr('title', 'running');
			callback(true);
		} else {
			console.log(stderr);
			$btn.attr('class', 'btn btn-warning');
			$btn.attr('title', 'error');
			callback(false);
		}
	});
}

// for defaults restore snapshot first
function startVM(vmUUID, callback){
	var $btn = global.$('#'+vmUUID);
	$btn.button('loading');
	// compute index of vm in VMdefaults
	var index = VMdefaults.map(function(item){
		return item.UUID;
		}).indexOf(vmUUID);
	if((index > -1)&&(VMdefaults[index].snapshotUUID != '')){
		restoreSnapshot(vmUUID, VMdefaults[index].snapshotUUID, function(result1){
			if(result1){
				startVMsimple(vmUUID, function(result2){
					callback(result2);
				});
			}
		});
	// else restore current state
	} else {
		console.log('Found no default snapshot for '+vmUUID+'. Therefore restored current state.')
		startVMsimple(vmUUID, function(result){
			callback(result); 
		});
	}
}

exports.startVM = function(vmUUID, callback){
	startVM(vmUUID, callback);
}

/**
 * Start all default VMs
 * 
 * @param callback
 */
exports.startDefaults = function(callback){
	listVMs(function(result){
		var ids = result.map(function(entry){
			return entry.substring(entry.lastIndexOf('{')+1,entry.lastIndexOf('}'));
		})
		
		VMdefaults.forEach(function(item){
			//make sure that default machine really exists
			if(ids.indexOf(item.UUID) > -1){
				exports.checkState(item.UUID, function(state){
					if((state=='poweroff')|(state=='saved')){
						startVM(item.UUID, function(out){
							callback(out, item.UUID);
						});
					} else {
						callback(false, item.UUID);
					}
				})
			} else {
				console.log(item.vmname+" does not exist on this machine.");
			}
		});
	});
}



/**
 * Restore Snapshot
 * 
 * @param vmname = UUID of vm
 * @param snapshot = UUID of snapshot
 * @param callback
 */
function restoreSnapshot(vmname, snapshot, callback){
	var exec = require('child_process').exec;
	var cmd = 'VBoxManage snapshot ' + vmname + ' restore ' + snapshot;
	exec(cmd, {cwd: vboxmanage.path}, function (error, stdout, stderr) {
		if (!error) {
			callback(true);
		} else {
			console.log(stderr);
			callback(false);
		}
	});
}