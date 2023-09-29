import { BoxElementExtended, BoxRect } from './types.js';

export function isRectObject(value: BoxElementExtended): value is BoxRect {
  return value?.constructor === Object;
}
