/*
 * 國小數學課文圖解（SVG），五上。顏色用 style.css 的 s-* class，深色模式會自動變色。
 * curriculum.js 以 ${FIG.fig(FIG.xxx, "圖說")} 引用。課文圖會標出答案，只用在課文；
 * 看圖題用 q 開頭的題目版圖，圖上不寫答案。五下的圖在 figures2.js。
 */
(function () {
  function fig(svg, caption) {
    return `<figure class="fig"><div class="fig-scroll">${svg}</div><div class="fig-hint">← 左右滑動看完整圖，或點圖放大 →</div>${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
  }
  const r1 = n => Math.round(n * 10) / 10;
  const T = (x, y, s, cls, anchor) => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${anchor || "middle"}" class="${cls || "s-text"}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls, extra) => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" class="${cls || "s-line"}" ${extra || ""}/>`;
  const R = (x, y, w, h, cls) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" class="${cls}"/>`;
  const dot = (x, y, cls) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="5" class="${cls || "s-dot"}"/>`;
  const poly = (pts, cls) => `<polygon points="${pts.map(p => r1(p[0]) + "," + r1(p[1])).join(" ")}" class="${cls}"/>`;
  // 扇形（角度用數學方向：0° 向右、逆時針為正）
  const pt = (cx, cy, r, deg) => [cx + r * Math.cos(deg * Math.PI / 180), cy - r * Math.sin(deg * Math.PI / 180)];
  function wedge(cx, cy, r, a1, a2, cls) {
    const p1 = pt(cx, cy, r, a1), p2 = pt(cx, cy, r, a2);
    const sweep = a2 > a1 ? 0 : 1, large = Math.abs(a2 - a1) > 180 ? 1 : 0;
    return `<path d="M${r1(cx)},${r1(cy)} L${r1(p1[0])},${r1(p1[1])} A${r} ${r} 0 ${large} ${sweep} ${r1(p2[0])},${r1(p2[1])} Z" class="${cls}"/>`;
  }
  // 一條分成 n 格、塗滿前 k 格的分數條
  function bar(x, y, w, h, n, k, cls) {
    let g = "";
    for (let i = 0; i < n; i++) g += R(x + i * w / n, y, w / n, h, i < k ? (cls || "s-node") : "s-node-main");
    return g;
  }

  // ---------- 五上 1 小數的位值 ----------
  const decimalPlace = (() => {
    const cols = [["個位", "3", "3 個 1"], ["十分位", "4", "4 個 0.1"], ["百分位", "5", "5 個 0.01"], ["千分位", "6", "6 個 0.001"]];
    let g = "";
    cols.forEach((c, i) => {
      const x = 30 + i * 100;
      g += R(x, 20, 100, 36, "s-node") + R(x, 56, 100, 60, "s-node-main") + T(x + 50, 44, c[0]) + T(x + 50, 98, c[1], "s-big") + T(x + 50, 142, c[2], "s-small");
    });
    return `<svg viewBox="0 0 460 180" width="460" role="img" aria-label="3.456 的位值表">${g}
  <circle cx="130" cy="104" r="5" class="s-accent-fill"/>${L(130, 110, 130, 156, "s-guide")}${T(130, 172, "小數點", "s-accent-text")}
</svg>`;
  })();

  // ---------- 五上 2 用排列找因數 ----------
  const factorRects = (() => {
    const sq = (x, y) => R(x, y, 14, 14, "s-node");
    let g = "";
    for (let i = 0; i < 12; i++) g += sq(20 + i * 16, 20);
    for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) g += sq(20 + i * 16, 64 + r * 16);
    for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) g += sq(20 + i * 16, 124 + r * 16);
    return `<svg viewBox="0 0 460 210" width="460" role="img" aria-label="12 個方塊排成長方形">${g}
  ${T(240, 32, "1 排 12 個：1 × 12 = 12", "s-text", "start")}${T(240, 84, "2 排 6 個：2 × 6 = 12", "s-text", "start")}${T(240, 152, "3 排 4 個：3 × 4 = 12", "s-text", "start")}
  ${T(20, 200, "12 的因數：1、2、3、4、6、12", "s-accent-text", "start")}
</svg>`;
  })();

  // ---------- 五上 3 倍數與公倍數 ----------
  const multipleLine = (() => {
    const X = v => 22 + v * 17;
    let g = L(14, 100, 440, 100);
    for (let v = 0; v <= 24; v++) g += L(X(v), 95, X(v), 105, "s-tick") + (v % 2 === 0 ? T(X(v), 124, v, "s-small") : "");
    for (let v = 0; v < 24; v += 4) g += `<path d="M${X(v)},95 Q${X(v + 2)},58 ${X(v + 4)},95" class="s-arrow"/>`;
    for (let v = 0; v < 24; v += 6) g += `<path d="M${X(v)},105 Q${X(v + 3)},150 ${X(v + 6)},105" class="s-chem-line"/>`;
    g += dot(X(12), 100, "s-other") + dot(X(24), 100, "s-other");
    return `<svg viewBox="0 0 460 190" width="460" role="img" aria-label="數線上 4 的倍數和 6 的倍數">${g}
  ${T(20, 40, "上面：每次跳 4（4 的倍數）", "s-accent-text", "start")}${T(20, 176, "下面：每次跳 6（6 的倍數）", "s-chem-text", "start")}
  ${T(X(12), 80, "12", "s-text")}${T(X(24) - 4, 80, "24", "s-text")}${T(250, 176, "綠點：兩邊都踩到 → 公倍數", "s-small", "start")}
</svg>`;
  })();

  // ---------- 五上 4 擴分、約分：等值分數 ----------
  const equivFrac = `<svg viewBox="0 0 460 190" width="460" role="img" aria-label="1/2、2/4、3/6 一樣大">
  ${bar(90, 20, 300, 34, 2, 1)}${bar(90, 76, 300, 34, 4, 2)}${bar(90, 132, 300, 34, 6, 3)}
  ${T(50, 44, "1/2", "s-big")}${T(50, 100, "2/4", "s-big")}${T(50, 156, "3/6", "s-big")}
  ${L(240, 10, 240, 178, "s-warn-line")}${T(410, 100, "塗色", "s-small", "start")}${T(410, 118, "一樣長", "s-small", "start")}
</svg>`;

  // ---------- 五上 5 三角形的三邊關係 ----------
  const triSides = `<svg viewBox="0 0 460 170" width="460" role="img" aria-label="3 公分、4 公分、8 公分的吸管圍不成三角形">
  ${L(40, 120, 360, 120, "s-rod")}${T(200, 148, "8 公分", "s-text")}
  ${L(40, 104, 160, 104, "s-accent-line")}${T(100, 94, "3 公分", "s-accent-text")}
  ${L(200, 104, 360, 104, "s-chem-line")}${T(280, 94, "4 公分", "s-chem-text")}
  ${L(160, 60, 160, 112, "s-guide")}${L(200, 60, 200, 112, "s-guide")}${T(180, 52, "接不到", "s-small")}
  ${T(400, 70, "3 + 4 = 7", "s-text")}${T(400, 92, "7 < 8", "s-text")}${T(400, 114, "圍不起來", "s-accent-text")}
</svg>`;

  // ---------- 五上 5 三角形內角和 ----------
  const angleSum = `<svg viewBox="0 0 460 210" width="460" role="img" aria-label="三角形的三個角拼起來是一直線">
  ${poly([[60, 170], [220, 170], [110, 50]], "s-node-main")}
  ${wedge(60, 170, 26, 0, 67.4, "s-node-chem")}${wedge(220, 170, 26, 180, 132.5, "s-node")}${wedge(110, 50, 26, 247.4, 312.5, "s-gas")}
  ${T(96, 162, "1", "s-text")}${T(190, 162, "2", "s-text")}${T(112, 92, "3", "s-text")}
  ${wedge(350, 170, 70, 180, 112.6, "s-node-chem")}${wedge(350, 170, 70, 112.6, 47.5, "s-gas")}${wedge(350, 170, 70, 47.5, 0, "s-node")}
  ${L(260, 170, 440, 170)}${T(310, 150, "1", "s-text")}${T(352, 124, "3", "s-text")}${T(392, 150, "2", "s-text")}
  ${T(350, 198, "三個角拼成一直線＝180°", "s-accent-text")}${T(240, 120, "→", "s-big")}
</svg>`;

  // ---------- 五上 5 多邊形分成三角形 ----------
  const polySplit = `<svg viewBox="0 0 460 220" width="460" role="img" aria-label="五邊形從一個頂點分成 3 個三角形">
  ${poly([[150, 20], [250, 90], [210, 190], [90, 190], [50, 90]], "s-node")}
  ${L(150, 20, 210, 190, "s-accent-line")}${L(150, 20, 90, 190, "s-accent-line")}
  ${T(100, 120, "①", "s-text")}${T(150, 150, "②", "s-text")}${T(200, 120, "③", "s-text")}
  ${T(280, 80, "五邊形從一個頂點連線", "s-text", "start")}${T(280, 104, "分成 3 個三角形", "s-text", "start")}
  ${T(280, 140, "內角和 = 3 × 180°", "s-accent-text", "start")}${T(280, 164, "　　　 = 540°", "s-accent-text", "start")}
</svg>`;

  // ---------- 五上 5 扇形與圓心角 ----------
  const sector = (() => {
    const a = pt(120, 120, 90, 0), b = pt(120, 120, 90, 60);
    return `<svg viewBox="0 0 460 230" width="460" role="img" aria-label="扇形、半徑、弧和圓心角">
  <circle cx="120" cy="120" r="90" class="s-node-main"/>${wedge(120, 120, 90, 0, 60, "s-node")}
  ${L(120, 120, a[0], a[1], "s-accent-line")}${L(120, 120, b[0], b[1], "s-accent-line")}${wedge(120, 120, 22, 0, 60, "s-node-chem")}
  ${dot(120, 120, "s-accent-fill")}${T(108, 140, "圓心", "s-small", "end")}${T(156, 112, "圓心角", "s-chem-text", "start")}
  ${T(190, 140, "半徑", "s-small")}${T(214, 64, "弧", "s-accent-text")}
  ${T(250, 70, "扇形：兩條半徑和", "s-text", "start")}${T(250, 94, "一段弧圍成的圖形", "s-text", "start")}
  ${T(250, 134, "圓心角：兩條半徑", "s-text", "start")}${T(250, 158, "在圓心夾成的角", "s-text", "start")}
  ${T(250, 198, "一整圈的圓心角 = 360°", "s-accent-text", "start")}
</svg>`;
  })();

  // ---------- 五上 6 異分母分數相加 ----------
  const fracAdd = `<svg viewBox="0 0 460 200" width="460" role="img" aria-label="1/2 + 1/3 先通分成 3/6 + 2/6">
  ${bar(100, 20, 300, 34, 6, 3)}${bar(100, 78, 300, 34, 6, 2, "s-node-chem")}
  ${R(100, 136, 150, 34, "s-node")}${R(250, 136, 100, 34, "s-node-chem")}${bar(100, 136, 300, 34, 6, 0).replace(/s-node-main/g, "s-guide")}
  ${L(250, 14, 250, 60, "s-line")}
  ${T(56, 44, "1/2 = 3/6", "s-text")}${T(56, 102, "1/3 = 2/6", "s-text")}${T(56, 160, "合起來", "s-text")}
  ${T(250, 194, "3/6 + 2/6 = 5/6", "s-accent-text")}
</svg>`;

  // ---------- 五上 7 線對稱圖形 ----------
  const symAxis = `<svg viewBox="0 0 460 220" width="460" role="img" aria-label="線對稱圖形的對稱軸與對稱點">
  ${poly([[160, 190], [300, 190], [300, 100], [230, 30], [160, 100]], "s-node")}
  ${L(230, 14, 230, 206, "s-warn-line")}${T(236, 212, "對稱軸", "s-chem-text", "start")}
  ${L(160, 100, 300, 100, "s-guide")}<path d="M230,92 L238,92 L238,100" class="s-tick"/>
  ${dot(160, 100, "s-accent-fill")}${dot(300, 100, "s-accent-fill")}${T(150, 96, "A", "s-accent-text", "end")}${T(310, 96, "A′", "s-accent-text", "start")}
  ${T(195, 118, "一樣遠", "s-small")}${T(265, 118, "一樣遠", "s-small")}
  ${T(330, 150, "沿對稱軸對摺，", "s-text", "start")}${T(330, 172, "兩邊完全重合", "s-text", "start")}
</svg>`;

  // ---------- 五上 8 分配律的面積圖 ----------
  const distribArea = `<svg viewBox="0 0 460 190" width="460" role="img" aria-label="13 × 12 = 10 × 12 + 3 × 12 的面積圖">
  ${R(40, 30, 240, 120, "s-node")}${R(280, 30, 72, 120, "s-node-chem")}
  ${T(160, 96, "10 × 12", "s-text")}${T(316, 96, "3 × 12", "s-text")}
  ${T(160, 172, "10", "s-small")}${T(316, 172, "3", "s-small")}${T(26, 96, "12", "s-small", "end")}
  ${T(196, 20, "13 × 12 = 10 × 12 + 3 × 12 = 120 + 36 = 156", "s-accent-text")}
</svg>`;

  // ---------- 五上 9 平行四邊形、三角形的面積 ----------
  const areaShapes = `<svg viewBox="0 0 460 210" width="460" role="img" aria-label="平行四邊形剪拼成長方形；兩個三角形拼成平行四邊形">
  ${poly([[30, 160], [150, 160], [190, 70], [70, 70]], "s-node")}${poly([[30, 160], [70, 160], [70, 70]], "s-node-chem")}
  ${poly([[150, 160], [190, 160], [190, 70]], "s-guide")}${L(70, 70, 70, 160, "s-warn-line")}
  ${T(90, 180, "底", "s-small")}${T(60, 120, "高", "s-small", "end")}${T(110, 30, "剪下左邊的三角形，", "s-small")}${T(110, 48, "移到右邊 → 長方形", "s-small")}
  ${poly([[260, 160], [380, 160], [320, 70]], "s-node")}${poly([[320, 70], [440, 70], [380, 160]], "s-guide")}
  ${L(320, 70, 320, 160, "s-warn-line")}${T(320, 180, "底", "s-small")}${T(314, 120, "高", "s-small", "end")}
  ${T(350, 30, "兩個一樣的三角形", "s-small")}${T(350, 48, "拼成平行四邊形", "s-small")}
  ${T(110, 204, "面積 = 底 × 高", "s-accent-text")}${T(350, 204, "三角形 = 底 × 高 ÷ 2", "s-accent-text")}
</svg>`;

  // ---------- 五上 9 梯形的面積 ----------
  // 右邊那個是左邊梯形轉半圈（繞右斜邊的中點），上底、下底剛好對調
  const trapDouble = `<svg viewBox="0 0 580 200" width="580" role="img" aria-label="兩個一樣的梯形拼成平行四邊形">
  ${poly([[40, 150], [200, 150], [160, 60], [80, 60]], "s-node")}${poly([[160, 60], [320, 60], [280, 150], [200, 150]], "s-node-chem")}
  ${L(80, 60, 80, 150, "s-warn-line")}${T(74, 110, "高", "s-small", "end")}
  ${T(120, 50, "上底", "s-small")}${T(120, 170, "下底", "s-small")}${T(240, 50, "下底", "s-small")}${T(240, 170, "上底", "s-small")}
  ${T(340, 90, "拼成平行四邊形：", "s-text", "start")}${T(340, 112, "底 = 上底 + 下底", "s-text", "start")}
  ${T(340, 150, "梯形 =", "s-accent-text", "start")}${T(340, 172, "(上底 + 下底) × 高 ÷ 2", "s-accent-text", "start")}
</svg>`;

  // ---------- 五上 10 柱體、錐體和球 ----------
  const solidsES = `<svg viewBox="0 0 470 200" width="470" role="img" aria-label="三角柱、圓柱、四角錐、圓錐和球">
  ${poly([[20, 140], [70, 140], [45, 110]], "s-node")}${poly([[20, 60], [70, 60], [45, 30]], "s-node")}${L(20, 60, 20, 140)}${L(70, 60, 70, 140)}${L(45, 30, 45, 110, "s-guide")}
  <ellipse cx="140" cy="40" rx="30" ry="10" class="s-node"/>${L(110, 40, 110, 130)}${L(170, 40, 170, 130)}<path d="M110,130 A30 10 0 0 0 170,130" class="s-line"/><path d="M110,130 A30 10 0 0 1 170,130" class="s-guide"/>
  ${poly([[210, 140], [270, 140], [290, 120], [230, 120]], "s-node")}${L(210, 140, 250, 30)}${L(270, 140, 250, 30)}${L(290, 120, 250, 30)}${L(230, 120, 250, 30, "s-guide")}
  <ellipse cx="350" cy="130" rx="32" ry="10" class="s-node"/>${L(318, 130, 350, 30)}${L(382, 130, 350, 30)}
  <circle cx="430" cy="95" r="34" class="s-node"/><ellipse cx="430" cy="95" rx="34" ry="10" class="s-guide"/>
  ${T(45, 170, "三角柱", "s-small")}${T(140, 170, "圓柱", "s-small")}${T(250, 170, "四角錐", "s-small")}${T(350, 170, "圓錐", "s-small")}${T(430, 170, "球", "s-small")}
  ${T(95, 192, "柱體：上下兩個底面一樣大", "s-tiny")}${T(300, 192, "錐體：一個底面＋一個頂點", "s-tiny")}
</svg>`;

  // ================= 看圖題（圖上不寫答案） =================
  const qParallelogram = `<svg viewBox="0 0 360 170" width="360" role="img" aria-label="平行四邊形，底 9 公分、高 4 公分、斜邊 5 公分">
  ${poly([[40, 140], [240, 140], [300, 40], [100, 40]], "s-node")}${L(100, 40, 100, 140, "s-warn-line")}<path d="M100,130 L110,130 L110,140" class="s-tick"/>
  ${T(140, 160, "9 公分", "s-text")}${T(94, 96, "4 公分", "s-text", "end")}${T(288, 96, "5 公分", "s-text", "start")}
</svg>`;
  const qTrapezoid = `<svg viewBox="0 0 360 170" width="360" role="img" aria-label="梯形，上底 5 公分、下底 11 公分、高 4 公分">
  ${poly([[40, 140], [290, 140], [210, 40], [110, 40]], "s-node")}${L(110, 40, 110, 140, "s-warn-line")}<path d="M110,130 L120,130 L120,140" class="s-tick"/>
  ${T(160, 30, "5 公分", "s-text")}${T(165, 160, "11 公分", "s-text")}${T(104, 96, "4 公分", "s-text", "end")}
</svg>`;
  // 依 50°、65°、65° 畫：A、B 在底邊，C = A 往 50° 方向走 200（AB = AC = 200）
  const qTriAngle = (() => {
    const A = [40, 180], B = [240, 180], C = pt(40, 180, 200, 50);
    return `<svg viewBox="0 0 280 210" width="280" role="img" aria-label="三角形兩個角是 50 度和 65 度，第三個角未知">
  ${poly([A, B, C], "s-node")}
  ${T(82, 170, "50°", "s-text")}${T(212, 170, "65°", "s-text")}${T(C[0], C[1] + 38, "?", "s-accent-text")}
  ${T(140, 204, "依標示的度數計算，不要用量的", "s-small")}
</svg>`;
  })();
  const qSymShapes = (() => {
    const box = (x, label, shape) => `${R(x, 10, 100, 100, "s-node-main")}${shape}${T(x + 50, 132, label, "s-text")}`;
    return `<svg viewBox="0 0 440 140" width="440" role="img" aria-label="四個圖形 A、B、C、D">
  ${box(5, "A", poly([[55, 25], [90, 95], [20, 95]], "s-node"))}
  ${box(115, "B", poly([[125, 95], [175, 95], [205, 25], [155, 25]], "s-node"))}
  ${box(225, "C", poly([90, 30, -30, -90, -150, 150].map(d => pt(275, 60, 38, d)), "s-node"))}
  ${box(335, "D", R(355, 35, 60, 50, "s-node"))}
</svg>`;
  })();
  // 簡化字形：每個字畫在 60 × 60 的格子裡，虛線是中線（x = 30）。
  // 山、田、天的左右筆畫用鏡射座標畫，沿中線對摺會完全重合；水、好故意畫成左右不同。答案不寫在圖上。
  const qGlyphs = (() => {
    const glyphs = [
      ["山", [[30, 10, 30, 50], [10, 50, 50, 50], [10, 22, 10, 50], [50, 22, 50, 50]]],
      ["水", [[30, 8, 30, 52], [30, 52, 24, 48], [12, 22, 24, 22], [24, 22, 12, 42], [48, 16, 36, 30], [36, 30, 50, 50]]],
      ["田", [[12, 12, 48, 12], [48, 12, 48, 48], [48, 48, 12, 48], [12, 48, 12, 12], [30, 12, 30, 48], [12, 30, 48, 30]]],
      ["好", [[16, 10, 10, 30], [10, 30, 24, 52], [24, 22, 8, 48], [6, 32, 26, 32], [34, 12, 50, 12], [50, 12, 42, 24], [42, 24, 42, 52], [42, 52, 37, 49], [32, 34, 54, 34]]],
      ["天", [[16, 14, 44, 14], [10, 28, 50, 28], [30, 14, 30, 28], [30, 28, 12, 52], [30, 28, 48, 52]]]
    ];
    let g = "";
    glyphs.forEach(([name, segs], i) => {
      const ox = 20 + i * 84, oy = 14;
      g += R(ox - 6, oy - 6, 72, 72, "s-node-main") + L(ox + 30, oy - 6, ox + 30, oy + 66, "s-warn-line");
      segs.forEach(s => { g += L(ox + s[0], oy + s[1], ox + s[2], oy + s[3], "s-accent-line", 'stroke-linecap="round"'); });
      g += T(ox + 30, oy + 90, "ABCDE"[i] + "　" + name, "s-text");
    });
    return `<svg viewBox="0 0 440 120" width="440" role="img" aria-label="五個用直線畫成的簡化字形，虛線是每個字的中線">${g}</svg>`;
  })();
  const qSector = (() => {
    const a = pt(120, 100, 80, 90), b = pt(120, 100, 80, 210), c = pt(120, 100, 80, 330);
    return `<svg viewBox="0 0 260 200" width="260" role="img" aria-label="圓被三條半徑平分成 3 個一樣大的扇形">
  <circle cx="120" cy="100" r="80" class="s-node-main"/>${wedge(120, 100, 80, 90, 210, "s-node")}
  ${L(120, 100, a[0], a[1])}${L(120, 100, b[0], b[1])}${L(120, 100, c[0], c[1])}${dot(120, 100, "s-accent-fill")}
  ${T(94, 110, "?", "s-accent-text")}${T(120, 196, "三個扇形一樣大", "s-small")}
</svg>`;
  })();

  window.FIG = { fig, decimalPlace, factorRects, multipleLine, equivFrac, triSides, angleSum, polySplit, sector, fracAdd, symAxis,
    distribArea, areaShapes, trapDouble, solidsES, qParallelogram, qTrapezoid, qTriAngle, qSymShapes, qSector, qGlyphs,
    // 給 figures2.js 用的小工具
    _: { r1, T, L, R, dot, poly, pt, wedge, bar } };
})();
