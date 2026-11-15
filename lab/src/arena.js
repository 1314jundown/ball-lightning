/* 球状闪电 · 试验场（3D 割草原型）
 * 结构参考：three.js 场景 + 数据驱动升级卡；刷怪节流参考 exhumed/zombieSpawner，
 * 命中闪光/焦痕贴花参考 exhumed/createMuzzleFlash、createBloodSplatter。 */
(function () {
  'use strict';
  var T = window.THREE;
  var boot = document.getElementById('boot');
  if (!T) { boot.textContent = 'three.js 没加载上'; return; }

  var W = window.innerWidth, H = window.innerHeight;
  var renderer = new T.WebGLRenderer({ antialias: true, alpha: false });
  var DPR_MAX = Math.min(window.devicePixelRatio || 1, 1.5);
  var dpr = DPR_MAX, bloomOn = true;   /* 自适应画质：帧率掉下来先降分辨率，再关泛光 */
  renderer.setPixelRatio(dpr);
  renderer.setSize(W, H);

  /* ---------- 后处理：亮部提取 + 两级模糊 + 叠加（自制 bloom，不依赖 addons） ---------- */
  var rtScene = new T.WebGLRenderTarget(W, H, { minFilter: T.LinearFilter, magFilter: T.LinearFilter });
  var rtA = new T.WebGLRenderTarget(W >> 2, H >> 2, { minFilter: T.LinearFilter, magFilter: T.LinearFilter });
  var rtB = new T.WebGLRenderTarget(W >> 2, H >> 2, { minFilter: T.LinearFilter, magFilter: T.LinearFilter });
  var quadScene = new T.Scene();
  var quadCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  var quadGeo = new T.PlaneGeometry(2, 2);
  var brightMat = new T.ShaderMaterial({
    uniforms: { tDiffuse: { value: rtScene.texture }, uThr: { value: 0.34 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: 'uniform sampler2D tDiffuse; uniform float uThr; varying vec2 vUv; void main(){ vec3 c = texture2D(tDiffuse, vUv).rgb; float l = dot(c, vec3(0.2126,0.7152,0.0722)); float k = smoothstep(uThr, uThr + 0.30, l); gl_FragColor = vec4(c * k, 1.0); }'
  });
  var blurMat = new T.ShaderMaterial({
    uniforms: { tDiffuse: { value: null }, uDir: { value: new T.Vector2(1, 0) }, uTexel: { value: new T.Vector2(1 / (W >> 2), 1 / (H >> 2)) } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: [
      'uniform sampler2D tDiffuse; uniform vec2 uDir; uniform vec2 uTexel; varying vec2 vUv;',
      'void main(){',
      '  vec2 d = uDir * uTexel;',
      '  vec3 c = texture2D(tDiffuse, vUv).rgb * 0.227027;',
      '  c += texture2D(tDiffuse, vUv + d * 1.3846).rgb * 0.316216;',
      '  c += texture2D(tDiffuse, vUv - d * 1.3846).rgb * 0.316216;',
      '  c += texture2D(tDiffuse, vUv + d * 3.2308).rgb * 0.070270;',
      '  c += texture2D(tDiffuse, vUv - d * 3.2308).rgb * 0.070270;',
      '  gl_FragColor = vec4(c, 1.0);',
      '}'
    ].join('\n')
  });
  var composeMat = new T.ShaderMaterial({
    uniforms: { tBase: { value: rtScene.texture }, tBloom: { value: rtA.texture }, uStr: { value: 1.55 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader: 'uniform sampler2D tBase; uniform sampler2D tBloom; uniform float uStr; varying vec2 vUv; void main(){ vec3 b = texture2D(tBase, vUv).rgb; vec3 g = texture2D(tBloom, vUv).rgb; gl_FragColor = vec4(b + g * uStr, 1.0); }'
  });
  var quad = new T.Mesh(quadGeo, composeMat);
  quad.frustumCulled = false;
  quadScene.add(quad);

  function bloomResize(w, h) {
    rtScene.setSize(w, h);
    rtA.setSize(Math.max(2, w >> 2), Math.max(2, h >> 2));
    rtB.setSize(Math.max(2, w >> 2), Math.max(2, h >> 2));
    blurMat.uniforms.uTexel.value.set(1 / Math.max(2, w >> 2), 1 / Math.max(2, h >> 2));
  }

  function bloomRender() {
    if (!bloomOn) { renderer.setRenderTarget(null); renderer.render(scene, camera); return; }
    renderer.setRenderTarget(rtScene);
    renderer.render(scene, camera);

    quad.material = brightMat;
    renderer.setRenderTarget(rtA);
    renderer.render(quadScene, quadCam);

    for (var i = 0; i < 2; i++) {
      blurMat.uniforms.tDiffuse.value = rtA.texture;
      blurMat.uniforms.uDir.value.set(1, 0);
      quad.material = blurMat;
      renderer.setRenderTarget(rtB);
      renderer.render(quadScene, quadCam);

      blurMat.uniforms.tDiffuse.value = rtB.texture;
      blurMat.uniforms.uDir.value.set(0, 1);
      renderer.setRenderTarget(rtA);
      renderer.render(quadScene, quadCam);
    }

    quad.material = composeMat;
    renderer.setRenderTarget(null);
    renderer.render(quadScene, quadCam);
  }

  document.body.appendChild(renderer.domElement);

  var scene = new T.Scene();
  scene.background = new T.Color(0x05070c);
  scene.fog = new T.FogExp2(0x05070c, 0.017);

  var camera = new T.PerspectiveCamera(52, W / H, 0.1, 900);
  camera.position.set(0, 13.5, 13.5);

  /* ---------- 场地 ---------- */
  var gridA = null, gridB = null, hz = null;
  var ground = new T.Mesh(new T.PlaneGeometry(900, 900), new T.MeshBasicMaterial({ color: 0x0a1424 }));
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  /* 场景灯：地面/标准材质用得上，线框物体不受影响 */
  scene.add(new T.AmbientLight(0x3f6ea8, 1.1));
  var keyLight = new T.DirectionalLight(0xbcd8ff, 0.9);
  keyLight.position.set(6, 18, 8);
  scene.add(keyLight);
  var rimLight = new T.DirectionalLight(0x2a5a9a, 0.6);
  rimLight.position.set(-8, 6, -10);
  scene.add(rimLight);

  (function grid() {
    var pts = [], n = 40, step = 4;
    for (var i = -n; i <= n; i++) {
      pts.push(i * step, 0.01, -n * step, i * step, 0.01, n * step);
      pts.push(-n * step, 0.01, i * step, n * step, 0.01, i * step);
    }
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pts, 3));
    var m = new T.LineBasicMaterial({ color: 0x2f6699, transparent: true, opacity: 0.9 });
    gridA = new T.LineSegments(g, m);
    scene.add(gridA);
    /* 每 5 格一条更亮的粗线，远处才不会糊成一片 */
    var pts2 = [], m2 = new T.LineBasicMaterial({ color: 0x4a8fd0, transparent: true, opacity: 0.55 });
    for (var j = -8; j <= 8; j++) {
      pts2.push(j * 20, 0.015, -n * step, j * 20, 0.015, n * step);
      pts2.push(-n * step, 0.015, j * 20, n * step, 0.015, j * 20);
    }
    var g2b = new T.BufferGeometry();
    g2b.setAttribute('position', new T.Float32BufferAttribute(pts2, 3));
    gridB = new T.LineSegments(g2b, m2);
    scene.add(gridB);
    scene.add(new T.LineSegments(g2b, m2));
  })();

  /* ---------- 玩家脚下的光圈 ---------- */
  var playerGlow = new T.Mesh(new T.PlaneGeometry(15, 15), new T.MeshBasicMaterial({
    map: radialTex('rgba(120,190,255,0.34)', 'rgba(40,90,170,0.12)'),
    transparent: true, blending: T.AdditiveBlending, depthWrite: false
  }));
  playerGlow.rotation.x = -Math.PI / 2;
  playerGlow.position.y = 0.03;
  scene.add(playerGlow);

  /* ---------- 贴图工具 ---------- */
  function radialTex(inner, outer) {
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var x = c.getContext('2d');
    var gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, inner); gr.addColorStop(0.45, outer); gr.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
    var t = new T.CanvasTexture(c); t.needsUpdate = true; return t;
  }
  var glowTex = radialTex('rgba(220,240,255,1)', 'rgba(90,170,255,0.55)');

  /* ---------- three.quarks 粒子（爆炸 / 余烬） ---------- */
  var QK = null;   /* 先关掉：启用后疑似第 2 波卡死，待复现 */
  var qSystems = [];
  var qMatCache = {};
  function quarksMaterial(colorHex, additive) {
    var key = colorHex + (additive ? 'a' : 'n');
    if (qMatCache[key]) return qMatCache[key];
    var m = new T.MeshBasicMaterial({
      map: glowTex, color: colorHex, transparent: true, depthWrite: false,
      blending: additive ? T.AdditiveBlending : T.NormalBlending
    });
    qMatCache[key] = m;
    return m;
  }

  function quarksBoom(pos, colorHex, count, spread) {
    if (!QK) return;
    try {
      var sys = new QK.ParticleSystem({
        duration: 0.9, looping: false, worldSpace: false, prewarm: false,
        shape: new QK.SphereEmitter(0.35),
        startLife: new QK.IntervalValue(0.28, 0.75),
        startSpeed: new QK.IntervalValue(1.5, spread || 6.5),
        startSize: new QK.IntervalValue(0.35, 1.15),
        startColor: new QK.ColorRange([
          new T.Vector4(1, 1, 1, 1),
          new T.Vector4(1, 0.72, 0.4, 0)
        ]),
        emissionOverTime: new QK.ConstantValue(count || 160),
        material: quarksMaterial(colorHex || 0xffffff, true),
        renderMode: QK.RenderMode.BillBoard,
        behaviors: [new QK.GravityForce(new T.Vector3(0, -3.2, 0))]
      });
      sys.emitter.position.copy(pos);
      scene.add(sys.emitter);
      qSystems.push({ sys: sys, t: 0 });
    } catch (e) { /* 粒子失败不影响主循环 */ }
  }

  var decalTex = (function () {
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var x = c.getContext('2d');
    for (var i = 0; i < 26; i++) {
      var a = Math.random() * Math.PI * 2, r = Math.random() * 46;
      x.beginPath();
      x.arc(64 + Math.cos(a) * r, 64 + Math.sin(a) * r, 2 + Math.random() * 12, 0, Math.PI * 2);
      x.fillStyle = 'rgba(' + (140 + Math.random() * 60 | 0) + ',' + (190 + Math.random() * 50 | 0) + ',255,' + (0.16 + Math.random() * 0.3) + ')';
      x.fill();
    }
    var t = new T.CanvasTexture(c); t.needsUpdate = true; return t;
  })();

  /* ---------- 空气尘埃 ---------- */
  var dustPoints = (function () {
    var N = 420, arr = new Float32Array(N * 3);
    for (var i = 0; i < N; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 70;
      arr[i * 3 + 1] = Math.random() * 6;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 70;
    }
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(arr, 3));
    var m = new T.PointsMaterial({ color: 0x7fa8d6, size: 0.06, transparent: true, opacity: 0.5, depthWrite: false, blending: T.AdditiveBlending });
    var p2 = new T.Points(g, m);
    p2.frustumCulled = false;
    scene.add(p2);
    return p2;
  })();

  /* 张彬专属：脚下的观测场 */
  var obsField = new T.Mesh(new T.RingGeometry(11.85, 12.0, 96), new T.MeshBasicMaterial({
    color: 0x54d99a, transparent: true, opacity: 0.35, side: T.DoubleSide, blending: T.AdditiveBlending, depthWrite: false
  }));
  obsField.rotation.x = -Math.PI / 2;
  obsField.visible = false;
  scene.add(obsField);

  /* 玩家身上的电弧碎屑（不用贴图，纯点云） */
  var playerSparks = (function () {
    var n = 26, arr = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, r = 0.55 + Math.random() * 0.5;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = Math.random() * 1.6;
      arr[i * 3 + 2] = Math.sin(a) * r;
    }
    var g2 = new T.BufferGeometry();
    g2.setAttribute('position', new T.BufferAttribute(arr, 3));
    var m2 = new T.PointsMaterial({ color: 0x9fd8ff, size: 0.09, transparent: true, opacity: 0.75, blending: T.AdditiveBlending, depthWrite: false });
    var pts = new T.Points(g2, m2);
    scene.add(pts);
    return pts;
  })();

  /* ---------- 玩家 ---------- */
  var player = new T.Group();
  /* 核心：小而亮的球 */
  var pBody = new T.Mesh(new T.SphereGeometry(0.30, 20, 14), new T.MeshBasicMaterial({ color: 0xf2fbff }));
  /* 外面罩一层柔光：让本体读作"一团光"，而不是一个白球 */
  var pGlow = new T.Sprite(new T.SpriteMaterial({
    map: glowTex, color: 0x9fd8ff, transparent: true, opacity: 0.95,
    blending: T.AdditiveBlending, depthWrite: false
  }));
  pGlow.scale.setScalar(3.1);
  player.add(pGlow);
  player.add(pBody);
  /* 外面一层薄壳，读作"球状闪电的边界" */
  var pShell = new T.Mesh(new T.SphereGeometry(0.78, 20, 14), new T.MeshBasicMaterial({
    color: 0x6fb6ff, transparent: true, opacity: 0.26, side: T.BackSide, blending: T.AdditiveBlending, depthWrite: false
  }));
  player.add(pShell);
  /* 两道倾斜的电流环，一直在转 */
  var rings = [];
  for (var ri = 0; ri < 2; ri++) {
    var rg = new T.TorusGeometry(1.0 + ri * 0.16, 0.011, 6, 48);
    var rm = new T.Mesh(rg, new T.MeshBasicMaterial({ color: 0x9fd6ff, transparent: true, opacity: 0.55, blending: T.AdditiveBlending, depthWrite: false }));
    rm.rotation.set(Math.PI / 2 + ri * 0.7, ri * 0.9, 0);
    player.add(rm); rings.push(rm);
  }
  /* 地面光斑 */
  var pPad = new T.Mesh(new T.PlaneGeometry(3.4, 3.4), new T.MeshBasicMaterial({
    map: glowTex, transparent: true, opacity: 0.32, blending: T.AdditiveBlending, depthWrite: false
  }));
  pPad.rotation.x = -Math.PI / 2; pPad.position.y = -0.52;
  player.add(pPad);
  var pLight = new T.PointLight(0x9fd0ff, 2.4, 22, 2);
  player.add(pLight);
  scene.add(player);

  /* 拖尾：一条有宽度、前端粗后端细的渐隐带（原来是 1px 折线，看起来只有一根线） */
  var TRAIL_N = 30;
  var trailHist = [];
  for (var th = 0; th < TRAIL_N; th++) trailHist.push(new T.Vector3(0, 0.6, 0));
  var trailVerts = new Float32Array(TRAIL_N * 2 * 3);
  var trailCols = new Float32Array(TRAIL_N * 2 * 3);
  var trailIdx = [];
  for (var ti = 0; ti < TRAIL_N - 1; ti++) {
    var a0 = ti * 2, b0 = ti * 2 + 1, a1 = ti * 2 + 2, b1 = ti * 2 + 3;
    trailIdx.push(a0, b0, a1, b0, b1, a1);
  }
  var trailGeo = new T.BufferGeometry();
  trailGeo.setAttribute('position', new T.BufferAttribute(trailVerts, 3));
  trailGeo.setAttribute('color', new T.BufferAttribute(trailCols, 3));
  trailGeo.setIndex(trailIdx);
  var trail = new T.Mesh(trailGeo, new T.MeshBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.9,
    blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide
  }));
  trail.frustumCulled = false;
  scene.add(trail);

  /* ---------- 敌人（线稿装甲车） ---------- */
  var G = {
    body: new T.BoxGeometry(1.55, 0.62, 2.3),
    turret: new T.BoxGeometry(0.95, 0.36, 1.1),
    barrel: new T.CylinderGeometry(0.07, 0.07, 1.25, 6),
    wheel: new T.BoxGeometry(0.24, 0.34, 0.44)
  };
  var matFill = new T.MeshBasicMaterial({ color: 0x0a1322, transparent: true, opacity: 0.62, depthWrite: false });
  var matEdge = new T.LineBasicMaterial({ color: 0x8ecbff, transparent: true, opacity: 0.85 });

  function wire(geo, x, y, z) {
    var m = new T.Mesh(geo, matFill);
    m.position.set(x, y, z);
    var e = new T.LineSegments(new T.EdgesGeometry(geo), matEdge);
    e.position.copy(m.position);
    return { m: m, e: e };
  }

  var eyeTex = glowTex;
  function makeTank(kind) {
    var g = new T.Group();
    var parts = [];
    if (kind === 'drone') {
      var core = wire(G.turret, 0, 0.5, 0); parts.push(core.m, core.e);
      var arm1 = wire(G.barrel, 0, 0.5, 0); arm1.m.rotation.z = Math.PI / 2; arm1.e.rotation.z = Math.PI / 2;
      parts.push(arm1.m, arm1.e);
    } else {
      var b = wire(G.body, 0, 0.42, 0); parts.push(b.m, b.e);
      var t = wire(G.turret, 0, 0.92, -0.15); parts.push(t.m, t.e);
      var br = wire(G.barrel, 0, 0.92, -1.0); br.m.rotation.x = Math.PI / 2; br.e.rotation.x = Math.PI / 2;
      parts.push(br.m, br.e);
      for (var i = 0; i < 4; i++) {
        var z = i < 2 ? 0.72 : -0.72;
        var x = (i % 2) ? 0.72 : -0.72;
        var w = wire(G.wheel, x, 0.2, z); parts.push(w.m, w.e);
      }
    }
    parts.forEach(function (p) { g.add(p); });
    return g;
  }

  var KINDS = {
    tank: { hp: 30, sp: 1.55, dmg: 9, size: 1, score: 1 },
    apc: { hp: 16, sp: 2.5, dmg: 7, size: 0.85, score: 1 },
    drone: { hp: 8, sp: 4.2, dmg: 5, size: 0.8, score: 1 }
  };

  var enemies = [];
  var bullets = [];
  var bGeo = new T.SphereGeometry(0.16, 8, 6);
  var bMat = new T.MeshBasicMaterial({ color: 0xffd9a0 });
  function shootBurst(from, count, speed) {
    for (var i = 0; i < count; i++) {
      var a = (i / count) * Math.PI * 2;
      var m = new T.Mesh(bGeo, bMat);
      m.position.copy(from);
      scene.add(m);
      bullets.push({ o: m, v: new T.Vector3(Math.cos(a) * speed, 0, Math.sin(a) * speed), life: 6 });
    }
  }
  var bMatCache = {};
  function bulletMat(color) {
    if (!bMatCache[color]) bMatCache[color] = new T.MeshBasicMaterial({ color: color });
    return bMatCache[color];
  }
  function spawnBullet(x, z, vx, vz, color, life, r) {
    var m = new T.Mesh(bGeo, bulletMat(color || 0xffd9a0));
    if (r) m.scale.setScalar(r);
    m.position.set(x, 1.0, z);
    scene.add(m);
    bullets.push({ o: m, v: new T.Vector3(vx, 0, vz), life: life || 6 });
  }
  /* 螺旋：双旋臂，角度持续推进 */
  function fireSpiral(boss) {
    boss.spA = (boss.spA || 0) + 0.42;
    var cx = boss.g.position.x, cz = boss.g.position.z;
    var sp = 4.6;
    spawnBullet(cx, cz, Math.cos(boss.spA) * sp, Math.sin(boss.spA) * sp, 0x9fd8ff, 5, 1.0);
    spawnBullet(cx, cz, Math.cos(boss.spA + Math.PI) * sp, Math.sin(boss.spA + Math.PI) * sp, 0x9fd8ff, 5, 1.0);
  }
  /* 瞄准扇形：朝玩家 5 连发 */
  function fireAim(boss) {
    var cx = boss.g.position.x, cz = boss.g.position.z;
    var ang = Math.atan2(S.pos.z - cz, S.pos.x - cx);
    for (var i = -2; i <= 2; i++) {
      var aa = ang + i * 0.16;
      spawnBullet(cx, cz, Math.cos(aa) * 7.2, Math.sin(aa) * 7.2, 0xffb36b, 5, 1.15);
    }
  }
  /* 激光：0.9 秒红色预兆线，然后 0.35 秒贯穿 */
  var laserMesh = null;
  function laserInit() {
    if (laserMesh) return;
    var g = new T.BoxGeometry(0.35, 0.35, 60);
    var m = new T.MeshBasicMaterial({ color: 0xff5566, transparent: true, opacity: 0.0, blending: T.AdditiveBlending, depthWrite: false });
    laserMesh = new T.Mesh(g, m);
    laserMesh.position.y = 1.0;
    scene.add(laserMesh);
  }
  function fireLaser(boss) {
    laserInit();
    var dx = S.pos.x - boss.g.position.x, dz = S.pos.z - boss.g.position.z;
    var ang = Math.atan2(dx, dz);
    boss.laser = { t: 0, warn: 0.9, fire: 0.35, ang: ang, done: false };
    laserMesh.position.set(boss.g.position.x, 1.0, boss.g.position.z);
    laserMesh.rotation.set(0, ang, 0);
    laserMesh.material.color.setHex(0xff3355);
  }
  function laserTick(dt, boss) {
    if (!boss.laser || !laserMesh) return;
    var L = boss.laser;
    L.t += dt;
    if (L.t < L.warn) {
      laserMesh.material.opacity = 0.18 + 0.12 * Math.sin(L.t * 26);
      laserMesh.scale.set(0.35, 1, 1);
    } else if (L.t < L.warn + L.fire) {
      laserMesh.material.opacity = 0.9;
      laserMesh.scale.set(1.2, 1, 1);
      if (!L.done) {
        var dx = S.pos.x - laserMesh.position.x, dz = S.pos.z - laserMesh.position.z;
        var fx = Math.sin(L.ang), fz = Math.cos(L.ang);
        var along = dx * fx + dz * fz;
        var perp = Math.abs(dx * fz - dz * fx);
        if (along > 0 && perp < 1.0) {
          hurtPlayer(6);
          L.done = true;
        }
      }
    } else {
      laserMesh.material.opacity = 0;
      boss.laser = null;
    }
  }

  /* 慢速花瓣：一圈 14 发，外圈减速形成花形 */
  function firePetal(boss) {
    var cx = boss.g.position.x, cz = boss.g.position.z;
    for (var i = 0; i < 14; i++) {
      var a2 = (i / 14) * Math.PI * 2;
      spawnBullet(cx, cz, Math.cos(a2) * 3.0, Math.sin(a2) * 3.0, 0xd9b3ff, 7, 1.3);
    }
  }
  function spawn(kind) {
    if (enemies.length > 160) return;
    var def = KINDS[kind] || KINDS.tank;
    var grp = makeTank(kind);
    var a = Math.random() * Math.PI * 2;
    var r = (20 + Math.random() * 6) * (S.zoom || 1);
    grp.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    grp.scale.setScalar(def.size);
    scene.add(grp);
    enemies.push({ g: grp, hp: def.hp * (1 + (S.wave - 1) * 0.18), max: def.hp, sp: def.sp, dmg: def.dmg, kind: kind, flash: 0 });
  }

  /* ---------- BOSS：宏电子本体 ---------- */
  function makeMacro() {
    var g = new T.Group();
    var core = new T.Mesh(new T.SphereGeometry(1.0, 24, 18), new T.MeshBasicMaterial({ color: 0xffffff }));
    core.position.y = 1.8;
    g.add(core);
    var halo = new T.Sprite(new T.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0.55, blending: T.AdditiveBlending, depthWrite: false }));
    halo.scale.set(7.5, 7.5, 1); halo.position.y = 1.8; g.add(halo);
    var shell = new T.Mesh(new T.SphereGeometry(1.9, 24, 18), new T.MeshBasicMaterial({
      color: 0x8fd0ff, transparent: true, opacity: 0.16, side: T.BackSide,
      blending: T.AdditiveBlending, depthWrite: false
    }));
    shell.position.y = 1.8;
    g.add(shell);
    var rings = [];
    /* 丁仪：看得多、拿到的是"记录"（经验少）；林云：贴脸坍缩带一次范围伤害 */
    var nOrb = (S.bid === 'dingyi') ? 2 : 3;
    for (var i = 0; i < nOrb; i++) {
      var rg = new T.Mesh(new T.TorusGeometry(2.2 + i * 0.2, 0.025, 6, 72),
        new T.MeshBasicMaterial({ color: i === 1 ? 0xffcf80 : 0x9fd6ff, transparent: true, opacity: 0.85, blending: T.AdditiveBlending, depthWrite: false }));
      rg.position.y = 1.8;
      rg.rotation.set(Math.PI / 2 + i * 0.5, i * 0.8, 0);
      g.add(rg); rings.push(rg);
    }
    g.userData.core = core; g.userData.shell = shell; g.userData.rings = rings;
    return g;
  }

  function spawnBoss() {
    sfx('boss');
    var grp = makeMacro();
    var a = Math.random() * Math.PI * 2;
    grp.position.set(Math.cos(a) * 22, 0, Math.sin(a) * 22);
    scene.add(grp);
    var b = {
      g: grp, hp: 420 + S.wave * 60, max: 420 + S.wave * 60, sp: 1.1, dmg: 10,
      kind: 'tank', isBoss: true, phase: 'solid', qt: 0,
      thresholds: [0.5, 0.2, 0.06], useT: 0
    };
    /* 量子态的粒子壳 */
    var N = 150, arr = new Float32Array(N * 3);
    for (var i = 0; i < N; i++) {
      var aa = Math.random() * Math.PI * 2, rr = 1.2 + Math.random() * 2.0;
      arr[i * 3] = Math.cos(aa) * rr;
      arr[i * 3 + 1] = 1.2 + Math.random() * 3.2;
      arr[i * 3 + 2] = Math.sin(aa) * rr;
    }
    var pg = new T.BufferGeometry();
    pg.setAttribute('position', new T.BufferAttribute(arr, 3));
    b.qPts = new T.Points(pg, new T.PointsMaterial({
      color: 0xdcefff, size: 0.1, transparent: true, opacity: 0.85,
      blending: T.AdditiveBlending, depthWrite: false
    }));
    b.qPts.visible = false;
    grp.add(b.qPts);
    enemies.push(b);
    S.boss = b;
    b.bornAt = S.t;
    toast('目标出现：宏电子 · 试验体', 2200);
  }

  /* ---------- 声音：全部 WebAudio 现场合成，不依赖素材 ---------- */
  var AUD = { ctx: null, master: null, muted: false, lastArc: 0 };
  function audioInit() {
    if (AUD.ctx) return AUD.ctx;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      AUD.ctx = new AC();
      AUD.master = AUD.ctx.createGain();
      AUD.master.gain.value = 0.5;
      AUD.master.connect(AUD.ctx.destination);
    } catch (e) { AUD.ctx = null; }
    return AUD.ctx;
  }
  function unlockAudio() {
    var c = audioInit();
    if (c && c.state === 'suspended') c.resume();
  }

  /* ---------- BGM：三层程序化环境音（零素材，随战况变） ---------- */
  var BGM = { on: false, mode: '', nodes: {}, scale: 1 };
  function bgmInit() {
    var c = audioInit(); if (!c || BGM.on) return;
    BGM.on = true;
    var t0 = c.currentTime;
    function chain(freq, type, filt, det) {
      var o = c.createOscillator(); o.type = type; o.frequency.value = freq;
      if (det) o.detune.value = det;
      var f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filt; f.Q.value = 0.7;
      var g = c.createGain(); g.gain.value = 0;
      o.connect(f); f.connect(g); g.connect(AUD.master);
      o.start(t0); return { o: o, f: f, g: g };
    }
    BGM.nodes.drone = chain(55, 'sine', 220);
    BGM.nodes.sub = chain(41.2, 'sine', 120);
    BGM.nodes.padA = chain(110, 'sawtooth', 380, -7);
    BGM.nodes.padB = chain(164.8, 'sawtooth', 420, 6);
    var nb = c.createBufferSource(); nb.buffer = noiseBuf(2); nb.loop = true;
    var nf = c.createBiquadFilter(); nf.type = 'lowpass'; nf.frequency.value = 260;
    var ng = c.createGain(); ng.gain.value = 0;
    nb.connect(nf); nf.connect(ng); ng.connect(AUD.master); nb.start(t0);
    BGM.nodes.noise = { o: nb, f: nf, g: ng };
    var lfo = c.createOscillator(); lfo.frequency.value = 0.07;
    var lg = c.createGain(); lg.gain.value = 0;
    lfo.connect(lg); lg.connect(BGM.nodes.drone.g.gain); lfo.start(t0);
    BGM.nodes.lfo = lg;
    bgmSet('calm', true);
  }
  function bgmSet(mode, force) {
    if (!BGM.on) return;
    if (BGM.mode === mode && !force) return;
    BGM.mode = mode;
    var t1 = AUD.ctx.currentTime, k = 0.6;
    var P = {
      calm: { drone: 0.05, sub: 0.03, padA: 0.012, padB: 0.008, noise: 0.022, lfo: 0.02, cut: 380 },
      fight: { drone: 0.07, sub: 0.05, padA: 0.026, padB: 0.018, noise: 0.034, lfo: 0.03, cut: 620 },
      boss: { drone: 0.10, sub: 0.075, padA: 0.040, padB: 0.030, noise: 0.050, lfo: 0.05, cut: 900 }
    }[mode];
    ['drone', 'sub', 'padA', 'padB', 'noise'].forEach(function (n) {
      BGM.nodes[n].g.gain.setTargetAtTime(P[n] * BGM.scale, t1, k);
    });
    BGM.nodes.lfo.gain.setTargetAtTime(P.lfo * BGM.scale, t1, k);
    ['drone', 'sub', 'padA', 'padB'].forEach(function (n) {
      BGM.nodes[n].f.frequency.setTargetAtTime(P.cut, t1, k);
    });
    BGM.nodes.noise.f.frequency.setTargetAtTime(mode === 'boss' ? 700 : 260, t1, k);
  }
  /* D 键：演示模式（卡片全解锁 + 受伤减半），状态存在 localStorage.bl.demo */
function toggleDemo() {
  try {
    if (localStorage.getItem('bl.demo') === '1') localStorage.removeItem('bl.demo');
    else localStorage.setItem('bl.demo', '1');
  } catch (e) {}
  location.reload();
}

function toggleMute() {
    AUD.muted = !AUD.muted;
    if (AUD.master) AUD.master.gain.value = AUD.muted ? 0 : 0.5;
    toast(AUD.muted ? '静音' : '声音已开', 1200);
  }
  addEventListener('pointerdown', function () { unlockAudio(); bgmInit(); musicInit(); }, { passive: true });
  addEventListener('keydown', function () { unlockAudio(); bgmInit(); musicInit(); }, { passive: true });
  /* ---------- 外部 BGM：Dark Sci-Fi Audio Pack（CC0 1.0 · SRG774 / OpenGameArt） ---------- */
  var MUSIC = { on: false, mode: '', list: {} };
  var MSP = { calm: 'assets/bgm/sector.mp3', fight: 'assets/bgm/pulse.mp3', boss: 'assets/bgm/urgent.mp3', dead: 'assets/bgm/transmission.mp3' };
  function musicInit() {
    if (MUSIC.on) return; MUSIC.on = true;
    Object.keys(MSP).forEach(function (k) {
      var a = new Audio(); a.src = MSP[k]; a.loop = true; a.preload = 'auto'; a.volume = 0;
      MUSIC.list[k] = a;
    });
    BGM.scale = 0.22;
  }
  function musicSet(mode) {
    if (!MUSIC.on || MUSIC.mode === mode) return;
    MUSIC.mode = mode;
    var a = MUSIC.list[mode]; if (!a) return;
    var pr = a.play(); if (pr && pr.catch) pr.catch(function () {});
  }
  function musicTick() {
    if (!MUSIC.on) return;
    Object.keys(MUSIC.list).forEach(function (k) {
      var a = MUSIC.list[k];
      var want = (MUSIC.mode === k && !AUD.muted && !S.paused) ? 0.55 : 0;
      a.volume += (want - a.volume) * 0.08;
      if (want > 0 && a.paused) { var q = a.play(); if (q && q.catch) q.catch(function () {}); }
      if (want === 0 && a.volume < 0.004 && !a.paused) a.pause();
    });
  }
  addEventListener('pointerdown', function () { musicInit(); }, { passive: true });
  addEventListener('keydown', function () { musicInit(); }, { passive: true });

  function noiseBuf(dur) {
    var c = AUD.ctx, n = Math.floor(c.sampleRate * dur);
    var b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    return b;
  }
  function sfx(kind, k) {
    if (AUD.muted) return;
    var c = audioInit();
    if (!c) return;
    var t0 = c.currentTime, g = c.createGain();
    g.connect(AUD.master);
    k = k || 1;

    if (kind === 'arc') {
      if (performance.now() - AUD.lastArc < 55) return;
      AUD.lastArc = performance.now();
      var src = c.createBufferSource(); src.buffer = noiseBuf(0.13);
      var bp = c.createBiquadFilter(); bp.type = 'bandpass';
      bp.frequency.setValueAtTime(2600, t0); bp.frequency.exponentialRampToValueAtTime(900, t0 + 0.12);
      bp.Q.value = 1.4;
      g.gain.setValueAtTime(0.22, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.13);
      src.connect(bp); bp.connect(g); src.start(t0);
    } else if (kind === 'hit') {
      var o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(150 * k, t0); o.frequency.exponentialRampToValueAtTime(58, t0 + 0.12);
      g.gain.setValueAtTime(0.32, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.14);
      o.connect(g); o.start(t0); o.stop(t0 + 0.15);
    } else if (kind === 'kill') {
      var s2 = c.createBufferSource(); s2.buffer = noiseBuf(0.5);
      var lp = c.createBiquadFilter(); lp.type = 'lowpass';
      lp.frequency.setValueAtTime(1800, t0); lp.frequency.exponentialRampToValueAtTime(180, t0 + 0.45);
      g.gain.setValueAtTime(0.4, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.5);
      s2.connect(lp); lp.connect(g); s2.start(t0);
      var sub = c.createOscillator(); sub.type = 'sine';
      sub.frequency.setValueAtTime(70, t0); sub.frequency.exponentialRampToValueAtTime(38, t0 + 0.4);
      var sg = c.createGain(); sg.gain.setValueAtTime(0.5, t0); sg.gain.exponentialRampToValueAtTime(0.001, t0 + 0.45);
      sub.connect(sg); sg.connect(AUD.master); sub.start(t0); sub.stop(t0 + 0.5);
    } else if (kind === 'thud') {
      var s3 = c.createOscillator(); s3.type = 'sine';
      s3.frequency.setValueAtTime(52, t0); s3.frequency.exponentialRampToValueAtTime(34, t0 + 0.16);
      g.gain.setValueAtTime(0.5, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.18);
      s3.connect(g); s3.start(t0); s3.stop(t0 + 0.2);
    } else if (kind === 'level') {
      [523.25, 783.99].forEach(function (f, i) {
        var o2 = c.createOscillator(); o2.type = 'triangle';
        o2.frequency.value = f;
        var g2b = c.createGain();
        g2b.gain.setValueAtTime(0.0001, t0 + i * 0.09);
        g2b.gain.exponentialRampToValueAtTime(0.22, t0 + i * 0.09 + 0.02);
        g2b.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.09 + 0.5);
        o2.connect(g2b); g2b.connect(AUD.master);
        o2.start(t0 + i * 0.09); o2.stop(t0 + i * 0.09 + 0.55);
      });
    } else if (kind === 'boss') {
      var o3 = c.createOscillator(); o3.type = 'sawtooth';
      o3.frequency.setValueAtTime(70, t0); o3.frequency.exponentialRampToValueAtTime(220, t0 + 0.7);
      var lp3 = c.createBiquadFilter(); lp3.type = 'lowpass'; lp3.frequency.value = 700;
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.3, t0 + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.8);
      o3.connect(lp3); lp3.connect(g); o3.start(t0); o3.stop(t0 + 0.85);
    }
  }

  /* ---------- 地平线：天幕 + 远景剪影 + 地平辉光 ---------- */
  function buildHorizon() {
    /* 1) 天幕：竖向渐变（顶部近黑 → 地平线蓝） */
    var c = document.createElement('canvas');
    c.width = 8; c.height = 256;
    var g2 = c.getContext('2d');
    var grd = g2.createLinearGradient(0, 0, 0, 256);
    grd.addColorStop(0.00, '#173a5c');
    grd.addColorStop(0.10, '#102743');
    grd.addColorStop(0.26, '#081525');
    grd.addColorStop(0.55, '#0b1a2e');
    grd.addColorStop(1.00, '#02040a');
    g2.fillStyle = grd; g2.fillRect(0, 0, 8, 256);
    var skyTex = new T.CanvasTexture(c);
    skyTex.magFilter = T.LinearFilter;
    var sky = new T.Mesh(
      new T.CylinderGeometry(190, 190, 150, 64, 1, true),
      new T.MeshBasicMaterial({ map: skyTex, side: T.BackSide, fog: false, depthWrite: false })
    );
    sky.position.y = 55;
    sky.name = 'horizon-sky';
    scene.add(sky);

    /* 2) 地平辉光带：贴着 y=0 的一圈加色光 */
    var glow = new T.Mesh(
      new T.CylinderGeometry(150, 150, 5.0, 96, 1, true),
      new T.MeshBasicMaterial({ color: 0x2e6bb8, transparent: true, opacity: 0.30, side: T.BackSide, blending: T.AdditiveBlending, depthWrite: false, fog: false })
    );
    glow.position.y = 1.2;
    glow.name = 'horizon-glow';
    scene.add(glow);

    /* 3) 远景剪影：一圈高低不一的方块，像远处厂区/城市 */
    var sil = new T.Group();
    sil.name = 'horizon-silhouette';
    var mat = new T.MeshBasicMaterial({ color: 0x08111f, transparent: true, opacity: 0.95, fog: false });
    for (var i = 0; i < 64; i++) {
      var a = (i / 64) * Math.PI * 2 + Math.random() * 0.05;
      var r = 112 + Math.random() * 26;
      var w = 2.2 + Math.random() * 5.5, h = 1.6 + Math.random() * 7.5;
      var b = new T.Mesh(new T.BoxGeometry(w, h, w * 0.8), mat);
      b.position.set(Math.cos(a) * r, h / 2 - 1.2, Math.sin(a) * r);
      b.rotation.y = Math.random() * Math.PI;
      sil.add(b);
    }
    sil.visible = false;   /* 远景剪影先关：和辉光叠在一起像一堵墙 */
    scene.add(sil);

    /* 3.5) 地平线上的一条亮线 */
    var line = new T.Mesh(new T.CylinderGeometry(150, 150, 0.5, 128, 1, true), new T.MeshBasicMaterial({
      color: 0x9fd0ff, transparent: true, opacity: 0.85, side: T.BackSide,
      blending: T.AdditiveBlending, depthWrite: false, fog: false
    }));
    line.position.y = 0.55;
    line.visible = false;
    scene.add(line);

    /* 4) 地面边缘：一圈淡青的边界线，把场地"框"住 */
    var edge = new T.Mesh(new T.RingGeometry(118, 119.2, 128), new T.MeshBasicMaterial({
      color: 0x2f6bb0, transparent: true, opacity: 0.55, side: T.DoubleSide, blending: T.AdditiveBlending, depthWrite: false, fog: false
    }));
    edge.rotation.x = -Math.PI / 2;
    edge.position.y = 0.02;
    edge.visible = false;
    scene.add(edge);
  }
  buildHorizon();
  scene.fog = new T.Fog(0x102743, 55, 190);

  /* ---------- 特效池 ---------- */
  var fx = [];
  function flashAt(pos, dir, scale) {
    var m = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({
      map: glowTex, transparent: true, opacity: 0.95, depthWrite: false,
      blending: T.AdditiveBlending, side: T.DoubleSide
    }));
    m.position.copy(pos);
    if (dir) m.lookAt(pos.clone().add(dir));
    m.rotation.z = Math.random() * Math.PI * 2;
    m.scale.setScalar((scale || 2.4) * (0.75 + Math.random() * 0.5));
    scene.add(m);
    fx.push({ o: m, life: 0.14, max: 0.14, kind: 'flash' });
  }

  function decalAt(pos) {
    var m = new T.Mesh(new T.PlaneGeometry(1.5, 1.5), new T.MeshBasicMaterial({
      map: decalTex, transparent: true, opacity: 0.9, depthWrite: false, blending: T.AdditiveBlending
    }));
    m.position.copy(pos);
    m.rotation.x = -Math.PI / 2;
    m.rotation.z = Math.random() * Math.PI * 2;
    scene.add(m);
    fx.push({ o: m, life: 1.1, max: 1.1, kind: 'decal' });
  }

  /* 命中冲击环：一圈快速扩散的白环，比"闪一下"更有重量 */
  function shockRing(pos, r0, r1, life, color) {
    var m = new T.Mesh(new T.TorusGeometry(1, 0.045, 8, 48), new T.MeshBasicMaterial({
      color: color || 0xcaf0ff, transparent: true, opacity: 1, blending: T.AdditiveBlending, depthWrite: false
    }));
    m.position.copy(pos);
    m.rotation.x = -Math.PI / 2;
    scene.add(m);
    fx.push({ o: m, life: life, max: life, kind: 'ring', r0: r0, r1: r1 });
  }

  /* 全屏打击闪光：一次白场，220ms 内回落，不遮挡画面中央的读数 */
  function screenFlash(a) {
    var el = document.getElementById('hitflash');
    if (!el) return;
    el.style.transition = 'none';
    el.style.opacity = a;
    /* 强制回流后再切过渡，否则同一帧改两次样式不会触发动画 */
    void el.offsetWidth;
    el.style.transition = 'opacity .22s cubic-bezier(.2,.7,.2,1)';
    el.style.opacity = 0;
  }

  function hitBurst(pos, power) {
    var pw = power || 1;
    flashAt(pos, null, 1.6 * pw);
    shockRing(new T.Vector3(pos.x, 0.08, pos.z), 0.2, 2.2 * pw, 0.3);
    shockRing(new T.Vector3(pos.x, 0.35, pos.z), 0.15, 1.3 * pw, 0.22, 0xffffff);
    sparkBurst(pos, Math.round(8 * pw), (S.skin && S.skin.bolt) || 0xbfe6ff);
    S.hitStop = Math.max(S.hitStop, 0.045);           /* 顿帧：一下子的"实感" */
    sfx('thud');
    S.shake = Math.min(1.0, S.shake + 0.18 * pw);
  }

  /* 贴图粒子爆开：比 Line 火花更像"火/烟" */
  function puffBurst(pos, n, colorHex, big) {
    n = n || 20;
    var geo = new T.BufferGeometry();
    var p = new Float32Array(n * 3), col = new Float32Array(n * 3);
    var vel = [];
    var col0 = new T.Color(colorHex || 0xffffff);
    for (var i = 0; i < n; i++) {
      p[i * 3] = pos.x; p[i * 3 + 1] = pos.y; p[i * 3 + 2] = pos.z;
      col[i * 3] = col0.r; col[i * 3 + 1] = col0.g; col[i * 3 + 2] = col0.b;
      var a = Math.random() * Math.PI * 2, u = Math.random() * 2 - 1;
      var r = Math.sqrt(1 - u * u), sp = (1.6 + Math.random() * 4.2) * (big ? 1.5 : 1);
      vel.push(new T.Vector3(Math.cos(a) * r * sp, u * sp * 0.8 + 1.2, Math.sin(a) * r * sp));
    }
    geo.setAttribute('position', new T.BufferAttribute(p, 3));
    geo.setAttribute('color', new T.BufferAttribute(col, 3));
    var mat = new T.PointsMaterial({
      map: glowTex, size: big ? 1.5 : 0.85, transparent: true, opacity: 1,
      vertexColors: true, blending: T.AdditiveBlending, depthWrite: false, sizeAttenuation: true
    });
    var pts = new T.Points(geo, mat);
    pts.frustumCulled = false;
    scene.add(pts);
    fx.push({ o: pts, life: 0.55, max: 0.55, kind: 'puff', vel: vel });
  }

  function sparkBurst(pos, n, color) {
    var geo = new T.BufferGeometry();
    var p = new Float32Array(n * 3), v = [];
    for (var i = 0; i < n; i++) {
      p[i * 3] = pos.x; p[i * 3 + 1] = pos.y; p[i * 3 + 2] = pos.z;
      var a = Math.random() * Math.PI * 2, u = Math.random() * 2 - 1, s = 2 + Math.random() * 5;
      var r = Math.sqrt(1 - u * u);
      v.push(new T.Vector3(Math.cos(a) * r * s, Math.abs(u) * s * 0.8 + 1, Math.sin(a) * r * s));
    }
    geo.setAttribute('position', new T.BufferAttribute(p, 3));
    var pts = new T.Points(geo, new T.PointsMaterial({ color: color || 0xaee0ff, size: 0.16, transparent: true, opacity: 1, blending: T.AdditiveBlending, depthWrite: false }));
    pts.frustumCulled = false;
    scene.add(pts);
    fx.push({ o: pts, life: 0.5, max: 0.5, kind: 'spark', v: v, geo: geo });
  }

  /* 伤害数字 */
  function numTex(txt) {
    var c = document.createElement('canvas'); c.width = 128; c.height = 64;
    var x = c.getContext('2d');
    x.font = 'bold 44px ui-monospace, Consolas, monospace';
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillStyle = '#bff0ff'; x.fillText(txt, 64, 32);
    var t = new T.CanvasTexture(c); t.needsUpdate = true; return t;
  }
  function damageNumber(pos, val) {
    var sp = new T.Sprite(new T.SpriteMaterial({ map: numTex(String(val)), transparent: true, depthWrite: false, depthTest: false }));
    sp.scale.set(1.6, 0.8, 1);
    sp.position.copy(pos);
    scene.add(sp);
    fx.push({ o: sp, life: 0.75, max: 0.75, kind: 'num' });
  }

  /* ---------- 电弧 ---------- */
  var bolts = [];
  function bolt(from, to) {
    var N = 13 + Math.min(7, Math.floor(S.dmg / 4)), pts = new Float32Array(N * 3);
    for (var i = 0; i < N; i++) {
      var t = i / (N - 1);
      var x = from.x + (to.x - from.x) * t;
      var y = from.y + (to.y - from.y) * t + 0.55;
      var z = from.z + (to.z - from.z) * t;
      if (i > 0 && i < N - 1) {
        var jj = 0.75 + Math.min(1.1, S.dmg * 0.045);
        x += (Math.random() - 0.5) * jj;
        y += (Math.random() - 0.5) * jj;
        z += (Math.random() - 0.5) * jj;
      }
      pts[i * 3] = x; pts[i * 3 + 1] = y; pts[i * 3 + 2] = z;
    }
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pts, 3));
    var bc = (S.skin && S.skin.bolt) || 0xd8f0ff;
    var line = new T.Line(g, new T.LineBasicMaterial({ color: bc, transparent: true, opacity: 1, blending: T.AdditiveBlending, linewidth: 2 }));
    line.frustumCulled = false;
    scene.add(line);
    var halo = new T.Line(g, new T.LineBasicMaterial({ color: 0x3f8cff, transparent: true, opacity: 0.55, blending: T.AdditiveBlending }));
    halo.frustumCulled = false;
    scene.add(halo);
    bolts.push({ o: line, h: halo, life: 0.3, max: 0.3 });
    sfx('arc');
    flashAt(new T.Vector3(from.x, from.y, from.z), null, 1.0);      /* 枪口闪光 */
    flashAt(new T.Vector3(to.x, to.y, to.z), null, 1.3);          /* 落点闪光 */
  }

  /* ---------- 量子态：击中 → 粒子云 → 被观察才坍缩 ---------- */
  var qClouds = [];
  var qGeoCache = null;
  function quantumCloud(pos) {
    var g = new T.Group();
    g.position.copy(pos);
    var n2 = 110, arr = new Float32Array(n2 * 3), vel = [];
    for (var i = 0; i < n2; i++) {
      var a = Math.random() * Math.PI * 2, r = Math.random() * 1.1;
      var h2 = (Math.random() - 0.2) * 1.6;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = 0.6 + h2 * 0.7;
      arr[i * 3 + 2] = Math.sin(a) * r;
      vel.push(new T.Vector3((Math.random() - 0.5) * 0.5, (Math.random() - 0.3) * 0.4, (Math.random() - 0.5) * 0.5));
    }
    var geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.BufferAttribute(arr, 3));
    var pts = new T.Points(geo, new T.PointsMaterial({
      color: 0xbfe4ff, size: 0.11, transparent: true, opacity: 0.95,
      blending: T.AdditiveBlending, depthWrite: false
    }));
    g.add(pts);
    var shell = new T.LineSegments(
      new T.EdgesGeometry(new T.IcosahedronGeometry(0.85, 0)),
      new T.LineBasicMaterial({ color: 0x7fc4ff, transparent: true, opacity: 0.35, blending: T.AdditiveBlending })
    );
    shell.position.y = 0.7;
    g.add(shell);
    scene.add(g);
    S.dispersed = (S.dispersed || 0) + 1;
    qClouds.push({ g: g, pts: pts, geo: geo, shell: shell, vel: vel, t: 0, obs: 0 });
  }

  function collapseCloud(c) {
    var p = c.g.position.clone(); p.y = 0.6;
    flashAt(p, null, 3.0);
    sparkBurst(p, 14, 0xdff2ff);
    damageNumber(new T.Vector3(p.x, 1.3, p.z), '坍缩');
    for (var i = 0; i < 3; i++) {
      var o = new T.Mesh(orbGeo, orbMat);
      o.position.set(p.x + (Math.random() - 0.5) * 0.8, 0.5, p.z + (Math.random() - 0.5) * 0.8);
      scene.add(o);
      orbs.push({ o: o, v: Math.random() * 2 });
    }
    S.collapsed = (S.collapsed || 0) + 1;
    if (S.bid === 'linyun') {
      S.shake = Math.min(0.8, S.shake + 0.2);
      flashAt(new T.Vector3(p.x, 0.8, p.z), null, 3.4);
      for (var cj = enemies.length - 1; cj >= 0; cj--) {
        var ee = enemies[cj];
        if (ee.dead) continue;
        if (ee.g.position.distanceTo(p) < 3.2) hurt(ee, S.dmg * 0.8);
      }
    }
    removeCloud(c);
  }

  function removeCloud(c) {
    scene.remove(c.g);
    c.geo.dispose(); c.pts.material.dispose();
    c.shell.geometry.dispose(); c.shell.material.dispose();
    var i = qClouds.indexOf(c);
    if (i >= 0) qClouds.splice(i, 1);
  }

  /* ---------- 经验球 ---------- */
  var orbs = [];
  var orbGeo = new T.SphereGeometry(0.16, 10, 8);
  var orbMat = new T.MeshBasicMaterial({ color: 0x7cf0b0 });
  function dropOrb(pos) {
    var m = new T.Mesh(orbGeo, orbMat);
    m.position.copy(pos); m.position.y = 0.5;
    scene.add(m);
    orbs.push({ o: m, v: Math.random() * 2 });
  }

  /* ---------- 状态 ---------- */
  var READ_KEYS = (function () {
    var q = location.search;
    if (/[?&]demo=1/.test(q)) { try { localStorage.setItem('bl.demo', '1'); } catch (e) {} return [1, 2, 3, 4, 5]; }
    if (/[?&]demo=0/.test(q)) { try { localStorage.removeItem('bl.demo'); } catch (e) {} }
    try { if (localStorage.getItem('bl.demo') === '1') return [1, 2, 3, 4, 5]; } catch (e) {}
    var raw = '[]';
    try { raw = localStorage.getItem('bl.read') || '[]'; } catch (e) {}
    try { return JSON.parse(raw).map(Number); } catch (e) { return []; }
  })();
  var DEMO = READ_KEYS.length >= 5;
  function cardOpen(u) { return !u.ch || u.ch === 0 || READ_KEYS.indexOf(u.ch) >= 0; }

  var S = {
    hp: 100, maxHp: 100, lv: 1, xp: 0, need: 5, kills: 0, wave: 1, t: 0,
    paused: false, over: false, fire: 0.55, fireT: 0,
    dmg: 9, chain: 1, range: 20, shake: 0, iframe: 0, zoom: 1, spd: 7.2, spawnGap: 1.0, spawnT: 0,
    slow: 0, auraR: 0, evolved: false,
    bid: '', blastR: 2.2, burstN: 3, beamCos: 0.906, reloadOnKill: false, exec: 0, sameT: 0,
    pos: new T.Vector3(0, 0, 0), vel: new T.Vector3(), trailI: 0, magnet: 6.0
  };

  /* ---------- 导师：锚定的人物在场边说话（先纯文字） ---------- */
  var MENTOR = {
    dingyi: { name: '丁仪', lines: { start: '先把准头找对。别急，它会自己停下来。', lv: '多打一发，少算一次。', boss: '那不是车。别用车的打法看它。', low: '别硬撑，先跑。', cheer: ['五级了。你开始有点准头。', '还行。别骄傲。', '数据在长，人也在长。'] } },
    linyun: { name: '林云', lines: { start: '别站着。边跑边打，活下来才有数据。', lv: '升级只是让你能多打一会儿。', boss: '它出来了——先躲那一圈，再还手。', low: '血不多了。先离开中间。', cheer: ['五级。你现在能站住脚了。', '不错，再撑一会儿。', '就这么打，别停。'] } },
    zhangbin: { name: '张彬', lines: { start: '先看第三根线，再看目标。别慌。', lv: '每一次升级，都该是能算出来的。', boss: '别硬顶，绕着它的轨道走。', low: '数值不对了，退回去重算。', cheer: ['五级了，三根线都对上了。', '稳住了。继续算。', '可以，这个数我认。'] } },
    observer: { name: '陈博士', lines: { start: '你不用动手。看着就行。', lv: '看得越久，它就越确定。', boss: '它散开的时候，别看它。', low: '别动。让它自己过去。', cheer: ['五级。你已经看得比开始时多了。', '你开始记住它们了。', '别急，你已经知道会发生什么。'] } }
  };
  var said = {};
  function showMentor(t) {
    var m = MENTOR[S.bid] || MENTOR.observer;
    var el = document.getElementById('mentor');
    if (!el || !t) return;
    document.getElementById('mname').textContent = m.name;
    var av = document.getElementById('mava'); if (av) av.textContent = m.name.slice(0, 1);
    document.getElementById('mtext').textContent = t;
    el.classList.add('on');
    clearTimeout(el._h);
    el._h = setTimeout(function () { el.classList.remove('on'); }, 6500);
  }
  function mentorSay(key) {
    if (said[key]) return; said[key] = 1;
    var m = MENTOR[S.bid] || MENTOR.observer;
    showMentor(m.lines[key]);
  }
  function mentorCheer() {
    var m = MENTOR[S.bid] || MENTOR.observer;
    var c = m.cheer || (m.lines && m.lines.cheer) || [];
    if (!c.length) return;
    S.cheerN = (S.cheerN || 0) % c.length;
    showMentor(c[S.cheerN]);
    S.cheerN = (S.cheerN + 1) % c.length;
  }
  /* 入学测试的分支：quiz.html 选完跳过来，?b=dingyi|linyun|zhangbin|observer */
  /* 分支差异：参照吸血鬼幸存者"每个角色换一套起始武器"的思路，
     这里让四个分支的【外观 / 出手形态 / 手感 / 敌人偏好】都不一样，而不只是改数字。 */
  var BRANCHES = {
    dingyi: {
      tag: '观测者·丁仪', range: 4, chain: 1, dmg: 0.85, fire: 1, hp: 0, mode: 'chain', bias: 'drone',
      skin: { core: 0xdff0ff, shell: 0x5f9fe0, ring: 0x8fd4ff, trail: 0x6fb8ff, bolt: 0xbfe4ff, num: '#bfe4ff', shake: 1.0, rings: 2 }
    },
    linyun: {
      tag: '实战派·林云', range: 0, chain: 0, dmg: 1.25, fire: 0.9, hp: -15, mode: 'blast', bias: 'tank',
      skin: { core: 0xfff4e2, shell: 0xff9a5c, ring: 0xffb070, trail: 0xff9a5c, bolt: 0xffe0b0, num: '#ffd39a', shake: 1.8, rings: 1 }
    },
    zhangbin: {
      tag: '工程派·张彬', range: 0, chain: 0, dmg: 0.9, fire: 0.8, hp: 20, mode: 'burst', bias: 'apc',
      skin: { core: 0xeafff2, shell: 0x54d99a, ring: 0x7ff0bd, trail: 0x54d99a, bolt: 0xc8ffe4, num: '#b7f5d3', shake: 0.7, rings: 3 }
    },
    observer: {
      tag: '主角·陈博士', range: 2, chain: 0, dmg: 1, fire: 1, hp: 0, obs: true, mode: 'beam', bias: 'mix',
      skin: { core: 0xf2f6ff, shell: 0x9a8fd0, ring: 0xc9c2ff, trail: 0x9a8fd0, bolt: 0xe8e2ff, num: '#dcd6ff', shake: 0.45, rings: 0 }
    }
  };
  var URLB = (function () {
    var m = location.search.match(/[?&]b=([a-z]+)/);
    if (m && BRANCHES[m[1]]) return m[1];
    try { return localStorage.getItem('bl.branch') || ''; } catch (e) { return ''; }
  })();
  var BR = BRANCHES[URLB] || null;
  if (BR) {
    S.range += BR.range; S.chain += BR.chain; S.dmg *= BR.dmg;
    S.fire *= BR.fire; S.maxHp += BR.hp; S.hp = S.maxHp;
    S.obs = !!BR.obs; S.branch = BR.tag; S.bid = URLB; S.mode = BR.mode; S.bias = BR.bias; S.skin = BR.skin;
    if (S.skin) {
      pBody.material.color.setHex(S.skin.core);
      pShell.material.color.setHex(S.skin.shell);
      trail.material.color.setHex(S.skin.trail);
      rings.forEach(function (r, i) {
        r.material.color.setHex(S.skin.ring);
        r.visible = i < S.skin.rings;
        if (i === 0 && S.skin.rings === 1) r.scale.setScalar(1.5);
      });
      pPad.material.color.setHex(S.skin.shell);
    }
  } else {
    S.branch = '未测';
  }

  var keys = {};
  var mouseNDC = new T.Vector2(0, 0);
  var mouseOn = false;

  addEventListener('keydown', function (e) { keys[e.code] = true; if (e.code === 'KeyM') toggleMute(); else if (e.code === 'KeyD') toggleDemo(); });
  addEventListener('keyup', function (e) { keys[e.code] = false; });
  addEventListener('mousemove', function (e) {
    mouseOn = true;
    mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
  addEventListener('resize', function () {
    W = window.innerWidth; H = window.innerHeight;
    camera.aspect = W / H; camera.updateProjectionMatrix();
    renderer.setSize(W, H);
  });

  var ray = new T.Raycaster(), plane = new T.Plane(new T.Vector3(0, 1, 0), 0), hitPt = new T.Vector3();
  function mouseWorld() {
    ray.setFromCamera(mouseNDC, camera);
    if (ray.ray.intersectPlane(plane, hitPt)) return hitPt;
    return null;
  }

  /* ---------- 升级卡 ---------- */
  /* 关卡导演：时间轴 + 每段的敌人池 + 刷怪倍率（写法参考 vendor/canvas-vampire-survivors/src/data.js 的 WAVES） */
  var STAGES = [
    { from: 0,   to: 30,  pool: ['tank'],                        mult: 1.0,  label: '开场' },
    { from: 30,  to: 60,  pool: ['tank', 'apc'],                 mult: 1.1,  label: '装甲推进' },
    { from: 60,  to: 90,  pool: ['tank', 'apc', 'drone'],        mult: 1.2,  label: '无人机掩护' },
    { from: 90,  to: 120, pool: ['apc', 'drone'],                mult: 1.3,  label: '穿插' },
    { from: 120, to: 180, pool: ['tank', 'apc', 'drone'],        mult: 1.45, label: '合围' },
    { from: 180, to: 240, pool: ['tank', 'drone'],               mult: 1.6,  label: '压制' },
    { from: 240, to: 600, pool: ['tank', 'apc', 'drone'],        mult: 1.8,  label: '清扫' }
  ];
  function stageAt(t) {
    for (var i = 0; i < STAGES.length; i++) if (t >= STAGES[i].from && t < STAGES[i].to) return STAGES[i];
    return STAGES[STAGES.length - 1];
  }

  /* 强化卡：带等级上限与稀有度（结构参考 PASSIVES，但数值是我们自己的） */
  var UPGRADES = [
    /* ---- 分支专属 ---- */
    { id: 'osc',   n: '示波器',     d: '电弧多跳 2 个目标', rar: 'rare', max: 2, st: 0, ch: 2, br: 'dingyi',
      src: '原文 156 页 · 用高速摄影机逐帧记下雷球穿过电弧的过程', apply: function () { S.chain += 2; } },
    { id: 'err',   n: '误差棒',     d: '连续命中同一目标，伤害每层 +12%（最多 3 层）', rar: 'epic', max: 1, st: 0, ch: 3, br: 'dingyi',
      src: '原文 156 页 · 事先无法预知它会打到哪个靶，只能一遍遍记录', apply: function () { S.sameT = 1; } },
    { id: 'night', n: '夜视',       d: '索敌半径 +5 m', rar: 'common', max: 2, st: 0, ch: 2, br: 'dingyi',
      src: '原文 33 页 · 在暴雨里守了十年的那种眼力', apply: function () { S.range += 5; } },

    { id: 'frag',  n: '预制破片',   d: '爆炸半径 +1.2 m', rar: 'rare', max: 3, st: 0, ch: 3, br: 'linyun',
      src: '原文 168 页 · 靶车上装着调频通讯、雷达与“加固型”军用电脑', apply: function () { S.blastR += 1.2; } },
    { id: 'reload',n: '二次装填',   d: '每次击杀立即重置充能', rar: 'epic', max: 1, st: 0, ch: 2, br: 'linyun',
      src: '原文 53 页 · 超导电池的高强度瞬间放电只能来八到十次', apply: function () { S.reloadOnKill = true; } },
    { id: 'blind', n: '闭眼开火',   d: '伤害 +30%，生命上限 −10', rar: 'rare', max: 2, st: 0, ch: 3, br: 'linyun',
      src: '原文 162 页 · 雷球机关枪开火时，声音像凄厉的号角', apply: function () { S.dmg *= 1.3; S.maxHp -= 10; S.hp = Math.min(S.hp, S.maxHp); } },

    { id: 'redun', n: '冗余回路',   d: '同时攻击目标 +2', rar: 'rare', max: 2, st: 0, ch: 3, br: 'zhangbin',
      src: '原文 150 页 · 武器系统的每一级都能拆成可复制的模块', apply: function () { S.burstN += 2; } },
    { id: 'flywh', n: '飞轮储能',   d: '充能间隔 −25%', rar: 'rare', max: 2, st: 0, ch: 2, br: 'zhangbin',
      src: '原文 53 页 · 超导电池放完还得慢慢排空十分钟', apply: function () { S.fire = Math.max(0.12, S.fire * 0.75); } },
    { id: 'spare', n: '备用电池',   d: '生命上限 +30，并回满', rar: 'common', max: 2, st: 0, ch: 2, br: 'zhangbin',
      src: '原文 53 页 · 电池容量和数量，决定了能打几次', apply: function () { S.maxHp += 30; S.hp = S.maxHp; } },

    { id: 'noobs', n: '不观测',     d: '正面锥角 25° → 45°', rar: 'epic', max: 1, st: 0, ch: 4, br: 'observer',
      src: '原文 · 不被看到的东西，才有机会留在那里', apply: function () { S.beamCos = 0.707; } },
    { id: 'note',  n: '记录',       d: '被它照到的目标减速 50%，持续 2 秒', rar: 'rare', max: 2, st: 0, ch: 4, br: 'observer',
      src: '原文 · 观测本身也是一种作用', apply: function () { S.slow = Math.max(S.slow, 0.5); S.noteT = 1; } },
    { id: 'colps', n: '坍缩点',     d: '正面命中时 18% 概率直接抹除目标', rar: 'epic', max: 1, ch: 5, st: 0, br: 'observer',
      src: '原文 · 被观测的那一刻，它就不再是原来那个状态了', apply: function () { S.exec += 0.18; } },

    { id: 'dmg',   n: '更高当量', d: '放电伤害 +18%', rar: 'common', max: 6, st: 0, ch: 3, apply: function () { S.dmg *= 1.18; }, src: '原文 156 页 · 每穿过一道电弧，能量翻一倍' },
    { id: 'rate',  n: '充能加速', d: '放电间隔 −14%', rar: 'common', max: 6, ch: 2, st: 0, apply: function () { S.fire = Math.max(0.16, S.fire * 0.86); }, src: '原文 53 页 · 超导电池的瞬间放电与充电' },
    { id: 'chain', n: '连锁电弧', d: '电弧多跳 1 个目标', rar: 'rare',   max: 4, st: 0, ch: 3, apply: function () { S.chain += 1; }, src: '原文 162 页 · 雷球机关枪成串飞出，爆炸没有方向性' },
    { id: 'range', n: '约束磁场', d: '伤害 +25%，但你被圈在场地中心 22 m 内（走不出去）', rar: 'rare', max: 2, ch: 3, st: 0,
      apply: function () { S.dmg *= 1.25; S.tether = 22 - (S.rangeLock || 0) * 2; S.rangeLock = (S.rangeLock || 0) + 1; },
      src: '原文 150 页 · 约束磁场把雷球圈在靶区里，不让它飞出去' },
    { id: 'spd',   n: '滑行加速', d: '移动速度 +10%', rar: 'common', max: 5, st: 0, ch: 3, apply: function () { S.spd *= 1.1; }, src: '原文 156 页 · 雷球在阻尼磁场里飘着走，想停也停不住' },
    { id: 'hp',    n: '屏蔽层',   d: '生命上限 +25，并回满', rar: 'rare', max: 4, ch: 2, st: 0, apply: function () { S.maxHp += 25; S.hp = S.maxHp; }, src: '原文 53 页 · 超导电池不稳定，得靠屏蔽撑住' },
    { id: 'slow',  n: '阻尼磁场', d: '以你为源：6 m 内的装甲车移速 −35%（每级 +1.5 m）', rar: 'rare', max: 3, st: 0, ch: 3,
      apply: function () { S.auraR = S.auraR ? S.auraR + 1.5 : 6; },
      src: '原文 156 页 · 靶区用阻尼磁场让雷球减速；这里反过来——场从你身上往外推，被减速的是压上来的车' },
    { id: 'evo',   n: '宏聚变',   d: '电弧改为三重连锁，伤害 +40%', rar: 'epic', max: 1, st: 0, ch: 4, apply: function () { S.chain += 2; S.dmg *= 1.4; S.evolved = true; }, src: '原文 262 页 · 宏原子核聚变，能量一跃而上' }
  ];
  var cardEl = document.getElementById('cards'), rowEl = document.getElementById('cardRow');
  /* 卡片图标：按名字/描述里的关键词挑一个符号 */
  function cardIcon(u) {
    var t = (u.n || '') + (u.d || '');
    var map = [
      [/当量|伤害|脉冲/, '⚡'], [/充能|射速|放电间隔|冷却/, '⏱'],
      [/连锁|跳/, '🌐'], [/场域|范围|半径/, '◎'], [/生命|护盾|血/, '❤'],
      [/移速|速度|行走/, '➤'], [/聚变|进化/, '✹'], [/磁场|减速|阻尼/, '🌀'],
      [/破片|爆炸|范围伤害/, '💥'], [/冗余|备用|电池|储能/, '🔋'],
      [/误差|示波|记录|观测/, '📈'], [/穿甲|击穿|弹头/, '➤'],
      [/二次|装填|连击/, '↻'], [/夜视|灯|照/, '☾']
    ];
    for (var i = 0; i < map.length; i++) if (map[i][0].test(t)) return map[i][1];
    return '◆';
  }
  var curPicks = [];
  var cardKeyBound = false;
  function bindCardKeys() {
    if (cardKeyBound) return;
    cardKeyBound = true;
    window.addEventListener('keydown', function (e) {
      if (!cardEl.classList.contains('on')) return;
      var k = e.keyCode - 48;
      if (k >= 1 && k <= curPicks.length) {
        e.preventDefault();
        var u = curPicks[k - 1];
        var before = { d: S.dmg, f: S.fire };
        u.apply(); u.st += 1;
        if (el.stats) { el.stats.classList.add('hi'); setTimeout(function () { el.stats.classList.remove('hi'); }, 1400); }
        flashAt(S.pos.clone().setY(1.0), null, 9);
        toast('伤害 ' + before.d.toFixed(1) + ' → ' + S.dmg.toFixed(1) + ' · 间隔 ' + before.f.toFixed(2) + ' → ' + S.fire.toFixed(2) + 's', 1800);
        S.picked = S.picked || {};
        S.picked[u.id] = (S.picked[u.id] || 0) + 1;
        cardEl.classList.remove('on');
        S.paused = false;
      }
    });
  }

  /* 统一的玩家受伤入口：短无敌帧 + 演示模式减半 */
function hurtPlayer(n, contact) {
  var d = DEMO ? n * 0.5 : n;
  if (!contact) {
    if (S.iframe > 0) return false;
    S.iframe = 0.55;
    S.shake = Math.min(1.2, S.shake + 0.35);
  }
  S.hp -= d;
  if (S.hp <= 0) { S.hp = 0; gameOver(); }
  return true;
}

function offerCards() {
    S.paused = true;
    var all = UPGRADES.filter(function (u) {
      if (u.br && u.br !== S.bid) return false;
      if (!cardOpen(u)) return false;   /* 没读到对应章节的卡不出现 */
      if (u.id === 'evo') return S.lv >= 5 && u.st === 0;
      return u.st < u.max;
    });
    var own = all.filter(function (u) { return !!u.br && u.id !== 'evo'; });
    var gen = all.filter(function (u) { return !u.br; });
    own.sort(function () { return Math.random() - 0.5; });
    gen.sort(function () { return Math.random() - 0.5; });
    var pool = [];
    /* 每 3 级保底一张专属卡；其余从通用里补 */
    if (own.length && (S.lv % 3 === 0 || Math.random() < 0.55)) pool.push(own[0]);
    var rest = own.slice(1).concat(gen);
    var guard = 0;
    while (pool.length < 3 && rest.length && guard++ < 40) {
      var cand = rest.shift();
      if (pool.indexOf(cand) < 0) pool.push(cand);
    }
    /* 保底：一章都没读时也不能只给锁卡，至少补两张能选的 */
    if (pool.length < 2) {
      var fb = UPGRADES.filter(function (u) {
        if (u.br && u.br !== S.bid) return false;
        if (u.id === 'evo' && S.lv < 5) return false;
        if (u.st >= u.max) return false;
        return pool.indexOf(u) < 0;
      });
      fb.sort(function () { return Math.random() - 0.5; });
      var g2 = 0;
      while (pool.length < 2 && fb.length && g2++ < 20) { var fu = fb.shift(); fu._fb = 1; pool.push(fu); }
    }
    /* 锁着的卡也要出现：让玩家看到"想要但读不到"，才会回头读原文 */
    var lockedPool = UPGRADES.filter(function (u) {
      if (u.br && u.br !== S.bid) return false;
      if (cardOpen(u)) return false;
      if (u.id === 'evo') return S.lv >= 5 && u.st === 0;
      return u.st < u.max;
    });
    lockedPool.sort(function () { return Math.random() - 0.5; });
    if (lockedPool.length) {
      if (pool.length >= 3) pool.pop();
      pool.push(lockedPool[0]);
      pool.sort(function () { return Math.random() - 0.5; });
    }
    rowEl.innerHTML = '';
    curPicks = [];
    function choose(u) {
      var bD = S.dmg, bF = S.fire;
      u.apply(); u.st += 1; delete u._fb;
      if (el.stats) { el.stats.classList.add('hi'); setTimeout(function () { el.stats.classList.remove('hi'); }, 1400); }
      flashAt(S.pos.clone().setY(1.0), null, 9);
      toast('伤害 ' + bD.toFixed(1) + ' → ' + S.dmg.toFixed(1) + ' · 间隔 ' + bF.toFixed(2) + ' → ' + S.fire.toFixed(2) + 's', 1800);
      S.picked = S.picked || {};
      S.picked[u.id] = (S.picked[u.id] || 0) + 1;
      cardEl.classList.remove('on');
      S.paused = false;
    }
    pool.forEach(function (u, i) {
      var d = document.createElement('div');
      d.className = 'card ' + u.rar;
      var locked = !cardOpen(u) && !u._fb;
      if (locked) d.className = 'card ' + u.rar + ' locked';
      var rar = u.rar === 'epic' ? '分支 · 进化' : (u.rar === 'rare' ? (u.br ? '分支 · 专属' : '稀有') : '普通');
      var pips = '';
      if (u.max > 1) { for (var p = 0; p < u.max; p++) pips += (p < u.st ? '<b>●</b>' : '○'); }
      var pgm = (u.src || '').match(/原文\s*(\d+)\s*页/);
      var lockLine = locked ? ('🔒 原文 ' + (pgm ? pgm[1] + ' 页' : ('第 ' + u.ch + ' 章'))) : '';
      var footTxt = locked ? ('🔒 原文 ' + (pgm ? pgm[1] + ' 页' : ('第 ' + u.ch + ' 章'))) : (u.src || '');
      d.innerHTML = '<div class="num">' + (i + 1) + '</div>' +
        '<div class="media"><div class="ico">' + cardIcon(u) + '</div><div class="rar">' + rar + '</div></div>' +
        '<div class="body"><div class="n">' + u.n + '</div>' +
        '<div class="d">' + u.d + '</div>' +
        '<div class="pips">' + (pips || '') + '</div></div>' +
        '<div class="foot" title="' + (u.src || '').replace(/"/g, '') + '">' + footTxt + '</div>';
      d.onclick = function () {
        if (locked) { toast('读完第 ' + u.ch + ' 章才能解锁 · ' + (u.src || ''), 2600); return; }
        choose(u);
      };
      rowEl.appendChild(d);
      curPicks.push(u);
    });
    var lvEl = document.getElementById('cardLv');
    if (lvEl) lvEl.textContent = S.lv;
    var cw = document.getElementById('cardBuild');
    if (cw) {
      cw.innerHTML = '';
      Object.keys(S.picked || {}).forEach(function (id) {
        var uu = UPGRADES.filter(function (x) { return x.id === id; })[0];
        if (!uu) return;
        var e = document.createElement('i');
        e.textContent = uu.n + ' ×' + S.picked[id];
        cw.appendChild(e);
      });
    }
    var tip = document.getElementById('cardTip'); if (tip) tip.innerHTML = '';
    var lockRow = document.getElementById('cardLockRow'); if (lockRow) lockRow.innerHTML = '';
    cardEl.classList.add('on');
    bindCardKeys();
  }

  function gainXp(n) {
    S.xp += n;
    while (S.xp >= S.need) {
      S.xp -= S.need; S.lv += 1; S.need = Math.round(S.need * 1.45 + 2);
      if (S.lv === 5 || (S.lv > 5 && (S.lv - 5) % 3 === 0)) { setTimeout(mentorCheer, 380); }
      offerCards();
    }
  }

  /* ---------- HUD ---------- */
  var el = {
    lv: document.getElementById('hLv'), pow: document.getElementById('hPow'),
    xpNum: document.getElementById('hXpNum'), xpPct: document.getElementById('hXpPct'), disp: document.getElementById('hDisp'), branch: document.getElementById('hBranch'),
    xp: document.getElementById('xpFill'), kill: document.getElementById('hKill'),
    time: document.getElementById('hTime'), wave: document.getElementById('hWave'),
    hp: document.getElementById('hHp'), hpBar: document.getElementById('hpBar'), stats: document.getElementById('hStats')
  };
  var toastEl = document.getElementById('toast'), toastT = 0;
  function toast(msg, ms) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.style.opacity = '1';
    toastT = (ms || 1800) / 1000;
  }

  function hud() {
    el.lv.textContent = S.lv;
    if (el.branch) el.branch.textContent = S.branch;
    el.pow.textContent = Math.round(S.dmg * 10);
    el.xp.style.width = Math.min(100, (S.xp / S.need) * 100) + '%';
    if (el.xpNum) el.xpNum.textContent = S.xp + ' / ' + S.need;
    if (el.xpPct) el.xpPct.textContent = Math.round(Math.min(100, (S.xp / S.need) * 100)) + '%';
    if (el.disp) el.disp.textContent = (S.dispersed || 0) + ' / ' + (S.collapsed || 0);
    el.kill.textContent = S.kills;
    el.wave.textContent = S.wave + ' · ' + stageAt(S.t).label;
    var m = Math.floor(S.t / 60), s = Math.floor(S.t % 60);
    el.time.textContent = m + ':' + (s < 10 ? '0' + s : s);
    if (el.stats) el.stats.textContent = '伤害 ' + S.dmg.toFixed(1) + ' · 间隔 ' + S.fire.toFixed(2) + 's · 连锁 ' + S.chain + ' · 索敌 ' + Math.round(S.range) + 'm';
    el.hp.textContent = Math.max(0, Math.round(S.hp));
    el.hpBar.style.width = Math.max(0, (S.hp / S.maxHp) * 100) + '%';
  }

  var overEl = document.getElementById('over');
  document.getElementById('btnRetry').onclick = function () { location.reload(); };
  function gameOver() {
    S.over = true;
    MUSIC.mode = ''; musicSet('dead');
    document.getElementById('overInfo').textContent =
      '存活 ' + Math.floor(S.t) + ' 秒 · 击杀 ' + S.kills + ' 辆 · 等级 ' + S.lv;
    overEl.classList.add('on');
  }

  /* ---------- 主循环 ---------- */
  var clock = new T.Clock();
  function nearestEnemy(from, range) {
    var best = null, bd = range * range;
    if (S.boss && !S.boss.dead && S.boss.phase === 'solid') {
      var bx = S.boss.g.position.x - from.x, bz = S.boss.g.position.z - from.z;
      var bdist = Math.sqrt(bx * bx + bz * bz);
      if (bdist < range * 1.9) return S.boss;
    }
    for (var i = 0; i < enemies.length; i++) {
      var e = enemies[i];
      var dx = e.g.position.x - from.x, dz = e.g.position.z - from.z;
      var d = dx * dx + dz * dz;
      if (d < bd) { bd = d; best = e; }
    }
    return best;
  }

  function dmgMul(e) {
    if (!S.obs) return 1;
    var dx = e.g.position.x - S.pos.x, dz = e.g.position.z - S.pos.z;
    var len = Math.hypot(dx, dz) || 1;
    var front = (-dz) / len;          /* 屏幕上方 = -z */
    return front > 0.766 ? 1.6 : 0.85; /* ±40° */
  }

  function hurt(e, amount) {
    e.hp -= amount;
    e.flash = 0.17;
    e.jit = 0.1;
    /* 每次命中都给一点"压手感"：顿帧 30ms + 微震，重击（伤害≥18）加倍 */
    var _heavy = amount >= 18;
    S.hitStop = Math.max(S.hitStop, _heavy ? 0.075 : 0.032);
    S.shake = Math.min(1.0, S.shake + (_heavy ? 0.16 : 0.055));
    if (S.slow > 0) e.slowT = 1.6;
    var p = new T.Vector3(e.g.position.x, 1.1, e.g.position.z);
    damageNumber(p, Math.round(amount));
    hitBurst(p, 0.85);
    sfx('hit', 0.8 + Math.random() * 0.5);
    puffBurst(p, 10, (S.skin && S.skin.bolt) || 0xbfe6ff, false);
    decalAt(new T.Vector3(e.g.position.x, 0.03, e.g.position.z));
    if (e.isBoss && e.phase === 'solid') {
      for (var ti = 0; ti < e.thresholds.length; ti++) {
        if (e.hp / e.max <= e.thresholds[ti] && e.useT <= ti) {
          e.useT = ti + 1;
          e.phase = 'quantum';
          e.qt = 2.4;
          e.g.children.forEach(function (ch) { if (ch !== e.qPts) ch.visible = false; });
          e.qPts.visible = true;
          flashAt(new T.Vector3(e.g.position.x, 1.6, e.g.position.z), null, 6);
          puffBurst(new T.Vector3(e.g.position.x, 1.6, e.g.position.z), 46, 0xffd27f, true);
          S.shake = Math.min(1.2, S.shake + 0.5);
          screenFlash(0.34);
          toast('它散成了粒子——' + Math.round(e.thresholds[ti] * 100) + '%', 1800);
          break;
        }
      }
    }

    if (e.hp <= 0) {
      scene.remove(e.g);
      e.dead = true;
      if (e.isBoss) { S.bossNext = S.t + 75; toast('试验车解体 · 下一辆 75 秒后进场', 2000); }
      S.kills += 1;
      if (S.reloadOnKill) S.fireT = 0;
      S.shake = Math.min(0.95, S.shake + 0.26 * ((S.skin && S.skin.shake) || 1));
      quantumCloud(new T.Vector3(e.g.position.x, 0.2, e.g.position.z));
      flashAt(new T.Vector3(e.g.position.x, 0.9, e.g.position.z), null, 3.4);
      puffBurst(new T.Vector3(e.g.position.x, 0.9, e.g.position.z), 30, 0xbfe6ff, true);
      sfx('kill');
      screenFlash(e.isBoss ? 0.30 : 0.13);
      shockRing(new T.Vector3(e.g.position.x, 0.08, e.g.position.z), 0.4, 7.6, 0.62, 0xeaf6ff);
      sparkBurst(new T.Vector3(e.g.position.x, 0.9, e.g.position.z), 22);
      S.hitStop = Math.max(S.hitStop, e.isBoss ? 0.13 : 0.085);
    }
  }

  function updateQuarks(dt) {
    for (var i = qSystems.length - 1; i >= 0; i--) {
      var q = qSystems[i];
      q.t += dt;
      try { q.sys.update(dt); } catch (e) {}
      if (q.t > 1.4) {
        scene.remove(q.sys.emitter);
        try { q.sys.dispose(); } catch (e2) {}
        qSystems.splice(i, 1);
      }
    }
  }

  function tick(dt) {
    if (S.over) return;

    /* 顿帧：打中的那一下把世界按住几十毫秒 */
    if (S.hitStop > 0) {
      S.hitStop -= dt;
      camera.position.x += (Math.random() - 0.5) * 0.05;
      return;
    }


    /* 移动 */
    var mx = 0, mz = 0;
    if (keys.KeyW || keys.ArrowUp) mz -= 1;
    if (keys.KeyS || keys.ArrowDown) mz += 1;
    if (keys.KeyA || keys.ArrowLeft) mx -= 1;
    if (keys.KeyD || keys.ArrowRight) mx += 1;
    var dirV = new T.Vector3(mx, 0, mz);
    if (dirV.lengthSq() > 0) dirV.normalize();

    if (mouseOn) {
      var mp = mouseWorld();
      if (mp) {
        var dx = mp.x - S.pos.x, dz = mp.z - S.pos.z;
        var d = Math.hypot(dx, dz);
        if (d > 0.8) { dirV.x += dx / d * 0.8; dirV.z += dz / d * 0.8; dirV.normalize(); }
      }
    }
    S.pos.addScaledVector(dirV, S.spd * dt);
    if (S.tether > 0) {
      var tr = Math.hypot(S.pos.x, S.pos.z);
      if (tr > S.tether) { S.pos.x = S.pos.x / tr * S.tether; S.pos.z = S.pos.z / tr * S.tether; }
    }
    S.pos.x = Math.max(-400, Math.min(400, S.pos.x));
    S.pos.z = Math.max(-400, Math.min(400, S.pos.z));
    var gx = Math.round(S.pos.x / 20) * 20, gz = Math.round(S.pos.z / 20) * 20;
    if (ground) ground.position.set(gx, 0, gz);
    if (gridA) gridA.position.set(gx, 0, gz);
    if (gridB) gridB.position.set(gx, 0, gz);
    if (!hz) hz = ['horizon-sky','horizon-glow','horizon-silhouette'].map(function (n) { return scene.getObjectByName(n); }).filter(Boolean);
    for (var hi = 0; hi < hz.length; hi++) { hz[hi].position.x = gx; hz[hi].position.z = gz; }
    if (rings) { rings[0].rotation.z += dt * 2.4; rings[1].rotation.x -= dt * 1.7; }
    var pk = 1.0 + (S.zoom || 1) * 0.2;
    pBody.scale.setScalar(pk * (1 + Math.sin(S.t * 7) * 0.06));
    pShell.scale.setScalar(pk * (1 + Math.sin(S.t * 3.1) * 0.09));
    obsField.visible = (S.bid === 'zhangbin');
    if (obsField.visible) {
      obsField.position.set(S.pos.x, 0.03, S.pos.z);
      obsField.material.opacity = 0.22 + Math.sin(S.t * 3) * 0.08;
    }
    playerSparks.position.set(S.pos.x, 0, S.pos.z);
    playerSparks.rotation.y = S.t * 1.7;
    playerSparks.position.y = 0.35 + Math.sin(S.t * 2.2) * 0.06;
    player.position.copy(S.pos);
    player.position.y = 0.55 + Math.sin(S.t * 4) * 0.05;

    if (dustPoints) dustPoints.rotation.y += dt * 0.012;

    /* 拖尾：把头部插到历史最前，再按弧长铺一条带 */
    for (var i = TRAIL_N - 1; i > 0; i--) trailHist[i].copy(trailHist[i - 1]);
    trailHist[0].set(S.pos.x, 0.6, S.pos.z);
    (function rebuildTrail() {
      var pos = trailGeo.attributes.position.array;
      var col = trailGeo.attributes.color.array;
      var sk = S.skin || {};
      var hex = sk.trail || 0x6fb8ff;
      var cr = ((hex >> 16) & 255) / 255, cg = ((hex >> 8) & 255) / 255, cb = (hex & 255) / 255;
      var dir = new T.Vector3(), side = new T.Vector3(), camDir = new T.Vector3();
      for (var k = 0; k < TRAIL_N; k++) {
        var p = trailHist[k];
        var q = trailHist[Math.min(k + 1, TRAIL_N - 1)];
        dir.subVectors(p, q);
        if (dir.lengthSq() < 1e-8) dir.set(0, 0, 1);
        camDir.subVectors(camera.position, p).normalize();
        side.crossVectors(dir, camDir).normalize();
        if (side.lengthSq() < 1e-6) side.set(0, 1, 0);
        var f = k / (TRAIL_N - 1);
        var w = 0.30 * Math.pow(1 - f, 1.35) + 0.015;
        pos[k * 6] = p.x + side.x * w; pos[k * 6 + 1] = p.y + side.y * w; pos[k * 6 + 2] = p.z + side.z * w;
        pos[k * 6 + 3] = p.x - side.x * w; pos[k * 6 + 4] = p.y - side.y * w; pos[k * 6 + 5] = p.z - side.z * w;
        var f2 = Math.pow(1 - f, 1.6);
        col[k * 6] = cr * f2; col[k * 6 + 1] = cg * f2; col[k * 6 + 2] = cb * f2;
        col[k * 6 + 3] = cr * f2; col[k * 6 + 4] = cg * f2; col[k * 6 + 5] = cb * f2;
      }
      trailGeo.attributes.position.needsUpdate = true;
      trailGeo.attributes.color.needsUpdate = true;
    })();

    /* 相机：密度越高，视野拉得越远（屏幕上人和车一起变小 = 场面变大） */
    var dens = enemies.length / 22;
    var zoomTarget = Math.max(1, Math.min(2.35, 1 + dens * 0.55 + (S.wave - 1) * 0.07));
    S.zoom += (zoomTarget - S.zoom) * Math.min(1, dt * 1.6);
    var camH = 11.4 * S.zoom, camD = 15.0 * S.zoom;
    var cx = S.pos.x, cz = S.pos.z + camD;
    camera.position.x += (cx - camera.position.x) * Math.min(1, dt * 6);
    camera.position.z += (cz - camera.position.z) * Math.min(1, dt * 6);
    if (S.iframe > 0) S.iframe = Math.max(0, S.iframe - dt);
    /* 演示模式：每 3 秒回 1 点血，够把整局看到底 */
    if (DEMO && S.hp > 0 && S.hp < S.maxHp) { S.demoHeal = (S.demoHeal || 0) + dt; if (S.demoHeal > 3) { S.demoHeal = 0; S.hp = Math.min(S.maxHp, S.hp + 1); } }
    if (S.shake > 0.001) {
      camera.position.x += (Math.random() - 0.5) * S.shake;
      camera.position.y += (Math.random() - 0.5) * S.shake * 0.5;
      S.shake *= Math.pow(0.02, dt);
    }
    camera.position.y += (camH - camera.position.y) * Math.min(1, dt * 4);
    camera.lookAt(S.pos.x, 6.2, S.pos.z);
    playerGlow.position.set(S.pos.x, 0.03, S.pos.z);   /* 抬一点视线，让地平线进画 */

    /* 刷怪 */
    S.spawnT -= dt;
    var stg = stageAt(S.t);
    if (S.spawnT <= 0) {
      S.spawnT = S.spawnGap / stg.mult;
      var nSpawn = 1 + Math.floor(S.t / 45);
      for (var k = 0; k < nSpawn; k++) {
        var pool = stg.pool;
        if (S.bias && S.bias !== 'mix' && Math.random() < 0.45) pool = [S.bias];
        spawn(pool[Math.floor(Math.random() * pool.length)]);
      }
    }

    /* 敌人 */
    for (var j = enemies.length - 1; j >= 0; j--) {
      var e = enemies[j];
      if (e.dead) { enemies.splice(j, 1); continue; }
      var ddx = S.pos.x - e.g.position.x, ddz = S.pos.z - e.g.position.z;
      var dist = Math.hypot(ddx, ddz) || 1;
      var spMul = Math.max(0.25, 1 - (e.slowT > 0 ? S.slow : 0));
      if (S.auraR > 0) {
        var adx = e.g.position.x - S.pos.x, adz = e.g.position.z - S.pos.z;
        if (adx * adx + adz * adz < S.auraR * S.auraR) spMul *= 0.65;
      }
      if (e.slowT > 0) e.slowT -= dt;
      e.g.position.x += ddx / dist * e.sp * spMul * dt;
      e.g.position.z += ddz / dist * e.sp * spMul * dt;
      e.g.rotation.y = Math.atan2(ddx, ddz);
      if (e.isBoss && e.g.userData.rings) {
        var ud = e.g.userData;
        /* 丁仪分支只有 2 个环（makeMacro 里 nOrb=2），第 3 个是 undefined */
        if (ud.rings[0]) ud.rings[0].rotation.z += dt * 1.6;
        if (ud.rings[1]) ud.rings[1].rotation.x += dt * 1.1;
        if (ud.rings[2]) ud.rings[2].rotation.y += dt * 0.9;
        var pulse = 1 + Math.sin(S.t * 3.2) * 0.06;
        ud.core.scale.setScalar(pulse);
        ud.shell.scale.setScalar(1 + Math.sin(S.t * 2.1) * 0.05);
      }
      if (e.jit > 0) {
        e.jit -= dt;
        e.g.position.x += (Math.random() - 0.5) * e.jit * 1.2;
        e.g.position.z += (Math.random() - 0.5) * e.jit * 1.2;
      }
      if (e.flash > 0) {
        e.flash -= dt;
        e.g.scale.setScalar((KINDS[e.kind].size) * (1 + Math.max(0, e.flash) * 0.9));
      }
      /* 接触伤害 */
      if (dist < 1.7) {
        if (Math.random() < dt * 2) S.shake = Math.min(0.4, S.shake + 0.07);
        hurtPlayer(e.dmg * dt * 0.4, true);
      }
    }

    /* 自动放电 */
    S.fireT -= dt;
    if (S.fireT <= 0) {
      var mode = S.mode || 'chain';
      var from = new T.Vector3(S.pos.x, 0.7, S.pos.z);

      if (mode === 'blast') {
        /* 林云：一发重锤 + 落点范围伤害 */
        var tgt = nearestEnemy(S.pos, S.range);
        if (tgt) {
          S.fireT = S.fire;
          var to = new T.Vector3(tgt.g.position.x, 0.9, tgt.g.position.z);
          bolt(from, to);
          flashAt(to.clone().add(new T.Vector3(0, 0.3, 0)), null, 3.4 + Math.min(3.0, S.dmg * 0.22));
          S.shake = Math.min(0.7, S.shake + 0.3);
          hurt(tgt, S.dmg * dmgMul(tgt));
          for (var bi2 = enemies.length - 1; bi2 >= 0; bi2--) {
            var e3 = enemies[bi2];
            if (e3 === tgt || e3.dead) continue;
            if (e3.g.position.distanceTo(tgt.g.position) < S.blastR) hurt(e3, S.dmg * 0.55 * dmgMul(e3));
          }
        }
      } else if (mode === 'burst') {
        /* 张彬：同时打最近的三辆，每发轻 */
        var picked = [];
        for (var bj = 0; bj < enemies.length && picked.length < 12; bj++) picked.push(enemies[bj]);
        picked.sort(function (a, b) {
          return a.g.position.distanceToSquared(S.pos) - b.g.position.distanceToSquared(S.pos);
        });
        var hitAny = false;
        picked.slice(0, S.burstN).forEach(function (e4) {
          if (e4.dead || e4.g.position.distanceTo(S.pos) > S.range) return;
          hitAny = true;
          bolt(from, new T.Vector3(e4.g.position.x, 0.9, e4.g.position.z));
          hurt(e4, S.dmg * 0.55 * dmgMul(e4));
        });
        if (hitAny) S.fireT = S.fire;
      } else if (mode === 'beam') {
        /* 观察者：只打屏幕正前方 ±25° 的一条线，命中后目标直接"熄灭" */
        var fwd = { x: 0, z: -1 }, got = false;
        for (var bk = enemies.length - 1; bk >= 0; bk--) {
          var e5 = enemies[bk];
          if (e5.dead) continue;
          var dx5 = e5.g.position.x - S.pos.x, dz5 = e5.g.position.z - S.pos.z;
          var d5 = Math.hypot(dx5, dz5);
          if (d5 > S.range) continue;
          var cos5 = (-dz5) / (d5 || 1);
          if (cos5 < S.beamCos) continue;
          got = true;
          bolt(from, new T.Vector3(e5.g.position.x, 0.9, e5.g.position.z));
          if (Math.random() < S.exec) { hurt(e5, 1e6); continue; }
          if (S.noteT) e5.slowT = 2.0;
          hurt(e5, S.dmg * 1.15 * dmgMul(e5));
        }
        if (got) S.fireT = S.fire;
      } else {
        /* 丁仪（默认）：细电弧 + 连锁 */
        var target = nearestEnemy(S.pos, S.range);
        if (target) {
          S.fireT = S.fire;
          var to2 = new T.Vector3(target.g.position.x, 0.9, target.g.position.z);
          bolt(from, to2);
          flashAt(from.clone().add(new T.Vector3(0, 0.2, 0)), to2.clone().sub(from).normalize(), 1.8);
          var dm = S.dmg * dmgMul(target);
      if (S.sameT && S.lastTarget === target) { S.sameCount = Math.min(3, (S.sameCount || 0) + 1); }
      else { S.sameCount = 0; }
      S.lastTarget = target;
      if (S.sameT) dm *= (1 + 0.12 * (S.sameCount || 0));
      hurt(target, dm);
          var cur = target, chained = 0;
          while (chained < S.chain) {
            var nxt = null, nd = 25;
            for (var q = 0; q < enemies.length; q++) {
              var e2 = enemies[q];
              if (e2 === cur || e2.dead) continue;
              var dd = e2.g.position.distanceTo(cur.g.position);
              if (dd < nd && dd > 0.5) { nd = dd; nxt = e2; }
            }
            if (!nxt) break;
            bolt(new T.Vector3(cur.g.position.x, 0.9, cur.g.position.z), new T.Vector3(nxt.g.position.x, 0.9, nxt.g.position.z));
            hurt(nxt, S.dmg * 0.6 * dmgMul(nxt));
            cur = nxt; chained++;
          }
        }
      }
    }

    /* BOSS 的量子态 → 弹幕 → 复原 */
    for (var bq = enemies.length - 1; bq >= 0; bq--) {
      var bb = enemies[bq];
      if (!bb.isBoss || bb.phase !== 'quantum') continue;
      bb.qt -= dt;
      bb.qPts.rotation.y += dt * 1.4;
      if (bb.qt <= 0) {
        bb.phase = 'solid';
        bb.qPts.visible = false;
        bb.g.children.forEach(function (ch) { if (ch !== bb.qPts) ch.visible = true; });
        shootBurst(new T.Vector3(bb.g.position.x, 1.4, bb.g.position.z), 26, 7.2);
        setTimeout(function () {
          if (bb && bb.g && bb.g.parent) shootBurst(new T.Vector3(bb.g.position.x, 1.4, bb.g.position.z), 26, 5.4);
        }, 420);
        S.shake = Math.min(1.2, S.shake + 0.6);
      }
    }

    /* BOSS 弹幕编排：螺旋 + 瞄准扇形 + 阶段花瓣 */
    if (S.boss && !S.boss.dead && S.boss.phase === 'solid') {
      S.boss.spT = (S.boss.spT || 0) - dt;
      if (S.boss.spT <= 0) { S.boss.spT = 0.16; fireSpiral(S.boss); }
      S.boss.aimT = (S.boss.aimT || 0) - dt;
      if (S.boss.aimT <= 0) { S.boss.aimT = 2.0; fireAim(S.boss); }
      if (!S.boss.laser) {
        S.boss.lzT = (S.boss.lzT || 0) - dt;
        if (S.boss.lzT <= 0) { S.boss.lzT = 7.0; fireLaser(S.boss); }
      }
    }

    if (S.boss && !S.boss.dead) laserTick(dt, S.boss);

    /* 子弹 */
    for (var bu = bullets.length - 1; bu >= 0; bu--) {
      var bl = bullets[bu];
      bl.life -= dt;
      bl.o.position.addScaledVector(bl.v, dt);
      bl.o.position.y = 1.0;
      var bdx = bl.o.position.x - S.pos.x, bdz = bl.o.position.z - S.pos.z;
      if (bdx * bdx + bdz * bdz < 1.15 * 1.15) {
        hurtPlayer(3);
        scene.remove(bl.o); bullets.splice(bu, 1); continue;
      }
      var fdx = bl.o.position.x - S.pos.x, fdz = bl.o.position.z - S.pos.z;
      if (bl.life <= 0 || fdx * fdx + fdz * fdz > 70 * 70) { scene.remove(bl.o); bullets.splice(bu, 1); }
    }

    /* 量子云 */
    var ndcV = new T.Vector3();
    for (var qi = qClouds.length - 1; qi >= 0; qi--) {
      var cq = qClouds[qi];
      cq.t += dt;
      var pa2 = cq.geo.attributes.position.array;
      for (var pi = 0; pi < cq.vel.length; pi++) {
        pa2[pi * 3] += cq.vel[pi].x * dt * 0.5;
        pa2[pi * 3 + 1] += cq.vel[pi].y * dt * 0.5;
        pa2[pi * 3 + 2] += cq.vel[pi].z * dt * 0.5;
        cq.vel[pi].y -= 0.25 * dt;
      }
      cq.geo.attributes.position.needsUpdate = true;
      cq.shell.rotation.y += dt * 0.8;
      cq.shell.rotation.x += dt * 0.4;
      ndcV.copy(cq.g.position).project(camera);
      var dist2 = cq.g.position.distanceTo(S.pos);
      var center = Math.abs(ndcV.x) < 0.62 && Math.abs(ndcV.y) < 0.62 && ndcV.z < 1;
      var wide = Math.abs(ndcV.x) < 0.82 && Math.abs(ndcV.y) < 0.82 && ndcV.z < 1;
      var onScreen = false;
      if (S.bid === 'dingyi') onScreen = wide;                    /* 看得远：半个屏幕都算 */
      else if (S.bid === 'linyun') onScreen = dist2 < 16 && Math.abs(ndcV.x) < 0.85 && Math.abs(ndcV.y) < 0.85;         /* 必须贴脸看 */
      else if (S.bid === 'zhangbin') onScreen = dist2 < 12;       /* 脚下观测场 */
      else if (S.bid === 'observer') onScreen = false;             /* 不看 */
      else onScreen = center;
      if (onScreen && dist2 < 30) cq.obs += dt;
      else cq.obs = Math.max(0, cq.obs - dt * 0.6);
      var need = 0.3;
      if (cq.obs >= need) { collapseCloud(cq); continue; }
      /* 观察者：不看也能留 20 秒，并且 12 秒后自己坍缩 */
      if (S.bid === 'observer' && cq.t > 8) { collapseCloud(cq); continue; }
      var life0 = (S.bid === 'observer') ? 20 : 8.5;
      if (cq.t > life0) {
        var k2 = Math.max(0, 1 - (cq.t - life0) / 1.5);
        cq.pts.material.opacity = 0.95 * k2;
        cq.shell.material.opacity = 0.35 * k2;
        if (k2 <= 0) removeCloud(cq);
      }
    }

    /* 经验球 */
    for (var oi = orbs.length - 1; oi >= 0; oi--) {
      var o = orbs[oi];
      var ox = S.pos.x - o.o.position.x, oz = S.pos.z - o.o.position.z;
      var od = Math.hypot(ox, oz) || 0.0001;
      o.age = (o.age || 0) + dt;
      /* 0.9 秒后自己开始飘过来：远距离击杀也能吃上经验，不用走回去捡 */
      if (od < S.magnet || o.age > 0.9) {
        var pull = (o.age > 0.9 ? 13 : 8) * dt;
        o.o.position.x += ox / od * pull;
        o.o.position.z += oz / od * pull;
      }
      o.o.position.y = 0.42 + Math.sin(S.t * 5 + o.v) * 0.08;
      if (od < 1.15) {
        scene.remove(o.o); orbs.splice(oi, 1); gainXp(1);
      }
    }

    if (toastT > 0) { toastT -= dt; if (toastT <= 0 && toastEl) toastEl.style.opacity = '0'; }

    /* 特效 */
    for (var fi = fx.length - 1; fi >= 0; fi--) {
      var f = fx[fi];
      f.life -= dt;
      var k = Math.max(0, f.life / f.max);
      if (f.kind === 'puff') {
        var arr = f.o.geometry.attributes.position.array;
        for (var pi = 0; pi < f.vel.length; pi++) {
          f.vel[pi].multiplyScalar(1 - dt * 2.2);
          f.vel[pi].y -= dt * 3.4;
          arr[pi * 3] += f.vel[pi].x * dt;
          arr[pi * 3 + 1] += f.vel[pi].y * dt;
          arr[pi * 3 + 2] += f.vel[pi].z * dt;
        }
        f.o.geometry.attributes.position.needsUpdate = true;
        f.o.material.opacity = k * k;
        f.o.material.size *= (1 + dt * 1.4);
      }
      else if (f.kind === 'ring') {
        var e3 = 1 - k;
        var rr = f.r0 + (f.r1 - f.r0) * (1 - Math.pow(1 - e3, 3));
        f.o.scale.setScalar(rr);
        f.o.material.opacity = Math.pow(k, 0.6);
      }
      else if (f.kind === 'flash') { f.o.material.opacity = k; f.o.scale.multiplyScalar(1 + dt * 6); }
      else if (f.kind === 'decal') { f.o.material.opacity = 0.9 * k; }
      else if (f.kind === 'num') { f.o.position.y += dt * 1.6; f.o.material.opacity = k; }
      else if (f.kind === 'spark') {
        var pa = f.geo.attributes.position.array;
        for (var si = 0; si < f.v.length; si++) {
          f.v[si].y -= 9 * dt;
          pa[si * 3] += f.v[si].x * dt;
          pa[si * 3 + 1] += f.v[si].y * dt;
          pa[si * 3 + 2] += f.v[si].z * dt;
        }
        f.geo.attributes.position.needsUpdate = true;
        f.o.material.opacity = k;
      }
      if (f.life <= 0) {
        scene.remove(f.o);
        if (f.o.geometry) f.o.geometry.dispose();
        if (f.o.material) { if (f.o.material.map && f.kind === 'num') f.o.material.map.dispose(); f.o.material.dispose(); }
        fx.splice(fi, 1);
      }
    }

    /* 电弧淡出 */
    for (var bi = bolts.length - 1; bi >= 0; bi--) {
      var bo = bolts[bi];
      bo.life -= dt;
      var kk = Math.max(0, bo.life / bo.max);
      bo.o.material.opacity = kk;
      if (bo.h) bo.h.material.opacity = kk * 0.5;
      if (bo.life <= 0) {
        scene.remove(bo.o); if (bo.h) scene.remove(bo.h);
        bo.o.geometry.dispose(); bo.o.material.dispose();
        if (bo.h) bo.h.material.dispose();
        bolts.splice(bi, 1);
      }
    }

    /* 波次 */
    S.t += dt;
    if (S.t > 1.6) mentorSay('start');
    if (S.lv >= 2) mentorSay('lv');
    if (S.hp > 0 && S.hp < S.maxHp * 0.35) mentorSay('low');
    if (BGM.on) { var mm = S.over ? 'dead' : (S.boss && !S.boss.dead ? 'boss' : (enemies.length > 9 ? 'fight' : 'calm')); bgmSet(mm); musicSet(mm); musicTick(); }
    if (!S.boss && S.t > (S.bossNext || 45)) { spawnBoss(); S.bossNext = S.t + 75; }
    if (S.boss) mentorSay('boss');
    if (S.boss && S.boss.dead) S.boss = null;

    if (S.t > S.wave * 30) {
      S.wave += 1;
      S.spawnGap = Math.max(0.22, S.spawnGap * 0.86);
    }
    hud();
    var bw = document.getElementById('bossWrap');
    if (bw) {
      if (S.boss && !S.boss.dead) {
        bw.style.display = 'block';
        document.getElementById('bossFill').style.width = Math.max(0, (S.boss.hp / S.boss.max) * 100) + '%';
        document.getElementById('bossState').textContent = S.boss.phase === 'quantum' ? '量子态 · 不可锁定' : '实体';
      } else bw.style.display = 'none';
    }
  }

  function loop() {
    requestAnimationFrame(loop);
    var dt = Math.min(0.05, clock.getDelta());
    if (!S.paused) tick(dt);
    if (BGM.on) musicTick();
    updateQuarks(dt);
    autoQuality(dt);
    fpsTick(dt);
    bloomRender();
  }

  /* 自适应画质：每 2 秒看一次实际帧率，掉到 48 以下先降像素比，再关泛光；回升后逐步加回去 */
  var qAcc = 0, qN = 0, qCool = 0, qSaid = false;
  var fpEl = document.getElementById('fpsMeter'), fpAcc = 0, fpN = 0;
  /* 返回武器库：带当前分支，回到对应那张卡 */
  var bkEl = document.getElementById('backLab');
  if (bkEl) { try { var _b = localStorage.getItem('bl.branch'); if (_b) bkEl.href = 'showcase.html?b=' + _b; } catch (e) {} }
  function fpsTick(dt) {
    if (!fpEl) return;
    fpAcc += dt; fpN++;
    if (fpAcc < 0.5) return;
    var v = Math.round(fpN / fpAcc); fpAcc = 0; fpN = 0;
    fpEl.textContent = v + ' fps · ' + (bloomOn ? '泛光' : '无泛光') + ' · ' + dpr.toFixed(2) + 'x';
  }
  function autoQuality(dt) {
    qAcc += dt; qN++; qCool -= dt;
    if (qAcc < 2) return;
    var fps = qN / qAcc; qAcc = 0; qN = 0;
    if (qCool > 0) return;
    if (fps < 48) {
      if (dpr > 1.05) { dpr = Math.max(1, dpr - 0.25); }
      else if (bloomOn) { bloomOn = false; }
      else return;
      renderer.setPixelRatio(dpr); renderer.setSize(W, H); qCool = 1.5;
      if (!qSaid) { qSaid = true; toast(bloomOn ? '帧率偏低 · 已降低渲染分辨率' : '帧率偏低 · 已关闭泛光', 2200); }
    } else if (fps > 57) {
      if (!bloomOn && dpr >= DPR_MAX - 0.01) { bloomOn = true; qCool = 3; }
      else if (dpr < DPR_MAX - 0.01) { dpr = Math.min(DPR_MAX, dpr + 0.25); renderer.setPixelRatio(dpr); renderer.setSize(W, H); qCool = 3; }
    }
  }

  boot.style.display = 'none';
  hud();
  loop();

  window.__arena = {
    bgm: function () { return { on: BGM.on, mode: BGM.mode, muted: AUD.muted, state: AUD.ctx && AUD.ctx.state }; },
    music: function () { return { on: MUSIC.on, mode: MUSIC.mode, vols: Object.keys(MUSIC.list).map(function (k) { return k + ':' + MUSIC.list[k].volume.toFixed(2); }).join(' '), scale: BGM.scale, muted: AUD.muted }; },
    gainXp: gainXp,
    quality: function () { return { dpr: +dpr.toFixed(2), max: DPR_MAX, bloom: bloomOn }; },
    laser: function () { if (S.boss && !S.boss.dead) fireLaser(S.boss); },
    state: function () {
      return { hp: S.hp, lv: S.lv, kills: S.kills, wave: S.wave, x: +S.pos.x.toFixed(1), z: +S.pos.z.toFixed(1), bossNext: +(S.bossNext||0).toFixed(0), boss: !!S.boss, enemies: enemies.length, quantum: qClouds.length, collapsed: S.collapsed || 0, auraR: S.auraR || 0, t: Math.round(S.t), paused: S.paused };
    },
    spawn: function (n) { for (var i = 0; i < (n || 1); i++) spawn('tank'); },
    hurtAll: function () { for (var i = 0; i < enemies.length; i++) hurt(enemies[i], 999); },
    die: function () { S.hp = 0; gameOver(); },
    level: function () { gainXp(S.need); },
    boss: function () { if (!S.boss) spawnBoss(); return !!S.boss; },
    hurtBoss: function (d) { var b = S.boss; if (b) hurt(b, d || 100); },
    clouds: function () {
      return qClouds.map(function (c) {
        var v = new T.Vector3().copy(c.g.position).project(camera);
        return { ndc: [+v.x.toFixed(2), +v.y.toFixed(2)], dist: +c.g.position.distanceTo(S.pos).toFixed(1), obs: +c.obs.toFixed(2), t: +c.t.toFixed(1) };
      });
    }
  };

/* 演示模式角标：?demo=1 时全解锁，必须让观众一眼看出"跳过阅读" */
try {
  if (DEMO) {
    var bd = document.createElement('div');
    bd.id = 'demoBadge';
    bd.textContent = '演示模式 · 卡片全解锁 · 受伤减半';
    bd.style.cssText = 'position:fixed;right:14px;bottom:52px;z-index:9;padding:6px 12px;border-radius:999px;'
      + 'background:rgba(255,190,90,.14);border:1px solid rgba(255,190,90,.5);color:#ffcf80;'
      + 'font:12px/1.2 system-ui;letter-spacing:.08em;pointer-events:none';
    document.body.appendChild(bd);
  }
} catch (e) {}

})();
