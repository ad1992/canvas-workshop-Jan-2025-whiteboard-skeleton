import { ElementType } from "../element";

/**
 * Checks if the point is hitting an element
 * @param coordX - The scene x coordinate
 * @param coordY - The scene y coordinate
 * @param element - The element to check
 */
export const isHittingElement = (
	coordX: number,
	coordY: number,
	element: ElementType
) => {
	if (
		coordX >= element.x &&
		coordX <= element.x + element.width &&
		coordY >= element.y &&
		coordY <= element.y + element.height
	) {
		return true;
	}
	return false;
};

/**
 * Gets the hit element
 * @param coordX - The scene x coordinate
 * @param coordY - The scene y coordinate
 * @param elements - The elements to check
 */
export const getHitElement = (
	coordX: number,
	coordY: number,
	elements: Array<ElementType>
) => {
	return elements
		.reverse()
		.find((element) => isHittingElement(coordX, coordY, element));
};
