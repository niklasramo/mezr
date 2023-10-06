export function beforeTest() {
  if (!document.getElementById('default-page-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'default-page-styles';
    styleSheet.type = 'text/css';
    styleSheet.innerHTML = `
      body {
        margin: 0;
      }
    `;
    document.head.appendChild(styleSheet);
  }

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'instant',
  });

  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

export function afterTest() {
  document.getElementById('default-page-styles')?.remove();
  document.documentElement.removeAttribute('style');
  document.body.removeAttribute('style');

  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'instant',
  });
}
