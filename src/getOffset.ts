import { isRectObject } from './utils/isRectObject.js';
import { isDocument } from './utils/isDocument.js';
import { getOffsetFromDocument } from './utils/getOffsetFromDocument.js';
import { BoxElementExtended } from './utils/types.js';

export function getOffset(element: BoxElementExtended, offsetRoot?: BoxElementExtended) {
  const offset = isRectObject(element)
    ? { left: element.left, top: element.top }
    : Array.isArray(element)
    ? getOffsetFromDocument(element[0], element[1])
    : getOffsetFromDocument(element);

  if (offsetRoot && !isDocument(offsetRoot)) {
    const offsetShift = isRectObject(offsetRoot)
      ? offsetRoot
      : Array.isArray(offsetRoot)
      ? getOffsetFromDocument(offsetRoot[0], offsetRoot[1])
      : getOffsetFromDocument(offsetRoot);
    offset.left -= offsetShift.left;
    offset.top -= offsetShift.top;
  }

  return offset;
}
