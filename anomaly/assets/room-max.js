/* 由 tools/build-max-room.mjs 生成，请勿手改。
   「餐厅·原场景」：从用户给的「美式餐厅」.max（经浏览器端转换器转成 glb）里裁出餐桌区域，
   减面 + 按材质名贴回贴图后的版本。挂在 SCENE_SAMPLES 最前面，序章会优先用它当房间。 */
(function () {
  window.SCENE_SAMPLES = window.SCENE_SAMPLES || [];
  window.SCENE_SAMPLES.unshift({
    id: "sample-room-max",
    label: "餐厅·原场景",
    role: "room",
    file: "samples/room-max.draco.glb",
    bytes: 2012844,
    base64: ""
  });
})();
