import { BOX_AREA } from './constants.js';

export type Rect = {
  width: number;
  height: number;
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type DomRectElement = Element | Document | Window;

export type DomRectElementArea = keyof typeof BOX_AREA;

export type DomRectArray = [DomRectElement, DomRectElementArea];
