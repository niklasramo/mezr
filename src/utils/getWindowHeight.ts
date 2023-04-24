export function getWindowHeight(win: Window, includeScrollbar = false) {
  return includeScrollbar ? win.innerHeight : win.document.documentElement.clientHeight;
}
