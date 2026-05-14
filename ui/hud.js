const hud =
  document.getElementById("hud");

export function updateHUD(
  weapon
){

  hud.innerHTML = `
    <b>${weapon.name}</b>
    <br>

    Ammo:
    ${weapon.ammo}
    /
    ${weapon.maxAmmo}
  `;
}
