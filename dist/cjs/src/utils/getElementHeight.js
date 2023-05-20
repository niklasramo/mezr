"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getElementHeight = void 0;
const constants_js_1 = require("./constants.js");
const getStyle_js_1 = require("./getStyle.js");
const isDocumentElement_js_1 = require("./isDocumentElement.js");
const bcrUtils_js_1 = require("./bcrUtils.js");
function getElementHeight(element, area = 'border') {
    let { height } = (0, bcrUtils_js_1.getBcr)(element);
    if (area === constants_js_1.BOX_AREA.border) {
        return height;
    }
    const style = (0, getStyle_js_1.getStyle)(element);
    if (area === constants_js_1.BOX_AREA.margin) {
        height += Math.max(0, parseFloat(style.marginTop) || 0);
        height += Math.max(0, parseFloat(style.marginBottom) || 0);
        return height;
    }
    height -= parseFloat(style.borderTopWidth) || 0;
    height -= parseFloat(style.borderBottomWidth) || 0;
    if (area === constants_js_1.BOX_AREA.scroll) {
        return height;
    }
    if ((0, isDocumentElement_js_1.isDocumentElement)(element)) {
        const doc = element.ownerDocument;
        const win = doc.defaultView;
        if (win) {
            height -= win.innerHeight - doc.documentElement.clientHeight;
        }
    }
    else {
        const sbSize = Math.round(height) - element.clientHeight;
        if (sbSize > 0) {
            height -= sbSize;
        }
    }
    if (area === constants_js_1.BOX_AREA.padding) {
        return height;
    }
    height -= parseFloat(style.paddingTop) || 0;
    height -= parseFloat(style.paddingBottom) || 0;
    return height;
}
exports.getElementHeight = getElementHeight;
