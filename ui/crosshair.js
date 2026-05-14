const crosshair =
  document.createElement("div");

crosshair.innerHTML = "+";

crosshair.style.position =
  "absolute";

crosshair.style.left =
  "50%";

crosshair.style.top =
  "50%";

crosshair.style.transform =
  "translate(-50%,-50%)";

crosshair.style.color =
  "white";

crosshair.style.fontSize =
  "24px";

crosshair.style.zIndex =
  "5";

crosshair.style.pointerEvents =
  "none";

document.body.appendChild(
  crosshair
);
