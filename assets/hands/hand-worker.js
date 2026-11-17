/* 02 屏 · 手势点云的唯一后台线程（classic worker，不是 module worker）。
 *
 * 为什么是 classic：MediaPipe 的 wasm 加载器内部用 importScripts 拉
 * vision_wasm_internal.js，而 module worker 不允许 importScripts（会抛
 * "Module scripts don't support importScripts()"）。所以这里走经典 worker，
 * 再用一个三行的 CJS 壳把官方 vision_bundle.cjs 塞进来——不额外引依赖。
 *
 * 为什么单开线程：wasm 推理在主线程上是同步的，一次 8–15ms，1440×900 的点云
 * 正好卡在 60fps 线上，会直接掉帧。放进 worker 后主线程只剩 createImageBitmap（~1ms）。
 *
 * 协议（postMessage）：
 *   主线程 → worker   {type:'init', wasmPath, modelPath, delegate}
 *                     {type:'frame', bitmap, ts}         bitmap 是 ImageBitmap，转移所有权
 *                     {type:'reset'}
 *    worker → 主线程   {type:'ready', delegate}
 *                     {type:'error', stage, message}
 *                     {type:'hands', ts, inferMs, hands:[{score, handedness, landmarks:[{x,y,z}…]}]}
 *                     {type:'empty', ts, inferMs}
 *
 * 这里只读 21 个关键点，手势语义（捏合、张掌、爆散）全在主线程算，
 * 同一套映射也能喂给无模型时的帧差降级路径。
 */

self.module = { exports: {} };
self.exports = self.module.exports;
importScripts('./vision-bundle.js');
const vision = self.module.exports;

let landmarker = null;
let mode = 'none';

function post(msg) { self.postMessage(msg); }

async function init(cfg) {
  const { FilesetResolver, HandLandmarker } = vision;
  if (!FilesetResolver || !HandLandmarker) throw new Error('vision_bundle 没导出 FilesetResolver/HandLandmarker');
  const fileset = await FilesetResolver.forVisionTasks(cfg.wasmPath);

  /* 默认用 CPU（XNNPACK，多线程）：GPU delegate 会在 worker 里再要一个 WebGL 上下文，
     和主线程那块点云的 canvas 抢同一个 GPU 进程，实测把 59fps 打到 30fps。
     CPU 跑在 worker 自己的线程上，主线程帧率不受影响。想换回 GPU 就传 delegate:'GPU'。 */
  const order = cfg.delegate ? [cfg.delegate] : ['CPU', 'GPU'];
  let lastErr = null;
  for (const d of order) {
    try {
      landmarker = await HandLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: cfg.modelPath, delegate: d },
        runningMode: 'VIDEO',
        numHands: cfg.numHands || 2,
        minHandDetectionConfidence: 0.5,
        minHandPresenceConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      mode = d;
      post({ type: 'ready', delegate: d });
      return;
    } catch (e) { lastErr = e; landmarker = null; }
  }
  post({ type: 'error', stage: 'create', message: String(lastErr && lastErr.message || lastErr) });
}

self.onmessage = async (ev) => {
  const m = ev.data || {};
  if (m.type === 'init') {
    try { await init(m); }
    catch (e) { post({ type: 'error', stage: 'init', message: String(e && e.message || e) }); }
    return;
  }
  if (m.type === 'reset') {
    try { if (landmarker) landmarker.close(); } catch (e) {}
    landmarker = null; mode = 'none';
    return;
  }
  if (m.type === 'frame') {
    const bitmap = m.bitmap;
    if (!landmarker) { try { bitmap.close(); } catch (e) {} post({ type: 'error', stage: 'frame', message: 'no landmarker' }); return; }
    const t0 = performance.now();
    try {
      const res = landmarker.detectForVideo(bitmap, m.ts || performance.now());
      const inferMs = performance.now() - t0;
      const hands = (res && res.landmarks || []).map((lm, i) => ({
        score: (res.handedness && res.handedness[i] && res.handedness[i][0] && res.handedness[i][0].score) || 0,
        handedness: (res.handedness && res.handedness[i] && res.handedness[i][0] && res.handedness[i][0].categoryName) || '',
        landmarks: lm.map(p => ({ x: p.x, y: p.y, z: p.z }))
      }));
      if (hands.length) post({ type: 'hands', ts: m.ts, inferMs, hands });
      else post({ type: 'empty', ts: m.ts, inferMs });
    } catch (e) {
      post({ type: 'error', stage: 'detect', message: String(e && e.message || e) });
    } finally {
      try { bitmap.close(); } catch (e) {}
    }
  }
};
