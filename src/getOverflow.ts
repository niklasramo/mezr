import { getNormalizedRect } from './utils/getNormalizedRect.js';
import { DomRectElement, DomRectArray, Rect } from './utils/types.js';

/**
 * Calculate how much elementA overflows elementB per each side.
 */
export function getOverflow(
  elementA: Rect | DomRectElement | DomRectArray,
  elementB: Rect | DomRectElement | DomRectArray
) {
  const rectA = getNormalizedRect(elementA);
  const rectB = getNormalizedRect(elementB);

  return {
    left: rectA.left - rectB.left,
    right: rectB.right - rectA.right,
    top: rectA.top - rectB.top,
    bottom: rectB.bottom - rectA.bottom,
  };
}
