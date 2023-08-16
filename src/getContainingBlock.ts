import { getStyle } from './utils/getStyle.js';
import { isContainingBlockForFixedElement } from './utils/isContainingBlockForFixedElement.js';
import { isContainingBlockForAbsoluteElement } from './utils/isContainingBlockForAbsoluteElement.js';
import { isBlockElement } from './utils/isBlockElement.js';
import { isDocumentElement } from './utils/isDocumentElement.js';

/**
 * Returns the element's containing block:
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
 */
export function getContainingBlock(element: HTMLElement, position?: string) {
  // documentElement's containing block is always the window. It acually can't
  // be set to inline-level display mode.
  if (isDocumentElement(element)) {
    return element.ownerDocument.defaultView;
  }

  // Get element's current position value if a position is not provided.
  if (!position) {
    position = getStyle(element).position;
  }

  switch (position) {
    case 'static':
    case 'relative':
    case 'sticky':
    case '-webkit-sticky': {
      let containingBlock = element.parentElement;
      while (containingBlock) {
        const isBlock = isBlockElement(containingBlock);
        if (isBlock === true) return containingBlock;
        if (isBlock === undefined) return null;
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
        if (isContainingBlock === undefined) return null;
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
