import { INCLUDE_WINDOW_SCROLLBAR, BOX_EDGE } from './utils/constants.js';
import { isWindow } from './utils/isWindow.js';
import { isDocument } from './utils/isDocument.js';
import { getWindowWidth } from './utils/getWindowWidth.js';
import { getDocumentWidth } from './utils/getDocumentWidth.js';
import { getElementWidth } from './utils/getElementWidth.js';
import { BoxElement, BoxElementEdge } from './utils/types.js';

/**
 * Returns the width of an element in pixels. Accepts also the window object
 * (for getting the viewport width) and the document object (for getting the
 * width of the whole document).
 */
export function getWidth(element: BoxElement, boxEdge: BoxElementEdge = BOX_EDGE.border): number {
  if (isWindow(element)) {
    return getWindowWidth(element, INCLUDE_WINDOW_SCROLLBAR[boxEdge]);
  }

  if (isDocument(element)) {
    return getDocumentWidth(element);
  }

  return getElementWidth(element, boxEdge);
}
