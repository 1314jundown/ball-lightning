// climax.js - 《球状闪电》序幕终局交互与戏剧性高潮系统
// 涵盖：父母温情剪影、拔白发交互、球状闪电穿壁巡弋（深渊蓝星与红弧）、太古埙鸣低频共振、强光石化大理石雕塑与微型雪崩灰烬坍塌粒子

(function() {
  const T = window.THREE;
  if (!T) {
    console.error('Three.js 未加载，无法初始化 climax 模块');
    return;
  }

  // 挂载到全局命名空间
  window.ClimaxSystem = {
    init,
    setupParents,
    startClimaxSequence,
    onWhiteHairTrigger,
    isWhiteHairTarget,
    isStoneParentTarget,
    onStoneParentTrigger,
    update
  };

  let S = null;
  let Core = null;

  // 状态集合
  const state = {
    parentsGroup: null,
    fatherMesh: null,
    motherMesh: null,
    whiteHairSprite: null,
    whiteHairGlow: null,
    whiteHairClicked: false,
    silhouetteMaterials: [],
    ballLightingGroup: null,
    ballCore: null,
    ballInnerSphere: null,
    ballCorona: null,
    ballLight: null,
    ballSoundGain: null,
    ballOsc: null,
    ballSubOsc: null,
    ballNoiseNode: null,
    ballActive: false,
    ballPathProgress: 0,
    ballCurve: null,
    ashParticles: null,
    ashVelocities: null,
    ashActive: false,
    stoneInteractOpen: false,
    stoneInteractTimer: null,
    parentTargets: []
  };

  function init(prologueScope, coreScope) {
    S = prologueScope;
    Core = coreScope;
  }

  /* 生日歌（src/music.js）只是气氛陪衬：任何异常都不许打断终局流程，
     所以统一从这里调，失败就只记一条警告。 */
  function musicCall(method, ...args) {
    if (!S || !S.music || typeof S.music[method] !== 'function') return;
    try { S.music[method](...args); } catch (err) { console.warn('[climax] music.' + method + ' 失败', err); }
  }

  // 空间台词更新辅助
  function showSubtitle(speaker, line, duration = 4000) {
    const subsEl = document.getElementById('spatialSubs');
    const speakerEl = document.getElementById('spSpeaker');
    const lineEl = document.getElementById('spLine');
    if (!subsEl || !speakerEl || !lineEl) return;

    speakerEl.textContent = speaker;
    lineEl.classList.remove('show');
    setTimeout(() => {
      lineEl.textContent = line;
      lineEl.classList.add('show');
    }, 100);

    if (duration > 0) {
      setTimeout(() => {
        if (lineEl.textContent === line) {
          lineEl.classList.remove('show');
        }
      }, duration);
    }
  }

  function isWhiteHairTarget(obj) {
    if (!obj) return false;
    let p = obj;
    while (p) {
      if (p.userData && p.userData.isWhiteHair) return true;
      if (p === state.whiteHairSprite || p === state.whiteHairGlow) return true;
      p = p.parent;
    }
    return false;
  }

  function isStoneParentTarget(obj) {
    if (!obj) return false;
    let p = obj;
    while (p) {
      if (p.userData && p.userData.climaxParent) return !!state.stoneInteractOpen;
      p = p.parent;
    }
    return false;
  }

  function playStoneCrack() {
    const ctx = S && S.audio;
    if (!ctx || !S.soundOn) return;
    try {
      const now = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'square'; o.frequency.setValueAtTime(180, now); o.frequency.exponentialRampToValueAtTime(42, now + 0.22);
      g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.16, now + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
      o.connect(g).connect(ctx.destination); o.start(now); o.stop(now + 0.3);
    } catch (_) {}
  }

  function onStoneParentTrigger(obj) {
    if (!state.stoneInteractOpen) return false;
    let p = obj;
    while (p && !(p.userData && p.userData.climaxParent)) p = p.parent;
    if (!p) return false;
    const side = p.userData.climaxParent;
    const sheet = shadowSheets.find(s => s.side === side);
    if (!sheet) return false;
    state.stoneInteractOpen = false;
    if (state.stoneInteractTimer) { clearTimeout(state.stoneInteractTimer); state.stoneInteractTimer = null; }
    playStoneCrack();
    const hint = window.__prologue && window.__prologue.showHint;
    if (typeof hint === 'function') hint(side === 'father' ? '触碰父亲肩部。<em>石壳裂开了一道缝</em>' : '触碰母亲肩部。<em>石壳裂开了一道缝</em>');
    sheet.marble = Math.max(sheet.marble, 0.72);
    repaintShadow(sheet);
    Core.tween({ from: sheet.erode || 0, to: 0.22, dur: 760, ease: Core.easeOutCubic,
      onUpdate: v => { sheet.erode = v; repaintShadow(sheet); } });
    return true;
  }

  /* =========================================================================
     1. 影戏 · 烛光把父母投在窗与帘上
     ---------------------------------------------------------------------
     旧实现是拿球体和圆柱拼「人」：头=球、躯干=圆柱、胳膊=圆柱。四米外就是两团
     黑，用户的原话是「我根本没有看见父母在哪」。项目里也确实没有任何人形模型
     （只有桌椅蛋糕）。所以人物不再建模，改成影子：

       · 两个坐姿剪影贴在窗玻璃前，形状可辨认，与全息线框房间同一套视觉语言；
       · 白发直接画在影子头部的轮廓上（不再是半空里一根白棍）；
       · 石化、剥落、成灰全部在同一张画布上完成，不会出现几何体穿帮。

     画布只负责画，位置/尺寸/朝向由 3D 里的两块平面决定。
     ========================================================================= */

  const SHADOW_W = 640;
  const SHADOW_H = 900;
  const shadowSheets = [];      // [{ side, mesh, canvas, ctx, tex, marble, erode, hair }]

  /* 坐姿剪影：头 + 颈 + 躯干 + 前伸搭在桌沿的手 + 腿 + 椅子靠背。
     mirror=true 用来画镜像的那一位（两人相对而坐）。 */
  /* 坐姿背影：两个人背对我们坐在窗前，烛光把他们的上半身投在窗玻璃上。
     ---------------------------------------------------------------------
     为什么不画全身：投影只到桌面以上，下面被餐柜挡住；而且头+肩是"人"最不会画错的
     两个特征。之前那版画了椅子、胳膊、腿和一根竖条靠背，原尺寸 640×900 一导出来就是
     一堆互不相连的黑色色块 —— 四米外当然认不出是人。 */
  /* 坐姿背影：两个人背对我们坐在窗前，烛光把他们的上半身投在窗玻璃上。
     ---------------------------------------------------------------------
     为什么不画全身：投影只到桌面以上，下面被餐柜挡住；而且头+肩是"人"最不会画错的
     两个特征。之前那版画了椅子、胳膊、腿和一根竖条靠背，原尺寸 640×900 一导出来就是
     一堆互不相连的黑色色块 —— 四米外当然认不出是人。
     剪影是纯色平涂，内部细节一概看不见，所以"母亲/父亲"的区别只能做在轮廓上：
     母亲的发髻从头顶翘出来，父亲是平头加更宽的肩。 */
  /* 坐姿背影：两个人背对我们坐在窗前，烛光把他们的上半身投在窗玻璃上。
     ---------------------------------------------------------------------
     为什么不画全身：投影只到桌面以上，下面被餐柜挡住；而且头+肩是"人"最不会画错的
     两个特征。之前那版画了椅子、胳膊、腿和一根竖条靠背，原尺寸 640×900 一导出来就是
     一堆互不相连的黑色色块 —— 四米外当然认不出是人。
     剪影是纯色平涂，内部细节一概看不见，所以"母亲/父亲"的区别只能做在轮廓上：
     母亲的发髻从头顶翘出来，父亲是平头加更宽的肩。 */
  function paintFigureShapes(ctx, W, H, mirror, marble) {
    const X = (x) => (mirror ? (1 - x) * W : x * W);
    const Y = (y) => y * H;

    const bw = mirror ? 0.300 : 0.268;      // 肩半宽
    const headRx = mirror ? 0.086 : 0.084;
    const headRy = mirror ? 0.116 : 0.118;
    const headCy = 0.396;
    const neckY = 0.545;                    // 颈根（肩线最高处）
    const neckHalf = 0.050;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.clip();

    const ink = marble >= 1 ? 'rgba(246,244,238,1)' : 'rgba(13,11,16,1)';
    ctx.fillStyle = ink;
    ctx.strokeStyle = ink;

    /* 躯干：肩不是圆顶。外缘先竖直上去，肩头小小一顶，然后一条几乎直的斜方肌斜到颈根。
       上一版整段用贝塞尔兜起来，四米外就是个钟。 */
    ctx.beginPath();
    ctx.moveTo(X(0.5 - bw - 0.006), Y(1.08));
    ctx.lineTo(X(0.5 - bw - 0.002), Y(0.735));
    ctx.quadraticCurveTo(X(0.5 - bw + 0.004), Y(0.622), X(0.5 - bw + 0.062), Y(0.600));
    ctx.lineTo(X(0.5 - neckHalf - 0.030), Y(neckY + 0.004));
    ctx.quadraticCurveTo(X(0.5 - neckHalf - 0.010), Y(neckY - 0.002), X(0.5 - neckHalf), Y(neckY - 0.002));
    ctx.lineTo(X(0.5 + neckHalf), Y(neckY - 0.002));
    ctx.quadraticCurveTo(X(0.5 + neckHalf + 0.010), Y(neckY - 0.002), X(0.5 + neckHalf + 0.030), Y(neckY + 0.004));
    ctx.lineTo(X(0.5 + bw - 0.062), Y(0.600));
    ctx.quadraticCurveTo(X(0.5 + bw - 0.004), Y(0.622), X(0.5 + bw + 0.002), Y(0.735));
    ctx.lineTo(X(0.5 + bw + 0.006), Y(1.08));
    ctx.closePath();
    ctx.fill();

    /* 脖子：把头和肩接起来。少了这一段，头就是飘在半空的一颗蛋 */
    ctx.beginPath();
    ctx.moveTo(X(0.5 - neckHalf), Y(neckY + 0.010));
    ctx.lineTo(X(0.5 - neckHalf - 0.012), Y(headCy + headRy - 0.030));
    ctx.lineTo(X(0.5 + neckHalf + 0.012), Y(headCy + headRy - 0.030));
    ctx.lineTo(X(0.5 + neckHalf), Y(neckY + 0.010));
    ctx.closePath();
    ctx.fill();

    /* 头：略窄于肩，下缘压在颈根上 */
    ctx.beginPath();
    ctx.ellipse(X(0.5), Y(headCy), headRx * W, headRy * H, 0, 0, Math.PI * 2);
    ctx.fill();

    if (!mirror) {
      /* 母亲：发髻翘出头顶，另外在耳后补一点碎发，轮廓才不滑 */
      ctx.beginPath();
      ctx.ellipse(X(0.5), Y(headCy - headRy + 0.010), 0.050 * W, 0.040 * H, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(X(0.5 - 0.040), Y(headCy - 0.010), 0.026 * W, 0.034 * H, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      /* 父亲：平头 —— 头顶压平一点，后颈一圈短发 */
      ctx.beginPath();
      ctx.ellipse(X(0.5), Y(headCy - headRy + 0.018), 0.076 * W, 0.048 * H, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(X(0.5 - 0.066), Y(neckY - 0.058));
      ctx.quadraticCurveTo(X(0.5), Y(neckY + 0.014), X(0.5 + 0.066), Y(neckY - 0.058));
      ctx.fill();
    }

    /* 逆光的边缘：窗外的光在两侧肩线上留一道极细的暖边，剪影才不会糊成一片 */
    if (marble < 1) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255,190,120,0.14)';
      ctx.lineWidth = 1.9;
      ctx.lineCap = 'round';
      for (const sgn of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(X(0.5 + sgn * (bw + 0.004)), Y(1.00));
        ctx.lineTo(X(0.5 + sgn * (bw + 0.001)), Y(0.735));
        ctx.quadraticCurveTo(X(0.5 + sgn * (bw - 0.005)), Y(0.620), X(0.5 + sgn * (bw - 0.062)), Y(0.598));
        ctx.lineTo(X(0.5 + sgn * (neckHalf + 0.030)), Y(neckY + 0.006));
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.restore();
  }

  /* 把当前状态完整画一遍：剪影/汉白玉、裂纹、剥落、发丝。
     marble: 0=剪影 1=汉白玉石化    erode: 0=完整 1=剥落殆尽    hair: 是否还有那根白发
     注意：背景必须全透明。上一版在这里铺了一层暖色底光，等于给窗玻璃蒙了张浅色纸，
     剪影的明暗关系全糊了 —— 窗自己会亮，不需要画布来补光。 */
  function repaintShadow(sheet) {
    const { canvas, ctx, side } = sheet;
    const W = SHADOW_W, H = SHADOW_H;
    const mirror = side === 'father';
    const marble = sheet.marble || 0;
    const erode = sheet.erode || 0;

    ctx.clearRect(0, 0, W, H);

    // ① 形体
    paintFigureShapes(ctx, W, H, mirror, marble);

    // ② 石化：只在已有的形体像素上叠汉白玉（source-atop 天然被剪影裁住）
    if (marble > 0 && marble < 1) {
      ctx.save();
      ctx.globalCompositeOperation = 'source-atop';
      const g = ctx.createLinearGradient(0, H * 0.02, W * 0.15, H * 1.0);
      const k = marble;
      g.addColorStop(0, 'rgba(250,248,242,' + k + ')');
      g.addColorStop(0.42, 'rgba(231,228,219,' + k + ')');
      g.addColorStop(0.76, 'rgba(196,192,182,' + k + ')');
      g.addColorStop(1, 'rgba(158,154,146,' + k + ')');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }

    // ③ 石纹与裂：几道暗线，越到后面越明显
    if (marble > 0.35) {
      ctx.save();
      ctx.globalCompositeOperation = 'source-atop';
      const a = (marble - 0.35) / 0.65;
      ctx.strokeStyle = 'rgba(122,118,110,' + (0.30 * a) + ')';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 5; i++) {
        const sx = W * (0.34 + i * 0.075), sy = H * (0.58 + (i % 3) * 0.09);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(sx + W * 0.040, sy + H * 0.12, sx - W * 0.024, sy + H * 0.28);
        ctx.stroke();
      }
      ctx.restore();
    }

    // ④ 剥落：从下往上带着噪声边缘啃掉，而不是整体淡出
    //    （抖动的相位用 seed 固定，否则每帧随机会让剥落边缘一直闪。
    //      单用 sin 会画出一排等距小三角，像锯子，所以换成三倍频的值噪声）
    if (erode > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      const edge = (1 - erode) * H * 1.06;
      const seed = sheet.seed || 1;
      const hash = (x) => {
        const s = Math.sin(x * 12.9898 + seed * 31.7) * 43758.5453;
        return s - Math.floor(s);
      };
      const noise1 = (x) => {
        let v = 0, amp = 0.55, f = 1;
        for (let o = 0; o < 3; o++) {
          const xi = Math.floor(x * f);
          const fr = x * f - xi;
          const a = hash(xi), b = hash(xi + 1);
          v += amp * (a + (b - a) * (fr * fr * (3 - 2 * fr)));
          amp *= 0.5;
          f *= 2.7;
        }
        return v;
      };
      ctx.beginPath();
      ctx.moveTo(0, H + 2);
      ctx.lineTo(0, edge);
      const steps = 96;
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * W;
        ctx.lineTo(x, edge + (noise1(i / steps * 7) - 0.42) * H * 0.055);
      }
      ctx.lineTo(W, H + 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // ⑤ 那根白发：从发髻上翘出来的一缕，带一点自发光
    if (sheet.hair) {
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(255,255,255,0.97)';
      ctx.shadowColor = 'rgba(198,226,255,0.95)';
      ctx.shadowBlur = 15;
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      const bx = 0.5 * W;
      const topY = headTopY(mirror);
      ctx.beginPath();
      ctx.moveTo(bx + 0.012 * W, topY * H);
      ctx.bezierCurveTo(bx - 0.026 * W, (topY - 0.045) * H, bx + 0.030 * W, (topY - 0.085) * H, bx + 0.002 * W, (topY - 0.118) * H);
      ctx.stroke();
      ctx.restore();
    }

    if (sheet.tex) sheet.tex.needsUpdate = true;
  }

  /* 头顶（含发髻/平头）在画布里的高度，白发就从这个点往上翘 */
  function headTopY(mirror) {
    const headRy = mirror ? 0.116 : 0.118;
    const headCy = 0.396;
    return mirror ? headCy - headRy - 0.008 : headCy - headRy - 0.022;
  }

  /* 白发发光片：点击热区 + 视觉诱饵。旧实现是一根悬空的白棍（TubeGeometry），
     这里换成贴着影子头部的一小团柔光，落点就是那缕发丝。 */
  function makeHairGlowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const rg = g.createRadialGradient(64, 64, 1, 64, 64, 62);
    rg.addColorStop(0, 'rgba(255,255,255,0.95)');
    rg.addColorStop(0.28, 'rgba(214,236,255,0.55)');
    rg.addColorStop(0.66, 'rgba(150,190,255,0.16)');
    rg.addColorStop(1, 'rgba(120,170,255,0)');
    g.fillStyle = rg;
    g.fillRect(0, 0, 128, 128);
    return new T.CanvasTexture(c);
  }

  function setupParents() {
    if (!S || !S.scene) return;

    const group = new T.Group();
    group.name = 'family-parents';     // prologue.js 的 rayHitTargets() 按这个名字找它，别改

    // 落点：窗玻璃正前。取窗的包围盒算尺寸，取不到就用内置餐厅的坐标契约。
    let cx = 0, cy = 1.5, zFront = -1.9, halfW = 0.78, height = 1.9;
    if (S.windowGroup && Core && Core.boxOf) {
      try {
        const b = Core.boxOf(S.windowGroup).box;
        cx = (b.min.x + b.max.x) / 2;
        cy = (b.min.y + b.max.y) / 2;
        zFront = b.max.z + 0.035;
        halfW = Math.max(0.5, (b.max.x - b.min.x) / 2);
        height = Math.max(1.2, b.max.y - b.min.y);
      } catch (e) { }
    }

    // 剪影版整段删掉了：球+圆柱拼的人、分离的头、悬空的手臂都被用户判定为"吓死谁了"。
    // 现在窗前只留一枚光点，点它就触发后面整段剧情。
    state.orbAnchor = new T.Vector3(cx, cy + 0.02, zFront);

    // 白发柔光：贴在母亲影子的发丝根部，跟着剪影走
    /* 窗前的光点：一枚呼吸的冷白光团 + 一盏很小的点光源照亮窗框。
       点它 = 触发剧情（沿用原来的 isWhiteHair 判定，不用改点击链路）。 */
    const hairSprite = new T.Sprite(new T.SpriteMaterial({
      map: makeHairGlowTexture(),
      color: 0xcfe4ff,
      transparent: true,
      opacity: 0.95,
      blending: T.AdditiveBlending,
      depthWrite: false,
      toneMapped: false
    }));
    hairSprite.userData = { isWhiteHair: true, interactionId: 'white-hair' };
    hairSprite.position.set(cx, cy + 0.02, zFront + 0.06);
    hairSprite.scale.set(0.21, 0.21, 1);
    hairSprite.renderOrder = 8;
    group.add(hairSprite);

    /* 外面再套一层很淡的大光晕：既好点中，也不像个小灯泡 */
    const halo = new T.Sprite(new T.SpriteMaterial({
      map: hairSprite.material.map,
      color: 0x7fa8e8,
      transparent: true,
      opacity: 0.26,
      blending: T.AdditiveBlending,
      depthWrite: false,
      toneMapped: false
    }));
    halo.position.copy(hairSprite.position);
    halo.position.z -= 0.004;
    halo.scale.set(0.62, 0.62, 1);
    halo.renderOrder = 7;
    group.add(halo);
    state.orbHalo = halo;

    const orbLight = new T.PointLight(0xa8c8ff, 0.9, 2.8, 2);
    orbLight.position.copy(hairSprite.position);
    group.add(orbLight);

    state.whiteHairSprite = hairSprite;
    state.whiteHairGlow = hairSprite;      // 只有一团光，不再另起一根几何体
    state.orbLight = orbLight;

    /* 高潮用的真实 3D 父母影像：不是屏幕字幕，也不是静态 PNG 占位。
       画布贴图保留轮廓，但 marble/erode 会在同一张纹理上推进，平面本身作为 raycast 目标。 */
    const addParentSheet = (side, x, h, aspect) => {
      const canvas = document.createElement('canvas'); canvas.width = SHADOW_W; canvas.height = SHADOW_H;
      const ctx = canvas.getContext('2d');
      const tex = new T.CanvasTexture(canvas); tex.colorSpace = T.SRGBColorSpace;
      const sheet = { side, canvas, ctx, tex, marble: 0, erode: 0, hair: false, seed: side === 'father' ? 2.1 : 3.7, mesh: null };
      repaintShadow(sheet);
      const mat = new T.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.001, depthWrite: false, side: T.DoubleSide, toneMapped: false });
      const mesh = new T.Mesh(new T.PlaneGeometry(h * aspect, h), mat);
      mesh.position.set(x, cy - h * 0.40, zFront + 0.08);
      mesh.userData.climaxParent = side;
      mesh.userData.interactionId = side === 'father' ? 'father' : 'mother';
      mesh.renderOrder = 5;
      sheet.mesh = mesh; group.add(mesh); shadowSheets.push(sheet); state.parentTargets.push(mesh);
    };
    addParentSheet('father', cx + halfW * 0.34, Math.max(1.35, height * 0.72), 336 / 1024);
    addParentSheet('mother', cx - halfW * 0.28, Math.max(1.25, height * 0.68), 211 / 1024);

    S.scene.add(group);
    state.parentsGroup = group;
    console.log('[climax] 窗前光点就位：', hairSprite.position.toArray().map(v => v.toFixed(2)).join(', '));
  }

  /* 石化推进：marble 0→1；到 1 之后再剥落 */
  function petrifyShadows(dur = 2600) {
    shadowSheets.forEach((sheet, i) => {
      const pause = i * 180;
      setTimeout(() => {
        Core.tween({
          from: 0, to: 1, dur,
          ease: Core.easeInOutCubic,
          onUpdate: (v) => {
            if (Math.abs(v - sheet.marble) < 0.01) return;
            sheet.marble = v;
            repaintShadow(sheet);
          }
        });
      }, pause);
    });
  }
  

  /* =========================================================================
     2. 拔白发交互流程
     ========================================================================= */
  function onWhiteHairTrigger() {
    if (state.whiteHairClicked) return;
    state.whiteHairClicked = true;
    shadowSheets.forEach(sheet => {
      if (sheet.mesh && sheet.mesh.material) sheet.mesh.material.opacity = 0.92;
      sheet.marble = Math.max(sheet.marble || 0, 0.02);
      repaintShadow(sheet);
    });

    // 原作第一幕对话：儿子温情拔发
    showSubtitle('我', '“窗上那点光……每天晚上都在。”', 3200);

    // 发丝被拔走：影子上的那一缕消失，柔光收掉
    const sheet = shadowSheets.find(s => s.side === 'mother');
    if (sheet) {
      sheet.hair = false;
      repaintShadow(sheet);
    }
    if (state.whiteHairSprite) {
      const sprite = state.whiteHairSprite;
      const origScale = sprite.scale.x;
      Core.tween({
        from: 1, to: 0, dur: 1100, ease: Core.easeOutCubic,
        onUpdate: v => {
          sprite.scale.set(origScale * v, origScale * v, 1);
          sprite.material.opacity = v * 0.9;
        },
        onDone: () => { sprite.visible = false; }
      });
    }
    state.whiteHairGlow = null;

    // 母亲温情回应
    setTimeout(() => {
      showSubtitle('母亲', '“别怕，站近一点看。”', 3600);
      playMotherWhisperTone();
    }, 3500);

    // 母亲说完后片刻，触发球状闪电穿壁入侵高潮
    setTimeout(() => {
      triggerBallLightningEntry();
    }, 7200);
  }

  function playMotherWhisperTone() {
    const ctx = S.audio;
    if (!ctx || !S.soundOn) return;
    const t = ctx.currentTime;
    [440, 554.37, 659.25].forEach((freq, idx) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.04, t + 0.2 + idx * 0.1);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.8);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 3.0);
    });
  }

  /* =========================================================================
     3. 球状闪电穿壁入侵与太古埙鸣音效合成
     ========================================================================= */
  function createBallLightning() {
    const group = new T.Group();
    group.name = 'ball-lightning-entity';

    // 核心球体（深邃电浆蓝白球）
    const coreGeo = new T.SphereGeometry(0.12, 32, 32);
    const coreMat = new T.MeshBasicMaterial({
      color: 0xe6f4ff,
      transparent: true,
      opacity: 0.98
    });
    const core = new T.Mesh(coreGeo, coreMat);
    group.add(core);
    state.ballCore = core;

    // 内蕴深渊星核（多层点状与旋转光涡）
    const innerPointsGeo = new T.BufferGeometry();
    const starCount = 380;
    const pos = new Float32Array(starCount * 3);
    const col = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 0.02 + Math.random() * 0.085;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      col[i * 3] = 0.4 + Math.random() * 0.6;
      col[i * 3 + 1] = 0.7 + Math.random() * 0.3;
      col[i * 3 + 2] = 1.0;
    }
    innerPointsGeo.setAttribute('position', new T.BufferAttribute(pos, 3));
    innerPointsGeo.setAttribute('color', new T.BufferAttribute(col, 3));

    const starMat = new T.PointsMaterial({
      size: 0.012,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: T.AdditiveBlending
    });
    const innerStars = new T.Points(innerPointsGeo, starMat);
    group.add(innerStars);
    state.ballInnerSphere = innerStars;

    // 暗红日冕电弧光晕（周围包裹的一层极薄暗红色曲率晕轮）
    const coronaGeo = new T.SphereGeometry(0.165, 32, 32);
    const coronaMat = new T.ShaderMaterial({
      transparent: true,
      side: T.BackSide,
      blending: T.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
          vec3 redGlow = vec3(0.95, 0.15, 0.05) * intensity * 1.8;
          vec3 blueEdge = vec3(0.1, 0.4, 0.9) * (1.0 - intensity) * 0.5;
          gl_FragColor = vec4(redGlow + blueEdge, intensity * 0.85);
        }
      `
    });
    const corona = new T.Mesh(coronaGeo, coronaMat);
    group.add(corona);
    state.ballCorona = corona;

    // 点光源：照亮周围环境墙壁与父母轮廓
    const ballLight = new T.PointLight(0x70bbff, 2.5, 6.0, 1.8);
    ballLight.castShadow = false;
    group.add(ballLight);
    state.ballLight = ballLight;

    group.position.set(-2.8, 1.8, -1.5);
    group.visible = false;
    S.scene.add(group);
    state.ballLightingGroup = group;
  }

  // 太古乐器「埙鸣」低频空灵音效合成器
  function startAncientXunSound() {
    const ctx = S.audio;
    if (!ctx || !S.soundOn) return;

    try {
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.16, now + 3.0);
      masterGain.connect(ctx.destination);
      state.ballSoundGain = masterGain;

      // 基频低频纯音（Bb2 空灵低音）
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(116.54, now);
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(3.2, now);
      lfoGain.gain.setValueAtTime(2.1, now);
      lfo.connect(osc1.frequency);
      lfo.start(now);

      const osc1Gain = ctx.createGain();
      osc1Gain.gain.setValueAtTime(0.7, now);
      osc1.connect(osc1Gain).connect(masterGain);
      osc1.start(now);
      state.ballOsc = osc1;

      // 次泛音空腔
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(233.08, now);
      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.28, now);
      osc2.connect(osc2Gain).connect(masterGain);
      osc2.start(now);
      state.ballSubOsc = osc2;

      // 空腔白/粉噪带通滤波
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(320, now);
      bandpass.Q.setValueAtTime(6.0, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.06, now);

      whiteNoise.connect(bandpass).connect(noiseGain).connect(masterGain);
      whiteNoise.start(now);
      state.ballNoiseNode = whiteNoise;

    } catch (e) {
      console.warn('音效合成出错:', e);
    }
  }

  function stopAncientXunSound(fadeOut = 1.0) {
    if (state.ballSoundGain && S.audio) {
      const now = S.audio.currentTime;
      state.ballSoundGain.gain.linearRampToValueAtTime(0.0001, now + fadeOut);
      setTimeout(() => {
        try {
          if (state.ballOsc) state.ballOsc.stop();
          if (state.ballSubOsc) state.ballSubOsc.stop();
          if (state.ballNoiseNode) state.ballNoiseNode.stop();
        } catch (_) {}
      }, fadeOut * 1000 + 100);
    }
  }

  // 球状闪电穿壁入侵高潮推进
  function triggerBallLightningEntry() {
    if (!state.ballLightingGroup) createBallLightning();

    const cb = S.cakeBox.center;
    const tableTop = S.cakeBox.box.min.y;

    const curve = new T.CatmullRomCurve3([
      new T.Vector3(-2.6, 1.85, -1.2),
      new T.Vector3(-1.4, 1.70, -0.2),
      new T.Vector3(-0.3, 1.60, 0.4),
      new T.Vector3(cb.x + 0.48, tableTop + 0.95, cb.z + 0.10)
    ]);

    state.ballCurve = curve;
    state.ballLightingGroup.visible = true;
    state.ballActive = true;
    state.ballPathProgress = 0;

    startAncientXunSound();
    // 生日歌在这 6.5 秒里被上古低鸣顶偏：一句比一句慢，开始掉音、跑调
    /* 渐进变调挪到球到场那一刻 */
    showSubtitle('原著叙事', '“一个蓝色的光球穿墙而入，伴随着太古陶埙般的低鸣……”', 4800);

    Core.tween({
      from: 0, to: 1, dur: 6500, ease: Core.easeInOutCubic,
      onUpdate: k => {
        state.ballPathProgress = k;
        const pt = curve.getPoint(k);
        state.ballLightingGroup.position.copy(pt);
      },
      onDone: () => {
        musicCall('warp', 1, 1.6);
        setTimeout(() => {
          showSubtitle('原著叙事', '“它静静悬停在爸爸头顶上半米处，整个房间被照得惨白。”', 3800);
          setTimeout(() => {
            triggerNuclearDetonation();
          }, 4200);
        }, 800);
      }
    });
  }

  /* =========================================================================
     4. 核心高潮：炽烈白光爆闪、世界失色石化、大理石雕塑、灰烬雪崩
     ========================================================================= */
  function triggerNuclearDetonation() {
    console.log('触发球状闪电能量解构爆发！');

    playDetonationExplosion();
    stopAncientXunSound(0.2);
    // 白光爆闪那一刻：生日歌 8ms 归零，只剩一记低频撞击，之后整首不再回来
    musicCall('cut');
    // 混响尾巴散完（4 s）就把排程定时器收掉，别让它在石化那一段空转
    setTimeout(() => musicCall('stop'), 4000);

    const flashEl = document.getElementById('flashBang');
    if (flashEl) {
      flashEl.classList.add('boom');
      setTimeout(() => {
        flashEl.style.transition = 'opacity 3.2s cubic-bezier(0.1, 0.8, 0.2, 1)';
        flashEl.classList.remove('boom');
        flashEl.style.opacity = '0.35';
        setTimeout(() => {
          flashEl.style.opacity = '0';
          setTimeout(() => {
            flashEl.style.transition = '';
          }, 3200);
        }, 2800);
      }, 350);
    }

    if (state.ballLightingGroup) {
      state.ballLightingGroup.visible = false;
    }

    /* 石化：燃烧的剪影 → 汉白玉。旧实现是给 3D 人形材质的 shader 推 uMarbleTransition，
       现在人物是影子，石化在画布上推进（见 petrifyShadows）。 */
    petrifyShadows(2400);
    /* 灰壳/大理石窗口：允许玩家触碰任一位父母，触发局部裂纹与剥落；
       若没有操作，定时雪崩流程继续，避免剧情被卡住。 */
    state.stoneInteractOpen = true;
    setTimeout(() => {
      if (!state.stoneInteractOpen) return;
      const hint = window.__prologue && window.__prologue.showHint;
      if (typeof hint === 'function') hint('灰白的石壳正在收紧。<em>触碰父亲或母亲的肩部</em>');
    }, 1000);
    state.stoneInteractTimer = setTimeout(() => {
      state.stoneInteractOpen = false;
      state.stoneInteractTimer = null;
    }, 6200);

    if (S.candles) {
      for (const c of S.candles) {
        c.lit = false;
        c.light.intensity = 0;
        for (const fl of c.flames) fl.visible = false;
        if (c.flameParts) {
          for (const p of c.flameParts) if (p.sp) p.sp.visible = false;
        }
      }
    }
    const warmEl = document.getElementById('warm');
    if (warmEl) warmEl.classList.remove('on');

    setTimeout(() => {
      showSubtitle('原著叙事', '“父母仍然坐在那里微笑着，但身体已经化为灰白的大理石雕像。”', 5000);
    }, 1800);

    buildAshParticles();

    setTimeout(() => {
      triggerAshAvalanche();
      setTimeout(openEndcard, 2200);
    }, 3000);
  }

  /* 终局卡片不在状态对象上：S 是序章的场景状态（window.__prologue.S），
     showEndcard 挂在 window.__prologue 上。原来写成 S.showEndcard() 会在这里抛
     "S.showEndcard is not a function"，把整个尾声打断 —— 用户看到的就是灰烬飞完、
     然后什么都没有。这里做一次兜底，宁可漏掉卡片也不能让尾声炸掉。 */
  function openEndcard() {
    const api = window.__prologue;
    /* 原著顺序：变灰之后，主角去厨房拉开冰箱，看见生冻鸡已经熟了 —— 再收尾 */
    if (api && typeof api.kitchenWalkAfterClimax === 'function') {
      return api.kitchenWalkAfterClimax(() => {
        if (typeof api.showEndcard === 'function') api.showEndcard();
      });
    }
    if (api && typeof api.showEndcard === 'function') return api.showEndcard();
    console.warn('[climax] window.__prologue.showEndcard 不可用，跳过终局卡片');
  }

  function playDetonationExplosion() {
    const ctx = S.audio;
    if (!ctx || !S.soundOn) return;
    const now = ctx.currentTime;

    const dur = 3.6;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < buf.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.45));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.setValueAtTime(1200, now);
    hp.frequency.exponentialRampToValueAtTime(150, now + 1.2);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noise.connect(hp).connect(gain).connect(ctx.destination);
    noise.start(now);

    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(120, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 1.8);
    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.8, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
    subOsc.connect(subGain).connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 2.4);
  }

  /* 圆点贴图：PointsMaterial 没有贴图时画的是正方形 —— 旧实现那场「一块块白色米饭」
     就是 28000 个方块。用放射渐变贴图之后才是灰屑该有的样子。 */
  function makeAshTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const rg = g.createRadialGradient(32, 32, 0.5, 32, 32, 30);
    rg.addColorStop(0, 'rgba(255,255,255,1)');
    rg.addColorStop(0.40, 'rgba(244,242,236,0.72)');
    rg.addColorStop(0.78, 'rgba(226,222,214,0.20)');
    rg.addColorStop(1, 'rgba(220,216,208,0)');
    g.fillStyle = rg;
    g.fillRect(0, 0, 64, 64);
    return new T.CanvasTexture(c);
  }

  /* 灰屑从两张影子的身上剥落下来，落到地面各自堆成一堆 ——
     原著写的就是「只留下两小堆余烬」，所以不铺满一地，往两个堆心收。 */
  function shadowSheetBox(sheet) {
    const p = sheet.mesh.geometry.parameters || { width: 0.4, height: 0.9 };
    return {
      cx: sheet.mesh.position.x,
      cy: sheet.mesh.position.y,
      cz: sheet.mesh.position.z,
      w: p.width,
      h: p.height
    };
  }

  /* 采样画布 alpha，拿到"身体"在画布上的像素位置。
     灰必须从身体上掉下来。上一版按矩形均匀撒点，结果是一整块雪噪糊满窗玻璃，
     跟掉灰没有半点关系 —— 这是那场「白色米饭」的另一个来源。 */
  function sampleSheetPixels(sheet) {
    let data;
    try {
      data = sheet.ctx.getImageData(0, 0, SHADOW_W, SHADOW_H).data;
    } catch (e) {
      return [];
    }
    const out = [];
    for (let y = 0; y < SHADOW_H; y += 2) {
      for (let x = 0; x < SHADOW_W; x += 2) {
        if (data[(y * SHADOW_W + x) * 4 + 3] > 180) out.push(y * SHADOW_W + x);
      }
    }
    return out;
  }

  /* 灰屑：从身体像素上剥落，落到地面各自堆成一堆 ——
     原著写的就是「只留下两小堆余烬」，所以不铺满一地，往两个堆心收。 */
  function buildAshParticles() {
    if (!shadowSheets.length) return;

    const perSheet = 7000;
    const ashCount = perSheet * shadowSheets.length;
    const pos = new Float32Array(ashCount * 3);
    const col = new Float32Array(ashCount * 3);
    const vels = new Float32Array(ashCount * 3);
    const home = new Float32Array(ashCount);
    const rel = new Float32Array(ashCount);      // 相对雪崩开始的剥落时刻（秒）

    state.heapCenters = [];

    shadowSheets.forEach((sheet, si) => {
      const b = shadowSheetBox(sheet);
      const px = sampleSheetPixels(sheet);
      state.heapCenters.push({ x: b.cx, y: 0.02, z: b.cz + 0.30 });

      for (let k = 0; k < perSheet; k++) {
        const i = si * perSheet + k;

        // 从身体上取一个像素点当出生位置
        let u = 0.5, v = 0.5;
        if (px.length) {
          const p = px[(Math.random() * px.length) | 0];
          u = (p % SHADOW_W) / SHADOW_W;
          v = Math.floor(p / SHADOW_W) / SHADOW_H;
        }

        pos[i * 3] = b.cx + (u - 0.5) * b.w;
        pos[i * 3 + 1] = b.cy + (0.5 - v) * b.h;
        pos[i * 3 + 2] = b.cz + (Math.random() - 0.5) * 0.05;

        const grey = 0.78 + Math.random() * 0.22;
        col[i * 3] = grey * 1.02;
        col[i * 3 + 1] = grey;
        col[i * 3 + 2] = grey * 0.97;

        vels[i * 3] = (Math.random() - 0.5) * 0.02;
        vels[i * 3 + 1] = -0.15 - Math.random() * 0.25;
        vels[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

        home[i] = si;
        // 剥落是从下往上走的：位置越低越早掉
        rel[i] = 0.10 + (1 - v) * 1.4 + Math.random() * 2.0;
      }
    });

    const geo = new T.BufferGeometry();
    geo.setAttribute('position', new T.BufferAttribute(pos, 3));
    geo.setAttribute('color', new T.BufferAttribute(col, 3));

    const mat = new T.PointsMaterial({
      size: 0.013,
      map: makeAshTexture(),
      alphaTest: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      sizeAttenuation: true,
      blending: T.NormalBlending
    });

    const points = new T.Points(geo, mat);
    points.frustumCulled = false;
    S.scene.add(points);
    state.ashParticles = points;
    state.ashVelocities = vels;
    state.ashHome = home;
    state.ashRel = rel;
    state.ashT = 0;
  }

  function triggerAshAvalanche() {
    state.ashActive = true;
    showSubtitle('原著叙事', '“烛火一暗，整间屋子都凉了下来。”', 4800);

    // 播放高保真晶体微碎裂与雪崩滑落声
    playAvalancheCrackle();

    // 剥落：纹理自下而上被噪声吃掉，不是整体淡出
    shadowSheets.forEach((sheet, i) => {
      setTimeout(() => {
        Core.tween({
          from: 0, to: 0.92, dur: 3600, ease: Core.easeInOutCubic,
          onUpdate: (v) => {
            if (Math.abs(v - sheet.erode) < 0.012) return;
            sheet.erode = v;
            repaintShadow(sheet);
          },
          onDone: () => {
            sheet.erode = 1;
            repaintShadow(sheet);
            setTimeout(() => { sheet.mesh.visible = false; }, 400);
          }
        });
      }, i * 260);
    });

    // 灰屑脱手：有了初速度才像雪崩，而不是原地淡出
    if (state.ashVelocities) {
      for (let i = 0; i < state.ashVelocities.length; i += 3) {
        state.ashVelocities[i + 1] = -0.10 - Math.random() * 0.20;
        state.ashVelocities[i] += (Math.random() - 0.5) * 0.05;
        state.ashVelocities[i + 2] += (Math.random() - 0.5) * 0.05;
      }
    }

    // 灰本身是"跟着石皮一起掉"的，所以要随着剥落慢慢显影，不能一开始就满天是灰
    if (state.ashParticles) {
      const mat = state.ashParticles.material;
      Core.tween({
        from: 0, to: 0.92, dur: 1400, ease: Core.easeOutCubic,
        onUpdate: (v) => { mat.opacity = v; }
      });
    }

    // 落地之后补两小堆余烬，收束这场戏
    setTimeout(() => addEmberHeaps(), 5200);
  }

  /* 两小堆余烬：不是亮起的红色，是刚从高温里冷下来的深灰，只有极弱的一点余温 */
  function addEmberHeaps() {
    if (!state.heapCenters || state.heapMesh) return;
    const heaps = new T.Group();
    heaps.name = 'family-ember-heaps';
    state.heapCenters.forEach((c, i) => {
      const geo = new T.SphereGeometry(0.10, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.5);
      geo.scale(1.25, 0.42, 1.1);
      const mat = new T.MeshStandardMaterial({
        color: 0x8e8a84,
        roughness: 0.95,
        metalness: 0.0,
        emissive: new T.Color(0x3a1e0c),
        emissiveIntensity: 0.55
      });
      const m = new T.Mesh(geo, mat);
      m.position.set(c.x, c.y, c.z);
      m.rotation.y = i * 1.7;
      heaps.add(m);
    });
    S.scene.add(heaps);
    state.heapMesh = heaps;

    // 余温在十几秒里冷下去
    Core.tween({
      from: 0.55, to: 0.06, dur: 9000, ease: Core.easeOutCubic,
      onUpdate: v => {
        heaps.children.forEach(m => { m.material.emissiveIntensity = v; });
      }
    });
  }

  // 汉白玉雪崩滑落细微晶体与粉尘声音
  function playAvalancheCrackle() {
    const ctx = S.audio;
    if (!ctx || !S.soundOn) return;
    try {
      const now = ctx.currentTime;
      const dur = 4.5;
      const buf = ctx.createBuffer(2, ctx.sampleRate * dur, ctx.sampleRate);
      const l = buf.getChannelData(0);
      const r = buf.getChannelData(1);

      for (let i = 0; i < buf.length; i++) {
        const timeSec = i / ctx.sampleRate;
        const decay = Math.exp(-timeSec * 0.8) * Math.min(1, timeSec * 3);
        // 密集微小晶体断裂颗粒
        let crack = 0;
        if (Math.random() < 0.08) {
          crack = (Math.random() * 2 - 1) * 0.45;
        }
        const white = (Math.random() * 2 - 1) * 0.15;
        l[i] = (crack + white) * decay;
        r[i] = (crack * 0.9 + (Math.random() * 2 - 1) * 0.15) * decay;
      }

      const src = ctx.createBufferSource();
      src.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(1800, now);
      bp.frequency.exponentialRampToValueAtTime(320, now + dur);
      bp.Q.value = 2.4;

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(0.45, now + 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, now + dur);

      src.connect(bp).connect(g).connect(ctx.destination);
      src.start();
    } catch (_) {}
  }

  function startClimaxSequence() {
    onWhiteHairTrigger();
  }

  function update(dt, t) {
    if (state.stoneInteractOpen) {
      const pulse = 1 + Math.sin(t * 3.2) * 0.035;
      shadowSheets.forEach(sheet => {
        if (!sheet.mesh || !sheet.mesh.material) return;
        sheet.mesh.scale.set(pulse, pulse, 1);
        sheet.mesh.material.color.setRGB(1.0, 0.82 + 0.12 * (0.5 + 0.5 * Math.sin(t * 3.2)), 0.55);
      });
    }
    if (state.ballActive && state.ballLightingGroup && state.ballLightingGroup.visible) {
      if (state.ballCorona) {
        state.ballCorona.material.uniforms.uTime.value = t;
        const scaleOsc = 1.0 + Math.sin(t * 8.0) * 0.06;
        state.ballCorona.scale.set(scaleOsc, scaleOsc, scaleOsc);
      }
      if (state.ballInnerSphere) {
        state.ballInnerSphere.rotation.y = t * 3.5;
        state.ballInnerSphere.rotation.x = t * 1.8;
      }
      if (state.ballLight) {
        state.ballLight.intensity = 2.4 + Math.sin(t * 14.0) * 0.6;
      }
    }

    if (state.whiteHairSprite && !state.whiteHairClicked) {
      const pulse = 0.21 + Math.sin(t * 1.7) * 0.022;
      state.whiteHairSprite.scale.set(pulse, pulse, 1);
      if (state.orbLight) {
        state.orbLight.intensity = 0.72 + Math.sin(t * 1.7) * 0.18;
      }
    }

    if (state.ashActive && state.ashParticles) {
      const pos = state.ashParticles.geometry.attributes.position;
      const vels = state.ashVelocities;
      const home = state.ashHome;
      const heaps = state.heapCenters || [];
      const floorY = 0.015;
      const rel = state.ashRel;
      state.ashT = (state.ashT || 0) + dt;

      for (let i = 0; i < pos.count; i++) {
        // 还没轮到剥落：先老实待在身体上，别一上来整块窗就下雪
        if (rel && rel[i] > state.ashT) continue;

        const yIdx = i * 3 + 1;
        let y = pos.array[yIdx] + vels[yIdx] * dt;

        // 落地后不再原地弹跳：被推着往自己的那一堆收拢，才堆得出两小堆余烬
        if (y < floorY) {
          const heap = heaps[home ? home[i] : 0] || null;
          if (heap) {
            const dx = heap.x - pos.array[i * 3];
            const dz = heap.z - pos.array[i * 3 + 2];
            const d = Math.hypot(dx, dz) || 0.0001;
            // 落地后往堆心爬：越靠外走得越快，逐帧收敛，最后堆成锥形
            pos.array[i * 3] += dx * 0.85 * dt;
            pos.array[i * 3 + 2] += dz * 0.85 * dt;
            // 堆心高、边缘低，才像一堆灰而不是一张贴纸
            y = floorY + Math.max(0, 0.16 - d) * 0.42 + Math.random() * 0.004;
          } else {
            y = floorY + Math.random() * 0.006;
          }
          vels[i * 3] *= 0.08;
          vels[i * 3 + 2] *= 0.08;
          vels[yIdx] = 0;
        } else {
          pos.array[i * 3] += vels[i * 3] * dt;
          pos.array[i * 3 + 2] += vels[i * 3 + 2] * dt;
          vels[yIdx] += 0.55 * dt;      // 灰很轻，但不能慢到像飘雪
        }
        pos.array[yIdx] = y;
      }
      pos.needsUpdate = true;
    }
  }

  /* 兼容旧入口：早期序章是用 window.setupClimax() 把双亲挂上去的。
     现在改由 window.ClimaxSystem（prologue.js:1422 处 init + setupParents）驱动，
     这里留着只是为了旧页面/总控台还在调它时不要 ReferenceError。 */
  function setupClimax() {
    if (!S || !S.scene) return false;
    if (shadowSheets.length) return true;
    setupParents();
    return shadowSheets.length > 0;
  }

  // Export setupClimax
  if (typeof window !== 'undefined') {
    window.setupClimax = setupClimax;
    // 驱动口：Mission Control 的远程指令和无头截图都要能把这段戏推起来
    // （不靠鼠标去点影子上那根白发）
    window.sceneClimaxDebug = {
      ready: () => shadowSheets.length > 0,
      start: () => onWhiteHairTrigger(),
      detonate: () => triggerNuclearDetonation(),
      avalanche: () => triggerAshAvalanche(),
      sheets: () => shadowSheets.map(s => ({ side: s.side, erode: s.erode, visible: s.mesh.visible })),
      /* 把剪影画布单独导出来看：3D 里它只有 100 多像素高，
         要判断"像不像两个坐着的人"必须看原尺寸 640×900。 */
      preview: (opts) => {
        opts = opts || {};
        const c = document.createElement('canvas');
        c.width = SHADOW_W;
        c.height = SHADOW_H;
        const ctx = c.getContext('2d');
        const sheet = {
          side: opts.side || 'mother',
          canvas: c, ctx, tex: null,
          marble: opts.marble || 0,
          erode: opts.erode || 0,
          hair: opts.hair !== false,
          seed: opts.seed || 1.3
        };
        repaintShadow(sheet);
        return c.toDataURL('image/png');
      },
      state: state
    };
  }

})();

