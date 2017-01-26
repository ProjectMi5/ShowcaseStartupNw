var UAexpert = require('./UAexpert2');

UAexpert.on('starting', function(){
	console.log('starting');
});
UAexpert.on('running', function(){
	console.log('loading');
});
UAexpert.on('offline', function(){
	console.log('offline');
});
UAexpert.monitor(20000);

setTimeout(function(){
	UAexpert.start();
},10000);