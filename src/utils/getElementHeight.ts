import { BOX_EDGE, SCROLLABLE_OVERFLOWS } from './constants.js';
import { BoxElementEdge } from './types.js';
import { getStyle } from './getStyle.js';
import { isDocumentElement } from './isDocumentElement.js';

export function getElementHeight(element: Element, boxEdge: BoxElementEdge = BOX_EDGE.border) {
  const style = getStyle(element);

  // In case the element's box sizing is `content-box` and we are getting the
  // content or padding height, we can take a little shortcut.
  if (
    (boxEdge === BOX_EDGE.content || boxEdge === BOX_EDGE.padding) &&
    style.boxSizing === 'content-box'
  ) {
    let height = parseFloat(style.height) || 0;
    if (boxEdge === BOX_EDGE.content) {
      return height;
    }
    height += parseFloat(style.paddingTop) || 0;
    height += parseFloat(style.paddingBottom) || 0;
    return height;
  }

  // Otherise let's get the bounding client rect and start subtracting the
  // layers one by one.
  let { height } = element.getBoundingClientRect();

  // With border height we are done right off the bat.
  if (boxEdge === BOX_EDGE.border) {
    return height;
  }

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

  // Subtract the scrollbar height from the height if the element has a vertical
  // scrollbar and is not the document element.
  if (!isDocumentElement(element) && SCROLLABLE_OVERFLOWS.has(style.overflowY)) {
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
