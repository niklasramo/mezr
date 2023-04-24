import { INCLUDE_SCROLLBAR } from './utils/constants.js';
import { isWindow } from './utils/isWindow.js';
import { isDocument } from './utils/isDocument.js';
import { getWindowWidth } from './utils/getWindowWidth.js';
import { getDocumentWidth } from './utils/getDocumentWidth.js';
import { getElementWidth } from './utils/getElementWidth.js';
import { DomRectElement, DomRectElementArea } from './utils/types.js';

export function getWidth(element: DomRectElement, area: DomRectElementArea = 'border') {
  if (isWindow(element)) {
    return getWindowWidth(element, INCLUDE_SCROLLBAR[area]);
  }

  if (isDocument(element)) {
    return getDocumentWidth(element, INCLUDE_SCROLLBAR[area]);
  }

  return getElementWidth(element, area);
}
