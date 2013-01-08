void startHTML(text site)
	
text html = ~~<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
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
~~
echo html

return


void addHTML(text line)
    echo line
    echo "<br>\n"
return

void endHTML()

    text html = ~~
    </body>\n
    </html>\n
    ~~

echo html

return

