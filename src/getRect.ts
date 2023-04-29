import { getWidth } from './getWidth.js';
import { getHeight } from './getHeight.js';
import { getOffset } from './getOffset.js';
import { isRectObject } from './utils/isRectObject.js';
import { cacheBcr, clearBcrCache } from 'utils/bcr.js';
import { Rect, DomRectElement, DomRectArray } from './utils/types.js';

export function getRect(
  element: Rect | DomRectElement | DomRectArray,
  offsetRoot?: Rect | DomRectElement | DomRectArray
) {
  let width = 0;
  let height = 0;
  if (isRectObject(element)) {
    width = element.width;
    height = element.height;
  } else if (Array.isArray(element)) {
    if (element[0] instanceof Element) {
      cacheBcr(element[0]);
    }
    width = getWidth(element[0], element[1]);
    height = getHeight(element[0], element[1]);
  } else {
    if (element instanceof Element) {
      cacheBcr(element);
    }
    width = getWidth(element);
    height = getHeight(element);
  }

  const offset = getOffset(element, offsetRoot);

  clearBcrCache();

  return {
    width,
    height,
    ...offset,
    right: offset.left + width,
    bottom: offset.top + height,
  };
}
