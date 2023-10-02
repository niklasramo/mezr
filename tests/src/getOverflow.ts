import { assert } from 'chai';
import { beforeTest, afterTest } from './utils/hooks.js';
import { createTestElement } from './utils/createTestElement.js';
import { getOverflow } from '../../src/index.js';

describe('getOverflow()', function () {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('basic tests with BoxRects', () => {
    it('should calculate the overflow for a fully contained box', () => {
      const container = { left: 0, top: 0, width: 200, height: 200 };
      const target = { left: 50, top: 50, width: 100, height: 100 };
      const result = getOverflow(target, container);
      assert.deepEqual(result, { left: -50, right: -50, top: -50, bottom: -50 });
    });

    it('should calculate the overflow for a non-overlapping box', () => {
      const container = { left: 0, top: 0, width: 100, height: 100 };
      const target = { left: 200, top: 200, width: 100, height: 100 };
      const result = getOverflow(target, container);
      assert.deepEqual(result, { left: -200, right: 200, top: -200, bottom: 200 });
    });

    it('should calculate the overflow for a partially overlapping box', () => {
      const container = { left: 0, top: 0, width: 150, height: 150 };
      const target = { left: 100, top: 100, width: 100, height: 100 };
      const result = getOverflow(target, container);
      assert.deepEqual(result, { left: -100, right: 50, top: -100, bottom: 50 });
    });
  });

  describe('DOM elements', function () {
    it('should calculate the overflow for a fully contained DOM element', function () {
      const container = createTestElement({
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '200px',
        height: '200px',
      });
      const target = createTestElement({
        position: 'absolute',
        left: '50px',
        top: '50px',
        width: '100px',
        height: '100px',
      });
      const result = getOverflow(target, container);
      assert.deepEqual(result, { left: -50, right: -50, top: -50, bottom: -50 });
    });

    it('should calculate the overflow for a non-overlapping DOM element', function () {
      const container = createTestElement({
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '100px',
        height: '100px',
      });
      const target = createTestElement({
        position: 'absolute',
        left: '200px',
        top: '200px',
        width: '100px',
        height: '100px',
      });
      const result = getOverflow(target, container);
      assert.deepEqual(result, { left: -200, right: 200, top: -200, bottom: 200 });
    });

    it('should consider box edges for the overflow calculations', function () {
      const container = createTestElement({
        boxSizing: 'border-box',
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '120px',
        height: '120px',
        padding: '10px',
        border: '5px solid black',
      });
      const target = createTestElement({
        boxSizing: 'border-box',
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '140px',
        height: '140px',
        border: '5px solid black',
        margin: '10px',
      });
      const result = getOverflow([target, 'margin'], [container, 'content']);
      assert.deepEqual(result, { left: 15, right: 55, top: 15, bottom: 55 });
    });
  });

  describe('compass points', () => {
    const container = { left: 0, top: 0, width: 200, height: 200 };

    const compassPoints = [
      {
        direction: 'North (N)',
        nonIntersect: {
          rect: { left: 0, top: -250, width: 200, height: 200 },
          expected: { left: 0, right: 0, top: 250, bottom: -250 },
        },
        intersect: {
          rect: { left: 0, top: -150, width: 200, height: 200 },
          expected: { left: 0, right: 0, top: 150, bottom: -150 },
        },
      },
      {
        direction: 'South (S)',
        nonIntersect: {
          rect: { left: 0, top: 250, width: 200, height: 200 },
          expected: { left: 0, right: 0, top: -250, bottom: 250 },
        },
        intersect: {
          rect: { left: 0, top: 150, width: 200, height: 200 },
          expected: { left: 0, right: 0, top: -150, bottom: 150 },
        },
      },
      // Fix the rest!
      {
        direction: 'East (E)',
        nonIntersect: {
          rect: { left: 250, top: 0, width: 200, height: 200 },
          expected: { left: -250, right: 250, top: 0, bottom: 0 },
        },
        intersect: {
          rect: { left: 150, top: 0, width: 200, height: 200 },
          expected: { left: -150, right: 150, top: 0, bottom: 0 },
        },
      },
      {
        direction: 'West (W)',
        nonIntersect: {
          rect: { left: -250, top: 0, width: 200, height: 200 },
          expected: { left: 250, right: -250, top: 0, bottom: 0 },
        },
        intersect: {
          rect: { left: -150, top: 0, width: 200, height: 200 },
          expected: { left: 150, right: -150, top: 0, bottom: 0 },
        },
      },
      {
        direction: 'Northwest (NW)',
        nonIntersect: {
          rect: { left: -250, top: -250, width: 200, height: 200 },
          expected: { left: 250, right: -250, top: 250, bottom: -250 },
        },
        intersect: {
          rect: { left: -150, top: -150, width: 200, height: 200 },
          expected: { left: 150, right: -150, top: 150, bottom: -150 },
        },
      },
      {
        direction: 'Southeast (SE)',
        nonIntersect: {
          rect: { left: 250, top: 250, width: 200, height: 200 },
          expected: { left: -250, right: 250, top: -250, bottom: 250 },
        },
        intersect: {
          rect: { left: 150, top: 150, width: 200, height: 200 },
          expected: { left: -150, right: 150, top: -150, bottom: 150 },
        },
      },
      {
        direction: 'Southwest (SW)',
        nonIntersect: {
          rect: { left: -250, top: 250, width: 200, height: 200 },
          expected: { left: 250, right: -250, top: -250, bottom: 250 },
        },
        intersect: {
          rect: { left: -150, top: 150, width: 200, height: 200 },
          expected: { left: 150, right: -150, top: -150, bottom: 150 },
        },
      },
      {
        direction: 'Northeast (NE)',
        nonIntersect: {
          rect: { left: 250, top: -250, width: 200, height: 200 },
          expected: { left: -250, right: 250, top: 250, bottom: -250 },
        },
        intersect: {
          rect: { left: 150, top: -150, width: 200, height: 200 },
          expected: { left: -150, right: 150, top: 150, bottom: -150 },
        },
      },
    ];

    compassPoints.forEach((point) => {
      describe(point.direction, () => {
        it(`${point.direction}: target is not intersecting container`, () => {
          const result = getOverflow(point.nonIntersect.rect, container);
          assert.deepEqual(result, point.nonIntersect.expected);
        });

        it(`${point.direction}: target is intersecting container`, () => {
          const result = getOverflow(point.intersect.rect, container);
          assert.deepEqual(result, point.intersect.expected);
        });
      });
    });
  });
});
