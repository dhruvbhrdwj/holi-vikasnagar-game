# 🎨 Vikasnagar Holi Shooter

A 3D arcade shooter game built with Three.js where you play as one of four cousins spraying colored water at targets from your verandah during Holi celebrations!

## 🎮 About

Vikasnagar Holi Shooter is an immersive 3D first-person shooter game that captures the spirit of Holi festival. You take control of one of four cousins, each with unique abilities, and spray colored water at targets appearing in the courtyard below. Score points, beat high scores, and celebrate Holi!

## ✨ Features

- **4 Playable Characters**: Choose from Dhruv, Raghav, Keshav, or Puru - each with unique stats
- **3D Graphics**: Built with Three.js for immersive gameplay
- **Dynamic Targets**: Targets spawn and move around the courtyard
- **Ammo System**: Limited ammo with reload mechanics
- **High Score Tracking**: Track your best scores per cousin
- **Sound Effects**: Audio feedback for shooting, hits, and reloads
- **Timer-Based Gameplay**: 60-second rounds to maximize your score
- **Smooth Controls**: WASD movement, mouse aiming, and jumping

## 🎯 Gameplay

### Objective
Shoot as many targets as possible within 60 seconds. Each hit scores points, and destroying targets gives bonus points. Try to beat your high score!

### Cousins & Their Stats

| Cousin | Fire Rate | Max Ammo | Reload Time | Height | Description |
|--------|-----------|----------|-------------|--------|-------------|
| **Dhruv** | 3/s | 30 | 2s | 5.5 | Balanced - good for beginners |
| **Raghav** | 6/s | 20 | 2.5s | 6.0 | Fast fire rate, tall (easy aim) |
| **Keshav** | 2/s | 40 | 1.5s | 5.0 | Lots of ammo, short (jump more) |
| **Puru** | 5/s | 15 | 3s | 5.8 | Rapid fire, slightly tall |

## 🎮 Controls

| Action | Control |
|--------|---------|
| **Aim** | Mouse movement |
| **Shoot** | Left mouse click |
| **Move** | W/A/S/D keys |
| **Jump** | Spacebar |
| **Select Cousin** | Number keys 1-4 |
| **Reload** | R key |

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vikasnagar_game
```

2. Install dependencies:
```bash
npm install
```

### Running the Game

Start the development server:
```bash
npm start
# or
npm run dev
```

The game will open automatically in your browser at `http://localhost:3000`

### Building for Production

Create an optimized production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

The built files will be in the `dist/` directory.

## 📁 Project Structure

```
vikasnagar_game/
├── index.html          # Main HTML file
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
├── public/
│   └── textures/       # Game textures
└── src/
    ├── main.js         # Game entry point
    ├── scene.js        # 3D scene setup
    ├── camera.js       # Camera controls
    ├── waterGun.js     # Shooting mechanics
    ├── targets.js      # Target spawning and management
    ├── cousins.js      # Cousin definitions and stats
    ├── gameState.js    # Game state management
    ├── highScores.js   # High score tracking
    ├── ui.js           # UI management
    ├── sounds.js       # Audio system
    ├── textures.js     # Texture loading
    └── styles.css      # Game styles
```

## 🛠️ Tech Stack

- **Three.js** (^0.160.0) - 3D graphics library
- **Vite** (^5.0.0) - Build tool and dev server
- **Vanilla JavaScript** - ES6 modules

## 🎨 Game Mechanics

- **Scoring**: Points are awarded for hitting targets. Destroying targets gives bonus points.
- **Ammo**: Each cousin has limited ammo. Reload manually with R or automatically when empty.
- **Timer**: 60-second rounds. Game ends when time runs out.
- **High Scores**: Best scores are saved per cousin using browser localStorage.
- **Targets**: Targets spawn dynamically and move around the courtyard. They can be hit multiple times before being destroyed.

## 📝 Development

The game uses ES6 modules and follows a modular architecture:
- Each system (camera, shooting, targets, etc.) is in its own module
- Game state is centralized in `gameState.js`
- UI updates are handled through callbacks
- Audio is initialized on first user interaction (browser requirement)

## 🎉 Enjoy the Game!

Have fun playing Vikasnagar Holi Shooter! Try different cousins to find your favorite playstyle and see if you can beat the high scores!
> Made with Claude Code + Cursor by Dhruv

---

**Happy Holi! 🎨**

