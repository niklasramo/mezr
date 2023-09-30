import { BoxObject, BoxRect } from './types.js';

export function isRectObject(value: BoxObject): value is BoxRect {
  return value?.constructor === Object;
}
