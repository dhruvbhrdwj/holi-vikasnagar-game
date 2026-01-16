// Main game entry point

import * as THREE from 'three';
import { scene, createRenderer, applyTextures } from './scene.js';
import { loadAllTextures } from './textures.js';
import { 
  camera, 
  handleKeyDown, 
  handleKeyUp, 
  handleMouseMove, 
  updateCamera,
  handleResize,
  resetCamera,
  setCameraHeight 
} from './camera.js';
import { shoot, updateSplashes, clearSplashes } from './waterGun.js';
import { 
  getTargets, 
  updateTargets, 
  registerHit, 
  clearTargets,
  resetSpawnTimer 
} from './targets.js';
import { 
  gameState,
  setCallbacks as setGameCallbacks,
  startGame,
  updateGameState,
  addScore,
  resetGameState,
  setCurrentCousin 
} from './gameState.js';
import { 
  cousins,
  getCousin,
  canShoot,
  useAmmo,
  updateReload,
  resetAmmo,
  switchCousin,
  triggerReload,
  setAmmoCallbacks,
  getCurrentAmmo 
} from './cousins.js';
import { 
  initUI,
  updateScore,
  updateTimer,
  updateAmmo,
  updateCousinSelector,
  showStartScreen,
  hideStartScreen,
  showGameOver,
  hideGameOver,
  showReloadIndicator,
  hideReloadIndicator,
  flashScreen 
} from './ui.js';
import { 
  saveHighScore, 
  getHighScore 
} from './highScores.js';
import {
  initAudio,
  playHitSound,
  playDestroySound,
  playShootSound,
  playReloadSound
} from './sounds.js';

// Game variables
let renderer;
let clock;
let currentCousinIndex = 0;
let isPointerLocked = false;

// Initialize the game
function init() {
  // Get canvas
  const canvas = document.getElementById('game-canvas');
  
  // Create renderer
  renderer = createRenderer(canvas);
  
  // Create clock for delta time
  clock = new THREE.Clock();
  
  // Set up game state callbacks
  setGameCallbacks({
    onScoreChange: updateScore,
    onTimeChange: updateTimer,
    onGameOver: handleGameOver
  });
  
  // Set up ammo callbacks
  setAmmoCallbacks({
    onAmmoChange: updateAmmo,
    onReloadStart: showReloadIndicator,
    onReloadComplete: () => hideReloadIndicator(getCurrentAmmo())
  });
  
  // Initialize UI
  initUI({
    onStartGame: handleStartGame,
    onRestartGame: handleRestartGame,
    onCousinSelect: handleCousinSelect
  });
  
  // Set up event listeners
  setupEventListeners(canvas);
  
  // Show start screen
  showStartScreen();
  
  // Initial UI update
  updateCousinSelector(currentCousinIndex);
  updateAmmo(getCousin(currentCousinIndex).maxAmmo);
  
  // Load textures in background
  loadAllTextures().then(textures => {
    applyTextures(textures);
    console.log('All textures loaded');
  });
  
  // Start animation loop
  animate();
}

// Set up event listeners
function setupEventListeners(canvas) {
  // Keyboard events
  document.addEventListener('keydown', (e) => {
    // Handle movement keys
    handleKeyDown(e);
    
    // Handle cousin selection (1-4 keys)
    if (gameState.isRunning && !gameState.isGameOver) {
      if (e.code === 'Digit1' || e.code === 'Numpad1') {
        handleCousinSelect(0);
      } else if (e.code === 'Digit2' || e.code === 'Numpad2') {
        handleCousinSelect(1);
      } else if (e.code === 'Digit3' || e.code === 'Numpad3') {
        handleCousinSelect(2);
      } else if (e.code === 'Digit4' || e.code === 'Numpad4') {
        handleCousinSelect(3);
      } else if (e.code === 'KeyR') {
        // Manual reload
        triggerReload(currentCousinIndex);
        playReloadSound();
      }
    }
  });
  
  document.addEventListener('keyup', handleKeyUp);
  
  // Mouse movement for camera
  document.addEventListener('mousemove', handleMouseMove);
  
  // Mouse click for shooting
  document.addEventListener('mousedown', (e) => {
    if (e.button === 0 && gameState.isRunning && !gameState.isGameOver) {
      handleShoot();
    }
  });
  
  // Pointer lock for mouse look
  canvas.addEventListener('click', () => {
    if (gameState.isRunning && !gameState.isGameOver) {
      canvas.requestPointerLock();
    }
  });
  
  document.addEventListener('pointerlockchange', () => {
    isPointerLocked = document.pointerLockElement !== null;
  });
  
  // Window resize
  window.addEventListener('resize', () => {
    handleResize();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Handle shooting
function handleShoot() {
  if (!canShoot(currentCousinIndex)) return;
  
  // Use ammo
  if (!useAmmo(currentCousinIndex)) return;
  
  // Flash effect
  flashScreen();
  
  // Play shoot sound
  playShootSound();
  
  // Shoot and check for hits
  const result = shoot(getTargets(), (target) => {
    // Target was hit
    const hitResult = registerHit(target);
    
    if (hitResult) {
      addScore(hitResult.points);
      
      if (hitResult.destroyed) {
        // Bonus for destroying target
        addScore(hitResult.points);
        // Play destroy sound
        playDestroySound();
      } else {
        // Play hit sound
        playHitSound();
      }
    }
  });
}

// Handle game start
function handleStartGame() {
  // Initialize audio on first user interaction
  initAudio();
  
  hideStartScreen();
  hideGameOver();
  
  // Reset everything
  resetGameState();
  const cousin = getCousin(currentCousinIndex);
  resetCamera(cousin.height);
  clearTargets();
  clearSplashes();
  resetSpawnTimer();
  resetAmmo(currentCousinIndex);
  
  // Start the game
  startGame();
  
  // Request pointer lock
  const canvas = document.getElementById('game-canvas');
  canvas.requestPointerLock();
}

// Handle game restart
function handleRestartGame() {
  handleStartGame();
}

// Handle game over
function handleGameOver(score, cousinIndex) {
  // Exit pointer lock
  document.exitPointerLock();
  
  // Save high score
  const isNew = saveHighScore(cousinIndex, score);
  const highScore = getHighScore(cousinIndex);
  
  // Show game over screen
  showGameOver(score, cousinIndex, highScore, isNew);
}

// Handle cousin selection
function handleCousinSelect(index) {
  if (index === currentCousinIndex) return;
  
  const oldIndex = currentCousinIndex;
  currentCousinIndex = index;
  
  // Switch cousin (resets ammo)
  const newCousin = switchCousin(index, oldIndex);
  
  // Update camera height based on new cousin
  setCameraHeight(newCousin.height);
  
  // Update game state
  setCurrentCousin(index);
  
  // Update UI
  updateCousinSelector(index);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  const deltaTime = clock.getDelta();
  
  // Update camera
  updateCamera(deltaTime);
  
  // Update game state
  if (gameState.isRunning && !gameState.isGameOver) {
    updateGameState(deltaTime);
    updateTargets(deltaTime);
    updateReload(deltaTime, currentCousinIndex);
  }
  
  // Update visual effects
  updateSplashes(deltaTime);
  
  // Render
  renderer.render(scene, camera);
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

