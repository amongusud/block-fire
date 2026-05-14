import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

// =====================================
// SCENE
// =====================================

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb,20,180);

// =====================================
// CAMERA FPS
// =====================================

const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth/innerHeight,
  0.1,
  1000
);

const yaw = new THREE.Object3D();
const pitch = new THREE.Object3D();

yaw.position.set(50,2,20);

scene.add(yaw);

pitch.add(camera);
yaw.add(pitch);

// =====================================
// RENDERER
// =====================================

const renderer = new THREE.WebGLRenderer({
  antialias:true
});

renderer.setSize(innerWidth,innerHeight);

renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

// =====================================
// LIGHT
// =====================================

const sun = new THREE.DirectionalLight(
  0xffffff,
  1.5
);

sun.position.set(50,80,40);

sun.castShadow = true;

scene.add(sun);

scene.add(
  new THREE.AmbientLight(
    0xffffff,
    0.45
  )
);

// =====================================
// BLOCKS
// =====================================

const blocks = [];

const geo = new THREE.BoxGeometry(1,1,1);

function block(x,y,z,color){

  const mesh = new THREE.Mesh(

    geo,

    new THREE.MeshLambertMaterial({
      color
    })
  );

  mesh.position.set(x,y,z);

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  scene.add(mesh);

  blocks.push(mesh);
}

// =====================================
// MAP
// =====================================

const SAND = 0xd8c090;
const WALL = 0xb08a5a;
const DARK = 0x666666;
const BOX = 0x8b5a2b;

function wall(x1,z1,x2,z2,h=5,c=WALL){

  for(let x=x1;x<=x2;x++){

    for(let z=z1;z<=z2;z++){

      for(let y=0;y<h;y++){

        block(x,y,z,c);
      }
    }
  }
}

// floor

for(let x=-80;x<=80;x++){

  for(let z=-80;z<=80;z++){

    block(x,-1,z,SAND);
  }
}

// outer

wall(-80,-80,80,-78);
wall(-80,78,80,80);

wall(-80,-80,-78,80);
wall(78,-80,80,80);

// A

wall(-10,10,20,12);
wall(-10,28,20,30);

wall(-10,10,-8,30);
wall(18,10,20,30);

// B

wall(-40,-48,-10,-46);
wall(-40,-70,-10,-68);

wall(-40,-68,-38,-46);
wall(-12,-68,-10,-46);

// MID

wall(20,-10,60,-8);
wall(20,8,60,10);

// boxes

wall(5,18,8,21,2,BOX);
wall(-28,-60,-24,-56,2,BOX);

// =====================================
// INPUT
// =====================================

const keys = {};

addEventListener("keydown",e=>{

  keys[e.code] = true;
});

addEventListener("keyup",e=>{

  keys[e.code] = false;
});

// =====================================
// MOUSE LOOK
// =====================================

let pitchValue = 0;

addEventListener("mousemove",(e)=>{

  if(
    document.pointerLockElement !==
    document.body
  ) return;

  yaw.rotation.y -= e.movementX * 0.002;

  pitchValue -= e.movementY * 0.002;

  pitchValue = Math.max(
    -Math.PI/2,
    Math.min(Math.PI/2,pitchValue)
  );

  pitch.rotation.x = pitchValue;
});

// =====================================
// POINTER LOCK
// =====================================

const menu =
  document.getElementById("menu");

menu.onclick = ()=>{

  document.body.requestPointerLock();
};

document.addEventListener(
  "pointerlockchange",
  ()=>{

    menu.style.display =
      document.pointerLockElement
      ? "none"
      : "flex";
  }
);

// =====================================
// COLLISION
// =====================================

function collide(x,z){

  for(const b of blocks){

    if(

      Math.abs(x-b.position.x)<0.8 &&
      Math.abs(z-b.position.z)<0.8 &&
      b.position.y > -0.5

    ){
      return true;
    }
  }

  return false;
}

// =====================================
// MOVE
// =====================================

let vy = 0;
let grounded = false;

function move(){

  const dir = new THREE.Vector3();

  if(keys.KeyW) dir.z -= 1;
  if(keys.KeyS) dir.z += 1;
  if(keys.KeyA) dir.x -= 1;
  if(keys.KeyD) dir.x += 1;

  dir.normalize();

  const speed = 0.12;

  const angle = yaw.rotation.y;

  const fx = Math.sin(angle);
  const fz = Math.cos(angle);

  const rx = Math.sin(angle - Math.PI/2);
  const rz = Math.cos(angle - Math.PI/2);

  const mx =
    (-fx * dir.z + rx * dir.x)
    * speed;

  const mz =
    (-fz * dir.z + rz * dir.x)
    * speed;

  const nx = yaw.position.x + mx;
  const nz = yaw.position.z + mz;

  if(!collide(nx,yaw.position.z))
    yaw.position.x = nx;

  if(!collide(yaw.position.x,nz))
    yaw.position.z = nz;

  // gravity

  vy -= 0.008;

  yaw.position.y += vy;

  if(yaw.position.y < 2){

    yaw.position.y = 2;

    vy = 0;

    grounded = true;
  }

  if(keys.Space && grounded){

    vy = 0.16;

    grounded = false;
  }
}

// =====================================
// WEAPONS
// =====================================

const weapons = {

  ak47:{
    name:"AK-47",
    damage:36,
    fireRate:100,
    recoil:0.03,
    spread:0.02,
    ammo:30,
    maxAmmo:30,
    auto:true
  },

  deagle:{
    name:"Desert Eagle",
    damage:70,
    fireRate:400,
    recoil:0.08,
    spread:0.01,
    ammo:7,
    maxAmmo:7,
    auto:false
  },

  awp:{
    name:"AWP",
    damage:115,
    fireRate:1200,
    recoil:0.12,
    spread:0.001,
    ammo:5,
    maxAmmo:5,
    auto:false
  },

  ump45:{
    name:"UMP-45",
    damage:28,
    fireRate:85,
    recoil:0.02,
    spread:0.03,
    ammo:25,
    maxAmmo:25,
    auto:true
  }
};

let currentWeapon = weapons.ak47;

addEventListener("keydown",(e)=>{

  if(e.code==="Digit1")
    currentWeapon = weapons.ak47;

  if(e.code==="Digit2")
    currentWeapon = weapons.deagle;

  if(e.code==="Digit3")
    currentWeapon = weapons.awp;

  if(e.code==="Digit4")
    currentWeapon = weapons.ump45;
});

// =====================================
// SHOOT
// =====================================

let shooting = false;
let lastShot = 0;

addEventListener("mousedown",(e)=>{

  if(e.button!==0) return;

  shooting = true;
});

addEventListener("mouseup",()=>{

  shooting = false;
});

function shoot(){

  const now = performance.now();

  if(
    now-lastShot <
    currentWeapon.fireRate
  ) return;

  if(currentWeapon.ammo<=0)
    return;

  lastShot = now;

  currentWeapon.ammo--;

  const dir = new THREE.Vector3();

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

  const ray = new THREE.Raycaster(
    yaw.position,
    dir
  );

  const hits =
    ray.intersectObjects(blocks);

  if(hits.length){

    const p = hits[0].point;

    impact(
      p.x,
      p.y,
      p.z
    );
  }

  // bot hit

  for(const bot of bots){

    if(bot.dead) continue;

    const hitBot =
      ray.intersectObject(bot.mesh);

    if(hitBot.length){

      bot.hp -=
        currentWeapon.damage;

      blood(
        hitBot[0].point
      );

      if(bot.hp <= 0){

        bot.dead = true;

        bot.mesh.visible = false;

        bot.respawn = 300;
      }
    }
  }
}

// =====================================
// IMPACT
// =====================================

function impact(x,y,z){

  const mesh = new THREE.Mesh(

    new THREE.SphereGeometry(0.08),

    new THREE.MeshBasicMaterial({
      color:0x111111
    })
  );

  mesh.position.set(x,y,z);

  scene.add(mesh);

  setTimeout(()=>{

    scene.remove(mesh);

  },3000);
}

function blood(pos){

  const mesh = new THREE.Mesh(

    new THREE.SphereGeometry(0.15),

    new THREE.MeshBasicMaterial({
      color:0xff0000
    })
  );

  mesh.position.copy(pos);

  scene.add(mesh);

  setTimeout(()=>{

    scene.remove(mesh);

  },1000);
}

// =====================================
// BOTS
// =====================================

const bots = [];

function createBot(x,z,color=0xff0000){

  const mesh = new THREE.Mesh(

    new THREE.BoxGeometry(
      0.8,
      1.8,
      0.8
    ),

    new THREE.MeshLambertMaterial({
      color
    })
  );

  mesh.position.set(x,1,z);

  scene.add(mesh);

  bots.push({

    mesh,

    hp:100,

    speed:0.04,

    dir:new THREE.Vector3(),

    dead:false,

    respawn:0,

    cooldown:0
  });
}

createBot(-20,-20);
createBot(20,-40);
createBot(-35,15);
createBot(30,25);
createBot(-10,-60);

// =====================================
// PLAYER HP
// =====================================

let playerHP = 100;

// =====================================
// BOT AI
// =====================================

function updateBots(){

  for(const bot of bots){

    if(bot.dead){

      bot.respawn--;

      if(bot.respawn<=0){

        bot.dead = false;

        bot.hp = 100;

        bot.mesh.visible = true;

        bot.mesh.position.set(

          Math.random()*60-30,

          1,

          Math.random()*60-30
        );
      }

      continue;
    }

    const dx =
      yaw.position.x -
      bot.mesh.position.x;

    const dz =
      yaw.position.z -
      bot.mesh.position.z;

    const dist =
      Math.hypot(dx,dz);

    if(dist < 35){

      bot.dir.x = dx/dist;
      bot.dir.z = dz/dist;

      bot.mesh.position.x +=
        bot.dir.x * bot.speed;

      bot.mesh.position.z +=
        bot.dir.z * bot.speed;

      bot.mesh.lookAt(
        yaw.position.x,
        1,
        yaw.position.z
      );

      bot.cooldown--;

      if(
        dist < 20 &&
        bot.cooldown <= 0
      ){

        playerHP -= 8;

        flash();

        bot.cooldown = 60;

        if(playerHP <= 0){

          playerHP = 100;

          yaw.position.set(
            50,
            2,
            20
          );
        }
      }

    }else{

      if(Math.random()<0.01){

        bot.dir.x =
          Math.random()-0.5;

        bot.dir.z =
          Math.random()-0.5;
      }

      bot.mesh.position.x +=
        bot.dir.x * 0.02;

      bot.mesh.position.z +=
        bot.dir.z * 0.02;
    }
  }
}

// =====================================
// DAMAGE FLASH
// =====================================

function flash(){

  document.body.style.background =
    "rgba(255,0,0,0.2)";

  setTimeout(()=>{

    document.body.style.background =
      "#000";

  },100);
}

// =====================================
// HUD
// =====================================

const hud =
  document.getElementById("hud");

function updateHUD(){

  hud.innerHTML = `

  HP: ${playerHP}<br>
  WEAPON: ${currentWeapon.name}<br>
  AMMO: ${currentWeapon.ammo}/${currentWeapon.maxAmmo}<br><br>

  X: ${yaw.position.x.toFixed(1)}<br>
  Y: ${yaw.position.y.toFixed(1)}<br>
  Z: ${yaw.position.z.toFixed(1)}

  `;
}

// =====================================
// LOOP
// =====================================

function animate(){

  requestAnimationFrame(animate);

  move();

  updateBots();

  updateHUD();

  if(shooting){

    if(currentWeapon.auto){

      shoot();

    }
  }

  renderer.render(scene,camera);
}

animate();

// =====================================
// RESIZE
// =====================================

addEventListener("resize",()=>{

  camera.aspect =
    innerWidth/innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    innerWidth,
    innerHeight
  );
});
