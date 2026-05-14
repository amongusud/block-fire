import {
  camera
} from "../core/scene.js";

import {
  renderer
} from "../core/renderer.js";

addEventListener("resize",()=>{

  camera.aspect =
    innerWidth/innerHeight;

  camera.updateProjectionMatrix();

  renderer.setSize(
    innerWidth,
    innerHeight
  );
});
