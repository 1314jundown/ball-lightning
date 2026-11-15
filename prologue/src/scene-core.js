/* SCENE LAB 公共核心：存储、载入器、节点工具、补间、环境光。
   两个页面都只用经典脚本加载（file:// 双击可用），因此这里挂在 window.SceneCore 上。 */
(function () {
  const T = window.THREE;
  if (!T) throw new Error('three.bundle.js 没有加载');

  /* ------------------------------------------------------------ 基础工具 */

  const toastWrap = (() => {
    let el = document.querySelector('.toast-wrap');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast-wrap';
      document.body.appendChild(el);
    }
    return el;
  })();

  function toast(msg, kind = '', ms = 2600) {
    const el = document.createElement('div');
    el.className = 'toast ' + kind;
    el.textContent = msg;
    toastWrap.appendChild(el);
    setTimeout(() => {
      el.style.transition = 'opacity .3s ease';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 320);
    }, ms);
    return el;
  }

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const easeInOutCubic = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  function tween({ from = 0, to = 1, dur = 600, ease = easeInOutCubic, onUpdate, onDone }) {
    const t0 = performance.now();
    let raf = 0;
    let cancelled = false;
    const step = now => {
      if (cancelled) return;
      const k = clamp((now - t0) / dur, 0, 1);
      if (onUpdate) onUpdate(from + (to - from) * ease(k), k);
      if (k < 1) raf = requestAnimationFrame(step);
      else if (onDone) onDone();
    };
    raf = requestAnimationFrame(step);
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }

  const b64ToBuf = b64 => {
    const bin = atob(b64);
    const buf = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    return buf.buffer;
  };

  const bufToB64 = ab => {
    const bytes = new Uint8Array(ab);
    const chunk = 0x8000;
    let out = '';
    for (let i = 0; i < bytes.length; i += chunk) {
      out += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    return btoa(out);
  };

  const kindOfFile = name => {
    const ext = (name.split('.').pop() || '').toLowerCase();
    if (ext === 'blend') return 'blend';
    if (ext === 'fbx') return 'fbx';
    if (ext === 'glb') return 'glb';
    if (ext === 'gltf') return 'gltf';
    return 'unknown';
  };

  const fmtBytes = n => (n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : (n / 1024).toFixed(0) + ' KB');

  /* ------------------------------------------------------------ 本地存储 */

  const DB_NAME = 'scene-lab';
  const DB_VERSION = 1;
  const memory = { records: new Map(), blobs: new Map() };

  const Storage = {
    mode: 'unknown',
    db: null,

    async init() {
      if (Storage.mode !== 'unknown') return Storage.mode;
      try {
        Storage.db = await new Promise((resolve, reject) => {
          const req = indexedDB.open(DB_NAME, DB_VERSION);
          req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains('assets')) db.createObjectStore('assets', { keyPath: 'id' });
            if (!db.objectStoreNames.contains('blobs')) db.createObjectStore('blobs');
          };
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error || new Error('indexedDB open failed'));
          req.onblocked = () => reject(new Error('indexedDB blocked'));
          setTimeout(() => reject(new Error('indexedDB timeout')), 4000);
        });
        // 真读写一次，确认 file:// 下确实可用
        await Storage.put({ id: '__probe__', label: 'probe' }, new Uint8Array([1, 2, 3]).buffer);
        await Storage.remove('__probe__');
        Storage.mode = 'indexeddb';
      } catch (err) {
        Storage.mode = 'memory';
        Storage.db = null;
      }
      return Storage.mode;
    },

    tx(store, mode = 'readonly') {
      return Storage.db.transaction(store, mode).objectStore(store);
    },

    async put(record, arrayBuffer) {
      if (Storage.mode === 'memory' || !Storage.db) {
        memory.records.set(record.id, record);
        if (arrayBuffer) memory.blobs.set(record.id, arrayBuffer);
        return record;
      }
      await new Promise((resolve, reject) => {
        const tx = Storage.db.transaction(['assets', 'blobs'], 'readwrite');
        tx.objectStore('assets').put(record);
        if (arrayBuffer) tx.objectStore('blobs').put(arrayBuffer, record.id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
      return record;
    },

    async remove(id) {
      if (Storage.mode === 'memory' || !Storage.db) {
        memory.records.delete(id);
        memory.blobs.delete(id);
        return;
      }
      await new Promise((resolve, reject) => {
        const tx = Storage.db.transaction(['assets', 'blobs'], 'readwrite');
        tx.objectStore('assets').delete(id);
        tx.objectStore('blobs').delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    },

    async all() {
      if (Storage.mode === 'memory' || !Storage.db) {
        return [...memory.records.values()];
      }
      return await new Promise((resolve, reject) => {
        const req = Storage.tx('assets').getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    },

    async blob(id) {
      if (Storage.mode === 'memory' || !Storage.db) return memory.blobs.get(id) || null;
      return await new Promise((resolve, reject) => {
        const req = Storage.tx('blobs').get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    }
  };

  /* ------------------------------------------------------------ 模型载入 */

  const gltfLoader = new T.GLTFLoader();
  const fbLoader = new T.FBXLoader();

  function isGLB(ab) {
    const dv = new DataView(ab);
    return ab.byteLength > 12 && dv.getUint32(0, true) === 0x46546c67;
  }

  function isFBXBinary(ab) {
    if (ab.byteLength < 23) return false;
    const head = new TextDecoder('latin1').decode(new Uint8Array(ab, 0, 21));
    return head.startsWith('Kaydara FBX Binary');
  }

  function isBlend(ab) {
    if (ab.byteLength < 12) return false;
    const head = new TextDecoder('latin1').decode(new Uint8Array(ab, 0, 12));
    return head.startsWith('BLENDER');
  }

  /** 把 ArrayBuffer 解析成 Object3D。扩展名只用于给出更友好的报错。 */
  function parseModel(ab, name) {
    const ext = (name.split('.').pop() || '').toLowerCase();
    if (isBlend(ab)) {
      return Promise.reject(Object.assign(new Error('BLEND_UNSUPPORTED'), { code: 'BLEND' }));
    }
    if (ext === 'fbx' || isFBXBinary(ab)) {
      const data = isFBXBinary(ab) ? ab : new TextDecoder('utf-8').decode(ab);
      return new Promise((resolve, reject) => {
        try {
          resolve(fbLoader.parse(data, ''));
        } catch (err) {
          reject(err);
        }
      });
    }
    const data = isGLB(ab) ? ab : new TextDecoder('utf-8').decode(ab);
    return new Promise((resolve, reject) => {
      gltfLoader.parse(data, '', gltf => resolve(gltf.scene || gltf.scenes[0]), reject);
    });
  }

  /* -------------------------------------------------------------- 节点树 */

  const labelOf = obj => (obj.userData && obj.userData.label) || obj.name || '(未命名)';

  function pathOf(obj, root) {
    const names = [];
    let cur = obj;
    while (cur && cur !== root) {
      names.unshift(cur.name || '#');
      cur = cur.parent;
    }
    return names.join('/');
  }

  function findByPath(root, path) {
    if (!path) return null;
    let cur = root;
    for (const seg of path.split('/')) {
      if (!cur) return null;
      cur = cur.children.find(c => (c.name || '#') === seg) || null;
    }
    return cur;
  }

  const isMeshLike = o => !!(o.isMesh || o.isSkinnedMesh || o.isPoints || o.isLine);

  function triCount(obj) {
    let tris = 0;
    obj.traverse(o => {
      if (isMeshLike(o) && o.geometry && o.geometry.index) tris += o.geometry.index.count / 3;
      else if (isMeshLike(o) && o.geometry && o.geometry.attributes.position) tris += o.geometry.attributes.position.count / 3;
    });
    return Math.round(tris);
  }

  function boxOf(obj) {
    const box = new T.Box3().setFromObject(obj);
    if (box.isEmpty()) return { box, size: new T.Vector3(), center: new T.Vector3(), radius: 0.5 };
    const size = box.getSize(new T.Vector3());
    const center = box.getCenter(new T.Vector3());
    return { box, size, center, radius: Math.max(size.x, size.y, size.z) * 0.5 };
  }

  /** 让相机框住对象（保持当前朝向） */
  function frameObject(camera, controls, obj, pad = 1.55) {
    const { center, radius } = boxOf(obj);
    const dir = new T.Vector3().subVectors(camera.position, controls ? controls.target : center).normalize();
    if (dir.lengthSq() < 1e-6) dir.set(1, 0.6, 1).normalize();
    const fov = (camera.fov * Math.PI) / 180;
    const dist = (radius / Math.sin(fov / 2)) * pad;
    camera.position.copy(center).addScaledVector(dir, dist);
    if (controls) controls.target.copy(center);
    camera.near = Math.max(0.01, radius / 100);
    camera.far = Math.max(50, dist * 12);
    camera.updateProjectionMatrix();
    if (controls) controls.update();
  }

  /* ---------------------------------------------------------- 渲染器/环境 */

  function createRenderer(canvas) {
    const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    return renderer;
  }

  /** 用 RoomEnvironment 生成一张柔和的 IBL，PBR 材质不会发死 */
  function makeEnvironment(renderer) {
    if (!T.RoomEnvironment) return null;
    const pmrem = new T.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new T.RoomEnvironment(), 0.04).texture;
    pmrem.dispose();
    return env;
  }

  function watchResize(renderer, camera, onResize) {
    const resize = () => {
      const el = renderer.domElement;
      const w = el.clientWidth || el.parentElement.clientWidth;
      const h = el.clientHeight || el.parentElement.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (onResize) onResize(w, h);
    };
    resize();
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => resize());
      ro.observe(renderer.domElement.parentElement || renderer.domElement);
    } else {
      addEventListener('resize', resize);
    }
    return resize;
  }

  /* -------------------------------------------------------- 资产清单交换 */

  const ROLES = [
    { key: 'window', label: '窗户' },
    { key: 'room', label: '房间' },
    { key: 'cake', label: '蛋糕' },
    { key: 'candle', label: '蜡烛' },
    { key: 'other', label: '其他' }
  ];

  const ROLE_LABEL = Object.fromEntries(ROLES.map(r => [r.key, r.label]));

  function download(filename, blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  window.SceneCore = {
    THREE: T,
    toast, tween, clamp, easeInOutCubic, easeOutCubic,
    b64ToBuf, bufToB64, kindOfFile, fmtBytes,
    Storage, parseModel, isGLB, isFBXBinary, isBlend,
    labelOf, pathOf, findByPath, triCount, boxOf, frameObject, isMeshLike,
    createRenderer, makeEnvironment, watchResize,
    ROLES, ROLE_LABEL, download
  };
})();
