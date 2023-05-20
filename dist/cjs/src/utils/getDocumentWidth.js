"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentWidth = void 0;
function getDocumentWidth(doc, includeScrollbar = false) {
    if (includeScrollbar) {
        const win = doc.defaultView;
        const scrollbarSize = win ? win.innerWidth - doc.documentElement.clientWidth : 0;
        return Math.max(doc.documentElement.scrollWidth + scrollbarSize, doc.body.scrollWidth + scrollbarSize, win ? win.innerWidth : 0);
    }
    else {
        return Math.max(doc.documentElement.scrollWidth, doc.body.scrollWidth, doc.documentElement.clientWidth);
    }
}
exports.getDocumentWidth = getDocumentWidth;
