<p align="left">
  <a href="https://pencilbox.netlify.app/">
    <img src="media/readme/readme-heading.png" alt="Pencil Box" height="52">
  </a>
</p>

A browser-based whiteboard with an infinite graph-paper canvas. No accounts, no install — draw locally, switch tabs, and pick up where you left off.

**[Try it live → pencilbox.netlify.app](https://pencilbox.netlify.app/)**

## Demos

### Zero friction
Open the board and start drawing immediately.

![Zero friction demo](media/readme/zero-friction.gif)

### Strokes don't vanish
Your work stays saved in the browser.

![Strokes don't vanish demo](media/readme/strokes-dont-vanish.gif)

### Eight pen types
Pen, pencil, marker, crayon, brush, highlighter, eraser, and lasso.

![Eight pen types demo](media/readme/eight-pen-types.gif)

### Dark mode
Green-tinted theme for late-night sketching.

![Dark mode demo](media/readme/dark-mode.gif)

### Color wheel
Swatches and a custom color picker.

![Color wheel demo](media/readme/color-wheel.gif)

### Draw & iterate
Undo, redo, and refine your ideas.

![Draw and iterate demo](media/readme/draw-iterate.gif)

### Think in tabs
Chrome-style tabs for multiple boards at once.

![Think in tabs demo](media/readme/think-in-tabs.gif)

> Source clips live in [`media/`](media/) as `.webm` files for the landing page. README uses `.gif` previews because GitHub does not embed repo-hosted `.webm` videos.

## Run locally

```bash
git clone https://github.com/Abhir1902/Pencil-box.git
cd Pencil-box
python3 -m http.server 8080
```

Open `http://localhost:8080` — a local server is needed because the app uses ES modules.

## Tech

HTML · CSS · vanilla JavaScript · `localStorage` · hosted on [Netlify](https://pencilbox.netlify.app/)
