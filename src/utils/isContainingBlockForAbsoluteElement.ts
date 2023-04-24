import { getStyle } from '../getStyle.js';
import { isContainingBlockForFixedElement } from './isContainingBlockForFixedElement.js';

export function isContainingBlockForAbsoluteElement(element: HTMLElement) {
  // The first thing to check is the element's position. If it's anything else
  // than "static" the element is a containing block.
  if (getStyle(element, 'position') !== 'static') {
    return true;
  }

  // At this point the same rules apply as for fixed elements.
  return isContainingBlockForFixedElement(element);
}
