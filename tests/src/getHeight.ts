import { assert } from 'chai';
import { beforeTest, afterTest } from './utils/hooks.js';
import { createTestElement } from './utils/createTestElement.js';
import { getHeight } from '../../src/index.js';
import { getScrollbarSizes } from './utils/getScrollbarSizes.js';

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
      assert.strictEqual(getHeight(document, 'content'), expected, 'content');
      assert.strictEqual(getHeight(document, 'padding'), expected, 'padding');
    });

    it('should measure height with scrollbar', function () {
      const expected = elHeight + window.innerHeight - document.documentElement.clientHeight;
      assert.strictEqual(getHeight(document, 'scroll'), expected, 'scroll');
      assert.strictEqual(getHeight(document), expected, 'default');
      assert.strictEqual(getHeight(document, 'border'), expected, 'border');
      assert.strictEqual(getHeight(document, 'margin'), expected, 'margin');
    });
  });

  describe('window', function () {
    it('should measure height without scrollbar', function () {
      document.documentElement.style.overflow = 'scroll';
      const expected = document.documentElement.clientHeight;
      assert.strictEqual(getHeight(window, 'content'), expected, 'content');
      assert.strictEqual(getHeight(window, 'padding'), expected, 'padding');
    });

    it('should measure height with scrollbar', function () {
      const expected = window.innerHeight;
      assert.strictEqual(getHeight(window, 'scroll'), expected, 'scroll');
      assert.strictEqual(getHeight(window), expected, 'default');
      assert.strictEqual(getHeight(window, 'border'), expected, 'border');
      assert.strictEqual(getHeight(window, 'margin'), expected, 'margin');
    });
  });

  describe('element', function () {
    const testElementDimensions = (boxSizing: 'border-box' | 'content-box') => {
      let el: HTMLElement;

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
        const expected =
          boxSizing === 'content-box'
            ? height - sbHeight
            : height - sbHeight - paddingTop - paddingBottom - borderWidthTop - borderWidthBottom;
        assert.equal(actual, expected, `content - ${boxSizing}`);
      });

      it(`should measure padding height for ${boxSizing}`, function () {
        const actual = getHeight(el, 'padding');
        const expected =
          boxSizing === 'content-box'
            ? height - sbHeight + paddingTop + paddingBottom
            : height - sbHeight - borderWidthTop - borderWidthBottom;
        assert.equal(actual, expected, `padding - ${boxSizing}`);
      });

      it(`should measure scroll height for ${boxSizing}`, function () {
        const actual = getHeight(el, 'scroll');
        const expected =
          boxSizing === 'content-box'
            ? height + paddingTop + paddingBottom
            : height - borderWidthTop - borderWidthBottom;
        assert.equal(actual, expected, `scroll - ${boxSizing}`);
      });

      it(`should measure default height for ${boxSizing}`, function () {
        const actual = getHeight(el);
        const expected =
          boxSizing === 'content-box'
            ? height + paddingTop + paddingBottom + borderWidthTop + borderWidthBottom
            : height;
        assert.equal(actual, expected, `default - ${boxSizing}`);
      });

      it(`should measure border height for ${boxSizing}`, function () {
        const actual = getHeight(el, 'border');
        const expected =
          boxSizing === 'content-box'
            ? height + paddingTop + paddingBottom + borderWidthTop + borderWidthBottom
            : height;
        assert.equal(actual, expected, `border - ${boxSizing}`);
      });

      it(`should measure margin height for ${boxSizing}`, function () {
        const actual = getHeight(el, 'margin');
        const expected =
          boxSizing === 'content-box'
            ? height +
              paddingTop +
              paddingBottom +
              borderWidthTop +
              borderWidthBottom +
              marginLeft +
              marginRight
            : height + marginLeft + marginRight;
        assert.equal(actual, expected, `margin - ${boxSizing}`);
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
