export function getDocumentHeight({ documentElement }: Document) {
  return Math.max(
    documentElement.scrollHeight,
    documentElement.clientHeight,
    documentElement.getBoundingClientRect().height,
  );
}
