// High score management using localStorage

const STORAGE_KEY = 'vikasnagar_holi_highscores';

// Get all high scores
export function getHighScores() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error reading high scores:', e);
  }
  
  // Default scores for each cousin
  return {
    0: 0,  // Raju
    1: 0,  // Bunty
    2: 0,  // Pinky
    3: 0   // Guddu
  };
}

// Get high score for a specific cousin
export function getHighScore(cousinIndex) {
  const scores = getHighScores();
  return scores[cousinIndex] || 0;
}

// Save high score for a cousin
export function saveHighScore(cousinIndex, score) {
  const scores = getHighScores();
  const currentHigh = scores[cousinIndex] || 0;
  
  if (score > currentHigh) {
    scores[cousinIndex] = score;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
      return true; // New high score!
    } catch (e) {
      console.error('Error saving high score:', e);
    }
  }
  
  return false; // Not a new high score
}

// Check if score is a new high score (without saving)
export function isNewHighScore(cousinIndex, score) {
  const currentHigh = getHighScore(cousinIndex);
  return score > currentHigh;
}

// Reset all high scores
export function resetAllHighScores() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Error resetting high scores:', e);
  }
}

// Reset high score for a specific cousin
export function resetHighScore(cousinIndex) {
  const scores = getHighScores();
  scores[cousinIndex] = 0;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch (e) {
    console.error('Error resetting high score:', e);
  }
}

// Get the overall best score across all cousins
export function getBestOverallScore() {
  const scores = getHighScores();
  let best = 0;
  let bestCousin = 0;
  
  for (const [cousin, score] of Object.entries(scores)) {
    if (score > best) {
      best = score;
      bestCousin = parseInt(cousin);
    }
  }
  
  return { score: best, cousinIndex: bestCousin };
}

// Get leaderboard (all cousins sorted by score)
export function getLeaderboard() {
  const scores = getHighScores();
  const leaderboard = [];
  
  for (const [cousin, score] of Object.entries(scores)) {
    leaderboard.push({
      cousinIndex: parseInt(cousin),
      score: score
    });
  }
  
  // Sort by score descending
  leaderboard.sort((a, b) => b.score - a.score);
  
  return leaderboard;
}

