const STYLE_DECLARATION_CACHE=new WeakMap;export function getStyle(e){let t=STYLE_DECLARATION_CACHE.get(e)?.deref();return t||(t=window.getComputedStyle(e,null),STYLE_DECLARATION_CACHE.set(e,new WeakRef(t))),t}