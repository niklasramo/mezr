import { assert } from 'chai';
import { getContainingBlock } from '../../src/index.js';
import { getEffectiveContainingBlock } from './utils/getEffectiveContainingBlock.js';
import { createTestElement } from './utils/createTestElement.js';
import { CONTAINING_BLOCK_SPECIAL_CASES } from './utils/constants.js';

describe('getContainingBlock()', function () {
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
    beforeEach(function () {
      el.style.position = 'absolute';
    });

    it('should return window if no containing block ancestor is found', function () {
      const actual = getContainingBlock(el);
      const computed = getEffectiveContainingBlock(el, 0.5);
      const expected = window;
      assert.equal(actual, computed, 'matches computed containing block');
      assert.equal(actual, expected, 'matches expected containing block');
    });

    ['relative', 'absolute', 'fixed', 'sticky'].forEach((position) => {
      it(`should recognize block-level "position:${position}" ancestors`, function () {
        container.style.display = 'block';
        container.style.position = position;
        const actual = getContainingBlock(el);
        const computed = getEffectiveContainingBlock(el, 0.5);
        const expected = container;
        assert.equal(actual, computed, 'matches computed containing block');
        assert.equal(actual, expected, 'matches expected containing block');
      });

      it(`should recognize inline-level "position:${position}" ancestors`, function () {
        container.style.display = 'inline';
        container.style.position = position;
        const actual = getContainingBlock(el);
        const computed = getEffectiveContainingBlock(el, 0.5);
        const expected = container;
        assert.equal(actual, computed, 'matches computed containing block');
        assert.equal(actual, expected, 'matches expected containing block');
      });

      it(`should recognize "display:none" "position:${position}" ancestors`, function () {
        container.style.display = 'none';
        container.style.position = position;
        const actual = getContainingBlock(el);
        const expected = container;
        assert.equal(actual, expected);
      });
    });

    CONTAINING_BLOCK_SPECIAL_CASES.forEach(({ property, value, containsInline }) => {
      it(`should recognize block-level "position:static" "${property}:${value}" ancestors`, function () {
        container.style.display = 'block';
        container.style.position = 'static';
        (container.style as any)[property] = value;
        const actual = getContainingBlock(el);
        const computed = getEffectiveContainingBlock(el, 0.5);
        assert.equal(actual, computed);
      });

      if (containsInline) {
        it(`should recognize inline-level "position:static" "${property}:${value}" ancestors`, function () {
          container.style.display = 'inline';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el);
          const computed = getEffectiveContainingBlock(el, 0.5);
          assert.equal(actual, computed);
        });

        it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors by default`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el);
          const computed = getEffectiveContainingBlock(el, 0.5);
          const expected = container;
          assert.equal(actual, computed, 'matches computed containing block');
          assert.equal(actual, expected, 'matches expected containing block');
        });

        it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is false`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el, { skipDisplayNone: false });
          const computed = getEffectiveContainingBlock(el, 0.5);
          const expected = container;
          assert.equal(actual, computed, 'matches computed containing block');
          assert.equal(actual, expected, 'matches expected containing block');
        });

        it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is true`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el, { skipDisplayNone: true });
          const computed = getEffectiveContainingBlock(el, 0.5);
          const expected = container;
          assert.equal(actual, computed, 'matches computed containing block');
          assert.equal(actual, expected, 'matches expected containing block');
        });
      } else {
        it(`should not recognize inline-level "position:static" "${property}:${value}" ancestors`, function () {
          container.style.display = 'inline';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el);
          const computed = getEffectiveContainingBlock(el, 0.5);
          assert.equal(actual, computed);
        });

        it(`should return null on "display:none" "position:static" "${property}:${value}" ancestors by default`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el);
          const expected = null;
          assert.equal(actual, expected);
        });

        it(`should return null on "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is false`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el, { skipDisplayNone: false });
          const expected = null;
          assert.equal(actual, expected);
        });

        it(`should skip "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is true`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el, { skipDisplayNone: true });
          const expected = window;
          assert.equal(actual, expected);
        });
      }
    });

    it(`should return null on "display:none" "position:static" ancestors by default`, function () {
      container.style.display = 'none';
      container.style.position = 'static';
      const actual = getContainingBlock(el);
      const expected = null;
      assert.equal(actual, expected);
    });

    it(`should skip "display:none" "position:static" ancestors when skipDisplayNone option is false`, function () {
      container.style.display = 'none';
      container.style.position = 'static';
      const actual = getContainingBlock(el, { skipDisplayNone: false });
      const expected = null;
      assert.equal(actual, expected);
    });

    it(`should skip "display:none" "position:static" ancestors when skipDisplayNone option is true`, function () {
      container.style.display = 'none';
      container.style.position = 'static';
      const actual = getContainingBlock(el, { skipDisplayNone: true });
      const expected = window;
      assert.equal(actual, expected);
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
        const actual = getContainingBlock(el);
        const computed = getEffectiveContainingBlock(el, 0.5);
        const expected = window;
        assert.equal(actual, computed, 'matches computed containing block');
        assert.equal(actual, expected, 'matches expected containing block');
      });

      it(`should not recognize inline-level "position:${position}" ancestors`, function () {
        container.style.display = 'inline';
        container.style.position = position;
        const actual = getContainingBlock(el);
        const computed = getEffectiveContainingBlock(el, 0.5);
        const expected = window;
        assert.equal(actual, computed, 'matches computed containing block');
        assert.equal(actual, expected, 'matches expected containing block');
      });

      it(`should return null on "display:none" "position:${position}" ancestors by default`, function () {
        container.style.display = 'none';
        container.style.position = position;
        const actual = getContainingBlock(el);
        const expected = null;
        assert.equal(actual, expected);
      });

      it(`should return null on "display:none" "position:${position}" ancestors when skipDisplayNone option is false`, function () {
        container.style.display = 'none';
        container.style.position = position;
        const actual = getContainingBlock(el, { skipDisplayNone: false });
        const expected = null;
        assert.equal(actual, expected);
      });

      it(`should skip "display:none" "position:${position}" ancestors when skipDisplayNone option is true`, function () {
        container.style.display = 'none';
        container.style.position = position;
        const actual = getContainingBlock(el, { skipDisplayNone: true });
        const expected = window;
        assert.equal(actual, expected);
      });
    });

    CONTAINING_BLOCK_SPECIAL_CASES.forEach(({ property, value, containsInline }) => {
      it(`should recognize block-level "position:static" "${property}:${value}" ancestors`, function () {
        container.style.display = 'block';
        container.style.position = 'static';
        (container.style as any)[property] = value;
        const actual = getContainingBlock(el);
        const computed = getEffectiveContainingBlock(el, 0.5);
        assert.equal(actual, computed);
      });

      if (containsInline) {
        it(`should recognize inline-level "position:static" "${property}:${value}" ancestors`, function () {
          container.style.display = 'inline';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el);
          const computed = getEffectiveContainingBlock(el, 0.5);
          assert.equal(actual, computed);
        });

        it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors by default`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el);
          const computed = getEffectiveContainingBlock(el, 0.5);
          const expected = container;
          assert.equal(actual, computed, 'matches computed containing block');
          assert.equal(actual, expected, 'matches expected containing block');
        });

        it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is false`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el, { skipDisplayNone: false });
          const computed = getEffectiveContainingBlock(el, 0.5);
          const expected = container;
          assert.equal(actual, computed, 'matches computed containing block');
          assert.equal(actual, expected, 'matches expected containing block');
        });

        it(`should recognize "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is true`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el, { skipDisplayNone: true });
          const computed = getEffectiveContainingBlock(el, 0.5);
          const expected = container;
          assert.equal(actual, computed, 'matches computed containing block');
          assert.equal(actual, expected, 'matches expected containing block');
        });
      } else {
        it(`should not recognize inline-level "position:static" "${property}:${value}" ancestors`, function () {
          container.style.display = 'inline';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el);
          const computed = getEffectiveContainingBlock(el, 0.5);
          assert.equal(actual, computed);
        });

        it(`should return null on "display:none" "position:static" "${property}:${value}" ancestors by default`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el);
          const expected = null;
          assert.equal(actual, expected);
        });

        it(`should return null on "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is false`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el, { skipDisplayNone: false });
          const expected = null;
          assert.equal(actual, expected);
        });

        it(`should skip "display:none" "position:static" "${property}:${value}" ancestors when skipDisplayNone option is true`, function () {
          container.style.display = 'none';
          container.style.position = 'static';
          (container.style as any)[property] = value;
          const actual = getContainingBlock(el, { skipDisplayNone: true });
          const expected = window;
          assert.equal(actual, expected);
        });
      }
    });
  });

  describe('static/relative/sticky element', function () {
    ['static', 'relative', 'sticky'].forEach((position) => {
      it(`should return document element for "position:${position}" element if no other containing block ancestor is found`, function () {
        document.documentElement.style.display = 'inline';
        document.body.style.display = 'inline';
        container.style.display = 'inline';
        el.style.position = position;
        const actual = getContainingBlock(el);
        const computed = getEffectiveContainingBlock(el, 0.5);
        const expected = document.documentElement;
        assert.equal(actual, computed, 'matches computed containing block');
        assert.equal(actual, expected, 'matches expected containing block');
      });

      it(`should return the closest block-level ancestor for "position:${position}" element`, function () {
        document.body.style.display = 'block';
        container.style.display = 'block';
        el.style.position = position;
        const actual = getContainingBlock(el);
        const computed = getEffectiveContainingBlock(el, 0.5);
        const expected = container;
        assert.equal(actual, computed, 'matches computed containing block');
        assert.equal(actual, expected, 'matches expected containing block');
      });

      it(`should skip all inline-level ancestors for "position:${position}" element`, function () {
        document.body.style.display = 'block';
        container.style.display = 'inline';
        el.style.position = position;
        const actual = getContainingBlock(el);
        const computed = getEffectiveContainingBlock(el, 0.5);
        const expected = document.body;
        assert.equal(actual, computed, 'matches computed containing block');
        assert.equal(actual, expected, 'matches expected containing block');
      });

      it(`should return null for "position:${position}" element when "display:none" ancestor is reached`, function () {
        document.body.style.display = 'none';
        container.style.display = 'inline';
        el.style.position = position;
        const actual = getContainingBlock(el);
        const expected = null;
        assert.equal(actual, expected);
      });

      it(`should return null for "position:${position}" element when "display:none" ancestor is reached when skipDisplayNone option is false`, function () {
        document.body.style.display = 'none';
        container.style.display = 'inline';
        el.style.position = position;
        const actual = getContainingBlock(el, { skipDisplayNone: false });
        const expected = null;
        assert.equal(actual, expected);
      });

      it(`should skip "display:none" ancestor for "position:${position}" element when skipDisplayNone option is true`, function () {
        document.body.style.display = 'block';
        container.style.display = 'none';
        el.style.position = position;
        const actual = getContainingBlock(el, { skipDisplayNone: true });
        const expected = document.body;
        assert.equal(actual, expected);
      });
    });
  });

  describe('position option', function () {
    it('should be able to fake fixed position for absolute positioned element', function () {
      container.style.display = 'block';
      container.style.position = 'relative';
      el.style.position = 'absolute';
      const actual = getContainingBlock(el, { position: 'fixed' });
      const expected = window;
      assert.equal(actual, expected);
    });

    it('should be able to fake absolute position for fixed positioned element', function () {
      container.style.display = 'block';
      container.style.position = 'relative';
      el.style.position = 'fixed';
      const actual = getContainingBlock(el, { position: 'absolute' });
      const expected = container;
      assert.equal(actual, expected);
    });

    it('should be able to fake relative position for fixed positioned element', function () {
      container.style.display = 'block';
      el.style.position = 'fixed';
      const actual = getContainingBlock(el, { position: 'relative' });
      const expected = container;
      assert.equal(actual, expected);
    });

    it('should be able to fake fixed position for relative positioned element', function () {
      container.style.display = 'block';
      el.style.position = 'relative';
      const actual = getContainingBlock(el, { position: 'fixed' });
      const expected = window;
      assert.equal(actual, expected);
    });

    it('should be able to fake relative position for absolute positioned element', function () {
      container.style.display = 'block';
      container.style.position = 'static';
      el.style.position = 'absolute';
      const actual = getContainingBlock(el, { position: 'relative' });
      const expected = container;
      assert.equal(actual, expected);
    });

    it('should be able to fake absolute position for relative positioned element', function () {
      document.body.style.position = 'relative';
      container.style.display = 'block';
      el.style.position = 'relative';
      const actual = getContainingBlock(el, { position: 'absolute' });
      const expected = document.body;
      assert.equal(actual, expected);
    });
  });
});
