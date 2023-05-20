import { getStyle } from './getStyle.js';
import { isContainingBlockForFixedElement } from './isContainingBlockForFixedElement.js';
export function isContainingBlockForAbsoluteElement(element) {
    if (getStyle(element).position !== 'static') {
        return true;
    }
    return isContainingBlockForFixedElement(element);
}
