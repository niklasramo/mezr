import { getRect } from '../getRect.js';
import { isRectObject } from './isRectObject.js';
export function getNormalizedRect(element) {
    return isRectObject(element) ? element : getRect(element);
}
