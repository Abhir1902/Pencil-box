import { setDrawColor } from "./state.js";

const QUADRANT_COLORS = {
    pink: "#f172b2",
    purple: "#9400D3",
    green: "#5cf05c",
    cyan: "#6495ED",
};

export function initColorWheel() {
    Object.entries(QUADRANT_COLORS).forEach(([id, color]) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("click", (e) => {
            e.stopPropagation();
            el.classList.toggle("flipped");
            setDrawColor(color);
        });
    });
}
