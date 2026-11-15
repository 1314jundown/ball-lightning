(function () {
'use strict';
var THREE = window.THREE;
if (!THREE) return;
var renderer = null;
function getRenderer() {
if (renderer) return renderer;
var canvas = document.createElement('canvas');
canvas.className = 'rl-shot-canvas';
renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
renderer.setClearColor(0x000000, 0);
if ('outputColorSpace' in renderer && THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
return renderer;
}
var camera = new THREE.PerspectiveCamera(40, 2, 0.1, 90);
var viewScale = 1;
var SIZE_K = 0.95;   /* 设计稿按 180px 高调尺寸，别的分辨率按等比放大 */
function pose(t, cfg) {
var az = cfg.az + (cfg.sway || 0) * Math.sin(t * (cfg.swaySpeed || 0.24));
var d = cfg.dist * viewScale;
camera.position.set(
cfg.target.x + Math.sin(az) * d * Math.cos(cfg.el),
cfg.target.y + Math.sin(cfg.el) * d,
cfg.target.z + Math.cos(az) * d * Math.cos(cfg.el)
);
camera.lookAt(cfg.target);
}
function rnd(a, b) { return a + Math.random() * (b - a); }
function gauss() {
var u = 0, v = 0;
while (!u) u = Math.random();
while (!v) v = Math.random();
return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function ease(x) { return x * x * (3 - 2 * x); }
var dotTex = null;
function dotTexture() {
if (dotTex) return dotTex;
var c = document.createElement('canvas');
c.width = c.height = 64;
var g = c.getContext('2d');
var grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
grd.addColorStop(0, 'rgba(255,255,255,1)');
grd.addColorStop(0.46, 'rgba(255,255,255,0.92)');
grd.addColorStop(0.82, 'rgba(255,255,255,0.3)');
grd.addColorStop(1, 'rgba(255,255,255,0)');
g.fillStyle = grd;
g.fillRect(0, 0, 64, 64);
dotTex = new THREE.CanvasTexture(c);
return dotTex;
}
function pmat(color, size, opacity, extra) {
var o = {
map: dotTexture(), color: color, size: size * SIZE_K, sizeAttenuation: true,
transparent: true, opacity: opacity, blending: THREE.AdditiveBlending,
depthWrite: false
};
if (extra) for (var k in extra) o[k] = extra[k];
var m = new THREE.PointsMaterial(o);
m.userData.baseSize = size * SIZE_K;
return m;
}
function toArr(list) {
var a = new Float32Array(list.length * 3);
for (var i = 0; i < list.length; i++) {
a[i * 3] = list[i].x; a[i * 3 + 1] = list[i].y; a[i * 3 + 2] = list[i].z;
}
return a;
}
function pts(list, material) {
var g = new THREE.BufferGeometry();
g.setAttribute('position', new THREE.BufferAttribute(toArr(list), 3));
return new THREE.Points(g, material);
}
function cloud(n, cx, cy, cz, sx, sy, sz, color, size, opacity) {
var list = [];
for (var i = 0; i < n; i++) {
list.push(new THREE.Vector3(cx + gauss() * sx, cy + gauss() * sy, cz + gauss() * sz));
}
return pts(list, pmat(color, size, opacity));
}
function blob(n, cx, cy, cz, rx, ry, rz, colIn, colOut, size, opacity) {
var list = [], cols = [];
var a = new THREE.Color(colIn), b = new THREE.Color(colOut), t = new THREE.Color();
for (var i = 0; i < n; i++) {
var th = Math.acos(2 * Math.random() - 1);
var ph = Math.random() * Math.PI * 2;
var r = Math.pow(Math.random(), 0.5);
var nx = Math.sin(th) * Math.cos(ph), ny = Math.cos(th), nz = Math.sin(th) * Math.sin(ph);
list.push(new THREE.Vector3(cx + nx * r * rx, cy + ny * r * ry, cz + nz * r * rz));
t.copy(a).lerp(b, Math.min(1, r * 1.1));
cols.push(t);
}
var g = new THREE.BufferGeometry();
g.setAttribute('position', new THREE.BufferAttribute(toArr(list), 3));
var carr = new Float32Array(list.length * 3);
for (var j = 0; j < cols.length; j++) {
carr[j * 3] = cols[j].r; carr[j * 3 + 1] = cols[j].g; carr[j * 3 + 2] = cols[j].b;
}
g.setAttribute('color', new THREE.BufferAttribute(carr, 3));
var p = new THREE.Points(g, pmat(0xffffff, size, opacity, { vertexColors: true }));
p.frustumCulled = false;
return p;
}
function groundGrid(scene, radius, step, color, size, opacity) {
var list = [];
for (var i = 0; i < 2300; i++) {
var a = Math.random() * Math.PI * 2;
var r = Math.pow(Math.random(), 0.62) * radius;
var gx = Math.round(Math.cos(a) * r / step) * step;
var gz = Math.round(Math.sin(a) * r / step) * step;
list.push(new THREE.Vector3(gx, 0, gz));
}
var p = pts(list, pmat(color || 0x467fbe, size || 0.038, opacity || 0.68));
p.frustumCulled = false;
scene.add(p);
return p;
}
function lineFrom(list, color, opacity) {
var g = new THREE.BufferGeometry().setFromPoints(list);
var m = new THREE.LineBasicMaterial({
color: color, transparent: true, opacity: opacity,
blending: THREE.AdditiveBlending, depthWrite: false
});
return new THREE.Line(g, m);
}
function ringLine(scene, radius, y, color, opacity, tiltX, tiltZ) {
var list = [], n = 160;
for (var i = 0; i <= n; i++) {
var a = i / n * Math.PI * 2;
list.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
}
var l = lineFrom(list, color || 0x6f9fd8, opacity || 0.28);
l.position.y = y || 0;
l.rotation.x = tiltX || 0;
l.rotation.z = tiltZ || 0;
scene.add(l);
return l;
}
function groundLines(scene, half, step, color, opacity) {
var pos = [], col = [];
var c = new THREE.Color(color || 0x3f6fb0);
function seg(x1, z1, x2, z2) {
for (var s = 0; s < 8; s++) {
var t0 = s / 8, t1 = (s + 1) / 8;
var ax = x1 + (x2 - x1) * t0, az = z1 + (z2 - z1) * t0;
var bx = x1 + (x2 - x1) * t1, bz = z1 + (z2 - z1) * t1;
var f0 = Math.max(0, 1 - Math.sqrt(ax * ax + az * az) / half);
var f1 = Math.max(0, 1 - Math.sqrt(bx * bx + bz * bz) / half);
pos.push(ax, 0.002, az, bx, 0.002, bz);
col.push(c.r * f0, c.g * f0, c.b * f0, c.r * f1, c.g * f1, c.b * f1);
}
}
for (var i = -half; i <= half + 0.001; i += step) {
seg(-half, i, half, i);
seg(i, -half, i, half);
}
var g = new THREE.BufferGeometry();
g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
var l = new THREE.LineSegments(g, new THREE.LineBasicMaterial({
vertexColors: true, transparent: true, opacity: opacity || 0.5,
blending: THREE.AdditiveBlending, depthWrite: false
}));
l.frustumCulled = false;
scene.add(l);
return l;
}
function floorGlow(scene, radius, color, opacity) {
var c = document.createElement('canvas');
c.width = c.height = 256;
var g = c.getContext('2d');
var grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
grd.addColorStop(0, 'rgba(255,255,255,0.9)');
grd.addColorStop(0.42, 'rgba(255,255,255,0.32)');
grd.addColorStop(1, 'rgba(255,255,255,0)');
g.fillStyle = grd;
g.fillRect(0, 0, 256, 256);
var tex = new THREE.CanvasTexture(c);
var m = new THREE.MeshBasicMaterial({
map: tex, color: color, transparent: true, opacity: opacity,
blending: THREE.AdditiveBlending, depthWrite: false
});
var mesh = new THREE.Mesh(new THREE.PlaneGeometry(radius * 2, radius * 2), m);
mesh.rotation.x = -Math.PI / 2;
mesh.position.y = 0.008;
scene.add(mesh);
return mesh;
}
function groundTicks(scene, radius, count, color, opacity) {    var list = [];
for (var i = 0; i < count; i++) {
var a = i / count * Math.PI * 2;
var x = Math.cos(a), z = Math.sin(a);
for (var k = 0; k <= 3; k++) {
var r = radius * (1 + k * 0.018);
list.push(new THREE.Vector3(x * r, 0.004, z * r));
}
}
var p = pts(list, pmat(color || 0x5b8fd0, 0.03, opacity || 0.5));
p.frustumCulled = false;
scene.add(p);
return p;
}
function path3(x0, y0, z0, x1, y1, z1, depth, jit) {
var list = [new THREE.Vector3(x0, y0, z0), new THREE.Vector3(x1, y1, z1)];
var amp = jit;
for (var d = 0; d < depth; d++) {
var out = [list[0]];
for (var i = 0; i < list.length - 1; i++) {
var a = list[i], b = list[i + 1];
var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, mz = (a.z + b.z) / 2;
var nx = -(b.z - a.z), nz = (b.x - a.x);
var nl = Math.sqrt(nx * nx + nz * nz) || 1;
var off = rnd(-amp, amp);
out.push(new THREE.Vector3(
mx + nx / nl * off, my + rnd(-amp * 0.3, amp * 0.3), mz + nz / nl * off
));
out.push(b);
}
list = out;
amp *= 0.74;
}
return list;
}
function resample(list, n) {
var lens = [], total = 0, i;
for (i = 1; i < list.length; i++) {
var d = list[i].distanceTo(list[i - 1]);
lens.push(d); total += d;
}
if (!total) return list.slice();
var out = [], step = total / (n - 1), acc = 0, seg = 0;
for (var k = 0; k < n; k++) {
var target = k * step;
while (seg < lens.length - 1 && acc + lens[seg] < target) { acc += lens[seg]; seg++; }
var f = lens[seg] ? clamp((target - acc) / lens[seg], 0, 1) : 1;
var a = list[seg], b = list[seg + 1];
out.push(new THREE.Vector3(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f, a.z + (b.z - a.z) * f));
}
return out;
}
function stepped(t, t0, t1, steps) {
if (t <= t0) return 0;
if (t >= t1) return 1;
var p = (t - t0) / (t1 - t0) * steps;
var s = Math.floor(p), f = p - s;
return Math.min(1, (s + Math.min(1, f * 3)) / steps);
}
function disposeScene(scene) {
scene.traverse(function (o) {
if (o.geometry) o.geometry.dispose();
if (o.material) {
if (o.material.map && o.material.map !== dotTex) o.material.map.dispose();
o.material.dispose();
}
});
}
function buildLeader() {
var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x03060c, 9, 30);
groundGrid(scene, 14, 0.22, 0x4a7dbe, 0.05, 0.7);
floorGlow(scene, 7.5, 0x1d3a6b, 0.55);
groundLines(scene, 9, 0.7, 0x2f5a94, 0.22);
scene.add(blob(2400, 0, 3.02, 0, 1.5, 0.72, 1.15, 0xe6f0ff, 0x3d5f96, 0.05, 0.72));
scene.add(blob(700, 0, 3.0, 0, 0.72, 0.34, 0.56, 0xffffff, 0x9fc0f0, 0.045, 0.6));
ringLine(scene, 1.55, 3.02, 0x8fb8ee, 0.42, -0.34, 0.06);
ringLine(scene, 1.95, 3.02, 0x6f9fd8, 0.3, 0.26, -0.05);
groundTicks(scene, 3.2, 40, 0x5b8fd0, 0.45);
var ex = rnd(-0.7, 0.7), ez = rnd(-0.45, 0.45);
var path = path3(rnd(-1.2, 1.2), 2.72, rnd(-0.6, 0.6), ex, 0.03, ez, 6, 0.62);
var core = resample(path, 120);
var bolt = lineFrom(path, 0xbcd6ff, 0.9);
scene.add(bolt);
var corePts = pts(core, pmat(0xe6f0ff, 0.028, 0.95));
var glowPts = pts(core, pmat(0x6f97e0, 0.22, 0.16));
scene.add(corePts, glowPts);
var tip = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3)), pmat(0xffffff, 0.11, 0));
scene.add(tip);
var contact = new THREE.Vector3(ex, 0.03, ez);
var flash = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3)), pmat(0xdfe9ff, 0.5, 0));
flash.position.copy(contact);
scene.add(flash);
var ringList = [];
for (var ri = 0; ri < 90; ri++) {
var ra = ri / 90 * Math.PI * 2;
ringList.push(new THREE.Vector3(Math.cos(ra), 0, Math.sin(ra)));
}
var ring = pts(ringList, pmat(0x9fc0ff, 0.07, 0));
ring.position.copy(contact);
scene.add(ring);
var sparkList = [], sparkVel = [], sparkN = 150;
for (var s = 0; s < sparkN; s++) {
sparkList.push(new THREE.Vector3(ex, 0.03, ez));
sparkVel.push(new THREE.Vector3(rnd(-1.5, 1.5), rnd(1.2, 3.0), rnd(-1.0, 1.0)));
}
var sparks = pts(sparkList, pmat(0xcfe0ff, 0.045, 0));
scene.add(sparks);
var bi = Math.round(path.length * 0.36);
var bx = path[bi].x, by = path[bi].y, bz = path[bi].z;
var branchPts = path3(bx, by, bz, bx - rnd(0.9, 1.3), by - rnd(0.5, 0.9), bz + rnd(-0.6, 0.6), 4, 0.3);
var branch = lineFrom(branchPts, 0x8fa9d8, 0);
var branchCore = pts(resample(branchPts, 60), pmat(0xc5d8ff, 0.055, 0));
scene.add(branch, branchCore);
var branchEnd = branchPts[branchPts.length - 1];
var CFG = { target: new THREE.Vector3(0, 1.7, 0), dist: 9.4, el: 0.32, az: 0.02, sway: 0.28, swaySpeed: 0.22 };
var T_START = 0.8, T_HIT = 9.0, DUR = 18.5;
var lineMat = bolt.material;
var noteCloud = new THREE.Vector3(0, 3.0, 0);
var noteStep = new THREE.Vector3(bx, by, bz);
var noteContact = new THREE.Vector3(ex, 0.25, ez);
var noteBranch = new THREE.Vector3(branchEnd.x, branchEnd.y, branchEnd.z);
return {
scene: scene,
duration: DUR,
ui: {
scale: 'SCALE 示意 · 非等比',
captions: [
{ t0: 0.3, t1: 4.4, text: '闪电不是“劈”下来的，是“摸”下来的。' },
{ t0: 4.6, t1: 9.0, text: '它一路往下试，每走几十米停一下——这叫先导。' },
{ t0: 9.2, t1: 13.6, text: '碰到地面的那一瞬，整条路才被一次性点亮——回击。' },
{ t0: 13.8, t1: DUR, text: '所以会有分叉：那些没走通的路，留在了半空。' }
],
notes: [
{ t0: 0.6, t1: 3.2, at: noteCloud, text: '云底：冰晶和霰粒把电荷分开了' },
{ t0: 3.0, t1: 9.0, at: noteStep, text: '每步几十米，停一下再试' },
{ t0: 9.4, t1: 13.6, at: noteContact, text: '回击：整条通道一次点亮' },
{ t0: 13.9, t1: DUR, at: noteBranch, text: '没走通的分支' }
]
},
update: function (t) {
pose(t, CFG);
var grow = stepped(t, T_START, T_HIT, 7);
var n = Math.max(2, Math.round(grow * (path.length - 1)));
bolt.geometry.setDrawRange(0, n);
var cn = Math.max(2, Math.round(grow * (core.length - 1)));
corePts.geometry.setDrawRange(0, cn);
glowPts.geometry.setDrawRange(0, cn);
var isTip = grow > 0 && grow < 1;
var tp = tip.geometry.attributes.position;
tp.setXYZ(0, core[cn - 1].x, core[cn - 1].y, core[cn - 1].z);
tp.needsUpdate = true;
tip.material.opacity = isTip ? 0.9 * (0.55 + 0.45 * Math.sin(t * 20)) : 0;
var since = t - T_HIT;
if (since >= 0) {
var k = clamp(1 - since / 2.4, 0, 1);
lineMat.opacity = 0.55 + 0.45 * k;
corePts.material.opacity = 0.5 + 0.5 * k;
glowPts.material.opacity = 0.08 + 0.45 * k;
var fl = clamp(1 - since / 0.9, 0, 1);
flash.material.size = 0.42 + 0.9 * (1 - fl);
flash.material.opacity = 0.95 * fl * fl + 0.12 * clamp(1 - (since - 2.4) / 4, 0, 1);
var rg = clamp(since / 1.5, 0, 1);
ring.scale.setScalar(0.15 + 2.1 * rg);
ring.material.opacity = 0.55 * (1 - rg);
var sp = sparks.geometry.attributes.position;
for (var i = 0; i < sparkN; i++) {
var v = sparkVel[i];
var tt = Math.min(since, 1.5);
sp.setXYZ(i, ex + v.x * tt, 0.03 + v.y * tt - 2.6 * tt * tt, ez + v.z * tt);
}
sp.needsUpdate = true;
sparks.material.opacity = 0.85 * clamp(1 - since / 1.6, 0, 1);
} else {
lineMat.opacity = 0.92;
corePts.material.opacity = 0.95;
glowPts.material.opacity = 0.14;
flash.material.opacity = 0;
ring.material.opacity = 0;
sparks.material.opacity = 0;
}
var b = clamp((t - 13.6) / 1.2, 0, 1);
branch.material.opacity = 0.4 * b;
branchCore.material.opacity = 0.6 * b;
}
};
}
function buildDecohere() {
var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x03060c, 9, 30);
groundGrid(scene, 13, 0.24, 0x4a7dbe, 0.05, 0.65);
floorGlow(scene, 7, 0x1b3560, 0.5);
groundLines(scene, 9, 0.7, 0x2f5a94, 0.2);
ringLine(scene, 1.9, 0.015, 0x6f9fd8, 0.4, 0, 0);
groundTicks(scene, 2.9, 36, 0x5b8fd0, 0.4);
var K = 13;
var centers = [-0.95, 0.95];
var groups = [];
var i, k;
for (k = 0; k < 2; k++) {
var c = centers[k];
var cohList = [], cohCol = [];
var colA = new THREE.Color(0xc2dcff), colB = new THREE.Color(0xffc79b);
var tries = 0;
while (cohList.length < 900 && tries < 60000) {
tries++;
var th = Math.acos(2 * Math.random() - 1);
var ph = Math.random() * Math.PI * 2;
var rr = Math.pow(Math.random(), 0.5);
var x = c + Math.sin(th) * Math.cos(ph) * rr * 0.72;
if (Math.abs(x - c) > 0.72) continue;
var y = 0.95 + Math.cos(th) * rr * 0.78;
var z = Math.sin(th) * Math.sin(ph) * rr * 0.8;
if (Math.cos(K * x) * Math.cos(K * x) < Math.random()) continue;
cohList.push(new THREE.Vector3(x, y, z));
cohCol.push(Math.cos(K * x) > 0 ? colA : colB);
}
var g = new THREE.BufferGeometry();
g.setAttribute('position', new THREE.BufferAttribute(toArr(cohList), 3));
var colArr = new Float32Array(cohList.length * 3);
for (i = 0; i < cohList.length; i++) {
colArr[i * 3] = cohCol[i].r; colArr[i * 3 + 1] = cohCol[i].g; colArr[i * 3 + 2] = cohCol[i].b;
}
g.setAttribute('color', new THREE.BufferAttribute(colArr, 3));
var coh = new THREE.Points(g, pmat(0xffffff, 0.045, 1, { vertexColors: true }));
scene.add(coh);
var incList = [];
for (i = 0; i < 620; i++) {
incList.push(new THREE.Vector3(c + gauss() * 0.4, 0.95 + gauss() * 0.5, gauss() * 0.52));
}
var inc = pts(incList, pmat(0x8fa8dd, 0.05, 0));
scene.add(inc);
var frList = [], frCol = [];
for (i = 0; i < 900; i++) {
var fx = c + gauss() * 0.58;
if (Math.abs(fx - c) > 0.66) continue;
if (Math.cos(K * fx) * Math.cos(K * fx) < Math.random()) continue;
frList.push(new THREE.Vector3(fx, 0.95 + gauss() * 0.52, gauss() * 0.08));
frCol.push(Math.cos(K * fx) > 0 ? colA : colB);
}
var fg = new THREE.BufferGeometry();
fg.setAttribute('position', new THREE.BufferAttribute(toArr(frList), 3));
var fca = new Float32Array(frList.length * 3);
for (i = 0; i < frList.length; i++) {
fca[i * 3] = frCol[i].r; fca[i * 3 + 1] = frCol[i].g; fca[i * 3 + 2] = frCol[i].b;
}
fg.setAttribute('color', new THREE.BufferAttribute(fca, 3));
var fr = new THREE.Points(fg, pmat(0xffffff, 0.055, 1, { vertexColors: true }));
scene.add(fr);
groups.push({ coh: coh, inc: inc, fr: fr });
}
var envList = [], envHome = [], envN = 210;
for (i = 0; i < envN; i++) {
var a = Math.random() * Math.PI * 2;
var r = rnd(2.2, 3.2);
var yy = 0.95 + gauss() * 0.9;
var p = new THREE.Vector3(Math.cos(a) * r, yy, Math.sin(a) * r * 0.8);
envHome.push(p.clone());
envList.push(p.clone());
}
var env = pts(envList, pmat(0x9db8e8, 0.035, 0.5));
scene.add(env);
var CFG = { target: new THREE.Vector3(0, 1.0, 0), dist: 7.4, el: 0.3, az: 0.04, sway: 0.3, swaySpeed: 0.18 };
var DUR = 17;
var DEC = 8.8, MERGE = 11.6;
var noteLobes = new THREE.Vector3(0, 1.75, 0);
var noteFringe = new THREE.Vector3(0, 0.35, 0);
return {
scene: scene,
duration: DUR,
ui: {
scale: 'SCALE 示意 · 非等比',
captions: [
{ t0: 0.3, t1: 4.4, text: '一个电子可以同时走两条路——前提是没人看它。' },
{ t0: 4.6, t1: 9.0, text: '两条路撞在一起，会互相抵消出一排条纹。' },
{ t0: 9.2, t1: 13.4, text: '空气分子一撞进来，条纹就没了——退相干。' },
{ t0: 13.6, t1: DUR, text: '越大越藏不住：一粒灰尘，10⁻²⁰ 秒就露馅。' }
],
notes: [
{ t0: 3.4, t1: 8.6, at: noteLobes, text: '两条路，同一时刻都在' },
{ t0: 4.8, t1: 8.6, at: noteFringe, text: '明暗相间的地方，是它们互相抵消／加强' },
{ t0: 9.0, t1: 13.2, at: new THREE.Vector3(0, 2.15, 0.9), text: '环境分子撞进来' },
{ t0: 12.6, t1: DUR, at: new THREE.Vector3(0, 1.9, 0), text: '现在它只有一条路' }
]
},
update: function (t) {
pose(t, CFG);
var dec = clamp((t - DEC) / 2.4, 0, 1);
var merge = ease(clamp((t - MERGE) / 1.9, 0, 1));
for (var gi = 0; gi < groups.length; gi++) {
var G = groups[gi];
G.coh.material.opacity = 0.5 * (1 - dec);
G.fr.material.opacity = 1 - dec;
G.inc.material.opacity = dec * 0.85;
var shift = (gi === 0 ? 1 : -1) * 0.95 * merge;
G.coh.position.x = shift;
G.fr.position.x = shift;
G.inc.position.x = shift;
}
var ep = env.geometry.attributes.position;
for (var i = 0; i < envN; i++) {
var home = envHome[i];
var ph = (t * 0.35 + i * 0.017) % 1;
var r = 1 - 0.62 * ease(ph);
var y = home.y + Math.sin(t * 0.8 + i) * 0.06;
ep.setXYZ(i, home.x * r, y * (0.4 + 0.6 * r), home.z * r);
}
ep.needsUpdate = true;
env.material.opacity = 0.5 * (0.4 + 0.6 * clamp(1 - Math.abs(t - DEC) / 6, 0, 1));
}
};
}
function simApproach(v0, K, dt, maxT) {
var d = 2.3, v = -v0, t = 0, arr = [];
while (t <= maxT) {
arr.push([t, d]);
var acc = K / (d * d);
v += acc * dt;
d += v * dt;
t += dt;
if (d < 0.2) break;
}
return arr;
}
function sampleAt(arr, t) {
for (var i = 1; i < arr.length; i++) {
if (arr[i][0] >= t) {
var a = arr[i - 1], b = arr[i];
var f = (t - a[0]) / Math.max(1e-4, b[0] - a[0]);
return a[1] + (b[1] - a[1]) * f;
}
}
return arr[arr.length - 1][1];
}
function buildBarrier() {
var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x03060c, 9, 30);
groundGrid(scene, 13, 0.23, 0x4678b8, 0.05, 0.68);
floorGlow(scene, 7, 0x1b3560, 0.5);
groundLines(scene, 9, 0.7, 0x2f5a94, 0.2);
var TRACK = 0.55;
var track = lineFrom([new THREE.Vector3(-3.1, TRACK, 0), new THREE.Vector3(3.1, TRACK, 0)], 0x3d6ba8, 0.75);
scene.add(track);
var ticks = [];
for (var i = -9; i <= 9; i++) {
ticks.push(new THREE.Vector3(i * 0.32, TRACK + 0.07, 0));
ticks.push(new THREE.Vector3(i * 0.32, TRACK - 0.07, 0));
}
scene.add(pts(ticks, pmat(0x4d7db8, 0.035, 0.55)));
ringLine(scene, 1.35, 0.012, 0x8fb8ee, 0.4, 0, 0);
ringLine(scene, 1.9, 0.012, 0x6f9fd8, 0.28, 0, 0);
groundTicks(scene, 3.0, 40, 0x5b8fd0, 0.4);
var hill = [], hcol = [], H = 0.95, R = 1.15;
var cBase = new THREE.Color(0x5b7cbf), cTop = new THREE.Color(0xe4efff);
for (var hi = 0; hi < 3200; hi++) {
var h = Math.pow(Math.random(), 1.15) * H;
var rr = (R * Math.pow(1 - h / H, 0.62) + 0.02) * Math.sqrt(Math.random());
var aa = Math.random() * Math.PI * 2;
hill.push(new THREE.Vector3(Math.cos(aa) * rr, TRACK + h * 0.9, Math.sin(aa) * rr));
hcol.push(cBase.clone().lerp(cTop, clamp(h / H, 0, 1)));
}
var hillGeo = new THREE.BufferGeometry();
hillGeo.setAttribute('position', new THREE.BufferAttribute(toArr(hill), 3));
var hcArr = new Float32Array(hill.length * 3);
for (var hci = 0; hci < hill.length; hci++) {
hcArr[hci * 3] = hcol[hci].r; hcArr[hci * 3 + 1] = hcol[hci].g; hcArr[hci * 3 + 2] = hcol[hci].b;
}
hillGeo.setAttribute('color', new THREE.BufferAttribute(hcArr, 3));
var wall = new THREE.Points(hillGeo, pmat(0xffffff, 0.034, 0.92, { vertexColors: true }));
scene.add(wall);
function nucleus(x) {
var list = [];
for (var j = 0; j < 140; j++) {
list.push(new THREE.Vector3(gauss() * 0.14, TRACK + gauss() * 0.14, gauss() * 0.14));
}
var g = new THREE.Group();
var core = pts(list, pmat(0xcfe0ff, 0.042, 0.95));
var halo = pts(list, pmat(0x6f97e0, 0.14, 0.2));
g.add(core, halo);
g.position.x = x;
g.userData = { core: core, halo: halo };
scene.add(g);
return g;
}
var A = nucleus(-1.15), B = nucleus(1.15);
var burstList = [];
for (var b = 0; b < 160; b++) {
burstList.push(new THREE.Vector3(gauss() * 0.1, gauss() * 0.1, gauss() * 0.1));
}
var burst = pts(burstList, pmat(0xffe9c9, 0.06, 0));
burst.position.y = TRACK + H * 0.9;
scene.add(burst);
var shellList = [];
for (var sh = 0; sh < 120; sh++) {
var st = Math.random() * Math.PI, sp = Math.random() * Math.PI * 2;
shellList.push(new THREE.Vector3(Math.sin(st) * Math.cos(sp), Math.cos(st), Math.sin(st) * Math.sin(sp)));
}
var shell = pts(shellList, pmat(0xffd9a8, 0.05, 0));
shell.position.set(0, TRACK + H * 0.9, 0);
scene.add(shell);
var prodList = [];
for (var pi = 0; pi < 70; pi++) {
prodList.push(new THREE.Vector3(gauss() * 0.055, gauss() * 0.055, gauss() * 0.055));
}
var product = pts(prodList, pmat(0xffe9c9, 0.08, 0));
product.position.y = TRACK + H * 0.9;
scene.add(product);
var CFG = { target: new THREE.Vector3(0, 0.75, 0), dist: 5.4, el: 0.19, az: -0.03, sway: 0.16, swaySpeed: 0.2 };
var DUR = 18;
var LOW = { t0: 1.0, t1: 6.4 }, HIGH = { t0: 9.0, t1: 14.6 };
var lowPath = simApproach(0.32, 0.34, 0.004, 4.6);
var highPath = simApproach(1.55, 0.34, 0.004, 4.6);
var fuseT = highPath[highPath.length - 1][0];
return {
scene: scene,
duration: DUR,
ui: {
scale: 'SCALE 示意 · 非等比',
captions: [
{ t0: 0.4, t1: 4.6, text: '两个原子核都带正电，越靠近，越被推开。' },
{ t0: 4.8, t1: 9.0, text: '400 米每秒撞过去，只够爬这道墙的百万分之一。' },
{ t0: 9.2, t1: 13.6, text: '要翻过去，得让它们热到上亿度——太阳就是这么干的。' },
{ t0: 13.8, t1: DUR, text: '聚变点火，说到底就是“热到能翻过这道墙”。' }
],
notes: [
{ t0: 0.6, t1: 9.0, at: new THREE.Vector3(0, TRACK + 1.05, 0), text: '库仑势垒：越靠近越亮，也就是越难爬' },
{ t0: 4.7, t1: 6.8, at: new THREE.Vector3(-2.0, TRACK + 0.35, 0), text: '400 m/s ≈ 1.7 meV，只爬了一点点' },
{ t0: 9.2, t1: 13.8, at: new THREE.Vector3(0, TRACK + 1.15, 0), text: '1 亿 K ≈ 10 keV，翻过去了' }
]
},
update: function (t) {
pose(t, CFG);
var local, path, idle = false;
if (t >= LOW.t0 && t < LOW.t1) { local = t - LOW.t0; path = lowPath; }
else if (t >= HIGH.t0) { local = t - HIGH.t0; path = highPath; }
else { idle = true; local = 0; path = lowPath; }
var d = idle ? 2.3 : sampleAt(path, local);
var ax = -d / 2, bx = d / 2;
var ry = function (r) {
return H * (1 - Math.pow(clamp(Math.abs(r) / R, 0, 1), 1 / 0.62));
};
A.position.set(ax, TRACK + Math.max(0, ry(ax)), 0);
B.position.set(bx, TRACK + Math.max(0, ry(bx)), 0);
A.userData.core.material.opacity = idle ? 0.95 : 0.95;
var near = clamp(1 - (d - 0.2) / 1.6, 0, 1);
A.userData.halo.material.opacity = 0.16 + 0.3 * near;
B.userData.halo.material.opacity = 0.16 + 0.3 * near;
wall.material.opacity = 0.2 + 0.5 * near;
var fused = !idle && path === highPath && d <= 0.26;
A.visible = !fused;
B.visible = !fused;
if (fused) {
var k = clamp((local - fuseT + 0.35) / 2.2, 0, 1);
burst.material.opacity = 0.95 * (1 - k);
burst.scale.setScalar(1 + 2.6 * Math.sqrt(k));
shell.scale.setScalar(0.12 + 1.5 * k);
shell.material.opacity = 0.7 * (1 - k);
wall.material.opacity = 0.12;
product.material.opacity = 0.95 * clamp((local - fuseT + 0.7) / 1.0, 0, 1);
} else {
burst.material.opacity = 0;
burst.scale.setScalar(1);
shell.material.opacity = 0;
product.material.opacity = 0;
}
}
};
}
function mount(host, id) {
var shot = SHOTS[id];
if (!shot || !host) return null;
var r = getRenderer();
var built = shot.build();
var dur = built.duration || 8;
r.domElement.style.width = '100%';
r.domElement.style.height = '100%';
r.domElement.style.display = 'block';
host.appendChild(r.domElement);
var ro = null;
function fit() {
var w = Math.max(2, host.clientWidth || 360);
var h = Math.max(2, host.clientHeight || Math.round(w / 2));
r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
r.setSize(w, h, false);
camera.aspect = w / h;
camera.updateProjectionMatrix();
viewScale = Math.min(0.95, Math.max(0.6, h / 1190));
var k = Math.min(2.6, Math.max(1.0, 470 / h));
built.scene.traverse(function (o) {
if (o.isPoints && o.material && o.material.userData.baseSize) {
o.material.size = o.material.userData.baseSize * k;
}
});
r.render(built.scene, camera);
}
fit();
if (window.ResizeObserver) {
ro = new ResizeObserver(function () { fit(); });
ro.observe(host);
}
var ui = document.createElement('div');
ui.className = 'shot-ui';
host.appendChild(ui);
var cap = document.createElement('div');
cap.className = 'shot-cap';
ui.appendChild(cap);
var uiData = built.ui || { captions: [], notes: [] };
if (uiData.scale) {
var scaleEl = document.createElement('div');
scaleEl.className = 'shot-scale';
scaleEl.textContent = uiData.scale;
ui.appendChild(scaleEl);
}
var tmp = new THREE.Vector3();
function project(el, p) {
tmp.copy(p).project(camera);
var vis = tmp.z < 1;
el.style.display = vis ? '' : 'none';
if (!vis) return;
var lx = Math.min(0.76, Math.max(0.24, tmp.x * 0.5 + 0.5));
var ly = Math.min(0.84, Math.max(0.12, -tmp.y * 0.5 + 0.5));
el.style.left = (lx * 100).toFixed(2) + '%';
el.style.top = (ly * 100).toFixed(2) + '%';
}
var noteEls = (uiData.notes || []).map(function (n) {
var el = document.createElement('div');
el.className = 'shot-note';
el.textContent = n.text;
ui.appendChild(el);
return { el: el, data: n, on: false };
});
var progress = document.createElement('div');
progress.className = 'shot-progress';
var bar = document.createElement('i');
progress.appendChild(bar);
ui.appendChild(progress);
function paintUI(t) {
var c = null;
for (var i = 0; i < uiData.captions.length; i++) {
var cc = uiData.captions[i];
if (t >= cc.t0 && t < cc.t1) { c = cc; break; }
}
if (c) {
if (cap.textContent !== c.text) cap.textContent = c.text;
cap.classList.add('on');
} else {
cap.classList.remove('on');
}
for (var j = 0; j < noteEls.length; j++) {
var ne = noteEls[j];
var on = t >= ne.data.t0 && t < ne.data.t1;
if (on !== ne.on) { ne.el.classList.toggle('on', on); ne.on = on; }
if (on && ne.data.at) project(ne.el, ne.data.at);
}
bar.style.transform = 'scaleX(' + (t / dur).toFixed(4) + ')';
}
var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var start = performance.now();
var raf = 0, playing = false, finished = false;
function frame(now) {
var t = Math.min((now - start) / 1000, dur);
built.update(t);
paintUI(t);
r.render(built.scene, camera);
if (t >= dur) { playing = false; finished = true; bar.classList.add('done'); return; }
if (playing) raf = requestAnimationFrame(frame);
}
if (reduce) {
built.update(dur);
paintUI(dur);
r.render(built.scene, camera);
bar.style.transform = 'scaleX(1)';
} else {
playing = true;
raf = requestAnimationFrame(frame);
}
function replay(e) {
if (reduce) return;
if (e && e.target !== r.domElement && e.target !== cap) return;
start = performance.now();
finished = false;
bar.classList.remove('done');
playing = true;
cancelAnimationFrame(raf);
raf = requestAnimationFrame(frame);
}
r.domElement.addEventListener('click', replay);
cap.addEventListener('click', replay);
function onVis() {
if (document.hidden) {
playing = false;
cancelAnimationFrame(raf);
} else if (!reduce && !finished) {
playing = true;
raf = requestAnimationFrame(frame);
}
}
document.addEventListener('visibilitychange', onVis);
return {
id: id,
destroy: function () {
playing = false;
cancelAnimationFrame(raf);
if (ro) ro.disconnect();
document.removeEventListener('visibilitychange', onVis);
r.domElement.removeEventListener('click', replay);
cap.removeEventListener('click', replay);
if (ui.parentNode) ui.parentNode.removeChild(ui);
if (r.domElement.parentNode) r.domElement.parentNode.removeChild(r.domElement);
disposeScene(built.scene);
}
};
}
function buildMagnet() {
var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x03060c, 12, 40);
groundGrid(scene, 12, 0.24, 0x3f6fb0, 0.042, 0.55);
groundLines(scene, 9, 0.7, 0x2f5a94, 0.18);
var R = 1.25, Y = 1.15, TUBE = 0.16;
var ringList = [], ringCol = [];
var cIn = new THREE.Color(0xdcebff), cOut = new THREE.Color(0x3f6aa8);
for (var i = 0; i < 2600; i++) {
var a = Math.random() * Math.PI * 2;
var tr = Math.sqrt(Math.random()) * TUBE;
var tb = Math.random() * Math.PI * 2;
var rad = R + Math.cos(tb) * tr;
ringList.push(new THREE.Vector3(Math.cos(a) * rad, Y + Math.sin(tb) * tr, Math.sin(a) * rad));
ringCol.push(cOut.clone().lerp(cIn, 1 - tr / TUBE));
}
var rg = new THREE.BufferGeometry();
rg.setAttribute('position', new THREE.BufferAttribute(toArr(ringList), 3));
var rca = new Float32Array(ringList.length * 3);
for (i = 0; i < ringList.length; i++) {
rca[i * 3] = ringCol[i].r; rca[i * 3 + 1] = ringCol[i].g; rca[i * 3 + 2] = ringCol[i].b;
}
rg.setAttribute('color', new THREE.BufferAttribute(rca, 3));
scene.add(new THREE.Points(rg, pmat(0xffffff, 0.048, 0.62, { vertexColors: true })));
var TRAIL = 26, trailPts = [], trailGeo = new THREE.BufferGeometry();
for (i = 0; i < TRAIL; i++) trailPts.push(new THREE.Vector3(0, Y, 0));
trailGeo.setAttribute('position', new THREE.BufferAttribute(toArr(trailPts), 3));
var trail = new THREE.Points(trailGeo, pmat(0xd8ecff, 0.095, 1));
scene.add(trail);
var pairN = 7, pairList = [];
for (i = 0; i < pairN * 2; i++) pairList.push(new THREE.Vector3(0, Y, 0));
var pairGeo = new THREE.BufferGeometry();
pairGeo.setAttribute('position', new THREE.BufferAttribute(toArr(pairList), 3));
var pairs = new THREE.Points(pairGeo, pmat(0x9fd0ff, 0.045, 0.6));
scene.add(pairs);
var CFG = { target: new THREE.Vector3(0, 1.05, 0), dist: 6.2, el: 0.42, az: 0.05, sway: 0.34, swaySpeed: 0.16 };
var DUR = 16;
var noteRing = new THREE.Vector3(0, 1.5, 0);
var noteCur = new THREE.Vector3(R, Y, 0);
return {
scene: scene,
duration: DUR,
ui: {
scale: 'SCALE 示意 · 非等比',
captions: [
{ t0: 0.3, t1: 4.6, text: '在超导体里，电子不是单个走的，是成对走的。' },
{ t0: 4.8, t1: 9.2, text: '一整个环里上亿对电子，共用一个量子态。' },
{ t0: 9.4, t1: 13.4, text: '所以电流可以一直绕下去，几年也不衰减。' },
{ t0: 13.6, t1: DUR, text: '这就是“宏观量子态”：大到能看见，还守着量子规矩。' }
],
notes: [
{ t0: 0.6, t1: 4.4, at: noteRing, text: '库珀对：两个电子结成一对' },
{ t0: 5.0, t1: 9.0, at: noteCur, text: '同一个量子态，环上处处相干' },
{ t0: 9.4, t1: DUR, at: noteCur, text: '没有电阻，电流绕环不衰减' }
]
},
update: function (t) {
pose(t, CFG);
var pos = trailGeo.attributes.position.array;
for (var i = 0; i < TRAIL; i++) {
var a = t * 0.55 - i * 0.045;
pos[i * 3] = Math.cos(a) * R;
pos[i * 3 + 1] = Y;
pos[i * 3 + 2] = Math.sin(a) * R;
}
trailGeo.attributes.position.needsUpdate = true;
var pp = pairGeo.attributes.position.array;
for (var k = 0; k < pairN; k++) {
var base = t * 0.42 + k / pairN * Math.PI * 2;
for (var s = 0; s < 2; s++) {
var ang = base + (s ? 0.09 : -0.09);
var idx = (k * 2 + s) * 3;
pp[idx] = Math.cos(ang) * (R + 0.02);
pp[idx + 1] = Y + (s ? 0.05 : -0.05);
pp[idx + 2] = Math.sin(ang) * (R + 0.02);
}
}
pairGeo.attributes.position.needsUpdate = true;
}
};
}
function buildSpectrum() {
var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x03060c, 12, 40);
groundGrid(scene, 11, 0.26, 0x3f6fb0, 0.04, 0.5);
groundLines(scene, 9, 0.7, 0x2f5a94, 0.16);
var Y = 1.25, R1 = 1.05, R2 = 0.5;
scene.add(blob(160, 0, Y, 0, 0.11, 0.11, 0.11, 0xfff0d0, 0xd08a4a, 0.06, 0.95));
ringLine(scene, R1, Y, 0x6f9fd8, 0.3, 0, 0);
ringLine(scene, R2, Y, 0x8fb8ee, 0.26, 0, 0);
var el = [], egeo = new THREE.BufferGeometry();
el.push(new THREE.Vector3(R1, Y, 0));
egeo.setAttribute('position', new THREE.BufferAttribute(toArr(el), 3));
var electron = new THREE.Points(egeo, pmat(0xe8f4ff, 0.13, 1));
scene.add(electron);
var PH = 18, phPts = [];
for (var i = 0; i < PH; i++) phPts.push(new THREE.Vector3(0, Y, 0));
var phGeo = new THREE.BufferGeometry();
phGeo.setAttribute('position', new THREE.BufferAttribute(toArr(phPts), 3));
var photon = new THREE.Points(phGeo, pmat(0xffd9a8, 0.075, 0));
scene.add(photon);
var LINES = [
{ y: 1.75, col: 0xff4d4d, t: 6.6 },
{ y: 1.25, col: 0xffd24d, t: 9.4 },
{ y: 0.75, col: 0x4db8ff, t: 12.2 }
];
var specList = [], specCol = [];
for (var s = 0; s < LINES.length; s++) {
for (var j = 0; j < 70; j++) {
specList.push(new THREE.Vector3(2.35, LINES[s].y - 0.16 + j * 0.0046, 0));
specCol.push(new THREE.Color(LINES[s].col));
}
}
var sg = new THREE.BufferGeometry();
sg.setAttribute('position', new THREE.BufferAttribute(toArr(specList), 3));
var sca = new Float32Array(specList.length * 3);
for (i = 0; i < specList.length; i++) {
sca[i * 3] = specCol[i].r; sca[i * 3 + 1] = specCol[i].g; sca[i * 3 + 2] = specCol[i].b;
}
sg.setAttribute('color', new THREE.BufferAttribute(sca, 3));
var spectrum = new THREE.Points(sg, pmat(0xffffff, 0.07, 0, { vertexColors: true }));
scene.add(spectrum);
var CFG = { target: new THREE.Vector3(0.6, 1.25, 0), dist: 7.0, el: 0.16, az: 0.02, sway: 0.22, swaySpeed: 0.18 };
var DUR = 16;
var T_DROP = 5.4;
return {
scene: scene,
duration: DUR,
ui: {
scale: 'SCALE 示意 · 非等比',
captions: [
{ t0: 0.3, t1: 4.8, text: '电子只能待在固定的几层上，不能停在中间。' },
{ t0: 5.0, t1: 9.0, text: '从上层掉到下层，就放出一份能量——一个光子。' },
{ t0: 9.2, t1: 13.2, text: '每份能量对应一个颜色，落在光谱上就是一根线。' },
{ t0: 13.4, t1: DUR, text: '氢的那根红线，波长 656 纳米。' }
],
notes: [
{ t0: 0.6, t1: 4.6, at: new THREE.Vector3(R1 * 0.7, Y + 0.42, 0), text: '两条能级：只能站这两层' },
{ t0: 5.6, t1: 8.8, at: new THREE.Vector3(0.9, Y + 0.5, 0), text: '掉一层，放一个光子' },
{ t0: 9.4, t1: DUR, at: new THREE.Vector3(2.35, Y + 0.6, 0), text: '光谱线：一根线一个颜色' }
]
},
update: function (t) {
pose(t, CFG);
var k = clamp((t - T_DROP) / 1.1, 0, 1);
var r = R1 + (R2 - R1) * ease(k);
var ang = t * 1.6;
var ep = egeo.attributes.position.array;
ep[0] = Math.cos(ang) * r;
ep[1] = Y;
ep[2] = Math.sin(ang) * r;
egeo.attributes.position.needsUpdate = true;
var fly = clamp((t - T_DROP - 0.5) / 1.6, 0, 1);
var pp = phGeo.attributes.position.array;
for (var i = 0; i < PH; i++) {
pp[i * 3] = 0.2 + fly * 2.3 + i * 0.03;
pp[i * 3 + 1] = Y + i * 0.008;
pp[i * 3 + 2] = 0;
}
phGeo.attributes.position.needsUpdate = true;
photon.material.opacity = fly > 0 && fly < 1 ? 0.95 : 0;
var vis = 0;
for (var s = 0; s < LINES.length; s++) if (t > LINES[s].t) vis = s + 1;
spectrum.material.opacity = Math.min(1, vis * 0.45);
}
};
}
var SHOTS = {
leader: {
what: '闪电是“摸”下来的，不是“劈”下来的：一路试，试到地面才亮。',
nums: '全程不到 1 毫秒',
build: buildLeader
},
decohere: {
what: '一个电子能同时走两条路，但身边一有东西撞它，就只剩一条。',
nums: '一粒灰尘的叠加态，约 10⁻²⁰ 秒就散了',
build: buildDecohere
},
barrier: {
what: '两个原子核都带正电，越近越难靠近；这就是聚变要“点火”的原因。',
nums: '400 m/s ≈ 1.7 meV · 聚变要 keV 量级 · 差约 10⁶ 倍',
build: buildBarrier
},
magnet: {
what: '超导环里，上亿对电子共用一个量子态，电流绕环几年也不衰减。',
nums: '宏观量子态：环上处处相干，持续电流已观测数年',
build: buildMagnet
},
spectrum: {
what: '电子只在固定能级之间跳，跳一次放一个光子，光谱上就是一根线。',
nums: '氢 Hα：656 nm · 能级差约 1.89 eV',
build: buildSpectrum
}
};
window.REALITY_SHOTS = { mount: mount, list: SHOTS };
})();