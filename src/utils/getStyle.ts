const STYLE_DECLARATION_CACHE: WeakMap<Element, WeakRef<CSSStyleDeclaration>> = new WeakMap();

/**
 * Returns element's CSS Style Declaration. Caches reference to the declaration
 * object weakly for faster access.
 */
export function getStyle(element: Element) {
  let styleDeclaration: CSSStyleDeclaration | undefined =
    STYLE_DECLARATION_CACHE.get(element)?.deref();

  if (!styleDeclaration) {
    // TODO: should we use element.ownderDocument.defaultView instead? Test
    // if this works.
    styleDeclaration = window.getComputedStyle(element, null);
    STYLE_DECLARATION_CACHE.set(element, new WeakRef(styleDeclaration));
  }

  return styleDeclaration;
}
