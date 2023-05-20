"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRectObject = void 0;
function isRectObject(value) {
    return (value === null || value === void 0 ? void 0 : value.constructor) === Object;
}
exports.isRectObject = isRectObject;
