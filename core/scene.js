import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export const scene =
  new THREE.Scene();

scene.background =
  new THREE.Color(0x87ceeb);

scene.fog =
  new THREE.Fog(
    0x87ceeb,
    20,
    180
  );

export const camera =
  new THREE.PerspectiveCamera(
    75,
    innerWidth/innerHeight,
    0.1,
    1000
  );

export const yaw =
  new THREE.Object3D();

export const pitch =
  new THREE.Object3D();

yaw.position.set(0,2,10);

scene.add(yaw);

yaw.add(pitch);

pitch.add(camera);
