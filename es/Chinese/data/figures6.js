/*
 * 國小國語課文圖解（SVG），六年級。只畫寫作結構這類抽象概念；律詩用的是唐詩（杜甫〈客至〉），不收錄課文。
 */
(function () {
  const T = (x, y, s, cls, anchor) => `<text x="${x}" y="${y}" text-anchor="${anchor || "middle"}" class="${cls || "s-text"}">${s}</text>`;
  const R = (x, y, w, h, cls) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" class="${cls}"/>`;

  // ---------- 律詩的結構（以〈客至〉為例） ----------
  const lines = [["舍南舍北皆春水", "但見群鷗日日來"], ["花徑不曾緣客掃", "蓬門今始為君開"], ["盤飧市遠無兼味", "樽酒家貧只舊醅"], ["肯與鄰翁相對飲", "隔籬呼取盡餘杯"]];
  const names = ["首聯", "頷聯", "頸聯", "尾聯"];
  const lushi = `<svg viewBox="0 0 560 230" width="560" role="img" aria-label="七言律詩八句分成首聯、頷聯、頸聯、尾聯，頷聯和頸聯要對仗">
  ${lines.map((l, i) => R(10, 10 + i * 52, 80, 42, i === 1 || i === 2 ? "s-node-chem" : "s-node") + T(50, 37 + i * 52, names[i]) +
    T(200, 37 + i * 52, l[0] + "，", "s-small") + T(380, 37 + i * 52, l[1] + "。", "s-small")).join("")}
  ${T(500, 92, "頷聯、頸聯", "s-tiny")}${T(500, 110, "要對仗", "s-tiny")}
  ${T(500, 30, "八句", "s-tiny")}${T(500, 48, "每句 7 字", "s-tiny")}
</svg>`;

  // ---------- 敘述的人稱 ----------
  const person = `<svg viewBox="0 0 560 140" width="560" role="img" aria-label="第一人稱、第二人稱、第三人稱">
  ${[["第一人稱", "我……", "寫自己的經歷，親切"], ["第二人稱", "你……", "像在對讀者說話"], ["第三人稱", "他、她、小明……", "旁觀者角度，看得較全面"]].map((p, i) =>
    R(10 + i * 184, 10, 172, 118, i === 0 ? "s-node-chem" : "s-node") + T(96 + i * 184, 42, p[0]) + T(96 + i * 184, 72, p[1], "s-small") + T(96 + i * 184, 102, p[2], "s-tiny")).join("")}
</svg>`;

  Object.assign(window.FIG, { lushi, person });
})();
