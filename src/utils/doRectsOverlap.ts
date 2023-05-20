import { Rect } from './types.js';

export function doRectsOverlap(a: Rect, b: Rect) {
  return !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
}
