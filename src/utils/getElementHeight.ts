import { BOX_EDGE, SCROLLABLE_OVERFLOWS } from './constants.js';
import { BoxElementEdge } from './types.js';
import { getStyle } from './getStyle.js';
import { isDocumentElement } from './isDocumentElement.js';

function getScrollbarHeight(
  element: Element,
  style: CSSStyleDeclaration,
  heightWithoutBorders: number,
) {
  // Document element actually can not have a scrollbar, at least in the same
  // sense as the other elements, so let's return 0. When you define an overflow
  // value for the document element that causes a scrollbar to appear, it
  // actually appears for the window, outside the document element's bounds.
  if (isDocumentElement(element)) {
    return 0;
  }

  // Make sure the element can have a horizontal scrollbar.
  if (!SCROLLABLE_OVERFLOWS.has(style.overflowX)) {
    return 0;
  }

  return Math.max(0, Math.round(heightWithoutBorders) - element.clientHeight);
}

export function getElementHeight(element: Element, boxEdge: BoxElementEdge = BOX_EDGE.border) {
  let { height } = element.getBoundingClientRect();

  if (boxEdge === BOX_EDGE.border) {
    return height;
  }

  const style = getStyle(element);

  if (boxEdge === BOX_EDGE.margin) {
    height += Math.max(0, parseFloat(style.marginTop) || 0);
    height += Math.max(0, parseFloat(style.marginBottom) || 0);
    return height;
  }

  height -= parseFloat(style.borderTopWidth) || 0;
  height -= parseFloat(style.borderBottomWidth) || 0;

  if (boxEdge === BOX_EDGE.scroll) {
    return height;
  }

  height -= getScrollbarHeight(element, style, height);

  if (boxEdge === BOX_EDGE.padding) {
    return height;
  }

  height -= parseFloat(style.paddingTop) || 0;
  height -= parseFloat(style.paddingBottom) || 0;

  return height;
}
