import { assert } from 'chai';
import { beforeTest, afterTest } from './utils/hooks.js';
import { createTestElement } from './utils/createTestElement.js';
import { getDistance } from '../../src/index.js';

describe('getDistance()', function () {
  beforeEach(beforeTest);
  afterEach(afterTest);

  describe('rectA fully within rectB', function () {
    const rectA = { left: 100, top: 100, width: 100, height: 100 };
    const rectB = { left: 0, top: 0, width: 300, height: 300 };

    it('should return null for rectA within rectB', () => {
      const result = getDistance(rectA, rectB);
      assert.isNull(result);
    });

    it('should return null for rectB within rectA', () => {
      const result = getDistance(rectB, rectA);
      assert.isNull(result);
    });
  });

  describe('compass points - separated', function () {
    const rectCenter = { left: 100, top: 100, width: 100, height: 100 };

    it('should return the vertical distance for North (N) placement', () => {
      const rectN = { left: 100, top: 50, width: 100, height: 40 };
      const result = getDistance(rectCenter, rectN);
      assert.strictEqual(result, 10);
    });

    it('should return the diagonal distance for North East (NE) placement', () => {
      const rectNE = { left: 210, top: 50, width: 100, height: 40 };
      const result = getDistance(rectCenter, rectNE);
      assert.strictEqual(result, Math.sqrt(10 * 10 + 10 * 10));
    });

    it('should return the horizontal distance for East (E) placement', () => {
      const rectE = { left: 210, top: 100, width: 100, height: 100 };
      const result = getDistance(rectCenter, rectE);
      assert.strictEqual(result, 10);
    });

    it('should return the diagonal distance for South East (SE) placement', () => {
      const rectSE = { left: 210, top: 210, width: 100, height: 100 };
      const result = getDistance(rectCenter, rectSE);
      assert.strictEqual(result, Math.sqrt(10 * 10 + 10 * 10));
    });

    it('should return the vertical distance for South (S) placement', () => {
      const rectS = { left: 100, top: 210, width: 100, height: 100 };
      const result = getDistance(rectCenter, rectS);
      assert.strictEqual(result, 10);
    });

    it('should return the diagonal distance for South West (SW) placement', () => {
      const rectSW = { left: 50, top: 210, width: 40, height: 100 };
      const result = getDistance(rectCenter, rectSW);
      assert.strictEqual(result, Math.sqrt(10 * 10 + 10 * 10));
    });

    it('should return the horizontal distance for West (W) placement', () => {
      const rectW = { left: 50, top: 100, width: 40, height: 100 };
      const result = getDistance(rectCenter, rectW);
      assert.strictEqual(result, 10);
    });

    it('should return the diagonal distance for North West (NW) placement', () => {
      const rectNW = { left: 50, top: 50, width: 40, height: 40 };
      const result = getDistance(rectCenter, rectNW);
      assert.strictEqual(result, Math.sqrt(10 * 10 + 10 * 10));
    });
  });

  describe('compass points - touching', function () {
    const rectCenter = { left: 100, top: 100, width: 100, height: 100 };

    it('should return zero distance for North (N) placement', () => {
      const rectN = { left: 100, top: 0, width: 100, height: 100 };
      const result = getDistance(rectCenter, rectN);
      assert.strictEqual(result, 0);
    });

    it('should return zero distance for North East (NE) placement', () => {
      const rectNE = { left: 200, top: 0, width: 100, height: 100 };
      const result = getDistance(rectCenter, rectNE);
      assert.strictEqual(result, 0);
    });

    it('should return zero distance for East (E) placement', () => {
      const rectE = { left: 200, top: 100, width: 100, height: 100 };
      const result = getDistance(rectCenter, rectE);
      assert.strictEqual(result, 0);
    });

    it('should return zero distance for South East (SE) placement', () => {
      const rectSE = { left: 200, top: 200, width: 100, height: 100 };
      const result = getDistance(rectCenter, rectSE);
      assert.strictEqual(result, 0);
    });

    it('should return zero distance for South (S) placement', () => {
      const rectS = { left: 100, top: 200, width: 100, height: 100 };
      const result = getDistance(rectCenter, rectS);
      assert.strictEqual(result, 0);
    });

    it('should return zero distance for South West (SW) placement', () => {
      const rectSW = { left: 0, top: 200, width: 100, height: 100 };
      const result = getDistance(rectCenter, rectSW);
      assert.strictEqual(result, 0);
    });

    it('should return zero distance for West (W) placement', () => {
      const rectW = { left: 0, top: 100, width: 100, height: 100 };
      const result = getDistance(rectCenter, rectW);
      assert.strictEqual(result, 0);
    });

    it('should return zero distance for North West (NW) placement', () => {
      const rectNW = { left: 0, top: 0, width: 100, height: 100 };
      const result = getDistance(rectCenter, rectNW);
      assert.strictEqual(result, 0);
    });
  });

  describe('compass points - intersecting', function () {
    const rectCenter = { left: 100, top: 100, width: 100, height: 100 };

    it('should return null for slight North (N) intersection', () => {
      const rectN = { left: 100, top: 0.01, width: 100, height: 100 };
      const result = getDistance(rectCenter, rectN);
      assert.isNull(result);
    });

    it('should return null for slight North East (NE) intersection', () => {
      const rectNE = { left: 199.99, top: 0.01, width: 100, height: 100 };
      const result = getDistance(rectCenter, rectNE);
      assert.isNull(result);
    });

    it('should return null for slight East (E) intersection', () => {
      const rectE = { left: 199.99, top: 100, width: 100, height: 100 };
      const result = getDistance(rectCenter, rectE);
      assert.isNull(result);
    });

    it('should return null for slight South East (SE) intersection', () => {
      const rectSE = { left: 199.99, top: 199.99, width: 100, height: 100 };
      const result = getDistance(rectCenter, rectSE);
      assert.isNull(result);
    });

    it('should return null for slight South (S) intersection', () => {
      const rectS = { left: 100, top: 199.99, width: 100, height: 100 };
      const result = getDistance(rectCenter, rectS);
      assert.isNull(result);
    });

    it('should return null for slight South West (SW) intersection', () => {
      const rectSW = { left: 0.01, top: 199.99, width: 100, height: 100 };
      const result = getDistance(rectCenter, rectSW);
      assert.isNull(result);
    });

    it('should return null for slight West (W) intersection', () => {
      const rectW = { left: 0.01, top: 100, width: 100, height: 100 };
      const result = getDistance(rectCenter, rectW);
      assert.isNull(result);
    });

    it('should return null for slight North West (NW) intersection', () => {
      const rectNW = { left: 0.01, top: 0.01, width: 100, height: 100 };
      const result = getDistance(rectCenter, rectNW);
      assert.isNull(result);
    });
  });

  describe('DOM elements', function () {
    it('should return the distance between two non-overlapping DOM elements', function () {
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
      const result = getDistance(elA, elB);
      assert.strictEqual(result, Math.sqrt(100 ** 2 + 100 ** 2));
    });

    it('should account for the box edge accordingly', function () {
      const elA = createTestElement({
        boxSizing: 'border-box',
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '100px',
        height: '100px',
        padding: '10px',
        border: '5px solid black',
      });
      const elB = createTestElement({
        boxSizing: 'border-box',
        position: 'absolute',
        left: '100px',
        top: '0px',
        width: '100px',
        height: '100px',
        padding: '10px',
        border: '5px solid black',
      });
      const result = getDistance([elA, 'content'], [elB, 'padding']);
      const expectedDistance = 20;
      assert.strictEqual(result, expectedDistance);
    });

    it('should return null for overlapping DOM elements', function () {
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
        width: '100px',
        height: '100px',
      });
      const result = getDistance(elA, elB);
      assert.isNull(result);
    });
  });
});
