"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWindowWidth = void 0;
function getWindowWidth(win, includeScrollbar = false) {
    return includeScrollbar ? win.innerWidth : win.document.documentElement.clientWidth;
}
exports.getWindowWidth = getWindowWidth;
