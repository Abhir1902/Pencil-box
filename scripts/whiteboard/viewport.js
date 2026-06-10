// Pan/zoom viewport for the infinite graph-paper board.
export const STAGE_SIZE = 50000;
export const WORLD_SIZE = 4096;
export const WORLD_LEFT = (STAGE_SIZE - WORLD_SIZE) / 2;
export const WORLD_TOP = (STAGE_SIZE - WORLD_SIZE) / 2;

const MIN_ZOOM = 0.15;
const MAX_ZOOM = 4;

export const viewport = {
    panX: 0,
    panY: 0,
    zoom: 1,
};

let stageEl = null;
let wrapEl = null;

export function bindViewportElements(wrap, stage) {
    wrapEl = wrap;
    stageEl = stage;
}

export function viewportSize() {
    if (!wrapEl) return { width: window.innerWidth, height: window.innerHeight - 52 };
    const rect = wrapEl.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
}

export function applyViewportTransform() {
    if (!stageEl) return;
    stageEl.style.transform = `translate(${viewport.panX}px, ${viewport.panY}px) scale(${viewport.zoom})`;
}

export function centerViewport() {
    const { width, height } = viewportSize();
    const cx = WORLD_LEFT + WORLD_SIZE / 2;
    const cy = WORLD_TOP + WORLD_SIZE / 2;
    viewport.zoom = 1;
    viewport.panX = width / 2 - cx;
    viewport.panY = height / 2 - cy;
    applyViewportTransform();
}

export function screenToWorld(clientX, clientY) {
    const rect = wrapEl.getBoundingClientRect();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;
    return {
        x: (sx - viewport.panX) / viewport.zoom,
        y: (sy - viewport.panY) / viewport.zoom,
    };
}

export function zoomAt(clientX, clientY, factor) {
    const rect = wrapEl.getBoundingClientRect();
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;
    const worldX = (sx - viewport.panX) / viewport.zoom;
    const worldY = (sy - viewport.panY) / viewport.zoom;
    const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, viewport.zoom * factor));
    viewport.panX = sx - worldX * nextZoom;
    viewport.panY = sy - worldY * nextZoom;
    viewport.zoom = nextZoom;
    applyViewportTransform();
}

export function getViewportState() {
    return { panX: viewport.panX, panY: viewport.panY, zoom: viewport.zoom };
}

export function setViewportState(state) {
    if (!state) {
        centerViewport();
        return;
    }
    viewport.panX = state.panX ?? viewport.panX;
    viewport.panY = state.panY ?? viewport.panY;
    viewport.zoom = state.zoom ?? viewport.zoom;
    applyViewportTransform();
}
