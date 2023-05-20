export function getWindowWidth(win, includeScrollbar = false) {
    return includeScrollbar ? win.innerWidth : win.document.documentElement.clientWidth;
}
