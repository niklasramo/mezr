import { IS_SAFARI } from './constants.js';
import { getStyle } from './getStyle.js';
import { isBlockElement } from './isBlockElement.js';
export function isContainingBlockForFixedElement(element) {
    const isBlock = isBlockElement(element);
    if (!isBlock)
        return isBlock;
    const style = getStyle(element);
    const { transform } = style;
    if (transform && transform !== 'none') {
        return true;
    }
    const { perspective } = style;
    if (perspective && perspective !== 'none') {
        return true;
    }
    const { backdropFilter } = style;
    if (backdropFilter && backdropFilter !== 'none') {
        return true;
    }
    const { contentVisibility } = style;
    if (contentVisibility && contentVisibility === 'auto') {
        return true;
    }
    const { contain } = style;
    if (contain &&
        (contain === 'strict' ||
            contain === 'content' ||
            contain.indexOf('paint') > -1 ||
            contain.indexOf('layout') > -1)) {
        return true;
    }
    if (!IS_SAFARI) {
        const { filter } = style;
        if (filter && filter !== 'none') {
            return true;
        }
        const { willChange } = style;
        if (willChange &&
            (willChange.indexOf('transform') > -1 ||
                willChange.indexOf('perspective') > -1 ||
                willChange.indexOf('filter') > -1)) {
            return true;
        }
    }
    return false;
}
