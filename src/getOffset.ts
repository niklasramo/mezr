import { isRectObject } from './utils/isRectObject.js';
import { isDocument } from './utils/isDocument.js';
import { getOffsetFromDocument } from './utils/getOffsetFromDocument.js';
import { BoxObject, BoxOffset } from './utils/types.js';

export function getOffset(element: BoxObject, offsetRoot?: BoxObject): BoxOffset {
  const offset = isRectObject(element)
    ? { left: element.left, top: element.top }
    : Array.isArray(element)
    ? getOffsetFromDocument(...element)
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
