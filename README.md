# Mezr

Mezr is a lightweight JavaScript utility library for measuring and comparing the dimensions and positions of HTML DOM elements in modern browsers (IE9+). Intended for developers who want to keep their sanity when doing DOM algebra =)

**Features**

* No dependencies.
* Cross-browser (IE9+).
* Fast (does not touch DOM, ever).
* Advanced element positioning.
* Collision detection.
* Enough buzzwords already..?

## API 0.4.0

* [.width()](#width)
* [.height()](#height)
* [.offset()](#offset)
* [.offsetParent()](#offsetparent)
* [.distance()](#distance)
* [.intersection()](#intersection)
* [.place()](#place)

&nbsp;

### .width()

Returns the width of an element in pixels. Accepts also the window object (for getting the viewport width) and the document object (for getting the width of the whole document).

**Syntax**

`mezr.width( el [, edge ] [, includeScrollbar ] )`

**Parameters**

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **edge** &nbsp;&mdash;&nbsp; *number / string*
  * Default: `"border"`
  * Defines which layer (core, padding, border, margin) of the element is considered as the outer edge of the element.
  * This argument has no effect for `window` and `document`.
  * The edge can be described with a number or a string, here are the possible values:
    * `"core"` -> `0`
    * `"padding"` -> `1`
    * `"border"` -> `2`
    * `"margin"` -> `3`
  * If the value of this argument is set to `"margin"` only positive margins are considered as part of the element's size. Negative margins are completelty ignored and not subtracted from the end value as some might expect. This is an intentional design choice.
* **includeScrollbar** &nbsp;&mdash;&nbsp; *boolean*
  * Default: `true`
  * When set to false the element's vertical scrollbar's width will be substracted from the return value (if visible). Please note that excluding the scrollbar's width makes sense only when the edge argument's value is either `"core"` or `"border"` due to the way scrollbar behaves.

**Returns** &nbsp;&mdash;&nbsp; *number*

The return value may be fractional when calculating the width of an element. For window and document objects the value is always an integer though.

**Examples**

```javascript
// Document width with viewport scrollbar.
// No jQuery alternative.
var docWidth = mezr.width(document);

// Document width without viewport scrollbar.
// jQuery -> $(document).width()
var docWidth = mezr.width(document, "core", false);

// Window width with viewport scrollbar (handy for working with media queries).
// No jQuery alternative.
var winWidth = mezr.width(window);

// Window width without viewport scrollbar.
// jQuery -> $(window).width()
var winWidth = mezr.width(window, "core", false);

// Element width with scrollbar.
// jQuery -> $('body').width()
var coreWidth = mezr.width(document.body, "core");

// Element width with scrollbar and padding.
// jQuery -> $('body').innerWidth()
var paddingWidth = mezr.width(document.body, "padding");

// Element width with scrollbar, padding and border.
// Note that "border" is the default value for the 2nd argument.
// jQuery -> $('body').outerWidth()
var borderWidth = mezr.width(document.body, "border");
var borderWidth = mezr.width(document.body);

// Element width with scrollbar, padding, border and margin.
// Note that Mezr ignores negative margins. They are not
// added to nor subtracted from the end result.
// jQuery -> $('body').outerWidth(true)
var marginWidth = mezr.width(document.body, "margin");

// Element core width without scrollbar.
// No jQuery alternative.
var coreWidthNoSb = mezr.width(document.body, "core", false);

// Element core + padding width without scrollbar.
// No jQuery alternative.
var paddingWidthNoSb = mezr.width(document.body, "padding", false);
```

&nbsp;

### .height()

Returns the height of an element in pixels. Accepts also the window object (for getting the viewport height) and the document object (for getting the height of the whole document).

**Syntax**

`mezr.height( el [, edge ] [, includeScrollbar ] )`

**Parameters**

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **edge** &nbsp;&mdash;&nbsp; *number / string*
  * Default: `"border"`
  * Defines which layer (core, padding, border, margin) of the element is considered as the outer edge of the element.
  * This argument has no effect for `window` and `document`.
  * The edge can be described with a number or a string, here are the possible values:
    * `"core"` -> `0`
    * `"padding"` -> `1`
    * `"border"` -> `2`
    * `"margin"` -> `3`
  * If the value of this argument is set to `"margin"` only positive margins are considered as part of the element's size. Negative margins are completelty ignored and not subtracted from the end value as some might expect. This is an intentional design choice.
* **includeScrollbar** &nbsp;&mdash;&nbsp; *boolean*
  * Default: `true`
  * When set to false the element's horizontal scrollbar's height will be substracted from the return value (if visible). Please note that excluding the scrollbar's height makes sense only when the edge argument's value is either `"core"` or `"border"` due to the way scrollbar behaves.

**Returns** &nbsp;&mdash;&nbsp; *number*

The return value may be fractional when calculating the height of an element. For window and document objects the value is always an integer though.

**Examples**

Check the examples for [.width()](#width), same stuff applies to [.height()](#height). Just translate all mentions of *width* to *height*.

&nbsp;

### .offset()

Returns the element's offset, which in practice means the vertical and horizontal distance between the element's northwest corner and the document's northwest corner. The edge argument controls which layer (core, padding, border, margin) of the element is considered as the edge of the element for calculations. For example if the edge was set to 1 or "padding" the element's margins and borders would be added to the offsets.

**Syntax**

`mezr.offset( el [, edge ] )`

**Parameters**

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **edge** &nbsp;&mdash;&nbsp; *boolean*
  * Default: `"border"`
  * Defines which layer (core, padding, border, margin) of the element is considered as the outer edge of the element.
  * This argument has no effect for `window` and `document`.
  * The edge can be described with a number or a string, here are the possible values:
    * `"core"` -> `0`
    * `"padding"` -> `1`
    * `"border"` -> `2`
    * `"margin"` -> `3`
  * If the value of this argument is set to `"margin"` only positive margins are considered as part of the element's size. Negative margins are completelty ignored and not subtracted from the end value as some might expect. This is an intentional design choice.

**Returns** &nbsp;&mdash;&nbsp; *object*

* **obj.left** &nbsp;&mdash;&nbsp; *number*
  * The element's left offset in pixels (fractional).
* **obj.top** &nbsp;&mdash;&nbsp; *number*
  * The element's top offset in pixels (fractional).

**Examples**

```javascript
var elem = document.createElement('div');
document.body.appendChild(elem);
elem.style.cssText = 'position: fixed; width: 100px; height: 100px; left: 100px; top: 50px;';
window.scrollTo(0, 0);

// Get element's offset.
var offset = mezr.offset(elem); // {left: 100, top: 50}
```

&nbsp;

### .offsetParent()

Returns the element's offset parent. This function works in the same manner as the native elem.offsetParent method with a few tweaks and logic changes. The function accepts the window object and the document object in addition to DOM elements. Document object is considered as the base offset point against which the element/window offsets are compared to. This in turn means that the document object does not have an offset parent and returns null if provided as the element. Document is also considered as the window's offset parent. Window is considered as the offset parent of all fixed elements. Root and body elements are treated equally with all other DOM elements. For example body's offset parent is the root element if root element is positioned, but if the root element is static the body's offset parent is the document object.

**Syntax**

`mezr.offsetParent( el )`

**Parameters**

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.

**Returns** &nbsp;&mdash;&nbsp; *element / null*

The return value is `null` if document object is provided as the element.

**Examples**

```javascript
var elem = document.createElement('div');
document.body.appendChild(elem);
elem.style.cssText = 'position: fixed;';

// Get fixed element's offset parent.
var offsetParent = mezr.offsetParent(elem); // window
```

&nbsp;

### .distance()

Returns the distance between two elements (in pixels) or `-1` if the elements overlap.

**Syntax**

`mezr.distance( elemA , elemB )`

**Parameters**

* **elemA** &nbsp;&mdash;&nbsp; *element / array / object*
  * Element: calculates the element's dimensions with scrollbar, paddings and borders.
  * Array: calculates the element's dimensions using the [`.width()`](#width) and [`.height()`](#height) methods. The array's values are used as the arguments for the method calls.
  * Object: must have width, height, left and top properties with numeric values (e.g. `{width: 10, height: 10, left: 10, top: -10}`).
* **elemB** &nbsp;&mdash;&nbsp; *element / array / object*
  * Same specs as with elemA.

**Returns** &nbsp;&mdash;&nbsp; *number*

If elements overlap returns -1. Otherwise returns the distance between the elements.

**Examples**

```javascript
var elemA = document.createElement('div');
var elemB = document.createElement('div');
document.body.appendChild(elemA);
document.body.appendChild(elemB);
elemA.style.cssText = 'position: fixed; width: 100px; height: 100px; left: 0; top: 0;';
elemB.style.cssText = 'position: fixed; width: 100px; height: 100px; left: 150px; top: 0;';

// Calculate the distance between two elements.
var distance = mezr.distance(elemA, elemB); // 50

// If the element's overlap -1 is always returned.
elemB.style.left = '50px';
var distance = mezr.distance(elemA, elemB); // -1
```

&nbsp;

### .intersection()

Detect if two elements overlap and calculate the possible intersection area's dimensions and offsets. Returns a boolean by default which indicates whether or not the two elements overlap. Optionally one can set the third argument *returnData* to true and make the function return the intersection's dimensions and offsets.

**Syntax**

`mezr.intersection( a, b [, returnData ] )`

**Parameters**

* **a** &nbsp;&mdash;&nbsp; *array / element / object*
  * Element: Calculates the element's dimensions and offsets with scrollbar, padding and border included.
  * Array: Calculates the element's dimensions and offsets using the [`.width()`](#width), [`.height()`](#height) and [`.offset()`](#offset) methods. The array's values are used as the arguments for the dimensions methods and the offset is calculated automatically based on the provided argument values.
  * Object: must have width, height, left and top properties with numeric values (e.g. `{width: 10, height: 20, left: 15, top: -10}`).
* **b** &nbsp;&mdash;&nbsp; *array / element / object*
  * Same specs as for a.
* **returnData** &nbsp;&mdash;&nbsp; *boolean*
  * Default: `false`
  * Make the function return explicit intersection data instead of boolean.

**Returns** &nbsp;&mdash;&nbsp; *boolean / null / object*

If *returnData* argument is set to `false` a boolean is returned which indicates whether or not the two elements have an intersection. If *returnData* argument is set to `true` and the two elements do not intersect `null` is returned. However, if they do intersect an object with the following intersection data is returned:

* **obj.width** &nbsp;&mdash;&nbsp; *number*
  * The width of the intersection area in pixels (fractional).
* **obj.height** &nbsp;&mdash;&nbsp; *number*
  * The height of the intersection area in pixels (fractional).
* **obj.left** &nbsp;&mdash;&nbsp; *number*
  * The intersection area's left offset (from document's northwest corner).
* **obj.top** &nbsp;&mdash;&nbsp; *number*
  * The intersection area's top offset (from document's northwest corner).

**Examples**

```javascript
var rectA = {width: 10, height: 10, left: 10, top: 10};
var rectB = {width: 10, height: 10, left: 19, top: 19};

// Check if two rectangles have an intersection.
var overlap = mezr.intersection(rectA, rectB); // true

// Calculate the intersection area's dimensions and offsets.
var overlapData = mezr.intersection(rectA, rectB, true);
// {width: 1, height: 1, left: 19: top: 19}
```

&nbsp;

### .place()

Calculate an element's position (left/top CSS properties) when positioned relative to another element, window or the document.

**Syntax**

`mezr.place( el [, options ] )`

**Parameters**

* **el** &nbsp;&mdash;&nbsp; *element / window / document / array*
  * The element which is to be positioned (target).
  * Element: calculates the element's dimensions with scrollbar, paddings and borders.
  * Array: calculates the element's dimensions using the [`.width()`](#width) and [`.height()`](#height) methods. The array's values are used as the arguments for the method calls.
* **options** &nbsp;&mdash;&nbsp; *object*
  * A set of options that defines how the target element is positioned against the relative element.
* **options.my** &nbsp;&mdash;&nbsp; *string*
  * Default: `"left top"`
  * The position of the target element that will be aligned against the relative element's position.
  * The syntax is "horizontal vertical" .
    * Describe horizontal position with `"left"`, `"center"` and `"right"`.
    * Describe vertical position with `"top"`, `"center"` and `"bottom"`.
* **options.at** &nbsp;&mdash;&nbsp; *string*
  * Default: `"left top"`
  * The position of the relative element that will be aligned against the target element's position.
  * The syntax is "horizontal vertical" .
    * Describe horizontal position with `"left"`, `"center"` and `"right"`.
    * Describe vertical position with `"top"`, `"center"` and `"bottom"`.
* **options.of** &nbsp;&mdash;&nbsp; *element / window / document / array / object*
  * Default: `window`
  * Defines which element the target element is positioned against (anchor).
  * Element: Calculates the element's dimensions and offsets with scrollbar, padding and border included.
  * Array: calculates the element's dimensions using the [`.width()`](#width) and [`.height()`](#height) methods. The array's values are used as the arguments for the method calls.
  * Object: must have width, height, left and top properties with numeric values (e.g. `{width: 10, height: 20, left: 15, top: -10}`).
* **options.within** &nbsp;&mdash;&nbsp; *element / window / document / array / object*
  * Default: `null`
  * Defines an optional element/area that is used for collision detection (container). Basically this element/area defines the boundaries for the positioning while the `options.collision` defines what to do if the target element is about to be positioned over the boundaries.
  * Element: Calculates the element's dimensions and offsets with scrollbar, padding and border included.
  * Array: calculates the element's dimensions using the [`.width()`](#width) and [`.height()`](#height) methods. The array's values are used as the arguments for the method calls.
  * Object: must have width, height, left and top properties with numeric values (e.g. `{width: 10, height: 20, left: 15, top: -10}`).
* **options.offsetX** &nbsp;&mdash;&nbsp; *number*
  * Default: `0`
  * An optional horizontal offset in pixels.
* **options.offsetY** &nbsp;&mdash;&nbsp; *number*
  * Default: `0`
  * An optional vertical offset in pixels.
* **options.collision** &nbsp;&mdash;&nbsp; *object / null*
  * Default: `{left: 'push', right: 'push', top: 'push', bottom: 'push'}`
  * Defines how the collisions are handled per each side when a container element/area (`options.within`) is defined. The option expects an object that has left, right, top and bottom properties set, representing the sides of the target element.
  * Acceptable values for each side are `"none"`, `"push"` and `"forcePush"`.
    * `"none"` will ignore containment for the specific side.
    * `"push"` tries to keep the targeted side of the target element within the container element's boundaries.
    * If the container element is smaller than the target element and you want to make sure that a specific side will always be pushed fully inside the container element's area you can use `"forcePush"`.

**Returns** &nbsp;&mdash;&nbsp; *object*

* **obj.left** &nbsp;&mdash;&nbsp; *number*
  * The positioned element's left (CSS) property value (fractional).
* **obj.top** &nbsp;&mdash;&nbsp; *number*
  * The positioned element's top (CSS) property value (fractional).

&nbsp;

## License

Copyright &copy; 2015 Niklas Rämö. Licensed under **[the MIT license](LICENSE.md)**.
