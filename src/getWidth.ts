import { INCLUDE_SCROLLBAR, BOX_EDGE } from './utils/constants.js';
import { isWindow } from './utils/isWindow.js';
import { isDocument } from './utils/isDocument.js';
import { getWindowWidth } from './utils/getWindowWidth.js';
import { getDocumentWidth } from './utils/getDocumentWidth.js';
import { getElementWidth } from './utils/getElementWidth.js';
import { BoxElement, BoxEdge } from './utils/types.js';

export function getWidth(element: BoxElement, boxEdge: BoxEdge = BOX_EDGE.border) {
  if (isWindow(element)) {
    return getWindowWidth(element, INCLUDE_SCROLLBAR[boxEdge]);
  }

  if (isDocument(element)) {
    return getDocumentWidth(element, INCLUDE_SCROLLBAR[boxEdge]);
  }

  return getElementWidth(element, boxEdge);
}
