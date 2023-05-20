"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocumentHeight = void 0;
function getDocumentHeight(doc, includeScrollbar = false) {
    if (includeScrollbar) {
        const win = doc.defaultView;
        const scrollbarSize = win ? win.innerHeight - doc.documentElement.clientHeight : 0;
        return Math.max(doc.documentElement.scrollHeight + scrollbarSize, doc.body.scrollHeight + scrollbarSize, win ? win.innerHeight : 0);
    }
    else {
        return Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight, doc.documentElement.clientHeight);
    }
}
exports.getDocumentHeight = getDocumentHeight;
