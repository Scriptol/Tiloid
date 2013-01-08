``
`` One Link
`` Part of Link Checker Pro
`` Check the access to a web page in HTTP mode and view returned header.
`` Licence: GPL
``
`` (c) 2008 Scriptol.com
``

// Obtain the HTTP status code for a given web page
// 200=OK  301=redirect 404=missing

int sockAccess(text url, boolean retry)
  text errno
  text errstr
  text page
  text site
  dyn fp

  int l = strpos(url, "/", 8)
  if l < 1
    site = url[7 ..]
    page = "/"
  else  
    site =  url[7 -- l]
    page = url[ l .. ]
  /if  
  
  fp = @fsockopen(site, 80, errno, errstr, 30);
  if fp = false 
     print "Error $errstr ($errno) for $url viewed as site:$site page:$page"
     return 0
  /if  
  
  text out = "GET /$page HTTP/1.1\r\n"
  out  + "Host: $site\r\n"
  out  + "Connection: Close\r\n\r\n"

  fwrite(fp, out)
  text content = @fgets(fp, 320)
  text code = trim(substr(content, 9, 4))
  fclose(fp)

  print "Code: $code"
    
  int icode = intval(code) 
  if (icode = 404) and retry
    file f = @fopen(url, "r")
    if f <> nil
        text cnt = @fread(f, 128)
        if strlen(trim(cnt)) > 0 
            print "Retry succeeded, not really broken"
        /if    
        fclose(f)
    /if    
  /if  

  print "Returned: $content"  

return icode  



`` convert local to URL and to unix

text setURL(text name)
	for int i in 0 -- name.length()
		if name[i] = "\\" let name[i] = "/"
	/for
return name	


`` test if this is a remote  address (host included in the string)

boolean hasProtocol(text theurl)
	text lowname = theurl.ltrim().lower()
	if lowname[ .. 6] = "http://"	return true
	if lowname[ .. 5] = "ftp://" 	return true
	if lowname[ .. 7] = "https://"	return true
return false

void usage()
    print "One Link - Part of Link Checker Pro at scriptol.com"
    print "Syntax:"
    print "    solp onelink url"
    print "or  php onelink.php url"    
    print "(url must start by http://)"
    exit(0)
return

int main(int argc, array argv)

    if argc < 2 let usage()
    
    text url = argv[1]
    print "Checking $url"
    if url.length() < 8 return 0  
    if url[ .. 6].lower() <> "http://" let usage()
      
    sockAccess(url, true)    

return 0

main($argc, $argv)

