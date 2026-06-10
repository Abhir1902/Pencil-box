// Shared whiteboard state, mutated only through these setters so every
// module sees a consistent view of the current tool configuration.
export const state = {
    tool: "pen",
    drawColor: "#000000",
    baseWidth: 4,
    isDrawing: false,
    pointerMode: false,
};

// Per-tool stroke behavior. defaultWidth is the starting size and the
// maximum the slider can reach for that tool.
export const TOOLS = {
    pen: {
        widthFactor: 0.55,
        alpha: 1,
        cap: "round",
        dash: null,
        defaultWidth: 3,
        render: "ink",
    },
    pencil: {
        widthFactor: 1.05,
        alpha: 1,
        cap: "round",
        dash: null,
        defaultWidth: 8,
        render: "graphite",
        graphiteMix: 0.62,
        graphiteTint: "#525252",
        graphitePasses: 3,
        graphiteAlpha: 0.16,
    },
    marker: {
        widthFactor: 2.2,
        alpha: 0.95,
        cap: "square",
        dash: null,
        defaultWidth: 8,
    },
    crayon: {
        widthFactor: 2.6,
        alpha: 0.6,
        cap: "round",
        dash: [1, 4],
        defaultWidth: 10,
    },
    brush: {
        widthFactor: 3.2,
        alpha: 0.4,
        cap: "round",
        dash: null,
        defaultWidth: 12,
    },
    highlighter: {
        widthFactor: 4.5,
        alpha: 0.2,
        cap: "butt",
        dash: null,
        defaultWidth: 14,
    },
    eraser: {
        widthFactor: 4,
        alpha: 1,
        cap: "round",
        dash: null,
        erase: true,
        defaultWidth: 16,
    },
    lasso: {
        widthFactor: 1,
        alpha: 1,
        cap: "round",
        dash: [7, 5],
        defaultWidth: 3,
    },
};

export function getActiveStrokeColor() {
    return state.drawColor;
}

const MIN_WIDTH = 1;

export function getToolWidthRange(tool) {
    const t = TOOLS[tool];
    return {
        min: MIN_WIDTH,
        max: t.defaultWidth,
        default: t.defaultWidth,
    };
}

export function setTool(tool) {
    state.tool = tool;
}

export function setPointerMode(active) {
    state.pointerMode = active;
}

export function isPointerMode() {
    return state.pointerMode;
}

export function setDrawColor(color) {
    state.drawColor = color;
}

export function setDrawWidth(width) {
    const { min, max } = getToolWidthRange(state.tool);
    state.baseWidth = Math.min(max, Math.max(min, Number(width)));
}

export function strokeStyle() {
    const t = TOOLS[state.tool];
    if (t.erase) {
        return {
            color: "rgba(0,0,0,1)",
            width: state.baseWidth * t.widthFactor,
            alpha: 1,
            cap: t.cap,
            dash: t.dash,
            composite: "destination-out",
        };
    }
    return {
        color: state.drawColor,
        width: state.baseWidth * t.widthFactor,
        alpha: t.alpha,
        cap: t.cap,
        dash: t.dash,
        composite: t.composite || "source-over",
    };
}
