import{getStyle}from"./utils/getStyle.js";import{getContainingBlock}from"./getContainingBlock.js";import{isWindow}from"./utils/isWindow.js";export function getOffsetContainer(n,t={}){const i=getStyle(n),{display:o}=i;if("none"===o||"contents"===o)return null;const e=t.position||getStyle(n).position,{skipDisplayNone:s,container:r}=t;switch(e){case"relative":return n;case"fixed":return getContainingBlock(n,{container:r,position:e,skipDisplayNone:s});case"absolute":{const t=getContainingBlock(n,{container:r,position:e,skipDisplayNone:s});return isWindow(t)?n.ownerDocument:t}default:return null}}