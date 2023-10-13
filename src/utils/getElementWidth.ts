import { BOX_EDGE, SCROLLABLE_OVERFLOWS } from './constants.js';
import { BoxElementEdge } from './types.js';
import { getStyle } from './getStyle.js';
import { isDocumentElement } from './isDocumentElement.js';

function getScrollbarWidth(
  element: Element,
  style: CSSStyleDeclaration,
  widthWithoutBorders: number,
) {
  // Document element actually can not have a scrollbar, at least in the same
  // sense as the other elements, so let's return 0. When you define an overflow
  // value for the document element that causes a scrollbar to appear, it
  // actually appears for the window, outside the document element's bounds.
  if (isDocumentElement(element)) {
    return 0;
  }

  // Make sure the element can have a vertical scrollbar.
  if (!SCROLLABLE_OVERFLOWS.has(style.overflowY)) {
    return 0;
  }

  return Math.max(0, Math.round(widthWithoutBorders) - element.clientWidth);
}

export function getElementWidth(element: Element, boxEdge: BoxElementEdge = BOX_EDGE.border) {
  let { width } = element.getBoundingClientRect();

  if (boxEdge === BOX_EDGE.border) {
    return width;
  }

  const style = getStyle(element);

  if (boxEdge === BOX_EDGE.margin) {
    width += Math.max(0, parseFloat(style.marginLeft) || 0);
    width += Math.max(0, parseFloat(style.marginRight) || 0);
    return width;
  }

  width -= parseFloat(style.borderLeftWidth) || 0;
  width -= parseFloat(style.borderRightWidth) || 0;

  if (boxEdge === BOX_EDGE.scroll) {
    return width;
  }

  width -= getScrollbarWidth(element, style, width);

  if (boxEdge === BOX_EDGE.padding) {
    return width;
  }

  width -= parseFloat(style.paddingLeft) || 0;
  width -= parseFloat(style.paddingRight) || 0;

  return width;
}
