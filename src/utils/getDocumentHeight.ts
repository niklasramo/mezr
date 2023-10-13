export function getDocumentHeight(doc: Document) {
  return Math.max(
    doc.documentElement.scrollHeight,
    doc.documentElement.clientHeight,
    document.documentElement.getBoundingClientRect().height,
  );
}
