"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWindowHeight = void 0;
function getWindowHeight(win, includeScrollbar = false) {
    return includeScrollbar ? win.innerHeight : win.document.documentElement.clientHeight;
}
exports.getWindowHeight = getWindowHeight;
