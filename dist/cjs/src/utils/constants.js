"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INCLUDE_SCROLLBAR = exports.BOX_AREA = exports.IS_SAFARI = exports.IS_BROWSER = void 0;
exports.IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';
exports.IS_SAFARI = !!(exports.IS_BROWSER &&
    navigator.vendor &&
    navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS') == -1);
exports.BOX_AREA = {
    content: 'content',
    padding: 'padding',
    scroll: 'scroll',
    border: 'border',
    margin: 'margin',
};
exports.INCLUDE_SCROLLBAR = {
    [exports.BOX_AREA.content]: false,
    [exports.BOX_AREA.padding]: false,
    [exports.BOX_AREA.scroll]: true,
    [exports.BOX_AREA.border]: true,
    [exports.BOX_AREA.margin]: true,
};
