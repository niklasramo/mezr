export function getDocumentWidth({ documentElement }: Document) {
  return Math.max(
    documentElement.scrollWidth,
    documentElement.clientWidth,
    documentElement.getBoundingClientRect().width,
  );
}
