import{doRectsOverlap}from"./doRectsOverlap.js";import{getDistanceBetweenPoints}from"./getDistanceBetweenPoints.js";export function getDistanceBetweenRects(t,e){if(doRectsOverlap(t,e))return null;const o=t.left+t.width,n=t.top+t.height,i=e.left+e.width,s=e.top+e.height;return o<=e.left?n<=e.top?getDistanceBetweenPoints(o,n,e.left,e.top):t.top>=s?getDistanceBetweenPoints(o,t.top,e.left,s):e.left-o:t.left>=i?n<=e.top?getDistanceBetweenPoints(t.left,n,i,e.top):t.top>=s?getDistanceBetweenPoints(t.left,t.top,i,s):t.left-i:n<=e.top?e.top-n:t.top-s}