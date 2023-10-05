import { assert } from 'chai';
import { createTestElement } from './utils/createTestElement.js';
import { CONTAINING_BLOCK_SPECIAL_CASES } from './utils/constants.js';
import { getOffsetContainer, getContainingBlock } from '../../src/index.js';

describe('getOffsetContainer()', function () {
  let el: HTMLElement;
  let container: HTMLElement;
  const scale = 0.5;

  beforeEach(function () {
    // Set the document's dimensions.
    document.documentElement.style.width = '200vw';
    document.documentElement.style.height = '200vh';
    document.documentElement.style.overflow = 'hidden';

    // Set body's dimensions.
    document.body.style.width = '300vw';
    document.body.style.height = '300vh';

    // Create container element.
    container = createTestElement({
      width: '400vw',
      height: '500vh',
    });

    // Create target element.
    el = createTestElement({
      width: `${scale * 100}%`,
      height: `${scale * 100}%`,
    });

    // Move target element into container.
    container.appendChild(el);
  });

  describe('absolute positioned element', function () {
    function getExpectedOffsetContainer(...args: Parameters<typeof getContainingBlock>) {
      const value = getContainingBlock(...args);
      return value === window ? document : value;
    }

    beforeEach(function () {
      el.style.position = 'absolute';
    });

    it('should return document if no offset container ancestor is found', function () {
      const actual = getOffsetContainer(el);
      const expected = getExpectedOffsetContainer(el);
      assert.strictEqual(actual, expected);
    });

    ['relative', 'absolute', 'fixed', 'sticky'].forEach((position) => {
      it(`should recognize block-level "position:${position}" ancestors`, function () {
        container.style.display = 'block';
        container.style.position = position;
        const actual = getOffsetContainer(el);
        const expected = getExpectedOffsetContainer(el);
        assert.strictEqual(actual, expected);
      });

      it(`should recognize inline-level "position:${position}" ancestors`, function () {
        container.style.display = 'inline';
        container.style.position = position;
        const actual = getOffsetContainer(el);
        const expected = getExpectedOffsetContainer(el);
        assert.strictEqual(actual, expected);
      });

      it(`should recognize "display:none" "position:${position}" ancestors`, function () {
        container.style.display = 'none';
        container.style.position = position;
        const actual = getOffsetContainer(el);
        const expected = getExpectedOffsetContainer(el);
        assert.strictEqual(actual, expected);
      });
    });

    CONTAINING_BLOCK_SPECIAL_CASES.forEach(({ property, value, containsInline }) => {
      it(`should recognize block-level "position:static" "${property}:${value}" ancestors`, function () {
        container.style.display = 'block';
        container.style.position = 'static';
        (container.style as any)[property] = value;
        const actual = getOffsetContainer(el);
        const expected = getExpectedOffsetContainer(el);
        assert.strictEqual(actual, expected);
      });

      if (containsInline) {
        it(`should recognize inline-level "position:static" "${property}:${value}" ancestors`, function () {
          container.style.display = 'inline';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el);
          const expected = getExpectedOffsetContainer(el);
          assert.strictEqual(actual, expected);
        });

        it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors by default`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el);
          const expected = getExpectedOffsetContainer(el);
          assert.strictEqual(actual, expected);
        });

        it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is false`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el, { skipDisplayNone: false });
          const expected = getExpectedOffsetContainer(el, { skipDisplayNone: false });
          assert.strictEqual(actual, expected);
        });

        it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is true`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el, { skipDisplayNone: true });
          const expected = getExpectedOffsetContainer(el, { skipDisplayNone: true });
          assert.strictEqual(actual, expected);
        });
      } else {
        it(`should not recognize inline-level "position:static" "${property}:${value}" ancestors`, function () {
          container.style.display = 'inline';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el);
          const expected = getExpectedOffsetContainer(el);
          assert.strictEqual(actual, expected);
        });

        it(`should return null on "display:none" "position:static" "${property}:${value}" ancestors by default`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el);
          const expected = getExpectedOffsetContainer(el);
          assert.strictEqual(actual, expected);
        });

        it(`should return null on "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is false`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el, { skipDisplayNone: false });
          const expected = getExpectedOffsetContainer(el, { skipDisplayNone: false });
          assert.strictEqual(actual, expected);
        });

        it(`should skip "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is true`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el, { skipDisplayNone: true });
          const expected = getExpectedOffsetContainer(el, { skipDisplayNone: true });
          assert.strictEqual(actual, expected);
        });
      }
    });
  });

  describe('fixed element', function () {
    beforeEach(function () {
      el.style.position = 'fixed';
    });

    ['static', 'relative', 'absolute', 'fixed', 'sticky'].forEach((position) => {
      it(`should not recognize block-level "position:${position}" ancestors`, function () {
        container.style.display = 'block';
        container.style.position = position;
        const actual = getOffsetContainer(el);
        const expected = getContainingBlock(el);
        assert.strictEqual(actual, expected);
      });

      it(`should not recognize inline-level "position:${position}" ancestors`, function () {
        container.style.display = 'inline';
        container.style.position = position;
        const actual = getOffsetContainer(el);
        const expected = getContainingBlock(el);
        assert.strictEqual(actual, expected);
      });

      it(`should return null on "display:none" "position:${position}" ancestors by default`, function () {
        container.style.display = 'none';
        container.style.position = position;
        const actual = getOffsetContainer(el);
        const expected = getContainingBlock(el);
        assert.strictEqual(actual, expected);
      });

      it(`should return null on "display:none" "position:${position}" ancestors when skipDisplayNone option is false`, function () {
        container.style.display = 'none';
        container.style.position = position;
        const actual = getOffsetContainer(el);
        const expected = getContainingBlock(el);
        assert.strictEqual(actual, expected);
      });

      it(`should skip "display:none" "position:${position}" ancestors when skipDisplayNone option is true`, function () {
        container.style.display = 'none';
        container.style.position = position;
        const actual = getOffsetContainer(el);
        const expected = getContainingBlock(el);
        assert.strictEqual(actual, expected);
      });
    });

    CONTAINING_BLOCK_SPECIAL_CASES.forEach(({ property, value, containsInline }) => {
      it(`should recognize block-level "position:static" "${property}:${value}" ancestors`, function () {
        container.style.display = 'block';
        container.style.position = 'static';
        (container.style as any)[property] = value;
        const actual = getOffsetContainer(el);
        const expected = getContainingBlock(el);
        assert.strictEqual(actual, expected);
      });

      if (containsInline) {
        it(`should recognize inline-level "position:static" "${property}:${value}" ancestors`, function () {
          container.style.display = 'inline';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getOffsetContainer(el);
          const expected = getContainingBlock(el);
          assert.strictEqual(actual, expected);
        });

        it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors by default`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getOffsetContainer(el);
          const expected = getContainingBlock(el);
          assert.strictEqual(actual, expected);
        });

        it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is false`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getOffsetContainer(el, { skipDisplayNone: false });
          const expected = getContainingBlock(el, { skipDisplayNone: false });
          assert.strictEqual(actual, expected);
        });

        it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is true`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getOffsetContainer(el, { skipDisplayNone: true });
          const expected = getContainingBlock(el, { skipDisplayNone: true });
          assert.strictEqual(actual, expected);
        });
      } else {
        it(`should not recognize inline-level "position:static" "${property}:${value}" ancestors`, function () {
          container.style.display = 'inline';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getOffsetContainer(el);
          const expected = getContainingBlock(el);
          assert.strictEqual(actual, expected);
        });

        it(`should return null on "display:none" "position:static" "${property}:${value}" ancestors by default`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getOffsetContainer(el);
          const expected = getContainingBlock(el);
          assert.strictEqual(actual, expected);
        });

        it(`should return null on "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is false`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getOffsetContainer(el, { skipDisplayNone: false });
          const expected = getContainingBlock(el, { skipDisplayNone: false });
          assert.strictEqual(actual, expected);
        });

        it(`should skip "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is true`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getOffsetContainer(el, { skipDisplayNone: true });
          const expected = getContainingBlock(el, { skipDisplayNone: true });
          assert.strictEqual(actual, expected);
        });
      }
    });
  });

  describe('relative positioned element', function () {
    it(`should always return the provided element if it's relative positioned`, function () {
      el.style.position = 'relative';
      const actual = getOffsetContainer(el);
      const expected = el;
      assert.strictEqual(actual, expected);
    });
  });

  describe('static positioned element', function () {
    it(`should return null if the provided element is static positioned`, function () {
      el.style.position = 'static';
      const actual = getOffsetContainer(el);
      const expected = null;
      assert.strictEqual(actual, expected);
    });
  });

  describe('sticky positioned element', function () {
    it(`should return null if the provided element is sticky positioned`, function () {
      el.style.position = 'sticky';
      const actual = getOffsetContainer(el);
      const expected = null;
      assert.strictEqual(actual, expected);
    });
  });
});
