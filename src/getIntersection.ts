import { getNormalizedRect } from './utils/getNormalizedRect.js';
import { BoxElementExtended } from './utils/types.js';

export function getIntersection(elementA: BoxElementExtended, elementB: BoxElementExtended) {
  const rectA = getNormalizedRect(elementA);
  const rectB = getNormalizedRect(elementB);

  const x1 = Math.max(rectA.left, rectB.left);
  const x2 = Math.min(rectA.right, rectB.right);
  if (x2 <= x1) return null;

  const y1 = Math.max(rectA.top, rectB.top);
  const y2 = Math.min(rectA.bottom, rectB.bottom);
  if (y2 <= y1) return null;

  return {
    width: x2 - x1,
    height: y2 - y1,
    left: x1,
    top: y1,
    right: x2,
    bottom: y2,
  };
}
