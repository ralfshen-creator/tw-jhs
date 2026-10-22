/*
 * 國小國語課文圖解（SVG）：只畫寫作結構這類抽象概念，不收錄課文。
 */
(function () {
  function fig(svg, caption) {
    return `<figure class="fig"><div class="fig-scroll">${svg}</div><div class="fig-hint">← 左右滑動看完整圖，或點圖放大 →</div>${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
  }
  const T = (x, y, s, cls, anchor) => `<text x="${x}" y="${y}" text-anchor="${anchor || "middle"}" class="${cls || "s-text"}">${s}</text>`;
  const R = (x, y, w, h, cls) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" class="${cls}"/>`;
  const mk = id => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 Z" class="s-accent-fill"/></marker></defs>`;
  const A = (id, x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="s-arrow" marker-end="url(#${id})"/>`;

  // ---------- 議論文的架構 ----------
  const argue = `<svg viewBox="0 0 560 170" width="560" role="img" aria-label="議論文的架構：論點、論據、結論">${mk("ar")}
  ${R(10, 40, 160, 80, "s-node")}${T(90, 72, "論點")}${T(90, 96, "我主張什麼", "s-small")}
  ${A("ar", 172, 80, 198, 80)}
  ${R(200, 40, 160, 80, "s-node-chem")}${T(280, 66, "論據")}${T(280, 88, "事實、例子、", "s-small")}${T(280, 106, "名言（正例、反例）", "s-small")}
  ${A("ar", 362, 80, 388, 80)}
  ${R(390, 40, 160, 80, "s-earth-soft")}${T(470, 72, "結論")}${T(470, 96, "再強調一次主張", "s-small")}
  ${T(280, 150, "事實：可以查證的事；觀點：個人的看法和評價", "s-tiny")}
</svg>`;

  // ---------- 起承轉合 ----------
  const qcz = `<svg viewBox="0 0 560 150" width="560" role="img" aria-label="起承轉合四個部分">${mk("qz")}
  ${[["起", "開頭，引出主題"], ["承", "接著發展、說明"], ["轉", "轉折、換個角度"], ["合", "收尾，點出情感或道理"]].map((p, i) =>
    R(10 + i * 140, 30, 120, 80, i === 2 ? "s-node-chem" : "s-node") + T(70 + i * 140, 64, p[0], "s-big") + T(70 + i * 140, 96, p[1], "s-tiny") + (i < 3 ? A("qz", 132 + i * 140, 70, 148 + i * 140, 70) : "")).join("")}
</svg>`;

  window.FIG = { fig, argue, qcz };
})();
