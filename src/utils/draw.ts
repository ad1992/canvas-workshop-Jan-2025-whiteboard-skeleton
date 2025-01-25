/**
 * Draws a rectangle on the canvas
 * @param canvas - The canvas element
 * @param x - The x coordinate
 * @param y - The y coordinate
 * @param width - The width of the rectangle
 * @param height - The height of the rectangle
 * @param bgColor - The background color of the rectangle
 */

import { SELECTION_BORDER_PADDING, SELECTION_COLOR } from "../constants";
import { ElementType } from "../element";

export const drawRect = (
	canvas: HTMLCanvasElement,
	x: number,
	y: number,
	width: number,
	height: number,
	bgColor: string
) => {
	const ctx = canvas.getContext("2d");
	if (!ctx) return;
	ctx.fillStyle = bgColor;
	ctx.fillRect(x, y, width, height);
};

/**
 * Clears the canvas
 * @param canvas - The canvas element
 */
export const clearCanvas = (canvas: HTMLCanvasElement) => {
	// TODO: Implement this

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

/**
 * Renders the selection border
 * @param canvas - The canvas element
 * @param element - The element to render
 */
export const renderSelectionBorder = (
	canvas: HTMLCanvasElement,
	element: ElementType
) => {
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		return;
	}
	ctx.strokeStyle = SELECTION_COLOR;
	ctx.strokeRect(element.x - SELECTION_BORDER_PADDING, element.y - SELECTION_BORDER_PADDING, element.width + SELECTION_BORDER_PADDING*2, element.height + SELECTION_BORDER_PADDING*2)
};
