/*
	Tiloid UI
  Advanced Explorer direct loaded
	(c) 2012 Denis Sureau
	Free, open source under the GPL 3 License.
*/
var http = require("http"),
path = require("path"),
url = require("url"),
runner = require("child_process"),
net = require('net'),
websocket = require("socket.io"),
fs = require("fs");

var explorer = require("explorer");


// Main server

function sendError(errCode, errString, response)
{
    response.writeHead(errCode, {"Content-Type": "text/plain"});
    response.write(errString + "\n");
    response.end();
    return;
}

function sendFile(err, file, response, ext)
{
	if(err) return sendError(500, err, response);
    var ctype = 'text/html';
	switch(ext)
	{
		case '.js': ctype = 'text/javascript'; break;
		case '.css':ctype = 'text/css'; break;
		case '.jpg':ctype = 'image/jpeg'; break;
		case '.jpeg':ctype = 'image/jpeg'; break;
		case '.png':ctype = 'image/png'; break;
		case '.gif':ctype = 'image/gif'; break;
    }
	response.writeHead(200, {'Content-Type':ctype});
	response.write(file, "binary");
	response.end();
}

function getFile(exists, response, localpath)
{
	if(!exists) return sendError(404, '404 Not Found', response);
	var ext = path.extname(localpath);
	//console.log("Reading " + localpath);
	fs.readFile(localpath, "binary",
    	function(err, file){ sendFile(err, file, response, ext);});
}

function getFilename(request, response)
{
    var urlpath = url.parse(request.url).pathname; // following domain or IP and port
    var localpath = path.join(process.cwd(), urlpath); // if we are at root
    path.exists(localpath, function(result) { getFile(result, response, localpath)});
}

function nativeComm(ncom)
{
    console.log('TCP connection: ' + ncom.remoteAddress +':'+ ncom.remotePort);
    ncom.setEncoding("utf8");

    ncom.on('data',
      function(data)
      {
        //listener.sockets.emit('notification', data);
      }
    );
    ncom.on('end',
      function() {
        console.log('Native connection closed.');
        //listener.sockets.emit('notification', 'Native script terminated.');
        }
    );
}

function runScript(exists, file, param) // Run a local script a the Web interface request
{
  if(!exists)
  {
    console.log("File not found");
    return false;
  }
  console.log("Running...");
  var r = runner.exec(file + " " + param,
    function(err, stdout, stderr) { console.log(stdout);}
  );
  console.log(file + " launched by the server...");
  r.on('exit', function (code) {
    console.log('Local script terminated.');
  });
}

function webComm(websocket)
{
  //websocket.emit('notification', 'Server online via websocket!');
  websocket.on('interface',
    function (data)
    {
	    var app = data.app;
      var params = data.params;
      console.log("app " + data.app + " target " + params.target);
	    switch(app)
	    {
		   case 'explorer':
        console.log(" ");
			  explorer.shell(websocket, fs, params);
			  break;
		   default:
        var filename = params.path;
	     	path.exists(filename, function(result) { 
          runScript(result, app, filename + " " + params)});
	    }
    }
  );
 
}


function loadBrowser(filename)
{
	var browser = explorer.config.chrome;
	var param="localhost:1000/" + filename;
	console.log("Loading...");
	path.exists(browser, function(result) {
		if(!result) { console.log("File not found " + browser); return 0; }
		var command = browser + " " + param;
		console.log("Running " + command);
		runner.exec(command, function(err, stdout, stderr) { 
      console.log("Terminated. "+ stderr); 
    });
	});

}

explorer.loadIni("node.ini");
var server = http.createServer(getFilename); // Create a server to display the interface
server.listen(1000);
console.log("Server available...");
loadBrowser('AExplorer/aexplorer.html');
console.log("Browser loaded. Port 1000 ready.");

// Create a TCP server to communicate with native script
var nativeserver = net.createServer(function(n) { nativeComm(n);});
nativeserver.listen(1001, '127.0.0.1');
console.log('TCP local server active on port 1001.');

// Create a websocket connection
var listener = websocket.listen(server, { log: false });
console.log("WebSocket started on port 1000.");
listener.sockets.on('connection', function (websocket) { webComm(websocket);} );