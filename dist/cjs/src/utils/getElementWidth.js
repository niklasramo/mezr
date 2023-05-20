"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElementWidth = void 0;
const constants_js_1 = require("./constants.js");
const getStyle_js_1 = require("./getStyle.js");
const isDocumentElement_js_1 = require("./isDocumentElement.js");
const bcrUtils_js_1 = require("./bcrUtils.js");
function getElementWidth(element, area = 'border') {
    let { width } = (0, bcrUtils_js_1.getBcr)(element);
    if (area === constants_js_1.BOX_AREA.border) {
        return width;
    }
    const style = (0, getStyle_js_1.getStyle)(element);
    if (area === constants_js_1.BOX_AREA.margin) {
        width += Math.max(0, parseFloat(style.marginLeft) || 0);
        width += Math.max(0, parseFloat(style.marginRight) || 0);
        return width;
    }
    width -= parseFloat(style.borderLeftWidth) || 0;
    width -= parseFloat(style.borderRightWidth) || 0;
    if (area === constants_js_1.BOX_AREA.scroll) {
        return width;
    }
    if ((0, isDocumentElement_js_1.isDocumentElement)(element)) {
        const doc = element.ownerDocument;
        const win = doc.defaultView;
        if (win) {
            width -= win.innerWidth - doc.documentElement.clientWidth;
        }
    }
    else {
        const sbSize = Math.round(width) - element.clientWidth;
        if (sbSize > 0) {
            width -= sbSize;
        }
    }
    if (area === constants_js_1.BOX_AREA.padding) {
        return width;
    }
    width -= parseFloat(style.paddingLeft) || 0;
    width -= parseFloat(style.paddingRight) || 0;
    return width;
}
exports.getElementWidth = getElementWidth;
