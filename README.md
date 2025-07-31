# Retro Mac Minesweeper 🎮

A nostalgic Minesweeper game with the classic Mac OS 9 aesthetic! Experience the timeless puzzle game with authentic retro styling and smooth gameplay.

![Retro Mac Minesweeper](https://img.shields.io/badge/Retro-Mac%20OS%209-blue?style=for-the-badge&logo=apple)

## ✨ Features

- **Authentic Retro Design**: Classic Mac OS 9 window styling with title bar, menu bar, and vintage buttons
- **Three Difficulty Levels**: Beginner (9x9, 10 mines), Intermediate (16x16, 40 mines), Expert (16x30, 99 mines)
- **Real-time Timer**: Track your solving time with a classic digital display
- **Mine Counter**: Keep track of remaining mines
- **Right-click Flagging**: Right-click to place/remove flags on suspected mine locations
- **Responsive Design**: Works on desktop and mobile devices
- **Win/Lose Animations**: Visual feedback with emoji expressions and animations
- **No Dependencies**: Pure HTML, CSS, and JavaScript - no frameworks required!

## 🎯 How to Play

1. **Left-click** to reveal a cell
2. **Right-click** to place or remove a flag on suspected mine locations
3. **Numbers** indicate how many mines are adjacent to that cell
4. **Clear all non-mine cells** to win the game
5. **Avoid clicking on mines** - that's game over!

### Game Rules

- The first click is always safe
- Numbers show how many mines are in the 8 surrounding cells
- Use flags to mark suspected mine locations
- Reveal all safe cells to win
- Click on a mine to lose

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software required!

### Installation

1. **Clone or Download** the repository:
   ```bash
   git clone https://github.com/yourusername/retro-minesweeper.git
   cd retro-minesweeper
   ```

2. **Open the Game**:
   - Double-click `index.html` to open in your browser
   - Or drag `index.html` into your browser window
   - Or use a local server: `python -m http.server 8000` then visit `http://localhost:8000`

3. **Start Playing**:
   - Choose your difficulty level
   - Click anywhere on the board to begin
   - Have fun!

## 🎨 Design Features

### Retro Mac OS 9 Styling
- **Title Bar**: Classic red, yellow, green window buttons
- **Menu Bar**: Authentic menu styling
- **Buttons**: 3D outset/inset button effects
- **Color Scheme**: Vintage gray tones with blue accents
- **Typography**: Chicago font family for authentic feel

### Visual Elements
- **Mine Explosion Animation**: Cells explode when you hit a mine
- **Emoji Expressions**: Smiley face changes based on game state
- **Color-coded Numbers**: Classic Minesweeper number colors
- **Modal Dialogs**: Retro-styled game over screens

## 📱 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## 🛠️ Technical Details

### File Structure
```
retro-minesweeper/
├── index.html          # Main HTML file
├── style.css           # Retro Mac styling
├── script.js           # Game logic
└── README.md           # This file
```

### Technologies Used
- **HTML5**: Semantic structure
- **CSS3**: Retro styling with gradients, animations, and responsive design
- **Vanilla JavaScript**: ES6+ classes and modern DOM manipulation
- **CSS Grid**: For the game board layout

### Key Features Implementation
- **Mine Placement**: Random placement with first-click safety
- **Flood Fill Algorithm**: Reveals connected empty cells
- **Win Detection**: Tracks revealed vs. total safe cells
- **Timer System**: Real-time game duration tracking
- **State Management**: Comprehensive game state handling



*Made with ❤️ for retro gaming enthusiasts* 
