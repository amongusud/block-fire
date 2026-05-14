import {
  block,
  blocks
} from "./blocks.js";

export {
  blocks
};

export function createMap(){

  const SAND = 0xd8c090;

  for(let x=-80;x<=80;x++){

    for(let z=-80;z<=80;z++){

      block(x,-1,z,SAND);
    }
  }
}
