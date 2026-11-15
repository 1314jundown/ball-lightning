/* 由 tools/build-roomsu.mjs 生成，请勿手改。
   「九十年代老宅·SU 原场景」：用户 SketchUp 2027 直接导出 glb（未减面、含贴图），
   87 万三角面。挂在 SCENE_SAMPLES 里当异象一的房子；
   几何走 samples/room-su.draco.glb（join+weld+Draco 离线压缩，需要 assets/draco/ 解码器）。 */
(function () {
  window.SCENE_SAMPLES = window.SCENE_SAMPLES || [];
  window.SCENE_SAMPLES.unshift({
    id: "sample-room-su",
    label: "九十年代老宅·SU",
    role: "room",
    file: "samples/room-su.draco.glb",
    bytes: 13359076,
    base64: ""
  });
})();
