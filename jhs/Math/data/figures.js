/*
 * 國中數學課文圖解（SVG）。顏色用 style.css 的 s-* class，深色模式會自動變色。
 * curriculum.js 以 ${FIG.fig(FIG.xxx, "圖說")} 引用。這些圖會標出答案，只用在課文，不用在考題。
 */
(function () {
  function fig(svg, caption) {
    const m = svg.match(/aria-label="([^"]+)"/);
    const notes = m && window.FIG && window.FIG.NOTES ? window.FIG.NOTES[m[1]] : null;
    return `<figure class="fig"><div class="fig-scroll">${svg}</div><div class="fig-hint">← 左右滑動看完整圖，或點圖放大 →</div>${caption ? `<figcaption>${caption}</figcaption>` : ""}${notes ? `<ul class="fig-notes">${notes.map(n => `<li>${n}</li>`).join("")}</ul>` : ""}</figure>`;
  }
  const r1 = n => Math.round(n * 10) / 10;
  const mk = (id, cls) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" class="${cls}"/></marker>`;
  const defs = id => `<defs>${mk(id + "a", "s-accent-fill")}${mk(id + "c", "s-chem-fill")}${mk(id + "k", "s-tick-fill")}</defs>`;
  const T = (x, y, s, cls, anchor) => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${anchor || "middle"}" class="${cls || "s-text"}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls, extra) => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" class="${cls || "s-line"}" ${extra || ""}/>`;
  const dot = (x, y, cls) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="5" class="${cls || "s-dot"}"/>`;
  const poly = (pts, cls) => `<polygon points="${pts.map(p => r1(p[0]) + "," + r1(p[1])).join(" ")}" class="${cls}"/>`;

  // 坐標平面：回傳把數學坐標換成畫面坐標的函數與格線
  function plane(o) {
    const X = v => o.ox + v * o.u, Y = v => o.oy - v * o.u;
    let g = "";
    for (let v = o.xmin; v <= o.xmax; v++) { g += L(X(v), Y(o.ymin), X(v), Y(o.ymax), "s-grid"); }
    for (let v = o.ymin; v <= o.ymax; v++) { g += L(X(o.xmin), Y(v), X(o.xmax), Y(v), "s-grid"); }
    g += L(X(o.xmin), Y(0), X(o.xmax) + 8, Y(0), "s-line", `marker-end="url(#${o.id}k)"`) + L(X(0), Y(o.ymin), X(0), Y(o.ymax) - 8, "s-line", `marker-end="url(#${o.id}k)"`);
    g += T(X(o.xmax) + 14, Y(0) + 5, "x", "s-text", "start") + T(X(0) + 8, Y(o.ymax) - 6, "y", "s-text", "start") + T(X(0) - 4, Y(0) + 15, "O", "s-small", "end");
    if (o.labels !== false) {
      for (let v = o.xmin; v <= o.xmax; v++) if (v && v % (o.step || 1) === 0) g += T(X(v), Y(0) + 17, v, "s-small");
      for (let v = o.ymin; v <= o.ymax; v++) if (v && v % (o.step || 1) === 0) g += T(X(0) - 9, Y(v) + 5, v, "s-small", "end");
    }
    return { g, X, Y };
  }

  // ---------- 七上 1-1 數線 ----------
  const numberLine = (() => {
    const X = v => 230 + v * 40;
    let t = "";
    for (let v = -5; v <= 5; v++) t += L(X(v), 82, X(v), 92, "s-tick") + T(X(v), 112, v, v === 0 ? "s-text" : "s-small");
    return `<svg viewBox="0 0 460 150" width="460" role="img" aria-label="數線上的正數與負數">${defs("nl")}
  ${L(20, 87, 442, 87, "s-line", 'marker-end="url(#nlk)"')}${t}
  ${dot(X(-3), 87, "s-chem-fill")}${T(X(-3), 72, "A（−3）", "s-chem-text")}${dot(X(2), 87)}${T(X(2), 72, "B（2）", "s-accent-text")}
  <path d="M${X(-3)},48 L${X(-3)},40 L${X(0)},40 L${X(0)},48" class="s-guide"/>${T(X(-1.5), 34, "到原點的距離是 3：|−3| = 3", "s-small")}
  ${T(X(-3.5), 140, "← 愈往左愈小（負數）", "s-small")}${T(X(3.5), 140, "愈往右愈大（正數）→", "s-small")}
</svg>`;
  })();

  // ---------- 七上 2-1 質因數分解樹 ----------
  const factorTree = `<svg viewBox="0 0 360 230" width="360" role="img" aria-label="60 的質因數分解樹">
  ${L(180, 40, 120, 90, "s-tick")}${L(180, 40, 240, 90, "s-tick")}${L(240, 110, 200, 160, "s-tick")}${L(240, 110, 280, 160, "s-tick")}${L(280, 180, 250, 210, "s-tick")}${L(280, 180, 310, 210, "s-tick")}
  ${T(180, 32, "60", "s-big")}${T(120, 106, "2", "s-accent-text")}${T(240, 106, "30")}${T(200, 176, "2", "s-accent-text")}${T(280, 176, "15")}${T(250, 226, "3", "s-accent-text")}${T(310, 226, "5", "s-accent-text")}
  ${T(60, 180, "60 = 2² × 3 × 5", "s-accent-text")}${T(60, 202, "藍色的都是質數", "s-small")}
</svg>`;

  // ---------- 七上 3-2 天平與方程式 ----------
  const balanceEq = `<svg viewBox="0 0 460 210" width="460" role="img" aria-label="把方程式想成平衡的天平">
  ${poly([[230, 150], [212, 186], [248, 186]], "s-metal")}${L(180, 186, 280, 186, "s-line")}
  ${L(80, 80, 380, 80, "s-line")}<circle cx="230" cy="80" r="5" class="s-dot"/>${L(230, 80, 230, 150, "s-tick")}
  ${L(110, 80, 110, 104, "s-tick")}${L(350, 80, 350, 104, "s-tick")}
  <rect x="50" y="104" width="120" height="40" rx="8" class="s-node"/>${T(110, 130, "3x + 2")}
  <rect x="290" y="104" width="120" height="40" rx="8" class="s-node"/>${T(350, 130, "11")}
  ${T(230, 30, "兩邊同時減 2：3x = 9；再同時除以 3：x = 3", "s-small")}
  ${T(230, 52, "兩邊做一樣的事，天平仍然平衡", "s-accent-text")}
</svg>`;

  // ---------- 七下 2-1 直角坐標平面 ----------
  const coordPlane = (() => {
    const p = plane({ id: "cp", ox: 170, oy: 160, u: 26, xmin: -5, xmax: 5, ymin: -5, ymax: 5 });
    return `<svg viewBox="0 0 360 320" width="360" role="img" aria-label="直角坐標平面與四個象限">${defs("cp")}${p.g}
  ${T(p.X(2.6), p.Y(4.2), "第一象限 (+, +)", "s-small")}${T(p.X(-2.6), p.Y(4.2), "第二象限 (−, +)", "s-small")}
  ${T(p.X(-2.6), p.Y(-4.4), "第三象限 (−, −)", "s-small")}${T(p.X(2.6), p.Y(-4.4), "第四象限 (+, −)", "s-small")}
  ${L(p.X(3), p.Y(0), p.X(3), p.Y(2), "s-guide")}${L(p.X(0), p.Y(2), p.X(3), p.Y(2), "s-guide")}${dot(p.X(3), p.Y(2))}${T(p.X(3) + 8, p.Y(2) - 6, "P(3, 2)", "s-accent-text", "start")}
  ${L(p.X(-2), p.Y(0), p.X(-2), p.Y(-3), "s-guide")}${L(p.X(0), p.Y(-3), p.X(-2), p.Y(-3), "s-guide")}${dot(p.X(-2), p.Y(-3), "s-chem-fill")}${T(p.X(-2) - 8, p.Y(-3) + 18, "Q(−2, −3)", "s-chem-text", "end")}
</svg>`;
  })();

  // ---------- 七下 2-2 二元一次方程式的圖形與聯立方程式的解 ----------
  const twoLines = (() => {
    const p = plane({ id: "tl", ox: 120, oy: 200, u: 30, xmin: -2, xmax: 6, ymin: -2, ymax: 6 });
    return `<svg viewBox="0 -10 420 300" width="420" role="img" aria-label="兩條直線的交點就是聯立方程式的解">${defs("tl")}${p.g}
  ${L(p.X(-1), p.Y(5), p.X(5), p.Y(-1), "s-accent-line")}${T(p.X(-1) + 34, p.Y(5) + 4, "x + y = 4", "s-accent-text", "start")}
  ${L(p.X(0), p.Y(-2), p.X(4), p.Y(6), "s-chem-line")}${T(p.X(4) + 6, p.Y(6) + 14, "2x − y = 2", "s-chem-text", "start")}
  ${dot(p.X(2), p.Y(2))}${T(p.X(2) + 10, p.Y(2) + 4, "交點 (2, 2)", "s-text", "start")}
</svg>`;
  })();

  // ---------- 七下 3-2 正比與反比 ----------
  const propGraphs = (() => {
    const panel = (ox, title, pts, cls, eq) => {
      const X = v => ox + 30 + v * 22, Y = v => 200 - v * 13;
      let s = L(ox + 30, 200, ox + 200, 200, "s-line") + L(ox + 30, 200, ox + 30, 40, "s-line") + T(ox + 205, 205, "x", "s-small", "start") + T(ox + 34, 36, "y", "s-small", "start");
      s += `<polyline points="${pts.map(([a, b]) => r1(X(a)) + "," + r1(Y(b))).join(" ")}" class="${cls}"/>`;
      return s + T(ox + 115, 232, title) + T(ox + 115, 252, eq, "s-small");
    };
    const inv = []; for (let x = 1; x <= 7; x += 0.25) inv.push([x, 12 / x]);
    return `<svg viewBox="0 0 450 265" width="450" role="img" aria-label="正比與反比的圖形">
  ${panel(0, "正比：通過原點的直線", [[0, 0], [6, 12]], "s-accent-line", "y = 2x（y ÷ x 固定）")}
  ${panel(225, "反比：彎曲的曲線", inv, "s-chem-line", "y = 12 ÷ x（x × y 固定）")}
</svg>`;
  })();

  // ---------- 七下 4-2 一元一次不等式的解在數線上 ----------
  const inequalityLine = (() => {
    const row = (y, label, x0, closed, dir) => {
      const X = v => 50 + (v + 4) * 40;
      let t = L(20, y, 420, y, "s-tick");
      for (let v = -4; v <= 5; v++) t += L(X(v), y - 5, X(v), y + 5, "s-tick") + T(X(v), y + 22, v, "s-small");
      const end = dir > 0 ? 420 : 20;
      t += `<line x1="${X(x0)}" y1="${y - 14}" x2="${end}" y2="${y - 14}" class="s-accent-line"/>`;
      t += `<circle cx="${X(x0)}" cy="${y - 14}" r="6" class="${closed ? "s-dot" : "s-board"}" style="${closed ? "" : "stroke:var(--primary);stroke-width:2.5"}"/>`;
      return t + T(440, y - 10, label, "s-accent-text", "start");
    };
    return `<svg viewBox="0 0 540 170" width="540" role="img" aria-label="在數線上表示不等式的解">
  ${row(60, "x > 2", 2, false, 1)}${row(140, "x ≤ −1", -1, true, -1)}
  ${T(270, 14, "空心圈：不含這個數；實心點：含這個數", "s-small")}
</svg>`;
  })();

  // ---------- 七下 5-1 統計圖：長條圖 ----------
  const barChart = (() => {
    const data = [["籃球", 12], ["羽球", 8], ["游泳", 6], ["跑步", 4]];
    let s = L(60, 200, 400, 200, "s-line") + L(60, 200, 60, 40, "s-line");
    [0, 4, 8, 12].forEach(v => { const y = 200 - v * 12; s += L(60, y, 400, y, "s-grid") + T(52, y + 4, v, "s-small", "end"); });
    data.forEach(([n, v], i) => { const x = 90 + i * 78; s += `<rect x="${x}" y="${200 - v * 12}" width="44" height="${v * 12}" class="s-node"/>` + T(x + 22, 222, n) + T(x + 22, 194 - v * 12, v, "s-small"); });
    return `<svg viewBox="0 0 420 250" width="420" role="img" aria-label="全班最喜歡的運動長條圖">${s}${T(66, 30, "人數", "s-small", "start")}</svg>`;
  })();

  // ---------- 七下 6-1 線對稱 ----------
  const lineSym = `<svg viewBox="0 0 360 230" width="360" role="img" aria-label="線對稱圖形與對稱軸">
  ${poly([[180, 30], [270, 100], [240, 200], [120, 200], [90, 100]], "s-node")}
  ${L(180, 14, 180, 216, "s-warn-line")}${T(186, 222, "對稱軸", "s-chem-text", "start")}
  ${dot(90, 100)}${T(76, 96, "A", "s-text", "end")}${dot(270, 100)}${T(284, 96, "A′", "s-text", "start")}
  ${L(90, 100, 270, 100, "s-guide")}${T(225, 92, "對稱軸垂直平分 AA′", "s-small")}
</svg>`;

  // ---------- 七下 6-1 三視圖（依方塊位置計算） ----------
  const threeViews = (() => {
    const cubes = [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [0, 0, 1]];
    const s = 26, c = Math.cos(Math.PI / 6), n = Math.sin(Math.PI / 6), ox = 110, oy = 150;
    const P = (x, y, z) => [ox + (x - y) * s * c, oy + (x + y) * s * n - z * s];
    const face = (pts, cls) => poly(pts.map(p => P(...p)), cls);
    let iso = "";
    cubes.slice().sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]) || a[2] - b[2]).forEach(([x, y, z]) => {
      iso += face([[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], "s-node");
      iso += face([[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]], "s-board");
      iso += face([[x, y + 1, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], "s-metal");
    });
    // 從 +y 方向看（前）：水平 = −x，垂直 = z；從 +x 方向看（右）：水平 = y，垂直 = z；俯視：水平 = −x，往下 = y
    const cells = f => { const set = new Set(cubes.map(f).map(k => k.join(","))); return [...set].map(k => k.split(",").map(Number)); };
    const view = (x0, y0, list, title) => {
      const hs = list.map(k => k[0]), vs = list.map(k => k[1]), hmin = Math.min(...hs), vmax = Math.max(...vs);
      let g = ""; const u = 22;
      list.forEach(([h, v]) => { g += `<rect x="${x0 + (h - hmin) * u}" y="${y0 + (vmax - v) * u}" width="${u}" height="${u}" class="s-board" style="stroke:var(--text)"/>`; });
      return g + T(x0 + 33, y0 + 86, title, "s-small");
    };
    const front = cells(([x, y, z]) => [-x, z]), right = cells(([x, y, z]) => [y, z]), top = cells(([x, y, z]) => [-x, -y]);
    return `<svg viewBox="0 0 520 210" width="520" role="img" aria-label="積木與它的三視圖">${iso}
  ${T(60, 196, "前 ↙", "s-chem-text")}${T(190, 196, "↘ 右", "s-chem-text")}
  ${view(250, 40, front, "前視圖")}${view(350, 40, top, "俯視圖")}${view(450, 40, right, "右視圖")}
</svg>`;
  })();

  // ---------- 八上 1-1 和的平方：面積模型 ----------
  const squareArea = `<svg viewBox="0 0 400 260" width="400" role="img" aria-label="和的平方公式的面積模型">
  <rect x="60" y="30" width="140" height="140" class="s-node"/><rect x="200" y="30" width="60" height="140" class="s-node-chem"/>
  <rect x="60" y="170" width="140" height="60" class="s-node-chem"/><rect x="200" y="170" width="60" height="60" class="s-cell-noble"/>
  ${T(130, 106, "a²", "s-big")}${T(230, 106, "ab")}${T(130, 206, "ab")}${T(230, 206, "b²")}
  ${T(130, 22, "a", "s-small")}${T(230, 22, "b", "s-small")}${T(48, 104, "a", "s-small", "end")}${T(48, 204, "b", "s-small", "end")}
  ${T(272, 120, "(a + b)²", "s-accent-text", "start")}${T(272, 142, "= a² + 2ab + b²", "s-accent-text", "start")}
</svg>`;

  // ---------- 八上 2-3 畢氏定理 ----------
  const pythagoras = (() => {
    const A = [120, 180], B = [240, 180], C = [120, 90]; // 直角在 A；AB = 4，AC = 3（每單位 30）
    const sq = (p, q, cls) => { const dx = q[0] - p[0], dy = q[1] - p[1]; return poly([p, q, [q[0] - dy, q[1] + dx], [p[0] - dy, p[1] + dx]], cls); };
    return `<svg viewBox="0 -40 420 420" width="420" role="img" aria-label="畢氏定理：直角三角形三邊上的正方形">
  ${sq(A, B, "s-node")}${sq(C, A, "s-node-chem")}${sq(B, C, "s-cell-noble")}
  ${poly([A, B, C], "s-board")}<path d="M120,166 L134,166 L134,180" class="s-tick"/>
  ${T(180, 250, "a² = 16", "s-accent-text")}${T(75, 140, "b² = 9", "s-chem-text")}${T(225, 80, "c² = 25", "s-text")}
  ${T(180, 198, "a = 4", "s-small")}${T(128, 150, "b = 3", "s-small", "start")}${T(176, 160, "c = 5", "s-small", "start")}
  ${T(210, 360, "直角三角形：a² + b² = c²（16 + 9 = 25）", "s-accent-text")}
</svg>`;
  })();

  // ---------- 八上 5-1 次數分配直方圖 ----------
  const histogram = (() => {
    const bins = [["40～50", 2], ["50～60", 5], ["60～70", 9], ["70～80", 8], ["80～90", 4], ["90～100", 2]];
    let s = L(50, 200, 420, 200, "s-line") + L(50, 200, 50, 30, "s-line");
    [0, 2, 4, 6, 8, 10].forEach(v => { const y = 200 - v * 16; s += L(50, y, 420, y, "s-grid") + T(42, y + 4, v, "s-small", "end"); });
    bins.forEach(([n, v], i) => { const x = 60 + i * 58; s += `<rect x="${x}" y="${200 - v * 16}" width="58" height="${v * 16}" class="s-node" style="stroke:var(--primary)"/>` + T(x + 29, 194 - v * 16, v, "s-small"); });
    [40, 50, 60, 70, 80, 90, 100].forEach((v, i) => { s += T(60 + i * 58, 218, v, "s-small"); });
    return `<svg viewBox="0 0 440 250" width="440" role="img" aria-label="數學成績的次數分配直方圖">${s}${T(56, 22, "人數", "s-small", "start")}${T(240, 242, "成績（分），每組含左不含右", "s-small")}</svg>`;
  })();

  // ---------- 八下 1-1 等差數列 ----------
  const arithDots = (() => {
    let s = "";
    [3, 5, 7, 9].forEach((n, i) => { const x = 70 + i * 90; for (let k = 0; k < n; k++) s += dot(x + (k % 3) * 16, 150 - Math.floor(k / 3) * 16); s += T(x + 16, 186, "第 " + (i + 1) + " 項：" + n, "s-small"); });
    return `<svg viewBox="0 0 420 210" width="420" role="img" aria-label="每次多 2 個點的等差數列">${s}
  ${T(210, 40, "3, 5, 7, 9, …　每一項都比前一項多 2（公差 d = 2）", "s-accent-text")}${T(210, 62, "第 n 項 = 3 + (n − 1) × 2", "s-small")}</svg>`;
  })();

  // ---------- 八下 2-1 線型函數 ----------
  const linearFunc = (() => {
    const p = plane({ id: "lf", ox: 150, oy: 220, u: 28, xmin: -3, xmax: 5, ymin: -2, ymax: 7 });
    return `<svg viewBox="0 0 420 300" width="420" role="img" aria-label="線型函數的圖形">${defs("lf")}${p.g}
  ${L(p.X(-3), p.Y(-5), p.X(3), p.Y(7), "s-accent-line")}${T(p.X(2.6) + 10, p.Y(6.4), "y = 2x + 1", "s-accent-text", "start")}
  ${L(p.X(-2), p.Y(6), p.X(5), p.Y(-1), "s-chem-line")}${T(p.X(4.2), p.Y(1.2), "y = −x + 4", "s-chem-text", "start")}
  ${L(p.X(1), p.Y(3), p.X(2), p.Y(3), "s-guide")}${L(p.X(2), p.Y(3), p.X(2), p.Y(5), "s-guide")}${T(p.X(1.5), p.Y(3) + 16, "x 增加 1", "s-small")}${T(p.X(2) + 6, p.Y(4) + 4, "y 增加 2", "s-small", "start")}
  ${dot(p.X(0), p.Y(1))}${T(p.X(0) + 10, p.Y(1) + 16, "(0, 1)", "s-small", "start")}${dot(p.X(1), p.Y(3), "s-chem-fill")}
</svg>`;
  })();

  // ---------- 八下 3-1 三角形的外角 ----------
  const exteriorAngle = `<svg viewBox="0 0 440 240" width="440" role="img" aria-label="三角形的外角等於兩個內對角的和">
  ${poly([[60, 180], [300, 180], [200, 50]], "s-board")}${L(300, 180, 410, 180, "s-line")}
  <path d="M90,180 A30,30 0 0,0 84,160" class="s-accent-line"/><path d="M188,66 A20,20 0 0,0 214,68" class="s-chem-line"/>
  <path d="M330,180 A30,30 0 0,0 284,158" class="s-ok-line" style="stroke-width:3"/>
  ${T(60, 200, "A")}${T(300, 200, "C")}${T(200, 40, "B")}${T(104, 172, "∠A", "s-accent-text", "start")}${T(201, 92, "∠B", "s-chem-text")}${T(340, 168, "∠1（外角）", "s-text", "start")}
  ${T(220, 232, "∠1 = ∠A + ∠B；三個內角和 ∠A + ∠B + ∠C = 180°", "s-small")}
</svg>`;

  // ---------- 八下 4-1 平行線的截角 ----------
  const parallelAngles = (() => {
    const lab = (x, y, n) => T(x, y, n, "s-small");
    return `<svg viewBox="0 0 420 270" width="420" role="img" aria-label="兩平行線被一條直線所截">
  ${L(30, 70, 390, 70, "s-accent-line")}${L(30, 170, 390, 170, "s-accent-line")}${L(150, 20, 270, 220, "s-chem-line")}
  ${T(396, 74, "L₁", "s-accent-text", "start")}${T(396, 174, "L₂", "s-accent-text", "start")}
  ${lab(164, 62, "1")}${lab(196, 62, "2")}${lab(164, 88, "3")}${lab(200, 88, "4")}
  ${lab(224, 162, "5")}${lab(256, 162, "6")}${lab(224, 188, "7")}${lab(260, 188, "8")}
  ${T(210, 238, "L₁ ∥ L₂：同位角相等（∠1 = ∠5）、內錯角相等（∠4 = ∠5）", "s-small")}${T(210, 260, "同側內角互補（∠3 + ∠5 = 180°）", "s-small")}
</svg>`;
  })();

  // ---------- 八下 4-3 四邊形的關係 ----------
  const quadFamily = (() => {
    const box = (x, y, w, t) => `<rect x="${x}" y="${y}" width="${w}" height="34" rx="8" class="s-node"/>${T(x + w / 2, y + 23, t)}`;
    const ar = (x1, y1, x2, y2) => L(x1, y1, x2, y2, "s-arrow", 'marker-end="url(#qfa)"');
    return `<svg viewBox="0 0 470 250" width="470" role="img" aria-label="四邊形之間的關係">${defs("qf")}
  ${box(170, 10, 130, "四邊形")}${box(60, 80, 140, "平行四邊形")}${box(290, 80, 110, "梯形")}
  ${box(10, 160, 110, "長方形")}${box(150, 160, 100, "菱形")}${box(80, 210, 110, "正方形")}
  ${ar(220, 44, 150, 78)}${ar(250, 44, 330, 78)}${ar(110, 114, 70, 158)}${ar(150, 114, 190, 158)}${ar(70, 194, 110, 208)}${ar(200, 194, 160, 208)}
  ${T(345, 132, "只有一組對邊平行", "s-small")}${T(320, 186, "箭頭下方是上方的「特例」", "s-small")}${T(320, 206, "正方形既是長方形也是菱形", "s-small")}
</svg>`;
  })();

  // ---------- 九上 1-2 平行線截比例線段 ----------
  const similarTri = `<svg viewBox="0 -8 420 248" width="420" role="img" aria-label="平行線截比例線段">
  ${poly([[200, 20], [60, 210], [360, 210]], "s-board")}${L(130, 115, 280, 115, "s-chem-line")}
  ${T(200, 14, "A")}${T(48, 216, "B", "s-text", "end")}${T(372, 216, "C", "s-text", "start")}${T(122, 116, "D", "s-text", "end")}${T(288, 116, "E", "s-text", "start")}
  ${T(205, 106, "DE ∥ BC", "s-chem-text")}
  ${T(210, 236, "AD : DB = AE : EC，而且 △ADE ∼ △ABC", "s-small")}
</svg>`;

  // ---------- 九上 2-2 圓心角與圓周角 ----------
  const circleAngles = (() => {
    const cx = 170, cy = 130, r = 100, pt = d => [cx + r * Math.cos(d * Math.PI / 180), cy - r * Math.sin(d * Math.PI / 180)];
    const A = pt(210), B = pt(330), C = pt(100);
    return `<svg viewBox="0 0 470 260" width="470" role="img" aria-label="同弧所對的圓周角是圓心角的一半">
  <circle cx="${cx}" cy="${cy}" r="${r}" class="s-orbit" style="stroke-dasharray:none;stroke:var(--text)"/>
  ${poly([A, [cx, cy], B], "s-node")}${L(A[0], A[1], C[0], C[1], "s-chem-line")}${L(B[0], B[1], C[0], C[1], "s-chem-line")}
  ${dot(cx, cy)}${T(cx + 10, cy + 4, "O", "s-text", "start")}${T(A[0] - 8, A[1] + 14, "A", "s-text", "end")}${T(B[0] + 8, B[1] + 14, "B", "s-text", "start")}${T(C[0], C[1] - 10, "C")}
  ${T(cx, cy + 36, "∠AOB", "s-accent-text")}${T(C[0], C[1] + 30, "∠ACB", "s-chem-text")}
  ${T(290, 110, "圓心角 ∠AOB = 弧 AB 的度數", "s-small", "start")}${T(290, 134, "圓周角 ∠ACB = ½ ∠AOB", "s-chem-text", "start")}
</svg>`;
  })();

  // ---------- 九上 3-2 三角形的外心、內心、重心（計算真正的位置） ----------
  const triCenters = (() => {
    const tri = [[30, 190], [190, 190], [70, 50]];
    const panel = (dx, kind) => {
      const [A, B, C] = tri.map(p => [p[0] + dx, p[1]]);
      let s = poly([A, B, C], "s-board");
      const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
      if (kind === "外心") {
        const d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]));
        const sq = p => p[0] * p[0] + p[1] * p[1];
        const O = [(sq(A) * (B[1] - C[1]) + sq(B) * (C[1] - A[1]) + sq(C) * (A[1] - B[1])) / d, (sq(A) * (C[0] - B[0]) + sq(B) * (A[0] - C[0]) + sq(C) * (B[0] - A[0])) / d];
        s += `<circle cx="${r1(O[0])}" cy="${r1(O[1])}" r="${r1(dist(O, A))}" class="s-guide"/>`;
        [[A, B], [B, C], [C, A]].forEach(([p, q]) => { const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; s += L(m[0], m[1], O[0], O[1], "s-chem-line", 'style="stroke-width:1.6"'); });
        s += dot(O[0], O[1], "s-chem-fill") + T(dx + 110, 250, "外心：三邊中垂線的交點", "s-small") + T(dx + 110, 268, "到三個頂點等距（外接圓）", "s-small");
      } else if (kind === "內心") {
        const a = dist(B, C), b = dist(C, A), c = dist(A, B), p = a + b + c;
        const I = [(a * A[0] + b * B[0] + c * C[0]) / p, (a * A[1] + b * B[1] + c * C[1]) / p];
        const area = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2, rr = 2 * area / p;
        s += `<circle cx="${r1(I[0])}" cy="${r1(I[1])}" r="${r1(rr)}" class="s-guide"/>`;
        [A, B, C].forEach(v => { s += L(v[0], v[1], I[0], I[1], "s-chem-line", 'style="stroke-width:1.6"'); });
        s += dot(I[0], I[1], "s-chem-fill") + T(dx + 110, 250, "內心：三內角平分線的交點", "s-small") + T(dx + 110, 268, "到三邊等距（內切圓）", "s-small");
      } else {
        const G = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
        [[A, B, C], [B, C, A], [C, A, B]].forEach(([v, p, q]) => { s += L(v[0], v[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2, "s-chem-line", 'style="stroke-width:1.6"'); });
        s += dot(G[0], G[1], "s-chem-fill") + T(dx + 110, 250, "重心：三中線的交點", "s-small") + T(dx + 110, 268, "把每條中線分成 2 : 1", "s-small");
      }
      return s + T(dx + 110, 26, kind, "s-accent-text");
    };
    return `<svg viewBox="0 0 680 280" width="680" role="img" aria-label="三角形的外心、內心與重心">${panel(0, "外心")}${panel(230, "內心")}${panel(460, "重心")}</svg>`;
  })();

  // ---------- 九下 1-1 二次函數的圖形 ----------
  const parabola = (() => {
    const p = plane({ id: "pb", ox: 130, oy: 230, u: 26, xmin: -3, xmax: 6, ymin: -1, ymax: 8 });
    const curve = f => { const pts = []; for (let x = -3; x <= 6.001; x += 0.1) { const y = f(x); if (y <= 8.2 && y >= -1) pts.push(r1(p.X(x)) + "," + r1(p.Y(y))); } return pts.join(" "); };
    // 說明文字放在格線右邊，避免壓到曲線和刻度數字
    const lx = 330;
    return `<svg viewBox="0 0 540 300" width="540" role="img" aria-label="二次函數的圖形與頂點">${defs("pb")}${p.g}
  <polyline points="${curve(x => x * x)}" class="s-accent-line"/><polyline points="${curve(x => (x - 2) * (x - 2) + 1)}" class="s-chem-line"/>
  ${L(p.X(2), p.Y(-1), p.X(2), p.Y(8), "s-guide")}${dot(p.X(0), p.Y(0))}${dot(p.X(2), p.Y(1), "s-chem-fill")}
  ${L(lx, p.Y(7), lx + 24, p.Y(7), "s-accent-line")}${T(lx + 32, p.Y(7) + 5, "y = x²", "s-accent-text", "start")}
  ${L(lx, p.Y(6), lx + 24, p.Y(6), "s-chem-line")}${T(lx + 32, p.Y(6) + 5, "y = (x − 2)² + 1", "s-chem-text", "start")}
  ${L(lx, p.Y(5), lx + 24, p.Y(5), "s-guide")}${T(lx + 32, p.Y(5) + 5, "對稱軸 x = 2", "s-small", "start")}
  ${dot(lx + 12, p.Y(4), "s-chem-fill")}${T(lx + 32, p.Y(4) + 5, "頂點 (2, 1)：最小值 1", "s-small", "start")}
  ${T(lx, p.Y(2.6), "向右移 2、向上移 1，", "s-small", "start")}${T(lx, p.Y(2.6) + 20, "形狀（開口大小）不變", "s-small", "start")}
</svg>`;
  })();

  // ---------- 九下 2-1 盒狀圖 ----------
  const boxPlot = (() => {
    const X = v => 40 + v * 26;
    let t = L(X(0), 150, X(15), 150, "s-line");
    for (let v = 0; v <= 15; v++) t += L(X(v), 145, X(v), 155, "s-tick") + (v % 2 === 0 ? T(X(v), 172, v, "s-small") : "");
    const [mn, q1, md, q3, mx] = [2, 5, 7.5, 11, 14];
    t += L(X(mn), 90, X(q1), 90, "s-line") + L(X(q3), 90, X(mx), 90, "s-line") + L(X(mn), 78, X(mn), 102, "s-line") + L(X(mx), 78, X(mx), 102, "s-line");
    t += `<rect x="${X(q1)}" y="70" width="${X(q3) - X(q1)}" height="40" class="s-node"/>` + L(X(md), 70, X(md), 110, "s-chem-line");
    [[mn, "最小值 2"], [q1, "Q₁ = 5"], [md, "中位數 7.5"], [q3, "Q₃ = 11"], [mx, "最大值 14"]].forEach(([v, s], i) => { t += T(X(v), i % 2 ? 128 : 60, s, i === 2 ? "s-chem-text" : "s-small"); });
    return `<svg viewBox="0 0 460 210" width="460" role="img" aria-label="盒狀圖與四分位數">${t}
  ${T(230, 22, "資料：2, 4, 5, 6, 7, 8, 9, 11, 12, 14", "s-small")}${T(230, 200, "四分位距 IQR = Q₃ − Q₁ = 6", "s-accent-text")}</svg>`;
  })();

  // ---------- 九下 2-2 樹狀圖：擲兩枚硬幣 ----------
  const coinTree = `<svg viewBox="0 0 420 220" width="420" role="img" aria-label="擲兩枚硬幣的樹狀圖">
  ${L(60, 110, 160, 60, "s-tick")}${L(60, 110, 160, 160, "s-tick")}${L(180, 60, 280, 35, "s-tick")}${L(180, 60, 280, 85, "s-tick")}${L(180, 160, 280, 135, "s-tick")}${L(180, 160, 280, 185, "s-tick")}
  ${dot(60, 110)}${T(170, 65, "正")}${T(170, 165, "反")}${T(292, 40, "正 → 正正", "s-text", "start")}${T(292, 90, "反 → 正反", "s-text", "start")}${T(292, 140, "正 → 反正", "s-text", "start")}${T(292, 190, "反 → 反反", "s-text", "start")}
  ${T(110, 30, "第 1 枚", "s-small")}${T(230, 20, "第 2 枚", "s-small")}${T(210, 210, "共 4 種一樣可能的結果；一正一反的機率 = 2/4 = 1/2", "s-small")}
</svg>`;

  // ---------- 九下 3-1 正方體展開圖與柱體、錐體 ----------
  const solids = (() => {
    const u = 30; let net = "";
    [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]].forEach(([c, r]) => { net += `<rect x="${20 + c * u}" y="${30 + r * u}" width="${u}" height="${u}" class="s-node" style="stroke:var(--primary)"/>`; });
    const prism = `${poly([[210, 140], [270, 140], [240, 110]], "s-node")}${poly([[250, 70], [310, 70], [280, 40]], "s-board")}${L(210, 140, 250, 70)}${L(270, 140, 310, 70)}${L(240, 110, 280, 40, "s-guide")}`;
    const pyramid = `${poly([[350, 140], [430, 140], [455, 115], [375, 115]], "s-node")}${L(350, 140, 400, 40)}${L(430, 140, 400, 40)}${L(455, 115, 400, 40)}${L(375, 115, 400, 40, "s-guide")}`;
    return `<svg viewBox="0 0 480 190" width="480" role="img" aria-label="正方體展開圖、三角柱與四角錐">
  ${net}${prism}${pyramid}
  ${T(80, 168, "正方體的展開圖", "s-small")}${T(260, 168, "三角柱：兩底面全等", "s-small")}${T(405, 168, "四角錐：一個底面", "s-small")}
</svg>`;
  })();

  // ---------- 九上 1-4 特殊直角三角形（三角比） ----------
  const specialTri = `<svg viewBox="0 0 460 230" width="460" role="img" aria-label="30-60-90 與 45-45-90 直角三角形的邊長比">
  ${poly([[40, 190], [161, 190], [40, 120]], "s-node")}<path d="M40,178 L52,178 L52,190" class="s-tick"/>
  ${T(28, 160, "1", "s-accent-text", "end")}${T(100, 214, "√3", "s-accent-text")}${T(112, 146, "2", "s-accent-text", "start")}
  ${T(128, 184, "30°", "s-small")}${T(54, 140, "60°", "s-small", "start")}
  ${T(100, 52, "30°-60°-90°", "s-text")}${T(100, 74, "1 : √3 : 2", "s-small")}
  ${poly([[270, 190], [370, 190], [270, 90]], "s-node")}<path d="M270,178 L282,178 L282,190" class="s-tick"/>
  ${T(258, 145, "1", "s-accent-text", "end")}${T(320, 214, "1", "s-accent-text")}${T(328, 132, "√2", "s-accent-text", "start")}
  ${T(342, 184, "45°", "s-small")}${T(276, 118, "45°", "s-small", "start")}
  ${T(330, 52, "45°-45°-90°", "s-text")}${T(330, 74, "1 : 1 : √2", "s-small")}
</svg>`;

  window.FIG = { fig, plane, specialTri, numberLine, factorTree, balanceEq, coordPlane, twoLines, propGraphs, inequalityLine, barChart, lineSym, threeViews,
    squareArea, pythagoras, histogram, arithDots, linearFunc, exteriorAngle, parallelAngles, quadFamily, similarTri, circleAngles, triCenters,
    parabola, boxPlot, coinTree, solids };
})();
