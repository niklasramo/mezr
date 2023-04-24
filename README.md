# Mezr

Mezr is a lightweight JavaScript utility library for measuring and comparing the dimensions and positions of HTML DOM elements in modern browsers.

**Features**

- Modular, all the public methods are provided as production-ready stand-alone modules.
- Simple and ergonomic API which reduces boilerplate code a lot.
- Fast, all the methods are built with performance in mind.
- Full type safety.
- No dependencies.

## Getting started

### Install

```bash
$ npm install mezr
```

### Import

All the public API methods are provided as [CommonJS modules](./dist/cjs/) (CJS) and [ECMAScript modules](./dist/esm/) (ESM) individually via subpath [exports](./package.json#L31). This is nice because you only import the code you actually use without needing to worry about tree shaking.

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

Now you're ready to start measuring the DOM, here's a quick cheat-sheet to get you started.

```ts
import { getWidth } from 'mezr/getWidth';
import { getHeight } from 'mezr/getHeight';
import { getOffset } from 'mezr/getOffset';
import { getDistance } from 'mezr/getDistance';
import { getIntersection } from 'mezr/getIntersection';
import { getOverflow } from 'mezr/getOverflow';

//
// DIMENSIONS
//

// Measure element's dimensions (with paddings + scrollbar + borders).
getWidth(elem);
// equals elem.getBoundingClientRect().width
getHeight(elem);
// equals elem.getBoundingClientRect().height

// The second argument defines element's area edge.

// Only the content.
getWidth(elem, 'content');
// Content + paddings.
getWidth(elem, 'padding');
// Content + paddings + scrollbar.
getWidth(elem, 'scroll');
// Content + paddings + scrollbar + borders (default).
getWidth(elem, 'border');
// Content + paddings + scrollbar + borders + (positive) margins.
getWidth(elem, 'margin');

//
// OFFSETS
//

// Measure element's offset from it's owner document.
getOffset(elem);
// => { left: number, top: number }

// The second argument defines the offset root which is basically the
// element/document/window that the element's offset is measured from.
getOffset(elemA, elemB);

// By default the "border" area edge is used for the argument elements, but you
// can define another area edge also by using array syntax.
getOffset([elemA, 'padding'], [elemB, 'margin']);

//
// DISTANCE
//

// Measure straight line distance between two elements.
getDistance(elemA, elemB);
// => number

// By default the "border" area edge is used for the argument elements, but you
// can define another area edge also by using array syntax.
getDistance([elemA, 'content'], [elemB, 'margin']);

//
// INTERSECTION
//

// Measure intersection area between two elements (or document/window).
getIntersection(elemA, elemB);
// => {
//    width: number,
//    height: number,
//    left: number,
//    top: number,
//    right: number,
//    bottom: number,
// };

// By default the "border" area edge is used for the argument elements, but you
// can define another area edge also by using array syntax.
getIntersection([elemA, 'content'], [elemB, 'margin']);

//
// OVERFLOW
//

// Measure how much elemB overflows elemA per each side. If a side's value
// is positive it means that elemB overflows elemA by that much from that side.
// If the value is negative it means that elemA overflows elemB by that much
// from that side.
getOverflow(elemA, elemB);
// => {
//    left: number,
//    top: number,
//    right: number,
//    bottom: number,
// };

// By default the "border" area edge is used for the argument elements, but you
// can define another area edge also by using array syntax.
getOverflow([elemA, 'content'], [elemB, 'margin']);
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
- [getOffsetParent()](#getoffsetparent)

### getWidth()

Returns the width of an element in pixels. Accepts also the window object (for getting the viewport width) and the document object (for getting the width of the whole document).

**Type**

```ts
type DomRectElementArea = 'content' | 'padding' | 'scroll' | 'border' | 'margin';

type getWidth = (
  element: HTMLElement | Document | Window,
  area: DomRectElementArea = 'border'
) => number;
```

**Arguments**

- **element**
  - The element which's width we want to measure. Accepts any DOM element, a document object or a window object.
- **area**
  - Defines which edge (content, padding, scroll, border, margin) of the element is considered as it's outer edge.
  - For `window` and `document` objects this argument behaves a bit differently since they cannot have any paddings, borders or margins. Only `"content"` (without vertical scrollbar's width) and `"scroll"` (with vertical scrollbar's width) are effective values. `"padding"` is normalized to `"content"` while `"border"` and `"margin"` are normalized to `"scroll"`.
  - Optional, defaults to `"border"`.

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

**Type**

```ts
type DomRectElementArea = 'content' | 'padding' | 'scroll' | 'border' | 'margin';

type getHeight = (
  element: HTMLElement | Document | Window,
  area: DomRectElementArea = 'border'
) => number;
```

**Arguments**

- **element**
  - The element which's height we want to measure. Accepts any DOM element, a document object or a window object.
- **area**
  - Defines which edge (content, padding, scroll, border, margin) of the element is considered as it's outer edge.
  - For `window` and `document` objects this argument behaves a bit differently since they cannot have any paddings, borders or margins. Only `"content"` (without horizontal scrollbar's height) and `"scroll"` (with horizontal scrollbar's height) are effective values. `"padding"` is normalized to `"content"` while `"border"` and `"margin"` are normalized to `"scroll"`.
  - Optional, defaults to `"border"`.

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

**Type**

```ts
type DomRectElement = HTMLElement | Document | Window;

type DomRectElementArea = 'content' | 'padding' | 'scroll' | 'border' | 'margin';

type getOffset = (
  element: DomRectElement | [DomRectElement, DomRectElementArea],
  offsetRoot?: DomRectElement | [DomRectElement, DomRectElementArea]
) => { left: number; top: number };
```

**Arguments**

- **element**
  - The element which's offset we want to compute from the offset root (the second argument).
- **offsetRoot**
  - Defines which edge (content, padding, scroll, border, margin) of the element is considered as its outer edge. Optional.
  - Optional, defaults to the first argument's closest document.

**Examples**

```ts
import { getOffset } from 'mezr/getOffset';

// Document's offset.
getOffset(document);
// => { left: 0, top: 0 }

// Window's offset from document.
getOffset(window);
// => { left: window.scrollX, top: window.scrollY }

// Element's offset from it's owner document.
getOffset(elem);

// You can also define the element's area edge for the calculations.
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

Returns an object containing the provided element's dimensions and offsets. This is basically a helper method for calculating an element's dimensions and offsets simultaneously. Mimics the native [getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) method with the added bonus of allowing to define the area edge of the element, and also the element from which the offset is measured.

**Type**

```ts
type DomRectElement = HTMLElement | Document | Window;

type DomRectElementArea = 'content' | 'padding' | 'scroll' | 'border' | 'margin';

type getRect = (
  element: DomRectElement | [DomRectElement, DomRectElementArea],
  offsetRoot?: DomRectElement | [DomRectElement, DomRectElementArea]
) => {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
};
```

**Arguments**

- **element**
  - The element which's dimensions and offsets we want to compute from the offset root (the second argument).
- **offsetRoot**
  - The element from which to compute the offset from.
  - Optional, defaults to the first argument's closest document.

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

// You can also define the element's area edge for the calculations.
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

Returns the distance between two elements (in pixels) or `null` if the elements overlap.

```ts
type DomRectElement = HTMLElement | Document | Window;

type DomRectElementArea = 'content' | 'padding' | 'scroll' | 'border' | 'margin';

type getDistance = (
  elementA: DomRectElement | [DomRectElement, DomRectElementArea],
  elementB: DomRectElement | [DomRectElement, DomRectElementArea]
) => number | null;
```

**Arguments**

- **elementA**
- **elementB**

**Examples**

```ts
import { getDistance } from 'mezr/getDistance';

// Measure distance between two elements.
getDistance(elemA, elemB);

// Measure distance between element and window.
getDistance(elem, window);

// You can also define the elements' area edge for the calculations.
getDistance([elemA, 'content'], [elemB, 'scroll']);
```

### getIntersection()

Measure the intersection area of two elements. Returns an object containing the intersection area dimensions and offsets if the elements overlap, otherwise returns `null`.

**Type**

```ts
type DomRectElement = HTMLElement | Document | Window;

type DomRectElementArea = 'content' | 'padding' | 'scroll' | 'border' | 'margin';

type getDistance = (
  elementA: DomRectElement | [DomRectElement, DomRectElementArea],
  elementB: DomRectElement | [DomRectElement, DomRectElementArea]
) => {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
} | null;
```

**Arguments**

- **elementA**
- **elementB**

**Examples**

```ts
import { getIntersection } from 'mezr/getIntersection';

// Measure intersection area of two elements.
getIntersection(elemA, elemB);

// Measure intersection area of element and window.
getIntersection(elem, window);

// You can also define the elements' area edge for the calculations.
getIntersection([elemA, 'content'], [elemB, 'scroll']);
```

### getOverflow()

Measure how much an element overflows another element per each side.

**Type**

```ts
type DomRectElement = HTMLElement | Document | Window;

type DomRectElementArea = 'content' | 'padding' | 'scroll' | 'border' | 'margin';

type getDistance = (
  elementA: DomRectElement | [DomRectElement, DomRectElementArea],
  elementB: DomRectElement | [DomRectElement, DomRectElementArea]
) => {
  left: number;
  right: number;
  top: number;
  bottom: number;
};
```

**Arguments**

- **elementA**
- **elementB**

**Examples**

```ts
import { getOverflow } from 'mezr/getOverflow';

// Measure how much elemA overflows elemB per each side. For example, if the
// returned object's left property value is positive it means that elemA
// overflows elemB by that much on elemB's left side.
getOverflow(elemA, elemB);

// Measure elem overflows windown per each side.
getOverflow(elem, window);

// You can also define the elements' area edge for the calculations.
getOverflow([elemA, 'content'], [elemB, 'scroll']);
```

### getContainingBlock()

Returns the element's [containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block). In case the containing block could not be computed `null` will be returned.

**Type**

```ts
type getContainingBlock = (element: HTMLElement, position?: string) => HTMLElement | Window | null;
```

**Arguments**

- **element**
  - Accepts any DOM element.
- **position**
  - An optional argument which allows you to forcefully provide the element's position value for te calculations. If this argument is omitted the element's position will be automatically read from the element.

**Examples**

```ts
import { getContainingBlock } from 'mezr/getContainingBlock';

// Get element's containing block.
getContainingBlock(elem);

// Get element's containing block as if it were a fixed element.
getContainingBlock(elem, 'fixed');
```

## License

Copyright &copy; 2015 Niklas Rämö. Licensed under **[the MIT license](LICENSE.md)**.
