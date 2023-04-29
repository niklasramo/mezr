import { BOX_AREA } from './constants.js';
import { DomRectElementArea } from './types.js';
import { getStyle } from './getStyle.js';
import { isDocumentElement } from './isDocumentElement.js';
import { getBcr } from './bcr.js';

export function getElementHeight(el: Element, area: DomRectElementArea = 'border') {
  let { height } = getBcr(el);

  if (area === BOX_AREA.border) {
    return height;
  }

  const style = getStyle(el);

  if (area === BOX_AREA.margin) {
    height += Math.max(0, parseFloat(style.marginTop) || 0);
    height += Math.max(0, parseFloat(style.marginBottom) || 0);
    return height;
  }

  const borderTop = parseFloat(style.borderTopWidth) || 0;
  const borderBottom = parseFloat(style.borderBottomWidth) || 0;

  height -= borderTop;
  height -= borderBottom;

  if (area === BOX_AREA.scroll) {
    return height;
  }

  if (isDocumentElement(el)) {
    const doc = el.ownerDocument;
    const win = doc.defaultView;
    if (win) {
      height -= win.innerHeight - doc.documentElement.clientHeight;
    }
  } else {
    height -= Math.max(
      0,
      Math.round(height) - Math.round(el.clientHeight + borderTop + borderBottom)
    );
  }

  if (area === BOX_AREA.padding) {
    return height;
  }

  height -= parseFloat(style.paddingTop) || 0;
  height -= parseFloat(style.paddingBottom) || 0;

  return height;
}
