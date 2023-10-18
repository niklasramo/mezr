import { getPreciseScrollbarSize } from './getPreciseScrollbarSize.js';

export function getWindowWidth(win: Window, includeScrollbar = false) {
  if (includeScrollbar) {
    return win.innerWidth;
  }

  const { innerWidth, document } = win;
  const { documentElement } = document;
  const { clientWidth } = documentElement;

  return innerWidth - getPreciseScrollbarSize(documentElement, 'y', innerHeight - clientWidth);
}
