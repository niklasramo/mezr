let cachedElem = null;
let cachedRect = null;
export function getBcr(element) {
    return element === cachedElem ? cachedRect : element.getBoundingClientRect();
}
export function cacheBcr(element) {
    cachedElem = element;
    cachedRect = element.getBoundingClientRect();
}
export function clearBcrCache() {
    cachedElem = cachedRect = null;
}
