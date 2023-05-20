declare function getContainingBlock(element: HTMLElement, position?: string): (Window & typeof globalThis) | HTMLElement | null;

declare const BOX_AREA: {
    readonly content: "content";
    readonly padding: "padding";
    readonly scroll: "scroll";
    readonly border: "border";
    readonly margin: "margin";
};

type Rect = {
    width: number;
    height: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
};
type DomRectElement = Element | Document | Window;
type DomRectElementArea = keyof typeof BOX_AREA;
type DomRectArray = [DomRectElement, DomRectElementArea];

declare function getDistance(elementA: Rect | DomRectElement | DomRectArray, elementB: Rect | DomRectElement | DomRectArray): number | null;

declare function getHeight(element: DomRectElement, area?: DomRectElementArea): number;

declare function getIntersection(elementA: Rect | DomRectElement | DomRectArray, elementB: Rect | DomRectElement | DomRectArray): {
    width: number;
    height: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
} | null;

declare function getOffset(element: Rect | DomRectElement | DomRectArray, offsetRoot?: Rect | DomRectElement | DomRectArray): {
    left: number;
    top: number;
};

declare function getOffsetParent(element: HTMLElement, position?: string): (Window & typeof globalThis) | Document | HTMLElement | null;

declare function getOverflow(elementA: Rect | DomRectElement | DomRectArray, elementB: Rect | DomRectElement | DomRectArray): {
    left: number;
    right: number;
    top: number;
    bottom: number;
};

declare function getRect(element: Rect | DomRectElement | DomRectArray, offsetRoot?: Rect | DomRectElement | DomRectArray): {
    right: number;
    bottom: number;
    left: number;
    top: number;
    width: number;
    height: number;
};

declare function getWidth(element: DomRectElement, area?: DomRectElementArea): number;

export { getContainingBlock, getDistance, getHeight, getIntersection, getOffset, getOffsetParent, getOverflow, getRect, getWidth };
