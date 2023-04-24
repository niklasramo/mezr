export function getDocumentHeight(doc: Document, includeScrollbar = false) {
  if (includeScrollbar) {
    const win = doc.defaultView;
    const scrollbarSize = win ? win.innerHeight - doc.documentElement.clientHeight : 0;
    return Math.max(
      doc.documentElement.scrollHeight + scrollbarSize,
      doc.body.scrollHeight + scrollbarSize,
      win ? win.innerHeight : 0
    );
  } else {
    return Math.max(
      doc.documentElement.scrollHeight,
      doc.body.scrollHeight,
      doc.documentElement.clientHeight
    );
  }
}
