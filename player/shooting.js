import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

import {
  scene,
  yaw,
  pitch
} from "../core/scene.js";

import {
  currentWeapon
} from "../weapons/weapons.js";

import {
  blocks
} from "../world/map.js";

let shooting = false;

let lastShot = 0;

let pitchValue = 0;

addEventListener("mousemove",e=>{

  if(
    document.pointerLockElement
    !== document.body
  ) return;

  yaw.rotation.y -=
    e.movementX * 0.002;

  pitchValue -=
    e.movementY * 0.002;

  pitchValue = Math.max(
    -Math.PI/2,
    Math.min(
      Math.PI/2,
      pitchValue
    )
  );

  pitch.rotation.x =
    pitchValue;
});

export function setupShooting(){

  addEventListener("mousedown",e=>{

    if(e.button!==0) return;

    shooting = true;

    if(!currentWeapon.auto){

      shoot();
    }
  });

  addEventListener("mouseup",()=>{

    shooting = false;
  });
}

export function updateShooting(){

  if(
    shooting &&
    currentWeapon.auto
  ){

    shoot();
  }
}

function shoot(){

  const now =
    performance.now();

  if(
    now-lastShot
    < currentWeapon.fireRate
  ) return;

  if(currentWeapon.ammo<=0)
    return;

  lastShot = now;

  currentWeapon.ammo--;

  const dir =
    new THREE.Vector3();

  pitch.getWorldDirection(dir);

  dir.x +=
    (Math.random()-0.5)
    * currentWeapon.spread;

  dir.y +=
    (Math.random()-0.5)
    * currentWeapon.spread;

  dir.z +=
    (Math.random()-0.5)
    * currentWeapon.spread;

  dir.normalize();

  pitch.rotation.x +=
    currentWeapon.recoil;

  const ray =
    new THREE.Raycaster(
      yaw.position,
      dir
    );

  const hits =
    ray.intersectObjects(blocks);

  if(hits.length){

    const p =
      hits[0].point;

    const impact =
      new THREE.Mesh(

        new THREE.SphereGeometry(
          0.12
        ),

        new THREE.MeshBasicMaterial({
          color:0xffaa00
        })
      );

    impact.position.copy(p);

    scene.add(impact);

    setTimeout(()=>{

      scene.remove(impact);

    },150);
  }
}
