/* 由 tools/build-bathroom.mjs 生成，请勿手改。
   「卫生间洁具」：用户给的 Blender 套件（bathroom cycles 2a.blend）里挑出来的
   洗手盆 / 龙头 / 马桶 / 镜子 / 毛巾架等部件、5.8 万面（墙砖与浴缸未导出）。
   原型坐标：Blender 里洗手盆在 (4.07, 7.83)，three 里是 (4.07, -7.83)。 */
(function () {
  window.SCENE_SAMPLES = window.SCENE_SAMPLES || [];
  window.SCENE_SAMPLES.unshift({
    id: "sample-bathroom",
    label: "卫生间·Blender 洁具",
    role: "bath",
    file: "samples/bathroom.draco.glb",
    bytes: 394524,
    base64: ""
  });
})();
