/* 首屏打字机（可组合三档效果）
   A garble  ：每字先闪一个随机字，30~90ms 后归位（终端解码感）
   B typo    ：偶发敲错 1~2 字再退格修正（像真人）
   C polish  ：字由糊到清、由下浮起；细竖线光标，打字时不闪、停手才呼吸
   用法：
     const tw = Typewriter.run(el, text, { cps: 26, garble: true, typo: true, polish: true, onKey(ch){} });
     tw.promise.then(...)   // 打完 resolve
     tw.cancel()            // 中途掐掉
   依赖 src/typewriter.css。 */

(function (global) {
  'use strict';

  // 乱码池：常用汉字，看起来像"正在解码成中文"，不会出现方块/问号
  const POOL = '的了在我有他这为之大来以个中上们到说国和地也子时道出而要就下得可你年生自会那后能对着事其里所去行过家十用发天如然作方成者多日都三小军二无同么经法当起与好看出学进种将还分此心前面又定见只主没公从';

  const rand = n => Math.floor(Math.random() * n);
  const glyph = () => POOL.charAt(rand(POOL.length));
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const PUNCT = /[，。、；：！？…—·]/;

  function run(el, text, opts) {
    var mcCps = (global.MissionControl && typeof global.MissionControl.get('typewriterSpeed') === 'number') ? global.MissionControl.get('typewriterSpeed') : 26;
    var mcMode = (global.MissionControl && typeof global.MissionControl.get('typewriterMode') === 'string') ? global.MissionControl.get('typewriterMode') : '';
    const o = Object.assign({
      cps: mcCps || 26,            // 每秒打几个字
      garble: mcMode ? mcMode.indexOf('a') !== -1 : false,
      typo: mcMode ? mcMode.indexOf('b') !== -1 : false,
      polish: mcMode ? mcMode.indexOf('c') !== -1 : false,
      onKey: null,        // 每打出一个真字回调一次（空格不算）
      startDelay: 120,
      pausePunct: 260,    // 标点后停顿
      pauseSpace: 60      // 空格后停顿
    }, opts || {});

    let cancelled = false;
    if (!el) return { promise: Promise.resolve(), cancel() {} };

    // 换一套自己的 DOM，避免和原来的 textContent 写法打架
    el.textContent = '';
    el.classList.add('tw-root');
    el.classList.add('typing');       // 保留老契约：打字期间挂 .typing（验收脚本与样式都看这个）
    el.classList.toggle('tw-polish', !!o.polish);

    const line = document.createElement('span');
    line.className = 'tw-line';
    el.appendChild(line);

    const caret = document.createElement('span');
    caret.className = 'tw-caret busy';
    caret.setAttribute('aria-hidden', 'true');
    el.appendChild(caret);

    const spans = [];
    let idleTimer = null;

    function markBusy() {
      caret.classList.remove('idle');
      caret.classList.add('busy');
      if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
    }
    function scheduleIdle() {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        caret.classList.remove('busy');
        caret.classList.add('idle');
        el.classList.add('tw-done');
        el.classList.remove('typing');   // 打完就摘掉，和以前一致
      }, 420);
    }

    function append(ch) {
      const s = document.createElement('span');
      s.className = 'tw-ch';
      const plain = ch === ' ' || ch === '\n';
      if (o.garble && !plain) {
        s.textContent = glyph();                     // 先闪一个错字
        const real = ch;
        setTimeout(() => { if (!cancelled) s.textContent = real; }, 30 + rand(60));
      } else {
        s.textContent = ch;
      }
      line.appendChild(s);
      if (o.polish) requestAnimationFrame(() => s.classList.add('in'));
      spans.push(s);
      return s;
    }

    function pop() {
      const s = spans.pop();
      if (s && s.parentNode) s.parentNode.removeChild(s);
    }

    async function play() {
      if (o.startDelay) await delay(o.startDelay);
      const total = text.length;
      const step = Math.max(16, 1000 / o.cps);

      for (let i = 0; i < total; i++) {
        if (cancelled) return;
        const ch = text.charAt(i);

        // B 档：在词中段偶发敲错再退格（首尾 3 字内不触发，读起来更自然）
        if (o.typo && i > 3 && i < total - 3 && ch !== ' ' && !PUNCT.test(ch) && Math.random() < 0.06) {
          const n = 1 + rand(2);
          for (let k = 0; k < n; k++) {
            if (cancelled) return;
            markBusy();
            append(glyph());
            await delay(70 + rand(60));
          }
          await delay(230);
          for (let k = 0; k < n; k++) {
            if (cancelled) return;
            pop();
            await delay(78);
          }
          await delay(150);
        }

        if (cancelled) return;
        markBusy();
        append(ch);
        if (o.onKey && ch !== ' ' && ch !== '\n') o.onKey(ch);

        let extra = 0;
        if (PUNCT.test(ch)) extra = o.pausePunct;
        else if (ch === ' ') extra = o.pauseSpace;
        await delay(step + extra + rand(16));
      }

      if (cancelled) return;
      scheduleIdle();
    }

    const promise = play();

    return {
      promise,
      cancel() {
        cancelled = true;
        if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
        caret.classList.remove('busy');
        caret.classList.add('idle');
        el.classList.remove('typing');
      },
      get done() { return !caret.classList.contains('busy'); }
    };
  }

  global.Typewriter = { run, POOL };
})(window);
