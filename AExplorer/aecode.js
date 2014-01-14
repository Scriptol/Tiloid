
var socket = io.connect();
var leftpanel = document.getElementById("lpane");
var rightpanel = document.getElementById("rpane");
var currpanel = leftpanel;
var AExplorerDrag = {'lcontent': true, 'rcontent':false };
var AExplorerBMFlag = {'lcontent': false, 'rcontent':false };

function sameDir()
{
  var l = document.getElementById('lcontentpath').value;
  var r = document.getElementById('rcontentpath').value;
  return(l == r); 
}

function notification(data)
{
	var action = data.action;
	var target = data.target;
	//alert(action + " " + target);
	switch(action)
	{
		case 'update':
      if(sameDir())
      {
        panelReload('lcontent');
        target = 'rcontent';
      }
			panelReload(target);
			break;
		default:
			//alert("Unknown notification from server " + action);
	}
}

socket.on('confirm', function(data, fn) {
	var question = data.question;
	var answer = confirm(question);
	fn(answer);
});
socket.on('notification',	function(e) { notification(e); });
socket.on('dirdata', 		function(e) { 
  fileList(e);
  var target = e.target;
  currentpath[target]=e.path;
  var letter = target.charAt(0)
  var id = letter + 'star';     
  var elem = document.getElementById(id);
  elem.style.visibility="visible";
  var delid = letter + "delete";
  var img = document.getElementById(delid); 
  img.src = "images/delete.png";
  img.title="Delete selected file/dir";
  var crid = letter + "create" 
  document.getElementById(crid).title="Create directory"
  AExplorerBMFlag[target]=false;    
});

socket.on('message',		function(e) { alert(e.content); });

socket.on('status', 		function(e) { 
	document.getElementById('status').innerHTML = e.content;
});

socket.on('editor',			function(e) { displayEditor(e.content); });

socket.on('image', function(data) {
  var store = document.getElementById('rcontent');
	var imagepath = data.path;
	var ext = data.ext.slice(1);
	var i = 2;
	switch(ext.toLowerCase()) {
		case "png": i = 0;break;
		case "gif": i = 1;break;
		default:
			ext = 'jpeg';
	}
  
  var inner = document.createElement('div');
  store.innerHTML ='';
  store.appendChild(inner);
  inner.className='divimage';

  var canvas = document.createElement("canvas"); 
  canvas.setAttribute("id", "canvasid"); 
  var image = new Image();

  image.onload = function ()
  {
    var w = image.width;
    var h = image.height;
    
    var cw = store.scrollWidth;
    var ch = store.scrollHeight;

    var scalew = 1;
    var scaleh = 1;
    var ow = w;
    var oh = h;
    
    var ratio = h / w;
    var cratio = ch / cw;     
  
    if(ratio > cratio)  // to be aligned on height
    {    
       if(h > ch) {
        scaleh = ch / h;    
        scalew = scaleh;  
        h = ch;
        w *= scalew;
      }
      if(w > cw) {
        scalew = cw / w;
        scaleh *= scalew;
        w = cw;
        h = oh * scaleh;
      }
    }
    else
    {
      if(h > ch) {
        scaleh = ch / h;    
        scalew = scaleh;  
        h = ch;
        w = ow *  scalew;
      }
      if(w > cw) {
        scalew = cw / w;
        scaleh *= scalew;
        w = cw;
        h = oh * scaleh;
      }          
    }

   
    //alert(scalew + ' ' + cw + "/" + w + "  " + scaleh + " " + ch + "/"+ h);
    if(h < ch)
    {
      var offseth = (ch - h) / 2; 
      inner.style.marginTop = offseth + "px";
    }
    if(w < cw)
    {
      var offsetw = (cw - w) / 2; 
      inner.style.marginLeft = offsetw + "px";    
    }
    //alert(cw + "x" + ch + " " + offsetw + " " + offseth + "  " + w + "x" + h);
    
     
    canvas.width = w;
    canvas.height = h;
    
    inner.style.width = w + 'px';
    inner.style.height = h + 'px';
    
    inner.appendChild(canvas);
    var context = canvas.getContext("2d");
    context.scale(scalew, scaleh);      
    context.drawImage(image, 0, 0);
    
    var message = imagepath + ", " + ow + " x " + oh + " px";
    if(w < ow || h < oh)
      message += ", resized to " + w.toFixed() + " x "+ h.toFixed();
    document.getElementById('status').innerHTML = message;
  }  

	image.src = 'data:image/'+ext+';base64, ' + data.content;

});  



/*
  Utilities
*/

function getExtension(filename)
{
  var p = filename.lastIndexOf('.');
  return filename.slice(p + 1);
}  

function getCurrentDirectory(target)
{
  var panel = target + 'path';
  var path = document.getElementById(panel).value;
  var p = path.lastIndexOf('/');
  return path.slice(p + 1);
}

function checkInBookmarks(target)
{
  if(AExplorerBMFlag[target]) {
    alert("Can not do that in bookmarks!")
    return true;
  }
  return false;  
}

/*
	Top Events building
*/

var topInvert = function (target) {
	if(document.getElementById('dirpane').style.display=="none")	return;
	var x = document.getElementById('lcontentpath');
	var y = document.getElementById('rcontentpath');
	var a = { 'app' : 'explorer',
			  'params': { 'command': 'godir', 'path': x.value, 'target': 'rcontent' }
	};
	socket.emit('interface', a);

	var a = { 'app' : 'explorer',
			  'params': { 'command': 'godir', 'path': y.value, 'target': 'lcontent' }
	};
	socket.emit('interface', a);
}

var topDup = function (target) {
	if(document.getElementById('dirpane').style.display=="none")	return;	
	var x = document.getElementById('lcontentpath');
	var a = { 'app' : 'explorer',
			  'params': { 'command': 'godir', 'path': x.value, 'target': 'rcontent' }
	};
	socket.emit('interface', a);
}


var topCopy = function () 
{
	if(document.getElementById('dirpane').style.display=="none")	return;	
  if(checkInBookmarks('lcontent') || checkInBookmarks('lcontent')) return;  
	var namelist = getSelectedNames('lcontent');
	//alert(namelist);
	if(namelist.length == 0)
	{
		alert("No dir/file selected in left panel");
		return;
	}
	var left = document.getElementById('lcontentpath').value;
	var right = document.getElementById('rcontentpath').value;
	if(left == right)
	{
		alert("Can't copy a file over itself!");	
		return;
	}

	var a = { 'app' : 'explorer',
			  'params': { 'command': 'filecopy', 'list': namelist, 'source' : 'lcontent', 'target': 'rcontent',  }
	};
	socket.emit('interface', a);	
}

var topCopyRename = function(target) 
{ 
  if(checkInBookmarks('lcontent') || checkInBookmarks('lcontent')) return;
	var namelist = getSelected(target);
	if(namelist.length != 1)
	{
		alert("Select just one file to copy under a new name");
		return;
	}
  copyRename(namelist[0]);		
}

var topZip = function (target) 
{
	if(document.getElementById('dirpane').style.display=="none")	return;
  
	var namelist = getSelectedNames('lcontent');
	if(namelist.length == 0)
	{
		alert("No dir/file selected in left panel");
		return;
	} 

	var zipname = prompt("Zip archive name: ");
	if(zipname == null || zipname == '') return;	
	var p = zipname.lastIndexOf(zipname);
	if(zipname.slice(p) != "zip")	zipname += ".zip";
	
  var archiver = config.Archiver.input;
	var source = document.getElementById('lcontent');
	var target = document.getElementById('rcontent');	
	var node = source.firstChild;

	var a = { 'app' : 'explorer',
			  'params': { 'command': 'archive', 'archiver': archiver, 
                    'zipname': zipname, 'list': namelist, 
                    'source' : 'lcontent', 'target': 'rcontent' }
	};
	socket.emit('interface', a);	
}

function displayEditor(data)
{
	var dpane = document.getElementById('dirpane');
	var epane = document.getElementById('editpane');
	var edfra = document.getElementById('editor');
	var opane = document.getElementById('optpane');  

	var framedit = document.getElementById("editor");
	var fcontent = (framedit.contentWindow || framedit.contentDocument);

	if(epane.style.display=="none")
	{
		dpane.style.display = "none";
    opane.style.display = "none";
		epane.style.display = "block";
		edfra.style.display = "block";		
	}
	else
	{
		epane.style.display = "none";
		edfra.style.display = "none";				
		dpane.style.display = "block";
    if(fcontent.editor.getValue() != '')
      fcontent.editorIcon(true);
		return;				
	}

	//alert(filetype);
	if(data.content != null)
	{
    fcontent.clearDoc();
    if(data.content.length > 127)
      fcontent.editor.setValue(data.content.slice(9));
    else  
		  fcontent.editor.setValue(data.content);
		fcontent.editor.navigateFileStart()		
		var filename = data.filename;
		var filetype = data.filetype;
		fcontent.filename=filename;	
		fcontent.filetype=filetype;
		fcontent.changedStatus(false);
		document.getElementById('status').innerHTML = filename;
    fcontent.editorIcon(true);
	}
	fcontent.editor.textInput.focus();
}

var topEdit = function() {
		displayEditor({ 'content': null, 'filename': null, 'filetype':1 } );  
}

var topSetup = function() {
	var dpane = document.getElementById('dirpane');
	var epane = document.getElementById('editpane');
	var opane = document.getElementById('optpane');

	if(opane.style.display=="none")
	{
		dpane.style.display = "none";
    epane.style.display = "none";
		opane.style.display = "block";

  	var frameopt = document.getElementById("options");
    var fcontent = (frameopt.contentWindow || frameopt.contentDocument);
    fcontent.iniSetup(config, '/AExplorer/aexplorer.ini.js');    
    return;		
	}
    
	opane.style.display = "none";
	dpane.style.display = "block";		
				  
}

var topHelp = function (target) {
	var loc = window.location.pathname;
	loc = loc.slice(0, -14) +  "manual.html";
  var a = {  'app': 'explorer', 'params' : { 
        'command': 'viewtext', 
        'path': 'http://www.scriptol.fr/scripts/advanced-explorer-manuel.php' + loc, 'target': null  } };
  socket.emit('interface', a);  
}

var topQuit = function (target) {
  exitExplorer();
  if(this.history.length > 1) // from tiloid
  {
    this.history.back();  
  }
  else // from desktop
  {
	var a = { 'app' : 'explorer',
			  'params': { 'command': 'quit', }
	};
	socket.emit('interface', a);
  this.close();
  }
}

/*
	Panel Events building
*/
var panelReload = function (target) {
	var a = { 'app': 'explorer', 
              'params' : { 'file': '', 'command': 'getdir', 'path': '.',  'target': target  }
    };
	socket.emit('interface', a);
  
  AExplorerBMFlag[target] = false; 
}
var panelHome = function (target) { 
  var panel = target + 'path';
  var c = document.getElementById(panel).value;
  var np = '/';
  if(c.length > 2)
    if(c.charAt(1) == ':') np = c.slice(0,3);
  
	var a = { 'app': 'explorer', 
              'params' : { 'file': '', 'command': 'chdir', 'path': np, 'target': target  }
  };
	socket.emit('interface', a);
}
var panelUp = function(target)
{
  if(insidezip[target])
  {
    panelHome(target);
    return;
  }  
	var a = { 'app': 'explorer', 
              'params' : { 'file': '', 'command': 'dirup', 'path': '',  'target': target  }
    };
	socket.emit('interface', a);
}
var panelCreate = function(target) { 
 
  if(AExplorerBMFlag[target]) {
    var idx = (target == 'lcontent') ? 0 : 1;
    var newbm = prompt('New bookmark:');
    if(newbm) {
      bookmarkAdd(idx, newbm);
      AExplorerBMFlag[target]=false;
      computer(target);
    }  
    return;
  }   
  
	var newdir = prompt('New directory:');
	if(newdir) {
		var a = { 'app' : 'explorer',
				  'params': { 'command': 'mkdir', 'path': newdir, 'target': target }
		};
		socket.emit('interface', a);					  
	};
}

function alreadyInList(parent, name)
{
	var child = parent.firstChild; // child of flist
	while(child)
	{
    if(getNameSelected(child) == name)
      return true;  
		child = child.nextSibling;
	} 
  return false;
}


function acceptRename(oldname, newname, target)
{
	var a = { 'app' : 'explorer',
			  'params': { 'command': 'rename', 'target': target, 'oldname': oldname, 'newname' : newname }
	};
	socket.emit('interface', a);
}

var elementRename = function(spanitem, panelName) 
{
	var saved = spanitem.innerHTML;
	var p1 = saved.indexOf('>');
	var p2 = saved.indexOf('<', p1);
  if(p2 == -1)
    p2 = saved.length; 
	var oldname = saved.slice(p1 + 1, p2);
  oldname = noHTMLchars(oldname);
	//alert(saved);
	var x = document.createElement("input");
	x.setAttribute('type', 'text');
	x.setAttribute('value', oldname);
	x.setAttribute('size', '40');
  
  x.onkeypress = function(evt) {
    evt.stopPropagation();
  	var code = evt.keyCode || evt.which;
		//alert(code);
    if(code == 13)
    {
			var newname = x.value;
			if(newname)
			{
        if(alreadyInList(spanitem.parentNode, newname))
        {
          alert("Name already used");
        }
        else
        {
				  acceptRename(oldname, newname, panelName); 
				  saved = saved.slice(0, p1 + 1) + newname + saved.slice(p2);
        }	
			}
			x.blur();
    }
    else
    if(evt.ctrlKey)
    switch(code)
    {
      case 17:
	   		x.blur();
        break;
    }  	

	};
  
  x.onkeydown = function(evt) {
     evt.stopPropagation();
  }
  
	x.onblur = function(evt) { 
		spanitem.innerHTML = saved;
	};
	spanitem.innerHTML = "";
	spanitem.appendChild(x);
	x.focus();
}

var panelRename = function(panelName) 
{
  if(checkInBookmarks(panelName)) return;
  spanitem = getPointedContent(panelName);
  elementRename(spanitem, panelName);
}   

function panelFileInfo(target)
{
	var slist = getSelectedNames(target);
	if(slist.length < 1)
	{
		target = 'rcontent';
		slist = getSelectedNames(target);
		if(slist.length < 1)
		{
			alert('File info: ' + slist.length + " selected. ");
			return;
		}
	}
	var a = { 'app' : 'explorer',
			  'params': { 'command': 'dirinfo', 'target': target, 'filelist': slist }
	};
	socket.emit('interface', a, function(data){
		alert(data);								 
	});	
}



var panelDelete = function(target) 
{ 
  selectToDelete(target);
	var namelist = getSelectedNames(target);
	var message = "Delete ";
  
	if(namelist.length == 0)
	{
		alert("Nothing selected to delete");
		return;
	}
	
  if(AExplorerBMFlag[target]) {
    var idx = (target == 'lcontent') ? 0 : 1; 
    for(var i=0; i < namelist.length; i++) {
      var name = namelist[i];
      bookmarkDelete(idx, name);
    }
    AExplorerBMFlag[target]=false;
    computer(target);
    return;
  }  
  
	if(namelist.length > 1) 
		message += namelist.length + " files?";
	else
		message += namelist[0] + '?';
  	
	if(window.confirm(message) == false)
	{
		panelReload(target);
		return;
	}
  
	var a = { 'app' : 'explorer',
			  'params': { 'command': 'unlink', 'list': namelist, 'target': target }
	};
	socket.emit('interface', a);	

}

var panelGo = function(target, x) { 
	var a = { 'app' : 'explorer',
			  'params': { 'command': 'godir', 'path': x.value, 'target': target }
	};
	socket.emit('interface', a);					  
}

/*
  Displays a list of bookmarks.
  Called by the interface when a 'dirdata' event is received
  from the server.
*/


function dispBookmarks(target, bm)
{
	insidezip[target]=false;
	var d = document.getElementById(target);
  //alert(JSON.stringify(bm, null, 4));
	var extmask = false; 
	var filepath = "";
  
	var fpathid = target + "path";
	var fpath = document.getElementById(fpathid);
	fpath.value = "Computer";
  
	var listid = target + "list";
	var page = "<div class='filechooser'>";
	page += "<div class='flist' id='"+ listid +"' tabindex='0'>";
	var drivelist ="";
	var dirlist = "";
 	
	for(var i = 0; i < bm.length; i++)
	{
		var item = bm[i];
    var name = item;
		var dirtype = (name == "/" || (name.charAt(1) == ':' && name.length == 3));
 
		if(dirtype)
		{
       drivelist += buildDrive(name, target) + "<br>";
		}
		else
		{
			 dirlist += buildDir(name, target) + "<br>";
		}
	}
	
	page += drivelist;
	page += dirlist;
	page += "</div>";
	page += "</div>";
	d.innerHTML = page;
	addKeyListEvents(target);
  //if(ChooserDrag[target]) setDrag(listid);

	if(elementToSelect != null)
	{
		if(elementToSelect == '*')
			setFirstSelected(target);
		else
		{
			chooserLastSelected = null;
			elementToSelect = getElementByName(elementToSelect, target);
			sel(elementToSelect);
		} 
	}     
	elementToSelect = null;
	elementToOffset = null;

	var currdiv = document.getElementById(listid);
	currdiv.focus();
}

function bookmarkDelete(idx, name)
{
  var bm = config.Bookmarks.list[idx].select
  var tf = bm.indexOf(name)
  bm.splice(tf, 1)
}

function bookmarkAdd(idx, name)
{
  var bm = config.Bookmarks.list[idx].select
  var tf = bm.indexOf(name)
  if(tf > -1) {
    alert(name + " already in list")
    return;
  } 
  bm.push(name)
}

function computer(target)
{
  var letter = target.charAt(0);
  var id = letter + "delete";
  var delimg = document.getElementById(id);
  
  if(AExplorerBMFlag[target]) {
    panelReload(target)
    return;
  }  
  
  var idx = (target == 'lcontent') ? 0 : 1;
  var bm = config.Bookmarks.list[idx].select;
	dispBookmarks(target, bm);

  delimg.src = "images/bmdel.png";
  delimg.title = "Delete bookmark";
  AExplorerBMFlag[target] = true;
  var id = letter + 'star';     
  var elem = document.getElementById(id);
  elem.style.visibility="hidden";
  
  var crid = letter + "create" 
  document.getElementById(crid).title="Create a bookmark"

}  

function bookmark(target)
{
  if(AExplorerBMFlag[target])
  {
    alert("Already in bookmarks!");
    return;
  }
  var idx = (target == 'lcontent') ? 0 : 1;
  var bm = config.Bookmarks.list[idx].select;
  var tpath = target + 'path';
  tpath = document.getElementById(tpath).value;
  
  tpath = tpath.replace(/\\/gi, '/');
  var already = bm.some(function(x) { return (x == tpath)} );
  if(!already)
    bm.push(tpath);

  var id = target.charAt(0) + 'star';     
  var elem = document.getElementById(id);
  elem.src = "images/starlight.png";  
  setTimeout(function() { elem.src="images/star.png"; }, 500);   
	//alert(JSON.stringify(bm, null, 4));
}

function exitBookmarks()
{
    AExplorerBMFlag['lcontent']=false;
    AExplorerBMFlag['rcontent']=false;
}

// Keys

function keyScroll(code)
{
	//alert(getNameSelected(chooserLastSelected));
  var element, temp, offset;
  
  if(chooserLastSelected == null) return;
  
  var par = chooserLastSelected.parentNode

  //alert(par.parentNode.scrollHeight);
  if(code == 37)
  {
    var c = par.id.charAt(0);
    var target = c + 'content'; 
    panelUp(target);
    //elementToSelect = getCurrentDirectory(target);
    elementToSelect = '*';  
    return;
  }

  if(code == 38)
  {
    temp = chooserLastSelected.previousSibling;
    if(temp == null) return;
    element = temp.previousSibling;
    if(element == null) return;
    offset = element.offsetTop - par.parentNode.scrollTop;
    if(offset < 140 )
       par.parentNode.scrollTop -= 22;
  }  
  if(code == 40)
  {
    element = chooserLastSelected.nextSibling;
    if(element==null) return;
    element = chooserLastSelected.nextSibling.nextSibling;
    if(element==null) return;
      
    var rect = par.parentNode.getBoundingClientRect();
    var localpos = element.offsetTop - par.parentNode.scrollTop; 
    //alert(localpos + " " + rect.top + " " + rect.bottom);
   
    if(localpos + 22 > rect.bottom)
      par.parentNode.scrollTop += 22;
  }  
  if(element != null)
  {
    if(!isSHIFT && !isCTRL) deselectAll(par);  
    element.className = 'entrybold';
    chooserLastSelected = element;    
  } 
}

function keyUnzip()
{
	var namelist = getSelectedNames('lcontent');
  var zipname = document.getElementById('lcontentpath').value;
  
	if(namelist.length == 0) {
		alert("Select files to extract in the left panel.");
		return;
	}
  
  var list = config.Unarchive.list;
  var overwrite = list[0].checkbox;
  var keepath = list[1].checkbox;
  var filename = namelist[0];
  if(getExtension(filename) == 'zip')
  {
     var a = {  'app': 'explorer', 'params' : { 
     'command': 'unzip', 
     'archive': filename, 
     'overwrite': overwrite, 
     'source':'lcontent',
     'target':'rcontent' 
     }};

    socket.emit('interface', a);     
    return;
  }
  
  //alert("ctrl-u");  
  if(getExtension(zipname) == 'zip')
  {
    var a = {  'app': 'explorer', 'params' : { 
     'command': 'extract', 
     'archive': zipname, 
     'filelist': namelist,
     'overwrite': overwrite, 
     'keepath': keepath,
     'source': 'lcontent', 
     'target':'rcontent' } };
    socket.emit('interface', a);
  }  
}


/*
  These key code bypass default handlers
*/  

function passHandler(evt, code)
{
  switch(code)
  {
      case 37: 
      case 38: 
      case 40: keyScroll(code);   break; 
      case 67: topCopy(); break;
      case 85: keyUnzip(); break;
      default: break;           
  }
}

var keydownHandler = function(evt, code, target) 
{
  //alert("keyInPanel " + code + " " + target);
  switch(code)
  {
    case 46:
      panelDelete(target);
      evt.stopPropagation();
      break;  
    default:
      break;
  }
  isCTRL = false;
  return false;
}

var keypressHandler = function(evt, code, target) 
{
  //alert("keypressHandler " + code + " " + target);
  switch(code)
  {
    case 9:  // ctrl-i
      panelFileInfo(target);
      break;
    case 13: // enter
      var element = getPointedContent(target);
      var filename =  getNameSelected(element);
      //alert(target + " " + element + " " + filename);
      if(isDirectory(element))
      {
        /*
        if(filename == '..')
          elementToSelect = getCurrentDirectory(target);
        else
          elementToSelect = '*';
        */
        elementToSelect = '*';    
        chDir(filename, target);
      }  
      else
        open(element, true);        
      break;       
    case 19: // ctrl-s
      break;
    default:
      break;
  }
  isCTRL = false;
  return false;
}


// Listeners

function addKeyListEvents(target)
{
  //alert("added event to "+ target);
  var x;
  if(target=='lcontent')
    x=document.getElementById('lcontentlist');
  else  
    x=document.getElementById('rcontentlist');
 
  x.onkeypress = function(evt) {
  	var code = evt.keyCode || evt.which; 
    keypressHandler(evt, code, target);
  }
  
  x.onkeydown = function(evt) {
  	var code = evt.keyCode || evt.which; 
    keydownHandler(evt, code, target);
  }      
} 


function addEvent(id, func, target)
{
  var x = document.getElementById(id);
  if (x.addEventListener)
    x.addEventListener('click', function() { func(target)}, false);
  else
    x.attachEvent('onclick', function() { func(target)});  
} 


function addInputEvent(id, func, target)
{
  var x = document.getElementById(id);
  if (x.addEventListener)
    x.addEventListener('change', function() { func(target, x)}, false);
  else
    x.attachEvent('onchange', function() { func(target, x)});  
	
	x.onkeypress = function(evt) {
	var code = evt.keyCode || evt.which;
		if(code == 13 || code == 17) x.blur();
	};
} 


function buildEvents()
{
	addEvent('tinvert', topInvert);	
	addEvent('tdup', topDup);	
	addEvent('tcopy', topCopy);	
	addEvent('tcopren', topCopyRename, 'lcontent');  
	addEvent('tzip', topZip);		
	addEvent('tedit', topEdit);
  addEvent('topt', topSetup);  	
	addEvent('thelp', topHelp);
	addEvent('tquit', topQuit);  		
	
	addEvent('lreload', panelReload, 'lcontent');
	addEvent('lhome', panelHome, 'lcontent');
	addEvent('lup', panelUp, 'lcontent');
	addEvent('lcreate', panelCreate, 'lcontent');
	addEvent('lrename', panelRename, 'lcontent');
	addEvent('ldelete', panelDelete, 'lcontent');	
	
	addInputEvent('lcontentpath', panelGo, 'lcontent');
	
	addEvent('rreload', panelReload, 'rcontent');
	addEvent('rhome', panelHome, 'rcontent');
	addEvent('rup', panelUp, 'rcontent');
	addEvent('rcreate', panelCreate, 'rcontent');
	addEvent('rrename', panelRename, 'rcontent');			
	addEvent('rdelete', panelDelete, 'rcontent');	
	
	addInputEvent('rcontentpath', panelGo, 'rcontent');	

  // drag and drop events
   
  var darear = document.getElementById('rcontent');
  
  darear.addEventListener('dragenter', function(evnt) {
   if (evnt.preventDefault) evnt.preventDefault();
   return false;
  });   
  
  darear.addEventListener('dragover', function(evnt) {
   if (evnt.preventDefault) evnt.preventDefault();
   evnt.dataTransfer.dropEffect = 'copy';
   return false;
  });  
  
  darear.addEventListener('drop', function(evnt) {
    if (evnt.stopPropagation) evnt.stopPropagation();
    var x = evnt.dataTransfer.getData('text');
    //alert(x);
    //dropFiles(darear, evnt.dataTransfer.getData('text'));
    topCopy();
    evnt.preventDefault(); // for Firefox
    return false;
  }, false);  
	
}
