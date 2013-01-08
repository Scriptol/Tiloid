// (c) Scriptol.com


function check(websocket, url, target)
{
  alert("Check");

}

exports.shell = function(websocket, fs, params)
{
	var command = params.command;
	console.log("Link Checker command: " + command);
	var url = params.path;
	var target = params.target;

	switch(command)	{
	case 'check':
		check(websocket, url, target);
		break;
	default:
		websocket.emit('message',  { 'content': 'Not found' } );
	}
}
