import { Rect } from './types.js';

export function doRectsOverlap(rectA: Rect, rectB: Rect) {
  return !(
    rectA.right <= rectB.left ||
    rectB.right <= rectA.left ||
    rectA.bottom <= rectB.top ||
    rectB.bottom <= rectA.top
  );
}
