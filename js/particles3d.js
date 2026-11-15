function initCoverParticles(opts = {}) {
const canvas = opts.canvas || document.getElementById('pg');
if (!canvas || !window.PARTICLE_CLOUDS) return;
const THREE = window.THREE;
if (!THREE) { console.error('particles3d: window.THREE 未加载（vendor/three.bundle.js）'); return; }
document.body.classList.add('pg-on');
if (/(?:^|[?&])cover=1(?:&|$)/.test(location.search)) {
document.body.classList.remove('prologue-active', 'cover-intro');
document.body.classList.add('cover-reveal');
const _pr = document.getElementById('prologue'); if (_pr) _pr.style.display = 'none';
const _ip = document.getElementById('introPrompt'); if (_ip) _ip.style.display = 'none';
}
const SHAPES = ['ball', 'parents', 'rose', 'string'];
const DATA = window.PARTICLE_CLOUDS;
function decode(cloud) {
const n = cloud.n;
const raw = Uint8Array.from(atob(cloud.b64), c => c.charCodeAt(0));
const pos = new Float32Array(n * 3);
const shade = new Float32Array(n);
for (let i = 0; i < n; i++) {
pos[i * 3] = raw[i * 4] / 255 * 1.2 - 0.6;
pos[i * 3 + 1] = raw[i * 4 + 1] / 255 * 1.2 - 0.6;
pos[i * 3 + 2] = raw[i * 4 + 2] / 255 * 1.2 - 0.6;
shade[i] = raw[i * 4 + 3] / 255;
}
return { n, pos, shade };
}
const CLOUD = {};
for (const k of SHAPES) CLOUD[k] = decode(DATA[k]);
const M = Math.max(...SHAPES.map(k => CLOUD[k].n));
const BALL_R = (() => {
const c = CLOUD.ball, pos = c.pos;
let mx = 0;
for (let i = 0; i < c.n; i++) {
const x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
const r2 = x * x + y * y + z * z;
if (r2 > mx) mx = r2;
}
return Math.sqrt(mx) || 0.6;
})();
const PRESETS = {
plasma: {
label: '电浆',
grad: [[0.06, 0.12, 0.42], [0.34, 0.56, 1.00], [0.62, 0.84, 1.00], [1.00, 1.00, 1.00]],
thr: [0.40, 0.76],
haloCol: [0.72, 0.86, 1.00],
haloAmt: 0.34,
cold: [0.22, 0.52, 1.00],
warm: [0.86, 0.52, 1.00],
gain: 2.20,
pxMax: 9.0,
bloom: 0.68,
bright: 0.46,
spin: 0.075,
flicker: 0.42
},
ember: {
label: '炭火',
grad: [[0.62, 0.07, 0.02], [1.00, 0.32, 0.05], [1.00, 0.68, 0.18], [1.00, 0.95, 0.74]],
thr: [0.40, 0.80],
haloCol: [1.00, 0.60, 0.22],
haloAmt: 0.03,
cold: [1.00, 0.40, 0.12],
warm: [1.00, 0.84, 0.42],
gain: 1.62,
pxMax: 8.0,
bloom: 0.50,
bright: 0.68,
spin: 0.045,
flicker: 0.70
},
abyss: {
label: '深渊',
grad: [[0.00, 0.06, 0.11], [0.02, 0.36, 0.41], [0.34, 0.92, 0.86], [0.95, 1.00, 1.00]],
thr: [0.36, 0.72],
haloCol: [0.32, 0.94, 0.90],
haloAmt: 0.34,
cold: [0.08, 0.52, 0.60],
warm: [0.72, 1.00, 0.96],
gain: 1.74,
pxMax: 4.6,
bloom: 0.68,
bright: 0.72,
spin: 0.135,
flicker: 0.24
}
};
const FX_ORDER = ['plasma', 'ember', 'abyss'];
const LOOK = {
scale: 4.51,           // 球整体放大倍数：投影直径 ≈ 518px @1920（参考图硬边实测 r=259，圆心 960,395）
ballPx: 1.35,           // 球形态基础点径（乘 dpr）—— 参考图的火花是 1~3px，不是 6px
ballPxMax: 4.2,        // 球形态点径上限（轮廓处会 ×2.9）
ballAlpha: 2.20,        // 球形态每点 alpha 基准
rimPow: 2.2,           // 边缘增亮曲线，越大壳越薄
coreCol: [1.00, 0.55, 0.16],  // 暖核渐变色
coreAmt: 1.00,
camX: 0.06,               // 相机注视点的水平偏移（负=球偏右）
camY: -0.40,           // 垂直偏移（负=球偏上）；-0.40 让球心落在画面高 38% 处（参考图 40.8%）
dist: 4.05,            // 默认机位距离
arcAmt: 8.00,           // 电弧层整体强度
streak: 0.95,          // 横向拉丝强度（0 = 关）
streakTint: [0.80, 0.90, 1.00]
};
const VS = `
attribute vec3 aB;
attribute float aShade;
attribute float aShadeB;
attribute float aExist;
attribute float aExistB;
attribute float aId;
uniform float uProg, uTime, uPx, uPxMax, uShadeOn, uString, uBurn, uSplit;
uniform float uIdle, uBreathe, uFlicker, uRepel, uShock, uArcOn;
uniform float uScale, uRimPow, uBallR, uJit;
uniform vec3 uEye, uMouse;
uniform vec2 uShockC;
varying float vFade;
varying float vShade;
varying float vHeat;
varying float vDim;
varying float vFlick;
varying float vLimb;
varying float vWarm;
varying vec3 vNrm;
float hash(float x){ return fract(sin(x * 12.9898) * 43758.5453); }
vec3 swirl(vec3 p, float t){
return vec3(sin(p.y * 3.1 + t * 0.7), sin(p.z * 2.7 + t * 0.6), sin(p.x * 2.9 + t * 0.8)) * 0.5;
}
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn2(vec2 p){
vec2 i = floor(p), f = fract(p);
f = f * f * (3.0 - 2.0 * f);
float a = h21(i), b = h21(i + vec2(1.0, 0.0));
float c = h21(i + vec2(0.0, 1.0)), d = h21(i + vec2(1.0, 1.0));
return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
void main(){
vec3 a = position;
vec3 b = aB;
float sA = aShade;
float sB = aShadeB;
float idf = aId;
float r = hash(floor(a.y * 7.0) * 13.1 + floor(a.x * 5.0) * 7.3 + floor(a.z * 5.0) * 3.7);
float d = clamp((uProg - r * 0.16) / 0.84, 0.0, 1.0);
d = d * d * (3.0 - 2.0 * d);
d = min(1.0, d + 0.10 * sin(d * 3.14159265));
vec3 p = mix(a, b, d);
float mid = sin(d * 3.14159265);
p += swirl(p, uTime) * mid * (0.10 + 0.09 * uFlicker);
float ca = cos(uIdle), sa = sin(uIdle);
p.xz = mat2(ca, sa, -sa, ca) * p.xz;
p *= 1.0 + uBreathe * 0.010 * sin(uTime * 0.85 + p.y * 2.2);
if (uString > 0.5 && uString < 1.5) {
p += vec3(sin(uTime * 1.10 + p.y * 5.2), sin(uTime * 1.45 + p.z * 4.6), sin(uTime * 0.95 + p.x * 5.6)) * 0.026;
}
float burnHeat = 0.0, tailFade = 1.0;
if (uBurn > 0.0) {
float k = hash(idf + 11.3);
float sweep = clamp((p.x + 0.85) / 1.7, 0.0, 1.0);
float t0 = sweep * 0.55 + hash(floor(p.x*5.0)*13.7 + floor(p.y*4.0)*7.3 + floor(p.z*5.0)*3.1) * 0.34 + 0.11 * k;
t0 = mix(t0, 0.80 + 0.20 * t0, step(uSplit, idf));
float life = uBurn - t0;
float front = uBurn * 1.7 - 0.85;
burnHeat = clamp(1.0 - abs(p.x - front) * 5.0, 0.0, 1.0);
if (life > 0.0) {
float f = clamp(life / 0.46, 0.0, 1.0);
float e2 = f * sqrt(f);
p.y += e2 * (0.30 + 0.22 * k);
p.x += (k - 0.5) * e2 * 0.16;
p.z += (hash(idf + 7.1) - 0.5) * e2 * 0.16;
tailFade = pow(1.0 - f, 1.35);
burnHeat = max(burnHeat, 0.45 + 0.45 * (1.0 - f));
}
}
p += vec3(hash(idf * 1.13 + 3.7) - 0.5,
hash(idf * 2.71 + 8.1) - 0.5,
hash(idf * 3.97 + 5.3) - 0.5) * 0.0026;
p *= uScale;
float ballW = max(uBallR * uScale, 1e-4);
if (uRepel > 0.001) {
vec2 q = p.xy / ballW;
vec2 e = vec2(0.06, 0.0);
vec2 flow = vec2(vn2(q + e.yx) - vn2(q - e.yx),
-(vn2(q + e.xy) - vn2(q - e.xy)));   // 2D curl：无散度，不改变体积
float rr = length((p.xy - uMouse.xy) / ballW);
float infl = exp(-rr * rr * 1.5) * uRepel;
p.xy += flow * infl * ballW * 1.10;
p.z  += (vn2(q * 1.6 + 7.3) - 0.5) * infl * ballW * 0.22;
}
if (uShock > 0.001) {
float age = 1.0 - uShock;
float rad = age * ballW * 1.9;
vec2 dv = p.xy - uShockC;
float dl = length(dv);
float band = exp(-pow((dl - rad) * (3.4 / ballW), 2.0));
p.xy += normalize(dv + 1e-5) * band * ballW * 0.16 * uShock;
}
float dist = length(p - uEye);
vec4 mv = viewMatrix * vec4(p, 1.0);
gl_Position = projectionMatrix * mv;
if (uJit > 0.0) {
float js = fract(aId * 0.6180339887);
a.x += (js - 0.5) * uJit;
a.y += (fract(js * 13.7) - 0.5) * uJit;
a.z += (fract(js * 7.3) - 0.5) * uJit;
}
vec3 nrm = normalize(a + 1e-5);
float facing = dot(nrm, normalize(uEye - a + 1e-5));
vNrm = nrm;
float rnd = fract(sin(aId * 78.233) * 43758.5453);
float rr = length(a) / max(uBallR, 1e-4) + (rnd - 0.5) * 0.12;
float limb = pow(1.0 - abs(facing), max(uRimPow, 0.2))
* mix(0.52, 1.0, smoothstep(0.30, 0.95, rr)) * (0.75 + 0.55 * rnd);
float pxSize = uPx * 3.0 / max(dist, 0.3);
if (uShadeOn < 0.5) pxSize *= (1.0 + limb * 1.9);
gl_PointSize = clamp(pxSize, 1.0, uPxMax);
float ex = mix(aExist, aExistB, d);
vec3 an = a / max(uBallR, 1e-4);
float warmW = smoothstep(0.60, 0.02, length(vec2(an.x * 1.35, (an.y + 0.50) * 2.10)) * 0.55);
float field = 0.5
+ 0.20 * sin(a.x * 7.1 + uTime * 0.40) * sin(a.y * 6.3 - uTime * 0.30)
+ 0.16 * sin(a.z * 8.7 + uTime * 0.52) * sin(a.x * 5.9 + uTime * 0.22)
+ 0.09 * sin((a.x + a.y + a.z) * 11.3 + uTime * 0.85);
float rest = clamp(0.06 + 0.74 * field + 0.30 * max(0.0, facing), 0.0, 1.0);
vLimb = limb;
vWarm = clamp(warmW, 0.0, 1.0);
vHeat = max(mid, mix(rest, max(sA, sB), uShadeOn));
vHeat = max(vHeat, burnHeat);
float arc = 0.0;
if (uArcOn > 0.5) {
float seed = hash(idf * 1.37 + 0.11);
float ph = fract(uTime * 0.53 + seed * 7.13);
float flash = smoothstep(0.945, 1.0, ph);
arc = flash * (0.62 + 0.38 * sin(uTime * 34.0 + seed * 40.0));
}
vHeat = max(vHeat, arc);
vShade = mix(sA, sB, d);
vFlick = 1.0 + uFlicker * 0.55 * sin(uTime * 6.7 + hash(idf * 2.11) * 62.0);
vFade = (uShadeOn > 0.5 ? 1.0 : smoothstep(0.45, 1.55, dist)) * tailFade * ex;
vDim = 1.0;
}`;
const FS = `
varying float vFade;
varying float vShade;
varying float vHeat;
varying float vDim;
varying float vFlick;
varying float vLimb;
varying float vWarm;
varying vec3 vNrm;
uniform vec3 uCold, uWarm;
uniform vec3 uG1, uG2, uG3, uG4, uHaloCol;
uniform vec3 uCoreCol;
uniform float uShadeOn, uColorOn, uHalo;
uniform float uThr1, uThr2, uGain, uHaloAmt, uAlphaMul, uCoreAmt;
void main(){
float d = length(gl_PointCoord - 0.5) * 2.0;
if (d > 1.0) discard;
float dirW = clamp(dot(normalize(vNrm + 1e-5), normalize(vec3(-0.52, 0.64, 0.56))), 0.0, 1.0);
float am = uShadeOn < 0.5 ? (0.012 + 4.30 * pow(clamp(vLimb, 0.0, 1.0), 3.2) + 0.30 * clamp(vWarm, 0.0, 1.0)) * (0.55 + 1.40 * dirW) : 1.0;
float a = smoothstep(1.0, 0.35, d) * vFade * uAlphaMul * am;
if (a <= 0.0) discard;
if (uHalo > 0.5) {
vec3 hc = mix(uHaloCol, uCoreCol, clamp(vWarm, 0.0, 1.0) * uCoreAmt);
float g = pow(max(0.0, 1.0 - d), 2.0) * uHaloAmt * vFade * vFlick;
gl_FragColor = vec4(hc * g, g);
return;
}
vec3 c;
if (uShadeOn < 0.5) {
float t = clamp(vHeat, 0.0, 1.0);
vec3 rim = t < uThr1 ? mix(uG1, uG2, t / uThr1)
: t < uThr2 ? mix(uG2, uG3, (t - uThr1) / (uThr2 - uThr1))
: mix(uG3, uG4, (t - uThr2) / (1.0 - uThr2));
float l = clamp(vLimb, 0.0, 1.0);
float w = clamp(vWarm, 0.0, 1.0);
c = rim * (0.70 + 3.10 * pow(l, 1.7));
c = mix(c, vec3(1.0, 0.985, 0.96), pow(l, 4.0) * 0.92);
c = mix(c, uCoreCol * (0.30 + 1.10 * w), w * uCoreAmt);
} else {
c = mix(uCold, uWarm, vHeat) * (0.45 + 0.75 * vShade);
}
c *= uGain * vFlick;
gl_FragColor = vec4(c, a);
}`;
const QUAD_VS = `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;
const BRIGHT_FS = `
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uThr;
void main(){
vec4 s = texture2D(uTex, vUv);
float a = s.a;
vec3 c = s.rgb / max(a, 1e-3);
float l = max(c.r, max(c.g, c.b));
float k = max(0.0, l - uThr) / max(1.0 - uThr, 0.001);
gl_FragColor = vec4(c * k * a, 1.0);
}`;
const BLUR_FS = `
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uDir;
void main(){
vec3 c = texture2D(uTex, vUv).rgb * 0.227027;
c += (texture2D(uTex, vUv + uDir * 1.3846153846).rgb
+ texture2D(uTex, vUv - uDir * 1.3846153846).rgb) * 0.3162162162;
c += (texture2D(uTex, vUv + uDir * 3.2307692308).rgb
+ texture2D(uTex, vUv - uDir * 3.2307692308).rgb) * 0.0702702703;
gl_FragColor = vec4(c, 1.0);
}`;
const COMP_FS = `
varying vec2 vUv;
uniform sampler2D uScene, uBloom, uStreak;
uniform float uAmt, uStreakAmt;
uniform vec3 uStreakTint;
void main(){
vec4 s = texture2D(uScene, vUv);
vec3 b = texture2D(uBloom, vUv).rgb;
vec3 st = texture2D(uStreak, vUv).rgb * uStreakTint * uStreakAmt;
vec3 add = s.rgb + b * uAmt + st;
float m = max(add.r, max(add.g, add.b));
float a = clamp(max(s.a, m), 0.0, 1.0);
gl_FragColor = vec4(a > 1e-4 ? add / a : vec3(0.0), a);
}`;
let renderer;
try {
renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, premultipliedAlpha: false });
} catch (e) {
console.error('particles3d: WebGLRenderer 创建失败', e);
canvas.style.display = 'none';
return;
}
renderer.setClearColor(0x000000, 0);
renderer.autoClear = true;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
const cam = { yaw: 0, ty: 0, pitch: 0, tp: 0, dist: LOOK.dist, lookX: LOOK.camX, lookY: LOOK.camY,
px: 0, py: 0, tpx: 0, tpy: 0 };  // __parallax：指针驱动的轻微让位
let dpr_ = 1;
const eye = new THREE.Vector3();
const quadScene = new THREE.Scene();
const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const quadGeo = new THREE.PlaneGeometry(2, 2);
const quadMesh = new THREE.Mesh(quadGeo, null);
quadMesh.frustumCulled = false;
quadScene.add(quadMesh);
function quadMat(fs, uniforms) {
return new THREE.ShaderMaterial({
uniforms: uniforms,
vertexShader: QUAD_VS,
fragmentShader: fs,
depthTest: false,
depthWrite: false,
blending: THREE.NoBlending
});
}
const brightMat = quadMat(BRIGHT_FS, { uTex: { value: null }, uThr: { value: 0.4 } });
const streakBrightMat = quadMat(BRIGHT_FS, { uTex: { value: null }, uThr: { value: 0.6 } });
const blurMat = quadMat(BLUR_FS, { uTex: { value: null }, uDir: { value: new THREE.Vector2() } });
const streakBlurMat = quadMat(BLUR_FS, { uTex: { value: null }, uDir: { value: new THREE.Vector2() } });
const compMat = quadMat(COMP_FS, {
uScene: { value: null }, uBloom: { value: null }, uStreak: { value: null },
uAmt: { value: 1.0 }, uStreakAmt: { value: 0.0 },
uStreakTint: { value: new THREE.Vector3(0.85, 0.92, 1.0) }
});
let rtScene = null, rtA = null, rtB = null, rtS1 = null, rtS2 = null, bloomOK = false;
let lowMode = false;
let fps = 0;
let bloomForce = null;
function rtOpts(withDepth) {
return {
minFilter: THREE.LinearFilter,
magFilter: THREE.LinearFilter,
format: THREE.RGBAFormat,
type: THREE.UnsignedByteType,
depthBuffer: !!withDepth,
stencilBuffer: false
};
}
function allocTargets() {
const w = Math.max(2, canvas.width | 0);
const h = Math.max(2, canvas.height | 0);
try {
if (rtScene) rtScene.dispose();
if (rtA) rtA.dispose();
if (rtB) rtB.dispose();
if (rtS1) rtS1.dispose();
if (rtS2) rtS2.dispose();
rtScene = new THREE.WebGLRenderTarget(w, h, rtOpts(true));
const bw = Math.max(2, Math.floor(w / 4));
const bh = Math.max(2, Math.floor(h / 4));
rtA = new THREE.WebGLRenderTarget(bw, bh, rtOpts(false));
rtB = new THREE.WebGLRenderTarget(bw, bh, rtOpts(false));
const sw = Math.max(2, Math.floor(w / 8));
const sh = Math.max(2, Math.floor(h / 8));
rtS1 = new THREE.WebGLRenderTarget(sw, sh, rtOpts(false));
rtS2 = new THREE.WebGLRenderTarget(sw, sh, rtOpts(false));
bloomOK = true;
} catch (e) {
console.warn('particles3d: bloom 渲染目标创建失败，退回单趟直出', e);
bloomOK = false;
rtScene = rtA = rtB = rtS1 = rtS2 = null;
}
}
function resize() {
const dpr = Math.min(window.devicePixelRatio || 1, 2);
const w = canvas.clientWidth, h = canvas.clientHeight;
renderer.setPixelRatio(dpr);
renderer.setSize(w, h, false);
dpr_ = dpr;
camera.aspect = canvas.width / canvas.height;
camera.updateProjectionMatrix();
allocTargets();
}
const A_POS = new Float32Array(M * 3);
const A_B = new Float32Array(M * 3);
const A_SHADE = new Float32Array(M);
const A_SHADE_B = new Float32Array(M);
const A_EXIST = new Float32Array(M);
const A_EXIST_B = new Float32Array(M);
const A_ID = new Float32Array(M);
for (let i = 0; i < M; i++) A_ID[i] = i;
const geo = new THREE.BufferGeometry();
const attrPos = new THREE.BufferAttribute(A_POS, 3);
const attrB = new THREE.BufferAttribute(A_B, 3);
const attrShade = new THREE.BufferAttribute(A_SHADE, 1);
const attrShadeB = new THREE.BufferAttribute(A_SHADE_B, 1);
const attrExist = new THREE.BufferAttribute(A_EXIST, 1);
const attrExistB = new THREE.BufferAttribute(A_EXIST_B, 1);
attrPos.setUsage(THREE.DynamicDrawUsage);
attrB.setUsage(THREE.DynamicDrawUsage);
attrShade.setUsage(THREE.DynamicDrawUsage);
attrShadeB.setUsage(THREE.DynamicDrawUsage);
attrExist.setUsage(THREE.DynamicDrawUsage);
attrExistB.setUsage(THREE.DynamicDrawUsage);
geo.setAttribute('position', attrPos);
geo.setAttribute('aB', attrB);
geo.setAttribute('aShade', attrShade);
geo.setAttribute('aShadeB', attrShadeB);
geo.setAttribute('aExist', attrExist);
geo.setAttribute('aExistB', attrExistB);
geo.setAttribute('aId', new THREE.BufferAttribute(A_ID, 1));
geo.setDrawRange(0, M);
function setPair(src, dst) {
const A = CLOUD[SHAPES[src]], B = CLOUD[SHAPES[dst]];
for (let i = 0; i < M; i++) {
const hasA = i < A.n, hasB = i < B.n;
const ia = hasA ? i * 3 : (hasB ? i * 3 : 0);
const ib = hasB ? i * 3 : (hasA ? i * 3 : 0);
if (hasA) {
A_POS[i * 3] = A.pos[ia]; A_POS[i * 3 + 1] = A.pos[ia + 1]; A_POS[i * 3 + 2] = A.pos[ia + 2];
A_SHADE[i] = A.shade[i];
} else if (hasB) {
A_POS[i * 3] = B.pos[ib]; A_POS[i * 3 + 1] = B.pos[ib + 1]; A_POS[i * 3 + 2] = B.pos[ib + 2];
A_SHADE[i] = B.shade[i];
} else {
A_POS[i * 3] = 0; A_POS[i * 3 + 1] = 0; A_POS[i * 3 + 2] = 0;
A_SHADE[i] = 0;
}
if (hasB) {
A_B[i * 3] = B.pos[ib]; A_B[i * 3 + 1] = B.pos[ib + 1]; A_B[i * 3 + 2] = B.pos[ib + 2];
A_SHADE_B[i] = B.shade[i];
} else if (hasA) {
A_B[i * 3] = A.pos[ia]; A_B[i * 3 + 1] = A.pos[ia + 1]; A_B[i * 3 + 2] = A.pos[ia + 2];
A_SHADE_B[i] = A.shade[i];
} else {
A_B[i * 3] = 0; A_B[i * 3 + 1] = 0; A_B[i * 3 + 2] = 0;
A_SHADE_B[i] = 0;
}
A_EXIST[i] = hasA ? 1 : 0;
A_EXIST_B[i] = hasB ? 1 : 0;
}
attrPos.needsUpdate = true;
attrB.needsUpdate = true;
attrShade.needsUpdate = true;
attrShadeB.needsUpdate = true;
attrExist.needsUpdate = true;
attrExistB.needsUpdate = true;
}
function makeMaterial(halo) {
return new THREE.ShaderMaterial({
uniforms: {
uProg: { value: 1 },
uTime: { value: 0 },
uPx: { value: 1 },
uPxMax: { value: 6 },
uShadeOn: { value: 0 },
uString: { value: 0 },
uBurn: { value: 0 },
uSplit: { value: 0 },
uEye: { value: new THREE.Vector3() },
uCold: { value: new THREE.Vector3(1, 1, 1) },
uWarm: { value: new THREE.Vector3(1, 1, 1) },
uColorOn: { value: 0 },
uHalo: { value: halo ? 1 : 0 },
uG1: { value: new THREE.Vector3(1, 1, 1) },
uG2: { value: new THREE.Vector3(1, 1, 1) },
uG3: { value: new THREE.Vector3(1, 1, 1) },
uG4: { value: new THREE.Vector3(1, 1, 1) },
uHaloCol: { value: new THREE.Vector3(1, 1, 1) },
uThr1: { value: 0.45 },
uThr2: { value: 0.80 },
uGain: { value: 1.3 },
uHaloAmt: { value: 0.4 },
uAlphaMul: { value: 1 },
uIdle: { value: 0 },
uBreathe: { value: 1 },
uFlicker: { value: 0.4 },
uRepel: { value: 0 },
uShock: { value: 0 },
uShockC: { value: new THREE.Vector2() },
uMouse: { value: new THREE.Vector3() },
uArcOn: { value: 1 },
uScale: { value: 1 },
uRimPow: { value: 1.5 },
uBallR: { value: BALL_R },
uJit: { value: 0 },
uCoreCol: { value: new THREE.Vector3(1.0, 0.52, 0.16) },
uCoreAmt: { value: 0.9 }
},
vertexShader: VS,
fragmentShader: FS,
transparent: true,
depthTest: true,
depthWrite: true,
depthFunc: THREE.LessDepth,
blending: THREE.CustomBlending,
blendEquation: THREE.AddEquation,
blendSrc: THREE.SrcAlphaFactor,
blendDst: halo ? THREE.OneFactor : THREE.OneMinusSrcAlphaFactor,
blendEquationAlpha: THREE.AddEquation,
blendSrcAlpha: THREE.SrcAlphaFactor,
blendDstAlpha: halo ? THREE.OneFactor : THREE.OneMinusSrcAlphaFactor
});
}
const matMain = makeMaterial(false);
const matHalo = makeMaterial(true);
const ptsMain = new THREE.Points(geo, matMain);
const ptsHalo = new THREE.Points(geo, matHalo);
ptsMain.frustumCulled = false;
ptsHalo.frustumCulled = false;
ptsMain.renderOrder = 0;
ptsHalo.renderOrder = 1;               // 光晕永远画在实心点之后
const ptsMainB = new THREE.Points(geo, matMain);
ptsMainB.frustumCulled = false;
ptsMainB.renderOrder = ptsMain.renderOrder;
ptsMain.onBeforeRender = function () { matMain.uniforms.uJit.value = 0.0; };
ptsMainB.onBeforeRender = function () { matMain.uniforms.uJit.value = 0.020; };
scene.add(ptsMain, ptsHalo, ptsMainB);
const orbMat = new THREE.ShaderMaterial({
uniforms: {
uRimCol: { value: new THREE.Color(0.90, 0.96, 1.00) },
uCoreCol: { value: new THREE.Color(0.10, 0.26, 0.68) },
uAmt: { value: 1.0 },
uPow: { value: 2.2 }
},
vertexShader: [
'varying vec3 vN;',
'varying vec3 vP;',
'void main(){',
'  vN = normalize(normalMatrix * normal);',
'  vec4 mv = modelViewMatrix * vec4(position, 1.0);',
'  vP = mv.xyz;',
'  gl_Position = projectionMatrix * mv;',
'}'
].join('\n'),
fragmentShader: [
'uniform vec3 uRimCol;',
'uniform vec3 uCoreCol;',
'uniform float uAmt;',
'uniform float uPow;',
'varying vec3 vN;',
'varying vec3 vP;',
'void main(){',
'  vec3 V = normalize(-vP);',
'  float f = 1.0 - clamp(dot(normalize(vN), V), 0.0, 1.0);',
'  float rim = pow(f, uPow);',
'  float body = pow(f, 0.7) * 0.10;',
'  vec3 N = normalize(vN);',
'  float side = clamp(0.34 + 0.80*N.x + 0.52*N.y, 0.0, 1.0);',
'  vec3 c = uCoreCol * body + uRimCol * rim * 2.30 * side;',
'  float halo = pow(f, 0.75) * 0.16 * side;',
'  float a = clamp(rim * 0.95 * side + halo + body * 1.6, 0.0, 1.0) * uAmt;',
'  gl_FragColor = vec4(c * a, a);',
'}'
].join('\n'),
transparent: true,
blending: THREE.AdditiveBlending,
depthTest: false,
depthWrite: false
});
const orb = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), orbMat);
orb.renderOrder = 2;
orb.frustumCulled = false;
scene.add(orb);
const ARC_VS = `
attribute float aT;
attribute float aSeed;
uniform float uTime, uScale, uArcAmt, uPx;
varying float vGlow;
varying float vTip;
void main(){
vec3 p = position * uScale;
float head = fract(uTime * 0.85 + aSeed * 5.13);
float d = aT - head;
d -= floor(d + 0.5);
float pulse = smoothstep(0.20, 0.0, abs(d));
float tail = smoothstep(0.0, 0.55, d) * 0.30;
float base = 1.30 + 0.25 * sin(uTime * 11.0 + aSeed * 47.0);
vGlow = clamp(base + pulse * 1.10 + tail, 0.0, 1.8) * uArcAmt;
vTip = step(0.55, fract(aSeed * 3.7)) * 0.85;
vec4 mv = viewMatrix * vec4(p, 1.0);
gl_Position = projectionMatrix * mv;
float pxs = (1.5 + pulse * 2.4) * (1.0 + vTip * 0.35);
gl_PointSize = clamp(pxs * uPx, 1.0, 26.0);
}`;
const ARC_FS = `
varying float vGlow;
varying float vTip;
uniform vec3 uArcCore, uArcTip;
void main(){
vec2 q = gl_PointCoord - 0.5;
float r = length(q) * 2.0;
if (r > 1.0) discard;
float fall = 1.0 - r;
fall *= fall;
vec3 c = mix(uArcCore, uArcTip, vTip);
float a = clamp(vGlow, 0.0, 1.0) * fall;
if (a <= 0.002) discard;
gl_FragColor = vec4(c * a, a);
}`;
function mulberry32(a) {
return function () {
a |= 0; a = a + 0x6D2B79F5 | 0;
let t = Math.imul(a ^ a >>> 15, 1 | a);
t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
}
function buildArcs() {
const rand = mulberry32(20261114);
const P = [], T = [], S = [];
const N_ARC = 11, SEG = 22;
const SAMP = 6;
function push(a, b, ta, tb, seed) {
for (let i = 0; i < SAMP; i++) {
const k = i / SAMP;
P.push(a.x + (b.x - a.x) * k, a.y + (b.y - a.y) * k, a.z + (b.z - a.z) * k);
T.push(ta + (tb - ta) * k);
S.push(seed);
}
}
function walk(start, dir, segs, r0, r1, t0, t1, seed, depth) {
let p = start.clone();
const d = dir.clone();
let prev = p.clone();
for (let s = 1; s <= segs; s++) {
d.x += (rand() - 0.5) * 0.75;
d.y += (rand() - 0.5) * 0.75;
d.z += (rand() - 0.5) * 0.75;
d.normalize();
const k = s / segs;
const rr = r0 + (r1 - r0) * k + (rand() - 0.5) * BALL_R * 0.08;
p.addScaledVector(d, BALL_R * 0.11).normalize().multiplyScalar(rr);
const t = t0 + (t1 - t0) * k;
push(prev, p, t0 + (t1 - t0) * ((s - 1) / segs), t, seed);
prev.copy(p);
if (depth < 2 && s > 3 && s < segs - 3 && rand() < 0.16) {
const bd = d.clone().add(new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).multiplyScalar(1.4)).normalize();
walk(p.clone(), bd, 5 + Math.floor(rand() * 5), rr, rr - BALL_R * 0.12, t, 1.0, rand(), depth + 1);
}
}
}
for (let i = 0; i < N_ARC; i++) {
const seed = rand();
const th = rand() * Math.PI * 2;
const ph = Math.acos(2 * rand() - 1);
const st = new THREE.Vector3(
Math.sin(ph) * Math.cos(th),
Math.cos(ph),
Math.sin(ph) * Math.sin(th)
).multiplyScalar(BALL_R * (0.80 + rand() * 0.16));
const dir = new THREE.Vector3(rand() - 0.5, rand() - 0.5, rand() - 0.5).normalize();
walk(st, dir, SEG, BALL_R * (0.86 + rand() * 0.08), BALL_R * (0.97 + rand() * 0.06), 0.0, 1.0, seed, 0);
}
const g = new THREE.BufferGeometry();
g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
g.setAttribute('aT', new THREE.Float32BufferAttribute(T, 1));
g.setAttribute('aSeed', new THREE.Float32BufferAttribute(S, 1));
return g;
}
const arcMat = new THREE.ShaderMaterial({
uniforms: {
uTime: { value: 0 },
uScale: { value: 1 },
uArcAmt: { value: 1 },
uArcCore: { value: new THREE.Vector3(0.55, 0.80, 1.0) },
uArcTip: { value: new THREE.Vector3(1.0, 0.72, 0.38) },
uPx: { value: 1.0 }
},
vertexShader: ARC_VS,
fragmentShader: ARC_FS,
transparent: true,
depthTest: false,
depthWrite: false,
blending: THREE.AdditiveBlending
});
const arcs = new THREE.Points(buildArcs(), arcMat);
arcs.frustumCulled = false;
arcs.renderOrder = 2;
scene.add(arcs);
const ARC_R_VS = `
attribute vec3 aDir;
attribute float aSide, aWidth, aT, aIdx;
uniform float uTime, uScale;
uniform vec3 uEye;
varying float vT, vGlow, vIdx;
void main(){
vec3 p = position * uScale;
vec3 dv = normalize(aDir + 1e-6);
vec3 vw = normalize(uEye - p);
vec3 sd = cross(dv, vw);
float sl = length(sd);
sd = sl > 1e-5 ? sd / sl : vec3(0.0, 1.0, 0.0);
p += sd * aWidth * aSide * uScale;
vT = aT; vIdx = aIdx;
float head = fract(uTime * 0.90 + aIdx * 0.37);
float d = aT - head;
d -= floor(d + 0.5);
float pulse = smoothstep(0.16, 0.0, abs(d));
vGlow = 0.30 + pulse * 1.15 + 0.10 * sin(uTime * 33.0 + aIdx * 9.0);
gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}`;
const ARC_R_FS = `
varying float vT, vGlow, vIdx;
uniform vec3 uColA, uColB;
void main(){
float warm = step(0.52, fract(vIdx * 0.618));
vec3 c = mix(uColA, uColB, warm);
float edge = 0.45 + 0.55 * sin(vT * 3.1415926);
float a = clamp(vGlow, 0.0, 1.0) * edge;
if (a <= 0.004) discard;
gl_FragColor = vec4(c * a, a);
}`;
const arcRMat = new THREE.ShaderMaterial({
uniforms: {
uTime: { value: 0 },
uScale: { value: 1 },
uEye: { value: new THREE.Vector3(0.06, -0.30, 4.05) },
uColA: { value: new THREE.Vector3(0.72, 0.90, 1.0) },
uColB: { value: new THREE.Vector3(1.0, 0.62, 0.24) }
},
vertexShader: ARC_R_VS,
fragmentShader: ARC_R_FS,
transparent: true,
depthTest: false,
depthWrite: false,
blending: THREE.AdditiveBlending
});
const ARC_N = 9, ARC_SEG = 5, ARC_WIDTH = 0.0042;
const arcGeo = new THREE.BufferGeometry();
const arcAttr = {
pos: new Float32Array(ARC_N * 24 * 6 * 3),
dir: new Float32Array(ARC_N * 24 * 6 * 3),
side: new Float32Array(ARC_N * 24 * 6),
wid: new Float32Array(ARC_N * 24 * 6),
tt: new Float32Array(ARC_N * 24 * 6),
idx: new Float32Array(ARC_N * 24 * 6)
};
arcGeo.setAttribute('position', new THREE.BufferAttribute(arcAttr.pos, 3));
arcGeo.setAttribute('aDir', new THREE.BufferAttribute(arcAttr.dir, 3));
arcGeo.setAttribute('aSide', new THREE.BufferAttribute(arcAttr.side, 1));
arcGeo.setAttribute('aWidth', new THREE.BufferAttribute(arcAttr.wid, 1));
arcGeo.setAttribute('aT', new THREE.BufferAttribute(arcAttr.tt, 1));
arcGeo.setAttribute('aIdx', new THREE.BufferAttribute(arcAttr.idx, 1));
const arcsR = new THREE.Mesh(arcGeo, arcRMat);
arcsR.frustumCulled = false;
arcsR.renderOrder = 3;
function jag(a, b, depth) {
let pts = [a.clone(), b.clone()];
let amp = a.distanceTo(b) * 0.42;
for (let k = 0; k < depth; k++) {
const out = [];
for (let i = 0; i < pts.length - 1; i++) {
out.push(pts[i]);
const m = pts[i].clone().add(pts[i + 1]).multiplyScalar(0.5);
m.x += (Math.random() - 0.5) * amp;
m.y += (Math.random() - 0.5) * amp;
m.z += (Math.random() - 0.5) * amp;
out.push(m);
}
out.push(pts[pts.length - 1]);
pts = out;
amp *= 0.55;
}
return pts;
}
function rebuildRibbon() {
let w = 0;
for (let n = 0; n < ARC_N; n++) {
const r0 = BALL_R * (0.42 + Math.random() * 0.52);
const th = Math.random() * Math.PI * 2;
const ph = Math.acos(2 * Math.random() - 1);
const A = new THREE.Vector3(Math.sin(ph) * Math.cos(th), Math.cos(ph) * 0.86, Math.sin(ph) * Math.sin(th)).multiplyScalar(r0);
const th2 = th + (Math.random() - 0.5) * 2.4;
const ph2 = Math.max(0.25, Math.min(Math.PI - 0.25, ph + (Math.random() - 0.5) * 1.8));
const r1 = BALL_R * (0.55 + Math.random() * 0.45);
const B = new THREE.Vector3(Math.sin(ph2) * Math.cos(th2), Math.cos(ph2) * 0.86, Math.sin(ph2) * Math.sin(th2)).multiplyScalar(r1);
const pts = jag(A, B, ARC_SEG);
const n2 = pts.length;
for (let i = 0; i < n2 - 1; i++) {
const p0 = pts[i], p1 = pts[i + 1];
const dv = p1.clone().sub(p0).normalize();
const t0 = i / (n2 - 1), t1 = (i + 1) / (n2 - 1);
const w0 = ARC_WIDTH * (0.35 + 0.9 * Math.sin(t0 * Math.PI));
const w1 = ARC_WIDTH * (0.35 + 0.9 * Math.sin(t1 * Math.PI));
const quad = [
[p0, t0, w0, -1], [p0, t0, w0, 1], [p1, t1, w1, -1],
[p1, t1, w1, -1], [p0, t0, w0, 1], [p1, t1, w1, 1]
];
for (let q = 0; q < 6; q++) {
const it = quad[q];
arcAttr.pos[w * 3] = it[0].x; arcAttr.pos[w * 3 + 1] = it[0].y; arcAttr.pos[w * 3 + 2] = it[0].z;
arcAttr.dir[w * 3] = dv.x; arcAttr.dir[w * 3 + 1] = dv.y; arcAttr.dir[w * 3 + 2] = dv.z;
arcAttr.side[w] = it[3];
arcAttr.wid[w] = it[2];
arcAttr.tt[w] = it[1];
arcAttr.idx[w] = n;
w++;
}
}
}
arcGeo.attributes.position.needsUpdate = true;
arcGeo.attributes.aDir.needsUpdate = true;
arcGeo.attributes.aSide.needsUpdate = true;
arcGeo.attributes.aWidth.needsUpdate = true;
arcGeo.attributes.aT.needsUpdate = true;
arcGeo.attributes.aIdx.needsUpdate = true;
}
rebuildRibbon();
let arcRLast = -1;
scene.add(arcsR);
let PR = PRESETS.plasma;
let fxName = 'plasma';
function setPreset(name) {
if (!PRESETS[name]) return;
fxName = name;
PR = PRESETS[name];
for (const m of [matMain, matHalo]) {
const u = m.uniforms;
u.uG1.value.fromArray(PR.grad[0]);
u.uG2.value.fromArray(PR.grad[1]);
u.uG3.value.fromArray(PR.grad[2]);
u.uG4.value.fromArray(PR.grad[3]);
u.uHaloCol.value.fromArray(PR.haloCol);
u.uCold.value.fromArray(PR.cold);
u.uWarm.value.fromArray(PR.warm);
u.uThr1.value = SHAPES[cur] === 'ball' ? PR.thr[0] * 0.55 : PR.thr[0];
u.uThr2.value = SHAPES[cur] === 'ball' ? PR.thr[1] * 0.62 : PR.thr[1];
u.uGain.value = PR.gain * (SHAPES[cur] === 'ball' ? 1.9 : 1.0);
u.uHaloAmt.value = PR.haloAmt;
}
brightMat.uniforms.uThr.value = PR.bright;
compMat.uniforms.uAmt.value = PR.bloom * (SHAPES[cur] === 'ball' ? 1.45 : 1.0);
arcMat.uniforms.uArcCore.value.set(1.0, 1.0, 1.0);
arcMat.uniforms.uArcTip.value.fromArray(LOOK.coreCol);
}
let cur = 0, nxt = 1, prog01 = 1, animating = false, t0 = 0;
const MORPH = 1600;
let burn01 = 0, burning = false;
let palMix = 1, strMix = 0;
let last = performance.now();
let idle = 0, repel = 0, shock = 0;
const shockC = new THREE.Vector2(0, 0);
const mouseW = new THREE.Vector3(999, 999, 0);
let frames = 0, accT = 0;
const raycaster = new THREE.Raycaster();
const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const hitV = new THREE.Vector3();
function morphTo(i) {
if (animating || i === cur) return;
nxt = i;
setPair(cur, nxt);
prog01 = 0;
t0 = performance.now();
animating = true;
}
function pointToWorld(e) {
const r = canvas.getBoundingClientRect();
if (!r.width || !r.height) return null;
const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
raycaster.setFromCamera({ x: nx, y: ny }, camera);
if (raycaster.ray.intersectPlane(planeZ, hitV)) return hitV;
return null;
}
function applyUniforms(mat, isHalo, isBall, t) {
const u = mat.uniforms;
u.uProg.value = animating ? prog01 : 1;
u.uTime.value = t;
u.uPx.value = isHalo ? dpr_ * 5.0 : dpr_ * (isBall ? LOOK.ballPx : 2.0);
u.uPxMax.value = isHalo ? PR.pxMax * 1.2 : (isBall ? LOOK.ballPxMax : PR.pxMax * 0.74);
u.uShadeOn.value = isBall ? 0 : 1;
u.uString.value = strMix;
u.uBurn.value = burn01;
u.uSplit.value = CLOUD[SHAPES[cur]].n * 0.3774;
u.uEye.value.copy(eye);
u.uIdle.value = idle;
u.uBreathe.value = 1;
u.uFlicker.value = PR.flicker;
u.uRepel.value = repel;
u.uShock.value = shock;
u.uShockC.value.copy(shockC);
u.uMouse.value.copy(mouseW);
u.uArcOn.value = isBall ? 1 : 0;
u.uHaloAmt.value = PR.haloAmt * (isHalo ? 1 : 0);
u.uAlphaMul.value = isBall ? LOOK.ballAlpha : 1.0;
u.uScale.value = LOOK.scale;
u.uRimPow.value = LOOK.rimPow;
u.uCoreCol.value.fromArray(LOOK.coreCol);
u.uCoreAmt.value = LOOK.coreAmt;
}
function frame(now) {
const dprHint = Math.min(window.devicePixelRatio || 1, 2);
if (Math.abs(canvas.width - Math.round(canvas.clientWidth * dprHint)) > 1 ||
Math.abs(canvas.height - Math.round(canvas.clientHeight * dprHint)) > 1 ||
Math.abs(camera.aspect - (canvas.clientWidth / Math.max(1, canvas.clientHeight))) > 0.002) {
resize();
}
const dt = Math.min(0.05, (now - last) / 1000); last = now;
const t = now / 1000;
if (animating) {
prog01 = Math.min(1, (now - t0) / MORPH);
if (prog01 >= 1) {
animating = false;
cur = nxt;
setPair(cur, cur);
}
}
cam.yaw += (cam.ty - cam.yaw) * Math.min(1, dt * 6);
cam.pitch += (cam.tp - cam.pitch) * Math.min(1, dt * 6);
const cp = Math.cos(cam.pitch);
cam.lookX = LOOK.camX; cam.lookY = LOOK.camY;   // 调参台可以实时推机位
eye.set(
Math.sin(cam.yaw) * cam.dist * cp + cam.lookX + cam.px,
cam.lookY + Math.sin(cam.pitch) * cam.dist,
Math.cos(cam.yaw) * cam.dist * cp
);
camera.position.copy(eye);
cam.px += (cam.tpx - cam.px) * 0.06; cam.py += (cam.tpy - cam.py) * 0.06;
camera.lookAt(cam.lookX + cam.px, cam.lookY + cam.py, 0);
const isBall = SHAPES[animating ? nxt : cur] === 'ball';
palMix += ((isBall ? 0 : 1) - palMix) * 0.055;
strMix += ((SHAPES[animating ? nxt : cur] === 'string' ? 1 : 0) - strMix) * 0.055;
idle += dt * PR.spin;
repel *= Math.exp(-dt * 3.2);
if (shock > 0) shock = Math.max(0, shock - dt / 0.85);
applyUniforms(matMain, false, isBall, t);
applyUniforms(matHalo, true, isBall, t);
ptsHalo.visible = isBall && !animating;
orb.visible = isBall && !animating;
orb.scale.setScalar(BALL_R * LOOK.scale);
arcs.visible = isBall && !animating;
if (arcs.visible) {
arcMat.uniforms.uTime.value = t;
arcMat.uniforms.uScale.value = LOOK.scale;
arcMat.uniforms.uArcAmt.value = LOOK.arcAmt;
arcs.visible = false;
arcsR.visible = false;
ptsMain.visible = false; ptsHalo.visible = false; orb.visible = false; /* 底图本身就有电弧，程序化弧不再叠上去 */
arcRMat.uniforms.uTime.value = t;
arcRMat.uniforms.uScale.value = LOOK.scale;
arcRMat.uniforms.uEye.value.set(LOOK.camX, LOOK.camY, LOOK.dist);
if (t - arcRLast > 0.12) { rebuildRibbon(); arcRLast = t; }
arcMat.uniforms.uPx.value = Math.max(0.6, (renderer.getPixelRatio ? renderer.getPixelRatio() : 1));
}
const useBloom = bloomOK && rtScene && rtA && rtB && (bloomForce === null ? !lowMode : bloomForce);
if (rtScene && compMat) {
renderer.setRenderTarget(rtScene);
renderer.render(scene, camera);
if (useBloom) {
quadMesh.material = brightMat;
brightMat.uniforms.uTex.value = rtScene.texture;
renderer.setRenderTarget(rtA);
renderer.render(quadScene, quadCam);
quadMesh.material = blurMat;
for (let i = 0; i < 2; i++) {
const rad = 0.55 + i * 0.75;
blurMat.uniforms.uTex.value = rtA.texture;
blurMat.uniforms.uDir.value.set(rad / rtB.width, 0);
renderer.setRenderTarget(rtB);
renderer.render(quadScene, quadCam);
blurMat.uniforms.uTex.value = rtB.texture;
blurMat.uniforms.uDir.value.set(0, rad / rtB.height);
renderer.setRenderTarget(rtA);
renderer.render(quadScene, quadCam);
}
compMat.uniforms.uScene.value = rtScene.texture;
compMat.uniforms.uBloom.value = rtA.texture;
compMat.uniforms.uAmt.value = PR.bloom;
} else {
compMat.uniforms.uScene.value = rtScene.texture;
compMat.uniforms.uBloom.value = rtA ? rtA.texture : rtScene.texture;
compMat.uniforms.uAmt.value = 0.0;
}
let streakOK = false;
if (rtS1 && rtS2 && LOOK.streak > 0.001) {
quadMesh.material = streakBrightMat;
streakBrightMat.uniforms.uTex.value = rtScene.texture;
streakBrightMat.uniforms.uThr.value = Math.min(0.96, PR.bright + 0.16);
renderer.setRenderTarget(rtS1);
renderer.render(quadScene, quadCam);
quadMesh.material = streakBlurMat;
let src = rtS1, dst = rtS2;
for (let i = 0; i < 3; i++) {
streakBlurMat.uniforms.uTex.value = src.texture;
streakBlurMat.uniforms.uDir.value.set(3.2 / rtS1.width, 0);
renderer.setRenderTarget(dst);
renderer.render(quadScene, quadCam);
const tmp = src; src = dst; dst = tmp;
}
compMat.uniforms.uStreak.value = src.texture;
streakOK = true;
}
if (!streakOK) compMat.uniforms.uStreak.value = rtA ? rtA.texture : rtScene.texture;
compMat.uniforms.uStreakAmt.value = streakOK ? LOOK.streak : 0.0;
compMat.uniforms.uStreakTint.value.fromArray(LOOK.streakTint);
quadMesh.material = compMat;
renderer.setRenderTarget(null);
renderer.render(quadScene, quadCam);
} else {
renderer.setRenderTarget(null);
renderer.render(scene, camera);
}
if (burning && burn01 < 1) burn01 = Math.min(1, burn01 + dt / 4.2);
if (burn01 >= 1 && burning) burning = false;
frames++; accT += dt;
if (accT >= 2) {
const f = frames / accT;
frames = 0; accT = 0;
fps = f;
if (f < 40 && !lowMode) lowMode = true;
else if (f > 56 && lowMode) lowMode = false;
}
}
let dragging = false, px = 0, py = 0, moved = 0;
canvas.addEventListener('pointerdown', e => {
dragging = true; moved = 0; px = e.clientX; py = e.clientY;
canvas.setPointerCapture(e.pointerId);
});
window.addEventListener('pointermove', e => {
cam.tpx = ((e.clientX / innerWidth) - 0.5) * 0.30;
cam.tpy = -((e.clientY / innerHeight) - 0.5) * 0.18;
}, { passive: true });
canvas.addEventListener('pointermove', e => {
const w = pointToWorld(e);
if (w) { mouseW.copy(w); repel = Math.min(1, repel + 0.22); }
if (!dragging) return;
const dx = e.clientX - px, dy = e.clientY - py; px = e.clientX; py = e.clientY;
moved += Math.abs(dx) + Math.abs(dy);
cam.ty = Math.max(-0.62, Math.min(0.62, cam.ty + dx * 0.005));
cam.tp = Math.max(-0.22, Math.min(0.30, cam.tp - dy * 0.004));
});
canvas.addEventListener('pointerleave', () => { mouseW.set(999, 999, 0); });
canvas.addEventListener('pointerup', e => {
dragging = false;
if (moved < 6) {
const w = pointToWorld(e);
if (w) { shockC.set(w.x, w.y); shock = 1; }
morphTo((cur + 1) % SHAPES.length);
}
});
canvas.addEventListener('wheel', e => {
e.preventDefault();
cam.dist = Math.max(2.2, Math.min(6.5, cam.dist * (1 + e.deltaY * 0.0012)));
}, { passive: false });
window.addEventListener('resize', resize);
if (typeof ResizeObserver === 'function') {
new ResizeObserver(() => resize()).observe(canvas);
}
let bootFx = 'plasma';
try {
const q = new URLSearchParams(location.search).get('fx');
if (q && PRESETS[q]) bootFx = q;
} catch (e) { /* 老浏览器没有 URLSearchParams 就吃默认值 */ }
setPair(0, 0);
setPreset(bootFx);
resize();
renderer.setAnimationLoop(frame);
const api = {
morphTo,
get shape() { return SHAPES[cur]; },
get fxName() { return fxName; },
fx(name) { setPreset(name); return fxName; },
presets: FX_ORDER.slice(),
bloom(on) { bloomForce = on === null || on === undefined ? null : !!on; return bloomForce; },
look() { return Object.assign({}, LOOK, { fx: fxName, preset: PR }); },
tune(patch) {
if (!patch) return LOOK;
for (const k in patch) {
if (k in LOOK) LOOK[k] = patch[k];
else PR[k] = patch[k];
}
setPreset(fxName);
return LOOK;
},
panBy(dx, dy) {
if (dx) cam.ty = Math.max(-0.62, Math.min(0.62, cam.ty + dx));
if (dy) cam.tp = Math.max(-0.22, Math.min(0.30, cam.tp + dy));
return { ty: cam.ty, tp: cam.tp };
},
panState() { return { ty: cam.ty, tp: cam.tp, yaw: cam.yaw, pitch: cam.pitch }; },
state() {
return { fx: fxName, shape: SHAPES[cur], lowMode, bloomOK, fps: Math.round(fps) };
}
};
window.__coverParticles = api;   // 调试/截图用句柄（app.js 仍按契约用返回值）
return api;
}
window.initCoverParticles = initCoverParticles;
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', () => initCoverParticles());
} else {
initCoverParticles();
}
(function () {
var GLYPHS = ['雷', '弧', '光', '電', '閃', '霆', '炬', '电', '闪', '碳', '弧', '光'];
var holder = null;
function split(el) {
var text = el.textContent.trim();
el.textContent = '';
var spans = [];
for (var i = 0; i < text.length; i++) {
var s = document.createElement('span');
s.textContent = text[i];
s.style.display = 'inline-block';
el.appendChild(s);
spans.push({ el: s, ch: text[i] });
}
return spans;
}
function scramble(spans) {
spans.forEach(function (item, i) {
setTimeout(function () {
var rounds = 0;
var timer = setInterval(function () {
item.el.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
if (++rounds >= 3) {
clearInterval(timer);
item.el.textContent = item.ch;
}
}, 42);
}, i * 58);
});
}
function init() {
var el = document.querySelector('.cover-huge');
if (!el || holder === el) return;
holder = el;
var spans = split(el);
el.addEventListener('pointerenter', function () { scramble(spans); });
el.addEventListener('click', function () { scramble(spans); });
if (location.search.indexOf('scramble') > -1) {
setTimeout(function () { scramble(spans); }, 600);
}
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', init);
} else {
init();
}
window.__scramble = init;
})();
(function () {
var mast = document.querySelector('.masthead');
var cover = document.getElementById('cover');
if (!mast || !cover) return;
function sync() {
var on = document.body.classList.contains('pg-on') && cover.classList.contains('on');
mast.classList.toggle('is-cover-hidden', on);
}  sync();
new MutationObserver(sync).observe(cover, { attributes: true, attributeFilter: ['class'] });
new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
})();
(function () {
document.addEventListener('click', function (e) {
var btn = e.target && e.target.closest ? e.target.closest('[data-prologue]') : null;
if (!btn) return;
e.preventDefault();
e.stopPropagation();
if (typeof window.__enterPrologue === 'function') window.__enterPrologue();
}, true);
})();
(function () {
function drawGrids() {
var grids = document.querySelectorAll('.cdots');
for (var i = 0; i < grids.length; i++) {
(function (el) {
if (el.querySelector('canvas')) return;
var w = el.clientWidth, h = el.clientHeight;
if (!w || !h) return;
var dpr = Math.min(2, window.devicePixelRatio || 1);
var cv = document.createElement('canvas');
cv.width = Math.round(w * dpr);
cv.height = Math.round(h * dpr);
cv.style.cssText = 'display:block;width:' + w + 'px;height:' + h + 'px';
el.style.backgroundImage = 'none';
el.appendChild(cv);
var ctx = cv.getContext('2d');
ctx.scale(dpr, dpr);
ctx.fillStyle = 'rgba(212,226,244,.92)';
var CFG = { d1: [7, 9], d2: [5, 7], d3: [4, 6], d4: [7, 8] };
var key = 'd1';
['d1', 'd2', 'd3', 'd4'].forEach(function (k) { if (el.classList.contains(k)) key = k; });
var ROWS = CFG[key][0], COLS = CFG[key][1];
for (var r = 0; r < ROWS; r++) {
var yy = ROWS === 1 ? h / 2 : h * (r / (ROWS - 1));
for (var c = 0; c < COLS; c++) {
var xx = COLS === 1 ? w / 2 : w * (c / (COLS - 1));
ctx.beginPath();
ctx.arc(xx, yy, 1.0, 0, Math.PI * 2);
ctx.fill();
}
}
})(grids[i]);
}
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', drawGrids);
} else {
drawGrids();
}
})();
(function () {
var cover = document.getElementById('cover');
if (!cover) return;
var LIMX = 560, LIMY = 380;
var pan = { x: 0, y: 0 };
var vel = { x: 0, y: 0 };
var drag = null, raf = 0;
function api() { return window.__coverParticles || null; }
function paint() {
cover.style.setProperty('--panx', pan.x.toFixed(2) + 'px');
cover.style.setProperty('--pany', pan.y.toFixed(2) + 'px');
}
function push(dx, dy) {
var a = api();
if (!a || !a.panBy) return;
a.panBy(dx * 0.0014, -dy * 0.0009);
}
function clampPan() {
if (pan.x > LIMX) { pan.x = LIMX + (pan.x - LIMX) * 0.18; vel.x *= 0.4; }
if (pan.x < -LIMX) { pan.x = -LIMX + (pan.x + LIMX) * 0.18; vel.x *= 0.4; }
if (pan.y > LIMY) { pan.y = LIMY + (pan.y - LIMY) * 0.18; vel.y *= 0.4; }
if (pan.y < -LIMY) { pan.y = -LIMY + (pan.y + LIMY) * 0.18; vel.y *= 0.4; }
}
function inertia() {
raf = 0;
if (Math.abs(vel.x) < 0.08 && Math.abs(vel.y) < 0.08) { vel.x = vel.y = 0; return; }
pan.x += vel.x; pan.y += vel.y;
vel.x *= 0.92; vel.y *= 0.92;
clampPan(); paint(); push(vel.x, vel.y);
raf = requestAnimationFrame(inertia);
}
function stopInertia() { if (raf) { cancelAnimationFrame(raf); raf = 0; } vel.x = vel.y = 0; }
function bind(el, axis) {
if (!el) return;
el.style.touchAction = 'none';
el.style.cursor = 'grab';
el.addEventListener('pointerdown', function (e) {
if (e.button !== undefined && e.button !== 0) return;
stopInertia();
drag = { axis: axis, id: e.pointerId, x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY };
el.style.cursor = 'grabbing';
try { el.setPointerCapture(e.pointerId); } catch (err) {}
e.preventDefault();
});
el.addEventListener('pointermove', function (e) {
if (!drag || e.pointerId !== drag.id) return;
var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
drag.x = e.clientX; drag.y = e.clientY;
var mx = axis === 'h' ? dx : dx * 0.35;
var my = axis === 'v' ? dy : dy * 0.35;
pan.x += mx; pan.y += my;
vel.x = vel.x * 0.6 + mx * 0.4;
vel.y = vel.y * 0.6 + my * 0.4;
clampPan(); paint(); push(mx, my);
e.preventDefault();
});
function end(e) {
if (!drag || e.pointerId !== drag.id) return;
drag = null;
el.style.cursor = 'grab';
try { el.releasePointerCapture(e.pointerId); } catch (err) {}
if (!raf) raf = requestAnimationFrame(inertia);
}
el.addEventListener('pointerup', end);
el.addEventListener('pointercancel', end);
el.addEventListener('dblclick', function (e) {
e.preventDefault();
stopInertia();
var from = { x: pan.x, y: pan.y }, t0 = performance.now();
(function back() {
var k = Math.min(1, (performance.now() - t0) / 420);
var e2 = 1 - Math.pow(1 - k, 3);
var nx = from.x * (1 - e2), ny = from.y * (1 - e2);
push(nx - pan.x, ny - pan.y);
pan.x = nx; pan.y = ny; paint();
if (k < 1) requestAnimationFrame(back);
})();
});
}
function init() {
var h = cover.querySelector('.caxis-h'), v = cover.querySelector('.caxis-v');
bind(h, 'h');
bind(v, 'v');
paint();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
window.__coverPan = { get: function () { return { x: pan.x, y: pan.y }; }, api: api };
})();
(function __coverCursor(){
if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;
var cover = document.getElementById('cover');
if (!cover) return;
var dot = cover.querySelector('.cur-dot');
var ring = cover.querySelector('.cur-ring');
var arc2 = cover.querySelector('.cur-arc');
if (!dot || !ring) return;
var tx = 0, ty = 0, rx = 0, ry = 0, cx = 0, cy = 0, on = false;
window.addEventListener('pointermove', function(e){
tx = e.clientX; ty = e.clientY;
if (!on) { on = true; rx = tx; ry = ty; cx = tx; cy = ty; dot.classList.add('cur-on'); ring.classList.add('cur-on'); if (arc2) arc2.classList.add('cur-on'); }
}, { passive: true });
window.addEventListener('pointerleave', function(){
on = false; dot.classList.remove('cur-on'); ring.classList.remove('cur-on'); if (arc2) arc2.classList.remove('cur-on');
});
window.addEventListener('pointerdown', function(){ ring.style.transform += ' scale(1.45)'; });
window.addEventListener('pointerup', function(){ ring.style.transform = ring.style.transform.replace(' scale(1.45)', ''); });
(function tick(){
cx += (tx - cx) * 0.55; cy += (ty - cy) * 0.55;
rx += (tx - rx) * 0.14;  ry += (ty - ry) * 0.14;
dot.style.transform = 'translate3d(' + (cx - 3) + 'px,' + (cy - 3) + 'px,0)';
ring.style.transform = 'translate3d(' + (rx - 13) + 'px,' + (ry - 13) + 'px,0) scale(' + (1 + Math.min(0.5, Math.hypot(tx - rx, ty - ry) / 240)) + ')';
if (arc2) arc2.style.transform = 'translate3d(' + (rx - 23) + 'px,' + (ry - 23) + 'px,0)';
requestAnimationFrame(tick);
})();
})();
(function __coverIntro(){
var box = document.querySelector('#cover .intro');
if (!box) return;
var key = 'bl-intro-played';
var played = false;
try { played = sessionStorage.getItem(key) === '1'; } catch(e) {}
if (played) { box.classList.add('intro-done'); return; }
try { sessionStorage.setItem(key, '1'); } catch(e) {}
requestAnimationFrame(function(){ box.classList.add('intro-on'); });
setTimeout(function(){ box.classList.add('intro-done'); }, 1300);
})();