import { getNormalizedRect } from './utils/getNormalizedRect.js';
import { BoxObject } from './utils/types.js';

/**
 * Measure how much target overflows container per each side. Returns an object
 * containing the overflow values (note that the overflow values are reported
 * even if the elements don't intersect). If a side's value is positive it means
 * that target overflows container by that much from that side. If the value is
 * negative it means that container overflows target by that much from that
 * side.
 */
export function getOverflow(
  target: BoxObject,
  container: BoxObject,
): { left: number; right: number; top: number; bottom: number } {
  const targetRect = getNormalizedRect(target);
  const containerRect = getNormalizedRect(container);

  return {
    left: containerRect.left - targetRect.left,
    right: targetRect.left + targetRect.width - (containerRect.left + containerRect.width),
    top: containerRect.top - targetRect.top,
    bottom: targetRect.top + targetRect.height - (containerRect.top + containerRect.height),
  };
}
