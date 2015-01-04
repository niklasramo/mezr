#Mezr

Mezr is a lightweight stand-alone JavaScript library for measuring dimensions and offsets of DOM elements in modern browsers (IE9+). Mezr has a bit more extended variations of jQuery's popular methods such as offset, position, offsetParent, width and height, and a few handy extras too such as place method which mimics jQuery UI's position method.

##Project goals

* Lightweight and performant (emphasis on performant).
* Support all modern browsers (IE9+).
* Readable and well documented code (JSDoc).
* Comprehensive unit tests (Qunit).

##API 0.1.0

* [.width()](###.width())
* [.height()](###.height())
* [.winWidth()](###.winWidth())
* [.winHeight()](###.winHeight())
* [.docWidth()](###.docWidth())
* [.docHeight()](###.docHeight())
* [.offset()](###.offset())
* [.position()](###.position())
* [.offsetParent()](###.offsetParent())
* [.place()](###.place())

###.width()

Returns the width of an element in pixels (with scrollbar width always included). Accepts also the window object (for getting the viewport width) and the document object (for getting the width of the whole document) in place of element. By default viewport scrollbar width is excluded from window/document width, but setting the includeViewportScrollbar flag to true will return window/document width with the viewport scrollbar.

```javascript
// Format
mezr.width( el [, includePadding ] [, includeBorder ] [, includeMargin ] [, includeViewportScrollbar] )
```

###.height()

Returns the height of an element in pixels (with scrollbar height always included). Accepts also the window object (for getting the viewport height) and the document object (for getting the height of the whole document) in place of element. By default viewport scrollbar height is excluded from window/document height, but setting the includeViewportScrollbar flag to true will return window/document height with the viewport scrollbar.

```javascript
// Format
mezr.height( el [, includePadding ] [, includeBorder ] [, includeMargin ] [, includeViewportScrollbar] )
```

###.winWidth()

Shorthand function for getting the width of the viewport, optionally with the viewport scrollbar size included.

```javascript
// Format
mezr.winWidth( [ includeScrollbar ] )
```

###.winHeight()

Shorthand function for getting the height of the viewport, optionally with the viewport scrollbar size included.

```javascript
// Format
mezr.winHeight( [ includeScrollbar ] )
```

###.docWidth()

Shorthand function for getting the width of the document, optionally with the viewport scrollbar size included.

```javascript
// Format
mezr.docWidth( [ includeScrollbar ] )
```

###.docHeight()

Shorthand function for getting the height of the document, optionally with the viewport scrollbar size included.

```javascript
// Format
mezr.docHeight( [ includeScrollbar ] )
```

###.offset()

Returns the element's offset which in this case means the element's distance from the northwest corner of the document.

```javascript
// Format
mezr.offset( el [, includePadding ] [, includeBorder ] )
```

###.position()

Returns the element's position which in this case means the element's distance from it's offsetParent element.

```javascript
// Format
mezr.position( el [, includeParentPadding ] [, includeParentBorder ] )
```

###.offsetParent()

Returns provided element's true offset parent. Accepts window and document objects also. Document is the ground zero offset marker so it does not have an offset parent, ergo it returns null. Window's offset parent is the document.

```javascript
// Format
mezr.offsetParent( el )
```

###.place()

Get position (left and top props) of an element when positioned relative to another element.

```javascript
// Format
mezr.place( el [, options ] )
```

##License

Copyright &copy; 2015 Niklas Rämö. Licensed under **[the MIT license](LICENSE.md)**.