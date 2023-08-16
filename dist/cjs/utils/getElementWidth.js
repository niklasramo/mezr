"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getElementWidth=void 0;const constants_js_1=require("./constants.js"),getStyle_js_1=require("./getStyle.js"),isDocumentElement_js_1=require("./isDocumentElement.js"),bcrUtils_js_1=require("./bcrUtils.js");function getElementWidth(t,e="border"){let{width:s}=(0,bcrUtils_js_1.getBcr)(t);if(e===constants_js_1.BOX_AREA.border)return s;const n=(0,getStyle_js_1.getStyle)(t);if(e===constants_js_1.BOX_AREA.margin)return s+=Math.max(0,parseFloat(n.marginLeft)||0),s+=Math.max(0,parseFloat(n.marginRight)||0),s;if(s-=parseFloat(n.borderLeftWidth)||0,s-=parseFloat(n.borderRightWidth)||0,e===constants_js_1.BOX_AREA.scroll)return s;if((0,isDocumentElement_js_1.isDocumentElement)(t)){const e=t.ownerDocument,n=e.defaultView;n&&(s-=n.innerWidth-e.documentElement.clientWidth)}else{const e=Math.round(s)-t.clientWidth;e>0&&(s-=e)}return e===constants_js_1.BOX_AREA.padding||(s-=parseFloat(n.paddingLeft)||0,s-=parseFloat(n.paddingRight)||0),s}exports.getElementWidth=getElementWidth;