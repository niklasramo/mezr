import { DomRectElement, DomRectArray, Rect } from './utils/types.js';
export declare function getOverflow(elementA: Rect | DomRectElement | DomRectArray, elementB: Rect | DomRectElement | DomRectArray): {
    left: number;
    right: number;
    top: number;
    bottom: number;
};
