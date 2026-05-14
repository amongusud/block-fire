import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export const renderer =
  new THREE.WebGLRenderer({
    antialias:true
  });

renderer.setSize(
  innerWidth,
  innerHeight
);

renderer.shadowMap.enabled = true;

renderer.domElement.style.position =
  "absolute";

renderer.domElement.style.top = "0";

renderer.domElement.style.left = "0";

document.body.appendChild(
  renderer.domElement
);
