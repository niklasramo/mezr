#Mezr

Mezr is a lightweight JavaScript utility library for measuring and comparing the dimensions and distances of HTML DOM elements in modern browsers (IE9+). Mezr has a bit more extended variations of jQuery's popular methods such as offset, offsetParent, width and height, and a few handy extras too such as place method which mimics jQuery UI's position method.

All methods are optimized for best possible performance while keeping the codebase as minimal as possible. The library is also extremely well tested and documented.

##Features

* Lightweight and performant.
* Support all modern browsers (IE9+).
* Well documented codebase (JSDoc syntax).
* Comprehensive unit tests (Qunit).
* No dependencies.

##API 0.3.0-2

* [.width()](#width)
* [.height()](#height)
* [.offset()](#offset)
* [.offsetParent()](#offsetparent)
* [.distance()](#distance)
* [.overlap()](#overlap)
* [.place()](#place)

&nbsp;

###.width()

Returns the width of an element in pixels. Accepts also the window object (for getting the viewport width) and the document object (for getting the width of the whole document).

**Syntax**

`mezr.width( el [, includeScrollbar] [, includePadding ] [, includeBorder ] [, includeMargin ] )`

**Parameters**

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **includeScrollbar** &nbsp;&mdash;&nbsp; *boolean*
  * Default: `false`
  * When set to true the element's vertical scrollbar width will be added to the return value (if visible). Root element's scrollbar as the document's and window's scrollbar also.
* **includePadding** &nbsp;&mdash;&nbsp; *boolean*
  * Default: `false`
  * When set to true the element's left and right padding will be added to the return value.
* **includeBorder** &nbsp;&mdash;&nbsp; *boolean*
  * Default: `false`
  * When set to true the element's left and right border width will be added to the return value.
* **includeMargin** &nbsp;&mdash;&nbsp; *boolean*
  * Default: `false`
  * When set to true the element's left and right margin will be added to the return value. A negative margin will be substracted from the return value.

**Returns** &nbsp;&mdash;&nbsp; *number*

The return value may be fractional when calculating the width of an element. For window and document objects the value is always an integer though.

**Examples**

```javascript
// Document width without viewport scrollbar.
// jQuery -> $(document).width()
var docWidth = mezr.width(document);

// Document width with viewport scrollbar.
// No jQuery alternative.
var docWidth = mezr.width(document, true);

// Window width without viewport scrollbar.
// jQuery -> $(window).width()
var winWidth = mezr.width(window);

// Window width with viewport scrollbar (handy for working with media queries).
// No jQuery alternative.
var winWidth = mezr.width(window, true);

// Element width with scrollbar.
// jQuery -> $('body').width()
var bodyWidth = mezr.width(document.body, true);

// Element width with scrollbar and padding.
// jQuery -> $('body').innerWidth()
var bodyWidth = mezr.width(document.body, true);

// Element width with scrollbar, padding and border.
// jQuery -> $('body').outerWidth()
var bodyWidth = mezr.width(document.body, true, true, true);

// Element width with scrollbar, padding, border and margin.
// jQuery -> $('body').outerWidth(true)
var bodyWidth = mezr.width(document.body, true, true, true, true);

// Element width without scrollbar.
// No jQuery alternative.
var bodyWidth = mezr.width(document.body);
```

&nbsp;

###.height()

Returns the height of an element in pixels. Accepts also the window object (for getting the viewport height) and the document object (for getting the height of the whole document).

**Syntax**

`mezr.height( el [, includeScrollbar] [, includePadding ] [, includeBorder ] [, includeMargin ] )`

**Parameters**

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **includeScrollbar** &nbsp;&mdash;&nbsp; *boolean*
  * Default: `false`
  * When set to true the element's horizontal scrollbar height will be added to the return value (if visible). Root element's scrollbar as the document's and window's scrollbar also.
* **includePadding** &nbsp;&mdash;&nbsp; *boolean*
  * Default: `false`
  * When set to true the element's top and bottom padding will be added to the return value.
* **includeBorder** &nbsp;&mdash;&nbsp; *boolean*
  * Default: `false`
  * When set to true the element's top and bottom border width will be added to the return value.
* **includeMargin** &nbsp;&mdash;&nbsp; *boolean*
  * Default: `false`
  * When set to true the element's top and bottom margin will be added to the return value. A negative margin will be substracted from the return value.

**Returns** &nbsp;&mdash;&nbsp; *number*

The return value may be fractional when calculating the height of an element. In the case of window and document the value is always an integer.

**Examples**

Check the examples for mezr.width(), same stuff applies to mezr.height().

&nbsp;

###.offset()

Returns the element's offset, which in practice means the vertical and horizontal distance between the element's northwest corner and the document's northwest corner. By default the edge of the element's border is considered as the edge of the element, but you can make the function include the element's border width and padding in the return value as well.

**Syntax**

`mezr.offset( el [, includeBorder ] [, includePadding ] )`

**Parameters**

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **includeBorder** &nbsp;&mdash;&nbsp; *boolean*
  * Default: `false`
  * When set to true the element's left and top border width will be added to the return value.
* **includePadding** &nbsp;&mdash;&nbsp; *boolean*
  * Default: `false`
  * When set to true the element's left and top padding will be added to the return value.

**Returns** &nbsp;&mdash;&nbsp; *object*

* **obj.left** &nbsp;&mdash;&nbsp; *number*
  * The element's left offset in pixels (fractional).
* **obj.top** &nbsp;&mdash;&nbsp; *number*
  * The element's top offset in pixels (fractional).

**Examples**

```javascript
// Get element offset.
var elemOffset = mezr.offset(document.getElementById('someElement'));
// => {left: ..., top: ...}
```

&nbsp;

###.offsetParent()

Returns the element's offset parent. This function works in the same manner as the native elem.offsetParent method with a few tweaks and logic changes. The function accepts the window object and the document object in addition to DOM elements. Document object is considered as the base offset point against which the element/window offsets are compared to. This in turn means that the document object does not have an offset parent and returns null if provided as the element. Document is also considered as the window's offset parent. Window is considered as the offset parent of all fixed elements. Root and body elements are treated equally with all other DOM elements. For example body's offset parent is the root element if root element is positioned, but if the root element is static the body's offset parent is the document object.

**Syntax**

`mezr.offsetParent( el )`

**Parameters**

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.

**Returns** &nbsp;&mdash;&nbsp; *element / null*

The return value is null if document object is provided as the element.

**Examples**

```javascript
// Get fixed element's offset parent.
var offsetParent = mezr.offsetParent(document.getElementById('fixedElem'));
// => window
```

&nbsp;

###.distance()

Returns the vertical, horizontal and direct distance between two offset coordinates. Accepts direct offset as an object or alternatively an array in which case the the offset is retrieved automatically using mezr.offset method with the array's values as the function arguments. This function was originally intended to mimic jQuery's position method, but evolved into a lower level utility function to provide more control.

**Syntax**

`mezr.distance( coordFrom , coordTo )`

**Parameters**

* **coordFrom** &nbsp;&mdash;&nbsp; *object / array*
  * Array: calls mezr.offset() using the array's values as the offset's arguments (e.g `[document.body, true, true]`).
  * Object: must have left and top properties with numeric values (e.g. `{left: 10, top: -10}`).
* **coordTo** &nbsp;&mdash;&nbsp; *object / array*
  * Same specs as with coordFrom.

**Returns** &nbsp;&mdash;&nbsp; *object*

* **obj.left** &nbsp;&mdash;&nbsp; *number*
  * Horizontal distance between the two coordinates. Negative number if `coordFrom.left > coordTo.left`, otherwise positive.
  * Formula: `coordTo.left - coordFrom.left`
* **obj.top** &nbsp;&mdash;&nbsp; *number*
  * Vertical distance between the two coordinates. Negative number if `coordFrom.top > coordTo.top`, otherwise positive.
  * Formula: `coordTo.top - coordFrom.top`
* **obj.direct** &nbsp;&mdash;&nbsp; *number*
  * Direct distance between the two coordinates in pixels.
  * Formula: `Math.sqrt( Math.pow( obj.left, 2 ) + Math.pow( obj.top, 2 ) )`

**Examples**

```javascript
// Get distance by typing coordinates manually.
var dist = mezr.distance({left: 5, top: -5}, {left: -5, top: 5});
// => {left: -10, top: 10, direct: 14.142135623730951}

// Get distance using Mezr's offset function.
var dist = mezr.distance([elemFrom], [elemTo]);

// Mimic jQuery's .position() method.
var elem = document.getElementById('someElem');
var mezrPos = mezr.distance([mezr.offsetParent(elem), true], [elem]);
var jqPos = $(elem).position();
// jqPos.left === mezrPos.left
// jqPos.top === mezrPos.top
// However, note that jQuery .position() excludes the element's margins from the
// left and top values which may or may not be wanted depending on the situation.
// Mezr always includes element's margins as part of the offset and you can not
// exclude them via an option (at least yet). So, long story short, the mezrPos
// values match jqPos values in the above case only if the element does not have
// margins set.
```

&nbsp;

###.overlap()

Check if an element overlaps another element. The element data is fetched with internal getRect function which means you can specify an element directly, use an array for more control over paddings and borders (see arguments for mezr.width() and mezr.height()) or just provide dimensions and offset directly with an object. Returns a boolean by default, but optionally one can set the returnIntersection flag to true and make the function return explicit intersection data.

**Syntax**

`mezr.overlap( a, b, returnIntersection )`

**Parameters**

* **a** &nbsp;&mdash;&nbsp; *element / array / object*
  * Element: Calculates the element's width and height with scrollbar, padding and border included.
  * Array: calls mezr.width() and mezr.height() using the array's values as the function arguments (e.g `[document.body, true, true]`).
  * Object: must have width, height, offset.left and offset.top properties with numeric values (e.g. `{width: 10, height: 20, offset: {left: 15, top: -10}}`).
* **b** &nbsp;&mdash;&nbsp; *object / array*
  * Same specs as for a.
* **returnIntersection** &nbsp;&mdash;&nbsp; *object / array*
  * Default: `false`
  * Make the function return explicit intersection data instead of boolean.

**Returns** &nbsp;&mdash;&nbsp; *boolean / object*

* **obj.width** &nbsp;&mdash;&nbsp; *number*
  * The width of the intersection area in pixels (fractional).
* **obj.height** &nbsp;&mdash;&nbsp; *number*
  * The height of the intersection area in pixels (fractional).
* **obj.offset.left** &nbsp;&mdash;&nbsp; *number*
  * The intersection area's left offset (from document's northwest corner).
* **obj.offset.top** &nbsp;&mdash;&nbsp; *number*
  * The intersection area's top offset (from document's northwest corner).
* **obj.coverage.a** &nbsp;&mdash;&nbsp; *number*
  *  What percentage of a's area covers the intersection area.
* **obj.coverage.b** &nbsp;&mdash;&nbsp; *number*
  *  What percentage of b's area covers the intersection area.
* **obj.coverage.total** &nbsp;&mdash;&nbsp; *number*
  *  obj.coverage.a + obj.coverage.b

**Examples**

```javascript
// Check if two rectangles overlap.
var rectA = {width: 10, height: 10, offset: {left: 10, top: 10 }};
var rectB = {width: 10, height: 10, offset: {left: 19, top: 19 }};
var overlap = mezr.overlap(rectA, rectB);

// Check if two elements overlap.
// Elements' "outer" dimensions are used by default
// -> includes scrollbar, padding and border
var elemA = document.getElementById('elemA');
var elemB = document.getElementById('elemB');
var overlap = mezr.overlap(elemA, elemB);

// Check if elemA (excluding it's borders) overlaps with rectB
// and return intersection object instead of boolean.
var overlap = mezr.overlap([elemA, true, true], rectB, true);
```

&nbsp;

###.place()

Calculate an element's position (left/top CSS properties) when positioned relative to other elements, window or the document. This method is especially helpful in scenarios where the DOM tree is deeply nested and it's difficult to calculate an element's position using only CSS. The API is heavily inspired by the jQuery UI's position method.

There are a couple of things to note though.

* The target element's margins will not have any effect on the left/top return values of this function. Please consider the element's margins as an extra offset. This behaviour is by design, not a bug. There is a chance that there will be an option to account for the margins in the near future.
* When calculating the dimensions of provided elements (target/of/within) the outer width and height (includes scrollbar, borders and padding) are used by default. For window and document the scrollbar width/height is always omitted by default. However, you can optionally provide an array in which case the mezr.width/height are called with the provided arguments to get the element's width and height which means that you can choose whether or not to include the element's scrollbar, padding and/or border. Margins are never included in width and height, even if so specified, since mezr.offset does not support omitting margins from the offset (yet).

**Syntax**

`mezr.place( el [, options ] )`

**Parameters**

* **el** &nbsp;&mdash;&nbsp; *element / array*
  * The target (positioned) element. When an array is provided the element's dimensions are calculated using mezr.width() and mezr.height() methods with the array's values as arguments. The offset calculations are adjusted automatically.
* **options** &nbsp;&mdash;&nbsp; *object*
  * A set of options that defines how the target element is positioned against the relative element.
* **options.my** &nbsp;&mdash;&nbsp; *string*
  * Default: `"left top"`
  * The position of the target element that will be aligned against the relative element's position. The syntax is "horizontal vertical". Accepts "left", "center", "right" for horizontal values and "top", "center", "bottom" for vertical values. Example: "left top" or "center center".
* **options.at** &nbsp;&mdash;&nbsp; *string*
  * Default: `"left top"`
  * The position of the relative element that will be aligned against the target element's position. The syntax is "horizontal vertical". Accepts "left", "center", "right" for horizontal values and "top", "center", "bottom" for vertical values. Example: "left top" or "center center".
* **options.of** &nbsp;&mdash;&nbsp; *element / window / document / array*
  * Default: `window`
  * Defines which element the target element is positioned against. When an array is provided the element's dimensions are calculated using mezr.width() and mezr.height() methods with the array's values as arguments. The offset calculations are adjusted automatically.
* **options.offsetX** &nbsp;&mdash;&nbsp; *number*
  * Default: `0`
  * An optional horizontal offset in pixels.
* **options.offsetY** &nbsp;&mdash;&nbsp; *number*
  * Default: `0`
  * An optional vertical offset in pixels.
* **options.within** &nbsp;&mdash;&nbsp; *element / window / document / array*
  * Default: `null`
  * Defines an optional container element that is used for collision detection. When an array is provided the element's dimensions are calculated using mezr.width() and mezr.height() methods with the array's values as arguments. The offset calculations are adjusted automatically.
* **options.collision** &nbsp;&mdash;&nbsp; *object / null*
  * Default: `{left: 'push', right: 'push', top: 'push', bottom: 'push'}`
  * Defines how the collisions are handled per each side when a container element is defined (within option is in use). The option expects an object that has left, right, top and bottom properties set, representing the sides of the target element. Acceptable values for each side are "none", "push" and "forcePush". "none" will ignore containment for the specific side. "push" tries to keep the targeted side of the target element within the container element's boundaries. If the container element is smaller than the target element and you want to make sure that a specific side will always be pushed fully inside the container element's area you can use "forcePush".

**Returns** &nbsp;&mdash;&nbsp; *object*

* **obj.left** &nbsp;&mdash;&nbsp; *number*
  * The positioned element's left (CSS) property value (fractional).
* **obj.top** &nbsp;&mdash;&nbsp; *number*
  * The positioned element's top (CSS) property value (fractional).

&nbsp;

##License

Copyright &copy; 2015 Niklas Rämö. Licensed under **[the MIT license](LICENSE.md)**.
