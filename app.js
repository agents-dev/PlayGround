import * as THREE from 'three';

/* ============ CONFIG ============ */
const CHAMPS = {
  vanguard: { name:'Kael, Vanguard', short:'Vanguard', icon:'🛡️', color:0x3fa7ff, trim:0xc8aa6e,
    hp:720, hpLv:110, mana:320, manaLv:30, ad:64, adLv:6, ap:10, armor:28, range:3.2, speed:8.2, atkSpd:0.85,
    desc:'Fighter' },
  arcanist: { name:'Lyra, Arcanist', short:'Arcanist', icon:'🔥', color:0xb44dff, trim:0xff9d5c,
    hp:540, hpLv:82, mana:460, manaLv:45, ad:52, adLv:4, ap:68, apLv:9, armor:16, range:11, speed:8.0, atkSpd:0.75,
    desc:'Mage' },
  ranger: { name:'Asha, Frost Ranger', short:'Ranger', icon:'❄️', color:0x7de8ff, trim:0x2b6cb0,
    hp:600, hpLv:92, mana:360, manaLv:32, ad:66, adLv:7, ap:20, apLv:3, armor:20, range:13.5, speed:8.4, atkSpd:0.95,
    desc:'Marksman' },
};
const ABIL = {
  vanguard: {
    q:{cd:5,cost:30}, w:{cd:12,cost:40}, e:{cd:9,cost:35}, r:{cd:60,cost:80},
  },
  arcanist: { q:{cd:4,cost:40}, w:{cd:11,cost:50}, e:{cd:12,cost:50}, r:{cd:70,cost:100} },
  ranger: { q:{cd:5,cost:30}, w:{cd:12,cost:40}, e:{cd:10,cost:35}, r:{cd:65,cost:90} },
};

/* ============ DOM ============ */
const $ = id => document.getElementById(id);
const canvas = $('scene');
const dmgLayer = $('dmg-layer');

/* ============ THREE SETUP ============ */
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x06121f);
scene.fog = new THREE.Fog(0x06121f, 70, 160);

const camera = new THREE.PerspectiveCamera(50, innerWidth/innerHeight, 0.5, 400);
let camYaw = Math.PI*0.25, camDist = 38, camH = 26;

scene.add(new THREE.HemisphereLight(0xbcd8ff, 0x1a2b1a, 0.95));
const sun = new THREE.DirectionalLight(0xfff2d8, 1.6);
sun.position.set(30, 50, 10);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left=-70; sun.shadow.camera.right=70;
sun.shadow.camera.top=70; sun.shadow.camera.bottom=-70;
scene.add(sun);
scene.add(new THREE.AmbientLight(0x334455, 0.5));

addEventListener('resize', ()=>{
  camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

/* ============ MAP ============ */
const WORLD = 58;
const groundMat = new THREE.MeshStandardMaterial({ color:0x2f7a3d, roughness:1 });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(WORLD*2+20, WORLD*2+20), groundMat);
ground.rotation.x = -Math.PI/2; ground.receiveShadow = true; scene.add(ground);

// lane (diagonal sandy strip)
function strip(w, color, rot, offset){
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 170),
    new THREE.MeshStandardMaterial({ color, roughness:1 }));
  m.rotation.x = -Math.PI/2; m.rotation.z = rot;
  m.position.set(offset[0], 0.02, offset[1]); m.receiveShadow = true; scene.add(m); return m;
}
strip(13, 0xc2a35e, Math.PI/4, [0,0]);          // main lane blue(-,-) -> red(+,+)
strip(10, 0x2e6fb0, -Math.PI/4, [0,0]);         // river
// base pads
function pad(x,z,color){
  const m = new THREE.Mesh(new THREE.CircleGeometry(11, 40),
    new THREE.MeshStandardMaterial({ color, roughness:0.9 }));
  m.rotation.x=-Math.PI/2; m.position.set(x,0.03,z); m.receiveShadow=true; scene.add(m);
}
pad(-46,-46,0x2b6cb0); pad(46,46,0xa93226);
// bushes (visual + stealth)
const bushes = [];
function bush(x,z){
  const g = new THREE.Group();
  for(let i=0;i<5;i++){
    const s = new THREE.Mesh(new THREE.SphereGeometry(2.2+Math.random(), 8, 6),
      new THREE.MeshStandardMaterial({ color:0x1d5c2a, roughness:1, transparent:true, opacity:0.92 }));
    s.position.set((Math.random()-0.5)*5, 1.2+Math.random(), (Math.random()-0.5)*5);
    s.castShadow = true; g.add(s);
  }
  g.position.set(x,0,z); scene.add(g);
  bushes.push({ pos:new THREE.Vector3(x,0,z), r:5 });
}
bush(-12,-4); bush(12,4); bush(-4,-14); bush(4,14); bush(-16,10); bush(16,-10);
// decorative trees
for(let i=0;i<40;i++){
  const x=(Math.random()-0.5)*120, z=(Math.random()-0.5)*120;
  if(Math.abs(x-z)<11 || Math.abs(x+z)<8) continue;
  if(Math.hypot(x,z)>62) continue;
  const t = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4,0.6,3,6),
    new THREE.MeshStandardMaterial({color:0x6b4a2b}));
  trunk.position.y=1.5; trunk.castShadow=true; t.add(trunk);
  const top = new THREE.Mesh(new THREE.ConeGeometry(2.4,5,7),
    new THREE.MeshStandardMaterial({color:0x256b33}));
  top.position.y=5; top.castShadow=true; t.add(top);
  t.position.set(x,0,z); scene.add(t);
}

/* ============ HELPERS ============ */
const ray = new THREE.Raycaster();
const mouseNDC = new THREE.Vector2();
const groundPlane = new THREE.Plane(new THREE.Vector3(0,1,0), 0);
function screenToGround(cx, cy){
  mouseNDC.set((cx/innerWidth)*2-1, -(cy/innerHeight)*2+1);
  ray.setFromCamera(mouseNDC, camera);
  const out = new THREE.Vector3();
  return ray.ray.intersectPlane(groundPlane, out) ? out : null;
}
function worldToScreen(v3){
  const v = v3.clone().project(camera);
  return { x:(v.x*0.5+0.5)*innerWidth, y:(-v.y*0.5+0.5)*innerHeight, behind:v.z>1 };
}
function floatText(pos, txt, cls='player'){
  if(dmgLayer.childElementCount>40) dmgLayer.firstChild.remove();
  const d = document.createElement('div');
  d.className='dmg '+cls; d.textContent=txt;
  const s = worldToScreen(pos.clone().add(new THREE.Vector3(0,3,0)));
  d.style.left=s.x+'px'; d.style.top=s.y+'px';
  dmgLayer.appendChild(d);
  requestAnimationFrame(()=>{ d.style.transform='translate(-50%,-160%)'; d.style.opacity='0'; });
  setTimeout(()=>d.remove(), 850);
}
function feed(html){
  const d=document.createElement('div'); d.innerHTML=html;
  const f=$('killfeed'); f.prepend(d);
  while(f.children.length>5) f.lastChild.remove();
  setTimeout(()=>{ d.style.opacity='0'; d.style.transition='opacity 1s'; setTimeout(()=>d.remove(),1000); }, 5000);
}
function makeBar(w=3){
  const g = new THREE.Group();
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(w,0.32),
    new THREE.MeshBasicMaterial({ color:0x111111, transparent:true, opacity:0.85, depthTest:false }));
  const fg = new THREE.Mesh(new THREE.PlaneGeometry(w,0.32),
    new THREE.MeshBasicMaterial({ color:0x53ff6b, transparent:true, opacity:0.95, depthTest:false }));
  fg.position.z=0.01; g.add(bg,fg); g.renderOrder=99;
  return { group:g, set(frac, color){
    fg.scale.x=Math.max(0.001,frac); fg.position.x=-w*(1-frac)/2;
    if(color) fg.material.color.set(color);
  }};
}
function teamRing(color){
  const m = new THREE.Mesh(new THREE.RingGeometry(1.1,1.5,28),
    new THREE.MeshBasicMaterial({ color, transparent:true, opacity:0.9, side:THREE.DoubleSide }));
  m.rotation.x=-Math.PI/2; m.position.y=0.06; return m;
}

/* ============ UNIT FACTORIES ============ */
function championMesh(color, trim){
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.9,1.6,4,10),
    new THREE.MeshStandardMaterial({ color, roughness:0.5, metalness:0.25 }));
  body.position.y=1.7; body.castShadow=true; g.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.55,14,12),
    new THREE.MeshStandardMaterial({ color:0xf2c89b, roughness:0.7 }));
  head.position.y=3.4; head.castShadow=true; g.add(head);
  const shoulder = new THREE.Mesh(new THREE.TorusGeometry(0.95,0.22,8,16),
    new THREE.MeshStandardMaterial({ color:trim, metalness:0.7, roughness:0.3 }));
  shoulder.position.y=2.6; shoulder.rotation.x=Math.PI/2; g.add(shoulder);
  const blade = new THREE.Mesh(new THREE.BoxGeometry(0.22,2.6,0.5),
    new THREE.MeshStandardMaterial({ color:trim, emissive:trim, emissiveIntensity:0.5 }));
  blade.position.set(1.3,1.8,0); blade.rotation.z=-0.4; g.add(blade);
  const glow = new THREE.PointLight(color, 6, 9); glow.position.y=3; g.add(glow);
  return g;
}
function minionMesh(team){
  const g = new THREE.Group();
  const c = team==='blue'?0x3fa7ff:0xff5a5a;
  const b = new THREE.Mesh(new THREE.BoxGeometry(1.1,1.5,1.1),
    new THREE.MeshStandardMaterial({ color:c, roughness:0.8 }));
  b.position.y=0.9; b.castShadow=true; g.add(b);
  const h = new THREE.Mesh(new THREE.SphereGeometry(0.42,10,8),
    new THREE.MeshStandardMaterial({ color:0xdddddd }));
  h.position.y=2; g.add(h);
  return g;
}
function towerMesh(team){
  const g = new THREE.Group();
  const baseC = team==='blue'?0x2b6cb0:0xa93226;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(2.4,3.1,7,8),
    new THREE.MeshStandardMaterial({ color:0x8a8f98, roughness:0.7 }));
  base.position.y=3.5; base.castShadow=true; g.add(base);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(2.5,2.5,0.7,8),
    new THREE.MeshStandardMaterial({ color:baseC, emissive:baseC, emissiveIntensity:0.6 }));
  band.position.y=6.4; g.add(band);
  const cry = new THREE.Mesh(new THREE.OctahedronGeometry(1.5),
    new THREE.MeshStandardMaterial({ color:baseC, emissive:baseC, emissiveIntensity:1.1, roughness:0.2 }));
  cry.position.y=8.4; cry.castShadow=true; g.add(cry);
  g.userData.crystal=cry;
  const r = new THREE.Mesh(new THREE.RingGeometry(11.5,11.9,48),
    new THREE.MeshBasicMaterial({ color:baseC, transparent:true, opacity:0.25, side:THREE.DoubleSide }));
  r.rotation.x=-Math.PI/2; r.position.y=0.08; g.add(r);
  return g;
}
function nexusMesh(team){
  const g = new THREE.Group();
  const c = team==='blue'?0x0ac8b9:0xff4c4c;
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(3,3.8,2,8),
    new THREE.MeshStandardMaterial({ color:0x3a3f47 }));
  ped.position.y=1; ped.castShadow=true; g.add(ped);
  const cry = new THREE.Mesh(new THREE.OctahedronGeometry(2.8),
    new THREE.MeshStandardMaterial({ color:c, emissive:c, emissiveIntensity:1.4, roughness:0.15 }));
  cry.position.y=5; cry.castShadow=true; g.add(cry);
  g.userData.crystal=cry;
  return g;
}

/* ============ GAME STATE ============ */
const LANE = [new THREE.Vector3(-42,0,-42), new THREE.Vector3(-24,0,-24),
  new THREE.Vector3(0,0,0), new THREE.Vector3(24,0,24), new THREE.Vector3(42,0,42)];
let started=false, over=false, clock=0, lastWave=-99;
let player=null, enemyAI=null;
const minions=[], towers=[], projectiles=[], aoes=[], traps=[];
let nexuses={}, blueKills=0, redKills=0;
let selectedChamp='vanguard';

function makeChampion(team, champKey, isPlayer){
  const c = CHAMPS[champKey];
  const mesh = championMesh(c.color, c.trim);
  mesh.add(teamRing(team==='blue'?0x0ac8b9:0xff4c4c));
  const bar = makeBar(3); bar.group.position.y=4.6; mesh.add(bar.group);
  const spawn = team==='blue'?new THREE.Vector3(-44,0,-44):new THREE.Vector3(44,0,44);
  mesh.position.copy(spawn); scene.add(mesh);
  const u = { kind:'champ', team, champKey, cfg:c, mesh, bar,
    pos:mesh.position, hp:c.hp, maxHp:c.hp, mana:c.mana, maxMana:c.mana,
    ad:c.ad, ap:c.ap, armor:c.armor, range:c.range, speed:c.speed, atkSpd:c.atkSpd,
    level:1, xp:0, xpNext:120, gold:isPlayer?150:150, cs:0, kills:0, deaths:0, assists:0,
    alive:true, respawnT:0, atkT:0, dest:null, target:null, cds:{q:0,w:0,e:0,r:0},
    shield:0, shieldT:0, rooted:0, slowed:0, slowT:0, asBoostT:0, isPlayer,
    lastHitBy:null, hitTowerT:0,
  };
  return u;
}
function makeMinion(team, melee, idx){
  const mesh = minionMesh(team);
  mesh.add(teamRing(team==='blue'?0x0ac8b9:0xff4c4c));
  const bar = makeBar(1.8); bar.group.position.y=2.9; mesh.add(bar.group);
  const base = team==='blue'?LANE[0]:LANE[4];
  mesh.position.set(base.x+(Math.random()-0.5)*3, 0, base.z+(Math.random()-0.5)*3);
  scene.add(mesh);
  const u = { kind: melee?'melee':'caster', team, mesh, bar, pos:mesh.position,
    hp: melee?430:290, maxHp: melee?430:290, ad: melee?30:40, range: melee?2.6:9.5,
    speed: melee?5.2:5.0, atkSpd:0.7, alive:true, atkT:0, target:null, wp: 1,
    dmgMul:1 };
  minions.push(u); return u;
}
function makeTower(team, x, z, label){
  const mesh = towerMesh(team); mesh.position.set(x,0,z); scene.add(mesh);
  const bar = makeBar(4); bar.group.position.y=10.4; mesh.add(bar.group);
  const t = { kind:'tower', team, label, mesh, bar, pos:mesh.position,
    hp:850, maxHp:850, ad:115, range:11.5, atkSpd:0.8, alive:true, atkT:0, aggro:null };
  towers.push(t); return t;
}
function makeNexus(team, x, z){
  const mesh = nexusMesh(team); mesh.position.set(x,0,z); scene.add(mesh);
  const bar = makeBar(5); bar.group.position.y=9.4; mesh.add(bar.group);
  const n = { kind:'nexus', team, mesh, bar, pos:mesh.position,
    hp:1100, maxHp:1100, ad:130, range:12, atkSpd:0.8, alive:true, atkT:0 };
  nexuses[team]=n; return n;
}
// build static defenses
makeTower('blue',-32,-32,'Outer'); makeTower('blue',-18,-18,'Inner'); makeTower('blue',-8,-8,'Nexus Turret');
makeTower('red',8,8,'Nexus Turret'); makeTower('red',18,18,'Inner'); makeTower('red',32,32,'Outer');
makeNexus('blue',-46,-46); makeNexus('red',46,46);
// fountains
const fountains = { blue:new THREE.Vector3(-48,0,-48), red:new THREE.Vector3(48,0,48) };

/* ============ COMBAT ============ */
function armorMul(armor){ return 100/(100+Math.max(0,armor)); }
function dealDamage(src, dst, raw, type='phys'){
  if(!dst.alive || over) return;
  if(dst.kind==='champ' && dst.shield>0){
    const ab = Math.min(dst.shield, raw);
    dst.shield-=ab; raw-=ab;
  }
  let dmg = raw;
  if(type==='phys') dmg = raw*armorMul(dst.armor||0);
  if(dst.kind==='tower'||dst.kind==='nexus'){
    if(src && src.kind==='champ') dmg*=0.72; // anti-siege
  }
  dst.hp -= dmg;
  flashHit(dst);
  floatText(dst.pos, Math.round(dmg), src===player?'player':(dst===player?'enemy':'tower'));
  if(dst.kind==='champ' && src && src.kind==='champ' && dst.team!==src.team){
    dst.lastHitBy = src;
    if(isUnderEnemyTower(src)) src.hitTowerT = 3;
  }
  if(dst.hp<=0) killUnit(src, dst);
}
function healUnit(u, amt){
  if(!u.alive) return;
  u.hp = Math.min(u.maxHp, u.hp+amt);
  floatText(u.pos, '+'+Math.round(amt), 'heal');
}
function flashHit(u){
  u.mesh.traverse?.(o=>{ if(o.isMesh&&o.material.emissive!==undefined){ o.material.emissive.setHex?.(0xffffff); o.material.emissiveIntensity=0.7; }});
  setTimeout(()=>{ u.mesh.traverse?.(o=>{ if(o.isMesh&&o.material.emissive!==undefined){ o.material.emissiveIntensity=o.userData?.ei??0; }}); },90);
}
function killUnit(src, dst){
  dst.hp=0; dst.alive=false;
  if(dst.kind==='minion'||dst.kind==='melee'||dst.kind==='caster'){
    dst.mesh.visible=false;
    // xp + gold share
    for(const ch of [player, enemyAI]){
      if(!ch||!ch.alive) continue;
      if(ch.team!==dst.team && ch.pos.distanceTo(dst.pos)<24){
        gainXp(ch, 46); 
        if(ch.isPlayer){ ch.gold+=62; ch.cs++; }
      }
    }
    if(src===player){ player.gold+=18; }
    if(src && src.kind==='champ' && src.team!==dst.team){ /* last hit bonus */ }
  } else if(dst.kind==='champ'){
    dst.deaths++; dst.mesh.visible=false; dst.respawnT = 5+dst.level*1.2;
    if(dst===player) showRespawn(dst.respawnT);
    const killer = src&&src.kind==='champ'?src:null;
    if(killer){ killer.kills++; killer.gold+=420; gainXp(killer,140);
      if(killer.team==='blue') blueKills++; else redKills++;
      feed(`<b style="color:${killer.team==='blue'?'#4cc2ff':'#ff7b7b'}">${killer.cfg.short}</b> ⚔️ slew <b>${dst.cfg.short}</b>`);
    } else {
      feed(`<b>${dst.cfg.short}</b> was executed`);
    }
    if(dst===enemyAI) feed(`Enemy down! +420g`);
  } else if(dst.kind==='tower'){
    dst.mesh.visible=false;
    feed(`💥 <b>${dst.team==='red'?'Blue':'Red'} destroyed ${dst.team} ${dst.label}!</b>`);
    if(src===player){ player.gold+=250; gainXp(player,120); }
    if(dst.team==='red'&&src&&src.team==='blue'){/* push */}
  } else if(dst.kind==='nexus'){
    endGame(dst.team==='red' ? 'VICTORY' : 'DEFEAT');
  }
}
function gainXp(ch, amt){
  if(!ch.alive||over) return;
  ch.xp+=amt;
  while(ch.xp>=ch.xpNext && ch.level<14){
    ch.xp-=ch.xpNext; ch.level++;
    ch.xpNext=110+ch.level*65;
    ch.maxHp+=ch.cfg.hpLv; ch.hp=Math.min(ch.maxHp, ch.hp+ch.maxHp*0.35);
    ch.maxMana+=ch.cfg.manaLv; ch.mana=ch.maxMana;
    ch.ad+=ch.cfg.adLv; ch.ap+=ch.cfg.apLv||4;
    if(ch.isPlayer){ floatText(ch.pos,'LEVEL UP!','heal'); feed(`⬆️ You reached level ${ch.level}`); }
  }
}
function isUnderEnemyTower(ch){
  for(const t of towers){
    if(!t.alive||t.team===ch.team) continue;
    if(ch.pos.distanceTo(t.pos)<t.range) return true;
  }
  return false;
}
function inBush(pos){
  return bushes.some(b=>Math.hypot(pos.x-b.pos.x,pos.z-b.pos.z)<b.r);
}

/* ============ PROJECTILES / AOE ============ */
function fireProjectile(src, targetPos, { speed=26, dmg=50, color=0xffffff, radius=0.35, apScale=0, team, target=null, dir=null, maxDist=30, label='' }){
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius,10,8),
    new THREE.MeshBasicMaterial({ color }));
  mesh.position.copy(src.pos).add(new THREE.Vector3(0,2.2,0));
  const glow = new THREE.PointLight(color, 4, 8); mesh.add(glow);
  scene.add(mesh);
  projectiles.push({ mesh, team, dmg, apScale, src, target, dir:dir?.clone().normalize(),
    speed, life:maxDist/speed+0.4, maxDist, traveled:0, label });
}
function spawnAoe(src, center, radius, delay, dmg, color, opts={}){
  const ring = new THREE.Mesh(new THREE.RingGeometry(radius-0.4,radius,40),
    new THREE.MeshBasicMaterial({ color, transparent:true, opacity:0.9, side:THREE.DoubleSide }));
  ring.rotation.x=-Math.PI/2; ring.position.set(center.x,0.1,center.z); scene.add(ring);
  const disc = new THREE.Mesh(new THREE.CircleGeometry(radius,40),
    new THREE.MeshBasicMaterial({ color, transparent:true, opacity:0.22 }));
  disc.rotation.x=-Math.PI/2; disc.position.set(center.x,0.09,center.z); scene.add(disc);
  aoes.push({ src, center:center.clone(), radius, t:delay, dmg, color, ring, disc, slow:opts.slow||0, root:opts.root||0, team:src.team });
}
function placeTrap(owner, pos){
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(1.4,1.4,0.3,12),
    new THREE.MeshStandardMaterial({ color:0x7de8ff, emissive:0x7de8ff, emissiveIntensity:0.7 }));
  mesh.position.set(pos.x,0.2,pos.z); scene.add(mesh);
  traps.push({ owner, pos:pos.clone(), mesh, t:12, r:3.2, dmg:70+owner.ad*0.5 });
}

/* ============ ABILITIES ============ */
function castAbility(ch, key, groundPt){
  if(!ch.alive||over||!started&&ch.isPlayer) return false;
  const cd = ABIL[ch.champKey][key];
  if(ch.cds[key]>0 || ch.mana<cd.cost) return false;
  const aim = groundPt||ch.pos.clone().add(new THREE.Vector3(4,0,4));
  const dir = aim.clone().sub(ch.pos); dir.y=0;
  if(dir.lengthSq()<0.01) dir.set(1,0,1);
  dir.normalize();
  const R = ch.range;
  let ok=false;
  if(ch.champKey==='vanguard'){
    if(key==='q'){ ch.mana-=cd.cost; ch.cds.q=cd.cd;
      spawnAoe(ch, ch.pos.clone(), 7.5, 0.15, 70+ch.ad*0.6, 0xc8aa6e); ok=true; }
    if(key==='w'){ ch.mana-=cd.cost; ch.cds.w=cd.cd;
      ch.shield=140+ch.maxHp*0.1; ch.shieldT=4; healUnit(ch,70); ok=true; }
    if(key==='e'){ ch.mana-=cd.cost; ch.cds.e=cd.cd;
      dashUnit(ch, dir, 9.5); spawnAoe(ch, ch.pos.clone(), 4, 0.3, 40+ch.ad*0.4, 0x3fa7ff); ok=true; }
    if(key==='r'){ ch.mana-=cd.cost; ch.cds.r=cd.cd;
      const c = ch.pos.clone().add(dir.clone().multiplyScalar(Math.min(12, ch.pos.distanceTo(aim))));
      spawnAoe(ch, c, 8.5, 0.6, 190+ch.ad*0.85, 0xff9d5c, { slow:0.45 }); ok=true; }
  } else if(ch.champKey==='arcanist'){
    if(key==='q'){ ch.mana-=cd.cost; ch.cds.q=cd.cd;
      fireProjectile(ch, null, { dir, speed:30, dmg:95+ch.ap*0.7, apScale:0, color:0xb44dff, radius:0.5, team:ch.team, maxDist:22 }); ok=true; }
    if(key==='w'){ ch.mana-=cd.cost; ch.cds.w=cd.cd;
      const c = ch.pos.clone().add(dir.clone().multiplyScalar(Math.min(13, ch.pos.distanceTo(aim))));
      spawnAoe(ch, c, 6, 0.5, 65+ch.ap*0.5, 0xb44dff, { root:1.4 }); ok=true; }
    if(key==='e'){ ch.mana-=cd.cost; ch.cds.e=cd.cd;
      const p = ch.pos.clone().add(dir.clone().multiplyScalar(11)); clampMap(p); ch.pos.copy(p); ch.dest=null; ok=true; }
    if(key==='r'){ ch.mana-=cd.cost; ch.cds.r=cd.cd;
      const c = ch.pos.clone().add(dir.clone().multiplyScalar(Math.min(14, ch.pos.distanceTo(aim))));
      spawnAoe(ch, c, 8, 0.9, 270+ch.ap*0.95, 0xff5a2b, { slow:0.4 }); ok=true; }
  } else { // ranger
    if(key==='q'){ ch.mana-=cd.cost; ch.cds.q=cd.cd;
      for(const a of [-0.18,0,0.18]){
        const d = dir.clone().applyAxisAngle(new THREE.Vector3(0,1,0), a);
        fireProjectile(ch, null, { dir:d, speed:32, dmg:55+ch.ad*0.5+ch.ap*0.3, color:0x7de8ff, radius:0.35, team:ch.team, maxDist:20 });
      } ok=true; }
    if(key==='w'){ ch.mana-=cd.cost; ch.cds.w=cd.cd;
      const c = ch.pos.clone().add(dir.clone().multiplyScalar(Math.min(12, ch.pos.distanceTo(aim))));
      placeTrap(ch, c); ok=true; }
    if(key==='e'){ ch.mana-=cd.cost; ch.cds.e=cd.cd;
      dashUnit(ch, dir, 8.5); ch.asBoostT=4; ok=true; }
    if(key==='r'){ ch.mana-=cd.cost; ch.cds.r=cd.cd;
      fireProjectile(ch, null, { dir, speed:38, dmg:150+ch.ad*0.75, color:0xbfefff, radius:0.7, team:ch.team, maxDist:34 }); ok=true; }
  }
  return ok;
}
function dashUnit(ch, dir, dist){
  const p = ch.pos.clone().add(dir.clone().multiplyScalar(dist)); clampMap(p);
  ch.pos.copy(p); ch.dest=null;
}
function clampMap(p){
  p.x=Math.max(-55,Math.min(55,p.x)); p.z=Math.max(-55,Math.min(55,p.z)); p.y=0;
}

/* ============ TARGETING ============ */
function enemiesOf(team){ return team==='blue' ? 'red':'blue'; }
function allCombatants(){
  const arr=[];
  if(player?.alive) arr.push(player);
  if(enemyAI?.alive) arr.push(enemyAI);
  for(const m of minions) if(m.alive) arr.push(m);
  for(const t of towers) if(t.alive) arr.push(t);
  for(const k of Object.values(nexuses)) if(k.alive) arr.push(k);
  return arr;
}
function nearestEnemy(pos, team, maxD, filter){
  let best=null,bd=maxD;
  for(const u of allCombatants()){
    if(u.team===team) continue;
    if(filter&&!filter(u)) continue;
    // bush stealth: hidden champs beyond 7 units
    if(u.kind==='champ' && inBush(u.pos) && pos.distanceTo(u.pos)>7 && u!==player) continue;
    const d=pos.distanceTo(u.pos);
    if(d<bd){bd=d;best=u;}
  }
  return best;
}
function basicAttack(att, dst){
  const isRanged = att.range>5;
  const dmg = att.ad*(att.asBoostT>0?1.25:1);
  if(isRanged || att.kind==='tower' || att.kind==='nexus'){
    const col = att.team==='blue'?0x66ccff:0xff6666;
    fireProjectile(att, null, { dir:null, target:dst, speed:att.kind==='tower'?22:28,
      dmg, color: att.kind==='tower'? (att.team==='blue'?0x3388ff:0xff3333):col,
      radius: att.kind!=='champ'?0.5:0.35, team:att.team, maxDist:att.range+6 });
  } else {
    // melee instant + lunge fx
    dealDamage(att, dst, dmg, 'phys');
    const slash = new THREE.Mesh(new THREE.TorusGeometry(1.4,0.15,6,14,Math.PI),
      new THREE.MeshBasicMaterial({ color:0xffffff, transparent:true, opacity:0.8 }));
    slash.position.copy(dst.pos).add(new THREE.Vector3(0,1.6,0));
    slash.lookAt(camera.position); scene.add(slash);
    setTimeout(()=>scene.remove(slash),160);
  }
}

/* ============ WAVES / AI ============ */
function spawnWave(){
  for(const team of ['blue','red'])
    for(let i=0;i<3;i++) makeMinion(team,true,i);
  for(const team of ['blue','red'])
    for(let i=0;i<2;i++) makeMinion(team,false,i);
}
function updateMinion(m, dt){
  if(!m.alive) return;
  m.atkT-=dt;
  // target: nearest enemy within aggro 14, else walk lane
  let foe = nearestEnemy(m.pos, m.team, 14, u=>u.kind!=='nexus'||true);
  if(foe && foe.kind==='nexus' && m.pos.distanceTo(foe.pos)>16) foe=null;
  if(foe){
    const d=m.pos.distanceTo(foe.pos);
    if(d<=m.range){ if(m.atkT<=0){ m.atkT=1/m.atkSpd; basicAttack(m,foe);} }
    else moveToward(m, foe.pos, m.speed*dt);
  } else {
    const goal = m.team==='blue' ? LANE[Math.min(4, m.wp)] : LANE[Math.max(0, 4-m.wp)];
    if(m.pos.distanceTo(goal)<4) m.wp=Math.min(4,m.wp+1);
    else moveToward(m, goal, m.speed*dt);
  }
  faceMovement(m);
}
function moveToward(u, p, step){
  const d = p.clone().sub(u.pos); d.y=0;
  const dist=d.length(); if(dist<0.05) return;
  d.normalize();
  u.pos.addScaledVector(d, Math.min(step,dist));
  u.mesh.rotation.y=Math.atan2(d.x,d.z);
}
function faceMovement(m){ /* rotation set in moveToward */ }
function updateTower(t, dt){
  if(!t.alive) return;
  t.mesh.userData.crystal.rotation.y+=dt;
  t.atkT-=dt;
  if(t.atkT>0) return;
  // prefer minions, else champ (or champ that hit tower-recent champ)
  let foe = nearestEnemy(t.pos, t.team, t.range, u=>u.kind==='melee'||u.kind==='caster'||u.kind==='minion');
  if(!foe){
    foe = nearestEnemy(t.pos, t.team, t.range, u=>u.kind==='champ');
    // if champ + no minion wave, still attack
  } else {
    // if enemy champ dealt champ-damage under tower recently and in range, switch
    const aggroCh = [player,enemyAI].find(c=>c&&c.alive&&c.team!==t.team&&c.hitTowerT>0&&c.pos.distanceTo(t.pos)<t.range);
    if(aggroCh) foe=aggroCh;
  }
  if(foe){ t.atkT=1/t.atkSpd; basicAttack(t,foe); }
}
function updateNexus(n, dt){
  if(!n.alive) return;
  n.mesh.userData.crystal.rotation.y+=dt*0.8;
  n.mesh.userData.crystal.position.y=5+Math.sin(clock*2)*0.3;
  n.atkT-=dt; if(n.atkT>0) return;
  const foe=nearestEnemy(n.pos,n.team,n.range);
  if(foe){ n.atkT=1/n.atkSpd; basicAttack(n,foe); }
}
function updateEnemyAI(dt){
  const ai=enemyAI; if(!ai||!ai.alive) return;
  ai.atkT-=dt;
  for(const k of ['q','w','e','r']) ai.cds[k]=Math.max(0,ai.cds[k]-dt);
  ai.mana=Math.min(ai.maxMana, ai.mana+ai.maxMana*0.04*dt);
  if(ai.rooted>0){ ai.rooted-=dt; return; }
  const fountain=fountains[ai.team];
  // retreat logic
  if(ai.hp<ai.maxHp*0.32 && ai.state!=='retreat'){ ai.state='retreat'; }
  if(ai.state==='retreat'){
    moveToward(ai, fountain, ai.speed*dt);
    if(ai.hp>ai.maxHp*0.85) ai.state='push';
    // self defense
    const foe=nearestEnemy(ai.pos,ai.team,ai.range);
    if(foe&&ai.atkT<=0){ai.atkT=1/ai.atkSpd;basicAttack(ai,foe);}
    return;
  }
  // find foe
  const foeChamp = (player&&player.alive&&player.pos.distanceTo(ai.pos)<ai.range+2)?player:null;
  const foe = foeChamp || nearestEnemy(ai.pos, ai.team, 15);
  if(foe){
    const d=ai.pos.distanceTo(foe.pos);
    // cast Q when in range-ish
    const aim = foe.pos.clone();
    if(ai.cds.q<=0 && d<16 && Math.random()<0.03) castAbility(ai,'q',aim);
    if(ai.cds.r<=0 && d<13 && foe.kind==='champ' && foe.hp<foe.maxHp*0.6) castAbility(ai,'r',aim);
    if(d<=ai.range){ if(ai.atkT<=0){ai.atkT=1/ai.atkSpd;basicAttack(ai,foe);} }
    else moveToward(ai, foe.pos, ai.speed*dt);
  } else {
    // push down lane toward blue base
    const goal = LANE[0];
    moveToward(ai, goal, ai.speed*dt);
  }
  ai.mesh.rotation.y+=0; // facing set in moveToward when moving
}

/* ============ PLAYER UPDATE ============ */
const keys={};
addEventListener('keydown',e=>{
  keys[e.key.toLowerCase()]=true;
  if(e.key===' ') { e.preventDefault(); camYaw=Math.PI*0.25; }
  if(!player||!started||over) return;
  const k=e.key.toLowerCase();
  if(['q','w','e','r'].includes(k)){
    const pt = lastGround || player.pos.clone().add(new THREE.Vector3(6,0,6));
    castAbility(player,k,pt);
  }
});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);

let lastGround=null, isOrbiting=false, px=0, py=0, rmb=false;
canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('pointerdown',e=>{
  if(e.button===1||e.button===2||e.shiftKey){ isOrbiting=true; px=e.clientX; py=e.clientY; }
  if(e.button===2) rmb=true;
});
addEventListener('pointerup',e=>{ isOrbiting=false; rmb=false; });
addEventListener('pointermove',e=>{
  lastGround=screenToGround(e.clientX,e.clientY);
  if(isOrbiting){ camYaw+=(e.clientX-px)*0.006; camH=Math.max(10,Math.min(60,camH+(e.clientY-py)*0.15)); px=e.clientX; py=e.clientY; }
});
canvas.addEventListener('wheel',e=>{ e.preventDefault(); camDist=Math.max(18,Math.min(60,camDist+e.deltaY*0.03)); },{passive:false});
canvas.addEventListener('click',e=>{
  if(!started||over||!player?.alive) return;
  if(e.button!==0) return;
  const pt=screenToGround(e.clientX,e.clientY); if(!pt) return;
  // attack-move: if clicked near enemy, target it
  const foe=nearestEnemy(pt, player.team, 3.5, u=>u.kind!=='nexus'||true);
  if(foe){ player.target=foe; player.dest=null; }
  else { player.dest=pt.clone(); player.dest.y=0; player.target=null; showPing(pt); }
});
canvas.addEventListener('pointerdown',e=>{
  if(e.button===2 && started && player?.alive){
    const pt=screenToGround(e.clientX,e.clientY); if(!pt) return;
    const foe=nearestEnemy(pt, player.team, 4);
    if(foe){ player.target=foe; player.dest=null; }
    else { player.dest=pt.clone(); player.dest.y=0; player.target=null; showPing(pt); }
  }
});
// touch: tap = move
let touchT=0;
canvas.addEventListener('touchstart',e=>{ touchT=performance.now(); },{passive:true});
canvas.addEventListener('touchend',e=>{
  if(performance.now()-touchT>400) return;
  const t=e.changedTouches[0];
  const pt=screenToGround(t.clientX,t.clientY); if(!pt||!player?.alive) return;
  const foe=nearestEnemy(pt,player.team,4);
  if(foe){player.target=foe;player.dest=null;} else {player.dest=pt;player.target=null;showPing(pt);}
},{passive:true});
function showPing(pt){
  const m=new THREE.Mesh(new THREE.RingGeometry(0.6,1,24),
    new THREE.MeshBasicMaterial({color:0x0ac8b9,transparent:true,opacity:0.9,side:THREE.DoubleSide}));
  m.rotation.x=-Math.PI/2;m.position.set(pt.x,0.1,pt.z);scene.add(m);
  let s=0;const iv=setInterval(()=>{s+=0.2;m.scale.setScalar(1+s);m.material.opacity=0.9-s*0.3;if(s>2){clearInterval(iv);scene.remove(m);}},40);
}
document.querySelectorAll('#abilities button').forEach(b=>{
  b.addEventListener('click',()=>{
    if(!player?.alive) return;
    castAbility(player,b.dataset.ab,lastGround);
  });
});
document.querySelectorAll('#shop button').forEach(b=>{
  b.addEventListener('click',()=>{
    if(!player) return;
    const costs={blade:600,tome:650,heart:700};
    const k=b.dataset.item;
    if(player.gold<costs[k]) return;
    player.gold-=costs[k];
    if(k==='blade'){player.ad+=25;player.atkSpd+=0.08;}
    if(k==='tome'){player.ap+=35;}
    if(k==='heart'){player.maxHp+=350;player.hp+=350;}
    b.disabled=true; b.textContent+=' ✓';
    feed(`🛒 Purchased ${k}`);
  });
});

function updatePlayer(dt){
  if(!player?.alive) return;
  player.atkT-=dt;
  for(const k of ['q','w','e','r']) player.cds[k]=Math.max(0,player.cds[k]-dt);
  player.mana=Math.min(player.maxMana,player.mana+player.maxMana*0.05*dt);
  player.hp=Math.min(player.maxHp,player.hp+player.maxHp*0.015*dt);
  if(player.shieldT>0){player.shieldT-=dt;if(player.shieldT<=0)player.shield=0;}
  if(player.rooted>0){player.rooted-=dt;return;}
  const slowMul = player.slowT>0? (1-player.slowed):1;
  if(player.slowT>0) player.slowT-=dt;
  // validate target
  if(player.target && (!player.target.alive || player.pos.distanceTo(player.target.pos)>26)) player.target=null;
  // auto-acquire in range if idle
  if(!player.target && !player.dest){
    const f=nearestEnemy(player.pos,player.team,player.range);
    if(f) player.target=f;
  }
  if(player.target){
    const d=player.pos.distanceTo(player.target.pos);
    if(d<=player.range){
      player.mesh.lookAt(player.target.pos.x,player.pos.y,player.target.pos.z);
      if(player.atkT<=0){player.atkT=1/player.atkSpd;basicAttack(player,player.target);}
    } else {
      moveToward(player,player.target.pos,player.speed*slowMul*dt);
    }
  } else if(player.dest){
    const d=player.pos.distanceTo(player.dest);
    if(d<0.6) player.dest=null;
    else{
      moveToward(player,player.dest,player.speed*slowMul*dt);
      // attack while moving if enemy in range
      const f=nearestEnemy(player.pos,player.team,player.range);
      if(f&&player.atkT<=0){player.atkT=1/player.atkSpd;basicAttack(player,f);}
    }
  }
  // fountain heal
  if(player.pos.distanceTo(fountains.blue)<9) healUnitTick(player,120*dt);
  if(player.asBoostT>0)player.asBoostT-=dt;
}
function healUnitTick(u,amt){ u.hp=Math.min(u.maxHp,u.hp+amt); }

/* ============ PROJECTILE / AOE UPDATE ============ */
function updateProjectiles(dt){
  for(let i=projectiles.length-1;i>=0;i--){
    const p=projectiles[i];
    p.life-=dt;
    let moveDir=p.dir;
    if(p.target){
      if(!p.target.alive){ scene.remove(p.mesh); projectiles.splice(i,1); continue; }
      const tp=p.target.pos.clone().add(new THREE.Vector3(0,2,0));
      moveDir=tp.clone().sub(p.mesh.position).normalize();
      const d=p.mesh.position.distanceTo(tp);
      const step=p.speed*dt;
      p.mesh.position.addScaledVector(moveDir,step);
      p.traveled+=step;
      if(d<1.2){
        const total=p.dmg+(p.apScale?p.src.ap*p.apScale:0)+(p.src.ap? p.src.ap*0:0);
        // include AP scaling baked into dmg already for abilities; autos pure AD
        dealDamage(p.src,p.target,total,'phys');
        scene.remove(p.mesh); projectiles.splice(i,1); continue;
      }
    } else {
      const step=p.speed*dt;
      p.mesh.position.addScaledVector(moveDir,step);
      p.traveled+=step;
      // collide with first enemy within 1.4
      const foe=nearestEnemy(p.mesh.position,p.team,1.6,u=>u.kind!=='tower'&&u.kind!=='nexus'?true:(p.traveled>4));
      if(foe && p.traveled>2){
        dealDamage(p.src,foe,p.dmg,'magic');
        scene.remove(p.mesh); projectiles.splice(i,1); continue;
      }
    }
    if(p.life<=0||p.traveled>p.maxDist){ scene.remove(p.mesh); projectiles.splice(i,1); }
  }
}
function updateAoes(dt){
  for(let i=aoes.length-1;i>=0;i--){
    const a=aoes[i]; a.t-=dt;
    a.ring.scale.setScalar(1+Math.sin(clock*8)*0.02);
    if(a.t<=0){
      // damage all enemies in radius
      for(const u of allCombatants()){
        if(u.team===a.team) continue;
        if(u.pos.distanceTo(a.center)<a.radius){
          dealDamage(a.src,u,a.dmg,'magic');
          if(a.slow){u.slowed=a.slow;u.slowT=2;}
          if(a.root){u.rooted=Math.max(u.rooted||0,a.root);}
        }
      }
      // fx flash
      a.disc.material.opacity=0.55;
      setTimeout(()=>{scene.remove(a.ring);scene.remove(a.disc);},180);
      aoes.splice(i,1);
    }
  }
}
function updateTraps(dt){
  for(let i=traps.length-1;i>=0;i--){
    const t=traps[i]; t.t-=dt;
    t.mesh.rotation.y+=dt;
    if(t.t<=0){scene.remove(t.mesh);traps.splice(i,1);continue;}
    const foe=nearestEnemy(t.pos,t.owner.team,t.r,u=>u.team!==t.owner.team);
    if(foe){ dealDamage(t.owner,foe,t.dmg,'magic'); foe.slowed=0.4; foe.slowT=2;
      scene.remove(t.mesh); traps.splice(i,1); }
  }
}

/* ============ RESPAWN / END ============ */
function showRespawn(t){
  $('respawn').classList.remove('hidden');
  const iv=setInterval(()=>{
    if(!player||player.alive){clearInterval(iv);$('respawn').classList.add('hidden');return;}
    t-=0.5; $('respawn-t').textContent=Math.ceil(t);
    if(t<=0){clearInterval(iv);}
  },500);
}
function respawnTick(dt){
  for(const ch of [player,enemyAI]){
    if(!ch||ch.alive) continue;
    ch.respawnT-=dt;
    if(ch.respawnT<=0){
      ch.alive=true; ch.hp=ch.maxHp; ch.mana=ch.maxMana;
      ch.pos.copy(ch.team==='blue'?new THREE.Vector3(-44,0,-44):new THREE.Vector3(44,0,44));
      ch.mesh.visible=true; ch.dest=null; ch.target=null;
      if(ch===player) $('respawn').classList.add('hidden');
    }
  }
}
function endGame(result){
  if(over) return; over=true;
  const win=result==='VICTORY';
  $('end-screen').classList.remove('hidden');
  $('end-title').textContent=result;
  $('end-title').className=result;
  const t=Math.floor(clock);
  $('end-sub').textContent = win
    ? 'The red Nexus has fallen. The Rift is yours, Legend!'
    : 'Your Nexus has fallen… The enemy claims the Rift. Queue again?';
  $('end-stats').innerHTML =
    `⏱️ ${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')} &nbsp;·&nbsp; `+
    `KDA <b>${player.kills} / ${player.deaths} / ${player.assists}</b> &nbsp;·&nbsp; CS <b>${player.cs}</b> &nbsp;·&nbsp; Level <b>${player.level}</b>`;
  feed(win?'🏆 VICTORY':'💀 DEFEAT');
}
$('restart-btn').addEventListener('click',()=>location.reload());

/* ============ START ============ */
document.querySelectorAll('.champ-card').forEach(c=>{
  c.addEventListener('click',()=>{
    document.querySelectorAll('.champ-card').forEach(x=>x.classList.remove('selected'));
    c.classList.add('selected'); selectedChamp=c.dataset.champ;
  });
});
$('play-btn').addEventListener('click',()=>{
  $('start-screen').classList.add('hidden');
  startMatch();
});
function startMatch(){
  player = makeChampion('blue', selectedChamp, true);
  const pool = Object.keys(CHAMPS).filter(k=>k!==selectedChamp);
  const ek = pool[Math.floor(Math.random()*pool.length)];
  enemyAI = makeChampion('red', ek, false);
  enemyAI.state='push'; enemyAI.gold=150;
  started=true; clock=0;
  $('champ-name').textContent=CHAMPS[selectedChamp].short;
  $('portrait').firstChild.textContent=CHAMPS[selectedChamp].icon;
  feed(`⚔️ Welcome to the Rift! You are <b>${CHAMPS[selectedChamp].name}</b> vs <b>${CHAMPS[ek].name}</b>`);
  feed(`Push with your wave → take towers → smash the red Nexus!`);
  spawnWave();
}

/* ============ HUD / MINIMAP ============ */
const mm=$('minimap').getContext('2d');
function dot(x,z,color,size=4){
  const mx=(x+60)/120*168, mz=(z+60)/120*168;
  mm.fillStyle=color; mm.beginPath(); mm.arc(mx,mz,size,0,7); mm.fill();
}
let mmT=0;
function updateHUD(dt){
  if(player){
    $('hp').style.width=(100*player.hp/player.maxHp)+'%';
    $('hp-text').textContent=`${Math.max(0,Math.ceil(player.hp))} / ${Math.round(player.maxHp)}${player.shield>0?' (+'+Math.round(player.shield)+')':''}`;
    $('mp').style.width=(100*player.mana/player.maxMana)+'%';
    $('mp-text').textContent=`${Math.floor(player.mana)} / ${Math.round(player.maxMana)}`;
    $('xp').style.width=(100*player.xp/player.xpNext)+'%';
    $('level').textContent=player.level;
    $('gold').textContent=Math.floor(player.gold)+'g';
    $('kda').textContent=`${player.kills} / ${player.deaths} / ${player.assists}`;
    $('cs').textContent=`${player.cs} CS`;
    for(const k of ['q','w','e','r']){
      const btn=document.querySelector(`#abilities button[data-ab="${k}"]`);
      const cd=ABIL[player.champKey][k].cd, left=player.cds[k];
      btn.querySelector('i').textContent=left>0.1?left.toFixed(1):'';
      btn.classList.toggle('cool',left>0.1);
      btn.style.setProperty('--cd',(left/cd).toFixed(2));
      btn.classList.toggle('no-mana',player.mana<ABIL[player.champKey][k].cost);
    }
    // shop affordability
    const costs={blade:600,tome:650,heart:700};
    document.querySelectorAll('#shop button').forEach(b=>{
      if(b.textContent.includes('✓'))return;
      b.disabled=player.gold<costs[b.dataset.item];
    });
    // target frame
    const tf=$('target-frame');
    if(player.target&&player.target.alive&&(player.target.kind==='tower'||player.target.kind==='nexus'||player.target.kind==='champ')){
      tf.classList.remove('hidden');
      $('target-name').textContent = player.target.kind==='champ'?player.target.cfg.name:(player.target.label?player.target.label+' Tower':'Nexus');
      $('target-hp').style.width=(100*player.target.hp/player.target.maxHp)+'%';
    } else tf.classList.add('hidden');
  }
  const t=Math.floor(clock);
  $('match-clock').textContent=`${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;
  $('blue-kills').textContent=blueKills; $('red-kills').textContent=redKills;
  if(nexuses.blue) $('blue-nexus-hp').style.width=(100*nexuses.blue.hp/nexuses.blue.maxHp)+'%';
  if(nexuses.red) $('red-nexus-hp').style.width=(100*nexuses.red.hp/nexuses.red.maxHp)+'%';
  // health bars billboard
  for(const u of [...minions, ...towers, ...Object.values(nexuses), ...(player?[player]:[]), ...(enemyAI?[enemyAI]:[])]){
    if(!u.bar) continue;
    u.bar.group.quaternion.copy(camera.quaternion);
    const frac=Math.max(0,u.hp/u.maxHp);
    const col=u.team==='blue'?'#53a9ff':'#ff5a5a';
    u.bar.set(frac, u.kind==='tower'||u.kind==='nexus' ? col : (frac>0.5?'#53ff6b':frac>0.25?'#ffd76a':'#ff5a5a'));
  }
  // minimap
  mmT-=dt; if(mmT<=0){ mmT=0.15;
    mm.clearRect(0,0,168,168);
    mm.fillStyle='#0a1a2fee'; mm.fillRect(0,0,168,168);
    mm.strokeStyle='#c8aa6e55'; mm.beginPath(); mm.moveTo(10,158); mm.lineTo(158,10); mm.lineWidth=10; mm.stroke();
    mm.strokeStyle='#2e6fb088'; mm.beginPath(); mm.moveTo(10,10); mm.lineTo(158,158); mm.lineWidth=7; mm.stroke();
    dot(-46,-46,'#0ac8b9',6); dot(46,46,'#ff4c4c',6);
    for(const tw of towers) if(tw.alive) dot(tw.pos.x,tw.pos.z,tw.team==='blue'?'#3388ff':'#ff3333',4);
    for(const m of minions) if(m.alive) dot(m.pos.x,m.pos.z,m.team==='blue'?'#9fd8ff':'#ffb3b3',2);
    if(player?.alive) dot(player.pos.x,player.pos.z,'#ffd76a',4);
    if(enemyAI?.alive && !inBush(enemyAI.pos)) dot(enemyAI.pos.x,enemyAI.pos.z,'#ff0000',4);
  }
}

/* ============ CAMERA ============ */
function updateCamera(dt){
  const focus = (started&&player) ? player.pos : new THREE.Vector3(Math.sin(clock*0.15)*20,0,Math.cos(clock*0.15)*20);
  if(!started) camYaw+=dt*0.12;
  const x=focus.x+Math.sin(camYaw)*camDist, z=focus.z+Math.cos(camYaw)*camDist;
  camera.position.set(x, camH, z);
  camera.lookAt(focus.x, 0, focus.z);
}

/* ============ MAIN LOOP ============ */
const clk=new THREE.Clock();
function tick(){
  requestAnimationFrame(tick);
  const dt=Math.min(0.05,clk.getDelta());
  if(started&&!over){
    clock+=dt;
    if(clock-lastWave>22){ lastWave=clock; spawnWave(); if(clock>10)feed('🌊 Minions have spawned'); }
    updatePlayer(dt);
    updateEnemyAI(dt);
    for(const m of minions) updateMinion(m,dt);
    for(const t of towers){ t.hitTowerT=Math.max(0,(t.hitTowerT||0)-dt); updateTower(t,dt); }
    // hitTowerT decay on champs
    for(const ch of [player,enemyAI]) if(ch) ch.hitTowerT=Math.max(0,ch.hitTowerT-dt);
    for(const k of Object.values(nexuses)) updateNexus(k,dt);
    updateProjectiles(dt); updateAoes(dt); updateTraps(dt);
    respawnTick(dt);
    // cleanup dead minions meshes occasionally
    for(let i=minions.length-1;i>=0;i--){
      if(!minions[i].alive && minions[i].mesh.visible===false){
        // keep corpse hidden 2s then remove — simplify: remove after death+4s using hp timer
        minions[i].deadT=(minions[i].deadT||0)+dt;
        if(minions[i].deadT>4){ scene.remove(minions[i].mesh); minions.splice(i,1); }
      }
    }
    updateHUD(dt);
    const q=$('quest'); if(q&&clock>14) q.style.display='none';
  } else {
    updateHUD(dt);
  }
  updateCamera(dt);
  renderer.render(scene,camera);
}
tick();
