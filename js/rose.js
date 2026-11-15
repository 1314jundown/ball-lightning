window.roseStage = function () {
'use strict';
const CFG = {
count: 120000,     // 粒子数（60k→120k：同尺寸下点更实；再翻倍花心/下缘会叠到过曝）
size: 1.25,        // 点大小倍率
alpha: 0.75,       // 每个点的亮度（这个数一高就爆）
hue: 232,          // 主色相（蓝紫；原来是 202 冷青）
sat: 0.88,         // 饱和度（蓝紫要靠饱和度撑，低于 0.8 会发灰）
tilt: 55,          // 俯视角（度）——36° 会被读成"碗口"，55° 才看得出层层花瓣
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
if (window.TUNE) {
if ((window.TUNE.hue | 0) === 0) window.TUNE.hue = 30;
if ((window.TUNE.size | 0) === 100) window.TUNE.size = 88;
}
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
(function () {
if (window.__roseGaze) return;
var HOLD_MS = 5000;      // 连续观测多久触发消散
var DISSOLVE_S = 3.5;    // 消散时长（临时写进 CFG.decay）
var LEAVE_MS = 900;      // 离开容错：短暂丢帧不打断；真转开 0.9s 就开始往回聚
var RESTORE_MS = 2400;   // 复原时长（由 CFG.charge 的指数趋近自然给出）
var COOL_MS = 1200;      // 复原后的冷却，防止在边缘反复抽搐
var DETECT_MS = 110;     // 检测 9fps（同步推理，压到 8–12fps 免阻塞主线程）
var HUE_SHIFT = 38;      // 消散时色相 232 → 270（蓝紫 → 紫）；常态若被 03 调回 202，消散就落 240
var BASE = 'assets/gaze/';
var S = {
state: 'waiting', cam: false, asking: false, denied: false, errMsg: '', gen: 0,
face: false, holdMs: 0, lostFor: 0, faceLast: -1e9, prev: 0, cool: 0,
busy: false, det: null, opts: null, lib: null, libErr: '',
land: false, pitch: 0, pitchBase: 0, cal: [], downMs: 0,
timer: 0, stream: null, gone: false,
dissolveAt: 0, dissolveProg: 0, restoreAt: 0, restoreProg: 0,
prevDecay: 0, prevCharge: 0, baseHue: 232, hue: 232,
el: null, video: null, btn: null, bar: null, dot: null, txt: null, box: null
};
window.__roseGaze = S;
var CSS = [
'#roseGaze{position:absolute;left:auto;right:clamp(16px,3.4vw,48px);bottom:auto;top:70px;',
'width:clamp(186px,14.5vw,212px);z-index:7;',
'font-family:var(--mono);color:#cfe4ea;opacity:.96;transition:opacity .3s}',
'#roseGaze[data-cam="1"] .rg-video{opacity:1}',
'#roseGaze[data-cam="1"] .rg-empty{display:none}',
'#roseGaze[data-state="detected"] .rg-dot,#roseGaze[data-state="observing"] .rg-dot{background:#7fd4e8;box-shadow:0 0 10px rgba(127,212,232,.9)}',
'#roseGaze[data-state="dissolving"] .rg-dot,#roseGaze[data-state="dispersed"] .rg-dot{background:#b48cf0;box-shadow:0 0 10px rgba(180,140,240,.9)}',
'#roseGaze[data-state="dissolving"] .rg-bar i,#roseGaze[data-state="dispersed"] .rg-bar i{background:#b48cf0;box-shadow:0 0 9px rgba(180,140,240,.85)}',
'#roseGaze[data-state="restoring"] .rg-dot{background:#7fd4e8;animation:rgPulse 1.1s infinite}',
'#roseGaze[data-state="waiting"]{opacity:.78}#roseGaze[data-cam="1"]{opacity:.96}',
'#roseGaze[data-state="waiting"]:hover{opacity:.96}',
'@keyframes rgPulse{50%{opacity:.2}}',
'#roseGaze .rg-head{display:flex;align-items:center;gap:6px;margin:0 0 7px;font-size:10px;letter-spacing:.18em;',
'text-transform:uppercase;color:#8fa2aa;text-shadow:0 1px 6px rgba(0,0,0,.9)}',
'#roseGaze .rg-dot{width:5px;height:5px;border-radius:50%;background:#4a565c;flex:0 0 auto}',
'#roseGaze .rg-name{color:#cfe4ea;letter-spacing:.2em}',
'#roseGaze .rg-txt{margin-left:auto;max-width:190px;text-align:right;font-size:10px;letter-spacing:.04em;color:#8fa2aa;',
'white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
'#roseGaze .rg-screen{position:relative;width:100%;aspect-ratio:4/3;border:1px solid rgba(150,190,205,.3);',
'border-radius:3px;overflow:hidden;background:#05070a;',
'box-shadow:0 30px 70px -34px rgba(0,0,0,.98),0 0 0 1px rgba(0,0,0,.5)}',
'#roseGaze .rg-video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;transform:scaleX(-1);',
'filter:saturate(.55) contrast(1.08) brightness(.94);opacity:0;transition:opacity .45s}',
'#roseGaze .rg-face{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;',
'transform:scaleX(1);opacity:0;transition:opacity .3s}',
'#roseGaze[data-cam="1"] .rg-face{opacity:1}',
'#roseGaze[data-cam="1"]{width:clamp(240px,19vw,278px)}',
'#roseGaze .rg-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:10px;',
'letter-spacing:.16em;color:#5b686e;text-align:center;line-height:1.7;padding:0 12px;',
'background:repeating-linear-gradient(0deg,rgba(127,212,232,.05) 0 1px,transparent 1px 3px)}',
'#roseGaze .rg-res{position:absolute;right:6px;top:6px;z-index:2;font-size:9px;letter-spacing:.1em;color:rgba(180,210,220,.55)}',
'#roseGaze .rg-bar{position:absolute;left:0;right:0;bottom:0;height:1px;background:rgba(127,212,232,.13);z-index:2}',
'#roseGaze .rg-bar i{display:block;height:100%;width:0;background:#7fd4e8;box-shadow:0 0 9px rgba(127,212,232,.85);transition:width .12s linear}',
'#roseGaze .rg-btn{position:absolute;left:7px;bottom:8px;z-index:3;font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;',
'color:#dfeef2;padding:6px 11px;border-radius:999px;border:1px solid rgba(196,225,254,.36);background:rgba(10,14,18,.74);',
'backdrop-filter:blur(6px);cursor:pointer;transition:.2s}',
'#roseGaze .rg-btn:hover{border-color:rgba(127,212,232,.9);color:#fff;background:rgba(18,30,36,.92)}',
'#roseChoice [data-gaze-start]{display:inline-flex;align-items:center;gap:11px;padding:12px 22px;font-size:13px;',
'border-radius:999px;border:1px solid rgba(150,195,255,.42);color:#dbe9ff;cursor:pointer;letter-spacing:.02em;',
'background:rgba(92,138,255,.10);box-shadow:0 0 26px -6px rgba(92,138,255,.45),inset 0 0 14px rgba(120,170,255,.10);',
'transition:background .25s ease,border-color .25s ease,box-shadow .25s ease}',
'#roseChoice [data-gaze-start]:hover{background:rgba(110,158,255,.18);border-color:rgba(178,214,255,.72);',
'box-shadow:0 0 32px -4px rgba(110,160,255,.62),inset 0 0 16px rgba(140,190,255,.16)}',
'#roseChoice [data-gaze-start]::before{content:"";width:13px;height:13px;border-radius:50%;',
'border:1.5px solid currentColor;box-shadow:0 0 9px rgba(160,210,255,.75)}'
].join('');
function mount() {
if (S.el) return true;
var host = document.getElementById('rose');
if (!host) return false;
var st = document.createElement('style');
st.id = 'roseGazeCss';
st.textContent = CSS;
document.head.appendChild(st);
var el = document.createElement('div');
el.id = 'roseGaze';
el.dataset.state = 'waiting';
el.dataset.cam = '0';
el.setAttribute('title', '摄像头画面只在本机处理，不上传');
el.innerHTML =
'<div class="rg-head"><span class="rg-dot"></span><span class="rg-name">观察者</span>' +
'<span class="rg-txt">未接入</span></div>' +
'<div class="rg-screen">' +
'<video class="rg-video" playsinline muted autoplay></video>' +
'<canvas class="rg-face"></canvas>' +
'<div class="rg-empty"><span>CAMERA OFF</span></div>' +
'<span class="rg-res"></span>' +
'<div class="rg-bar"><i></i></div>' +
'<button class="rg-btn" type="button">开始观测</button>' +
'</div>';
host.appendChild(el);
S.el = el;
S.video = el.querySelector('.rg-video');
S.btn = el.querySelector('.rg-btn');
S.bar = el.querySelector('.rg-bar i');
S.txt = el.querySelector('.rg-txt');
S.res = el.querySelector('.rg-res');
S.empty = el.querySelector('.rg-empty span');
S.fcan = el.querySelector('.rg-face');
place();
[600, 1500, 3000].forEach(function (t) { setTimeout(place, t); });
var figEl = document.getElementById('roseFigure');
if (figEl && window.ResizeObserver) {
S.ro = new ResizeObserver(function () { place(); });
S.ro.observe(figEl);
}
S.btn.addEventListener('click', function () {
if (!S.cam) start(); else stop();
});
document.addEventListener('click', function (e) {
var t = e.target && e.target.closest ? e.target : null;
if (!t) return;
if (t.closest('[data-gaze-start]')) {
if (!S.cam) start(); else stop();
return;
}
if (S.cam && t.closest('#roseChoice')) stop();
}, true);
document.addEventListener('visibilitychange', function () {
if (document.hidden) stop();
});
window.addEventListener('hashchange', function () {
setTimeout(function () {
var r = document.getElementById('rose');
if (!r || !r.classList.contains('on')) stop();
place();                                  // 换屏回来，玫瑰换了位置
}, 340);
});
window.addEventListener('resize', place);
setTimeout(place, 400);                       // 字体/布局定下来之后再摆一次
return true;
}
function pitchRatio(lm) {
var p = lm && lm.positions;
if (!p || p.length < 68) return 0;
var eye = 0, i;
for (i = 36; i <= 47; i++) eye += p[i].y;
eye /= 12;
var nose = p[30].y;
var mouth = 0;
for (i = 48; i <= 67; i++) mouth += p[i].y;
mouth /= 20;
var up = nose - eye;
if (up < 4) return 0;                    // 脸太小/角度太怪，别用
return (mouth - nose) / up;
}
function place() {
if (!S.el) return;
var host = S.el.parentNode;
var fig = document.getElementById('roseFigure');
if (!host || !fig) return;
var hr = host.getBoundingClientRect();
var fr = fig.getBoundingClientRect();
if (!hr.width || !fr.width) return;              // 这屏还没显示，等下次
var nav = document.getElementById('toc');
var minTop = nav ? Math.max(8, nav.getBoundingClientRect().bottom - hr.top + 10) : 8;
var w = S.el.offsetWidth, h = S.el.offsetHeight;
var left = Math.round(fr.right - hr.left - w);   // 右边缘与玫瑰对齐
var top = Math.round(fr.top - hr.top - h - 12);  // 优先浮在玫瑰上方 12px
if (top < minTop) top = minTop;                  // 不许钻进顶栏
if (left < 8) left = 8;    S.el.style.left = left + 'px';
S.el.style.top = top + 'px';
S.el.style.right = 'auto';
S.el.style.bottom = 'auto';
}
function drawFace(d) {
var cv = S.fcan;
if (!cv || !cv.clientWidth) return;
var w = cv.clientWidth, h = cv.clientHeight;
var dpr = Math.min(2, window.devicePixelRatio || 1);
if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
cv.width = Math.round(w * dpr);
cv.height = Math.round(h * dpr);
}
var x = cv.getContext('2d');
x.setTransform(dpr, 0, 0, dpr, 0, 0);
x.clearRect(0, 0, w, h);
if (!d || !d.box || !S.vw || !S.vh) return;
var ar = S.vw / S.vh, boxAr = w / h;
var dw = ar > boxAr ? w : h * ar;
var dh = ar > boxAr ? w / ar : h;
var ox = (w - dw) / 2, oy = (h - dh) / 2;
var b = d.box;
var sx = dw / S.vw, sy = dh / S.vh;
var X = ox + (S.vw - b.x - b.width) * sx;        // 画面是镜像的，x 要翻过来
var Y = oy + b.y * sy;
var W2 = b.width * sx, H2 = b.height * sy;
var len = Math.min(18, Math.min(W2, H2) * 0.3);
function corners() {
x.beginPath();
x.moveTo(X, Y + len); x.lineTo(X, Y); x.lineTo(X + len, Y);
x.moveTo(X + W2 - len, Y); x.lineTo(X + W2, Y); x.lineTo(X + W2, Y + len);
x.moveTo(X + W2, Y + H2 - len); x.lineTo(X + W2, Y + H2); x.lineTo(X + W2 - len, Y + H2);
x.moveTo(X + len, Y + H2); x.lineTo(X, Y + H2); x.lineTo(X, Y + H2 - len);
}
corners(); x.lineWidth = 4; x.strokeStyle = 'rgba(127,232,214,.16)'; x.stroke();
corners(); x.lineWidth = 1.6; x.strokeStyle = 'rgba(160,244,230,.96)'; x.stroke();
if (d.score) {
x.font = '600 10px ' + (getComputedStyle(cv).fontFamily || 'monospace');
x.fillStyle = 'rgba(190,246,238,.95)';
x.fillText('FACE ' + d.score.toFixed(2), X + 1, Math.max(11, Y - 5));
}
}
function setState(s) {
S.state = s;
if (!S.el) return;
if (S.el.dataset.state !== s) S.el.dataset.state = s;
var c = S.cam ? '1' : '0';
if (S.el.dataset.cam !== c) {
S.el.dataset.cam = c;
place();                       // 宽度跟着 cam 态变，位置得重算
}
paint();
}
function paint() {
if (!S.el) return;
var t, b = '停止观测', w = 0, st = S.state;
if (S.asking) { t = '请求权限…'; b = '取消'; }
else if (S.denied) { t = S.errMsg || '摄像头未授权'; b = '重试'; }
else if (!S.cam) { t = '未接入'; b = '开始观测'; }
else if (st === 'detected') { t = '发现观测者'; w = S.holdMs / HOLD_MS; }
else if (st === 'observing') {
t = S.libErr || ('观测中 · ' + (S.holdMs / 1000).toFixed(1) + ' / 5.0s');
w = S.holdMs / HOLD_MS;
} else if (st === 'dissolving') { t = '消散中 · ' + Math.round(S.dissolveProg * 100) + '%'; w = S.dissolveProg; }
else if (st === 'dispersed') { t = '已消散 · 保持'; w = 1; }
else if (st === 'restoring') { t = '重新聚合 · ' + Math.round(S.restoreProg * 100) + '%'; w = 1 - S.restoreProg; }
else { t = S.libErr || '等待观测'; }
if (S.cam && S.dark && (st === 'waiting' || st === 'detected')) t = '画面全黑 · 检查遮挡';
else if (S.cam && S.downMs > 400 && (st === 'waiting' || st === 'detected')) t = '视线偏离 · 抬起头';
if (S.txt.textContent !== t) S.txt.textContent = t;
if (S.btn.textContent !== b) S.btn.textContent = b;
var ws = Math.min(100, Math.max(0, w * 100)).toFixed(1) + '%';
if (S.bar.style.width !== ws) S.bar.style.width = ws;
var et = 'CAMERA OFF';
if (S.denied) et = (S.errMsg || '摄像头不可用') + '<br>点地址栏的锁图标 → 摄像头 → 允许';
else if (S.noSig) et = '无信号<br>检查摄像头是否被其它程序占用';
else if (S.cam) et = '';
if (S.empty && S.empty.innerHTML !== et) S.empty.innerHTML = et;
var rt = S.cam ? ((S.vw || 0) + '×' + (S.vh || 0)) : '';
if (S.res && S.res.textContent !== rt) S.res.textContent = rt;
var gb = document.querySelector('#roseChoice [data-gaze-start]');
if (gb) {
var gt = S.cam ? '停止观测' : (S.asking ? '取消' : '开启摄像头观测');
if (gb.textContent !== gt) gb.textContent = gt;
}
}
function fail(msg) {
S.libErr = '';
S.asking = false;
S.cam = false;
if (S.stream) { S.stream.getTracks().forEach(function (t) { t.stop(); }); S.stream = null; }
if (S.timer) { clearInterval(S.timer); S.timer = 0; }
if (S.video) S.video.srcObject = null;
S.denied = true;
S.errMsg = msg || '摄像头不可用';
setState('waiting');
}
function ensureLib() {
if (S.lib) return S.lib;
S.lib = new Promise(function (res, rej) {
if (window.faceapi) return res(window.faceapi);
var s = document.createElement('script');
s.src = BASE + 'face-api.js';
s.async = true;
s.onload = function () { window.faceapi ? res(window.faceapi) : rej(new Error('检测库异常')); };
s.onerror = function () { rej(new Error('检测库加载失败')); };
document.head.appendChild(s);
}).then(function (fa) {
return fa.nets.tinyFaceDetector.loadFromUri(BASE).then(function () {
S.opts = new fa.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.4 });
S.det = fa;
S.libErr = '';
paint();
return fa.nets.faceLandmark68TinyNet.loadFromUri(BASE).then(function () {
S.land = true;
}).catch(function () { S.land = false; });
});
});
return S.lib;
}
var CONSTRAINTS = [
{ video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false },
{ video: { facingMode: 'user' }, audio: false },
{ video: true, audio: false }
];
function grab(i) {
return navigator.mediaDevices.getUserMedia(CONSTRAINTS[i]).catch(function (e) {
var loose = e && (e.name === 'OverconstrainedError' || e.name === 'NotFoundError' || e.name === 'TypeError');
if (loose && i + 1 < CONSTRAINTS.length) return grab(i + 1);
throw e;
});
}
function start() {
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
fail('此浏览器不支持摄像头');
return;
}
S.asking = true;
S.denied = false;
S.errMsg = '';
S.noSig = false;
S.playErr = false;
S.vw = 0;
S.vh = 0;
S.gen++;
var g = S.gen;
var CFG = window.__roseCFG;
S.baseHue = CFG ? CFG.hue : 232;
S.hue = S.baseHue;
setState('waiting');
if (navigator.permissions && navigator.permissions.query) {
navigator.permissions.query({ name: 'camera' }).then(function (p) {
if (p.state === 'denied' && g === S.gen) fail('摄像头被站点设置阻止');
}).catch(function () {});
}
grab(0).then(function (stream) {
if (g !== S.gen) { stream.getTracks().forEach(function (t) { t.stop(); }); return; }
S.stream = stream;
var v = S.video;
v.onloadedmetadata = function () {
S.vw = v.videoWidth;
S.vh = v.videoHeight;
S.noSig = false;
paint();
};
v.srcObject = stream;
var p = v.play();
if (p && p.catch) p.catch(function () { S.playErr = true; paint(); });
var tr = stream.getVideoTracks()[0];
if (tr) tr.onended = function () { fail('摄像头已断开'); };
S.asking = false; S.cam = true;
S.prev = 0; S.holdMs = 0; S.lostFor = 0; S.faceLast = -1e9; S.cool = 0; S.gone = false;
S.dissolveProg = 0; S.restoreProg = 0;
S.pitch = 0; S.pitchBase = 0; S.cal = []; S.downMs = 0;
setState('waiting');
ensureLib().catch(function (e) { S.libErr = (e && e.message) || '检测库加载失败'; paint(); });
if (S.timer) clearInterval(S.timer);
S.timer = setInterval(tick, DETECT_MS);
clearTimeout(S.watch);
S.watch = setTimeout(function () {
if (g === S.gen && S.cam && S.video && S.video.readyState < 2) { S.noSig = true; paint(); }
}, 3000);
}).catch(function (e) {
if (g !== S.gen) return;
S.asking = false;
var n = (e && e.name) || '';
fail(n === 'NotAllowedError' ? '未授权摄像头'
: n === 'NotReadableError' ? '摄像头被其它程序占用'
: n === 'NotFoundError' ? '没找到摄像头'
: '摄像头不可用 ' + n);
});
}
function stop() {
S.gen++;
if (S.timer) { clearInterval(S.timer); S.timer = 0; }
clearTimeout(S.watch); S.watch = 0;
S.noSig = false; S.playErr = false; S.vw = 0; S.vh = 0;
if (S.stream) { S.stream.getTracks().forEach(function (t) { t.stop(); }); S.stream = null; }
if (S.video) S.video.srcObject = null;
var CFG = window.__roseCFG;
if (S.prevDecay && CFG) { CFG.decay = S.prevDecay; S.prevDecay = 0; }
if (S.prevCharge && CFG) { CFG.charge = S.prevCharge; S.prevCharge = 0; }
if (CFG && S.baseHue) CFG.hue = S.baseHue;            // 色相也还回去
if (S.gone) { S.gone = false; window.__roseHold = true; }  // 停掉观测就把玫瑰还回去
S.face = false; S.holdMs = 0; S.lostFor = 0;
S.asking = false; S.cam = false; S.denied = false; S.errMsg = '';
S.dissolveProg = 0; S.restoreProg = 0;
S.boxD = null; S.boxAt = 0;
S.pitch = 0; S.pitchBase = 0; S.cal = []; S.downMs = 0;
drawFace(null);                                       // 关摄像头就把脸框擦掉
setState('waiting');
}
function tick() {
if (!S.stream) return;
var now = performance.now();
var dt = S.prev ? Math.min(1000, now - S.prev) : 0;
S.prev = now;
if (S.busy && now - (S.busyAt || 0) > 1500) S.busy = false;
if (S.det && !S.busy && S.video && S.video.readyState >= 2) {
S.busy = true;
S.busyAt = now;
var chain = S.det.detectSingleFace(S.video, S.opts);
if (S.land) { try { chain = chain.withFaceLandmarks(true); } catch (e2) { S.land = false; } }
chain.then(function (d) {
S.busy = false;
var det = d && (d.detection || d);        // 带关键点时结果多包了一层
if (det && det.score >= 0.4) {
S.faceLast = performance.now();
S.boxD = det;
S.boxAt = S.faceLast;
drawFace(det);
if (d && d.landmarks) {
var r = pitchRatio(d.landmarks);
if (r > 0.05 && r < 20) {
S.pitch = r;
if (S.cal.length < 12) {
S.cal.push(r);
if (S.cal.length === 12) {
S.cal.sort(function (a, b) { return a - b; });
S.pitchBase = S.cal[6];
}
}
}
}
} else if (S.boxAt && performance.now() - S.boxAt > 420) {
S.boxD = null;
drawFace(null);                 // 丢了脸就把框擦掉，别留个假框
}
}).catch(function () { S.busy = false; });
}
var leave = Math.max(LEAVE_MS, Math.min(3000, dt * 3));
S.face = (now - S.faceLast) < leave;
if (S.pitchBase && S.pitch < S.pitchBase * 0.75) S.downMs += dt; else S.downMs = 0;
if (S.downMs > 700) S.face = false;
if (S.face) S.lostFor = 0; else S.lostFor += dt;
if (S.video && S.video.readyState >= 2 && now - (S.probeAt || 0) > 1300) {
S.probeAt = now;
try {
if (!S.pcv) { S.pcv = document.createElement('canvas'); S.pcv.width = 32; S.pcv.height = 24; }
var px = S.pcv.getContext('2d', { willReadFrequently: true });
px.drawImage(S.video, 0, 0, 32, 24);
var dd = px.getImageData(0, 0, 32, 24).data, n2 = dd.length / 4;
var sum = 0, sum2 = 0;
for (var k = 0; k < dd.length; k += 4) {
var lum = dd[k] * 0.3 + dd[k + 1] * 0.59 + dd[k + 2] * 0.11;
sum += lum; sum2 += lum * lum;
}
var men = sum / n2;
var sd = Math.sqrt(Math.max(0, sum2 / n2 - men * men));
var wasDark = S.dark;
S.dark = sd < 2.5 && men < 48;      // 整片死色 → 没有真实画面
if (wasDark !== S.dark) paint();
} catch (e) { /* 不可读就跳过，不打扰主流程 */ }
}
if (S.state === 'dissolving') {
S.dissolveProg = Math.min(1, (now - S.dissolveAt) / (DISSOLVE_S * 1000));
var C3 = window.__roseCFG;
if (C3) C3.charge = S.dissolveProg < 0.72 ? 0.05 : 0.50;
if (S.dissolveProg >= 1) setState('dispersed');
} else if (S.state === 'dispersed') {
if (S.lostFor >= LEAVE_MS) beginRestore(now);     // 转开脸 0.9s 后开始往回聚
} else if (S.state === 'restoring') {
S.restoreProg = Math.min(1, (now - S.restoreAt) / RESTORE_MS);
if (S.restoreProg >= 1) {
S.holdMs = 0;
S.cool = now + COOL_MS;
var C2 = window.__roseCFG;
if (C2 && S.prevCharge) { C2.charge = S.prevCharge; S.prevCharge = 0; }
setState('waiting');
}
} else {                                            // waiting / detected / observing
if (S.face && now > S.cool) {
S.holdMs = Math.min(HOLD_MS, S.holdMs + dt);
setState(S.holdMs >= 800 ? 'observing' : 'detected');
if (S.holdMs >= HOLD_MS) beginDissolve(now);
} else {
S.holdMs = Math.max(0, S.holdMs - dt * 0.5);
if (S.state !== 'waiting') setState('waiting');
}
}
var target = (S.state === 'dissolving' || S.state === 'dispersed') ? S.baseHue + HUE_SHIFT : S.baseHue;
S.hue += (target - S.hue) * (1 - Math.exp(-dt / 380));
var CFG = window.__roseCFG;
if (CFG) CFG.hue = S.hue;
paint();
}
function beginDissolve(now) {
var CFG = window.__roseCFG || {};
S.gone = true;
S.dissolveAt = now;
S.dissolveProg = 0;
if (!S.prevDecay) S.prevDecay = CFG.decay || 1.6;
CFG.decay = DISSOLVE_S;               // 3.5s 慢慢卸，不是 1.6s 一闪
if (!S.prevCharge) {
S.prevCharge = CFG.charge || 0.95;
CFG.charge = 0.30;                  // 形态下降速率也要压慢，否则 0.2s 就塌成雾
}
window.__roseHold = false;
var M = window.__roseM;
if (M) { M.phase = 'gone'; M.gone = 0; M.target = 0; M.holdT = 0; }
setState('dissolving');
}
function beginRestore(now) {
var CFG = window.__roseCFG;
S.gone = false;
S.restoreAt = now;
S.restoreProg = 0;
S.holdMs = 0;
if (S.prevDecay && CFG) { CFG.decay = S.prevDecay; S.prevDecay = 0; }
if (CFG) {
if (!S.prevCharge) S.prevCharge = CFG.charge || 0.95;
CFG.charge = 1.4;                   // 上升速率：1.4 时 2.8s 收敛到 98%
}
window.__roseHold = true;             // 沿原轨迹反向聚拢（morph 按 aDelay 分先后）
setState('restoring');
}
S.start = start; S.stop = stop; S.tick = tick; S.paint = paint;
var tries = 0;
var boot = setInterval(function () {
tries++;
if (mount() || tries > 240) clearInterval(boot);
}, 250);
})();
(function () {
function roseHeal() {
var host = document.getElementById('rose');
if (!host || !host.classList.contains('on')) return false;
if (window.__roseM) return true;
if (typeof window.roseStage !== 'function') return false;
window.roseStage();
window.__roseHold = true;
return true;
}
var roseHealN = 0;
var roseHealTimer = setInterval(function () {
roseHealN++;
if (roseHeal() || roseHealN > 40) clearInterval(roseHealTimer);
}, 250);
window.addEventListener('hashchange', function () { setTimeout(roseHeal, 350); });
})();