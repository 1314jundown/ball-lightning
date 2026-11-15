window.roseStage = function () {
'use strict';
const CFG = {
count: 60000,      // 粒子数
size: 1.25,        // 点大小倍率
alpha: 0.75,       // 每个点的亮度（这个数一高就爆）
hue: 202,          // 主色相（冷青，原来是 224 宝蓝）
sat: 0.74,         // 饱和度（原来硬编码 0.88）
tilt: 36,          // 俯视角（度）
spin: 0.12,        // 自转
scale: 1.15,       // 花在画面里的大小
exposure: 1.25,    // 色调映射曝光
bloom: 0.50,       // bloom 强度
bloomGain: 1.45,   // 交付版叠加的额外增益（面板仍按 0~1 调）
bloomOn: true,
charge: 0.95,      // 观测充能速度（每秒，越小越慢）
hold: 3.2,         // 满形态维持多久后过曝
decay: 1.6,        // 坍缩消散恢复时长
fluct: 1.0,        // 量子涨落幅度（云态抖动，供03屏实时调控）
tremor: 1.0,       // 临界微颤幅度（成形末期，坍缩前的不稳定）
swirl: 1.0,        // 坍缩时的螺旋弥散强度
autoQ: true,       // 自适应画质（掉帧时自动抽稀粒子）
qMin: 0.40         // 自适应画质最多抽稀到原粒子数的比例
};
window.__roseCFG = CFG;
const errBox = document.getElementById('err');
function fail(msg) {
errBox.classList.add('on');
errBox.innerHTML = '<div><b>渲染失败了。</b>\n\n' + String(msg).replace(/[<>]/g, '') +
'\n\n把这段截图发给我。也可以点右下角退回 2D 版。</div>';
}
window.addEventListener('error', function (e) {
fail((e.message || 'unknown') + '\n' + (e.filename || '') + ':' + (e.lineno || ''));
});
const SH = (function () {
const TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
function buildRose(n, rand) {
const PN = 16;
const petals = [];
for (let k = 0; k < PN; k++) {
const t = k / (PN - 1);
const layer = Math.pow(t, 0.85);
const jL = 0.90 + rand() * 0.22;
const jA = (rand() - 0.5) * 14 * Math.PI / 180;
petals.push({
layer: layer,
th: k * 2.39996323,
a0: (5 + 9 * layer) * Math.PI / 180,
a1: (38 + 127 * Math.pow(layer, 1.35)) * Math.PI / 180 + jA,
kk: 1.35 + 0.95 * layer,
L: (0.80 + 0.45 * layer) * jL,
W: 0.16 + 0.24 * layer,
r0: 0.03 + 0.10 * layer,
bri: 0.78 + rand() * 0.44
});
}
let total = 0;
for (const p of petals) total += p.L * p.W;
const R = {
n: n,
s: new Float32Array(n), v: new Float32Array(n), th: new Float32Array(n),
L: new Float32Array(n), W: new Float32Array(n), r0: new Float32Array(n),
a0: new Float32Array(n), a1: new Float32Array(n),
sk: new Float32Array(n), sk2: new Float32Array(n),
wp: new Float32Array(n), y0: new Float32Array(n),
edge: new Float32Array(n), bri: new Float32Array(n),
jx: new Float32Array(n), jy: new Float32Array(n), jz: new Float32Array(n),
col: new Uint8Array(n), sz: new Float32Array(n), dl: new Float32Array(n)
};
for (let i = 0; i < n; i++) {
let r = rand() * total, k = 0;
while (k < PN - 1 && r > petals[k].L * petals[k].W) { r -= petals[k].L * petals[k].W; k++; }
const p = petals[k];
const s = 0.02 + 0.98 * Math.pow(rand(), 0.95);
let v = rand() * 2 - 1;
v = (v < 0 ? -1 : 1) * Math.pow(Math.abs(v), 0.62);
R.s[i] = s; R.v[i] = v; R.th[i] = p.th;
R.L[i] = p.L; R.W[i] = p.W; R.r0[i] = p.r0;
R.a0[i] = p.a0; R.a1[i] = p.a1;
R.sk[i] = Math.pow(s, p.kk);
R.sk2[i] = Math.pow(s * 0.5, p.kk);
R.wp[i] = Math.pow(Math.sin(Math.PI * Math.pow(s, 0.72)), 0.8);
R.y0[i] = -0.05 * p.layer;
R.edge[i] = Math.pow(Math.abs(v), 3);
R.bri[i] = p.bri;
R.jx[i] = (rand() - 0.5) * 0.03;
R.jy[i] = (rand() - 0.5) * 0.03;
R.jz[i] = (rand() - 0.5) * 0.075;
let c;
if (p.layer < 0.10) c = 5;
else if (p.layer < 0.30) c = 4;
else if (p.layer < 0.55) c = 2;
else if (p.layer < 0.80) c = 3;
else c = 1;
R.col[i] = c;
R.sz[i] = 0.72 + rand() * 1.05;
R.dl[i] = clamp(0.40 * p.layer + 0.36 * s + rand() * 0.14, 0, 0.95);
}
return R;
}
function rosePoint(R, i, fold, rot, out) {
const a0 = R.a0[i] * (0.16 + 0.84 * fold);
const a1 = R.a1[i] * (0.20 + 0.80 * fold);
const dA = a1 - a0;
const at = a0 + dA * R.sk[i];
const am = a0 + dA * R.sk2[i];
const Ls = R.L[i] * R.s[i] / 6;
const wp = R.wp[i];
const Xs = Ls * (Math.sin(a0) + 4 * Math.sin(am) + Math.sin(at)) + R.jx[i] + R.r0[i];
const Ys = Ls * (Math.cos(a0) + 4 * Math.cos(am) + Math.cos(at)) + R.jy[i] + R.y0[i];
const wv = R.v[i] * R.W[i] * wp + R.jz[i];
const cup = 0.55 * R.W[i] * wp * (1 - R.v[i] * R.v[i]) * Math.cos(at);
const X = Xs + cup;
const Y = Ys - cup * 0.6;
const ang = rot + R.th[i];
const c = Math.cos(ang), sn = Math.sin(ang);
out.x = X * c + wv * sn;
out.z = -X * sn + wv * c;
out.y = Y;
return out;
}
return { buildRose: buildRose, rosePoint: rosePoint };
})();
function mulberry32(a) {
return function () {
a |= 0; a = (a + 0x6D2B79F5) | 0;
let t = Math.imul(a ^ (a >>> 15), 1 | a);
t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
}
const canvas = document.getElementById('gl');
const gl = canvas.getContext('webgl', {
alpha: false, antialias: false, depth: false, stencil: false,
premultipliedAlpha: false, powerPreference: 'high-performance'
}) || canvas.getContext('experimental-webgl');
if (!gl) { fail('这个浏览器没有 WebGL。请用 Chrome / Edge 打开。'); return; }
let DPR = Math.min(2, window.devicePixelRatio || 1);
let W = 1, H = 1;
function compile(type, src) {
const sh = gl.createShader(type);
gl.shaderSource(sh, src);
gl.compileShader(sh);
if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
throw new Error('shader: ' + gl.getShaderInfoLog(sh) + '\n' + src.slice(0, 400));
}
return sh;
}
function program(vs, fs) {
const p = gl.createProgram();
gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
gl.linkProgram(p);
if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
throw new Error('link: ' + gl.getProgramInfoLog(p));
}
return p;
}
const PART_VS = [
'precision highp float;',
'attribute vec3 aCloud;',
'attribute vec3 aRose;',
'attribute vec3 aLightning;',
'attribute vec3 aSeed;',
'attribute float aDelay;',
'attribute float aSize;',
'attribute float aCol;',
'uniform float uTime, uMorph, uShape, uSpin, uTilt, uScale, uPx, uAspect, uAlpha, uHue, uSat, uSizeMul;',
'uniform float uFluct, uTremor, uGone;',
'uniform float uRepel, uBurst;',
'uniform vec2 uCenter;',
'uniform vec2 uMouse;',
'uniform vec2 uBurstC;',
'varying float vA;',
'varying vec3 vColor;',
'vec3 hsl2rgb(float h, float s, float l){',
'  vec3 rgb = clamp(abs(mod(h*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0);',
'  return l + s*(rgb-0.5)*(1.0-abs(2.0*l-1.0));',
'}',
'void main(){',
'  vec3 c = aCloud;',
'  c.x += sin(uTime*0.33 + aSeed.x*6.2831)*0.06*uFluct;',
'  c.y += cos(uTime*0.27 + aSeed.y*6.2831)*0.05*uFluct;',
'  c.z += sin(uTime*0.21 + aSeed.z*6.2831)*0.06*uFluct;',
'  float ang = uSpin + aSeed.x*0.25;',
'  float ca = cos(ang), sa = sin(ang);',
'  vec3 r = mix(aRose, aLightning, step(0.5, uShape));',
'  float sw = uGone * 2.4 * (0.22 + 0.78*clamp(length(r)*1.6, 0.0, 1.0));',
'  float cs = cos(sw), ss = sin(sw);',
'  r = vec3(r.x*cs - r.z*ss, r.y, r.x*ss + r.z*cs);',
'  r *= 1.0 + uGone*0.42;',
'  r = vec3(r.x*ca - r.z*sa, r.y, r.x*sa + r.z*ca);',
'  float ct = cos(uTilt), st = sin(uTilt);',
'  r = vec3(r.x, r.y*ct - r.z*st, r.y*st + r.z*ct);',
'  float m = clamp((uMorph - aDelay*0.55)/0.45, 0.0, 1.0);',
'  m = m*m*(3.0-2.0*m);',
'  vec3 p = mix(c, r, m);',
'  float tw = uTremor * (0.55 + 0.45*sin(uTime*27.0 + aSeed.x*50.0));',
'  p.x += sin(uTime*43.0 + aSeed.y*61.0) * tw;',
'  p.y += cos(uTime*39.0 + aSeed.z*61.0) * tw;',
'  p.z += sin(uTime*31.0 + aSeed.x*61.0) * tw;',
'  float persp = 1.0/(1.0 + p.z*0.55);',
'  vec2 ndc = uCenter + vec2(p.x/uAspect, p.y) * uScale * persp;',
'  /* 拨开与炸散都在屏幕空间做：直接挪最终 ndc，不影响三维几何 */',
'  float band = 0.0;',
'  vec2 dv = ndc - uMouse;',
'  float dlen = length(dv);',
'  if (uRepel > 0.001) {',
'    float infl = exp(-dlen*dlen*9.0) * uRepel;',
'    ndc += normalize(dv + 1e-5) * infl * 0.11;',
'  }',
'  if (uBurst > 0.001) {',
'    vec2 bv = ndc - uBurstC;',
'    float bd = length(bv);',
'    band = exp(-pow((bd - (1.0 - uBurst)*0.85)*6.0, 2.0)) * uBurst;',
'    ndc += normalize(bv + 1e-5) * band * 0.17;',
'  }',
'  gl_Position = vec4(ndc, 0.0, 1.0);',
'  float sz = aSize * uSizeMul * uPx * (0.75 + 0.45*persp);',
'  gl_PointSize = clamp(sz, 0.7, 24.0);',
'  vA = uAlpha * (0.16 + 0.84*m) * (0.4 + 0.6*persp);',
'  vA *= 1.0 - 0.55*uGone;',
'  vA *= 0.18 + 0.82*smoothstep(0.02, 0.26, aRose.y);',
'  vA *= 1.0 + 1.8 * band;',
'  /* 花瓣分层：内层冷白、外层青紫；越往外越饱和，整朵才分得出层次 */',
'  float lay = clamp(aCol / 5.0, 0.0, 1.0);',
'  float core = smoothstep(0.60, 0.0, length(r));',
'  float petalShift = (aCol - 3.0) * 0.055 + core * 0.03;',
'  float petalBri = 0.44 + (1.0 - lay) * 0.18 + 0.10 * m + core * 0.18;',
'  float petalSat = clamp(uSat * mix(0.60, 1.10, lay), 0.0, 1.0);',
'  vColor = hsl2rgb(fract(uHue/360.0 + petalShift), petalSat, clamp(petalBri, 0.0, 1.0));',
'}'
].join('\n');
const PART_FS = [
'precision mediump float;',
'varying float vA;',
'varying vec3 vColor;',
'void main(){',
'  vec2 d = gl_PointCoord - vec2(0.5);',
'  float r = dot(d, d);',
'  float a = exp(-r*9.0) * vA;',
'  if (a < 0.002) discard;',
'  gl_FragColor = vec4(vColor * a, a);',
'}'
].join('\n');
const QUAD_VS = [
'attribute vec2 aPos;',
'varying vec2 vUv;',
'void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.0,1.0); }'
].join('\n');
const COPY_FS = [
'precision mediump float;',
'uniform sampler2D uTex;',
'uniform float uScale;',
'varying vec2 vUv;',
'void main(){ gl_FragColor = texture2D(uTex, vUv) * uScale; }'
].join('\n');
const TONE_FS = [
'precision mediump float;',
'uniform sampler2D uTex;',
'uniform float uExposure;',
'varying vec2 vUv;',
'void main(){',
'  vec3 c = texture2D(uTex, vUv).rgb * uExposure;',
'  vec3 a = c * (c * 0.45 + 0.18) / (c * (c * 0.42 + 0.72) + 0.14);',
'  gl_FragColor = vec4(clamp(a, 0.0, 1.0), 1.0);',
'}'
].join('\n');
const BLUR_FS = [
'precision mediump float;',
'uniform sampler2D uTex;',
'uniform vec2 uDir;',
'varying vec2 vUv;',
'void main(){',
'  vec4 c = texture2D(uTex, vUv) * 0.227027;',
'  c += (texture2D(uTex, vUv + uDir*1.3846) + texture2D(uTex, vUv - uDir*1.3846)) * 0.316216;',
'  c += (texture2D(uTex, vUv + uDir*3.2308) + texture2D(uTex, vUv - uDir*3.2308)) * 0.070270;',
'  gl_FragColor = c;',
'}'
].join('\n');
const partProg = program(PART_VS, PART_FS);
const copyProg = program(QUAD_VS, COPY_FS);
const blurProg = program(QUAD_VS, BLUR_FS);
const toneProg = program(QUAD_VS, TONE_FS);
const N = Math.max(8000, Math.round(CFG.count * (window.innerWidth < 760 ? 0.35 : 1)));
const STRIDE = 15;
const data = new Float32Array(N * STRIDE);
(function build() {
const rand = mulberry32(20261020);
const R = SH.buildRose(N, rand);
const tmp = { x: 0, y: 0, z: 0 };
for (let i = 0; i < N; i++) {
const o = i * STRIDE;
const rr = 0.30 + Math.pow(rand(), 0.6) * 0.86;
const th = rand() * Math.PI * 2;
const ph = Math.acos(2 * rand() - 1);
data[o] = Math.sin(ph) * Math.cos(th) * rr;
data[o + 1] = Math.cos(ph) * rr * 0.72;
data[o + 2] = Math.sin(ph) * Math.sin(th) * rr;
SH.rosePoint(R, i, 1, 0, tmp);
data[o + 3] = tmp.x;
data[o + 4] = tmp.y - 0.40;
data[o + 5] = tmp.z;
const t = i / Math.max(1, N - 1);
const z = t * 2.0 - 1.0;
const zig = Math.sin(t * Math.PI * 10.0) * 0.22;
const rad = (0.06 + 0.16 * Math.sin(t * Math.PI)) * (0.65 + rand() * 0.7);
data[o + 6] = zig + (rand() - 0.5) * rad;
data[o + 7] = z * 0.92 + (rand() - 0.5) * rad;
data[o + 8] = (rand() - 0.5) * rad * 0.8;
data[o + 9] = rand();
data[o + 10] = rand();
data[o + 11] = rand();
data[o + 12] = R.dl[i];
data[o + 13] = 0.70 + R.sz[i] * 0.55;
data[o + 14] = R.col[i];
}
})();
const buf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
const loc = {
aCloud: gl.getAttribLocation(partProg, 'aCloud'),
aRose: gl.getAttribLocation(partProg, 'aRose'),
aLightning: gl.getAttribLocation(partProg, 'aLightning'),
aSeed: gl.getAttribLocation(partProg, 'aSeed'),
aDelay: gl.getAttribLocation(partProg, 'aDelay'),
aSize: gl.getAttribLocation(partProg, 'aSize'),
aCol: gl.getAttribLocation(partProg, 'aCol')
};
const uni = {
uTime: gl.getUniformLocation(partProg, 'uTime'),
uMorph: gl.getUniformLocation(partProg, 'uMorph'),
uShape: gl.getUniformLocation(partProg, 'uShape'),
uSpin: gl.getUniformLocation(partProg, 'uSpin'),
uTilt: gl.getUniformLocation(partProg, 'uTilt'),
uScale: gl.getUniformLocation(partProg, 'uScale'),
uPx: gl.getUniformLocation(partProg, 'uPx'),
uAspect: gl.getUniformLocation(partProg, 'uAspect'),
uAlpha: gl.getUniformLocation(partProg, 'uAlpha'),
uHue: gl.getUniformLocation(partProg, 'uHue'),
uSat: gl.getUniformLocation(partProg, 'uSat'),
uSizeMul: gl.getUniformLocation(partProg, 'uSizeMul'),
uCenter: gl.getUniformLocation(partProg, 'uCenter'),
uFluct: gl.getUniformLocation(partProg, 'uFluct'),
uTremor: gl.getUniformLocation(partProg, 'uTremor'),
uGone: gl.getUniformLocation(partProg, 'uGone'),
uRepel: gl.getUniformLocation(partProg, 'uRepel'),
uBurst: gl.getUniformLocation(partProg, 'uBurst'),
uMouse: gl.getUniformLocation(partProg, 'uMouse'),
uBurstC: gl.getUniformLocation(partProg, 'uBurstC')
};
const quadBuf = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
const aPos = gl.getAttribLocation(copyProg, 'aPos');
function makeTarget(w, h) {
const tex = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, tex);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
const fbo = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
gl.bindFramebuffer(gl.FRAMEBUFFER, null);
return { tex: tex, fbo: fbo, w: w, h: h, ok: ok };
}
let scene = null, bloomA = null, bloomB = null, bloomOK = true;
function allocTargets() {
if (scene) { gl.deleteFramebuffer(scene.fbo); gl.deleteTexture(scene.tex); }
if (bloomA) { gl.deleteFramebuffer(bloomA.fbo); gl.deleteTexture(bloomA.tex); }
if (bloomB) { gl.deleteFramebuffer(bloomB.fbo); gl.deleteTexture(bloomB.tex); }
scene = makeTarget(W, H);
const bw = Math.min(384, Math.max(2, Math.floor(W / 4))), bh = Math.min(384, Math.max(2, Math.floor(H / 4)));
bloomA = makeTarget(bw, bh);
bloomB = makeTarget(bw, bh);
bloomOK = scene.ok && bloomA.ok && bloomB.ok;
document.getElementById('bl').textContent = bloomOK && CFG.bloomOn ? 'on' : 'off';
}
function resize() {
DPR = Math.min(2, window.devicePixelRatio || 1);
W = Math.floor(canvas.clientWidth * DPR);
H = Math.floor(canvas.clientHeight * DPR);
canvas.width = W; canvas.height = H;
gl.viewport(0, 0, W, H);
allocTargets();
document.getElementById('pts').textContent = N.toLocaleString();
}
window.addEventListener('resize', resize);
const M = { t: 0, morph: 0, target: 0, shape: 'rose', phase: 'idle', holdT: 0, px: -1e4, py: -1e4, has: false, gone: 0, wheel: 0, tremor: 0, goneN: 0, qual: 1, mx: 0, my: 0, repel: 0, burst: 0, burstX: 0, burstY: 0 };
window.__roseMorph = {
to: function (shape) {
M.shape = shape === 'lightning' ? 'lightning' : 'rose';
return M.shape;
},
shape: function () { return M.shape; },
toggle: function () { return this.to(M.shape === 'rose' ? 'lightning' : 'rose'); }
};
window.addEventListener('pointermove', function (e) {
M.px = e.clientX * DPR; M.py = e.clientY * DPR; M.has = true;
const rr = canvas.getBoundingClientRect();
M.mx = ((e.clientX - rr.left) / Math.max(1, rr.width)) * 2 - 1;
M.my = -(((e.clientY - rr.top) / Math.max(1, rr.height)) * 2 - 1);
M.repel = Math.min(1, (M.repel || 0) + 0.22);
}, { passive: true });
window.addEventListener('pointerdown', function (e) {
const rr = canvas.getBoundingClientRect();
M.mx = ((e.clientX - rr.left) / Math.max(1, rr.width)) * 2 - 1;
M.my = -(((e.clientY - rr.top) / Math.max(1, rr.height)) * 2 - 1);
M.burstX = M.mx; M.burstY = M.my; M.burst = 1;
});
window.addEventListener('wheel', function (e) {
const v = Math.min(1, Math.abs(e.deltaY) / 110);
M.wheel = Math.min(1.4, M.wheel + v * 0.6);
}, { passive: true });
window.addEventListener('keydown', function (e) {
const k = e.key.toLowerCase();
if (k === 'b') {
CFG.bloomOn = !CFG.bloomOn;
document.getElementById('bl').textContent = bloomOK && CFG.bloomOn ? 'on' : 'off';
}
if (k === 'l') { window.__roseMorph.toggle(); }
if (k === 'r') { M.phase = 'idle'; M.morph = 0; M.holdT = 0; M.gone = 0; M.wheel = 0; }
if (k === 'm') { AUD.on = !AUD.on; ensureAudio(); }
});
(function tune() {
const KEY = 'qm_webgl_cfg';
const pairs = [
['sAlpha', 'vAlpha', 'alpha', 3],
['sSize', 'vSize', 'size', 2],
['sExp', 'vExp', 'exposure', 2],
['sBloom', 'vBloom', 'bloom', 2],
['sTilt', 'vTilt', 'tilt', 0]
];
try {
const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
Object.keys(saved).forEach(function (k) {
if (k in CFG && typeof saved[k] === 'number') CFG[k] = saved[k];
});
} catch (e) { /* 忽略 */ }
pairs.forEach(function (p) {
const inp = document.getElementById(p[0]);
const out = document.getElementById(p[1]);
if (!inp || !out) return;
inp.value = CFG[p[2]];
out.textContent = Number(CFG[p[2]]).toFixed(p[3]);
inp.addEventListener('input', function () {
CFG[p[2]] = parseFloat(inp.value);
out.textContent = Number(CFG[p[2]]).toFixed(p[3]);
try {
localStorage.setItem(KEY, JSON.stringify({
alpha: CFG.alpha, size: CFG.size, exposure: CFG.exposure,
bloom: CFG.bloom, tilt: CFG.tilt, hue: CFG.hue, scale: CFG.scale
}));
} catch (e) { /* 忽略 */ }
});
});
const btn = document.getElementById('btnCopy');
if (btn) {
btn.addEventListener('click', function () {
const txt = 'alpha=' + CFG.alpha.toFixed(3) + ' size=' + CFG.size.toFixed(2) +
' exposure=' + CFG.exposure.toFixed(2) + ' bloom=' + CFG.bloom.toFixed(2) +
' tilt=' + CFG.tilt.toFixed(0);
let ok = false;
const ta = document.createElement('textarea');
ta.value = txt;
ta.style.position = 'fixed';
ta.style.opacity = '0';
document.body.appendChild(ta);
ta.select();
try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
document.body.removeChild(ta);
btn.textContent = ok ? '已复制' : txt;
setTimeout(function () { btn.textContent = '复制参数'; }, 1800);
});
}
window.addEventListener('keydown', function (e) {
if (e.key.toLowerCase() === 'h') {
const el = document.getElementById('tune');
if (el) el.classList.toggle('on');
}
});
})();
const AUD = { ac: null, gain: null, on: true, ready: false };
function initAudio() {
if (AUD.ready) return;
const AC = window.AudioContext || window.webkitAudioContext;
if (!AC) return;
try {
const ac = new AC();
const master = ac.createGain();
master.gain.value = 0;
const filter = ac.createBiquadFilter();
filter.type = 'lowpass';
filter.frequency.value = 260;
const o1 = ac.createOscillator();
o1.type = 'sine'; o1.frequency.value = 46;
const o2 = ac.createOscillator();
o2.type = 'sine'; o2.frequency.value = 69.5;
const g2 = ac.createGain(); g2.gain.value = 0.28;
o1.connect(filter);
o2.connect(g2); g2.connect(filter);
filter.connect(master);
master.connect(ac.destination);
o1.start(); o2.start();
AUD.ac = ac; AUD.gain = master; AUD.ready = true;
} catch (e) { /* 静默失败 */ }
}
function ensureAudio() {
initAudio();
if (AUD.ac && AUD.ac.state === 'suspended') AUD.ac.resume();
}
function thud() {
if (!AUD.ready || !AUD.on) return;
const ac = AUD.ac;
const t0 = ac.currentTime;
const o = ac.createOscillator();
const g = ac.createGain();
o.type = 'sine';
o.frequency.setValueAtTime(84, t0);
o.frequency.exponentialRampToValueAtTime(26, t0 + 0.55);
g.gain.setValueAtTime(0.0001, t0);
g.gain.exponentialRampToValueAtTime(0.35, t0 + 0.012);
g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9);
o.connect(g); g.connect(ac.destination);
o.start(t0); o.stop(t0 + 0.95);
}
const ringEl = document.getElementById('ring');
const ringC = ringEl ? ringEl.querySelector('circle') : null;
const hintEl = document.getElementById('hint');
function near() {
if (!M.has) return false;
const dx = M.px - W / 2, dy = M.py - H / 2;
return Math.hypot(dx, dy) < Math.min(W, H) * 0.30;
}
function bindParticles() {
gl.bindBuffer(gl.ARRAY_BUFFER, buf);
const S = STRIDE * 4;
gl.enableVertexAttribArray(loc.aCloud);
gl.vertexAttribPointer(loc.aCloud, 3, gl.FLOAT, false, S, 0);
gl.enableVertexAttribArray(loc.aRose);
gl.vertexAttribPointer(loc.aRose, 3, gl.FLOAT, false, S, 12);
gl.enableVertexAttribArray(loc.aLightning);
gl.vertexAttribPointer(loc.aLightning, 3, gl.FLOAT, false, S, 24);
gl.enableVertexAttribArray(loc.aSeed);
gl.vertexAttribPointer(loc.aSeed, 3, gl.FLOAT, false, S, 36);
gl.enableVertexAttribArray(loc.aDelay);
gl.vertexAttribPointer(loc.aDelay, 1, gl.FLOAT, false, S, 48);
gl.enableVertexAttribArray(loc.aSize);
gl.vertexAttribPointer(loc.aSize, 1, gl.FLOAT, false, S, 52);
gl.enableVertexAttribArray(loc.aCol);
gl.vertexAttribPointer(loc.aCol, 1, gl.FLOAT, false, S, 56);
}
function drawQuad(prog, tex, scale, blurDir) {
gl.useProgram(prog);
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, tex);
gl.uniform1i(gl.getUniformLocation(prog, 'uTex'), 0);
if (scale !== undefined) gl.uniform1f(gl.getUniformLocation(prog, 'uScale'), scale);
if (blurDir) gl.uniform2f(gl.getUniformLocation(prog, 'uDir'), blurDir[0], blurDir[1]);
const p = gl.getAttribLocation(prog, 'aPos');
gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
gl.enableVertexAttribArray(p);
gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
function drawTone(tex) {
gl.useProgram(toneProg);
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, tex);
gl.uniform1i(gl.getUniformLocation(toneProg, 'uTex'), 0);
gl.uniform1f(gl.getUniformLocation(toneProg, 'uExposure'), CFG.exposure);
const p = gl.getAttribLocation(toneProg, 'aPos');
gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
gl.enableVertexAttribArray(p);
gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
function renderScene() {
gl.useProgram(partProg);
gl.uniform1f(uni.uTime, M.t);
gl.uniform1f(uni.uMorph, M.morph);
gl.uniform1f(uni.uShape, M.shape === 'lightning' ? 1 : 0);
gl.uniform1f(uni.uSpin, M.t * CFG.spin * 2.0);
gl.uniform1f(uni.uTilt, CFG.tilt * Math.PI / 180);
gl.uniform1f(uni.uScale, CFG.scale);
gl.uniform1f(uni.uPx, DPR);
gl.uniform1f(uni.uAspect, W / H);
gl.uniform1f(uni.uAlpha, CFG.alpha);
gl.uniform1f(uni.uHue, CFG.hue);
gl.uniform1f(uni.uSat, CFG.sat);
gl.uniform1f(uni.uSizeMul, CFG.size);
gl.uniform2f(uni.uCenter, 0, 0);
gl.uniform1f(uni.uFluct, CFG.fluct);
gl.uniform1f(uni.uTremor, (M.tremor || 0) * CFG.tremor * 0.055);
gl.uniform1f(uni.uGone, (M.goneN || 0) * CFG.swirl);
gl.uniform1f(uni.uRepel, M.repel || 0);
gl.uniform1f(uni.uBurst, M.burst || 0);
gl.uniform2f(uni.uMouse, M.mx || 0, M.my || 0);
gl.uniform2f(uni.uBurstC, M.burstX || 0, M.burstY || 0);
bindParticles();
gl.drawArrays(gl.POINTS, 0, Math.max(2000, Math.floor(N * (M.qual || 1))));
}
let last = 0, fpsT = 0, frames = 0;
const fpsEl = document.getElementById('fps');
const moEl = document.getElementById('mo');
function frame(now) {
const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
last = now;
M.t += dt;
M.wheel *= Math.exp(-dt * 1.5);            // 滚动带来的观测会衰减
M.repel *= Math.exp(-dt * 5.0);            // 指针拨开的力度
M.burst *= Math.exp(-dt * 2.1);            // 炸散环扩散完就消失
const speed = M.wheel;
const isNear = near();
const active = isNear || speed > 0.12;
if (M.phase === 'idle' || M.phase === 'gaze') {
if (active) {
M.phase = 'gaze';
M.target = 1;
if (M.morph > 0.55) {
M.holdT = Math.min(CFG.hold * 1.2, M.holdT + dt * (0.55 + speed * 1.7));
}
} else {
M.phase = 'idle';
M.target = 0;
M.holdT = Math.max(0, M.holdT - dt * 0.8);
}
if (M.holdT >= CFG.hold) { M.phase = 'gone'; M.gone = 0; M.target = 0; thud(); }
} else if (M.phase === 'gone') {
M.gone += dt;
M.target = 0;
const decayDuration = CFG.decay || 1.6;
if (M.gone > decayDuration) { M.phase = 'idle'; M.holdT = 0; }
}    /* 嵌入版：由外层开关决定玫瑰是否保持成形 */
if (window.__roseHold) { M.phase = 'gaze'; M.target = 1; M.holdT = 0; }
const prog0 = Math.min(1, M.holdT / CFG.hold);
M.tremor = (!window.__roseHold && M.phase !== 'gone')
? Math.pow(prog0, 2.2) * (0.55 + 0.45 * Math.sin(M.t * 6.0))
: 0;
M.goneN = M.phase === 'gone'
? Math.min(1, M.gone / (CFG.decay || 1.6))
: 0;
if (AUD.ready) {
const target = (AUD.on && M.phase !== 'gone') ? M.morph * 0.9 * 0.085 : 0;
AUD.gain.gain.value += (target - AUD.gain.gain.value) * (1 - Math.exp(-dt * 6));
}
const rate = M.target > M.morph ? CFG.charge : CFG.charge * 3.0;
M.morph += (M.target - M.morph) * (1 - Math.exp(-dt * rate));
frames++; fpsT += dt;
if (fpsT > 0.5) {
const f = frames / fpsT;
fpsEl.textContent = Math.round(f);
frames = 0; fpsT = 0;
moEl.textContent = M.morph.toFixed(2);
if (CFG.autoQ) {
if (f < 45 && M.qual > CFG.qMin) M.qual = Math.max(CFG.qMin, M.qual - 0.08);
else if (f > 58 && M.qual < 1) M.qual = Math.min(1, M.qual + 0.04);
} else M.qual = 1;
}
const prog = Math.min(1, M.holdT / CFG.hold);
const hud2 = document.getElementById('hud2');
if (hud2) {
hud2.innerHTML = 'scroll <b>' + speed.toFixed(2) + '</b> · sound <b>' +
(AUD.on ? 'on' : 'off') + '</b> · tilt <b>' + CFG.tilt.toFixed(0) + '</b>';
}
if (ringEl) ringEl.classList.toggle('on', prog > 0.02 && M.phase !== 'gone');
if (ringC) ringC.style.strokeDashoffset = (289 * (1 - prog)).toFixed(1);
hintEl.classList.toggle('on', M.phase === 'idle' && !active);
if (M.phase === 'gone') { hintEl.textContent = '但玫瑰在我看到它的瞬间就消失了'; hintEl.classList.add('on'); }
else hintEl.textContent = '把光标移到中央凝视 · 或者快速滑动滚轮';
gl.disable(gl.BLEND);
gl.bindFramebuffer(gl.FRAMEBUFFER, scene.fbo);
gl.viewport(0, 0, W, H);
gl.clearColor(0.02, 0.024, 0.04, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.enable(gl.BLEND);
gl.blendFunc(gl.ONE, gl.ONE);
renderScene();
if (bloomOK && CFG.bloomOn) {
gl.disable(gl.BLEND);
gl.bindFramebuffer(gl.FRAMEBUFFER, bloomA.fbo);
gl.viewport(0, 0, bloomA.w, bloomA.h);
gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
drawQuad(copyProg, scene.tex, 1.0);
gl.bindFramebuffer(gl.FRAMEBUFFER, bloomB.fbo);
gl.clear(gl.COLOR_BUFFER_BIT);
drawQuad(blurProg, bloomA.tex, undefined, [1.0 / bloomA.w, 0]);
gl.bindFramebuffer(gl.FRAMEBUFFER, bloomA.fbo);
gl.clear(gl.COLOR_BUFFER_BIT);
drawQuad(blurProg, bloomB.tex, undefined, [0, 1.0 / bloomA.h]);
}
gl.bindFramebuffer(gl.FRAMEBUFFER, null);
gl.viewport(0, 0, W, H);
gl.clearColor(0.02, 0.024, 0.04, 1);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.disable(gl.BLEND);
drawTone(scene.tex);
if (bloomOK && CFG.bloomOn) {
gl.enable(gl.BLEND);
gl.blendFunc(gl.ONE, gl.ONE);
drawQuad(copyProg, bloomA.tex, CFG.bloom * (CFG.bloomGain || 1));
gl.disable(gl.BLEND);
}
if (roseVisible) requestAnimationFrame(frame);
else roseRunning = false;
}
let roseVisible = true;
let roseRunning = false;
function startLoop() {
if (!roseRunning && roseVisible) {
roseRunning = true;
requestAnimationFrame(frame);
}
}
if (typeof IntersectionObserver !== 'undefined') {
const obs = new IntersectionObserver((entries) => {
for (const entry of entries) {
roseVisible = entry.isIntersecting;
if (roseVisible) startLoop();
}
}, { threshold: 0.01 });
obs.observe(canvas);
}
resize();
startLoop();
window.__roseM = M;
};