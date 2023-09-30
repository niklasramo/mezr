import { doRectsOverlap } from './doRectsOverlap.js';
import { getDistanceBetweenPoints } from './getDistanceBetweenPoints.js';
import { BoxRect } from './types.js';

/**
 * Calculate shortest distance between two rectangles. Returns null if the
 * rectangles are overlapping.
 */
export function getDistanceBetweenRects(a: BoxRect, b: BoxRect) {
  if (doRectsOverlap(a, b)) return null;

  const aRight = a.left + a.width;
  const aBottom = a.top + a.height;
  const bRight = b.left + b.width;
  const bBottom = b.top + b.height;

  // Check left side zones.
  if (aRight < b.left) {
    // Left-top corner.
    if (aBottom < b.top) {
      // Distance between a right-bottom point and b left-top point.
      return getDistanceBetweenPoints(aRight, aBottom, b.left, b.top);
    }
    // Left-bottom corner.
    else if (a.top > bBottom) {
      // Distance between a right-top point and b left-bottom point.
      return getDistanceBetweenPoints(aRight, a.top, b.left, bBottom);
    }
    // Left side.
    else {
      return b.left - aRight;
    }
  }
  // Check right side zones.
  else if (a.left > bRight) {
    // Right-top corner.
    if (aBottom < b.top) {
      // Distance between a left-bottom point and b right-top point.
      return getDistanceBetweenPoints(a.left, aBottom, bRight, b.top);
    }
    // Right-bottom corner.
    else if (a.top > bBottom) {
      // Distance between a left-top point and b right-bottom point.
      return getDistanceBetweenPoints(a.left, a.top, bRight, bBottom);
    }
    // Right side.
    else {
      return a.left - bRight;
    }
  }
  // Check top and bottom sides.
  else {
    // Top side.
    if (aBottom < b.top) {
      return b.top - aBottom;
    }
    // Bottom side.
    else {
      return a.top - bBottom;
    }
  }
}
