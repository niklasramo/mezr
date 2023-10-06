import assert from 'assert';
import { getDistance } from 'mezr';

const rectA = { left: 0, top: 0, width: 100, height: 100 };
const rectB = { left: 200, top: 0, width: 100, height: 100 };

try {
  assert.strictEqual(getDistance(rectA, rectB), 100);
} catch (error) {
  console.error('ES Module tests failed:', error.message);
}
