import { use, Assertion } from 'chai';

use(function (_chai, utils) {
  Assertion.addMethod(
    'closeToNumber',
    function (expected: number, threshold: number, message?: string) {
      const actual = utils.flag(this, 'object');

      // Make sure we have numbers.
      new Assertion(actual).to.be.a('number');
      new Assertion(expected).to.be.a('number');
      new Assertion(threshold).to.be.a('number');

      this.assert(
        // test expression
        Math.abs(actual - expected) <= threshold,
        // message if value fails
        `${
          message ? message + ': ' : ''
        }Expected ${actual} to be ${expected} (threshold: ${threshold})`,
        // message if negated value fails
        `${
          message ? message + ': ' : ''
        }Expected ${actual} not to be ${expected} (threshold: ${threshold})`,
        // expected value
        expected,
        // actual value
        actual,
        // show diff?
        true,
      );
    },
  );
});

declare global {
  namespace Chai {
    interface Assertion {
      closeToNumber(expected: number, threshold: number, message?: string): Assertion;
    }
  }
}
