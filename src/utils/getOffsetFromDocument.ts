import { getStyleAsFloat } from './getStyleAsFloat.js';
import { isDocument } from './isDocument.js';
import { isWindow } from './isWindow.js';
import { DomRectElement, DomRectElementArea } from './types.js';

/**
 * Returns the element's (or window's) document offset, which in practice
 * means the vertical and horizontal distance between the element's northwest
 * corner and the document's northwest corner.
 */
export function getOffsetFromDocument(
  element: DomRectElement,
  area: DomRectElementArea = 'border'
) {
  const offset = {
    left: 0,
    top: 0,
  };

  if (isDocument(element)) {
    return offset;
  }

  if (isWindow(element)) {
    offset.left = element.scrollX || 0;
    offset.top = element.scrollY || 0;
    return offset;
  }

  const win = element.ownerDocument.defaultView;
  const rect = element.getBoundingClientRect();

  if (win) {
    offset.left = win.scrollX || 0;
    offset.top = win.scrollY || 0;
  }

  offset.left += rect.left;
  offset.top += rect.top;

  if (area === 'border') {
    return offset;
  }

  if (area === 'margin') {
    offset.left -= Math.max(0, getStyleAsFloat(element, 'margin-left'));
    offset.top -= Math.max(0, getStyleAsFloat(element, 'margin-top'));
    return offset;
  }

  if (area === 'scroll' || area === 'padding') {
    offset.left += getStyleAsFloat(element, 'border-left-width');
    offset.top += getStyleAsFloat(element, 'border-top-width');
    return offset;
  }

  offset.left += getStyleAsFloat(element, 'padding-left');
  offset.top += getStyleAsFloat(element, 'padding-top');

  return offset;
}
