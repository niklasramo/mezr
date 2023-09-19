// Constants

const SHIFT = {
  default: 'shift',
  force: 'shift-force',
  none: 'none',
} as const;

// Types

type PlacementShiftValue = typeof SHIFT[keyof typeof SHIFT];

// Utils

export function getPlacementAxisShift(
  sideAShift: PlacementShiftValue,
  sideBShift: PlacementShiftValue,
  sideAOverflow: number,
  sideBOverflow: number,
) {
  let ret = 0;

  // If shifting is needed from both sides.
  if (
    sideAShift !== SHIFT.none &&
    sideBShift !== SHIFT.none &&
    (sideAOverflow < 0 || sideBOverflow < 0)
  ) {
    // Do shift correction from opposite sides with equal force.
    const sizeDifference = sideAOverflow + sideBOverflow;
    if (sideAOverflow < sideBOverflow) {
      ret -= sizeDifference < 0 ? sideAOverflow + Math.abs(sizeDifference / 2) : sideAOverflow;
    }
    if (sideBOverflow < sideAOverflow) {
      ret += sizeDifference < 0 ? sideBOverflow + Math.abs(sizeDifference / 2) : sideBOverflow;
    }

    // Update overflow data.
    sideAOverflow += ret;
    sideBOverflow -= ret;

    // Check if left/top side forced shift correction is needed.
    if (sideAOverflow < 0 && sideAShift === SHIFT.force && sideBShift !== SHIFT.force) {
      ret -= sideAOverflow;
    }

    // Check if right/top side forced shift correction is needed.
    if (sideBOverflow < 0 && sideBShift === SHIFT.force && sideAShift !== SHIFT.force) {
      ret += sideBOverflow;
    }
  }

  // Check if shifting is needed from left or top side only.
  else if (sideAShift !== SHIFT.none && sideAOverflow < 0) {
    ret -= sideAOverflow;
  }

  // Check if pushing is needed from right or bottom side only.
  else if (sideBShift !== SHIFT.none && sideBOverflow < 0) {
    ret += sideBOverflow;
  }

  return ret;
}
