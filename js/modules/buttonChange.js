exports buttonChange = function(ID, state){
	var $btn = global.$('#'+ID);
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
		case 'closed':
			$btn.attr('class', 'btn btn-primary');
			break;
		case 'running':
			$btn.attr('class', 'btn btn-success');
			break;
		case 'error':
			$btn.attr('class', 'btn btn-danger');
			break;
		default:
			$btn.attr('class', 'btn btn-warning');
	} 
	$btn.attr('title', state);
};