"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getElementWidth=void 0;const constants_js_1=require("./constants.js"),getStyle_js_1=require("./getStyle.js"),isDocumentElement_js_1=require("./isDocumentElement.js");function getScrollbarWidth(t,e,s){return(0,isDocumentElement_js_1.isDocumentElement)(t)?0:constants_js_1.SCROLLABLE_OVERFLOWS.has(e.overflowY)?Math.max(0,Math.round(s)-t.clientWidth):0}function getElementWidth(t,e=constants_js_1.BOX_EDGE.border){let{width:s}=t.getBoundingClientRect();if(e===constants_js_1.BOX_EDGE.border)return s;const n=(0,getStyle_js_1.getStyle)(t);return e===constants_js_1.BOX_EDGE.margin?(s+=Math.max(0,parseFloat(n.marginLeft)||0),s+=Math.max(0,parseFloat(n.marginRight)||0),s):(s-=parseFloat(n.borderLeftWidth)||0,s-=parseFloat(n.borderRightWidth)||0,e===constants_js_1.BOX_EDGE.scrollbar?s:(s-=getScrollbarWidth(t,n,s),e===constants_js_1.BOX_EDGE.padding||(s-=parseFloat(n.paddingLeft)||0,s-=parseFloat(n.paddingRight)||0),s))}exports.getElementWidth=getElementWidth;