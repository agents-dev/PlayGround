(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(n){if(n.ep)return;n.ep=!0;const s=e(n);fetch(n.href,s)}})();/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Lc="186",T0={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},E0={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},am=0,Eu=1,om=2,A0=3,C0=0,Sr=1,lm=2,gr=3,ss=0,ci=1,zi=2,pn=0,es=1,Cr=2,Au=3,Cu=4,cm=5,R0=6,Rs=100,hm=101,um=102,dm=103,fm=104,pm=200,mm=201,gm=202,xm=203,Zu=204,$u=205,_m=206,ym=207,vm=208,Sm=209,Mm=210,bm=211,wm=212,Tm=213,Em=214,Fl=0,Bl=1,zl=2,Rr=3,Vl=4,kl=5,Gl=6,Hl=7,So=0,Am=1,Cm=2,Ki=0,Ku=1,Qu=2,ju=3,Nc=4,td=5,ed=6,id=7,Ru="attached",Rm="detached",Uc=300,xn=301,rs=302,ya=303,va=304,Xr=306,Pr=1e3,Ei=1001,Ia=1002,Fe=1003,nd=1004,P0=1004,xr=1005,I0=1005,Ce=1006,Sa=1007,L0=1007,un=1008,N0=1008,Ti=1009,sd=1010,rd=1011,Ir=1012,Dc=1013,ki=1014,xi=1015,Qi=1016,Oc=1017,Fc=1018,Lr=1020,ad=35902,od=35899,ld=1021,cd=1022,_i=1023,_n=1026,Kn=1027,Bc=1028,Mo=1029,as=1030,zc=1031,U0=1032,Vc=1033,Ma=33776,ba=33777,wa=33778,Ta=33779,Wl=35840,Xl=35841,ql=35842,Jl=35843,Yl=36196,Zl=37492,$l=37496,Kl=37488,Ql=37489,La=37490,jl=37491,tc=37808,ec=37809,ic=37810,nc=37811,sc=37812,rc=37813,ac=37814,oc=37815,lc=37816,cc=37817,hc=37818,uc=37819,dc=37820,fc=37821,pc=36492,mc=36494,gc=36495,xc=36283,_c=36284,Na=36285,yc=36286,Pm=2200,Im=2201,Lm=2202,Ua=2300,vc=2301,Pl=2302,Pu=2303,Ps=2400,Is=2401,Da=2402,kc=2500,hd=2501,D0=0,O0=1,F0=2,Nm=3200,B0=3201,z0=3202,V0=3203,Dn=0,Um=1,Rn="",Qe="srgb",Oa="srgb-linear",Fa="linear",ve="srgb",k0="",G0="rg",H0="ga",W0=0,Il=7680,X0=7681,q0=7682,J0=7683,Y0=34055,Z0=34056,$0=5386,K0=512,Q0=513,j0=514,tx=515,ex=516,ix=517,nx=518,Dm=519,Om=512,Fm=513,Bm=514,Gc=515,zm=516,Vm=517,Hc=518,km=519,Wc=35044,oi=35048,sx=35040,rx=35045,ax=35049,ox=35041,lx=35046,cx=35050,hx=35042,ux="100",Iu="300 es",Ui=2e3,Os=2001,dx={COMPUTE:"compute",RENDER:"render"},fx={PERSPECTIVE:"perspective",LINEAR:"linear",FLAT:"flat"},px={NORMAL:"normal",CENTROID:"centroid",SAMPLE:"sample",FIRST:"first",EITHER:"either"},mx={TEXTURE_COMPARE:"depthTextureCompare"},gx={NONE:0,SHARED:1,FULL:2};function xx(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}const _x={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function _r(r,t){return new _x[r](t)}function Gm(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function Ba(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Hm(){const r=Ba("canvas");return r.style.display="block",r}const lf={};let os=null;function yx(r){os=r}function vx(){return os}function za(...r){const t="THREE."+r.shift();os?os("log",t,...r):console.log(t,...r)}function Wm(r){const t=r[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=r[1];e&&e.isStackTrace?r[0]+=" "+e.getLocation():r[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return r}function dt(...r){r=Wm(r);const t="THREE."+r.shift();if(os)os("warn",t,...r);else{const e=r[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...r)}}function Ot(...r){r=Wm(r);const t="THREE."+r.shift();if(os)os("error",t,...r);else{const e=r[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...r)}}function Nn(...r){const t=r.join(" ");t in lf||(lf[t]=!0,dt(...r))}function Sx(r,t,e){return new Promise(function(i,n){function s(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:n();break;case r.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}const Mx={[Fl]:Bl,[zl]:Gl,[Vl]:Hl,[Rr]:kl,[Bl]:Fl,[Gl]:zl,[Hl]:Vl,[kl]:Rr};class tn{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){const i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){const i=this._listeners;if(i===void 0)return;const n=i[t];if(n!==void 0){const s=n.indexOf(e);s!==-1&&n.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const i=e[t.type];if(i!==void 0){t.target=this;const n=i.slice(0);for(let s=0,a=n.length;s<a;s++)n[s].call(this,t);t.target=null}}}const ni=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let cf=1234567;const Ls=Math.PI/180,Nr=180/Math.PI;function Di(){const r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(ni[r&255]+ni[r>>8&255]+ni[r>>16&255]+ni[r>>24&255]+"-"+ni[t&255]+ni[t>>8&255]+"-"+ni[t>>16&15|64]+ni[t>>24&255]+"-"+ni[e&63|128]+ni[e>>8&255]+"-"+ni[e>>16&255]+ni[e>>24&255]+ni[i&255]+ni[i>>8&255]+ni[i>>16&255]+ni[i>>24&255]).toLowerCase()}function Jt(r,t,e){return Math.max(t,Math.min(e,r))}function ud(r,t){return(r%t+t)%t}function bx(r,t,e,i,n){return i+(r-t)*(n-i)/(e-t)}function wx(r,t,e){return r!==t?(e-r)/(t-r):0}function Ea(r,t,e){return(1-e)*r+e*t}function Tx(r,t,e,i){return Ea(r,t,1-Math.exp(-e*i))}function Ex(r,t=1){return t-Math.abs(ud(r,t*2)-t)}function Ax(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*(3-2*r))}function Cx(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*r*(r*(r*6-15)+10))}function Rx(r,t){return r+Math.floor(Math.random()*(t-r+1))}function Px(r,t){return r+Math.random()*(t-r)}function Ix(r){return r*(.5-Math.random())}function Lx(r){r!==void 0&&(cf=r);let t=cf+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Nx(r){return r*Ls}function Ux(r){return r*Nr}function Dx(r){return r>0&&Number.isInteger(r)&&2**Math.round(Math.log2(r))===r}function Ox(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function Fx(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function Bx(r,t,e,i,n){const s=Math.cos,a=Math.sin,o=s(e/2),l=a(e/2),c=s((t+i)/2),h=a((t+i)/2),d=s((t-i)/2),u=a((t-i)/2),f=s((i-t)/2),p=a((i-t)/2);switch(n){case"XYX":r.set(o*h,l*d,l*u,o*c);break;case"YZY":r.set(l*u,o*h,l*d,o*c);break;case"ZXZ":r.set(l*d,l*u,o*h,o*c);break;case"XZX":r.set(o*h,l*p,l*f,o*c);break;case"YXY":r.set(l*f,o*h,l*p,o*c);break;case"ZYZ":r.set(l*p,l*f,o*h,o*c);break;default:dt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+n)}}function mi(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:case Uint8ClampedArray:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function ne(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const zx={DEG2RAD:Ls,RAD2DEG:Nr,generateUUID:Di,clamp:Jt,euclideanModulo:ud,mapLinear:bx,inverseLerp:wx,lerp:Ea,damp:Tx,pingpong:Ex,smoothstep:Ax,smootherstep:Cx,randInt:Rx,randFloat:Px,randFloatSpread:Ix,seededRandom:Lx,degToRad:Nx,radToDeg:Ux,isPowerOfTwo:Dx,ceilPowerOfTwo:Ox,floorPowerOfTwo:Fx,setQuaternionFromProperEuler:Bx,normalize:ne,denormalize:mi};var wr;let st=(wr=class{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,n=t.elements;return this.x=n[0]*e+n[3]*i+n[6],this.y=n[1]*e+n[4]*i+n[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Jt(this.x,t.x,e.x),this.y=Jt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=Jt(this.x,t,e),this.y=Jt(this.y,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Jt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Jt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),n=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*i-a*n+t.x,this.y=s*n+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},wr.prototype.isVector2=!0,wr),yi=class{constructor(t=0,e=0,i=0,n=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=n}static slerpFlat(t,e,i,n,s,a,o){let l=i[n+0],c=i[n+1],h=i[n+2],d=i[n+3],u=s[a+0],f=s[a+1],p=s[a+2],x=s[a+3];if(d!==x||l!==u||c!==f||h!==p){let m=l*u+c*f+h*p+d*x;m<0&&(u=-u,f=-f,p=-p,x=-x,m=-m);let g=1-o;if(m<.9995){const v=Math.acos(m),w=Math.sin(v);g=Math.sin(g*v)/w,o=Math.sin(o*v)/w,l=l*g+u*o,c=c*g+f*o,h=h*g+p*o,d=d*g+x*o}else{l=l*g+u*o,c=c*g+f*o,h=h*g+p*o,d=d*g+x*o;const v=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=v,c*=v,h*=v,d*=v}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,i,n,s,a){const o=i[n],l=i[n+1],c=i[n+2],h=i[n+3],d=s[a],u=s[a+1],f=s[a+2],p=s[a+3];return t[e]=o*p+h*d+l*f-c*u,t[e+1]=l*p+h*u+c*d-o*f,t[e+2]=c*p+h*f+o*u-l*d,t[e+3]=h*p-o*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,n){return this._x=t,this._y=e,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,n=t._y,s=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(n/2),d=o(s/2),u=l(i/2),f=l(n/2),p=l(s/2);switch(a){case"XYZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"YXZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"ZXY":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"ZYX":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"YZX":this._x=u*h*d+c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d-u*f*p;break;case"XZY":this._x=u*h*d-c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d+u*f*p;break;default:dt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,n=Math.sin(i);return this._x=t.x*n,this._y=t.y*n,this._z=t.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],n=e[4],s=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=i+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(s-c)*f,this._z=(a-n)*f}else if(i>o&&i>d){const f=2*Math.sqrt(1+i-o-d);this._w=(h-l)/f,this._x=.25*f,this._y=(n+a)/f,this._z=(s+c)/f}else if(o>d){const f=2*Math.sqrt(1+o-i-d);this._w=(s-c)/f,this._x=(n+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-i-o);this._w=(a-n)/f,this._x=(s+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Jt(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const n=Math.min(1,e/i);return this.slerp(t,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,n=t._y,s=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+a*o+n*c-s*l,this._y=n*h+a*l+s*o-i*c,this._z=s*h+a*c+i*l-n*o,this._w=a*h-i*o-n*l-s*c,this._onChangeCallback(),this}slerp(t,e){let i=t._x,n=t._y,s=t._z,a=t._w,o=this.dot(t);o<0&&(i=-i,n=-n,s=-s,a=-a,o=-o);let l=1-e;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+i*e,this._y=this._y*l+n*e,this._z=this._z*l+s*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+i*e,this._y=this._y*l+n*e,this._z=this._z*l+s*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(n*Math.sin(t),n*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}};var Tr;let C=(Tr=class{constructor(t=0,e=0,i=0){this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(hf.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(hf.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,n=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*n,this.y=s[1]*e+s[4]*i+s[7]*n,this.z=s[2]*e+s[5]*i+s[8]*n,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,s=t.elements,a=1/(s[3]*e+s[7]*i+s[11]*n+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*n+s[12])*a,this.y=(s[1]*e+s[5]*i+s[9]*n+s[13])*a,this.z=(s[2]*e+s[6]*i+s[10]*n+s[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,n=this.z,s=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*n-o*i),h=2*(o*e-s*n),d=2*(s*i-a*e);return this.x=e+l*c+a*d-o*h,this.y=i+l*h+o*c-s*d,this.z=n+l*d+s*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,n=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*n,this.y=s[1]*e+s[5]*i+s[9]*n,this.z=s[2]*e+s[6]*i+s[10]*n,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Jt(this.x,t.x,e.x),this.y=Jt(this.y,t.y,e.y),this.z=Jt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=Jt(this.x,t,e),this.y=Jt(this.y,t,e),this.z=Jt(this.z,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Jt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,n=t.y,s=t.z,a=e.x,o=e.y,l=e.z;return this.x=n*l-s*o,this.y=s*a-i*l,this.z=i*o-n*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return Eh.copy(this).projectOnVector(t),this.sub(Eh)}reflect(t){return this.sub(Eh.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(Jt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,n=this.z-t.z;return e*e+i*i+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const n=Math.sin(e)*t;return this.x=n*Math.sin(i),this.y=Math.cos(e)*t,this.z=n*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),n=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=n,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Tr.prototype.isVector3=!0,Tr);const Eh=new C,hf=new yi;var Er;let te=(Er=class{constructor(t,e,i,n,s,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,n,s,a,o,l,c)}set(t,e,i,n,s,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=n,h[2]=o,h[3]=e,h[4]=s,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],d=i[7],u=i[2],f=i[5],p=i[8],x=n[0],m=n[3],g=n[6],v=n[1],w=n[4],_=n[7],b=n[2],M=n[5],A=n[8];return s[0]=a*x+o*v+l*b,s[3]=a*m+o*w+l*M,s[6]=a*g+o*_+l*A,s[1]=c*x+h*v+d*b,s[4]=c*m+h*w+d*M,s[7]=c*g+h*_+d*A,s[2]=u*x+f*v+p*b,s[5]=u*m+f*w+p*M,s[8]=u*g+f*_+p*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],n=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-i*s*h+i*o*l+n*s*c-n*a*l}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=h*a-o*c,u=o*l-h*s,f=c*s-a*l,p=e*d+i*u+n*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/p;return t[0]=d*x,t[1]=(n*c-h*i)*x,t[2]=(o*i-n*a)*x,t[3]=u*x,t[4]=(h*e-n*l)*x,t[5]=(n*s-o*e)*x,t[6]=f*x,t[7]=(i*l-c*e)*x,t[8]=(a*e-i*s)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,n,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+t,-n*c,n*l,-n*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return Nn("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ah.makeScale(t,e)),this}rotate(t){return Nn("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ah.makeRotation(-t)),this}translate(t,e){return Nn("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ah.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<9;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Er.prototype.isMatrix3=!0,Er);const Ah=new te,uf=new te().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),df=new te().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Vx(){const r={enabled:!0,workingColorSpace:Oa,spaces:{},convert:function(n,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===ve&&(n.r=Un(n.r),n.g=Un(n.g),n.b=Un(n.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(n.applyMatrix3(this.spaces[s].toXYZ),n.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ve&&(n.r=Mr(n.r),n.g=Mr(n.g),n.b=Mr(n.b))),n},workingToColorSpace:function(n,s){return this.convert(n,this.workingColorSpace,s)},colorSpaceToWorking:function(n,s){return this.convert(n,s,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Rn?Fa:this.spaces[n].transfer},getToneMappingMode:function(n){return this.spaces[n].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(n,s=this.workingColorSpace){return n.fromArray(this.spaces[s].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,s,a){return n.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(n,s){return Nn("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(n,s)},toWorkingColorSpace:function(n,s){return Nn("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(n,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return r.define({[Oa]:{primaries:t,whitePoint:i,transfer:Fa,toXYZ:uf,fromXYZ:df,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Qe},outputColorSpaceConfig:{drawingBufferColorSpace:Qe}},[Qe]:{primaries:t,whitePoint:i,transfer:ve,toXYZ:uf,fromXYZ:df,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Qe}}}),r}const oe=Vx();function Un(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Mr(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let Ys;class Xm{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{Ys===void 0&&(Ys=Ba("canvas")),Ys.width=t.width,Ys.height=t.height;const n=Ys.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),i=Ys}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Ba("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const n=i.getImageData(0,0,t.width,t.height),s=n.data;for(let a=0;a<s.length;a++)s[a]=Un(s[a]/255)*255;return i.putImageData(n,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Un(e[i]/255)*255):e[i]=Un(e[i]);return{data:e,width:t.width,height:t.height}}else return dt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let kx=0;class In{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:kx++}),this.uuid=Di(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},n=this.data;if(n!==null){let s;if(Array.isArray(n)){s=[];for(let a=0,o=n.length;a<o;a++)n[a].isDataTexture?s.push(Ch(n[a].image)):s.push(Ch(n[a]))}else s=Ch(n);i.url=s}return e||(t.images[this.uuid]=i),i}}function Ch(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Xm.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(dt("Texture: Unable to serialize Texture."),{})}class Gx extends In{constructor(t=null){Nn('Source: "Source" has been renamed to "TextureSource". Please update your code to use "THREE.TextureSource" instead.'),super(t),this.isSource=!0}}let Hx=0;const Rh=new C;class Ie extends tn{constructor(t=Ie.DEFAULT_IMAGE,e=Ie.DEFAULT_MAPPING,i=Ei,n=Ei,s=Ce,a=un,o=_i,l=Ti,c=Ie.DEFAULT_ANISOTROPY,h=Rn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Hx++}),this.uuid=Di(),this.name="",this.source=new In(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=n,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new st(0,0),this.repeat=new st(1,1),this.center=new st(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new te,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Rh).x}get height(){return this.source.getSize(Rh).y}get depth(){return this.source.getSize(Rh).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const i=t[e];if(i===void 0){dt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const n=this[e];if(n===void 0){dt(`Texture.setValues(): property '${e}' does not exist.`);continue}n&&i&&n.isVector2&&i.isVector2||n&&i&&n.isVector3&&i.isVector3||n&&i&&n.isMatrix3&&i.isMatrix3?n.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Uc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Pr:t.x=t.x-Math.floor(t.x);break;case Ei:t.x=t.x<0?0:1;break;case Ia:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Pr:t.y=t.y-Math.floor(t.y);break;case Ei:t.y=t.y<0?0:1;break;case Ia:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ie.DEFAULT_IMAGE=null;Ie.DEFAULT_MAPPING=Uc;Ie.DEFAULT_ANISOTROPY=1;var Ar;let be=(Ar=class{constructor(t=0,e=0,i=0,n=1){this.x=t,this.y=e,this.z=i,this.w=n}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,n){return this.x=t,this.y=e,this.z=i,this.w=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*n+a[12]*s,this.y=a[1]*e+a[5]*i+a[9]*n+a[13]*s,this.z=a[2]*e+a[6]*i+a[10]*n+a[14]*s,this.w=a[3]*e+a[7]*i+a[11]*n+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,n,s;const l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],p=l[9],x=l[2],m=l[6],g=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-x)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+x)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const w=(c+1)/2,_=(f+1)/2,b=(g+1)/2,M=(h+u)/4,A=(d+x)/4,y=(p+m)/4;return w>_&&w>b?w<.01?(i=0,n=.707106781,s=.707106781):(i=Math.sqrt(w),n=M/i,s=A/i):_>b?_<.01?(i=.707106781,n=0,s=.707106781):(n=Math.sqrt(_),i=M/n,s=y/n):b<.01?(i=.707106781,n=.707106781,s=0):(s=Math.sqrt(b),i=A/s,n=y/s),this.set(i,n,s,e),this}let v=Math.sqrt((m-p)*(m-p)+(d-x)*(d-x)+(u-h)*(u-h));return Math.abs(v)<.001&&(v=1),this.x=(m-p)/v,this.y=(d-x)/v,this.z=(u-h)/v,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Jt(this.x,t.x,e.x),this.y=Jt(this.y,t.y,e.y),this.z=Jt(this.z,t.z,e.z),this.w=Jt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=Jt(this.x,t,e),this.y=Jt(this.y,t,e),this.z=Jt(this.z,t,e),this.w=Jt(this.w,t,e),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Jt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Ar.prototype.isVector4=!0,Ar);class dd extends tn{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ce,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new be(0,0,t,e),this.scissorTest=!1,this.viewport=new be(0,0,t,e),this.textures=[];const n={width:t,height:e,depth:i.depth},s=new Ie(n),a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:Ce,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let n=0,s=this.textures.length;n<s;n++)this.textures[n].image.width=t,this.textures[n].image.height=e,this.textures[n].image.depth=i,this.textures[n].isData3DTexture!==!0&&(this.textures[n].isArrayTexture=this.textures[n].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const n=Object.assign({},t.textures[e].image);this.textures[e].source=new In(n)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){const e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ai extends dd{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Xc extends Ie{constructor(t=null,e=1,i=1,n=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=Fe,this.minFilter=Fe,this.wrapR=Ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Wx extends Ai{constructor(t=1,e=1,i=1,n={}){super(t,e,n),this.isWebGLArrayRenderTarget=!0,this.depth=i,this.texture=new Xc(null,t,e,i),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}}class qc extends Ie{constructor(t=null,e=1,i=1,n=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:n},this.magFilter=Fe,this.minFilter=Fe,this.wrapR=Ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}}class Xx extends Ai{constructor(t=1,e=1,i=1,n={}){super(t,e,n),this.isWebGL3DRenderTarget=!0,this.depth=i,this.texture=new qc(null,t,e,i),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}}var Ds;let $t=(Ds=class{constructor(t,e,i,n,s,a,o,l,c,h,d,u,f,p,x,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,n,s,a,o,l,c,h,d,u,f,p,x,m)}set(t,e,i,n,s,a,o,l,c,h,d,u,f,p,x,m){const g=this.elements;return g[0]=t,g[4]=e,g[8]=i,g[12]=n,g[1]=s,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=h,g[10]=d,g[14]=u,g[3]=f,g[7]=p,g[11]=x,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ds().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,i=t.elements,n=1/Zs.setFromMatrixColumn(t,0).length(),s=1/Zs.setFromMatrixColumn(t,1).length(),a=1/Zs.setFromMatrixColumn(t,2).length();return e[0]=i[0]*n,e[1]=i[1]*n,e[2]=i[2]*n,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,n=t.y,s=t.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),h=Math.cos(s),d=Math.sin(s);if(t.order==="XYZ"){const u=a*h,f=a*d,p=o*h,x=o*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+p*c,e[5]=u-x*c,e[9]=-o*l,e[2]=x-u*c,e[6]=p+f*c,e[10]=a*l}else if(t.order==="YXZ"){const u=l*h,f=l*d,p=c*h,x=c*d;e[0]=u+x*o,e[4]=p*o-f,e[8]=a*c,e[1]=a*d,e[5]=a*h,e[9]=-o,e[2]=f*o-p,e[6]=x+u*o,e[10]=a*l}else if(t.order==="ZXY"){const u=l*h,f=l*d,p=c*h,x=c*d;e[0]=u-x*o,e[4]=-a*d,e[8]=p+f*o,e[1]=f+p*o,e[5]=a*h,e[9]=x-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const u=a*h,f=a*d,p=o*h,x=o*d;e[0]=l*h,e[4]=p*c-f,e[8]=u*c+x,e[1]=l*d,e[5]=x*c+u,e[9]=f*c-p,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const u=a*l,f=a*c,p=o*l,x=o*c;e[0]=l*h,e[4]=x-u*d,e[8]=p*d+f,e[1]=d,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=f*d+p,e[10]=u-x*d}else if(t.order==="XZY"){const u=a*l,f=a*c,p=o*l,x=o*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+x,e[5]=a*h,e[9]=f*d-p,e[2]=p*d-f,e[6]=o*h,e[10]=x*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(qx,t,Jx)}lookAt(t,e,i){const n=this.elements;return Ri.subVectors(t,e),Ri.lengthSq()===0&&(Ri.z=1),Ri.normalize(),Gn.crossVectors(i,Ri),Gn.lengthSq()===0&&(Math.abs(i.z)===1?Ri.x+=1e-4:Ri.z+=1e-4,Ri.normalize(),Gn.crossVectors(i,Ri)),Gn.normalize(),No.crossVectors(Ri,Gn),n[0]=Gn.x,n[4]=No.x,n[8]=Ri.x,n[1]=Gn.y,n[5]=No.y,n[9]=Ri.y,n[2]=Gn.z,n[6]=No.z,n[10]=Ri.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],d=i[5],u=i[9],f=i[13],p=i[2],x=i[6],m=i[10],g=i[14],v=i[3],w=i[7],_=i[11],b=i[15],M=n[0],A=n[4],y=n[8],E=n[12],P=n[1],I=n[5],U=n[9],V=n[13],N=n[2],B=n[6],Z=n[10],k=n[14],nt=n[3],J=n[7],K=n[11],Q=n[15];return s[0]=a*M+o*P+l*N+c*nt,s[4]=a*A+o*I+l*B+c*J,s[8]=a*y+o*U+l*Z+c*K,s[12]=a*E+o*V+l*k+c*Q,s[1]=h*M+d*P+u*N+f*nt,s[5]=h*A+d*I+u*B+f*J,s[9]=h*y+d*U+u*Z+f*K,s[13]=h*E+d*V+u*k+f*Q,s[2]=p*M+x*P+m*N+g*nt,s[6]=p*A+x*I+m*B+g*J,s[10]=p*y+x*U+m*Z+g*K,s[14]=p*E+x*V+m*k+g*Q,s[3]=v*M+w*P+_*N+b*nt,s[7]=v*A+w*I+_*B+b*J,s[11]=v*y+w*U+_*Z+b*K,s[15]=v*E+w*V+_*k+b*Q,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],n=t[8],s=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],p=t[3],x=t[7],m=t[11],g=t[15],v=l*f-c*u,w=o*f-c*d,_=o*u-l*d,b=a*f-c*h,M=a*u-l*h,A=a*d-o*h;return e*(x*v-m*w+g*_)-i*(p*v-m*b+g*M)+n*(p*w-x*b+g*A)-s*(p*_-x*M+m*A)}determinantAffine(){const t=this.elements,e=t[0],i=t[4],n=t[8],s=t[1],a=t[5],o=t[9],l=t[2],c=t[6],h=t[10];return e*(a*h-o*c)-i*(s*h-o*l)+n*(s*c-a*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const n=this.elements;return t.isVector3?(n[12]=t.x,n[13]=t.y,n[14]=t.z):(n[12]=t,n[13]=e,n[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],p=t[12],x=t[13],m=t[14],g=t[15],v=e*o-i*a,w=e*l-n*a,_=e*c-s*a,b=i*l-n*o,M=i*c-s*o,A=n*c-s*l,y=h*x-d*p,E=h*m-u*p,P=h*g-f*p,I=d*m-u*x,U=d*g-f*x,V=u*g-f*m,N=v*V-w*U+_*I+b*P-M*E+A*y;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/N;return t[0]=(o*V-l*U+c*I)*B,t[1]=(n*U-i*V-s*I)*B,t[2]=(x*A-m*M+g*b)*B,t[3]=(u*M-d*A-f*b)*B,t[4]=(l*P-a*V-c*E)*B,t[5]=(e*V-n*P+s*E)*B,t[6]=(m*_-p*A-g*w)*B,t[7]=(h*A-u*_+f*w)*B,t[8]=(a*U-o*P+c*y)*B,t[9]=(i*P-e*U-s*y)*B,t[10]=(p*M-x*_+g*v)*B,t[11]=(d*_-h*M-f*v)*B,t[12]=(o*E-a*I-l*y)*B,t[13]=(e*I-i*E+n*y)*B,t[14]=(x*w-p*b-m*v)*B,t[15]=(h*b-d*w+u*v)*B,this}scale(t){const e=this.elements,i=t.x,n=t.y,s=t.z;return e[0]*=i,e[4]*=n,e[8]*=s,e[1]*=i,e[5]*=n,e[9]*=s,e[2]*=i,e[6]*=n,e[10]*=s,e[3]*=i,e[7]*=n,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],n=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,n))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),n=Math.sin(e),s=1-i,a=t.x,o=t.y,l=t.z,c=s*a,h=s*o;return this.set(c*a+i,c*o-n*l,c*l+n*o,0,c*o+n*l,h*o+i,h*l-n*a,0,c*l-n*o,h*l+n*a,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,n,s,a){return this.set(1,i,s,0,t,1,a,0,e,n,1,0,0,0,0,1),this}compose(t,e,i){const n=this.elements,s=e._x,a=e._y,o=e._z,l=e._w,c=s+s,h=a+a,d=o+o,u=s*c,f=s*h,p=s*d,x=a*h,m=a*d,g=o*d,v=l*c,w=l*h,_=l*d,b=i.x,M=i.y,A=i.z;return n[0]=(1-(x+g))*b,n[1]=(f+_)*b,n[2]=(p-w)*b,n[3]=0,n[4]=(f-_)*M,n[5]=(1-(u+g))*M,n[6]=(m+v)*M,n[7]=0,n[8]=(p+w)*A,n[9]=(m-v)*A,n[10]=(1-(u+x))*A,n[11]=0,n[12]=t.x,n[13]=t.y,n[14]=t.z,n[15]=1,this}decompose(t,e,i){const n=this.elements;t.x=n[12],t.y=n[13],t.z=n[14];const s=this.determinantAffine();if(s===0)return i.set(1,1,1),e.identity(),this;let a=Zs.set(n[0],n[1],n[2]).length();const o=Zs.set(n[4],n[5],n[6]).length(),l=Zs.set(n[8],n[9],n[10]).length();s<0&&(a=-a),Wi.copy(this);const c=1/a,h=1/o,d=1/l;return Wi.elements[0]*=c,Wi.elements[1]*=c,Wi.elements[2]*=c,Wi.elements[4]*=h,Wi.elements[5]*=h,Wi.elements[6]*=h,Wi.elements[8]*=d,Wi.elements[9]*=d,Wi.elements[10]*=d,e.setFromRotationMatrix(Wi),i.x=a,i.y=o,i.z=l,this}makePerspective(t,e,i,n,s,a,o=Ui,l=!1){const c=this.elements,h=2*s/(e-t),d=2*s/(i-n),u=(e+t)/(e-t),f=(i+n)/(i-n);let p,x;if(l)p=s/(a-s),x=a*s/(a-s);else if(o===Ui)p=-(a+s)/(a-s),x=-2*a*s/(a-s);else if(o===Os)p=-a/(a-s),x=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,n,s,a,o=Ui,l=!1){const c=this.elements,h=2/(e-t),d=2/(i-n),u=-(e+t)/(e-t),f=-(i+n)/(i-n);let p,x;if(l)p=1/(a-s),x=a/(a-s);else if(o===Ui)p=-2/(a-s),x=-(a+s)/(a-s);else if(o===Os)p=-1/(a-s),x=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<16;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}},Ds.prototype.isMatrix4=!0,Ds);const Zs=new C,Wi=new $t,qx=new C(0,0,0),Jx=new C(1,1,1),Gn=new C,No=new C,Ri=new C,ff=new $t,pf=new yi;let On=class qm{constructor(t=0,e=0,i=0,n=qm.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=n}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,n=this._order){return this._x=t,this._y=e,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const n=t.elements,s=n[0],a=n[4],o=n[8],l=n[1],c=n[5],h=n[9],d=n[2],u=n[6],f=n[10];switch(e){case"XYZ":this._y=Math.asin(Jt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Jt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(Jt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Jt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Jt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-Jt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:dt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return ff.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ff,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return pf.setFromEuler(this),this.setFromQuaternion(pf,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};On.DEFAULT_ORDER="XYZ";class is{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Yx=0;const mf=new C,$s=new yi,Mn=new $t,Uo=new C,Qr=new C,Zx=new C,$x=new yi,gf=new C(1,0,0),xf=new C(0,1,0),_f=new C(0,0,1),yf={type:"added"},Kx={type:"removed"},Ks={type:"childadded",child:null},Ph={type:"childremoved",child:null};class he extends tn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Yx++}),this.uuid=Di(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=he.DEFAULT_UP.clone();const t=new C,e=new On,i=new yi,n=new C(1,1,1);function s(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:n},modelViewMatrix:{value:new $t},normalMatrix:{value:new te}}),this.matrix=new $t,this.matrixWorld=new $t,this.matrixAutoUpdate=he.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=he.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new is,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return $s.setFromAxisAngle(t,e),this.quaternion.multiply($s),this}rotateOnWorldAxis(t,e){return $s.setFromAxisAngle(t,e),this.quaternion.premultiply($s),this}rotateX(t){return this.rotateOnAxis(gf,t)}rotateY(t){return this.rotateOnAxis(xf,t)}rotateZ(t){return this.rotateOnAxis(_f,t)}translateOnAxis(t,e){return mf.copy(t).applyQuaternion(this.quaternion),this.position.add(mf.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(gf,t)}translateY(t){return this.translateOnAxis(xf,t)}translateZ(t){return this.translateOnAxis(_f,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Mn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Uo.copy(t):Uo.set(t,e,i);const n=this.parent;this.updateWorldMatrix(!0,!1),Qr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Mn.lookAt(Qr,Uo,this.up):Mn.lookAt(Uo,Qr,this.up),this.quaternion.setFromRotationMatrix(Mn),n&&(Mn.extractRotation(n.matrixWorld),$s.setFromRotationMatrix(Mn),this.quaternion.premultiply($s.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Ot("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(yf),Ks.child=t,this.dispatchEvent(Ks),Ks.child=null):Ot("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Kx),Ph.child=t,this.dispatchEvent(Ph),Ph.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Mn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Mn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Mn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(yf),Ks.child=t,this.dispatchEvent(Ks),Ks.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,n=this.children.length;i<n;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const n=this.children;for(let s=0,a=n.length;s<a;s++)n[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qr,t,Zx),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qr,$x,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,i=t.y,n=t.z,s=this.matrix.elements;s[12]+=e-s[0]*e-s[4]*i-s[8]*n,s[13]+=i-s[1]*e-s[5]*i-s[9]*n,s[14]+=n-s[2]*e-s[6]*i-s[10]*n}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,n=e.length;i<n;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e,i=!1){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),e===!0){const s=this.children;for(let a=0,o=s.length;a<o;a++)s[a].updateWorldMatrix(!1,!0,i)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const n={};n.uuid=this.uuid,n.type=this.type,n.name=this.name,n.castShadow=this.castShadow,n.receiveShadow=this.receiveShadow,n.visible=this.visible,n.frustumCulled=this.frustumCulled,n.renderOrder=this.renderOrder,n.static=this.static,n.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(n.userData=this.userData),n.layers=this.layers.mask,n.matrix=this.matrix.toArray(),n.up=this.up.toArray(),this.pivot!==null&&(n.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(n.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(n.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(n.type="InstancedMesh",n.count=this.count,n.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(n.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(n.type="BatchedMesh",n.perObjectFrustumCulled=this.perObjectFrustumCulled,n.sortObjects=this.sortObjects,n.drawRanges=this._drawRanges,n.reservedRanges=this._reservedRanges,n.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),n.instanceInfo=this._instanceInfo.map(o=>({...o})),n.availableInstanceIds=this._availableInstanceIds.slice(),n.availableGeometryIds=this._availableGeometryIds.slice(),n.nextIndexStart=this._nextIndexStart,n.nextVertexStart=this._nextVertexStart,n.geometryCount=this._geometryCount,n.maxInstanceCount=this._maxInstanceCount,n.maxVertexCount=this._maxVertexCount,n.maxIndexCount=this._maxIndexCount,n.geometryInitialized=this._geometryInitialized,n.matricesTexture=this._matricesTexture.toJSON(t),n.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(n.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(n.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(n.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?n.background=this.background.toJSON():this.background.isTexture&&(n.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(n.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){n.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];s(t.shapes,d)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(n.bindMode=this.bindMode,n.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),n.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(t.materials,this.material[l]));n.material=o}else n.material=s(t.materials,this.material);if(this.children.length>0){n.children=[];for(let o=0;o<this.children.length;o++)n.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){n.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];n.animations.push(s(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),d=a(t.shapes),u=a(t.skeletons),f=a(t.animations),p=a(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),u.length>0&&(i.skeletons=u),f.length>0&&(i.animations=f),p.length>0&&(i.nodes=p)}return i.object=n,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const n=t.children[i];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}he.DEFAULT_UP=new C(0,1,0);he.DEFAULT_MATRIX_AUTO_UPDATE=!0;he.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Ln extends he{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Qx={type:"move"};class Ll{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ln,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ln,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ln,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let n=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const x of t.hand.values()){const m=e.getJointPose(x,i),g=this._getHandJoint(c,x);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,p=.005;c.inputState.pinching&&u>f+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(n=e.getPose(t.targetRaySpace,i),n===null&&s!==null&&(n=s),n!==null&&(o.matrix.fromArray(n.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,n.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(n.linearVelocity)):o.hasLinearVelocity=!1,n.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(n.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Qx)))}return o!==null&&(o.visible=n!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new Ln;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const Jm={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Hn={h:0,s:0,l:0},Do={h:0,s:0,l:0};function Ih(r,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?r+(t-r)*6*e:e<1/2?t:e<2/3?r+(t-r)*6*(2/3-e):r}class bt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const n=t;n&&n.isColor?this.copy(n):typeof n=="number"?this.setHex(n):typeof n=="string"&&this.setStyle(n)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Qe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,oe.colorSpaceToWorking(this,e),this}setRGB(t,e,i,n=oe.workingColorSpace){return this.r=t,this.g=e,this.b=i,oe.colorSpaceToWorking(this,n),this}setHSL(t,e,i,n=oe.workingColorSpace){if(t=ud(t,1),e=Jt(e,0,1),i=Jt(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,a=2*i-s;this.r=Ih(a,s,t+1/3),this.g=Ih(a,s,t),this.b=Ih(a,s,t-1/3)}return oe.colorSpaceToWorking(this,n),this}setStyle(t,e=Qe){function i(s){s!==void 0&&parseFloat(s)<1&&dt("Color: Alpha component of "+t+" will be ignored.")}let n;if(n=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=n[1],o=n[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:dt("Color: Unknown color model "+t)}}else if(n=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=n[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);dt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Qe){const i=Jm[t.toLowerCase()];return i!==void 0?this.setHex(i,e):dt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Un(t.r),this.g=Un(t.g),this.b=Un(t.b),this}copyLinearToSRGB(t){return this.r=Mr(t.r),this.g=Mr(t.g),this.b=Mr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Qe){return oe.workingToColorSpace(si.copy(this),t),Math.round(Jt(si.r*255,0,255))*65536+Math.round(Jt(si.g*255,0,255))*256+Math.round(Jt(si.b*255,0,255))}getHexString(t=Qe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=oe.workingColorSpace){oe.workingToColorSpace(si.copy(this),e);const i=si.r,n=si.g,s=si.b,a=Math.max(i,n,s),o=Math.min(i,n,s);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case i:l=(n-s)/d+(n<s?6:0);break;case n:l=(s-i)/d+2;break;case s:l=(i-n)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=oe.workingColorSpace){return oe.workingToColorSpace(si.copy(this),e),t.r=si.r,t.g=si.g,t.b=si.b,t}getStyle(t=Qe){oe.workingToColorSpace(si.copy(this),t);const e=si.r,i=si.g,n=si.b;return t!==Qe?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${n.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(n*255)})`}offsetHSL(t,e,i){return this.getHSL(Hn),this.setHSL(Hn.h+t,Hn.s+e,Hn.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(Hn),t.getHSL(Do);const i=Ea(Hn.h,Do.h,e),n=Ea(Hn.s,Do.s,e),s=Ea(Hn.l,Do.l,e);return this.setHSL(i,n,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,n=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*n,this.g=s[1]*e+s[4]*i+s[7]*n,this.b=s[2]*e+s[5]*i+s[8]*n,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const si=new bt;bt.NAMES=Jm;class Jc{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new bt(t),this.density=e}clone(){return new Jc(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class bo{constructor(t,e=1,i=1e3){this.isFog=!0,this.name="",this.color=new bt(t),this.near=e,this.far=i}clone(){return new bo(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class fd extends he{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new On,this.environmentIntensity=1,this.environmentRotation=new On,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}}const Xi=new C,bn=new C,Lh=new C,wn=new C,Qs=new C,js=new C,vf=new C,Nh=new C,Uh=new C,Dh=new C,Oh=new be,Fh=new be,Bh=new be;class gi{constructor(t=new C,e=new C,i=new C){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,n){n.subVectors(i,e),Xi.subVectors(t,e),n.cross(Xi);const s=n.lengthSq();return s>0?n.multiplyScalar(1/Math.sqrt(s)):n.set(0,0,0)}static getBarycoord(t,e,i,n,s){Xi.subVectors(n,e),bn.subVectors(i,e),Lh.subVectors(t,e);const a=Xi.dot(Xi),o=Xi.dot(bn),l=Xi.dot(Lh),c=bn.dot(bn),h=bn.dot(Lh),d=a*c-o*o;if(d===0)return s.set(0,0,0),null;const u=1/d,f=(c*l-o*h)*u,p=(a*h-o*l)*u;return s.set(1-f-p,p,f)}static containsPoint(t,e,i,n){return this.getBarycoord(t,e,i,n,wn)===null?!1:wn.x>=0&&wn.y>=0&&wn.x+wn.y<=1}static getInterpolation(t,e,i,n,s,a,o,l){return this.getBarycoord(t,e,i,n,wn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,wn.x),l.addScaledVector(a,wn.y),l.addScaledVector(o,wn.z),l)}static getInterpolatedAttribute(t,e,i,n,s,a){return Oh.setScalar(0),Fh.setScalar(0),Bh.setScalar(0),Oh.fromBufferAttribute(t,e),Fh.fromBufferAttribute(t,i),Bh.fromBufferAttribute(t,n),a.setScalar(0),a.addScaledVector(Oh,s.x),a.addScaledVector(Fh,s.y),a.addScaledVector(Bh,s.z),a}static isFrontFacing(t,e,i,n){return Xi.subVectors(i,e),bn.subVectors(t,e),Xi.cross(bn).dot(n)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,n){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[n]),this}setFromAttributeAndIndices(t,e,i,n){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Xi.subVectors(this.c,this.b),bn.subVectors(this.a,this.b),Xi.cross(bn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return gi.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return gi.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,n,s){return gi.getInterpolation(t,this.a,this.b,this.c,e,i,n,s)}containsPoint(t){return gi.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return gi.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,n=this.b,s=this.c;let a,o;Qs.subVectors(n,i),js.subVectors(s,i),Nh.subVectors(t,i);const l=Qs.dot(Nh),c=js.dot(Nh);if(l<=0&&c<=0)return e.copy(i);Uh.subVectors(t,n);const h=Qs.dot(Uh),d=js.dot(Uh);if(h>=0&&d<=h)return e.copy(n);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(i).addScaledVector(Qs,a);Dh.subVectors(t,s);const f=Qs.dot(Dh),p=js.dot(Dh);if(p>=0&&f<=p)return e.copy(s);const x=f*c-l*p;if(x<=0&&c>=0&&p<=0)return o=c/(c-p),e.copy(i).addScaledVector(js,o);const m=h*p-f*d;if(m<=0&&d-h>=0&&f-p>=0)return vf.subVectors(s,n),o=(d-h)/(d-h+(f-p)),e.copy(n).addScaledVector(vf,o);const g=1/(m+x+u);return a=x*g,o=u*g,e.copy(i).addScaledVector(Qs,a).addScaledVector(js,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class je{constructor(t=new C(1/0,1/0,1/0),e=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(qi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(qi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=qi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,qi):qi.fromBufferAttribute(s,a),qi.applyMatrix4(t.matrixWorld),this.expandByPoint(qi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Oo.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Oo.copy(i.boundingBox)),Oo.applyMatrix4(t.matrixWorld),this.union(Oo)}const n=t.children;for(let s=0,a=n.length;s<a;s++)this.expandByObject(n[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,qi),qi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(jr),Fo.subVectors(this.max,jr),tr.subVectors(t.a,jr),er.subVectors(t.b,jr),ir.subVectors(t.c,jr),Wn.subVectors(er,tr),Xn.subVectors(ir,er),gs.subVectors(tr,ir);let e=[0,-Wn.z,Wn.y,0,-Xn.z,Xn.y,0,-gs.z,gs.y,Wn.z,0,-Wn.x,Xn.z,0,-Xn.x,gs.z,0,-gs.x,-Wn.y,Wn.x,0,-Xn.y,Xn.x,0,-gs.y,gs.x,0];return!zh(e,tr,er,ir,Fo)||(e=[1,0,0,0,1,0,0,0,1],!zh(e,tr,er,ir,Fo))?!1:(Bo.crossVectors(Wn,Xn),e=[Bo.x,Bo.y,Bo.z],zh(e,tr,er,ir,Fo))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,qi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(qi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Tn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Tn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Tn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Tn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Tn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Tn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Tn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Tn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Tn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Tn=[new C,new C,new C,new C,new C,new C,new C,new C],qi=new C,Oo=new je,tr=new C,er=new C,ir=new C,Wn=new C,Xn=new C,gs=new C,jr=new C,Fo=new C,Bo=new C,xs=new C;function zh(r,t,e,i,n){for(let s=0,a=r.length-3;s<=a;s+=3){xs.fromArray(r,s);const o=n.x*Math.abs(xs.x)+n.y*Math.abs(xs.y)+n.z*Math.abs(xs.z),l=t.dot(xs),c=e.dot(xs),h=i.dot(xs);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Pn=jx();function jx(){const r=new ArrayBuffer(4),t=new Float32Array(r),e=new Uint32Array(r),i=new Uint32Array(512),n=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(i[l]=0,i[l|256]=32768,n[l]=24,n[l|256]=24):c<-14?(i[l]=1024>>-c-14,i[l|256]=1024>>-c-14|32768,n[l]=-c-1,n[l|256]=-c-1):c<=15?(i[l]=c+15<<10,i[l|256]=c+15<<10|32768,n[l]=13,n[l|256]=13):c<128?(i[l]=31744,i[l|256]=64512,n[l]=24,n[l|256]=24):(i[l]=31744,i[l|256]=64512,n[l]=13,n[l|256]=13)}const s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,s[l]=c|h}for(let l=1024;l<2048;++l)s[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:t,uint32View:e,baseTable:i,shiftTable:n,mantissaTable:s,exponentTable:a,offsetTable:o}}function Mi(r){Math.abs(r)>65504&&dt("DataUtils.toHalfFloat(): Value out of range."),r=Jt(r,-65504,65504),Pn.floatView[0]=r;const t=Pn.uint32View[0],e=t>>23&511;return Pn.baseTable[e]+((t&8388607)>>Pn.shiftTable[e])}function pa(r){const t=r>>10;return Pn.uint32View[0]=Pn.mantissaTable[Pn.offsetTable[t]+(r&1023)]+Pn.exponentTable[t],Pn.floatView[0]}class t_{static toHalfFloat(t){return Mi(t)}static fromHalfFloat(t){return pa(t)}}const ze=new C,zo=new st;let e_=0;class ue extends tn{constructor(t,e,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:e_++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Wc,this.updateRanges=[],this.gpuType=xi,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let n=0,s=this.itemSize;n<s;n++)this.array[t+n]=e.array[i+n];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)zo.fromBufferAttribute(this,e),zo.applyMatrix3(t),this.setXY(e,zo.x,zo.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)ze.fromBufferAttribute(this,e),ze.applyMatrix3(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)ze.fromBufferAttribute(this,e),ze.applyMatrix4(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)ze.fromBufferAttribute(this,e),ze.applyNormalMatrix(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)ze.fromBufferAttribute(this,e),ze.transformDirection(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=mi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ne(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=mi(e,this.array)),e}setX(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=mi(e,this.array)),e}setY(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=mi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=mi(e,this.array)),e}setW(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=ne(e,this.array),i=ne(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,n){return t*=this.itemSize,this.normalized&&(e=ne(e,this.array),i=ne(i,this.array),n=ne(n,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this}setXYZW(t,e,i,n,s){return t*=this.itemSize,this.normalized&&(e=ne(e,this.array),i=ne(i,this.array),n=ne(n,this.array),s=ne(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=n,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}}class i_ extends ue{constructor(t,e,i){super(new Int8Array(t),e,i)}}class n_ extends ue{constructor(t,e,i){super(new Uint8Array(t),e,i)}}class s_ extends ue{constructor(t,e,i){super(new Uint8ClampedArray(t),e,i)}}class r_ extends ue{constructor(t,e,i){super(new Int16Array(t),e,i)}}class pd extends ue{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class a_ extends ue{constructor(t,e,i){super(new Int32Array(t),e,i)}}class md extends ue{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class o_ extends ue{constructor(t,e,i){super(new Uint16Array(t),e,i),this.isFloat16BufferAttribute=!0}getX(t){let e=pa(this.array[t*this.itemSize]);return this.normalized&&(e=mi(e,this.array)),e}setX(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize]=Mi(e),this}getY(t){let e=pa(this.array[t*this.itemSize+1]);return this.normalized&&(e=mi(e,this.array)),e}setY(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize+1]=Mi(e),this}getZ(t){let e=pa(this.array[t*this.itemSize+2]);return this.normalized&&(e=mi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize+2]=Mi(e),this}getW(t){let e=pa(this.array[t*this.itemSize+3]);return this.normalized&&(e=mi(e,this.array)),e}setW(t,e){return this.normalized&&(e=ne(e,this.array)),this.array[t*this.itemSize+3]=Mi(e),this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=ne(e,this.array),i=ne(i,this.array)),this.array[t+0]=Mi(e),this.array[t+1]=Mi(i),this}setXYZ(t,e,i,n){return t*=this.itemSize,this.normalized&&(e=ne(e,this.array),i=ne(i,this.array),n=ne(n,this.array)),this.array[t+0]=Mi(e),this.array[t+1]=Mi(i),this.array[t+2]=Mi(n),this}setXYZW(t,e,i,n,s){return t*=this.itemSize,this.normalized&&(e=ne(e,this.array),i=ne(i,this.array),n=ne(n,this.array),s=ne(s,this.array)),this.array[t+0]=Mi(e),this.array[t+1]=Mi(i),this.array[t+2]=Mi(n),this.array[t+3]=Mi(s),this}}class Rt extends ue{constructor(t,e,i){super(new Float32Array(t),e,i)}}const l_=new je,ta=new C,Vh=new C;class ti{constructor(t=new C,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):l_.setFromPoints(t).getCenter(i);let n=0;for(let s=0,a=t.length;s<a;s++)n=Math.max(n,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(n),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ta.subVectors(t,this.center);const e=ta.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),n=(i-this.radius)*.5;this.center.addScaledVector(ta,n/i),this.radius+=n}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Vh.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ta.copy(t.center).add(Vh)),this.expandByPoint(ta.copy(t.center).sub(Vh))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let c_=0;const Bi=new $t,kh=new he,nr=new C,Pi=new je,ea=new je,qe=new C;class Zt extends tn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:c_++}),this.uuid=Di(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(xx(t)?md:pd)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new te().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const n=this.attributes.tangent;return n!==void 0&&(n.transformDirection(t),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Bi.makeRotationFromQuaternion(t),this.applyMatrix4(Bi),this}rotateX(t){return Bi.makeRotationX(t),this.applyMatrix4(Bi),this}rotateY(t){return Bi.makeRotationY(t),this.applyMatrix4(Bi),this}rotateZ(t){return Bi.makeRotationZ(t),this.applyMatrix4(Bi),this}translate(t,e,i){return Bi.makeTranslation(t,e,i),this.applyMatrix4(Bi),this}scale(t,e,i){return Bi.makeScale(t,e,i),this.applyMatrix4(Bi),this}lookAt(t){return kh.lookAt(t),kh.updateMatrix(),this.applyMatrix4(kh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(nr).negate(),this.translate(nr.x,nr.y,nr.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const i=[];for(let n=0,s=t.length;n<s;n++){const a=t[n];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Rt(i,3))}else{const i=Math.min(t.length,e.count);for(let n=0;n<i;n++){const s=t[n];e.setXYZ(n,s.x,s.y,s.z||0)}t.length>e.count&&dt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new je);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ot("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,n=e.length;i<n;i++){const s=e[i];Pi.setFromBufferAttribute(s),this.morphTargetsRelative?(qe.addVectors(this.boundingBox.min,Pi.min),this.boundingBox.expandByPoint(qe),qe.addVectors(this.boundingBox.max,Pi.max),this.boundingBox.expandByPoint(qe)):(this.boundingBox.expandByPoint(Pi.min),this.boundingBox.expandByPoint(Pi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ot('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ti);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Ot("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(t){const i=this.boundingSphere.center;if(Pi.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const o=e[s];ea.setFromBufferAttribute(o),this.morphTargetsRelative?(qe.addVectors(Pi.min,ea.min),Pi.expandByPoint(qe),qe.addVectors(Pi.max,ea.max),Pi.expandByPoint(qe)):(Pi.expandByPoint(ea.min),Pi.expandByPoint(ea.max))}Pi.getCenter(i);let n=0;for(let s=0,a=t.count;s<a;s++)qe.fromBufferAttribute(t,s),n=Math.max(n,i.distanceToSquared(qe));if(e)for(let s=0,a=e.length;s<a;s++){const o=e[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)qe.fromBufferAttribute(o,c),l&&(nr.fromBufferAttribute(t,c),qe.add(nr)),n=Math.max(n,i.distanceToSquared(qe))}this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&Ot('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Ot("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,n=e.normal,s=e.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==i.count)&&(a=new ue(new Float32Array(4*i.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let y=0;y<i.count;y++)o[y]=new C,l[y]=new C;const c=new C,h=new C,d=new C,u=new st,f=new st,p=new st,x=new C,m=new C;function g(y,E,P){c.fromBufferAttribute(i,y),h.fromBufferAttribute(i,E),d.fromBufferAttribute(i,P),u.fromBufferAttribute(s,y),f.fromBufferAttribute(s,E),p.fromBufferAttribute(s,P),h.sub(c),d.sub(c),f.sub(u),p.sub(u);const I=1/(f.x*p.y-p.x*f.y);isFinite(I)&&(x.copy(h).multiplyScalar(p.y).addScaledVector(d,-f.y).multiplyScalar(I),m.copy(d).multiplyScalar(f.x).addScaledVector(h,-p.x).multiplyScalar(I),o[y].add(x),o[E].add(x),o[P].add(x),l[y].add(m),l[E].add(m),l[P].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:t.count}]);for(let y=0,E=v.length;y<E;++y){const P=v[y],I=P.start,U=P.count;for(let V=I,N=I+U;V<N;V+=3)g(t.getX(V+0),t.getX(V+1),t.getX(V+2))}const w=new C,_=new C,b=new C,M=new C;function A(y){b.fromBufferAttribute(n,y),M.copy(b);const E=o[y];w.copy(E),w.sub(b.multiplyScalar(b.dot(E))).normalize(),_.crossVectors(M,E);const I=_.dot(l[y])<0?-1:1;a.setXYZW(y,w.x,w.y,w.z,I)}for(let y=0,E=v.length;y<E;++y){const P=v[y],I=P.start,U=P.count;for(let V=I,N=I+U;V<N;V+=3)A(t.getX(V+0)),A(t.getX(V+1)),A(t.getX(V+2))}this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==e.count)i=new ue(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let u=0,f=i.count;u<f;u++)i.setXYZ(u,0,0,0);const n=new C,s=new C,a=new C,o=new C,l=new C,c=new C,h=new C,d=new C;if(t)for(let u=0,f=t.count;u<f;u+=3){const p=t.getX(u+0),x=t.getX(u+1),m=t.getX(u+2);n.fromBufferAttribute(e,p),s.fromBufferAttribute(e,x),a.fromBufferAttribute(e,m),h.subVectors(a,s),d.subVectors(n,s),h.cross(d),o.fromBufferAttribute(i,p),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,m),o.add(h),l.add(h),c.add(h),i.setXYZ(p,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)n.fromBufferAttribute(e,u+0),s.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,s),d.subVectors(n,s),h.cross(d),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)qe.fromBufferAttribute(t,e),qe.normalize(),t.setXYZ(e,qe.x,qe.y,qe.z)}toNonIndexed(){function t(o,l){const c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h);let f=0,p=0;for(let x=0,m=l.length;x<m;x++){o.isInterleavedBufferAttribute?f=l[x]*o.data.stride+o.offset:f=l[x]*h;for(let g=0;g<h;g++)u[p++]=c[f++]}return new ue(u,h,d)}if(this.index===null)return dt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Zt,i=this.index.array,n=this.attributes;for(const o in n){const l=n[o],c=t(l,i);e.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let h=0,d=c.length;h<d;h++){const u=c[h],f=t(u,i);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const n={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(n[l]=h,s=!0)}s&&(t.data.morphAttributes=n,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone());const n=t.attributes;for(const c in n){const h=n[c];this.setAttribute(c,h.clone(e))}const s=t.morphAttributes;for(const c in s){const h=[],d=s[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,h=a.length;c<h;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Yc{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Wc,this.updateRanges=[],this.version=0,this.uuid=Di()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,i){t*=this.stride,i*=e.stride;for(let n=0,s=this.stride;n<s;n++)this.array[t+n]=e.array[i+n];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Di()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(e,this.stride);return i.setUsage(this.usage),i}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Di()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));const e={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return e.usage=this.usage,e}}const fi=new C;class Fs{constructor(t,e,i,n=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=i,this.normalized=n}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,i=this.data.count;e<i;e++)fi.fromBufferAttribute(this,e),fi.applyMatrix4(t),this.setXYZ(e,fi.x,fi.y,fi.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)fi.fromBufferAttribute(this,e),fi.applyNormalMatrix(t),this.setXYZ(e,fi.x,fi.y,fi.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)fi.fromBufferAttribute(this,e),fi.transformDirection(t),this.setXYZ(e,fi.x,fi.y,fi.z);return this}getComponent(t,e){let i=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(i=mi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=ne(i,this.array)),this.data.array[t*this.data.stride+this.offset+e]=i,this}setX(t,e){return this.normalized&&(e=ne(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=ne(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=ne(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=ne(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=mi(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=mi(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=mi(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=mi(e,this.array)),e}setXY(t,e,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=ne(e,this.array),i=ne(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this}setXYZ(t,e,i,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=ne(e,this.array),i=ne(i,this.array),n=ne(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=n,this}setXYZW(t,e,i,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=ne(e,this.array),i=ne(i,this.array),n=ne(n,this.array),s=ne(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=i,this.data.array[t+2]=n,this.data.array[t+3]=s,this}clone(t){if(t===void 0){za("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[n+s])}return new ue(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Fs(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){za("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let i=0;i<this.count;i++){const n=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[n+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const Gh=new C,h_=new C,u_=new te;class Cn{constructor(t=new C(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,n){return this.normal.set(t,e,i),this.constant=n,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const n=Gh.subVectors(i,e).cross(h_.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(n,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,i=!0){const n=t.delta(Gh),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/s;return i===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(n,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||u_.getNormalMatrix(t),n=this.coplanarPoint(Gh).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-n.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}}let d_=0;class ei extends tn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:d_++}),this.uuid=Di(),this.name="",this.type="Material",this.blending=es,this.side=ss,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Zu,this.blendDst=$u,this.blendEquation=Rs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new bt(0,0,0),this.blendAlpha=0,this.depthFunc=Rr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Dm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Il,this.stencilZFail=Il,this.stencilZPass=Il,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){dt(`Material: parameter '${e}' has value of undefined.`);continue}const n=this[e];if(n===void 0){dt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}n&&n.isColor?n.set(i):n&&n.isVector2&&i&&i.isVector2||n&&n.isEuler&&i&&i.isEuler||n&&n.isVector3&&i&&i.isVector3?n.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function n(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(e){const s=n(t.textures),a=n(t.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new bt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(i=>new Cn().fromJSON(i))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new st().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new st().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const n=e.length;i=new Array(n);for(let s=0;s!==n;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Zc extends ei{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new bt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let sr;const ia=new C,rr=new C,ar=new C,or=new st,na=new st,Ym=new $t,Vo=new C,sa=new C,ko=new C,Sf=new st,Hh=new st,Mf=new st;class gd extends he{constructor(t=new Zc){if(super(),this.isSprite=!0,this.type="Sprite",sr===void 0){sr=new Zt;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Yc(e,5);sr.setIndex([0,1,2,0,2,3]),sr.setAttribute("position",new Fs(i,3,0,!1)),sr.setAttribute("uv",new Fs(i,2,3,!1))}this.geometry=sr,this.material=t,this.center=new st(.5,.5),this.count=1}intersectsFrustum(t){return t.intersectsSprite(this)}raycast(t,e){t.camera===null&&Ot('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),rr.setFromMatrixScale(this.matrixWorld),Ym.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),ar.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&rr.multiplyScalar(-ar.z);const i=this.material.rotation;let n,s;i!==0&&(s=Math.cos(i),n=Math.sin(i));const a=this.center;Go(Vo.set(-.5,-.5,0),ar,a,rr,n,s),Go(sa.set(.5,-.5,0),ar,a,rr,n,s),Go(ko.set(.5,.5,0),ar,a,rr,n,s),Sf.set(0,0),Hh.set(1,0),Mf.set(1,1);let o=t.ray.intersectTriangle(Vo,sa,ko,!1,ia);if(o===null&&(Go(sa.set(-.5,.5,0),ar,a,rr,n,s),Hh.set(0,1),o=t.ray.intersectTriangle(Vo,ko,sa,!1,ia),o===null))return;const l=t.ray.origin.distanceTo(ia);l<t.near||l>t.far||e.push({distance:l,point:ia.clone(),uv:gi.getInterpolation(ia,Vo,sa,ko,Sf,Hh,Mf,new st),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Go(r,t,e,i,n,s){or.subVectors(r,e).addScalar(.5).multiply(i),n!==void 0?(na.x=s*or.x-n*or.y,na.y=n*or.x+s*or.y):na.copy(or),r.copy(t),r.x+=na.x,r.y+=na.y,r.applyMatrix4(Ym)}const Ho=new C,bf=new C;class Zm extends he{constructor(){super(),this.isLOD=!0,this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]}}),this.autoUpdate=!0}copy(t){super.copy(t,!1);const e=t.levels;for(let i=0,n=e.length;i<n;i++){const s=e[i];this.addLevel(s.object.clone(),s.distance,s.hysteresis)}return this.autoUpdate=t.autoUpdate,this}addLevel(t,e=0,i=0){e=Math.abs(e);const n=this.levels;let s;for(s=0;s<n.length&&!(e<n[s].distance);s++);return n.splice(s,0,{distance:e,hysteresis:i,object:t}),this.add(t),this}removeLevel(t){const e=this.levels;for(let i=0;i<e.length;i++)if(e[i].distance===t){const n=e.splice(i,1);return this.remove(n[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(t){const e=this.levels;if(e.length>0){let i,n;for(i=1,n=e.length;i<n;i++){let s=e[i].distance;if(e[i].object.visible&&(s-=s*e[i].hysteresis),t<s)break}return e[i-1].object}return null}raycast(t,e){if(this.levels.length>0){Ho.setFromMatrixPosition(this.matrixWorld);const n=t.ray.origin.distanceTo(Ho);this.getObjectForDistance(n).raycast(t,e)}}update(t){const e=this.levels;if(e.length>1){Ho.setFromMatrixPosition(t.matrixWorld),bf.setFromMatrixPosition(this.matrixWorld);const i=Ho.distanceTo(bf)/t.zoom;e[0].object.visible=!0;let n,s;for(n=1,s=e.length;n<s;n++){let a=e[n].distance;if(e[n].object.visible&&(a-=a*e[n].hysteresis),i>=a)e[n-1].object.visible=!1,e[n].object.visible=!0;else break}for(this._currentLevel=n-1;n<s;n++)e[n].object.visible=!1}}toJSON(t){const e=super.toJSON(t);e.object.autoUpdate=this.autoUpdate,e.object.levels=[];const i=this.levels;for(let n=0,s=i.length;n<s;n++){const a=i[n];e.object.levels.push({object:a.object.uuid,distance:a.distance,hysteresis:a.hysteresis})}return e}}const En=new C,Wh=new C,Wo=new C,Xo=new C;class qr{constructor(t=new C,e=new C(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,En)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=En.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(En.copy(this.origin).addScaledVector(this.direction,e),En.distanceToSquared(t))}distanceSqToSegment(t,e,i,n){Wh.copy(t).add(e).multiplyScalar(.5),Wo.copy(e).sub(t).normalize(),Xo.copy(this.origin).sub(Wh);const s=t.distanceTo(e)*.5,a=-this.direction.dot(Wo),o=Xo.dot(this.direction),l=-Xo.dot(Wo),c=Xo.lengthSq(),h=Math.abs(1-a*a);let d,u,f,p;if(h>0)if(d=a*l-o,u=a*o-l,p=s*h,d>=0)if(u>=-p)if(u<=p){const x=1/h;d*=x,u*=x,f=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=s,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u=-s,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;else u<=-p?(d=Math.max(0,-(-a*s+o)),u=d>0?-s:Math.min(Math.max(-s,-l),s),f=-d*d+u*(u+2*l)+c):u<=p?(d=0,u=Math.min(Math.max(-s,-l),s),f=u*(u+2*l)+c):(d=Math.max(0,-(a*s+o)),u=d>0?s:Math.min(Math.max(-s,-l),s),f=-d*d+u*(u+2*l)+c);else u=a>0?-s:s,d=Math.max(0,-(a*u+o)),f=-d*d+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),n&&n.copy(Wh).addScaledVector(Wo,u),f}intersectSphere(t,e){if(t.radius<0)return null;En.subVectors(t.center,this.origin);const i=En.dot(this.direction),n=En.dot(En)-i*i,s=t.radius*t.radius;if(n>s)return null;const a=Math.sqrt(s-n),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,n,s,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(i=(t.min.x-u.x)*c,n=(t.max.x-u.x)*c):(i=(t.max.x-u.x)*c,n=(t.min.x-u.x)*c),h>=0?(s=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(s=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),i>a||s>n||((s>i||isNaN(i))&&(i=s),(a<n||isNaN(n))&&(n=a),d>=0?(o=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(o=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),i>l||o>n)||((o>i||i!==i)&&(i=o),(l<n||n!==n)&&(n=l),n<0)?null:this.at(i>=0?i:n,e)}intersectsBox(t){return this.intersectBox(t,En)!==null}intersectTriangle(t,e,i,n,s){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,d=t.x-a.x,u=t.y-a.y,f=t.z-a.z,p=e.x-a.x,x=e.y-a.y,m=e.z-a.z,g=i.x-a.x,v=i.y-a.y,w=i.z-a.z,_=Math.abs(l),b=Math.abs(c),M=Math.abs(h);let A,y,E,P,I,U,V,N,B,Z,k,nt;if(_>=b&&_>=M?(E=l,U=d,B=p,nt=g,l>=0?(A=c,y=h,P=u,I=f,V=x,N=m,Z=v,k=w):(A=h,y=c,P=f,I=u,V=m,N=x,Z=w,k=v)):b>=M?(E=c,U=u,B=x,nt=v,c>=0?(A=h,y=l,P=f,I=d,V=m,N=p,Z=w,k=g):(A=l,y=h,P=d,I=f,V=p,N=m,Z=g,k=w)):(E=h,U=f,B=m,nt=w,h>=0?(A=l,y=c,P=d,I=u,V=p,N=x,Z=g,k=v):(A=c,y=l,P=u,I=d,V=x,N=p,Z=v,k=g)),E===0)return null;const J=A/E,K=y/E,Q=1/E,At=P-J*U,St=I-K*U,se=V-J*B,Yt=N-K*B,Qt=Z-J*nt,q=k-K*nt,tt=Qt*Yt-q*se,ft=At*q-St*Qt,Ht=se*St-Yt*At;if(n){if(tt<0||ft<0||Ht<0)return null}else if((tt<0||ft<0||Ht<0)&&(tt>0||ft>0||Ht>0))return null;const wt=tt+ft+Ht;if(wt===0)return null;const Wt=Q*(tt*U+ft*B+Ht*nt);return(wt>0?Wt<0:Wt>0)?null:this.at(Wt/wt,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class He extends ei{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new On,this.combine=So,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const wf=new $t,_s=new qr,qo=new ti,Tf=new C,Jo=new C,Yo=new C,Zo=new C,Xh=new C,$o=new C,Ef=new C,Ko=new C;class Kt extends he{constructor(t=new Zt,e=new He){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=n.length;s<a;s++){const o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){const i=this.geometry,n=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(n,t);const o=this.morphTargetInfluences;if(s&&o){$o.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=o[l],d=s[l];h!==0&&(Xh.fromBufferAttribute(d,t),a?$o.addScaledVector(Xh,h):$o.addScaledVector(Xh.sub(e),h))}e.add($o)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const i=this.geometry,n=this.material,s=this.matrixWorld;n!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),qo.copy(i.boundingSphere),qo.applyMatrix4(s),_s.copy(t.ray).recast(t.near),!(qo.containsPoint(_s.origin)===!1&&(_s.intersectSphere(qo,Tf)===null||_s.origin.distanceToSquared(Tf)>(t.far-t.near)**2))&&(wf.copy(s).invert(),_s.copy(t.ray).applyMatrix4(wf),!(i.boundingBox!==null&&_s.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,_s)))}_computeIntersections(t,e,i){let n;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,u=s.groups,f=s.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,x=u.length;p<x;p++){const m=u[p],g=a[m.materialIndex],v=Math.max(m.start,f.start),w=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let _=v,b=w;_<b;_+=3){const M=o.getX(_),A=o.getX(_+1),y=o.getX(_+2);n=Qo(this,g,t,i,c,h,d,M,A,y),n&&(n.faceIndex=Math.floor(_/3),n.face.materialIndex=m.materialIndex,e.push(n))}}else{const p=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let m=p,g=x;m<g;m+=3){const v=o.getX(m),w=o.getX(m+1),_=o.getX(m+2);n=Qo(this,a,t,i,c,h,d,v,w,_),n&&(n.faceIndex=Math.floor(m/3),e.push(n))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,x=u.length;p<x;p++){const m=u[p],g=a[m.materialIndex],v=Math.max(m.start,f.start),w=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let _=v,b=w;_<b;_+=3){const M=_,A=_+1,y=_+2;n=Qo(this,g,t,i,c,h,d,M,A,y),n&&(n.faceIndex=Math.floor(_/3),n.face.materialIndex=m.materialIndex,e.push(n))}}else{const p=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let m=p,g=x;m<g;m+=3){const v=m,w=m+1,_=m+2;n=Qo(this,a,t,i,c,h,d,v,w,_),n&&(n.faceIndex=Math.floor(m/3),e.push(n))}}}}function f_(r,t,e,i,n,s,a,o){let l;if(t.side===ci?l=i.intersectTriangle(a,s,n,!0,o):l=i.intersectTriangle(n,s,a,t.side===ss,o),l===null)return null;Ko.copy(o),Ko.applyMatrix4(r.matrixWorld);const c=e.ray.origin.distanceTo(Ko);return c<e.near||c>e.far?null:{distance:c,point:Ko.clone(),object:r}}function Qo(r,t,e,i,n,s,a,o,l,c){r.getVertexPosition(o,Jo),r.getVertexPosition(l,Yo),r.getVertexPosition(c,Zo);const h=f_(r,t,e,i,Jo,Yo,Zo,Ef);if(h){const d=new C;gi.getBarycoord(Ef,Jo,Yo,Zo,d),n&&(h.uv=gi.getInterpolatedAttribute(n,o,l,c,d,new st)),s&&(h.uv1=gi.getInterpolatedAttribute(s,o,l,c,d,new st)),a&&(h.normal=gi.getInterpolatedAttribute(a,o,l,c,d,new C),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new C,materialIndex:0};gi.getNormal(Jo,Yo,Zo,u.normal),h.face=u,h.barycoord=d}return h}const ra=new be,Af=new be,Cf=new be,p_=new be,Rf=new $t,jo=new C,qh=new ti,Pf=new $t,Jh=new qr;class $m extends Kt{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Ru,this.bindMatrix=new $t,this.bindMatrixInverse=new $t,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const t=this.geometry;this.boundingBox===null&&(this.boundingBox=new je),this.boundingBox.makeEmpty();const e=t.getAttribute("position");for(let i=0;i<e.count;i++)this.getVertexPosition(i,jo),this.boundingBox.expandByPoint(jo)}computeBoundingSphere(){const t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ti),this.boundingSphere.makeEmpty();const e=t.getAttribute("position");for(let i=0;i<e.count;i++)this.getVertexPosition(i,jo),this.boundingSphere.expandByPoint(jo)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){const i=this.material,n=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),qh.copy(this.boundingSphere),qh.applyMatrix4(n),t.ray.intersectsSphere(qh)!==!1&&(Pf.copy(n).invert(),Jh.copy(t.ray).applyMatrix4(Pf),!(this.boundingBox!==null&&Jh.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,Jh)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const t=new be,e=this.geometry.attributes.skinWeight;for(let i=0,n=e.count;i<n;i++){t.fromBufferAttribute(e,i);const s=1/t.manhattanLength();s!==1/0?t.multiplyScalar(s):t.set(1,0,0,0),e.setXYZW(i,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===Ru?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Rm?this.bindMatrixInverse.copy(this.bindMatrix).invert():dt("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){const i=this.skeleton,n=this.geometry;Af.fromBufferAttribute(n.attributes.skinIndex,t),Cf.fromBufferAttribute(n.attributes.skinWeight,t),e.isVector4?(ra.copy(e),e.set(0,0,0,0)):(ra.set(...e,1),e.set(0,0,0)),ra.applyMatrix4(this.bindMatrix);for(let s=0;s<4;s++){const a=Cf.getComponent(s);if(a!==0){const o=Af.getComponent(s);Rf.multiplyMatrices(i.bones[o].matrixWorld,i.boneInverses[o]),e.addScaledVector(p_.copy(ra).applyMatrix4(Rf),a)}}return e.isVector4&&(e.w=ra.w),e.applyMatrix4(this.bindMatrixInverse)}}class xd extends he{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Vi extends Ie{constructor(t=null,e=1,i=1,n,s,a,o,l,c=Fe,h=Fe,d,u){super(null,a,o,l,c,h,n,s,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const If=new $t,m_=new $t;class $c{constructor(t=[],e=[]){this.uuid=Di(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){dt("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,n=this.bones.length;i<n;i++)this.boneInverses.push(new $t)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){const i=new $t;this.bones[t]&&i.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){const i=this.bones[t];i&&i.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){const i=this.bones[t];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const t=this.bones,e=this.boneInverses,i=this.boneMatrices,n=this.boneTexture;for(let s=0,a=t.length;s<a;s++){const o=t[s]?t[s].matrixWorld:m_;If.multiplyMatrices(o,e[s]),If.toArray(i,s*16)}n!==null&&(n.needsUpdate=!0)}clone(){return new $c(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4);e.set(this.boneMatrices);const i=new Vi(e,t,t,_i,xi);return i.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=i,this}getBoneByName(t){for(let e=0,i=this.bones.length;e<i;e++){const n=this.bones[e];if(n.name===t)return n}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let i=0,n=t.bones.length;i<n;i++){const s=t.bones[i];let a=e[s];a===void 0&&(dt("Skeleton: No bone found with UUID:",s),a=new xd),this.bones.push(a),this.boneInverses.push(new $t().fromArray(t.boneInverses[i]))}return this.init(),this}toJSON(){const t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;const e=this.bones,i=this.boneInverses;for(let n=0,s=e.length;n<s;n++){const a=e[n];t.bones.push(a.uuid);const o=i[n];t.boneInverses.push(o.toArray())}return t}}class Li extends ue{constructor(t,e,i,n=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const lr=new $t,Lf=new $t,tl=[],Nf=new je,g_=new $t,aa=new Kt,oa=new ti;class Km extends Kt{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Li(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let n=0;n<i;n++)this.setMatrixAt(n,g_)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new je),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,lr),Nf.copy(t.boundingBox).applyMatrix4(lr),this.boundingBox.union(Nf)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ti),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,lr),oa.copy(t.boundingSphere).applyMatrix4(lr),this.boundingSphere.union(oa)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,n=this.morphTexture.source.data.data,s=i.length+1,a=t*s+1;for(let o=0;o<i.length;o++)i[o]=n[a+o]}raycast(t,e){const i=this.matrixWorld,n=this.count;if(aa.geometry=this.geometry,aa.material=this.material,aa.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),oa.copy(this.boundingSphere),oa.applyMatrix4(i),t.ray.intersectsSphere(oa)!==!1))for(let s=0;s<n;s++){this.getMatrixAt(s,lr),Lf.multiplyMatrices(i,lr),aa.matrixWorld=Lf,aa.raycast(t,tl);for(let a=0,o=tl.length;a<o;a++){const l=tl[a];l.instanceId=s,l.object=this,e.push(l)}tl.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new Li(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const i=e.morphTargetInfluences,n=i.length+1;this.morphTexture===null&&(this.morphTexture=new Vi(new Float32Array(n*this.count),n,this.count,Bc,xi));const s=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=n*t;return s[l]=o,s.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const ys=new ti,x_=new st(.5,.5),el=new C;class Bs{constructor(t=new Cn,e=new Cn,i=new Cn,n=new Cn,s=new Cn,a=new Cn){this.planes=[t,e,i,n,s,a]}set(t,e,i,n,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(n),o[4].copy(s),o[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=Ui,i=!1){const n=this.planes,s=t.elements,a=s[0],o=s[1],l=s[2],c=s[3],h=s[4],d=s[5],u=s[6],f=s[7],p=s[8],x=s[9],m=s[10],g=s[11],v=s[12],w=s[13],_=s[14],b=s[15];if(n[0].setComponents(c-a,f-h,g-p,b-v).normalize(),n[1].setComponents(c+a,f+h,g+p,b+v).normalize(),n[2].setComponents(c+o,f+d,g+x,b+w).normalize(),n[3].setComponents(c-o,f-d,g-x,b-w).normalize(),i)n[4].setComponents(l,u,m,_).normalize(),n[5].setComponents(c-l,f-u,g-m,b-_).normalize();else if(n[4].setComponents(c-l,f-u,g-m,b-_).normalize(),e===Ui)n[5].setComponents(c+l,f+u,g+m,b+_).normalize();else if(e===Os)n[5].setComponents(l,u,m,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ys.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ys.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ys)}intersectsSprite(t){ys.center.set(0,0,0);const e=x_.distanceTo(t.center);return ys.radius=.7071067811865476+e,ys.applyMatrix4(t.matrixWorld),this.intersectsSphere(ys)}intersectsSphere(t){const e=this.planes,i=t.center,n=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<n)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const n=e[i];if(el.x=n.normal.x>0?t.max.x:t.min.x,el.y=n.normal.y>0?t.max.y:t.min.y,el.z=n.normal.z>0?t.max.z:t.min.z,n.distanceToPoint(el)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const Uf=new $t;class Kc{constructor(){this.coordinateSystem=Ui,this._frustums=[],this._count=0}setFromArrayCamera(t){const e=t.cameras,i=this._frustums;for(let n=0;n<e.length;n++){const s=e[n];Uf.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse),i[n]===void 0&&(i[n]=new Bs),i[n].setFromProjectionMatrix(Uf,s.coordinateSystem,s.reversedDepth)}return this._count=e.length,this}intersectsObject(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsObject(t))return!0;return!1}intersectsSprite(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsSprite(t))return!0;return!1}intersectsSphere(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsSphere(t))return!0;return!1}intersectsBox(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].intersectsBox(t))return!0;return!1}containsPoint(t){const e=this._frustums;for(let i=0;i<this._count;i++)if(e[i].containsPoint(t))return!0;return!1}copy(t){this.coordinateSystem=t.coordinateSystem;const e=this._frustums,i=t._frustums;for(let n=0;n<t._count;n++)e[n]===void 0&&(e[n]=new Bs),e[n].copy(i[n]);return this._count=t._count,this}clone(){return new Kc().copy(this)}}function Yh(r,t){return r-t}function __(r,t){return r.z-t.z}function y_(r,t){return t.z-r.z}class v_{constructor(){this.index=0,this.pool=[],this.list=[]}push(t,e,i,n){const s=this.pool,a=this.list;this.index>=s.length&&s.push({start:-1,count:-1,z:-1,index:-1});const o=s[this.index];a.push(o),this.index++,o.start=t,o.count=e,o.z=i,o.index=n}reset(){this.list.length=0,this.index=0}}const vi=new $t,S_=new bt(1,1,1),M_=new Bs,b_=new Kc,il=new je,vs=new ti,la=new C,Df=new C,w_=new C,Zh=new v_,ri=new Kt,nl=[];function T_(r,t,e=0){const i=t.itemSize;if(r.isInterleavedBufferAttribute||r.array.constructor!==t.array.constructor){const n=r.count;for(let s=0;s<n;s++)for(let a=0;a<i;a++)t.setComponent(s+e,a,r.getComponent(s,a))}else t.array.set(r.array,e*i);t.needsUpdate=!0}function Ss(r,t){if(r.constructor!==t.constructor){const e=Math.min(r.length,t.length);for(let i=0;i<e;i++)t[i]=r[i]}else{const e=Math.min(r.length,t.length);t.set(new r.constructor(r.buffer,0,e))}}class Qm extends Kt{constructor(t,e,i=e*2,n){super(new Zt,n),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=t,this._maxVertexCount=e,this._maxIndexCount=i,this._multiDrawCounts=new Int32Array(t),this._multiDrawStarts=new Int32Array(t),this._multiDrawCount=0,this._multiDrawBytesPerElement=1,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}_initMatricesTexture(){let t=Math.sqrt(this._maxInstanceCount*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);const e=new Float32Array(t*t*4),i=new Vi(e,t,t,_i,xi);this._matricesTexture=i}_initIndirectTexture(){let t=Math.sqrt(this._maxInstanceCount);t=Math.ceil(t);const e=new Uint32Array(t*t),i=new Vi(e,t,t,Mo,ki);this._indirectTexture=i}_initColorsTexture(){let t=Math.sqrt(this._maxInstanceCount);t=Math.ceil(t);const e=new Float32Array(t*t*4).fill(1),i=new Vi(e,t,t,_i,xi);i.colorSpace=oe.workingColorSpace,this._colorsTexture=i}_initializeGeometry(t){const e=this.geometry,i=this._maxVertexCount,n=this._maxIndexCount;if(this._geometryInitialized===!1){for(const s in t.attributes){const a=t.getAttribute(s),{array:o,itemSize:l,normalized:c}=a,h=new o.constructor(i*l),d=new ue(h,l,c);e.setAttribute(s,d)}if(t.getIndex()!==null){const s=i>65535?new Uint32Array(n):new Uint16Array(n);e.setIndex(new ue(s,1))}this._geometryInitialized=!0}}_validateGeometry(t){const e=this.geometry;if(!!t.getIndex()!=!!e.getIndex())throw new Error('THREE.BatchedMesh: All geometries must consistently have "index".');for(const i in e.attributes){if(!t.hasAttribute(i))throw new Error(`THREE.BatchedMesh: Added geometry missing "${i}". All geometries must have consistent attributes.`);const n=t.getAttribute(i),s=e.getAttribute(i);if(n.itemSize!==s.itemSize||n.normalized!==s.normalized)throw new Error("THREE.BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}validateInstanceId(t){const e=this._instanceInfo;if(t<0||t>=e.length||e[t].active===!1)throw new Error(`THREE.BatchedMesh: Invalid instanceId ${t}. Instance is either out of range or has been deleted.`)}validateGeometryId(t){const e=this._geometryInfo;if(t<0||t>=e.length||e[t].active===!1)throw new Error(`THREE.BatchedMesh: Invalid geometryId ${t}. Geometry is either out of range or has been deleted.`)}setCustomSort(t){return this.customSort=t,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new je);const t=this.boundingBox,e=this._instanceInfo;t.makeEmpty();for(let i=0,n=e.length;i<n;i++){if(e[i].active===!1)continue;const s=e[i].geometryIndex;this.getMatrixAt(i,vi),this.getBoundingBoxAt(s,il).applyMatrix4(vi),t.union(il)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ti);const t=this.boundingSphere,e=this._instanceInfo;t.makeEmpty();for(let i=0,n=e.length;i<n;i++){if(e[i].active===!1)continue;const s=e[i].geometryIndex;this.getMatrixAt(i,vi),this.getBoundingSphereAt(s,vs).applyMatrix4(vi),t.union(vs)}}addInstance(t){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("THREE.BatchedMesh: Maximum item count reached.");const i={visible:!0,active:!0,geometryIndex:t};let n=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(Yh),n=this._availableInstanceIds.shift(),this._instanceInfo[n]=i):(n=this._instanceInfo.length,this._instanceInfo.push(i));const s=this._matricesTexture;vi.identity().toArray(s.image.data,n*16),s.needsUpdate=!0;const a=this._colorsTexture;return a&&(S_.toArray(a.image.data,n*4),a.needsUpdate=!0),this._visibilityChanged=!0,n}addGeometry(t,e=-1,i=-1){this._initializeGeometry(t),this._validateGeometry(t);const n={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},s=this._geometryInfo;n.vertexStart=this._nextVertexStart,n.reservedVertexCount=e===-1?t.getAttribute("position").count:e;const a=t.getIndex();if(a!==null&&(n.indexStart=this._nextIndexStart,n.reservedIndexCount=i===-1?a.count:i),n.indexStart!==-1&&n.indexStart+n.reservedIndexCount>this._maxIndexCount||n.vertexStart+n.reservedVertexCount>this._maxVertexCount)throw new Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");let l;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(Yh),l=this._availableGeometryIds.shift(),s[l]=n):(l=this._geometryCount,this._geometryCount++,s.push(n)),this.setGeometryAt(l,t),this._nextIndexStart=n.indexStart+n.reservedIndexCount,this._nextVertexStart=n.vertexStart+n.reservedVertexCount,l}setGeometryAt(t,e){if(t>=this._geometryCount)throw new Error("THREE.BatchedMesh: Maximum geometry count reached.");this._validateGeometry(e);const i=this.geometry,n=i.getIndex()!==null,s=i.getIndex(),a=e.getIndex(),o=this._geometryInfo[t];if(n&&a.count>o.reservedIndexCount||e.attributes.position.count>o.reservedVertexCount)throw new Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");const l=o.vertexStart,c=o.reservedVertexCount;o.vertexCount=e.getAttribute("position").count;for(const h in i.attributes){const d=e.getAttribute(h),u=i.getAttribute(h);T_(d,u,l);const f=d.itemSize;for(let p=d.count,x=c;p<x;p++){const m=l+p;for(let g=0;g<f;g++)u.setComponent(m,g,0)}u.needsUpdate=!0,u.addUpdateRange(l*f,c*f)}if(n){const h=o.indexStart,d=o.reservedIndexCount;o.indexCount=e.getIndex().count;for(let u=0;u<a.count;u++)s.setX(h+u,l+a.getX(u));for(let u=a.count,f=d;u<f;u++)s.setX(h+u,l);s.needsUpdate=!0,s.addUpdateRange(h,o.reservedIndexCount)}return o.start=n?o.indexStart:o.vertexStart,o.count=n?o.indexCount:o.vertexCount,o.boundingBox=null,e.boundingBox!==null&&(o.boundingBox=e.boundingBox.clone()),o.boundingSphere=null,e.boundingSphere!==null&&(o.boundingSphere=e.boundingSphere.clone()),this._visibilityChanged=!0,t}deleteGeometry(t){const e=this._geometryInfo;if(t>=e.length||e[t].active===!1)return this;const i=this._instanceInfo;for(let n=0,s=i.length;n<s;n++)i[n].active&&i[n].geometryIndex===t&&this.deleteInstance(n);return e[t].active=!1,this._availableGeometryIds.push(t),this._visibilityChanged=!0,this}deleteInstance(t){return this.validateInstanceId(t),this._instanceInfo[t].active=!1,this._availableInstanceIds.push(t),this._visibilityChanged=!0,this}optimize(){let t=0,e=0;const i=this._geometryInfo,n=i.map((a,o)=>o).sort((a,o)=>i[a].vertexStart-i[o].vertexStart),s=this.geometry;for(let a=0,o=i.length;a<o;a++){const l=n[a],c=i[l];if(c.active!==!1){if(s.index!==null){if(c.indexStart!==e){const{indexStart:h,vertexStart:d,reservedIndexCount:u}=c,f=s.index,p=f.array,x=t-d;for(let m=h;m<h+u;m++)p[m]=p[m]+x;f.array.copyWithin(e,h,h+u),f.addUpdateRange(e,u),f.needsUpdate=!0,c.indexStart=e}e+=c.reservedIndexCount}if(c.vertexStart!==t){const{vertexStart:h,reservedVertexCount:d}=c,u=s.attributes;for(const f in u){const p=u[f],{array:x,itemSize:m}=p;x.copyWithin(t*m,h*m,(h+d)*m),p.addUpdateRange(t*m,d*m),p.needsUpdate=!0}c.vertexStart=t}t+=c.reservedVertexCount,c.start=s.index?c.indexStart:c.vertexStart}}return this._nextIndexStart=e,this._nextVertexStart=t,this._visibilityChanged=!0,this}getBoundingBoxAt(t,e){if(t>=this._geometryCount)return null;const i=this.geometry,n=this._geometryInfo[t];if(n.boundingBox===null){const s=new je,a=i.index,o=i.attributes.position;for(let l=n.start,c=n.start+n.count;l<c;l++){let h=l;a&&(h=a.getX(h)),s.expandByPoint(la.fromBufferAttribute(o,h))}n.boundingBox=s}return e.copy(n.boundingBox),e}getBoundingSphereAt(t,e){if(t>=this._geometryCount)return null;const i=this.geometry,n=this._geometryInfo[t];if(n.boundingSphere===null){const s=new ti;this.getBoundingBoxAt(t,il),il.getCenter(s.center);const a=i.index,o=i.attributes.position;let l=0;for(let c=n.start,h=n.start+n.count;c<h;c++){let d=c;a&&(d=a.getX(d)),la.fromBufferAttribute(o,d),l=Math.max(l,s.center.distanceToSquared(la))}s.radius=Math.sqrt(l),n.boundingSphere=s}return e.copy(n.boundingSphere),e}setMatrixAt(t,e){this.validateInstanceId(t);const i=this._matricesTexture,n=this._matricesTexture.image.data;return e.toArray(n,t*16),i.needsUpdate=!0,this}getMatrixAt(t,e){return this.validateInstanceId(t),e.fromArray(this._matricesTexture.image.data,t*16)}setColorAt(t,e){return this.validateInstanceId(t),this._colorsTexture===null&&this._initColorsTexture(),e.toArray(this._colorsTexture.image.data,t*4),this._colorsTexture.needsUpdate=!0,this}getColorAt(t,e){return this.validateInstanceId(t),this._colorsTexture===null?e.isVector4?e.set(1,1,1,1):e.setRGB(1,1,1):e.fromArray(this._colorsTexture.image.data,t*4)}setVisibleAt(t,e){return this.validateInstanceId(t),this._instanceInfo[t].visible===e?this:(this._instanceInfo[t].visible=e,this._visibilityChanged=!0,this)}getVisibleAt(t){return this.validateInstanceId(t),this._instanceInfo[t].visible}setGeometryIdAt(t,e){return this.validateInstanceId(t),this.validateGeometryId(e),this._instanceInfo[t].geometryIndex=e,this._visibilityChanged=!0,this}getGeometryIdAt(t){return this.validateInstanceId(t),this._instanceInfo[t].geometryIndex}getGeometryRangeAt(t,e={}){this.validateGeometryId(t);const i=this._geometryInfo[t];return e.vertexStart=i.vertexStart,e.vertexCount=i.vertexCount,e.reservedVertexCount=i.reservedVertexCount,e.indexStart=i.indexStart,e.indexCount=i.indexCount,e.reservedIndexCount=i.reservedIndexCount,e.start=i.start,e.count=i.count,e}setInstanceCount(t){const e=this._availableInstanceIds,i=this._instanceInfo;for(e.sort(Yh);e[e.length-1]===i.length-1;)i.pop(),e.pop();if(t<i.length)throw new Error(`THREE.BatchedMesh: Instance ids outside the range ${t} are being used. Cannot shrink instance count.`);const n=new Int32Array(t),s=new Int32Array(t);Ss(this._multiDrawCounts,n),Ss(this._multiDrawStarts,s),this._multiDrawCounts=n,this._multiDrawStarts=s,this._maxInstanceCount=t;const a=this._indirectTexture,o=this._matricesTexture,l=this._colorsTexture;a.dispose(),this._initIndirectTexture(),Ss(a.image.data,this._indirectTexture.image.data),o.dispose(),this._initMatricesTexture(),Ss(o.image.data,this._matricesTexture.image.data),l&&(l.dispose(),this._initColorsTexture(),Ss(l.image.data,this._colorsTexture.image.data))}setGeometrySize(t,e){const i=[...this._geometryInfo].filter(o=>o.active);if(Math.max(...i.map(o=>o.vertexStart+o.reservedVertexCount))>t)throw new Error(`THREE.BatchedMesh: Geometry vertex values are being used outside the range ${e}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...i.map(l=>l.indexStart+l.reservedIndexCount))>e)throw new Error(`THREE.BatchedMesh: Geometry index values are being used outside the range ${e}. Cannot shrink further.`);const s=this.geometry;s.dispose(),this._maxVertexCount=t,this._maxIndexCount=e,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new Zt,this._initializeGeometry(s));const a=this.geometry;s.index&&Ss(s.index.array,a.index.array);for(const o in s.attributes)Ss(s.attributes[o].array,a.attributes[o].array)}raycast(t,e){const i=this._instanceInfo,n=this._geometryInfo,s=this.matrixWorld,a=this.geometry;ri.material=this.material,ri.geometry.index=a.index,ri.geometry.attributes=a.attributes,ri.geometry.boundingBox===null&&(ri.geometry.boundingBox=new je),ri.geometry.boundingSphere===null&&(ri.geometry.boundingSphere=new ti);for(let o=0,l=i.length;o<l;o++){if(!i[o].visible||!i[o].active)continue;const c=i[o].geometryIndex,h=n[c];ri.geometry.setDrawRange(h.start,h.count),this.getMatrixAt(o,ri.matrixWorld).premultiply(s),this.getBoundingBoxAt(c,ri.geometry.boundingBox),this.getBoundingSphereAt(c,ri.geometry.boundingSphere),ri.raycast(t,nl);for(let d=0,u=nl.length;d<u;d++){const f=nl[d];f.object=this,f.batchId=o,e.push(f)}nl.length=0}ri.material=null,ri.geometry.index=null,ri.geometry.attributes={},ri.geometry.setDrawRange(0,1/0)}copy(t){return super.copy(t),this.geometry=t.geometry.clone(),this.perObjectFrustumCulled=t.perObjectFrustumCulled,this.sortObjects=t.sortObjects,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this._geometryInfo=t._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox!==null?e.boundingBox.clone():null,boundingSphere:e.boundingSphere!==null?e.boundingSphere.clone():null})),this._instanceInfo=t._instanceInfo.map(e=>({...e})),this._availableInstanceIds=t._availableInstanceIds.slice(),this._availableGeometryIds=t._availableGeometryIds.slice(),this._nextIndexStart=t._nextIndexStart,this._nextVertexStart=t._nextVertexStart,this._geometryCount=t._geometryCount,this._maxInstanceCount=t._maxInstanceCount,this._maxVertexCount=t._maxVertexCount,this._maxIndexCount=t._maxIndexCount,this._geometryInitialized=t._geometryInitialized,this._multiDrawCounts=t._multiDrawCounts.slice(),this._multiDrawStarts=t._multiDrawStarts.slice(),this._multiDrawBytesPerElement=t._multiDrawBytesPerElement,this._indirectTexture=t._indirectTexture.clone(),this._indirectTexture.image.data=this._indirectTexture.image.data.slice(),this._matricesTexture=t._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=t._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){super.dispose(),this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null)}onBeforeRender(t,e,i,n,s){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;const a=n.getIndex();let o=a===null?1:a.array.BYTES_PER_ELEMENT,l=1;s.wireframe&&(l=2,o=n.attributes.position.count>65535?4:2);const c=this._instanceInfo,h=this._multiDrawStarts,d=this._multiDrawCounts,u=this._geometryInfo,f=this.perObjectFrustumCulled,p=this._indirectTexture,x=p.image.data,m=i.isArrayCamera?b_:M_;f&&(i.isArrayCamera?m.setFromArrayCamera(i):(vi.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse).multiply(this.matrixWorld),m.setFromProjectionMatrix(vi,i.coordinateSystem,i.reversedDepth)));let g=0;if(this.sortObjects){vi.copy(this.matrixWorld).invert(),la.setFromMatrixPosition(i.matrixWorld).applyMatrix4(vi),Df.set(0,0,-1).transformDirection(i.matrixWorld).transformDirection(vi);for(let _=0,b=c.length;_<b;_++)if(c[_].visible&&c[_].active){const M=c[_].geometryIndex;this.getMatrixAt(_,vi),this.getBoundingSphereAt(M,vs).applyMatrix4(vi);let A=!1;if(f&&(A=!m.intersectsSphere(vs)),!A){const y=u[M],E=w_.subVectors(vs.center,la).dot(Df);Zh.push(y.start,y.count,E,_)}}const v=Zh.list,w=this.customSort;w===null?v.sort(s.transparent?y_:__):w.call(this,v,i);for(let _=0,b=v.length;_<b;_++){const M=v[_];h[g]=M.start*o*l,d[g]=M.count*l,x[g]=M.index,g++}Zh.reset()}else for(let v=0,w=c.length;v<w;v++)if(c[v].visible&&c[v].active){const _=c[v].geometryIndex;let b=!1;if(f&&(this.getMatrixAt(v,vi),this.getBoundingSphereAt(_,vs).applyMatrix4(vi),b=!m.intersectsSphere(vs)),!b){const M=u[_];h[g]=M.start*o*l,d[g]=M.count*l,x[g]=v,g++}}p.needsUpdate=!0,this._multiDrawCount=g,this._multiDrawBytesPerElement=o,this._visibilityChanged=!1}onBeforeShadow(t,e,i,n,s,a){this.onBeforeRender(t,null,n,s,a)}}class ui extends ei{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new bt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Sc=new C,Mc=new C,Of=new $t,ca=new qr,sl=new ti,$h=new C,Ff=new C;class Fn extends he{constructor(t=new Zt,e=new ui){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let n=1,s=e.count;n<s;n++)Sc.fromBufferAttribute(e,n-1),Mc.fromBufferAttribute(e,n),i[n]=i[n-1],i[n]+=Sc.distanceTo(Mc);t.setAttribute("lineDistance",new Rt(i,1))}else dt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const i=this.geometry,n=this.matrixWorld,s=t.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),sl.copy(i.boundingSphere),sl.applyMatrix4(n),sl.radius+=s,t.ray.intersectsSphere(sl)===!1)return;Of.copy(n).invert(),ca.copy(t.ray).applyMatrix4(Of);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=i.index,u=i.attributes.position;if(h!==null){const f=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let x=f,m=p-1;x<m;x+=c){const g=h.getX(x),v=h.getX(x+1),w=rl(this,t,ca,l,g,v,x);w&&e.push(w)}if(this.isLineLoop){const x=h.getX(p-1),m=h.getX(f),g=rl(this,t,ca,l,x,m,p-1);g&&e.push(g)}}else{const f=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let x=f,m=p-1;x<m;x+=c){const g=rl(this,t,ca,l,x,x+1,x);g&&e.push(g)}if(this.isLineLoop){const x=rl(this,t,ca,l,p-1,f,p-1);x&&e.push(x)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=n.length;s<a;s++){const o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function rl(r,t,e,i,n,s,a){const o=r.geometry.attributes.position;if(Sc.fromBufferAttribute(o,n),Mc.fromBufferAttribute(o,s),e.distanceSqToSegment(Sc,Mc,$h,Ff)>i)return;$h.applyMatrix4(r.matrixWorld);const c=t.ray.origin.distanceTo($h);if(!(c<t.near||c>t.far))return{distance:c,point:Ff.clone().applyMatrix4(r.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:r}}const Bf=new C,zf=new C;class vn extends Fn{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let n=0,s=e.count;n<s;n+=2)Bf.fromBufferAttribute(e,n),zf.fromBufferAttribute(e,n+1),i[n]=n===0?0:i[n-1],i[n+1]=i[n]+Bf.distanceTo(zf);t.setAttribute("lineDistance",new Rt(i,1))}else dt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class jm extends Fn{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}}class _d extends ei{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new bt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const Vf=new $t,Lu=new qr,al=new ti,ol=new C;class tg extends he{constructor(t=new Zt,e=new _d){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const i=this.geometry,n=this.matrixWorld,s=t.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),al.copy(i.boundingSphere),al.applyMatrix4(n),al.radius+=s,t.ray.intersectsSphere(al)===!1)return;Vf.copy(n).invert(),Lu.copy(t.ray).applyMatrix4(Vf);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,d=i.attributes.position;if(c!==null){const u=Math.max(0,a.start),f=Math.min(c.count,a.start+a.count);for(let p=u,x=f;p<x;p++){const m=c.getX(p);ol.fromBufferAttribute(d,m),kf(ol,m,l,n,t,e,this)}}else{const u=Math.max(0,a.start),f=Math.min(d.count,a.start+a.count);for(let p=u,x=f;p<x;p++)ol.fromBufferAttribute(d,p),kf(ol,p,l,n,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const n=e[i[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=n.length;s<a;s++){const o=n[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function kf(r,t,e,i,n,s,a){const o=Lu.distanceSqToPoint(r);if(o<e){const l=new C;Lu.closestPointToPoint(r,l),l.applyMatrix4(i);const c=n.ray.origin.distanceTo(l);if(c<n.near||c>n.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}class eg extends Ie{constructor(t,e,i,n,s=Ce,a=Ce,o,l,c){super(t,e,i,n,s,a,o,l,c),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;const h=this;function d(){h.needsUpdate=!0,h._requestVideoFrameCallbackId=t.requestVideoFrameCallback(d)}"requestVideoFrameCallback"in t&&(this._requestVideoFrameCallbackId=t.requestVideoFrameCallback(d))}clone(){return new this.constructor(this.image).copy(this)}update(){const t=this.image;"requestVideoFrameCallback"in t===!1&&t.readyState>=t.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&(this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),this._requestVideoFrameCallbackId=0),super.dispose()}}class E_ extends eg{constructor(t,e,i,n,s,a,o,l){super({},t,e,i,n,s,a,o,l),this.isVideoFrameTexture=!0}update(){}clone(){return new this.constructor().copy(this)}setFrame(t){this.image=t,this.needsUpdate=!0}}class A_ extends Ie{constructor(t,e){super({width:t,height:e}),this.isFramebufferTexture=!0,this.magFilter=Fe,this.minFilter=Fe,this.generateMipmaps=!1,this.needsUpdate=!0}}class Qc extends Ie{constructor(t,e,i,n,s,a,o,l,c,h,d,u){super(null,a,o,l,c,h,n,s,d,u),this.isCompressedTexture=!0,this.image={width:e,height:i},this.mipmaps=t,this.flipY=!1,this.generateMipmaps=!1}}class C_ extends Qc{constructor(t,e,i,n,s,a){super(t,e,i,s,a),this.isCompressedArrayTexture=!0,this.image.depth=n,this.wrapR=Ei,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class R_ extends Qc{constructor(t,e,i){super(void 0,t[0].width,t[0].height,e,i,xn),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=t}}class wo extends Ie{constructor(t=[],e=xn,i,n,s,a,o,l,c,h){super(t,e,i,n,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class jc extends Ie{constructor(t,e,i,n,s,a,o,l,c){super(t,e,i,n,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class P_ extends Ie{constructor(t,e,i,n,s,a,o,l,c){super(t,e,i,n,s,a,o,l,c),this.isHTMLTexture=!0,this.generateMipmaps=!1,this.needsUpdate=!0;const h=t?t.parentNode:null;h!==null&&"requestPaint"in h&&(h.onpaint=()=>{this.needsUpdate=!0},h.requestPaint())}dispose(){const t=this.image?this.image.parentNode:null;t!==null&&"onpaint"in t&&(t.onpaint=null),super.dispose()}}class Ur extends Ie{constructor(t,e,i=ki,n,s,a,o=Fe,l=Fe,c,h=_n,d=1){if(h!==_n&&h!==Kn)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:t,height:e,depth:d};super(u,n,s,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new In(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}}class ig extends Ur{constructor(t,e=ki,i=xn,n,s,a=Fe,o=Fe,l,c=_n){const h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,i,n,s,a,o,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class yd extends Ie{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class Re extends Zt{constructor(t=1,e=1,i=1,n=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:n,heightSegments:s,depthSegments:a};const o=this;n=Math.floor(n),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],h=[],d=[];let u=0,f=0;p("z","y","x",-1,-1,i,e,t,a,s,0),p("z","y","x",1,-1,i,e,-t,a,s,1),p("x","z","y",1,1,t,i,e,n,a,2),p("x","z","y",1,-1,t,i,-e,n,a,3),p("x","y","z",1,-1,t,e,i,n,s,4),p("x","y","z",-1,-1,t,e,-i,n,s,5),this.setIndex(l),this.setAttribute("position",new Rt(c,3)),this.setAttribute("normal",new Rt(h,3)),this.setAttribute("uv",new Rt(d,2));function p(x,m,g,v,w,_,b,M,A,y,E){const P=_/A,I=b/y,U=_/2,V=b/2,N=M/2,B=A+1,Z=y+1;let k=0,nt=0;const J=new C;for(let K=0;K<Z;K++){const Q=K*I-V;for(let At=0;At<B;At++){const St=At*P-U;J[x]=St*v,J[m]=Q*w,J[g]=N,c.push(J.x,J.y,J.z),J[x]=0,J[m]=0,J[g]=M>0?1:-1,h.push(J.x,J.y,J.z),d.push(At/A),d.push(1-K/y),k+=1}}for(let K=0;K<y;K++)for(let Q=0;Q<A;Q++){const At=u+Q+B*K,St=u+Q+B*(K+1),se=u+(Q+1)+B*(K+1),Yt=u+(Q+1)+B*K;l.push(At,St,Yt),l.push(St,se,Yt),nt+=6}o.addGroup(f,nt,E),f+=nt,u+=k}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Re(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class th extends Zt{constructor(t=1,e=1,i=4,n=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:i,radialSegments:n,heightSegments:s},e=Math.max(0,e),i=Math.max(1,Math.floor(i)),n=Math.max(3,Math.floor(n)),s=Math.max(1,Math.floor(s));const a=[],o=[],l=[],c=[],h=e/2,d=Math.PI/2*t,u=e,f=2*d+u,p=i*2+s,x=n+1,m=new C,g=new C;for(let v=0;v<=p;v++){let w=0,_=0,b=0,M=0;if(v<=i){const E=v/i,P=E*Math.PI/2;_=-h-t*Math.cos(P),b=t*Math.sin(P),M=-t*Math.cos(P),w=E*d}else if(v<=i+s){const E=(v-i)/s;_=-h+E*e,b=t,M=0,w=d+E*u}else{const E=(v-i-s)/i,P=E*Math.PI/2;_=h+t*Math.sin(P),b=t*Math.cos(P),M=t*Math.sin(P),w=d+u+E*d}const A=Math.max(0,Math.min(1,w/f));let y=0;v===0?y=.5/n:v===p&&(y=-.5/n);for(let E=0;E<=n;E++){const P=E/n,I=P*Math.PI*2,U=Math.sin(I),V=Math.cos(I);g.x=-b*V,g.y=_,g.z=b*U,o.push(g.x,g.y,g.z),m.set(-b*V,M,b*U),m.normalize(),l.push(m.x,m.y,m.z),c.push(P+y,A)}if(v>0){const E=(v-1)*x;for(let P=0;P<n;P++){const I=E+P,U=E+P+1,V=v*x+P,N=v*x+P+1;a.push(I,U,V),a.push(U,N,V)}}}this.setIndex(a),this.setAttribute("position",new Rt(o,3)),this.setAttribute("normal",new Rt(l,3)),this.setAttribute("uv",new Rt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new th(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class ls extends Zt{constructor(t=1,e=32,i=0,n=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:i,thetaLength:n},e=Math.max(3,e);const s=[],a=[],o=[],l=[],c=new C,h=new st;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=e;d++,u+=3){const f=i+d/e*n;c.x=t*Math.cos(f),c.y=t*Math.sin(f),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[u]/t+1)/2,h.y=(a[u+1]/t+1)/2,l.push(h.x,h.y)}for(let d=1;d<=e;d++)s.push(d,d+1,0);this.setIndex(s),this.setAttribute("position",new Rt(a,3)),this.setAttribute("normal",new Rt(o,3)),this.setAttribute("uv",new Rt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ls(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class cs extends Zt{constructor(t=1,e=1,i=1,n=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:n,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;n=Math.floor(n),s=Math.floor(s);const h=[],d=[],u=[],f=[];let p=0;const x=[],m=i/2;let g=0;v(),a===!1&&(t>0&&w(!0),e>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new Rt(d,3)),this.setAttribute("normal",new Rt(u,3)),this.setAttribute("uv",new Rt(f,2));function v(){const _=new C,b=new C;let M=0;const A=(e-t)/i;for(let y=0;y<=s;y++){const E=[],P=y/s,I=P*(e-t)+t;for(let U=0;U<=n;U++){const V=U/n,N=V*l+o,B=Math.sin(N),Z=Math.cos(N);b.x=I*B,b.y=-P*i+m,b.z=I*Z,d.push(b.x,b.y,b.z),_.set(B,A,Z).normalize(),u.push(_.x,_.y,_.z),f.push(V,1-P),E.push(p++)}x.push(E)}for(let y=0;y<n;y++)for(let E=0;E<s;E++){const P=x[E][y],I=x[E+1][y],U=x[E+1][y+1],V=x[E][y+1];(t>0||E!==0)&&(h.push(P,I,V),M+=3),(e>0||E!==s-1)&&(h.push(I,U,V),M+=3)}c.addGroup(g,M,0),g+=M}function w(_){const b=p,M=new st,A=new C;let y=0;const E=_===!0?t:e,P=_===!0?1:-1;for(let U=1;U<=n;U++)d.push(0,m*P,0),u.push(0,P,0),f.push(.5,.5),p++;const I=p;for(let U=0;U<=n;U++){const N=U/n*l+o,B=Math.cos(N),Z=Math.sin(N);A.x=E*Z,A.y=m*P,A.z=E*B,d.push(A.x,A.y,A.z),u.push(0,P,0),M.x=B*.5+.5,M.y=Z*.5*P+.5,f.push(M.x,M.y),p++}for(let U=0;U<n;U++){const V=b+U,N=I+U;_===!0?h.push(N,N+1,V):h.push(N+1,N,V),y+=3}c.addGroup(g,y,_===!0?1:2),g+=y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new cs(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Jr extends cs{constructor(t=1,e=1,i=32,n=1,s=!1,a=0,o=Math.PI*2){super(0,t,e,i,n,s,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:i,heightSegments:n,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Jr(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class fs extends Zt{constructor(t=[],e=[],i=1,n=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:n};const s=[],a=[];o(n),c(i),h(),this.setAttribute("position",new Rt(s,3)),this.setAttribute("normal",new Rt(s.slice(),3)),this.setAttribute("uv",new Rt(a,2)),n===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const w=new C,_=new C,b=new C;for(let M=0;M<e.length;M+=3)f(e[M+0],w),f(e[M+1],_),f(e[M+2],b),l(w,_,b,v)}function l(v,w,_,b){const M=b+1,A=[];for(let y=0;y<=M;y++){A[y]=[];const E=v.clone().lerp(_,y/M),P=w.clone().lerp(_,y/M),I=M-y;for(let U=0;U<=I;U++)U===0&&y===M?A[y][U]=E:A[y][U]=E.clone().lerp(P,U/I)}for(let y=0;y<M;y++)for(let E=0;E<2*(M-y)-1;E++){const P=Math.floor(E/2);E%2===0?(u(A[y][P+1]),u(A[y+1][P]),u(A[y][P])):(u(A[y][P+1]),u(A[y+1][P+1]),u(A[y+1][P]))}}function c(v){const w=new C;for(let _=0;_<s.length;_+=3)w.x=s[_+0],w.y=s[_+1],w.z=s[_+2],w.normalize().multiplyScalar(v),s[_+0]=w.x,s[_+1]=w.y,s[_+2]=w.z}function h(){const v=new C;for(let w=0;w<s.length;w+=3){v.x=s[w+0],v.y=s[w+1],v.z=s[w+2];const _=m(v)/2/Math.PI+.5,b=g(v)/Math.PI+.5;a.push(_,1-b)}p(),d()}function d(){for(let v=0;v<a.length;v+=6){const w=a[v+0],_=a[v+2],b=a[v+4],M=Math.max(w,_,b),A=Math.min(w,_,b);M>.9&&A<.1&&(w<.2&&(a[v+0]+=1),_<.2&&(a[v+2]+=1),b<.2&&(a[v+4]+=1))}}function u(v){s.push(v.x,v.y,v.z)}function f(v,w){const _=v*3;w.x=t[_+0],w.y=t[_+1],w.z=t[_+2]}function p(){const v=new C,w=new C,_=new C,b=new C,M=new st,A=new st,y=new st;for(let E=0,P=0;E<s.length;E+=9,P+=6){v.set(s[E+0],s[E+1],s[E+2]),w.set(s[E+3],s[E+4],s[E+5]),_.set(s[E+6],s[E+7],s[E+8]),M.set(a[P+0],a[P+1]),A.set(a[P+2],a[P+3]),y.set(a[P+4],a[P+5]),b.copy(v).add(w).add(_).divideScalar(3);const I=m(b);x(M,P+0,v,I),x(A,P+2,w,I),x(y,P+4,_,I)}}function x(v,w,_,b){b<0&&v.x===1&&(a[w]=v.x-1),_.x===0&&_.z===0&&(a[w]=b/2/Math.PI+.5)}function m(v){return Math.atan2(v.z,-v.x)}function g(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fs(t.vertices,t.indices,t.radius,t.detail)}}class eh extends fs{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,n=1/i,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-n,-i,0,-n,i,0,n,-i,0,n,i,-n,-i,0,-n,i,0,n,-i,0,n,i,0,-i,0,-n,i,0,-n,-i,0,n,i,0,n],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new eh(t.radius,t.detail)}}const ll=new C,cl=new C,Kh=new C,hl=new gi;class ng extends Zt{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const n=Math.pow(10,4),s=Math.cos(Ls*e),a=t.getIndex(),o=t.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],h=["a","b","c"],d=new Array(3),u={},f=[];for(let p=0;p<l;p+=3){a?(c[0]=a.getX(p),c[1]=a.getX(p+1),c[2]=a.getX(p+2)):(c[0]=p,c[1]=p+1,c[2]=p+2);const{a:x,b:m,c:g}=hl;if(x.fromBufferAttribute(o,c[0]),m.fromBufferAttribute(o,c[1]),g.fromBufferAttribute(o,c[2]),hl.getNormal(Kh),d[0]=`${Math.round(x.x*n)},${Math.round(x.y*n)},${Math.round(x.z*n)}`,d[1]=`${Math.round(m.x*n)},${Math.round(m.y*n)},${Math.round(m.z*n)}`,d[2]=`${Math.round(g.x*n)},${Math.round(g.y*n)},${Math.round(g.z*n)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let v=0;v<3;v++){const w=(v+1)%3,_=d[v],b=d[w],M=hl[h[v]],A=hl[h[w]],y=`${_}_${b}`,E=`${b}_${_}`;E in u&&u[E]?(Kh.dot(u[E].normal)<=s&&(f.push(M.x,M.y,M.z),f.push(A.x,A.y,A.z)),u[E]=null):y in u||(u[y]={index0:c[v],index1:c[w],normal:Kh.clone()})}}for(const p in u)if(u[p]){const{index0:x,index1:m}=u[p];ll.fromBufferAttribute(o,x),cl.fromBufferAttribute(o,m),f.push(ll.x,ll.y,ll.z),f.push(cl.x,cl.y,cl.z)}this.setAttribute("position",new Rt(f,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class en{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){dt("Curve: .getPoint() not implemented.")}getPointAt(t,e){const i=this.getUtoTmapping(t);return this.getPoint(i,e)}getPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return e}getSpacedPoints(t=5){const e=[];for(let i=0;i<=t;i++)e.push(this.getPointAt(i/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let i,n=this.getPoint(0),s=0;e.push(0);for(let a=1;a<=t;a++)i=this.getPoint(a/t),s+=i.distanceTo(n),e.push(s),n=i;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const i=this.getLengths();let n=0;const s=i.length;let a;e?a=e:a=t*i[s-1];let o=0,l=s-1,c;for(;o<=l;)if(n=Math.floor(o+(l-o)/2),c=i[n]-a,c<0)o=n+1;else if(c>0)l=n-1;else{l=n;break}if(n=l,i[n]===a)return n/(s-1);const h=i[n],u=i[n+1]-h,f=(a-h)/u;return(n+f)/(s-1)}getTangent(t,e){let n=t-1e-4,s=t+1e-4;n<0&&(n=0),s>1&&(s=1);const a=this.getPoint(n),o=this.getPoint(s),l=e||(a.isVector2?new st:new C);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const i=this.getUtoTmapping(t);return this.getTangent(i,e)}computeFrenetFrames(t,e=!1){const i=new C,n=[],s=[],a=[],o=new C,l=new $t;for(let f=0;f<=t;f++){const p=f/t;n[f]=this.getTangentAt(p,new C)}s[0]=new C,a[0]=new C;let c=Number.MAX_VALUE;const h=Math.abs(n[0].x),d=Math.abs(n[0].y),u=Math.abs(n[0].z);h<=c&&(c=h,i.set(1,0,0)),d<=c&&(c=d,i.set(0,1,0)),u<=c&&i.set(0,0,1),o.crossVectors(n[0],i).normalize(),s[0].crossVectors(n[0],o),a[0].crossVectors(n[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),a[f]=a[f-1].clone(),o.crossVectors(n[f-1],n[f]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(Jt(n[f-1].dot(n[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(o,p))}a[f].crossVectors(n[f],s[f])}if(e===!0){let f=Math.acos(Jt(s[0].dot(s[t]),-1,1));f/=t,n[0].dot(o.crossVectors(s[0],s[t]))>0&&(f=-f);for(let p=1;p<=t;p++)s[p].applyMatrix4(l.makeRotationAxis(n[p],f*p)),a[p].crossVectors(n[p],s[p])}return{tangents:n,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class ih extends en{constructor(t=0,e=0,i=1,n=1,s=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=i,this.yRadius=n,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new st){const i=e,n=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=n;for(;s>n;)s-=n;s<Number.EPSILON&&(a?s=0:s=n),this.aClockwise===!0&&!a&&(s===n?s=-n:s=s-n);const o=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,f=c-this.aY;l=u*h-f*d+this.aX,c=u*d+f*h+this.aY}return i.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class sg extends ih{constructor(t,e,i,n,s,a){super(t,e,i,i,n,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function vd(){let r=0,t=0,e=0,i=0;function n(s,a,o,l){r=s,t=o,e=-3*s+3*a-2*o-l,i=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){n(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,h,d){let u=(a-s)/c-(o-s)/(c+h)+(o-a)/h,f=(o-a)/h-(l-a)/(h+d)+(l-o)/d;u*=h,f*=h,n(a,o,u,f)},calc:function(s){const a=s*s,o=a*s;return r+t*s+e*a+i*o}}}const Gf=new C,Hf=new C,Qh=new vd,jh=new vd,tu=new vd;class rg extends en{constructor(t=[],e=!1,i="centripetal",n=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=i,this.tension=n}getPoint(t,e=new C){const i=e,n=this.points,s=n.length,a=(s-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:l===0&&o===s-1&&(o=s-2,l=1);let c,h;this.closed||o>0?c=n[(o-1)%s]:(Hf.subVectors(n[0],n[1]).add(n[0]),c=Hf);const d=n[o%s],u=n[(o+1)%s];if(this.closed||o+2<s?h=n[(o+2)%s]:(Gf.subVectors(n[s-1],n[s-2]).add(n[s-1]),h=Gf),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(d),f),x=Math.pow(d.distanceToSquared(u),f),m=Math.pow(u.distanceToSquared(h),f);x<1e-4&&(x=1),p<1e-4&&(p=x),m<1e-4&&(m=x),Qh.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,p,x,m),jh.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,p,x,m),tu.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,p,x,m)}else this.curveType==="catmullrom"&&(Qh.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),jh.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),tu.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return i.set(Qh.calc(l),jh.calc(l),tu.calc(l)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const n=t.points[e];this.points.push(n.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const n=this.points[e];t.points.push(n.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const n=t.points[e];this.points.push(new C().fromArray(n))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Wf(r,t,e,i,n){const s=(i-t)*.5,a=(n-e)*.5,o=r*r,l=r*o;return(2*e-2*i+s+a)*l+(-3*e+3*i-2*s-a)*o+s*r+e}function I_(r,t){const e=1-r;return e*e*t}function L_(r,t){return 2*(1-r)*r*t}function N_(r,t){return r*r*t}function Aa(r,t,e,i){return I_(r,t)+L_(r,e)+N_(r,i)}function U_(r,t){const e=1-r;return e*e*e*t}function D_(r,t){const e=1-r;return 3*e*e*r*t}function O_(r,t){return 3*(1-r)*r*r*t}function F_(r,t){return r*r*r*t}function Ca(r,t,e,i,n){return U_(r,t)+D_(r,e)+O_(r,i)+F_(r,n)}class Sd extends en{constructor(t=new st,e=new st,i=new st,n=new st){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=i,this.v3=n}getPoint(t,e=new st){const i=e,n=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(Ca(t,n.x,s.x,a.x,o.x),Ca(t,n.y,s.y,a.y,o.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class ag extends en{constructor(t=new C,e=new C,i=new C,n=new C){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=i,this.v3=n}getPoint(t,e=new C){const i=e,n=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(Ca(t,n.x,s.x,a.x,o.x),Ca(t,n.y,s.y,a.y,o.y),Ca(t,n.z,s.z,a.z,o.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Md extends en{constructor(t=new st,e=new st){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new st){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new st){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class og extends en{constructor(t=new C,e=new C){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new C){const i=e;return t===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(t).add(this.v1)),i}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new C){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class bd extends en{constructor(t=new st,e=new st,i=new st){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new st){const i=e,n=this.v0,s=this.v1,a=this.v2;return i.set(Aa(t,n.x,s.x,a.x),Aa(t,n.y,s.y,a.y)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class wd extends en{constructor(t=new C,e=new C,i=new C){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=i}getPoint(t,e=new C){const i=e,n=this.v0,s=this.v1,a=this.v2;return i.set(Aa(t,n.x,s.x,a.x),Aa(t,n.y,s.y,a.y),Aa(t,n.z,s.z,a.z)),i}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Td extends en{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new st){const i=e,n=this.points,s=(n.length-1)*t,a=Math.floor(s),o=s-a,l=n[a===0?a:a-1],c=n[a],h=n[a>n.length-2?n.length-1:a+1],d=n[a>n.length-3?n.length-1:a+2];return i.set(Wf(o,l.x,c.x,h.x,d.x),Wf(o,l.y,c.y,h.y,d.y)),i}copy(t){super.copy(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const n=t.points[e];this.points.push(n.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,i=this.points.length;e<i;e++){const n=this.points[e];t.points.push(n.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,i=t.points.length;e<i;e++){const n=t.points[e];this.points.push(new st().fromArray(n))}return this}}var bc=Object.freeze({__proto__:null,ArcCurve:sg,CatmullRomCurve3:rg,CubicBezierCurve:Sd,CubicBezierCurve3:ag,EllipseCurve:ih,LineCurve:Md,LineCurve3:og,QuadraticBezierCurve:bd,QuadraticBezierCurve3:wd,SplineCurve:Td});class lg extends en{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const i=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new bc[i](e,t))}return this}getPoint(t,e){const i=t*this.getLength(),n=this.getCurveLengths();let s=0;for(;s<n.length;){if(n[s]>=i){const a=n[s]-i,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let i=0,n=this.curves.length;i<n;i++)e+=this.curves[i].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let i=0;i<=t;i++)e.push(this.getPoint(i/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let i;for(let n=0,s=this.curves;n<s.length;n++){const a=s[n],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(e.push(h),i=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const n=t.curves[e];this.curves.push(n.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,i=this.curves.length;e<i;e++){const n=this.curves[e];t.curves.push(n.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,i=t.curves.length;e<i;e++){const n=t.curves[e];this.curves.push(new bc[n.type]().fromJSON(n))}return this}}class Va extends lg{constructor(t){super(),this.type="Path",this.currentPoint=new st,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,i=t.length;e<i;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const i=new Md(this.currentPoint.clone(),new st(t,e));return this.curves.push(i),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,i,n){const s=new bd(this.currentPoint.clone(),new st(t,e),new st(i,n));return this.curves.push(s),this.currentPoint.set(i,n),this}bezierCurveTo(t,e,i,n,s,a){const o=new Sd(this.currentPoint.clone(),new st(t,e),new st(i,n),new st(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),i=new Td(e);return this.curves.push(i),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,i,n,s,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,i,n,s,a),this}absarc(t,e,i,n,s,a){return this.absellipse(t,e,i,i,n,s,a),this}ellipse(t,e,i,n,s,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,i,n,s,a,o,l),this}absellipse(t,e,i,n,s,a,o,l){const c=new ih(t,e,i,n,s,a,o,l);if(this.curves.length>0){const d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class To extends Va{constructor(t){super(t),this.uuid=Di(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let i=0,n=this.holes.length;i<n;i++)e[i]=this.holes[i].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const n=t.holes[e];this.holes.push(n.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,i=this.holes.length;e<i;e++){const n=this.holes[e];t.holes.push(n.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,i=t.holes.length;e<i;e++){const n=t.holes[e];this.holes.push(new Va().fromJSON(n))}return this}}function B_(r,t,e=2){const i=t&&t.length,n=i?t[0]*e:r.length;let s=cg(r,0,n,e,!0);const a=[];if(!s||s.next===s.prev)return a;let o,l,c;if(i&&(s=H_(r,t,s,e)),r.length>80*e){o=r[0],l=r[1];let h=o,d=l;for(let u=e;u<n;u+=e){const f=r[u],p=r[u+1];f<o&&(o=f),p<l&&(l=p),f>h&&(h=f),p>d&&(d=p)}c=Math.max(h-o,d-l),c=c!==0?32767/c:0}return ka(s,a,e,o,l,c,0),a}function cg(r,t,e,i,n){let s;if(n===ty(r,t,e,i)>0)for(let a=t;a<e;a+=i)s=Xf(a/i|0,r[a],r[a+1],s);else for(let a=e-i;a>=t;a-=i)s=Xf(a/i|0,r[a],r[a+1],s);return s&&Dr(s,s.next)&&(Ha(s),s=s.next),s}function zs(r,t){if(!r)return r;t||(t=r);let e=r,i;do if(i=!1,!e.steiner&&(Dr(e,e.next)||Pe(e.prev,e,e.next)===0)){if(Ha(e),e=t=e.prev,e===e.next)break;i=!0}else e=e.next;while(i||e!==t);return t}function ka(r,t,e,i,n,s,a){if(!r)return;!a&&s&&Y_(r,i,n,s);let o=r;for(;r.prev!==r.next;){const l=r.prev,c=r.next;if(s?V_(r,i,n,s):z_(r)){t.push(l.i,r.i,c.i),Ha(r),r=c.next,o=c.next;continue}if(r=c,r===o){a?a===1?(r=k_(zs(r),t),ka(r,t,e,i,n,s,2)):a===2&&G_(r,t,e,i,n,s):ka(zs(r),t,e,i,n,s,1);break}}}function z_(r){const t=r.prev,e=r,i=r.next;if(Pe(t,e,i)>=0)return!1;const n=t.x,s=e.x,a=i.x,o=t.y,l=e.y,c=i.y,h=Math.min(n,s,a),d=Math.min(o,l,c),u=Math.max(n,s,a),f=Math.max(o,l,c);let p=i.next;for(;p!==t;){if(p.x>=h&&p.x<=u&&p.y>=d&&p.y<=f&&ma(n,o,s,l,a,c,p.x,p.y)&&Pe(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function V_(r,t,e,i){const n=r.prev,s=r,a=r.next;if(Pe(n,s,a)>=0)return!1;const o=n.x,l=s.x,c=a.x,h=n.y,d=s.y,u=a.y,f=Math.min(o,l,c),p=Math.min(h,d,u),x=Math.max(o,l,c),m=Math.max(h,d,u),g=Nu(f,p,t,e,i),v=Nu(x,m,t,e,i);let w=r.prevZ,_=r.nextZ;for(;w&&w.z>=g&&_&&_.z<=v;){if(w.x>=f&&w.x<=x&&w.y>=p&&w.y<=m&&w!==n&&w!==a&&ma(o,h,l,d,c,u,w.x,w.y)&&Pe(w.prev,w,w.next)>=0||(w=w.prevZ,_.x>=f&&_.x<=x&&_.y>=p&&_.y<=m&&_!==n&&_!==a&&ma(o,h,l,d,c,u,_.x,_.y)&&Pe(_.prev,_,_.next)>=0))return!1;_=_.nextZ}for(;w&&w.z>=g;){if(w.x>=f&&w.x<=x&&w.y>=p&&w.y<=m&&w!==n&&w!==a&&ma(o,h,l,d,c,u,w.x,w.y)&&Pe(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;_&&_.z<=v;){if(_.x>=f&&_.x<=x&&_.y>=p&&_.y<=m&&_!==n&&_!==a&&ma(o,h,l,d,c,u,_.x,_.y)&&Pe(_.prev,_,_.next)>=0)return!1;_=_.nextZ}return!0}function k_(r,t){let e=r;do{const i=e.prev,n=e.next.next;!Dr(i,n)&&ug(i,e,e.next,n)&&Ga(i,n)&&Ga(n,i)&&(t.push(i.i,e.i,n.i),Ha(e),Ha(e.next),e=r=n),e=e.next}while(e!==r);return zs(e)}function G_(r,t,e,i,n,s){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&K_(a,o)){let l=dg(a,o);a=zs(a,a.next),l=zs(l,l.next),ka(a,t,e,i,n,s,0),ka(l,t,e,i,n,s,0);return}o=o.next}a=a.next}while(a!==r)}function H_(r,t,e,i){const n=[];for(let s=0,a=t.length;s<a;s++){const o=t[s]*i,l=s<a-1?t[s+1]*i:r.length,c=cg(r,o,l,i,!1);c===c.next&&(c.steiner=!0),n.push($_(c))}n.sort(W_);for(let s=0;s<n.length;s++)e=X_(n[s],e);return e}function W_(r,t){let e=r.x-t.x;if(e===0&&(e=r.y-t.y,e===0)){const i=(r.next.y-r.y)/(r.next.x-r.x),n=(t.next.y-t.y)/(t.next.x-t.x);e=i-n}return e}function X_(r,t){const e=q_(r,t);if(!e)return t;const i=dg(e,r);return zs(i,i.next),zs(e,e.next)}function q_(r,t){let e=t;const i=r.x,n=r.y;let s=-1/0,a;if(Dr(r,e))return e;do{if(Dr(r,e.next))return e.next;if(n<=e.y&&n>=e.next.y&&e.next.y!==e.y){const d=e.x+(n-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=i&&d>s&&(s=d,a=e.x<e.next.x?e:e.next,d===i))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;e=a;do{if(i>=e.x&&e.x>=l&&i!==e.x&&hg(n<c?i:s,n,l,c,n<c?s:i,n,e.x,e.y)){const d=Math.abs(n-e.y)/(i-e.x);Ga(e,r)&&(d<h||d===h&&(e.x>a.x||e.x===a.x&&J_(a,e)))&&(a=e,h=d)}e=e.next}while(e!==o);return a}function J_(r,t){return Pe(r.prev,r,t.prev)<0&&Pe(t.next,r,r.next)<0}function Y_(r,t,e,i){let n=r;do n.z===0&&(n.z=Nu(n.x,n.y,t,e,i)),n.prevZ=n.prev,n.nextZ=n.next,n=n.next;while(n!==r);n.prevZ.nextZ=null,n.prevZ=null,Z_(n)}function Z_(r){let t,e=1;do{let i=r,n;r=null;let s=null;for(t=0;i;){t++;let a=i,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||i.z<=a.z)?(n=i,i=i.nextZ,o--):(n=a,a=a.nextZ,l--),s?s.nextZ=n:r=n,n.prevZ=s,s=n;i=a}s.nextZ=null,e*=2}while(t>1);return r}function Nu(r,t,e,i,n){return r=(r-e)*n|0,t=(t-i)*n|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,r|t<<1}function $_(r){let t=r,e=r;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==r);return e}function hg(r,t,e,i,n,s,a,o){return(n-a)*(t-o)>=(r-a)*(s-o)&&(r-a)*(i-o)>=(e-a)*(t-o)&&(e-a)*(s-o)>=(n-a)*(i-o)}function ma(r,t,e,i,n,s,a,o){return!(r===a&&t===o)&&hg(r,t,e,i,n,s,a,o)}function K_(r,t){return r.next.i!==t.i&&r.prev.i!==t.i&&!Q_(r,t)&&(Ga(r,t)&&Ga(t,r)&&j_(r,t)&&(Pe(r.prev,r,t.prev)||Pe(r,t.prev,t))||Dr(r,t)&&Pe(r.prev,r,r.next)>0&&Pe(t.prev,t,t.next)>0)}function Pe(r,t,e){return(t.y-r.y)*(e.x-t.x)-(t.x-r.x)*(e.y-t.y)}function Dr(r,t){return r.x===t.x&&r.y===t.y}function ug(r,t,e,i){const n=dl(Pe(r,t,e)),s=dl(Pe(r,t,i)),a=dl(Pe(e,i,r)),o=dl(Pe(e,i,t));return!!(n!==s&&a!==o||n===0&&ul(r,e,t)||s===0&&ul(r,i,t)||a===0&&ul(e,r,i)||o===0&&ul(e,t,i))}function ul(r,t,e){return t.x<=Math.max(r.x,e.x)&&t.x>=Math.min(r.x,e.x)&&t.y<=Math.max(r.y,e.y)&&t.y>=Math.min(r.y,e.y)}function dl(r){return r>0?1:r<0?-1:0}function Q_(r,t){let e=r;do{if(e.i!==r.i&&e.next.i!==r.i&&e.i!==t.i&&e.next.i!==t.i&&ug(e,e.next,r,t))return!0;e=e.next}while(e!==r);return!1}function Ga(r,t){return Pe(r.prev,r,r.next)<0?Pe(r,t,r.next)>=0&&Pe(r,r.prev,t)>=0:Pe(r,t,r.prev)<0||Pe(r,r.next,t)<0}function j_(r,t){let e=r,i=!1;const n=(r.x+t.x)/2,s=(r.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&n<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(i=!i),e=e.next;while(e!==r);return i}function dg(r,t){const e=Uu(r.i,r.x,r.y),i=Uu(t.i,t.x,t.y),n=r.next,s=t.prev;return r.next=t,t.prev=r,e.next=n,n.prev=e,i.next=e,e.prev=i,s.next=i,i.prev=s,i}function Xf(r,t,e,i){const n=Uu(r,t,e);return i?(n.next=i.next,n.prev=i,i.next.prev=n,i.next=n):(n.prev=n,n.next=n),n}function Ha(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Uu(r,t,e){return{i:r,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function ty(r,t,e,i){let n=0;for(let s=t,a=e-i;s<e;s+=i)n+=(r[a]-r[s])*(r[s+1]+r[a+1]),a=s;return n}class ey{static triangulate(t,e,i=2){return B_(t,e,i)}}class $i{static area(t){const e=t.length;let i=0;for(let n=e-1,s=0;s<e;n=s++)i+=t[n].x*t[s].y-t[s].x*t[n].y;return i*.5}static isClockWise(t){return $i.area(t)<0}static triangulateShape(t,e){const i=[],n=[],s=[];qf(t),Jf(i,t);let a=t.length;e.forEach(qf);for(let l=0;l<e.length;l++)n.push(a),a+=e[l].length,Jf(i,e[l]);const o=ey.triangulate(i,n);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}}function qf(r){const t=r.length;t>2&&r[t-1].equals(r[0])&&r.pop()}function Jf(r,t){for(let e=0;e<t.length;e++)r.push(t[e].x),r.push(t[e].y)}class nh extends Zt{constructor(t=new To([new st(.5,.5),new st(-.5,.5),new st(-.5,-.5),new st(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const i=this,n=[],s=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new Rt(n,3)),this.setAttribute("uv",new Rt(s,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,d=e.depth!==void 0?e.depth:1;let u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:f-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3;const g=e.extrudePath,v=e.UVGenerator!==void 0?e.UVGenerator:iy;let w,_=!1,b,M,A,y;if(g){w=g.getSpacedPoints(h),_=!0,u=!1;const et=g.isCatmullRomCurve3?g.closed:!1;b=g.computeFrenetFrames(h,et),M=new C,A=new C,y=new C}u||(m=0,f=0,p=0,x=0);const E=o.extractPoints(c);let P=E.shape;const I=E.holes;if(!$i.isClockWise(P)){P=P.reverse();for(let et=0,at=I.length;et<at;et++){const ot=I[et];$i.isClockWise(ot)&&(I[et]=ot.reverse())}}function V(et){const ot=10000000000000001e-36;let lt=et[0];for(let ht=1;ht<=et.length;ht++){const kt=ht%et.length,Ft=et[kt],Gt=Ft.x-lt.x,qt=Ft.y-lt.y,L=Gt*Gt+qt*qt,ce=Math.max(Math.abs(Ft.x),Math.abs(Ft.y),Math.abs(lt.x),Math.abs(lt.y)),jt=ot*ce*ce;if(L<=jt){et.splice(kt,1),ht--;continue}lt=Ft}}V(P),I.forEach(V);const N=I.length,B=P;for(let et=0;et<N;et++){const at=I[et];P=P.concat(at)}function Z(et,at,ot){return at||Ot("ExtrudeGeometry: vec does not exist"),et.clone().addScaledVector(at,ot)}const k=P.length;function nt(et,at,ot){let lt,ht,kt;const Ft=et.x-at.x,Gt=et.y-at.y,qt=ot.x-et.x,L=ot.y-et.y,ce=Ft*Ft+Gt*Gt,jt=Ft*L-Gt*qt;if(Math.abs(jt)>Number.EPSILON){const R=Math.sqrt(ce),S=Math.sqrt(qt*qt+L*L),z=at.x-Gt/R,G=at.y+Ft/R,X=ot.x-L/S,ct=ot.y+qt/S,ut=((X-z)*L-(ct-G)*qt)/(Ft*L-Gt*qt);lt=z+Ft*ut-et.x,ht=G+Gt*ut-et.y;const $=lt*lt+ht*ht;if($<=2)return new st(lt,ht);kt=Math.sqrt($/2)}else{let R=!1;Ft>Number.EPSILON?qt>Number.EPSILON&&(R=!0):Ft<-Number.EPSILON?qt<-Number.EPSILON&&(R=!0):Math.sign(Gt)===Math.sign(L)&&(R=!0),R?(lt=-Gt,ht=Ft,kt=Math.sqrt(ce)):(lt=Ft,ht=Gt,kt=Math.sqrt(ce/2))}return new st(lt/kt,ht/kt)}const J=[];for(let et=0,at=B.length,ot=at-1,lt=et+1;et<at;et++,ot++,lt++)ot===at&&(ot=0),lt===at&&(lt=0),J[et]=nt(B[et],B[ot],B[lt]);const K=[];let Q,At=J.concat();for(let et=0,at=N;et<at;et++){const ot=I[et];Q=[];for(let lt=0,ht=ot.length,kt=ht-1,Ft=lt+1;lt<ht;lt++,kt++,Ft++)kt===ht&&(kt=0),Ft===ht&&(Ft=0),Q[lt]=nt(ot[lt],ot[kt],ot[Ft]);K.push(Q),At=At.concat(Q)}let St;if(m===0)St=$i.triangulateShape(B,I);else{const et=[],at=[];for(let ot=0;ot<m;ot++){const lt=ot/m,ht=f*Math.cos(lt*Math.PI/2),kt=p*Math.sin(lt*Math.PI/2)+x;for(let Ft=0,Gt=B.length;Ft<Gt;Ft++){const qt=Z(B[Ft],J[Ft],kt);ft(qt.x,qt.y,-ht),lt===0&&et.push(qt)}for(let Ft=0,Gt=N;Ft<Gt;Ft++){const qt=I[Ft];Q=K[Ft];const L=[];for(let ce=0,jt=qt.length;ce<jt;ce++){const R=Z(qt[ce],Q[ce],kt);ft(R.x,R.y,-ht),lt===0&&L.push(R)}lt===0&&at.push(L)}}St=$i.triangulateShape(et,at)}const se=St.length,Yt=p+x;for(let et=0;et<k;et++){const at=u?Z(P[et],At[et],Yt):P[et];_?(A.copy(b.normals[0]).multiplyScalar(at.x),M.copy(b.binormals[0]).multiplyScalar(at.y),y.copy(w[0]).add(A).add(M),ft(y.x,y.y,y.z)):ft(at.x,at.y,0)}for(let et=1;et<=h;et++)for(let at=0;at<k;at++){const ot=u?Z(P[at],At[at],Yt):P[at];_?(A.copy(b.normals[et]).multiplyScalar(ot.x),M.copy(b.binormals[et]).multiplyScalar(ot.y),y.copy(w[et]).add(A).add(M),ft(y.x,y.y,y.z)):ft(ot.x,ot.y,d/h*et)}for(let et=m-1;et>=0;et--){const at=et/m,ot=f*Math.cos(at*Math.PI/2),lt=p*Math.sin(at*Math.PI/2)+x;for(let ht=0,kt=B.length;ht<kt;ht++){const Ft=Z(B[ht],J[ht],lt);ft(Ft.x,Ft.y,d+ot)}for(let ht=0,kt=I.length;ht<kt;ht++){const Ft=I[ht];Q=K[ht];for(let Gt=0,qt=Ft.length;Gt<qt;Gt++){const L=Z(Ft[Gt],Q[Gt],lt);_?ft(L.x,L.y+w[h-1].y,w[h-1].x+ot):ft(L.x,L.y,d+ot)}}}Qt(),q();function Qt(){const et=n.length/3;if(u){let at=0,ot=k*at;for(let lt=0;lt<se;lt++){const ht=St[lt];Ht(ht[2]+ot,ht[1]+ot,ht[0]+ot)}at=h+m*2,ot=k*at;for(let lt=0;lt<se;lt++){const ht=St[lt];Ht(ht[0]+ot,ht[1]+ot,ht[2]+ot)}}else{for(let at=0;at<se;at++){const ot=St[at];Ht(ot[2],ot[1],ot[0])}for(let at=0;at<se;at++){const ot=St[at];Ht(ot[0]+k*h,ot[1]+k*h,ot[2]+k*h)}}i.addGroup(et,n.length/3-et,0)}function q(){const et=n.length/3;let at=0;tt(B,at),at+=B.length;for(let ot=0,lt=I.length;ot<lt;ot++){const ht=I[ot];tt(ht,at),at+=ht.length}i.addGroup(et,n.length/3-et,1)}function tt(et,at){let ot=et.length;for(;--ot>=0;){const lt=ot;let ht=ot-1;ht<0&&(ht=et.length-1);for(let kt=0,Ft=h+m*2;kt<Ft;kt++){const Gt=k*kt,qt=k*(kt+1),L=at+lt+Gt,ce=at+ht+Gt,jt=at+ht+qt,R=at+lt+qt;wt(L,ce,jt,R)}}}function ft(et,at,ot){l.push(et),l.push(at),l.push(ot)}function Ht(et,at,ot){Wt(et),Wt(at),Wt(ot);const lt=n.length/3,ht=v.generateTopUV(i,n,lt-3,lt-2,lt-1);fe(ht[0]),fe(ht[1]),fe(ht[2])}function wt(et,at,ot,lt){Wt(et),Wt(at),Wt(lt),Wt(at),Wt(ot),Wt(lt);const ht=n.length/3,kt=v.generateSideWallUV(i,n,ht-6,ht-3,ht-2,ht-1);fe(kt[0]),fe(kt[1]),fe(kt[3]),fe(kt[1]),fe(kt[2]),fe(kt[3])}function Wt(et){n.push(l[et*3+0]),n.push(l[et*3+1]),n.push(l[et*3+2])}function fe(et){s.push(et.x),s.push(et.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,i=this.parameters.options;return ny(e,i,t)}static fromJSON(t,e){const i=[];for(let s=0,a=t.shapes.length;s<a;s++){const o=e[t.shapes[s]];i.push(o)}const n=t.options.extrudePath;return n!==void 0&&(t.options.extrudePath=new bc[n.type]().fromJSON(n)),new nh(i,t.options)}}const iy={generateTopUV:function(r,t,e,i,n){const s=t[e*3],a=t[e*3+1],o=t[i*3],l=t[i*3+1],c=t[n*3],h=t[n*3+1];return[new st(s,a),new st(o,l),new st(c,h)]},generateSideWallUV:function(r,t,e,i,n,s){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[i*3],h=t[i*3+1],d=t[i*3+2],u=t[n*3],f=t[n*3+1],p=t[n*3+2],x=t[s*3],m=t[s*3+1],g=t[s*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new st(a,1-l),new st(c,1-d),new st(u,1-p),new st(x,1-g)]:[new st(o,1-l),new st(h,1-d),new st(f,1-p),new st(m,1-g)]}};function ny(r,t,e){if(e.shapes=[],Array.isArray(r))for(let i=0,n=r.length;i<n;i++){const s=r[i];e.shapes.push(s.uuid)}else e.shapes.push(r.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class sh extends fs{constructor(t=1,e=0){const i=(1+Math.sqrt(5))/2,n=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(n,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new sh(t.radius,t.detail)}}class rh extends Zt{constructor(t=[new st(0,-.5),new st(.5,0),new st(0,.5)],e=12,i=0,n=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:i,phiLength:n},e=Math.floor(e),n=Jt(n,0,Math.PI*2);const s=[],a=[],o=[],l=[],c=[],h=1/e,d=new C,u=new st,f=new C,p=new C,x=new C;let m=0,g=0;for(let v=0;v<=t.length-1;v++)switch(v){case 0:m=t[v+1].x-t[v].x,g=t[v+1].y-t[v].y,f.x=g*1,f.y=-m,f.z=g*0,x.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:l.push(x.x,x.y,x.z);break;default:m=t[v+1].x-t[v].x,g=t[v+1].y-t[v].y,f.x=g*1,f.y=-m,f.z=g*0,p.copy(f),f.x+=x.x,f.y+=x.y,f.z+=x.z,f.normalize(),l.push(f.x,f.y,f.z),x.copy(p)}for(let v=0;v<=e;v++){const w=i+v*h*n,_=Math.sin(w),b=Math.cos(w);for(let M=0;M<=t.length-1;M++){d.x=t[M].x*_,d.y=t[M].y,d.z=t[M].x*b,a.push(d.x,d.y,d.z),u.x=v/e,u.y=M/(t.length-1),o.push(u.x,u.y);const A=l[3*M+0]*_,y=l[3*M+1],E=l[3*M+0]*b;c.push(A,y,E)}}for(let v=0;v<e;v++)for(let w=0;w<t.length-1;w++){const _=w+v*t.length,b=_,M=_+t.length,A=_+t.length+1,y=_+1;s.push(b,M,y),s.push(A,y,M)}this.setIndex(s),this.setAttribute("position",new Rt(a,3)),this.setAttribute("uv",new Rt(o,2)),this.setAttribute("normal",new Rt(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new rh(t.points,t.segments,t.phiStart,t.phiLength)}}class Eo extends fs{constructor(t=1,e=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],n=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,n,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Eo(t.radius,t.detail)}}class mn extends Zt{constructor(t=1,e=1,i=1,n=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:n};const s=t/2,a=e/2,o=Math.floor(i),l=Math.floor(n),c=o+1,h=l+1,d=t/o,u=e/l,f=[],p=[],x=[],m=[];for(let g=0;g<h;g++){const v=g*u-a;for(let w=0;w<c;w++){const _=w*d-s;p.push(_,-v,0),x.push(0,0,1),m.push(w/o),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let v=0;v<o;v++){const w=v+c*g,_=v+c*(g+1),b=v+1+c*(g+1),M=v+1+c*g;f.push(w,_,M),f.push(_,b,M)}this.setIndex(f),this.setAttribute("position",new Rt(p,3)),this.setAttribute("normal",new Rt(x,3)),this.setAttribute("uv",new Rt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new mn(t.width,t.height,t.widthSegments,t.heightSegments)}}class ah extends Zt{constructor(t=.5,e=1,i=32,n=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:i,phiSegments:n,thetaStart:s,thetaLength:a},i=Math.max(3,i),n=Math.max(1,n);const o=[],l=[],c=[],h=[];let d=t;const u=(e-t)/n,f=new C,p=new st;for(let x=0;x<=n;x++){for(let m=0;m<=i;m++){const g=s+m/i*a;f.x=d*Math.cos(g),f.y=d*Math.sin(g),l.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/e+1)/2,p.y=(f.y/e+1)/2,h.push(p.x,p.y)}d+=u}for(let x=0;x<n;x++){const m=x*(i+1);for(let g=0;g<i;g++){const v=g+m,w=v,_=v+i+1,b=v+i+2,M=v+1;o.push(w,_,M),o.push(_,b,M)}}this.setIndex(o),this.setAttribute("position",new Rt(l,3)),this.setAttribute("normal",new Rt(c,3)),this.setAttribute("uv",new Rt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ah(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class oh extends Zt{constructor(t=new To([new st(0,.5),new st(-.5,-.5),new st(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const i=[],n=[],s=[],a=[];let o=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(i),this.setAttribute("position",new Rt(n,3)),this.setAttribute("normal",new Rt(s,3)),this.setAttribute("uv",new Rt(a,2));function c(h){const d=n.length/3,u=h.extractPoints(e);let f=u.shape;const p=u.holes;$i.isClockWise(f)===!1&&(f=f.reverse());for(let m=0,g=p.length;m<g;m++){const v=p[m];$i.isClockWise(v)===!0&&(p[m]=v.reverse())}const x=$i.triangulateShape(f,p);for(let m=0,g=p.length;m<g;m++){const v=p[m];f=f.concat(v)}for(let m=0,g=f.length;m<g;m++){const v=f[m];n.push(v.x,v.y,0),s.push(0,0,1),a.push(v.x,v.y)}for(let m=0,g=x.length;m<g;m++){const v=x[m],w=v[0]+d,_=v[1]+d,b=v[2]+d;i.push(w,_,b),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return sy(e,t)}static fromJSON(t,e){const i=[];for(let n=0,s=t.shapes.length;n<s;n++){const a=e[t.shapes[n]];i.push(a)}return new oh(i,t.curveSegments)}}function sy(r,t){if(t.shapes=[],Array.isArray(r))for(let e=0,i=r.length;e<i;e++){const n=r[e];t.shapes.push(n.uuid)}else t.shapes.push(r.uuid);return t}class hs extends Zt{constructor(t=1,e=32,i=16,n=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:i,phiStart:n,phiLength:s,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const h=[],d=new C,u=new C,f=[],p=[],x=[],m=[];for(let g=0;g<=i;g++){const v=[],w=g/i,_=a+w*o,b=t*Math.cos(_),M=Math.sqrt(t*t-b*b);let A=0;g===0&&a===0?A=.5/e:g===i&&l===Math.PI&&(A=-.5/e);for(let y=0;y<=e;y++){const E=y/e,P=n+E*s;d.x=-M*Math.cos(P),d.y=b,d.z=M*Math.sin(P),p.push(d.x,d.y,d.z),u.copy(d).normalize(),x.push(u.x,u.y,u.z),m.push(E+A,1-w),v.push(c++)}h.push(v)}for(let g=0;g<i;g++)for(let v=0;v<e;v++){const w=h[g][v+1],_=h[g][v],b=h[g+1][v],M=h[g+1][v+1];(g!==0||a>0)&&f.push(w,_,M),(g!==i-1||l<Math.PI)&&f.push(_,b,M)}this.setIndex(f),this.setAttribute("position",new Rt(p,3)),this.setAttribute("normal",new Rt(x,3)),this.setAttribute("uv",new Rt(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new hs(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class lh extends fs{constructor(t=1,e=0){const i=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],n=[2,1,0,0,3,2,1,3,0,2,3,1];super(i,n,t,e),this.type="TetrahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new lh(t.radius,t.detail)}}class ch extends Zt{constructor(t=1,e=.4,i=12,n=48,s=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:n,arc:s,thetaStart:a,thetaLength:o},i=Math.floor(i),n=Math.floor(n);const l=[],c=[],h=[],d=[],u=new C,f=new C,p=new C;for(let x=0;x<=i;x++){const m=a+x/i*o;for(let g=0;g<=n;g++){const v=g/n*s;f.x=(t+e*Math.cos(m))*Math.cos(v),f.y=(t+e*Math.cos(m))*Math.sin(v),f.z=e*Math.sin(m),c.push(f.x,f.y,f.z),u.x=t*Math.cos(v),u.y=t*Math.sin(v),p.subVectors(f,u).normalize(),h.push(p.x,p.y,p.z),d.push(g/n),d.push(x/i)}}for(let x=1;x<=i;x++)for(let m=1;m<=n;m++){const g=(n+1)*x+m-1,v=(n+1)*(x-1)+m-1,w=(n+1)*(x-1)+m,_=(n+1)*x+m;l.push(g,v,_),l.push(v,w,_)}this.setIndex(l),this.setAttribute("position",new Rt(c,3)),this.setAttribute("normal",new Rt(h,3)),this.setAttribute("uv",new Rt(d,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ch(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}}class hh extends Zt{constructor(t=1,e=.4,i=64,n=8,s=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:t,tube:e,tubularSegments:i,radialSegments:n,p:s,q:a},i=Math.floor(i),n=Math.floor(n);const o=[],l=[],c=[],h=[],d=new C,u=new C,f=new C,p=new C,x=new C,m=new C,g=new C;for(let w=0;w<=i;++w){const _=w/i*s*Math.PI*2;v(_,s,a,t,f),v(_+.01,s,a,t,p),m.subVectors(p,f),g.addVectors(p,f),x.crossVectors(m,g),g.crossVectors(x,m),x.normalize(),g.normalize();for(let b=0;b<=n;++b){const M=b/n*Math.PI*2,A=-e*Math.cos(M),y=e*Math.sin(M);d.x=f.x+(A*g.x+y*x.x),d.y=f.y+(A*g.y+y*x.y),d.z=f.z+(A*g.z+y*x.z),l.push(d.x,d.y,d.z),u.subVectors(d,f).normalize(),c.push(u.x,u.y,u.z),h.push(w/i),h.push(b/n)}}for(let w=1;w<=i;w++)for(let _=1;_<=n;_++){const b=(n+1)*(w-1)+(_-1),M=(n+1)*w+(_-1),A=(n+1)*w+_,y=(n+1)*(w-1)+_;o.push(b,M,y),o.push(M,A,y)}this.setIndex(o),this.setAttribute("position",new Rt(l,3)),this.setAttribute("normal",new Rt(c,3)),this.setAttribute("uv",new Rt(h,2));function v(w,_,b,M,A){const y=Math.cos(w),E=Math.sin(w),P=b/_*w,I=Math.cos(P);A.x=M*(2+I)*.5*y,A.y=M*(2+I)*E*.5,A.z=M*Math.sin(P)*.5}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new hh(t.radius,t.tube,t.tubularSegments,t.radialSegments,t.p,t.q)}}class uh extends Zt{constructor(t=new wd(new C(-1,-1,0),new C(-1,1,0),new C(1,1,0)),e=64,i=1,n=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:i,radialSegments:n,closed:s};const a=t.computeFrenetFrames(e,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new C,l=new C,c=new st;let h=new C;const d=[],u=[],f=[],p=[];x(),this.setIndex(p),this.setAttribute("position",new Rt(d,3)),this.setAttribute("normal",new Rt(u,3)),this.setAttribute("uv",new Rt(f,2));function x(){for(let w=0;w<e;w++)m(w);m(s===!1?e:0),v(),g()}function m(w){h=t.getPointAt(w/e,h);const _=a.normals[w],b=a.binormals[w];for(let M=0;M<=n;M++){const A=M/n*Math.PI*2,y=Math.sin(A),E=-Math.cos(A);l.x=E*_.x+y*b.x,l.y=E*_.y+y*b.y,l.z=E*_.z+y*b.z,l.normalize(),u.push(l.x,l.y,l.z),o.x=h.x+i*l.x,o.y=h.y+i*l.y,o.z=h.z+i*l.z,d.push(o.x,o.y,o.z)}}function g(){for(let w=1;w<=e;w++)for(let _=1;_<=n;_++){const b=(n+1)*(w-1)+(_-1),M=(n+1)*w+(_-1),A=(n+1)*w+_,y=(n+1)*(w-1)+_;p.push(b,M,y),p.push(M,A,y)}}function v(){for(let w=0;w<=e;w++)for(let _=0;_<=n;_++)c.x=w/e,c.y=_/n,f.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new uh(new bc[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}class fg extends Zt{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){const e=[],i=new Set,n=new C,s=new C;if(t.index!==null){const a=t.attributes.position,o=t.index;let l=t.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){const d=l[c],u=d.start,f=d.count;for(let p=u,x=u+f;p<x;p+=3)for(let m=0;m<3;m++){const g=o.getX(p+m),v=o.getX(p+(m+1)%3);n.fromBufferAttribute(a,g),s.fromBufferAttribute(a,v),Yf(n,s,i)===!0&&(e.push(n.x,n.y,n.z),e.push(s.x,s.y,s.z))}}}else{const a=t.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){const h=3*o+c,d=3*o+(c+1)%3;n.fromBufferAttribute(a,h),s.fromBufferAttribute(a,d),Yf(n,s,i)===!0&&(e.push(n.x,n.y,n.z),e.push(s.x,s.y,s.z))}}this.setAttribute("position",new Rt(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}function Yf(r,t,e){const i=`${r.x},${r.y},${r.z}-${t.x},${t.y},${t.z}`,n=`${t.x},${t.y},${t.z}-${r.x},${r.y},${r.z}`;return e.has(i)===!0||e.has(n)===!0?!1:(e.add(i),e.add(n),!0)}var Zf=Object.freeze({__proto__:null,BoxGeometry:Re,CapsuleGeometry:th,CircleGeometry:ls,ConeGeometry:Jr,CylinderGeometry:cs,DodecahedronGeometry:eh,EdgesGeometry:ng,ExtrudeGeometry:nh,IcosahedronGeometry:sh,LatheGeometry:rh,OctahedronGeometry:Eo,PlaneGeometry:mn,PolyhedronGeometry:fs,RingGeometry:ah,ShapeGeometry:oh,SphereGeometry:hs,TetrahedronGeometry:lh,TorusGeometry:ch,TorusKnotGeometry:hh,TubeGeometry:uh,WireframeGeometry:fg});class pg extends ei{constructor(t){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new bt(0),this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.fog=t.fog,this}}function Or(r){const t={};for(const e in r){t[e]={};for(const i in r[e]){const n=r[e][i];if($f(n))n.isRenderTargetTexture?(dt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=n.clone();else if(Array.isArray(n))if($f(n[0])){const s=[];for(let a=0,o=n.length;a<o;a++)s[a]=n[a].clone();t[e][i]=s}else t[e][i]=n.slice();else t[e][i]=n}}return t}function pi(r){const t={};for(let e=0;e<r.length;e++){const i=Or(r[e]);for(const n in i)t[n]=i[n]}return t}function $f(r){return r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)}function ry(r){const t=[];for(let e=0;e<r.length;e++)t.push(r[e].clone());return t}function mg(r){const t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:oe.workingColorSpace}const gg={clone:Or,merge:pi};var ay=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,oy=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class hi extends ei{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ay,this.fragmentShader=oy,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Or(t.uniforms),this.uniformsGroups=ry(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const n in this.uniforms){const a=this.uniforms[n].value;a&&a.isTexture?e.uniforms[n]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[n]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[n]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[n]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[n]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[n]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[n]={type:"m4",value:a.toArray()}:e.uniforms[n]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const n in this.extensions)this.extensions[n]===!0&&(i[n]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const i in t.uniforms){const n=t.uniforms[i];switch(this.uniforms[i]={},n.type){case"t":this.uniforms[i].value=e[n.value]||null;break;case"c":this.uniforms[i].value=new bt().setHex(n.value);break;case"v2":this.uniforms[i].value=new st().fromArray(n.value);break;case"v3":this.uniforms[i].value=new C().fromArray(n.value);break;case"v4":this.uniforms[i].value=new be().fromArray(n.value);break;case"m3":this.uniforms[i].value=new te().fromArray(n.value);break;case"m4":this.uniforms[i].value=new $t().fromArray(n.value);break;default:this.uniforms[i].value=n.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class Ed extends hi{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Oe extends ei{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new bt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Dn,this.normalScale=new st(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new On,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ad extends Oe{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new st(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Jt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new bt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new bt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new bt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class xg extends ei{constructor(t){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new bt(16777215),this.specular=new bt(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Dn,this.normalScale=new st(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new On,this.combine=So,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.specular.copy(t.specular),this.shininess=t.shininess,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class _g extends ei{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new bt(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Dn,this.normalScale=new st(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}class yg extends ei{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Dn,this.normalScale=new st(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}}class vg extends ei{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Dn,this.normalScale=new st(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new On,this.combine=So,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Cd extends ei{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Nm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Rd extends ei{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Sg extends ei{constructor(t){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new bt(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Dn,this.normalScale=new st(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={MATCAP:""},this.color.copy(t.color),this.matcap=t.matcap,this.map=t.map,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Mg extends ui{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}}function Yi(r,t){return!r||r.constructor===t?r:typeof t.BYTES_PER_ELEMENT=="number"?new t(r):Array.prototype.slice.call(r)}function Ra(r){return r!==void 0&&r.inTangents!==void 0&&r.outTangents!==void 0}function bg(r){function t(n,s){return r[n]-r[s]}const e=r.length,i=new Array(e);for(let n=0;n!==e;++n)i[n]=n;return i.sort(t),i}function Du(r,t,e){const i=r.length,n=new r.constructor(i);for(let s=0,a=0;a!==i;++s){const o=e[s]*t;for(let l=0;l!==t;++l)n[a++]=r[o+l]}return n}function wg(r,t,e,i){let n=1,s=r[0];for(;s!==void 0&&s[i]===void 0;)s=r[n++];if(s===void 0)return;let a=s[i];if(a!==void 0)if(Array.isArray(a))do a=s[i],a!==void 0&&(t.push(s.time),e.push(...a)),s=r[n++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[i],a!==void 0&&(t.push(s.time),a.toArray(e,e.length)),s=r[n++];while(s!==void 0);else do a=s[i],a!==void 0&&(t.push(s.time),e.push(a)),s=r[n++];while(s!==void 0)}function ly(r,t,e,i,n=30){const s=r.clone();s.name=t;const a=[];for(let l=0;l<s.tracks.length;++l){const c=s.tracks[l],h=c.getValueSize(),d=[],u=[];for(let f=0;f<c.times.length;++f){const p=c.times[f]*n;if(!(p<e||p>=i)){d.push(c.times[f]);for(let x=0;x<h;++x)u.push(c.values[f*h+x])}}d.length!==0&&(c.times=Yi(d,c.times.constructor),c.values=Yi(u,c.values.constructor),a.push(c))}s.tracks=a;let o=1/0;for(let l=0;l<s.tracks.length;++l)o>s.tracks[l].times[0]&&(o=s.tracks[l].times[0]);for(let l=0;l<s.tracks.length;++l)s.tracks[l].shift(-1*o);return s.resetDuration(),s}function cy(r,t=0,e=r,i=30){i<=0&&(i=30);const n=e.tracks.length,s=t/i;for(let a=0;a<n;++a){const o=e.tracks[a],l=o.ValueTypeName;if(l==="bool"||l==="string")continue;const c=r.tracks.find(function(g){return g.name===o.name&&g.ValueTypeName===l});if(c===void 0)continue;let h=0;const d=o.getValueSize();o.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(h=d/3);let u=0;const f=c.getValueSize();c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(u=f/3);const p=o.times.length-1;let x;if(s<=o.times[0]){const g=h,v=d-h;x=o.values.slice(g,v)}else if(s>=o.times[p]){const g=p*d+h,v=g+d-h;x=o.values.slice(g,v)}else{const g=o.createInterpolant(),v=h,w=d-h;g.evaluate(s),x=g.resultBuffer.slice(v,w)}l==="quaternion"&&new yi().fromArray(x).normalize().conjugate().toArray(x);const m=c.times.length;for(let g=0;g<m;++g){const v=g*f+u;if(l==="quaternion")yi.multiplyQuaternionsFlat(c.values,v,x,0,c.values,v);else{const w=f-u*2;for(let _=0;_<w;++_)c.values[v+_]-=x[_]}}}return r.blendMode=hd,r}class hy{static convertArray(t,e){return Yi(t,e)}static isTypedArray(t){return Gm(t)}static hasTangents(t){return Ra(t)}static getKeyframeOrder(t){return bg(t)}static sortedArray(t,e,i){return Du(t,e,i)}static flattenJSON(t,e,i,n){wg(t,e,i,n)}static subclip(t,e,i,n,s=30){return ly(t,e,i,n,s)}static makeClipAdditive(t,e=0,i=t,n=30){return cy(t,e,i,n)}}class Yr{constructor(t,e,i,n){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=n!==void 0?n:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){const e=this.parameterPositions;let i=this._cachedIndex,n=e[i],s=e[i-1];t:{e:{let a;i:{n:if(!(t<n)){for(let o=i+2;;){if(n===void 0){if(t<s)break n;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(s=n,n=e[++i],t<n)break e}a=e.length;break i}if(!(t>=s)){const o=e[1];t<o&&(i=2,s=o);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(n=s,s=e[--i-1],t>=s)break e}a=i,i=0;break i}break t}for(;i<a;){const o=i+a>>>1;t<e[o]?a=o:i=o+1}if(n=e[i],s=e[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,n)}return this.interpolate_(i,s,t,n)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){const e=this.resultBuffer,i=this.sampleValues,n=this.valueSize,s=t*n;for(let a=0;a!==n;++a)e[a]=i[s+a];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class Tg extends Yr{constructor(t,e,i,n){super(t,e,i,n),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ps,endingEnd:Ps}}intervalChanged_(t,e,i){const n=this.parameterPositions;let s=t-2,a=t+1,o=n[s],l=n[a];if(o===void 0)switch(this.getSettings_().endingStart){case Is:s=t,o=2*e-i;break;case Da:s=n.length-2,o=e+n[s]-n[s+1];break;default:s=t,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case Is:a=t,l=2*i-e;break;case Da:a=1,l=i+n[1]-n[0];break;default:a=t-1,l=e}const c=(i-e)*.5,h=this.valueSize;this._weightPrev=c/(e-o),this._weightNext=c/(l-i),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(t,e,i,n){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,p=(i-e)/(n-e),x=p*p,m=x*p,g=-u*m+2*u*x-u*p,v=(1+u)*m+(-1.5-2*u)*x+(-.5+u)*p+1,w=(-1-f)*m+(1.5+f)*x+.5*p,_=f*m-f*x;for(let b=0;b!==o;++b)s[b]=g*a[h+b]+v*a[c+b]+w*a[l+b]+_*a[d+b];return s}}class Pd extends Yr{constructor(t,e,i,n){super(t,e,i,n)}interpolate_(t,e,i,n){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=(i-e)/(n-e),d=1-h;for(let u=0;u!==o;++u)s[u]=a[c+u]*d+a[l+u]*h;return s}}class Eg extends Yr{constructor(t,e,i,n){super(t,e,i,n)}interpolate_(t){return this.copySampleValue_(t-1)}}class Ag extends Yr{interpolate_(t,e,i,n){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this.inTangents,d=this.outTangents;if(!h||!d){const p=(i-e)/(n-e),x=1-p;for(let m=0;m!==o;++m)s[m]=a[c+m]*x+a[l+m]*p;return s}const u=o*2,f=t-1;for(let p=0;p!==o;++p){const x=a[c+p],m=a[l+p],g=f*u+p*2,v=d[g],w=d[g+1],_=t*u+p*2,b=h[_],M=h[_+1],A=dy(i,e,v,b,n);s[p]=Cg(A,x,w,M,m)}return s}}function Cg(r,t,e,i,n){const s=1-r;return s*s*s*t+3*s*s*r*e+3*s*r*r*i+r*r*r*n}function uy(r,t,e,i,n){const s=1-r;return 3*s*s*(e-t)+6*s*r*(i-e)+3*r*r*(n-i)}function dy(r,t,e,i,n){let s=(r-t)/(n-t);for(let a=0;a<8;a++){const o=Cg(s,t,e,i,n)-r;if(Math.abs(o)<1e-10)break;const l=uy(s,t,e,i,n);if(Math.abs(l)<1e-10)break;s=Math.max(0,Math.min(1,s-o/l))}return s}class Gi{constructor(t,e,i,n){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Yi(e,this.TimeBufferType),this.values=Yi(i,this.ValueBufferType),this.setInterpolation(n||this.DefaultInterpolation)}static toJSON(t){const e=t.constructor;let i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:Yi(t.times,Array),values:Yi(t.values,Array)};const n=t.getInterpolation();n!==t.DefaultInterpolation&&(i.interpolation=n),Ra(t.settings)&&(i.settings={inTangents:Yi(t.settings.inTangents,Array),outTangents:Yi(t.settings.outTangents,Array)})}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new Eg(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Pd(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Tg(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){const e=new Ag(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Ua:e=this.InterpolantFactoryMethodDiscrete;break;case vc:e=this.InterpolantFactoryMethodLinear;break;case Pl:e=this.InterpolantFactoryMethodSmooth;break;case Pu:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){const i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return dt("KeyframeTrack:",i),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ua;case this.InterpolantFactoryMethodLinear:return vc;case this.InterpolantFactoryMethodSmooth:return Pl;case this.InterpolantFactoryMethodBezier:return Pu}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){const e=this.times;for(let i=0,n=e.length;i!==n;++i)e[i]+=t}return this}scale(t){if(t!==1){const e=this.times;for(let i=0,n=e.length;i!==n;++i)e[i]*=t;Ra(this.settings)&&(Kf(this.settings.inTangents,t),Kf(this.settings.outTangents,t))}return this}trim(t,e){const i=this.times,n=i.length;let s=0,a=n-1;for(;s!==n&&i[s]<t;)++s;for(;a!==-1&&i[a]>e;)--a;if(++a,s!==0||a!==n){s>=a&&(a=Math.max(a,1),s=a-1);const o=this.getValueSize();this.times=i.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let t=!0;const e=this.getValueSize();e-Math.floor(e)!==0&&(Ot("KeyframeTrack: Invalid value size in track.",this),t=!1);const i=this.times,n=this.values,s=i.length;s===0&&(Ot("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==s;o++){const l=i[o];if(typeof l=="number"&&isNaN(l)){Ot("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){Ot("KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(n!==void 0&&Gm(n))for(let o=0,l=n.length;o!==l;++o){const c=n[o];if(isNaN(c)){Ot("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){const t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),n=this.getInterpolation()===Pl,s=t.length-1;let a=1;for(let o=1;o<s;++o){let l=!1;const c=t[o],h=t[o+1];if(c!==h&&(o!==1||c!==t[0]))if(n)l=!0;else{const d=o*i,u=d-i,f=d+i;for(let p=0;p!==i;++p){const x=e[d+p];if(x!==e[u+p]||x!==e[f+p]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];const d=o*i,u=a*i;for(let f=0;f!==i;++f)e[u+f]=e[d+f]}++a}}if(s>0){t[a]=t[s];for(let o=s*i,l=a*i,c=0;c!==i;++c)e[l+c]=e[o+c];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*i)):(this.times=t,this.values=e),this}clone(){const t=this.times.slice(),e=this.values.slice(),i=this.constructor,n=new i(this.name,t,e);return n.createInterpolant=this.createInterpolant,Ra(this.settings)&&(n.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),n}}function Kf(r,t){for(let e=0,i=r.length;e!==i;e+=2)r[e]*=t}Gi.prototype.ValueTypeName="";Gi.prototype.TimeBufferType=Float32Array;Gi.prototype.ValueBufferType=Float32Array;Gi.prototype.DefaultInterpolation=vc;class Hs extends Gi{constructor(t,e,i){super(t,e,i)}}Hs.prototype.ValueTypeName="bool";Hs.prototype.ValueBufferType=Array;Hs.prototype.DefaultInterpolation=Ua;Hs.prototype.InterpolantFactoryMethodLinear=void 0;Hs.prototype.InterpolantFactoryMethodSmooth=void 0;class Id extends Gi{constructor(t,e,i,n){super(t,e,i,n)}}Id.prototype.ValueTypeName="color";class dh extends Gi{constructor(t,e,i,n){super(t,e,i,n)}}dh.prototype.ValueTypeName="number";class Rg extends Yr{constructor(t,e,i,n){super(t,e,i,n)}interpolate_(t,e,i,n){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-e)/(n-e);let c=t*o;for(let h=c+o;c!==h;c+=4)yi.slerpFlat(s,0,a,c-o,a,c,l);return s}}class fh extends Gi{constructor(t,e,i,n){super(t,e,i,n)}InterpolantFactoryMethodLinear(t){return new Rg(this.times,this.values,this.getValueSize(),t)}}fh.prototype.ValueTypeName="quaternion";fh.prototype.InterpolantFactoryMethodSmooth=void 0;class Ws extends Gi{constructor(t,e,i){super(t,e,i)}}Ws.prototype.ValueTypeName="string";Ws.prototype.ValueBufferType=Array;Ws.prototype.DefaultInterpolation=Ua;Ws.prototype.InterpolantFactoryMethodLinear=void 0;Ws.prototype.InterpolantFactoryMethodSmooth=void 0;class Ld extends Gi{constructor(t,e,i,n){super(t,e,i,n)}}Ld.prototype.ValueTypeName="vector";class Wa{constructor(t="",e=-1,i=[],n=kc){this.name=t,this.tracks=i,this.duration=e,this.blendMode=n,this.uuid=Di(),this.userData={},this.duration<0&&this.resetDuration()}static parse(t){const e=[],i=t.tracks,n=1/(t.fps||1);for(let a=0,o=i.length;a!==o;++a)e.push(py(i[a]).scale(n));const s=new this(t.name,t.duration,e,t.blendMode);return s.uuid=t.uuid,s.userData=JSON.parse(t.userData||"{}"),s}static toJSON(t){const e=[],i=t.tracks,n={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode,userData:JSON.stringify(t.userData)};for(let s=0,a=i.length;s!==a;++s)e.push(Gi.toJSON(i[s]));return n}static CreateFromMorphTargetSequence(t,e,i,n){const s=e.length,a=[];for(let o=0;o<s;o++){let l=[],c=[];l.push((o+s-1)%s,o,(o+1)%s),c.push(0,1,0);const h=bg(l);l=Du(l,1,h),c=Du(c,1,h),!n&&l[0]===0&&(l.push(s),c.push(c[0])),a.push(new dh(".morphTargetInfluences["+e[o].name+"]",l,c).scale(1/i))}return new this(t,-1,a)}static findByName(t,e){let i=t;if(!Array.isArray(t)){const n=t;i=n.geometry&&n.geometry.animations||n.animations}for(let n=0;n<i.length;n++)if(i[n].name===e)return i[n];return null}static CreateClipsFromMorphTargetSequences(t,e,i){const n={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,l=t.length;o<l;o++){const c=t[o],h=c.name.match(s);if(h&&h.length>1){const d=h[1];let u=n[d];u||(n[d]=u=[]),u.push(c)}}const a=[];for(const o in n)a.push(this.CreateFromMorphTargetSequence(o,n[o],e,i));return a}resetDuration(){const t=this.tracks;let e=0;for(let i=0,n=t.length;i!==n;++i){const s=this.tracks[i];e=Math.max(e,s.times[s.times.length-1])}return this.duration=e,this}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this}clone(){const t=[];for(let i=0;i<this.tracks.length;i++)t.push(this.tracks[i].clone());const e=new this.constructor(this.name,this.duration,t,this.blendMode);return e.userData=JSON.parse(JSON.stringify(this.userData)),e}toJSON(){return this.constructor.toJSON(this)}}function fy(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return dh;case"vector":case"vector2":case"vector3":case"vector4":return Ld;case"color":return Id;case"quaternion":return fh;case"bool":case"boolean":return Hs;case"string":return Ws}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function py(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const t=fy(r.type);if(r.times===void 0){const i=[],n=[];wg(r.keys,i,n,"value"),r.times=i,r.values=n}let e;return t.parse!==void 0?e=t.parse(r):e=new t(r.name,r.times,r.values,r.interpolation),Ra(r.settings)&&(e.settings={inTangents:Yi(r.settings.inTangents,Float32Array),outTangents:Yi(r.settings.outTangents,Float32Array)}),e}const dn={enabled:!1,files:{},add:function(r,t){this.enabled!==!1&&(Qf(r)||(this.files[r]=t))},get:function(r){if(this.enabled!==!1&&!Qf(r))return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};function Qf(r){try{const t=r.slice(r.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}class Nd{constructor(t,e,i){const n=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this._abortController=null,this.itemStart=function(h){o++,s===!1&&n.onStart!==void 0&&n.onStart(h,a,o),s=!0},this.itemEnd=function(h){a++,n.onProgress!==void 0&&n.onProgress(h,a,o),a===o&&(s=!1,n.onLoad!==void 0&&n.onLoad())},this.itemError=function(h){n.onError!==void 0&&n.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){const d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){const f=c[d],p=c[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const Pg=new Nd;class Ci{constructor(t){this.manager=t!==void 0?t:Pg,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){const i=this;return new Promise(function(n,s){i.load(t,n,e,s)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}}Ci.DEFAULT_MATERIAL_NAME="__DEFAULT";const An={};class my extends Error{constructor(t,e){super(t),this.response=e}}class Bn extends Ci{constructor(t){super(t),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(t,e,i,n){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const s=dn.get(`file:${t}`);if(s!==void 0){this.manager.itemStart(t),setTimeout(()=>{e&&e(s),this.manager.itemEnd(t)},0);return}if(An[t]!==void 0){An[t].push({onLoad:e,onProgress:i,onError:n});return}An[t]=[],An[t].push({onLoad:e,onProgress:i,onError:n});const a=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&dt("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=An[t],d=c.body.getReader(),u=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=u?parseInt(u):0,p=f!==0;let x=0;const m=new ReadableStream({start(g){v();function v(){d.read().then(({done:w,value:_})=>{if(w)g.close();else{x+=_.byteLength;const b=new ProgressEvent("progress",{lengthComputable:p,loaded:x,total:f});for(let M=0,A=h.length;M<A;M++){const y=h[M];y.onProgress&&y.onProgress(b)}g.enqueue(_),v()}},w=>{g.error(w)})}}});return new Response(m)}else throw new my(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const d=/charset="?([^;"\s]*)"?/i.exec(o),u=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(u);return c.arrayBuffer().then(p=>f.decode(p))}}}).then(c=>{dn.add(`file:${t}`,c);const h=An[t];delete An[t];for(let d=0,u=h.length;d<u;d++){const f=h[d];f.onLoad&&f.onLoad(c)}}).catch(c=>{const h=An[t];if(h===void 0)throw this.manager.itemError(t),c;delete An[t];for(let d=0,u=h.length;d<u;d++){const f=h[d];f.onError&&f.onError(c)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class gy extends Ci{constructor(t){super(t)}load(t,e,i,n){const s=this,a=new Bn(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(t,function(o){try{e(s.parse(JSON.parse(o)))}catch(l){n?n(l):Ot(l),s.manager.itemError(t)}},i,n)}parse(t){const e=[];for(let i=0;i<t.length;i++){const n=Wa.parse(t[i]);e.push(n)}return e}}class xy extends Ci{constructor(t){super(t)}load(t,e,i,n){const s=this,a=[],o=new Qc,l=new Bn(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(s.withCredentials);let c=0;function h(d){l.load(t[d],function(u){const f=s.parse(u,!0);a[d]={width:f.width,height:f.height,format:f.format,mipmaps:f.mipmaps},c+=1,c===6&&(f.mipmapCount===1&&(o.minFilter=Ce),o.image=a,o.format=f.format,o.needsUpdate=!0,e&&e(o))},i,n)}if(Array.isArray(t))for(let d=0,u=t.length;d<u;++d)h(d);else l.load(t,function(d){const u=s.parse(d,!0);if(u.isCubemap){const f=u.mipmaps.length/u.mipmapCount;for(let p=0;p<f;p++){a[p]={mipmaps:[]};for(let x=0;x<u.mipmapCount;x++)a[p].mipmaps.push(u.mipmaps[p*u.mipmapCount+x]),a[p].format=u.format,a[p].width=u.width,a[p].height=u.height}o.image=a}else o.image.width=u.width,o.image.height=u.height,o.mipmaps=u.mipmaps;u.mipmapCount===1&&(o.minFilter=Ce),o.format=u.format,o.needsUpdate=!0,e&&e(o)},i,n);return o}}const cr=new WeakMap;class Xa extends Ci{constructor(t){super(t)}load(t,e,i,n){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const s=this,a=dn.get(`image:${t}`);if(a!==void 0){if(a.complete===!0)s.manager.itemStart(t),setTimeout(function(){e&&e(a),s.manager.itemEnd(t)},0);else{let d=cr.get(a);d===void 0&&(d=[],cr.set(a,d)),d.push({onLoad:e,onError:n})}return a}const o=Ba("img");function l(){h(),e&&e(this);const d=cr.get(this)||[];for(let u=0;u<d.length;u++){const f=d[u];f.onLoad&&f.onLoad(this)}cr.delete(this),s.manager.itemEnd(t)}function c(d){h(),n&&n(d),dn.remove(`image:${t}`);const u=cr.get(this)||[];for(let f=0;f<u.length;f++){const p=u[f];p.onError&&p.onError(d)}cr.delete(this),s.manager.itemError(t),s.manager.itemEnd(t)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),dn.add(`image:${t}`,o),s.manager.itemStart(t),o.src=t,o}}class _y extends Ci{constructor(t){super(t)}load(t,e,i,n){const s=new wo;s.colorSpace=Qe;const a=new Xa(this.manager);a.setCrossOrigin(this.crossOrigin),a.setPath(this.path);let o=0;function l(c){a.load(t[c],function(h){s.images[c]=h,o++,o===6&&(s.needsUpdate=!0,e&&e(s))},void 0,n)}for(let c=0;c<t.length;++c)l(c);return s}}class yy extends Ci{constructor(t){super(t)}load(t,e,i,n){const s=this,a=new Vi,o=new Bn(this.manager);return o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(s.withCredentials),o.load(t,function(l){let c;try{c=s.parse(l)}catch(h){n!==void 0?n(h):Ot(h);return}s._applyTexData(a,c),e&&e(a,c)},i,n),a}createDataTexture(t){const e=new Vi;return this._applyTexData(e,this.parse(t)),e}_applyTexData(t,e){e.image!==void 0?t.image=e.image:e.data!==void 0&&(t.image.width=e.width,t.image.height=e.height,t.image.data=e.data),t.wrapS=e.wrapS!==void 0?e.wrapS:Ei,t.wrapT=e.wrapT!==void 0?e.wrapT:Ei,t.magFilter=e.magFilter!==void 0?e.magFilter:Ce,t.minFilter=e.minFilter!==void 0?e.minFilter:Ce,t.anisotropy=e.anisotropy!==void 0?e.anisotropy:1,e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.mipmaps!==void 0&&(t.mipmaps=e.mipmaps,t.minFilter=un),e.mipmapCount===1&&(t.minFilter=Ce),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),t.needsUpdate=!0}}class vy extends Ci{constructor(t){super(t)}load(t,e,i,n){const s=new Ie,a=new Xa(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(t,function(o){s.image=o,s.needsUpdate=!0,e!==void 0&&e(s)},i,n),s}}class ps extends he{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new bt(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class Ud extends ps{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(he.DEFAULT_UP),this.updateMatrix(),this.groundColor=new bt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const eu=new $t,jf=new C,tp=new C;class ph{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new st(512,512),this.mapType=Ti,this.map=null,this.mapPass=null,this.matrix=new $t,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Bs,this._frameExtents=new st(1,1),this._viewportCount=1,this._viewports=[new be(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera;jf.setFromMatrixPosition(t.matrixWorld),e.position.copy(jf),tp.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(tp),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,i,n){eu.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),i.setFromProjectionMatrix(eu,t.coordinateSystem,t.reversedDepth);const s=this._frameExtents,a=n?n.z/s.x:1,o=n?n.w/s.y:1,l=n?n.x/s.x:0,c=n?n.y/s.y:0;t.coordinateSystem===Os||t.reversedDepth?e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),e.multiply(eu)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const fl=new C,pl=new yi,rn=new C;class mh extends he{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new $t,this.projectionMatrix=new $t,this.projectionMatrixInverse=new $t,this.coordinateSystem=Ui,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(fl,pl,rn),rn.x===1&&rn.y===1&&rn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(fl,pl,rn.set(1,1,1)).invert()}updateWorldMatrix(t,e,i=!1){super.updateWorldMatrix(t,e,i),this.matrixWorld.decompose(fl,pl,rn),rn.x===1&&rn.y===1&&rn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(fl,pl,rn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const qn=new C,ep=new st,ip=new st;class Ze extends mh{constructor(t=50,e=1,i=.1,n=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=n,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Nr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ls*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Nr*2*Math.atan(Math.tan(Ls*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){qn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(qn.x,qn.y).multiplyScalar(-t/qn.z),qn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(qn.x,qn.y).multiplyScalar(-t/qn.z)}getViewSize(t,e){return this.getViewBounds(t,ep,ip),e.subVectors(ip,ep)}setViewOffset(t,e,i,n,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ls*.5*this.fov)/this.zoom,i=2*e,n=this.aspect*i,s=-.5*n;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*n/l,e-=a.offsetY*i/c,n*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+n,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class Sy extends ph{constructor(){super(new Ze(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){const e=this.camera,i=Nr*2*t.angle*this.focus,n=this.mapSize.width/this.mapSize.height*this.aspect,s=t.distance||e.far;(i!==e.fov||n!==e.aspect||s!==e.far)&&(e.fov=i,e.aspect=n,e.far=s,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this.aspect=t.aspect,this}toJSON(){const t=super.toJSON();return t.focus=this.focus,t.aspect=this.aspect,t}}class Ig extends ps{constructor(t,e,i=0,n=Math.PI/3,s=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(he.DEFAULT_UP),this.updateMatrix(),this.target=new he,this.distance=i,this.angle=n,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new Sy}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.map=t.map,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.angle=this.angle,e.object.decay=this.decay,e.object.penumbra=this.penumbra,e.object.target=this.target.uuid,this.map&&this.map.isTexture&&(e.object.map=this.map.toJSON(t).uuid),e.object.shadow=this.shadow.toJSON(),e}}class My extends ph{constructor(){super(new Ze(90,1,.5,500)),this.isPointLightShadow=!0}}class gh extends ps{constructor(t,e,i=0,n=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=n,this.shadow=new My}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}}class Ao extends mh{constructor(t=-1,e=1,i=1,n=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=n,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,n,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=n,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,n=(this.top+this.bottom)/2;let s=i-t,a=i+t,o=n+e,l=n-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class by extends ph{constructor(){super(new Ao(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class xh extends ps{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(he.DEFAULT_UP),this.updateMatrix(),this.target=new he,this.shadow=new by}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}class Lg extends ps{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class Ng extends ps{constructor(t,e,i=10,n=10){super(t,e),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=i,this.height=n}get power(){return this.intensity*this.width*this.height*Math.PI}set power(t){this.intensity=t/(this.width*this.height*Math.PI)}copy(t){return super.copy(t),this.width=t.width,this.height=t.height,this}toJSON(t){const e=super.toJSON(t);return e.object.width=this.width,e.object.height=this.height,e}}class Dd{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let t=0;t<9;t++)this.coefficients.push(new C)}set(t){for(let e=0;e<9;e++)this.coefficients[e].copy(t[e]);return this}zero(){for(let t=0;t<9;t++)this.coefficients[t].set(0,0,0);return this}getAt(t,e){const i=t.x,n=t.y,s=t.z,a=this.coefficients;return e.copy(a[0]).multiplyScalar(.282095),e.addScaledVector(a[1],.488603*n),e.addScaledVector(a[2],.488603*s),e.addScaledVector(a[3],.488603*i),e.addScaledVector(a[4],1.092548*(i*n)),e.addScaledVector(a[5],1.092548*(n*s)),e.addScaledVector(a[6],.315392*(3*s*s-1)),e.addScaledVector(a[7],1.092548*(i*s)),e.addScaledVector(a[8],.546274*(i*i-n*n)),e}getIrradianceAt(t,e){const i=t.x,n=t.y,s=t.z,a=this.coefficients;return e.copy(a[0]).multiplyScalar(.886227),e.addScaledVector(a[1],2*.511664*n),e.addScaledVector(a[2],2*.511664*s),e.addScaledVector(a[3],2*.511664*i),e.addScaledVector(a[4],2*.429043*i*n),e.addScaledVector(a[5],2*.429043*n*s),e.addScaledVector(a[6],.743125*s*s-.247708),e.addScaledVector(a[7],2*.429043*i*s),e.addScaledVector(a[8],.429043*(i*i-n*n)),e}add(t){for(let e=0;e<9;e++)this.coefficients[e].add(t.coefficients[e]);return this}addScaledSH(t,e){for(let i=0;i<9;i++)this.coefficients[i].addScaledVector(t.coefficients[i],e);return this}scale(t){for(let e=0;e<9;e++)this.coefficients[e].multiplyScalar(t);return this}lerp(t,e){for(let i=0;i<9;i++)this.coefficients[i].lerp(t.coefficients[i],e);return this}equals(t){for(let e=0;e<9;e++)if(!this.coefficients[e].equals(t.coefficients[e]))return!1;return!0}copy(t){return this.set(t.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(t,e=0){const i=this.coefficients;for(let n=0;n<9;n++)i[n].fromArray(t,e+n*3);return this}toArray(t=[],e=0){const i=this.coefficients;for(let n=0;n<9;n++)i[n].toArray(t,e+n*3);return t}static getBasisAt(t,e){const i=t.x,n=t.y,s=t.z;e[0]=.282095,e[1]=.488603*n,e[2]=.488603*s,e[3]=.488603*i,e[4]=1.092548*i*n,e[5]=1.092548*n*s,e[6]=.315392*(3*s*s-1),e[7]=1.092548*i*s,e[8]=.546274*(i*i-n*n)}}class Ug extends ps{constructor(t=new Dd,e=1){super(void 0,e),this.isLightProbe=!0,this.sh=t}copy(t){return super.copy(t),this.sh.copy(t.sh),this}toJSON(t){const e=super.toJSON(t);return e.object.sh=this.sh.toArray(),e}}const np={};class _h extends Ci{constructor(t){super(t),this.textures={}}load(t,e,i,n){const s=this,a=new Bn(s.manager);a.setPath(s.path),a.setRequestHeader(s.requestHeader),a.setWithCredentials(s.withCredentials),a.load(t,function(o){try{e(s.parse(JSON.parse(o)))}catch(l){n?n(l):Ot(l),s.manager.itemError(t)}},i,n)}parse(t){const e=this.createMaterialFromType(t.type);return e.fromJSON(t,this.textures),e}setTextures(t){return this.textures=t,this}createMaterialFromType(t){return _h.createMaterialFromType(t)}static createMaterialFromType(t){const i={ShadowMaterial:pg,SpriteMaterial:Zc,RawShaderMaterial:Ed,ShaderMaterial:hi,PointsMaterial:_d,MeshPhysicalMaterial:Ad,MeshStandardMaterial:Oe,MeshPhongMaterial:xg,MeshToonMaterial:_g,MeshNormalMaterial:yg,MeshLambertMaterial:vg,MeshDepthMaterial:Cd,MeshDistanceMaterial:Rd,MeshBasicMaterial:He,MeshMatcapMaterial:Sg,LineDashedMaterial:Mg,LineBasicMaterial:ui,Material:ei,...np}[t];let n;return i===void 0?(Nn(`MaterialLoader: Unknown material type "${t}". Use .registerMaterial() before starting the deserialization process.`),n=new ei):n=new i,n}static registerMaterial(t,e){np[t]=e}}class Ou{static extractUrlBase(t){const e=t.lastIndexOf("/");return e===-1?"./":t.slice(0,e+1)}static resolveURL(t,e){return typeof t!="string"||t===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(t)&&(e=e.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(t)||/^data:.*,.*$/i.test(t)||/^blob:.*$/i.test(t)?t:e+t)}}class Od extends Zt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){const t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}}class Dg extends Ci{constructor(t){super(t)}load(t,e,i,n){const s=this,a=new Bn(s.manager);a.setPath(s.path),a.setRequestHeader(s.requestHeader),a.setWithCredentials(s.withCredentials),a.load(t,function(o){try{e(s.parse(JSON.parse(o)))}catch(l){n?n(l):Ot(l),s.manager.itemError(t)}},i,n)}parse(t){const e={},i={};function n(f,p){if(e[p]!==void 0)return e[p];const m=f.interleavedBuffers[p],g=s(f,m.buffer),v=_r(m.type,g),w=new Yc(v,m.stride);return w.uuid=m.uuid,m.usage!==void 0&&w.setUsage(m.usage),e[p]=w,w}function s(f,p){if(i[p]!==void 0)return i[p];const m=f.arrayBuffers[p],g=new Uint32Array(m).buffer;return i[p]=g,g}const a=t.isInstancedBufferGeometry?new Od:new Zt,o=t.data.index;if(o!==void 0){const f=_r(o.type,o.array);a.setIndex(new ue(f,1))}const l=t.data.attributes;for(const f in l){const p=l[f];let x;if(p.isInterleavedBufferAttribute){const m=n(t.data,p.data);x=new Fs(m,p.itemSize,p.offset,p.normalized)}else{const m=_r(p.type,p.array),g=p.isInstancedBufferAttribute?Li:ue;x=new g(m,p.itemSize,p.normalized)}p.name!==void 0&&(x.name=p.name),p.usage!==void 0&&x.setUsage(p.usage),p.gpuType!==void 0&&(x.gpuType=p.gpuType),a.setAttribute(f,x)}const c=t.data.morphAttributes;if(c)for(const f in c){const p=c[f],x=[];for(let m=0,g=p.length;m<g;m++){const v=p[m];let w;if(v.isInterleavedBufferAttribute){const _=n(t.data,v.data);w=new Fs(_,v.itemSize,v.offset,v.normalized)}else{const _=_r(v.type,v.array);w=new ue(_,v.itemSize,v.normalized)}v.name!==void 0&&(w.name=v.name),v.usage!==void 0&&w.setUsage(v.usage),v.gpuType!==void 0&&(w.gpuType=v.gpuType),x.push(w)}a.morphAttributes[f]=x}t.data.morphTargetsRelative&&(a.morphTargetsRelative=!0);const d=t.data.groups||t.data.drawcalls||t.data.offsets;if(d!==void 0)for(let f=0,p=d.length;f!==p;++f){const x=d[f];a.addGroup(x.start,x.count,x.materialIndex)}const u=t.data.boundingSphere;return u!==void 0&&(a.boundingSphere=new ti().fromJSON(u)),t.name&&(a.name=t.name),t.userData&&(a.userData=t.userData),a}}const iu={};class wy extends Ci{constructor(t){super(t)}load(t,e,i,n){const s=this,a=this.path===""?Ou.extractUrlBase(t):this.path;this.resourcePath=this.resourcePath||a;const o=new Bn(this.manager);o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(t,function(l){let c=null;try{c=JSON.parse(l)}catch(d){n!==void 0&&n(d),Ot("ObjectLoader: Can't parse "+t+".",d.message);return}const h=c.metadata;if(h===void 0||h.type===void 0||h.type.toLowerCase()==="geometry"){n!==void 0&&n(new Error("THREE.ObjectLoader: Can't load "+t)),Ot("ObjectLoader: Can't load "+t);return}s.parse(c,e)},i,n)}async loadAsync(t,e){const i=this,n=this.path===""?Ou.extractUrlBase(t):this.path;this.resourcePath=this.resourcePath||n;const s=new Bn(this.manager);s.setPath(this.path),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials);const a=await s.loadAsync(t,e);let o;try{o=JSON.parse(a)}catch(c){throw new Error("THREE.ObjectLoader: Can't parse "+t+". "+c.message)}const l=o.metadata;if(l===void 0||l.type===void 0||l.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+t);return await i.parseAsync(o)}parse(t,e){const i=this.parseAnimations(t.animations),n=this.parseShapes(t.shapes),s=this.parseGeometries(t.geometries,n),a=this.parseImages(t.images,function(){e!==void 0&&e(c)}),o=this.parseTextures(t.textures,a),l=this.parseMaterials(t.materials,o),c=this.parseObject(t.object,s,l,o,i),h=this.parseSkeletons(t.skeletons,c);if(this.bindSkeletons(c,h),this.bindLightTargets(c),e!==void 0){let d=!1;for(const u in a)if(a[u].data instanceof HTMLImageElement){d=!0;break}d===!1&&e(c)}return c}async parseAsync(t){const e=this.parseAnimations(t.animations),i=this.parseShapes(t.shapes),n=this.parseGeometries(t.geometries,i),s=await this.parseImagesAsync(t.images),a=this.parseTextures(t.textures,s),o=this.parseMaterials(t.materials,a),l=this.parseObject(t.object,n,o,a,e),c=this.parseSkeletons(t.skeletons,l);return this.bindSkeletons(l,c),this.bindLightTargets(l),l}static registerGeometry(t,e){iu[t]=e}parseShapes(t){const e={};if(t!==void 0)for(let i=0,n=t.length;i<n;i++){const s=new To().fromJSON(t[i]);e[s.uuid]=s}return e}parseSkeletons(t,e){const i={},n={};if(e.traverse(function(s){s.isBone&&(n[s.uuid]=s)}),t!==void 0)for(let s=0,a=t.length;s<a;s++){const o=new $c().fromJSON(t[s],n);i[o.uuid]=o}return i}parseGeometries(t,e){const i={};if(t!==void 0){const n=new Dg;for(let s=0,a=t.length;s<a;s++){let o;const l=t[s];switch(l.type){case"BufferGeometry":case"InstancedBufferGeometry":o=n.parse(l);break;default:l.type in Zf?o=Zf[l.type].fromJSON(l,e):l.type in iu?o=iu[l.type].fromJSON(l,e):dt(`ObjectLoader: Unknown geometry type "${l.type}". Use .registerGeometry() before starting the deserialization process.`)}o.uuid=l.uuid,l.name!==void 0&&(o.name=l.name),l.userData!==void 0&&(o.userData=l.userData),i[l.uuid]=o}}return i}parseMaterials(t,e){const i={},n={};if(t!==void 0){const s=new _h;s.setTextures(e);for(let a=0,o=t.length;a<o;a++){const l=t[a];i[l.uuid]===void 0&&(i[l.uuid]=s.parse(l)),n[l.uuid]=i[l.uuid]}}return n}parseAnimations(t){const e={};if(t!==void 0)for(let i=0;i<t.length;i++){const n=t[i],s=Wa.parse(n);e[s.uuid]=s}return e}parseImages(t,e){const i=this,n={};let s;function a(l){return l=i.manager.resolveURL(l),i.manager.itemStart(l),s.load(l,function(){i.manager.itemEnd(l)},void 0,function(){i.manager.itemError(l),i.manager.itemEnd(l)})}function o(l){if(typeof l=="string"){const c=l,h=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(c)?c:i.resourcePath+c;return a(h)}else return l.data?{data:_r(l.type,l.data),width:l.width,height:l.height}:null}if(t!==void 0&&t.length>0){const l=new Nd(e);s=new Xa(l),s.setCrossOrigin(this.crossOrigin);for(let c=0,h=t.length;c<h;c++){const d=t[c],u=d.url;if(Array.isArray(u)){const f=[];for(let p=0,x=u.length;p<x;p++){const m=u[p],g=o(m);g!==null&&(g instanceof HTMLImageElement?f.push(g):f.push(new Vi(g.data,g.width,g.height)))}n[d.uuid]=new In(f)}else{const f=o(d.url);n[d.uuid]=new In(f)}}}return n}async parseImagesAsync(t){const e=this,i={};let n;async function s(a){if(typeof a=="string"){const o=a,l=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(o)?o:e.resourcePath+o;return await n.loadAsync(l)}else return a.data?{data:_r(a.type,a.data),width:a.width,height:a.height}:null}if(t!==void 0&&t.length>0){n=new Xa(this.manager),n.setCrossOrigin(this.crossOrigin);for(let a=0,o=t.length;a<o;a++){const l=t[a],c=l.url;if(Array.isArray(c)){const h=[];for(let d=0,u=c.length;d<u;d++){const f=c[d],p=await s(f);p!==null&&(p instanceof HTMLImageElement?h.push(p):h.push(new Vi(p.data,p.width,p.height)))}i[l.uuid]=new In(h)}else{const h=await s(l.url);i[l.uuid]=new In(h)}}}return i}parseTextures(t,e){function i(s,a){return typeof s=="number"?s:(dt("ObjectLoader.parseTexture: Constant should be in numeric form.",s),a[s])}const n={};if(t!==void 0)for(let s=0,a=t.length;s<a;s++){const o=t[s];o.image===void 0&&dt('ObjectLoader: No "image" specified for',o.uuid),e[o.image]===void 0&&dt("ObjectLoader: Undefined image",o.image);const l=e[o.image],c=l.data;let h;Array.isArray(c)?(h=new wo,c.length===6&&(h.needsUpdate=!0)):(c&&c.data?h=new Vi:h=new Ie,c&&(h.needsUpdate=!0)),h.source=l,h.uuid=o.uuid,o.name!==void 0&&(h.name=o.name),o.mapping!==void 0&&(h.mapping=i(o.mapping,Ty)),o.channel!==void 0&&(h.channel=o.channel),o.offset!==void 0&&h.offset.fromArray(o.offset),o.repeat!==void 0&&h.repeat.fromArray(o.repeat),o.center!==void 0&&h.center.fromArray(o.center),o.rotation!==void 0&&(h.rotation=o.rotation),o.wrap!==void 0&&(h.wrapS=i(o.wrap[0],sp),h.wrapT=i(o.wrap[1],sp)),o.format!==void 0&&(h.format=o.format),o.internalFormat!==void 0&&(h.internalFormat=o.internalFormat),o.type!==void 0&&(h.type=o.type),o.colorSpace!==void 0&&(h.colorSpace=o.colorSpace),o.minFilter!==void 0&&(h.minFilter=i(o.minFilter,rp)),o.magFilter!==void 0&&(h.magFilter=i(o.magFilter,rp)),o.anisotropy!==void 0&&(h.anisotropy=o.anisotropy),o.flipY!==void 0&&(h.flipY=o.flipY),o.generateMipmaps!==void 0&&(h.generateMipmaps=o.generateMipmaps),o.premultiplyAlpha!==void 0&&(h.premultiplyAlpha=o.premultiplyAlpha),o.unpackAlignment!==void 0&&(h.unpackAlignment=o.unpackAlignment),o.compareFunction!==void 0&&(h.compareFunction=o.compareFunction),o.normalized!==void 0&&(h.normalized=o.normalized),o.userData!==void 0&&(h.userData=o.userData),n[o.uuid]=h}return n}parseObject(t,e,i,n,s){let a;function o(u){return e[u]===void 0&&dt("ObjectLoader: Undefined geometry",u),e[u]}function l(u){if(u!==void 0){if(Array.isArray(u)){const f=[];for(let p=0,x=u.length;p<x;p++){const m=u[p];i[m]===void 0&&dt("ObjectLoader: Undefined material",m),f.push(i[m])}return f}return i[u]===void 0&&dt("ObjectLoader: Undefined material",u),i[u]}}function c(u){return n[u]===void 0&&dt("ObjectLoader: Undefined texture",u),n[u]}let h,d;switch(t.type){case"Scene":a=new fd,t.background!==void 0&&(Number.isInteger(t.background)?a.background=new bt(t.background):a.background=c(t.background)),t.environment!==void 0&&(a.environment=c(t.environment)),t.fog!==void 0&&(t.fog.type==="Fog"?a.fog=new bo(t.fog.color,t.fog.near,t.fog.far):t.fog.type==="FogExp2"&&(a.fog=new Jc(t.fog.color,t.fog.density)),t.fog.name!==""&&(a.fog.name=t.fog.name)),t.backgroundBlurriness!==void 0&&(a.backgroundBlurriness=t.backgroundBlurriness),t.backgroundIntensity!==void 0&&(a.backgroundIntensity=t.backgroundIntensity),t.backgroundRotation!==void 0&&a.backgroundRotation.fromArray(t.backgroundRotation),t.environmentIntensity!==void 0&&(a.environmentIntensity=t.environmentIntensity),t.environmentRotation!==void 0&&a.environmentRotation.fromArray(t.environmentRotation);break;case"PerspectiveCamera":a=new Ze(t.fov,t.aspect,t.near,t.far),t.focus!==void 0&&(a.focus=t.focus),t.zoom!==void 0&&(a.zoom=t.zoom),t.filmGauge!==void 0&&(a.filmGauge=t.filmGauge),t.filmOffset!==void 0&&(a.filmOffset=t.filmOffset),t.view!==void 0&&(a.view=Object.assign({},t.view));break;case"OrthographicCamera":a=new Ao(t.left,t.right,t.top,t.bottom,t.near,t.far),t.zoom!==void 0&&(a.zoom=t.zoom),t.view!==void 0&&(a.view=Object.assign({},t.view));break;case"AmbientLight":a=new Lg(t.color,t.intensity);break;case"DirectionalLight":a=new xh(t.color,t.intensity),a.target=t.target||"";break;case"PointLight":a=new gh(t.color,t.intensity,t.distance,t.decay);break;case"RectAreaLight":a=new Ng(t.color,t.intensity,t.width,t.height);break;case"SpotLight":a=new Ig(t.color,t.intensity,t.distance,t.angle,t.penumbra,t.decay),a.target=t.target||"";break;case"HemisphereLight":a=new Ud(t.color,t.groundColor,t.intensity);break;case"LightProbe":const u=new Dd().fromArray(t.sh);a=new Ug(u,t.intensity);break;case"SkinnedMesh":h=o(t.geometry),d=l(t.material),a=new $m(h,d),t.bindMode!==void 0&&(a.bindMode=t.bindMode),t.bindMatrix!==void 0&&a.bindMatrix.fromArray(t.bindMatrix),t.skeleton!==void 0&&(a.skeleton=t.skeleton);break;case"Mesh":h=o(t.geometry),d=l(t.material),a=new Kt(h,d);break;case"InstancedMesh":h=o(t.geometry),d=l(t.material);const f=t.count,p=t.instanceMatrix,x=t.instanceColor;a=new Km(h,d,f),a.instanceMatrix=new Li(new Float32Array(p.array),16),x!==void 0&&(a.instanceColor=new Li(new Float32Array(x.array),x.itemSize));break;case"BatchedMesh":h=o(t.geometry),d=l(t.material),a=new Qm(t.maxInstanceCount,t.maxVertexCount,t.maxIndexCount,d),a.geometry=h,a.perObjectFrustumCulled=t.perObjectFrustumCulled,a.sortObjects=t.sortObjects,a._drawRanges=t.drawRanges,a._reservedRanges=t.reservedRanges,a._geometryInfo=t.geometryInfo.map(m=>{let g=null,v=null;return m.boundingBox!==void 0&&(g=new je().fromJSON(m.boundingBox)),m.boundingSphere!==void 0&&(v=new ti().fromJSON(m.boundingSphere)),{...m,boundingBox:g,boundingSphere:v}}),a._instanceInfo=t.instanceInfo,a._availableInstanceIds=t._availableInstanceIds,a._availableGeometryIds=t._availableGeometryIds,a._nextIndexStart=t.nextIndexStart,a._nextVertexStart=t.nextVertexStart,a._geometryCount=t.geometryCount,a._maxInstanceCount=t.maxInstanceCount,a._maxVertexCount=t.maxVertexCount,a._maxIndexCount=t.maxIndexCount,a._geometryInitialized=t.geometryInitialized,a._matricesTexture=c(t.matricesTexture.uuid),a._indirectTexture=c(t.indirectTexture.uuid),t.colorsTexture!==void 0&&(a._colorsTexture=c(t.colorsTexture.uuid)),t.boundingSphere!==void 0&&(a.boundingSphere=new ti().fromJSON(t.boundingSphere)),t.boundingBox!==void 0&&(a.boundingBox=new je().fromJSON(t.boundingBox));break;case"LOD":a=new Zm;break;case"Line":a=new Fn(o(t.geometry),l(t.material));break;case"LineLoop":a=new jm(o(t.geometry),l(t.material));break;case"LineSegments":a=new vn(o(t.geometry),l(t.material));break;case"PointCloud":case"Points":a=new tg(o(t.geometry),l(t.material));break;case"Sprite":a=new gd(l(t.material));break;case"Group":a=new Ln;break;case"Bone":a=new xd;break;default:a=new he}if(a.uuid=t.uuid,t.name!==void 0&&(a.name=t.name),t.matrix!==void 0?(a.matrix.fromArray(t.matrix),t.matrixAutoUpdate!==void 0&&(a.matrixAutoUpdate=t.matrixAutoUpdate),a.matrixAutoUpdate&&a.matrix.decompose(a.position,a.quaternion,a.scale)):(t.position!==void 0&&a.position.fromArray(t.position),t.rotation!==void 0&&a.rotation.fromArray(t.rotation),t.quaternion!==void 0&&a.quaternion.fromArray(t.quaternion),t.scale!==void 0&&a.scale.fromArray(t.scale)),t.up!==void 0&&a.up.fromArray(t.up),t.pivot!==void 0&&(a.pivot=new C().fromArray(t.pivot)),t.morphTargetDictionary!==void 0&&(a.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),t.morphTargetInfluences!==void 0&&(a.morphTargetInfluences=t.morphTargetInfluences.slice()),t.castShadow!==void 0&&(a.castShadow=t.castShadow),t.receiveShadow!==void 0&&(a.receiveShadow=t.receiveShadow),t.shadow&&(t.shadow.intensity!==void 0&&(a.shadow.intensity=t.shadow.intensity),t.shadow.bias!==void 0&&(a.shadow.bias=t.shadow.bias),t.shadow.normalBias!==void 0&&(a.shadow.normalBias=t.shadow.normalBias),t.shadow.radius!==void 0&&(a.shadow.radius=t.shadow.radius),t.shadow.blurSamples!==void 0&&(a.shadow.blurSamples=t.shadow.blurSamples),t.shadow.focus!==void 0&&(a.shadow.focus=t.shadow.focus),t.shadow.aspect!==void 0&&(a.shadow.aspect=t.shadow.aspect),t.shadow.mapSize!==void 0&&a.shadow.mapSize.fromArray(t.shadow.mapSize),t.shadow.camera!==void 0&&(a.shadow.camera=this.parseObject(t.shadow.camera))),t.visible!==void 0&&(a.visible=t.visible),t.frustumCulled!==void 0&&(a.frustumCulled=t.frustumCulled),t.renderOrder!==void 0&&(a.renderOrder=t.renderOrder),t.static!==void 0&&(a.static=t.static),t.userData!==void 0&&(a.userData=t.userData),t.layers!==void 0&&(a.layers.mask=t.layers),t.children!==void 0){const u=t.children;for(let f=0;f<u.length;f++)a.add(this.parseObject(u[f],e,i,n,s))}if(t.animations!==void 0){const u=t.animations;for(let f=0;f<u.length;f++){const p=u[f];a.animations.push(s[p])}}if(t.type==="LOD"){t.autoUpdate!==void 0&&(a.autoUpdate=t.autoUpdate);const u=t.levels;for(let f=0;f<u.length;f++){const p=u[f],x=a.getObjectByProperty("uuid",p.object);x!==void 0&&a.addLevel(x,p.distance,p.hysteresis)}}return a}bindSkeletons(t,e){Object.keys(e).length!==0&&t.traverse(function(i){if(i.isSkinnedMesh===!0&&i.skeleton!==void 0){const n=e[i.skeleton];n===void 0?dt("ObjectLoader: No skeleton found with UUID:",i.skeleton):i.bind(n,i.bindMatrix)}})}bindLightTargets(t){t.traverse(function(e){if(e.isDirectionalLight||e.isSpotLight){const i=e.target,n=t.getObjectByProperty("uuid",i);n!==void 0?e.target=n:e.target=new he}})}}const Ty={UVMapping:Uc,CubeReflectionMapping:xn,CubeRefractionMapping:rs,EquirectangularReflectionMapping:ya,EquirectangularRefractionMapping:va,CubeUVReflectionMapping:Xr},sp={RepeatWrapping:Pr,ClampToEdgeWrapping:Ei,MirroredRepeatWrapping:Ia},rp={NearestFilter:Fe,NearestMipmapNearestFilter:nd,NearestMipmapLinearFilter:xr,LinearFilter:Ce,LinearMipmapNearestFilter:Sa,LinearMipmapLinearFilter:un},nu=new WeakMap;class Ey extends Ci{constructor(t){super(t),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&dt("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&dt("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(t){return this.options=t,this}load(t,e,i,n){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const s=this,a=dn.get(`image-bitmap:${t}`);if(a!==void 0){if(s.manager.itemStart(t),a.then){a.then(c=>{nu.has(a)===!0?(n&&n(nu.get(a)),s.manager.itemError(t),s.manager.itemEnd(t)):(e&&e(c),s.manager.itemEnd(t))});return}setTimeout(function(){e&&e(a),s.manager.itemEnd(t)},0);return}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(t,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},s.options,{colorSpaceConversion:"none"}))}).then(function(c){return dn.add(`image-bitmap:${t}`,c),e&&e(c),s.manager.itemEnd(t),c}).catch(function(c){n&&n(c),nu.set(l,c),dn.remove(`image-bitmap:${t}`),s.manager.itemError(t),s.manager.itemEnd(t)});dn.add(`image-bitmap:${t}`,l),s.manager.itemStart(t)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}let ml;class Fd{static getContext(){return ml===void 0&&(ml=new(window.AudioContext||window.webkitAudioContext)),ml}static setContext(t){ml=t}}class Ay extends Ci{constructor(t){super(t)}load(t,e,i,n){const s=this,a=new Bn(this.manager);a.setResponseType("arraybuffer"),a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(t,function(l){try{const c=l.slice(0),h=Fd.getContext(),d=t+"#decode";s.manager.itemStart(d),h.decodeAudioData(c,function(u){e(u),s.manager.itemEnd(d)}).catch(function(u){o(u),s.manager.itemEnd(d)})}catch(c){o(c)}},i,n);function o(l){n?n(l):Ot(l),s.manager.itemError(t)}}}const ap=new $t,op=new $t,Ms=new $t;class Cy{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new Ze,this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new Ze,this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null}}update(t){const e=this._cache;if(e.focus!==t.focus||e.fov!==t.fov||e.aspect!==t.aspect*this.aspect||e.near!==t.near||e.far!==t.far||e.zoom!==t.zoom||e.eyeSep!==this.eyeSep){e.focus=t.focus,e.fov=t.fov,e.aspect=t.aspect*this.aspect,e.near=t.near,e.far=t.far,e.zoom=t.zoom,e.eyeSep=this.eyeSep,Ms.copy(t.projectionMatrix);const n=e.eyeSep/2,s=n*e.near/e.focus,a=e.near*Math.tan(Ls*e.fov*.5)/e.zoom;let o,l;op.elements[12]=-n,ap.elements[12]=n,o=-a*e.aspect+s,l=a*e.aspect+s,Ms.elements[0]=2*e.near/(l-o),Ms.elements[8]=(l+o)/(l-o),this.cameraL.projectionMatrix.copy(Ms),o=-a*e.aspect-s,l=a*e.aspect-s,Ms.elements[0]=2*e.near/(l-o),Ms.elements[8]=(l+o)/(l-o),this.cameraR.projectionMatrix.copy(Ms)}this.cameraL.matrix.copy(t.matrixWorld).multiply(op),this.cameraL.matrixWorldNeedsUpdate=!0,this.cameraR.matrix.copy(t.matrixWorld).multiply(ap),this.cameraR.matrixWorldNeedsUpdate=!0}}const hr=-90,ur=1;class Og extends he{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const n=new Ze(hr,ur,t,e);n.layers=this.layers,this.add(n);const s=new Ze(hr,ur,t,e);s.layers=this.layers,this.add(s);const a=new Ze(hr,ur,t,e);a.layers=this.layers,this.add(a);const o=new Ze(hr,ur,t,e);o.layers=this.layers,this.add(o);const l=new Ze(hr,ur,t,e);l.layers=this.layers,this.add(l);const c=new Ze(hr,ur,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,n,s,a,o,l]=e;for(const c of e)this.remove(c);if(t===Ui)i.up.set(0,1,0),i.lookAt(1,0,0),n.up.set(0,1,0),n.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Os)i.up.set(0,-1,0),i.lookAt(-1,0,0),n.up.set(0,-1,0),n.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:n}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(i,0,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,s),t.setRenderTarget(i,1,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(i,2,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(i,3,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(i,4,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),i.texture.generateMipmaps=x,t.setRenderTarget(i,5,n),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=p,i.texture.needsPMREMUpdate=!0}}class Fg extends Ze{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}class Bd{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=Ry.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function Ry(){this._document.hidden===!1&&this.reset()}const bs=new C,su=new yi,Py=new C,ws=new C,Ts=new C;class Iy extends he{constructor(){super(),this.type="AudioListener",this.context=Fd.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._timer=new Bd}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(t){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=t,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(t){return this.gain.gain.setTargetAtTime(t,this.context.currentTime,.01),this}updateMatrixWorld(t){super.updateMatrixWorld(t),this._timer.update();const e=this.context.listener;if(this.timeDelta=this._timer.getDelta(),this.matrixWorld.decompose(bs,su,Py),ws.set(0,0,-1).applyQuaternion(su),Ts.set(0,1,0).applyQuaternion(su),e.positionX){const i=this.context.currentTime+this.timeDelta;e.positionX.linearRampToValueAtTime(bs.x,i),e.positionY.linearRampToValueAtTime(bs.y,i),e.positionZ.linearRampToValueAtTime(bs.z,i),e.forwardX.linearRampToValueAtTime(ws.x,i),e.forwardY.linearRampToValueAtTime(ws.y,i),e.forwardZ.linearRampToValueAtTime(ws.z,i),e.upX.linearRampToValueAtTime(Ts.x,i),e.upY.linearRampToValueAtTime(Ts.y,i),e.upZ.linearRampToValueAtTime(Ts.z,i)}else e.setPosition(bs.x,bs.y,bs.z),e.setOrientation(ws.x,ws.y,ws.z,Ts.x,Ts.y,Ts.z)}}class Bg extends he{constructor(t){super(),this.type="Audio",this.listener=t,this.context=t.context,this.gain=this.context.createGain(),this.gain.connect(t.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(t){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=t,this.connect(),this}setMediaElementSource(t){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(t),this.connect(),this}setMediaStreamSource(t){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(t),this.connect(),this}setBuffer(t){return this.buffer=t,this.sourceType="buffer",this.autoplay&&this.play(),this}play(t=0){if(this.isPlaying===!0){dt("Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){dt("Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+t;const e=this.context.createBufferSource();return e.buffer=this.buffer,e.loop=this.loop,e.loopStart=this.loopStart,e.loopEnd=this.loopEnd,e.onended=this.onEnded.bind(this),e.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=e,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){dt("Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(t=0){if(this.hasPlaybackControl===!1){dt("Audio: this Audio has no playback control.");return}return this._progress=0,this.source!==null&&(this.source.stop(this.context.currentTime+t),this.source.onended=null),this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let t=1,e=this.filters.length;t<e;t++)this.filters[t-1].connect(this.filters[t]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this._connected!==!1){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let t=1,e=this.filters.length;t<e;t++)this.filters[t-1].disconnect(this.filters[t]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}}getFilters(){return this.filters}setFilters(t){return t||(t=[]),this._connected===!0?(this.disconnect(),this.filters=t.slice(),this.connect()):this.filters=t.slice(),this}setDetune(t){return this.detune=t,this.isPlaying===!0&&this.source.detune!==void 0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(t){return this.setFilters(t?[t]:[])}setPlaybackRate(t){if(this.hasPlaybackControl===!1){dt("Audio: this Audio has no playback control.");return}return this.playbackRate=t,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1,this._progress=0}getLoop(){return this.hasPlaybackControl===!1?(dt("Audio: this Audio has no playback control."),!1):this.loop}setLoop(t){if(this.hasPlaybackControl===!1){dt("Audio: this Audio has no playback control.");return}return this.loop=t,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(t){return this.loopStart=t,this}setLoopEnd(t){return this.loopEnd=t,this}getVolume(){return this.gain.gain.value}setVolume(t){return this.gain.gain.setTargetAtTime(t,this.context.currentTime,.01),this}copy(t,e){return super.copy(t,e),t.sourceType!=="buffer"?(dt("Audio: Audio source type cannot be copied."),this):(this.autoplay=t.autoplay,this.buffer=t.buffer,this.detune=t.detune,this.loop=t.loop,this.loopStart=t.loopStart,this.loopEnd=t.loopEnd,this.offset=t.offset,this.duration=t.duration,this.playbackRate=t.playbackRate,this.hasPlaybackControl=t.hasPlaybackControl,this.sourceType=t.sourceType,this.filters=t.filters.slice(),this)}clone(t){return new this.constructor(this.listener).copy(this,t)}}const Es=new C,lp=new yi,Ly=new C,As=new C;class Ny extends Bg{constructor(t){super(t),this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain)}connect(){return super.connect(),this.panner.connect(this.gain),this}disconnect(){return super.disconnect(),this.panner.disconnect(this.gain),this}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(t){return this.panner.refDistance=t,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(t){return this.panner.rolloffFactor=t,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(t){return this.panner.distanceModel=t,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(t){return this.panner.maxDistance=t,this}setDirectionalCone(t,e,i){return this.panner.coneInnerAngle=t,this.panner.coneOuterAngle=e,this.panner.coneOuterGain=i,this}updateMatrixWorld(t){if(super.updateMatrixWorld(t),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(Es,lp,Ly),As.set(0,0,1).applyQuaternion(lp);const e=this.panner;if(e.positionX){const i=this.context.currentTime+this.listener.timeDelta;e.positionX.linearRampToValueAtTime(Es.x,i),e.positionY.linearRampToValueAtTime(Es.y,i),e.positionZ.linearRampToValueAtTime(Es.z,i),e.orientationX.linearRampToValueAtTime(As.x,i),e.orientationY.linearRampToValueAtTime(As.y,i),e.orientationZ.linearRampToValueAtTime(As.z,i)}else e.setPosition(Es.x,Es.y,Es.z),e.setOrientation(As.x,As.y,As.z)}}class Uy{constructor(t,e=2048){this.analyser=t.context.createAnalyser(),this.analyser.fftSize=e,this.data=new Uint8Array(this.analyser.frequencyBinCount),t.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let t=0;const e=this.getFrequencyData();for(let i=0;i<e.length;i++)t+=e[i];return t/e.length}}class zg{constructor(t,e,i){this.binding=t,this.valueSize=i;let n,s,a;switch(e){case"quaternion":n=this._slerp,s=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(i*6),this._workIndex=5;break;case"string":case"bool":n=this._select,s=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(i*5);break;default:n=this._lerp,s=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(i*5)}this._mixBufferRegion=n,this._mixBufferRegionAdditive=s,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(t,e){const i=this.buffer,n=this.valueSize,s=t*n+n;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==n;++o)i[s+o]=i[o];a=e}else{a+=e;const o=e/a;this._mixBufferRegion(i,s,0,o,n)}this.cumulativeWeight=a}accumulateAdditive(t){const e=this.buffer,i=this.valueSize,n=i*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(e,n,0,t,i),this.cumulativeWeightAdditive+=t}apply(t){const e=this.valueSize,i=this.buffer,n=t*e+e,s=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){const l=e*this._origIndex;this._mixBufferRegion(i,n,l,1-s,e)}a>0&&this._mixBufferRegionAdditive(i,n,this._addIndex*e,1,e);for(let l=e,c=e+e;l!==c;++l)if(i[l]!==i[l+e]){o.setValue(i,n);break}}saveOriginalState(){const t=this.binding,e=this.buffer,i=this.valueSize,n=i*this._origIndex;t.getValue(e,n);for(let s=i,a=n;s!==a;++s)e[s]=e[n+s%i];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const t=this.valueSize*3;this.binding.setValue(this.buffer,t)}_setAdditiveIdentityNumeric(){const t=this._addIndex*this.valueSize,e=t+this.valueSize;for(let i=t;i<e;i++)this.buffer[i]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const t=this._origIndex*this.valueSize,e=this._addIndex*this.valueSize;for(let i=0;i<this.valueSize;i++)this.buffer[e+i]=this.buffer[t+i]}_select(t,e,i,n,s){if(n>=.5)for(let a=0;a!==s;++a)t[e+a]=t[i+a]}_slerp(t,e,i,n){yi.slerpFlat(t,e,t,e,t,i,n)}_slerpAdditive(t,e,i,n,s){const a=this._workIndex*s;yi.multiplyQuaternionsFlat(t,a,t,e,t,i),yi.slerpFlat(t,e,t,e,t,a,n)}_lerp(t,e,i,n,s){const a=1-n;for(let o=0;o!==s;++o){const l=e+o;t[l]=t[l]*a+t[i+o]*n}}_lerpAdditive(t,e,i,n,s){for(let a=0;a!==s;++a){const o=e+a;t[o]=t[o]+t[i+a]*n}}}const zd="\\[\\]\\.:\\/",Dy=new RegExp("["+zd+"]","g"),Vd="[^"+zd+"]",Oy="[^"+zd.replace("\\.","")+"]",Fy=/((?:WC+[\/:])*)/.source.replace("WC",Vd),By=/(WCOD+)?/.source.replace("WCOD",Oy),zy=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Vd),Vy=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Vd),ky=new RegExp("^"+Fy+By+zy+Vy+"$"),Gy=["material","materials","bones","map"];class Hy{constructor(t,e,i){const n=i||me.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,n)}getValue(t,e){this.bind();const i=this._targetGroup.nCachedObjects_,n=this._bindings[i];n!==void 0&&n.getValue(t,e)}setValue(t,e){const i=this._bindings;for(let n=this._targetGroup.nCachedObjects_,s=i.length;n!==s;++n)i[n].setValue(t,e)}bind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind()}unbind(){const t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind()}}class me{constructor(t,e,i){this.path=e,this.parsedPath=i||me.parseTrackName(e),this.node=me.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,i){return t&&t.isAnimationObjectGroup?new me.Composite(t,e,i):new me(t,e,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Dy,"")}static parseTrackName(t){const e=ky.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);const i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},n=i.nodeName&&i.nodeName.lastIndexOf(".");if(n!==void 0&&n!==-1){const s=i.nodeName.substring(n+1);Gy.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,n),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){const i=t.skeleton.getBoneByName(e);if(i!==void 0)return i}if(t.children){const i=function(s){for(let a=0;a<s.length;a++){const o=s[a];if(o.name===e||o.uuid===e)return o;const l=i(o.children);if(l)return l}return null},n=i(t.children);if(n)return n}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){const i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)t[e++]=i[n]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){const i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=t[e++]}_setValue_array_setNeedsUpdate(t,e){const i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){const i=this.resolvedProperty;for(let n=0,s=i.length;n!==s;++n)i[n]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node;const e=this.parsedPath,i=e.objectName,n=e.propertyName;let s=e.propertyIndex;if(t||(t=me.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){dt("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=e.objectIndex;switch(i){case"materials":if(!t.material){Ot("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Ot("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Ot("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Ot("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Ot("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){Ot("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(c!==void 0){if(t[c]===void 0){Ot("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}const a=t[n];if(a===void 0){const c=e.nodeName;Ot("PropertyBinding: Trying to update property for track: "+c+"."+n+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(n==="morphTargetInfluences"){if(!t.geometry){Ot("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Ot("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[s]!==void 0&&(s=t.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=n;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}me.Composite=Hy;me.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};me.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};me.prototype.GetterByBindingType=[me.prototype._getValue_direct,me.prototype._getValue_array,me.prototype._getValue_arrayElement,me.prototype._getValue_toArray];me.prototype.SetterByBindingTypeAndVersioning=[[me.prototype._setValue_direct,me.prototype._setValue_direct_setNeedsUpdate,me.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[me.prototype._setValue_array,me.prototype._setValue_array_setNeedsUpdate,me.prototype._setValue_array_setMatrixWorldNeedsUpdate],[me.prototype._setValue_arrayElement,me.prototype._setValue_arrayElement_setNeedsUpdate,me.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[me.prototype._setValue_fromArray,me.prototype._setValue_fromArray_setNeedsUpdate,me.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class Wy{constructor(){this.isAnimationObjectGroup=!0,this.uuid=Di(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;const t={};this._indicesByUUID=t;for(let i=0,n=arguments.length;i!==n;++i)t[arguments[i].uuid]=i;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};const e=this;this.stats={objects:{get total(){return e._objects.length},get inUse(){return this.total-e.nCachedObjects_}},get bindingsPerObject(){return e._bindings.length}}}add(){const t=this._objects,e=this._indicesByUUID,i=this._paths,n=this._parsedPaths,s=this._bindings,a=s.length;let o,l=t.length,c=this.nCachedObjects_;for(let h=0,d=arguments.length;h!==d;++h){const u=arguments[h],f=u.uuid;let p=e[f];if(p===void 0){p=l++,e[f]=p,t.push(u);for(let x=0,m=a;x!==m;++x)s[x].push(new me(u,i[x],n[x]))}else if(p<c){o=t[p];const x=--c,m=t[x];e[m.uuid]=p,t[p]=m,e[f]=x,t[x]=u;for(let g=0,v=a;g!==v;++g){const w=s[g],_=w[x];let b=w[p];w[p]=_,b===void 0&&(b=new me(u,i[g],n[g])),w[x]=b}}else t[p]!==o&&Ot("AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")}this.nCachedObjects_=c}remove(){const t=this._objects,e=this._indicesByUUID,i=this._bindings,n=i.length;let s=this.nCachedObjects_;for(let a=0,o=arguments.length;a!==o;++a){const l=arguments[a],c=l.uuid,h=e[c];if(h!==void 0&&h>=s){const d=s++,u=t[d];e[u.uuid]=h,t[h]=u,e[c]=d,t[d]=l;for(let f=0,p=n;f!==p;++f){const x=i[f],m=x[d],g=x[h];x[h]=m,x[d]=g}}}this.nCachedObjects_=s}uncache(){const t=this._objects,e=this._indicesByUUID,i=this._bindings,n=i.length;let s=this.nCachedObjects_,a=t.length;for(let o=0,l=arguments.length;o!==l;++o){const c=arguments[o],h=c.uuid,d=e[h];if(d!==void 0)if(delete e[h],d<s){const u=--s,f=t[u],p=--a,x=t[p];d!==u&&(e[f.uuid]=d),t[d]=f,u!==p&&(e[x.uuid]=u),t[u]=x,t.pop();for(let m=0,g=n;m!==g;++m){const v=i[m],w=v[u],_=v[p];v[d]=w,v[u]=_,v.pop()}}else{const u=--a,f=t[u];d!==u&&(e[f.uuid]=d),t[d]=f,t.pop();for(let p=0,x=n;p!==x;++p){const m=i[p];m[d]=m[u],m.pop()}}}this.nCachedObjects_=s}subscribe_(t,e){const i=this._bindingsIndicesByPath;let n=i[t];const s=this._bindings;if(n!==void 0)return s[n];const a=this._paths,o=this._parsedPaths,l=this._objects,c=l.length,h=this.nCachedObjects_,d=new Array(c);n=s.length,i[t]=n,a.push(t),o.push(e),s.push(d);for(let u=h,f=l.length;u!==f;++u){const p=l[u];d[u]=new me(p,t,e)}return d}unsubscribe_(t){const e=this._bindingsIndicesByPath,i=e[t];if(i!==void 0){const n=this._paths,s=this._parsedPaths,a=this._bindings,o=a.length-1,l=a[o],c=n[o];e[c]=i,a[i]=l,a.pop(),s[i]=s[o],s.pop(),n[i]=n[o],n.pop()}}}class Vg{constructor(t,e,i=null,n=e.blendMode){this._mixer=t,this._clip=e,this._localRoot=i,this.blendMode=n;const s=e.tracks,a=s.length,o=new Array(a),l={endingStart:Ps,endingEnd:Ps};for(let c=0;c!==a;++c){const h=s[c].createInterpolant(null);o[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=Im,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(t){return this._startTime=t,this}setLoop(t,e){return this.loop=t,this.repetitions=e,this}setEffectiveWeight(t){return this.weight=t,this._effectiveWeight=this.enabled?t:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(t){return this._scheduleFading(t,0,1)}fadeOut(t){return this._scheduleFading(t,1,0)}crossFadeFrom(t,e,i=!1){if(t.fadeOut(e),this.fadeIn(e),i===!0){const n=this._clip.duration,s=t._clip.duration,a=s/n,o=n/s;t._restoreTimeScale=t.timeScale,this._restoreTimeScale=this.timeScale,t.warp(1,a,e),this.warp(o,1,e)}return this}crossFadeTo(t,e,i=!1){return t.crossFadeFrom(this,e,i)}stopFading(){const t=this._weightInterpolant;return t!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}setEffectiveTimeScale(t){return this.timeScale=t,this._effectiveTimeScale=this.paused?0:t,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(t){return this.timeScale=this._clip.duration/t,this.stopWarping()}syncWith(t){return this.time=t.time,this.timeScale=t.timeScale,this.stopWarping()}halt(t){return this.warp(this._effectiveTimeScale,0,t)}warp(t,e,i){const n=this._mixer,s=n.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=n._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=s,l[1]=s+i,c[0]=t/a,c[1]=e/a,this}stopWarping(){const t=this._timeScaleInterpolant;return t!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(t,e,i,n){if(!this.enabled){this._updateWeight(t);return}const s=this._startTime;if(s!==null){const l=(t-s)*i;l<0||i===0?e=0:(this._startTime=null,e=i*l)}e*=this._updateTimeScale(t);const a=this._updateTime(e),o=this._updateWeight(t);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case hd:for(let h=0,d=l.length;h!==d;++h)l[h].evaluate(a),c[h].accumulateAdditive(o);break;case kc:default:for(let h=0,d=l.length;h!==d;++h)l[h].evaluate(a),c[h].accumulate(n,o)}}}_updateWeight(t){let e=0;if(this.enabled){e=this.weight;const i=this._weightInterpolant;if(i!==null){const n=i.evaluate(t)[0];e*=n,t>i.parameterPositions[1]&&(this.stopFading(),n===0&&(this.enabled=!1))}}return this._effectiveWeight=e,e}_updateTimeScale(t){let e=0;if(!this.paused){e=this.timeScale;const i=this._timeScaleInterpolant;if(i!==null){const n=i.evaluate(t)[0];e*=n,t>i.parameterPositions[1]&&(e===0?this.paused=!0:(this._restoreTimeScale!==null&&(e=this._restoreTimeScale),this.timeScale=e),this.stopWarping())}}return this._effectiveTimeScale=e,e}_updateTime(t){const e=this._clip.duration,i=this.loop;let n=this.time+t,s=this._loopCount;const a=i===Lm;if(t===0)return s===-1?n:a&&(s&1)===1?e-n:n;if(i===Pm){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));t:{if(n>=e)n=e;else if(n<0)n=0;else{this.time=n;break t}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=n,this._mixer.dispatchEvent({type:"finished",action:this,direction:t<0?-1:1})}}else{if(s===-1&&(t>=0?(s=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),n>=e||n<0){const o=Math.floor(n/e);n-=e*o,s+=Math.abs(o);const l=this.repetitions-s;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,n=t>0?e:0,this.time=n,this._mixer.dispatchEvent({type:"finished",action:this,direction:t>0?1:-1});else{if(l===1){const c=t<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=s,this.time=n,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=s,this.time=n;if(a&&(s&1)===1)return e-n}return n}_setEndings(t,e,i){const n=this._interpolantSettings;i?(n.endingStart=Is,n.endingEnd=Is):(t?n.endingStart=this.zeroSlopeAtStart?Is:Ps:n.endingStart=Da,e?n.endingEnd=this.zeroSlopeAtEnd?Is:Ps:n.endingEnd=Da)}_scheduleFading(t,e,i){const n=this._mixer,s=n.time;let a=this._weightInterpolant;a===null&&(a=n._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=s,l[0]=e,o[1]=s+t,l[1]=i,this}}const Xy=new Float32Array(1);class qy extends tn{constructor(t){super(),this._root=t,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(t,e){const i=t._localRoot||this._root,n=t._clip.tracks,s=n.length,a=t._propertyBindings,o=t._interpolants,l=i.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let d=0;d!==s;++d){const u=n[d],f=u.name;let p=h[f];if(p!==void 0)++p.referenceCount,a[d]=p;else{if(p=a[d],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,l,f));continue}const x=e&&e._propertyBindings[d].binding.parsedPath;p=new zg(me.create(i,f,x),u.ValueTypeName,u.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,l,f),a[d]=p}o[d].resultBuffer=p.buffer}}_activateAction(t){if(!this._isActiveAction(t)){if(t._cacheIndex===null){const i=(t._localRoot||this._root).uuid,n=t._clip.uuid,s=this._actionsByClip[n];this._bindAction(t,s&&s.knownActions[0]),this._addInactiveAction(t,n,i)}const e=t._propertyBindings;for(let i=0,n=e.length;i!==n;++i){const s=e[i];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(t)}}_deactivateAction(t){if(this._isActiveAction(t)){const e=t._propertyBindings;for(let i=0,n=e.length;i!==n;++i){const s=e[i];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(t)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const t=this;this.stats={actions:{get total(){return t._actions.length},get inUse(){return t._nActiveActions}},bindings:{get total(){return t._bindings.length},get inUse(){return t._nActiveBindings}},controlInterpolants:{get total(){return t._controlInterpolants.length},get inUse(){return t._nActiveControlInterpolants}}}}_isActiveAction(t){const e=t._cacheIndex;return e!==null&&e<this._nActiveActions}_addInactiveAction(t,e,i){const n=this._actions,s=this._actionsByClip;let a=s[e];if(a===void 0)a={knownActions:[t],actionByRoot:{}},t._byClipCacheIndex=0,s[e]=a;else{const o=a.knownActions;t._byClipCacheIndex=o.length,o.push(t)}t._cacheIndex=n.length,n.push(t),a.actionByRoot[i]=t}_removeInactiveAction(t){const e=this._actions,i=e[e.length-1],n=t._cacheIndex;i._cacheIndex=n,e[n]=i,e.pop(),t._cacheIndex=null;const s=t._clip.uuid,a=this._actionsByClip,o=a[s],l=o.knownActions,c=l[l.length-1],h=t._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),t._byClipCacheIndex=null;const d=o.actionByRoot,u=(t._localRoot||this._root).uuid;delete d[u],l.length===0&&delete a[s],this._removeInactiveBindingsForAction(t)}_removeInactiveBindingsForAction(t){const e=t._propertyBindings;for(let i=0,n=e.length;i!==n;++i){const s=e[i];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(t){const e=this._actions,i=t._cacheIndex,n=this._nActiveActions++,s=e[n];t._cacheIndex=n,e[n]=t,s._cacheIndex=i,e[i]=s}_takeBackAction(t){const e=this._actions,i=t._cacheIndex,n=--this._nActiveActions,s=e[n];t._cacheIndex=n,e[n]=t,s._cacheIndex=i,e[i]=s}_addInactiveBinding(t,e,i){const n=this._bindingsByRootAndName,s=this._bindings;let a=n[e];a===void 0&&(a={},n[e]=a),a[i]=t,t._cacheIndex=s.length,s.push(t)}_removeInactiveBinding(t){const e=this._bindings,i=t.binding,n=i.rootNode.uuid,s=i.path,a=this._bindingsByRootAndName,o=a[n],l=e[e.length-1],c=t._cacheIndex;l._cacheIndex=c,e[c]=l,e.pop(),delete o[s],Object.keys(o).length===0&&delete a[n]}_lendBinding(t){const e=this._bindings,i=t._cacheIndex,n=this._nActiveBindings++,s=e[n];t._cacheIndex=n,e[n]=t,s._cacheIndex=i,e[i]=s}_takeBackBinding(t){const e=this._bindings,i=t._cacheIndex,n=--this._nActiveBindings,s=e[n];t._cacheIndex=n,e[n]=t,s._cacheIndex=i,e[i]=s}_lendControlInterpolant(){const t=this._controlInterpolants,e=this._nActiveControlInterpolants++;let i=t[e];return i===void 0&&(i=new Pd(new Float32Array(2),new Float32Array(2),1,Xy),i.__cacheIndex=e,t[e]=i),i}_takeBackControlInterpolant(t){const e=this._controlInterpolants,i=t.__cacheIndex,n=--this._nActiveControlInterpolants,s=e[n];t.__cacheIndex=n,e[n]=t,s.__cacheIndex=i,e[i]=s}clipAction(t,e,i){const n=e||this._root,s=n.uuid;let a=typeof t=="string"?Wa.findByName(n,t):t;const o=a!==null?a.uuid:t,l=this._actionsByClip[o];let c=null;if(i===void 0&&(a!==null?i=a.blendMode:i=kc),l!==void 0){const d=l.actionByRoot[s];if(d!==void 0&&d.blendMode===i)return d;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const h=new Vg(this,a,e,i);return this._bindAction(h,c),this._addInactiveAction(h,o,s),h}existingAction(t,e){const i=e||this._root,n=i.uuid,s=typeof t=="string"?Wa.findByName(i,t):t,a=s?s.uuid:t,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[n]||null}stopAllAction(){const t=this._actions,e=this._nActiveActions;for(let i=e-1;i>=0;--i)t[i].stop();return this}update(t){t*=this.timeScale;const e=this._actions,i=this._nActiveActions,n=this.time+=t,s=Math.sign(t),a=this._accuIndex^=1;for(let c=0;c!==i;++c)e[c]._update(n,t,s,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(t){this.time=0;for(let e=0;e<this._actions.length;e++)this._actions[e].time=0;return this.update(t)}getRoot(){return this._root}uncacheClip(t){const e=this._actions,i=t.uuid,n=this._actionsByClip,s=n[i];if(s!==void 0){const a=s.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const h=c._cacheIndex,d=e[e.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,d._cacheIndex=h,e[h]=d,e.pop(),this._removeInactiveBindingsForAction(c)}delete n[i]}}uncacheRoot(t){const e=t.uuid,i=this._actionsByClip;for(const a in i){const o=i[a].actionByRoot,l=o[e];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const n=this._bindingsByRootAndName,s=n[e];if(s!==void 0)for(const a in s){const o=s[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(t,e){const i=this.existingAction(t,e);i!==null&&(this._deactivateAction(i),this._removeInactiveAction(i))}}class Jy extends dd{constructor(t=1,e=1,i=1,n={}){super(t,e,n),this.isRenderTarget3D=!0,this.depth=i;for(let s=0;s<this.textures.length;s++){const a=new qc(null,t,e,i);a.isRenderTargetTexture=!0,a.renderTarget=this,this.textures[s]=a}this._setTextureOptions(n)}}class bi{constructor(t){this.value=t}clone(){return new bi(this.value.clone===void 0?this.value:this.value.clone())}}let Yy=0;class Zy extends tn{constructor(){super(),this.isUniformsGroup=!0,Object.defineProperty(this,"id",{value:Yy++}),this.name="",this.usage=Wc,this.uniforms=[]}add(t){return this.uniforms.push(t),this}remove(t){const e=this.uniforms.indexOf(t);return e!==-1&&this.uniforms.splice(e,1),this}setName(t){return this.name=t,this}setUsage(t){return this.usage=t,this}dispose(){this.dispatchEvent({type:"dispose"})}copy(t){this.name=t.name,this.usage=t.usage;const e=t.uniforms;this.uniforms.length=0;for(let i=0,n=e.length;i<n;i++){const s=Array.isArray(e[i])?e[i]:[e[i]];for(let a=0;a<s.length;a++)this.uniforms.push(s[a].clone())}return this}clone(){return new this.constructor().copy(this)}}class $y extends Yc{constructor(t,e,i=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){const e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){const e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}}class Ky{constructor(t,e,i,n,s,a=!1){this.isGLBufferAttribute=!0,this.name="",this.buffer=t,this.type=e,this.itemSize=i,this.elementSize=n,this.count=s,this.normalized=a,this.version=0}set needsUpdate(t){t===!0&&this.version++}setBuffer(t){return this.buffer=t,this}setType(t,e){return this.type=t,this.elementSize=e,this}setItemSize(t){return this.itemSize=t,this}setCount(t){return this.count=t,this}}const cp=new $t;class kg{constructor(t,e,i=0,n=1/0){this.ray=new qr(t,e),this.near=i,this.far=n,this.camera=null,this.layers=new is,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):Ot("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return cp.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(cp),this}intersectObject(t,e=!0,i=[]){return Fu(t,this,i,e),i.sort(hp),i}intersectObjects(t,e=!0,i=[]){for(let n=0,s=t.length;n<s;n++)Fu(t[n],this,i,e);return i.sort(hp),i}}function hp(r,t){return r.distance-t.distance}function Fu(r,t,e,i){let n=!0;if(r.layers.test(t.layers)&&r.raycast(t,e)===!1&&(n=!1),n===!0&&i===!0){const s=r.children;for(let a=0,o=s.length;a<o;a++)Fu(s[a],t,e,!0)}}class Qy{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,dt("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}class jy{constructor(t=1,e=0,i=0){this.radius=t,this.phi=e,this.theta=i}set(t,e,i){return this.radius=t,this.phi=e,this.theta=i,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Jt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+e*e+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,i),this.phi=Math.acos(Jt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class tv{constructor(t=1,e=0,i=0){this.radius=t,this.theta=e,this.y=i}set(t,e,i){return this.radius=t,this.theta=e,this.y=i,this}copy(t){return this.radius=t.radius,this.theta=t.theta,this.y=t.y,this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,i){return this.radius=Math.sqrt(t*t+i*i),this.theta=Math.atan2(t,i),this.y=e,this}clone(){return new this.constructor().copy(this)}}const $d=class $d{constructor(t,e,i,n){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,i,n)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let i=0;i<4;i++)this.elements[i]=t[i+e];return this}set(t,e,i,n){const s=this.elements;return s[0]=t,s[2]=e,s[1]=i,s[3]=n,this}};$d.prototype.isMatrix2=!0;let Bu=$d;const up=new st;class Gg{constructor(t=new st(1/0,1/0),e=new st(-1/0,-1/0)){this.isBox2=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=up.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(t){return this.isEmpty()?t.set(0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,up).distanceTo(t)}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const dp=new C,gl=new C,dr=new C,fr=new C,ru=new C,ev=new C,iv=new C;class nv{constructor(t=new C,e=new C){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){dp.subVectors(t,this.start),gl.subVectors(this.end,this.start);const i=gl.dot(gl);if(i===0)return 0;let s=gl.dot(dp)/i;return e&&(s=Jt(s,0,1)),s}closestPointToPoint(t,e,i){const n=this.closestPointToPointParameter(t,e);return this.delta(i).multiplyScalar(n).add(this.start)}distanceSqToLine3(t,e=ev,i=iv){const n=10000000000000001e-32;let s,a;const o=this.start,l=t.start,c=this.end,h=t.end;dr.subVectors(c,o),fr.subVectors(h,l),ru.subVectors(o,l);const d=dr.dot(dr),u=fr.dot(fr),f=fr.dot(ru);if(d<=n&&u<=n)return e.copy(o),i.copy(l),e.sub(i),e.dot(e);if(d<=n)s=0,a=f/u,a=Jt(a,0,1);else{const p=dr.dot(ru);if(u<=n)a=0,s=Jt(-p/d,0,1);else{const x=dr.dot(fr),m=d*u-x*x;m!==0?s=Jt((x*f-p*u)/m,0,1):s=0,a=(x*s+f)/u,a<0?(a=0,s=Jt(-p/d,0,1)):a>1&&(a=1,s=Jt((x-p)/d,0,1))}}return e.copy(o).addScaledVector(dr,s),i.copy(l).addScaledVector(fr,a),e.distanceToSquared(i)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}const fp=new C;class sv extends he{constructor(t,e){super(),this.light=t,this.matrixAutoUpdate=!1,this.color=e,this.type="SpotLightHelper";const i=new Zt,n=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let a=0,o=1,l=32;a<l;a++,o++){const c=a/l*Math.PI*2,h=o/l*Math.PI*2;n.push(Math.cos(c),Math.sin(c),1,Math.cos(h),Math.sin(h),1)}i.setAttribute("position",new Rt(n,3));const s=new ui({fog:!1,toneMapped:!1});this.cone=new vn(i,s),this.add(this.cone),this.update()}dispose(){super.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),this.parent?(this.parent.updateWorldMatrix(!0),this.matrix.copy(this.parent.matrixWorld).invert().multiply(this.light.matrixWorld)):this.matrix.copy(this.light.matrixWorld),this.matrixWorldNeedsUpdate=!0;const t=this.light.distance?this.light.distance:1e3,e=t*Math.tan(this.light.angle);this.cone.scale.set(e,e,t),fp.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(fp),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color)}}const Jn=new C,xl=new $t,au=new $t;class rv extends vn{constructor(t){const e=Hg(t),i=new Zt,n=[],s=[];for(let c=0;c<e.length;c++){const h=e[c];h.parent&&h.parent.isBone&&(n.push(0,0,0),n.push(0,0,0),s.push(0,0,0),s.push(0,0,0))}i.setAttribute("position",new Rt(n,3)),i.setAttribute("color",new Rt(s,3));const a=new ui({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(i,a),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=t,this.bones=e,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1;const o=new bt(255),l=new bt(65280);this.setColors(o,l)}updateMatrixWorld(t){const e=this.bones,i=this.geometry,n=i.getAttribute("position");au.copy(this.root.matrixWorld).invert();for(let s=0,a=0;s<e.length;s++){const o=e[s];o.parent&&o.parent.isBone&&(xl.multiplyMatrices(au,o.matrixWorld),Jn.setFromMatrixPosition(xl),n.setXYZ(a,Jn.x,Jn.y,Jn.z),xl.multiplyMatrices(au,o.parent.matrixWorld),Jn.setFromMatrixPosition(xl),n.setXYZ(a+1,Jn.x,Jn.y,Jn.z),a+=2)}i.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(t)}setColors(t,e){const n=this.geometry.getAttribute("color");for(let s=0;s<n.count;s+=2)n.setXYZ(s,t.r,t.g,t.b),n.setXYZ(s+1,e.r,e.g,e.b);return n.needsUpdate=!0,this}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}function Hg(r){const t=[];r.isBone===!0&&t.push(r);for(let e=0;e<r.children.length;e++)t.push(...Hg(r.children[e]));return t}class av extends Kt{constructor(t,e,i){const n=new hs(e,4,2),s=new He({wireframe:!0,fog:!1,toneMapped:!1});super(n,s),this.light=t,this.color=i,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update()}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}update(){this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color)}}const ov=new C,pp=new bt,mp=new bt;class lv extends he{constructor(t,e,i){super(),this.light=t,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.color=i,this.type="HemisphereLightHelper";const n=new Eo(e);n.rotateY(Math.PI*.5),this.material=new He({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);const s=n.getAttribute("position"),a=new Float32Array(s.count*3);n.setAttribute("color",new ue(a,3)),this.add(new Kt(n,this.material)),this.update()}dispose(){super.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}update(){const t=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{const e=t.geometry.getAttribute("color");pp.copy(this.light.color),mp.copy(this.light.groundColor);for(let i=0,n=e.count;i<n;i++){const s=i<n/2?pp:mp;e.setXYZ(i,s.r,s.g,s.b)}e.needsUpdate=!0}this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),t.lookAt(ov.setFromMatrixPosition(this.light.matrixWorld).negate())}}class cv extends vn{constructor(t=10,e=10,i=4473924,n=8947848){i=new bt(i),n=new bt(n);const s=e/2,a=t/e,o=t/2,l=[],c=[];for(let u=0,f=0,p=-o;u<=e;u++,p+=a){l.push(-o,0,p,o,0,p),l.push(p,0,-o,p,0,o);const x=u===s?i:n;x.toArray(c,f),f+=3,x.toArray(c,f),f+=3,x.toArray(c,f),f+=3,x.toArray(c,f),f+=3}const h=new Zt;h.setAttribute("position",new Rt(l,3)),h.setAttribute("color",new Rt(c,3));const d=new ui({vertexColors:!0,toneMapped:!1});super(h,d),this.type="GridHelper"}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}class hv extends vn{constructor(t=10,e=16,i=8,n=64,s=4473924,a=8947848){s=new bt(s),a=new bt(a);const o=[],l=[];if(e>1)for(let d=0;d<e;d++){const u=d/e*(Math.PI*2),f=Math.sin(u)*t,p=Math.cos(u)*t;o.push(0,0,0),o.push(f,0,p);const x=d&1?s:a;l.push(x.r,x.g,x.b),l.push(x.r,x.g,x.b)}for(let d=0;d<i;d++){const u=d&1?s:a,f=t-t/i*d;for(let p=0;p<n;p++){let x=p/n*(Math.PI*2),m=Math.sin(x)*f,g=Math.cos(x)*f;o.push(m,0,g),l.push(u.r,u.g,u.b),x=(p+1)/n*(Math.PI*2),m=Math.sin(x)*f,g=Math.cos(x)*f,o.push(m,0,g),l.push(u.r,u.g,u.b)}}const c=new Zt;c.setAttribute("position",new Rt(o,3)),c.setAttribute("color",new Rt(l,3));const h=new ui({vertexColors:!0,toneMapped:!1});super(c,h),this.type="PolarGridHelper"}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}const gp=new C,_l=new C,xp=new C;class uv extends he{constructor(t,e,i){super(),this.light=t,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.color=i,this.type="DirectionalLightHelper",e===void 0&&(e=1);let n=new Zt;n.setAttribute("position",new Rt([-e,e,0,e,e,0,e,-e,0,-e,-e,0,-e,e,0],3));const s=new ui({fog:!1,toneMapped:!1});this.lightPlane=new Fn(n,s),this.add(this.lightPlane),n=new Zt,n.setAttribute("position",new Rt([0,0,0,0,0,1],3)),this.targetLine=new Fn(n,s),this.add(this.targetLine),this.update()}dispose(){super.dispose(),this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){this.matrixWorldNeedsUpdate=!0,this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),gp.setFromMatrixPosition(this.light.matrixWorld),_l.setFromMatrixPosition(this.light.target.matrixWorld),xp.subVectors(_l,gp),this.lightPlane.lookAt(_l),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(_l),this.targetLine.scale.z=xp.length()}}const yl=new C,Le=new mh;class dv extends vn{constructor(t){const e=new Zt,i=new ui({color:16777215,vertexColors:!0,toneMapped:!1}),n=[],s=[],a={};o("n1","n2"),o("n2","n4"),o("n4","n3"),o("n3","n1"),o("f1","f2"),o("f2","f4"),o("f4","f3"),o("f3","f1"),o("n1","f1"),o("n2","f2"),o("n3","f3"),o("n4","f4"),o("p","n1"),o("p","n2"),o("p","n3"),o("p","n4"),o("u1","u2"),o("u2","u3"),o("u3","u1"),o("c","t"),o("p","c"),o("cn1","cn2"),o("cn3","cn4"),o("cf1","cf2"),o("cf3","cf4");function o(p,x){l(p),l(x)}function l(p){n.push(0,0,0),s.push(0,0,0),a[p]===void 0&&(a[p]=[]),a[p].push(n.length/3-1)}e.setAttribute("position",new Rt(n,3)),e.setAttribute("color",new Rt(s,3)),super(e,i),this.type="CameraHelper",this.camera=t,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=a,this.update();const c=new bt(16755200),h=new bt(16711680),d=new bt(43775),u=new bt(16777215),f=new bt(3355443);this.setColors(c,h,d,u,f)}setColors(t,e,i,n,s){const o=this.geometry.getAttribute("color");return o.setXYZ(0,t.r,t.g,t.b),o.setXYZ(1,t.r,t.g,t.b),o.setXYZ(2,t.r,t.g,t.b),o.setXYZ(3,t.r,t.g,t.b),o.setXYZ(4,t.r,t.g,t.b),o.setXYZ(5,t.r,t.g,t.b),o.setXYZ(6,t.r,t.g,t.b),o.setXYZ(7,t.r,t.g,t.b),o.setXYZ(8,t.r,t.g,t.b),o.setXYZ(9,t.r,t.g,t.b),o.setXYZ(10,t.r,t.g,t.b),o.setXYZ(11,t.r,t.g,t.b),o.setXYZ(12,t.r,t.g,t.b),o.setXYZ(13,t.r,t.g,t.b),o.setXYZ(14,t.r,t.g,t.b),o.setXYZ(15,t.r,t.g,t.b),o.setXYZ(16,t.r,t.g,t.b),o.setXYZ(17,t.r,t.g,t.b),o.setXYZ(18,t.r,t.g,t.b),o.setXYZ(19,t.r,t.g,t.b),o.setXYZ(20,t.r,t.g,t.b),o.setXYZ(21,t.r,t.g,t.b),o.setXYZ(22,t.r,t.g,t.b),o.setXYZ(23,t.r,t.g,t.b),o.setXYZ(24,e.r,e.g,e.b),o.setXYZ(25,e.r,e.g,e.b),o.setXYZ(26,e.r,e.g,e.b),o.setXYZ(27,e.r,e.g,e.b),o.setXYZ(28,e.r,e.g,e.b),o.setXYZ(29,e.r,e.g,e.b),o.setXYZ(30,e.r,e.g,e.b),o.setXYZ(31,e.r,e.g,e.b),o.setXYZ(32,i.r,i.g,i.b),o.setXYZ(33,i.r,i.g,i.b),o.setXYZ(34,i.r,i.g,i.b),o.setXYZ(35,i.r,i.g,i.b),o.setXYZ(36,i.r,i.g,i.b),o.setXYZ(37,i.r,i.g,i.b),o.setXYZ(38,n.r,n.g,n.b),o.setXYZ(39,n.r,n.g,n.b),o.setXYZ(40,s.r,s.g,s.b),o.setXYZ(41,s.r,s.g,s.b),o.setXYZ(42,s.r,s.g,s.b),o.setXYZ(43,s.r,s.g,s.b),o.setXYZ(44,s.r,s.g,s.b),o.setXYZ(45,s.r,s.g,s.b),o.setXYZ(46,s.r,s.g,s.b),o.setXYZ(47,s.r,s.g,s.b),o.setXYZ(48,s.r,s.g,s.b),o.setXYZ(49,s.r,s.g,s.b),o.needsUpdate=!0,this}update(){const t=this.geometry,e=this.pointMap,i=1,n=1;let s,a;if(Le.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),this.camera.reversedDepth===!0)s=1,a=0;else if(this.camera.coordinateSystem===Ui)s=-1,a=1;else if(this.camera.coordinateSystem===Os)s=0,a=1;else throw new Error("THREE.CameraHelper.update(): Invalid coordinate system: "+this.camera.coordinateSystem);De("c",e,t,Le,0,0,s),De("t",e,t,Le,0,0,a),De("n1",e,t,Le,-i,-n,s),De("n2",e,t,Le,i,-n,s),De("n3",e,t,Le,-i,n,s),De("n4",e,t,Le,i,n,s),De("f1",e,t,Le,-i,-n,a),De("f2",e,t,Le,i,-n,a),De("f3",e,t,Le,-i,n,a),De("f4",e,t,Le,i,n,a),De("u1",e,t,Le,i*.7,n*1.1,s),De("u2",e,t,Le,-i*.7,n*1.1,s),De("u3",e,t,Le,0,n*2,s),De("cf1",e,t,Le,-i,0,a),De("cf2",e,t,Le,i,0,a),De("cf3",e,t,Le,0,-n,a),De("cf4",e,t,Le,0,n,a),De("cn1",e,t,Le,-i,0,s),De("cn2",e,t,Le,i,0,s),De("cn3",e,t,Le,0,-n,s),De("cn4",e,t,Le,0,n,s),t.getAttribute("position").needsUpdate=!0}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}function De(r,t,e,i,n,s,a){yl.set(n,s,a).unproject(i);const o=t[r];if(o!==void 0){const l=e.getAttribute("position");for(let c=0,h=o.length;c<h;c++)l.setXYZ(o[c],yl.x,yl.y,yl.z)}}const vl=new je;class fv extends vn{constructor(t,e=16776960){const i=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),n=new Float32Array(24),s=new Zt;s.setIndex(new ue(i,1)),s.setAttribute("position",new ue(n,3)),super(s,new ui({color:e,toneMapped:!1})),this.object=t,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(){if(this.object!==void 0&&vl.setFromObject(this.object),vl.isEmpty())return;const t=vl.min,e=vl.max,i=this.geometry.attributes.position,n=i.array;n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=t.x,n[4]=e.y,n[5]=e.z,n[6]=t.x,n[7]=t.y,n[8]=e.z,n[9]=e.x,n[10]=t.y,n[11]=e.z,n[12]=e.x,n[13]=e.y,n[14]=t.z,n[15]=t.x,n[16]=e.y,n[17]=t.z,n[18]=t.x,n[19]=t.y,n[20]=t.z,n[21]=e.x,n[22]=t.y,n[23]=t.z,i.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(t){return this.object=t,this.update(),this}copy(t,e){return super.copy(t,e),this.object=t.object,this}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}class pv extends vn{constructor(t,e=16776960){const i=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),n=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],s=new Zt;s.setIndex(new ue(i,1)),s.setAttribute("position",new Rt(n,3)),super(s,new ui({color:e,toneMapped:!1})),this.box=t,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(t){const e=this.box;e.isEmpty()||(e.getCenter(this.position),e.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(t))}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}class mv extends Fn{constructor(t,e=1,i=16776960){const n=i,s=[1,-1,0,-1,1,0,-1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],a=new Zt;a.setAttribute("position",new Rt(s,3)),a.computeBoundingSphere(),super(a,new ui({color:n,toneMapped:!1})),this.type="PlaneHelper",this.plane=t,this.size=e;const o=[1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],l=new Zt;l.setAttribute("position",new Rt(o,3)),l.computeBoundingSphere(),this.add(new Kt(l,new He({color:n,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})))}updateMatrixWorld(t){this.position.set(0,0,0),this.scale.set(.5*this.size,.5*this.size,1),this.lookAt(this.plane.normal),this.translateZ(-this.plane.constant),super.updateMatrixWorld(t)}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}}const _p=new C;let Sl,ou;class gv extends he{constructor(t=new C(0,0,1),e=new C(0,0,0),i=1,n=16776960,s=i*.2,a=s*.2){super(),this.type="ArrowHelper",Sl===void 0&&(Sl=new Zt,Sl.setAttribute("position",new Rt([0,0,0,0,1,0],3)),ou=new Jr(.5,1,5,1),ou.translate(0,-.5,0)),this.position.copy(e),this.line=new Fn(Sl,new ui({color:n,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new Kt(ou,new He({color:n,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(t),this.setLength(i,s,a)}setDirection(t){if(t.y>.99999)this.quaternion.set(0,0,0,1);else if(t.y<-.99999)this.quaternion.set(1,0,0,0);else{_p.set(t.z,0,-t.x).normalize();const e=Math.acos(t.y);this.quaternion.setFromAxisAngle(_p,e)}}setLength(t,e=t*.2,i=e*.2){this.line.scale.set(1,Math.max(1e-4,t-e),1),this.line.updateMatrix(),this.cone.scale.set(i,e,i),this.cone.position.y=t,this.cone.updateMatrix()}setColor(t){this.line.material.color.set(t),this.cone.material.color.set(t)}copy(t){return super.copy(t,!1),this.line.copy(t.line),this.cone.copy(t.cone),this}dispose(){super.dispose(),this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}class xv extends vn{constructor(t=1){const e=[0,0,0,t,0,0,0,0,0,0,t,0,0,0,0,0,0,t],i=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],n=new Zt;n.setAttribute("position",new Rt(e,3)),n.setAttribute("color",new Rt(i,3));const s=new ui({vertexColors:!0,toneMapped:!1});super(n,s),this.type="AxesHelper"}setColors(t,e,i){const n=new bt,s=this.geometry.attributes.color.array;return n.set(t),n.toArray(s,0),n.toArray(s,3),n.set(e),n.toArray(s,6),n.toArray(s,9),n.set(i),n.toArray(s,12),n.toArray(s,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){super.dispose(),this.geometry.dispose(),this.material.dispose()}}class _v{constructor(){this.type="ShapePath",this.color=new bt,this.subPaths=[],this.currentPath=null,this.userData={}}moveTo(t,e){return this.currentPath=new Va,this.subPaths.push(this.currentPath),this.currentPath.moveTo(t,e),this}lineTo(t,e){return this.currentPath.lineTo(t,e),this}quadraticCurveTo(t,e,i,n){return this.currentPath.quadraticCurveTo(t,e,i,n),this}bezierCurveTo(t,e,i,n,s,a){return this.currentPath.bezierCurveTo(t,e,i,n,s,a),this}splineThru(t){return this.currentPath.splineThru(t),this}toShapes(){function t(l,c){let h=!1;const d=c.length;for(let u=0,f=d-1;u<d;f=u++){const p=c[u],x=c[f];p.y>l.y!=x.y>l.y&&l.x<(x.x-p.x)*(l.y-p.y)/(x.y-p.y)+p.x&&(h=!h)}return h}function e(l,c){const h=c.getCenter(new st);if(t(h,l))return h;const d=h.y,u=[],f=l.length;for(let p=0;p<f;p++){const x=l[p],m=l[(p+1)%f];if(x.y>d!=m.y>d){const g=x.x+(d-x.y)*(m.x-x.x)/(m.y-x.y);u.push(g)}}return u.length>1&&(u.sort((p,x)=>p-x),h.x=(u[0]+u[1])/2),h}let i=this.userData.style&&this.userData.style.fillRule||"nonzero";i!=="nonzero"&&i!=="evenodd"&&(dt('Fill-rule "'+i+'" is not supported, falling back to "nonzero".'),i="nonzero");const n=i==="nonzero"?(l=>l!==0):(l=>(l&1)!==0),s=[];for(const l of this.subPaths){const c=l.getPoints();if(c.length<3)continue;const h=$i.area(c);if(h===0)continue;const d=new Gg;for(let u=0;u<c.length;u++)d.expandByPoint(c[u]);s.push({subPath:l,points:c,boundingBox:d,interiorPoint:e(c,d),absArea:Math.abs(h),winding:h<0?-1:1,container:null,exclude:!1,role:null})}s.sort((l,c)=>c.absArea-l.absArea);for(let l=0;l<s.length;l++){const c=s[l];let h=0;for(let d=l-1;d>=0;d--){const u=s[d];if(u.boundingBox.containsBox(c.boundingBox)&&t(c.interiorPoint,u.points)){c.container=u.exclude?u.container:u,h=u.winding,c.winding+=h;break}}n(c.winding)===n(h)&&(c.exclude=!0)}for(const l of s)l.exclude||(l.role=l.container===null||l.container.role==="hole"?"outer":"hole");const a=[],o=new Map;for(const l of s){if(l.exclude||l.role!=="outer")continue;const c=new To;c.curves=l.subPath.curves,a.push(c),o.set(l,c)}for(const l of s){if(l.exclude||l.role!=="hole")continue;const c=o.get(l.container);if(!c)continue;const h=new Va;h.curves=l.subPath.curves,c.holes.push(h)}return a}}class yv extends tn{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function vv(r,t){const e=r.image&&r.image.width?r.image.width/r.image.height:1;return e>t?(r.repeat.x=1,r.repeat.y=e/t,r.offset.x=0,r.offset.y=(1-r.repeat.y)/2):(r.repeat.x=t/e,r.repeat.y=1,r.offset.x=(1-r.repeat.x)/2,r.offset.y=0),r}function Sv(r,t){const e=r.image&&r.image.width?r.image.width/r.image.height:1;return e>t?(r.repeat.x=t/e,r.repeat.y=1,r.offset.x=(1-r.repeat.x)/2,r.offset.y=0):(r.repeat.x=1,r.repeat.y=e/t,r.offset.x=0,r.offset.y=(1-r.repeat.y)/2),r}function Mv(r){return r.repeat.x=1,r.repeat.y=1,r.offset.x=0,r.offset.y=0,r}function zu(r,t,e,i){const n=bv(i);switch(e){case ld:return r*t;case Bc:return r*t/n.components*n.byteLength;case Mo:return r*t/n.components*n.byteLength;case as:return r*t*2/n.components*n.byteLength;case zc:return r*t*2/n.components*n.byteLength;case cd:return r*t*3/n.components*n.byteLength;case _i:return r*t*4/n.components*n.byteLength;case Vc:return r*t*4/n.components*n.byteLength;case Ma:case ba:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case wa:case Ta:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Xl:case Jl:return Math.max(r,16)*Math.max(t,8)/4;case Wl:case ql:return Math.max(r,8)*Math.max(t,8)/2;case Yl:case Zl:case Kl:case Ql:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case $l:case La:case jl:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case tc:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case ec:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case ic:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case nc:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case sc:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case rc:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case ac:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case oc:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case lc:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case cc:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case hc:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case uc:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case dc:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case fc:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case pc:case mc:case gc:return Math.ceil(r/4)*Math.ceil(t/4)*16;case xc:case _c:return Math.ceil(r/4)*Math.ceil(t/4)*8;case Na:case yc:return Math.ceil(r/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function bv(r){switch(r){case Ti:case sd:return{byteLength:1,components:1};case Ir:case rd:case Qi:return{byteLength:2,components:1};case Oc:case Fc:return{byteLength:2,components:4};case ki:case Dc:case xi:return{byteLength:4,components:1};case ad:case od:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${r}.`)}class wv{static contain(t,e){return vv(t,e)}static cover(t,e){return Sv(t,e)}static fill(t){return Mv(t)}static getByteLength(t,e,i,n){return zu(t,e,i,n)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Lc}}));typeof window<"u"&&(window.__THREE__?dt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Lc);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Wg(){let r=null,t=!1,e=null,i=null;function n(s,a){i=r.requestAnimationFrame(n),e(s,a)}return{start:function(){t!==!0&&e!==null&&r!==null&&(i=r.requestAnimationFrame(n),t=!0)},stop:function(){r!==null&&r.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){r=s}}}function Tv(r){const t=new WeakMap;function e(o,l){const c=o.array,h=o.usage,d=c.byteLength,u=r.createBuffer();r.bindBuffer(l,u),r.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=r.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=r.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=r.HALF_FLOAT:f=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=r.SHORT;else if(c instanceof Uint32Array)f=r.UNSIGNED_INT;else if(c instanceof Int32Array)f=r.INT;else if(c instanceof Int8Array)f=r.BYTE;else if(c instanceof Uint8Array)f=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:d}}function i(o,l,c){const h=l.array,d=l.updateRanges;if(r.bindBuffer(c,o),d.length===0)r.bufferSubData(c,0,h);else{d.sort((f,p)=>f.start-p.start);let u=0;for(let f=1;f<d.length;f++){const p=d[u],x=d[f];x.start<=p.start+p.count+1?p.count=Math.max(p.count,x.start+x.count-p.start):(++u,d[u]=x)}d.length=u+1;for(let f=0,p=d.length;f<p;f++){const x=d[f];r.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function n(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(r.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:n,remove:s,update:a}}var Ev=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Av=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Cv=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Rv=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Pv=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Iv=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Lv=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Nv=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Uv=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Dv=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Ov=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Fv=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Bv=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,zv=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Vv=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,kv=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Gv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Hv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Wv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Xv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,qv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Jv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Yv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Zv=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,$v=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Kv=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Qv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,jv=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,tS=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,eS=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,iS="gl_FragColor = linearToOutputTexel( gl_FragColor );",nS=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,sS=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,rS=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,aS=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,oS=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,lS=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,cS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,hS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,uS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,dS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,fS=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,pS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,mS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,gS=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,xS=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,_S=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,yS=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,vS=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,SS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,MS=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,bS=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,wS=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,TS=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ES=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,AS=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,CS=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,RS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,PS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,IS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,LS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,NS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,US=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,DS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,OS=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,FS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,BS=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,zS=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,VS=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,kS=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,GS=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,HS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,WS=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,XS=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,qS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,JS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,YS=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,ZS=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,$S=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,KS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,QS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,jS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,tM=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,eM=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,iM=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,nM=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,sM=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,rM=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,aM=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,oM=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,lM=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,cM=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,hM=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,uM=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,dM=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,fM=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,pM=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,mM=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,gM=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,xM=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,_M=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,yM=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,vM=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,SM=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,MM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,bM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,wM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,TM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const EM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,AM=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,CM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,RM=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,PM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,IM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,LM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,NM=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,UM=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,DM=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,OM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,FM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,BM=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,zM=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,VM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,kM=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,GM=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,HM=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,WM=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,XM=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qM=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,JM=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,YM=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ZM=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$M=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,KM=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,QM=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,jM=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tb=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,eb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ib=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,nb=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sb=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,rb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ie={alphahash_fragment:Ev,alphahash_pars_fragment:Av,alphamap_fragment:Cv,alphamap_pars_fragment:Rv,alphatest_fragment:Pv,alphatest_pars_fragment:Iv,aomap_fragment:Lv,aomap_pars_fragment:Nv,batching_pars_vertex:Uv,batching_vertex:Dv,begin_vertex:Ov,beginnormal_vertex:Fv,bsdfs:Bv,iridescence_fragment:zv,bumpmap_pars_fragment:Vv,clipping_planes_fragment:kv,clipping_planes_pars_fragment:Gv,clipping_planes_pars_vertex:Hv,clipping_planes_vertex:Wv,color_fragment:Xv,color_pars_fragment:qv,color_pars_vertex:Jv,color_vertex:Yv,common:Zv,cube_uv_reflection_fragment:$v,defaultnormal_vertex:Kv,displacementmap_pars_vertex:Qv,displacementmap_vertex:jv,emissivemap_fragment:tS,emissivemap_pars_fragment:eS,colorspace_fragment:iS,colorspace_pars_fragment:nS,envmap_fragment:sS,envmap_common_pars_fragment:rS,envmap_pars_fragment:aS,envmap_pars_vertex:oS,envmap_physical_pars_fragment:_S,envmap_vertex:lS,fog_vertex:cS,fog_pars_vertex:hS,fog_fragment:uS,fog_pars_fragment:dS,gradientmap_pars_fragment:fS,lightmap_pars_fragment:pS,lights_lambert_fragment:mS,lights_lambert_pars_fragment:gS,lights_pars_begin:xS,lights_toon_fragment:yS,lights_toon_pars_fragment:vS,lights_phong_fragment:SS,lights_phong_pars_fragment:MS,lights_physical_fragment:bS,lights_physical_pars_fragment:wS,lights_fragment_begin:TS,lights_fragment_maps:ES,lights_fragment_end:AS,lightprobes_pars_fragment:CS,logdepthbuf_fragment:RS,logdepthbuf_pars_fragment:PS,logdepthbuf_pars_vertex:IS,logdepthbuf_vertex:LS,map_fragment:NS,map_pars_fragment:US,map_particle_fragment:DS,map_particle_pars_fragment:OS,metalnessmap_fragment:FS,metalnessmap_pars_fragment:BS,morphinstance_vertex:zS,morphcolor_vertex:VS,morphnormal_vertex:kS,morphtarget_pars_vertex:GS,morphtarget_vertex:HS,normal_fragment_begin:WS,normal_fragment_maps:XS,normal_pars_fragment:qS,normal_pars_vertex:JS,normal_vertex:YS,normalmap_pars_fragment:ZS,clearcoat_normal_fragment_begin:$S,clearcoat_normal_fragment_maps:KS,clearcoat_pars_fragment:QS,iridescence_pars_fragment:jS,opaque_fragment:tM,packing:eM,premultiplied_alpha_fragment:iM,project_vertex:nM,dithering_fragment:sM,dithering_pars_fragment:rM,roughnessmap_fragment:aM,roughnessmap_pars_fragment:oM,shadowmap_pars_fragment:lM,shadowmap_pars_vertex:cM,shadowmap_vertex:hM,shadowmask_pars_fragment:uM,skinbase_vertex:dM,skinning_pars_vertex:fM,skinning_vertex:pM,skinnormal_vertex:mM,specularmap_fragment:gM,specularmap_pars_fragment:xM,tonemapping_fragment:_M,tonemapping_pars_fragment:yM,transmission_fragment:vM,transmission_pars_fragment:SM,uv_pars_fragment:MM,uv_pars_vertex:bM,uv_vertex:wM,worldpos_vertex:TM,background_vert:EM,background_frag:AM,backgroundCube_vert:CM,backgroundCube_frag:RM,cube_vert:PM,cube_frag:IM,depth_vert:LM,depth_frag:NM,distance_vert:UM,distance_frag:DM,equirect_vert:OM,equirect_frag:FM,linedashed_vert:BM,linedashed_frag:zM,meshbasic_vert:VM,meshbasic_frag:kM,meshlambert_vert:GM,meshlambert_frag:HM,meshmatcap_vert:WM,meshmatcap_frag:XM,meshnormal_vert:qM,meshnormal_frag:JM,meshphong_vert:YM,meshphong_frag:ZM,meshphysical_vert:$M,meshphysical_frag:KM,meshtoon_vert:QM,meshtoon_frag:jM,points_vert:tb,points_frag:eb,shadow_vert:ib,shadow_frag:nb,sprite_vert:sb,sprite_frag:rb},_t={common:{diffuse:{value:new bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new te}},envmap:{envMap:{value:null},envMapRotation:{value:new te},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new te}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new te}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new te},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new te},normalScale:{value:new st(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new te},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new te}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new te}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new te}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new C},probesMax:{value:new C},probesResolution:{value:new C}},points:{diffuse:{value:new bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0},uvTransform:{value:new te}},sprite:{diffuse:{value:new bt(16777215)},opacity:{value:1},center:{value:new st(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}}},Zi={basic:{uniforms:pi([_t.common,_t.specularmap,_t.envmap,_t.aomap,_t.lightmap,_t.fog]),vertexShader:ie.meshbasic_vert,fragmentShader:ie.meshbasic_frag},lambert:{uniforms:pi([_t.common,_t.specularmap,_t.envmap,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.fog,_t.lights,{emissive:{value:new bt(0)},envMapIntensity:{value:1}}]),vertexShader:ie.meshlambert_vert,fragmentShader:ie.meshlambert_frag},phong:{uniforms:pi([_t.common,_t.specularmap,_t.envmap,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.fog,_t.lights,{emissive:{value:new bt(0)},specular:{value:new bt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ie.meshphong_vert,fragmentShader:ie.meshphong_frag},standard:{uniforms:pi([_t.common,_t.envmap,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.roughnessmap,_t.metalnessmap,_t.fog,_t.lights,{emissive:{value:new bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ie.meshphysical_vert,fragmentShader:ie.meshphysical_frag},toon:{uniforms:pi([_t.common,_t.aomap,_t.lightmap,_t.emissivemap,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.gradientmap,_t.fog,_t.lights,{emissive:{value:new bt(0)}}]),vertexShader:ie.meshtoon_vert,fragmentShader:ie.meshtoon_frag},matcap:{uniforms:pi([_t.common,_t.bumpmap,_t.normalmap,_t.displacementmap,_t.fog,{matcap:{value:null}}]),vertexShader:ie.meshmatcap_vert,fragmentShader:ie.meshmatcap_frag},points:{uniforms:pi([_t.points,_t.fog]),vertexShader:ie.points_vert,fragmentShader:ie.points_frag},dashed:{uniforms:pi([_t.common,_t.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ie.linedashed_vert,fragmentShader:ie.linedashed_frag},depth:{uniforms:pi([_t.common,_t.displacementmap]),vertexShader:ie.depth_vert,fragmentShader:ie.depth_frag},normal:{uniforms:pi([_t.common,_t.bumpmap,_t.normalmap,_t.displacementmap,{opacity:{value:1}}]),vertexShader:ie.meshnormal_vert,fragmentShader:ie.meshnormal_frag},sprite:{uniforms:pi([_t.sprite,_t.fog]),vertexShader:ie.sprite_vert,fragmentShader:ie.sprite_frag},background:{uniforms:{uvTransform:{value:new te},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ie.background_vert,fragmentShader:ie.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new te}},vertexShader:ie.backgroundCube_vert,fragmentShader:ie.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ie.cube_vert,fragmentShader:ie.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ie.equirect_vert,fragmentShader:ie.equirect_frag},distance:{uniforms:pi([_t.common,_t.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ie.distance_vert,fragmentShader:ie.distance_frag},shadow:{uniforms:pi([_t.lights,_t.fog,{color:{value:new bt(0)},opacity:{value:1}}]),vertexShader:ie.shadow_vert,fragmentShader:ie.shadow_frag}};Zi.physical={uniforms:pi([Zi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new te},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new te},clearcoatNormalScale:{value:new st(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new te},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new te},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new te},sheen:{value:0},sheenColor:{value:new bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new te},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new te},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new te},transmissionSamplerSize:{value:new st},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new te},attenuationDistance:{value:0},attenuationColor:{value:new bt(0)},specularColor:{value:new bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new te},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new te},anisotropyVector:{value:new st},anisotropyMap:{value:null},anisotropyMapTransform:{value:new te}}]),vertexShader:ie.meshphysical_vert,fragmentShader:ie.meshphysical_frag};const Ml={r:0,b:0,g:0},ab=new $t,Xg=new te;Xg.set(-1,0,0,0,1,0,0,0,1);function ob(r,t,e,i,n,s){const a=new bt(0);let o=n===!0?0:1,l,c,h=null,d=0,u=null;function f(v){let w=v.isScene===!0?v.background:null;if(w&&w.isTexture){const _=v.backgroundBlurriness>0;w=t.get(w,_)}return w}function p(v){let w=!1;const _=f(v);_===null?m(a,o):_&&_.isColor&&(m(_,1),w=!0);const b=r.xr.getEnvironmentBlendMode();b==="additive"?e.buffers.color.setClear(0,0,0,1,s):b==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,s),(r.autoClear||w)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function x(v,w){const _=f(w);_&&(_.isCubeTexture||_.mapping===Xr)?(c===void 0&&(c=new Kt(new Re(1,1,1),new hi({name:"BackgroundCubeMaterial",uniforms:Or(Zi.backgroundCube.uniforms),vertexShader:Zi.backgroundCube.vertexShader,fragmentShader:Zi.backgroundCube.fragmentShader,side:ci,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,M,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=_,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(ab.makeRotationFromEuler(w.backgroundRotation)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Xg),c.material.toneMapped=oe.getTransfer(_.colorSpace)!==ve,(h!==_||d!==_.version||u!==r.toneMapping)&&(c.material.needsUpdate=!0,h=_,d=_.version,u=r.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new Kt(new mn(2,2),new hi({name:"BackgroundMaterial",uniforms:Or(Zi.background.uniforms),vertexShader:Zi.background.vertexShader,fragmentShader:Zi.background.fragmentShader,side:ss,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=oe.getTransfer(_.colorSpace)!==ve,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(h!==_||d!==_.version||u!==r.toneMapping)&&(l.material.needsUpdate=!0,h=_,d=_.version,u=r.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function m(v,w){v.getRGB(Ml,mg(r)),e.buffers.color.setClear(Ml.r,Ml.g,Ml.b,w,s)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,w=1){a.set(v),o=w,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(v){o=v,m(a,o)},render:p,addToRenderList:x,dispose:g}}function lb(r,t){const e=r.getParameter(r.MAX_VERTEX_ATTRIBS),i={},n=u(null);let s=n,a=!1;function o(I,U,V,N,B){let Z=!1;const k=d(I,N,V,U);s!==k&&(s=k,c(s.object)),Z=f(I,N,V,B),Z&&p(I,N,V,B),B!==null&&t.update(B,r.ELEMENT_ARRAY_BUFFER),(Z||a)&&(a=!1,_(I,U,V,N),B!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function l(){return r.createVertexArray()}function c(I){return r.bindVertexArray(I)}function h(I){return r.deleteVertexArray(I)}function d(I,U,V,N){const B=N.wireframe===!0;let Z=i[U.id];Z===void 0&&(Z={},i[U.id]=Z);const k=I.isInstancedMesh===!0?I.id:0;let nt=Z[k];nt===void 0&&(nt={},Z[k]=nt);let J=nt[V.id];J===void 0&&(J={},nt[V.id]=J);let K=J[B];return K===void 0&&(K=u(l()),J[B]=K),K}function u(I){const U=[],V=[],N=[];for(let B=0;B<e;B++)U[B]=0,V[B]=0,N[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:V,attributeDivisors:N,object:I,attributes:{},index:null}}function f(I,U,V,N){const B=s.attributes,Z=U.attributes;let k=0;const nt=V.getAttributes();for(const J in nt)if(nt[J].location>=0){const Q=B[J];let At=Z[J];if(At===void 0&&(J==="instanceMatrix"&&I.instanceMatrix&&(At=I.instanceMatrix),J==="instanceColor"&&I.instanceColor&&(At=I.instanceColor)),Q===void 0||Q.attribute!==At||At&&Q.data!==At.data)return!0;k++}return s.attributesNum!==k||s.index!==N}function p(I,U,V,N){const B={},Z=U.attributes;let k=0;const nt=V.getAttributes();for(const J in nt)if(nt[J].location>=0){let Q=Z[J];Q===void 0&&(J==="instanceMatrix"&&I.instanceMatrix&&(Q=I.instanceMatrix),J==="instanceColor"&&I.instanceColor&&(Q=I.instanceColor));const At={};At.attribute=Q,Q&&Q.data&&(At.data=Q.data),B[J]=At,k++}s.attributes=B,s.attributesNum=k,s.index=N}function x(){const I=s.newAttributes;for(let U=0,V=I.length;U<V;U++)I[U]=0}function m(I){g(I,0)}function g(I,U){const V=s.newAttributes,N=s.enabledAttributes,B=s.attributeDivisors;V[I]=1,N[I]===0&&(r.enableVertexAttribArray(I),N[I]=1),B[I]!==U&&(r.vertexAttribDivisor(I,U),B[I]=U)}function v(){const I=s.newAttributes,U=s.enabledAttributes;for(let V=0,N=U.length;V<N;V++)U[V]!==I[V]&&(r.disableVertexAttribArray(V),U[V]=0)}function w(I,U,V,N,B,Z,k){k===!0?r.vertexAttribIPointer(I,U,V,B,Z):r.vertexAttribPointer(I,U,V,N,B,Z)}function _(I,U,V,N){x();const B=N.attributes,Z=V.getAttributes(),k=U.defaultAttributeValues;for(const nt in Z){const J=Z[nt];if(J.location>=0){let K=B[nt];if(K===void 0&&(nt==="instanceMatrix"&&I.instanceMatrix&&(K=I.instanceMatrix),nt==="instanceColor"&&I.instanceColor&&(K=I.instanceColor)),K!==void 0){const Q=K.normalized,At=K.itemSize,St=t.get(K);if(St===void 0)continue;const se=St.buffer,Yt=St.type,Qt=St.bytesPerElement,q=Yt===r.INT||Yt===r.UNSIGNED_INT||K.gpuType===Dc;if(K.isInterleavedBufferAttribute){const tt=K.data,ft=tt.stride,Ht=K.offset;if(tt.isInstancedInterleavedBuffer){for(let wt=0;wt<J.locationSize;wt++)g(J.location+wt,tt.meshPerAttribute);I.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let wt=0;wt<J.locationSize;wt++)m(J.location+wt);r.bindBuffer(r.ARRAY_BUFFER,se);for(let wt=0;wt<J.locationSize;wt++)w(J.location+wt,At/J.locationSize,Yt,Q,ft*Qt,(Ht+At/J.locationSize*wt)*Qt,q)}else{if(K.isInstancedBufferAttribute){for(let tt=0;tt<J.locationSize;tt++)g(J.location+tt,K.meshPerAttribute);I.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let tt=0;tt<J.locationSize;tt++)m(J.location+tt);r.bindBuffer(r.ARRAY_BUFFER,se);for(let tt=0;tt<J.locationSize;tt++)w(J.location+tt,At/J.locationSize,Yt,Q,At*Qt,At/J.locationSize*tt*Qt,q)}}else if(k!==void 0){const Q=k[nt];if(Q!==void 0)switch(Q.length){case 2:r.vertexAttrib2fv(J.location,Q);break;case 3:r.vertexAttrib3fv(J.location,Q);break;case 4:r.vertexAttrib4fv(J.location,Q);break;default:r.vertexAttrib1fv(J.location,Q)}}}}v()}function b(){E();for(const I in i){const U=i[I];for(const V in U){const N=U[V];for(const B in N){const Z=N[B];for(const k in Z)h(Z[k].object),delete Z[k];delete N[B]}}delete i[I]}}function M(I){if(i[I.id]===void 0)return;const U=i[I.id];for(const V in U){const N=U[V];for(const B in N){const Z=N[B];for(const k in Z)h(Z[k].object),delete Z[k];delete N[B]}}delete i[I.id]}function A(I){for(const U in i){const V=i[U];for(const N in V){const B=V[N];if(B[I.id]===void 0)continue;const Z=B[I.id];for(const k in Z)h(Z[k].object),delete Z[k];delete B[I.id]}}}function y(I){for(const U in i){const V=i[U],N=I.isInstancedMesh===!0?I.id:0,B=V[N];if(B!==void 0){for(const Z in B){const k=B[Z];for(const nt in k)h(k[nt].object),delete k[nt];delete B[Z]}delete V[N],Object.keys(V).length===0&&delete i[U]}}}function E(){P(),a=!0,s!==n&&(s=n,c(s.object))}function P(){n.geometry=null,n.program=null,n.wireframe=!1}return{setup:o,reset:E,resetDefaultState:P,dispose:b,releaseStatesOfGeometry:M,releaseStatesOfObject:y,releaseStatesOfProgram:A,initAttributes:x,enableAttribute:m,disableUnusedAttributes:v}}function cb(r,t,e){let i;function n(l){i=l}function s(l,c){r.drawArrays(i,l,c),e.update(c,i,1)}function a(l,c,h){h!==0&&(r.drawArraysInstanced(i,l,c,h),e.update(c,i,h))}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];e.update(u,i,1)}this.setMode=n,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function hb(r,t,e,i){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");n=r.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function a(A){return!(A!==_i&&i.convert(A)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(A){const y=A===Qi&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(A!==Ti&&A!==xi&&!y&&i.convert(A)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE))}function l(A){if(A==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const h=l(c);h!==c&&(dt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const d=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&dt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),p=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=r.getParameter(r.MAX_TEXTURE_SIZE),m=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),g=r.getParameter(r.MAX_VERTEX_ATTRIBS),v=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),w=r.getParameter(r.MAX_VARYING_VECTORS),_=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),b=r.getParameter(r.MAX_SAMPLES),M=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:p,maxTextureSize:x,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:v,maxVaryings:w,maxFragmentUniforms:_,maxSamples:b,samples:M}}function ub(r){const t=this;let e=null,i=0,n=!1,s=!1;const a=new Cn,o=new te,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const f=d.length!==0||u||i!==0||n;return n=u,i=d.length,f},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){const p=d.clippingPlanes,x=d.clipIntersection,m=d.clipShadows,g=r.get(d);if(!n||p===null||p.length===0||s&&!m)s?h(null):c();else{const v=s?0:i,w=v*4;let _=g.clippingState||null;l.value=_,_=h(p,u,w,f);for(let b=0;b!==w;++b)_[b]=e[b];g.clippingState=_,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(d,u,f,p){const x=d!==null?d.length:0;let m=null;if(x!==0){if(m=l.value,p!==!0||m===null){const g=f+x*4,v=u.matrixWorldInverse;o.getNormalMatrix(v),(m===null||m.length<g)&&(m=new Float32Array(g));for(let w=0,_=f;w!==x;++w,_+=4)a.copy(d[w]).applyMatrix4(v,o),a.normal.toArray(m,_),m[_+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,m}}const yr=4,db=6,fb=20,pb=256,ha=new Ao,yp=new bt;let lu=null,cu=0,hu=0,uu=!1;const mb=new C,Cs=new C;class Vu{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,i=.1,n=100,s={}){const{size:a=256,position:o=mb}=s;lu=this._renderer.getRenderTarget(),cu=this._renderer.getActiveCubeFace(),hu=this._renderer.getActiveMipmapLevel(),uu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,n,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Mp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Sp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(lu,cu,hu),this._renderer.xr.enabled=uu,t.scissorTest=!1,pr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===xn||t.mapping===rs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),lu=this._renderer.getRenderTarget(),cu=this._renderer.getActiveCubeFace(),hu=this._renderer.getActiveMipmapLevel(),uu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Ce,minFilter:Ce,generateMipmaps:!1,type:Qi,format:_i,colorSpace:Oa,depthBuffer:!1},n=vp(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=vp(t,e,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=gb(s)),this._blurMaterial=_b(s,t,e),this._ggxMaterial=xb(s,t,e)}return n}_compileMaterial(t){const e=new Kt(new Zt,t);this._renderer.compile(e,ha)}_sceneToCubeUV(t,e,i,n,s){const l=new Ze(90,1,e,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],d=this._renderer,u=d.autoClear,f=d.toneMapping;d.getClearColor(yp),d.toneMapping=Ki,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(n),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Kt(new Re,new He({name:"PMREM.Background",side:ci,depthWrite:!1,depthTest:!1})));const x=this._backgroundBox,m=x.material;let g=!1;const v=t.background;v?v.isColor&&(m.color.copy(v),t.background=null,g=!0):(m.color.copy(yp),g=!0);for(let w=0;w<6;w++){const _=w%3;_===0?(l.up.set(0,c[w],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+h[w],s.y,s.z)):_===1?(l.up.set(0,0,c[w]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+h[w],s.z)):(l.up.set(0,c[w],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+h[w]));const b=this._cubeSize;pr(n,_*b,w>2?b:0,b,b),d.setRenderTarget(n),g&&d.render(x,l),d.render(t,l)}d.toneMapping=f,d.autoClear=u,t.background=v}_textureToCubeUV(t,e){const i=this._renderer,n=t.mapping===xn||t.mapping===rs;n?(this._cubemapMaterial===null&&(this._cubemapMaterial=Mp()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Sp());const s=n?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=t;const l=this._cubeSize;pr(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(a,ha)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const n=this._lodMeshes.length;for(let s=1;s<n;s++)this._applyGGXFilter(t,s-1,s);e.autoClear=i}_applyGGXFilter(t,e,i){const n=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),d=Math.sqrt(c*c-h*h),u=c*1.25,f=d*u,{_lodMax:p}=this,x=this._sizeLods[i],m=3*x*(i>p-yr?i-p+yr:0),g=4*(this._cubeSize-x);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=p-e,pr(s,m,g,3*x,2*x),n.setRenderTarget(s),n.render(o,ha),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=p-i,pr(t,m,g,3*x,2*x),n.setRenderTarget(t),n.render(o,ha)}_blur(t,e,i,n){const s=this._pingPongRenderTarget,a=Math.min(n,Math.PI)/Math.SQRT2;this._blurPass(t,s,e,i,a),this._blurPass(s,t,i,i,a)}_blurPass(t,e,i,n,s){const a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[n];l.material=o;const c=o.uniforms;c.envMap.value=t.texture,c.sigma.value=s,c.mipInt.value=this._lodMax-i;const h=this._sizeLods[n],d=3*h*(n>this._lodMax-yr?n-this._lodMax+yr:0),u=4*(this._cubeSize-h);pr(e,d,u,3*h,2*h),a.setRenderTarget(e),a.render(l,ha)}}function gb(r){const t=[],e=[];let i=r;const n=r-yr+1+db;for(let s=0;s<n;s++){const a=Math.pow(2,i);t.push(a);const o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,u=6,f=3,p=new Float32Array(f*u*d),x=new Float32Array(f*u*d);for(let g=0;g<d;g++){const v=g%3*2/3-1,w=g>2?0:-1,_=[v,w,0,v+2/3,w,0,v+2/3,w+1,0,v,w,0,v+2/3,w+1,0,v,w+1,0];p.set(_,f*u*g);for(let b=0;b<u;b++){const M=h[b*2]*2-1,A=h[b*2+1]*2-1;g===0?Cs.set(1,A,M):g===1?Cs.set(-M,1,-A):g===2?Cs.set(-M,A,1):g===3?Cs.set(-1,A,-M):g===4?Cs.set(-M,-1,A):Cs.set(M,A,-1),Cs.toArray(x,(g*u+b)*f)}}const m=new Zt;m.setAttribute("position",new ue(p,f)),m.setAttribute("outputDirection",new ue(x,f)),e.push(new Kt(m,null)),i>yr&&i--}return{lodMeshes:e,sizeLods:t}}function vp(r,t,e){const i=new Ai(r,t,e);return i.texture.mapping=Xr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function pr(r,t,e,i,n){r.viewport.set(t,e,i,n),r.scissor.set(t,e,i,n)}function xb(r,t,e){return new hi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:pb,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:yh(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:pn,depthTest:!1,depthWrite:!1})}function _b(r,t,e){return new hi({name:"SphericalGaussianBlur",defines:{SAMPLES:fb,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:yh(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:pn,depthTest:!1,depthWrite:!1})}function Sp(){return new hi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:yh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:pn,depthTest:!1,depthWrite:!1})}function Mp(){return new hi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:yh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:pn,depthTest:!1,depthWrite:!1})}function yh(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class kd extends Ai{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},n=[i,i,i,i,i,i];this.texture=new wo(n),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},n=new Re(5,5,5),s=new hi({name:"CubemapFromEquirect",uniforms:Or(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:ci,blending:pn});s.uniforms.tEquirect.value=e;const a=new Kt(n,s),o=e.minFilter;return e.minFilter===un&&(e.minFilter=Ce),new Og(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,i=!0,n=!0){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,n);t.setRenderTarget(s)}}function yb(r){let t=new WeakMap,e=new WeakMap,i=null;function n(u,f=!1){return u==null?null:f?a(u):s(u)}function s(u){if(u&&u.isTexture){const f=u.mapping;if(f===ya||f===va)if(t.has(u)){const p=t.get(u).texture;return o(p,u.mapping)}else{const p=u.image;if(p&&p.height>0){const x=new kd(p.height);return x.fromEquirectangularTexture(r,u),t.set(u,x),u.addEventListener("dispose",c),o(x.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const f=u.mapping,p=f===ya||f===va,x=f===xn||f===rs;if(p||x){let m=e.get(u);const g=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==g)return i===null&&(i=new Vu(r)),m=p?i.fromEquirectangular(u,m):i.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),m.texture;if(m!==void 0)return m.texture;{const v=u.image;return p&&v&&v.height>0||x&&v&&l(v)?(i===null&&(i=new Vu(r)),m=p?i.fromEquirectangular(u):i.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,f){return f===ya?u.mapping=xn:f===va&&(u.mapping=rs),u}function l(u){let f=0;const p=6;for(let x=0;x<p;x++)u[x]!==void 0&&f++;return f===p}function c(u){const f=u.target;f.removeEventListener("dispose",c);const p=t.get(f);p!==void 0&&(t.delete(f),p.dispose())}function h(u){const f=u.target;f.removeEventListener("dispose",h);const p=e.get(f);p!==void 0&&(e.delete(f),p.dispose())}function d(){t=new WeakMap,e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:n,dispose:d}}function vb(r){const t={};function e(i){if(t[i]!==void 0)return t[i];const n=r.getExtension(i);return t[i]=n,n}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const n=e(i);return n===null&&Nn("WebGLRenderer: "+i+" extension not supported."),n}}}function Sb(r,t,e,i){const n={},s=new WeakMap;function a(d){const u=d.target;u.index!==null&&t.remove(u.index);for(const p in u.attributes)t.remove(u.attributes[p]);u.removeEventListener("dispose",a),delete n[u.id];const f=s.get(u);f&&(t.remove(f),s.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(d,u){return n[u.id]===!0||(u.addEventListener("dispose",a),n[u.id]=!0,e.memory.geometries++),u}function l(d){const u=d.attributes;for(const f in u)t.update(u[f],r.ARRAY_BUFFER)}function c(d){const u=[],f=d.index,p=d.attributes.position;let x=0;if(p===void 0)return;if(f!==null){const v=f.array;x=f.version;for(let w=0,_=v.length;w<_;w+=3){const b=v[w+0],M=v[w+1],A=v[w+2];u.push(b,M,M,A,A,b)}}else{const v=p.array;x=p.version;for(let w=0,_=v.length/3-1;w<_;w+=3){const b=w+0,M=w+1,A=w+2;u.push(b,M,M,A,A,b)}}const m=new(p.count>=65535?md:pd)(u,1);m.version=x;const g=s.get(d);g&&t.remove(g),s.set(d,m)}function h(d){const u=s.get(d);if(u){const f=d.index;f!==null&&u.version<f.version&&c(d)}else c(d);return s.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function Mb(r,t,e){let i;function n(d){i=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function l(d,u){r.drawElements(i,u,s,d*a),e.update(u,i,1)}function c(d,u,f){f!==0&&(r.drawElementsInstanced(i,u,s,d*a,f),e.update(u,i,f))}function h(d,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,s,d,0,f);let x=0;for(let m=0;m<f;m++)x+=u[m];e.update(x,i,1)}this.setMode=n,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function bb(r){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(e.calls++,a){case r.TRIANGLES:e.triangles+=o*(s/3);break;case r.LINES:e.lines+=o*(s/2);break;case r.LINE_STRIP:e.lines+=o*(s-1);break;case r.LINE_LOOP:e.lines+=o*s;break;case r.POINTS:e.points+=o*s;break;default:Ot("WebGLInfo: Unknown draw mode:",a);break}}function n(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:n,update:i}}function wb(r,t,e){const i=new WeakMap,n=new be;function s(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,d=h!==void 0?h.length:0;let u=i.get(o);if(u===void 0||u.count!==d){let P=function(){y.dispose(),i.delete(o),o.removeEventListener("dispose",P)};var f=P;u!==void 0&&u.texture.dispose();const p=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],v=o.morphAttributes.normal||[],w=o.morphAttributes.color||[];let _=0;p===!0&&(_=1),x===!0&&(_=2),m===!0&&(_=3);let b=o.attributes.position.count*_,M=1;b>t.maxTextureSize&&(M=Math.ceil(b/t.maxTextureSize),b=t.maxTextureSize);const A=new Float32Array(b*M*4*d),y=new Xc(A,b,M,d);y.type=xi,y.needsUpdate=!0;const E=_*4;for(let I=0;I<d;I++){const U=g[I],V=v[I],N=w[I],B=b*M*4*I;for(let Z=0;Z<U.count;Z++){const k=Z*E;p===!0&&(n.fromBufferAttribute(U,Z),A[B+k+0]=n.x,A[B+k+1]=n.y,A[B+k+2]=n.z,A[B+k+3]=0),x===!0&&(n.fromBufferAttribute(V,Z),A[B+k+4]=n.x,A[B+k+5]=n.y,A[B+k+6]=n.z,A[B+k+7]=0),m===!0&&(n.fromBufferAttribute(N,Z),A[B+k+8]=n.x,A[B+k+9]=n.y,A[B+k+10]=n.z,A[B+k+11]=N.itemSize===4?n.w:1)}}u={count:d,texture:y,size:new st(b,M)},i.set(o,u),o.addEventListener("dispose",P)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",a.morphTexture,e);else{let p=0;for(let m=0;m<c.length;m++)p+=c[m];const x=o.morphTargetsRelative?1:1-p;l.getUniforms().setValue(r,"morphTargetBaseInfluence",x),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(r,"morphTargetsTextureSize",u.size)}return{update:s}}function Tb(r,t,e,i,n){let s=new WeakMap;function a(c){const h=n.render.frame,d=c.geometry,u=t.get(c,d);if(s.get(u)!==h&&(t.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==h&&(e.update(c.instanceMatrix,r.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,r.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==h&&(f.update(),s.set(f,h))}return u}function o(){s=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:a,dispose:o}}const Eb={[Ku]:"LINEAR_TONE_MAPPING",[Qu]:"REINHARD_TONE_MAPPING",[ju]:"CINEON_TONE_MAPPING",[Nc]:"ACES_FILMIC_TONE_MAPPING",[ed]:"AGX_TONE_MAPPING",[id]:"NEUTRAL_TONE_MAPPING",[td]:"CUSTOM_TONE_MAPPING"};function Ab(r,t,e,i,n,s){const a=new Ai(t,e,{type:r,depthBuffer:n,stencilBuffer:s,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null;const c=new Zt;c.setAttribute("position",new Rt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Rt([0,2,0,0,2,0],2));const h=new Ed({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Kt(c,h),u=new Ao(-1,1,1,-1,0,1);let f=null,p=null,x=!1,m,g=null,v=[],w=!1;this.setSize=function(_,b){a.setSize(_,b),o!==null&&o.setSize(_,b),l!==null&&l.setSize(_,b);for(let M=0;M<v.length;M++){const A=v[M];A.setSize&&A.setSize(_,b)}},this.setEffects=function(_){v=_,w=v.length>0&&v[0].isRenderPass===!0;const b=a.width,M=a.height;v.length>0&&o===null&&(o=new Ai(b,M,{type:Qi,depthBuffer:!1,stencilBuffer:!1}),l=new Ai(b,M,{type:Qi,depthBuffer:!1,stencilBuffer:!1}));for(let A=0;A<v.length;A++){const y=v[A];y.setSize&&y.setSize(b,M)}},this.begin=function(_,b){if(x||_.toneMapping===Ki&&v.length===0)return!1;if(g=b,b!==null){const M=b.width,A=b.height;(a.width!==M||a.height!==A)&&this.setSize(M,A)}return w===!1&&_.setRenderTarget(a),m=_.toneMapping,_.toneMapping=Ki,!0},this.hasRenderPass=function(){return w},this.end=function(_,b){_.toneMapping=m,x=!0;let M=a,A=o;for(let y=0;y<v.length;y++){const E=v[y];E.enabled!==!1&&(E.render(_,A,M,b),E.needsSwap!==!1&&(M=A,A=A===o?l:o))}if(f!==_.outputColorSpace||p!==_.toneMapping){f=_.outputColorSpace,p=_.toneMapping,h.defines={},oe.getTransfer(f)===ve&&(h.defines.SRGB_TRANSFER="");const y=Eb[p];y&&(h.defines[y]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=M.texture,_.setRenderTarget(g),_.render(d,u),g=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}const qg=new Ie,ku=new Ur(1,1),Jg=new Xc,Yg=new qc,Zg=new wo,bp=[],wp=[],Tp=new Float32Array(16),Ep=new Float32Array(9),Ap=new Float32Array(4);function Zr(r,t,e){const i=r[0];if(i<=0||i>0)return r;const n=t*e;let s=bp[n];if(s===void 0&&(s=new Float32Array(n),bp[n]=s),t!==0){i.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,r[a].toArray(s,o)}return s}function We(r,t){if(r.length!==t.length)return!1;for(let e=0,i=r.length;e<i;e++)if(r[e]!==t[e])return!1;return!0}function Xe(r,t){for(let e=0,i=t.length;e<i;e++)r[e]=t[e]}function vh(r,t){let e=wp[t];e===void 0&&(e=new Int32Array(t),wp[t]=e);for(let i=0;i!==t;++i)e[i]=r.allocateTextureUnit();return e}function Cb(r,t){const e=this.cache;e[0]!==t&&(r.uniform1f(this.addr,t),e[0]=t)}function Rb(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(We(e,t))return;r.uniform2fv(this.addr,t),Xe(e,t)}}function Pb(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(We(e,t))return;r.uniform3fv(this.addr,t),Xe(e,t)}}function Ib(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(We(e,t))return;r.uniform4fv(this.addr,t),Xe(e,t)}}function Lb(r,t){const e=this.cache,i=t.elements;if(i===void 0){if(We(e,t))return;r.uniformMatrix2fv(this.addr,!1,t),Xe(e,t)}else{if(We(e,i))return;Ap.set(i),r.uniformMatrix2fv(this.addr,!1,Ap),Xe(e,i)}}function Nb(r,t){const e=this.cache,i=t.elements;if(i===void 0){if(We(e,t))return;r.uniformMatrix3fv(this.addr,!1,t),Xe(e,t)}else{if(We(e,i))return;Ep.set(i),r.uniformMatrix3fv(this.addr,!1,Ep),Xe(e,i)}}function Ub(r,t){const e=this.cache,i=t.elements;if(i===void 0){if(We(e,t))return;r.uniformMatrix4fv(this.addr,!1,t),Xe(e,t)}else{if(We(e,i))return;Tp.set(i),r.uniformMatrix4fv(this.addr,!1,Tp),Xe(e,i)}}function Db(r,t){const e=this.cache;e[0]!==t&&(r.uniform1i(this.addr,t),e[0]=t)}function Ob(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(We(e,t))return;r.uniform2iv(this.addr,t),Xe(e,t)}}function Fb(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(We(e,t))return;r.uniform3iv(this.addr,t),Xe(e,t)}}function Bb(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(We(e,t))return;r.uniform4iv(this.addr,t),Xe(e,t)}}function zb(r,t){const e=this.cache;e[0]!==t&&(r.uniform1ui(this.addr,t),e[0]=t)}function Vb(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(We(e,t))return;r.uniform2uiv(this.addr,t),Xe(e,t)}}function kb(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(We(e,t))return;r.uniform3uiv(this.addr,t),Xe(e,t)}}function Gb(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(We(e,t))return;r.uniform4uiv(this.addr,t),Xe(e,t)}}function Hb(r,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n);let s;this.type===r.SAMPLER_2D_SHADOW?(ku.compareFunction=e.isReversedDepthBuffer()?Hc:Gc,s=ku):s=qg,e.setTexture2D(t||s,n)}function Wb(r,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),e.setTexture3D(t||Yg,n)}function Xb(r,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),e.setTextureCube(t||Zg,n)}function qb(r,t,e){const i=this.cache,n=e.allocateTextureUnit();i[0]!==n&&(r.uniform1i(this.addr,n),i[0]=n),e.setTexture2DArray(t||Jg,n)}function Jb(r){switch(r){case 5126:return Cb;case 35664:return Rb;case 35665:return Pb;case 35666:return Ib;case 35674:return Lb;case 35675:return Nb;case 35676:return Ub;case 5124:case 35670:return Db;case 35667:case 35671:return Ob;case 35668:case 35672:return Fb;case 35669:case 35673:return Bb;case 5125:return zb;case 36294:return Vb;case 36295:return kb;case 36296:return Gb;case 35678:case 36198:case 36298:case 36306:case 35682:return Hb;case 35679:case 36299:case 36307:return Wb;case 35680:case 36300:case 36308:case 36293:return Xb;case 36289:case 36303:case 36311:case 36292:return qb}}function Yb(r,t){r.uniform1fv(this.addr,t)}function Zb(r,t){const e=Zr(t,this.size,2);r.uniform2fv(this.addr,e)}function $b(r,t){const e=Zr(t,this.size,3);r.uniform3fv(this.addr,e)}function Kb(r,t){const e=Zr(t,this.size,4);r.uniform4fv(this.addr,e)}function Qb(r,t){const e=Zr(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,e)}function jb(r,t){const e=Zr(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,e)}function t1(r,t){const e=Zr(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,e)}function e1(r,t){r.uniform1iv(this.addr,t)}function i1(r,t){r.uniform2iv(this.addr,t)}function n1(r,t){r.uniform3iv(this.addr,t)}function s1(r,t){r.uniform4iv(this.addr,t)}function r1(r,t){r.uniform1uiv(this.addr,t)}function a1(r,t){r.uniform2uiv(this.addr,t)}function o1(r,t){r.uniform3uiv(this.addr,t)}function l1(r,t){r.uniform4uiv(this.addr,t)}function c1(r,t,e){const i=this.cache,n=t.length,s=vh(e,n);We(i,s)||(r.uniform1iv(this.addr,s),Xe(i,s));let a;this.type===r.SAMPLER_2D_SHADOW?a=ku:a=qg;for(let o=0;o!==n;++o)e.setTexture2D(t[o]||a,s[o])}function h1(r,t,e){const i=this.cache,n=t.length,s=vh(e,n);We(i,s)||(r.uniform1iv(this.addr,s),Xe(i,s));for(let a=0;a!==n;++a)e.setTexture3D(t[a]||Yg,s[a])}function u1(r,t,e){const i=this.cache,n=t.length,s=vh(e,n);We(i,s)||(r.uniform1iv(this.addr,s),Xe(i,s));for(let a=0;a!==n;++a)e.setTextureCube(t[a]||Zg,s[a])}function d1(r,t,e){const i=this.cache,n=t.length,s=vh(e,n);We(i,s)||(r.uniform1iv(this.addr,s),Xe(i,s));for(let a=0;a!==n;++a)e.setTexture2DArray(t[a]||Jg,s[a])}function f1(r){switch(r){case 5126:return Yb;case 35664:return Zb;case 35665:return $b;case 35666:return Kb;case 35674:return Qb;case 35675:return jb;case 35676:return t1;case 5124:case 35670:return e1;case 35667:case 35671:return i1;case 35668:case 35672:return n1;case 35669:case 35673:return s1;case 5125:return r1;case 36294:return a1;case 36295:return o1;case 36296:return l1;case 35678:case 36198:case 36298:case 36306:case 35682:return c1;case 35679:case 36299:case 36307:return h1;case 35680:case 36300:case 36308:case 36293:return u1;case 36289:case 36303:case 36311:case 36292:return d1}}class p1{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=Jb(e.type)}}class m1{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=f1(e.type)}}class g1{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const n=this.seq;for(let s=0,a=n.length;s!==a;++s){const o=n[s];o.setValue(t,e[o.id],i)}}}const du=/(\w+)(\])?(\[|\.)?/g;function Cp(r,t){r.seq.push(t),r.map[t.id]=t}function x1(r,t,e){const i=r.name,n=i.length;for(du.lastIndex=0;;){const s=du.exec(i),a=du.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===n){Cp(e,c===void 0?new p1(o,r,t):new m1(o,r,t));break}else{let d=e.map[o];d===void 0&&(d=new g1(o),Cp(e,d)),e=d}}}class Nl{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);x1(o,l,this)}const n=[],s=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?n.push(a):s.push(a);n.length>0&&(this.seq=n.concat(s))}setValue(t,e,i,n){const s=this.map[e];s!==void 0&&s.setValue(t,i,n)}setOptional(t,e,i){const n=e[i];n!==void 0&&this.setValue(t,i,n)}static upload(t,e,i,n){for(let s=0,a=e.length;s!==a;++s){const o=e[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,n)}}static seqWithValue(t,e){const i=[];for(let n=0,s=t.length;n!==s;++n){const a=t[n];a.id in e&&i.push(a)}return i}}function Rp(r,t,e){const i=r.createShader(t);return r.shaderSource(i,e),r.compileShader(i),i}const _1=37297;let y1=0;function v1(r,t){const e=r.split(`
`),i=[],n=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=n;a<s;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}const Pp=new te;function S1(r){oe._getMatrix(Pp,oe.workingColorSpace,r);const t=`mat3( ${Pp.elements.map(e=>e.toFixed(4))} )`;switch(oe.getTransfer(r)){case Fa:return[t,"LinearTransferOETF"];case ve:return[t,"sRGBTransferOETF"];default:return dt("WebGLProgram: Unsupported color space: ",r),[t,"LinearTransferOETF"]}}function Ip(r,t,e){const i=r.getShaderParameter(t,r.COMPILE_STATUS),s=(r.getShaderInfoLog(t)||"").trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+v1(r.getShaderSource(t),o)}else return s}function M1(r,t){const e=S1(t);return[`vec4 ${r}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const b1={[Ku]:"Linear",[Qu]:"Reinhard",[ju]:"Cineon",[Nc]:"ACESFilmic",[ed]:"AgX",[id]:"Neutral",[td]:"Custom"};function w1(r,t){const e=b1[t];return e===void 0?(dt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const bl=new C;function T1(){oe.getLuminanceCoefficients(bl);const r=bl.x.toFixed(4),t=bl.y.toFixed(4),e=bl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function E1(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ga).join(`
`)}function A1(r){const t=[];for(const e in r){const i=r[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function C1(r,t){const e={},i=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let n=0;n<i;n++){const s=r.getActiveAttrib(t,n),a=s.name;let o=1;s.type===r.FLOAT_MAT2&&(o=2),s.type===r.FLOAT_MAT3&&(o=3),s.type===r.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:r.getAttribLocation(t,a),locationSize:o}}return e}function ga(r){return r!==""}function Lp(r,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Np(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const R1=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gu(r){return r.replace(R1,I1)}const P1=new Map;function I1(r,t){let e=ie[t];if(e===void 0){const i=P1.get(t);if(i!==void 0)e=ie[i],dt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Gu(e)}const L1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Up(r){return r.replace(L1,N1)}function N1(r,t,e,i){let n="";for(let s=parseInt(t);s<parseInt(e);s++)n+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return n}function Dp(r){let t=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?t+=`
#define HIGH_PRECISION`:r.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const U1={[Sr]:"SHADOWMAP_TYPE_PCF",[gr]:"SHADOWMAP_TYPE_VSM"};function D1(r){return U1[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const O1={[xn]:"ENVMAP_TYPE_CUBE",[rs]:"ENVMAP_TYPE_CUBE",[Xr]:"ENVMAP_TYPE_CUBE_UV"};function F1(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":O1[r.envMapMode]||"ENVMAP_TYPE_CUBE"}const B1={[rs]:"ENVMAP_MODE_REFRACTION"};function z1(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":B1[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}const V1={[So]:"ENVMAP_BLENDING_MULTIPLY",[Am]:"ENVMAP_BLENDING_MIX",[Cm]:"ENVMAP_BLENDING_ADD"};function k1(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":V1[r.combine]||"ENVMAP_BLENDING_NONE"}function G1(r){const t=r.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function H1(r,t,e,i){const n=r.getContext(),s=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=D1(e),c=F1(e),h=z1(e),d=k1(e),u=G1(e),f=E1(e),p=A1(s),x=n.createProgram();let m,g,v=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(ga).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(ga).join(`
`),g.length>0&&(g+=`
`)):(m=[Dp(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ga).join(`
`),g=[Dp(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ki?"#define TONE_MAPPING":"",e.toneMapping!==Ki?ie.tonemapping_pars_fragment:"",e.toneMapping!==Ki?w1("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ie.colorspace_pars_fragment,M1("linearToOutputTexel",e.outputColorSpace),T1(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ga).join(`
`)),a=Gu(a),a=Lp(a,e),a=Np(a,e),o=Gu(o),o=Lp(o,e),o=Np(o,e),a=Up(a),o=Up(o),e.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",e.glslVersion===Iu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Iu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);const w=v+m+a,_=v+g+o,b=Rp(n,n.VERTEX_SHADER,w),M=Rp(n,n.FRAGMENT_SHADER,_);n.attachShader(x,b),n.attachShader(x,M),e.index0AttributeName!==void 0?n.bindAttribLocation(x,0,e.index0AttributeName):e.hasPositionAttribute===!0&&n.bindAttribLocation(x,0,"position"),n.linkProgram(x);function A(I){if(r.debug.checkShaderErrors){const U=n.getProgramInfoLog(x)||"",V=n.getShaderInfoLog(b)||"",N=n.getShaderInfoLog(M)||"",B=U.trim(),Z=V.trim(),k=N.trim();let nt=!0,J=!0;if(n.getProgramParameter(x,n.LINK_STATUS)===!1)if(nt=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(n,x,b,M);else{const K=Ip(n,b,"vertex"),Q=Ip(n,M,"fragment");Ot("WebGLProgram: Shader Error "+n.getError()+" - VALIDATE_STATUS "+n.getProgramParameter(x,n.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+B+`
`+K+`
`+Q)}else B!==""?dt("WebGLProgram: Program Info Log:",B):(Z===""||k==="")&&(J=!1);J&&(I.diagnostics={runnable:nt,programLog:B,vertexShader:{log:Z,prefix:m},fragmentShader:{log:k,prefix:g}})}n.deleteShader(b),n.deleteShader(M),y=new Nl(n,x),E=C1(n,x)}let y;this.getUniforms=function(){return y===void 0&&A(this),y};let E;this.getAttributes=function(){return E===void 0&&A(this),E};let P=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=n.getProgramParameter(x,_1)),P},this.destroy=function(){i.releaseStatesOfProgram(this),n.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=y1++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=b,this.fragmentShader=M,this}let W1=0;class X1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,i){const n=this._getShaderCacheForMaterial(t);return n.has(e)===!1&&(n.add(e),e.usedTimes++),n.has(i)===!1&&(n.add(i),i.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new q1(t),e.set(t,i)),i}}class q1{constructor(t){this.id=W1++,this.code=t,this.usedTimes=0}}function J1(r){return r===as||r===La||r===Na}function Y1(r,t,e,i,n,s){const a=new is,o=new X1,l=new Set,c=[],h=new Map,d=i.logarithmicDepthBuffer;let u=i.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(y){return l.add(y),y===0?"uv":`uv${y}`}function x(y,E,P,I,U,V){const N=I.fog,B=U.geometry,Z=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?I.environment:null,k=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,nt=t.get(y.envMap||Z,k),J=nt&&nt.mapping===Xr?nt.image.height:null,K=f[y.type];y.precision!==null&&(u=i.getMaxPrecision(y.precision),u!==y.precision&&dt("WebGLProgram.getParameters:",y.precision,"not supported, using",u,"instead."));const Q=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,At=Q!==void 0?Q.length:0;let St=0;B.morphAttributes.position!==void 0&&(St=1),B.morphAttributes.normal!==void 0&&(St=2),B.morphAttributes.color!==void 0&&(St=3);let se,Yt,Qt,q;if(K){const Te=Zi[K];se=Te.vertexShader,Yt=Te.fragmentShader}else{se=y.vertexShader,Yt=y.fragmentShader;const Te=o.getVertexShaderStage(y),_e=o.getFragmentShaderStage(y);o.update(y,Te,_e),Qt=Te.id,q=_e.id}const tt=r.getRenderTarget(),ft=r.state.buffers.depth.getReversed(),Ht=U.isInstancedMesh===!0,wt=U.isBatchedMesh===!0,Wt=!!y.map,fe=!!y.matcap,et=!!nt,at=!!y.aoMap,ot=!!y.lightMap,lt=!!y.bumpMap&&y.wireframe===!1,ht=!!y.normalMap,kt=!!y.displacementMap,Ft=!!y.emissiveMap,Gt=!!y.metalnessMap,qt=!!y.roughnessMap,L=y.anisotropy>0,ce=y.clearcoat>0,jt=y.dispersion>0,R=y.retroreflectivity>0,S=y.iridescence>0,z=y.sheen>0,G=y.transmission>0,X=L&&!!y.anisotropyMap,ct=ce&&!!y.clearcoatMap,ut=ce&&!!y.clearcoatNormalMap,$=ce&&!!y.clearcoatRoughnessMap,it=S&&!!y.iridescenceMap,pt=S&&!!y.iridescenceThicknessMap,Bt=z&&!!y.sheenColorMap,yt=z&&!!y.sheenRoughnessMap,mt=!!y.specularMap,zt=!!y.specularColorMap,Xt=!!y.specularIntensityMap,ee=G&&!!y.transmissionMap,F=G&&!!y.thicknessMap,gt=!!y.gradientMap,j=!!y.alphaMap,xt=y.alphaTest>0,Tt=!!y.alphaHash,rt=!!y.extensions;let Vt=Ki;y.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&(Vt=r.toneMapping);const Ut={shaderID:K,shaderType:y.type,shaderName:y.name,vertexShader:se,fragmentShader:Yt,defines:y.defines,customVertexShaderID:Qt,customFragmentShaderID:q,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:u,batching:wt,batchingColor:wt&&U._colorsTexture!==null,instancing:Ht,instancingColor:Ht&&U.instanceColor!==null,instancingMorph:Ht&&U.morphTexture!==null,outputColorSpace:tt===null?r.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:oe.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:Wt,matcap:fe,envMap:et,envMapMode:et&&nt.mapping,envMapCubeUVHeight:J,aoMap:at,lightMap:ot,bumpMap:lt,normalMap:ht,displacementMap:kt,emissiveMap:Ft,normalMapObjectSpace:ht&&y.normalMapType===Um,normalMapTangentSpace:ht&&y.normalMapType===Dn,packedNormalMap:ht&&y.normalMapType===Dn&&J1(y.normalMap.format),metalnessMap:Gt,roughnessMap:qt,anisotropy:L,anisotropyMap:X,clearcoat:ce,clearcoatMap:ct,clearcoatNormalMap:ut,clearcoatRoughnessMap:$,dispersion:jt,retroreflection:R,iridescence:S,iridescenceMap:it,iridescenceThicknessMap:pt,sheen:z,sheenColorMap:Bt,sheenRoughnessMap:yt,specularMap:mt,specularColorMap:zt,specularIntensityMap:Xt,transmission:G,transmissionMap:ee,thicknessMap:F,gradientMap:gt,opaque:y.transparent===!1&&y.blending===es&&y.alphaToCoverage===!1,alphaMap:j,alphaTest:xt,alphaHash:Tt,combine:y.combine,mapUv:Wt&&p(y.map.channel),aoMapUv:at&&p(y.aoMap.channel),lightMapUv:ot&&p(y.lightMap.channel),bumpMapUv:lt&&p(y.bumpMap.channel),normalMapUv:ht&&p(y.normalMap.channel),displacementMapUv:kt&&p(y.displacementMap.channel),emissiveMapUv:Ft&&p(y.emissiveMap.channel),metalnessMapUv:Gt&&p(y.metalnessMap.channel),roughnessMapUv:qt&&p(y.roughnessMap.channel),anisotropyMapUv:X&&p(y.anisotropyMap.channel),clearcoatMapUv:ct&&p(y.clearcoatMap.channel),clearcoatNormalMapUv:ut&&p(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:$&&p(y.clearcoatRoughnessMap.channel),iridescenceMapUv:it&&p(y.iridescenceMap.channel),iridescenceThicknessMapUv:pt&&p(y.iridescenceThicknessMap.channel),sheenColorMapUv:Bt&&p(y.sheenColorMap.channel),sheenRoughnessMapUv:yt&&p(y.sheenRoughnessMap.channel),specularMapUv:mt&&p(y.specularMap.channel),specularColorMapUv:zt&&p(y.specularColorMap.channel),specularIntensityMapUv:Xt&&p(y.specularIntensityMap.channel),transmissionMapUv:ee&&p(y.transmissionMap.channel),thicknessMapUv:F&&p(y.thicknessMap.channel),alphaMapUv:j&&p(y.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&(ht||L),vertexNormals:!!B.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!B.attributes.uv&&(Wt||j),fog:!!N,useFog:y.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||B.attributes.normal===void 0&&ht===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ft,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:B.attributes.position!==void 0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:At,morphTextureStride:St,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:V.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:y.dithering,shadowMapEnabled:r.shadowMap.enabled&&P.length>0,shadowMapType:r.shadowMap.type,toneMapping:Vt,decodeVideoTexture:Wt&&y.map.isVideoTexture===!0&&oe.getTransfer(y.map.colorSpace)===ve,decodeVideoTextureEmissive:Ft&&y.emissiveMap.isVideoTexture===!0&&oe.getTransfer(y.emissiveMap.colorSpace)===ve,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===zi,flipSided:y.side===ci,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:rt&&y.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(rt&&y.extensions.multiDraw===!0||wt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Ut.vertexUv1s=l.has(1),Ut.vertexUv2s=l.has(2),Ut.vertexUv3s=l.has(3),l.clear(),Ut}function m(y){const E=[];if(y.shaderID?E.push(y.shaderID):(E.push(y.customVertexShaderID),E.push(y.customFragmentShaderID)),y.defines!==void 0)for(const P in y.defines)E.push(P),E.push(y.defines[P]);return y.isRawShaderMaterial===!1&&(g(E,y),v(E,y),E.push(r.outputColorSpace)),E.push(y.customProgramCacheKey),E.join()}function g(y,E){y.push(E.precision),y.push(E.outputColorSpace),y.push(E.envMapMode),y.push(E.envMapCubeUVHeight),y.push(E.mapUv),y.push(E.alphaMapUv),y.push(E.lightMapUv),y.push(E.aoMapUv),y.push(E.bumpMapUv),y.push(E.normalMapUv),y.push(E.displacementMapUv),y.push(E.emissiveMapUv),y.push(E.metalnessMapUv),y.push(E.roughnessMapUv),y.push(E.anisotropyMapUv),y.push(E.clearcoatMapUv),y.push(E.clearcoatNormalMapUv),y.push(E.clearcoatRoughnessMapUv),y.push(E.iridescenceMapUv),y.push(E.iridescenceThicknessMapUv),y.push(E.sheenColorMapUv),y.push(E.sheenRoughnessMapUv),y.push(E.specularMapUv),y.push(E.specularColorMapUv),y.push(E.specularIntensityMapUv),y.push(E.transmissionMapUv),y.push(E.thicknessMapUv),y.push(E.combine),y.push(E.fogExp2),y.push(E.sizeAttenuation),y.push(E.morphTargetsCount),y.push(E.morphAttributeCount),y.push(E.numSunLights),y.push(E.numDirLights),y.push(E.numPointLights),y.push(E.numSpotLights),y.push(E.numSpotLightMaps),y.push(E.numHemiLights),y.push(E.numRectAreaLights),y.push(E.numSunLightShadows),y.push(E.numDirLightShadows),y.push(E.numPointLightShadows),y.push(E.numSpotLightShadows),y.push(E.numSpotLightShadowsWithMaps),y.push(E.numLightProbes),y.push(E.shadowMapType),y.push(E.toneMapping),y.push(E.numClippingPlanes),y.push(E.numClipIntersection),y.push(E.depthPacking)}function v(y,E){a.disableAll(),E.instancing&&a.enable(0),E.instancingColor&&a.enable(1),E.instancingMorph&&a.enable(2),E.matcap&&a.enable(3),E.envMap&&a.enable(4),E.normalMapObjectSpace&&a.enable(5),E.normalMapTangentSpace&&a.enable(6),E.clearcoat&&a.enable(7),E.iridescence&&a.enable(8),E.alphaTest&&a.enable(9),E.vertexColors&&a.enable(10),E.vertexAlphas&&a.enable(11),E.vertexUv1s&&a.enable(12),E.vertexUv2s&&a.enable(13),E.vertexUv3s&&a.enable(14),E.vertexTangents&&a.enable(15),E.anisotropy&&a.enable(16),E.alphaHash&&a.enable(17),E.batching&&a.enable(18),E.dispersion&&a.enable(19),E.retroreflection&&a.enable(24),E.batchingColor&&a.enable(20),E.gradientMap&&a.enable(21),E.packedNormalMap&&a.enable(22),E.vertexNormals&&a.enable(23),y.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.reversedDepthBuffer&&a.enable(4),E.skinning&&a.enable(5),E.morphTargets&&a.enable(6),E.morphNormals&&a.enable(7),E.morphColors&&a.enable(8),E.premultipliedAlpha&&a.enable(9),E.shadowMapEnabled&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),E.decodeVideoTextureEmissive&&a.enable(20),E.alphaToCoverage&&a.enable(21),E.numLightProbeGrids>0&&a.enable(22),E.hasPositionAttribute&&a.enable(23),y.push(a.mask)}function w(y){const E=f[y.type];let P;if(E){const I=Zi[E];P=gg.clone(I.uniforms)}else P=y.uniforms;return P}function _(y,E){let P=h.get(E);return P!==void 0?++P.usedTimes:(P=new H1(r,E,y,n),c.push(P),h.set(E,P)),P}function b(y){if(--y.usedTimes===0){const E=c.indexOf(y);c[E]=c[c.length-1],c.pop(),h.delete(y.cacheKey),y.destroy()}}function M(y){o.remove(y)}function A(){o.dispose()}return{getParameters:x,getProgramCacheKey:m,getUniforms:w,acquireProgram:_,releaseProgram:b,releaseShaderCache:M,programs:c,dispose:A}}function Z1(){let r=new WeakMap;function t(a){return r.has(a)}function e(a){let o=r.get(a);return o===void 0&&(o={},r.set(a,o)),o}function i(a){r.delete(a)}function n(a,o,l){r.get(a)[o]=l}function s(){r=new WeakMap}return{has:t,get:e,remove:i,update:n,dispose:s}}function $1(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.materialVariant!==t.materialVariant?r.materialVariant-t.materialVariant:r.z!==t.z?r.z-t.z:r.id-t.id}function Op(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function Fp(){const r=[];let t=0;const e=[],i=[],n=[];function s(){t=0,e.length=0,i.length=0,n.length=0}function a(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function o(u,f,p,x,m,g){let v=r[t];return v===void 0?(v={id:u.id,object:u,geometry:f,material:p,materialVariant:a(u),groupOrder:x,renderOrder:u.renderOrder,z:m,group:g},r[t]=v):(v.id=u.id,v.object=u,v.geometry=f,v.material=p,v.materialVariant=a(u),v.groupOrder=x,v.renderOrder=u.renderOrder,v.z=m,v.group=g),t++,v}function l(u,f,p,x,m,g,v){v.reversedDepth===!0&&(m=-m);const w=o(u,f,p,x,m,g);p.transmission>0?i.push(w):p.transparent===!0?n.push(w):e.push(w)}function c(u,f,p,x,m,g){const v=o(u,f,p,x,m,g);p.transmission>0?i.unshift(v):p.transparent===!0?n.unshift(v):e.unshift(v)}function h(u,f){e.length>1&&e.sort(u||$1),i.length>1&&i.sort(f||Op),n.length>1&&n.sort(f||Op)}function d(){for(let u=t,f=r.length;u<f;u++){const p=r[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:i,transparent:n,init:s,push:l,unshift:c,finish:d,sort:h}}function K1(){let r=new WeakMap;function t(i,n){const s=r.get(i);let a;return s===void 0?(a=new Fp,r.set(i,[a])):n>=s.length?(a=new Fp,s.push(a)):a=s[n],a}function e(){r=new WeakMap}return{get:t,dispose:e}}function Q1(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new C,color:new bt};break;case"SpotLight":e={position:new C,direction:new C,color:new bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new C,color:new bt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new C,skyColor:new bt,groundColor:new bt};break;case"RectAreaLight":e={color:new bt,position:new C,halfWidth:new C,halfHeight:new C};break}return r[t.id]=e,e}}}function j1(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new st,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=e,e}}}let tw=0;function ew(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function iw(r){const t=new Q1,e=j1(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new C);const n=new C,s=new $t,a=new $t;function o(c){let h=0,d=0,u=0;for(let U=0;U<9;U++)i.probe[U].set(0,0,0);let f=0,p=0,x=0,m=0,g=0,v=0,w=0,_=0,b=0,M=0,A=0,y=0,E=0,P=0;c.sort(ew);for(let U=0,V=c.length;U<V;U++){const N=c[U],B=N.color,Z=N.intensity,k=N.distance;let nt=null;if(N.shadow&&N.shadow.map&&(N.shadow.map.texture.format===as?nt=N.shadow.map.texture:nt=N.shadow.map.depthTexture||N.shadow.map.texture),N.isAmbientLight)h+=B.r*Z,d+=B.g*Z,u+=B.b*Z;else if(N.isLightProbe){for(let J=0;J<9;J++)i.probe[J].addScaledVector(N.sh.coefficients[J],Z);P++}else if(N.isSunLight){const J=t.get(N);if(J.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){const K=N.shadow,Q=e.get(N);Q.shadowIntensity=K.intensity,Q.shadowBias=K.bias,Q.shadowNormalBias=K.normalBias,Q.shadowRadius=K.radius,Q.shadowMapSize.copy(K.mapSize).multiply(K.getFrameExtents()),i.sunShadow[p]=Q,i.sunShadowMap[p]=nt;const At=K.getViewportCount();for(let St=0;St<At;St++)i.sunShadowMatrix[x+St]=K.getMatrix(St),i.sunShadowCascade[x+St]=K._cascadeData[St];x+=At,p++}i.sun[f]=J,f++}else if(N.isDirectionalLight){const J=t.get(N);if(J.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){const K=N.shadow,Q=e.get(N);Q.shadowIntensity=K.intensity,Q.shadowBias=K.bias,Q.shadowNormalBias=K.normalBias,Q.shadowRadius=K.radius,Q.shadowMapSize=K.mapSize,i.directionalShadow[m]=Q,i.directionalShadowMap[m]=nt,i.directionalShadowMatrix[m]=N.shadow.matrix,b++}i.directional[m]=J,m++}else if(N.isSpotLight){const J=t.get(N);J.position.setFromMatrixPosition(N.matrixWorld),J.color.copy(B).multiplyScalar(Z),J.distance=k,J.coneCos=Math.cos(N.angle),J.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),J.decay=N.decay,i.spot[v]=J;const K=N.shadow;if(N.map&&(i.spotLightMap[y]=N.map,y++,K.updateMatrices(N),N.castShadow&&E++),i.spotLightMatrix[v]=K.matrix,N.castShadow){const Q=e.get(N);Q.shadowIntensity=K.intensity,Q.shadowBias=K.bias,Q.shadowNormalBias=K.normalBias,Q.shadowRadius=K.radius,Q.shadowMapSize=K.mapSize,i.spotShadow[v]=Q,i.spotShadowMap[v]=nt,A++}v++}else if(N.isRectAreaLight){const J=t.get(N);J.color.copy(B).multiplyScalar(Z),J.halfWidth.set(N.width*.5,0,0),J.halfHeight.set(0,N.height*.5,0),i.rectArea[w]=J,w++}else if(N.isPointLight){const J=t.get(N);if(J.color.copy(N.color).multiplyScalar(N.intensity),J.distance=N.distance,J.decay=N.decay,N.castShadow){const K=N.shadow,Q=e.get(N);Q.shadowIntensity=K.intensity,Q.shadowBias=K.bias,Q.shadowNormalBias=K.normalBias,Q.shadowRadius=K.radius,Q.shadowMapSize=K.mapSize,Q.shadowCameraNear=K.camera.near,Q.shadowCameraFar=K.camera.far,i.pointShadow[g]=Q,i.pointShadowMap[g]=nt,i.pointShadowMatrix[g]=N.shadow.matrix,M++}i.point[g]=J,g++}else if(N.isHemisphereLight){const J=t.get(N);J.skyColor.copy(N.color).multiplyScalar(Z),J.groundColor.copy(N.groundColor).multiplyScalar(Z),i.hemi[_]=J,_++}}w>0&&(r.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=_t.LTC_FLOAT_1,i.rectAreaLTC2=_t.LTC_FLOAT_2):(i.rectAreaLTC1=_t.LTC_HALF_1,i.rectAreaLTC2=_t.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=d,i.ambient[2]=u;const I=i.hash;(I.sunLength!==f||I.directionalLength!==m||I.pointLength!==g||I.spotLength!==v||I.rectAreaLength!==w||I.hemiLength!==_||I.numSunShadows!==p||I.numDirectionalShadows!==b||I.numPointShadows!==M||I.numSpotShadows!==A||I.numSpotMaps!==y||I.numLightProbes!==P)&&(i.sun.length=f,i.directional.length=m,i.spot.length=v,i.rectArea.length=w,i.point.length=g,i.hemi.length=_,i.sunShadow.length=p,i.sunShadowMap.length=p,i.sunShadowMatrix.length=x,i.sunShadowCascade.length=x,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.directionalShadowMatrix.length=b,i.pointShadow.length=M,i.pointShadowMap.length=M,i.pointShadowMatrix.length=M,i.spotShadow.length=A,i.spotShadowMap.length=A,i.spotLightMatrix.length=A+y-E,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=P,I.sunLength=f,I.directionalLength=m,I.pointLength=g,I.spotLength=v,I.rectAreaLength=w,I.hemiLength=_,I.numSunShadows=p,I.numDirectionalShadows=b,I.numPointShadows=M,I.numSpotShadows=A,I.numSpotMaps=y,I.numLightProbes=P,i.version=tw++)}function l(c,h){let d=0,u=0,f=0,p=0,x=0,m=0;const g=h.matrixWorldInverse;for(let v=0,w=c.length;v<w;v++){const _=c[v];if(_.isSunLight){const b=i.sun[d];b.direction.setFromMatrixPosition(_.matrixWorld),b.direction.transformDirection(g),d++}else if(_.isDirectionalLight){const b=i.directional[u];b.direction.setFromMatrixPosition(_.matrixWorld),n.setFromMatrixPosition(_.target.matrixWorld),b.direction.sub(n),b.direction.transformDirection(g),u++}else if(_.isSpotLight){const b=i.spot[p];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(g),b.direction.setFromMatrixPosition(_.matrixWorld),n.setFromMatrixPosition(_.target.matrixWorld),b.direction.sub(n),b.direction.transformDirection(g),p++}else if(_.isRectAreaLight){const b=i.rectArea[x];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(g),a.identity(),s.copy(_.matrixWorld),s.premultiply(g),a.extractRotation(s),b.halfWidth.set(_.width*.5,0,0),b.halfHeight.set(0,_.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),x++}else if(_.isPointLight){const b=i.point[f];b.position.setFromMatrixPosition(_.matrixWorld),b.position.applyMatrix4(g),f++}else if(_.isHemisphereLight){const b=i.hemi[m];b.direction.setFromMatrixPosition(_.matrixWorld),b.direction.transformDirection(g),m++}}}return{setup:o,setupView:l,state:i}}function Bp(r){const t=new iw(r),e=[],i=[],n=[];function s(u){d.camera=u,e.length=0,i.length=0,n.length=0}function a(u){e.push(u)}function o(u){i.push(u)}function l(u){n.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}const d={lightsArray:e,shadowsArray:i,lightProbeGridArray:n,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:d,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function nw(r){let t=new WeakMap;function e(n,s=0){const a=t.get(n);let o;return a===void 0?(o=new Bp(r),t.set(n,[o])):s>=a.length?(o=new Bp(r),a.push(o)):o=a[s],o}function i(){t=new WeakMap}return{get:e,dispose:i}}const sw=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,rw=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,aw=[new C(1,0,0),new C(-1,0,0),new C(0,1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1)],ow=[new C(0,-1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1),new C(0,-1,0),new C(0,-1,0)],zp=new $t,ua=new C,fu=new C;function lw(r,t,e){let i=new Bs;const n=new st,s=new st,a=new be,o=new Cd,l=new Rd,c={},h=e.maxTextureSize,d={[ss]:ci,[ci]:ss,[zi]:zi},u=new hi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new st},radius:{value:4}},vertexShader:sw,fragmentShader:rw}),f=u.clone();f.defines.HORIZONTAL_PASS=1;const p=new Zt;p.setAttribute("position",new ue(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Kt(p,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Sr;let g=this.type;this.render=function(M,A,y){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||M.length===0)return;this.type===lm&&(dt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Sr);const E=r.getRenderTarget(),P=r.getActiveCubeFace(),I=r.getActiveMipmapLevel(),U=r.state;U.setBlending(pn),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const V=g!==this.type;V&&A.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(B=>B.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,B=M.length;N<B;N++){const Z=M[N],k=Z.shadow;if(k===void 0){dt("WebGLShadowMap:",Z,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;n.copy(k.mapSize);const nt=k.getFrameExtents();n.multiply(nt),s.copy(k.mapSize),(n.x>h||n.y>h)&&(n.x>h&&(s.x=Math.floor(h/nt.x),n.x=s.x*nt.x,k.mapSize.x=s.x),n.y>h&&(s.y=Math.floor(h/nt.y),n.y=s.y*nt.y,k.mapSize.y=s.y));const J=r.state.buffers.depth.getReversed();if(k.camera._reversedDepth=J,k.map===null||V===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===gr){if(Z.isPointLight){dt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new Ai(n.x,n.y,{format:as,type:Qi,minFilter:Ce,magFilter:Ce,generateMipmaps:!1}),k.map.texture.name=Z.name+".shadowMap",k.map.depthTexture=new Ur(n.x,n.y,xi),k.map.depthTexture.name=Z.name+".shadowMapDepth",k.map.depthTexture.format=_n,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Fe,k.map.depthTexture.magFilter=Fe}else Z.isPointLight?(k.map=new kd(n.x),k.map.depthTexture=new ig(n.x,ki)):(k.map=new Ai(n.x,n.y),k.map.depthTexture=new Ur(n.x,n.y,ki)),k.map.depthTexture.name=Z.name+".shadowMap",k.map.depthTexture.format=_n,this.type===Sr?(k.map.depthTexture.compareFunction=J?Hc:Gc,k.map.depthTexture.minFilter=Ce,k.map.depthTexture.magFilter=Ce):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Fe,k.map.depthTexture.magFilter=Fe);k.camera.updateProjectionMatrix()}k.map.isWebGLCubeRenderTarget!==!0&&(k.map.width!==n.x||k.map.height!==n.y)&&k.map.setSize(n.x,n.y);const K=k.map.isWebGLCubeRenderTarget?6:k.getViewportCount();Z.isPointLight!==!0&&k.updateMatrices(Z,y);for(let Q=0;Q<K;Q++){const At=k.getCamera(Q);if(Z.isPointLight){const St=k.camera,se=k.matrix,Yt=Z.distance||St.far;Yt!==St.far&&(St.far=Yt,St.updateProjectionMatrix()),ua.setFromMatrixPosition(Z.matrixWorld),St.position.copy(ua),fu.copy(St.position),fu.add(aw[Q]),St.up.copy(ow[Q]),St.lookAt(fu),St.updateMatrixWorld(),se.makeTranslation(-ua.x,-ua.y,-ua.z),zp.multiplyMatrices(St.projectionMatrix,St.matrixWorldInverse),k._frustum.setFromProjectionMatrix(zp,St.coordinateSystem,St.reversedDepth)}if(k.map.isWebGLCubeRenderTarget)r.setRenderTarget(k.map,Q),r.clear();else{Q===0&&(r.setRenderTarget(k.map),r.clear());const St=k.getViewport(Q);a.set(s.x*St.x,s.y*St.y,s.x*St.z,s.y*St.w),U.viewport(a)}i=k.getFrustum(Q),_(A,y,At,Z,this.type)}k.isPointLightShadow!==!0&&this.type===gr&&v(k,y),k.needsUpdate=!1}g=this.type,m.needsUpdate=!1,r.setRenderTarget(E,P,I)};function v(M,A){const y=t.update(x);u.defines.VSM_SAMPLES!==M.blurSamples&&(u.defines.VSM_SAMPLES=M.blurSamples,f.defines.VSM_SAMPLES=M.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),M.mapPass===null?M.mapPass=new Ai(n.x,n.y,{format:as,type:Qi}):(M.mapPass.width!==M.map.width||M.mapPass.height!==M.map.height)&&M.mapPass.setSize(M.map.width,M.map.height),u.uniforms.shadow_pass.value=M.map.depthTexture,u.uniforms.resolution.value.set(M.map.width,M.map.height),u.uniforms.radius.value=M.radius,r.setRenderTarget(M.mapPass),r.clear(),r.renderBufferDirect(A,null,y,u,x,null),f.uniforms.shadow_pass.value=M.mapPass.texture,f.uniforms.resolution.value.set(M.map.width,M.map.height),f.uniforms.radius.value=M.radius,r.setRenderTarget(M.map),r.clear(),r.renderBufferDirect(A,null,y,f,x,null)}function w(M,A,y,E){let P=null;const I=y.isPointLight===!0?M.customDistanceMaterial:M.customDepthMaterial;if(I!==void 0)P=I;else if(P=y.isPointLight===!0?l:o,r.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){const U=P.uuid,V=A.uuid;let N=c[U];N===void 0&&(N={},c[U]=N);let B=N[V];B===void 0&&(B=P.clone(),N[V]=B,A.addEventListener("dispose",b)),P=B}if(P.visible=A.visible,P.wireframe=A.wireframe,E===gr?P.side=A.shadowSide!==null?A.shadowSide:A.side:P.side=A.shadowSide!==null?A.shadowSide:d[A.side],P.alphaMap=A.alphaMap,P.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,P.map=A.map,P.clipShadows=A.clipShadows,P.clippingPlanes=A.clippingPlanes,P.clipIntersection=A.clipIntersection,P.displacementMap=A.displacementMap,P.displacementScale=A.displacementScale,P.displacementBias=A.displacementBias,P.wireframeLinewidth=A.wireframeLinewidth,P.linewidth=A.linewidth,y.isPointLight===!0&&P.isMeshDistanceMaterial===!0){const U=r.properties.get(P);U.light=y}return P}function _(M,A,y,E,P){if(M.visible===!1)return;if(M.layers.test(A.layers)&&(M.isMesh||M.isLine||M.isPoints)&&(M.castShadow||M.receiveShadow&&P===gr)&&(!M.frustumCulled||M.intersectsFrustum(i))){M.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,M.matrixWorld);const V=t.update(M),N=M.material;if(Array.isArray(N)){const B=V.groups;for(let Z=0,k=B.length;Z<k;Z++){const nt=B[Z],J=N[nt.materialIndex];if(J&&J.visible){const K=w(M,J,E,P);M.onBeforeShadow(r,M,A,y,V,K,nt),r.renderBufferDirect(y,null,V,K,M,nt),M.onAfterShadow(r,M,A,y,V,K,nt)}}}else if(N.visible){const B=w(M,N,E,P);M.onBeforeShadow(r,M,A,y,V,B,null),r.renderBufferDirect(y,null,V,B,M,null),M.onAfterShadow(r,M,A,y,V,B,null)}}const U=M.children;for(let V=0,N=U.length;V<N;V++)_(U[V],A,y,E,P)}function b(M){M.target.removeEventListener("dispose",b);for(const y in c){const E=c[y],P=M.target.uuid;P in E&&(E[P].dispose(),delete E[P])}}}function cw(r,t){function e(){let F=!1;const gt=new be;let j=null;const xt=new be(0,0,0,0);return{setMask:function(Tt){j!==Tt&&!F&&(r.colorMask(Tt,Tt,Tt,Tt),j=Tt)},setLocked:function(Tt){F=Tt},setClear:function(Tt,rt,Vt,Ut,Te){Te===!0&&(Tt*=Ut,rt*=Ut,Vt*=Ut),gt.set(Tt,rt,Vt,Ut),xt.equals(gt)===!1&&(r.clearColor(Tt,rt,Vt,Ut),xt.copy(gt))},reset:function(){F=!1,j=null,xt.set(-1,0,0,0)}}}function i(){let F=!1,gt=!1,j=null,xt=null,Tt=null;return{setReversed:function(rt){if(gt!==rt){const Vt=t.get("EXT_clip_control");rt?Vt.clipControlEXT(Vt.LOWER_LEFT_EXT,Vt.ZERO_TO_ONE_EXT):Vt.clipControlEXT(Vt.LOWER_LEFT_EXT,Vt.NEGATIVE_ONE_TO_ONE_EXT),gt=rt;const Ut=Tt;Tt=null,this.setClear(Ut)}},getReversed:function(){return gt},setTest:function(rt){rt?tt(r.DEPTH_TEST):ft(r.DEPTH_TEST)},setMask:function(rt){j!==rt&&!F&&(r.depthMask(rt),j=rt)},setFunc:function(rt){if(gt&&(rt=Mx[rt]),xt!==rt){switch(rt){case Fl:r.depthFunc(r.NEVER);break;case Bl:r.depthFunc(r.ALWAYS);break;case zl:r.depthFunc(r.LESS);break;case Rr:r.depthFunc(r.LEQUAL);break;case Vl:r.depthFunc(r.EQUAL);break;case kl:r.depthFunc(r.GEQUAL);break;case Gl:r.depthFunc(r.GREATER);break;case Hl:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}xt=rt}},setLocked:function(rt){F=rt},setClear:function(rt){Tt!==rt&&(Tt=rt,gt&&(rt=1-rt),r.clearDepth(rt))},reset:function(){F=!1,j=null,xt=null,Tt=null,gt=!1}}}function n(){let F=!1,gt=null,j=null,xt=null,Tt=null,rt=null,Vt=null,Ut=null,Te=null;return{setTest:function(_e){F||(_e?tt(r.STENCIL_TEST):ft(r.STENCIL_TEST))},setMask:function(_e){gt!==_e&&!F&&(r.stencilMask(_e),gt=_e)},setFunc:function(_e,Hi,nn){(j!==_e||xt!==Hi||Tt!==nn)&&(r.stencilFunc(_e,Hi,nn),j=_e,xt=Hi,Tt=nn)},setOp:function(_e,Hi,nn){(rt!==_e||Vt!==Hi||Ut!==nn)&&(r.stencilOp(_e,Hi,nn),rt=_e,Vt=Hi,Ut=nn)},setLocked:function(_e){F=_e},setClear:function(_e){Te!==_e&&(r.clearStencil(_e),Te=_e)},reset:function(){F=!1,gt=null,j=null,xt=null,Tt=null,rt=null,Vt=null,Ut=null,Te=null}}}const s=new e,a=new i,o=new n,l=new WeakMap,c=new WeakMap;let h={},d={},u={},f=new WeakMap,p=[],x=null,m=!1,g=null,v=null,w=null,_=null,b=null,M=null,A=null,y=new bt(0,0,0),E=0,P=!1,I=null,U=null,V=null,N=null,B=null;const Z=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,nt=0;const J=r.getParameter(r.VERSION);J.indexOf("WebGL")!==-1?(nt=parseFloat(/^WebGL (\d)/.exec(J)[1]),k=nt>=1):J.indexOf("OpenGL ES")!==-1&&(nt=parseFloat(/^OpenGL ES (\d)/.exec(J)[1]),k=nt>=2);let K=null,Q={};const At=r.getParameter(r.SCISSOR_BOX),St=r.getParameter(r.VIEWPORT),se=new be().fromArray(At),Yt=new be().fromArray(St);function Qt(F,gt,j,xt){const Tt=new Uint8Array(4),rt=r.createTexture();r.bindTexture(F,rt),r.texParameteri(F,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(F,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Vt=0;Vt<j;Vt++)F===r.TEXTURE_3D||F===r.TEXTURE_2D_ARRAY?r.texImage3D(gt,0,r.RGBA,1,1,xt,0,r.RGBA,r.UNSIGNED_BYTE,Tt):r.texImage2D(gt+Vt,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Tt);return rt}const q={};q[r.TEXTURE_2D]=Qt(r.TEXTURE_2D,r.TEXTURE_2D,1),q[r.TEXTURE_CUBE_MAP]=Qt(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),q[r.TEXTURE_2D_ARRAY]=Qt(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),q[r.TEXTURE_3D]=Qt(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),tt(r.DEPTH_TEST),a.setFunc(Rr),lt(!1),ht(Eu),tt(r.CULL_FACE),at(pn);function tt(F){h[F]!==!0&&(r.enable(F),h[F]=!0)}function ft(F){h[F]!==!1&&(r.disable(F),h[F]=!1)}function Ht(F,gt){return u[F]!==gt?(r.bindFramebuffer(F,gt),u[F]=gt,F===r.DRAW_FRAMEBUFFER&&(u[r.FRAMEBUFFER]=gt),F===r.FRAMEBUFFER&&(u[r.DRAW_FRAMEBUFFER]=gt),!0):!1}function wt(F,gt){let j=p,xt=!1;if(F){j=f.get(gt),j===void 0&&(j=[],f.set(gt,j));const Tt=F.textures;if(j.length!==Tt.length||j[0]!==r.COLOR_ATTACHMENT0){for(let rt=0,Vt=Tt.length;rt<Vt;rt++)j[rt]=r.COLOR_ATTACHMENT0+rt;j.length=Tt.length,xt=!0}}else j[0]!==r.BACK&&(j[0]=r.BACK,xt=!0);xt&&r.drawBuffers(j)}function Wt(F){return x!==F?(r.useProgram(F),x=F,!0):!1}const fe={[Rs]:r.FUNC_ADD,[hm]:r.FUNC_SUBTRACT,[um]:r.FUNC_REVERSE_SUBTRACT};fe[dm]=r.MIN,fe[fm]=r.MAX;const et={[pm]:r.ZERO,[mm]:r.ONE,[gm]:r.SRC_COLOR,[Zu]:r.SRC_ALPHA,[Mm]:r.SRC_ALPHA_SATURATE,[vm]:r.DST_COLOR,[_m]:r.DST_ALPHA,[xm]:r.ONE_MINUS_SRC_COLOR,[$u]:r.ONE_MINUS_SRC_ALPHA,[Sm]:r.ONE_MINUS_DST_COLOR,[ym]:r.ONE_MINUS_DST_ALPHA,[bm]:r.CONSTANT_COLOR,[wm]:r.ONE_MINUS_CONSTANT_COLOR,[Tm]:r.CONSTANT_ALPHA,[Em]:r.ONE_MINUS_CONSTANT_ALPHA};function at(F,gt,j,xt,Tt,rt,Vt,Ut,Te,_e){if(F===pn){m===!0&&(ft(r.BLEND),m=!1);return}if(m===!1&&(tt(r.BLEND),m=!0),F!==cm){if(F!==g||_e!==P){if((v!==Rs||b!==Rs)&&(r.blendEquation(r.FUNC_ADD),v=Rs,b=Rs),_e)switch(F){case es:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Cr:r.blendFunc(r.ONE,r.ONE);break;case Au:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Cu:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:Ot("WebGLState: Invalid blending: ",F);break}else switch(F){case es:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Cr:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case Au:Ot("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Cu:Ot("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ot("WebGLState: Invalid blending: ",F);break}w=null,_=null,M=null,A=null,y.set(0,0,0),E=0,g=F,P=_e}return}Tt=Tt||gt,rt=rt||j,Vt=Vt||xt,(gt!==v||Tt!==b)&&(r.blendEquationSeparate(fe[gt],fe[Tt]),v=gt,b=Tt),(j!==w||xt!==_||rt!==M||Vt!==A)&&(r.blendFuncSeparate(et[j],et[xt],et[rt],et[Vt]),w=j,_=xt,M=rt,A=Vt),(Ut.equals(y)===!1||Te!==E)&&(r.blendColor(Ut.r,Ut.g,Ut.b,Te),y.copy(Ut),E=Te),g=F,P=!1}function ot(F,gt){F.side===zi?ft(r.CULL_FACE):tt(r.CULL_FACE);let j=F.side===ci;gt&&(j=!j),lt(j),F.blending===es&&F.transparent===!1?at(pn):at(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),s.setMask(F.colorWrite);const xt=F.stencilWrite;o.setTest(xt),xt&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Ft(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?tt(r.SAMPLE_ALPHA_TO_COVERAGE):ft(r.SAMPLE_ALPHA_TO_COVERAGE)}function lt(F){I!==F&&(F?r.frontFace(r.CW):r.frontFace(r.CCW),I=F)}function ht(F){F!==am?(tt(r.CULL_FACE),F!==U&&(F===Eu?r.cullFace(r.BACK):F===om?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):ft(r.CULL_FACE),U=F}function kt(F){F!==V&&(k&&r.lineWidth(F),V=F)}function Ft(F,gt,j){F?(tt(r.POLYGON_OFFSET_FILL),(N!==gt||B!==j)&&(N=gt,B=j,a.getReversed()&&(gt=-gt),r.polygonOffset(gt,j))):ft(r.POLYGON_OFFSET_FILL)}function Gt(F){F?tt(r.SCISSOR_TEST):ft(r.SCISSOR_TEST)}function qt(F){F===void 0&&(F=r.TEXTURE0+Z-1),K!==F&&(r.activeTexture(F),K=F)}function L(F,gt,j){j===void 0&&(K===null?j=r.TEXTURE0+Z-1:j=K);let xt=Q[j];xt===void 0&&(xt={type:void 0,texture:void 0},Q[j]=xt),(xt.type!==F||xt.texture!==gt)&&(K!==j&&(r.activeTexture(j),K=j),r.bindTexture(F,gt||q[F]),xt.type=F,xt.texture=gt)}function ce(){const F=Q[K];F!==void 0&&F.type!==void 0&&(r.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function jt(){try{r.compressedTexImage2D(...arguments)}catch(F){Ot("WebGLState:",F)}}function R(){try{r.compressedTexImage3D(...arguments)}catch(F){Ot("WebGLState:",F)}}function S(){try{r.texSubImage2D(...arguments)}catch(F){Ot("WebGLState:",F)}}function z(){try{r.texSubImage3D(...arguments)}catch(F){Ot("WebGLState:",F)}}function G(){try{r.compressedTexSubImage2D(...arguments)}catch(F){Ot("WebGLState:",F)}}function X(){try{r.compressedTexSubImage3D(...arguments)}catch(F){Ot("WebGLState:",F)}}function ct(){try{r.texStorage2D(...arguments)}catch(F){Ot("WebGLState:",F)}}function ut(){try{r.texStorage3D(...arguments)}catch(F){Ot("WebGLState:",F)}}function $(){try{r.texImage2D(...arguments)}catch(F){Ot("WebGLState:",F)}}function it(){try{r.texImage3D(...arguments)}catch(F){Ot("WebGLState:",F)}}function pt(F){return d[F]!==void 0?d[F]:r.getParameter(F)}function Bt(F,gt){d[F]!==gt&&(r.pixelStorei(F,gt),d[F]=gt)}function yt(F){se.equals(F)===!1&&(r.scissor(F.x,F.y,F.z,F.w),se.copy(F))}function mt(F){Yt.equals(F)===!1&&(r.viewport(F.x,F.y,F.z,F.w),Yt.copy(F))}function zt(F,gt){let j=c.get(gt);j===void 0&&(j=new WeakMap,c.set(gt,j));let xt=j.get(F);xt===void 0&&(xt=r.getUniformBlockIndex(gt,F.name),j.set(F,xt))}function Xt(F,gt){const xt=c.get(gt).get(F);l.get(gt)!==xt&&(r.uniformBlockBinding(gt,xt,F.__bindingPointIndex),l.set(gt,xt))}function ee(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),r.pixelStorei(r.PACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,r.BROWSER_DEFAULT_WEBGL),r.pixelStorei(r.PACK_ROW_LENGTH,0),r.pixelStorei(r.PACK_SKIP_PIXELS,0),r.pixelStorei(r.PACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_ROW_LENGTH,0),r.pixelStorei(r.UNPACK_IMAGE_HEIGHT,0),r.pixelStorei(r.UNPACK_SKIP_PIXELS,0),r.pixelStorei(r.UNPACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_SKIP_IMAGES,0),h={},d={},K=null,Q={},u={},f=new WeakMap,p=[],x=null,m=!1,g=null,v=null,w=null,_=null,b=null,M=null,A=null,y=new bt(0,0,0),E=0,P=!1,I=null,U=null,V=null,N=null,B=null,se.set(0,0,r.canvas.width,r.canvas.height),Yt.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:tt,disable:ft,bindFramebuffer:Ht,drawBuffers:wt,useProgram:Wt,setBlending:at,setMaterial:ot,setFlipSided:lt,setCullFace:ht,setLineWidth:kt,setPolygonOffset:Ft,setScissorTest:Gt,activeTexture:qt,bindTexture:L,unbindTexture:ce,compressedTexImage2D:jt,compressedTexImage3D:R,texImage2D:$,texImage3D:it,pixelStorei:Bt,getParameter:pt,updateUBOMapping:zt,uniformBlockBinding:Xt,texStorage2D:ct,texStorage3D:ut,texSubImage2D:S,texSubImage3D:z,compressedTexSubImage2D:G,compressedTexSubImage3D:X,scissor:yt,viewport:mt,reset:ee}}function hw(r,t,e,i,n,s,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new st,h=new WeakMap,d=new Set;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(R,S){return p?new OffscreenCanvas(R,S):Ba("canvas")}function m(R,S,z){let G=1;const X=jt(R);if((X.width>z||X.height>z)&&(G=z/Math.max(X.width,X.height)),G<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const ct=Math.floor(G*X.width),ut=Math.floor(G*X.height);u===void 0&&(u=x(ct,ut));const $=S?x(ct,ut):u;return $.width=ct,$.height=ut,$.getContext("2d").drawImage(R,0,0,ct,ut),dt("WebGLRenderer: Texture has been resized from ("+X.width+"x"+X.height+") to ("+ct+"x"+ut+")."),$}else return"data"in R&&dt("WebGLRenderer: Image in DataTexture is too big ("+X.width+"x"+X.height+")."),R;return R}function g(R){return R.generateMipmaps}function v(R){r.generateMipmap(R)}function w(R){return R.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?r.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function _(R,S,z,G,X,ct=!1){if(R!==null){if(r[R]!==void 0)return r[R];dt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let ut;G&&(ut=t.get("EXT_texture_norm16"),ut||dt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let $=S;if(S===r.RED&&(z===r.FLOAT&&($=r.R32F),z===r.HALF_FLOAT&&($=r.R16F),z===r.UNSIGNED_BYTE&&($=r.R8),z===r.UNSIGNED_SHORT&&ut&&($=ut.R16_EXT),z===r.SHORT&&ut&&($=ut.R16_SNORM_EXT)),S===r.RED_INTEGER&&(z===r.UNSIGNED_BYTE&&($=r.R8UI),z===r.UNSIGNED_SHORT&&($=r.R16UI),z===r.UNSIGNED_INT&&($=r.R32UI),z===r.BYTE&&($=r.R8I),z===r.SHORT&&($=r.R16I),z===r.INT&&($=r.R32I)),S===r.RG&&(z===r.FLOAT&&($=r.RG32F),z===r.HALF_FLOAT&&($=r.RG16F),z===r.UNSIGNED_BYTE&&($=r.RG8),z===r.UNSIGNED_SHORT&&ut&&($=ut.RG16_EXT),z===r.SHORT&&ut&&($=ut.RG16_SNORM_EXT)),S===r.RG_INTEGER&&(z===r.UNSIGNED_BYTE&&($=r.RG8UI),z===r.UNSIGNED_SHORT&&($=r.RG16UI),z===r.UNSIGNED_INT&&($=r.RG32UI),z===r.BYTE&&($=r.RG8I),z===r.SHORT&&($=r.RG16I),z===r.INT&&($=r.RG32I)),S===r.RGB_INTEGER&&(z===r.UNSIGNED_BYTE&&($=r.RGB8UI),z===r.UNSIGNED_SHORT&&($=r.RGB16UI),z===r.UNSIGNED_INT&&($=r.RGB32UI),z===r.BYTE&&($=r.RGB8I),z===r.SHORT&&($=r.RGB16I),z===r.INT&&($=r.RGB32I)),S===r.RGBA_INTEGER&&(z===r.UNSIGNED_BYTE&&($=r.RGBA8UI),z===r.UNSIGNED_SHORT&&($=r.RGBA16UI),z===r.UNSIGNED_INT&&($=r.RGBA32UI),z===r.BYTE&&($=r.RGBA8I),z===r.SHORT&&($=r.RGBA16I),z===r.INT&&($=r.RGBA32I)),S===r.RGB&&(z===r.UNSIGNED_SHORT&&ut&&($=ut.RGB16_EXT),z===r.SHORT&&ut&&($=ut.RGB16_SNORM_EXT),z===r.UNSIGNED_INT_5_9_9_9_REV&&($=r.RGB9_E5),z===r.UNSIGNED_INT_10F_11F_11F_REV&&($=r.R11F_G11F_B10F)),S===r.RGBA){const it=ct?Fa:oe.getTransfer(X);z===r.FLOAT&&($=r.RGBA32F),z===r.HALF_FLOAT&&($=r.RGBA16F),z===r.UNSIGNED_BYTE&&($=it===ve?r.SRGB8_ALPHA8:r.RGBA8),z===r.UNSIGNED_SHORT&&ut&&($=ut.RGBA16_EXT),z===r.SHORT&&ut&&($=ut.RGBA16_SNORM_EXT),z===r.UNSIGNED_SHORT_4_4_4_4&&($=r.RGBA4),z===r.UNSIGNED_SHORT_5_5_5_1&&($=r.RGB5_A1)}return($===r.R16F||$===r.R32F||$===r.RG16F||$===r.RG32F||$===r.RGBA16F||$===r.RGBA32F)&&t.get("EXT_color_buffer_float"),$}function b(R,S){let z;return R?S===null||S===ki||S===Lr?z=r.DEPTH24_STENCIL8:S===xi?z=r.DEPTH32F_STENCIL8:S===Ir&&(z=r.DEPTH24_STENCIL8,dt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===ki||S===Lr?z=r.DEPTH_COMPONENT24:S===xi?z=r.DEPTH_COMPONENT32F:S===Ir&&(z=r.DEPTH_COMPONENT16),z}function M(R,S){return g(R)===!0||R.isFramebufferTexture&&R.minFilter!==Fe&&R.minFilter!==Ce?Math.log2(Math.max(S.width,S.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?S.mipmaps.length:1}function A(R){const S=R.target;S.removeEventListener("dispose",A),E(S),S.isVideoTexture&&h.delete(S),S.isHTMLTexture&&d.delete(S)}function y(R){const S=R.target;S.removeEventListener("dispose",y),I(S)}function E(R){const S=i.get(R);if(S.__webglInit===void 0)return;const z=R.source,G=f.get(z);if(G){const X=G[S.__cacheKey];X.usedTimes--,X.usedTimes===0&&P(R),Object.keys(G).length===0&&f.delete(z)}i.remove(R)}function P(R){const S=i.get(R);r.deleteTexture(S.__webglTexture);const z=R.source,G=f.get(z);delete G[S.__cacheKey],a.memory.textures--}function I(R){const S=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let G=0;G<6;G++){if(Array.isArray(S.__webglFramebuffer[G]))for(let X=0;X<S.__webglFramebuffer[G].length;X++)r.deleteFramebuffer(S.__webglFramebuffer[G][X]);else r.deleteFramebuffer(S.__webglFramebuffer[G]);S.__webglDepthbuffer&&r.deleteRenderbuffer(S.__webglDepthbuffer[G])}else{if(Array.isArray(S.__webglFramebuffer))for(let G=0;G<S.__webglFramebuffer.length;G++)r.deleteFramebuffer(S.__webglFramebuffer[G]);else r.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&r.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&r.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let G=0;G<S.__webglColorRenderbuffer.length;G++)S.__webglColorRenderbuffer[G]&&r.deleteRenderbuffer(S.__webglColorRenderbuffer[G]);S.__webglDepthRenderbuffer&&r.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const z=R.textures;for(let G=0,X=z.length;G<X;G++){const ct=i.get(z[G]);ct.__webglTexture&&(r.deleteTexture(ct.__webglTexture),a.memory.textures--),i.remove(z[G])}i.remove(R)}let U=0;function V(){U=0}function N(){return U}function B(R){U=R}function Z(){const R=U;return R>=n.maxTextures&&dt("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+n.maxTextures),U+=1,R}function k(R){const S=[];return S.push(R.wrapS),S.push(R.wrapT),S.push(R.wrapR||0),S.push(R.magFilter),S.push(R.minFilter),S.push(R.anisotropy),S.push(R.internalFormat),S.push(R.format),S.push(R.type),S.push(R.generateMipmaps),S.push(R.premultiplyAlpha),S.push(R.flipY),S.push(R.unpackAlignment),S.push(R.colorSpace),S.join()}function nt(R,S){const z=i.get(R);if(R.isVideoTexture&&L(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&z.__version!==R.version){const G=R.image;if(G===null)dt("WebGLRenderer: Texture marked for update but no image data found.");else if(G.complete===!1)dt("WebGLRenderer: Texture marked for update but image is incomplete");else{ft(z,R,S);return}}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(r.TEXTURE_2D,z.__webglTexture,r.TEXTURE0+S)}function J(R,S){const z=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){ft(z,R,S);return}else R.isExternalTexture&&(z.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(r.TEXTURE_2D_ARRAY,z.__webglTexture,r.TEXTURE0+S)}function K(R,S){const z=i.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&z.__version!==R.version){ft(z,R,S);return}e.bindTexture(r.TEXTURE_3D,z.__webglTexture,r.TEXTURE0+S)}function Q(R,S){const z=i.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&z.__version!==R.version){Ht(z,R,S);return}e.bindTexture(r.TEXTURE_CUBE_MAP,z.__webglTexture,r.TEXTURE0+S)}const At={[Pr]:r.REPEAT,[Ei]:r.CLAMP_TO_EDGE,[Ia]:r.MIRRORED_REPEAT},St={[Fe]:r.NEAREST,[nd]:r.NEAREST_MIPMAP_NEAREST,[xr]:r.NEAREST_MIPMAP_LINEAR,[Ce]:r.LINEAR,[Sa]:r.LINEAR_MIPMAP_NEAREST,[un]:r.LINEAR_MIPMAP_LINEAR},se={[Om]:r.NEVER,[km]:r.ALWAYS,[Fm]:r.LESS,[Gc]:r.LEQUAL,[Bm]:r.EQUAL,[Hc]:r.GEQUAL,[zm]:r.GREATER,[Vm]:r.NOTEQUAL};function Yt(R,S){if(S.type===xi&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===Ce||S.magFilter===Sa||S.magFilter===xr||S.magFilter===un||S.minFilter===Ce||S.minFilter===Sa||S.minFilter===xr||S.minFilter===un)&&dt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(R,r.TEXTURE_WRAP_S,At[S.wrapS]),r.texParameteri(R,r.TEXTURE_WRAP_T,At[S.wrapT]),(R===r.TEXTURE_3D||R===r.TEXTURE_2D_ARRAY)&&r.texParameteri(R,r.TEXTURE_WRAP_R,At[S.wrapR]),r.texParameteri(R,r.TEXTURE_MAG_FILTER,St[S.magFilter]),r.texParameteri(R,r.TEXTURE_MIN_FILTER,St[S.minFilter]),S.compareFunction&&(r.texParameteri(R,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(R,r.TEXTURE_COMPARE_FUNC,se[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===Fe||S.minFilter!==xr&&S.minFilter!==un||S.type===xi&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){const z=t.get("EXT_texture_filter_anisotropic");r.texParameterf(R,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,n.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function Qt(R,S){let z=!1;R.__webglInit===void 0&&(R.__webglInit=!0,S.addEventListener("dispose",A));const G=S.source;let X=f.get(G);X===void 0&&(X={},f.set(G,X));const ct=k(S);if(ct!==R.__cacheKey){X[ct]===void 0&&(X[ct]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,z=!0),X[ct].usedTimes++;const ut=X[R.__cacheKey];ut!==void 0&&(X[R.__cacheKey].usedTimes--,ut.usedTimes===0&&P(S)),R.__cacheKey=ct,R.__webglTexture=X[ct].texture}return z}function q(R,S,z){return Math.floor(Math.floor(R/z)/S)}function tt(R,S,z,G){const ct=R.updateRanges;if(ct.length===0)e.texSubImage2D(r.TEXTURE_2D,0,0,0,S.width,S.height,z,G,S.data);else{ct.sort((Bt,yt)=>Bt.start-yt.start);let ut=0;for(let Bt=1;Bt<ct.length;Bt++){const yt=ct[ut],mt=ct[Bt],zt=yt.start+yt.count,Xt=q(mt.start,S.width,4),ee=q(yt.start,S.width,4);mt.start<=zt+1&&Xt===ee&&q(mt.start+mt.count-1,S.width,4)===Xt?yt.count=Math.max(yt.count,mt.start+mt.count-yt.start):(++ut,ct[ut]=mt)}ct.length=ut+1;const $=e.getParameter(r.UNPACK_ROW_LENGTH),it=e.getParameter(r.UNPACK_SKIP_PIXELS),pt=e.getParameter(r.UNPACK_SKIP_ROWS);e.pixelStorei(r.UNPACK_ROW_LENGTH,S.width);for(let Bt=0,yt=ct.length;Bt<yt;Bt++){const mt=ct[Bt],zt=Math.floor(mt.start/4),Xt=Math.ceil(mt.count/4),ee=zt%S.width,F=Math.floor(zt/S.width),gt=Xt,j=1;e.pixelStorei(r.UNPACK_SKIP_PIXELS,ee),e.pixelStorei(r.UNPACK_SKIP_ROWS,F),e.texSubImage2D(r.TEXTURE_2D,0,ee,F,gt,j,z,G,S.data)}R.clearUpdateRanges(),e.pixelStorei(r.UNPACK_ROW_LENGTH,$),e.pixelStorei(r.UNPACK_SKIP_PIXELS,it),e.pixelStorei(r.UNPACK_SKIP_ROWS,pt)}}function ft(R,S,z){let G=r.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(G=r.TEXTURE_2D_ARRAY),S.isData3DTexture&&(G=r.TEXTURE_3D);const X=Qt(R,S),ct=S.source;e.bindTexture(G,R.__webglTexture,r.TEXTURE0+z);const ut=i.get(ct);if(ct.version!==ut.__version||X===!0){if(e.activeTexture(r.TEXTURE0+z),(typeof ImageBitmap<"u"&&S.image instanceof ImageBitmap)===!1){const j=oe.getPrimaries(oe.workingColorSpace),xt=S.colorSpace===Rn?null:oe.getPrimaries(S.colorSpace),Tt=S.colorSpace===Rn||j===xt?r.NONE:r.BROWSER_DEFAULT_WEBGL;e.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,S.flipY),e.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),e.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Tt)}e.pixelStorei(r.UNPACK_ALIGNMENT,S.unpackAlignment);let it=m(S.image,!1,n.maxTextureSize);it=ce(S,it);const pt=s.convert(S.format,S.colorSpace),Bt=s.convert(S.type);let yt=_(S.internalFormat,pt,Bt,S.normalized,S.colorSpace,S.isVideoTexture);Yt(G,S);let mt;const zt=S.mipmaps,Xt=S.isVideoTexture!==!0,ee=ut.__version===void 0||X===!0,F=ct.dataReady,gt=M(S,it);if(S.isDepthTexture)yt=b(S.format===Kn,S.type),ee&&(Xt?e.texStorage2D(r.TEXTURE_2D,1,yt,it.width,it.height):e.texImage2D(r.TEXTURE_2D,0,yt,it.width,it.height,0,pt,Bt,null));else if(S.isDataTexture)if(zt.length>0){Xt&&ee&&e.texStorage2D(r.TEXTURE_2D,gt,yt,zt[0].width,zt[0].height);for(let j=0,xt=zt.length;j<xt;j++)mt=zt[j],Xt?F&&e.texSubImage2D(r.TEXTURE_2D,j,0,0,mt.width,mt.height,pt,Bt,mt.data):e.texImage2D(r.TEXTURE_2D,j,yt,mt.width,mt.height,0,pt,Bt,mt.data);S.generateMipmaps=!1}else Xt?(ee&&e.texStorage2D(r.TEXTURE_2D,gt,yt,it.width,it.height),F&&tt(S,it,pt,Bt)):e.texImage2D(r.TEXTURE_2D,0,yt,it.width,it.height,0,pt,Bt,it.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Xt&&ee&&e.texStorage3D(r.TEXTURE_2D_ARRAY,gt,yt,zt[0].width,zt[0].height,it.depth);for(let j=0,xt=zt.length;j<xt;j++)if(mt=zt[j],S.format!==_i)if(pt!==null)if(Xt){if(F)if(S.layerUpdates.size>0){const Tt=zu(mt.width,mt.height,S.format,S.type);for(const rt of S.layerUpdates){const Vt=mt.data.subarray(rt*Tt/mt.data.BYTES_PER_ELEMENT,(rt+1)*Tt/mt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,j,0,0,rt,mt.width,mt.height,1,pt,Vt)}}else e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,j,0,0,0,mt.width,mt.height,it.depth,pt,mt.data)}else e.compressedTexImage3D(r.TEXTURE_2D_ARRAY,j,yt,mt.width,mt.height,it.depth,0,mt.data,0,0);else dt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Xt?F&&e.texSubImage3D(r.TEXTURE_2D_ARRAY,j,0,0,0,mt.width,mt.height,it.depth,pt,Bt,mt.data):e.texImage3D(r.TEXTURE_2D_ARRAY,j,yt,mt.width,mt.height,it.depth,0,pt,Bt,mt.data);S.layerUpdates.size>0&&S.clearLayerUpdates()}else{Xt&&ee&&e.texStorage2D(r.TEXTURE_2D,gt,yt,zt[0].width,zt[0].height);for(let j=0,xt=zt.length;j<xt;j++)mt=zt[j],S.format!==_i?pt!==null?Xt?F&&e.compressedTexSubImage2D(r.TEXTURE_2D,j,0,0,mt.width,mt.height,pt,mt.data):e.compressedTexImage2D(r.TEXTURE_2D,j,yt,mt.width,mt.height,0,mt.data):dt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xt?F&&e.texSubImage2D(r.TEXTURE_2D,j,0,0,mt.width,mt.height,pt,Bt,mt.data):e.texImage2D(r.TEXTURE_2D,j,yt,mt.width,mt.height,0,pt,Bt,mt.data)}else if(S.isDataArrayTexture)if(Xt){if(ee&&e.texStorage3D(r.TEXTURE_2D_ARRAY,gt,yt,it.width,it.height,it.depth),F)if(S.layerUpdates.size>0){const j=zu(it.width,it.height,S.format,S.type);for(const xt of S.layerUpdates){const Tt=it.data.subarray(xt*j/it.data.BYTES_PER_ELEMENT,(xt+1)*j/it.data.BYTES_PER_ELEMENT);e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,xt,it.width,it.height,1,pt,Bt,Tt)}S.clearLayerUpdates()}else e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,it.width,it.height,it.depth,pt,Bt,it.data)}else e.texImage3D(r.TEXTURE_2D_ARRAY,0,yt,it.width,it.height,it.depth,0,pt,Bt,it.data);else if(S.isData3DTexture)Xt?(ee&&e.texStorage3D(r.TEXTURE_3D,gt,yt,it.width,it.height,it.depth),F&&e.texSubImage3D(r.TEXTURE_3D,0,0,0,0,it.width,it.height,it.depth,pt,Bt,it.data)):e.texImage3D(r.TEXTURE_3D,0,yt,it.width,it.height,it.depth,0,pt,Bt,it.data);else if(S.isFramebufferTexture){if(ee)if(Xt)e.texStorage2D(r.TEXTURE_2D,gt,yt,it.width,it.height);else{let j=it.width,xt=it.height;for(let Tt=0;Tt<gt;Tt++)e.texImage2D(r.TEXTURE_2D,Tt,yt,j,xt,0,pt,Bt,null),j>>=1,xt>>=1}}else if(S.isHTMLTexture){if("texElementImage2D"in r){const j=r.canvas;if(j.hasAttribute("layoutsubtree")||j.setAttribute("layoutsubtree","true"),it.parentNode!==j){j.appendChild(it),d.add(S),j.onpaint=xt=>{const Tt=xt.changedElements;for(const rt of d)Tt.includes(rt.image)&&(rt.needsUpdate=!0)},j.requestPaint();return}if(r.texElementImage2D.length===3)r.texElementImage2D(r.TEXTURE_2D,r.RGBA8,it);else{const Tt=r.RGBA,rt=r.RGBA,Vt=r.UNSIGNED_BYTE;r.texElementImage2D(r.TEXTURE_2D,0,Tt,rt,Vt,it)}r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}}else if(zt.length>0){if(Xt&&ee){const j=jt(zt[0]);e.texStorage2D(r.TEXTURE_2D,gt,yt,j.width,j.height)}for(let j=0,xt=zt.length;j<xt;j++)mt=zt[j],Xt?F&&e.texSubImage2D(r.TEXTURE_2D,j,0,0,pt,Bt,mt):e.texImage2D(r.TEXTURE_2D,j,yt,pt,Bt,mt);S.generateMipmaps=!1}else if(Xt){if(ee){const j=jt(it);e.texStorage2D(r.TEXTURE_2D,gt,yt,j.width,j.height)}F&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,pt,Bt,it)}else e.texImage2D(r.TEXTURE_2D,0,yt,pt,Bt,it);g(S)&&v(G),ut.__version=ct.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function Ht(R,S,z){if(S.image.length!==6)return;const G=Qt(R,S),X=S.source;e.bindTexture(r.TEXTURE_CUBE_MAP,R.__webglTexture,r.TEXTURE0+z);const ct=i.get(X);if(X.version!==ct.__version||G===!0){e.activeTexture(r.TEXTURE0+z);const ut=oe.getPrimaries(oe.workingColorSpace),$=S.colorSpace===Rn?null:oe.getPrimaries(S.colorSpace),it=S.colorSpace===Rn||ut===$?r.NONE:r.BROWSER_DEFAULT_WEBGL;e.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,S.flipY),e.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),e.pixelStorei(r.UNPACK_ALIGNMENT,S.unpackAlignment),e.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,it);const pt=S.isCompressedTexture||S.image[0].isCompressedTexture,Bt=S.image[0]&&S.image[0].isDataTexture,yt=[];for(let rt=0;rt<6;rt++)!pt&&!Bt?yt[rt]=m(S.image[rt],!0,n.maxCubemapSize):yt[rt]=Bt?S.image[rt].image:S.image[rt],yt[rt]=ce(S,yt[rt]);const mt=yt[0],zt=s.convert(S.format,S.colorSpace),Xt=s.convert(S.type),ee=_(S.internalFormat,zt,Xt,S.normalized,S.colorSpace),F=S.isVideoTexture!==!0,gt=ct.__version===void 0||G===!0,j=X.dataReady;let xt=M(S,mt);Yt(r.TEXTURE_CUBE_MAP,S);let Tt;if(pt){F&&gt&&e.texStorage2D(r.TEXTURE_CUBE_MAP,xt,ee,mt.width,mt.height);for(let rt=0;rt<6;rt++){Tt=yt[rt].mipmaps;for(let Vt=0;Vt<Tt.length;Vt++){const Ut=Tt[Vt];S.format!==_i?zt!==null?F?j&&e.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Vt,0,0,Ut.width,Ut.height,zt,Ut.data):e.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Vt,ee,Ut.width,Ut.height,0,Ut.data):dt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?j&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Vt,0,0,Ut.width,Ut.height,zt,Xt,Ut.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Vt,ee,Ut.width,Ut.height,0,zt,Xt,Ut.data)}}}else{if(Tt=S.mipmaps,F&&gt){Tt.length>0&&xt++;const rt=jt(yt[0]);e.texStorage2D(r.TEXTURE_CUBE_MAP,xt,ee,rt.width,rt.height)}for(let rt=0;rt<6;rt++)if(Bt){F?j&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,yt[rt].width,yt[rt].height,zt,Xt,yt[rt].data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,ee,yt[rt].width,yt[rt].height,0,zt,Xt,yt[rt].data);for(let Vt=0;Vt<Tt.length;Vt++){const Te=Tt[Vt].image[rt].image;F?j&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Vt+1,0,0,Te.width,Te.height,zt,Xt,Te.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Vt+1,ee,Te.width,Te.height,0,zt,Xt,Te.data)}}else{F?j&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,0,0,zt,Xt,yt[rt]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+rt,0,ee,zt,Xt,yt[rt]);for(let Vt=0;Vt<Tt.length;Vt++){const Ut=Tt[Vt];F?j&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Vt+1,0,0,zt,Xt,Ut.image[rt]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+rt,Vt+1,ee,zt,Xt,Ut.image[rt])}}}g(S)&&v(r.TEXTURE_CUBE_MAP),ct.__version=X.version,S.onUpdate&&S.onUpdate(S)}R.__version=S.version}function wt(R,S,z,G,X,ct){const ut=s.convert(z.format,z.colorSpace),$=s.convert(z.type),it=_(z.internalFormat,ut,$,z.normalized,z.colorSpace),pt=i.get(S),Bt=i.get(z);if(Bt.__renderTarget=S,!pt.__hasExternalTextures){const yt=Math.max(1,S.width>>ct),mt=Math.max(1,S.height>>ct);X===r.TEXTURE_3D||X===r.TEXTURE_2D_ARRAY?e.texImage3D(X,ct,it,yt,mt,S.depth,0,ut,$,null):e.texImage2D(X,ct,it,yt,mt,0,ut,$,null)}e.bindFramebuffer(r.FRAMEBUFFER,R),qt(S)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,G,X,Bt.__webglTexture,0,Gt(S)):(X===r.TEXTURE_2D||X>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&X<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,G,X,Bt.__webglTexture,ct),e.bindFramebuffer(r.FRAMEBUFFER,null)}function Wt(R,S,z){if(r.bindRenderbuffer(r.RENDERBUFFER,R),S.depthBuffer){const G=S.depthTexture,X=G&&G.isDepthTexture?G.type:null,ct=b(S.stencilBuffer,X),ut=S.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;qt(S)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Gt(S),ct,S.width,S.height):z?r.renderbufferStorageMultisample(r.RENDERBUFFER,Gt(S),ct,S.width,S.height):r.renderbufferStorage(r.RENDERBUFFER,ct,S.width,S.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,ut,r.RENDERBUFFER,R)}else{const G=S.textures;for(let X=0;X<G.length;X++){const ct=G[X],ut=s.convert(ct.format,ct.colorSpace),$=s.convert(ct.type),it=_(ct.internalFormat,ut,$,ct.normalized,ct.colorSpace);qt(S)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Gt(S),it,S.width,S.height):z?r.renderbufferStorageMultisample(r.RENDERBUFFER,Gt(S),it,S.width,S.height):r.renderbufferStorage(r.RENDERBUFFER,it,S.width,S.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function fe(R,S,z){const G=S.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(r.FRAMEBUFFER,R),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const X=i.get(S.depthTexture);if(X.__renderTarget=S,(!X.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),G){if(X.__webglInit===void 0&&(X.__webglInit=!0,S.depthTexture.addEventListener("dispose",A)),X.__webglTexture===void 0){X.__webglTexture=r.createTexture(),e.bindTexture(r.TEXTURE_CUBE_MAP,X.__webglTexture),Yt(r.TEXTURE_CUBE_MAP,S.depthTexture);const pt=s.convert(S.depthTexture.format),Bt=s.convert(S.depthTexture.type);let yt;S.depthTexture.format===_n?yt=r.DEPTH_COMPONENT24:S.depthTexture.format===Kn&&(yt=r.DEPTH24_STENCIL8);for(let mt=0;mt<6;mt++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0,yt,S.width,S.height,0,pt,Bt,null)}}else nt(S.depthTexture,0);const ct=X.__webglTexture,ut=Gt(S),$=G?r.TEXTURE_CUBE_MAP_POSITIVE_X+z:r.TEXTURE_2D,it=S.depthTexture.format===Kn?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(S.depthTexture.format===_n)qt(S)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,it,$,ct,0,ut):r.framebufferTexture2D(r.FRAMEBUFFER,it,$,ct,0);else if(S.depthTexture.format===Kn)qt(S)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,it,$,ct,0,ut):r.framebufferTexture2D(r.FRAMEBUFFER,it,$,ct,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function et(R){const S=i.get(R),z=R.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==R.depthTexture){const G=R.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),G){const X=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,G.removeEventListener("dispose",X)};G.addEventListener("dispose",X),S.__depthDisposeCallback=X}S.__boundDepthTexture=G}if(R.depthTexture&&!S.__autoAllocateDepthBuffer)if(z)for(let G=0;G<6;G++)fe(S.__webglFramebuffer[G],R,G);else{const G=R.texture.mipmaps;G&&G.length>0?fe(S.__webglFramebuffer[0],R,0):fe(S.__webglFramebuffer,R,0)}else if(z){S.__webglDepthbuffer=[];for(let G=0;G<6;G++)if(e.bindFramebuffer(r.FRAMEBUFFER,S.__webglFramebuffer[G]),S.__webglDepthbuffer[G]===void 0)S.__webglDepthbuffer[G]=r.createRenderbuffer(),Wt(S.__webglDepthbuffer[G],R,!1);else{const X=R.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ct=S.__webglDepthbuffer[G];r.bindRenderbuffer(r.RENDERBUFFER,ct),r.framebufferRenderbuffer(r.FRAMEBUFFER,X,r.RENDERBUFFER,ct)}}else{const G=R.texture.mipmaps;if(G&&G.length>0?e.bindFramebuffer(r.FRAMEBUFFER,S.__webglFramebuffer[0]):e.bindFramebuffer(r.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=r.createRenderbuffer(),Wt(S.__webglDepthbuffer,R,!1);else{const X=R.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ct=S.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,ct),r.framebufferRenderbuffer(r.FRAMEBUFFER,X,r.RENDERBUFFER,ct)}}e.bindFramebuffer(r.FRAMEBUFFER,null)}function at(R,S,z){const G=i.get(R);S!==void 0&&wt(G.__webglFramebuffer,R,R.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),z!==void 0&&et(R)}function ot(R){const S=R.texture,z=i.get(R),G=i.get(S);R.addEventListener("dispose",y);const X=R.textures,ct=R.isWebGLCubeRenderTarget===!0,ut=X.length>1;if(ut||(G.__webglTexture===void 0&&(G.__webglTexture=r.createTexture()),G.__version=S.version,a.memory.textures++),ct){z.__webglFramebuffer=[];for(let $=0;$<6;$++)if(S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer[$]=[];for(let it=0;it<S.mipmaps.length;it++)z.__webglFramebuffer[$][it]=r.createFramebuffer()}else z.__webglFramebuffer[$]=r.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer=[];for(let $=0;$<S.mipmaps.length;$++)z.__webglFramebuffer[$]=r.createFramebuffer()}else z.__webglFramebuffer=r.createFramebuffer();if(ut)for(let $=0,it=X.length;$<it;$++){const pt=i.get(X[$]);pt.__webglTexture===void 0&&(pt.__webglTexture=r.createTexture(),a.memory.textures++)}if(R.samples>0&&qt(R)===!1){z.__webglMultisampledFramebuffer=r.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(r.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let $=0;$<X.length;$++){const it=X[$];z.__webglColorRenderbuffer[$]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,z.__webglColorRenderbuffer[$]);const pt=s.convert(it.format,it.colorSpace),Bt=s.convert(it.type),yt=_(it.internalFormat,pt,Bt,it.normalized,it.colorSpace,R.isXRRenderTarget===!0),mt=Gt(R);r.renderbufferStorageMultisample(r.RENDERBUFFER,mt,yt,R.width,R.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+$,r.RENDERBUFFER,z.__webglColorRenderbuffer[$])}r.bindRenderbuffer(r.RENDERBUFFER,null),R.depthBuffer&&(z.__webglDepthRenderbuffer=r.createRenderbuffer(),Wt(z.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(r.FRAMEBUFFER,null)}}if(ct){e.bindTexture(r.TEXTURE_CUBE_MAP,G.__webglTexture),Yt(r.TEXTURE_CUBE_MAP,S);for(let $=0;$<6;$++)if(S.mipmaps&&S.mipmaps.length>0)for(let it=0;it<S.mipmaps.length;it++)wt(z.__webglFramebuffer[$][it],R,S,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+$,it);else wt(z.__webglFramebuffer[$],R,S,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+$,0);g(S)&&v(r.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ut){for(let $=0,it=X.length;$<it;$++){const pt=X[$],Bt=i.get(pt);let yt=r.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(yt=R.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(yt,Bt.__webglTexture),Yt(yt,pt),wt(z.__webglFramebuffer,R,pt,r.COLOR_ATTACHMENT0+$,yt,0),g(pt)&&v(yt)}e.unbindTexture()}else{let $=r.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&($=R.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture($,G.__webglTexture),Yt($,S),S.mipmaps&&S.mipmaps.length>0)for(let it=0;it<S.mipmaps.length;it++)wt(z.__webglFramebuffer[it],R,S,r.COLOR_ATTACHMENT0,$,it);else wt(z.__webglFramebuffer,R,S,r.COLOR_ATTACHMENT0,$,0);g(S)&&v($),e.unbindTexture()}R.depthBuffer&&et(R)}function lt(R){const S=R.textures;for(let z=0,G=S.length;z<G;z++){const X=S[z];if(g(X)){const ct=w(R),ut=i.get(X).__webglTexture;e.bindTexture(ct,ut),v(ct),e.unbindTexture()}}}const ht=[],kt=[];function Ft(R){if(R.samples>0){if(qt(R)===!1){const S=R.textures,z=R.width,G=R.height;let X=r.COLOR_BUFFER_BIT;const ct=R.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ut=i.get(R),$=S.length>1;if($)for(let pt=0;pt<S.length;pt++)e.bindFramebuffer(r.FRAMEBUFFER,ut.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+pt,r.RENDERBUFFER,null),e.bindFramebuffer(r.FRAMEBUFFER,ut.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+pt,r.TEXTURE_2D,null,0);e.bindFramebuffer(r.READ_FRAMEBUFFER,ut.__webglMultisampledFramebuffer);const it=R.texture.mipmaps;it&&it.length>0?e.bindFramebuffer(r.DRAW_FRAMEBUFFER,ut.__webglFramebuffer[0]):e.bindFramebuffer(r.DRAW_FRAMEBUFFER,ut.__webglFramebuffer);for(let pt=0;pt<S.length;pt++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(X|=r.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(X|=r.STENCIL_BUFFER_BIT)),$){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,ut.__webglColorRenderbuffer[pt]);const Bt=i.get(S[pt]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Bt,0)}r.blitFramebuffer(0,0,z,G,0,0,z,G,X,r.NEAREST),l===!0&&(ht.length=0,kt.length=0,ht.push(r.COLOR_ATTACHMENT0+pt),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&(ht.push(ct),kt.push(ct),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,kt)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,ht))}if(e.bindFramebuffer(r.READ_FRAMEBUFFER,null),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),$)for(let pt=0;pt<S.length;pt++){e.bindFramebuffer(r.FRAMEBUFFER,ut.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+pt,r.RENDERBUFFER,ut.__webglColorRenderbuffer[pt]);const Bt=i.get(S[pt]).__webglTexture;e.bindFramebuffer(r.FRAMEBUFFER,ut.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+pt,r.TEXTURE_2D,Bt,0)}e.bindFramebuffer(r.DRAW_FRAMEBUFFER,ut.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&l){const S=R.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[S])}}}function Gt(R){return Math.min(n.maxSamples,R.samples)}function qt(R){const S=i.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function L(R){const S=a.render.frame;h.get(R)!==S&&(h.set(R,S),R.update())}function ce(R,S){const z=R.colorSpace,G=R.format,X=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||z!==Oa&&z!==Rn&&(oe.getTransfer(z)===ve?(G!==_i||X!==Ti)&&dt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ot("WebGLTextures: Unsupported texture color space:",z)),S}function jt(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=Z,this.resetTextureUnits=V,this.getTextureUnits=N,this.setTextureUnits=B,this.setTexture2D=nt,this.setTexture2DArray=J,this.setTexture3D=K,this.setTextureCube=Q,this.rebindTextures=at,this.setupRenderTarget=ot,this.updateRenderTargetMipmap=lt,this.updateMultisampleRenderTarget=Ft,this.setupDepthRenderbuffer=et,this.setupFrameBufferTexture=wt,this.useMultisampledRTT=qt,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function $g(r,t){function e(i,n=Rn){let s;const a=oe.getTransfer(n);if(i===Ti)return r.UNSIGNED_BYTE;if(i===Oc)return r.UNSIGNED_SHORT_4_4_4_4;if(i===Fc)return r.UNSIGNED_SHORT_5_5_5_1;if(i===ad)return r.UNSIGNED_INT_5_9_9_9_REV;if(i===od)return r.UNSIGNED_INT_10F_11F_11F_REV;if(i===sd)return r.BYTE;if(i===rd)return r.SHORT;if(i===Ir)return r.UNSIGNED_SHORT;if(i===Dc)return r.INT;if(i===ki)return r.UNSIGNED_INT;if(i===xi)return r.FLOAT;if(i===Qi)return r.HALF_FLOAT;if(i===ld)return r.ALPHA;if(i===cd)return r.RGB;if(i===_i)return r.RGBA;if(i===_n)return r.DEPTH_COMPONENT;if(i===Kn)return r.DEPTH_STENCIL;if(i===Bc)return r.RED;if(i===Mo)return r.RED_INTEGER;if(i===as)return r.RG;if(i===zc)return r.RG_INTEGER;if(i===Vc)return r.RGBA_INTEGER;if(i===Ma||i===ba||i===wa||i===Ta)if(a===ve)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Ma)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ba)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===wa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ta)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Ma)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ba)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===wa)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ta)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Wl||i===Xl||i===ql||i===Jl)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Wl)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Xl)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ql)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Jl)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Yl||i===Zl||i===$l||i===Kl||i===Ql||i===La||i===jl)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Yl||i===Zl)return a===ve?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===$l)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===Kl)return s.COMPRESSED_R11_EAC;if(i===Ql)return s.COMPRESSED_SIGNED_R11_EAC;if(i===La)return s.COMPRESSED_RG11_EAC;if(i===jl)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===tc||i===ec||i===ic||i===nc||i===sc||i===rc||i===ac||i===oc||i===lc||i===cc||i===hc||i===uc||i===dc||i===fc)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===tc)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===ec)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===ic)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===nc)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===sc)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===rc)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===ac)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===oc)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===lc)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===cc)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===hc)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===uc)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===dc)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===fc)return a===ve?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===pc||i===mc||i===gc)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===pc)return a===ve?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===mc)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===gc)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===xc||i===_c||i===Na||i===yc)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===xc)return s.COMPRESSED_RED_RGTC1_EXT;if(i===_c)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Na)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===yc)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Lr?r.UNSIGNED_INT_24_8:r[i]!==void 0?r[i]:null}return{convert:e}}const uw=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,dw=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class fw{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const i=new yd(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new hi({vertexShader:uw,fragmentShader:dw,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Kt(new mn(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class pw extends tn{constructor(t,e){super();const i=this;let n=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,p=null;const x=typeof XRWebGLBinding<"u",m=new fw,g={},v=e.getContextAttributes();let w=null,_=null;const b=[],M=[],A=new st;let y=null,E=null;const P=new Ze;P.viewport=new be;const I=new Ze;I.viewport=new be;const U=[P,I],V=new Fg;let N=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let tt=b[q];return tt===void 0&&(tt=new Ll,b[q]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(q){let tt=b[q];return tt===void 0&&(tt=new Ll,b[q]=tt),tt.getGripSpace()},this.getHand=function(q){let tt=b[q];return tt===void 0&&(tt=new Ll,b[q]=tt),tt.getHandSpace()};function Z(q){const tt=M.indexOf(q.inputSource);if(tt===-1)return;const ft=b[tt];ft!==void 0&&(ft.update(q.inputSource,q.frame,c||a),ft.dispatchEvent({type:q.type,data:q.inputSource}))}function k(){n.removeEventListener("select",Z),n.removeEventListener("selectstart",Z),n.removeEventListener("selectend",Z),n.removeEventListener("squeeze",Z),n.removeEventListener("squeezestart",Z),n.removeEventListener("squeezeend",Z),n.removeEventListener("end",k),n.removeEventListener("inputsourceschange",nt);for(let q=0;q<b.length;q++){const tt=M[q];tt!==null&&(M[q]=null,b[q].disconnect(tt))}N=null,B=null,m.reset();for(const q in g)delete g[q];if(t.setRenderTarget(w),f=null,u=null,d=null,n=null,_=null,Qt.stop(),i.isPresenting=!1,t.setPixelRatio(y),t.setSize(A.width,A.height,!1),E!==null){const q=E.camera;q.fov=E.fov,q.zoom=E.zoom,q.updateProjectionMatrix(),E=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){s=q,i.isPresenting===!0&&dt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){o=q,i.isPresenting===!0&&dt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(n,e)),d},this.getFrame=function(){return p},this.getSession=function(){return n},this.setSession=async function(q){if(n=q,n!==null){if(w=t.getRenderTarget(),n.addEventListener("select",Z),n.addEventListener("selectstart",Z),n.addEventListener("selectend",Z),n.addEventListener("squeeze",Z),n.addEventListener("squeezestart",Z),n.addEventListener("squeezeend",Z),n.addEventListener("end",k),n.addEventListener("inputsourceschange",nt),v.xrCompatible!==!0&&await e.makeXRCompatible(),y=t.getPixelRatio(),t.getSize(A),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let ft=null,Ht=null,wt=null;v.depth&&(wt=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,ft=v.stencil?Kn:_n,Ht=v.stencil?Lr:ki);const Wt={colorFormat:e.RGBA8,depthFormat:wt,scaleFactor:s};d=this.getBinding(),u=d.createProjectionLayer(Wt),n.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),_=new Ai(u.textureWidth,u.textureHeight,{format:_i,type:Ti,depthTexture:new Ur(u.textureWidth,u.textureHeight,Ht,void 0,void 0,void 0,void 0,void 0,void 0,ft),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{const ft={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(n,e,ft),n.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),_=new Ai(f.framebufferWidth,f.framebufferHeight,{format:_i,type:Ti,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await n.requestReferenceSpace(o),Qt.setContext(n),Qt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(n!==null)return n.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function nt(q){for(let tt=0;tt<q.removed.length;tt++){const ft=q.removed[tt],Ht=M.indexOf(ft);Ht>=0&&(M[Ht]=null,b[Ht].disconnect(ft))}for(let tt=0;tt<q.added.length;tt++){const ft=q.added[tt];let Ht=M.indexOf(ft);if(Ht===-1){for(let Wt=0;Wt<b.length;Wt++)if(Wt>=M.length){M.push(ft),Ht=Wt;break}else if(M[Wt]===null){M[Wt]=ft,Ht=Wt;break}if(Ht===-1)break}const wt=b[Ht];wt&&wt.connect(ft)}}const J=new C,K=new C;function Q(q,tt,ft){J.setFromMatrixPosition(tt.matrixWorld),K.setFromMatrixPosition(ft.matrixWorld);const Ht=J.distanceTo(K),wt=tt.projectionMatrix.elements,Wt=ft.projectionMatrix.elements,fe=wt[14]/(wt[10]-1),et=wt[14]/(wt[10]+1),at=(wt[9]+1)/wt[5],ot=(wt[9]-1)/wt[5],lt=(wt[8]-1)/wt[0],ht=(Wt[8]+1)/Wt[0],kt=fe*lt,Ft=fe*ht,Gt=Ht/(-lt+ht),qt=Gt*-lt;if(tt.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(qt),q.translateZ(Gt),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),wt[10]===-1)q.projectionMatrix.copy(tt.projectionMatrix),q.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{const L=fe+Gt,ce=et+Gt,jt=kt-qt,R=Ft+(Ht-qt),S=at*et/ce*L,z=ot*et/ce*L;q.projectionMatrix.makePerspective(jt,R,S,z,L,ce),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function At(q,tt){tt===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(tt.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(n===null)return;let tt=q.near,ft=q.far;m.texture!==null&&(m.depthNear>0&&(tt=m.depthNear),m.depthFar>0&&(ft=m.depthFar)),V.near=I.near=P.near=tt,V.far=I.far=P.far=ft,(N!==V.near||B!==V.far)&&(n.updateRenderState({depthNear:V.near,depthFar:V.far}),N=V.near,B=V.far),V.layers.mask=q.layers.mask|6,P.layers.mask=V.layers.mask&-5,I.layers.mask=V.layers.mask&-3;const Ht=q.parent,wt=V.cameras;At(V,Ht);for(let Wt=0;Wt<wt.length;Wt++)At(wt[Wt],Ht);wt.length===2?Q(V,P,I):V.projectionMatrix.copy(P.projectionMatrix),E===null&&q.isPerspectiveCamera&&(E={camera:q,fov:q.fov,zoom:q.zoom}),St(q,V,Ht)};function St(q,tt,ft){ft===null?q.matrix.copy(tt.matrixWorld):(q.matrix.copy(ft.matrixWorld),q.matrix.invert(),q.matrix.multiply(tt.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(tt.projectionMatrix),q.projectionMatrixInverse.copy(tt.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Nr*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return V},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(q){l=q,u!==null&&(u.fixedFoveation=q),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=q)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(V)},this.getCameraTexture=function(q){return g[q]};let se=null;function Yt(q,tt){if(h=tt.getViewerPose(c||a),p=tt,h!==null){const ft=h.views;f!==null&&(t.setRenderTargetFramebuffer(_,f.framebuffer),t.setRenderTarget(_));let Ht=!1;ft.length!==V.cameras.length&&(V.cameras.length=0,Ht=!0);for(let et=0;et<ft.length;et++){const at=ft[et];let ot=null;if(f!==null)ot=f.getViewport(at);else{const ht=d.getViewSubImage(u,at);ot=ht.viewport,et===0&&(t.setRenderTargetTextures(_,ht.colorTexture,ht.depthStencilTexture),t.setRenderTarget(_))}let lt=U[et];lt===void 0&&(lt=new Ze,lt.layers.enable(et),lt.viewport=new be,U[et]=lt),lt.matrix.fromArray(at.transform.matrix),lt.matrix.decompose(lt.position,lt.quaternion,lt.scale),lt.projectionMatrix.fromArray(at.projectionMatrix),lt.projectionMatrixInverse.copy(lt.projectionMatrix).invert(),lt.viewport.set(ot.x,ot.y,ot.width,ot.height),et===0&&(V.matrix.copy(lt.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale)),Ht===!0&&V.cameras.push(lt)}const wt=n.enabledFeatures;if(wt&&wt.includes("depth-sensing")&&n.depthUsage=="gpu-optimized"&&x){d=i.getBinding();const et=d.getDepthInformation(ft[0]);et&&et.isValid&&et.texture&&m.init(et,n.renderState)}if(wt&&wt.includes("camera-access")&&x){t.state.unbindTexture(),d=i.getBinding();for(let et=0;et<ft.length;et++){const at=ft[et].camera;if(at){let ot=g[at];ot||(ot=new yd,g[at]=ot);const lt=d.getCameraImage(at);ot.sourceTexture=lt}}}}for(let ft=0;ft<b.length;ft++){const Ht=M[ft],wt=b[ft];Ht!==null&&wt!==void 0&&wt.update(Ht,tt,c||a)}se&&se(q,tt),tt.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:tt}),p=null}const Qt=new Wg;Qt.setAnimationLoop(Yt),this.setAnimationLoop=function(q){se=q},this.dispose=function(){}}}const mw=new $t,Kg=new te;Kg.set(-1,0,0,0,1,0,0,0,1);function gw(r,t){function e(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function i(m,g){g.color.getRGB(m.fogColor.value,mg(r)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function n(m,g,v,w,_){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?s(m,g):g.isMeshLambertMaterial?(s(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(s(m,g),d(m,g)):g.isMeshPhongMaterial?(s(m,g),h(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(s(m,g),u(m,g),g.isMeshPhysicalMaterial&&f(m,g,_)):g.isMeshMatcapMaterial?(s(m,g),p(m,g)):g.isMeshDepthMaterial?s(m,g):g.isMeshDistanceMaterial?(s(m,g),x(m,g)):g.isMeshNormalMaterial?s(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&o(m,g)):g.isPointsMaterial?l(m,g,v,w):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function s(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,e(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===ci&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,e(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===ci&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,e(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,e(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);const v=t.get(g),w=v.envMap,_=v.envMapRotation;w&&(m.envMap.value=w,m.envMapRotation.value.setFromMatrix4(mw.makeRotationFromEuler(_)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(Kg),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform))}function o(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,v,w){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*v,m.scale.value=w*.5,g.map&&(m.map.value=g.map,e(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function d(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function u(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function f(m,g,v){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===ci&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.retroreflectivity>0&&(m.retroreflectivity.value=g.retroreflectivity),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function x(m,g){const v=t.get(g).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:n}}function xw(r,t,e,i){let n={},s={},a=[];const o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,b){const M=b.program;i.uniformBlockBinding(_,M)}function c(_,b){let M=n[_.id];M===void 0&&(m(_),M=h(_),n[_.id]=M,_.addEventListener("dispose",v));const A=b.program;i.updateUBOMapping(_,A);const y=t.render.frame;s[_.id]!==y&&(u(_),s[_.id]=y)}function h(_){const b=d();_.__bindingPointIndex=b;const M=r.createBuffer(),A=_.__size,y=_.usage;return r.bindBuffer(r.UNIFORM_BUFFER,M),r.bufferData(r.UNIFORM_BUFFER,A,y),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,b,M),M}function d(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return Ot("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(_){const b=n[_.id],M=_.uniforms,A=_.__cache;r.bindBuffer(r.UNIFORM_BUFFER,b);for(let y=0,E=M.length;y<E;y++){const P=M[y];if(Array.isArray(P))for(let I=0,U=P.length;I<U;I++)f(P[I],y,I,A);else f(P,y,0,A)}r.bindBuffer(r.UNIFORM_BUFFER,null)}function f(_,b,M,A){if(x(_,b,M,A)===!0){const y=_.__offset,E=_.value;if(Array.isArray(E)){let P=0;for(let I=0;I<E.length;I++){const U=E[I],V=g(U);p(U,_.__data,P),typeof U!="number"&&typeof U!="boolean"&&!U.isMatrix3&&!ArrayBuffer.isView(U)&&(P+=V.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(E,_.__data,0);r.bufferSubData(r.UNIFORM_BUFFER,y,_.__data)}}function p(_,b,M){typeof _=="number"||typeof _=="boolean"?b[0]=_:_.isMatrix3?(b[0]=_.elements[0],b[1]=_.elements[1],b[2]=_.elements[2],b[3]=0,b[4]=_.elements[3],b[5]=_.elements[4],b[6]=_.elements[5],b[7]=0,b[8]=_.elements[6],b[9]=_.elements[7],b[10]=_.elements[8],b[11]=0):ArrayBuffer.isView(_)?b.set(new _.constructor(_.buffer,_.byteOffset,b.length)):_.toArray(b,M)}function x(_,b,M,A){const y=_.value,E=b+"_"+M;if(A[E]===void 0)return typeof y=="number"||typeof y=="boolean"?A[E]=y:ArrayBuffer.isView(y)?A[E]=y.slice():A[E]=y.clone(),!0;{const P=A[E];if(typeof y=="number"||typeof y=="boolean"){if(P!==y)return A[E]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(P.equals(y)===!1)return P.copy(y),!0}}return!1}function m(_){const b=_.uniforms;let M=0;const A=16;for(let E=0,P=b.length;E<P;E++){const I=Array.isArray(b[E])?b[E]:[b[E]];for(let U=0,V=I.length;U<V;U++){const N=I[U],B=Array.isArray(N.value)?N.value:[N.value];for(let Z=0,k=B.length;Z<k;Z++){const nt=B[Z],J=g(nt),K=M%A,Q=K%J.boundary,At=K+Q;M+=Q,At!==0&&A-At<J.storage&&(M+=A-At),N.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=M,M+=J.storage}}}const y=M%A;return y>0&&(M+=A-y),_.__size=M,_.__cache={},this}function g(_){const b={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(b.boundary=4,b.storage=4):_.isVector2?(b.boundary=8,b.storage=8):_.isVector3||_.isColor?(b.boundary=16,b.storage=12):_.isVector4?(b.boundary=16,b.storage=16):_.isMatrix3?(b.boundary=48,b.storage=48):_.isMatrix4?(b.boundary=64,b.storage=64):_.isTexture?dt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(_)?(b.boundary=16,b.storage=_.byteLength):dt("WebGLRenderer: Unsupported uniform value type.",_),b}function v(_){const b=_.target;b.removeEventListener("dispose",v);const M=a.indexOf(b.__bindingPointIndex);a.splice(M,1),r.deleteBuffer(n[b.id]),delete n[b.id],delete s[b.id]}function w(){for(const _ in n)r.deleteBuffer(n[_]);a=[],n={},s={}}return{bind:l,update:c,dispose:w}}const _w=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let an=null;function yw(){return an===null&&(an=new Vi(_w,16,16,as,Qi),an.name="DFG_LUT",an.minFilter=Ce,an.magFilter=Ce,an.wrapS=Ei,an.wrapT=Ei,an.generateMipmaps=!1,an.needsUpdate=!0),an}class Qg{constructor(t={}){const{canvas:e=Hm(),context:i=null,depth:n=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=Ti}=t;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const x=f,m=new Set([Vc,zc,Mo]),g=new Set([Ti,ki,Ir,Lr,Oc,Fc]),v=new Uint32Array(4),w=new Int32Array(4),_=new C;let b=null,M=null;const A=[],y=[];let E=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ki,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const P=this;let I=!1,U=null,V=null,N=null,B=null;this._outputColorSpace=Qe;let Z=0,k=0,nt=null,J=-1,K=null;const Q=new be,At=new be;let St=null;const se=new bt(0);let Yt=0,Qt=e.width,q=e.height,tt=1,ft=null,Ht=null;const wt=new be(0,0,Qt,q),Wt=new be(0,0,Qt,q);let fe=!1;const et=new Bs;let at=!1,ot=!1;const lt=new $t,ht=new C,kt=new be,Ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Gt=!1;function qt(){return nt===null?tt:1}let L=i;function ce(T,D){return e.getContext(T,D)}let jt,R,S,z,G,X,ct,ut,$,it,pt,Bt,yt,mt,zt,Xt,ee,F,gt,j,xt,Tt,rt;try{const T={alpha:!0,depth:n,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Lc}`),e.addEventListener("webglcontextlost",Te,!1),e.addEventListener("webglcontextrestored",_e,!1),e.addEventListener("webglcontextcreationerror",Hi,!1),L===null){const D="webgl2";if(L=ce(D,T),L===null)throw ce(D)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Vt()}catch(T){throw e.removeEventListener("webglcontextlost",Te,!1),e.removeEventListener("webglcontextrestored",_e,!1),e.removeEventListener("webglcontextcreationerror",Hi,!1),Ot("WebGLRenderer: "+T.message),T}function Vt(){jt=new vb(L),jt.init(),xt=new $g(L,jt),R=new hb(L,jt,t,xt),S=new cw(L,jt),R.reversedDepthBuffer&&u&&S.buffers.depth.setReversed(!0),V=L.createFramebuffer(),N=L.createFramebuffer(),B=L.createFramebuffer(),z=new bb(L),G=new Z1,X=new hw(L,jt,S,G,R,xt,z),ct=new yb(P),ut=new Tv(L),Tt=new lb(L,ut),$=new Sb(L,ut,z,Tt),it=new Tb(L,$,ut,Tt,z),F=new wb(L,R,X),zt=new ub(G),pt=new Y1(P,ct,jt,R,Tt,zt),Bt=new gw(P,G),yt=new K1,mt=new nw(jt),ee=new ob(P,ct,S,it,p,l),Xt=new lw(P,it,R),rt=new xw(L,z,R,S),gt=new cb(L,jt,z),j=new Mb(L,jt,z),z.programs=pt.programs,P.capabilities=R,P.extensions=jt,P.properties=G,P.renderLists=yt,P.shadowMap=Xt,P.state=S,P.info=z}x!==Ti&&(E=new Ab(x,e.width,e.height,o,n,s));const Ut=new pw(P,L);this.xr=Ut,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const T=jt.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=jt.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return tt},this.setPixelRatio=function(T){T!==void 0&&(tt=T,this.setSize(Qt,q,!1))},this.getSize=function(T){return T.set(Qt,q)},this.setSize=function(T,D,Y=!0){if(Ut.isPresenting){dt("WebGLRenderer: Can't change size while VR device is presenting.");return}Qt=T,q=D,e.width=Math.floor(T*tt),e.height=Math.floor(D*tt),Y===!0&&(e.style.width=T+"px",e.style.height=D+"px"),E!==null&&E.setSize(e.width,e.height),this.setViewport(0,0,T,D)},this.getDrawingBufferSize=function(T){return T.set(Qt*tt,q*tt).floor()},this.setDrawingBufferSize=function(T,D,Y){Qt=T,q=D,tt=Y,e.width=Math.floor(T*Y),e.height=Math.floor(D*Y),this.setViewport(0,0,T,D)},this.setEffects=function(T){if(x===Ti){Ot("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let D=0;D<T.length;D++)if(T[D].isOutputPass===!0){dt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(Q)},this.getViewport=function(T){return T.copy(wt)},this.setViewport=function(T,D,Y,H){T.isVector4?wt.set(T.x,T.y,T.z,T.w):wt.set(T,D,Y,H),S.viewport(Q.copy(wt).multiplyScalar(tt).round())},this.getScissor=function(T){return T.copy(Wt)},this.setScissor=function(T,D,Y,H){T.isVector4?Wt.set(T.x,T.y,T.z,T.w):Wt.set(T,D,Y,H),S.scissor(At.copy(Wt).multiplyScalar(tt).round())},this.getScissorTest=function(){return fe},this.setScissorTest=function(T){S.setScissorTest(fe=T)},this.setOpaqueSort=function(T){ft=T},this.setTransparentSort=function(T){Ht=T},this.getClearColor=function(T){return T.copy(ee.getClearColor())},this.setClearColor=function(){ee.setClearColor(...arguments)},this.getClearAlpha=function(){return ee.getClearAlpha()},this.setClearAlpha=function(){ee.setClearAlpha(...arguments)},this.clear=function(T=!0,D=!0,Y=!0){let H=0;if(T){let W=!1;if(nt!==null){const Mt=nt.texture.format;W=m.has(Mt)}if(W){const Mt=nt.texture.type,Ct=g.has(Mt),vt=ee.getClearColor(),It=ee.getClearAlpha(),Dt=vt.r,re=vt.g,ae=vt.b;Ct?(v[0]=Dt,v[1]=re,v[2]=ae,v[3]=It,L.clearBufferuiv(L.COLOR,0,v)):(w[0]=Dt,w[1]=re,w[2]=ae,w[3]=It,L.clearBufferiv(L.COLOR,0,w))}else H|=L.COLOR_BUFFER_BIT}D&&(H|=L.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(H|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&L.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),U=T},this.dispose=function(){e.removeEventListener("webglcontextlost",Te,!1),e.removeEventListener("webglcontextrestored",_e,!1),e.removeEventListener("webglcontextcreationerror",Hi,!1),ee.dispose(),yt.dispose(),mt.dispose(),G.dispose(),ct.dispose(),it.dispose(),Tt.dispose(),rt.dispose(),pt.dispose(),Ut.dispose(),Ut.removeEventListener("sessionstart",Qd),Ut.removeEventListener("sessionend",jd),ms.stop()};function Te(T){T.preventDefault(),za("WebGLRenderer: Context Lost."),I=!0}function _e(){za("WebGLRenderer: Context Restored."),I=!1;const T=z.autoReset,D=Xt.enabled,Y=Xt.autoUpdate,H=Xt.needsUpdate,W=Xt.type;Vt(),z.autoReset=T,Xt.enabled=D,Xt.autoUpdate=Y,Xt.needsUpdate=H,Xt.type=W}function Hi(T){Ot("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function nn(T){const D=T.target;D.removeEventListener("dispose",nn),_0(D)}function _0(T){y0(T),G.remove(T)}function y0(T){const D=G.get(T).programs;D!==void 0&&(D.forEach(function(Y){pt.releaseProgram(Y)}),T.isShaderMaterial&&pt.releaseShaderCache(T))}this.renderBufferDirect=function(T,D,Y,H,W,Mt){D===null&&(D=Ft);const Ct=W.isMesh&&W.matrixWorld.determinantAffine()<0,vt=M0(T,D,Y,H,W);S.setMaterial(H,Ct);let It=Y.index,Dt=1;if(H.wireframe===!0){if(It=$.getWireframeAttribute(Y),It===void 0)return;Dt=2}const re=Y.drawRange,ae=Y.attributes.position;let Lt=re.start*Dt,ye=(re.start+re.count)*Dt;Mt!==null&&(Lt=Math.max(Lt,Mt.start*Dt),ye=Math.min(ye,(Mt.start+Mt.count)*Dt)),It!==null?(Lt=Math.max(Lt,0),ye=Math.min(ye,It.count)):ae!=null&&(Lt=Math.max(Lt,0),ye=Math.min(ye,ae.count));const Be=ye-Lt;if(Be<0||Be===1/0)return;Tt.setup(W,H,vt,Y,It);let Ae,we=gt;if(It!==null&&(Ae=ut.get(It),we=j,we.setIndex(Ae)),W.isMesh)H.wireframe===!0?(S.setLineWidth(H.wireframeLinewidth*qt()),we.setMode(L.LINES)):we.setMode(L.TRIANGLES);else if(W.isLine){let ii=H.linewidth;ii===void 0&&(ii=1),S.setLineWidth(ii*qt()),W.isLineSegments?we.setMode(L.LINES):W.isLineLoop?we.setMode(L.LINE_LOOP):we.setMode(L.LINE_STRIP)}else W.isPoints?we.setMode(L.POINTS):W.isSprite&&we.setMode(L.TRIANGLES);if(W.isBatchedMesh)if(jt.get("WEBGL_multi_draw"))we.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const ii=W._multiDrawStarts,Et=W._multiDrawCounts,di=W._multiDrawCount,pe=It?ut.get(It).bytesPerElement:1,Fi=G.get(H).currentProgram.getUniforms();for(let sn=0;sn<di;sn++)Fi.setValue(L,"_gl_DrawID",sn),we.render(ii[sn]/pe,Et[sn])}else if(W.isInstancedMesh)we.renderInstances(Lt,Be,W.count);else if(Y.isInstancedBufferGeometry){const ii=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Et=Math.min(Y.instanceCount,ii);we.renderInstances(Lt,Be,Et)}else we.render(Lt,Be)};function Kd(T,D,Y,H){U!==null&&T.isNodeMaterial&&U.setObject(H,T),at===!0&&zt.setState(T,Y,!1),T.transparent===!0&&T.side===zi&&T.forceSinglePass===!1?(T.side=ci,T.needsUpdate=!0,Lo(T,D,H),T.side=ss,T.needsUpdate=!0,Lo(T,D,H),T.side=zi):Lo(T,D,H)}this.compile=function(T,D,Y=null){Y===null&&(Y=T),U!==null&&U.renderStart(T,D,Y),M=mt.get(Y),M.init(D),y.push(M),Y.traverseVisible(function(W){W.isLight&&W.layers.test(D.layers)&&(M.pushLight(W),W.castShadow&&M.pushShadow(W))}),T!==Y&&T.traverseVisible(function(W){W.isLight&&W.layers.test(D.layers)&&(M.pushLight(W),W.castShadow&&M.pushShadow(W))}),M.setupLights(),U!==null&&U.updateLights(M.state.lightsArray),ot=this.localClippingEnabled,at=zt.init(this.clippingPlanes,ot),at===!0&&zt.setGlobalState(this.clippingPlanes,D),U!==null&&Xt.render(M.state.shadowsArray,Y,D);const H=new Set;return T.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const Mt=W.material;if(Mt)if(Array.isArray(Mt))for(let Ct=0;Ct<Mt.length;Ct++){const vt=Mt[Ct];Kd(vt,Y,D,W),H.add(vt)}else Kd(Mt,Y,D,W),H.add(Mt)}),M=y.pop(),U!==null&&U.renderEnd(),H},this.compileAsync=function(T,D,Y=null){const H=this.compile(T,D,Y);return new Promise(W=>{function Mt(){if(H.forEach(function(Ct){const It=G.get(Ct).currentProgram;(It===void 0||It.isReady())&&H.delete(Ct)}),H.size===0){W(T);return}setTimeout(Mt,10)}jt.get("KHR_parallel_shader_compile")!==null?Mt():setTimeout(Mt,10)})};let wh=null;function v0(T){wh&&wh(T)}function Qd(){ms.stop()}function jd(){ms.start()}const ms=new Wg;ms.setAnimationLoop(v0),typeof self<"u"&&ms.setContext(self),this.setAnimationLoop=function(T){wh=T,Ut.setAnimationLoop(T),T===null?ms.stop():ms.start()},Ut.addEventListener("sessionstart",Qd),Ut.addEventListener("sessionend",jd),this.render=function(T,D){if(D!==void 0&&D.isCamera!==!0){Ot("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;U!==null&&U.renderStart(T,D);const Y=Ut.enabled===!0&&Ut.isPresenting===!0,H=E!==null&&(nt===null||Y)&&E.begin(P,nt);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),D.parent===null&&D.matrixWorldAutoUpdate===!0&&D.updateMatrixWorld(),Ut.enabled===!0&&Ut.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(Ut.cameraAutoUpdate===!0&&Ut.updateCamera(D),D=Ut.getCamera()),T.isScene===!0&&T.onBeforeRender(P,T,D,nt),M=mt.get(T,y.length),M.init(D),M.state.textureUnits=X.getTextureUnits(),y.push(M),lt.multiplyMatrices(D.projectionMatrix,D.matrixWorldInverse),et.setFromProjectionMatrix(lt,Ui,D.reversedDepth),ot=this.localClippingEnabled,at=zt.init(this.clippingPlanes,ot),b=yt.get(T,A.length),b.init(),A.push(b),Ut.enabled===!0&&Ut.isPresenting===!0){const Ct=P.xr.getDepthSensingMesh();Ct!==null&&Th(Ct,D,-1/0,P.sortObjects)}Th(T,D,0,P.sortObjects),b.finish(),U!==null&&U.updateLights(M.state.lightsArray),P.sortObjects===!0&&b.sort(ft,Ht),Gt=Ut.enabled===!1||Ut.isPresenting===!1||Ut.hasDepthSensing()===!1,Gt&&ee.addToRenderList(b,T),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),at===!0&&zt.beginShadows();const W=M.state.shadowsArray;if(Xt.render(W,T,D),at===!0&&zt.endShadows(),(H&&E.hasRenderPass())===!1){const Ct=b.opaque,vt=b.transmissive;if(M.setupLights(),D.isArrayCamera){const It=D.cameras;if(vt.length>0)for(let Dt=0,re=It.length;Dt<re;Dt++){const ae=It[Dt];ef(Ct,vt,T,ae)}Gt&&ee.render(T);for(let Dt=0,re=It.length;Dt<re;Dt++){const ae=It[Dt];tf(b,T,ae,ae.viewport)}}else vt.length>0&&ef(Ct,vt,T,D),Gt&&ee.render(T),tf(b,T,D)}nt!==null&&k===0&&(X.updateMultisampleRenderTarget(nt),X.updateRenderTargetMipmap(nt)),H&&E.end(P),T.isScene===!0&&T.onAfterRender(P,T,D),Tt.resetDefaultState(),J=-1,K=null,y.pop(),y.length>0?(M=y[y.length-1],X.setTextureUnits(M.state.textureUnits),at===!0&&zt.setGlobalState(P.clippingPlanes,M.state.camera)):M=null,A.pop(),A.length>0?b=A[A.length-1]:b=null,U!==null&&U.renderEnd()};function Th(T,D,Y,H){if(T.visible===!1)return;if(T.layers.test(D.layers)){if(T.isGroup)Y=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(D);else if(T.isLightProbeGrid)M.pushLightProbeGrid(T);else if(T.isLight)M.pushLight(T),T.castShadow&&M.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||T.intersectsFrustum(et)){H&&kt.setFromMatrixPosition(T.matrixWorld).applyMatrix4(lt);const Ct=it.update(T),vt=T.material;vt.visible&&b.push(T,Ct,vt,Y,kt.z,null,D)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||T.intersectsFrustum(et))){const Ct=it.update(T),vt=T.material;if(H&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),kt.copy(T.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),kt.copy(Ct.boundingSphere.center)),kt.applyMatrix4(T.matrixWorld).applyMatrix4(lt)),Array.isArray(vt)){const It=Ct.groups;for(let Dt=0,re=It.length;Dt<re;Dt++){const ae=It[Dt],Lt=vt[ae.materialIndex];Lt&&Lt.visible&&b.push(T,Ct,Lt,Y,kt.z,ae,D)}}else vt.visible&&b.push(T,Ct,vt,Y,kt.z,null,D)}}const Mt=T.children;for(let Ct=0,vt=Mt.length;Ct<vt;Ct++)Th(Mt[Ct],D,Y,H)}function tf(T,D,Y,H){const{opaque:W,transmissive:Mt,transparent:Ct}=T;M.setupLightsView(Y),at===!0&&zt.setGlobalState(P.clippingPlanes,Y),H&&S.viewport(Q.copy(H)),W.length>0&&Io(W,D,Y),Mt.length>0&&Io(Mt,D,Y),Ct.length>0&&Io(Ct,D,Y),S.buffers.depth.setTest(!0),S.buffers.depth.setMask(!0),S.buffers.color.setMask(!0),S.setPolygonOffset(!1)}function ef(T,D,Y,H){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(M.state.transmissionRenderTarget[H.id]===void 0){const Lt=jt.has("EXT_color_buffer_half_float")||jt.has("EXT_color_buffer_float");M.state.transmissionRenderTarget[H.id]=new Ai(1,1,{generateMipmaps:!0,type:Lt?Qi:Ti,minFilter:un,samples:Math.max(4,R.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:oe.workingColorSpace})}const Mt=M.state.transmissionRenderTarget[H.id],Ct=H.viewport||Q;Mt.setSize(Ct.z*P.transmissionResolutionScale,Ct.w*P.transmissionResolutionScale);const vt=P.getRenderTarget(),It=P.getActiveCubeFace(),Dt=P.getActiveMipmapLevel();P.setRenderTarget(Mt),P.getClearColor(se),Yt=P.getClearAlpha(),Yt<1&&P.setClearColor(16777215,.5),P.clear(),Gt&&ee.render(Y);const re=P.toneMapping;P.toneMapping=Ki;const ae=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),M.setupLightsView(H),at===!0&&zt.setGlobalState(P.clippingPlanes,H),Io(T,Y,H),X.updateMultisampleRenderTarget(Mt),X.updateRenderTargetMipmap(Mt),jt.has("WEBGL_multisampled_render_to_texture")===!1){let Lt=!1;for(let ye=0,Be=D.length;ye<Be;ye++){const Ae=D[ye],{object:we,geometry:ii,material:Et,group:di}=Ae;if(Et.side===zi&&we.layers.test(H.layers)){const pe=Et.side;Et.side=ci,Et.needsUpdate=!0,nf(we,Y,H,ii,Et,di),Et.side=pe,Et.needsUpdate=!0,Lt=!0}}Lt===!0&&(X.updateMultisampleRenderTarget(Mt),X.updateRenderTargetMipmap(Mt))}P.setRenderTarget(vt,It,Dt),P.setClearColor(se,Yt),ae!==void 0&&(H.viewport=ae),P.toneMapping=re}function Io(T,D,Y){const H=D.isScene===!0?D.overrideMaterial:null;for(let W=0,Mt=T.length;W<Mt;W++){const Ct=T[W],{object:vt,geometry:It,group:Dt}=Ct;let re=Ct.material;re.allowOverride===!0&&H!==null&&(re=H),vt.layers.test(Y.layers)&&nf(vt,D,Y,It,re,Dt)}}function nf(T,D,Y,H,W,Mt){U!==null&&W.isNodeMaterial&&U.setObject(T,W),T.onBeforeRender(P,D,Y,H,W,Mt),T.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),W.onBeforeRender(P,D,Y,H,T,Mt),W.transparent===!0&&W.side===zi&&W.forceSinglePass===!1?(W.side=ci,W.needsUpdate=!0,P.renderBufferDirect(Y,D,H,W,T,Mt),W.side=ss,W.needsUpdate=!0,P.renderBufferDirect(Y,D,H,W,T,Mt),W.side=zi):P.renderBufferDirect(Y,D,H,W,T,Mt),T.onAfterRender(P,D,Y,H,W,Mt)}function Lo(T,D,Y){D.isScene!==!0&&(D=Ft);const H=G.get(T),W=M.state.lights,Mt=M.state.shadowsArray,Ct=W.state.version,vt=pt.getParameters(T,W.state,Mt,D,Y,M.state.lightProbeGridArray),It=pt.getProgramCacheKey(vt);let Dt=H.programs;H.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?D.environment:null,H.fog=D.fog;const re=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;H.envMap=ct.get(T.envMap||H.environment,re),H.envMapRotation=H.environment!==null&&T.envMap===null?D.environmentRotation:T.envMapRotation,Dt===void 0&&(T.addEventListener("dispose",nn),Dt=new Map,H.programs=Dt);let ae=Dt.get(It);if(ae!==void 0){if(H.currentProgram===ae&&H.lightsStateVersion===Ct)return rf(T,vt),ae}else vt.uniforms=pt.getUniforms(T),U!==null&&T.isNodeMaterial&&U.build(T,Y,vt),T.onBeforeCompile(vt,P),ae=pt.acquireProgram(vt,It),Dt.set(It,ae),H.uniforms=vt.uniforms;const Lt=H.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Lt.clippingPlanes=zt.uniform),rf(T,vt),H.needsLights=w0(T),H.lightsStateVersion=Ct,H.needsLights&&(Lt.ambientLightColor.value=W.state.ambient,Lt.lightProbe.value=W.state.probe,Lt.sunLights.value=W.state.sun,Lt.sunLightShadows.value=W.state.sunShadow,Lt.directionalLights.value=W.state.directional,Lt.directionalLightShadows.value=W.state.directionalShadow,Lt.spotLights.value=W.state.spot,Lt.spotLightShadows.value=W.state.spotShadow,Lt.rectAreaLights.value=W.state.rectArea,Lt.ltc_1.value=W.state.rectAreaLTC1,Lt.ltc_2.value=W.state.rectAreaLTC2,Lt.pointLights.value=W.state.point,Lt.pointLightShadows.value=W.state.pointShadow,Lt.hemisphereLights.value=W.state.hemi,Lt.sunShadowMatrix.value=W.state.sunShadowMatrix,Lt.sunShadowCascade.value=W.state.sunShadowCascade,Lt.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Lt.spotLightMatrix.value=W.state.spotLightMatrix,Lt.spotLightMap.value=W.state.spotLightMap,Lt.pointShadowMatrix.value=W.state.pointShadowMatrix),H.lightProbeGrid=M.state.lightProbeGridArray.length>0,H.currentProgram=ae,H.uniformsList=null,ae}function sf(T){if(T.uniformsList===null){const D=T.currentProgram.getUniforms();T.uniformsList=Nl.seqWithValue(D.seq,T.uniforms)}return T.uniformsList}function rf(T,D){const Y=G.get(T);Y.outputColorSpace=D.outputColorSpace,Y.batching=D.batching,Y.batchingColor=D.batchingColor,Y.instancing=D.instancing,Y.instancingColor=D.instancingColor,Y.instancingMorph=D.instancingMorph,Y.skinning=D.skinning,Y.morphTargets=D.morphTargets,Y.morphNormals=D.morphNormals,Y.morphColors=D.morphColors,Y.morphTargetsCount=D.morphTargetsCount,Y.numClippingPlanes=D.numClippingPlanes,Y.numIntersection=D.numClipIntersection,Y.vertexAlphas=D.vertexAlphas,Y.vertexTangents=D.vertexTangents,Y.toneMapping=D.toneMapping}function S0(T,D){if(T.length===0)return null;if(T.length===1)return T[0].texture!==null?T[0]:null;_.setFromMatrixPosition(D.matrixWorld);for(let Y=0,H=T.length;Y<H;Y++){const W=T[Y];if(W.texture!==null&&W.boundingBox.containsPoint(_))return W}return null}function M0(T,D,Y,H,W){D.isScene!==!0&&(D=Ft),X.resetTextureUnits();const Mt=D.fog,Ct=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?D.environment:null,vt=nt===null?P.outputColorSpace:nt.isXRRenderTarget===!0?nt.texture.colorSpace:oe.workingColorSpace,It=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,Dt=ct.get(H.envMap||Ct,It),re=H.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,ae=!!Y.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Lt=!!Y.morphAttributes.position,ye=!!Y.morphAttributes.normal,Be=!!Y.morphAttributes.color;let Ae=Ki;H.toneMapped&&(nt===null||nt.isXRRenderTarget===!0)&&(Ae=P.toneMapping);const we=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,ii=we!==void 0?we.length:0,Et=G.get(H),di=M.state.lights;if(at===!0&&(ot===!0||T!==K)){const Ee=T===K&&H.id===J;zt.setState(H,T,Ee)}let pe=!1;H.version===Et.__version?(Et.needsLights&&Et.lightsStateVersion!==di.state.version||Et.outputColorSpace!==vt||W.isBatchedMesh&&Et.batching===!1||!W.isBatchedMesh&&Et.batching===!0||W.isBatchedMesh&&Et.batchingColor===!0&&W._colorsTexture===null||W.isBatchedMesh&&Et.batchingColor===!1&&W._colorsTexture!==null||W.isInstancedMesh&&Et.instancing===!1||!W.isInstancedMesh&&Et.instancing===!0||W.isSkinnedMesh&&Et.skinning===!1||!W.isSkinnedMesh&&Et.skinning===!0||W.isInstancedMesh&&Et.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Et.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Et.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Et.instancingMorph===!1&&W.morphTexture!==null||Et.envMap!==Dt||H.fog===!0&&Et.fog!==Mt||Et.numClippingPlanes!==void 0&&(Et.numClippingPlanes!==zt.numPlanes||Et.numIntersection!==zt.numIntersection)||Et.vertexAlphas!==re||Et.vertexTangents!==ae||Et.morphTargets!==Lt||Et.morphNormals!==ye||Et.morphColors!==Be||Et.toneMapping!==Ae||Et.morphTargetsCount!==ii||!!Et.lightProbeGrid!=M.state.lightProbeGridArray.length>0)&&(pe=!0):(pe=!0,Et.__version=H.version);let Fi=Et.currentProgram;pe===!0&&(Fi=Lo(H,D,W),U&&H.isNodeMaterial&&U.onUpdateProgram(H,Fi,Et));let sn=!1,zn=!1,qs=!1;const Se=Fi.getUniforms(),Ue=Et.uniforms;if(S.useProgram(Fi.program)&&(sn=!0,zn=!0,qs=!0),H.id!==J&&(J=H.id,zn=!0),Et.needsLights){const Ee=S0(M.state.lightProbeGridArray,W);Et.lightProbeGrid!==Ee&&(Et.lightProbeGrid=Ee,zn=!0)}if(sn||K!==T){S.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),Se.setValue(L,"projectionMatrix",T.projectionMatrix),Se.setValue(L,"viewMatrix",T.matrixWorldInverse);const kn=Se.map.cameraPosition;kn!==void 0&&kn.setValue(L,ht.setFromMatrixPosition(T.matrixWorld)),R.logarithmicDepthBuffer&&Se.setValue(L,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&Se.setValue(L,"isOrthographic",T.isOrthographicCamera===!0),K!==T&&(K=T,zn=!0,qs=!0)}if(Et.needsLights&&(di.state.sunShadowMap.length>0&&Se.setValue(L,"sunShadowMap",di.state.sunShadowMap,X),di.state.directionalShadowMap.length>0&&Se.setValue(L,"directionalShadowMap",di.state.directionalShadowMap,X),di.state.spotShadowMap.length>0&&Se.setValue(L,"spotShadowMap",di.state.spotShadowMap,X),di.state.pointShadowMap.length>0&&Se.setValue(L,"pointShadowMap",di.state.pointShadowMap,X)),W.isSkinnedMesh){Se.setOptional(L,W,"bindMatrix"),Se.setOptional(L,W,"bindMatrixInverse");const Ee=W.skeleton;Ee&&(Ee.boneTexture===null&&Ee.computeBoneTexture(),Se.setValue(L,"boneTexture",Ee.boneTexture,X))}W.isBatchedMesh&&(Se.setOptional(L,W,"batchingTexture"),Se.setValue(L,"batchingTexture",W._matricesTexture,X),Se.setOptional(L,W,"batchingIdTexture"),Se.setValue(L,"batchingIdTexture",W._indirectTexture,X),Se.setOptional(L,W,"batchingColorTexture"),W._colorsTexture!==null&&Se.setValue(L,"batchingColorTexture",W._colorsTexture,X));const Vn=Y.morphAttributes;if((Vn.position!==void 0||Vn.normal!==void 0||Vn.color!==void 0)&&F.update(W,Y,Fi),(zn||Et.receiveShadow!==W.receiveShadow)&&(Et.receiveShadow=W.receiveShadow,Se.setValue(L,"receiveShadow",W.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&D.environment!==null&&(Ue.envMapIntensity.value=D.environmentIntensity),Ue.dfgLUT!==void 0&&(Ue.dfgLUT.value=yw()),zn){if(Se.setValue(L,"toneMappingExposure",P.toneMappingExposure),Et.needsLights&&b0(Ue,qs),Mt&&H.fog===!0&&Bt.refreshFogUniforms(Ue,Mt),Bt.refreshMaterialUniforms(Ue,H,tt,q,M.state.transmissionRenderTarget[T.id]),Et.needsLights&&Et.lightProbeGrid){const Ee=Et.lightProbeGrid;Ue.probesSH.value=Ee.texture,Ue.probesMin.value.copy(Ee.boundingBox.min),Ue.probesMax.value.copy(Ee.boundingBox.max),Ue.probesResolution.value.copy(Ee.resolution)}Nl.upload(L,sf(Et),Ue,X)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(Nl.upload(L,sf(Et),Ue,X),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&Se.setValue(L,"center",W.center),Se.setValue(L,"modelViewMatrix",W.modelViewMatrix),Se.setValue(L,"normalMatrix",W.normalMatrix),Se.setValue(L,"modelMatrix",W.matrixWorld),H.uniformsGroups!==void 0){const Ee=H.uniformsGroups;for(let kn=0,Js=Ee.length;kn<Js;kn++){const of=Ee[kn];rt.update(of,Fi),rt.bind(of,Fi)}}return Fi}function b0(T,D){T.ambientLightColor.needsUpdate=D,T.lightProbe.needsUpdate=D,T.sunLights.needsUpdate=D,T.sunLightShadows.needsUpdate=D,T.directionalLights.needsUpdate=D,T.directionalLightShadows.needsUpdate=D,T.pointLights.needsUpdate=D,T.pointLightShadows.needsUpdate=D,T.spotLights.needsUpdate=D,T.spotLightShadows.needsUpdate=D,T.rectAreaLights.needsUpdate=D,T.hemisphereLights.needsUpdate=D}function w0(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return Z},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return nt},this.setRenderTargetTextures=function(T,D,Y){const H=G.get(T);H.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),G.get(T.texture).__webglTexture=D,G.get(T.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:Y,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,D){const Y=G.get(T);Y.__webglFramebuffer=D,Y.__useDefaultFramebuffer=D===void 0},this.setRenderTarget=function(T,D=0,Y=0){nt=T,Z=D,k=Y;let H=null,W=!1,Mt=!1;if(T){const vt=G.get(T);if(vt.__useDefaultFramebuffer!==void 0){S.bindFramebuffer(L.FRAMEBUFFER,vt.__webglFramebuffer),Q.copy(T.viewport),At.copy(T.scissor),St=T.scissorTest,S.viewport(Q),S.scissor(At),S.setScissorTest(St),J=-1;return}else if(vt.__webglFramebuffer===void 0)X.setupRenderTarget(T);else if(vt.__hasExternalTextures)X.rebindTextures(T,G.get(T.texture).__webglTexture,G.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const re=T.depthTexture;if(vt.__boundDepthTexture!==re){if(re!==null&&G.has(re)&&(T.width!==re.image.width||T.height!==re.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");X.setupDepthRenderbuffer(T)}}const It=T.texture;(It.isData3DTexture||It.isDataArrayTexture||It.isCompressedArrayTexture)&&(Mt=!0);const Dt=G.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Dt[D])?H=Dt[D][Y]:H=Dt[D],W=!0):T.samples>0&&X.useMultisampledRTT(T)===!1?H=G.get(T).__webglMultisampledFramebuffer:Array.isArray(Dt)?H=Dt[Y]:H=Dt,Q.copy(T.viewport),At.copy(T.scissor),St=T.scissorTest}else Q.copy(wt).multiplyScalar(tt).floor(),At.copy(Wt).multiplyScalar(tt).floor(),St=fe;if(Y!==0&&(H=V),S.bindFramebuffer(L.FRAMEBUFFER,H)&&S.drawBuffers(T,H),S.viewport(Q),S.scissor(At),S.setScissorTest(St),W){const vt=G.get(T.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+D,vt.__webglTexture,Y)}else if(Mt){const vt=D;for(let It=0;It<T.textures.length;It++){const Dt=G.get(T.textures[It]);L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0+It,Dt.__webglTexture,Y,vt)}}else if(T!==null&&Y!==0){const vt=G.get(T.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,vt.__webglTexture,Y)}J=-1};function af(T){const D=G.get(T);return(D.__readFormat!==T.format||D.__readType!==T.type)&&(D.__readFormat=T.format,D.__readType=T.type,D.__formatReadable=R.textureFormatReadable(T.format),D.__typeReadable=R.textureTypeReadable(T.type)),D}this.readRenderTargetPixels=function(T,D,Y,H,W,Mt,Ct,vt=0){if(!(T&&T.isWebGLRenderTarget)){Ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let It=G.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ct!==void 0&&(It=It[Ct]),It){S.bindFramebuffer(L.FRAMEBUFFER,It);try{const Dt=T.textures[vt],re=Dt.format,ae=Dt.type;T.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+vt);const Lt=af(Dt);if(Lt.__formatReadable===!1){Ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Lt.__typeReadable===!1){Ot("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}D>=0&&D<=T.width-H&&Y>=0&&Y<=T.height-W&&L.readPixels(D,Y,H,W,xt.convert(re),xt.convert(ae),Mt)}finally{const Dt=nt!==null?G.get(nt).__webglFramebuffer:null;S.bindFramebuffer(L.FRAMEBUFFER,Dt)}}},this.readRenderTargetPixelsAsync=async function(T,D,Y,H,W,Mt,Ct,vt=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let It=G.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Ct!==void 0&&(It=It[Ct]),It)if(D>=0&&D<=T.width-H&&Y>=0&&Y<=T.height-W){S.bindFramebuffer(L.FRAMEBUFFER,It);const Dt=T.textures[vt],re=Dt.format,ae=Dt.type;T.textures.length>1&&L.readBuffer(L.COLOR_ATTACHMENT0+vt);const Lt=af(Dt);if(Lt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Lt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ye=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,ye),L.bufferData(L.PIXEL_PACK_BUFFER,Mt.byteLength,L.STREAM_READ),L.readPixels(D,Y,H,W,xt.convert(re),xt.convert(ae),0),L.bindBuffer(L.PIXEL_PACK_BUFFER,null);const Be=nt!==null?G.get(nt).__webglFramebuffer:null;S.bindFramebuffer(L.FRAMEBUFFER,Be);const Ae=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await Sx(L,Ae,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,ye),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,Mt),L.bindBuffer(L.PIXEL_PACK_BUFFER,null),L.deleteBuffer(ye),L.deleteSync(Ae),Mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,D=null,Y=0){const H=Math.pow(2,-Y),W=Math.floor(T.image.width*H),Mt=Math.floor(T.image.height*H),Ct=D!==null?D.x:0,vt=D!==null?D.y:0;X.setTexture2D(T,0),L.copyTexSubImage2D(L.TEXTURE_2D,Y,0,0,Ct,vt,W,Mt),S.unbindTexture()},this.copyTextureToTexture=function(T,D,Y=null,H=null,W=0,Mt=0){let Ct,vt,It,Dt,re,ae,Lt,ye,Be;const Ae=T.isCompressedTexture?T.mipmaps[Mt]:T.image;if(Y!==null)Ct=Y.max.x-Y.min.x,vt=Y.max.y-Y.min.y,It=Y.isBox3?Y.max.z-Y.min.z:1,Dt=Y.min.x,re=Y.min.y,ae=Y.isBox3?Y.min.z:0;else{const Ue=Math.pow(2,-W);Ct=Math.floor(Ae.width*Ue),vt=Math.floor(Ae.height*Ue),T.isDataArrayTexture?It=Ae.depth:T.isData3DTexture?It=Math.floor(Ae.depth*Ue):It=1,Dt=0,re=0,ae=0}H!==null?(Lt=H.x,ye=H.y,Be=H.z):(Lt=0,ye=0,Be=0);const we=xt.convert(D.format),ii=xt.convert(D.type);let Et;D.isData3DTexture?(X.setTexture3D(D,0),Et=L.TEXTURE_3D):D.isDataArrayTexture||D.isCompressedArrayTexture?(X.setTexture2DArray(D,0),Et=L.TEXTURE_2D_ARRAY):(X.setTexture2D(D,0),Et=L.TEXTURE_2D),S.activeTexture(L.TEXTURE0),S.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,D.flipY),S.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,D.premultiplyAlpha),S.pixelStorei(L.UNPACK_ALIGNMENT,D.unpackAlignment);const di=S.getParameter(L.UNPACK_ROW_LENGTH),pe=S.getParameter(L.UNPACK_IMAGE_HEIGHT),Fi=S.getParameter(L.UNPACK_SKIP_PIXELS),sn=S.getParameter(L.UNPACK_SKIP_ROWS),zn=S.getParameter(L.UNPACK_SKIP_IMAGES);S.pixelStorei(L.UNPACK_ROW_LENGTH,Ae.width),S.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Ae.height),S.pixelStorei(L.UNPACK_SKIP_PIXELS,Dt),S.pixelStorei(L.UNPACK_SKIP_ROWS,re),S.pixelStorei(L.UNPACK_SKIP_IMAGES,ae);const qs=T.isDataArrayTexture||T.isData3DTexture,Se=D.isDataArrayTexture||D.isData3DTexture;if(T.isDepthTexture){const Ue=G.get(T),Vn=G.get(D),Ee=G.get(Ue.__renderTarget),kn=G.get(Vn.__renderTarget);S.bindFramebuffer(L.READ_FRAMEBUFFER,Ee.__webglFramebuffer),S.bindFramebuffer(L.DRAW_FRAMEBUFFER,kn.__webglFramebuffer);for(let Js=0;Js<It;Js++)qs&&(L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,G.get(T).__webglTexture,W,ae+Js),L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,G.get(D).__webglTexture,Mt,Be+Js)),L.blitFramebuffer(Dt,re,Ct,vt,Lt,ye,Ct,vt,L.DEPTH_BUFFER_BIT,L.NEAREST);S.bindFramebuffer(L.READ_FRAMEBUFFER,null),S.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else if(W!==0||T.isRenderTargetTexture||G.has(T)){const Ue=G.get(T),Vn=G.get(D);S.bindFramebuffer(L.READ_FRAMEBUFFER,N),S.bindFramebuffer(L.DRAW_FRAMEBUFFER,B);for(let Ee=0;Ee<It;Ee++)qs?L.framebufferTextureLayer(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Ue.__webglTexture,W,ae+Ee):L.framebufferTexture2D(L.READ_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Ue.__webglTexture,W),Se?L.framebufferTextureLayer(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,Vn.__webglTexture,Mt,Be+Ee):L.framebufferTexture2D(L.DRAW_FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_2D,Vn.__webglTexture,Mt),W!==0?L.blitFramebuffer(Dt,re,Ct,vt,Lt,ye,Ct,vt,L.COLOR_BUFFER_BIT,L.NEAREST):Se?L.copyTexSubImage3D(Et,Mt,Lt,ye,Be+Ee,Dt,re,Ct,vt):L.copyTexSubImage2D(Et,Mt,Lt,ye,Dt,re,Ct,vt);S.bindFramebuffer(L.READ_FRAMEBUFFER,null),S.bindFramebuffer(L.DRAW_FRAMEBUFFER,null)}else Se?T.isDataTexture||T.isData3DTexture?L.texSubImage3D(Et,Mt,Lt,ye,Be,Ct,vt,It,we,ii,Ae.data):D.isCompressedArrayTexture?L.compressedTexSubImage3D(Et,Mt,Lt,ye,Be,Ct,vt,It,we,Ae.data):L.texSubImage3D(Et,Mt,Lt,ye,Be,Ct,vt,It,we,ii,Ae):T.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,Mt,Lt,ye,Ct,vt,we,ii,Ae.data):T.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,Mt,Lt,ye,Ae.width,Ae.height,we,Ae.data):L.texSubImage2D(L.TEXTURE_2D,Mt,Lt,ye,Ct,vt,we,ii,Ae);S.pixelStorei(L.UNPACK_ROW_LENGTH,di),S.pixelStorei(L.UNPACK_IMAGE_HEIGHT,pe),S.pixelStorei(L.UNPACK_SKIP_PIXELS,Fi),S.pixelStorei(L.UNPACK_SKIP_ROWS,sn),S.pixelStorei(L.UNPACK_SKIP_IMAGES,zn),Mt===0&&D.generateMipmaps&&L.generateMipmap(Et),S.unbindTexture()},this.initRenderTarget=function(T){G.get(T).__webglFramebuffer===void 0&&X.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?X.setTextureCube(T,0):T.isData3DTexture?X.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?X.setTexture2DArray(T,0):X.setTexture2D(T,0),S.unbindTexture()},this.resetState=function(){Z=0,k=0,nt=null,S.reset(),Tt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ui}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=oe._getDrawingBufferColorSpace(t),e.unpackColorSpace=oe._getUnpackColorSpace()}}const vw=Object.freeze(Object.defineProperty({__proto__:null,ACESFilmicToneMapping:Nc,AddEquation:Rs,AddOperation:Cm,AdditiveAnimationBlendMode:hd,AdditiveBlending:Cr,AgXToneMapping:ed,AlphaFormat:ld,AlwaysCompare:km,AlwaysDepth:Bl,AlwaysStencilFunc:Dm,AmbientLight:Lg,AnimationAction:Vg,AnimationClip:Wa,AnimationLoader:gy,AnimationMixer:qy,AnimationObjectGroup:Wy,AnimationUtils:hy,ArcCurve:sg,ArrayCamera:Fg,ArrowHelper:gv,AttachedBindMode:Ru,Audio:Bg,AudioAnalyser:Uy,AudioContext:Fd,AudioListener:Iy,AudioLoader:Ay,AxesHelper:xv,BackSide:ci,BasicDepthPacking:Nm,BasicShadowMap:C0,BatchedMesh:Qm,BezierInterpolant:Ag,Bone:xd,BooleanKeyframeTrack:Hs,Box2:Gg,Box3:je,Box3Helper:pv,BoxGeometry:Re,BoxHelper:fv,BufferAttribute:ue,BufferGeometry:Zt,BufferGeometryLoader:Dg,ByteType:sd,Cache:dn,Camera:mh,CameraHelper:dv,CanvasTexture:jc,CapsuleGeometry:th,CatmullRomCurve3:rg,CineonToneMapping:ju,CircleGeometry:ls,ClampToEdgeWrapping:Ei,Clock:Qy,Color:bt,ColorKeyframeTrack:Id,ColorManagement:oe,Compatibility:mx,CompressedArrayTexture:C_,CompressedCubeTexture:R_,CompressedTexture:Qc,CompressedTextureLoader:xy,ConeGeometry:Jr,ConstantAlphaFactor:Tm,ConstantColorFactor:bm,Controls:yv,CubeCamera:Og,CubeDepthTexture:ig,CubeReflectionMapping:xn,CubeRefractionMapping:rs,CubeTexture:wo,CubeTextureLoader:_y,CubeUVReflectionMapping:Xr,CubicBezierCurve:Sd,CubicBezierCurve3:ag,CubicInterpolant:Tg,CullFaceBack:Eu,CullFaceFront:om,CullFaceFrontBack:A0,CullFaceNone:am,Curve:en,CurvePath:lg,CustomBlending:cm,CustomToneMapping:td,CylinderGeometry:cs,Cylindrical:tv,Data3DTexture:qc,DataArrayTexture:Xc,DataTexture:Vi,DataTextureLoader:yy,DataUtils:t_,DecrementStencilOp:J0,DecrementWrapStencilOp:Z0,DefaultLoadingManager:Pg,DepthFormat:_n,DepthStencilFormat:Kn,DepthTexture:Ur,DetachedBindMode:Rm,DirectionalLight:xh,DirectionalLightHelper:uv,DiscreteInterpolant:Eg,DodecahedronGeometry:eh,DoubleSide:zi,DstAlphaFactor:_m,DstColorFactor:vm,DynamicCopyUsage:cx,DynamicDrawUsage:oi,DynamicReadUsage:ax,EdgesGeometry:ng,EllipseCurve:ih,EqualCompare:Bm,EqualDepth:Vl,EqualStencilFunc:j0,EquirectangularReflectionMapping:ya,EquirectangularRefractionMapping:va,Euler:On,EventDispatcher:tn,ExternalTexture:yd,ExtrudeGeometry:nh,FileLoader:Bn,Float16BufferAttribute:o_,Float32BufferAttribute:Rt,FloatType:xi,Fog:bo,FogExp2:Jc,FramebufferTexture:A_,FrontSide:ss,Frustum:Bs,FrustumArray:Kc,GLBufferAttribute:Ky,GLSL1:ux,GLSL3:Iu,GreaterCompare:zm,GreaterDepth:Gl,GreaterEqualCompare:Hc,GreaterEqualDepth:kl,GreaterEqualStencilFunc:nx,GreaterStencilFunc:ex,GridHelper:cv,Group:Ln,HTMLTexture:P_,HalfFloatType:Qi,HemisphereLight:Ud,HemisphereLightHelper:lv,IcosahedronGeometry:sh,ImageBitmapLoader:Ey,ImageLoader:Xa,ImageUtils:Xm,IncrementStencilOp:q0,IncrementWrapStencilOp:Y0,InstancedBufferAttribute:Li,InstancedBufferGeometry:Od,InstancedInterleavedBuffer:$y,InstancedMesh:Km,Int16BufferAttribute:r_,Int32BufferAttribute:a_,Int8BufferAttribute:i_,IntType:Dc,InterleavedBuffer:Yc,InterleavedBufferAttribute:Fs,Interpolant:Yr,InterpolateBezier:Pu,InterpolateDiscrete:Ua,InterpolateLinear:vc,InterpolateSmooth:Pl,InterpolationSamplingMode:px,InterpolationSamplingType:fx,InvertStencilOp:$0,KeepStencilOp:Il,KeyframeTrack:Gi,LOD:Zm,LatheGeometry:rh,Layers:is,LessCompare:Fm,LessDepth:zl,LessEqualCompare:Gc,LessEqualDepth:Rr,LessEqualStencilFunc:tx,LessStencilFunc:Q0,Light:ps,LightProbe:Ug,LightShadow:ph,Line:Fn,Line3:nv,LineBasicMaterial:ui,LineCurve:Md,LineCurve3:og,LineDashedMaterial:Mg,LineLoop:jm,LineSegments:vn,LinearFilter:Ce,LinearInterpolant:Pd,LinearMipMapLinearFilter:N0,LinearMipMapNearestFilter:L0,LinearMipmapLinearFilter:un,LinearMipmapNearestFilter:Sa,LinearSRGBColorSpace:Oa,LinearToneMapping:Ku,LinearTransfer:Fa,Loader:Ci,LoaderUtils:Ou,LoadingManager:Nd,LoopOnce:Pm,LoopPingPong:Lm,LoopRepeat:Im,MOUSE:T0,Material:ei,MaterialBlending:R0,MaterialLoader:_h,MathUtils:zx,Matrix2:Bu,Matrix3:te,Matrix4:$t,MaxEquation:fm,Mesh:Kt,MeshBasicMaterial:He,MeshDepthMaterial:Cd,MeshDistanceMaterial:Rd,MeshLambertMaterial:vg,MeshMatcapMaterial:Sg,MeshNormalMaterial:yg,MeshPhongMaterial:xg,MeshPhysicalMaterial:Ad,MeshStandardMaterial:Oe,MeshToonMaterial:_g,MinEquation:dm,MirroredRepeatWrapping:Ia,MixOperation:Am,MultiplyBlending:Cu,MultiplyOperation:So,NearestFilter:Fe,NearestMipMapLinearFilter:I0,NearestMipMapNearestFilter:P0,NearestMipmapLinearFilter:xr,NearestMipmapNearestFilter:nd,NeutralToneMapping:id,NeverCompare:Om,NeverDepth:Fl,NeverStencilFunc:K0,NoBlending:pn,NoColorSpace:Rn,NoNormalPacking:k0,NoToneMapping:Ki,NormalAnimationBlendMode:kc,NormalBlending:es,NormalGAPacking:H0,NormalRGPacking:G0,NotEqualCompare:Vm,NotEqualDepth:Hl,NotEqualStencilFunc:ix,NumberKeyframeTrack:dh,Object3D:he,ObjectLoader:wy,ObjectSpaceNormalMap:Um,OctahedronGeometry:Eo,OneFactor:mm,OneMinusConstantAlphaFactor:Em,OneMinusConstantColorFactor:wm,OneMinusDstAlphaFactor:ym,OneMinusDstColorFactor:Sm,OneMinusSrcAlphaFactor:$u,OneMinusSrcColorFactor:xm,OrthographicCamera:Ao,PCFShadowMap:Sr,PCFSoftShadowMap:lm,PMREMGenerator:Vu,Path:Va,PerspectiveCamera:Ze,Plane:Cn,PlaneGeometry:mn,PlaneHelper:mv,PointLight:gh,PointLightHelper:av,Points:tg,PointsMaterial:_d,PolarGridHelper:hv,PolyhedronGeometry:fs,PositionalAudio:Ny,PropertyBinding:me,PropertyMixer:zg,QuadraticBezierCurve:bd,QuadraticBezierCurve3:wd,Quaternion:yi,QuaternionKeyframeTrack:fh,QuaternionLinearInterpolant:Rg,R11_EAC_Format:Kl,RED_GREEN_RGTC2_Format:Na,RED_RGTC1_Format:xc,REVISION:Lc,RG11_EAC_Format:La,RGBADepthPacking:B0,RGBAFormat:_i,RGBAIntegerFormat:Vc,RGBA_ASTC_10x10_Format:uc,RGBA_ASTC_10x5_Format:lc,RGBA_ASTC_10x6_Format:cc,RGBA_ASTC_10x8_Format:hc,RGBA_ASTC_12x10_Format:dc,RGBA_ASTC_12x12_Format:fc,RGBA_ASTC_4x4_Format:tc,RGBA_ASTC_5x4_Format:ec,RGBA_ASTC_5x5_Format:ic,RGBA_ASTC_6x5_Format:nc,RGBA_ASTC_6x6_Format:sc,RGBA_ASTC_8x5_Format:rc,RGBA_ASTC_8x6_Format:ac,RGBA_ASTC_8x8_Format:oc,RGBA_BPTC_Format:pc,RGBA_ETC2_EAC_Format:$l,RGBA_PVRTC_2BPPV1_Format:Jl,RGBA_PVRTC_4BPPV1_Format:ql,RGBA_S3TC_DXT1_Format:ba,RGBA_S3TC_DXT3_Format:wa,RGBA_S3TC_DXT5_Format:Ta,RGBDepthPacking:z0,RGBFormat:cd,RGBIntegerFormat:U0,RGB_BPTC_SIGNED_Format:mc,RGB_BPTC_UNSIGNED_Format:gc,RGB_ETC1_Format:Yl,RGB_ETC2_Format:Zl,RGB_PVRTC_2BPPV1_Format:Xl,RGB_PVRTC_4BPPV1_Format:Wl,RGB_S3TC_DXT1_Format:Ma,RGDepthPacking:V0,RGFormat:as,RGIntegerFormat:zc,RawShaderMaterial:Ed,Ray:qr,Raycaster:kg,RectAreaLight:Ng,RedFormat:Bc,RedIntegerFormat:Mo,ReinhardToneMapping:Qu,RenderObjectRefreshType:gx,RenderTarget:dd,RenderTarget3D:Jy,RepeatWrapping:Pr,ReplaceStencilOp:X0,ReverseSubtractEquation:um,RingGeometry:ah,SIGNED_R11_EAC_Format:Ql,SIGNED_RED_GREEN_RGTC2_Format:yc,SIGNED_RED_RGTC1_Format:_c,SIGNED_RG11_EAC_Format:jl,SRGBColorSpace:Qe,SRGBTransfer:ve,Scene:fd,ShaderChunk:ie,ShaderLib:Zi,ShaderMaterial:hi,ShadowMaterial:pg,Shape:To,ShapeGeometry:oh,ShapePath:_v,ShapeUtils:$i,ShortType:rd,Skeleton:$c,SkeletonHelper:rv,SkinnedMesh:$m,Source:Gx,Sphere:ti,SphereGeometry:hs,Spherical:jy,SphericalHarmonics3:Dd,SplineCurve:Td,SpotLight:Ig,SpotLightHelper:sv,Sprite:gd,SpriteMaterial:Zc,SrcAlphaFactor:Zu,SrcAlphaSaturateFactor:Mm,SrcColorFactor:gm,StaticCopyUsage:lx,StaticDrawUsage:Wc,StaticReadUsage:rx,StereoCamera:Cy,StreamCopyUsage:hx,StreamDrawUsage:sx,StreamReadUsage:ox,StringKeyframeTrack:Ws,SubtractEquation:hm,SubtractiveBlending:Au,TOUCH:E0,TangentSpaceNormalMap:Dn,TetrahedronGeometry:lh,Texture:Ie,TextureLoader:vy,TextureSource:In,TextureUtils:wv,Timer:Bd,TimestampQuery:dx,TorusGeometry:ch,TorusKnotGeometry:hh,Triangle:gi,TriangleFanDrawMode:F0,TriangleStripDrawMode:O0,TrianglesDrawMode:D0,TubeGeometry:uh,UVMapping:Uc,Uint16BufferAttribute:pd,Uint32BufferAttribute:md,Uint8BufferAttribute:n_,Uint8ClampedBufferAttribute:s_,Uniform:bi,UniformsGroup:Zy,UniformsLib:_t,UniformsUtils:gg,UnsignedByteType:Ti,UnsignedInt101111Type:od,UnsignedInt248Type:Lr,UnsignedInt5999Type:ad,UnsignedIntType:ki,UnsignedShort4444Type:Oc,UnsignedShort5551Type:Fc,UnsignedShortType:Ir,VSMShadowMap:gr,Vector2:st,Vector3:C,Vector4:be,VectorKeyframeTrack:Ld,VideoFrameTexture:E_,VideoTexture:eg,WebGL3DRenderTarget:Xx,WebGLArrayRenderTarget:Wx,WebGLCoordinateSystem:Ui,WebGLCubeRenderTarget:kd,WebGLRenderTarget:Ai,WebGLRenderer:Qg,WebGLUtils:$g,WebGPUCoordinateSystem:Os,WebXRController:Ll,WireframeGeometry:fg,WrapAroundEnding:Da,ZeroCurvatureEnding:Ps,ZeroFactor:pm,ZeroSlopeEnding:Is,ZeroStencilOp:W0,createCanvasElement:Hm,error:Ot,getConsoleFunction:vx,log:za,setConsoleFunction:yx,warn:dt,warnOnce:Nn},Symbol.toStringTag,{value:"Module"})),ai=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Vp=1234567;const jg=Math.PI/180,t0=180/Math.PI;function Sw(){const r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(ai[r&255]+ai[r>>8&255]+ai[r>>16&255]+ai[r>>24&255]+"-"+ai[t&255]+ai[t>>8&255]+"-"+ai[t>>16&15|64]+ai[t>>24&255]+"-"+ai[e&63|128]+ai[e>>8&255]+"-"+ai[e>>16&255]+ai[e>>24&255]+ai[i&255]+ai[i>>8&255]+ai[i>>16&255]+ai[i>>24&255]).toLowerCase()}function cn(r,t,e){return Math.max(t,Math.min(e,r))}function e0(r,t){return(r%t+t)%t}function Mw(r,t,e,i,n){return i+(r-t)*(n-i)/(e-t)}function bw(r,t,e){return r!==t?(e-r)/(t-r):0}function i0(r,t,e){return(1-e)*r+e*t}function ww(r,t,e,i){return i0(r,t,1-Math.exp(-e*i))}function Tw(r,t=1){return t-Math.abs(e0(r,t*2)-t)}function Ew(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*(3-2*r))}function Aw(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*r*(r*(r*6-15)+10))}function Cw(r,t){return r+Math.floor(Math.random()*(t-r+1))}function Rw(r,t){return r+Math.random()*(t-r)}function Pw(r){return r*(.5-Math.random())}function Iw(r){r!==void 0&&(Vp=r);let t=Vp+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Lw(r){return r*jg}function Nw(r){return r*t0}function Uw(r){return(r&r-1)===0&&r!==0}function Dw(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function Ow(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function Fw(r,t,e,i,n){const s=Math.cos,a=Math.sin,o=s(e/2),l=a(e/2),c=s((t+i)/2),h=a((t+i)/2),d=s((t-i)/2),u=a((t-i)/2),f=s((i-t)/2),p=a((i-t)/2);switch(n){case"XYX":r.set(o*h,l*d,l*u,o*c);break;case"YZY":r.set(l*u,o*h,l*d,o*c);break;case"ZXZ":r.set(l*d,l*u,o*h,o*c);break;case"XZX":r.set(o*h,l*p,l*f,o*c);break;case"YXY":r.set(l*f,o*h,l*p,o*c);break;case"ZYZ":r.set(l*p,l*f,o*h,o*c);break;default:console.warn("../math.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+n)}}function Bw(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function zw(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const $r={DEG2RAD:jg,RAD2DEG:t0,generateUUID:Sw,clamp:cn,euclideanModulo:e0,mapLinear:Mw,inverseLerp:bw,lerp:i0,damp:ww,pingpong:Tw,smoothstep:Ew,smootherstep:Aw,randInt:Cw,randFloat:Rw,randFloatSpread:Pw,seededRandom:Iw,degToRad:Lw,radToDeg:Nw,isPowerOfTwo:Uw,ceilPowerOfTwo:Dw,floorPowerOfTwo:Ow,setQuaternionFromProperEuler:Fw,normalize:zw,denormalize:Bw};class xe{constructor(t=0,e=0,i=0,n=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=n}static slerpFlat(t,e,i,n,s,a,o){let l=i[n+0],c=i[n+1],h=i[n+2],d=i[n+3];const u=s[a+0],f=s[a+1],p=s[a+2],x=s[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d;return}if(o===1){t[e+0]=u,t[e+1]=f,t[e+2]=p,t[e+3]=x;return}if(d!==x||l!==u||c!==f||h!==p){let m=1-o;const g=l*u+c*f+h*p+d*x,v=g>=0?1:-1,w=1-g*g;if(w>Number.EPSILON){const b=Math.sqrt(w),M=Math.atan2(b,g*v);m=Math.sin(m*M)/b,o=Math.sin(o*M)/b}const _=o*v;if(l=l*m+u*_,c=c*m+f*_,h=h*m+p*_,d=d*m+x*_,m===1-o){const b=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=b,c*=b,h*=b,d*=b}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,i,n,s,a){const o=i[n],l=i[n+1],c=i[n+2],h=i[n+3],d=s[a],u=s[a+1],f=s[a+2],p=s[a+3];return t[e]=o*p+h*d+l*f-c*u,t[e+1]=l*p+h*u+c*d-o*f,t[e+2]=c*p+h*f+o*u-l*d,t[e+3]=h*p-o*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,n){return this._x=t,this._y=e,this._z=i,this._w=n,this._onChangeCallback(),this}clone(){return new xe(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,n=t._y,s=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(n/2),d=o(s/2),u=l(i/2),f=l(n/2),p=l(s/2);switch(a){case"XYZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"YXZ":this._x=u*h*d+c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"ZXY":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d-u*f*p;break;case"ZYX":this._x=u*h*d-c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d+u*f*p;break;case"YZX":this._x=u*h*d+c*f*p,this._y=c*f*d+u*h*p,this._z=c*h*p-u*f*d,this._w=c*h*d-u*f*p;break;case"XZY":this._x=u*h*d-c*f*p,this._y=c*f*d-u*h*p,this._z=c*h*p+u*f*d,this._w=c*h*d+u*f*p;break;default:console.warn("../math.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,n=Math.sin(i);return this._x=t.x*n,this._y=t.y*n,this._z=t.z*n,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],n=e[4],s=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=i+o+d;if(u>0){const f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(s-c)*f,this._z=(a-n)*f}else if(i>o&&i>d){const f=2*Math.sqrt(1+i-o-d);this._w=(h-l)/f,this._x=.25*f,this._y=(n+a)/f,this._z=(s+c)/f}else if(o>d){const f=2*Math.sqrt(1+o-i-d);this._w=(s-c)/f,this._x=(n+a)/f,this._y=.25*f,this._z=(l+h)/f}else{const f=2*Math.sqrt(1+d-i-o);this._w=(a-n)/f,this._x=(s+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(cn(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const n=Math.min(1,e/i);return this.slerp(t,n),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,n=t._y,s=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+a*o+n*c-s*l,this._y=n*h+a*l+s*o-i*c,this._z=s*h+a*c+i*l-n*o,this._w=a*h-i*o-n*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,n=this._y,s=this._z,a=this._w;let o=a*t._w+i*t._x+n*t._y+s*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=i,this._y=n,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const f=1-e;return this._w=f*a+e*this._w,this._x=f*i+e*this._x,this._y=f*n+e*this._y,this._z=f*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-e)*h)/c,u=Math.sin(e*h)/c;return this._w=a*d+this._w*u,this._x=i*d+this._x*u,this._y=n*d+this._y*u,this._z=s*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),n=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(n*Math.sin(t),n*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class Nt{constructor(t=0,e=0,i=0){this.isVector3=!0,Nt.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new Nt(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(kp.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(kp.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,n=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*n,this.y=s[1]*e+s[4]*i+s[7]*n,this.z=s[2]*e+s[5]*i+s[8]*n,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,s=t.elements,a=1/(s[3]*e+s[7]*i+s[11]*n+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*n+s[12])*a,this.y=(s[1]*e+s[5]*i+s[9]*n+s[13])*a,this.z=(s[2]*e+s[6]*i+s[10]*n+s[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,n=this.z,s=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*n-o*i),h=2*(o*e-s*n),d=2*(s*i-a*e);return this.x=e+l*c+a*d-o*h,this.y=i+l*h+o*c-s*d,this.z=n+l*d+s*h-a*c,this}transformDirection(t){const e=this.x,i=this.y,n=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*n,this.y=s[1]*e+s[5]*i+s[9]*n,this.z=s[2]*e+s[6]*i+s[10]*n,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,n=t.y,s=t.z,a=e.x,o=e.y,l=e.z;return this.x=n*l-s*o,this.y=s*a-i*l,this.z=i*o-n*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return pu.copy(this).projectOnVector(t),this.sub(pu)}reflect(t){return this.sub(pu.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(cn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,n=this.z-t.z;return e*e+i*i+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSphericalCoords(t,e,i){const n=Math.sin(e)*t;return this.x=n*Math.sin(i),this.y=Math.cos(e)*t,this.z=n*Math.cos(i),this}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),n=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=n,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}abs(){return this.x=Math.abs(this.x),this.y=Math.abs(this.y),this.z=Math.abs(this.z),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const pu=new Nt,kp=new xe,wl=2e3,Gp=2001;class ji{constructor(t,e,i,n,s,a,o,l,c,h,d,u,f,p,x,m){this.isMatrix4=!0,ji.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,n,s,a,o,l,c,h,d,u,f,p,x,m)}extractPosition(t){return console.warn("THREE.Matrix4: .extractPosition() has been renamed to .copyPosition()."),this.copyPosition(t)}multiplyToArray(t,e,i){return console.error("THREE.Matrix4: .multiplyToArray() has been removed."),this}setRotationFromQuaternion(t){return this.makeRotationFromQuaternion(t)}set(t,e,i,n,s,a,o,l,c,h,d,u,f,p,x,m){const g=this.elements;return g[0]=t,g[4]=e,g[8]=i,g[12]=n,g[1]=s,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=h,g[10]=d,g[14]=u,g[3]=f,g[7]=p,g[11]=x,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ji().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,n=1/mr.setFromMatrixColumn(t,0).length(),s=1/mr.setFromMatrixColumn(t,1).length(),a=1/mr.setFromMatrixColumn(t,2).length();return e[0]=i[0]*n,e[1]=i[1]*n,e[2]=i[2]*n,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,n=t.y,s=t.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(n),c=Math.sin(n),h=Math.cos(s),d=Math.sin(s);if(t.order==="XYZ"){const u=a*h,f=a*d,p=o*h,x=o*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+p*c,e[5]=u-x*c,e[9]=-o*l,e[2]=x-u*c,e[6]=p+f*c,e[10]=a*l}else if(t.order==="YXZ"){const u=l*h,f=l*d,p=c*h,x=c*d;e[0]=u+x*o,e[4]=p*o-f,e[8]=a*c,e[1]=a*d,e[5]=a*h,e[9]=-o,e[2]=f*o-p,e[6]=x+u*o,e[10]=a*l}else if(t.order==="ZXY"){const u=l*h,f=l*d,p=c*h,x=c*d;e[0]=u-x*o,e[4]=-a*d,e[8]=p+f*o,e[1]=f+p*o,e[5]=a*h,e[9]=x-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const u=a*h,f=a*d,p=o*h,x=o*d;e[0]=l*h,e[4]=p*c-f,e[8]=u*c+x,e[1]=l*d,e[5]=x*c+u,e[9]=f*c-p,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const u=a*l,f=a*c,p=o*l,x=o*c;e[0]=l*h,e[4]=x-u*d,e[8]=p*d+f,e[1]=d,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=f*d+p,e[10]=u-x*d}else if(t.order==="XZY"){const u=a*l,f=a*c,p=o*l,x=o*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+x,e[5]=a*h,e[9]=f*d-p,e[2]=p*d-f,e[6]=o*h,e[10]=x*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Vw,t,kw)}lookAt(t,e,i){const n=this.elements;return Ii.subVectors(t,e),Ii.lengthSq()===0&&(Ii.z=1),Ii.normalize(),Yn.crossVectors(i,Ii),Yn.lengthSq()===0&&(Math.abs(i.z)===1?Ii.x+=1e-4:Ii.z+=1e-4,Ii.normalize(),Yn.crossVectors(i,Ii)),Yn.normalize(),Tl.crossVectors(Ii,Yn),n[0]=Yn.x,n[4]=Tl.x,n[8]=Ii.x,n[1]=Yn.y,n[5]=Tl.y,n[9]=Ii.y,n[2]=Yn.z,n[6]=Tl.z,n[10]=Ii.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],d=i[5],u=i[9],f=i[13],p=i[2],x=i[6],m=i[10],g=i[14],v=i[3],w=i[7],_=i[11],b=i[15],M=n[0],A=n[4],y=n[8],E=n[12],P=n[1],I=n[5],U=n[9],V=n[13],N=n[2],B=n[6],Z=n[10],k=n[14],nt=n[3],J=n[7],K=n[11],Q=n[15];return s[0]=a*M+o*P+l*N+c*nt,s[4]=a*A+o*I+l*B+c*J,s[8]=a*y+o*U+l*Z+c*K,s[12]=a*E+o*V+l*k+c*Q,s[1]=h*M+d*P+u*N+f*nt,s[5]=h*A+d*I+u*B+f*J,s[9]=h*y+d*U+u*Z+f*K,s[13]=h*E+d*V+u*k+f*Q,s[2]=p*M+x*P+m*N+g*nt,s[6]=p*A+x*I+m*B+g*J,s[10]=p*y+x*U+m*Z+g*K,s[14]=p*E+x*V+m*k+g*Q,s[3]=v*M+w*P+_*N+b*nt,s[7]=v*A+w*I+_*B+b*J,s[11]=v*y+w*U+_*Z+b*K,s[15]=v*E+w*V+_*k+b*Q,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],n=t[8],s=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],p=t[3],x=t[7],m=t[11],g=t[15];return p*(+s*l*d-n*c*d-s*o*u+i*c*u+n*o*f-i*l*f)+x*(+e*l*f-e*c*u+s*a*u-n*a*f+n*c*h-s*l*h)+m*(+e*c*d-e*o*f-s*a*d+i*a*f+s*o*h-i*c*h)+g*(-n*o*h-e*l*d+e*o*u+n*a*d-i*a*u+i*l*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const n=this.elements;return t.isVector3?(n[12]=t.x,n[13]=t.y,n[14]=t.z):(n[12]=t,n[13]=e,n[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],p=t[12],x=t[13],m=t[14],g=t[15],v=d*m*c-x*u*c+x*l*f-o*m*f-d*l*g+o*u*g,w=p*u*c-h*m*c-p*l*f+a*m*f+h*l*g-a*u*g,_=h*x*c-p*d*c+p*o*f-a*x*f-h*o*g+a*d*g,b=p*d*l-h*x*l-p*o*u+a*x*u+h*o*m-a*d*m,M=e*v+i*w+n*_+s*b;if(M===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/M;return t[0]=v*A,t[1]=(x*u*s-d*m*s-x*n*f+i*m*f+d*n*g-i*u*g)*A,t[2]=(o*m*s-x*l*s+x*n*c-i*m*c-o*n*g+i*l*g)*A,t[3]=(d*l*s-o*u*s-d*n*c+i*u*c+o*n*f-i*l*f)*A,t[4]=w*A,t[5]=(h*m*s-p*u*s+p*n*f-e*m*f-h*n*g+e*u*g)*A,t[6]=(p*l*s-a*m*s-p*n*c+e*m*c+a*n*g-e*l*g)*A,t[7]=(a*u*s-h*l*s+h*n*c-e*u*c-a*n*f+e*l*f)*A,t[8]=_*A,t[9]=(p*d*s-h*x*s-p*i*f+e*x*f+h*i*g-e*d*g)*A,t[10]=(a*x*s-p*o*s+p*i*c-e*x*c-a*i*g+e*o*g)*A,t[11]=(h*o*s-a*d*s-h*i*c+e*d*c+a*i*f-e*o*f)*A,t[12]=b*A,t[13]=(h*x*n-p*d*n+p*i*u-e*x*u-h*i*m+e*d*m)*A,t[14]=(p*o*n-a*x*n-p*i*l+e*x*l+a*i*m-e*o*m)*A,t[15]=(a*d*n-h*o*n+h*i*l-e*d*l-a*i*u+e*o*u)*A,this}scale(t){const e=this.elements,i=t.x,n=t.y,s=t.z;return e[0]*=i,e[4]*=n,e[8]*=s,e[1]*=i,e[5]*=n,e[9]*=s,e[2]*=i,e[6]*=n,e[10]*=s,e[3]*=i,e[7]*=n,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],n=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,n))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),n=Math.sin(e),s=1-i,a=t.x,o=t.y,l=t.z,c=s*a,h=s*o;return this.set(c*a+i,c*o-n*l,c*l+n*o,0,c*o+n*l,h*o+i,h*l-n*a,0,c*l-n*o,h*l+n*a,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,n,s,a){return this.set(1,i,s,0,t,1,a,0,e,n,1,0,0,0,0,1),this}compose(t,e,i){const n=this.elements,s=e._x,a=e._y,o=e._z,l=e._w,c=s+s,h=a+a,d=o+o,u=s*c,f=s*h,p=s*d,x=a*h,m=a*d,g=o*d,v=l*c,w=l*h,_=l*d,b=i.x,M=i.y,A=i.z;return n[0]=(1-(x+g))*b,n[1]=(f+_)*b,n[2]=(p-w)*b,n[3]=0,n[4]=(f-_)*M,n[5]=(1-(u+g))*M,n[6]=(m+v)*M,n[7]=0,n[8]=(p+w)*A,n[9]=(m-v)*A,n[10]=(1-(u+x))*A,n[11]=0,n[12]=t.x,n[13]=t.y,n[14]=t.z,n[15]=1,this}decompose(t,e,i){const n=this.elements;let s=mr.set(n[0],n[1],n[2]).length();const a=mr.set(n[4],n[5],n[6]).length(),o=mr.set(n[8],n[9],n[10]).length();this.determinant()<0&&(s=-s),t.x=n[12],t.y=n[13],t.z=n[14],Ji.copy(this);const c=1/s,h=1/a,d=1/o;return Ji.elements[0]*=c,Ji.elements[1]*=c,Ji.elements[2]*=c,Ji.elements[4]*=h,Ji.elements[5]*=h,Ji.elements[6]*=h,Ji.elements[8]*=d,Ji.elements[9]*=d,Ji.elements[10]*=d,e.setFromRotationMatrix(Ji),i.x=s,i.y=a,i.z=o,this}makePerspective(t,e,i,n,s,a,o=wl){const l=this.elements,c=2*s/(e-t),h=2*s/(i-n),d=(e+t)/(e-t),u=(i+n)/(i-n);let f,p;if(o===wl)f=-(a+s)/(a-s),p=-2*a*s/(a-s);else if(o===Gp)f=-a/(a-s),p=-a*s/(a-s);else throw new Error("Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=f,l[14]=p,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,n,s,a,o=wl){const l=this.elements,c=1/(e-t),h=1/(i-n),d=1/(a-s),u=(e+t)*c,f=(i+n)*h;let p,x;if(o===wl)p=(a+s)*d,x=-2*d;else if(o===Gp)p=s*d,x=-1*d;else throw new Error("../math.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-f,l[2]=0,l[6]=0,l[10]=x,l[14]=-p,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<16;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const mr=new Nt,Ji=new ji,Vw=new Nt(0,0,0),kw=new Nt(1,1,1),Yn=new Nt,Tl=new Nt,Ii=new Nt,Hp=new ji,Wp=new xe;class qa{constructor(t=0,e=0,i=0,n=qa.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=n}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,n=this._order){return this._x=t,this._y=e,this._z=i,this._order=n,this._onChangeCallback(),this}clone(){return new qa(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const n=t.elements,s=n[0],a=n[4],o=n[8],l=n[1],c=n[5],h=n[9],d=n[2],u=n[6],f=n[10];switch(e){case"XYZ":this._y=Math.asin(cn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-cn(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(cn(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-cn(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(cn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-cn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,f),this._y=0);break;default:console.warn("../math.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Hp.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Hp,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Wp.setFromEuler(this),this.setFromQuaternion(Wp,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(t){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}qa.DEFAULT_ORDER="XYZ";class Fr{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new Fr(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,n=t.elements;return this.x=n[0]*e+n[3]*i+n[6],this.y=n[1]*e+n[4]*i+n[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(cn(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}rotateAround(t,e){const i=Math.cos(e),n=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*i-a*n+t.x,this.y=s*n+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}Fr.isVector2=!0;class Oi{constructor(t=0,e=0,i=0,n=1){Oi.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=n}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,n){return this.x=t,this.y=e,this.z=i,this.w=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new Oi(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,n=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*n+a[12]*s,this.y=a[1]*e+a[5]*i+a[9]*n+a[13]*s,this.z=a[2]*e+a[6]*i+a[10]*n+a[14]*s,this.w=a[3]*e+a[7]*i+a[11]*n+a[15]*s,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,n,s;const l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],p=l[9],x=l[2],m=l[6],g=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-x)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+x)<.1&&Math.abs(p+m)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const w=(c+1)/2,_=(f+1)/2,b=(g+1)/2,M=(h+u)/4,A=(d+x)/4,y=(p+m)/4;return w>_&&w>b?w<.01?(i=0,n=.707106781,s=.707106781):(i=Math.sqrt(w),n=M/i,s=A/i):_>b?_<.01?(i=.707106781,n=0,s=.707106781):(n=Math.sqrt(_),i=M/n,s=y/n):b<.01?(i=.707106781,n=.707106781,s=0):(s=Math.sqrt(b),i=A/s,n=y/s),this.set(i,n,s,e),this}let v=Math.sqrt((m-p)*(m-p)+(d-x)*(d-x)+(u-h)*(u-h));return Math.abs(v)<.001&&(v=1),this.x=(m-p)/v,this.y=(d-x)/v,this.z=(u-h)/v,this.w=Math.acos((c+f+g-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class fn{constructor(t,e,i,n,s,a,o,l,c){fn.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,n,s,a,o,l,c)}set(t,e,i,n,s,a,o,l,c){const h=this.elements;return h[0]=t,h[1]=n,h[2]=o,h[3]=e,h[4]=s,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,n=e.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],d=i[7],u=i[2],f=i[5],p=i[8],x=n[0],m=n[3],g=n[6],v=n[1],w=n[4],_=n[7],b=n[2],M=n[5],A=n[8];return s[0]=a*x+o*v+l*b,s[3]=a*m+o*w+l*M,s[6]=a*g+o*_+l*A,s[1]=c*x+h*v+d*b,s[4]=c*m+h*w+d*M,s[7]=c*g+h*_+d*A,s[2]=u*x+f*v+p*b,s[5]=u*m+f*w+p*M,s[8]=u*g+f*_+p*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],n=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-i*s*h+i*o*l+n*s*c-n*a*l}invert(){const t=this.elements,e=t[0],i=t[1],n=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],d=h*a-o*c,u=o*l-h*s,f=c*s-a*l,p=e*d+i*u+n*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/p;return t[0]=d*x,t[1]=(n*c-h*i)*x,t[2]=(o*i-n*a)*x,t[3]=u*x,t[4]=(h*e-n*l)*x,t[5]=(n*s-o*e)*x,t[6]=f*x,t[7]=(i*l-c*e)*x,t[8]=(a*e-i*s)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,n,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+t,-n*c,n*l,-n*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(mu.makeScale(t,e)),this}rotate(t){return this.premultiply(mu.makeRotation(-t)),this}translate(t,e){return this.premultiply(mu.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let n=0;n<9;n++)if(e[n]!==i[n])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new fn().fromArray(this.elements)}}const mu=new fn;var li;(function(r){r[r.Random=0]="Random",r[r.Loop=1]="Loop",r[r.PingPong=2]="PingPong",r[r.Burst=3]="Burst"})(li||(li={}));function Kr(r,t,e,i){let n;switch(li.Random===r?t=Math.random():li.Burst===r&&i.isBursting&&(t=i.burstParticleIndex/i.burstParticleCount),e>0?n=Math.floor(t/e)*e:n=t,r){case li.Loop:n=n%1;break;case li.PingPong:n=Math.abs(n%2-1);break}return n}class Qn{constructor(t,e,i,n){this.p=[t,e,i,n]}genValue(t){const e=t*t,i=t*t*t,n=1-t,s=n*n,a=s*n;return this.p[0]*a+this.p[1]*s*t*3+this.p[2]*n*e*3+this.p[3]*i}derivativeCoefficients(t){const e=[];for(let i=t,n=i.length-1;n>0;n--){const s=[];for(let a=0;a<n;a++){const o=n*(i[a+1]-i[a]);s.push(o)}e.push(s),i=s}return e}getSlope(t){const e=this.derivativeCoefficients(this.p)[0],i=1-t,n=i*i,s=i*t*2,a=t*t;return n*e[0]+s*e[1]+a*e[2]}controlCurve(t,e){this.p[1]=t/3+this.p[0],this.p[2]=this.p[3]-e/3}hull(t){let e=this.p,i=[],n,s=0,a=0,o=0;const l=[];for(l[s++]=e[0],l[s++]=e[1],l[s++]=e[2],l[s++]=e[3];e.length>1;){for(i=[],a=0,o=e.length-1;a<o;a++)n=t*e[a]+(1-t)*e[a+1],l[s++]=n,i.push(n);e=i}return l}split(t){const e=this.hull(t);return{left:new Qn(e[0],e[4],e[7],e[9]),right:new Qn(e[9],e[8],e[6],e[3]),span:e}}clone(){return new Qn(this.p[0],this.p[1],this.p[2],this.p[3])}toJSON(){return{p0:this.p[0],p1:this.p[1],p2:this.p[2],p3:this.p[3]}}static fromJSON(t){return new Qn(t.p0,t.p1,t.p2,t.p3)}}const Ja=r=>({r:r.x,g:r.y,b:r.z,a:r.w}),Ya=r=>new Oi(r.r,r.g,r.b,r.a),Gw=(r,t)=>{switch(t){case"Vector3":return new Nt(r.x,r.y,r.z);case"Vector4":return new Oi(r.x,r.y,r.z,r.w);case"Color":return new Nt(r.r,r.g,r.b);case"Number":return r;default:return r}},Hw=(r,t)=>{switch(t){case"Vector3":return{x:r.x,y:r.y,z:r.z};case"Vector4":return{x:r.x,y:r.y,z:r.z,w:r.w};case"Color":return{r:r.x,g:r.y,b:r.z};case"Number":return r;default:return r}};class wc{constructor(t,e){this.a=t,this.b=e,this.type="value"}startGen(t){}genColor(t,e){const i=Math.random();return e.copy(this.a).lerp(this.b,i)}toJSON(){return{type:"RandomColor",a:Ja(this.a),b:Ja(this.b)}}static fromJSON(t){return new wc(Ya(t.a),Ya(t.b))}clone(){return new wc(this.a.clone(),this.b.clone())}}class Br{constructor(t,e){this.a=t,this.b=e,this.indexCount=-1,this.type="value"}startGen(t){this.indexCount=t.length,t.push(Math.random())}genColor(t,e){return this.indexCount===-1&&this.startGen(t),e.copy(this.a).lerp(this.b,t[this.indexCount])}toJSON(){return{type:"ColorRange",a:Ja(this.a),b:Ja(this.b)}}static fromJSON(t){return new Br(Ya(t.a),Ya(t.b))}clone(){return new Br(this.a.clone(),this.b.clone())}}class jn{constructor(t,e){this.subType=e,this.type="function",this.keys=t}findKey(t){let e=0,i=0,n=this.keys.length-1;for(;i+1<n;)if(e=Math.floor((i+n)/2),t<this.getStartX(e))n=e-1;else if(t>this.getEndX(e))i=e+1;else return e;for(let s=i;s<=n;s++)if(t>=this.getStartX(s)&&t<=this.getEndX(s))return s;return-1}getStartX(t){return this.keys[t][1]}getEndX(t){return t+1<this.keys.length?this.keys[t+1][1]:1}genValue(t,e){const i=this.findKey(e);return this.subType==="Number"?i===-1?this.keys[0][0]:i+1>=this.keys.length?this.keys[this.keys.length-1][0]:(this.keys[i+1][0]-this.keys[i][0])*((e-this.getStartX(i))/(this.getEndX(i)-this.getStartX(i)))+this.keys[i][0]:i===-1?t.copy(this.keys[0][0]):i+1>=this.keys.length?t.copy(this.keys[this.keys.length-1][0]):t.copy(this.keys[i][0]).lerp(this.keys[i+1][0],(e-this.getStartX(i))/(this.getEndX(i)-this.getStartX(i)))}toJSON(){return this.keys[0][0].constructor.name,{type:"CLinearFunction",subType:this.subType,keys:this.keys.map(([t,e])=>({value:Hw(t,this.subType),pos:e}))}}static fromJSON(t){return new jn(t.keys.map(e=>[Gw(e.value,t.subType),e.pos]),t.subType)}clone(){return this.subType==="Number"?new jn(this.keys.map(([t,e])=>[t,e]),this.subType):new jn(this.keys.map(([t,e])=>[t.clone(),e]),this.subType)}}const El=new Nt;class ns{constructor(t=[[new Nt(0,0,0),0],[new Nt(1,1,1),0]],e=[[1,0],[1,1]]){this.type="function",this.color=new jn(t,"Color"),this.alpha=new jn(e,"Number")}genColor(t,e,i){return this.color.genValue(El,i),e.set(El.x,El.y,El.z,this.alpha.genValue(1,i))}toJSON(){return{type:"Gradient",color:this.color.toJSON(),alpha:this.alpha.toJSON()}}static fromJSON(t){if(t.functions){const e=t.functions.map(i=>[Br.fromJSON(i.function).a,i.start]);return t.functions.length>0&&e.push([Br.fromJSON(t.functions[t.functions.length-1].function).b,1]),new ns(e.map(i=>[new Nt(i[0].x,i[0].y,i[0].z),i[1]]),e.map(i=>[i[0].w,i[1]]))}else{const e=new ns;return e.alpha=jn.fromJSON(t.alpha),e.color=jn.fromJSON(t.color),e}}clone(){const t=new ns;return t.alpha=this.alpha.clone(),t.color=this.color.clone(),t}startGen(t){}}const gu=new Oi;class Tc{constructor(t,e){this.indexCount=0,this.type="function",this.gradient1=t,this.gradient2=e}startGen(t){this.indexCount=t.length,t.push(Math.random())}genColor(t,e,i){return this.gradient1.genColor(t,e,i),this.gradient2.genColor(t,gu,i),t&&t[this.indexCount]!==void 0?e.lerp(gu,t[this.indexCount]):e.lerp(gu,Math.random()),e}toJSON(){return{type:"RandomColorBetweenGradient",gradient1:this.gradient1.toJSON(),gradient2:this.gradient2.toJSON()}}static fromJSON(t){return new Tc(ns.fromJSON(t.gradient1),ns.fromJSON(t.gradient2))}clone(){return new Tc(this.gradient1.clone(),this.gradient2.clone())}}class Vs{constructor(t){this.color=t,this.type="value"}startGen(t){}genColor(t,e){return e.copy(this.color)}toJSON(){return{type:"ConstantColor",color:Ja(this.color)}}static fromJSON(t){return new Vs(Ya(t.color))}clone(){return new Vs(this.color.clone())}}function Gd(r){switch(r.type){case"ConstantColor":return Vs.fromJSON(r);case"ColorRange":return Br.fromJSON(r);case"RandomColor":return wc.fromJSON(r);case"Gradient":return ns.fromJSON(r);case"RandomColorBetweenGradient":return Tc.fromJSON(r);default:return new Vs(new Oi(1,1,1,1))}}class ge{constructor(t){this.value=t,this.type="value"}startGen(t){}genValue(t){return this.value}toJSON(){return{type:"ConstantValue",value:this.value}}static fromJSON(t){return new ge(t.value)}clone(){return new ge(this.value)}}class gn{constructor(t,e){this.a=t,this.b=e,this.indexCount=-1,this.type="value"}startGen(t){this.indexCount=t.length,t.push(Math.random())}genValue(t){return this.indexCount===-1&&this.startGen(t),$r.lerp(this.a,this.b,t[this.indexCount])}toJSON(){return{type:"IntervalValue",a:this.a,b:this.b}}static fromJSON(t){return new gn(t.a,t.b)}clone(){return new gn(this.a,this.b)}}class Ww{constructor(){this.functions=new Array}findFunction(t){let e=0,i=0,n=this.functions.length-1;for(;i+1<n;)if(e=Math.floor((i+n)/2),t<this.getStartX(e))n=e-1;else if(t>this.getEndX(e))i=e+1;else return e;for(let s=i;s<=n;s++)if(t>=this.functions[s][1]&&t<=this.getEndX(s))return s;return-1}getStartX(t){return this.functions[t][1]}setStartX(t,e){t>0&&(this.functions[t][1]=e)}getEndX(t){return t+1<this.functions.length?this.functions[t+1][1]:1}setEndX(t,e){t+1<this.functions.length&&(this.functions[t+1][1]=e)}insertFunction(t,e){const i=this.findFunction(t);this.functions.splice(i+1,0,[e,t])}removeFunction(t){return this.functions.splice(t,1)[0][0]}getFunction(t){return this.functions[t][0]}setFunction(t,e){this.functions[t][0]=e}get numOfFunctions(){return this.functions.length}}class zr extends Ww{constructor(t=[[new Qn(0,1/3,1/3*2,1),0]]){super(),this.type="function",this.functions=t}genValue(t,e=0){const i=this.findFunction(e);return i===-1?0:this.functions[i][0].genValue((e-this.getStartX(i))/(this.getEndX(i)-this.getStartX(i)))}toSVG(t,e){if(e<1)return"";let i=["M",0,this.functions[0][0].p[0]].join(" ");for(let n=1/e;n<=1;n+=1/e)i=[i,"L",n*t,this.genValue(void 0,n)].join(" ");return i}toJSON(){return{type:"PiecewiseBezier",functions:this.functions.map(([t,e])=>({function:t.toJSON(),start:e}))}}static fromJSON(t){return new zr(t.functions.map(e=>[Qn.fromJSON(e.function),e.start]))}clone(){return new zr(this.functions.map(([t,e])=>[t.clone(),e]))}startGen(t){}}function le(r){switch(r.type){case"ConstantValue":return ge.fromJSON(r);case"IntervalValue":return gn.fromJSON(r);case"PiecewiseBezier":return zr.fromJSON(r);default:return new ge(0)}}class Za{constructor(){this.indexCount=0,this.type="rotation"}startGen(t){this.indexCount=t.length,t.push(new xe);let e,i,n,s,a,o;do e=Math.random()*2-1,i=Math.random()*2-1,n=e*e+i*i;while(n>1);do s=Math.random()*2-1,a=Math.random()*2-1,o=s*s+a*a;while(o>1);const l=Math.sqrt((1-n)/o);t[this.indexCount].set(e,i,l*s,l*a)}genValue(t,e,i,n){return this.indexCount===-1&&this.startGen(t),e.copy(t[this.indexCount]),e}toJSON(){return{type:"RandomQuat"}}static fromJSON(t){return new Za}clone(){return new Za}}class $a{constructor(t,e){this.axis=t,this.angle=e,this.type="rotation"}startGen(t){this.angle.startGen(t)}genValue(t,e,i,n){return e.setFromAxisAngle(this.axis,this.angle.genValue(t,n)*i)}toJSON(){return{type:"AxisAngle",axis:{x:this.axis.x,y:this.axis.y,z:this.axis.z},angle:this.angle.toJSON()}}static fromJSON(t){return new $a(new Nt(t.axis.x,t.axis.y,t.axis.z),le(t.angle))}clone(){return new $a(this.axis.clone(),this.angle.clone())}}class Ec{constructor(t,e,i,n){this.angleX=t,this.angleY=e,this.angleZ=i,this.type="rotation",this.eular=new qa(0,0,0,n)}startGen(t){this.angleX.startGen(t),this.angleY.startGen(t),this.angleZ.startGen(t)}genValue(t,e,i,n){return this.eular.set(this.angleX.genValue(t,n)*i,this.angleY.genValue(t,n)*i,this.angleZ.genValue(t,n)*i),e.setFromEuler(this.eular)}toJSON(){return{type:"Euler",angleX:this.angleX.toJSON(),angleY:this.angleY.toJSON(),angleZ:this.angleZ.toJSON(),eulerOrder:this.eular.order}}static fromJSON(t){return new Ec(le(t.angleX),le(t.angleY),le(t.angleZ),t.eulerOrder)}clone(){return new Ec(this.angleX,this.angleY,this.angleZ,this.eular.order)}}function n0(r){switch(r.type){case"AxisAngle":return $a.fromJSON(r);case"Euler":return Ec.fromJSON(r);case"RandomQuat":return Za.fromJSON(r);default:return new Za}}class ks{constructor(t,e,i){this.x=t,this.y=e,this.z=i,this.type="vec3function"}startGen(t){this.x.startGen(t),this.y.startGen(t),this.z.startGen(t)}genValue(t,e,i){return e.set(this.x.genValue(t,i),this.y.genValue(t,i),this.z.genValue(t,i))}toJSON(){return{type:"Vector3Function",x:this.x.toJSON(),y:this.y.toJSON(),z:this.z.toJSON()}}static fromJSON(t){return new ks(le(t.x),le(t.y),le(t.z))}clone(){return new ks(this.x,this.y,this.z)}}function Xw(r){switch(r.type){case"Vector3Function":return ks.fromJSON(r);default:return new ks(new ge(0),new ge(0),new ge(0))}}function Ac(r){switch(r.type){case"ConstantValue":case"IntervalValue":case"PiecewiseBezier":return le(r);case"AxisAngle":case"RandomQuat":case"Euler":return n0(r);case"Vector3Function":return Xw(r);default:return new ge(0)}}class Ka{constructor(t={}){this.type="cone",this.currentValue=0,this.radius=t.radius??10,this.arc=t.arc??2*Math.PI,this.thickness=t.thickness??1,this.angle=t.angle??Math.PI/6,this.mode=t.mode??li.Random,this.spread=t.spread??0,this.speed=t.speed??new ge(1),this.memory=[]}update(t,e){li.Random!=this.mode&&(this.currentValue+=this.speed.genValue(this.memory,t.emissionState.time/t.duration)*e)}initialize(t,e){const i=Kr(this.mode,this.currentValue,this.spread,e),n=$r.lerp(1-this.thickness,1,Math.random()),s=i*this.arc,a=Math.sqrt(n),o=Math.sin(s),l=Math.cos(s);t.position.x=a*l,t.position.y=a*o,t.position.z=0;const c=this.angle*a;t.velocity.set(0,0,Math.cos(c)).addScaledVector(t.position,Math.sin(c)).multiplyScalar(t.startSpeed),t.position.multiplyScalar(this.radius)}toJSON(){return{type:"cone",radius:this.radius,arc:this.arc,thickness:this.thickness,angle:this.angle,mode:this.mode,spread:this.spread,speed:this.speed.toJSON()}}static fromJSON(t){return new Ka({radius:t.radius,arc:t.arc,thickness:t.thickness,angle:t.angle,mode:t.mode,speed:t.speed?le(t.speed):void 0,spread:t.spread})}clone(){return new Ka({radius:this.radius,arc:this.arc,thickness:this.thickness,angle:this.angle,mode:this.mode,speed:this.speed.clone(),spread:this.spread})}}class Qa{constructor(t={}){this.type="circle",this.currentValue=0,this.radius=t.radius??10,this.arc=t.arc??2*Math.PI,this.thickness=t.thickness??1,this.mode=t.mode??li.Random,this.spread=t.spread??0,this.speed=t.speed??new ge(1),this.memory=[]}update(t,e){this.currentValue+=this.speed.genValue(this.memory,t.emissionState.time/t.duration)*e}initialize(t,e){const i=Kr(this.mode,this.currentValue,this.spread,e),n=$r.lerp(1-this.thickness,1,Math.random()),s=i*this.arc;t.position.x=Math.cos(s),t.position.y=Math.sin(s),t.position.z=0,t.velocity.copy(t.position).multiplyScalar(t.startSpeed),t.position.multiplyScalar(this.radius*n)}toJSON(){return{type:"circle",radius:this.radius,arc:this.arc,thickness:this.thickness,mode:this.mode,spread:this.spread,speed:this.speed.toJSON()}}static fromJSON(t){return new Qa({radius:t.radius,arc:t.arc,thickness:t.thickness,mode:t.mode,speed:t.speed?le(t.speed):void 0,spread:t.spread})}clone(){return new Qa({radius:this.radius,arc:this.arc,thickness:this.thickness,mode:this.mode,speed:this.speed.clone(),spread:this.spread})}}function Al(r,t){return Math.floor(Math.random()*(t-r))+r}const Co=new Nt(0,1,0),Ro=new Nt(0,0,0),qw=new Nt(1,1,1),Xp=new Nt(0,0,1);class ja{constructor(t={}){this.type="donut",this.currentValue=0,this.radius=t.radius??10,this.arc=t.arc??2*Math.PI,this.thickness=t.thickness??1,this.donutRadius=t.donutRadius??this.radius*.2,this.mode=t.mode??li.Random,this.spread=t.spread??0,this.speed=t.speed??new ge(1),this.memory=[],this._m1=new ji}update(t,e){li.Random!=this.mode&&(this.currentValue+=this.speed.genValue(this.memory,t.emissionState.time/t.duration)*e)}initialize(t,e){const i=Kr(this.mode,this.currentValue,this.spread,e),n=Math.random(),s=$r.lerp(1-this.thickness,1,Math.random()),a=i*this.arc,o=n*Math.PI*2,l=Math.sin(a),c=Math.cos(a);if(t.position.x=this.radius*c,t.position.y=this.radius*l,t.position.z=0,t.velocity.z=this.donutRadius*s*Math.sin(o),t.velocity.x=this.donutRadius*s*Math.cos(o)*c,t.velocity.y=this.donutRadius*s*Math.cos(o)*l,t.position.add(t.velocity),t.velocity.normalize().multiplyScalar(t.startSpeed),t.rotation instanceof xe){const h=t.rotation;h.x===0&&h.y===0&&h.z===0&&h.w===1&&(this._m1.lookAt(Ro,t.velocity,Co),t.rotation.setFromRotationMatrix(this._m1))}}toJSON(){return{type:"donut",radius:this.radius,arc:this.arc,thickness:this.thickness,donutRadius:this.donutRadius,mode:this.mode,spread:this.spread,speed:this.speed.toJSON()}}static fromJSON(t){return new ja({radius:t.radius,arc:t.arc,thickness:t.thickness,donutRadius:t.donutRadius,mode:t.mode,speed:t.speed?le(t.speed):void 0,spread:t.spread})}clone(){return new ja({radius:this.radius,arc:this.arc,thickness:this.thickness,donutRadius:this.donutRadius,mode:this.mode,speed:this.speed.clone(),spread:this.spread})}}class Vr{constructor(){this.type="point",this._m1=new ji}update(t,e){}initialize(t){const e=Math.random(),i=Math.random(),n=e*Math.PI*2,s=Math.acos(2*i-1),a=Math.cbrt(Math.random()),o=Math.sin(n),l=Math.cos(n),c=Math.sin(s),h=Math.cos(s);if(t.velocity.x=a*c*l,t.velocity.y=a*c*o,t.velocity.z=a*h,t.velocity.multiplyScalar(t.startSpeed),t.position.setScalar(0),t.rotation instanceof xe){const d=t.rotation;d.x===0&&d.y===0&&d.z===0&&d.w===1&&(this._m1.lookAt(Ro,t.velocity,Co),t.rotation.setFromRotationMatrix(this._m1))}}toJSON(){return{type:"point"}}static fromJSON(t){return new Vr}clone(){return new Vr}}class kr{constructor(t={}){this.type="sphere",this.currentValue=0,this.radius=t.radius??10,this.arc=t.arc??2*Math.PI,this.thickness=t.thickness??1,this.mode=t.mode??li.Random,this.spread=t.spread??0,this.speed=t.speed??new ge(1),this.memory=[],this._m1=new ji}update(t,e){li.Random!=this.mode&&(this.currentValue+=this.speed.genValue(this.memory,t.emissionState.time/t.duration)*e)}initialize(t,e){const i=Kr(this.mode,this.currentValue,this.spread,e),n=Math.random(),s=$r.lerp(1-this.thickness,1,Math.random()),a=i*this.arc,o=Math.acos(2*n-1),l=Math.sin(a),c=Math.cos(a),h=Math.sin(o),d=Math.cos(o);if(t.position.x=h*c,t.position.y=h*l,t.position.z=d,t.velocity.copy(t.position).multiplyScalar(t.startSpeed),t.position.multiplyScalar(this.radius*s),t.rotation instanceof xe){const u=t.rotation;u.x===0&&u.y===0&&u.z===0&&u.w===1&&(this._m1.lookAt(Ro,t.position,Co),t.rotation.setFromRotationMatrix(this._m1))}}toJSON(){return{type:"sphere",radius:this.radius,arc:this.arc,thickness:this.thickness,mode:this.mode,spread:this.spread,speed:this.speed.toJSON()}}static fromJSON(t){return new kr({radius:t.radius,arc:t.arc,thickness:t.thickness,mode:t.mode,speed:t.speed?le(t.speed):void 0,spread:t.spread})}clone(){return new kr({radius:this.radius,arc:this.arc,thickness:this.thickness,mode:this.mode,speed:this.speed.clone(),spread:this.spread})}}class to{constructor(t={}){this.type="hemisphere",this.currentValue=0,this.radius=t.radius??10,this.arc=t.arc??2*Math.PI,this.thickness=t.thickness??1,this.mode=t.mode??li.Random,this.spread=t.spread??0,this.speed=t.speed??new ge(1),this.memory=[],this._m1=new ji}update(t,e){li.Random!=this.mode&&(this.currentValue+=this.speed.genValue(this.memory,t.emissionState.time/t.duration)*e)}initialize(t,e){const i=Kr(this.mode,this.currentValue,this.spread,e),n=Math.random(),s=$r.lerp(1-this.thickness,1,Math.random()),a=i*this.arc,o=Math.acos(n),l=Math.sin(a),c=Math.cos(a),h=Math.sin(o),d=Math.cos(o);if(t.position.x=h*c,t.position.y=h*l,t.position.z=d,t.velocity.copy(t.position).multiplyScalar(t.startSpeed),t.position.multiplyScalar(this.radius*s),t.rotation instanceof xe){const u=t.rotation;u.x===0&&u.y===0&&u.z===0&&u.w===1&&(this._m1.lookAt(Ro,t.position,Co),t.rotation.setFromRotationMatrix(this._m1))}}toJSON(){return{type:"hemisphere",radius:this.radius,arc:this.arc,thickness:this.thickness,mode:this.mode,spread:this.spread,speed:this.speed.toJSON()}}static fromJSON(t){return new to({radius:t.radius,arc:t.arc,thickness:t.thickness,mode:t.mode,speed:t.speed?le(t.speed):void 0,spread:t.spread})}clone(){return new to({radius:this.radius,arc:this.arc,thickness:this.thickness,mode:this.mode,speed:this.speed.clone(),spread:this.spread})}}class eo{constructor(t={}){this.type="grid",this.width=t.width??1,this.height=t.height??1,this.column=t.column??10,this.row=t.row??10}initialize(t){const e=Math.floor(Math.random()*this.row),i=Math.floor(Math.random()*this.column);t.position.x=i*this.width/this.column-this.width/2,t.position.y=e*this.height/this.row-this.height/2,t.position.z=0,t.velocity.set(0,0,t.startSpeed)}toJSON(){return{type:"grid",width:this.width,height:this.height,column:this.column,row:this.row}}static fromJSON(t){return new eo(t)}clone(){return new eo({width:this.width,height:this.height,column:this.column,row:this.row})}update(t,e){}}class io{constructor(t={}){this.type="rectangle",this.currentValue=0,this.width=t.width??10,this.height=t.height??10,this.thickness=t.thickness??1,this.mode=t.mode??li.Random,this.spread=t.spread??0,this.speed=t.speed??new ge(1),this.memory=[],this._m1=new ji}update(t,e){this.currentValue+=this.speed.genValue(this.memory,t.emissionState.time/t.duration)*e}initialize(t,e){const i=Kr(this.mode,this.currentValue,this.spread,e),n=2*(this.width+this.height),s=i*n;let a,o;s<this.width?(a=s-this.width/2,o=-this.height/2):s<this.width+this.height?(a=this.width/2,o=s-this.width-this.height/2):s<2*this.width+this.height?(a=this.width/2-(s-this.width-this.height),o=this.height/2):(a=-this.width/2,o=this.height/2-(s-2*this.width-this.height));const l=Math.random(),c=1-this.thickness*l;if(t.position.x=a*c,t.position.y=o*c,t.position.z=0,t.velocity.x=a,t.velocity.y=o,t.velocity.z=0,t.velocity.normalize().multiplyScalar(t.startSpeed),t.rotation instanceof xe){const h=t.rotation;h.x===0&&h.y===0&&h.z===0&&h.w===1&&(this._m1.lookAt(Ro,t.velocity,Co),t.rotation.setFromRotationMatrix(this._m1))}}toJSON(){return{type:"rectangle",width:this.width,height:this.height,thickness:this.thickness,mode:this.mode,spread:this.spread,speed:this.speed.toJSON()}}static fromJSON(t){return new io({width:t.width,height:t.height,thickness:t.thickness,mode:t.mode,speed:t.speed?le(t.speed):void 0,spread:t.spread})}clone(){return new io({width:this.width,height:this.height,thickness:this.thickness,mode:this.mode,speed:this.speed.clone(),spread:this.spread})}}const Hu={circle:{type:"circle",params:[["radius",["number"]],["arc",["radian"]],["thickness",["number"]],["mode",["emitterMode"]],["spread",["number"]],["speed",["valueFunc","value"]]],constructor:Qa,loadJSON:Qa.fromJSON},cone:{type:"cone",params:[["radius",["number"]],["arc",["radian"]],["thickness",["number"]],["angle",["radian"]],["mode",["emitterMode"]],["spread",["number"]],["speed",["valueFunc","value"]]],constructor:Ka,loadJSON:Ka.fromJSON},donut:{type:"donut",params:[["radius",["number"]],["arc",["radian"]],["thickness",["number"]],["donutRadius",["number"]],["mode",["emitterMode"]],["spread",["number"]],["speed",["valueFunc","value"]]],constructor:ja,loadJSON:ja.fromJSON},point:{type:"point",params:[],constructor:Vr,loadJSON:Vr.fromJSON},sphere:{type:"sphere",params:[["radius",["number"]],["arc",["radian"]],["thickness",["number"]],["angle",["radian"]],["mode",["emitterMode"]],["spread",["number"]],["speed",["valueFunc","value"]]],constructor:kr,loadJSON:kr.fromJSON},hemisphere:{type:"hemisphere",params:[["radius",["number"]],["arc",["radian"]],["thickness",["number"]],["angle",["radian"]],["mode",["emitterMode"]],["spread",["number"]],["speed",["valueFunc","value"]]],constructor:to,loadJSON:to.fromJSON},grid:{type:"grid",params:[["width",["number"]],["height",["number"]],["rows",["number"]],["column",["number"]]],constructor:eo,loadJSON:eo.fromJSON},rectangle:{type:"rectangle",params:[["width",["number"]],["height",["number"]],["thickness",["number"]],["mode",["emitterMode"]],["spread",["number"]],["speed",["valueFunc","value"]]],constructor:io,loadJSON:io.fromJSON}};function Jw(r,t){return Hu[r.type].loadJSON(r,t)}class Gr{constructor(t){this.color=t,this.type="ColorOverLife"}initialize(t){this.color.startGen(t.memory)}update(t,e){this.color.genColor(t.memory,t.color,t.age/t.life),t.color.x*=t.startColor.x,t.color.y*=t.startColor.y,t.color.z*=t.startColor.z,t.color.w*=t.startColor.w}frameUpdate(t){}toJSON(){return{type:this.type,color:this.color.toJSON()}}static fromJSON(t){return new Gr(Gd(t.color))}clone(){return new Gr(this.color.clone())}reset(){}}class no{constructor(t){this.angularVelocity=t,this.type="RotationOverLife"}initialize(t){typeof t.rotation=="number"&&this.angularVelocity.startGen(t.memory)}update(t,e){typeof t.rotation=="number"&&(t.rotation+=e*this.angularVelocity.genValue(t.memory,t.age/t.life))}toJSON(){return{type:this.type,angularVelocity:this.angularVelocity.toJSON()}}static fromJSON(t){return new no(le(t.angularVelocity))}frameUpdate(t){}clone(){return new no(this.angularVelocity.clone())}reset(){}}class so{constructor(t){this.angularVelocity=t,this.type="Rotation3DOverLife",this.tempQuat=new xe,this.tempQuat2=new xe}initialize(t){t.rotation instanceof xe&&(t.angularVelocity=new xe,this.angularVelocity.startGen(t.memory))}update(t,e){t.rotation instanceof xe&&(this.angularVelocity.genValue(t.memory,this.tempQuat,e,t.age/t.life),t.rotation.multiply(this.tempQuat))}toJSON(){return{type:this.type,angularVelocity:this.angularVelocity.toJSON()}}static fromJSON(t){return new so(n0(t.angularVelocity))}frameUpdate(t){}clone(){return new so(this.angularVelocity.clone())}reset(){}}class ro{initialize(t,e){this.ps=e,this.x.startGen(t.memory),this.y.startGen(t.memory),this.z.startGen(t.memory)}constructor(t,e,i){this.x=t,this.y=e,this.z=i,this.type="ForceOverLife",this._temp=new Nt,this._tempScale=new Nt,this._tempQ=new xe}update(t,e){this._temp.set(this.x.genValue(t.memory,t.age/t.life),this.y.genValue(t.memory,t.age/t.life),this.z.genValue(t.memory,t.age/t.life)),this.ps.worldSpace?t.velocity.addScaledVector(this._temp,e):(this._temp.multiply(this._tempScale).applyQuaternion(this._tempQ),t.velocity.addScaledVector(this._temp,e))}toJSON(){return{type:this.type,x:this.x.toJSON(),y:this.y.toJSON(),z:this.z.toJSON()}}static fromJSON(t){return new ro(le(t.x),le(t.y),le(t.z))}frameUpdate(t){if(this.ps&&!this.ps.worldSpace){const e=this._temp,i=this._tempQ,n=this._tempScale;this.ps.emitter.matrixWorld.decompose(e,i,n),i.invert(),n.set(1/n.x,1/n.y,1/n.z)}}clone(){return new ro(this.x.clone(),this.y.clone(),this.z.clone())}reset(){}}class Hr{initialize(t){this.size.startGen(t.memory)}constructor(t){this.size=t,this.type="SizeOverLife"}update(t){this.size instanceof ks?this.size.genValue(t.memory,t.size,t.age/t.life).multiply(t.startSize):t.size.copy(t.startSize).multiplyScalar(this.size.genValue(t.memory,t.age/t.life))}toJSON(){return{type:this.type,size:this.size.toJSON()}}static fromJSON(t){return new Hr(Ac(t.size))}frameUpdate(t){}clone(){return new Hr(this.size.clone())}reset(){}}class ao{initialize(t){this.speed.startGen(t.memory)}constructor(t){this.speed=t,this.type="SpeedOverLife"}update(t){t.speedModifier=this.speed.genValue(t.memory,t.age/t.life)}toJSON(){return{type:this.type,speed:this.speed.toJSON()}}static fromJSON(t){return new ao(le(t.speed))}frameUpdate(t){}clone(){return new ao(this.speed.clone())}reset(){}}class oo{constructor(t){this.frame=t,this.type="FrameOverLife"}initialize(t){this.frame.startGen(t.memory)}update(t,e){this.frame instanceof zr&&(t.uvTile=this.frame.genValue(t.memory,t.age/t.life))}frameUpdate(t){}toJSON(){return{type:this.type,frame:this.frame.toJSON()}}static fromJSON(t){return new oo(le(t.frame))}clone(){return new oo(this.frame.clone())}reset(){}}class lo{constructor(t,e=new Nt(0,1,0)){this.orbitSpeed=t,this.axis=e,this.type="OrbitOverLife",this.temp=new Nt,this.rotation=new xe}initialize(t){this.orbitSpeed.startGen(t.memory)}update(t,e){this.temp.copy(t.position).projectOnVector(this.axis),this.rotation.setFromAxisAngle(this.axis,this.orbitSpeed.genValue(t.memory,t.age/t.life)*e),t.position.sub(this.temp),t.position.applyQuaternion(this.rotation),t.position.add(this.temp)}frameUpdate(t){}toJSON(){return{type:this.type,orbitSpeed:this.orbitSpeed.toJSON(),axis:[this.axis.x,this.axis.y,this.axis.z]}}static fromJSON(t){return new lo(le(t.orbitSpeed),t.axis?new Nt(t.axis[0],t.axis[1],t.axis[2]):void 0)}clone(){return new lo(this.orbitSpeed.clone())}reset(){}}class xu{constructor(t){this.data=t,this.next=null,this.prev=null}hasPrev(){return this.prev!==null}hasNext(){return this.next!==null}}class Yw{constructor(){this.length=0,this.head=this.tail=null}isEmpty(){return this.head===null}clear(){this.length=0,this.head=this.tail=null}front(){return this.head===null?null:this.head.data}back(){return this.tail===null?null:this.tail.data}dequeue(){if(this.head){const t=this.head.data;return this.head=this.head.next,this.head?this.head.prev=null:this.tail=null,this.length--,t}}pop(){if(this.tail){const t=this.tail.data;return this.tail=this.tail.prev,this.tail?this.tail.next=null:this.head=null,this.length--,t}}queue(t){const e=new xu(t);this.tail||(this.tail=e),this.head&&(this.head.prev=e,e.next=this.head),this.head=e,this.length++}push(t){const e=new xu(t);this.head||(this.head=e),this.tail&&(this.tail.next=e,e.prev=this.tail),this.tail=e,this.length++}insertBefore(t,e){const i=new xu(e);i.next=t,i.prev=t.prev,i.prev!==null&&(i.prev.next=i),i.next.prev=i,t==this.head&&(this.head=i),this.length++}remove(t){if(this.head===null||this.tail===null)return;let e=this.head;for(t===this.head.data&&(this.head=this.head.next),t===this.tail.data&&(this.tail=this.tail.prev);e.next!==null&&e.data!==t;)e=e.next;e.data===t&&(e.prev!==null&&(e.prev.next=e.next),e.next!==null&&(e.next.prev=e.prev),this.length--)}*values(){let t=this.head;for(;t!==null;)yield t.data,t=t.next}}class Zw{constructor(){this.startSpeed=0,this.startColor=new Oi,this.startSize=new Nt(1,1,1),this.position=new Nt,this.velocity=new Nt,this.age=0,this.life=1,this.size=new Nt(1,1,1),this.speedModifier=1,this.rotation=0,this.color=new Oi,this.uvTile=0,this.memory=[]}get died(){return this.age>=this.life}reset(){this.memory.length=0}}class $w{constructor(t,e,i){this.position=t,this.size=e,this.color=i}}class Wu{constructor(){this.startSpeed=0,this.startColor=new Oi,this.startSize=new Nt(1,1,1),this.position=new Nt,this.velocity=new Nt,this.age=0,this.life=1,this.size=new Nt(1,1,1),this.length=100,this.speedModifier=1,this.color=new Oi,this.previous=new Yw,this.uvTile=0,this.memory=[]}update(){for(this.age<=this.life?this.previous.push(new $w(this.position.clone(),this.size.x,this.color.clone())):this.previous.length>0&&this.previous.dequeue();this.previous.length>this.length;)this.previous.dequeue()}get died(){return this.age>=this.life}reset(){this.memory.length=0,this.previous.clear()}}class co{initialize(t){this.width.startGen(t.memory)}constructor(t){this.width=t,this.type="WidthOverLength"}update(t){if(t instanceof Wu){const e=t.previous.values();for(let i=0;i<t.previous.length;i++){const n=e.next();n.value.size=this.width.genValue(t.memory,(t.previous.length-i)/t.length)}}}frameUpdate(t){}toJSON(){return{type:this.type,width:this.width.toJSON()}}static fromJSON(t){return new co(le(t.width))}clone(){return new co(this.width.clone())}reset(){}}class Wr{constructor(t,e){this.direction=t,this.magnitude=e,this.type="ApplyForce",this.memory={data:[],dataCount:0},this.magnitudeValue=this.magnitude.genValue(this.memory)}initialize(t){}update(t,e){t.velocity.addScaledVector(this.direction,this.magnitudeValue*e)}frameUpdate(t){this.magnitudeValue=this.magnitude.genValue(this.memory)}toJSON(){return{type:this.type,direction:[this.direction.x,this.direction.y,this.direction.z],magnitude:this.magnitude.toJSON()}}static fromJSON(t){return new Wr(new Nt(t.direction[0],t.direction[1],t.direction[2]),le(t.magnitude??t.force))}clone(){return new Wr(this.direction.clone(),this.magnitude.clone())}reset(){}}class ho{constructor(t,e){this.center=t,this.magnitude=e,this.type="GravityForce",this.temp=new Nt}initialize(t){}update(t,e){this.temp.copy(this.center).sub(t.position).normalize(),t.velocity.addScaledVector(this.temp,this.magnitude/t.position.distanceToSquared(this.center)*e)}frameUpdate(t){}toJSON(){return{type:this.type,center:[this.center.x,this.center.y,this.center.z],magnitude:this.magnitude}}static fromJSON(t){return new ho(new Nt(t.center[0],t.center[1],t.center[2]),t.magnitude)}clone(){return new ho(this.center.clone(),this.magnitude)}reset(){}}class uo{constructor(t){this.angle=t,this.type="ChangeEmitDirection",this._temp=new Nt,this._q=new xe,this.memory={data:[],dataCount:0}}initialize(t){const e=t.velocity.length();e!=0&&(t.velocity.normalize(),t.velocity.x===0&&t.velocity.y===0?this._temp.set(0,t.velocity.z,0):this._temp.set(-t.velocity.y,t.velocity.x,0),this.angle.startGen(this.memory),this._q.setFromAxisAngle(this._temp.normalize(),this.angle.genValue(this.memory)),this._temp.copy(t.velocity),t.velocity.applyQuaternion(this._q),this._q.setFromAxisAngle(this._temp,Math.random()*Math.PI*2),t.velocity.applyQuaternion(this._q),t.velocity.setLength(e))}update(t,e){}frameUpdate(t){}toJSON(){return{type:this.type,angle:this.angle.toJSON()}}static fromJSON(t){return new uo(le(t.angle))}clone(){return new uo(this.angle)}reset(){}}var vr;(function(r){r[r.Death=0]="Death",r[r.Birth=1]="Birth",r[r.Frame=2]="Frame"})(vr||(vr={}));class fo{constructor(t,e,i,n=vr.Frame,s=1){this.particleSystem=t,this.useVelocityAsBasis=e,this.subParticleSystem=i,this.mode=n,this.emitProbability=s,this.type="EmitSubParticleSystem",this.q_=new xe,this.v_=new Nt,this.v2_=new Nt,this.subEmissions=new Array,this.subParticleSystem&&this.subParticleSystem.system&&(this.subParticleSystem.system.onlyUsedByOther=!0)}initialize(t){}update(t,e){this.mode===vr.Frame?this.emit(t,e):this.mode===vr.Birth&&t.age===0?this.emit(t,e):this.mode===vr.Death&&t.age+e>=t.life&&this.emit(t,e)}emit(t,e){if(!this.subParticleSystem||Math.random()>this.emitProbability)return;const i=new ji;this.setMatrixFromParticle(i,t),this.subEmissions.push({burstParticleCount:0,burstParticleIndex:0,isBursting:!1,burstIndex:0,burstWaveIndex:0,time:0,waitEmiting:0,matrix:i,travelDistance:0,particle:t})}frameUpdate(t){if(this.subParticleSystem)for(let e=0;e<this.subEmissions.length;e++)if(this.subEmissions[e].time>=this.subParticleSystem.system.duration)this.subEmissions[e]=this.subEmissions[this.subEmissions.length-1],this.subEmissions.length=this.subEmissions.length-1,e--;else{const i=this.subEmissions[e];i.particle&&i.particle.age<i.particle.life?this.setMatrixFromParticle(i.matrix,i.particle):i.particle=void 0,this.subParticleSystem.system.emit(t,i,i.matrix)}}toJSON(){return{type:this.type,subParticleSystem:this.subParticleSystem?this.subParticleSystem.uuid:"",useVelocityAsBasis:this.useVelocityAsBasis,mode:this.mode,emitProbability:this.emitProbability}}static fromJSON(t,e){return new fo(e,t.useVelocityAsBasis,t.subParticleSystem,t.mode,t.emitProbability)}clone(){return new fo(this.particleSystem,this.useVelocityAsBasis,this.subParticleSystem,this.mode,this.emitProbability)}reset(){}setMatrixFromParticle(t,e){let i;if(e.rotation===void 0||this.useVelocityAsBasis)if(e.velocity.x===0&&e.velocity.y===0&&(e.velocity.z===1||e.velocity.z===0))t.set(1,0,0,e.position.x,0,1,0,e.position.y,0,0,1,e.position.z,0,0,0,1);else{this.v_.copy(Xp).cross(e.velocity),this.v2_.copy(e.velocity).cross(this.v_);const n=this.v_.length(),s=this.v2_.length();t.set(this.v_.x/n,this.v2_.x/s,e.velocity.x,e.position.x,this.v_.y/n,this.v2_.y/s,e.velocity.y,e.position.y,this.v_.z/n,this.v2_.z/s,e.velocity.z,e.position.z,0,0,0,1)}else e.rotation instanceof xe?i=e.rotation:(this.q_.setFromAxisAngle(Xp,e.rotation),i=this.q_),t.compose(e.position,i,qw);this.particleSystem.worldSpace||t.multiplyMatrices(this.particleSystem.emitter.matrixWorld,t)}}const Kw=.5*(Math.sqrt(3)-1),da=(3-Math.sqrt(3))/6,Qw=1/3,on=1/6,jw=(Math.sqrt(5)-1)/4,Ke=(5-Math.sqrt(5))/20,Je=new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]),Ve=new Float32Array([0,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,1,0,1,1,1,0,1,-1,1,0,-1,1,1,0,-1,-1,-1,0,1,1,-1,0,1,-1,-1,0,-1,1,-1,0,-1,-1,1,1,0,1,1,1,0,-1,1,-1,0,1,1,-1,0,-1,-1,1,0,1,-1,1,0,-1,-1,-1,0,1,-1,-1,0,-1,1,1,1,0,1,1,-1,0,1,-1,1,0,1,-1,-1,0,-1,1,1,0,-1,1,-1,0,-1,-1,1,0,-1,-1,-1,0]);class s0{constructor(t=Math.random){const e=typeof t=="function"?t:eT(t);this.p=tT(e),this.perm=new Uint8Array(512),this.permMod12=new Uint8Array(512);for(let i=0;i<512;i++)this.perm[i]=this.p[i&255],this.permMod12[i]=this.perm[i]%12}noise2D(t,e){const i=this.permMod12,n=this.perm;let s=0,a=0,o=0;const l=(t+e)*Kw,c=Math.floor(t+l),h=Math.floor(e+l),d=(c+h)*da,u=c-d,f=h-d,p=t-u,x=e-f;let m,g;p>x?(m=1,g=0):(m=0,g=1);const v=p-m+da,w=x-g+da,_=p-1+2*da,b=x-1+2*da,M=c&255,A=h&255;let y=.5-p*p-x*x;if(y>=0){const I=i[M+n[A]]*3;y*=y,s=y*y*(Je[I]*p+Je[I+1]*x)}let E=.5-v*v-w*w;if(E>=0){const I=i[M+m+n[A+g]]*3;E*=E,a=E*E*(Je[I]*v+Je[I+1]*w)}let P=.5-_*_-b*b;if(P>=0){const I=i[M+1+n[A+1]]*3;P*=P,o=P*P*(Je[I]*_+Je[I+1]*b)}return 70*(s+a+o)}noise3D(t,e,i){const n=this.permMod12,s=this.perm;let a,o,l,c;const h=(t+e+i)*Qw,d=Math.floor(t+h),u=Math.floor(e+h),f=Math.floor(i+h),p=(d+u+f)*on,x=d-p,m=u-p,g=f-p,v=t-x,w=e-m,_=i-g;let b,M,A,y,E,P;v>=w?w>=_?(b=1,M=0,A=0,y=1,E=1,P=0):v>=_?(b=1,M=0,A=0,y=1,E=0,P=1):(b=0,M=0,A=1,y=1,E=0,P=1):w<_?(b=0,M=0,A=1,y=0,E=1,P=1):v<_?(b=0,M=1,A=0,y=0,E=1,P=1):(b=0,M=1,A=0,y=1,E=1,P=0);const I=v-b+on,U=w-M+on,V=_-A+on,N=v-y+2*on,B=w-E+2*on,Z=_-P+2*on,k=v-1+3*on,nt=w-1+3*on,J=_-1+3*on,K=d&255,Q=u&255,At=f&255;let St=.6-v*v-w*w-_*_;if(St<0)a=0;else{const q=n[K+s[Q+s[At]]]*3;St*=St,a=St*St*(Je[q]*v+Je[q+1]*w+Je[q+2]*_)}let se=.6-I*I-U*U-V*V;if(se<0)o=0;else{const q=n[K+b+s[Q+M+s[At+A]]]*3;se*=se,o=se*se*(Je[q]*I+Je[q+1]*U+Je[q+2]*V)}let Yt=.6-N*N-B*B-Z*Z;if(Yt<0)l=0;else{const q=n[K+y+s[Q+E+s[At+P]]]*3;Yt*=Yt,l=Yt*Yt*(Je[q]*N+Je[q+1]*B+Je[q+2]*Z)}let Qt=.6-k*k-nt*nt-J*J;if(Qt<0)c=0;else{const q=n[K+1+s[Q+1+s[At+1]]]*3;Qt*=Qt,c=Qt*Qt*(Je[q]*k+Je[q+1]*nt+Je[q+2]*J)}return 32*(a+o+l+c)}noise4D(t,e,i,n){const s=this.perm;let a,o,l,c,h;const d=(t+e+i+n)*jw,u=Math.floor(t+d),f=Math.floor(e+d),p=Math.floor(i+d),x=Math.floor(n+d),m=(u+f+p+x)*Ke,g=u-m,v=f-m,w=p-m,_=x-m,b=t-g,M=e-v,A=i-w,y=n-_;let E=0,P=0,I=0,U=0;b>M?E++:P++,b>A?E++:I++,b>y?E++:U++,M>A?P++:I++,M>y?P++:U++,A>y?I++:U++;const V=E>=3?1:0,N=P>=3?1:0,B=I>=3?1:0,Z=U>=3?1:0,k=E>=2?1:0,nt=P>=2?1:0,J=I>=2?1:0,K=U>=2?1:0,Q=E>=1?1:0,At=P>=1?1:0,St=I>=1?1:0,se=U>=1?1:0,Yt=b-V+Ke,Qt=M-N+Ke,q=A-B+Ke,tt=y-Z+Ke,ft=b-k+2*Ke,Ht=M-nt+2*Ke,wt=A-J+2*Ke,Wt=y-K+2*Ke,fe=b-Q+3*Ke,et=M-At+3*Ke,at=A-St+3*Ke,ot=y-se+3*Ke,lt=b-1+4*Ke,ht=M-1+4*Ke,kt=A-1+4*Ke,Ft=y-1+4*Ke,Gt=u&255,qt=f&255,L=p&255,ce=x&255;let jt=.6-b*b-M*M-A*A-y*y;if(jt<0)a=0;else{const X=s[Gt+s[qt+s[L+s[ce]]]]%32*4;jt*=jt,a=jt*jt*(Ve[X]*b+Ve[X+1]*M+Ve[X+2]*A+Ve[X+3]*y)}let R=.6-Yt*Yt-Qt*Qt-q*q-tt*tt;if(R<0)o=0;else{const X=s[Gt+V+s[qt+N+s[L+B+s[ce+Z]]]]%32*4;R*=R,o=R*R*(Ve[X]*Yt+Ve[X+1]*Qt+Ve[X+2]*q+Ve[X+3]*tt)}let S=.6-ft*ft-Ht*Ht-wt*wt-Wt*Wt;if(S<0)l=0;else{const X=s[Gt+k+s[qt+nt+s[L+J+s[ce+K]]]]%32*4;S*=S,l=S*S*(Ve[X]*ft+Ve[X+1]*Ht+Ve[X+2]*wt+Ve[X+3]*Wt)}let z=.6-fe*fe-et*et-at*at-ot*ot;if(z<0)c=0;else{const X=s[Gt+Q+s[qt+At+s[L+St+s[ce+se]]]]%32*4;z*=z,c=z*z*(Ve[X]*fe+Ve[X+1]*et+Ve[X+2]*at+Ve[X+3]*ot)}let G=.6-lt*lt-ht*ht-kt*kt-Ft*Ft;if(G<0)h=0;else{const X=s[Gt+1+s[qt+1+s[L+1+s[ce+1]]]]%32*4;G*=G,h=G*G*(Ve[X]*lt+Ve[X+1]*ht+Ve[X+2]*kt+Ve[X+3]*Ft)}return 27*(a+o+l+c+h)}}function tT(r){const t=new Uint8Array(256);for(let e=0;e<256;e++)t[e]=e;for(let e=0;e<255;e++){const i=e+~~(r()*(256-e)),n=t[e];t[e]=t[i],t[i]=n}return t}function eT(r){let t=0,e=0,i=0,n=1;const s=iT();return t=s(" "),e=s(" "),i=s(" "),t-=s(r),t<0&&(t+=1),e-=s(r),e<0&&(e+=1),i-=s(r),i<0&&(i+=1),function(){const a=2091639*t+n*23283064365386963e-26;return t=e,e=i,i=a-(n=a|0)}}function iT(){let r=4022871197;return function(t){t=t.toString();for(let e=0;e<t.length;e++){r+=t.charCodeAt(e);let i=.02519603282416938*r;r=i>>>0,i-=r,i*=r,r=i>>>0,i-=r,r+=i*4294967296}return(r>>>0)*23283064365386963e-26}}class po{constructor(t,e,i,n){this.scale=t,this.octaves=e,this.velocityMultiplier=i,this.timeScale=n,this.type="TurbulenceField",this.generator=new s0,this.timeOffset=new Nt,this.temp=new Nt,this.temp2=new Nt,this.timeOffset.x=Math.random()/this.scale.x*this.timeScale.x,this.timeOffset.y=Math.random()/this.scale.y*this.timeScale.y,this.timeOffset.z=Math.random()/this.scale.z*this.timeScale.z}initialize(t){}update(t,e){const i=t.position.x/this.scale.x,n=t.position.y/this.scale.y,s=t.position.z/this.scale.z;this.temp.set(0,0,0);let a=1;for(let o=0;o<this.octaves;o++)this.temp2.set(this.generator.noise4D(i*a,n*a,s*a,this.timeOffset.x*a)/a,this.generator.noise4D(i*a,n*a,s*a,this.timeOffset.y*a)/a,this.generator.noise4D(i*a,n*a,s*a,this.timeOffset.z*a)/a),this.temp.add(this.temp2),a*=2;this.temp.multiply(this.velocityMultiplier),t.velocity.addScaledVector(this.temp,e)}toJSON(){return{type:this.type,scale:[this.scale.x,this.scale.y,this.scale.z],octaves:this.octaves,velocityMultiplier:[this.velocityMultiplier.x,this.velocityMultiplier.y,this.velocityMultiplier.z],timeScale:[this.timeScale.x,this.timeScale.y,this.timeScale.z]}}frameUpdate(t){this.timeOffset.x+=t*this.timeScale.x,this.timeOffset.y+=t*this.timeScale.y,this.timeOffset.z+=t*this.timeScale.z}static fromJSON(t){return new po(new Nt(t.scale[0],t.scale[1],t.scale[2]),t.octaves,new Nt(t.velocityMultiplier[0],t.velocityMultiplier[1],t.velocityMultiplier[2]),new Nt(t.timeScale[0],t.timeScale[1],t.timeScale[2]))}clone(){return new po(this.scale.clone(),this.octaves,this.velocityMultiplier.clone(),this.timeScale.clone())}reset(){}}const ln=[],_u=new Nt,yu=new xe;class mo{constructor(t,e,i=new ge(1),n=new ge(0)){if(this.frequency=t,this.power=e,this.positionAmount=i,this.rotationAmount=n,this.type="Noise",this.duration=0,ln.length===0)for(let s=0;s<100;s++)ln.push(new s0)}initialize(t){t.lastPosNoise=new Nt,typeof t.rotation=="number"?t.lastRotNoise=0:t.lastRotNoise=new xe,t.generatorIndex=[Al(0,100),Al(0,100),Al(0,100),Al(0,100)],this.positionAmount.startGen(t.memory),this.rotationAmount.startGen(t.memory),this.frequency.startGen(t.memory),this.power.startGen(t.memory)}update(t,e){let i=this.frequency.genValue(t.memory,t.age/t.life),n=this.power.genValue(t.memory,t.age/t.life),s=this.positionAmount.genValue(t.memory,t.age/t.life),a=this.rotationAmount.genValue(t.memory,t.age/t.life);s>0&&t.lastPosNoise!==void 0&&(t.position.sub(t.lastPosNoise),_u.set(ln[t.generatorIndex[0]].noise2D(0,t.age*i)*n*s,ln[t.generatorIndex[1]].noise2D(0,t.age*i)*n*s,ln[t.generatorIndex[2]].noise2D(0,t.age*i)*n*s),t.position.add(_u),t.lastPosNoise.copy(_u)),a>0&&t.lastRotNoise!==void 0&&(typeof t.rotation=="number"?(t.rotation-=t.lastRotNoise,t.rotation+=ln[t.generatorIndex[3]].noise2D(0,t.age*i)*Math.PI*n*a):(t.lastRotNoise.invert(),t.rotation.multiply(t.lastRotNoise),yu.set(ln[t.generatorIndex[0]].noise2D(0,t.age*i)*n*a,ln[t.generatorIndex[1]].noise2D(0,t.age*i)*n*a,ln[t.generatorIndex[2]].noise2D(0,t.age*i)*n*a,ln[t.generatorIndex[3]].noise2D(0,t.age*i)*n*a).normalize(),t.rotation.multiply(yu),t.lastRotNoise.copy(yu)))}toJSON(){return{type:this.type,frequency:this.frequency.toJSON(),power:this.power.toJSON(),positionAmount:this.positionAmount.toJSON(),rotationAmount:this.rotationAmount.toJSON()}}frameUpdate(t){this.duration+=t}static fromJSON(t){return new mo(le(t.frequency),le(t.power),le(t.positionAmount),le(t.rotationAmount))}clone(){return new mo(this.frequency.clone(),this.power.clone(),this.positionAmount.clone(),this.rotationAmount.clone())}reset(){}}class go{constructor(t,e){this.color=t,this.speedRange=e,this.type="ColorBySpeed"}initialize(t){this.color.startGen(t.memory)}update(t,e){const i=(t.startSpeed-this.speedRange.a)/(this.speedRange.b-this.speedRange.a);this.color.genColor(t.memory,t.color,i),t.color.x*=t.startColor.x,t.color.y*=t.startColor.y,t.color.z*=t.startColor.z,t.color.w*=t.startColor.w}frameUpdate(t){}toJSON(){return{type:this.type,color:this.color.toJSON(),speedRange:this.speedRange.toJSON()}}static fromJSON(t){return new go(Gd(t.color),gn.fromJSON(t.speedRange))}clone(){return new go(this.color.clone(),this.speedRange.clone())}reset(){}}class xo{initialize(t){this.size.startGen(t.memory)}constructor(t,e){this.size=t,this.speedRange=e,this.type="SizeBySpeed"}update(t){const e=(t.startSpeed-this.speedRange.a)/(this.speedRange.b-this.speedRange.a);this.size instanceof ks?this.size.genValue(t.memory,t.size,e).multiply(t.startSize):t.size.copy(t.startSize).multiplyScalar(this.size.genValue(t.memory,e))}toJSON(){return{type:this.type,size:this.size.toJSON(),speedRange:this.speedRange.toJSON()}}static fromJSON(t){return new xo(Ac(t.size),gn.fromJSON(t.speedRange))}frameUpdate(t){}clone(){return new xo(this.size.clone(),this.speedRange.clone())}reset(){}}class _o{constructor(t,e){this.angularVelocity=t,this.speedRange=e,this.type="RotationBySpeed",this.tempQuat=new xe}initialize(t){typeof t.rotation=="number"&&this.angularVelocity.startGen(t.memory)}update(t,e){if(typeof t.rotation=="number"){const i=(t.startSpeed-this.speedRange.a)/(this.speedRange.b-this.speedRange.a);t.rotation+=e*this.angularVelocity.genValue(t.memory,i)}}toJSON(){return{type:this.type,angularVelocity:this.angularVelocity.toJSON(),speedRange:this.speedRange.toJSON()}}static fromJSON(t){return new _o(le(t.angularVelocity),gn.fromJSON(t.speedRange))}frameUpdate(t){}clone(){return new _o(this.angularVelocity.clone(),this.speedRange.clone())}reset(){}}class yo{initialize(t){this.speed.startGen(t.memory)}constructor(t,e){this.speed=t,this.dampen=e,this.type="LimitSpeedOverLife"}update(t,e){let i=t.velocity.length(),n=this.speed.genValue(t.memory,t.age/t.life);if(i>n){const s=(i-n)/i;t.velocity.multiplyScalar(1-s*this.dampen*e*20)}}toJSON(){return{type:this.type,speed:this.speed.toJSON(),dampen:this.dampen}}static fromJSON(t){return new yo(le(t.speed),t.dampen)}frameUpdate(t){}clone(){return new yo(this.speed.clone(),this.dampen)}reset(){}}const Cc={ApplyForce:{type:"ApplyForce",constructor:Wr,params:[["direction",["vec3"]],["magnitude",["value"]]],loadJSON:Wr.fromJSON},Noise:{type:"Noise",constructor:mo,params:[["frequency",["value"]],["power",["value"]],["positionAmount",["value"]],["rotationAmount",["value"]]],loadJSON:mo.fromJSON},TurbulenceField:{type:"TurbulenceField",constructor:po,params:[["scale",["vec3"]],["octaves",["number"]],["velocityMultiplier",["vec3"]],["timeScale",["vec3"]]],loadJSON:po.fromJSON},GravityForce:{type:"GravityForce",constructor:ho,params:[["center",["vec3"]],["magnitude",["number"]]],loadJSON:ho.fromJSON},ColorOverLife:{type:"ColorOverLife",constructor:Gr,params:[["color",["colorFunc"]]],loadJSON:Gr.fromJSON},RotationOverLife:{type:"RotationOverLife",constructor:no,params:[["angularVelocity",["value","valueFunc"]]],loadJSON:no.fromJSON},Rotation3DOverLife:{type:"Rotation3DOverLife",constructor:so,params:[["angularVelocity",["rotationFunc"]]],loadJSON:so.fromJSON},SizeOverLife:{type:"SizeOverLife",constructor:Hr,params:[["size",["value","valueFunc","vec3Func"]]],loadJSON:Hr.fromJSON},ColorBySpeed:{type:"ColorBySpeed",constructor:go,params:[["color",["colorFunc"]],["speedRange",["range"]]],loadJSON:go.fromJSON},RotationBySpeed:{type:"RotationBySpeed",constructor:_o,params:[["angularVelocity",["value","valueFunc"]],["speedRange",["range"]]],loadJSON:_o.fromJSON},SizeBySpeed:{type:"SizeBySpeed",constructor:xo,params:[["size",["value","valueFunc","vec3Func"]],["speedRange",["range"]]],loadJSON:xo.fromJSON},SpeedOverLife:{type:"SpeedOverLife",constructor:ao,params:[["speed",["value","valueFunc"]]],loadJSON:ao.fromJSON},FrameOverLife:{type:"FrameOverLife",constructor:oo,params:[["frame",["value","valueFunc"]]],loadJSON:oo.fromJSON},ForceOverLife:{type:"ForceOverLife",constructor:ro,params:[["x",["value","valueFunc"]],["y",["value","valueFunc"]],["z",["value","valueFunc"]]],loadJSON:ro.fromJSON},OrbitOverLife:{type:"OrbitOverLife",constructor:lo,params:[["orbitSpeed",["value","valueFunc"]],["axis",["vec3"]]],loadJSON:lo.fromJSON},WidthOverLength:{type:"WidthOverLength",constructor:co,params:[["width",["value","valueFunc"]]],loadJSON:co.fromJSON},ChangeEmitDirection:{type:"ChangeEmitDirection",constructor:uo,params:[["angle",["value"]]],loadJSON:uo.fromJSON},EmitSubParticleSystem:{type:"EmitSubParticleSystem",constructor:fo,params:[["particleSystem",["self"]],["useVelocityAsBasis",["boolean"]],["subParticleSystem",["particleSystem"]],["mode",["number"]],["emitProbability",["number"]]],loadJSON:fo.fromJSON},LimitSpeedOverLife:{type:"LimitSpeedOverLife",constructor:yo,params:[["speed",["value","valueFunc"]],["dampen",["number"]]],loadJSON:yo.fromJSON}};function nT(r,t){return Cc[r.type]?Cc[r.type].loadJSON(r,t):null}const sT=[];function rT(r){if(!sT.find(e=>e.id===r.id)){for(const e of r.emitterShapes)Hu[e.type]||(Hu[e.type]=e);for(const e of r.behaviors)Cc[e.type]||(Cc[e.type]=e)}}class vo{get geometry(){return this._geometry}set geometry(t){if(this._geometry=t,t===void 0||typeof t=="string")return;const e=new gi;this._triangleIndexToArea.length=0;let i=0;if(!t.getIndex())return;const n=t.getIndex().array,s=n.length/3;this._triangleIndexToArea.push(0);for(let a=0;a<s;a++)e.setFromAttributeAndIndices(t.getAttribute("position"),n[a*3],n[a*3+1],n[a*3+2]),i+=e.getArea(),this._triangleIndexToArea.push(i);t.userData.triangleIndexToArea=this._triangleIndexToArea}constructor(t){this.type="mesh_surface",this._triangleIndexToArea=[],this._tempA=new C,this._tempB=new C,this._tempC=new C,t&&(this.geometry=t)}initialize(t){const e=this._geometry;if(!e||e.getIndex()===null){t.position.set(0,0,0),t.velocity.set(0,0,1).multiplyScalar(t.startSpeed);return}const i=this._triangleIndexToArea.length-1;let n=0,s=i;const a=Math.random()*this._triangleIndexToArea[i];for(;n+1<s;){const f=Math.floor((n+s)/2);a<this._triangleIndexToArea[f]?s=f:n=f}let o=Math.random(),l=Math.random();o+l>1&&(o=1-o,l=1-l);const c=e.getIndex().array[n*3],h=e.getIndex().array[n*3+1],d=e.getIndex().array[n*3+2],u=e.getAttribute("position");this._tempA.fromBufferAttribute(u,c),this._tempB.fromBufferAttribute(u,h),this._tempC.fromBufferAttribute(u,d),this._tempB.sub(this._tempA),this._tempC.sub(this._tempA),this._tempA.addScaledVector(this._tempB,o).addScaledVector(this._tempC,l),t.position.copy(this._tempA),this._tempA.copy(this._tempB).cross(this._tempC).normalize(),t.velocity.copy(this._tempA).normalize().multiplyScalar(t.startSpeed)}toJSON(){return{type:"mesh_surface",mesh:this._geometry?this._geometry.uuid:""}}static fromJSON(t,e){return new vo(e.geometries[t.geometry])}clone(){return new vo(this._geometry)}update(t,e){}}const aT={id:"three.quarks",emitterShapes:[{type:"mesh_surface",params:[["geometry",["geometry"]]],constructor:vo,loadJSON:vo.fromJSON}],behaviors:[]};var oT=`
#ifdef SOFT_PARTICLES

    /* #ifdef LOGDEPTH
    float distSample = linearize_depth_log(sampleDepth, near, far);
    #else
    float distSample = ortho ? linearize_depth_ortho(sampleDepth, near, far) : linearize_depth(sampleDepth, near, far);
    #endif */

    vec2 p2 = projPosition.xy / projPosition.w;
    
    p2 = 0.5 * p2 + 0.5;

    float readDepth = texture2D(depthTexture, p2.xy).r;
    float viewDepth = linearize_depth(readDepth);

    float softParticlesFade = saturate(SOFT_INV_FADE_DISTANCE * ((viewDepth - SOFT_NEAR_FADE) - linearDepth));
    
    gl_FragColor *= softParticlesFade;

    //gl_FragColor = vec4(softParticlesFade , 0, 0, 1);
#endif
`,lT=`
#ifdef SOFT_PARTICLES

    uniform sampler2D depthTexture;
    uniform vec4 projParams;
    uniform vec2 softParams;

    varying vec4 projPosition;
    varying float linearDepth;

    #define SOFT_NEAR_FADE softParams.x
    #define SOFT_INV_FADE_DISTANCE softParams.y

    #define zNear projParams.x
    #define zFar projParams.y

    float linearize_depth(float d)
    {
        return (zFar * zNear) / (zFar - d * (zFar - zNear));
    }

#endif
`,cT=`
#ifdef SOFT_PARTICLES
    varying vec4 projPosition;
    varying float linearDepth;
#endif
`,hT=`
#ifdef SOFT_PARTICLES
    projPosition = gl_Position;
    linearDepth = -mvPosition.z;
#endif
`,uT=`
#ifdef USE_MAP
    vec4 texelColor = texture2D( map, vUv);
    #ifdef TILE_BLEND
        texelColor = mix( texelColor, texture2D( map, vUvNext ), vUvBlend );
    #endif
    diffuseColor *= texelColor;
#endif
`,dT=`
#if defined( USE_UV ) || defined( USE_ANISOTROPY )

	varying vec2 vUv;
#ifdef TILE_BLEND
    varying vec2 vUvNext;
    varying float vUvBlend;
#endif

#endif
#ifdef USE_MAP

	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#ifdef TILE_BLEND
    varying vec2 vMapUvNext;
#endif

#endif
#ifdef USE_ALPHAMAP

	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;

#endif
#ifdef USE_LIGHTMAP

	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;

#endif
#ifdef USE_AOMAP

	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;

#endif
#ifdef USE_BUMPMAP

	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;

#endif
#ifdef USE_NORMALMAP

	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;

#endif
#ifdef USE_DISPLACEMENTMAP

	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;

#endif
#ifdef USE_EMISSIVEMAP

	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;

#endif
#ifdef USE_METALNESSMAP

	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;

#endif
#ifdef USE_ROUGHNESSMAP

	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;

#endif
#ifdef USE_ANISOTROPYMAP

	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;

#endif
#ifdef USE_CLEARCOATMAP

	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;

#endif
#ifdef USE_CLEARCOAT_NORMALMAP

	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;

#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP

	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;

#endif
#ifdef USE_SHEEN_COLORMAP

	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;

#endif
#ifdef USE_SHEEN_ROUGHNESSMAP

	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;

#endif
#ifdef USE_IRIDESCENCEMAP

	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;

#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP

	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;

#endif
#ifdef USE_SPECULARMAP

	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;

#endif
#ifdef USE_SPECULAR_COLORMAP

	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;

#endif
#ifdef USE_SPECULAR_INTENSITYMAP

	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;

#endif
#ifdef USE_TRANSMISSIONMAP

	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;

#endif
#ifdef USE_THICKNESSMAP

	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;

#endif
`,fT=`
#ifdef UV_TILE
    attribute float uvTile;
    uniform vec2 tileCount;
    
    mat3 makeTileTransform(float uvTile) {
        float col = mod(uvTile, tileCount.x);
        float row = (tileCount.y - floor(uvTile / tileCount.x) - 1.0);
        
        return mat3(
          1.0 / tileCount.x, 0.0, 0.0,
          0.0, 1.0 / tileCount.y, 0.0, 
          col / tileCount.x, row / tileCount.y, 1.0);
    }
#else
    mat3 makeTileTransform(float uvTile) {
        return mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
    }
#endif

#if defined( USE_UV ) || defined( USE_ANISOTROPY )

	varying vec2 vUv;
#ifdef TILE_BLEND
    varying vec2 vUvNext;
    varying float vUvBlend;
#endif

#endif
#ifdef USE_MAP

	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#ifdef TILE_BLEND
    varying vec2 vMapUvNext;
#endif

#endif
#ifdef USE_ALPHAMAP

	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;

#endif
#ifdef USE_LIGHTMAP

	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;

#endif
#ifdef USE_AOMAP

	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;

#endif
#ifdef USE_BUMPMAP

	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;

#endif
#ifdef USE_NORMALMAP

	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;

#endif
#ifdef USE_DISPLACEMENTMAP

	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;

#endif
#ifdef USE_EMISSIVEMAP

	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;

#endif
#ifdef USE_METALNESSMAP

	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;

#endif
#ifdef USE_ROUGHNESSMAP

	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;

#endif
#ifdef USE_ANISOTROPYMAP

	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;

#endif
#ifdef USE_CLEARCOATMAP

	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;

#endif
#ifdef USE_CLEARCOAT_NORMALMAP

	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;

#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP

	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;

#endif
#ifdef USE_SHEEN_COLORMAP

	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;

#endif
#ifdef USE_SHEEN_ROUGHNESSMAP

	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;

#endif
#ifdef USE_IRIDESCENCEMAP

	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;

#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP

	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;

#endif
#ifdef USE_SPECULARMAP

	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;

#endif
#ifdef USE_SPECULAR_COLORMAP

	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;

#endif
#ifdef USE_SPECULAR_INTENSITYMAP

	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;

#endif
#ifdef USE_TRANSMISSIONMAP

	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;

#endif
#ifdef USE_THICKNESSMAP

	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;

#endif
`,pT=`
#ifdef UV_TILE
    mat3 tileTransform = makeTileTransform(floor(uvTile));
    #ifdef TILE_BLEND
        mat3 nextTileTransform = makeTileTransform(ceil(uvTile));
        vUvBlend = fract(uvTile);
    #endif
#else
    mat3 tileTransform = makeTileTransform(0.0);
#endif

#if defined( USE_UV ) || defined( USE_ANISOTROPY )

vUv = (tileTransform *vec3( uv, 1 )).xy;
#if defined( TILE_BLEND ) && defined( UV_TILE )
    vUvNext = (nextTileTransform *vec3( uv, 1 )).xy;
#endif

#endif
#ifdef USE_MAP

vMapUv = ( tileTransform * (mapTransform * vec3( MAP_UV, 1 ) )).xy;
#if defined( TILE_BLEND ) && defined( UV_TILE )
    vMapUvNext = (nextTileTransform * (mapTransform * vec3( MAP_UV, 1 ))).xy;
#endif

#endif
#ifdef USE_ALPHAMAP

vAlphaMapUv = ( tileTransform * (alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) )).xy;
    
#endif
#ifdef USE_LIGHTMAP

vLightMapUv = ( tileTransform * (lightMapTransform * vec3( LIGHTMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_AOMAP

vAoMapUv = ( tileTransform * (aoMapTransform * vec3( AOMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_BUMPMAP

vBumpMapUv = ( tileTransform * (bumpMapTransform * vec3( BUMPMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_NORMALMAP

vNormalMapUv = ( tileTransform * (normalMapTransform * vec3( NORMALMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_DISPLACEMENTMAP

vDisplacementMapUv = ( tileTransform * (displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_EMISSIVEMAP

vEmissiveMapUv = ( tileTransform * (emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_METALNESSMAP

vMetalnessMapUv = ( tileTransform * (metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_ROUGHNESSMAP

vRoughnessMapUv = ( tileTransform * (roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_ANISOTROPYMAP

vAnisotropyMapUv = ( tileTransform * (anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_CLEARCOATMAP

vClearcoatMapUv = ( tileTransform * (clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_CLEARCOAT_NORMALMAP

vClearcoatNormalMapUv = ( tileTransform * (clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP

vClearcoatRoughnessMapUv = ( tileTransform * (clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_IRIDESCENCEMAP

vIridescenceMapUv = ( tileTransform * (iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP

vIridescenceThicknessMapUv = ( tileTransform * (iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_SHEEN_COLORMAP

vSheenColorMapUv = ( tileTransform * (sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_SHEEN_ROUGHNESSMAP

vSheenRoughnessMapUv = ( tileTransform * (sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_SPECULARMAP

vSpecularMapUv = ( tileTransform * (specularMapTransform * vec3( SPECULARMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_SPECULAR_COLORMAP

vSpecularColorMapUv = ( tileTransform * (specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_SPECULAR_INTENSITYMAP

vSpecularIntensityMapUv = ( tileTransform * (specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_TRANSMISSIONMAP

vTransmissionMapUv = ( tileTransform * transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) )).xy;

#endif
#ifdef USE_THICKNESSMAP

vThicknessMapUv = ( tileTransform * thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) )).xy;

#endif

`;const Zn=ie;function mT(){Zn.tile_pars_vertex=fT,Zn.tile_vertex=pT,Zn.tile_pars_fragment=dT,Zn.tile_fragment=uT,Zn.soft_pars_vertex=cT,Zn.soft_vertex=hT,Zn.soft_pars_fragment=lT,Zn.soft_fragment=oT}class gT extends he{constructor(t){super(),this.type="ParticleEmitter",this.system=t}clone(){const t=this.system.clone();return t.emitter.copy(this,!0),t.emitter}dispose(){}extractFromCache(t){const e=[];for(const i in t){const n=t[i];delete n.metadata,e.push(n)}return e}toJSON(t,e={}){const i=this.children;this.children=this.children.filter(s=>s.type!=="ParticleSystemPreview");const n=super.toJSON(t);return this.children=i,this.system!==null&&(n.object.ps=this.system.toJSON(t,e)),n}}var Pt;(function(r){r[r.BillBoard=0]="BillBoard",r[r.StretchedBillBoard=1]="StretchedBillBoard",r[r.Mesh=2]="Mesh",r[r.Trail=3]="Trail",r[r.HorizontalBillBoard=4]="HorizontalBillBoard",r[r.VerticalBillBoard=5]="VerticalBillBoard"})(Pt||(Pt={}));class r0 extends Kt{constructor(t){super(),this.type="VFXBatch",this.maxParticles=1e3,this.systems=new Set;const e=new is;e.mask=t.layers.mask;const i=t.material.clone();i.defines={},Object.assign(i.defines,t.material.defines),this.settings={instancingGeometry:t.instancingGeometry,renderMode:t.renderMode,renderOrder:t.renderOrder,material:i,uTileCount:t.uTileCount,vTileCount:t.vTileCount,blendTiles:t.blendTiles,softParticles:t.softParticles,softNearFade:t.softNearFade,softFarFade:t.softFarFade,layers:e},this.frustumCulled=!1,this.renderOrder=this.settings.renderOrder}addSystem(t){this.systems.add(t)}removeSystem(t){this.systems.delete(t)}applyDepthTexture(t){const e=this.material.uniforms.depthTexture;e&&e.value!==t&&(e.value=t,this.material.needsUpdate=!0)}getVisibleSystems(){return Array.from(this.systems).filter(t=>t.emitter.visible)}}const xT=new Nt(0,0,1),vu=new xe,_T=new Nt,yT=new Nt;new Nt;const qp=60,Cl=new mn(1,1,1,1);class Rc{set time(t){this.emissionState.time=t}get time(){return this.emissionState.time}get layers(){return this.rendererSettings.layers}get texture(){return this.rendererSettings.material.map}set texture(t){this.rendererSettings.material.map=t,this.neededToUpdateRender=!0}get material(){return this.rendererSettings.material}set material(t){this.rendererSettings.material=t,this.neededToUpdateRender=!0}get uTileCount(){return this.rendererSettings.uTileCount}set uTileCount(t){this.rendererSettings.uTileCount=t,this.neededToUpdateRender=!0}get vTileCount(){return this.rendererSettings.vTileCount}set vTileCount(t){this.rendererSettings.vTileCount=t,this.neededToUpdateRender=!0}get blendTiles(){return this.rendererSettings.blendTiles}set blendTiles(t){this.rendererSettings.blendTiles=t,this.neededToUpdateRender=!0}get softParticles(){return this.rendererSettings.softParticles}set softParticles(t){this.rendererSettings.softParticles=t,this.neededToUpdateRender=!0}get softNearFade(){return this.rendererSettings.softNearFade}set softNearFade(t){this.rendererSettings.softNearFade=t,this.neededToUpdateRender=!0}get softFarFade(){return this.rendererSettings.softFarFade}set softFarFade(t){this.rendererSettings.softFarFade=t,this.neededToUpdateRender=!0}get instancingGeometry(){return this.rendererSettings.instancingGeometry}set instancingGeometry(t){this.restart(),this.particles.length=0,this.rendererSettings.instancingGeometry=t,this.neededToUpdateRender=!0}get renderMode(){return this.rendererSettings.renderMode}set renderMode(t){if(this.rendererSettings.renderMode!==t){let e=!1;switch(this.rendererSettings.renderMode===Pt.Trail&&(e=!0),this.rendererSettings.renderMode===Pt.Mesh&&(this.startRotation=new ge(0)),t){case Pt.Trail:this.rendererEmitterSettings={startLength:new ge(30),followLocalOrigin:!1},e=!0;break;case Pt.Mesh:this.rendererEmitterSettings={geometry:Cl},this.startRotation=new $a(new Nt(0,1,0),new ge(0));break;case Pt.StretchedBillBoard:this.rendererEmitterSettings={speedFactor:0,lengthFactor:2},this.rendererSettings.instancingGeometry=Cl;break;case Pt.BillBoard:case Pt.VerticalBillBoard:case Pt.HorizontalBillBoard:this.rendererEmitterSettings={},this.rendererSettings.instancingGeometry=Cl;break}this.rendererSettings.renderMode=t,e&&(this.restart(),this.particles.length=0),this.neededToUpdateRender=!0}}get renderOrder(){return this.rendererSettings.renderOrder}set renderOrder(t){this.rendererSettings.renderOrder=t,this.neededToUpdateRender=!0}get blending(){return this.rendererSettings.material.blending}set blending(t){this.rendererSettings.material.blending=t,this.neededToUpdateRender=!0}constructor(t){if(this.temp=new Nt,this.travelDistance=0,this.normalMatrix=new fn,this.memory=[],this.listeners={},this.firstTimeUpdate=!0,this.autoDestroy=t.autoDestroy===void 0?!1:t.autoDestroy,this.duration=t.duration??1,this.looping=t.looping===void 0?!0:t.looping,this.prewarm=t.prewarm===void 0?!1:t.prewarm,this.startLife=t.startLife??new ge(5),this.startSpeed=t.startSpeed??new ge(0),this.startRotation=t.startRotation??new ge(0),this.startSize=t.startSize??new ge(1),this.startColor=t.startColor??new Vs(new Oi(1,1,1,1)),this.emissionOverTime=t.emissionOverTime??new ge(10),this.emissionOverDistance=t.emissionOverDistance??new ge(0),this.emissionBursts=t.emissionBursts??[],this.onlyUsedByOther=t.onlyUsedByOther??!1,this.emitterShape=t.shape??new kr,this.behaviors=t.behaviors??new Array,this.worldSpace=t.worldSpace??!1,this.rendererEmitterSettings=t.rendererEmitterSettings??{},t.renderMode===Pt.StretchedBillBoard){const e=this.rendererEmitterSettings;t.speedFactor!==void 0&&(e.speedFactor=t.speedFactor),e.speedFactor=e.speedFactor??0,e.lengthFactor=e.lengthFactor??0}this.rendererSettings={instancingGeometry:t.instancingGeometry??Cl,renderMode:t.renderMode??Pt.BillBoard,renderOrder:t.renderOrder??0,material:t.material,uTileCount:t.uTileCount??1,vTileCount:t.vTileCount??1,blendTiles:t.blendTiles??!1,softParticles:t.softParticles??!1,softNearFade:t.softNearFade??0,softFarFade:t.softFarFade??0,layers:t.layers??new is},this.neededToUpdateRender=!0,this.particles=new Array,this.startTileIndex=t.startTileIndex||new ge(0),this.emitter=new gT(this),this.paused=!1,this.particleNum=0,this.emissionState={isBursting:!1,burstParticleIndex:0,burstParticleCount:0,burstIndex:0,burstWaveIndex:0,time:0,waitEmiting:0,travelDistance:0},this.emissionBursts.forEach(e=>e.count.startGen(this.memory)),this.emissionOverDistance.startGen(this.memory),this.emitEnded=!1,this.markForDestroy=!1,this.prewarmed=!1}pause(){this.paused=!0}play(){this.paused=!1}stop(){this.restart(),this.pause()}spawn(t,e,i){vu.setFromRotationMatrix(i);const n=_T,s=vu,a=yT;i.decompose(n,s,a);for(let o=0;o<t;o++){for(e.burstParticleIndex=o,this.particleNum++;this.particles.length<this.particleNum;)this.rendererSettings.renderMode===Pt.Trail?this.particles.push(new Wu):this.particles.push(new Zw);const l=this.particles[this.particleNum-1];if(l.reset(),l.speedModifier=1,this.startColor.startGen(l.memory),this.startColor.genColor(l.memory,l.startColor,this.emissionState.time),l.color.copy(l.startColor),this.startSpeed.startGen(l.memory),l.startSpeed=this.startSpeed.genValue(l.memory,e.time/this.duration),this.startLife.startGen(l.memory),l.life=this.startLife.genValue(l.memory,e.time/this.duration),l.age=0,this.startSize.startGen(l.memory),this.startSize.type==="vec3function")this.startSize.genValue(l.memory,l.startSize,e.time/this.duration);else{const c=this.startSize.genValue(l.memory,e.time/this.duration);l.startSize.set(c,c,c)}if(this.startTileIndex.startGen(l.memory),l.uvTile=this.startTileIndex.genValue(l.memory),l.size.copy(l.startSize),this.rendererSettings.renderMode===Pt.Mesh||this.rendererSettings.renderMode===Pt.BillBoard||this.rendererSettings.renderMode===Pt.VerticalBillBoard||this.rendererSettings.renderMode===Pt.HorizontalBillBoard||this.rendererSettings.renderMode===Pt.StretchedBillBoard){const c=l;this.startRotation.startGen(l.memory),this.rendererSettings.renderMode===Pt.Mesh?(c.rotation instanceof xe||(c.rotation=new xe),this.startRotation.type==="rotation"?this.startRotation.genValue(l.memory,c.rotation,1,e.time/this.duration):c.rotation.setFromAxisAngle(xT,this.startRotation.genValue(c.memory,e.time/this.duration))):this.startRotation.type==="rotation"?c.rotation=0:c.rotation=this.startRotation.genValue(c.memory,e.time/this.duration)}else if(this.rendererSettings.renderMode===Pt.Trail){const c=l;this.rendererEmitterSettings.startLength.startGen(c.memory),c.length=this.rendererEmitterSettings.startLength.genValue(c.memory,e.time/this.duration)}if(this.emitterShape.initialize(l,e),this.rendererSettings.renderMode===Pt.Trail&&this.rendererEmitterSettings.followLocalOrigin){const c=l;c.localPosition=new Nt().copy(c.position)}this.worldSpace?(l.position.applyMatrix4(i),l.startSize.multiply(a).abs(),l.size.copy(l.startSize),l.velocity.multiply(a).applyMatrix3(this.normalMatrix),l.rotation&&l.rotation instanceof xe&&l.rotation.multiplyQuaternions(vu,l.rotation)):this.onlyUsedByOther&&(l.parentMatrix=i);for(let c=0;c<this.behaviors.length;c++)this.behaviors[c].initialize(l,this)}}endEmit(){this.emitEnded=!0,this.autoDestroy&&(this.markForDestroy=!0),this.fire({type:"emitEnd",particleSystem:this})}dispose(){this._renderer&&this._renderer.deleteSystem(this),this.emitter.dispose(),this.emitter.parent&&this.emitter.parent.remove(this.emitter),this.fire({type:"destroy",particleSystem:this})}restart(){this.memory.length=0,this.paused=!1,this.particleNum=0,this.emissionState.isBursting=!1,this.emissionState.burstIndex=0,this.emissionState.burstWaveIndex=0,this.emissionState.time=0,this.emissionState.waitEmiting=0,this.behaviors.forEach(t=>{t.reset()}),this.emitEnded=!1,this.markForDestroy=!1,this.prewarmed=!1,this.emissionBursts.forEach(t=>t.count.startGen(this.memory)),this.emissionOverDistance.startGen(this.memory)}update(t){if(this.paused)return;let e=this.emitter;for(;e.parent;)e=e.parent;if(e.type!=="Scene"){this.dispose();return}if(this.firstTimeUpdate&&(this.firstTimeUpdate=!1,this.emitter.updateWorldMatrix(!0,!1)),this.emitEnded&&this.particleNum===0){this.markForDestroy&&this.emitter.parent&&this.dispose();return}if(this.looping&&this.prewarm&&!this.prewarmed){this.prewarmed=!0;for(let i=0;i<this.duration*qp;i++)this.update(1/qp)}t>.1&&(t=.1),this.neededToUpdateRender&&(this._renderer&&this._renderer.updateSystem(this),this.neededToUpdateRender=!1),this.onlyUsedByOther||this.emit(t,this.emissionState,this.emitter.matrixWorld),this.emitterShape.update(this,t);for(let i=0;i<this.behaviors.length;i++){this.behaviors[i].frameUpdate(t);for(let n=0;n<this.particleNum;n++)this.particles[n].died||this.behaviors[i].update(this.particles[n],t)}for(let i=0;i<this.particleNum;i++)this.rendererEmitterSettings.followLocalOrigin&&this.particles[i].localPosition?(this.particles[i].position.copy(this.particles[i].localPosition),this.particles[i].parentMatrix?this.particles[i].position.applyMatrix4(this.particles[i].parentMatrix):this.particles[i].position.applyMatrix4(this.emitter.matrixWorld)):this.particles[i].position.addScaledVector(this.particles[i].velocity,t*this.particles[i].speedModifier),this.particles[i].age+=t;if(this.rendererSettings.renderMode===Pt.Trail)for(let i=0;i<this.particleNum;i++)this.particles[i].update();for(let i=0;i<this.particleNum;i++){const n=this.particles[i];n.died&&(!(n instanceof Wu)||n.previous.length===0)&&(this.particles[i]=this.particles[this.particleNum-1],this.particles[this.particleNum-1]=n,this.particleNum--,i--,this.fire({type:"particleDied",particleSystem:this,particle:n}))}}emit(t,e,i){e.time>this.duration&&(this.looping?(e.time-=this.duration,e.burstIndex=0,this.behaviors.forEach(s=>{s.reset()})):!this.emitEnded&&!this.onlyUsedByOther&&this.endEmit()),this.normalMatrix.getNormalMatrix(i);const n=Math.ceil(e.waitEmiting);for(this.spawn(n,e,i),e.waitEmiting-=n;e.burstIndex<this.emissionBursts.length&&this.emissionBursts[e.burstIndex].time<=e.time;){if(Math.random()<this.emissionBursts[e.burstIndex].probability){const s=this.emissionBursts[e.burstIndex].count.genValue(this.memory,this.time);e.isBursting=!0,e.burstParticleCount=s,this.spawn(s,e,i),e.isBursting=!1}e.burstIndex++}if(!this.emitEnded&&(e.waitEmiting+=t*this.emissionOverTime.genValue(this.memory,e.time/this.duration),e.previousWorldPos!=null)){this.temp.set(i.elements[12],i.elements[13],i.elements[14]),e.travelDistance+=e.previousWorldPos.distanceTo(this.temp);const s=this.emissionOverDistance.genValue(this.memory,e.time/this.duration);if(e.travelDistance*s>0){const a=Math.floor(e.travelDistance*s);e.travelDistance-=a/s,e.waitEmiting+=a}}e.previousWorldPos===void 0&&(e.previousWorldPos=new Nt),e.previousWorldPos.set(i.elements[12],i.elements[13],i.elements[14]),e.time+=t}toJSON(t,e={}){var a;if((t===void 0||typeof t=="string")&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}}),t.materials[this.rendererSettings.material.uuid]=this.rendererSettings.material.toJSON(t),e.useUrlForImage&&((a=this.texture)==null?void 0:a.source)!==void 0){const o=this.texture.source;t.images[o.uuid]={uuid:o.uuid,url:this.texture.image.url}}let n;this.renderMode===Pt.Trail?n={startLength:this.rendererEmitterSettings.startLength.toJSON(),followLocalOrigin:this.rendererEmitterSettings.followLocalOrigin}:this.renderMode===Pt.Mesh?n={}:this.renderMode===Pt.StretchedBillBoard?n={speedFactor:this.rendererEmitterSettings.speedFactor,lengthFactor:this.rendererEmitterSettings.lengthFactor}:n={};const s=this.rendererSettings.instancingGeometry;return t.geometries&&!t.geometries[s.uuid]&&(t.geometries[s.uuid]=s.toJSON()),{version:"3.0",autoDestroy:this.autoDestroy,looping:this.looping,prewarm:this.prewarm,duration:this.duration,shape:this.emitterShape.toJSON(),startLife:this.startLife.toJSON(),startSpeed:this.startSpeed.toJSON(),startRotation:this.startRotation.toJSON(),startSize:this.startSize.toJSON(),startColor:this.startColor.toJSON(),emissionOverTime:this.emissionOverTime.toJSON(),emissionOverDistance:this.emissionOverDistance.toJSON(),emissionBursts:this.emissionBursts.map(o=>({time:o.time,count:o.count.toJSON(),probability:o.probability,interval:o.interval,cycle:o.cycle})),onlyUsedByOther:this.onlyUsedByOther,instancingGeometry:this.rendererSettings.instancingGeometry.uuid,renderOrder:this.renderOrder,renderMode:this.renderMode,rendererEmitterSettings:n,material:this.rendererSettings.material.uuid,layers:this.layers.mask,startTileIndex:this.startTileIndex.toJSON(),uTileCount:this.uTileCount,vTileCount:this.vTileCount,blendTiles:this.blendTiles,softParticles:this.rendererSettings.softParticles,softFarFade:this.rendererSettings.softFarFade,softNearFade:this.rendererSettings.softNearFade,behaviors:this.behaviors.map(o=>o.toJSON()),worldSpace:this.worldSpace}}static fromJSON(t,e,i){var l;const n=Jw(t.shape,e);let s;if(t.renderMode===Pt.Trail){const c=t.rendererEmitterSettings;s={startLength:c.startLength!=null?le(c.startLength):new ge(30),followLocalOrigin:c.followLocalOrigin}}else t.renderMode===Pt.Mesh?s={}:t.renderMode===Pt.StretchedBillBoard?(s=t.rendererEmitterSettings,t.speedFactor!=null&&(s.speedFactor=t.speedFactor)):s={};const a=new is;t.layers&&(a.mask=t.layers);const o=new Rc({autoDestroy:t.autoDestroy,looping:t.looping,prewarm:t.prewarm,duration:t.duration,shape:n,startLife:le(t.startLife),startSpeed:le(t.startSpeed),startRotation:Ac(t.startRotation),startSize:Ac(t.startSize),startColor:Gd(t.startColor),emissionOverTime:le(t.emissionOverTime),emissionOverDistance:le(t.emissionOverDistance),emissionBursts:(l=t.emissionBursts)==null?void 0:l.map(c=>({time:c.time,count:typeof c.count=="number"?new ge(c.count):le(c.count),probability:c.probability??1,interval:c.interval??.1,cycle:c.cycle??1})),onlyUsedByOther:t.onlyUsedByOther,instancingGeometry:e.geometries[t.instancingGeometry],renderMode:t.renderMode,rendererEmitterSettings:s,renderOrder:t.renderOrder,layers:a,material:t.material?e.materials[t.material]:t.texture?new He({map:e.textures[t.texture],transparent:t.transparent??!0,blending:t.blending,side:zi}):new He({color:16777215,transparent:!0,blending:Cr,side:zi}),startTileIndex:typeof t.startTileIndex=="number"?new ge(t.startTileIndex):le(t.startTileIndex),uTileCount:t.uTileCount,vTileCount:t.vTileCount,blendTiles:t.blendTiles,softParticles:t.softParticles,softFarFade:t.softFarFade,softNearFade:t.softNearFade,behaviors:[],worldSpace:t.worldSpace});return o.behaviors=t.behaviors.map(c=>{const h=nT(c,o);return h&&h.type==="EmitSubParticleSystem"&&(i[c.subParticleSystem]=h),h}).filter(c=>c!==null),o}addBehavior(t){this.behaviors.push(t)}getRendererSettings(){return this.rendererSettings}addEventListener(t,e){this.listeners[t]||(this.listeners[t]=[]),this.listeners[t].push(e)}removeAllEventListeners(t){this.listeners[t]&&(this.listeners[t]=[])}removeEventListener(t,e){if(this.listeners[t]){const i=this.listeners[t].indexOf(e);i!==-1&&this.listeners[t].splice(i,1)}}fire(t){this.listeners[t.type]&&this.listeners[t.type].forEach(e=>e(t))}clone(){const t=[];for(const s of this.emissionBursts){const a={};Object.assign(a,s),t.push(a)}const e=[];for(const s of this.behaviors)e.push(s.clone());let i;this.renderMode===Pt.Trail?i={startLength:this.rendererEmitterSettings.startLength.clone(),followLocalOrigin:this.rendererEmitterSettings.followLocalOrigin}:this.renderMode===Pt.StretchedBillBoard?i={lengthFactor:this.rendererEmitterSettings.lengthFactor,speedFactor:this.rendererEmitterSettings.speedFactor}:i={};const n=new is;return n.mask=this.layers.mask,new Rc({autoDestroy:this.autoDestroy,looping:this.looping,duration:this.duration,shape:this.emitterShape.clone(),startLife:this.startLife.clone(),startSpeed:this.startSpeed.clone(),startRotation:this.startRotation.clone(),startSize:this.startSize.clone(),startColor:this.startColor.clone(),emissionOverTime:this.emissionOverTime.clone(),emissionOverDistance:this.emissionOverDistance.clone(),emissionBursts:t,onlyUsedByOther:this.onlyUsedByOther,instancingGeometry:this.rendererSettings.instancingGeometry,renderMode:this.renderMode,renderOrder:this.renderOrder,rendererEmitterSettings:i,material:this.rendererSettings.material,startTileIndex:this.startTileIndex,uTileCount:this.uTileCount,vTileCount:this.vTileCount,blendTiles:this.blendTiles,softParticles:this.softParticles,softFarFade:this.softFarFade,softNearFade:this.softNearFade,behaviors:e,worldSpace:this.worldSpace,layers:n})}}var Su=`

#include <common>
#include <color_pars_fragment>
#include <map_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
#include <alphatest_pars_fragment>

#include <tile_pars_fragment>
#include <soft_pars_fragment>

void main() {

    #include <clipping_planes_fragment>
    
    vec3 outgoingLight = vec3( 0.0 );
    vec4 diffuseColor = vColor;
    
    #include <logdepthbuf_fragment>
    
    #include <tile_fragment>
    #include <alphatest_fragment>

    outgoingLight = diffuseColor.rgb;
    
    #ifdef USE_COLOR_AS_ALPHA
    gl_FragColor = vec4( outgoingLight, diffuseColor.r );
    #else
    gl_FragColor = vec4( outgoingLight, diffuseColor.a );
    #endif
    
    #include <soft_fragment>
    #include <tonemapping_fragment>
}
`,Hd=`
#define STANDARD

#ifdef PHYSICAL
#define IOR
#define USE_SPECULAR
#endif

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;

#ifdef IOR
uniform float ior;
#endif

#ifdef USE_SPECULAR
uniform float specularIntensity;
uniform vec3 specularColor;

#ifdef USE_SPECULAR_COLORMAP
uniform sampler2D specularColorMap;
#endif

#ifdef USE_SPECULAR_INTENSITYMAP
uniform sampler2D specularIntensityMap;
#endif
#endif

#ifdef USE_CLEARCOAT
uniform float clearcoat;
uniform float clearcoatRoughness;
#endif

#ifdef USE_DISPERSION
uniform float dispersion;
#endif

#ifdef USE_IRIDESCENCE
uniform float iridescence;
uniform float iridescenceIOR;
uniform float iridescenceThicknessMinimum;
uniform float iridescenceThicknessMaximum;
#endif

#ifdef USE_SHEEN
uniform vec3 sheenColor;
uniform float sheenRoughness;

#ifdef USE_SHEEN_COLORMAP
uniform sampler2D sheenColorMap;
#endif

#ifdef USE_SHEEN_ROUGHNESSMAP
uniform sampler2D sheenRoughnessMap;
#endif
#endif

#ifdef USE_ANISOTROPY
uniform vec2 anisotropyVector;

#ifdef USE_ANISOTROPYMAP
uniform sampler2D anisotropyMap;
#endif
#endif

varying vec3 vViewPosition;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

vec4 diffuseColor = vec4( diffuse, opacity );
#include <clipping_planes_fragment>

ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
vec3 totalEmissiveRadiance = emissive;

#include <logdepthbuf_fragment>
#include <map_fragment>
#include <color_fragment>
#include <alphamap_fragment>
#include <alphatest_fragment>
#include <alphahash_fragment>
#include <roughnessmap_fragment>
#include <metalnessmap_fragment>
#include <normal_fragment_begin>
#include <normal_fragment_maps>
#include <clearcoat_normal_fragment_begin>
#include <clearcoat_normal_fragment_maps>
#include <emissivemap_fragment>

// accumulation
#include <lights_physical_fragment>
#include <lights_fragment_begin>
#include <lights_fragment_maps>
#include <lights_fragment_end>

// modulation
#include <aomap_fragment>

vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;

#include <transmission_fragment>

vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;

#ifdef USE_SHEEN

// Sheen energy compensation approximation calculation can be found at the end of
// https://drive.google.com/file/d/1T0D1VSyR4AllqIJTQAraEIzjlb5h4FKH/view?usp=sharing
float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );

outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;

#endif

#ifdef USE_CLEARCOAT

float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );

vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );

outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;

#endif

#include <opaque_fragment>
#include <tonemapping_fragment>
#include <colorspace_fragment>
#include <fog_fragment>
#include <premultiplied_alpha_fragment>
#include <dithering_fragment>
}`,vT=`
#include <common>
#include <color_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

#include <tile_pars_vertex>
#include <soft_pars_vertex>

attribute vec3 offset;
attribute float rotation;
attribute vec3 size;

void main() {
	
    vec2 alignedPosition = position.xy * size.xy;
    
    vec2 rotatedPosition;
    rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
    rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
#ifdef HORIZONTAL
    vec4 mvPosition = modelMatrix * vec4( offset, 1.0 );
    mvPosition.x += rotatedPosition.x;
    mvPosition.z -= rotatedPosition.y;
    mvPosition = viewMatrix * mvPosition;
#elif defined(VERTICAL)
    vec4 mvPosition = modelMatrix * vec4( offset, 1.0 );
    mvPosition.y += rotatedPosition.y;
    mvPosition = viewMatrix * mvPosition;
    mvPosition.x += rotatedPosition.x;
#else
    vec4 mvPosition = modelViewMatrix * vec4( offset, 1.0 );
    mvPosition.xy += rotatedPosition;
#endif

	vColor = color;

	gl_Position = projectionMatrix * mvPosition;

	#include <logdepthbuf_vertex>

	#include <clipping_planes_vertex>

	#include <tile_vertex>
	#include <soft_vertex>
}
`,ST=`
#include <common>
#include <color_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#include <tile_pars_vertex>
#include <soft_pars_vertex>

attribute vec3 offset;
attribute vec4 rotation;
attribute vec3 size;
// attribute vec4 color;

void main() {

    float x2 = rotation.x + rotation.x, y2 = rotation.y + rotation.y, z2 = rotation.z + rotation.z;
    float xx = rotation.x * x2, xy = rotation.x * y2, xz = rotation.x * z2;
    float yy = rotation.y * y2, yz = rotation.y * z2, zz = rotation.z * z2;
    float wx = rotation.w * x2, wy = rotation.w * y2, wz = rotation.w * z2;
    float sx = size.x, sy = size.y, sz = size.z;
    
    mat4 matrix = mat4(( 1.0 - ( yy + zz ) ) * sx, ( xy + wz ) * sx, ( xz - wy ) * sx, 0.0,  // 1. column
                      ( xy - wz ) * sy, ( 1.0 - ( xx + zz ) ) * sy, ( yz + wx ) * sy, 0.0,  // 2. column
                      ( xz + wy ) * sz, ( yz - wx ) * sz, ( 1.0 - ( xx + yy ) ) * sz, 0.0,  // 3. column
                      offset.x, offset.y, offset.z, 1.0);
    
    vec4 mvPosition = modelViewMatrix * (matrix * vec4( position, 1.0 ));

	vColor = color;

	gl_Position = projectionMatrix * mvPosition;

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
    #include <tile_vertex>
    #include <soft_vertex>
}
`,Wd=`
#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>

attribute vec3 offset;
attribute vec4 rotation;
attribute vec3 size;
#include <tile_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

void main() {

    #include <tile_vertex>
    float x2 = rotation.x + rotation.x, y2 = rotation.y + rotation.y, z2 = rotation.z + rotation.z;
    float xx = rotation.x * x2, xy = rotation.x * y2, xz = rotation.x * z2;
    float yy = rotation.y * y2, yz = rotation.y * z2, zz = rotation.z * z2;
    float wx = rotation.w * x2, wy = rotation.w * y2, wz = rotation.w * z2;
    float sx = size.x, sy = size.y, sz = size.z;

    mat4 particleMatrix = mat4(( 1.0 - ( yy + zz ) ) * sx, ( xy + wz ) * sx, ( xz - wy ) * sx, 0.0,  // 1. column
                      ( xy - wz ) * sy, ( 1.0 - ( xx + zz ) ) * sy, ( yz + wx ) * sy, 0.0,  // 2. column
                      ( xz + wy ) * sz, ( yz - wx ) * sz, ( 1.0 - ( xx + yy ) ) * sz, 0.0,  // 3. column
                      offset.x, offset.y, offset.z, 1.0);

#include <color_vertex>
#include <morphinstance_vertex>
#include <morphcolor_vertex>
#include <batching_vertex>

#include <beginnormal_vertex>
#include <morphnormal_vertex>
#include <skinbase_vertex>
#include <skinnormal_vertex>

	// replace defaultnormal_vertex
	vec3 transformedNormal = objectNormal;
    mat3 m = mat3( particleMatrix );
    transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
    transformedNormal = m * transformedNormal;
    transformedNormal = normalMatrix * transformedNormal;
    #ifdef FLIP_SIDED
        transformedNormal = - transformedNormal;
    #endif
    #ifdef USE_TANGENT
        vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
        #ifdef FLIP_SIDED
        transformedTangent = - transformedTangent;
        #endif
    #endif

	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>

	// replace include <project_vertex>
  vec4 mvPosition = vec4( transformed, 1.0 );
  mvPosition = modelViewMatrix * (particleMatrix * mvPosition);
	gl_Position = projectionMatrix * mvPosition;

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	
	vViewPosition = - mvPosition.xyz;
	
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
    vWorldPosition = worldPosition.xyz;
#endif
}
`,MT=`
#include <common>
#include <color_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

#include <tile_pars_vertex>
#include <soft_pars_vertex>

attribute vec3 offset;
attribute float rotation;
attribute vec3 size;
attribute vec4 velocity;

uniform float speedFactor;

void main() {
    float lengthFactor = velocity.w;
    float avgSize = (size.x + size.y) * 0.5;
#ifdef USE_SKEW
    vec4 mvPosition = modelViewMatrix * vec4( offset, 1.0 );
    vec3 viewVelocity = normalMatrix * velocity.xyz;

    vec3 scaledPos = vec3(position.xy * size.xy, position.z);
    float vlength = length(viewVelocity);
    vec3 projVelocity =  dot(scaledPos, viewVelocity) * viewVelocity / vlength;
    mvPosition.xyz += scaledPos + projVelocity * (speedFactor / avgSize + lengthFactor / vlength);
#else
    vec4 mvPosition = modelViewMatrix * vec4( offset, 1.0 );
    vec3 viewVelocity = normalMatrix * velocity.xyz;
    float vlength = length(viewVelocity); 
    mvPosition.xyz += position.y * normalize(cross(mvPosition.xyz, viewVelocity)) * avgSize; // switch the cross to  match unity implementation
    mvPosition.xyz -= (position.x + 0.5) * viewVelocity * (1.0 + lengthFactor / vlength) * avgSize; // minus position.x to match unity implementation
#endif
	vColor = color;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <tile_vertex>
	#include <soft_vertex>
}
`;function Xu(r){return r===0?"uv":`uv${r}`}class bT extends Oe{constructor(t){super(t)}onBeforeCompile(t,e){super.onBeforeCompile(t,e),t.vertexShader=Wd,t.fragmentShader=Hd}}class wT extends Ad{constructor(t){super(t)}onBeforeCompile(t,e){super.onBeforeCompile(t,e),t.vertexShader=Wd,t.fragmentShader=Hd}}class TT extends r0{constructor(t){super(t),this.vector_=new Nt,this.vector2_=new Nt,this.vector3_=new Nt,this.quaternion_=new xe,this.quaternion2_=new xe,this.quaternion3_=new xe,this.rotationMat_=new fn,this.rotationMat2_=new fn,this.maxParticles=1e3,this.setupBuffers(),this.rebuildMaterial()}buildExpandableBuffers(){this.offsetBuffer=new Li(new Float32Array(this.maxParticles*3),3),this.offsetBuffer.setUsage(oi),this.geometry.setAttribute("offset",this.offsetBuffer),this.colorBuffer=new Li(new Float32Array(this.maxParticles*4),4),this.colorBuffer.setUsage(oi),this.geometry.setAttribute("color",this.colorBuffer),this.settings.renderMode===Pt.Mesh?(this.rotationBuffer=new Li(new Float32Array(this.maxParticles*4),4),this.rotationBuffer.setUsage(oi),this.geometry.setAttribute("rotation",this.rotationBuffer)):(this.settings.renderMode===Pt.BillBoard||this.settings.renderMode===Pt.HorizontalBillBoard||this.settings.renderMode===Pt.VerticalBillBoard||this.settings.renderMode===Pt.StretchedBillBoard)&&(this.rotationBuffer=new Li(new Float32Array(this.maxParticles),1),this.rotationBuffer.setUsage(oi),this.geometry.setAttribute("rotation",this.rotationBuffer)),this.sizeBuffer=new Li(new Float32Array(this.maxParticles*3),3),this.sizeBuffer.setUsage(oi),this.geometry.setAttribute("size",this.sizeBuffer),this.uvTileBuffer=new Li(new Float32Array(this.maxParticles),1),this.uvTileBuffer.setUsage(oi),this.geometry.setAttribute("uvTile",this.uvTileBuffer),this.settings.renderMode===Pt.StretchedBillBoard&&(this.velocityBuffer=new Li(new Float32Array(this.maxParticles*4),4),this.velocityBuffer.setUsage(oi),this.geometry.setAttribute("velocity",this.velocityBuffer))}setupBuffers(){this.geometry&&this.geometry.dispose(),this.geometry=new Od,this.geometry.setIndex(this.settings.instancingGeometry.getIndex()),this.settings.instancingGeometry.hasAttribute("normal")&&this.geometry.setAttribute("normal",this.settings.instancingGeometry.getAttribute("normal")),this.geometry.setAttribute("position",this.settings.instancingGeometry.getAttribute("position")),this.settings.instancingGeometry.hasAttribute("uv")&&this.geometry.setAttribute("uv",this.settings.instancingGeometry.getAttribute("uv")),this.buildExpandableBuffers()}expandBuffers(t){for(;t>=this.maxParticles;)this.maxParticles*=2;this.setupBuffers()}rebuildMaterial(){this.layers.mask=this.settings.layers.mask;const t={},e={};this.settings.material.type!=="MeshStandardMaterial"&&this.settings.material.type!=="MeshPhysicalMaterial"&&(t.map=new bi(this.settings.material.map)),this.settings.material.alphaTest&&(e.USE_ALPHATEST="",t.alphaTest=new bi(this.settings.material.alphaTest)),e.USE_UV="";const i=this.settings.uTileCount,n=this.settings.vTileCount;(i>1||n>1)&&(e.UV_TILE="",t.tileCount=new bi(new Fr(i,n))),this.settings.material.defines&&this.settings.material.defines.USE_COLOR_AS_ALPHA!==void 0&&(e.USE_COLOR_AS_ALPHA=""),this.settings.material.normalMap&&(e.USE_NORMALMAP="",e.NORMALMAP_UV=Xu(this.settings.material.normalMap.channel),t.normalMapTransform=new bi(new fn().copy(this.settings.material.normalMap.matrix))),this.settings.material.map&&(e.USE_MAP="",this.settings.blendTiles&&(e.TILE_BLEND=""),e.MAP_UV=Xu(this.settings.material.map.channel),t.mapTransform=new bi(new fn().copy(this.settings.material.map.matrix))),e.USE_COLOR_ALPHA="";let s;if(this.settings.softParticles){e.SOFT_PARTICLES="";const o=this.settings.softNearFade,l=1/(this.settings.softFarFade-this.settings.softNearFade);t.softParams=new bi(new Fr(o,l)),t.depthTexture=new bi(null);const c=t.projParams=new bi(new Oi);s=(h,d,u)=>{c.value.set(u.near,u.far,0,0)}}let a=!1;if(this.settings.renderMode===Pt.BillBoard||this.settings.renderMode===Pt.VerticalBillBoard||this.settings.renderMode===Pt.HorizontalBillBoard||this.settings.renderMode===Pt.Mesh){let o,l;this.settings.renderMode===Pt.Mesh?this.settings.material.type==="MeshStandardMaterial"||this.settings.material.type==="MeshPhysicalMaterial"?(e.USE_COLOR="",o=Wd,l=Hd,a=!0):(o=ST,l=Su):(o=vT,l=Su),this.settings.renderMode===Pt.VerticalBillBoard?e.VERTICAL="":this.settings.renderMode===Pt.HorizontalBillBoard&&(e.HORIZONTAL="");let c=!1;this.settings.renderMode===Pt.Mesh&&(this.settings.material.type==="MeshStandardMaterial"?(this.material=new bT({}),this.material.copy(this.settings.material),this.material.uniforms=t,this.material.defines=e,c=!0):this.settings.material.type==="MeshPhysicalMaterial"&&(this.material=new wT({}),this.material.copy(this.settings.material),this.material.uniforms=t,this.material.defines=e,c=!0)),c||(this.material=new hi({uniforms:t,defines:e,vertexShader:o,fragmentShader:l,transparent:this.settings.material.transparent,depthWrite:!this.settings.material.transparent,blending:this.settings.material.blending,blendDst:this.settings.material.blendDst,blendSrc:this.settings.material.blendSrc,blendEquation:this.settings.material.blendEquation,premultipliedAlpha:this.settings.material.premultipliedAlpha,side:this.settings.material.side,alphaTest:this.settings.material.alphaTest,depthTest:this.settings.material.depthTest,lights:a}))}else if(this.settings.renderMode===Pt.StretchedBillBoard)t.speedFactor=new bi(1),this.material=new hi({uniforms:t,defines:e,vertexShader:MT,fragmentShader:Su,transparent:this.settings.material.transparent,depthWrite:!this.settings.material.transparent,blending:this.settings.material.blending,blendDst:this.settings.material.blendDst,blendSrc:this.settings.material.blendSrc,blendEquation:this.settings.material.blendEquation,premultipliedAlpha:this.settings.material.premultipliedAlpha,side:this.settings.material.side,alphaTest:this.settings.material.alphaTest,depthTest:this.settings.material.depthTest});else throw new Error("render mode unavailable");this.material&&s&&(this.material.onBeforeRender=s)}update(){let t=0,e=0;const i=this.getVisibleSystems();for(const n of i)e+=n.particleNum;e>this.maxParticles&&this.expandBuffers(e);for(const n of i){n.emitter.updateMatrixWorld&&(n.emitter.updateWorldMatrix(!0,!1),n.emitter.updateMatrixWorld(!0));const s=n.particles,a=n.particleNum,o=this.quaternion2_,l=this.vector2_,c=this.vector3_;n.emitter.matrixWorld.decompose(l,o,c),this.rotationMat_.setFromMatrix4(n.emitter.matrixWorld);for(let h=0;h<a;h++,t++){const d=s[h];if(this.settings.renderMode===Pt.Mesh){let f;if(n.worldSpace)f=d.rotation;else{let p;d.parentMatrix?p=this.quaternion3_.setFromRotationMatrix(d.parentMatrix):p=o,f=this.quaternion_,f.copy(p).multiply(d.rotation)}this.rotationBuffer.setXYZW(t,f.x,f.y,f.z,f.w)}else(this.settings.renderMode===Pt.StretchedBillBoard||this.settings.renderMode===Pt.VerticalBillBoard||this.settings.renderMode===Pt.HorizontalBillBoard||this.settings.renderMode===Pt.BillBoard)&&this.rotationBuffer.setX(t,d.rotation);let u;if(n.worldSpace?u=d.position:(u=this.vector_,d.parentMatrix?u.copy(d.position).applyMatrix4(d.parentMatrix):u.copy(d.position).applyMatrix4(n.emitter.matrixWorld)),this.offsetBuffer.setXYZ(t,u.x,u.y,u.z),this.colorBuffer.setXYZW(t,d.color.x,d.color.y,d.color.z,d.color.w),n.worldSpace?this.sizeBuffer.setXYZ(t,d.size.x,d.size.y,d.size.z):d.parentMatrix?this.sizeBuffer.setXYZ(t,d.size.x,d.size.y,d.size.z):this.sizeBuffer.setXYZ(t,d.size.x*Math.abs(c.x),d.size.y*Math.abs(c.y),d.size.z*Math.abs(c.z)),this.uvTileBuffer.setX(t,d.uvTile),this.settings.renderMode===Pt.StretchedBillBoard&&this.velocityBuffer){let f=n.rendererEmitterSettings.speedFactor;f===0&&(f=.001);const p=n.rendererEmitterSettings.lengthFactor;let x;n.worldSpace?x=d.velocity:(x=this.vector_,d.parentMatrix?(this.rotationMat2_.setFromMatrix4(d.parentMatrix),x.copy(d.velocity).applyMatrix3(this.rotationMat2_)):x.copy(d.velocity).applyMatrix3(this.rotationMat_)),this.velocityBuffer.setXYZW(t,x.x*f,x.y*f,x.z*f,p)}}}this.geometry.instanceCount=t,t>0&&(this.offsetBuffer.clearUpdateRanges(),this.offsetBuffer.addUpdateRange(0,t*3),this.offsetBuffer.needsUpdate=!0,this.sizeBuffer.clearUpdateRanges(),this.sizeBuffer.addUpdateRange(0,t*3),this.sizeBuffer.needsUpdate=!0,this.colorBuffer.clearUpdateRanges(),this.colorBuffer.addUpdateRange(0,t*4),this.colorBuffer.needsUpdate=!0,this.uvTileBuffer.clearUpdateRanges(),this.uvTileBuffer.addUpdateRange(0,t),this.uvTileBuffer.needsUpdate=!0,this.settings.renderMode===Pt.StretchedBillBoard&&this.velocityBuffer&&(this.velocityBuffer.clearUpdateRanges(),this.velocityBuffer.addUpdateRange(0,t*4),this.velocityBuffer.needsUpdate=!0),this.settings.renderMode===Pt.Mesh?(this.rotationBuffer.clearUpdateRanges(),this.rotationBuffer.addUpdateRange(0,t*4),this.rotationBuffer.needsUpdate=!0):(this.settings.renderMode===Pt.StretchedBillBoard||this.settings.renderMode===Pt.HorizontalBillBoard||this.settings.renderMode===Pt.VerticalBillBoard||this.settings.renderMode===Pt.BillBoard)&&(this.rotationBuffer.clearUpdateRanges(),this.rotationBuffer.addUpdateRange(0,t),this.rotationBuffer.needsUpdate=!0))}dispose(){this.geometry.dispose()}}var ET=`

#include <common>
#include <tile_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

uniform sampler2D alphaMap;
uniform float useAlphaMap;
uniform float visibility;
uniform float alphaTest;

varying vec4 vColor;
    
void main() {
    #include <clipping_planes_fragment>
    #include <logdepthbuf_fragment>

    vec4 diffuseColor = vColor;
    
    #ifdef USE_MAP
    #include <tile_fragment>
    #ifndef USE_COLOR_AS_ALPHA
    #endif
    #endif
    if( useAlphaMap == 1. ) diffuseColor.a *= texture2D( alphaMap, vUv).a;
    if( diffuseColor.a < alphaTest ) discard;
    gl_FragColor = diffuseColor;

    #include <fog_fragment>
    #include <tonemapping_fragment>
}`,AT=`
#include <common>
#include <tile_pars_vertex>
#include <color_pars_vertex>
#include <clipping_planes_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <fog_pars_vertex>

attribute vec3 previous;
attribute vec3 next;
attribute float side;
attribute float width;

uniform vec2 resolution;
uniform float lineWidth;
uniform float sizeAttenuation;
    
vec2 fix(vec4 i, float aspect) {
    vec2 res = i.xy / i.w;
    res.x *= aspect;
    return res;
}
    
void main() {

    #include <tile_vertex>
    
    float aspect = resolution.x / resolution.y;

    vColor = color;

    mat4 m = projectionMatrix * modelViewMatrix;
    vec4 finalPosition = m * vec4( position, 1.0 );
    vec4 prevPos = m * vec4( previous, 1.0 );
    vec4 nextPos = m * vec4( next, 1.0 );

    vec2 currentP = fix( finalPosition, aspect );
    vec2 prevP = fix( prevPos, aspect );
    vec2 nextP = fix( nextPos, aspect );

    float w = lineWidth * width;

    vec2 dir;
    if( nextP == currentP ) dir = normalize( currentP - prevP );
    else if( prevP == currentP ) dir = normalize( nextP - currentP );
    else {
        vec2 dir1 = normalize( currentP - prevP );
        vec2 dir2 = normalize( nextP - currentP );
        dir = normalize( dir1 + dir2 );

        vec2 perp = vec2( -dir1.y, dir1.x );
        vec2 miter = vec2( -dir.y, dir.x );
        //w = clamp( w / dot( miter, perp ), 0., 4., * lineWidth * width );

    }

    //vec2 normal = ( cross( vec3( dir, 0. ) vec3( 0., 0., 1. ) ) ).xy;
    vec4 normal = vec4( -dir.y, dir.x, 0., 1. );
    normal.xy *= .5 * w;
    normal *= projectionMatrix;
    if( sizeAttenuation == 0. ) {
        normal.xy *= finalPosition.w;
        normal.xy /= ( vec4( resolution, 0., 1. ) * projectionMatrix ).xy;
    }

    finalPosition.xy += normal.xy * side;

    gl_Position = finalPosition;

	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    
	#include <fog_vertex>
}`;class CT extends r0{constructor(t){super(t),this.vector_=new Nt,this.vector2_=new Nt,this.vector3_=new Nt,this.quaternion_=new xe,this.maxParticles=1e4,this.setupBuffers(),this.rebuildMaterial()}setupBuffers(){this.geometry&&this.geometry.dispose(),this.geometry=new Zt,this.indexBuffer=new ue(new Uint32Array(this.maxParticles*6),1),this.indexBuffer.setUsage(oi),this.geometry.setIndex(this.indexBuffer),this.positionBuffer=new ue(new Float32Array(this.maxParticles*6),3),this.positionBuffer.setUsage(oi),this.geometry.setAttribute("position",this.positionBuffer),this.previousBuffer=new ue(new Float32Array(this.maxParticles*6),3),this.previousBuffer.setUsage(oi),this.geometry.setAttribute("previous",this.previousBuffer),this.nextBuffer=new ue(new Float32Array(this.maxParticles*6),3),this.nextBuffer.setUsage(oi),this.geometry.setAttribute("next",this.nextBuffer),this.widthBuffer=new ue(new Float32Array(this.maxParticles*2),1),this.widthBuffer.setUsage(oi),this.geometry.setAttribute("width",this.widthBuffer),this.sideBuffer=new ue(new Float32Array(this.maxParticles*2),1),this.sideBuffer.setUsage(oi),this.geometry.setAttribute("side",this.sideBuffer),this.uvBuffer=new ue(new Float32Array(this.maxParticles*4),2),this.uvBuffer.setUsage(oi),this.geometry.setAttribute("uv",this.uvBuffer),this.colorBuffer=new ue(new Float32Array(this.maxParticles*8),4),this.colorBuffer.setUsage(oi),this.geometry.setAttribute("color",this.colorBuffer)}expandBuffers(t){for(;t>=this.maxParticles;)this.maxParticles*=2;this.setupBuffers()}rebuildMaterial(){this.layers.mask=this.settings.layers.mask;const t={lineWidth:{value:1},map:{value:null},useMap:{value:0},alphaMap:{value:null},useAlphaMap:{value:0},resolution:{value:new Fr(1,1)},sizeAttenuation:{value:1},visibility:{value:1},alphaTest:{value:0}},e={};if(e.USE_UV="",e.USE_COLOR_ALPHA="",this.settings.material.map&&(e.USE_MAP="",e.MAP_UV=Xu(this.settings.material.map.channel),t.map=new bi(this.settings.material.map),t.mapTransform=new bi(new fn().copy(this.settings.material.map.matrix))),this.settings.material.defines&&this.settings.material.defines.USE_COLOR_AS_ALPHA!==void 0&&(e.USE_COLOR_AS_ALPHA=""),this.settings.renderMode===Pt.Trail)this.material=new hi({uniforms:t,defines:e,vertexShader:AT,fragmentShader:ET,transparent:this.settings.material.transparent,depthWrite:!this.settings.material.transparent,side:this.settings.material.side,blending:this.settings.material.blending||Cr,blendDst:this.settings.material.blendDst,blendSrc:this.settings.material.blendSrc,blendEquation:this.settings.material.blendEquation,premultipliedAlpha:this.settings.material.premultipliedAlpha});else throw new Error("render mode unavailable")}update(){let t=0,e=0,i=0;const n=this.getVisibleSystems();for(const s of n)for(let a=0;a<s.particleNum;a++)i+=s.particles[a].previous.length*2;i>this.maxParticles&&this.expandBuffers(i);for(const s of n){s.emitter.updateMatrixWorld&&(s.emitter.updateWorldMatrix(!0,!1),s.emitter.updateMatrixWorld(!0));const a=this.quaternion_,o=this.vector2_,l=this.vector3_;s.emitter.matrixWorld.decompose(o,a,l);const c=s.particles,h=s.particleNum,d=this.settings.uTileCount,u=this.settings.vTileCount,f=1/d,p=1/u;for(let x=0;x<h;x++){const m=c[x],g=m.uvTile%u,v=Math.floor(m.uvTile/u+.001),w=m.previous.values();let _=w.next(),b=_.value,M=b;_.done||(_=w.next());let A;_.value!==void 0?A=_.value:A=M;for(let y=0;y<m.previous.length;y++,t+=2){if(this.positionBuffer.setXYZ(t,M.position.x,M.position.y,M.position.z),this.positionBuffer.setXYZ(t+1,M.position.x,M.position.y,M.position.z),s.worldSpace?(this.positionBuffer.setXYZ(t,M.position.x,M.position.y,M.position.z),this.positionBuffer.setXYZ(t+1,M.position.x,M.position.y,M.position.z)):(m.parentMatrix?this.vector_.copy(M.position).applyMatrix4(m.parentMatrix):this.vector_.copy(M.position).applyMatrix4(s.emitter.matrixWorld),this.positionBuffer.setXYZ(t,this.vector_.x,this.vector_.y,this.vector_.z),this.positionBuffer.setXYZ(t+1,this.vector_.x,this.vector_.y,this.vector_.z)),s.worldSpace?(this.previousBuffer.setXYZ(t,b.position.x,b.position.y,b.position.z),this.previousBuffer.setXYZ(t+1,b.position.x,b.position.y,b.position.z)):(m.parentMatrix?this.vector_.copy(b.position).applyMatrix4(m.parentMatrix):this.vector_.copy(b.position).applyMatrix4(s.emitter.matrixWorld),this.previousBuffer.setXYZ(t,this.vector_.x,this.vector_.y,this.vector_.z),this.previousBuffer.setXYZ(t+1,this.vector_.x,this.vector_.y,this.vector_.z)),s.worldSpace?(this.nextBuffer.setXYZ(t,A.position.x,A.position.y,A.position.z),this.nextBuffer.setXYZ(t+1,A.position.x,A.position.y,A.position.z)):(m.parentMatrix?this.vector_.copy(A.position).applyMatrix4(m.parentMatrix):this.vector_.copy(A.position).applyMatrix4(s.emitter.matrixWorld),this.nextBuffer.setXYZ(t,this.vector_.x,this.vector_.y,this.vector_.z),this.nextBuffer.setXYZ(t+1,this.vector_.x,this.vector_.y,this.vector_.z)),this.sideBuffer.setX(t,1),this.sideBuffer.setX(t+1,-1),s.worldSpace)this.widthBuffer.setX(t,M.size),this.widthBuffer.setX(t+1,M.size);else if(m.parentMatrix)this.widthBuffer.setX(t,M.size),this.widthBuffer.setX(t+1,M.size);else{const E=(Math.abs(l.x)+Math.abs(l.y)+Math.abs(l.z))/3;this.widthBuffer.setX(t,M.size*E),this.widthBuffer.setX(t+1,M.size*E)}this.uvBuffer.setXY(t,(y/m.previous.length+g)*f,(u-v-1)*p),this.uvBuffer.setXY(t+1,(y/m.previous.length+g)*f,(u-v)*p),this.colorBuffer.setXYZW(t,M.color.x,M.color.y,M.color.z,M.color.w),this.colorBuffer.setXYZW(t+1,M.color.x,M.color.y,M.color.z,M.color.w),y+1<m.previous.length&&(this.indexBuffer.setX(e*3,t),this.indexBuffer.setX(e*3+1,t+1),this.indexBuffer.setX(e*3+2,t+2),e++,this.indexBuffer.setX(e*3,t+2),this.indexBuffer.setX(e*3+1,t+1),this.indexBuffer.setX(e*3+2,t+3),e++),b=M,M=A,_.done||(_=w.next(),_.value!==void 0&&(A=_.value))}}}this.positionBuffer.clearUpdateRanges(),this.positionBuffer.addUpdateRange(0,t*3),this.positionBuffer.needsUpdate=!0,this.previousBuffer.clearUpdateRanges(),this.previousBuffer.addUpdateRange(0,t*3),this.previousBuffer.needsUpdate=!0,this.nextBuffer.clearUpdateRanges(),this.nextBuffer.addUpdateRange(0,t*3),this.nextBuffer.needsUpdate=!0,this.sideBuffer.clearUpdateRanges(),this.sideBuffer.addUpdateRange(0,t),this.sideBuffer.needsUpdate=!0,this.widthBuffer.clearUpdateRanges(),this.widthBuffer.addUpdateRange(0,t),this.widthBuffer.needsUpdate=!0,this.uvBuffer.clearUpdateRanges(),this.uvBuffer.addUpdateRange(0,t*2),this.uvBuffer.needsUpdate=!0,this.colorBuffer.clearUpdateRanges(),this.colorBuffer.addUpdateRange(0,t*4),this.colorBuffer.needsUpdate=!0,this.indexBuffer.clearUpdateRanges(),this.indexBuffer.addUpdateRange(0,e*3),this.indexBuffer.needsUpdate=!0,this.geometry.setDrawRange(0,e*3)}dispose(){this.geometry.dispose()}}class Xd extends he{constructor(){super(),this.batches=[],this.systemToBatchIndex=new Map,this.type="BatchedRenderer",this.depthTexture=null}static equals(t,e){return t.material.side===e.material.side&&t.material.blending===e.material.blending&&t.material.blendSrc===e.material.blendSrc&&t.material.blendDst===e.material.blendDst&&t.material.blendEquation===e.material.blendEquation&&t.material.premultipliedAlpha===e.material.premultipliedAlpha&&t.material.transparent===e.material.transparent&&t.material.depthTest===e.material.depthTest&&t.material.type===e.material.type&&t.material.alphaTest===e.material.alphaTest&&t.material.map===e.material.map&&t.renderMode===e.renderMode&&t.blendTiles===e.blendTiles&&t.softParticles===e.softParticles&&t.softFarFade===e.softFarFade&&t.softNearFade===e.softNearFade&&t.uTileCount===e.uTileCount&&t.vTileCount===e.vTileCount&&t.instancingGeometry===e.instancingGeometry&&t.renderOrder===e.renderOrder&&t.layers.mask===e.layers.mask}addSystem(t){t._renderer=this;const e=t.getRendererSettings();for(let n=0;n<this.batches.length;n++)if(Xd.equals(this.batches[n].settings,e)){this.batches[n].addSystem(t),this.systemToBatchIndex.set(t,n);return}let i;switch(e.renderMode){case Pt.Trail:i=new CT(e);break;case Pt.Mesh:case Pt.BillBoard:case Pt.VerticalBillBoard:case Pt.HorizontalBillBoard:case Pt.StretchedBillBoard:i=new TT(e);break}this.depthTexture&&i.applyDepthTexture(this.depthTexture),i.addSystem(t),this.batches.push(i),this.systemToBatchIndex.set(t,this.batches.length-1),this.add(i)}deleteSystem(t){const e=this.systemToBatchIndex.get(t);e!=null&&(this.batches[e].removeSystem(t),this.systemToBatchIndex.delete(t))}setDepthTexture(t){this.depthTexture=t;for(const e of this.batches)e.applyDepthTexture(t)}updateSystem(t){this.deleteSystem(t),this.addSystem(t)}update(t){this.systemToBatchIndex.forEach((e,i)=>{i.update(t)});for(let e=0;e<this.batches.length;e++)this.batches[e].update()}}mT();rT(aT);console.log("%c Particle system powered by three.quarks. https://quarks.art/","font-size: 14px; font-weight: bold;");const de=r=>document.getElementById(r),us=(r,t,e)=>Math.max(t,Math.min(e,r)),wi=(r,t)=>r+Math.random()*(t-r),Pc=new URLSearchParams(location.search),RT=de("app"),a0=de("hud"),PT=de("menu"),o0=de("gameover"),Jp=de("dmg"),Yp=de("heal"),fa=de("toast"),Ge=new Qg({antialias:!0,powerPreference:"high-performance"});Ge.setSize(innerWidth,innerHeight);Ge.setPixelRatio(Math.min(devicePixelRatio,1.5));Ge.shadowMap.enabled=!0;Ge.shadowMap.type=Sr;Ge.toneMapping=Nc;Ge.toneMappingExposure=1.12;Ge.domElement.className="game";RT.appendChild(Ge.domElement);const $e=new fd;$e.background=new bt(8890052);$e.fog=new bo(10335176,40,160);const Ye=new Ze(78,innerWidth/innerHeight,.08,500);Ye.position.set(0,1.7,14);Ye.rotation.order="YXZ";$e.add(new Ud(12440554,3817269,.85));const Sn=new xh(16773590,2.2);Sn.position.set(-38,55,22);Sn.castShadow=!0;Sn.shadow.mapSize.set(2048,2048);Sn.shadow.camera.left=-70;Sn.shadow.camera.right=70;Sn.shadow.camera.top=70;Sn.shadow.camera.bottom=-70;Sn.shadow.camera.far=160;Sn.shadow.bias=-4e-4;$e.add(Sn);const l0=new xh(8956671,.35);l0.position.set(30,20,-40);$e.add(l0);{const r=new hs(400,24,16),t=new hi({side:ci,depthWrite:!1,fog:!1,uniforms:{top:{value:new bt(4025512)},mid:{value:new bt(8890052)},bot:{value:new bt(14207400)}},vertexShader:"varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",fragmentShader:"varying vec3 vP; uniform vec3 top,mid,bot; void main(){ float h=normalize(vP).y; vec3 c=h>0.0?mix(mid,top,pow(h,0.6)):mix(mid,bot,pow(-h,0.7)); gl_FragColor=vec4(c,1.0); }"});$e.add(new Kt(r,t));const e=new Kt(new ls(14,32),new He({color:16774877,fog:!1,transparent:!0,opacity:.95}));e.position.set(-190,200,110),e.lookAt(0,0,0),$e.add(e);const i=new Kt(new ls(30,32),new He({color:16773828,fog:!1,transparent:!0,opacity:.28}));i.position.copy(e.position),i.lookAt(0,0,0),$e.add(i)}function Sh(r,t,e=1,i=1){const n=document.createElement("canvas");n.width=n.height=r,t(n.getContext("2d"),r);const s=new jc(n);return s.wrapS=s.wrapT=Pr,s.repeat.set(e,i),s.anisotropy=4,s.colorSpace=Qe,s}const IT=Sh(512,(r,t)=>{r.fillStyle="#8a8478",r.fillRect(0,0,t,t);for(let e=0;e<5200;e++)r.fillStyle=`rgba(${60+Math.random()*40|0},${58+Math.random()*36|0},${50+Math.random()*30|0},0.5)`,r.fillRect(Math.random()*t,Math.random()*t,2,2);r.strokeStyle="rgba(0,0,0,0.28)",r.lineWidth=3;for(let e=0;e<=4;e++)r.beginPath(),r.moveTo(e*t/4,0),r.lineTo(e*t/4,t),r.stroke(),r.beginPath(),r.moveTo(0,e*t/4),r.lineTo(t,e*t/4),r.stroke();r.fillStyle="rgba(70,60,40,0.25)";for(let e=0;e<14;e++)r.beginPath(),r.ellipse(Math.random()*t,Math.random()*t,20+Math.random()*50,12+Math.random()*30,Math.random()*3,0,7),r.fill()},18,18),Zp=Sh(256,(r,t)=>{r.fillStyle="#a89f8d",r.fillRect(0,0,t,t),r.fillStyle="rgba(0,0,0,0.12)";for(let e=0;e<8;e++)for(let i=0;i<4;i++)r.fillRect(i*64+e%2*32,e*32,60,28);r.fillStyle="rgba(255,255,255,0.08)",r.fillRect(0,0,t,10)},4,1),$p=Sh(256,(r,t)=>{r.fillStyle="#7a5c33",r.fillRect(0,0,t,t);for(let e=0;e<900;e++)r.fillStyle=`rgba(${90+Math.random()*50|0},${60+Math.random()*35|0},30,0.4)`,r.fillRect(Math.random()*t,Math.random()*t,3,2);r.strokeStyle="#4a3517",r.lineWidth=14,r.strokeRect(0,0,t,t),r.beginPath(),r.moveTo(0,0),r.lineTo(t,t),r.moveTo(t,0),r.lineTo(0,t),r.stroke()},1,1);function LT(r){return Sh(256,(t,e)=>{t.fillStyle=r,t.fillRect(0,0,e,e),t.fillStyle="rgba(0,0,0,0.3)";for(let i=0;i<e;i+=32)t.fillRect(i,0,10,e);t.fillStyle="rgba(255,255,255,0.12)";for(let i=5;i<e;i+=32)t.fillRect(i,0,4,e);t.fillStyle="rgba(0,0,0,0.45)",t.font="bold 34px sans-serif",t.fillText("BRUTAL",40,120),t.fillText("CARGO",55,160)},2,1)}const Xs=[];function Ul(r,t,e,i,n,s){Xs.push({min:new C(r-i/2,t-n/2,e-s/2),max:new C(r+i/2,t+n/2,e+s/2)})}const $n=new Ln;$e.add($n);function ke(r,t,e,i,n,s,a,o=!0,l=!0){const c=new Kt(new Re(r,t,e),i);return c.position.set(n,s,a),c.castShadow=l,c.receiveShadow=!0,$n.add(c),o&&Ul(n,s,a,r,t,e),c}{const r=new Kt(new mn(140,140),new Oe({map:IT,roughness:.95,metalness:.02}));r.rotation.x=-Math.PI/2,r.receiveShadow=!0,$n.add(r);const t=new Kt(new mn(16,120),new Oe({color:3948356,roughness:.9}));t.rotation.x=-Math.PI/2,t.position.y=.01,t.receiveShadow=!0,$n.add(t);for(let f=-5;f<=5;f++){const p=new Kt(new mn(.7,3),new He({color:14201146}));p.rotation.x=-Math.PI/2,p.position.set(0,.02,f*10),$n.add(p)}const e=new Oe({map:Zp,roughness:.9});ke(140,6,2,e,0,3,-60),ke(140,6,2,e,0,3,60),ke(2,6,122,e,-60,3,0),ke(2,6,122,e,60,3,0);const i=new Oe({map:$p,roughness:.85});[[-44,-44],[44,44],[-44,44],[44,-44]].forEach(([f,p])=>{ke(5,9,5,i,f,4.5,p),ke(7,.5,7,i,f,9.2,p),ke(7,1.2,.3,i,f,10,p-3.4),ke(7,1.2,.3,i,f,10,p+3.4)});const s=["#b3402e","#2e6db3","#3f8a3c","#b3892e"].map(f=>new Oe({map:LT(f),roughness:.6,metalness:.35}));[[-18,1.5,-20,0],[-18,4.1,-20,0],[18,1.5,18,1],[20,1.5,-8,0],[-24,1.5,12,1],[8,1.5,-30,0],[-8,1.5,28,0],[30,1.5,-28,1],[-32,1.5,-6,0]].forEach(([f,p,x,m],g)=>{const v=ke(12,2.6,3,s[g%4],f,p,x);m&&(v.rotation.y=Math.PI/2),Xs.pop(),Ul(f,p,x,m?3:12,2.6,m?12:3)});const o=new Oe({map:$p,roughness:.85});[[0,-12],[12,4],[-12,6],[26,8],[-28,-22],[6,22],[-6,-32],[34,30],[-36,28],[0,38]].forEach(([f,p])=>{ke(2,2,2,o,f,1,p),Math.random()>.4&&ke(2,2,2,o,f+2.1,1,p+.4),Math.random()>.6&&ke(2,2,2,o,f+.3,3,p-.2)});const c=new Oe({map:Zp,roughness:.95,color:12432542});ke(16,5,1,c,-8,2.5,-2),ke(1,5,14,c,-16,2.5,5),ke(14,1,12,c,24,4.5,-14),ke(1,4,10,c,17,2,-14),ke(1,4.5,1,c,30.5,2.25,-19.5),ke(1,4.5,1,c,30.5,2.25,-8.5),ke(1,4.5,1,c,17.5,2.25,-8.5);const h=new Oe({color:9056035,roughness:.55,metalness:.5}),d=new Oe({color:3103290,roughness:.55,metalness:.5});for(let f=0;f<16;f++){const p=new Kt(new cs(.6,.6,1.5,14),f%2?h:d),x=wi(-50,50),m=wi(-50,50);p.position.set(x,.75,m),p.castShadow=p.receiveShadow=!0,$n.add(p),Ul(x,.75,m,1.2,1.5,1.2)}const u=new Oe({color:2237995,roughness:.5,metalness:.7});[[-20,-40],[20,40],[-40,20],[40,-20]].forEach(([f,p])=>{const x=new Kt(new cs(.18,.24,13,10),u);x.position.set(f,6.5,p),x.castShadow=!0,$n.add(x);const m=new Kt(new Re(1.6,.7,.5),new Oe({color:1119e3,emissive:16772536,emissiveIntensity:1.6}));m.position.set(f,13,p),$n.add(m);const g=new gh(16770736,60,34,1.8);g.position.set(f,12.4,p),$e.add(g),Ul(f,6.5,p,.6,13,.6)})}const NT=[new C(0,0,48),new C(-40,0,30),new C(40,0,30),new C(-20,0,42)],UT=[new C(0,0,-48),new C(-45,0,-35),new C(45,0,-35),new C(20,0,-42)];function qd(r){const t=r==="blue"?NT:UT;return t[Math.floor(Math.random()*t.length)].clone()}const yn={ctx:null,master:null,init(){this.ctx||(this.ctx=new(window.AudioContext||window.webkitAudioContext),this.master=this.ctx.createGain(),this.master.gain.value=.55,this.master.connect(this.ctx.destination))},env(r,t,e,i){const n=this.ctx.createGain();n.gain.setValueAtTime(1e-4,t),n.gain.exponentialRampToValueAtTime(e,t+.005),n.gain.exponentialRampToValueAtTime(1e-4,t+i),r.connect(n),n.connect(this.master)},shot(r=!1,t=!1){if(!this.ctx)return;const e=this.ctx.currentTime,i=t?.35:.22,n=this.ctx.createBuffer(1,this.ctx.sampleRate*i,this.ctx.sampleRate),s=n.getChannelData(0);for(let c=0;c<s.length;c++)s[c]=(Math.random()*2-1)*Math.pow(1-c/s.length,2.2);const a=this.ctx.createBufferSource();a.buffer=n;const o=this.ctx.createBiquadFilter();o.type="lowpass",o.frequency.value=t?900:r?1400:3200,a.connect(o),this.env(o,e,t?.9:.7,i),a.start(e);const l=this.ctx.createOscillator();l.type="square",l.frequency.setValueAtTime(t?120:180,e),l.frequency.exponentialRampToValueAtTime(40,e+.12),this.env(l,e,.35,.14),l.start(e),l.stop(e+.16)},enemyShot(r){if(!this.ctx)return;const t=us(1-r/90,.08,.6),e=this.ctx.currentTime,i=this.ctx.createBuffer(1,this.ctx.sampleRate*.18,this.ctx.sampleRate),n=i.getChannelData(0);for(let o=0;o<n.length;o++)n[o]=(Math.random()*2-1)*Math.pow(1-o/n.length,2.5);const s=this.ctx.createBufferSource();s.buffer=i;const a=this.ctx.createBiquadFilter();a.type="lowpass",a.frequency.value=1400,s.connect(a),this.env(a,e,t,.18),s.start(e)},reload(){if(!this.ctx)return;const r=this.ctx.currentTime;[0,.16,.34].forEach((t,e)=>{const i=this.ctx.createOscillator();i.type="square",i.frequency.value=[700,420,900][e],this.env(i,r+t,.12,.07),i.start(r+t),i.stop(r+t+.09)})},hit(r=!1){if(!this.ctx)return;const t=this.ctx.currentTime,e=this.ctx.createOscillator();e.type="sine",e.frequency.value=r?880:1320,this.env(e,t,.25,r?.25:.09),e.start(t),e.stop(t+.3)},hurt(){if(!this.ctx)return;const r=this.ctx.currentTime,t=this.ctx.createOscillator();t.type="sawtooth",t.frequency.setValueAtTime(160,r),t.frequency.exponentialRampToValueAtTime(60,r+.25),this.env(t,r,.4,.3),t.start(r),t.stop(r+.32)},step(){if(!this.ctx)return;const r=this.ctx.currentTime,t=this.ctx.createBuffer(1,this.ctx.sampleRate*.07,this.ctx.sampleRate),e=t.getChannelData(0);for(let s=0;s<e.length;s++)e[s]=(Math.random()*2-1)*(1-s/e.length);const i=this.ctx.createBufferSource();i.buffer=t;const n=this.ctx.createBiquadFilter();n.type="lowpass",n.frequency.value=500,i.connect(n),this.env(n,r,.1,.07),i.start(r)}},Gs=[{name:"BR-7 ASSAULT",mag:30,reserve:120,rpm:640,dmg:26,spread:.011,adsSpread:.002,reloadT:1.7,kick:.011,range:90,auto:!0,big:!0,color:1842722},{name:"VK SMG",mag:40,reserve:160,rpm:800,dmg:19,spread:.017,adsSpread:.004,reloadT:1.4,kick:.008,range:60,auto:!0,big:!1,color:2764083}],O={mode:"menu",team:"blue",kills:0,deaths:0,hp:100,lastHurt:-99,blueScore:0,redScore:0,targetScore:30,wi:0,magAmmo:[30,40],reserveAmmo:[120,160],reloadingUntil:0,firing:!1,ads:!1,adsK:0,nextShot:0,yaw:0,pitch:0,pos:new C(0,1.7,48),vel:new C,onGround:!0,crouch:!1,bobT:0,stepT:0,recoil:0,timeLeft:300,matchOver:!1,shake:0,spectate:!1},qu={blue:"#5aa9ff",red:"#ff6b60"},Ni=new Ln;Ye.add(Ni);$e.add(Ye);Ni.position.set(.28,-.27,-.55);let Kp=[],ts,Pa,xa;function c0(r){var i;for(;Ni.children.length;){const n=Ni.children.pop();(i=n.traverse)==null||i.call(n,s=>{var a,o;(o=(a=s.geometry)==null?void 0:a.dispose)==null||o.call(a)})}Kp=[];const t=(n,s,a,o,l,c=0,h=0)=>{const d=new Kt(n,new Oe({color:s,roughness:.42,metalness:.72,emissive:c,emissiveIntensity:h}));return d.position.set(a,o,l),Ni.add(d),Kp.push(d),d};t(new Re(.07,.11,.62),r.color,0,0,-.1),t(new cs(.022,.022,.42,12),921362,0,.015,-.55).rotation.x=Math.PI/2,t(new Re(.05,.09,.16),3356220,0,-.02,.05),t(new Re(.055,.14,.09),1316120,0,-.12,.12).rotation.x=.25,t(new Re(.05,.12,.1),1316120,0,-.1,-.12),t(new Re(.02,.05,.02),1118481,0,.085,-.28),t(new Re(.05,.02,.12),r.big?9067038:1989258,0,.065,-.05);const e=t(new Re(.055,.055,.03),789776,0,.085,.02,3407752,r.big?0:.9);e.name="sight",xa=new he,xa.position.set(0,.015,-.8),Ni.add(xa),ts=new Kt(new Jr(.09,.34,8),new He({color:16766826,transparent:!0,opacity:0})),ts.position.copy(xa.position),ts.rotation.x=-Math.PI/2,Ni.add(ts),Pa=new gh(16762977,0,9,1.8),Pa.position.set(.2,-.1,-1.2),Ye.add(Pa)}c0(Gs[0]);const Ic=[];for(let r=0;r<24;r++){const t=new Zt().setFromPoints([new C,new C]),e=new Fn(t,new ui({color:16769696,transparent:!0,opacity:0}));$e.add(e),Ic.push({line:e,life:0})}function _a(r,t){const e=Ic.find(i=>i.life<=0)||Ic[0];e.line.geometry.setFromPoints([r,t]),e.line.material.opacity=.9,e.life=.09}const Jd=new Xd;$e.add(Jd);function DT(){const r=document.createElement("canvas");r.width=r.height=64;const t=r.getContext("2d"),e=t.createRadialGradient(32,32,2,32,32,30);e.addColorStop(0,"rgba(255,255,255,1)"),e.addColorStop(.55,"rgba(255,255,255,0.85)"),e.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=e,t.fillRect(0,0,64,64);const i=new jc(r);return i.colorSpace=Qe,i}const OT=DT();function Yd({count:r,life:t,speed:e,size:i,gravity:n,colors:s,alphas:a,blending:o}){const l=new Rc({duration:1.4,looping:!1,prewarm:!1,shape:new Vr,startLife:new gn(t[0],t[1]),startSpeed:new gn(e[0],e[1]),startSize:new gn(i[0],i[1]),startColor:new Vs(new be(1,1,1,1)),emissionOverTime:new ge(0),emissionBursts:[{time:0,count:new ge(r),cycle:1,interval:.01,probability:1}],worldSpace:!0,material:new He({map:OT,transparent:!0,depthWrite:!1,blending:o}),renderMode:Pt.BillBoard,behaviors:[new Hr(new zr([[new Qn(1,.85,.3,0),0]])),new Gr(new ns(s,a)),new Wr(new C(...n),new ge(1))]});return l.emitter.position.set(0,-100,0),$e.add(l.emitter),Jd.addSystem(l),l}const Ns=(r,t,e)=>new C(r,t,e),h0=Array.from({length:10},()=>Yd({count:9,life:[.2,.45],speed:[1.2,3.5],size:[.04,.08],gravity:[0,-9,0],blending:Cr,colors:[[Ns(1,.85,.4),0],[Ns(1,.4,.1),.6],[Ns(.2,.05,.02),1]],alphas:[[1,0],[1,.5],[0,1]]})),u0=Array.from({length:6},()=>Yd({count:12,life:[.25,.55],speed:[.8,2.5],size:[.06,.11],gravity:[0,-9,0],blending:es,colors:[[Ns(.65,.05,.05),0],[Ns(.3,.02,.02),1]],alphas:[[1,0],[0,1]]})),d0=Array.from({length:4},()=>Yd({count:6,life:[.5,1.1],speed:[.4,1],size:[.15,.3],gravity:[0,1.2,0],blending:es,colors:[[Ns(.5,.48,.45),0],[Ns(.35,.33,.3),1]],alphas:[[.7,0],[0,1]]}));let FT=0;function Mu(r,t,e=1){for(let i=0;i<e;i++){const n=r[FT++%r.length];n.emitter.position.copy(t),n.restart()}}function Us(r,t,e){e===10491928?Mu(u0,r,Math.max(1,Math.round(t/10))):e===5592400?Mu(d0,r,1):Mu(h0,r,Math.max(1,Math.round(t/8)))}const Dl=[];function BT(r,t){const e=new Kt(new ls(.05+Math.random()*.03,10),new He({color:1314827,transparent:!0,opacity:.65,polygonOffset:!0,polygonOffsetFactor:-2}));if(e.position.copy(r).addScaledVector(t,.02),e.lookAt(r.clone().add(t)),$e.add(e),Dl.push({m:e,life:12}),Dl.length>40){const i=Dl.shift();$e.remove(i.m)}}const ds=[],zT=["Ghost","Raptor","Wolf"],VT=["Viper","Havoc","Reaper","Jinx"],Qp=[3042739,3112905,3824282],jp=[8003616,9056035,6693410,7614490];new Oe({color:8003616,roughness:.8});const Rl=new Oe({color:2302238,roughness:.85}),kT=new Oe({color:13214078,roughness:.7});function GT(r){const t=new Ln,e=new Kt(new Re(.22,.8,.24),Rl),i=e.clone();e.position.set(-.14,.4,0),i.position.set(.14,.4,0);const n=new Kt(new Re(.55,.7,.32),new Oe({color:r,roughness:.8}));n.position.y=1.15;const s=new Kt(new Re(.6,.4,.38),Rl);s.position.y=1.15;const a=new Kt(new hs(.21,14,12),kT);a.position.y=1.72;const o=new Kt(new hs(.24,14,10,0,Math.PI*2,0,1.5),Rl);o.position.y=1.76;const l=new Kt(new Re(.16,.6,.18),Rl);l.position.set(-.37,1.2,.1);const c=l.clone();c.position.x=.37;const h=new Kt(new Re(.09,.12,.9),new Oe({color:1316120,roughness:.4,metalness:.7}));h.position.set(.2,1.25,-.4),[e,i,n,s,a,o,l,c,h].forEach(f=>{f.castShadow=!0,t.add(f)});const d=new Kt(new Re(.7,1.5,.6),new He({visible:!1}));d.position.y=1,t.add(d);const u=new Kt(new Re(.45,.45,.45),new He({visible:!1}));return u.position.y=1.72,t.add(u),{group:t,legL:e,legR:i,bodyBox:d,headBox:u,gunTip:h}}function HT(r,t){const e=document.createElement("canvas");e.width=256,e.height=64;const i=e.getContext("2d"),n=t==="blue"?"rgba(30,90,180,0.88)":"rgba(180,40,30,0.88)";i.fillStyle=n,i.beginPath(),i.roundRect(28,8,200,40,10),i.fill(),i.fillStyle="#fff",i.font="bold 26px sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText(r.toUpperCase(),128,29);const s=new jc(e);s.colorSpace=Qe;const a=new gd(new Zc({map:s,depthTest:!1,transparent:!0}));return a.scale.set(1.5,.375,1),a.position.y=2.2,a.renderOrder=5,a}const WT=[...zT.map((r,t)=>({name:r,team:"blue",accent:Qp[t%Qp.length]})),...VT.map((r,t)=>({name:r,team:"red",accent:jp[t%jp.length]}))];WT.forEach((r,t)=>{const e=GT(r.accent);e.group.add(HT(r.name,r.team));const i=new Kt(new ls(.55,20),new He({color:r.team==="blue"?3837183:16729144,transparent:!0,opacity:.75}));i.rotation.x=-Math.PI/2,i.position.y=.03,e.group.add(i),$e.add(e.group),ds.push({name:r.name,team:r.team,...e,ring:i,hp:100,alive:!0,respawnAt:0,pos:qd(r.team),yaw:0,speed:wi(3.2,4.6),state:"seek",strafeDir:1,strafeT:0,nextBurst:wi(1,3),burstLeft:0,nextBotShot:0,walkT:Math.random()*9,gunCd:0}),e.group.position.copy(ds[t].pos)});function f0(r,t,e){r.y<e/2+0&&(r.y=e/2),r.y>30&&(r.y=30),r.x=us(r.x,-58,58),r.z=us(r.z,-58,58);const i=new C(r.x-t,r.y-e/2,r.z-t),n=new C(r.x+t,r.y+e/2,r.z+t);for(const s of Xs)if(n.x>s.min.x&&i.x<s.max.x&&n.y>s.min.y&&i.y<s.max.y&&n.z>s.min.z&&i.z<s.max.z){const a=n.x-s.min.x,o=s.max.x-i.x,l=n.z-s.min.z,c=s.max.z-i.z,h=Math.min(a,o,l,c);h===a?r.x=s.min.x-t:h===o?r.x=s.max.x+t:h===l?r.z=s.min.z-t:r.z=s.max.z+t,i.set(r.x-t,r.y-e/2,r.z-t),n.set(r.x+t,r.y+e/2,r.z+t)}return r}function XT(r,t){const e=t.clone().sub(r),i=e.length();e.normalize();const n=Math.ceil(i/1.5),s=r.clone();for(let a=1;a<n;a++){s.copy(r).addScaledVector(e,i*a/n);for(const o of Xs)if(s.x>o.min.x&&s.x<o.max.x&&s.y>o.min.y&&s.y<o.max.y&&s.z>o.min.z&&s.z<o.max.z)return!1}return!0}const hn={};addEventListener("keydown",r=>{hn[r.code]=!0,r.code==="KeyR"&&Ju(),r.code==="Digit1"&&tm(0),r.code==="Digit2"&&tm(1),r.code==="KeyC"&&(O.crouch=!O.crouch),["Space","Tab"].includes(r.code)&&r.preventDefault()});addEventListener("keyup",r=>hn[r.code]=!1);addEventListener("mousemove",r=>{if(document.pointerLockElement!==Ge.domElement||O.mode!=="playing")return;const t=O.ads?9e-4:.0021;O.yaw-=r.movementX*t,O.pitch-=r.movementY*t,O.pitch=us(O.pitch,-1.45,1.45)});addEventListener("mousedown",r=>{if(O.mode==="playing"){if(document.pointerLockElement!==Ge.domElement){Ge.domElement.requestPointerLock();return}r.button===0&&(O.firing=!0),r.button===2&&(O.ads=!0)}});addEventListener("mouseup",r=>{r.button===0&&(O.firing=!1),r.button===2&&(O.ads=!1)});addEventListener("contextmenu",r=>r.preventDefault());document.addEventListener("pointerlockchange",()=>{document.pointerLockElement!==Ge.domElement&&O.mode==="playing"&&!O.matchOver&&Po("Paused — click to resume")});Ge.domElement.addEventListener("click",()=>{O.mode==="playing"&&document.pointerLockElement!==Ge.domElement&&Ge.domElement.requestPointerLock()});function Po(r,t=2200){fa.textContent=r,fa.style.opacity=1,clearTimeout(fa._t),fa._t=setTimeout(()=>fa.style.opacity=0,t)}function p0(r){const t=document.createElement("div");t.className="feed",t.innerHTML=r;const e=de("killfeed");for(e.prepend(t);e.children.length>5;)e.lastChild.remove();setTimeout(()=>{t.style.opacity=0,setTimeout(()=>t.remove(),400)},4200)}const Ne=de("minimap").getContext("2d");function qT(){Ne.clearRect(0,0,170,170),Ne.fillStyle="rgba(10,16,22,0.9)",Ne.fillRect(0,0,170,170);const r=(i,n)=>[85+i*(80/60),85+n*(80/60)];Ne.strokeStyle="rgba(255,255,255,0.25)",Ne.strokeRect(6,6,158,158),Ne.fillStyle="#8a8478",Xs.slice(4,14).forEach(i=>{const[n,s]=r(i.min.x,i.min.z),[a,o]=r(i.max.x,i.max.z);Ne.fillRect(n,s,a-n,o-s)}),ds.forEach(i=>{if(!i.alive)return;const[n,s]=r(i.pos.x,i.pos.z);Ne.fillStyle=i.team==="blue"?"#5aa9ff":"#ff3b30",Ne.beginPath(),Ne.arc(n,s,4,0,7),Ne.fill()});const[t,e]=r(O.pos.x,O.pos.z);Ne.save(),Ne.translate(t,e),Ne.rotate(-O.yaw),Ne.fillStyle="#37e08b",Ne.beginPath(),Ne.moveTo(0,-7),Ne.lineTo(5,5),Ne.lineTo(-5,5),Ne.closePath(),Ne.fill(),Ne.restore()}const Si=new kg,Me=new C,bu=new C,JT=new C;function tm(r){r===O.wi||O.reloadingUntil>performance.now()/1e3||(O.wi=r,O.firing=!1,c0(Gs[r]),de("wname").textContent=Gs[r].name,de("slot1").classList.toggle("active",r===0),de("slot2").classList.toggle("active",r===1),yn.reload(),Mh())}function Mh(){de("ammo").innerHTML=`${O.magAmmo[O.wi]} <small>/ ${O.reserveAmmo[O.wi]}</small>`}function Ju(){const r=Gs[O.wi];O.magAmmo[O.wi]===r.mag||O.reserveAmmo[O.wi]<=0||O.reloadingUntil>performance.now()/1e3||(O.reloadingUntil=performance.now()/1e3+r.reloadT,yn.reload(),Po("Reloading…",900))}function YT(){const t=Gs[O.wi].mag-O.magAmmo[O.wi],e=Math.min(t,O.reserveAmmo[O.wi]);O.magAmmo[O.wi]+=e,O.reserveAmmo[O.wi]-=e,Mh()}function Yu(r){const t=de("hitmarker");t.classList.remove("show","kill"),t.offsetWidth,r&&t.classList.add("kill"),t.classList.add("show")}function ZT(r){const t=Gs[O.wi];if(O.magAmmo[O.wi]<=0){Ju(),O.nextShot=r+.25;return}O.magAmmo[O.wi]--;const e=O.ads?t.adsSpread:t.spread+Ol()*.02;Si.setFromCamera(new st(wi(-e,e)*60,wi(-e,e)*60),Ye),Si.far=t.range+60;let i=null,n=1e9,s=!1,a=null,o=1e9;ds.forEach(u=>{if(!u.alive)return;const f=Si.intersectObjects([u.headBox,u.bodyBox],!1);f.length&&(u.team==="red"?f[0].distance<n&&(i=u,n=f[0].distance,s=f[0].object===u.headBox):f[0].distance<o&&(a=u,o=f[0].distance))});let l=1e9,c=null,h=null;{const u=Si.ray.origin,f=Si.ray.direction;if(f.y<-.001){const p=-u.y/f.y;p>0&&p<l&&(l=p,c=u.clone().addScaledVector(f,p),h=new C(0,1,0))}for(const p of Xs){const x=new je(p.min,p.max),m=new C;if(Si.ray.intersectBox(x,m)){const g=m.distanceTo(u);g<l&&(l=g,c=m.clone(),h=new C(0,0,1))}}}const d=new C;if(xa.getWorldPosition(d),a&&o<n&&o<l)_a(d,bu.copy(Si.ray.origin).addScaledVector(Si.ray.direction,o)),r-em>2.5&&(em=r,Po(`${a.name} is on your team — friendly fire off`));else if(i&&n<l){const u=(s?t.dmg*2:t.dmg)*us(1-n/(t.range*2.2),.45,1);i.hp-=u,Us(Me.copy(Si.ray.origin).addScaledVector(Si.ray.direction,n),8,10491928),_a(d,bu.copy(Si.ray.origin).addScaledVector(Si.ray.direction,n)),i.hp<=0&&i.alive?(O.kills++,m0(i,9999,{name:"YOU",team:"blue",isPlayer:!0},s,!0)):(Yu(!1),yn.hit(!1))}else c?(Us(c,7,16764040),Us(c,4,5592400),h&&BT(c,h),_a(d,c)):_a(d,bu.copy(Si.ray.origin).addScaledVector(Si.ray.direction,90));ts.material.opacity=.95,ts.rotation.z=Math.random()*6,ts.scale.setScalar(wi(.8,1.4)),Pa.intensity=26,O.recoil+=t.kick,O.shake=Math.min(.5,O.shake+.12),O.pitch=us(O.pitch+t.kick*.35,-1.45,1.45),yn.shot(!1,t.big),Mh(),O.magAmmo[O.wi]===0&&Ju()}let em=-99;function im(r,t){return r==="YOU"?"#37e08b":t==="blue"?qu.blue:qu.red}function Zd(){de("blueScore").textContent=O.blueScore,de("redScore").textContent=O.redScore,de("kd").textContent=`${O.kills}K / ${O.deaths}D`}function m0(r,t,e,i=!1,n=!1){if(!r.alive||O.matchOver||(n||(r.hp-=t),r.hp>0))return;r.alive=!1,r.hp=0,r.respawnAt=performance.now()/1e3+3,r.group.rotation.x=-Math.PI/2,r.group.position.y=.25,e.team==="blue"?O.blueScore++:O.redScore++,Zd();const s=im(e.name,e.team),a=im(r.name,r.team);p0(`<b style="color:${s}">${e.name}</b> ${i?"🎯 HEADSHOT":"☠"} <b style="color:${a}">${r.name}</b>`),Us(r.pos.clone().add(new C(0,1.3,0)),16,10491928),(e.isPlayer||e.name==="YOU")&&(Yu(!0),yn.hit(!0)),O.blueScore>=O.targetScore?br("blue"):O.redScore>=O.targetScore&&br("red")}function $T(r,t){O.matchOver||O.mode!=="playing"||(O.hp-=r,O.lastHurt=performance.now()/1e3,Jp.style.opacity=us(.4+r/40,0,.95),setTimeout(()=>Jp.style.opacity=0,180),yn.hurt(),O.shake=Math.min(.7,O.shake+.2),O.hp<=0&&(O.hp=0,O.deaths++,O.redScore++,Zd(),p0(`<b style="color:${qu.red}">${(t==null?void 0:t.name)||"RED"}</b> ☠ <b style="color:#37e08b">YOU</b>`),Po("You were eliminated — redeploying with BLUE…"),O.hp=100,O.pos.copy(qd("blue")).add(new C(0,1.7,0)),O.vel.set(0,0,0),O.redScore>=O.targetScore&&br("red")))}function Ol(){return(hn.ShiftLeft||hn.ShiftRight)&&hn.KeyW?1:0}function bh(r=!1){var t,e;yn.init(),O.spectate=r,O.mode="playing",PT.style.display="none",o0.style.display="none",a0.classList.add("on"),r||(e=(t=Ge.domElement).requestPointerLock)==null||e.call(t),Po(r?"Spectating 4v4 — BLUE vs RED":"Fight for BLUE. First team to 30."),de("loading").textContent="",Zd()}de("playBtn").onclick=()=>bh(!1);de("specBtn").onclick=()=>bh(!0);de("againBtn").onclick=()=>location.reload();function br(r){var i;if(O.matchOver)return;O.matchOver=!0,(i=document.exitPointerLock)==null||i.call(document);const t=r==="blue",e=r==="draw";de("endKicker").textContent=e?"STALEMATE":t?"STRIKE ZONE SECURED":"MISSION FAILED",de("endTitle").textContent=e?"DRAW":t?"VICTORY":"DEFEAT",de("endTitle").style.background=e?"linear-gradient(180deg,#fff,#ffd76a)":t?"linear-gradient(180deg,#fff,#37e08b)":"linear-gradient(180deg,#fff,#ff3b30)",de("endSub").textContent=`BLUE ${O.blueScore} • ${O.redScore} RED — you went ${O.kills}K / ${O.deaths}D • ${g0(O.timeLeft)} left`,setTimeout(()=>{o0.style.display="flex",a0.classList.remove("on")},600)}function g0(r){return r=Math.max(0,Math.ceil(r)),`${Math.floor(r/60)}:${String(r%60).padStart(2,"0")}`}const nm=new Bd;let wu=0,Tu=0,sm=0;function x0(){requestAnimationFrame(x0),nm.update();const r=Math.min(nm.getDelta(),.05),t=performance.now()/1e3;if(Jd.update(r),Ic.forEach(e=>{e.life>0&&(e.life-=r,e.line.material.opacity=Math.max(0,e.life/.09)*.9)}),Dl.forEach(e=>{e.life-=r,e.life<3&&(e.m.material.opacity=Math.max(0,e.life/3)*.8)}),ts.material.opacity*=.6,Pa.intensity*=.55,O.mode==="playing"&&!O.matchOver&&(O.timeLeft-=r,de("timer").textContent=g0(O.timeLeft),O.timeLeft<=0&&(O.blueScore>O.redScore?br("blue"):O.redScore>O.blueScore?br("red"):br("draw"))),O.mode==="playing"&&(O.spectate||Pc.has("autostart"))){const e=t*.12;Ye.position.set(Math.sin(e)*42,15+Math.sin(e*.6)*4,Math.cos(e)*42),Ye.lookAt(0,2,0),Ni.visible=!1,Pc.has("autostart")&&O.spectate===!1&&O.mode}else Ni.visible=!0,O.mode==="playing"&&KT(r,t);eE(r,t),QT(r,t),t-O.lastHurt>4&&O.hp<100&&O.mode==="playing"&&!O.matchOver?(O.hp=Math.min(100,O.hp+r*14),Yp.style.opacity=.5):Yp.style.opacity=0,de("healthfill").style.width=O.hp+"%",de("healthnum").textContent=Math.ceil(O.hp),de("healthfill").style.background=O.hp>60?"linear-gradient(90deg,#37e08b,#b6ff5e)":O.hp>30?"linear-gradient(90deg,#ffb454,#ff7a1a)":"linear-gradient(90deg,#ff3b30,#ff7a1a)",qT(),wu+=r,Tu++,t-sm>.5&&(de("fps").textContent=`${Math.round(Tu/wu)} fps • ${Ge.info.render.triangles/1e3|0}k tris`,wu=0,Tu=0,sm=t),Ge.render($e,Ye)}function KT(r,t){const e=Gs[O.wi];O.spectate&&document.pointerLockElement&&(O.spectate=!1),Ye.rotation.set(O.pitch+O.recoil*2.2,O.yaw,0),O.recoil*=Math.pow(1e-4,r),O.shake*=Math.pow(.001,r),Ye.position.copy(O.pos),Ye.position.y+=Math.sin(O.bobT)*(Ol()?.05:.028),Ye.position.x+=(Math.random()-.5)*O.shake*.06,Ye.position.y+=(Math.random()-.5)*O.shake*.06,O.reloadingUntil&&t>=O.reloadingUntil&&(O.reloadingUntil=0,YT()),(O.firing||O.ads)&&!O.matchOver&&t>=O.nextShot&&!O.reloadingUntil&&(ZT(t),O.nextShot=t+60/e.rpm,e.auto||(O.firing=!1));const n=O.crouch?2.6:Ol()?8.6:5.4,s=new C(-Math.sin(O.yaw),0,-Math.cos(O.yaw)),a=new C(-s.z,0,s.x),o=new C;hn.KeyW&&o.add(s),hn.KeyS&&o.sub(s),hn.KeyD&&o.add(a),hn.KeyA&&o.sub(a),o.lengthSq()>0&&o.normalize();const l=O.onGround?46:12;O.vel.x+=o.x*l*r,O.vel.z+=o.z*l*r;const c=O.onGround?Math.pow(1e-4,r):Math.pow(.05,r);o.lengthSq()||(O.vel.x*=c,O.vel.z*=c);const h=n,d=Math.hypot(O.vel.x,O.vel.z);d>h&&(O.vel.x*=h/d,O.vel.z*=h/d),O.vel.y-=16*r,hn.Space&&O.onGround&&(O.vel.y=5.4,O.onGround=!1),O.pos.addScaledVector(O.vel,r);const u=O.crouch?1.15:1.7;O.pos.y<=u&&(O.pos.y=u,O.vel.y=0,O.onGround=!0),f0(O.pos,.42,O.crouch?1.2:1.7),d>1&&O.onGround&&(O.bobT+=r*(4+d*1.1),O.stepT+=r*d,O.stepT>2.4&&(O.stepT=0,yn.step())),O.adsK+=((O.ads?1:0)-O.adsK)*Math.min(1,r*12);const f=O.adsK;Ni.position.set(.28*(1-f)+0*f,-.27*(1-f)-.185*f,-.55-.12*f),Ye.fov=78-22*f+Ol()*3,Ye.updateProjectionMatrix(),de("crosshair").style.opacity=f>.5?0:1-O.recoil*8}function QT(r,t){const e=t;Ni.rotation.set(Math.sin(O.bobT*.5)*.008+O.recoil*1.4,Math.sin(e*1.3)*.004,0),Ni.position.y+=Math.sin(O.bobT*2)*.0012,Ni.position.x+=Math.cos(O.bobT)*.0012}function jT(r){let t=null,e=1e9,i=!1;const n=(s,a,o)=>{const l=Me.copy(s).sub(r.pos);l.y=0;const c=l.length();c<e&&(e=c,t=a,i=o)};r.team==="red"&&O.mode==="playing"&&!O.spectate&&!O.matchOver&&n(O.pos,null,!0);for(const s of ds)s===r||!s.alive||s.team===r.team||n(s.pos.clone().add(new C(0,1.2,0)),s,!1);return t?{ref:t,dist:e,isPlayer:i}:null}function tE(r,t){return Me.copy(t).sub(r).length()>70?!1:XT(r,t)}function eE(r,t){const e=JT.copy(O.pos);let i=1,n=0;for(const s of ds){if(!s.alive){t>s.respawnAt&&!O.matchOver?(s.alive=!0,s.hp=100,s.pos.copy(qd(s.team)),s.group.rotation.x=0,s.group.position.copy(s.pos),s.group.visible=!0):s.group.visible=t%.6<.4;continue}s.team==="blue"?i++:n++,s.walkT+=r*6;const a=new C(s.pos.x,1.6,s.pos.z),o=jT(s);let l=null,c=null,h=!1,d=!1,u=1e9;if(o){const v=o.isPlayer?e:o.ref.pos.clone().add(new C(0,1.3,0));u=o.dist,tE(a,v)?(d=!0,l=v,c=o.ref,h=o.isPlayer):l=o.isPlayer?e.clone():o.ref.pos.clone()}else l=new C(0,1,0);Me.copy(l).sub(s.pos),Me.y=0;const f=Me.length();Me.normalize();let p=new C;if(d&&f<14?(s.strafeT-=r,s.strafeT<=0&&(s.strafeDir*=-1,s.strafeT=wi(.7,1.8)),p.addScaledVector(new C(-Me.z,0,Me.x),s.strafeDir*.9),f<7?p.addScaledVector(Me,-.9):f>12&&p.addScaledVector(Me,.7)):(p.add(Me),s.strafeT=0),p.lengthSq()>0){p.normalize(),Me.copy(s.pos).addScaledVector(p,1.4),Me.y=1;let v=!1;for(const w of Xs)if(Me.x>w.min.x&&Me.x<w.max.x&&Me.y>w.min.y&&Me.y<w.max.y&&Me.z>w.min.z&&Me.z<w.max.z){v=!0;break}v&&p.applyAxisAngle(new C(0,1,0),1.1),s.pos.addScaledVector(p,s.speed*r),f0(s.pos,.42,1.7);{Me.copy(s.pos).sub(O.pos),Me.y=0;const w=Me.length();w>.001&&w<1.1&&s.pos.addScaledVector(Me.normalize(),(1.1-w)*.8);for(const _ of ds){if(_===s||!_.alive)continue;Me.copy(s.pos).sub(_.pos),Me.y=0;const b=Me.length();b>.001&&b<.9&&s.pos.addScaledVector(Me.normalize(),(.9-b)*.5)}}s.pos.y=0,s.legL.rotation.x=Math.sin(s.walkT*2)*.6,s.legR.rotation.x=-Math.sin(s.walkT*2)*.6}const x=d?Math.atan2(-(l.x-s.pos.x),-(l.z-s.pos.z)):Math.atan2(-p.x,-p.z);s.group.rotation.y=x,s.group.position.copy(s.pos);const m=h&&!O.spectate,g=!h&&c&&c.alive;if(s.nextBurst-=r,d&&O.mode==="playing"&&!O.matchOver&&(m||g)&&u<55&&(s.nextBurst<=0&&s.burstLeft<=0&&(s.burstLeft=3+(Math.random()*3|0),s.nextBurst=wi(.7,1.8)),s.burstLeft>0&&(s.nextBotShot-=r,s.nextBotShot<=0))){s.nextBotShot=.16,s.burstLeft--;const v=h?Math.hypot(O.vel.x,O.vel.z):2,w=us(.42-u/130-v/40,.06,.4),_=new C(s.pos.x,1.45,s.pos.z),b=l.clone().add(new C(wi(-1,1),wi(-.5,.5),wi(-1,1)));_a(_,b),Us(l.clone(),2,16768409),yn.enemyShot(u),Math.random()<w&&(h?$T(wi(7,15),s):c.alive&&(Us(l.clone(),5,10491928),m0(c,wi(9,18),s,!1)))}}de("blueAlive").textContent=i,de("redAlive").textContent=n}addEventListener("resize",()=>{Ye.aspect=innerWidth/innerHeight,Ye.updateProjectionMatrix(),Ge.setSize(innerWidth,innerHeight)});de("loading").textContent="engine ready — 60fps target • WebGL2 • procedural audio";Mh();x0();window.__game={state:O,bots:ds,THREE:vw,ready:!0,fx:{burst:Us},pools:{sparkPool:h0,bloodPool:u0,dustPool:d0}};Pc.has("autostart")&&bh(!0);var rm;if(Pc.has("fp")){bh(!1),O.spectate=!1,O.pos.set(0,1.7,50),O.yaw=Math.PI,O.pitch=.02,O.yaw=0,O.pitch=.03;try{(rm=document.exitPointerLock)==null||rm.call(document)}catch{}}
