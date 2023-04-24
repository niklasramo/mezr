export const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const IS_SAFARI = !!(
  IS_BROWSER &&
  navigator.vendor &&
  navigator.vendor.indexOf('Apple') > -1 &&
  navigator.userAgent &&
  navigator.userAgent.indexOf('CriOS') == -1 &&
  navigator.userAgent.indexOf('FxiOS') == -1
);

export const BOX_AREA = {
  content: 'content',
  padding: 'padding',
  scroll: 'scroll',
  border: 'border',
  margin: 'margin',
} as const;

export const INCLUDE_SCROLLBAR = {
  [BOX_AREA.content]: false,
  [BOX_AREA.padding]: false,
  [BOX_AREA.scroll]: true,
  [BOX_AREA.border]: true,
  [BOX_AREA.margin]: true,
};
