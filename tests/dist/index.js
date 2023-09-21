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
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        });
        return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }
    function afterTest() {
        document.getElementById('default-page-styles')?.remove();
        document.documentElement.removeAttribute('style');
        document.body.removeAttribute('style');
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        });
    }

    function createTestElement(styles = {}) {
        const el = document.createElement('div');
        Object.assign(el.style, { ...styles });
        document.body.appendChild(el);
        return el;
    }

    const STYLE_DECLARATION_CACHE = new WeakMap();
    /**
     * Returns element's CSS Style Declaration. Caches reference to the declaration
     * object weakly for faster access.
     */
    function getStyle(element) {
        let styleDeclaration = STYLE_DECLARATION_CACHE.get(element)?.deref();
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

    /**
     * Check if the current value is a document element.
     */
    function isDocumentElement(value) {
        return value instanceof HTMLHtmlElement;
    }

    /**
     * Check if the current value is a window.
     */
    function isWindow(value) {
        return value instanceof Window;
    }

    /**
     * Check if the current value is a document.
     */
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

    function getElementWidth(element, area = BOX_AREA.border) {
        let { width } = element.getBoundingClientRect();
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

    function getWidth(element, area = BOX_AREA.border) {
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

    function getElementHeight(element, area = BOX_AREA.border) {
        let { height } = element.getBoundingClientRect();
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

    function getHeight(element, area = BOX_AREA.border) {
        if (isWindow(element)) {
            return getWindowHeight(element, INCLUDE_SCROLLBAR[area]);
        }
        if (isDocument(element)) {
            return getDocumentHeight(element, INCLUDE_SCROLLBAR[area]);
        }
        return getElementHeight(element, area);
    }

    function isRectObject(value) {
        return value?.constructor === Object;
    }

    /**
     * Returns the element's (or window's) document offset, which in practice
     * means the vertical and horizontal distance between the element's northwest
     * corner and the document's northwest corner.
     */
    function getOffsetFromDocument(element, area = BOX_AREA.border) {
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
        const rect = element.getBoundingClientRect();
        offset.left += rect.left;
        offset.top += rect.top;
        if (area === BOX_AREA.border) {
            return offset;
        }
        const style = getStyle(element);
        if (area === BOX_AREA.margin) {
            offset.left -= Math.max(0, parseFloat(style.marginLeft) || 0);
            offset.top -= Math.max(0, parseFloat(style.marginTop) || 0);
            return offset;
        }
        offset.left += parseFloat(style.borderLeftWidth) || 0;
        offset.top += parseFloat(style.borderTopWidth) || 0;
        if (area === BOX_AREA.scroll || area === BOX_AREA.padding) {
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

    const { width: sbWidth } = getScrollbarSizes();
    describe('getWidth()', function () {
        beforeEach(beforeTest);
        afterEach(afterTest);
        describe('document', function () {
            const elWidth = 10000;
            const elHeight = 10000;
            beforeEach(function () {
                createTestElement({
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: `${elWidth}px`,
                    height: `${elHeight}px`,
                });
            });
            it('should measure content width', function () {
                chai.assert.strictEqual(getWidth(document, 'content'), elWidth);
            });
            it('should measure padding width', function () {
                chai.assert.strictEqual(getWidth(document, 'padding'), elWidth);
            });
            it('should measure scroll width', function () {
                const expectedWidth = elWidth + window.innerWidth - document.documentElement.clientWidth;
                chai.assert.strictEqual(getWidth(document, 'scroll'), expectedWidth);
            });
            it('should measure default width', function () {
                const expectedWidth = elWidth + window.innerWidth - document.documentElement.clientWidth;
                chai.assert.strictEqual(getWidth(document), expectedWidth, 'default');
            });
            it('should measure border width', function () {
                const expectedWidth = elWidth + window.innerWidth - document.documentElement.clientWidth;
                chai.assert.strictEqual(getWidth(document, 'border'), expectedWidth, 'border');
            });
            it('should measure margin width', function () {
                const expectedWidth = elWidth + window.innerWidth - document.documentElement.clientWidth;
                chai.assert.strictEqual(getWidth(document, 'margin'), expectedWidth);
            });
        });
        describe('window', function () {
            it('should measure width without scrollbar', function () {
                document.documentElement.style.overflow = 'scroll';
                const expectedWidth = document.documentElement.clientWidth;
                chai.assert.strictEqual(getWidth(window, 'content'), expectedWidth, 'content');
                chai.assert.strictEqual(getWidth(window, 'padding'), expectedWidth, 'padding');
            });
            it('should measure width with scrollbar', function () {
                const expectedWidth = window.innerWidth;
                chai.assert.strictEqual(getWidth(window, 'scroll'), expectedWidth, 'scroll');
                chai.assert.strictEqual(getWidth(window), expectedWidth, 'default');
                chai.assert.strictEqual(getWidth(window, 'border'), expectedWidth, 'border');
                chai.assert.strictEqual(getWidth(window, 'margin'), expectedWidth, 'margin');
            });
        });
        describe('element', function () {
            const testElementDimensions = (boxSizing) => {
                let el;
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
                beforeEach(function () {
                    el = createTestElement({
                        boxSizing: boxSizing,
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
                });
                it(`should measure content width for ${boxSizing}`, function () {
                    const expectedWidth = boxSizing === 'content-box'
                        ? width - sbWidth
                        : width - sbWidth - paddingLeft - paddingRight - borderWidthLeft - borderWidthRight;
                    chai.assert.equal(getWidth(el, 'content'), expectedWidth, `content - ${boxSizing}`);
                });
                it(`should measure padding width for ${boxSizing}`, function () {
                    const expectedWidth = boxSizing === 'content-box'
                        ? width - sbWidth + paddingLeft + paddingRight
                        : width - sbWidth - borderWidthLeft - borderWidthRight;
                    chai.assert.equal(getWidth(el, 'padding'), expectedWidth, `padding - ${boxSizing}`);
                });
                it(`should measure scroll width for ${boxSizing}`, function () {
                    const expectedWidth = boxSizing === 'content-box'
                        ? width + paddingLeft + paddingRight
                        : width - borderWidthLeft - borderWidthRight;
                    chai.assert.equal(getWidth(el, 'scroll'), expectedWidth, `scroll - ${boxSizing}`);
                });
                it(`should measure default width for ${boxSizing}`, function () {
                    const expectedWidth = boxSizing === 'content-box'
                        ? width + paddingLeft + paddingRight + borderWidthLeft + borderWidthRight
                        : width;
                    chai.assert.equal(getWidth(el), expectedWidth, `default - ${boxSizing}`);
                });
                it(`should measure border width for ${boxSizing}`, function () {
                    const expectedWidth = boxSizing === 'content-box'
                        ? width + paddingLeft + paddingRight + borderWidthLeft + borderWidthRight
                        : width;
                    chai.assert.equal(getWidth(el, 'border'), expectedWidth, `border - ${boxSizing}`);
                });
                it(`should measure margin width for ${boxSizing}`, function () {
                    const expectedWidth = boxSizing === 'content-box'
                        ? width +
                            paddingLeft +
                            paddingRight +
                            borderWidthLeft +
                            borderWidthRight +
                            marginLeft +
                            marginRight
                        : width + marginLeft + marginRight;
                    chai.assert.equal(getWidth(el, 'margin'), expectedWidth, `margin - ${boxSizing}`);
                });
            };
            describe('content-box', function () {
                testElementDimensions('content-box');
            });
            describe('border-box', function () {
                testElementDimensions('border-box');
            });
        });
    });

    const { height: sbHeight } = getScrollbarSizes();
    describe('getHeight()', function () {
        beforeEach(beforeTest);
        afterEach(afterTest);
        describe('document', function () {
            const elWidth = 10000;
            const elHeight = 10000;
            beforeEach(function () {
                createTestElement({
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: `${elWidth}px`,
                    height: `${elHeight}px`,
                });
            });
            it('should measure content height', function () {
                chai.assert.strictEqual(getHeight(document, 'content'), elHeight);
            });
            it('should measure padding height', function () {
                chai.assert.strictEqual(getHeight(document, 'padding'), elHeight);
            });
            it('should measure scroll height', function () {
                const expectedHeight = elHeight + window.innerHeight - document.documentElement.clientHeight;
                chai.assert.strictEqual(getHeight(document, 'scroll'), expectedHeight);
            });
            it('should measure default height', function () {
                const expectedHeight = elHeight + window.innerHeight - document.documentElement.clientHeight;
                chai.assert.strictEqual(getHeight(document), expectedHeight, 'default');
            });
            it('should measure border height', function () {
                const expectedHeight = elHeight + window.innerHeight - document.documentElement.clientHeight;
                chai.assert.strictEqual(getHeight(document, 'border'), expectedHeight, 'border');
            });
            it('should measure margin height', function () {
                const expectedHeight = elHeight + window.innerHeight - document.documentElement.clientHeight;
                chai.assert.strictEqual(getHeight(document, 'margin'), expectedHeight);
            });
        });
        describe('window', function () {
            it('should measure height without scrollbar', function () {
                document.documentElement.style.overflow = 'scroll';
                const expectedHeight = document.documentElement.clientHeight;
                chai.assert.strictEqual(getHeight(window, 'content'), expectedHeight, 'content');
                chai.assert.strictEqual(getHeight(window, 'padding'), expectedHeight, 'padding');
            });
            it('should measure height with scrollbar', function () {
                const expectedHeight = window.innerHeight;
                chai.assert.strictEqual(getHeight(window, 'scroll'), expectedHeight, 'scroll');
                chai.assert.strictEqual(getHeight(window), expectedHeight, 'default');
                chai.assert.strictEqual(getHeight(window, 'border'), expectedHeight, 'border');
                chai.assert.strictEqual(getHeight(window, 'margin'), expectedHeight, 'margin');
            });
        });
        describe('element', function () {
            const testElementDimensions = (boxSizing) => {
                let el;
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
                beforeEach(function () {
                    el = createTestElement({
                        boxSizing: boxSizing,
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
                });
                it(`should measure content height for ${boxSizing}`, function () {
                    const expectedHeight = boxSizing === 'content-box'
                        ? height - sbHeight
                        : height - sbHeight - paddingTop - paddingBottom - borderWidthTop - borderWidthBottom;
                    chai.assert.equal(getHeight(el, 'content'), expectedHeight, `content - ${boxSizing}`);
                });
                it(`should measure padding height for ${boxSizing}`, function () {
                    const expectedHeight = boxSizing === 'content-box'
                        ? height - sbHeight + paddingTop + paddingBottom
                        : height - sbHeight - borderWidthTop - borderWidthBottom;
                    chai.assert.equal(getHeight(el, 'padding'), expectedHeight, `padding - ${boxSizing}`);
                });
                it(`should measure scroll height for ${boxSizing}`, function () {
                    const expectedHeight = boxSizing === 'content-box'
                        ? height + paddingTop + paddingBottom
                        : height - borderWidthTop - borderWidthBottom;
                    chai.assert.equal(getHeight(el, 'scroll'), expectedHeight, `scroll - ${boxSizing}`);
                });
                it(`should measure default height for ${boxSizing}`, function () {
                    const expectedHeight = boxSizing === 'content-box'
                        ? height + paddingTop + paddingBottom + borderWidthTop + borderWidthBottom
                        : height;
                    chai.assert.equal(getHeight(el), expectedHeight, `default - ${boxSizing}`);
                });
                it(`should measure border height for ${boxSizing}`, function () {
                    const expectedHeight = boxSizing === 'content-box'
                        ? height + paddingTop + paddingBottom + borderWidthTop + borderWidthBottom
                        : height;
                    chai.assert.equal(getHeight(el, 'border'), expectedHeight, `border - ${boxSizing}`);
                });
                it(`should measure margin height for ${boxSizing}`, function () {
                    const expectedHeight = boxSizing === 'content-box'
                        ? height +
                            paddingTop +
                            paddingBottom +
                            borderWidthTop +
                            borderWidthBottom +
                            marginLeft +
                            marginRight
                        : height + marginLeft + marginRight;
                    chai.assert.equal(getHeight(el, 'margin'), expectedHeight, `margin - ${boxSizing}`);
                });
            };
            describe('content-box', function () {
                testElementDimensions('content-box');
            });
            describe('border-box', function () {
                testElementDimensions('border-box');
            });
        });
    });

    describe('getOffset()', function () {
        beforeEach(beforeTest);
        afterEach(afterTest);
        describe('document', function () {
            it('should return correct offset without scrolling', function () {
                const actual = getOffset(document);
                const expected = { left: 0, top: 0 };
                chai.assert.deepEqual(actual, expected);
            });
            it('should return correct offset with scrolling', function () {
                createTestElement({
                    width: 'calc(100vw + 200px)',
                    height: 'calc(100vh + 200px)',
                });
                window.scrollTo({ left: 50, top: 100, behavior: 'instant' });
                const actual = getOffset(document);
                const expected = { left: 0, top: 0 };
                chai.assert.deepEqual(actual, expected);
            });
        });
        describe('window', function () {
            it('should return correct offset without scrolling', function () {
                const actual = getOffset(window);
                const expected = { left: 0, top: 0 };
                chai.assert.deepEqual(actual, expected);
            });
            it('should return correct offset with scrolling', function () {
                createTestElement({
                    width: 'calc(100vw + 200px)',
                    height: 'calc(100vh + 200px)',
                });
                window.scrollTo({ left: 50, top: 100, behavior: 'instant' });
                const actual = getOffset(window);
                const expected = { left: 50, top: 100 };
                chai.assert.deepEqual(actual, expected);
            });
        });
        // TODO: Fix shitty math by ChatGPT!
        describe('element', function () {
            beforeEach(beforeTest);
            afterEach(afterTest);
            let elA;
            let elB;
            const width = 60;
            const height = 70;
            const left = 100;
            const top = 200;
            const scrollLeft = 300;
            const scrollTop = 400;
            const paddingLeft = 1;
            const paddingRight = 2;
            const paddingTop = 3;
            const paddingBottom = 4;
            const borderLeft = 5;
            const borderRight = 6;
            const borderTop = 7;
            const borderBottom = 8;
            const marginLeft = 9;
            const marginRight = 10;
            const marginTop = 11;
            const marginBottom = 12;
            const elBContainerLeft = 75;
            const elBContainerTop = 85;
            beforeEach(function () {
                // Make document scrollable.
                document.body.style.position = 'relative';
                document.body.style.overflow = 'auto';
                document.body.style.width = '100vw';
                document.body.style.height = '100vh';
                // Add element to body, which is bigger than viewport.
                createTestElement({
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: 'calc(100vw + 1000px)',
                    height: 'calc(100vh + 1000px)',
                });
                // Create eleemnt base styles.
                const baseStyles = {
                    position: 'absolute',
                    boxSizing: 'content-box',
                    left: `${left}px`,
                    top: `${top}px`,
                    width: `${width}px`,
                    height: `${height}px`,
                    paddingLeft: `${paddingLeft}px`,
                    paddingRight: `${paddingRight}px`,
                    paddingTop: `${paddingTop}px`,
                    paddingBottom: `${paddingBottom}px`,
                    borderLeft: `${borderLeft}px solid #000`,
                    borderRight: `${borderRight}px solid #000`,
                    borderTop: `${borderTop}px solid #000`,
                    borderBottom: `${borderBottom}px solid #000`,
                    marginLeft: `${marginLeft}px`,
                    marginRight: `${marginRight}px`,
                    marginTop: `${marginTop}px`,
                    marginBottom: `${marginBottom}px`,
                };
                // Create element A.
                elA = createTestElement({
                    ...baseStyles,
                });
                // Create element B.
                elB = createTestElement({
                    ...baseStyles,
                });
                // Append element B to a container, which is offset from body.
                createTestElement({
                    position: 'absolute',
                    left: `${elBContainerLeft}px`,
                    top: `${elBContainerTop}px`,
                }).appendChild(elB);
                // Scroll the body.
                window.scrollTo({
                    left: scrollLeft,
                    top: scrollTop,
                    behavior: 'instant',
                });
            });
            describe('element -> document', function () {
                it(`should measure element's content offset from document`, function () {
                    const actual = getOffset([elA, 'content']);
                    const expected = {
                        left: left + marginLeft + borderLeft + paddingLeft,
                        top: top + marginTop + borderTop + paddingTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure element's padding offset from document`, function () {
                    const actual = getOffset([elA, 'padding']);
                    const expected = {
                        left: left + marginLeft + borderLeft,
                        top: top + marginTop + borderTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure element's scroll offset from document`, function () {
                    const actual = getOffset([elA, 'scroll']);
                    const expected = {
                        left: left + marginLeft + borderLeft,
                        top: top + marginTop + borderTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure element's border offset from document`, function () {
                    const actual = getOffset([elA, 'border']);
                    const expected = {
                        left: left + marginLeft,
                        top: top + marginTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure element's margin offset from document`, function () {
                    const actual = getOffset([elA, 'margin']);
                    const expected = {
                        left: left,
                        top: top,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
            });
            describe('element -> window', function () {
                it(`should measure element's content offset from window`, function () {
                    const actual = getOffset([elA, 'content'], window);
                    const expected = {
                        left: left + marginLeft + borderLeft + paddingLeft - scrollLeft,
                        top: top + marginTop + borderTop + paddingTop - scrollTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure element's padding offset from window`, function () {
                    const actual = getOffset([elA, 'padding'], window);
                    const expected = {
                        left: left + marginLeft + borderLeft - scrollLeft,
                        top: top + marginTop + borderTop - scrollTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure element's scroll offset from window`, function () {
                    const actual = getOffset([elA, 'scroll'], window);
                    const expected = {
                        left: left + marginLeft + borderLeft - scrollLeft,
                        top: top + marginTop + borderTop - scrollTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure element's default (border) offset from window`, function () {
                    const actual = getOffset(elA, window);
                    const expected = {
                        left: left + marginLeft - scrollLeft,
                        top: top + marginTop - scrollTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure element's border offset from window`, function () {
                    const actual = getOffset([elA, 'border'], window);
                    const expected = {
                        left: left + marginLeft - scrollLeft,
                        top: top + marginTop - scrollTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure element's margin offset from window`, function () {
                    const actual = getOffset([elA, 'margin'], window);
                    const expected = {
                        left: left - scrollLeft,
                        top: top - scrollTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
            });
            describe('element -> element', function () {
                it(`should measure content -> content offset`, function () {
                    const actual = getOffset([elA, 'content'], [elB, 'content']);
                    const expected = {
                        left: -elBContainerLeft,
                        top: -elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure content -> padding offset`, function () {
                    const actual = getOffset([elA, 'content'], [elB, 'padding']);
                    const expected = {
                        left: paddingLeft - elBContainerLeft,
                        top: paddingTop - elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure content -> scroll offset`, function () {
                    const actual = getOffset([elA, 'content'], [elB, 'scroll']);
                    const expected = {
                        left: paddingLeft - elBContainerLeft,
                        top: paddingTop - elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure content -> default (border) offset`, function () {
                    const actual = getOffset([elA, 'content'], elB);
                    const expected = {
                        left: paddingLeft + borderLeft - elBContainerLeft,
                        top: paddingTop + borderTop - elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure content -> border offset`, function () {
                    const actual = getOffset([elA, 'content'], [elB, 'border']);
                    const expected = {
                        left: paddingLeft + borderLeft - elBContainerLeft,
                        top: paddingTop + borderTop - elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure content -> margin offset`, function () {
                    const actual = getOffset([elA, 'content'], [elB, 'margin']);
                    const expected = {
                        left: paddingLeft + borderLeft + marginLeft - elBContainerLeft,
                        top: paddingTop + borderTop + marginTop - elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure padding -> content offset`, function () {
                    const actual = getOffset([elA, 'padding'], [elB, 'content']);
                    const expected = {
                        left: -(elBContainerLeft + paddingLeft),
                        top: -(elBContainerTop + paddingTop),
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure padding -> padding offset`, function () {
                    const actual = getOffset([elA, 'padding'], [elB, 'padding']);
                    const expected = {
                        left: -elBContainerLeft,
                        top: -elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure padding -> scroll offset`, function () {
                    const actual = getOffset([elA, 'padding'], [elB, 'scroll']);
                    const expected = {
                        left: -elBContainerLeft,
                        top: -elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure padding -> default (border) offset`, function () {
                    const actual = getOffset([elA, 'padding'], elB);
                    const expected = {
                        left: borderLeft - elBContainerLeft,
                        top: borderTop - elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure padding -> border offset`, function () {
                    const actual = getOffset([elA, 'padding'], [elB, 'border']);
                    const expected = {
                        left: borderLeft - elBContainerLeft,
                        top: borderTop - elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure padding -> margin offset`, function () {
                    const actual = getOffset([elA, 'padding'], [elB, 'margin']);
                    const expected = {
                        left: borderLeft + marginLeft - elBContainerLeft,
                        top: borderTop + marginTop - elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
            });
        });
    });

}));
