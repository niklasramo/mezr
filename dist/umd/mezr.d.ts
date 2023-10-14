/**
 * Returns the element's containing block, meaning the ancestor element which
 * the target element's percentage-based width, height, left, right, top,
 * bottom, padding and margin properties are relative to. In case the containing
 * block can not be computed `null` will be returned (e.g. in some cases we
 * can't query all the information needed from elements with display:none).
 *
 * This method is not something you need too often, but when you do you'll be
 * happy that you stumbled upon this library. It's very tricky to compute the
 * containing block correctly while taking browser differences into account.
 * This method does all the heavy lifting for you.
 */
declare function getContainingBlock(element: HTMLElement, options?: {
    position?: string;
    skipDisplayNone?: boolean;
}): HTMLElement | Window | null;

declare const BOX_EDGE: {
    readonly content: "content";
    readonly padding: "padding";
    readonly scrollbar: "scrollbar";
    readonly border: "border";
    readonly margin: "margin";
};

type BoxOffset = {
    left: number;
    top: number;
};
type BoxRect = {
    width: number;
    height: number;
    left: number;
    top: number;
};
type BoxRectFull = {
    width: number;
    height: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
};
type BoxElement = Element | Document | Window;
type BoxElementEdge = keyof typeof BOX_EDGE;
type BoxObject = BoxElement | [BoxElement, BoxElementEdge] | BoxRect;

/**
 * Returns the shortest distance between two elements (in pixels), or `null` if
 * the elements intersect. In case the elements are touching, but not
 * intersecting, the returned distance is `0`.
 */
declare function getDistance(elementA: BoxObject, elementB: BoxObject): number | null;

/**
 * Returns the height of an element in pixels. Accepts also the window object
 * (for getting the viewport height) and the document object (for getting the
 * height of the whole document).
 */
declare function getHeight(element: BoxElement, boxEdge?: BoxElementEdge): number;

/**
 * Measure the intersection area of two or more elements. Returns an object
 * containing the intersection area dimensions and offsets if _all_ the provided
 * elements intersect, otherwise returns `null`.
 */
declare function getIntersection(firstElement: BoxObject, ...restElements: BoxObject[]): BoxRectFull | null;

/**
 * Returns the element's offset from another element, window or document.
 */
declare function getOffset(element: BoxObject, offsetRoot?: BoxObject): BoxOffset;

/**
 * Returns the element's offset container, meaning the closest ancestor
 * element/document/window that the target element's left/right/top/bottom CSS
 * properties are rooted to. If the offset container can't be computed or the
 * element is not affected by left/right/top/bottom CSS properties (e.g. static
 * elements) `null` will be returned.
 *
 * Due to the dynamic nature of sticky elements they are considered as static
 * elements in this method's scope and will always return `null`.
 */
declare function getOffsetContainer(element: HTMLElement, options?: {
    position?: string;
    skipDisplayNone?: boolean;
}): HTMLElement | Document | Window | null;

/**
 * Measure how much target overflows container per each side. Returns an object
 * containing the overflow values (note that the overflow values are reported
 * even if the elements don't intersect). If a side's value is positive it means
 * that target overflows container by that much from that side. If the value is
 * negative it means that container overflows target by that much from that
 * side.
 */
declare function getOverflow(target: BoxObject, container: BoxObject): {
    left: number;
    right: number;
    top: number;
    bottom: number;
};

/**
 * Returns an object containing the provided element's dimensions and offsets.
 * This is basically a helper method for calculating an element's dimensions and
 * offsets simultaneously. Mimics the native getBoundingClientRect method with
 * the added bonus of allowing to define the box edge of the element, and also
 * the element from which the offset is measured.
 */
declare function getRect(element: BoxObject, offsetRoot?: BoxObject): BoxRectFull;

/**
 * Returns the width of an element in pixels. Accepts also the window object
 * (for getting the viewport width) and the document object (for getting the
 * width of the whole document).
 */
declare function getWidth(element: BoxElement, boxEdge?: BoxElementEdge): number;

export { getContainingBlock, getDistance, getHeight, getIntersection, getOffset, getOffsetContainer, getOverflow, getRect, getWidth };
