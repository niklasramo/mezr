import{BOX_AREA}from"./constants.js";import{getStyle}from"./getStyle.js";import{isDocumentElement}from"./isDocumentElement.js";import{getBcr}from"./bcrUtils.js";export function getElementWidth(t,e="border"){let{width:r}=getBcr(t);if(e===BOX_AREA.border)return r;const i=getStyle(t);if(e===BOX_AREA.margin)return r+=Math.max(0,parseFloat(i.marginLeft)||0),r+=Math.max(0,parseFloat(i.marginRight)||0),r;if(r-=parseFloat(i.borderLeftWidth)||0,r-=parseFloat(i.borderRightWidth)||0,e===BOX_AREA.scroll)return r;if(isDocumentElement(t)){const e=t.ownerDocument,i=e.defaultView;i&&(r-=i.innerWidth-e.documentElement.clientWidth)}else{const e=Math.round(r)-t.clientWidth;e>0&&(r-=e)}return e===BOX_AREA.padding||(r-=parseFloat(i.paddingLeft)||0,r-=parseFloat(i.paddingRight)||0),r}