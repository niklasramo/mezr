import { Properties } from 'csstype';

const defaultStyles: Properties = {
  backgroundColor: 'red',
};

export function createTestElement(styles: Properties = {}) {
  const el = document.createElement('div');
  Object.assign(el.style, { ...defaultStyles, ...styles });
  document.body.appendChild(el);
  return el;
}
