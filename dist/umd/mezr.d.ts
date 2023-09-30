/**
 * Returns the element's containing block, meaning the ancestor element which
 * the target element's percentage-based
 * width/height/left/right/top/bottom/padding/margin properties are relative to
 * (i.e the final pixel amount of the those percentage-based properties is
 * computed based on the containing block's widht/height).
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
 */
declare function getContainingBlock(element: HTMLElement, options?: {
    position?: string;
    skipDisplayNone?: boolean;
}): (Window & typeof globalThis) | HTMLElement | null;

declare const BOX_EDGE: {
    readonly content: "content";
    readonly padding: "padding";
    readonly scroll: "scroll";
    readonly border: "border";
    readonly margin: "margin";
};

type BoxRect = {
    width: number;
    height: number;
    left: number;
    top: number;
};
type BoxElement = Element | Document | Window;
type BoxElementEdge = keyof typeof BOX_EDGE;
type BoxObject = BoxElement | [BoxElement, BoxElementEdge] | BoxRect;

/**
 * Calculate the distance between two elements or rectangles. If the
 * elements/rectangles overlap the function returns null. In other cases the
 * function returns the distance in pixels (fractional) between the the two
 * elements/rectangles.
 */
declare function getDistance(elementA: BoxObject, elementB: BoxObject): number | null;

declare function getHeight(element: BoxElement, boxEdge?: BoxElementEdge): number;

declare function getIntersection(elementA: BoxObject, elementB: BoxObject): {
    width: number;
    height: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
} | null;

declare function getOffset(element: BoxObject, offsetRoot?: BoxObject): {
    left: number;
    top: number;
};

/**
 * Returns the element's offset container, meaning the closest
 * element/document/window, that the target element's left/right/top/bottom CSS
 * properties are rooted to.
 */
declare function getOffsetContainer(element: HTMLElement, options?: {
    position?: string;
    skipDisplayNone?: boolean;
}): (Window & typeof globalThis) | Document | HTMLElement | null;

/**
 * Calculate how much elementA overflows elementB per each side. Negative value
 * indicates overflow.
 */
declare function getOverflow(elementA: BoxObject, elementB: BoxObject): {
    left: number;
    right: number;
    top: number;
    bottom: number;
};

declare function getRect(element: BoxObject, offsetRoot?: BoxObject): {
    right: number;
    bottom: number;
    left: number;
    top: number;
    width: number;
    height: number;
};

declare function getWidth(element: BoxElement, boxEdge?: BoxElementEdge): number;

export { getContainingBlock, getDistance, getHeight, getIntersection, getOffset, getOffsetContainer, getOverflow, getRect, getWidth };
