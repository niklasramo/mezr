import { BOX_AREA } from './constants.js';
import { DomRectElementArea } from './types.js';
import { getStyleAsFloat } from './getStyleAsFloat.js';
import { isDocumentElement } from './isDocumentElement.js';

export function getElementHeight(el: HTMLElement, area: DomRectElementArea = 'border') {
  let { height } = el.getBoundingClientRect();

  if (area === BOX_AREA.border) {
    return height;
  }

  if (area === BOX_AREA.margin) {
    height += Math.max(0, getStyleAsFloat(el, 'margin-top'));
    height += Math.max(0, getStyleAsFloat(el, 'margin-bottom'));
    return height;
  }

  const borderTop = getStyleAsFloat(el, 'border-top');
  const borderBottom = getStyleAsFloat(el, 'border-bottom');

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

  height -= getStyleAsFloat(el, 'padding-top');
  height -= getStyleAsFloat(el, 'padding-bottom');

  return height;
}
