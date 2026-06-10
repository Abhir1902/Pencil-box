// Persists UI session across page reloads (view, theme, scroll).
const STORAGE_KEY = "pencilbox-session";

export function loadSession() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

export function saveSession(partial) {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ ...loadSession(), ...partial })
        );
    } catch {
        /* quota exceeded */
    }
}
