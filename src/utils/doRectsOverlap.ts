import { BoxRect } from './types.js';

export function doRectsOverlap(a: BoxRect, b: BoxRect) {
  return !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
}
