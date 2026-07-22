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

## Checklist Evidence
This section maps the implemented checklist topics to concrete files.

- Canvas game setup and start flow: [index.html](index.html), [main.js](main.js)
- OOP game architecture and world handling: [world.class.js](world.class.js), [level.class.js](level.class.js), [drawable-object.class.js](drawable-object.class.js), [moveble-object.class.js](moveble-object.class.js)
- Character and enemy behavior: [character.class.js](character.class.js), [chicken.class.js](chicken.class.js), [small-chicken.class.js](small-chicken.class.js), [endboss.class.js](endboss.class.js)
- Throwable mechanics and collisions: [throwable-object.class.js](throwable-object.class.js), [salsa-bottle.class.js](salsa-bottle.class.js), [world.class.js](world.class.js)
- HUD and game state UI: [statusbar.class.js](statusbar.class.js), [index.html](index.html), [style.css](style.css)
- Audio and mute handling: [audio.js](audio.js), [main.js](main.js)
- Keyboard and touch input: [keyboard.class.js](keyboard.class.js), [input.js](input.js), [main.js](main.js)
- Mobile responsive behavior and portrait warning: [style.css](style.css), [index.html](index.html), [main.js](main.js)
- Level configuration: [levels.js](levels.js), [level.class.js](level.class.js)
- Idle behavior support: [js/idle-timer.js](js/idle-timer.js)

## Review Notes
- Restart and back-to-menu actions are handled in JavaScript without page reload.
- Win and game-over overlays are shown through game state callbacks.
- Touch controls are grouped for left movement and right actions.

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

## Live Demo
- https://sinan-kartal.developerakademie.net/El_Pollo_Loco/

## GitHub Remote
Repository URL:
- https://github.com/SinanKartal58/El-Pollo-Loco.git

## Notes
- This project is a learning project from Developer Akademie.
- Audio is currently implemented in JavaScript (synth-style), without external audio files.
