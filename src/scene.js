import * as THREE from 'three';

// Create scene
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue

// Fog for atmosphere
scene.fog = new THREE.Fog(0x87ceeb, 50, 150);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Ground
const groundGeometry = new THREE.PlaneGeometry(200, 200);
const groundMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x3d5c3d,  // Grass green
  roughness: 0.9
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);

// Road
const roadGeometry = new THREE.BoxGeometry(100, 0.1, 12);
const roadMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x333333,  // Asphalt gray
  roughness: 0.8
});
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.position.set(0, 0.05, 15);
road.receiveShadow = true;
scene.add(road);

// Road markings (center line)
const lineGeometry = new THREE.BoxGeometry(100, 0.11, 0.3);
const lineMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const centerLine = new THREE.Mesh(lineGeometry, lineMaterial);
centerLine.position.set(0, 0.06, 15);
scene.add(centerLine);

// Road edges
const edgeGeometry = new THREE.BoxGeometry(100, 0.11, 0.2);
const edgeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const leftEdge = new THREE.Mesh(edgeGeometry, edgeMaterial);
leftEdge.position.set(0, 0.06, 9.5);
scene.add(leftEdge);

const rightEdge = new THREE.Mesh(edgeGeometry, edgeMaterial);
rightEdge.position.set(0, 0.06, 20.5);
scene.add(rightEdge);

// House - Main structure
const houseGeometry = new THREE.BoxGeometry(20, 12, 15);
const houseMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xd4a574,  // Sandstone color
  roughness: 0.7
});
const house = new THREE.Mesh(houseGeometry, houseMaterial);
house.position.set(0, 6, -7.5);
house.castShadow = true;
house.receiveShadow = true;
scene.add(house);

// House roof
const roofGeometry = new THREE.BoxGeometry(22, 1, 17);
const roofMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x8b4513,  // Brown
  roughness: 0.6
});
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.set(0, 12.5, -7.5);
roof.castShadow = true;
scene.add(roof);

// Windows on house
const windowGeometry = new THREE.BoxGeometry(2, 2.5, 0.2);
const windowMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x4a90d9,  // Blue glass
  roughness: 0.2,
  metalness: 0.5
});

const windowPositions = [
  [-6, 7, 0.1],
  [6, 7, 0.1],
  [-6, 3, 0.1],
  [6, 3, 0.1]
];

windowPositions.forEach(pos => {
  const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
  windowMesh.position.set(pos[0], pos[1], pos[2]);
  scene.add(windowMesh);
});

// Door
const doorGeometry = new THREE.BoxGeometry(3, 4, 0.2);
const doorMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x5c3317,  // Dark wood
  roughness: 0.8
});
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.set(0, 2, 0.1);
scene.add(door);

// Verandah platform
const verandahGeometry = new THREE.BoxGeometry(25, 0.5, 8);
const verandahMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xc9b896,  // Light tan
  roughness: 0.6
});
const verandah = new THREE.Mesh(verandahGeometry, verandahMaterial);
verandah.position.set(0, 4, 4);
verandah.castShadow = true;
verandah.receiveShadow = true;
scene.add(verandah);

// Verandah railing
const railingMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x8b4513,
  roughness: 0.7
});

// Front railing bar
const frontRailGeometry = new THREE.BoxGeometry(25, 0.3, 0.3);
const frontRail = new THREE.Mesh(frontRailGeometry, railingMaterial);
frontRail.position.set(0, 5.2, 7.8);
scene.add(frontRail);

// Railing posts
const postGeometry = new THREE.BoxGeometry(0.3, 1.2, 0.3);
for (let x = -12; x <= 12; x += 3) {
  const post = new THREE.Mesh(postGeometry, railingMaterial);
  post.position.set(x, 4.8, 7.8);
  scene.add(post);
}

// Side railings
const sideRailGeometry = new THREE.BoxGeometry(0.3, 0.3, 8);
const leftSideRail = new THREE.Mesh(sideRailGeometry, railingMaterial);
leftSideRail.position.set(-12.35, 5.2, 4);
scene.add(leftSideRail);

const rightSideRail = new THREE.Mesh(sideRailGeometry, railingMaterial);
rightSideRail.position.set(12.35, 5.2, 4);
scene.add(rightSideRail);

// Verandah pillars
const pillarGeometry = new THREE.BoxGeometry(0.8, 8, 0.8);
const pillarMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xffffff,
  roughness: 0.5
});

const pillarPositions = [
  [-10, 8, 7],
  [10, 7, 7],
  [-10, 8, 0],
  [10, 8, 0]
];

pillarPositions.forEach(pos => {
  const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
  pillar.position.set(pos[0], pos[1], pos[2]);
  pillar.castShadow = true;
  scene.add(pillar);
});

// Verandah roof
const verandahRoofGeometry = new THREE.BoxGeometry(26, 0.5, 10);
const verandahRoofMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x8b4513,
  roughness: 0.6
});
const verandahRoof = new THREE.Mesh(verandahRoofGeometry, verandahRoofMaterial);
verandahRoof.position.set(0, 12, 3);
verandahRoof.castShadow = true;
scene.add(verandahRoof);

// ============================================
// STORES ACROSS THE ROAD
// ============================================

// Store configuration
const storeColors = [
  0xe8d4b8,  // Cream
  0xb8d4e8,  // Light blue
  0xd4e8b8,  // Light green
  0xe8b8d4,  // Light pink
  0xd4b8e8,  // Light purple
  0xe8e8b8,  // Light yellow
];

const storeWidth = 12;
const storeHeight = 8;
const storeDepth = 10;
const storeZ = 28;  // Position beyond the road (road ends at ~21)
const numberOfStores = 8;

// Create stores
for (let i = 0; i < numberOfStores; i++) {
  const storeX = (i - numberOfStores / 2 + 0.5) * storeWidth;
  const storeColor = storeColors[i % storeColors.length];
  
  // Main store building
  const storeGeometry = new THREE.BoxGeometry(storeWidth - 0.5, storeHeight, storeDepth);
  const storeMaterial = new THREE.MeshStandardMaterial({
    color: storeColor,
    roughness: 0.8
  });
  const store = new THREE.Mesh(storeGeometry, storeMaterial);
  store.position.set(storeX, storeHeight / 2, storeZ);
  store.castShadow = true;
  store.receiveShadow = true;
  scene.add(store);
  
  // Store front darker section (shop entrance)
  const frontGeometry = new THREE.BoxGeometry(storeWidth - 1, storeHeight - 2, 0.2);
  const frontMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,  // Dark for shop entrance
    roughness: 0.5
  });
  const storeFront = new THREE.Mesh(frontGeometry, frontMaterial);
  storeFront.position.set(storeX, storeHeight / 2 - 1, storeZ - storeDepth / 2 - 0.1);
  scene.add(storeFront);
  
  // Store awning/shade
  const awningGeometry = new THREE.BoxGeometry(storeWidth, 0.3, 2);
  const awningColors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181, 0xaa96da];
  const awningMaterial = new THREE.MeshStandardMaterial({
    color: awningColors[i % awningColors.length],
    roughness: 0.6
  });
  const awning = new THREE.Mesh(awningGeometry, awningMaterial);
  awning.position.set(storeX, storeHeight - 0.5, storeZ - storeDepth / 2 - 1);
  awning.castShadow = true;
  scene.add(awning);
  
  // Store signboard
  const signGeometry = new THREE.BoxGeometry(storeWidth - 2, 1.5, 0.2);
  const signMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3
  });
  const sign = new THREE.Mesh(signGeometry, signMaterial);
  sign.position.set(storeX, storeHeight + 0.5, storeZ - storeDepth / 2 - 0.5);
  scene.add(sign);
}

// Sidewalk in front of stores
const sidewalkGeometry = new THREE.BoxGeometry(100, 0.15, 4);
const sidewalkMaterial = new THREE.MeshStandardMaterial({
  color: 0x999999,
  roughness: 0.9
});
const sidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
sidewalk.position.set(0, 0.08, 22);
sidewalk.receiveShadow = true;
scene.add(sidewalk);

// ============================================
// TREES (moved to sides, not blocking stores)
// ============================================
const treeTrunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 4, 8);
const treeTrunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
const treeTopGeometry = new THREE.SphereGeometry(2.5, 8, 6);
const treeTopMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });

// Trees on the sides (not blocking view of stores)
const treePositions = [
  [-55, 0, 30],
  [55, 0, 30],
  [-60, 0, 40],
  [60, 0, 40],
  [-50, 0, 50],
  [50, 0, 50]
];

treePositions.forEach(pos => {
  const trunk = new THREE.Mesh(treeTrunkGeometry, treeTrunkMaterial);
  trunk.position.set(pos[0], 2, pos[2]);
  trunk.castShadow = true;
  scene.add(trunk);
  
  const top = new THREE.Mesh(treeTopGeometry, treeTopMaterial);
  top.position.set(pos[0], 6, pos[2]);
  top.castShadow = true;
  scene.add(top);
});

// Create renderer
export function createRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ 
    canvas,
    antialias: true 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  return renderer;
}

// Export road bounds for target spawning
export const roadBounds = {
  xMin: -50,
  xMax: 50,
  z: 15,
  width: 12
};

// Export verandah bounds for camera movement
export const verandahBounds = {
  xMin: -12,      // Full width of verandah (25 units / 2 = 12.5, use 12 for safety)
  xMax: 12,
  y: 5.5,         // Height on verandah
  zMin: 0,        // Can move back from railing
  zMax: 7.5       // Can move close to railing (railing is at 7.8)
};

// Store references for texture updates
export const sceneObjects = {
  ground,
  road,
  house,
  roof,
  verandah,
  verandahRoof
};

// Apply textures to scene (call after loading textures)
export function applyTextures(textures) {
  // Ground/Grass texture
  if (textures.grass && textures.grass.texture) {
    const grassTexture = textures.grass.texture;
    grassTexture.repeat.set(20, 20);
    ground.material.map = grassTexture;
    ground.material.needsUpdate = true;
  }
  
  // Road texture
  if (textures.road && textures.road.texture) {
    const roadTexture = textures.road.texture;
    roadTexture.repeat.set(10, 1);
    road.material.map = roadTexture;
    road.material.needsUpdate = true;
  }
  
  // House wall texture
  if (textures.houseWall && textures.houseWall.texture) {
    const houseTexture = textures.houseWall.texture;
    houseTexture.repeat.set(2, 2);
    house.material.map = houseTexture;
    house.material.needsUpdate = true;
  }
  
  // Roof texture
  if (textures.roof && textures.roof.texture) {
    const roofTexture = textures.roof.texture;
    roofTexture.repeat.set(3, 2);
    roof.material.map = roofTexture;
    roof.material.needsUpdate = true;
    verandahRoof.material.map = roofTexture.clone();
    verandahRoof.material.needsUpdate = true;
  }
  
  // Verandah floor texture
  if (textures.verandahFloor && textures.verandahFloor.texture) {
    const verandahTexture = textures.verandahFloor.texture;
    verandahTexture.repeat.set(4, 2);
    verandah.material.map = verandahTexture;
    verandah.material.needsUpdate = true;
  }
  
  console.log('Textures applied to scene');
}

