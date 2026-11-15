/* 序章 · 窗
   流程：黑场 → 字幕 → 窗户从黑里浮出 → 点击/拖动窗扇推开 → 雷光与风进来
        → 镜头移到桌上 → 蛋糕与三支蜡烛 → 点蜡烛点亮 → 进入游戏。

   模型来源优先级：资产库（工作台保存的）→ scene.js（导出的清单）→ 内置示例。
   因此，即使没有收到你的 FBX，这一页也能完整跑通。 */
(function () {
  /* ============================================================ 启动自检
     这一页有 8 个脚本顺序加载，任何一个没到位（file:// 权限、缓存半截、扩展拦截），
     后面每一行都会连锁报错，用户看到的只是「一张黑屏，点了没反应」。
     所以第一件事：把失败翻译成人话，给一条能走的路。 */
  const ERRS = (window.__prologueErrors = window.__prologueErrors || []);
  const ENTER_FALLBACK = '../ship-ball-lightning/website/index.html#1';

  function showBootError(msg, detail) {
    try {
      let el = document.getElementById('booterr');
      if (!el) {
        el = document.createElement('div');
        el.id = 'booterr';
        el.className = 'on';
        document.body.appendChild(el);
      }
      el.innerHTML =
        '<div class="be-inner">' +
        '<b class="be-title">序章没能启动</b>' +
        '<p class="be-msg">' + String(msg).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c])) + '</p>' +
        (detail ? '<pre class="be-detail">' + String(detail).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c])).slice(0, 700) + '</pre>' : '') +
        '<p class="be-hint">按 F12 打开开发者工具可看到完整报错；也可以先直接进入故事。</p>' +
        '<div class="be-acts">' +
        '<a class="be-btn primary" href="' + ENTER_FALLBACK + '">进入游戏 →</a>' +
        '<button class="be-btn" id="beRetry" type="button">重新加载</button>' +
        '</div></div>';
      const retry = document.getElementById('beRetry');
      if (retry) retry.addEventListener('click', () => location.reload());
      el.classList.add('on');
    } catch (e) { /* 连报错提示都画不出来时，只剩控制台 */ }
  }

  function failWith(where, err) {
    const m = where + '：' + (err && err.message ? err.message : String(err));
    ERRS.push(m + (err && err.stack ? '\n' + err.stack : ''));
    showBootError(m, err && err.stack);
    if (window.console) console.error('[prologue]', where, err);
  }
  /* file:// 下浏览器把每个脚本都当成跨源，真实报错会被抹成只有一句 "Script error."，
     e.error、行号、文件名全是空的。此时面板里那行 "at prologue.js:49:33" 是本行 new Error 的位置，
     不是出错位置 —— 直接照着第 49 行去查只会白花时间。所以这里把「被遮罩」本身说清楚，
     并顺手报一下 WebGL 状态（显卡这头没有 WebGL 时，three 的报错也就被遮成这一句）。 */
  function webglState() {
    try {
      const c = document.createElement('canvas');
      if (c.getContext('webgl2')) return 'WebGL2 可用';
      if (c.getContext('webgl') || c.getContext('experimental-webgl')) return 'WebGL1 可用';
      return '没有 WebGL（多半是硬件加速被关掉，或远程桌面/虚拟机没 GPU）';
    } catch (err) { return 'WebGL 检测失败'; }
  }
  window.addEventListener('error', e => {
    if (!e) return;
    if (!e.error && /^script error\.?$/i.test(String(e.message || '').trim())) {
      failWith('脚本错误（细节被浏览器遮罩）', new Error(
        '浏览器没给出真实报错，只给了 "Script error."。按 F12 打开 Console 看第一条红字；' +
        '或在 scene-lab 目录跑 python -m http.server，用 http://127.0.0.1:8000/prologue.html 打开，报错就完整了。' +
        '当前显卡状态：' + webglState() + '。'));
      return;
    }
    const at = (e.filename || '') + ':' + (e.lineno || 0);
    failWith('脚本错误', e.error || new Error((e.message || 'unknown') + ' @' + at));
  });
  window.addEventListener('unhandledrejection', e => {
    failWith('未处理的异步错误', (e && e.reason) || 'unknown');
  });

  // 依赖脚本自检：先看拿到没有，再决定要不要往下跑
  const missing = [];
  if (!window.THREE) missing.push('assets/three.bundle.js');
  if (!window.SceneCore) missing.push('src/scene-core.js');
  if (missing.length) {
    failWith('依赖脚本未加载', new Error(missing.join('、') + ' 没有加载成功（file:// 下被安全策略拦、或文件缺失）'));
    return;
  }

  const T = window.THREE;
  const Core = window.SceneCore;
  const $ = s => document.querySelector(s);
  const D2R = Math.PI / 180;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const params = new URLSearchParams(location.search);
  /* 「进入游戏」去哪：新版站点（ship-ball-lightning 是带源码+构建+验收的完整工程，
   七阶段/人物都是重做过的版本）。#1 = 直接落到「七阶段」那一屏 ——
   站点源码里 go(i) 对 i!==0 会自动跳过它自带的 2D「序曲」，所以不会重播开场。
   旧的 ball-lightning/package/website（10-22 的 168 KB 版）已过时，只保留作对照。 */
const ENTER_URL = params.get('enter') || '../ship-ball-lightning/website/index.html#1';
  // 默认房间 = 异象一那间老宅里裁出来的「窗户 + 客厅」那一块（sample-room-su-core，13.3 MB / 26.8 万面）。
  // 想看完整的老宅用 ?room=sample-room-su（会和异象一共用 assets/room-su.js，60 MB）；
  // 想回「餐厅·原场景」用 ?room=sample-room-max；内置程序化餐厅用 ?room=sample-restaurant。
  // 老宅不是照序章坐标裁的，适配层见 SU_HOUSE / applySuAnchors()。
  const ROOM_PREF = params.get('room') || 'sample-room-su-core';
  // 蛋糕来源：默认用用户 2026-10-25 发的 Blender 蛋糕（blender格式(30).blend → glb 内嵌）；
  // ?cake=hero → Codex 的程序化蛋糕；?cake=user → 原来那套粉色蛋糕资产。
  const CAKE_KEY = params.get('cake') || '';
  // 旧的 prop-cake（Tripo 粉色蛋糕）已归档；蛋糕只有一份：Blender 版
  const CAKE_PREF = 'cake-blend30';

  /* 每个角色在场景里的锚点（米）。数值按内置示例的尺寸定，用户模型会按比例自动适配。
     room 额外给一个「合理米制区间」：房间本来就有 4 m 的小屋和 8 m 的餐厅两种，
     只要最长边落在 2.5–12 m 就认为是按米做的，保持原尺寸，不做归一缩放。 */
  /* 默认锚点 = 内置程序化餐厅/小屋的坐标契约（后墙 z=-2.0、窗洞中心 y=1.55、桌心 0.85/-1.05）。
     房间资产可以在根节点 extras.prologue 里自带锚点并声明 aligned —— 见 applyRoomAnchors()。 */
  const ANCHOR = {
    room: { max: 4.0, cx: 0, cz: 0, minY: 0, meters: [2.5, 12] },
    window: { max: 1.645, cx: 0, centerY: 1.55, cz: -1.95 },
    cake: { max: 0.34, cx: 0.85, cz: -1.05, minY: 0.745 },
    candle: { max: 0.18 }
  };

  const S = {
    renderer: null, scene: null, camera: null, controls: null, clock: null,
    raycaster: new T.Raycaster(), pointer: new T.Vector2(),
    roles: {},                 // role -> { obj, rec, source }
    room: null, windowGroup: null, cake: null, candles: [],
    sash: null, sashAxis: 'y', sashFrom: 0, sashTo: -105 * D2R,
    outsideLight: null, outdoorMat: null, dust: null,
    camBase: { pos: new T.Vector3(0.3, 1.62, 1.28), target: new T.Vector3(0, 1.52, -1.95) },
    parallax: new T.Vector3(), parallaxTarget: new T.Vector3(),
    camTweenStop: null, userCamera: false,
    stage: 'boot',
    open: 0, lit: false, soundOn: true, audio: null, music: null,
    wind: 0.12, gust: 0, cloths: null,
    drag: null, hover: null, hoverCheck: 0,
    flash: 0, flashTimer: 0,
    tStart: performance.now()
  };

  const wait = ms => new Promise(r => setTimeout(r, ms));

  /* =============================================================== 初始化 */

  function initRenderer() {
    const canvas = $('#stage');
    // 先问一句再动手：没有 WebGL 时 three 抛的是底层错误，用户看不出来问题在哪
    const gl = webglInfo();
    if (!gl.ok) {
      return showFallback('这台设备的浏览器没有可用的 WebGL（' + gl.api + (gl.name ? ' · ' + gl.name : '') + '）。');
    }
    try {
      /* preserve=1 只给自动化抓图用（正常游玩不加，省一次每帧缓冲拷贝） */
  const __keepBuf = /[?&]preserve=1/.test(location.search);
  S.renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: __keepBuf });
    } catch (err) {
      return showFallback('WebGL 上下文创建失败（' + ((err && err.message) || err) + '）。');
    }
    S.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    S.renderer.outputColorSpace = T.SRGBColorSpace;
    S.renderer.toneMapping = T.ACESFilmicToneMapping;
    S.renderer.toneMappingExposure = 1.08;
    S.renderer.shadowMap.enabled = true;
    S.renderer.shadowMap.type = T.PCFSoftShadowMap;

    S.scene = new T.Scene();
    S.scene.background = new T.Color(0x04050a);
    S.scene.fog = new T.FogExp2(0x04050a, 0.035);
    S.scene.environment = null;
    // 环境贴图是加分项：生成失败也必须有房子，不能连房间一起丢
    try {
      if (Core.makeEnvironment) S.scene.environment = Core.makeEnvironment(S.renderer);
    } catch (err) {
      console.warn('环境贴图生成失败，跳过：', err && err.message);
    }

    if ('environmentIntensity' in S.scene) S.scene.environmentIntensity = 0.16;

    S.camera = new T.PerspectiveCamera(45, 1, 0.02, 120);
    S.camera.position.copy(S.camBase.pos);
    S.camera.lookAt(S.camBase.target);

    // The prologue keeps its authored camera moves, but the viewer can take over
    // at any point by dragging or zooming the canvas.
    if (T.OrbitControls) {
      S.controls = new T.OrbitControls(S.camera, canvas);
      S.controls.enabled = false;
      S.controls.enableDamping = true;
      S.controls.dampingFactor = 0.065;
      S.controls.minDistance = 0.45;
      S.controls.maxDistance = 10.5;
      S.controls.minPolarAngle = 0.28;
      S.controls.maxPolarAngle = Math.PI * 0.49;
      S.controls.screenSpacePanning = true;
      S.controls.target.copy(S.camBase.target);
      S.controls.addEventListener('start', () => {
        if (!S.controls.enabled || S.stage === 'boot' || S.stage === 'enter') return;
        S.userCamera = true;
        cancelCameraReturn();
        if (S.camTweenStop) { S.camTweenStop(); S.camTweenStop = null; }
      });
      // OrbitControls also emits `change` for wheel/touch gestures. Treat any
      // user driven change as an explicit hand-off from the authored camera so
      // the render loop never snaps the view back on the next frame.
      S.controls.addEventListener('change', () => {
        if (!S.controls.enabled || S.stage === 'boot' || S.stage === 'enter') return;
        if (S.camTweenStop) { S.camTweenStop(); S.camTweenStop = null; }
        S.userCamera = true;
      });
      // 松手 6 秒没再动，就轻轻回到这一幕的既定机位 ——
      // 否则用户随手转一下就会被永久困在奇怪的角度（比如停在吊灯上）。
      S.controls.addEventListener('end', () => { scheduleCameraReturn(); });
    }

    Core.watchResize(S.renderer, S.camera);
    return true;
  }

  /* 这台机器为什么起不来：直接问浏览器，别猜。 */
  function webglInfo() {
    const probe = (kind) => {
      const c = document.createElement('canvas');
      return c.getContext(kind) || null;
    };
    try {
      const gl2 = probe('webgl2');
      if (gl2) {
        let name = '';
        try {
          const d = gl2.getExtension('WEBGL_debug_renderer_info');
          name = d ? gl2.getParameter(d.UNMASKED_RENDERER_WEBGL) : gl2.getParameter(gl2.RENDERER);
        } catch (_) { }
        return { ok: true, api: 'WebGL2', name: name || '' };
      }
      const gl = probe('webgl') || probe('experimental-webgl');
      if (gl) return { ok: true, api: 'WebGL1', name: String(gl.getParameter(gl.RENDERER) || '') };
      return { ok: false, api: '无', name: '' };
    } catch (err) {
      return { ok: false, api: '探测失败', name: String((err && err.message) || err) };
    }
  }

  /* 没有 WebGL 不等于看不了故事。
     3D 房间建不起来时，退成「纯文字开场」：字幕照常逐字打出，
     读完再说明原因并给出进入游戏的出口 —— 而不是把人扔在一张黑屏上。 */
  async function runTextOnlyIntro(msg) {
    window.__textOnlyIntro = true;
    const prompt = $('#introPrompt');
    if (prompt) prompt.classList.add('hide');
    try {
      await typeStory();
      await wait(1200);
    } catch (err) {
      console.warn('纯文字开场也没跑完：', err && err.message);
    }
    const intro = $('#intro');
    if (intro) intro.classList.add('gone');
    const g = webglInfo();
    const detail = g.ok
      ? '浏览器报告 WebGL 可用（' + g.api + (g.name ? ' · ' + g.name : '') + '），所以卡住的是场景初始化那一步，不是显卡。'
      : '浏览器报告 WebGL 不可用（' + g.api + (g.name ? ' · ' + g.name : '') + '）。' +
        '序章的 3D 房间必须有它：Edge 里打开「设置 → 系统和性能 → 使用图形加速」并重启浏览器，或换成 http:// 方式打开再看一次。';
    showBootError(msg + ' —— 已切换为纯文字开场，故事照常可以读。', detail);
  }

  function showFallback(msg) {
    if (window.__fallbackShown) return false;
    window.__fallbackShown = true;
    const el = document.createElement('div');
    el.className = 'fallback';
    el.innerHTML = '<h1 style="margin:0;font-weight:400;letter-spacing:.1em">序章</h1>' +
      '<p>' + msg + '<br>你仍然可以直接进入故事。</p>' +
      '<a class="enter" style="display:inline-block;padding:11px 26px;border-radius:999px;background:#7d8cff;color:#0a0b12;font-weight:650;text-decoration:none" href="' + ENTER_URL + '">进入游戏 →</a>';
    document.body.appendChild(el);
    runTextOnlyIntro(msg);
    return false;
  }

  /* =============================================================== 灯光 */

  function addLights() {
    const hemi = new T.HemisphereLight(0x9aafd2, 0x0b0b12, 0.56);
    S.scene.add(hemi);
    S.hemi = hemi;

    const moon = new T.DirectionalLight(0xb9c8ff, 0.48);
    moon.position.set(0.6, 3.4, -3.4);
    moon.target.position.set(0, 1.1, 0);
    moon.castShadow = true;
    moon.shadow.mapSize.set(2048, 2048);
    moon.shadow.camera.near = 0.1;
    moon.shadow.camera.far = 18;
    moon.shadow.camera.left = -6;
    moon.shadow.camera.right = 6;
    moon.shadow.camera.top = 5;
    moon.shadow.camera.bottom = -1;
    moon.shadow.bias = -0.00035;
    S.scene.add(moon);
    S.scene.add(moon.target);
    S.moon = moon;                 // 视觉风格切换要单独调它（冷侧轮廓光）

    const roomFill = new T.PointLight(0xffc48a, 0.56, 7.5, 2);
    roomFill.position.set(1.35, 1.75, 1.15);
    S.scene.add(roomFill);
    S.roomFill = roomFill;

    // 桌子上方一点暖光，蜡烛还没点时也不至于全是冷色
    const cakeFill = new T.PointLight(0xffc48a, 0.52, 3.2, 2);
    cakeFill.position.set(0.14, 1.28, 0.55);
    S.scene.add(cakeFill);
    S.cakeFill = cakeFill;

    // 窗洞射进来的一束冷光，窗一开就亮起来，把桌子与蛋糕勾出轮廓
    const shaft = new T.SpotLight(0x9db4ff, 0, 8.5, 0.52, 0.92, 1.25);
    shaft.position.set(0.05, 2.15, -1.86);
    shaft.target.position.set(0.14, 0.8, 0.28);
    shaft.castShadow = true;
    shaft.shadow.mapSize.set(1024, 1024);
    shaft.shadow.bias = -0.0002;
    S.scene.add(shaft);
    S.scene.add(shaft.target);
    S.windowShaft = shaft;

    S.outsideLight = new T.PointLight(0x8fb0ff, 0, 9, 2);
    S.outsideLight.position.set(0, 1.7, -2.9);
    S.outsideLight.castShadow = true;
    S.outsideLight.shadow.mapSize.set(1024, 1024);
    S.outsideLight.shadow.bias = -0.00025;
    S.scene.add(S.outsideLight);
  }

  /* ============================================================= 室外夜景 */

  function addOutdoor() {
    /* 故事是雷雨夜（「窗外的雷声还没停」），原来的天空只有星点和闪电，一滴雨都没有。
       ?rain=0 关雨，?stars=0..1 调星点残留（阴雨天默认压到 0.22）。 */
    const rainAmt = params.get('rain') === '0' ? 0 : 1;
    const starAmt = params.has('stars')
      ? Math.max(0, Math.min(1, parseFloat(params.get('stars')) || 0))
      : 0.22;
    const mat = new T.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uFlash: { value: 0 },
        uRain: { value: rainAmt },
        uStar: { value: starAmt },
        /* 亮度乘子：老宅窗洞后头的小后景幕单独调高（见 addWindowBackdrop），
           远处那块 22×13 的大幕保持 1.0。 */
        uGain: { value: 1 },
        /* 雨/星点的图案密度：后景幕取的是很窄一条 uv，放大到窗洞里雨丝会粗成白杠 */
        uRainDetail: { value: 1 }
      },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform float uFlash;
        uniform float uRain;
        uniform float uStar;
        uniform float uGain;
        uniform float uRainDetail;

        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
        float noise(vec2 p){
          vec2 i = floor(p), f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
                     mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
        }
        float fbm(vec2 p){
          float v = 0.0, a = 0.5;
          for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.03; a *= 0.5; }
          return v;
        }

        /* 一层雨：把 uv 切成斜向的格子，每格一根被拉长的细线。
           近处粗而疏、远处细而密，三层叠起来才有纵深。
           纵向轮廓两头都要收到 0 —— 只在底部收会变成"亮点带一条尾巴"的逗号。 */
        float rainLayer(vec2 uv, float cols, float rows, float speed, float density, float thick, float slant, float seed){
          vec2 p = vec2(uv.x * cols + uv.y * slant * cols, uv.y * rows + uTime * speed);
          /* 每行整体错开几个格子：否则斜线会在屏幕上排成规则的菱形网格 */
          p.x += hash(vec2(floor(p.y), seed)) * 3.0;
          vec2 cell = floor(p);
          vec2 f = fract(p);
          float rnd = hash(cell + seed);
          float on = step(1.0 - density, rnd);
          float len = 0.16 + 0.20 * hash(cell + seed + 7.3);
          float prof = smoothstep(0.0, 0.14, f.y) * (1.0 - smoothstep(len * 0.55, len, f.y));
          float body = 1.0 - smoothstep(0.0, thick, abs(f.x - 0.5) * 2.0);
          /* 每根雨丝亮度不同：同一片雨里总有几根被光擦亮 */
          float gain = 0.45 + 0.55 * hash(cell + seed + 3.3);
          return on * prof * body * gain;
        }

        void main(){
          float h = vUv.y;
          /* 阴天：上暗下稍亮，云层两层 fbm 叠出层次与速度差 */
          vec3 lowSky  = vec3(0.030, 0.043, 0.074);
          vec3 highSky = vec3(0.016, 0.024, 0.050);
          vec3 col = mix(lowSky, highSky, smoothstep(0.04, 0.96, h));

          float c1 = fbm(vUv * vec2(2.4, 1.9) + vec2(uTime * 0.013, uTime * 0.002));
          float c2 = fbm(vUv * vec2(6.2, 4.4) - vec2(uTime * 0.021, uTime * 0.004));
          float cover = smoothstep(0.30, 0.86, c1 * 0.62 + c2 * 0.38);
          col += (cover - 0.35) * vec3(0.058, 0.072, 0.104);
          col += c2 * 0.014 * smoothstep(0.18, 0.92, h);

          /* 星点：只从云缝里漏几颗出来 */
          vec2 grid = vUv * uRainDetail * vec2(520.0, 300.0);
          vec2 cell = floor(grid);
          vec2 f = fract(grid);
          float rnd = hash(cell);
          float star = step(0.982, rnd) * smoothstep(0.42, 0.02, length(f - 0.5));
          float tw = 0.4 + 0.6 * abs(sin(uTime * 1.3 + rnd * 60.0));
          col += star * tw * uStar * (1.0 - cover * 0.92) * smoothstep(0.2, 0.6, h) * vec3(0.78, 0.84, 1.0);

          /* 月亮被云挡掉大半，只剩散射的光晕 */
          vec2 mp = (vUv - vec2(0.515, 0.365)) * vec2(1.69, 1.0);
          float md = length(mp);
          float moonMask = 1.0 - cover * 0.55;
          col += vec3(0.42, 0.50, 0.72) * smoothstep(0.020, 0.006, md) * 0.16 * moonMask;
          col += vec3(0.10, 0.14, 0.24) * smoothstep(0.12, 0.0, md) * 0.22 * moonMask;

          /* 雨：远（细密淡）→ 近（粗疏亮）。speed 是"每秒走几个格子"，
             格子高矮不同，所以换算成真实速度后三层大致一致（约 5~6 m/s）。
             uRainDetail 把"远处的整片天"和"贴在窗后的那一小块"区分开：
             同一套图案直接放大到 1.5 m 的窗洞里，雨丝会粗成一指宽的白杠。 */
          vec2 ruv = vUv * uRainDetail;
          float rFar  = rainLayer(ruv, 110.0, 30.0, 12.0, 0.50, 0.070, 0.018, 1.0);
          float rMid  = rainLayer(ruv,  70.0, 18.0,  8.0, 0.44, 0.050, 0.035, 3.0);
          float rNear = rainLayer(ruv,  34.0, 10.0,  5.0, 0.34, 0.038, 0.055, 5.0);
          float rain = rFar * 0.24 + rMid * 0.36 + rNear * 0.48;
          float lit = 0.55 + 0.45 * smoothstep(0.55, 0.0, md);
          /* 闪电会把雨丝整片点亮，这是"雷雨"最关键的一口气 */
          col += vec3(0.60, 0.72, 0.96) * rain * uRain * lit * (0.40 + uFlash * 2.1) * smoothstep(0.02, 0.20, h);

          /* 落雨在地面那层霾 */
          float mist = smoothstep(0.24, 0.0, h) * (0.5 + 0.5 * c1);
          col += vec3(0.055, 0.072, 0.108) * mist * (0.85 + uFlash * 1.3);

          col += uFlash * vec3(0.5, 0.58, 0.82) * (0.3 + 0.7 * h);
          gl_FragColor = vec4(col * uGain, 1.0);
        }`
    });
    const plane = new T.Mesh(new T.PlaneGeometry(22, 13), mat);
    // 窗在南墙的老宅（OUT_Z=+1）里，窗外在 +z，假景要翻到背后并转过来对着房间
    plane.position.set(0, 3.4, OUT_Z * 8.2);
    if (OUT_Z > 0) plane.rotation.y = Math.PI;
    S.scene.add(plane);
    S.outdoorMat = mat;
    S.rainOn = rainAmt > 0;
    S.starAmt = starAmt;

    // 远处一个模糊的球状光点：雨夜里唯一发亮的东西
    const halo = makeHaloTexture();
    const sprite = new T.Sprite(new T.SpriteMaterial({
      map: halo, color: 0x9fc0ff, transparent: true, opacity: 0.0, depthWrite: false, blending: T.AdditiveBlending
    }));
    sprite.scale.set(2.6, 2.6, 1);
    sprite.position.set(OUT_Z > 0 ? -0.55 : 0.55, 2.15, OUT_Z * 6.4);
    S.scene.add(sprite);
    S.ballGlow = sprite;

    if (rainAmt > 0) addRainGlass();
  }

  /* 玻璃上的水珠：窗外有雨、玻璃却是干的，一直是个说不出的不对劲。
     做法是在玻璃网格上挂一层孩子节点，跟着窗扇一起开关（开窗时水珠跟着扇子走）。
     两层大小不同的水珠互相错开，各自很慢地下滑，再拖一条淡尾巴。 */
  function addRainGlass() {
    if (!S.windowGroup) return;
    let glass = null;
    S.windowGroup.traverse(o => {
      if (glass || !o.isMesh || !o.geometry) return;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      const clear = mats.some(m => m && m.transparent && (m.opacity === undefined || m.opacity < 0.95));
      if (clear) glass = o;
    });
    if (!glass) return;
    const geo = glass.geometry;
    if (!geo.boundingBox) geo.computeBoundingBox();
    const bb = geo.boundingBox;
    if (!bb) return;
    const w = bb.max.x - bb.min.x;
    const h = bb.max.y - bb.min.y;
    if (!(w > 0.08 && h > 0.08)) return;

    const mat = new T.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uAspect: { value: w / h } },
      transparent: true,
      depthWrite: false,
      side: T.DoubleSide,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform float uAspect;

        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

        float drops(vec2 uv, float scale, float speed, float seed, float occupancy){
          vec2 p = vec2(uv.x * uAspect, uv.y) * scale;
          vec2 cell = floor(p);
          vec2 f = fract(p);
          float r0 = hash(cell + seed);
          float r1 = hash(cell + seed + 5.1);
          float r2 = hash(cell + seed + 9.7);
          float on = step(1.0 - occupancy, r0);
          float slide = fract(r2 + uTime * speed);
          vec2 c = vec2(0.42 + r1 * 0.36, 0.92 - slide * 0.84);
          /* 纵向拉长一点点：水珠在玻璃上不是正圆 */
          float d = length((f - c) * vec2(1.0, 1.30));
          float rad = 0.070 + 0.090 * r2;
          float bead = smoothstep(rad, rad * 0.22, d);
          float trail = smoothstep(0.032, 0.0, abs(f.x - c.x))
                      * smoothstep(c.y, c.y + 0.55, f.y) * step(c.y, f.y) * 0.30;
          return on * (bead * (0.50 + 0.50 * r1) + trail);
        }

        void main(){
          /* 两档：大一点的跑水珠 + 小一点的细密水汽，叠起来才像玻璃挂着雨 */
          float d = drops(vUv, 34.0, 0.060, 1.0, 0.42) * 0.50
                  + drops(vUv, 14.0, 0.040, 3.7, 0.30) * 0.62;
          float shine = smoothstep(0.30, 0.92, d);
          vec3 col = mix(vec3(0.52, 0.66, 0.92), vec3(0.90, 0.95, 1.0), shine);
          gl_FragColor = vec4(col, clamp(d, 0.0, 1.0) * 0.26);
        }`
    });

    const plane = new T.Mesh(new T.PlaneGeometry(w * 0.99, h * 0.99), mat);
    // 贴在玻璃朝室内那一面（略微偏移，避免 z-fighting）
    plane.position.set((bb.min.x + bb.max.x) / 2, (bb.min.y + bb.max.y) / 2, bb.max.z + 0.0015);
    plane.renderOrder = 3;
    plane.name = 'rain-glass';
    glass.add(plane);
    S.rainGlassMat = mat;
  }

  function makeHaloTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.25, 'rgba(190,210,255,.55)');
    grad.addColorStop(0.6, 'rgba(120,150,255,.12)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    return tex;
  }

  /* =============================================================== 烛火 */
  /* 之前每个火苗是一个 ConeGeometry 圆锥：实心、无渐变、无光晕，所以看着"假"。
     真实的蜡烛火苗是四层结构 —— 根部一小片蓝、中段橙色焰身、中心白热焰芯、
     外围一圈很淡的暖光。这里全部用广告牌 sprite 做，永远正对镜头，
     再叠上逐支不同的抖动，14 支不会像同一个模具印出来的。 */
  let FLAME_TEX = null;
  function flameTextures() {
    if (FLAME_TEX) return FLAME_TEX;
    const make = (draw, w = 128, h = 128) => {
      const c = document.createElement('canvas');
      c.width = w; c.height = h;
      draw(c.getContext('2d'), w, h);
      const t = new T.CanvasTexture(c);
      t.colorSpace = T.SRGBColorSpace;
      return t;
    };
    /* 一根蜡烛的火苗 = 一枚"下圆上尖"的泪滴，纵向从蓝白焰根过渡到橙黄、中心白热。
       整枚画在一张竖长画布上（96×192），不再用四层 sprite 叠加 ——
       叠加会互相烧白，边界也拼不齐；烘焙进同一张图才像一团火。
       外焰先用同一形状模糊一大圈垫底，就是自然的光晕。 */
    const flame = make((g, w, h) => {
      const cx = w * 0.5;
      const drip = () => {
        g.beginPath();
        g.moveTo(cx, h * 0.075);
        g.bezierCurveTo(w * 0.66, h * 0.20, w * 0.79, h * 0.50, w * 0.80, h * 0.72);
        g.bezierCurveTo(w * 0.80, h * 0.91, w * 0.66, h * 0.96, cx, h * 0.96);
        g.bezierCurveTo(w * 0.34, h * 0.96, w * 0.20, h * 0.91, w * 0.20, h * 0.72);
        g.bezierCurveTo(w * 0.21, h * 0.50, w * 0.34, h * 0.20, cx, h * 0.075);
        g.closePath();
      };
      g.save();
      g.filter = 'blur(11px)';
      drip();
      g.fillStyle = 'rgba(255,124,34,.58)';
      g.fill();
      g.restore();
      const grad = g.createLinearGradient(0, h * 0.03, 0, h * 0.97);
      grad.addColorStop(0.00, 'rgba(255,96,20,0)');
      grad.addColorStop(0.16, 'rgba(255,132,38,.46)');
      grad.addColorStop(0.36, 'rgba(255,162,58,.88)');
      grad.addColorStop(0.54, 'rgba(255,196,100,1)');
      grad.addColorStop(0.70, 'rgba(255,226,158,1)');
      grad.addColorStop(0.82, 'rgba(255,242,200,1)');
      grad.addColorStop(0.90, 'rgba(255,188,100,.92)');
      grad.addColorStop(0.95, 'rgba(150,182,255,.66)');
      grad.addColorStop(1.00, 'rgba(96,146,255,0)');
      drip();
      g.fillStyle = grad;
      g.fill();
      /* 白热芯：只在焰身内部加亮，别糊到轮廓外面去。
         收得比焰身窄一半、往下压到焰根 —— 原来的大核让整支火像一根烧着的火柴。 */
      g.save();
      g.globalCompositeOperation = 'lighter';
      drip();
      g.clip();
      const hot = g.createRadialGradient(cx, h * 0.88, 1, cx, h * 0.84, w * 0.24);
      hot.addColorStop(0.00, 'rgba(255,255,246,.62)');
      hot.addColorStop(0.44, 'rgba(255,240,190,.34)');
      hot.addColorStop(1.00, 'rgba(255,206,128,0)');
      g.fillStyle = hot;
      g.fillRect(0, 0, w, h);
      g.restore();
    }, 96, 192);
    // 外围暖光
    const glow = make((g, s) => {
      const grad = g.createRadialGradient(s * 0.5, s * 0.56, 0, s * 0.5, s * 0.56, s * 0.5);
      grad.addColorStop(0.00, 'rgba(255,206,140,.85)');
      grad.addColorStop(0.28, 'rgba(255,170,88,.38)');
      grad.addColorStop(0.62, 'rgba(255,140,60,.10)');
      grad.addColorStop(1.00, 'rgba(255,120,40,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, s, s);
    });
    // 焰根那一小片蓝
    const base = make((g, s) => {
      const grad = g.createRadialGradient(s * 0.5, s * 0.5, 0, s * 0.5, s * 0.5, s * 0.5);
      grad.addColorStop(0.00, 'rgba(190,225,255,.9)');
      grad.addColorStop(0.42, 'rgba(110,170,255,.42)');
      grad.addColorStop(1.00, 'rgba(60,120,255,0)');
      g.fillStyle = grad;
      g.fillRect(0, 0, s, s);
    });
    FLAME_TEX = { flame, glow };
    return FLAME_TEX;
  }

  /* topY = 烛芯顶端的世界高度（相对蜡烛 group） */
  function makeFlameGroup(topY) {
    const tx = flameTextures();
    const g = new T.Group();
    g.name = 'flame';
    const mk = (map, sx, sy, color, opacity, y, order) => {
      const sp = new T.Sprite(new T.SpriteMaterial({
        map, color, transparent: true, opacity,
        depthWrite: false, blending: T.AdditiveBlending, depthTest: true
      }));
      sp.scale.set(sx, sy, 1);
      sp.position.y = y;
      sp.renderOrder = order;
      g.add(sp);
      return sp;
    };
    const glow = mk(tx.glow, 0.132, 0.152, 0xff9a3c, 0.50, 0.026, 6);
    const flame = mk(tx.flame, 0.030, 0.046, 0xffffff, 0.97, 0.020, 8);
    g.position.y = topY;
    // roll 让两层的抖动相位错开，看起来才像一团在动的火
    g.userData.parts = [
      { sp: glow, base: [0.132, 0.152], op: 0.50, roll: 0 },
      { sp: flame, base: [0.030, 0.046], op: 0.97, roll: 1 }
    ];
    g.userData.isFlame = true;
    return g;
  }

  /* 蛋糕周围一圈很淡的暖光。
     蜡烛还没点时，蛋糕只有桌上那盏补光在照 —— 边缘硬、亮得平均，看着像抠图贴上去。
     加一层贴着蛋糕的柔和光晕把它化进暗部，再把补光压低一点，才像"屋里有个蛋糕"，
     而不是"屏幕上贴了张蛋糕的图"。 */
  function addCakeAura(cb) {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(128, 132, 6, 128, 132, 128);
    grd.addColorStop(0.00, 'rgba(255,206,150,.58)');
    grd.addColorStop(0.32, 'rgba(255,178,114,.26)');
    grd.addColorStop(0.66, 'rgba(255,152,88,.085)');
    grd.addColorStop(1.00, 'rgba(255,140,70,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    const sp = new T.Sprite(new T.SpriteMaterial({
      map: tex, color: 0xffd2a4, transparent: true, opacity: 0,
      // 光不是实体：不参与深度测试，否则被蛋糕本体挡住，只剩一圈天边似的淡边
      depthWrite: false, depthTest: false, blending: T.AdditiveBlending
    }));
    const w = Math.max(0.78, cb.size.x * 1.95);
    sp.scale.set(w, w * 0.80, 1);
    sp.position.set(cb.center.x, cb.box.min.y + cb.size.y * 0.40, cb.center.z);
    sp.renderOrder = 2;
    sp.name = 'cake-aura';
    S.scene.add(sp);
    S.cakeAura = sp;

    // 桌上那层"暖光"以前是一块加法混合的圆面，边缘发灰、叠在木纹上像贴纸，
    // 蜡烛一多就变成一坨亮斑 —— 现在改成"只负责接地"的柔和接触阴影，
    // 暖色留给 14 盏烛光自己去照，反射感靠明暗过渡而不是靠一块贴片。
    const sc = document.createElement('canvas');
    sc.width = sc.height = 256;
    const sg = sc.getContext('2d');
    const srad = sg.createRadialGradient(128, 128, 4, 128, 128, 126);
    srad.addColorStop(0.00, 'rgba(0,0,0,.34)');
    srad.addColorStop(0.55, 'rgba(0,0,0,.30)');
    srad.addColorStop(0.82, 'rgba(0,0,0,.14)');
    srad.addColorStop(1.00, 'rgba(0,0,0,0)');
    sg.fillStyle = srad;
    sg.fillRect(0, 0, 256, 256);
    const stex = new T.CanvasTexture(sc);
    stex.colorSpace = T.SRGBColorSpace;
    const pool = new T.Mesh(
      new T.PlaneGeometry(w * 1.45, w * 1.45),
      new T.MeshBasicMaterial({ map: stex, transparent: true, opacity: 0, depthWrite: false })
    );
    pool.rotation.x = -Math.PI / 2;
    pool.position.set(cb.center.x, cb.box.min.y + 0.006, cb.center.z);
    pool.name = 'cake-pool';
    pool.renderOrder = 1;
    S.scene.add(pool);
    S.cakePool = pool;
  }

  function addDust() {
    const n = 220;
    const pos = new Float32Array(n * 3);
    const seed = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 3.4;
      pos[i * 3 + 1] = Math.random() * 2.3 + 0.15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3.2 - 0.4;
      seed[i] = Math.random() * 6.28;
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.BufferAttribute(pos, 3));
    const mat = new T.PointsMaterial({
      map: makeDotTexture(), color: 0xc7d3ff, size: 0.022, transparent: true, opacity: 0.0,
      depthWrite: false, blending: T.AdditiveBlending, sizeAttenuation: true
    });
    S.dust = new T.Points(geo, mat);
    S.dust.frustumCulled = false;
    S.dust.userData.seed = seed;
    S.scene.add(S.dust);
  }

  let dotTex = null;
  function makeDotTexture() {
    if (dotTex) return dotTex;
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(205,220,255,.45)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    dotTex = new T.CanvasTexture(c);
    dotTex.colorSpace = T.SRGBColorSpace;
    return dotTex;
  }

  /* ============================================================= 载入资产 */

  async function assetBuffer(entry) {
    if (entry.source === 'idb') return await Core.Storage.blob(entry.rec.id);
    /* 只带 file 的样例（assets/room-su-core.js）走 HTTP 直取二进制：
       省掉把 45 MB GLB 转成 60 MB base64 再塞进 JS 的解析开销。file:// 下会在 fetch 处失败，
       那时回退到 base64 —— 所以带 base64 的老样例（room-su.js）照旧能用。 */
    if (entry.rec && entry.rec.file && !entry.rec.base64) {
      const res = await fetch(entry.rec.file, { cache: 'force-cache' });
      if (!res.ok) throw new Error('样例读取失败 ' + entry.rec.file + ' (' + res.status + ')');
      return await res.arrayBuffer();
    }
    if (entry.source === 'bundle') return Core.b64ToBuf(entry.rec.base64);
    if (entry.source === 'sample') return Core.b64ToBuf(entry.rec.base64);
    return null;
  }

  async function loadAssets() {
    let idb = [];
    try {
      await Core.Storage.init();
      idb = await Core.Storage.all();
    } catch (err) { /* file:// 存储不可用也没关系，还有 scene.js 与内置示例 */ }

    const bundle = window.SCENE_BUNDLE || null;
    const sources = [];

    for (const role of ['room', 'window', 'cake', 'candle']) {
      const list = [];
      for (const r of idb) {
        if (r.role === role && r.source === 'user') list.push({ rec: r, source: 'idb' });
      }
      list.sort((a, b) => (b.rec.updatedAt || 0) - (a.rec.updatedAt || 0));

      const samples = (window.SCENE_SAMPLES || []).filter(s => s.role === role);
      const preferred = role === 'room' ? ROOM_PREF : (role === 'cake' ? CAKE_PREF : null);
      const sample = (preferred && samples.find(s => s.id === preferred)) || samples[0];
      // 显式用 URL 参数点名（?cake=blend30 / ?room=xxx）时，必须压过工作台里存的用户资产，
      // 否则「我刚给你换了蛋糕」永远看不到 —— idb 里的旧记录会一直赢。
      // cake 永远按名字点名（默认就是 cake-blend30），所以始终排在最前
      const explicit = role === 'room' ? !!params.get('room') : (role === 'cake' ? true : false);
      if (sample) {
        const rec = { rec: Object.assign({ role, label: sample.label, kind: 'glb', id: sample.id }, sample), source: 'sample' };
        if (explicit) list.unshift(rec); else list.push(rec);
      }
      // Keep the explicit default room ahead of a stale exported scene bundle.
      // User-saved IndexedDB assets still win, but a bundled room must never
      // silently replace sample-room-max.
      if (bundle && bundle.assets && bundle.assets[role]) {
        list.push({ rec: Object.assign({ role, label: role }, bundle.assets[role]), source: 'bundle' });
      }

      for (const entry of list) {
        try {
          const ab = await assetBuffer(entry);
          if (!ab) continue;
          const obj = await Core.parseModel(ab, (entry.rec.fileName || entry.rec.label || role) + '.' + (entry.rec.kind || 'glb'));
          sources.push({ role, obj, entry });
          break;
        } catch (err) {
          console.warn('[序章] ' + role + ' 载入失败，试下一个来源', err && err.message);
        }
      }
    }

    for (const s of sources) {
      S.roles[s.role] = s;
    }
    window.__prologueSources = sources.map(s => ({ role: s.role, source: s.entry.source, label: s.entry.rec.label }));
  }

  /* ============================================================= 摆放 */

  /* 起始机位：按窗口大小与屏幕宽高比算距离，竖屏也不会把窗裁掉 */
  function homeView() {
    S.homePos = new T.Vector3(0.12, 1.6, 1.1);
    S.homeTarget = new T.Vector3(0, 1.62, -1.95);
    const ref = S.windowGroup || S.room;
    if (!ref) {
      S.camBase.pos.copy(S.homePos);
      S.camBase.target.copy(S.homeTarget);
      return;
    }
    const b = Core.boxOf(ref);
    const halfW = b.size.x / 2 * 1.18 + 0.12;
    const halfH = b.size.y / 2 * 1.12 + 0.12;
    const aspect = Math.max(0.35, innerWidth / innerHeight);
    const MAX_D = 3.9;                 // 竖屏要退更远才装得下 1.95 m 宽的窗；候选里还有 rb.box.max.z - 0.4 兜底
    const fovFor = dist => {
      const vNeed = 2 * Math.atan(halfH / dist);
      const hNeed = 2 * Math.atan(halfW / dist);
      const vFromH = 2 * Math.atan(Math.tan(hNeed / 2) / aspect);
      return Core.clamp(Math.max(vNeed, vFromH) / D2R, 45, 62);   // 上限 62°：再大就是广角，边缘变形
    };
    let vfov = 45, d = MAX_D;
    for (let i = 0; i < 12; i++) {
      const hfov = 2 * Math.atan(Math.tan(vfov * D2R / 2) * aspect);
      d = Math.max(halfW / Math.tan(hfov / 2), halfH / Math.tan(vfov * D2R / 2));
      if (d <= MAX_D || vfov >= 78) break;
      vfov = Math.min(78, vfov + 4);
    }
    d = Math.min(d, MAX_D);
    // 镜头对准窗口中心。原来给内置餐厅乘 0.6 是把窗往房间中线拉一点，
    // 但老宅的窗偏在南墙左边（x≈-2.64），乘 0.6 会把窗推出画面右缘。
    const target = new T.Vector3(b.center.x, b.center.y - 0.02, b.center.z);

    /* 两种开场机位（可用 ?cam= 切换）：
         close —— 默认。近景，窗几乎贴满画面（相机 2.9 m，窗占 82%），相机偏右 0.72 m
                  刚好把吊灯挤出画面。用户偏好的那种「怼着窗」。
         wide  —— ?cam=wide。退到 4.4 m，窗占 59%，能看见吊灯顶、餐边柜、窗帘。
       载入时（只做一次）算好并存进 S.homeFit，窗口缩放时直接复用。 */
    const camMode = params.get('cam') === 'wide' ? 'wide' : 'close';
    if (!S.homeFit && S.room) {
      if (camMode === 'close') {
        // 近景：站到**吊灯前面**（吊灯 z 到 0.53，相机 z=-0.2），灯就在身后 → 进不了画面。
        // 距离 2.0 m 时 fovFor 会把 fov 自动放到 62°，正好装下整扇窗（约占画面 89%）。
        S.homeFit = { dx: 0, dy: -0.34, s: 2.0 / d, mode: 'close' };
      } else {
      const front = OUT_Z < 0 ? b.box.max.z : b.box.min.z;
      const iw = b.size.x / 2 * 0.55, ih = b.size.y / 2 * 0.55;
      const targets = [
        new T.Vector3(target.x, target.y, front),
        new T.Vector3(target.x - iw, target.y - ih, front), new T.Vector3(target.x + iw, target.y - ih, front),
        new T.Vector3(target.x - iw, target.y + ih, front), new T.Vector3(target.x + iw, target.y + ih, front),
        // 再加四个靠边的点，防止吊灯/高摆件从五个中心采样的缝隙里挡住窗。
        // 取点要往里收：贴到窗框最外缘（离窗帘只有 12 cm）会让远处机位的射线全被窗帘挡掉，
        // 逼得镜头只能往前挤、fov 撑到 70° 变广角。
        new T.Vector3(b.box.min.x + 0.28, b.box.min.y + 0.34, front),
        new T.Vector3(b.box.max.x - 0.28, b.box.min.y + 0.34, front),
        new T.Vector3(b.box.min.x + 0.28, b.box.max.y - 0.34, front),
        new T.Vector3(b.box.max.x - 0.28, b.box.max.y - 0.34, front)
      ];
      const rb = S.roomBox || (S.roomBox = Core.boxOf(S.room));
      const cands = [];
      // 房间可以用 extras.prologue.avoid 声明「相机禁入区」（例如吊灯）：
      // 站在它 1.85 m 以内、且视高落在它的高度范围内，就会被灯罩糊满画面。
      const avoid = (S.roomDecl && S.roomDecl.avoid) || [];
      const inAvoid = (p) => avoid.some(a => {
        const y0 = (a.y0 != null ? a.y0 : -1e9) - 0.45;
        const y1 = (a.y1 != null ? a.y1 : 1e9) + 0.45;
        return p.y > y0 && p.y < y1 && Math.hypot(p.x - a.x, p.z - a.z) < (a.r || 1.6);
      });
      // s 加到 1.55：被禁入区挡住时要能一直往后退（房间进深够，z 有 rb.box.max.z - 0.4 兜底）
      for (const dy of [0.045, -0.12, -0.24, -0.36, -0.48, 0.16]) {
        for (const s of [1, 1.12, 0.9, 0.8, 1.25, 1.4, 1.55, 0.7, 0.6]) {
          for (const dx of [0.12, -0.72, 0.62, 0.38, -0.16, 1.05, -1.12, -0.42]) {
            const pos = new T.Vector3(target.x + dx, target.y + dy, target.z - OUT_Z * d * s);
            // 相机得站在房间里：离它背后那面墙留 0.4 m
            const wallBehind = OUT_Z < 0 ? rb.box.max.z - 0.4 : rb.box.min.z + 0.4;
            if (pos.y < 1.2 || (OUT_Z < 0 ? pos.z > wallBehind : pos.z < wallBehind)) continue;
            if (inAvoid(pos)) continue;                    // 不站在吊灯底下拍
            cands.push({ dx, dy, s, pos, cost: Math.abs(dy - 0.045) * 1.0 + Math.abs(s - 1) * 3.2 + Math.abs(dx - 0.12) * 0.9 });
          }
        }
      }
      cands.sort((p, q) => p.cost - q.cost);
      const hit = pickView(cands, targets, { margin: 0.12, clearance: 0.24 });
      S.homeFit = hit ? { dx: hit.dx, dy: hit.dy, s: hit.s, mode: 'wide' } : { dx: 0.12, dy: 0.045, s: 1, blocked: true };
      }
    }
    const fit = S.homeFit || { dx: 0.12, dy: 0.045, s: 1 };
    const dist = d * fit.s;
    S.homeDist = d;                       // walkIn 要用：走近那一幕从更远处起步
    S.camera.fov = S.homeFit ? fovFor(dist) : vfov;
    S.camera.updateProjectionMatrix();
    S.camBase.target.copy(target);
    S.camBase.pos.set(target.x + fit.dx, target.y + fit.dy, target.z - OUT_Z * dist);
    S.homePos = S.camBase.pos.clone();
    S.homeTarget = S.camBase.target.clone();
  }

  function place(obj, anchor, opts = {}) {
    obj.updateMatrixWorld(true);
    let b = Core.boxOf(obj);
    const maxDim = Math.max(b.size.x, b.size.y, b.size.z) || 1;
    // 只在尺寸离谱时归一（例如 FBX 以厘米为单位导出的 100 倍模型），示例资产保持原尺寸
    const k = anchor.max / maxDim;
    const plausible = !!anchor.meters && maxDim >= anchor.meters[0] && maxDim <= anchor.meters[1];
    // fit: 房间声明「窗要正好填满我的洞口」时，不管倍数大小都缩放到 anchor.max
    if (anchor.fit || (!plausible && (k > 1.8 || k < 0.55))) obj.scale.multiplyScalar(k);
    obj.updateMatrixWorld(true);
    b = Core.boxOf(obj);
    if (anchor.cx != null) obj.position.x += anchor.cx - b.center.x;
    if (anchor.cz != null) obj.position.z += anchor.cz - b.center.z;
    if (anchor.centerY != null) obj.position.y += anchor.centerY - b.center.y;
    if (anchor.minY != null) obj.position.y += anchor.minY - b.box.min.y;
    obj.updateMatrixWorld(true);
    return Core.boxOf(obj);
  }

  /* 贴图的各向异性：掠射角下的墙面/地板不设这个会一块块发糊（默认只有 1） */
  function boostAnisotropy() {
    const caps = S.renderer && S.renderer.capabilities;
    const max = caps && caps.getMaxAnisotropy ? caps.getMaxAnisotropy() : 1;
    if (!max || !S.scene) return;
    S.scene.traverse(o => {
      const list = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : null;
      if (!list) return;
      for (const m of list) {
        if (!m) continue;
        for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'alphaMap']) {
          const t = m[key];
          if (t && t.isTexture && t.anisotropy !== max) { t.anisotropy = max; t.needsUpdate = true; }
        }
      }
    });
  }

  /* Give the imported room a consistent PBR floor. The source scenes mix
     glossy defaults and single-sided cloth, which is why the old prologue had
     shiny textile patches and light bleeding straight through curtains. */
  function tuneRoomMaterials() {
    if (!S.scene) return;
    const clothOverlays = [];
    S.scene.traverse(o => {
      if (!o.isMesh) return;
      const baseMats = Array.isArray(o.material) ? o.material : [o.material];
      const nodeTag = ((o.name || '') + ' ' + ((o.userData && o.userData.label) || '')).toLowerCase();
      const isCurtain = /curtain|窗帘|drape/.test(nodeTag);
      const ob = Core.boxOf(o);
      // The imported max scene labels its tablecloths as generic materials.
      // Identify the broad, thin surface at table height and make it textile
      // matte so it stops reading as chrome or a steel plate.
      const tableHeight = ob.center.y > 0.58 && ob.center.y < 0.92 && ob.size.y < 0.24;
      const looksLikeTablecloth = tableHeight && ((ob.size.x > 0.7 && ob.size.z > 0.7) ||
        (ob.size.x > 1.2 && ob.size.z < 0.35) || (ob.size.z > 1.2 && ob.size.x < 0.35));
      const broadTablePiece = ob.center.y > 0.42 && ob.center.y < 0.94 && ob.size.x > 0.7 && ob.size.z > 0.7;
      const mats = looksLikeTablecloth ? baseMats.map(m => m && m.clone ? m.clone() : m) : baseMats;
      if (looksLikeTablecloth) o.material = Array.isArray(o.material) ? mats : mats[0];
      for (const m of mats) {
        if (!m) continue;
        const tag = (nodeTag + ' ' + (m.name || '')).toLowerCase();
        const isTextile = /curtain|窗帘|drape|cloth|桌布|linen|velvet|upholstery|leather|皮革/.test(tag);
        if (isTextile) {
          if ('metalness' in m) m.metalness = 0;
          if ('roughness' in m) m.roughness = Math.max(0.78, m.roughness || 0);
          if ('clearcoat' in m) m.clearcoat = 0;
          m.transparent = false;
          m.opacity = 1;
          m.depthWrite = true;
          if (isCurtain) m.side = T.DoubleSide;
          m.needsUpdate = true;
        }
        if (looksLikeTablecloth) {
          if ('metalness' in m) m.metalness = 0;
          if ('roughness' in m) m.roughness = Math.max(0.88, m.roughness || 0);
          if ('clearcoat' in m) m.clearcoat = 0;
          if ('envMapIntensity' in m) m.envMapIntensity = Math.min(0.16, m.envMapIntensity || 0);
          if (m.map) m.map = null;
          if (m.color && m.color.set) m.color.set(0xd6c9bd);
          m.needsUpdate = true;
        }
        if (broadTablePiece && 'roughness' in m && m.roughness < 0.2) {
          // A few max materials arrive as chrome (roughness 0). On the dining
          // table that turns the cloth and tabletop into a steel plate.
          if ('metalness' in m) m.metalness = 0;
          m.roughness = 0.82;
          if ('clearcoat' in m) m.clearcoat = 0;
          if ('envMapIntensity' in m) m.envMapIntensity = 0.12;
          if (m.color && m.color.getHex() === 0xbcbcbc) m.color.set(0xc9beb3);
          m.needsUpdate = true;
        }
      }
      if (looksLikeTablecloth && ((ob.size.x > 1.2 && ob.size.z < 0.35) || (ob.size.z > 1.2 && ob.size.x < 0.35))) {
        // The source mesh has a deep, rounded 24 cm profile, which reads as a
        // metal tray. Replace that silhouette with a thin linen surface while
        // keeping the authored footprint and the user's table layout.
        o.visible = false;
        clothOverlays.push({ x: ob.center.x, y: ob.box.max.y + 0.006, z: ob.center.z, w: ob.size.x * 1.01, d: Math.max(0.22, ob.size.z * 1.02) });
      }
      o.castShadow = true;
      o.receiveShadow = true;
      if (isCurtain) o.frustumCulled = false;
    });
    if (clothOverlays.length) {
      const c = document.createElement('canvas');
      c.width = c.height = 160;
      const g = c.getContext('2d');
      g.fillStyle = '#d8cfc4'; g.fillRect(0, 0, 160, 160);
      g.globalAlpha = 0.16;
      for (let i = 0; i < 160; i += 4) { g.fillStyle = i % 8 ? '#8f8176' : '#f7f1e8'; g.fillRect(i, 0, 1, 160); g.fillRect(0, i, 160, 1); }
      const tex = new T.CanvasTexture(c);
      tex.colorSpace = T.SRGBColorSpace;
      tex.wrapS = tex.wrapT = T.RepeatWrapping;
      tex.repeat.set(3, 2);
      const mat = new T.MeshStandardMaterial({ map: tex, color: 0xffffff, roughness: 0.96, metalness: 0, envMapIntensity: 0.08, side: T.DoubleSide });
      for (const x of clothOverlays) {
        const mesh = new T.Mesh(new T.PlaneGeometry(x.w, x.d), mat.clone());
        mesh.name = '桌布·亚麻';
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(x.x, x.y, x.z);
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        S.scene.add(mesh);
        // 这块桌布是补在 S.room 之外的，风格切换要单独记一笔（否则点云模式会漏成一条实心亮带）
        (S._clothMeshes || (S._clothMeshes = [])).push(mesh);
      }
    }
  }

  /* 房间根节点的 extras.prologue（GLTFLoader 会放进 userData）：
       aligned: true   → 房间已按序章坐标建好，不要重新居中（包围盒不对称的房间居中会整体平移，
                          窗洞、餐桌全部错位 —— 「餐厅·原场景」就是这种）
       window / cake   → 这间房自己的锚点，覆盖默认值 */
  function roomDecl(obj) {
    let decl = null;
    obj.traverse(o => { if (!decl && o.userData && o.userData.prologue) decl = o.userData.prologue; });
    return decl;
  }

  function applyRoomAnchors(decl) {
    if (!decl) return;
    for (const k of ['window', 'cake']) {
      if (decl[k] && typeof decl[k] === 'object') Object.assign(ANCHOR[k], decl[k]);
    }
  }

  /* The extracted max scene is a furniture slice, so its original room shell
     is missing. Give it a quiet architectural envelope: floor, ceiling and
     three walls. The back wall stays behind the authored window, which keeps
     the view grounded and stops exterior light from washing through the whole
     room. Programmatic rooms already contain their own shell and are skipped. */
  /* 房间外壳的墙色要跟模型自带的墙一致。
     原来外壳写死 #37313b（近黑），模型的墙是浅色墙漆 —— 于是窗帘旁边出现
     「一半墨绿一半黑」的两块板子，像临时拼上去的。这里从模型里量出面积最大的
     那片后墙，取它的颜色，再压暗一点点，接缝就看不出来了。 */
  function pickWallTone() {
    if (!S.room) return null;
    const rb = S.roomBox || Core.boxOf(S.room);
    const backZ = rb.box.min.z;
    let best = null, area = 0;
    S.room.traverse(o => {
      if (!o.isMesh || !o.geometry) return;
      const m = Array.isArray(o.material) ? o.material[0] : o.material;
      if (!m || !m.color || m.transparent) return;
      const b = Core.boxOf(o);
      if (b.size.y < 1.0 || Math.min(b.size.x, b.size.z) < 0.02) return;
      if (Math.abs(b.center.z - backZ) > 1.2) return;
      const a = Math.max(b.size.x, b.size.z) * b.size.y;
      if (a > area) { area = a; best = m.color.clone(); }
    });
    return best;
  }

  function addRoomEnvelope() {
    if (!S.room || !S.roomDecl || !S.roomDecl.aligned || S.roomEnvelope) return;
    const b = S.roomBox || (S.roomBox = Core.boxOf(S.room));
    const width = Math.max(4.8, b.size.x + 0.24);
    const depth = Math.max(4.2, b.size.z + 0.24);
    const height = Math.max(2.8, b.size.y + 0.12);
    const y0 = b.box.min.y - 0.025;
    const y1 = b.box.max.y + 0.04;
    const z0 = b.box.min.z - 0.06;
    const z1 = b.box.max.z + 0.06;
    const x0 = b.box.min.x - 0.06;
    const x1 = b.box.max.x + 0.06;
    const tone = pickWallTone() || new T.Color(0x37313b);
    const wallColor = tone.multiplyScalar(0.86);   // 比模型墙略暗，像离灯更远的那一段
    const wallMat = new T.MeshStandardMaterial({ color: wallColor, roughness: 0.95, metalness: 0, envMapIntensity: 0.18, emissive: 0x000000, side: T.DoubleSide });
    const floorMat = new T.MeshStandardMaterial({ color: 0x2a2a30, roughness: 0.80, metalness: 0, envMapIntensity: 0.18, side: T.DoubleSide });
    const g = new T.Group();
    g.name = '原场景·房间墙体';
    const addBox = (name, sx, sy, sz, x, y, z, mat) => {
      const mesh = new T.Mesh(new T.BoxGeometry(sx, sy, sz), mat);
      mesh.name = name;
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      g.add(mesh);
    };
    addBox('地面', width, 0.12, depth, (x0 + x1) / 2, y0 - 0.06, (z0 + z1) / 2, floorMat);
    // 后墙开口必须**大于窗扇**：原来按 0.48/0.49 算出来是 1.996×2.038，
    // 而窗扇是 1.948×2.08 —— 高度还差 4 cm，窗扇顶穿墙，
    // 而且远处机位的边角射线会被墙体挡住，逼得开场镜头往前挤、fov 撑到 73° 变成广角。
    // 现在按 0.56 开（每边比窗扇多约 12 cm），多出来的被原有后墙和窗帘遮住，看不出破绽。
    const wx = ANCHOR.window.cx;
    const wy = ANCHOR.window.centerY;
    const holeHalf = (ANCHOR.window.max || 2.0) * 0.56;
    const halfW = Math.min(width * 0.46, holeHalf);
    const halfH = Math.min(height * 0.46, holeHalf);
    const leftW = Math.max(0.12, wx - halfW - x0);
    const rightW = Math.max(0.12, x1 - (wx + halfW));
    const bottomH = Math.max(0.12, wy - halfH - y0);
    const topH = Math.max(0.12, y1 - (wy + halfH));
    addBox('后墙·左', leftW, height, 0.12, x0 + leftW / 2, (y0 + y1) / 2, z0, wallMat);
    addBox('后墙·右', rightW, height, 0.12, x1 - rightW / 2, (y0 + y1) / 2, z0, wallMat);
    addBox('后墙·下', Math.max(0.12, 2 * halfW), bottomH, 0.12, wx, y0 + bottomH / 2, z0, wallMat);
    addBox('后墙·上', Math.max(0.12, 2 * halfW), topH, 0.12, wx, y1 - topH / 2, z0, wallMat);
    addBox('左墙', 0.12, height, depth, x0, (y0 + y1) / 2, (z0 + z1) / 2, wallMat);
    addBox('右墙', 0.12, height, depth, x1, (y0 + y1) / 2, (z0 + z1) / 2, wallMat);
    addBox('天花板', width, 0.12, depth, (x0 + x1) / 2, y1, (z0 + z1) / 2, wallMat);
    S.roomEnvelope = g;
    S.scene.add(g);
  }

  /* ===================================================== 自适应摆放（射线） */
  /* 真实场景里桌上有盘子/花艺、头顶有吊灯、窗边有窗帘和摆件，写死坐标迟早撞上。
     这几个函数在载入时用射线实测，自动找：蛋糕能放的空桌面、看得见窗/蛋糕的机位、窗扇能开多大。
     每条射线约 2 ms（52 万面房间实测），全部搜索一次加起来几百毫秒，只在载入时跑一次。 */
  const FIT = { rc: new T.Raycaster() };

  /* 射线是否该被这个网格挡住：自己或祖先被藏了、或被标成「挖了窗洞 / 老宅里该忽略」的不算。
     注意 three 的 intersectObject 不会跳过 visible=false 的对象，所以得自己判。 */
  function rayVisible(o) {
    for (let n = o; n; n = n.parent) {
      if (n.visible === false) return false;
      if (n.userData && (n.userData.suCut || n.userData.suHidden)) return false;
    }
    return true;
  }

  // 射线检测时把房间材质临时设成双面：相机/窗扇万一在模型内部，单面剔除会把墙「看穿」
  function withDoubleSide(fn) {
    const saved = [];
    if (S.room) S.room.traverse(o => {
      if (!o.isMesh) return;
      const list = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of list) if (m && m.side !== T.DoubleSide) { saved.push([m, m.side]); m.side = T.DoubleSide; }
    });
    try { return fn(); } finally { for (const [m, s] of saved) m.side = s; }
  }

  function firstHit(from, to, margin = 0) {
    const dir = to.clone().sub(from);
    const dist = dir.length();
    if (dist < 1e-4) return null;
    FIT.rc.set(from, dir.divideScalar(dist));
    FIT.rc.near = 0;
    FIT.rc.far = Math.max(0, dist - margin);
    const hits = FIT.rc.intersectObject(S.room, true);
    /* 两类网格要跳过：
       ① 被裁切面挖过窗洞的墙（Raycaster 不认剪辑面，洞在射线里还是实心）；
       ② 藏起来的网格（three 的 intersectObject 不看 visible，藏了照样挡射线）。 */
    return hits.find(h => rayVisible(h.object)) || null;
  }

  // 相机周围 r 米内有没有东西（六个方向各打一条短射线）
  function clearAround(p, r) {
    for (const d of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
      if (firstHit(p, p.clone().add(new T.Vector3(d[0], d[1], d[2]).multiplyScalar(r)))) return false;
    }
    return true;
  }

  /* 在一组候选机位里找第一个「看得见目标」的：
     targets 里每个点都要视线通畅（扣掉 margin，目标本身附近的东西不算挡）。 */
  function pickView(cands, targets, { margin = 0.1, clearance = 0.2 } = {}) {
    return withDoubleSide(() => {
      for (const c of cands) {
        if (!clearAround(c.pos, clearance)) continue;
        let ok = true;
        for (const t of targets) { if (firstHit(c.pos, t, margin)) { ok = false; break; } }
        if (ok) return c;
      }
      return null;
    });
  }

  /* 桌面高度图：把房间里落在 box 内、低于 ceilY 的三角形栅格化成一张 cell×cell 的
     「这一格最高的表面有多高」二维表（没有东西 = -Infinity，即桌子外面）。
     找空桌面要评估上千个候选，查表是 O(1)，比打射线快几个数量级。 */
  function heightMap(box, ceilY, cell) {
    const nx = Math.ceil((box.max.x - box.min.x) / cell), nz = Math.ceil((box.max.z - box.min.z) / cell);
    const H = new Float32Array(nx * nz).fill(-Infinity);
    const put = (x, z, y) => {
      if (y > ceilY || y < box.min.y) return;
      const i = Math.floor((x - box.min.x) / cell), k = Math.floor((z - box.min.z) / cell);
      if (i < 0 || k < 0 || i >= nx || k >= nz) return;
      const j = k * nx + i;
      if (y > H[j]) H[j] = y;
    };
    const a = new T.Vector3(), b = new T.Vector3(), c = new T.Vector3();
    S.room.updateMatrixWorld(true);
    S.room.traverse(o => {
      if (!o.isMesh) return;
      const g = o.geometry, pa = g.attributes.position, ix = g.index;
      const n = ix ? ix.count : pa.count, M = o.matrixWorld;
      for (let t = 0; t < n; t += 3) {
        a.fromBufferAttribute(pa, ix ? ix.getX(t) : t).applyMatrix4(M);
        b.fromBufferAttribute(pa, ix ? ix.getX(t + 1) : t + 1).applyMatrix4(M);
        c.fromBufferAttribute(pa, ix ? ix.getX(t + 2) : t + 2).applyMatrix4(M);
        if (Math.max(a.x, b.x, c.x) < box.min.x || Math.min(a.x, b.x, c.x) > box.max.x) continue;
        if (Math.max(a.z, b.z, c.z) < box.min.z || Math.min(a.z, b.z, c.z) > box.max.z) continue;
        if (Math.max(a.y, b.y, c.y) < box.min.y || Math.min(a.y, b.y, c.y) > ceilY) continue;
        // 三条边按半格采样（竖直的面——杯壁、花茎——投影只是一条线，靠这个记上）
        for (const [p, q] of [[a, b], [b, c], [c, a]]) {
          const L = Math.hypot(q.x - p.x, q.z - p.z);
          const steps = Math.max(1, Math.ceil(L / (cell * 0.5)));
          for (let s = 0; s <= steps; s++) {
            const f = s / steps;
            put(p.x + (q.x - p.x) * f, p.z + (q.z - p.z) * f, p.y + (q.y - p.y) * f);
          }
        }
        // 面内：格子中心落在投影三角形里就按重心插值高度
        const det = (b.z - c.z) * (a.x - c.x) + (c.x - b.x) * (a.z - c.z);
        if (Math.abs(det) < 1e-10) continue;
        const i0 = Math.max(0, Math.floor((Math.min(a.x, b.x, c.x) - box.min.x) / cell));
        const i1 = Math.min(nx - 1, Math.floor((Math.max(a.x, b.x, c.x) - box.min.x) / cell));
        const k0 = Math.max(0, Math.floor((Math.min(a.z, b.z, c.z) - box.min.z) / cell));
        const k1 = Math.min(nz - 1, Math.floor((Math.max(a.z, b.z, c.z) - box.min.z) / cell));
        for (let k = k0; k <= k1; k++) {
          const z = box.min.z + (k + 0.5) * cell;
          for (let i = i0; i <= i1; i++) {
            const x = box.min.x + (i + 0.5) * cell;
            const w0 = ((b.z - c.z) * (x - c.x) + (c.x - b.x) * (z - c.z)) / det;
            const w1 = ((c.z - a.z) * (x - c.x) + (a.x - c.x) * (z - c.z)) / det;
            const w2 = 1 - w0 - w1;
            if (w0 < 0 || w1 < 0 || w2 < 0) continue;
            const y = w0 * a.y + w1 * b.y + w2 * c.y;
            if (y > ceilY || y < box.min.y) continue;
            const j = k * nx + i;
            if (y > H[j]) H[j] = y;
          }
        }
      }
    });
    return { H, nx, nz, cell, box };
  }

  /* 蛋糕：在整张桌面上找一块「平的」地方 —— 蛋糕是圆的，按圆形脚印检查覆盖的每一格：
       · 都要有东西托着（不能悬在桌外），且不高于桌面 +8 cm（花艺/酒杯/叠盘都超了）
       · 整块高差 ≤ 4.5 cm（桌旗、餐垫叠起来就有 3–4 cm，蛋糕压在上面是正常的）
     所有能放的位置里取「离锚点近 + 更平」综合最优。返回最高点，蛋糕底就贴在那儿。 */
  function fitCakeSpot(cakeObj) {
    if (!S.room) return null;
    const b0 = Core.boxOf(cakeObj);
    const R = Math.max(b0.size.x, b0.size.z) / 2 + 0.01;
    const a = ANCHOR.cake;
    const box = new T.Box3(new T.Vector3(a.cx - 0.9, a.minY - 0.2, a.cz - 1.7),
                           new T.Vector3(a.cx + 0.9, a.minY + 0.9, a.cz + 1.2));
    const { H, nx, nz, cell } = heightMap(box, a.minY + 0.85, 0.01);
    // 蛋糕放大后（0.42 m）桌上更挤，搜索范围和平整度都放宽一点：
    // 桌旗 2 cm + 餐垫 3~4 cm 叠起来本来就有 5 cm 高差，蛋糕压在上面是正常摆法。
    const lo = a.minY - 0.1, hiCap = a.minY + 0.09;
    // 圆形脚印的格子偏移，预先算好
    const rc = Math.ceil(R / cell);
    const offs = [];
    for (let dk = -rc; dk <= rc; dk++) for (let di = -rc; di <= rc; di++) {
      if (Math.hypot(di * cell, dk * cell) <= R) offs.push([di, dk]);
    }
    let best = null;
    for (let dz = -1.65; dz <= 1.1001; dz += 0.02) {
      for (let dx = -0.6; dx <= 0.6001; dx += 0.02) {
        const x = a.cx + dx, z = a.cz + dz;
        const d = Math.hypot(dx, dz);
        if (best && d > best.cost) continue;            // 距离已经比当前最优的总分还大，不可能更好
        const ci = Math.floor((x - box.min.x) / cell), ck = Math.floor((z - box.min.z) / cell);
        if (ci - rc < 0 || ck - rc < 0 || ci + rc >= nx || ck + rc >= nz) continue;
        let mn = Infinity, mx = -Infinity, ok = true;
        for (const [di, dk] of offs) {
          const y = H[(ck + dk) * nx + ci + di];
          if (!(y >= lo) || y > hiCap) { ok = false; break; }
          if (y < mn) mn = y;
          if (y > mx) mx = y;
        }
        if (!ok || mx - mn > 0.05) continue;
        const cost = d + (mx - mn) * 8;
        if (!best || cost < best.cost) best = { x, z, y: mx, spread: +(mx - mn).toFixed(3), cost };
      }
    }
    return best;
  }

  /* 窗扇往房间里开，扫过的弧线上不能有窗帘/摆件。返回不撞东西的最大开角（弧度，带符号）。 */
  function fitSashSwing() {
    if (!S.sash || !S.room) return null;
    const sash = S.sash, ax = S.sashAxis;
    const from = S.sashFrom, full = S.sashTo - S.sashFrom;
    sash.rotation[ax] = from; S.windowGroup.updateMatrixWorld(true);
    const pivot = new T.Vector3().setFromMatrixPosition(sash.matrixWorld);
    const sb = new T.Box3().setFromObject(sash);
    // 自由边 = 离铰链最远的那条竖边；再取半宽处一条，扫面也照顾到
    const farX = Math.abs(sb.max.x - pivot.x) > Math.abs(sb.min.x - pivot.x) ? sb.max.x : sb.min.x;
    const midX = (farX + pivot.x) / 2;
    const zf = (sb.min.z + sb.max.z) / 2;
    const ys = [sb.min.y + 0.05, (sb.min.y + sb.max.y) / 2, sb.max.y - 0.05];
    const local = [];
    for (const x of [farX, midX]) for (const y of ys) local.push(sash.worldToLocal(new T.Vector3(x, y, zf)));
    const STEPS = 21;
    const pts = [];
    for (let i = 0; i <= STEPS; i++) {
      sash.rotation[ax] = from + full * (i / STEPS);
      S.windowGroup.updateMatrixWorld(true);
      pts.push(local.map(v => sash.localToWorld(v.clone())));
    }
    sash.rotation[ax] = from; S.windowGroup.updateMatrixWorld(true);
    let safeStep = STEPS;
    withDoubleSide(() => {
      for (let i = 1; i <= STEPS; i++) {
        let hit = false;
        for (let k = 0; k < local.length && !hit; k++) if (firstHit(pts[i - 1][k], pts[i][k])) hit = true;
        // 自由边整条竖线
        if (!hit && firstHit(pts[i][0], pts[i][2])) hit = true;
        if (hit) { safeStep = i - 1; break; }
      }
    });
    return { safe: full * (safeStep / STEPS), full, blockedAt: safeStep < STEPS ? safeStep / STEPS : null };
  }

  /* 补光、窗洞冷光、窗外光都跟着锚点走（锚点可能被房间改过） */
  function aimLights() {
    const w = ANCHOR.window, c = ANCHOR.cake;
    if (S.cakeFill) S.cakeFill.position.set(c.cx, c.minY + 0.53, c.cz - 0.07);
    if (S.cakeView && S.cakeFill) {
      // 补光放在镜头和蛋糕之间偏上，照亮蛋糕朝镜头这一面
      const p = S.cakeView.pos;
      S.cakeFill.position.set((p.x + c.cx) / 2, Math.max(p.y, c.minY + 0.45) + 0.08, (p.z + c.cz) / 2);
    }
    if (S.windowShaft) {
      // 光束从窗口里侧射向蛋糕（老宅的窗在南墙，里侧是 -z 方向）
      S.windowShaft.position.set(w.cx + 0.05, w.centerY + 0.4, w.cz - OUT_Z * 0.12);
      S.windowShaft.target.position.set(c.cx, c.minY + 0.05, c.cz);
    }
    if (S.outsideLight) S.outsideLight.position.set(w.cx, w.centerY + 0.15, w.cz + OUT_Z * 0.95);
    if (S.roomFill) S.roomFill.position.set(c.cx + 1.2, 1.75, c.cz + OUT_Z * 0.55);
  }

  /* 窗帘衬里：原模型的窗帘是两片薄布，褶皱之间有真实缝隙，透光看过去像"镂空"。
     真实丝绒窗帘背面都有衬里，所以在两片帘子背后各加一片暗色挡板（只挡帘子所在的左右两侧，
     不挡中间 1.6 m 的窗洞）。只有 aligned 房间才做（内置程序化房间用布料模拟，不需要）。 */
  function addCurtainLining() {
    if (!S.room || S.curtainLining) return;
    if (!S.roomDecl || !S.roomDecl.aligned) return;
    if (params.get('nolin') === '1') return;

    // 找窗帘网格：先按我们映射后的材质名，再退回原材质名 dfdtgg
    let drape = null;
    S.room.traverse(o => {
      if (drape || !o.isMesh) return;
      const n = ((o.material && o.material.name) || '') + ' ' + (o.name || '');
      if (/窗帘|dfdtgg/i.test(n)) drape = o;
    });
    if (!drape) return;

    const mat = drape.material.clone();
    if (mat.color) mat.color.multiplyScalar(0.5);      // 衬里比帘面暗，才像"背后一层"
    mat.side = T.DoubleSide;
    mat.roughness = 0.96;
    mat.metalness = 0;
    if (mat.map) { mat.map = mat.map; }

    const w = ANCHOR.window;
    const halfOpen = (w.max || 2.08) * 0.40;           // 中间留空（窗洞），两侧才是帘子
    const z = w.cz + 0.14;                            // 帘面内侧一点，紧贴帘背
    const y0 = 0.94, y1 = 2.98;

    // 外边界取**窗帘自身**的包围盒（x −1.33…1.32）。用房间包围盒会一路铺到墙两端，
    // 把整面后墙都遮黑（实测右侧铺到了 x=4.15）。
    const db = Core.boxOf(drape);
    const left = db.box.min.x;
    const right = db.box.max.x;

    for (const [x0, x1] of [[left, Math.min(w.cx - halfOpen, right)], [Math.max(w.cx + halfOpen, left), right]]) {
      const width = x1 - x0;
      if (width < 0.05) continue;
      const panel = new T.Mesh(new T.PlaneGeometry(width, y1 - y0), mat);
      panel.position.set((x0 + x1) / 2, (y0 + y1) / 2, z);
      panel.name = '窗帘衬里';
      panel.receiveShadow = true;
      S.scene.add(panel);                             // 挂在 scene 上，不进 S.room（避免干扰射线判定）
    }
    S.curtainLining = true;
  }

  /* Blender 蛋糕（?cake=blend30）：模型自带 9 支蜡烛和火焰笔刷。但原文是「十四支小火苗」，
     而且蜡烛要能逐支点亮、要跟着 S.candleGlow 闪 —— 那套是我们自己的系统。
     所以把模型自带的蜡烛和火焰节点藏掉，只留蛋糕体、奶油和盘子。 */
  function prepareBlendCake(root) {
    const hidden = [];
    root.traverse(o => {
      if (!o.isMesh) return;
      const name = o.name || '';
      if (/^candle|^flame|vela/i.test(name)) {
        o.visible = false;
        hidden.push(name);
      }
    });
    S.blendCakeHidden = hidden;
    return hidden.length;
  }

  /* ========================================================== 老宅（SU）适配
     异象一那间 SketchUp 老宅（assets/room-su.js）和序章原来的餐厅切片不是一套坐标：
       · 窗在南墙（模型自带一块 1.24×1.64 的薄玻璃，贴在实体墙前，没有真洞）；
       · 老宅自己的餐桌在北半边（桌面 0.85 m），离窗约 7 m —— 序章就用这张桌子。
     所以换房间时要做的只有两件事：
       ① 把序章的窗挪到南墙那块玻璃的位置，并原地转 180°（它本来是朝 -z 开的）；
       ② 在墙上按窗的尺寸裁一个洞（只裁这一页 clone 出来的材质，room-su.js 一个字节不动）。
     外加一条：窗外方向反了（南窗的窗外是 +z），所以 OUT_Z 会把「往窗外」的相机/灯/假景
     统一翻个号 —— 见 outZ()。
     换回 room-max / 程序化餐厅时这一整块不生效。 */
  const SU_HOUSE = {
    id: 'sample-room-su',
    /* 同一间屋的两个样例：完整版（异象一用的 60 MB room-su.js）与裁切版（room-su-core，13.3 MB）。
       几何是同一份坐标，适配层对两者完全通用。 */
    ids: ['sample-room-su', 'sample-room-su-core'],
    wallZ: 3.62,                                        // 南墙（模型里那块窗玻璃所在）
    window: { cx: -2.64, centerY: 1.44, cz: 3.62, yaw: Math.PI },
    // 老宅自带餐桌：实测桌面 0.85 m，x 1.55~2.64、z -2.51~-1.22；锚点取桌面中偏里，
    // fitCakeSpot 会再挪开椅背，所以别贴着边摆（贴边时蛋糕盘会悬在桌沿外）
    cake: { cx: 2.02, cz: -1.78, minY: 0.85 }
  };

  /* 窗外方向在 z 轴上的符号：room-max 的窗在北墙（窗外 -z），老宅的窗在南墙（窗外 +z）。
     「从锚点往窗外走 d 米」统一写 outZ(z, d)，别再散着手写 ±。 */
  const OUT_Z = SU_HOUSE.ids.includes(ROOM_PREF) ? 1 : -1;
  const outZ = (z, d) => z + OUT_Z * d;

  function isSuHouse() {
    const e = S.roles && S.roles.room;
    const id = e && e.entry && e.entry.rec ? e.entry.rec.id : null;
    return SU_HOUSE.ids.includes(id);
  }

  /* 在墙上开窗洞。
     只对「盖住洞口、又贴着南墙」的网格动手，而且把材质 clone 一份再挂裁切面 ——
     墙材质在整宅里是复用的，直接改原材质会把别的墙一起裁掉。
     clipIntersection：四个平面取交集才裁，交集正好是洞口那块矩形。 */
  /* 老宅自带的窗帘是一两块"几乎没厚度的大竖板"（0.02×2.13×0.23 那种），
     在全息勘察里只画边线，就成了横七竖八的断铁丝；换任何风格它也只是贴在玻璃前的灰片。
     做法：把窗区里这类竖板藏掉，另外现场搭两片有褶皱的帘子。
     褶皱用真实起伏的网格做，所以线框风格下看到的是成排的折痕，不是乱线。 */
  function buildSuCurtains(win) {
    if (!S.room || S.suCurtains) return null;
    if (!win) return null;
    /* 之前用 Core.boxOf(win) 拿到的框和实际窗户差了好几个单位，帘子被建到了 7 m 外。
       这里直接用世界包围盒，再换到房间的局部坐标系（帘子是挂在 S.room 下的）。 */
    S.room.updateMatrixWorld(true);
    const wb = new T.Box3().setFromObject(win);
    if (!isFinite(wb.min.x) || wb.isEmpty()) return null;
    const p0 = wb.min.clone(), p1 = wb.max.clone();
    S.room.worldToLocal(p0); S.room.worldToLocal(p1);
    const b = {
      box: { min: new T.Vector3(Math.min(p0.x, p1.x), Math.min(p0.y, p1.y), Math.min(p0.z, p1.z)),
             max: new T.Vector3(Math.max(p0.x, p1.x), Math.max(p0.y, p1.y), Math.max(p0.z, p1.z)) },
      size: { x: Math.abs(p1.x - p0.x), y: Math.abs(p1.y - p0.y), z: Math.abs(p1.z - p0.z) }
    };
    const wallZ = b.box.max.z;
    const g = new T.Group();
    g.name = 'su-curtains';
    /* su-curtains-no-wire：布面抽线会变成一把浮在空中的竖线，不参与全息线稿 */
    g.traverse && null;

    const mat = new T.MeshStandardMaterial({ color: 0x6a5c50, roughness: 0.95, metalness: 0, side: T.DoubleSide });

    const rodY = b.box.max.y + 0.06;
    const bottomY = Math.max(0.04, b.box.min.y + 0.02);
    const h = Math.max(1.0, rodY - bottomY);

    /* 一片帘子：从秆上垂到地板，竖向打褶（上密下疏），下摆略往屋里散。 */
    const panel = (cx, w, flip) => {
      const geo = new T.PlaneGeometry(w, h, 34, 12);
      const pos = geo.attributes.position;
      const uv = geo.attributes.uv;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i);
        const u = uv.getX(i), v = uv.getY(i);
        const fall = 1 - v;                                   // 0 = 秆上，1 = 下摆
        const amp = 0.020 + 0.026 * fall;
        const fold = Math.sin(u * Math.PI * 9 + (flip ? 1.1 : 0)) * amp;
        const sway = fall * fall * 0.04;                      // 下摆往屋里甩一点
        /* 下摆只向室内轻微鼓起，避免开窗后整片帘子被吹出窗框。 */
        pos.setZ(i, fold + Math.min(0.035, sway));
        pos.setX(i, x * (0.88 + 0.14 * fall));                // 上窄下宽
      }
      geo.computeVertexNormals();
      const m = new T.Mesh(geo, mat);
      m.position.set(cx, bottomY + h / 2, wallZ - 0.018);
      m.rotation.y = 0;
      m.castShadow = false;
      m.receiveShadow = false;
      m.userData.suCurtain = true;
      return m;
    };

    /* 两片帘各盖住窗洞边缘 14 cm，主体落在墙上，扇往里推时不容易穿到布。 */
    const sideW = Math.min(0.42, Math.max(0.28, b.size.x * 0.24));
    g.add(panel(b.box.min.x - sideW * 0.18, sideW, true));
    g.add(panel(b.box.max.x + sideW * 0.18, sideW, false));
    const rodGeo = new T.CylinderGeometry(0.017, 0.017, b.size.x + 0.92, 8);
    const rod = new T.Mesh(rodGeo, new T.MeshStandardMaterial({ color: 0x3f362e, roughness: 0.62, metalness: 0.35 }));
    rod.rotation.z = Math.PI / 2;
    rod.position.set((b.box.min.x + b.box.max.x) / 2, rodY, wallZ - 0.062);
    rod.name = 'su-curtain-rod';
    g.add(rod);

    S.room.add(g);
    S.suCurtains = g;
    g.traverse(o => { o.userData.suHidden = true; });
    try {
      g.updateMatrixWorld(true);
      const bb = new T.Box3().setFromObject(g);
      const cx = (bb.min.x + bb.max.x) / 2, cz = (bb.min.z + bb.max.z) / 2;
      /* 用房间包围盒判断“是不是建到房间外面去了”，别再拿世界原点当标准（这间屋子不在原点上） */
      const rb = S.roomBox && S.roomBox.box;
      if (rb) {
        const rc = rb.getCenter(new T.Vector3());
        const far = Math.hypot(cx - rc.x, cz - rc.z);
        const lim = Math.max(rb.max.x - rb.min.x, rb.max.z - rb.min.z) * 0.75;
        if (far > lim) g.visible = false;
      }
    } catch (eC) { /* 忽略 */ }
    return g;
  }

  /* 窗套：cutSuWindowHole 按窗框外扩 18 cm 开洞（为了让窗扇能往里开），
     多出来这一圈原来靠老宅自带的窗套遮，那套被清掉之后就成了"窗子变小的空洞"。
     这里补一圈实心窗套把缝填上，颜色跟墙一致。 */
  /* 把窗整组放大到"刚好填满洞口"：洞口是按窗框 + 18cm 开的（为了让窗扇能往里开），
     放大后缝就彻底没了，代价是窗扇能开的角度会变小（由 fitSash 重新算）。 */
  function fitWindowToHole(win, pad) {
    if (!S.room || !win) return false;
    const b = new T.Box3().setFromObject(win);
    if (!isFinite(b.min.x) || b.isEmpty()) return false;
    const w = b.max.x - b.min.x, h = b.max.y - b.min.y;
    if (!(w > 0.2 && h > 0.2)) return false;
    const padW = (pad === undefined ? 0.18 : pad);
    const sx = (w + padW * 2) / w, sy = (h + padW * 2) / h;
    const c = b.getCenter(new T.Vector3());
    const holder = win.parent;
    const lc = holder ? holder.worldToLocal(c.clone()) : c.clone();
    win.scale.x *= sx; win.scale.y *= sy;
    win.updateMatrixWorld(true);
    const b2 = new T.Box3().setFromObject(win);
    const c2 = b2.getCenter(new T.Vector3());
    const lc2 = holder ? holder.worldToLocal(c2.clone()) : c2.clone();
    win.position.x += lc.x - lc2.x;
    win.position.y += lc.y - lc2.y;
    win.updateMatrixWorld(true);
    S.windowFitted = { sx: sx, sy: sy, fromW: w, fromH: h };
    if (S.winSurround) {
      try { S.room.remove(S.winSurround); } catch (e3) {}
      S.winSurround = null;
    }
    return true;
  }

  function addWindowSurround(win) {
    if (!S.room || !win) return null;
    if (S.winSurround) return S.winSurround;
    S.room.updateMatrixWorld(true);
    const wb = new T.Box3().setFromObject(win);
    if (!isFinite(wb.min.x) || wb.isEmpty()) return null;
    const p0 = wb.min.clone(), p1 = wb.max.clone();
    S.room.worldToLocal(p0); S.room.worldToLocal(p1);
    const x0 = Math.min(p0.x, p1.x), x1 = Math.max(p0.x, p1.x);
    const y0 = Math.min(p0.y, p1.y), y1 = Math.max(p0.y, p1.y);
    /* 开洞比窗框每边大 18 cm（不然窗扇往里开会蹭墙），这圈缝必须用"面"盖住，
       而不是在洞口边上摆四条细线——那样只会多一圈线，缝还在。
       做法：四条宽带，从窗框外沿一直铺到洞口外 3 cm，贴在墙的室内一侧。 */
    const zIn = Math.min(p0.z, p1.z);
    const pad = 0.18, cover = pad + 0.05, dep = 0.10;
    const mat = new T.MeshStandardMaterial({ color: 0x8d9299, roughness: 0.95, metalness: 0 });
    const g = new T.Group(); g.name = 'window-surround';
    const put = (w, h, cx, cy) => {
      const m = new T.Mesh(new T.BoxGeometry(w, h, dep), mat);
      m.position.set(cx, cy, zIn + dep / 2 - 0.02);
      g.add(m);
    };
    const W = (x1 - x0) + cover * 2, H = (y1 - y0) + cover * 2;
    put(W, cover, (x0 + x1) / 2, y1 + cover / 2);   // 上
    put(W, cover, (x0 + x1) / 2, y0 - cover / 2);   // 下
    put(cover, H, x0 - cover / 2, (y0 + y1) / 2);   // 左
    put(cover, H, x1 + cover / 2, (y0 + y1) / 2);   // 右
    S.room.add(g);
    S.winSurround = g;
    /* 窗套是填缝用的实心框：全息勘察里再给它抽一遍边，窗边就会多出一圈叠在一起的线 */
    if (g) g.traverse(o => { o.userData.suHidden = true; });
    return g;
  }

  function cutSuWindowHole(win) {
    if (!S.room || !win || S.suHole) return null;
    const b = Core.boxOf(win);
    // 洞口要比窗框大一圈：只留 2 cm 的话，窗扇往里扫的第一格就会蹭到墙沿，
    // fitSashSwing 会把开角判成 0°（窗打不开）。留 18 cm，多出来的被窗套和窗帘遮住。
    const pad = 0.18;
    const x0 = b.box.min.x - pad, x1 = b.box.max.x + pad;
    const y0 = b.box.min.y - pad, y1 = b.box.max.y + pad;
    if (S.renderer) S.renderer.localClippingEnabled = true;
    const planes = [
      new T.Plane(new T.Vector3(-1, 0, 0), x0),
      new T.Plane(new T.Vector3(1, 0, 0), -x1),
      new T.Plane(new T.Vector3(0, -1, 0), y0),
      new T.Plane(new T.Vector3(0, 1, 0), -y1)
    ];
    const cut = [], hidden = [];
    const ex = 0.32;                                     // 洞口外扩：老宅自己的窗帘/帘盒紧贴着这一圈
    S.room.traverse(o => {
      if (!o.isMesh || !o.geometry) return;
      const ob = Core.boxOf(o);
      const onWall = ob.box.min.z < SU_HOUSE.wallZ + 0.6 && ob.box.max.z > SU_HOUSE.wallZ - 0.6;
      if (!onWall) return;
      const sz = ob.size;
      const thin = Math.min(sz.x, sz.z) < 0.12;
      // 整个落在洞口里的（老宅那扇假窗的窗台/窗框）直接藏掉，免得和序章的窗打架
      const inside = ob.box.min.x > x0 && ob.box.max.x < x1 && ob.box.min.y > y0 && ob.box.max.y < y1;
      // 紧贴洞口外沿的那一套（这扇假窗自己的帘子、帘盒、窗套、薄玻璃）也藏掉：
      // 不藏的话它们会浮在序章这扇窗前面 —— 尤其是那块半透明灰玻璃，会把整个窗外染成棕色
      const fringeX = 0.45, fringeY = 0.35;
      const cx = (ob.box.min.x + ob.box.max.x) / 2, cy = (ob.box.min.y + ob.box.max.y) / 2;
      const fringe = thin && cx > x0 - fringeX && cx < x1 + fringeX && cy > y0 - fringeY && cy < y1 + fringeY;
      const zf = (ob.box.min.z + ob.box.max.z) / 2;
      const cloth = sz.y > 1.5 && Math.min(sz.x, sz.z) < 0.32 &&
        cx > x0 - 1.15 && cx < x1 + 1.15 && cy > y0 - 0.55 && cy < y1 + 0.55 &&
        zf > SU_HOUSE.wallZ - 0.9 && zf < SU_HOUSE.wallZ + 0.9;
      /* 老宅这扇假窗的帘子是一整片 2.4×2.65 的布＋帘盒（Geom3D_858 那一组）：
         线框风格下它的折痕会变成横穿玻璃的斜线，像碎掉的铁丝网；藏掉它，换成我们自己搭的帘子。 */
      const drape = sz.y > 2.3 && Math.min(sz.x, sz.z) < 0.85 &&
        cx > x0 - 1.35 && cx < x1 + 1.35 &&
        zf > SU_HOUSE.wallZ - 1.0 && zf < SU_HOUSE.wallZ + 1.0;
      if (inside || fringe || cloth || drape) { o.visible = false; o.userData.suHidden = true; hidden.push(o.name || '(anon)'); return; }
      // 盖住洞口的墙：clone 材质挂裁切面
      const covers = ob.box.max.x > x0 && ob.box.min.x < x1 && ob.box.max.y > y0 && ob.box.min.y < y1;
      if (!covers) return;
      const clone = m => {
        const c = m.clone();
        c.clippingPlanes = planes; c.clipIntersection = true; c.needsUpdate = true;
        return c;
      };
      o.material = Array.isArray(o.material) ? o.material.map(clone) : clone(o.material);
      o.userData.suCut = true;
      cut.push(o.name || '(anon)');
    });
    S.suHole = { x0, x1, y0, y1, cut, hidden };
    return S.suHole;
  }

  /* 老宅的窗洞外头紧接着模型自己的另一间屋/外墙，于是「窗外」看到的是一面棕色墙。
     在窗玻璃外侧 0.3 m 贴一片和窗外大景同一份材质的面片当后景幕，把它挡掉；
     尺寸跟着窗走，换房/换窗都不用再手调。 */
  function addWindowBackdrop() {
    if (!S.windowGroup || !S.outdoorMat || S.windowBackdrop) return;
    const b = Core.boxOf(S.windowGroup);
    const geo = new T.PlaneGeometry(b.size.x * 1.18, b.size.y * 1.18);
    /* 窗外那套天空 shader 是按 22×13 m 的大幕写的；直接把同一份材质贴到 1.9×1.6 的小片上，
       uv 会被拉成「整片天空的一小块」，颜色糊成一片褐色。这里把 uv 换回真实的比例，
       取大幕中间偏上的一块，看上去和隔 8 m 看大幕是同一个天。 */
    const uv = geo.attributes.uv;
    const sx = (b.size.x * 1.18) / 22, sy = (b.size.y * 1.18) / 13;
    for (let i = 0; i < uv.count; i++) {
      uv.setXY(i, 0.42 + (uv.getX(i) - 0.5) * sx, 0.58 + (uv.getY(i) - 0.5) * sy);
    }
    uv.needsUpdate = true;
    /* 单独提亮这一片：克隆材质，但 uTime / uFlash 仍指回原材质的 uniform 对象，
       雨丝和闪电照旧同步动，只有 uGain 是自己的（远景大幕保持 1.0）。
       不提亮的话，蓝图/全息风格里窗外就是一块近黑的板。 */
    const src = S.outdoorMat;
    const mat = src.clone();
    mat.uniforms = Object.assign({}, mat.uniforms, {
      uTime: src.uniforms.uTime, uFlash: src.uniforms.uFlash,
      uRain: src.uniforms.uRain, uStar: src.uniforms.uStar,
      uGain: { value: 1.85 }
    });
    const m = new T.Mesh(geo, mat);
    m.name = '窗外后景幕';
    m.position.set(b.center.x, b.center.y, ANCHOR.window.cz + OUT_Z * 0.3);
    m.rotation.y = OUT_Z > 0 ? Math.PI : 0;
    m.renderOrder = -1;
    S.scene.add(m);
    S.windowBackdrop = m;
  }

  function applySuAnchors() {
    Object.assign(ANCHOR.window, SU_HOUSE.window);
    Object.assign(ANCHOR.cake, SU_HOUSE.cake);
  }

  function buildScene() {
    const roomEntry = S.roles.room;
    if (roomEntry) {
      S.room = roomEntry.obj;
      const decl = roomDecl(S.room);
      if (decl && decl.aligned) S.room.updateMatrixWorld(true);
      else place(S.room, ANCHOR.room);
      applyRoomAnchors(decl);
      S.roomDecl = decl;
      if (isSuHouse()) applySuAnchors();
      aimLights();
      S.scene.add(S.room);
      S.roomBox = Core.boxOf(S.room);
      // 老宅自带墙/地/顶，不需要再补一层外壳（补了会挡住模型自己的墙线）
      if (!isSuHouse()) addRoomEnvelope();
      addRoomLamps();
      addCurtainLining();
      setupCloth();
    }

    const winEntry = S.roles.window;
    if (winEntry) {
      S.windowGroup = winEntry.obj;
      place(S.windowGroup, ANCHOR.window);
      // 老宅的窗在南墙，窗子本来朝 -z 开；转 180° 让玻璃朝 +z、扇往里（-z）推
      if (isSuHouse()) {
        S.windowGroup.rotation.y = SU_HOUSE.window.yaw;
        S.windowGroup.updateMatrixWorld(true);
        place(S.windowGroup, ANCHOR.window);      // 转完 bbox 会漂，重新对齐一次
      }
      S.scene.add(S.windowGroup);
      /* 老宅的墙是实心的：先把洞挖出来，再判断窗扇能开多大 ——
         反过来的话射线会一路撞在实心墙上，开角被算成 0°（窗根本打不开）。 */
      if (isSuHouse()) cutSuWindowHole(S.windowGroup);
      setupSash(winEntry);
      fitSash();
      if (isSuHouse()) { addWindowBackdrop(); if (!fitWindowToHole(S.windowGroup, 0.18)) addWindowSurround(S.windowGroup); buildSuCurtains(S.windowGroup); fitSash(); }
      // 玻璃上的水珠要等窗子装好才有依附对象（addOutdoor 跑得比资产加载早）
      if (S.rainOn) addRainGlass();
    }

    const cakeEntry = S.roles.cake;
    if (cakeEntry) {
      // 默认是用户的 Blender 蛋糕；?cake=hero 换程序化蛋糕，?cake=user 换回旧的粉色蛋糕资产
      const wantHero = CAKE_KEY === 'hero';
      const bundled = cakeEntry.entry && cakeEntry.entry.source === 'sample';
      S.cake = (wantHero && bundled) ? makeHeroCake() : cakeEntry.obj;
      const chosenId = cakeEntry.entry && cakeEntry.entry.rec ? cakeEntry.entry.rec.id : null;
      if (chosenId === 'cake-blend30') prepareBlendCake(S.cake);
      if (!S.cake.userData.heroCake) refineUserCake(S.cake);
      let cb = place(S.cake, ANCHOR.cake);
      // 真实餐桌上有桌旗、盘子、花艺：找一块空桌面，贴着实际表面放
      // （老宅那张餐桌上同样摆着四份餐具，所以换房间后这一步照样要跑）
      const spot = fitCakeSpot(S.cake);
      /* 桌面清理：老宅那张餐桌上原本摆着汤碗、烤盘、茶壶一堆餐具。
         全息勘察下它们是实心深色块，压在蛋糕旁边像几摊墨 —— 这一段只留蛋糕和蜡烛，
         桌面干净，烛光才有地方"落"。 */
      if (spot && cb && cb.box) {
        const cx0 = cb.center.x, cz0 = cb.center.z;
        const cy0 = cb.box.min.y - 0.06, cy1 = cb.box.min.y + 0.20;
        S.room.traverse(o => {
          if (!o.isMesh || o.userData.suHidden) return;
          let p = o;
          while (p) { if (p === S.cake) return; p = p.parent; }
          const b = Core.boxOf(o);
          if (!b || !b.box) return;
          const bb = b.box;
          const cx = (bb.min.x + bb.max.x) / 2, cz = (bb.min.z + bb.max.z) / 2;
          const cy = (bb.min.y + bb.max.y) / 2;
          if (Math.abs(cx - cx0) > 0.62 || Math.abs(cz - cz0) > 0.62) return;
          if (cy < cy0 || cy > cy1) return;
          o.visible = false;
          o.userData.suHidden = true;
        });
      }
      if (spot) {
        S.cake.position.x += spot.x - cb.center.x;
        S.cake.position.z += spot.z - cb.center.z;
        S.cake.position.y += spot.y - cb.box.min.y;
        S.cake.updateMatrixWorld(true);
        cb = Core.boxOf(S.cake);
        Object.assign(ANCHOR.cake, { cx: cb.center.x, cz: cb.center.z, minY: cb.box.min.y });
      }
      S.cakeSpot = spot;
      S.scene.add(S.cake);
      S.cakeBox = cb;
      buildCandles(cb);
      addCakeAura(cb);
      if (window.ClimaxSystem) {
        window.ClimaxSystem.init(S, Core);
        window.ClimaxSystem.setupParents();
      }
      S.cakeView = fitCakeView(cb);
      aimLights();
    }

    tuneRoomMaterials();
    boostAnisotropy();
  }

  /* 窗扇：先试往房间里开（默认），扫到窗帘/摆件就看往外开能不能开得更大，取开得大的那个 */
  function fitSash() {
    if (!S.sash || !S.room) return;
    const inward = fitSashSwing();
    if (!inward) return;
    let best = inward;
    if (Math.abs(inward.safe) < Math.abs(inward.full) * 0.8) {
      const keep = S.sashTo;
      S.sashTo = S.sashFrom - (keep - S.sashFrom);
      const outward = fitSashSwing();
      S.sashTo = keep;
      if (outward && Math.abs(outward.safe) > Math.abs(inward.safe) + 0.1) best = outward;
    }
    // 开到 60° 以上才算「推开」；都不够就用能开到的最大角
    S.sashTo = S.sashFrom + best.safe * 0.96;
    S.sashFit = {
      inwardDeg: +(inward.safe / D2R).toFixed(1),
      chosenDeg: +((S.sashTo - S.sashFrom) / D2R).toFixed(1),
      fullDeg: +(inward.full / D2R).toFixed(1)
    };
  }

  /* 蛋糕镜头：理想机位在蛋糕前方偏左、略高往下看；被椅背/吊灯挡住就绕着蛋糕换角度、抬高 */
  function fitCakeView(cb) {
    const top = new T.Vector3(cb.center.x, cb.box.max.y + 0.01, cb.center.z);
    // 退远一点：原来贴到 0.4 m 才拍得下蛋糕，结果画面被蛋糕填满，
    // 奶油接缝、翻糖毛边全被放大，反而显丑。带上桌面和椅背反而好看。
    const ideal = new T.Vector3(-0.30, 0, 0.86 * -OUT_Z);
    const R0 = Math.hypot(ideal.x, ideal.z), az0 = Math.atan2(ideal.x, ideal.z);
    const look = new T.Vector3(cb.center.x, cb.box.max.y - 0.06, cb.center.z);
    if (!S.room) return { pos: new T.Vector3(cb.center.x - 0.30, 1.24, cb.center.z + 0.86 * -OUT_Z), target: look };
    const cands = [];
    for (const daz of [0, 20, -20, 40, -40, 65, -65, 95, -95, 180]) {
      for (const h of [1.24, 1.36, 1.5, 1.16, 1.62]) {
        for (const r of [R0, R0 * 1.22, R0 * 0.84]) {
          const az = az0 + daz * D2R;
          const pos = new T.Vector3(cb.center.x + Math.sin(az) * r, h, cb.center.z + Math.cos(az) * r);
          cands.push({ pos, cost: Math.abs(daz) / 40 + Math.abs(h - 1.24) * 2.2 + Math.abs(r - R0) * 1.5 });
        }
      }
    }
    cands.sort((p, q) => p.cost - q.cost);
    const hw = cb.size.x * 0.55, hd = cb.size.z * 0.55;
    const targets = [top,
      new T.Vector3(top.x - hw, top.y, top.z), new T.Vector3(top.x + hw, top.y, top.z),
      new T.Vector3(top.x, top.y, top.z - hd), new T.Vector3(top.x, top.y, top.z + hd)];
    const hit = pickView(cands, targets, { margin: 0.10, clearance: 0.14 });
    const pos = hit ? hit.pos : new T.Vector3(cb.center.x - 0.30, 1.24, cb.center.z + 0.86 * -OUT_Z);
    return { pos, target: look, blocked: !hit };
  }

  /* 房间里自带吊灯的话，按灯的位置补真实光源。
     名字约定：节点名/标签里带「吊灯」（餐厅就是这个），子节点（灯罩/灯芯）不重复算。 */
  const LAMP_RE = /吊灯|pendant|chandelier|sconce|壁灯/i;

  function addRoomLamps() {
    if (!S.room) return;
    const lamps = [];
    S.room.traverse(o => {
      if (!LAMP_RE.test((o.name || '') + ' ' + ((o.userData && o.userData.label) || ''))) return;
      for (let p = o.parent; p; p = p.parent) if (lamps.indexOf(p) >= 0) return;
      lamps.push(o);
    });
    S.roomLamps = [];
    if (!lamps.length) return;
    for (const lamp of lamps) {
      const b = Core.boxOf(lamp);
      const light = new T.PointLight(0xffb478, 1.55, 6.5, 2);
      light.position.set(b.center.x, Math.min(b.center.y, b.box.min.y + 0.02), b.center.z);
      S.scene.add(light);
      S.roomLamps.push(light);
    }
    // 房间从 4 m 的小屋换成 8 m 的餐厅以后，只靠吊灯，离开灯的地方会全黑，环境光抬一点
    if (S.hemi) S.hemi.intensity = 0.62;
    const bounce = new T.PointLight(0xffd2a8, 0.3, 9, 2);
    bounce.position.set(0.3, 2.6, 1.4);
    S.scene.add(bounce);
  }

  /* ============================================================= 布料（窗帘） */
  /* 房间资产里带 extras.cloth = { cols, rows } 的网格（或者名字就叫「窗帘」）会被当成一块布：
     verlet 质点 + 结构/剪切距离约束 + 一点「形状记忆」，风由穿堂风、闪电和室内气流驱动。
     顶边被帘杆钉住，布面朝室内（+z）鼓起。参数都在这张表里，动画不对就调这里。 */
  const CLOTH = {
    gravity: 9.6,      // m/s²
    wind: 8,           // 限制风力，窗帘保持在帘杆附近
    memory: 0.004,     // 每子步往原始褶皱形状回拉的比例
                       // （褶皱本身靠距离约束撑着：展平会把横向约束拉长 50% 以上）
    damp: 0.982,       // 速度阻尼
    iter: 3,           // 每子步的约束迭代次数
    sub: 2             // 每帧子步数
  };
  const CLOTH_NAME_RE = /窗帘|curtain|drape/i;

  function setupCloth() {
    S.cloths = [];
    if (!S.room) return;
    S.room.traverse(o => {
      const geo = o.geometry;
      if (!o.isMesh || !geo || !geo.attributes || !geo.attributes.position) return;
      const meta = (o.userData && o.userData.cloth) || null;
      const named = CLOTH_NAME_RE.test((o.name || '') + ' ' + ((o.userData && o.userData.label) || ''));
      if (!meta && !named) return;
      const c = makeCloth(o, meta || {});
      if (c) S.cloths.push(c);
    });
    if (S.cloths.length) window.__prologueCloths = S.cloths.length;
  }

  function makeCloth(mesh, meta) {
    const geo = mesh.geometry;
    const cols = Math.max(2, meta.cols || 6);
    const rows = Math.max(2, meta.rows || 10);
    const n = (cols + 1) * (rows + 1);
    const attr = geo.attributes.position;
    if (attr.count !== n) return null;          // 顶点数对不上：不是网格布，宁可不做
    const rest = new Float32Array(attr.array);
    const cur = new Float32Array(rest);
    const prev = new Float32Array(rest);

    const pinned = new Uint8Array(n);
    for (let c = 0; c <= cols; c++) pinned[c] = 1;   // 第 0 行挂在帘杆上

    const phase = new Float32Array(n);
    for (let p = 0; p < n; p++) {
      phase[p] = (p % (cols + 1)) * 0.85 + Math.floor(p / (cols + 1)) * 0.4;
    }

    // 约束：横/竖邻居 + 两条对角（抗剪切）
    const at = (r, c) => (r * (cols + 1) + c) * 3;
    const dist = (a, b) => Math.hypot(rest[a] - rest[b], rest[a + 1] - rest[b + 1], rest[a + 2] - rest[b + 2]);
    const triples = [];
    const add = (a, b) => triples.push(a, b, dist(a, b));
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        if (c < cols) add(at(r, c), at(r, c + 1));
        if (r < rows) add(at(r, c), at(r + 1, c));
        if (c < cols && r < rows) { add(at(r, c), at(r + 1, c + 1)); add(at(r, c + 1), at(r + 1, c)); }
      }
    }

    // 别穿进后墙：拿原始形状的最小 z 当墙
    let minZ = Infinity;
    for (let i = 2; i < rest.length; i += 3) if (rest[i] < minZ) minZ = rest[i];
    minZ -= 0.015;

    mesh.frustumCulled = false;   // 布会动，静态包围球不可靠
    return {
      mesh, geo, cols, rows, n, rest, cur, prev, pinned, phase,
      links: new Float32Array(triples), minZ
    };
  }

  function stepCloth(c, dt, wind, t) {
    const { n, rest, cur, prev, pinned, phase, links, minZ } = c;
    const h = Math.min(dt, 0.034) / CLOTH.sub;
    const hh = h * h;

    for (let s = 0; s < CLOTH.sub; s++) {
      for (let p = 0; p < n; p++) {
        if (pinned[p]) continue;
        const i = p * 3;
        const mem = CLOTH.memory;
        const vx = (cur[i] - prev[i]) * CLOTH.damp;
        const vy = (cur[i + 1] - prev[i + 1]) * CLOTH.damp;
        const vz = (cur[i + 2] - prev[i + 2]) * CLOTH.damp;
        prev[i] = cur[i]; prev[i + 1] = cur[i + 1]; prev[i + 2] = cur[i + 2];

        // 每个质点相位不同：风像一阵一阵扫过布面
        const f = wind * (0.55 + 0.45 * Math.sin(t * 3.1 + phase[p]) * Math.sin(t * 1.7 + phase[p] * 0.7));

        cur[i] += vx + (rest[i] - cur[i]) * mem;
        cur[i + 1] += vy - CLOTH.gravity * hh + (rest[i + 1] - cur[i + 1]) * mem;
        cur[i + 2] += vz + f * CLOTH.wind * hh + (rest[i + 2] - cur[i + 2]) * mem;
        /* 只允许在窗框内小幅摆动：x 不横向逃逸，z 不被风吹出室内。 */
        cur[i] = Math.max(rest[i] - 0.08, Math.min(rest[i] + 0.08, cur[i]));
        cur[i + 2] = Math.max(minZ, Math.min(rest[i + 2] + 0.16, cur[i + 2]));
      }

      for (let it = 0; it < CLOTH.iter; it++) {
        for (let k = 0; k < links.length; k += 3) {
          const a = links[k], b = links[k + 1], d0 = links[k + 2];
          const dx = cur[b] - cur[a], dy = cur[b + 1] - cur[a + 1], dz = cur[b + 2] - cur[a + 2];
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
          const diff = (d - d0) / d;
          const pa = pinned[a / 3], pb = pinned[b / 3];
          const wa = pa ? 0 : (pb ? 1 : 0.5);
          const wb = pb ? 0 : (pa ? 1 : 0.5);
          cur[a] += dx * diff * wa; cur[a + 1] += dy * diff * wa; cur[a + 2] += dz * diff * wa;
          cur[b] -= dx * diff * wb; cur[b + 1] -= dy * diff * wb; cur[b + 2] -= dz * diff * wb;
        }
      }

      for (let p = 0; p < n; p++) {
        const z = p * 3 + 2;
        if (cur[z] < minZ) cur[z] = minZ;
      }
    }

    c.geo.attributes.position.array.set(cur);
    c.geo.attributes.position.needsUpdate = true;
    c.geo.computeVertexNormals();
    if (c.geo.attributes.normal) c.geo.attributes.normal.needsUpdate = true;
  }

  function setupSash(entry) {
    const it = entry.rec && entry.rec.interaction;
    let sash = null;
    if (it && it.part) sash = Core.findByPath(S.windowGroup, it.part);
    if (!sash) {
      S.windowGroup.traverse(o => {
        if (sash) return;
        const s = ((o.name || '') + ' ' + ((o.userData && o.userData.label) || '')).toLowerCase();
        if (/sash|窗扇|leaf|casement/.test(s)) sash = o;
      });
    }
    if (sash) {
      S.sash = sash;
      sash.userData.interactionId = 'window';
      S.sashAxis = (it && it.axis) || 'y';
      S.sashFrom = sash.rotation[S.sashAxis];
      /* 老宅里这扇窗被转了 180°（玻璃朝南、扇往 -z 推），父级转半圈后同一个局部角度
         在世界里会朝反方向甩 —— 所以开合量取反，扇子才是往屋里开。 */
      const amount = (it && it.amount != null ? it.amount : -105) * (isSuHouse() ? -1 : 1);
      S.sashTo = S.sashFrom + amount * D2R;
    }
  }

  function heroMaterial(color, roughness = 0.6) {
    return new T.MeshStandardMaterial({ color, roughness, metalness: 0, envMapIntensity: 0.35 });
  }

  // The bundled AI cake is useful in the workbench, but its baked texture is
  // visibly lumpy at the close prologue camera. Build a clean hero cake here:
  // even layers, soft icing, a ceramic plate, and a few restrained berries.
  function makeHeroCake() {
    const g = new T.Group();
    g.name = '序章蛋糕（精修）';
    const plate = new T.Mesh(new T.CylinderGeometry(0.185, 0.20, 0.026, 64), heroMaterial(0xf1eee7, 0.28));
    plate.position.y = 0.013;
    g.add(plate);

    const sponge = new T.Mesh(new T.CylinderGeometry(0.155, 0.165, 0.105, 64, 4), heroMaterial(0xb86c52, 0.58));
    sponge.position.y = 0.078;
    g.add(sponge);
    const filling = new T.Mesh(new T.CylinderGeometry(0.162, 0.162, 0.024, 64), heroMaterial(0xffe0c6, 0.48));
    filling.position.y = 0.137;
    g.add(filling);
    const icing = new T.Mesh(new T.CylinderGeometry(0.166, 0.158, 0.052, 64, 3), heroMaterial(0xffc5c2, 0.44));
    icing.position.y = 0.175;
    g.add(icing);
    const top = new T.Mesh(new T.CylinderGeometry(0.148, 0.148, 0.018, 64), heroMaterial(0xffe4d6, 0.38));
    top.position.y = 0.209;
    g.add(top);

    const edge = new T.Mesh(new T.TorusGeometry(0.158, 0.012, 10, 64), heroMaterial(0xffb8b5, 0.46));
    edge.rotation.x = Math.PI / 2;
    edge.position.y = 0.146;
    g.add(edge);
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * Math.PI * 2 + 0.2;
      const berry = new T.Mesh(new T.SphereGeometry(0.012, 16, 10), heroMaterial(i % 2 ? 0x9d3d4f : 0xd46b65, 0.38));
      berry.position.set(Math.cos(a) * 0.118, 0.224 + (i % 3) * 0.004, Math.sin(a) * 0.118);
      g.add(berry);
    }
    g.userData.heroCake = true;
    return g;
  }

  function makeHeroCandle(height = 0.14) {
    const g = new T.Group();
    g.name = '蜡烛（精修）';
    const wax = new T.Mesh(new T.CylinderGeometry(0.016, 0.017, height, 24), heroMaterial(0xf5e7c9, 0.42));
    wax.position.y = height / 2 - 0.006;
    g.add(wax);
    const collar = new T.Mesh(new T.TorusGeometry(0.022, 0.004, 8, 20), heroMaterial(0xc38a49, 0.36));
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 0.005;
    g.add(collar);
    const wick = new T.Mesh(new T.CylinderGeometry(0.0022, 0.0022, 0.012, 8), heroMaterial(0x3b2b25, 0.95));
    wick.position.y = height + 0.001;
    g.add(wick);
    const flame = makeFlameGroup(height + 0.001);
    flame.visible = false;
    g.add(flame);
    g.userData.heroCandle = true;
    return g;
  }

  function refineUserCake(cake) {
    // Preserve the user's pink cake mesh and texture, but remove the hard,
    // metallic-looking response that made the baked surface read as lumpy.
    cake.traverse(o => {
      if (!o.isMesh) return;
      if (o.geometry && o.geometry.computeVertexNormals) o.geometry.computeVertexNormals();
      o.castShadow = true;
      o.receiveShadow = true;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of mats) {
        if (!m) continue;
        if ('flatShading' in m) m.flatShading = false;
        if ('metalness' in m) m.metalness = 0;
        if ('roughness' in m) m.roughness = Math.max(0.72, m.roughness || 0);
        if ('clearcoat' in m) m.clearcoat = 0;
        if ('envMapIntensity' in m) m.envMapIntensity = Math.min(0.25, m.envMapIntensity || 0);
        // The supplied bake has high-frequency speckle that reads as dents at
        // the close camera. A very small local blur keeps its pink character
        // while restoring a smooth icing response.
        const image = m.map && m.map.image;
        if (image && image.width && image.height && !m.map.userData?.softened) {
          try {
            const c = document.createElement('canvas');
            c.width = image.width; c.height = image.height;
            const g = c.getContext('2d');
            g.filter = 'blur(1.1px)';
            g.drawImage(image, 0, 0, c.width, c.height);
            const soft = new T.CanvasTexture(c);
            soft.colorSpace = T.SRGBColorSpace;
            soft.wrapS = m.map.wrapS; soft.wrapT = m.map.wrapT;
            soft.repeat.copy(m.map.repeat); soft.offset.copy(m.map.offset);
            soft.userData = { softened: true };
            m.map = soft;
          } catch (_) { /* keep the original map on restricted canvases */ }
        }
        m.needsUpdate = true;
      }
    });
  }

  function buildCandles(cakeBox) {
    const entry = S.roles.candle;
    // Clone from a pristine source each time. Mutating entry.obj for the first
    // candle and then cloning it was the reason later candles drifted upward.
    const source = entry && entry.entry && entry.entry.source !== 'sample' ? entry.obj.clone(true) : null;
    const topY = cakeBox.box.max.y;
    const horiz = Math.max(cakeBox.size.x, cakeBox.size.z);
    const half = horiz / 2;

    /* 原文是 14 支：外圈 8 + 内圈 6，角度错开半格，才像"插满"而不是"点了三根"。 */
    const layout = [];
    for (let i = 0; i < 8; i++) layout.push({ deg: i * 45 + 22.5, r: 0.68 });
    for (let i = 0; i < 6; i++) layout.push({ deg: i * 60, r: 0.34 });

    /* 粗细要像生日蜡烛。原来按蛋糕高度归一化，出来是 2 cm 粗、12 cm 高的
       「柱蜡」，14 根插上去像神龛不像蛋糕。现在：高度降到 8~9 cm，
       再把横向压到 0.55（高度不变），一步解决比例问题。 */
    const candleH = Math.max(0.075, Math.min(0.10, horiz * 0.21));
    const slim = 0.55;

    /* 蛋糕顶是拱起来的，用包围盒顶端统一放会让边上的蜡烛悬空。
       逐支往下打射线，落到真实奶油表面。 */
    const rc = new T.Raycaster();
    const surfaceAt = (x, z) => {
      rc.set(new T.Vector3(x, topY + 0.4, z), new T.Vector3(0, -1, 0));
      rc.near = 0; rc.far = 0.9;
      const h = rc.intersectObject(S.cake, true).filter(q => q.object.isMesh)[0];
      return h ? h.point.y : null;
    };

    for (let i = 0; i < layout.length; i++) {
      const cell = layout[i];
      let obj;
      if (source) {
        obj = source.clone(true);
        place(obj, { max: candleH });
      } else {
        obj = makeHeroCandle(candleH);
      }
      // 只压横向，高度保持 candleH
      obj.scale.x *= slim;
      obj.scale.z *= slim;
      obj.updateMatrixWorld(true);
      const a = cell.deg * D2R;
      const x = cakeBox.center.x + Math.cos(a) * half * cell.r;
      const z = cakeBox.center.z + Math.sin(a) * half * cell.r;
      const b = Core.boxOf(obj);
      obj.position.x += x - b.center.x;
      obj.position.z += z - b.center.z;
      // 贴面：优先用射线打到的真实表面，打不到才退回包围盒顶端
      const surf = surfaceAt(x, z);
      obj.position.y += (surf != null ? surf : topY) - b.box.min.y - 0.006;
      obj.updateMatrixWorld(true);
      S.scene.add(obj);

      // 火苗：找不到就把整支蜡烛当作可点亮对象
      const flames = [];
      obj.traverse(o => {
        const s = ((o.name || '') + ' ' + ((o.userData && o.userData.label) || '')).toLowerCase();
        if (/flame|火苗|fire/.test(s)) flames.push(o);
      });
      /* 素材自带的火苗是圆锥（没有渐变、没有光晕）。换成 sprite 火苗组，
         位置沿用原圆锥的局部坐标；原圆锥保持 visible=false 只当锚点。 */
      const flameParts = [];
      for (let k = 0; k < flames.length; k++) {
        const old = flames[k];
        if (!old.userData.isFlame && old.geometry) {
          const fg = makeFlameGroup(0);
          fg.position.copy(old.position);
          fg.position.y += 0.014;
          fg.visible = false;
          old.parent.add(fg);
          old.visible = false;          // 原圆锥只当锚点，不能留在场景里（不然多出一根亮针）
          flames[k] = fg;
        }
        const f = flames[k];
        f.visible = false;
        f.userData.__f0 = f.scale.clone();
        for (const p of (f.userData.parts || [])) flameParts.push(p);
      }

      /* 14 支蜡烛各配一个 PointLight 会让着色器爆炸（每盏灯都是逐像素开销），
         所以只给每隔 5 支的真蜡烛配灯，其余用哑对象占位（intensity 恒为 0）。 */
      const lit = i % 5 === 0;
      const light = lit ? new T.PointLight(0xffb066, 0, 2.6, 2) : { intensity: 0 };
      if (lit) {
        const fb = Core.boxOf(obj);
        light.position.set(fb.center.x, fb.box.max.y + 0.02, fb.center.z);
        S.scene.add(light);
      }

      // 不可见的点击代理：蜡烛很细，直接点蜡身很容易点空
      const proxy = new T.Mesh(
        new T.CylinderGeometry(0.045, 0.045, candleH * 1.6, 8),
        new T.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
      );
      proxy.name = '__hit';
      proxy.position.y = candleH * 0.5;
      obj.add(proxy);

      S.candles.push({ obj, flames, flameParts, light, proxy, lit: false, phase: Math.random() * 6.28 });
    }
  }

  function makeFallbackCandle(h) {
    const g = new T.Group();
    const wax = new T.Mesh(
      new T.CylinderGeometry(0.013, 0.013, h, 16),
      new T.MeshStandardMaterial({ color: 0xf2e4c8, roughness: 0.55 })
    );
    wax.position.y = h / 2;
    const flame = makeFlameGroup(h + 0.001);
    flame.visible = false;
    g.add(wax, flame);
    return g;
  }

  /* 用户松手后自动归位：6 秒无操作就回到当前这一幕的既定机位。
     没有这个机制时，随便滚一下滚轮就会被困在吊灯/墙角，剧情节拍也接不回去。 */
  let camReturnTimer = null;
  function cancelCameraReturn() {
    if (camReturnTimer) { clearTimeout(camReturnTimer); camReturnTimer = null; }
  }
  function authoredView() {
    if (S.stage === 'cake' || S.stage === 'opening') {
      if (S.cakeView) return { pos: S.cakeView.pos, target: S.cakeView.target };
    }
    return { pos: S.homePos, target: S.homeTarget };
  }
  function scheduleCameraReturn() {
    cancelCameraReturn();
    camReturnTimer = setTimeout(() => {
      camReturnTimer = null;
      if (!S.userCamera || S.stage === 'boot' || S.stage === 'enter') return;
      const v = authoredView();
      if (!v || !v.pos || !v.target) return;
      moveCamera(v.pos.toArray(), v.target.toArray(), 1400);
    }, 6000);
  }

  /* =============================================================== 相机 */

  function moveCamera(pos, target, dur = 1600) {
    cancelCameraReturn();
    if (S.camTweenStop) S.camTweenStop();
    S.userCamera = false;
    if (S.controls) S.controls.enabled = false;
    if (reduceMotion) {
      S.camBase.pos.set(pos[0], pos[1], pos[2]);
      S.camBase.target.set(target[0], target[1], target[2]);
      if (S.controls) {
        S.controls.target.copy(S.camBase.target);
        S.controls.enabled = true;
      }
      return;
    }
    const p0 = S.camBase.pos.clone(), t0 = S.camBase.target.clone();
    const p1 = new T.Vector3(pos[0], pos[1], pos[2]);
    const t1 = new T.Vector3(target[0], target[1], target[2]);
    S.camTweenStop = Core.tween({
      from: 0, to: 1, dur, ease: Core.easeInOutCubic,
      onUpdate: k => {
        S.camBase.pos.lerpVectors(p0, p1, k);
        S.camBase.target.lerpVectors(t0, t1, k);
      },
      onDone: () => {
        if (S.controls) {
          S.controls.target.copy(t1);
          S.controls.enabled = true;
        }
      }
    });
  }

  /* =============================================================== 声音 */

  /* =============================================================== 开场文本 */

  /* 故事的前两段（原文）。想改文案只改这里。 */
  const STORY = [
    '今天是我的生日，直到晚上爸爸妈妈点上了生日蛋糕的蜡烛，我们三个围着十四个小火苗坐下来，我才想起这事。',
    '这是个雷雨之夜，整个宇宙似乎是由密集的闪电和我们的小屋组成。'
  ];

  /* =============================================================== 声音 */

  /* 打字机按键声：极短的带通噪声 + 一点低频"咔"。每一下音高略有随机，才不像电子音。 */
  function keyClick(strength = 1) {
    const ctx = S.audio;
    if (!ctx || !S.soundOn || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    const n = Math.max(64, Math.floor(ctx.sampleRate * 0.022));
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 2000 + Math.random() * 1100;
    bp.Q.value = 1.8;
    const g = ctx.createGain(); g.gain.value = 0.16 * strength;
    src.connect(bp).connect(g).connect(ctx.destination);
    src.start(t);
    const o = ctx.createOscillator(); o.type = 'square';
    o.frequency.value = 118 + Math.random() * 46;
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.05 * strength, t);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
    o.connect(og).connect(ctx.destination);
    o.start(t); o.stop(t + 0.06);
  }

  /* 脚步声：低频闷响（体重落地）+ 一层短噪声（地板/地毯摩擦） */
  function footstep(strength = 1) {
    const ctx = S.audio;
    if (!ctx || !S.soundOn || ctx.state !== 'running') return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(88, t);
    o.frequency.exponentialRampToValueAtTime(46, t + 0.17);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.2 * strength, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.23);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + 0.25);

    const n = Math.max(64, Math.floor(ctx.sampleRate * 0.07));
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.4);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 820;
    const ng = ctx.createGain(); ng.gain.value = 0.1 * strength;
    src.connect(lp).connect(ng).connect(ctx.destination);
    src.start(t);
  }

  /* 序曲浮现：低音铺底，随字号放大一起淡出 */
  function overtureSwell() {
    const ctx = S.audio;
    if (!ctx || !S.soundOn || ctx.state !== 'running') return;
    playTone([110, 164.8, 220], 3.2, 0.045);
  }

  /* 浏览器要用户手势才允许出声：第一次点击/按键时解锁 */
  function unlockAudio() {
    const ctx = audioCtx();
    if (ctx && ctx.state === 'suspended') { ctx.resume(); }
    const hint = $('#introSound');
    if (hint) hint.classList.remove('show');
  }

  function audioCtx() {
    if (S.audio) return S.audio;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    try {
      S.audio = new Ctx();
      // 电影级高保真雨夜复合音效：多层粉红噪声 + 随机密集雨滴击窗水滴物理脉冲 (Window Patter Drops)
      const len = S.audio.sampleRate * 4;
      const buf = S.audio.createBuffer(2, len, S.audio.sampleRate);
      const left = buf.getChannelData(0);
      const right = buf.getChannelData(1);
      
      // 双通道布朗/粉红噪声生成微风细雨背景
      let b0L = 0, b1L = 0, b2L = 0;
      let b0R = 0, b1R = 0, b2R = 0;
      for (let i = 0; i < len; i++) {
        const whiteL = Math.random() * 2 - 1;
        b0L = 0.99886 * b0L + whiteL * 0.0555179;
        b1L = 0.99332 * b1L + whiteL * 0.0750759;
        b2L = 0.96900 * b2L + whiteL * 0.1538520;
        left[i] = (b0L + b1L + b2L) * 0.18;

        const whiteR = Math.random() * 2 - 1;
        b0R = 0.99886 * b0R + whiteR * 0.0555179;
        b1R = 0.99332 * b1R + whiteR * 0.0750759;
        b2R = 0.96900 * b2R + whiteR * 0.1538520;
        right[i] = (b0R + b1R + b2R) * 0.18;

        // 真实水滴密集拍打玻璃瞬态小脉冲 (Patter on glass)
        if (Math.random() < 0.0035) {
          const dropAmp = (Math.random() * 0.28 + 0.12) * (Math.random() < 0.5 ? 1 : -1);
          left[i] += dropAmp;
          if (i + 1 < len) left[i + 1] -= dropAmp * 0.65;
          if (i + 2 < len) left[i + 2] += dropAmp * 0.32;
        }
        if (Math.random() < 0.0035) {
          const dropAmp = (Math.random() * 0.28 + 0.12) * (Math.random() < 0.5 ? 1 : -1);
          right[i] += dropAmp;
          if (i + 1 < len) right[i + 1] -= dropAmp * 0.65;
          if (i + 2 < len) right[i + 2] += dropAmp * 0.32;
        }
      }
      const src = S.audio.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const lp = S.audio.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1450;
      const gain = S.audio.createGain();
      gain.gain.value = 0.42;
      src.connect(lp).connect(gain).connect(S.audio.destination);
      src.start();
      S.rainGain = gain;
    } catch (err) {
      S.audio = null;
    }
    return S.audio;
  }

  function playTone(freqs, dur = 0.9, vol = 0.12) {
    const ctx = S.audio;
    if (!ctx || !S.soundOn) return;
    const t = ctx.currentTime;
    for (const f of freqs) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + dur + 0.05);
    }
  }

  /* ============================================================ 生日歌
     现场合成的《生日快乐》音乐盒（src/music.js → window.SLMusic）。
     一句 6 拍 @84BPM，整首四句 24 拍 ≈ 17 秒，唱完自动接回第一句。
     时间线：点第三支蜡烛时起 → 光球穿墙时扭成变形段 → 白光爆闪那一刻硬切。 */
  const MUSIC_VOL = 0.42;

  function startBirthdayMusic() {
    if (!window.SLMusic) return null;
    const ctx = audioCtx();
    if (!ctx) return null;
    if (ctx.state === 'suspended') ctx.resume();
    if (!S.music) {
      try {
        S.music = window.SLMusic.create(ctx);
      } catch (err) {
        S.music = null;
        return null;
      }
      S.music.setVolume(S.soundOn ? MUSIC_VOL : 0.0001);
    }
    S.music.start();
    return S.music;
  }

  /* 声音开关：雨声之外，音乐盒也跟着一起关 */
  function setBirthdayVolume(on) {
    if (S.music) S.music.setVolume(on ? MUSIC_VOL : 0.0001);
  }

  function thunder() {
    const ctx = S.audio;
    if (!ctx || !S.soundOn) return;
    try {
      // 电影级多段复合滚雷：近距撕裂爆鸣 + 次声波空气共振 + 远山低频回响
      const now = ctx.currentTime;
      const dur = 4.2;
      const buf = ctx.createBuffer(2, ctx.sampleRate * dur, ctx.sampleRate);
      const l = buf.getChannelData(0);
      const r = buf.getChannelData(1);

      // 初段瞬态雷击放电爆裂
      for (let i = 0; i < buf.length; i++) {
        const timeSec = i / ctx.sampleRate;
        const env = Math.exp(-timeSec * 0.9) * (1 + 0.4 * Math.sin(timeSec * 5.2));
        const rumble = (Math.random() * 2 - 1) * env;
        l[i] = rumble * (1.0 + 0.15 * Math.sin(timeSec * 12));
        r[i] = rumble * (1.0 - 0.15 * Math.sin(timeSec * 12));
      }

      const src = ctx.createBufferSource();
      src.buffer = buf;

      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(620, now);
      lp.frequency.exponentialRampToValueAtTime(75, now + dur);

      const subOsc = ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(72, now);
      subOsc.frequency.exponentialRampToValueAtTime(34, now + 2.5);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.35, now + 0.08);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
      subOsc.connect(subGain).connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 3.2);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.85, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + dur);

      src.connect(lp).connect(g).connect(ctx.destination);
      src.start();
    } catch (err) { /* 忽略 */ }
  }

  /* =============================================================== 交互 */

  function rayHitTargets() {
    const list = [];
    if (S.windowGroup) list.push(S.windowGroup);
    for (const c of S.candles) list.push(c.obj);
    const parents = S.scene.getObjectByName('family-parents');
    if (parents) list.push(parents);
    // 灾后调查段的微光球也要能被点中：把它们并入射线目标
    if (AFTERMATH.on && AFTERMATH.proxies.length) list.push(...AFTERMATH.proxies);
    return list;
  }

  function pick(ev) {
    const rect = S.renderer.domElement.getBoundingClientRect();
    S.pointer.set(((ev.clientX - rect.left) / rect.width) * 2 - 1, -((ev.clientY - rect.top) / rect.height) * 2 + 1);
    S.raycaster.setFromCamera(S.pointer, S.camera);
    const hits = S.raycaster.intersectObjects(rayHitTargets(), true).filter(h => visibleChain(h.object));
    return hits.length ? hits[0].object : null;
  }

  function visibleChain(o) {
    let c = o;
    while (c) { if (c.visible === false) return false; c = c.parent; }
    return true;
  }

  function isInWindow(obj) {
    let c = obj;
    while (c) { if (c === S.windowGroup) return true; c = c.parent; }
    return false;
  }

  function candleOf(obj) {
    for (const c of S.candles) {
      let p = obj;
      while (p) { if (p === c.obj) return c; p = p.parent; }
    }
    return null;
  }

  function onPointerDown(ev) {
    if (S.stage === 'boot' || S.stage === 'enter') return;
    audioCtx();
    const obj = pick(ev);
    const inWindow = !!(obj && isInWindow(obj));
    const candle = !!(obj && candleOf(obj));
    // Orbiting and prop interaction should never fight for the same drag.
    if (S.controls) S.controls.enabled = !inWindow && !candle;
    S.drag = {
      x: ev.clientX, t: performance.now(),
      hit: obj,
      inWindow,
      startAngle: S.sash ? S.sash.rotation[S.sashAxis] : 0,
      moved: false
    };
    if (S.drag.inWindow) S.renderer.domElement.style.cursor = 'grabbing';
  }

  function onPointerMove(ev) {
    // 视差
    const nx = (ev.clientX / innerWidth - 0.5) * 2;
    const ny = (ev.clientY / innerHeight - 0.5) * 2;
    S.parallaxTarget.set(nx * 0.055, -ny * 0.03, 0);

    if (S.drag && S.drag.inWindow && S.sash) {
      const dx = ev.clientX - S.drag.x;
      if (Math.abs(dx) > 4) S.drag.moved = true;
      if (S.drag.moved) {
        // 用「开关进度」算，方向由 sashTo 的符号决定（这间房往外开，内置房间往内开都能拖）
        const span = Math.abs(S.sashTo - S.sashFrom) || Math.PI / 2;
        const dir = (S.sashTo - S.sashFrom) < 0 ? -1 : 1;
        const p0 = (S.drag.startAngle - S.sashFrom) * dir / span;
        const p = Core.clamp(p0 + dx / 280, -0.18, 1.06);   // 关过头 18%、开到过冲 6%
        const a = S.sashFrom + dir * span * p;
        S.sash.rotation[S.sashAxis] = a;
        S.open = Core.clamp(Math.abs(a - S.sashFrom) / span, 0, 1);
      }
      return;
    }

    // 悬停提示
    const now = performance.now();
    if (now - S.hoverCheck < 90) return;
    S.hoverCheck = now;
    const obj = pick(ev);
    const cursor = obj ? 'pointer' : (S.stage === 'window' ? 'default' : 'default');
    S.renderer.domElement.style.cursor = cursor;
  }

  function onPointerUp(ev) {
    if (!S.drag) return;
    const drag = S.drag;
    S.drag = null;
    if (S.controls && !S.userCamera) S.controls.enabled = true;
    S.renderer.domElement.style.cursor = 'default';
    const dt = performance.now() - drag.t;
    const span = Math.abs(S.sashTo - S.sashFrom) || Math.PI / 2;

    if (drag.inWindow && S.sash) {
      if (drag.moved) {
        const a = S.sash.rotation[S.sashAxis];
        setSash(Math.abs(a - S.sashFrom) > span * 0.45);
        return;
      }
      if (dt < 700) setSash(Math.abs(S.sash.rotation[S.sashAxis] - S.sashFrom) < span * 0.5);
      return;
    }

    const obj = pick(ev);
    if (!obj) return;
    if (S.stage === 'aftermath' && investigateAftermath(obj)) return;
    if (window.ClimaxSystem && window.ClimaxSystem.isWhiteHairTarget(obj)) {
      window.ClimaxSystem.onWhiteHairTrigger();
      return;
    }
    if (window.ClimaxSystem && window.ClimaxSystem.isStoneParentTarget && window.ClimaxSystem.isStoneParentTarget(obj)) {
      window.ClimaxSystem.onStoneParentTrigger(obj);
      return;
    }
    const c = candleOf(obj);
    if (c) { lightCandle(c); return; }
    if (isInWindow(obj)) setSash(S.open < 0.5);
  }

  /* ============================================================= 窗扇开合 */

  function setSash(open) {
    if (S.stage === 'boot' || S.stage === 'enter') return;
    if (!S.sash) {
      // 没有独立窗扇：仍然推进剧情，让光进来
      S.open = open ? 1 : 0;
      onWindowOpened(open);
      return;
    }
    const from = S.sash.rotation[S.sashAxis];
    const to = open ? S.sashTo : S.sashFrom;
    if (S.sashTween) S.sashTween();
    S.sashTween = Core.tween({
      from, to, dur: reduceMotion ? 1 : 900, ease: Core.easeOutCubic,
      onUpdate: v => {
        S.sash.rotation[S.sashAxis] = v;
        const p = Core.clamp(Math.abs(v - S.sashFrom) / (Math.abs(S.sashTo - S.sashFrom) || 1), 0, 1);
        S.open = p;
        /* 窗扇推到 55% 就把镜头一起带走：开窗和转场是同一口气，而不是先开完再空等再飞过去 */
        if (open && p >= 0.55 && !S.cakeCued && S.stage === 'window') {
          S.cakeCued = true;
          S.stage = 'opening';
          windowBurst();
          setTimeout(() => { if (S.stage === 'opening') goCake(); }, 220);
        }
      },
      onDone: () => onWindowOpened(open)
    });
  }

  function windowBurst() {
    if (S.openedFx) return;
    S.openedFx = true;
    flashNow(0.85);
    S.gust = 1.1;                 // 推开窗的那一下：一阵大风把窗帘掀起来
    thunder();
    playTone([174.6, 261.6, 349.2], 1.6, 0.05);
    showHint('');
    if (S.windowShaft) {
      Core.tween({ from: 0, to: 2.6, dur: 1600, ease: Core.easeOutCubic, onUpdate: v => { S.windowShaft.intensity = v; } });
    }
  }

  function onWindowOpened(open) {
    if (open && (S.stage === 'window' || S.stage === 'opening')) {
      S.stage = 'opening';
      windowBurst();
      // 推开窗之后停一会儿：风、雷、窗帘掀起来（「序曲」两个字不再在这里，见 revealRoom）
      setTimeout(() => goCake(), reduceMotion ? 400 : 1000);
    } else if (!open && (S.stage === 'cake' || S.stage === 'opening')) {
      // 允许把窗再关上，但剧情不回退
    }
  }

  function goCake(instant = false) {
    if (S.stage === 'cake' || S.stage === 'enter' || S.stage === 'turn') return;
    S.cakeCued = false;
    const cv = S.cakeView;
    if (!cv) {
      // 没有蛋糕机位时退回老路径
      S.stage = 'cake';
      moveCamera([0.3, 1.25, 0.2], [0.3, 1.1, -0.9], 2600);
      return;
    }
    S.outsideLight.intensity = 1.35;
    if (S.ballGlow) S.ballGlow.material.opacity = 0.55;
    // 转身那一幕：镜头绕桌子走弧到蛋糕视角，房间随之展开（脚步声在 revealRoom 里）
    revealRoom(instant);
    if (S.dust) Core.tween({ from: 0, to: 1, dur: 1500, onUpdate: v => { S.dust.material.opacity = v * 0.55; } });
  }

  /* =============================================================== 点蜡烛 */

  /* 单支蜡烛"点着"。
     火苗不能 tween sprite.scale（animate() 每帧都会把粒子尺寸写回去，两个写入者会打架），
     所以走 candle.flameGain：animate 里拿它乘粒子尺寸和透明度。
     烛光同理走 candle.gain，乘在 S.candleGlow 上。 */
  function igniteCandle(candle, { grow = 520, pop = false } = {}) {
    if (!candle || candle.lit) return;
    candle.lit = true;
    candle.gain = 0;
    candle.flameGain = 0.001;
    for (const f of candle.flames) {
      f.visible = true;
      if (!f.userData.__f0) f.userData.__f0 = f.scale.clone();
    }
    Core.tween({ from: 0, to: 1, dur: grow, ease: Core.easeOutCubic,
      onUpdate: v => { candle.flameGain = Math.max(0.001, v); } });
    Core.tween({ from: 0, to: 1, dur: grow + 220, ease: Core.easeOutCubic,
      onUpdate: v => { candle.gain = v; } });
    if (pop) playTone([1250 + Math.random() * 420], 0.07, 0.016);
  }

  /* 十四支一起"啪"地全亮，像开灯不像点蜡烛。让火从点着的那支开始，由近及远一支接一支传过去。 */
  function sweepCandles(from) {
    S.candleTimers = S.candleTimers || [];
    const origin = new T.Vector3();
    if (from && from.obj) from.obj.getWorldPosition(origin);
    const pa = new T.Vector3();
    const rest = S.candles
      .filter(c => c !== from && !c.lit)
      .sort((a, b) => {
        a.obj.getWorldPosition(pa);
        const da = pa.distanceToSquared(origin);
        b.obj.getWorldPosition(pa);
        return da - pa.distanceToSquared(origin);
      });
    const gap = reduceMotion ? 0 : 86;
    rest.forEach((c, i) => {
      S.candleTimers.push(setTimeout(() => igniteCandle(c, { grow: 380, pop: true }), 340 + i * gap));
    });
    return 340 + rest.length * gap;
  }

  function lightCandle(candle) {
    if (S.stage !== 'cake' || S.lit) return;
    S.lit = true;
    S.stage = 'enter';
    S.hover = candle;

    igniteCandle(candle, { grow: 460, pop: true });

    // 第一支亮下的同时，屋里的暖色开始往上走（蛋糕补光 / 贴桌光晕 / 桌光池一起焐）
    // 补光只抬到 0.92：再高会把蛋糕顶和糖霜压成一片死白，反而看不见火焰的颜色
    if (S.cakeFill) {
      Core.tween({ from: S.cakeFill.intensity, to: 0.92, dur: 1500, ease: Core.easeOutCubic, onUpdate: v => { S.cakeFill.intensity = v; } });
    }
    /* 转身那一幕把 S.candleGlow 抬到了 2.2（那会儿蜡烛还没点，只是"格外亮"的补光）。
       真点着以后 2.2 会把烛身和蜡顶照成一团白 —— 火焰自己就是光源，这里落回 1.15。 */
    Core.tween({ from: S.candleGlow || 1.45, to: 1.15, dur: 900, ease: Core.easeOutCubic,
      onUpdate: v => { S.candleGlow = v; } });
    if (S.cakeAura) {
      Core.tween({ from: S.cakeAura.material.opacity, to: 0.52, dur: 1600, ease: Core.easeOutCubic,
        onUpdate: v => { S.cakeAura.material.opacity = v; } });
    }
    if (S.cakePool) {
      Core.tween({ from: S.cakePool.material.opacity, to: 0.44, dur: 1600, ease: Core.easeOutCubic,
        onUpdate: v => { S.cakePool.material.opacity = v; } });
    }

    const spread = sweepCandles(candle);

    // 十三支传完：暖光加到最后一点，音乐盒在同一个呼吸里接上
    setTimeout(() => {
      $('#warm').classList.add('on');
      playTone([523.25, 659.25, 783.99], 2.2, 0.1);
      startBirthdayMusic();
    }, reduceMotion ? 60 : spread + 120);

    // 镜头轻轻凑近：火苗在画面里长大一点，交棒给影子戏时也不显得突然
    /* 不能只改 camera.position：animate() 里 S.userCamera 为假时会每帧把相机拽回
       S.camBase.pos（电影机位），推近会被吃掉。所以 camBase 和 camera 一起走。 */
    if (!reduceMotion && S.camera && S.controls && S.controls.target && S.camBase) {
      // 先把「6 秒不动就自动归位」的计时器掐掉，否则它会在推近到一半时把镜头弹回去
      cancelCameraReturn();
      const tgt = S.controls.target.clone();
      const from = S.camBase.pos.clone();
      const to = tgt.clone().add(from.clone().sub(tgt).multiplyScalar(0.94));
      Core.tween({ from: 0, to: 1, dur: 2400, ease: Core.easeInOutCubic || Core.easeOutCubic,
        onUpdate: v => {
          S.camBase.pos.lerpVectors(from, to, v);
          if (!S.userCamera) S.camera.position.copy(S.camBase.pos);
        } });
    }

    showHint('');
    // 点蜡烛之后：先让烛火自己烧一会儿（3 秒），再演影子戏（墙上三个圆），
    // 戏散场才把玩家交给拔白发那一段。
    // 影子戏那套（SHADOW / enterShadowPlay）定义在 boot() 里，这一层看不见，
    // 只能走 window.__prologue 这座桥 —— climax.js 取 showEndcard 也是同样的理由。
    setTimeout(() => {
      /* 交接：蜡烛点完之后不再演旧的影子戏，直接进新写的试装版（prologue-acts） */
      if (window.__PROLOGUE_HANDOFF !== false) {
        try {
          const veil = document.getElementById('veil');
          if (veil) veil.classList.add('lift');
          location.href = new URL('../prologue-acts/index.html', location.href).href;
        } catch (e) { location.href = '../prologue-acts/index.html'; }
        return;
      }
      const api = window.__prologue || {};
      if (api.SHADOW && api.SHADOW.on && typeof api.enterShadowPlay === 'function') {
        api.enterShadowPlay(() => {
          if (window.ClimaxSystem) {
            showHint('母亲发间有一根银白发丝。<em>轻触拔掉它</em>');
            setTimeout(() => {
              if (window.ClimaxSystem) window.ClimaxSystem.startClimaxSequence();
            }, 5000);
          } else {
            setTimeout(showEndcard, 2600);
          }
        });
        return;
      }
      if (window.ClimaxSystem) {
        showHint('母亲发间有一根银白发丝。<em>轻触拔掉它</em>');
        // 5秒若玩家未点击，自动温柔触发原著叙事流程
        setTimeout(() => {
          if (window.ClimaxSystem) window.ClimaxSystem.startClimaxSequence();
        }, 5000);
      } else {
        setTimeout(showEndcard, reduceMotion ? 400 : 2600);
      }
    }, reduceMotion ? 400 : 3000);
  }

  /* 结束卡背后的重打光浮雕（src/relight.js）已下线。
     试过一版把铜版画浮雕垫在「该出发了」底下，用户明确说这张图很丑、不要出现在作品里，
     所以这里不再挂载 —— relight 效果只留在独立的 relight.html 技术演示页，不进作品流程。
     保留这个空函数只是为了 showEndcard() 的调用点不用改；将来想换别的背景再往这里填。 */
  function mountEndRelief() { }

  /* 终局卡片是不是真的已经出来了。S.stage 在点火那一刻就变成 'enter'，
     但烛火还要烧 3 秒、影子戏也没开始 —— 这期间按空格/回车不该把人送去下一章。 */
  function isEndcardShown() {
    const ec = $('#endcard');
    return !!(ec && ec.classList.contains('show'));
  }

  function showEndcard() {
    /* 终局卡片在 2026-10 那轮改成了三张去向卡（档案 / 第一章 / 武器试验），
       原来的单个 #enterLink 已经不在 DOM 里了。还按老写法 `link.href = ...` 取的话，
       link 是 null → 抛 TypeError → 后面的 classList.add('show') 根本走不到，
       用户看到的就是灰烬飞完、然后什么都没有。所以这里先退化：
       有 #enterLink 就沿用（老页面/单文件版还有它），没有就把 ?enter= 写到主去向卡上。 */
    const link = $('#enterLink');
    if (link) {
      link.href = ENTER_URL;
    } else if (params.get('enter')) {
      const primary = $('#destAnomaly');
      if (primary) primary.href = ENTER_URL;
    }
    mountEndRelief();
    $('#endcard').classList.add('show');
    S.stage = 'enter';
    window.__prologueDone = true;
  }

  /* =============================================================== 提示 */

  let hintTimer = 0;
  function showHint(html) {
    const el = $('#hint');
    clearTimeout(hintTimer);
    if (!html) {
      el.classList.remove('show');
      return;
    }
    hintTimer = setTimeout(() => {
      el.innerHTML = html;
      el.classList.add('show');
    }, 260);
  }

  /* 章节字幕的打字机：原来只是 opacity 淡入，字是"啪"一下整块出现的。
     现在主标题逐字打（7 字/秒，空格多停一下），副标题再逐字跟上（16 字/秒），
     打字期间给副标题挂一个方块光标。 */
  let chapterTypeTimer = null;
  function typeInto(el, text, cps, done) {
    if (!el) { if (done) done(); return; }
    el.dataset.full = text;
    el.textContent = '';
    if (!text) { if (done) done(); return; }
    el.classList.add('typing');
    const step = Math.max(16, 1000 / cps);
    let i = 0;
    const tick = () => {
      i++;
      el.textContent = text.slice(0, i);
      if (i < text.length) {
        const ch = text.charAt(i - 1);
        chapterTypeTimer = setTimeout(tick, step + (ch === ' ' ? 80 : 0));
      } else {
        el.classList.remove('typing');
        chapterTypeTimer = null;
        if (done) done();
      }
    };
    chapterTypeTimer = setTimeout(tick, step);
  }

  function showChapter(on) {
    const el = $('#chapter');
    if (!el) return Promise.resolve();
    el.classList.toggle('show', on);
    if (chapterTypeTimer) { clearTimeout(chapterTypeTimer); chapterTypeTimer = null; }
    if (!on) return Promise.resolve();
    const big = el.querySelector('.big');
    const sub = $('#chapterSub');
    const bigText = big ? (big.dataset.full || big.textContent.trim()) : '';
    const subText = sub ? (sub.dataset.full || sub.textContent.trim()) : '';
    if (reduceMotion) {
      if (big) big.textContent = bigText;
      if (sub) sub.textContent = subText;
      return Promise.resolve();
    }
    if (big) big.textContent = '';
    if (sub) sub.textContent = '';
    // 返回 Promise：boot 要等字打完才拉开帘幕（打字正好盖住加载时间）
    return new Promise(resolve => {
      typeInto(big, bigText, 10, () => {
        setTimeout(() => {
          if (!el.classList.contains('show')) { resolve(); return; }
          typeInto(sub, subText, 26, resolve);
        }, 200);
      });
    });
  }

  /* =============================================================== 闪电 */

  function flashNow(strength = 1) {
    S.flash = Math.max(S.flash, strength);
    S.gust = Math.max(S.gust, strength * 0.35);   // 雷光带起一阵风，窗帘跟着抖
  }

  function scheduleFlash() {
    const next = 6500 + Math.random() * 9000;
    S.flashTimer = setTimeout(() => {
      flashNow(0.55 + Math.random() * 0.55);
      if (Math.random() < 0.4) setTimeout(() => flashNow(0.4), 180);
      if (Math.random() < 0.3) thunder();
      scheduleFlash();
    }, next);
  }

  /* =============================================================== 主循环 */

  /* 变灰之后的"自己走向厨房"：状态与 tick 都放在外层，animate 与 boot 共用 */
  const WALK = { on: false, pos: null, yaw: 0, pitch: 0, keys: {}, done: null, near: false, bound: null };
  const AFTERMATH = { on: false, proxies: [], labels: [], seen: new Set(), done: null };

  /* 灾后调查使用真实场景中的 3D 命中代理，不再铺满屏幕的按钮卡片。
     代理位置以当前房间包围盒为基准；模型坐标有差异时仍能稳定命中，且会以微弱脉冲提示。 */
  function startAftermath3D(done) {
    if (AFTERMATH.on) return;
    AFTERMATH.on = true; AFTERMATH.seen = new Set(); AFTERMATH.done = done || null;
    S.stage = 'aftermath'; S.stageRender = '';
    document.body.classList.add('stage-mode');
    const b = S.roomBox && S.roomBox.box;
    const min = b ? b.min : new T.Vector3(-2, 0, -2);
    const max = b ? b.max : new T.Vector3(2, 2.6, 2);
    const c = b ? b.getCenter(new T.Vector3()) : new T.Vector3();
    const spots = [
      { id: 'shelf', label: '书架', p: new T.Vector3(min.x + (max.x - min.x) * .24, min.y + (max.y - min.y) * .52, min.z + .18), r: .42,
        text: '书架上的书蒙着一层灰。我摸到一本摊开的书，纸页停在一句话上：有些变化发生时，世界来不及留下声音。' },
      { id: 'handheld', label: '掌上机', p: new T.Vector3(c.x + .12, min.y + .92, c.z + .12), r: .26,
        text: '掌上机的屏幕还亮着，时间停在那一秒。雪花噪声里，蓝色光点沿着屏幕边缘缓慢移动。' },
      { id: 'familyPortrait', label: '桌上画 / 全家福', p: new T.Vector3(c.x - .24, min.y + (max.y - min.y) * .58, c.z - .34), r: .34,
        text: '桌上的画框歪了一点。画里三个人还在笑，窗外的蓝光却已经穿过了他们的轮廓。' }
    ];
    AFTERMATH.proxies = spots.map(s => {
      const m = new T.MeshBasicMaterial({ color: 0xf0c878, transparent: true, opacity: .055, wireframe: true, depthWrite: false });
      const mesh = new T.Mesh(new T.SphereGeometry(s.r, 16, 10), m);
      mesh.position.copy(s.p); mesh.userData.aftermathId = s.id; mesh.userData.aftermath = s;
      mesh.userData.interactionId = s.id;
      S.scene.add(mesh); return mesh;
    });
    AFTERMATH.labels = spots.map(s => {
      const el = document.createElement('div');
      el.textContent = s.label + ' · 点击调查';
      el.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;z-index:18;pointer-events:none;transform:translate(-50%,-50%);padding:4px 8px;border:1px solid rgba(240,200,120,.42);border-radius:999px;background:rgba(8,12,18,.72);color:#f2d28c;font:11px/1.2 ui-monospace,Consolas,monospace;letter-spacing:.08em;white-space:nowrap;';
      el.dataset.ready = '0';
      document.body.appendChild(el); return el;
    });
    const refresh = (n) => {
      if (!AFTERMATH.on || n <= 0) return;
      updateAftermathMarkers(performance.now() / 1000);
      requestAnimationFrame(() => refresh(n - 1));
    };
    requestAnimationFrame(() => refresh(6));
    showHint('灰烬还没有冷却。<em>点击场景里的微光目标，调查三件遗留物</em>');
  }

  function investigateAftermath(hit) {
    const s = hit && hit.userData && hit.userData.aftermath;
    if (!s || !AFTERMATH.on) return false;
    AFTERMATH.seen.add(s.id);
    const mesh = hit;
    mesh.material.opacity = .65; mesh.material.color.setHex(0xfff4c2);
    mesh.scale.setScalar(1.18);
    showHint('<strong>' + s.label + '</strong><br>' + s.text);
    setTimeout(() => { if (mesh && mesh.material) { mesh.material.opacity = .055; mesh.material.color.setHex(0xf0c878); mesh.scale.setScalar(1); } }, 900);
    if (AFTERMATH.seen.size >= 3) {
      setTimeout(() => {
        AFTERMATH.proxies.forEach(p => { try { S.scene.remove(p); p.geometry.dispose(); p.material.dispose(); } catch (_) {} });
        AFTERMATH.labels.forEach(el => { try { el.remove(); } catch (_) {} }); AFTERMATH.labels = [];
        AFTERMATH.proxies = []; AFTERMATH.on = false; document.body.classList.remove('stage-mode');
        const cb = AFTERMATH.done; AFTERMATH.done = null; S.stage = 'cake';
        showHint('调查完成。<em>走向厨房，找到冰箱，按 E 打开</em>');
        if (cb && window.__startKitchenWalk) window.__startKitchenWalk(cb);
      }, 1100);
    }
    return true;
  }
  function updateAftermathMarkers(t) {
    if (!AFTERMATH.on || !AFTERMATH.proxies.length) return;
    const cam = (S.stageRender === 'stage' && S.stageCam) ? S.stageCam : S.camera;
    if (!cam || !cam.projectionMatrix || !S.renderer || !innerWidth || !innerHeight) {
      AFTERMATH.labels.forEach(el => { el.style.opacity = '0'; el.style.left = '-9999px'; el.style.top = '-9999px'; el.dataset.ready = '0'; });
      return;
    }
    cam.updateMatrixWorld && cam.updateMatrixWorld(true);
    const vw = innerWidth, vh = innerHeight, pad = 18;
    AFTERMATH.proxies.forEach((mesh, i) => {
      const pulse = 1 + Math.sin(t * 2.4 + i * 1.7) * 0.08;
      if (!mesh.userData.flash) mesh.scale.setScalar(pulse);
      const v = mesh.getWorldPosition(new T.Vector3()).project(cam);
      const el = AFTERMATH.labels[i];
      if (el) {
        const inDepth = v.z > -1 && v.z < 1;
        if (!inDepth || !Number.isFinite(v.x) || !Number.isFinite(v.y) || !Number.isFinite(v.z)) { el.style.opacity = '0'; el.style.left = '-9999px'; el.style.top = '-9999px'; el.dataset.ready = '0'; return; }
        const x = Math.max(pad, Math.min(vw - pad, (v.x * .5 + .5) * vw));
        const y = Math.max(pad, Math.min(vh - pad, (-v.y * .5 + .5) * vh));
        el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.opacity = '1'; el.dataset.ready = '1';
      }
    });
  }
  let walkTickOuter = null;

  /* aftermath_debug：?aftermath=1 直接跳到 3D 调查热点，方便检查命中位置。 */
  try {
    if (new URLSearchParams(location.search).get('aftermath') === '1') {
      setTimeout(function () { startAftermath3D(function () {}); }, 1500);
    }
  } catch (e) {}
  function animate() {
    window.__frames = (window.__frames || 0) + 1;
    const clock = S.clock || (S.clock = new T.Clock());
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = performance.now() / 1000;
    updateAftermathMarkers(t);

    // Authored shots use the cinematic base pose. Once the viewer drags the
    // scene, OrbitControls owns the camera and the old parallax is disabled.
    if (WALK.on) {
      S.camHold = false;     /* 行走模式优先级最高 */
      if (walkTickOuter) walkTickOuter(dt);   /* 变灰之后：玩家自己走向厨房 */
    } else if (S.camHold) {
      // 影子戏自己拿机位（见 enterShadowPlay），这里不要再抢
    } else if (S.userCamera && S.controls) {
      S.controls.update();
    } else {
      S.parallax.lerp(S.parallaxTarget, reduceMotion ? 1 : 0.06);
      S.camera.position.copy(S.camBase.pos).add(S.parallax);
      S.camera.lookAt(S.camBase.target);
    }

    // 闪电衰减
    S.flash = Math.max(0, S.flash - dt * 1.9);
    if (S.outdoorMat) S.outdoorMat.uniforms.uFlash.value = S.flash;
    if (S.outdoorMat) S.outdoorMat.uniforms.uTime.value = t;
    if (S.rainGlassMat) S.rainGlassMat.uniforms.uTime.value = t;

    // 风：室内本来有一点气流，开窗之后是穿堂风，闪电再补一阵；gust 是开窗瞬间的冲劲
    const windTarget = Math.min(0.78, (S.open > 0.2 ? 0.38 : 0.08) + S.gust * 0.28);
    S.wind += (windTarget - S.wind) * Math.min(1, dt * 3.4);
    S.gust = Math.max(0, S.gust - dt * 0.85);
    if (S.cloths) for (const c of S.cloths) stepCloth(c, dt, S.wind, t);
    if (S.outsideLight) {
      const base = S.stage === 'cake' || S.stage === 'enter' ? 1.35 : (S.open > 0.6 ? 0.95 : 0);
      S.outsideLight.intensity = base + S.flash * 3.2;
    }
    if (S.ballGlow) {
      S.ballGlow.material.opacity = Math.max(S.ballGlow.material.opacity * 0.998, 0) + S.flash * 0.03;
      const s = 2.4 + Math.sin(t * 0.7) * 0.18;
      S.ballGlow.scale.set(s, s, 1);
    }

    // 烛火抖动
    for (const c of S.candles) {
      if (!c.lit) { c.light.intensity = 0; continue; }
      const f = 0.82 + 0.18 * Math.sin(t * 9 + c.phase) * Math.sin(t * 3.7 + c.phase * 2);
      // 转身那一幕之后 S.candleGlow 会被抬到 2.2：蜡烛"格外亮"
      // gain 是这一支自己被点着时的 0→1，逐支点亮时才不会"啪"地整排一起亮
      c.light.intensity = (S.candleGlow || 1.45) * f * (c.gain == null ? 1 : c.gain);
      for (const fl of c.flames) {
        if (!fl.visible) continue;
        const k = 0.94 + 0.06 * Math.sin(t * 11 + c.phase);
        fl.scale.x = (fl.userData.__f0 ? fl.userData.__f0.x : 1) * k;
        fl.scale.z = (fl.userData.__f0 ? fl.userData.__f0.z : 1) * k;
      }
      /* 四层 sprite 各用不同频率抖：竖直拉伸、横向收细、整体左右摆，
         频率里带一点无理数比例，14 支蜡烛才不会整齐地一起跳。 */
      const parts = c.flameParts || [];
      // 闪电带来的一阵风（S.gust）会把烛火压矮、往一边扯：屋里点着 14 支火时，
      // 这一下比窗帘更先被眼睛看见
      const gust = Math.min(1, S.gust || 0);
      for (let k = 0; k < parts.length; k++) {
        const p = parts[k];
        const sp = p.sp;
        if (!sp || !sp.visible) continue;
        const roll = p.roll;
        const w1 = Math.sin(t * (7.1 + roll * 1.7) + c.phase * (1.0 + roll * 0.37));
        const w2 = Math.sin(t * (2.3 + roll * 0.41) + c.phase * 2.7);
        const w3 = Math.sin(t * (13.7 - roll * 2.1) + c.phase * 0.6);
        const stretch = 1 + 0.13 * w1 + 0.08 * w2 + 0.035 * w3;
        const pinch = 1 - 0.07 * w1 - 0.03 * w3;
        const p0 = c.flameGain == null ? 1 : c.flameGain;
        sp.scale.x = p.base[0] * pinch * p0;
        sp.scale.y = p.base[1] * Math.max(0.5, stretch * (1 - 0.24 * gust)) * p0;
        // 火苗整体被一点"风"推着走：两侧摆幅不一样宽，才不会像钟摆
        sp.position.x = p.base[0] * (0.24 * w2 + 0.10 * w3 + 0.05 * Math.sin(t * 0.7 + c.phase)
          + gust * (0.42 + 0.24 * Math.sin(t * 17 + c.phase)));
        sp.material.opacity = Math.min(1, p.op * p0 * (0.86 + 0.10 * w1 + 0.05 * w2) * (1 - 0.12 * gust));
      }
    }

    // ② 量子点云：极慢的整体漂移（不再做透明度呼吸 —— 那会让画面看起来在"糊"）
    if (S.cloudGroup && S.cloudGroup.visible) {
      S.cloudGroup.rotation.y = Math.sin(t * 0.11) * 0.005;
      S.cloudGroup.position.y = Math.sin(t * 0.5) * 0.006;
    }

    // 尘埃缓慢上升
    if (S.dust && S.dust.material.opacity > 0.01) {
      const pos = S.dust.geometry.attributes.position;
      const seed = S.dust.userData.seed;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) + dt * 0.012 * (0.6 + Math.sin(seed[i]) * 0.4);
        if (y > 2.6) y = 0.1;
        pos.setY(i, y);
        pos.setX(i, pos.getX(i) + Math.sin(t * 0.35 + seed[i]) * 0.0009);
      }
      pos.needsUpdate = true;
    }

    if (window.ClimaxSystem) {
      window.ClimaxSystem.update(dt, t);
    }

    // The shadow-play stage owns its own light, masks, and camera while it is active.
    if (window.__shadowStageUpdate) window.__shadowStageUpdate(t);

    if (S.stageRender === 'stage' && S.stageScene) {
      S.renderer.render(S.stageScene, S.stageCam);
    } else {
      S.renderer.render(S.scene, S.camera);
    }
    requestAnimationFrame(animate);
  }

  /* =============================================================== 流程 */

  /* ① 黑屏打字：两段故事逐字出现，每个字配一下按键声。 */
  async function typeStory() {
    const intro = $('#intro');
    if (!intro) return;
    intro.classList.remove('gone');
    const prompt = $('#introPrompt');
    const lines = [$('#introLine0'), $('#introLine1')];
    lines.forEach(l => { if (l) l.textContent = ''; });

    // 等待用户按下空格或点击开始；2.6s 后保底自动开始，绝不无限停在黑屏
    await new Promise(resolve => {
      let done = false;
      let timer = 0;
      const finish = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        window.removeEventListener('keydown', onStart, true);
        window.removeEventListener('pointerdown', onStart, true);
        if (prompt) prompt.classList.add('hide');
        unlockAudio();
        resolve();
      };
      const onStart = (e) => {
        if (e.type === 'keydown' && e.code !== 'Space' && e.key !== ' ' && e.key !== 'Enter') return;
        finish();
      };
      window.addEventListener('keydown', onStart, true);
      window.addEventListener('pointerdown', onStart, true);
      timer = setTimeout(finish, 2600);
      // 从主站封面进来时外面已经按过一次键，这里不再让人按第二遍
      if (params.has('auto')) finish();
    });

    // 声音被浏览器挂起时，给一行很轻的提示（点了之后就不显示）
    const ctx = audioCtx();
    if (ctx && ctx.state === 'suspended' && S.soundOn) {
      const hint = $('#introSound');
      if (hint) hint.classList.add('show');
    }

    // 首屏打字机的附加效果开关：默认 B(打错回删) + C(视觉质感)，A 乱码落定留给 ?type= 预览
    // ?type=a|b|c 可任意叠加覆盖默认（abc / ab / c / 空都行；?type= 表示全部关掉）
    const TYPE_DEFAULT = 'bc';
    const typeRaw = (params.has('type') ? (params.get('type') || '') : TYPE_DEFAULT).toLowerCase();
    const TYPE_FLAGS = {
      garble: typeRaw.indexOf('a') >= 0,
      typo: typeRaw.indexOf('b') >= 0,
      polish: typeRaw.indexOf('c') >= 0
    };
    S._typeFlags = TYPE_FLAGS;                      // 给验收脚本看当前生效的档位
    document.documentElement.setAttribute('data-type', typeRaw || 'none');

    const typeLine = (el, text, cps) => new Promise(resolve => {
      if (!el) { resolve(); return; }
      if (!window.Typewriter) {                     // 兜底：没有模块就直接出全文
        el.textContent = text;
        resolve();
        return;
      }
      const tw = window.Typewriter.run(el, text, {
        cps,
        garble: TYPE_FLAGS.garble,
        typo: TYPE_FLAGS.typo,
        polish: TYPE_FLAGS.polish,
        startDelay: 120,
        onKey: () => keyClick(0.85 + Math.random() * 0.3)
      });
      tw.promise.then(resolve);
    });

    await typeLine(lines[0], STORY[0], 26);
    await wait(420);
    await typeLine(lines[1], STORY[1], 26);
    await wait(reduceMotion ? 0 : 1100);           // 最后一段停住，让人读完
  }

  /* ② 全屏变黑：文字淡出，画面保持纯黑（资产的解析就藏在这段里）。 */
  async function toBlack() {
    const intro = $('#intro');
    if (!intro) return;
    intro.classList.add('gone');                   // 底下的 #veil 本来就是黑的
    await wait(reduceMotion ? 0 : 900);
  }

  /* ③ 脚步声走近窗子：镜头沿着轴线向前推，脚步与节奏对齐。 */
  async function walkIn() {
    const fit = S.homeFit || { dx: 0.12, dy: -0.36, s: 1 };
    const dist = (S.homeDist || 2.9) * fit.s;
    const target = S.homeTarget.clone();
    const end = new T.Vector3(target.x + fit.dx, target.y + fit.dy, target.z - OUT_Z * dist);
    // 出发点：沿同一轴线再退 1.6 m，略微高一点（像站着走进来）
    const start = end.clone().add(new T.Vector3(0, 0.10, -OUT_Z * 1.6));

    S.camBase.pos.copy(start);
    S.camBase.target.copy(target);
    if (S.controls) S.controls.target.copy(target);

    const intro = $('#intro');
    if (intro) intro.classList.add('gone');
    // 掀开黑帘幕！这一步原来藏在 runIntro 里，重写分镜时漏掉了，
    // 结果「序曲」消失后画面全黑（#veil 是 z-index 40 的纯黑层，压在 canvas 上）。
    const veil = $('#veil');
    if (veil) veil.classList.add('lift');
    S.stage = 'walk';

    // 一步一顿的版本用户看过说「太奇怪了」，回退成原来这条匀速补间（保留 7 次脚步声的节拍）
    const steps = 7;
    for (let i = 1; i <= steps; i++) {
      footstep(0.7 + (i / steps) * 0.5);
      await wait(reduceMotion ? 0 : 330);
    }

    await new Promise(resolve => {
      if (reduceMotion) {
        S.camBase.pos.copy(end);
        resolve();
        return;
      }
      Core.tween({
        from: 0, to: 1, dur: 2200, ease: Core.easeInOutCubic,
        onUpdate: k => { S.camBase.pos.lerpVectors(start, end, k); },
        onDone: resolve
      });
    });
    S.stage = 'window';
    if (S.controls) S.controls.enabled = true;
    showHint('点一下窗户，或者把它<em>推开</em>');
    scheduleFlash();
  }

  /* ④ 转身停在蛋糕前，浮现「序曲」：先显形，再一边放大一边淡出。
     原来这行字是压在窗口上的；用户要求"移到蛋糕那边去"——所以改成
     在 revealRoom 结束、镜头平视蛋糕之后才放，并且位置略偏上，不挡蛋糕。 */
  function playOverture(atCake) {
    const el = $('#overture');
    if (!el) return;
    el.classList.remove('grow');
    el.classList.toggle('at-cake', !!atCake);
    el.classList.add('show');
    overtureSwell();
    setTimeout(() => el.classList.add('grow'), reduceMotion ? 300 : 1100);
    setTimeout(() => el.classList.remove('show', 'grow', 'at-cake'), reduceMotion ? 1200 : 4600);
  }

  /* ⑤ 转身：镜头绕着桌子走一段弧到蛋糕视角，房间随之展开；蜡烛提到最亮。
     instant=true 是「跳过」按下来的快进版：不要脚步声、弧线也短。 */
  /* 热身：先把「转身之后的那一眼」离屏渲一遍。
     实测（tools/perf-turn.mjs）：转身最后半秒会整帧卡住 665–790 ms，
     因为蛋糕方向那批房间网格、蛋糕光晕、三张贴图都是第一次进视锥——
     着色器现编、贴图现传，全挤在镜头停下那一刻。
     用 256×160 的离屏目标渲一帧，用户看不见，但程序和贴图都备好了。 */
  function prewarmView(pos, target, deep) {
    try {
      if (!S._warmRT) S._warmRT = new T.WebGLRenderTarget(256, 160);
      if (!S._warmCam) S._warmCam = S.camera.clone();
      const cam = S._warmCam;
      cam.position.copy(pos);
      cam.lookAt(target);
      cam.updateMatrixWorld(true);
      const r = S.renderer;
      const prev = r.getRenderTarget();
      if (deep) {
        /* 影子贴图平时是缓存的：只渲一帧主画面，影子的深度材质不会编到。
           这里强制更新一次，把深度材质也带出来。 */
        r.shadowMap.needsUpdate = true;
        try { r.compile(S.scene, cam); } catch (e) { }
      }
      r.setRenderTarget(S._warmRT);
      r.render(S.scene, cam);          // 编译 + 上传都发生在这一帧里
      if (deep) r.render(S.scene, cam); // 影子在第一帧后重算，第二帧才是完整的一遍
      r.setRenderTarget(prev);
    } catch (err) { /* 热身失败不影响正片 */ }
  }

  async function revealRoom(instant = false) {
    const cakeView = S.cakeView;
    if (!cakeView) return;
    S.stage = 'turn';

    const from = S.camBase.pos.clone();
    const to = cakeView.pos.clone();
    const center = new T.Vector3(S.cakeBox ? S.cakeBox.center.x : 0.14, 0.9,
                                 S.cakeBox ? S.cakeBox.center.z : 0.28);
    // 绕桌心插值角度与半径：看得出"转身"，而不是平移
    const a0 = Math.atan2(from.z - center.z, from.x - center.x);
    const a1 = Math.atan2(to.z - center.z, to.x - center.x);
    let dA = a1 - a0;
    while (dA > Math.PI) dA -= Math.PI * 2;
    while (dA < -Math.PI) dA += Math.PI * 2;
    const r0 = Math.hypot(from.x - center.x, from.z - center.z);
    const r1 = Math.hypot(to.x - center.x, to.z - center.z);

    const steps = instant ? 0 : 5;
    S._trace = (S._trace || []).concat(['turn:enter cam=' + from.toArray().map(n => n.toFixed(2)) + (instant ? ' (instant)' : '')]);
    /* 在脚步声那 1.5 秒里把终点视角预热掉：转过去的时候不再现场编着色器 */
    if (!instant) prewarmView(to, cakeView.target);
    for (let i = 0; i < steps; i++) { footstep(0.6); await wait(reduceMotion ? 0 : 300); }
    S._trace.push('turn:footsteps-done');

    await new Promise(resolve => {
      if (reduceMotion) { S.camBase.pos.copy(to); resolve(); return; }
      S._trace.push('turn:tween-start');
      Core.tween({
        from: 0, to: 1, dur: instant ? 700 : 2800, ease: Core.easeInOutCubic,
        onUpdate: k => {
          const a = a0 + dA * k;
          const r = r0 + (r1 - r0) * k;
          S.camBase.pos.set(center.x + Math.cos(a) * r,
                            from.y + (to.y - from.y) * k,
                            center.z + Math.sin(a) * r);
          S.camBase.target.lerpVectors(S.homeTarget, cakeView.target, k);
        },
        onDone: resolve
      });
    });

    // 房间"亮起来"：环境补光抬起，烛光提到最亮（用户要"蜡烛格外亮"）
    S.candleGlow = 2.2;
    if (S.roomFill) Core.tween({ from: S.roomFill.intensity, to: 0.8, dur: 1800,
      onUpdate: v => { S.roomFill.intensity = v; } });
    // 蛋糕柔光：先只到 0.26（淡淡的，像被屋里那点光包着），点蜡烛后再抬
    if (S.cakeAura) {
      if (instant) {
        S.cakeAura.material.opacity = 0.26;
        if (S.cakePool) S.cakePool.material.opacity = 0.30;
      } else {
        Core.tween({ from: 0, to: 0.26, dur: 1400, ease: Core.easeOutCubic,
          onUpdate: v => { S.cakeAura.material.opacity = v; } });
        if (S.cakePool) Core.tween({ from: 0, to: 0.30, dur: 1600, ease: Core.easeOutCubic,
          onUpdate: v => { S.cakePool.material.opacity = v; } });
      }
    }
    if (S.cakeFill) {
      if (instant) S.cakeFill.intensity = 0.42;
      else Core.tween({ from: S.cakeFill.intensity, to: 0.42, dur: 1200,
        onUpdate: v => { S.cakeFill.intensity = v; } });
    }
    S.cakeView = cakeView;
    S.stage = 'cake';
    if (S.controls) { S.controls.target.copy(cakeView.target); S.controls.enabled = true; }
    // 「序曲」两个字落在蛋糕这个镜头上（原在窗口那边）
    if (!instant) playOverture(true);
    if (instant) {
      showHint(S.candles.length ? '十四支蜡烛。<em>点一支</em>' : '点一下屏幕，往故事里走');
    } else {
      playCakeIntro();
    }
  }

  /* 上蛋糕这一拍：镜头落到桌上之后，先用原文把"这是什么时候、发生了什么"交代清楚，
     再把操作权交回观众（点蜡烛）。只走字幕，不动镜头、不加新资产。 */
  const CAKE_LINES = [
    '十四岁生日。<em>妈妈把蛋糕放在桌子中央</em>，插上蜡烛——我数了数，十四支。',
    '窗外是这一年最密的暴雨季，<em>整个宇宙似乎只由闪电和我们的小屋组成</em>。',
    '爸爸给自己倒了一杯酒，没有说话。<em>雨还没有停</em>。'
  ];
  async function playCakeIntro() {
    for (const line of CAKE_LINES) {
      if (S.stage !== 'cake') return;
      showHint(line);
      await wait(2900);
    }
    if (S.stage !== 'cake') return;
    showHint(S.candles.length ? '十四支蜡烛。<em>点一支</em>' : '点一下屏幕，往故事里走');
  }

  function bindUI() {
    const canvas = S.renderer.domElement;
    canvas.addEventListener('pointerdown', onPointerDown, true);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp, true);
    canvas.addEventListener('pointercancel', () => { S.drag = null; });

    /* 浏览器要求用户手势才允许出声：第一次点击/按键时解锁（打字声、脚步声、雷声都靠它） */
    const unlock = () => { unlockAudio(); window.removeEventListener('pointerdown', unlock, true); window.removeEventListener('keydown', unlock, true); };
    window.addEventListener('pointerdown', unlock, true);
    window.addEventListener('keydown', unlock, true);

    $('#btnSkip').addEventListener('click', (e) => {
      /* 点完就把焦点摘掉：按钮留着 focus 的话，后面按空格/回车会被浏览器当成
         「再按一次这个按钮」—— 见下面 keydown 里那段注释，点蜡烛的瞬间会直接跳结局。 */
      if (e && e.currentTarget && e.currentTarget.blur) e.currentTarget.blur();
      audioCtx();
      if (S.stage === 'boot' || S.stage === 'intro' || S.stage === 'black' || S.stage === 'walk' || S.stage === 'window') {
        // 跳过开场：直接把镜头放到窗前的机位，并推开窗进正片
        const introEl = $('#intro');
        if (introEl) introEl.classList.add('gone');
        const ov = $('#overture');
        if (ov) ov.classList.remove('show', 'grow');
        $('#veil').classList.add('lift');
        showChapter(false);
        showHint('');
        const fit = S.homeFit || { dx: 0.72, dy: -0.34, s: 1 };
        const dist = (S.homeDist || 2.9) * fit.s;
        if (S.homeTarget) {
          S.camBase.pos.set(S.homeTarget.x + fit.dx, S.homeTarget.y + fit.dy, S.homeTarget.z - OUT_Z * dist);
          S.camBase.target.copy(S.homeTarget);
        }
        if (S.sash) S.sash.rotation[S.sashAxis] = S.sashTo;
        S.open = 1;
        if (S.stage === 'cake' || S.stage === 'turn') { showEndcard(); return; }
        S.stage = 'opening';
        setTimeout(() => { if (S.stage === 'opening') goCake(true); }, 120);
      } else if (S.stage === 'cake') {
        S.stage = 'enter';
        showEndcard();
      } else {
        showEndcard();
      }
    });

    $('#btnReplay').addEventListener('click', (e) => {
      if (e && e.currentTarget && e.currentTarget.blur) e.currentTarget.blur();
      location.href = location.pathname + '?t=' + Date.now();
    });
    $('#btnSound').addEventListener('click', e => {
      if (e.currentTarget.blur) e.currentTarget.blur();
      S.soundOn = !S.soundOn;
      if (S.rainGain) S.rainGain.gain.value = S.soundOn ? 0.34 : 0;
      setBirthdayVolume(S.soundOn);
      e.currentTarget.textContent = '声音：' + (S.soundOn ? '开' : '关');
      e.currentTarget.setAttribute('aria-pressed', String(S.soundOn));
    });

    addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') {
        /* 必须 preventDefault：刚点过「跳过 →」的话，焦点还留在这颗按钮上，
           空格/回车会顺手把它再"按"一次 —— 于是蛋糕镜头里一按空格点蜡烛，
           同一帧里跳过按钮也触发一次，直接掉到终局卡片。
           （实测：按空格点蜡烛后 60ms 就 endcard.show，烛火根本没被看见） */
        e.preventDefault();
        if (S.stage === 'window') setSash(true);
        else if (S.stage === 'cake' && S.candles.length) lightCandle(S.candles[0]);
        else if (S.stage === 'enter' && isEndcardShown()) {
          // 回车/空格在终局卡片上 = 走主去向卡（.dest-prime，即「继续 · 异象之一」）
          const go = $('#enterLink') || $('#destAnomaly') || $('#destContinue');
          if (go) go.click();
        }
      }
      if (e.key === 'Escape') showEndcard();
    });

    // 页面隐藏时暂停闪电计时
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearTimeout(S.flashTimer);
      else if (S.stage !== 'boot') scheduleFlash();
    });

    // 窗口尺寸变化：还在开场/窗户阶段时重新取景，竖屏不会裁掉窗
    addEventListener('resize', () => {
      if (S.stage === 'boot' || S.stage === 'window') homeView();
      if (S.stageCam) {
        S.stageCam.aspect = Math.max(0.35, innerWidth / innerHeight);
        S.stageCam.updateProjectionMatrix();
      }
    });
  }

  /* ============================================================ 视觉风格
     3ds Max 的欧式家装是给离线光追做的，塞进实时 WebGL 又没有烘焙，
     必然塑料、死板、和主站的暗黑科幻风割裂。这里给四种风格**实时切换**：
       ① noir      去贴图 + 压曝光 + 加雾，只留冷雷电轮廓和暖烛火（藏拙，电影感）
       ② cloud     整间屋子化成发光粒子（和终章量子玫瑰同源）
       ③ blueprint 深蓝半透明 + 发光线框（给「异象之一·归家」勘察用）
       ④ raw       原始材质，用来前后对照
     只动 S.room 里的网格；S.cake / S.windowGroup / 蜡烛都是它的兄弟节点，不会被碰。 */

  const STYLE_PREF_KEY = 'bl-prologue-style-v2';
  /* file:// 下、或 iframe 被判成第三方上下文时，localStorage 访问会直接抛 SecurityError。
     读偏好这种小事不该把整页带走。 */
  function readStylePref() {
    try { return localStorage.getItem(STYLE_PREF_KEY) || ''; } catch (_) { return ''; }
  }

  const STYLES = [
    { id: 'noir', label: '① 电影剪影', hint: '去贴图暗夜剪影 + 浓雾 + 只留雷电与烛火' },
    { id: 'cloud', label: '② 量子点云', hint: '整间屋子化成发光粒子，呼应终章量子玫瑰' },
    { id: 'blueprint', label: '③ 全息勘察', hint: '深蓝半透明 + 发光线框，适合「异象之一·归家」' },
    { id: 'raw', label: '④ 原始模型', hint: '原来的 3ds Max 贴图与光照，用来对照' }
  ];

  function ensureStyleResources() {
    if (S._noirMat) return;
    S._noirMat = new T.MeshStandardMaterial({
      color: 0x0d1120, roughness: 0.52, metalness: 0.42, envMapIntensity: 0.45
    });
    S._holoMat = new T.MeshBasicMaterial({
      color: 0x0b1e36, transparent: true, opacity: 0.58, side: T.DoubleSide
    });
    S._wireMat = new T.LineBasicMaterial({
      color: 0x8fb2ff, transparent: true, opacity: 0.5,
      blending: T.AdditiveBlending, depthWrite: false
    });
    // 次要边：同一批几何里"短而碎"的那部分，压暗当底噪，让主轮廓自己跳出来
    S._wireMatDim = new T.LineBasicMaterial({
      color: 0x4a6dcc, transparent: true, opacity: 0.16,
      blending: T.AdditiveBlending, depthWrite: false
    });
  }

  /* 可换材质的网格清单（一次遍历，记下原材质）。玻璃/半透明件不换：
     窗玻璃得能透出雨夜，灯罩得保持发光。 */
  function styleTargets() {
    if (S._styleMeshes) return S._styleMeshes;
    const list = [];
    const take = o => {
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      const seeThrough = mats.some(m => m && (m.transparent || (m.opacity !== undefined && m.opacity < 0.95)));
      const attr = o.geometry.attributes.position;
      list.push({ mesh: o, orig: o.material, seeThrough, verts: attr ? attr.count : 0 });
    };
    if (S.room) S.room.traverse(o => { if (o.isMesh && o.geometry) take(o); });
    // 房间外壳（补的墙/地/顶）也要跟风格一起变，否则其它风格下它会单独露一块原色
    if (S.roomEnvelope) S.roomEnvelope.traverse(o => { if (o.isMesh && o.geometry) take(o); });
    // 窗框也纳入（玻璃是 transparent，会被 seeThrough 挡掉，仍然能透出雨夜）
    if (S.windowGroup) S.windowGroup.traverse(o => { if (o.isMesh && o.geometry) take(o); });
    for (const m of (S._clothMeshes || [])) if (m.isMesh && m.geometry) take(m);
    // 老宅里序章自己补的物件（窗前小桌）也要跟着切风格
    for (const m of (S._suExtra || [])) if (m.isMesh && m.geometry) take(m);
    S._styleMeshes = list;
    return list;
  }

  /* 点云的"点"默认是方块精灵，放大之后就是一把纸屑。
     这里生成一张 64×64 的圆形软边贴图给 PointsMaterial 用，点才是圆点。 */
  function dotTexture() {
    if (S._dotTex) return S._dotTex;
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 1, 32, 32, 31);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.5, 'rgba(255,255,255,0.92)');
    grd.addColorStop(0.82, 'rgba(255,255,255,0.35)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    S._dotTex = tex;
    return tex;
  }

  /* ② 量子点云：**按三角面面积均匀采样**。
     按顶点抽样的老做法密度跟着模型布线走：花枝、吊灯水晶那些地方几千个顶点挤成一坨，
     墙面地板反而空 —— 用户说的"碎"就是这个。按面积采样后，整间屋子的点距是一致的，
     读起来才像一次扫描，而不是一把灰。 */
  function buildCloud() {
    if (S.cloudGroup) return;
    ensureStyleResources();
    const group = new T.Group();
    group.name = 'style-cloud';

    // 1) 把所有三角面摊平到世界坐标（一次性 15 MB 左右，只在第一次切到点云时做）
    const tri = [];
    let areaTotal = 0;
    const a = new T.Vector3(), b = new T.Vector3(), c = new T.Vector3();
    const e1 = new T.Vector3(), e2 = new T.Vector3(), n = new T.Vector3();
    for (const t of styleTargets()) {
      const geo = t.mesh.geometry;
      if (!geo || !geo.attributes.position) continue;
      t.mesh.updateWorldMatrix(true, false);
      const mtx = t.mesh.matrixWorld;
      const pos = geo.attributes.position;
      const idx = geo.index;
      const count = idx ? idx.count : pos.count;
      const step = Math.max(1, Math.round(count / 60000));   // 超大网格先粗采，别把内存吃穿
      for (let i = 0; i + 2 < count; i += 3 * step) {
        const i0 = idx ? idx.getX(i) : i;
        const i1 = idx ? idx.getX(i + 1) : i + 1;
        const i2 = idx ? idx.getX(i + 2) : i + 2;
        a.fromBufferAttribute(pos, i0).applyMatrix4(mtx);
        b.fromBufferAttribute(pos, i1).applyMatrix4(mtx);
        c.fromBufferAttribute(pos, i2).applyMatrix4(mtx);
        e1.subVectors(b, a); e2.subVectors(c, a);
        const area = n.crossVectors(e1, e2).length() * 0.5;
        if (area < 1e-7) continue;
        tri.push(a.x, a.y, a.z, b.x, b.y, b.z, c.x, c.y, c.z, area);
        areaTotal += area;
      }
    }

    // 2) 按面积分配采样点数
    const N = 75000;
    const perArea = areaTotal > 0 ? N / areaTotal : 0;
    const pos = [];
    const col = [];
    const cakeC = S.cakeBox ? S.cakeBox.center.clone() : new T.Vector3(0, 0.9, 0.3);
    const p = new T.Vector3();
    let seed = 20261025;
    const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    for (let k = 0; k < tri.length; k += 10) {
      const area = tri[k + 9];
      // 按面积分点：取整后为 0 的面按小数部分概率补一个点，
      // 这样总点数稳定在 N 附近，又不会有"每个三角形必点一个"造成的 30 万爆炸。
      const exact = area * perArea;
      let want = Math.round(exact);
      if (!want && rnd() < exact) want = 1;
      for (let s = 0; s < want; s++) {
        let u = rnd(), v = rnd();
        if (u + v > 1) { u = 1 - u; v = 1 - v; }
        const w = 1 - u - v;
        p.set(
          tri[k] * w + tri[k + 3] * u + tri[k + 6] * v,
          tri[k + 1] * w + tri[k + 4] * u + tri[k + 7] * v,
          tri[k + 2] * w + tri[k + 5] * u + tri[k + 8] * v
        );
        pos.push(p.x, p.y, p.z);
        if (p.distanceTo(cakeC) < 0.40) {
          col.push(1.0, 0.62, 0.26);                    // 蛋糕那一小圈：暖金
        } else if (p.z < -1.7) {
          col.push(0.56, 0.76, 1.0);                    // 窗边：冷蓝（外面的雷雨）
        } else {
          const kk = 0.94 + rnd() * 0.12;
          col.push(0.30 * kk, 0.40 * kk, 0.88 * kk);
        }
      }
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new T.Float32BufferAttribute(col, 3));
    /* 用户反馈「粒子太碎、很糊」：
       ① 碎 —— 点是方块精灵，放大成纸屑；改用圆形软贴图（dotTexture）
       ② 糊 —— 半透明叠加越多越糊；改成近似不透明 + 写深度
       数量 ~5.8 万，点距均匀，读起来是一层扫描面而不是一把灰。 */
    const mat = new T.PointsMaterial({
      size: 0.013, sizeAttenuation: true, vertexColors: true, map: dotTexture(),
      transparent: true, opacity: 0.9, alphaTest: 0.25, depthWrite: true, blending: T.NormalBlending
    });
    S.cloudPoints = new T.Points(geo, mat);
    S.cloudPoints.frustumCulled = false;
    group.add(S.cloudPoints);
    S.scene.add(group);
    S.cloudGroup = group;
    S.cloudCount = pos.length / 3;
    /* 这里必须自己决定初始可见性：prewarmStyles() 是在 idle 里建的，
       建的时候当前风格早就定好了（默认 blueprint）。不给 false 的话，
       点云会在「全息勘察」底下透出来 —— 这就是用户截图里窗帘上那些白色小点的一部分。 */
    group.visible = S.styleMode === 'cloud';
  }

  /* ③ 全息勘察：只给「大件」（墙、地、桌、椅、柜、吊灯）抽边线。
     422k 面的模型全量 EdgesGeometry 会卡死，也没必要 —— 大件才有形体信息。 */
  /* ③ 全息线框：**只留结构线**。
     老做法是 EdgesGeometry(22°) 全量合并，实测 200,200 段里有 182,826 段（91%）短于 3 cm ——
     窗帘褶皱、百叶窗叶片、植物叶子那些高频网格吐出来的碎边，在叠加混合下连成一片白噪点，
     用户截图里"窗户周围全是白色小点"就是这个。
     现在三道闸：角度阈值抬到 34°、短于 2.2 cm 的边直接丢、单网格段数上限 + 全局上限。 */
  function buildWire() {
    if (S._wireBuilt) return;
    S._wireBuilt = true;
    ensureStyleResources();
    const pos = [];
    const MIN_EDGE2 = 0.022 * 0.022;   // 2.2 cm，房间尺度（约 7 m）下的"结构级"边
    const MAX_PER_MESH = 7000;
    const MAX_ALL = 70000;
    const buf = [];
    for (const t of styleTargets()) {
      if (t.verts < 8 || t.verts > 24000 || t.seeThrough) continue;
      /* 被适配层藏掉的构件（老宅那扇假窗的帘子等）不能再抽线：
         网格 visible=false，但这里是从缓存清单里取对象，不判一次可见性就会留下"没有本体的线"。 */
      if (!t.mesh.visible || t.mesh.userData.suHidden) continue;
      let edges = null;
      try { edges = new T.EdgesGeometry(t.mesh.geometry, 34); } catch (_) { continue; }
      const a = edges.attributes.position;
      t.mesh.updateWorldMatrix(true, false);
      const mtx = t.mesh.matrixWorld;
      buf.length = 0;
      for (let i = 0; i + 1 < a.count; i += 2) {
        const x0 = a.getX(i), y0 = a.getY(i), z0 = a.getZ(i);
        const x1 = a.getX(i + 1), y1 = a.getY(i + 1), z1 = a.getZ(i + 1);
        const dx = x1 - x0, dy = y1 - y0, dz = z1 - z0;
        if (dx * dx + dy * dy + dz * dz < MIN_EDGE2) continue;
        buf.push(x0, y0, z0, x1, y1, z1);
      }
      edges.dispose();
      const n = buf.length / 6;
      if (!n) continue;
      // 单个网格超量就等距抽样（保住"这个物体有轮廓"，而不是让它独占整屏）
      const step = n > MAX_PER_MESH ? n / MAX_PER_MESH : 1;
      for (let k = 0, i = 0; i < n; i++) {
        if (step > 1 && (k += 1) % Math.ceil(step) !== 0 && i < n - 1) continue;
        const b = i * 6;
        for (let j = 0; j < 6; j += 3) {
          const v = new T.Vector3(buf[b + j], buf[b + j + 1], buf[b + j + 2]).applyMatrix4(mtx);
          pos.push(v.x, v.y, v.z);
        }
      }
    }
    if (!pos.length) return;

    /* 分两档画：10 cm 以上的边是这间屋子的"结构"，用亮一点的线；
       其余（2.2–10 cm）是细节，压到 0.16 当底噪。
       一档线的老样子是"均匀的线密度"，看着像 CAD 描边；分档之后主轮廓自己会跳出来，
       近看有褶皱、远看只剩骨架 —— 这才是全息勘察该有的层次。 */
    const MAJOR = 0.10;
    const major = [], minor = [];
    for (let i = 0; i < pos.length; i += 6) {
      const dx = pos[i + 3] - pos[i], dy = pos[i + 4] - pos[i + 1], dz = pos[i + 5] - pos[i + 2];
      const dst = (dx * dx + dy * dy + dz * dz) > MAJOR * MAJOR ? major : minor;
      for (let j = 0; j < 6; j++) dst.push(pos[i + j]);
    }

    const make = (arr, mat, name) => {
      let data = arr;
      const n = arr.length / 6;
      if (n > MAX_ALL) {
        const stride = Math.ceil(n / MAX_ALL);
        data = [];
        for (let i = 0; i < n; i += stride) {
          const b = i * 6;
          for (let j = 0; j < 6; j++) data.push(arr[b + j]);
        }
      }
      if (!data.length) return 0;
      const geo = new T.BufferGeometry();
      geo.setAttribute('position', new T.Float32BufferAttribute(data, 3));
      const lines = new T.LineSegments(geo, mat);
      lines.name = name;
      lines.frustumCulled = false;
      lines.visible = false;
      S.scene.add(lines);
      return data.length / 6;
    };
    S.wireCount = make(major, S._wireMat, 'style-wire');
    S.wireLines = S.scene.getObjectByName('style-wire') || null;
    S.wireCountDim = make(minor, S._wireMatDim, 'style-wire-dim');
    S.wireLinesDim = S.scene.getObjectByName('style-wire-dim') || null;
  }

  /* ① 电影剪影专用补光：不是整体拉亮，是几盏看不见的小灯。
     没有这些灯，深色材质 + 低曝光 = 全黑什么也看不见；有了它们，
     柜子、椅背、地面各有一小片暖光，剪影才有层次。全部不投影（省性能也避免硬黑影）。 */
  function ensureStyleLights() {
    if (S.styleFill) return;
    const cb = S.cakeBox ? S.cakeBox.center : new T.Vector3(0, 0.9, 0.3);
    // 注意：S.roomBox 是 Core.boxOf 的返回结构 { box, center, size }，不是 Box3
    const rb = S.roomBox && S.roomBox.box ? S.roomBox.box : { min: new T.Vector3(-3, 0, -3), max: new T.Vector3(3, 3, 3) };
    const rc = S.roomBox && S.roomBox.center ? S.roomBox.center : new T.Vector3();
    const win = S.windowGroup ? Core.boxOf(S.windowGroup) : null;
    const wz = win ? win.center.z : -2.0;
    const defs = [
      { c: 0xffb066, i: 0.70, d: 3.4, p: [cb.x - 0.52, cb.y + 0.52, cb.z + 0.58] },     // 蛋糕左前：暖
      { c: 0xffc48a, i: 0.50, d: 5.6, p: [rb.min.x + 0.8, 1.5, rc.z + 0.5] },            // 左侧柜子：暖
      { c: 0x8fb0ff, i: 0.60, d: 5.2, p: [0, 1.9, wz + 0.5] },                          // 窗口：冷，勾轮廓
      { c: 0xff9a5a, i: 0.36, d: 3.0, p: [cb.x + 0.1, 0.36, cb.z + 0.92] },              // 桌面下方的暖反弹
      { c: 0xffd0a0, i: 0.34, d: 4.4, p: [cb.x + 1.05, 1.72, cb.z - 0.5] },              // 右后：轮廓
      { c: 0x9ab6ff, i: 0.30, d: 4.6, p: [rb.max.x - 0.7, 1.35, wz + 1.2] }              // 窗侧墙角：一点冷补
    ];
    const list = [];
    for (const d of defs) {
      const l = new T.PointLight(d.c, d.i, d.d, 2);
      l.position.set(d.p[0], d.p[1], d.p[2]);
      l.castShadow = false;
      l.visible = false;
      S.scene.add(l);
      list.push(l);
    }
    S.styleFill = list;
  }

  function setStyleLights(on) {
    if (!S.styleFill) return;
    for (const l of S.styleFill) l.visible = on;
  }

  function snapshotStyleBase() {
    if (S._styleBase) return;
    S._styleBase = {
      exposure: S.renderer.toneMappingExposure,
      fogDensity: S.scene.fog ? S.scene.fog.density : null,
      fogColor: S.scene.fog ? S.scene.fog.color.getHex() : null,
      background: S.scene.background && S.scene.background.getHex ? S.scene.background.getHex() : null,
      hemi: S.hemi ? S.hemi.intensity : null,
      moon: S.moon ? S.moon.intensity : null,
      candleGlow: S.candleGlow || 1.45
    };
  }

  function applyStyle(id, silent) {
    if (!S.room || !S.renderer) return;
    ensureStyleResources();
    snapshotStyleBase();
    const base = S._styleBase;
    const known = STYLES.some(s => s.id === id);
    if (!known) id = 'noir';
    S.styleMode = id;

    const useRoom = id !== 'cloud';
    for (const t of styleTargets()) {
      // 老宅窗洞里被临时藏掉的构件（假窗框、帘子、那块灰玻璃）不能被风格切换又打开
      if (t.mesh.userData.suHidden) { t.mesh.visible = false; continue; }
      t.mesh.visible = useRoom;
      if (!useRoom || t.seeThrough) continue;
      if (id === 'noir') t.mesh.material = S._noirMat;
      else if (id === 'blueprint') t.mesh.material = S._holoMat;
      else t.mesh.material = t.orig;
    }

    if (id === 'cloud') buildCloud();
    if (id === 'blueprint') buildWire();
    if (S.cloudGroup) S.cloudGroup.visible = id === 'cloud';
    if (S.wireLines) S.wireLines.visible = id === 'blueprint';
    if (S.wireLinesDim) S.wireLinesDim.visible = id === 'blueprint';

    const setFog = (color, density) => {
      S.scene.fog = new T.FogExp2(color, density);
    };

    if (id === 'noir') {
      // 用户原话「太黑了什么也看不见」：曝光抬到 0.8、雾减半，再加 6 盏小补光。
      // 暗的部分还是暗（材质是新贴图-less 的深色），但家具能被"点亮"而不是曝光冲白。
      S.renderer.toneMappingExposure = 0.8;
      setFog(0x05070e, 0.042);
      S.scene.background = new T.Color(0x04050b);
      if (S.hemi) S.hemi.intensity = 0.26;
      if (S.moon) S.moon.intensity = 1.15;       // 冷侧轮廓光，靠它把剪影勾出来
      if (S.cakeFill) S.cakeFill.intensity = 0.95;
      S.candleGlow = Math.max(S.candleGlow || 1, 2.9);
      ensureStyleLights();
      setStyleLights(true);
    } else if (id === 'cloud') {
      setStyleLights(false);
      S.renderer.toneMappingExposure = 1.0;
      setFog(0x020307, 0.008);
      S.scene.background = new T.Color(0x020307);
      if (S.hemi) S.hemi.intensity = 0.16;
      if (S.moon) S.moon.intensity = 0.5;
      S.candleGlow = 3.1;
    } else if (id === 'blueprint') {
      setStyleLights(false);
      S.renderer.toneMappingExposure = 0.98;
      setFog(0x03101f, 0.02);
      S.scene.background = new T.Color(0x02070f);
      if (S.hemi) S.hemi.intensity = 0.28;
      if (S.moon) S.moon.intensity = 0.7;
      S.candleGlow = Math.max(S.candleGlow || 1, 2.2);
    } else {
      setStyleLights(false);
      S.renderer.toneMappingExposure = base.exposure;
      if (base.fogDensity !== null) setFog(base.fogColor, base.fogDensity);
      if (base.background !== null) S.scene.background = new T.Color(base.background);
      if (S.hemi && base.hemi !== null) S.hemi.intensity = base.hemi;
      if (S.moon && base.moon !== null) S.moon.intensity = base.moon;
      S.candleGlow = base.candleGlow;
    }

    /* 窗洞后景幕的亮度。后景幕取的是大幕中间一块很暗的天（乘 1 时整块接近黑），
       蓝图/点云这两档色调又压得暗，窗外不提亮就是一块黑板；电影剪影只要一点点，原始模型基本不动。
       实测：3 还是一片黑，8 刚好能看见夜蓝底 + 星点 + 雨丝，12 开始发灰偏"白天"。 */
    if (S.windowBackdrop && S.windowBackdrop.material && S.windowBackdrop.material.uniforms) {
      const g = id === 'blueprint' ? 8 : (id === 'cloud' ? 6 : (id === 'noir' ? 1.6 : 1.1));
      S.windowBackdrop.material.uniforms.uGain.value = g;
    }

    if (!silent) {
      const bar = $('#stylebar');
      if (bar) {
        bar.querySelectorAll('button[data-style]').forEach(b => {
          b.classList.toggle('on', b.dataset.style === id);
        });
        const note = $('#styleNote');
        const st = STYLES.find(s => s.id === id);
        if (note && st) note.textContent = st.hint;
      }
      try { localStorage.setItem(STYLE_PREF_KEY, id); } catch (_) { }
    }
    return { mode: id, cloud: S.cloudCount || 0, wire: S.wireCount || 0 };
  }

  function mountStyleBar() {
    if ($('#stylebar') || !S.room) return;
    const bar = document.createElement('div');
    bar.id = 'stylebar';
    const tag = document.createElement('span');
    tag.className = 'sb-tag';
    tag.textContent = '视觉风格';
    bar.appendChild(tag);
    for (const st of STYLES) {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.style = st.id;
      b.textContent = st.label;
      b.title = st.hint + '（快捷键 ' + (STYLES.indexOf(st) + 1) + '）';
      b.addEventListener('click', () => applyStyle(st.id));
      bar.appendChild(b);
    }
    const note = document.createElement('span');
    note.id = 'styleNote';
    note.className = 'sb-note';
    bar.appendChild(note);
    document.body.appendChild(bar);
    applyStyle(S.styleMode || 'noir');   // 挂上来先同步一次高亮与说明

    addEventListener('keydown', e => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= STYLES.length) applyStyle(STYLES[n - 1].id);
    });
  }

  /* 加载提示：资产解析会把主线程冻住 2~4 秒，全黑又不说话，用户会以为「打不开」。
     这里在黑屏上先画一行小字，再去解析 —— 注意必须先让这一帧真的画出来。 */
  function showLoadNote(text) {
    let el = $('#loadnote');
    if (!text) { if (el) el.classList.remove('on'); return; }
    if (!el) {
      el = document.createElement('div');
      el.id = 'loadnote';
      el.innerHTML = '<i class="ln-dot"></i><span class="ln-t"></span>';
      document.body.appendChild(el);
    }
    const t = el.querySelector('.ln-t');
    if (t) t.textContent = text;
    el.classList.add('on');
  }

  /* =============================================================== 启动 */

  async function boot() {
    if (!initRenderer()) return;
    audioCtx();                    // 先建上下文（等第一次点击再 resume）
    addLights();
    addOutdoor();
    addDust();

    /* 开场分镜（顺序不能换）：
       ① 黑屏 + 黑客式逐字打字（两段故事，配按键声）
       ② 全屏变黑 —— 资产解析就藏在这段黑里（解析是同步的，会把主线程冻住 1.6~1.8s，
          所以既不能在打字期间解析，也正好用这块黑屏盖住）
       ③ 脚步声走近窗子（可交互）
       ④ 推开窗 →「序曲」浮现、放大、淡出
       ⑤ 转身 → 整个房间展开，蛋糕上的烛火最亮
       ⑥ 点蜡烛 → 开始游戏 */
    await typeStory();
    await toBlack();
    showLoadNote('正在加载场景 · 42 万面');
    await wait(60);                // 让这行字真的画出来，下面的解析是同步的，会冻住主线程
    await loadAssets();
    showLoadNote();
    buildScene();
    homeView();
    bindUI();
    // 默认「③ 全息勘察」。使用新偏好键，不继承之前选过的 noir。
    applyStyle(params.get('style') || readStylePref() || 'blueprint', true);

    /* 预热：转身到蛋糕那一幕要看的整间房（含影子、蛋糕光晕、烛火材质），
       趁还压在黑屏上先编好、传好。不做这一步的话，镜头停下那一刻会整帧冻住
       0.7–2 s（tools/perf-turn.mjs 实测），用户看到的就是"一转身就卡"。 */
    if (S.cakeView && S.renderer) {
      showLoadNote('正在预热场景 · 着色器与贴图');
      await wait(40);
      prewarmView(S.cakeView.pos, S.cakeView.target, true);
      showLoadNote();
    }

    // 接入总控台 (Mission Control) 调度
    if (window.MissionControl) {
      window.MissionControl.subscribe(function (cfg, changed) {
        if (changed.indexOf('visualTheme') !== -1 && cfg.visualTheme) {
          applyStyle(cfg.visualTheme, false);
        }
        if (changed.indexOf('muted') !== -1 || changed.indexOf('masterVolume') !== -1) {
          if (S.rainGain) {
            var effectiveVol = cfg.muted ? 0 : (0.34 * (cfg.masterVolume != null ? cfg.masterVolume : 1));
            S.rainGain.gain.value = effectiveVol;
          }
        }
        if (changed.indexOf('perfTier') !== -1 && S.renderer) {
          if (cfg.perfTier === 'low') {
            S.renderer.setPixelRatio(1);
          } else {
            S.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
          }
        }
      });
      window.MissionControl.onCommand('skipIntro', function () {
        var skipBtn = $('#btnSkip');
        if (skipBtn) skipBtn.click();
      });
      window.MissionControl.onCommand('lightCandles', function () {
        if (S.candles && S.candles.length) {
          S.candles.forEach(function (c) { lightCandle(c); });
        }
      });
      window.MissionControl.onCommand('openWindow', function () {
        setSash(true);
      });
    }

  /* ============================================================
     影子戏（点第一支蜡烛之后）
     墙上不挂实体球：让「球状闪电」以第三个圆出现，亮着从画外挤进来，
     把父母那两个影子吞掉、过曝、空墙——然后黑屏打字。
     机位只前移一点、收一点视角，不离开这面墙。
     ============================================================ */
  window.__markShadow = true;
  const SHADOW = {
    on: true,
    wall: null, tex: null, ctx: null, cv: null, noise: null,
    veil: null, textBox: null, lines: [],
    camera0: null, target0: null, fov0: null,
    playing: false, done: false,
    mode: 'steps', step: -1, phase: 'steps',
    scrim: null, stepBox: null, whoEl: null, bodyEl: null, hintEl: null, typeTimer: null,
    lv: { cold: 0, ball: 0, over: 0, lean: 0, pres: { dad: 0, mom: 0 } },
    tgt: { cold: 0, ball: 0, over: 0, lean: 0, pres: { dad: 0, mom: 0 } },
    STEPS: null, goStep: null, advance: null,
    /* 交互式开场：黑场先揭示父亲，再把镜头交给母亲，之后接回原有步骤机。 */
    interaction: { phase: 'legacy', dadIndex: 1, momIndex: 2, cameraTween: null }
  };

  /* 影子戏的「讲稿」：一步一句，影子跟着这一步变，按一下走一步。
     文字全部取自原著《球状闪电》序曲（生日夜），只做删节，不改词。 */
  SHADOW.STEPS = [
    { on: { dad: 1, mom: 1 }, pose: { dad: 0, mom: 0 }, cold: 0, ball: 0, over: 0,
      who: '旁白', text: '雷雨之夜。我们三个围着十四个小火苗坐下来。' },
    { on: { dad: 1, mom: 1 }, pose: { dad: 1, mom: 0 }, cold: 0, ball: 0, over: 0,
      who: '爸爸', text: '人生啊，人生这东西……变幻莫测，一切都是概率和机遇。' },
    { on: { dad: 1, mom: 1 }, pose: { dad: 1, mom: 0 }, cold: 0, ball: 0, over: 0,
      who: '妈妈', text: '孩子还小，听不懂这些。' },
    { on: { dad: 1, mom: 1 }, pose: { dad: 1, mom: 0 }, cold: 0, ball: 0, over: 0,
      who: '爸爸', text: '他不小了！他已到了可以知道人生真相的时候了！' },
    { on: { dad: 1, mom: 1 }, pose: { dad: 0, mom: 1 }, cold: 0, ball: 0, over: 0,
      who: '旁白', text: '「妈，别动！」我从她乌黑浓密的头发里拔出一根白头发——只白了一半，另一半还黑着。' },
    { on: { dad: 1, mom: 1 }, pose: { dad: 1, mom: 1 }, cold: 0.10, ball: 0, over: 0,
      who: '爸爸', text: '据我所知，这是你妈妈有生以来长出的第一根白发。' },
    { on: { dad: 1, mom: 1 }, pose: { dad: 1, mom: 0 }, cold: 0, ball: 0, over: 0,
      who: '妈妈', text: '干什么嘛你！拔一根要长七根的！' },
    { on: { dad: 1, mom: 1 }, pose: { dad: 1, mom: 0 }, cold: 0, ball: 0, over: 0,
      who: '爸爸', text: '这就是生命和人生，脆弱而飘忽不定，经不起一丝微风。' },
    { on: { dad: 1, mom: 1 }, pose: { dad: 0, mom: 0 }, cold: 0.16, ball: 0, over: 0,
      who: '旁白', text: '我们都默默无语地看着那一簇小火苗，看着它们从窗外射入的冰冷的青色电光中颤抖。' },
    { on: { dad: 1, mom: 1 }, pose: { dad: 0, mom: 0 }, cold: 0.52, ball: 0.42, over: 0,
      who: '旁白', text: '这时它来了，是穿墙进来的，仿佛来自墙上那幅油画里的幽灵。' },
    { on: { dad: 1, mom: 1 }, pose: { dad: 0, mom: 1 }, cold: 0.78, ball: 1, over: 0, lean: 1,
      who: '旁白', text: '它悬停在爸爸头顶上半米处，啸叫声变得低沉，断断续续，仿佛是冷笑。' },
    { on: { dad: 1, mom: 1 }, pose: { dad: 1, mom: 1 }, cold: 1, ball: 1, over: 1, lean: 1,
      who: '旁白', text: '一道炫目的白炽，一声巨响，仿佛世界在身边爆炸。' },
    { on: { dad: 1, mom: 1 }, pose: { dad: 1, mom: 1 }, cold: 1, ball: 0.12, over: 0.18, lean: 1,
      who: '旁白', text: '爸爸和妈妈的身体瞬间变成了黑白两色——那是一种大理石的颜色。' },
    { on: { dad: 0.62, mom: 0.62 }, pose: { dad: 1, mom: 1 }, cold: 1, ball: 0, over: 0.06, lean: 1,
      who: '旁白', text: '我向那两尊雕像靠过去。手碰到爸爸肩部时，像穿透了一层极薄极脆的薄壳。' },
    { on: { dad: 0.2, mom: 0.2 }, pose: { dad: 1, mom: 1 }, cold: 1, ball: 0, over: 0, lean: 1,
      who: '旁白', text: '两尊雕像在我眼前坍塌下去，像一场微型的雪崩。地毯上出现了两堆白灰。' }
  ];
  /* 叙事节点元数据：保留旧字段，给后续改对白/镜头一个稳定的数据入口。 */
  const SHADOW_NODE_META = [
    ['shadow-rain', 'reveal-family', 'wide-room', 'family'],
    ['father-life', 'reveal-father', 'focus-father', 'father'],
    ['mother-warning', 'focus-mother', 'focus-mother', 'mother'],
    ['father-truth', 'continue-shadow', 'focus-father', 'father'],
    ['white-hair', 'tap-white-hair', 'focus-mother', 'white-hair'],
    ['father-first-hair', 'continue-shadow', 'focus-father', 'father'],
    ['mother-protest', 'continue-shadow', 'focus-mother', 'mother'],
    ['father-life-wind', 'continue-shadow', 'focus-father', 'father'],
    ['candle-cold', 'candle-wait', 'wide-room', 'candle'],
    ['painting-entry', 'tap-painting', 'focus-painting', 'painting'],
    ['ball-above-father', 'tap-window-light', 'focus-father', 'window-light'],
    ['white-blast', 'detonate', 'wide-room', 'ball-lightning'],
    ['marble-shell', 'touch-parent', 'focus-family', 'father-mother'],
    ['ash-collapse', 'continue-shadow', 'wide-room', 'ash']
  ];
  SHADOW.STEPS = SHADOW.STEPS.map((node, i) => {
    const m = SHADOW_NODE_META[i] || ['shadow-' + i, 'continue-shadow', null, null];
    return Object.assign(node, {
      id: m[0], action: m[1], camera: m[2], focus: m[3],
      onEnter: node.onEnter || (() => {}), onExit: node.onExit || (() => {})
    });
  });

  function shadowDom() {
    if (SHADOW.veil) return;
    const mk = (id, css) => {
      const d = document.createElement('div');
      d.id = id; d.style.cssText = css;
      document.body.appendChild(d);
      return d;
    };
    SHADOW.veil = mk('shadowVeil',
      'position:fixed;inset:0;z-index:56;background:#000;opacity:0;pointer-events:none;' +
      'transition:opacity .26s linear;');
    /* 白炽那一下的闪白：只亮一瞬，不是让墙上一直白着 */
    SHADOW.flash = mk('shadowFlash',
      'position:fixed;inset:0;z-index:58;background:#fff;opacity:0;pointer-events:none;' +
      'transition:opacity .9s ease;');
    SHADOW.textBox = mk('shadowText',
      'position:fixed;inset:0;z-index:57;display:grid;place-content:center;gap:.9em;' +
      'pointer-events:none;text-align:center;font-family:var(--serif);' +
      'font-size:clamp(15px,1.35vw,21px);line-height:2.05;letter-spacing:.14em;' +
      'color:#d6dce8;opacity:0;transition:opacity .8s ease;');
    SHADOW.lines = [
      '生日那晚我学会一件事：',
      '有些东西不燃烧，也不留下尸体，',
      '它只是让人消失，剩下两堆很轻的白灰。'
    ].map(t => {
      const s = document.createElement('div');
      s.textContent = t;
      s.style.opacity = '0';
      s.style.transition = 'opacity .9s ease';
      SHADOW.textBox.appendChild(s);
      return s;
    });

    /* 字幕带：像电影字幕那样压一条黑边，字永远落在纯黑上，不会和人影打架。 */
    SHADOW.scrim = mk('shadowScrim',
      'position:fixed;left:0;right:0;bottom:0;height:26vh;z-index:56;pointer-events:none;' +
      'background:linear-gradient(to top,#000 0 58%,rgba(0,0,0,.88) 74%,rgba(0,0,0,.45) 90%,transparent 100%);' +
      'opacity:0;transition:opacity .5s ease;');
    SHADOW.stepBox = mk('shadowStep',
      'position:fixed;left:0;right:0;bottom:5.2vh;z-index:57;display:flex;flex-direction:column;' +
      'align-items:center;gap:.7em;pointer-events:none;text-align:center;' +
      'font-family:var(--serif);opacity:0;transition:opacity .55s ease;');
    SHADOW.whoEl = document.createElement('div');
    SHADOW.whoEl.style.cssText =
      'font-size:clamp(11px,1vw,14px);letter-spacing:.34em;color:#8b93a6;min-height:1.3em;' +
      'text-indent:.34em;transition:color .4s ease;';
    SHADOW.bodyEl = document.createElement('div');
    SHADOW.bodyEl.style.cssText =
      'font-size:clamp(15px,1.5vw,22px);line-height:2.0;letter-spacing:.1em;color:#dde3ee;' +
      'max-width:min(780px,80vw);text-shadow:0 2px 20px rgba(0,0,0,.9),0 0 2px rgba(0,0,0,.6);';
    SHADOW.hintEl = document.createElement('div');
    SHADOW.hintEl.style.cssText =
      'font-size:clamp(10px,.9vw,12px);letter-spacing:.3em;color:rgba(190,197,214,.45);' +
      'text-indent:.3em;margin-top:.2em;transition:opacity .4s ease;';
    SHADOW.stepBox.appendChild(SHADOW.whoEl);
    SHADOW.stepBox.appendChild(SHADOW.bodyEl);
    SHADOW.stepBox.appendChild(SHADOW.hintEl);
  }

  /* 墙：一块自发光的面片，画布当投影幕。不参与光照，所以墙上永远是「亮的」。 */
  function buildShadowWall() {
    if (SHADOW.wall) return;
    shadowDom();
    const W = 1536, H = 972;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    SHADOW.cv = cv;
    SHADOW.ctx = cv.getContext('2d');

    // 墙的颗粒：一次画好，之后每帧贴一次，省重算
    const nz = document.createElement('canvas');
    nz.width = 256; nz.height = 256;
    const nctx = nz.getContext('2d');
    const img = nctx.createImageData(256, 256);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 120 + Math.random() * 135;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 26 + Math.random() * 30;
    }
    nctx.putImageData(img, 0, 0);
    SHADOW.noise = nz;

    SHADOW.tex = new T.CanvasTexture(cv);
    SHADOW.tex.minFilter = T.LinearFilter;
    SHADOW.tex.magFilter = T.LinearFilter;
    // 画布内容本身就是 sRGB：不声明的话 three 当线性色读，墙会白成一片
    if ('colorSpace' in SHADOW.tex) SHADOW.tex.colorSpace = T.SRGBColorSpace;
    const mat = new T.MeshBasicMaterial({
      map: SHADOW.tex, transparent: true, opacity: 0,
      depthWrite: false, toneMapped: false, side: T.DoubleSide
    });
    /* 位置不写死：从蛋糕机位朝那边打一条射线，撞到哪面墙就贴在哪面墙上。
       只认「离得够远 + 法线是横的」那些命中——否则第一下会撞在桌沿、椅背上，
       墙板就挂在半个房间里，把整间房遮住。 */
    const view = S.cakeView || { pos: S.camera.position.clone(), target: new T.Vector3(0, 1, -1) };
    const dir = view.target.clone().sub(view.pos).normalize();
    const rc = new T.Raycaster(view.pos.clone(), dir, 0.05, 16);
    const targets = S.room ? [S.room] : S.scene.children;
    const hits = rc.intersectObjects(targets, true).filter(h => {
      if (!h.object.isMesh || !h.object.visible || h.object.userData.shadowWall) return false;
      if (h.distance < 2.4) return false;
      const n = h.face
        ? h.face.normal.clone().transformDirection(h.object.matrixWorld)
        : dir.clone().negate();
      return Math.abs(n.y) < 0.45;
    });
    let centre;
    if (hits.length) {
      centre = hits[0].point.clone();
    } else {
      const zWall = S.roomBox && S.roomBox.box ? S.roomBox.box.min.z + 0.06 : -2.19;
      centre = new T.Vector3(0, 1.5, zWall);
    }
    centre.y = Math.max(1.2, Math.min(1.7, centre.y));
    /* 不再把画布贴到某面墙上——那样会被餐边柜、椅背挡掉一半，读起来像“墙上一块板”。
       改成挂在镜头前 0.5m 的全屏片：构图完全由画布控制，和那张海报一样是“一束光 + 两个影子”。 */
    const wall = new T.Mesh(new T.PlaneGeometry(1, 1), mat);
    mat.depthTest = false;
    wall.position.set(0, 0, -0.5);
    wall.renderOrder = 999;
    wall.frustumCulled = false;
    wall.visible = false;
    wall.userData.shadowWall = true;
    if (!S.camera.parent) S.scene.add(S.camera);
    S.camera.add(wall);
    SHADOW.wall = wall;
    SHADOW.centre = centre;
  }

  function mixHex(a, b, k) {
    const ca = new T.Color(a).lerp(new T.Color(b), k);
    return '#' + ca.getHexString();
  }
  function smooth(x, a, b) {
    const k = Math.min(1, Math.max(0, (x - a) / (b - a || 1)));
    return k * k * (3 - 2 * k);
  }

  /* 影子的形状：坐着的人——头、肩、躯干，可以举一只杯子。
     之前用两团径向渐变糊，投到墙上只是两个圆，读不出「这是两个人」。 */
  function paintFigure(cx, baseY, s, alpha, opts) {
    const ctx = SHADOW.ctx;
    const R = 0.040 * SHADOW.cv.width * s;   // 头半径，全身约 4.5R
    const ink = 'rgba(9,8,7,' + alpha + ')';
    ctx.save();
    ctx.translate(cx, baseY);
    ctx.shadowColor = 'rgba(9,8,7,' + (alpha * 0.8) + ')';
    ctx.filter = 'blur(' + (R * 0.07).toFixed(1) + 'px)';
    ctx._hadFilter = true;
    ctx.fillStyle = ink;

    // 头（发型的差别比尺寸更能让人一眼认出「妈妈 / 爸爸」）
    ctx.beginPath();
    ctx.ellipse(0, -3.05 * R, R * 0.92, R * 1.05, 0, 0, Math.PI * 2);
    ctx.fill();
    if (opts && opts.hair === 'bob') {
      // 妈妈：齐肩的发，落到肩上再收回来
      ctx.beginPath();
      ctx.moveTo(-R * 0.98, -3.35 * R);
      ctx.quadraticCurveTo(-R * 1.30, -1.95 * R, -R * 1.05, -1.30 * R);
      ctx.quadraticCurveTo(0, -0.85 * R, R * 1.05, -1.30 * R);
      ctx.quadraticCurveTo(R * 1.30, -1.95 * R, R * 0.98, -3.35 * R);
      ctx.quadraticCurveTo(0, -4.20 * R, -R * 0.98, -3.35 * R);
      ctx.closePath();
      ctx.fill();
    } else {
      // 爸爸：短一点的头发，额前留一道
      ctx.beginPath();
      ctx.moveTo(-R * 0.95, -3.40 * R);
      ctx.quadraticCurveTo(-R * 0.30, -4.35 * R, R * 0.70, -3.55 * R);
      ctx.quadraticCurveTo(R * 1.05, -3.10 * R, R * 0.92, -2.60 * R);
      ctx.quadraticCurveTo(0, -3.05 * R, -R * 0.95, -3.40 * R);
      ctx.closePath();
      ctx.fill();
    }

    // 颈 + 肩 + 躯干
    ctx.beginPath();
    ctx.moveTo(-R * 0.52, -2.05 * R);
    ctx.quadraticCurveTo(-R * 2.10, -1.86 * R, -R * 2.72, -0.35 * R);
    ctx.quadraticCurveTo(-R * 3.00, R * 1.55, -R * 2.80, R * 2.60);
    ctx.lineTo(R * 2.80, R * 2.60);
    ctx.quadraticCurveTo(R * 3.00, R * 1.55, R * 2.72, -0.35 * R);
    ctx.quadraticCurveTo(R * 2.10, -1.86 * R, R * 0.52, -2.05 * R);
    ctx.closePath();
    ctx.fill();

    if (opts && opts.arm) {
      // 举杯的那只手臂
      ctx.strokeStyle = ink;
      ctx.lineWidth = R * 1.05;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(R * 1.95, -0.55 * R);
      ctx.quadraticCurveTo(R * 3.50, -1.55 * R, R * 2.65, -3.25 * R);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(R * 2.60, -3.75 * R, R * 0.30, R * 0.44, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.filter = 'none';
    ctx.restore();
  }

  /* u: 0 → 1，整段墙面戏的进度 */
  function drawShadowWall(u) {
    const cv = SHADOW.cv, ctx = SHADOW.ctx;
    const W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);

    const cool = smooth(u, 0.34, 0.64);          // 烛光暖 → 电光冷
    const glow = smooth(u, 0.62, 0.90);          // 第三个圆进来之后整体的过曝
    const overlap = smooth(u, 0.42, 0.66);       // 两个影子靠在一起

    // 底：暗墙 + 一束从上方打下来的光锥（参考剧场顶灯：顶点在上，往下张开）
    ctx.fillStyle = mixHex('#120c08', '#0a0d12', cool);
    ctx.fillRect(0, 0, W, H);

    const apexX = W * 0.50, apexY = -H * 0.20;
    const halfW = W * 0.31, botY = H * 1.08;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(apexX, apexY);
    ctx.lineTo(apexX - halfW, botY);
    ctx.lineTo(apexX + halfW, botY);
    ctx.closePath();
    ctx.clip();
    const cone = ctx.createRadialGradient(apexX, H * 0.40, W * 0.02, apexX, H * 0.40, W * 0.58);
    cone.addColorStop(0, mixHex('#fff4dc', '#f4f9ff', cool));
    cone.addColorStop(0.28, mixHex('#ffc887', '#cfe0f4', cool));
    cone.addColorStop(0.64, mixHex('#a9702f', '#6b7d95', cool));
    cone.addColorStop(1, mixHex('#1a120c', '#0b1016', cool));
    ctx.fillStyle = cone;
    ctx.fillRect(0, 0, W, H);
    const drop = ctx.createLinearGradient(0, H * 0.06, 0, botY);
    drop.addColorStop(0, 'rgba(0,0,0,0)');
    drop.addColorStop(1, 'rgba(8,6,5,0.12)');
    ctx.fillStyle = drop;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    // 颗粒（很轻，只用来打掉塑料感）
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.globalCompositeOperation = 'overlay';
    for (let y = 0; y < H; y += 256) {
      for (let x = 0; x < W; x += 256) ctx.drawImage(SHADOW.noise, x, y);
    }
    ctx.restore();

    // 两个影子：先分开看，再靠拢、重叠
    const baseY = H * 0.94;
    const spread = W * (0.115 - 0.085 * overlap);
    const fadeOut = 1 - smooth(u, 0.72, 0.88);
    if (fadeOut > 0.001) {
      paintFigure(W * 0.5 - spread, baseY, 1.02 - 0.06 * overlap, 0.9 * fadeOut, { hair: 'bob' });
      paintFigure(W * 0.5 + spread, baseY, 0.98 - 0.06 * overlap, 0.9 * fadeOut, { arm: true, hair: 'short' });
    }

    // 第三个圆：亮着从右边挤进来，越走越大
    const k3 = smooth(u, 0.58, 0.92);
    if (k3 > 0.001) {
      const cx = W * (1.16 - 0.64 * k3);
      const r = W * (0.05 + 0.30 * k3);
      const g3 = ctx.createRadialGradient(cx, baseY, r * 0.05, cx, baseY, r);
      g3.addColorStop(0, 'rgba(255,255,255,1)');
      g3.addColorStop(0.30, 'rgba(255,250,236,0.96)');
      g3.addColorStop(0.52, 'rgba(255,226,180,0.42)');
      g3.addColorStop(1, 'rgba(255,214,160,0)');
      ctx.fillStyle = g3;
      ctx.beginPath();
      ctx.arc(cx, baseY, r, 0, Math.PI * 2);
      ctx.fill();
      // 电弧：几根细白线从圆缘甩出去
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,' + (0.55 * k3) + ')';
      ctx.lineWidth = Math.max(1.5, r * 0.012);
      for (let i = 0; i < 7; i++) {
        const a0 = Math.random() * Math.PI * 2;
        let x = cx + Math.cos(a0) * r * 0.92, y = baseY + Math.sin(a0) * r * 0.92;
        ctx.beginPath(); ctx.moveTo(x, y);
        for (let s = 0; s < 4; s++) {
          x += Math.cos(a0 + (Math.random() - 0.5) * 1.1) * r * 0.16;
          y += Math.sin(a0 + (Math.random() - 0.5) * 1.1) * r * 0.16;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    // 过曝
    if (glow > 0.001) {
      ctx.fillStyle = 'rgba(255,252,246,' + (glow * 0.97) + ')';
      ctx.fillRect(0, 0, W, H);
    }

SHADOW.tex.needsUpdate = true;
  }

/* ── 真实投影的影子戏：一束聚光灯打在墙上，两个剪影站在光里投出真影子 ── */
const STAGE = { group: null, spot: null, dad: null, mom: null, receive: null, on: false };

function buildShadowStage() {
  if (STAGE.group) return STAGE.group;
  const g = new T.Group();
  const zWall = (S.roomBox && S.roomBox.box) ? S.roomBox.box.min.z + 0.03 : -2.19;

  // 受光的墙板（自带材质，不依赖房间模型是否开了 receiveShadow）
  const receiver = new T.Mesh(
    new T.PlaneGeometry(6.4, 3.6),
    new T.MeshStandardMaterial({ color: 0x2b3444, roughness: 0.94, metalness: 0 })
  );
  receiver.position.set(-0.20, 1.50, -2.20);
  receiver.receiveShadow = true;
  g.add(receiver);

  const loader = new T.TextureLoader();
  const figure = (file, aspect, h, x, z) => {
    const tex = loader.load(file);
    if ('colorSpace' in tex) tex.colorSpace = T.SRGBColorSpace;
    const m = new T.Mesh(
      new T.PlaneGeometry(h * aspect, h),
      new T.MeshBasicMaterial({
        map: tex, color: 0x000000, transparent: true, alphaTest: 0.5,
        side: T.DoubleSide, toneMapped: false
      })
    );
    m.position.set(x, h / 2, z);
    m.castShadow = true;
    m.customDepthMaterial = new T.MeshDepthMaterial({
      depthPacking: T.RGBADepthPacking, map: tex, alphaTest: 0.5
    });
    return m;
  };
  const dad = figure('assets/shadow/dad.png', 336 / 1024, 1.72, -0.72, -1.86);
  const mom = figure('assets/shadow/mom.png', 211 / 1024, 1.60, -0.02, -1.86);
  g.add(dad, mom);

  // 光：从桌子那侧往墙打，人夹在中间，影子往墙上去
  const spot = new T.SpotLight(0xffb069, 140, 12, 0.78, 0.9, 2);
  spot.position.set(-0.35, 1.32, -0.35);
  spot.target.position.set(-0.20, 1.42, -2.20);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  spot.shadow.bias = -0.0015;
  spot.shadow.camera.near = 0.3;
  spot.shadow.camera.far = 8;
  g.add(spot, spot.target);

  S.scene.add(g);
  STAGE.group = g; STAGE.spot = spot; STAGE.dad = dad; STAGE.mom = mom;
  // 推镜/取景以这块帘子为准
  SHADOW.centre = new T.Vector3(-0.20, 1.40, -2.20);
  STAGE.receive = receiver; STAGE.zWall = zWall;
  STAGE.on = true;
  return g;
}

  function enterShadowPlayOld(done) {
    if (!SHADOW.on || SHADOW.playing) return;
    buildShadowWall();
    shadowDom();
    SHADOW.playing = true;
    SHADOW.done = false;
    var ovEl = document.getElementById('overture');
    if (ovEl) ovEl.classList.remove('show', 'grow');
    const prevStage = S.stage;
    S.stage = 'shadow';
    showHint('');
    // 戏中戏：这一段不希望顶栏/风格栏露出来抢画面
    document.body.classList.add('stage-mode');

    if (S.controls) S.controls.enabled = false;
    const cam = S.camera;
    SHADOW.camera0 = cam.position.clone();
    SHADOW.target0 = (S.controls ? S.controls.target : new T.Vector3(0, 1, 0)).clone();
    SHADOW.fov0 = cam.fov;
    S.camHold = true;

    // 真光淡进来（不再有贴图墙）
    if (S.renderer && S.renderer.shadowMap) S.renderer.shadowMap.enabled = true;
    buildShadowStage();
    STAGE.group.visible = true;
    STAGE.spot.intensity = 0;
    if (S.room) { STAGE.roomWas = S.room.visible; S.room.visible = false; }
    Core.tween({
      from: 0, to: 140, dur: 700, ease: Core.easeOutCubic,
      onUpdate: v => { STAGE.spot.intensity = v; }
    });

    // 机位：只往前挪一点、把视角收窄，像镜头缓缓推近这面墙
    const c = SHADOW.centre || new T.Vector3(0, 1.4, -2.2);
    const d = c.clone().sub(SHADOW.camera0).normalize();
    const to = c.clone().addScaledVector(d, -2.55);
    to.y = Math.min(c.y + 0.05, to.y);
    Core.tween({
      from: 0, to: 1, dur: 2600, ease: Core.easeInOutCubic,
      onUpdate: v => {
        cam.position.lerpVectors(SHADOW.camera0, to, v);
        cam.fov = SHADOW.fov0 + (52 - SHADOW.fov0) * v;
        cam.updateProjectionMatrix();
        if (!S.controls) cam.lookAt(c);
      }
    });

    // 光自己晃：烛火不稳，影子就跟着轻轻动
    Core.tween({
      from: 0, to: 1, dur: 5200, ease: v => v,
      onUpdate: v => {
        if (!STAGE.spot) return;
        STAGE.spot.position.x = -0.35 + Math.sin(v * 9.0) * 0.05;
        STAGE.spot.position.y = 1.32 + Math.cos(v * 7.0) * 0.026;
        STAGE.spot.intensity = 140 * (0.84 + 0.16 * Math.sin(v * 23));
        STAGE.spot.target.position.x = Math.sin(v * 4.2) * 0.05;
      }
    });

    // 过曝之后的黑：硬切，不做渐隐
    setTimeout(() => {
      SHADOW.veil.style.opacity = '1';
      if (SHADOW.wall) SHADOW.wall.visible = false;
      if (STAGE.group) STAGE.group.visible = false;
      if (S.room && STAGE.roomWas !== undefined) S.room.visible = STAGE.roomWas;
    }, 5400);

    // 打字
    setTimeout(() => {
      SHADOW.textBox.style.opacity = '1';
      SHADOW.lines.forEach((el, i) => setTimeout(() => { el.style.opacity = '1'; }, 260 + i * 1150));
    }, 5700);

    // 点一下继续
    setTimeout(() => {
      SHADOW.playing = false;
      SHADOW.done = true;
    S.camHold = false;
      const go = () => {
        document.removeEventListener('click', go);
        SHADOW.textBox.style.opacity = '0';
        SHADOW.veil.style.opacity = '0';
        SHADOW.wall.visible = false;
        // 回到蛋糕机位
        const cam2 = S.camera;
        const from = cam2.position.clone(), to2 = SHADOW.camera0, f0 = cam2.fov, f1 = SHADOW.fov0;
        Core.tween({
          from: 0, to: 1, dur: 900, ease: Core.easeOutCubic,
          onUpdate: v => {
            cam2.position.lerpVectors(from, to2, v);
            cam2.fov = f0 + (f1 - f0) * v;
            cam2.updateProjectionMatrix();
          },
          onDone: () => {
            S.stage = prevStage === 'shadow' ? 'cake' : prevStage;
            if (S.controls) {
              S.controls.enabled = true;
              S.controls.target.copy(SHADOW.target0);
              S.controls.update();
            }
            if (typeof done === 'function') done();
            else if (window.ClimaxSystem) window.ClimaxSystem.startClimaxSequence();
          }
        });
      };
      document.addEventListener('click', go, { once: true });
      showHint('点一下');
    }, 8200);
  }
    window.__markExport = true;
  
/* ═══════════════════════════════════════════════════════════════
   幕间舞台：独立场景 —— 一面墙、一束真光、两个人、一个越来越大的黑圆
   房间与它互不干扰（渲染时整幕只画这一场），演完黑场打字再交回房间。
   ═══════════════════════════════════════════════════════════════ */
const SCN = {
  scene: null, cam: null, spot: null, wall: null, wallMesh: null, floor: null, ball: null,
  dad: null, mom: null, figures: [], ready: false, progress: 0, startedAt: 0,
  preview: false, fadeTimers: []
};

function shadowTexture(loader, uri, onLoad) {
  const tex = loader.load(uri, function (loaded) {
    if ('colorSpace' in loaded) loaded.colorSpace = T.SRGBColorSpace;
    if (typeof onLoad === 'function') onLoad(loaded);
  });
  if ('colorSpace' in tex) tex.colorSpace = T.SRGBColorSpace;
  return tex;
}

function plasterTexture() {
  const cv = document.createElement('canvas');
  cv.width = 512; cv.height = 512;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#332d27';
  ctx.fillRect(0, 0, cv.width, cv.height);
  const img = ctx.createImageData(cv.width, cv.height);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 24;
    img.data[i] = 51 + n; img.data[i + 1] = 45 + n; img.data[i + 2] = 39 + n; img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new T.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = T.RepeatWrapping;
  tex.repeat.set(3, 2);
  if ('colorSpace' in tex) tex.colorSpace = T.SRGBColorSpace;
  return tex;
}

/* 圆的贴图：暖白核 + 橙晕 + 透明边，加法混合用。之前用的是纯黑圆片，在黑墙上等于一个洞。 */
function glowTexture() {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 256;
  const ctx = cv.getContext('2d');
  const g = ctx.createRadialGradient(128, 128, 2, 128, 128, 126);
  g.addColorStop(0, 'rgba(255,255,255,0.98)');
  g.addColorStop(0.10, 'rgba(255,250,240,0.86)');
  g.addColorStop(0.24, 'rgba(255,228,190,0.52)');
  g.addColorStop(0.46, 'rgba(255,202,150,0.22)');
  g.addColorStop(0.70, 'rgba(255,182,116,0.07)');
  g.addColorStop(1, 'rgba(255,172,104,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new T.CanvasTexture(cv);
  if ('colorSpace' in tex) tex.colorSpace = T.SRGBColorSpace;
  return tex;
}

function buildStageScene() {
  if (SCN.ready) return;
  const sc = new T.Scene();
  sc.background = new T.Color(0x05060a);
  const cam = new T.PerspectiveCamera(44, Math.max(0.35, innerWidth / innerHeight), 0.1, 60);
  cam.position.set(0, 1.36, 3.72);
  cam.lookAt(0, 1.06, -1.6);

  // Coarse plaster receiver: the projection surface has a little grain and relief.
  const plaster = plasterTexture();
  const wallMat = new T.MeshStandardMaterial({
    map: plaster, bumpMap: plaster, bumpScale: 0.035,
    color: 0xb39472, roughness: 0.98, metalness: 0
  });
  /* 墙做成一整面、上下都留足余量：镜头里不该看见地面的接缝。
     之前留了一块 4m 深的地板，聚光灯把它打成横贯全屏的亮带，整幕立刻变成"舞台"而不是"墙"。 */
  const wallMesh = new T.Mesh(new T.PlaneGeometry(18, 13), wallMat);
  wallMesh.position.set(0, 1.05, -1.6);
  wallMesh.receiveShadow = true;
  sc.add(wallMesh);

  // 地板不画（影子只需要墙），对象留着是为了别处引用时不至于炸
  const floor = new T.Mesh(new T.PlaneGeometry(9, 4), new T.MeshStandardMaterial({ color: 0x0d0b09, roughness: 1, metalness: 0 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -0.02, 0.2);
  floor.receiveShadow = true;
  floor.visible = false;
  sc.add(floor);

  const spot = new T.SpotLight(0xffb066, 0, 16, 0.74, 0.95, 2);
  spot.position.set(0.10, 1.88, 2.15);
  spot.target.position.set(0.02, 1.20, -1.6);
  spot.castShadow = true;
  spot.shadow.mapSize.set(2048, 2048);
  spot.shadow.bias = -0.0012;
  spot.shadow.camera.near = 0.4;
  spot.shadow.camera.far = 12;
  sc.add(spot, spot.target);
  sc.add(new T.AmbientLight(0x1b2436, 0.22));

  const loader = new T.TextureLoader();
  loader.setCrossOrigin('');
  const data = window.SHADOW_DATA || {};
  const makeFigure = (name, baseFile, variantFile, fallbackKey, aspect, h, x, y, phase) => {
    const fallbackUri = data[fallbackKey];
    const base = shadowTexture(loader, fallbackUri || ('assets/shadow/' + baseFile));
    const group = new T.Group();
    group.position.set(x, y, 0.42);
    group.userData.shadowFigure = name;
    const makePlane = (tex, opacity) => {
      const mat = new T.MeshBasicMaterial({
        map: tex, color: 0xffffff, transparent: true, opacity,
        alphaTest: 0.42, side: T.DoubleSide, toneMapped: false,
        depthWrite: false,
        /* 只让这块片子"投"影子、不把自己画出来：
           灯离人越近，本体和影子就错得越开，画出来会像屏幕上有两倍的人。 */
        colorWrite: false
      });
      const mesh = new T.Mesh(new T.PlaneGeometry(h * aspect, h), mat);
      mesh.castShadow = true;
      mesh.customDepthMaterial = new T.MeshDepthMaterial({
        depthPacking: T.RGBADepthPacking, map: tex, alphaTest: 0.42,
        transparent: false, depthWrite: true
      });
      mesh.userData.shadowMask = name;
      return mesh;
    };
    const basePlane = makePlane(base, 0.001);
    const variantPlane = makePlane(base, 0.0);
    variantPlane.visible = false;
    group.add(basePlane, variantPlane);
    const item = {
      name, group, base: basePlane, variant: variantPlane, phase,
      variantReady: false, crossfade: 0,
      baseFile, variantFile, fallbackKey
    };
    // Prefer the authored dad-glass/mom-stand file when it exists; keep the inline mask until it resolves.
    loader.load('assets/shadow/' + baseFile, tex => {
      if ('colorSpace' in tex) tex.colorSpace = T.SRGBColorSpace;
      basePlane.material.map = tex;
      basePlane.customDepthMaterial.map = tex;
      basePlane.material.needsUpdate = true;
      basePlane.customDepthMaterial.needsUpdate = true;
      if (!item.variantReady) {
        variantPlane.material.map = tex;
        variantPlane.customDepthMaterial.map = tex;
      }
    }, undefined, () => { /* file:// fallback remains active */ });
    // Optional variants are deliberately best-effort. Missing files keep the two-mask fallback working.
    loader.load('assets/shadow/' + variantFile, tex => {
      if ('colorSpace' in tex) tex.colorSpace = T.SRGBColorSpace;
      variantPlane.material.map = tex;
      variantPlane.customDepthMaterial.map = tex;
      variantPlane.material.needsUpdate = true;
      variantPlane.customDepthMaterial.needsUpdate = true;
      item.variantReady = true;
      variantPlane.visible = true;
    }, undefined, () => { item.variantReady = false; });
    return item;
  };

  // The four requested names are the authored contract; dad.png/mom.png are the file:// fallback.
  const dad = makeFigure('dad', 'dad-glass.png', 'dad-drink.png', 'dad', 336 / 1024, 1.74, 0.34, 0.87, 0.2);
  const mom = makeFigure('mom', 'mom-stand.png', 'mom-turn.png', 'mom', 211 / 1024, 1.60, -0.46, 0.80, 1.7);
  sc.add(dad.group, mom.group);

  /* 第三个「圆」：加法混合的光球，不是黑片。
     黑圆片贴在黑墙上只会读成一个洞，故事里的东西得是"亮着的东西"。 */
  const ball = new T.Sprite(new T.SpriteMaterial({
    map: glowTexture(), transparent: true, opacity: 0,
    blending: T.AdditiveBlending, depthWrite: false, toneMapped: false
  }));
  ball.position.set(2.1, 1.32, -1.42);
  ball.scale.setScalar(0.6);
  sc.add(ball);

  /* 灯的"呼吸"：灯位附近一团很淡的暖光。
     早先试过几何锥体，加法混合下锥面会露出一整个硬边的圆盘，比没有更假。 */
  const beamTo = new T.Vector3(spot.target.position.x, 1.30, -1.62);
  const beam = new T.Sprite(new T.SpriteMaterial({
    map: glowTexture(), color: 0xffb066, transparent: true, opacity: 0.12,
    blending: T.AdditiveBlending, depthWrite: false, toneMapped: false
  }));
  beam.position.copy(spot.position).lerp(beamTo, 0.18);
  beam.scale.setScalar(1.55);
  sc.add(beam);

  SCN.scene = sc; SCN.cam = cam; SCN.spot = spot; SCN.wall = wallMat; SCN.wallMesh = wallMesh;
  SCN.floor = floor; SCN.ball = ball; SCN.beam = beam; SCN.dad = dad; SCN.mom = mom; SCN.figures = [dad, mom];
  S.stageScene = sc; S.stageCam = cam; SCN.ready = true;
}

function shadowEase(x) { return Math.max(0, Math.min(1, x)); }

// 旧的时间驱动（?shadowShot 预览 / 调参时还在用）：把"总进度"摊成各个水平值
function setShadowProgress(progress) {
  if (!SCN.ready) buildStageScene();
  const v = shadowEase(progress);
  SCN.progress = v;
  const tgt = SHADOW.tgt;
  tgt.cold = Math.max(0, Math.min(1, (v - 0.42) / 0.34));
  tgt.ball = Math.max(0, Math.min(1, (v - 0.52) / 0.40));
  tgt.over = Math.max(0, Math.min(1, (v - 0.86) / 0.14));
  tgt.pres.dad = tgt.pres.mom = v >= 0.28 ? 1 : 0;
  tgt.lean = 0;
  SHADOW.mode = 'progress';
  Object.assign(SHADOW.lv, { cold: tgt.cold, ball: tgt.ball, over: tgt.over, lean: 0 });
  SHADOW.lv.pres.dad = tgt.pres.dad; SHADOW.lv.pres.mom = tgt.pres.mom;
}

/* 把 SHADOW.lv 这套水平值写到舞台物件上。
   两种模式共用这一个出口：步骤机每帧把 lv 往 tgt 上靠，预览模式直接 snap。 */
function applyShadowLook(t) {
  if (!SCN.ready) return;
  const lv = SHADOW.lv;
  const warm = new T.Color(0xffb066), cold = new T.Color(0xbcd4ff);
  const c = lv.cold;
  SCN.spot.color.copy(warm).lerp(cold, c);
  SCN.wall.color.setHex(0x2a2118).lerp(new T.Color(0x121a2a), c * 0.92);
  /* 灯位缓慢游走：越冷越靠近爸爸头顶，两人的影子就被拉长、越贴在一起。 */
  const wob = Math.sin(t * 0.5) * 0.05;
  SCN.spot.position.set(0.34 + 0.30 * (1 - c) + wob, 1.86 + 0.04 * Math.sin(t * 0.37), 2.10 - 0.30 * c);
  SCN.spot.target.position.set(0.34 * c + wob * 0.4, 1.22, -1.6);
  SCN.spot.intensity = 520 * (1 + lv.over * 2.2);
  if (SCN.beam) {
    if (!SCN._bt) SCN._bt = new T.Vector3();
    SCN._bt.set(SCN.spot.target.position.x, 1.30, -1.62);
    SCN.beam.position.copy(SCN.spot.position).lerp(SCN._bt, 0.18);
    SCN.beam.material.opacity = 0.10 + 0.03 * Math.sin(t * 13) + 0.04 * lv.cold;
  }

  const b = lv.ball;
  SCN.ball.material.opacity = b <= 0.002 ? 0 : Math.min(1, 0.82 * b + 0.18);
  SCN.ball.position.set(2.05 - 1.71 * b, 1.33 + 0.07 * b + Math.sin(t * 0.8) * 0.014 * b, -1.42);
  SCN.ball.scale.setScalar((0.55 + 1.75 * b) * (1 - 0.55 * lv.over));

  SCN.figures.forEach(fig => {
    const p = lv.pres[fig.name] || 0;
    const cf = fig.crossfade;
    fig.base.material.opacity = 0.001 + p * (1 - cf) * 0.999;
    fig.variant.material.opacity = p * cf;
    fig.base.customDepthMaterial.opacity = p * (1 - cf);
    fig.variant.customDepthMaterial.opacity = p * cf;
    fig.base.visible = p > 0.004 && cf < 0.999;
    fig.variant.visible = p > 0.004 && cf > 0.001 && fig.variantReady;
    // 出场 / 消失：人从地面长起来，最后又缩回去
    fig.group.scale.y = 0.55 + 0.45 * p;
    fig.group.scale.x = 0.72 + 0.28 * p;
  });
  SCN.mom.group.position.x = -0.46 + 0.30 * (lv.lean || 0);

  /* 白炽那一下交给全屏闪白去做，墙上的曝光只抬一点点——
     1.45 那档会把聚光灯的椭圆照成一张白纸，反而看不出"炸"。 */
  S.renderer.toneMappingExposure = 0.72 + lv.over * 0.45;
}

/* 步骤机：把 lv 向 tgt 柔和地靠过去（每帧一次，所以影子一直在"跟着"这句话变）。
   注意 t 是秒（sceneTime），不是毫秒——这里的 dt 也按秒算。 */
function stepLook(t, dtS) {
  const k = Math.min(1, dtS / 0.24);
  const lv = SHADOW.lv, tgt = SHADOW.tgt;
  lv.cold += (tgt.cold - lv.cold) * k;
  lv.ball += (tgt.ball - lv.ball) * k;
  lv.over += (tgt.over - lv.over) * k;
  lv.lean += ((tgt.lean || 0) - lv.lean) * k;
  lv.pres.dad += ((tgt.pres.dad || 0) - lv.pres.dad) * k;
  lv.pres.mom += ((tgt.pres.mom || 0) - lv.pres.mom) * k;
  applyShadowLook(t);
}

function updateShadowStage(t) {
  if (!SCN.ready || S.stageRender !== 'stage') return;
  const dtS = Math.min(0.09, t - (SCN.lastT == null ? t : SCN.lastT));
  SCN.lastT = t;
  if (SHADOW.mode === 'progress') {
    if (!SCN.preview && SCN.startedAt) setShadowProgress((performance.now() - SCN.startedAt) / 5200);
    applyShadowLook(t);
  } else {
    stepLook(t, dtS);
  }
  for (const fig of SCN.figures) {
    // 呼吸 ±1.5% + 极小的上下漂移；颜色只来自那盏灯
    const breathe = 1 + Math.sin(t * 1.15 + fig.phase) * 0.015;
    fig.group.scale.y *= breathe;
    fig.group.scale.x *= breathe;
    const baseY = fig.group.userData.__baseY == null ? fig.group.position.y : fig.group.userData.__baseY;
    fig.group.position.y += (baseY + Math.sin(t * 0.72 + fig.phase) * 0.006 - fig.group.position.y) * 0.18;
    const edge = 0.42 + Math.sin(t * 0.42 + fig.phase) * 0.018 + Math.sin(t * 0.17 + fig.phase * 2) * 0.006;
    [fig.base, fig.variant].forEach(plane => {
      plane.material.alphaTest = edge;
      plane.customDepthMaterial.alphaTest = edge;
    });
  }
}
window.__shadowStageUpdate = updateShadowStage;

function fadeFigure(fig, toVariant) {
  if (!fig || !fig.variantReady) return;
  // 只 tween crossfade，材质透明度由 applyShadowLook 统一写，免得两边打架
  Core.tween({ from: fig.crossfade, to: toVariant ? 1 : 0, dur: 600,
    ease: Core.easeInOutCubic || Core.easeOutCubic,
    onUpdate: v => { fig.crossfade = v; } });
}

function fadeFigure(fig, toVariant) {
  if (!fig || !fig.variantReady) return;
  const from = fig.crossfade;
  const to = toVariant ? 1 : 0;
  Core.tween({ from, to, dur: 600, ease: Core.easeInOutCubic || Core.easeOutCubic, onUpdate: v => {
    fig.crossfade = v;
    fig.base.material.opacity = 0.001 * (1 - v);
    fig.variant.material.opacity = 0.001 * v;
    fig.base.customDepthMaterial.opacity = 1 - v;
    fig.variant.customDepthMaterial.opacity = v;
    fig.base.visible = v < 0.999;
    fig.variant.visible = v > 0.001;
  }});
}

/* 影子戏：黑场切入 → 光起 → 两个影子站定 →（每按一下）一句原文 + 影子跟着变
   → 冷光 / 光球 / 白炽 → 石像 → 坍塌 → 黑场三句收尾。
   节奏完全交给读者：不再自己往下播。 */
  /* ------------------------------------------------ 冰箱：影子戏之后的那一拍
     老宅里本来就有冰箱（节点名 Kitchen_Refrigerator_Simple，0.74x1.49x0.61，在餐桌旁）。
     它整个箱体是一个网格（Geom3D_685），门不可拆，所以开门时把原箱体藏掉，
     换成"内胆 + 隔板 + 门板"三件现场搭的东西；门板材质用的是原箱体材质的克隆，
     颜色和贴图能对上，关着的时候仍然是模型本身。 */
  const FRIDGE = { built: false, root: null, body: null, door: null, inner: null, light: null, open: 0, step: 0, off: null };

  function findFridge() {
    if (FRIDGE.root) return FRIDGE.root;
    let root = null, why = 'name';
    S.room.traverse(o => { if (!root && /Kitchen_Refrigerator_Simple/i.test(o.name || '')) root = o; });
    /* 名字匹配不上时按几何兜底：这台冰箱的世界盒中心约 (2.34, 0.75, 0.91)、0.74x1.49x0.61 */
    if (!root) {
      why = 'bbox';
      let best = 1e9;
      S.room.traverse(o => {
        if (!o.isMesh) return;
        const bb = new T.Box3().setFromObject(o);
        const sz = bb.getSize(new T.Vector3());
        const cc = bb.getCenter(new T.Vector3());
        const d = Math.abs(cc.x - 2.34) + Math.abs(cc.z - 0.91) + Math.abs(sz.y - 1.49) + Math.abs(sz.x - 0.74);
        if (d < 0.12 && d < best) { best = d; root = o; }
      });
    }
    FRIDGE.why = why;
    FRIDGE.root = root || null;
    return FRIDGE.root;
  }

  function buildFridgeInterior() {
    const root = findFridge();
    if (!root || FRIDGE.built) return false;
    const b = new T.Box3().setFromObject(root);
    const size = b.getSize(new T.Vector3());
    const c = b.getCenter(new T.Vector3());
    FRIDGE.box = { b, size, c };
    let body = null, best = 0;
    root.traverse(o => {
      if (!o.isMesh) return;
      const s = new T.Box3().setFromObject(o).getSize(new T.Vector3());
      const v = s.x * s.y * s.z;
      if (v > best) { best = v; body = o; }
    });
    FRIDGE.body = body;
    const w = size.x, h = size.y, d = size.z;

    const inner = new T.Group();
    inner.name = 'fridge-inner';
    inner.visible = false;
    /* 内胆：BackSide 的盒子，从外面看不到，开门才看得见四壁 */
    const shell = new T.Mesh(new T.BoxGeometry(w * .97, h * .97, d * .95),
      new T.MeshStandardMaterial({ color: 0xe7ebe6, roughness: .86, metalness: .04, side: T.BackSide }));
    shell.position.set(c.x, c.y, c.z + d * .01);
    inner.add(shell);
    /* 两层隔板 */
    const shelfMat = new T.MeshStandardMaterial({ color: 0xeef1ec, roughness: .62, metalness: .1 });
    for (const t of [0.34, 0.64]) {
      const sh = new T.Mesh(new T.BoxGeometry(w * .9, .014, d * .86), shelfMat);
      sh.position.set(c.x, b.min.y + h * t, c.z + d * .015);
      inner.add(sh);
    }
    /* 占位块：真正的熟鸡/熟鱼到货以后换掉它 */
    const ph = new T.Mesh(new T.BoxGeometry(.17, .17, .17),
      new T.MeshStandardMaterial({ color: 0x9fb0aa, roughness: .48, metalness: .38 }));
    ph.name = 'fridge-placeholder';
    ph.rotation.set(0, 0, 0);
    ph.position.set(c.x - .02, b.min.y + h * .34 + .085, c.z + d * .04);
    inner.add(ph);
    FRIDGE.placeholder = ph;

    /* 熟鸡 / 熟鱼：samples/meat-all.glb（由 tools/obj-to-glb.cjs 从 C1916 卡通肉类素材包转出）。
       加载失败就继续用占位块，不影响这一拍。 */
    fetch('samples/meat-all.glb').then(r => r.arrayBuffer()).then(ab => Core.parseModel(ab, 'meat-cooked.glb')).then(g => {
      FRIDGE.food = [];
      console.log('[prologue] fridge food scene:', (g.children||[]).length);
      /* 烤色：GLB 里贴图没嵌进去，这里直接给一层熟肉材质 */
      const roast = new T.MeshStandardMaterial({ color: 0x9c5330, roughness: .72, metalness: 0, emissive: 0x2a0f06, emissiveIntensity: .8 });
      /* 工作台里用短名，素材里是 geo_*_mat_meat_0，这里做一层映射。 */
      const MEAT_ALIAS = {
        meat_chicken: 'geo_fullchicken_mat_meat_0',
        meat_fish: 'geo_fish_mat_meat_0',
        meat_leg: 'geo_chickenleg_mat_meat_0',
        meat_steak: 'geo_steak_mat_meat_0',
        meat_porkchop: 'geo_porkchop_mat_meat_0',
        meat_groundbeef: 'geo_groundbeef_01_mat_meat_0',
        meat_rackoflamb: 'geo_rackoflamb_mat_meat_0',
        meat_chunks: 'geo_meatchunks_mat_meat_0'
      };
      const put = (name, x, y, z, rotY, rotX) => {
        const realName = MEAT_ALIAS[name] || name;
        const src = g.getObjectByName(realName);
        if (!src) return null;
        const m = src.clone(true);
        /* OBJ 素材是厘米级原始尺寸，统一归一到最大边 0.22 m，Y 再按包围盒落到板上 */
        const bb0 = new T.Box3().setFromObject(m);
        const sd0 = bb0.getSize(new T.Vector3());
        const md0 = Math.max(sd0.x, sd0.y, sd0.z) || 1;
        m.scale.multiplyScalar(0.22 / md0);
        m.rotation.set(rotX == null ? 0 : rotX, rotY, 0);
        m.traverse(n => { if (n.isMesh) { n.castShadow = false; n.receiveShadow = false; n.material = roast; } });
        m.castShadow = true; m.receiveShadow = true;
        m.position.set(x, 0, z);
        m.updateMatrixWorld(true);
        const mb = new T.Box3().setFromObject(m);
        m.position.set(x, y - mb.min.y, z);
        inner.add(m);
        FRIDGE.food.push(m);
        return m;
      };
      FRIDGE.put = put;
      /* 上架：鱼 + 鸡腿；下架：整鸡（Blender 导出后的节点名） */
      const fish = put('meat_fish', c.x - .10, b.min.y + h * .64 + .075, c.z + .13, -1.45, -Math.PI / 2);
      if (fish) fish.rotation.y += Math.PI / 2;
      put('meat_leg', c.x + .14, b.min.y + h * .64 + .075, c.z + .10, 0.9, -Math.PI / 2);
      put('meat_chicken', c.x - .01, b.min.y + h * .34 + .070, c.z + .15, 0.35, Math.PI / 2);
      /* 让每件食物真的"坐"在最近的隔板面上，而不是浮着。 */
      {
        const tops = [b.min.y + 0.026, b.min.y + h * .335 + 0.014, b.min.y + h * .63 + 0.014];
        FRIDGE.food.forEach(o => {
          const bbx = new T.Box3().setFromObject(o);
          let best = tops[0], bestD = 1e9;
          for (const ty of tops) { const d = Math.abs(bbx.min.y - ty); if (d < bestD) { bestD = d; best = ty; } }
          o.position.y -= (bbx.min.y - best);
        });
      }
      /* 最底层那格填满：铁盒、香肠、冻肉。 */
      (function fillBottom() {
        const baseY = b.min.y + 0.028;
        const tin = new T.MeshStandardMaterial({ color: 0xb8c2cc, roughness: 0.35, metalness: 0.6 });
        const meatM = new T.MeshStandardMaterial({ color: 0x9c4a3c, roughness: 0.75 });
        for (let i = 0; i < 3; i++) {
          const r = 0.058 - i * 0.007;
          const c1 = new T.Mesh(new T.CylinderGeometry(r, r, 0.08, 20), tin);
          c1.position.set(c.x - .17 + i * .17, baseY + 0.04, c.z + .12);
          inner.add(c1); FRIDGE.food.push(c1);
        }
        for (let i = 0; i < 3; i++) {
          const sau = new T.Mesh(new T.CapsuleGeometry(0.018, 0.15, 4, 8), meatM);
          sau.rotation.z = Math.PI / 2;
          sau.position.set(c.x - .05, baseY + 0.06 + i * 0.042, c.z + .02);
          inner.add(sau); FRIDGE.food.push(sau);
        }
        const slab = new T.Mesh(new T.BoxGeometry(0.20, 0.06, 0.15), meatM);
        slab.position.set(c.x + .14, baseY + 0.03, c.z - .08);
        inner.add(slab); FRIDGE.food.push(slab);
      })();
      /* 用素材里的肉再堆一批：底层塞满，上层也压几件，看着像真的囤了一冰柜。 */
      (function pileUp() {
        const proto = FRIDGE.food.filter(o => o.name && o.name.indexOf("meat_") === 0);
        if (!proto.length) return;
        const spots = [
          [-.24, .02, .16], [-.10, .02, .10], [.04, .02, .17], [.18, .02, .11],
          [-.18, .02, .02], [.00, .02, .03], [.16, .02, .00],
          [-.12, .37, .12], [.06, .37, .06], [.20, .37, .14]
        ];
        spots.forEach((sp, i) => {
          const src = proto[i % proto.length];
          const cl = src.clone(true);
          cl.name = "meat_pile";
          cl.position.set(c.x + sp[0] * 0.9, b.min.y + sp[1] + 0.03, c.z + sp[2] - 0.12);
          cl.rotation.set(0, 0, 0);
          if (src.rotation) cl.rotation.copy(src.rotation);
          cl.rotation.y += (i * 1.1) % 3.14;
          cl.traverse(q => { if (q.isMesh && q.material) { q.material = q.material.clone(); q.material.color.multiplyScalar(i % 2 ? 0.85 : 1.05); } });
          cl.scale.multiplyScalar(0.45 + (i % 3) * 0.07);
          inner.add(cl); FRIDGE.food.push(cl);
        });
      })();
      if (ph) ph.visible = false;
      /* 内胆里那块斜置的深色垫片一并关掉（它不在房间网格里，只能按名字/形状清） */
      inner.children.forEach(o => {
        if (!o.isMesh || FRIDGE.food.indexOf(o) >= 0) return;
        if (/place|holder|dummy|shadow|proxy/i.test(o.name || '')) o.visible = false;
      });
    }).catch(e => { FRIDGE.err = String(e && (e.message || e)); console.warn('[prologue] 冰箱食物没加载到:', FRIDGE.err); });

    /* 门：铰链在左前棱，绕 y 轴往屋里转 */
    const doorG = new T.Group();
    doorG.position.set(b.min.x + .012, c.y, b.max.z - .012);
    const doorMat = body && body.material && body.material.clone
      ? body.material.clone()
      : new T.MeshStandardMaterial({ color: 0x7d9b95, roughness: .78 });
    const doorMesh = new T.Mesh(new T.BoxGeometry(w * .94, h * .93, .045), doorMat);
    doorMesh.position.set(w * .47, 0, .018);
    doorMesh.castShadow = false; doorMesh.receiveShadow = false;
    /* 门里侧做两格搁架 + 几罐饮料：开门时那块板才像冰箱门，而不是一块悬空的板。 */
    (function doorShelves() {
      const white = new T.MeshStandardMaterial({ color: 0xdfe7ef, roughness: 0.62, metalness: 0.05 });
      const glass = new T.MeshStandardMaterial({ color: 0x8fae6e, roughness: 0.35, metalness: 0.1 });
      const milk = new T.MeshStandardMaterial({ color: 0xf2efe6, roughness: 0.5 });
      for (let i = 0; i < 2; i++) {
        const y = -h * 0.10 - i * h * 0.34;
        const shelf = new T.Mesh(new T.BoxGeometry(w * 0.82, 0.018, 0.085), white);
        shelf.position.set(w * 0.47, y, 0.015);
        doorG.add(shelf);
        const lip = new T.Mesh(new T.BoxGeometry(w * 0.82, 0.05, 0.012), white);
        lip.position.set(w * 0.47, y + 0.032, 0.055);
        doorG.add(lip);
        for (let k = 0; k < 3; k++) {
          const r = 0.026 + (k % 2) * 0.006;
          const hh = k === 1 ? 0.115 : 0.085;
          const btl = new T.Mesh(new T.CylinderGeometry(r, r, hh, 12), k === 1 ? milk : glass);
          btl.position.set(w * 0.47 + (k - 1) * 0.085, y + 0.009 + hh / 2, 0.015);
          doorG.add(btl);
        }
      }
    })();
    doorG.add(doorMesh);
    doorG.visible = false;

    const light = new T.PointLight(0xffeccb, 0, 2.4, 2);
    light.position.set(c.x, c.y + h * .06, c.z + .16);

    S.scene.add(inner); S.scene.add(doorG); S.scene.add(light);
    /* 有了 samples/fridge-layout.json（fridge-lab 导出的摆位）就按它摆，覆盖上面那套写死的。 */
    const applyLayout = (tries) => {
      if (!FRIDGE.put) { if (tries > 0) setTimeout(() => applyLayout(tries - 1), 200); return; }
      fetch('samples/fridge-layout.json', { cache: 'no-store' }).then(r => (r.ok ? r.json() : null)).then(cfg => {
        if (!cfg || !Array.isArray(cfg.items) || !cfg.items.length) return;
        FRIDGE.food.slice().forEach((o) => { if (o.parent) o.parent.remove(o); });
        FRIDGE.food.length = 0;
        const center = b.getCenter(new T.Vector3());
        /* 剩下的位置随便塞满：只避开你自己摆的那一件（JSON 里的），其余自由堆叠，穿模也算。 */
        const FILLER = [
          'geo_steak_mat_meat_0', 'geo_porkchop_mat_meat_0', 'geo_rackoflamb_mat_meat_0',
          'geo_groundbeef_01_mat_meat_0', 'geo_groundbeef_02_mat_meat_0', 'geo_groundbeef_03_mat_meat_0',
          'geo_meatroll_mat_meat_0', 'geo_meatchunks_mat_meat_0', 'geo_fish_mat_meat_0',
          'geo_fish_nohead_mat_meat_0', 'geo_catfish_mat_meat_0', 'geo_fishfillet_mat_meat_0',
          'geo_giantsteak_mat_meat_0', 'geo_smallsteak_mat_meat_0', 'geo_bigmeat_mat_meat_0',
          'geo_burgermeat_mat_meat_0', 'geo_porkslab_mat_meat_0', 'geo_chickenbreast_mat_meat_0',
          'geo_fishhead_mat_meat_0', 'geo_fish_sliced_mat_meat_0'
        ];
        const sz = b.getSize(new T.Vector3());
        const rnd = (a, c2) => a + Math.random() * (c2 - a);
        for (let i = 0; i < 14; i++) {
          const nm = FILLER[i % FILLER.length];
          const px = center.x + rnd(-sz.x * 0.30, sz.x * 0.30);
          const py = b.min.y + rnd(0.06, sz.y * 0.78);
          const pz = center.z + rnd(-sz.z * 0.16, sz.z * 0.34);
          const o = FRIDGE.put(nm, px, py, pz, rnd(0, Math.PI * 2), rnd(-0.5, 0.5));
          if (o) o.scale.multiplyScalar(rnd(0.30, 0.55));
        }
        cfg.items.forEach((it) => {
          if (!it || !it.asset) return;
          const x = center.x + (it.x || 0), y = center.y + (it.y || 0), z = center.z + (it.z || 0);
          const o = FRIDGE.put(it.asset, x, y, z, it.rotY || 0, it.rotX == null ? 0 : it.rotX);
          if (!o) return;
          /* 用导出里量好的宽高把尺寸对齐，再把它摆到导出记录的相对位置 */
          let bb = new T.Box3().setFromObject(o);
          let cur = bb.getSize(new T.Vector3()).x || 1;
          if (it.w) o.scale.multiplyScalar(it.w / cur);
          if (it.rotZ) o.rotation.z = it.rotZ;
          o.updateMatrixWorld(true);
          bb = new T.Box3().setFromObject(o);
          const c2 = bb.getCenter(new T.Vector3());
          o.position.x += x - c2.x;
          o.position.y += y - c2.y;
          o.position.z += z - c2.z;
        });
      }).catch(() => { /* 没有配置文件就保持默认摆法 */ });
    };
    applyLayout(40);

    /* 内胆壳是封闭盒子，正面那层会把里面的东西挡成隔着一层。
       改成 BackSide：正面被剔除，看上去就是一个正面敞开的柜腔。 */
    inner.children.forEach(o => {
      const pr = o.geometry && o.geometry.parameters;
      if (o.isMesh && pr && pr.width > 0.6 && pr.height > 1) { o.material.side = T.BackSide; o.material.needsUpdate = true; }
    });
    /* 让内胆看起来是"冰箱里"而不是白纸盒：冷色调的壳、能接影子的隔板、顶上的小灯投影。 */
    inner.children.forEach(o => {
      if (!o.isMesh) return;
      const pr = o.geometry && o.geometry.parameters;
      const isShell = pr && pr.width > 0.6 && pr.height > 1;
      if (isShell) { o.material.color.setHex(0xb9c6d4); o.material.roughness = 0.92; }
      else { o.material.color.setHex(0xdde6ef); o.material.roughness = 0.75; }
      o.receiveShadow = true; o.castShadow = false;
    });
    if (light) {
      light.castShadow = true;
      if (light.shadow) { light.shadow.mapSize.set(1024, 1024); light.shadow.bias = -0.0025; light.shadow.radius = 3; }
    }
    /* 门上的福字是一块单独的薄片网格，不在 body 里，开门后还挂在门口挡视线。
       按几何特征认它：极薄、落在箱体正面上、0.15~0.5 m 见方。 */
    const deco = [];
    S.room.traverse(o => {
      if (!o.isMesh) return;
      const bb = new T.Box3().setFromObject(o);
      const sz = bb.getSize(new T.Vector3());
      const thin = Math.min(sz.x, sz.y, sz.z) < 0.012;
      const front = bb.max.z > b.max.z - 0.06;
      const inside = bb.min.x > b.min.x - 0.05 && bb.max.x < b.max.x + 0.05;
      const sized = Math.max(sz.x, sz.y) < 0.55 && Math.max(sz.x, sz.y) > 0.12;
      if (thin && front && inside && sized) { o.visible = false; deco.push(o.name || 'mesh'); }
    });
    FRIDGE.deco = deco;
    FRIDGE.inner = inner; FRIDGE.door = doorG; FRIDGE.light = light; FRIDGE.built = true;
    if (inner) inner.userData.interactionId = 'fridge';
    if (doorG) doorG.userData.interactionId = 'fridge';
    if (light) { light.intensity = (light.intensity || 1) * 1.7; if (light.color) light.color.setHex(0xffd9b0); }
    return true;
  }

  /* 影子戏收尾 → 走到冰箱前 */
  function goFridge(onDone) {
    if (!buildFridgeInterior()) { if (onDone) onDone(); return; }
    S.stage = 'fridge';
    FRIDGE.step = 0;
    FRIDGE.off = onDone || null;
    document.body.classList.add('stage-mode');
    const c = FRIDGE.box.c, b = FRIDGE.box.b;
    if (S.controls) S.controls.enabled = false;
    S.camBase.pos.set(c.x + .06, 1.02, b.max.z + 1.45);
    S.camBase.target.set(c.x, 1.02, c.z);
    showHint('冰箱在嗡嗡作响。<em>打开它</em>');
    const onKey = e => {
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'NumpadEnter') { e.preventDefault(); advanceFridge(); }
    };
    const onDown = e => {
      if (e.target && e.target.closest && e.target.closest('button,a')) return;
      advanceFridge();
    };
    FRIDGE.cleanup = () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
      document.body.classList.remove('stage-mode');
      if (S.controls) S.controls.enabled = true;
      FRIDGE.cleanup = null;
    };
    setTimeout(() => {
      document.addEventListener('keydown', onKey);
      document.addEventListener('pointerdown', onDown);
    }, 900);
    if (onDone) FRIDGE.doneCb = onDone;
  }

  /* ---------------------------------------------------------------------
     变灰之后：把镜头交还给玩家，自己走到厨房，走到冰箱前按 E 拉开。
     这一段只做最朴素的行走：WASD + 鼠标转头 + 简单边界，不做全屋碰撞。
     --------------------------------------------------------------------- */
  function walkRoomBounds() {
    try {
      const bb = Core.boxOf(S.room);
      if (bb && bb.min && bb.max) {
        return { x0: bb.min.x + 0.40, x1: bb.max.x - 0.40, z0: bb.min.z + 0.40, z1: bb.max.z - 0.40 };
      }
    } catch (e) { /* 没有就退化成冰箱附近的框 */ }
    return null;
  }

  /* 走之前先探一下：沿方向 0.45 m 内有没有实体，避免穿墙穿柜子 */
  const _wRay = new T.Raycaster();
  const _wDir = new T.Vector3();
  function walkBlocked(nx, nz) {
    if (!S.room) return false;
    _wDir.set(nx - WALK.pos.x, 0, nz - WALK.pos.z);
    const len = _wDir.length();
    if (len < 1e-4) return false;
    _wDir.normalize();
    _wRay.set(new T.Vector3(WALK.pos.x, 1.15, WALK.pos.z), _wDir);
    _wRay.near = 0;
    _wRay.far = len + 0.42;
    const hits = _wRay.intersectObject(S.room, true);
    for (let i = 0; i < hits.length; i++) {
      const h = hits[i];
      if (!h.object || !h.object.isMesh) continue;
      if (h.object.userData && h.object.userData.noBlock) continue;
      return true;
    }
    return false;
  }

  function walkBounds() {
    const room = walkRoomBounds();
    if (!FRIDGE.box) return room ? Object.assign(room, { box: null }) : null;
    const b = FRIDGE.box.b;
    const fb = {
      x0: b.min.x - 4.6, x1: b.max.x + 2.2,
      z0: b.min.z - 2.6, z1: b.max.z + 4.4,
      box: b
    };
    if (!room) return fb;
    return {
      x0: Math.max(fb.x0, room.x0), x1: Math.min(fb.x1, room.x1),
      z0: Math.max(fb.z0, room.z0), z1: Math.min(fb.z1, room.z1),
      box: b
    };
  }

  function startKitchenWalk(done) {
    if (!buildFridgeInterior()) { if (done) done(); return; }
    const b = FRIDGE.box.b, c = FRIDGE.box.c;
    walkTickOuter = walkTick;
    S.stage = 'kitchenwalk';   /* 独立阶段：别让旧 stage 的提示抢这句 */
    /* 关键：影子戏把渲染器切到了它的 2D 舞台场景（S.stageRender='stage'），
       不切回来就一直是黑底+剪影。行走段必须渲染真正的房间。 */
    try {
      S.stageRender = '';
      SHADOW.on = false;
      SHADOW.playing = false;
      if (SHADOW.veil) SHADOW.veil.style.display = 'none';
      if (SHADOW.scrim) SHADOW.scrim.style.display = 'none';
      if (SHADOW.textBox) SHADOW.textBox.style.display = 'none';
      if (SHADOW.stepBox) SHADOW.stepBox.style.display = 'none';
      const subs = document.getElementById('spatialSubs');
      if (subs) subs.style.display = 'none';
    } catch (e5) { /* 忽略 */ }
    WALK.bound = walkBounds();
    WALK.on = true;
    window.__walk = WALK;
    WALK.done = done || null;
    WALK.keys = {};
    WALK.near = false;
    S.camHold = false;
    S.userCamera = true;
    if (S.controls) S.controls.enabled = false;
    document.body.classList.add('stage-mode');

    /* 起点：当前机位后退一点，站到客厅这边 */
    const p0 = (S.homePos ? S.homePos.clone() : S.camera.position.clone());
    p0.y = 1.62;
    if (WALK.bound) {
      p0.x = Math.max(WALK.bound.x0 + 0.3, Math.min(WALK.bound.x1 - 0.3, p0.x + 0.2));
      p0.z = Math.max(WALK.bound.z0 + 0.3, Math.min(WALK.bound.z1 - 0.3, p0.z));
    }
    WALK.pos = p0;
    WALK.lane = {
      a: { x: p0.x, z: p0.z },
      b: { x: c.x, z: (b.max.z + b.min.z) / 2 + 1.55 }
    };
    WALK.yaw = Math.atan2(-(WALK.lane.b.x - p0.x), -(WALK.lane.b.z - p0.z));
    WALK.pitch = -0.06;

    if (!WALK.lamp) {
      WALK.lamp = new T.PointLight(0xffe2b8, 2.4, 6.5, 2);
      S.scene.add(WALK.lamp);
    }
    WALK.lamp.position.set(p0.x, 1.55, p0.z);
    if (S.renderer) S.renderer.toneMappingExposure = 1.0;
    /* 高潮留下的黑场/闪白遮罩：这一段要能看见路，全部压掉 */
    try {
      ['shadow', 'veil', 'flashBang', 'warm', 'climax'].forEach(function (id) {
        const el = document.getElementById(id);
        if (el) { el.style.opacity = '0'; el.style.pointerEvents = 'none'; }
      });
      document.querySelectorAll('.veil,.scrim,.text-box,.step-box,.shadow-text').forEach(function (el) {
        el.style.opacity = '0';
      });
      document.body.classList.remove('stage-mode');
    } catch (e3) { /* 忽略 */ }
    if (!WALK.amb) { WALK.amb = new T.AmbientLight(0x8fa4c8, 0.55); S.scene.add(WALK.amb); }
    const hintText = '厨房在左边。<em>WASD</em> 走过去，走到冰箱前按 <em>E</em>';
    showHint(hintText);
    /* 开场的打字/推窗流程可能晚一步把提示覆盖掉，头 6 秒里把它按回来 */
    let guard = 0;
    WALK.guard = setInterval(() => {
      if (!WALK.on || ++guard > 8) { clearInterval(WALK.guard); WALK.guard = null; return; }
      if (S.stage === 'kitchenwalk' && !WALK.near) showHint(hintText);
    }, 750);

    const onKey = e => {
      if (!WALK.on) return;
      const k = e.code;
      if (/^(KeyW|KeyA|KeyS|KeyD|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|ShiftLeft)$/.test(k)) {
        WALK.keys[k] = true;
        if (k.startsWith('Arrow')) e.preventDefault();
      }
      if (k === 'KeyE') {
        if (WALK.near) { openFridgeHere(); }
        else showHint('还不够近。<em>再走近一点</em>');
      }
    };
    const onUp = e => { if (WALK.keys[e.code]) WALK.keys[e.code] = false; };
    const onMove = e => {
      if (!WALK.on || document.pointerLockElement !== S.renderer.domElement) return;
      WALK.yaw -= e.movementX * 0.0022;
      WALK.pitch = Math.max(-1.1, Math.min(0.9, WALK.pitch - e.movementY * 0.0018));
    };
    const onDown = e => {
      if (!WALK.on) return;
      if (S.renderer && S.renderer.domElement && document.pointerLockElement !== S.renderer.domElement) {
        S.renderer.domElement.requestPointerLock && S.renderer.domElement.requestPointerLock();
        return;
      }
      if (e.target && e.target.closest && e.target.closest('button,a')) return;
    };
    WALK.cleanup = () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('keyup', onUp, true);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('pointerdown', onDown);
      document.exitPointerLock && document.exitPointerLock();
      if (WALK.guard) { clearInterval(WALK.guard); WALK.guard = null; }
      if (WALK.tag) { try { WALK.tag.remove(); } catch (e4) {} WALK.tag = null; }
      if (WALK.lamp) { try { S.scene.remove(WALK.lamp); } catch (e2) {} WALK.lamp = null; }
      if (WALK.amb) { try { S.scene.remove(WALK.amb); } catch (e2) {} WALK.amb = null; }
      WALK.cleanup = null;
    };
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('keyup', onUp, true);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('pointerdown', onDown);
  }
  /* 本函数定义在 boot() 作用域内，而 aftermath 的 investigateAftermath(:3085) 在 IIFE
     顶层作用域，看不见它——seen≥3 后会 ReferenceError。挂到 window 上按跨作用域惯例调用。 */
  window.__startKitchenWalk = startKitchenWalk;

  function walkTick(dt) {
    if (!WALK.on) return true;
    window.__walkTick = (window.__walkTick || 0) + 1;
    window.__walkState = { on: WALK.on, keys: Object.keys(WALK.keys).filter(k => WALK.keys[k]), pos: WALK.pos && WALK.pos.toArray().map(n => +n.toFixed(2)) };
    const k = WALK.keys;
    const sp = (k.ShiftLeft ? 3.0 : 1.9) * dt;
    let fw = (k.KeyW ? 1 : 0) - (k.KeyS ? 1 : 0);
    let sd = (k.KeyD ? 1 : 0) - (k.KeyA ? 1 : 0);
    if (fw || sd) {
      const len = Math.hypot(fw, sd) || 1;
      fw /= len; sd /= len;
      const sin = Math.sin(WALK.yaw), cos = Math.cos(WALK.yaw);
      /* 前方向 = (-sin, -cos)，右方向 = (cos, -sin) */
      const adv = (fw > 0 && WALK.near) ? 0.5 : 1;   /* 贴近冰箱后小步蹭，别怼穿模型 */
      WALK.pos.x += (-sin * fw + cos * sd) * sp * adv;
      WALK.pos.z += (-cos * fw - sin * sd) * sp * adv;
      /* 走廊约束已取消（太窄会把人顶回去），改用下面的矩形范围 */
      if (false && WALK.lane) {
        const A = WALK.lane.a, B = WALK.lane.b;
        const abx = B.x - A.x, abz = B.z - A.z;
        const l2 = abx * abx + abz * abz || 1;
        let u = ((WALK.pos.x - A.x) * abx + (WALK.pos.z - A.z) * abz) / l2;
        u = Math.max(0, Math.min(1, u));
        const px = A.x + abx * u, pz = A.z + abz * u;
        const ox = WALK.pos.x - px, oz = WALK.pos.z - pz;
        const od = Math.hypot(ox, oz);
        const WID = 1.15;
        if (od > WID) {
          WALK.pos.x = px + ox / od * WID;
          WALK.pos.z = pz + oz / od * WID;
        }
      }
    }
    const bd = WALK.bound;
    if (bd) {
      const fb = bd.box;
      /* 冰箱本体不许穿进去：留 0.42 m 缓冲 */
      const m = 0.42;
      if (WALK.pos.x > fb.min.x - m && WALK.pos.x < fb.max.x + m &&
          WALK.pos.z > fb.min.z - m && WALK.pos.z < fb.max.z + m) {
        /* 推到最近的边上 */
        const dxl = Math.abs(WALK.pos.x - (fb.min.x - m));
        const dxr = Math.abs((fb.max.x + m) - WALK.pos.x);
        const dzl = Math.abs(WALK.pos.z - (fb.min.z - m));
        const dzr = Math.abs((fb.max.z + m) - WALK.pos.z);
        const mn = Math.min(dxl, dxr, dzl, dzr);
        if (mn === dxl) WALK.pos.x = fb.min.x - m;
        else if (mn === dxr) WALK.pos.x = fb.max.x + m;
        else if (mn === dzl) WALK.pos.z = fb.min.z - m;
        else WALK.pos.z = fb.max.z + m;
      }
      WALK.pos.x = Math.max(bd.x0, Math.min(bd.x1, WALK.pos.x));
      WALK.pos.z = Math.max(bd.z0, Math.min(bd.z1, WALK.pos.z));
    }
    if (WALK.lamp) WALK.lamp.position.set(WALK.pos.x, 1.55, WALK.pos.z);
    S.camera.position.copy(WALK.pos);
    S.camera.rotation.order = 'YXZ';
    S.camera.rotation.set(WALK.pitch, WALK.yaw, 0);
    S.camera.updateMatrixWorld();

    /* 目标路标 */
    if (!WALK.tag) {
      WALK.tag = document.createElement('div');
      WALK.tag.textContent = '冰箱';
      WALK.tag.style.cssText = 'position:fixed;transform:translate(-50%,-50%);z-index:9;pointer-events:none;'
        + 'font:12px/1 ui-monospace,Consolas,monospace;letter-spacing:.14em;color:#ffd479;'
        + 'padding:4px 10px;border:1px solid rgba(255,195,94,.6);border-radius:999px;'
        + 'background:rgba(12,10,4,.75);opacity:0;transition:opacity .2s;';
      document.body.appendChild(WALK.tag);
    }
    const fb2 = WALK.bound && WALK.bound.box;
    if (fb2) {
      const dx = WALK.pos.x - (fb2.min.x + fb2.max.x) / 2;
      const dz = WALK.pos.z - fb2.max.z;
      const near = Math.hypot(dx, dz) < 1.55;
      if (near !== WALK.near) {
        WALK.near = near;
        if (near) showHint('<em>E</em> 拉开冰箱门');
        else showHint('厨房在厨房那边：跟着琥珀色「冰箱」走。<em>WASD</em> 移动 · 鼠标转头');
      }
      /* 路标跟着冰箱走 */
      if (WALK.tag) {
        if (near) { WALK.tag.style.opacity = '0'; }
        else {
          const v = new T.Vector3((fb2.min.x + fb2.max.x) / 2, fb2.max.y + 0.25, (fb2.min.z + fb2.max.z) / 2);
          v.project(S.camera);
          const inFront = v.z > -1 && v.z < 1;
          if (inFront) {
            WALK.tag.style.opacity = '0.95';
            WALK.tag.style.left = ((v.x * 0.5 + 0.5) * window.innerWidth) + 'px';
            WALK.tag.style.top = ((-v.y * 0.5 + 0.5) * window.innerHeight) + 'px';
          } else {
            WALK.tag.style.opacity = '0';
          }
        }
      }
    }
    return false;
  }

  function openFridgeHere() {
    if (!WALK.on) return;
    WALK.on = false;
    if (WALK.cleanup) WALK.cleanup();
    document.body.classList.remove('stage-mode');
    /* 站到冰箱正前方，交回固定机位 */
    const b = FRIDGE.box.b, c = FRIDGE.box.c;
    S.camera.position.set(c.x, 1.52, b.max.z + 1.35);
    S.camera.rotation.set(-0.05, Math.PI, 0);
    FRIDGE.step = 0;
    FRIDGE.doneCb = WALK.done;
    const cb = WALK.done;
    WALK.done = null;
    goFridge(cb);
    /* goFridge 会重新布机位，这里只要保证它自己那份 doneCb 生效；
       开门交给玩家再按一次，别自动跳过去 */
    FRIDGE.doneCb = cb;
  }

  const FRIDGE_LINES = [
    { who: '旁白', text: '我走过去拉开冰箱的门，一股蒸汽从半开的冰箱中冒出来。' },
    { who: '旁白', text: '里面的一只生冻鸡已变成熟的，发出一股香味，还有那些生对虾。' }
  ];

  function openFridge() {
    if (!FRIDGE.built) return;
    /* 占位方块：按名字再兜一次（之前只在加载回调里藏，早于它被加进内胆） */
    if (FRIDGE.inner) FRIDGE.inner.traverse(o => { if (o.isMesh && /placeholder|place[-_]?holder/i.test(o.name || '')) o.visible = false; });
    const body = FRIDGE.body, door = FRIDGE.door, inner = FRIDGE.inner, light = FRIDGE.light;
    if (body) body.visible = false;
    /* 老宅那台冰箱的门和“福”字是烘在同一个网格上的，门一开就会留下悬空的贴片；
       开门后把原模型整组藏掉，只留我们自己的内胆 + 门板。 */
    if (FRIDGE.root) FRIDGE.root.traverse(o => { if (o.isMesh) o.visible = false; });
    /* 开门后内胆补一盏顶光：箱体和门都藏了，只剩我们自己搭的壳，不给光就是一片黑。 */
    if (inner && !FRIDGE.fillLight) {
      const fb = (FRIDGE.box && FRIDGE.box.b) || null;
      const fl = new T.PointLight(0xf2f7ff, 3.0, 1.7, 2);
      if (fb) fl.position.set((fb.min.x + fb.max.x) / 2, fb.max.y - 0.05, (fb.min.z + fb.max.z) / 2 + 0.03);
      inner.add(fl);
      FRIDGE.fillLight = fl;
    }
    /* 冰箱盒子里还有别的部件（镜面斜片之类）不挂在 root 下，按包围盒一并藏掉 */
    try {
      const fb = new T.Box3(b.min.clone().addScalar(-.06), b.max.clone().addScalar(.06));
      S.room.traverse(o => {
        if (!o.isMesh || !o.visible) return;
        let inside = false; let q = o; while (q) { if (q === FRIDGE.inner) inside = true; q = q.parent; }
        if (inside) return;
        const wb = new T.Box3().setFromObject(o);
        const cen = wb.getCenter(new T.Vector3());
        if (wb.intersectsBox(fb)) o.visible = false;
      });
    } catch (e) { }
    inner.visible = true;
    door.visible = true;
    door.rotation.y = 0;
    playTone([180, 240], .5, .06);
    Core.tween({
      from: 0.001, to: 1, dur: 900, ease: Core.easeOutCubic,
      onUpdate: v => {
        door.rotation.y = -1.85 * v;
        light.intensity = 2.1 * v;
        if (FRIDGE.placeholder && FRIDGE.placeholder.material) FRIDGE.placeholder.material.emissiveIntensity = 0.25 * v;
      },
      onComplete: () => { if (FRIDGE.doorMesh) FRIDGE.doorMesh.material.side = T.DoubleSide; }
    });
    setTimeout(() => playTone([523.25, 659.25], .9, .05), 260);
  }

  function showFridgeLine(i) {
    const line = FRIDGE_LINES[i];
    if (!line || !SHADOW.stepBox) return;
    SHADOW.whoEl.textContent = line.who;
    SHADOW.bodyEl.textContent = line.text;
    SHADOW.hintEl.textContent = i < FRIDGE_LINES.length - 1 ? '按一下继续' : '按一下继续';
    SHADOW.scrim.style.opacity = '1';
    SHADOW.stepBox.style.opacity = '1';
  }

  function advanceFridge() {
    /* 去抖：同一个按键可能被两处监听各触发一次，这里 700ms 内只认一次 */
    const now = Date.now();
    if (now - (FRIDGE.lastAdv || 0) < 700) return;
    FRIDGE.lastAdv = now;
    if (FRIDGE.step === 0) {
      FRIDGE.step = 1;
      showHint('');
      openFridge();
      setTimeout(() => showFridgeLine(0), 1600);
    } else if (FRIDGE.step === 1) {
      FRIDGE.step = 2;
      showFridgeLine(1);
    } else {
      FRIDGE.step = 3;
      if (SHADOW.stepBox) SHADOW.stepBox.style.opacity = '0';
      if (SHADOW.scrim) SHADOW.scrim.style.opacity = '0';
      if (FRIDGE.cleanup) FRIDGE.cleanup();
      S.stage = 'cake';
      const cb = FRIDGE.doneCb;
      FRIDGE.doneCb = null;
      if (cb) cb();
    }
  }

function enterShadowPlay(done) {
  if (SHADOW.playing) return;
  shadowDom();
  buildStageScene();
  SHADOW.playing = true; SHADOW.done = false; SHADOW.mode = 'steps'; SHADOW.phase = 'steps'; SHADOW.step = -1;
  S.stage = 'shadow'; showHint('');
  // 戏中戏：这一段不希望顶栏/风格栏露出来抢画面（CSS 见 .stage-mode）
  document.body.classList.add('stage-mode');
  const ovEl = document.getElementById('overture');
  if (ovEl) ovEl.classList.remove('show', 'grow');
  S.renderer.toneMappingExposure = 0.72;
  if (S.renderer.shadowMap) S.renderer.shadowMap.enabled = true;

  SHADOW.veil.style.opacity = '1';
  SHADOW.textBox.style.opacity = '0';
  SHADOW.lines.forEach(el => { el.style.opacity = '0'; });
  SHADOW.stepBox.style.opacity = '0';
  if (SHADOW.scrim) SHADOW.scrim.style.opacity = '0';
  SHADOW.whoEl.textContent = ''; SHADOW.bodyEl.textContent = ''; SHADOW.hintEl.textContent = '';
  S.stageRender = 'stage'; SCN.preview = !!params.get('shadowShot'); SCN.startedAt = performance.now(); SCN.lastT = null;
  SCN.figures.forEach(fig => {
    fig.group.userData.__baseY = fig.group.position.y;
    fig.crossfade = 0;
  });
  /* 开场只给"人站定"的那一档亮度（进度 0.30），灯先亮，人物还在暗处 —— 第一句出来时他们才显影。 */
  setShadowProgress(0.30);
  SHADOW.mode = 'steps';
  SHADOW.lv.pres.dad = 0; SHADOW.lv.pres.mom = 0;
  SHADOW.tgt.pres.dad = 0; SHADOW.tgt.pres.mom = 0;
  if (SCN.preview) requestAnimationFrame(() => { if (SHADOW.playing) { SHADOW.veil.style.opacity = '0'; goStep(0); } });

  const typeText = (text, done) => {
    clearInterval(SHADOW.typeTimer);
    SHADOW.bodyEl.textContent = '';
    let i = 0;
    SHADOW.typeTimer = setInterval(() => {
      i += 1;
      SHADOW.bodyEl.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(SHADOW.typeTimer); SHADOW.typeTimer = null;
        if (typeof done === 'function') done();
      }
    }, 42);
  };

  function shadowDialogueSide(side) {
    if (!SHADOW.stepBox) return;
    const right = side === 'dad';
    SHADOW.stepBox.style.left = right ? '51%' : '3%';
    SHADOW.stepBox.style.right = right ? '3%' : '51%';
    SHADOW.stepBox.style.alignItems = right ? 'flex-start' : 'flex-end';
    SHADOW.stepBox.style.textAlign = right ? 'left' : 'right';
    SHADOW.bodyEl.style.maxWidth = 'min(520px, 42vw)';
  }

  function shadowCameraTo(side, done) {
    if (!SCN.cam) { if (done) done(); return; }
    if (SHADOW.interaction.cameraTween) Core.cancelTween && Core.cancelTween(SHADOW.interaction.cameraTween);
    const from = SCN.cam.position.clone();
    const to = from.clone();
    to.x = side === 'dad' ? 0.48 : -0.48;
    to.y = 1.30;
    to.z = 3.38;
    const target = new T.Vector3(side === 'dad' ? 0.30 : -0.34, 1.12, -1.6);
    const fromTarget = SCN._cameraTarget ? SCN._cameraTarget.clone() : new T.Vector3(0, 1.06, -1.6);
    SHADOW.interaction.cameraTween = Core.tween({
      from: 0, to: 1, dur: 1150, ease: Core.easeInOutCubic,
      onUpdate: v => {
        SCN.cam.position.lerpVectors(from, to, v);
        const at = fromTarget.clone().lerp(target, v);
        SCN.cam.lookAt(at);
        SCN._cameraTarget = at;
      }, onDone: () => { SHADOW.interaction.cameraTween = null; if (done) done(); }
    });
  }

  function beginInteractiveDialogue(side) {
    const ix = side === 'dad' ? SHADOW.interaction.dadIndex : SHADOW.interaction.momIndex;
    const st = SHADOW.STEPS[ix];
    if (!st) return;
    SHADOW.interaction.phase = side === 'dad' ? 'dadLine' : 'momLine';
    shadowCameraTo(side, () => {
      goStep(ix, { noText: true });
      shadowDialogueSide(side);
      SHADOW.veil.style.opacity = '0';
      SHADOW.stepBox.style.opacity = '1';
      SHADOW.scrim.style.opacity = '1';
      typeText(st.text, () => {
        SHADOW.stepBox.style.opacity = '0';
        SHADOW.scrim.style.opacity = '0.35';
        if (side === 'dad') {
          SHADOW.interaction.phase = 'waitMother';
          SHADOW.hintEl.textContent = '点击左侧，听妈妈说';
        } else {
          SHADOW.interaction.phase = 'painting';
          SHADOW.hintEl.textContent = '点击右侧画作继续';
        }
      });
    });
  }

  const goStep = (i, opts = {}) => {
    const prev = SHADOW.STEPS[SHADOW.step];
    if (prev && typeof prev.onExit === 'function') prev.onExit({ SHADOW, S, step: SHADOW.step });
    const st = SHADOW.STEPS[i];
    if (!st) return false;
    SHADOW.step = i;
    const t = SHADOW.tgt;
    t.cold = st.cold; t.ball = st.ball; t.over = st.over; t.lean = st.lean || 0;
    t.pres.dad = st.on.dad; t.pres.mom = st.on.mom;
    fadeFigure(SCN.dad, !!st.pose.dad);
    fadeFigure(SCN.mom, !!st.pose.mom);
    /* 白炽那一拍：整屏闪一下白光，闪完就退，别让墙上一直白着 */
    if (SHADOW.flash && (st.over || 0) >= 0.9) {
      SHADOW.flash.style.transition = 'opacity .06s linear';
      SHADOW.flash.style.opacity = '0.92';
      setTimeout(() => {
        SHADOW.flash.style.transition = 'opacity 1s ease';
        SHADOW.flash.style.opacity = '0';
      }, 130);
    }
    SHADOW.whoEl.textContent = st.who || '';
    SHADOW.hintEl.textContent = i >= SHADOW.STEPS.length - 1 ? '空格 → 收尾' : '按一下继续';
    SHADOW.stepBox.style.opacity = '1';
    if (SHADOW.scrim) SHADOW.scrim.style.opacity = '1';
    if (!opts.noText) typeText(st.text);
    SHADOW.interaction.focus = st.focus || null;
    if (typeof st.onEnter === 'function') st.onEnter({ SHADOW, S, step: i });
    return true;
  };

  /* 最后一句走完：黑场 → 三句收尾 → 再按一下才真的结束这一段 */
  const toFinal = () => {
    SHADOW.phase = 'lines';
    SHADOW.stepBox.style.opacity = '0';
    if (SHADOW.scrim) SHADOW.scrim.style.opacity = '0';
    SHADOW.veil.style.opacity = '1';
    S.stageRender = ''; S.renderer.toneMappingExposure = 1;
    setTimeout(() => {
      SHADOW.textBox.style.opacity = '1';
      SHADOW.lines.forEach((el, i) => setTimeout(() => { el.style.opacity = '1'; }, 260 + i * 900));
    }, 500);
  };

  const finish = () => {
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('pointerdown', onDown);
    clearInterval(SHADOW.typeTimer); SHADOW.typeTimer = null;
    SHADOW.textBox.style.opacity = '0'; SHADOW.stepBox.style.opacity = '0';
    if (SHADOW.scrim) SHADOW.scrim.style.opacity = '0';
    SHADOW.done = true; SHADOW.playing = false;
    document.body.classList.remove('stage-mode');
    /* 影子戏散场 → 交给"拔白发 / 变灰"，冰箱留到变灰之后再去 */
    S.stage = 'cake';
    if (typeof done === 'function') done();
  };

  const semanticAction = (action, ev) => {
    if (action === 'reveal-father') { beginInteractiveDialogue('dad'); return true; }
    if (action === 'focus-mother') { if (!ev || ev.clientX < innerWidth * 0.58) beginInteractiveDialogue('mom'); return true; }
    if (action === 'tap-painting') {
      if (ev && ev.clientX < innerWidth * 0.42) return true;
      SHADOW.interaction.phase = 'legacy'; SHADOW.stepBox.style.opacity = '1'; SHADOW.scrim.style.opacity = '1'; goStep(3); return true;
    }
    return false;
  };

  const advance = (ev) => {
    if (!SHADOW.playing) return;
    const phase = SHADOW.interaction && SHADOW.interaction.phase;
    const x = ev && ev.clientX != null ? ev.clientX : innerWidth * 0.5;
    const node = SHADOW.STEPS[SHADOW.step];
    if (phase === 'black' && semanticAction('reveal-father', ev)) return;
    if (phase === 'waitMother') {
      semanticAction('focus-mother', ev);
      return;
    }
    if (phase === 'painting') {
      semanticAction('tap-painting', ev);
      return;
    }
    if (phase === 'dadLine' || phase === 'momLine') return;
    if (SHADOW.phase === 'lines') { finish(); return; }
    if (node && node.action && node.action !== 'continue-shadow' && semanticAction(node.action, ev)) return;
    const next = SHADOW.step + 1;
    if (next < SHADOW.STEPS.length) goStep(next);
    else toFinal();
  };
  const onKey = e => {
    if (e.code === 'Space' || e.code === 'Enter' || e.code === 'NumpadEnter') { e.preventDefault(); e.stopPropagation(); advance(e); }
  };
  /* 只认"点一下走一步"：按下不记、抬起时看位移和时长——
     拖一下看影子、长按都不该把台词翻过去。 */
  let downAt = null;
  const onDown = e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    downAt = { x: e.clientX, y: e.clientY, t: performance.now() };
  };
  const onUp = e => {
    if (!downAt) return;
    const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y);
    const held = performance.now() - downAt.t;
    downAt = null;
    if (moved > 8 || held > 700) return;
    advance(e);
  };
  document.addEventListener('keydown', onKey);
  document.addEventListener('pointerdown', onDown);
  document.addEventListener('pointerup', onUp);

  SHADOW.goStep = goStep; SHADOW.advance = advance;
  SHADOW.interaction.phase = SCN.preview ? 'legacy' : 'black';
  // 正片保持全黑，第一次点击才揭示父亲；shadowShot 预览沿用自动步骤。
  if (SCN.preview) setTimeout(() => { if (SHADOW.playing) goStep(0); }, 0);
}
  window.__prologue = {
      S, ENTER_URL, ANCHOR,
      setSash, lightCandle, goCake, showEndcard, playOverture, revealRoom,
      showHint,
    goFridge, openFridge,
      startBirthdayMusic, setBirthdayVolume,
      applyStyle, STYLES,
      enterShadowPlay, SHADOW, drawShadowWall,
      /* 变灰之后：去厨房开冰箱看那只生冻鸡 */
      kitchenWalkAfterClimax: (done) => { startAftermath3D(done); },
      setShadowProgress,
      // TEXT_HOOK_FATHER / TEXT_HOOK_MOTHER: copy is intentionally supplied by the author.
      textHooks: { father: null, mother: null },
      _fit: { heightMap, fitCakeSpot, pickView, fitSashSwing, firstHit },
      sources: () => window.__prologueSources,
      project: (x, y, z) => {
        const v = new T.Vector3(x, y, z).project(S.camera);
        return { x: (v.x * 0.5 + 0.5) * innerWidth, y: (-v.y * 0.5 + 0.5) * innerHeight };
      },
      sashPoint: () => {
        const o = S.sash || S.windowGroup;
        if (!o) return null;
        const b = Core.boxOf(o);
        return { x: b.center.x, y: b.center.y, z: b.center.z };
      },
      candleScreen: i => {
        const c = S.candles[i || 0];
        if (!c) return null;
        const b = Core.boxOf(c.obj);
        return { x: b.center.x, y: b.center.y, z: b.center.z };
      },
      /* 调试用：列出房间模型里"像墙"的网格（够高够宽、贴着后墙），看它们本来是什么颜色。
         改墙体材质前先量一次，别拍脑袋调色。 */
      wallCandidates: () => {
        if (!S.room) return [];
        const rb = S.roomBox || Core.boxOf(S.room);
        const backZ = rb.box.min.z;
        const out = [];
        S.room.traverse(o => {
          if (!o.isMesh || !o.geometry) return;
          const m = Array.isArray(o.material) ? o.material[0] : o.material;
          if (!m || !m.color) return;
          const b = Core.boxOf(o);
          if (b.size.y < 1.0 || Math.min(b.size.x, b.size.z) < 0.02) return;
          if (Math.abs(b.center.z - backZ) > 1.2) return;
          out.push({
            n: o.name || o.type,
            col: '#' + m.color.getHexString(),
            map: !!(m && m.map),
            sx: +b.size.x.toFixed(2), sy: +b.size.y.toFixed(2), sz: +b.size.z.toFixed(2),
            cz: +b.center.z.toFixed(2), area: +(Math.max(b.size.x, b.size.z) * b.size.y).toFixed(2)
          });
        });
        return out.sort((a, b) => b.area - a.area).slice(0, 10);
      },
      /* 调试用：从屏幕坐标打一条射线，看看那个像素到底是哪块网格、什么材质。
         （排查"窗帘旁边的墙一边墨绿一边黑"这种材质拼缝时，靠眼睛猜不如直接问）
         入参 nx/ny 是 NDC（-1~1，y 向上）。 */
      probeRay: (nx, ny) => {
        const rc = new T.Raycaster();
        rc.setFromCamera(new T.Vector2(nx, ny), S.camera);
        const hits = rc.intersectObjects(S.scene.children, true)
          .filter(h => !h.object.isPoints && !h.object.isSprite && h.distance > 0.05)
          .slice(0, 4);
        return hits.map(h => {
          const o = h.object;
          const m = Array.isArray(o.material) ? o.material[0] : o.material;
          return {
            n: o.name || o.type,
            par: o.parent && o.parent.name || '',
            d: +h.distance.toFixed(2),
            t: m && m.type,
            col: m && m.color ? '#' + m.color.getHexString() : null,
            tr: !!(m && m.transparent),
            op: m && m.opacity,
            map: !!(m && m.map),
            emi: m && m.emissive ? '#' + m.emissive.getHexString() : null
          };
        });
      }
    };
    animate();
    // Screenshot-only hook: keeps the authored copy untouched while making the four wall beats reviewable.
    if (params.get('walknow')) { setTimeout(() => startKitchenWalk(function(){}), 600); }
    const shadowShot = params.get('shadowShot');
    if (shadowShot) {
      const shotValue = Math.max(0, Math.min(1, Number(shadowShot) || 0));
      const intro = $('#intro');
      if (intro) intro.classList.add('gone');
      const veil = $('#veil');
      if (veil) veil.classList.add('lift');
      enterShadowPlay();
      SCN.preview = true;
      setShadowProgress(shotValue);
      SHADOW.veil.style.opacity = '0';
    }
    if (shadowShot) return;
    await walkIn();          // ③ 脚步声走近窗子
    mountStyleBar();         // 房间亮出来之后才给风格切换栏（打字阶段不打扰）
    prewarmStyles();         // 站在窗前看的这会儿，空闲时先把点云建好
  }

  /* 第一次切到「② 量子点云」会顿一下：点云要扫 42 万个三角面 × 按面积采样。
     默认风格是全息勘察，边线在启动时就建了；点云则留到这里用空闲时间预热。
     失败也不管 —— 真到用户点的时候 applyStyle 里还有一次兜底构建。 */
  function prewarmStyles() {
    const run = () => {
      if (!S.room || S.cloudGroup) return;
      const t0 = performance.now();
      try {
        buildCloud();
        S._cloudBuildMs = Math.round(performance.now() - t0);
      } catch (err) {
        console.warn('点云预热失败，切风格时会重建：', err && err.message);
      }
    };
    if (S.cloudGroup) return;
    if ('requestIdleCallback' in window) {
      requestIdleCallback(run, { timeout: 8000 });
    } else {
      setTimeout(run, 3000);
    }
  }

  /* 备用房间的打包（room-max 9.6 MB + restaurant 1.1 MB）不再在 <head> 里无条件加载，
     按 ?room= 真要的时候再补一张 <script>。省掉启动时 10 MB 的解析，也省掉它们常驻内存。 */
  const ROOM_SCRIPTS = {
    'sample-room-max': 'assets/room-max.js?v=37',
    'sample-restaurant': 'assets/restaurant.js?v=37',
  };
  function ensureRoomSample(id) {
    return new Promise((resolve) => {
      const have = (window.SCENE_SAMPLES || []).some(s => s.id === id);
      const src = ROOM_SCRIPTS[id];
      if (have || !src) return resolve();
      const el = document.createElement('script');
      el.src = src;
      el.onload = () => resolve();
      el.onerror = () => resolve();   // 拉不到就让 loadAssets 走它自己的回退
      document.head.appendChild(el);
    });
  }

  /* boot 是最容易「静默半途而废」的地方：解析资产、建场景、绑交互，任何一步抛错
     都会把一张黑屏留在用户面前。所以入口包一层，出错就把话说出来。 */
  async function start() {
    try {
      await ensureRoomSample(ROOM_PREF);
      await boot();
    } catch (err) {
      failWith('序章初始化失败', err);
    }
  }

  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', start);
  else start();
})();

