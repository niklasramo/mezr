import { getDistanceBetweenPoints } from './getDistanceBetweenPoints.js';
import { Rect } from './types.js';

export function getDistanceBetweenRects(rectA: Rect, rectB: Rect) {
  // Calculate shortest corner-to-corner distance.
  if (
    (rectB.left > rectA.right || rectB.right < rectA.left) &&
    (rectB.top > rectA.bottom || rectB.bottom < rectA.top)
  ) {
    if (rectB.left > rectA.right) {
      return rectB.bottom < rectA.top
        ? getDistanceBetweenPoints(rectA.right, rectA.top, rectB.left, rectB.bottom)
        : getDistanceBetweenPoints(rectA.right, rectA.bottom, rectB.left, rectB.top);
    }
    return rectB.bottom < rectA.top
      ? getDistanceBetweenPoints(rectA.left, rectA.top, rectB.right, rectB.bottom)
      : getDistanceBetweenPoints(rectA.left, rectA.bottom, rectB.right, rectB.top);
  }

  // Calculate shortest edge-to-edge distance.
  return rectB.bottom < rectA.top
    ? rectA.top - rectB.bottom
    : rectB.left > rectA.right
    ? rectB.left - rectA.right
    : rectB.top > rectA.bottom
    ? rectB.top - rectA.bottom
    : rectA.left - rectB.right;
}
