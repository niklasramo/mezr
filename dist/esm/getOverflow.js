import{getNormalizedRect}from"./utils/getNormalizedRect.js";export function getOverflow(t,e){const o=getNormalizedRect(t),r=getNormalizedRect(e);return{left:o.left-r.left,right:r.right-o.right,top:o.top-r.top,bottom:r.bottom-o.bottom}}