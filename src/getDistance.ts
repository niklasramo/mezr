import { doRectsOverlap } from './utils/doRectsOverlap.js';
import { getDistanceBetweenRects } from './utils/getDistanceBetweenRects.js';
import { getNormalizedRect } from './utils/getNormalizedRect.js';
import { DomRectElement, DomRectArray, Rect } from './utils/types.js';

/**
 * Calculate the distance between two elements or rectangles. If the
 * elements/rectangles overlap the function returns -1. In other cases the
 * function returns the distance in pixels (fractional) between the the two
 * elements/rectangles.
 */
export function getDistance(
  elementA: Rect | DomRectElement | DomRectArray,
  elementB: Rect | DomRectElement | DomRectArray
) {
  const rectA = getNormalizedRect(elementA);
  const rectB = getNormalizedRect(elementB);
  return doRectsOverlap(rectA, rectB) ? null : getDistanceBetweenRects(rectA, rectB);
}
