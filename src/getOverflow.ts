import { getNormalizedRect } from './utils/getNormalizedRect.js';
import { BoxElementExtended } from './utils/types.js';

/**
 * Calculate how much elementA overflows elementB per each side. Negative value
 * indicates overflow.
 */
export function getOverflow(elementA: BoxElementExtended, elementB: BoxElementExtended) {
  const rectA = getNormalizedRect(elementA);
  const rectB = getNormalizedRect(elementB);

  return {
    left: rectA.left - rectB.left,
    right: rectB.right - rectA.right,
    top: rectA.top - rectB.top,
    bottom: rectB.bottom - rectA.bottom,
  };
}
