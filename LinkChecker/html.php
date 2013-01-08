<?php
function startHTML($site)
{
   $html="<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.1//EN'
  'http://www.w3.org/TR/xhtml11/DTD/xhtml11-flat.dtd'>
   <html xmlns='http://www.w3.org/1999/xhtml' >
<head>
<title>Link Checker Pro for $site</title>
<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
<link rel='stylesheet' type='text/css' href='linche.css' />
</head>

<body>
<h1>Link Checker Pro Results for $site</h1>
<br />
<div class='results'>
</div>
";
   echo $html;
   return;
}

function endHTML()
{
   $html="
    </body>\n
    </html>\n
    ";
   echo $html;
   return;
}


?>
