export function isRectObject(value) {
    return (value === null || value === void 0 ? void 0 : value.constructor) === Object;
}
