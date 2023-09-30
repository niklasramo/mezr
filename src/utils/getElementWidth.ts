import { BOX_EDGE } from './constants.js';
import { BoxElementEdge } from './types.js';
import { getStyle } from './getStyle.js';
import { isDocumentElement } from './isDocumentElement.js';

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

  if (isDocumentElement(element)) {
    const doc = element.ownerDocument;
    const win = doc.defaultView;
    if (win) {
      width -= win.innerWidth - doc.documentElement.clientWidth;
    }
  } else {
    const sbSize = Math.round(width) - element.clientWidth;
    if (sbSize > 0) {
      width -= sbSize;
    }
  }

  if (boxEdge === BOX_EDGE.padding) {
    return width;
  }

  width -= parseFloat(style.paddingLeft) || 0;
  width -= parseFloat(style.paddingRight) || 0;

  return width;
}
