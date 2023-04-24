import { getRect } from '../getRect.js';
import { isRectObject } from './isRectObject.js';
import { DomRectElement, DomRectArray, Rect } from './types.js';

export function getNormalizedRect(element: Rect | DomRectElement | DomRectArray) {
  return isRectObject(element) ? element : getRect(element);
}
