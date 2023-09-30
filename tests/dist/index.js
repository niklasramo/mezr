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

    const IS_BROWSER$1 = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    const IS_SAFARI$1 = !!(IS_BROWSER$1 &&
        navigator.vendor &&
        navigator.vendor.indexOf('Apple') > -1 &&
        navigator.userAgent &&
        navigator.userAgent.indexOf('CriOS') == -1 &&
        navigator.userAgent.indexOf('FxiOS') == -1);
    const BOX_EDGE = {
        content: 'content',
        padding: 'padding',
        scroll: 'scroll',
        border: 'border',
        margin: 'margin',
    };
    const INCLUDE_SCROLLBAR = {
        [BOX_EDGE.content]: false,
        [BOX_EDGE.padding]: false,
        [BOX_EDGE.scroll]: true,
        [BOX_EDGE.border]: true,
        [BOX_EDGE.margin]: true,
    };

    function isBlockElement(element) {
        switch (getStyle(element).display) {
            case 'none':
                return null;
            case 'inline':
            case 'contents':
                return false;
            default:
                return true;
        }
    }

    function isContainingBlockForFixedElement(element) {
        const style = getStyle(element);
        // If the element has any kind of filter applied or prepared via will-change
        // it is a containing block, even if it's not a block element. Note that this
        // does not apply to Safari, which interestingly does not create a containing
        // block for elements with filters applied, even if they are block-level.
        if (!IS_SAFARI$1) {
            const { filter } = style;
            if (filter && filter !== 'none') {
                return true;
            }
            const { backdropFilter } = style;
            if (backdropFilter && backdropFilter !== 'none') {
                return true;
            }
            const { willChange } = style;
            if (willChange &&
                (willChange.indexOf('filter') > -1 || willChange.indexOf('backdrop-filter') > -1)) {
                return true;
            }
        }
        // The rest of the checks require the element to be a block element.
        const isBlock = isBlockElement(element);
        if (!isBlock)
            return isBlock;
        // If the element is transformed it is a containing block.
        const { transform } = style;
        if (transform && transform !== 'none') {
            return true;
        }
        // If the element has perspective it is a containing block.
        const { perspective } = style;
        if (perspective && perspective !== 'none') {
            return true;
        }
        // If the element's content-visibility is "auto" or "hidden" it is a
        // containing block.
        // Note: this feature does not exist on Safari yet, so this check might
        // break when they start supporting it (depending on how they implement it).
        // @ts-ignore
        const { contentVisibility } = style;
        if (contentVisibility && contentVisibility === 'auto') {
            return true;
        }
        // If the element's contain style includes "paint" or "layout" it is a
        // containing block. Note that the values "strict" and "content" are
        // shorthands which include either "paint" or "layout".
        const { contain } = style;
        if (contain &&
            (contain === 'strict' ||
                contain === 'content' ||
                contain.indexOf('paint') > -1 ||
                contain.indexOf('layout') > -1)) {
            return true;
        }
        // Some will-change values cause the element to become a containing block
        // for block-level elements.
        const { willChange } = style;
        if (willChange &&
            (willChange.indexOf('transform') > -1 ||
                willChange.indexOf('perspective') > -1 ||
                willChange.indexOf('contain') > -1)) {
            return true;
        }
        // For Safari we need to do this extra check here which we already did for
        // other browsers above. Safari creates a containing block when will-change
        // includes "filter" for block-level elements, but not for inline-level.
        if (IS_SAFARI$1 && willChange && willChange.indexOf('filter') > -1) {
            return true;
        }
        return false;
    }

    function isContainingBlockForAbsoluteElement(element) {
        // The first thing to check is the element's position. If it's anything else
        // than "static" the element is a containing block.
        if (getStyle(element).position !== 'static') {
            return true;
        }
        // At this point the same rules apply as for fixed elements.
        return isContainingBlockForFixedElement(element);
    }

    /**
     * Check if the current value is a document element.
     */
    function isDocumentElement(value) {
        return value instanceof HTMLHtmlElement;
    }

    /**
     * Returns the element's containing block, meaning the ancestor element which
     * the target element's percentage-based
     * width/height/left/right/top/bottom/padding/margin properties are relative to
     * (i.e the final pixel amount of the those percentage-based properties is
     * computed based on the containing block's widht/height).
     * https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
     */
    function getContainingBlock(element, options = {}) {
        // Document element's containing block is always the window. It actually can't
        // be set to "display:inline".
        if (isDocumentElement(element)) {
            return element.ownerDocument.defaultView;
        }
        // Parse options.
        const position = options.position || getStyle(element).position;
        const { skipDisplayNone } = options;
        switch (position) {
            case 'static':
            case 'relative':
            case 'sticky':
            case '-webkit-sticky': {
                let containingBlock = element.parentElement;
                while (containingBlock) {
                    const isBlock = isBlockElement(containingBlock);
                    if (isBlock)
                        return containingBlock;
                    if (isBlock === null && !skipDisplayNone)
                        return null;
                    containingBlock = containingBlock.parentElement;
                }
                return element.ownerDocument.documentElement;
            }
            case 'absolute':
            case 'fixed': {
                const isFixed = position === 'fixed';
                let containingBlock = element.parentElement;
                while (containingBlock) {
                    const isContainingBlock = isFixed
                        ? isContainingBlockForFixedElement(containingBlock)
                        : isContainingBlockForAbsoluteElement(containingBlock);
                    if (isContainingBlock === true)
                        return containingBlock;
                    if (isContainingBlock === null && !skipDisplayNone)
                        return null;
                    containingBlock = containingBlock.parentElement;
                }
                return element.ownerDocument.defaultView;
            }
            // For any other values we return null.
            default: {
                return null;
            }
        }
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

    function getElementWidth(element, boxEdge = BOX_EDGE.border) {
        let { width } = element.getBoundingClientRect();
        if (boxEdge === BOX_EDGE.border) {
            return width;
        }
        const style = getStyle(element);
        if (boxEdge === BOX_EDGE.margin) {
            width += Math.max(0, parseFloat(style.marginLeft) || 0);
            width += Math.max(0, parseFloat(style.marginRight) || 0);
            return width;
        }
        width -= parseFloat(style.borderLeftWidth) || 0;
        width -= parseFloat(style.borderRightWidth) || 0;
        if (boxEdge === BOX_EDGE.scroll) {
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
        if (boxEdge === BOX_EDGE.padding) {
            return width;
        }
        width -= parseFloat(style.paddingLeft) || 0;
        width -= parseFloat(style.paddingRight) || 0;
        return width;
    }

    function getWidth(element, boxEdge = BOX_EDGE.border) {
        if (isWindow(element)) {
            return getWindowWidth(element, INCLUDE_SCROLLBAR[boxEdge]);
        }
        if (isDocument(element)) {
            return getDocumentWidth(element, INCLUDE_SCROLLBAR[boxEdge]);
        }
        return getElementWidth(element, boxEdge);
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

    function getElementHeight(element, boxEdge = BOX_EDGE.border) {
        let { height } = element.getBoundingClientRect();
        if (boxEdge === BOX_EDGE.border) {
            return height;
        }
        const style = getStyle(element);
        if (boxEdge === BOX_EDGE.margin) {
            height += Math.max(0, parseFloat(style.marginTop) || 0);
            height += Math.max(0, parseFloat(style.marginBottom) || 0);
            return height;
        }
        height -= parseFloat(style.borderTopWidth) || 0;
        height -= parseFloat(style.borderBottomWidth) || 0;
        if (boxEdge === BOX_EDGE.scroll) {
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
        if (boxEdge === BOX_EDGE.padding) {
            return height;
        }
        height -= parseFloat(style.paddingTop) || 0;
        height -= parseFloat(style.paddingBottom) || 0;
        return height;
    }

    function getHeight(element, boxEdge = BOX_EDGE.border) {
        if (isWindow(element)) {
            return getWindowHeight(element, INCLUDE_SCROLLBAR[boxEdge]);
        }
        if (isDocument(element)) {
            return getDocumentHeight(element, INCLUDE_SCROLLBAR[boxEdge]);
        }
        return getElementHeight(element, boxEdge);
    }

    function isRectObject(value) {
        return value?.constructor === Object;
    }

    /**
     * Returns the element's (or window's) document offset, which in practice
     * means the vertical and horizontal distance between the element's northwest
     * corner and the document's northwest corner.
     */
    function getOffsetFromDocument(element, boxEdge = BOX_EDGE.border) {
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
        if (boxEdge === BOX_EDGE.border) {
            return offset;
        }
        const style = getStyle(element);
        if (boxEdge === BOX_EDGE.margin) {
            offset.left -= Math.max(0, parseFloat(style.marginLeft) || 0);
            offset.top -= Math.max(0, parseFloat(style.marginTop) || 0);
            return offset;
        }
        offset.left += parseFloat(style.borderLeftWidth) || 0;
        offset.top += parseFloat(style.borderTopWidth) || 0;
        if (boxEdge === BOX_EDGE.scroll || boxEdge === BOX_EDGE.padding) {
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
            const elWidth = 9000;
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
            it('should measure width without scrollbar', function () {
                const expected = elWidth;
                chai.assert.strictEqual(getWidth(document, 'content'), expected, 'content');
                chai.assert.strictEqual(getWidth(document, 'padding'), expected, 'padding');
            });
            it('should measure height with scrollbar', function () {
                const expected = elWidth + window.innerWidth - document.documentElement.clientWidth;
                chai.assert.strictEqual(getWidth(document, 'scroll'), expected, 'scroll');
                chai.assert.strictEqual(getWidth(document), expected, 'default');
                chai.assert.strictEqual(getWidth(document, 'border'), expected, 'border');
                chai.assert.strictEqual(getWidth(document, 'margin'), expected, 'margin');
            });
        });
        describe('window', function () {
            it('should measure width without scrollbar', function () {
                document.documentElement.style.overflow = 'scroll';
                const expected = document.documentElement.clientWidth;
                chai.assert.strictEqual(getWidth(window, 'content'), expected, 'content');
                chai.assert.strictEqual(getWidth(window, 'padding'), expected, 'padding');
            });
            it('should measure width with scrollbar', function () {
                const expected = window.innerWidth;
                chai.assert.strictEqual(getWidth(window, 'scroll'), expected, 'scroll');
                chai.assert.strictEqual(getWidth(window), expected, 'default');
                chai.assert.strictEqual(getWidth(window, 'border'), expected, 'border');
                chai.assert.strictEqual(getWidth(window, 'margin'), expected, 'margin');
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
                    const actual = getWidth(el, 'content');
                    const expected = boxSizing === 'content-box'
                        ? width - sbWidth
                        : width - sbWidth - paddingLeft - paddingRight - borderWidthLeft - borderWidthRight;
                    chai.assert.equal(actual, expected, `content - ${boxSizing}`);
                });
                it(`should measure padding width for ${boxSizing}`, function () {
                    const actual = getWidth(el, 'padding');
                    const expected = boxSizing === 'content-box'
                        ? width - sbWidth + paddingLeft + paddingRight
                        : width - sbWidth - borderWidthLeft - borderWidthRight;
                    chai.assert.equal(actual, expected, `padding - ${boxSizing}`);
                });
                it(`should measure scroll width for ${boxSizing}`, function () {
                    const actual = getWidth(el, 'scroll');
                    const expected = boxSizing === 'content-box'
                        ? width + paddingLeft + paddingRight
                        : width - borderWidthLeft - borderWidthRight;
                    chai.assert.equal(actual, expected, `scroll - ${boxSizing}`);
                });
                it(`should measure default width for ${boxSizing}`, function () {
                    const actual = getWidth(el);
                    const expected = boxSizing === 'content-box'
                        ? width + paddingLeft + paddingRight + borderWidthLeft + borderWidthRight
                        : width;
                    chai.assert.equal(actual, expected, `default - ${boxSizing}`);
                });
                it(`should measure border width for ${boxSizing}`, function () {
                    const actual = getWidth(el, 'border');
                    const expected = boxSizing === 'content-box'
                        ? width + paddingLeft + paddingRight + borderWidthLeft + borderWidthRight
                        : width;
                    chai.assert.equal(actual, expected, `border - ${boxSizing}`);
                });
                it(`should measure margin width for ${boxSizing}`, function () {
                    const actual = getWidth(el, 'margin');
                    const expected = boxSizing === 'content-box'
                        ? width +
                            paddingLeft +
                            paddingRight +
                            borderWidthLeft +
                            borderWidthRight +
                            marginLeft +
                            marginRight
                        : width + marginLeft + marginRight;
                    chai.assert.equal(actual, expected, `margin - ${boxSizing}`);
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
            const elWidth = 9000;
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
            it('should measure height without scrollbar', function () {
                const expected = elHeight;
                chai.assert.strictEqual(getHeight(document, 'content'), expected, 'content');
                chai.assert.strictEqual(getHeight(document, 'padding'), expected, 'padding');
            });
            it('should measure height with scrollbar', function () {
                const expected = elHeight + window.innerHeight - document.documentElement.clientHeight;
                chai.assert.strictEqual(getHeight(document, 'scroll'), expected, 'scroll');
                chai.assert.strictEqual(getHeight(document, 'border'), expected, 'border');
                chai.assert.strictEqual(getHeight(document, 'margin'), expected, 'margin');
            });
        });
        describe('window', function () {
            it('should measure height without scrollbar', function () {
                document.documentElement.style.overflow = 'scroll';
                const expected = document.documentElement.clientHeight;
                chai.assert.strictEqual(getHeight(window, 'content'), expected, 'content');
                chai.assert.strictEqual(getHeight(window, 'padding'), expected, 'padding');
            });
            it('should measure height with scrollbar', function () {
                const expected = window.innerHeight;
                chai.assert.strictEqual(getHeight(window, 'scroll'), expected, 'scroll');
                chai.assert.strictEqual(getHeight(window), expected, 'default');
                chai.assert.strictEqual(getHeight(window, 'border'), expected, 'border');
                chai.assert.strictEqual(getHeight(window, 'margin'), expected, 'margin');
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
                    const actual = getHeight(el, 'content');
                    const expected = boxSizing === 'content-box'
                        ? height - sbHeight
                        : height - sbHeight - paddingTop - paddingBottom - borderWidthTop - borderWidthBottom;
                    chai.assert.equal(actual, expected, `content - ${boxSizing}`);
                });
                it(`should measure padding height for ${boxSizing}`, function () {
                    const actual = getHeight(el, 'padding');
                    const expected = boxSizing === 'content-box'
                        ? height - sbHeight + paddingTop + paddingBottom
                        : height - sbHeight - borderWidthTop - borderWidthBottom;
                    chai.assert.equal(actual, expected, `padding - ${boxSizing}`);
                });
                it(`should measure scroll height for ${boxSizing}`, function () {
                    const actual = getHeight(el, 'scroll');
                    const expected = boxSizing === 'content-box'
                        ? height + paddingTop + paddingBottom
                        : height - borderWidthTop - borderWidthBottom;
                    chai.assert.equal(actual, expected, `scroll - ${boxSizing}`);
                });
                it(`should measure default height for ${boxSizing}`, function () {
                    const actual = getHeight(el);
                    const expected = boxSizing === 'content-box'
                        ? height + paddingTop + paddingBottom + borderWidthTop + borderWidthBottom
                        : height;
                    chai.assert.equal(actual, expected, `default - ${boxSizing}`);
                });
                it(`should measure border height for ${boxSizing}`, function () {
                    const actual = getHeight(el, 'border');
                    const expected = boxSizing === 'content-box'
                        ? height + paddingTop + paddingBottom + borderWidthTop + borderWidthBottom
                        : height;
                    chai.assert.equal(actual, expected, `border - ${boxSizing}`);
                });
                it(`should measure margin height for ${boxSizing}`, function () {
                    const actual = getHeight(el, 'margin');
                    const expected = boxSizing === 'content-box'
                        ? height +
                            paddingTop +
                            paddingBottom +
                            borderWidthTop +
                            borderWidthBottom +
                            marginLeft +
                            marginRight
                        : height + marginLeft + marginRight;
                    chai.assert.equal(actual, expected, `margin - ${boxSizing}`);
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
            describe('element (content) -> element (all variations)', function () {
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
            });
            describe('element (padding) -> element (all variations)', function () {
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
            describe('element (scroll) -> element (all variations)', function () {
                it(`should measure scroll -> content offset`, function () {
                    const actual = getOffset([elA, 'scroll'], [elB, 'content']);
                    const expected = {
                        left: -(elBContainerLeft + paddingLeft),
                        top: -(elBContainerTop + paddingTop),
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure scroll -> padding offset`, function () {
                    const actual = getOffset([elA, 'scroll'], [elB, 'padding']);
                    const expected = {
                        left: -elBContainerLeft,
                        top: -elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure scroll -> scroll offset`, function () {
                    const actual = getOffset([elA, 'scroll'], [elB, 'scroll']);
                    const expected = {
                        left: -elBContainerLeft,
                        top: -elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure scroll -> default (border) offset`, function () {
                    const actual = getOffset([elA, 'scroll'], elB);
                    const expected = {
                        left: borderLeft - elBContainerLeft,
                        top: borderTop - elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure scroll -> border offset`, function () {
                    const actual = getOffset([elA, 'scroll'], [elB, 'border']);
                    const expected = {
                        left: borderLeft - elBContainerLeft,
                        top: borderTop - elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure scroll -> margin offset`, function () {
                    const actual = getOffset([elA, 'scroll'], [elB, 'margin']);
                    const expected = {
                        left: borderLeft + marginLeft - elBContainerLeft,
                        top: borderTop + marginTop - elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
            });
            describe('element (border) -> element (all variations)', function () {
                it(`should measure border -> content offset`, function () {
                    const actual = getOffset([elA, 'border'], [elB, 'content']);
                    const expected = {
                        left: -(elBContainerLeft + paddingLeft + borderLeft),
                        top: -(elBContainerTop + paddingTop + borderTop),
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure border -> padding offset`, function () {
                    const actual = getOffset([elA, 'border'], [elB, 'padding']);
                    const expected = {
                        left: -(elBContainerLeft + borderLeft),
                        top: -(elBContainerTop + borderTop),
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure border -> scroll offset`, function () {
                    const actual = getOffset([elA, 'border'], [elB, 'scroll']);
                    const expected = {
                        left: -(elBContainerLeft + borderLeft),
                        top: -(elBContainerTop + borderTop),
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure border -> default (border) offset`, function () {
                    const actual = getOffset([elA, 'border'], elB);
                    const expected = {
                        left: -elBContainerLeft,
                        top: -elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure border -> border offset`, function () {
                    const actual = getOffset([elA, 'border'], [elB, 'border']);
                    const expected = {
                        left: -elBContainerLeft,
                        top: -elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure border -> margin offset`, function () {
                    const actual = getOffset([elA, 'border'], [elB, 'margin']);
                    const expected = {
                        left: marginLeft - elBContainerLeft,
                        top: marginTop - elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
            });
            describe('element (margin) -> element (all variations)', function () {
                it(`should measure margin -> content offset`, function () {
                    const actual = getOffset([elA, 'margin'], [elB, 'content']);
                    const expected = {
                        left: -(elBContainerLeft + paddingLeft + borderLeft + marginLeft),
                        top: -(elBContainerTop + paddingTop + borderTop + marginTop),
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure margin -> padding offset`, function () {
                    const actual = getOffset([elA, 'margin'], [elB, 'padding']);
                    const expected = {
                        left: -(elBContainerLeft + borderLeft + marginLeft),
                        top: -(elBContainerTop + borderTop + marginTop),
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure margin -> scroll offset`, function () {
                    const actual = getOffset([elA, 'margin'], [elB, 'scroll']);
                    const expected = {
                        left: -(elBContainerLeft + borderLeft + marginLeft),
                        top: -(elBContainerTop + borderTop + marginTop),
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure margin -> default (border) offset`, function () {
                    const actual = getOffset([elA, 'margin'], elB);
                    const expected = {
                        left: -(elBContainerLeft + marginLeft),
                        top: -(elBContainerTop + marginTop),
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure margin -> border offset`, function () {
                    const actual = getOffset([elA, 'margin'], [elB, 'border']);
                    const expected = {
                        left: -(elBContainerLeft + marginLeft),
                        top: -(elBContainerTop + marginTop),
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
                it(`should measure margin -> margin offset`, function () {
                    const actual = getOffset([elA, 'margin'], [elB, 'margin']);
                    const expected = {
                        left: -elBContainerLeft,
                        top: -elBContainerTop,
                    };
                    chai.assert.deepStrictEqual(actual, expected);
                });
            });
        });
    });

    function isDimensionsMatch(targetRect, ancestorRect, scaleFactor) {
        // Note, the 0.1 is to account for rounding errors.
        return (Math.abs(ancestorRect.width * scaleFactor - targetRect.width) < 0.1 &&
            Math.abs(ancestorRect.height * scaleFactor - targetRect.height) < 0.1);
    }
    function getEffectiveContainingBlock(element, scaleFactor) {
        let target = element;
        let ancestor = target.parentElement;
        const targetOriginalRect = target.getBoundingClientRect();
        while (ancestor) {
            const ancestorOriginalRect = ancestor.getBoundingClientRect();
            // Check if the ancestor's dimensions match the expected dimensions based on
            // the scaleFactor.
            if (isDimensionsMatch(targetOriginalRect, ancestorOriginalRect, scaleFactor)) {
                // Temporarily adjust the ancestor's size to see if the target element
                // responds accordingly.
                const originalWidth = ancestor.style.width;
                const originalHeight = ancestor.style.height;
                // Modify the ancestor's size.
                ancestor.style.width = `${ancestorOriginalRect.width + 10}px`;
                ancestor.style.height = `${ancestorOriginalRect.height + 10}px`;
                // Recalculate the target's and ancestor's dimensions.
                const targetNewRect = target.getBoundingClientRect();
                const ancestorNewRect = ancestor.getBoundingClientRect();
                // Restore the ancestor's original size.
                ancestor.style.width = originalWidth;
                ancestor.style.height = originalHeight;
                // Verify if the size change in the ancestor reflects correctly in the
                // target element.
                if (isDimensionsMatch(targetNewRect, ancestorNewRect, scaleFactor)) {
                    return ancestor;
                }
            }
            // Move up the tree.
            ancestor = ancestor.parentElement;
        }
        // If no matching ancestor is found, and the element is positioned as "fixed"
        // or "absolute" and its dimensions match the expected dimensions based on the
        // scaleFactor, then the element's containing block is the window.
        const { position } = window.getComputedStyle(element);
        if ((position === 'fixed' || position === 'absolute') &&
            Math.abs(window.innerWidth * scaleFactor - targetOriginalRect.width) < 0.1 &&
            Math.abs(window.innerHeight * scaleFactor - targetOriginalRect.height) < 0.1) {
            return window;
        }
        // If no matching ancestor is found, return null.
        return null;
    }

    const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
    const IS_SAFARI = !!(IS_BROWSER &&
        navigator.vendor &&
        navigator.vendor.indexOf('Apple') > -1 &&
        navigator.userAgent &&
        navigator.userAgent.indexOf('CriOS') == -1 &&
        navigator.userAgent.indexOf('FxiOS') == -1);

    const specialCases = [
        {
            property: 'transform',
            value: 'translateX(10px)',
            containsInline: false,
            containsBlock: true,
        },
        {
            property: 'perspective',
            value: '500px',
            containsInline: false,
            containsBlock: true,
        },
        {
            property: 'contentVisibility',
            value: 'auto',
            containsInline: false,
            containsBlock: !IS_SAFARI,
        },
        {
            property: 'contain',
            value: 'paint',
            containsInline: false,
            containsBlock: true,
        },
        {
            property: 'contain',
            value: 'layout',
            containsInline: false,
            containsBlock: true,
        },
        {
            property: 'contain',
            value: 'strict',
            containsInline: false,
            containsBlock: true,
        },
        {
            property: 'contain',
            value: 'content',
            containsInline: false,
            containsBlock: true,
        },
        {
            property: 'willChange',
            value: 'transform',
            containsInline: false,
            containsBlock: true,
        },
        {
            property: 'willChange',
            value: 'perspective',
            containsInline: false,
            containsBlock: true,
        },
        {
            property: 'willChange',
            value: 'contain',
            containsInline: false,
            containsBlock: true,
        },
        {
            property: 'filter',
            value: 'blur(5px)',
            containsInline: !IS_SAFARI,
            containsBlock: !IS_SAFARI,
        },
        {
            property: 'backdropFilter',
            value: 'blur(5px)',
            containsInline: !IS_SAFARI,
            containsBlock: !IS_SAFARI,
        },
        {
            property: 'willChange',
            value: 'filter',
            containsInline: !IS_SAFARI,
            containsBlock: true,
        },
        {
            property: 'willChange',
            value: 'backdrop-filter',
            containsInline: !IS_SAFARI,
            containsBlock: !IS_SAFARI,
        },
    ];
    describe('getContainingBlock()', function () {
        let el;
        let container;
        const scale = 0.5;
        beforeEach(function () {
            // Set the document's dimensions.
            document.documentElement.style.width = '200vw';
            document.documentElement.style.height = '200vh';
            document.documentElement.style.overflow = 'hidden';
            // Set body's dimensions.
            document.body.style.width = '300vw';
            document.body.style.height = '300vh';
            // Create container element.
            container = createTestElement({
                width: '400vw',
                height: '500vh',
            });
            // Create target element.
            el = createTestElement({
                width: `${scale * 100}%`,
                height: `${scale * 100}%`,
            });
            // Move target element into container.
            container.appendChild(el);
        });
        describe('absolute positioned element', function () {
            beforeEach(function () {
                el.style.position = 'absolute';
            });
            it('should return window if no containing block ancestor is found', function () {
                const actual = getContainingBlock(el);
                const computed = getEffectiveContainingBlock(el, 0.5);
                const expected = window;
                chai.assert.equal(actual, computed, 'matches computed containing block');
                chai.assert.equal(actual, expected, 'matches expected containing block');
            });
            ['relative', 'absolute', 'fixed', 'sticky'].forEach((position) => {
                it(`should recognize block-level "position:${position}" ancestors`, function () {
                    container.style.display = 'block';
                    container.style.position = position;
                    const actual = getContainingBlock(el);
                    const computed = getEffectiveContainingBlock(el, 0.5);
                    const expected = container;
                    chai.assert.equal(actual, computed, 'matches computed containing block');
                    chai.assert.equal(actual, expected, 'matches expected containing block');
                });
                it(`should recognize inline-level "position:${position}" ancestors`, function () {
                    container.style.display = 'inline';
                    container.style.position = position;
                    const actual = getContainingBlock(el);
                    const computed = getEffectiveContainingBlock(el, 0.5);
                    const expected = container;
                    chai.assert.equal(actual, computed, 'matches computed containing block');
                    chai.assert.equal(actual, expected, 'matches expected containing block');
                });
                it(`should recognize "display:none" "position:${position}" ancestors`, function () {
                    container.style.display = 'none';
                    container.style.position = position;
                    const actual = getContainingBlock(el);
                    const expected = container;
                    chai.assert.equal(actual, expected);
                });
            });
            specialCases.forEach(({ property, value, containsInline }) => {
                it(`should recognize block-level "position:static" "${property}:${value}" ancestors`, function () {
                    container.style.display = 'block';
                    container.style.position = 'static';
                    container.style[property] = value;
                    const actual = getContainingBlock(el);
                    const computed = getEffectiveContainingBlock(el, 0.5);
                    chai.assert.equal(actual, computed);
                });
                if (containsInline) {
                    it(`should recognize inline-level "position:static" "${property}:${value}" ancestors`, function () {
                        container.style.display = 'inline';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el);
                        const computed = getEffectiveContainingBlock(el, 0.5);
                        chai.assert.equal(actual, computed);
                    });
                    it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors by default`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el);
                        const computed = getEffectiveContainingBlock(el, 0.5);
                        const expected = container;
                        chai.assert.equal(actual, computed, 'matches computed containing block');
                        chai.assert.equal(actual, expected, 'matches expected containing block');
                    });
                    it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is false`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el, { skipDisplayNone: false });
                        const computed = getEffectiveContainingBlock(el, 0.5);
                        const expected = container;
                        chai.assert.equal(actual, computed, 'matches computed containing block');
                        chai.assert.equal(actual, expected, 'matches expected containing block');
                    });
                    it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is true`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el, { skipDisplayNone: true });
                        const computed = getEffectiveContainingBlock(el, 0.5);
                        const expected = container;
                        chai.assert.equal(actual, computed, 'matches computed containing block');
                        chai.assert.equal(actual, expected, 'matches expected containing block');
                    });
                }
                else {
                    it(`should not recognize inline-level "position:static" "${property}:${value}" ancestors`, function () {
                        container.style.display = 'inline';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el);
                        const computed = getEffectiveContainingBlock(el, 0.5);
                        chai.assert.equal(actual, computed);
                    });
                    it(`should return null on "display:none" "position:static" "${property}:${value}" ancestors by default`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el);
                        const expected = null;
                        chai.assert.equal(actual, expected);
                    });
                    it(`should return null on "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is false`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el, { skipDisplayNone: false });
                        const expected = null;
                        chai.assert.equal(actual, expected);
                    });
                    it(`should skip "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is true`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el, { skipDisplayNone: true });
                        const expected = window;
                        chai.assert.equal(actual, expected);
                    });
                }
            });
            it(`should return null on "display:none" "position:static" ancestors by default`, function () {
                container.style.display = 'none';
                container.style.position = 'static';
                const actual = getContainingBlock(el);
                const expected = null;
                chai.assert.equal(actual, expected);
            });
            it(`should skip "display:none" "position:static" ancestors when skipDisplayNone option is false`, function () {
                container.style.display = 'none';
                container.style.position = 'static';
                const actual = getContainingBlock(el, { skipDisplayNone: false });
                const expected = null;
                chai.assert.equal(actual, expected);
            });
            it(`should skip "display:none" "position:static" ancestors when skipDisplayNone option is true`, function () {
                container.style.display = 'none';
                container.style.position = 'static';
                const actual = getContainingBlock(el, { skipDisplayNone: true });
                const expected = window;
                chai.assert.equal(actual, expected);
            });
        });
        describe('fixed element', function () {
            beforeEach(function () {
                el.style.position = 'fixed';
            });
            ['static', 'relative', 'absolute', 'fixed', 'sticky'].forEach((position) => {
                it(`should not recognize block-level "position:${position}" ancestors`, function () {
                    container.style.display = 'block';
                    container.style.position = position;
                    const actual = getContainingBlock(el);
                    const computed = getEffectiveContainingBlock(el, 0.5);
                    const expected = window;
                    chai.assert.equal(actual, computed, 'matches computed containing block');
                    chai.assert.equal(actual, expected, 'matches expected containing block');
                });
                it(`should not recognize inline-level "position:${position}" ancestors`, function () {
                    container.style.display = 'inline';
                    container.style.position = position;
                    const actual = getContainingBlock(el);
                    const computed = getEffectiveContainingBlock(el, 0.5);
                    const expected = window;
                    chai.assert.equal(actual, computed, 'matches computed containing block');
                    chai.assert.equal(actual, expected, 'matches expected containing block');
                });
                it(`should return null on "display:none" "position:${position}" ancestors by default`, function () {
                    container.style.display = 'none';
                    container.style.position = position;
                    const actual = getContainingBlock(el);
                    const expected = null;
                    chai.assert.equal(actual, expected);
                });
                it(`should return null on "display:none" "position:${position}" ancestors when skipDisplayNone option is false`, function () {
                    container.style.display = 'none';
                    container.style.position = position;
                    const actual = getContainingBlock(el, { skipDisplayNone: false });
                    const expected = null;
                    chai.assert.equal(actual, expected);
                });
                it(`should skip "display:none" "position:${position}" ancestors when skipDisplayNone option is true`, function () {
                    container.style.display = 'none';
                    container.style.position = position;
                    const actual = getContainingBlock(el, { skipDisplayNone: true });
                    const expected = window;
                    chai.assert.equal(actual, expected);
                });
            });
            specialCases.forEach(({ property, value, containsInline }) => {
                it(`should recognize block-level "position:static" "${property}:${value}" ancestors`, function () {
                    container.style.display = 'block';
                    container.style.position = 'static';
                    container.style[property] = value;
                    const actual = getContainingBlock(el);
                    const computed = getEffectiveContainingBlock(el, 0.5);
                    chai.assert.equal(actual, computed);
                });
                if (containsInline) {
                    it(`should recognize inline-level "position:static" "${property}:${value}" ancestors`, function () {
                        container.style.display = 'inline';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el);
                        const computed = getEffectiveContainingBlock(el, 0.5);
                        chai.assert.equal(actual, computed);
                    });
                    it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors by default`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el);
                        const computed = getEffectiveContainingBlock(el, 0.5);
                        const expected = container;
                        chai.assert.equal(actual, computed, 'matches computed containing block');
                        chai.assert.equal(actual, expected, 'matches expected containing block');
                    });
                    it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is false`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el, { skipDisplayNone: false });
                        const computed = getEffectiveContainingBlock(el, 0.5);
                        const expected = container;
                        chai.assert.equal(actual, computed, 'matches computed containing block');
                        chai.assert.equal(actual, expected, 'matches expected containing block');
                    });
                    it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is true`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el, { skipDisplayNone: true });
                        const computed = getEffectiveContainingBlock(el, 0.5);
                        const expected = container;
                        chai.assert.equal(actual, computed, 'matches computed containing block');
                        chai.assert.equal(actual, expected, 'matches expected containing block');
                    });
                }
                else {
                    it(`should not recognize inline-level "position:static" "${property}:${value}" ancestors`, function () {
                        container.style.display = 'inline';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el);
                        const computed = getEffectiveContainingBlock(el, 0.5);
                        chai.assert.equal(actual, computed);
                    });
                    it(`should return null on "display:none" "position:static" "${property}:${value}" ancestors by default`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el);
                        const expected = null;
                        chai.assert.equal(actual, expected);
                    });
                    it(`should return null on "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is false`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el, { skipDisplayNone: false });
                        const expected = null;
                        chai.assert.equal(actual, expected);
                    });
                    it(`should skip "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is true`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el, { skipDisplayNone: true });
                        const expected = window;
                        chai.assert.equal(actual, expected);
                    });
                }
            });
        });
        describe('static/relative/sticky element', function () {
            ['static', 'relative', 'sticky'].forEach((position) => {
                it(`should return document element for "position:${position}" element if no other containing block ancestor is found`, function () {
                    document.documentElement.style.display = 'inline';
                    document.body.style.display = 'inline';
                    container.style.display = 'inline';
                    el.style.position = position;
                    const actual = getContainingBlock(el);
                    const computed = getEffectiveContainingBlock(el, 0.5);
                    const expected = document.documentElement;
                    chai.assert.equal(actual, computed, 'matches computed containing block');
                    chai.assert.equal(actual, expected, 'matches expected containing block');
                });
                it(`should return the closest block-level ancestor for "position:${position}" element`, function () {
                    document.body.style.display = 'block';
                    container.style.display = 'block';
                    el.style.position = position;
                    const actual = getContainingBlock(el);
                    const computed = getEffectiveContainingBlock(el, 0.5);
                    const expected = container;
                    chai.assert.equal(actual, computed, 'matches computed containing block');
                    chai.assert.equal(actual, expected, 'matches expected containing block');
                });
                it(`should skip all inline-level ancestors for "position:${position}" element`, function () {
                    document.body.style.display = 'block';
                    container.style.display = 'inline';
                    el.style.position = position;
                    const actual = getContainingBlock(el);
                    const computed = getEffectiveContainingBlock(el, 0.5);
                    const expected = document.body;
                    chai.assert.equal(actual, computed, 'matches computed containing block');
                    chai.assert.equal(actual, expected, 'matches expected containing block');
                });
                it(`should return null for "position:${position}" element when "display:none" ancestor is reached`, function () {
                    document.body.style.display = 'none';
                    container.style.display = 'inline';
                    el.style.position = position;
                    const actual = getContainingBlock(el);
                    const expected = null;
                    chai.assert.equal(actual, expected);
                });
                it(`should return null for "position:${position}" element when "display:none" ancestor is reached when skipDisplayNone option is false`, function () {
                    document.body.style.display = 'none';
                    container.style.display = 'inline';
                    el.style.position = position;
                    const actual = getContainingBlock(el, { skipDisplayNone: false });
                    const expected = null;
                    chai.assert.equal(actual, expected);
                });
                it(`should skip "display:none" ancestor for "position:${position}" element when skipDisplayNone option is true`, function () {
                    document.body.style.display = 'block';
                    container.style.display = 'none';
                    el.style.position = position;
                    const actual = getContainingBlock(el, { skipDisplayNone: true });
                    const expected = document.body;
                    chai.assert.equal(actual, expected);
                });
            });
        });
    });

}));
