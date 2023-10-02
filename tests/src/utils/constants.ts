export const IS_BROWSER = typeof window !== 'undefined' && typeof window.document !== 'undefined';

export const IS_SAFARI = !!(
  IS_BROWSER &&
  navigator.vendor &&
  navigator.vendor.indexOf('Apple') > -1 &&
  navigator.userAgent &&
  navigator.userAgent.indexOf('CriOS') == -1 &&
  navigator.userAgent.indexOf('FxiOS') == -1
);

export const CONTAINING_BLOCK_SPECIAL_CASES = [
  {
    property: 'transform',
    value: 'translateX(10px)',
    containsInline: false,
    containsBlock: true,
  },
  {
    property: 'perspective',
    value: '500px',
    containsInline: false,
    containsBlock: true,
  },
  {
    property: 'contentVisibility',
    value: 'auto',
    containsInline: false,
    containsBlock: !IS_SAFARI,
  },
  {
    property: 'contain',
    value: 'paint',
    containsInline: false,
    containsBlock: true,
  },
  {
    property: 'contain',
    value: 'layout',
    containsInline: false,
    containsBlock: true,
  },
  {
    property: 'contain',
    value: 'strict',
    containsInline: false,
    containsBlock: true,
  },
  {
    property: 'contain',
    value: 'content',
    containsInline: false,
    containsBlock: true,
  },
  {
    property: 'willChange',
    value: 'transform',
    containsInline: false,
    containsBlock: true,
  },
  {
    property: 'willChange',
    value: 'perspective',
    containsInline: false,
    containsBlock: true,
  },
  {
    property: 'willChange',
    value: 'contain',
    containsInline: false,
    containsBlock: true,
  },
  {
    property: 'filter',
    value: 'blur(5px)',
    containsInline: !IS_SAFARI,
    containsBlock: !IS_SAFARI,
  },
  {
    property: 'backdropFilter',
    value: 'blur(5px)',
    containsInline: !IS_SAFARI,
    containsBlock: !IS_SAFARI,
  },
  {
    property: 'willChange',
    value: 'filter',
    containsInline: !IS_SAFARI,
    containsBlock: true,
  },
  {
    property: 'willChange',
    value: 'backdrop-filter',
    containsInline: !IS_SAFARI,
    containsBlock: !IS_SAFARI,
  },
] as const;
