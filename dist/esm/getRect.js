import{getWidth}from"./getWidth.js";import{getHeight}from"./getHeight.js";import{getOffset}from"./getOffset.js";import{isRectObject}from"./utils/isRectObject.js";import{cacheBcr,clearBcrCache}from"./utils/bcrUtils.js";export function getRect(t,e){let i=0,c=0;isRectObject(t)?(i=t.width,c=t.height):Array.isArray(t)?(t[0]instanceof Element&&cacheBcr(t[0]),i=getWidth(t[0],t[1]),c=getHeight(t[0],t[1])):(t instanceof Element&&cacheBcr(t),i=getWidth(t),c=getHeight(t));const r=getOffset(t,e);return clearBcrCache(),{width:i,height:c,...r,right:r.left+i,bottom:r.top+c}}