"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOffsetFromDocument = void 0;
const getStyle_js_1 = require("./getStyle.js");
const bcrUtils_js_1 = require("./bcrUtils.js");
const isDocument_js_1 = require("./isDocument.js");
const isWindow_js_1 = require("./isWindow.js");
function getOffsetFromDocument(element, area = 'border') {
    const offset = {
        left: 0,
        top: 0,
    };
    if ((0, isDocument_js_1.isDocument)(element)) {
        return offset;
    }
    if ((0, isWindow_js_1.isWindow)(element)) {
        offset.left += element.scrollX || 0;
        offset.top += element.scrollY || 0;
        return offset;
    }
    const win = element.ownerDocument.defaultView;
    if (win) {
        offset.left += win.scrollX || 0;
        offset.top += win.scrollY || 0;
    }
    const rect = (0, bcrUtils_js_1.getBcr)(element);
    offset.left += rect.left;
    offset.top += rect.top;
    if (area === 'border') {
        return offset;
    }
    const style = (0, getStyle_js_1.getStyle)(element);
    if (area === 'margin') {
        offset.left -= Math.max(0, parseFloat(style.marginLeft) || 0);
        offset.top -= Math.max(0, parseFloat(style.marginTop) || 0);
        return offset;
    }
    offset.left += parseFloat(style.borderLeftWidth) || 0;
    offset.top += parseFloat(style.borderTopWidth) || 0;
    if (area === 'scroll' || area === 'padding') {
        return offset;
    }
    offset.left += parseFloat(style.paddingLeft) || 0;
    offset.top += parseFloat(style.paddingTop) || 0;
    return offset;
}
exports.getOffsetFromDocument = getOffsetFromDocument;
