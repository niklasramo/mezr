import{getWidth}from"./getWidth.js";import{getHeight}from"./getHeight.js";import{getOffset}from"./getOffset.js";import{isRectObject}from"./utils/isRectObject.js";export function getRect(t,e){let i=0,g=0;isRectObject(t)?(i=t.width,g=t.height):Array.isArray(t)?(i=getWidth(t[0],t[1]),g=getHeight(t[0],t[1])):(i=getWidth(t),g=getHeight(t));const r=getOffset(t,e);return{width:i,height:g,...r,right:r.left+i,bottom:r.top+g}}