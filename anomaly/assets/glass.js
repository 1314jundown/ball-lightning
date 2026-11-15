(function () {
  var list = window.SCENE_SAMPLES = window.SCENE_SAMPLES || [];
  if (list.some(function (s) { return s.id === "prop-glass"; })) return;
  list.push({ id: "prop-glass", role: "prop", file: "samples/props/glassware.draco.glb",
    bytes: 62936, base64: "" });
})();
