export const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const IS_SAFARI = !!(
  IS_BROWSER &&
  navigator.vendor &&
  navigator.vendor.indexOf('Apple') > -1 &&
  navigator.userAgent &&
  navigator.userAgent.indexOf('CriOS') == -1 &&
  navigator.userAgent.indexOf('FxiOS') == -1
);
