import{getNormalizedRect}from"./utils/getNormalizedRect.js";export function getIntersection(t,e){const o=getNormalizedRect(t),i=getNormalizedRect(e),r=Math.max(o.left,i.left),m=Math.min(o.right,i.right);if(m<=r)return null;const l=Math.max(o.top,i.top),n=Math.min(o.bottom,i.bottom);return n<=l?null:{width:m-r,height:n-l,left:r,top:l,right:m,bottom:n}}