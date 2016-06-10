# Mezr

Mezr is a lightweight JavaScript utility library for measuring and comparing the dimensions and positions of HTML DOM elements in modern browsers (IE9+). For starters Mezr provides a bit more extended variations of jQuery's popular [offset](http://api.jquery.com/category/offset/) and [dimension](http://api.jquery.com/category/dimension/) methods. Bonus features include collision detection and positioning elements relative to other elements in the style of jQuery UI's [position](https://jqueryui.com/position/) method.

**Features**

* No dependencies.
* Cross-browser (IE9+).
* Advanced element positioning.
* Collision detection.

**Getting started**

1. Include [mezr.js](https://raw.githubusercontent.com/niklasramo/mezr/0.4.0/mezr.js) somewhere on your site.

  ```html
  <html>
    <head>
      <!-- You can place the script in the head... -->
      <script src="mezr.js"></script>>
    </head>
    <body>
      <!-- ... or in the body, it's up to you -->
      <script src="mezr.js"></script>>
    </body>
  </html>
  ```

2. Make sure that document is ready.

  You need to make sure that you do not call Mezr's methods before the document is ready because Mezr needs to do some browser feature checking.

  ```javascript
  // Vanilla JavaScript
  document.addEventListener('DOMContentLoaded', function () {
    // Your code here...
    mezr.width(window);
  }, false);

  // jQuery
  $(function () {
    // Your code here...
    mezr.height(window);
  });
  ```

3. Then just start measuring the DOM. Here are some simple examples to get you started.

  ```javascript
  // Get element content width.
  mezr.width(elem, 'content');

  // Get element content + padding width.
  mezr.width(elem, 'padding');

  // Get element content + padding + scrollbar width.
  mezr.width(elem, 'scroll');

  // Get element content + padding + scrollbar + border width (default).
  mezr.width(elem, 'border') === mezr.width(elem);

  // Get element content + padding + scrollbar + border + margin width.
  mezr.width(elem, 'margin');

  // All the above stuff applies to mezr.height() also.
  mezr.height(elem);

  // Calculate element's offset (distance from document's northwest corner).
  // The second argument defines the element's edge for the calculations.
  mezr.offset(elem); // {left: ..., top: ...}
  mezr.offset(elem, 'content');
  mezr.offset(elem, 'padding');
  mezr.offset(elem, 'scroll');
  mezr.offset(elem, 'border');
  mezr.offset(elem, 'margin');

  // Calculate direct distance between two elements.
  mezr.distance(elemA, elemB);
  mezr.distance([elemA, 'content'], [elemB, 'margin']);

  // Check if two elements overlap.
  mezr.intersection(elemA, elemB);
  mezr.intersection([elemA, 'content'], [elemB, 'margin']);

  // Calculate what elemA's position (left and top CSS properties) should
  // be when it's left-top (northwest) corner is placed in the center of
  // elemB. Works only for for positioned elements (CSS position attribute
  // must be something else than static).
  mezr.place(elemA, {
    my: 'left top',
    at: 'center center',
    of: elemB
  });
  ```

## API v1.0.0-alpha

* [.width( el, [ edge ] )](#width-el--edge--)
* [.height( el, [ edge ] )](#height-el--edge--)
* [.offset( el, [ edge ] )](#offset-el--edge--)
* [.rect( el, [ edge ] )](#rect-el--edge--)
* [.offsetParent( el )](#offsetparent-el-)
* [.distance( elemA, elemB )](#distance-elema-elemb-)
* [.intersection( a, b)](#intersection-a-b-)
* [.place(el, [ options ] )](#place-el--options--)

&nbsp;

### `.width( el, [ edge ] )`

Returns the width of an element in pixels. Accepts also the window object (for getting the viewport width) and the document object (for getting the width of the whole document).

**Parameters**

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **edge** &nbsp;&mdash;&nbsp; *string*
  * Defines which edge (content, padding, scroll, border, margin) of the element is considered as its outer edge.
  * Default: `"border"`
  * Allowed values: `"content"`, `"padding"`, `"scroll"`, `"border"`, `"margin"`.
  * For `window` and `document` objects this argument behaves a bit differently since they cannot have any paddings, borders or margins. Only `"content"` (without vertical scrollbar's width) and `"scroll"` (with vertical scrollbar's width) are effective values. `"padding"` is normalized to `"content"` while `"border"` and `"margin"` are normalized to `"scroll"`.

**Returns** &nbsp;&mdash;&nbsp; *number*

The return value may be fractional when calculating the width of an element. For `window` and `document` objects the value is always an integer though.

**Examples**

Document width with viewport scrollbar.

```javascript
// No jQuery alternative.
mezr.width(document);
mezr.width(document. "scroll");
```

Document width without viewport scrollbar.

```javascript
// jQuery -> $(document).width()
mezr.width(document, "content");
```

Window width with viewport scrollbar (handy for working with media queries).

```javascript
// No jQuery alternative.
mezr.width(window);
mezr.width(window, 'scroll');
```

Window width without viewport scrollbar.

```javascript
// jQuery -> $(window).width()
mezr.width(window, "content");
```

Element's inner width. Note that Mezr's implementation differs slightly from jQuery's `.width()` and should not be used as a drop in replacement. If the element has vertical scrollbar Mezr never includes it in the result unlike jQuery. In other words jQuery version returns the element's *potential* inner width whereas Mezr version returns the element's *true* inner width.

```javascript
// No jQuery alternative
mezr.width(elem, "content");
```

Element's width with paddings, but without vertical scollbar's width (if it exists). The same stuff applies to this example as the one above. jQuery's `.innerWidth()` method returns identical values as Mezr's "padding" width as long as the element does not have a vertical scrollbar.

```javascript
// No jQuery alternative
mezr.width(elem, "padding");
```

Element's width with paddings and vertical scollbar's width (if it exists).

```javascript
// jQuery -> $(elem).innerWidth()
mezr.width(elem, "scroll");
```

Element's width with paddings, borders and vertical scollbar's width (if it exists).

```javascript
// jQuery -> $(elem).outerWidth()
mezr.width(elem, "border");
mezr.width(elem);
```

Element's width with paddings, borders margins and vertical scollbar's width (if it exists). Note that negative margins are not subtracted from the width, they are just ignored. This is by design. Visually, negative margins do not reduce the element's width so it makes sense to ignore them in this scenario. jQuery's `.outerWidth(true)` method returns exactly the same results as "margin" width with the exception that it does subtract negative margins from the width.

```javascript
// No jQuery alternative
mezr.width(elem, "margin");
```

&nbsp;

### `.height( el, [ edge ] )`

Returns the height of an element in pixels. Accepts also the window object (for getting the viewport height) and the document object (for getting the height of the whole document).

**Parameters**

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **edge** &nbsp;&mdash;&nbsp; *string*
  * Defines which edge (content, padding, scroll, border, margin) of the element is considered as its outer edge.
  * Default: `"border"`
  * Allowed values: `"content"`, `"padding"`, `"scroll"`, `"border"`, `"margin"`.
  * For `window` and `document` objects this argument behaves a bit differently since they cannot have any paddings, borders or margins. Only `"content"` (without vertical scrollbar's width) and `"scroll"` (with vertical scrollbar's width) are effective values. `"padding"` is normalized to `"content"` while `"border"` and `"margin"` are normalized to `"scroll"`.

**Returns** &nbsp;&mdash;&nbsp; *number*

The return value may be fractional when calculating the height of an element. For `window` and `document` objects the value is always an integer though.

**Examples**

Check the examples for [.width()](#width), same stuff applies to [.height()](#height).

&nbsp;

### `.offset( el, [ edge ] )`

Returns the element's "offsets", which in practice means the vertical and horizontal distance between the element's northwest corner and the document's northwest corner. The edge argument controls which layer (content, padding, scroll, border, margin) of the element is considered as the edge of the element for the calculations. For example, if the edge was set to 1 or "padding" the element's margins and borders would be added to the offsets.

**Parameters**

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **edge** &nbsp;&mdash;&nbsp; *boolean*
  * Defines which edge (content, padding, scroll, border, margin) of the element is considered as its outer edge.
  * Default: `"border"`
  * Allowed values: `"content"`, `"padding"`, `"scroll"`, `"border"`, `"margin"`.
  * This argument has no effect for `window` and `document`.
  * Note that `"padding"` and `"scroll"` values produce identical results. The `"scroll"` value is only allowed here in order to make this method work in sync with [`.width()`](#width) and [`.height()`](#height) methods.

**Returns** &nbsp;&mdash;&nbsp; *object*

* **obj.left** &nbsp;&mdash;&nbsp; *number*
  * The element's left offset in pixels (fractional).
* **obj.top** &nbsp;&mdash;&nbsp; *number*
  * The element's top offset in pixels (fractional).

**Examples**

```javascript
// Get element's offset.
mezr.offset(elem); // {left: ..., top: ...}
mezr.offset(elem, 'margin');
```

&nbsp;

### `.rect( el, [ edge ] )`

Returns an object containing the provided element's dimensions and offsets. This is basically a helper method for calculating an element's dimensions and offsets simultaneously. Mimics the native (getBoundingClientRect[https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect] method with the added bonus of allowing to provide the "edge" of the element.

**Parameters**

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.
* **edge** &nbsp;&mdash;&nbsp; *boolean*
  * Defines which edge (content, padding, scroll, border, margin) of the element is considered as its outer edge.
  * Default: `"border"`
  * Allowed values: `"content"`, `"padding"`, `"scroll"`, `"border"`, `"margin"`.
  * This argument has no effect for `window` and `document`.
  * Note that `"padding"` and `"scroll"` values produce identical results. The `"scroll"` value is only allowed here in order to make this method work in sync with [`.width()`](#width) and [`.height()`](#height) methods.

**Returns** &nbsp;&mdash;&nbsp; *object*

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
// Get element's rect.
mezr.rect(elem); // {left: ..., top: ...}
mezr.rect(elem, 'margin');
```

&nbsp;

### `.offsetParent( el )`

Returns the element's offset parent. This function works in the same manner as the native elem.offsetParent method with a few tweaks and logic changes. Additionally this function recognizes transformed elements and is aware of their local coordinate system. The function accepts the window object and the document object in addition to DOM elements. Document object is considered as the base offset point against which the element/window offsets are compared to. This in turn means that the document object does not have an offset parent and the the function returns null if document is provided as the argument. Document is also considered as the window's offset parent. Window is considered as the root offset parent of all fixed elements. Root and body elements are treated equally with all other DOM elements. For example body's offset parent is the root element if root element is positioned, but if the root element is static the body's offset parent is the document object.

**Parameters**

* **el** &nbsp;&mdash;&nbsp; *element / window / document*
  * Accepts any DOM element, the document object or the window object.

**Returns** &nbsp;&mdash;&nbsp; *element / null*

The return value is `null` if document object is provided as the element.

**Examples**

```javascript
// Get element's offset parent.
mezr.offsetParent(elem);
```

&nbsp;

### `.distance( elemA, elemB )`

Returns the distance between two elements (in pixels) or `-1` if the elements overlap.

**Parameters**

* **elemA** &nbsp;&mdash;&nbsp; *element / array / object*
  * Element: the element's edge is considered to be "border".
  * Array: allows one to control which layer (content, padding, scroll, border, margin) is considered as the element's edge, e.g. `[someElem, 'content']`.
  * Object: must have width, height, left and top properties with numeric values (e.g. `{width: 10, height: 10, left: 10, top: -10}`).
* **elemB** &nbsp;&mdash;&nbsp; *element / array / object*
  * Same specs as with elemA.

**Returns** &nbsp;&mdash;&nbsp; *number*

If elements overlap returns `-1`. Otherwise returns the distance between the elements.

**Examples**

```javascript
// Calculate the distance between two elements.
mezr.distance(elemA, elemB);
```

&nbsp;

### `.intersection( a, b )`

Detect if two elements overlap and calculate the possible intersection area's dimensions and offsets. If the intersection area exists the function returns an object containing the intersection area's dimensions and offsets. Otherwise `null` is returned.

**Parameters**

* **a** &nbsp;&mdash;&nbsp; *array / element / object*
  * Element: the element's edge is considered to be "border".
  * Array: allows one to control which layer (content, padding, scroll, border, margin) is considered as the element's edge, e.g. `[someElem, 'content']`.
  * Object: must have width, height, left and top properties with numeric values (e.g. `{width: 10, height: 20, left: 15, top: -10}`).
* **b** &nbsp;&mdash;&nbsp; *array / element / object*
  * Same specs as for a.

**Returns** &nbsp;&mdash;&nbsp; *null / object*

If the intersection area exists an object is returned with the following properties:

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
// Check if two elements have an intersection.
mezr.intersection(elemA, [elemB, 'content']);
```

&nbsp;

### `.place( el, [ options ] )`

Calculate an element's position (left/top CSS properties) when positioned relative to another element, window or the document.

**Parameters**

* **el** &nbsp;&mdash;&nbsp; *element / window / document / array*
  * The element which is to be positioned (target).
  * Element: the element's edge is considered to be "border".
  * Array: allows one to control which layer (content, padding, scroll, border, margin) is considered as the element's edge, e.g. `[someElem, 'content']`.
* **options** &nbsp;&mdash;&nbsp; *object*
  * A set of options that defines how the target element is positioned against the relative element.
* **options.my** &nbsp;&mdash;&nbsp; *string*
  * The position of the target element that will be aligned against the relative element's position.
  * Default: `"left top"`
  * The syntax is "horizontal vertical" .
    * Describe horizontal position with `"left"`, `"center"` and `"right"`.
    * Describe vertical position with `"top"`, `"center"` and `"bottom"`.
* **options.at** &nbsp;&mdash;&nbsp; *string*
  * The position of the relative element that will be aligned against the target element's position.
  * Default: `"left top"`
  * The syntax is "horizontal vertical" .
    * Describe horizontal position with `"left"`, `"center"` and `"right"`.
    * Describe vertical position with `"top"`, `"center"` and `"bottom"`.
* **options.of** &nbsp;&mdash;&nbsp; *element / window / document / array / object*
  * Defines which element the target element is positioned against (anchor).
  * Default: `window`
  * Element: the element's edge is considered to be "border".
  * Array: allows one to control which layer (content, padding, scroll, border, margin) is considered as the element's edge, e.g. `[someElem, 'content']`.
  * Object: must have width, height, left and top properties with numeric values (e.g. `{width: 10, height: 20, left: 15, top: -10}`).
* **options.within** &nbsp;&mdash;&nbsp; *element / window / document / array / object*
  * Defines an optional element/area that is used for collision detection (container). Basically this element/area defines the boundaries for the positioning while the `options.collision` defines what to do if the target element is about to be positioned over the boundaries.
  * Default: `null`
  * Element: the element's edge is considered to be "border".
  * Array: allows one to control which layer (content, padding, scroll, border, margin) is considered as the element's edge, e.g. `[someElem, 'content']`.
  * Object: must have width, height, left and top properties with numeric values (e.g. `{width: 10, height: 20, left: 15, top: -10}`).
* **options.offsetX** &nbsp;&mdash;&nbsp; *number*
  * An optional horizontal offset in pixels.
  * Default: `0`
* **options.offsetY** &nbsp;&mdash;&nbsp; *number*
  * An optional vertical offset in pixels.
  * Default: `0`
* **options.collision** &nbsp;&mdash;&nbsp; *string / object / null*
  * Defines how the collisions are handled per each side when a container element/area (`options.within`) is defined. The option expects an object that has left, right, top and bottom properties set, representing the sides of the target element. Alternatively you can provide a string value which will be normalized to an object automatically. For example, `"push"` will become `{left: 'push', right: 'push', top: 'push', bottom: 'push'}` and `"push none"` will become `{left: 'push', right: 'push', top: 'none', bottom: 'none'}`.
  * Default: `{left: 'push', right: 'push', top: 'push', bottom: 'push'}`
  * Acceptable values for each side are `"none"`, `"push"` and `"forcePush"`.
    * `"none"` will ignore containment for the specific side.
    * `"push"` tries to keep the targeted side of the target element within the container element's boundaries.
    * If the container element is smaller than the target element and you want to make sure that a specific side will always be pushed fully inside the container element's area you can use `"forcePush"`.

**Returns** &nbsp;&mdash;&nbsp; *object*

* **obj.left** &nbsp;&mdash;&nbsp; *number*
  * The positioned element's left (CSS) property value (fractional).
* **obj.top** &nbsp;&mdash;&nbsp; *number*
  * The positioned element's top (CSS) property value (fractional).

**Examples**

```javascript
// Calculate elemA's new position (left and top CSS properties)
// when it's northwest corner is positioned in the center of elemB.
// Also add some static offsets and make sure that elemA stays
// within the boundaries elemC. The collision option determines
// what to do when/if a specific edge of elemC is "breached" by
// elemA.
mezr.place([elemA, 'content'], {
  my: 'left top',
  at: 'center center',
  of: [elemB, 'margin'],
  offsetX: -5,
  offsetY: 10,
  within: [elemC, 'padding'],
  collision: {
    left: 'forcePush',
    right: 'push',
    top: 'none',
    bottom: 'push'
  }
});
```

&nbsp;

## License

Copyright &copy; 2015 Niklas Rämö. Licensed under **[the MIT license](LICENSE.md)**.
