import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import {
  scene
} from "./scene.js";

scene.add(
  new THREE.AmbientLight(
    0xffffff,
    0.5
  )
);

const sun =
  new THREE.DirectionalLight(
    0xffffff,
    1.2
  );

sun.position.set(
  50,
  80,
  40
);

sun.castShadow = true;

scene.add(sun);
