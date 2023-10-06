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

// On some mobile devices (and on desktop browsers if you zoom to specific
// levels) the computed values of some properties are not always the integer
// values you have specified in CSS. E.g. border width of 3px might turn to
// 2.887px when you zoom the browser or when you use a mobile device with
// a specific display scaling. Here we check if the browser has this issue.
export const HAS_FLAKY_COMPUTED_DIMENSIONS = (() => {
  const el = document.createElement('div');
  Object.assign(el.style, {
    boxSizing: 'content-box',
    overflow: 'scroll',
    width: `50px`,
    height: `50px`,
    paddingLeft: `1px`,
    paddingRight: `2px`,
    paddingTop: `1px`,
    paddingBottom: `2px`,
    borderLeft: `3px solid #000`,
    borderRight: `4px solid #000`,
    borderTop: `3px solid #000`,
    borderBottom: `4px solid #000`,
    marginLeft: `5px`,
    marginRight: `6px`,
    marginTop: `5px`,
    marginBottom: `6px`,
  });

  document.body.appendChild(el);

  const rect = el.getBoundingClientRect();

  document.body.removeChild(el);

  if (!Number.isInteger(rect.width) || !Number.isInteger(rect.height)) {
    return true;
  }

  return false;
})();
