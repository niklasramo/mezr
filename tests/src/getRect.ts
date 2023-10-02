import { assert } from 'chai';
import { beforeTest, afterTest } from './utils/hooks.js';
import { createTestElement } from './utils/createTestElement.js';
import { getRect } from '../../src/index.js';
import { getScrollbarSizes } from './utils/getScrollbarSizes.js';

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

      (['content', 'padding', 'scroll', 'border', 'margin'] as const).forEach((boxEdge) => {
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

          assert.strictEqual(rect.width, expectedWidth, 'width: rect.width');
          assert.strictEqual(
            rect.right - rect.left,
            expectedWidth,
            'width: rect.right - rect.left',
          );

          assert.strictEqual(rect.height, expectedHeight, 'height: rect.height');
          assert.strictEqual(
            rect.bottom - rect.top,
            expectedHeight,
            'height: rect.bottom - rect.top',
          );
        });
      });
    });

    describe('window', function () {
      (['content', 'padding', 'scroll', 'border', 'margin'] as const).forEach((boxEdge) => {
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

          assert.strictEqual(rect.width, expectedWidth, 'width: rect.width');
          assert.strictEqual(
            rect.right - rect.left,
            expectedWidth,
            'width: rect.right - rect.left',
          );

          assert.strictEqual(rect.height, expectedHeight, 'height: rect.height');
          assert.strictEqual(
            rect.bottom - rect.top,
            expectedHeight,
            'height: rect.bottom - rect.top',
          );
        });
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
          const rect = getRect([el, 'content']);
          const expected =
            boxSizing === 'content-box'
              ? width - sbWidth
              : width - sbWidth - paddingLeft - paddingRight - borderWidthLeft - borderWidthRight;
          assert.equal(rect.width, expected, `content - ${boxSizing}: rect.width`);
          assert.equal(
            rect.right - rect.left,
            expected,
            `content - ${boxSizing}: rect.right - rect.left`,
          );
        });

        it(`should measure content height for ${boxSizing}`, function () {
          const rect = getRect([el, 'content']);
          const expected =
            boxSizing === 'content-box'
              ? height - sbHeight
              : height - sbHeight - paddingTop - paddingBottom - borderWidthTop - borderWidthBottom;
          assert.equal(rect.height, expected, `content - ${boxSizing}: rect.height`);
          assert.equal(
            rect.bottom - rect.top,
            expected,
            `content - ${boxSizing}: rect.bottom - rect.top`,
          );
        });

        it(`should measure padding width for ${boxSizing}`, function () {
          const rect = getRect([el, 'padding']);
          const expected =
            boxSizing === 'content-box'
              ? width - sbWidth + paddingLeft + paddingRight
              : width - sbWidth - borderWidthLeft - borderWidthRight;
          assert.equal(rect.width, expected, `padding - ${boxSizing}: rect.width`);
          assert.equal(
            rect.right - rect.left,
            expected,
            `padding - ${boxSizing}: rect.right - rect.left`,
          );
        });

        it(`should measure padding height for ${boxSizing}`, function () {
          const rect = getRect([el, 'padding']);
          const expected =
            boxSizing === 'content-box'
              ? height - sbHeight + paddingTop + paddingBottom
              : height - sbHeight - borderWidthTop - borderWidthBottom;
          assert.equal(rect.height, expected, `padding - ${boxSizing}: rect.height`);
          assert.equal(
            rect.bottom - rect.top,
            expected,
            `padding - ${boxSizing}: rect.bottom - rect.top`,
          );
        });

        it(`should measure scroll width for ${boxSizing}`, function () {
          const rect = getRect([el, 'scroll']);
          const expected =
            boxSizing === 'content-box'
              ? width + paddingLeft + paddingRight
              : width - borderWidthLeft - borderWidthRight;
          assert.equal(rect.width, expected, `scroll - ${boxSizing}: rect.width`);
          assert.equal(
            rect.right - rect.left,
            expected,
            `scroll - ${boxSizing}: rect.right - rect.left`,
          );
        });

        it(`should measure scroll height for ${boxSizing}`, function () {
          const rect = getRect([el, 'scroll']);
          const expected =
            boxSizing === 'content-box'
              ? height + paddingTop + paddingBottom
              : height - borderWidthTop - borderWidthBottom;
          assert.equal(rect.height, expected, `scroll - ${boxSizing}: rect.height`);
          assert.equal(
            rect.bottom - rect.top,
            expected,
            `scroll - ${boxSizing}: rect.bottom - rect.top`,
          );
        });

        it(`should measure default width for ${boxSizing}`, function () {
          const rect = getRect(el);
          const expected =
            boxSizing === 'content-box'
              ? width + paddingLeft + paddingRight + borderWidthLeft + borderWidthRight
              : width;
          assert.equal(rect.width, expected, `default - ${boxSizing}: rect.width`);
          assert.equal(
            rect.right - rect.left,
            expected,
            `default - ${boxSizing}: rect.right - rect.left`,
          );
        });

        it(`should measure default height for ${boxSizing}`, function () {
          const rect = getRect(el);
          const expected =
            boxSizing === 'content-box'
              ? height + paddingTop + paddingBottom + borderWidthTop + borderWidthBottom
              : height;
          assert.equal(rect.height, expected, `default - ${boxSizing}: rect.height`);
          assert.equal(
            rect.bottom - rect.top,
            expected,
            `default - ${boxSizing}: rect.bottom - rect.top`,
          );
        });

        it(`should measure border width for ${boxSizing}`, function () {
          const rect = getRect([el, 'border']);
          const expected =
            boxSizing === 'content-box'
              ? width + paddingLeft + paddingRight + borderWidthLeft + borderWidthRight
              : width;
          assert.equal(rect.width, expected, `border - ${boxSizing}: rect.width`);
          assert.equal(
            rect.right - rect.left,
            expected,
            `border - ${boxSizing}: rect.right - rect.left`,
          );
        });

        it(`should measure border height for ${boxSizing}`, function () {
          const rect = getRect([el, 'border']);
          const expected =
            boxSizing === 'content-box'
              ? height + paddingTop + paddingBottom + borderWidthTop + borderWidthBottom
              : height;
          assert.equal(rect.height, expected, `border - ${boxSizing}: rect.height`);
          assert.equal(
            rect.bottom - rect.top,
            expected,
            `border - ${boxSizing}: rect.bottom - rect.top`,
          );
        });

        it(`should measure margin width for ${boxSizing}`, function () {
          const rect = getRect([el, 'margin']);
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
          assert.equal(rect.width, expected, `margin - ${boxSizing}: rect.width`);
          assert.equal(
            rect.right - rect.left,
            expected,
            `margin - ${boxSizing}: rect.right - rect.left`,
          );
        });

        it(`should measure margin height for ${boxSizing}`, function () {
          const rect = getRect([el, 'margin']);
          const expected =
            boxSizing === 'content-box'
              ? height +
                paddingTop +
                paddingBottom +
                borderWidthTop +
                borderWidthBottom +
                marginTop +
                marginBottom
              : height + marginTop + marginBottom;
          assert.equal(rect.height, expected, `margin - ${boxSizing}: rect.height`);
          assert.equal(
            rect.bottom - rect.top,
            expected,
            `margin - ${boxSizing}: rect.bottom - rect.top`,
          );
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
});
