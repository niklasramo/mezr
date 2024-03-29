import { beforeTest, afterTest } from './utils/hooks.js';
import { createTestElement } from './utils/createTestElement.js';
import { getScrollbarSizes } from './utils/getScrollbarSizes.js';
import { assertEqualDomNumbers } from './utils/assertEqualDomNumbers.js';
import { getHeight } from '../../../src/index.js';

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

    it('should measure document height', function () {
      const expected = elHeight;
      assertEqualDomNumbers(getHeight(document, 'content'), expected, 'content');
      assertEqualDomNumbers(getHeight(document, 'padding'), expected, 'padding');
      assertEqualDomNumbers(getHeight(document, 'scrollbar'), expected, 'scrollbar');
      assertEqualDomNumbers(getHeight(document), expected, 'default');
      assertEqualDomNumbers(getHeight(document, 'border'), expected, 'border');
      assertEqualDomNumbers(getHeight(document, 'margin'), expected, 'margin');
    });
  });

  describe('window', function () {
    it('should measure height without scrollbar', function () {
      document.documentElement.style.overflow = 'scroll';
      const expected = document.documentElement.clientHeight;
      assertEqualDomNumbers(getHeight(window, 'content'), expected, 'content');
      assertEqualDomNumbers(getHeight(window, 'padding'), expected, 'padding');
    });

    it('should measure height with scrollbar', function () {
      const expected = window.innerHeight;
      assertEqualDomNumbers(getHeight(window, 'scrollbar'), expected, 'scrollbar');
      assertEqualDomNumbers(getHeight(window), expected, 'default');
      assertEqualDomNumbers(getHeight(window, 'border'), expected, 'border');
      assertEqualDomNumbers(getHeight(window, 'margin'), expected, 'margin');
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

      it(`should measure content height for ${boxSizing}`, function () {
        const actual = getHeight(el, 'content');
        const expected =
          boxSizing === 'content-box'
            ? height - sbHeight
            : height - sbHeight - paddingTop - paddingBottom - borderWidthTop - borderWidthBottom;
        assertEqualDomNumbers(actual, expected, `content - ${boxSizing}`);
      });

      it(`should measure padding height for ${boxSizing}`, function () {
        const actual = getHeight(el, 'padding');
        const expected =
          boxSizing === 'content-box'
            ? height - sbHeight + paddingTop + paddingBottom
            : height - sbHeight - borderWidthTop - borderWidthBottom;
        assertEqualDomNumbers(actual, expected, `padding - ${boxSizing}`);
      });

      it(`should measure scroll height for ${boxSizing}`, function () {
        const actual = getHeight(el, 'scrollbar');
        const expected =
          boxSizing === 'content-box'
            ? height + paddingTop + paddingBottom
            : height - borderWidthTop - borderWidthBottom;
        assertEqualDomNumbers(actual, expected, `scroll - ${boxSizing}`);
      });

      it(`should measure default height for ${boxSizing}`, function () {
        const actual = getHeight(el);
        const expected =
          boxSizing === 'content-box'
            ? height + paddingTop + paddingBottom + borderWidthTop + borderWidthBottom
            : height;
        assertEqualDomNumbers(actual, expected, `default - ${boxSizing}`);
      });

      it(`should measure border height for ${boxSizing}`, function () {
        const actual = getHeight(el, 'border');
        const expected =
          boxSizing === 'content-box'
            ? height + paddingTop + paddingBottom + borderWidthTop + borderWidthBottom
            : height;
        assertEqualDomNumbers(actual, expected, `border - ${boxSizing}`);
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
              marginTop +
              marginBottom
            : height + marginTop + marginBottom;
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

  describe('scrollbar', function () {
    ['default', '10px', '10.25px', '10.499px', '10.5px', '10.75px', '10.999px'].forEach(
      (scrollbarSize) => {
        it(`should measure window scrollbar height (${scrollbarSize}) correctly`, function () {
          const styleSheet = document.getElementById('default-page-styles')!;
          styleSheet.innerHTML += `
            html {
              overflow-x: scroll;
              width: 100%;
              height: 100%;
            }
            body {
              width: 200vw;
              height: 100%;
            }
            `;

          if (scrollbarSize !== 'default') {
            styleSheet.innerHTML += `
              html::-webkit-scrollbar {
                height: ${scrollbarSize}
              }
              `;
          }

          const actual = getHeight(window, 'scrollbar') - getHeight(window, 'padding');
          const expected =
            window.innerHeight - document.documentElement.getBoundingClientRect().height;
          assertEqualDomNumbers(actual, expected, scrollbarSize, 0.001);
        });
      },
    );

    ['default', '10px', '10.25px', '10.499px', '10.5px', '10.75px', '10.999px'].forEach(
      (scrollbarSize) => {
        it(`should measure element scrollbar height (${scrollbarSize}) correctly`, function () {
          if (scrollbarSize !== 'default') {
            const styleSheet = document.getElementById('default-page-styles')!;
            styleSheet.innerHTML += `
              .parent::-webkit-scrollbar {
                height: ${scrollbarSize}
              }
              `;
          }

          const parent = createTestElement({
            overflowX: 'scroll',
            width: '100vw',
            height: '100vh',
          });

          const child = createTestElement({
            width: '100vw',
            height: '100%',
          });

          parent.classList.add('parent');
          child.classList.add('child');
          parent.appendChild(child);

          const actual = getHeight(parent, 'scrollbar') - getHeight(parent, 'padding');
          const expected =
            parent.getBoundingClientRect().height - child.getBoundingClientRect().height;
          assertEqualDomNumbers(actual, expected, scrollbarSize, 0.001);
        });
      },
    );
  });
});
