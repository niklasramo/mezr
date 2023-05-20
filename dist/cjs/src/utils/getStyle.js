"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStyle = void 0;
const STYLE_DECLARATION_CACHE = new WeakMap();
function getStyle(element) {
    var _a;
    let styleDeclaration = (_a = STYLE_DECLARATION_CACHE.get(element)) === null || _a === void 0 ? void 0 : _a.deref();
    if (!styleDeclaration) {
        styleDeclaration = window.getComputedStyle(element, null);
        STYLE_DECLARATION_CACHE.set(element, new WeakRef(styleDeclaration));
    }
    return styleDeclaration;
}
exports.getStyle = getStyle;
