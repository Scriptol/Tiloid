/* File Chooser
   File input replacement with path and default value
   for local use of JavaScript on the desktop.
   (c) 2012 By Denis Sureau.
   
   License LGPL 3.0.
   Free to use provided this copyright notice is not removed.

   Requires:
   - Node.js.
   - A WebSocket connection opened with the server.
   - The Explorer.js module.
*/


var currentpath = new Array();

function fileButton(target)
{
	var filepath = currentpath[target];  // to do : be persistent
	var query = { 'app' : 'explorer', 'params': { 'path' : filepath, 'command': 'getdir', 'target': target } } ;
	socket.emit('interface', query);
}

/*
function buildDir(filepath, fname, id)
{
	var balise ="<div class='dir' onDblClick='chDir(\"" + fname + "\",\"" + id + "\")' onClick='sel(this)'>";
  balise += '<img src="images/dir.png">';
	balise += fname;
	balise += "</div>";
	return(balise);
}
*/

function buildDir(filepath, fname, id)
{
  var balise = document.createElement('div');
  balise.setAttribute('class', 'dir');
  balise.ondblclick=function() { chDir(fname,id); };
  balise.onclick=function(){ sel(this); };
  
  var img = document.createElement('img');
  img.src = "images/dir.png";
  balise.appendChild(img);
  
  balise.innerHTML = fname;  
	return(balise);
}


/*
function buildLink(filepath, fname, id, timesize, ext)
{
	filepath = filepath.replace(/\\/gi, '/');
  var sep = '/';
  if(filepath.slice(-1) == '/')   sep = '';
	var fpath = 'file:///' + filepath + sep + fname;
	var balise ="<div class='file' onDblClick='view(\"" + fpath+ "\",\"" + id + "\")' onClick='sel(this)' oncontextmenu='return rsel(this)'>";
  balise += '<img src="';
  switch(ext)
  {
    case 'gif':
    case 'jpg':
    case 'png':
    case 'jpeg':
          balise += 'images/img.png';
          break;
    case 'htm':
    case 'html':
    case 'php':
    case 'asp':
          balise += 'images/web.png';
          break;  
    case 'zip':
          balise += 'images/zip.png';
          break;
    case 'bak':
    case 'tmp':
          balise += 'images/trash.png';
          break;  
    case 'exe':
    case 'jar':
          balise += 'images/app.png';
          break;                           
    default:
          balise += 'images/doc.png'
  }
  balise += '">'; 
	balise += fname;
  balise += '<span class="timesize">' + timesize + '</span>'; 
	balise += '</div>';
	//balise += " (" + fpath + ")";
	return(balise);
}
*/

function buildLink(filepath, fname, id, timesize, ext)
{
	filepath = filepath.replace(/\\/gi, '/');
  var sep = '/';
  if(filepath.slice(-1) == '/')   sep = '';
	var fpath = 'file:///' + filepath + sep + fname;
  
  var balise = document.createElement('div');
  balise.className = 'file';
  balise.ondblclick=function() {view(fpath, id);};
  balise.onclick=function() { sel(this); };
  balise.oncontextmenu=function(){ return rsel(this)};
  
  var img = document.createElement('img');  
  balise.appendChild(img);

  var src;  
  switch(ext)
  {
    case 'gif':
    case 'jpg':
    case 'png':
    case 'jpeg':
          src= 'images/img.png';
          break;
    case 'htm':
    case 'html':
    case 'php':
    case 'asp':
          src= 'images/web.png';
          break;  
    case 'zip':
          src= 'images/zip.png';
          break;
    case 'bak':
    case 'tmp':
          src= 'images/trash.png';
          break;  
    case 'exe':
    case 'jar':
          src= 'images/app.png';
          break;                           
    default:
          src= 'images/doc.png'
  }
  img.setAttribute('src', src);
  img.src=src;
  balise.innerHTML = fname;
  balise.innerHTML += '<span class="timesize">' + timesize + '</span>'; 

	return(balise);
}

/* File Display
  Display a list of files and directories.
  Filtered to images.
  - Call buildLink on images.
  - Call buildDir on directories.
  
  Input: the id of the tag to store the list, 
  and the list as an array of name and the common path.

*/

function imageList(content)
{
	//alert(target);
	var d = document.getElementById(content.target);

	//alert("filedisplay  target:" + d + " content: " + content);
	var filepath = content['path'];
	var dir = content['list'];
	var page = "<div class='filechooser'>";
	page += "<p class='path'>" + filepath + "</p>";
	page += "<div class='files'>";
	var dirlist = "";
	var filelist ="";
	for(var i = 0; i < dir.length; i++)
	{
		var item = dir[i];
		var type = item[0];
		var name = item[1];

		if(type=='dir')
		{
			dirlist += buildDir(filepath, name, content.target) + "<br>";
		}
		else
		{
      var timesize = item[2];     
			var p = name.lastIndexOf('.');
			var ext = name.slice(p + 1);
			switch(ext) {
			case 'gif': break;
			case 'png': break;
			case 'jpg': break;
			case 'jpeg': break;
			default: continue;
			}
			filelist += buildLink(filepath, name, content.target, timesize) + "<br>";
		}
	}
	page += dirlist;
	page += filelist;
	page += "</div>";
	page += "</div>";
	d.innerHTML = page;
}

/*
  Displays a list of files and dirs.
  Called by the interface when a 'dirdata' event is received
  from the server.
*/

/*
function fileList(content)
{
	//alert(content.path);
	var d = document.getElementById(content.target);
  var extmask = content.extmask; 

	//alert("filedisplay  target:" + d + " content: " + content);
	var filepath = content['path'];
  
  var fpathid = content.target + "path";
  var fpath = document.getElementById(fpathid);
  fpath.value = filepath;
  
	var dir = content['list'];
	var page = "<div class='filechooser'>";
	//page += "<p class='path'>" + filepath + "</p>";
	page += "<div class='flist'>";
	var dirlist = "";
	var filelist ="";
	for(var i = 0; i < dir.length; i++)
	{
		var item = dir[i];
		var type = item[0];
		var name = item[1];

		if(type=='dir')
		{
			dirlist += buildDir(filepath, name, content.target) + "<br>";
		}
		else
		{
      var timesize = item[2];    
			var p = name.lastIndexOf('.');
			var ext = name.slice(p + 1);
			if(extmask && ext != extmask) continue; 
			filelist += buildLink(filepath, name, content.target, timesize, ext) + "<br>";
		}
	}
	page += dirlist;
	page += filelist;
	page += "</div>";
	page += "</div>";
	d.innerHTML = page;
}
*/

function fileList(content)
{
	//alert(content.path);
	var d = document.getElementById(content.target);
  var extmask = content.extmask; 

	//alert("filedisplay  target:" + d + " content: " + content);
	var filepath = content['path'];
  
  var fpathid = content.target + "path";
  var fpath = document.getElementById(fpathid);
  fpath.value = filepath;
  
	var dir = content['list'];
  
  var page = document.createElement('div');
  page.className = 'filechooser';
	d.appendChild(page);  
  
  var flist = document.createElement('div');
  flist.className='flist';
  page.appendChild(flist);

	for(var i = 0; i < dir.length; i++)
	{
		var item = dir[i];
		var type = item[0];
		var name = item[1];

		if(type=='dir')
		{
      flist.appendChild(buildDir(filepath, name, content.target));
		}
		else
		{
      var timesize = item[2];    
			var p = name.lastIndexOf('.');
			var ext = name.slice(p + 1);
			if(extmask && ext != extmask) continue; 
			flist.appendChild(buildLink(filepath, name, content.target, timesize, ext));
		}
	}

}

// change dir called by the interface

function chDir(filepath, id)
{
	if(filepath.slice(0, 8) == "file:///")
		filepath = filepath.slice(8);

	var a = {  'app': 'explorer', 
             'params' : { 
                   'file': 'code/chooser.js', 
                   'command': 'chdir', 
                   'path': filepath,
                   'target': id 
                  }
          };
	socket.emit('interface', a);
}

function view(filepath, id)
{
  var p = filepath.lastIndexOf('.');
	var ext = filepath.slice(p + 1);
  switch(ext)
  {
    case 'gif':
    case 'png':
    case 'jpg':
    case 'jpeg':
    	if(filepath.slice(0, 8) == "file:///")
		    filepath = filepath.slice(8);
        
      var a = {  'app': 'explorer', 'params' : { 'command': 'loadimage', 'path': filepath, 'target': id } };
      socket.emit('interface', a);
      break;
    default:
    	if(filepath.slice(0, 8) != "file:///" && filepath.slice(0, 5) != 'http:')
		    filepath = "file:///" + filepath;
      var a = {  'app': 'explorer', 'params' : { 'command': 'viewtext', 'path': filepath, 'target': id  } };
      socket.emit('interface', a);
      break;    
  }  
        
}

function nodeClear(node)
{
  var child = node.firstChild;
  while(child)
  {
    child.style.fontWeight = 'normal';
    child.style.border = 'none';
    child.style.backgroundColor = 'white';
    child = child.nextSibling;
  }  
}

function deselectAll(parent)
{
	var child = parent.firstChild; // child of flist
  //alert(parent + " " + parent.innerHTML);
	while(child)
	{
		if(child.style.fontWeight == 'bold')
		{
      child.style.fontWeight = 'normal';
      child.style.border = '1px dotted white';
      child.style.backgroundColor = 'white';    
		}
		child = child.nextSibling;
	}  	  
}

function sel(element)
{
  if(element.style.fontWeight == 'bold')
  {
    element.style.fontWeight = 'normal';
    element.style.border = '1px dotted white';
    element.style.backgroundColor = 'white';
  }
  else
  {
    if(!isCTRL) deselectAll(element.parentNode);    
    element.style.fontWeight = 'bold';
    element.style.border = '1px dotted #000';
    element.style.backgroundColor = '#BEDDF8';	
  }    
}

/*
  Context menu
*/  

var xMousePosition = 0;
var yMousePosition = 0;

document.onmousemove = function(e)
{
  xMousePosition = e.clientX + window.pageXOffset;
  yMousePosition = e.clientY + window.pageYOffset;
};

function rename(element)
{
	alert("Rename");
}

function edit(element)
{
	alert("Edit");
}

function rsel(element)
{
  var x = document.getElementById('ctxmenu1');
  if(x) x.parentNode.removeChild(x); 
  
  var parent = element.parentNode; 
  
  //alert(parent.className);
  
  var d = document.createElement('div');
  parent.appendChild(d);
  d.id = 'ctxmenu1';
  d.setAttribute('class', 'ctxmenu');
  d.style.left = xMousePosition;
  d.style.top = yMousePosition;

  d.onmouseover = function(e) { this.style.cursor = 'pointer'; } 
  d.onclick = function(e) { parent.removeChild(d);  }
  document.body.onclick = function(e) { parent.removeChild(d);  }
  
  var xx = document.createElement("p");
  d.appendChild(xx);
  xx.innerHTML =  xMousePosition + " " + yMousePosition + " " + d.style.top;  
    
  var p = document.createElement('p');
  d.appendChild(p);
  p.onclick=function() { rename(element) };
  p.setAttribute('class', 'ctxline');
  p.innerHTML = "Rename"; 
  
  var p2 = document.createElement('p');
  d.appendChild(p2);
  p2.onclick=function() { edit(element) };  
  p2.setAttribute('class', 'ctxline');
  p2.innerHTML = "Edit"; 

  alert(d.className + " " + d.style.left + " " + d.style.position + " " + d.style.width);

  return false;

}

/*
  getSelected(panelname)
  Return the list of selected items in a panel
  Items are <div> tags
*/

function getSelected(source)
{      
  var source = document.getElementById(source);
	var parent = source.firstChild;	// chooser
	var slist = new Array();
	var child = parent.firstChild.firstChild; // path.flist
	while(child)
	{
		if(child.style.fontWeight == 'bold')
		{
			slist.push(child);
      //alert(child.innerHTML);
		}
		child = child.nextSibling;
	}  	
	//alert("selection : " + slist.length + " items");
	return slist;  
}

/* Extract name of selected item
*/
function getNameSelected(item)
{
    var data = item.innerHTML;
    var p = data.indexOf('>');
    var name = data.slice(p + 1);
    p = name.indexOf('<');
    if(p > 0)
      name = name.slice(0, p);
    return name;  
}

/*
  getSelectedNames(panelname)
  Return the list of selected filename or dirnames
*/

function getSelectedNames(source)
{
  var namelist = new Array();
  var slist = getSelected(source);
	for(i = 0; i < slist.length; i++)
	{
    var elem = slist[i].innerHTML;
    var p = elem.indexOf('>');
    elem = elem.slice(p+1);
    p = elem.indexOf('<');
    if(p > 0)
      elem = elem.slice(0, p);
    namelist.push(elem);
  }
  //alert("selection : " + namelist.join(' '));
	return namelist;    
}

/*
  selectToDelete(panelname)
  Cross files selected to be deleted
*/  

function selectToDelete(source)
{
  var slist = getSelected(source);
	for(i = 0; i < slist.length; i++)
	{
		var element = slist[i];
    element.style.border = 'none';
    element.style.backgroundColor = 'white';
    element.style.textDecoration = 'line-through';
    element.style.color = 'red';
	}
}

var isCTRL = false;
document.onkeyup=function(evt)
{
	if(evt.keyCode == 17) isCTRL=false;
}
document.onkeydown=function(evt)
{
	if(evt.keyCode == 17) isCTRL=true;
}

