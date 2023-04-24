import { Rect, DomRectElement, DomRectArray } from './utils/types.js';
export declare function getRect(element: Rect | DomRectElement | DomRectArray, offsetRoot?: Rect | DomRectElement | DomRectArray): {
    right: number;
    bottom: number;
    left: number;
    top: number;
    width: number;
    height: number;
};
