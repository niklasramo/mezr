import { doRectsOverlap } from './doRectsOverlap.js';
import { getDistanceBetweenPoints } from './getDistanceBetweenPoints.js';
export function getDistanceBetweenRects(a, b) {
    if (doRectsOverlap(a, b))
        return null;
    if (a.right < b.left) {
        if (a.bottom < b.top) {
            return getDistanceBetweenPoints(a.right, a.bottom, b.left, b.top);
        }
        else if (a.top > b.bottom) {
            return getDistanceBetweenPoints(a.right, a.top, b.left, b.bottom);
        }
        else {
            return b.left - a.right;
        }
    }
    else if (a.left > b.right) {
        if (a.bottom < b.top) {
            return getDistanceBetweenPoints(a.left, a.bottom, b.right, b.top);
        }
        else if (a.top > b.bottom) {
            return getDistanceBetweenPoints(a.left, a.top, b.right, b.bottom);
        }
        else {
            return a.left - b.right;
        }
    }
    else {
        if (a.bottom < b.top) {
            return b.top - a.bottom;
        }
        else {
            return a.top - b.bottom;
        }
    }
}
