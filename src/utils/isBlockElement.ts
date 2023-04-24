import { getStyle } from '../getStyle.js';

export function isBlockElement(element: HTMLElement) {
  const display = getStyle(element, 'display');

  // If the display is "none" let's return undefined to indicate that we can't
  // determine if it's a block element or an inline element.
  if (display === 'none') {
    return undefined;
  }

  // If the display is "inline" or "contents" it's an inline element.
  if (display === 'inline' || display === 'contents') {
    return false;
  }

  // In all other cases it's a block element.
  return true;
}
