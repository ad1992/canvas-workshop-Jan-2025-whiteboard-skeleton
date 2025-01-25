import { nanoid } from "nanoid";

export interface ElementType {
  id: string;
  type: "rectangle";
  x: number;
  y: number;
  width: number;
  height: number;
  deleted: boolean;
  bgColor: string;
}

/**
 * Creates a new Element
 * @param type - The type of the shape
 * @param x - The x coordinate
 * @param y - The y coordinate
 * @param width - The width of the shape
 * @param height - The height of the shape
 * @param bgColor - The background color of the shape
 * @returns The new shape
 */

// @TODO - I wish I could name it as createElement :(
export const generateElement = (
  type: "rectangle",
  x: number,
  y: number,
  width: number,
  height: number,
  bgColor: string,
) => {
  const id = nanoid();
  return {
    id,
    type,
    x,
    y,
    width,
    height,
    bgColor,
    deleted: false,
  };
};
