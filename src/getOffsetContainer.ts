import { getStyle } from './utils/getStyle.js';
import { getContainingBlock } from './getContainingBlock.js';
import { isWindow } from './utils/isWindow.js';

/**
 * Returns the element's offset container, meaning the closest
 * element/document/window, that the target element's left/right/top/bottom CSS
 * properties are rooted to.
 */
export function getOffsetContainer(
  element: HTMLElement,
  options: { position?: string; skipDisplayNone?: boolean } = {},
): HTMLElement | Document | Window | null {
  const style = getStyle(element);

  // If the element's display is "none" or "contents" the element's
  // left/top/right/bottom properties do not have any effect.
  const { display } = style;
  if (display === 'none' || display === 'contents') {
    return null;
  }

  // Parse options.
  const position = options.position || getStyle(element).position;
  const { skipDisplayNone } = options;

  switch (position) {
    // Relative element's offset container is always the element itself.
    case 'relative': {
      return element;
    }

    // Fixed element's offset container is always it's containing block.
    case 'fixed': {
      return getContainingBlock(element, { position, skipDisplayNone });
    }

    // Absolute element's offset container is always it's containing block,
    // except when the containing block is window in which case we return the
    // element's owner document instead.
    case 'absolute': {
      const containingBlock = getContainingBlock(element, { position, skipDisplayNone });
      return isWindow(containingBlock) ? element.ownerDocument : containingBlock;
    }

    // For any other values we return null.
    default: {
      return null;
    }
  }
}
