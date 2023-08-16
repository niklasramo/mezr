import { Rect, DomRectElement, DomRectArray } from './utils/types.js';
export declare function getIntersection(elementA: Rect | DomRectElement | DomRectArray, elementB: Rect | DomRectElement | DomRectArray): {
    width: number;
    height: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
} | null;
