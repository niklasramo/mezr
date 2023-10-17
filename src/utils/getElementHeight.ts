import { BOX_EDGE, SCROLLABLE_OVERFLOWS } from './constants.js';
import { BoxElementEdge } from './types.js';
import { getStyle } from './getStyle.js';
import { isDocumentElement } from './isDocumentElement.js';

export function getElementHeight(element: Element, boxEdge: BoxElementEdge = BOX_EDGE.border) {
  // Let's get the bounding client rect and start subtracting the layers one by
  // one. This is the the most precise way to compute subpixel height in all
  // browsers.
  let { height } = element.getBoundingClientRect();

  // With border height we are done right off the bat.
  if (boxEdge === BOX_EDGE.border) {
    return height;
  }

  const style = getStyle(element);

  // With margin height we need to add the margins to the height.
  if (boxEdge === BOX_EDGE.margin) {
    height += Math.max(0, parseFloat(style.marginTop) || 0);
    height += Math.max(0, parseFloat(style.marginBottom) || 0);
    return height;
  }

  // Let's peel off the borders.
  height -= parseFloat(style.borderTopWidth) || 0;
  height -= parseFloat(style.borderBottomWidth) || 0;

  // With scrollbar height we are done.
  if (boxEdge === BOX_EDGE.scrollbar) {
    return height;
  }

  // Subtract the scrollbar height if the element has a horizontal scrollbar and
  // is not the document element.
  if (!isDocumentElement(element) && SCROLLABLE_OVERFLOWS.has(style.overflowX)) {
    height -= Math.max(0, Math.round(height) - element.clientHeight);
  }

  // With padding height we are done.
  if (boxEdge === BOX_EDGE.padding) {
    return height;
  }

  // Let's peel off the paddings.
  height -= parseFloat(style.paddingTop) || 0;
  height -= parseFloat(style.paddingBottom) || 0;

  // Return the content height finally.
  return height;
}
