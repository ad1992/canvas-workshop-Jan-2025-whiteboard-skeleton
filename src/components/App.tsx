import ShapesToolbar, { ActiveTool } from "./ShapesToolbar.tsx";
import { useEffect, useRef, useState } from "react";

import ResetCanvasDialog from "./ResetCanvasDialog.tsx";
import { TrashIcon } from "../icons.tsx";

import "./App.scss";
import { clearCanvas, drawRect } from "../utils/draw.ts";
import { randomColor } from "../utils/colors.ts";
import Scene from "../Scene.ts";
import { generateElement } from "../element.ts";

interface PointerDownState {
	origin: {
		x: number;
		y: number;
	};
	bgColor: string;
}

const App = () => {
	const [activeTool, setActiveTool] = useState<ActiveTool>("selection");
	const [showResetCanvasDialog, setshowResetCanvasDialog] = useState(false);

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const wrapperRef = useRef<HTMLDivElement | null>(null);
	const pointerDownStateRef = useRef<PointerDownState | null>(null);
	const sceneRef = useRef<Scene | null>(null);

	useEffect(() => {
		if (!canvasRef.current) return;
		sceneRef.current = new Scene(canvasRef.current);
	}, []);

	const onToolChange = (tool: ActiveTool) => {
		setActiveTool(tool);

		if (tool === "rectangle") {
			canvasRef.current?.style.setProperty("cursor", "crosshair");
		} else {
			canvasRef.current?.style.setProperty("cursor", "default");
		}
	};

	const resetCanvas = () => {
		setshowResetCanvasDialog(false);
	};

	console.log(activeTool, "Active tool");
	const onClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
		if (!canvasRef.current) {
			return;
		}
		console.log(event, "Event");
		if (activeTool === "rectangle") {
			const bgColor = randomColor();
			// Draw a rectangle
			drawRect(
				canvasRef.current,
				event.clientX,
				event.clientY,
				100,
				100,
				bgColor
			);
		}
	};
	const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
		console.log("on pointer up");
		pointerDownStateRef.current = {
			origin: {
				x: event.clientX,
				y: event.clientY,
			},
			bgColor: randomColor(),
		};
		document.addEventListener("pointermove", onPointerMove);
		document.addEventListener("pointerup", onPointerUp);
	};

	const onPointerMove = (event: PointerEvent) => {
		if (
			!pointerDownStateRef.current ||
			!canvasRef.current ||
			!sceneRef.current
		) {
			return;
		}
		console.log("on pointer move");
		if (activeTool === "rectangle") {
			const { origin, bgColor } = pointerDownStateRef.current;
			const width = event.clientX - origin.x;
			const height = event.clientY - origin.y;
			clearCanvas(canvasRef.current);
			sceneRef.current.redraw();
			console.log("DRAWING RECTANGLE");
			drawRect(canvasRef.current, origin.x, origin.y, width, height, bgColor);
		}
	};

	const onPointerUp = (event: PointerEvent) => {
		if (
			!pointerDownStateRef.current ||
			!canvasRef.current ||
			!sceneRef.current
		) {
			return;
		}
		console.log("on pointer up");
		const { origin, bgColor } = pointerDownStateRef.current;
		const width = event.clientX - origin.x;
		const height = event.clientY - origin.y;
		const element = generateElement(
			"rectangle",
			origin.x,
			origin.y,
			width,
			height,
			bgColor
		);
		sceneRef.current.addElement(element);
		console.log(sceneRef.current.getAllElements(), "Scene elements");
		document.removeEventListener("pointermove", onPointerMove);
		document.removeEventListener("pointerup", onPointerUp);
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
					ref={canvasRef}
					width={window.innerWidth}
					height={window.innerHeight}
					style={{
						touchAction: "none",
						display: "block",
					}}
					onPointerDown={onPointerDown}
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
