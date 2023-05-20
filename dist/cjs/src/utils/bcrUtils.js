"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearBcrCache = exports.cacheBcr = exports.getBcr = void 0;
let cachedElem = null;
let cachedRect = null;
function getBcr(element) {
    return element === cachedElem ? cachedRect : element.getBoundingClientRect();
}
exports.getBcr = getBcr;
function cacheBcr(element) {
    cachedElem = element;
    cachedRect = element.getBoundingClientRect();
}
exports.cacheBcr = cacheBcr;
function clearBcrCache() {
    cachedElem = cachedRect = null;
}
exports.clearBcrCache = clearBcrCache;
