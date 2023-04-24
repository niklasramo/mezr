export function getWindowWidth(win: Window, includeScrollbar = false) {
  return includeScrollbar ? win.innerWidth : win.document.documentElement.clientWidth;
}
