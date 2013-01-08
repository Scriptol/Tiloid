<?php
include_once("libphp.php");

class Path
{
   function exists($dname)
   {
      return file_exists($dname);
   }

   function size($fname)
   {
      return filesize($fname);
   }

   function type($fname)
   {
      return filetype($fname);
   }

   function created($fname)
   {
      $t=filemtime($fname);
      return date("",$t);
   }

   function isFile($fname)
   {
      return filetype($fname)==="file";
   }

   function isDir($fname)
   {
      $t=filetype($fname);
      if($t==="link")
      {
         return false;
      }
      if($t!="dir")
      {
         return false;
      }
      return true;
   }

   function ren($oldname,$newname)
   {
      $b=true;
      rename($oldname,$newname);
      return $b;
   }

   function erase($fname)
   {
      return unlink($fname);
   }

   function merge($path,$filename)
   {
      if($path==="")
      {
         return $filename;
      }
      if($filename==="")
      {
         return $path;
      }
      $x=$path{strlen($path)-1};
      $y=$filename{0};
      if(($x==="/")||($x==="\\"))
      {
         if($y==="/")
         {
            return $path.substr($filename,1);
         }
         if($y==="\\")
         {
            return $path.substr($filename,2);
         }
         return $path.$filename;
      }
      if(($y==="/")||($y==="\\"))
      {
         return $path.$filename;
      }
      return $path."/".$filename;
   }

   function make($name)
   {
      return mkdir($name);
   }

   function splitExt($path)
   {
      $l=strlen($path);
      if($l===0)
      {
         return array("","");
      }
      for($x=$l-1;$x>=0;$x+=-1)
      {
         if($path{$x}===".")
         {
            return array(substr($path,0,$x),substr($path,$x+1));
         }
      }
      return array($path,"");
   }

   var $nullarr=array();
   function hasExtension($path,$extlist=array())
   {
      $extension="";
      $aext="";
      $i=0;
      $l=strlen($path);
      for($i=$l-1;$i>=0;$i+=-1)
      {
         if($path{$i}===".")
         {
            $extension=substr($path,$i+1);
            break;
         }
      }
      if($i>0)
      {
         if($extlist!=false)
         {
            return true;
         }
         $extension=substr($path,$i+1);
         reset($extlist);
         do
         {
            $aext=trim(strval(current($extlist)));
            if(strlen($aext)<1)
            {
               continue;
            }
            $i=0;
            if($aext{0}===".")
            {
               $i=1;
            }
            if(($i>0)&&(strlen($aext)===1))
            {
               continue;
            }
            if($extension===substr($aext,$i))
            {
               return true;
            }
         }
         while(!(next($extlist)===false));
      }
      return false;
   }

   function getExtension($path)
   {
      $ext=strrchr($path,".");
      if($ext!=false)
      {
         return $ext;
      }
      return "";
   }

   function changeExt($path,$newext)
   {
      $l=strlen($path);
      if($l===0)
      {
         return $newext;
      }
      for($x=$l-1;$x>=0;$x+=-1)
      {
         if($path{$x}===".")
         {
            $path=substr($path,0,$x);
            break;
         }
      }
      if(strlen($newext)>0)
      {
         if($newext{0}!=".")
         {
            $newext=".".$newext;
         }
      }
      return $path.$newext;
   }

   function hasDir($path)
   {
      $l=strlen($path);
      if($l===0)
      {
         return false;
      }
      if($l>1)
      {
         if($path{1}===":")
         {
            return true;
         }
      }
      if(strpos($path,"/")!=false)
      {
         return true;
      }
      if(strpos($path,"\\")!=false)
      {
         return true;
      }
      return false;
   }

   function splitFile($path)
   {
      $l=strlen($path);
      if($l===0)
      {
         return array("","");
      }
      for($x=$l-1;$x>=0;$x+=-1)
      {
         if(($path{$x}==="/")||($path{$x}==="\\"))
         {
            return array(substr($path,0,$x+1),substr($path,$x+1));
         }
      }
      return array("",$path);
   }

   function getDir()
   {
      return getcwd();
   }

   function compare($a,$b)
   {
      $l=strlen($a);
      if($l!=strlen($b))
      {
         return false;
      }
      for($i=0;$i<$l;$i++)
      {
         if(($a{$i}==="\\")||($a{$i}==="/"))
         {
            if($b{$i}==="/")
            {
               continue;
            }
            if($b{$i}==="\\")
            {
               continue;
            }
            return false;
         }
         if($a{$i}!=$b{$i})
         {
            return false;
         }
      }
      return true;
   }

}

?>
