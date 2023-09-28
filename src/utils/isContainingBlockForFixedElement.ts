import { IS_SAFARI } from './constants.js';
import { getStyle } from './getStyle.js';
import { isBlockElement } from './isBlockElement.js';

export function isContainingBlockForFixedElement(element: HTMLElement) {
  const style = getStyle(element);

  // If the element has any kind of filter applied or prepared via will-change
  // it is a containing block, even if it's not a block element. Note that this
  // does not apply to Safari, which interestingly does not create a containing
  // block for elements with filters applied, even if they are block-level.
  if (!IS_SAFARI) {
    const { filter } = style;
    if (filter && filter !== 'none') {
      return true;
    }

    const { backdropFilter } = style;
    if (backdropFilter && backdropFilter !== 'none') {
      return true;
    }

    const { willChange } = style;
    if (
      willChange &&
      (willChange.indexOf('filter') > -1 || willChange.indexOf('backdrop-filter') > -1)
    ) {
      return true;
    }
  }

  // The rest of the checks require the element to be a block element.
  const isBlock = isBlockElement(element);
  if (!isBlock) return isBlock;

  // If the element is transformed it is a containing block.
  const { transform } = style;
  if (transform && transform !== 'none') {
    return true;
  }

  // If the element has perspective it is a containing block.
  const { perspective } = style;
  if (perspective && perspective !== 'none') {
    return true;
  }

  // If the element's content-visibility is "auto" or "hidden" it is a
  // containing block.
  // Note: this feature does not exist on Safari yet, so this check might
  // break when they start supporting it (depending on how they implement it).
  // @ts-ignore
  const { contentVisibility } = style;
  if (contentVisibility && contentVisibility === 'auto') {
    return true;
  }

  // If the element's contain style includes "paint" or "layout" it is a
  // containing block. Note that the values "strict" and "content" are
  // shorthands which include either "paint" or "layout".
  const { contain } = style;
  if (
    contain &&
    (contain === 'strict' ||
      contain === 'content' ||
      contain.indexOf('paint') > -1 ||
      contain.indexOf('layout') > -1)
  ) {
    return true;
  }

  // Some will-change values cause the element to become a containing block
  // for block-level elements.
  const { willChange } = style;
  if (
    willChange &&
    (willChange.indexOf('transform') > -1 ||
      willChange.indexOf('perspective') > -1 ||
      willChange.indexOf('contain') > -1)
  ) {
    return true;
  }

  // For Safari we need to do this extra check here which we already did for
  // other browsers above. Safari creates a containing block when will-change
  // includes "filter" for block-level elements, but not for inline-level.
  if (IS_SAFARI && willChange && willChange.indexOf('filter') > -1) {
    return true;
  }

  return false;
}
