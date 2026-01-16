import * as THREE from 'three';
import { scene } from './scene.js';
import { camera } from './camera.js';

// Holi colors - bright and festive
const HOLI_COLORS = [
  0xff1493,  // Deep pink
  0xff6b35,  // Orange
  0xffd93d,  // Yellow
  0x6bcb77,  // Green
  0x4d96ff,  // Blue
  0x9b59b6,  // Purple
  0xff4757,  // Red
  0x00d2d3   // Cyan
];

// Raycaster for shooting
const raycaster = new THREE.Raycaster();
const screenCenter = new THREE.Vector2(0, 0);

// Active splashes for cleanup
const activeSplashes = [];
const SPLASH_LIFETIME = 800; // ms

// Particle pool for performance
const particlePool = [];
const MAX_PARTICLES = 50;

// Get random Holi color
function getRandomHoliColor() {
  return HOLI_COLORS[Math.floor(Math.random() * HOLI_COLORS.length)];
}

// Create a splash effect at hit point
function createSplash(position, normal) {
  const color = getRandomHoliColor();
  
  // Main splash blob
  const splashGeometry = new THREE.SphereGeometry(0.3, 8, 6);
  const splashMaterial = new THREE.MeshBasicMaterial({ 
    color: color,
    transparent: true,
    opacity: 0.9
  });
  const splash = new THREE.Mesh(splashGeometry, splashMaterial);
  splash.position.copy(position);
  
  // Offset slightly from surface
  if (normal) {
    splash.position.add(normal.multiplyScalar(0.1));
  }
  
  scene.add(splash);
  
  // Create smaller particles around main splash
  const particleCount = 5 + Math.floor(Math.random() * 5);
  const particles = [];
  
  for (let i = 0; i < particleCount; i++) {
    const particleGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.15, 6, 4);
    const particleMaterial = new THREE.MeshBasicMaterial({ 
      color: getRandomHoliColor(),
      transparent: true,
      opacity: 0.8
    });
    const particle = new THREE.Mesh(particleGeometry, particleMaterial);
    
    // Scatter around main splash
    particle.position.copy(position);
    particle.position.x += (Math.random() - 0.5) * 1.5;
    particle.position.y += Math.random() * 1;
    particle.position.z += (Math.random() - 0.5) * 1.5;
    
    // Random velocity for animation
    particle.userData.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 3,
      Math.random() * 4 + 2,
      (Math.random() - 0.5) * 3
    );
    
    scene.add(particle);
    particles.push(particle);
  }
  
  // Track splash for cleanup and animation
  const splashData = {
    main: splash,
    particles: particles,
    createdAt: Date.now(),
    startY: position.y
  };
  
  activeSplashes.push(splashData);
  
  return splashData;
}

// Create a color stain on the target
export function createStain(target, hitPoint) {
  const color = getRandomHoliColor();
  
  // Create a flat disc as a stain
  const stainGeometry = new THREE.CircleGeometry(0.3 + Math.random() * 0.2, 8);
  const stainMaterial = new THREE.MeshBasicMaterial({ 
    color: color,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide
  });
  const stain = new THREE.Mesh(stainGeometry, stainMaterial);
  
  // Position on target surface
  stain.position.copy(hitPoint);
  
  // Random rotation for variety
  stain.rotation.x = Math.random() * Math.PI;
  stain.rotation.y = Math.random() * Math.PI;
  stain.rotation.z = Math.random() * Math.PI;
  
  // Add to target so it moves with it
  target.add(stain);
  
  // Convert position to local coordinates
  target.worldToLocal(stain.position);
  
  // Track stain
  if (!target.userData.stains) {
    target.userData.stains = [];
  }
  target.userData.stains.push(stain);
}

// Shoot the water gun
export function shoot(targets, onHit) {
  // Cast ray from camera center
  raycaster.setFromCamera(screenCenter, camera);
  
  // Check intersection with targets
  const intersects = raycaster.intersectObjects(targets, true);
  
  if (intersects.length > 0) {
    const hit = intersects[0];
    
    // Create splash at hit point
    createSplash(hit.point, hit.face?.normal?.clone());
    
    // Find the root target object
    let targetObject = hit.object;
    while (targetObject.parent && !targetObject.userData.isTarget) {
      targetObject = targetObject.parent;
    }
    
    // Create stain on target
    if (targetObject.userData.isTarget) {
      createStain(targetObject, hit.point);
      
      // Call hit callback
      if (onHit) {
        onHit(targetObject);
      }
    }
    
    return { hit: true, target: targetObject, point: hit.point };
  } else {
    // Shoot into the distance - create splash on ground
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hitPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(groundPlane, hitPoint);
    
    if (hitPoint) {
      createSplash(hitPoint, new THREE.Vector3(0, 1, 0));
    }
    
    return { hit: false, target: null, point: hitPoint };
  }
}

// Update splash animations
export function updateSplashes(deltaTime) {
  const now = Date.now();
  const gravity = 15;
  
  for (let i = activeSplashes.length - 1; i >= 0; i--) {
    const splash = activeSplashes[i];
    const age = now - splash.createdAt;
    const lifeRatio = age / SPLASH_LIFETIME;
    
    // Animate particles falling
    splash.particles.forEach(particle => {
      if (particle.userData.velocity) {
        particle.userData.velocity.y -= gravity * deltaTime;
        particle.position.add(
          particle.userData.velocity.clone().multiplyScalar(deltaTime)
        );
        
        // Stop at ground
        if (particle.position.y < 0.1) {
          particle.position.y = 0.1;
          particle.userData.velocity.set(0, 0, 0);
        }
      }
      
      // Fade out
      if (particle.material) {
        particle.material.opacity = Math.max(0, 0.8 * (1 - lifeRatio));
      }
    });
    
    // Fade main splash
    if (splash.main.material) {
      splash.main.material.opacity = Math.max(0, 0.9 * (1 - lifeRatio * 0.5));
    }
    
    // Grow main splash slightly
    const scale = 1 + lifeRatio * 0.5;
    splash.main.scale.set(scale, scale, scale);
    
    // Remove old splashes
    if (age > SPLASH_LIFETIME) {
      scene.remove(splash.main);
      splash.main.geometry.dispose();
      splash.main.material.dispose();
      
      splash.particles.forEach(particle => {
        scene.remove(particle);
        particle.geometry.dispose();
        particle.material.dispose();
      });
      
      activeSplashes.splice(i, 1);
    }
  }
}

// Clean up all splashes
export function clearSplashes() {
  activeSplashes.forEach(splash => {
    scene.remove(splash.main);
    splash.main.geometry.dispose();
    splash.main.material.dispose();
    
    splash.particles.forEach(particle => {
      scene.remove(particle);
      particle.geometry.dispose();
      particle.material.dispose();
    });
  });
  
  activeSplashes.length = 0;
}

// Export for debugging
export { activeSplashes, HOLI_COLORS };

