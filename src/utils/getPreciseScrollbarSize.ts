import { IS_CHROMIUM } from './constants.js';
import { getStyle } from './getStyle.js';

const SUBPIXEL_OFFSET = new Map<string, number>();

let testStyleElement: HTMLStyleElement | null = null;
let testParentElement: HTMLDivElement | null = null;
let testChildElement: HTMLDivElement | null = null;

function getSubpixelScrollbarSize(sbSizeString: string, sbSizeFloat: number) {
  const sbSizeSplit = sbSizeString.split('.');
  let offset = SUBPIXEL_OFFSET.get(sbSizeSplit[1]);

  if (offset === undefined) {
    if (!testStyleElement) {
      testStyleElement = document.createElement('style');
    }
    testStyleElement.innerHTML = `
      #mezr-scrollbar-test::-webkit-scrollbar {
        width: ${sbSizeString} !important;
      }
    `;

    if (!testParentElement || !testChildElement) {
      testParentElement = document.createElement('div');
      testChildElement = document.createElement('div');
      testParentElement.appendChild(testChildElement);
      testParentElement.id = 'mezr-scrollbar-test';
      testParentElement.style.cssText = `
        all: unset !important;
        position: fixed !important;
        top: -200px !important;
        left: 0px !important;
        width: 100px !important;
        height: 100px !important;
        overflow: scroll !important;
        pointer-events: none !important;
        visibility: hidden !important;
      `;
      testChildElement.style.cssText = `
        all: unset !important;
        position: absolute !important;
        inset: 0 !important;
      `;
    }

    document.body.appendChild(testStyleElement);
    document.body.appendChild(testParentElement);

    // Compute and store the scrollbar size offset for the current subpixel
    // value.
    const sbRealSize =
      testParentElement.getBoundingClientRect().width -
      testChildElement.getBoundingClientRect().width;
    offset = sbRealSize - sbSizeFloat;
    SUBPIXEL_OFFSET.set(sbSizeSplit[1], offset);

    document.body.removeChild(testParentElement);
    document.body.removeChild(testStyleElement);
  }

  return sbSizeFloat + offset;
}

export function getPreciseScrollbarSize(element: Element, axis: 'x' | 'y', sbIntegerSize: number) {
  // Don't allow negative scrollbar sizes.
  if (sbIntegerSize <= 0) return 0;

  // Chromium supports subpixel scrollbar sizes if you explicitly define it
  // via ::-webkit-scrollbar pseudo-element. But the support is very
  // limited and inconsistent. In some devices the scrollbar size rounded to
  // nearest 0.5px interval, while in others it is rounded to some other
  // intervals.
  if (IS_CHROMIUM) {
    const sbStyle = getStyle(element, '::-webkit-scrollbar');
    const sbComputedSize = axis === 'x' ? sbStyle.height : sbStyle.width;
    const sbComputedFloat = parseFloat(sbComputedSize);
    if (!Number.isNaN(sbComputedFloat) && !Number.isInteger(sbComputedFloat)) {
      return getSubpixelScrollbarSize(sbComputedSize, sbComputedFloat);
    }
  }

  return sbIntegerSize;
}
