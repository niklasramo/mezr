import { assert } from 'chai';
import { beforeTest, afterTest } from './utils/hooks.js';
import { createTestElement } from './utils/createTestElement.js';
import { getWidth, getHeight, getRect } from '../../src/index.js';
import { getScrollbarSizes } from './utils/getScrollbarSizes.js';

describe('dimensions: getWidth() and getHeight()', () => {
  beforeEach(beforeTest);
  afterEach(afterTest);

  const { width: sbWidth, height: sbHeight } = getScrollbarSizes();

  it(`should measure the document's width and height`, function () {
    const elWidth = 10000;
    const elHeight = 10000;

    let expectedWidth = 0;
    let expectedHeight = 0;

    const el = createTestElement({
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: `${elWidth}px`,
      height: `${elHeight}px`,
    });

    expectedWidth = elWidth;
    expectedHeight = elHeight;

    // "content"
    assert.strictEqual(
      getWidth(document, 'content'),
      expectedWidth,
      'getWidth(document, "content")'
    );
    assert.strictEqual(
      getHeight(document, 'content'),
      expectedHeight,
      'getHeight(document, "content")'
    );
    assert.strictEqual(
      getRect([document, 'content']).width,
      expectedWidth,
      'getRect([document, "content"]).width'
    );
    assert.strictEqual(
      getRect([document, 'content']).height,
      expectedHeight,
      'getRect([document, "content"]).height'
    );

    // "padding"
    assert.strictEqual(
      getWidth(document, 'padding'),
      expectedWidth,
      'getWidth(document, "padding")'
    );
    assert.strictEqual(
      getHeight(document, 'padding'),
      expectedHeight,
      'getHeight(document, "padding")'
    );
    assert.strictEqual(
      getRect([document, 'padding']).width,
      expectedWidth,
      'getRect([document, "padding"]).width'
    );
    assert.strictEqual(
      getRect([document, 'padding']).height,
      expectedHeight,
      'getRect([document, "padding"]).height'
    );

    expectedWidth = elWidth + window.innerWidth - document.documentElement.clientWidth;
    expectedHeight = elHeight + window.innerHeight - document.documentElement.clientHeight;

    // "scroll"
    assert.strictEqual(getWidth(document, 'scroll'), expectedWidth, 'getWidth(document, "scroll")');
    assert.strictEqual(
      getHeight(document, 'scroll'),
      expectedHeight,
      'getHeight(document, "padding")'
    );
    assert.strictEqual(
      getRect([document, 'scroll']).width,
      expectedWidth,
      'getRect([document, "scroll"]).width'
    );
    assert.strictEqual(
      getRect([document, 'scroll']).height,
      expectedHeight,
      'getRect([document, "scroll"]).height'
    );

    // "border"
    assert.strictEqual(getWidth(document, 'border'), expectedWidth, 'getWidth(document, "border")');
    assert.strictEqual(
      getHeight(document, 'border'),
      expectedHeight,
      'getHeight(document, "border")'
    );
    assert.strictEqual(
      getRect([document, 'border']).width,
      expectedWidth,
      'getRect([document, "border"]).width'
    );
    assert.strictEqual(
      getRect([document, 'border']).height,
      expectedHeight,
      'getRect([document, "border"]).height'
    );

    // ""
    assert.strictEqual(getWidth(document), expectedWidth, 'getWidth(document)');
    assert.strictEqual(getHeight(document), expectedHeight, 'getHeight(document)');
    assert.strictEqual(getRect(document).width, expectedWidth, 'getRect(document).width');
    assert.strictEqual(getRect(document).height, expectedHeight, 'getRect(document).height');

    // "margin"
    assert.strictEqual(getWidth(document, 'margin'), expectedWidth, 'width - "margin"');
    assert.strictEqual(getHeight(document, 'margin'), expectedHeight, 'height - "margin"');
    assert.strictEqual(
      getRect([document, 'margin']).width,
      expectedWidth,
      'getRect([document, "margin"]).width'
    );
    assert.strictEqual(
      getRect([document, 'margin']).height,
      expectedHeight,
      'getRect([document, "margin"]).height'
    );

    el.remove();
  });

  it(`should measure the window's width and height`, function () {
    let expectedWidth = 0;
    let expectedHeight = 0;

    // Force root scrollbar to be visible.
    document.documentElement.style.overflow = 'scroll';

    // Without scrollbar.
    expectedWidth = document.documentElement.clientWidth;
    expectedHeight = document.documentElement.clientHeight;
    assert.strictEqual(getWidth(window, 'content'), expectedWidth, 'width - "content"');
    assert.strictEqual(getWidth(window, 'padding'), expectedWidth, 'width - "padding"');
    assert.strictEqual(getHeight(window, 'content'), expectedHeight, 'height - "content"');
    assert.strictEqual(getHeight(window, 'padding'), expectedHeight, 'height - "padding"');

    // With scrollbar.
    expectedWidth = window.innerWidth;
    expectedHeight = window.innerHeight;
    assert.strictEqual(getWidth(window), expectedWidth, 'width - ""');
    assert.strictEqual(getWidth(window, 'scroll'), expectedWidth, 'width - "scroll"');
    assert.strictEqual(getWidth(window, 'border'), expectedWidth, 'width - "border"');
    assert.strictEqual(getWidth(window, 'margin'), expectedWidth, 'width - "margin"');
    assert.strictEqual(getHeight(window), expectedHeight, 'height - ""');
    assert.strictEqual(getHeight(window, 'scroll'), expectedHeight, 'height - "scroll"');
    assert.strictEqual(getHeight(window, 'border'), expectedHeight, 'height - "border"');
    assert.strictEqual(getHeight(window, 'margin'), expectedHeight, 'height - "margin"');
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

    const el = createTestElement({
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
    assert.equal(getWidth(el, 'content'), contentWidth, 'width - "content"');

    const contentHeight = height - sbHeight;
    assert.equal(getHeight(el, 'content'), contentHeight, 'height - "content"');

    const paddingWidth = contentWidth + paddingLeft + paddingRight;
    assert.equal(getWidth(el, 'padding'), paddingWidth, 'width - "padding"');

    const paddingHeight = contentHeight + paddingTop + paddingBottom;
    assert.equal(getHeight(el, 'padding'), paddingHeight, 'height - "padding"');

    const scrollWidth = paddingWidth + sbWidth;
    assert.equal(getWidth(el, 'scroll'), scrollWidth, 'width - "scroll"');

    const scrollHeight = paddingHeight + sbHeight;
    assert.equal(getHeight(el, 'scroll'), scrollHeight, 'height - "scroll"');

    const borderWidth = scrollWidth + borderWidthLeft + borderWidthRight;
    assert.equal(getWidth(el, 'border'), borderWidth, 'width - "border"');
    assert.equal(getWidth(el), borderWidth, 'width - ""');

    const borderHeight = scrollHeight + borderWidthTop + borderWidthBottom;
    assert.equal(getHeight(el, 'border'), borderHeight, 'height - "border"');
    assert.equal(getHeight(el), borderHeight, 'height - ""');

    const marginWidth = borderWidth + marginLeft + marginRight;
    assert.equal(getWidth(el, 'margin'), marginWidth, 'width - "margin"');

    const marginHeight = borderHeight + marginTop + marginBottom;
    assert.equal(getHeight(el, 'margin'), marginHeight, 'height - "margin"');

    el.remove();
  });
});
