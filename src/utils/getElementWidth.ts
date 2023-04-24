import { BOX_AREA } from './constants.js';
import { DomRectElementArea } from './types.js';
import { getStyleAsFloat } from './getStyleAsFloat.js';
import { isDocumentElement } from './isDocumentElement.js';

export function getElementWidth(el: HTMLElement, area: DomRectElementArea = 'border') {
  let { width } = el.getBoundingClientRect();

  if (area === BOX_AREA.border) {
    return width;
  }

  if (area === BOX_AREA.margin) {
    width += Math.max(0, getStyleAsFloat(el, 'margin-left'));
    width += Math.max(0, getStyleAsFloat(el, 'margin-right'));
    return width;
  }

  const borderLeft = getStyleAsFloat(el, 'border-left');
  const borderRight = getStyleAsFloat(el, 'border-right');

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

  width -= getStyleAsFloat(el, 'padding-left');
  width -= getStyleAsFloat(el, 'padding-right');

  return width;
}
