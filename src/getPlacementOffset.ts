// TODO: Implement collision detection and handling.
// TODO: Improve perf by only computing data that is needed by the placement.
// TODO: Helpers for overlap scenarios:
//       - shift: shift element.
//       - flip: flip element (to the fallback with most space or the first
//         fallback with enough space).
//       - flipshift: flip first then shift.
// TODO: Think about naming stuff relative to the anchor positioning CSS spec:
//       https://www.w3.org/TR/css-anchor-position-1/

import { getOverflow } from './getOverflow.js';
import { getNormalizedRect } from './utils/getNormalizedRect.js';
import { DomRectElement, DomRectArray, Rect } from './utils/types.js';

// Constants

const DEFAULT_PLACEMENT: PlacementArray = ['left', 'top'];

// Types

type PlacementX = 'left' | 'center' | 'right';
type PlacementY = 'top' | 'center' | 'bottom';
type PlacementString = `${PlacementX} ${PlacementY}`;
type PlacementArray = [PlacementX, PlacementY];

export type PlacementOverflowData = {
  rects: {
    element: Rect;
    reference: Rect;
    container: Rect;
  };
  offset: { x: number; y: number };
  overflow: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
};

export type PlacementOptions = {
  elementPlacement?: PlacementString | PlacementArray;
  referencePlacement?: PlacementString | PlacementArray;
  container?: Rect | DomRectElement | DomRectArray | null;
  onOverflow?: (data: PlacementOverflowData) => { x: number; y: number };
};

// Utils

function getNormalizedPlacement(placement: PlacementString | PlacementArray) {
  return typeof placement === 'string' ? (placement.split(' ') as PlacementArray) : placement;
}

function getAxisOffset(
  elementPlacement: PlacementX | PlacementY,
  referencePlacement: PlacementX | PlacementY,
  elementSize: number,
  elementOffset: number,
  referenceSize: number,
  referenceOffset: number,
) {
  const placement = elementPlacement + referencePlacement;
  const nwPoint = referenceOffset - elementOffset;

  switch (placement) {
    case 'leftleft':
    case 'toptop': {
      return nwPoint;
    }
    case 'leftcenter':
    case 'topcenter': {
      return nwPoint + referenceSize / 2;
    }
    case 'leftright':
    case 'topbottom': {
      return nwPoint + referenceSize;
    }
    case 'centerleft':
    case 'centertop': {
      return nwPoint - elementSize / 2;
    }
    case 'centerright':
    case 'centerbottom': {
      return nwPoint + referenceSize - elementSize / 2;
    }
    case 'rightleft':
    case 'bottomtop': {
      return nwPoint - elementSize;
    }
    case 'rightcenter':
    case 'bottomcenter': {
      return nwPoint - elementSize + referenceSize / 2;
    }
    case 'rightright':
    case 'bottombottom': {
      return nwPoint - elementSize + referenceSize;
    }
    default: {
      return nwPoint + referenceSize / 2 - elementSize / 2;
    }
  }
}

export function getPlacementOffset(
  element: Rect | DomRectElement | DomRectArray,
  reference: Rect | DomRectElement | DomRectArray,
  options: PlacementOptions = {},
) {
  const elRect = getNormalizedRect(element);
  const refRect = getNormalizedRect(reference);
  const elPlacement = getNormalizedPlacement(options.elementPlacement || DEFAULT_PLACEMENT);
  const refPlacement = getNormalizedPlacement(options.referencePlacement || DEFAULT_PLACEMENT);
  let offsetX = getAxisOffset(
    elPlacement[0],
    refPlacement[0],
    elRect.width,
    elRect.left,
    refRect.width,
    refRect.left,
  );
  let offsetY = getAxisOffset(
    elPlacement[1],
    refPlacement[1],
    elRect.height,
    elRect.top,
    refRect.height,
    refRect.top,
  );

  if (options.container && options.onOverflow) {
    elRect.left += offsetX;
    elRect.top += offsetY;
    elRect.right = elRect.left + elRect.width;
    elRect.bottom = elRect.top + elRect.height;

    const containerRect = getNormalizedRect(options.container);
    const overflow = getOverflow(elRect, containerRect);
    const offsetCorrection = options.onOverflow({
      rects: { element: elRect, reference: refRect, container: containerRect },
      offset: { x: offsetX, y: offsetY },
      overflow,
    });

    offsetX += offsetCorrection.x;
    offsetY += offsetCorrection.y;
  }

  return { x: offsetX, y: offsetY };
}
