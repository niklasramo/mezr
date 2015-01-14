#Mezr

Mezr is a lightweight JavaScript utility library for measuring and comparing the dimensions and distances of HTML DOM elements in modern browsers (IE9+). Mezr has a bit more extended variations of jQuery's popular methods such as offset, offsetParent, width and height, and a few handy extras too such as place method which mimics jQuery UI's position method.

##Project goals

* Lightweight and performant (emphasis on performant).
* Support all modern browsers (IE9+).
* Well documented codebase (JSDoc syntax).
* Comprehensive unit tests (Qunit).

##API 0.3.0-alpha

* [.width()](#width)
* [.height()](#height)
* [.offset()](#offset)
* [.offsetParent()](#offsetparent)
* [.distance()](#distance)
* [.place()](#place)
* .overlap() (coming up in version 0.4)

&nbsp;

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

The return value may be fractional when calculating the width of an element. In the case of window and document the value is always an integer.

&nbsp;

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

The return value may be fractional when calculating the height of an element. In the case of window and document the value is always an integer.

&nbsp;

###`.offset()`

Returns the element's offset, which in practice means the vertical and horizontal distance between the element's northwest corner and the document's northwest corner. By default the edge of the element's border is considered as the edge of the element, but you can make the function include the element's border width and padding in the return value as well.

**Syntax**

`mezr.offset( el [, includeBorder ] [, includePadding ] )`

**Parameters**

* **`el`** - *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **`[includeBorder]`** - *boolean*
  * When set to true the element's left and top border width will be added to the return value.
* **`[includePadding]`** - *boolean*
  * When set to true the element's left and top padding will be added to the return value.

**Returns** &raquo; *object*

* **`left`** - *number*
  * The element's left offset in pixels, value can be fractional.
* **`top`** - *number*
  * The element's top offset in pixels, value can be fractional.

&nbsp;

###`.offsetParent()`

Returns the element's offset parent. This function works in the same manner as the native elem.offsetParent method with a few tweaks and logic changes. The function accepts the window object and the document object in addition to DOM elements. Document object is considered as the base offset point against which the element/window offsets are compared to. This in turn means that the document object does not have an offset parent and returns null if provided as the element. Document is also considered as the window's offset parent. Window is considered as the offset parent of all fixed elements. Root and body elements are treated equally with all other DOM elements. For example body's offset parent is the root element if root element is positioned, but if the root element is static the body's offset parent is the document object.

**Syntax**

`mezr.offsetParent( el )`

**Parameters**

* **`el`** - *element / window / document*
  * Accepts any DOM element, the document object or the window object.

**Returns** &raquo; *element / null*

The return value is null if document object is provided as the element.

&nbsp;

###`.distance()`

Returns the vertical, horizontal and direct distance between two offset coordinates. Accepts direct offset as an object or alternatively an array in which case the the offset is retrieved automatically using mezr.offset method with the array's values as the function arguments. This function was originally intended to mimic jQuery's position method, but evolved into a lower level utility function to provide more control.

**Syntax**

`mezr.distance( coordFrom , coordTo )`

**Parameters**

* **`coordFrom`** - *object / array*
  * Object: must have left and top properties with numeric values (e.g. `{left: 10, top: -10}`).
  * Array: calls mezr.offset() using the array's values as the offset's arguments (e.g `[document.body, true, true]`).
* **`coordTo`** - *object / array*
  * Same specs as for coordFrom.  

**Returns** &raquo; *object*

* **`left`** - *number*
  * Horizontal distance between the two coordinates. Negative number if `coordFrom.left > coordTo.left`, otherwise positive.
  * `coordTo.left - coordFrom.left`
* **`top`** - *number*
  * Vertical distance between the two coordinates. Negative number if `coordFrom.top > coordTo.top`, otherwise positive.
  * `coordTo.top - coordFrom.top`
* **`direct`** - *number*
  * Direct distance between the two coordinates in pixels.
  * `Math.sqrt( Math.pow( returnObj.left, 2 ) + Math.pow( returnObj.top, 2 ) )`

&nbsp;

###`.place()`

Calculate an element's position (left/top CSS properties) when positioned relative to other elements, window or the document. This method is especially helpful in scenarios where the DOM tree is deeply nested and it's difficult to calculate an element's position using only CSS. The API is heavily inspired by the jQuery UI's position method.

There are a couple of things to note though.

* The target element's margins will not have any effect on the left/top return values of this function. Please consider the element's margins as an extra offset. This behaviour is by design, not a bug.
* When calculating the dimensions of elements (target/of/within) the outer width/height (includes scrollbar, borders and padding) is used. For window and document the scrollbar width/height is always omitted.

There's a chance that new options will be introduced in an upcoming version where you can control the behaviour mentioned in the notes above.

**Syntax**

`mezr.place( el [, options ] )`

**Parameters**

* **`el`** - *element*
  * The target (positioned) element.
* **`[options]`** - *object*
  * A set of options that defines how the target element is positioned against the relative element.
* **`options.my`** - *string*
  * Default: *"left top"*
  * The position of the target element that will be aligned against the relative element's position. The syntax is "horizontal vertical". Accepts "left", "center", "right" for horizontal values and "top", "center", "bottom" for vertical values. Example: "left top" or "center center".
* **`options.at`** - *string*
  * Default: *"left top"*
  * The position of the relative element that will be aligned against the target element's position. The syntax is "horizontal vertical". Accepts "left", "center", "right" for horizontal values and "top", "center", "bottom" for vertical values. Example: "left top" or "center center".
* **`options.of`** - *element / window / document / array*
  * Default: *window*
  * Defines which element the target element is positioned against. Alternatively you can define a point within an element using the following format: [x-coordinate, y-coordinate, element/window/document].
* **`options.offsetX`** - *number*
  * Default: *0*
  * An optional horizontal offset in pixels.
* **`options.offsetY`** - *number*
  * Default: *0*
  * An optional vertical offset in pixels.
* **`options.within`** - *element / window / document / array*
  * Default: *null*
  * Defines an optional container element that is used for collision detection. Alternatively you can define a point within an element using the following format: [x-coordinate, y-coordinate, element/window/document].
* **`options.collision`** - *object / null*
  * Default: *{left: 'push', right: 'push', top: 'push', bottom: 'push'}*
  * Defines how the collisions are handled per each side when a container element is defined (within option is in use). The option expects an object that has left, right, top and bottom properties set, representing the sides of the target element. Acceptable values for each side are "none", "push" and "forcePush". "none" will ignore containment for the specific side. "push" tries to keep the targeted side of the target element within the container element's boundaries. If the container element is smaller than the target element and you want to make sure that a specific side will always be pushed fully inside the container element's area you can use "forcePush".

**Returns** &raquo; *object*

* **`left`** - *number*
  * The positioned element's left (CSS) property value (can be fractional). 
* **`top`** - *number*
  * The positioned element's top (CSS) property value (can be fractional). 

&nbsp;

##License

Copyright &copy; 2015 Niklas Rämö. Licensed under **[the MIT license](LICENSE.md)**.
