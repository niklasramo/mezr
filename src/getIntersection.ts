import { getNormalizedRect } from './utils/getNormalizedRect.js';
import { BoxObject } from './utils/types.js';

export function getIntersection(elementA: BoxObject, elementB: BoxObject) {
  const rectA = getNormalizedRect(elementA);
  const rectB = getNormalizedRect(elementB);

  const x1 = Math.max(rectA.left, rectB.left);
  const x2 = Math.min(rectA.left + rectA.width, rectB.left + rectB.width);
  if (x2 <= x1) return null;

  const y1 = Math.max(rectA.top, rectB.top);
  const y2 = Math.min(rectA.top + rectA.height, rectB.height + rectB.top);
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
