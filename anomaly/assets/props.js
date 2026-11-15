/* 由 tools/build-props.mjs 生成，请勿手改。
   道具：桌子 / 椅子 / 杯子 / 书架
   只有工作台加载；用卡片上的「＋ 加入舞台」叠到房间上再摆位置
   原始 obj 在 inbox/models/，减面/转 glb 见 tools/obj-decimate.mjs。 */
(function () {
  const list = window.SCENE_SAMPLES = window.SCENE_SAMPLES || [];
  const add = [
    { id: "prop-table", label: "圆桌（桌布）", role: "other", file: "samples/props/table.draco.glb", bytes: 278776,
      base64: "" },
    { id: "prop-chair", label: "椅子", role: "other", file: "samples/props/chair.draco.glb", bytes: 233344,
      base64: "" },
    { id: "prop-cup", label: "白杯子", role: "other", file: "samples/props/cup.draco.glb", bytes: 101860,
      base64: "" },
    { id: "prop-shelf", label: "现代书架", role: "other", file: "samples/props/shelf.draco.glb", bytes: 279724,
      base64: "" }
  ];
  const at = list.findIndex(s => s.id === "sample-restaurant");
  if (at < 0) list.push.apply(list, add);
  else list.splice.apply(list, [at + 1, 0].concat(add));
})();
