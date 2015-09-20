# Mezr

Mezr is a lightweight JavaScript utility library for measuring and comparing the dimensions and positions of HTML DOM elements in modern browsers (IE9+). Intended for developers who want to keep their sanity when doing DOM algebra =)

**Features**

* No dependencies.
* Cross-browser (IE9+).
* Fast (does not touch DOM, ever).
* Advanced element positioning.
* Collision detection.

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

`mezr.width( el [, edgeLayer ] )`

**Parameters**

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **edgeLayer** &nbsp;&mdash;&nbsp; *number / string*
  * Default: `"border"`
  * Defines which layer (core, padding, scroll, border, margin) of the element is considered as the outer edge of the element.
  * The edge can be described with a number or a string, here are the possible values:
    * `"core"` or `0`: Inner width.
    * `"padding"` or `1`: "core" + left/right paddings.
    * `"scroll"` or `2`: "padding" + vertical scrollbar's width (if it exists).
    * `"border"` or `3`: "scroll" + left/right borders.
    * `"margin"` or `4`: "border" + left/right margins (only positive margins).
  * For `window` and `document` objects this argument behaves a bit differently since they cannot have any paddings, borders or margins.
    * Only `"core"` (without vertical scrollbar's width) and `"scroll"` (with vertical scrollbar's width) are effective values.
    * `"padding"` is normalized to `"core"`.
    * `"border"` and `"margin"` are normalized to `"scroll"`.

**Returns** &nbsp;&mdash;&nbsp; *number*

The return value may be fractional when calculating the width of an element. For `window` and `document` objects the value is always an integer though.

**Examples**

Document width with viewport scrollbar.

```javascript
// No jQuery alternative.
var docWidth = mezr.width(document);
// or
var docWidth = mezr.width(document. "scroll");
```

Document width without viewport scrollbar.

```javascript
// jQuery -> $(document).width()
var docWidth = mezr.width(document, "core");
```

Window width with viewport scrollbar (handy for working with media queries).

```javascript
// No jQuery alternative.
var winWidth = mezr.width(window);
var winWidth = mezr.width(window, 'scroll');
```

Window width without viewport scrollbar.

```javascript
// jQuery -> $(window).width()
var winWidth = mezr.width(window, "core");
```

Element's inner width. Note that Mezr's implementation differs slightly from jQuery's `.width()` and should not be used as a drop in replacement. If the element has vertical scrollbar Mezr never includes it in the result unlike jQuery. In other words jQuery version returns the element's *potential* inner width whereas Mezr version returns the element's *true* inner width.

```javascript
// Partial jQuery alternative -> $('body').width()
var coreWidth = mezr.width(document.body, "core");
```

Element's width with paddings, but without vertical scollbar's width (if it exists). The same stuff applies to this example as the one above. jQuery's `.innerWidth()` method returns identical values as Mezr's "padding" width as long as the element does not have a vertical scrollbar.

```javascript
// Partial jQuery alternative -> $('body').innerWidth()
var paddingWidth = mezr.width(document.body, "padding");
```

Element's width with paddings and vertical scollbar's width (if it exists).

```javascript
// jQuery -> $('body').innerWidth()
var scrollWidth = mezr.width(document.body, "scroll");
```

Element's width with paddings, borders and vertical scollbar's width (if it exists).

```javascript
// jQuery -> $('body').outerWidth()
var borderWidth = mezr.width(document.body, "border");
// or
var borderWidth = mezr.width(document.body);
```

Element's width with paddings, borders margins and vertical scollbar's width (if it exists). Note that Mezr ignores negative margins completely so they do not affect the result in any way.

```javascript
// jQuery -> $('body').outerWidth(true)
var marginWidth = mezr.width(document.body, "margin");
```

&nbsp;

### .height()

Returns the height of an element in pixels. Accepts also the window object (for getting the viewport height) and the document object (for getting the height of the whole document).

**Syntax**

`mezr.height( el [, edgeLayer ] )`

**Parameters**

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **edgeLayer** &nbsp;&mdash;&nbsp; *number / string*
  * Default: `"border"`
  * Defines which layer (core, padding, scroll, border, margin) of the element is considered as the outer edge of the element.
  * The edge can be described with a number or a string, here are the possible values:
    * `"core"` or `0`: Inner height.
    * `"padding"` or `1`: "core" + top/bottom paddings.
    * `"scroll"` or `2`: "padding" + horizontal scrollbar's height (if it exists).
    * `"border"` or `3`: "scroll" + top/bottom borders.
    * `"margin"` or `4`: "border" + top/bottom margins (only positive margins).
  * For `window` and `document` objects this argument behaves a bit differently since they cannot have any paddings, borders or margins.
    * Only `"core"` (without horizontal scrollbar's height) and `"scroll"` (with horizontal scrollbar's height) are effective values.
    * `"padding"` is normalized to `"core"`.
    * `"border"` and `"margin"` are normalized to `"scroll"`.

**Returns** &nbsp;&mdash;&nbsp; *number*

The return value may be fractional when calculating the height of an element. For `window` and `document` objects the value is always an integer though.

**Examples**

Check the examples for [.width()](#width), same stuff applies to [.height()](#height).

&nbsp;

### .offset()

Returns the element's "offsets", which in practice means the vertical and horizontal distance between the element's northwest corner and the document's northwest corner. The edgeLayer argument controls which layer (core, padding, scroll, border, margin) of the element is considered as the edge of the element for the calculations. For example, if the edgeLayer was set to 1 or "padding" the element's margins and borders would be added to the offsets.

**Syntax**

`mezr.offset( el [, edgeLayer ] )`

**Parameters**

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **edgeLayer** &nbsp;&mdash;&nbsp; *boolean*
  * Default: `"border"`
  * Defines which layer (core, padding, scroll, border, margin) of the element is considered as the outer edge of the element.
  * This argument has no effect for `window` and `document`.
  * The edge can be described with a number or a string, here are the possible values:
    * `"core"` or `0`: Inner height.
    * `"padding"` or `1`: "core" + top/bottom paddings.
    * `"scroll"` or `2`: "padding" + horizontal scrollbar's height (if it exists).
    * `"border"` or `3`: "scroll" + top/bottom borders.
    * `"margin"` or `4`: "border" + top/bottom margins (only positive margins).
  * Note that `"padding"` and `"scroll"` values produce identical results. The `"scroll"` value is only allowed here in order to make this method work in sync with [`.width()`](#width) and [`.height()`](#height) methods.

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
  * Element: the element's edge layer is considered to be "border".
  * Array: allows one to control which layer (core, padding, scroll, border, margin) is considered as the element's edge layer, e.g. `[someElem, 'core']`.
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
  * Element: the element's edge layer is considered to be "border".
  * Array: allows one to control which layer (core, padding, scroll, border, margin) is considered as the element's edge layer, e.g. `[someElem, 'core']`.
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
  * Element: the element's edge layer is considered to be "border".
  * Array: allows one to control which layer (core, padding, scroll, border, margin) is considered as the element's edge layer, e.g. `[someElem, 'core']`.
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
  * Element: the element's edge layer is considered to be "border".
  * Array: allows one to control which layer (core, padding, scroll, border, margin) is considered as the element's edge layer, e.g. `[someElem, 'core']`.
  * Object: must have width, height, left and top properties with numeric values (e.g. `{width: 10, height: 20, left: 15, top: -10}`).
* **options.within** &nbsp;&mdash;&nbsp; *element / window / document / array / object*
  * Default: `null`
  * Defines an optional element/area that is used for collision detection (container). Basically this element/area defines the boundaries for the positioning while the `options.collision` defines what to do if the target element is about to be positioned over the boundaries.
  * Element: the element's edge layer is considered to be "border".
  * Array: allows one to control which layer (core, padding, scroll, border, margin) is considered as the element's edge layer, e.g. `[someElem, 'core']`.
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
