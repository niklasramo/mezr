import { getStyle } from './getStyle.js';

export function isBlockElement(element: HTMLElement) {
  switch (getStyle(element).display) {
    case 'none':
      return null;
    case 'inline':
    case 'contents':
      return false;
    default:
      return true;
  }
}
