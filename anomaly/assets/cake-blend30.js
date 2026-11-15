/* 由 tools/pack-cake.mjs 生成，请勿手改。
   蛋糕（blender格式(30).blend 导出）：32 网格 / 25,452 面 / 8 张内嵌贴图。
   自带盘子、9 支蜡烛与火焰、Happy Birthday 插件；序章会用自己的 14 支蜡烛，
   所以模型自带的蜡烛与火焰节点在 prepareBlendCake() 里会被藏起来。
   注意：这个注释里不要写星号加斜杠，会提前闭合注释。 */
(function () {
  const list = window.SCENE_SAMPLES = window.SCENE_SAMPLES || [];
  const add = [
    { id: "cake-blend30", label: "生日蛋糕（Blender 版）", role: "cake", file: "samples/props/cake-blend30.draco.glb",
      bytes: 445408,
      base64: "" }
  ];
  // 插在最前面：loadAssets 取该 role 的第一个样本
  list.unshift.apply(list, add);
})();
