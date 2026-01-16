import * as THREE from 'three';
import { verandahBounds } from './scene.js';

// Create camera
export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Initial position on verandah (closer to railing)
camera.position.set(0, verandahBounds.y, verandahBounds.zMax);

// Camera state
const cameraState = {
  yaw: Math.PI,     // Horizontal rotation - facing towards road (+Z direction)
  pitch: -0.3,      // Vertical rotation (up-down) - looking down at road
  targetX: 0,       // Target X position for smooth movement
  currentX: 0,      // Current X position
  targetZ: verandahBounds.zMax,  // Target Z position (forward/back on verandah)
  currentZ: verandahBounds.zMax, // Current Z position
  
  // Jump state
  currentY: verandahBounds.y,    // Current Y position
  velocityY: 0,                  // Vertical velocity for jumping
  isJumping: false,              // Whether player is in the air
  groundY: verandahBounds.y,     // Ground level
  jumpForce: 12,                 // Initial jump velocity
  gravity: 30,                   // Gravity strength
  
  moveSpeed: 10,    // Units per second
  lookSensitivity: 0.002,
  pitchMin: -0.8,   // Look down limit
  pitchMax: 0.2,    // Look up limit
  yawMin: Math.PI - 1.2,   // Look left limit
  yawMax: Math.PI + 1.2    // Look right limit
};

// Input state
const input = {
  moveLeft: false,
  moveRight: false,
  moveForward: false,
  moveBackward: false,
  jump: false
};

// Handle keyboard input
export function handleKeyDown(event) {
  switch (event.code) {
    case 'KeyA':
      input.moveLeft = true;
      break;
    case 'KeyD':
      input.moveRight = true;
      break;
    case 'KeyW':
      input.moveForward = true;
      break;
    case 'KeyS':
      input.moveBackward = true;
      break;
    case 'Space':
      input.jump = true;
      break;
  }
}

export function handleKeyUp(event) {
  switch (event.code) {
    case 'KeyA':
      input.moveLeft = false;
      break;
    case 'KeyD':
      input.moveRight = false;
      break;
    case 'KeyW':
      input.moveForward = false;
      break;
    case 'KeyS':
      input.moveBackward = false;
      break;
    case 'Space':
      input.jump = false;
      break;
  }
}

// Handle mouse movement for looking
export function handleMouseMove(event) {
  // Only rotate if pointer is locked
  if (document.pointerLockElement) {
    cameraState.yaw -= event.movementX * cameraState.lookSensitivity;
    cameraState.pitch -= event.movementY * cameraState.lookSensitivity;
    
    // Clamp rotation
    cameraState.yaw = Math.max(cameraState.yawMin, Math.min(cameraState.yawMax, cameraState.yaw));
    cameraState.pitch = Math.max(cameraState.pitchMin, Math.min(cameraState.pitchMax, cameraState.pitch));
  }
}

// Update camera position and rotation
export function updateCamera(deltaTime) {
  // Calculate movement direction based on camera yaw
  // Camera faces +Z when yaw = PI, so we need to account for that
  const sinYaw = Math.sin(cameraState.yaw);
  const cosYaw = Math.cos(cameraState.yaw);
  
  // Movement relative to camera facing direction
  let moveX = 0;
  let moveZ = 0;
  
  // Forward direction: camera faces -Z by default, rotated by yaw
  // At yaw=PI, camera faces +Z (towards road)
  const forwardX = -sinYaw;
  const forwardZ = -cosYaw;
  
  // Right direction: perpendicular to forward
  // When facing +Z (yaw=PI), right should be -X direction
  const rightX = cosYaw;
  const rightZ = -sinYaw;
  
  const speed = cameraState.moveSpeed * deltaTime;
  
  // Forward/Backward (W/S)
  if (input.moveForward) {
    moveX += forwardX * speed;
    moveZ += forwardZ * speed;
  }
  if (input.moveBackward) {
    moveX -= forwardX * speed;
    moveZ -= forwardZ * speed;
  }
  
  // Left/Right (A/D) - strafe
  if (input.moveRight) {
    moveX += rightX * speed;
    moveZ += rightZ * speed;
  }
  if (input.moveLeft) {
    moveX -= rightX * speed;
    moveZ -= rightZ * speed;
  }
  
  // Apply movement to target position
  cameraState.targetX += moveX;
  cameraState.targetZ += moveZ;
  
  // Clamp target position to verandah bounds
  cameraState.targetX = Math.max(
    verandahBounds.xMin,
    Math.min(verandahBounds.xMax, cameraState.targetX)
  );
  
  cameraState.targetZ = Math.max(
    verandahBounds.zMin,
    Math.min(verandahBounds.zMax, cameraState.targetZ)
  );
  
  // Handle jumping
  if (input.jump && !cameraState.isJumping) {
    cameraState.velocityY = cameraState.jumpForce;
    cameraState.isJumping = true;
  }
  
  // Apply gravity
  if (cameraState.isJumping) {
    cameraState.velocityY -= cameraState.gravity * deltaTime;
    cameraState.currentY += cameraState.velocityY * deltaTime;
    
    // Check if landed
    if (cameraState.currentY <= cameraState.groundY) {
      cameraState.currentY = cameraState.groundY;
      cameraState.velocityY = 0;
      cameraState.isJumping = false;
    }
  }
  
  // Smooth horizontal movement
  cameraState.currentX += (cameraState.targetX - cameraState.currentX) * 0.15;
  cameraState.currentZ += (cameraState.targetZ - cameraState.currentZ) * 0.15;
  
  // Update camera position
  camera.position.x = cameraState.currentX;
  camera.position.y = cameraState.currentY;
  camera.position.z = cameraState.currentZ;
  
  // Apply rotation using Euler angles
  camera.rotation.order = 'YXZ';
  camera.rotation.y = cameraState.yaw;
  camera.rotation.x = cameraState.pitch;
}

// Get camera forward direction for raycasting
export function getCameraDirection() {
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  return direction;
}

// Handle window resize
export function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// Reset camera state
export function resetCamera(height = verandahBounds.y) {
  cameraState.yaw = Math.PI;
  cameraState.pitch = -0.3;
  cameraState.targetX = 0;
  cameraState.currentX = 0;
  cameraState.targetZ = verandahBounds.zMax;
  cameraState.currentZ = verandahBounds.zMax;
  cameraState.currentY = height;
  cameraState.groundY = height;
  cameraState.velocityY = 0;
  cameraState.isJumping = false;
  camera.position.set(0, height, verandahBounds.zMax);
}

// Set camera height based on cousin
export function setCameraHeight(height) {
  cameraState.groundY = height;
  // Only update current Y if not jumping
  if (!cameraState.isJumping) {
    cameraState.currentY = height;
    camera.position.y = height;
  }
}

// Export camera state for debugging
export { cameraState };
