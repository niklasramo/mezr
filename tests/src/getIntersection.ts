import { assert } from 'chai';
import { beforeTest, afterTest } from './utils/hooks.js';
import { createTestElement } from './utils/createTestElement.js';
import { getIntersection } from '../../src/index.js';

describe('getIntersection()', function () {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('basic tests with BoxRects', () => {
    it('should return a new object', () => {
      const rectA = { left: 0, top: 0, width: 100, height: 100 };
      const result = getIntersection(rectA);
      assert.notEqual(result, rectA);
    });

    it('should return the first element rect if no other elements are provided', () => {
      const rectA = { left: 0, top: 0, width: 100, height: 100 };
      const result = getIntersection(rectA);
      assert.deepEqual(result, { ...rectA, right: 100, bottom: 100 });
    });

    it('should return the intersection area of two overlapping elements', () => {
      const rectA = { left: 0, top: 0, width: 100, height: 100 };
      const rectB = { left: 50, top: 50, width: 150, height: 150 };
      const result = getIntersection(rectA, rectB);
      assert.deepEqual(result, {
        left: 50,
        top: 50,
        width: 50,
        height: 50,
        right: 100,
        bottom: 100,
      });
    });

    it('should return the intersection area of three overlapping elements', () => {
      const rectA = { left: 0, top: 0, width: 100, height: 100 };
      const rectB = { left: 50, top: 50, width: 150, height: 150 };
      const rectC = { left: 60, top: 60, width: 10, height: 200 };
      const result = getIntersection(rectA, rectB, rectC);
      assert.deepEqual(result, {
        left: 60,
        top: 60,
        width: 10,
        height: 40,
        right: 70,
        bottom: 100,
      });
    });

    it('should return null for non-overlapping elements', () => {
      const rectA = { left: 0, top: 0, width: 100, height: 100 };
      const rectB = { left: 200, top: 200, width: 100, height: 100 };
      const result = getIntersection(rectA, rectB);
      assert.isNull(result);
    });
  });

  describe('DOM elements', function () {
    it('should return the intersection area of two overlapping DOM elements', function () {
      const elA = createTestElement({
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '100px',
        height: '100px',
      });
      const elB = createTestElement({
        position: 'absolute',
        left: '50px',
        top: '50px',
        width: '150px',
        height: '150px',
      });
      const result = getIntersection(elA, elB);
      assert.deepEqual(result, {
        left: 50,
        top: 50,
        width: 50,
        height: 50,
        right: 100,
        bottom: 100,
      });
    });

    it('should return the intersection area of a DOM element and a rect object', function () {
      const el = createTestElement({
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '100px',
        height: '100px',
      });
      const rectObject = { left: 50, top: 50, width: 100, height: 100 };
      const result = getIntersection(el, rectObject);
      assert.deepEqual(result, {
        left: 50,
        top: 50,
        width: 50,
        height: 50,
        right: 100,
        bottom: 100,
      });
    });

    it('should return null for non-overlapping DOM elements', function () {
      const elA = createTestElement({
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '100px',
        height: '100px',
      });
      const elB = createTestElement({
        position: 'absolute',
        left: '200px',
        top: '200px',
        width: '100px',
        height: '100px',
      });
      const result = getIntersection(elA, elB);
      assert.isNull(result);
    });

    it('should consider box edges for the calculations', function () {
      const elA = createTestElement({
        boxSizing: 'border-box',
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '120px',
        height: '120px',
        padding: '10px',
        border: '5px solid black',
      });
      const result = getIntersection([elA, 'content'], [elA, 'border']);
      assert.deepEqual(result, {
        left: 15,
        top: 15,
        width: 90,
        height: 90,
        right: 105,
        bottom: 105,
      });
    });
  });
});
