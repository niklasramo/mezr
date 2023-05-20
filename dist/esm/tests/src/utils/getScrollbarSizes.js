export function getScrollbarSizes() {
    const el = document.createElement('div');
    Object.assign(el.style, {
        width: '100px',
        height: '100px',
        overflow: 'scroll',
    });
    document.body.appendChild(el);
    const width = el.offsetWidth - el.clientWidth;
    const height = el.offsetHeight - el.clientHeight;
    el.remove();
    return {
        width,
        height,
    };
}
