import { getNormalizedRect } from './utils/getNormalizedRect.js';
import { BoxObject, BoxRectFull } from './utils/types.js';

/**
 * Measure the intersection area of two or more elements. Returns an object
 * containing the intersection area dimensions and offsets if _all_ the provided
 * elements intersect, otherwise returns `null`.
 */
export function getIntersection(
  firstElement: BoxObject,
  ...restElements: BoxObject[]
): BoxRectFull | null {
  const result = { ...getNormalizedRect(firstElement), right: 0, bottom: 0 };

  for (const element of restElements) {
    const rect = getNormalizedRect(element);

    const x1 = Math.max(result.left, rect.left);
    const x2 = Math.min(result.left + result.width, rect.left + rect.width);
    if (x2 <= x1) return null;

    const y1 = Math.max(result.top, rect.top);
    const y2 = Math.min(result.top + result.height, rect.height + rect.top);
    if (y2 <= y1) return null;

    result.left = x1;
    result.top = y1;
    result.width = x2 - x1;
    result.height = y2 - y1;
  }

  result.right = result.left + result.width;
  result.bottom = result.top + result.height;

  return result;
}
