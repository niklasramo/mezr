"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getDistance=void 0;const getDistanceBetweenRects_js_1=require("./utils/getDistanceBetweenRects.js"),getNormalizedRect_js_1=require("./utils/getNormalizedRect.js");function getDistance(e,t){const s=(0,getNormalizedRect_js_1.getNormalizedRect)(e),c=(0,getNormalizedRect_js_1.getNormalizedRect)(t);return(0,getDistanceBetweenRects_js_1.getDistanceBetweenRects)(s,c)}exports.getDistance=getDistance;