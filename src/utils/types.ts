import { BOX_EDGE } from './constants.js';

export type BoxRect = {
  width: number;
  height: number;
  left: number;
  top: number;
};

export type BoxElement = Element | Document | Window;

export type BoxElementEdge = keyof typeof BOX_EDGE;

export type BoxObject = BoxElement | [BoxElement, BoxElementEdge] | BoxRect;
