import { getStyle } from './getStyle.js';
export function isBlockElement(element) {
    switch (getStyle(element).display) {
        case 'none':
            return undefined;
        case 'inline':
        case 'contents':
            return false;
        default:
            return true;
    }
}
