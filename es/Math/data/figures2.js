/*
 * 國小數學課文圖解（SVG），五下。沿用 figures.js 的小工具（FIG._），畫好的圖加進 window.FIG。
 * 課文圖會標出答案；q 開頭的是看圖題用的圖，圖上不寫答案。
 */
(function () {
  const { r1, T, L, R, poly, bar } = FIG._;

  // 斜二測的長方體：前面 a × c 格、往後 b 格；每格 s 像素，往後一格是 (dx, dy)
  function box(x0, y0, a, b, c, s, o) {
    o = o || {};
    const dx = s * 0.45, dy = -s * 0.38;
    const P = (i, j, k) => [x0 + i * s + j * dx, y0 - k * s + j * dy];   // i 長、j 寬（往後）、k 高
    let g = "";
    // 三個看得到的面
    g += poly([P(0, 0, 0), P(a, 0, 0), P(a, 0, c), P(0, 0, c)], o.front || "s-node");
    g += poly([P(0, 0, c), P(a, 0, c), P(a, b, c), P(0, b, c)], o.top || "s-node-main");
    g += poly([P(a, 0, 0), P(a, b, 0), P(a, b, c), P(a, 0, c)], o.side || "s-node-chem");
    if (o.grid !== false) {
      for (let i = 1; i < a; i++) g += L(...P(i, 0, 0), ...P(i, 0, c), "s-tick") + L(...P(i, 0, c), ...P(i, b, c), "s-tick");
      for (let k = 1; k < c; k++) g += L(...P(0, 0, k), ...P(a, 0, k), "s-tick") + L(...P(a, 0, k), ...P(a, b, k), "s-tick");
      for (let j = 1; j < b; j++) g += L(...P(0, j, c), ...P(a, j, c), "s-tick") + L(...P(a, j, 0), ...P(a, j, c), "s-tick");
    }
    return { g, P };
  }

  // ---------- 五下 1 體積：數 1 立方公分的積木 ----------
  const volCubes = (() => {
    const b = box(50, 170, 4, 3, 2, 40);
    return `<svg viewBox="0 0 460 210" width="460" role="img" aria-label="長 4、寬 3、高 2 的積木一共 24 個">${b.g}
  ${T(130, 196, "長 4 公分", "s-small")}${T(30, 134, "高 2", "s-small", "end")}${T(260, 112, "寬 3", "s-small", "start")}
  ${T(310, 150, "一層 4 × 3 = 12 個", "s-text", "start")}${T(310, 174, "2 層 12 × 2 = 24 個", "s-text", "start")}
  ${T(310, 198, "體積 24 立方公分", "s-accent-text", "start")}
</svg>`;
  })();

  // ---------- 五下 1 簡單複合形體 ----------
  const composite = (() => {
    const a = box(40, 180, 2, 2, 3, 34, { grid: false });
    const b = box(108, 180, 3, 2, 1, 34, { grid: false });
    return `<svg viewBox="0 0 460 220" width="460" role="img" aria-label="L 形的形體切成兩個長方體">${a.g}${b.g}
  ${T(300, 70, "切成兩塊長方體，", "s-text", "start")}${T(300, 94, "分別算體積再加起來", "s-text", "start")}
  ${T(300, 134, "也可以補成一個大長方體，", "s-small", "start")}${T(300, 154, "再減掉缺的那一塊", "s-small", "start")}
</svg>`;
  })();

  // ---------- 五下 2 分數 × 分數的面積圖 ----------
  const fracMul = (() => {
    const x0 = 40, y0 = 20, W = 240, H = 180;
    let g = R(x0, y0, W, H, "s-node-main");
    g += R(x0, y0, W * 3 / 4, H, "s-node");                       // 3/4（直的 4 份塗 3 份）
    g += R(x0, y0, W * 3 / 4, H * 2 / 3, "s-node-chem");            // 再取 2/3（橫的 3 份取 2 份）
    for (let i = 1; i < 4; i++) g += L(x0 + i * W / 4, y0, x0 + i * W / 4, y0 + H, "s-tick");
    for (let k = 1; k < 3; k++) g += L(x0, y0 + k * H / 3, x0 + W, y0 + k * H / 3, "s-tick");
    return `<svg viewBox="0 0 460 220" width="460" role="img" aria-label="2/3 × 3/4 的面積圖，重疊 6 格">${g}
  ${T(130, 216, "← 3/4 →", "s-small")}${T(30, 82, "2/3", "s-small", "end")}
  ${T(300, 60, "全部切成 3 × 4 = 12 格", "s-text", "start")}${T(300, 90, "深色重疊 2 × 3 = 6 格", "s-text", "start")}
  ${T(300, 130, "2/3 × 3/4 = 6/12", "s-accent-text", "start")}${T(300, 154, "　　　　 = 1/2", "s-accent-text", "start")}
</svg>`;
  })();

  // ---------- 五下 3 容積：容器的內部 ----------
  const capacityBox = `<svg viewBox="0 0 520 200" width="520" role="img" aria-label="容器的容積用內部的長、寬、高來算">
  ${R(40, 40, 200, 140, "s-wood")}${R(52, 40, 176, 128, "s-node-main")}${R(52, 80, 176, 88, "s-water")}
  ${L(52, 30, 228, 30, "s-guide")}${T(140, 24, "內部的長", "s-small")}${L(244, 40, 244, 168, "s-guide")}${T(250, 108, "內部的高", "s-small", "start")}
  ${T(330, 60, "容積 = 內部的", "s-text", "start")}${T(330, 82, "長 × 寬 × 高", "s-text", "start")}
  ${T(330, 124, "1 公升 = 1000 立方公分", "s-accent-text", "start")}${T(330, 148, "1 毫升 = 1 立方公分", "s-accent-text", "start")}
</svg>`;

  // ---------- 五下 3 排水法量不規則物體的體積 ----------
  const displace = (() => {
    const tank = (x, level, stone) => `${R(x, 40, 120, 130, "s-glass-fill")}${R(x, 170 - level, 120, level, "s-water")}
  ${stone ? `<ellipse cx="${x + 60}" cy="150" rx="26" ry="18" class="s-stone"/>` : ""}${L(x, 170 - level, x + 120, 170 - level, "s-accent-line")}`;
    return `<svg viewBox="0 0 500 210" width="500" role="img" aria-label="放入石頭後水面上升，上升的水的體積就是石頭的體積">
  ${tank(40, 70, false)}${tank(260, 90, true)}${T(220, 110, "→", "s-big")}
  ${T(100, 196, "放石頭前", "s-small")}${T(320, 196, "放石頭後：水面上升", "s-small")}
  ${T(390, 74, "上升的高度", "s-chem-text", "start")}${L(386, 80, 386, 100, "s-chem-line")}
</svg>`;
  })();

  // ---------- 五下 4 小數 × 小數的方格圖 ----------
  const decMul = (() => {
    const x0 = 40, y0 = 10, c = 18;
    let g = "";
    for (let i = 0; i < 10; i++) for (let k = 0; k < 10; k++) {
      const inA = i < 4, inB = k < 3;
      g += R(x0 + i * c, y0 + k * c, c, c, inA && inB ? "s-node-chem" : inA || inB ? "s-node" : "s-node-main");
    }
    return `<svg viewBox="0 0 460 200" width="460" role="img" aria-label="0.3 × 0.4 在 100 格中重疊 12 格">${g}
  ${T(260, 40, "整個正方形是 1", "s-text", "start")}${T(260, 66, "直的取 0.4，橫的取 0.3", "s-text", "start")}
  ${T(260, 100, "重疊 12 格 = 12 個 0.01", "s-text", "start")}${T(260, 134, "0.3 × 0.4 = 0.12", "s-accent-text", "start")}
</svg>`;
  })();

  // ---------- 五下 5 折線圖 ----------
  function lineChart(vals, o) {
    const x0 = 60, y0 = 170, w = 50, u = o.unit;
    let g = "";
    for (let v = o.min; v <= o.max; v += o.step) {
      const y = y0 - (v - o.min) * u;
      g += L(x0, y, x0 + w * vals.length, y, "s-grid") + T(x0 - 8, y + 5, v, "s-small", "end");
    }
    if (o.min > 0) g += `<path d="M${x0 - 6},${y0 + 6} l6,-4 l-6,-4 l6,-4" class="s-tick"/>`;   // 省略符號
    g += L(x0, 20, x0, y0 + 4) + L(x0 - 4, y0, x0 + w * vals.length + 6, y0);
    const pts = vals.map((v, i) => [x0 + w / 2 + i * w, y0 - (v - o.min) * u]);
    g += `<polyline points="${pts.map(p => r1(p[0]) + "," + r1(p[1])).join(" ")}" class="s-accent-line"/>`;
    pts.forEach((p, i) => {
      g += `<circle cx="${r1(p[0])}" cy="${r1(p[1])}" r="4" class="s-accent-fill"/>` + T(p[0], y0 + 20, o.labels[i], "s-small");
      if (o.showVals) g += T(p[0], p[1] - 10, vals[i], "s-small");
    });
    return g + T(x0 - 4, 14, o.yName, "s-small", "start");
  }
  const lineChartFig = `<svg viewBox="0 0 460 210" width="460" role="img" aria-label="一週的最高氣溫折線圖">
  ${lineChart([24, 26, 25, 28, 30, 29, 27], { min: 20, max: 32, step: 2, unit: 12, labels: ["一", "二", "三", "四", "五", "六", "日"], yName: "氣溫（°C）", showVals: true })}
  ${T(240, 206, "星期", "s-small")}
</svg>`;

  // ---------- 五下 7 長方體的展開圖 ----------
  const cuboidNet = (() => {
    const s = 22, A = 5 * s, B = 3 * s, C = 2 * s;   // 長 5、寬 3、高 2
    const x0 = 30 + B, y0 = 10;
    const face = (x, y, w, h, cls, label) => R(x, y, w, h, cls) + T(x + w / 2, y + h / 2 + 5, label, "s-small");
    let g = "";
    g += face(x0, y0, A, C, "s-node", "5 × 2");                 // 後
    g += face(x0, y0 + C, A, B, "s-node-chem", "5 × 3");        // 上
    g += face(x0, y0 + C + B, A, C, "s-node", "5 × 2");         // 前
    g += face(x0, y0 + 2 * C + B, A, B, "s-node-chem", "5 × 3");// 下
    g += face(x0 - C, y0 + C, C, B, "s-gas", "2×3");            // 左
    g += face(x0 + A, y0 + C, C, B, "s-gas", "2×3");            // 右
    return `<svg viewBox="0 0 460 230" width="460" role="img" aria-label="長 5、寬 3、高 2 的長方體展開圖">${g}
  ${T(260, 50, "同色的面一樣大，各有 2 個", "s-text", "start")}
  ${T(260, 90, "(5×3 + 5×2 + 3×2) × 2", "s-accent-text", "start")}${T(260, 114, "= 31 × 2 = 62", "s-accent-text", "start")}
  ${T(260, 150, "表面積 62 平方公分", "s-text", "start")}
</svg>`;
  })();

  // ---------- 五下 8 百分率的 100 格 ----------
  function hundred(x0, y0, k, c) {
    let g = "";
    for (let n = 0; n < 100; n++) g += R(x0 + (n % 10) * c, y0 + Math.floor(n / 10) * c, c, c, n < k ? "s-node" : "s-node-main");
    return g;
  }
  const percentGrid = `<svg viewBox="0 0 460 200" width="460" role="img" aria-label="100 格塗 35 格是 35%">${hundred(30, 10, 35, 18)}
  ${T(240, 50, "全部 100 格，塗了 35 格", "s-text", "start")}${T(240, 84, "比率 35/100 = 0.35", "s-text", "start")}
  ${T(240, 118, "百分率 35%", "s-accent-text", "start")}${T(240, 152, "讀作「百分之三十五」", "s-small", "start")}
</svg>`;

  // ---------- 五下 10 公畝、公頃 ----------
  const areaUnits = `<svg viewBox="0 0 520 230" width="520" role="img" aria-label="1 公頃是邊長 100 公尺的正方形，裡面有 100 個 1 公畝">
  ${R(30, 10, 200, 200, "s-node-main")}${R(30, 10, 20, 20, "s-node-chem")}
  ${(() => { let g = ""; for (let i = 1; i < 10; i++) g += L(30 + i * 20, 10, 30 + i * 20, 210, "s-grid") + L(30, 10 + i * 20, 230, 10 + i * 20, "s-grid"); return g; })()}
  ${T(130, 226, "邊長 100 公尺", "s-small")}
  ${T(250, 30, "小格：邊長 10 公尺", "s-chem-text", "start")}${T(250, 54, "= 100 平方公尺 = 1 公畝", "s-small", "start")}
  ${T(250, 100, "大正方形：邊長 100 公尺", "s-accent-text", "start")}${T(250, 124, "= 10000 平方公尺 = 1 公頃", "s-small", "start")}
  ${T(250, 160, "1 公頃 = 100 公畝", "s-text", "start")}${T(250, 192, "1 平方公里 = 100 公頃", "s-text", "start")}
</svg>`;

  // ================= 看圖題（圖上不寫答案） =================
  const qLineChart = `<svg viewBox="0 0 420 210" width="420" role="img" aria-label="小樹一到五月的高度折線圖">
  ${lineChart([30, 35, 40, 40, 50], { min: 30, max: 50, step: 5, unit: 7, labels: ["1月", "2月", "3月", "4月", "5月"], yName: "高度（公分）", showVals: false })}
</svg>`;
  const qCuboid = (() => {
    const b = box(50, 170, 6, 4, 3, 26, { grid: false });
    return `<svg viewBox="0 0 360 200" width="360" role="img" aria-label="長 6 公分、寬 4 公分、高 3 公分的長方體">${b.g}
  ${T(128, 192, "6 公分", "s-text")}${T(44, 134, "3 公分", "s-text", "end")}${T(238, 164, "4 公分", "s-text", "start")}
</svg>`;
  })();
  const qComposite = (() => {
    // 下層 6 × 4 × 2，上層靠左 3 × 4 × 2
    const a = box(80, 190, 6, 4, 2, 26, { grid: false });
    const b = box(80, 138, 3, 4, 2, 26, { grid: false });
    return `<svg viewBox="0 0 460 220" width="460" role="img" aria-label="兩個長方體疊成的形體">${a.g}${b.g}
  ${T(158, 210, "6 公分", "s-text")}${T(120, 32, "3 公分", "s-text")}${T(72, 166, "2 公分", "s-text", "end")}${T(72, 114, "2 公分", "s-text", "end")}${T(294, 152, "寬都是 4 公分", "s-text", "start")}
</svg>`;
  })();
  const qPercent = `<svg viewBox="0 0 200 200" width="200" role="img" aria-label="100 格中有一些塗色">${hundred(10, 10, 64, 18)}</svg>`;

  Object.assign(window.FIG, { volCubes, composite, fracMul, capacityBox, displace, decMul, lineChartFig, cuboidNet, percentGrid, areaUnits,
    qLineChart, qCuboid, qComposite, qPercent });
})();
