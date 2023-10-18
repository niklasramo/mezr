import { BOX_EDGE, SCROLLABLE_OVERFLOWS } from './constants.js';
import { BoxElementEdge } from './types.js';
import { getStyle } from './getStyle.js';
import { getPreciseScrollbarSize } from './getPreciseScrollbarSize.js';
import { isDocumentElement } from './isDocumentElement.js';

export function getElementWidth(element: Element, boxEdge: BoxElementEdge = BOX_EDGE.border) {
  // Let's get the bounding client rect and start subtracting the layers one by
  // one. This is the the most precise way to compute subpixel width in all
  // browsers.
  let { width } = element.getBoundingClientRect();

  // With border width we are done right off the bat.
  if (boxEdge === BOX_EDGE.border) {
    return width;
  }

  const style = getStyle(element);

  // With margin width we need to add the margins to the width.
  if (boxEdge === BOX_EDGE.margin) {
    width += Math.max(0, parseFloat(style.marginLeft) || 0);
    width += Math.max(0, parseFloat(style.marginRight) || 0);
    return width;
  }

  // Let's peel off the borders.
  width -= parseFloat(style.borderLeftWidth) || 0;
  width -= parseFloat(style.borderRightWidth) || 0;

  // With scrollbar width we are done.
  if (boxEdge === BOX_EDGE.scrollbar) {
    return width;
  }

  // Subtract the scrollbar width if the element has a vertical scrollbar and is
  // not the document element.
  if (!isDocumentElement(element) && SCROLLABLE_OVERFLOWS.has(style.overflowY)) {
    width -= getPreciseScrollbarSize(element, 'y', Math.round(width) - element.clientWidth);
  }

  // With padding width we are done.
  if (boxEdge === BOX_EDGE.padding) {
    return width;
  }

  // Let's peel off the paddings.
  width -= parseFloat(style.paddingLeft) || 0;
  width -= parseFloat(style.paddingRight) || 0;

  // Return the content width finally.
  return width;
}
