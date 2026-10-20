/*
 * 題庫擴充（2026-10-11）用的圖：資料表與統計圖。擴充 window.FIG，需在 figures3.js 之後載入。
 * 圖上只標「甲、乙、丙」與座標刻度，不寫出答案。
 */
(function () {
  const F = window.FIG;
  const r1 = n => Math.round(n * 10) / 10;

  function axes(o) {
    const X = v => r1(o.x0 + (v - o.xmin) / (o.xmax - o.xmin) * o.w);
    const Y = v => r1(o.y0 - (v - o.ymin) / (o.ymax - o.ymin) * o.h);
    let g = "";
    o.xs.forEach(v => { g += `<line x1="${X(v)}" y1="${o.y0}" x2="${X(v)}" y2="${o.y0 - o.h}" class="s-grid"/><text x="${X(v)}" y="${o.y0 + 18}" text-anchor="middle" class="s-small">${v}</text>`; });
    o.ys.forEach(v => { g += `<line x1="${o.x0}" y1="${Y(v)}" x2="${o.x0 + o.w}" y2="${Y(v)}" class="s-grid"/><text x="${o.x0 - 8}" y="${Y(v) + 4}" text-anchor="end" class="s-small">${v}</text>`; });
    g += `<line x1="${o.x0}" y1="${o.y0}" x2="${o.x0 + o.w + 10}" y2="${o.y0}" class="s-line"/><line x1="${o.x0}" y1="${o.y0}" x2="${o.x0}" y2="${o.y0 - o.h - 10}" class="s-line"/>
  <text x="${o.x0 + o.w / 2}" y="${o.y0 + 40}" text-anchor="middle" class="s-text">${o.xl}</text>
  <text x="${o.x0 + 4}" y="${o.y0 - o.h - 16}" class="s-small">${o.yl}</text>`;
    return { g, X, Y };
  }
  const poly = (pts, X, Y, cls) => `<polyline points="${pts.map(([a, b]) => X(a) + "," + Y(b)).join(" ")}" class="${cls}"/>`;
  const tag = (x, y, t, cls) => `<text x="${x}" y="${y}" class="${cls || "s-text"}">${t}</text>`;

  // 資料表：rows[0] 為表頭。字寬以中文 15px 估算。
  F.table = function (label, rows) {
    const w = s => [...String(s)].reduce((n, ch) => n + (/[\x00-\xff]/.test(ch) ? 9 : 16), 0);
    const cols = rows[0].length;
    const cw = []; for (let c = 0; c < cols; c++) cw.push(Math.max(44, ...rows.map(r => w(r[c]) + 16)));
    const H = 36, W = cw.reduce((a, b) => a + b, 0);
    let s = "", x = 0;
    const xs = cw.map(v => { const at = x; x += v; return at; });
    rows.forEach((r, i) => {
      const y = i * H;
      if (i === 0) s += `<rect x="1" y="1" width="${W - 2}" height="${H - 1}" class="s-tint" style="fill:var(--primary);fill-opacity:.12"/>`;
      r.forEach((v, c) => { s += `<text x="${xs[c] + cw[c] / 2}" y="${y + 24}" text-anchor="middle" class="s-text">${v}</text>`; });
      if (i > 0) s += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" class="s-grid"/>`;
    });
    xs.slice(1).forEach(v => { s += `<line x1="${v}" y1="0" x2="${v}" y2="${rows.length * H}" class="s-grid"/>`; });
    return `<svg viewBox="-2 -2 ${W + 4} ${rows.length * H + 4}" width="${W + 4}" role="img" aria-label="${label}">
  <rect x="0" y="0" width="${W}" height="${rows.length * H}" class="s-board"/>${s}</svg>`;
  };

  // ---------- 8A-1 三種物質的質量–體積圖 ----------
  F.mv3 = (() => {
    const a = axes({ x0: 60, y0: 230, w: 320, h: 190, xmin: 0, xmax: 20, ymin: 0, ymax: 60, xs: [5, 10, 15, 20], ys: [10, 20, 30, 40, 50, 60], xl: "體積（cm³）", yl: "質量（g）" });
    return `<svg viewBox="0 0 440 290" width="440" role="img" aria-label="三種物質的質量與體積">${a.g}
  ${poly([[0, 0], [20, 54]], a.X, a.Y, "s-accent-line")}${poly([[0, 0], [20, 20]], a.X, a.Y, "s-chem-line")}${poly([[0, 0], [20, 16]], a.X, a.Y, "s-line")}
  ${tag(a.X(20) + 6, a.Y(54) + 5, "甲", "s-accent-text")}${tag(a.X(20) + 6, a.Y(20) - 2, "乙", "s-chem-text")}${tag(a.X(20) + 6, a.Y(16) + 14, "丙")}
  <circle cx="${a.X(10)}" cy="${a.Y(27)}" r="4" class="s-dot"/><circle cx="${a.X(10)}" cy="${a.Y(10)}" r="4" class="s-dot"/><circle cx="${a.X(10)}" cy="${a.Y(8)}" r="4" class="s-dot"/>
</svg>`;
  })();

  // ---------- 8A-2 三種物質的溶解度曲線 ----------
  F.solCurve3 = (() => {
    const a = axes({ x0: 60, y0: 240, w: 320, h: 200, xmin: 0, xmax: 80, ymin: 0, ymax: 100, xs: [20, 40, 60, 80], ys: [20, 40, 60, 80, 100], xl: "溫度（°C）", yl: "溶解度（g／100 g 水）" });
    return `<svg viewBox="0 0 440 300" width="440" role="img" aria-label="甲乙丙三種物質的溶解度曲線">${a.g}
  ${poly([[0, 20], [80, 100]], a.X, a.Y, "s-accent-line")}${poly([[0, 36], [80, 40]], a.X, a.Y, "s-chem-line")}${poly([[0, 50], [80, 26]], a.X, a.Y, "s-line")}
  ${tag(a.X(80) + 6, a.Y(100) + 5, "甲", "s-accent-text")}${tag(a.X(80) + 6, a.Y(40) + 0, "乙", "s-chem-text")}${tag(a.X(80) + 6, a.Y(26) + 10, "丙")}
</svg>`;
  })();

  // ---------- 8A-3 某瞬間的繩波 ----------
  F.waveSnap = (() => {
    const a = axes({ x0: 60, y0: 220, w: 320, h: 160, xmin: 0, xmax: 4, ymin: -0.3, ymax: 0.3, xs: [1, 2, 3, 4], ys: [-0.2, 0, 0.2], xl: "與波源的距離（m）", yl: "位移（m）" });
    const pts = []; for (let x = 0; x <= 4.001; x += 0.05) pts.push([x, 0.2 * Math.sin(Math.PI * x)]);
    return `<svg viewBox="0 0 440 280" width="440" role="img" aria-label="某一瞬間繩上各點的位移">${a.g}
  ${poly(pts, a.X, a.Y, "s-accent-line")}
</svg>`;
  })();

  // ---------- 8A-5 兩物質以相同熱源加熱 ----------
  F.heat2 = (() => {
    const a = axes({ x0: 60, y0: 230, w: 320, h: 190, xmin: 0, xmax: 4, ymin: 0, ymax: 70, xs: [1, 2, 3, 4], ys: [10, 20, 30, 40, 50, 60, 70], xl: "加熱時間（分）", yl: "溫度（°C）" });
    return `<svg viewBox="0 0 440 290" width="440" role="img" aria-label="甲乙兩物質加熱時的溫度變化">${a.g}
  ${poly([[0, 20], [4, 60]], a.X, a.Y, "s-accent-line")}${poly([[0, 20], [4, 40]], a.X, a.Y, "s-chem-line")}
  ${tag(a.X(4) + 6, a.Y(60) + 5, "甲", "s-accent-text")}${tag(a.X(4) + 6, a.Y(40) + 5, "乙", "s-chem-text")}
</svg>`;
  })();

  // ---------- 8A-5 液體冷卻曲線 ----------
  F.coolCurve = (() => {
    const a = axes({ x0: 60, y0: 230, w: 320, h: 190, xmin: 0, xmax: 14, ymin: 40, ymax: 100, xs: [2, 4, 6, 8, 10, 12, 14], ys: [50, 60, 70, 80, 90, 100], xl: "時間（分）", yl: "溫度（°C）" });
    const p = (t, T, n) => `<circle cx="${a.X(t)}" cy="${a.Y(T)}" r="4" class="s-dot"/>${tag(a.X(t) - 5, a.Y(T) - 10, n)}`;
    return `<svg viewBox="0 0 440 290" width="440" role="img" aria-label="某液體冷卻時的溫度變化">${a.g}
  ${poly([[0, 96], [4, 80], [10, 80], [14, 56]], a.X, a.Y, "s-accent-line")}
  ${p(2, 88, "甲")}${p(7, 80, "乙")}${p(12, 68, "丙")}
</svg>`;
  })();

  // ---------- 8B-6 兩種液體的壓力與深度 ----------
  F.pressDepth = (() => {
    const a = axes({ x0: 60, y0: 230, w: 320, h: 190, xmin: 0, xmax: 20, ymin: 0, ymax: 24, xs: [5, 10, 15, 20], ys: [4, 8, 12, 16, 20, 24], xl: "深度（cm）", yl: "液體壓力（gw／cm²）" });
    return `<svg viewBox="0 0 440 290" width="440" role="img" aria-label="兩種液體的壓力與深度">${a.g}
  ${poly([[0, 0], [20, 24]], a.X, a.Y, "s-accent-line")}${poly([[0, 0], [20, 16]], a.X, a.Y, "s-chem-line")}
  ${tag(a.X(20) + 6, a.Y(24) + 5, "甲", "s-accent-text")}${tag(a.X(20) + 6, a.Y(16) + 5, "乙", "s-chem-text")}
</svg>`;
  })();

  // ---------- 9A-1 兩物體的位置–時間圖 ----------
  F.xt2 = (() => {
    const a = axes({ x0: 60, y0: 230, w: 320, h: 190, xmin: 0, xmax: 10, ymin: 0, ymax: 40, xs: [2, 4, 6, 8, 10], ys: [10, 20, 30, 40], xl: "時間（s）", yl: "位置（m）" });
    return `<svg viewBox="0 0 440 290" width="440" role="img" aria-label="甲乙兩物體的位置與時間">${a.g}
  ${poly([[0, 0], [10, 40]], a.X, a.Y, "s-accent-line")}${poly([[0, 20], [10, 40]], a.X, a.Y, "s-chem-line")}
  ${tag(a.X(5) + 8, a.Y(20) + 18, "甲", "s-accent-text")}${tag(a.X(2) - 4, a.Y(24) - 10, "乙", "s-chem-text")}
</svg>`;
  })();

  // ---------- 9A-1／9A-2 速度–時間圖（加速、等速、減速） ----------
  F.vt3 = (() => {
    const a = axes({ x0: 60, y0: 230, w: 320, h: 190, xmin: 0, xmax: 14, ymin: 0, ymax: 10, xs: [2, 4, 6, 8, 10, 12, 14], ys: [2, 4, 6, 8, 10], xl: "時間（s）", yl: "速度（m/s）" });
    return `<svg viewBox="0 0 440 290" width="440" role="img" aria-label="物體速度與時間，分三段">${a.g}
  ${poly([[0, 0], [4, 8], [10, 8], [14, 0]], a.X, a.Y, "s-accent-line")}
  ${tag(a.X(1.6), a.Y(6), "甲")}${tag(a.X(6.6), a.Y(8.8), "乙")}${tag(a.X(12.2), a.Y(6), "丙")}
</svg>`;
  })();
})();
