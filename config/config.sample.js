/**
 * Sample Configuration File
 */

var config = {
	HMI: {path: "C:\\path\\to\\HMI"},
	VMdefaults: [ 
		 { /* note: only UUIDs are important*/
			description: "",
			vmname: "",
			UUID: "",
			vmsnapshot: "",
			snapshotUUID: ""
		 },
		 ],

	vboxmanage: {path: "C:\\path\\to\\VirtualBox"},
	mongodb: {
		exeFilePath: "C:\\path\\to\\mongod.exe",
		dbPath: "C:\\path\\to\\mongodb"
	},
	processTool:{
		initPath: "C:\\path\\to\\Config.ini"
	}
};

exports.config = config;