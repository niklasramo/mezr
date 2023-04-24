/**
 * Check if the current value is a window.
 */
export function isWindow(value: any): value is Window {
  return value instanceof Window;
}
