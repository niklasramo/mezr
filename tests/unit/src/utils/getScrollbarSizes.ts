import { createTestElement } from './createTestElement.js';

export function getScrollbarSizes() {
  const parent = createTestElement({
    position: 'relative',
    width: '100px',
    height: '100px',
    overflow: 'scroll',
  });

  const child = createTestElement({
    width: '200px',
    height: '200px',
  });

  const childAbs = createTestElement({
    position: 'absolute',
    inset: '0px',
  });

  parent.appendChild(child);
  parent.appendChild(childAbs);

  const width = parent.getBoundingClientRect().width - childAbs.getBoundingClientRect().width;
  const height = parent.getBoundingClientRect().height - childAbs.getBoundingClientRect().height;

  child.remove();
  childAbs.remove();
  parent.remove();

  return {
    width,
    height,
  };
}
