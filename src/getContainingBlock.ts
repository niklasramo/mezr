import { getStyle } from './utils/getStyle.js';
import { isContainingBlockForFixedElement } from './utils/isContainingBlockForFixedElement.js';
import { isContainingBlockForAbsoluteElement } from './utils/isContainingBlockForAbsoluteElement.js';
import { isBlockElement } from './utils/isBlockElement.js';
import { isDocumentElement } from './utils/isDocumentElement.js';

/**
 * Returns the element's containing block, meaning the ancestor element which
 * the target element's percentage-based width, height, left, right, top,
 * bottom, padding and margin properties are relative to. In case the containing
 * block can not be computed `null` will be returned (e.g. in some cases we
 * can't query all the information needed from elements with display:none).
 *
 * This method is not something you need too often, but when you do you'll be
 * happy that you stumbled upon this library. It's very tricky to compute the
 * containing block correctly while taking browser differences into account.
 * This method does all the heavy lifting for you.
 */
export function getContainingBlock(
  element: HTMLElement,
  options: { position?: string; skipDisplayNone?: boolean } = {},
): HTMLElement | Window | null {
  // Document element's containing block is always the window. It actually can't
  // be set to "display:inline".
  if (isDocumentElement(element)) {
    return element.ownerDocument.defaultView;
  }

  // Parse options.
  const position = options.position || getStyle(element).position;
  const { skipDisplayNone } = options;

  switch (position) {
    case 'static':
    case 'relative':
    case 'sticky':
    case '-webkit-sticky': {
      let containingBlock = element.parentElement;
      while (containingBlock) {
        const isBlock = isBlockElement(containingBlock);
        if (isBlock) return containingBlock;
        if (isBlock === null && !skipDisplayNone) return null;
        containingBlock = containingBlock.parentElement;
      }
      return element.ownerDocument.documentElement;
    }

    case 'absolute':
    case 'fixed': {
      const isFixed = position === 'fixed';
      let containingBlock = element.parentElement;
      while (containingBlock) {
        const isContainingBlock = isFixed
          ? isContainingBlockForFixedElement(containingBlock)
          : isContainingBlockForAbsoluteElement(containingBlock);
        if (isContainingBlock === true) return containingBlock;
        if (isContainingBlock === null && !skipDisplayNone) return null;
        containingBlock = containingBlock.parentElement;
      }
      return element.ownerDocument.defaultView;
    }

    // For any other values we return null.
    default: {
      return null;
    }
  }
}
