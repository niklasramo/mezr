import { BOX_EDGE } from './constants.js';

export type BoxRect = {
  width: number;
  height: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type BoxEdge = keyof typeof BOX_EDGE;

export type BoxElement = Element | Document | Window;

export type BoxElementExtended = BoxElement | [BoxElement, BoxEdge] | BoxRect;
