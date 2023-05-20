"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const hooks_js_1 = require("./utils/hooks.js");
const createTestElement_js_1 = require("./utils/createTestElement.js");
const index_js_1 = require("../../src/index.js");
const getScrollbarSizes_js_1 = require("./utils/getScrollbarSizes.js");
describe('dimensions: getWidth() and getHeight()', () => {
    beforeEach(hooks_js_1.beforeTest);
    afterEach(hooks_js_1.afterTest);
    const { width: sbWidth, height: sbHeight } = (0, getScrollbarSizes_js_1.getScrollbarSizes)();
    it(`should measure the document's width and height`, function () {
        const elWidth = 10000;
        const elHeight = 10000;
        let expectedWidth = 0;
        let expectedHeight = 0;
        const el = (0, createTestElement_js_1.createTestElement)({
            position: 'absolute',
            left: '0px',
            top: '0px',
            width: `${elWidth}px`,
            height: `${elHeight}px`,
        });
        expectedWidth = elWidth;
        expectedHeight = elHeight;
        chai_1.assert.strictEqual((0, index_js_1.getWidth)(document, 'content'), expectedWidth, 'getWidth(document, "content")');
        chai_1.assert.strictEqual((0, index_js_1.getHeight)(document, 'content'), expectedHeight, 'getHeight(document, "content")');
        chai_1.assert.strictEqual((0, index_js_1.getRect)([document, 'content']).width, expectedWidth, 'getRect([document, "content"]).width');
        chai_1.assert.strictEqual((0, index_js_1.getRect)([document, 'content']).height, expectedHeight, 'getRect([document, "content"]).height');
        chai_1.assert.strictEqual((0, index_js_1.getWidth)(document, 'padding'), expectedWidth, 'getWidth(document, "padding")');
        chai_1.assert.strictEqual((0, index_js_1.getHeight)(document, 'padding'), expectedHeight, 'getHeight(document, "padding")');
        chai_1.assert.strictEqual((0, index_js_1.getRect)([document, 'padding']).width, expectedWidth, 'getRect([document, "padding"]).width');
        chai_1.assert.strictEqual((0, index_js_1.getRect)([document, 'padding']).height, expectedHeight, 'getRect([document, "padding"]).height');
        expectedWidth = elWidth + window.innerWidth - document.documentElement.clientWidth;
        expectedHeight = elHeight + window.innerHeight - document.documentElement.clientHeight;
        chai_1.assert.strictEqual((0, index_js_1.getWidth)(document, 'scroll'), expectedWidth, 'getWidth(document, "scroll")');
        chai_1.assert.strictEqual((0, index_js_1.getHeight)(document, 'scroll'), expectedHeight, 'getHeight(document, "padding")');
        chai_1.assert.strictEqual((0, index_js_1.getRect)([document, 'scroll']).width, expectedWidth, 'getRect([document, "scroll"]).width');
        chai_1.assert.strictEqual((0, index_js_1.getRect)([document, 'scroll']).height, expectedHeight, 'getRect([document, "scroll"]).height');
        chai_1.assert.strictEqual((0, index_js_1.getWidth)(document, 'border'), expectedWidth, 'getWidth(document, "border")');
        chai_1.assert.strictEqual((0, index_js_1.getHeight)(document, 'border'), expectedHeight, 'getHeight(document, "border")');
        chai_1.assert.strictEqual((0, index_js_1.getRect)([document, 'border']).width, expectedWidth, 'getRect([document, "border"]).width');
        chai_1.assert.strictEqual((0, index_js_1.getRect)([document, 'border']).height, expectedHeight, 'getRect([document, "border"]).height');
        chai_1.assert.strictEqual((0, index_js_1.getWidth)(document), expectedWidth, 'getWidth(document)');
        chai_1.assert.strictEqual((0, index_js_1.getHeight)(document), expectedHeight, 'getHeight(document)');
        chai_1.assert.strictEqual((0, index_js_1.getRect)(document).width, expectedWidth, 'getRect(document).width');
        chai_1.assert.strictEqual((0, index_js_1.getRect)(document).height, expectedHeight, 'getRect(document).height');
        chai_1.assert.strictEqual((0, index_js_1.getWidth)(document, 'margin'), expectedWidth, 'width - "margin"');
        chai_1.assert.strictEqual((0, index_js_1.getHeight)(document, 'margin'), expectedHeight, 'height - "margin"');
        chai_1.assert.strictEqual((0, index_js_1.getRect)([document, 'margin']).width, expectedWidth, 'getRect([document, "margin"]).width');
        chai_1.assert.strictEqual((0, index_js_1.getRect)([document, 'margin']).height, expectedHeight, 'getRect([document, "margin"]).height');
        el.remove();
    });
    it(`should measure the window's width and height`, function () {
        let expectedWidth = 0;
        let expectedHeight = 0;
        document.documentElement.style.overflow = 'scroll';
        expectedWidth = document.documentElement.clientWidth;
        expectedHeight = document.documentElement.clientHeight;
        chai_1.assert.strictEqual((0, index_js_1.getWidth)(window, 'content'), expectedWidth, 'width - "content"');
        chai_1.assert.strictEqual((0, index_js_1.getWidth)(window, 'padding'), expectedWidth, 'width - "padding"');
        chai_1.assert.strictEqual((0, index_js_1.getHeight)(window, 'content'), expectedHeight, 'height - "content"');
        chai_1.assert.strictEqual((0, index_js_1.getHeight)(window, 'padding'), expectedHeight, 'height - "padding"');
        expectedWidth = window.innerWidth;
        expectedHeight = window.innerHeight;
        chai_1.assert.strictEqual((0, index_js_1.getWidth)(window), expectedWidth, 'width - ""');
        chai_1.assert.strictEqual((0, index_js_1.getWidth)(window, 'scroll'), expectedWidth, 'width - "scroll"');
        chai_1.assert.strictEqual((0, index_js_1.getWidth)(window, 'border'), expectedWidth, 'width - "border"');
        chai_1.assert.strictEqual((0, index_js_1.getWidth)(window, 'margin'), expectedWidth, 'width - "margin"');
        chai_1.assert.strictEqual((0, index_js_1.getHeight)(window), expectedHeight, 'height - ""');
        chai_1.assert.strictEqual((0, index_js_1.getHeight)(window, 'scroll'), expectedHeight, 'height - "scroll"');
        chai_1.assert.strictEqual((0, index_js_1.getHeight)(window, 'border'), expectedHeight, 'height - "border"');
        chai_1.assert.strictEqual((0, index_js_1.getHeight)(window, 'margin'), expectedHeight, 'height - "margin"');
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
        const el = (0, createTestElement_js_1.createTestElement)({
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
        chai_1.assert.equal((0, index_js_1.getWidth)(el, 'content'), contentWidth, 'width - "content"');
        const contentHeight = height - sbHeight;
        chai_1.assert.equal((0, index_js_1.getHeight)(el, 'content'), contentHeight, 'height - "content"');
        const paddingWidth = contentWidth + paddingLeft + paddingRight;
        chai_1.assert.equal((0, index_js_1.getWidth)(el, 'padding'), paddingWidth, 'width - "padding"');
        const paddingHeight = contentHeight + paddingTop + paddingBottom;
        chai_1.assert.equal((0, index_js_1.getHeight)(el, 'padding'), paddingHeight, 'height - "padding"');
        const scrollWidth = paddingWidth + sbWidth;
        chai_1.assert.equal((0, index_js_1.getWidth)(el, 'scroll'), scrollWidth, 'width - "scroll"');
        const scrollHeight = paddingHeight + sbHeight;
        chai_1.assert.equal((0, index_js_1.getHeight)(el, 'scroll'), scrollHeight, 'height - "scroll"');
        const borderWidth = scrollWidth + borderWidthLeft + borderWidthRight;
        chai_1.assert.equal((0, index_js_1.getWidth)(el, 'border'), borderWidth, 'width - "border"');
        chai_1.assert.equal((0, index_js_1.getWidth)(el), borderWidth, 'width - ""');
        const borderHeight = scrollHeight + borderWidthTop + borderWidthBottom;
        chai_1.assert.equal((0, index_js_1.getHeight)(el, 'border'), borderHeight, 'height - "border"');
        chai_1.assert.equal((0, index_js_1.getHeight)(el), borderHeight, 'height - ""');
        const marginWidth = borderWidth + marginLeft + marginRight;
        chai_1.assert.equal((0, index_js_1.getWidth)(el, 'margin'), marginWidth, 'width - "margin"');
        const marginHeight = borderHeight + marginTop + marginBottom;
        chai_1.assert.equal((0, index_js_1.getHeight)(el, 'margin'), marginHeight, 'height - "margin"');
        el.remove();
    });
});
