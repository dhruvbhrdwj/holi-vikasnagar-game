import * as THREE from 'three';
import { scene, roadBounds } from './scene.js';

// Target types with different properties
const TARGET_TYPES = {
  car: {
    points: 10,
    speed: { min: 5, max: 12 },
    spawnChance: 0.4,
    create: createCar
  },
  pedestrian: {
    points: 25,
    speed: { min: 2, max: 5 },
    spawnChance: 0.6,
    create: createPedestrian
  }
};

// Active targets
const activeTargets = [];

// Spawn timer
let spawnTimer = 0;
const SPAWN_INTERVAL = 1.5; // seconds

// Car colors
const CAR_COLORS = [
  0xff4444,  // Red
  0x4444ff,  // Blue
  0x44ff44,  // Green
  0xffff44,  // Yellow
  0xff44ff,  // Pink
  0x44ffff,  // Cyan
  0xffffff,  // White
  0x333333   // Black
];

// Create a simple car mesh
function createCar() {
  const group = new THREE.Group();
  
  const color = CAR_COLORS[Math.floor(Math.random() * CAR_COLORS.length)];
  const material = new THREE.MeshStandardMaterial({ 
    color: color,
    roughness: 0.3,
    metalness: 0.5
  });
  
  // Car body
  const bodyGeometry = new THREE.BoxGeometry(4, 1.2, 2);
  const body = new THREE.Mesh(bodyGeometry, material);
  body.position.y = 0.8;
  body.castShadow = true;
  group.add(body);
  
  // Car cabin
  const cabinGeometry = new THREE.BoxGeometry(2, 0.8, 1.6);
  const cabinMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x222222,
    roughness: 0.5
  });
  const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
  cabin.position.set(-0.3, 1.7, 0);
  cabin.castShadow = true;
  group.add(cabin);
  
  // Windows
  const windowMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x88ccff,
    roughness: 0.1,
    metalness: 0.5,
    transparent: true,
    opacity: 0.7
  });
  
  // Front windshield
  const frontWindowGeometry = new THREE.BoxGeometry(0.1, 0.6, 1.4);
  const frontWindow = new THREE.Mesh(frontWindowGeometry, windowMaterial);
  frontWindow.position.set(0.65, 1.7, 0);
  group.add(frontWindow);
  
  // Wheels
  const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 16);
  const wheelMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x111111,
    roughness: 0.8
  });
  
  const wheelPositions = [
    [1.2, 0.4, 1.1],
    [1.2, 0.4, -1.1],
    [-1.2, 0.4, 1.1],
    [-1.2, 0.4, -1.1]
  ];
  
  wheelPositions.forEach(pos => {
    const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(pos[0], pos[1], pos[2]);
    wheel.castShadow = true;
    group.add(wheel);
  });
  
  // Headlights
  const lightGeometry = new THREE.BoxGeometry(0.1, 0.3, 0.4);
  const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffcc });
  
  const leftLight = new THREE.Mesh(lightGeometry, lightMaterial);
  leftLight.position.set(2, 0.8, 0.6);
  group.add(leftLight);
  
  const rightLight = new THREE.Mesh(lightGeometry, lightMaterial);
  rightLight.position.set(2, 0.8, -0.6);
  group.add(rightLight);
  
  return group;
}

// Create a simple pedestrian mesh (capsule-like)
function createPedestrian() {
  const group = new THREE.Group();
  
  // Shirt colors
  const shirtColors = [0xff6b6b, 0x6bff6b, 0x6b6bff, 0xffff6b, 0xff6bff, 0x6bffff];
  const shirtColor = shirtColors[Math.floor(Math.random() * shirtColors.length)];
  
  // Body (capsule)
  const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
  const bodyMaterial = new THREE.MeshStandardMaterial({ 
    color: shirtColor,
    roughness: 0.7
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = 1.2;
  body.castShadow = true;
  group.add(body);
  
  // Head
  const headGeometry = new THREE.SphereGeometry(0.25, 8, 6);
  const headMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xdeb887,  // Skin tone
    roughness: 0.8
  });
  const head = new THREE.Mesh(headGeometry, headMaterial);
  head.position.y = 1.95;
  head.castShadow = true;
  group.add(head);
  
  // Legs (simple cylinders)
  const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8);
  const legMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x333366,  // Dark pants
    roughness: 0.8
  });
  
  const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
  leftLeg.position.set(0.12, 0.3, 0);
  leftLeg.castShadow = true;
  group.add(leftLeg);
  
  const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
  rightLeg.position.set(-0.12, 0.3, 0);
  rightLeg.castShadow = true;
  group.add(rightLeg);
  
  // Arms
  const armGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 8);
  const armMaterial = new THREE.MeshStandardMaterial({ 
    color: shirtColor,
    roughness: 0.7
  });
  
  const leftArm = new THREE.Mesh(armGeometry, armMaterial);
  leftArm.position.set(0.4, 1.2, 0);
  leftArm.rotation.z = 0.3;
  leftArm.castShadow = true;
  group.add(leftArm);
  
  const rightArm = new THREE.Mesh(armGeometry, armMaterial);
  rightArm.position.set(-0.4, 1.2, 0);
  rightArm.rotation.z = -0.3;
  rightArm.castShadow = true;
  group.add(rightArm);
  
  return group;
}

// Spawn a target
export function spawnTarget() {
  // Determine target type based on spawn chance
  const random = Math.random();
  let targetType;
  let cumulative = 0;
  
  for (const [type, config] of Object.entries(TARGET_TYPES)) {
    cumulative += config.spawnChance;
    if (random < cumulative) {
      targetType = type;
      break;
    }
  }
  
  const config = TARGET_TYPES[targetType];
  const target = config.create();
  
  // Determine direction (left-to-right or right-to-left)
  const direction = Math.random() < 0.5 ? 1 : -1;
  
  // Speed
  const speed = config.speed.min + Math.random() * (config.speed.max - config.speed.min);
  
  // Starting position
  const startX = direction > 0 ? roadBounds.xMin - 5 : roadBounds.xMax + 5;
  const zOffset = (Math.random() - 0.5) * (roadBounds.width - 4);
  
  target.position.set(startX, 0, roadBounds.z + zOffset);
  
  // Rotate to face direction of movement
  if (direction < 0) {
    target.rotation.y = Math.PI;
  }
  
  // Store target data
  target.userData = {
    isTarget: true,
    type: targetType,
    points: config.points,
    speed: speed,
    direction: direction,
    hits: 0,
    maxHits: targetType === 'car' ? 3 : 2, // Cars need more hits
    stains: []
  };
  
  scene.add(target);
  activeTargets.push(target);
  
  return target;
}

// Update all targets
export function updateTargets(deltaTime) {
  // Update spawn timer
  spawnTimer += deltaTime;
  
  if (spawnTimer >= SPAWN_INTERVAL) {
    spawnTarget();
    spawnTimer = 0;
  }
  
  // Update target positions
  for (let i = activeTargets.length - 1; i >= 0; i--) {
    const target = activeTargets[i];
    
    // Move target
    target.position.x += target.userData.speed * target.userData.direction * deltaTime;
    
    // Add slight wobble for pedestrians
    if (target.userData.type === 'pedestrian') {
      target.position.y = Math.sin(Date.now() * 0.01) * 0.05;
    }
    
    // Check if off screen
    const isOffScreen = target.userData.direction > 0 
      ? target.position.x > roadBounds.xMax + 10
      : target.position.x < roadBounds.xMin - 10;
    
    if (isOffScreen) {
      removeTarget(target, i);
    }
  }
}

// Register a hit on target
export function registerHit(target) {
  if (!target.userData.isTarget) return null;
  
  target.userData.hits++;
  
  // Check if target is destroyed
  if (target.userData.hits >= target.userData.maxHits) {
    const index = activeTargets.indexOf(target);
    if (index > -1) {
      removeTarget(target, index);
      return {
        destroyed: true,
        points: target.userData.points
      };
    }
  }
  
  return {
    destroyed: false,
    points: Math.floor(target.userData.points / target.userData.maxHits)
  };
}

// Remove a target
function removeTarget(target, index) {
  scene.remove(target);
  
  // Clean up stains
  if (target.userData.stains) {
    target.userData.stains.forEach(stain => {
      stain.geometry.dispose();
      stain.material.dispose();
    });
  }
  
  // Dispose geometries and materials
  target.traverse(child => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach(m => m.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
  
  activeTargets.splice(index, 1);
}

// Get all active targets for raycasting
export function getTargets() {
  return activeTargets;
}

// Clear all targets
export function clearTargets() {
  for (let i = activeTargets.length - 1; i >= 0; i--) {
    removeTarget(activeTargets[i], i);
  }
  spawnTimer = 0;
}

// Reset spawn timer
export function resetSpawnTimer() {
  spawnTimer = 0;
}

// Export for debugging
export { activeTargets, TARGET_TYPES };

