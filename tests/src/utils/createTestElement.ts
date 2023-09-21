import { Properties } from 'csstype';

export function createTestElement(styles: Properties = {}) {
  const el = document.createElement('div');
  Object.assign(el.style, { ...styles });
  document.body.appendChild(el);
  return el;
}
