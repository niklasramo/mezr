import { getDistanceBetweenRects } from './utils/getDistanceBetweenRects.js';
import { getNormalizedRect } from './utils/getNormalizedRect.js';
import { BoxElementExtended } from './utils/types.js';

/**
 * Calculate the distance between two elements or rectangles. If the
 * elements/rectangles overlap the function returns null. In other cases the
 * function returns the distance in pixels (fractional) between the the two
 * elements/rectangles.
 */
export function getDistance(elementA: BoxElementExtended, elementB: BoxElementExtended) {
  const rectA = getNormalizedRect(elementA);
  const rectB = getNormalizedRect(elementB);
  return getDistanceBetweenRects(rectA, rectB);
}
