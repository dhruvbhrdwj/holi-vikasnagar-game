// Cousin definitions with different stats

export const cousins = [
  {
    id: 0,
    name: 'Dhruv',
    fireRate: 3,      // Shots per second
    maxAmmo: 30,      // Ammo capacity
    reloadTime: 2,    // Seconds to reload
    height: 5.5,      // Average height - standard view
    color: '#ff6b9d', // Theme color
    description: 'Balanced - good for beginners'
  },
  {
    id: 1,
    name: 'Raghav',
    fireRate: 6,      // Fast shooter
    maxAmmo: 20,      // Less ammo
    reloadTime: 2.5,
    height: 6.0,      // Tall - easier to shoot over railing
    color: '#ffd93d',
    description: 'Fast fire rate, tall (easy aim)'
  },
  {
    id: 2,
    name: 'Keshav',
    fireRate: 2,      // Slow but powerful
    maxAmmo: 40,      // More ammo
    reloadTime: 1.5,
    height: 5.0,      // Short - needs to jump more
    color: '#6bcb77',
    description: 'Lots of ammo, short (jump more)'
  },
  {
    id: 3,
    name: 'Puru',
    fireRate: 5,      // Very fast
    maxAmmo: 15,      // Limited ammo
    reloadTime: 3,
    height: 5.8,      // Slightly tall
    color: '#4d96ff',
    description: 'Rapid fire, slightly tall'
  }
];

// Current ammo state
const ammoState = {
  currentAmmo: cousins[0].maxAmmo,
  isReloading: false,
  reloadProgress: 0,
  lastShotTime: 0
};

// Callbacks
let onAmmoChange = null;
let onReloadStart = null;
let onReloadComplete = null;

// Set callbacks
export function setAmmoCallbacks(callbacks) {
  onAmmoChange = callbacks.onAmmoChange || null;
  onReloadStart = callbacks.onReloadStart || null;
  onReloadComplete = callbacks.onReloadComplete || null;
}

// Get cousin by index
export function getCousin(index) {
  return cousins[index] || cousins[0];
}

// Get all cousins
export function getAllCousins() {
  return cousins;
}

// Get current ammo
export function getCurrentAmmo() {
  return ammoState.currentAmmo;
}

// Check if can shoot
export function canShoot(cousinIndex) {
  if (ammoState.isReloading) return false;
  if (ammoState.currentAmmo <= 0) return false;
  
  const cousin = getCousin(cousinIndex);
  const now = Date.now();
  const timeSinceLastShot = (now - ammoState.lastShotTime) / 1000;
  const minTimeBetweenShots = 1 / cousin.fireRate;
  
  return timeSinceLastShot >= minTimeBetweenShots;
}

// Use ammo
export function useAmmo(cousinIndex) {
  if (!canShoot(cousinIndex)) return false;
  
  ammoState.currentAmmo--;
  ammoState.lastShotTime = Date.now();
  
  if (onAmmoChange) {
    onAmmoChange(ammoState.currentAmmo);
  }
  
  // Auto-reload if empty
  if (ammoState.currentAmmo <= 0) {
    startReload(cousinIndex);
  }
  
  return true;
}

// Start reload
export function startReload(cousinIndex) {
  if (ammoState.isReloading) return;
  
  const cousin = getCousin(cousinIndex);
  
  // Don't reload if already full
  if (ammoState.currentAmmo >= cousin.maxAmmo) return;
  
  ammoState.isReloading = true;
  ammoState.reloadProgress = 0;
  
  if (onReloadStart) {
    onReloadStart(cousin.reloadTime);
  }
}

// Update reload progress
export function updateReload(deltaTime, cousinIndex) {
  if (!ammoState.isReloading) return;
  
  const cousin = getCousin(cousinIndex);
  ammoState.reloadProgress += deltaTime;
  
  if (ammoState.reloadProgress >= cousin.reloadTime) {
    completeReload(cousinIndex);
  }
}

// Complete reload
function completeReload(cousinIndex) {
  const cousin = getCousin(cousinIndex);
  
  ammoState.currentAmmo = cousin.maxAmmo;
  ammoState.isReloading = false;
  ammoState.reloadProgress = 0;
  
  if (onAmmoChange) {
    onAmmoChange(ammoState.currentAmmo);
  }
  
  if (onReloadComplete) {
    onReloadComplete();
  }
}

// Reset ammo for a cousin
export function resetAmmo(cousinIndex) {
  const cousin = getCousin(cousinIndex);
  ammoState.currentAmmo = cousin.maxAmmo;
  ammoState.isReloading = false;
  ammoState.reloadProgress = 0;
  ammoState.lastShotTime = 0;
  
  if (onAmmoChange) {
    onAmmoChange(ammoState.currentAmmo);
  }
}

// Get reload state
export function getReloadState() {
  return {
    isReloading: ammoState.isReloading,
    progress: ammoState.reloadProgress
  };
}

// Switch cousin
export function switchCousin(newIndex, oldIndex) {
  // Reset ammo to new cousin's max
  const newCousin = getCousin(newIndex);
  ammoState.currentAmmo = newCousin.maxAmmo;
  ammoState.isReloading = false;
  ammoState.reloadProgress = 0;
  ammoState.lastShotTime = 0;
  
  if (onAmmoChange) {
    onAmmoChange(ammoState.currentAmmo);
  }
  
  return newCousin;
}

// Manual reload trigger
export function triggerReload(cousinIndex) {
  const cousin = getCousin(cousinIndex);
  if (ammoState.currentAmmo < cousin.maxAmmo && !ammoState.isReloading) {
    startReload(cousinIndex);
  }
}

// Export ammo state for debugging
export { ammoState };

