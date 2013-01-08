``
`` Scriptol Link Checker 1.4
`` (c) 2008-2012 Scriptol.com
`` Free under the GNU GPL 2 License.
`` Requires the PHP interpreter.
`` Sources are compiled with the Scriptol PHP compiler 7.0
`` www.scriptol.com 
``
`` The program checks the page of a website for broken links.
`` Read the manual for details of use at: 
``   http://www.scriptol.com/scripts/link-checker.php.
``
``
`` This program is free software; you can redistribute it and/or modify
`` it under the terms of the GNU General Public License as published by
`` the Free Software Foundation; either version 2 of the License, or
`` (at your option) any later version.
``
`` This program is distributed in the hope that it will be useful,
`` but WITHOUT ANY WARRANTY; without even the implied warranty of
`` MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
`` GNU General Public License for more details.
``
`` You should have received a copy of the GNU General Public License
`` along with this program; if not, write to the Free Software
`` Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
``

include "path.sol"
include "dom.sol"
include "url.sol"

boolean RECURSE = false     // True to scan the whole site
boolean PROCESSDEFAULT = true  // Check for duplicate URLs due to trailing slash   

int counter       // Number of links checked
int brocount      // Number of broken links
int redcount      // Number of redirects

array params = {}
array checked = {}  // List of checked links
array scanned = {}  // List of scanned pages

// How to use this program

void usage()
	print
	print "Link Checher - (c) 2008-2012 Scriptol.com - Freeware."
	print "----------------------------------------------------"
	print "Syntax:"
	print "  solp linche [options] url"
	print "Options:"
	print "  -r follow links (default the page only)."
	print "  -s show a short list, only broken and internal redirects."
	print "  -f faster. You may add a specific timeout value, ex: -f10."
	print "  -v verbose, display more infos."
	print "  -q quiet, display nothing."
	print "Arguments:"
	print "  url: http address of a page, usually the home page."
	print "Logs stored into links.log."
	print "More info at: http://www.scriptol.com/scripts/"
	exit(0)
return

// Extract website and webpage's filename

text, text splitSite(text url)
    int pos = url.find('/', 8)
    if pos = nil  // no file
        text ext = Path.getExtension(url)
        if ext not in extensions return url, ""  // site only 
        terminate("$url not a valid url")
    /if    
    text site = url[0 -- pos]
    text filename = url[pos + 1 ..]
return site, filename    

// Internal link with protocol and website?

boolean isInternal(text url)
    int l = website.length()
    url = url.lower()
    
    if website = url[0 -- l] return true
return false    


int checkLink(text url)
    counter + 1
    if DEBUG let show("Checking $url")
    int status = @sockAccess(url, FORCERETRY)
    if status 
    = 404:
       display(status, url, true)
       brocount + 1 
    = 301:
       if SHORTLIST
        if(not isInternal(url)) return status
       /if  
       display(status, url, true)
       redcount + 1 
    = 302:       
       display(status, url, false)
    = 200:
       display(status, url, false)
    = 0:
       if SHORTLIST return status
       display(status, url, true)   
    else
       if SHORTLIST return status
       display(status, url, false)       
    /if  
    checked[url] = status
return status


//  Extract links and return an array of the list

array pageScan(text fname, text caller)

  DOMNode current = null
  DOMElement elem = null
  boolean xres
  
  array links = {}
 
  DOMDocument d = DOMDocument()
  
  ~~
    $xres = @$d->loadHTMLFile($fname);
  ~~  

  if xres = false
     show("Error \"$fname\" not found in $caller")
     brocount + 1
     return array()
  /if  

  DOMNodeList dnl = d.getElementsByTagName("a")
  if dnl.length = 0 return {}
  for int i in 0 .. dnl.length
    current = dnl.item(i)
    if current = null continue
    elem = current
    if elem.hasAttribute("href")
      links.push(elem.getAttribute("href"))
    /if
  /for
  
return links


// Checking the page

void httpCheck(text page, text caller)

	array links
	array todo
	text reldir, src, ext

    if trim(page) = nil return
    if page[0] = "." return
    if @array_key_exists(page, scanned) return
    scanned[page] = 200
    checked[page] = 200
        
    if DEBUG let show("Entering $page")
    if WEBINTERFACE
      differed = "<br><b><a href='$page' target='_blank'>$page</a></b>"
    else
      differed = "\n$page\n" + "-".dup(page.length())
    /if
    DIFFEREDFLAG = true

        text infos = pathinfo(page)
        reldir = @strtolower(infos['dirname'])
        src = @strtolower(infos['filename'])
        ext = @strtolower(infos['extension'])

    if substr(page, -1, 1) = "/"
        int l = strlen(website)
        reldir = page // substr(page, 0, l)
        src = ""
   
    else        
        infos = pathinfo(page)
        reldir = @strtolower(infos['dirname'])
        src = @strtolower(infos['filename'])
        ext = @strtolower(infos['extension'])
        if ext <> nil
            ext = "." + ext 
            if ext not in extensions return
            src + ext
        /if    
    /if

    if DEBUG let show("Processing  $reldir/$src")
   
    links = pageScan(page, caller) 
    if links.size() = 0 return         // get list of links into links  
    
    int l = links.size()
    for int i in 0 -- l
        text link = links[i]
        if link = nil continue
        if link[0] = "#"  continue
        if link[0] = "/"  let link = Path.merge(website, link)
        int p = strpos(link, "#", 0)
        if p <> 0
          link = link[0 -- p]
        /if
        if not hasProtocol(link)
            if link.length() > 11
                if link[ .. 10] = "javascript:"
                   if DEBUG let show("Skipped javascript.") 
                   continue
               /if     
            /if           
            if link.length() > 6
                if link[ .. 2 ] = "../" 
                    if VERBOSE let show("Should be absolute: $link in $page")
                    continue
                /if
                if link[ .. 6] = "mailto:"
                    if DEBUG let show("Skipped mailto.") 
                    continue
                /if     
            /if
            link = Path.merge(reldir, link)
        /if

        if trim(link) = nil continue 
        if @array_key_exists(link, checked) 
           display(checked[link], link, false)
           continue
        /if   
        
        if isInternal(link)
            if PROCESSDEFAULT
                if link[ -1 ..] = "/" 
                    text home = findDefault(link)
                    if @array_key_exists(home, checked) = false
                       checked[home] = 200
                    /if   
                /if
            /if
            todo.push(link)
        /if
        int st = checkLink(link)
        checked[link] = st
   /for

   // scan pages that are internal and checked, but not scanned yet 
   for text link in todo
       if @array_key_exists(link, scanned) continue
       if @array_key_exists(link, checked) = false continue
       if checked[link] = 200
            httpCheck(link, page)
       /if     
   /for         

return


// Connect in http mode and call the checking function

void httpProcess(text page)
    if page[ -1 ..] = "/"
        page = findDefault(page)
    /if
    httpCheck(page, "command line")
return



// Parsing command line parameters
// Stored into an array to overcome problems with PHP's global variables

void processCommand(int argnum, array arguments)

	text opt

	if argnum <  2
		usage()
	/if	

	for text param in arguments
		if param.length() > 1
			opt = param[1]
		else
			usage()
		/if
        
    if param[0] = "-"
		  if opt 
       = "v" 
	   		 VERBOSE = true
		  	 continue
       = "q" 
			   QUIET = true
			   continue
       = "u" 
  			 DEBUG = true
	   		 continue
       = "r"
         RECURSE = true
         continue
       = "y"
         FORCERETRY = true
         continue
       = "s"
         SHORTLIST = true
         continue
       = "f"
         TIMEOUT = 5
         text speed= param[2 ..]
         if speed != nil let TIMEOUT = intval(speed)
         continue
       = "w"
         WEBINTERFACE = true
         continue   
       else
          show("Unknown command $param")  
          usage()                
          continue                 
		  /if
		/if
    
		if param[ .. 4] = "http:"
			server = param
			continue
		/if	

		if server = nil
			server = param
			continue
		/if	
		
		show("Unknown command $param")
    usage()
		
	/for

    if server = nil 
       terminate("You must provide a URL.")
    /if
  
	params["server"] = server

return



int main(int argc, array argv)
    global brocount
    global redcount
    global counter

    text filename

	array x = argv[ 1 .. ]
	
	processCommand(argc, x)

    server = params["server"]
  
    if not hasProtocol(server)
        server = "http://" + server
    /if  

    website, filename = splitSite(server)
    website = website.lower()
    
    domain = website[7 ..]    
    if substr(domain, -1, 1) = "/"
      domain = domain[ .. -1]
    /if
    
    baseLength = strlen(domain) + 7    // base is domain plus protocol

    if not QUIET
        if VERBOSE = true let show("Verbose mode enabled")
        if DEBUG = true let show("Debug mode enabled")
        show("Website is $website")
        show("Domain is $domain")
        show("Starting from $server")
    /if

    log = fopen("links.log", "w")	
    httpProcess(server)
    
    int sp = scanned.size()
    log.write("$brocount broken links, ")
  	log.write("$redcount redirects, in ")
    log.write("$counter links checked in $sp pages.")
    log.close()
	
    if QUIET return 0
	
    text space =""
    if WEBINTERFACE let space="<br>"
    show("$space$brocount broken links, $redcount redirect, in $counter links checked in $sp pages.")
	
return 0

main($argc, $argv)
