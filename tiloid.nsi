; Script generated with the Venis Install Wizard

; Define your application name
!define APPNAME "Tiloid"
!define APPNAMEANDVERSION "Tiloid 1.0"

; Main Install settings
Name "${APPNAMEANDVERSION}"
InstallDir "$PROGRAMFILES\Tiloid"
InstallDirRegKey HKLM "Software\${APPNAME}" ""
OutFile "C:\Program Files (x86)\Venis\tiloid.exe"

; Modern interface settings
!include "MUI.nsh"

!define MUI_ABORTWARNING

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

; Set languages (first is default language)
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_RESERVEFILE_LANGDLL

Section "Tiloid" Section1

	; Set Section properties
	SetOverwrite on

	; Set Section Files and Shortcuts
	SetOutPath "$INSTDIR\"
	File "aexplorer.js"
	File "license.txt"
	File "map.html"
	File "node.ini"
	File "README.md"
	File "tiloid.html"
	File "tiloid.js"
	SetOutPath "$INSTDIR\AExplorer\"
	File "AExplorer\aexplorer.css"
	File "AExplorer\aexplorer.html"
	File "AExplorer\aexplorer.ini.js"
	File "AExplorer\aexplorer.js"
	File "AExplorer\aexplorer.png"
	File "AExplorer\configurator.css"
	File "AExplorer\configurator.html"
	File "AExplorer\license.txt"
	File "AExplorer\manual.html"
	SetOutPath "$INSTDIR\AExplorer\images\"
	File "AExplorer\images\apache.png"
	File "AExplorer\images\app.png"
	File "AExplorer\images\Application.png"
	File "AExplorer\images\archive.png"
	File "AExplorer\images\console.png"
	File "AExplorer\images\copy.png"
	File "AExplorer\images\copyren.png"
	File "AExplorer\images\create.png"
	File "AExplorer\images\delete.png"
	File "AExplorer\images\dir.png"
	File "AExplorer\images\doc.png"
	File "AExplorer\images\edit-active.png"
	File "AExplorer\images\edit.png"
	File "AExplorer\images\exit.png"
	File "AExplorer\images\forward.png"
	File "AExplorer\images\help.png"
	File "AExplorer\images\home.png"
	File "AExplorer\images\img.png"
	File "AExplorer\images\invert.png"
	File "AExplorer\images\options.png"
	File "AExplorer\images\reload.png"
	File "AExplorer\images\rename.png"
	File "AExplorer\images\save.png"
	File "AExplorer\images\trash.png"
	File "AExplorer\images\up.png"
	File "AExplorer\images\web.png"
	File "AExplorer\images\zip.png"
	SetOutPath "$INSTDIR\code\"
	File "code\chooser-dom.js"
	File "code\chooser.js"
	File "code\iframe.css"
	File "code\javascript-ini.js"
	File "code\link.js"
	File "code\tiloid.css"
	File "code\unzip.js"
	SetOutPath "$INSTDIR\CodeEditor\"
	File "CodeEditor\ACE-LICENSE"
	File "CodeEditor\ace.js"
	File "CodeEditor\editor.html"
	File "CodeEditor\Monokai.tmTheme"
	File "CodeEditor\tiloid.css"
	File "CodeEditor\tokenizer.js"
	SetOutPath "$INSTDIR\CodeEditor\images\"
	File "CodeEditor\images\back.png"
	File "CodeEditor\images\changed.png"
	File "CodeEditor\images\copy.png"
	File "CodeEditor\images\cut.png"
	File "CodeEditor\images\find.png"
	File "CodeEditor\images\indent.png"
	File "CodeEditor\images\italic.png"
	File "CodeEditor\images\link.png"
	File "CodeEditor\images\new.png"
	File "CodeEditor\images\next.png"
	File "CodeEditor\images\open.png"
	File "CodeEditor\images\outdent.png"
	File "CodeEditor\images\paste.png"
	File "CodeEditor\images\print.png"
	File "CodeEditor\images\redo.png"
	File "CodeEditor\images\save-as.png"
	File "CodeEditor\images\save.png"
	File "CodeEditor\images\saved.png"
	File "CodeEditor\images\select-all.png"
	File "CodeEditor\images\table.png"
	File "CodeEditor\images\undo.png"
	SetOutPath "$INSTDIR\CodeEditor\lib\"
	File "CodeEditor\lib\oop.js"
	SetOutPath "$INSTDIR\CodeEditor\mode\"
	File "CodeEditor\mode\css.js"
	File "CodeEditor\mode\css_highlight_rules.js"
	File "CodeEditor\mode\c_cpp.js"
	File "CodeEditor\mode\c_cpp_highlight_rules.js"
	File "CodeEditor\mode\html.js"
	File "CodeEditor\mode\html_highlight_rules.js"
	File "CodeEditor\mode\java.js"
	File "CodeEditor\mode\javascript.js"
	File "CodeEditor\mode\javascript_highlight_rules.js"
	File "CodeEditor\mode\json.js"
	File "CodeEditor\mode\php.js"
	File "CodeEditor\mode\php_highlight_rules.js"
	File "CodeEditor\mode\python.js"
	File "CodeEditor\mode\python_highlight_rules.js"
	File "CodeEditor\mode\ruby.js"
	File "CodeEditor\mode\ruby_highlight_rules.js"
	File "CodeEditor\mode\svg.js"
	File "CodeEditor\mode\svg_highlight_rules.js"
	File "CodeEditor\mode\text.js"
	File "CodeEditor\mode\text_highlight_rules.js"
	SetOutPath "$INSTDIR\LinkChecker\"
	File "LinkChecker\dom.php"
	File "LinkChecker\dom.sol"
	File "LinkChecker\gpl.txt"
	File "LinkChecker\html.php"
	File "LinkChecker\html.sol"
	File "LinkChecker\libphp.php"
	File "LinkChecker\libphp.sol"
	File "LinkChecker\linche.js"
	File "LinkChecker\linche.php"
	File "LinkChecker\linche.sol"
	File "LinkChecker\linkchecker.html"
	File "LinkChecker\linkchecker.js"
	File "LinkChecker\linkchecker.list"
	File "LinkChecker\linkchecker.png"
	File "LinkChecker\onelink.php"
	File "LinkChecker\onelink.sol"
	File "LinkChecker\path.php"
	File "LinkChecker\path.sol"
	File "LinkChecker\README.txt"
	File "LinkChecker\RELEASE.BAT"
	File "LinkChecker\url.php"
	File "LinkChecker\url.sol"
	SetOutPath "$INSTDIR\nbproject\"
	File "nbproject\project.properties"
	File "nbproject\project.xml"
	SetOutPath "$INSTDIR\nbproject\private\"
	File "nbproject\private\private.properties"
	File "nbproject\private\private.xml"
	SetOutPath "$INSTDIR\node_modules\adm-zip\"
	File "node_modules\adm-zip\.travis.yml"
	File "node_modules\adm-zip\adm-zip.js"
	File "node_modules\adm-zip\MIT-LICENSE.txt"
	File "node_modules\adm-zip\package.json"
	File "node_modules\adm-zip\README.md"
	File "node_modules\adm-zip\sandbox.js"
	File "node_modules\adm-zip\zipEntry.js"
	File "node_modules\adm-zip\zipFile.js"
	SetOutPath "$INSTDIR\node_modules\adm-zip\headers\"
	File "node_modules\adm-zip\headers\dataHeader.js"
	File "node_modules\adm-zip\headers\entryHeader.js"
	File "node_modules\adm-zip\headers\index.js"
	File "node_modules\adm-zip\headers\mainHeader.js"
	SetOutPath "$INSTDIR\node_modules\adm-zip\methods\"
	File "node_modules\adm-zip\methods\deflater.js"
	File "node_modules\adm-zip\methods\index.js"
	File "node_modules\adm-zip\methods\inflater.js"
	SetOutPath "$INSTDIR\node_modules\adm-zip\test\"
	File "node_modules\adm-zip\test\index.js"
	SetOutPath "$INSTDIR\node_modules\adm-zip\test\assets\"
	File "node_modules\adm-zip\test\assets\attributes_test.zip"
	File "node_modules\adm-zip\test\assets\fast.zip"
	File "node_modules\adm-zip\test\assets\fastest.zip"
	File "node_modules\adm-zip\test\assets\linux_arc.zip"
	File "node_modules\adm-zip\test\assets\maximum.zip"
	File "node_modules\adm-zip\test\assets\normal.zip"
	File "node_modules\adm-zip\test\assets\store.zip"
	File "node_modules\adm-zip\test\assets\ultra.zip"
	SetOutPath "$INSTDIR\node_modules\adm-zip\test\assets\attributes_test\"
	File "node_modules\adm-zip\test\assets\attributes_test\blank file.txt"
	SetOutPath "$INSTDIR\node_modules\adm-zip\test\assets\attributes_test\asd\"
	File "node_modules\adm-zip\test\assets\attributes_test\asd\New Text Document.txt"
	SetOutPath "$INSTDIR\node_modules\adm-zip\test\assets\attributes_test\New folder\"
	File "node_modules\adm-zip\test\assets\attributes_test\New folder\hidden.txt"
	File "node_modules\adm-zip\test\assets\attributes_test\New folder\hidden_readonly.txt"
	File "node_modules\adm-zip\test\assets\attributes_test\New folder\readonly.txt"
	File "node_modules\adm-zip\test\assets\attributes_test\New folder\somefile.txt"
	SetOutPath "$INSTDIR\node_modules\adm-zip\util\"
	File "node_modules\adm-zip\util\constants.js"
	File "node_modules\adm-zip\util\errors.js"
	File "node_modules\adm-zip\util\fattr.js"
	File "node_modules\adm-zip\util\index.js"
	File "node_modules\adm-zip\util\utils.js"
	SetOutPath "$INSTDIR\node_modules\explorer\"
	File "node_modules\explorer\explorer.js"
	File "node_modules\explorer\package.json"
	SetOutPath "$INSTDIR\Resizer\"
	File "Resizer\dirlist.php"
	File "Resizer\gpl.txt"
	File "Resizer\libphp.php"
	File "Resizer\path.php"
	File "Resizer\README.txt"
	File "Resizer\resizer.css"
	File "Resizer\resizer.html"
	File "Resizer\resizer.php"
	File "Resizer\resizer.png"
	SetOutPath "$INSTDIR\Resizer\images\"
	File "Resizer\images\dir.png"
	File "Resizer\images\img.png"
	CreateShortCut "$DESKTOP\Tiloid.lnk" "$INSTDIR\tiloid.js"
	CreateDirectory "$SMPROGRAMS\Tiloid"
	CreateShortCut "$SMPROGRAMS\Tiloid\Tiloid.lnk" "$INSTDIR\tiloid.js"
	CreateShortCut "$SMPROGRAMS\Tiloid\Uninstall.lnk" "$INSTDIR\uninstall.exe"

SectionEnd

Section -FinishSection

	WriteRegStr HKLM "Software\${APPNAME}" "" "$INSTDIR"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayName" "${APPNAME}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "UninstallString" "$INSTDIR\uninstall.exe"
	WriteUninstaller "$INSTDIR\uninstall.exe"

SectionEnd

; Modern install component descriptions
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
	!insertmacro MUI_DESCRIPTION_TEXT ${Section1} ""
!insertmacro MUI_FUNCTION_DESCRIPTION_END

;Uninstall section
Section Uninstall

	;Remove from registry...
	DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}"
	DeleteRegKey HKLM "SOFTWARE\${APPNAME}"

	; Delete self
	Delete "$INSTDIR\uninstall.exe"

	; Delete Shortcuts
	Delete "$DESKTOP\Tiloid.lnk"
	Delete "$SMPROGRAMS\Tiloid\Tiloid.lnk"
	Delete "$SMPROGRAMS\Tiloid\Uninstall.lnk"

	; Clean up Tiloid
	Delete "$INSTDIR\.gitattributes"
	Delete "$INSTDIR\.gitignore"
	Delete "$INSTDIR\aexplorer.js"
	Delete "$INSTDIR\license.txt"
	Delete "$INSTDIR\map.html"
	Delete "$INSTDIR\node.ini"
	Delete "$INSTDIR\README.md"
	Delete "$INSTDIR\tiloid.html"
	Delete "$INSTDIR\tiloid.js"
	Delete "$INSTDIR\AExplorer\aexplorer.css"
	Delete "$INSTDIR\AExplorer\aexplorer.html"
	Delete "$INSTDIR\AExplorer\aexplorer.ini.js"
	Delete "$INSTDIR\AExplorer\aexplorer.js"
	Delete "$INSTDIR\AExplorer\aexplorer.png"
	Delete "$INSTDIR\AExplorer\configurator.css"
	Delete "$INSTDIR\AExplorer\configurator.html"
	Delete "$INSTDIR\AExplorer\license.txt"
	Delete "$INSTDIR\AExplorer\manual.html"
	Delete "$INSTDIR\AExplorer\images\apache.png"
	Delete "$INSTDIR\AExplorer\images\app.png"
	Delete "$INSTDIR\AExplorer\images\Application.png"
	Delete "$INSTDIR\AExplorer\images\archive.png"
	Delete "$INSTDIR\AExplorer\images\console.png"
	Delete "$INSTDIR\AExplorer\images\copy.png"
	Delete "$INSTDIR\AExplorer\images\copyren.png"
	Delete "$INSTDIR\AExplorer\images\create.png"
	Delete "$INSTDIR\AExplorer\images\delete.png"
	Delete "$INSTDIR\AExplorer\images\dir.png"
	Delete "$INSTDIR\AExplorer\images\doc.png"
	Delete "$INSTDIR\AExplorer\images\edit-active.png"
	Delete "$INSTDIR\AExplorer\images\edit.png"
	Delete "$INSTDIR\AExplorer\images\exit.png"
	Delete "$INSTDIR\AExplorer\images\forward.png"
	Delete "$INSTDIR\AExplorer\images\help.png"
	Delete "$INSTDIR\AExplorer\images\home.png"
	Delete "$INSTDIR\AExplorer\images\img.png"
	Delete "$INSTDIR\AExplorer\images\invert.png"
	Delete "$INSTDIR\AExplorer\images\options.png"
	Delete "$INSTDIR\AExplorer\images\reload.png"
	Delete "$INSTDIR\AExplorer\images\rename.png"
	Delete "$INSTDIR\AExplorer\images\save.png"
	Delete "$INSTDIR\AExplorer\images\trash.png"
	Delete "$INSTDIR\AExplorer\images\up.png"
	Delete "$INSTDIR\AExplorer\images\web.png"
	Delete "$INSTDIR\AExplorer\images\zip.png"
	Delete "$INSTDIR\code\chooser-dom.js"
	Delete "$INSTDIR\code\chooser.js"
	Delete "$INSTDIR\code\iframe.css"
	Delete "$INSTDIR\code\javascript-ini.js"
	Delete "$INSTDIR\code\link.js"
	Delete "$INSTDIR\code\tiloid.css"
	Delete "$INSTDIR\code\unzip.js"
	Delete "$INSTDIR\CodeEditor\ACE-LICENSE"
	Delete "$INSTDIR\CodeEditor\ace.js"
	Delete "$INSTDIR\CodeEditor\editor.html"
	Delete "$INSTDIR\CodeEditor\Monokai.tmTheme"
	Delete "$INSTDIR\CodeEditor\tiloid.css"
	Delete "$INSTDIR\CodeEditor\tokenizer.js"
	Delete "$INSTDIR\CodeEditor\images\back.png"
	Delete "$INSTDIR\CodeEditor\images\changed.png"
	Delete "$INSTDIR\CodeEditor\images\copy.png"
	Delete "$INSTDIR\CodeEditor\images\cut.png"
	Delete "$INSTDIR\CodeEditor\images\find.png"
	Delete "$INSTDIR\CodeEditor\images\indent.png"
	Delete "$INSTDIR\CodeEditor\images\italic.png"
	Delete "$INSTDIR\CodeEditor\images\link.png"
	Delete "$INSTDIR\CodeEditor\images\new.png"
	Delete "$INSTDIR\CodeEditor\images\next.png"
	Delete "$INSTDIR\CodeEditor\images\open.png"
	Delete "$INSTDIR\CodeEditor\images\outdent.png"
	Delete "$INSTDIR\CodeEditor\images\paste.png"
	Delete "$INSTDIR\CodeEditor\images\print.png"
	Delete "$INSTDIR\CodeEditor\images\redo.png"
	Delete "$INSTDIR\CodeEditor\images\save-as.png"
	Delete "$INSTDIR\CodeEditor\images\save.png"
	Delete "$INSTDIR\CodeEditor\images\saved.png"
	Delete "$INSTDIR\CodeEditor\images\select-all.png"
	Delete "$INSTDIR\CodeEditor\images\table.png"
	Delete "$INSTDIR\CodeEditor\images\undo.png"
	Delete "$INSTDIR\CodeEditor\lib\oop.js"
	Delete "$INSTDIR\CodeEditor\mode\css.js"
	Delete "$INSTDIR\CodeEditor\mode\css_highlight_rules.js"
	Delete "$INSTDIR\CodeEditor\mode\c_cpp.js"
	Delete "$INSTDIR\CodeEditor\mode\c_cpp_highlight_rules.js"
	Delete "$INSTDIR\CodeEditor\mode\html.js"
	Delete "$INSTDIR\CodeEditor\mode\html_highlight_rules.js"
	Delete "$INSTDIR\CodeEditor\mode\java.js"
	Delete "$INSTDIR\CodeEditor\mode\javascript.js"
	Delete "$INSTDIR\CodeEditor\mode\javascript_highlight_rules.js"
	Delete "$INSTDIR\CodeEditor\mode\json.js"
	Delete "$INSTDIR\CodeEditor\mode\php.js"
	Delete "$INSTDIR\CodeEditor\mode\php_highlight_rules.js"
	Delete "$INSTDIR\CodeEditor\mode\python.js"
	Delete "$INSTDIR\CodeEditor\mode\python_highlight_rules.js"
	Delete "$INSTDIR\CodeEditor\mode\ruby.js"
	Delete "$INSTDIR\CodeEditor\mode\ruby_highlight_rules.js"
	Delete "$INSTDIR\CodeEditor\mode\svg.js"
	Delete "$INSTDIR\CodeEditor\mode\svg_highlight_rules.js"
	Delete "$INSTDIR\CodeEditor\mode\text.js"
	Delete "$INSTDIR\CodeEditor\mode\text_highlight_rules.js"
	Delete "$INSTDIR\LinkChecker\dom.php"
	Delete "$INSTDIR\LinkChecker\dom.sol"
	Delete "$INSTDIR\LinkChecker\gpl.txt"
	Delete "$INSTDIR\LinkChecker\html.php"
	Delete "$INSTDIR\LinkChecker\html.sol"
	Delete "$INSTDIR\LinkChecker\libphp.php"
	Delete "$INSTDIR\LinkChecker\libphp.sol"
	Delete "$INSTDIR\LinkChecker\linche.js"
	Delete "$INSTDIR\LinkChecker\linche.php"
	Delete "$INSTDIR\LinkChecker\linche.sol"
	Delete "$INSTDIR\LinkChecker\linkchecker.html"
	Delete "$INSTDIR\LinkChecker\linkchecker.js"
	Delete "$INSTDIR\LinkChecker\linkchecker.list"
	Delete "$INSTDIR\LinkChecker\linkchecker.png"
	Delete "$INSTDIR\LinkChecker\onelink.php"
	Delete "$INSTDIR\LinkChecker\onelink.sol"
	Delete "$INSTDIR\LinkChecker\path.php"
	Delete "$INSTDIR\LinkChecker\path.sol"
	Delete "$INSTDIR\LinkChecker\README.txt"
	Delete "$INSTDIR\LinkChecker\RELEASE.BAT"
	Delete "$INSTDIR\LinkChecker\url.php"
	Delete "$INSTDIR\LinkChecker\url.sol"
	Delete "$INSTDIR\nbproject\project.properties"
	Delete "$INSTDIR\nbproject\project.xml"
	Delete "$INSTDIR\nbproject\private\private.properties"
	Delete "$INSTDIR\nbproject\private\private.xml"
	Delete "$INSTDIR\node_modules\adm-zip\.travis.yml"
	Delete "$INSTDIR\node_modules\adm-zip\adm-zip.js"
	Delete "$INSTDIR\node_modules\adm-zip\MIT-LICENSE.txt"
	Delete "$INSTDIR\node_modules\adm-zip\package.json"
	Delete "$INSTDIR\node_modules\adm-zip\README.md"
	Delete "$INSTDIR\node_modules\adm-zip\sandbox.js"
	Delete "$INSTDIR\node_modules\adm-zip\zipEntry.js"
	Delete "$INSTDIR\node_modules\adm-zip\zipFile.js"
	Delete "$INSTDIR\node_modules\adm-zip\headers\dataHeader.js"
	Delete "$INSTDIR\node_modules\adm-zip\headers\entryHeader.js"
	Delete "$INSTDIR\node_modules\adm-zip\headers\index.js"
	Delete "$INSTDIR\node_modules\adm-zip\headers\mainHeader.js"
	Delete "$INSTDIR\node_modules\adm-zip\methods\deflater.js"
	Delete "$INSTDIR\node_modules\adm-zip\methods\index.js"
	Delete "$INSTDIR\node_modules\adm-zip\methods\inflater.js"
	Delete "$INSTDIR\node_modules\adm-zip\test\index.js"
	Delete "$INSTDIR\node_modules\adm-zip\test\assets\attributes_test.zip"
	Delete "$INSTDIR\node_modules\adm-zip\test\assets\fast.zip"
	Delete "$INSTDIR\node_modules\adm-zip\test\assets\fastest.zip"
	Delete "$INSTDIR\node_modules\adm-zip\test\assets\linux_arc.zip"
	Delete "$INSTDIR\node_modules\adm-zip\test\assets\maximum.zip"
	Delete "$INSTDIR\node_modules\adm-zip\test\assets\normal.zip"
	Delete "$INSTDIR\node_modules\adm-zip\test\assets\store.zip"
	Delete "$INSTDIR\node_modules\adm-zip\test\assets\ultra.zip"
	Delete "$INSTDIR\node_modules\adm-zip\test\assets\attributes_test\blank file.txt"
	Delete "$INSTDIR\node_modules\adm-zip\test\assets\attributes_test\asd\New Text Document.txt"
	Delete "$INSTDIR\node_modules\adm-zip\test\assets\attributes_test\New folder\hidden.txt"
	Delete "$INSTDIR\node_modules\adm-zip\test\assets\attributes_test\New folder\hidden_readonly.txt"
	Delete "$INSTDIR\node_modules\adm-zip\test\assets\attributes_test\New folder\readonly.txt"
	Delete "$INSTDIR\node_modules\adm-zip\test\assets\attributes_test\New folder\somefile.txt"
	Delete "$INSTDIR\node_modules\adm-zip\util\constants.js"
	Delete "$INSTDIR\node_modules\adm-zip\util\errors.js"
	Delete "$INSTDIR\node_modules\adm-zip\util\fattr.js"
	Delete "$INSTDIR\node_modules\adm-zip\util\index.js"
	Delete "$INSTDIR\node_modules\adm-zip\util\utils.js"
	Delete "$INSTDIR\node_modules\explorer\explorer.js"
	Delete "$INSTDIR\node_modules\explorer\package.json"
	Delete "$INSTDIR\Resizer\dirlist.php"
	Delete "$INSTDIR\Resizer\gpl.txt"
	Delete "$INSTDIR\Resizer\libphp.php"
	Delete "$INSTDIR\Resizer\path.php"
	Delete "$INSTDIR\Resizer\README.txt"
	Delete "$INSTDIR\Resizer\resizer.css"
	Delete "$INSTDIR\Resizer\resizer.html"
	Delete "$INSTDIR\Resizer\resizer.php"
	Delete "$INSTDIR\Resizer\resizer.png"
	Delete "$INSTDIR\Resizer\images\dir.png"
	Delete "$INSTDIR\Resizer\images\img.png"

	; Remove remaining directories
	RMDir "$SMPROGRAMS\Tiloid"
	RMDir "$INSTDIR\Resizer\images\"
	RMDir "$INSTDIR\Resizer\"
	RMDir "$INSTDIR\node_modules\explorer\"
	RMDir "$INSTDIR\node_modules\adm-zip\util\"
	RMDir "$INSTDIR\node_modules\adm-zip\test\assets\attributes_test\New folder\"
	RMDir "$INSTDIR\node_modules\adm-zip\test\assets\attributes_test\asd\"
	RMDir "$INSTDIR\node_modules\adm-zip\test\assets\attributes_test\"
	RMDir "$INSTDIR\node_modules\adm-zip\test\assets\"
	RMDir "$INSTDIR\node_modules\adm-zip\test\"
	RMDir "$INSTDIR\node_modules\adm-zip\methods\"
	RMDir "$INSTDIR\node_modules\adm-zip\headers\"
	RMDir "$INSTDIR\node_modules\adm-zip\"
	RMDir "$INSTDIR\node_modules\"
	RMDir "$INSTDIR\nbproject\private\"
	RMDir "$INSTDIR\nbproject\"
	RMDir "$INSTDIR\LinkChecker\"
	RMDir "$INSTDIR\CodeEditor\mode\"
	RMDir "$INSTDIR\CodeEditor\lib\"
	RMDir "$INSTDIR\CodeEditor\images\"
	RMDir "$INSTDIR\CodeEditor\"
	RMDir "$INSTDIR\code\"
	RMDir "$INSTDIR\AExplorer\images\"
	RMDir "$INSTDIR\AExplorer\"
	RMDir "$INSTDIR\"

SectionEnd

; eof