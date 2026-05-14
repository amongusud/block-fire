window.addEventListener("DOMContentLoaded", () => {
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

// ================= SCENE =================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
scene.fog = new THREE.Fog(0x87ceeb,20,180);

// ================= CAMERA =================
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
const yaw = new THREE.Object3D();
const pitch = new THREE.Object3D();
yaw.position.set(50,2,20);
scene.add(yaw);
yaw.add(pitch);
pitch.add(camera);

// ================= RENDERER =================
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// ================= LIGHT =================
scene.add(new THREE.AmbientLight(0xffffff,0.5));
const sun = new THREE.DirectionalLight(0xffffff,1.2);
sun.position.set(50,80,40);
scene.add(sun);

// ================= BLOCKS =================
const blocks = [];
const geo = new THREE.BoxGeometry(1,1,1);
function block(x,y,z,color){
  const mesh = new THREE.Mesh(geo,new THREE.MeshLambertMaterial({color}));
  mesh.position.set(x,y,z);
  scene.add(mesh);
  blocks.push(mesh);
}

// ================= MAP =================
const SAND = 0xd8c090;
// floor
for(let x=-80;x<=80;x++) for(let z=-80;z<=80;z++) block(x,-1,z,SAND);
// walls
function wall(x1,z1,x2,z2,h=5,c=0x8b5a2b){
  for(let x=x1;x<=x2;x++) for(let z=z1;z<=z2;z++) for(let y=0;y<h;y++) block(x,y,z,c);
}
// outer
wall(-80,-80,80,-78); wall(-80,78,80,80);
wall(-80,-80,-78,80); wall(78,-80,80,80);
// mid
wall(-10,-10,10,-8); wall(-10,8,10,10);

// ================= INPUT =================
const keys={};
addEventListener("keydown",e=>keys[e.code]=true);
addEventListener("keyup",e=>keys[e.code]=false);

// ================= WEAPONS =================
const weapons={
  ak47:{name:"AK-47",damage:35,fireRate:90,recoil:0.03,spread:0.02,ammo:30,maxAmmo:30,auto:true},
  deagle:{name:"Desert Eagle",damage:70,fireRate:450,recoil:0.08,spread:0.01,ammo:7,maxAmmo:7,auto:false},
  awp:{name:"AWP",damage:120,fireRate:1200,recoil:0.15,spread:0.001,ammo:5,maxAmmo:5,auto:false},
  ump45:{name:"UMP-45",damage:28,fireRate:80,recoil:0.02,spread:0.03,ammo:25,maxAmmo:25,auto:true}
};
let currentWeapon=weapons.ak47;
addEventListener("keydown",e=>{
  if(e.code==="Digit1") currentWeapon=weapons.ak47;
  if(e.code==="Digit2") currentWeapon=weapons.deagle;
  if(e.code==="Digit3") currentWeapon=weapons.awp;
  if(e.code==="Digit4") currentWeapon=weapons.ump45;
  if(e.code==="KeyR") currentWeapon.ammo=currentWeapon.maxAmmo;
});

// ================= MOUSE =================
let pitchValue=0;
addEventListener("mousemove",e=>{
  if(document.pointerLockElement!==document.body) return;
  yaw.rotation.y-=e.movementX*0.002;
  pitchValue-=e.movementY*0.002;
  pitchValue=Math.max(-Math.PI/2,Math.min(Math.PI/2,pitchValue));
  pitch.rotation.x=pitchValue;
});

// ================= MENU =================
const menu=document.getElementById("menu");
document.getElementById("playBtn").onclick=()=>document.body.requestPointerLock();
document.addEventListener("pointerlockchange",()=>{menu.style.display=document.pointerLockElement?"none":"flex";});

// ================= MOVE =================
let vy=0,grounded=false;
function move(){
  const dir=new THREE.Vector3();
  if(keys.KeyW) dir.z-=1;
  if(keys.KeyS) dir.z+=1;
  if(keys.KeyA) dir.x-=1;
  if(keys.KeyD) dir.x+=1;
  dir.normalize();
  const speed=0.12,a=yaw.rotation.y;
  const fx=Math.sin(a),fz=Math.cos(a),rx=Math.sin(a-Math.PI/2),rz=Math.cos(a-Math.PI/2);
  yaw.position.x+=(-fx*dir.z+rx*dir.x)*speed;
  yaw.position.z+=(-fz*dir.z+rz*dir.x)*speed;
  vy-=0.008; yaw.position.y+=vy;
  if(yaw.position.y<=2){yaw.position.y=2; vy=0; grounded=true;}
  if(keys.Space && grounded){vy=0.16; grounded=false;}
}

// ================= SHOOT =================
let shooting=false,lastShot=0;
addEventListener("mousedown",e=>{if(e.button===0)shooting=true});
addEventListener("mouseup",()=>shooting=false);
function shoot(){
  const now=performance.now();
  if(now-lastShot<currentWeapon.fireRate) return;
  if(currentWeapon.ammo<=0) return;
  lastShot=now; currentWeapon.ammo--;
  const dir=new THREE.Vector3();
  pitch.getWorldDirection(dir);
  dir.x+=(Math.random()-0.5)*currentWeapon.spread;
  dir.y+=(Math.random()-0.5)*currentWeapon.spread;
  dir.z+=(Math.random()-0.5)*currentWeapon.spread;
  dir.normalize();
  pitch.rotation.x+=currentWeapon.recoil;
  const ray=new THREE.Raycaster(yaw.position,dir);
  const hits=ray.intersectObjects(blocks);
  if(hits.length){
    const p=hits[0].point;
    const s=new THREE.Mesh(new THREE.SphereGeometry(0.1),new THREE
