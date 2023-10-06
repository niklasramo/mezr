import { HAS_FLAKY_COMPUTED_DIMENSIONS } from './constants.js';
import { expect } from 'chai';

const THRESHOLD = HAS_FLAKY_COMPUTED_DIMENSIONS ? 1 : 0;

export function assertEqualDomNumbers(actual: any, expected: number, message?: string) {
  return expect(actual).to.be.closeToNumber(expected, THRESHOLD, message);
}
