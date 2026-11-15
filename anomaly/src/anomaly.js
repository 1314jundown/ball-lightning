/* ============================================================================
   异象一 · 家
   一间屋子，两段人生：厨房/餐厅用序章那个真模型（room-max），客厅、卫生间用
   方块先搭出来，后期换成模型即可。

   布局（米，x 向右，z 向里，原点在厨房中央附近）：
     厨房·餐厅  room-max      x[-2.5, 4.2]  z[-2.1, 3.1]
     客厅                      x[-2.5, 2.2]  z[ 2.9, 7.2]
     卫生间                    x[ 2.2, 4.1]  z[ 5.2, 7.2]
     出口：厨房到客厅整面敞开（room-max 本来就没有前墙）；客厅东墙留门洞通卫生间。

   交互（对着原文写的）：
     1 灯——进门先摸到开关，灯亮，线才亮起来
     2 桌面薄灰——两年不该只有这么薄
     3 倒扣的杯子——我走时没倒扣
     4 镜子——干净得反常，画不出小人儿
     5 水龙头——关了两年，流出清水
     6 书架底层的画——画里有一座我上学后才建的水塔（第三条线索，触发异象）
     7 池沿的头发——半黑半白，一碰就散
   ========================================================================== */
(function () {
  'use strict';

  const T = window.THREE;
  if (!T) { console.error('[anomaly] 没有 THREE'); return; }
  const Core = window.SceneCore || null;

  /* ---------------------------------------------------------------- 常量 */
  const INK = 0x0d0c0a;          // 实体色（压得很暗，线才是主角）
  const LINEC = 0xded3bb;        // 结构线
  const DIMC = 0x6b6252;         // 碎边
  const FLOORY = 0;

  /* 现在的场景是用户从 SketchUp 导出的整间老宅（7.9 × 7.5 m，87 万面）。
     世界坐标 = 模型自身坐标：x 向右、z 向里、y 向上，地板在 y=0。
     墙体碰撞先用一个内缩到墙内的矩形兜住，家具走不过去也不会卡死。 */
  const HOUSE = { x0: 0.30, x1: 7.30, z0: -6.90, z1: -0.40 };
  const ROOMS = {
    kitchen: HOUSE,
    living: HOUSE,
    bath: HOUSE
  };
  const LIVING = ROOMS.living;
  const BATH = ROOMS.bath;

  // 出生点：屋子南侧空地，面朝餐桌（餐桌在北墙边）
  const SPAWN = { x: 4.55, z: -3.55, yaw: 0.05, pitch: -0.02 };

  // 南墙外侧补出来的卫生间（线框搭建）
  const BATH2 = { x0: 2.25, x1: 4.85, z0: 0.20, z1: 3.20 };
  const BATH_OFFSET = { x: -0.52, z: 9.87 };  // 把 Blender 里的卫生间平移到屋子南侧
  const BATH_H = 2.50;
  const DOORS = [
    // 南墙上的门洞：从屋里走进卫生间
    { x0: 2.67, x1: 3.37, z0: -0.42, z1: 0.55 }
  ];

  // 家具挡路（AABB）
  const BLOCKERS = [];
  function blocker(x, z, w, d) { BLOCKERS.push({ x0: x - w / 2, x1: x + w / 2, z0: z - d / 2, z1: z + d / 2 }); }

  /* ---------------------------------------------------------------- 场景 */
  const canvas = document.getElementById('stage');
  const renderer = Core ? Core.createRenderer(canvas) : new T.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x03060c, 1);
  if (T.SRGBColorSpace) renderer.outputColorSpace = T.SRGBColorSpace;

  const scene = new T.Scene();
  // 距离雾：越远的线越淡，最后化进背景，避免整屋子线条一起糊在眼前。
  scene.fog = new T.FogExp2(0x03101f, 0.10);
  const camera = new T.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.18, 90);

  // 灯只影响"还没被全息化的东西"（比如开灯前的那点环境辉光）
  const amb = new T.AmbientLight(0x9fb6e4, 1.75);
  const lamp = new T.PointLight(0xbfd0ff, 0, 14, 2);
  lamp.position.set(0.1, 2.5, 5.0);
  const winLight = new T.PointLight(0xded3bb, 2.4, 9, 2);
  winLight.position.set(-2.2, 1.7, 5.2);
  const flash = new T.AmbientLight(0xf0ead9, 0);
  scene.add(amb, lamp, winLight, flash);

  /* ---------------------------------------------------------------- 材质 */
  function holoMat(color, opacity) {
    return new T.MeshBasicMaterial({
      color: color, transparent: true, opacity: opacity,
      side: T.DoubleSide, depthWrite: true, fog: true
    });
  }
  function lineMat(color, opacity) {
    return new T.LineBasicMaterial({ color: color, transparent: true, opacity: opacity, depthWrite: false, fog: true });
  }

  const BODY = holoMat(INK, 0.34);
  const LINE = lineMat(LINEC, 0.64);
  const DIML = lineMat(DIMC, 0.30);
  const WALLB = holoMat(INK, 0.34);

  const lit = { bodies: [BODY, WALLB], lines: [LINE, DIML], on: false };
  const propBodies = [];

  /* ---------------------------------------------------------------- 方块 */
  function box(w, h, d, mat, edgeMat) {
    const g = new T.Group();
    const mesh = new T.Mesh(new T.BoxGeometry(w, h, d), mat || BODY);
    g.add(mesh);
    if (edgeMat !== null) {
      const eg = new T.EdgesGeometry(mesh.geometry);
      const ln = new T.LineSegments(eg, edgeMat || LINE);
      ln.renderOrder = 4;
      g.add(ln);
    }
    return g;
  }
  function place(g, x, y, z) { g.position.set(x, y, z); scene.add(g); return g; }

  /* ---------------------------------------------------------------- 墙 */
  function buildShell() {
    // 墙、地、顶都在 SketchUp 模型里，这里不再用方块搭。
  }


  /* ---------------------------------------------------------------- 门与窗 */
  function buildSouthWall() {
    // 入户门交给 SketchUp 模型，这里不再贴假门板。
  }

  function buildWindow() {
    // 窗在 SketchUp 模型里，不再画假窗。
  }

  /* ---------------------------------------------------------------- 道具 */
  let windowAnim = null;

  const lineFade = [];
  const LINE_FAR = 6.6, LINE_NEAR = 2.4;
  let fadeTick = 0, mapTick = 0;

  const _fadeV = new T.Vector3();
  function updateLineFade() {
    const cp = camera.position;
    for (let i = 0; i < lineFade.length; i++) {
      const ln = lineFade[i];
      const u = ln.userData;
      if (!u.bs) {
        if (!ln.geometry.boundingSphere) ln.geometry.computeBoundingSphere();
        u.bs = ln.geometry.boundingSphere.clone();
      }
      _fadeV.copy(u.bs.center).applyMatrix4(ln.matrixWorld);
      const dx = _fadeV.x - cp.x, dy = _fadeV.y - cp.y, dz = _fadeV.z - cp.z;
      // 减去半径的 60%：贴着墙站时，墙再长也算"近"
      let d = Math.sqrt(dx * dx + dy * dy + dz * dz) - u.bs.radius * 0.6;
      if (d < 0) d = 0;
      let k = (LINE_FAR - d) / (LINE_FAR - LINE_NEAR);
      if (k > 1) k = 1; else if (k < 0) k = 0;
      const mat = ln.material;
      if (k >= 0.995) {
        if (mat.opacity !== ln.userData.baseOpacity) mat.opacity = ln.userData.baseOpacity;
        if (!ln.visible) ln.visible = true;
      } else if (k <= 0.004) {
        if (ln.visible) ln.visible = false;
      } else {
        if (!ln.visible) ln.visible = true;
        mat.opacity = ln.userData.baseOpacity * k;
      }
    }
  }

  function wireObject(obj, bodyMat, edgeMat, angle) {
    // 先收集再处理：边加描边边遍历会无限递归（给 o 加子网格，traverse 又访问到它）
    const list = [];
    obj.traverse(function (o) { if (o.isMesh && o.geometry && !o.userData.isRim) list.push(o); });
    list.forEach(function (o) {
      // 大面（墙 / 地板 / 天花）写深度，挡住屋外和身后的东西；
      // 小件（家具、器物）不写深度，否则它们自己的线会被自己的"皮"挡没，看着像沉进了地里。
      let big = true;
      try {
        o.geometry.computeBoundingBox();
        const bb = o.geometry.boundingBox;
        const mx = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y, bb.max.z - bb.min.z);
        big = mx > 1.6;
      } catch (e) { /* 算不出就按大面处理 */ }
      const bm = bodyMat.clone();
      bm.depthWrite = big;
      if (!o.userData.origMat) o.userData.origMat = o.material;
      o.userData.wireMat = bm;
      o.material = bm;
      o.renderOrder = 2;
      if (edgeMat === null) {
        // 半透明实体 + 背面外扩描边（网格级放大，几何不动）
        const rimMat = new T.MeshBasicMaterial({
          color: LINEC, side: T.BackSide, transparent: true, opacity: 0.22, depthWrite: false, fog: true
        });
        const rim = new T.Mesh(o.geometry, rimMat);
        rim.scale.setScalar(1.015);
        rim.renderOrder = 1;
        rim.userData.isRim = true;
        o.add(rim);
        return;
      }
      try {
        const raw = new T.EdgesGeometry(o.geometry, angle || 52);
        const pa = raw.attributes.position;
        const keep = [];
        const MIN_EDGE = 0.045;
        for (let i = 0; i < pa.count; i += 2) {
          const ax = pa.getX(i), ay = pa.getY(i), az = pa.getZ(i);
          const bx = pa.getX(i + 1), by = pa.getY(i + 1), bz = pa.getZ(i + 1);
          const dx = bx - ax, dy = by - ay, dz = bz - az;
          if (dx * dx + dy * dy + dz * dz < MIN_EDGE * MIN_EDGE) continue;
          keep.push(ax, ay, az, bx, by, bz);
        }
        if (keep.length < 6) return;
        const eg = new T.BufferGeometry();
        eg.setAttribute('position', new T.Float32BufferAttribute(keep, 3));
        const lm = (edgeMat || LINE).clone();
        const ln = new T.LineSegments(eg, lm);
        ln.userData.isEdge = true;
        ln.renderOrder = 4;
        ln.userData.baseOpacity = lm.opacity;
        lineFade.push(ln);
        o.add(ln);
      } catch (e) { /* 个别几何体算不出边，跳过 */ }
    });
  }

  function sampleById(id) {
    return (window.SCENE_SAMPLES || []).find(function (s) { return s.id === id; }) || null;
  }

  async function loadProp(id, scale, pos, rotY) {
    window.__propLog = window.__propLog || [];
    const s = sampleById(id);
    window.__propLog.push(id + ':' + (s ? 'sample' : 'nosample') + ':' + (Core ? 'core' : 'nocore'));
    if (!s || !Core) return null;
    try {
      const obj = await Core.parseModel(await Core.sampleBuf(s), id + '.glb');
      const pb = holoMat(0x162f55, 0.55);
      propBodies.push(pb);
      wireObject(obj, pb, null, 0);
      const b = Core.boxOf(obj);
      obj.position.set(pos[0], pos[1] - b.box.min.y * scale, pos[2]);
      obj.scale.setScalar(scale);
      obj.rotation.y = rotY || 0;
      scene.add(obj);
      return obj;
    } catch (e) {
      window.__propLog.push(id + ':ERR:' + (e && e.message));
      console.warn('[anomaly] 道具没加载上', id, e);
      return null;
    }
  }

  /* ---------------------------------------------------------------- 摆放 */
  const TABLE = { x: 5.92, z: -5.34, y: 0.844 };
  let painting = null, cupObj = null, hairSprite = null, paintingFlip = -1, burnT = -1;
  let bathRoot = null, doorBeacon = null;

  function hideCupModel() {
    try {
      scene.traverse(function (o) {
        const nm = o.name || '';
        if (nm === 'cup' || nm === 'cup_1') { o.visible = false; o.traverse(function (c) { c.visible = false; }); }
      });
    } catch (e) { /* ignore */ }
  }

  /* 倒扣的玻璃杯：用户给的 Everyday Models 玻璃杯，倒过来搁在桌上 */
  async function placeGlass() {
    const gs = sampleById('prop-glass');
    if (!gs || !Core) return;
    try {
      const cup = await Core.parseModel(await Core.sampleBuf(gs), 'glassware.glb');

      /* 取最高的那只网格（A012 里是两只） */
      let pick = null, pickH = -1;
      const tb = new T.Box3(), sz = new T.Vector3();
      cup.updateWorldMatrix(true, true);
      cup.traverse(function (o) {
        if (!o.isMesh) return;
        tb.setFromObject(o);
        tb.getSize(sz);
        const h = Math.max(sz.x, sz.y, sz.z);
        if (h > pickH) { pickH = h; pick = o; }
      });
      if (!pick) return;

      const geo = pick.geometry;
      geo.computeBoundingBox();
      const ls = geo.boundingBox.getSize(new T.Vector3());

      /* 1) 把几何的长轴转到 Y（模型导出时经常不是 Y 朝上） */
      const rot = new T.Matrix4();
      let axis = 'y';
      if (ls.z >= ls.x && ls.z >= ls.y) { axis = 'z'; rot.makeRotationX(-Math.PI / 2); }
      else if (ls.x >= ls.y && ls.x >= ls.z) { axis = 'x'; rot.makeRotationZ(Math.PI / 2); }

      const pa = geo.attributes.position;
      const v = new T.Vector3();
      const pts = [];
      const step = Math.max(1, Math.floor(pa.count / 2400));
      for (let i = 0; i < pa.count; i += step) {
        v.fromBufferAttribute(pa, i).applyMatrix4(rot);
        pts.push(v.x, v.y, v.z);
      }
      let yMin = Infinity, yMax = -Infinity;
      for (let i = 1; i < pts.length; i += 3) { yMin = Math.min(yMin, pts[i]); yMax = Math.max(yMax, pts[i]); }
      const hgt = yMax - yMin || 1;
      let cx = 0, cz = 0, n = 0;
      for (let i = 0; i < pts.length; i += 3) { cx += pts[i]; cz += pts[i + 2]; n++; }
      cx /= n; cz /= n;

      function endOpen(lo, hi) {
        let rMin = Infinity, rMax = 0;
        for (let i = 0; i < pts.length; i += 3) {
          const t = (pts[i + 1] - yMin) / hgt;
          if (t < lo || t > hi) continue;
          const r = Math.hypot(pts[i] - cx, pts[i + 2] - cz);
          if (r < rMin) rMin = r;
          if (r > rMax) rMax = r;
        }
        // 端面附近若有点几乎落在轴线上，说明那面是"封死的底"
        return rMin > rMax * 0.30;
      }

      const topOpen = endOpen(0.93, 1.001);
      const botOpen = endOpen(-0.001, 0.07);
      const flip = topOpen && !botOpen;     // 杯口在上面 → 需要翻过来

      const solo = new T.Mesh(geo, new T.MeshBasicMaterial({
        color: 0xcfc7b6, side: T.DoubleSide, fog: true
      }));
      solo.name = 'glassCup';
      solo.visible = false;   // 茶几上本来就有茶杯，不再自造一只
      solo.traverse(function (o) { o.userData.noCollapse = true; });
      solo.quaternion.setFromRotationMatrix(rot);
      if (flip) solo.rotateX(Math.PI);      // 绕自身 X 轴翻 180°，杯口朝下
      solo.scale.setScalar(0.0112);
      scene.add(solo);

      // 落地 + 量最终尺寸
      solo.updateWorldMatrix(true, true);
      let bb = new T.Box3().setFromObject(solo);
      solo.position.x += TABLE.x - 0.34 - bb.getCenter(new T.Vector3()).x;
      solo.position.z += TABLE.z + 0.30 - bb.getCenter(new T.Vector3()).z;
      solo.updateWorldMatrix(true, true);
      bb = new T.Box3().setFromObject(solo);
      solo.position.y += (TABLE.y + 0.002) - bb.min.y;
      solo.updateWorldMatrix(true, true);
      bb = new T.Box3().setFromObject(solo);
      const size = bb.getSize(new T.Vector3());
      const ctr = bb.getCenter(new T.Vector3());

      const g = new T.Group();
      g.name = 'glassMarks';
      const eg = new T.EdgesGeometry(geo, 26);
      const ln = new T.LineSegments(eg, new T.LineBasicMaterial({
        color: 0xdcebff, transparent: true, opacity: 0.40, fog: true
      }));
      ln.matrixAutoUpdate = false;
      ln.matrix.copy(solo.matrixWorld);
      g.add(ln);

      // 杯口那一圈（翻过之后在底下）
      const rim = new T.Mesh(
        new T.TorusGeometry(size.x * 0.5 * 0.95, 0.0024, 6, 44),
        new T.MeshBasicMaterial({ color: 0xf2f7ff, transparent: true, opacity: 0.9, fog: true })
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.set(ctr.x, bb.min.y + 0.004, ctr.z);
      g.add(rim);

      scene.add(g);
      window.__glassTris = 1;
      window.__glassInfo = { axis: axis, topOpen: topOpen, botOpen: botOpen, flip: flip, h: +size.y.toFixed(3), d: +size.x.toFixed(3) };
    } catch (e) { console.warn('[anomaly] 杯子没加载上', e); }
  }

  async function furnish() {
    /* 桌面的真实高度：线框模式下看不见表面，贴图模式下就露馅（蛋糕陷进柜子）。
       从正上方往下打一条射线，取第一个低于 1.3 m 的命中点，当作桌面。 */
    try {
      /* 单点射线容易打到盘子边，取蛋糕周围一圈里"法线朝上"的命中点，用中位数当桌面 */
      const ys = [];
      const off = [[0, 0], [0.18, 0], [-0.18, 0], [0, 0.18], [0, -0.18]];
      for (const [dx, dz] of off) {
        const rd = new T.Raycaster(
          new T.Vector3(TABLE.x - 0.34 + dx, 2.0, TABLE.z - 0.28 + dz),
          new T.Vector3(0, -1, 0)
        );
        const hits = rd.intersectObjects(scene.children, true).filter(function (h) {
          if (!h.point || h.point.y > 0.88 || h.point.y < 0.45) return false;
          if (h.object.userData && h.object.userData.isEdge) return false;
          if (h.face && Math.abs(h.face.normal.y) < 0.7) return false;
          return true;
        });
        if (hits.length) ys.push(hits[0].point.y);
      }
      if (ys.length) {
        ys.sort(function (a, b) { return a - b; });
        TABLE.y = ys[Math.floor(ys.length / 2)] + 0.004;
      }
    } catch (e) { /* 打不中就沿用常量 */ }

    // 桌上那只生日蛋糕：序章的 blender 30 号模型，原贴图、不转线框
    const ck = sampleById('cake-blend30');
    if (ck && Core) {
      try {
        const cake = await Core.parseModel(await Core.sampleBuf(ck), 'cake-blend30.glb');
        cake.position.set(TABLE.x - 0.30, TABLE.y, TABLE.z - 0.20);
      cake.traverse(function (o) { o.userData.noCollapse = true; });
        cake.scale.setScalar(0.74);
        hideCupModel();
        setTimeout(hideCupModel, 1500);
        setTimeout(hideCupModel, 3500);
        cake.rotation.y = 0.6;
        cake.traverse(function (o) {
          if (!o.isMesh) return;
          const src = o.material;
          o.material = new T.MeshBasicMaterial({
            map: src && src.map ? src.map : null,
            color: src && src.color ? src.color.clone().multiplyScalar(0.92) : 0xffffff,
            transparent: !!(src && src.transparent),
            opacity: src && src.transparent ? src.opacity : 1,
            side: T.DoubleSide,
            depthWrite: true
          });
        });
        /* 蛋糕模型里自带一块 0.29 m 的白色平面（名字就叫 Plane），会像一把刀片插在旁边 */
        try {
          cake.traverse(function (o) {
            if (o.isMesh && (o.name === 'Plane' || o.name === 'Plane_1')) o.visible = false;
          });
        } catch (e) { /* 没有就算了 */ }

        scene.add(cake);

        /* 接触阴影：线框/贴图两种模式下，蛋糕都需要一点"压在桌面上"的暗影，
           否则浅色盘子和深色木桌面之间没有过渡，看着像悬空。 */
        try {
          const sc = document.createElement('canvas');
          sc.width = sc.height = 128;
          const g2 = sc.getContext('2d');
          const rg = g2.createRadialGradient(64, 64, 6, 64, 64, 62);
          rg.addColorStop(0, 'rgba(0,0,0,0.55)');
          rg.addColorStop(0.55, 'rgba(0,0,0,0.22)');
          rg.addColorStop(1, 'rgba(0,0,0,0)');
          g2.fillStyle = rg;
          g2.fillRect(0, 0, 128, 128);
          const tex = new T.CanvasTexture(sc);
          const shadow = new T.Mesh(
            new T.PlaneGeometry(0.92, 0.92),
            new T.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.85, depthWrite: false, fog: true })
          );
          shadow.rotation.x = -Math.PI / 2;
          shadow.position.set(TABLE.x - 0.30, TABLE.y + 0.004, TABLE.z - 0.20);
          shadow.renderOrder = 1;
          scene.add(shadow);
        } catch (e) { /* 阴影加不上就算了 */ }

        /* 蛋糕下面那一片桌上的碗碟先清掉：模型自带的茶具挤在一起，
           蛋糕一放上去就是"压在别人东西上"。只清蛋糕周围 0.6 m、桌面高度附近的物件。 */
        try {
          const cx = TABLE.x - 0.34, cz = TABLE.z - 0.28;
          const box = new T.Box3();
          const ctr = new T.Vector3();
          scene.traverse(function (o) {
            if (!o.isMesh || o === cake) return;
            if (o.userData && (o.userData.isEdge || o.userData.isRim)) return;
            box.setFromObject(o);
            box.getCenter(ctr);
            const dx = ctr.x - cx, dz = ctr.z - cz;
            if (dx * dx + dz * dz > 1.05 * 1.05) return;
            const sz = box.getSize(new T.Vector3());
            if (sz.x > 0.62 || sz.z > 0.62) return;   // 别把桌子本身删了
            if (ctr.y < 0.55 || ctr.y > 1.45) return;
            o.visible = false;
            window.__cleared = (window.__cleared || 0) + 1;
          });
        } catch (e) { /* 清不掉就留着 */ }
        window.__cake = cake;
      } catch (e) { console.warn('[anomaly] 蛋糕没加载上', e); }
    }

    // 家具都在 SketchUp 模型里，这里只补"会被点击的东西"。
    // 倒扣的杯子（原文：我走时没倒扣，现在它是倒扣着的）—— 放在餐桌桌面上
    blocker(TABLE.x, TABLE.z, 1.6, 1.3);
    cupObj = await loadProp('prop-cup', 1.25, [TABLE.x - 0.28, TABLE.y + 0.05, TABLE.z + 0.14], 0);
    // 位置回到原稿（蛋糕右后侧），只把陷进桌面的 9cm 提回桌面
    // 原文：走时杯子正着，现在是倒扣的 —— 真的翻过来，并换成白瓷
    if (cupObj) {
      cupObj.rotation.set(Math.PI, 0.7, 0);
      cupObj.traverse(function (o) {
        if (!o.isMesh || !o.material) return;
        const ms = Array.isArray(o.material) ? o.material : [o.material];
        ms.forEach(function (m) {
          if (m.color) m.color.setHex(0xe8e2d6);
          m.transparent = false; m.opacity = 1; m.depthWrite = true;
          if (m.metalness !== undefined) m.metalness = 0.0;
          if (m.transmission !== undefined) m.transmission = 0;
          if (m.thickness !== undefined) m.thickness = 0;
          if (m.ior !== undefined) m.ior = 1.5;
          if (m.attenuationDistance !== undefined) m.attenuationDistance = 1;
          m.map = null; m.alphaMap = null; m.roughnessMap = null;
          if (m.roughness !== undefined) m.roughness = 0.55;
          m.needsUpdate = true;
        });
      });
      cupObj.updateMatrixWorld(true);
      const bb = new T.Box3().setFromObject(cupObj);
      cupObj.position.y += TABLE.y - bb.min.y + 0.001;
    }
  }

  /* ---------------------------------------------------------------- 画 */
  function makePaintingTexture() {
    const c = document.createElement('canvas');
    c.width = 320; c.height = 240;
    const g = c.getContext('2d');
    g.fillStyle = '#141821'; g.fillRect(0, 0, 320, 240);
    // 灰蒙蒙的天
    const sky = g.createLinearGradient(0, 0, 0, 150);
    sky.addColorStop(0, '#3a3f47'); sky.addColorStop(1, '#4c5159');
    g.fillStyle = sky; g.fillRect(0, 0, 320, 150);
    // 四层旧楼
    for (let i = 0; i < 5; i++) {
      const x = 8 + i * 62, hh = 78 + Math.random() * 34, w = 52;
      g.fillStyle = '#2b2f36';
      g.fillRect(x, 150 - hh, w, hh);
      g.fillStyle = 'rgba(200,190,160,0.18)';
      for (let r = 0; r < Math.floor(hh / 18); r++) {
        for (let cix = 0; cix < 3; cix++) {
          if (Math.random() < 0.55) g.fillRect(x + 6 + cix * 15, 150 - hh + 8 + r * 18, 8, 10);
        }
      }
    }
    // 白杨
    g.strokeStyle = 'rgba(120,130,110,0.55)';
    for (let i = 0; i < 7; i++) {
      const x = 20 + i * 44;
      g.beginPath(); g.moveTo(x, 150); g.lineTo(x + (Math.random() - 0.5) * 6, 96); g.stroke();
    }
    // 地面
    g.fillStyle = '#2f333a'; g.fillRect(0, 150, 320, 90);
    // 水塔：颜色比周围艳一点，像朵喇叭花
    g.strokeStyle = '#9fb6d8';
    g.lineWidth = 3;
    g.beginPath(); g.moveTo(246, 150); g.lineTo(246, 92); g.stroke();
    g.beginPath(); g.moveTo(246, 92); g.lineTo(232, 74); g.lineTo(260, 74); g.closePath();
    g.fillStyle = '#7f97b8'; g.fill();
    g.fillStyle = '#9fb0c8'; g.fillRect(236, 62, 20, 12);
    g.lineWidth = 1;
    // 颗粒
    for (let i = 0; i < 2600; i++) {
      g.fillStyle = 'rgba(0,0,0,' + (0.03 + Math.random() * 0.05) + ')';
      g.fillRect(Math.random() * 320, Math.random() * 240, 1, 1);
    }
    return new T.CanvasTexture(c);
  }

  function hairGlowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g2 = c.getContext('2d');
    const rg = g2.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0, 'rgba(255,246,220,0.55)');
    rg.addColorStop(0.45, 'rgba(255,226,170,0.18)');
    rg.addColorStop(1, 'rgba(255,210,140,0)');
    g2.fillStyle = rg;
    g2.fillRect(0, 0, 64, 64);
    return new T.CanvasTexture(c);
  }

  function spawnHair() {
    if (hairSprite) return;
    const g = new T.Group();

    // 三缕弯的发丝（比之前的直线粗、亮，能看清半黑半白）
    const strands = [
      { x: -0.06, z: -0.02, r: 0.30, col: 0xf2f6ff, curl: 0.030 },
      { x: 0.02, z: 0.04, r: 0.22, col: 0x5f6d84, curl: -0.026 },
      { x: 0.08, z: -0.05, r: 0.26, col: 0xe8eefc, curl: 0.022 }
    ];
    for (let i = 0; i < strands.length; i++) {
      const st = strands[i];
      const pts = [];
      for (let k = 0; k <= 10; k++) {
        const u = k / 10;
        pts.push(new T.Vector3(
          st.x + Math.sin(u * 3.1 + i) * st.curl,
          0.008 + Math.sin(u * Math.PI) * 0.010,
          st.z + u * st.r
        ));
      }
      const curve = new T.CatmullRomCurve3(pts);
      const tube = new T.Mesh(
        new T.TubeGeometry(curve, 26, 0.0026, 6, false),
        new T.MeshBasicMaterial({ color: st.col, transparent: true, opacity: 0.95, fog: true })
      );
      g.add(tube);
    }

    // 一点暖光，让人一眼能注意到池沿上有东西
    const glow = new T.Sprite(new T.SpriteMaterial({
      map: hairGlowTexture(), color: 0xffe6b8, transparent: true,
      opacity: 0.75, depthWrite: false, blending: T.AdditiveBlending
    }));
    glow.scale.set(0.34, 0.34, 1);
    glow.position.set(0.01, 0.05, 0.10);
    glow.renderOrder = 6;
    g.add(glow);

    const bs = basinSpot || { x: 3.55, z: 2.04 };
    g.position.set(bs.x - 0.13, 0.925, bs.z - 0.30);
    g.rotation.y = 0.4;
    scene.add(g);
    hairSprite = g;

    // 镜头轻轻转向池沿（人就在附近的时候）
    setTimeout(function () {
      if (S.phase !== 'play' || S.cine) return;
      const tx = bs.x - 0.05, ty = 0.88, tz = bs.z - 0.19;
      const d = Math.hypot(tx - S.cam.x, tz - S.cam.z);
      if (d > 2.6) return;
      S.cine = {
        t: 0, dur: 0.9,
        from: { x: S.cam.x, z: S.cam.z, yaw: S.cam.yaw, pitch: S.cam.pitch },
        to: { x: S.cam.x, z: S.cam.z,
              yaw: Math.atan2(-(tx - S.cam.x), -(tz - S.cam.z)),
              pitch: Math.atan2(ty - 1.5, Math.max(0.45, d)) }
      };
    }, 260);
    hot('hair', '池沿上的头发', [(basinSpot ? basinSpot.x - 0.13 : 5.55), 0.95, (basinSpot ? basinSpot.z - 0.30 : 1.85)], 2.4, function () {
      if (S.clues.indexOf('hair') >= 0) { toast('头发还在那里。半黑，半白。'); return; }
      addClue('hair', '一根半黑半白的长发。不是我的——我从来没留过这么长的头发。');
      openExamine('hair');
      quote('那是几根头发，有的全白，与池面几乎融为一体；有的则白了一半，正是那些黑的部分使我看到了它们。这不可能是我两年前留下的，我从来没有过这么长的头发，更没有白发。');
      setTimeout(triggerAnomaly, 1600);
    });
  }

  function buildPainting() {
    const grp = new T.Group();
    // 先用程序画的占位，真图（用户 AI 生成的水塔）加载完就换上去
    const canvasMat = new T.MeshBasicMaterial({
      map: makePaintingTexture(), transparent: true, opacity: 1, side: T.FrontSide, fog: true
    });
    const canvasMesh = new T.Mesh(new T.PlaneGeometry(0.56, 0.42), canvasMat);
    grp.add(canvasMesh);

    try {
      new T.TextureLoader().load('samples/painting/tower.png', function (t) {
        if ('colorSpace' in t && T.SRGBColorSpace) t.colorSpace = T.SRGBColorSpace;
        t.anisotropy = 4;
        canvasMat.map = t;
        canvasMat.needsUpdate = true;
        if (window.__paintingTex) window.__paintingTex = true;
      }, undefined, function () { /* 加载失败就留着占位画 */ });
    } catch (e) { /* ignore */ }

    // 画框：四条边，深色木头 + 一点冷光
    const FW = 0.035, FD = 0.028;
    const frameMat = holoMat(0x1d2532, 0.96);
    const barT = new T.Mesh(new T.BoxGeometry(0.56 + FW * 2, FW, FD), frameMat);
    barT.position.set(0, 0.21 + FW / 2, 0);
    const barB = barT.clone(); barB.position.set(0, -0.21 - FW / 2, 0);
    const barL = new T.Mesh(new T.BoxGeometry(FW, 0.42, FD), frameMat);
    barL.position.set(-0.28 - FW / 2, 0, 0);
    const barR = barL.clone(); barR.position.set(0.28 + FW / 2, 0, 0);
    grp.add(barT, barB, barL, barR);
    const fr = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(0.63, 0.49, FD)), lineMat(0xd8cdb4, 0.7));
    fr.position.z = 0;
    grp.add(fr);

    // 背面
    const back = new T.Mesh(
      new T.PlaneGeometry(0.56, 0.42),
      new T.MeshBasicMaterial({ color: 0x6b5a44, transparent: false, opacity: 1, side: T.DoubleSide, fog: true })
    );
    back.scale.set(1.08, 1.08, 1);
    back.position.z = -0.006;
    grp.add(back);
    // 原文：书架底层还有一幅，画面朝下放着。
    grp.position.set(4.30, 0.42, -6.86);
    grp.rotation.y = Math.PI + 0.06;
    grp.rotation.x = -0.20;
    grp.renderOrder = 3;
    scene.add(grp);
    return grp;
  }

  /* ---------------------------------------------------------------- 卫生间 */
  let mirrorMesh = null, faucetWater = null, sinkTop = 0.86;
  let basinSpot = null, bathGroup = null;

  /* 房间的墙地顶用线框搭（跟老宅一个风格），洁具用用户给的 Blender 套件：
     洗手盆 / 龙头 / 马桶 / 镜子 / 毛巾架，48k 面。 */
  async function buildBath() {
    const R = BATH2, H = BATH_H;
    const LC = 0xc9bda3;
    const g = new T.Group();

    const seg = function (a, b, op) {
      const geo = new T.BufferGeometry().setFromPoints([
        new T.Vector3(a[0], a[1], a[2]), new T.Vector3(b[0], b[1], b[2])
      ]);
      return new T.Line(geo, lineMat(LC, op === undefined ? 0.42 : op));
    };

    // 地面网格
    for (let x = R.x0; x <= R.x1 + 0.001; x += 0.30) g.add(seg([x, 0.004, R.z0], [x, 0.004, R.z1], 0.14));
    for (let z = R.z0; z <= R.z1 + 0.001; z += 0.30) g.add(seg([R.x0, 0.004, z], [R.x1, 0.004, z], 0.14));

    // 四面墙：竖筋 + 顶边，北墙留门洞
    const dA = DOORS[0].x0, dB = DOORS[0].x1;
    for (let x = R.x0; x <= R.x1 + 0.001; x += 0.60) {
      const inDoor = x > dA - 0.04 && x < dB + 0.04;
      if (!inDoor) g.add(seg([x, 0, R.z0], [x, H, R.z0], 0.26));
      g.add(seg([x, 0, R.z1], [x, H, R.z1], 0.26));
    }
    for (let z = R.z0; z <= R.z1 + 0.001; z += 0.60) {
      g.add(seg([R.x0, 0, z], [R.x0, H, z], 0.26));
      g.add(seg([R.x1, 0, z], [R.x1, H, z], 0.26));
    }
    g.add(seg([R.x0, H, R.z0], [R.x1, H, R.z0], 0.3));
    g.add(seg([R.x0, H, R.z1], [R.x1, H, R.z1], 0.3));
    g.add(seg([R.x0, H, R.z0], [R.x0, H, R.z1], 0.3));
    g.add(seg([R.x1, H, R.z0], [R.x1, H, R.z1], 0.3));
    // 门框
    g.add(seg([dA, 0, R.z0], [dA, 2.05, R.z0], 0.7));
    g.add(seg([dB, 0, R.z0], [dB, 2.05, R.z0], 0.7));
    g.add(seg([dA, 2.05, R.z0], [dB, 2.05, R.z0], 0.7));

    scene.add(g);
    bathGroup = g;

    const s2 = sampleById('sample-bathroom');
    if (!s2 || !Core) return;
    try {
      const obj = await Core.parseModel(await Core.sampleBuf(s2), 'bathroom.glb');
      // 洁具保留原贴图材质（不线框化），在这间线框老宅里像一块"真实"的切片
      obj.traverse(function (o) {
        if (!o.isMesh) return;
        const m = o.material;
        if (m) { m.side = T.FrontSide; m.metalness = 0; m.roughness = 0.92; if (m.color) m.color.multiplyScalar(0.72); }
        /* 镜面：又薄又方的板子，贴图模式下会白成一块灯箱，单独压成深色镜面 */
        try {
          const bb3 = new T.Box3().setFromObject(o);
          const s3 = bb3.getSize(new T.Vector3());
          const flat = Math.min(s3.x, s3.z) < Math.max(s3.x, s3.z) * 0.12;
          if (flat && s3.y > 0.30 && s3.y < 1.00 && m) {
            m.color.setHex(0x1d1a17);
            m.roughness = 0.2;
            m.metalness = 0.1;
          }
        } catch (e2) { /* 忽略 */ }
        const nm = (o.name || '').toLowerCase();
        if (nm.indexOf('miroir') >= 0 && m) { m.color.setHex(0x1a1815); m.roughness = 0.2; }
      });
      obj.position.set(BATH_OFFSET.x, 0, BATH_OFFSET.z);
      scene.add(obj);
      bathRoot = obj;

      // 卫生间在屋外，屋里那盏灯照不到，单独补一盏
      const cx2 = (BATH2.x0 + BATH2.x1) / 2, cz2 = (BATH2.z0 + BATH2.z1) / 2;
      const bl = new T.PointLight(0xeaf2ff, 2.0, 7.0, 2);
      bl.position.set(cx2, 2.28, cz2);
      scene.add(bl);
      // 侧向补光：不然盆和镜子只剩一道边
      const fill = new T.PointLight(0xf0ead9, 1.1, 5.0, 2);
      fill.position.set(cx2 - 0.55, 1.35, cz2 - 0.65);
      scene.add(fill);
      window.__bathTris = 0;
      obj.traverse(function (o) {
        if (o.isMesh) window.__bathTris++;
        if (o.isLineSegments && o.material) {
          o.material = o.material.clone();
          o.material.opacity = 0.75;
          o.material.color.setHex(0xcfe2ff);
        }
      });
    } catch (e) {
      console.warn('[anomaly] 卫生间洁具没加载上', e);
    }

    // 洗手盆：Blender (4.07, 7.83) → three (4.07, -7.83) → 加平移
    const bx = 4.07 + BATH_OFFSET.x, bz = -7.83 + BATH_OFFSET.z;
    basinSpot = { x: bx, y: 0.90, z: bz };

    // 门口：南墙上那个位置推门就进（老宅的南墙是实心的，走过去会撞墙，所以做成"推门"）
    // 门扇：深色门板挡住后面的窗格，否则"门"后面透出一扇窗，很怪
    const doorPanel = box(1.26, 2.10, 0.05, holoMat(0x0c0b0a, 0.98),
      new T.LineBasicMaterial({ color: 0xd99a4e, transparent: true, opacity: 0.9, fog: true }));
    place(doorPanel, 3.02, 1.05, -0.42);
    // 门把手
    const knob = new T.Mesh(new T.SphereGeometry(0.035, 10, 8),
      new T.MeshBasicMaterial({ color: 0xd99a4e, transparent: true, opacity: 0.9 }));
    knob.position.set(3.47, 1.02, -0.39);
    scene.add(knob);

    const doorMark = new T.Line(
      new T.BufferGeometry().setFromPoints([
        new T.Vector3(2.67, 0.02, -0.36), new T.Vector3(2.67, 2.02, -0.36),
        new T.Vector3(2.67, 2.02, -0.36), new T.Vector3(3.37, 2.02, -0.36),
        new T.Vector3(3.37, 2.02, -0.36), new T.Vector3(3.37, 0.02, -0.36),
        new T.Vector3(3.37, 0.02, -0.36), new T.Vector3(2.67, 0.02, -0.36)
      ]),
      new T.LineBasicMaterial({ color: 0xd99a4e, transparent: true, opacity: 0.85, fog: true })
    );
    scene.add(doorMark);
    const doorGlow = new T.Mesh(
      new T.SphereGeometry(0.11, 12, 10),
      new T.MeshBasicMaterial({ color: 0xd99a4e, transparent: true, opacity: 0.75 })
    );
    doorGlow.position.set(3.02, 1.15, -0.33);
    scene.add(doorGlow);
    // 门洞里整片淡琥珀色，远远就能看见"这里有一扇门"
    const doorTint = new T.Mesh(
      new T.PlaneGeometry(0.66, 1.94),
      new T.MeshBasicMaterial({ color: 0xffb35e, transparent: true, opacity: 0.10, side: T.DoubleSide, depthWrite: false, fog: true })
    );
    doorTint.position.set(3.02, 1.02, -0.34);
    scene.add(doorTint);
    // 门口一个常亮琥珀菱形，远远就能看见
    doorBeacon = new T.Mesh(
      new T.OctahedronGeometry(0.11, 0),
      new T.MeshBasicMaterial({ color: 0xd99a4e, transparent: true, opacity: 0.9, blending: T.AdditiveBlending, depthWrite: false })
    );
    doorBeacon.position.set(3.02, 1.55, -0.30);
    doorBeacon.renderOrder = 6;
    scene.add(doorBeacon);
    /* ---------- 把可交互点铺开到屋子各处，不要全挤在餐桌上 ---------- */

    // 窗边：听雨
    hot('rain', '窗玻璃上的雨', [3.60, 1.45, -6.94], 2.8, function () {
      toast('雨还在下。雨点打在窗玻璃上，噼噼啪啪，像有人在窗外低声说话。');
    });

    // 五斗柜：拉开抽屉
    hot('drawer', '五斗柜的抽屉', [5.32, 1.12, -6.62], 2.6, function () {
      toast('抽屉里是一摞旧信、一个铁皮饼干盒，还有一张全家福。照片上的人，我认不全。');
    });

    // 南墙：灯绳（拉一下开/关）
    hot('cord', '墙上的灯绳', [3.84, 1.55, -0.52], 2.2, function () {
      setLamp(!lit.on);
      toast(lit.on ? '我拉了一下灯绳，灯亮了。' : '我又拉了一下灯绳，灯灭了。');
    });

    hot('bathdoor', '门 · 推门进卫生间', [3.00, 1.10, -0.42], 2.4, function () {
      if (S.phase !== 'play') return;
      S.cam.x = 3.35; S.cam.z = 0.85; S.cam.yaw = Math.PI; S.cam.pitch = -0.12;
      applyCamera();
      toast('推门进去，是一间很久没人用的小卫生间。');
    });

    hot('bathout', '门 · 回屋', [3.35, 1.10, 0.45], 2.4, function () {
      if (S.phase !== 'play') return;
      S.cam.x = 3.35; S.cam.z = -0.75; S.cam.yaw = 0; S.cam.pitch = -0.02;
      applyCamera();
      toast('回到屋里。');
    });

    hot('basin', '盥洗池', [basinSpot.x, basinSpot.y, basinSpot.z], 2.6, function () {
      if (S.clues.indexOf('painting') < 0) { toast('水池是空的，池沿很干净。'); return; }
      if (S.burned) { toast('池沿上还有几根头发。'); return; }
      if (!S.carry) { toast('画还在外屋——先去把它拿在手上。'); return; }
      startBurn();
    });
  }

  function startBurn() {
    if (S.burned) return;
    S.carry = false;
    handChip(false);
    S.burned = true;
    toast('我把它拿到水龙头下，从一角点着了。');
    quote('画出它的水彩被烧焦了，火苗呈现一种怪异而妖艳的色彩。', 9000);
    setTimeout(function () {
      spawnHair();
      toast('池沿上，有几根半黑半白的长发。');
    }, 1500);
  }


  /* ---------------------------------------------------------------- 热点 */
  const HOTS = [];
  function hot(id, label, pos, reach, action) {
    const g = new T.SphereGeometry(0.13, 8, 6);
    const m = new T.Mesh(g, new T.MeshBasicMaterial({ color: 0xded3bb, transparent: true, opacity: 0.0 }));
    m.position.set(pos[0], pos[1], pos[2]);
    scene.add(m);
    HOTS.push({ id, label, mesh: m, pos: new T.Vector3(pos[0], pos[1], pos[2]), reach: reach || 3.2, action });
  }

  /* ---------------------------------------------------------------- 声音 */
  let actx = null, rainGain = null, thunderNode = null;

  function ensureAudio() {
    if (actx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try { actx = new AC(); } catch (e) { return; }
    if (actx.state === 'suspended') actx.resume();

    // 雨：2 秒白噪声循环 → 带通 + 低通，慢慢起
    const buf = actx.createBuffer(1, actx.sampleRate * 2, actx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;

    const src = actx.createBufferSource();
    src.buffer = buf; src.loop = true;

    const bp = actx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 1500; bp.Q.value = 0.45;

    const hp = actx.createBiquadFilter();
    hp.type = 'highpass'; hp.frequency.value = 300;

    rainGain = actx.createGain();
    rainGain.gain.value = 0;

    src.connect(bp); bp.connect(hp); hp.connect(rainGain); rainGain.connect(actx.destination);
    src.start();

    // 雨势缓慢起伏
    const lfo = actx.createOscillator();
    const lfoGain = actx.createGain();
    lfo.frequency.value = 0.07; lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain); lfoGain.connect(rainGain.gain);
    lfo.start();

    rainGain.gain.setValueAtTime(0, actx.currentTime);
    rainGain.gain.linearRampToValueAtTime(0, actx.currentTime + 0.1);
  }

  function thunder() {
    if (!actx) return;
    const dur = 1.6;
    const buf = actx.createBuffer(1, actx.sampleRate * dur, actx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      const t = i / d.length;
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.6);
    }
    const src = actx.createBufferSource(); src.buffer = buf;
    const lp = actx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 220;
    const g = actx.createGain(); g.gain.value = 0.55;
    src.connect(lp); lp.connect(g); g.connect(actx.destination);
    src.start();
  }

  function footstep() {
    if (!actx) return;
    const t0 = actx.currentTime;
    const dur = 0.16;
    const buf = actx.createBuffer(1, actx.sampleRate * dur, actx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      const t = i / d.length;
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3.2);
    }
    const src = actx.createBufferSource(); src.buffer = buf;
    const lp = actx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 380;
    const g = actx.createGain(); g.gain.value = 0.16;
    src.connect(lp); lp.connect(g); g.connect(actx.destination);
    src.start(t0);
  }

  function click() {
    if (!actx) return;
    const t0 = actx.currentTime;
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(880, t0);
    o.frequency.exponentialRampToValueAtTime(420, t0 + 0.08);
    g.gain.setValueAtTime(0.09, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
    o.connect(g); g.connect(actx.destination);
    o.start(t0); o.stop(t0 + 0.14);
  }

  function nope() {
    if (!actx) return;
    const t0 = actx.currentTime;
    const o = actx.createOscillator();
    const g = actx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(190, t0);
    o.frequency.exponentialRampToValueAtTime(120, t0 + 0.12);
    g.gain.setValueAtTime(0.05, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
    o.connect(g); g.connect(actx.destination);
    o.start(t0); o.stop(t0 + 0.18);
  }

  function whisper(times) {
    if (!actx) return;
    const n = times || 5;
    for (let k = 0; k < n; k++) {
      const t0 = actx.currentTime + k * 1.05;
      const dur = 0.5;
      const buf = actx.createBuffer(1, actx.sampleRate * dur, actx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) {
        const t = i / d.length;
        d[i] = (Math.random() * 2 - 1) * Math.sin(Math.PI * t) * (0.5 + 0.5 * Math.sin(t * 34));
      }
      const src = actx.createBufferSource(); src.buffer = buf;
      const f1 = actx.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = 620; f1.Q.value = 6;
      const f2 = actx.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = 1240; f2.Q.value = 8;
      const g = actx.createGain(); g.gain.value = 0.16;
      src.connect(f1); f1.connect(f2); f2.connect(g); g.connect(actx.destination);
      src.start(t0);
    }
  }

  /* ---------------------------------------------------------------- 原文 */
  let quoteEl = null, quoteTimer = 0;

  function setupQuote() {
    quoteEl = document.createElement('div');
    quoteEl.id = 'quote';
    quoteEl.style.cssText = [
      'position:fixed', 'left:50%', 'bottom:88px', 'transform:translateX(-50%)',
      'width:min(720px,70vw)', 'z-index:6', 'pointer-events:none',
      'font-family:"Noto Serif SC","Source Han Serif SC","Songti SC",serif',
      'font-size:clamp(15px,1.5vw,18px)', 'line-height:1.95', 'color:#f4f1ea',
      'background:linear-gradient(180deg, rgba(10,10,11,.88), rgba(10,10,11,.66))',
      'border-left:2px solid rgba(125,140,255,.55)', 'padding:12px 18px 14px',
      'opacity:0', 'transition:opacity .55s', 'text-align:left'
    ].join(';');
    document.body.appendChild(quoteEl);
  }

  let quoteTicker = 0, quoteFull = '';

  function quote(text, ms) {
    if (!quoteEl) return;
    quoteEl.innerHTML = '<em style="display:block;font-style:normal;font-family:ui-monospace,Consolas,monospace;' +
      'font-size:11px;letter-spacing:.22em;color:#c98a3f;margin-bottom:5px">原 文 · 异象之一</em>' +
      '<p id="qtext" style="margin:0;min-height:1.95em"></p>';
    const p = quoteEl.querySelector('#qtext');
    quoteEl.style.opacity = '1';
    const hintEl = document.getElementById('hint');
    const promptEl = document.getElementById('prompt');
    const toastEl = document.getElementById('toast');
    if (hintEl) hintEl.style.opacity = '0';
    if (promptEl) promptEl.style.opacity = '0';
    if (toastEl) { toastEl.classList.remove('on'); toastEl.style.opacity = '0'; }

    quoteFull = text;
    let i = 0;
    clearInterval(quoteTicker);
    quoteTicker = setInterval(function () {
      i += 1;
      if (!p) { clearInterval(quoteTicker); return; }
      p.textContent = quoteFull.slice(0, i);
      if (i >= quoteFull.length) clearInterval(quoteTicker);
    }, 26);

    clearTimeout(quoteTimer);
    quoteTimer = setTimeout(function () {
      if (quoteEl) quoteEl.style.opacity = '0';
      if (hintEl) hintEl.style.opacity = '';
      if (promptEl) promptEl.style.opacity = '';
    }, ms || 11000);
  }

  /* ---------------------------------------------------------------- 引导 */
  const GOAL_LIST = [
    { id: 'lamp', text: '摸到墙上的开关，把灯打开' },
    { id: 'dust', text: '走到桌边，看看桌面' },
    { id: 'cup', text: '桌上有一只倒扣的杯子' },
    { id: 'painting', text: '书架底层，还有一幅画' },
    { id: 'burn', text: '把画拿到盥洗池，从一角点着' },
    { id: 'hair', text: '池沿上，有几根头发' }
  ];
  let goalEl = null;
  const goalMarks = {};

  function setupGuide() {
    goalEl = document.createElement('div');
    goalEl.id = 'goal';
    goalEl.style.cssText = [
      'position:fixed', 'left:50%', 'top:20px', 'transform:translateX(-50%)', 'z-index:7',
      'font:11px/1.5 ui-monospace,Consolas,monospace', 'letter-spacing:.18em', 'color:#a49d90',
      'background:rgba(10,10,11,.62)', 'border:1px solid rgba(244,241,234,.12)', 'border-radius:3px',
      'padding:6px 14px', 'opacity:0', 'transition:opacity .4s', 'pointer-events:none',
      'white-space:nowrap'
    ].join(';');
    document.body.appendChild(goalEl);

    GOAL_LIST.forEach(function (g) {
      const h = HOTS.find(function (x) { return x.id === g.id; });
      if (!h) return;
      const m = new T.Mesh(
        new T.OctahedronGeometry(0.08, 0),
        new T.MeshBasicMaterial({ color: 0xded3bb, transparent: true, opacity: 0.9, blending: T.AdditiveBlending, depthWrite: false })
      );
      m.position.copy(h.pos).add(new T.Vector3(0, 0.07, 0));
      m.userData.baseY = m.position.y;
      m.renderOrder = 6;
      m.visible = false;
      scene.add(m);
      goalMarks[g.id] = m;
    });
  }

  function goalDone(id) {
    if (id === 'lamp') return S.lampOn;
    if (id === 'painting') return S.clues.indexOf('painting') >= 0 || S.anomaly;
    if (id === 'burn') return !!S.burned;
    if (id === 'hair') return S.clues.indexOf('hair') >= 0;
    return S.clues.indexOf(id) >= 0;
  }

  function updateGuide() {
    if (!goalEl) return;
    if (S.phase !== 'play' || S.anomaly) {
      goalEl.style.opacity = '0';
      Object.keys(goalMarks).forEach(function (k) { goalMarks[k].visible = false; });
      return;
    }
    const curId = currentGoalId();
    const cur = curId ? GOAL_LIST.find(function (g) { return g.id === curId; }) : null;
    if (!cur) { goalEl.style.opacity = '0'; return; }
    const alias = { burn: 'basin' };
    const hid = alias[cur.id] || cur.id;
    const h = HOTS.find(function (x) { return x.id === hid; });
    if (!h) { goalEl.style.opacity = '0'; return; }
    const d = Math.hypot(h.pos.x - S.cam.x, h.pos.z - S.cam.z);
    goalEl.textContent = cur.text + '　·　' + d.toFixed(1) + ' m';
    goalEl.style.opacity = '1';
    Object.keys(goalMarks).forEach(function (k) { goalMarks[k].visible = (k === cur.id); });
  }

  /* ---------------------------------------------------------------- 状态 */
  const S = { stride: 0, bob: 0,
    phase: 'idle',          // idle | play | anomaly | end
    lampOn: false,
    clues: [],
    clueNeed: 4,
    anomaly: false,
    mirrorTouched: false,
    tapOn: false,
    hairGone: false,
    cam: { x: SPAWN.x, z: SPAWN.z, yaw: SPAWN.yaw, pitch: SPAWN.pitch },
    vel: { x: 0, z: 0 },
    keys: {},
    drag: null,
    hover: null,
    cine: null,
    t: 0
  };

  /* ---------------------------------------------------------------- UI */
  const $ = function (id) { return document.getElementById(id); };
  const hud = $('hud'), hint = $('hint'), toastEl = $('toast'), cross = $('cross');
  const introEl = $('intro'), endEl = $('end'), flashEl = $('flash');
  let toastTimer = 0;

  function toast(msg, ms) {
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('on'); }, ms || 5200);
  }
  // E 键标：把物体位置投影到屏幕，标在它正上方
  var ebEl = null, ebLbl = null, ebV = null;
  function eBadge(h, label) {
    if (!ebEl) { ebEl = $('ebadge'); ebLbl = $('ebLabel'); ebV = new T.Vector3(); }
    if (!ebEl) return;
    if (!h) { ebEl.classList.remove('on'); return; }
    ebV.copy(h.pos); ebV.y += 0.22;
    ebV.project(camera);
    if (ebV.z > 1) { ebEl.classList.remove('on'); return; }
    var W = window.innerWidth, H2 = window.innerHeight;
    ebEl.style.left = ((ebV.x * 0.5 + 0.5) * W).toFixed(1) + 'px';
    ebEl.style.top = ((-ebV.y * 0.5 + 0.5) * H2).toFixed(1) + 'px';
    if (ebLbl) ebLbl.textContent = label || '';
    ebEl.classList.add('on');
  }

  function setHint(text) {
    if (!text) { hint.classList.remove('on'); cross.classList.remove('hot'); return; }
    hint.innerHTML = '<b>E</b>　' + text;
    hint.classList.add('on');
    cross.classList.add('hot');
  }
  function paintClues() {
    for (let i = 1; i <= 3; i++) {
      const el = $('c' + i);
      if (el) el.classList.toggle('on', S.clues.length >= i);
    }
    const c = $('cCount');
    if (c) c.textContent = S.clues.length + ' / 4';
  }
  function addClue(id, line) {
    if (S.clues.indexOf(id) >= 0) return false;
    S.clues.push(id);
    paintClues();
    if (line) toast(line);
    return true;
  }

  /* ---------------------------------------------------------------- 灯 */
  function setLamp(on) {
    S.lampOn = on;
    lamp.intensity = on ? 5.4 : 0;
    lit.bodies.forEach(function (m) { m.opacity = on ? 0.34 : 0.18; });
    lit.lines.forEach(function (m) { m.opacity = (m === DIML) ? (on ? 0.2 : 0.12) : (on ? 0.56 : 0.32); });
  }

  /* ---------------------------------------------------------------- 移动 */
  function inRect(x, z, r, pad) {
    const p = pad || 0;
    return x > r.x0 + p && x < r.x1 - p && z > r.z0 + p && z < r.z1 - p;
  }
  function occBlocked(x, z) {
    if (inRect(x, z, BATH2, -0.02)) return false;
    for (let i = 0; i < DOORS.length; i++) {
      if (inRect(x, z, DOORS[i], 0.02)) return false;
    }
    const g = window.OCC;
    if (!g) return false;
    const i = Math.floor((x - g.x0) / g.step);
    const j = Math.floor((z - g.z0) / g.step);
    if (j < 0 || j >= g.rows.length) return true;
    const row = g.rows[j];
    if (i < 0 || i >= row.length) return true;
    return row.charAt(i) === '#';
  }

  function freeAt(x, z) {
    const rad = 0.24;
    let okRoom = inRect(x, z, ROOMS.kitchen, rad) || inRect(x, z, LIVING, rad) || inRect(x, z, BATH, rad) || inRect(x, z, BATH2, 0.14);
    if (!okRoom) {
      for (let i = 0; i < DOORS.length; i++) {
        if (inRect(x, z, DOORS[i], 0.02)) { okRoom = true; break; }
      }
    }
    if (!okRoom) return false;
    if (occBlocked(x, z)) return false;
    for (let i = 0; i < BLOCKERS.length; i++) {
      const b = BLOCKERS[i];
      if (x > b.x0 - rad && x < b.x1 + rad && z > b.z0 - rad && z < b.z1 + rad) return false;
    }
    return true;
  }

  function lookDir() {
    return { x: -Math.sin(S.cam.yaw), z: -Math.cos(S.cam.yaw) };
  }
  function applyCamera() {
    const moving = Math.hypot(S.vel.x, S.vel.z);
    const bob = moving > 0.6 ? Math.sin(S.bob) * 0.022 * Math.min(1, moving / 2.4) : 0;
    const eye = 1.62 + Math.sin(S.t * 1.6) * 0.006 + bob;
    camera.position.set(S.cam.x, eye, S.cam.z);
    camera.rotation.set(0, 0, 0, 'YXZ');
    camera.rotation.order = 'YXZ';
    camera.rotation.y = S.cam.yaw;
    camera.rotation.x = S.cam.pitch;
    // 投影判断要用最新的矩阵，否则准星判定会比画面慢一帧
    camera.updateMatrixWorld();
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
  }

  function updatePlayer(dt) {
    if (S.phase !== 'play') { applyCamera(); return; }
    if (S.cine) { updateCine(dt); return; }

    const k = S.keys;
    let mx = 0, mz = 0;
    if (k.KeyW) mz -= 1;
    if (k.KeyS) mz += 1;
    if (k.KeyA) mx -= 1;
    if (k.KeyD) mx += 1;
    const len = Math.hypot(mx, mz) || 1;
    mx /= len; mz /= len;

    const speed = 2.72;
    const sin = Math.sin(S.cam.yaw), cos = Math.cos(S.cam.yaw);
    const vx = (mx * cos + mz * sin) * speed;
    const vz = (-mx * sin + mz * cos) * speed;

    S.vel.x += (vx - S.vel.x) * Math.min(1, dt * 17);
    S.vel.z += (vz - S.vel.z) * Math.min(1, dt * 17);

    const nx = S.cam.x + S.vel.x * dt;
    const nz = S.cam.z + S.vel.z * dt;
    if (freeAt(nx, S.cam.z)) S.cam.x = nx; else S.vel.x = 0;
    if (freeAt(S.cam.x, nz)) S.cam.z = nz; else S.vel.z = 0;

    // 走路：步伐相位 + 落地脚步 + 轻微上下起伏
    const spd = Math.hypot(S.vel.x, S.vel.z);
    if (spd > 0.6) {
      S.stride += spd * dt;
      if (S.stride > 0.62) { S.stride -= 0.62; footstep(); }
    } else {
      S.stride = Math.min(S.stride, 0.3);
    }
    S.bob += dt * (4.2 + spd * 1.4);
    applyCamera();
    updateHover();
  }

  function updateCine(dt) {
    const c = S.cine;
    c.t += dt;
    const k = Math.min(1, c.t / c.dur);
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    S.cam.x = c.from.x + (c.to.x - c.from.x) * e;
    S.cam.z = c.from.z + (c.to.z - c.from.z) * e;
    let dy = c.to.yaw - c.from.yaw;
    while (dy > Math.PI) dy -= Math.PI * 2;
    while (dy < -Math.PI) dy += Math.PI * 2;
    S.cam.yaw = c.from.yaw + dy * e;
    S.cam.pitch = c.from.pitch + (c.to.pitch - c.from.pitch) * e;
    applyCamera();
    if (k >= 1) {
      S.cine = null;
      if (c.after) c.after();
    }
  }

  /* ---------------------------------------------------------------- 瞄准 */
  function updateHover() {
    if (S.phase !== 'play' || S.cine) return;
    const eye = new T.Vector3(S.cam.x, 1.5, S.cam.z);
    let best = null, bestScore = -1e9;
    const probe = new T.Vector3();

    for (let i = 0; i < HOTS.length; i++) {
      const h = HOTS[i];
      if (h.id === 'painting' && (S.carry || S.burned)) continue;
      const dist = h.pos.distanceTo(eye);
      if (dist > h.reach) continue;

      // 投影到屏幕：准星（屏幕中心）和目标的距离，才是"有没有瞄准"的真判据。
      // 之前用点乘，桌子上的灰和倒扣的杯子在水平方向几乎重合，永远分不开。
      probe.copy(h.pos).project(camera);
      if (probe.z > 1 || probe.z < -1) continue;

      const sx = Math.abs(probe.x), sy = Math.abs(probe.y);
      // 准星半径：桌面上的小物件要分得开，但墙上的东西（窗/柜/门）得放宽一点，不然总是瞄不上
      const R = Math.max(0.42, Math.min(0.62, 0.30 + dist * 0.10));
      if (sx > R || sy > R) continue;

      // 距离只做微调：桌面上的灰和倒扣的杯子几乎重叠，靠“瞄得准不准”来分
      const score = -(sx * sx + sy * sy) - dist * 0.08;
      if (score > bestScore) { bestScore = score; best = h; }
    }

    S.hover = best;
    let lbl = best ? best.label : '';
    if (best && best.id === 'painting') {
      if (S.clues.indexOf('painting') < 0) lbl = '翻开这幅画';
      else if (!S.carry && !S.burned) lbl = '拿起这幅画';
    }
    setHint('');
    eBadge(best, lbl);
    if (cross) cross.classList.toggle('lock', !!best);
  }

  function use(id) {
    const h = HOTS.find(function (x) { return x.id === id; });
    if (!h) return 'no-hotspot';
    h.action();
    return 'ok';
  }
  function useHover() {
    if (S.hover) { click(); use(S.hover.id); return; }
    nope();
    toast('这里没什么可碰的。', 2200);
  }

  /* ---------------------------------------------------------------- 异象 */
  function yawTo(x, z) {
    return Math.atan2(-(x - S.cam.x), -(z - S.cam.z));
  }

  function dimBodies(v) {
    lit.bodies.forEach(function (m) { m.opacity = v * 0.62; });
    propBodies.forEach(function (m) { m.opacity = v; });
  }

  function triggerAnomaly() {
    if (S.anomaly) return;
    S.anomaly = true;
    const at = function (ms, fn) { setTimeout(fn, ms); };

    at(0, function () {
      dimBodies(0.16);
      S.cine = {
        t: 0, dur: 1.9,
        from: { x: S.cam.x, z: S.cam.z, yaw: S.cam.yaw, pitch: S.cam.pitch },
        to: { x: S.cam.x, z: S.cam.z, yaw: yawTo(TABLE.x, TABLE.z), pitch: -0.12 }
      };
      setLamp(false);
      scene.fog.density = 0.16;
    });
    at(700, function () { if (flash) flash.intensity = 7; thunder(); });
    at(880, function () { if (flash) flash.intensity = 0; });
    at(1000, function () {
      // 画面上的水塔亮起来，画布烧掉
      if (painting) {
        const canvasMesh = painting.children[0];
        if (canvasMesh && canvasMesh.material) {
          canvasMesh.material.transparent = true;
          burn(canvasMesh.material, 2600);
        }
      }
      toast('画从一角开始烧。火苗是那种怪异而妖艳的颜色。');
      quote('我看着火焰吞没了它，画出它的水彩被烧焦了，火苗呈现一种怪异而妖艳的色彩。');
    });
    at(4200, function () {
      if (painting) painting.visible = false;
      if (hairSprite) {
        hairSprite.visible = true;
        hairSprite.traverse(function (o) { if (o.material) o.material.opacity = 0.9; });
      }
      toast('池沿上有一根头发。半黑，半白。');
    });
    at(8600, function () {
      setLamp(true);
      scene.fog.density = 0.10;
      quote('雨打在窗上，听上去像一个人或许多人的低语，仿佛在提醒我什么。听久了，我渐渐想像出了那低语的内容，它一遍遍地重复着：「那天有雷，那天有雷，那天有雷，那天有雷，那天有雷……」', 16000);
      whisper(6);
    });
    at(13200, function () {
      dimBodies(0.5);
      endChapter();
    });
  }

  function burn(mat, ms) {
    const t0 = performance.now();
    (function tick() {
      const k = Math.min(1, (performance.now() - t0) / ms);
      mat.opacity = 0.95 * (1 - k);
      mat.color.setRGB(1 - k * 0.6, 0.9 - k * 0.7, 0.8 - k * 0.7);
      if (k < 1) requestAnimationFrame(tick);
    })();
  }


  /* ---------------- 结尾：增殖 ---------------- */
  // 片尾配乐：直接用序章那首《生日快乐》的变形段（music.js / window.SLMusic）
  var BGM = (function () {
    var ctx = null, m = null, on = false, vol = .5;
    function ensure() {
      if (!window.SLMusic) return null;
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        try { ctx = new AC(); } catch (e) { return null; }
      }
      if (!m) { try { m = window.SLMusic.create(ctx); } catch (e) { return null; } }
      if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
      return m;
    }
    return {
      start: function () {
        var x = ensure(); if (!x) return false;
        try { x.start(); x.setVolume(vol); } catch (e) { return false; }
        on = true; return true;
      },
      warp: function (k, s) { if (on && m) { try { m.warp(k, s); } catch (e) {} } },
      cut: function () { if (on && m) { try { m.cut(); } catch (e) {} } },
      stop: function () { if (m) { try { m.stop(); } catch (e) {} } on = false; },
      setOn: function (v) { on = v; if (m) { try { m.setVolume(v ? vol : 0); } catch (e) {} } return on; },
      get on() { return on; }
    };
  })();

  var BGM_WARP1 = 0;
  var SFX = (function () {
    var ctx = null, master = null, tickBus = null, muted = false, noiseBuf = null;
    function mkNoise(sec) {
      var n = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      return b;
    }
    function init() {
      if (ctx) return ctx;
      var AC = window.AudioContext || window.webkitAudioContext;
      /* 音频保护 */
      if (!AC) return null;
      try { ctx = new AC(); } catch (e) { return null; }
      master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
      tickBus = ctx.createGain(); tickBus.gain.value = 1; tickBus.connect(master);
      noiseBuf = mkNoise(2.2);
      // 雨
      var rain = ctx.createBufferSource(); rain.buffer = noiseBuf; rain.loop = true;
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1150; lp.Q.value = .4;
      var rg = ctx.createGain(); rg.gain.value = .30;
      rain.connect(lp); lp.connect(rg); rg.connect(master); rain.start();
      // 低频底噪
      var dg = ctx.createGain(); dg.gain.value = .16;
      [55, 82.4].forEach(function (f, i) {
        var o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.detune.value = i ? 8 : -6;
        o.connect(dg); o.start();
      });
      dg.connect(master);
      return ctx;
    }
    function resume() { init(); if (ctx && ctx.state === 'suspended') ctx.resume(); }
    function level(v, t) {
      if (!master) return;
      var now = ctx.currentTime, g = master.gain;
      g.cancelScheduledValues(now);
      g.setValueAtTime(g.value, now);
      g.linearRampToValueAtTime(muted ? 0 : v, now + (t || .8));
    }
    function cut(t) {
      if (!master) return;
      var now = ctx.currentTime, g = master.gain;
      g.cancelScheduledValues(now);
      g.setValueAtTime(g.value, now);
      g.linearRampToValueAtTime(0.0001, now + (t || .14));
    }
    function tick(vol) {
      if (!ctx || muted || !noiseBuf) return;
      var s = ctx.createBufferSource(); s.buffer = noiseBuf;
      var f = ctx.createBiquadFilter(); f.type = 'bandpass';
      f.frequency.value = 1500 + Math.random() * 1400; f.Q.value = 1.2;
      var g = ctx.createGain(); g.gain.value = vol;
      s.connect(f); f.connect(g); g.connect(tickBus);
      s.start(); s.stop(ctx.currentTime + 0.05);
    }
    return {
      resume: resume,
      start: function () { level(.85, 1.6); },
      build: function (k) { level(.85 + .15 * k, .3); },
      silence: function () { cut(.12); },
      after: function () { level(.34, 2.4); },
      tick: tick,
      toggle: function () { muted = !muted; level(muted ? 0 : .85, .3); return muted; }
    };
  })();

  var END_FAST = [260, 228, 200, 175, 153, 134, 117, 102, 89, 77, 66, 56, 47, 39, 32, 26, 22, 19, 16, 14];
  var END_BOX_LINES = 22;
  var endEls = {}, endState = { phase: 0, count: 0, step: 0, timer: null, raf: null, loop: 0 };

  function endStop() {
    if (endState.timer) { clearTimeout(endState.timer); endState.timer = null; }
    if (endState.raf) { cancelAnimationFrame(endState.raf); endState.raf = null; }
  }

  function endReset() {
    endStop();
    var f = endEls.flow;
    if (!f) return;
    f.className = '';
    f.innerHTML = '';
    if (f && f.id === 'quote') {
      f.style.zIndex = ''; f.style.opacity = '0';
      f.style.width = ''; f.style.height = ''; f.style.left = ''; f.style.bottom = '';
      f.style.transform = ''; f.style.padding = ''; f.style.fontSize = ''; f.style.lineHeight = '';
      f.style.background = ''; f.style.borderLeft = '';
    }
    if (endEls.last) endEls.last.classList.remove('on');
    if (endEls.note) endEls.note.classList.remove('on');
    if (endEls.acts) endEls.acts.classList.remove('on');
    endState.phase = 0; endState.count = 0; endState.step = 0;
  }

  function endAppend() {
    var s = document.createElement('span');
    s.className = 'w';
    s.textContent = (endState.count + 1 === 62) ? '那天没有雷，' : '那天有雷，';
    endEls.flow.appendChild(s);
    endState.count++;
    if (f_isBoxed()) endEls.flow.scrollTop = endEls.flow.scrollHeight;
  }

  function f_isBoxed() {
    return endEls.flow && endEls.flow.className.indexOf('full') < 0;
  }

  function endGrow() {
    if (endState.phase !== 1) return;
    var g = END_FAST[Math.min(endState.step, END_FAST.length - 1)] * (endState.loop ? .55 : 1);
    endState.step++;
    endState.timer = setTimeout(function () {
      endAppend();
      if (endState.count >= END_BOX_LINES) { endBurst(); return; }
      endGrow();
    }, g);
  }

  // 撑破：框先微微鼓一下，边框与底色退掉，同一块字就地长满全屏
  function endBurst() {
    endState.phase = 2;
    var q = endEls.flow.querySelector('#endQuote');
    if (q) q.classList.add('gone');
    endEls.flow.scrollTop = 0;
    endEls.flow.classList.remove('endbox');
    endEls.flow.classList.add('endfull');
    // #quote 的宽高是创建时写死的内联样式，必须覆盖掉
    (function (st) {
      st.width = '100vw'; st.height = '100vh'; st.left = '0'; st.bottom = '0';
      st.transform = 'none'; st.padding = '0'; st.fontSize = '23px'; st.lineHeight = '1.55';
      st.background = 'transparent'; st.borderLeft = 'none';
    })(endEls.flow.style);
    BGM.warp(1, 3.0);
    (function step() {
      if (endState.phase !== 2) return;
      endAppend(); endAppend(); endAppend();
      if (endEls.flow.scrollHeight >= window.innerHeight * 1.25) { endCompress(); return; }
      endState.timer = setTimeout(step, endState.loop ? 16 : 20);
    })();
  }

  function endCompress() {
    endState.phase = 3;
    BGM.warp(1, 2.4);
    setTimeout(function () {
      endEls.flow.style.opacity = '.028';
      setTimeout(function () {
        BGM.cut();
        endEls.last.classList.add('on');
        setTimeout(function () {
          endEls.note.classList.add('on');
          endEls.acts.classList.add('on');
          endState.phase = 5;
        }, 3200);
      }, 900);
    }, 380);
  }

  function startEndSeq() {
    endEls.flow = quoteEl || $('endFlow');
    var _of = $('endFlow'); if (_of) _of.style.display = 'none';
    endEls.last = $('endLast');
    endEls.note = $('endNote');
    endEls.acts = $('endActs');
    if (!endEls.flow) return;
    clearTimeout(BGM_WARP1);
    endReset();
    var q = document.createElement('p');
    q.id = 'endQuote';
    q.innerHTML = '<em style="display:block;font-style:normal;font-family:ui-monospace,Consolas,monospace;font-size:11px;letter-spacing:.22em;color:#c98a3f;margin-bottom:5px">原 文 · 异象之一</em>' +
      '<span style="display:block">雨打在窗上，听上去像一个人或许多人的低语，仿佛在提醒我什么。听久了，我渐渐想像出了那低语的内容，它一遍遍地重复着：</span>';
    endEls.flow.appendChild(q);
    if (endEls.flow.id === 'quote') { endEls.flow.style.zIndex = '30'; endEls.flow.style.opacity = '1'; endEls.flow.classList.add('endbox'); }
    BGM.start();
    BGM_WARP1 = setTimeout(function () { BGM.warp(.42, 5.0); }, 2600);
    endState.phase = 1;
    // 第一遍让读者读完原文那句；第二遍直接开始长
    endState.timer = setTimeout(function () { if (endState.phase === 1) endGrow(); }, endState.loop ? 900 : 2600);
  }

  // 切走再回来：从头重放，保证不漏
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && endState.phase >= 1 && endState.phase < 4) startEndSeq();
  });

  // 把物体底部对齐到某个高度，避免悬空/陷进桌面
  function seatOn(obj, x, z, y, rot) {
    if (!obj) return null;
    if (rot) obj.rotation.set(rot[0], rot[1], rot[2]);
    obj.position.set(x, 0, z);
    obj.updateMatrixWorld(true);
    var b = new T.Box3().setFromObject(obj);
    obj.position.y += y - b.min.y;
    obj.updateMatrixWorld(true);
    return { y: +obj.position.y.toFixed(3), h: +(b.max.y - b.min.y).toFixed(3) };
  }

  function endChapter() {
    // 片尾必须在最上层：先硬关目视台，再放 #end
    if (exEl) { exEl.classList.remove('in'); exEl.classList.remove('on'); exEl.style.display = 'none'; }
    exOpen = false;
    var cmpBox = $('cmp'); if (cmpBox) cmpBox.classList.remove('on');
    S.phase = 'end';
    if (goalEl) goalEl.style.opacity = '0';
    if (quoteEl) quoteEl.style.opacity = '0';
    if (document.exitPointerLock) document.exitPointerLock();
    endEl.classList.add('on');
    hud.classList.remove('on');
    $('sndBtn').classList.add('on');
    setTimeout(startEndSeq, 1200);
  }

  /* ---------------------------------------------------------------- 交互表 */
  function buildHotspots() {
    // 灯：进门就是亮的（模型自带墙灯，没有开关可摸）
    // 桌上那只蛋糕：序章雷雨夜那只，现在还在
    hot('cake', '桌上的生日蛋糕', [TABLE.x - 0.34, TABLE.y + 0.13, TABLE.z - 0.28], 2.4, function () {
      toast('一只生日蛋糕。两年前那个雷雨夜，它就在这张桌上。');
    });

    // 三条线索仍按原文：桌面薄灰 → 倒扣的杯子 → 画里的水塔
    hot('dust', '桌面上的灰', [TABLE.x - 0.12, TABLE.y + 0.02, TABLE.z + 0.72], 2.8, function () {
      addClue('dust', '桌面上有一层薄薄的灰。可这屋子空了两年。');
      quote('我仔细看看桌面，上面有一层薄薄的灰尘，但相对于我离去的这两年时间，这灰尘确实太薄了些。');
      openExamine('dust');
    });

    hot('cup', '倒扣的杯子', [1.72, 0.52, -4.08], 2.6, function () {
      if (S.clues.indexOf('cup') >= 0) { toast('杯子是倒扣着的。我记得很清楚，我走时没有倒扣。'); return; }
      addClue('cup', '杯子倒扣着。我走的时候，它是正着的。');
      quote('但现在，桌上的那个杯子是倒扣着的！');
      openExamine('cup');
    });

    hot('painting', '地上的画', [0.58, 0.10, -5.50], 2.2, function () {
      if (S.clues.indexOf('painting') < 0) {
        paintingFlip = 0;
        toast('我把画面朝下的那幅画翻了过来。');
        addClue('painting', '画里有座水塔。可这座水塔，是我考上大学之后才建起来的。');
        openExamine('painting');
        quote('只是，这座水塔是在我考上大学之后才建成的，我两年前离开时，塔身只在脚手架中建了一半。');
      } else if (!S.carry && !S.burned) {
        S.carry = true;
        paintingFlip = -1;
        painting.visible = false;
        handChip(true);
        toast('我把画拿在手里，画面朝下。得去盥洗池那边，从一角点着。');
      } else if (S.carry && !S.burned) {
        toast('得把它拿到盥洗池那边，从一角点着。');
      } else {
        toast('画已经烧掉了。');
      }
    });
  }


  /* 南墙上门的那一段：把落在门框立方体里的线段删掉，做出一个真的门洞 */
  const DOOR_CUT = { x0: 4.66, x1: 5.48, y0: -0.05, y1: 2.06, z0: -0.62, z1: 0.26 };
  function cutDoorway(root) {
    let removed = 0;
    root.updateMatrixWorld(true);
    const v = new T.Vector3(), w = new T.Vector3();
    const inside = function (p) {
      return p.x > DOOR_CUT.x0 && p.x < DOOR_CUT.x1 &&
             p.y > DOOR_CUT.y0 && p.y < DOOR_CUT.y1 &&
             p.z > DOOR_CUT.z0 && p.z < DOOR_CUT.z1;
    };
    const targets = [];
    root.traverse(function (o) { if (o.isLineSegments && o.geometry && !o.userData.isRim) targets.push(o); });
    targets.forEach(function (o) {
      const pa = o.geometry.attributes.position;
      if (!pa) return;
      const keep = [];
      for (let i = 0; i < pa.count; i += 2) {
        v.fromBufferAttribute(pa, i).applyMatrix4(o.matrixWorld);
        w.fromBufferAttribute(pa, i + 1).applyMatrix4(o.matrixWorld);
        // 两端都在门洞里才删，避免把门框边线也削掉
        if (inside(v) && inside(w)) { removed++; continue; }
        keep.push(pa.getX(i), pa.getY(i), pa.getZ(i), pa.getX(i + 1), pa.getY(i + 1), pa.getZ(i + 1));
      }
      if (keep.length === pa.count * 3) return;
      if (keep.length < 6) { o.visible = false; return; }
      const g = new T.BufferGeometry();
      g.setAttribute('position', new T.Float32BufferAttribute(keep, 3));
      o.geometry = g;
    });
    window.__doorCut = removed;
    return removed;
  }

  /* ---------------------------------------------------------------- 真模型房子 */
  async function buildKitchen() {
    const s = sampleById('sample-room-su');
    if (!s || !Core) { buildKitchenFallback(); return; }
    try {
      const obj = await Core.parseModel(await Core.sampleBuf(s), 'room-su.glb');
      // 87 万面：先量一下描边要多久，卡住的话再降到 45°
      const t0 = performance.now();
      wireObject(obj, WALLB, LINE, 40);
      obj.position.set(0, 0, 0);
      scene.add(obj);
      // 门洞不切模型：那面墙上是窗格，切了会把窗切掉。改成在门前立一扇门板。
      window.__houseTris = 0;
      obj.traverse(function (o) { if (o.isMesh) window.__houseTris++; });
      window.__houseWireMs = Math.round(performance.now() - t0);
      return;
    } catch (e) {
      console.warn('[anomaly] 真房间没加载上，用方块代替', e);
      buildKitchenFallback();
    }
  }

  function buildKitchenFallback() {
    const r = ROOMS.kitchen;
    const w = r.x1 - r.x0, d = r.z1 - r.z0, H = 2.65;
    place(box(w, H, 0.08, WALLB), (r.x0 + r.x1) / 2, H / 2, r.z0);
    place(box(0.08, H, d, WALLB), r.x0, H / 2, (r.z0 + r.z1) / 2);
    place(box(0.08, H, d, WALLB), r.x1, H / 2, (r.z0 + r.z1) / 2);
    place(box(w, 0.06, d, WALLB, DIML), (r.x0 + r.x1) / 2, H, (r.z0 + r.z1) / 2);
  }


  /* ---------------------------------------------------------------- 小地图 */
  let mmapEl = null, mctx = null;
  const MAPBOX = { x0: 0.0, x1: 6.8, z0: -7.4, z1: 2.9 };

  /* 脚本在 <canvas id="mmap"> 之前执行，所以这里必须能"晚一点再试" */
  function setupMap() {
    if (mctx && handEl) return true;
    mmapEl = mmapEl || $('mmap');
    if (mmapEl && !mctx) mctx = mmapEl.getContext('2d');
    handEl = handEl || $('hand');
    return !!(mctx && handEl);
  }

  let handEl = null;
  function handChip(on, text) {
    if (!handEl) setupMap();
    if (!handEl) return;
    handEl.textContent = on ? ('手上：' + (text || '一幅画（画面朝下）')) : '';
    handEl.classList.toggle('on', !!on);
  }

  function mapPt(x, z, w, h) {
    return [8 + (x - MAPBOX.x0) / (MAPBOX.x1 - MAPBOX.x0) * (w - 16),
            8 + (z - MAPBOX.z0) / (MAPBOX.z1 - MAPBOX.z0) * (h - 16)];
  }
  function mapRect(r, w, h) {
    const a = mapPt(r.x0, r.z0, w, h), b = mapPt(r.x1, r.z1, w, h);
    return [a[0], a[1], b[0] - a[0], b[1] - a[1]];
  }

  function currentGoalId() {
    for (let i = 0; i < GOAL_LIST.length; i++) {
      if (!goalDone(GOAL_LIST[i].id)) return GOAL_LIST[i].id;
    }
    return null;
  }

  const _tagV = new T.Vector3();
  let doorTagEl = null;
  let lookMode = 'real';   /* 默认正常建模：游客不手动切也能看到实体与坍缩效果 */
  let realLight = null, realAmb = null, realBulb = null;
  function setLook(mode) {
    lookMode = mode === 'real' ? 'real' : 'wire';
    const real = lookMode === 'real';
    scene.traverse(function (o) {
      if (o.isMesh && o.userData.origMat) {
        const m = o.userData.origMat;
        if (real && m) {
          if (m.side !== undefined) m.side = T.FrontSide;
          if (m.metalness !== undefined) { m.metalness = 0; m.roughness = 0.82; }
          o.material = m;
        } else if (o.userData.wireMat) {
          o.material = o.userData.wireMat;
        }
      }
      if (o.userData && o.userData.isEdge) o.visible = !real;
      if (o.userData && o.userData.isRim) o.visible = !real;
    });
    if (!realAmb) { realAmb = new T.AmbientLight(0xffe8c8, 0); scene.add(realAmb); }
    if (!realLight) {
      realLight = new T.DirectionalLight(0xfff0d0, 0);
      realLight.position.set(4.2, 6.0, -2.0);
      scene.add(realLight);
    }
    if (!realBulb) {
      realBulb = new T.PointLight(0xffd9a0, 0, 9, 2);
      realBulb.position.set(4.9, 2.55, -4.6);
      scene.add(realBulb);
    }
    if (amb) amb.intensity = real ? 0.16 : 1.75;
    if (lamp) lamp.intensity = real ? 1.2 : 3.0;
    realAmb.intensity = real ? 0.26 : 0;
    realLight.intensity = real ? 0.22 : 0;
    realBulb.intensity = real ? 3.4 : 0;
    if (renderer) renderer.toneMappingExposure = real ? 0.92 : 1.0;
    scene.fog.density = real ? 0.045 : 0.16;
    document.body.classList.toggle('look-real', real);
    const b = document.getElementById('lookBtn');
    if (b) b.textContent = real ? '画风：真实贴图' : '画风：全息线框';
    return lookMode;
  }

  function updateDoorTag() {
    if (!doorTagEl) doorTagEl = document.getElementById('doorTag');
    if (!doorTagEl) return;
    const h = HOTS.find(function (x) { return x.id === 'bathdoor'; });
    if (!h || S.phase !== 'play') { doorTagEl.classList.remove('on'); return; }
    _tagV.copy(h.pos).setY(2.15);
    const view = _tagV.clone().applyMatrix4(camera.matrixWorldInverse);
    const dist = h.pos.distanceTo(camera.position);
    if (view.z > -0.3 || dist > 7.5) { doorTagEl.classList.remove('on'); return; }
    _tagV.project(camera);
    doorTagEl.classList.add('on');
    doorTagEl.style.left = ((_tagV.x * 0.5 + 0.5) * window.innerWidth) + 'px';
    doorTagEl.style.top = ((-_tagV.y * 0.5 + 0.5) * window.innerHeight) + 'px';
  }


  /* 悬停高亮：瞄到的东西套一个会呼吸的琥珀环，比之前的菱形清楚得多 */
  const hoverRing = new T.Mesh(
    new T.RingGeometry(0.115, 0.155, 28),
    new T.MeshBasicMaterial({ color: 0xffd479, transparent: true, opacity: 0, side: T.DoubleSide, depthWrite: false, blending: T.AdditiveBlending })
  );
  hoverRing.visible = false;
  hoverRing.renderOrder = 7;
  scene.add(hoverRing);

  function updateHoverRing() {
    const h = S.hover;
    if (!h) { hoverRing.visible = false; return; }
    hoverRing.visible = true;
    hoverRing.position.copy(h.pos);
    hoverRing.quaternion.copy(camera.quaternion);
    const ph = 0.5 + 0.5 * Math.sin(S.t * 4.2);
    // 光圈大小跟着距离走，在屏幕上看起来大致一样大（贴太近不会糊满一屏）
    const d = h.pos.distanceTo(camera.position);
    const k = Math.max(0.35, Math.min(1.8, d * 0.16));
    hoverRing.scale.setScalar(k * (1 + ph * 0.18));
    hoverRing.material.opacity = 0.55 + ph * 0.30;
  }

  /* 引路：半空中一串低透明度的发光粒子，缓缓朝目标方向流动 */
  function makeDotTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0.0, 'rgba(255,255,255,1)');
    rg.addColorStop(0.28, 'rgba(214,232,255,0.85)');
    rg.addColorStop(0.62, 'rgba(140,180,255,0.28)');
    rg.addColorStop(1.0, 'rgba(90,130,220,0)');
    g.fillStyle = rg;
    g.fillRect(0, 0, 64, 64);
    const tex = new T.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
  }

  const TRAIL_N = 18;
  const trailGeo = new T.BufferGeometry();
  const trailPos = new Float32Array(TRAIL_N * 3);
  const trailCol = new Float32Array(TRAIL_N * 3);
  trailGeo.setAttribute('position', new T.BufferAttribute(trailPos, 3));
  trailGeo.setAttribute('color', new T.BufferAttribute(trailCol, 3));
  const trailPts = new T.Points(trailGeo, new T.PointsMaterial({
    size: 0.105, map: makeDotTexture(), transparent: true, opacity: 0.62,
    depthWrite: false, sizeAttenuation: true, blending: T.AdditiveBlending,
    vertexColors: true, alphaTest: 0.01
  }));
  trailPts.renderOrder = 6;
  trailPts.frustumCulled = false;
  trailPts.visible = false;
  scene.add(trailPts);

  let trailTick = 0;

  /* 走过的路径：每 0.3 m 记一个点，画在小地图上 */
  const walkTrail = [];
  let lastTrailX = null, lastTrailZ = null, trailMarkTick = 0;
  function recordWalk() {
    if (S.phase !== 'play') return;
    if ((trailMarkTick++ % 10) !== 0) return;
    const x = S.cam.x, z = S.cam.z;
    if (lastTrailX === null || Math.hypot(x - lastTrailX, z - lastTrailZ) > 0.30) {
      walkTrail.push([x, z]);
      if (walkTrail.length > 600) walkTrail.shift();
      lastTrailX = x; lastTrailZ = z;
    }
  }
  function updateTrail() {
    const gid = (typeof currentGoalId === 'function' && S.phase === 'play') ? currentGoalId() : null;
    const alias = { burn: 'basin' };
    const hid = gid ? (alias[gid] || gid) : null;
    const h = hid ? HOTS.find(function (x) { return x.id === hid; }) : null;
    const show = !!(h && !S.anomaly);
    const dx = h ? h.pos.x - S.cam.x : 0;
    const dz = h ? h.pos.z - S.cam.z : 0;
    const dist = Math.hypot(dx, dz);
    if (!show || dist < 0.9) { trailPts.visible = false; return; }
    trailPts.visible = true;

    const ux = dx / dist, uz = dz / dist;
    const span = Math.min(dist - 0.55, 2.6);     // 只铺到目标前一点，别糊到对象脸上
    for (let i = 0; i < TRAIL_N; i++) {
      const t = (i + 1) / (TRAIL_N + 1);
      const flow = (S.t * 0.16) % 1;             // 让粒子慢慢往前流
      const tt = (t + flow * 0.18) % 1;
      const r = 0.55 + span * tt;
      const wobble = Math.sin(S.t * 1.4 + i * 1.7) * 0.10;
      const px = S.cam.x + ux * r + uz * wobble;
      const pz = S.cam.z + uz * r - ux * wobble;
      const py = 1.06 + Math.sin(S.t * 1.9 + i * 1.1) * 0.08 - tt * 0.10;
      trailPos[i * 3] = px;
      trailPos[i * 3 + 1] = py;
      trailPos[i * 3 + 2] = pz;
      const fadeIn = Math.min(1, tt * 6);
      const fadeOut = 1 - Math.max(0, (tt - 0.55) / 0.45);
      const a = 0.95 * fadeIn * fadeOut * (0.55 + 0.45 * Math.sin(S.t * 3 - i * 0.8));
      trailCol[i * 3] = a * 0.80;
      trailCol[i * 3 + 1] = a * 0.90;
      trailCol[i * 3 + 2] = a * 1.0;
    }
    trailGeo.attributes.position.needsUpdate = true;
    trailGeo.attributes.color.needsUpdate = true;
  }


  /* ------------------------------------------------ 手里的画（画面朝下） */
  const handPainting = new T.Group();
  {
    const boardMat = new T.MeshBasicMaterial({ color: 0x33302b, side: T.DoubleSide, fog: false, depthTest: false });
    const board = new T.Mesh(new T.PlaneGeometry(0.34, 0.25), boardMat);
    handPainting.add(board);
    const fm = new T.MeshBasicMaterial({ color: 0x252220, fog: false, depthTest: false });
    const t1 = new T.Mesh(new T.BoxGeometry(0.37, 0.022, 0.02), fm); t1.position.y = 0.13;
    const t2 = t1.clone(); t2.position.y = -0.13;
    const l1 = new T.Mesh(new T.BoxGeometry(0.022, 0.25, 0.02), fm); l1.position.x = -0.18;
    const l2 = l1.clone(); l2.position.x = 0.18;
    handPainting.add(t1, t2, l1, l2);
    const edge = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(0.37, 0.27, 0.02)), lineMat(0xd8cdb4, 0.5));
    handPainting.add(edge);
    handPainting.traverse(function (o) { o.renderOrder = 9; o.frustumCulled = false; });
    handPainting.visible = false;
    scene.add(handPainting);
  }

  const _handOff = new T.Vector3();
  function updateHandPainting() {
    const show = !!(S.carry && !S.burned);
    handPainting.visible = show;
    if (!show) return;
    // 平时只露一角；低头看的时候，让它往上抬、露出全貌
    const look = Math.max(0, Math.min(1, (-S.cam.pitch) / 1.05));
    _handOff.set(0.305 - look * 0.03, -0.42 + look * 0.30, -0.74 + look * 0.14).applyQuaternion(camera.quaternion);
    handPainting.position.copy(camera.position).add(_handOff);
    handPainting.quaternion.copy(camera.quaternion);
    handPainting.rotateX(-0.30 + look * 0.16);
    handPainting.rotateZ(0.50 - look * 0.14 + Math.sin(S.t * 1.7) * 0.018 + Math.sin(S.t * 0.7) * 0.010);
  }


  /* ------------------------------------------------ 目视台（大尺寸物证面板） */
  const EX_DATA = {
    cup: {
      no: 'EVIDENCE 01', h: '倒扣的杯子', o: 0.06,
      t: '但现在，桌上的那个杯子是倒扣着的！',
      mode: 'compare',
      a: 'samples/examine/cup-before.png', b: 'samples/examine/cup-after.png',
      ta: '我走时 · 正着', tb: '现在 · 倒扣',
      hint: '拖动中间的竖线，对比同一只杯子的两种状态。'
    },
    painting: {
      no: 'EVIDENCE 03', h: '那幅画', o: 0.10,
      t: '只是，这座水塔是在我考上大学之后才建成的。',
      mode: 'compare',
      a: 'samples/examine/painting-before.png', b: 'samples/examine/painting-after.png',
      ta: '两年前 · 脚手架', tb: '现在 · 已建成',
      note: '关掉这一页之后，再按一次 E 可以把画拿走。',
      hint: '拖动竖线，看画里那座水塔的两个时期。'
    },
    hair: {
      no: 'EVIDENCE 04', h: '池沿上的头发', o: 0.14,
      t: '池沿上留着一根半白的头发。',
      mode: 'compare',
      a: 'samples/examine/hair-before.png', b: 'samples/examine/hair-after.png',
      ta: '两年前 · 干净', tb: '现在 · 一根半白',
      hint: '拖动竖线：发根还是黑的，发梢已经白了。'
    },
    dust: {
      no: 'EVIDENCE 02', h: '桌面上的灰', o: 0.18,
      t: '桌上有一层薄薄的灰。可这屋子空了两年。',
      mode: 'erase',
      a: 'samples/examine/dust-clean.png', b: 'samples/examine/dust-made.png',
      ta: '擦开的桌面', tb: '',
      hint: '按住鼠标划过桌面，把灰擦开——看看下面是什么。',
      note: '这层灰，太薄了。'
    }
  };

  let exEl = null, exOpen = false, exWasLocked = false, exCur = '', exBurned = {}, exMode = 'compare', exX = 0.5, exDragging = false, exOpenFrame = 0, exCloseTimer = 0;
  let exDust = { cv: null, ctx: null, w: 0, h: 0, ratio: 0, samples: 0, erased: 0 };

  function exInit() {
    if (exEl) return;
    exEl = document.getElementById('examine');
    if (!exEl) return;
    document.getElementById('exClose').addEventListener('click', exClose);
    exEl.addEventListener('click', function (e) { if (e.target === exEl) exClose(); });

    const stage = document.getElementById('exStage');
    stage.addEventListener('pointerdown', function (e) {
      if (exMode === 'compare') { exDragging = true; exSetX(e); stage.setPointerCapture(e.pointerId); }
      else exErase(e);
    });
    stage.addEventListener('pointermove', function (e) {
      if (exMode === 'compare' && exDragging) exSetX(e);
      else if (exMode === 'erase' && (e.buttons & 1)) exErase(e);
    });
    stage.addEventListener('pointerup', function () { exDragging = false; });
    stage.addEventListener('pointercancel', function () { exDragging = false; });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape' && exOpen) exClose(); });
  }

  function exSetX(e) {
    const r = document.getElementById('exStage').getBoundingClientRect();
    exX = Math.min(0.985, Math.max(0.015, (e.clientX - r.left) / r.width));
    const pct = (exX * 100).toFixed(2) + '%';
    document.getElementById('exB').style.clipPath = 'inset(0 0 0 ' + pct + ')';
    document.getElementById('exLine').style.left = pct;
    document.getElementById('exKnob').style.left = pct;
  }

  function exErase(e) {
    if (!exDust.ctx) return;
    const st = document.getElementById('exStage');
    const r = st.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width * exDust.w;
    const y = (e.clientY - r.top) / r.height * exDust.h;
    const c = exDust.ctx;
    c.globalCompositeOperation = 'destination-out';
    const rad = exDust.w * 0.055;
    const g = c.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(0.65, 'rgba(0,0,0,.85)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g;
    c.beginPath(); c.arc(x, y, rad, 0, 6.2832); c.fill();
    c.globalCompositeOperation = 'source-over';

    exDust.erased += Math.PI * rad * rad * 0.62;
    if (++exDust.samples % 6 === 0) exDustRatio();
  }

  function exDustRatio() {
    // file:// 下 canvas 会被标记为 tainted，getImageData 不可用——改为按面积估算
    const area = exDust.w * exDust.h;
    exDust.ratio = Math.min(1, exDust.erased / area);
    if (exDust.ratio > 0.30) {
      const n = document.getElementById('exNote');
      n.textContent = EX_DATA.dust.note; n.classList.add('on');
    }
  }

  function exLoadImg(el, src) {
    return new Promise(function (res) {
      el.onload = function () { res(true); };
      el.onerror = function () { res(false); };
      el.src = src;
    });
  }

  /* 把热点坐标投影到屏幕像素，用作圆形展开的原点 */
  function hotScreen(id, dy) {
    try {
      let h = null;
      for (let i = 0; i < HOTS.length; i++) { if (HOTS[i].id === id) { h = HOTS[i]; break; } }
      if (!h || !h.pos || !camera) return null;
      const v = new T.Vector3().copy(h.pos);
      if (dy) v.y += dy;
      v.project(camera);
      if (v.z > 1 || v.z < -1) return null;
      const W = window.innerWidth, H = window.innerHeight, M = 90;
      let x = (v.x * 0.5 + 0.5) * W;
      let y = (-v.y * 0.5 + 0.5) * H;
      // 夹到视口内，避免圆从屏幕外开始扩张
      x = Math.min(W - M, Math.max(M, x));
      y = Math.min(H - M, Math.max(M, y));
      return { x: x, y: y };
    } catch (e) { return null; }
  }

  /* 调试：把热点搬到镜头前，便于验证圆形展开的原点 */
  window.__st = function () { return state(); };
  window.__dump = function () {
    function bb(o) {
      if (!o) return null;
      var b = new T.Box3().setFromObject(o);
      return { min: b.min.toArray().map(function (v) { return +v.toFixed(2); }),
               max: b.max.toArray().map(function (v) { return +v.toFixed(2); }) };
    }
    var cakeObj = null;
    if (scene) scene.traverse(function (o) { if (!cakeObj && o.name && /cake/i.test(o.name)) cakeObj = o; });
    return { table: TABLE, cake: bb(cakeObj), cup: bb(cupObj), painting: bb(painting) };
  };

  window.__hot = {
    list: function () { return HOTS.map(function (h) { return { id: h.id, x: h.pos.x, y: h.pos.y, z: h.pos.z }; }); },
    screenOf: function (id, dy) { return hotScreen(id, dy); },
    stand: function (id, back) {
      let t = null;
      for (let i = 0; i < HOTS.length; i++) { if (HOTS[i].id === id) { t = HOTS[i]; break; } }
      if (!t) return null;
      const p = t.pos;
      const d = back || 1.1;
      const cx = p.x + d * 0.7, cz = p.z + d * 0.7;
      S.cam.x = cx; S.cam.z = cz;
      S.cam.yaw = Math.atan2(-(p.x - cx), -(p.z - cz));
      S.cam.pitch = Math.atan2(p.y - 1.5, Math.max(0.45, Math.hypot(p.x - cx, p.z - cz)));
      S.cine = null;
      applyCamera();
      return { cam: [cx, cz], yaw: S.cam.yaw, pitch: S.cam.pitch };
    },
    face: function (id) {
      let t = null;
      for (let i = 0; i < HOTS.length; i++) { if (HOTS[i].id === id) { t = HOTS[i]; break; } }
      if (!t || !camera) return null;
      const p = t.pos;
      const d = 1.5;
      const cx = p.x + d * 0.72, cz = p.z + d * 0.72;
      camera.position.set(cx, Math.max(1.15, p.y + 0.55), cz);
      camera.lookAt(p.x, p.y, p.z);
      return { cam: [cx, camera.position.y, cz], target: [p.x, p.y, p.z] };
    }
  };

  async function openExamine(id) {
    const d = EX_DATA[id]; if (!d) return;
    exInit(); if (!exEl) return;
    exMode = d.mode;
    exCur = id;
    document.getElementById('exNo').textContent = d.no;
    document.getElementById('exH').textContent = d.h;
    document.getElementById('exT').textContent = d.t;
    document.getElementById('exHint').textContent = d.hint || '';
    document.getElementById('exTagL').textContent = d.ta || '';
    document.getElementById('exTagR').textContent = d.tb || '';
    document.getElementById('exTagR').style.display = d.tb ? '' : 'none';
    var noteEl = document.getElementById('exNote');
    noteEl.classList.remove('on');
    if (d.note) { noteEl.textContent = d.note; noteEl.classList.add('on'); }

    const o = hotScreen(id, d.o || 0) || { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    exEl.style.setProperty('--ox', o.x.toFixed(0) + 'px');
    exEl.style.setProperty('--oy', o.y.toFixed(0) + 'px');

    const A = document.getElementById('exA'), B = document.getElementById('exB');
    const cv = document.getElementById('exCv'), ph = document.getElementById('exPh');
    const line = document.getElementById('exLine'), knob = document.getElementById('exKnob');
    clearTimeout(exOpenFrame);
    exEl.classList.add('on'); exOpen = true;
    // 目视台要用鼠标：进来就先放开指针锁，别逼玩家再按一次 Esc
    exWasLocked = (document.pointerLockElement === canvas);
    if (exWasLocked && document.exitPointerLock) document.exitPointerLock();
    document.body.classList.add('ex-open');
    void exEl.offsetWidth;
    exOpenFrame = requestAnimationFrame(function () { requestAnimationFrame(function () { exEl.classList.add('in'); }); });

    const okA = await exLoadImg(A, d.a);
    const okB = await exLoadImg(B, d.b);
    ph.style.display = (okA || okB) ? 'none' : 'flex';

    if (exMode === 'compare') {
      cv.style.display = 'none'; A.style.display = ''; B.style.display = '';
      line.style.display = ''; knob.style.display = '';
      exSetX({ clientX: document.getElementById('exStage').getBoundingClientRect().left + document.getElementById('exStage').getBoundingClientRect().width * exX });
      if (!okB) { B.style.display = 'none'; }
    } else {
      line.style.display = 'none'; knob.style.display = 'none';
      B.style.display = 'none';
      A.style.display = okA ? '' : 'none';
      cv.style.display = okB ? '' : 'none';
      if (okB) {
        const r = document.getElementById('exStage').getBoundingClientRect();
        const w = Math.max(600, Math.round(r.width)), hh = Math.max(380, Math.round(r.height));
        cv.width = w; cv.height = hh;
        exDust.cv = cv; exDust.ctx = cv.getContext('2d');
        exDust.w = w; exDust.h = hh; exDust.ratio = 0; exDust.samples = 0; exDust.erased = 0;
        const img = new Image();
        img.onload = function () {
          const ctx = cv.getContext('2d');
          ctx.clearRect(0, 0, w, hh);
          ctx.drawImage(img, 0, 0, w, hh);
        };
        img.src = d.b;
      }
    }
  }

  /* 判断句：看完物证后居中放大显示，替代原来藏在面板里的小字 */
  let verdictEl = null, verdictTimer = 0;
  function showVerdict(text) {
    if (!text) return;
    if (!verdictEl) {
      verdictEl = document.createElement('div');
      verdictEl.id = 'verdict';
      verdictEl.style.cssText = [
        'position:fixed', 'left:50%', 'top:34%', 'transform:translate(-50%,-50%)',
        'z-index:9', 'pointer-events:none', 'text-align:center', 'white-space:nowrap',
        'font-family:"Noto Serif SC","Source Han Serif SC","Songti SC",serif',
        'font-size:clamp(22px,2.4vw,30px)', 'letter-spacing:.04em', 'line-height:1.5',
        'color:#f4f1ea', 'text-shadow:0 4px 26px rgba(0,0,0,.95)',
        'opacity:0', 'transition:opacity .55s ease, letter-spacing .55s ease'
      ].join(';');
      document.body.appendChild(verdictEl);
    }
    verdictEl.textContent = text;
    verdictEl.style.opacity = '0';
    verdictEl.style.letterSpacing = '.16em';
    clearTimeout(verdictTimer);
    requestAnimationFrame(function () {
      verdictEl.style.opacity = '1';
      verdictEl.style.letterSpacing = '.04em';
    });
    verdictTimer = setTimeout(function () { verdictEl.style.opacity = '0'; }, 3800);
  }

  function exClose() {
    if (!exEl || !exOpen) return;
    exOpen = false;
    if (exWasLocked && S.phase === 'play' && canvas.requestPointerLock) {
      try { canvas.requestPointerLock(); } catch (e) {}
    }
    exWasLocked = false;
    exEl.classList.remove('in');
    document.body.classList.remove('ex-open');
    var VERDICT = {
      dust: '这层灰，太薄了。',
      cup: '杯子是倒扣着的。',
      painting: '这座水塔，是这两年才建起来的。',
      hair: '一根半白的头发。'
    };
    showVerdict(VERDICT[exCur]);
    // 看完物证 → 那块区域烧成线稿（面板淡出后再开始，玩家看得见）
    const COL_REGION = { cup: [5.58, -5.04, 2.0], dust: [5.80, -4.62, 2.0], painting: [4.30, -6.86, 1.7], hair: [3.55, 2.04, 1.7] };
    const cr = COL_REGION[exCur];
    if (cr && !exBurned[exCur]) {
      exBurned[exCur] = true;
      setTimeout(function () { COLLAPSE.region(cr[0], cr[1], cr[2], 0.9); }, 300);
      if (Object.keys(exBurned).length >= 4) {
        // 四处都看过了 → 整屋分三波烧掉，从桌子向外扩
        setTimeout(function () { COLLAPSE.region(TABLE.x, TABLE.z, 3.6); }, 1500);
        setTimeout(function () { COLLAPSE.region(TABLE.x, TABLE.z, 7.0); }, 2050);
        setTimeout(function () { COLLAPSE.region(TABLE.x, TABLE.z, 60, 0, 1); }, 2600);
        setTimeout(function () { toast('屋子只剩下线条。'); }, 3400);
      }
    }
    clearTimeout(exCloseTimer);
    exCloseTimer = setTimeout(function () {
      exEl.classList.remove('on');
      exDust.ctx = null; exDust.cv = null;
    }, 520);
  }

  /* ------------------------------------------------ 原文 ↔ 现场 对照卡 */
  const CMP_DATA = {
    cup: {
      h: '物证 · 倒扣的杯子',
      t: '但现在，桌上的那个杯子是倒扣着的！',
      fig: '<figure><svg width="54" height="62" viewBox="0 0 54 62" fill="none" stroke="#a8c6ff" stroke-width="1.3">' +
           '<path d="M14 12 L14 40 Q14 47 27 47 Q40 47 40 40 L40 12"/><ellipse cx="27" cy="12" rx="13" ry="3.4"/></svg>' +
           '<figcaption>我走时 · 正着</figcaption></figure>' +
           '<figure><svg width="54" height="62" viewBox="0 0 54 62" fill="none" stroke="#c98a3f" stroke-width="1.3">' +
           '<path d="M14 50 L14 22 Q14 15 27 15 Q40 15 40 22 L40 50"/><ellipse cx="27" cy="50" rx="13" ry="3.4"/></svg>' +
           '<figcaption>现在 · 倒扣</figcaption></figure>'
    },
    painting: {
      h: '物证 · 那幅画',
      t: '只是，这座水塔是在我考上大学之后才建成的，我两年前离开时，塔身只在脚手架中建了一半。',
      fig: '<figure><svg width="96" height="62" viewBox="0 0 96 62" fill="none" stroke="#a8c6ff" stroke-width="1.2">' +
           '<path d="M26 56 L26 30 L38 30 L38 56"/><path d="M58 56 L58 30 L70 30 L70 56"/>' +
           '<path d="M20 30 L48 12 L76 30"/><path d="M20 30 L20 22 L76 22 L76 30"/>' +
           '<path d="M20 22 L20 14 M76 22 L76 14 M26 14 L26 8 M32 14 L32 9 M38 14 L38 10 M44 14 L44 8"/>' +
           '<path d="M48 30 L48 56"/></svg><figcaption>塔身 · 建了一半</figcaption></figure>' +
           '<figure><svg width="52" height="62" viewBox="0 0 52 62" fill="none" stroke="#c98a3f" stroke-width="1.2">' +
           '<path d="M16 56 L16 14 M36 56 L36 14 M12 14 L40 14 M12 24 L40 24 M12 34 L40 34 M12 44 L40 44"/>' +
           '<path d="M16 14 L36 56 M36 14 L16 56"/></svg><figcaption>脚手架 · 没拆</figcaption></figure>'
    },
    hair: {
      h: '物证 · 池沿上的头发',
      t: '那是几根头发，有的全白，与池面几乎融为一体；有的则白了一半，正是那些黑的部分使我看到了它们。这不可能是我两年前留下的，我从来没有过这么长的头发，更没有白发。',
      fig: '<figure><svg width="150" height="58" viewBox="0 0 150 58" fill="none" stroke-width="1.2">' +
           '<path d="M6 44 Q34 6 64 40" stroke="#f4f1ea"/><path d="M64 40 Q42 10 14 34" stroke="#9aa6bb"/>' +
           '<path d="M40 48 Q78 8 116 44" stroke="#f4f1ea"/><path d="M116 44 Q86 14 52 30" stroke="#9aa6bb"/>' +
           '<path d="M96 50 Q120 22 144 46" stroke="#f4f1ea"/>' +
           '</svg><figcaption>半黑 · 半白</figcaption></figure>'
    }
  };

  let cmpEl = null, cmpTimer = 0;
  function showCompare(id) {
    const d = CMP_DATA[id];
    if (!d) return;
    if (!cmpEl) {
      cmpEl = document.getElementById('cmp');
      if (cmpEl) {
        cmpEl.addEventListener('click', function () {
          clearTimeout(cmpTimer);
          cmpEl.classList.add('pinned');
          cmpEl.classList.add('on');
        });
      }
    }
    if (!cmpEl) return;
    cmpEl.classList.remove('pinned');
    cmpEl.innerHTML =
      '<div class="cmp-h">' + d.h + '</div>' +
      '<div class="cmp-t">' + d.t + '</div>' +
      '<div class="cmp-fig">' + d.fig + '</div>' +
      '<div class="cmp-pin">点一下钉住</div>';
    cmpEl.classList.add('on');
    clearTimeout(cmpTimer);
    cmpTimer = setTimeout(function () {
      if (!cmpEl.classList.contains('pinned')) cmpEl.classList.remove('on');
    }, 5200);
  }

  /* 顶视图底图：把模型里所有网格的顶点按 y∈[0.15,1.85] 投影到俯视平面，
     烘成一张小图，当作小地图的"平面图"（不是两个方块） */
  let planCanvas = null, planTried = false, planScheduled = false;
  function bakePlan() {
    if (planTried) return planCanvas;
    planTried = true;
    const N = 480, PAD = 8;
    const cv = document.createElement('canvas');
    cv.width = cv.height = N;
    const c2 = cv.getContext('2d');
    const bx = MAPBOX;
    const sx = (N - PAD * 2) / (bx.x1 - bx.x0);
    const sz = (N - PAD * 2) / (bx.z1 - bx.z0);
    const v = new T.Vector3();
    const px = function (x) { return PAD + (x - bx.x0) * sx; };
    const pz = function (z) { return PAD + (z - bx.z0) * sz; };
    let drew = 0;

    // 只画"结构边"：wireObject 已经给每个网格抽好的线，投到俯视图上就是一张平面图
    scene.traverse(function (o) {
      if (!o.isLineSegments || !o.geometry) return;
      const pos = o.geometry.attributes && o.geometry.attributes.position;
      if (!pos) return;
      o.updateWorldMatrix(true, false);
      const pairs = Math.floor(pos.count / 2);
      const stride = Math.max(1, Math.floor(pairs / 900));
      c2.beginPath();
      let any = false;
      for (let i = 0; i < pairs; i += stride) {
        const a = i * 2, b = a + 1;
        v.fromBufferAttribute(pos, a).applyMatrix4(o.matrixWorld);
        if (v.y < 0.03 || v.y > 2.35) continue;
        const ax = px(v.x), az = pz(v.z);
        if (ax < PAD || az < PAD || ax > N - PAD || az > N - PAD) continue;
        v.fromBufferAttribute(pos, b).applyMatrix4(o.matrixWorld);
        const bx2 = px(v.x), bz2 = pz(v.z);
        if (bx2 < PAD || bz2 < PAD || bx2 > N - PAD || bz2 > N - PAD) continue;
        c2.moveTo(ax, az);
        c2.lineTo(bx2, bz2);
        any = true;
        drew++;
      }
      if (any) {
        c2.strokeStyle = 'rgba(170,206,255,0.34)';
        c2.lineWidth = 0.9;
        c2.stroke();
      }
    });

    planCanvas = drew > 200 ? cv : null;
    window.__plan = planCanvas;
    return planCanvas;
  }

  function drawMap() {
    if (!mctx && !setupMap()) return;
    const w = mmapEl.width, h = mmapEl.height;
    mctx.clearRect(0, 0, w, h);
    mctx.fillStyle = 'rgba(6,10,16,.96)';
    mctx.fillRect(0, 0, w, h);

    // 真·顶视图底图（模型投影）
    if (!planCanvas && !planScheduled) {
      planScheduled = true;
      setTimeout(bakePlan, 2600);
    }
    const plan = planCanvas;
    if (plan) {
      mctx.globalAlpha = 1;
      mctx.drawImage(plan, 0, 0, w, h);
    } else {
      mctx.strokeStyle = 'rgba(150,190,255,.55)';
      mctx.lineWidth = 1.3;
      mctx.strokeRect.apply(mctx, mapRect(HOUSE, w, h));
    }
    // 走过的路径
    if (walkTrail.length > 1) {
      mctx.beginPath();
      for (let i = 0; i < walkTrail.length; i++) {
        const q = mapPt(walkTrail[i][0], walkTrail[i][1], w, h);
        if (i === 0) mctx.moveTo(q[0], q[1]); else mctx.lineTo(q[0], q[1]);
      }
      mctx.strokeStyle = 'rgba(126,205,255,0.5)';
      mctx.lineWidth = 1.7;
      mctx.stroke();
    }

    // 房间名
    mctx.font = '9px ui-monospace, Consolas, monospace';
    mctx.fillStyle = 'rgba(163,196,240,.62)';
    const lbl = [['餐厅', 4.6, -4.8], ['客厅', 4.4, -1.4], ['卫生间', 3.45, 1.4]];
    for (let i = 0; i < lbl.length; i++) {
      const q = mapPt(lbl[i][1], lbl[i][2], w, h);
      mctx.fillText(lbl[i][0], q[0] - 10, q[1] + 3);
    }

    // 卫生间/房子外框，细虚线，帮助辨认
    mctx.setLineDash([3, 3]);
    mctx.strokeStyle = 'rgba(150,190,255,.45)';
    mctx.lineWidth = 1;
    mctx.strokeRect.apply(mctx, mapRect(HOUSE, w, h));
    mctx.strokeStyle = 'rgba(255,212,121,.35)';
    mctx.strokeRect.apply(mctx, mapRect(BATH2, w, h));
    mctx.setLineDash([]);

    // 门
    const dd = DOORS[0];
    const dp = mapPt((dd.x0 + dd.x1) / 2, (dd.z0 + dd.z1) / 2, w, h);
    mctx.fillStyle = '#c98a3f';
    mctx.fillRect(dp[0] - 3, dp[1] - 3, 6, 6);
    mctx.font = '9px ui-monospace, monospace';
    mctx.fillStyle = 'rgba(255,212,121,.9)';

    // 当前目标
    const cur = currentGoalId();
    if (cur) {
      const hid = cur === 'burn' ? 'basin' : cur;
      const hh = HOTS.find(function (x) { return x.id === hid; });
      if (hh) {
        const p = mapPt(hh.pos.x, hh.pos.z, w, h);
        const ph = (S.t * 1.6) % 1;
        mctx.beginPath();
        mctx.arc(p[0], p[1], 3 + ph * 10, 0, Math.PI * 2);
        mctx.strokeStyle = 'rgba(255,214,120,' + (0.85 - ph * 0.8).toFixed(2) + ')';
        mctx.lineWidth = 1.4;
        mctx.stroke();
        mctx.beginPath();
        mctx.arc(p[0], p[1], 3, 0, Math.PI * 2);
        mctx.fillStyle = '#c98a3f';
        mctx.fill();
      }
    }

    // 玩家
    const pp = mapPt(S.cam.x, S.cam.z, w, h);
    mctx.save();
    mctx.translate(pp[0], pp[1]);
    mctx.rotate(-S.cam.yaw);
    mctx.beginPath();
    mctx.moveTo(0, -7); mctx.lineTo(5, 6); mctx.lineTo(0, 3); mctx.lineTo(-5, 6);
    mctx.closePath();
    mctx.fillStyle = '#8fd0ff';
    mctx.fill();
    mctx.restore();
  }

  /* ---------------------------------------------------------------- 主循环 */
  let last = performance.now();

  /* ==== POST ==== 后期：亮部提取 + 三级模糊 + 暗角 + 颗粒 */
  const POST = (function () {
    const PO = { on: true, threshold: 0.85, knee: 0.14, strength: 0.55, vignette: 0.58, grain: 0.016 };
    window.__po = PO;

    const quadGeo = new T.PlaneGeometry(2, 2);
    const quadCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = new T.Mesh(quadGeo, null);
    const qScene = new T.Scene();
    qScene.add(quad);

    const rtOpts = {
      type: T.HalfFloatType,
      minFilter: T.LinearFilter,
      magFilter: T.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false
    };

    let sceneRT = null;
    const mips = [];
    let W = 2, H = 2;

    function vs() { return 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }'; }

    const brightMat = new T.ShaderMaterial({
      uniforms: { tSrc: { value: null }, uTh: { value: PO.threshold }, uKnee: { value: PO.knee } },
      vertexShader: vs(),
      fragmentShader: [
        'varying vec2 vUv; uniform sampler2D tSrc; uniform float uTh; uniform float uKnee;',
        'void main(){',
        '  vec3 c = texture2D(tSrc, vUv).rgb;',
        '  float l = max(c.r, max(c.g, c.b));',
        '  float k = clamp((l - uTh) / max(uKnee, 1e-4), 0.0, 1.0);',
        '  gl_FragColor = vec4(c * k * k, 1.0);',
        '}'
      ].join('\n'),
      depthTest: false, depthWrite: false
    });

    const blurMat = new T.ShaderMaterial({
      uniforms: { tSrc: { value: null }, uDir: { value: new T.Vector2(1, 0) }, uTexel: { value: new T.Vector2(1, 1) } },
      vertexShader: vs(),
      fragmentShader: [
        'varying vec2 vUv; uniform sampler2D tSrc; uniform vec2 uDir; uniform vec2 uTexel;',
        'void main(){',
        '  vec2 o = uDir * uTexel;',
        '  vec3 c = texture2D(tSrc, vUv).rgb * 0.2270270270;',
        '  c += texture2D(tSrc, vUv + o * 1.3846153846).rgb * 0.3162162162;',
        '  c += texture2D(tSrc, vUv - o * 1.3846153846).rgb * 0.3162162162;',
        '  c += texture2D(tSrc, vUv + o * 3.2307692308).rgb * 0.0702702703;',
        '  c += texture2D(tSrc, vUv - o * 3.2307692308).rgb * 0.0702702703;',
        '  gl_FragColor = vec4(c, 1.0);',
        '}'
      ].join('\n'),
      depthTest: false, depthWrite: false
    });

    const compMat = new T.ShaderMaterial({
      uniforms: {
        tScene: { value: null },
        tB1: { value: null }, tB2: { value: null }, tB3: { value: null },
        uStrength: { value: PO.strength },
        uVig: { value: PO.vignette },
        uGrain: { value: PO.grain },
        uTime: { value: 0 }
      },
      vertexShader: vs(),
      fragmentShader: [
        'varying vec2 vUv;',
        'uniform sampler2D tScene; uniform sampler2D tB1; uniform sampler2D tB2; uniform sampler2D tB3;',
        'uniform float uStrength; uniform float uVig; uniform float uGrain; uniform float uTime;',
        'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }',
        'vec3 toSRGB(vec3 c){',
        '  c = max(c, vec3(0.0));',
        '  return mix(c * 12.92, 1.055 * pow(max(c, vec3(1e-5)), vec3(0.41666)) - 0.055, step(vec3(0.0031308), c));',
        '}',
        'void main(){',
        '  vec3 base = texture2D(tScene, vUv).rgb;',
        '  vec3 bloom = texture2D(tB1, vUv).rgb * 0.50',
        '             + texture2D(tB2, vUv).rgb * 0.32',
        '             + texture2D(tB3, vUv).rgb * 0.18;',
        '  vec3 col = base + bloom * uStrength;',
        '  vec2 q = vUv - 0.5;',
        '  col *= clamp(1.0 - uVig * dot(q, q) * 1.9, 0.0, 1.0);',
        '  col += (hash(vUv * vec2(1920.0, 1080.0) + uTime) - 0.5) * uGrain;',
        '  gl_FragColor = vec4(toSRGB(col), 1.0);',
        '}'
      ].join('\n'),
      depthTest: false, depthWrite: false
    });

    function setSize(w, h) {
      W = Math.max(8, Math.floor(w));
      H = Math.max(8, Math.floor(h));
      if (sceneRT) sceneRT.dispose();
      mips.forEach(function (m) { m.rt.dispose(); if (m.tmp) m.tmp.dispose(); });
      mips.length = 0;
      const sceneOpts = Object.assign({}, rtOpts, { depthBuffer: true });
      sceneRT = new T.WebGLRenderTarget(W, H, sceneOpts);
      sceneRT.depthBuffer = true;
      let cw = W, ch = H;
      for (let i = 0; i < 3; i++) {
        cw = Math.max(4, Math.floor(cw / 2));
        ch = Math.max(4, Math.floor(ch / 2));
        mips.push({
          rt: new T.WebGLRenderTarget(cw, ch, rtOpts),
          tmp: new T.WebGLRenderTarget(cw, ch, rtOpts),
          w: cw, h: ch
        });
      }
    }

    function blit(mat, target) {
      quad.material = mat;
      renderer.setRenderTarget(target);
      renderer.clear();
      renderer.render(qScene, quadCam);
    }

    function render(dt) {
      if (!PO.on || !sceneRT) {
        renderer.setRenderTarget(null);
        renderer.render(scene, camera);
        return;
      }
      renderer.setRenderTarget(sceneRT);
      renderer.clear();
      renderer.render(scene, camera);

      brightMat.uniforms.tSrc.value = sceneRT.texture;
      brightMat.uniforms.uTh.value = PO.threshold;
      brightMat.uniforms.uKnee.value = PO.knee;
      blit(brightMat, mips[0].rt);

      for (let i = 0; i < mips.length; i++) {
        const m = mips[i];
        if (i > 0) {
          const src = mips[i - 1];
          blurMat.uniforms.tSrc.value = src.rt.texture;
          blurMat.uniforms.uTexel.value.set(1 / src.w, 1 / src.h);
          blurMat.uniforms.uDir.value.set(0, 0);
          blit(blurMat, m.rt);
        }
        blurMat.uniforms.tSrc.value = m.rt.texture;
        blurMat.uniforms.uTexel.value.set(1 / m.w, 1 / m.h);
        blurMat.uniforms.uDir.value.set(1, 0);
        blit(blurMat, m.tmp);
        blurMat.uniforms.tSrc.value = m.tmp.texture;
        blurMat.uniforms.uDir.value.set(0, 1);
        blit(blurMat, m.rt);
      }

      compMat.uniforms.tScene.value = sceneRT.texture;
      compMat.uniforms.tB1.value = mips[0].rt.texture;
      compMat.uniforms.tB2.value = mips[1].rt.texture;
      compMat.uniforms.tB3.value = mips[2].rt.texture;
      compMat.uniforms.uStrength.value = PO.strength;
      compMat.uniforms.uVig.value = PO.vignette;
      compMat.uniforms.uGrain.value = PO.grain;
      compMat.uniforms.uTime.value = (performance.now() * 0.001) % 100;
      blit(compMat, null);
      renderer.setRenderTarget(null);
    }

    function setOn(v) { PO.on = !!v; }
    addEventListener('keydown', function (e) {
      if (e.key === 'o' || e.key === 'O') setOn(!PO.on);
    });

    return { setSize: setSize, render: render, setOn: setOn, PO: PO };
  })();
  POST.setSize(window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio());
  /* ==== /POST ==== */


  /* ==== COLLAPSE ==== 分区坍缩：区域内实体烧成线稿 */
  const COLLAPSE = (function () {
    const POOL = [];           // { mesh, mat, u, target, base }
    let cursor = 0;

    const NOISE = [
      'float hash31(vec3 p){ return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453123); }',
      'float vnoise(vec3 p){',
      '  vec3 i = floor(p), f = fract(p);',
      '  f = f * f * (3.0 - 2.0 * f);',
      '  float n000 = hash31(i), n100 = hash31(i + vec3(1,0,0));',
      '  float n010 = hash31(i + vec3(0,1,0)), n110 = hash31(i + vec3(1,1,0));',
      '  float n001 = hash31(i + vec3(0,0,1)), n101 = hash31(i + vec3(1,0,1));',
      '  float n011 = hash31(i + vec3(0,1,1)), n111 = hash31(i + vec3(1,1,1));',
      '  return mix(mix(mix(n000,n100,f.x), mix(n010,n110,f.x), f.y),',
      '             mix(mix(n001,n101,f.x), mix(n011,n111,f.x), f.y), f.z);',
      '}',
      'float fbm3(vec3 p){ return vnoise(p) * 0.6 + vnoise(p * 2.1) * 0.28 + vnoise(p * 4.3) * 0.12; }'
    ].join('\n');

    function patch(mesh) {
      const src = mesh.material;
      if (!src || Array.isArray(src)) return null;
      if (!src.isMeshStandardMaterial && !src.isMeshPhysicalMaterial && !src.isMeshBasicMaterial) return null;
      const mat = src.clone();
      mat.transparent = true;
      const uni = { value: 0 };
      const uniMode = { value: 0 };
      mat.userData.colU = uni;
      mat.onBeforeCompile = function (sh) {
        sh.uniforms.uCol = uni;
        sh.uniforms.uMode = uniMode;
        sh.uniforms.uColRim = { value: new T.Color(0xd99a4e) };
        sh.vertexShader = sh.vertexShader
          .replace('#include <common>', '#include <common>\nvarying vec3 vColPos;')
          .replace('#include <project_vertex>',
            '#include <project_vertex>\n  vColPos = (modelMatrix * vec4(transformed, 1.0)).xyz;');
        sh.fragmentShader = sh.fragmentShader
          .replace('#include <common>',
            '#include <common>\nvarying vec3 vColPos;\nuniform float uCol;\nuniform float uMode;\nuniform vec3 uColRim;\n' + NOISE)
          .replace('#include <dithering_fragment>', [
            '  float dnNoise = fbm3(vColPos * 3.0);',
            '  float dnSweep = 1.0 - clamp((vColPos.y - 0.02) / 2.55, 0.0, 1.0);',
            '  float dn = mix(dnNoise, dnSweep, uMode);',
            '  if (dn < uCol) discard;',
            '  float edge = 1.0 - smoothstep(uCol, uCol + 0.11, dn);',
            '  gl_FragColor.rgb += uColRim * edge * 0.85;',
            '  #include <dithering_fragment>'
          ].join('\n'));
      };
      mat.needsUpdate = true;
      mesh.material = mat;
      return { mesh: mesh, src: src, mat: mat, uni: uni, uniMode: uniMode, u: 0, target: 0 };
    }

    const tmpV = new T.Vector3();
    function region(cx, cz, r, dur, mode) {
      const list = [];
      scene.traverse(function (o) {
        if (!o.isMesh || o.isLineSegments || !o.geometry) return;
        if (o.userData.noCollapse) return;
        o.getWorldPosition(tmpV);
        const dx = tmpV.x - cx, dz = tmpV.z - cz;
        if (dx * dx + dz * dz > r * r) return;
        list.push(o);
      });
      let n = 0;
      for (let i = 0; i < list.length; i++) {
        if (list[i].userData.colEntry) { list[i].userData.colEntry.target = 1; list[i].userData.colEntry.uniMode.value = mode ? 1 : 0; n++; continue; }
        const e = patch(list[i]);
        if (!e) continue;
        e.target = 1;e.uniMode.value = mode ? 1 : 0;
        list[i].userData.colEntry = e;
        POOL.push(e);
        n++;
      }
      return n;
    }

    function restore() {
      for (let i = 0; i < POOL.length; i++) POOL[i].target = 0;
    }

    function clear() {
      for (let i = 0; i < POOL.length; i++) {
        const e = POOL[i];
        e.mesh.material = e.src;
        e.mat.dispose();
        e.mesh.userData.colEntry = null;
      }
      POOL.length = 0;
    }

    function update(dt) {
      const k = Math.min(1, dt * 2.4);
      for (let i = 0; i < POOL.length; i++) {
        const e = POOL[i];
        e.u += (e.target - e.u) * k;
        if (Math.abs(e.target - e.u) < 0.002) e.u = e.target;
        e.uni.value = e.u * 1.02;
      }
    }

    function activeCount() {
      let n = 0;
      for (let i = 0; i < POOL.length; i++) if (POOL[i].target > 0.5) n++;
      return n;
    }

    return { region: region, restore: restore, clear: clear, update: update, activeCount: activeCount, POOL: POOL };
  })();
  window.__collapse = COLLAPSE;
  /* ==== /COLLAPSE ==== */

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    S.t += dt;
    updatePlayer(dt);
    updateGuide();
    if ((mapTick++ % 2) === 0) drawMap();
    Object.keys(goalMarks).forEach(function (k) {
      const m = goalMarks[k];
      if (!m.visible) return;
      m.rotation.y += dt * 1.5;
      m.position.y = m.userData.baseY + Math.sin(S.t * 2.2) * 0.05;
    });
    if (windowAnim) windowAnim.tex.offset.y = (windowAnim.tex.offset.y + dt * 0.09) % 1;
    if ((fadeTick++ % 4) === 0) updateLineFade();
    if (bathRoot) bathRoot.visible = S.cam.z > -0.10;
    updateDoorTag();
    updateHoverRing();
    updateHandPainting();
    if ((trailTick++ % 3) === 0) updateTrail();
    recordWalk();
    if (doorBeacon) {
      doorBeacon.rotation.y += dt * 1.2;
      doorBeacon.position.y = 1.55 + Math.sin(S.t * 2.2) * 0.05;
      doorBeacon.visible = S.cam.z > -0.10;
    }   // 人在屋里不显示屋外的卫生间
    if (burnT >= 0 && painting) {
      burnT = Math.min(1, burnT + dt / 2.0);
      painting.scale.setScalar(1 - 0.88 * burnT);
      painting.position.y = 0.42 + 0.30 * burnT;
      painting.rotation.z = 0.5 * burnT;
      if (burnT >= 1) {
        burnT = -1;
        painting.visible = false;
        S.burned = true;
        S.carry = false;
        handChip(false);
        spawnHair();
        toast('池沿上，有几根半黑半白的长发。');
      }
    }
    if (painting && paintingFlip >= 0) {
      paintingFlip = Math.min(1, paintingFlip + dt / 0.75);
      const k = paintingFlip < 0.5 ? 2 * paintingFlip * paintingFlip : 1 - Math.pow(-2 * paintingFlip + 2, 2) / 2;
      painting.rotation.y = (Math.PI + 0.06) * (1 - k) + 0.06 * k;
      painting.rotation.x = -0.20;
      if (paintingFlip >= 1) paintingFlip = 1;   // 停在翻开的姿态，等玩家自己按 E 拿
    }
    COLLAPSE.update(dt);
    POST.render(dt);
    requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------------- 开场 */
  const INTRO = [
    '大二的暑假，我回了一趟老家，是为了把那套旧房子租出去。',
    '回到家里时天已经黑了，我摸索着开了锁推门进去。',
    '开灯后，我看到了那熟悉的一切。'
  ];
  let typeTimers = [];

  function typeIntro() {
    let total = 0;
    INTRO.forEach(function (txt, i) {
      const el = $('l' + i);
      if (!el) return;
      for (let k = 0; k <= txt.length; k++) {
        (function (k) {
          typeTimers.push(setTimeout(function () {
            el.textContent = txt.slice(0, k);
            el.classList.toggle('cursor', k < txt.length);
          }, 26 * (total + k)));
        })(k);
      }
      total += txt.length + 6;
    });
    typeTimers.push(setTimeout(function () {
      $('goWrap').classList.add('on');
    }, 26 * total + 420));
  }

  function startRainLoop() {
    var el = document.getElementById('rainLoop');
    if (!el) return;
    el.volume = 0;
    var p = el.play();
    if (p && p.catch) p.catch(function () {});
    var t0 = performance.now();
    (function fade() {
      var k = Math.min(1, (performance.now() - t0) / 3200);
      el.volume = 0.55 * k;
      if (k < 1) requestAnimationFrame(fade);
    })();
  }

  function enter() {
    ensureAudio();
    startRainLoop();
    typeTimers.forEach(clearTimeout);
    typeTimers = [];
    introEl.classList.add('gone');
    hud.classList.add('on');
    S.phase = 'play';
    S.cine = {
      t: 0, dur: 2.2,
      from: { x: SPAWN.x + 0.3, z: SPAWN.z - 0.6, yaw: SPAWN.yaw + 0.04, pitch: 0.02 },
      to: { x: SPAWN.x, z: SPAWN.z, yaw: SPAWN.yaw, pitch: SPAWN.pitch },
      after: function () {
        toast('W A S D 走，鼠标转头，E 交互。');
        if (!document.pointerLockElement) {
          setTimeout(function () {
            if (!document.pointerLockElement && S.phase === 'play') {
              toast('点一下画面，鼠标就会被捕获（Esc 释放）。', 4200);
            }
          }, 2600);
        }
      }
    };
  }

  /* ---------------------------------------------------------------- 输入 */
  function onKey(e, down) {
    if (e.code === 'Escape') { if (document.exitPointerLock) document.exitPointerLock(); return; }
    // 目视台开着的时候，WASD / E 都不该动场景
    if (exOpen) return;
    if (e.code === 'KeyE' && down) { useHover(); return; }
    if (e.code === 'KeyV' && down) { setLook(lookMode === 'real' ? 'wire' : 'real'); return; }
    if (e.code === 'Space' && down && S.phase === 'idle') { enter(); return; }
    S.keys[e.code] = down;
  }

  document.addEventListener('keydown', function (e) { onKey(e, true); });

  document.addEventListener('click', function (e) {
    const b = e.target && e.target.closest ? e.target.closest('#lookBtn') : null;
    if (b) { setLook(lookMode === 'real' ? 'wire' : 'real'); }
  });
  document.addEventListener('keyup', function (e) { onKey(e, false); });

  document.addEventListener('pointerlockchange', function () {
    if (document.pointerLockElement === canvas && hint && hint.textContent) {
      setHint(hint.textContent.replace('E', 'E'));
    }
  });

  canvas.addEventListener('click', function () {
    if (S.phase === 'idle') { enter(); return; }
    if (S.phase !== 'play') return;
    if (document.pointerLockElement === canvas) {
      // 已经捕获鼠标：左键 = 交互（和 E 等价）
      if (S.hover) useHover();
      return;
    }
    if (canvas.requestPointerLock) {
      try { canvas.requestPointerLock(); } catch (e) { /* 拖拽也能转 */ }
    }
  });

  document.addEventListener('mousemove', function (e) {
    if (S.phase !== 'play' || S.cine) return;
    const locked = document.pointerLockElement === canvas;
    if (!locked && !S.drag) return;
    const dx = locked ? e.movementX : (S.drag ? e.clientX - S.drag.x : 0);
    const dy = locked ? e.movementY : (S.drag ? e.clientY - S.drag.y : 0);
    if (S.drag) { S.drag.x = e.clientX; S.drag.y = e.clientY; }
    S.cam.yaw -= dx * 0.0026;
    S.cam.pitch = Math.max(-1.2, Math.min(1.2, S.cam.pitch - dy * 0.0024));
    applyCamera();
    updateHover();
  });
  canvas.addEventListener('mousedown', function (e) {
    if (S.phase !== 'play') return;
    S.drag = { x: e.clientX, y: e.clientY };
  });
  document.addEventListener('mouseup', function () { S.drag = null; });

  addEventListener('keydown', function (e) {
    if (e.key === 'p' || e.key === 'P') {
      const rc = new T.Raycaster();
      rc.setFromCamera(new T.Vector2(0, 0), camera);
      const hs = rc.intersectObjects(scene.children, true).filter(function (h) { return h.object.isMesh; });
      const pt = hs.length ? hs[0].point : null;
      const info = {
        aim: pt ? [+pt.x.toFixed(2), +pt.y.toFixed(2), +pt.z.toFixed(2)] : null,
        feet: [+S.cam.x.toFixed(2), +S.cam.z.toFixed(2)],
        yaw: +S.cam.yaw.toFixed(2)
      };
      window.__pick = info;
      try { console.log('[PICK] ' + JSON.stringify(info)); } catch (err) {}
      toast('PICK  准星对准的点 ' + (info.aim ? info.aim.join(' / ') : '没打中') + '　我的脚下 ' + info.feet.join(' / '), 30000);
      return;
    }    if (/[?&]dev\b/.test(location.search) && (e.key === 'k' || e.key === 'K')) {
      COLLAPSE.region(S.cam.x, S.cam.z, 2.4, 0.9);
      toast('坍缩：' + COLLAPSE.activeCount() + ' 块');
    } else if (/[?&]dev\b/.test(location.search) && (e.key === 'j' || e.key === 'J')) {
      COLLAPSE.restore();
      toast('复原');
    }
  });

  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    POST.setSize(window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio());
  });

  $('btnGo').addEventListener('click', enter);
  $('btnAgain').addEventListener('click', function () { location.reload(); });
  $('btnReplay').addEventListener('click', function () { startEndSeq(); });

  $('sndBtn').addEventListener('click', function () {
    var on = !BGM.on; BGM.setOn(on); this.textContent = on ? '♪ 声' : '♪ 静';
  });
  ['pointerdown', 'keydown'].forEach(function (ev) {
    document.addEventListener(ev, function () { SFX.resume(); }, { once: true });
  });

  /* ---------------------------------------------------------------- 启动 */
  (async function boot() {
    buildShell();
    buildSouthWall();
    windowAnim = buildWindow();
    setupMap();
    buildBath();
    buildHotspots();

    /* 桌面薄灰：改到 2D 目视台里表现，3D 不再铺平面 */
    setupGuide();
    setupQuote();
    painting = buildPainting();
    // 放到左侧玻璃柜那一格（用户用 P 取的点：准星 0.48/0.42/-5.56，站 0.89/-5.33）
    if (painting) {
      // 平躺在地上、画面朝下（原文：走时是画面朝下靠在架子底下）
      painting.rotation.set(Math.PI / 2, 0, 0.62);
      painting.scale.setScalar(1.2);
      painting.position.set(0.58, 0.4, -5.50);
      painting.traverse(function (o) { o.userData.noCollapse = true; });
      painting.updateMatrixWorld(true);
      const pb = new T.Box3().setFromObject(painting);
      painting.position.y += (0.012 - pb.min.y);
      painting.updateMatrixWorld(true);
      window.__paintInfo = { min: +pb.min.y.toFixed(3) };
    }

    applyCamera();
    setLook('real');   // 默认进入就是正常建模（线框成了可选项）
    setLamp(true);   // 模型自带墙灯，进门就是亮的
    paintClues();
    typeIntro();
    requestAnimationFrame(frame);

    await buildKitchen();
    window.__propLog && window.__propLog.push('kitchen-ok');
    await furnish();
    await placeGlass();
    setLook('real');   // 家具是异步加载的，加载完再套一次真实材质
    if (!/[?&]dev\b/.test(location.search)) {
      // 交付版不带调试钩子；需要取点时在 URL 后面加 ?dev=1
      try {
        delete window.__hot; delete window.__dump; delete window.__pick;
        delete window.__collapse; delete window.__po; delete window.__paintInfo;
      } catch (e) {}
      setTimeout(function () {
        try {
          if (window.__anomaly) {
            delete window.__anomaly.dbg;
            delete window.__anomaly.hair;
            delete window.__anomaly.examine;
          }
        } catch (e) {}
      }, 0);
    }
    window.__propLog && window.__propLog.push('furnish-ok');

    window.__anomaly = {
      ready: true,
      scene: scene,
      camera: camera,
      renderer: renderer,
      THREE: T,
      enter: enter,
      cmp: function (id) { showCompare(id); },
      examine: function (id) { openExamine(id); },
      screenOf: function (id) { return hotScreen(id); },
      look: function (m) { return setLook(m); },
      lookMode: function () { return lookMode; },
      hair: function () { spawnHair(); },
      /* 调试：跳过前置，直接进入"可烧画"状态 */
      dbg: {
        bath: function () {
          S.cam.x = 3.35; S.cam.z = 0.85; S.cam.yaw = Math.PI; S.cam.pitch = -0.12;
          if (S.phase !== 'play' && typeof enter === 'function') enter();
          applyCamera();
          return S.cam;
        },
        burnReady: function () {
          if (S.clues.indexOf('painting') < 0) S.clues.push('painting');
          S.carry = true;
          if (S.phase !== 'play' && typeof enter === 'function') enter();
          return { clues: S.clues.slice(), carry: S.carry };
        },
        burn: function () {
          if (typeof startBurn === 'function') { startBurn(); return 'burned'; }
          return 'no-startBurn';
        },
        all: function () {
          this.burnReady();
          this.bath();
          return 'ok';
        }
      },
      hots: function () { return HOTS.map(function (h) { return { id: h.id, pos: h.pos.toArray(), r: h.r }; }); },
      // 调试用：直接摆镜头（F12 里敲 __anomaly.setCam(6.4, 1.6, 0.1, -0.08) 就能站到桌边看）
      setCam: function (x, z, yaw, pitch) {
        S.cam.x = x; S.cam.z = z;
        if (typeof yaw === 'number') S.cam.yaw = yaw;
        if (typeof pitch === 'number') S.cam.pitch = pitch;
        S.cam.x = Math.max(0.2, Math.min(7.6, S.cam.x));
        S.cam.z = Math.max(-7.1, Math.min(0.1, S.cam.z));
        applyCamera();
        return { x: S.cam.x, z: S.cam.z, yaw: S.cam.yaw };
      },
      state: function () {
        return {
          phase: S.phase, lampOn: S.lampOn, clues: S.clues.slice(),
          anomaly: S.anomaly, pos: { x: +S.cam.x.toFixed(2), z: +S.cam.z.toFixed(2) },
          hover: S.hover ? S.hover.id : null,
          hotspots: HOTS.map(function (h) { return h.id; })
        };
      },
      use: use,
      endSequence: function () { endChapter(); },
    freeAt: freeAt,
      hotspotList: function () {
        return HOTS.map(function (h) {
          return { id: h.id, label: h.label, x: +h.pos.x.toFixed(2), y: +h.pos.y.toFixed(2), z: +h.pos.z.toFixed(2), reach: h.reach };
        });
      },
      faceTo: function (id) {
        const h = HOTS.find(function (x) { return x.id === id; });
        if (!h) return 'no-hotspot';
        const dx = h.pos.x - S.cam.x, dz = h.pos.z - S.cam.z;
        S.cam.yaw = Math.atan2(-dx, -dz);
        const hd = Math.hypot(dx, dz) || 1e-6;
        S.cam.pitch = Math.atan2(h.pos.y - 1.5, hd);
        applyCamera();
        updateHover();
        return 'ok';
      },
      audio: function () {
        return {
          state: actx ? actx.state : 'none',
          rain: rainGain ? +rainGain.gain.value.toFixed(4) : null,
          sampleRate: actx ? actx.sampleRate : null
        };
      },
      aim: function () {
        const dir = lookDir();
        const eye = new T.Vector3(S.cam.x, 1.5, S.cam.z);
        return HOTS.map(function (h) {
          const v = h.pos.clone().sub(eye);
          const d = v.length();
          v.normalize();
          return { id: h.id, d: +d.toFixed(2), dot: +(v.x * dir.x + v.z * dir.z).toFixed(3), reach: d <= h.reach };
        }).sort(function (a, b) { return b.dot - a.dot; });
      },
      walkTo: function (x, z, yaw, pitch) {
        S.cam.x = x; S.cam.z = z;
        if (typeof yaw === 'number') S.cam.yaw = yaw;
        if (typeof pitch === 'number') S.cam.pitch = pitch;
        S.cine = null;
        applyCamera();
        updateHover();
        return { x: S.cam.x, z: S.cam.z };
      },
      forceAnomaly: triggerAnomaly,
      debug: function () {
        const list = [];
        scene.traverse(function (o) {
          if (o.isMesh && o.geometry) list.push({ name: o.name || '(mesh)', tris: (o.geometry.index ? o.geometry.index.count : (o.geometry.attributes.position ? o.geometry.attributes.position.count : 0)) / 3, visible: o.visible, pos: [+o.getWorldPosition(new T.Vector3()).x.toFixed(2), +o.getWorldPosition(new T.Vector3()).y.toFixed(2), +o.getWorldPosition(new T.Vector3()).z.toFixed(2)] });
        });
        return list.filter(function (x) { return x.tris > 2000; }).slice(0, 24);
      },
      rects: ROOMS
    };
  })();
})();
