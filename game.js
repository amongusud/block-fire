import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

// ======================================
// SCENE
// ======================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);

scene.fog = new THREE.Fog(
  0x87ceeb,
  20,
  120
);

// ======================================
// CAMERA
// ======================================

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// ======================================
// RENDERER
// ======================================

const renderer = new THREE.WebGLRenderer({
  antialias:true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.shadowMap.enabled = true;

renderer.toneMapping =
  THREE.ACESFilmicToneMapping;

renderer.toneMappingExposure = 1.1;

document.body.appendChild(
  renderer.domElement
);

// ======================================
// LIGHTS
// ======================================

const sun = new THREE.DirectionalLight(
  0xffffff,
  1.5
);

sun.position.set(30,40,20);

sun.castShadow = true;

scene.add(sun);

scene.add(
  new THREE.AmbientLight(
    0xffffff,
    0.45
  )
);

// ======================================
// FLOOR
// ======================================

const floor = new THREE.Mesh(

  new THREE.PlaneGeometry(300,300),

  new THREE.MeshLambertMaterial({
    color:0x4caf50
  })
);

floor.rotation.x = -Math.PI / 2;

floor.receiveShadow = true;

scene.add(floor);

// ======================================
// BLOCKS
// ======================================

const blocks = [];

const blockGeometry =
  new THREE.BoxGeometry(1,1,1);

function createBlock(
  x,
  y,
  z,
  color = 0x888888
){

  const block = new THREE.Mesh(

    blockGeometry,

    new THREE.MeshLambertMaterial({
      color
    })
  );

  block.position.set(x,y,z);

  block.receiveShadow = true;

  scene.add(block);

  blocks.push(block);

  return block;
}

// ======================================
// MAP
// ======================================

for(let x=-20;x<=20;x++){

  for(let z=-20;z<=20;z++){

    createBlock(
      x,
      -0.5,
      z,
      0x3f8f3f
    );
  }
}

// paredes

for(let y=0;y<6;y++){

  createBlock(5,y,-10,0x777777);

  createBlock(-5,y,-10,0x777777);
}

for(let x=-5;x<=5;x++){

  createBlock(
    x,
    5,
    -10,
    0x777777
  );
}

// torres

for(let y=0;y<8;y++){

  createBlock(
    -10,
    y,
    -15,
    0xaa3333
  );
}

for(let y=0;y<5;y++){

  createBlock(
    12,
    y,
    -8,
    0x3333aa
  );
}

// ======================================
// PLAYER
// ======================================

const player = {

  height:1.8,

  speed:0.03,

  gravity:0.012,

  jumpForce:0.22,

  velocity:new THREE.Vector3(),

  canJump:true
};

camera.position.set(
  0,
  player.height,
  5
);

// ======================================
// WEAPON
// ======================================

const gun = new THREE.Mesh(

  new THREE.BoxGeometry(
    0.25,
    0.2,
    0.8
  ),

  new THREE.MeshStandardMaterial({
    color:0x222222,
    metalness:0.7,
    roughness:0.3
  })
);

gun.position.set(
  0.35,
  -0.3,
  -0.7
);

camera.add(gun);

scene.add(camera);

// ======================================
// INPUT
// ======================================

const keys = {};

document.addEventListener(
  'keydown',
  e => {

    keys[e.code] = true;

    if(
      e.code === 'Space'
      &&
      player.canJump
    ){

      player.velocity.y =
        player.jumpForce;

      player.canJump = false;
    }
  }
);

document.addEventListener(
  'keyup',
  e => {

    keys[e.code] = false;
  }
);

// ======================================
// POINTER LOCK
// ======================================

const menu =
  document.getElementById('menu');

menu.addEventListener(
  'click',
  () => {

    document.body.requestPointerLock();
  }
);

document.addEventListener(
  'pointerlockchange',
  () => {

    if(
      document.pointerLockElement
      ===
      document.body
    ){

      menu.style.display = 'none';

    }else{

      menu.style.display = 'flex';
    }
  }
);

// ======================================
// MOUSE LOOK
// ======================================

let pitch = 0;

document.addEventListener(
  'mousemove',
  e => {

    if(
      document.pointerLockElement
      !==
      document.body
    ) return;

    camera.rotation.y -=
      e.movementX * 0.002;

    pitch -=
      e.movementY * 0.002;

    pitch = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2,pitch)
    );

    camera.rotation.x = pitch;
  }
);

// ======================================
// MOVEMENT
// ======================================

const direction =
  new THREE.Vector3();

const forward =
  new THREE.Vector3();

const right =
  new THREE.Vector3();

const up =
  new THREE.Vector3(0,1,0);

function movePlayer(){

  direction.set(0,0,0);

  if(keys['KeyW']) direction.z -= 1;
  if(keys['KeyS']) direction.z += 1;
  if(keys['KeyA']) direction.x -= 1;
  if(keys['KeyD']) direction.x += 1;

  direction.normalize();

  camera.getWorldDirection(
    forward
  );

  forward.y = 0;

  forward.normalize();

  right.crossVectors(
    forward,
    up
  );

  // fricção

  player.velocity.x *= 0.82;
  player.velocity.z *= 0.82;

  // movimento

  player.velocity.add(
    forward.clone().multiplyScalar(
      -direction.z * player.speed
    )
  );

  player.velocity.add(
    right.clone().multiplyScalar(
      direction.x * player.speed
    )
  );

  // gravidade

  player.velocity.y -=
    player.gravity;

  camera.position.add(
    player.velocity
  );

  // chão

  if(
    camera.position.y
    <
    player.height
  ){

    camera.position.y =
      player.height;

    player.velocity.y = 0;

    player.canJump = true;
  }

  // head bob

  if(
    direction.length() > 0
    &&
    player.canJump
  ){

    camera.position.y +=
      Math.sin(
        Date.now() * 0.01
      ) * 0.02;
  }
}

// ======================================
// SHOOTING
// ======================================

const raycaster =
  new THREE.Raycaster();

document.addEventListener(
  'click',
  () => {

    if(
      document.pointerLockElement
      !==
      document.body
    ) return;

    // recoil

    camera.rotation.x -= 0.03;

    gun.position.z = -0.5;

    setTimeout(() => {

      gun.position.z = -0.7;

    },50);

    raycaster.setFromCamera(
      new THREE.Vector2(0,0),
      camera
    );

    const hits =
      raycaster.intersectObjects(
        blocks
      );

    if(hits.length > 0){

      const hit = hits[0].object;

      // highlight

      hit.material.color.set(
        0x333333
      );

      setTimeout(() => {

        scene.remove(hit);

        blocks.splice(
          blocks.indexOf(hit),
          1
        );

      },50);
    }
  }
);

// ======================================
// HUD
// ======================================

const hud =
  document.getElementById('hud');

function updateHUD(){

  hud.innerHTML = `
    BLOCK STRIKE<br>
    X: ${camera.position.x.toFixed(1)}<br>
    Y: ${camera.position.y.toFixed(1)}<br>
    Z: ${camera.position.z.toFixed(1)}
  `;
}

// ======================================
// LOOP
// ======================================

function animate(){

  requestAnimationFrame(
    animate
  );

  movePlayer();

  updateHUD();

  renderer.render(
    scene,
    camera
  );
}

animate();

// ======================================
// RESIZE
// ======================================

window.addEventListener(
  'resize',
  () => {

    camera.aspect =
      window.innerWidth
      /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  }
);
