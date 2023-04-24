import { INCLUDE_SCROLLBAR } from './utils/constants.js';
import { isWindow } from './utils/isWindow.js';
import { isDocument } from './utils/isDocument.js';
import { getWindowHeight } from './utils/getWindowHeight.js';
import { getDocumentHeight } from './utils/getDocumentHeight.js';
import { getElementHeight } from './utils/getElementHeight.js';
import { DomRectElement, DomRectElementArea } from './utils/types.js';

export function getHeight(element: DomRectElement, area: DomRectElementArea = 'border') {
  if (isWindow(element)) {
    return getWindowHeight(element, INCLUDE_SCROLLBAR[area]);
  }

  if (isDocument(element)) {
    return getDocumentHeight(element, INCLUDE_SCROLLBAR[area]);
  }

  return getElementHeight(element, area);
}
