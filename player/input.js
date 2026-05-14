export const keys = {};

export function setupInput(){

  addEventListener("keydown",e=>{

    keys[e.code] = true;
  });

  addEventListener("keyup",e=>{

    keys[e.code] = false;
  });
}
