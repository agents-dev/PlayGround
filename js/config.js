export const CFG = {
  worldSize: 120,          // terrain extent (x/z from -60..60)
  gridN: 127,              // terrain segments (127 => 128x128 verts)
  waterLevel: -1.6,
  gravity: 24,
  wormRadius: 0.65,
  wormHeight: 1.5,
  moveSpeed: 7.0,
  jumpSpeed: 9.5,
  turnTime: 45,
  maxPower: 1.0,
  windMax: 9,
  bazooka:   { radius: 7.5, damage: 60, speedMin: 16, speedMax: 40, windK: 0.55 },
  grenade:   { radius: 6.5, damage: 50, speedMin: 9,  speedMax: 26, fuse: 3.0, bounce: 0.45 },
  shotgun:   { damage: 26, range: 60, shots: 2 },
  airstrike: { bombs: 6, radius: 5.5, damage: 34, spread: 4.5 },
};
CFG.fallDamageMin = 9;      // fall distance before damage
CFG.fallDamageScale = 6;    // hp per extra meter

export const WEAPONS = [
  { id: 'bazooka',   name: 'Bazooka',   ico: '🚀', key: '1' },
  { id: 'grenade',   name: 'Grenade',   ico: '💣', key: '2' },
  { id: 'shotgun',   name: 'Shotgun',   ico: '🔫', key: '3' },
  { id: 'airstrike', name: 'Airstrike', ico: '✈️', key: '4' },
  { id: 'teleport',  name: 'Teleport',  ico: '🌀', key: '5' },
];

export const NAMES_RED  = ['Rambo', 'Blaze', 'Crusher', 'Viper', 'Tank'];
export const NAMES_BLUE = ['Frosty', 'Sniper', 'Goblin', 'Pixel', 'Storm'];
