import { BOX_AREA } from './constants.js';
import { DomRectElementArea } from './types.js';
import { getStyle } from './getStyle.js';
import { isDocumentElement } from './isDocumentElement.js';
import { getBcr } from './bcrUtils.js';

export function getElementHeight(element: Element, area: DomRectElementArea = 'border') {
  let { height } = getBcr(element);

  if (area === BOX_AREA.border) {
    return height;
  }

  const style = getStyle(element);

  if (area === BOX_AREA.margin) {
    height += Math.max(0, parseFloat(style.marginTop) || 0);
    height += Math.max(0, parseFloat(style.marginBottom) || 0);
    return height;
  }

  height -= parseFloat(style.borderTopWidth) || 0;
  height -= parseFloat(style.borderBottomWidth) || 0;

  if (area === BOX_AREA.scroll) {
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

  if (area === BOX_AREA.padding) {
    return height;
  }

  height -= parseFloat(style.paddingTop) || 0;
  height -= parseFloat(style.paddingBottom) || 0;

  return height;
}
