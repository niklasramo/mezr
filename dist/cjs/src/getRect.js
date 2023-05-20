"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getRect=void 0;const getWidth_js_1=require("./getWidth.js"),getHeight_js_1=require("./getHeight.js"),getOffset_js_1=require("./getOffset.js"),isRectObject_js_1=require("./utils/isRectObject.js"),bcrUtils_js_1=require("utils/bcrUtils.js");function getRect(t,e){let s=0,i=0;(0,isRectObject_js_1.isRectObject)(t)?(s=t.width,i=t.height):Array.isArray(t)?(t[0]instanceof Element&&(0,bcrUtils_js_1.cacheBcr)(t[0]),s=(0,getWidth_js_1.getWidth)(t[0],t[1]),i=(0,getHeight_js_1.getHeight)(t[0],t[1])):(t instanceof Element&&(0,bcrUtils_js_1.cacheBcr)(t),s=(0,getWidth_js_1.getWidth)(t),i=(0,getHeight_js_1.getHeight)(t));const c=(0,getOffset_js_1.getOffset)(t,e);return(0,bcrUtils_js_1.clearBcrCache)(),Object.assign(Object.assign({width:s,height:i},c),{right:c.left+s,bottom:c.top+i})}exports.getRect=getRect;