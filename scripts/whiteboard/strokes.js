import { TOOLS, strokeStyle, state } from "./state.js";

function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
}

function hash(n) {
    const x = Math.sin(n * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
}

function mixHex(hex, tint, mix) {
    const parse = (c) => {
        const h = c.replace("#", "");
        return [
            parseInt(h.slice(0, 2), 16),
            parseInt(h.slice(2, 4), 16),
            parseInt(h.slice(4, 6), 16),
        ];
    };
    const [r, g, b] = parse(hex);
    const [tr, tg, tb] = parse(tint);
    const lerp = (a, b) => Math.round(a + (b - a) * mix);
    return `rgb(${lerp(r, tr)}, ${lerp(g, tg)}, ${lerp(b, tb)})`;
}

function renderMode(tool, stroke) {
    if (tool.render) return tool.render;
    if (tool.erase) return "erase";
    if (stroke.alpha < 1 || tool.dash) return "soft";
    return "ink";
}

function applySessionContext(ctx, session) {
    const s = session.stroke;
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.width / session.zoom;
    ctx.globalAlpha = s.alpha;
    ctx.lineCap = s.cap;
    ctx.lineJoin = "round";
    ctx.setLineDash(s.dash || []);
    ctx.globalCompositeOperation = s.composite || "source-over";
}

function resetContext(ctx) {
    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
    ctx.globalCompositeOperation = "source-over";
}

function drawInkSegment(ctx, x0, y0, x1, y1, x2, y2, session) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.quadraticCurveTo(x1, y1, x2, y2);
    applySessionContext(ctx, session);
    ctx.stroke();
}

function drawGraphiteSegment(ctx, x0, y0, x1, y1, x2, y2, session, speed) {
    const tool = session.toolDef;
    const pressure = clamp(1 - speed * 0.012, 0.4, 1);
    const baseWidth = (session.stroke.width / session.zoom) * pressure * 1.15;
    const color = session.graphiteColor;
    const passes = tool.graphitePasses || 3;
    const segAngle = Math.atan2(y2 - y0, x2 - x0) + Math.PI / 2;

    for (let i = 0; i < passes; i++) {
        const seed = x1 * 0.13 + y1 * 0.17 + i * 2.41;
        const jitter = (hash(seed) - 0.5) * baseWidth * 0.32;
        const ox = Math.cos(segAngle) * jitter;
        const oy = Math.sin(segAngle) * jitter;

        ctx.beginPath();
        ctx.moveTo(x0 + ox, y0 + oy);
        ctx.quadraticCurveTo(x1 + ox, y1 + oy, x2 + ox, y2 + oy);
        ctx.strokeStyle = color;
        ctx.lineWidth = baseWidth * (0.75 + hash(seed + 1.7) * 0.35);
        ctx.globalAlpha = tool.graphiteAlpha ?? 0.18;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.setLineDash([]);
        ctx.globalCompositeOperation = "source-over";
        ctx.stroke();
    }
    resetContext(ctx);
}

function drawSegment(ctx, x0, y0, x1, y1, x2, y2, session, speed) {
    if (session.mode === "graphite") {
        drawGraphiteSegment(ctx, x0, y0, x1, y1, x2, y2, session, speed);
    } else {
        drawInkSegment(ctx, x0, y0, x1, y1, x2, y2, session);
    }
}

export function createStrokeSession(startPt, zoom) {
    const toolDef = TOOLS[state.tool];
    const stroke = strokeStyle();
    const mode = renderMode(toolDef, stroke);
    return {
        last: startPt,
        lastLast: startPt,
        lastTime: performance.now(),
        started: false,
        stroke,
        toolDef,
        mode,
        zoom,
        graphiteColor:
            mode === "graphite"
                ? mixHex(
                      stroke.color,
                      toolDef.graphiteTint || "#636366",
                      toolDef.graphiteMix ?? 0.58
                  )
                : null,
    };
}

export function extendStroke(ctx, session, pt) {
    const minDist = 0.8 / session.zoom;
    if (dist(session.last, pt) < minDist) return;

    const now = performance.now();
    const dt = Math.max(now - session.lastTime, 1);
    const speed = dist(session.last, pt) / dt;
    session.lastTime = now;

    const mid = {
        x: (session.last.x + pt.x) / 2,
        y: (session.last.y + pt.y) / 2,
    };

    if (session.started) {
        drawSegment(
            ctx,
            session.lastLast.x,
            session.lastLast.y,
            session.last.x,
            session.last.y,
            mid.x,
            mid.y,
            session,
            speed
        );
        session.lastLast = session.last;
    } else {
        session.started = true;
        session.lastLast = session.last;
    }

    session.last = pt;
}

export function finishStroke(ctx, session) {
    if (!session.started) {
        const x = session.last.x;
        const y = session.last.y;
        const dotWidth = session.stroke.width / session.zoom;

        if (session.mode === "graphite") {
            drawGraphiteSegment(ctx, x, y, x, y, x, y, session, 0);
        } else {
            ctx.beginPath();
            ctx.arc(x, y, Math.max(dotWidth * 0.35, 0.6 / session.zoom), 0, Math.PI * 2);
            applySessionContext(ctx, session);
            ctx.fillStyle = session.stroke.color;
            ctx.globalAlpha = session.stroke.alpha;
            ctx.fill();
            resetContext(ctx);
        }
        return;
    }

    drawSegment(
        ctx,
        session.lastLast.x,
        session.lastLast.y,
        session.last.x,
        session.last.y,
        session.last.x,
        session.last.y,
        session,
        0
    );
    resetContext(ctx);
}
