"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestElement = void 0;
const defaultStyles = {
    backgroundColor: 'red',
};
function createTestElement(styles = {}) {
    const el = document.createElement('div');
    Object.assign(el.style, Object.assign(Object.assign({}, defaultStyles), styles));
    document.body.appendChild(el);
    return el;
}
exports.createTestElement = createTestElement;
