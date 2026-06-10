// Light/green ambience toggle for landing page and title bar.
import { loadSession, saveSession } from "./session.js";

let isDark = false;

function applyTheme(dark) {
    isDark = dark;
    const zButton = document.getElementById("Z");
    const zIcon = zButton?.querySelector(".material-symbols-outlined");
    const titleBar = document.getElementById("title-bar");

    document.body.classList.toggle("theme-dark", isDark);
    titleBar?.classList.toggle("theme-dark", isDark);

    if (zIcon) {
        zIcon.textContent = isDark ? "light_mode" : "dark_mode";
    }
    if (zButton) {
        zButton.title = isDark ? "Switch to light mode" : "Switch to green mode";
        zButton.style.background = "";
        zButton.style.color = "";
    }
}

export function initTheme() {
    applyTheme(Boolean(loadSession().themeDark));

    window.addEventListener("beforeunload", () => {
        saveSession({ themeDark: isDark });
    });
}

export function toggleTheme() {
    applyTheme(!isDark);
    saveSession({ themeDark: isDark });
}
