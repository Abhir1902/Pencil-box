// Whiteboard entry point: wires all modules to the DOM.
import { canvasWrap, canvas, context, initCanvas, setOnCanvasChange } from "./canvas.js";
import { clearScreen, undo, redo } from "./history.js";
import { initTools } from "./tools.js";
import { toggleTheme, initTheme } from "./theme.js";
import { toggleBoard, showLanding, isBoardVisible, restoreSessionView } from "./ui.js";
import { initTabs, onCanvasChange } from "./tabs.js";
import { initLanding, goHome as scrollLandingHome } from "./landing.js";
import { initProductMedia } from "./media.js";
import { initColorWheel } from "./colorwheel.js";

initCanvas();
initTools();
initTabs();
setOnCanvasChange(onCanvasChange);
initTheme();
initLanding();
initProductMedia();
initColorWheel();
restoreSessionView();

function openBoard() {
    if (!canvasWrap.classList.contains("board-visible")) {
        toggleBoard();
    }
}

function goHome() {
    if (isBoardVisible()) {
        showLanding();
    } else {
        scrollLandingHome();
    }
}

document.getElementById("toggle-board").addEventListener("click", () => {
    if (isBoardVisible()) showLanding();
    else openBoard();
});
document.getElementById("brand-home")?.addEventListener("click", goHome);
document.getElementById("landing-home")?.addEventListener("click", goHome);
document.getElementById("start-creating").addEventListener("click", openBoard);
document.getElementById("start-creating-hero")?.addEventListener("click", openBoard);
document.querySelectorAll(".start-board-btn").forEach((btn) => {
    btn.addEventListener("click", openBoard);
});

document.getElementById("Z").addEventListener("click", toggleTheme);
document
    .getElementById("U")
    .addEventListener("click", () => undo(context, canvas));
document
    .getElementById("R")
    .addEventListener("click", () => redo(context, canvas));
document
    .getElementById("B")
    .addEventListener("click", () => {
        clearScreen(context, canvas);
        onCanvasChange();
    });
