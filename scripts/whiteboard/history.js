// Snapshot-based undo/redo history for the whiteboard canvas.
const MAX_UNDO = 25;
let undoStack = [];
let redoStack = [];

export function getHistoryState() {
    return { undoStack: [...undoStack], redoStack: [...redoStack] };
}

export function setHistoryState({ undoStack: u = [], redoStack: r = [] }) {
    undoStack = u;
    redoStack = r;
}

export function clearHistory() {
    undoStack = [];
    redoStack = [];
}

export function pushSnapshot(context, canvas) {
    undoStack.push(context.getImageData(0, 0, canvas.width, canvas.height));
    if (undoStack.length > MAX_UNDO) undoStack.shift();
    redoStack = [];
}

export function clearScreen(context, canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    clearHistory();
}

function blank(context, canvas) {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

export function undo(context, canvas) {
    if (undoStack.length === 0) return;
    redoStack.push(undoStack.pop());
    if (undoStack.length === 0) {
        blank(context, canvas);
    } else {
        context.putImageData(undoStack[undoStack.length - 1], 0, 0);
    }
}

export function redo(context, canvas) {
    if (redoStack.length === 0) return;
    const snapshot = redoStack.pop();
    undoStack.push(snapshot);
    context.putImageData(snapshot, 0, 0);
}
