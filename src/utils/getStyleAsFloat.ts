import { getStyle } from '../getStyle.js';

/**
 * Returns the computed value of an element's style property transformed into
 * a float value.
 */
export function getStyleAsFloat(element: HTMLElement, propertyName: string) {
  return parseFloat(getStyle(element, propertyName)) || 0;
}
