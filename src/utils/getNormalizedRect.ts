import { getRect } from '../getRect.js';
import { isRectObject } from './isRectObject.js';
import { BoxElementExtended } from './types.js';

export function getNormalizedRect(element: BoxElementExtended) {
  return isRectObject(element) ? element : getRect(element);
}
