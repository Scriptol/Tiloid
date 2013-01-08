<?php
/*
    Thumbnail maker 1.5, freeware
    Resizer and Converter by (c) 2008-2012 Denis Sureau
    Support JPG, PNG and GIF with transparency
    Website: Scriptol.com
    GNU GPL 2.0 license.
*/    

include_once("dirlist.php");

define("ALIGN_HEIGHT", 0);
define("ALIGN_WIDTH", 1);
define("ALIGN_BOTH", 2);

$NEW_HEIGHT = 0;
$NEW_WIDTH = 0;
$I_HEIGHT = 0;
$I_WIDTH = 0;  
$X_OFFSET = 0;
$Y_OFFSET = 0;
$ALIGNMENT = ALIGN_HEIGHT;
$TARGET = false;
$ALIGNMENT = 0;

function version()
{
  echo "\n";
  echo "Resizer 1.5 - Freeware (c) 2008-2012 Scriptol.com\n";
}

function syntax()
{
  echo "Syntax: resizer [options] (imagename | dirname | *)\n";
  echo "Example: resizer -w140 -h150 *\n"; 
  echo "Required argument:\n";
  echo "  imagename: resize image with this filename\n";
  echo "  dirname  : resize all images in this directory\n";
  echo "  *        : resize all images in the current directory\n";
  echo "Options:\n";
  echo "  -h       : followed by a value, align to height\n";
  echo "  -w       : followed by a value, align to weight\n";
  echo "  -g       : convert to gif\n";
  echo "  -p       : convert to png\n";
  echo "  -j       : convert to jpg\n";
  echo "  If both -h and -v are given, resize and truncate.\n";
  echo "  When converting and size omitted, original size is preserved.\n"; 
  echo " The GD extension must be enabled.";
  exit(0);
}

$formats = array("jpeg"=>"IMG_JPG", "jpg"=>"IMG_JPG", "gif"=>"IMG_GIF", "png"=>"IMG_PNG" );
$types = array("jpeg"=>IMG_JPG, "jpg"=>IMG_JPG, "gif"=>IMG_GIF, "png"=>IMG_PNG );

// Check if the format of the image is supported

function isSupportedFormat($oldname)
{
  //$support = imagetypes();
  global $formats;
  
  $way = pathinfo($oldname);
  if(!array_key_exists('extension', $way)) return false;
  $ext = strtolower($way['extension']);

  $f = @$formats[$ext];
  
  if(defined($f)) return true;
  return false; 
}

// Getting the type of the image

function getImageType($name)
{
  global $types;
  
  $way = pathinfo($name);
  $ext = strtolower($way['extension']);
  $t = $types[$ext];
  return $t;  
}

// Change the extension

function imageRename($name, $type)
{
  $ext = ".jpg";
  switch($type)
  {
    case IMG_GIF:
        $ext = ".gif";
        break;
    case IMG_PNG:
        $ext = ".png";
        break;    
  }
  
  $way = pathinfo($name);
  $oldext = strtolower($way['extension']);

  $name = str_ireplace(".".$oldext, $ext, $name);
  return $name;

}


function interpolate($w, $h)
{
  global $NEW_HEIGHT;
  global $NEW_WIDTH;
  global $I_HEIGHT;
  global $I_WIDTH;  
  global $X_OFFSET;
  global $Y_OFFSET;


  $nh = $NEW_HEIGHT;
  $nw = $NEW_WIDTH;
  
  // Offsets to center the image
  
  $xoff = 0;
  $yoff = 0;
  
  // Applying calculations to dimensions of the image
 
  $ratio = $h / $w;
  $nratio = $nh / $nw; 

  if($ratio > $nratio)
  {
    $x = intval($w * $nh / $h);
    if ($x < $nw)
    {
      $nh = intval($h * $nw / $w);
    } 
    else
    {
      $nw = $x;
    }
    $yoff = intval(($nh - $NEW_HEIGHT) / 2); 
  }
  else
  {
    $x = intval($h * $nw / $w);
    if ($x < $nh)
    {
      $nw = intval($w * $nh / $h);
    } 
    else
    {
      $nh = $x;
    }
    $xoff = intval(($nw - $NEW_WIDTH) / 2);
  }  
  
  $I_HEIGHT = $nh;
  $I_WIDTH = $nw; 
  $X_OFFSET = $xoff;
  $Y_OFFSET = $yoff; 

}

// Resize the image whatever (valid) format it is

function resize($oldname, $newname)
{
  global $NEW_HEIGHT;
  global $NEW_WIDTH;
  global $I_HEIGHT;
  global $I_WIDTH;  
  global $X_OFFSET;
  global $Y_OFFSET;  
  global $ALIGNMENT;
  global $TARGET;  

  if(! isSupportedFormat($oldname))
  { 
    echo "Format not supported for $oldname\n";
    return;
  } 
  
  if(substr($oldname, 0, 6) == "thumb-") return; 
  
  $SOURCE = getImageType($oldname); 
  
   // Getting original dimensions

  $size = getImageSize($oldname);
  $w = $size[0];
  $h = $size[1];
  if($NEW_WIDTH == 0) $NEW_WIDTH=$w;
  if($NEW_HEIGHT == 0) $NEW_HEIGHT=$h;
  
  // dimensions of cropped image
  $I_HEIGHT = $NEW_HEIGHT;
  $I_WIDTH = $NEW_WIDTH;    
  
  // Interpolating
  
  switch($ALIGNMENT)
  {
   case ALIGN_HEIGHT:
        $NEW_WIDTH = intval($NEW_HEIGHT * $w / $h);
        $I_WIDTH = $NEW_WIDTH;        
        break;
   case ALIGN_WIDTH:
        $NEW_HEIGHT  = intval($NEW_WIDTH * $h / $w);
        $I_HEIGHT = $NEW_HEIGHT;
        break;
   case ALIGN_BOTH:
        interpolate($w, $h);
        break;
   default:  // converting only, size preserved
        $NEW_WIDTH = $w;
        $NEW_HEIGHT = $h;
        $I_WIDTH = $w;
        $I_HEIGHT = $h;
        $X_OFFSET = 0;
        $Y_OFFSET = 0;
        break;  // skipped          
  }  

  // Resizing
  
  switch($SOURCE)
  {
    case IMG_JPG: $resimage = imagecreatefromjpeg($oldname);
                  break;
    case IMG_GIF: $resimage = imagecreatefromgif($oldname);
                  break;
    case IMG_PNG: $resimage = imagecreatefrompng($oldname);
                  break;                  
  } 

  $t=$SOURCE;
  if($TARGET !== false)
  {
    $t=$TARGET;  // saved format may differ from loaded one 
    $newname = imageRename($newname, $TARGET);
  }

  echo "$oldname was $w x $h resized to $newname $NEW_WIDTH x $NEW_HEIGHT\n";

    // Making and saving the new cropped thumbnail

  $viewimage = imagecreatetruecolor($NEW_WIDTH, $NEW_HEIGHT);

  switch($t)
  {
    case IMG_JPG:
      imageCopyResampled($viewimage, $resimage,0,0,$X_OFFSET,$Y_OFFSET,$I_WIDTH, $I_HEIGHT, $w, $h);
      imagejpeg($viewimage, $newname, 85);
      break;
    case IMG_PNG:
      imagealphablending($viewimage, false);
      $color = imagecolorallocatealpha($viewimage, 0, 0, 0, 127);
      imagefill($viewimage, 0, 0, $color);
      imagesavealpha($viewimage, true);
      imageCopyResampled($viewimage, $resimage,0,0,$X_OFFSET,$Y_OFFSET,$I_WIDTH, $I_HEIGHT, $w, $h);
      imagepng($viewimage, $newname);
      break;
    case IMG_GIF:
      $coltrans = imagecolortransparent($resimage);
      if($coltrans!=0 && ($SOURCE==IMG_GIF || $SOURCE==IMG_PNG)) // useless from jpg images 
      {
        imagepalettecopy($resimage, $viewimage);
        imagefill($viewimage, 0, 0, $coltrans);
        imagecolortransparent($viewimage, $coltrans);
        imagetruecolortopalette($viewimage, true, 256);
      }
      imageCopyResampled($viewimage, $resimage,0,0,$X_OFFSET,$Y_OFFSET,$I_WIDTH, $I_HEIGHT, $w, $h);      
      imagegif($viewimage, $newname);
      break;
  } 
} 

// Building a single thumbnail

function makeThumb($oldname)
{
  $newname = "thumb-" . $oldname;
  if(!file_exists($oldname))
  { 
    echo "$oldname not found\n";
    return;
  }  

  resize($oldname, $newname);
}

// Making thumbnails from all images in the directory

function makeAll($thedir)
{
  $d = new DirList();
  $lst = $d->getList($thedir);

  foreach($lst as $name)
  {
    makeThumb($name);
  }
}

// Main function

function main($argc, $argv)
{
  global $ALIGNMENT;
  global $TARGET;
  global $NEW_HEIGHT;
  global $NEW_WIDTH;

  version();

  if($argc < 2) syntax();

  array_shift($argv);   // removing script name
  $param = array_shift($argv); // getting first param
  
  $ALIGNMENT = ALIGN_HEIGHT;
  $FLAG = 0;
  
  while($param[0] == "-")
  {
    $value = intval(substr($param, 2));
    $opt = $param[1];
    switch($opt)
    {
      case "h":
        $NEW_HEIGHT = $value;
        $ALIGNMENT == ALIGN_HEIGHT;
        $FLAG += 1;
        break;
      case "w":
        $NEW_WIDTH = $value;
        $ALIGNMENT = ALIGN_WIDTH;
        $FLAG += 1; 
        break;
      case "g":
        $TARGET = IMG_GIF;
        break;
      case "p":
        $TARGET = IMG_PNG;
        break;
      case "j":
        $TARGET = IMG_JPG;
        break;
           
      default:  
        syntax();
    }
    $param = array_shift($argv);
     
  } // while
  
  if($FLAG != 1)
  {
      $ALIGNMENT = ALIGN_BOTH;
  }  

  if($param == "*")
  { 
    makeAll(".");
  }  
  else 
  {
    if (is_file($param))
    {
      if(Path::hasDir($param))
      {
        $current = getcwd();
        $x = Path::splitFile($param);
        chdir(reset($x));
        makeThumb(next($x));
        chdir($current);
      }
      else
        makeThumb($param);
    }  
    else
    {
      $current = getcwd();
      chdir($param);
      makeAll($param);
      chdir($current);
    }  
  }
}

main($argc, $argv);

?>
