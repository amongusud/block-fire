import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import {
  scene
} from "../core/scene.js";

export const blocks = [];

const geo =
  new THREE.BoxGeometry(
    1,
    1,
    1
  );

export function block(
  x,
  y,
  z,
  color
){

  const mesh =
    new THREE.Mesh(

      geo,

      new THREE.MeshLambertMaterial({
        color
      })
    );

  mesh.position.set(x,y,z);

  scene.add(mesh);

  blocks.push(mesh);
}
