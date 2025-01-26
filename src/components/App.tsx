import ShapesToolbar, { ActiveTool } from "./ShapesToolbar.tsx";
import { useEffect, useRef, useState } from "react";

import ResetCanvasDialog from "./ResetCanvasDialog.tsx";
import { TrashIcon } from "../icons.tsx";

import "./App.scss";
import { clearCanvas, drawRect } from "../utils/draw.ts";
import { randomColor } from "../utils/colors.ts";
import Scene from "../Scene.ts";
import { ElementType, generateElement } from "../element.ts";
import { getHitElement } from "../utils/hitTest.ts";
import {
	getNormalizedRect,
	viewportCoordsToSceneCoords,
} from "../utils/coords.ts";

interface PointerDownState {
	origin: {
		x: number;
		y: number;
	};
	bgColor: string;
	hitElement: ElementType | undefined;
}

const App = () => {
	const [activeTool, setActiveTool] = useState<ActiveTool>("selection");
	const [showResetCanvasDialog, setshowResetCanvasDialog] = useState(false);

	const drawingCanvasRef = useRef<HTMLCanvasElement | null>(null);
	const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);

	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const pointerDownStateRef = useRef<PointerDownState | null>(null);
	const sceneRef = useRef<Scene | null>(null);
	const selectElementIdsRef = useRef<Array<string>>([]);

	const scrollRef = useRef<{ scrollX: number; scrollY: number }>({
		scrollX: 0,
		scrollY: 0,
	});

	useEffect(() => {
		if (!bgCanvasRef.current) return;
		sceneRef.current = new Scene(bgCanvasRef.current);
	}, []);

	const onToolChange = (tool: ActiveTool) => {
		setActiveTool(tool);

		if (tool === "rectangle") {
			drawingCanvasRef.current?.style.setProperty("cursor", "crosshair");
		} else {
			drawingCanvasRef.current?.style.setProperty("cursor", "default");
		}
	};

	const resetCanvas = () => {
		setshowResetCanvasDialog(false);
	};

	console.log(activeTool, "Active tool");

	const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
		console.log("on pointer down");
		if (!sceneRef.current) {
			return;
		}
		const allElements = sceneRef.current.getAllElements();
		const hitElement = getHitElement(event.clientX, event.clientY, allElements);
		pointerDownStateRef.current = {
			origin: {
				x: event.clientX,
				y: event.clientY,
			},
			bgColor: randomColor(),
			hitElement,
		};
		console.log("hit element", hitElement);
		document.addEventListener("pointermove", onPointerMove);
		document.addEventListener("pointerup", onPointerUp);
	};

	const onPointerMove = (event: PointerEvent) => {
		if (
			!pointerDownStateRef.current ||
			!drawingCanvasRef.current ||
			!sceneRef.current
		) {
			return;
		}
		console.log("on pointer move");
		if (activeTool === "rectangle") {
			const { origin, bgColor } = pointerDownStateRef.current;
			const width = event.clientX - origin.x;
			const height = event.clientY - origin.y;
			console.log("DRAWING RECTANGLE");

			// Only drawing canvas should be cleared and redrawn when drawing.
			clearCanvas(drawingCanvasRef.current);
			drawRect(
				drawingCanvasRef.current,
				origin.x,
				origin.y,
				width,
				height,
				bgColor
			);
		} else if (activeTool === "selection") {
			if (selectElementIdsRef.current.length) {
				//const selectedELementId = selectElementIdsRef.current[0];

				// delta x and delta y
				const { origin, hitElement } = pointerDownStateRef.current;
				if (!hitElement) {
					return;
				}
				const deltaX = event.clientX - origin.x;
				const deltaY = event.clientY - origin.y;

				// selection border is shown during movement
				selectElementIdsRef.current = [hitElement.id];
				sceneRef.current.updateElement(hitElement.id, {
					x: hitElement.x + deltaX,
					y: hitElement.y + deltaY,
				});

				sceneRef.current.redraw(selectElementIdsRef.current, scrollRef.current);
				// calculate the new top left for the element
			}
		}
	};

	const onPointerUp = (event: PointerEvent) => {
		if (
			!pointerDownStateRef.current ||
			!drawingCanvasRef.current ||
			!sceneRef.current
		) {
			return;
		}

		console.log("on pointer up", activeTool);

		if (activeTool === "rectangle") {
			const { origin, bgColor } = pointerDownStateRef.current;
			const { x, y, width, height } = getNormalizedRect(
				origin.x,
				origin.y,
				event.clientX,
				event.clientY
			);
			clearCanvas(drawingCanvasRef.current);

			const { sceneX, sceneY } = viewportCoordsToSceneCoords(
				x,
				y,
				scrollRef.current
			);
			const element = generateElement(
				"rectangle",
				sceneX,
				sceneY,
				width,
				height,
				bgColor
			);
			sceneRef.current.addElement(element);
			console.log(sceneRef.current.getAllElements(), "Scene elements");

			onToolChange("selection");
		} else if (activeTool === "selection") {
			if (!pointerDownStateRef.current) {
				return;
			}
			const { hitElement } = pointerDownStateRef.current;

			if (hitElement) {
				selectElementIdsRef.current = [hitElement.id];
			} else {
				selectElementIdsRef.current = [];
			}
		}
		sceneRef.current.redraw(selectElementIdsRef.current, scrollRef.current);

		pointerDownStateRef.current = null;
		document.removeEventListener("pointermove", onPointerMove);
		document.removeEventListener("pointerup", onPointerUp);
	};

	const onWheel = (event: React.WheelEvent<HTMLCanvasElement | null>) => {
		if (!sceneRef.current) {
			return;
		}
		console.log("WHEEL", "DELTAX = ", event.deltaX, "DELTA Y", event.deltaY);

		const { deltaX, deltaY } = event;

		scrollRef.current.scrollX -= deltaX;
		scrollRef.current.scrollY -= deltaY;

		sceneRef.current.redraw(selectElementIdsRef.current, scrollRef.current);

		console.log(scrollRef.current);
	};

	return (
		<div className="whiteboard-app">
			<div className="whiteboard-app-canvas" ref={wrapperRef}>
				<button
					className="clear-canvas-btn"
					onClick={() => setshowResetCanvasDialog(true)}
					aria-label={"clear canvas"}
				>
					{TrashIcon}
				</button>
				<div className="shapes-toolbar-container">
					<ShapesToolbar onClick={onToolChange} activeTool={activeTool} />
				</div>
				<canvas
					id="background-canvas"
					ref={bgCanvasRef}
					width={window.innerWidth}
					height={window.innerHeight}
				></canvas>
				<canvas
					id="drawing-canvas"
					ref={drawingCanvasRef}
					width={window.innerWidth}
					height={window.innerHeight}
					onPointerDown={onPointerDown}
					onWheel={onWheel}
				></canvas>
			</div>
			{showResetCanvasDialog && (
				<ResetCanvasDialog
					onReset={resetCanvas}
					onClose={() => setshowResetCanvasDialog(false)}
				/>
			)}
		</div>
	);
};

export default App;
