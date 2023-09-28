import { assert } from 'chai';
import { getContainingBlock } from '../../src/index.js';
import { getEffectiveContainingBlock } from './utils/getEffectiveContainingBlock.js';
import { createTestElement } from './utils/createTestElement.js';
import { IS_SAFARI } from './utils/constants.js';

const specialCases = [
  {
    property: 'transform',
    value: 'translateX(10px)',
    containsInline: false,
    containsBlock: true,
  },
  {
    property: 'perspective',
    value: '500px',
    containsInline: false,
    containsBlock: true,
  },
  {
    property: 'contentVisibility',
    value: 'auto',
    containsInline: false,
    containsBlock: !IS_SAFARI,
  },
  {
    property: 'contain',
    value: 'paint',
    containsInline: false,
    containsBlock: true,
  },
  {
    property: 'contain',
    value: 'layout',
    containsInline: false,
    containsBlock: true,
  },
  {
    property: 'contain',
    value: 'strict',
    containsInline: false,
    containsBlock: true,
  },
  {
    property: 'contain',
    value: 'content',
    containsInline: false,
    containsBlock: true,
  },
  {
    property: 'willChange',
    value: 'transform',
    containsInline: false,
    containsBlock: true,
  },
  {
    property: 'willChange',
    value: 'perspective',
    containsInline: false,
    containsBlock: true,
  },
  {
    property: 'willChange',
    value: 'contain',
    containsInline: false,
    containsBlock: true,
  },
  {
    property: 'filter',
    value: 'blur(5px)',
    containsInline: !IS_SAFARI,
    containsBlock: !IS_SAFARI,
  },
  {
    property: 'backdropFilter',
    value: 'blur(5px)',
    containsInline: !IS_SAFARI,
    containsBlock: !IS_SAFARI,
  },
  {
    property: 'willChange',
    value: 'filter',
    containsInline: !IS_SAFARI,
    containsBlock: true,
  },
  {
    property: 'willChange',
    value: 'backdrop-filter',
    containsInline: !IS_SAFARI,
    containsBlock: !IS_SAFARI,
  },
] as const;

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

    specialCases.forEach(({ property, value, containsInline }) => {
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

    specialCases.forEach(({ property, value, containsInline }) => {
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
      it(`${position}: should return document element if no other containing block ancestor is found`, function () {
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

      it(`${position}: should return the closest block-level element (1/2)`, function () {
        document.documentElement.style.display = 'block';
        document.body.style.display = 'block';
        container.style.display = 'block';
        el.style.position = position;
        const actual = getContainingBlock(el);
        const computed = getEffectiveContainingBlock(el, 0.5);
        const expected = container;
        assert.equal(actual, computed, 'matches computed containing block');
        assert.equal(actual, expected, 'matches expected containing block');
      });

      it(`${position}: should return the closest block-level element (2/2)`, function () {
        document.documentElement.style.display = 'block';
        document.body.style.display = 'block';
        container.style.display = 'inline';
        el.style.position = position;
        const actual = getContainingBlock(el);
        const computed = getEffectiveContainingBlock(el, 0.5);
        const expected = document.body;
        assert.equal(actual, computed, 'matches computed containing block');
        assert.equal(actual, expected, 'matches expected containing block');
      });
    });
  });
});
