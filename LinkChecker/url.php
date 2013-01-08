<?php
//
// URL - Scriptol Library
// http://www.scriptol.com/compiler/
// Licence: LGPL
//
// (c) 2008-2012 Scriptol.com
//
$DEBUG=false;
$VERBOSE=false;
$QUIET=false;
$FORCERETRY=true;
$SHORTLIST=false;
$WEBINTERFACE=false;
$TIMEOUT=30;
$website="";
$server="";
$domain="";
$baseLength=0;
$differed="";
$DIFFEREDFLAG=0;
$extensions=array(".html",".php",".htm",".php3",".php4",".php5",".asp",".shtml",".dhtml",".jsp",".xhtml",".stm");
$log=0;
function show($data)
{
   global $WEBINTERFACE;
   if(!$WEBINTERFACE)
   {
      echo $data, "\n";
      return;
   }
   $socket=socket_create(AF_INET,SOCK_STREAM,SOL_TCP);
   if($socket===false)
   {
      die("Not created");
   }
   $sc=socket_connect($socket,'127.0.0.1','1001');
   if($sc===false)
   {
      die(socket_strerror(socket_last_error()));
   }
   socket_write($socket,$data);
   socket_close($socket);
   return;
}

function terminate($data)
{
   show($data);
   exit(0);
   return;
}

function cdisplay($line)
{
   global $log;
   fwrite($log,$line);
   fwrite($log,"\n");
   global $QUIET;
   if(!$QUIET)
   {
      show($line);
   }
   return;
}

function display($message,$url,$flag)
{
   $i=intval($message);
   global $WEBINTERFACE;
   if($WEBINTERFACE)
   {
      $url="<a href='$url' target='_blank'>$url</a>";
   }
   
   if($message===404)
   {
      $message="Broken   ";
   }
   else
   {
      if($message===301)
      {
         $message="Redirect ";
      }
   else
   {
      if($message===200)
      {
         $message="OK       ";
      }
   else
   {
      if($message===0)
      {
         $message="Unknow   ";
      }
   }}}
   global $VERBOSE;
   if($VERBOSE||($flag===true))
   {
      global $DIFFEREDFLAG;
      if($DIFFEREDFLAG)
      {
         global $differed;
         cdisplay($differed);
      }
      show("$message $url");
      global $log;
      fwrite($log,"$message $url\n");
      $DIFFEREDFLAG=false;
   }
   return;
}

function sockAccess($url,$retry)
{
   $errno="";
   $errstr="";
   $page="";
   $site="";
   $fp=false;
   if(strlen($url)<8)
   {
      return 0;
   }
   if(strtolower(substr($url,0,7))!="http://")
   {
      return 0;
   }
   $l=strpos($url,"/",8);
   if($l<1)
   {
      $site=substr($url,7);
      $page="/";
   }
   else
   {
      $site=substr($url,7,$l-(7)+strlen($url)*($l<0));
      $page=substr($url,$l);
   }
   
  try
  {
  
   global $TIMEOUT;
   $fp=fsockopen($site,80,$errno,$errstr,$TIMEOUT);

   
  }
  catch(Exception $e) {;}
  
   if($fp===false)
   {
      show("Time out: $url");
      return 0;
   }
   $out="GET /$page HTTP/1.1\r\n";
   $out.="Host: $site\r\n";
   $out.="Connection: Close\r\n\r\n";

   fwrite($fp,$out);
   $content=fgets($fp);
   $code=trim(substr($content,9,4));
   fclose($fp);
   $icode=intval($code);
   if(($icode===404)&&$retry)
   {
      $f=@fopen($url,"r");
      if($f!=false)
      {
         $cnt=@fread($f,128);
         if(strlen(trim($cnt))>0)
         {
            $icode=200;
         }
         fclose($f);
      }
   }
   return $icode;
}

function url_exists($url)
{
   $status=sockAccess($url,false);
   global $DEBUG;
   if($DEBUG)
   {
      show("$url code $status");
   }
   if($status!=200)
   {
      return false;
   }
   return true;
}

function findDefault($thedir)
{
   $url="";
   global $extensions;
   reset($extensions);
   do
   {
      $ext= current($extensions);
      $url=$thedir."index".$ext;
      if(url_exists($url))
      {
         return $url;
      }
   }
   while(!(next($extensions) === false));

   global $extensions;
   reset($extensions);
   do
   {
      $ext= current($extensions);
      $url=$thedir."default".$ext;
      if(url_exists($url))
      {
         return $url;
      }
   }
   while(!(next($extensions) === false));

   global $extensions;
   reset($extensions);
   do
   {
      $ext= current($extensions);
      $url=$thedir."home".$ext;
      if(url_exists($url))
      {
         return $url;
      }
   }
   while(!(next($extensions) === false));

   global $extensions;
   reset($extensions);
   do
   {
      $ext= current($extensions);
      $url=$thedir."accueil".$ext;
      if(url_exists($url))
      {
         return $url;
      }
   }
   while(!(next($extensions) === false));

   $url=$thedir."index";
   if(url_exists($url))
   {
      return $url;
   }
   $url=$thedir."home";
   if(url_exists($url))
   {
      return $url;
   }
   $url=$thedir."accueil";
   if(url_exists($url))
   {
      return $url;
   }
   $url=$thedir."default";
   if(url_exists($url))
   {
      return $url;
   }
   return $thedir;
}

// convert local to URL and to unix
function setURL($name)
{
   for($i=0;$i<strlen($name);$i++)
   {
      if($name{$i}==="\\")
      {
         $name{$i}="/";
      }
   }
   return $name;
}

function textToUTF8($content)
{
   $content=str_replace("&","&amp;",$content);
   $content=str_replace("<","&lt;",$content);
   $content=str_replace(">","&gt;",$content);
   return $content;
}

// remove trailing slash or backslash
function noSlash($pth)
{
   $c=substr($pth,-1);
   if(($c==="/")||($c==="\\"))
   {
      return substr($pth,0,-1);
   }
   return $pth;
}

function siteOffset($theurl)
{
   $offset=0;
   $offset=strpos($theurl,"http://");
   if($offset===false)
   {
      $offset=strpos($theurl,"ftp://");
      if($offset===false)
      {
         $offset=strpos($theurl,"https://");
         if($offset!=false)
         {
            $offset+=8;
         }
      }
      else
      {
         $offset+=6;
      }
   }
   else
   {
      $offset+=7;
   }
   return $offset;
}

// test if this is a remote  address (host included in the string)
function hasProtocol($theurl)
{
   $lowname=strtolower(ltrim($theurl));
   if(substr($lowname,0,7)==="http://")
   {
      return true;
   }
   if(substr($lowname,0,6)==="ftp://")
   {
      return true;
   }
   if(substr($lowname,0,8)==="https://")
   {
      return true;
   }
   return false;
}

// return remote part and local part
function splitURL($theurl)
{
   $offset=siteOffset($theurl);
   if($offset===false)
   {
      return array("",$theurl);
   }
   $offset=strpos($theurl,"/",$offset);
   if($offset===false)
   {
      return array($theurl,"");
   }
   return array(substr($theurl,0,$offset),substr($theurl,$offset+1));
}

// get the remote part of URL
function getURL($theurl)
{
   $offset=siteOffset($theurl);
   $offset=strpos($theurl,"/",$offset);
   if($offset===false)
   {
      return $theurl;
   }
   return substr($theurl,0,$offset);
}

function setWindows($name)
{
   for($i=0;$i<strlen($name);$i++)
   {
      if($name{$i}==="/")
      {
         $name{$i}="\\";
      }
   }
   return $name;
}

// if drive letter in path, change drive
function changeDir($pth)
{
   chdir($pth);
   global $DEBUG;
   global $VERBOSE;
   if($DEBUG&&$VERBOSE)
   {
      show("Now path is ".getcwd());
   }
   return;
}

// Check if the source ends with the string search
function endWith($source,$search)
{
   $last=substr($search,-1);
   if(($last==="/")||($last==="\\"))
   {
      $search=substr($search,0,-1);
   }
   $lsea=strlen($search);
   $lsrc=strlen($source);
   if($lsrc<$lsea)
   {
      return false;
   }
   if(substr($source,-$lsea)===$search)
   {
      return true;
   }
   return false;
}

?>
