# Mezr

Mezr is a lightweight JavaScript utility library for measuring and comparing the dimensions and positions of HTML DOM elements in modern browsers (IE9+).

**Features**

* Calculate any element's dimensions and offsets consistently.
* Get element's [containing block](https://www.w3.org/TR/CSS2/visuren.html#containing-block).
* Position elements relative to other elements (similar to jQuery UI's [position](https://jqueryui.com/position/) method).
* Calculate the intersection area between multiple elements.
* Calculate distance between two elements.
* Calculate how much an element overflows another element per each side.

## Getting started

1. Include [mezr.js](mezr.js) within the **body** element on your site. Mezr needs to access the body element, because it does some browser behaviour checking on initialization and will throw an error if `document.body` is not available.

  ```html
  <html>
    <body>
      <script src="mezr.js"></script>
    </body>
  </html>
  ```

2. Then just start measuring the DOM. Here are some simple examples to get you started.

  ```javascript
  // Get element's content dimensions.
  mezr.width(elem, 'content');
  mezr.height(elem, 'content');

  // Get element's content + padding dimensions.
  mezr.width(elem, 'padding');
  mezr.height(elem, 'padding');

  // Get element's content + padding + scrollbar dimensions.
  mezr.width(elem, 'scroll');
  mezr.height(elem, 'scroll');

  // Get element's content + padding + scrollbar + border dimensions (default).
  mezr.width(elem, 'border');
  mezr.height(elem, 'border');

  // Get element's content + padding + scrollbar + border + margin dimensions.
  mezr.width(elem, 'margin');
  mezr.height(elem, 'margin');

  // Calculate element's offsets from the document.
  // The second argument defines the element's edge for the calculations.
  mezr.offset(elem); // {left: ..., top: ...}
  mezr.offset(elem, 'content');
  mezr.offset(elem, 'padding');
  mezr.offset(elem, 'scroll');
  mezr.offset(elem, 'border');
  mezr.offset(elem, 'margin');

  // Calculate element's offsets from another element or the window.
  mezr.offset([elemTo, 'content'], [elemFrom, 'padding']);
  mezr.offset([elemTo, 'content'], window);

  // Calculate direct distance between two elements.
  mezr.distance(elemA, elemB);
  mezr.distance([elemA, 'content'], [elemB, 'margin']);

  // Calculate the intersection area between two or more elements.
  mezr.intersection(elemA, elemB, elemC);
  mezr.intersection([elemA, 'content'], [elemB, 'margin']);

  // Calculate how much elemB overflows elemA.
  mezr.overflow(elemA, elemB);

  // Calculate what elemA's position (left and top CSS properties) should
  // be when it's left-top (northwest) corner is placed in the center of
  // elemB. Works only for for positioned elements (CSS position attribute
  // must be something else than static).
  mezr.place({
    element: elemA,
    target: elemB,
    position: 'left top center center'
  });
  ```

## API v0.6.2

* [.width()](#width)
* [.height()](#height)
* [.offset()](#offset)
* [.rect()](#rect)
* [.containingBlock()](#containingblock)
* [.distance()](#distance)
* [.intersection()](#intersection)
* [.overflow()](#overflow)
* [.place()](#place)

&nbsp;

### .width()

Returns the width of an element in pixels. Accepts also the window object (for getting the viewport width) and the document object (for getting the width of the whole document).

**`.width( el, [ edge ] )`**

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **edge** &nbsp;&mdash;&nbsp; *string*
  * Defines which edge (content, padding, scroll, border, margin) of the element is considered as it's outer edge. Optional.
  * Default: `'border'`
  * Allowed values: `'content'`, `'padding'`, `'scroll'`, `'border'`, `'margin'`.
  * For `window` and `document` objects this argument behaves a bit differently since they cannot have any paddings, borders or margins. Only 'content' (without vertical scrollbar's width) and 'scroll' (with vertical scrollbar's width) are effective values. 'padding' is normalized to 'content' while 'border' and 'margin' are normalized to 'scroll'.

**Returns** &nbsp;&mdash;>&nbsp; *number*

The return value may be fractional when calculating the width of an element. For `window` and `document` objects the value is always an integer though.

**Examples**

```javascript
// Document width (with viewport scrollbar).
mezr.width(document, 'scroll'); // or just -> mezr.width(document);

// Document width (without viewport scrollbar).
mezr.width(document, 'content');

// Window width (with scrollbar).
mezr.width(window, 'scroll'); // or just -> mezr.width(window);

// Window width (without scrollbar).
mezr.width(window, 'content');

// Element content width.
mezr.width(elem, 'content');

// Element content width + left/right padding.
mezr.width(elem, 'padding');

// Element content width + left/right padding + vertical scrollbar width.
mezr.width(elem, 'scroll');

// Element content width + left/right padding + vertical scrollbar width +
// left/right border.
mezr.width(elem, 'border'); // or just -> mezr.width(elem);

// Element content width + left/right padding + vertical scrollbar width +
// left/right border + left/right (positive) margin.
mezr.width(elem, 'margin');
```

&nbsp;

### .height()

Returns the height of an element in pixels. Accepts also the window object (for getting the viewport height) and the document object (for getting the height of the whole document).

**`.height( el, [ edge ] )`**

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **edge** &nbsp;&mdash;&nbsp; *string*
  * Defines which edge (content, padding, scroll, border, margin) of the element is considered as it's outer edge. Optional.
  * Default: `'border'`
  * Allowed values: `'content'`, `'padding'`, `'scroll'`, `'border'`, `'margin'`.
  * For `window` and `document` objects this argument behaves a bit differently since they cannot have any paddings, borders or margins. Only 'content' (without vertical scrollbar's width) and 'scroll' (with vertical scrollbar's width) are effective values. 'padding' is normalized to 'content' while 'border' and 'margin' are normalized to 'scroll'.

**Returns** &nbsp;&mdash;>&nbsp; *number*

The return value may be fractional when calculating the height of an element. For `window` and `document` objects the value is always an integer though.

**Examples**

```javascript
// Document height (with viewport scrollbar).
mezr.height(document, 'scroll'); // or just -> mezr.height(document);

// Document height (without viewport scrollbar).
mezr.height(document, 'content');

// Window height (with scrollbar).
mezr.height(window, 'scroll'); // or just -> mezr.height(window);

// Window height (without scrollbar).
mezr.height(window, 'content');

// Element content height.
mezr.height(elem, 'content');

// Element content height + top/bottom padding.
mezr.height(elem, 'padding');

// Element content height + top/bottom padding + horizontal scrollbar height.
mezr.height(elem, 'scroll');

// Element content height + top/bottom padding + horizontal scrollbar height +
// top/bottom border.
mezr.height(elem, 'border'); // or just -> mezr.height(elem);

// Element content height + top/bottom padding + horizontal scrollbar height +
// top/bottom border + top/bottom (positive) margin.
mezr.height(elem, 'margin');
```

&nbsp;

### .offset()

Returns the element's offset from another element, window or document.

**`.offset( el, [ edge ] )`**

Returns the element's offset from the document. The second argument defines which edge layer of the element should be used for the calculations.

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **edge** &nbsp;&mdash;&nbsp; *string*
  * Defines which edge (content, padding, scroll, border, margin) of the element is considered as its outer edge. Optional.
  * Default: `'border'`
  * Allowed values: `'content'`, `'padding'`, `'scroll'`, `'border'`, `'margin'`.
  * This argument has no effect for `window` or `document`.
  * Note that 'padding' and 'scroll' values produce identical results. The 'scroll' value is only allowed here in order to make this method work in sync with [`.width()`](#width) and [`.height()`](#height) methods.

**`.offset( el, [ from ] )`**

Returns the element's offset from another element, window or document. The second (optional) argument defines from which element the offset is calculated.

* **el** &nbsp;&mdash;&nbsp; *element / window / document / object / array*
  * Document/Element/Window: the edge is considered to be 'border'.
  * Array: allows one to control which layer (content, padding, scroll, border, margin) is considered as the element's edge, e.g. `[someElem, 'content']`.
  * Object: must have left and top properties with numeric values (e.g. `{left: 10, top: -10}`).
* **from** &nbsp;&mdash;&nbsp; *element / window / document / object / array*
  * Defines the element from which the offset is calculated. Optional.
  * Default: `document`
  * Document/Element/Window: the edge is considered to be 'border'.
  * Array: allows one to control which layer (content, padding, scroll, border, margin) is considered as the element's edge, e.g. `[someElem, 'content']`.
  * Object: must have left and top properties with numeric values (e.g. `{left: 10, top: -10}`).

**Returns** &nbsp;&mdash;>&nbsp; *object*

* **obj.left** &nbsp;&mdash;&nbsp; *number*
  * The element's left offset in pixels (fractional).
* **obj.top** &nbsp;&mdash;&nbsp; *number*
  * The element's top offset in pixels (fractional).

**Examples**

```javascript
// Document's offset.
mezr.offset(document);
// Returns always {left: 0, top: 0}

// Window's offset from document.
mezr.offset(window);

// Element's offset from document.
mezr.offset(elem, 'content');
mezr.offset(elem, 'padding');
mezr.offset(elem, 'scroll');
mezr.offset(elem, 'border'); // or just -> mezr.offset(elem);
mezr.offset(elem, 'margin');

// Element's offset from window.
mezr.offset(elem, window);

// Element's offset from another element.
mezr.offset(elem, otherElem);
mezr.offset([elem, 'content'], [otherElem, 'margin']);

// Mimic jQuery's .position() method. Do note that this is not
// a drop in replacement for jQuery's .position() method, but
// works in a similar fashion.
mezr.offset(elem, mezr.containingBlock(elem));
```

&nbsp;

### .rect()

Returns an object containing the provided element's dimensions and offsets. This is basically a helper method for calculating an element's dimensions and offsets simultaneously. Mimics the native [getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) method with the added bonus of allowing to define the *edge layer* of the element, and also the element from which the offset is calculated.

**`.rect( el, [ edge ] )`**

Get rect data of the element with the offset calculated relative to the document.

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **edge** &nbsp;&mdash;&nbsp; *boolean*
  * Defines which edge (content, padding, scroll, border, margin) of the element is considered as its outer edge.
  * Default: `'border'`
  * Allowed values: `'content'`, `'padding'`, `'scroll'`, `'border'`, `'margin'`.

**`.rect( el, [ from ] )`**

Get rect data of the element with the offset calculated relative to another element, window or document.

* **el** &nbsp;&mdash;&nbsp; *element / window / document / object / array*
  * Document/Element/Window: the edge is considered to be 'border'.
  * Array: allows one to control which layer (content, padding, scroll, border, margin) is considered as the element's edge, e.g. `[someElem, 'content']`.
  * Object: must have left and top properties with numeric values (e.g. `{left: 10, top: -10}`).
* **from** &nbsp;&mdash;&nbsp; *element / window / document / object / array*
  * Defines the element from which the offset is calculated. Optional.
  * Default: `document`
  * Document/Element/Window: the edge is considered to be 'border'.
  * Array: allows one to control which layer (content, padding, scroll, border, margin) is considered as the element's edge, e.g. `[someElem, 'content']`.
  * Object: must have left and top properties with numeric values (e.g. `{left: 10, top: -10}`).

**Returns** &nbsp;&mdash;>&nbsp; *object*

* **obj.width** &nbsp;&mdash;&nbsp; *number*
  * The width of the element in pixels (fractional).
* **obj.height** &nbsp;&mdash;&nbsp; *number*
  * The height of the element in pixels (fractional).
* **obj.left** &nbsp;&mdash;&nbsp; *number*
  * The element's left offset (from document's northwest corner).
* **obj.right** &nbsp;&mdash;&nbsp; *number*
  * The element's left offset + width.
* **obj.top** &nbsp;&mdash;&nbsp; *number*
  * The element's top offset (from document's northwest corner).
* **obj.bottom** &nbsp;&mdash;&nbsp; *number*
  * The element's top offset + height.

**Examples**

```javascript
// Element's rect data with offset relative to the document.
mezr.rect(elem, 'content');
mezr.rect(elem, 'padding');
mezr.rect(elem, 'scroll');
mezr.rect(elem, 'border'); // or just -> mezr.rect(elem);
mezr.rect(elem, 'margin');

// Element rect data with offset relative to the window.
mezr.rect(elem, window);

// Element rect data with offset relative to another element.
mezr.rect(elem, anotherElem);
mezr.rect([elem, 'padding'], [anotherElem, 'margin']);
```

&nbsp;

### .containingBlock()

Returns the element's [containing block](https://www.w3.org/TR/CSS2/visuren.html#containing-block), which is considered to be the closest ancestor element (or window, or document, or the target element itself) that the target element's positioning is relative to. In other words, containing block is the element that the target element's CSS properties *left*, *right*, *top* and *bottom* are relative to. You should not confuse this with the native [elem.offsetParent](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent) read-only property, which works in a similar fashion (and even identically in certain situations), but is really not the same thing (although the name might imply it).

**The logic**

* Document is considered to be the root containing block of all elements and the window.
* Getting the document's containing block will return `null`.
* Static element does not have a containing block since setting values to the *left*, *right*, *top* and *bottom* CSS properties does not have any effect on the element's position. Thus, getting the containing block of a static element will return `null`.
* Relative element's containing block is always the element itself.
* Fixed element's containing block is always the closest transformed ancestor or `window` if the element does not have any transformed ancestors. An exception is made for browsers which allow fixed elements to bypass the W3C specification of transform rendering. In those browsers fixed element's containing block is always the `window`.
* Absolute element's containing block is the closest ancestor element that is transformed or positioned (any element which is not static). If no positioned or transformed ancestor is not found the containing block is the `document`.
* Sticky element is a special case since "left", "right", "top" and "bottom" CSS properties do not always affect the element's position. However, for consistency, the closest scrolling ancestor element is always considered as sticky element's containing block, and if no scrolling ancestor is found window is returned.
* Root element and body element are treated equally with all other elements.

**`.containingBlock( el, [ fakePosition ] )`**

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **fakePosition** &nbsp;&mdash;&nbsp; *element / window / document*
  * An optional argument which allows you to get the element's containing block as if the element had this CSS position value applied. Using this argument does not modify the element's true CSS position in any way, it's only used for the calculations.
  * Default: the element's current CSS position.
  * Allowed values: `"static"`, `"relative"`, `"absolute"`, `"fixed"` and `"sticky"`.

**Returns** &nbsp;&mdash;>&nbsp; *element / window / document / null*

**Examples**

```javascript
// Get element's containing block.
mezr.containingBlock(elem);

// Get element's containing block with faked position value.
mezr.containingBlock(elem, 'fixed');

// Static behaviour.
mezr.containingBlock(document); // always null
mezr.containingBlock(window); // always document
mezr.containingBlock(elem, 'static'); // always null
mezr.containingBlock(elem, 'relative'); // always elem
```

&nbsp;

### .distance()

Returns the distance between two elements (in pixels) or `-1` if the elements overlap.

**`.distance( from, to )`**

* **from** &nbsp;&mdash;&nbsp; *element / array / object*
  * Element: the element's edge is considered to be 'border'.
  * Array: allows one to control which layer (content, padding, scroll, border, margin) is considered as the element's edge, e.g. `[someElem, 'content']`.
  * Object: must have width, height, left and top properties with numeric values (e.g. `{width: 10, height: 10, left: 10, top: -10}`).
* **to** &nbsp;&mdash;&nbsp; *element / array / object*
  * Element: the element's edge is considered to be 'border'.
  * Array: allows one to control which layer (content, padding, scroll, border, margin) is considered as the element's edge, e.g. `[someElem, 'content']`.
  * Object: must have width, height, left and top properties with numeric values (e.g. `{width: 10, height: 10, left: 10, top: -10}`).

**Returns** &nbsp;&mdash;>&nbsp; *number*

If elements/objects overlap the method returns `-1`. Otherwise the method returns the distance between the elements/objects.

**Examples**

```javascript
var elemA = document.getElementById('a');
var elemB = document.getElementById('b');
var rectA = {left: 0, top: 0, width: 5, height: 5};
var rectB = {left: 20, top: 20, width: 5, height: 5};

// Calculate the distance between two elements.
mezr.distance(elemA, elemB);

// Calculate the distance between two objects.
mezr.distance(rectA, rectB);

// Calculate the distance between an object and element.
mezr.distance(elemA, rectB);

// Define which edge to use for element calculations.
mezr.distance([elemA, 'content'], [elemB, 'scroll']);
```

&nbsp;

### .intersection()

Detect if two or more elements overlap and calculate their possible intersection area (dimensions and offsets). If the intersection area exists the function returns an object containing the intersection area's dimensions and offsets. Otherwise `null` is returned.

**`.intersection( ...el )`**

* **el** &nbsp;&mdash;&nbsp; *array / element / object*
  * Element: the element's edge is considered to be 'border'.
  * Array: allows one to control which layer (content, padding, scroll, border, margin) is considered as the element's edge, e.g. `[someElem, 'content']`.
  * Object: must have width, height, left and top properties with numeric values (e.g. `{width: 10, height: 20, left: 15, top: -10}`).

**Returns** &nbsp;&mdash;>&nbsp; *null / object*

In case the provided elements/objects do not overlap the method returns `null`. Otherwise the intersection area's data (object) is returned with the following properties:

* **obj.width** &nbsp;&mdash;&nbsp; *number*
  * The width of the intersection area in pixels (fractional).
* **obj.height** &nbsp;&mdash;&nbsp; *number*
  * The height of the intersection area in pixels (fractional).
* **obj.left** &nbsp;&mdash;&nbsp; *number*
  * The intersection area's left offset (from document's northwest corner).
* **obj.right** &nbsp;&mdash;&nbsp; *number*
  * The intersection area's left offset + width.
* **obj.top** &nbsp;&mdash;&nbsp; *number*
  * The intersection area's top offset (from document's northwest corner).
* **obj.bottom** &nbsp;&mdash;&nbsp; *number*
  * The intersection area's top offset + height.

**Examples**

```javascript
var elemA = document.getElementById('a');
var elemB = document.getElementById('b');
var rectA = {left: 0, top: 0, width: 5, height: 5};
var rectB = {left: 20, top: 20, width: 5, height: 5};

// Calculate the intersection area between two elements.
mezr.intersection(elemA, elemB);

// Calculate the intersection area between two objects.
mezr.intersection(rectA, rectB);

// Calculate the intersection area between an object and an
// element.
mezr.intersection(elemA, rectB);

// Define which edge to use for element calculations.
mezr.intersection([elemA, 'content'], [elemB, 'scroll']);

// Calculate the intersection area between two elements and
// two objects.
mezr.intersection(elemA, [elemB, 'margin'], rectA, rectB);
```

&nbsp;

### .overflow()

Calculate how much an element overflows another element per each side.

**`.overflow( container, el )`**

* **container** &nbsp;&mdash;&nbsp; *array / element / object*
  * Element: the container's edge is considered to be 'border'.
  * Array: allows one to control which layer (content, padding, scroll, border, margin) is considered as the container's edge, e.g. `[someElem, 'content']`.
  * Object: must have width, height, left and top properties with numeric values (e.g. `{width: 10, height: 20, left: 15, top: -10}`).
* **el** &nbsp;&mdash;&nbsp; *array / element / object*
  * Element: the element's edge is considered to be 'border'.
  * Array: allows one to control which layer (content, padding, scroll, border, margin) is considered as the element's edge, e.g. `[someElem, 'content']`.
  * Object: must have width, height, left and top properties with numeric values (e.g. `{width: 10, height: 20, left: 15, top: -10}`).

**Returns** &nbsp;&mdash;>&nbsp; *object*

* **obj.left** &nbsp;&mdash;&nbsp; *number*
  * How much element's left edge overflows the container's left edge.
* **obj.right** &nbsp;&mdash;&nbsp; *number*
  * How much element's right edge overflows the container's right edge.
* **obj.top** &nbsp;&mdash;&nbsp; *number*
  * How much element's top edge overflows the container's top edge.
* **obj.bottom** &nbsp;&mdash;&nbsp; *number*
  * How much element's bottom edge overflows the container's bottom edge.

Note: A positive value means that the element overflows the container.

**Examples**

```javascript
var container = document.getElementById('container');
var elem = document.getElementById('elem');

// Calculate the intersection area between two elements.
mezr.overflow(container, elem);

// Define which edge to use for element calculations.
mezr.overflow([container, 'content'], [elem, 'scroll']);
```

&nbsp;

### .place()

Calculate an element's position (left/top CSS properties) when positioned relative to another element, window or the document. Note that this method does not actually position the element, it just returns the new position which can be applied to the element if needed.

**`.place( options )`**

The *options* argument should be an object. You may configure it with the following properties.

* **element** &nbsp;&mdash;&nbsp; *element / window / document / array*
  * The element which is to be positioned. This element's position needs to be either "relative", "absolute" or "fixed" for the function to work correctly. Although "sticky" elements are considered to be positioned this method does not yet support calculating their placement correctly.
  * Default: `null`
  * Element: the element’s edge is considered to be “border”.
  * Array: allows one to control which layer (content, padding, scroll, border, margin) is considered as the element's edge, e.g. `[someElem, 'content']`.
* **target** &nbsp;&mdash;&nbsp; *element / window / document / array / object*
  * Defines which element the element is positioned relative to.
  * Default: `null`
  * Element: the element's edge is considered to be 'border'.
  * Array: allows one to control which layer (content, padding, scroll, border, margin) is considered as the element's edge, e.g. `[someElem, 'content']`.
  * Object: must have width, height, left and top properties with numeric values (e.g. `{width: 10, height: 20, left: 15, top: -10}`).
* **position** &nbsp;&mdash;&nbsp; *string*
  * Define the attachment joint.
  * Default: `'left top left top'`
  * The syntax is 'elementX elementY targetX targetY' .
    * Describe horizontal position with `'left'`, `'center'` and `'right'`.
    * Describe vertical position with `'top'`, `'center'` and `'bottom'`.
* **offsetX** &nbsp;&mdash;&nbsp; *number / string*
  * An optional horizontal offset in pixels or in percentages. A number is always considered as a pixel value. A string is considered as a percentage value when it contains '%', e.g. `'50%'`. The percentage values are relative to the target element's width. For example if the target element's width is 50 pixels a value of `'100%'` would push the element 50 pixels to the right.
  * Default: `0`
* **offsetY** &nbsp;&mdash;&nbsp; *number / string*
  * An optional vertical offset in pixels or in percentages. A number is always considered as a pixel value. A string is considered as a percentage value when it contains '%', e.g. `'50%'`. The percentage values are relative to the target element's height. For example if the target element's height is 50 pixels a value of `'100%'` would push down the element 50 pixels.
  * Default: `0`
* **contain** &nbsp;&mdash;&nbsp; *null / object*
  * Defines an optional container element/area that is used for restricting the element's positioning.
  * Default: `null`
* **contain.within** &nbsp;&mdash;&nbsp; *element / window / document / array / object*
  * The container element/area.
  * Default: `null`
  * Element: the element's edge is considered to be 'border'.
  * Array: allows one to control which layer (content, padding, scroll, border, margin) is considered as the element's edge, e.g. `[someElem, 'content']`.
  * Object: must have width, height, left and top properties with numeric values (e.g. `{width: 10, height: 20, left: 15, top: -10}`).
* **contain.onOverflow** &nbsp;&mdash;&nbsp; *string / object / null*
  * Defines what to do when the element overflows the container.
  * Default: `'none'`
  * For maximum control you can provide an object with four properties: 'left', 'right', 'top' and 'bottom'. Each property represents an edge of the container and each property's value should be one of the predefined actions (see below) which will be called when/if the element overflows the container. Here's an example: `{left: 'push', right: 'forcepush', top: 'none', bottom: 'push'}`.
  * Alternatively you can also just define collision actions per axis: `{x: 'push', y: 'none'}`.
  * Or you can mix and match edges and axis: `{x: 'push', top: 'none', bottom: 'push'}`.
  * For minimum configuration you can just provide a single value as a string, e.g. `'push'` which will be used for all edges.
  * Collision actions:
    * `'none'`: Ignore containment.
    * `'push'`: Push the element back within the container, so that it does not overlap the container. If the element is larger than the container and opposite edges both have 'push' action enabled, the element will be positioned so that it overlaps the container an equal amount from both edges.
    * `'forcepush'`: Identical to 'push', but with one exception: it makes sure that the element's edge is always pushed fully back within the container. This action is only useful when the opposite edge has 'push' action enabled.
* **adjust** &nbsp;&mdash;&nbsp; *function / null*
  * An optional callback function which is called just before returning the element's new calculated position. Can be used to adjust the return value just before returning it and accessing all the positioning data that was used to calculate the element's new position.
  * Default: `null`
  * This callback receives two arguments:
    * **position** &nbsp;&mdash;&nbsp; *object*
      * This object is the same object that the method will return, so modifying it's properties will affect the return value of the method.
      * **position.left** &nbsp;&mdash;&nbsp; *number*
        * The positioned element's left (CSS) property value (fractional).
      * **position.top** &nbsp;&mdash;&nbsp; *number*
        * The positioned element's top (CSS) property value (fractional).
    * **data** &nbsp;&mdash;&nbsp; *object*
      * This object contains all the positioning data.
      * **data.elementRect** &nbsp;&mdash;&nbsp; *object*
        * Element's *new* [rect](#rect) data where the element is assumed to be in the newly calculated position.
      * **data.targetRect** &nbsp;&mdash;&nbsp; *object*
        * Target's *current* [rect](#rect) data.
      * **data.containerRect** &nbsp;&mdash;&nbsp; *object / null*
        * Container's *current* [rect](#rect) data if `collision.within` is defined. Otherwise `null`.
      * **data.shift** &nbsp;&mdash;&nbsp; *object*
        * Horiozontal and vertical diff between the element's current and new offset. In other words, answers the question how much the element moved in the x-axis and y-axis and in which direction.
        * **data.shift.left** &nbsp;&mdash;&nbsp; *number*
        * **data.shift.top** &nbsp;&mdash;&nbsp; *number*
      * **data.overflow** &nbsp;&mdash;&nbsp; *object / null*
        * How much the element (in it's *new* position) [overflows](#overflow) the container per each side. Identical to `mezr.overflow(data.containerRect, data.elementRect)`. If `collision.within` is not defined this will be `null`.
        * **data.overflow.left** &nbsp;&mdash;&nbsp; *number*
        * **data.overflow.right** &nbsp;&mdash;&nbsp; *number*
        * **data.overflow.top** &nbsp;&mdash;&nbsp; *number*
        * **data.overflow.bottom** &nbsp;&mdash;&nbsp; *number*
      * **data.overflowCorrection** &nbsp;&mdash;&nbsp; *object*
        * This object contains data on how much the `contain.onOverflow` action moved the element in x-axis and y-axis, and in which direction. If no `contain.onOverflow` action was defined or the action had no effect on the element's position the values of the `left` and `top` attributes are `0`.
        * **data.overflowCorrection.left** &nbsp;&mdash;&nbsp; *number*
        * **data.overflowCorrection.top** &nbsp;&mdash;&nbsp; *number*

**Returns** &nbsp;&mdash;>&nbsp; *object*

* **obj.left** &nbsp;&mdash;&nbsp; *number*
  * The positioned element's left (CSS) property value (fractional).
* **obj.top** &nbsp;&mdash;&nbsp; *number*
  * The positioned element's top (CSS) property value (fractional).

**Examples**

```javascript
// Calculate elemA's new position (left and top CSS properties).
var newElementPosition = mezr.place({
  // Let's use elemA's content layer for calculations.
  element: [elemA, 'content'],
  // Let's use elemB's margin layer for calculations.
  target: [elemB, 'margin'],
  // Let's position elemA's "left top" corner to the center of elemB.
  position: 'left top center center',
  // Nudge elemA 5px to the left.
  offsetX: -5,
  // Nudge elemA 50% (relative to it's own current height) to the bottom.
  offsetY: '50%',
  // Define containment for elemA.
  contain: {
    // Contain elemA within elemC (padding layer).
    within: [elemC, 'padding'],
    // Define (for each side) what to do when/if elemA overflows elemC.
    onOverflow: {
      left: 'forcepush',
      right: 'push',
      top: 'none',
      bottom: 'push'
    }
  },
  adjust: function (position, data) {
    // Nudge the element's position 1px to the left and 1px to the bottom
    // after all positioning stuff above has happened.
    position.left -= 1;
    position.top += 1;
  }
});
```

&nbsp;

## License

Copyright &copy; 2015 Niklas Rämö. Licensed under **[the MIT license](LICENSE.md)**.
