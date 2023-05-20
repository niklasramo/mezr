"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doRectsOverlap = void 0;
function doRectsOverlap(a, b) {
    return !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
}
exports.doRectsOverlap = doRectsOverlap;
