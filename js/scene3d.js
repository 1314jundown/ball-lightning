(function scene3d(){
const T = window.THREE;
const stage = document.getElementById('stage');
const cv = document.getElementById('stage3d');
const concepts = document.getElementById('concepts');
const btn = document.getElementById('btnHumanScale');
if (!T || !stage || !cv || !concepts) return;
const CFG = {
fov: 50,
dist: 12.8,          // 相机到注视点的距离
el: 0.062,           // 俯角（弧度）：接近人眼高度，地平线落在 44% 处
az: 0.0,
lookY: 2.0,          // 注视点高度＝等离子球心高度
human: { x: -2.90, z: 4.20, ry: 0.62 },  // 观察者站位：左三分之一、离镜头最近的一格
ringR: 3.55,         // 约束环半径
ringY: 2.0,          // 约束环中心高度（对齐等离子球心）
moteCount: 2600
};
let renderer;
try {
renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: 'high-performance' });
} catch (_) { return; }   /* 没有 WebGL 就安静退出，03 退回到纯粒子层 */
renderer.setClearAlpha(0);
if ('outputColorSpace' in renderer && T.SRGBColorSpace) renderer.outputColorSpace = T.SRGBColorSpace;
renderer.toneMapping = T.NoToneMapping;
const scene = new T.Scene();
const camera = new T.PerspectiveCamera(CFG.fov, 1, 0.1, 400);
const ACCENT = { value: new T.Color(0x8fc4ff) };   // 概念换色时改这里
const dot = (function () {
const c = document.createElement('canvas');
c.width = c.height = 64;
const g = c.getContext('2d');
const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
grd.addColorStop(0, 'rgba(255,255,255,1)');
grd.addColorStop(0.35, 'rgba(255,255,255,.62)');
grd.addColorStop(1, 'rgba(255,255,255,0)');
g.fillStyle = grd;
g.fillRect(0, 0, 64, 64);
const t = new T.CanvasTexture(c);
if (T.SRGBColorSpace) t.colorSpace = T.SRGBColorSpace;
return t;
})();
const groundMat = new T.ShaderMaterial({
transparent: false,
depthWrite: true,
uniforms: {
uTime: { value: 0 },
uColor: { value: new T.Color(0x2f5c95) },
uRing: { value: new T.Color(0x9fd0ff) }
},
vertexShader: `
varying vec2 vW;
void main(){
vec4 wp = modelMatrix * vec4(position, 1.0);
vW = wp.xz;
gl_Position = projectionMatrix * viewMatrix * wp;
}`,
fragmentShader: `
precision highp float;
varying vec2 vW;
uniform float uTime;
uniform vec3 uColor, uRing;
float gridLine(vec2 p, float s, float w){
vec2 f = abs(fract(p / s - 0.5) - 0.5);
return smoothstep(w, 0.0, min(f.x, f.y));
}
void main(){
float d = length(vW);
float fade = smoothstep(58.0, 5.0, d);
float w1 = 0.010 + d * 0.0016;
float w2 = 0.020 + d * 0.0032;
float line = max(gridLine(vW, 1.0, w1) * 0.34, gridLine(vW, 5.0, w2) * 0.78);
float pool = smoothstep(9.0, 0.0, d) * 0.085;
float r1 = smoothstep(0.055, 0.0, abs(d - 3.55)) * 0.62;
float r2 = smoothstep(0.045, 0.0, abs(d - 6.90)) * 0.30;
float sweep = smoothstep(0.0, 1.0, sin(uTime * 0.9 - d * 0.55) * 0.5 + 0.5) * 0.06;
vec3 base = vec3(0.014, 0.021, 0.038);
vec3 col = base + uColor * line * fade + uColor * pool + uRing * (r1 + r2) * fade + uColor * sweep * fade;
col *= mix(1.0, 0.34, smoothstep(18.0, 62.0, d));
gl_FragColor = vec4(col, 1.0);
}`
});
const ground = new T.Mesh(new T.PlaneGeometry(400, 400), groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);
const holoMat = new T.ShaderMaterial({
transparent: true,
depthWrite: true,
side: T.FrontSide,
uniforms: { uTime: { value: 0 }, uColor: { value: new T.Color(0x9ec8ff) } },
vertexShader: `
varying vec3 vN;
varying vec3 vV;
varying float vY;
void main(){
vec4 wp = modelMatrix * vec4(position, 1.0);
vec4 mv = viewMatrix * wp;
vY = wp.y;
vN = normalize(normalMatrix * normal);
vV = normalize(-mv.xyz);
gl_Position = projectionMatrix * mv;
}`,
fragmentShader: `
precision highp float;
varying vec3 vN;
varying vec3 vV;
varying float vY;
uniform float uTime;
uniform vec3 uColor;
void main(){
vec3 N = normalize(vN);
vec3 V = normalize(vV);
float f = pow(1.0 - abs(dot(N, V)), 2.3);
vec3 L = normalize(vec3(-0.30, 0.42, 0.86));
float lam = max(dot(N, L), 0.0);
float scan = smoothstep(0.70, 1.0, fract(vY * 24.0 - uTime * 0.30)) * 0.12;
float foot = smoothstep(-0.05, 0.12, vY);
vec3 col = uColor * (0.62 + lam * 0.42) + uColor * f * 1.35 + uColor * scan * 2.4;
float a = (0.62 + lam * 0.16 + f * 0.34 + scan * 1.4) * foot;
gl_FragColor = vec4(col, min(a, 0.97));
}`
});
function capsule(r, len, seg) {
return new T.CapsuleGeometry(r, len, 4, seg || 12);
}
function part(geo, x, y, z, sx, sy, sz, rz) {
const m = new T.Mesh(geo, holoMat);
m.position.set(x, y, z);
if (sx != null) m.scale.set(sx, sy == null ? sx : sy, sz == null ? sx : sz);
if (rz) m.rotation.z = rz;
return m;
}
const viewer = new T.Group();            /* 人体 + 标尺 */
const body = new T.Group();
viewer.add(body);
body.add(part(new T.SphereGeometry(0.104, 18, 14), 0, 1.586, 0, 1, 1.14, 0.94));
body.add(part(capsule(0.040, 0.055, 10), 0, 1.462, 0));                    /* 颈 */
body.add(part(capsule(0.132, 0.255, 14), 0, 1.185, 0, 1.26, 1, 0.80));     /* 躯干 */
body.add(part(capsule(0.104, 0.045, 14), 0, 0.905, 0, 1.18, 1, 0.86));     /* 胯 */
body.add(part(new T.SphereGeometry(0.070, 12, 10), -0.183, 1.408, 0, 1, 0.86, 0.86));
body.add(part(new T.SphereGeometry(0.070, 12, 10), 0.183, 1.408, 0, 1, 0.86, 0.86));
body.add(part(capsule(0.047, 0.215), -0.206, 1.245, 0.004, 1, 1, 0.92, 0.05));
body.add(part(capsule(0.047, 0.215), 0.206, 1.245, 0.004, 1, 1, 0.92, -0.05));
body.add(part(capsule(0.040, 0.205), -0.222, 0.985, 0.010, 1, 1, 0.92, 0.02));
body.add(part(capsule(0.040, 0.205), 0.222, 0.985, 0.010, 1, 1, 0.92, -0.02));
body.add(part(new T.SphereGeometry(0.048, 10, 8), -0.228, 0.845, 0.014, 1, 1.35, 0.66));
body.add(part(new T.SphereGeometry(0.048, 10, 8), 0.228, 0.845, 0.014, 1, 1.35, 0.66));
body.add(part(capsule(0.074, 0.290), -0.086, 0.660, 0, 1, 1, 0.94));
body.add(part(capsule(0.074, 0.290), 0.086, 0.660, 0, 1, 1, 0.94));
body.add(part(capsule(0.058, 0.285), -0.090, 0.335, 0.004, 1, 1, 0.94));
body.add(part(capsule(0.058, 0.285), 0.090, 0.335, 0.004, 1, 1, 0.94));
body.add(part(new T.BoxGeometry(0.098, 0.056, 0.235), -0.090, 0.030, 0.062));
body.add(part(new T.BoxGeometry(0.098, 0.056, 0.235), 0.090, 0.030, 0.062));
const rulerMat = new T.MeshBasicMaterial({
color: 0xa8cdff, transparent: true, opacity: 0.72,
blending: T.AdditiveBlending, depthWrite: false
});
const ruler = new T.Group();
const RX = -0.52;
ruler.add(new T.Mesh(new T.BoxGeometry(0.006, 1.70, 0.006), rulerMat).translateY(0.85).translateX(RX));
for (let i = 0; i <= 17; i++) {
const y = i * 0.1;
const major = i % 5 === 0;
const g = new T.BoxGeometry(major ? 0.135 : 0.062, 0.005, 0.005);
const m = new T.Mesh(g, rulerMat);
m.position.set(RX + (major ? 0.067 : 0.031), y, 0);
ruler.add(m);
}
body.add(ruler);
const haloMat = new T.MeshBasicMaterial({
color: 0x7fb4ff, transparent: true, opacity: 0.30,
blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide
});
const halo = new T.Mesh(new T.RingGeometry(0.205, 0.232, 48), haloMat);
halo.rotation.x = -Math.PI / 2;
halo.position.y = 0.004;
viewer.add(halo);
const halo2 = new T.Mesh(new T.RingGeometry(0.285, 0.294, 48), haloMat.clone());
halo2.material.opacity = 0.11;
halo2.rotation.x = -Math.PI / 2;
halo2.position.y = 0.004;
viewer.add(halo2);
viewer.position.set(CFG.human.x, 0, CFG.human.z);
viewer.rotation.y = CFG.human.ry;
scene.add(viewer);
let tagEl = null;
const tmpV = new T.Vector3();
function syncTag() {
if (!tagEl) {
tagEl = document.createElement('div');
tagEl.className = 'stage-3d-tag';
tagEl.textContent = '1.70 m';
stage.appendChild(tagEl);
}
if (!S.humanOn) { tagEl.style.opacity = '0'; return; }
ruler.localToWorld(tmpV.set(0, 1.70, 0));
tmpV.project(camera);
const r = stage.getBoundingClientRect();
tagEl.style.opacity = tmpV.z > 1 ? '0' : '1';
tagEl.style.left = ((tmpV.x * 0.5 + 0.5) * r.width).toFixed(1) + 'px';
tagEl.style.top = ((-tmpV.y * 0.5 + 0.5) * r.height).toFixed(1) + 'px';
}
const ringGroup = new T.Group();
ringGroup.position.set(0, CFG.ringY, 0);
scene.add(ringGroup);
const ringMats = [];
function ring(radius, tube, tilt, spin, yaw, op) {
const mat = new T.MeshBasicMaterial({
color: 0x8fc0ff, transparent: true, opacity: op,
blending: T.AdditiveBlending, depthWrite: false
});
const m = new T.Mesh(new T.TorusGeometry(radius, tube, 3, 220), mat);
m.rotation.set(0, yaw, tilt);
m.userData.spin = spin;
ringMats.push(mat);
ringGroup.add(m);
return m;
}
ring(CFG.ringR, 0.0090, 1.36, 0.06, 0.35, 0.50);
ring(CFG.ringR * 0.76, 0.0070, 0.72, -0.045, 1.1, 0.30);
const MN = CFG.moteCount;
const mPos = new Float32Array(MN * 3);
const mSeed = new Float32Array(MN);
for (let i = 0; i < MN; i++) {
const a = Math.random() * Math.PI * 2;
const rr = 1.2 + Math.pow(Math.random(), 0.62) * 7.4;
mPos[i * 3] = Math.cos(a) * rr;
mPos[i * 3 + 1] = Math.pow(Math.random(), 1.5) * 7.2 + 0.05;
mPos[i * 3 + 2] = Math.sin(a) * rr * 0.72 + 1.6;
mSeed[i] = Math.random() * 100;
}
const moteGeo = new T.BufferGeometry();
moteGeo.setAttribute('position', new T.BufferAttribute(mPos, 3));
const moteMat = new T.PointsMaterial({
map: dot, color: 0xa9cdff, size: 0.055, sizeAttenuation: true,
transparent: true, opacity: 0.55, blending: T.AdditiveBlending,
depthWrite: false
});
const motes = new T.Points(moteGeo, moteMat);
scene.add(motes);
const P = { az: CFG.az, el: CFG.el, dist: CFG.dist, pan: 0 };
const T_ = { az: CFG.az, el: CFG.el, dist: CFG.dist };
let panTarget = 0;
function measureShift() {
const orb = stage.querySelector('.stage-center');
if (!orb) return;
const sr = stage.getBoundingClientRect();
const or2 = orb.getBoundingClientRect();
if (!sr.width) return;
const frac = (or2.left + or2.width / 2 - sr.left) / sr.width - 0.5;
const tanH = Math.tan(CFG.fov * Math.PI / 360) * (sr.width / Math.max(1, sr.height));
panTarget = frac * 2 * tanH;
}
function resize() {
const w = stage.clientWidth || 1, h = stage.clientHeight || 1;
renderer.setSize(w, h, false);
camera.aspect = w / h;
camera.updateProjectionMatrix();
measureShift();
}
resize();
addEventListener('resize', resize);
if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);
let mx = 0, my = 0;
stage.addEventListener('pointermove', function (e) {
const r = stage.getBoundingClientRect();
mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
my = ((e.clientY - r.top) / r.height - 0.5) * 2;
});
stage.addEventListener('pointerleave', function () { mx = 0; my = 0; });
const TINT = {
storm: 0x5f93c4, ball: 0x8fc4ff, macro: 0xa98fe0, nucleus: 0x8f9ae8,
bubble: 0x63bcc6, quantum: 0xa586e0, transition: 0x6aa4d8,
fusion: 0xd07a92, observer: 0x7f92e0, rose: 0xc98fc8
};
let accent = new T.Color(TINT.ball);
function applyAccent(hex) {
accent.setHex(hex);
ACCENT.value.copy(accent);
ringMats.forEach(m => m.color.copy(accent));
holoMat.uniforms.uColor.value.copy(accent).lerp(new T.Color(0xffffff), 0.35);
moteMat.color.copy(accent).lerp(new T.Color(0xffffff), 0.25);
groundMat.uniforms.uRing.value.copy(accent);
}
applyAccent(TINT.ball);
const clock = new T.Clock();
let raf = null, t = 0;
const visible = () => !!concepts.classList.contains('on') && concepts.offsetParent !== null;
function frame() {
raf = requestAnimationFrame(frame);
if (!visible()) { raf = null; return; }
const dt = Math.min(0.05, clock.getDelta());
t += dt;
P.az += ((T_.az + mx * 0.10) - P.az) * Math.min(1, dt * 3.2);
P.el += ((T_.el + my * 0.055) - P.el) * Math.min(1, dt * 3.2);
P.dist += (T_.dist - P.dist) * Math.min(1, dt * 4.0);
P.pan += (panTarget - P.pan) * Math.min(1, dt * 3.0);
const ce = Math.cos(P.el), se = Math.sin(P.el);
camera.position.set(
Math.sin(P.az) * ce * P.dist,
CFG.lookY + se * P.dist,
Math.cos(P.az) * ce * P.dist
);
camera.lookAt(0, CFG.lookY, 0);
camera.rotateY(P.pan);
groundMat.uniforms.uTime.value = t;
holoMat.uniforms.uTime.value = t;
ringGroup.children.forEach(m => { m.rotation.z += m.userData.spin * dt; });
const arr = moteGeo.attributes.position.array;
for (let i = 0; i < MN; i++) {
const iy = i * 3 + 1;
arr[iy] += dt * (0.06 + (mSeed[i] % 1) * 0.10);
if (arr[iy] > 7.4) arr[iy] = 0.05;
const ix = i * 3;
arr[ix] += Math.sin(t * 0.30 + mSeed[i]) * dt * 0.055;
}
moteGeo.attributes.position.needsUpdate = true;
renderer.render(scene, camera);
syncTag();
}
function start() { if (raf == null) { clock.getDelta(); raf = requestAnimationFrame(frame); } }
const S = { humanOn: true };
function setHuman(on) {
S.humanOn = !!on;
viewer.visible = S.humanOn;
concepts.classList.toggle('human-on', S.humanOn);
if (btn) {
btn.setAttribute('aria-pressed', S.humanOn ? 'true' : 'false');
const txt = btn.querySelector('.txt');
if (txt) txt.textContent = S.humanOn ? '3D 等身人 · 1.70 m' : '开启 3D 等身人';
}
}
setHuman(true);
if (btn) btn.addEventListener('click', function () { setHuman(!S.humanOn); });
window.__stage3D = {
scene: function (k) { applyAccent(TINT[k] || TINT.ball); start(); },
human: setHuman,
on: function () { resize(); start(); },
cam: function (d) { T_.dist = Math.max(7.5, Math.min(22, d)); start(); }
};
start();
})();