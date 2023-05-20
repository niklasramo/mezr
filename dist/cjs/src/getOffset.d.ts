import { Rect, DomRectElement, DomRectArray } from './utils/types.js';
export declare function getOffset(element: Rect | DomRectElement | DomRectArray, offsetRoot?: Rect | DomRectElement | DomRectArray): {
    left: number;
    top: number;
};
