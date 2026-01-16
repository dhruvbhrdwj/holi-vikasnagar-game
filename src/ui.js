// UI management

import { cousins, getCousin } from './cousins.js';

// DOM elements
let scoreElement = null;
let timerElement = null;
let ammoElement = null;
let gameOverElement = null;
let startScreenElement = null;
let finalScoreElement = null;
let highScoreElement = null;
let cousinNameElement = null;
let cousinElements = [];

// Callbacks
let onStartGame = null;
let onRestartGame = null;
let onCousinSelect = null;

// Initialize UI
export function initUI(callbacks) {
  // Get DOM elements
  scoreElement = document.getElementById('score');
  timerElement = document.getElementById('timer');
  ammoElement = document.getElementById('ammo');
  gameOverElement = document.getElementById('game-over');
  startScreenElement = document.getElementById('start-screen');
  finalScoreElement = document.getElementById('final-score');
  highScoreElement = document.getElementById('high-score');
  cousinNameElement = document.getElementById('cousin-name');
  
  // Get cousin selector elements
  const cousinSelector = document.getElementById('cousin-selector');
  if (cousinSelector) {
    cousinElements = Array.from(cousinSelector.querySelectorAll('.cousin'));
  }
  
  // Set callbacks
  onStartGame = callbacks.onStartGame || null;
  onRestartGame = callbacks.onRestartGame || null;
  onCousinSelect = callbacks.onCousinSelect || null;
  
  // Set up event listeners
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (onStartGame) onStartGame();
    });
  }
  
  const restartBtn = document.getElementById('restart-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      if (onRestartGame) onRestartGame();
    });
  }
  
  // Cousin selection via click
  cousinElements.forEach((element, index) => {
    element.addEventListener('click', () => {
      if (onCousinSelect) onCousinSelect(index);
    });
  });
  
  // Initialize cousin display
  updateCousinSelector(0);
}

// Update score display
export function updateScore(score) {
  if (scoreElement) {
    scoreElement.textContent = score;
  }
}

// Update timer display
export function updateTimer(time) {
  if (timerElement) {
    timerElement.textContent = Math.ceil(time);
    
    // Add warning color when time is low
    if (time <= 10) {
      timerElement.style.color = '#ff4757';
    } else {
      timerElement.style.color = '';
    }
  }
}

// Update ammo display
export function updateAmmo(ammo) {
  if (ammoElement) {
    ammoElement.textContent = ammo;
    
    // Add warning color when ammo is low
    if (ammo <= 5) {
      ammoElement.style.color = '#ff4757';
    } else {
      ammoElement.style.color = '';
    }
  }
}

// Update cousin selector
export function updateCousinSelector(activeIndex) {
  cousinElements.forEach((element, index) => {
    if (index === activeIndex) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
  });
}

// Show start screen
export function showStartScreen() {
  if (startScreenElement) {
    startScreenElement.classList.remove('hidden');
  }
  if (gameOverElement) {
    gameOverElement.classList.add('hidden');
  }
}

// Hide start screen
export function hideStartScreen() {
  if (startScreenElement) {
    startScreenElement.classList.add('hidden');
  }
}

// Show game over screen
export function showGameOver(score, cousinIndex, highScore, isNewHighScore) {
  if (gameOverElement) {
    gameOverElement.classList.remove('hidden');
    gameOverElement.style.display = '';  // Remove inline style
  }
  
  if (finalScoreElement) {
    finalScoreElement.textContent = score;
  }
  
  if (highScoreElement) {
    highScoreElement.textContent = highScore;
    if (isNewHighScore) {
      highScoreElement.style.color = '#ffd93d';
      highScoreElement.textContent = highScore + ' (NEW!)';
    } else {
      highScoreElement.style.color = '';
    }
  }
  
  if (cousinNameElement) {
    const cousin = getCousin(cousinIndex);
    cousinNameElement.textContent = cousin.name;
  }
}

// Hide game over screen
export function hideGameOver() {
  if (gameOverElement) {
    gameOverElement.classList.add('hidden');
    gameOverElement.style.display = 'none';  // Also set inline style
  }
}

// Show reload indicator
export function showReloadIndicator(reloadTime) {
  if (ammoElement) {
    ammoElement.textContent = 'RELOADING...';
    ammoElement.style.color = '#ffd93d';
  }
}

// Hide reload indicator
export function hideReloadIndicator(ammo) {
  if (ammoElement) {
    ammoElement.textContent = ammo;
    ammoElement.style.color = '';
  }
}

// Create floating score popup
export function showScorePopup(points, x, y) {
  const popup = document.createElement('div');
  popup.className = 'score-popup';
  popup.textContent = `+${points}`;
  popup.style.cssText = `
    position: absolute;
    left: ${x}px;
    top: ${y}px;
    color: #ffd93d;
    font-size: 24px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    pointer-events: none;
    z-index: 50;
    animation: floatUp 1s ease-out forwards;
  `;
  
  document.getElementById('game-container').appendChild(popup);
  
  // Remove after animation
  setTimeout(() => {
    popup.remove();
  }, 1000);
}

// Add floating animation style
const style = document.createElement('style');
style.textContent = `
  @keyframes floatUp {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(-50px) scale(1.5);
    }
  }
`;
document.head.appendChild(style);

// Flash screen effect
export function flashScreen(color = '#ff6b9d') {
  const flash = document.createElement('div');
  flash.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${color};
    opacity: 0.3;
    pointer-events: none;
    z-index: 200;
    animation: flashFade 0.1s ease-out forwards;
  `;
  
  document.body.appendChild(flash);
  
  setTimeout(() => {
    flash.remove();
  }, 100);
}

// Add flash animation style
const flashStyle = document.createElement('style');
flashStyle.textContent = `
  @keyframes flashFade {
    0% { opacity: 0.3; }
    100% { opacity: 0; }
  }
`;
document.head.appendChild(flashStyle);

