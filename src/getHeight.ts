import { INCLUDE_SCROLLBAR, BOX_EDGE } from './utils/constants.js';
import { isWindow } from './utils/isWindow.js';
import { isDocument } from './utils/isDocument.js';
import { getWindowHeight } from './utils/getWindowHeight.js';
import { getDocumentHeight } from './utils/getDocumentHeight.js';
import { getElementHeight } from './utils/getElementHeight.js';
import { BoxElement, BoxElementEdge } from './utils/types.js';

export function getHeight(element: BoxElement, boxEdge: BoxElementEdge = BOX_EDGE.border): number {
  if (isWindow(element)) {
    return getWindowHeight(element, INCLUDE_SCROLLBAR[boxEdge]);
  }

  if (isDocument(element)) {
    return getDocumentHeight(element, INCLUDE_SCROLLBAR[boxEdge]);
  }

  return getElementHeight(element, boxEdge);
}
