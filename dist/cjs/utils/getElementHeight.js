"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getElementHeight=void 0;const constants_js_1=require("./constants.js"),getStyle_js_1=require("./getStyle.js"),isDocumentElement_js_1=require("./isDocumentElement.js");function getElementHeight(t,e=constants_js_1.BOX_EDGE.border){let{height:n}=t.getBoundingClientRect();if(e===constants_js_1.BOX_EDGE.border)return n;const s=(0,getStyle_js_1.getStyle)(t);if(e===constants_js_1.BOX_EDGE.margin)return n+=Math.max(0,parseFloat(s.marginTop)||0),n+=Math.max(0,parseFloat(s.marginBottom)||0),n;if(n-=parseFloat(s.borderTopWidth)||0,n-=parseFloat(s.borderBottomWidth)||0,e===constants_js_1.BOX_EDGE.scroll)return n;if((0,isDocumentElement_js_1.isDocumentElement)(t)){const e=t.ownerDocument,s=e.defaultView;s&&(n-=s.innerHeight-e.documentElement.clientHeight)}else{const e=Math.round(n)-t.clientHeight;e>0&&(n-=e)}return e===constants_js_1.BOX_EDGE.padding||(n-=parseFloat(s.paddingTop)||0,n-=parseFloat(s.paddingBottom)||0),n}exports.getElementHeight=getElementHeight;