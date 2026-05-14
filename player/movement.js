import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

let vy = 0;

let grounded = false;

export function movePlayer(
  yaw,
  keys
){

  const dir =
    new THREE.Vector3();

  if(keys.KeyW) dir.z -= 1;

  if(keys.KeyS) dir.z += 1;

  if(keys.KeyA) dir.x -= 1;

  if(keys.KeyD) dir.x += 1;

  dir.normalize();

  const speed = 0.12;

  const a = yaw.rotation.y;

  const fx = Math.sin(a);

  const fz = Math.cos(a);

  const rx =
    Math.sin(a-Math.PI/2);

  const rz =
    Math.cos(a-Math.PI/2);

  yaw.position.x +=
    (-fx*dir.z+rx*dir.x)
    * speed;

  yaw.position.z +=
    (-fz*dir.z+rz*dir.x)
    * speed;

  vy -= 0.008;

  yaw.position.y += vy;

  if(yaw.position.y<=2){

    yaw.position.y=2;

    vy=0;

    grounded=true;
  }

  if(keys.Space && grounded){

    vy=0.16;

    grounded=false;
  }
}
