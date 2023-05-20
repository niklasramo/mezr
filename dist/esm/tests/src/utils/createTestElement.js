const defaultStyles = {
    backgroundColor: 'red',
};
export function createTestElement(styles = {}) {
    const el = document.createElement('div');
    Object.assign(el.style, Object.assign(Object.assign({}, defaultStyles), styles));
    document.body.appendChild(el);
    return el;
}
