import { getStyle } from './utils/getStyle.js';
import { getContainingBlock } from './getContainingBlock.js';
import { isWindow } from './utils/isWindow.js';

/**
 * Returns the element's position root, which in this specific case means the
 * closest ancestor element/document/window, that the target element's
 * left/right/top/bottom CSS properties are relative to.
 */
export function getPositionRoot(element: HTMLElement, position?: string) {
  const style = getStyle(element);

  // If the element's display is "none" or "contents" the element's "left",
  // "top", "right" and "bottom" properties do not have any effect.
  const { display } = style;
  if (display === 'none' || display === 'contents') {
    return null;
  }

  // Get element's current position value if a position is not provided.
  if (!position) {
    position = style.position;
  }

  switch (position) {
    // Relative element's position root is always the element itself.
    case 'relative': {
      return element;
    }

    // Fixed element's position root is always it's containing block.
    case 'fixed': {
      return getContainingBlock(element, position);
    }

    // Absolute element's position root is always it's containing block, except
    // that it's root containing block is not window (as with fixed), but
    // document instead.
    case 'absolute': {
      const containingBlock = getContainingBlock(element, position);
      return isWindow(containingBlock) ? element.ownerDocument : containingBlock;
    }

    // For any other values we return null.
    default: {
      return null;
    }
  }
}
