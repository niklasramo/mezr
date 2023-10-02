import { getWidth } from './getWidth.js';
import { getHeight } from './getHeight.js';
import { getOffset } from './getOffset.js';
import { isRectObject } from './utils/isRectObject.js';
import { BoxObject, BoxRectFull } from './utils/types.js';

/**
 * Returns an object containing the provided element's dimensions and offsets.
 * This is basically a helper method for calculating an element's dimensions and
 * offsets simultaneously. Mimics the native getBoundingClientRect method with
 * the added bonus of allowing to define the box edge of the element, and also
 * the element from which the offset is measured.
 */
export function getRect(element: BoxObject, offsetRoot?: BoxObject): BoxRectFull {
  let width = 0;
  let height = 0;
  if (isRectObject(element)) {
    width = element.width;
    height = element.height;
  } else if (Array.isArray(element)) {
    width = getWidth(...element);
    height = getHeight(...element);
  } else {
    width = getWidth(element);
    height = getHeight(element);
  }

  const offset = getOffset(element, offsetRoot);

  return {
    width,
    height,
    ...offset,
    right: offset.left + width,
    bottom: offset.top + height,
  };
}
