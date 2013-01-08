<?php
//  Directory Scanner Class
//  Scriptol - (c) 2001-2008  Denis Sureau
//  www.scriptol.com
//  This is a wrapper to directory content reading
//  The path separator is "/" under Unix and Windows
include_once("path.php");

class DirList extends Path
{
   var $handle=0;
   var $total=0;
   var $name="";
   function open($dpath)
   {
      $this->handle=opendir($dpath);
      $this->name=$dpath;
      return true;
   }

   function close()
   {
      closedir($this->handle);
      return;
   }

   function next()
   {
      return readdir($this->handle);
   }

   function begin()
   {
      rewinddir($this->handle);
      return;
   }

   function getList($dpath)
   {
      $dlist=array();
      if(!Path::exists($dpath))
      {
         return $dlist;
      }
      if(Path::type($dpath)!="dir")
      {
         return $dlist;
      }
      $this->open($dpath);
      $this->begin();
      do
      {
            $fname=$this->next();
            if($fname ==false)
            {
               break;
            }
            if(in_array($fname,array(".","..")))
            {
               continue;
            }
            array_push($dlist,$fname);
      }
      while(true);
      $this->close();
      return $dlist;
   }

   function disp($dpath)
   {
      $this->total=0;
      $files=0;
      $dirs=0;
      $sizestr="";
      if(!Path::exists($dpath))
      {
         echo $dpath, " ", "no found", "\n";
         exit();
      }
      if(Path::type($dpath)!="dir")
      {
         die($dpath." not a directory");
      }
      $this->open($dpath);
      $this->begin();
      do
      {
            $fname=$this->next();
            $fullname=Path::merge($dpath,$fname);
            if($fname ==false)
            {
               break;
            }
            if(in_array($fname,array(".","..")))
            {
               continue;
            }
            
            $_I1=Path::type($fullname);
            if($_I1==="dir")
            {
               $sizestr="<dir>";
               $dirs+=1;
            }
            else
            {
               if($_I1==="file")
               {
                  $si=Path::size($fullname);
                  $sizestr=strval($si);
                  $files+=1;
                  $this->total+=intVal($si);
               }
            else
            {
               $sizestr="<unknow type>";
            }
            }
            echo str_pad($fname,32), " ", str_pad($sizestr,9," ",STR_PAD_LEFT), "\n";
      }
      while(true);
      $this->close();
      echo str_pad(strval($files),20," ",STR_PAD_LEFT), " ", "files(s)   ", " ", $this->total, " ", "bytes", "\n";
      echo str_pad(strval($dirs),20," ",STR_PAD_LEFT), " ", "dir(s)", "\n";
      return array($files,$dirs,$this->total);
   }

}

?>
