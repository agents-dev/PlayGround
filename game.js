(() => {
'use strict';
// ============ PG: BATTLEGROUNDS — top-down battle royale ============
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const mm = document.getElementById('minimap').getContext('2d');
const $ = id => document.getElementById(id);

function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
addEventListener('resize', resize); resize();

// ---------- Audio (procedural, no assets) ----------
let AC = null;
function beep(freq=440, dur=0.08, type='square', vol=0.08){
  try{
    AC = AC || new (window.AudioContext||window.webkitAudioContext)();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type=type; o.frequency.value=freq; g.gain.value=vol;
    o.connect(g); g.connect(AC.destination); o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime+dur);
    o.stop(AC.currentTime+dur);
  }catch(e){}
}
const SFX = {
  shoot: w => beep({pistol:700,smg:900,rifle:520,shotgun:200,sniper:150,fists:300}[w]||600, .07, 'square', .06),
  hit: () => beep(1200,.05,'square',.07),
  hurt: () => beep(160,.15,'sawtooth',.12),
  pickup: () => beep(880,.09,'sine',.1),
  zone: () => beep(220,.4,'sawtooth',.1),
  kill: () => { beep(660,.08,'square',.1); setTimeout(()=>beep(990,.12,'square',.1),90); },
  win: () => [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.25,'triangle',.12),i*180)),
};

// ---------- Config ----------
const GUNS = {
  fists:  { name:'FISTS',   dmg:16, cd:420,  mag:Infinity, reserve:Infinity, reload:0,   spread:0,   pellets:1, range:52,  auto:false, brate:0,   color:'#ccc' },
  pistol: { name:'P1911',   dmg:18, cd:300,  mag:12, reload:1100, spread:0.06, pellets:1, range:430, auto:false, brate:950, color:'#e8d44d' },
  smg:    { name:'VECTOR',  dmg:13, cd:105,  mag:32, reload:1600, spread:0.10, pellets:1, range:460, auto:true,  brate:800, color:'#59c2ff' },
  rifle:  { name:'AK-M',    dmg:24, cd:145,  mag:30, reload:2000, spread:0.05, pellets:1, range:660, auto:true,  brate:1000,color:'#ff9f43' },
  shotgun:{ name:'S686',    dmg:9,  cd:850,  mag:6,  reload:2300, spread:0.20, pellets:7, range:300, auto:false, brate:650, color:'#ff5d5d' },
  sniper: { name:'AWM',     dmg:92, cd:1600, mag:5,  reload:3000, spread:0.008,pellets:1, range:950, auto:false, brate:1600,color:'#b98cff' },
};
const LOOT_W = ['pistol','pistol','smg','rifle','rifle','shotgun','sniper','medkit','medkit','ammo','armor'];

// ---------- State ----------
let W = 3400, BOT_N = 29;
let players=[], bullets=[], loots=[], obstacles=[], houses=[], trees=[];
let cam={x:0,y:0}, keys={}, mouse={x:0,y:0,down:false};
let me=null, state='menu', startT=0, killFeed=[];
let zone={x:0,y:0,r:0, tx:0,ty:0,tr:0, phase:0, mode:'wait', t:0};
const PHASES=[{wait:14,shrink:22,dps:2},{wait:11,shrink:18,dps:5},{wait:9,shrink:15,dps:9},{wait:8,shrink:13,dps:14},{wait:7,shrink:12,dps:20},{wait:6,shrink:11,dps:28}];
let plane={x1:0,y1:0,x2:0,y2:0};
let parallaxGrass=[];
let frame=0;

const rnd=(a,b)=>a+Math.random()*(b-a);
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const NAMES=['Shroud','Ninja','Panda','Viper','Ghost','Reaper','Falcon','Tiger','Wolf','Storm','Blaze','Cobra','Duke','Echo','Fury','Grizz','Havoc','Ivy','Jax','Kruger','Lynx','Mamba','Nova','Onyx','Piper','Quinn','Rogue','Sarge','Tex','Uzi','Vandal','Wraith','Xeno','Yuri','Zeus','Ash','Boris','Casper','Dagger','Ember'];

// ---------- Map gen ----------
function genMap(){
  players=[];bullets=[];loots=[];obstacles=[];houses=[];trees=[];
  parallaxGrass = Array.from({length:600},()=>({x:rnd(0,W),y:rnd(0,W),s:rnd(1,3)}));
  const towns=7, townC=[];
  for(let i=0;i<towns;i++) townC.push({x:rnd(W*.12,W*.88), y:rnd(W*.12,W*.88)});
  // houses in towns
  townC.forEach(t=>{
    const n=4+Math.floor(rnd(0,4));
    for(let i=0;i<n;i++){
      const hx=t.x+rnd(-260,260), hy=t.y+rnd(-260,260);
      const hw=rnd(90,150), hh=rnd(70,120);
      const h={x:hx-hw/2,y:hy-hh/2,w:hw,h:hh};
      houses.push(h);
      // walls with a door gap on south side
      const th=12, gap={a:hw*0.35,b:hw*0.65};
      obstacles.push({x:h.x,y:h.y,w:hw,h:th,type:'wall'});
      obstacles.push({x:h.x,y:h.y+hh-th,w:gap.a,h:th,type:'wall'});
      obstacles.push({x:h.x+gap.b,y:h.y+hh-th,w:hw-gap.b,h:th,type:'wall'});
      obstacles.push({x:h.x,y:h.y,w:th,h:hh,type:'wall'});
      obstacles.push({x:h.x+hw-th,y:h.y,w:th,h:hh,type:'wall'});
      // loot inside
      const ln=2+Math.floor(rnd(0,3));
      for(let k=0;k<ln;k++) spawnLoot(hx+rnd(-hw/3,hw/3), hy+rnd(-hh/3,hh/3));
    }
  });
  // scattered loot
  for(let i=0;i<70;i++) spawnLoot(rnd(100,W-100), rnd(100,W-100));
  // rocks
  for(let i=0;i<130;i++){
    const r=rnd(18,46);
    obstacles.push({x:rnd(60,W-60),y:rnd(60,W-60),r,type:'rock'});
  }
  // trees (no collision, block sight slightly)
  for(let i=0;i<380;i++) trees.push({x:rnd(0,W),y:rnd(0,W),r:rnd(14,26)});
  // plane path
  const ang=rnd(0,Math.PI*2);
  plane={x1:W/2-Math.cos(ang)*W, y1:W/2-Math.sin(ang)*W, x2:W/2+Math.cos(ang)*W, y2:W/2+Math.sin(ang)*W};
  // zone init
  zone={x:W/2,y:W/2,r:W*0.48, tx:W/2,ty:W/2,tr:W*0.48, phase:0, mode:'wait', t:PHASES[0].wait};
  pickNextCircle();
}
function spawnLoot(x,y,force){
  const k = force || LOOT_W[Math.floor(Math.random()*LOOT_W.length)];
  if(k==='ammo') loots.push({x,y,kind:'ammo',ammo:30});
  else if(k==='medkit') loots.push({x,y,kind:'medkit'});
  else if(k==='armor') loots.push({x,y,kind:'armor',lvl:Math.random()<.25?2:1});
  else loots.push({x,y,kind:'gun',gun:k,ammo:GUNS[k].mag});
}

// ---------- Players ----------
function mkPlayer(name, isBot, x, y){
  return { name, isBot, x, y, hp:100, armor:0, alive:true,
    gun:'fists', mag:GUNS.fists.mag, reserve:0, reloading:0, cd:0,
    meds:0, kills:0, ang:0, speed:0, vx:0, vy:0,
    ai:{ tx:x, ty:y, t:0, mode:'loot', strafe:Math.random()<.5?1:-1, react:rnd(0.4,1.0) },
    parachute: isBot ? rnd(0,0.6) : 0,
    shield: 4, zoneTick: 0, healT: 0,
    vulnerable: 0 };
}
function spawnAll(dropX, dropY){
  const names=[...NAMES].sort(()=>Math.random()-.5);
  me = mkPlayer('YOU', false, dropX, dropY);
  me.parachute = 1.2;
  me.shield = 5;
  // guaranteed starter loot near the player drop
  spawnLoot(dropX+40, dropY, 'rifle');
  spawnLoot(dropX-50, dropY+30, 'ammo');
  spawnLoot(dropX+10, dropY-60, 'medkit');
  players.push(me);
  for(let i=0;i<BOT_N;i++){
    const p = mkPlayer(names[i%names.length]+(i>=names.length?' '+(1+Math.floor(i/names.length)):''), true, 0, 0);
    // scatter bots map-wide along plane path + random (not on top of player)
    const t=Math.random();
    p.x=clamp(plane.x1+(plane.x2-plane.x1)*t+rnd(-300,300),60,W-60);
    p.y=clamp(plane.y1+(plane.y2-plane.y1)*t+rnd(-300,300),60,W-60);
    // keep bots off the player's landing spot
    if(Math.hypot(p.x-dropX,p.y-dropY)<350){ p.x=clamp(p.x+(p.x>dropX?450:-450),60,W-60); p.y=clamp(p.y+(p.y>dropY?450:-450),60,W-60); }
    players.push(p);
  }
}

// ---------- Collision ----------
function collideCircle(p, rad=16){
  // world bounds
  p.x=clamp(p.x,20,W-20); p.y=clamp(p.y,20,W-20);
  for(const o of obstacles){
    if(o.type==='rock'){
      const d=Math.hypot(p.x-o.x,p.y-o.y), min=o.r+rad;
      if(d<min&&d>0.01){ p.x=o.x+(p.x-o.x)/d*min; p.y=o.y+(p.y-o.y)/d*min; }
    } else {
      const nx=clamp(p.x,o.x,o.x+o.w), ny=clamp(p.y,o.y,o.y+o.h);
      const dx=p.x-nx, dy=p.y-ny, d=Math.hypot(dx,dy);
      if(d<rad){
        if(d<0.01){ p.y=o.y-rad; }
        else { p.x=nx+dx/d*rad; p.y=ny+dy/d*rad; }
      }
    }
  }
}
function bulletHitsWall(b){
  if(b.x<0||b.y<0||b.x>W||b.y>W) return true;
  for(const o of obstacles){
    if(o.type==='rock'){ if(Math.hypot(b.x-o.x,b.y-o.y)<o.r) return true; }
    else if(b.x>o.x&&b.x<o.x+o.w&&b.y>o.y&&b.y<o.y+o.h) return true;
  }
  return false;
}

// ---------- Combat ----------
function shoot(p){
  const g=GUNS[p.gun];
  if(!p.alive||p.reloading>0||p.cd>0||p.parachute>0) return;
  if(g.mag!==Infinity && p.mag<=0){ startReload(p); return; }
  p.cd=g.cd/1000;
  if(g.mag!==Infinity) p.mag--;
  const base=p.isBot?p.ang:p.ang;
  for(let i=0;i<g.pellets;i++){
    const a=base+rnd(-g.spread,g.spread)+(g.pellets>1?rnd(-0.06,0.06):0);
    bullets.push({x:p.x+Math.cos(a)*22, y:p.y+Math.sin(a)*22,
      vx:Math.cos(a)*g.brate, vy:Math.sin(a)*g.brate,
      dmg:g.dmg, range:g.range, trav:0, owner:p, gun:p.gun});
  }
  p.vx-=Math.cos(base)*(p.gun==='shotgun'?120:p.gun==='sniper'?160:20);
  p.vy-=Math.sin(base)*(p.gun==='shotgun'?120:p.gun==='sniper'?160:20);
  if(p===me){ SFX.shoot(p.gun); muzzle=p.gun; muzzleT=0.06; }
}
function startReload(p){
  const g=GUNS[p.gun];
  if(g.mag===Infinity||p.reloading>0||p.reserve<=0) return;
  p.reloading=g.reload/1000;
}
function damage(victim, amt, killer){
  if(!victim.alive||victim.parachute>0||victim.shield>0) return;
  if(victim.armor>0){ const ab=Math.min(victim.armor, amt*0.5); victim.armor-=ab; amt-=ab; }
  victim.hp-=amt;
  if(victim===me){ SFX.hurt(); $('dmgVignette').classList.add('hurt'); setTimeout(()=>$('dmgVignette').classList.remove('hurt'),180); }
  else if(killer===me){ SFX.hit(); const h=$('hitmarker'); h.classList.remove('show'); void h.offsetWidth; h.classList.add('show'); }
  if(victim.hp<=0){
    victim.hp=0; victim.alive=false;
    dropLootOnDeath(victim);
    if(killer&&killer!==victim){ killer.kills++; if(killer===me){ SFX.kill(); } }
    feed(`${killer?killer.name:'ZONE'} ☠ ${victim.name}${killer&&killer.gun?' <i>['+GUNS[killer.gun].name+']</i>':''}`);
    checkEnd();
  }
}
function dropLootOnDeath(p){
  if(p.gun!=='fists') loots.push({x:p.x+rnd(-10,10),y:p.y+rnd(-10,10),kind:'gun',gun:p.gun,ammo:p.mag});
  if(p.reserve>0) loots.push({x:p.x+rnd(-20,20),y:p.y+rnd(-20,20),kind:'ammo',ammo:p.reserve});
  if(p.meds>0) loots.push({x:p.x+rnd(-20,20),y:p.y+rnd(-20,20),kind:'medkit'});
}
function feed(html){
  const d=document.createElement('div'); d.innerHTML=html;
  $('feed').prepend(d);
  while($('feed').children.length>6) $('feed').lastChild.remove();
  setTimeout(()=>d.remove(), 9000);
}
function toast(msg, ms=2200){
  const t=$('toast'); t.textContent=msg; t.classList.remove('hidden');
  clearTimeout(t._h); t._h=setTimeout(()=>t.classList.add('hidden'),ms);
}

// ---------- Zone ----------
function pickNextCircle(){
  const shrinkF=[0.62,0.55,0.5,0.45,0.35,0.2][Math.min(zone.phase,5)]||0.2;
  const nr=zone.r*shrinkF;
  const maxOff=Math.max(0, zone.r-nr);
  const a=rnd(0,Math.PI*2), d=rnd(0,maxOff*0.7);
  zone.tx=clamp(zone.x+Math.cos(a)*d, nr, W-nr);
  zone.ty=clamp(zone.y+Math.sin(a)*d, nr, W-nr);
  zone.tr=Math.max(60,nr);
}
function updateZone(dt){
  zone.t-=dt;
  const cx0=zone.x, cy0=zone.y, r0=zone.r;
  if(zone.mode==='wait'&&zone.t<=0){ zone.mode='shrink'; zone.t=PHASES[Math.min(zone.phase,PHASES.length-1)].shrink; SFX.zone(); toast('⚠ ZONE SHRINKING — GET TO SAFETY'); }
  else if(zone.mode==='shrink'){
    const total=PHASES[Math.min(zone.phase,PHASES.length-1)].shrink;
    const k=clamp(1-zone.t/total,0,1);
    // recompute from stored start each frame: store start in zone.sx
    zone.x=zone.sx+(zone.tx-zone.sx)*k; zone.y=zone.sy+(zone.ty-zone.sy)*k; zone.r=zone.sr+(zone.tr-zone.sr)*k;
    if(zone.t<=0){ zone.phase++; zone.mode='wait'; zone.t=(PHASES[Math.min(zone.phase,PHASES.length-1)]||{wait:6}).wait;
      zone.sx=zone.x;zone.sy=zone.y;zone.sr=zone.r; pickNextCircle(); }
  }
  if(zone.sx===undefined){ zone.sx=zone.x;zone.sy=zone.y;zone.sr=zone.r; }
  const dps=(PHASES[Math.min(zone.phase,PHASES.length-1)]||{dps:30}).dps;
  for(const p of players){
    if(!p.alive) continue;
    if(Math.hypot(p.x-zone.x,p.y-zone.y)>zone.r){ p.zoneTick=(p.zoneTick||0)+dt; if(p.zoneTick>1){p.zoneTick=0; damage(p,dps,null);} }
  }
}

// ---------- Bot AI ----------
function botThink(p,dt){
  const ai=p.ai; ai.t-=dt;
  const dz=Math.hypot(p.x-zone.tx,p.y-zone.ty);
  const outside=Math.hypot(p.x-zone.x,p.y-zone.y)>zone.r*0.92;
  // find enemy (shorter sight right after landing so players can loot)
  const matchAge=(performance.now()-startT)/1000;
  const sight = matchAge<25 ? 240 : 520;
  let foe=null,fd=sight;
  for(const q of players){ if(q===p||!q.alive||q.parachute>0||q.shield>0) continue;
    const d=Math.hypot(p.x-q.x,p.y-q.y); if(d<fd){fd=d;foe=q;} }
  if(foe&&fd<480&&matchAge>9&&(p.gun!=='fists'||fd<90)){ ai.mode='fight'; ai.react-=dt; }
  else if(outside) ai.mode='zone';
  else if(ai.t<=0){ ai.mode = Math.random()<0.55?'loot':'roam'; ai.t=rnd(3,7);
    if(ai.mode==='loot'){ let bl=null,bd=1e9; for(const l of loots){const d=Math.hypot(p.x-l.x,p.y-l.y); if(d<bd){bd=d;bl=l;}} if(bl){ai.tx=bl.x;ai.ty=bl.y;} else {ai.tx=rnd(zone.tx-zone.tr,zone.tx+zone.tr);ai.ty=rnd(zone.ty-zone.tr,zone.ty+zone.tr);} }
    else { ai.tx=clamp(zone.tx+rnd(-zone.tr,zone.tr),40,W-40); ai.ty=clamp(zone.ty+rnd(-zone.tr,zone.tr),40,W-40); } }
  let mvx=0,mvy=0, wantShoot=false;
  if(ai.mode==='fight'&&foe){
    p.ang=Math.atan2(foe.y-p.y,foe.x-p.x)+rnd(-0.14,0.14);
    const g=GUNS[p.gun];
    const want= p.gun==='sniper'?420 : p.gun==='shotgun'?140 : 260;
    const dx=p.x-foe.x, dy=p.y-foe.y, d=Math.max(1,fd);
    if(d>want+40){mvx=-dx/d;mvy=-dy/d;} else if(d<want-60){mvx=dx/d;mvy=dy/d;}
    else { mvx=-dy/d*ai.strafe; mvy=dx/d*ai.strafe; if(Math.random()<0.01)ai.strafe*=-1; }
    if(outside){ mvx+=(zone.tx-p.x)/Math.max(1,dz)*0.8; mvy+=(zone.ty-p.y)/Math.max(1,dz)*0.8; }
    wantShoot = fd<g.range*0.9 && ai.react<=0 && Math.random()<(p.gun==='sniper'?0.15:0.32);
    // pickup better gun nearby even in fight
    autoPickup(p,true);
  } else {
    const dx=ai.tx-p.x, dy=ai.ty-p.y, d=Math.hypot(dx,dy);
    if(d>24){mvx=dx/d;mvy=dy/d;}
    p.ang=Math.atan2(mvy,mvx);
    if(outside){ mvx=(zone.tx-p.x)/Math.max(1,dz); mvy=(zone.ty-p.y)/Math.max(1,dz); }
    autoPickup(p,false);
    // use medkit when safe
    if(p.hp<55&&p.meds>0&&fd>260&&p.healT===undefined){ p.healT=3; }
  }
  const sp=(outside?265:205)*(p.parachute>0?2.2:1);
  p.vx+=(mvx*sp-p.vx)*Math.min(1,dt*6); p.vy+=(mvy*sp-p.vy)*Math.min(1,dt*6);
  if(wantShoot&&p.cd<=0&&p.reloading<=0){
    if(p.mag<=0) startReload(p); else { shoot(p); ai.react=rnd(0.35,0.8); }
  }
  if(p.healT>0){ p.healT-=dt; p.vx*=0.4;p.vy*=0.4; if(p.healT<=0){ p.meds--; p.hp=Math.min(100,p.hp+45); p.healT=0; } }
  if(p.reloading<=0&&p.mag<=0) startReload(p);
}
function autoPickup(p, inFight){
  if(p.reloading>0) return;
  // find loot on top
  for(let i=loots.length-1;i>=0;i--){
    const l=loots[i];
    if(Math.hypot(p.x-l.x,p.y-l.y)>30) continue;
    if(l.kind==='gun'){
      const rank={fists:0,pistol:1,smg:2,shotgun:2,rifle:3,sniper:4};
      if(rank[l.gun]>rank[p.gun]){ if(p.gun!=='fists') loots.push({x:p.x,y:p.y,kind:'gun',gun:p.gun,ammo:p.mag});
        p.gun=l.gun; p.mag=l.ammo; p.reserve=Math.max(p.reserve,30); loots.splice(i,1); }
      else if(p.reserve<90){ p.reserve+=l.ammo; loots.splice(i,1); }
    } else if(l.kind==='ammo'){ if(p.gun!=='fists'){p.reserve=Math.min(180,p.reserve+l.ammo); loots.splice(i,1);} }
    else if(l.kind==='medkit'){ if(p.meds<4){p.meds++; loots.splice(i,1);} }
    else if(l.kind==='armor'){ p.armor=Math.max(p.armor, l.lvl===2?75:50); loots.splice(i,1); }
    if(inFight) break;
  }
}

// ---------- Input ----------
addEventListener('keydown',e=>{
  keys[e.key.toLowerCase()]=true;
  if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase())) e.preventDefault();
  if(state!=='playing'||!me||!me.alive) return;
  if(e.key.toLowerCase()==='e') tryPickup(me);
  if(e.key.toLowerCase()==='r') startReload(me);
  if(e.key.toLowerCase()==='q') useMedkit(me);
});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;});
addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});
addEventListener('mousedown',e=>{ if(e.target.closest('button,input,select,canvas#dropMap'))return; mouse.down=true; });
addEventListener('mouseup',()=>{mouse.down=false;});
// touch: left half = move stick, right half = aim+fire
let touchMove=null, touchAim=null;
canvas.addEventListener('touchstart',e=>{ for(const t of e.changedTouches){ if(t.clientX<innerWidth/2) touchMove={id:t.identifier,x0:t.clientX,y0:t.clientY,x:t.clientX,y:t.clientY}; else touchAim={id:t.identifier,x:t.clientX,y:t.clientY}; } mouse.down=!!touchAim; e.preventDefault(); },{passive:false});
canvas.addEventListener('touchmove',e=>{ for(const t of e.changedTouches){ if(touchMove&&t.identifier===touchMove.id){touchMove.x=t.clientX;touchMove.y=t.clientY;} if(touchAim&&t.identifier===touchAim.id){touchAim.x=t.clientX;touchAim.y=t.clientY;mouse.x=t.clientX;mouse.y=t.clientY;} } e.preventDefault(); },{passive:false});
canvas.addEventListener('touchend',e=>{ for(const t of e.changedTouches){ if(touchMove&&t.identifier===touchMove.id)touchMove=null; if(touchAim&&t.identifier===touchAim.id){touchAim=null;mouse.down=false;} } },{passive:false});

function tryPickup(p){
  let best=null,bd=70;
  for(const l of loots){ const d=Math.hypot(p.x-l.x,p.y-l.y); if(d<bd){bd=d;best=l;} }
  if(!best){ return; }
  if(best.kind==='gun'){ const old=p.gun,om=p.mag;
    p.gun=best.gun; p.mag=best.ammo; if(p.reserve<30)p.reserve=30;
    loots.splice(loots.indexOf(best),1);
    if(old!=='fists') loots.push({x:p.x,y:p.y,kind:'gun',gun:old,ammo:om});
    toast('Picked up '+GUNS[p.gun].name); SFX.pickup();
  } else if(best.kind==='ammo'){ if(p.gun==='fists'){toast('Need a gun first!');return;} p.reserve=Math.min(240,p.reserve+best.ammo); loots.splice(loots.indexOf(best),1); toast('+ammo'); SFX.pickup(); }
  else if(best.kind==='medkit'){ if(p.meds>=5){toast('Medkits full');return;} p.meds++; loots.splice(loots.indexOf(best),1); toast('+medkit (Q to heal)'); SFX.pickup(); }
  else if(best.kind==='armor'){ p.armor=best.lvl===2?75:50; loots.splice(loots.indexOf(best),1); toast(best.lvl===2?'Lvl.2 Vest!':'Vest equipped'); SFX.pickup(); }
}
let healChannel=null;
function useMedkit(p){
  if(p.meds<=0){ toast('No medkits!'); return; }
  if(p.hp>=100){ toast('HP full'); return; }
  if(p.healT>0) return;
  p.healT=3; toast('Healing… stay still-ish');
}

// ---------- Flow ----------
$('dropBtn').onclick=()=>{ BOT_N=clamp(parseInt($('botCount').value)||29,1,49); W=parseInt($('mapSize').value)||3400;
  genMap(); $('menu').classList.add('hidden'); $('dropScreen').classList.remove('hidden'); drawDropMap(); };
$('randomDrop').onclick=()=>startGame(rnd(W*.25,W*.75), rnd(W*.25,W*.75));
$('againBtn').onclick=()=>location.reload();
$('dropMap').onclick=e=>{
  const r=$('dropMap').getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width*W, y=(e.clientY-r.top)/r.height*W;
  startGame(x,y);
};
function drawDropMap(){
  const c=$('dropMap'), g=c.getContext('2d');
  g.fillStyle='#5c8a4a'; g.fillRect(0,0,420,420);
  const s=420/W;
  g.fillStyle='#3f6b37'; houses.forEach(h=>g.fillRect(h.x*s,h.y*s,h.w*s,h.h*s));
  g.strokeStyle='#fff'; g.lineWidth=2; g.setLineDash([6,4]);
  g.beginPath(); g.moveTo(plane.x1*s,plane.y1*s); g.lineTo(plane.x2*s,plane.y2*s); g.stroke(); g.setLineDash([]);
  g.fillStyle='#fff'; g.font='12px sans-serif'; g.fillText('✈ plane path — click to drop',10,18);
}
function startGame(x,y){
  $('dropScreen').classList.add('hidden'); $('hud').classList.remove('hidden');
  spawnAll(clamp(x,60,W-60), clamp(y,60,W-60));
  state='playing'; startT=performance.now();
  zone.sx=zone.x;zone.sy=zone.y;zone.sr=zone.r;
  toast('Survive! '+players.length+' dropped');
}
function checkEnd(){
  const alive=players.filter(p=>p.alive);
  if(!me.alive && state==='playing'){ endGame(false); }
  else if(alive.length===1&&alive[0]===me&&state==='playing'){ endGame(true); }
  else if(alive.length<=1&&state==='playing'){ endGame(me.alive); }
}
function endGame(win){
  state='over'; SFX.win();
  $('endScreen').classList.remove('hidden');
  $('endTitle').textContent = win?'WINNER WINNER CHICKEN DINNER!':'#'+(players.filter(p=>p.alive).length+1)+' — YOU DIED';
  const t=Math.floor((performance.now()-startT)/1000);
  $('endSub').textContent = win?'Last one standing out of '+players.length+'. Legendary.': 'Better luck next drop, soldier.';
  $('stats').innerHTML=`<div><b>${me.kills}</b><span>kills</span></div><div><b>${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}</b><span>survived</span></div><div><b>${players.length}</b><span>dropped</span></div>`;
}

// ---------- Update ----------
let last=performance.now(), muzzle=null, muzzleT=0;
function update(dt){
  frame++;
  if(state!=='playing') return;
  updateZone(dt);
  // player movement
  if(me&&me.alive){
    if(me.parachute>0){ me.parachute-=dt; }
    if(me.shield>0){ me.shield-=dt; }
    let mx=0,my=0;
    if(keys['w']||keys['arrowup'])my-=1; if(keys['s']||keys['arrowdown'])my+=1;
    if(keys['a']||keys['arrowleft'])mx-=1; if(keys['d']||keys['arrowright'])mx+=1;
    if(touchMove){ mx=(touchMove.x-touchMove.x0)/60; my=(touchMove.y-touchMove.y0)/60; const l=Math.hypot(mx,my); if(l>1){mx/=l;my/=l;} }
    const sprint=(keys['shift'])?1.45:1;
    const sp=(me.healT>0?110:265)*sprint*(me.parachute>0?2.0:1);
    const l=Math.hypot(mx,my)||1; if(mx||my){mx/=l;my/=l;}
    me.vx+=(mx*sp-me.vx)*Math.min(1,dt*10); me.vy+=(my*sp-me.vy)*Math.min(1,dt*10);
    me.x+=me.vx*dt; me.y+=me.vy*dt; collideCircle(me);
    me.ang=Math.atan2(mouse.y-canvas.height/2, mouse.x-canvas.width/2);
    if(touchAim) me.ang=Math.atan2(touchAim.y-canvas.height/2, touchAim.x-canvas.width/2);
    me.cd-=dt; if(me.reloading>0){ me.reloading-=dt; if(me.reloading<=0){ const g=GUNS[me.gun], need=g.mag-me.mag, take=Math.min(need,me.reserve); me.mag+=take; me.reserve-=take; } }
    if(me.healT>0){ me.healT-=dt; if(me.healT<=0){ me.meds--; me.hp=Math.min(100,me.hp+50); toast('Healed +50'); SFX.pickup(); } }
    const g=GUNS[me.gun];
    if(mouse.down&&(g.auto||!mouse._clicked)){ shoot(me); mouse._clicked=true; }
    if(!mouse.down) mouse._clicked=false;
    if(muzzleT>0)muzzleT-=dt;
  }
  // bots
  for(const p of players){ if(p.isBot&&p.alive){
    if(p.parachute>0)p.parachute-=dt;
    if(p.shield>0)p.shield-=dt;
    p.cd-=dt;
    if(p.reloading>0){ p.reloading-=dt; if(p.reloading<=0){ const g=GUNS[p.gun],need=g.mag-p.mag,take=Math.min(need,p.reserve); p.mag+=take;p.reserve-=take; } }
    botThink(p,dt);
    p.x+=p.vx*dt; p.y+=p.vy*dt; collideCircle(p);
  }}
  // bullets
  for(let i=bullets.length-1;i>=0;i--){
    const b=bullets[i];
    b.x+=b.vx*dt; b.y+=b.vy*dt; b.trav+=Math.hypot(b.vx,b.vy)*dt;
    if(b.trav>b.range||bulletHitsWall(b)){ bullets.splice(i,1); continue; }
    for(const p of players){
      if(!p.alive||p===b.owner||p.parachute>0||p.shield>0) continue;
      if(Math.hypot(p.x-b.x,p.y-b.y)<16){ damage(p,b.dmg*(b.gun==='sniper'?1:1),b.owner); bullets.splice(i,1); break; }
    }
  }
  // HUD
  $('alive').textContent=players.filter(p=>p.alive).length;
  $('kills').textContent=me?me.kills:0;
  $('hpFill').style.width=(me?me.hp:0)+'%';
  $('hpFill').style.background=me.hp>50?'linear-gradient(90deg,#7dff8a,#2ecc40)':me.hp>25?'linear-gradient(90deg,#ffd57a,#e8890c)':'linear-gradient(90deg,#ff6b6b,#c0392b)';
  $('hpText').textContent=Math.ceil(me?me.hp:0);
  $('armorText').textContent=me&&me.armor>0?'🛡 '+Math.ceil(me.armor):'';
  $('meds').textContent=me?me.meds:0;
  const g=me?GUNS[me.gun]:GUNS.fists;
  $('weaponName').textContent=(me?GUNS[me.gun].name:'')+(me&&me.reloading>0?' — RELOADING':'')+(me&&me.healT>0?' — HEALING':'');
  $('ammo').textContent=me?(g.mag===Infinity?'—':me.mag+' / '+me.reserve):'';
  const zt=Math.ceil(zone.t);
  $('zoneTimer').textContent=(zone.mode==='wait'?'⏳ ':'🔥 ')+zt+'s P'+(zone.phase+1);
  // pickup prompt
  let best=null,bd=70;
  if(me&&me.alive) for(const l of loots){const d=Math.hypot(me.x-l.x,me.y-l.y); if(d<bd){bd=d;best=l;}};
  const pp=$('pickupPrompt');
  if(best){ pp.classList.remove('hidden'); pp.textContent='[E] '+(best.kind==='gun'?('Take '+GUNS[best.gun].name):best.kind==='ammo'?('+'+best.ammo+' ammo'):best.kind==='medkit'?'+ Medkit':'+ Armor'); }
  else pp.classList.add('hidden');
  drawMinimap();
}

// ---------- Render ----------
function render(){
  ctx.fillStyle='#22331f'; ctx.fillRect(0,0,canvas.width,canvas.height);
  if(state==='menu'){ // animated backdrop behind menu
    const t=performance.now()/1000;
    ctx.fillStyle='#5c8a4a'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='rgba(0,0,0,.15)';
    for(let i=0;i<40;i++){ const x=(i*197+t*30)%(canvas.width+80)-40, y=(i*131)%canvas.height; ctx.beginPath();ctx.arc(x,y,18,0,7);ctx.fill(); }
    requestAnimationFrame(render); return;
  }
  if(!me){ requestAnimationFrame(render); return; }
  cam.x+=(me.x-cam.x)*0.12; cam.y+=(me.y-cam.y)*0.12;
  if(frame<3){cam.x=me.x;cam.y=me.y;}
  const ox=canvas.width/2-cam.x, oy=canvas.height/2-cam.y;
  // grass base
  ctx.fillStyle='#5c8a4a'; ctx.fillRect(ox,oy,W,W);
  ctx.fillStyle='#527d43';
  for(const g of parallaxGrass){ const sx=g.x+ox, sy=g.y+oy; if(sx<-10||sy<-10||sx>canvas.width+10||sy>canvas.height+10)continue; ctx.fillRect(sx,sy,g.s,g.s*2); }
  // zone shading (outside current circle blue)
  // proper zone overlay: draw fullscreen blue then cut circle
  ctx.save();
  ctx.beginPath(); ctx.rect(0,0,canvas.width,canvas.height);
  ctx.arc(zone.x+ox,zone.y+oy,zone.r,0,7,true); ctx.fillStyle='rgba(50,90,255,0.38)'; ctx.fill();
  ctx.restore();
  // next circle
  ctx.strokeStyle='#fff'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(zone.tx+ox,zone.ty+oy,zone.tr,0,7); ctx.stroke();
  // current circle
  ctx.strokeStyle='#4db2ff'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(zone.x+ox,zone.y+oy,zone.r,0,7); ctx.stroke();
  // houses
  for(const h of houses){
    ctx.fillStyle='#c9a06a'; ctx.fillRect(h.x+ox,h.y+oy,h.w,h.h);
    ctx.fillStyle='#8a5f3a'; ctx.fillRect(h.x+ox,h.y+oy,h.w,10);
    ctx.fillStyle='rgba(0,0,0,.12)'; ctx.fillRect(h.x+ox,h.y+8+oy,h.w,h.h-8);
  }
  // walls/rocks
  for(const o of obstacles){
    if(o.type==='rock'){ ctx.fillStyle='#7d7d7d'; ctx.beginPath(); ctx.arc(o.x+ox,o.y+oy,o.r,0,7); ctx.fill();
      ctx.fillStyle='#9a9a9a'; ctx.beginPath(); ctx.arc(o.x-o.r*0.2+ox,o.y-o.r*0.2+oy,o.r*0.6,0,7); ctx.fill(); }
    else { ctx.fillStyle='#5b4632'; ctx.fillRect(o.x+ox,o.y+oy,o.w,o.h); }
  }
  // loot
  for(const l of loots){
    const sx=l.x+ox, sy=l.y+oy;
    if(sx<-30||sy<-30||sx>canvas.width+30||sy>canvas.height+30)continue;
    const bob=Math.sin(performance.now()/400+l.x)*2;
    if(l.kind==='gun'){ ctx.fillStyle='#1a1a1a'; ctx.fillRect(sx-14,sy-4+bob,28,8);
      ctx.fillStyle=GUNS[l.gun].color; ctx.fillRect(sx-14,sy-4+bob,28,3);
      ctx.fillStyle='#fff'; ctx.font='10px sans-serif'; ctx.textAlign='center'; ctx.fillText(GUNS[l.gun].name,sx,sy-10+bob); }
    else if(l.kind==='ammo'){ ctx.fillStyle='#2b2b2b'; ctx.fillRect(sx-7,sy-7+bob,14,14); ctx.fillStyle='#ffd57a'; ctx.font='11px sans-serif'; ctx.textAlign='center'; ctx.fillText('9mm',sx,sy+4+bob); }
    else if(l.kind==='medkit'){ ctx.fillStyle='#fff'; ctx.fillRect(sx-8,sy-8+bob,16,16); ctx.fillStyle='#e63946'; ctx.fillRect(sx-2,sy-6+bob,4,12); ctx.fillRect(sx-6,sy-2+bob,12,4); }
    else if(l.kind==='armor'){ ctx.fillStyle='#2980b9'; ctx.beginPath(); ctx.arc(sx,sy+bob,9,0,7); ctx.fill(); ctx.fillStyle='#fff'; ctx.font='10px sans-serif'; ctx.textAlign='center'; ctx.fillText('V',sx,sy+4+bob); }
  }
  // trees (above loot, below players slightly transparent)
  for(const t of trees){ const sx=t.x+ox, sy=t.y+oy;
    if(sx<-40||sy<-40||sx>canvas.width+40||sy>canvas.height+40)continue;
    ctx.fillStyle='#2f5b28'; ctx.beginPath(); ctx.arc(sx,sy,t.r,0,7); ctx.fill();
    ctx.fillStyle='#3f7a36'; ctx.beginPath(); ctx.arc(sx-3,sy-3,t.r*0.65,0,7); ctx.fill(); }
  // bullets
  ctx.fillStyle='#ffe66d';
  for(const b of bullets){ ctx.fillRect(b.x+ox-2,b.y+oy-2,4,4); }
  // players sorted by y
  const sorted=[...players].filter(p=>p.alive).sort((a,b)=>a.y-b.y);
  for(const p of sorted){
    const sx=p.x+ox, sy=p.y+oy;
    if(sx<-50||sy<-50||sx>canvas.width+50||sy>canvas.height+50)continue;
    if(p.parachute>0){ // parachute
      ctx.fillStyle='#ff8c42'; ctx.beginPath(); ctx.arc(sx,sy-14,20,Math.PI,0); ctx.fill();
      ctx.strokeStyle='#333'; ctx.beginPath(); ctx.moveTo(sx-20,sy-14); ctx.lineTo(sx,sy); ctx.moveTo(sx+20,sy-14); ctx.lineTo(sx,sy); ctx.stroke();
    }
    // shadow
    ctx.fillStyle='rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(sx,sy+12,12,5,0,0,7); ctx.fill();
    // body
    ctx.fillStyle=p===me?'#2ecc71':'#e74c3c';
    if(p.isBot) ctx.fillStyle='#e74c3c';
    ctx.beginPath(); ctx.arc(sx,sy,14,0,7); ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.3)'; ctx.beginPath(); ctx.arc(sx,sy,14,p.ang-1.2,p.ang+1.2); ctx.fill();
    // gun
    const g=GUNS[p.gun];
    ctx.save(); ctx.translate(sx,sy); ctx.rotate(p.ang);
    if(p.gun!=='fists'){ ctx.fillStyle='#222'; const len=p.gun==='sniper'?34:p.gun==='shotgun'?28:24; ctx.fillRect(8,-3,len,6);
      if(muzzle===p.gun&&p===me&&muzzleT>0){ctx.fillStyle='#ffdd44';ctx.beginPath();ctx.arc(8+len,0,8,0,7);ctx.fill();} }
    ctx.restore();
    // face dir dot
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(sx+Math.cos(p.ang)*6,sy+Math.sin(p.ang)*6,3,0,7); ctx.fill();
    if(p.shield>0){ ctx.strokeStyle='rgba(120,200,255,.9)'; ctx.lineWidth=2; ctx.setLineDash([5,4]); ctx.beginPath(); ctx.arc(sx,sy,20,0,7); ctx.stroke(); ctx.setLineDash([]); }
    // hp bar + name
    ctx.fillStyle='rgba(0,0,0,.6)'; ctx.fillRect(sx-18,sy-30,36,5);
    ctx.fillStyle=p.hp>50?'#2ecc40':p.hp>25?'#f39c12':'#e74c3c'; ctx.fillRect(sx-18,sy-30,36*p.hp/100,5);
    ctx.fillStyle=p===me?'#fff':'#ffd0d0'; ctx.font='11px sans-serif'; ctx.textAlign='center';
    ctx.fillText(p===me?'YOU':p.name,sx,sy-34);
  }
  // plane flyover at start
  if(state==='playing'&&performance.now()-startT<4000){
    const k=(performance.now()-startT)/4000;
    const px=plane.x1+(plane.x2-plane.x1)*k+ox, py=plane.y1+(plane.y2-plane.y1)*k+oy;
    ctx.fillStyle='#333'; ctx.font='20px sans-serif'; ctx.textAlign='center'; ctx.fillText('✈',px,py);
  }
  // heal overlay
  if(me&&me.healT>0){ ctx.fillStyle='rgba(46,204,113,.15)'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#fff'; ctx.font='bold 18px sans-serif'; ctx.textAlign='center'; ctx.fillText('HEALING '+me.healT.toFixed(1)+'s…',canvas.width/2,canvas.height/2+80); }
  requestAnimationFrame(render);
}
function drawMinimap(){
  const s=170/W;
  mm.clearRect(0,0,170,170);
  mm.fillStyle='#4a7a40'; mm.fillRect(0,0,170,170);
  mm.strokeStyle='rgba(255,255,255,.6)'; mm.strokeRect(zone.x*s-zone.r*s,zone.y*s-zone.r*s,zone.r*s*2,zone.r*s*2);
  mm.fillStyle='rgba(50,90,255,.35)';
  mm.beginPath(); mm.rect(0,0,170,170); mm.arc(zone.x*s,zone.y*s,zone.r*s,0,7,true); mm.fill();
  mm.strokeStyle='#fff'; mm.lineWidth=1; mm.beginPath(); mm.arc(zone.tx*s,zone.ty*s,zone.tr*s,0,7); mm.stroke();
  for(const l of loots){ mm.fillStyle='#ffd57a'; mm.fillRect(l.x*s-1,l.y*s-1,2,2); }
  for(const p of players){ if(!p.alive)continue; mm.fillStyle=p===me?'#2eff6d':'#ff4d4d'; mm.beginPath(); mm.arc(p.x*s,p.y*s,p===me?3:2,0,7); mm.fill(); }
  // view
  mm.strokeStyle='rgba(255,255,255,.8)'; mm.strokeRect((cam.x-canvas.width/2)*s,(cam.y-canvas.height/2)*s,canvas.width*s,canvas.height*s);
}

// ---------- Boot for automated checks ----------
window.__game = { get state(){return state}, get players(){return players}, start:(x,y)=>{ if(state==='menu'){$('dropBtn').click();} startGame(x??W/2,y??W/2); }, get me(){return me} };

// ---------- Main loop ----------
function loop(t){
  const dt=Math.min(0.05,(t-last)/1000); last=t;
  update(dt);
  requestAnimationFrame(loop);
}
genMap(); // menu backdrop + drop map data
requestAnimationFrame(render);
requestAnimationFrame(loop);
window.addEventListener('load',()=>{ if(location.hash==='#autostart'){ startGame(W/2,W/2); } });
if(location.hash==='#autostart'&&state==='menu'){ startGame(W/2,W/2); $('menu').classList.add('hidden'); $('dropScreen').classList.add('hidden'); $('hud').classList.remove('hidden'); }
})();
