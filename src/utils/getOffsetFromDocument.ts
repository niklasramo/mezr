import { BOX_AREA } from './constants.js';
import { getStyle } from './getStyle.js';
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
  area: DomRectElementArea = BOX_AREA.border,
) {
  const offset = {
    left: 0,
    top: 0,
  };

  if (isDocument(element)) {
    return offset;
  }

  if (isWindow(element)) {
    offset.left += element.scrollX || 0;
    offset.top += element.scrollY || 0;
    return offset;
  }

  const win = element.ownerDocument.defaultView;
  if (win) {
    offset.left += win.scrollX || 0;
    offset.top += win.scrollY || 0;
  }

  const rect = element.getBoundingClientRect();
  offset.left += rect.left;
  offset.top += rect.top;

  if (area === BOX_AREA.border) {
    return offset;
  }

  const style = getStyle(element);

  if (area === BOX_AREA.margin) {
    offset.left -= Math.max(0, parseFloat(style.marginLeft) || 0);
    offset.top -= Math.max(0, parseFloat(style.marginTop) || 0);
    return offset;
  }

  offset.left += parseFloat(style.borderLeftWidth) || 0;
  offset.top += parseFloat(style.borderTopWidth) || 0;

  if (area === BOX_AREA.scroll || area === BOX_AREA.padding) {
    return offset;
  }

  offset.left += parseFloat(style.paddingLeft) || 0;
  offset.top += parseFloat(style.paddingTop) || 0;

  return offset;
}
