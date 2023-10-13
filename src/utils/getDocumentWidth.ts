export function getDocumentWidth(doc: Document) {
  return Math.max(
    doc.documentElement.scrollWidth,
    doc.documentElement.clientWidth,
    document.documentElement.getBoundingClientRect().width,
  );
}
