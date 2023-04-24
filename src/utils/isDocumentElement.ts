/**
 * Check if the current value is a document element.
 */
export function isDocumentElement(value: any): value is HTMLHtmlElement {
  return value instanceof HTMLHtmlElement;
}
