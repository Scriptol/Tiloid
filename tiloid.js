/*
	Tiloid UI
	(c) 2012-2014 Denis Sureau
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
    fs.exists(localpath, function(result) { getFile(result, response, localpath)});
}

function nativeComm(ncom)
{
    console.log('TCP connection: ' + ncom.remoteAddress +':'+ ncom.remotePort);
    ncom.setEncoding("utf8");

    ncom.on('data',
      function(data)
      {
        listener.sockets.emit('notification', data);
      }
    );
    ncom.on('end',
      function() {
          //console.log('Native connection closed.');
          //listener.sockets.emit('notification', 'Native script terminated.');
        }
    );
}

// Run a local script a the Web interface request

function runScript(exists, interpreter, filename, options)
{
  if(!exists)
  {
    console.log("'" + filename + "' not found...");
    return false;
  }
  var command = interpreter + " " + filename + " " + options;
  console.log("Command: " + command);
  var r = runner.exec(command,
    function(err, stdout, stderr) { console.log(stdout);}
  );
  console.log(filename + " executed by " + interpreter + "...");
  r.on('exit', function (code) {
    console.log('Local script terminated.');
  });
}

function runJavaScript(exists, filename, options)
{
  if(!exists)
  {
    console.log("'" + filename + "' not found...");
    return false;
  }
  var command = "node " + filename + " " + options;
  console.log(command);
  var r = runner.exec(command,
    function(err, stdout, stderr) { console.log(stdout);}
  );
  console.log(filename + " launched by the server...");
  r.on('exit', function (code) {
    console.log('Done.');
  });
}

function webComm(websocket)
{
  websocket.emit('notification', 'Server online via websocket!');
  websocket.on('interface',
    function (data)
    {
	    var app = data.app;
      var params = data.params;
      console.log("App: " + app);
	    switch(app)
	    {
		   case 'explorer':
        console.log(" ");
			  console.log("Explorer: " + app);
			  explorer.shell(websocket, fs, params);
			  break;
       case 'javascript':
       	var scriptname = params.scriptname;
        console.log("JavaScript: " + scriptname);
	     	fs.exists(scriptname, function(result) {
          runJavaScript(result, scriptname, params.options)
        });
        break;
       case 'php':
       default:
       	var scriptname = params.scriptname;
        var interpreter = data.interpreter;
        console.log("PHP: " + scriptname);
	     	fs.exists(scriptname, function(result) {
          runScript(result, interpreter, scriptname, params.options)
        });
        break;
	    }
    }
  );

}


function loadBrowser(filename)
{
	var browserName = explorer.config.browser;
    console.log("browsername " + browserName);
    console.log("test2 " + explorer.config[browserName]);
    var browser = explorer.config[browserName];
    if(browserName='')
    {
        browser = explorer.config.chrome;
        browserName='Chrome';
    }
    browser = browser.replace('Program Files (x86)','Progra~2');
    browser = browser.replace('Program Files','Progra~1');
    console.log('browser= '+browser);
	var param="localhost:1000/" + filename;
	console.log("Loading...");
	fs.exists(browser, function(result) {
		if(!result) { console.log("File not found " + browser); return ''; }
		var command = browser + " " + param;
		console.log("Running " + command);
		runner.exec(command, function(err, stdout, stderr) {
      console.log("Terminated. "+ stderr);
    });
	});
    return browserName;
}

explorer.loadIni("node.ini");
var server = http.createServer(getFilename); // Create a server to display the interface
server.listen(1000);
console.log("Server available...");
var browserName = loadBrowser('tiloid.html');
if(browserName='')
    console.log("Error, browser not found.");
else
    console.log("Browser "+browserName+" loaded. Port 1000 ready.");

// Create a TCP server to communicate with native script
var nativeserver = net.createServer(function(n) { nativeComm(n);});
nativeserver.listen(1001, '127.0.0.1');
console.log('TCP local server active on port 1001.');

// Create a websocket connection
var listener = websocket.listen(server, { log: false });
console.log("WebSocket started on port 1000.");
listener.sockets.on('connection', function (websocket) { webComm(websocket);} );
