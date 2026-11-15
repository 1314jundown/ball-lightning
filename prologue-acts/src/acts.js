/* 序章 · 影子戏之后（试装版）
   ────────────────────────────────────────────────────────────
   段 3 影子戏（爸爸三个词 / 妈妈说 / 拔白发 / 指蜡烛）
   段 4 它来了（油画 → 穿墙 → 三下快门 → 悬停 → 伸手 → 白光）
   段 5 白光与灰（雕像 → 喊 → 触碰坍塌 → 两堆灰）
   段 6 房屋调查（木凳 → 书架 → 冰箱 → 背心 → 掌上机）
   段 7 结尾（雨停月出 → 朝阳 → 新生之夜）

   这一版所有"还缺图"的地方都用站位符画着（虚线框 + 小字标注），
   先把流程、节奏、镜头定死，图出来以后只换成贴图，不动版式。
   ──────────────────────────────────────────────────────────── */
(function () {
var LOWFX = (typeof location !== 'undefined' && /[?&]fx=low/.test(location.search));
  'use strict';

  var CV = document.getElementById('acts-canvas');
  var ctx = CV.getContext('2d');
  var WIDTH = 1600, HEIGHT = 900;
  var DPR = Math.min(2, window.devicePixelRatio || 1);

  /* Blender 蛋糕贴图（tools/bake-cake.mjs 烘出来的透明 PNG） */
  var CAKE = { img: null, ready: false, canvas: null };
  /* 前景贴图：把 PNG 丢进 assets/fg/ 就能换掉程序化画的前景 */
  var FG = { cup: null, chair: null, cupOk: false, chairOk: false };
  (function () {
    if (typeof Image === 'undefined') return;
    ['cup', 'chair'].forEach(function (k) {
      try {
        var im = new Image();
        im.onload = function () {
          if (im.naturalWidth <= 0) return;
          /* 椅背压成纯剪影：木色在暖墙上会和背景打架 */
          try {
            var c = document.createElement('canvas');
            c.width = im.naturalWidth; c.height = im.naturalHeight;
            var g3 = c.getContext('2d');
            g3.drawImage(im, 0, 0);
            g3.globalCompositeOperation = 'source-in';
            g3.fillStyle = '#140d08';
            g3.fillRect(0, 0, c.width, c.height);
            FG[k] = c; FG[k + 'Ok'] = true;
            if (k === 'cup') FG.cup = c;
          } catch (e3) { FG[k + 'Ok'] = true; }
        };
        im.src = 'assets/fg/' + k + '-a.png';
        FG[k] = im;
      } catch (e) {}
    });
  })();
  /* 桌面小件与前景：新给的剪影素材 */
  var PROPS = {};
  ['chair-front', 'cup-side', 'saucer-side', 'candle'].forEach(function (n) {
    try {
      var pm = new Image();
      pm.onload = function () {
        if (pm.naturalWidth <= 0) return;
        try {
          var cc = document.createElement('canvas');
          cc.width = pm.naturalWidth; cc.height = pm.naturalHeight;
          var gg = cc.getContext('2d');
          gg.drawImage(pm, 0, 0);
          gg.globalCompositeOperation = 'source-in';
          gg.fillStyle = '#100a06';
          gg.fillRect(0, 0, cc.width, cc.height);
          PROPS[n] = cc;
        } catch (eT) { PROPS[n] = pm; }
      };
      pm.src = 'assets/fg/' + n + '.png';
    } catch (eP) {}
  });

  try { CAKE.img = new Image(); } catch (eImg) { CAKE.img = null; }
  if (CAKE.img) CAKE.img.onload = function () {
    try {
      var w = CAKE.img.naturalWidth, h = CAKE.img.naturalHeight;
      var c = document.createElement('canvas');
      c.width = w; c.height = h;
      var g2 = c.getContext('2d');
      g2.drawImage(CAKE.img, 0, 0);
      g2.globalCompositeOperation = 'source-atop';
      g2.fillStyle = 'rgba(214,146,80,.72)';
      g2.fillRect(0, 0, w, h);
      g2.globalCompositeOperation = 'multiply';
      g2.fillStyle = 'rgba(168,110,58,.48)';
      g2.fillRect(0, 0, w, h);
      g2.globalCompositeOperation = 'destination-in';
      g2.drawImage(CAKE.img, 0, 0);
      g2.globalCompositeOperation = 'source-over';
      CAKE.canvas = c;
      CAKE.ready = true;
    } catch (e) { CAKE.ready = false; }
  };
  if (CAKE.img) CAKE.img.src = 'assets/cake-trial.png';

  /* ---------------------------------------------------------- 小工具 */
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function smooth(x, a, b) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function rr(c, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }
  function wrapText(c, text, maxW, font) {
    c.font = font;
    var lines = [], line = '';
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === '\n') { lines.push(line); line = ''; continue; }
      var t = line + ch;
      var noHead = '，。！？、；：）】」』”’…—';
      if (c.measureText(t).width > maxW && line) {
        /* 避头尾：标点不落行首，宁可让上一行多一个字 */
        if (noHead.indexOf(ch) >= 0) { lines.push(t); line = ''; }
        else { lines.push(line); line = ch; }
      } else line = t;
    }
    if (line) lines.push(line);
    return lines;
  }
  function blendPose(cur, tgt, k) {
    ['lean', 'sit', 'tilt', 'x'].forEach(function (f) {
      if (typeof tgt[f] === 'number') cur[f] = lerp(cur[f], tgt[f], k);
    });
    ['armL', 'armR'].forEach(function (f) {
      if (!tgt[f]) return;
      cur[f].a1 = lerp(cur[f].a1, tgt[f].a1, k);
      cur[f].a2 = lerp(cur[f].a2, tgt[f].a2, k);
    });
  }

  /* ---------------------------------------------------------- 画布尺寸 */
  var view = { s: 1, ox: 0, oy: 0 };
  var BASE = { a: 1, d: 1, e: 0, f: 0 };

  function resize() {
    var cw = window.innerWidth, ch = window.innerHeight;
    CV.width = Math.round(cw * DPR);
    CV.height = Math.round(ch * DPR);
    CV.style.width = cw + 'px';
    CV.style.height = ch + 'px';
    var s = Math.max(cw / WIDTH, ch / HEIGHT);
    view.s = s;
    view.ox = (cw - WIDTH * s) / 2;
    view.oy = (ch - HEIGHT * s) / 2;
    ctx.setTransform(DPR * s, 0, 0, DPR * s, DPR * view.ox, DPR * view.oy);
    BASE.a = DPR * s; BASE.d = DPR * s; BASE.e = DPR * view.ox; BASE.f = DPR * view.oy;
  }
  window.addEventListener('resize', resize);

  /* ---------------------------------------------------------- 声音 */
  var SND = {
    ctx: null, master: null, on: true, rainSrc: null, rainGain: null, humOsc: null, humGain: null, filmOn: false, filmSrc: null, filmGain: null, filmTimer: null,
    init: function () {
      if (this.ctx) return;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try { this.ctx = new AC(); } catch (e) { return; }
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.9;
      this.master.connect(this.ctx.destination);
      if (this.on) { try { SCORE.start(); } catch (e) {} }
    },
    noiseBuf: function (sec) {
      var n = Math.floor(this.ctx.sampleRate * sec);
      var b = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
      var d = b.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
      return b;
    },
    rain: function (level) {
      if (!this.ctx) return;
      var self = this;
      if (!this.rainSrc) {
        var b = this.noiseBuf(3);
        this.rainSrc = this.ctx.createBufferSource();
        this.rainSrc.buffer = b; this.rainSrc.loop = true;
        var bp = this.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 620; bp.Q.value = 0.9;
        var lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400;
        this.rainGain = this.ctx.createGain(); this.rainGain.gain.value = 0;
        this.rainSrc.connect(bp); bp.connect(lp); lp.connect(this.rainGain); this.rainGain.connect(this.master);
        this.rainSrc.start();
      }
      var now = this.ctx.currentTime;
      this.rainGain.gain.cancelScheduledValues(now);
      this.rainGain.gain.linearRampToValueAtTime(level * 0.055, now + 1.2);
      void self;
    },
    /* 胶片过片：底噪很低的一层呼呼，加每秒一下很轻的咔哒 */
    filmStart: function () {
      if (!this.ctx || this.filmOn) return;
      this.filmOn = true;
      var b = this.noiseBuf(2);
      var src = this.ctx.createBufferSource(); src.buffer = b; src.loop = true;
      var lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 320;
      var g = this.ctx.createGain(); g.gain.value = 0.0;
      src.connect(lp); lp.connect(g); g.connect(this.master);
      src.start();
      g.gain.linearRampToValueAtTime(0.028, this.ctx.currentTime + 1.5);
      this.filmGain = g; this.filmSrc = src;
      var self = this;
      if (typeof setInterval === 'function') this.filmTimer = setInterval(function () { self.filmClick(); }, 1000);
    },
    filmClick: function () {
      if (!this.ctx || !this.filmOn) return;
      var t0 = this.ctx.currentTime;
      var src = this.ctx.createBufferSource(); src.buffer = this.noiseBuf(0.05);
      var bp = this.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2200; bp.Q.value = 1.2;
      var g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.05, t0 + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.09);
      src.connect(bp); bp.connect(g); g.connect(this.master);
      src.start(t0); src.stop(t0 + 0.11);
    },
    filmStop: function () {
      if (!this.filmOn) return;
      this.filmOn = false;
      if (this.filmTimer && typeof clearInterval === 'function') { clearInterval(this.filmTimer); this.filmTimer = null; }
      if (this.filmGain && this.ctx) {
        var t0 = this.ctx.currentTime;
        this.filmGain.gain.cancelScheduledValues(t0);
        this.filmGain.gain.linearRampToValueAtTime(0, t0 + 0.8);
        var src = this.filmSrc;
        setTimeout(function () { try { src.stop(); } catch (e) {} }, 900);
        this.filmSrc = null; this.filmGain = null;
      }
    },
    /* 单反快门：两段机械声（反光镜抬起 / 帘幕落下），中间隔 55ms，带一点机身共鸣 */
    click: function (t, amp, hp, lp, osc, oscAmp, dur) {
      var c = this.ctx;
      var n = c.createBufferSource(); n.buffer = this.noiseBuf(0.12);
      var f1 = c.createBiquadFilter(); f1.type = 'highpass'; f1.frequency.value = hp;
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(amp, t + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      n.connect(f1);
      if (lp) { var f2 = c.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = lp; f1.connect(f2); f2.connect(g); }
      else f1.connect(g);
      g.connect(this.master);
      n.start(t); n.stop(t + dur + 0.02);
      var o = c.createOscillator(), og = c.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(osc, t);
      o.frequency.exponentialRampToValueAtTime(osc * 0.45, t + 0.035);
      og.gain.setValueAtTime(0.0001, t);
      og.gain.exponentialRampToValueAtTime(oscAmp, t + 0.002);
      og.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      o.connect(og); og.connect(this.master);
      o.start(t); o.stop(t + 0.06);
    },
    shutter: function (strength) {
      var k = strength === undefined ? 1 : strength;
      /* 采样优先：assets/audio/shutter.mp3（Sonilo 素材，需署名）。三只轮换，避免打断 */
      if (this._pool === undefined) {
        this._pool = [];
        var self0 = this;
        try {
          for (var pi = 0; pi < 3; pi++) {
            var au = new Audio('assets/audio/shutter.mp3');
            au.preload = 'auto';
            au.onerror = function () { self0._pool = null; };
            this._pool.push(au);
          }
        } catch (e) { this._pool = null; }
      }
      if (this._pool && this._pool.length) {
        var el = this._pool[this._pi++ % this._pool.length];
        try {
          el.pause(); el.currentTime = 0;
          el.volume = Math.min(1, 0.74 * k);
          el.playbackRate = 0.97 + Math.random() * 0.06;
          var pr = el.play(); if (pr && pr.catch) pr.catch(function () {});
          return;
        } catch (e2) {}
      }
      if (!this.ctx) return;
      var t0 = this.ctx.currentTime + 0.004;
      /* 反光镜抬起：脆、高、短 */
      this.click(t0, 0.30 * k, 2200, 0, 2400, 0.13 * k, 0.045);
      /* 帘幕落下：闷一点、低一点，55ms 后 */
      this.click(t0 + 0.055, 0.26 * k, 620, 2200, 720, 0.09 * k, 0.075);
      /* 机身共鸣：很短的一记低频 */
      var c = this.ctx, o = c.createOscillator(), g = c.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(150, t0);
      o.frequency.exponentialRampToValueAtTime(80, t0 + 0.12);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.10 * k, t0 + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
      o.connect(g); g.connect(this.master); o.start(t0); o.stop(t0 + 0.18);
    },
    boom: function () {
      if (!this.ctx) return;
      var t = this.ctx.currentTime;
      var o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(28, t + 1.6);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.55, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.9);
      o.connect(g); g.connect(this.master); o.start(t); o.stop(t + 2);
      var n = this.ctx.createBufferSource(); n.buffer = this.noiseBuf(1.2);
      var lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
      var ng = this.ctx.createGain(); ng.gain.setValueAtTime(0.35, t); ng.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
      n.connect(lp); lp.connect(ng); ng.connect(this.master); n.start(t); n.stop(t + 1.2);
    },
    hum: function (level) {
      if (!this.ctx) return;
      if (!this.humOsc) {
        this.humOsc = this.ctx.createOscillator();
        this.humOsc.type = 'sawtooth'; this.humOsc.frequency.value = 92;
        var lp2 = this.ctx.createBiquadFilter(); lp2.type = 'lowpass'; lp2.frequency.value = 320;
        this.humGain = this.ctx.createGain(); this.humGain.gain.value = 0;
        this.humOsc.connect(lp2); lp2.connect(this.humGain); this.humGain.connect(this.master);
        this.humOsc.start();
      }
      var now = this.ctx.currentTime;
      this.humGain.gain.cancelScheduledValues(now);
      this.humGain.gain.linearRampToValueAtTime(level * 0.05, now + 0.6);
    },
    /* 脚步：一声闷响，走进房间的那两下 */
    step: function () {
      if (!this.ctx) return;
      var t0 = this.ctx.currentTime;
      var src = this.ctx.createBufferSource(); src.buffer = this.noiseBuf(0.12);
      var lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 240;
      var g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.22, t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
      src.connect(lp); lp.connect(g); g.connect(this.master);
      src.start(t0); src.stop(t0 + 0.18);
    },
    /* 环境声：几层正弦 + 一层过滤噪声，按场景换音色 */
    ambStop: function () {
      if (!this.ambNodes) return;
      var t0 = this.ctx.currentTime;
      try {
        this.ambGain.gain.cancelScheduledValues(t0);
        this.ambGain.gain.setValueAtTime(this.ambGain.gain.value, t0);
        this.ambGain.gain.linearRampToValueAtTime(0.0001, t0 + 1.2);
        var ns = this.ambNodes;
        setTimeout(function () { ns.forEach(function (n) { try { n.stop(); } catch (e) {} }); }, 1400);
      } catch (e) {}
      this.ambNodes = null;
    },
    amb: function (kind) {
      if (!this.ctx || !this.master) return;
      if (this.ambKind === kind) return;
      this.ambStop();
      this.ambKind = kind;
      var t0 = this.ctx.currentTime;
      var g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(0.05, t0 + 2.4);
      g.connect(this.master);
      this.ambGain = g;
      var nodes = [];
      var vac = { shadow: [55, 82.5, 110], house: [41, 61.5], dawn: [98, 147, 196] }[kind] || [55, 82.5];
      for (var i = 0; i < vac.length; i++) {
        var o = this.ctx.createOscillator();
        o.type = kind === 'dawn' ? 'triangle' : 'sine';
        o.frequency.value = vac[i];
        var og = this.ctx.createGain();
        og.gain.value = (kind === 'dawn' ? 0.30 : 0.42) / (i + 1.4);
        var lfo = this.ctx.createOscillator();
        lfo.frequency.value = 0.05 + i * 0.037;
        var lg = this.ctx.createGain(); lg.gain.value = 0.16;
        lfo.connect(lg); lg.connect(og.gain);
        o.connect(og); og.connect(g);
        o.start(t0); lfo.start(t0);
        nodes.push(o); nodes.push(lfo);
      }
      var src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuf(4);
      src.loop = true;
      var bp = this.ctx.createBiquadFilter();
      bp.type = kind === 'dawn' ? 'highpass' : 'lowpass';
      bp.frequency.value = kind === 'dawn' ? 900 : 320;
      var ng = this.ctx.createGain(); ng.gain.value = kind === 'dawn' ? 0.05 : 0.10;
      src.connect(bp); bp.connect(ng); ng.connect(g);
      src.start(t0);
      nodes.push(src);
      this.ambNodes = nodes;
      window.__ambKind = kind;
    },    /* 高频哨：贴在球上，随可见度起落 */
    whistle: function (level) {
      if (!this.ctx) return;
      if (!this.whOsc) {
        this.whOsc = this.ctx.createOscillator();
        this.whOsc.type = 'sine'; this.whOsc.frequency.value = 2380;
        this.whGain = this.ctx.createGain(); this.whGain.gain.value = 0;
        this.whOsc.connect(this.whGain); this.whGain.connect(this.master);
        this.whOsc.start();
      }
      var now = this.ctx.currentTime;
      this.whGain.gain.cancelScheduledValues(now);
      this.whGain.gain.linearRampToValueAtTime(level * 0.012, now + 0.5);
      this.whOsc.frequency.setValueAtTime(2380 + Math.sin(now * 2.3) * 70, now);
    },
    /* 白光之后的耳鸣 */
    whine: function () {
      if (!this.ctx) return;
      var t0 = this.ctx.currentTime;
      var o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(5200, t0); o.frequency.linearRampToValueAtTime(4700, t0 + 4);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.045, t0 + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 4.2);
      o.connect(g); g.connect(this.master); o.start(t0); o.stop(t0 + 4.3);
    },
  };

  /* ---------------------------------------------------------- 世界状态 */
  var SIL = '#070504';
  var W = { fgChair: 0, cakeFg: 0,
    t: 0,
    mom: { x: 660, y: 604, s: 1.32, noLegs: true, flip: false, lean: 0, sit: 1, tilt: 0, armL: { a1: 6, a2: 22 }, armR: { a1: 8, a2: 18 } },
    dad: { x: 900, y: 604, s: 1.32, noLegs: true, flip: true, lean: 0, sit: 1, tilt: 0, armL: { a1: 6, a2: 22 }, armR: { a1: 8, a2: 18 } },
    ball: { x: 1116, y: 300, r: 0, vis: 0, stars: 0 },
    trail: [],
    painting: 1,
    marble: 0,
    ash: 0,
    candleGlow: 1,
    house: { kind: '', p: 0 },
    dawn: 0,
    rainLevel: 0.85,
    figures: 1
  };
  var TGT = {
    mom: { lean: 0, armL: { a1: 30, a2: 4 }, armR: { a1: 34, a2: 6 } },
    dad: { lean: 0, armL: { a1: 30, a2: 4 }, armR: { a1: 34, a2: 6 } },
    ball: { x: 1116, y: 300, r: 0, vis: 0 }
  };
  var parts = [];

  /* ---------------------------------------------------------- 人物 */
  function limb(x1, y1, x2, y2, w) {
    ctx.lineWidth = w;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  }

  function marblePaint() {
    var g = ctx.createLinearGradient(-40, -310, 70, 10);
    g.addColorStop(0, '#f9f3e7');
    g.addColorStop(0.32, '#e4dbc9');
    g.addColorStop(0.64, '#bcb2a1');
    g.addColorStop(1, '#7b7365');
    return g;
  }

  /* 人物剪影：用户给的两张图，屏幕坐标给，绘制时换算回场景坐标 */
  /* 材质层：墙皮 / 窗光 / 桌面暖光（从生成素材里裁出来的） */
  var TEX = {};
  ['walltex', 'winlight', 'floorglow', 'glowband', 'win2f'].forEach(function (n) {
    var im = new Image();
    im.onload = function () { TEX[n] = im; };
    im.src = 'assets/tex/' + n + '.png';
  });

var PEOPLE = {
  cfg: {
    mom: { x: 470, y: 214, w: 594, flip: false },
    dad: { x: 928, y: 196, w: 358, flip: false }
  },
  img: {}, dark: {}, pale: {}, poseImg: {}, posePale: {},
  headH: {},
  poseCfg: {
    momGrab:      { x: 470, y: 148, w: 600, flip: false },
    momGrabNear:  { x: 560, y: 120, w: 600, flip: false },
    momGrab2:     { x: 470, y: 220, w: 600, flip: false },
    momUp:        { x: 470, y: 218, w: 600, flip: false },
    momChin:      { x: 470, y: 220, w: 600, flip: false },
    dadShield:    { x: 830, y: 147, w: 552, flip: true },
    dadDrink:     { x: 830, y: 116, w: 552, flip: true },
    dadCup:       { x: 980, y: 99, w: 552, flip: true },
    dadPoint:     { x: 830, y: 163, w: 552, flip: true, s: 1.22 },
    dadThink:     { x: 830, y: 163, w: 552, flip: true, s: 1.38 },
    dadHold:      { x: 830, y: 159, w: 552, flip: true },
    dadLook:      { x: 830, y: 149, w: 552, flip: true },
    /* 新妈妈九张（assets/people/norm/momB-*.png，统一 1000 高） */
    momB_sit:     { x: 470, y: 218, w: 430, flip: false },
    momB_open:    { x: 470, y: 218, w: 430, flip: false },
    momB_think:   { x: 470, y: 218, w: 430, flip: false },
    momB_point:   { x: 470, y: 218, w: 430, flip: false },
    momB_fold:    { x: 470, y: 218, w: 430, flip: false },
    momB_face:    { x: 470, y: 218, w: 430, flip: false },
    momB_clasp:   { x: 470, y: 218, w: 430, flip: false },
    momB_open2:   { x: 470, y: 218, w: 430, flip: false },
    momB_grab:    { x: 470, y: 218, w: 430, flip: false },
    dadB_sit:     { x: 860, y: 218, w: 470, flip: false },
    dadB_drink:   { x: 860, y: 218, w: 470, flip: false },
    dadB_point:   { x: 860, y: 218, w: 470, flip: false },
    dadB_shield:  { x: 860, y: 218, w: 470, flip: false },
    dadB_hold:    { x: 860, y: 218, w: 470, flip: false }
  }
};

/* 量剪影的「头高」：从顶端往下，宽度第一次超过最大值 55% 的那行算肩线 */
function measureHead(im, key) {
  try {
    var sw = 160, sh = Math.max(1, Math.round(sw * im.naturalHeight / im.naturalWidth));
    var c = document.createElement('canvas'); c.width = sw; c.height = sh;
    var g = c.getContext('2d'); g.drawImage(im, 0, 0, sw, sh);
    var d = g.getImageData(0, 0, sw, sh).data;
    var rows = [], maxW = 0, y, x;
    for (y = 0; y < sh; y++) {
      var n = 0;
      for (x = 0; x < sw; x++) if (d[(y * sw + x) * 4 + 3] > 40) n++;
      rows.push(n); if (n > maxW) maxW = n;
    }
    var end = -1;
    for (y = 4; y < sh; y++) { if (rows[y] > maxW * 0.55) { end = y; break; } }
    if (end > 0) PEOPLE.headH[key] = end * (im.naturalHeight / sh);
  } catch (e) {}
}

(function () {
  if (typeof Image === "undefined") return;
  Object.keys(PEOPLE.cfg).forEach(function (k) {
    try {
      var im = new Image();
      im.onload = function () {
        if (!im.naturalWidth) return;
        PEOPLE.img[k] = im;
        measureHead(im, k);
        /* 石化版：把图的形状当蒙版，填一层大理石渐变 */
        var w = im.naturalWidth, h = im.naturalHeight;
        /* 受光版：填一层暖黑，剪影不至于像纯黑纸片 */
        var lc = document.createElement('canvas');
        lc.width = w; lc.height = h;
        var lg = lc.getContext('2d');
        lg.drawImage(im, 0, 0);
        lg.globalCompositeOperation = 'source-in';
        var lgr = lg.createLinearGradient(0, 0, 0, h);
        lgr.addColorStop(0, 'rgba(48,31,18,1)');
        lgr.addColorStop(0.55, 'rgba(30,19,11,1)');
        lgr.addColorStop(1, 'rgba(14,9,5,1)');
        lg.fillStyle = lgr; lg.fillRect(0, 0, w, h);
        PEOPLE.lit = PEOPLE.lit || {}; PEOPLE.lit[k] = lc;
        var c = document.createElement('canvas');
        c.width = w; c.height = h;
        var g2 = c.getContext('2d');
        g2.drawImage(im, 0, 0);
        g2.globalCompositeOperation = 'source-in';
        var gg = g2.createLinearGradient(0, 0, w, h);
        gg.addColorStop(0, 'rgba(248,245,238,1)');
        gg.addColorStop(0.45, 'rgba(224,219,208,1)');
        gg.addColorStop(1, 'rgba(166,161,152,1)');
        g2.fillStyle = gg;
        g2.fillRect(0, 0, w, h);
        crackify(c, 7 + k.length);
        PEOPLE.pale[k] = c;
      };
      im.src = 'assets/people/' + k + '.png';
    } catch (e) {}
  });


  /* ---- 噪声场与阈值蒙版：化灰/石化共用同一张场 ---- */
  var NOISE_FIELD = null;
  var NOISE_MASKS = [];
  function buildNoise() {
    try {
      var S = 256, c = document.createElement('canvas');
      c.width = c.height = S;
      var g = c.getContext('2d');
      var img = g.createImageData(S, S), d = img.data;
      function rnd(x, y) { var n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); }
      function vn(x, y) {
        var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
        var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
        var a = rnd(xi, yi), b = rnd(xi + 1, yi), c2 = rnd(xi, yi + 1), d2 = rnd(xi + 1, yi + 1);
        return a * (1 - u) * (1 - v) + b * u * (1 - v) + c2 * (1 - u) * v + d2 * u * v;
      }
      var field = new Float32Array(S * S);
      for (var y = 0; y < S; y++) {
        for (var x = 0; x < S; x++) {
          var f = 0, amp = 0.5, fr = 4;
          for (var o = 0; o < 4; o++) { f += amp * vn(x / S * fr, y / S * fr); amp *= 0.5; fr *= 2; }
          field[y * S + x] = Math.min(1, Math.max(0, f));
          var v = Math.round(Math.min(1, Math.max(0, f)) * 255);
          var i = (y * S + x) * 4; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255;
        }
      }
      g.putImageData(img, 0, 0);
      NOISE_FIELD = c;
      /* 9 档阈值蒙版：alpha=255 表示“保留” */
      NOISE_MASKS = [];
      for (var l = 1; l <= 9; l++) {
        var t = l / 10;
        var mc = document.createElement('canvas');
        mc.width = mc.height = S;
        var mg = mc.getContext('2d');
        var mi = mg.createImageData(S, S), md = mi.data;
        for (var k = 0; k < S * S; k++) {
          var q = k * 4;
          md[q] = md[q + 1] = md[q + 2] = 255;
          md[q + 3] = field[k] < t ? 255 : 0;
        }
        mg.putImageData(mi, 0, 0);
        NOISE_MASKS.push(mc);
      }
    } catch (e) { NOISE_FIELD = null; }
  }
  var FIG_SCRATCH = null;
  function figureMasked(src, w, h, t, invert) {
    try {
      var W0 = Math.max(2, Math.round(w)), H0 = Math.max(2, Math.round(h));
      if (!FIG_SCRATCH) { FIG_SCRATCH = document.createElement('canvas'); }
      if (FIG_SCRATCH.width !== W0 || FIG_SCRATCH.height !== H0) { FIG_SCRATCH.width = W0; FIG_SCRATCH.height = H0; }
      var g = FIG_SCRATCH.getContext('2d');
      g.clearRect(0, 0, W0, H0);
      g.globalCompositeOperation = 'source-over';
      g.drawImage(src, 0, 0, W0, H0);
      if (NOISE_MASKS.length) {
        var idx = Math.max(0, Math.min(8, Math.round(t * 9) - 1));
        g.globalCompositeOperation = 'destination-in';
        if (invert) {
          /* 反相：先铺满，再用“保留”蒙版抠掉 */
          g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
          g.globalCompositeOperation = 'destination-out';
          g.drawImage(NOISE_MASKS[idx], 0, 0, w, h);
        } else {
          g.drawImage(NOISE_MASKS[idx], 0, 0, w, h);
        }
      }
      g.globalCompositeOperation = 'source-over';
      return FIG_SCRATCH;
    } catch (e) { return src; }
  }
  try { window.__figureMasked = figureMasked; } catch (e) {}

  /* 预算模糊版：贴图只做一次的滤镜，别每帧做 */
  function bakeBlur(img, px) {
    try {
      var c = document.createElement('canvas');
      c.width = img.naturalWidth || img.width;
      c.height = img.naturalHeight || img.height;
      var g = c.getContext('2d');
      g.filter = 'blur(' + px + 'px)';
      g.drawImage(img, 0, 0, c.width, c.height);
      return c;
    } catch (e) { return null; }
  }

  /* 姿势变体：同一套扣图流程 */
  [['momGrab', 'mom-grab'], ['dadShield', 'dad-shield'],
   ['momGrab2', 'mom-grab2'], ['momUp', 'mom-up'], ['momChin', 'mom-chin'],
   ['dadDrink', 'dad-drink'], ['dadCup', 'dad-cup'], ['dadPoint', 'dad-point'],
   ['dadThink', 'dad-think'], ['dadHold', 'dad-hold'], ['dadLook', 'dad-lookup'],
   ['momB_sit', 'norm/momB-sit'], ['momB_open', 'norm/momB-open'], ['momB_think', 'norm/momB-think'],
   ['momB_point', 'norm/momB-point'], ['momB_fold', 'norm/momB-fold'], ['momB_face', 'norm/momB-face'],
   ['momB_clasp', 'norm/momB-clasp'], ['momB_open2', 'norm/momB-open2'], ['momB_grab', 'norm/momB-grab'],
   ['dadB_sit', 'norm/dadB-sit'], ['dadB_drink', 'norm/dadB-drink'], ['dadB_point', 'norm/dadB-point'],
   ['dadB_shield', 'norm/dadB-shield'], ['dadB_hold', 'norm/dadB-hold']
  ].forEach(function (pair) {
    try {
      var im2 = new Image();
      im2.onload = function () {
        if (!im2.naturalWidth) return;
        PEOPLE.poseImg[pair[0]] = im2;
        var w2 = im2.naturalWidth, h2 = im2.naturalHeight;
        var c2 = document.createElement('canvas');
        c2.width = w2; c2.height = h2;
        var g3 = c2.getContext('2d');
        g3.drawImage(im2, 0, 0);
        g3.globalCompositeOperation = 'source-in';
        var gg2 = g3.createLinearGradient(0, 0, w2, h2);
        gg2.addColorStop(0, 'rgba(182,177,166,1)');
        gg2.addColorStop(0.42, 'rgba(150,145,135,1)');
        gg2.addColorStop(1, 'rgba(96,92,85,1)');
        g3.fillStyle = gg2;
        g3.fillRect(0, 0, w2, h2);
        /* 体积感：上亮下暗一层，别让石头是块平涂 */
        g3.globalCompositeOperation = 'source-atop';
        var vg = g3.createLinearGradient(0, 0, w2 * 0.35, h2);
        vg.addColorStop(0, 'rgba(255,252,246,.22)');
        vg.addColorStop(0.5, 'rgba(0,0,0,0)');
        vg.addColorStop(1, 'rgba(0,0,0,.30)');
        g3.fillStyle = vg;
        g3.fillRect(0, 0, w2, h2);
        crackify(c2, 13 + pair[0].length * 3);
        matte(c2, 13 + pair[0].length * 3);
        PEOPLE.posePale[pair[0]] = c2;
      };
      im2.src = 'assets/people/' + pair[1] + '.png';
    } catch (e) {}
  });
})();

/* 在石化贴图上刻石纹：只在人物形状内生效 */

/* 哑光：石头不该有强烈渐变，靠细颗粒和“崩口”出质感 */
function matte(c, seed) {
  var g = c.getContext('2d');
  var w = c.width, h = c.height;
  var rnd = seed || 1;
  function r() { rnd = (rnd * 9301 + 49297) % 233280; return rnd / 233280; }
  g.save();
  g.globalCompositeOperation = 'source-atop';
  for (var i = 0; i < 900; i++) {
    var x = r() * w, y = r() * h, rr = 0.5 + r() * 1.6;
    var dark = r() < 0.55;
    g.fillStyle = dark ? 'rgba(70,64,56,' + (0.03 + r() * 0.07).toFixed(3) + ')'
                       : 'rgba(255,252,244,' + (0.02 + r() * 0.05).toFixed(3) + ')';
    g.beginPath(); g.arc(x, y, rr, 0, Math.PI * 2); g.fill();
  }
  /* 麻点：小面积 destination-out，形成风化的凹坑（不读像素，避免 canvas 被污染） */
  g.globalCompositeOperation = 'destination-out';
  for (var j = 0; j < 70; j++) {
    var ex = r() * w, ey = h * (0.05 + r() * 0.9), er = 0.7 + r() * 2.1;
    g.globalAlpha = 0.25 + r() * 0.5;
    g.beginPath(); g.arc(ex, ey, er, 0, Math.PI * 2); g.fill();
  }
  g.globalAlpha = 1;
  g.restore();
}

function crackify(c, seed) {
  var g = c.getContext('2d');
  var w = c.width, h = c.height;
  g.save();
  g.globalCompositeOperation = 'source-atop';
  g.lineCap = 'round';
  var rnd = seed || 1;
  function r() { rnd = (rnd * 9301 + 49297) % 233280; return rnd / 233280; }
  for (var i = 0; i < 7; i++) {
    var x0 = w * (0.2 + r() * 0.6), y0 = h * (0.12 + r() * 0.7);
    g.beginPath();
    g.moveTo(x0, y0);
    var x = x0, y = y0;
    for (var k = 0; k < 4; k++) {
      x += (r() - 0.5) * w * 0.16;
      y += h * (0.04 + r() * 0.07);
      g.lineTo(x, y);
    }
    g.strokeStyle = 'rgba(96,90,82,' + (0.20 + r() * 0.22).toFixed(2) + ')';
    g.lineWidth = 1 + r() * 1.4;
    g.stroke();
    g.strokeStyle = 'rgba(255,252,246,' + (0.16 + r() * 0.14).toFixed(2) + ')';
    g.lineWidth = 0.8;
    g.stroke();
  }
  g.restore();
}

function drawFigure(which, pale, alpha, pose) {
  var cfg = (pose && PEOPLE.poseCfg[pose]) || PEOPLE.cfg[which];
  /* 按拍覆盖：同一姿势在不同拍可以有不同的位置/大小 */
  var ovk = pose || which;
  var ov = G.beatPose && G.beat.beatPose;
  var bo = G.beatPose && G.beat ? (G.beatPose[G.beat.id] || {})[ovk] : null;
  if (bo) cfg = { x: bo.x, y: bo.y, w: bo.w, flip: bo.flip !== undefined ? bo.flip : cfg.flip, s: cfg.s };
  var imgKey = pose === 'momGrabNear' ? 'momGrab' : pose;
  var src = pose
    ? (pale ? PEOPLE.posePale[imgKey] : PEOPLE.poseImg[imgKey])
    : (pale ? PEOPLE.pale[which] : (PEOPLE.lit && PEOPLE.lit[which]) || PEOPLE.img[which]);
  if (!src) { person(which === 'mom' ? W.mom : W.dad, pale ? { marble: true } : null, alpha); return; }
  var iw = src.width, ih = src.height;
  var w = cfg.w, h = cfg.w * ih / iw;
  /* 按头高归一：不同剪影的头身比不一样，只按宽度缩会时大时小 */
  var hh = PEOPLE.headH[imgKey] || PEOPLE.headH[which];
  if (false && hh) {
    var target = which === 'mom' ? 96 : 110;
    var w2 = iw * (target / hh);
    if (w2 > cfg.w * 1.65) w2 = cfg.w * 1.65;
    if (w2 < cfg.w * 0.62) w2 = cfg.w * 0.62;
    w = w2; h = w2 * ih / iw;
  }
  var sc = cfg.s || 1;
  w *= sc; h *= sc;
  var figDY = 78;   /* 整体下挪：让胯/大腿落到桌沿以下，不然像悬空坐着 */
  ctx.save();
  ctx.setTransform(BASE.a, 0, 0, BASE.d, BASE.e, BASE.f);
  /* 人物是墙上的影子：跟着镜头推拉与摇移，否则像贴在屏幕上 */
  var camK = (G && G.cam && G.cam.z ? G.cam.z / 1.68 : 1);
  var camDX = (G && G.cam ? G.cam.x : 0);
  var camDY = (G && G.cam ? (G.cam.y - 70) : 0);
  ctx.translate(800 * (1 - camK) + camDX * camK, 450 * (1 - camK) + camDY * camK);
  ctx.scale(camK, camK);
  ctx.globalAlpha = alpha;
  /* 火苗偏，影子跟着偏一点点；不做整体缩放，否则像坐在摇摇马上 */
  var nowS = (typeof performance !== 'undefined' ? performance.now() : Date.now()) / 1000;
  var sig0 = flameSignal(nowS, 0.9);
  ctx.translate((sig0 - 0.5) * 2.4, (sig0 - 0.5) * 0.9);
  var diss = (G.beat && G.beat.id === 'collapse') ? clamp((G.bt - 1.05) / 0.95, 0, 1) : (G.dissolve || 0);
  function blitFig(x0, y0) {
    /* 石化生长：石头按噪声从低处先长，和化灰共用同一张场 */
    var _s = src;
    if (pale && W.marble < 0.999 && window.__figureMasked) {
      _s = window.__figureMasked(src, w, h, W.marble, false);
    }
    /* 坍塌：先矮下去、再往两侧塌，最后才碎成灰 */
    var ck = (G.beat && G.beat.id === 'collapse') ? clamp((G.bt - 0.55) / 0.95, 0, 1) : 0;
    var cw2 = w * (1 + 0.10 * ck), ch2 = h * (1 - 0.22 * ck);
    var cx2 = x0 - (cw2 - w) / 2, cy2 = y0 + (h - ch2);
    if (!(diss > 0.001)) { ctx.drawImage(_s, cx2, cy2, cw2, ch2); return; }
    /* 碎：整块往下沉、同时淡出，颗粒交给 spawnAsh —— 之前按横条剥落会剩几片浮在空中 */
    var sink = cy2 + ch2 * 0.16 * diss;
    ctx.globalAlpha = alpha * (1 - diss);
    ctx.drawImage(_s, cx2, sink, cw2, ch2);
    ctx.globalAlpha = alpha;
  }

  if (cfg.flip) {
    ctx.translate(cfg.x + w / 2, cfg.y + figDY);
    ctx.scale(-1, 1);
    blitFig(-w / 2, 0);
  } else {
    blitFig(cfg.x, cfg.y + figDY);
  }
  ctx.restore();
}

function person(p, opts, alpha) {
    var marble = !!(opts && opts.marble);
    var A = alpha == null ? 1 : alpha;
    ctx.save();
    ctx.globalAlpha = A;
    ctx.translate(p.x, p.y);
    ctx.scale((p.flip ? -1 : 1) * p.s, p.s);
    if (p.lean) ctx.rotate((p.flip ? -p.lean : p.lean) * Math.PI / 180);
    var C = SIL;
    if (marble) {
      var gg = ctx.createLinearGradient(p.flip ? -64 : 64, -228, p.flip ? 44 : -44, -34);
      gg.addColorStop(0, 'rgba(240,236,228,.96)');
      gg.addColorStop(0.42, 'rgba(214,209,199,.94)');
      gg.addColorStop(0.78, 'rgba(158,153,144,.96)');
      gg.addColorStop(1, 'rgba(112,108,101,.98)');
      C = gg;
    }
    ctx.fillStyle = C; ctx.strokeStyle = C;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    var sit = p.sit !== 0;
    var hip = { x: 2, y: -100 };
    var knee = sit ? { x: 72, y: -102 } : { x: 14, y: -52 };
    var ankle = sit ? { x: 80, y: -10 } : { x: 4, y: 0 };

    if (!p.noLegs) {
      /* 远侧腿 */
      ctx.globalAlpha = A * 0.8;
      limb(hip.x - 10, hip.y + 2, knee.x - 10, knee.y + 2, 42);
      limb(knee.x - 10, knee.y + 2, ankle.x - 10, ankle.y, 32);
      ctx.beginPath(); ctx.ellipse(ankle.x - 2, ankle.y, 18, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = A;

      /* 近侧腿 */
      limb(hip.x + 2, hip.y, knee.x + 2, knee.y, 46);
      limb(knee.x + 2, knee.y, ankle.x + 2, ankle.y, 34);
      ctx.beginPath(); ctx.ellipse(ankle.x + 10, ankle.y, 20, 9, 0, 0, Math.PI * 2); ctx.fill();
    }

    /* 躯干（侧面）：肩斜、背弧、腰收，下沿到臀底 */
    ctx.beginPath();
    ctx.moveTo(-24, -6);
    ctx.quadraticCurveTo(-30, -66, -26, -120);
    ctx.quadraticCurveTo(-24, -174, -17, -205);
    ctx.quadraticCurveTo(-8, -215, 3, -217);
    ctx.quadraticCurveTo(13, -207, 24, -206);
    ctx.quadraticCurveTo(31, -196, 32, -168);
    ctx.quadraticCurveTo(34, -132, 44, -112);
    ctx.quadraticCurveTo(36, -76, 26, -46);
    ctx.quadraticCurveTo(22, -24, 24, -6);
    ctx.closePath();
    ctx.fill();
    /* 大理石裂纹：三条细线，只在石化之后出现 */     if (marble) {       ctx.strokeStyle = 'rgba(118,112,104,.42)';       ctx.lineWidth = 0.9;       ctx.beginPath(); ctx.moveTo(2, -196); ctx.lineTo(8, -168); ctx.lineTo(2, -140); ctx.stroke();       ctx.strokeStyle = 'rgba(118,112,104,.30)';       ctx.beginPath(); ctx.moveTo(-10, -120); ctx.lineTo(-2, -96); ctx.lineTo(-8, -66); ctx.stroke();       ctx.beginPath(); ctx.moveTo(24, -150); ctx.lineTo(18, -128); ctx.stroke();     }

    /* 手臂：a1 自垂下起算（0 垂、90 向前、180 向上），a2 为肘弯 */
    function arm(a1, a2, w) {
      var S = { x: 6, y: -198 };
      var d1 = a1 * Math.PI / 180;
      var E = { x: S.x + Math.sin(d1) * 54, y: S.y + Math.cos(d1) * 54 };
      var d2 = d1 + a2 * Math.PI / 180;
      var H = { x: E.x + Math.sin(d2) * 52, y: E.y + Math.cos(d2) * 52 };
      limb(S.x, S.y, E.x, E.y, w);
      limb(E.x, E.y, H.x, H.y, w * 0.84);
      ctx.beginPath(); ctx.arc(H.x, H.y, w * 0.5, 0, Math.PI * 2); ctx.fill();
    }
    var far = p.flip ? p.armL : p.armR;
    var near = p.flip ? p.armR : p.armL;
    arm(far.a1, far.a2, 17);
    arm(near.a1, near.a2, 20);
    /* 脖子 */
    limb(9, -204, 11, -224, 19);

    /* 头：后脑厚、下巴收、鼻尖朝前 */
    ctx.beginPath(); ctx.arc(12, -244, 27, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(31, -257); ctx.lineTo(42, -247); ctx.lineTo(36, -237); ctx.lineTo(27, -240);
    ctx.closePath(); ctx.fill();


    /* 举起的手臂画在头之后，否则会被脑袋吃掉 */     if (near && near.a1 > 96) arm(near.a1, near.a2, 20);
    ctx.restore();
  }

  /* 雕像：大理石色 + 受光面 */
  function statue(p, alpha) {
    person(p, { marble: true }, alpha);
  }

  /* ---------------------------------------------------------- 球 */
  function drawBall(b, t) {
    if (b.vis <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = clamp(b.vis, 0, 1);
    var r = b.r;
    var seed = 0.37;

    /* 外面的光晕，不是正圆，边缘在抖 */
    var glow = ctx.createRadialGradient(b.x, b.y, r * 0.85, b.x, b.y, r * 3.2);
    glow.addColorStop(0, 'rgba(210,54,26,.20)');
    glow.addColorStop(0.34, 'rgba(150,26,14,.09)');
    glow.addColorStop(1, 'rgba(90,8,6,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(b.x, b.y, r * 3.2, 0, Math.PI * 2); ctx.fill();

    /* 本体：被扰动过的球面，边缘一圈圈往里陷 */
    function surface(k) {
      ctx.beginPath();
      for (var i = 0; i <= 64; i++) {
        var a = (i / 64) * Math.PI * 2;
        var kk = 1
          + 0.026 * Math.sin(a * 5 + t * 2.1 + seed)
          + 0.014 * Math.sin(a * 9 - t * 3.4)
          + 0.008 * Math.sin(a * 13 + t * 5.2);
        var x = b.x + Math.cos(a) * r * kk * k;
        var y = b.y + Math.sin(a) * r * kk * k;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }
    var core = ctx.createRadialGradient(b.x, b.y, r * 0.05, b.x, b.y, r);
    core.addColorStop(0, 'rgba(58,10,8,.94)');
    core.addColorStop(0.42, 'rgba(84,18,11,.94)');
    core.addColorStop(0.68, 'rgba(138,38,18,.90)');
    core.addColorStop(0.86, 'rgba(214,84,38,.74)');
    core.addColorStop(0.95, 'rgba(255,168,110,.46)');
    core.addColorStop(1, 'rgba(255,196,140,.10)');
    ctx.fillStyle = core;
    surface(1); ctx.fill();

    /* 表面那层流动的亮纹 */
    ctx.save();
    surface(1); ctx.clip();
    ctx.globalCompositeOperation = 'lighter';
    for (var s = 0; s < 3; s++) {
      var ang = t * (0.7 + s * 0.34) + s * 2.1;
      var g2 = ctx.createLinearGradient(b.x - r, b.y - r, b.x + r, b.y + r);
      g2.addColorStop(0, 'rgba(255,170,110,0)');
      g2.addColorStop(0.5, 'rgba(255,196,140,' + (0.16 - s * 0.04) + ')');
      g2.addColorStop(1, 'rgba(255,170,110,0)');
      ctx.fillStyle = g2;
      ctx.save();
      ctx.translate(b.x, b.y); ctx.rotate(ang); ctx.translate(-b.x, -b.y);
      ctx.fillRect(b.x - r, b.y - r, r * 2, r * 2);
      ctx.restore();
    }
    ctx.restore();

    /* 亮边：被烧出来的一圈毛刺光 */
    ctx.save();
    surface(1);
    ctx.strokeStyle = 'rgba(255,176,120,.22)';
    ctx.lineWidth = 0.9;
    ctx.shadowColor = 'rgba(255,110,54,.7)';
    ctx.shadowBlur = 18;
    ctx.stroke();
    ctx.restore();

    /* 内部蓝色小星星 */
    if (b.stars > 0) {
      ctx.globalAlpha = clamp(b.vis, 0, 1) * b.stars;
      for (var i = 0; i < 18; i++) {
        var a = i * 2.39996, rad = Math.sqrt((i + 1) / 18) * r * 0.86;
        var x = b.x + Math.cos(a + t * 0.5) * rad;
        var y = b.y + Math.sin(a + t * 0.5) * rad;
        var tw = 0.45 + 0.55 * Math.abs(Math.sin(t * 3 + i));
        ctx.fillStyle = 'rgba(128,196,255,' + (0.42 * tw) + ')';
        ctx.beginPath(); ctx.arc(x, y, 0.5 + tw * 0.9, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawTrail(t) {
    if (!W.trail.length) return;
    ctx.save();
    for (var i = 0; i < W.trail.length; i++) {
      var p = W.trail[i];
      var k = 1 - i / W.trail.length;
      ctx.globalAlpha = k * k * 0.16 * W.ball.vis;
      ctx.fillStyle = 'rgba(255,110,70,1)';
      ctx.beginPath(); ctx.arc(p.x, p.y, 1.5 + k * 2.4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  /* ---------------------------------------------------------- 两堆灰 */
  function drawAsh(t) {
    var a = clamp(W.ash, 0, 1.2);
    if (a <= 0.01) return;
    function pile(x, w) {
      var g = ctx.createLinearGradient(x - w, 676, x + w, 706);
      g.addColorStop(0, 'rgba(206,200,188,' + (0.85 * a) + ')');
      g.addColorStop(1, 'rgba(118,112,102,' + (0.55 * a) + ')');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(x - w, 706);
      ctx.quadraticCurveTo(x - w * 0.42, 706 - 26 * a, x, 706 - 30 * a);
      ctx.quadraticCurveTo(x + w * 0.42, 706 - 26 * a, x + w, 706);
      ctx.closePath();
      ctx.fill();
    }
    pile(640, 60);
    pile(962, 60);
    ctx.globalAlpha = 0.12 * a;
    ctx.fillStyle = 'rgba(214,208,196,1)';
    for (var i = 0; i < 26; i++) {
      var x = 590 + i * 15 + Math.sin(t * 0.7 + i) * 6;
      var y = 690 - ((t * 12 + i * 37) % 90);
      ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* ---------------------------------------------------------- 蛋糕与蜡烛 */
  /* 跟满屋子一样的东西：纯剪影，平放在桌面上，只有烛火是亮的 */
  function drawCake(t, o) {
    var cx = 800, base = 505;
    ctx.save();
    if (o) {
      ctx.translate(o.cx - 800, o.base - 543);
      ctx.scale(o.scale, o.scale);
      if (o.blur && !o.flamesOnly) ctx.filter = 'blur(' + o.blur + 'px)';
    }
    /* 接触阴影：让蛋糕压在桌面上，而不是浮在桌沿 */
    var cs = ctx.createRadialGradient(cx, base + 4, 10, cx, base + 4, 150);
    cs.addColorStop(0, 'rgba(0,0,0,.78)');
    cs.addColorStop(0.55, 'rgba(0,0,0,.34)');
    cs.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = cs;
    ctx.beginPath(); ctx.ellipse(cx, base + 2, 148, 9, 0, 0, Math.PI * 2); ctx.fill();
    var plate = '#050302', body = '#070504', rim = 'rgba(255,186,120,.30)';

    if (o && o.flamesOnly) { /* 只画火苗时跳过糕体 */ } else {
    /* 盘子：压扁的椭圆，只露出一圈边 */
    ctx.fillStyle = plate;
    ctx.beginPath(); ctx.ellipse(cx, base - 2, 104, 4.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,186,120,.18)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(cx, base - 4, 100, 3.4, 0, Math.PI * 1.10, Math.PI * 1.90); ctx.stroke();

    /* 下层 */
    ctx.fillStyle = body;
    rr(ctx, cx - 86, base - 48, 172, 46, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(255,186,120,.12)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(cx, base - 48, 86, 7, 0, Math.PI, Math.PI * 2); ctx.stroke();

    /* 上层 */
    ctx.fillStyle = body;
    rr(ctx, cx - 60, base - 86, 120, 42, 6); ctx.fill();
    ctx.strokeStyle = 'rgba(255,186,120,.12)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(cx, base - 86, 60, 5, 0, Math.PI, Math.PI * 2); ctx.stroke();

    /* 十支蜡烛：一排齐平，插在上层顶面 */
    }
    for (var j = 0; j < 10; j++) {
    var lit = (G.i === 0) ? Math.max(0, Math.min(1, (G.bt - 0.2 - j * 0.07) / 0.5)) : 1;
    if (lit <= 0.02) continue;
      var x = cx - 46 + j * (92 / 9);
      var h = 25 + (j % 3) * 0.9;
      ctx.fillStyle = '#0a0705';
      ctx.fillRect(x - 2.2, base - 86 - h, 4.4, h);
      ctx.fillStyle = 'rgba(255,196,132,.16)';
      ctx.fillRect(x + 1.4, base - 86 - h, 0.8, h);

      /* 蜡油：顺着杆子流下来的一小截，亮边 + 暗芯 */
      var waxL = 6 + ((j * 7) % 11);
      ctx.fillStyle = 'rgba(226,196,164,.20)';
      ctx.fillRect(x + 1.6, base - 86 - h + 3, 1.6, waxL);
      ctx.fillStyle = 'rgba(255,236,204,.30)';
      ctx.fillRect(x + 3.0, base - 86 - h + 3, 0.9, waxL - 2);

      ctx.globalAlpha = 0.25 + 0.75 * lit;
      var sig = flameSignal(t, j * 0.37);
      var fl = 0.80 + 0.40 * sig;
      var sway = (sig - 0.5) * 2.6;
      var fy = base - 86 - h - 5.2 * fl;
      var fg = ctx.createRadialGradient(x, fy, 0.4, x, fy, 12.5 * fl);
      fg.addColorStop(0, 'rgba(255,250,232,.66)');
      fg.addColorStop(0.28, 'rgba(255,188,108,.30)');
      fg.addColorStop(1, 'rgba(255,140,50,0)');
      ctx.fillStyle = fg;
      ctx.beginPath(); ctx.arc(x, fy, 12.5 * fl, 0, Math.PI * 2); ctx.fill();
      /* 焰心：下宽上尖的水滴，随火势拉长 */
      var fw = 2.3 * (0.85 + 0.3 * sig), fh = 7.6 * fl;
      ctx.fillStyle = 'rgba(255,246,218,.96)';
      ctx.beginPath();
      ctx.moveTo(x + sway * 1.4, fy - fh);
      ctx.quadraticCurveTo(x + fw + sway * 1.2, fy - fh * 0.35, x + fw * 0.86, fy + 1.9);
      ctx.quadraticCurveTo(x, fy + 3.0, x - fw * 0.86, fy + 1.9);
      ctx.quadraticCurveTo(x - fw + sway * 1.2, fy - fh * 0.35, x + sway * 1.4, fy - fh);
      ctx.fill();
      /* 焰底暖芯 */
      ctx.fillStyle = 'rgba(255,190,112,.55)';
      ctx.beginPath(); ctx.ellipse(x, fy + 2.1, 1.5, 1.2, 0, 0, Math.PI * 2); ctx.fill();
    }
      ctx.globalAlpha = 1;
    ctx.restore();
  }

  /* 火焰跳动：几个不成整数比的频率叠起来，避免"每两秒一次"的机械感。
     烛火的亮度和墙上影子的大小都读同一个信号，所以两者是同步的。 */
  function flameSignal(t, seed) {
    var a = Math.sin(t * 1.73 + seed * 1.1);
    var b = Math.sin(t * 4.31 + seed * 2.3);
    var c = Math.sin(t * 9.77 + seed * 3.7);
    var d = Math.sin(t * 0.61 + seed * 0.7);
    var v = 0.42 * a + 0.27 * b + 0.16 * c + 0.15 * d;
    return 0.5 + 0.5 * v;   /* 0..1 */
  }


  /* ---------------- 椅子（椅背横档）与吊灯 ---------------- */
  function drawChairBack(cx, cy, w, h, flip) {
    ctx.save();
    ctx.translate(cx, cy);
    if (flip) ctx.scale(-1, 1);
    ctx.fillStyle = 'rgba(9,6,4,.92)';
    /* 两根立柱 */
    rr(ctx, -w / 2, -h, w * 0.12, h, 5); ctx.fill();
    rr(ctx, w / 2 - w * 0.12, -h, w * 0.12, h, 5); ctx.fill();
    /* 四根横档，越往下越密 */
    for (var i = 0; i < 6; i++) {
      var yy = -h + 14 + i * (h - 30) / 5.6;
      rr(ctx, -w / 2 + w * 0.10, yy, w * 0.80, 5.2, 2.6); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(255,182,120,.13)'; ctx.lineWidth = 1.2;
    rr(ctx, -w / 2, -h, w, h, 5); ctx.stroke();
    /* 顶沿一点暖光 */
    ctx.fillStyle = 'rgba(255,186,124,.10)';
    rr(ctx, -w / 2 + 2, -h, w - 4, 3, 1.5); ctx.fill();
    ctx.restore();
  }

  var LAMP = { on: 1 };
  function drawLamp(t) {
    var sway = Math.sin(t * 0.61) * 1.4;
    var lx = 800 + sway, ly = 182;
    ctx.save();
    /* 线 */
    ctx.strokeStyle = 'rgba(6,4,3,.9)';
    ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(lx - sway * 0.4, 0); ctx.lineTo(lx, ly - 26); ctx.stroke();
    /* 灯罩：上窄下宽，下沿扇贝形 */
    ctx.fillStyle = 'rgba(10,7,5,.94)';
    ctx.beginPath();
    ctx.moveTo(lx - 14, ly - 30);
    ctx.lineTo(lx + 14, ly - 30);
    ctx.lineTo(lx + 76, ly + 30);
    var n = 7, span = 152 / n;
    for (var i = 0; i < n; i++) {
      var x0 = lx + 76 - i * span;
      ctx.quadraticCurveTo(x0 - span * 0.5, ly + 46, x0 - span, ly + 30);
    }
    ctx.lineTo(lx - 14, ly - 30);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,186,124,.22)'; ctx.lineWidth = 1.2; ctx.stroke();
    /* 罩口内侧的暖反光 */
    var lg = ctx.createLinearGradient(0, ly + 10, 0, ly + 40);
    lg.addColorStop(0, 'rgba(255,196,132,.10)');
    lg.addColorStop(1, 'rgba(255,150,80,.30)');
    ctx.fillStyle = lg;
    ctx.beginPath(); ctx.ellipse(lx, ly + 32, 64, 9, 0, 0, Math.PI * 2); ctx.fill();
    /* 灯下的光锥，让灯"亮着" */
    ctx.globalCompositeOperation = 'lighter';
    var cone = ctx.createLinearGradient(0, ly + 26, 0, 470);
    cone.addColorStop(0, 'rgba(255,196,132,.10)');
    cone.addColorStop(1, 'rgba(255,170,100,0)');
    ctx.fillStyle = cone;
    ctx.beginPath();
    ctx.moveTo(lx - 58, ly + 32); ctx.lineTo(lx + 58, ly + 32);
    ctx.lineTo(lx + 170, 560); ctx.lineTo(lx - 170, 560);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  /* 墙上那幅画：真图优先，加载失败回落到程序化笔触 */
  var PAINT = { img: null, ok: false };
  (function () {
    if (typeof Image === 'undefined') return;
    try {
      var im = new Image();
      im.onload = function () { if (im.naturalWidth > 0) PAINT.ok = true; };
      im.src = 'assets/painting-frame.png';
      PAINT.img = im;
    } catch (e) {}
  })();

  function drawPainting(t) {
    if (W.painting <= 0.01) return;
    var a = W.painting;
    var x = 646, y = 128, w = 208, h = 146;
    ctx.save();
    ctx.globalAlpha = a;

    /* 有真图：整幅（自带金框）贴上去，按 cover 裁到画幅 */
    if (PAINT.ok) {
      var iw = PAINT.img.naturalWidth || 708, ih = PAINT.img.naturalHeight || 470;
      /* 透明底的画框整张贴：边角是画框自己的形状，不再切成长方形 */
      var bw = w + 26, bh = bw * (ih / iw);
      var bx = x - 13, by = y + (h - bh) / 2 + 2;
      /* 先给墙上一层很淡的投影，画框才像挂上去的 */
      ctx.save();
      ctx.globalAlpha = a * 0.26;
      ctx.filter = 'brightness(0) blur(7px)';
      ctx.drawImage(PAINT.img, 0, 0, iw, ih, bx + 2, by + 4, bw, bh);
      ctx.restore();
      ctx.globalAlpha = a;
      ctx.drawImage(PAINT.img, 0, 0, iw, ih, bx, by, bw, bh);
      ctx.restore();
      return;
    }

    /* 画框：深木 + 内圈金线 + 一道受光的高光边 */
    ctx.fillStyle = '#1b110a';
    ctx.fillRect(x - 16, y - 16, w + 32, h + 32);
    ctx.strokeStyle = 'rgba(196,158,102,.30)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x - 13, y - 13, w + 26, h + 26);
    ctx.fillStyle = '#2a1a10';
    ctx.fillRect(x - 9, y - 9, w + 18, h + 18);
    ctx.strokeStyle = 'rgba(226,186,122,.62)';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 5, y - 5, w + 10, h + 10);

    /* 画布：暗赭底，右上暖、左下更暗 */
    var bg = ctx.createLinearGradient(x, y, x + w * 0.85, y + h);
    bg.addColorStop(0, '#6b4522');
    bg.addColorStop(0.42, '#4a2c14');
    bg.addColorStop(1, '#20120a');
    ctx.fillStyle = bg;
    ctx.fillRect(x, y, w, h);

    /* 一层酒红与金色的笔触，打得乱一点才像油画 */
    var rnd = function (i) { return Math.abs(Math.sin(i * 12.9898 + 4.1414) * 43758.5453) % 1; };
    for (var i = 0; i < 26; i++) {
      var rx = x + rnd(i) * w, ry = y + rnd(i + 99) * h;
      var rw = 26 + rnd(i + 7) * 74, rh = 6 + rnd(i + 13) * 16;
      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(rnd(i + 21) * 0.6 - 0.3);
      ctx.fillStyle = i % 3 === 0
        ? 'rgba(138,44,30,' + (0.10 + rnd(i + 5) * 0.13) + ')'
        : (i % 3 === 1
          ? 'rgba(198,150,84,' + (0.06 + rnd(i + 8) * 0.10) + ')'
          : 'rgba(30,16,10,' + (0.10 + rnd(i + 3) * 0.16) + ')');
      ctx.beginPath(); ctx.ellipse(0, 0, rw, rh, 0, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    /* 人物：一群躺着、坐着、举杯的剪影，越远越淡 */
    function figure(fx, fy, fs, lean, alpha) {
      ctx.save();
      ctx.globalAlpha = a * alpha;
      ctx.translate(fx, fy);
      ctx.rotate(lean);
      ctx.scale(fs, fs);
      ctx.fillStyle = 'rgba(18,10,7,.92)';
      /* 躯干 */
      ctx.beginPath(); ctx.ellipse(0, 0, 13, 22, 0, 0, Math.PI * 2); ctx.fill();
      /* 头 */
      ctx.beginPath(); ctx.arc(2, -26, 7.5, 0, Math.PI * 2); ctx.fill();
      /* 腿 */
      ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(18,10,7,.92)'; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-4, 16); ctx.lineTo(-20, 34); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(5, 16); ctx.lineTo(18, 36); ctx.stroke();
      /* 举杯的手臂 */
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(6, -14); ctx.lineTo(20, -30); ctx.stroke();
      ctx.fillStyle = 'rgba(226,186,122,.55)';
      ctx.beginPath(); ctx.arc(21, -31, 2.6, 0, Math.PI * 2); ctx.fill();
      /* 轮廓上的一点暖光 */
      ctx.strokeStyle = 'rgba(240,196,132,.22)';
      ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.arc(2, -26, 8.1, -2.6, -1.1); ctx.stroke();
      ctx.restore();
    }
    figure(x + 62, y + 132, 1.05, -0.10, 0.72);
    figure(x + 112, y + 118, 0.95, -0.04, 0.66);
    figure(x + 168, y + 136, 1.12, 0.08, 0.78);
    figure(x + 212, y + 120, 0.88, 0.02, 0.60);
    figure(x + 246, y + 150, 0.95, 0.14, 0.70);

    /* 前景正中一个躺着的主角，占掉下半幅 */
    ctx.save();
    ctx.globalAlpha = a * 0.95;
    ctx.fillStyle = 'rgba(14,8,6,.95)';
    ctx.beginPath(); ctx.ellipse(x + w * 0.46, y + h * 0.80, 62, 20, -0.12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + w * 0.24, y + h * 0.72, 13, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(240,196,132,.20)';
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.ellipse(x + w * 0.46, y + h * 0.76, 62, 20, -0.12, Math.PI * 1.05, Math.PI * 1.85); ctx.stroke();
    ctx.restore();

    /* 烛光点：几粒金色的火 */
    for (var c2 = 0; c2 < 5; c2++) {
      var cx3 = x + 40 + c2 * 52 + Math.sin(c2 * 3.7) * 12;
      var cy3 = y + 46 + Math.cos(c2 * 2.3) * 14;
      var fg = ctx.createRadialGradient(cx3, cy3, 0.5, cx3, cy3, 14);
      fg.addColorStop(0, 'rgba(255,226,170,.55)');
      fg.addColorStop(1, 'rgba(255,170,80,0)');
      ctx.fillStyle = fg;
      ctx.beginPath(); ctx.arc(cx3, cy3, 14, 0, Math.PI * 2); ctx.fill();
    }

    /* 画布暗角 + 一层薄光，让它像「挂在墙上被烛光照着」 */
    var vg = ctx.createRadialGradient(x + w * 0.5, y + h * 0.45, h * 0.3, x + w * 0.5, y + h * 0.5, h * 1.15);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,.66)');
    ctx.fillStyle = vg;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(255,214,160,.05)';
    ctx.fillRect(x, y, w, h * 0.45);

    ctx.restore();
    void t;
  }

  /* ---------------------------------------------------------- 段 3 / 5：影子 */

  /* 桌上的一只小碟：只为了桌面不空，暗到几乎看不见 */
  function drawSaucer(t) {
    ctx.save();
    ctx.globalAlpha = 0.9;
    var sx = 1024, sy = 600;
    var sg = ctx.createRadialGradient(sx, sy, 2, sx, sy, 46);
    sg.addColorStop(0, 'rgba(28,18,11,1)');
    sg.addColorStop(0.7, 'rgba(18,11,7,1)');
    sg.addColorStop(1, 'rgba(12,7,4,0)');
    ctx.fillStyle = sg;
    ctx.beginPath(); ctx.ellipse(sx, sy, 44, 9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,190,128,.14)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(sx, sy - 1, 40, 7.6, 0, Math.PI * 1.06, Math.PI * 1.94); ctx.stroke();
    ctx.restore();
  }

  /* ---------------- 墙：旧痕、竖纹、窗光 ---------------- */
  var WALL = null;
  function seed(seed) { var x = Math.sin(seed * 127.1) * 43758.5453; return x - Math.floor(x); }
  function drawWallTexture(t) {
    if (!WALL) {
      WALL = [];
      for (var i = 0; i < 34; i++) {
        WALL.push({ x: seed(i * 3.1) * WIDTH, w: 0.8 + seed(i * 7.7) * 2.6, a: 0.018 + seed(i * 1.9) * 0.030, k: seed(i * 5.3) * 6.28, amp: 6 + seed(i * 2.2) * 22 });
      }
    }
    ctx.save();
    /* 竖向的老痕：极淡，只在暗处可见 */
    for (var i = 0; i < WALL.length; i++) {
      var w = WALL[i];
      var x = w.x + Math.sin(t * 0.05 + w.k) * w.amp;
      ctx.globalAlpha = w.a;
      ctx.fillStyle = 'rgba(12,7,4,1)';
      ctx.fillRect(x, 0, w.w, HEIGHT);
    }
    /* 斑驳：几团非常淡的脏 */
    for (var j = 0; j < 7; j++) {
      var sx = seed(j * 9.7) * WIDTH, sy = 80 + seed(j * 4.3) * 560;
      var rr = 120 + seed(j * 2.7) * 260;
      var gg = ctx.createRadialGradient(sx, sy, 0, sx, sy, rr);
      gg.addColorStop(0, 'rgba(10,6,3,.05)');
      gg.addColorStop(1, 'rgba(10,6,3,0)');
      ctx.fillStyle = gg;
      ctx.beginPath(); ctx.arc(sx, sy, rr, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  /* 窗外透进来的一点冷光 + 偶尔的闪电（不出现窗本身） */
  function drawWindowLight(t) {
    var flick = 0;
    var slot = Math.floor(t / 9.3), ph = (t / 9.3) - slot;
    if (ph > 0.62 && ph < 0.70) flick = 0.55 + 0.45 * Math.sin((ph - 0.62) * 140);
    else if (ph > 0.72 && ph < 0.78) flick = 0.30;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    var gg = ctx.createRadialGradient(300, 300, 20, 300, 300, 430);
    gg.addColorStop(0, 'rgba(150,186,214,' + (0.028 + 0.075 * flick).toFixed(3) + ')');
    gg.addColorStop(0.55, 'rgba(130,168,204,' + (0.012 + 0.030 * flick).toFixed(3) + ')');
    gg.addColorStop(1, 'rgba(120,160,196,0)');
    ctx.fillStyle = gg;
    ctx.beginPath(); ctx.ellipse(300, 300, 430, 380, -0.35, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  /* 多层视差：d=1 是基准层，越近（d>1）推镜时长得越快、摇镜时移得越多 */
  function layerDepth(d, fn, blurPx) {
    if (!G || !G.cam) { fn(); return; }
    var z = G.cam.z || 1.68;
    var k = 1 + (z - 1) * (d - 1);
    var px = (G.cam.x || 0) * (d - 1);
    var py = ((G.cam.y || 0) - 70) * (d - 1);
    ctx.save();
    ctx.translate(800 + px, 450 + py);
    ctx.scale(k, k);
    ctx.translate(-800, -450);
    if (blurPx) ctx.filter = 'blur(' + blurPx + 'px)';
    fn();
    ctx.restore();
  }

  /* 桌面上摆位：按镜头换算，让它跟桌子在同一个平面（不随镜头浮起来） */
  /* 桌面线在屏幕上的位置：跟着镜头走，摆件据此贴桌 */
  function tableY() {
    var z = (G.cam && G.cam.z) || 1.68;
    var k = z / 1.68;
    var py = ((G.cam && G.cam.y) || 70) - 70;
    return 450 + (700 - 450) * k + py * k;
  }
  function onTable(x, baseY, w, h) {
    var ty = tableY();
    return { x: x, y: ty + (baseY - 700) - h, w: w, h: h };
  }


  /* 静态墙层：烘一次，之后每帧只 drawImage */
  var BAKED_WALL = null;
  var BOTTOM_VIG = null;
  function bakeWall() {
    try {
      var c = document.createElement('canvas');
      c.width = WIDTH; c.height = HEIGHT;
      var g2 = c.getContext('2d');
      var gg = g2.createRadialGradient(800, 460, 60, 800, 460, 1150);
      gg.addColorStop(0, '#5e4028');
      gg.addColorStop(0.42, '#3d2919');
      gg.addColorStop(0.75, '#1d130c');
      gg.addColorStop(1, '#080504');
      g2.fillStyle = gg;
      g2.fillRect(0, 0, WIDTH, HEIGHT);
      if (!LOWFX && TEX.walltex && (TEX.walltex.naturalWidth || TEX.walltex.width)) {
        g2.save();
        g2.globalCompositeOperation = 'overlay';
        g2.globalAlpha = 0.38;
        g2.drawImage(TEX.walltex, -60, -40, WIDTH + 120, HEIGHT + 80);
        g2.restore();
      }
      BAKED_WALL = c;
    } catch (e) {}
  }

  function drawShadowScene(t) {
    /* 墙 + 墙皮：整场不变，烘成一张图，每帧只贴 */
    if (BAKED_WALL) { ctx.drawImage(BAKED_WALL, 0, 0); }

    /* 灯罩在墙上投出的光斑 */
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    var pool = ctx.createRadialGradient(800, 430, 24, 800, 430, 640);
    pool.addColorStop(0, 'rgba(255,198,134,.20)');
    pool.addColorStop(0.55, 'rgba(238,162,94,.06)');
    pool.addColorStop(1, 'rgba(238,162,94,0)');
    ctx.fillStyle = pool;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.restore();

    drawWallTexture(t);

    /* 窗光：screen 一层（暗部不动，亮部加光） */
    if (TEX.win2 && TEX.win2f) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.50;
      ctx.translate(250, 300); ctx.rotate(-0.10); ctx.translate(-250, -300);
      ctx.drawImage(TEX.win2f, -150, 70, 740, 512);
      ctx.restore();
    }

    drawWindowLight(t);
    drawSaucer(t);

    /* 壁上油画与挂钟（比墙稍慢一层，推镜时不会一起长大） */
    layerDepth(0.90, function () {
      drawPainting(t);
      drawClock(t);
    }, 1.5);

    /* 两个影子：轻微模糊，像墙上的投影 */
    if (W.figures > 0.01) {
      ctx.save();
      var sigB = flameSignal(t, 0.9);
      var softM = 1.05 + 1.15 * (1 - sigB);
      softM *= (1 - 0.72 * clamp(W.marble, 0, 1));
      /* 逐帧对整幅人物做 blur 太贵，改由边缘本身承担（softM 仅保留给石化收硬用） */
      var bid = (G.beat && G.beat.id) || '';
      var momPose = null, dadPose = null;
      var MOM_POSE = {
        'mom-grab': 'momGrab2', 'fear': 'momGrabNear', 'statue': 'momGrabNear',
        'hover': 'momGrabNear', 'reach': 'momGrabNear',
        'call': 'momGrabNear', 'touch': 'momGrabNear', 'collapse': 'momGrabNear',
        'mom-snark': 'momUp', 'mom-angry': 'momUp', 'mom-idealist': 'momChin',
        'philosophers': 'momChin'
      };
      var DAD_POSE = {
        'dad-opening': 'dadDrink', 'dad-not-small': 'dadCup', 'dad-mind': 'dadCup',
        'hair-1': 'dadHold', 'hair-2': 'dadHold', 'hair-3': 'dadLook',
        'dad-candles': 'dadPoint', 'silent': 'dadThink', 'philosophers': 'dadThink',
        'ball-in': 'dadLook', 'hover': 'dadShield', 'reach': 'dadShield',
        'statue': 'dadShield', 'call': 'dadShield', 'touch': 'dadShield', 'collapse': 'dadShield'
      };
      momPose = MOM_POSE[bid] || null;
      dadPose = DAD_POSE[bid] || null;
      var _bk = G.beatPoseKey && bid ? G.beatPoseKey[bid] : null;
      if (_bk) { if (_bk.mom) momPose = _bk.mom; if (_bk.dad) dadPose = _bk.dad; }
      if (bid === 'mom-grab') {
        /* 三下快门之前，先接住上一拍（ball-in）的仰头姿态，别一进来就坐回去 */
        momPose = (G.shotK === -1) ? 'momUp' : (G.shotK === 0 ? 'momGrab' : 'momGrabNear');
        dadPose = (G.shotK === -1) ? 'dadLook' : 'dadShield';
      }
      /* 球的光照：它悬在那儿，暖光在墙上摊开一小块 */
      if (W.ball && W.ball.vis > 0.01) {
        var bl = ctx.createRadialGradient(W.ball.x, W.ball.y, 4, W.ball.x, W.ball.y, 240);
        bl.addColorStop(0, 'rgba(255,150,86,' + (0.16 * W.ball.vis).toFixed(3) + ')');
        bl.addColorStop(0.45, 'rgba(220,96,60,' + (0.07 * W.ball.vis).toFixed(3) + ')');
        bl.addColorStop(1, 'rgba(200,70,40,0)');
        ctx.fillStyle = bl;
        ctx.beginPath(); ctx.arc(W.ball.x, W.ball.y, 240, 0, Math.PI * 2); ctx.fill();
      }
      /* 先画黑影，再把"石色"一层层盖上去：石化是变色，不是变淡 */
      if (!G.hideParents) {
        drawFigure('mom', false, 0.95 * W.figures, momPose);
        drawFigure('dad', false, 0.95 * W.figures, dadPose);
      }
      if (W.marble > 0.02) {
        var mk = clamp(W.marble, 0, 1);
        var ma = Math.pow(mk, 0.85) * 0.93 * W.figures;
        /* 生长中的石边：先垫一层暖色微光，像石头还带着热度 */
        if (mk < 0.999) {
          var glow = Math.sin(Math.PI * mk) * 0.5;
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.filter = 'blur(5px)';
          drawFigure('mom', true, glow * 0.55, momPose);
          drawFigure('dad', true, glow * 0.55, dadPose);
          ctx.filter = 'none';
          ctx.restore();
        }
        drawFigure('mom', true, ma, momPose);
        drawFigure('dad', true, ma, dadPose);
      }
      ctx.restore();
    }

    /* 两堆灰 */
    drawAsh(t);

    /* 桌子（前景）：不是一条线，是一块往前铺开的桌面，带木纹与烛光衰减 */
    var farY = 503, nearY = 900;
    var surf = ctx.createLinearGradient(0, farY, 0, nearY);
    surf.addColorStop(0, '#3a2413');
    surf.addColorStop(0.14, '#2a1a0e');
    surf.addColorStop(0.45, '#1d120a');
    surf.addColorStop(0.78, '#120b06');
    surf.addColorStop(1, '#0a0603');
    ctx.beginPath();
    ctx.moveTo(-300, farY);
    ctx.lineTo(WIDTH + 300, farY);
    ctx.lineTo(WIDTH + 400, nearY);
    ctx.lineTo(-400, nearY);
    ctx.closePath();
    ctx.fillStyle = surf;
    ctx.fill();

    /* 桌子的近沿：一道有厚度的边，才看得出平面往观众这边伸过来 */
    var lipY = 768;
    ctx.fillStyle = '#0b0603';
    ctx.fillRect(0, lipY, WIDTH, HEIGHT - lipY);
    ctx.fillStyle = 'rgba(150,96,52,.55)';
    ctx.fillRect(0, lipY - 4, WIDTH, 4);
    ctx.fillStyle = 'rgba(255,186,120,.22)';
    ctx.fillRect(0, lipY - 5, WIDTH, 1.6);
    /* 前景遮挡：左边门框的暗部 */
    var dl = ctx.createLinearGradient(0, 0, 150, 0);
    dl.addColorStop(0, 'rgba(3,2,1,.96)');
    dl.addColorStop(1, 'rgba(3,2,1,0)');
    ctx.fillStyle = dl;
    ctx.fillRect(0, 0, 150, 470);
    var dr = ctx.createLinearGradient(WIDTH, 0, WIDTH - 120, 0);
    dr.addColorStop(0, 'rgba(3,2,1,.92)');
    dr.addColorStop(1, 'rgba(3,2,1,0)');
    ctx.fillStyle = dr;
    ctx.fillRect(WIDTH - 120, 0, 120, 470);

    /* 桌沿下方一道暗带：桌面自己的厚度，给纵深 */
    var lipShadow = ctx.createLinearGradient(0, farY + 2, 0, farY + 34);
    lipShadow.addColorStop(0, 'rgba(0,0,0,.55)');
    lipShadow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = lipShadow;
    ctx.fillRect(0, farY + 2, WIDTH, 32);

    /* 木纹：从远处的桌沿向观众散开 */
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-300, farY);
    ctx.lineTo(WIDTH + 300, farY);
    ctx.lineTo(WIDTH + 400, nearY);
    ctx.lineTo(-400, nearY);
    ctx.closePath();
    ctx.clip();
    for (var wi = 0; wi < 26; wi++) {
      var f0 = -80 + wi * 68;
      var f1 = -520 + wi * 118;
      ctx.strokeStyle = 'rgba(126,82,44,' + (0.0) + ')';
      ctx.lineWidth = 0.8 + (wi % 4) * 0.5;
      ctx.beginPath();
      ctx.moveTo(f0, farY);
      ctx.quadraticCurveTo(f0 + 12, 700, f1, nearY);
      ctx.stroke();
    }
    /* 桌面远端的反光边 */
    ctx.strokeStyle = 'rgba(255,178,104,.16)';
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(-300, farY + 1); ctx.lineTo(WIDTH + 300, farY + 1); ctx.stroke();
    /* 烛光在木头上摊开的一片暖 */
    var tg = ctx.createRadialGradient(800, farY + 14, 10, 800, farY + 14, 620);
    tg.addColorStop(0, 'rgba(255,164,84,.26)');
    tg.addColorStop(0.28, 'rgba(208,118,54,.10)');
    tg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = tg;
    ctx.fillRect(0, farY, WIDTH, nearY - farY);

    ctx.restore();
  /* 蛋糕与 14 支蜡烛 */
    var cm2 = G.cam || G.camT || { x: 0, y: 0, z: 1 };
    drawCake(t);

    /* 球 */
    drawTrail(t);
    drawBall(W.ball, t);

    /* 整片转红：球现身那几秒，画面只剩红与黑 */
    if (G.red > 0.01) {
      ctx.save();
      ctx.globalCompositeOperation = 'color';
      ctx.fillStyle = 'rgba(142,18,10,' + clamp(G.red, 0, 1).toFixed(3) + ')';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.restore();
    }
  }

  /* ---------------------------------------------------------- 段 6：屋子 */

  /* 房屋五段的“光”：一束从右侧斜下打进来的暖光 + 浮尘 + 暗角 */
  function drawHouseLight(kind, p, t) {
    /* 光锥 */
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.filter = 'blur(34px)';
    var cone = ctx.createLinearGradient(1180, -40, 620, 720);
    cone.addColorStop(0, 'rgba(255,196,128,.20)');
    cone.addColorStop(0.55, 'rgba(255,180,110,.06)');
    cone.addColorStop(1, 'rgba(255,170,100,0)');
    ctx.fillStyle = cone;
    ctx.beginPath();
    ctx.moveTo(1530, -60); ctx.lineTo(1700, -60); ctx.lineTo(980, 900); ctx.lineTo(700, 900);
    ctx.closePath(); ctx.fill();
    ctx.filter = 'none';
    ctx.restore();

    /* 地面反光：只在物体下方一小滩 */
    var gx = 800, gy = 690;
    var pool = ctx.createRadialGradient(gx, gy, 8, gx, gy, 260);
    pool.addColorStop(0, 'rgba(255,178,110,.10)');
    pool.addColorStop(1, 'rgba(255,178,110,0)');
    ctx.fillStyle = pool;
    ctx.beginPath(); ctx.ellipse(gx, gy + 20, 230, 54, 0, 0, Math.PI * 2); ctx.fill();

    /* 浮尘：慢速上升 + 横向漂移 */
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < 46; i++) {
      var seed = i * 12.9898;
      var bx = 620 + ((Math.sin(seed) * 0.5 + 0.5) * 620);
      var by = 200 + ((Math.sin(seed * 1.7) * 0.5 + 0.5) * 520);
      var vy = -((t * (6 + (i % 5) * 3)) % 520);
      var x = bx + Math.sin(t * 0.6 + seed) * 14;
      var y = by + vy;
      if (y < 120) y += 460;
      var a = 0.05 + ((i % 7) / 7) * 0.09 + p * 0.05;
      ctx.fillStyle = 'rgba(255,228,190,' + a.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(x, y, 0.7 + (i % 3) * 0.5, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();

    /* 暗角 */
    var vg = ctx.createRadialGradient(800, 430, 260, 800, 430, 1000);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,.55)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }

  /* 房屋五段：直接用异象一模型渲出来的静帧，点一下再看特写 */
  var HIMG = window.__houseImg || (window.__houseImg = (function () {
    var map = {};
    var list = { stool: 'assets/house/dining-wide.jpg', shelf: 'assets/house/cabinet.jpg',
                 fridge: 'assets/house/fridge.jpg', jacket: 'assets/house/bath-wide.jpg' };
    Object.keys(list).forEach(function (k) {
      var im = new Image(); im.src = list[k];
      map[k] = { img: im, ok: false };
      im.onload = function () { map[k].ok = true; };
    });
    return map;
  })());

  /* 显影：画面从黑里由中心往外浮出来，0.6 秒 */
  function drawDevelop(bt) {
    var k = clamp(bt / 0.62, 0, 1);
    var e = 1 - Math.pow(1 - k, 2);
    var r = 210 + 980 * e;
    var g = ctx.createRadialGradient(800, 448, r * 0.52, 800, 448, r);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(0.55, 'rgba(0,0,0,.45)');
    g.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = g;
    ctx.fillRect(-40, -40, WIDTH + 80, HEIGHT + 80);
  }

  function drawHouseStill(kind, t) {
    var e = HIMG[kind];
    if (!e || !e.ok || !e.img.naturalWidth) return false;
    var iw = e.img.naturalWidth, ih = e.img.naturalHeight;
    var sc = Math.max(WIDTH / iw, HEIGHT / ih) * (1.03 + 0.012 * Math.sin(t * 0.35));
    var dw = iw * sc, dh = ih * sc;
    var devK = clamp((G.bt || 0) / 0.5, 0, 1);
    ctx.save();
    ctx.globalAlpha = 0.15 + 0.85 * devK;
    ctx.drawImage(e.img, (WIDTH - dw) / 2, (HEIGHT - dh) / 2 - 10, dw, dh);
    /* 压成夜里：冷、暗、只留一点窗光 */
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(96,104,110,.55)';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.globalCompositeOperation = 'source-over';
    var vg = ctx.createRadialGradient(800, 470, 220, 800, 470, 980);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,.72)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.restore();
    if ((G.bt || 0) < 0.66) drawDevelop(G.bt || 0);
    return true;
  }

  function drawHouse(kind, p, t) {
    if (drawHouseStill(kind, t)) return;
    drawHouseBase(kind, p, t);
    drawHouseLight(kind, p, t);
  }

  function drawHouseBase(kind, p, t) {
    p = p == null ? 0 : p;
    /* 暗房：整间屋子只剩一侧透进来的光 */
    ctx.fillStyle = '#050403';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    var pool = ctx.createRadialGradient(560, 500, 40, 700, 520, 900);
    pool.addColorStop(0, 'rgba(96,74,52,.42)');
    pool.addColorStop(0.45, 'rgba(48,34,22,.22)');
    pool.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = pool;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    /* 地面：一条极淡的亮线与暗部，交代室内空间 */
    var fy = 640;
    var fl = ctx.createLinearGradient(0, fy, 0, HEIGHT);
    fl.addColorStop(0, 'rgba(120,92,62,.20)');
    fl.addColorStop(0.25, 'rgba(40,28,18,.10)');
    fl.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = fl;
    ctx.fillRect(0, fy, WIDTH, HEIGHT - fy);

    var SILH = '#080605';
    var ashA = 0.26 + p * 0.50;      /* 灰的浓度随进度加深 */

    /* 边缘落灰：在物件上沿积一条，不是平涂 */
    function ashTop(x, y, w, hh, amt) {
      var g = ctx.createLinearGradient(0, y, 0, y + hh);
      g.addColorStop(0, 'rgba(214,206,192,' + amt + ')');
      g.addColorStop(1, 'rgba(214,206,192,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x, y, w, hh);
    }
    function dust(x, y, w, hh, n) {
      ctx.fillStyle = 'rgba(232,224,210,' + (0.10 + p * 0.16) + ')';
      for (var i = 0; i < n; i++) {
        var dx = x + Math.random() * w, dy = y + Math.random() * hh;
        ctx.fillRect(dx, dy, 1.3, 1.3);
      }
    }

    if (kind === 'stool') {
      var sx = 800, sy = 640;
      /* 凳子：坐面 + 四条腿 */
      ctx.fillStyle = SILH;
      ctx.beginPath(); ctx.ellipse(sx, sy - 150, 118, 20, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(sx - 104, sy - 150, 208, 16);
      ctx.fillRect(sx - 92, sy - 140, 14, 150);
      ctx.fillRect(sx + 78, sy - 140, 14, 150);
      ctx.fillRect(sx - 46, sy - 138, 12, 132);
      ctx.fillRect(sx + 34, sy - 138, 12, 132);
      /* 坐面上的灰：中间被抹开，边缘厚 */
      ashTop(sx - 108, sy - 160, 216, 20, Math.min(1, ashA * 1.5));
      var sm = ctx.createRadialGradient(sx + 10, sy - 152, 4, sx + 10, sy - 152, 96);
      sm.addColorStop(0, 'rgba(20,18,16,.62)');
      sm.addColorStop(1, 'rgba(20,18,16,0)');
      ctx.fillStyle = sm;
      ctx.beginPath(); ctx.ellipse(sx + 10, sy - 152, 96, 13, 0, 0, Math.PI * 2); ctx.fill();
      dust(sx - 120, sy - 166, 240, 26, 26);
    }

    if (kind === 'shelf') {
      var bx = 760, by = 660, bw = 420, bh = 470;
      ctx.fillStyle = SILH;
      ctx.fillRect(bx, by - bh, bw, bh);
      /* 三层隔板：把书架挖空，露出后面的墙 */
      ctx.fillStyle = 'rgba(40,30,20,.55)';
      for (var r = 0; r < 3; r++) {
        ctx.fillRect(bx + 20, by - bh + 34 + r * 132, bw - 40, 108);
      }
      /* 书：竖着一排排，越右越被吃掉 */
      for (var r2 = 0; r2 < 3; r2++) {
        var y0 = by - bh + 34 + r2 * 132;
        for (var k = 0; k < 12; k++) {
          var bx2 = bx + 28 + k * 30;
          var eat = clamp((p * 1.6 - (k / 12) * 0.9 - r2 * 0.18), 0, 1);
          if (eat > 0.55) continue;
          ctx.fillStyle = 'rgba(10,8,6,.92)';
          ctx.fillRect(bx2, y0 + 14, 22, 92);
          ashTop(bx2, y0 + 14, 22, 10, ashA * (0.5 + eat));
        }
      }
      ashTop(bx + 18, by - bh + 26, bw - 36, 8, ashA);
      dust(bx, by - bh + 20, bw, bh * 0.7, 40);
    }

    if (kind === 'fridge') {
      var fx = 800, fw = 250, fh = 470, fb = 660;
      ctx.fillStyle = SILH;
      ctx.fillRect(fx - fw / 2, fb - fh, fw, fh);
      /* 门缝与小把手 */
      ctx.fillStyle = 'rgba(150,132,110,.18)';
      ctx.fillRect(fx - fw / 2 + 6, fb - fh * 0.42, fw - 12, 2);
      ctx.fillStyle = 'rgba(180,160,136,.22)';
      ctx.fillRect(fx + fw / 2 - 22, fb - fh * 0.62, 6, 54);
      /* 门开了一条缝：冷光泄出来 */
      var open = 0.35 + 0.4 * Math.sin(t * 0.7);
      var cw = 26 + open * 16;
      var cg = ctx.createLinearGradient(fx - fw / 2 - cw, 0, fx - fw / 2 + 8, 0);
      cg.addColorStop(0, 'rgba(150,190,210,0)');
      cg.addColorStop(0.6, 'rgba(176,214,232,.30)');
      cg.addColorStop(1, 'rgba(210,236,246,.55)');
      ctx.fillStyle = cg;
      ctx.fillRect(fx - fw / 2 - cw, fb - fh + 26, cw + 10, fh - 40);
      /* 冻鸡：随 p 从生变熟 */
      var cx2 = fx + 10, cy2 = fb - fh * 0.52;
      var raw = 1 - clamp(p * 1.3, 0, 1);
      ctx.fillStyle = 'rgba(' + Math.round(232 - raw * 60) + ',' + Math.round(190 - raw * 70) + ',' + Math.round(150 - raw * 70) + ',.85)';
      ctx.beginPath(); ctx.ellipse(cx2, cy2, 62, 44, 0.12, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cx2 + 54, cy2 - 10, 20, 16, 0.3, 0, Math.PI * 2); ctx.fill();
      /* 虾：几段弧 */
      ctx.strokeStyle = 'rgba(206,146,110,.75)';
      ctx.lineWidth = 5;
      for (var s2 = 0; s2 < 3; s2++) {
        ctx.beginPath();
        ctx.arc(cx2 - 40 + s2 * 34, cy2 + 62, 14, Math.PI * 0.15, Math.PI * 1.05);
        ctx.stroke();
      }
      dust(fx - fw / 2, fb - fh, fw, 60, 18);
    }

    if (kind === 'jacket') {
      var jx = 800, jy = 640;
      /* 椅背 */
      ctx.fillStyle = SILH;
      ctx.fillRect(jx - 130, jy - 300, 260, 18);
      ctx.fillRect(jx - 118, jy - 300, 16, 300);
      ctx.fillRect(jx + 102, jy - 300, 16, 300);
      /* 背心：挂在椅背上 */
      ctx.beginPath();
      ctx.moveTo(jx - 84, jy - 296);
      ctx.lineTo(jx - 58, jy - 372);
      ctx.lineTo(jx - 30, jy - 328);
      ctx.lineTo(jx - 10, jy - 300);
      ctx.lineTo(jx + 10, jy - 300);
      ctx.lineTo(jx + 30, jy - 328);
      ctx.lineTo(jx + 62, jy - 366);
      ctx.lineTo(jx + 84, jy - 296);
      ctx.lineTo(jx + 66, jy - 140);
      ctx.lineTo(jx - 66, jy - 140);
      ctx.closePath();
      var jg = ctx.createLinearGradient(0, jy - 372, 0, jy - 140);
      var ashP = clamp(p * 1.5, 0, 1);
      jg.addColorStop(0, 'rgba(190,182,168,' + (0.18 + ashP * 0.55) + ')');
      jg.addColorStop(1, 'rgba(10,8,6,.95)');
      ctx.fillStyle = jg;
      ctx.fill();
      /* 下摆一点点塌下去 */
      if (ashP > 0.2) {
        ctx.fillStyle = 'rgba(200,192,178,' + (0.10 + ashP * 0.25) + ')';
        ctx.beginPath();
        ctx.ellipse(jx, jy - 136, 70 + ashP * 20, 10 + ashP * 14, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      dust(jx - 90, jy - 380, 180, 240, 30);
    }

    /* 空气里的浮尘：始终有，越到后面越多 */
    ctx.fillStyle = 'rgba(226,216,200,' + (0.05 + p * 0.08) + ')';
    for (var q = 0; q < 46; q++) {
      var qx = (q * 137.5 + t * (6 + q % 5)) % WIDTH;
      var qy = (q * 91.3 + Math.sin(t * 0.4 + q) * 18 + 200) % HEIGHT;
      ctx.fillRect(qx, qy, 1.4, 1.4);
    }
  }

  /* ---------------------------------------------------------- 颗粒 / 遮幅 / 划痕 */
  var grainTile = null;
  function makeGrain() {
    var c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    var g = c.getContext('2d');
    var img = g.createImageData(256, 256);
    for (var i = 0; i < img.data.length; i += 4) {
      var v = 128 + (Math.random() * 2 - 1) * 90;
      img.data[i] = v; img.data[i + 1] = v; img.data[i + 2] = v; img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    grainTile = c;
  }
  function drawGrain(t, amt) {
    if (LOWFX) return;
    if (!grainTile || amt <= 0) return;
    ctx.save();
    /* 细颗粒：快、密 */
    /* 真胶片的颗粒是每格重新撒一次的，不该整体往下流 */
    ctx.globalAlpha = 0.13 * amt;
    ctx.globalCompositeOperation = 'overlay';
    var fr = Math.floor(t * 24);
    var ox = (fr * 197) % 256, oy = (fr * 353) % 256;
    for (var x = -256; x < WIDTH + 256; x += 256) {
      for (var y = -256; y < HEIGHT + 256; y += 256) {
        ctx.drawImage(grainTile, x + ox, y + oy);
      }
    }
    /* 粗颗粒：慢、疏，模拟胶片的密度不匀 */
    ctx.globalAlpha = 0.03 * amt;
    var ox2 = (fr * 811) % 896, oy2 = (fr * 613) % 896;
    for (var x2 = -896; x2 < WIDTH + 896; x2 += 896) {
      for (var y2 = -896; y2 < HEIGHT + 896; y2 += 896) {
        ctx.drawImage(grainTile, x2 + ox2, y2 + oy2, 896, 896);
      }
    }
    ctx.restore();
  }
  function drawVignette() {
    var g = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, HEIGHT * 0.35, WIDTH / 2, HEIGHT / 2, HEIGHT * 0.95);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,.55)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }
  /* 胶片边框：上下两条片基、齿孔、帧号、边缘字样、两端漏光 */
  function filmLabel(i) {
    var n = 11 + Math.floor(i / 2);
    return n + (i % 2 ? 'A' : '');
  }
  /* 房屋特写：点中物件后，0.25s 淡入，停 1.6s，0.35s 淡回 */
  var CIMG = window.__closeImg || (window.__closeImg = (function () {
    var map = {};
    var list = { fridge: 'assets/house/close-fridge.jpg', shelf: 'assets/house/close-drawer.jpg',
                 stool: 'assets/house/close-stool.jpg', stoolBefore: 'assets/house/close-stool-before.jpg',
                 jacket: 'assets/house/vest-mirror.jpg' };
    Object.keys(list).forEach(function (k) {
      var im = new Image(); im.src = list[k];
      map[k] = { img: im, ok: false };
      im.onload = function () { map[k].ok = true; };
    });
    return map;
  })());

  /* 持久定格：整拍铺一张图，不自动收（用于“没抹掉”和“抹掉”两拍对照） */
  function drawHoldStill() {
    if (!G.still) return;
    var e = CIMG[G.still] || CIMG.stool;
    if (!e || !e.ok || !e.img.naturalWidth) return;
    var iw = e.img.naturalWidth, ih = e.img.naturalHeight;
    var sc = Math.max(WIDTH / iw, HEIGHT / ih) * 1.02;
    var dw = iw * sc, dh = ih * sc;
    var a = clamp(G.bt / 0.35, 0, 1);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.drawImage(e.img, (WIDTH - dw) / 2, (HEIGHT - dh) / 2, dw, dh);
    ctx.globalAlpha = a * 0.3;
    ctx.fillStyle = '#0a0806';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.restore();
    if (G.bt < 0.5) drawDevelop(G.bt + 0.4);
  }

  function drawCloseup() {
    if (!G.close) return;
    var e = CIMG[G.close.key];
    if (!e || !e.ok || !e.img.naturalWidth) return;
    var t = performance.now() / 1000 - G.close.t0;
    if (t > 2.2) { G.close = null; G.hint = ''; return; }
    var a = t < 0.25 ? t / 0.25 : (t > 1.85 ? Math.max(0, (2.2 - t) / 0.35) : 1);
    if (a <= 0) return;
    var iw = e.img.naturalWidth, ih = e.img.naturalHeight;
    var sc = Math.max(WIDTH / iw, HEIGHT / ih) * 1.02;
    var dw = iw * sc, dh = ih * sc;
    var span = Math.max(0, dh - HEIGHT);
    var k2 = (G.close.key === 'jacket') ? 0.42 : 0.85;
    var dy = -span * Math.min(1, (t / 2.0) * k2);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.drawImage(e.img, (WIDTH - dw) / 2, dy, dw, dh);
    ctx.globalAlpha = a * 0.35;
    ctx.fillStyle = '#0a0806';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.restore();
    if (t < 0.62) drawDevelop(t);
  }

  /* 灰堆：不描轮廓，用密度堆 + 一张灰纹理填。wiped 0→1 表示被抹开多少 */
  /* 灰：一张低频纹理 + 噪声啃过的边缘 + 顶亮底暗的体积。
     不描轮廓、不堆小圆——形状由高度剖面给出，边缘由噪声给出。 */
  var ASH_TEX = null, ASH_PAT = null;
  var ASH_PILES = [{ x: 646, y: 742, w: 210, h: 50 }, { x: 1014, y: 736, w: 250, h: 54 }];
  function buildAshTex() {
    if (ASH_TEX) return ASH_TEX;
    var sz = 256, c = document.createElement('canvas');
    c.width = c.height = sz;
    var g = c.getContext('2d');
    g.fillStyle = '#6b6459'; g.fillRect(0, 0, sz, sz);
    /* 低频斑块：让灰不是平涂 */
    for (var i = 0; i < 260; i++) {
      var v = 92 + Math.random() * 34;
      var r = 6 + Math.random() * 26;
      var grd = g.createRadialGradient(Math.random() * sz, Math.random() * sz, 0, 0, 0, r);
      g.globalAlpha = 0.05 + Math.random() * 0.10;
      g.fillStyle = 'rgb(' + (v | 0) + ',' + ((v * 0.97) | 0) + ',' + ((v * 0.92) | 0) + ')';
      g.beginPath(); g.arc(Math.random() * sz, Math.random() * sz, r, 0, 6.2832); g.fill();
    }
    g.globalAlpha = 1;
    /* 细颗粒：暗点为主，少量亮点，绝不成白点 */
    for (var j = 0; j < 26000; j++) {
      var t = Math.random();
      var val = t < 0.78 ? 64 + Math.random() * 34 : 132 + Math.random() * 30;
      g.fillStyle = 'rgba(' + (val | 0) + ',' + ((val * 0.96) | 0) + ',' + ((val * 0.9) | 0) + ',' + (0.25 + Math.random() * 0.5) + ')';
      g.fillRect(Math.random() * sz, Math.random() * sz, 1, 1);
    }
    ASH_TEX = c; ASH_PAT = null;
    return c;
  }
  function ashPath(P, seed) {
    var n = 56, cx0 = P.x + P.w * 0.5, cy0 = P.y + P.h * 0.5;
    ctx.beginPath();
    for (var i = 0; i <= n; i++) {
      var ang = i / n * 6.2832;
      /* 边缘起伏：三个不同频率叠加，再做一次高频“毛边” */
      var w1 = 1 + 0.09 * Math.sin(ang * 3 + seed) + 0.06 * Math.sin(ang * 5.7 + seed * 2)
                 + 0.035 * Math.sin(ang * 13.1 + seed * 3);
      var rx = P.w * 0.5 * w1, ry = P.h * 0.5 * w1;
      var px = cx0 + Math.cos(ang) * rx, py = cy0 + Math.sin(ang) * ry;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }
  function drawAshPiles(t, amt, wiped) {
    if (!(amt > 0.002)) return;
    buildAshTex();
    if (!ASH_PAT) ASH_PAT = ctx.createPattern(ASH_TEX, 'repeat');
    for (var i = 0; i < ASH_PILES.length; i++) {
      var P = ASH_PILES[i], a = amt * (i === 0 ? 0.92 : 0.86);
      ctx.save();
      /* 接触阴影：贴着地面的一圈暗，不是椭圆黑块 */
      var sh = ctx.createRadialGradient(P.x + P.w * 0.5, P.y + P.h * 0.78, 2, P.x + P.w * 0.5, P.y + P.h * 0.78, P.w * 0.56);
      sh.addColorStop(0, 'rgba(0,0,0,.30)');
      sh.addColorStop(0.62, 'rgba(0,0,0,.12)');
      sh.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.globalAlpha = a;
      ctx.fillStyle = sh;
      ctx.beginPath();
      ctx.ellipse(P.x + P.w * 0.5, P.y + P.h * 0.78, P.w * 0.56, P.h * 0.26, 0, 0, 6.2832);
      ctx.fill();
      /* 本体：纹理填满 + clip 内叠体积光 */
      ashPath(P, i * 2.7);
      ctx.clip();
      ctx.globalAlpha = a * 0.62;
      ctx.fillStyle = ASH_PAT;
      ctx.fillRect(P.x - 30, P.y - 20, P.w + 60, P.h + 40);
      /* 顶亮、底暗（体积） */
      var vg = ctx.createLinearGradient(0, P.y - P.h * 0.1, 0, P.y + P.h * 1.25);
      vg.addColorStop(0, 'rgba(255,246,232,.20)');
      vg.addColorStop(0.42, 'rgba(255,246,232,0)');
      vg.addColorStop(1, 'rgba(0,0,0,.58)');
      ctx.fillStyle = vg;
      ctx.fillRect(P.x - 30, P.y - 20, P.w + 60, P.h + 60);
      /* 抹开的一道：把灰推薄，露出更亮的地面 */
      if (wiped > 0.01) {
        var wx = P.x + P.w * 0.16, ww = P.w * 0.66 * Math.min(1, wiped);
        var wg = ctx.createLinearGradient(0, P.y + P.h * 0.28, 0, P.y + P.h * 0.62);
        wg.addColorStop(0, 'rgba(255,248,236,0)');
        wg.addColorStop(0.5, 'rgba(255,248,236,' + (0.30 * Math.min(1, wiped)) + ')');
        wg.addColorStop(1, 'rgba(255,248,236,0)');
        ctx.fillStyle = wg;
        ctx.fillRect(wx, P.y + P.h * 0.28, ww, P.h * 0.34);
      }
      ctx.restore();
    }
    /* 周围溅落：暗灰点，不是白点 */
    ctx.save();
    ctx.globalAlpha = 0.34 * amt;
    ctx.fillStyle = '#8d8477';
    for (var s2 = 0; s2 < 46; s2++) {
      var P2 = ASH_PILES[s2 % 2];
      var rx2 = (Math.random() - 0.5) * P2.w * 2.2, ry2 = (Math.random() - 0.25) * P2.h * 2.4;
      ctx.beginPath();
      ctx.arc(P2.x + P2.w * 0.5 + rx2, P2.y + P2.h * 0.7 + ry2, 0.7 + Math.random() * 1.5, 0, 6.2832);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawFilmFrame(t) {
    /* 石化之后：屋子还在暖光里，但那两样东西是冷的 */
    if (G.coolK > 0.01) {
      var ck2 = clamp(G.coolK, 0, 1);
      var cg = ctx.createLinearGradient(0, 0, 0, HEIGHT);
      cg.addColorStop(0, 'rgba(86,116,148,' + (0.20 * ck2).toFixed(3) + ')');
      cg.addColorStop(0.55, 'rgba(64,86,112,' + (0.10 * ck2).toFixed(3) + ')');
      cg.addColorStop(1, 'rgba(30,40,56,0)');
      ctx.fillStyle = cg;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      /* 烛火那圈暖光收一点，让冷暖分出层次 */
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = 'rgba(196,204,216,' + (0.34 * ck2).toFixed(3) + ')';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.globalCompositeOperation = 'source-over';
    }
    drawCloseup();
    drawHoldStill();
    var bar = 62;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, WIDTH, bar);
    ctx.fillRect(0, HEIGHT - bar, WIDTH, bar);

    /* 片基：比纯黑略暖一点，齿孔才显得是「挖空的」 */
    ctx.fillStyle = 'rgba(22,15,10,.85)';
    ctx.fillRect(0, 0, WIDTH, bar);
    ctx.fillRect(0, HEIGHT - bar, WIDTH, bar);

    var holeW = 26, holeH = 15, step = 52;
    var yTop = 17, yBot = HEIGHT - bar + 17;
    /* 片子在走：齿孔慢慢往左漂，像放映机在过片 */
    var drift = (t * 26) % step;
    for (var x = 26 - drift - step, k = 0; x < WIDTH - 10; x += step, k++) {
      /* 齿孔：中间透出一点底下的光 */
      ctx.fillStyle = 'rgba(198,176,138,.13)';
      rr(ctx, x, yTop, holeW, holeH, 4); ctx.fill();
      ctx.strokeStyle = 'rgba(255,196,132,.10)';
      ctx.lineWidth = 1;
      rr(ctx, x, yTop, holeW, holeH, 4); ctx.stroke();

      ctx.fillStyle = 'rgba(198,176,138,.11)';
      rr(ctx, x + (step / 2 - holeW / 2), yBot, holeW, holeH, 4); ctx.fill();

      /* 齿孔之间的小帧号 */
      if (k % 4 === 1) {
        /* 帧号跟着过片一路往前数，不回头 */
        var fidx = Math.floor((t * 26) / (step * 4)) + (k >> 2);
        ctx.fillStyle = 'rgba(228,146,54,.42)';
        ctx.font = '9px "Helvetica Neue", Arial, sans-serif';
        ctx.fillText(filmLabel(fidx), x + 6, yTop - 4);
        ctx.fillText(filmLabel(fidx), x + 6, yBot + holeH + 11);
      }
    }

    /* 边缘字样，像胶片边上的暗房标记 */
    ctx.save();
    ctx.globalAlpha = 0.30;
    ctx.fillStyle = '#e2913a';
    ctx.font = '8px "Helvetica Neue", Arial, sans-serif';
    ctx.letterSpacing = '2.4px';
    for (var tx = 300; tx < WIDTH; tx += 430) {
      ctx.fillText('KODAK PORTRA 400', tx, 52);
      ctx.fillText('KODAK PORTRA 400', tx + 210, HEIGHT - 50);
    }
    ctx.letterSpacing = '0px';
    ctx.restore();

    /* 两端漏光：一头橙、一头青，慢慢呼吸 */
    var leak = 0.72 + 0.28 * Math.sin(t * 0.63 + 0.4);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    var warm = ctx.createRadialGradient(WIDTH + 40, HEIGHT * 0.30, 20, WIDTH + 40, HEIGHT * 0.30, 760);
    warm.addColorStop(0, 'rgba(255,118,26,' + (0.20 * leak).toFixed(3) + ')');
    warm.addColorStop(0.45, 'rgba(226,96,26,' + (0.075 * leak).toFixed(3) + ')');
    warm.addColorStop(1, 'rgba(180,60,20,0)');
    ctx.fillStyle = warm;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    var cool = ctx.createRadialGradient(-60, HEIGHT * 0.62, 20, -60, HEIGHT * 0.62, 640);
    cool.addColorStop(0, 'rgba(0,176,168,' + (0.13 * leak).toFixed(3) + ')');
    cool.addColorStop(0.5, 'rgba(0,140,150,' + (0.045 * leak).toFixed(3) + ')');
    cool.addColorStop(1, 'rgba(0,120,130,0)');
    ctx.fillStyle = cool;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.restore();
  }
  /* 白光之后：胶片被烧穿，边从一侧卷进来 */
  function drawBurnEdge(k, t) {
    if (k <= 0.01) return;
    var depth = 40 + 150 * clamp(k, 0, 1);
    var x0 = depth;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (var y = 0; y <= HEIGHT; y += 40) {
      var wob = Math.sin(y * 0.021 + t * 3.1) * 16 + Math.sin(y * 0.007 - t * 1.7) * 26;
      ctx.lineTo(x0 + wob + Math.sin(t * 2.3) * 6, y);
    }
    ctx.lineTo(0, HEIGHT);
    ctx.closePath();
    var bg = ctx.createLinearGradient(x0 + 40, 0, 0, 0);
    bg.addColorStop(0, 'rgba(12,6,3,0)');
    bg.addColorStop(0.35, 'rgba(16,7,3,.85)');
    bg.addColorStop(1, 'rgba(4,2,1,.98)');
    ctx.fillStyle = bg;
    ctx.fill();

    /* 燃烧的边：一条抖动的暖线 + 几点火星 */
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    for (var y2 = 0; y2 <= HEIGHT; y2 += 18) {
      var wx = x0 + Math.sin(y2 * 0.021 + t * 3.1) * 16 + Math.sin(y2 * 0.007 - t * 1.7) * 26;
      if (y2 === 0) ctx.moveTo(wx, y2); else ctx.lineTo(wx, y2);
    }
    ctx.strokeStyle = 'rgba(255,118,32,' + (0.55 * clamp(k, 0, 1)).toFixed(3) + ')';
    ctx.lineWidth = 3.4;
    ctx.shadowColor = 'rgba(255,140,40,.85)';
    ctx.shadowBlur = 26;
    ctx.stroke();
    ctx.shadowBlur = 0;
    for (var e = 0; e < 16; e++) {
      var ey = rand(0, HEIGHT);
      var ex = x0 + Math.sin(ey * 0.021 + t * 3.1) * 16 + Math.sin(ey * 0.007 - t * 1.7) * 26 + rand(-14, 26);
      var rr2 = rand(0.8, 2.6);
      ctx.fillStyle = 'rgba(255,' + Math.round(rand(120, 190)) + ',60,' + (0.5 * k * rand(0.4, 1)).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(ex, ey, rr2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  var scratch = { x: 0, life: 0, next: 3 };
  function drawScratch(dt, t) {
    scratch.next -= dt;
    if (scratch.life <= 0 && scratch.next <= 0) { scratch.x = rand(120, WIDTH - 120); scratch.life = 0.20; scratch.next = rand(1.8, 5.5); }
    if (scratch.life > 0) {
      scratch.life -= dt;
      ctx.save();
      ctx.globalAlpha = 0.30 * Math.max(0, scratch.life / 0.12);
      ctx.fillStyle = '#fff';
      ctx.fillRect(scratch.x, 0, 1.7, HEIGHT);
      ctx.restore();
    }
    void t;
  }

  /* ---------------------------------------------------------- 字幕 */
  var G = {
    beatPose: {},
    beatPoseKey: {},
    propPos: { cup: { x: 14, base: 716, w: 300 }, candle: { x: 286, base: 742, w: 150 } },
    beats: [], i: -1, beat: null, bt: 0,
    text: '', typed: 0, typing: false,
    chipLine: '', chipsRead: {}, hint: '',
    chipsRects: [], hotspots: [],
    film: 1, black: 1, flash: 0, red: 0,
    cam: { x: 0, y: 70, z: 1.55 }, camT: { x: 0, y: 70, z: 1.55 },
    scene: 'shadow',
    autoLeft: 0,
    ended: false
  };

  var FONT = '"Noto Serif SC","Source Han Serif SC","Songti SC","SimSun",serif';
  var FONT_SANS = '"Noto Sans SC","Microsoft YaHei",sans-serif';

  function drawTextLayer(t) {
    var b = G.beat;
    if (!b) return;
    var margin = 150;
    var maxW = WIDTH - margin * 2;
    /* 底部渐隐 */
    var g = ctx.createLinearGradient(0, HEIGHT - 260, 0, HEIGHT);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(0.55, 'rgba(0,0,0,.34)');
    g.addColorStop(1, 'rgba(0,0,0,.66)');
    ctx.fillStyle = g;
    ctx.fillRect(0, HEIGHT - 260, WIDTH, 260);

    /* 正文（点开词条后，屏幕上这句换成了那一段） */
    var body = G.chipLine || G.text;
    var shown = body.slice(0, Math.floor(G.typed));
    if (G.chipLine) shown = body;
    var size = 26, lh = 47, measure = 1080;
    var font = size + 'px ' + FONT;
    ctx.font = font;
    ctx.letterSpacing = '0.6px';
    ctx.fillStyle = 'rgba(243,234,216,.93)';
    ctx.shadowColor = 'rgba(0,0,0,.9)';
    ctx.shadowBlur = 16;
    var chipFadeA = 1;
    if (G.chipLine && G.chipAt) chipFadeA = Math.max(0, Math.min(1, (performance.now() / 1000 - G.chipAt) / 0.22));
    var lines = wrapText(ctx, shown, measure, font);
    /* 用整段话的行数算位置，而不是当前已打出的行数，否则每多一行整块就往上窜 */
    var fullLines = wrapText(ctx, body, measure, font).length;
    var baseY = HEIGHT - 96 - (Math.max(fullLines, 1) - 1) * lh;
    ctx.globalAlpha = 0.93 * chipFadeA;
    for (var i = 0; i < lines.length; i++) ctx.fillText(lines[i], margin + 26, baseY + i * lh);
    ctx.globalAlpha = 1;
    if (G.typing && lines.length) {
      var lastW = ctx.measureText(lines[lines.length - 1]).width;
      ctx.fillStyle = 'rgba(255,236,206,' + (0.45 + 0.45 * Math.sin(t * 8)).toFixed(3) + ')';
      ctx.fillRect(margin + 30 + lastW, baseY + (lines.length - 1) * lh - size * 0.72, 1.6, size * 0.86);
    }
    ctx.shadowBlur = 0;

    /* 左侧一道竖线，把这段话框住 */
    ctx.fillStyle = 'rgba(206,158,104,.30)';
    ctx.fillRect(margin - 4, baseY - 30, 1.5, (lines.length - 1) * lh + 44);

    /* 说话人 */
    if (b.who && !G.chipLine) {
      ctx.fillStyle = 'rgba(208,166,116,.80)';
      ctx.font = '16px ' + FONT_SANS;
      ctx.letterSpacing = '6px';
      ctx.fillText(b.who, margin + 26, baseY - 36);
      ctx.letterSpacing = '0px';
    }
    ctx.letterSpacing = '0px';

    /* 词条：漂在爸爸头顶，像他脑子里冒出来的三样东西 */
    if (b.chips && G.chipsReady) {
      ctx.font = '30px ' + FONT;
      var sizes = b.chips.map(function (c) { return ctx.measureText(c.label).width; });
      var hub = { x: 1170, y: 185 };
      var spots = [{ x: -88, y: 54 }, { x: 2, y: 2 }, { x: 92, y: 50 }];
      G.chipsRects = [];
      for (var k = 0; k < b.chips.length; k++) {
        var c = b.chips[k];
        var read = !!G.chipsRead[c.key];
        var sp = spots[k % spots.length];
        var drift = Math.sin(t * 0.9 + k * 1.7) * 4;
        var x = hub.x + sp.x - sizes[k] / 2;
        var y = hub.y + sp.y + drift;
        ctx.font = '30px ' + FONT;
        var pulse = read ? 0 : 0.55 + 0.45 * Math.sin(t * 3 + k);
        if (!read) {
          var halo = ctx.createRadialGradient(x + sizes[k] / 2, y - 8, 2, x + sizes[k] / 2, y - 8, sizes[k] * 0.9 + 26);
          halo.addColorStop(0, 'rgba(255,196,120,' + (0.16 + pulse * 0.12) + ')');
          halo.addColorStop(1, 'rgba(255,170,90,0)');
          ctx.fillStyle = halo;
          ctx.beginPath(); ctx.arc(x + sizes[k] / 2, y - 8, sizes[k] * 0.9 + 26, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = read ? 'rgba(198,178,148,.26)' : 'rgba(255,222,170,' + (0.70 + pulse * 0.26) + ')';
        ctx.fillText(c.label, x, y);
        ctx.fillStyle = read ? 'rgba(198,178,148,.14)' : 'rgba(255,190,110,' + (0.26 + pulse * 0.34) + ')';
        ctx.fillRect(x, y + 9, sizes[k], 1.5);
        G.chipsRects.push({ x: x - 10, y: y - 30, w: sizes[k] + 20, h: 46, key: c.key });
      }
      if (!G.chipLine) {
        ctx.fillStyle = 'rgba(214,184,142,.4)';
        ctx.font = '16px ' + FONT_SANS;
        var tip = '点开他说的东西';
        if (!G.hint) ctx.fillText(tip, WIDTH - 150 - ctx.measureText(tip).width, HEIGHT - 96);
      }
    }

    /* 小块闪烁点：告诉人往这按 */
    if (G.hotspot) {
      var hd = G.hotspot;
      var ph = (t * 1.6) % 1;
      var dx2 = hd.x, dy2 = hd.y;
      var rr = 3.2 + 2.2 * Math.sin(t * 4.2);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      var dg = ctx.createRadialGradient(dx2, dy2, 0, dx2, dy2, rr * 7);
      dg.addColorStop(0, 'rgba(255,236,206,.95)');
      dg.addColorStop(0.22, 'rgba(255,214,160,.55)');
      dg.addColorStop(1, 'rgba(255,190,120,0)');
      ctx.fillStyle = dg;
      ctx.beginPath(); ctx.arc(dx2, dy2, rr * 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,248,236,.92)';
      ctx.beginPath(); ctx.arc(dx2, dy2, Math.max(1.2, rr * 0.55), 0, Math.PI * 2); ctx.fill();
      /* 一圈很细的扩散环 */
      ctx.strokeStyle = 'rgba(255,226,180,' + (0.30 * (1 - ph)).toFixed(3) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(dx2, dy2, 6 + ph * 26, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
      G.__hsx = dx2; G.__hsy = dy2;
    }
    /* 提示 */
    var typeDone = !G.typing;
    var hIn = typeDone ? clamp((t - (G.doneAt || 0) - 0.15) / 0.55, 0, 1) : 0;
    if (G.hint && hIn > 0.01) {
      ctx.font = '17px ' + FONT_SANS;
      var still = !G.hotspot;
      var hp = ((still ? 0.52 : 0.30) + 0.22 * (0.5 + 0.5 * Math.sin(t * (still ? 2.6 : 1.9)))) * hIn;
      ctx.fillStyle = 'rgba(226,212,188,' + hp.toFixed(3) + ')';
      var hw = ctx.measureText(G.hint).width;
      var hx = WIDTH - 150 - hw, hy = HEIGHT - 96;
      if (!still && G.__hsx) {
        /* 有热区：字跟着人物身上的光点走 */
        ctx.font = '16px ' + FONT_SANS;
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(232,220,200,' + Math.min(0.92, hp + 0.18).toFixed(3) + ')';
        ctx.fillText(G.hint, G.__hsx, G.__hsy + 34);
        ctx.textAlign = 'left';
        return;
      }
      /* 有热区：点已经在人物身上，字跟到点下面；没热区：照片屏/文字屏给一个 cue 点 */
      if (still) {
        var bx = G.cue ? WIDTH * G.cue[0] : WIDTH * 0.5;
        var by = G.cue ? HEIGHT * G.cue[1] : HEIGHT * 0.62;
        var pr = 2.6 + 1.3 * Math.sin(t * 2.6);
        var gg = ctx.createRadialGradient(bx, by, 0, bx, by, 14);
        gg.addColorStop(0, 'rgba(255,232,196,' + (0.55 * hp / 0.52).toFixed(3) + ')');
        gg.addColorStop(0.45, 'rgba(255,196,120,' + (0.22 * hp / 0.52).toFixed(3) + ')');
        gg.addColorStop(1, 'rgba(255,196,120,0)');
        ctx.fillStyle = gg;
        ctx.beginPath(); ctx.arc(bx, by, 14, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,240,214,' + Math.min(0.95, hp + 0.25).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(bx, by, pr, 0, Math.PI * 2); ctx.fill();
        /* 文字跟着点走：落在点下面，居中 */
        ctx.font = '16px ' + FONT_SANS;
        ctx.fillStyle = 'rgba(232,220,200,' + Math.min(0.92, hp + 0.18).toFixed(3) + ')';
        ctx.textAlign = 'center';
        ctx.fillText(G.hint, bx, by + 34);
        ctx.textAlign = 'left';
        return;
      }
      ctx.fillText(G.hint, hx, hy);
    }
  }

  /* 构建标记：右上角一行小字，用来确认浏览器没吃到旧缓存 */
  (function () {
    try {
      if ((location.search.match(/[?&]hud=0/) || []).length) return;  /* 录屏时隐藏 */
      var sc = document.querySelector('script[src*="acts.js"]');
      var v = (sc && /v=(\d+)/.exec(sc.getAttribute('src') || '')) ? RegExp.$1 : 'dev';
      var d = document.createElement('div');
      d.style.cssText = 'position:fixed;left:14px;top:34px;z-index:998;color:rgba(232,214,186,.55);font:11px/1.4 ui-monospace,Consolas,monospace;letter-spacing:1px;pointer-events:none';
      d.textContent = 'build ' + v;
      document.body.appendChild(d);
    } catch (e) {}
  })();

  /* ---------------------------------------------------------- 每帧 */
  var last = 0;
  window.onerror = function (m, s, l, c) { try { var d = document.createElement('div'); d.style.cssText = 'position:fixed;left:0;top:0;z-index:999;background:#300;color:#fff;font:14px monospace;padding:8px;white-space:pre-wrap'; d.textContent = 'ERR ' + m + ' @' + l + ':' + c; document.body.appendChild(d); } catch (e3) { } };

  /* ---------------- 老电视（CRT）叠加 ---------------- */
  var TVN = null;
  function tvNoise() {
    if (TVN) return TVN;
    var c = document.createElement('canvas'); c.width = c.height = 256;
    var g = c.getContext('2d');
    var im = g.createImageData(256, 256);
    for (var i = 0; i < im.data.length; i += 4) {
      var v = Math.random() * 255 | 0;
      im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255;
    }
    g.putImageData(im, 0, 0);
    TVN = c; return c;
  }

  /* ---------------- 这是梦 ---------------- */
  function drawDream(t) {
    var bt = G.bt || 0;
    var a = clamp(bt / 0.9);
    /* 用户要求：字就停在屏幕中央，不放大、不上飘 */
    var size = 64;
    var dy = 0;
    var alpha = a;
    if (bt > 5.2) alpha = clamp(1 - (bt - 5.2) / 1.0);
    if (bt > 6.6) {
      ctx.save(); ctx.globalAlpha = clamp((bt - 6.6) / 1.0); ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, WIDTH, HEIGHT); ctx.restore();
    }
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '500 ' + size.toFixed(1) + 'px "Noto Serif SC", serif';
    ctx.globalAlpha = alpha * 0.20;
    ctx.fillStyle = 'rgba(255,238,214,1)';
    ctx.fillText('这是梦', 800, 430 + dy + 2);
    ctx.globalAlpha = alpha * 0.94;
    ctx.fillStyle = 'rgba(250,242,228,1)';
    ctx.fillText('这是梦', 800, 430 + dy);
    /* 划线：从中间往两边扫 */
    if (bt > 4.2) {
      var sw = clamp((bt - 4.2) / 1.0) * 680;
      ctx.globalAlpha = alpha * 0.75;
      ctx.fillRect(800 - sw / 2, 430 + dy + size * 0.62, sw, Math.max(1.5, size * 0.02));
    }
    ctx.restore();
  }

  function drawTV(t, k) {
    if (k <= 0.01) return;
    ctx.save();
    ctx.globalAlpha = k;
    /* 扫描线 */
    ctx.fillStyle = 'rgba(0,0,0,.17)';
    for (var y = 0; y < HEIGHT; y += 3) ctx.fillRect(0, y, WIDTH, 1.4);
    /* 缓慢下滚的亮带 */
    var roll = ((t * 0.11) % 1) * (HEIGHT + 240) - 240;
    var rg = ctx.createLinearGradient(0, roll, 0, roll + 200);
    rg.addColorStop(0, 'rgba(255,255,255,0)');
    rg.addColorStop(0.5, 'rgba(255,255,255,.055)');
    rg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = rg; ctx.fillRect(0, roll, WIDTH, 200);
    /* 雪花 */
    var n = tvNoise();
    ctx.globalAlpha = k * (0.05 + 0.035 * Math.random());
    var ox = -(Math.random() * 256 | 0), oy = -(Math.random() * 256 | 0);
    for (var xx = ox; xx < WIDTH; xx += 256) for (var yy = oy; yy < HEIGHT; yy += 256) ctx.drawImage(n, xx, yy);
    /* 偶尔一条横向撕裂 */
    if (Math.random() < 0.05) {
      var ty = Math.random() * HEIGHT;
      ctx.globalAlpha = k * 0.5;
      ctx.fillStyle = 'rgba(220,235,255,.28)';
      ctx.fillRect(0, ty, WIDTH, 1 + Math.random() * 2);
    }
    /* 亮度闪 */
    ctx.globalAlpha = k * (0.03 + 0.03 * Math.abs(Math.sin(t * 7.3)));
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, WIDTH, HEIGHT);
    /* 冷色 */
    ctx.globalAlpha = k * 0.10;
    ctx.fillStyle = 'rgba(120,150,190,1)'; ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.restore();
  }
  function drawTVCaption(t) {
    /* 电视题注：白字、轻微重影、上下两条细线，像当年电视台的字幕 */
    var lines = G.bt < 1.8 ? ['爸！'] : G.bt < 3.6 ? ['妈！'] : ['没有回答。'];
    var bx = 232, by = 452;
    ctx.save();
    ctx.font = '600 44px "Courier New", monospace';
    ctx.textAlign = 'left';
    for (var i = 0; i < lines.length; i++) {
      var yy = by + i * 56;
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = 'rgba(150,220,255,1)';
      ctx.fillText(lines[i], bx + 2.2, yy);
      ctx.globalAlpha = 0.18;
      ctx.fillStyle = 'rgba(255,120,120,1)';
      ctx.fillText(lines[i], bx - 2.2, yy);
      ctx.globalAlpha = 0.92;
      ctx.fillStyle = 'rgba(246,248,252,1)';
      ctx.fillText(lines[i], bx, yy);
    }
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = 'rgba(232,240,250,1)';
    ctx.fillRect(bx, by + 22, 118, 1.3);
    ctx.restore();
  }

  function frame(now) {
    requestAnimationFrame(frame);
    var dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    W.t += dt;
    G.bt += dt;
    var t = W.t;

    /* 状态推进 */
    blendPose(W.mom, TGT.mom, 0.10);
    blendPose(W.dad, TGT.dad, 0.10);
    W.ball.x = lerp(W.ball.x, TGT.ball.x, 0.09);
    W.ball.y = lerp(W.ball.y, TGT.ball.y, 0.09);
    W.ball.r = lerp(W.ball.r, TGT.ball.r, 0.09);
    W.ball.vis = lerp(W.ball.vis, TGT.ball.vis, 0.12);
    if (W.ball.vis > 0.05) {
      W.trail.push({ x: W.ball.x, y: W.ball.y });
      if (W.trail.length > 26) W.trail.shift();
    } else W.trail.length = 0;

    if (G.typing) {
      G.typed = Math.min(G.text.length, G.typed + dt * 34);
      if (G.typed >= G.text.length) { G.typing = false; G.doneAt = t; onTyped(); }
    }
    if (!(G.beat && G.beat.id === 'flash')) G.flash = Math.max(0, G.flash - dt * 1.15);
    if (G.clickPrompt > 0) G.clickPrompt = Math.max(0, G.clickPrompt - dt);
    G.after = Math.max(0, (G.after || 0) - dt * 0.72);
    G.black = Math.max(0, G.black - dt * 0.9);

    if (G.beat && G.beat.update) G.beat.update(G.bt, dt);
    if (G.beat && G.beat.auto && G.bt > G.beat.auto && !G.paused) { G.beat.auto = 0; advance(); }
    /* 无需交互的拍自动往下走，不再逼人点 */
    if (G.beat && !G.typing && !G.ended && G.beat.id !== 'dream' && G.beat.id !== 'epilogue') {
      var bb = G.beat, blocked = false;
      if (bb.chips && bb.chips.length) blocked = !bb.chips.every(function (x) { return G.chipsRead[x.key]; });
      if (bb.hotspot && G.hotspot) blocked = true;
      if (!blocked && !bb.auto && !G.paused) {
        G.idle = (G.idle || 0) + dt;
        var need = 1.7 + G.text.length / 13;
        if (G.idle > need) { G.idle = 0; advance(); }
      } else { G.idle = 0; }
    }

    /* 粒子 */
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      var floorY = (typeof farY === 'number') ? farY + 26 : 600;
      if (p.rest) {
        p.life -= dt * 0.35;
      } else {
        p.vy += 260 * dt * p.g;
        /* 灰不是直落的，有风把它带横一点 */
        p.x += (p.vx + Math.sin(t * 1.3 + p.y * 0.012) * 9) * dt;
        p.y += p.vy * dt;
        if (p.y >= floorY) { p.y = floorY; p.rest = 1; p.vy = 0; p.life = Math.min(p.life, 2.4); }
      }
      p.life -= dt * (p.rest ? 0 : 1);
      if (p.life <= 0) parts.splice(i, 1);
    }

    /* 画 */
    ctx.setTransform(DPR * view.s, 0, 0, DPR * view.s, DPR * view.ox, DPR * view.oy);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.save();
    /* 片门抖动 */
    var hitch = (Math.sin(t * 0.63) > 0.997) ? 1.8 : 0;
    var weave = G.film > 0.5 ? (Math.sin(t * 6.3) * 1.5 + Math.sin(t * 2.1) * 0.9 + hitch) : 0;
    /* 快门抖动：三下快门时画面轻微一震，随后衰减 */
    G.shake = G.shake || 0;
    G.shake *= 0.90;
    if (G.shake < 0.05) G.shake = 0;
    var shx = (Math.random() - 0.5) * G.shake;
    var shy = (Math.random() - 0.5) * G.shake;
    ctx.translate(weave + shx, weave * 0.6 + shy);

    /* 镜头：默认推近，看画的时候摇到右上角 */
    G.pushZ += (1 - (G.pushZ || 1)) * 0.05;
    G.cam.z = lerp(G.cam.z, G.camT.z * (G.pushZ || 1), 0.06);
    G.cam.x = lerp(G.cam.x, G.camT.x, 0.06);
    G.cam.y = lerp(G.cam.y, G.camT.y, 0.06);

    ctx.save();
    ctx.translate(WIDTH / 2, HEIGHT / 2);
    ctx.scale(G.cam.z, G.cam.z);
    ctx.translate(-WIDTH / 2 + G.cam.x, -HEIGHT / 2 + G.cam.y);

    if (G.scene === 'shadow' || G.scene === 'statue') drawShadowScene(t);
    else if (G.scene === 'flash') {
      drawShadowScene(t);
      if (G.after > 0.01) {
      var ag = ctx.createRadialGradient(WIDTH * 0.5, HEIGHT * 0.42, 10, WIDTH * 0.5, HEIGHT * 0.42, WIDTH * 0.62);
      ag.addColorStop(0, 'rgba(255,249,236,' + (0.20 * G.after) + ')');
      ag.addColorStop(0.55, 'rgba(255,236,206,' + (0.09 * G.after) + ')');
      ag.addColorStop(1, 'rgba(255,220,180,0)');
      ctx.fillStyle = ag; ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
    ctx.fillStyle = 'rgba(255,255,255,' + G.flash + ')';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    } else if (G.scene === 'house') drawHouse(W.house.kind, W.house.p, t);
    else if (G.beat && G.beat.diary) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, WIDTH, HEIGHT); }
  else if (G.scene === 'dawn' || G.scene === 'final') drawDawn(t);
    if (G.scene === 'dawn' || G.scene === 'final') drawDustMotes(t);

    /* 灰烬粒子 */
    for (var q = 0; q < parts.length; q++) {
      var pa = parts[q];
      ctx.globalAlpha = clamp(pa.life / pa.max, 0, 1) * 0.8;
      ctx.fillStyle = pa.c;
      ctx.beginPath(); ctx.arc(pa.x, pa.y, pa.s, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.restore();   /* 结束镜头变换：边框、字幕、颗粒都留在原坐标 */

    /* 前景：底边一道虚焦的轮廓，把画面「框」住（不做逐帧 blur，用渐变代） */
    if (!BOTTOM_VIG) {
      BOTTOM_VIG = ctx.createLinearGradient(0, HEIGHT - 150, 0, HEIGHT);
      BOTTOM_VIG.addColorStop(0, 'rgba(2,1,1,0)');
      BOTTOM_VIG.addColorStop(0.45, 'rgba(2,1,1,.72)');
      BOTTOM_VIG.addColorStop(1, 'rgba(2,1,1,.97)');
    }
    ctx.save();
    ctx.fillStyle = BOTTOM_VIG;
    ctx.fillRect(0, HEIGHT - 150, WIDTH, 150);
    ctx.restore();

    /* 前景椅背：底部压一条虚焦的黑剪影（用户给的实际剪影图） */
    /* 前景烛台（右侧，压虚） */
    if (PROPS['candle'] && !G.hideProps && !(G.beat && G.beat.diary)) {
      var cw2 = ((G.propPos && G.propPos.candle) || {w:150}).w, ch4 = cw2 * (PROPS['candle'].naturalHeight || PROPS['candle'].height) / (PROPS['candle'].naturalWidth || PROPS['candle'].width);
      var cpos = (G.propPos && G.propPos.candle) || {x:286, base:742, w:150, blur:9};
      var cp = onTable(cpos.x, cpos.base, cw2, ch4);
      ctx.save(); ctx.globalAlpha = 1;
      ctx.drawImage(PROPS['candleBlur'] || PROPS['candle'], cp.x, cp.y, cp.w, cp.h);
      ctx.restore();
    }

    /* 椅背先不用：等一张更薄的侧面椅背 */
    if (false) {
      var chw = 1320, chh = chw * (FG.chair.naturalHeight || FG.chair.height) / (FG.chair.naturalWidth || FG.chair.width);
      ctx.save();
      ctx.filter = 'blur(13px)';
      ctx.globalAlpha = 0.92;
      ctx.drawImage(FG.chair, -60, 726, chw, chh);
      ctx.restore();
    }

    /* 前景杯：右下角一只虚焦的杯子 */
    if (FG.cupOk && !G.hideProps && !(G.beat && G.beat.diary)) {
      var fw2 = ((G.propPos && G.propPos.cup) || {w:300}).w, fh2 = fw2 * (FG.cup.naturalHeight || FG.cup.height) / (FG.cup.naturalWidth || FG.cup.width);
      ctx.save();
      ctx.filter = 'blur(7px)';
      ctx.globalAlpha = 0.94;
      /* 杯子底下的一团接触阴影，不然它像浮在空中 */
      ctx.save();
      var sg = ctx.createRadialGradient(14 + fw2 * 0.5, 712, 6, 14 + fw2 * 0.5, 712, fw2 * 0.62);
      sg.addColorStop(0, 'rgba(0,0,0,.62)');
      sg.addColorStop(0.55, 'rgba(0,0,0,.30)');
      sg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.ellipse(14 + fw2 * 0.5, 712, fw2 * 0.58, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      var uppos = (G.propPos && G.propPos.cup) || {x:14, base:716, w:300};
      var cp2 = onTable(uppos.x, uppos.base, fw2, fh2);
      ctx.drawImage(FG.cupBlur || FG.cup, cp2.x, cp2.y, cp2.w, cp2.h);
      ctx.restore();
    } else {
    /* 前景：右下角一只虚焦的杯子，被烛光描出一道边 */
    ctx.save();
    ctx.filter = 'blur(6px)';
    var cxp = 1300, cyp = 812, cw = 104, chh = 78;
    ctx.fillStyle = 'rgba(6,3,2,.97)';
    ctx.beginPath();
    ctx.moveTo(cxp - cw / 2, cyp - chh);
    ctx.lineTo(cxp + cw / 2, cyp - chh);
    ctx.quadraticCurveTo(cxp + cw / 2 + 6, cyp, cxp + cw / 2 - 10, cyp + 6);
    ctx.lineTo(cxp - cw / 2 + 12, cyp + 6);
    ctx.quadraticCurveTo(cxp - cw / 2 - 4, cyp, cxp - cw / 2, cyp - chh);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,178,110,.62)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(cxp, cyp - chh, cw / 2, 7, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    }

    /* 真的胶卷不是纯黑的：片基有一点雾，亮的地方会往四周洇出一圈红橙 */
    if (G.scene === 'shadow' && G.film > 0.2) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      var hx = 800, hy = 566;
      var hg = ctx.createRadialGradient(hx, hy, 8, hx, hy, 300);
      hg.addColorStop(0, 'rgba(255,104,48,.065)');
      hg.addColorStop(0.45, 'rgba(226,78,36,.035)');
      hg.addColorStop(1, 'rgba(210,60,28,0)');
      ctx.fillStyle = hg;
      ctx.beginPath(); ctx.arc(hx, hy, 300, 0, Math.PI * 2); ctx.fill();
      if (W.ball && W.ball.vis > 0.05) {
        var bx2 = W.ball.x, by2 = W.ball.y;
        var bg2 = ctx.createRadialGradient(bx2, by2, 4, bx2, by2, 190);
        bg2.addColorStop(0, 'rgba(255,140,80,.16)');
        bg2.addColorStop(0.4, 'rgba(240,80,40,.07)');
        bg2.addColorStop(1, 'rgba(220,60,30,0)');
        ctx.fillStyle = bg2;
        ctx.beginPath(); ctx.arc(bx2, by2, 190, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
      /* 片基雾：把纯黑抬起来一点点 */
      ctx.fillStyle = 'rgba(34,24,17,.030)';
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.globalCompositeOperation = 'source-over';
    }

    /* 桌面反光：烛光打在桌面上、再糊回墙面的一块暖斑，把两个人中间那块死墙救活 */
    if (G.scene === 'shadow' && G.film > 0.2) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      var bp = ctx.createRadialGradient(800, 700, 20, 800, 700, 420);
      bp.addColorStop(0, 'rgba(255,168,100,.115)');
      bp.addColorStop(0.42, 'rgba(232,132,74,.055)');
      bp.addColorStop(1, 'rgba(200,100,50,0)');
      ctx.fillStyle = bp;
      ctx.beginPath();
      ctx.ellipse(800, 650, 470, 210, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    /* 烛光本身在墙上明暗：这是"光在动"最直接的证据 */
    if (G.scene === 'shadow' && G.film > 0.2) {
      var sigW = flameSignal(t, 0.35);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      var wg = ctx.createRadialGradient(800, 560, 60, 800, 560, 760);
      wg.addColorStop(0, 'rgba(255,176,110,' + (0.030 + 0.028 * sigW).toFixed(3) + ')');
      wg.addColorStop(0.5, 'rgba(240,140,80,' + (0.012 + 0.012 * sigW).toFixed(3) + ')');
      wg.addColorStop(1, 'rgba(220,110,60,0)');
      ctx.fillStyle = wg;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.restore();
    }

    if (G.tv > 0.02) { drawTV(t, G.tv); drawTVCaption(t); }
    if (G.beat && G.beat.id === 'dream') drawDream(t);
    drawVignette();
    if (G.film > 0.01) { drawGrain(t, G.film); drawScratch(dt, t); }
    MUSIC.tick();
    if (typeof SND !== 'undefined') { var bv = (W.ball && W.ball.vis) || 0; SND.hum(bv); SND.whistle(bv); }
  /* 剪影段补一层镜头光学：整幅轻柔化再叠回，避免矢量剪影比照片还干净 */
  if (G.scene === 'shadow' && G.film > 0.2 && !LOWFX) {
    try {
      if (!window.__softCv) {
        window.__softCv = document.createElement('canvas');
        window.__softCv.width = WIDTH; window.__softCv.height = HEIGHT;
      }
      var sc2 = window.__softCv, sctx = sc2.getContext('2d');
      sctx.clearRect(0, 0, WIDTH, HEIGHT);
      sctx.drawImage(CV, 0, 0, WIDTH, HEIGHT);
      ctx.save();
      ctx.globalAlpha = 0.34;
      ctx.filter = 'blur(2.2px)';
      ctx.drawImage(sc2, 0, 0, WIDTH, HEIGHT);
      ctx.restore();
    } catch (e) {}
  }
    drawFilmFrame(t);
    drawFilmDirt(t, Math.floor(t * 24));
    /* 进度线：贴在下方片基的上沿，极淡 */
    var prog = (G.i + 1) / BEATS.length;
    ctx.fillStyle = 'rgba(255,214,160,.10)';
    ctx.fillRect(0, HEIGHT - 62, WIDTH, 1);
    ctx.fillStyle = 'rgba(255,214,160,.34)';
    ctx.fillRect(0, HEIGHT - 62, WIDTH * prog, 1);
    if (!G.segX) {
      G.segX = []; var ls = null;
      for (var si = 0; si < BEATS.length; si++) { if (BEATS[si].scene !== ls) { G.segX.push(si); ls = BEATS[si].scene; } }
    }
    for (var sd = 1; sd < G.segX.length; sd++) {
      ctx.fillStyle = 'rgba(255,214,160,.32)';
      ctx.beginPath(); ctx.arc(WIDTH * (G.segX[sd] / BEATS.length), HEIGHT - 61.5, 1.6, 0, Math.PI * 2); ctx.fill();
    }
    drawBurnEdge(G.flash, t);

    if (G.scene === 'flash') {
      if (G.after > 0.01) {
      var ag = ctx.createRadialGradient(WIDTH * 0.5, HEIGHT * 0.42, 10, WIDTH * 0.5, HEIGHT * 0.42, WIDTH * 0.62);
      ag.addColorStop(0, 'rgba(255,249,236,' + (0.20 * G.after) + ')');
      ag.addColorStop(0.55, 'rgba(255,236,206,' + (0.09 * G.after) + ')');
      ag.addColorStop(1, 'rgba(255,220,180,0)');
      ctx.fillStyle = ag; ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
    ctx.fillStyle = 'rgba(255,255,255,' + G.flash + ')';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
    if (G.black > 0.001) {
      ctx.fillStyle = 'rgba(0,0,0,' + G.black + ')';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
    /* 白光之后、耳鸣还在响的时候，提醒观众"点一下" */
    if (G.clickPrompt > 0) {
      var cpMax = G.clickPromptMax || 2.0;
      var cpPassed = cpMax - G.clickPrompt;
      var cp = Math.min(1, cpPassed / 0.9);
      cp = Math.min(cp, G.clickPrompt / 0.7);
      cp = clamp(cp, 0, 1);
      var cpA = cp * (0.50 + 0.14 * Math.sin(t * 2.2));
      ctx.save();
      ctx.globalAlpha = cpA;
      ctx.fillStyle = 'rgba(112,88,64,1)';
      ctx.font = '17px "Songti SC", "SimSun", serif';
      ctx.textAlign = 'center';
      ctx.fillText('（点一下屏幕）', WIDTH / 2, 688);
      ctx.restore();
    }
    /* 曝光轻微呼吸，像老放映机 */
    ctx.fillStyle = 'rgba(0,0,0,' + (0.028 + 0.022 * Math.sin(t * 11.3)) + ')';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.restore();

    /* 前景：蛋糕（画在压暗层之后，才不会被吃掉），带视差与不虚焦的烛火 */
    if (W.cakeFg > 0.01) {
      var cm2 = G.cam || G.camT || { x: 0, y: 0, z: 1 };
      var pgx = 250 - (cm2.x || 0) * 0.75;
      var pgz = 2.05 * (1 + ((cm2.z || 1) - 1) * 0.30);
      var pg = ctx.createRadialGradient(pgx, 610, 20, pgx, 610, 420);
      pg.addColorStop(0, 'rgba(255,158,88,' + (0.16 * W.cakeFg) + ')');
      pg.addColorStop(1, 'rgba(255,120,50,0)');
      ctx.fillStyle = pg;
      ctx.fillRect(0, 300, WIDTH, 600);
      drawCake(t, { cx: pgx, base: 826, scale: pgz, blur: 3.5 });
      drawCake(t, { cx: pgx, base: 826, scale: pgz, blur: 0, flamesOnly: true });
    }

    if (G.black < 0.95) drawTextLayer(t);

  }

  /* ---------------------------------------------------------- 结尾画面 */
  /* 月光里的浮尘：慢慢飘，只在结尾出现 */
  var motes = null;
  function drawDustMotes(t) {
    if (!motes) {
      motes = [];
      for (var i = 0; i < 44; i++) {
        motes.push({ x: rand(240, 1360), y: rand(120, 820), r: rand(0.7, 1.9),
                     sp: rand(2, 8), am: rand(0.06, 0.20), ph: rand(0, 6.28) });
      }
    }
    for (var j = 0; j < motes.length; j++) {
      var m = motes[j];
      var yy = m.y - ((t * m.sp + m.ph * 40) % 760);
      var xx = m.x + Math.sin(t * 0.5 + m.ph) * 12;
      var a = m.am * (0.55 + 0.45 * Math.sin(t * 1.6 + m.ph));
      ctx.fillStyle = 'rgba(226,238,255,' + a.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(xx, yy, m.r, 0, Math.PI * 2); ctx.fill();
    }
  }
  function drawDawn(t) {
    var k = clamp(W.dawn, 0, 1);
    var g = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    g.addColorStop(0, 'rgb(' + Math.round(lerp(10, 40, k)) + ',' + Math.round(lerp(14, 46, k)) + ',' + Math.round(lerp(26, 70, k)) + ')');
    g.addColorStop(1, 'rgb(' + Math.round(lerp(6, 18, k)) + ',' + Math.round(lerp(8, 22, k)) + ',' + Math.round(lerp(12, 32, k)) + ')');
    ctx.fillStyle = g; ctx.fillRect(0, 0, WIDTH, HEIGHT);

    /* 窗 */
    var wx = 560, wy = 150, ww = 480, wh = 420;
    ctx.fillStyle = 'rgba(0,0,0,.55)';
    ctx.fillRect(wx - 16, wy - 16, ww + 32, wh + 32);

    /* 屋檐：一条压低的斜线，把天空收住 */
    ctx.fillStyle = 'rgba(4,6,10,.92)';
    ctx.beginPath();
    ctx.moveTo(-40, 96); ctx.lineTo(WIDTH + 40, 66);
    ctx.lineTo(WIDTH + 40, -20); ctx.lineTo(-40, -20);
    ctx.closePath(); ctx.fill();
    /* 瓦口一排小暗齿 */
    for (var ei = -2; ei < 22; ei++) {
      var ex = ei * 78 - 20, ey = 96 - (ei * 78 + 20) * 0.02;
      ctx.fillStyle = 'rgba(8,10,14,.9)';
      ctx.fillRect(ex, ey - 6, 40, 9);
    }
    /* 左角一丛树影 */
    ctx.fillStyle = 'rgba(3,5,8,.9)';
    ctx.beginPath();
    ctx.arc(90, 250, 150, 0, Math.PI * 2);
    ctx.arc(210, 210, 120, 0, Math.PI * 2);
    ctx.arc(20, 150, 130, 0, Math.PI * 2);
    ctx.fill();
    var wg = ctx.createLinearGradient(wx, wy, wx, wy + wh);
    wg.addColorStop(0, 'rgb(' + Math.round(lerp(20, 120, k)) + ',' + Math.round(lerp(24, 130, k)) + ',' + Math.round(lerp(36, 150, k)) + ')');
    wg.addColorStop(1, 'rgb(' + Math.round(lerp(14, 70, k)) + ',' + Math.round(lerp(16, 70, k)) + ',' + Math.round(lerp(24, 86, k)) + ')');
    ctx.fillStyle = wg; ctx.fillRect(wx, wy, ww, wh);
    /* 月亮 */
    var mx = wx + ww * 0.68, my = wy + wh * 0.24;
    var mg = ctx.createRadialGradient(mx, my, 6, mx, my, 120);
    mg.addColorStop(0, 'rgba(240,244,255,' + (0.9 * k) + ')');
    mg.addColorStop(0.3, 'rgba(200,220,255,' + (0.22 * k) + ')');
    mg.addColorStop(1, 'rgba(160,190,255,0)');
    ctx.fillStyle = mg;
    ctx.beginPath(); ctx.arc(mx, my, 120, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(246,248,255,' + (0.92 * k) + ')';
    ctx.beginPath(); ctx.arc(mx, my, 30, 0, Math.PI * 2); ctx.fill();
    /* 窗棂 */
    ctx.fillStyle = 'rgba(6,5,4,.92)';
    ctx.fillRect(wx + ww / 2 - 6, wy, 12, wh);
    ctx.fillRect(wx, wy + wh * 0.55, ww, 12);
    /* 月光斜照 */
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    var sg = ctx.createLinearGradient(wx + ww * 0.7, wy, wx + 40, HEIGHT);
    sg.addColorStop(0, 'rgba(180,210,255,' + (0.10 * k) + ')');
    sg.addColorStop(1, 'rgba(180,210,255,0)');
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.moveTo(mx - 30, my); ctx.lineTo(mx + 40, my); ctx.lineTo(wx + 200, HEIGHT); ctx.lineTo(wx - 40, HEIGHT);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  /* ---------------------------------------------------------- 场次控制 */
  /* ---------------------------------------------------------- 音乐 */
  /* 用 <audio loop>：file:// 下能播；缺文件就静音，不报错 */
  var MUSIC = {
    el: null, name: '', vol: 0, target: 0,
    map: { shadow: 'shadow', house: 'charge', dawn: 'shadow', final: 'charge' },
    dir: 'assets/audio/',
    go: function (scene) {
      if (typeof Audio === 'undefined') return;
      var name = this.map[scene] || '';
      if (name === this.name) return;
      var old = this.el;
      if (old) {
        try { old.pause(); } catch (e) {}
      }
      this.name = name;
      if (typeof SND !== 'undefined' && SND.amb) SND.amb(name);
      this.el = null;
      this.vol = 0;
      if (!name) return;
      try {
        var a = new Audio(this.dir + name + '.mp3');
        a.loop = true;
        a.volume = 0;
        a.preload = 'auto';
        a.addEventListener('error', function () {});
        a.addEventListener('canplay', function () { SND.fileOk = true; try { SCORE.stop(); } catch (e) {} });
        var pr = a.play();
        if (pr && pr.catch) pr.catch(function () {});
        this.el = a;
      } catch (e) { this.el = null; }
    },
    tick: function () {
      if (!this.el) return;
      var goal = (SND.on && this.el.readyState >= 2) ? 0.16 : 0;
      this.vol += (goal - this.vol) * 0.03;
      try { this.el.volume = Math.max(0, Math.min(1, this.vol)); } catch (e) {}
    }
  };
  /* ---------- 配乐：程序化「Time」式（钢琴琶音 + 弦乐垫 + 低音） ---------- */
  var SCORE = {
    on: false, timer: null, nodes: [], rev: null,
    /* Am – F – C – G，每小节 8 秒 */
    chords: [
      { bass: 45, notes: [57, 60, 64, 69] },
      { bass: 41, notes: [53, 57, 60, 65] },
      { bass: 48, notes: [55, 60, 64, 67] },
      { bass: 43, notes: [55, 59, 62, 67] }
    ],
    piano: function (midi, t, dur, vel) {
      var c = SND.ctx; if (!c) return;
      var f = 440 * Math.pow(2, (midi - 69) / 12);
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vel, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      g.connect(this.dry); g.connect(this.wet);
      [1, 2, 3].forEach(function (h, i) {
        var o = c.createOscillator();
        o.type = i === 0 ? 'triangle' : 'sine';
        o.frequency.value = f * h;
        var hg = c.createGain(); hg.gain.value = [1, 0.34, 0.12][i];
        o.connect(hg); hg.connect(g);
        o.start(t); o.stop(t + dur + 0.05);
        SCORE.nodes.push(o);
      });
    },
    string: function (midi, t, dur, vel) {
      var c = SND.ctx; if (!c) return;
      var f = 440 * Math.pow(2, (midi - 69) / 12);
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vel, t + dur * 0.38);
      g.gain.linearRampToValueAtTime(vel * 0.72, t + dur * 0.72);
      g.gain.linearRampToValueAtTime(0.0001, t + dur);
      var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1500; lp.Q.value = 0.6;
      g.connect(lp); lp.connect(this.dry); lp.connect(this.wet);
      [-6, 6].forEach(function (cents) {
        var o = c.createOscillator();
        o.type = 'sawtooth';
        o.frequency.value = f;
        o.detune.value = cents;
        o.connect(g);
        o.start(t); o.stop(t + dur + 0.05);
        SCORE.nodes.push(o);
      });
    },
    bass: function (midi, t, dur, vel) {
      var c = SND.ctx; if (!c) return;
      var o = c.createOscillator(); o.type = 'sine';
      o.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vel, t + 0.5);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(this.dry);
      o.start(t); o.stop(t + dur + 0.05);
      SCORE.nodes.push(o);
    },
    drone: function (midi, t, dur, vel) {
      var c = SND.ctx; if (!c) return;
      var o = c.createOscillator(); o.type = 'sawtooth';
      o.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
      var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 320; lp.Q.value = 0.4;
      var g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(vel, t + 1.6);
      g.gain.linearRampToValueAtTime(vel * 0.85, t + dur * 0.8);
      g.gain.linearRampToValueAtTime(0.0001, t + dur);
      o.connect(lp); lp.connect(g); g.connect(this.dry); g.connect(this.wet);
      o.start(t); o.stop(t + dur + 0.05);
      SCORE.nodes.push(o);
    },
    bell: function (midi, t, vel) {
      var c = SND.ctx; if (!c) return;
      var f = 440 * Math.pow(2, (midi - 69) / 12);
      [1, 2.76, 5.4].forEach(function (ratio, i) {
        var o = c.createOscillator(); o.type = 'sine';
        o.frequency.value = f * ratio;
        var g = c.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vel / (i + 1), t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 3.4 - i * 0.8);
        o.connect(g); g.connect(SCORE.wet);
        o.start(t); o.stop(t + 3.6);
        SCORE.nodes.push(o);
      });
    },
    impulse: function (c, sec, decay) {
      var n = Math.floor(c.sampleRate * sec);
      var b = c.createBuffer(2, n, c.sampleRate);
      for (var ch = 0; ch < 2; ch++) {
        var d = b.getChannelData(ch);
        for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay);
      }
      return b;
    },
    setup: function () {
      var c = SND.ctx; if (!c || this.dry || !c.createGain) return;
      /* 磁带底噪：很轻的一层沙，撑住安静的地方 */
      var nb = this.impulse(c, 4, 0.2);
      var ns = c.createBufferSource(); ns.buffer = nb; ns.loop = true;
      var nf = c.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 3200; nf.Q.value = 0.5;
      var ng = c.createGain(); ng.gain.value = 0.012;
      ns.connect(nf); nf.connect(ng); ng.connect(SND.master);
      ns.start(); this.hiss = ns;
      this.dry = c.createGain(); this.dry.gain.value = 0.30;
      this.wet = c.createGain(); this.wet.gain.value = 0.26;
      this.dry.connect(SND.master);
      var cv = c.createConvolver();
      cv.buffer = this.impulse(c, 3.4, 2.6);
      this.wet.connect(cv); cv.connect(SND.master);
    },
    loop: function () {
      if (!this.on || !SND.ctx) return;
      var c = SND.ctx, t0 = c.currentTime + 0.08;
      var BAR = 8, self = this;
      this.chords.forEach(function (ch, bi) {
        var t = t0 + bi * BAR;
        self.bass(ch.bass, t, BAR * 0.96, 0.10);
        self.drone(ch.bass - 12, t, BAR * 1.02, 0.045);
        self.drone(ch.bass, t, BAR * 1.02, 0.020);
        self.bell(ch.notes[3] + 12, t + 1.2, 0.035);
        self.bell(ch.notes[2] + 24, t + 5.4, 0.022);
        ch.notes.forEach(function (m, ni) {
          self.string(m, t, BAR * 0.98, 0.030 + ni * 0.004);
        });
        /* 钢琴琶音：每小节 16 个八分音符，起音略有人味 */
        for (var k = 0; k < 16; k++) {
          var m = ch.notes[k % ch.notes.length] + (k % 8 === 3 ? 12 : 0);
          var dt = t + k * 0.5 + (Math.random() - 0.5) * 0.02;
          var vel = (k % 4 === 0 ? 0.105 : 0.062) * (0.85 + Math.random() * 0.3);
          self.piano(m, dt, 2.1 + Math.random() * 0.5, vel);
        }
      });
      clearTimeout(this.timer);
      this.timer = setTimeout(function () { SCORE.loop(); }, (this.chords.length * BAR - 0.5) * 1000);
    },
    start: function () {
      if (this.on || !SND.ctx || !SND.ctx.createGain) return;
      if (this.fileOk) return;              /* 有真音频文件就让文件优先 */
      this.setup();
      this.on = true;
      this.loop();
    },
    stop: function () {
      this.on = false;
      clearTimeout(this.timer);
      this.nodes.forEach(function (o) { try { o.stop(0); } catch (e) {} });
      this.nodes.length = 0;
    },
    duck: function (k) {
      if (!this.on || !SND.ctx || !this.dry) return;
      var g = this.dry.gain, now = SND.ctx.currentTime;
      g.cancelScheduledValues(now);
      g.setValueAtTime(0.30 * k, now);
      g.linearRampToValueAtTime(0.30, now + 3.2);
    }
  };
  /* 墙上的挂钟：剪影，跟画一起把墙撑起来 */
  function drawClock(t) {
    if (G.scene !== 'shadow' && G.scene !== 'statue') return;
    var cx = 392, cy = 208, r = 52;
    ctx.save();
    var sh = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 1.9);
    sh.addColorStop(0, 'rgba(255,176,110,.12)');
    sh.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sh;
    ctx.beginPath(); ctx.arc(cx, cy, r * 1.9, 0, Math.PI * 2); ctx.fill();
    /* 外框（木）与表盘 */
    ctx.fillStyle = 'rgba(30,20,13,.92)';
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,196,140,.22)'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(cx, cy, r - 1.2, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(214,190,158,.20)';
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.80, 0, Math.PI * 2); ctx.fill();
    /* 刻度 */
    ctx.strokeStyle = 'rgba(240,222,196,.30)'; ctx.lineWidth = 1;
    for (var i = 0; i < 12; i++) {
      var a = i / 12 * Math.PI * 2;
      var r1 = r * 0.68, r2 = r * 0.76;
      ctx.beginPath();
      ctx.moveTo(cx + Math.sin(a) * r1, cy - Math.cos(a) * r1);
      ctx.lineTo(cx + Math.sin(a) * r2, cy - Math.cos(a) * r2);
      ctx.stroke();
    }
    /* 指针：秒针按真实时间，分针慢走 */
    var now = new Date();
    var sec = now.getSeconds() + now.getMilliseconds() / 1000;
    var min = now.getMinutes() + sec / 60;
    function hand(ang, len, wid, alpha) {
      ctx.strokeStyle = 'rgba(244,228,204,' + alpha + ')';
      ctx.lineWidth = wid; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.sin(ang) * len, cy - Math.cos(ang) * len);
      ctx.stroke();
    }
    hand(min / 60 * Math.PI * 2, r * 0.52, 2.6, 0.52);
    hand(sec / 60 * Math.PI * 2, r * 0.62, 1.3, 0.34);
    ctx.fillStyle = 'rgba(20,13,9,.95)';
    ctx.beginPath(); ctx.arc(cx, cy, 3.2, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  /* 胶片叠加素材：按 24fps 一格格重撒，灰尘/毛屑/划痕/乳液斑/曝光跳 */
  function drawFilmDirt(t, fr) {
    if (LOWFX) return;
    if (G.film < 0.4) return;
    var a0 = 0.9 * G.film;
    var r = mulberry(fr * 7 + 13);
    /* 1. 灰尘：每格 6–12 粒，黑白都有，随格跳动 */
    var n = 6 + Math.floor(r() * 7);
    for (var i = 0; i < n; i++) {
      var x = r() * WIDTH, y = 62 + r() * (HEIGHT - 124);
      var rad = 0.7 + r() * 1.6;
      var dark = r() > 0.45;
      ctx.fillStyle = dark ? 'rgba(12,9,6,' + (0.30 * a0).toFixed(3) + ')' : 'rgba(255,246,230,' + (0.22 * a0).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
    }
    /* 2. 毛屑：两三条细短的曲线，只在少数格出现 */
    if (r() > 0.55) {
      var hn = 1 + Math.floor(r() * 2);
      for (var k = 0; k < hn; k++) {
        var x0 = r() * WIDTH, y0 = 80 + r() * (HEIGHT - 160);
        var len = 12 + r() * 34, bend = (r() - 0.5) * 40;
        ctx.strokeStyle = 'rgba(10,7,5,' + (0.26 * a0).toFixed(3) + ')';
        ctx.lineWidth = 0.9;
        ctx.beginPath(); ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(x0 + len * 0.5, y0 + bend, x0 + len, y0 + bend * 0.4);
        ctx.stroke();
      }
    }
    /* 3. 划痕：不是一格格闪的短线，是「跑好几秒、边跑边轻微游走」的竖线 */
    drawScratches(t);
    /* 4. 乳液斑/水渍：大而软的低频斑块，缓慢移动 */
    var bt = Math.floor(t * 0.7);
    for (var b = 0; b < 3; b++) {
      var rb = mulberry(bt * 31 + b * 7 + 3);
      var bx = rb() * WIDTH, by = 60 + rb() * (HEIGHT - 120);
      var brx = 90 + rb() * 220, bry = 60 + rb() * 140;
      var bg = ctx.createRadialGradient(bx, by, 0, bx, by, Math.max(brx, bry));
      bg.addColorStop(0, 'rgba(255,238,214,' + (0.012 * a0).toFixed(4) + ')');
      bg.addColorStop(1, 'rgba(255,238,214,0)');
      ctx.fillStyle = bg;
      ctx.save(); ctx.translate(bx, by); ctx.scale(1, bry / Math.max(brx, bry));
      ctx.beginPath(); ctx.arc(0, 0, Math.max(brx, bry), 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    /* 5. 曝光跳：偶尔整格亮一点或暗一点，像老放映机的电弧不稳 */
    if (r() > 0.80) {
      var fl = (r() - 0.5) * 0.05;
      ctx.fillStyle = fl > 0 ? 'rgba(255,244,226,' + fl.toFixed(3) + ')' : 'rgba(0,0,0,' + (-fl).toFixed(3) + ')';
      ctx.fillRect(0, 62, WIDTH, HEIGHT - 124);
    }
  }

  /* 划痕：一条划痕要在胶片上活一两秒，游走、忽明忽暗，才是「划痕」而不是「噪线」 */
  var SCRATCH = { list: [], next: 0, seeded: false };
  function updateScratches(t) {
    if (!SCRATCH.seeded) {
      SCRATCH.seeded = true;
      /* 两条常驻的老划痕：底片本来就带着伤 */
      SCRATCH.list.push({ x: WIDTH * 0.13, t0: -9, life: 999, w: 1.0, a: 0.055, drift: 1.2, bright: true, phase: 0.7 });
      SCRATCH.list.push({ x: WIDTH * 0.71, t0: -9, life: 999, w: 1.4, a: 0.040, drift: -0.8, bright: false, phase: 2.1 });
    }
    if (t > SCRATCH.next) {
      SCRATCH.next = t + 1.7 + Math.random() * 3.6;
      SCRATCH.list.push({
        x: Math.random() * WIDTH,
        t0: t,
        life: 1.1 + Math.random() * 3.4,
        w: 0.9 + Math.random() * 1.3,
        a: 0.12 + Math.random() * 0.26,
        drift: (Math.random() - 0.5) * 14,
        bright: Math.random() > 0.34,
        phase: Math.random() * 6.28
      });
    }
    SCRATCH.list = SCRATCH.list.filter(function (s2) { return t - s2.t0 < s2.life; });
  }
  function drawScratches(t) {
    updateScratches(t);
    var film = (G.film || 0);
    if (film < 0.4) return;
    SCRATCH.list.forEach(function (s2) {
      var age = (t - s2.t0) / s2.life;
      var fadeIn = Math.min(1, (t - s2.t0) / 0.22);
      var fadeOut = Math.min(1, Math.max(0, (1 - age) / 0.18));
      var flick = 0.62 + 0.38 * Math.sin(t * (6.5 + (s2.phase || 0)) + s2.phase);
      var a = s2.a * fadeIn * fadeOut * flick * film;
      if (a <= 0.004) return;
      var x = s2.x + (s2.drift || 0) * age + Math.sin(t * 0.9 + s2.phase) * 1.6;
      var col = s2.bright ? '255,246,232' : '12,9,6';
      ctx.save();
      ctx.lineCap = 'round';
      /* 线身：分 8 段画，每段轻微左右游走，看起来像被刮出来的 */
      for (var i = 0; i < 8; i++) {
        var y1 = 62 + (HEIGHT - 124) * (i / 8);
        var y2 = 62 + (HEIGHT - 124) * ((i + 1) / 8);
        var j1 = Math.sin(t * 3.1 + i * 1.7 + s2.phase) * 0.9;
        var j2 = Math.sin(t * 3.1 + (i + 1) * 1.7 + s2.phase) * 0.9;
        ctx.strokeStyle = 'rgba(' + col + ',' + a.toFixed(4) + ')';
        ctx.lineWidth = s2.w;
        ctx.beginPath(); ctx.moveTo(x + j1, y1); ctx.lineTo(x + j2, y2); ctx.stroke();
      }
      /* 亮划痕带一圈很淡的光晕，像乳剂被刮掉露白 */
      if (s2.bright) {
        ctx.lineWidth = s2.w * 3.2;
        ctx.strokeStyle = 'rgba(' + col + ',' + (a * 0.22).toFixed(4) + ')';
        ctx.beginPath(); ctx.moveTo(x, 62); ctx.lineTo(x, HEIGHT - 62); ctx.stroke();
      }
      ctx.restore();
    });
  }

  function mulberry(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function setScene(name, kind) {

    var prevScene = G.scene;
  G.scene = name;
  if (prevScene && prevScene !== name) G.black = Math.max(G.black, 0.80);
  if (typeof SND !== 'undefined' && SND.filmStart) { if (name === 'shadow') SND.filmStart(); else SND.filmStop(); }
  if (prevScene && prevScene !== name && name === 'house' && typeof SND !== 'undefined' && SND.step) { SND.step(); setTimeout(function () { SND.step(); }, 220); }
    if (name === 'house') W.house.kind = kind || '';
  if (name === 'house') { try { SCORE.duck(0.45); } catch (e) {} }
    if (typeof MUSIC !== 'undefined') MUSIC.go(name);
  }
  function setFilm(v) { G.film = v; }
  function blackout(v) { G.black = v; }

  function spawnAsh(n, x0, x1, y0, y1, color) {
    for (var i = 0; i < n; i++) {
      parts.push({
        x: rand(x0, x1), y: rand(y0, y1),
        vx: rand(-14, 14), vy: rand(-10, 26), g: rand(0.5, 1.2),
        s: rand(1, 3.2), life: rand(1.6, 4.2), max: 4.2,
        c: color || 'rgba(214,208,196,1)'
      });
    }
  }

  /* ---------------------------------------------------------- 节拍表 */
  function beat(o) { return o; }
  var BEATS = [];

  /* ——— 段 3 影子戏 ——— */
  BEATS.push(beat({
    id: 'open', scene: 'shadow', hold: true,
    onEnter: function () {
      TGT.ball.vis = 0; W.marble = 0;
      TGT.mom.lean = 0; TGT.dad.lean = 0;
      G.hint = '点一下开始';
      SND.rain(0.85);
    },
    text: '我们三个围着十四个小火苗坐下来，我才想起这事。'
  }));

  BEATS.push(beat({
    id: 'rain', scene: 'shadow', who: '旁白',
    text: '这是个雷雨之夜。闪电太密集了，我已经分不出哪声雷属于哪个闪电。',
    onEnter: function () { },
    update: function (bt) { if (bt > 0.4 && bt < 0.5) SND.rain(0.9); }
  }));

  BEATS.push(beat({
    id: 'home', scene: 'shadow', who: '旁白',
    text: '在这狂暴的雷雨之夜，最能体会出家的珍贵。外面是暴雨和雷电，家的温暖怀抱让人陶醉。你会同情外面那些在暴雨和雷电下发抖的、没有家的生灵，你想打开窗子让它们飞进来——但你不敢。'
  }));

  BEATS.push(beat({
    id: 'dad-opening', scene: 'shadow', who: '爸爸', hold: true,
    onEnter: function () { TGT.dad.lean = -3; },
    text: '人生啊，人生这东西……变幻莫测，一切都是概率和机遇，就像在一条小溪中漂着的一只纸船，或者让一个小旋涡圈住了……'
  }));

  BEATS.push(beat({
    id: 'mom-small', scene: 'shadow', who: '妈妈',
    text: '孩子还小，听不懂这些。'
  }));

  BEATS.push(beat({
    id: 'dad-not-small', scene: 'shadow', who: '爸爸',
    onEnter: function () { TGT.dad.lean = -1; },
    text: '他不小了！他已到了可以知道人生真相的时候了！'
  }));

  BEATS.push(beat({
    id: 'mom-snark', scene: 'shadow', who: '妈妈',
    onEnter: function () { TGT.mom.lean = 4; },
    text: '你自己好像知道似的。'
  }));

  /* 三个词：数学 / 画画 / 葛朗台 */
  BEATS.push(beat({
    id: 'dad-mind', scene: 'shadow', who: '爸爸', hold: true,
    onEnter: function () { TGT.mom.lean = 0; TGT.dad.lean = -2; G.chipsReady = true; G.hint = '点开他说的那三样'; },
    text: '其实，儿子，过一个美妙的人生并不难……美妙人生的关键在于你能迷上什么东西。',
    chips: [
      { key: 'math', label: '数学', line: '你选一个公认的世界难题，最好是只用一张纸和一枝铅笔的，比如哥德巴赫猜想……投入全部身心钻研，只问耕耘不问收获，一辈子也就过去了。' },
      { key: 'paint', label: '画画', line: '比如我——我迷上了画画，虽然知道自己成不了梵高。' },
      { key: 'gold', label: '葛朗台', line: '或是相反，把挣钱作为惟一的目标……到死的时候像葛朗台一样抱着一堆金币说：啊，真暖和啊……' }
    ]
  }));

  BEATS.push(beat({
    id: 'mom-idealist', scene: 'shadow', who: '妈妈', hold: true,
    onEnter: function () { G.chipsReady = false; TGT.mom.lean = 6; TGT.dad.lean = 0; },
    text: '是啊，理想主义者和玩世不恭的人都觉得对方很可怜，可他们实际都很幸运。'
  }));

  /* 头发：三下 */
  BEATS.push(beat({
    id: 'philosophers', scene: 'shadow', who: '旁白',
    text: '平时成天忙碌的爸爸妈妈，这时都变成了哲学家，倒好像这是他们在过生日。'
  }));

  BEATS.push(beat({
    id: 'hair-1', scene: 'shadow', who: '我', hold: true,
    onEnter: function () {
      G.hint = '点妈妈的头，拔那根白头发';
      var _k = (G.beatPoseKey && G.beatPoseKey[G.beat.id] || {}).mom || null;
      var _c = (_k && PEOPLE.poseCfg[_k]) || PEOPLE.cfg.mom;
      var _bo = _k && G.beatPose && G.beatPose[G.beat.id] && G.beatPose[G.beat.id][_k];
      var _x = _bo ? _bo.x : _c.x, _y = _bo ? _bo.y : _c.y, _w = _bo ? _bo.w : _c.w;
      G.hotspot = { x: _x + _w * 0.52, y: _y + 78 + 46, r: 120 };
      TGT.dad.armR = { a1: 122, a2: 40 };
      TGT.dad.lean = -6;
    },
    text: '“妈，别动！”',
    onHit: function () { advance(); }
  }));

  BEATS.push(beat({
    id: 'hair-2', scene: 'shadow', who: '旁白', hold: true,
    onEnter: function () {
      G.hint = '把头发递给爸爸';
      var dc = PEOPLE.poseCfg.dadHold;
      G.hotspot = { x: dc.x + dc.w * 0.40, y: dc.y + 140, r: 160 };
      TGT.dad.armL = { a1: 122, a2: 40 };
      TGT.dad.armR = { a1: 44, a2: 18 };
      TGT.dad.lean = -8;
    },
    text: '我从妈妈乌黑浓密的头发中拔出一根白头发，只白了一半，另一半还黑着。',
    onHit: function () { advance(); }
  }));

  BEATS.push(beat({
    id: 'hair-3', scene: 'shadow', who: '爸爸', hold: true,
    onEnter: function () {
      G.hint = '';
      G.hotspot = null;
      TGT.dad.armL = { a1: 122, a2: 40 };
      TGT.dad.armR = { a1: 44, a2: 18 };
      TGT.dad.lean = -6;
    },
    text: '据我所知，这是你妈妈有生以来长出的第一根白发。闪电中，它像灯丝似的发出光来。'
  }));

  BEATS.push(beat({
    id: 'hair-3', scene: 'shadow', who: '爸爸', hold: true,
    onEnter: function () {
      G.hint = '';
      TGT.dad.armR = { a1: 150, a2: 22 };
      TGT.dad.lean = -10;
    },
    text: '“你看，像灯丝。”',
  }));

  BEATS.push(beat({
    id: 'mom-angry', scene: 'shadow', who: '妈妈',
    onEnter: function () { TGT.dad.armR = { a1: 40, a2: 20 }; TGT.mom.lean = 10; },
    text: '干什么嘛你！拔一根要长七根的！'
  }));

  BEATS.push(beat({
    id: 'dad-candles', scene: 'shadow', who: '爸爸',
    onEnter: function () { TGT.mom.lean = 0; TGT.dad.armR = { a1: 76, a2: 6 }; G.candleGlow = 1.4; },
    text: '想想真让你点着了，然后你离开，远远地你看着那火苗有什么感觉？孩子，这就是生命和人生，脆弱而飘忽不定，经不起一丝微风。'
  }));

  BEATS.push(beat({
    id: 'silent', scene: 'shadow', auto: 3.2,
    onEnter: function () { TGT.dad.armR = { a1: 8, a2: 18 }; G.hint = ''; },
    text: '我们三个都默默无语地看着那一簇小火苗，看着它们从窗外射入的冰冷的青色电光中颤抖，像是看着我们精心培育的一窝小生命。'
  }));

  /* ——— 段 4 它来了 ——— */
  BEATS.push(beat({
    id: 'ball-in', scene: 'shadow', auto: 4.6, cam: { x: -75, y: 175, z: 2.0 },
    onEnter: function () {
      TGT.ball.vis = 0;
      G.black = 0.25;
      G.red = 0.55;
      setTimeout(function () {
        TGT.ball.x = 946; TGT.ball.y = 196; TGT.ball.r = 34; TGT.ball.vis = 1;
        SND.hum(0.8);
      }, 300);
      setTimeout(function () { TGT.ball.x = 992; TGT.ball.y = 168; }, 1800);
    },
    text: '这时它来了，是穿墙进来的。它从墙上那幅希腊众神狂欢的油画旁出现，仿佛是来自画中的一个幽灵。'
  }));

  BEATS.push(beat({
    id: 'ball-body', scene: 'shadow', auto: 5.4,
    onEnter: function () {
      TGT.ball.vis = 1; TGT.ball.x = 880; TGT.ball.y = 176; TGT.ball.r = 34;
      W.ball.vis = 1; W.ball.x = 880; W.ball.y = 176; W.ball.r = 34;
      W.ball.stars = 1;
      if (G.red < 0.2) G.red = 0.45;
    },
    text: '它有篮球大小，发着朦胧的红光。它在我们的头顶上轻盈地飘动着，身后拖着一条发出暗红色光芒的尾迹，那尾迹在我们上方划出一条令人迷惑的复杂曲线。它飘动时发出一种啸叫，低沉中透着尖利，让人想到在太古的荒原上，一个鬼魂在吹着埙。'
  }));

  BEATS.push(beat({
    id: 'mom-grab', scene: 'shadow', auto: 3.8,
    onEnter: function () {
      /* 三下快门：起身 → 前倾 → 抓住。第三帧停住，接雕像。 */
      var frames = [
        { lean: -6, armR: { a1: 46, a2: 10 } },
        { lean: 9, armR: { a1: 72, a2: 16 } },
        { lean: 13, armR: { a1: 84, a2: 30 } }
      ];
      TGT.dad.armL = { a1: 28, a2: 8 };
      TGT.mom.x = 700;
      var lastK = -1;
      this.update = function (bt) {
        var k = bt < 0.15 ? -1 : bt < 0.80 ? 0 : bt < 1.80 ? 1 : 2;
        if (k < 0 || k === lastK) return;
        /* 第三下就是妈妈扑到身上的那一下 */
        G.shake = 9;
        G.shotK = k;
        lastK = k;
        W.mom.lean = frames[k].lean;
        W.mom.armR = { a1: frames[k].armR.a1, a2: frames[k].armR.a2 };
        TGT.mom.lean = frames[k].lean;
        TGT.mom.armR = { a1: frames[k].armR.a1, a2: frames[k].armR.a2 };
        G.flash = 0.46;
        SND.shutter(k === 2 ? 0.85 : 1);
      };
      G.shotK = -1;
      G.hint = '';
    },
    text: '妈妈惊恐地用双手抓住爸爸，我恨她这个动作恨了一辈子——如果她没有那样做，我以后可能至少还有一个亲人。'
  }));

  BEATS.push(beat({
    id: 'hover', scene: 'shadow', hold: true,
    onEnter: function () {
      TGT.ball.x = 890; TGT.ball.y = 250; TGT.ball.r = 34; TGT.ball.vis = 1;
      W.ball.stars = 1;
      G.hint = '';
    },
    text: '它悬停在爸爸头顶上半米处。它的内部有无限深，不断有大群蓝色的小星星飞出——虽然内部温度高得可怕，表面却是冷凉的。'
  }));

  BEATS.push(beat({
    id: 'reach', scene: 'shadow', hold: true,
    onEnter: function () {
      TGT.dad.armR = { a1: 152, a2: 18 };
      TGT.dad.armL = { a1: 28, a2: 8 };
      TGT.dad.lean = -8;
      TGT.ball.x = 874; TGT.ball.y = 232;
      SND.hum(1);
    },
    text: '爸爸向上伸出手。他显然并不是去摸它，而是想护住自己的头部。当他的手伸到最高点时，似乎产生了一种吸力，把它吸到手上。'
  }));

  BEATS.push(beat({
    id: 'flash', scene: 'flash', auto: 3.2,
    onEnter: function () {
      G.flash = 1; G.after = 1; G.film = 0; G.clickPrompt = 4.2; G.clickPromptMax = 4.2; SND.boom(); SND.hum(0); if (SND.whistle) SND.whistle(0); if (SND.whine) SND.whine();
      TGT.ball.vis = 0;
    },
    text: '一道炫目的白炽，一声巨响，仿佛世界在身边爆炸。',
    update: function (bt) {
      if (bt < 0.16) G.flash = 1;
      else if (bt < 0.50) G.flash = 0.86;
      else if (bt < 1.30) G.flash = 0.86 - (bt - 0.50) * 0.45;
      else if (bt < 2.20) G.flash = 0.50 - (bt - 1.30) * 0.42;
      else if (bt < 3.00) G.flash = 0.12 - (bt - 2.20) * 0.13;
      else G.flash = Math.max(0, 0.07 - (bt - 3.40) * 0.12);
    },
  }));

  /* ——— 段 5 白光与灰 ——— */
  BEATS.push(beat({
    id: 'statue', scene: 'statue', hold: true,
    onEnter: function () {
      G.marbleT = 0;
      G.crackT = 0;
      W.marble = 0;
      G.clickPrompt = 1.4; G.clickPromptMax = 1.4;
      TGT.dad.armR = { a1: 152, a2: 18 };
      TGT.dad.armL = { a1: 28, a2: 8 };
      TGT.dad.lean = -8;
      TGT.mom.lean = 13;
      TGT.mom.x = 660;
      TGT.mom.armR = { a1: 84, a2: 30 };
      G.film = 0;
      SND.rain(0.25);
      G.coolK = 0;
    },
    update: function (bt, dt) {
      /* 影子先在光里"凝固"，再从黑褪成石色，慢一点点 */
      G.coolK = clamp((W.marble - 0.25) / 0.6, 0, 1);
      G.marbleT = Math.min(1.4, (G.marbleT || 0) + dt);
      var k = clamp((G.marbleT - 0.30) / 1.70, 0, 1);
      W.marble = k * k * (3 - 2 * k);
      G.crackT = Math.max(0, (G.marbleT - 1.0));
    },
    text: '当眼睛因强光造成的暗雾散去后，我看到了将伴随我一生的景象：爸爸的手仍旧向上举着，妈妈仍旧倾身用双手抓着爸爸的另一只手臂。那是一种大理石的颜色。'
  }));

  BEATS.push(beat({
    id: 'call', scene: 'statue', hold: true,
    onEnter: function () { W.marble = 1; G.marbleT = 1.4; G.crackT = 0.6; G.tv = 1; G.coolK = 1; SND.hum(0); },
    text: '“爸！”我喊了一声。没有回答。\n“妈！”我又喊了一声。没有回答。'
  }));

  BEATS.push(beat({
    id: 'fear', scene: 'statue', who: '旁白',
    onEnter: function () {
      W.marble = 1; G.marbleT = 1.4; G.crackT = 1.2; G.clickPrompt = 0; G.coolK = 1;
      TGT.dad.armR = { a1: 152, a2: 18 };
      TGT.dad.armL = { a1: 28, a2: 8 };
      TGT.dad.lean = -8;
      TGT.mom.lean = 13;
      TGT.mom.x = 660;
      TGT.mom.armR = { a1: 84, a2: 30 };
    },
    text: '我向那两尊雕像靠过去。这是我一生中最恐惧的时刻。以前我经历过的恐惧大多在梦中，而我没有在噩梦中精神崩溃，是因为意识深处总有一个声音仍醒着——现在它不在了。'
  }));

  BEATS.push(beat({
    id: 'touch', scene: 'statue', hold: true,
    onEnter: function () {
      G.tv = 0;
      G.hint = '点爸爸的肩膀';
      var ds = PEOPLE.poseCfg.dadShield;
      G.hotspot = { x: ds.x + ds.w * 0.58, y: ds.y + 268, r: 150 };
    },
    text: '我伸出颤抖的手，去触碰爸爸的身体。当我的手接触到他肩部那灰白色的表面时，感觉像是穿透了一层极薄极脆的薄壳。',
    onHit: function () { advance(); }
  }));

  BEATS.push(beat({
    id: 'collapse', scene: 'statue', auto: 3.6,
    onEnter: function () {
      spawnAsh(160, 560, 1040, 140, 600);
      G.hint = '';
    },
    update: function (bt) {
      /* 石头不褪色，是塌掉：先矮、再碎，最后只剩灰 */
      W.marble = 1;
      G.dissolve = clamp((bt - 0.25) / 1.15, 0, 1);
      if (bt > 1.2) W.ash = clamp((bt - 1.2) / 0.8, 0, 1);
      if (G.dissolve >= 1) G.hideParents = 1;
    },
    text: '两尊雕像在我眼前坍塌下去，像一场微型的雪崩。地毯上出现了两堆白灰，除此之外什么都没有了。'
  }));

  BEATS.push(beat({
    id: 'ash', scene: 'shadow', hold: true,
    onEnter: function () {
      G.hideParents = 1; G.hideProps = 1; G.dissolve = 1;
      W.ash = 1; W.marble = 0;
      G.ashAmt = 0; G.wiped = 0;
      W.mom.lean = 0; W.dad.lean = 0;
      TGT.mom.lean = 0; TGT.dad.lean = 0;
      G.film = 0.5;
    },
    update: function (bt) { G.ashAmt = clamp(bt / 0.9, 0, 1); },
    text: '我茫然四顾。'
  }));

  /* ——— 段 6 房屋调查 ——— */
  BEATS.push(beat({
    id: 'stool', scene: 'house', hold: true, still: 'stoolBefore', cue: [0.56, 0.40],
    onEnter: function () { G.hideProps = 1; setScene('house', 'stool'); W.house.p = 0; G.hint = '点一下'; },
    text: '但他们坐过的木凳还在那里，上面也落了一层灰。'
  }));

  BEATS.push(beat({
    id: 'stool-wipe', scene: 'house', hold: true, still: 'stool', cue: [0.62, 0.52],
    onEnter: function () { G.hideProps = 1; setScene('house', 'stool'); G.hint = '点一下'; },
    text: '我拂去上面的灰——在火葬厂的炉子中，要把人体完全化为灰烬，要在两千度的高温下烧三十分钟，所以这是梦。'
  }));

  BEATS.push(beat({
    id: 'shelf', scene: 'house', hold: true, close: 'shelf', hotspot: { x: 800, y: 460, r: 280 }, cue: [0.50, 0.44],
    onEnter: function () { setScene('house', 'shelf'); W.house.p = 0; G.hint = '点抽屉'; },
    update: function (bt) { W.house.p = clamp(bt / 1.2, 0, 1); },
    text: '有烟从书架中冒出来，玻璃门的书架中充满了白烟。里面的书约有三分之一变成灰烬，但书架没有任何烧过的痕迹。这是梦。'
  }));

  BEATS.push(beat({
    id: 'fridge', scene: 'house', hold: true, close: 'fridge', hotspot: { x: 800, y: 430, r: 250 }, cue: [0.52, 0.50],
    onEnter: function () { setScene('house', 'fridge'); W.house.p = 0; G.hint = '拉开冰箱门'; },
    update: function (bt) { W.house.p = clamp(bt / 2.2, 0, 1); },
    text: '一股蒸汽从半开的冰箱中冒出。里面的生冻鸡已变成熟的，发出一股香味，还有那些生对虾。这是梦。'
  }));

  BEATS.push(beat({
    id: 'jacket', scene: 'house', hold: true, close: 'jacket', hotspot: { x: 758, y: 430, r: 150 }, cue: [0.47, 0.46],
    onEnter: function () { setScene('house', 'jacket'); W.house.p = 0; },
    update: function (bt) { W.house.p = clamp(bt / 3.0, 0, 1); },
    text: '一片灰烬从我的身上散落下来：里面的背心被烧成了灰，外面的夹克好好的，装在里面的掌上机已变成一团熔化塑料。这的确是梦，好奇妙的梦啊！'
  }));

  /* ——— 段 7 结尾 ——— */
  BEATS.push(beat({
    id: 'dream', scene: 'house', hold: true, text: '',
    auto: 8.2,
    onEnter: function () {
      G.dreamT = 0; G.hint = '';
      if (typeof SND !== 'undefined') { SND.hum(0); SND.rain(0.2); }
      if (typeof SCORE !== 'undefined' && SCORE.mute) SCORE.mute();
    },
    update: function (bt) { G.ashAmt = 1; G.wiped = clamp((bt - 0.8) / 1.1, 0, 1); },

  }));

  BEATS.push(beat({
    id: 'rain-stop', scene: 'dawn', hold: true,
    onEnter: function () {
      setScene('dawn'); W.dawn = 0; W.rainLevel = 0.2; SND.rain(0.05);
      G.film = 0;
      G.hint = '';
    },
    update: function (bt) { W.dawn = clamp(bt / 3.5, 0, 1); },
    text: '外面的雷声弱了，闪电少了，后来雨停了。月亮从云缝中探出来，把一抹神秘的银光投进窗户。'
  }));

  BEATS.push(beat({
    id: 'dawn', scene: 'dawn', hold: true, diary: true,
    onEnter: function () { W.dawn = 1; },
    text: '不知过了多长时间，窗外的朝阳唤醒了我。我木然地站起身，拿起书包去上学。因为我的两眼一直木然地看着无限远方。'
  }));

  BEATS.push(beat({
    id: 'final', scene: 'final', hold: true,
    onEnter: function () { W.dawn = 1; G.hint = ''; },
    text: '一周后，我的精神基本恢复正常。记起来的第一件事，是我的生日——蜡烛一根都不插。那是我的新生之夜，以后的我再也不是以前那个我了。'
  }));

  BEATS.push(beat({
    id: 'epilogue', scene: 'dawn', hold: true, final: true, diary: true,
    onEnter: function () { W.dawn = 1; G.hint = ''; },
    text: '像爸爸在生命的最后时刻说的那样，我迷上了一样东西。我要去经历他所说的美妙人生了。'
  }));

  /* ---------------------------------------------------------- 节拍机 */
  function startBeat(i) {
    if (i < 0 || i >= BEATS.length) return;
    G.i = i;
    G.beat = BEATS[i];
    G.bt = 0;
    G.text = G.beat.text || '';
    G.dissolve = 0;
    G.close = null;
    G.still = G.beat.still || null;
    G.cue = G.beat.cue || null;
    G.typed = 0;
    G.doneAt = 0;
    G.typing = !!G.text;
    G.chipLine = '';
    G.chipsRead = {};
    G.chipsReady = false;
    G.chipsRects = [];
    G.hotspot = G.beat.hotspot || null;
    G.hint = G.beat.hint || '';
    G.pendingAuto = 0;
    G.camT.z = (G.beat.scene === 'shadow' || G.beat.scene === 'statue') ? 1.68 : 1.0;
    /* 谁说话，镜头就偏谁：妈妈在左、爸爸在右 */
    var wt = G.beat.who || '';
    G.camT.x = 0;
    G.camT.y = (G.beat.scene === 'shadow' || G.beat.scene === 'statue') ? 70 : 0;
    if (G.beat.cam) { G.camT.x = G.beat.cam.x; G.camT.y = G.beat.cam.y; G.camT.z = G.beat.cam.z; }
    G.pushZ = 0.93;   /* 每次点开都从稍远推到目标：轻微推镜 */
    if (G.beat.scene === 'house') setScene('house', W.house.kind || 'stool');
    else if (G.beat.scene === 'dawn' || G.beat.scene === 'final') setScene(G.beat.scene);
    else setScene(G.beat.scene);
    if (G.beat.onEnter) G.beat.onEnter();
  }

  function onTyped() {
    var b = G.beat;
    if (!b) return;
    if (b.chips && b.chips.length) {
      G.chipsReady = true;
      G.hint = '点开他说的那三样';
    } else if (b.hotspot) {
      G.hint = b.hint || G.hint;
    } else {
      G.hint = G.hint || (G.beat && (G.beat.final || G.beat.id === 'final') ? '结束' : '');
    }
  }

  function advance() {
    if (G.paused) return;
    if (G.close) { G.close = null; G.hint = ''; return; }
    if (G.typing) { G.typed = G.text.length; G.typing = false; onTyped(); return; }
    var b = G.beat;
    if (b && b.chips && b.chips.length) {
      var all = b.chips.every(function (x) { return G.chipsRead[x.key]; });
      if (!all) { G.hint = '先把这三样点开'; return; }
    }
    if (b && b.hotspot && G.hotspot) { G.hint = b.hint || '点它'; return; }
    if (b && b.final) { endFlow(); return; }
    startBeat(G.i + 1);
  }

  function endFlow() {
    G.ended = true;
    var d = document.createElement('div');
    d.id = 'act-end';
    d.style.cssText = 'position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#000;color:#d8cfbf;font:16px/2 "Noto Serif SC",serif;text-align:center;padding:0 8vw;letter-spacing:.06em;';
    d.innerHTML = '<div style="font-size:13px;letter-spacing:.4em;color:#8d8172;margin-bottom:28px">序 章 · 完</div>' +
      '<div style="font-size:28px;line-height:1.9;max-width:760px">那以后，我迷上了一样东西。<br>我要去经历他所说的美妙人生了。</div>' +
      '<div style="margin-top:48px;display:flex;gap:14px;flex-wrap:wrap;justify-content:center">' +
        '<button id="act-again" style="background:none;color:#b9a98f;border:1px solid #3a322a;padding:10px 26px;border-radius:999px;font-size:14px;cursor:pointer;letter-spacing:.08em">重新看一遍</button>' +
        '<button id="act-home" style="background:none;color:#cfc4b0;border:1px solid #4a4034;padding:10px 26px;border-radius:999px;font-size:14px;cursor:pointer;letter-spacing:.08em">回到首页</button>' +
        '<button id="act-next" style="background:none;color:#ecdcc0;border:1px solid #6a5b45;padding:10px 26px;border-radius:999px;font-size:14px;cursor:pointer;letter-spacing:.08em">看下一张</button>' +
      '</div>';
    var again = (typeof d.querySelector === 'function') ? d.querySelector('#act-again') : null;
    if (again) again.addEventListener('click', function (e) { e.stopPropagation(); if (typeof restart === 'function') { restart(); } else { location.reload(); } });
    var home = (typeof d.querySelector === 'function') ? d.querySelector('#act-home') : null;
    if (home) home.addEventListener('click', function (e) { e.stopPropagation(); try { parent.postMessage({ type: 'prologue-home' }, '*'); } catch (err) {} });
    var next = (typeof d.querySelector === 'function') ? d.querySelector('#act-next') : null;
    if (next) next.addEventListener('click', function (e) { e.stopPropagation(); try { parent.postMessage({ type: 'prologue-next' }, '*'); } catch (err) {} });
    document.body.appendChild(d);
  }

  /* ---------------------------------------------------------- 交互 */
  function toLogical(e) {
    var r = CV.getBoundingClientRect();
    return { x: (e.clientX - r.left - view.ox) / view.s, y: (e.clientY - r.top - view.oy) / view.s };
  }
  function hitChip(p) {
    for (var i = 0; i < G.chipsRects.length; i++) {
      var c = G.chipsRects[i];
      if (p.x >= c.x - 10 && p.x <= c.x + c.w + 10 && p.y >= c.y - 6 && p.y <= c.y + c.h) return c.key;
    }
    return null;
  }
  function onDown(e) {
    SND.init();
    if (SND.ctx && SND.ctx.state === 'suspended') SND.ctx.resume();
    if (SND.amb && MUSIC && MUSIC.name) SND.amb(MUSIC.name);
    if (G.ended) return;
    var p = toLogical(e);
    var key = hitChip(p);
    if (key) {
      var b = G.beat;
      if (b && b.chips) {
        var c = b.chips.filter(function (x) { return x.key === key; })[0];
        if (c) {
          G.chipLine = c.line;
          G.chipAt = performance.now() / 1000;
          G.chipsRead[key] = 1;
          var all = b.chips.every(function (x) { return G.chipsRead[x.key]; });
          if (all) G.hint = '';
          return;
        }
      }
    }
    if (G.hotspot) {
      var h = G.hotspot;
      if (Math.hypot(p.x - h.x, p.y - h.y) <= h.r) {
        G.hotspot = null;
        var _cb = G.beat || {};
        if (_cb.close && CIMG[_cb.close] && CIMG[_cb.close].ok) {
          G.close = { key: _cb.close, t0: performance.now() / 1000 };
          G.hint = '点一下继续';
          return;
        }
        if (b2(G.beat).onHit) G.beat.onHit();
        else advance();
        return;
      }
      return;
    }
    advance();
  }
  function b2(b) { return b || {}; }

  document.addEventListener('pointerdown', onDown);
  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowRight' || e.code === 'ArrowDown') { e.preventDefault(); SND.init(); try { if (SND.on) SCORE.start(); } catch (err2) {} if (G.hotspot) { G.hotspot = null; advance(); return; } if (!G.ended) advance(); }
  });

  /* 工作台导出的逐拍摆位（src/beat-pose-data.js），作为默认值 */
  try {
    var _ae = (typeof window !== 'undefined' && window.ACTS_EDITS) || null;
    if (_ae) {
      if (_ae.beatPose) G.beatPose = _ae.beatPose;
      if (_ae.beatPoseKey) G.beatPoseKey = _ae.beatPoseKey;
      if (_ae.propPos) { if (_ae.propPos.cup) G.propPos.cup = _ae.propPos.cup; if (_ae.propPos.candle) G.propPos.candle = _ae.propPos.candle; }
    }
  } catch (eAe) {}

  /* 读取工作台记下的改动（localStorage），刷新后仍生效 */
  try {
    if (typeof localStorage !== 'undefined') {
      var _ed = JSON.parse(localStorage.getItem('acts.edits') || 'null');
      if (_ed) {
        if (_ed.beatPose) G.beatPose = _ed.beatPose;
        if (_ed.beatPoseKey) G.beatPoseKey = _ed.beatPoseKey;
        if (_ed.propPos) { G.propPos.cup = _ed.propPos.cup || G.propPos.cup; G.propPos.candle = _ed.propPos.candle || G.propPos.candle; }
      }
    }
  } catch (eEd) {}

  /* 调试口：供无浏览器冒烟脚本读取节拍位置 */
  try {
    (typeof window !== 'undefined' ? window : globalThis).__acts = {
      G: G, BEATS: BEATS, W: W, PEOPLE: PEOPLE, SND: SND, SCORE: SCORE,
      go: function (id) {
        for (var i = 0; i < BEATS.length; i++) {
          if (BEATS[i].id === id) {
            startBeat(i);
            G.typed = G.text.length; G.typing = false; onTyped();
            G.black = 0; G.film = 1;
            return true;
          }
        }
        return false;
      }
    };
  } catch (err) { }

  /* ---------------------------------------------------------- 启动 */
  makeGrain();
  resize();
  startBeat(0);
  /* 摆件的模糊版：只烘一次 */
  function bakeProps() {
    try {
      if (PROPS['candle'] && !PROPS['candleBlur']) PROPS['candleBlur'] = bakeBlur(PROPS['candle'], 9);
      if (FG.cup && !FG.cupBlur) FG.cupBlur = bakeBlur(FG.cup, 7);
    } catch (e) {}
  }
  window.setTimeout(function () { bakeWall(); }, 60);
  try { window.__buildNoise = buildNoise; } catch (e) {}
  try { if (window.__buildNoise) window.setTimeout(window.__buildNoise, 120); } catch (e) {}
  window.setTimeout(bakeProps, 900);
  window.setTimeout(function () { bakeWall(); bakeProps(); }, 2200);

  /* 先画一帧：iframe 里 rAF 可能被节流，不能等第一帧回调 */
  try { G.t = 0; frame(0); } catch (e0) {}
  requestAnimationFrame(frame);

  /* 调试/预览参数：?at=<id|序号> 直接跳到某拍，?t=<秒> 给它一个已走过的时长 */
  try {
    var QS = new URLSearchParams(location.search);
    var at = QS.get('at');
    if (at) {
      var idx = -1;
      for (var qi = 0; qi < BEATS.length; qi++) if (BEATS[qi].id === at) idx = qi;
      if (idx < 0) idx = Math.max(0, Math.min(BEATS.length - 1, parseInt(at, 10) || 0));
      startBeat(idx);
      G.typed = G.text.length; G.typing = false; onTyped();
      var t0 = parseFloat(QS.get('t'));
      if (!isNaN(t0)) G.bt = t0;
    }
    if (QS.get('hud') === '0') document.getElementById('hud').style.display = 'none';

    if (QS.get('hud') === '1') document.getElementById('hud').style.display = '';
  } catch (e2) { }

  /* 顶部小工具 */
  var btnSound = document.getElementById('btnSound');
  if (btnSound) btnSound.addEventListener('click', function (e) {
    e.stopPropagation();
    SND.on = !SND.on;
    if (SND.master) SND.master.gain.value = SND.on ? 0.9 : 0;
    try { SND.on ? SCORE.start() : SCORE.stop(); } catch (e) {}
    btnSound.textContent = '声音：' + (SND.on ? '开' : '关');
    try { localStorage.setItem('acts.snd', SND.on ? '1' : '0'); } catch (err) {}
  });
  var btnSkip = document.getElementById('btnSkip');
  if (btnSkip) btnSkip.addEventListener('click', function (e) {
    e.stopPropagation();
    startBeat(BEATS.length - 1);
  });
})();