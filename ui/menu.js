const menu =
  document.getElementById("menu");

document
.getElementById("playBtn")
.onclick = ()=>{

  document.body
  .requestPointerLock();
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
