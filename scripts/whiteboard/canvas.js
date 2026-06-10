import { state, isPointerMode } from "./state.js";
import { pushSnapshot } from "./history.js";
import {
    createStrokeSession,
    extendStroke,
    finishStroke,
} from "./strokes.js";
import {
    WORLD_SIZE,
    WORLD_LEFT,
    WORLD_TOP,
    bindViewportElements,
    centerViewport,
    screenToWorld,
    zoomAt,
    applyViewportTransform,
    viewport,
} from "./viewport.js";

let onCanvasChangeCallback = () => {};
let pendingSave = null;

export function setOnCanvasChange(fn) {
    onCanvasChangeCallback = fn;
}

export const canvasWrap = document.getElementById("canvas-wrap");
export const canvasStage = document.getElementById("canvas-stage");
export const canvas = document.getElementById("can");
export const context = canvas.getContext("2d", { willReadFrequently: true });

let strokeSession = null;
let isPanning = false;
let panStart = { x: 0, y: 0 };
let panOrigin = { x: 0, y: 0 };

function initWorldCanvas() {
    canvas.width = WORLD_SIZE;
    canvas.height = WORLD_SIZE;
    context.clearRect(0, 0, WORLD_SIZE, WORLD_SIZE);
    context.lineJoin = "round";
    context.lineCap = "round";
}

function eventPoint(event) {
    if (event.clientX != null) {
        return { clientX: event.clientX, clientY: event.clientY };
    }
    const source = event.touches ? event.touches[0] : event;
    return { clientX: source.clientX, clientY: source.clientY };
}

function canvasPoint(event) {
    const { clientX, clientY } = eventPoint(event);
    const world = screenToWorld(clientX, clientY);
    return {
        x: world.x - WORLD_LEFT,
        y: world.y - WORLD_TOP,
    };
}

function inCanvasBounds(pt) {
    return pt.x >= 0 && pt.y >= 0 && pt.x <= WORLD_SIZE && pt.y <= WORLD_SIZE;
}

function isOnBoard(event) {
    return canvasWrap.contains(event.target);
}

function scheduleSave() {
    if (pendingSave) return;
    pendingSave = requestAnimationFrame(() => {
        pendingSave = null;
        pushSnapshot(context, canvas);
        onCanvasChangeCallback();
    });
}

function startDraw(event) {
    if (isPointerMode() || !isOnBoard(event)) return;
    const pt = canvasPoint(event);
    if (!inCanvasBounds(pt)) return;

    state.isDrawing = true;
    strokeSession = createStrokeSession(pt, viewport.zoom);
    event.preventDefault();
}

function stopDraw(event) {
    if (!state.isDrawing || !strokeSession) return;

    if (event) {
        const pt = canvasPoint(event);
        if (inCanvasBounds(pt)) {
            extendStroke(context, strokeSession, pt);
        }
    }
    finishStroke(context, strokeSession);
    scheduleSave();

    state.isDrawing = false;
    strokeSession = null;
    if (event) event.preventDefault();
}

function startPan(event) {
    if (!isPointerMode() || !isOnBoard(event)) return;
    const { clientX, clientY } = eventPoint(event);
    isPanning = true;
    panStart = { x: clientX, y: clientY };
    panOrigin = { x: viewport.panX, y: viewport.panY };
    canvasWrap.classList.add("is-panning");
    canvasWrap.setPointerCapture(event.pointerId);
    event.preventDefault();
}

function movePan(event) {
    if (!isPanning) return;
    const { clientX, clientY } = eventPoint(event);
    viewport.panX = panOrigin.x + (clientX - panStart.x);
    viewport.panY = panOrigin.y + (clientY - panStart.y);
    applyViewportTransform();
    event.preventDefault();
}

function stopPan() {
    if (!isPanning) return;
    isPanning = false;
    canvasWrap.classList.remove("is-panning");
}

export function stopPanning() {
    stopPan();
    if (state.isDrawing && strokeSession) {
        finishStroke(context, strokeSession);
        state.isDrawing = false;
        strokeSession = null;
    }
}

function onPointerDown(event) {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    if (isPointerMode()) startPan(event);
    else {
        canvasWrap.setPointerCapture(event.pointerId);
        startDraw(event);
    }
}

function onPointerMove(event) {
    if (isPanning) {
        movePan(event);
        return;
    }
    if (!state.isDrawing || !strokeSession) return;

    const pt = canvasPoint(event);
    if (inCanvasBounds(pt)) {
        extendStroke(context, strokeSession, pt);
    }
    event.preventDefault();
}

function onPointerUp(event) {
    if (canvasWrap.hasPointerCapture(event.pointerId)) {
        canvasWrap.releasePointerCapture(event.pointerId);
    }
    stopPan();
    stopDraw(event);
}

function onWheel(event) {
    if (!isPointerMode()) return;
    event.preventDefault();
    const factor = event.deltaY > 0 ? 0.92 : 1.08;
    zoomAt(event.clientX, event.clientY, factor);
}

function resizeViewport() {
    applyViewportTransform();
}

export function updateCanvasCursor() {
    canvasWrap.classList.toggle("pointer-mode", isPointerMode());
}

export function initCanvas() {
    bindViewportElements(canvasWrap, canvasStage);
    initWorldCanvas();
    updateCanvasCursor();

    window.addEventListener("resize", resizeViewport, true);

    canvasWrap.addEventListener("wheel", onWheel, { passive: false });
    canvasWrap.addEventListener("pointerdown", onPointerDown);
    canvasWrap.addEventListener("pointermove", onPointerMove);
    canvasWrap.addEventListener("pointerup", onPointerUp);
    canvasWrap.addEventListener("pointercancel", onPointerUp);

    window.addEventListener("pointerup", () => {
        if (isPanning) stopPan();
    });
}

export function refreshCanvasSize() {
    applyViewportTransform();
}

export { centerViewport, getViewportState, setViewportState } from "./viewport.js";
