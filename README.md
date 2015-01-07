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
* [.offset()](#offset)
* [.position()](#position)
* [.offsetParent()](#offsetparent)
* [.place()](#place)

---

###`.width()`

Returns the width of an element in pixels. Accepts also the window object (for getting the viewport width) and the document object (for getting the width of the whole document) in place of element.

**Syntax**

`mezr.width( el [, includeScrollbar] [, includePadding ] [, includeBorder ] [, includeMargin ] )`

**Parameters**

* **`el`** - *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **`[includeScrollbar]`** - *boolean*
  * When set to true the element's vertical scrollbar width will be added to the return value (if visible). Root element is handled as an element that can not posess a scrollbar. The outermost scrollbar (viewport's scrollbar) is considered as a part of the window and the document.
* **`[includePadding]`** - *boolean*
  * When set to true the element's left and right padding will be added to the return value.
* **`[includeBorder]`** - *boolean*
  * When set to true the element's left and right border width will be added to the return value.
* **`[includeMargin]`** - *boolean*
  * When set to true the element's left and right margin will be added to the return value. Negative margin will be substracted from the return value.

**Returns** &raquo; *number*

---

###`.height()`

Returns the height of an element in pixels. Accepts also the window object (for getting the viewport height) and the document object (for getting the height of the whole document) in place of element.

**Syntax**

`mezr.height( el [, includeScrollbar] [, includePadding ] [, includeBorder ] [, includeMargin ] )`

**Parameters**

* **`el`** - *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **`[includeScrollbar]`** - *boolean*
  * When set to true the element's horizontal scrollbar height will be added to the return value (if visible). Root element is handled as an element that can not posess a scrollbar. The outermost scrollbar (viewport's scrollbar) is considered as a part of the window and the document.
* **`[includePadding]`** - *boolean*
  * When set to true the element's top and bottom padding will be added to the return value.
* **`[includeBorder]`** - *boolean*
  * When set to true the element's top and bottom border width will be added to the return value.
* **`[includeMargin]`** - *boolean*
  * When set to true the element's top and bottom margin will be added to the return value. Negative margin will be substracted from the return value.

**Returns** &raquo; *number*

---

###`.offset()`

Returns the element's left and top offset which in this case means the element's vertical and horizontal distance from the northwest corner of the document.

**Syntax**

`mezr.offset( el [, includePadding ] [, includeBorder ] )`

* **`el`** - *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **`[includePadding]`** - *boolean*
* **`[includeBorder]`** - *boolean*

**Returns** &raquo; *object*

The returned object contains `left` and `top` properties that represent the left and top offset of the provided element in pixels.

---

###`.position()`

Returns the element's left and top position which in this case means the element's vertical and horizontal distance from it's offsetParent element.

**Syntax**

`mezr.position( el [, includeParentPadding ] [, includeParentBorder ] )`

* **`el`** - *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **`[includeParentPadding]`** - *boolean*
* **`[includeParentBorder]`** - *boolean*

**Returns** &raquo; *object*

The returned object contains `left` and `top` properties that represent the left and top position of the provided element in pixels.

---

###`.offsetParent()`

Returns provided element's true offset parent. Accepts window and document objects also. Document is the ground zero offset marker so it does not have an offset parent, ergo it returns null. Window's offset parent is the document.

**Syntax**

`mezr.offsetParent( el )`

**Parameters**

* **`el`** - *element / window / document*
  * Accepts any DOM element, the document object or the window object.

**Returns** &raquo; *element / null*

The return value is null if document is provided as the element.

---

###`.place()`

Get position (left and top props) of an element when positioned relative to another element.

**Syntax**

`mezr.place( el [, options ] )`

**Parameters**

* **`el`** - *element*
  * Accepts any DOM element.
* **`[options]`** - *object*
  * TODO: Documentation.

**Returns** &raquo; *object*

The returned object contains `left` and `top` properties that represent the left and top position of the provided element in pixels.

---

##License

Copyright &copy; 2015 Niklas Rämö. Licensed under **[the MIT license](LICENSE.md)**.
