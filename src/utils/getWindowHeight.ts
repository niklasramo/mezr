import { getPreciseScrollbarSize } from './getPreciseScrollbarSize.js';

export function getWindowHeight(win: Window, includeScrollbar = false) {
  if (includeScrollbar) {
    return win.innerHeight;
  }

  const { innerHeight, document } = win;
  const { documentElement } = document;
  const { clientHeight } = documentElement;

  return innerHeight - getPreciseScrollbarSize(documentElement, 'x', innerHeight - clientHeight);
}
