"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isContainingBlockForAbsoluteElement = void 0;
const getStyle_js_1 = require("./getStyle.js");
const isContainingBlockForFixedElement_js_1 = require("./isContainingBlockForFixedElement.js");
function isContainingBlockForAbsoluteElement(element) {
    if ((0, getStyle_js_1.getStyle)(element).position !== 'static') {
        return true;
    }
    return (0, isContainingBlockForFixedElement_js_1.isContainingBlockForFixedElement)(element);
}
exports.isContainingBlockForAbsoluteElement = isContainingBlockForAbsoluteElement;
