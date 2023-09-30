import { BoxObject } from './utils/types.js';
export declare function getIntersection(elementA: BoxObject, elementB: BoxObject): {
    width: number;
    height: number;
    left: number;
    top: number;
    right: number;
    bottom: number;
} | null;
