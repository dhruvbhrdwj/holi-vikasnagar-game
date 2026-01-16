// Game state management

const GAME_DURATION = 60; // seconds

// Game state object
export const gameState = {
  score: 0,
  timeRemaining: GAME_DURATION,
  isRunning: false,
  isGameOver: false,
  isPaused: false,
  currentCousin: 0 // Index into cousins array
};

// Callbacks
let onScoreChange = null;
let onTimeChange = null;
let onGameOver = null;

// Set callbacks
export function setCallbacks(callbacks) {
  onScoreChange = callbacks.onScoreChange || null;
  onTimeChange = callbacks.onTimeChange || null;
  onGameOver = callbacks.onGameOver || null;
}

// Start the game
export function startGame() {
  gameState.score = 0;
  gameState.timeRemaining = GAME_DURATION;
  gameState.isRunning = true;
  gameState.isGameOver = false;
  gameState.isPaused = false;
  
  if (onScoreChange) onScoreChange(gameState.score);
  if (onTimeChange) onTimeChange(gameState.timeRemaining);
}

// Update game state (called each frame)
export function updateGameState(deltaTime) {
  if (!gameState.isRunning || gameState.isPaused || gameState.isGameOver) {
    return;
  }
  
  // Update timer
  gameState.timeRemaining -= deltaTime;
  
  if (onTimeChange) {
    onTimeChange(Math.ceil(gameState.timeRemaining));
  }
  
  // Check for game over
  if (gameState.timeRemaining <= 0) {
    gameState.timeRemaining = 0;
    endGame();
  }
}

// Add score
export function addScore(points) {
  if (!gameState.isRunning || gameState.isGameOver) return;
  
  gameState.score += points;
  
  if (onScoreChange) {
    onScoreChange(gameState.score);
  }
}

// End the game
export function endGame() {
  gameState.isRunning = false;
  gameState.isGameOver = true;
  
  if (onGameOver) {
    onGameOver(gameState.score, gameState.currentCousin);
  }
}

// Pause the game
export function pauseGame() {
  gameState.isPaused = true;
}

// Resume the game
export function resumeGame() {
  gameState.isPaused = false;
}

// Reset game state
export function resetGameState() {
  gameState.score = 0;
  gameState.timeRemaining = GAME_DURATION;
  gameState.isRunning = false;
  gameState.isGameOver = false;
  gameState.isPaused = false;
}

// Get current score
export function getScore() {
  return gameState.score;
}

// Get time remaining
export function getTimeRemaining() {
  return Math.ceil(gameState.timeRemaining);
}

// Set current cousin
export function setCurrentCousin(index) {
  gameState.currentCousin = index;
}

// Get current cousin index
export function getCurrentCousin() {
  return gameState.currentCousin;
}

// Export game duration constant
export { GAME_DURATION };

