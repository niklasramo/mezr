import{IS_CHROMIUM}from"./constants.js";import{getStyle}from"./getStyle.js";export function getPreciseScrollbarSize(t,e,r){if(r<=0)return 0;if(IS_CHROMIUM){const r=getStyle(t,"::-webkit-scrollbar"),i=parseFloat(("x"===e?r.height:r.width)||"");if(!Number.isNaN(i)&&!Number.isInteger(i)){const t=Math.round(i);return t<i?t:t-.5}}return r}