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
      assert.strictEqual(getHeight(document, 'content'), elHeight);
    });

    it('should measure padding height', function () {
      assert.strictEqual(getHeight(document, 'padding'), elHeight);
    });

    it('should measure scroll height', function () {
      const expectedHeight = elHeight + window.innerHeight - document.documentElement.clientHeight;
      assert.strictEqual(getHeight(document, 'scroll'), expectedHeight);
    });

    it('should measure default height', function () {
      const expectedHeight = elHeight + window.innerHeight - document.documentElement.clientHeight;
      assert.strictEqual(getHeight(document), expectedHeight, 'default');
    });

    it('should measure border height', function () {
      const expectedHeight = elHeight + window.innerHeight - document.documentElement.clientHeight;
      assert.strictEqual(getHeight(document, 'border'), expectedHeight, 'border');
    });

    it('should measure margin height', function () {
      const expectedHeight = elHeight + window.innerHeight - document.documentElement.clientHeight;
      assert.strictEqual(getHeight(document, 'margin'), expectedHeight);
    });
  });

  describe('window', function () {
    it('should measure height without scrollbar', function () {
      document.documentElement.style.overflow = 'scroll';
      const expectedHeight = document.documentElement.clientHeight;
      assert.strictEqual(getHeight(window, 'content'), expectedHeight, 'content');
      assert.strictEqual(getHeight(window, 'padding'), expectedHeight, 'padding');
    });

    it('should measure height with scrollbar', function () {
      const expectedHeight = window.innerHeight;
      assert.strictEqual(getHeight(window, 'scroll'), expectedHeight, 'scroll');
      assert.strictEqual(getHeight(window), expectedHeight, 'default');
      assert.strictEqual(getHeight(window, 'border'), expectedHeight, 'border');
      assert.strictEqual(getHeight(window, 'margin'), expectedHeight, 'margin');
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
        const expectedHeight =
          boxSizing === 'content-box'
            ? height - sbHeight
            : height - sbHeight - paddingTop - paddingBottom - borderWidthTop - borderWidthBottom;
        assert.equal(getHeight(el, 'content'), expectedHeight, `content - ${boxSizing}`);
      });

      it(`should measure padding height for ${boxSizing}`, function () {
        const expectedHeight =
          boxSizing === 'content-box'
            ? height - sbHeight + paddingTop + paddingBottom
            : height - sbHeight - borderWidthTop - borderWidthBottom;
        assert.equal(getHeight(el, 'padding'), expectedHeight, `padding - ${boxSizing}`);
      });

      it(`should measure scroll height for ${boxSizing}`, function () {
        const expectedHeight =
          boxSizing === 'content-box'
            ? height + paddingTop + paddingBottom
            : height - borderWidthTop - borderWidthBottom;
        assert.equal(getHeight(el, 'scroll'), expectedHeight, `scroll - ${boxSizing}`);
      });

      it(`should measure default height for ${boxSizing}`, function () {
        const expectedHeight =
          boxSizing === 'content-box'
            ? height + paddingTop + paddingBottom + borderWidthTop + borderWidthBottom
            : height;
        assert.equal(getHeight(el), expectedHeight, `default - ${boxSizing}`);
      });

      it(`should measure border height for ${boxSizing}`, function () {
        const expectedHeight =
          boxSizing === 'content-box'
            ? height + paddingTop + paddingBottom + borderWidthTop + borderWidthBottom
            : height;
        assert.equal(getHeight(el, 'border'), expectedHeight, `border - ${boxSizing}`);
      });

      it(`should measure margin height for ${boxSizing}`, function () {
        const expectedHeight =
          boxSizing === 'content-box'
            ? height +
              paddingTop +
              paddingBottom +
              borderWidthTop +
              borderWidthBottom +
              marginLeft +
              marginRight
            : height + marginLeft + marginRight;
        assert.equal(getHeight(el, 'margin'), expectedHeight, `margin - ${boxSizing}`);
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
