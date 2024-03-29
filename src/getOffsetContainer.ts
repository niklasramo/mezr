import { getStyle } from './utils/getStyle.js';
import { getContainingBlock } from './getContainingBlock.js';
import { isWindow } from './utils/isWindow.js';

/**
 * Returns the element's offset container, meaning the closest
 * element/document/window that the target element's `inset`, `left`, `right`,
 * `top` and `bottom` CSS properties are relative to in terms of position. If
 * the offset container can't be computed or the element is not affected by
 * `left`/`right`/`top`/`bottom` CSS properties (e.g. static elements) `null`
 * will be returned (in some cases we can't query all the information needed
 * from elements with `display:none`). Additionally, due to the dynamic nature
 * of sticky elements they are considered as static elements in this method's
 * scope and will always return `null`.
 */
export function getOffsetContainer(
  element: HTMLElement | SVGSVGElement,
  options: { container?: HTMLElement; position?: string; skipDisplayNone?: boolean } = {},
): HTMLElement | SVGSVGElement | Document | Window | null {
  const style = getStyle(element);

  // If the element's display is "none" or "contents" the element's
  // left/top/right/bottom properties do not have any effect.
  const { display } = style;
  if (display === 'none' || display === 'contents') {
    return null;
  }

  // Parse options.
  const position = options.position || getStyle(element).position;
  const { skipDisplayNone, container } = options;

  switch (position) {
    // Relative element's offset container is always the element itself.
    case 'relative': {
      return element;
    }

    // Fixed element's offset container is always it's containing block.
    case 'fixed': {
      return getContainingBlock(element, { container, position, skipDisplayNone });
    }

    // Absolute element's offset container is always it's containing block,
    // except when the containing block is window in which case we return the
    // element's owner document instead.
    case 'absolute': {
      const containingBlock = getContainingBlock(element, { container, position, skipDisplayNone });
      return isWindow(containingBlock) ? element.ownerDocument : containingBlock;
    }

    // For any other values we return null.
    default: {
      return null;
    }
  }
}
