import { getStyle } from './utils/getStyle.js';
import { isContainingBlockForFixedElement } from './utils/isContainingBlockForFixedElement.js';
import { isContainingBlockForAbsoluteElement } from './utils/isContainingBlockForAbsoluteElement.js';
import { isBlockElement } from './utils/isBlockElement.js';
import { isDocumentElement } from './utils/isDocumentElement.js';

/**
 * Returns the element's containing block, meaning the ancestor element which
 * the target element's percentage-based
 * width/height/left/right/top/bottom/padding/margin properties are relative to
 * (i.e the final pixel amount of the those percentage-based properties is
 * computed based on the containing block's widht/height).
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
 */
export function getContainingBlock(
  element: HTMLElement,
  options: { position?: string; skipDisplayNone?: boolean } = {},
) {
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
