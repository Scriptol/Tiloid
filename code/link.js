/*
	Tiloid loader
	(c) 2012 Denis Sureau 
	
	License Creative Common.
*/	

var tiloid_root = location.href;
var tiloid_thumbnail = tiloid_root.replace(".html", ".png");

function tiloid_fullscreen()
{
	parent.location.href=tiloid_root;	
}
function tiloid_mousein(e) { e.style.cursor="pointer";}
function tiloid_mouseout(e){ e.style.cursor="default";}

function tiloidStart()
{
	if(window.innerWidth <= 240)
	{
		var z = new Image();
		z.src = tiloid_thumbnail;
		document.body.background=z.src;	
		var x = document.createElement("div");
		document.body.innerHTML = "";
		document.body.appendChild(x);
		document.body.style.padding = "0";
		document.body.style.margin = "0";
		document.body.parentNode.style.padding="0";		
		x.style.width="240px";
		x.style.height="160px";
		
		if (x.addEventListener) {
			x.addEventListener('dblclick', tiloid_fullscreen, false);
			x.addEventListener('onmouseover', tiloid_mousein, false);
			x.addEventListener('onmouseout', tiloid_mouseout, false);
		}	
		else {
			x.attachEvent('ondblclick', tiloid_fullscreen);  
			x.attachEvent('onmouseenter', tiloid_mousein);  
			x.attachEvent('onmouseleave', tiloid_mouseout);  
		}	
	}
}

function tiloid_addOnload(f) 
{
  var currOnload = window.onload;
  window.onload = function() 
  {
      f();
      if(currOnload) currOnload();	  
  }
}
tiloid_addOnload(tiloidStart);
