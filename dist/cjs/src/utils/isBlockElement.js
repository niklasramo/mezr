"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlockElement = void 0;
const getStyle_js_1 = require("./getStyle.js");
function isBlockElement(element) {
    switch ((0, getStyle_js_1.getStyle)(element).display) {
        case 'none':
            return undefined;
        case 'inline':
        case 'contents':
            return false;
        default:
            return true;
    }
}
exports.isBlockElement = isBlockElement;
