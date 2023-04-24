const STYLE_DECLARATION_CACHE: WeakMap<HTMLElement, WeakRef<CSSStyleDeclaration>> = new WeakMap();

/**
 * Returns the computed value of an element's style property as a string.
 */
export function getStyle(element: HTMLElement, propertyName: string) {
  if (!propertyName) return '';

  let styleDeclaration: CSSStyleDeclaration | undefined =
    STYLE_DECLARATION_CACHE.get(element)?.deref();

  if (!styleDeclaration) {
    styleDeclaration = window.getComputedStyle(element, null);
    STYLE_DECLARATION_CACHE.set(element, new WeakRef(styleDeclaration));
  }

  return styleDeclaration.getPropertyValue(propertyName);
}
