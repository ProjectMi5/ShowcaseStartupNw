/**
 * Functions concerning the Virtual Machines
 * 
 * @author Dominik Serve
 * @date 2015-07-09
 */


var VMdefaults = [
 {
	description: "OPC UA Server",
	vmname: "OPC UA Server",
	UUID: "fe49fe48-f34b-4136-9930-9b068c6d676c",
	vmsnapshot: "Parameter Neu",
	snapshotUUID: "2b66eb04-bb00-4263-9043-5b8ffaf3801a"
 },
 {
	description: "Modulx",
	vmname: 'Modulx',
	UUID: "69b40734-3ce7-4b3e-8cb1-9fc067aa4809",
	vmsnapshot: "Lizenziert & Status der Skills",
	snapshotUUID: "6cbb3681-4453-4c20-b577-bca03d1b1b20"
 },
 {
	description: "Recipe Tool",
	vmname: 'Recipe Tool',
	UUID: "051406f5-29d3-47ca-9aa6-990734c722f9",
	vmsnapshot: "Summernight",
	snapshotUUID: "3bd3b61a-b979-4df3-aa30-673879125429"
  },
  {
	description: "Domi's VirtualBox Laptop 1",
	vmname: "lubuntu",
	UUID: "80893b41-d5af-4e28-a84d-0a2eef37e8ce",
	vmsnapshot: "Sicherungspunkt2",
	snapshotUUID: "e861f534-6254-4f28-9aa4-22708e353d2d"
 },
 {
	description: "Domi's VirtualBox Laptop 2",
	vmname: 'lubuntu Klon',
	UUID: "cbee8585-36a9-478d-a3e0-12c9b705251d",
	vmsnapshot: "Sicherungspunkt2",
	snapshotUUID: "1bb8e92b-1afa-4a6e-b8c6-9c5c84f3a005"
 },
 {
	description: "Domi's VirtualBox3",
	vmname: 'lubuntu',
	UUID: "cfd117bd-c0ff-4c19-b06c-7ed0370a0def",
	vmsnapshot: "Sicherung2",
	snapshotUUID: "0f73b643-dc61-4a1b-8dbc-79933797d151"
 }
 ];

var vboxmanage = {
	path: "C:\\Program Files\\Oracle\\VirtualBox"
};

/**
 * Temporary: Long list of VMs
 * 
 * @param callback
 */
exports.list = function() {
	var exec = require('child_process').exec;
	var cmd = 'VBoxManage list vms --long';
	exec(cmd, {cwd: vboxmanage.path}, function (error, stdout, stderr) {
		if (!error) {
			console.log(stdout);
		} else {
			console.log(stderr);
		}
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
			console.log('Existing VMs on this machine:')
			console.log(stdout);
			// return an array containing the machines.
			callback(stdout.toString().split('\n').slice(0,-1));
		} else {
			console.log(stderr);
			callback();
		}
	});
}

exports.listVMs = function(callback){
	listVMs(callback);
}

/**
 * Interpret the data of listVMs()
 * 
 * @param data
 * @param callback
 */
exports.interpretData = function(data, callback){
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
function checkState(UUID, callback){
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
 
 exports.checkState = function(UUID, callback){
	 checkState(UUID, function(result){
		callback(result); 
	 });
 }
 
 /**
 * Check, if VM is running
 * 
 * @param UUID
 * @param callback
 */
  exports.isRunning = function(UUID, callback){
	checkState(UUID, function(result){
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
exports.checkDefault = function(UUID, callback) {
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
 * @param display
 * @param callback
 */
function startVMsimple(UUID, display, callback) {
	var exec = require('child_process').exec;
	var cmd = 'VBoxManage startvm ' + UUID;
	exec(cmd, {cwd: vboxmanage.path}, function (error, stdout, stderr) {
		display(UUID, 'reset');
		if(!error){
			display(UUID, 'running');
			callback(true);
		} else {
			console.log(stderr);
			display(UUID, 'error');
			callback(false);
		}
	});
}

// for defaults restore snapshot first
function startVM(vmUUID, display, callback){
	display(vmUUID, 'loading');
	// compute index of vm in VMdefaults
	var index = VMdefaults.map(function(item){
		return item.UUID;
		}).indexOf(vmUUID);
	if((index > -1)&&(VMdefaults[index].snapshotUUID != '')){
		restoreSnapshot(vmUUID, VMdefaults[index].snapshotUUID, function(result1){
			if(result1){
				startVMsimple(vmUUID, display, function(result2){
					callback(result2);
				});
			}
		});
	// else restore current state
	} else {
		console.log('Found no default snapshot for '+vmUUID+'. Therefore restored current state.')
		startVMsimple(vmUUID, display, function(result){
			callback(result); 
		});
	}
}

exports.startVM = function(vmUUID, display, callback){
	startVM(vmUUID, display, callback);
}

/**
 * Start all default VMs
 * 
 * @param display
 * @param callback
 */
exports.startDefaults = function(display, callback){
	listVMs(function(result){
		var ids = result.map(function(entry){
			return entry.substring(entry.lastIndexOf('{')+1,entry.lastIndexOf('}'));
		})
		
		VMdefaults.forEach(function(item){
			//make sure that default machine really exists
			if(ids.indexOf(item.UUID) > -1){
				checkState(item.UUID, function(state){
					if((state=='poweroff')|(state=='saved')){
						startVM(item.UUID, display, function(out){
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