import { beforeTest, afterTest } from './utils/hooks.js';
import { createTestElement } from './utils/createTestElement.js';
import { getScrollbarSizes } from './utils/getScrollbarSizes.js';
import { assertEqualDomNumbers } from './utils/assertEqualDomNumbers.js';
import { getWidth } from '../../../src/index.js';

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

    it('should measure document width', function () {
      const expected = elWidth;
      assertEqualDomNumbers(getWidth(document, 'content'), expected, 'content');
      assertEqualDomNumbers(getWidth(document, 'padding'), expected, 'padding');
      assertEqualDomNumbers(getWidth(document, 'scrollbar'), expected, 'scrollbar');
      assertEqualDomNumbers(getWidth(document), expected, 'default');
      assertEqualDomNumbers(getWidth(document, 'border'), expected, 'border');
      assertEqualDomNumbers(getWidth(document, 'margin'), expected, 'margin');
    });
  });

  describe('window', function () {
    it('should measure width without scrollbar', function () {
      document.documentElement.style.overflow = 'scroll';
      const expected = document.documentElement.clientWidth;
      assertEqualDomNumbers(getWidth(window, 'content'), expected, 'content');
      assertEqualDomNumbers(getWidth(window, 'padding'), expected, 'padding');
    });

    it('should measure width with scrollbar', function () {
      const expected = window.innerWidth;
      assertEqualDomNumbers(getWidth(window, 'scrollbar'), expected, 'scrollbar');
      assertEqualDomNumbers(getWidth(window), expected, 'default');
      assertEqualDomNumbers(getWidth(window, 'border'), expected, 'border');
      assertEqualDomNumbers(getWidth(window, 'margin'), expected, 'margin');
    });
  });

  describe('element', function () {
    const testElementDimensions = (boxSizing: 'border-box' | 'content-box') => {
      let el: HTMLElement;

      const width = 200;
      const height = 200;
      const paddingLeft = 5;
      const paddingRight = 10;
      const paddingTop = 15;
      const paddingBottom = 20;
      const borderWidthRight = 25;
      const borderWidthLeft = 30;
      const borderWidthTop = 35;
      const borderWidthBottom = 40;
      const marginLeft = 45;
      const marginRight = 50;
      const marginTop = 55;
      const marginBottom = 60;

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
        assertEqualDomNumbers(actual, expected, `content - ${boxSizing}`);
      });

      it(`should measure padding width for ${boxSizing}`, function () {
        const actual = getWidth(el, 'padding');
        const expected =
          boxSizing === 'content-box'
            ? width - sbWidth + paddingLeft + paddingRight
            : width - sbWidth - borderWidthLeft - borderWidthRight;
        assertEqualDomNumbers(actual, expected, `padding - ${boxSizing}`);
      });

      it(`should measure scroll width for ${boxSizing}`, function () {
        const actual = getWidth(el, 'scrollbar');
        const expected =
          boxSizing === 'content-box'
            ? width + paddingLeft + paddingRight
            : width - borderWidthLeft - borderWidthRight;
        assertEqualDomNumbers(actual, expected, `scroll - ${boxSizing}`);
      });

      it(`should measure default width for ${boxSizing}`, function () {
        const actual = getWidth(el);
        const expected =
          boxSizing === 'content-box'
            ? width + paddingLeft + paddingRight + borderWidthLeft + borderWidthRight
            : width;
        assertEqualDomNumbers(actual, expected, `default - ${boxSizing}`);
      });

      it(`should measure border width for ${boxSizing}`, function () {
        const actual = getWidth(el, 'border');
        const expected =
          boxSizing === 'content-box'
            ? width + paddingLeft + paddingRight + borderWidthLeft + borderWidthRight
            : width;
        assertEqualDomNumbers(actual, expected, `border - ${boxSizing}`);
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
        assertEqualDomNumbers(actual, expected, `margin - ${boxSizing}`);
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
