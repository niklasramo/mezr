"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNormalizedRect = void 0;
const getRect_js_1 = require("../getRect.js");
const isRectObject_js_1 = require("./isRectObject.js");
function getNormalizedRect(element) {
    return (0, isRectObject_js_1.isRectObject)(element) ? element : (0, getRect_js_1.getRect)(element);
}
exports.getNormalizedRect = getNormalizedRect;
