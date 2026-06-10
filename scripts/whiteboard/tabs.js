import { canvas, context, getViewportState, setViewportState } from "./canvas.js";
import { activateDrawMode } from "./tools.js";
import {
    getHistoryState,
    setHistoryState,
    clearHistory,
} from "./history.js";

const STORAGE_KEY = "pencilbox-tabs";
let tabs = [];
let activeTabId = null;

function uid() {
    return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function serializeStacks(stacks) {
    return {
        undo: stacks.undoStack.map((img) => {
            const c = document.createElement("canvas");
            c.width = img.width;
            c.height = img.height;
            c.getContext("2d").putImageData(img, 0, 0);
            return c.toDataURL("image/png");
        }),
        redo: stacks.redoStack.map((img) => {
            const c = document.createElement("canvas");
            c.width = img.width;
            c.height = img.height;
            c.getContext("2d").putImageData(img, 0, 0);
            return c.toDataURL("image/png");
        }),
    };
}

async function deserializeStacks(data, w, h) {
    const load = async (urls) => {
        const results = [];
        for (const url of urls || []) {
            const img = await new Promise((resolve) => {
                const i = new Image();
                i.onload = () => resolve(i);
                i.onerror = () => resolve(null);
                i.src = url;
            });
            if (!img) continue;
            const c = document.createElement("canvas");
            c.width = w;
            c.height = h;
            const ctx = c.getContext("2d");
            ctx.drawImage(img, 0, 0);
            results.push(ctx.getImageData(0, 0, w, h));
        }
        return results;
    };
    return {
        undoStack: await load(data?.undo),
        redoStack: await load(data?.redo),
    };
}

function canvasDataUrl() {
    return canvas.toDataURL("image/png");
}

function loadCanvasFromDataUrl(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve();
        };
        img.onerror = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            resolve();
        };
        img.src = url || "";
    });
}

function blankCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function saveActiveTabState(includeHistory = false) {
    if (!activeTabId) return;
    const tab = tabs.find((t) => t.id === activeTabId);
    if (!tab) return;
    tab.canvasData = canvasDataUrl();
    tab.viewport = getViewportState();
    if (includeHistory) {
        tab.history = serializeStacks(getHistoryState());
    }
}

async function loadTabState(tab) {
    clearHistory();
    if (tab.canvasData) {
        await loadCanvasFromDataUrl(tab.canvasData);
    } else {
        blankCanvas();
    }
    if (tab.history) {
        const stacks = await deserializeStacks(
            tab.history,
            canvas.width,
            canvas.height
        );
        setHistoryState(stacks);
    }
    setViewportState(tab.viewport);
    activateDrawMode();
}

function persistTabs() {
    saveActiveTabState(false);
    const payload = {
        activeTabId,
        tabs: tabs.map(({ id, name, canvasData, viewport }) => ({
            id,
            name,
            canvasData,
            viewport: viewport || null,
        })),
    };
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
        /* quota exceeded — session still works in memory */
    }
}

function renderTabs() {
    const strip = document.getElementById("tab-strip");
    if (!strip) return;

    strip.querySelectorAll(".tab").forEach((el) => el.remove());

    tabs.forEach((tab) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `tab${tab.id === activeTabId ? " active" : ""}`;
        btn.dataset.tabId = tab.id;

        const title = document.createElement("span");
        title.className = "tab-title";
        title.textContent = tab.name;
        title.title = "Double-click to rename";

        const close = document.createElement("span");
        close.className = "tab-close";
        close.textContent = "×";
        close.title = "Close tab";
        close.setAttribute("aria-label", "Close tab");

        btn.appendChild(title);
        if (tabs.length > 1) btn.appendChild(close);
        strip.insertBefore(btn, document.getElementById("new-tab"));

        btn.addEventListener("click", (e) => {
            if (e.target === close) return;
            switchTab(tab.id);
        });
        close.addEventListener("click", (e) => {
            e.stopPropagation();
            closeTab(tab.id);
        });
        title.addEventListener("dblclick", (e) => {
            e.stopPropagation();
            startRename(title, tab);
        });
    });
}

function startRename(titleEl, tab) {
    const input = document.createElement("input");
    input.type = "text";
    input.className = "tab-rename-input";
    input.value = tab.name;
    input.maxLength = 40;
    titleEl.replaceWith(input);
    input.focus();
    input.select();

    const commit = () => {
        tab.name = input.value.trim() || "Untitled";
        renderTabs();
        persistTabs();
    };
    input.addEventListener("blur", commit);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
        if (e.key === "Escape") {
            input.value = tab.name;
            input.blur();
        }
    });
}

export async function switchTab(tabId) {
    if (tabId === activeTabId) return;
    saveActiveTabState(true);
    activeTabId = tabId;
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) await loadTabState(tab);
    renderTabs();
    persistTabs();
}

export async function createTab(name = "Untitled") {
    saveActiveTabState(true);
    const tab = { id: uid(), name, canvasData: null, history: null };
    tabs.push(tab);
    activeTabId = tab.id;
    clearHistory();
    blankCanvas();
    renderTabs();
    persistTabs();
}

export async function closeTab(tabId) {
    if (tabs.length <= 1) return;
    const idx = tabs.findIndex((t) => t.id === tabId);
    if (idx === -1) return;
    tabs.splice(idx, 1);
    if (activeTabId === tabId) {
        activeTabId = tabs[Math.max(0, idx - 1)].id;
        await loadTabState(tabs.find((t) => t.id === activeTabId));
    }
    renderTabs();
    persistTabs();
}

export function initTabs() {
    const strip = document.getElementById("tab-strip");
    const newBtn = document.getElementById("new-tab");
    if (!strip || !newBtn) return;

    strip.hidden = true;
    strip.style.display = "none";

    let restored = false;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const data = JSON.parse(raw);
            if (data.tabs?.length) {
                tabs = data.tabs.map((t) => ({
                    id: t.id || uid(),
                    name: t.name || "Untitled",
                    canvasData: t.canvasData || null,
                    viewport: t.viewport || null,
                    history: null,
                }));
                activeTabId = data.activeTabId || tabs[0].id;
                restored = true;
            }
        }
    } catch {
        /* ignore corrupt storage */
    }

    if (!restored) {
        tabs = [{ id: uid(), name: "Untitled", canvasData: null, history: null }];
        activeTabId = tabs[0].id;
    }

    renderTabs();
    newBtn.addEventListener("click", () => createTab(`Board ${tabs.length + 1}`));

    window.addEventListener("beforeunload", () => {
        saveActiveTabState(true);
        persistTabs();
    });
}

export async function restoreActiveTabCanvas() {
    const tab = tabs.find((t) => t.id === activeTabId);
    if (tab) {
        await loadTabState(tab);
    }
}

let persistTimer = null;

export function onCanvasChange() {
    if (persistTimer) clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
        persistTimer = null;
        saveActiveTabState(false);
        persistTabs();
    }, 600);
}
