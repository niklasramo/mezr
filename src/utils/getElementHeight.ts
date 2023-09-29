import { BOX_EDGE } from './constants.js';
import { BoxEdge } from './types.js';
import { getStyle } from './getStyle.js';
import { isDocumentElement } from './isDocumentElement.js';

export function getElementHeight(element: Element, boxEdge: BoxEdge = BOX_EDGE.border) {
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

  if (isDocumentElement(element)) {
    const doc = element.ownerDocument;
    const win = doc.defaultView;
    if (win) {
      height -= win.innerHeight - doc.documentElement.clientHeight;
    }
  } else {
    const sbSize = Math.round(height) - element.clientHeight;
    if (sbSize > 0) {
      height -= sbSize;
    }
  }

  if (boxEdge === BOX_EDGE.padding) {
    return height;
  }

  height -= parseFloat(style.paddingTop) || 0;
  height -= parseFloat(style.paddingBottom) || 0;

  return height;
}
