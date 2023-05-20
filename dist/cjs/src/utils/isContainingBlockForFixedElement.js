"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isContainingBlockForFixedElement = void 0;
const constants_js_1 = require("./constants.js");
const getStyle_js_1 = require("./getStyle.js");
const isBlockElement_js_1 = require("./isBlockElement.js");
function isContainingBlockForFixedElement(element) {
    const isBlock = (0, isBlockElement_js_1.isBlockElement)(element);
    if (!isBlock)
        return isBlock;
    const style = (0, getStyle_js_1.getStyle)(element);
    const { transform } = style;
    if (transform && transform !== 'none') {
        return true;
    }
    const { perspective } = style;
    if (perspective && perspective !== 'none') {
        return true;
    }
    const { backdropFilter } = style;
    if (backdropFilter && backdropFilter !== 'none') {
        return true;
    }
    const { contentVisibility } = style;
    if (contentVisibility && contentVisibility === 'auto') {
        return true;
    }
    const { contain } = style;
    if (contain &&
        (contain === 'strict' ||
            contain === 'content' ||
            contain.indexOf('paint') > -1 ||
            contain.indexOf('layout') > -1)) {
        return true;
    }
    if (!constants_js_1.IS_SAFARI) {
        const { filter } = style;
        if (filter && filter !== 'none') {
            return true;
        }
        const { willChange } = style;
        if (willChange &&
            (willChange.indexOf('transform') > -1 ||
                willChange.indexOf('perspective') > -1 ||
                willChange.indexOf('filter') > -1)) {
            return true;
        }
    }
    return false;
}
exports.isContainingBlockForFixedElement = isContainingBlockForFixedElement;
