import { IS_CHROMIUM } from './constants.js';
import { getStyle } from './getStyle.js';

export function getPreciseScrollbarSize(element: Element, axis: 'x' | 'y', sbIntegerSize: number) {
  // Don't allow negative scrollbar sizes.
  if (sbIntegerSize <= 0) return 0;

  // Chromium supports subpixel scrollbar sizes if you explicitly define it
  // via ::-webkit-scrollbar pseudo-element. But the support is very
  // limited, basically it only supports 0.5px intervals, so we'll round
  // the value to the nearest 0.5px interval to match Chromium's behavior.
  if (IS_CHROMIUM) {
    const sbStyle = getStyle(element, '::-webkit-scrollbar');
    const sbCustomSize = parseFloat((axis === 'x' ? sbStyle.height : sbStyle.width) || '');
    if (!Number.isNaN(sbCustomSize) && !Number.isInteger(sbCustomSize)) {
      const sbRoundedSize = Math.round(sbCustomSize);
      return sbRoundedSize < sbCustomSize ? sbRoundedSize : sbRoundedSize - 0.5;
    }
  }

  return sbIntegerSize;
}
