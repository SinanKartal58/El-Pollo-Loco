# El Pollo Loco

A browser-based 2D jump-and-run game built with vanilla JavaScript and HTML5 Canvas.

## Features
- Start screen with controls info and fullscreen button
- Character movement, jump, throw mechanic
- Enemies: normal chicken, small chicken, endboss
- Status bars: health, coins, bottles, endboss
- Win and game-over screens with restart/menu actions
- Mobile touch controls for smartphone/tablet
- Portrait warning overlay on mobile

## Controls
### Keyboard
- Move left/right: Arrow Left / Arrow Right
- Jump: Space
- Throw: D

### Mobile
- Left control group: move left/right
- Right control group: jump/throw

## Project Structure
Main entry file:
- `index.html`
- `main.js`

Core game classes:
- `world.class.js`
- `character.class.js`
- `chicken.class.js`
- `small-chicken.class.js`
- `endboss.class.js`
- `throwable-object.class.js`

Level setup:
- `levels.js`
- `level.class.js`

## Run Locally
Because this project uses ES modules, run it via a local web server.

Example with VS Code Live Server:
1. Open the project folder in VS Code
2. Start Live Server on `index.html`

Alternative with Python:
```bash
python -m http.server 5500
```
Then open `http://localhost:5500`.

## GitHub Remote
Repository URL:
- https://github.com/SinanKartal58/El-Pollo-Loco.git

## Notes
- This project is a learning project from Developer Akademie.
- Audio is currently implemented in JavaScript (synth-style), without external audio files.
