``
`` URL - Scriptol Library
`` http://www.scriptol.com/compiler/
`` Licence: LGPL
``
`` (c) 2008-2012 Scriptol.com
``

boolean DEBUG = false
boolean VERBOSE = false
boolean QUIET = false
boolean FORCERETRY = true
boolean SHORTLIST = false
boolean WEBINTERFACE = false
int TIMEOUT = 30

text website = ""   // the website base URL (protocol, domain, tld)
text server = ""    // url parameter
text domain = ""    // website without protocol
int baseLength = 0

text differed
boolean DIFFEREDFLAG

array extensions = {".html", ".php", ".htm", ".php3", ".php4", ".php5", ".asp",
    ".shtml", ".dhtml", ".jsp", ".xhtml", ".stm"}

file log

void show(text data)
  if not WEBINTERFACE
    print data
    return
  /if

  boolean socket = socket_create($(AF_INET), $(SOCK_STREAM), $(SOL_TCP))
  if socket = false let die("Not created")
  boolean sc = socket_connect(socket, '127.0.0.1', '1001')
  if sc = false let die(socket_strerror(socket_last_error()))
  socket_write(socket, data)
  socket_close(socket)

return

void terminate(text data)
  show(data)
  exit(0)
return 

void cdisplay(text line)
    log.write(line)
    log.write("\n")
    if not QUIET let show(line)
return     

void display(dyn message, text url, boolean flag)
    int i = intval(message)
    if WEBINTERFACE
      url = "<a href='$url' target='_blank'>$url</a>"
    /if
    if message 
    = 404:
       message = "Broken   "
    = 301:
       message = "Redirect "
    = 200:
       message = "OK       "
    = 0:
       message = "Unknow   "   
    /if      
    if VERBOSE or (flag = true)
       if DIFFEREDFLAG
          cdisplay(differed)
       /if
       show("$message $url")
       log.write("$message $url\n")
       DIFFEREDFLAG = false
    /if
return   


// Obtain the HTTP status code for a given web page
// 200=OK  301=redirect 404=missing

int sockAccess(text url, boolean retry)
  text errno
  text errstr
  text page
  text site
  dyn fp = false

  if url.length() < 8 return 0  
  if url[ .. 6].lower() <> "http://" return 0
    
  int l = strpos(url, "/", 8)
  if l < 1
    site = url[7 ..]
    page = "/"
  else  
    site =  url[7 -- l]
    page = url[ l .. ]
  /if  
  
  ~~
  try
  {
  ~~
  fp = fsockopen(site, 80, errno, errstr, TIMEOUT);
  ~~    
  }
  catch(Exception $e) {;} 
  ~~  

  if fp = false 
     show("Time out: $url")
     return 0
  /if
  
  text out = "GET /$page HTTP/1.1\r\n"
  out  + "Host: $site\r\n"
  out  + "Connection: Close\r\n\r\n"

  fwrite(fp, out)
  text content = fgets(fp)
  text code = trim(substr(content, 9, 4))
  fclose(fp)
  
  int icode = intval(code) 
  if (icode = 404) and retry
    file f = @fopen(url, "r")
    if f <> nil
        text cnt = @fread(f, 128)
        if strlen(trim(cnt)) > 0 let icode = 200
        fclose(f)
    /if    
  /if  

return icode  


// for php 5

boolean url_exists(text url)
    int status = sockAccess(url, false)
    if DEBUG let show("$url code $status")
    if status <> 200 return false
return true


text findDefault(text thedir)
    text url

    for text ext in extensions
        url = thedir + "index" + ext
        if url_exists(url) return url
    /for

    for text ext in extensions
        url = thedir + "default" + ext
        if url_exists(url) return url
    /for

    for text ext in extensions
        url = thedir + "home" + ext
        if url_exists(url) return url
    /for

    for text ext in extensions
        url = thedir + "accueil" + ext
        if url_exists(url) return url
    /for
        
    url = thedir + "index"
    if url_exists(url) return url
    url = thedir + "home"
    if url_exists(url) return url
    url = thedir +  "accueil"
    if url_exists(url) return url
    url = thedir +  "default"
	 if url_exists(url) return url	
	
return thedir


`` convert local to URL and to unix

text setURL(text name)
	for int i in 0 -- name.length()
		if name[i] = "\\" let name[i] = "/"
	/for
return name	


text textToUTF8(text content)
	content.replace("&", "&amp;")
	content.replace("<", "&lt;")
	content.replace(">", "&gt;")
return content


`` remove trailing slash or backslash

text noSlash(text pth)
	text c = pth[ -1 ..]
	if (c = "/") or (c = "\\") return pth[ .. -2]
return pth

int siteOffset(text theurl)
   int offset = 0
   offset = theurl.find("http://")
   if offset = nil
		offset = theurl.find("ftp://")
		if offset = nil
			offset = theurl.find("https://")
			if offset <> nil
				offset + 8
			/if
		else
			offset + 6
		/if  
   else
		offset + 7
   /if
return offset
  

`` test if this is a remote  address (host included in the string)

boolean hasProtocol(text theurl)
	text lowname = theurl.ltrim().lower()
	if lowname[ .. 6] = "http://"	return true
	if lowname[ .. 5] = "ftp://" 	return true
	if lowname[ .. 7] = "https://"	return true
return false


`` return remote part and local part

text, text splitURL(text theurl)
	int offset = siteOffset(theurl)
	if offset = nil ? return "", theurl
	offset = theurl.find("/", offset)
	if offset = nil return theurl, ""
return theurl[-- offset], theurl[offset +1 ..]


`` get the remote part of URL

text getURL(text theurl)
	int offset = siteOffset(theurl)
	offset = theurl.find("/", offset)
	if offset = nil ? return theurl       ` no file or subdir
return theurl[--offset]



/**
 *	Replace / by Windows's antislash
 */	 

text setWindows(text name)
	for int i in 0 -- name.length()
		if name[i] = "/" let name[i] = "\\"
	/for
return name	



`` if drive letter in path, change drive

void changeDir(text pth)
	chdir(pth)
	if DEBUG and VERBOSE
		show("Now path is " + getcwd())
	/if	
return


`` Check if the source ends with the string search

boolean endWith(text source, text search)

	text last =  search[-1 ..]
	if (last = "/") or (last = "\\") let search = search[ .. -2 ]

	int lsea = search.length()
	int lsrc = source.length()

	if lsrc < lsea return false
	if source[- lsea .. ] = search return true
	
return false	
