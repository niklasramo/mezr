"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getWidth=void 0;const constants_js_1=require("./utils/constants.js"),isWindow_js_1=require("./utils/isWindow.js"),isDocument_js_1=require("./utils/isDocument.js"),getWindowWidth_js_1=require("./utils/getWindowWidth.js"),getDocumentWidth_js_1=require("./utils/getDocumentWidth.js"),getElementWidth_js_1=require("./utils/getElementWidth.js");function getWidth(t,e=constants_js_1.BOX_EDGE.border){return(0,isWindow_js_1.isWindow)(t)?(0,getWindowWidth_js_1.getWindowWidth)(t,constants_js_1.INCLUDE_SCROLLBAR[e]):(0,isDocument_js_1.isDocument)(t)?(0,getDocumentWidth_js_1.getDocumentWidth)(t,constants_js_1.INCLUDE_SCROLLBAR[e]):(0,getElementWidth_js_1.getElementWidth)(t,e)}exports.getWidth=getWidth;