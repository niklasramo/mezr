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
     * the target element's percentage-based width, height, left, right, top,
     * bottom, padding and margin properties are relative to. In case the containing
     * block can not be computed `null` will be returned (e.g. in some cases we
     * can't query all the information needed from elements with display:none).
     *
     * This method is not something you need too often, but when you do you'll be
     * happy that you stumbled upon this library. It's very tricky to compute the
     * containing block correctly while taking browser differences into account.
     * This method does all the heavy lifting for you.
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

    function isIntersecting(a, b) {
        return !(a.left + a.width <= b.left ||
            b.left + b.width <= a.left ||
            a.top + a.height <= b.top ||
            b.top + b.height <= a.top);
    }

    function getDistanceBetweenPoints(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    /**
     * Calculate shortest distance between two rectangles. Returns null if the
     * rectangles are intersecting.
     */
    function getDistanceBetweenRects(a, b) {
        if (isIntersecting(a, b))
            return null;
        const aRight = a.left + a.width;
        const aBottom = a.top + a.height;
        const bRight = b.left + b.width;
        const bBottom = b.top + b.height;
        // Check left side zones.
        if (aRight <= b.left) {
            // Left-top corner.
            if (aBottom <= b.top) {
                // Distance between a right-bottom point and b left-top point.
                return getDistanceBetweenPoints(aRight, aBottom, b.left, b.top);
            }
            // Left-bottom corner.
            else if (a.top >= bBottom) {
                // Distance between a right-top point and b left-bottom point.
                return getDistanceBetweenPoints(aRight, a.top, b.left, bBottom);
            }
            // Left side.
            else {
                return b.left - aRight;
            }
        }
        // Check right side zones.
        else if (a.left >= bRight) {
            // Right-top corner.
            if (aBottom <= b.top) {
                // Distance between a left-bottom point and b right-top point.
                return getDistanceBetweenPoints(a.left, aBottom, bRight, b.top);
            }
            // Right-bottom corner.
            else if (a.top >= bBottom) {
                // Distance between a left-top point and b right-bottom point.
                return getDistanceBetweenPoints(a.left, a.top, bRight, bBottom);
            }
            // Right side.
            else {
                return a.left - bRight;
            }
        }
        // Check top and bottom sides.
        else {
            // Top side.
            if (aBottom <= b.top) {
                return b.top - aBottom;
            }
            // Bottom side.
            else {
                return a.top - bBottom;
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

    /**
     * Returns the width of an element in pixels. Accepts also the window object
     * (for getting the viewport width) and the document object (for getting the
     * width of the whole document).
     */
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

    /**
     * Returns the height of an element in pixels. Accepts also the window object
     * (for getting the viewport height) and the document object (for getting the
     * height of the whole document).
     */
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

    /**
     * Returns the element's offset from another element, window or document.
     */
    function getOffset(element, offsetRoot) {
        const offset = isRectObject(element)
            ? { left: element.left, top: element.top }
            : Array.isArray(element)
                ? getOffsetFromDocument(...element)
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

    /**
     * Returns an object containing the provided element's dimensions and offsets.
     * This is basically a helper method for calculating an element's dimensions and
     * offsets simultaneously. Mimics the native getBoundingClientRect method with
     * the added bonus of allowing to define the box edge of the element, and also
     * the element from which the offset is measured.
     */
    function getRect(element, offsetRoot) {
        let width = 0;
        let height = 0;
        if (isRectObject(element)) {
            width = element.width;
            height = element.height;
        }
        else if (Array.isArray(element)) {
            width = getWidth(...element);
            height = getHeight(...element);
        }
        else {
            width = getWidth(element);
            height = getHeight(element);
        }
        const offset = getOffset(element, offsetRoot);
        return {
            width,
            height,
            ...offset,
            right: offset.left + width,
            bottom: offset.top + height,
        };
    }

    function getNormalizedRect(element) {
        return isRectObject(element) ? element : getRect(element);
    }

    /**
     * Returns the shortest distance between two elements (in pixels), or `null` if
     * the elements intersect. In case the elements are touching, but not
     * intersecting, the returned distance is `0`.
     */
    function getDistance(elementA, elementB) {
        const rectA = getNormalizedRect(elementA);
        const rectB = getNormalizedRect(elementB);
        return getDistanceBetweenRects(rectA, rectB);
    }

    /**
     * Measure the intersection area of two or more elements. Returns an object
     * containing the intersection area dimensions and offsets if _all_ the provided
     * elements intersect, otherwise returns `null`.
     */
    function getIntersection(firstElement, ...restElements) {
        const result = { ...getNormalizedRect(firstElement), right: 0, bottom: 0 };
        for (const element of restElements) {
            const rect = getNormalizedRect(element);
            const x1 = Math.max(result.left, rect.left);
            const x2 = Math.min(result.left + result.width, rect.left + rect.width);
            if (x2 <= x1)
                return null;
            const y1 = Math.max(result.top, rect.top);
            const y2 = Math.min(result.top + result.height, rect.height + rect.top);
            if (y2 <= y1)
                return null;
            result.left = x1;
            result.top = y1;
            result.width = x2 - x1;
            result.height = y2 - y1;
        }
        result.right = result.left + result.width;
        result.bottom = result.top + result.height;
        return result;
    }

    /**
     * Returns the element's offset container, meaning the closest ancestor
     * element/document/window that the target element's left/right/top/bottom CSS
     * properties are rooted to. If the offset container can't be computed or the
     * element is not affected by left/right/top/bottom CSS properties (e.g. static
     * elements) `null` will be returned.
     *
     * Due to the dynamic nature of sticky elements they are considered as static
     * elements in this method's scope and will always return `null`.
     */
    function getOffsetContainer(element, options = {}) {
        const style = getStyle(element);
        // If the element's display is "none" or "contents" the element's
        // left/top/right/bottom properties do not have any effect.
        const { display } = style;
        if (display === 'none' || display === 'contents') {
            return null;
        }
        // Parse options.
        const position = options.position || getStyle(element).position;
        const { skipDisplayNone } = options;
        switch (position) {
            // Relative element's offset container is always the element itself.
            case 'relative': {
                return element;
            }
            // Fixed element's offset container is always it's containing block.
            case 'fixed': {
                return getContainingBlock(element, { position, skipDisplayNone });
            }
            // Absolute element's offset container is always it's containing block,
            // except when the containing block is window in which case we return the
            // element's owner document instead.
            case 'absolute': {
                const containingBlock = getContainingBlock(element, { position, skipDisplayNone });
                return isWindow(containingBlock) ? element.ownerDocument : containingBlock;
            }
            // For any other values we return null.
            default: {
                return null;
            }
        }
    }

    /**
     * Measure how much target overflows container per each side. Returns an object
     * containing the overflow values (note that the overflow values are reported
     * even if the elements don't intersect). If a side's value is positive it means
     * that target overflows container by that much from that side. If the value is
     * negative it means that container overflows target by that much from that
     * side.
     */
    function getOverflow(target, container) {
        const targetRect = getNormalizedRect(target);
        const containerRect = getNormalizedRect(container);
        return {
            left: containerRect.left - targetRect.left,
            right: targetRect.left + targetRect.width - (containerRect.left + containerRect.width),
            top: containerRect.top - targetRect.top,
            bottom: targetRect.top + targetRect.height - (containerRect.top + containerRect.height),
        };
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

    const { width: sbWidth$1 } = getScrollbarSizes();
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
            it('should measure width with scrollbar', function () {
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
                        ? width - sbWidth$1
                        : width - sbWidth$1 - paddingLeft - paddingRight - borderWidthLeft - borderWidthRight;
                    chai.assert.equal(actual, expected, `content - ${boxSizing}`);
                });
                it(`should measure padding width for ${boxSizing}`, function () {
                    const actual = getWidth(el, 'padding');
                    const expected = boxSizing === 'content-box'
                        ? width - sbWidth$1 + paddingLeft + paddingRight
                        : width - sbWidth$1 - borderWidthLeft - borderWidthRight;
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

    const { height: sbHeight$1 } = getScrollbarSizes();
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
                chai.assert.strictEqual(getHeight(document), expected, 'default');
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
                        ? height - sbHeight$1
                        : height - sbHeight$1 - paddingTop - paddingBottom - borderWidthTop - borderWidthBottom;
                    chai.assert.equal(actual, expected, `content - ${boxSizing}`);
                });
                it(`should measure padding height for ${boxSizing}`, function () {
                    const actual = getHeight(el, 'padding');
                    const expected = boxSizing === 'content-box'
                        ? height - sbHeight$1 + paddingTop + paddingBottom
                        : height - sbHeight$1 - borderWidthTop - borderWidthBottom;
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
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure element's padding offset from document`, function () {
                    const actual = getOffset([elA, 'padding']);
                    const expected = {
                        left: left + marginLeft + borderLeft,
                        top: top + marginTop + borderTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure element's scroll offset from document`, function () {
                    const actual = getOffset([elA, 'scroll']);
                    const expected = {
                        left: left + marginLeft + borderLeft,
                        top: top + marginTop + borderTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure element's border offset from document`, function () {
                    const actual = getOffset([elA, 'border']);
                    const expected = {
                        left: left + marginLeft,
                        top: top + marginTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure element's margin offset from document`, function () {
                    const actual = getOffset([elA, 'margin']);
                    const expected = {
                        left: left,
                        top: top,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
            });
            describe('element -> window', function () {
                it(`should measure element's content offset from window`, function () {
                    const actual = getOffset([elA, 'content'], window);
                    const expected = {
                        left: left + marginLeft + borderLeft + paddingLeft - scrollLeft,
                        top: top + marginTop + borderTop + paddingTop - scrollTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure element's padding offset from window`, function () {
                    const actual = getOffset([elA, 'padding'], window);
                    const expected = {
                        left: left + marginLeft + borderLeft - scrollLeft,
                        top: top + marginTop + borderTop - scrollTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure element's scroll offset from window`, function () {
                    const actual = getOffset([elA, 'scroll'], window);
                    const expected = {
                        left: left + marginLeft + borderLeft - scrollLeft,
                        top: top + marginTop + borderTop - scrollTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure element's default (border) offset from window`, function () {
                    const actual = getOffset(elA, window);
                    const expected = {
                        left: left + marginLeft - scrollLeft,
                        top: top + marginTop - scrollTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure element's border offset from window`, function () {
                    const actual = getOffset([elA, 'border'], window);
                    const expected = {
                        left: left + marginLeft - scrollLeft,
                        top: top + marginTop - scrollTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure element's margin offset from window`, function () {
                    const actual = getOffset([elA, 'margin'], window);
                    const expected = {
                        left: left - scrollLeft,
                        top: top - scrollTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
            });
            describe('element (content) -> element (all variations)', function () {
                it(`should measure content -> content offset`, function () {
                    const actual = getOffset([elA, 'content'], [elB, 'content']);
                    const expected = {
                        left: -elBContainerLeft,
                        top: -elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure content -> padding offset`, function () {
                    const actual = getOffset([elA, 'content'], [elB, 'padding']);
                    const expected = {
                        left: paddingLeft - elBContainerLeft,
                        top: paddingTop - elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure content -> scroll offset`, function () {
                    const actual = getOffset([elA, 'content'], [elB, 'scroll']);
                    const expected = {
                        left: paddingLeft - elBContainerLeft,
                        top: paddingTop - elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure content -> default (border) offset`, function () {
                    const actual = getOffset([elA, 'content'], elB);
                    const expected = {
                        left: paddingLeft + borderLeft - elBContainerLeft,
                        top: paddingTop + borderTop - elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure content -> border offset`, function () {
                    const actual = getOffset([elA, 'content'], [elB, 'border']);
                    const expected = {
                        left: paddingLeft + borderLeft - elBContainerLeft,
                        top: paddingTop + borderTop - elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure content -> margin offset`, function () {
                    const actual = getOffset([elA, 'content'], [elB, 'margin']);
                    const expected = {
                        left: paddingLeft + borderLeft + marginLeft - elBContainerLeft,
                        top: paddingTop + borderTop + marginTop - elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
            });
            describe('element (padding) -> element (all variations)', function () {
                it(`should measure padding -> content offset`, function () {
                    const actual = getOffset([elA, 'padding'], [elB, 'content']);
                    const expected = {
                        left: -(elBContainerLeft + paddingLeft),
                        top: -(elBContainerTop + paddingTop),
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure padding -> padding offset`, function () {
                    const actual = getOffset([elA, 'padding'], [elB, 'padding']);
                    const expected = {
                        left: -elBContainerLeft,
                        top: -elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure padding -> scroll offset`, function () {
                    const actual = getOffset([elA, 'padding'], [elB, 'scroll']);
                    const expected = {
                        left: -elBContainerLeft,
                        top: -elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure padding -> default (border) offset`, function () {
                    const actual = getOffset([elA, 'padding'], elB);
                    const expected = {
                        left: borderLeft - elBContainerLeft,
                        top: borderTop - elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure padding -> border offset`, function () {
                    const actual = getOffset([elA, 'padding'], [elB, 'border']);
                    const expected = {
                        left: borderLeft - elBContainerLeft,
                        top: borderTop - elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure padding -> margin offset`, function () {
                    const actual = getOffset([elA, 'padding'], [elB, 'margin']);
                    const expected = {
                        left: borderLeft + marginLeft - elBContainerLeft,
                        top: borderTop + marginTop - elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
            });
            describe('element (scroll) -> element (all variations)', function () {
                it(`should measure scroll -> content offset`, function () {
                    const actual = getOffset([elA, 'scroll'], [elB, 'content']);
                    const expected = {
                        left: -(elBContainerLeft + paddingLeft),
                        top: -(elBContainerTop + paddingTop),
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure scroll -> padding offset`, function () {
                    const actual = getOffset([elA, 'scroll'], [elB, 'padding']);
                    const expected = {
                        left: -elBContainerLeft,
                        top: -elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure scroll -> scroll offset`, function () {
                    const actual = getOffset([elA, 'scroll'], [elB, 'scroll']);
                    const expected = {
                        left: -elBContainerLeft,
                        top: -elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure scroll -> default (border) offset`, function () {
                    const actual = getOffset([elA, 'scroll'], elB);
                    const expected = {
                        left: borderLeft - elBContainerLeft,
                        top: borderTop - elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure scroll -> border offset`, function () {
                    const actual = getOffset([elA, 'scroll'], [elB, 'border']);
                    const expected = {
                        left: borderLeft - elBContainerLeft,
                        top: borderTop - elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure scroll -> margin offset`, function () {
                    const actual = getOffset([elA, 'scroll'], [elB, 'margin']);
                    const expected = {
                        left: borderLeft + marginLeft - elBContainerLeft,
                        top: borderTop + marginTop - elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
            });
            describe('element (border) -> element (all variations)', function () {
                it(`should measure border -> content offset`, function () {
                    const actual = getOffset([elA, 'border'], [elB, 'content']);
                    const expected = {
                        left: -(elBContainerLeft + paddingLeft + borderLeft),
                        top: -(elBContainerTop + paddingTop + borderTop),
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure border -> padding offset`, function () {
                    const actual = getOffset([elA, 'border'], [elB, 'padding']);
                    const expected = {
                        left: -(elBContainerLeft + borderLeft),
                        top: -(elBContainerTop + borderTop),
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure border -> scroll offset`, function () {
                    const actual = getOffset([elA, 'border'], [elB, 'scroll']);
                    const expected = {
                        left: -(elBContainerLeft + borderLeft),
                        top: -(elBContainerTop + borderTop),
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure border -> default (border) offset`, function () {
                    const actual = getOffset([elA, 'border'], elB);
                    const expected = {
                        left: -elBContainerLeft,
                        top: -elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure border -> border offset`, function () {
                    const actual = getOffset([elA, 'border'], [elB, 'border']);
                    const expected = {
                        left: -elBContainerLeft,
                        top: -elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure border -> margin offset`, function () {
                    const actual = getOffset([elA, 'border'], [elB, 'margin']);
                    const expected = {
                        left: marginLeft - elBContainerLeft,
                        top: marginTop - elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
            });
            describe('element (margin) -> element (all variations)', function () {
                it(`should measure margin -> content offset`, function () {
                    const actual = getOffset([elA, 'margin'], [elB, 'content']);
                    const expected = {
                        left: -(elBContainerLeft + paddingLeft + borderLeft + marginLeft),
                        top: -(elBContainerTop + paddingTop + borderTop + marginTop),
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure margin -> padding offset`, function () {
                    const actual = getOffset([elA, 'margin'], [elB, 'padding']);
                    const expected = {
                        left: -(elBContainerLeft + borderLeft + marginLeft),
                        top: -(elBContainerTop + borderTop + marginTop),
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure margin -> scroll offset`, function () {
                    const actual = getOffset([elA, 'margin'], [elB, 'scroll']);
                    const expected = {
                        left: -(elBContainerLeft + borderLeft + marginLeft),
                        top: -(elBContainerTop + borderTop + marginTop),
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure margin -> default (border) offset`, function () {
                    const actual = getOffset([elA, 'margin'], elB);
                    const expected = {
                        left: -(elBContainerLeft + marginLeft),
                        top: -(elBContainerTop + marginTop),
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure margin -> border offset`, function () {
                    const actual = getOffset([elA, 'margin'], [elB, 'border']);
                    const expected = {
                        left: -(elBContainerLeft + marginLeft),
                        top: -(elBContainerTop + marginTop),
                    };
                    chai.assert.deepEqual(actual, expected);
                });
                it(`should measure margin -> margin offset`, function () {
                    const actual = getOffset([elA, 'margin'], [elB, 'margin']);
                    const expected = {
                        left: -elBContainerLeft,
                        top: -elBContainerTop,
                    };
                    chai.assert.deepEqual(actual, expected);
                });
            });
        });
    });

    const { width: sbWidth, height: sbHeight } = getScrollbarSizes();
    describe('getRect()', function () {
        beforeEach(beforeTest);
        afterEach(afterTest);
        describe('dimensions', function () {
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
                ['content', 'padding', 'scroll', 'border', 'margin'].forEach((boxEdge) => {
                    it(`should measure dimensions with box edge being "${boxEdge}"`, function () {
                        let expectedWidth = 0;
                        let expectedHeight = 0;
                        switch (boxEdge) {
                            case 'content':
                            case 'padding': {
                                expectedWidth = elWidth;
                                expectedHeight = elHeight;
                                break;
                            }
                            default: {
                                expectedWidth = elWidth + window.innerWidth - document.documentElement.clientWidth;
                                expectedHeight =
                                    elHeight + window.innerHeight - document.documentElement.clientHeight;
                            }
                        }
                        const rect = getRect([document, boxEdge]);
                        chai.assert.strictEqual(rect.width, expectedWidth, 'width: rect.width');
                        chai.assert.strictEqual(rect.right - rect.left, expectedWidth, 'width: rect.right - rect.left');
                        chai.assert.strictEqual(rect.height, expectedHeight, 'height: rect.height');
                        chai.assert.strictEqual(rect.bottom - rect.top, expectedHeight, 'height: rect.bottom - rect.top');
                    });
                });
            });
            describe('window', function () {
                ['content', 'padding', 'scroll', 'border', 'margin'].forEach((boxEdge) => {
                    it(`should measure dimensions with box edge being "${boxEdge}"`, function () {
                        document.documentElement.style.overflow = 'scroll';
                        let expectedWidth = 0;
                        let expectedHeight = 0;
                        switch (boxEdge) {
                            case 'content':
                            case 'padding': {
                                expectedWidth = document.documentElement.clientWidth;
                                expectedHeight = document.documentElement.clientHeight;
                                break;
                            }
                            default: {
                                expectedWidth = window.innerWidth;
                                expectedHeight = window.innerHeight;
                            }
                        }
                        const rect = getRect([window, boxEdge]);
                        chai.assert.strictEqual(rect.width, expectedWidth, 'width: rect.width');
                        chai.assert.strictEqual(rect.right - rect.left, expectedWidth, 'width: rect.right - rect.left');
                        chai.assert.strictEqual(rect.height, expectedHeight, 'height: rect.height');
                        chai.assert.strictEqual(rect.bottom - rect.top, expectedHeight, 'height: rect.bottom - rect.top');
                    });
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
                        const rect = getRect([el, 'content']);
                        const expected = boxSizing === 'content-box'
                            ? width - sbWidth
                            : width - sbWidth - paddingLeft - paddingRight - borderWidthLeft - borderWidthRight;
                        chai.assert.equal(rect.width, expected, `content - ${boxSizing}: rect.width`);
                        chai.assert.equal(rect.right - rect.left, expected, `content - ${boxSizing}: rect.right - rect.left`);
                    });
                    it(`should measure content height for ${boxSizing}`, function () {
                        const rect = getRect([el, 'content']);
                        const expected = boxSizing === 'content-box'
                            ? height - sbHeight
                            : height - sbHeight - paddingTop - paddingBottom - borderWidthTop - borderWidthBottom;
                        chai.assert.equal(rect.height, expected, `content - ${boxSizing}: rect.height`);
                        chai.assert.equal(rect.bottom - rect.top, expected, `content - ${boxSizing}: rect.bottom - rect.top`);
                    });
                    it(`should measure padding width for ${boxSizing}`, function () {
                        const rect = getRect([el, 'padding']);
                        const expected = boxSizing === 'content-box'
                            ? width - sbWidth + paddingLeft + paddingRight
                            : width - sbWidth - borderWidthLeft - borderWidthRight;
                        chai.assert.equal(rect.width, expected, `padding - ${boxSizing}: rect.width`);
                        chai.assert.equal(rect.right - rect.left, expected, `padding - ${boxSizing}: rect.right - rect.left`);
                    });
                    it(`should measure padding height for ${boxSizing}`, function () {
                        const rect = getRect([el, 'padding']);
                        const expected = boxSizing === 'content-box'
                            ? height - sbHeight + paddingTop + paddingBottom
                            : height - sbHeight - borderWidthTop - borderWidthBottom;
                        chai.assert.equal(rect.height, expected, `padding - ${boxSizing}: rect.height`);
                        chai.assert.equal(rect.bottom - rect.top, expected, `padding - ${boxSizing}: rect.bottom - rect.top`);
                    });
                    it(`should measure scroll width for ${boxSizing}`, function () {
                        const rect = getRect([el, 'scroll']);
                        const expected = boxSizing === 'content-box'
                            ? width + paddingLeft + paddingRight
                            : width - borderWidthLeft - borderWidthRight;
                        chai.assert.equal(rect.width, expected, `scroll - ${boxSizing}: rect.width`);
                        chai.assert.equal(rect.right - rect.left, expected, `scroll - ${boxSizing}: rect.right - rect.left`);
                    });
                    it(`should measure scroll height for ${boxSizing}`, function () {
                        const rect = getRect([el, 'scroll']);
                        const expected = boxSizing === 'content-box'
                            ? height + paddingTop + paddingBottom
                            : height - borderWidthTop - borderWidthBottom;
                        chai.assert.equal(rect.height, expected, `scroll - ${boxSizing}: rect.height`);
                        chai.assert.equal(rect.bottom - rect.top, expected, `scroll - ${boxSizing}: rect.bottom - rect.top`);
                    });
                    it(`should measure default width for ${boxSizing}`, function () {
                        const rect = getRect(el);
                        const expected = boxSizing === 'content-box'
                            ? width + paddingLeft + paddingRight + borderWidthLeft + borderWidthRight
                            : width;
                        chai.assert.equal(rect.width, expected, `default - ${boxSizing}: rect.width`);
                        chai.assert.equal(rect.right - rect.left, expected, `default - ${boxSizing}: rect.right - rect.left`);
                    });
                    it(`should measure default height for ${boxSizing}`, function () {
                        const rect = getRect(el);
                        const expected = boxSizing === 'content-box'
                            ? height + paddingTop + paddingBottom + borderWidthTop + borderWidthBottom
                            : height;
                        chai.assert.equal(rect.height, expected, `default - ${boxSizing}: rect.height`);
                        chai.assert.equal(rect.bottom - rect.top, expected, `default - ${boxSizing}: rect.bottom - rect.top`);
                    });
                    it(`should measure border width for ${boxSizing}`, function () {
                        const rect = getRect([el, 'border']);
                        const expected = boxSizing === 'content-box'
                            ? width + paddingLeft + paddingRight + borderWidthLeft + borderWidthRight
                            : width;
                        chai.assert.equal(rect.width, expected, `border - ${boxSizing}: rect.width`);
                        chai.assert.equal(rect.right - rect.left, expected, `border - ${boxSizing}: rect.right - rect.left`);
                    });
                    it(`should measure border height for ${boxSizing}`, function () {
                        const rect = getRect([el, 'border']);
                        const expected = boxSizing === 'content-box'
                            ? height + paddingTop + paddingBottom + borderWidthTop + borderWidthBottom
                            : height;
                        chai.assert.equal(rect.height, expected, `border - ${boxSizing}: rect.height`);
                        chai.assert.equal(rect.bottom - rect.top, expected, `border - ${boxSizing}: rect.bottom - rect.top`);
                    });
                    it(`should measure margin width for ${boxSizing}`, function () {
                        const rect = getRect([el, 'margin']);
                        const expected = boxSizing === 'content-box'
                            ? width +
                                paddingLeft +
                                paddingRight +
                                borderWidthLeft +
                                borderWidthRight +
                                marginLeft +
                                marginRight
                            : width + marginLeft + marginRight;
                        chai.assert.equal(rect.width, expected, `margin - ${boxSizing}: rect.width`);
                        chai.assert.equal(rect.right - rect.left, expected, `margin - ${boxSizing}: rect.right - rect.left`);
                    });
                    it(`should measure margin height for ${boxSizing}`, function () {
                        const rect = getRect([el, 'margin']);
                        const expected = boxSizing === 'content-box'
                            ? height +
                                paddingTop +
                                paddingBottom +
                                borderWidthTop +
                                borderWidthBottom +
                                marginTop +
                                marginBottom
                            : height + marginTop + marginBottom;
                        chai.assert.equal(rect.height, expected, `margin - ${boxSizing}: rect.height`);
                        chai.assert.equal(rect.bottom - rect.top, expected, `margin - ${boxSizing}: rect.bottom - rect.top`);
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
        describe('offsets', function () {
            function getRectOffset(...args) {
                const { left, top } = getRect(...args);
                return { left, top };
            }
            beforeEach(beforeTest);
            afterEach(afterTest);
            describe('document', function () {
                it('should return correct offset without scrolling', function () {
                    const actual = getRectOffset(document);
                    const expected = { left: 0, top: 0 };
                    chai.assert.deepEqual(actual, expected);
                });
                it('should return correct offset with scrolling', function () {
                    createTestElement({
                        width: 'calc(100vw + 200px)',
                        height: 'calc(100vh + 200px)',
                    });
                    window.scrollTo({ left: 50, top: 100, behavior: 'instant' });
                    const actual = getRectOffset(document);
                    const expected = { left: 0, top: 0 };
                    chai.assert.deepEqual(actual, expected);
                });
            });
            describe('window', function () {
                it('should return correct offset without scrolling', function () {
                    const actual = getRectOffset(window);
                    const expected = { left: 0, top: 0 };
                    chai.assert.deepEqual(actual, expected);
                });
                it('should return correct offset with scrolling', function () {
                    createTestElement({
                        width: 'calc(100vw + 200px)',
                        height: 'calc(100vh + 200px)',
                    });
                    window.scrollTo({ left: 50, top: 100, behavior: 'instant' });
                    const actual = getRectOffset(window);
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
                        const actual = getRectOffset([elA, 'content']);
                        const expected = {
                            left: left + marginLeft + borderLeft + paddingLeft,
                            top: top + marginTop + borderTop + paddingTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure element's padding offset from document`, function () {
                        const actual = getRectOffset([elA, 'padding']);
                        const expected = {
                            left: left + marginLeft + borderLeft,
                            top: top + marginTop + borderTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure element's scroll offset from document`, function () {
                        const actual = getRectOffset([elA, 'scroll']);
                        const expected = {
                            left: left + marginLeft + borderLeft,
                            top: top + marginTop + borderTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure element's border offset from document`, function () {
                        const actual = getRectOffset([elA, 'border']);
                        const expected = {
                            left: left + marginLeft,
                            top: top + marginTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure element's margin offset from document`, function () {
                        const actual = getRectOffset([elA, 'margin']);
                        const expected = {
                            left: left,
                            top: top,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                });
                describe('element -> window', function () {
                    it(`should measure element's content offset from window`, function () {
                        const actual = getRectOffset([elA, 'content'], window);
                        const expected = {
                            left: left + marginLeft + borderLeft + paddingLeft - scrollLeft,
                            top: top + marginTop + borderTop + paddingTop - scrollTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure element's padding offset from window`, function () {
                        const actual = getRectOffset([elA, 'padding'], window);
                        const expected = {
                            left: left + marginLeft + borderLeft - scrollLeft,
                            top: top + marginTop + borderTop - scrollTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure element's scroll offset from window`, function () {
                        const actual = getRectOffset([elA, 'scroll'], window);
                        const expected = {
                            left: left + marginLeft + borderLeft - scrollLeft,
                            top: top + marginTop + borderTop - scrollTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure element's default (border) offset from window`, function () {
                        const actual = getRectOffset(elA, window);
                        const expected = {
                            left: left + marginLeft - scrollLeft,
                            top: top + marginTop - scrollTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure element's border offset from window`, function () {
                        const actual = getRectOffset([elA, 'border'], window);
                        const expected = {
                            left: left + marginLeft - scrollLeft,
                            top: top + marginTop - scrollTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure element's margin offset from window`, function () {
                        const actual = getRectOffset([elA, 'margin'], window);
                        const expected = {
                            left: left - scrollLeft,
                            top: top - scrollTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                });
                describe('element (content) -> element (all variations)', function () {
                    it(`should measure content -> content offset`, function () {
                        const actual = getRectOffset([elA, 'content'], [elB, 'content']);
                        const expected = {
                            left: -elBContainerLeft,
                            top: -elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure content -> padding offset`, function () {
                        const actual = getRectOffset([elA, 'content'], [elB, 'padding']);
                        const expected = {
                            left: paddingLeft - elBContainerLeft,
                            top: paddingTop - elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure content -> scroll offset`, function () {
                        const actual = getRectOffset([elA, 'content'], [elB, 'scroll']);
                        const expected = {
                            left: paddingLeft - elBContainerLeft,
                            top: paddingTop - elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure content -> default (border) offset`, function () {
                        const actual = getRectOffset([elA, 'content'], elB);
                        const expected = {
                            left: paddingLeft + borderLeft - elBContainerLeft,
                            top: paddingTop + borderTop - elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure content -> border offset`, function () {
                        const actual = getRectOffset([elA, 'content'], [elB, 'border']);
                        const expected = {
                            left: paddingLeft + borderLeft - elBContainerLeft,
                            top: paddingTop + borderTop - elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure content -> margin offset`, function () {
                        const actual = getRectOffset([elA, 'content'], [elB, 'margin']);
                        const expected = {
                            left: paddingLeft + borderLeft + marginLeft - elBContainerLeft,
                            top: paddingTop + borderTop + marginTop - elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                });
                describe('element (padding) -> element (all variations)', function () {
                    it(`should measure padding -> content offset`, function () {
                        const actual = getRectOffset([elA, 'padding'], [elB, 'content']);
                        const expected = {
                            left: -(elBContainerLeft + paddingLeft),
                            top: -(elBContainerTop + paddingTop),
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure padding -> padding offset`, function () {
                        const actual = getRectOffset([elA, 'padding'], [elB, 'padding']);
                        const expected = {
                            left: -elBContainerLeft,
                            top: -elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure padding -> scroll offset`, function () {
                        const actual = getRectOffset([elA, 'padding'], [elB, 'scroll']);
                        const expected = {
                            left: -elBContainerLeft,
                            top: -elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure padding -> default (border) offset`, function () {
                        const actual = getRectOffset([elA, 'padding'], elB);
                        const expected = {
                            left: borderLeft - elBContainerLeft,
                            top: borderTop - elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure padding -> border offset`, function () {
                        const actual = getRectOffset([elA, 'padding'], [elB, 'border']);
                        const expected = {
                            left: borderLeft - elBContainerLeft,
                            top: borderTop - elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure padding -> margin offset`, function () {
                        const actual = getRectOffset([elA, 'padding'], [elB, 'margin']);
                        const expected = {
                            left: borderLeft + marginLeft - elBContainerLeft,
                            top: borderTop + marginTop - elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                });
                describe('element (scroll) -> element (all variations)', function () {
                    it(`should measure scroll -> content offset`, function () {
                        const actual = getRectOffset([elA, 'scroll'], [elB, 'content']);
                        const expected = {
                            left: -(elBContainerLeft + paddingLeft),
                            top: -(elBContainerTop + paddingTop),
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure scroll -> padding offset`, function () {
                        const actual = getRectOffset([elA, 'scroll'], [elB, 'padding']);
                        const expected = {
                            left: -elBContainerLeft,
                            top: -elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure scroll -> scroll offset`, function () {
                        const actual = getRectOffset([elA, 'scroll'], [elB, 'scroll']);
                        const expected = {
                            left: -elBContainerLeft,
                            top: -elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure scroll -> default (border) offset`, function () {
                        const actual = getRectOffset([elA, 'scroll'], elB);
                        const expected = {
                            left: borderLeft - elBContainerLeft,
                            top: borderTop - elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure scroll -> border offset`, function () {
                        const actual = getRectOffset([elA, 'scroll'], [elB, 'border']);
                        const expected = {
                            left: borderLeft - elBContainerLeft,
                            top: borderTop - elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure scroll -> margin offset`, function () {
                        const actual = getRectOffset([elA, 'scroll'], [elB, 'margin']);
                        const expected = {
                            left: borderLeft + marginLeft - elBContainerLeft,
                            top: borderTop + marginTop - elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                });
                describe('element (border) -> element (all variations)', function () {
                    it(`should measure border -> content offset`, function () {
                        const actual = getRectOffset([elA, 'border'], [elB, 'content']);
                        const expected = {
                            left: -(elBContainerLeft + paddingLeft + borderLeft),
                            top: -(elBContainerTop + paddingTop + borderTop),
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure border -> padding offset`, function () {
                        const actual = getRectOffset([elA, 'border'], [elB, 'padding']);
                        const expected = {
                            left: -(elBContainerLeft + borderLeft),
                            top: -(elBContainerTop + borderTop),
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure border -> scroll offset`, function () {
                        const actual = getRectOffset([elA, 'border'], [elB, 'scroll']);
                        const expected = {
                            left: -(elBContainerLeft + borderLeft),
                            top: -(elBContainerTop + borderTop),
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure border -> default (border) offset`, function () {
                        const actual = getRectOffset([elA, 'border'], elB);
                        const expected = {
                            left: -elBContainerLeft,
                            top: -elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure border -> border offset`, function () {
                        const actual = getRectOffset([elA, 'border'], [elB, 'border']);
                        const expected = {
                            left: -elBContainerLeft,
                            top: -elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure border -> margin offset`, function () {
                        const actual = getRectOffset([elA, 'border'], [elB, 'margin']);
                        const expected = {
                            left: marginLeft - elBContainerLeft,
                            top: marginTop - elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                });
                describe('element (margin) -> element (all variations)', function () {
                    it(`should measure margin -> content offset`, function () {
                        const actual = getRectOffset([elA, 'margin'], [elB, 'content']);
                        const expected = {
                            left: -(elBContainerLeft + paddingLeft + borderLeft + marginLeft),
                            top: -(elBContainerTop + paddingTop + borderTop + marginTop),
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure margin -> padding offset`, function () {
                        const actual = getRectOffset([elA, 'margin'], [elB, 'padding']);
                        const expected = {
                            left: -(elBContainerLeft + borderLeft + marginLeft),
                            top: -(elBContainerTop + borderTop + marginTop),
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure margin -> scroll offset`, function () {
                        const actual = getRectOffset([elA, 'margin'], [elB, 'scroll']);
                        const expected = {
                            left: -(elBContainerLeft + borderLeft + marginLeft),
                            top: -(elBContainerTop + borderTop + marginTop),
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure margin -> default (border) offset`, function () {
                        const actual = getRectOffset([elA, 'margin'], elB);
                        const expected = {
                            left: -(elBContainerLeft + marginLeft),
                            top: -(elBContainerTop + marginTop),
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure margin -> border offset`, function () {
                        const actual = getRectOffset([elA, 'margin'], [elB, 'border']);
                        const expected = {
                            left: -(elBContainerLeft + marginLeft),
                            top: -(elBContainerTop + marginTop),
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                    it(`should measure margin -> margin offset`, function () {
                        const actual = getRectOffset([elA, 'margin'], [elB, 'margin']);
                        const expected = {
                            left: -elBContainerLeft,
                            top: -elBContainerTop,
                        };
                        chai.assert.deepEqual(actual, expected);
                    });
                });
            });
        });
    });

    describe('getDistance()', function () {
        beforeEach(beforeTest);
        afterEach(afterTest);
        describe('rectA fully within rectB', function () {
            const rectA = { left: 100, top: 100, width: 100, height: 100 };
            const rectB = { left: 0, top: 0, width: 300, height: 300 };
            it('should return null for rectA within rectB', () => {
                const result = getDistance(rectA, rectB);
                chai.assert.isNull(result);
            });
            it('should return null for rectB within rectA', () => {
                const result = getDistance(rectB, rectA);
                chai.assert.isNull(result);
            });
        });
        describe('compass points - separated', function () {
            const rectCenter = { left: 100, top: 100, width: 100, height: 100 };
            it('should return the vertical distance for North (N) placement', () => {
                const rectN = { left: 100, top: 50, width: 100, height: 40 };
                const result = getDistance(rectCenter, rectN);
                chai.assert.strictEqual(result, 10);
            });
            it('should return the diagonal distance for North East (NE) placement', () => {
                const rectNE = { left: 210, top: 50, width: 100, height: 40 };
                const result = getDistance(rectCenter, rectNE);
                chai.assert.strictEqual(result, Math.sqrt(10 * 10 + 10 * 10));
            });
            it('should return the horizontal distance for East (E) placement', () => {
                const rectE = { left: 210, top: 100, width: 100, height: 100 };
                const result = getDistance(rectCenter, rectE);
                chai.assert.strictEqual(result, 10);
            });
            it('should return the diagonal distance for South East (SE) placement', () => {
                const rectSE = { left: 210, top: 210, width: 100, height: 100 };
                const result = getDistance(rectCenter, rectSE);
                chai.assert.strictEqual(result, Math.sqrt(10 * 10 + 10 * 10));
            });
            it('should return the vertical distance for South (S) placement', () => {
                const rectS = { left: 100, top: 210, width: 100, height: 100 };
                const result = getDistance(rectCenter, rectS);
                chai.assert.strictEqual(result, 10);
            });
            it('should return the diagonal distance for South West (SW) placement', () => {
                const rectSW = { left: 50, top: 210, width: 40, height: 100 };
                const result = getDistance(rectCenter, rectSW);
                chai.assert.strictEqual(result, Math.sqrt(10 * 10 + 10 * 10));
            });
            it('should return the horizontal distance for West (W) placement', () => {
                const rectW = { left: 50, top: 100, width: 40, height: 100 };
                const result = getDistance(rectCenter, rectW);
                chai.assert.strictEqual(result, 10);
            });
            it('should return the diagonal distance for North West (NW) placement', () => {
                const rectNW = { left: 50, top: 50, width: 40, height: 40 };
                const result = getDistance(rectCenter, rectNW);
                chai.assert.strictEqual(result, Math.sqrt(10 * 10 + 10 * 10));
            });
        });
        describe('compass points - touching', function () {
            const rectCenter = { left: 100, top: 100, width: 100, height: 100 };
            it('should return zero distance for North (N) placement', () => {
                const rectN = { left: 100, top: 0, width: 100, height: 100 };
                const result = getDistance(rectCenter, rectN);
                chai.assert.strictEqual(result, 0);
            });
            it('should return zero distance for North East (NE) placement', () => {
                const rectNE = { left: 200, top: 0, width: 100, height: 100 };
                const result = getDistance(rectCenter, rectNE);
                chai.assert.strictEqual(result, 0);
            });
            it('should return zero distance for East (E) placement', () => {
                const rectE = { left: 200, top: 100, width: 100, height: 100 };
                const result = getDistance(rectCenter, rectE);
                chai.assert.strictEqual(result, 0);
            });
            it('should return zero distance for South East (SE) placement', () => {
                const rectSE = { left: 200, top: 200, width: 100, height: 100 };
                const result = getDistance(rectCenter, rectSE);
                chai.assert.strictEqual(result, 0);
            });
            it('should return zero distance for South (S) placement', () => {
                const rectS = { left: 100, top: 200, width: 100, height: 100 };
                const result = getDistance(rectCenter, rectS);
                chai.assert.strictEqual(result, 0);
            });
            it('should return zero distance for South West (SW) placement', () => {
                const rectSW = { left: 0, top: 200, width: 100, height: 100 };
                const result = getDistance(rectCenter, rectSW);
                chai.assert.strictEqual(result, 0);
            });
            it('should return zero distance for West (W) placement', () => {
                const rectW = { left: 0, top: 100, width: 100, height: 100 };
                const result = getDistance(rectCenter, rectW);
                chai.assert.strictEqual(result, 0);
            });
            it('should return zero distance for North West (NW) placement', () => {
                const rectNW = { left: 0, top: 0, width: 100, height: 100 };
                const result = getDistance(rectCenter, rectNW);
                chai.assert.strictEqual(result, 0);
            });
        });
        describe('compass points - intersecting', function () {
            const rectCenter = { left: 100, top: 100, width: 100, height: 100 };
            it('should return null for slight North (N) intersection', () => {
                const rectN = { left: 100, top: 0.01, width: 100, height: 100 };
                const result = getDistance(rectCenter, rectN);
                chai.assert.isNull(result);
            });
            it('should return null for slight North East (NE) intersection', () => {
                const rectNE = { left: 199.99, top: 0.01, width: 100, height: 100 };
                const result = getDistance(rectCenter, rectNE);
                chai.assert.isNull(result);
            });
            it('should return null for slight East (E) intersection', () => {
                const rectE = { left: 199.99, top: 100, width: 100, height: 100 };
                const result = getDistance(rectCenter, rectE);
                chai.assert.isNull(result);
            });
            it('should return null for slight South East (SE) intersection', () => {
                const rectSE = { left: 199.99, top: 199.99, width: 100, height: 100 };
                const result = getDistance(rectCenter, rectSE);
                chai.assert.isNull(result);
            });
            it('should return null for slight South (S) intersection', () => {
                const rectS = { left: 100, top: 199.99, width: 100, height: 100 };
                const result = getDistance(rectCenter, rectS);
                chai.assert.isNull(result);
            });
            it('should return null for slight South West (SW) intersection', () => {
                const rectSW = { left: 0.01, top: 199.99, width: 100, height: 100 };
                const result = getDistance(rectCenter, rectSW);
                chai.assert.isNull(result);
            });
            it('should return null for slight West (W) intersection', () => {
                const rectW = { left: 0.01, top: 100, width: 100, height: 100 };
                const result = getDistance(rectCenter, rectW);
                chai.assert.isNull(result);
            });
            it('should return null for slight North West (NW) intersection', () => {
                const rectNW = { left: 0.01, top: 0.01, width: 100, height: 100 };
                const result = getDistance(rectCenter, rectNW);
                chai.assert.isNull(result);
            });
        });
        describe('DOM elements', function () {
            it('should return the distance between two non-overlapping DOM elements', function () {
                const elA = createTestElement({
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: '100px',
                    height: '100px',
                });
                const elB = createTestElement({
                    position: 'absolute',
                    left: '200px',
                    top: '200px',
                    width: '100px',
                    height: '100px',
                });
                const result = getDistance(elA, elB);
                chai.assert.strictEqual(result, Math.sqrt(100 ** 2 + 100 ** 2));
            });
            it('should account for the box edge accordingly', function () {
                const elA = createTestElement({
                    boxSizing: 'border-box',
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: '100px',
                    height: '100px',
                    padding: '10px',
                    border: '5px solid black',
                });
                const elB = createTestElement({
                    boxSizing: 'border-box',
                    position: 'absolute',
                    left: '100px',
                    top: '0px',
                    width: '100px',
                    height: '100px',
                    padding: '10px',
                    border: '5px solid black',
                });
                const result = getDistance([elA, 'content'], [elB, 'padding']);
                const expectedDistance = 20;
                chai.assert.strictEqual(result, expectedDistance);
            });
            it('should return null for overlapping DOM elements', function () {
                const elA = createTestElement({
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: '100px',
                    height: '100px',
                });
                const elB = createTestElement({
                    position: 'absolute',
                    left: '50px',
                    top: '50px',
                    width: '100px',
                    height: '100px',
                });
                const result = getDistance(elA, elB);
                chai.assert.isNull(result);
            });
        });
    });

    describe('getIntersection()', function () {
        beforeEach(beforeTest);
        afterEach(afterTest);
        describe('basic tests with BoxRects', () => {
            it('should return a new object', () => {
                const rectA = { left: 0, top: 0, width: 100, height: 100 };
                const result = getIntersection(rectA);
                chai.assert.notEqual(result, rectA);
            });
            it('should return the first element rect if no other elements are provided', () => {
                const rectA = { left: 0, top: 0, width: 100, height: 100 };
                const result = getIntersection(rectA);
                chai.assert.deepEqual(result, { ...rectA, right: 100, bottom: 100 });
            });
            it('should return the intersection area of two overlapping elements', () => {
                const rectA = { left: 0, top: 0, width: 100, height: 100 };
                const rectB = { left: 50, top: 50, width: 150, height: 150 };
                const result = getIntersection(rectA, rectB);
                chai.assert.deepEqual(result, {
                    left: 50,
                    top: 50,
                    width: 50,
                    height: 50,
                    right: 100,
                    bottom: 100,
                });
            });
            it('should return the intersection area of three overlapping elements', () => {
                const rectA = { left: 0, top: 0, width: 100, height: 100 };
                const rectB = { left: 50, top: 50, width: 150, height: 150 };
                const rectC = { left: 60, top: 60, width: 10, height: 200 };
                const result = getIntersection(rectA, rectB, rectC);
                chai.assert.deepEqual(result, {
                    left: 60,
                    top: 60,
                    width: 10,
                    height: 40,
                    right: 70,
                    bottom: 100,
                });
            });
            it('should return null for non-overlapping elements', () => {
                const rectA = { left: 0, top: 0, width: 100, height: 100 };
                const rectB = { left: 200, top: 200, width: 100, height: 100 };
                const result = getIntersection(rectA, rectB);
                chai.assert.isNull(result);
            });
        });
        describe('DOM elements', function () {
            it('should return the intersection area of two overlapping DOM elements', function () {
                const elA = createTestElement({
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: '100px',
                    height: '100px',
                });
                const elB = createTestElement({
                    position: 'absolute',
                    left: '50px',
                    top: '50px',
                    width: '150px',
                    height: '150px',
                });
                const result = getIntersection(elA, elB);
                chai.assert.deepEqual(result, {
                    left: 50,
                    top: 50,
                    width: 50,
                    height: 50,
                    right: 100,
                    bottom: 100,
                });
            });
            it('should return the intersection area of a DOM element and a rect object', function () {
                const el = createTestElement({
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: '100px',
                    height: '100px',
                });
                const rectObject = { left: 50, top: 50, width: 100, height: 100 };
                const result = getIntersection(el, rectObject);
                chai.assert.deepEqual(result, {
                    left: 50,
                    top: 50,
                    width: 50,
                    height: 50,
                    right: 100,
                    bottom: 100,
                });
            });
            it('should return null for non-overlapping DOM elements', function () {
                const elA = createTestElement({
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: '100px',
                    height: '100px',
                });
                const elB = createTestElement({
                    position: 'absolute',
                    left: '200px',
                    top: '200px',
                    width: '100px',
                    height: '100px',
                });
                const result = getIntersection(elA, elB);
                chai.assert.isNull(result);
            });
            it('should consider box edges for the calculations', function () {
                const elA = createTestElement({
                    boxSizing: 'border-box',
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: '120px',
                    height: '120px',
                    padding: '10px',
                    border: '5px solid black',
                });
                const result = getIntersection([elA, 'content'], [elA, 'border']);
                chai.assert.deepEqual(result, {
                    left: 15,
                    top: 15,
                    width: 90,
                    height: 90,
                    right: 105,
                    bottom: 105,
                });
            });
        });
    });

    describe('getOverflow()', function () {
        beforeEach(beforeTest);
        afterEach(afterTest);
        describe('basic tests with BoxRects', () => {
            it('should calculate the overflow for a fully contained box', () => {
                const container = { left: 0, top: 0, width: 200, height: 200 };
                const target = { left: 50, top: 50, width: 100, height: 100 };
                const result = getOverflow(target, container);
                chai.assert.deepEqual(result, { left: -50, right: -50, top: -50, bottom: -50 });
            });
            it('should calculate the overflow for a non-overlapping box', () => {
                const container = { left: 0, top: 0, width: 100, height: 100 };
                const target = { left: 200, top: 200, width: 100, height: 100 };
                const result = getOverflow(target, container);
                chai.assert.deepEqual(result, { left: -200, right: 200, top: -200, bottom: 200 });
            });
            it('should calculate the overflow for a partially overlapping box', () => {
                const container = { left: 0, top: 0, width: 150, height: 150 };
                const target = { left: 100, top: 100, width: 100, height: 100 };
                const result = getOverflow(target, container);
                chai.assert.deepEqual(result, { left: -100, right: 50, top: -100, bottom: 50 });
            });
        });
        describe('DOM elements', function () {
            it('should calculate the overflow for a fully contained DOM element', function () {
                const container = createTestElement({
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: '200px',
                    height: '200px',
                });
                const target = createTestElement({
                    position: 'absolute',
                    left: '50px',
                    top: '50px',
                    width: '100px',
                    height: '100px',
                });
                const result = getOverflow(target, container);
                chai.assert.deepEqual(result, { left: -50, right: -50, top: -50, bottom: -50 });
            });
            it('should calculate the overflow for a non-overlapping DOM element', function () {
                const container = createTestElement({
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: '100px',
                    height: '100px',
                });
                const target = createTestElement({
                    position: 'absolute',
                    left: '200px',
                    top: '200px',
                    width: '100px',
                    height: '100px',
                });
                const result = getOverflow(target, container);
                chai.assert.deepEqual(result, { left: -200, right: 200, top: -200, bottom: 200 });
            });
            it('should consider box edges for the overflow calculations', function () {
                const container = createTestElement({
                    boxSizing: 'border-box',
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: '120px',
                    height: '120px',
                    padding: '10px',
                    border: '5px solid black',
                });
                const target = createTestElement({
                    boxSizing: 'border-box',
                    position: 'absolute',
                    left: '0px',
                    top: '0px',
                    width: '140px',
                    height: '140px',
                    border: '5px solid black',
                    margin: '10px',
                });
                const result = getOverflow([target, 'margin'], [container, 'content']);
                chai.assert.deepEqual(result, { left: 15, right: 55, top: 15, bottom: 55 });
            });
        });
        describe('compass points', () => {
            const container = { left: 0, top: 0, width: 200, height: 200 };
            const compassPoints = [
                {
                    direction: 'North (N)',
                    nonIntersect: {
                        rect: { left: 0, top: -250, width: 200, height: 200 },
                        expected: { left: 0, right: 0, top: 250, bottom: -250 },
                    },
                    intersect: {
                        rect: { left: 0, top: -150, width: 200, height: 200 },
                        expected: { left: 0, right: 0, top: 150, bottom: -150 },
                    },
                },
                {
                    direction: 'South (S)',
                    nonIntersect: {
                        rect: { left: 0, top: 250, width: 200, height: 200 },
                        expected: { left: 0, right: 0, top: -250, bottom: 250 },
                    },
                    intersect: {
                        rect: { left: 0, top: 150, width: 200, height: 200 },
                        expected: { left: 0, right: 0, top: -150, bottom: 150 },
                    },
                },
                // Fix the rest!
                {
                    direction: 'East (E)',
                    nonIntersect: {
                        rect: { left: 250, top: 0, width: 200, height: 200 },
                        expected: { left: -250, right: 250, top: 0, bottom: 0 },
                    },
                    intersect: {
                        rect: { left: 150, top: 0, width: 200, height: 200 },
                        expected: { left: -150, right: 150, top: 0, bottom: 0 },
                    },
                },
                {
                    direction: 'West (W)',
                    nonIntersect: {
                        rect: { left: -250, top: 0, width: 200, height: 200 },
                        expected: { left: 250, right: -250, top: 0, bottom: 0 },
                    },
                    intersect: {
                        rect: { left: -150, top: 0, width: 200, height: 200 },
                        expected: { left: 150, right: -150, top: 0, bottom: 0 },
                    },
                },
                {
                    direction: 'Northwest (NW)',
                    nonIntersect: {
                        rect: { left: -250, top: -250, width: 200, height: 200 },
                        expected: { left: 250, right: -250, top: 250, bottom: -250 },
                    },
                    intersect: {
                        rect: { left: -150, top: -150, width: 200, height: 200 },
                        expected: { left: 150, right: -150, top: 150, bottom: -150 },
                    },
                },
                {
                    direction: 'Southeast (SE)',
                    nonIntersect: {
                        rect: { left: 250, top: 250, width: 200, height: 200 },
                        expected: { left: -250, right: 250, top: -250, bottom: 250 },
                    },
                    intersect: {
                        rect: { left: 150, top: 150, width: 200, height: 200 },
                        expected: { left: -150, right: 150, top: -150, bottom: 150 },
                    },
                },
                {
                    direction: 'Southwest (SW)',
                    nonIntersect: {
                        rect: { left: -250, top: 250, width: 200, height: 200 },
                        expected: { left: 250, right: -250, top: -250, bottom: 250 },
                    },
                    intersect: {
                        rect: { left: -150, top: 150, width: 200, height: 200 },
                        expected: { left: 150, right: -150, top: -150, bottom: 150 },
                    },
                },
                {
                    direction: 'Northeast (NE)',
                    nonIntersect: {
                        rect: { left: 250, top: -250, width: 200, height: 200 },
                        expected: { left: -250, right: 250, top: 250, bottom: -250 },
                    },
                    intersect: {
                        rect: { left: 150, top: -150, width: 200, height: 200 },
                        expected: { left: -150, right: 150, top: 150, bottom: -150 },
                    },
                },
            ];
            compassPoints.forEach((point) => {
                describe(point.direction, () => {
                    it(`${point.direction}: target is not intersecting container`, () => {
                        const result = getOverflow(point.nonIntersect.rect, container);
                        chai.assert.deepEqual(result, point.nonIntersect.expected);
                    });
                    it(`${point.direction}: target is intersecting container`, () => {
                        const result = getOverflow(point.intersect.rect, container);
                        chai.assert.deepEqual(result, point.intersect.expected);
                    });
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
    const CONTAINING_BLOCK_SPECIAL_CASES = [
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
            CONTAINING_BLOCK_SPECIAL_CASES.forEach(({ property, value, containsInline }) => {
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
            CONTAINING_BLOCK_SPECIAL_CASES.forEach(({ property, value, containsInline }) => {
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
        describe('position option', function () {
            it('should be able to fake fixed position for absolute positioned element', function () {
                container.style.display = 'block';
                container.style.position = 'relative';
                el.style.position = 'absolute';
                const actual = getContainingBlock(el, { position: 'fixed' });
                const expected = window;
                chai.assert.equal(actual, expected);
            });
            it('should be able to fake absolute position for fixed positioned element', function () {
                container.style.display = 'block';
                container.style.position = 'relative';
                el.style.position = 'fixed';
                const actual = getContainingBlock(el, { position: 'absolute' });
                const expected = container;
                chai.assert.equal(actual, expected);
            });
            it('should be able to fake relative position for fixed positioned element', function () {
                container.style.display = 'block';
                el.style.position = 'fixed';
                const actual = getContainingBlock(el, { position: 'relative' });
                const expected = container;
                chai.assert.equal(actual, expected);
            });
            it('should be able to fake fixed position for relative positioned element', function () {
                container.style.display = 'block';
                el.style.position = 'relative';
                const actual = getContainingBlock(el, { position: 'fixed' });
                const expected = window;
                chai.assert.equal(actual, expected);
            });
            it('should be able to fake relative position for absolute positioned element', function () {
                container.style.display = 'block';
                container.style.position = 'static';
                el.style.position = 'absolute';
                const actual = getContainingBlock(el, { position: 'relative' });
                const expected = container;
                chai.assert.equal(actual, expected);
            });
            it('should be able to fake absolute position for relative positioned element', function () {
                document.body.style.position = 'relative';
                container.style.display = 'block';
                el.style.position = 'relative';
                const actual = getContainingBlock(el, { position: 'absolute' });
                const expected = document.body;
                chai.assert.equal(actual, expected);
            });
        });
    });

    describe('getOffsetContainer()', function () {
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
            function getExpectedOffsetContainer(...args) {
                const value = getContainingBlock(...args);
                return value === window ? document : value;
            }
            beforeEach(function () {
                el.style.position = 'absolute';
            });
            it('should return document if no offset container ancestor is found', function () {
                const actual = getOffsetContainer(el);
                const expected = getExpectedOffsetContainer(el);
                chai.assert.equal(actual, expected);
            });
            ['relative', 'absolute', 'fixed', 'sticky'].forEach((position) => {
                it(`should recognize block-level "position:${position}" ancestors`, function () {
                    container.style.display = 'block';
                    container.style.position = position;
                    const actual = getOffsetContainer(el);
                    const expected = getExpectedOffsetContainer(el);
                    chai.assert.equal(actual, expected);
                });
                it(`should recognize inline-level "position:${position}" ancestors`, function () {
                    container.style.display = 'inline';
                    container.style.position = position;
                    const actual = getOffsetContainer(el);
                    const expected = getExpectedOffsetContainer(el);
                    chai.assert.equal(actual, expected);
                });
                it(`should recognize "display:none" "position:${position}" ancestors`, function () {
                    container.style.display = 'none';
                    container.style.position = position;
                    const actual = getOffsetContainer(el);
                    const expected = getExpectedOffsetContainer(el);
                    chai.assert.equal(actual, expected);
                });
            });
            CONTAINING_BLOCK_SPECIAL_CASES.forEach(({ property, value, containsInline }) => {
                it(`should recognize block-level "position:static" "${property}:${value}" ancestors`, function () {
                    container.style.display = 'block';
                    container.style.position = 'static';
                    container.style[property] = value;
                    const actual = getOffsetContainer(el);
                    const expected = getExpectedOffsetContainer(el);
                    chai.assert.equal(actual, expected);
                });
                if (containsInline) {
                    it(`should recognize inline-level "position:static" "${property}:${value}" ancestors`, function () {
                        container.style.display = 'inline';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el);
                        const expected = getExpectedOffsetContainer(el);
                        chai.assert.equal(actual, expected);
                    });
                    it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors by default`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el);
                        const expected = getExpectedOffsetContainer(el);
                        chai.assert.equal(actual, expected);
                    });
                    it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is false`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el, { skipDisplayNone: false });
                        const expected = getExpectedOffsetContainer(el, { skipDisplayNone: false });
                        chai.assert.equal(actual, expected);
                    });
                    it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is true`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el, { skipDisplayNone: true });
                        const expected = getExpectedOffsetContainer(el, { skipDisplayNone: true });
                        chai.assert.equal(actual, expected);
                    });
                }
                else {
                    it(`should not recognize inline-level "position:static" "${property}:${value}" ancestors`, function () {
                        container.style.display = 'inline';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el);
                        const expected = getExpectedOffsetContainer(el);
                        chai.assert.equal(actual, expected);
                    });
                    it(`should return null on "display:none" "position:static" "${property}:${value}" ancestors by default`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el);
                        const expected = getExpectedOffsetContainer(el);
                        chai.assert.equal(actual, expected);
                    });
                    it(`should return null on "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is false`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el, { skipDisplayNone: false });
                        const expected = getExpectedOffsetContainer(el, { skipDisplayNone: false });
                        chai.assert.equal(actual, expected);
                    });
                    it(`should skip "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is true`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getContainingBlock(el, { skipDisplayNone: true });
                        const expected = getExpectedOffsetContainer(el, { skipDisplayNone: true });
                        chai.assert.equal(actual, expected);
                    });
                }
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
                    const actual = getOffsetContainer(el);
                    const expected = getContainingBlock(el);
                    chai.assert.equal(actual, expected);
                });
                it(`should not recognize inline-level "position:${position}" ancestors`, function () {
                    container.style.display = 'inline';
                    container.style.position = position;
                    const actual = getOffsetContainer(el);
                    const expected = getContainingBlock(el);
                    chai.assert.equal(actual, expected);
                });
                it(`should return null on "display:none" "position:${position}" ancestors by default`, function () {
                    container.style.display = 'none';
                    container.style.position = position;
                    const actual = getOffsetContainer(el);
                    const expected = getContainingBlock(el);
                    chai.assert.equal(actual, expected);
                });
                it(`should return null on "display:none" "position:${position}" ancestors when skipDisplayNone option is false`, function () {
                    container.style.display = 'none';
                    container.style.position = position;
                    const actual = getOffsetContainer(el);
                    const expected = getContainingBlock(el);
                    chai.assert.equal(actual, expected);
                });
                it(`should skip "display:none" "position:${position}" ancestors when skipDisplayNone option is true`, function () {
                    container.style.display = 'none';
                    container.style.position = position;
                    const actual = getOffsetContainer(el);
                    const expected = getContainingBlock(el);
                    chai.assert.equal(actual, expected);
                });
            });
            CONTAINING_BLOCK_SPECIAL_CASES.forEach(({ property, value, containsInline }) => {
                it(`should recognize block-level "position:static" "${property}:${value}" ancestors`, function () {
                    container.style.display = 'block';
                    container.style.position = 'static';
                    container.style[property] = value;
                    const actual = getOffsetContainer(el);
                    const expected = getContainingBlock(el);
                    chai.assert.equal(actual, expected);
                });
                if (containsInline) {
                    it(`should recognize inline-level "position:static" "${property}:${value}" ancestors`, function () {
                        container.style.display = 'inline';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getOffsetContainer(el);
                        const expected = getContainingBlock(el);
                        chai.assert.equal(actual, expected);
                    });
                    it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors by default`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getOffsetContainer(el);
                        const expected = getContainingBlock(el);
                        chai.assert.equal(actual, expected);
                    });
                    it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is false`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getOffsetContainer(el, { skipDisplayNone: false });
                        const expected = getContainingBlock(el, { skipDisplayNone: false });
                        chai.assert.equal(actual, expected);
                    });
                    it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is true`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getOffsetContainer(el, { skipDisplayNone: true });
                        const expected = getContainingBlock(el, { skipDisplayNone: true });
                        chai.assert.equal(actual, expected);
                    });
                }
                else {
                    it(`should not recognize inline-level "position:static" "${property}:${value}" ancestors`, function () {
                        container.style.display = 'inline';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getOffsetContainer(el);
                        const expected = getContainingBlock(el);
                        chai.assert.equal(actual, expected);
                    });
                    it(`should return null on "display:none" "position:static" "${property}:${value}" ancestors by default`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getOffsetContainer(el);
                        const expected = getContainingBlock(el);
                        chai.assert.equal(actual, expected);
                    });
                    it(`should return null on "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is false`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getOffsetContainer(el, { skipDisplayNone: false });
                        const expected = getContainingBlock(el, { skipDisplayNone: false });
                        chai.assert.equal(actual, expected);
                    });
                    it(`should skip "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is true`, function () {
                        container.style.display = 'none';
                        container.style.position = 'static';
                        container.style[property] = value;
                        const actual = getOffsetContainer(el, { skipDisplayNone: true });
                        const expected = getContainingBlock(el, { skipDisplayNone: true });
                        chai.assert.equal(actual, expected);
                    });
                }
            });
        });
        describe('relative positioned element', function () {
            it(`should always return the provided element if it's relative positioned`, function () {
                el.style.position = 'relative';
                const actual = getOffsetContainer(el);
                const expected = el;
                chai.assert.equal(actual, expected);
            });
        });
        describe('static positioned element', function () {
            it(`should return null if the provided element is static positioned`, function () {
                el.style.position = 'static';
                const actual = getOffsetContainer(el);
                const expected = null;
                chai.assert.equal(actual, expected);
            });
        });
        describe('sticky positioned element', function () {
            it(`should return null if the provided element is sticky positioned`, function () {
                el.style.position = 'sticky';
                const actual = getOffsetContainer(el);
                const expected = null;
                chai.assert.equal(actual, expected);
            });
        });
    });

}));
