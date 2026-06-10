import {
    setTool,
    setDrawColor,
    setDrawWidth,
    setPointerMode,
    isPointerMode,
    state,
    strokeStyle,
    getToolWidthRange,
    getActiveStrokeColor,
} from "./state.js";
import { updateCanvasCursor, stopPanning } from "./canvas.js";

const pointerBtn = () => document.getElementById("pointer-btn");
const penButtons = () => [...document.querySelectorAll(".pen-tool")];

let lastPenBtn = null;

function select(elements, target) {
    elements.forEach((el) => el.classList.remove("selected"));
    target.classList.add("selected");
}

function updateWidthIcon(width) {
    const dot = document.getElementById("width-dot");
    const slider = document.getElementById("myinput");
    if (!dot || !slider) return;
    const min = Number(slider.min);
    const max = Number(slider.max);
    const minR = 1.5;
    const maxR = 7;
    const t = max === min ? 1 : (Number(width) - min) / (max - min);
    const r = minR + t * (maxR - minR);
    dot.setAttribute("r", r.toFixed(2));
}

function updateSliderTrack(width) {
    const slider = document.getElementById("myinput");
    if (!slider) return;
    const min = Number(slider.min);
    const max = Number(slider.max);
    const pct = max === min ? 100 : ((Number(width) - min) / (max - min)) * 100;
    slider.style.setProperty("--pct", `${pct}%`);
}

function updateTrianglePreview(width) {
    const triangle = document.getElementById("size-preview-triangle");
    const line = document.getElementById("size-preview-line");
    const slider = document.getElementById("myinput");
    if (!triangle || !slider) return;

    const min = Number(slider.min);
    const max = Number(slider.max);
    const t = max === min ? 1 : (Number(width) - min) / (max - min);
    const lengthPct = 12 + t * 88;
    const halfHPct = 3 + t * 47;
    const stroke = strokeStyle();
    triangle.style.clipPath = `polygon(0% 50%, ${lengthPct}% ${50 - halfHPct}%, ${lengthPct}% ${50 + halfHPct}%)`;
    triangle.style.background =
        state.tool === "eraser" ? "#d1d1d6" : getActiveStrokeColor();
    triangle.style.opacity =
        state.tool === "eraser" ? "1" : String(stroke.alpha);

    if (line) {
        line.style.left = `${lengthPct}%`;
        line.style.height = `${2 * halfHPct}%`;
    }
}

function updateSizePreview(width) {
    const valueEl = document.getElementById("size-value");
    if (valueEl) valueEl.textContent = width;
    updateTrianglePreview(width);
}

function applyToolWidth(tool) {
    const { min, max, default: def } = getToolWidthRange(tool);
    const slider = document.getElementById("myinput");
    slider.min = min;
    slider.max = max;
    slider.value = def;
    setDrawWidth(def);
    updateWidthIcon(def);
    updateSliderTrack(def);
}

function selectPen(btn) {
    if (!btn) return;
    const tool = btn.dataset.tool;
    const changed = tool !== state.tool;

    lastPenBtn = btn;
    select(penButtons(), btn);

    if (!changed) return;

    setTool(tool);
    applyToolWidth(tool);
    updateSizePreview(state.baseWidth);
}

function syncPenVisuals(pointerActive) {
    penButtons().forEach((btn) => {
        btn.classList.toggle("disabled", pointerActive);
        btn.removeAttribute("disabled");
    });
}

export function activateDrawMode(penBtn) {
    const btn = penBtn || lastPenBtn || penButtons()[0];
    const wasPointer = isPointerMode();

    if (wasPointer) {
        setPointerMode(false);
        stopPanning();
        const ptr = pointerBtn();
        if (ptr) {
            ptr.classList.remove("selected");
            ptr.setAttribute("aria-pressed", "false");
        }
        syncPenVisuals(false);
        updateCanvasCursor();
    }

    selectPen(btn);
}

export function activatePointerMode() {
    setPointerMode(true);
    stopPanning();

    const ptr = pointerBtn();
    if (ptr) {
        ptr.classList.add("selected");
        ptr.setAttribute("aria-pressed", "true");
    }

    penButtons().forEach((btn) => btn.classList.remove("selected"));
    syncPenVisuals(true);
    updateCanvasCursor();
}

function initPenTooltips() {
    let tip = document.getElementById("pen-tooltip");
    if (!tip) {
        tip = document.createElement("div");
        tip.id = "pen-tooltip";
        tip.hidden = true;
        document.body.appendChild(tip);
    }

    penButtons().forEach((btn) => {
        btn.addEventListener("mouseenter", () => {
            const rect = btn.getBoundingClientRect();
            tip.textContent = btn.dataset.name;
            tip.hidden = false;
            tip.style.left = `${rect.left + rect.width / 2}px`;
            tip.style.top = `${rect.top - 8}px`;
        });
        btn.addEventListener("mouseleave", () => {
            tip.hidden = true;
        });
    });
}

export function initTools() {
    const pens = penButtons();
    lastPenBtn = pens.find((btn) => btn.classList.contains("selected")) || pens[0];

    initPenTooltips();

    pointerBtn()?.addEventListener("click", (e) => {
        e.stopPropagation();
        if (isPointerMode()) activateDrawMode(lastPenBtn);
        else activatePointerMode();
    });

    pens.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            activateDrawMode(btn);
        });
    });

    const sizePopover = document.getElementById("size-popover");
    const widthBtn = document.getElementById("width-btn");
    const slider = document.getElementById("myinput");

    widthBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const opening = sizePopover.hidden;
        sizePopover.hidden = !opening;
        widthBtn.classList.toggle("active", opening);
        if (opening) {
            requestAnimationFrame(() => updateSizePreview(slider.value));
        }
    });
    sizePopover.addEventListener("click", (e) => e.stopPropagation());
    document.addEventListener("click", () => {
        sizePopover.hidden = true;
        widthBtn.classList.remove("active");
    });

    const swatches = [...document.querySelectorAll(".swatch[data-color]")];
    swatches.forEach((swatch) => {
        swatch.addEventListener("click", () => {
            select([...document.querySelectorAll(".swatch")], swatch);
            setDrawColor(swatch.dataset.color);
            updateSizePreview(slider.value);
        });
    });

    const picker = document.getElementById("grey1");
    picker.addEventListener("input", (e) => {
        select([...document.querySelectorAll(".swatch")], picker.closest(".swatch"));
        setDrawColor(e.target.value);
        updateSizePreview(slider.value);
    });

    slider.addEventListener("input", (e) => {
        setDrawWidth(e.target.value);
        updateWidthIcon(e.target.value);
        updateSliderTrack(e.target.value);
        updateSizePreview(e.target.value);
    });

    setTool(lastPenBtn.dataset.tool);
    applyToolWidth(lastPenBtn.dataset.tool);
    select(penButtons(), lastPenBtn);
}
