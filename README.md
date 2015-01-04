#Mezr

Mezr is a lightweight stand-alone JavaScript library for measuring dimensions and offsets of DOM elements in modern browsers (IE9+). Mezr has a bit more extended variations of jQuery's popular methods such as offset, position, offsetParent, width and height, and a few handy extras too such as place method which mimics jQuery UI's position method.

##Project goals

* Lightweight and performant (emphasis on performant).
* Support all modern browsers (IE9+).
* Readable and well documented code (JSDoc).
* Comprehensive unit tests (Qunit).

##API 0.1.0

* [.width()](#width)
* [.height()](#height)
* [.winWidth()](#winwidth)
* [.winHeight()](#winheight)
* [.docWidth()](#docwidth)
* [.docHeight()](#docheight)
* [.offset()](#offset)
* [.position()](#position)
* [.offsetParent()](#offsetparent)
* [.place()](#place)

###.width()

Returns the width of an element in pixels (with scrollbar width always included). Accepts also the window object (for getting the viewport width) and the document object (for getting the width of the whole document) in place of element. By default viewport scrollbar width is excluded from window/document width, but setting the includeViewportScrollbar flag to true will return window/document width with the viewport scrollbar.

**mezr.width( el [, includePadding ] [, includeBorder ] [, includeMargin ] [, includeViewportScrollbar] )**

* **el** *element / window / document*
* **includePadding** *boolean*
* **includeBorder** *boolean*
* **includeMargin** *boolean*
* **includeViewportScrollbar** *boolean*

**Returns** *number*

###.height()

Returns the height of an element in pixels (with scrollbar height always included). Accepts also the window object (for getting the viewport height) and the document object (for getting the height of the whole document) in place of element. By default viewport scrollbar height is excluded from window/document height, but setting the includeViewportScrollbar flag to true will return window/document height with the viewport scrollbar.

**mezr.height( el [, includePadding ] [, includeBorder ] [, includeMargin ] [, includeViewportScrollbar] )**

* **el** *element / window / document*
* **includePadding** *boolean*
* **includeBorder** *boolean*
* **includeMargin** *boolean*
* **includeViewportScrollbar** *boolean*

**Returns** *number*

###.winWidth()

Shorthand function for getting the width of the viewport, optionally with the viewport scrollbar size included.

**mezr.winWidth( [ includeScrollbar ] )**

* **includeScrollbar** *boolean*

**Returns** *number*

###.winHeight()

Shorthand function for getting the height of the viewport, optionally with the viewport scrollbar size included.

**mezr.winHeight( [ includeScrollbar ] )**

* **includeScrollbar** *boolean*

**Returns** *number*

###.docWidth()

Shorthand function for getting the width of the document, optionally with the viewport scrollbar size included.

**mezr.docWidth( [ includeScrollbar ] )**

* **includeScrollbar** *boolean*

**Returns** *number*

###.docHeight()

Shorthand function for getting the height of the document, optionally with the viewport scrollbar size included.

**mezr.docHeight( [ includeScrollbar ] )**

* **includeScrollbar** *boolean*

**Returns** *number*

###.offset()

Returns the element's left and top offset which in this case means the element's vertical and horizontal distance from the northwest corner of the document.

**mezr.offset( el [, includePadding ] [, includeBorder ] )**

* **el** *element / window / document*
* **includePadding** *boolean*
* **includeBorder** *boolean*

**Returns** *object*

###.position()

Returns the element's left and top position which in this case means the element's vertical and horizontal distance from it's offsetParent element.

**mezr.position( el [, includeParentPadding ] [, includeParentBorder ] )**

* **el** *element / window / document*
* **includeParentPadding** *boolean*
* **includeParentBorder** *boolean*

**Returns** *object*

###.offsetParent()

Returns provided element's true offset parent. Accepts window and document objects also. Document is the ground zero offset marker so it does not have an offset parent, ergo it returns null. Window's offset parent is the document.

**mezr.offsetParent( el )**

* **el** *element / window / document*

**Returns** *element / null*

###.place()

Get position (left and top props) of an element when positioned relative to another element.

**mezr.place( el [, options ] )**

* **el** *element*
* **options** *object*

**Returns** *object*

##License

Copyright &copy; 2015 Niklas Rämö. Licensed under **[the MIT license](LICENSE.md)**.
