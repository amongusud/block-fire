export const weapons = {

  ak47: {
    name: "AK-47",
    damage: 35,
    fireRate: 90,
    recoil: 0.03,
    spread: 0.02,
    ammo: 30,
    maxAmmo: 30,
    auto: true
  },

  deagle: {
    name: "Desert Eagle",
    damage: 70,
    fireRate: 450,
    recoil: 0.08,
    spread: 0.01,
    ammo: 7,
    maxAmmo: 7,
    auto: false
  },

  awp: {
    name: "AWP",
    damage: 120,
    fireRate: 1200,
    recoil: 0.18,
    spread: 0.001,
    ammo: 5,
    maxAmmo: 5,
    auto: false
  },

  ump45: {
    name: "UMP-45",
    damage: 28,
    fireRate: 80,
    recoil: 0.02,
    spread: 0.03,
    ammo: 25,
    maxAmmo: 25,
    auto: true
  }
};

// arma atual
export let currentWeapon = weapons.ak47;

// troca de armas + recarregar
addEventListener("keydown", (e) => {

  if (e.code === "Digit1") currentWeapon = weapons.ak47;
  if (e.code === "Digit2") currentWeapon = weapons.deagle;
  if (e.code === "Digit3") currentWeapon = weapons.awp;
  if (e.code === "Digit4") currentWeapon = weapons.ump45;

  if (e.code === "KeyR") {
    currentWeapon.ammo = currentWeapon.maxAmmo;
  }
});
