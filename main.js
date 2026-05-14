import {
  scene,
  camera,
  yaw
} from "./core/scene.js";

import {
  renderer
} from "./core/renderer.js";

import "./core/lights.js";

import {
  createMap
} from "./world/map.js";

import {
  setupInput,
  keys
} from "./player/input.js";

import {
  movePlayer
} from "./player/movement.js";

import {
  setupShooting,
  updateShooting
} from "./player/shooting.js";

import {
  currentWeapon
} from "./weapons/weapons.js";

import "./ui/menu.js";

import "./ui/crosshair.js";

import {
  updateHUD
} from "./ui/hud.js";

import "./utils/resize.js";

// START

createMap();

setupInput();

setupShooting();

// LOOP

function animate(){

  requestAnimationFrame(animate);

  movePlayer(yaw,keys);

  updateShooting();

  renderer.render(scene,camera);

  updateHUD(currentWeapon);
}

animate();
