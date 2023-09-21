import { assert } from 'chai';
import { beforeTest, afterTest } from './utils/hooks.js';
import { createTestElement } from './utils/createTestElement.js';
import { getOffset } from '../../src/index.js';

describe('getOffset()', function () {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('document', function () {
    it('should return correct offset without scrolling', function () {
      const actual = getOffset(document);
      const expected = { left: 0, top: 0 };
      assert.deepEqual(actual, expected);
    });

    it('should return correct offset with scrolling', function () {
      createTestElement({
        width: 'calc(100vw + 200px)',
        height: 'calc(100vh + 200px)',
      });
      window.scrollTo({ left: 50, top: 100, behavior: 'instant' });
      const actual = getOffset(document);
      const expected = { left: 0, top: 0 };
      assert.deepEqual(actual, expected);
    });
  });

  describe('window', function () {
    it('should return correct offset without scrolling', function () {
      const actual = getOffset(window);
      const expected = { left: 0, top: 0 };
      assert.deepEqual(actual, expected);
    });

    it('should return correct offset with scrolling', function () {
      createTestElement({
        width: 'calc(100vw + 200px)',
        height: 'calc(100vh + 200px)',
      });
      window.scrollTo({ left: 50, top: 100, behavior: 'instant' });
      const actual = getOffset(window);
      const expected = { left: 50, top: 100 };
      assert.deepEqual(actual, expected);
    });
  });

  // TODO: Fix shitty math by ChatGPT!
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
        const actual = getOffset([elA, 'content']);
        const expected = {
          left: left + marginLeft + borderLeft + paddingLeft,
          top: top + marginTop + borderTop + paddingTop,
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure element's padding offset from document`, function () {
        const actual = getOffset([elA, 'padding']);
        const expected = {
          left: left + marginLeft + borderLeft,
          top: top + marginTop + borderTop,
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure element's scroll offset from document`, function () {
        const actual = getOffset([elA, 'scroll']);
        const expected = {
          left: left + marginLeft + borderLeft,
          top: top + marginTop + borderTop,
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure element's border offset from document`, function () {
        const actual = getOffset([elA, 'border']);
        const expected = {
          left: left + marginLeft,
          top: top + marginTop,
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure element's margin offset from document`, function () {
        const actual = getOffset([elA, 'margin']);
        const expected = {
          left: left,
          top: top,
        };
        assert.deepStrictEqual(actual, expected);
      });
    });

    describe('element -> window', function () {
      it(`should measure element's content offset from window`, function () {
        const actual = getOffset([elA, 'content'], window);
        const expected = {
          left: left + marginLeft + borderLeft + paddingLeft - scrollLeft,
          top: top + marginTop + borderTop + paddingTop - scrollTop,
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure element's padding offset from window`, function () {
        const actual = getOffset([elA, 'padding'], window);
        const expected = {
          left: left + marginLeft + borderLeft - scrollLeft,
          top: top + marginTop + borderTop - scrollTop,
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure element's scroll offset from window`, function () {
        const actual = getOffset([elA, 'scroll'], window);
        const expected = {
          left: left + marginLeft + borderLeft - scrollLeft,
          top: top + marginTop + borderTop - scrollTop,
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure element's default (border) offset from window`, function () {
        const actual = getOffset(elA, window);
        const expected = {
          left: left + marginLeft - scrollLeft,
          top: top + marginTop - scrollTop,
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure element's border offset from window`, function () {
        const actual = getOffset([elA, 'border'], window);
        const expected = {
          left: left + marginLeft - scrollLeft,
          top: top + marginTop - scrollTop,
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure element's margin offset from window`, function () {
        const actual = getOffset([elA, 'margin'], window);
        const expected = {
          left: left - scrollLeft,
          top: top - scrollTop,
        };
        assert.deepStrictEqual(actual, expected);
      });
    });

    describe('element -> element', function () {
      it(`should measure content -> content offset`, function () {
        const actual = getOffset([elA, 'content'], [elB, 'content']);
        const expected = {
          left: -elBContainerLeft,
          top: -elBContainerTop,
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure content -> padding offset`, function () {
        const actual = getOffset([elA, 'content'], [elB, 'padding']);
        const expected = {
          left: paddingLeft - elBContainerLeft,
          top: paddingTop - elBContainerTop,
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure content -> scroll offset`, function () {
        const actual = getOffset([elA, 'content'], [elB, 'scroll']);
        const expected = {
          left: paddingLeft - elBContainerLeft,
          top: paddingTop - elBContainerTop,
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure content -> default (border) offset`, function () {
        const actual = getOffset([elA, 'content'], elB);
        const expected = {
          left: paddingLeft + borderLeft - elBContainerLeft,
          top: paddingTop + borderTop - elBContainerTop,
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure content -> border offset`, function () {
        const actual = getOffset([elA, 'content'], [elB, 'border']);
        const expected = {
          left: paddingLeft + borderLeft - elBContainerLeft,
          top: paddingTop + borderTop - elBContainerTop,
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure content -> margin offset`, function () {
        const actual = getOffset([elA, 'content'], [elB, 'margin']);
        const expected = {
          left: paddingLeft + borderLeft + marginLeft - elBContainerLeft,
          top: paddingTop + borderTop + marginTop - elBContainerTop,
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure padding -> content offset`, function () {
        const actual = getOffset([elA, 'padding'], [elB, 'content']);
        const expected = {
          left: -(elBContainerLeft + paddingLeft),
          top: -(elBContainerTop + paddingTop),
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure padding -> padding offset`, function () {
        const actual = getOffset([elA, 'padding'], [elB, 'padding']);
        const expected = {
          left: -elBContainerLeft,
          top: -elBContainerTop,
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure padding -> scroll offset`, function () {
        const actual = getOffset([elA, 'padding'], [elB, 'scroll']);
        const expected = {
          left: -elBContainerLeft,
          top: -elBContainerTop,
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure padding -> default (border) offset`, function () {
        const actual = getOffset([elA, 'padding'], elB);
        const expected = {
          left: borderLeft - elBContainerLeft,
          top: borderTop - elBContainerTop,
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure padding -> border offset`, function () {
        const actual = getOffset([elA, 'padding'], [elB, 'border']);
        const expected = {
          left: borderLeft - elBContainerLeft,
          top: borderTop - elBContainerTop,
        };
        assert.deepStrictEqual(actual, expected);
      });

      it(`should measure padding -> margin offset`, function () {
        const actual = getOffset([elA, 'padding'], [elB, 'margin']);
        const expected = {
          left: borderLeft + marginLeft - elBContainerLeft,
          top: borderTop + marginTop - elBContainerTop,
        };
        assert.deepStrictEqual(actual, expected);
      });
    });
  });
});
