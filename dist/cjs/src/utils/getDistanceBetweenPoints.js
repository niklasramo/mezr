"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistanceBetweenPoints = void 0;
function getDistanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
exports.getDistanceBetweenPoints = getDistanceBetweenPoints;
