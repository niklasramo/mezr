import { BOX_AREA } from './constants.js';
import { DomRectElementArea } from './types.js';
import { getStyle } from './getStyle.js';
import { isDocumentElement } from './isDocumentElement.js';
import { getBcr } from './bcrUtils.js';

export function getElementWidth(element: Element, area: DomRectElementArea = 'border') {
  let { width } = getBcr(element);

  if (area === BOX_AREA.border) {
    return width;
  }

  const style = getStyle(element);

  if (area === BOX_AREA.margin) {
    width += Math.max(0, parseFloat(style.marginLeft) || 0);
    width += Math.max(0, parseFloat(style.marginRight) || 0);
    return width;
  }

  width -= parseFloat(style.borderLeftWidth) || 0;
  width -= parseFloat(style.borderRightWidth) || 0;

  if (area === BOX_AREA.scroll) {
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

  if (area === BOX_AREA.padding) {
    return width;
  }

  width -= parseFloat(style.paddingLeft) || 0;
  width -= parseFloat(style.paddingRight) || 0;

  return width;
}
