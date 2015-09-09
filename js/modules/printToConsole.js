exports.prnt = function(state, text){
	var console = global.$('#console');
	switch(state) {
			case 'stderr':
				console.append('<p class="stderr">stderr: '+text+'</p>');
				break;
			case 'stdout':
				console.append('<p class="stdout">stdout: '+text+'</p>');
				break;
			case 'std':
			default:
				console.append('<p>'+text+'</p>');
		};
	console.scrollTop = console.scrollHeight;
};