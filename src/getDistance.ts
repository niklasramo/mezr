import { getDistanceBetweenRects } from './utils/getDistanceBetweenRects.js';
import { getNormalizedRect } from './utils/getNormalizedRect.js';
import { BoxObject } from './utils/types.js';

/**
 * Returns the shortest distance between two elements (in pixels), or `null` if
 * the elements intersect. In case the elements are touching, but not
 * intersecting, the returned distance is `0`.
 */
export function getDistance(elementA: BoxObject, elementB: BoxObject): number | null {
  const rectA = getNormalizedRect(elementA);
  const rectB = getNormalizedRect(elementB);
  return getDistanceBetweenRects(rectA, rectB);
}
