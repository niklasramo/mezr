import { beforeTest, afterTest } from './utils/hooks.js';
import { createTestElement } from './utils/createTestElement.js';
import { getScrollbarSizes } from './utils/getScrollbarSizes.js';
import { assertEqualDomNumbers } from './utils/assertEqualDomNumbers.js';
import { getRect } from '../../../src/index.js';

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

          assertEqualDomNumbers(rect.width, expectedWidth, 'width: rect.width');
          assertEqualDomNumbers(
            rect.right - rect.left,
            expectedWidth,
            'width: rect.right - rect.left',
          );

          assertEqualDomNumbers(rect.height, expectedHeight, 'height: rect.height');
          assertEqualDomNumbers(
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

          assertEqualDomNumbers(rect.width, expectedWidth, 'width: rect.width');
          assertEqualDomNumbers(
            rect.right - rect.left,
            expectedWidth,
            'width: rect.right - rect.left',
          );

          assertEqualDomNumbers(rect.height, expectedHeight, 'height: rect.height');
          assertEqualDomNumbers(
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
          assertEqualDomNumbers(rect.width, expected, `content - ${boxSizing}: rect.width`);
          assertEqualDomNumbers(
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
          assertEqualDomNumbers(rect.height, expected, `content - ${boxSizing}: rect.height`);
          assertEqualDomNumbers(
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
          assertEqualDomNumbers(rect.width, expected, `padding - ${boxSizing}: rect.width`);
          assertEqualDomNumbers(
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
          assertEqualDomNumbers(rect.height, expected, `padding - ${boxSizing}: rect.height`);
          assertEqualDomNumbers(
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
          assertEqualDomNumbers(rect.width, expected, `scroll - ${boxSizing}: rect.width`);
          assertEqualDomNumbers(
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
          assertEqualDomNumbers(rect.height, expected, `scroll - ${boxSizing}: rect.height`);
          assertEqualDomNumbers(
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
          assertEqualDomNumbers(rect.width, expected, `default - ${boxSizing}: rect.width`);
          assertEqualDomNumbers(
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
          assertEqualDomNumbers(rect.height, expected, `default - ${boxSizing}: rect.height`);
          assertEqualDomNumbers(
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
          assertEqualDomNumbers(rect.width, expected, `border - ${boxSizing}: rect.width`);
          assertEqualDomNumbers(
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
          assertEqualDomNumbers(rect.height, expected, `border - ${boxSizing}: rect.height`);
          assertEqualDomNumbers(
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
          assertEqualDomNumbers(rect.width, expected, `margin - ${boxSizing}: rect.width`);
          assertEqualDomNumbers(
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
          assertEqualDomNumbers(rect.height, expected, `margin - ${boxSizing}: rect.height`);
          assertEqualDomNumbers(
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

  describe('offsets', function () {
    function getRectOffset(...args: Parameters<typeof getRect>) {
      const { left, top } = getRect(...args);
      return { left, top };
    }

    beforeEach(beforeTest);
    afterEach(afterTest);

    describe('document', function () {
      it('should return correct offset without scrolling', function () {
        const actual = getRectOffset(document);
        const expected = { left: 0, top: 0 };
        assertEqualDomNumbers(actual.left, expected.left, 'left');
        assertEqualDomNumbers(actual.top, expected.top, 'top');
      });

      it('should return correct offset with scrolling', function () {
        createTestElement({
          width: 'calc(100vw + 200px)',
          height: 'calc(100vh + 200px)',
        });
        window.scrollTo({ left: 50, top: 100, behavior: 'instant' });
        const actual = getRectOffset(document);
        const expected = { left: 0, top: 0 };
        assertEqualDomNumbers(actual.left, expected.left, 'left');
        assertEqualDomNumbers(actual.top, expected.top, 'top');
      });
    });

    describe('window', function () {
      it('should return correct offset without scrolling', function () {
        const actual = getRectOffset(window);
        const expected = { left: 0, top: 0 };
        assertEqualDomNumbers(actual.left, expected.left, 'left');
        assertEqualDomNumbers(actual.top, expected.top, 'top');
      });

      it('should return correct offset with scrolling', function () {
        createTestElement({
          width: 'calc(100vw + 200px)',
          height: 'calc(100vh + 200px)',
        });
        window.scrollTo({ left: 50, top: 100, behavior: 'instant' });
        const actual = getRectOffset(window);
        const expected = { left: 50, top: 100 };
        assertEqualDomNumbers(actual.left, expected.left, 'left');
        assertEqualDomNumbers(actual.top, expected.top, 'top');
      });
    });

    describe('element', function () {
      beforeEach(beforeTest);
      afterEach(afterTest);

      let elA: HTMLElement;
      let elB: HTMLElement;

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
        } as const;

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
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure element's padding offset from document`, function () {
          const actual = getRectOffset([elA, 'padding']);
          const expected = {
            left: left + marginLeft + borderLeft,
            top: top + marginTop + borderTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure element's scroll offset from document`, function () {
          const actual = getRectOffset([elA, 'scroll']);
          const expected = {
            left: left + marginLeft + borderLeft,
            top: top + marginTop + borderTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure element's border offset from document`, function () {
          const actual = getRectOffset([elA, 'border']);
          const expected = {
            left: left + marginLeft,
            top: top + marginTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure element's margin offset from document`, function () {
          const actual = getRectOffset([elA, 'margin']);
          const expected = {
            left: left,
            top: top,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });
      });

      describe('element -> window', function () {
        it(`should measure element's content offset from window`, function () {
          const actual = getRectOffset([elA, 'content'], window);
          const expected = {
            left: left + marginLeft + borderLeft + paddingLeft - scrollLeft,
            top: top + marginTop + borderTop + paddingTop - scrollTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure element's padding offset from window`, function () {
          const actual = getRectOffset([elA, 'padding'], window);
          const expected = {
            left: left + marginLeft + borderLeft - scrollLeft,
            top: top + marginTop + borderTop - scrollTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure element's scroll offset from window`, function () {
          const actual = getRectOffset([elA, 'scroll'], window);
          const expected = {
            left: left + marginLeft + borderLeft - scrollLeft,
            top: top + marginTop + borderTop - scrollTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure element's default (border) offset from window`, function () {
          const actual = getRectOffset(elA, window);
          const expected = {
            left: left + marginLeft - scrollLeft,
            top: top + marginTop - scrollTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure element's border offset from window`, function () {
          const actual = getRectOffset([elA, 'border'], window);
          const expected = {
            left: left + marginLeft - scrollLeft,
            top: top + marginTop - scrollTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure element's margin offset from window`, function () {
          const actual = getRectOffset([elA, 'margin'], window);
          const expected = {
            left: left - scrollLeft,
            top: top - scrollTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });
      });

      describe('element (content) -> element (all variations)', function () {
        it(`should measure content -> content offset`, function () {
          const actual = getRectOffset([elA, 'content'], [elB, 'content']);
          const expected = {
            left: -elBContainerLeft,
            top: -elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure content -> padding offset`, function () {
          const actual = getRectOffset([elA, 'content'], [elB, 'padding']);
          const expected = {
            left: paddingLeft - elBContainerLeft,
            top: paddingTop - elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure content -> scroll offset`, function () {
          const actual = getRectOffset([elA, 'content'], [elB, 'scroll']);
          const expected = {
            left: paddingLeft - elBContainerLeft,
            top: paddingTop - elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure content -> default (border) offset`, function () {
          const actual = getRectOffset([elA, 'content'], elB);
          const expected = {
            left: paddingLeft + borderLeft - elBContainerLeft,
            top: paddingTop + borderTop - elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure content -> border offset`, function () {
          const actual = getRectOffset([elA, 'content'], [elB, 'border']);
          const expected = {
            left: paddingLeft + borderLeft - elBContainerLeft,
            top: paddingTop + borderTop - elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure content -> margin offset`, function () {
          const actual = getRectOffset([elA, 'content'], [elB, 'margin']);
          const expected = {
            left: paddingLeft + borderLeft + marginLeft - elBContainerLeft,
            top: paddingTop + borderTop + marginTop - elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });
      });

      describe('element (padding) -> element (all variations)', function () {
        it(`should measure padding -> content offset`, function () {
          const actual = getRectOffset([elA, 'padding'], [elB, 'content']);
          const expected = {
            left: -(elBContainerLeft + paddingLeft),
            top: -(elBContainerTop + paddingTop),
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure padding -> padding offset`, function () {
          const actual = getRectOffset([elA, 'padding'], [elB, 'padding']);
          const expected = {
            left: -elBContainerLeft,
            top: -elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure padding -> scroll offset`, function () {
          const actual = getRectOffset([elA, 'padding'], [elB, 'scroll']);
          const expected = {
            left: -elBContainerLeft,
            top: -elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure padding -> default (border) offset`, function () {
          const actual = getRectOffset([elA, 'padding'], elB);
          const expected = {
            left: borderLeft - elBContainerLeft,
            top: borderTop - elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure padding -> border offset`, function () {
          const actual = getRectOffset([elA, 'padding'], [elB, 'border']);
          const expected = {
            left: borderLeft - elBContainerLeft,
            top: borderTop - elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure padding -> margin offset`, function () {
          const actual = getRectOffset([elA, 'padding'], [elB, 'margin']);
          const expected = {
            left: borderLeft + marginLeft - elBContainerLeft,
            top: borderTop + marginTop - elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });
      });

      describe('element (scroll) -> element (all variations)', function () {
        it(`should measure scroll -> content offset`, function () {
          const actual = getRectOffset([elA, 'scroll'], [elB, 'content']);
          const expected = {
            left: -(elBContainerLeft + paddingLeft),
            top: -(elBContainerTop + paddingTop),
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure scroll -> padding offset`, function () {
          const actual = getRectOffset([elA, 'scroll'], [elB, 'padding']);
          const expected = {
            left: -elBContainerLeft,
            top: -elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure scroll -> scroll offset`, function () {
          const actual = getRectOffset([elA, 'scroll'], [elB, 'scroll']);
          const expected = {
            left: -elBContainerLeft,
            top: -elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure scroll -> default (border) offset`, function () {
          const actual = getRectOffset([elA, 'scroll'], elB);
          const expected = {
            left: borderLeft - elBContainerLeft,
            top: borderTop - elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure scroll -> border offset`, function () {
          const actual = getRectOffset([elA, 'scroll'], [elB, 'border']);
          const expected = {
            left: borderLeft - elBContainerLeft,
            top: borderTop - elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure scroll -> margin offset`, function () {
          const actual = getRectOffset([elA, 'scroll'], [elB, 'margin']);
          const expected = {
            left: borderLeft + marginLeft - elBContainerLeft,
            top: borderTop + marginTop - elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });
      });

      describe('element (border) -> element (all variations)', function () {
        it(`should measure border -> content offset`, function () {
          const actual = getRectOffset([elA, 'border'], [elB, 'content']);
          const expected = {
            left: -(elBContainerLeft + paddingLeft + borderLeft),
            top: -(elBContainerTop + paddingTop + borderTop),
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure border -> padding offset`, function () {
          const actual = getRectOffset([elA, 'border'], [elB, 'padding']);
          const expected = {
            left: -(elBContainerLeft + borderLeft),
            top: -(elBContainerTop + borderTop),
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure border -> scroll offset`, function () {
          const actual = getRectOffset([elA, 'border'], [elB, 'scroll']);
          const expected = {
            left: -(elBContainerLeft + borderLeft),
            top: -(elBContainerTop + borderTop),
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure border -> default (border) offset`, function () {
          const actual = getRectOffset([elA, 'border'], elB);
          const expected = {
            left: -elBContainerLeft,
            top: -elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure border -> border offset`, function () {
          const actual = getRectOffset([elA, 'border'], [elB, 'border']);
          const expected = {
            left: -elBContainerLeft,
            top: -elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure border -> margin offset`, function () {
          const actual = getRectOffset([elA, 'border'], [elB, 'margin']);
          const expected = {
            left: marginLeft - elBContainerLeft,
            top: marginTop - elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });
      });

      describe('element (margin) -> element (all variations)', function () {
        it(`should measure margin -> content offset`, function () {
          const actual = getRectOffset([elA, 'margin'], [elB, 'content']);
          const expected = {
            left: -(elBContainerLeft + paddingLeft + borderLeft + marginLeft),
            top: -(elBContainerTop + paddingTop + borderTop + marginTop),
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure margin -> padding offset`, function () {
          const actual = getRectOffset([elA, 'margin'], [elB, 'padding']);
          const expected = {
            left: -(elBContainerLeft + borderLeft + marginLeft),
            top: -(elBContainerTop + borderTop + marginTop),
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure margin -> scroll offset`, function () {
          const actual = getRectOffset([elA, 'margin'], [elB, 'scroll']);
          const expected = {
            left: -(elBContainerLeft + borderLeft + marginLeft),
            top: -(elBContainerTop + borderTop + marginTop),
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure margin -> default (border) offset`, function () {
          const actual = getRectOffset([elA, 'margin'], elB);
          const expected = {
            left: -(elBContainerLeft + marginLeft),
            top: -(elBContainerTop + marginTop),
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure margin -> border offset`, function () {
          const actual = getRectOffset([elA, 'margin'], [elB, 'border']);
          const expected = {
            left: -(elBContainerLeft + marginLeft),
            top: -(elBContainerTop + marginTop),
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });

        it(`should measure margin -> margin offset`, function () {
          const actual = getRectOffset([elA, 'margin'], [elB, 'margin']);
          const expected = {
            left: -elBContainerLeft,
            top: -elBContainerTop,
          };
          assertEqualDomNumbers(actual.left, expected.left, 'left');
          assertEqualDomNumbers(actual.top, expected.top, 'top');
        });
      });
    });
  });
});
