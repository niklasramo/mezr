/**
 * Check if the current value is a document.
 */
export function isDocument(value: any): value is Document {
  return value instanceof Document;
}
