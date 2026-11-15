/* 球状闪电 · 观测台 v3（P0：灯板 / 地面反射 / 屏幕空间体积光 / ACES / 暗角 / 颗粒） */
(function () {
  'use strict';
  var T = window.THREE;
  var boot = document.getElementById('boot');
  if (!T) { boot.textContent = 'three.js 没加载上'; return; }

  var CHARS = [
    { id: 'dingyi', name: '丁仪', tag: '他只相信能被观测到的东西。你在数次数，他在写误差。',
      rows: [['立场', '观测者'], ['出手', '冷白细电弧'], ['弱点', '单发太低']], color: 0x9fd0ff, shape: 'shell' },
    { id: 'linyun', name: '林云', tag: '你先开火，再解释。打偏了也是数据，打中了就是答案。',
      rows: [['立场', '实战派'], ['出手', '爆炸 · 范围'], ['弱点', '装填慢']], color: 0xffb066, shape: 'spike' },
    { id: 'zhangbin', name: '张彬', tag: '先算清楚，再动手。他修过太多东西，知道哪儿先断。',
      rows: [['立场', '工程派'], ['出手', '三路齐射'], ['弱点', '单发低']], color: 0x7fe3ff, shape: 'lattice' },
    { id: 'observer', name: '陈博士', tag: '你是陈博士。这一切是你后来记下来的——包括你当时没看清的部分。',
      rows: [['立场', '主角'], ['出手', '正向光束'], ['弱点', '背后打不到']], color: 0xc7b2ff, shape: 'cloud' }
  ];

  var W = innerWidth, H = innerHeight;
  var canvas = document.getElementById('gl');
  var renderer = new T.WebGLRenderer({ canvas: canvas, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.setSize(W, H);
  renderer.setClearColor(0x02030a, 1);

  var scene = new T.Scene();

  /* 环境贴图（让金属有东西可反射，否则 metalness 高的材质全黑） */
  var equirectEnv = (function () {
    var c = document.createElement('canvas'); c.width = 256; c.height = 128;
    var x = c.getContext('2d');
    var g = x.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, '#0b1524'); g.addColorStop(0.45, '#16273b');
    g.addColorStop(0.56, '#0b1420'); g.addColorStop(1, '#04060a');
    x.fillStyle = g; x.fillRect(0, 0, 256, 128);
    var pg = x.createRadialGradient(128, 24, 0, 128, 24, 46);
    pg.addColorStop(0, 'rgba(235,246,255,0.92)');
    pg.addColorStop(1, 'rgba(200,230,255,0)');
    x.fillStyle = pg; x.beginPath(); x.arc(128, 24, 46, 0, 7); x.fill();
    var t = new T.CanvasTexture(c);
    t.mapping = T.EquirectangularReflectionMapping;
    return t;
  })();
  scene.environment = equirectEnv;
  var camera = new T.PerspectiveCamera(40, W / H, 0.1, 200);
  camera.position.set(0, 3.05, 15.4);
  camera.lookAt(0, 2.95, 0);

  /* ---------------- 灯光 ---------------- */
  scene.add(new T.AmbientLight(0x7f9ec4, 0.55));
  var key = new T.DirectionalLight(0xcfe2ff, 0.7); key.position.set(-8, 14, 8); scene.add(key);
  var rim = new T.DirectionalLight(0x2f6ea8, 0.5); rim.position.set(9, 5, -9); scene.add(rim);
  var spot = new T.SpotLight(0xfff6e8, 3.2, 40, 0.5, 0.8, 1.35);
  spot.position.set(0, 8.15, 0.6); spot.target.position.set(0, 2.2, 0);
  scene.add(spot); scene.add(spot.target);

  function softTex(inner, mid) {
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var x = c.getContext('2d');
    var g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,' + inner + ')');
    g.addColorStop(0.3, 'rgba(255,255,255,' + mid + ')');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    return new T.CanvasTexture(c);
  }
  var DOT = softTex(1, 0.4);
  function glowTexture() { return softTex(0.8, 0.25); }

  /* ---------------- 材质 ---------------- */
  var M = {
    metal:  new T.MeshStandardMaterial({ color: 0x1b232c, roughness: 0.34, metalness: 0.9 }),
    dark:   new T.MeshStandardMaterial({ color: 0x0c1117, roughness: 0.7, metalness: 0.3 }),
    stone:  new T.MeshStandardMaterial({ color: 0x141a21, roughness: 0.62, metalness: 0.22 }),
    trim:   new T.MeshStandardMaterial({ color: 0x323f4d, roughness: 0.22, metalness: 0.95 })
  };
  var LIGHTSTRIP = new T.MeshBasicMaterial({ color: 0xe6f2ff });

  /* ---------------- 房间壳 ---------------- */
  var room = new T.Mesh(new T.BoxGeometry(46, 18, 46),
    new T.MeshStandardMaterial({ color: 0x090c11, roughness: 0.95, metalness: 0.05, side: T.BackSide }));
  room.position.y = 9; scene.add(room);

  /* ---------------- 后墙 + 灯槽 ---------------- */
  var wall = new T.Mesh(new T.BoxGeometry(26, 9, 0.4), M.stone);
  wall.position.set(0, 4.5, -9.2); scene.add(wall);
  for (var ni = 0; ni < 4; ni++) {
    var nx = -8.2 + ni * 1.1;
    var niche = new T.Mesh(new T.BoxGeometry(0.4, 3.2, 0.3), M.dark);
    niche.position.set(nx, 5.15, -9.03); scene.add(niche);
    var strip = new T.Mesh(new T.BoxGeometry(0.08, 2.8, 0.05), LIGHTSTRIP);
    strip.position.set(nx, 5.15, -8.9); scene.add(strip);
    var ng = new T.Sprite(new T.SpriteMaterial({ map: softTex(1, 0.35), color: 0xd8ecff, transparent: true, opacity: 0.16, blending: T.AdditiveBlending, depthWrite: false }));
    ng.scale.set(0.7, 3.0, 1); ng.position.set(nx, 5.15, -8.72); scene.add(ng);
    var nl = new T.PointLight(0xcfe4ff, 0.28, 10, 2);
    nl.position.set(nx, 4.9, -8.4); scene.add(nl);
  }

  /* ---------------- 远处展台 ---------------- */
  var far2 = new T.Mesh(new T.BoxGeometry(3.4, 0.9, 3.4), M.dark);
  far2.position.set(9.5, 0.45, -8.6); scene.add(far2);
  var far3 = new T.Mesh(new T.BoxGeometry(3.6, 0.06, 3.6), M.trim);
  far3.position.set(9.5, 0.93, -8.6); scene.add(far3);

  /* ---------------- 地面（反射 + 砖缝） ---------------- */
  var rtMirror = new T.WebGLRenderTarget(W, H, { minFilter: T.LinearFilter, magFilter: T.LinearFilter });
  var mirrorCam = camera.clone();
  var floorMat = new T.ShaderMaterial({
    uniforms: {
      tRefl: { value: rtMirror.texture }, uRes: { value: new T.Vector2(W, H) },
      uBase: { value: new T.Color(0x090d13) }
    },
    vertexShader: [
      'varying vec3 vW;',
      'void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz;',
      '  gl_Position = projectionMatrix * viewMatrix * w; }'
    ].join('\n'),
    fragmentShader: [
      'uniform sampler2D tRefl; uniform vec2 uRes; uniform vec3 uBase;',
      'varying vec3 vW;',
      'void main(){',
      '  vec2 suv = gl_FragCoord.xy / uRes;',
      '  vec2 px = 1.0 / uRes;',
      '  vec3 r = texture2D(tRefl, suv).rgb * 0.5;',
      '  r += texture2D(tRefl, suv + vec2(0.0, px.y * 1.5)).rgb * 0.25;',
      '  r += texture2D(tRefl, suv - vec2(0.0, px.y * 1.5)).rgb * 0.25;',
      '  float d = length(vW.xz);',
      '  float fade = exp(-d * 0.05);',
      '  vec2 cell = vW.xz * 0.5;',
      '  vec2 g = abs(fract(cell) - 0.5);',
      '  float line = smoothstep(0.485, 0.5, max(g.x, g.y));',
      '  float tile = 0.9 + 0.1 * fract(sin(dot(floor(cell), vec2(12.9,78.2)))*43758.5);',
      '  vec3 col = uBase * tile + r * (0.9 * fade) + vec3(0.05,0.07,0.1) * line * fade;',
      '  gl_FragColor = vec4(col, 1.0); }'
    ].join('\n')
  });
  var floor = new T.Mesh(new T.PlaneGeometry(70, 70), floorMat);

  /* ---------- 平面反射（Reflector） ---------- */
  function makeReflector(geometry, opts) {
    opts = opts || {};
    var tw = opts.textureWidth || 1024, th = opts.textureHeight || 1024;
    var clipBias = opts.clipBias || 0.003;
    var color = new T.Color(opts.color === undefined ? 0x8899aa : opts.color);
    var reflectorPlane = new T.Plane();
    var normal = new T.Vector3();
    var reflectorWorldPosition = new T.Vector3();
    var cameraWorldPosition = new T.Vector3();
    var rotationMatrix = new T.Matrix4();
    var lookAtPosition = new T.Vector3(0, 0, -1);
    var clipPlane = new T.Vector4();
    var view = new T.Vector3();
    var target = new T.Vector3();
    var q = new T.Vector4();
    var textureMatrix = new T.Matrix4();
    var virtualCamera = new T.PerspectiveCamera();
    var renderTarget = new T.WebGLRenderTarget(tw, th);
    var material = new T.ShaderMaterial({
      uniforms: {
        color: { value: color },
        tDiffuse: { value: renderTarget.texture },
        textureMatrix: { value: textureMatrix }
      },
      vertexShader: 'uniform mat4 textureMatrix; varying vec4 vUv;' +
        'void main(){ vUv = textureMatrix * vec4(position,1.0); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 color; uniform sampler2D tDiffuse; varying vec4 vUv;' +
        'void main(){ vec4 base = texture2DProj(tDiffuse, vUv); gl_FragColor = vec4(base.rgb * color, 1.0); }'
    });
    var mesh = new T.Mesh(geometry, material);
    mesh.onBeforeRender = function (renderer, scene, camera) {
      reflectorWorldPosition.setFromMatrixPosition(mesh.matrixWorld);
      cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);
      rotationMatrix.extractRotation(mesh.matrixWorld);
      normal.set(0, 0, 1).applyMatrix4(rotationMatrix);
      view.subVectors(reflectorWorldPosition, cameraWorldPosition);
      if (view.dot(normal) > 0) return;
      view.reflect(normal).negate().add(reflectorWorldPosition);
      rotationMatrix.extractRotation(camera.matrixWorld);
      lookAtPosition.set(0, 0, -1).applyMatrix4(rotationMatrix).add(cameraWorldPosition);
      target.subVectors(reflectorWorldPosition, lookAtPosition);
      target.reflect(normal).negate().add(reflectorWorldPosition);
      virtualCamera.position.copy(view);
      virtualCamera.up.set(0, 1, 0).applyMatrix4(rotationMatrix).reflect(normal);
      virtualCamera.lookAt(target);
      virtualCamera.far = camera.far;
      virtualCamera.updateMatrixWorld();
      virtualCamera.projectionMatrix.copy(camera.projectionMatrix);
      textureMatrix.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
      textureMatrix.multiply(virtualCamera.projectionMatrix);
      textureMatrix.multiply(virtualCamera.matrixWorldInverse);
      textureMatrix.multiply(mesh.matrixWorld);
      reflectorPlane.setFromNormalAndCoplanarPoint(normal, reflectorWorldPosition);
      reflectorPlane.applyMatrix4(virtualCamera.matrixWorldInverse);
      clipPlane.set(reflectorPlane.normal.x, reflectorPlane.normal.y, reflectorPlane.normal.z, reflectorPlane.constant);
      var pm = virtualCamera.projectionMatrix;
      q.x = (Math.sign(clipPlane.x) + pm.elements[8]) / pm.elements[0];
      q.y = (Math.sign(clipPlane.y) + pm.elements[9]) / pm.elements[5];
      q.z = -1.0;
      q.w = (1.0 + pm.elements[10]) / pm.elements[14];
      clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));
      pm.elements[2] = clipPlane.x;
      pm.elements[6] = clipPlane.y;
      pm.elements[10] = clipPlane.z + 1.0 - clipBias;
      pm.elements[14] = clipPlane.w;
      mesh.visible = false;
      var currentRT = renderer.getRenderTarget();
      renderer.setRenderTarget(renderTarget);
      renderer.state.buffers.depth.setMask(true);
      if (renderer.autoClear === false) renderer.clear();
      renderer.render(scene, virtualCamera);
      renderer.setRenderTarget(currentRT);
      mesh.visible = true;
    };
    return mesh;
  }

  floor.rotation.x = -Math.PI / 2; scene.add(floor);
  var reflector = makeReflector(new T.PlaneGeometry(80, 80), { color: 0x93a4b6, textureWidth: 384, textureHeight: 384 });
  reflector.rotation.x = -Math.PI / 2; reflector.position.y = 0.02; scene.add(reflector);
  floor.visible = false;

  floor.material = new T.MeshStandardMaterial({ color: 0x0d131b, roughness: 0.07, metalness: 0.9, envMapIntensity: 1.5 });
  var fpool = new T.Mesh(
    new T.PlaneGeometry(11, 11),
    new T.MeshBasicMaterial({ map: softTex(0.9, 0.34), color: 0x8fb8e8, transparent: true, opacity: 0.55, blending: T.AdditiveBlending, depthWrite: false })
  );
  fpool.rotation.x = -Math.PI / 2; fpool.position.y = 0.015; scene.add(fpool);

  /* ---------------- 吊顶：格栅 + 吊杆 + 灯板 ---------------- */
  var panelTex = (function () {
    var c = document.createElement('canvas'); c.width = c.height = 256;
    var x = c.getContext('2d');
    x.fillStyle = '#0a0c10'; x.fillRect(0, 0, 256, 256);
    for (var i = 0; i < 8; i++) for (var j = 0; j < 8; j++) {
      var gx = i * 32, gy = j * 32;
      var g = x.createRadialGradient(gx + 16, gy + 16, 0, gx + 16, gy + 16, 14);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.45, 'rgba(210,235,255,0.55)');
      g.addColorStop(1, 'rgba(160,200,255,0)');
      x.fillStyle = g; x.beginPath(); x.arc(gx + 16, gy + 16, 14, 0, 7); x.fill();
    }
    return new T.CanvasTexture(c);
  })();

  var canopy = new T.Group(); scene.add(canopy);
  var cf1 = new T.Mesh(new T.BoxGeometry(6.4, 0.34, 0.34), M.metal);
  cf1.position.set(0, 8.5, 3.03); canopy.add(cf1);
  var cf2 = cf1.clone(); cf2.position.z = -3.03; canopy.add(cf2);
  var cf3 = new T.Mesh(new T.BoxGeometry(0.34, 0.34, 6.4), M.metal);
  cf3.position.set(3.03, 8.5, 0); canopy.add(cf3);
  var cf4 = cf3.clone(); cf4.position.x = -3.03; canopy.add(cf4);

  for (var gi = 0; gi < 9; gi++) {
    var slat = new T.Mesh(new T.BoxGeometry(6.0, 0.16, 0.05), M.dark);
    slat.position.set(0, 8.42, -2.8 + gi * 0.7); canopy.add(slat);
    var slat2 = new T.Mesh(new T.BoxGeometry(0.05, 0.16, 6.0), M.dark);
    slat2.position.set(-2.8 + gi * 0.7, 8.42, 0); canopy.add(slat2);
  }

  var panel = new T.Mesh(new T.PlaneGeometry(5.6, 5.6),
    new T.MeshBasicMaterial({ map: panelTex, transparent: true, opacity: 0.78, blending: T.AdditiveBlending, depthWrite: false }));
  panel.rotation.x = Math.PI / 2; panel.position.y = 8.3; canopy.add(panel);

  var panelBox = new T.Mesh(new T.BoxGeometry(6.1, 0.22, 6.1), M.metal);
  panelBox.position.y = 8.62; canopy.add(panelBox);

  for (var hi = 0; hi < 4; hi++) {
    var hang = new T.Mesh(new T.BoxGeometry(0.07, 1.5, 0.07), M.metal);
    hang.position.set(hi < 2 ? -2.9 : 2.9, 9.4, hi % 2 ? -2.9 : 2.9); canopy.add(hang);
  }

  /* ---------------- 展台：两级台阶 ---------------- */
  var step1 = new T.Mesh(new T.BoxGeometry(6.2, 0.32, 6.2), M.stone);
  step1.position.y = 0.16; scene.add(step1);
  var step1t = new T.Mesh(new T.BoxGeometry(6.26, 0.04, 6.26), M.trim);
  step1t.position.y = 0.32; scene.add(step1t);

  var plinth = new T.Mesh(new T.BoxGeometry(5.2, 0.66, 5.2), M.metal);
  plinth.position.y = 0.32 + 0.33; scene.add(plinth);
  var plinth2 = new T.Mesh(new T.BoxGeometry(5.35, 0.06, 5.35), M.trim);
  plinth2.position.y = 0.34 + 0.66; scene.add(plinth2);
  var plinthTop = new T.Mesh(new T.BoxGeometry(5.4, 0.08, 5.4), M.trim);
  plinthTop.position.y = 1.0; scene.add(plinthTop);

  var ring = new T.Mesh(new T.RingGeometry(2.34, 2.42, 96),
    new T.MeshBasicMaterial({ color: 0x74b6ff, transparent: true, opacity: 0.42, side: T.DoubleSide, blending: T.AdditiveBlending }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 1.045; scene.add(ring);

  /* ---------------- 柜体：金属框 + 立柱 + 玻璃 ---------------- */
  var CASE_B = 1.04, CASE_H = 5.6, CASE_W = 4.6;
  var CASE_Y = CASE_B + CASE_H / 2;
  var bf = new T.Mesh(new T.BoxGeometry(CASE_W + 0.26, 0.16, CASE_W + 0.26), M.trim);
  bf.position.y = CASE_B; scene.add(bf);
  var tf = new T.Mesh(new T.BoxGeometry(CASE_W + 0.26, 0.16, CASE_W + 0.26), M.trim);
  tf.position.y = CASE_B + CASE_H; scene.add(tf);
  var post = new T.Mesh(new T.BoxGeometry(0.13, CASE_H, 0.13), M.metal);
  [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (c) {
    var p = post.clone();
    p.position.set(c[0] * (CASE_W / 2), CASE_Y, c[1] * (CASE_W / 2));
    scene.add(p);
  });

  var caseGeo = new T.BoxGeometry(CASE_W, CASE_H, CASE_W);
  var glass = new T.Mesh(caseGeo, new T.MeshBasicMaterial({
    color: 0x8fb8e6, transparent: true, opacity: 0.022, side: T.DoubleSide, depthWrite: false, blending: T.AdditiveBlending }));
  glass.position.y = CASE_Y; scene.add(glass);

  var edgeMat = new T.LineBasicMaterial({ color: 0xb6dbff, transparent: true, opacity: 0.45 });
  var edges = new T.LineSegments(new T.EdgesGeometry(caseGeo), edgeMat);
  edges.position.y = CASE_Y; scene.add(edges);

  var caseTop = new T.Mesh(new T.BoxGeometry(CASE_W + 0.3, 0.1, CASE_W + 0.3), M.metal);
  caseTop.position.y = CASE_B + CASE_H + 0.13; caseTop.visible = false; scene.add(caseTop);

  var plaque = new T.Mesh(new T.BoxGeometry(0.5, 0.14, 0.02), M.trim);
  plaque.position.set(0, 0.8, CASE_W / 2 + 0.02); scene.add(plaque);

  /* ---------------- 粒子 ---------------- */
  var N = 14000;
  var pos = new Float32Array(N * 3), target = new Float32Array(N * 3);
  var col = new Float32Array(N * 3), asize = new Float32Array(N), seeds = new Float32Array(N * 4);
  for (var i = 0; i < N; i++) {
    seeds[i * 4] = Math.random(); seeds[i * 4 + 1] = Math.random();
    seeds[i * 4 + 2] = Math.random(); seeds[i * 4 + 3] = Math.random();
    asize[i] = 0.5 + Math.pow(Math.random(), 3) * 2.0;
  }
  var pGeo = new T.BufferGeometry();
  pGeo.setAttribute('position', new T.BufferAttribute(pos, 3));
  pGeo.setAttribute('color', new T.BufferAttribute(col, 3));
  pGeo.setAttribute('aSize', new T.BufferAttribute(asize, 1));
  pGeo.setAttribute('aSeed', new T.BufferAttribute(seeds, 4));

  var PVS = [
    'attribute float aSize;', 'attribute vec3 color;',
    'varying vec3 vC; varying float vS; varying float vSeed;', 'uniform float uSize, uTime;', 'attribute vec4 aSeed;',
    'void main(){ vC = color; vS = aSize; vSeed = aSeed.x;',
    '  vec4 mv = modelViewMatrix * vec4(position,1.0);',
    '  float tw = 0.78 + 0.55 * sin(uTime * 2.1 + vSeed * 6.2831);',
    '  gl_PointSize = uSize * aSize * tw / max(0.001, -mv.z);',
    '  gl_Position = projectionMatrix * mv; }'
  ].join('\n');
  var PFS = [
    'uniform sampler2D uMap; uniform float uOpacity, uTime;',
    'varying vec3 vC; varying float vS; varying float vSeed;',
    'void main(){ vec4 t = texture2D(uMap, gl_PointCoord);',
    '  if(t.a < 0.12) discard;',
    '  float a = smoothstep(0.12, 0.55, t.a);',
    '  float tw = 0.55 + 0.9 * pow(0.5 + 0.5 * sin(uTime * 3.4 + vSeed * 41.0), 3.0);',
    '  vec3 warm = vec3(1.0, 0.74, 0.38);',
    '  vec3 c = mix(vC, warm, pow(fract(vSeed * 7.3), 4.0) * 0.85);',
    '  gl_FragColor = vec4(c * t.rgb, a * uOpacity * tw); }'
  ].join('\n');

  function pmat(size, op, tex) {
    return new T.ShaderMaterial({
      uniforms: { uMap: { value: tex || DOT }, uSize: { value: size }, uOpacity: { value: op }, uTime: { value: 0 } },
      vertexShader: PVS, fragmentShader: PFS,
      transparent: true, blending: T.AdditiveBlending, depthWrite: false
    });
  }

  var BASE_Y = CASE_Y;
  var pMat = pmat(34, 0.42);
  var points = new T.Points(pGeo, pMat); points.position.y = BASE_Y; scene.add(points);

  var hazeMat = pmat(150, 0.042, softTex(0.25, 0.05));
  var haze = new T.Points(pGeo, hazeMat); haze.position.y = BASE_Y; scene.add(haze);

  /* ---------- 电火花拖尾 ---------- */
  var TRAIL_N = 320, trailIdx = new Int32Array(TRAIL_N);
  for (var ti = 0; ti < TRAIL_N; ti++) trailIdx[ti] = (Math.random() * N) | 0;
  var trPos = new Float32Array(TRAIL_N * 6), trCol = new Float32Array(TRAIL_N * 6);
  var trGeo = new T.BufferGeometry();
  trGeo.setAttribute('position', new T.BufferAttribute(trPos, 3));
  trGeo.setAttribute('color', new T.BufferAttribute(trCol, 3));
  var trail = new T.LineSegments(trGeo, new T.LineBasicMaterial({
    vertexColors: true, transparent: true, opacity: 0.55,
    blending: T.AdditiveBlending, depthWrite: false
  }));
  trail.position.y = BASE_Y; trail.visible = false; scene.add(trail);


  var reflMat = pmat(34, 0.20);
  var reflP = new T.Points(pGeo, reflMat);
  reflP.scale.y = -1; reflP.position.y = -BASE_Y + 1.94; scene.add(reflP);

  /* ---------- 体积雾（raymarch） ---------- */
  var VOL_DAY = new T.Vector3(0.6, 0.72, 0.95);
  var VOL = new T.Mesh(
    new T.BoxGeometry(CASE_W - 0.2, CASE_H - 0.2, CASE_W - 0.2),
    new T.ShaderMaterial({
      transparent: true, depthWrite: false, side: T.BackSide,
      blending: T.CustomBlending,
      blendSrc: T.OneFactor, blendDst: T.OneMinusSrcAlphaFactor,
      uniforms: {
        uTime: { value: 0 }, uCamPos: { value: new T.Vector3() },
        uMin: { value: new T.Vector3(-1, -1, -1) }, uMax: { value: new T.Vector3(1, 1, 1) },
        uTint: { value: VOL_DAY }, uDens: { value: 1.0 }
      },
      vertexShader: [
        'varying vec3 vWorld;',
        'void main(){ vec4 w = modelMatrix * vec4(position,1.0); vWorld = w.xyz;',
        '  gl_Position = projectionMatrix * viewMatrix * w; }'
      ].join('\n'),
      fragmentShader: [
        'precision highp float;',
        'uniform float uTime, uDens, uTopY; uniform vec3 uCamPos, uMin, uMax, uTint;',
        'varying vec3 vWorld;',
        'float hash(vec3 p){ p = fract(p*0.3183099+0.1); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }',
        'float noise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f*f*(3.0-2.0*f);',
        '  return mix(mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),',
        '             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z); }',
        'float fbm(vec3 p){ float a = 0.5, s = 0.0; for(int i=0;i<3;i++){ s += a*noise(p); p *= 2.03; a *= 0.5; } return s; }',
        'vec2 boxHit(vec3 ro, vec3 rd){',
        '  vec3 inv = 1.0/rd;',
        '  vec3 t0 = (uMin - ro)*inv, t1 = (uMax - ro)*inv;',
        '  vec3 tn = min(t0,t1), tf = max(t0,t1);',
        '  return vec2(max(max(tn.x,tn.y),tn.z), min(min(tf.x,tf.y),tf.z)); }',
        'float dens(vec3 p){',
        '  vec3 q = p - vec3(0.0, 2.9, 0.0); q.y *= 0.86;',
        '  float r = length(q);',
        '  float shape = smoothstep(2.45, 0.55, r);',
        '  vec3 wp = vec3(fbm(p*0.8 + uTime*0.05), fbm(p*0.8 + 5.1), fbm(p*0.8 + 9.7));',
  '  vec3 sp = (p + wp*0.5)*1.35 + vec3(0.0, uTime*0.06, uTime*0.04);',
        '  float n = fbm(sp*1.9);',
        '  float n2 = fbm(sp*4.3 + 11.0);',
        '  float base = smoothstep(0.46, 0.86, n*0.65+n2*0.45);',
        '  float hy = clamp((p.y-uMin.y)/(uMax.y-uMin.y), 0.0, 1.0); float top = pow(1.0-hy, 1.7); float band = exp(-pow((p.y-uTopY+0.9)*2.2, 2.0));',
        '  return shape * base * (0.18 + 1.05*top + 0.55*band) * uDens * 0.8; }',
        'void main(){',
        '  vec3 ro = uCamPos; vec3 rd = normalize(vWorld - ro);',
        '  vec2 h = boxHit(ro, rd);',
        '  if (h.y <= max(h.x, 0.0)) discard;',
        '  float t0 = max(h.x, 0.0), t1 = h.y;',
        '  float span = t1 - t0; const int STEPS = 26;',
        '  float dt = span / float(STEPS);',
        '  vec3 acc = vec3(0.0); float T = 1.0;',
        '  float jitter = hash(vec3(gl_FragCoord.xy, uTime));',
        '  for (int i=0;i<STEPS;i++){',
        '    float t = t0 + (float(i)+jitter)*dt;',
        '    vec3 p = ro + rd*t;',
        '    float a = dens(p);',
        '    if (a > 0.002){',
        '      float hy2 = clamp((p.y-uMin.y)/(uMax.y-uMin.y),0.0,1.0); vec3 lit = uTint * (0.5 + 0.9*pow(1.0-hy2, 1.3));',
        '      acc += lit * a * dt * 2.1 * T;',
        '      T *= exp(-a * dt * 2.2);',
        '    }',
        '    if (T < 0.05) break;',
        '  }',
        '  gl_FragColor = vec4(acc, 1.0 - T);',
        '}'
      ].join('\n')
    })
  );
  VOL.position.set(0, CASE_B + CASE_H * 0.5, 0);
  VOL.material.uniforms.uMin.value.set(-CASE_W*0.5+0.1, CASE_B+0.1, -CASE_W*0.5+0.1);
  VOL.material.uniforms.uMax.value.set(CASE_W*0.5-0.1, CASE_B+CASE_H-0.1, CASE_W*0.5-0.1);
  VOL.renderOrder = 3;
  var volScene = new T.Scene();
  volScene.add(VOL);
  var inLight = new T.PointLight(0xbfe0ff, 0.55, 7, 2); inLight.position.set(0, CASE_B + CASE_H - 0.7, 0); scene.add(inLight);

  var DUST = 900, dPos = new Float32Array(DUST * 3);
  for (var d = 0; d < DUST; d++) {
    dPos[d * 3] = (Math.random() - 0.5) * 7;
    dPos[d * 3 + 1] = Math.random() * 9 + 1.2;
    dPos[d * 3 + 2] = (Math.random() - 0.5) * 7;
  }
  var dGeo = new T.BufferGeometry();
  dGeo.setAttribute('position', new T.BufferAttribute(dPos, 3));
  var dust = new T.Points(dGeo, pmat(24, 0.4));
  scene.add(dust);

  /* ---------------- 形态 ---------------- */
  function shapeOf(kind, i) {
    var a = seeds[i * 4] * Math.PI * 2, b = Math.acos(2 * seeds[i * 4 + 1] - 1), r = seeds[i * 4 + 2];
    var x, y, z;
    if (kind === 'shell') {
      var wob = 0.88 + 0.2 * Math.sin(3 * a + 2.1 * b) + 0.1 * Math.sin(7 * a - 3 * b);
      var R = 2.02 * wob * (0.72 + 0.28 * Math.pow(r, 0.45));
      x = R * Math.sin(b) * Math.cos(a); y = R * Math.cos(b) * 0.96; z = R * Math.sin(b) * Math.sin(a);
    } else if (kind === 'spike') {
      var sp = (i % 5 === 0) ? (1.30 + 1.25 * r) : (0.52 + 0.24 * r), R2 = 1.75 * sp;
      x = R2 * Math.sin(b) * Math.cos(a); y = R2 * Math.cos(b); z = R2 * Math.sin(b) * Math.sin(a);
    } else if (kind === 'lattice') {
      var k = i % 3, t = seeds[i * 4] * Math.PI * 2, rad = 2.05, lean = (k - 1) * 0.62;
      x = Math.cos(t) * rad * Math.cos(lean);
      y = (seeds[i * 4 + 2] - 0.5) * 0.28 + Math.sin(t) * rad * Math.sin(lean) * 0.42;
      z = Math.sin(t) * rad;
      if (seeds[i * 4 + 3] > 0.9) { x *= 0.3; z *= 0.3; y *= 2.0; }
    } else {
      var g2 = Math.pow(r, 1.7), R3 = 2.6 * g2;
      x = R3 * Math.sin(b) * Math.cos(a) * 1.1;
      y = R3 * Math.cos(b) * 1.05;
      z = R3 * Math.sin(b) * Math.sin(a) * 0.95;
    }
    return [x, y, z];
  }
  function setShape(kind, color) {
    var c = new T.Color(color);
    for (var i = 0; i < N; i++) {
      var v = shapeOf(kind, i);
      target[i * 3] = v[0]; target[i * 3 + 1] = v[1]; target[i * 3 + 2] = v[2];
      var f = 0.45 + 0.55 * seeds[i * 4 + 3];
      col[i * 3] = c.r * f * 0.55 + 0.42; col[i * 3 + 1] = c.g * f * 0.55 + 0.44; col[i * 3 + 2] = c.b * f * 0.55 + 0.48;
    }
    pGeo.attributes.color.needsUpdate = true;
  }

  /* ---------------- 后处理 ---------------- */
  var rtScene = new T.WebGLRenderTarget(W, H, { minFilter: T.LinearFilter, magFilter: T.LinearFilter, type: T.HalfFloatType });
  var BW = Math.max(1, W >> 2), BH = Math.max(1, H >> 2);
  var rtBright = new T.WebGLRenderTarget(BW, BH, { minFilter: T.LinearFilter, magFilter: T.LinearFilter });
  var rtBlur1 = new T.WebGLRenderTarget(BW, BH, { minFilter: T.LinearFilter, magFilter: T.LinearFilter });
  var rtBlur2 = new T.WebGLRenderTarget(BW, BH, { minFilter: T.LinearFilter, magFilter: T.LinearFilter });
  var VW = Math.max(1, Math.floor(W / 2)), VH = Math.max(1, Math.floor(H / 2));
  var rtVol = new T.WebGLRenderTarget(VW, VH, { minFilter: T.LinearFilter, magFilter: T.LinearFilter });
  var rtRays = new T.WebGLRenderTarget(BW, BH, { minFilter: T.LinearFilter, magFilter: T.LinearFilter });

  var quadScene = new T.Scene();
  var quadCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  var quad = new T.Mesh(new T.PlaneGeometry(2, 2), null);
  quadScene.add(quad);

  var VERT = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.0,1.0); }';

  var brightMat = new T.ShaderMaterial({
    uniforms: { tDiffuse: { value: null }, uThr: { value: 0.34 } },
    vertexShader: VERT,
    fragmentShader: [
      'uniform sampler2D tDiffuse; uniform float uThr; varying vec2 vUv;',
      'void main(){ vec3 c = texture2D(tDiffuse, vUv).rgb;',
      '  float l = dot(c, vec3(0.2126,0.7152,0.0722));',
      '  float k = smoothstep(uThr, uThr + 0.42, l);',
      '  gl_FragColor = vec4(c * k, 1.0); }'
    ].join('\n')
  });

  var blurMat = new T.ShaderMaterial({
    uniforms: { tDiffuse: { value: null }, uDir: { value: new T.Vector2(1, 0) }, uRes: { value: new T.Vector2(BW, BH) } },
    vertexShader: VERT,
    fragmentShader: [
      'uniform sampler2D tDiffuse; uniform vec2 uDir; uniform vec2 uRes; varying vec2 vUv;',
      'void main(){ vec2 d = uDir / uRes;',
      '  vec3 s = texture2D(tDiffuse, vUv).rgb * 0.227;',
      '  s += texture2D(tDiffuse, vUv + d*1.4).rgb * 0.193;',
      '  s += texture2D(tDiffuse, vUv - d*1.4).rgb * 0.193;',
      '  s += texture2D(tDiffuse, vUv + d*3.2).rgb * 0.12;',
      '  s += texture2D(tDiffuse, vUv - d*3.2).rgb * 0.12;',
      '  s += texture2D(tDiffuse, vUv + d*5.4).rgb * 0.075;',
      '  s += texture2D(tDiffuse, vUv - d*5.4).rgb * 0.075;',
      '  gl_FragColor = vec4(s, 1.0); }'
    ].join('\n')
  });

  var raysMat = new T.ShaderMaterial({
    uniforms: { tDiffuse: { value: null }, uLight: { value: new T.Vector2(0.5, 0.12) } },
    vertexShader: VERT,
    fragmentShader: [
      'uniform sampler2D tDiffuse; uniform vec2 uLight; varying vec2 vUv;',
      'void main(){',
      '  vec2 dir = (uLight - vUv) * 0.62;',
      '  vec3 acc = vec3(0.0); float wsum = 0.0;',
      '  for(int i = 0; i < 24; i++){',
      '    float t = float(i) / 24.0;',
      '    vec2 p = vUv + dir * t;',
      '    vec3 s = texture2D(tDiffuse, p).rgb;',
      '    float l = dot(s, vec3(0.2126,0.7152,0.0722));',
      '    float w = smoothstep(0.25, 0.9, l) * (1.0 - t);',
      '    acc += s * w; wsum += w;',
      '  }',
      '  acc /= max(wsum, 0.001);',
      '  gl_FragColor = vec4(acc * 0.95, 1.0); }'
    ].join('\n')
  });

  var compMat = new T.ShaderMaterial({
    uniforms: {
      tBase: { value: null }, tBloom: { value: null }, tRays: { value: null }, tVol: { value: null },
      uStr: { value: 1.35 }, uRays: { value: 1.5 }, uTime: { value: 0 }
    },
    vertexShader: VERT,
    fragmentShader: [
      'uniform sampler2D tBase; uniform sampler2D tBloom; uniform sampler2D tRays; uniform sampler2D tVol;',
      'uniform float uStr; uniform float uRays; uniform float uTime;',
      'varying vec2 vUv;',
      'vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14), 0.0, 1.0); }',
      'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }',
      'void main(){',
      '  vec3 base = texture2D(tBase, vUv).rgb;',
      '  vec3 bloom = texture2D(tBloom, vUv).rgb;',
      '  vec3 rays = texture2D(tRays, vUv).rgb;',
      '  vec3 vol = texture2D(tVol, vUv).rgb;',
      '  vec3 c = base + bloom * uStr + rays * uRays + vol * 2.4;',
      '  c = aces(c * 1.05);',
      '  float vig = smoothstep(1.05, 0.28, length(vUv - 0.5) * 1.42);',
      '  c *= mix(0.82, 1.0, vig);',
      '  float g = (hash(vUv * 1024.0 + uTime) - 0.5) * 0.022;',
      '  c += g;',
      '  c = pow(c, vec3(0.94));',
      '  gl_FragColor = vec4(c, 1.0); }'
    ].join('\n')
  });

  function pass(mat, target) {
    quad.material = mat;
    renderer.setRenderTarget(target);
    renderer.clear();
    renderer.render(quadScene, quadCam);
  }

  /* ---------------- UI ---------------- */
  var MINE = (location.search.match(/[?&]b=([a-z]+)/) || [])[1] || '';
  var cur = MINE ? Math.max(0, CHARS.findIndex(function (c) { return c.id === MINE; })) : 0;
  var pName = document.getElementById('pName'), pTag = document.getElementById('pTag');
  var pNameCn = document.getElementById('pNameCn');
  var EN = { dingyi: 'DING YI', linyun: 'LIN YUN', zhangbin: 'ZHANG BIN', observer: 'CHEN' };
  var pRows = document.getElementById('pRows'), pIdx = document.getElementById('pIdx');
  var iNow = document.getElementById('iNow'), fIdx = document.getElementById('fIdx');
  var dotsEl = document.getElementById('dots');
  CHARS.forEach(function () { dotsEl.appendChild(document.createElement('i')); });
  function pad2(n) { return (n < 9 ? '0' : '') + (n + 1); }
  function renderUI() {
    var c = CHARS[cur];
    pName.textContent = EN[c.id] || c.name;
  var __f = (location.search.match(/[?&]f=(\w+)/) || [])[1];
  var __ff = { cy: "'Cyberiada','Helvetica Neue',Arial,sans-serif", cy2: "'Cyberiada','Helvetica Neue',Arial,sans-serif", bs: "'BeyondSpace','Helvetica Neue',Arial,sans-serif" }[__f];
  pName.style.fontFamily = __ff || '';
  if (__ff) { pName.style.letterSpacing = __f === 'cy2' ? '0.16em' : '0.09em'; pName.style.fontSize = __f === 'cy2' ? '44px' : '64px'; if (__f === 'cy2') pName.style.whiteSpace = 'nowrap'; } if (pNameCn) pNameCn.textContent = c.name; pTag.textContent = c.tag;
    pRows.innerHTML = c.rows.map(function (r) { return '<div class="row"><span>' + r[0] + '</span><b>' + r[1] + '</b></div>'; }).join('');
    var mineNow = !MINE || c.id === MINE;
    var asg = document.getElementById('pAsg');
    if (asg) { asg.textContent = mineNow ? (MINE ? '已分配 · 你的武器' : '预览 · 未参加入学测试') : ('这是' + c.name + '的武器'); asg.className = 'asg' + (mineNow ? (MINE ? '' : ' no') : ' no'); }
    var pk = document.getElementById('pick');
    if (pk) { pk.disabled = !mineNow; pk.textContent = mineNow ? '按回车 · 以他/她的视角开始' : '不是你的武器'; }
    pIdx.textContent = pad2(cur); iNow.textContent = pad2(cur); fIdx.textContent = pad2(cur) + ' / 04';
    Array.prototype.forEach.call(dotsEl.children, function (d, i) { d.className = i === cur ? 'on' : ''; });
  }
  function go(n) {
    cur = (n + CHARS.length) % CHARS.length;
    var c = CHARS[cur];
    setShape(c.shape, c.color); renderUI();
  }
  document.getElementById('prev').onclick = function () { go(cur - 1); };
  document.getElementById('next').onclick = function () { go(cur + 1); };
  function enter() {
    if (MINE && CHARS[cur].id !== MINE) return;
    try { localStorage.setItem('bl.branch', CHARS[cur].id); } catch (e) { }
    location.href = 'arena.html?b=' + CHARS[cur].id;
  }
  document.getElementById('pick').onclick = enter;
  /* 演示模式：跳过阅读、卡片全解锁，直接进试验场 */
  var dl = document.getElementById('demoLink');
  if (dl) {
    try {
      if (localStorage.getItem('bl.demo') === '1') { dl.textContent = '演示模式 开 · 点击关闭'; dl.className = 'on'; }
    } catch (e) {}
    dl.onclick = function (e) {
      e.preventDefault();
      var on = false;
      try { on = localStorage.getItem('bl.demo') === '1'; } catch (err) {}
      try { if (on) localStorage.removeItem('bl.demo'); else localStorage.setItem('bl.demo', '1'); } catch (err) {}
      if (on) { try { localStorage.removeItem('bl.demo'); } catch (err) {} location.reload(); return; }
      localStorage.setItem('bl.branch', CHARS[cur].id);
      location.href = 'arena.html?b=' + CHARS[cur].id + '&demo=1';
    };
  }
  addEventListener('keydown', function (e) {
    if (e.code === 'ArrowLeft') go(cur - 1);
    else if (e.code === 'ArrowRight') go(cur + 1);
    else if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); enter(); }
  });

  var drag = false, lastX = 0, rotV = 0, rot = 0;
  canvas.addEventListener('pointerdown', function (e) { drag = true; lastX = e.clientX; });
  addEventListener('pointerup', function () { drag = false; });
  addEventListener('pointermove', function (e) { if (!drag) return; rotV += (e.clientX - lastX) * 0.004; lastX = e.clientX; });

  var flags = { bloom: true, layers: true };
  function tgl(id, key) {
    var el = document.getElementById(id);
    el.onclick = function () {
      el.classList.toggle('on');
      flags[key] = el.classList.contains('on');
      compMat.uniforms.uStr.value = flags.bloom ? 1.25 : 0;
      compMat.uniforms.uRays.value = flags.layers ? 1.0 : 0;
      dust.visible = flags.layers;
    };
  }
  tgl('tDepth', 'depth'); tgl('tBloom', 'bloom'); tgl('tLayers', 'layers');

  /* ===== 展厅扩展：侧墙 / 井格吊顶 / 第三级台阶 / 远景展柜 ===== */
  var wallMat = new T.MeshStandardMaterial({ color: 0x1c2632, roughness: 0.82, metalness: 0.15 });
  [-1, 1].forEach(function (sx) {
    var w = new T.Mesh(new T.BoxGeometry(0.4, 9, 18), wallMat);
    w.position.set(sx * 10.4, 4.5, -1.5); scene.add(w);

    for (var ci = 0; ci < 5; ci++) {
      var cz = -7.2 + ci * 3.0;
      var cove = new T.Mesh(new T.BoxGeometry(0.16, 3.2, 0.5), M.dark);
      cove.position.set(sx * 10.16, 5.0, cz); scene.add(cove);
      var cs = new T.Mesh(new T.BoxGeometry(0.05, 2.9, 0.1), LIGHTSTRIP);
      cs.position.set(sx * 10.06, 5.0, cz); scene.add(cs);
      var csg = new T.Sprite(new T.SpriteMaterial({ map: glowTexture(), color: 0xbcd8ff, transparent: true, opacity: 0.13, blending: T.AdditiveBlending, depthWrite: false }));
      csg.scale.set(0.75, 2.9, 1); csg.position.set(sx * 10.0, 5.0, cz); scene.add(csg);
    }
    var wl = new T.PointLight(0x9dc4ee, 0.35, 14, 2);
    wl.position.set(sx * 8.8, 5.0, -2.0); scene.add(wl);
  });

  /* 墙面分缝与踢脚 */
  [-1, 1].forEach(function (sx) {
    for (var si = 0; si < 6; si++) {
      var seam = new T.Mesh(new T.BoxGeometry(0.06, 8.4, 0.05), M.dark);
      seam.position.set(sx * 10.38, 4.5, -8.4 + si * 3.0); scene.add(seam);
    }
    var skirt = new T.Mesh(new T.BoxGeometry(0.1, 0.35, 17.6), M.trim);
    skirt.position.set(sx * 10.34, 0.175, -1.5); scene.add(skirt);
    var rail = new T.Mesh(new T.BoxGeometry(0.08, 0.06, 17.6), M.metal);
    rail.position.set(sx * 10.33, 3.6, -1.5); scene.add(rail);
  });

  /* 井格吊顶 */
  var cofferY = 8.6;
  var caseGrid = new T.Mesh(new T.BoxGeometry(6.3, 0.4, 6.3), M.metal);
  caseGrid.position.set(0, cofferY + 0.2, 0); scene.add(caseGrid);
  for (var gx = 0; gx < 3; gx++) {
    for (var gz = 0; gz < 3; gz++) {
      var cx = (gx - 1) * 2.0, cz2 = (gz - 1) * 2.0;
      var cell = new T.Mesh(new T.BoxGeometry(1.72, 0.3, 1.72), M.dark);
      cell.position.set(cx, cofferY - 0.02, cz2); caseGrid.parent.add(cell);
      var cpanel = new T.Mesh(new T.PlaneGeometry(1.5, 1.5),
        new T.MeshBasicMaterial({ map: panelTex, color: 0xdfeaff, transparent: true, opacity: 0.5, blending: T.AdditiveBlending, depthWrite: false }));
      cpanel.rotation.x = Math.PI / 2; cpanel.position.set(cx, cofferY - 0.16, cz2); scene.add(cpanel);
    }
  }

  /* 第三级台阶 */
  var step0 = new T.Mesh(new T.BoxGeometry(7.2, 0.14, 7.2), M.stone);
  step0.position.y = 0.07; scene.add(step0);
  var step0t = new T.Mesh(new T.BoxGeometry(7.28, 0.03, 7.28), M.trim);
  step0t.position.y = 0.145; scene.add(step0t);

  /* 远景展柜（暗） */
  var farBase = new T.Mesh(new T.BoxGeometry(3.0, 1.0, 3.0), M.metal);
  farBase.position.set(8.6, 0.5, -8.4); scene.add(farBase);
  var farGlass = new T.Mesh(new T.BoxGeometry(2.6, 3.0, 2.6),
    new T.MeshBasicMaterial({ color: 0x8fb4dd, transparent: true, opacity: 0.03, depthWrite: false, side: T.DoubleSide }));
  farGlass.position.set(8.6, 2.5, -8.4); scene.add(farGlass);
  var farEdge = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(2.6, 3.0, 2.6)),
    new T.LineBasicMaterial({ color: 0x6f9ccc, transparent: true, opacity: 0.3 }));
  farEdge.position.copy(farGlass.position); scene.add(farEdge);
  var farGlow = new T.Sprite(new T.SpriteMaterial({ map: glowTexture(), color: 0x9fc4ee, transparent: true, opacity: 0.3, blending: T.AdditiveBlending, depthWrite: false }));
  farGlow.scale.set(2.0, 2.0, 1); farGlow.position.set(8.6, 2.4, -8.4); scene.add(farGlow);

  /* 构图：更低的机位、稍微侧一点 */
  camera.position.set(2.6, 2.75, 16.2);
  camera.lookAt(0.05, 3.25, -0.4);

  go(cur);
  boot.style.display = 'none';

  var t0 = performance.now();
  function frame() {
    requestAnimationFrame(frame);
    var t = (performance.now() - t0) / 1000;

    for (var i = 0; i < N * 3; i++) pos[i] += (target[i] - pos[i]) * 0.075;
    for (var j = 0; j < N; j++) {
      var s = seeds[j * 4 + 3];
      pos[j * 3] += Math.sin(t * 0.5 + s * 11) * 0.002;
      pos[j * 3 + 1] += Math.cos(t * 0.46 + s * 8) * 0.002;
      pos[j * 3 + 2] += Math.sin(t * 0.4 + s * 14) * 0.002;
    }
    pGeo.attributes.position.needsUpdate = true;

    for (var q = 0; q < TRAIL_N; q++) {
      var pi = trailIdx[q] * 3;
      var px = pos[pi], py = pos[pi + 1], pz = pos[pi + 2];
      var rl = Math.hypot(px, pz) || 1;
      var tl = (rl < 0.45) ? 0 : (0.04 + 0.09 * Math.abs(Math.sin(t * 2.2 + seeds[trailIdx[q] * 4] * 31.0))) * Math.min(1, rl / 0.9);
      var dx = (pz / rl) * tl, dz = (-px / rl) * tl;
      var o6 = q * 6;
      trPos[o6] = px; trPos[o6 + 1] = py; trPos[o6 + 2] = pz;
      trPos[o6 + 3] = px + dx; trPos[o6 + 4] = py; trPos[o6 + 5] = pz + dz;
      var warm = Math.pow((seeds[trailIdx[q] * 4 + 2] || 0), 6) > 0.72;
      var cr = col[pi] || 0.6, cg = col[pi+1] || 0.8, cb = col[pi+2] || 1.0;
      var r = warm ? (cr*0.5+0.55) : cr, g = warm ? (cg*0.5+0.42) : cg, b = warm ? (cb*0.5+0.18) : cb;
      var k1 = 0.85, k2 = 0.15;
      trCol[o6] = r * k1; trCol[o6 + 1] = g * k1; trCol[o6 + 2] = b * k1;
      trCol[o6 + 3] = r * k2; trCol[o6 + 4] = g * k2; trCol[o6 + 5] = b * k2;
    }
    trGeo.attributes.position.needsUpdate = true;
    trGeo.attributes.color.needsUpdate = true;

    VOL.material.uniforms.uTime.value = t;
    pMat.uniforms.uTime.value = t; hazeMat.uniforms.uTime.value = t; reflMat.uniforms.uTime.value = t;
    VOL.material.uniforms.uCamPos.value.copy(camera.position);

    rotV *= 0.94; rot += rotV + 0.0016;
    points.rotation.y = rot; haze.rotation.y = rot; reflP.rotation.y = rot;
    trail.rotation.y = rot;
    var br = 1 + Math.sin(t * 1.15) * 0.035;
    points.scale.setScalar(br); haze.scale.setScalar(br);
    pMat.uniforms.uOpacity.value = 0.42 * (0.84 + 0.30 * Math.sin(t * 1.15));
    edges.rotation.y = 0;

    for (var k = 0; k < DUST; k++) {
      dPos[k * 3 + 1] += 0.0042;
      if (dPos[k * 3 + 1] > 8.2) dPos[k * 3 + 1] = 1.2;
    }
    dGeo.attributes.position.needsUpdate = true;

    camera.position.x = 2.6 + Math.sin(t * 0.1) * 0.22;
    camera.lookAt(0, 2.95, 0);

    floor.visible = false; reflP.visible = false;
    mirrorCam.copy(camera);
    mirrorCam.aspect = camera.aspect; mirrorCam.updateProjectionMatrix();
    mirrorCam.position.set(camera.position.x, -camera.position.y, camera.position.z);
    mirrorCam.up.set(0, -1, 0);
    mirrorCam.lookAt(0.0, 3.2, 0.0);
    mirrorCam.updateMatrixWorld();
    renderer.setRenderTarget(rtMirror);
    renderer.clear();
    renderer.render(scene, mirrorCam);
    floor.visible = true; reflP.visible = true;

    renderer.setRenderTarget(rtScene);
    renderer.clear();
    renderer.render(scene, camera);

    brightMat.uniforms.tDiffuse.value = rtScene.texture; pass(brightMat, rtBright);
    blurMat.uniforms.tDiffuse.value = rtBright.texture; blurMat.uniforms.uDir.value.set(1, 0); pass(blurMat, rtBlur1);
    blurMat.uniforms.tDiffuse.value = rtBlur1.texture; blurMat.uniforms.uDir.value.set(0, 1); pass(blurMat, rtBlur2);

    raysMat.uniforms.tDiffuse.value = rtBlur2.texture; pass(raysMat, rtRays);

    compMat.uniforms.tBase.value = rtScene.texture;
    compMat.uniforms.tBloom.value = rtBlur2.texture;
    compMat.uniforms.tVol.value = rtVol.texture;
    compMat.uniforms.tRays.value = rtRays.texture;
    compMat.uniforms.uTime.value = t;
    pass(compMat, null);
  }
  frame();

  addEventListener('resize', function () {
    W = innerWidth; H = innerHeight;
    camera.aspect = W / H; camera.updateProjectionMatrix();
    renderer.setSize(W, H);
    rtScene.setSize(W, H); rtMirror.setSize(W, H);
    BW = Math.max(1, W >> 2); BH = Math.max(1, H >> 2);
    rtBright.setSize(BW, BH); rtBlur1.setSize(BW, BH); rtBlur2.setSize(BW, BH);
    VW = Math.max(1, Math.floor(W/2)); VH = Math.max(1, Math.floor(H/2)); rtVol.setSize(VW, VH); rtRays.setSize(BW, BH);
    blurMat.uniforms.uRes.value.set(BW, BH);
    floorMat.uniforms.uRes.value.set(W, H);
  });
})();
