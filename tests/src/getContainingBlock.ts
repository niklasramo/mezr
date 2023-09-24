import { assert } from 'chai';
import { getContainingBlock } from '../../src/index.js';
import { getEffectiveContainingBlock } from './utils/getEffectiveContainingBlock.js';
import { createTestElement } from './utils/createTestElement.js';

describe('getContainingBlock()', function () {
  let el: HTMLElement;
  let container: HTMLElement;
  const scale = 0.5;

  beforeEach(function () {
    // Set the document's dimensions.
    document.documentElement.style.width = '100vw';
    document.documentElement.style.height = '100vh';

    // Set body's dimensions.
    document.body.style.width = '200vw';
    document.body.style.height = '200vh';

    // Create container element.
    container = createTestElement({
      width: '300vw',
      height: '300vh',
    });

    // Create target element.
    el = createTestElement({
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: `${scale * 100}%`,
      height: `${scale * 100}%`,
    });

    // Move target element into container.
    container.appendChild(el);
  });

  describe('absolute positioned element', function () {
    it('should return window if no containing block element is found', function () {
      const actual = getContainingBlock(el);
      const computed = getEffectiveContainingBlock(el, 0.5);
      const expected = window;
      assert.equal(actual, computed, 'matches computed containing block');
      assert.equal(actual, expected, 'matches expected containing block');
    });

    ['relative', 'absolute', 'fixed', 'sticky'].forEach((position) => {
      it(`should return first block-level "${position}" positioned ancestor`, function () {
        container.style.position = position;
        const actual = getContainingBlock(el);
        const computed = getEffectiveContainingBlock(el, 0.5);
        const expected = container;
        assert.equal(actual, computed, 'matches computed containing block');
        assert.equal(actual, expected, 'matches expected containing block');
      });
      it(`should return first inline-level "${position}" positioned ancestor`, function () {
        container.style.position = position;
        container.style.display = 'inline';
        const actual = getContainingBlock(el);
        const computed = getEffectiveContainingBlock(el, 0.5);
        const expected = container;
        assert.equal(actual, computed, 'matches computed containing block');
        assert.equal(actual, expected, 'matches expected containing block');
      });
    });

    // Test cases where an ancestor is promoted to it's own compositor layer.
    (
      [
        { property: 'transform', value: 'translateX(10px)' },
        { property: 'perspective', value: '500px' },
        { property: 'backdropFilter', value: 'blur(5px)' },
        { property: 'contentVisibility', value: 'auto' },
        { property: 'contain', value: 'paint' },
        { property: 'contain', value: 'layout' },
        { property: 'contain', value: 'strict' },
        { property: 'contain', value: 'content' },
        { property: 'filter', value: 'blur(5px)' },
        { property: 'willChange', value: 'transform' },
        { property: 'willChange', value: 'perspective' },
        { property: 'willChange', value: 'filter' },
        { property: 'willChange', value: 'contain' },
      ] as const
    ).forEach(({ property, value }) => {
      it(`should recognize containing block when ${property} is set to ${value}`, function () {
        (container.style as any)[property] = value;
        const actual = getContainingBlock(el);
        const computed = getEffectiveContainingBlock(el, 0.5);
        // Note that here we only check the result agains computed, not against
        // expected, because the expected result depends on the browser's
        // implementation of the feature.
        assert.equal(actual, computed, 'matches computed containing block');
      });
    });
  });
});
