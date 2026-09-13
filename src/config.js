// Central tuning for STARCRAFT 3D — Neon Frontline
export const MAP_SIZE = 160;          // world units (square)
export const GROUND_Y = 0;

export const DIFFICULTY = {
  recruit:   { aiInterval: 75, aiBatch: 1, enemyHpMul: 0.8, enemyDmgMul: 0.75, label: 'RECRUIT' },
  veteran:   { aiInterval: 50, aiBatch: 2, enemyHpMul: 1.0, enemyDmgMul: 1.0,  label: 'VETERAN' },
  nightmare: { aiInterval: 34, aiBatch: 3, enemyHpMul: 1.3, enemyDmgMul: 1.25, label: 'NIGHTMARE' },
};

// owner: 'player' | 'enemy'
export const UNITS = {
  scv:           { name: 'SCV', icon: '👷', hp: 60,  speed: 9,  sight: 16, range: 1.6, dmg: 5,  cooldown: 1.0, cost: { m: 50 }, flying: false, harvester: true, desc: 'Worker. Harvests crystals + gas.' },
  marine:        { name: 'Marine', icon: '🪖', hp: 55,  speed: 8,  sight: 18, range: 9,  dmg: 7,  cooldown: 0.55, cost: { m: 50 }, flying: false, desc: 'Core infantry. Fast + cheap.' },
  tank:          { name: 'Siege Tank', icon: '🚀', hp: 170, speed: 5.5, sight: 20, range: 12, dmg: 26, cooldown: 1.6, aoe: 3.5, cost: { m: 150, g: 50 }, flying: false, desc: 'Splash damage, long range.' },
  wraith:        { name: 'Wraith', icon: '✈', hp: 115, speed: 13, sight: 22, range: 10, dmg: 12, cooldown: 0.8, cost: { m: 150, g: 75 }, flying: true, desc: 'Air superiority fighter.' },
  battlecruiser: { name: 'Battlecruiser', icon: '🛸', hp: 550, speed: 5,  sight: 24, range: 12, dmg: 16, bursts: 3, cooldown: 1.1, cost: { m: 400, g: 250 }, flying: true, desc: 'Capital ship. Yamato barrage.' },
  zergling:      { name: 'Zergling', icon: '🦗', hp: 42,  speed: 10.5, sight: 16, range: 1.8, dmg: 6,  cooldown: 0.8, cost: {}, flying: false, desc: 'Fast melee swarmer.' },
  hydralisk:     { name: 'Hydralisk', icon: '🐍', hp: 95,  speed: 7.5, sight: 19, range: 9,  dmg: 11, cooldown: 0.9, cost: {}, flying: false, desc: 'Ranged swarm infantry.' },
  ultralisk:     { name: 'Ultralisk', icon: '🦏', hp: 450, speed: 6.5, sight: 18, range: 2.4, dmg: 32, cooldown: 1.4, aoe: 3, cost: {}, flying: false, desc: 'Living siege beast.' },
};

export const BUILDINGS = {
  command:  { name: 'Command Center', icon: '🏢', hp: 1500, size: 9,   cost: { m: 0 },   supply: 15, trains: ['scv'], desc: 'HQ. Trains SCVs. Drop-off point.' },
  depot:    { name: 'Supply Depot',   icon: '🏠', hp: 400,  size: 4.5, cost: { m: 100 }, supply: 8,  desc: '+8 Supply.' },
  refinery: { name: 'Refinery',       icon: '⛽', hp: 600,  size: 5.5, cost: { m: 75 },  desc: 'Enables gas harvesting.' },
  barracks: { name: 'Barracks',       icon: '🪖', hp: 800,  size: 7,   cost: { m: 150 }, trains: ['marine'], desc: 'Trains Marines.' },
  factory:  { name: 'Factory',        icon: '🏭', hp: 900,  size: 7.5, cost: { m: 200, g: 100 }, trains: ['tank'], desc: 'Builds Siege Tanks.' },
  starport: { name: 'Starport',       icon: '✈', hp: 900,  size: 7.5, cost: { m: 250, g: 150 }, trains: ['wraith', 'battlecruiser'], desc: 'Wraiths + Battlecruisers.' },
  turret:   { name: 'Missile Turret', icon: '🔫', hp: 350,  size: 3.2, cost: { m: 100 }, defender: true, range: 11, dmg: 13, cooldown: 0.7, desc: 'Static air+ground defense.' },
  // enemy
  hatchery: { name: 'Swarm Hatchery', icon: '🪺', hp: 1400, size: 9,   cost: {}, enemy: true, desc: 'Swarm HQ.' },
  spire:    { name: 'Swarm Spire',    icon: '🗼', hp: 700,  size: 6,   cost: {}, enemy: true, desc: 'Spawns air hunters.' },
  sunken:   { name: 'Sunken Colony',  icon: '🌵', hp: 500,  size: 4,   cost: {}, enemy: true, defender: true, range: 10, dmg: 14, cooldown: 1.0, desc: 'Living defense.' },
};

export const TRAIN_TIME = { scv: 9, marine: 11, tank: 20, wraith: 24, battlecruiser: 42 };
export const BUILD_TIME = { depot: 12, refinery: 12, barracks: 22, factory: 28, starport: 32, turret: 10 };

export const HARVEST = { mineralPerTrip: 5, gasPerTrip: 4, gatherTime: 2.2 };

export function costText(cost) {
  const parts = [];
  if (cost.m) parts.push(`${cost.m}⚙`);
  if (cost.g) parts.push(`${cost.g}⛽`);
  return parts.join(' ') || '—';
}
