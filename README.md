# テトリス (Tetris)

A classic Tetris game implemented in JavaScript with HTML5 Canvas.

## Features

- ✅ Classic Tetris gameplay with all 7 tetromino pieces
- ✅ Piece rotation and collision detection
- ✅ Line clearing and scoring system
- ✅ Progressive difficulty (speed increases with level)
- ✅ Next piece preview
- ✅ Game over screen with restart functionality
- ✅ Japanese UI labels
- ✅ Keyboard controls

## How to Play

1. Open `index.html` in a web browser
2. Use the following controls:
   - **← →** - Move piece left/right
   - **↓** - Soft drop (faster descent)
   - **↑** - Rotate piece
   - **Space** - Hard drop (instant drop)
   - **P** - Pause/Resume game

## Scoring

- **Single line**: 40 × level
- **Double line**: 100 × level  
- **Triple line**: 300 × level
- **Tetris (4 lines)**: 1200 × level
- **Hard drop**: 2 points per cell

## Game Mechanics

- **Level progression**: Every 10 lines cleared increases the level
- **Speed**: Drop interval decreases by 50ms per level (minimum 50ms)
- **Board size**: 10 × 20 cells
- **Piece colors**: Each tetromino has a unique color

## Files

- `index.html` - Main HTML file with game interface
- `tetris.js` - Complete game logic and mechanics
- `README.md` - This documentation file

## Implementation Details

The game is implemented using:
- **HTML5 Canvas** for rendering
- **JavaScript** for game logic
- **CSS** for styling and layout
- **No external dependencies** - runs in any modern web browser

Enjoy playing テトリス!