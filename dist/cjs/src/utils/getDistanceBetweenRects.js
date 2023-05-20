"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistanceBetweenRects = void 0;
const doRectsOverlap_js_1 = require("./doRectsOverlap.js");
const getDistanceBetweenPoints_js_1 = require("./getDistanceBetweenPoints.js");
function getDistanceBetweenRects(a, b) {
    if ((0, doRectsOverlap_js_1.doRectsOverlap)(a, b))
        return null;
    if (a.right < b.left) {
        if (a.bottom < b.top) {
            return (0, getDistanceBetweenPoints_js_1.getDistanceBetweenPoints)(a.right, a.bottom, b.left, b.top);
        }
        else if (a.top > b.bottom) {
            return (0, getDistanceBetweenPoints_js_1.getDistanceBetweenPoints)(a.right, a.top, b.left, b.bottom);
        }
        else {
            return b.left - a.right;
        }
    }
    else if (a.left > b.right) {
        if (a.bottom < b.top) {
            return (0, getDistanceBetweenPoints_js_1.getDistanceBetweenPoints)(a.left, a.bottom, b.right, b.top);
        }
        else if (a.top > b.bottom) {
            return (0, getDistanceBetweenPoints_js_1.getDistanceBetweenPoints)(a.left, a.top, b.right, b.bottom);
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
exports.getDistanceBetweenRects = getDistanceBetweenRects;
