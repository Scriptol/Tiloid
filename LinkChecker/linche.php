<?php
//
// Scriptol Link Checker 1.4
// (c) 2008-2012 Scriptol.com
// Free under the GNU GPL 2 License.
// Requires the PHP interpreter.
// Sources are compiled with the Scriptol PHP compiler 7.0
// www.scriptol.com
//
// The program checks the page of a website for broken links.
// Read the manual for details of use at:
//   http://www.scriptol.com/scripts/link-checker.php.
//
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
//

include_once("path.php");
include_once("dom.php");
include_once("url.php");
$RECURSE=false;
$PROCESSDEFAULT=true;
$counter=0;
$brocount=0;
$redcount=0;
$params=array();
$checked=array();
$scanned=array();
function usage()
{
   echo "\n";
   echo "Link Checher - (c) 2008-2012 Scriptol.com - Freeware.", "\n";
   echo "----------------------------------------------------", "\n";
   echo "Syntax:", "\n";
   echo "  solp linche [options] url", "\n";
   echo "Options:", "\n";
   echo "  -r follow links (default the page only).", "\n";
   echo "  -s show a short list, only broken and internal redirects.", "\n";
   echo "  -f faster. You may add a specific timeout value, ex: -f10.", "\n";
   echo "  -v verbose, display more infos.", "\n";
   echo "  -q quiet, display nothing.", "\n";
   echo "Arguments:", "\n";
   echo "  url: http address of a page, usually the home page.", "\n";
   echo "Logs stored into links.log.", "\n";
   echo "More info at: http://www.scriptol.com/scripts/", "\n";
   exit(0);
   return;
}

function splitSite($url)
{
   $pos=strpos($url,'/',8);
   if($pos===false)
   {
      $ext=Path::getExtension($url);
      global $extensions;
      if(!in_array($ext,$extensions))
      {
         return array($url,"");
      }
      terminate("$url not a valid url");
   }
   $site=substr($url,0,$pos);
   $filename=substr($url,$pos+1);
   return array($site,$filename);
}

function isInternal($url)
{
   global $website;
   $l=strlen($website);
   $url=strtolower($url);

   if($website===substr($url,0,$l))
   {
      return true;
   }
   return false;
}

function checkLink($url)
{
   global $counter;
   $counter+=1;
   global $DEBUG;
   if($DEBUG)
   {
      show("Checking $url");
   }
   global $FORCERETRY;
   $status=@sockAccess($url,$FORCERETRY);
   
   if($status===404)
   {
      display($status,$url,true);
      global $brocount;
      $brocount+=1;
   }
   else
   {
      if($status===301)
      {
         global $SHORTLIST;
         if($SHORTLIST)
         {
            if((!isInternal($url)))
            {
               return $status;
            }
         }
         display($status,$url,true);
         global $redcount;
         $redcount+=1;
      }
   else
   {
      if($status===302)
      {
         display($status,$url,false);
      }
   else
   {
      if($status===200)
      {
         display($status,$url,false);
      }
   else
   {
      if($status===0)
      {
         global $SHORTLIST;
         if($SHORTLIST)
         {
            return $status;
         }
         display($status,$url,true);
      }
   else
   {
      global $SHORTLIST;
      if($SHORTLIST)
      {
         return $status;
      }
      display($status,$url,false);
   }
   }}}}
   global $checked;
   $checked[$url]=$status;
   return $status;
}

function pageScan($fname,$caller)
{
   $current=null;
   $elem=null;
   $xres=0;
   $links=array();
   $d=new DOMDocument();

   
    $xres = @$d->loadHTMLFile($fname);
  
   if($xres===false)
   {
      show("Error \"$fname\" not found in $caller");
      global $brocount;
      $brocount+=1;
      return array();
   }
   $dnl=$d->getElementsByTagName("a");
   if($dnl->length===0)
   {
      return array();
   }
   for($i=0;$i<=$dnl->length;$i++)
   {
      $current=$dnl->item($i);
      if($current===null)
      {
         continue;
      }
      $elem=$current;
      if($elem->hasAttribute("href"))
      {
         array_push($links,$elem->getAttribute("href"));
      }
   }
   return $links;
}

function httpCheck($page,$caller)
{
   $links=array();
   $todo=array();
   $reldir="";
   $src="";
   $ext="";
   if(trim($page) ==false)
   {
      return;
   }
   if($page{0}===".")
   {
      return;
   }
   global $scanned;
   if(@array_key_exists($page,$scanned))
   {
      return;
   }
   $scanned[$page]=200;
   global $checked;
   $checked[$page]=200;

   global $DEBUG;
   if($DEBUG)
   {
      show("Entering $page");
   }
   global $WEBINTERFACE;
   if($WEBINTERFACE)
   {
      global $differed;
      $differed="<br><b><a href='$page' target='_blank'>$page</a></b>";
   }
   else
   {
      global $differed;
      $differed="\n$page\n".str_repeat("-",strlen($page));
   }
   global $DIFFEREDFLAG;
   $DIFFEREDFLAG=true;

   $infos=pathinfo($page);
   $reldir=@strtolower($infos{'dirname'});
   $src=@strtolower($infos{'filename'});
   $ext=@strtolower($infos{'extension'});

   if(substr($page,-1,1)==="/")
   {
      global $website;
      $l=intVal(strlen($website));
      $reldir=$page;
      $src="";

   }
   else
   {
      $infos=pathinfo($page);
      $reldir=@strtolower($infos{'dirname'});
      $src=@strtolower($infos{'filename'});
      $ext=@strtolower($infos{'extension'});
      if($ext!=false)
      {
         $ext=".".$ext;
         global $extensions;
         if(!in_array($ext,$extensions))
         {
            return;
         }
         $src.=$ext;
      }
   }
   if($DEBUG)
   {
      show("Processing  $reldir/$src");
   }
   $links=pageScan($page,$caller);
   if(count($links)===0)
   {
      return;
   }
   $l=count($links);
   for($i=0;$i<$l;$i++)
   {
      $link=$links[$i];
      if($link ==false)
      {
         continue;
      }
      if($link{0}==="#")
      {
         continue;
      }
      if($link{0}==="/")
      {
         global $website;
         $link=Path::merge($website,$link);
      }
      $p=strpos($link,"#",0);
      if($p!=0)
      {
         $link=substr($link,0,$p);
      }
      if(!hasProtocol($link))
      {
         if(strlen($link)>11)
         {
            if(substr($link,0,11)==="javascript:")
            {
               if($DEBUG)
               {
                  show("Skipped javascript.");
               }
               continue;
            }
         }
         if(strlen($link)>6)
         {
            if(substr($link,0,3)==="../")
            {
               global $VERBOSE;
               if($VERBOSE)
               {
                  show("Should be absolute: $link in $page");
               }
               continue;
            }
            if(substr($link,0,7)==="mailto:")
            {
               if($DEBUG)
               {
                  show("Skipped mailto.");
               }
               continue;
            }
         }
         $link=Path::merge($reldir,$link);
      }
      if(trim($link) ==false)
      {
         continue;
      }
      if(@array_key_exists($link,$checked))
      {
         display($checked[$link],$link,false);
         continue;
      }
      if(isInternal($link))
      {
         global $PROCESSDEFAULT;
         if($PROCESSDEFAULT)
         {
            if(substr($link,-1)==="/")
            {
               $home=findDefault($link);
               if(@array_key_exists($home,$checked)===false)
               {
                  $checked[$home]=200;
               }
            }
         }
         array_push($todo,$link);
      }
      $st=checkLink($link);
      $checked[$link]=$st;
   }
   reset($todo);
   do
   {
      $link= current($todo);
      if(@array_key_exists($link,$scanned))
      {
         continue;
      }
      if(@array_key_exists($link,$checked)===false)
      {
         continue;
      }
      if($checked[$link]===200)
      {
         httpCheck($link,$page);
      }
   }
   while(!(next($todo) === false));

   return;
}

function httpProcess($page)
{
   if(substr($page,-1)==="/")
   {
      $page=findDefault($page);
   }
   httpCheck($page,"command line");
   return;
}

function processCommand($argnum,$arguments)
{
   $opt="";
   if($argnum<2)
   {
      usage();
   }
   reset($arguments);
   do
   {
      $param= current($arguments);
      if(strlen($param)>1)
      {
         $opt=$param{1};
      }
      else
      {
         usage();
      }
      if($param{0}==="-")
      {
         
         if($opt==="v")
         {
            global $VERBOSE;
            $VERBOSE=true;
            continue;
         }
         else
         {
            if($opt==="q")
            {
               global $QUIET;
               $QUIET=true;
               continue;
            }
         else
         {
            if($opt==="u")
            {
               global $DEBUG;
               $DEBUG=true;
               continue;
            }
         else
         {
            if($opt==="r")
            {
               global $RECURSE;
               $RECURSE=true;
               continue;
            }
         else
         {
            if($opt==="y")
            {
               global $FORCERETRY;
               $FORCERETRY=true;
               continue;
            }
         else
         {
            if($opt==="s")
            {
               global $SHORTLIST;
               $SHORTLIST=true;
               continue;
            }
         else
         {
            if($opt==="f")
            {
               global $TIMEOUT;
               $TIMEOUT=5;
               $speed=substr($param,2);
               if($speed!=false)
               {
                  $TIMEOUT=intval($speed);
               }
               continue;
            }
         else
         {
            if($opt==="w")
            {
               global $WEBINTERFACE;
               $WEBINTERFACE=true;
               continue;
            }
         else
         {
            show("Unknown command $param");
            usage();
            continue;
         }
         }}}}}}}
      }
      if(substr($param,0,5)==="http:")
      {
         global $server;
         $server=$param;
         continue;
      }
      global $server;
      if($server ==false)
      {
         $server=$param;
         continue;
      }
      show("Unknown command $param");
      usage();
   }
   while(!(next($arguments) === false));

   global $server;
   if($server ==false)
   {
      terminate("You must provide a URL.");
   }
   global $params;
   $params["server"]=$server;

   return;
}

function main($argc,$argv)
{
   global $brocount;   
   global $redcount;   
   global $counter;   
   $filename="";
   $x=array_slice($argv,1);
   processCommand($argc,$x);
   global $server;
   global $params;
   $server=$params["server"];

   if(!hasProtocol($server))
   {
      $server="http://".$server;
   }
   global $website;
   $_I1=splitSite($server);
   $website=reset($_I1);
   $filename=next($_I1);
   $website=strtolower($website);

   global $domain;
   $domain=substr($website,7);
   if(substr($domain,-1,1)==="/")
   {
      $domain=substr($domain,0);
   }
   global $baseLength;
   $baseLength=intVal(strlen($domain)+7);

   global $QUIET;
   if(!$QUIET)
   {
      global $VERBOSE;
      if($VERBOSE===true)
      {
         show("Verbose mode enabled");
      }
      global $DEBUG;
      if($DEBUG===true)
      {
         show("Debug mode enabled");
      }
      show("Website is $website");
      show("Domain is $domain");
      show("Starting from $server");
   }
   global $log;
   $log=fopen("links.log","w");
   httpProcess($server);
   global $scanned;
   $sp=count($scanned);
   fwrite($log,"$brocount broken links, ");
   fwrite($log,"$redcount redirects, in ");
   fwrite($log,"$counter links checked in $sp pages.");
   fclose($log);
   if($QUIET)
   {
      return 0;
   }
   $space="";
   global $WEBINTERFACE;
   if($WEBINTERFACE)
   {
      $space="<br>";
   }
   show("$space$brocount broken links, $redcount redirect, in $counter links checked in $sp pages.");
   return 0;
}

main(intVal($argc),$argv);

?>
