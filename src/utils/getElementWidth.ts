import { BOX_EDGE, SCROLLABLE_OVERFLOWS } from './constants.js';
import { BoxElementEdge } from './types.js';
import { getStyle } from './getStyle.js';
import { isDocumentElement } from './isDocumentElement.js';

export function getElementWidth(element: Element, boxEdge: BoxElementEdge = BOX_EDGE.border) {
  const style = getStyle(element);

  // In case the element's box sizing is `content-box` and we are getting the
  // content or padding width, we can take a little shortcut.
  if (
    (boxEdge === BOX_EDGE.content || boxEdge === BOX_EDGE.padding) &&
    style.boxSizing === 'content-box'
  ) {
    let width = parseFloat(style.width) || 0;
    if (boxEdge === BOX_EDGE.content) {
      return width;
    }
    width += parseFloat(style.paddingLeft) || 0;
    width += parseFloat(style.paddingRight) || 0;
    return width;
  }

  // Otherise let's get the bounding client rect and start subtracting the
  // layers one by one.
  let { width } = element.getBoundingClientRect();

  // With border width we are done right off the bat.
  if (boxEdge === BOX_EDGE.border) {
    return width;
  }

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

  // Subtract the scrollbar width from the width if the element has a vertical
  // scrollbar and is not the document element.
  if (!isDocumentElement(element) && SCROLLABLE_OVERFLOWS.has(style.overflowY)) {
    width -= Math.max(0, Math.round(width) - element.clientWidth);
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
