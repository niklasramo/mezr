import { getNormalizedRect } from './utils/getNormalizedRect.js';
import { BoxObject } from './utils/types.js';

/**
 * Calculate how much elementA overflows elementB per each side. Negative value
 * indicates overflow.
 */
export function getOverflow(elementA: BoxObject, elementB: BoxObject) {
  const rectA = getNormalizedRect(elementA);
  const rectB = getNormalizedRect(elementB);

  return {
    left: rectA.left - rectB.left,
    right: rectB.left + rectB.width - (rectA.left + rectA.width),
    top: rectA.top - rectB.top,
    bottom: rectB.top + rectB.height - (rectA.top + rectA.height),
  };
}
