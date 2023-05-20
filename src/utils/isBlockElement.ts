import { getStyle } from './getStyle.js';

export function isBlockElement(element: HTMLElement) {
  switch (getStyle(element).display) {
    // If the display is "none" let's return undefined to indicate that we can't
    // determine if it's a block element.
    case 'none':
      return undefined;
    // If the display is "inline" or "contents" it's not a block element.
    case 'inline':
    case 'contents':
      return false;
    // In all other cases it's a block element.
    default:
      return true;
  }
}
