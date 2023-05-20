export function getWindowHeight(win, includeScrollbar = false) {
    return includeScrollbar ? win.innerHeight : win.document.documentElement.clientHeight;
}
