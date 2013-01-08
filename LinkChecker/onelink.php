<?php
//
// One Link
// Part of Link Checker Pro
// Check the access to a web page in HTTP mode and view returned header.
// Licence: GPL
//
// (c) 2008 Scriptol.com
//

function sockAccess($url,$retry)
{
   $errno="";
   $errstr="";
   $page="";
   $site="";
   $fp=0;
   $l=intVal(strpos($url,"/",8));
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
   $fp=@fsockopen($site,80,$errno,$errstr,30);

   if($fp===false)
   {
      echo "Error $errstr ($errno) for $url viewed as site:$site page:$page", "\n";
      return 0;
   }
   $out="GET /$page HTTP/1.1\r\n";
   $out.="Host: $site\r\n";
   $out.="Connection: Close\r\n\r\n";

   fwrite($fp,$out);
   $content=@fgets($fp,320);
   $code=trim(substr($content,9,4));
   fclose($fp);
   echo "Code: $code", "\n";
   $icode=intVal(intval($code));
   if(($icode===404)&&$retry)
   {
      $f=@fopen($url,"r");
      if($f!=false)
      {
         $cnt=@fread($f,128);
         if(strlen(trim($cnt))>0)
         {
            echo "Retry succeeded, not really broken", "\n";
         }
         fclose($f);
      }
   }
   echo "Returned: $content", "\n";
   return $icode;
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

function usage()
{
   echo "One Link - Part of Link Checker Pro at scriptol.com", "\n";
   echo "Syntax:", "\n";
   echo "    solp onelink url", "\n";
   echo "or  php onelink.php url", "\n";
   echo "(url must start by http://)", "\n";
   exit(0);
   return;
}

function main($argc,$argv)
{
   if($argc<2)
   {
      usage();
   }
   $url=$argv[1];
   echo "Checking $url", "\n";
   if(strlen($url)<8)
   {
      return 0;
   }
   if(strtolower(substr($url,0,7))!="http://")
   {
      usage();
   }
   sockAccess($url,true);
   return 0;
}

main(intVal($argc),$argv);

?>
