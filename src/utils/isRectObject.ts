import { DomRectElement, DomRectArray, Rect } from './types.js';

export function isRectObject(value: Rect | DomRectElement | DomRectArray): value is Rect {
  return value?.constructor === Object;
}
