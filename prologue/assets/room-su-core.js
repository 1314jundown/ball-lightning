/* 由 tools/build-roomsu-core.cjs 生成，请勿手改。
   「九十年代老宅·第一章」：从异象一那份 room-su.glb 里裁出来的那一块
   （窗户 + 木地板客厅），26.8 万面 / 13.3 MB。

   和 assets/room-su.js 的区别：这里不塞 base64，只留 file 指向 samples/room-su-core.glb，
   由 src/prologue.js 的 assetBuffer 直接 fetch 二进制 —— 省掉 60 MB JS 解析 + 45 MB base64 解码。

   原始资产一字未动：assets/room-su.js + samples/room-su.glb 还在，异象一继续用。
*/
(function () {
  window.SCENE_SAMPLES = window.SCENE_SAMPLES || [];
  window.SCENE_SAMPLES.unshift({
    id: 'sample-room-su-core',
    label: '九十年代老宅·窗与客厅',
    role: 'room',
    file: 'samples/room-su-core.glb',
    bytes: 21562080,
    crop: { source: 'sample-room-su', keep: '窗户到客厅', triangles: 267510 },
  });
})();
