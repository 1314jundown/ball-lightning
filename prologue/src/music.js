/* ================= 生日歌：现场合成（WebAudio，零素材） =================
   用途：序章「生日之夜」的伴奏。旋律是《生日快乐》原调（G 大调，3/4），
   无人声；乐器是音乐盒（正弦 + 3/5 次泛音 + 短促槌音）加一层很轻的和弦垫。

   三段：
     calm  舒缓：84 BPM，每拍 ±0.8% 速度起伏，像有人手摇
     warp  变形：速度降、每个音随机失谐、低通一路压下来、颤音加深、
                 偶尔漏一个音或错半个音 —— 音乐盒坏掉的感觉
     cut   硬切：8 ms 内归零，只留一个 40 Hz 的撞击和混响尾巴（约 2.5 s）

   为什么不用音频文件：一段 mp3 没法跟着"影子摆动"和玩家的操作变形；
   而这条曲子只有 24 拍，写死在代码里比采样更小、更可控。

   用法（实时）：
     const m = SLMusic.create(new AudioContext());
     m.start();              // 从头放（可反复调用，会接在循环点上）
     m.warp(1, 6);           // 6 秒内把变形度推到 1
     m.cut();                // 硬切，接高潮
   用法（离线，给 tools/music-probe.mjs 做自检）：
     const off = new OfflineAudioContext(2, sr * 30, sr);
     const m = SLMusic.create(off);
     m.renderOffline({ warpAt: 8, cutAt: 16, total: 30 });
     const buf = await off.startRendering();
   ====================================================================== */
(function () {
  'use strict';

  const BPM = 84;
  const BEAT = 60 / BPM;

  /* ---------------- 音高 ---------------- */
  const SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function hz(name) {
    const m = /^([A-G])(#|b)?(\d)$/.exec(name);
    if (!m) return 440;
    let semi = SEMI[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (Number(m[3]) + 1) * 12;
    return 440 * Math.pow(2, (semi - 69) / 12);
  }

  /* ---------------- 谱子 ----------------
     每句 6 拍（3/4 两小节）。d 以拍为单位。 */
  const PHRASES = [
    /* 祝你生日快乐 */
    [
      { n: 'G4', d: 0.5 }, { n: 'G4', d: 0.5 }, { n: 'A4', d: 1 },
      { n: 'G4', d: 1 }, { n: 'C5', d: 1 }, { n: 'B4', d: 2 },
      { c: 'G', at: 0, d: 3 }, { c: 'D', at: 3, d: 3 }
    ],
    [
      { n: 'G4', d: 0.5 }, { n: 'G4', d: 0.5 }, { n: 'A4', d: 1 },
      { n: 'G4', d: 1 }, { n: 'D5', d: 1 }, { n: 'C5', d: 2 },
      { c: 'G', at: 0, d: 3 }, { c: 'D', at: 3, d: 3 }
    ],
    [
      { n: 'G4', d: 0.5 }, { n: 'G4', d: 0.5 }, { n: 'G5', d: 1 },
      { n: 'E5', d: 1 }, { n: 'C5', d: 1 }, { n: 'B4', d: 0.5 }, { n: 'A4', d: 1.5 },
      { c: 'C', at: 0, d: 3 }, { c: 'D', at: 3, d: 3 }
    ],
    [
      { n: 'F5', d: 0.5 }, { n: 'F5', d: 0.5 }, { n: 'E5', d: 1 },
      { n: 'C5', d: 1 }, { n: 'D5', d: 1 }, { n: 'C5', d: 2 },
      { c: 'D', at: 0, d: 3 }, { c: 'G', at: 3, d: 3 }
    ]
  ];

  const CHORD = {
    G: ['G3', 'B3', 'D4'],
    D: ['D4', 'F#4', 'A4'],
    C: ['C4', 'E4', 'G4'],
    Em: ['E4', 'G4', 'B4']
  };

  /* ---------------- 混响脉冲：程序化，不加载文件 ---------------- */
  function makeIR(ctx, seconds, decay) {
    const sr = ctx.sampleRate;
    const n = Math.floor(sr * seconds);
    const buf = ctx.createBuffer(2, n, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let last = 0;
      for (let i = 0; i < n; i++) {
        const t = i / n;
        const env = Math.pow(1 - t, decay);
        /* 一阶低通噪声：比纯白噪声更像房间，高频不会"嘶" */
        last = last * 0.62 + (Math.random() * 2 - 1) * 0.38;
        d[i] = last * env;
      }
      /* 前 12 ms 衰减掉，避免卷积出一个硬起音 */
      const pre = Math.floor(sr * 0.012);
      for (let i = 0; i < pre && i < n; i++) d[i] *= i / pre;
    }
    return buf;
  }

  /* ---------------- 实例 ---------------- */
  function create(ctx) {
    // setBed(v)：底噪与和弦垫的整体比例，1 = 原样

    const T = ctx.currentTime;

    const master = ctx.createGain();        master.gain.value = 0.9;
    const musicBus = ctx.createGain();      musicBus.gain.value = 0.0;   // cut 时在这里归零
    const dry = ctx.createGain();           dry.gain.value = 0.82;
    const verb = ctx.createConvolver();     verb.buffer = makeIR(ctx, 2.8, 3.1);
    const verbSend = ctx.createGain();      verbSend.gain.value = 0.34;

    /* 声部总线：音乐盒 → 低通 → 颤音 → 干/湿 */
    const boxFilter = ctx.createBiquadFilter();
    boxFilter.type = 'lowpass';
    boxFilter.frequency.value = 9000;
    boxFilter.Q.value = 0.4;

    const trem = ctx.createGain();          trem.gain.value = 1;
    const tremLFO = ctx.createOscillator(); tremLFO.frequency.value = 0.7;
    const tremDepth = ctx.createGain();     tremDepth.gain.value = 0;
    tremLFO.connect(tremDepth).connect(trem.gain);
    tremLFO.start(T);

    let BED = 1;
  const padBus = ctx.createGain();        padBus.gain.value = 0.0;     // 变形段才淡入

    /* 噪声床 */
    const noiseBuf = (function () {
      const n = ctx.sampleRate * 2;
      const b = ctx.createBuffer(1, n, ctx.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
      return b;
    })();
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuf; noise.loop = true;
    const noiseGain = ctx.createGain(); noiseGain.gain.value = 0;

    boxFilter.connect(trem);
    trem.connect(dry); trem.connect(verbSend);
    padBus.connect(dry); padBus.connect(verbSend);
    noise.connect(noiseGain); noiseGain.connect(verbSend);   // 噪声只走混响，藏起来
    dry.connect(musicBus); verbSend.connect(verb);
    verb.connect(master);          // 混响直接进 master：cut 只掐干声，尾巴照常衰减
    musicBus.connect(master); master.connect(ctx.destination);
    noise.start(T);

    /* 撞击（cut 时用，不经过 musicBus，所以不会被切掉） */
    const thumpBus = ctx.createGain(); thumpBus.gain.value = 1;
    thumpBus.connect(master);

    let playing = false;
    let warpK = 0;
    let nextPhraseAt = 0;
    let phraseIndex = 0;
    let ticker = null;
    let stopped = false;

    /* ---------- 一个音乐盒音 ---------- */
    function boxNote(t, freq, dur, gain, k) {
      const detune = (Math.random() * 2 - 1) * 22 * k;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(Math.max(0.02, gain), t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.35, dur));

      /* 基频 + 第 3、5 次泛音：金属片的那种"叮" */
      [[1, 1], [3, 0.28], [5, 0.12]].forEach(function (pair) {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.value = freq * pair[0];
        o.detune.value = detune * pair[0];
        const og = ctx.createGain();
        og.gain.value = pair[1];
        o.connect(og).connect(g);
        o.start(t);
        o.stop(t + Math.max(0.5, dur) + 0.1);
      });

      /* 槌音：极短的高频噪点，给"木槌敲金属"一个起音 */
      if (k < 0.85) {
        const n = ctx.createBufferSource();
        n.buffer = noiseBuf;
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 1.2;
        const ng = ctx.createGain();
        ng.gain.setValueAtTime(0.05 * (1 - k), t);
        ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
        n.connect(bp).connect(ng).connect(g);
        n.start(t); n.stop(t + 0.08);
      }
      g.connect(boxFilter);
    }

    /* ---------- 和弦垫 ---------- */
    function padChord(t, name, beats) {
      const notes = CHORD[name] || CHORD.G;
      const dur = beats * BEAT;
      notes.forEach(function (nm, i) {
        const o = ctx.createOscillator();
        o.type = i === 0 ? 'triangle' : 'sine';
        o.frequency.value = hz(nm) / 2;                 // 低八度，垫在下面
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.045, t + 0.6);
        g.gain.linearRampToValueAtTime(0.0001, t + dur + 0.5);
        o.connect(g).connect(padBus);
        o.start(t); o.stop(t + dur + 0.6);
      });
    }

    /* ---------- 排一句 ---------- */
    /* 返回值 = 这一句实际占用的时长，tick 用它推进 nextPhraseAt。
       曾经的 bug：这里返回 PHRASES.length * 6 * BEAT —— 一句只排了 6 拍，却按 24 拍
       往后跳，于是每句唱完要干等约 13 秒，听起来就是「中间一大段空白」。 */
    function schedulePhrase(idx, t0, k) {
      const phrase = PHRASES[idx % PHRASES.length];
      const slow = 1 + 0.55 * k;
      let t = t0;

      for (let i = 0; i < phrase.length; i++) {
        const ev = phrase[i];

        if (ev.c) {                                   /* 和弦 */
          if (k < 0.999) padChord(t0 + ev.at * BEAT * slow, ev.c, ev.d);
          continue;
        }

        const len = ev.d * BEAT * slow * (1 + (Math.random() * 2 - 1) * 0.008 * (1 - k));
        /* 变形：漏音、错音 */
        const drop = Math.random() < 0.10 * k;
        let name = ev.n;
        if (!drop && Math.random() < 0.12 * k) {
          const semi = Math.random() < 0.5 ? -1 : 1;
          name = shift(name, semi);
        }
        if (!drop) {
          const accent = ev.d >= 1 ? 0.42 : 0.34;
          boxNote(t, hz(name), len * 0.95, accent * (1 - 0.25 * k), k);
        }
        t += len;
      }
      return t - t0;
    }

    function shift(name, semis) {
      const m = /^([A-G])(#|b)?(\d)$/.exec(name);
      const order = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      let i = order.indexOf(m[1] + (m[2] || ''));
      let oct = Number(m[3]);
      i += semis;
      while (i < 0) { i += 12; oct--; }
      while (i > 11) { i -= 12; oct++; }
      return order[i] + oct;
    }

    /* ---------- 变形参数 ---------- */
    function applyWarp(k, at) {
      warpK = k;
      const t = at == null ? ctx.currentTime : at;
      boxFilter.frequency.setTargetAtTime(9000 * Math.pow(1200 / 9000, k), t, 0.4);
      tremDepth.gain.setTargetAtTime(0.55 * k, t, 0.6);
      noiseGain.gain.setTargetAtTime(0.05 * k * BED, t, 0.8);
      padBus.gain.setTargetAtTime(0.55 * (k > 0.02 ? 1 : 0) * BED, t, 1.2);
    }

    /* ---------- 实时推进 ---------- */
    function tick() {
      if (!playing) return;
      const now = ctx.currentTime;
      /* 排到 1.5 s 之后：够早，不会断；也不会一次排太多导致 warp 来不及生效 */
      while (nextPhraseAt < now + 1.5) {
        const span = schedulePhrase(phraseIndex, nextPhraseAt, warpK);
        nextPhraseAt += span;
        phraseIndex++;
      }
    }

    const api = {
      /* 从头开始（每次调用都从头，方便重播；停过之后也能重新起来） */
      start(at) {
        const t0 = at == null ? ctx.currentTime + 0.08 : at;
        stopped = false;
        playing = true;
        phraseIndex = 0;
        nextPhraseAt = t0;
        musicBus.gain.cancelScheduledValues(ctx.currentTime);
        musicBus.gain.setValueAtTime(0.0001, ctx.currentTime);
        musicBus.gain.linearRampToValueAtTime(1, ctx.currentTime + 0.9);
        applyWarp(0, ctx.currentTime);
        tick();
        if (!ticker && typeof setInterval === 'function' && ctx.constructor.name !== 'OfflineAudioContext') {
          ticker = setInterval(tick, 120);
        }
        return api;
      },

      /* 把变形度推到 k（0..1），seconds 秒内 */
      warp(k, seconds) {
        const now = ctx.currentTime;
        const dur = Math.max(0.05, seconds == null ? 4 : seconds);
        const steps = 24;
        for (let i = 1; i <= steps; i++) {
          const tt = now + dur * (i / steps);
          applyWarp(warpK + (k - warpK) * (i / steps), tt);
        }
        return api;
      },

      /* 硬切：8 ms 归零 + 一次低频撞击；混响尾巴自己衰减 */
      cut(at) {
        const t = at == null ? ctx.currentTime : Math.max(at, ctx.currentTime);
        musicBus.gain.cancelScheduledValues(t);
        musicBus.gain.setValueAtTime(1, t);
        musicBus.gain.linearRampToValueAtTime(0.0001, t + 0.008);
        /* 噪声床（变形段的"底噪"）也得收掉，否则它会一直漏进混响 */
        noiseGain.gain.cancelScheduledValues(t);
        noiseGain.gain.setValueAtTime(noiseGain.gain.value, t);
        noiseGain.gain.linearRampToValueAtTime(0.0001, t + 0.35);
        playing = false;

        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.setValueAtTime(58, t);
        o.frequency.exponentialRampToValueAtTime(26, t + 0.75);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.30, t + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
        o.connect(g).connect(thumpBus);
        o.start(t); o.stop(t + 1.6);
        return api;
      },

      stop() {
        stopped = true;
        playing = false;
        if (ticker) { clearInterval(ticker); ticker = null; }
        musicBus.gain.cancelScheduledValues(ctx.currentTime);
        musicBus.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
        return api;
      },

      setVolume(v) { master.gain.setTargetAtTime(v, ctx.currentTime, 0.1); return api; },
    setBed(v) { BED = Math.max(0, v); return api; },

      /* 离线一次性排完（给自检验证用）：整段调子 + 指定时刻变形 / 硬切 */
      renderOffline(opts) {
        const o = opts || {};
        const total = o.total || 40;
        const warpAt = o.warpAt == null ? 12 : o.warpAt;
        const cutAt = o.cutAt == null ? 20 : o.cutAt;
        musicBus.gain.setValueAtTime(1, 0);
        let t = 0.2;
        let i = 0;
        while (t < total) {
          const k = t < warpAt ? 0
            : Math.min(1, (t - warpAt) / Math.max(0.1, (cutAt - warpAt) * 0.75));
          applyWarp(k, t);
          const span = schedulePhrase(i, t, k);
          t += span;
          i++;
          if (t >= cutAt) break;
        }
        api.cut(cutAt);
        return { end: t };
      },

      get warpK() { return warpK; },
      get state() { return playing ? 'playing' : 'stopped'; },
      get out() { return master; }          /* 给试听台接分析器用 */
    };

    return api;
  }

  window.SLMusic = { create: create, hz: hz, BPM: BPM, phrases: PHRASES };
})();
