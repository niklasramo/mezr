import { assert } from 'chai';
import { beforeTest, afterTest } from './utils/hooks.js';
import { createTestElement } from './utils/createTestElement.js';
import { getWidth } from '../../src/index.js';
import { getScrollbarSizes } from './utils/getScrollbarSizes.js';

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
      assert.strictEqual(getWidth(document, 'content'), expected, 'content');
      assert.strictEqual(getWidth(document, 'padding'), expected, 'padding');
    });

    it('should measure height with scrollbar', function () {
      const expected = elWidth + window.innerWidth - document.documentElement.clientWidth;
      assert.strictEqual(getWidth(document, 'scroll'), expected, 'scroll');
      assert.strictEqual(getWidth(document), expected, 'default');
      assert.strictEqual(getWidth(document, 'border'), expected, 'border');
      assert.strictEqual(getWidth(document, 'margin'), expected, 'margin');
    });
  });

  describe('window', function () {
    it('should measure width without scrollbar', function () {
      document.documentElement.style.overflow = 'scroll';
      const expected = document.documentElement.clientWidth;
      assert.strictEqual(getWidth(window, 'content'), expected, 'content');
      assert.strictEqual(getWidth(window, 'padding'), expected, 'padding');
    });

    it('should measure width with scrollbar', function () {
      const expected = window.innerWidth;
      assert.strictEqual(getWidth(window, 'scroll'), expected, 'scroll');
      assert.strictEqual(getWidth(window), expected, 'default');
      assert.strictEqual(getWidth(window, 'border'), expected, 'border');
      assert.strictEqual(getWidth(window, 'margin'), expected, 'margin');
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

      it(`should measure content width for ${boxSizing}`, function () {
        const actual = getWidth(el, 'content');
        const expected =
          boxSizing === 'content-box'
            ? width - sbWidth
            : width - sbWidth - paddingLeft - paddingRight - borderWidthLeft - borderWidthRight;
        assert.equal(actual, expected, `content - ${boxSizing}`);
      });

      it(`should measure padding width for ${boxSizing}`, function () {
        const actual = getWidth(el, 'padding');
        const expected =
          boxSizing === 'content-box'
            ? width - sbWidth + paddingLeft + paddingRight
            : width - sbWidth - borderWidthLeft - borderWidthRight;
        assert.equal(actual, expected, `padding - ${boxSizing}`);
      });

      it(`should measure scroll width for ${boxSizing}`, function () {
        const actual = getWidth(el, 'scroll');
        const expected =
          boxSizing === 'content-box'
            ? width + paddingLeft + paddingRight
            : width - borderWidthLeft - borderWidthRight;
        assert.equal(actual, expected, `scroll - ${boxSizing}`);
      });

      it(`should measure default width for ${boxSizing}`, function () {
        const actual = getWidth(el);
        const expected =
          boxSizing === 'content-box'
            ? width + paddingLeft + paddingRight + borderWidthLeft + borderWidthRight
            : width;
        assert.equal(actual, expected, `default - ${boxSizing}`);
      });

      it(`should measure border width for ${boxSizing}`, function () {
        const actual = getWidth(el, 'border');
        const expected =
          boxSizing === 'content-box'
            ? width + paddingLeft + paddingRight + borderWidthLeft + borderWidthRight
            : width;
        assert.equal(actual, expected, `border - ${boxSizing}`);
      });

      it(`should measure margin width for ${boxSizing}`, function () {
        const actual = getWidth(el, 'margin');
        const expected =
          boxSizing === 'content-box'
            ? width +
              paddingLeft +
              paddingRight +
              borderWidthLeft +
              borderWidthRight +
              marginLeft +
              marginRight
            : width + marginLeft + marginRight;
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
