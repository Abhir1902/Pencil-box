// Switches between the home screen and the board view.
import { canvasWrap, refreshCanvasSize } from "./canvas.js";
import { restoreActiveTabCanvas } from "./tabs.js";
import { activateDrawMode } from "./tools.js";
import { onLandingShown } from "./landing.js";
import { loadSession, saveSession } from "./session.js";

let boardVisible = false;

export function isBoardVisible() {
    return boardVisible;
}

function applyViewState(visible) {
    boardVisible = visible;
    document.body.classList.toggle("landing-view", !visible);
    document.getElementById("home").style.display = visible ? "none" : "block";
    canvasWrap.style.display = visible ? "block" : "none";
    canvasWrap.classList.toggle("board-visible", visible);
    document.getElementById("toolbar").style.display = visible ? "flex" : "none";

    const titleBar = document.getElementById("title-bar");
    titleBar.classList.toggle("board-active", visible);

    const tabStrip = document.getElementById("tab-strip");
    if (tabStrip) {
        tabStrip.hidden = !visible;
        tabStrip.style.display = visible ? "flex" : "none";
    }

    saveSession({ boardVisible: visible });
}

export async function toggleBoard() {
    const next = !boardVisible;
    applyViewState(next);

    if (next) {
        refreshCanvasSize();
        await restoreActiveTabCanvas();
        activateDrawMode();
        return;
    }

    onLandingShown();
}

export function showLanding() {
    if (!boardVisible) return;
    applyViewState(false);
    onLandingShown();
}

export async function restoreSessionView() {
    const session = loadSession();

    if (session.boardVisible) {
        applyViewState(true);
        refreshCanvasSize();
        await restoreActiveTabCanvas();
        activateDrawMode();
        return;
    }

    if (session.landingScrollY > 0) {
        window.scrollTo(0, session.landingScrollY);
    }
}
