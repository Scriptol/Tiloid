/**
	PHP Implementation of DOM official
	Fully compatible with PHP, requires Scriptol PHP
	This interface (c) 2007-2008 Denis Sureau - LPGL
	
	This is not compatible with the current dom library of Scriptol C++,
	but will be implemented further as C++ extension.
*/

extern

class DOMElement

	cstring textContent

	boolean hasAttribute(cstring)
	cstring getAttribute(cstring)
	boolean setAttribute(cstring, cstring)
	boolean removeAttribute(cstring)
/class

class DOMComment
/class

class DOMText
	DOMText splitText()
/class

class DOMNode
	DOMNode appendChild(DOMNode)
	DOMNode removeChild(DOMNode)
	text nodeValue         // the content
/class

class DOMNodeList
	DOMNode item(integer)
	int length             // the number of elements
/class

class DOMDocument

	boolean loadHTMLFile(cstring)	// Load a HTML file
	boolean loadHTML(cstring)		// Create HTML from the raw content of a string
	boolean load(cstring)		// Load an XML file
	boolean loadXML(cstring)		// Convert a string into XML. 
	dyn save(cstring)			// Save HTML or XML into a file.
	cstring saveHTML(cstring = null)	// Return a HTML document (save to string)
	cstring saveXML(cstring = null)	// Return an XML document (save to string)
	
	DOMElement getElementById(cstring)
	DOMNodeList getElementsByTagName(cstring)
	
	boolean validate()		// Check using the DTD of the document
	
	DOMText createTextNode (cstring)
	DOMNode appendChild(DOMNode)
	DOMElement createElement(cstring)	// Create an orphan DOMElement, use appendChild
	DOMComment createComment(cstring)	// Create an orphan DOMComment

/class

/extern


