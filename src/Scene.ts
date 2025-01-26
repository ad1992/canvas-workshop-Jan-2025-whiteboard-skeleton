import { ElementType } from "./element";
import { sceneCoordsToViewportCoords } from "./utils/coords";
import { clearCanvas, drawRect, renderSelectionBorder } from "./utils/draw";

class Scene {
	private elements: Array<ElementType>;
	private canvas: HTMLCanvasElement;

	constructor(canvas: HTMLCanvasElement) {
		this.elements = [];
		this.canvas = canvas;
	}

	addElement(element: ElementType) {
		this.elements.push(element);
	}

	updateElement(id: string, updates: Partial<ElementType>) {
		const index = this.elements.findIndex((element) => element.id === id);
		if (index === -1) {
			console.error("Element not found");
			return;
		}
		this.elements[index] = { ...this.elements[index], ...updates };
	}

	replaceElements(elements: Array<ElementType>) {
		this.elements = elements;
	}

	removeElement(id: string) {
		const index = this.elements.findIndex((element) => element.id === id);
		if (index === -1) {
			console.error("Element not found");
			return;
		}
		this.elements[index].deleted = true;
	}

	getAllElements() {
		return this.elements.filter((element) => !element.deleted);
	}

	getAllElementsIncludingDeleted() {
		return this.elements;
	}

	getElementsMap() {
		return this.elements.reduce(
			(acc, element) => {
				acc[element.id] = element;
				return acc;
			},
			{} as Record<string, ElementType>
		);
	}

	clear() {
		this.elements = [];
	}

	/**
	 * Redraws the scene
	 */
	redraw(
		selectedElementIds: Array<string>,
		opts: { scrollX: number; scrollY: number }
	) {
		clearCanvas(this.canvas);
		this.elements.forEach((element) => {
			console.log("REDRAW");
			const { clientX, clientY } = sceneCoordsToViewportCoords(
				element.x,
				element.y,
				opts
			);
			drawRect(
				this.canvas,
				clientX,
				clientY,
				element.width,
				element.height,
				element.bgColor
			);
			if (selectedElementIds.includes(element.id)) {
				renderSelectionBorder(this.canvas, element, clientX, clientY);
			}
		});
	}
}

export default Scene;
