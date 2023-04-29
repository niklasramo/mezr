import { BOX_AREA } from './constants.js';
import { DomRectElementArea } from './types.js';
import { getStyle } from './getStyle.js';
import { isDocumentElement } from './isDocumentElement.js';
import { getBcr } from './bcr.js';

export function getElementWidth(el: Element, area: DomRectElementArea = 'border') {
  let { width } = getBcr(el);

  if (area === BOX_AREA.border) {
    return width;
  }

  const style = getStyle(el);

  if (area === BOX_AREA.margin) {
    width += Math.max(0, parseFloat(style.marginLeft) || 0);
    width += Math.max(0, parseFloat(style.marginRight) || 0);
    return width;
  }

  const borderLeft = parseFloat(style.borderLeftWidth) || 0;
  const borderRight = parseFloat(style.borderRightWidth) || 0;

  width -= borderLeft;
  width -= borderRight;

  if (area === BOX_AREA.scroll) {
    return width;
  }

  if (isDocumentElement(el)) {
    const doc = el.ownerDocument;
    const win = doc.defaultView;
    if (win) {
      width -= win.innerWidth - doc.documentElement.clientWidth;
    }
  } else {
    width -= Math.max(0, Math.round(width) - Math.round(el.clientWidth + borderLeft + borderRight));
  }

  if (area === BOX_AREA.padding) {
    return width;
  }

  width -= parseFloat(style.paddingLeft) || 0;
  width -= parseFloat(style.paddingRight) || 0;

  return width;
}
