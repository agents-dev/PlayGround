// Hearthstone Clone — Tavern Brawl vs AI
// Vanilla JS, no deps. Player (Jaina Mage) vs AI (Garrosh Warrior).

const CARDS = {
  murloc:     { id:'murloc', name:'Murloc Raider', cost:1, type:'minion', atk:2, hp:1, art:'🐟', text:'' },
  raptor:     { id:'raptor', name:'Bloodfen Raptor', cost:2, type:'minion', atk:3, hp:2, art:'🦖', text:'' },
  croco:      { id:'croco', name:'River Crocolisk', cost:2, type:'minion', atk:2, hp:3, art:'🐊', text:'' },
  hoarder:    { id:'hoarder', name:'Loot Hoarder', cost:2, type:'minion', atk:2, hp:1, art:'💀', text:'Deathrattle: Draw a card.', deathrattle:'draw' },
  grizzly:    { id:'grizzly', name:'Ironfur Grizzly', cost:3, type:'minion', atk:3, hp:3, art:'🐻', text:'Taunt', taunt:true },
  cleric:     { id:'cleric', name:'Shattered Sun Cleric', cost:3, type:'minion', atk:3, hp:2, art:'☀️', text:'Battlecry: Give a friendly minion +1/+1.', battlecry:'buff-friendly', need:'friendly-minion' },
  yeti:       { id:'yeti', name:'Chillwind Yeti', cost:4, type:'minion', atk:4, hp:5, art:'❄️', text:'' },
  senjin:     { id:'senjin', name:"Sen'jin Shieldmasta", cost:4, type:'minion', atk:3, hp:5, art:'🗿', text:'Taunt', taunt:true },
  argent:     { id:'argent', name:'Argent Squire', cost:1, type:'minion', atk:1, hp:1, art:'⚔️', text:'Divine Shield', divine:true },
  elemental:  { id:'elemental', name:'Fire Elemental', cost:6, type:'minion', atk:6, hp:5, art:'🔥', text:'Battlecry: Deal 3 damage.', battlecry:'dmg3', need:'any' },
  rocketeer:  { id:'rocketeer', name:'Reckless Rocketeer', cost:6, type:'minion', atk:5, hp:2, art:'🚀', text:'Charge', charge:true },
  ogre:       { id:'ogre', name:'Boulderfist Ogre', cost:6, type:'minion', atk:6, hp:7, art:'👹', text:'' },
  stormwind:  { id:'stormwind', name:'Stormwind Champion', cost:7, type:'minion', atk:6, hp:6, art:'🏇', text:'Battlecry: Give your other minions +1/+1.' , battlecry:'stormwind' },
  golem:      { id:'golem', name:'War Golem', cost:7, type:'minion', atk:7, hp:7, art:'🤖', text:'' },
  frostbolt:  { id:'frostbolt', name:'Frostbolt', cost:2, type:'spell', art:'❄️', text:'Deal 3 damage.', spell:'dmg3', need:'any' },
  fireball:   { id:'fireball', name:'Fireball', cost:4, type:'spell', art:'🔥', text:'Deal 6 damage.', spell:'dmg6', need:'any' },
  arcane:     { id:'arcane', name:'Arcane Intellect', cost:3, type:'spell', art:'📖', text:'Draw 2 cards.', spell:'draw2' },
  consec:     { id:'consec', name:'Consecration', cost:4, type:'spell', art:'✨', text:'Deal 2 damage to all enemies.', spell:'aoe2' },
  holy:       { id:'holy', name:'Holy Light', cost:2, type:'spell', art:'💚', text:'Restore 6 Health.', spell:'heal6', need:'friendly-char' },
  assass:     { id:'assass', name:'Assassinate', cost:5, type:'spell', art:'🗡️', text:'Destroy a minion.', spell:'destroy', need:'enemy-minion' },
  poly:       { id:'poly', name:'Polymorph', cost:4, type:'spell', art:'🐑', text:'Transform a minion into a 1/1 Sheep.', spell:'poly', need:'enemy-minion' },
  firelands:  { id:'firelands', name:'Firelands Portal', cost:7, type:'spell', art:'🌀', text:'Deal 5 damage. Summon a 5/4 Golem.', spell:'firelands', need:'any' },
  coin:       { id:'coin', name:'The Coin', cost:0, type:'spell', art:'🪙', text:'Gain 1 Mana this turn.', spell:'coin' },
  sheep:      { id:'sheep', name:'Sheep', cost:1, type:'minion', atk:1, hp:1, art:'🐑', text:'' },
  golemtok:   { id:'golemtok', name:'Stone Golem', cost:5, type:'minion', atk:5, hp:4, art:'🪨', text:'' },
};

const PLAYER_DECK = ['argent','murloc','raptor','croco','hoarder','frostbolt','grizzly','cleric','arcane','yeti','senjin','poly','fireball','consec','elemental','rocketeer','ogre','stormwind','firelands','golem',
  'murloc','raptor','hoarder','frostbolt','grizzly','cleric','yeti','senjin','fireball','consec'];
const ENEMY_DECK = ['argent','murloc','raptor','croco','hoarder','holy','grizzly','cleric','frostbolt','yeti','senjin','assass','fireball','consec','elemental','rocketeer','ogre','stormwind','firelands','golem',
  'croco','raptor','holy','grizzly','cleric','yeti','fireball','senjin','ogre','elemental'];

let uid = 1;
let G = null;
let pending = null; // {kind, cardIndex, attackerUid, def, need}
let aiBusy = false;

const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const rnd = (a) => a[Math.floor(Math.random() * a.length)];

function mkMinion(cardId, side) {
  const c = CARDS[cardId];
  return { uid: uid++, cardId, name: c.name, art: c.art, text: c.text, cost: c.cost,
    atk: c.atk, hp: c.hp, maxHp: c.hp, taunt: !!c.taunt, divine: !!c.divine,
    charge: !!c.charge, deathrattle: c.deathrattle || null,
    canAttack: false, attacksLeft: 0, side };
}
function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

function newGame() {
  uid = 1; pending = null; aiBusy = false;
  G = {
    turn: 1, active: 'player', over: false,
    player: { hp:30, armor:0, maxMana:0, mana:0, deck:shuffle([...PLAYER_DECK]), hand:[], board:[], fatigue:0, powerUsed:false },
    enemy:  { hp:30, armor:0, maxMana:0, mana:0, deck:shuffle([...ENEMY_DECK]), hand:[], board:[], fatigue:0, powerUsed:false },
  };
  drawCards('player', 3); drawCards('enemy', 4);
  G.player.hand.push('coin');
  $('gameover').classList.add('hidden');
  log('sys', '🍺 New brawl! Jaina (you) vs Garrosh (AI). You go first — good luck!');
  log('sys', '🪙 You got The Coin! +1 mana when you need it.');
  startTurn('player');
}

function drawCards(side, n) {
  const P = G[side];
  for (let i=0;i<n;i++) {
    if (P.deck.length === 0) {
      P.fatigue++;
      damageHero(side, P.fatigue, true);
      log('sys', `😩 ${label(side)} takes ${P.fatigue} fatigue damage (deck empty)!`);
      if (G.over) return;
    } else {
      const c = P.deck.pop();
      if (P.hand.length >= 10) { log('sys', `🔥 ${label(side)} hand full — ${CARDS[c].name} burned!`); }
      else P.hand.push(c);
    }
  }
}
function label(side){ return side==='player'?'Jaina (you)':'Garrosh (AI)'; }

// ---------- damage / heal / death ----------
function fxAt(el, text, color='#fff') {
  if (!el) return;
  const r = el.getBoundingClientRect();
  const d = document.createElement('div');
  d.className = 'fx'; d.textContent = text; d.style.color = color;
  d.style.left = (r.left + r.width/2 - 10) + 'px'; d.style.top = (r.top - 6) + 'px';
  $('fx-layer').appendChild(d); setTimeout(()=>d.remove(), 1000);
}
function damageHero(side, n, isFatigue=false) {
  const P = G[side];
  let left = n;
  if (P.armor > 0 && !isFatigue) { const soak = Math.min(P.armor, left); P.armor -= soak; left -= soak; }
  P.hp -= left;
  checkOver();
}
function healHero(side, n) {
  const P = G[side]; P.hp = Math.min(30, P.hp + n);
}
function damageMinion(min, n) {
  if (min.divine && n > 0) {
    min.divine = false; log('sys', `✨ ${min.name}'s Divine Shield pops!`);
    if (window.FX) { const c = fxCenter(minionNode(min.side, min.uid)); if (c) FX.shieldPop(c.x, c.y); }
    return;
  }
  min.hp -= n;
}
function killCheck(side) {
  const P = G[side];
  const dead = P.board.filter(m => m.hp <= 0);
  P.board = P.board.filter(m => m.hp > 0);
  for (const d of dead) {
    if (window.FX) { const c = fxCenter(minionNode(d.side, d.uid)); if (c) FX.death(c.x, c.y); }
    log(d.side==='player'?'me':'foe', `☠️ ${d.name} dies.`);
    if (d.deathrattle === 'draw') { log('sys', `💀 ${d.name} draws a card for ${label(d.side)}!`); drawCards(d.side, 1); }
  }
}
function checkOver() {
  if (!G || G.over) return;
  if (G.player.hp <= 0 && G.enemy.hp <= 0) return endGame('draw');
  if (G.player.hp <= 0) return endGame('enemy');
  if (G.enemy.hp <= 0) return endGame('player');
}
function endGame(winner) {
  G.over = true;
  const t = $('gameover-title'), e = $('gameover-emoji'), s = $('gameover-sub');
  $('gameover').classList.remove('hidden');
  if (winner === 'player') { e.textContent='🏆'; t.textContent='Victory!'; s.textContent=`Garrosh crumbles on turn ${G.turn}. The tavern roars your name!`; }
  else if (winner === 'enemy') { e.textContent='💀'; t.textContent='Defeat…'; s.textContent=`Garrosh smashes you on turn ${G.turn}. Have another ale and try again!`; }
  else { e.textContent='🤝'; t.textContent='Draw!'; s.textContent='Both heroes fall at once. Legendary!'; }
  render();
  if (window.FX) {
    if (winner === 'player') FX.celebrate();
    else if (winner === 'enemy') FX.defeat();
    else { FX.celebrate(); }
  }
}

// ---------- turns ----------
function startTurn(side) {
  if (G.over) return;
  G.active = side;
  const P = G[side];
  P.maxMana = Math.min(10, P.maxMana + 1);
  P.mana = P.maxMana; P.powerUsed = false;
  for (const m of P.board) { m.canAttack = true; m.attacksLeft = 1; }
  pending = null;
  if (side === 'player' && G.turn > 1 || side==='player' && G.turn===1) { /* first turn no draw? HS draws */ }
  drawCards(side, 1);
  if (G.over) { render(); return; }
  banner(side === 'player' ? 'YOUR TURN' : 'ENEMY TURN');
  log('sys', side==='player' ? `— Turn ${G.turn}: your turn (${P.mana} mana) —` : `— Turn ${G.turn}: Garrosh's turn —`);
  render();
  if (side === 'enemy') enemyAI();
}
function endTurn() {
  if (G.over || G.active !== 'player' || aiBusy) return;
  pending = null;
  G.turn++;
  startTurn('enemy');
}

function banner(text) {
  const b = $('turn-banner');
  b.textContent = text; b.classList.remove('hidden');
  setTimeout(()=>b.classList.add('hidden'), 1100);
}

// ---------- playing cards ----------
function canPlay(side, idx) {
  if (G.active !== side || G.over) return false;
  const P = G[side];
  const def = CARDS[P.hand[idx]];
  if (!def) return false;
  if (P.mana < def.cost) return false;
  if (def.type === 'minion' && P.board.length >= 7) return false;
  return true;
}

function clickHandCard(side, idx) {
  if (side !== 'player' || G.active !== 'player' || aiBusy || G.over) return;
  if (!canPlay('player', idx)) return;
  const def = CARDS[G.player.hand[idx]];
  if ((def.need) || def.battlecry === 'buff-friendly' || (def.type==='minion' && def.battlecry)) {
    // spells/minions needing targets enter targeting mode
    const need = def.need || (def.battlecry ? CARDS[def.id].need || needForBattlecry(def) : null);
    if (need) { pending = { kind: def.type==='minion'?'play-minion':'play-spell', cardIndex: idx, def, need }; showHint(); render(); return; }
  }
  playCard('player', idx, null);
}
function needForBattlecry(def) {
  if (def.battlecry === 'dmg3') return 'any';
  if (def.battlecry === 'buff-friendly') return 'friendly-minion';
  return null;
}

function playCard(side, idx, target) {
  const P = G[side];
  const cardId = P.hand[idx];
  const def = CARDS[cardId];
  if (P.mana < def.cost) return false;
  if (def.type === 'minion' && P.board.length >= 7) return false;
  P.mana -= def.cost;
  P.hand.splice(idx, 1);
  let summoned = null;
  if (def.type === 'minion') {
    const m = mkMinion(cardId, side);
    m.canAttack = !!def.charge; m.attacksLeft = def.charge ? 1 : 0;
    P.board.push(m);
    summoned = m;
    log(side==='player'?'me':'foe', `${side==='player'?'🃏 You play':'🤖 Garrosh plays'} ${def.name} (${def.cost}) ${def.atk}/${def.hp}.`);
    if (def.battlecry) doBattlecry(side, m, target);
  } else {
    log(side==='player'?'me':'foe', `${side==='player'?'✨ You cast':'🤖 Garrosh casts'} ${def.name} (${def.cost}).`);
    doSpell(side, def, target, idx);
  }
  killCheck('player'); killCheck('enemy'); checkOver();
  pending = null; hideHint(); render();
  if (summoned && window.FX && !G.over) { const c = fxCenter(minionNode(side, summoned.uid)); if (c) FX.summon(c.x, c.y); }
  return true;
}

function resolveTarget(t) {
  // t: {kind:'hero'|'minion', side, uid?}
  if (!t) return null;
  if (t.kind === 'hero') return { kind:'hero', side: t.side };
  const board = G[t.side].board;
  return { kind:'minion', side: t.side, min: board.find(m=>m.uid===t.uid) };
}

function doBattlecry(side, m, target) {
  const foe = side==='player'?'enemy':'player';
  const friends = G[side].board;
  if (m.cardId === 'cleric') {
    const t = target && target.kind==='minion' && target.side===side ? target.min : null;
    const pick = t || rnd(friends.filter(x=>x.uid!==m.uid)) || m;
    pick.atk += 1; pick.hp += 1; pick.maxHp += 1;
    log('sys', `☀️ ${m.name} gives +1/+1 to ${pick.name}.`);
    if (window.FX) setTimeout(() => { const c = fxCenter(minionNode(side, pick.uid)); if (c) FX.buff(c.x, c.y); }, 60);
  } else if (m.cardId === 'elemental') {
    const t = target ? resolveTarget(target) : null;
    let fxTo = null;
    if (!t) { // no target? hit random enemy
      if (G[foe].board.length) { const v = rnd(G[foe].board); damageMinion(v, 3); fxFloat(foe, v.uid, '-3', '#f66'); fxTo = { kind: 'minion', side: foe, uid: v.uid }; }
      else { damageHero(foe, 3); fxTo = { kind: 'hero', side: foe }; }
    } else if (t.kind==='hero') { damageHero(t.side, 3); fxTo = { kind: 'hero', side: t.side }; }
    else { damageMinion(t.min, 3); fxTo = { kind: 'minion', side: t.side, uid: t.min.uid }; }
    log('sys', `🔥 ${m.name} deals 3 damage.`);
    if (window.FX) { const from = fxCenter(heroNode(side)); const to = targetCenter(fxTo); if (from && to) FX.fireball(from, to, () => FX.explosion(to.x, to.y, 0.7)); }
  } else if (m.cardId === 'stormwind') {
    for (const f of friends) if (f.uid!==m.uid) { f.atk+=1; f.hp+=1; f.maxHp+=1; }
    log('sys', `🏇 ${m.name} inspires the team: +1/+1!`);
    if (window.FX) setTimeout(() => { for (const f of G[side].board) { const c = fxCenter(minionNode(side, f.uid)); if (c) FX.buff(c.x, c.y); } }, 60);
  }
}

function doSpell(side, def, target, idx) {
  const me = G[side], foeSide = side==='player'?'enemy':'player', foe = G[foeSide];
  const T = target ? resolveTarget(target) : null;
  const hurt = (t, n) => { if (!t) return; if (t.kind==='hero') damageHero(t.side, n); else damageMinion(t.min, n); };
  switch (def.spell) {
    case 'coin': me.mana = Math.min(10, me.mana + 1); break;
    case 'dmg3': hurt(T, 3); break;
    case 'dmg6': hurt(T, 6); break;
    case 'draw2': drawCards(side, 2); break;
    case 'aoe2':
      for (const m of [...foe.board]) damageMinion(m, 2);
      damageHero(foeSide, 2); break;
    case 'heal6':
      if (T && T.kind==='hero') healHero(T.side, 6);
      else if (T && T.kind==='minion') { T.min.hp = Math.min(T.min.maxHp, T.min.hp + 6); }
      else healHero(side, 6); break;
    case 'destroy':
      if (T && T.kind==='minion') { T.min.hp = 0; } break;
    case 'poly':
      if (T && T.kind==='minion') {
        const b = G[T.side].board; const i = b.indexOf(T.min);
        const s = mkMinion('sheep', T.side); s.canAttack = false;
        b.splice(i, 1, s); log('sys', `🐑 ${T.min.name} is polymorphed!`);
      } break;
    case 'firelands':
      hurt(T, 5);
      if (me.board.length < 7) {
        const g = mkMinion('golemtok', side); g.canAttack=false; me.board.push(g);
        log('sys','🪨 A Stone Golem rises through the portal!');
        if (window.FX) { const gu = g.uid, gs = side; setTimeout(() => { const c = fxCenter(minionNode(gs, gu)); if (c) FX.summon(c.x, c.y); }, 60); }
      }
      break;
  }
  spellFx(side, def, target);
}

// ---------- combat ----------
function attackerTauntsBlock(attackerSide) {
  const foeSide = attackerSide==='player'?'enemy':'player';
  return G[foeSide].board.some(m=>m.taunt);
}
function clickMinion(side, muid) {
  if (G.over) return;
  // If we're choosing a target for pending action / attack, this minion may be the target
  if (pending) { tryTarget({ kind:'minion', side, uid:muid }); return; }
  // Otherwise, maybe selecting our attacker
  if (side==='player' && G.active==='player' && !aiBusy) {
    const m = G.player.board.find(x=>x.uid===muid);
    if (m && m.canAttack && m.attacksLeft>0) { pending = { kind:'attack', attackerUid:muid }; showHint(); render(); }
  }
}
function clickHero(side) {
  if (G.over) return;
  if (pending) { tryTarget({ kind:'hero', side }); return; }
  if (side==='player' && G.active==='player' && !aiBusy) {
    // clicking own hero with nothing pending: nothing
  }
}
function tryTarget(t) {
  if (!pending) return;
  if (!isValidTarget(pending, t)) { log('sys','⛔ Invalid target.'); return; }
  if (pending.kind === 'attack') {
    doAttack('player', pending.attackerUid, t);
    pending = null; hideHint(); render();
  } else if (pending.kind === 'play-minion' || pending.kind === 'play-spell') {
    playCard('player', pending.cardIndex, t);
  } else if (pending.kind === 'power') {
    usePower('player', t);
    pending = null; hideHint(); render();
  }
}
function isValidTarget(p, t) {
  const need = p.need || (p.kind==='attack' ? 'enemy-with-taunt' : 'any');
  if (p.kind === 'attack') {
    if (t.kind==='hero') {
      if (t.side!=='enemy') return false;
      return !attackerTauntsBlock('player');
    } else {
      if (t.side!=='enemy') return false;
      const taunts = G.enemy.board.some(m=>m.taunt);
      const target = G.enemy.board.find(m=>m.uid===t.uid);
      if (!target) return false;
      if (taunts && !target.taunt) return false;
      return true;
    }
  }
  if (need === 'any') return true;
  if (need === 'enemy-minion') return t.kind==='minion' && t.side==='enemy';
  if (need === 'friendly-minion') return t.kind==='minion' && t.side==='player';
  if (need === 'friendly-char') return t.side==='player';
  return true;
}

function doAttack(side, attackerUid, t) {
  const me = G[side], foeSide = side==='player'?'enemy':'player';
  const atk = me.board.find(m=>m.uid===attackerUid);
  if (!atk || atk.attacksLeft<=0) return;
  atk.attacksLeft--; atk.canAttack = atk.attacksLeft>0;
  if (window.FX) {
    const a = fxCenter(minionNode(side, attackerUid));
    const b = targetCenter(t);
    if (a && b) FX.slash(a.x, a.y, b.x, b.y);
    if (t.kind === 'hero' && atk.atk >= 5 && b) FX.explosion(b.x, b.y, 0.6);
  }
  if (t.kind === 'hero') {
    log(side==='player'?'me':'foe', `⚔️ ${atk.name} (${atk.atk}) hits ${label(foeSide==='player'?'player':'enemy')} hero face!`);
    damageHero(t.side, atk.atk);
    fxHero(t.side, `-${atk.atk}`);
  } else {
    const def = G[t.side].board.find(m=>m.uid===t.uid);
    if (!def) return;
    log(side==='player'?'me':'foe', `⚔️ ${atk.name} (${atk.atk}/${atk.hp}) trades into ${def.name} (${def.atk}/${def.hp}).`);
    damageMinion(def, atk.atk); damageMinion(atk, def.atk);
    fxFloat(t.side, def.uid, `-${atk.atk}`, '#f66'); fxFloat(side, atk.uid, `-${def.atk}`, '#f66');
  }
  killCheck('player'); killCheck('enemy'); checkOver();
}

// ---------- hero powers ----------
function clickPower(side) {
  if (G.over || aiBusy) return;
  if (side!=='player' || G.active!=='player') return;
  const P = G.player;
  if (P.powerUsed || P.mana < 2) return;
  pending = { kind:'power', need:'any' }; showHint(); render();
}
function usePower(side, target) {
  const P = G[side];
  if (P.powerUsed || P.mana < 2) return false;
  if (side === 'player') {
    P.mana -= 2; P.powerUsed = true;
    const T = target ? resolveTarget(target) : { kind:'hero', side:'enemy' };
    if (T.kind==='hero') damageHero(T.side, 1); else damageMinion(T.min, 1);
    log('me','🔥 Fireblast deals 1 damage.');
    if (window.FX) {
      const from = fxCenter(heroNode('player'));
      const tc = T.kind === 'hero' ? fxCenter(heroNode(T.side)) : fxCenter(minionNode(T.side, T.min.uid));
      if (from && tc) FX.fireblast(from, tc, () => FX.explosion(tc.x, tc.y, 0.45));
    }
    killCheck('player'); killCheck('enemy'); checkOver();
    return true;
  } else {
    P.mana -= 2; P.powerUsed = true; P.armor += 2;
    log('foe','🛡️ Garrosh gains 2 Armor!');
    if (window.FX) { const c = fxCenter(heroNode('enemy')); if (c) FX.armor(c.x, c.y); }
    return true;
  }
}

// ---------- enemy AI ----------
async function enemyAI() {
  aiBusy = true; render();
  await sleep(900);
  if (G.over) { aiBusy=false; return; }
  const E = G.enemy;
  // 1) play cards, best-first, a few passes
  for (let pass=0; pass<6; pass++) {
    if (G.over) break;
    const playable = E.hand.map((c,i)=>({c,i,def:CARDS[c]})).filter(x=>E.mana>=x.def.cost && (x.def.type!=='minion'||E.board.length<7));
    if (!playable.length) break;
    // priority: minions on curve > removal > burn > draw
    playable.sort((a,b)=> b.def.cost - a.def.cost);
    let acted = false;
    for (const p of playable) {
      if (G.over) break;
      if (E.mana < p.def.cost) continue;
      if (p.def.type==='minion' && E.board.length>=7) continue;
      const idx = E.hand.indexOf(p.c);
      if (idx<0) continue;
      if (p.def.type==='minion') {
        let tgt = null;
        if (p.def.battlecry==='dmg3') tgt = pickBurnTarget('enemy');
        else if (p.def.battlecry==='buff-friendly') {
          const f = E.board[0];
          if (f) tgt = { kind:'minion', side:'enemy', uid:f.uid };
          else continue; // no target yet, play later
        }
        playCardAI(idx, tgt);
        acted = true; break;
      } else {
        if (!shouldCastAI(p.def)) continue;
        const tgt = pickSpellTarget('enemy', p.def);
        if (p.def.need && !tgt) continue;
        playCardAI(idx, tgt);
        acted = true; break;
      }
    }
    if (!acted) break;
    render(); await sleep(650);
  }
  // 2) hero power: armor if mana left and (low or nothing better)
  if (!G.over && !E.powerUsed && E.mana>=2 && (E.hp<=20 || E.hand.length===0)) { usePower('enemy'); render(); await sleep(400); }
  // 3) attacks
  const attackers = [...E.board].filter(m=>m.canAttack&&m.attacksLeft>0);
  for (const a of attackers) {
    if (G.over) break;
    const t = pickAttackTarget(a);
    if (!t) continue;
    doAttack('enemy', a.uid, t);
    render(); await sleep(600);
  }
  if (G.over) { aiBusy=false; render(); return; }
  // 4) pass turn
  await sleep(500);
  aiBusy=false;
  G.turn++;
  startTurn('player');
}
function playCardAI(idx, target) {
  const E = G.enemy;
  const cardId = E.hand[idx]; const def = CARDS[cardId];
  if (E.mana < def.cost) return;
  pending = null;
  // mirror playCard but without touching player pending UI
  E.mana -= def.cost; E.hand.splice(idx,1);
  if (def.type==='minion') {
    const m = mkMinion(cardId,'enemy');
    m.canAttack=!!def.charge; m.attacksLeft=def.charge?1:0;
    E.board.push(m);
    log('foe',`🤖 Garrosh plays ${def.name} (${def.cost}) ${def.atk}/${def.hp}.`);
    if (def.battlecry) doBattlecry('enemy', m, target);
  } else {
    log('foe',`🤖 Garrosh casts ${def.name} (${def.cost}).`);
    doSpell('enemy', def, target, idx);
  }
  killCheck('player'); killCheck('enemy'); checkOver();
}
function shouldCastAI(def) {
  const E = G.enemy, P = G.player;
  if (def.spell==='coin') return E.mana + 1 <= 10 && E.hand.some(c=>CARDS[c].cost===E.mana+1);
  if (def.spell==='draw2') return true;
  if (def.spell==='heal6') return E.hp <= 18;
  if (def.spell==='aoe2') return P.board.length >= 2;
  if (def.spell==='destroy'||def.spell==='poly') return P.board.some(m=>m.atk>=4||m.taunt);
  if (def.spell==='dmg3'||def.spell==='dmg6'||def.spell==='firelands') {
    // lethal check first
    const dmg = def.spell==='dmg3'?3:def.spell==='dmg6'?6:5;
    if (P.hp + P.armor <= dmg + 2) return true;
    return P.board.some(m=>m.hp<=dmg&&m.atk>=3) || P.hp<=15 || E.board.length===0;
  }
  return true;
}
function pickSpellTarget(side, def) {
  const foeSide = side==='player'?'enemy':'player';
  const foe = G[foeSide], me = G[side];
  if (def.spell==='heal6') return { kind:'hero', side };
  if (def.spell==='destroy'||def.spell==='poly') {
    const t = [...G[foeSide].board].sort((a,b)=>b.atk-a.atk)[0];
    return t?{kind:'minion',side:foeSide,uid:t.uid}:null;
  }
  if (def.spell==='coin'||def.spell==='draw2'||def.spell==='aoe2') return null;
  return pickBurnTarget(side);
}
function pickBurnTarget(side) {
  const foeSide = side==='player'?'enemy':'player';
  const foe = G[foeSide];
  // kill a threatening minion if efficient
  const killable = foe.board.filter(m=>m.hp<=3||m.hp<=6).sort((a,b)=>b.atk-a.atk)[0];
  if (killable && killable.atk>=3 && Math.random()<0.6) return { kind:'minion', side:foeSide, uid:killable.uid };
  // taunt blocks face? spells ignore taunt — go face often
  if (Math.random()<0.7 || foe.board.length===0) return { kind:'hero', side:foeSide };
  const t = rnd(foe.board);
  return { kind:'minion', side:foeSide, uid:t.uid };
}
function pickAttackTarget(a) {
  const P = G.player;
  const taunts = P.board.filter(m=>m.taunt);
  if (taunts.length) {
    const t = taunts.sort((x,y)=>x.hp-y.hp)[0];
    return { kind:'minion', side:'player', uid:t.uid };
  }
  // favorable trade?
  const victims = P.board.filter(m=>m.atk<=a.hp && a.atk>=m.hp).sort((x,y)=>y.atk-x.atk);
  if (victims.length && Math.random()<0.55) return { kind:'minion', side:'player', uid:victims[0].uid };
  // big threat removal
  const threat = P.board.filter(m=>m.atk>=5&&a.atk>=m.hp).sort((x,y)=>y.atk-x.atk)[0];
  if (threat && Math.random()<0.5) return { kind:'minion', side:'player', uid:threat.uid };
  return { kind:'hero', side:'player' };
}

// ---------- rendering ----------
function log(cls, msg) {
  const d = document.createElement('div');
  if (cls) d.className = cls;
  d.textContent = msg;
  const box = $('log');
  box.appendChild(d); box.scrollTop = box.scrollHeight;
  while (box.children.length > 120) box.firstChild.remove();
}
function manaHTML(P) {
  let s = `<span style="font-size:12px">${P.mana}/${P.maxMana}</span>`;
  for (let i=0;i<P.maxMana;i++) s += `<span class="pip full">◆</span>`;
  for (let i=P.maxMana;i<10;i++) s += `<span class="pip">◇</span>`;
  return s;
}
function cardHTML(cardId, idx, playable) {
  const c = CARDS[cardId];
  const cls = `card ${c.type} ${playable?'playable':'unplayable'} ${pending&&pending.cardIndex===idx?'selected':''}`;
  const stats = c.type==='minion' ? `<div class="sub"><span class="atk">${c.atk}</span><span class="hp">${c.hp}</span></div>` : `<div class="sub"><span></span><span class="type-tag">SPELL</span></div>`;
  return `<div class="${cls}" data-idx="${idx}">
    <div class="cost">${c.cost}</div><div class="type-tag">${c.type==='minion'?'MINION':'SPELL'}</div>
    <div class="art">${c.art}</div><div class="name">${c.name}</div><div class="text">${c.text||''}</div>${stats}</div>`;
}
function minionHTML(m, clickable) {
  const cls = ['minion'];
  if (m.taunt) cls.push('taunt');
  if (m.divine) cls.push('divine');
  if (!m.canAttack||m.attacksLeft<=0) cls.push('sleepy');
  if (m.hp < m.maxHp) cls.push('hurt');
  if (pending && pending.kind==='attack' && pending.attackerUid===m.uid) cls.push('selected');
  let targetable = false;
  if (pending) {
    const side = m.side;
    if (isValidTarget(pending, { kind:'minion', side, uid:m.uid })) targetable = true;
  }
  if (targetable) cls.push('targetable');
  if (clickable && m.canAttack && m.attacksLeft>0) cls.push('can-attack');
  return `<div class="${cls.join(' ')}" data-uid="${m.uid}" data-side="${m.side}">
    <div class="mart">${m.art}</div><div class="mname">${m.name}</div><div class="mtext">${m.text||''}</div>
    <div class="orb"><span class="atk">${m.atk}</span><span class="hp">${m.hp}</span></div></div>`;
}

function render() {
  if (!G) return;
  const P = G.player, E = G.enemy;
  $('player-hp').textContent = Math.max(0,P.hp);
  $('enemy-hp').textContent = Math.max(0,E.hp);
  $('player-armor').textContent = `🛡${P.armor}`; $('player-armor').classList.toggle('hidden', P.armor<=0);
  $('enemy-armor').textContent = `🛡${E.armor}`; $('enemy-armor').classList.toggle('hidden', E.armor<=0);
  $('player-mana').innerHTML = manaHTML(P);
  $('enemy-mana').innerHTML = manaHTML(E);
  $('enemy-hand-count').textContent = `🃏 AI hand: ${E.hand.length} · deck: ${E.deck.length}`;
  $('deck-player-count').textContent = `Your deck: ${P.deck.length}`;
  $('deck-enemy-count').textContent = `AI deck: ${E.deck.length}`;
  $('player-deck-hint').textContent = `Deck: ${P.deck.length} · Turn ${G.turn}`;
  // hand
  const ph = $('player-hand'); ph.innerHTML = '';
  P.hand.forEach((c,i)=>{
    const w = document.createElement('div');
    w.innerHTML = cardHTML(c, i, canPlay('player',i) && G.active==='player' && !aiBusy);
    const node = w.firstChild;
    node.addEventListener('click', ()=>clickHandCard('player', i));
    ph.appendChild(node);
  });
  const eh = $('enemy-hand'); eh.innerHTML='';
  E.hand.forEach(()=>{
    const d = document.createElement('div');
    d.className='card unplayable'; d.innerHTML=`<div class="cost">?</div><div class="art">🂠</div><div class="name">???</div><div class="text"></div>`;
    eh.appendChild(d);
  });
  // boards
  const pb = $('player-board'); pb.innerHTML='';
  P.board.forEach(m=>{
    const w=document.createElement('div'); w.innerHTML=minionHTML(m,false);
    const node=w.firstChild;
    node.addEventListener('click',()=>clickMinion('player',m.uid));
    pb.appendChild(node);
  });
  if (!P.board.length) { const e=document.createElement('div'); e.style.opacity=.6; e.textContent='— your board —'; pb.appendChild(e); }
  const eb = $('enemy-board'); eb.innerHTML='';
  E.board.forEach(m=>{
    const w=document.createElement('div'); w.innerHTML=minionHTML(m,false);
    const node=w.firstChild;
    node.addEventListener('click',()=>clickMinion('enemy',m.uid));
    eb.appendChild(node);
  });
  if (!E.board.length) { const e=document.createElement('div'); e.style.opacity=.6; e.textContent='— enemy board —'; eb.appendChild(e); }
  // hero powers
  const pp = $('player-power');
  pp.disabled = !(G.active==='player' && !P.powerUsed && P.mana>=2 && !G.over);
  pp.classList.toggle('armed', !!(pending&&pending.kind==='power'));
  const ep = $('enemy-power');
  ep.disabled = true;
  // hero targetable
  for (const [id, side] of [['player-hero','player'],['enemy-hero','enemy']]) {
    const h = $(id);
    h.classList.toggle('targetable', !!(pending && isValidTarget(pending, {kind:'hero',side})));
  }
  // end turn
  $('btn-end-turn').disabled = !(G.active==='player' && !aiBusy && !G.over);
  $('status-line').textContent = G.over ? 'Game over.' :
    aiBusy || G.active==='enemy' ? `Garrosh is thinking… (turn ${G.turn})` :
    pending ? describePending() : `Your turn (turn ${G.turn}) — ${P.mana} mana. Attack with green minions, play glowing cards.`;
}
function describePending() {
  if (!pending) return '';
  if (pending.kind==='attack') return '⚔️ Attacker chosen — click an enemy (taunts first) or the enemy hero.';
  if (pending.kind==='power') return '🔥 Fireblast armed — click ANY target.';
  return `🃏 ${pending.def.name} — choose a target… (Esc to cancel)`;
}
function showHint(){ $('target-hint').classList.remove('hidden'); }
function hideHint(){ $('target-hint').classList.add('hidden'); }
function fxHero(side, text) {
  fxAt($(side==='player'?'player-hero':'enemy-hero'), text, '#ff5544');
}
function fxFloat(side, muid, text, color) {
  const board = $(side==='player'?'player-board':'enemy-board');
  const node = board.querySelector(`[data-uid="${muid}"]`);
  fxAt(node, text, color);
}

// ---------- particle FX hooks (fx.js canvas overlay, inspired by
// microsparks / Proton / canvas-confetti / particles.js) ----------
function fxCenter(el) { if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
function minionNode(side, muid) { return $(side === 'player' ? 'player-board' : 'enemy-board').querySelector(`[data-uid="${muid}"]`); }
function heroNode(side) { return $(side === 'player' ? 'player-hero' : 'enemy-hero'); }
function targetCenter(t) { if (!t) return null; return t.kind === 'hero' ? fxCenter(heroNode(t.side)) : fxCenter(minionNode(t.side, t.uid)); }
function spellFx(side, def, target) {
  if (!window.FX) return;
  const foeSide = side === 'player' ? 'enemy' : 'player';
  const from = fxCenter(heroNode(side));
  const to = targetCenter(target);
  const foeHero = () => fxCenter(heroNode(foeSide));
  switch (def.spell) {
    case 'dmg3': if (from && to) FX.frostbolt(from, to, () => FX.frostBurst(to.x, to.y)); break;
    case 'dmg6': if (from && to) FX.fireball(from, to, () => FX.explosion(to.x, to.y, 1)); break;
    case 'firelands': if (from && to) FX.fireball(from, to, () => FX.explosion(to.x, to.y, 1.4)); break;
    case 'aoe2':
      for (const m of G[foeSide].board) { const c = fxCenter(minionNode(foeSide, m.uid)); if (c) FX.holyNova(c.x, c.y); }
      { const c = foeHero(); if (c) FX.holyNova(c.x, c.y); }
      break;
    case 'heal6': { const c = to || fxCenter(heroNode(side)); if (c) FX.heal(c.x, c.y); break; }
    case 'destroy': if (to) FX.death(to.x, to.y); break;
    case 'poly': if (to) { FX.burst(to.x, to.y, { count: 22, colors: ['#c77dff', '#5a189a', '#ffffff'], speed: 4, size: 4, life: 50 }); FX.smoke(to.x, to.y, { count: 8 }); } break;
    case 'draw2': { const c = fxCenter(heroNode(side)); if (c) FX.draw(c.x, c.y); break; }
    case 'coin': { const c = fxCenter(heroNode(side)); if (c) FX.buff(c.x, c.y); break; }
  }
}

// ---------- wiring ----------
$('btn-end-turn').addEventListener('click', endTurn);
$('btn-restart').addEventListener('click', newGame);
$('btn-again').addEventListener('click', newGame);
if (window.FX && !FX.enabled) $('btn-fx').textContent = '✨ FX: off';
$('btn-fx').addEventListener('click', () => {
  if (!window.FX) return;
  FX.setEnabled(!FX.enabled);
  $('btn-fx').textContent = FX.enabled ? '✨ FX: on' : '✨ FX: off';
  log('sys', FX.enabled ? '✨ Particle effects ON.' : '✨ Particle effects OFF.');
});
$('btn-party').addEventListener('click', () => {
  if (!window.FX) return;
  if (!FX.enabled) { FX.setEnabled(true); $('btn-fx').textContent = '✨ FX: on'; }
  const cx = window.innerWidth / 2;
  FX.explosion(cx - 220, 260, 1);
  setTimeout(() => FX.frostBurst(cx, 280), 250);
  setTimeout(() => FX.holyNova(cx + 220, 260), 500);
  setTimeout(() => FX.heal(cx - 110, 420), 750);
  setTimeout(() => FX.armor(cx + 110, 420), 950);
  setTimeout(() => FX.celebrate(), 1100);
  log('sys', '🎉 FX demo! Effects inspired by microsparks, Proton, canvas-confetti & particles.js.');
});
$('btn-help').addEventListener('click', ()=>$('help-modal').classList.remove('hidden'));
$('btn-close-help').addEventListener('click', ()=>$('help-modal').classList.add('hidden'));
$('player-power').addEventListener('click', ()=>clickPower('player'));
$('player-hero').addEventListener('click', ()=>clickHero('player'));
$('enemy-hero').addEventListener('click', ()=>clickHero('enemy'));
$('cancel-target').addEventListener('click', ()=>{ pending=null; hideHint(); render(); });
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ pending=null; hideHint(); render(); } });

newGame();
