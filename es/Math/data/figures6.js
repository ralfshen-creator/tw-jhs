/*
 * 國小數學課文圖解（SVG），六上、六下。沿用 figures.js 的小工具（FIG._），畫好的圖加進 window.FIG。
 * 課文圖會標出答案；q 開頭的是看圖題用的圖，圖上不寫答案。
 */
(function () {
  const { r1, T, L, R, dot, poly, pt, wedge, bar } = FIG._;
  const arc = (cx, cy, r, a1, a2, cls) => {
    const p1 = pt(cx, cy, r, a1), p2 = pt(cx, cy, r, a2), large = Math.abs(a2 - a1) > 180 ? 1 : 0;
    return `<path d="M${r1(p1[0])},${r1(p1[1])} A${r} ${r} 0 ${large} 0 ${r1(p2[0])},${r1(p2[1])}" class="${cls}" fill="none"/>`;
  };

  // ---------- 六上 1 短除法找最大公因數、最小公倍數 ----------
  const shortDiv = (() => {
    const rows = [["2", "12", "18"], ["3", "6", "9"], ["", "2", "3"]];
    let g = "";
    rows.forEach((r, i) => {
      const y = 40 + i * 40;
      g += T(40, y, r[0], "s-text") + T(90, y, r[1], "s-text") + T(140, y, r[2], "s-text");
      if (i < 2) g += L(56, y - 26, 56, y + 10) + L(56, y + 10, 166, y + 10);
    });
    return `<svg viewBox="0 0 520 170" width="520" role="img" aria-label="用短除法求 12 和 18 的最大公因數與最小公倍數">${g}
  ${R(190, 20, 320, 56, "s-node")}${T(350, 44, "最大公因數 = 左邊相乘", "s-small")}${T(350, 66, "2 × 3 = 6", "s-text")}
  ${R(190, 90, 320, 56, "s-node-chem")}${T(350, 114, "最小公倍數 = 左邊和底下全部相乘", "s-small")}${T(350, 136, "2 × 3 × 2 × 3 = 36", "s-text")}
</svg>`;
  })();

  // ---------- 六上 2 分數除法：3 ÷ 3/4 ----------
  const fracDiv = (() => {
    let g = "";
    for (let u = 0; u < 3; u++) g += bar(20 + u * 160, 30, 160, 34, 4, 0);
    // 每 3 格一組，共 4 組
    for (let k = 0; k < 4; k++) {
      const x = 20 + k * 120;
      g += R(x + 2, 74, 116, 10, k % 2 ? "s-node-chem" : "s-node") + T(x + 60, 104, `第 ${k + 1} 份`, "s-small");
    }
    for (let u = 0; u <= 3; u++) g += T(20 + u * 160, 22, u, "s-tiny");
    return `<svg viewBox="0 0 520 130" width="520" role="img" aria-label="3 公升每 3/4 公升裝一瓶，可以裝 4 瓶">${g}
  ${T(260, 124, "每格是 1/4，3 格（3/4）一份，3 裡面有 4 個 3/4", "s-tiny")}
</svg>`;
  })();

  // ---------- 六上 3 火柴棒排正方形的規律 ----------
  const sticks = (() => {
    let g = "";
    const sq = (x0, n) => {
      let s = "";
      for (let i = 0; i <= n; i++) s += L(x0 + i * 30, 30, x0 + i * 30, 60, "s-accent-line");
      for (let i = 0; i < n; i++) s += L(x0 + i * 30, 30, x0 + i * 30 + 30, 30, "s-accent-line") + L(x0 + i * 30, 60, x0 + i * 30 + 30, 60, "s-accent-line");
      return s;
    };
    g += sq(20, 1) + T(35, 86, "1 個：4 根", "s-small");
    g += sq(110, 2) + T(140, 86, "2 個：7 根", "s-small");
    g += sq(240, 3) + T(285, 86, "3 個：10 根", "s-small");
    return `<svg viewBox="0 0 520 130" width="520" role="img" aria-label="用火柴棒排一排正方形">${g}
  ${T(470, 50, "……", "s-text")}${T(260, 118, "每多 1 個正方形，多 3 根：根數 = 1 + 3 × 正方形個數", "s-tiny")}
</svg>`;
  })();

  // ---------- 六上 3 間隔問題：兩端都種 ----------
  const gaps = (() => {
    let g = L(20, 60, 500, 60, "s-line");
    for (let i = 0; i < 5; i++) {
      const x = 20 + i * 120;
      g += `<circle cx="${x}" cy="44" r="12" class="s-node-chem"/>` + L(x, 56, x, 66, "s-line");
      if (i < 4) g += T(x + 60, 84, `間隔 ${i + 1}`, "s-tiny");
    }
    return `<svg viewBox="0 0 520 120" width="520" role="img" aria-label="一條路兩端都種樹，5 棵樹有 4 個間隔">${g}
  ${T(260, 112, "兩端都種：棵數 = 間隔數 + 1", "s-small")}
</svg>`;
  })();

  // ---------- 六上 5 比：果汁和水 2 : 3 ----------
  const ratioCups = (() => {
    let g = "";
    for (let i = 0; i < 2; i++) g += R(30 + i * 56, 30, 46, 60, "s-node-chem") + T(53 + i * 56, 66, "汁", "s-small");
    for (let i = 0; i < 3; i++) g += R(170 + i * 56, 30, 46, 60, "s-node") + T(193 + i * 56, 66, "水", "s-small");
    return `<svg viewBox="0 0 520 130" width="520" role="img" aria-label="2 杯果汁和 3 杯水">${g}
  ${T(400, 52, "果汁 : 水 = 2 : 3", "s-text")}${T(400, 78, "比值 = 2 ÷ 3 = 2/3", "s-small")}
  ${T(260, 118, "前項和後項同乘或同除以一個不是 0 的數，比不變", "s-tiny")}
</svg>`;
  })();

  // ---------- 六上 6 圓周率：把圓滾一圈 ----------
  const piRoll = (() => {
    // 直徑 90 像素，滾一圈約 282.6 像素
    return `<svg viewBox="0 0 540 170" width="540" role="img" aria-label="圓滾一圈的長度大約是直徑的 3.14 倍">
  <circle cx="65" cy="62" r="45" class="s-node-main"/>${L(20, 62, 110, 62, "s-accent-line")}${T(65, 56, "直徑", "s-tiny")}
  ${L(20, 112, 320, 112, "s-line")}${dot(65, 107, "s-accent-fill")}
  ${[0, 1, 2].map(i => R(20 + i * 90, 120, 90, 14, i % 2 ? "s-node-chem" : "s-node")).join("")}${R(290, 120, 12.6, 14, "s-node-chem")}
  ${T(65, 152, "1 個直徑", "s-tiny")}${T(155, 152, "2 個", "s-tiny")}${T(245, 152, "3 個", "s-tiny")}${T(300, 152, "多一點", "s-tiny")}
  ${T(430, 60, "圓周長 ÷ 直徑", "s-text")}${T(430, 86, "= 圓周率（約 3.14）", "s-small")}${T(430, 120, "圓周長 = 直徑 × 3.14", "s-small")}
</svg>`;
  })();

  // ---------- 六上 6 扇形周長 = 2 條半徑 + 弧長 ----------
  const sectorPerim = (() => {
    const cx = 80, cy = 140, r = 110;
    return `<svg viewBox="0 0 520 170" width="520" role="img" aria-label="四分之一圓的周長是兩條半徑加上弧長">
  ${wedge(cx, cy, r, 0, 90, "s-node-main")}${L(cx, cy, cx + r, cy, "s-accent-line")}${L(cx, cy, cx, cy - r, "s-accent-line")}
  ${arc(cx, cy, r, 0, 90, "s-chem-line")}${T(cx + 55, cy + 16, "半徑", "s-tiny")}${T(cx - 22, cy - 55, "半徑", "s-tiny")}${T(cx + 92, cy - 82, "弧", "s-small")}
  ${T(350, 50, "扇形周長 = 半徑 × 2 + 弧長", "s-text")}
  ${T(350, 80, "弧長 = 圓周長 × 圓心角/360", "s-small")}
  ${T(350, 110, "圓心角 90°：弧長是圓周長的 1/4", "s-small")}
</svg>`;
  })();

  // ---------- 六上 7 圓面積：切開重排成近似長方形 ----------
  const circleArea = (() => {
    // 8 片扇形一上一下交錯拼起來（相鄰兩片錯開半個底邊）
    const n = 8, w = 40, h = 70, x0 = 250, y0 = 40;
    let g = `<circle cx="110" cy="80" r="70" class="s-node-main"/>`;
    for (let i = 0; i < n; i++) g += L(110, 80, ...pt(110, 80, 70, i * 360 / n));
    for (let i = 0; i < n; i++) {
      const x = x0 + i * w / 2;
      const up = i % 2 === 0;
      g += poly(up ? [[x, y0 + h], [x + w, y0 + h], [x + w / 2, y0]] : [[x, y0], [x + w, y0], [x + w / 2, y0 + h]], up ? "s-node" : "s-node-chem");
    }
    const xe = x0 + w * (n + 1) / 2;
    return `<svg viewBox="0 0 540 170" width="540" role="img" aria-label="把圓切成很多扇形，拼成接近長方形">${g}
  ${T(212, 88, "→", "s-big")}${L(x0, y0 + h + 14, x0 + w * n / 2, y0 + h + 14, "s-accent-line")}${T(x0 + w * n / 4, y0 + h + 32, "長 ≈ 圓周長的一半", "s-tiny")}
  ${T(xe + 10, y0 + h / 2 + 4, "寬 ≈ 半徑", "s-tiny", "start")}
  ${T(270, 164, "圓面積 = 半徑 × 半徑 × 3.14", "s-small")}
</svg>`;
  })();

  // ---------- 六上 8 速率：距離、時間、速率 ----------
  const speedLine = (() => {
    let g = L(30, 60, 510, 60, "s-line");
    for (let i = 0; i <= 3; i++) g += L(30 + i * 160, 52, 30 + i * 160, 68, "s-line") + T(30 + i * 160, 86, `${i} 小時`, "s-tiny") + T(30 + i * 160, 42, `${i * 60} 公里`, "s-tiny");
    return `<svg viewBox="0 0 540 150" width="540" role="img" aria-label="時速 60 公里，每小時走 60 公里">${g}
  ${R(110, 100, 320, 40, "s-node")}${T(270, 126, "距離 = 速率 × 時間　速率 = 距離 ÷ 時間", "s-small")}
</svg>`;
  })();

  // ---------- 六上 9 放大圖：每邊變 2 倍 ----------
  const enlarge = (() => {
    let g = "";
    for (let i = 0; i <= 16; i++) g += L(20 + i * 20, 20, 20 + i * 20, 140, "s-tick");
    for (let j = 0; j <= 6; j++) g += L(20, 20 + j * 20, 340, 20 + j * 20, "s-tick");
    g += poly([[40, 120], [100, 120], [40, 80]], "s-node") + poly([[160, 120], [280, 120], [160, 40]], "s-node-chem");
    return `<svg viewBox="0 0 540 170" width="540" role="img" aria-label="直角三角形放大 2 倍">${g}
  ${T(70, 160, "底 3 格", "s-tiny")}${T(220, 160, "底 6 格", "s-tiny")}
  ${T(440, 50, "對應邊都變 2 倍", "s-small")}${T(440, 76, "對應角相等", "s-small")}${T(440, 102, "面積變 2 × 2 = 4 倍", "s-small")}
</svg>`;
  })();

  // ---------- 六下 2 相遇問題 ----------
  const meet = (() => {
    return `<svg viewBox="0 0 540 140" width="540" role="img" aria-label="兩人從兩地相向而行">
  ${L(40, 70, 500, 70, "s-line")}${dot(40, 70, "s-accent-fill")}${dot(500, 70, "s-accent-fill")}${T(40, 96, "甲地", "s-small")}${T(500, 96, "乙地", "s-small")}
  ${L(50, 50, 200, 50, "s-arrow")}${T(125, 40, "小明 →", "s-tiny")}${L(490, 50, 300, 50, "s-arrow")}${T(395, 40, "← 小華", "s-tiny")}
  ${T(270, 124, "相遇時間 = 兩地距離 ÷（兩人速率的和）", "s-small")}
</svg>`;
  })();

  // ---------- 六下 3 圓柱體積 = 底面積 × 高 ----------
  const cylinder = (q) => {
    const cx = 120, top = 40, bot = 150, rx = 70, ry = 18;
    return `<svg viewBox="0 -6 ${q ? 300 : 520} 196" width="${q ? 300 : 520}" role="img" aria-label="${q ? "圓柱，標出底面半徑和高" : "圓柱的體積是底面積乘以高"}">
  <path d="M${cx - rx},${top} L${cx - rx},${bot} A${rx} ${ry} 0 0 0 ${cx + rx},${bot} L${cx + rx},${top}" class="s-node-main"/>
  <ellipse cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}" class="s-node"/>
  ${L(cx, top, cx + rx, top, "s-accent-line")}${dot(cx, top, "s-accent-fill")}${T(cx + rx / 2, top - ry - 4, q ? "4 公分" : "半徑", "s-tiny")}
  ${L(cx + rx + 14, top, cx + rx + 14, bot, "s-guide")}${T(cx + rx + 20, (top + bot) / 2, q ? "10 公分" : "高", "s-tiny", "start")}
  ${q ? "" : T(370, 70, "柱體體積 = 底面積 × 高", "s-text") + T(370, 98, "圓柱：半徑 × 半徑 × 3.14 × 高", "s-small") + T(370, 126, "角柱：底面多邊形面積 × 高", "s-small")}
</svg>`;
  };
  const cylFig = cylinder(false), qCylinder = cylinder(true);

  // ---------- 六下 4 基準量與比較量（線段圖） ----------
  const baseBar = (() => {
    return `<svg viewBox="0 0 540 150" width="540" role="img" aria-label="基準量和比較量的線段圖">
  ${bar(110, 30, 300, 26, 5, 5)}${T(60, 48, "基準量", "s-small")}${T(260, 22, "全班 40 人（當作 1）", "s-tiny")}
  ${bar(110, 80, 300, 26, 5, 3, "s-node-chem")}${T(60, 98, "比較量", "s-small")}${T(200, 124, "男生是全班的 3/5", "s-tiny")}
  ${T(270, 144, "比較量 = 基準量 × 比值：40 × 3/5 = 24（人）", "s-tiny")}
</svg>`;
  })();

  // ---------- 六下 6 圓形百分圖 ----------
  const pie = (data, q) => {
    const cx = 110, cy = 100, r = 80;
    let a = 90, g = "";
    const cls = ["s-node", "s-node-chem", "s-honey", "s-node-main"];
    data.forEach(([name, p], i) => {
      const a2 = a - p * 3.6;
      g += wedge(cx, cy, r, a2, a, cls[i % 4]);
      const m = pt(cx, cy, r * 0.6, (a + a2) / 2);
      g += T(m[0], m[1] - 2, name, "s-tiny") + T(m[0], m[1] + 14, p + "%", "s-tiny");
      a = a2;
    });
    return `<svg viewBox="0 0 ${q ? 240 : 520} 200" width="${q ? 240 : 520}" role="img" aria-label="圓形百分圖">${g}
  ${q ? "" : T(370, 70, "整個圓是 100%", "s-text") + T(370, 98, "每 1% 是 3.6°", "s-small") + T(370, 126, "量 = 總量 × 百分率", "s-small")}
</svg>`;
  };
  const pieFig = pie([["騎車", 40], ["走路", 30], ["搭車", 20], ["其他", 10]], false);
  const qPie = pie([["國語", 35], ["數學", 25], ["自然", 25], ["英語", 15]], true);

  // ---------- 看圖題：正方形裡的四分之一圓（求塗色部分） ----------
  const qQuarter = `<svg viewBox="0 0 220 210" width="220" role="img" aria-label="邊長 10 公分的正方形裡有一個四分之一圓">
  ${R(30, 20, 160, 160, "s-node-chem")}${wedge(30, 180, 160, 0, 90, "s-node-main")}${dot(30, 180, "s-accent-fill")}
  ${T(110, 200, "10 公分", "s-tiny")}
</svg>`;

  // ---------- 看圖題：轉盤 ----------
  const qSpinner = (() => {
    let g = "";
    const parts = [["紅", 0, 180, "s-tint"], ["藍", 180, 270, "s-node"], ["黃", 270, 360, "s-honey"]];
    parts.forEach(([n, a1, a2, c]) => { g += wedge(100, 100, 80, a1, a2, c); const m = pt(100, 100, 46, (a1 + a2) / 2); g += T(m[0], m[1] + 5, n, "s-small"); });
    return `<svg viewBox="0 0 200 200" width="200" role="img" aria-label="分成紅、藍、黃三區的轉盤">${g}${dot(100, 100, "s-accent-fill")}</svg>`;
  })();

  Object.assign(window.FIG, { shortDiv, fracDiv, sticks, gaps, ratioCups, piRoll, sectorPerim, circleArea, speedLine, enlarge,
    meet, cylFig, qCylinder, baseBar, pieFig, qPie, qQuarter, qSpinner });
})();
