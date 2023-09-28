export declare function getOffsetContainer(element: HTMLElement, options?: {
    position?: string;
    skipDisplayNone?: boolean;
}): (Window & typeof globalThis) | Document | HTMLElement | null;
