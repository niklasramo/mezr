let cachedElem: Element | null = null;
let cachedRect: DOMRect | null = null;

export function getBcr(element: Element) {
  return element === cachedElem ? cachedRect! : element.getBoundingClientRect();
}

export function cacheBcr(element: Element) {
  cachedElem = element;
  cachedRect = element.getBoundingClientRect();
}

export function clearBcrCache() {
  cachedElem = null;
  cachedRect = null;
}
