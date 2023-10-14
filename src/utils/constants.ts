export const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const IS_SAFARI = !!(
  IS_BROWSER &&
  navigator.vendor &&
  navigator.vendor.indexOf('Apple') > -1 &&
  navigator.userAgent &&
  navigator.userAgent.indexOf('CriOS') == -1 &&
  navigator.userAgent.indexOf('FxiOS') == -1
);

export const BOX_EDGE = {
  content: 'content',
  padding: 'padding',
  scrollbar: 'scrollbar',
  border: 'border',
  margin: 'margin',
} as const;

export const INCLUDE_WINDOW_SCROLLBAR = {
  [BOX_EDGE.content]: false,
  [BOX_EDGE.padding]: false,
  [BOX_EDGE.scrollbar]: true,
  [BOX_EDGE.border]: true,
  [BOX_EDGE.margin]: true,
};

// Note that we intentionally don't include 'overlay' in this set, because
// it doesn't affect the element's "content"/"padding" width.
export const SCROLLABLE_OVERFLOWS = new Set(['auto', 'scroll']);
