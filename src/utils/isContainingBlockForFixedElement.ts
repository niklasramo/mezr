import { IS_SAFARI } from './constants.js';
import { getStyle } from '../getStyle.js';
import { isBlockElement } from './isBlockElement.js';

export function isContainingBlockForFixedElement(element: HTMLElement) {
  // The element needs to be a block element to be a containing block.
  const isBlock = isBlockElement(element);
  if (!isBlock) return isBlock;

  // If the element is transformed it is a containing block.
  const transform = getStyle(element, 'transform');
  if (transform && transform !== 'none') {
    return true;
  }

  // If the element has perspective it is a containing block.
  const perspective = getStyle(element, 'perspective');
  if (perspective && perspective !== 'none') {
    return true;
  }

  // If the element has backdrop-filter it is a containing block.
  const backdropFilter = getStyle(element, 'backdrop-filter');
  if (backdropFilter && backdropFilter !== 'none') {
    return true;
  }

  // If the element's content-visibility is "auto" or "hidden" it is a
  // containing block.
  // Note: this feature does not exist on Safari yet, so this check might
  // break when they start supporting it (depending on how they implement it).
  const contentVisibility = getStyle(element, 'content-visibility');
  if (contentVisibility && contentVisibility === 'auto') {
    return true;
  }

  // If the element's contain style includes "paint" or "layout" it is a
  // containing block. Note that the values "strict" and "content" are
  // shorthands which include either "paint" or "layout".
  // Note: this feature does not exist on Safari yet, so this check might
  // break when they start supporting it (depending on how they implement it).
  const contain = getStyle(element, 'contain');
  if (
    contain &&
    (contain === 'strict' ||
      contain === 'content' ||
      contain.indexOf('paint') > -1 ||
      contain.indexOf('layout') > -1)
  ) {
    return true;
  }

  // The following checks are not needed for Safari.
  // Note: it would be better to do actual feature tests instead of browser
  // sniffing, but that's quite a lot of extra code which I'd prefer not to
  // include at the moment, so let's do it quick and dirty.
  if (!IS_SAFARI) {
    // If the element has a CSS filter applied it is a containing block.
    const filter = getStyle(element, 'filter');
    if (filter && filter !== 'none') {
      return true;
    }

    // If the element's will-change style has "transform" or "perspective" it is
    // a containing block.
    const willChange = getStyle(element, 'will-change');
    if (
      willChange &&
      (willChange.indexOf('transform') > -1 ||
        willChange.indexOf('perspective') > -1 ||
        willChange.indexOf('filter') > -1)
    ) {
      return true;
    }
  }

  return false;
}
