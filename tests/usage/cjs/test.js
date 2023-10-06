const assert = require('assert');
const mezr = require('mezr');

const rectA = { left: 0, top: 0, width: 100, height: 100 };
const rectB = { left: 200, top: 0, width: 100, height: 100 };

try {
  assert.strictEqual(mezr.getDistance(rectA, rectB), 100);
} catch (error) {
  console.error('CommonJS tests failed:', error.message);
}
