# Mezr

```bash
$ npm install mezr
```

Mezr is a lightweight utility library for measuring and comparing the dimensions and positions of DOM elements in modern browsers.

- 📦 **Modular**, organized into clear independent modules.
- 🧩 **Simple API**, which reduces boilerplate code a lot.
- ⚡ **Fast**, built with performance in mind.
- 🤖 **Extensively tested** across all modern browsers.
- 🦺 **Type-safety** provided by TypeScript.
- 🍭 **No runtime dependencies**, just a boatload of dev dependencies.
- 💝 **Free and open source**, MIT Licensed.

## Why?

Mezr is a collection of methods that I've found myself writing over and over again in different projects. I've also found that these methods are not something that you can easily find from other maintained libraries. I've tried to keep the API as simple as possible, so that you can get started with it right away without having to read a lot of documentation. There are also hundreds of unit tests to ensure that the methods work as expected.

Here's a simple example of measuring an element's content width:

**Vanilla**

```ts
// Yes, we could start with elem.clientWidth to make this simpler, but it
// returns rounded integers instead of the true (possibly fractional) width.
let width = elem.getBoundingClientRect().width;

// Get the computed style of the element, this gives us always computed pixel
// values.
const style = window.getComputedStyle(elem);

// Subtract borders.
width -= parseFloat(style.borderLeftWidth) || 0;
width -= parseFloat(style.borderRightWidth) || 0;

// Subtract scrollbar.
if (elem instanceof HTMLHtmlElement) {
  width -= window.innerWidth - document.documentElement.clientWidth;
} else {
  width -= Math.max(0, Math.round(width) - elem.clientWidth);
}

// Subtract paddings.
width -= parseFloat(style.paddingLeft) || 0;
width -= parseFloat(style.paddingRight) || 0;

// Done!
console.log(width);
```

**Mezr**

```ts
import { getWidth } from 'mezr/getWidth';

// Done!
console.log(getWidth(elem, 'content'));
```

## Getting started

### Install

```bash
$ npm install mezr
```

### Import

All the public API methods are provided as [CommonJS modules](./dist/cjs/) (CJS) and [ECMAScript modules](./dist/esm/) (ESM) individually via subpath exports.

```ts
import { getWidth } from 'mezr/getWidth';
import { getHeight } from 'mezr/getHeight';
```

You can also import all the public methods from the library root traditionally if you wish.

```ts
import { getWidth, getHeight } from 'mezr';
```

Lastly a [UMD module](./dist/umd/mezr.js) is also provided if you want to include mezr directly in your website (like in the good old days).

```html
<script src="mezr.js"></script>
<script>
  const bodyWidth = mezr.getWidth(document.body);
  const bodyHeight = mezr.getHeight(document.body);
</script>
```

### Measure

Now you're ready to start measuring the DOM, here's a quick demo on the dimensions/offsets methods. Please refer to the [API](#api) section for more details and more methods.

```ts
import { getWidth } from 'mezr/getWidth';
import { getHeight } from 'mezr/getHeight';
import { getOffset } from 'mezr/getOffset';

// DIMENSIONS

// Measure element's dimensions (with paddings + scrollbar + borders).
// elem.getBoundingClientRect().width/height.
getWidth(elem);
getHeight(elem);

// The second argument defines element's box edge.

// Only the content.
getWidth(elem, 'content');
getHeight(elem, 'content');

// Content + paddings.
getWidth(elem, 'padding');
getHeight(elem, 'padding');

// Content + paddings + scrollbar.
getWidth(elem, 'scroll');
getHeight(elem, 'scroll');

// Content + paddings + scrollbar + borders (default).
getWidth(elem, 'border');
getHeight(elem, 'border');

// Content + paddings + scrollbar + borders + (positive) margins.
getWidth(elem, 'margin');
getHeight(elem, 'margin');

// OFFSETS

// Measure element's offset from it's owner document.
getOffset(elem);
// => { left: number, top: number }

// The second argument defines the offset root which is basically the
// element/document/window that the element's offset is measured from.
getOffset(elemA, elemB);

// By default the "border" box edge is used for the argument elements, but you
// can define another box edge also by using array syntax.
getOffset([elemA, 'padding'], [elemB, 'margin']);
```

## API

- [getWidth()](#getwidth)
- [getHeight()](#getheight)
- [getOffset()](#getOffset)
- [getRect()](#getrect)
- [getDistance()](#getdistance)
- [getIntersection()](#getintersection)
- [getOverflow()](#getoverflow)
- [getContainingBlock()](#getcontainingblock)
- [getOffsetContainer()](#getoffsetcontainer)
- [Types](#types)

### getWidth()

Returns the width of an element in pixels. Accepts also the window object (for getting the viewport width) and the document object (for getting the width of the whole document).

**Syntax**

```ts
type getWidth = (element: BoxElement, boxEdge: BoxElementEdge = 'border') => number;
```

**Parameters**

1. **element**
   - The element which's width we want to measure.
   - Accepts: [`BoxElement`](#boxelement).
2. **boxEdge**
   - Defines which box edge of the element is considered as it's outer edge for the calculations.
   - For `window` and `document` objects this argument behaves a bit differently since they cannot have any paddings, borders or margins. Only `"content"` (without vertical scrollbar's width) and `"scroll"` (with vertical scrollbar's width) are effective values. `"padding"` is normalized to `"content"` while `"border"` and `"margin"` are normalized to `"scroll"`.
   - Accepts: [`BoxElementEdge`](#boxelementedge).
   - Optional. Defaults to `"border"`.

**Examples**

```ts
import { getWidth } from 'mezr/getWidth';

// Document width (with viewport scrollbar).
getWidth(document);

// Document width (without viewport scrollbar).
getWidth(document, 'content');

// Window width (with scrollbar).
getWidth(window);

// Window width (without scrollbar).
getWidth(window, 'content');

// Element content-box width.
// Includes content only.
getWidth(elem, 'content');

// Element padding-box width.
// Includes content + paddings.
getWidth(elem, 'padding');

// Element padding-box + scrollbar width.
// Includes content + paddings + scrollbar.
getWidth(elem, 'scroll');

// Element border-box width.
// Includes content + paddings + scrollbar + borders.
getWidth(elem, 'border');
getWidth(elem);

// Element margin-box width.
// Includes content + paddings + scrollbar + borders + positive margins.
getWidth(elem, 'margin');
```

### getHeight()

Returns the height of an element in pixels. Accepts also the window object (for getting the viewport height) and the document object (for getting the height of the whole document).

**Syntax**

```ts
type getHeight = (element: BoxElement, boxEdge: BoxElementEdge = 'border') => number;
```

**Parameters**

1. **element**
   - The element which's height we want to measure.
   - Accepts: [`BoxElement`](#boxelement).
2. **boxEdge**
   - Defines which box edge (content, padding, scroll, border, margin) of the element is considered as it's outer edge for the calculations.
   - For `window` and `document` objects this argument behaves a bit differently since they cannot have any paddings, borders or margins. Only `"content"` (without horizontal scrollbar's height) and `"scroll"` (with horizontal scrollbar's height) are effective values. `"padding"` is normalized to `"content"` while `"border"` and `"margin"` are normalized to `"scroll"`.
   - Accepts: [`BoxElementEdge`](#boxelementedge).
   - Optional. Defaults to `"border"`.

**Examples**

```ts
import { getHeight } from 'mezr/getHeight';

// Document height (with viewport scrollbar).
getHeight(document);

// Document height (without viewport scrollbar).
getHeight(document, 'content');

// Window height (with scrollbar).
getHeight(window);

// Window height (without scrollbar).
getHeight(window, 'content');

// Element content-box height.
// Includes content only.
getHeight(elem, 'content');

// Element padding-box height.
// Includes content + paddings.
getHeight(elem, 'padding');

// Element padding-box + scrollbar height.
// Includes content + paddings + scrollbar.
getHeight(elem, 'scroll');

// Element border-box height.
// Includes content + paddings + scrollbar + borders.
getHeight(elem, 'border');
getHeight(elem);

// Element margin-box height.
// Includes content + paddings + scrollbar + borders + positive margins.
getHeight(elem, 'margin');
```

### getOffset()

Returns the element's offset from another element, window or document.

**Syntax**

```ts
type getOffset = (element: BoxObject, offsetRoot?: BoxObject) => { left: number; top: number };
```

**Parameters**

1. **element**
   - The element which's offset we want to compute from the offset root.
   - Accepts: [`BoxObject`](#boxobject).
2. **offsetRoot**
   - The element from which the offset is computed to the target element.
   - Accepts: [`BoxObject`](#boxobject).
   - Optional. Defaults to the first argument's closest document.

**Examples**

```ts
import { getOffset } from 'mezr/getOffset';

// Document's offset from document.
getOffset(document);
// => { left: 0, top: 0 }

// Window's offset from document.
getOffset(window);
// => { left: window.scrollX, top: window.scrollY }

// Element's offset from it's owner document.
getOffset(elem);

// You can also define the element's box edge for the calculations.
getOffset([elem, 'content']);
getOffset([elem, 'padding']);
getOffset([elem, 'scroll']);
getOffset([elem, 'border']); // equals getOffset(elem);
getOffset([elem, 'margin']);

// Element's offset from window.
getOffset(elem, window);

// Element's offset from another element.
getOffset(elem, otherElem);
getOffset([elem, 'content'], [otherElem, 'margin']);
```

### getRect()

Returns an object containing the provided element's dimensions and offsets. This is basically a helper method for calculating an element's dimensions and offsets simultaneously. Mimics the native [getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) method with the added bonus of allowing to define the box edge of the element, and also the element from which the offset is measured.

**Syntax**

```ts
type getRect = (element: BoxObject, offsetRoot?: BoxObject) => BoxRectFull;
```

**Parameters**

1. **element**
   - The element which's dimensions and offset (from the offset root) we want to compute.
   - Accepts: [`BoxObject`](#boxobject).
2. **offsetRoot**
   - The element from which to compute the offset from.
   - Accepts: [`BoxObject`](#boxobject).
   - Optional. Defaults to the first argument's closest document.

**Examples**

```ts
import { getRect } from 'mezr/getRect';

// Element's bounding rect data with offsets relative to the element's
// owner document.
getRect(elem);

// Element's bounding rect data with offsets relative to the window. Actually
// produces identical data to elem.getBoundingClienRect() with the exception
// that it doesn't have x and y properties in result data.
getRect(elem, window);

// You can also define the element's box edge for the calculations.
getRect([elem, 'content']);
getRect([elem, 'padding']);
getRect([elem, 'scroll']);
getRect([elem, 'border']); // equals getRect(elem);
getRect([elem, 'margin']);

// Element's bounding rect data with offsets from another element.
getRect(elem, anotherElem);
getRect([elem, 'padding'], [anotherElem, 'margin']);
```

### getDistance()

Returns the shortest distance between two elements (in pixels), or `null` if the elements intersect. In case the elements are touching, but not intersecting, the returned distance is `0`.

```ts
type getDistance = (elementA: BoxObject, elementB: BoxObject) => number | null;
```

**Parameters**

1. **elementA**
   - Accepts: [`BoxObject`](#boxobject).
2. **elementB**
   - Accepts: [`BoxObject`](#boxobject).

**Examples**

```ts
import { getDistance } from 'mezr/getDistance';

// Measure distance between two elements.
getDistance(elemA, elemB);

// Measure distance between element and window.
getDistance(elem, window);

// You can also define the elements' box edge for the calculations.
getDistance([elemA, 'content'], [elemB, 'scroll']);
```

### getIntersection()

Measure the intersection area of two or more elements. Returns an object containing the intersection area dimensions and offsets if _all_ the provided elements intersect, otherwise returns `null`.

**Syntax**

```ts
type getIntersection = (...elements: BoxObject[]) => BoxRectFull | null;
```

**Parameters**

1. **...elements**
   - Provide at least two elements.
   - Accepts: [`BoxObject`](#boxobject).

**Examples**

```ts
import { getIntersection } from 'mezr/getIntersection';

// Measure intersection area of two elements.
getIntersection(elemA, elemB);

// Measure intersection area of element and window.
getIntersection(elem, window);

// You can also define the elements' box edge for the calculations.
getIntersection([elemA, 'content'], [elemB, 'scroll']);

// You can provide as many elements as you want.
getIntersection(elemA, elemB, [elemC, 'scroll'], { left: 0, top: 0, width: 100, height: 100 });
```

### getOverflow()

Measure how much an element overflows another element per each side. Returns an object containing the overflow values. Note that the overflow values are reported even if the elements don't intersect.

**Syntax**

```ts
type getOverflow = (
  elementA: BoxObject,
  elementB: BoxObject,
) => {
  left: number;
  right: number;
  top: number;
  bottom: number;
};
```

**Parameters**

1. **elementA**
   - Accepts: [`BoxObject`](#boxobject).
2. **elementB**
   - Accepts: [`BoxObject`](#boxobject).

**Examples**

```ts
import { getOverflow } from 'mezr/getOverflow';

// Measure how much elemA overflows elemB per each side. Negative value
// indicates that elemA overflows elemB by that much from that side.
getOverflow(elemA, elemB);

// Measure elem overflows windown per each side.
getOverflow(elem, window);

// You can also define the elements' box edge for the calculations.
getOverflow([elemA, 'content'], [elemB, 'scroll']);
```

### getContainingBlock()

Returns the element's [containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block), meaning the ancestor element which the target element's percentage-based width, height, left, right, top, bottom, padding and margin properties are relative to. In case the containing block can not be computed `null` will be returned (e.g. in some cases we can't query all the information needed from elements with display:none).

This method is not something you need too often, but when you do you'll be happy that you stumbled upon this library. It's very tricky to compute the containing block correctly while taking browser differences into account. This method does all the heavy lifting for you.

**Syntax**

```ts
type getContainingBlock = (
  element: HTMLElement,
  options: { position?: string; skipDisplayNone?: boolean } = {},
) => HTMLElement | Window | null;
```

**Parameters**

1. **element**
   - The element which's containing block we want to compute.
   - Accepts: `HTMLElement`.
2. **options**
   - Optional options object.
   - **position**
     - Forcefully provide the element's position value for the calculations. If not provided the element's position will be queried from the element.
     - Accepts: `string`.
     - Defaults to `""`.
   - **skipDisplayNone**
     - Defines how to treat `"display:none"` ancestor elements when computing the containing block in the specific scenarios where we need to know if an ancestor is a block or inline element. By default this is `false`, which means that `null` will be returned by the method in these scenarios, indicating that containing block could not be resolved. If set to `true` all the `"display:none"` ancestors will be treated as inline elements, meaning that they will be _skipped_ in these problematic scenarios.
     - Accepts: `boolean`.
     - Defaults to `false`.

**Examples**

```ts
import { getContainingBlock } from 'mezr/getContainingBlock';

// Get element's containing block.
getContainingBlock(elem);

// Get element's containing block as if it were a fixed element.
getContainingBlock(elem, { position: 'fixed' });

// Get element's containing block while treating all the "display:none"
// ancestors as "display:inline" elements.
getContainingBlock(elem, { skipDisplayNone: true }});
```

### getOffsetContainer()

Returns the element's offset container, meaning the closest ancestor element/document/window that the target element's left/right/top/bottom CSS properties are rooted to. If the offset container can't be computed or the element is not affected by left/right/top/bottom CSS properties (e.g. static elements) `null` will be returned.

Due to the dynamic nature of sticky elements they are considered as static elements in this method's scope and will always return `null`.

**Syntax**

```ts
type getOffsetContainer = (
  element: HTMLElement,
  options: { position?: string; skipDisplayNone?: boolean } = {},
) => HTMLElement | Document | Window | null;
```

**Parameters**

1. **element**
   - The element which's offset container we want to compute.
   - Accepts: `HTMLElement`.
2. **options**
   - Optional options object.
   - Accepts the following optional properties:
     - **position**
       - Forcefully provide the element's position value for the calculations. If not provided the element's position will be queried from the element.
       - Accepts: `string`.
       - Defaults to `""`.
     - **skipDisplayNone**
       - Defines how to treat `"display:none"` ancestor elements when computing the offset container in the specific scenarios where we need to know if an ancestor is a block or inline element. By default this is `false`, which means that `null` will be returned by the method in these scenarios, indicating that offset container could not be resolved. If set to `true` all the `"display:none"` ancestors will be treated as inline elements, meaning that they will be _skipped_ in these problematic scenarios.
       - Accepts: `boolean`.
       - Defaults to `false`.

**Examples**

```ts
import { getOffsetContainer } from 'mezr/getOffsetContainer';

// Get element's offset container.
getOffsetContainer(elem);

// Get element's offset container as if it were a fixed element.
getOffsetContainer(elem, { position: 'fixed' });

// Get element's offset container while treating all the "display:none"
// ancestors as "display:inline" elements.
getOffsetContainer(elem, { skipDisplayNone: true });
```

### Types

#### BoxElementEdge

```ts
type BoxElementEdge = 'content' | 'padding' | 'scroll' | 'border' | 'margin';
```

In many methods you can explicitly define the box edge of the element for the calculcations. In practice the box edge indicates which parts of the the element are considered as part of the element. `"border"` box edge is always the default. The following table illustrates the different box edges.

| Box edge    | Description                                                                    |
| ----------- | ------------------------------------------------------------------------------ |
| `"content"` | The element's content box.                                                     |
| `"padding"` | The element's content box + paddings.                                          |
| `"scroll"`  | The element's content box + paddings + scrollbar.                              |
| `"border"`  | The element's content box + paddings + scrollbar + borders.                    |
| `"margin"`  | The element's content box + paddings + scrollbar + borders + positive margins. |

#### BoxRect

```ts
type BoxRect = {
  width: number;
  height: number;
  left: number;
  top: number;
};
```

In many methods you can provide the raw rectangle data of the element instead of the element itself. The rectangle data is an object containing the element's dimensions and offsets.

| Property | Description                                                                  |
| -------- | ---------------------------------------------------------------------------- |
| `width`  | The element's width in pixels.                                               |
| `height` | The element's height in pixels.                                              |
| `left`   | The element's left edge offset from the left edge of the document in pixels. |
| `top`    | The element's top edge offset from the top edge of the document in pixels.   |

#### BoxRectFull

```ts
type BoxRectFull = {
  width: number;
  height: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
};
```

This is a variation of the `BoxRect` type that also contains the element's right and bottom edge offsets.

| Property | Description                                                                   |
| -------- | ----------------------------------------------------------------------------- |
| `width`  | The element's width in pixels.                                                |
| `height` | The element's height in pixels.                                               |
| `left`   | The element's left edge offset from the left edge of the document in pixels.  |
| `top`    | The element's top edge offset from the top edge of the document in pixels.    |
| `right`  | The element's right edge offset from the left edge of the document in pixels. |
| `bottom` | The element's bottom edge offset from the top edge of the document in pixels. |

#### BoxElement

```ts
type BoxElement = Element | Document | Window;
```

Box element can be any HTML/SVG element, Document or Window.

#### BoxObject

```ts
type BoxObject = BoxElement | [BoxElement, BoxElementEdge] | BoxRect;
```

Many methods allow you to define either a box element, a box element with a box edge or a box rectangle data object.

| Type                           | Description                                                                |
| ------------------------------ | -------------------------------------------------------------------------- |
| `BoxElement`                   | Any HTML/SVG element, Document or Window. Uses `"border"` box edge.        |
| `[BoxElement, BoxElementEdge]` | Any HTML/SVG element, Document or Window with box edge explicitly defined. |
| `BoxRect`                      | An object containing the element's dimensions and offsets.                 |

## License

Copyright &copy; 2015 Niklas Rämö. Licensed under **[the MIT license](LICENSE.md)**.
