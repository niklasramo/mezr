function isDimensionsMatch(
  targetDimensions: { width: number; height: number },
  ancestorDimensions: { width: number; height: number },
  scaleFactor: number,
): boolean {
  return (
    Math.abs(ancestorDimensions.width * scaleFactor - targetDimensions.width) < 0.5 &&
    Math.abs(ancestorDimensions.height * scaleFactor - targetDimensions.height) < 0.5
  );
}

export function getEffectiveContainingBlock(
  element: HTMLElement,
  scaleFactor: number,
): HTMLElement | Window | null {
  let target = element;
  let ancestor = target.parentElement;

  const targetOriginalRect = target.getBoundingClientRect();

  while (ancestor) {
    const ancestorOriginalRect = ancestor.getBoundingClientRect();

    // Check if the ancestor's dimensions match the expected dimensions based on
    // the scaleFactor.
    if (isDimensionsMatch(targetOriginalRect, ancestorOriginalRect, scaleFactor)) {
      // Temporarily adjust the ancestor's size to see if the target element
      // responds accordingly.
      const originalWidth = ancestor.style.width;
      const originalHeight = ancestor.style.height;

      // Modify the ancestor's size.
      ancestor.style.width = `${ancestorOriginalRect.width + 10}px`;
      ancestor.style.height = `${ancestorOriginalRect.height + 10}px`;

      // Recalculate the target's and ancestor's dimensions.
      const targetNewRect = target.getBoundingClientRect();
      const ancestorNewRect = ancestor.getBoundingClientRect();

      // Restore the ancestor's original size.
      ancestor.style.width = originalWidth;
      ancestor.style.height = originalHeight;

      // Verify if the size change in the ancestor reflects correctly in the
      // target element.
      if (isDimensionsMatch(targetNewRect, ancestorNewRect, scaleFactor)) {
        return ancestor;
      }
    }

    // Move up the tree.
    ancestor = ancestor.parentElement;
  }

  // If no matching ancestor is found, and the element is positioned as "fixed"
  // or "absolute" and its dimensions match the expected dimensions based on the
  // scaleFactor, then the element's containing block is the window.
  const { position } = window.getComputedStyle(element);
  if (
    (position === 'fixed' || position === 'absolute') &&
    isDimensionsMatch(
      targetOriginalRect,
      { width: window.innerWidth, height: window.innerHeight },
      scaleFactor,
    )
  ) {
    return window;
  }

  // If no matching ancestor is found, return null.
  return null;
}
