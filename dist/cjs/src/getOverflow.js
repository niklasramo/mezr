"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getOverflow=void 0;const getNormalizedRect_js_1=require("./utils/getNormalizedRect.js");function getOverflow(e,t){const o=(0,getNormalizedRect_js_1.getNormalizedRect)(e),r=(0,getNormalizedRect_js_1.getNormalizedRect)(t);return{left:o.left-r.left,right:r.right-o.right,top:o.top-r.top,bottom:r.bottom-o.bottom}}exports.getOverflow=getOverflow;