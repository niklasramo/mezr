"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getStyle=void 0;const STYLE_DECLARATION_CACHE=new WeakMap;function getStyle(e){let t=STYLE_DECLARATION_CACHE.get(e)?.deref();return t||(t=window.getComputedStyle(e,null),STYLE_DECLARATION_CACHE.set(e,new WeakRef(t))),t}exports.getStyle=getStyle;