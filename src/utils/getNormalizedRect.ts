import { getRect } from '../getRect.js';
import { isRectObject } from './isRectObject.js';
import { BoxObject } from './types.js';

export function getNormalizedRect(element: BoxObject) {
  return isRectObject(element) ? element : getRect(element);
}
