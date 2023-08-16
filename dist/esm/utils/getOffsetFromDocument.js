import{getStyle}from"./getStyle.js";import{getBcr}from"./bcrUtils.js";import{isDocument}from"./isDocument.js";import{isWindow}from"./isWindow.js";export function getOffsetFromDocument(t,o="border"){const e={left:0,top:0};if(isDocument(t))return e;if(isWindow(t))return e.left+=t.scrollX||0,e.top+=t.scrollY||0,e;const r=t.ownerDocument.defaultView;r&&(e.left+=r.scrollX||0,e.top+=r.scrollY||0);const l=getBcr(t);if(e.left+=l.left,e.top+=l.top,"border"===o)return e;const i=getStyle(t);return"margin"===o?(e.left-=Math.max(0,parseFloat(i.marginLeft)||0),e.top-=Math.max(0,parseFloat(i.marginTop)||0),e):(e.left+=parseFloat(i.borderLeftWidth)||0,e.top+=parseFloat(i.borderTopWidth)||0,"scroll"===o||"padding"===o||(e.left+=parseFloat(i.paddingLeft)||0,e.top+=parseFloat(i.paddingTop)||0),e)}