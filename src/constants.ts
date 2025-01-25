import { RESIZE_HANDLER_SIZE } from "./resize";

/**
 * The padding for the canvas wrapper in pixels
 */
export const CANVAS_WRAPPER_PADDING = 0;

/**
 * The padding for the selection border in pixels
 */
export const SELECTION_BORDER_PADDING = 10;

/**
 * The ratio of physical pixels on a device to CSS pixels used to draw on screen
 */
export const DPR =
	typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

/**
 * The offset for the element from the selection border corner
 */
export const ELEMENT_BOUNDARY_OFFSET =
	SELECTION_BORDER_PADDING + RESIZE_HANDLER_SIZE / 2;

/** Selection color */
export const SELECTION_COLOR = "#7048e8";
