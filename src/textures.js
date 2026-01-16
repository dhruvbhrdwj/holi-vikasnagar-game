// Texture loading utilities

import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

// Cache for loaded textures
const textureCache = {};

// Load a texture with fallback to color
export function loadTexture(path, fallbackColor = 0x888888) {
  return new Promise((resolve) => {
    textureLoader.load(
      path,
      (texture) => {
        // Configure texture
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        textureCache[path] = texture;
        resolve({ texture, loaded: true });
      },
      undefined,
      (error) => {
        // Texture failed to load, use fallback color
        console.log(`Texture not found: ${path}, using fallback color`);
        resolve({ texture: null, loaded: false, fallbackColor });
      }
    );
  });
}

// Create material with texture or fallback color
export function createTexturedMaterial(texture, fallbackColor, options = {}) {
  if (texture) {
    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: options.roughness || 0.7,
      ...options
    });
  } else {
    return new THREE.MeshStandardMaterial({
      color: fallbackColor,
      roughness: options.roughness || 0.7,
      ...options
    });
  }
}

// Load all game textures
export async function loadAllTextures() {
  const texturePaths = {
    houseWall: '/textures/house-wall.jpg',
    houseSide: '/textures/house-side.jpg',
    roof: '/textures/roof.jpg',
    verandahFloor: '/textures/verandah-floor.jpg',
    road: '/textures/road.jpg',
    grass: '/textures/grass.jpg',
    sky: '/textures/sky.jpg',
    store1: '/textures/store-1.jpg',
    store2: '/textures/store-2.jpg',
    store3: '/textures/store-3.jpg',
  };

  const fallbackColors = {
    houseWall: 0xd4a574,    // Sandy tan
    houseSide: 0xc9a86c,    // Slightly different tan
    roof: 0x8b4513,         // Brown
    verandahFloor: 0xc9b896, // Light tan
    road: 0x333333,         // Dark gray
    grass: 0x3d5c3d,        // Green
    sky: 0x87ceeb,          // Sky blue
    store1: 0xe8d4b8,       // Cream
    store2: 0xb8d4e8,       // Light blue
    store3: 0xd4e8b8,       // Light green
  };

  const textures = {};

  for (const [key, path] of Object.entries(texturePaths)) {
    const result = await loadTexture(path, fallbackColors[key]);
    textures[key] = {
      texture: result.texture,
      loaded: result.loaded,
      fallbackColor: fallbackColors[key]
    };
  }

  return textures;
}

// Create a material from loaded texture data
export function materialFromTextureData(textureData, options = {}) {
  return createTexturedMaterial(
    textureData.texture,
    textureData.fallbackColor,
    options
  );
}

// Set texture repeat for tiling
export function setTextureRepeat(texture, repeatX, repeatY) {
  if (texture) {
    texture.repeat.set(repeatX, repeatY);
  }
}

// Export loader for direct use
export { textureLoader };

