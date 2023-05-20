export function beforeTest() {
    if (!document.getElementById('default-page-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'default-page-styles';
        styleSheet.type = 'text/css';
        styleSheet.innerHTML = `
      body {
        margin: 0;
      }
    `;
        document.head.appendChild(styleSheet);
    }
    window.scrollTo(0, 0);
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}
export function afterTest() {
    var _a;
    (_a = document.getElementById('default-page-styles')) === null || _a === void 0 ? void 0 : _a.remove();
    document.documentElement.removeAttribute('style');
    document.body.removeAttribute('style');
}
