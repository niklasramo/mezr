"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getPositionRoot=void 0;const getStyle_js_1=require("./getStyle.js"),getContainingBlock_js_1=require("./getContainingBlock.js"),isWindow_js_1=require("./utils/isWindow.js");function getPositionRoot(t,e){const o=(0,getStyle_js_1.getStyle)(t,"display");if("none"===o||"contents"===o)return null;switch(e||(e=(0,getStyle_js_1.getStyle)(t,"position")),e){case"relative":return t;case"fixed":return(0,getContainingBlock_js_1.getContainingBlock)(t,e);case"absolute":{const o=(0,getContainingBlock_js_1.getContainingBlock)(t,e);return(0,isWindow_js_1.isWindow)(o)?t.ownerDocument:o}default:return null}}exports.getPositionRoot=getPositionRoot;