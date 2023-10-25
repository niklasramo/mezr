import { HAS_FLAKY_COMPUTED_DIMENSIONS } from './constants.js';
import { expect } from 'chai';

const BASE_THRESHOLD = HAS_FLAKY_COMPUTED_DIMENSIONS ? 0.65 : 0;

export function assertEqualDomNumbers(
  actual: any,
  expected: number,
  message?: string,
  threshold = 0,
) {
  return expect(actual).to.be.closeToNumber(expected, BASE_THRESHOLD + threshold, message);
}
