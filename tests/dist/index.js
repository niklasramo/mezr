(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('chai')) :
    typeof define === 'function' && define.amd ? define(['chai'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.chai));
})(this, (function (chai) { 'use strict';

    function beforeTest() {
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
    function afterTest() {
        var _a;
        (_a = document.getElementById('default-page-styles')) === null || _a === void 0 ? void 0 : _a.remove();
        document.documentElement.removeAttribute('style');
        document.body.removeAttribute('style');
    }

    const defaultStyles = {
        backgroundColor: 'red',
    };
    function createTestElement(styles = {}) {
        const el = document.createElement('div');
        Object.assign(el.style, Object.assign(Object.assign({}, defaultStyles), styles));
        document.body.appendChild(el);
        return el;
    }

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

    const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    !!(IS_BROWSER &&
        navigator.vendor &&
        navigator.vendor.indexOf('Apple') > -1 &&
        navigator.userAgent &&
        navigator.userAgent.indexOf('CriOS') == -1 &&
        navigator.userAgent.indexOf('FxiOS') == -1);
    const BOX_AREA = {
        content: 'content',
        padding: 'padding',
        scroll: 'scroll',
        border: 'border',
        margin: 'margin',
    };
    const INCLUDE_SCROLLBAR = {
        [BOX_AREA.content]: false,
        [BOX_AREA.padding]: false,
        [BOX_AREA.scroll]: true,
        [BOX_AREA.border]: true,
        [BOX_AREA.margin]: true,
    };

    function isDocumentElement(value) {
        return value instanceof HTMLHtmlElement;
    }

    function isWindow(value) {
        return value instanceof Window;
    }

    function isDocument(value) {
        return value instanceof Document;
    }

    function getWindowWidth(win, includeScrollbar = false) {
        return includeScrollbar ? win.innerWidth : win.document.documentElement.clientWidth;
    }

    function getDocumentWidth(doc, includeScrollbar = false) {
        if (includeScrollbar) {
            const win = doc.defaultView;
            const scrollbarSize = win ? win.innerWidth - doc.documentElement.clientWidth : 0;
            return Math.max(doc.documentElement.scrollWidth + scrollbarSize, doc.body.scrollWidth + scrollbarSize, win ? win.innerWidth : 0);
        }
        else {
            return Math.max(doc.documentElement.scrollWidth, doc.body.scrollWidth, doc.documentElement.clientWidth);
        }
    }

    let cachedElem = null;
    let cachedRect = null;
    function getBcr(element) {
        return element === cachedElem ? cachedRect : element.getBoundingClientRect();
    }
    function cacheBcr(element) {
        cachedElem = element;
        cachedRect = element.getBoundingClientRect();
    }
    function clearBcrCache() {
        cachedElem = cachedRect = null;
    }

    function getElementWidth(element, area = 'border') {
        let { width } = getBcr(element);
        if (area === BOX_AREA.border) {
            return width;
        }
        const style = getStyle(element);
        if (area === BOX_AREA.margin) {
            width += Math.max(0, parseFloat(style.marginLeft) || 0);
            width += Math.max(0, parseFloat(style.marginRight) || 0);
            return width;
        }
        width -= parseFloat(style.borderLeftWidth) || 0;
        width -= parseFloat(style.borderRightWidth) || 0;
        if (area === BOX_AREA.scroll) {
            return width;
        }
        if (isDocumentElement(element)) {
            const doc = element.ownerDocument;
            const win = doc.defaultView;
            if (win) {
                width -= win.innerWidth - doc.documentElement.clientWidth;
            }
        }
        else {
            const sbSize = Math.round(width) - element.clientWidth;
            if (sbSize > 0) {
                width -= sbSize;
            }
        }
        if (area === BOX_AREA.padding) {
            return width;
        }
        width -= parseFloat(style.paddingLeft) || 0;
        width -= parseFloat(style.paddingRight) || 0;
        return width;
    }

    function getWidth(element, area = 'border') {
        if (isWindow(element)) {
            return getWindowWidth(element, INCLUDE_SCROLLBAR[area]);
        }
        if (isDocument(element)) {
            return getDocumentWidth(element, INCLUDE_SCROLLBAR[area]);
        }
        return getElementWidth(element, area);
    }

    function getWindowHeight(win, includeScrollbar = false) {
        return includeScrollbar ? win.innerHeight : win.document.documentElement.clientHeight;
    }

    function getDocumentHeight(doc, includeScrollbar = false) {
        if (includeScrollbar) {
            const win = doc.defaultView;
            const scrollbarSize = win ? win.innerHeight - doc.documentElement.clientHeight : 0;
            return Math.max(doc.documentElement.scrollHeight + scrollbarSize, doc.body.scrollHeight + scrollbarSize, win ? win.innerHeight : 0);
        }
        else {
            return Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight, doc.documentElement.clientHeight);
        }
    }

    function getElementHeight(element, area = 'border') {
        let { height } = getBcr(element);
        if (area === BOX_AREA.border) {
            return height;
        }
        const style = getStyle(element);
        if (area === BOX_AREA.margin) {
            height += Math.max(0, parseFloat(style.marginTop) || 0);
            height += Math.max(0, parseFloat(style.marginBottom) || 0);
            return height;
        }
        height -= parseFloat(style.borderTopWidth) || 0;
        height -= parseFloat(style.borderBottomWidth) || 0;
        if (area === BOX_AREA.scroll) {
            return height;
        }
        if (isDocumentElement(element)) {
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
        if (area === BOX_AREA.padding) {
            return height;
        }
        height -= parseFloat(style.paddingTop) || 0;
        height -= parseFloat(style.paddingBottom) || 0;
        return height;
    }

    function getHeight(element, area = 'border') {
        if (isWindow(element)) {
            return getWindowHeight(element, INCLUDE_SCROLLBAR[area]);
        }
        if (isDocument(element)) {
            return getDocumentHeight(element, INCLUDE_SCROLLBAR[area]);
        }
        return getElementHeight(element, area);
    }

    function isRectObject(value) {
        return (value === null || value === void 0 ? void 0 : value.constructor) === Object;
    }

    function getOffsetFromDocument(element, area = 'border') {
        const offset = {
            left: 0,
            top: 0,
        };
        if (isDocument(element)) {
            return offset;
        }
        if (isWindow(element)) {
            offset.left += element.scrollX || 0;
            offset.top += element.scrollY || 0;
            return offset;
        }
        const win = element.ownerDocument.defaultView;
        if (win) {
            offset.left += win.scrollX || 0;
            offset.top += win.scrollY || 0;
        }
        const rect = getBcr(element);
        offset.left += rect.left;
        offset.top += rect.top;
        if (area === 'border') {
            return offset;
        }
        const style = getStyle(element);
        if (area === 'margin') {
            offset.left -= Math.max(0, parseFloat(style.marginLeft) || 0);
            offset.top -= Math.max(0, parseFloat(style.marginTop) || 0);
            return offset;
        }
        offset.left += parseFloat(style.borderLeftWidth) || 0;
        offset.top += parseFloat(style.borderTopWidth) || 0;
        if (area === 'scroll' || area === 'padding') {
            return offset;
        }
        offset.left += parseFloat(style.paddingLeft) || 0;
        offset.top += parseFloat(style.paddingTop) || 0;
        return offset;
    }

    function getOffset(element, offsetRoot) {
        const offset = isRectObject(element)
            ? { left: element.left, top: element.top }
            : Array.isArray(element)
                ? getOffsetFromDocument(element[0], element[1])
                : getOffsetFromDocument(element);
        if (offsetRoot && !isDocument(offsetRoot)) {
            const offsetShift = isRectObject(offsetRoot)
                ? offsetRoot
                : Array.isArray(offsetRoot)
                    ? getOffsetFromDocument(offsetRoot[0], offsetRoot[1])
                    : getOffsetFromDocument(offsetRoot);
            offset.left -= offsetShift.left;
            offset.top -= offsetShift.top;
        }
        return offset;
    }

    function getRect(element, offsetRoot) {
        let width = 0;
        let height = 0;
        if (isRectObject(element)) {
            width = element.width;
            height = element.height;
        }
        else if (Array.isArray(element)) {
            if (element[0] instanceof Element) {
                cacheBcr(element[0]);
            }
            width = getWidth(element[0], element[1]);
            height = getHeight(element[0], element[1]);
        }
        else {
            if (element instanceof Element) {
                cacheBcr(element);
            }
            width = getWidth(element);
            height = getHeight(element);
        }
        const offset = getOffset(element, offsetRoot);
        clearBcrCache();
        return Object.assign(Object.assign({ width,
            height }, offset), { right: offset.left + width, bottom: offset.top + height });
    }

    function getScrollbarSizes() {
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

    describe('dimensions: getWidth() and getHeight()', () => {
        beforeEach(beforeTest);
        afterEach(afterTest);
        const { width: sbWidth, height: sbHeight } = getScrollbarSizes();
        it(`should measure the document's width and height`, function () {
            const elWidth = 10000;
            const elHeight = 10000;
            let expectedWidth = 0;
            let expectedHeight = 0;
            const el = createTestElement({
                position: 'absolute',
                left: '0px',
                top: '0px',
                width: `${elWidth}px`,
                height: `${elHeight}px`,
            });
            expectedWidth = elWidth;
            expectedHeight = elHeight;
            chai.assert.strictEqual(getWidth(document, 'content'), expectedWidth, 'getWidth(document, "content")');
            chai.assert.strictEqual(getHeight(document, 'content'), expectedHeight, 'getHeight(document, "content")');
            chai.assert.strictEqual(getRect([document, 'content']).width, expectedWidth, 'getRect([document, "content"]).width');
            chai.assert.strictEqual(getRect([document, 'content']).height, expectedHeight, 'getRect([document, "content"]).height');
            chai.assert.strictEqual(getWidth(document, 'padding'), expectedWidth, 'getWidth(document, "padding")');
            chai.assert.strictEqual(getHeight(document, 'padding'), expectedHeight, 'getHeight(document, "padding")');
            chai.assert.strictEqual(getRect([document, 'padding']).width, expectedWidth, 'getRect([document, "padding"]).width');
            chai.assert.strictEqual(getRect([document, 'padding']).height, expectedHeight, 'getRect([document, "padding"]).height');
            expectedWidth = elWidth + window.innerWidth - document.documentElement.clientWidth;
            expectedHeight = elHeight + window.innerHeight - document.documentElement.clientHeight;
            chai.assert.strictEqual(getWidth(document, 'scroll'), expectedWidth, 'getWidth(document, "scroll")');
            chai.assert.strictEqual(getHeight(document, 'scroll'), expectedHeight, 'getHeight(document, "padding")');
            chai.assert.strictEqual(getRect([document, 'scroll']).width, expectedWidth, 'getRect([document, "scroll"]).width');
            chai.assert.strictEqual(getRect([document, 'scroll']).height, expectedHeight, 'getRect([document, "scroll"]).height');
            chai.assert.strictEqual(getWidth(document, 'border'), expectedWidth, 'getWidth(document, "border")');
            chai.assert.strictEqual(getHeight(document, 'border'), expectedHeight, 'getHeight(document, "border")');
            chai.assert.strictEqual(getRect([document, 'border']).width, expectedWidth, 'getRect([document, "border"]).width');
            chai.assert.strictEqual(getRect([document, 'border']).height, expectedHeight, 'getRect([document, "border"]).height');
            chai.assert.strictEqual(getWidth(document), expectedWidth, 'getWidth(document)');
            chai.assert.strictEqual(getHeight(document), expectedHeight, 'getHeight(document)');
            chai.assert.strictEqual(getRect(document).width, expectedWidth, 'getRect(document).width');
            chai.assert.strictEqual(getRect(document).height, expectedHeight, 'getRect(document).height');
            chai.assert.strictEqual(getWidth(document, 'margin'), expectedWidth, 'width - "margin"');
            chai.assert.strictEqual(getHeight(document, 'margin'), expectedHeight, 'height - "margin"');
            chai.assert.strictEqual(getRect([document, 'margin']).width, expectedWidth, 'getRect([document, "margin"]).width');
            chai.assert.strictEqual(getRect([document, 'margin']).height, expectedHeight, 'getRect([document, "margin"]).height');
            el.remove();
        });
        it(`should measure the window's width and height`, function () {
            let expectedWidth = 0;
            let expectedHeight = 0;
            document.documentElement.style.overflow = 'scroll';
            expectedWidth = document.documentElement.clientWidth;
            expectedHeight = document.documentElement.clientHeight;
            chai.assert.strictEqual(getWidth(window, 'content'), expectedWidth, 'width - "content"');
            chai.assert.strictEqual(getWidth(window, 'padding'), expectedWidth, 'width - "padding"');
            chai.assert.strictEqual(getHeight(window, 'content'), expectedHeight, 'height - "content"');
            chai.assert.strictEqual(getHeight(window, 'padding'), expectedHeight, 'height - "padding"');
            expectedWidth = window.innerWidth;
            expectedHeight = window.innerHeight;
            chai.assert.strictEqual(getWidth(window), expectedWidth, 'width - ""');
            chai.assert.strictEqual(getWidth(window, 'scroll'), expectedWidth, 'width - "scroll"');
            chai.assert.strictEqual(getWidth(window, 'border'), expectedWidth, 'width - "border"');
            chai.assert.strictEqual(getWidth(window, 'margin'), expectedWidth, 'width - "margin"');
            chai.assert.strictEqual(getHeight(window), expectedHeight, 'height - ""');
            chai.assert.strictEqual(getHeight(window, 'scroll'), expectedHeight, 'height - "scroll"');
            chai.assert.strictEqual(getHeight(window, 'border'), expectedHeight, 'height - "border"');
            chai.assert.strictEqual(getHeight(window, 'margin'), expectedHeight, 'height - "margin"');
        });
        it(`should measure element's width and height`, function () {
            const width = 50;
            const height = 50;
            const paddingLeft = 1;
            const paddingRight = 2;
            const paddingTop = 1;
            const paddingBottom = 2;
            const borderWidthRight = 3;
            const borderWidthLeft = 4;
            const borderWidthTop = 3;
            const borderWidthBottom = 4;
            const marginLeft = 5;
            const marginRight = 6;
            const marginTop = 5;
            const marginBottom = 6;
            const el = createTestElement({
                boxSizing: 'content-box',
                width: `${width}px`,
                height: `${height}px`,
                paddingLeft: `${paddingLeft}px`,
                paddingRight: `${paddingRight}px`,
                paddingTop: `${paddingTop}px`,
                paddingBottom: `${paddingBottom}px`,
                borderLeft: `${borderWidthLeft}px solid #000`,
                borderRight: `${borderWidthRight}px solid #000`,
                borderTop: `${borderWidthTop}px solid #000`,
                borderBottom: `${borderWidthBottom}px solid #000`,
                marginLeft: `${marginLeft}px`,
                marginRight: `${marginRight}px`,
                marginTop: `${marginTop}px`,
                marginBottom: `${marginBottom}px`,
                overflow: 'scroll',
            });
            const contentWidth = width - sbWidth;
            chai.assert.equal(getWidth(el, 'content'), contentWidth, 'width - "content"');
            const contentHeight = height - sbHeight;
            chai.assert.equal(getHeight(el, 'content'), contentHeight, 'height - "content"');
            const paddingWidth = contentWidth + paddingLeft + paddingRight;
            chai.assert.equal(getWidth(el, 'padding'), paddingWidth, 'width - "padding"');
            const paddingHeight = contentHeight + paddingTop + paddingBottom;
            chai.assert.equal(getHeight(el, 'padding'), paddingHeight, 'height - "padding"');
            const scrollWidth = paddingWidth + sbWidth;
            chai.assert.equal(getWidth(el, 'scroll'), scrollWidth, 'width - "scroll"');
            const scrollHeight = paddingHeight + sbHeight;
            chai.assert.equal(getHeight(el, 'scroll'), scrollHeight, 'height - "scroll"');
            const borderWidth = scrollWidth + borderWidthLeft + borderWidthRight;
            chai.assert.equal(getWidth(el, 'border'), borderWidth, 'width - "border"');
            chai.assert.equal(getWidth(el), borderWidth, 'width - ""');
            const borderHeight = scrollHeight + borderWidthTop + borderWidthBottom;
            chai.assert.equal(getHeight(el, 'border'), borderHeight, 'height - "border"');
            chai.assert.equal(getHeight(el), borderHeight, 'height - ""');
            const marginWidth = borderWidth + marginLeft + marginRight;
            chai.assert.equal(getWidth(el, 'margin'), marginWidth, 'width - "margin"');
            const marginHeight = borderHeight + marginTop + marginBottom;
            chai.assert.equal(getHeight(el, 'margin'), marginHeight, 'height - "margin"');
            el.remove();
        });
    });

}));