/*
 * 第三階段：八下、九年級圖表判讀題用的圖。擴充 window.FIG，需在 figures.js、figures2.js 之後載入。
 * 這些圖只標「甲、乙、丙」等代號與座標，不在圖上寫出答案。
 */
(function () {
  const F = window.FIG;
  const r1 = n => Math.round(n * 10) / 10;

  // 通用座標軸：x0,y0 左下角；w,h 寬高；xs/ys 刻度陣列；xl/yl 軸名
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

  // ---------- 8B-1 反應總質量與時間 ----------
  F.massTime = (() => {
    const a = axes({ x0: 60, y0: 220, w: 320, h: 170, xmin: 0, xmax: 10, ymin: 0, ymax: 10, xs: [], ys: [], xl: "時間", yl: "容器與內容物的總質量" });
    return `<svg viewBox="0 0 440 280" width="440" role="img" aria-label="反應總質量與時間的關係">${a.g}
  ${poly([[0, 8], [10, 8]], a.X, a.Y, "s-accent-line")}
  ${poly([[0, 8], [1, 7.2], [2, 6.6], [3, 6.2], [4, 6.0], [10, 6.0]], a.X, a.Y, "s-chem-line")}
  <text x="${a.X(10) + 6}" y="${a.Y(8) + 5}" class="s-accent-text">甲</text>
  <text x="${a.X(10) + 6}" y="${a.Y(6) + 5}" class="s-chem-text">乙</text>
</svg>`;
  })();

  // ---------- 8B-3 鹽酸滴入氫氧化鈉的 pH 變化 ----------
  F.titration = (() => {
    const a = axes({ x0: 60, y0: 230, w: 320, h: 196, xmin: 0, xmax: 40, ymin: 0, ymax: 14, xs: [10, 20, 30, 40], ys: [2, 4, 7, 10, 12, 14], xl: "加入鹽酸的體積（mL）", yl: "pH" });
    const f = x => 7 + 6 * Math.tanh((20 - x) / 3);
    const pts = []; for (let x = 0; x <= 40; x += 0.5) pts.push([x, f(x)]);
    const mark = (x, name) => `<circle cx="${a.X(x)}" cy="${a.Y(f(x))}" r="5" class="s-dot"/><text x="${a.X(x) + 8}" y="${a.Y(f(x)) - 8}" class="s-text">${name}</text>`;
    return `<svg viewBox="0 0 440 290" width="440" role="img" aria-label="滴定時 pH 的變化">${a.g}
  ${poly(pts, a.X, a.Y, "s-accent-line")}
  ${mark(5, "甲")}${mark(17, "乙")}${mark(20, "丙")}${mark(30, "丁")}
</svg>`;
  })();

  // ---------- 8B-4 產生氣體體積與時間 ----------
  F.gasTime = (() => {
    const a = axes({ x0: 60, y0: 220, w: 320, h: 170, xmin: 0, xmax: 6, ymin: 0, ymax: 60, xs: [1, 2, 3, 4, 5, 6], ys: [20, 40, 60], xl: "時間（分）", yl: "產生氣體的總體積（mL）" });
    const c = k => { const p = []; for (let t = 0; t <= 6; t += 0.1) p.push([t, 56 * (1 - Math.exp(-t / k))]); return p; };
    return `<svg viewBox="0 0 440 280" width="440" role="img" aria-label="產生氣體體積與時間">${a.g}
  ${poly(c(0.6), a.X, a.Y, "s-accent-line")}${poly(c(1.5), a.X, a.Y, "s-chem-line")}
  <text x="${a.X(0.9)}" y="${a.Y(50)}" class="s-accent-text">甲</text>
  <text x="${a.X(2.2)}" y="${a.Y(28)}" class="s-chem-text">乙</text>
</svg>`;
  })();

  // ---------- 8B-6 彈簧伸長量與掛重 ----------
  F.springGraph = (() => {
    const a = axes({ x0: 60, y0: 230, w: 330, h: 190, xmin: 0, xmax: 60, ymin: 0, ymax: 16, xs: [10, 20, 30, 40, 50, 60], ys: [2, 4, 6, 8, 10, 12, 14, 16], xl: "所掛物體的重量（gw）", yl: "彈簧伸長量（cm）" });
    return `<svg viewBox="0 0 440 290" width="440" role="img" aria-label="彈簧伸長量與掛重">${a.g}
  ${poly([[0, 0], [40, 8], [50, 11], [60, 15]], a.X, a.Y, "s-accent-line")}
  ${[10, 20, 30, 40, 50, 60].map(w => { const y = w <= 40 ? w / 5 : (w === 50 ? 11 : 15); return `<circle cx="${a.X(w)}" cy="${a.Y(y)}" r="4" class="s-dot"/>`; }).join("")}
</svg>`;
  })();

  // ---------- 8B-6 三種形狀容器，水深相同 ----------
  F.containers = `<svg viewBox="0 0 520 230" width="520" role="img" aria-label="三種形狀的容器">
  <rect x="42" y="70" width="116" height="110" class="s-water"/><path d="M40,40 L40,182 L160,182 L160,40" class="s-glass"/>
  <rect x="222" y="70" width="36" height="110" class="s-water"/><path d="M220,20 L220,182 L260,182 L260,20" class="s-glass"/>
  <path d="M336,182 L464,182 L489,70 L311,70 Z" class="s-water"/><path d="M300,40 L338,182 L462,182 L500,40" class="s-glass"/>
  <line x1="20" y1="70" x2="510" y2="70" class="s-guide"/>
  <text x="14" y="128" class="s-small">h</text><line x1="26" y1="72" x2="26" y2="180" class="s-tick"/>
  <circle cx="100" cy="178" r="4" class="s-dot"/><circle cx="240" cy="178" r="4" class="s-dot"/><circle cx="400" cy="178" r="4" class="s-dot"/>
  <text x="100" y="210" text-anchor="middle" class="s-text">甲</text><text x="240" y="210" text-anchor="middle" class="s-text">乙</text><text x="400" y="210" text-anchor="middle" class="s-text">丙</text>
</svg>`;

  // ---------- 9A-1 位置–時間圖 ----------
  F.xtGraph = (() => {
    const a = axes({ x0: 60, y0: 220, w: 320, h: 180, xmin: 0, xmax: 10, ymin: 0, ymax: 50, xs: [2, 4, 6, 8, 10], ys: [10, 20, 30, 40, 50], xl: "時間（s）", yl: "位置（m）" });
    return `<svg viewBox="0 0 440 280" width="440" role="img" aria-label="三個物體的位置與時間">${a.g}
  ${poly([[0, 0], [10, 50]], a.X, a.Y, "s-accent-line")}${poly([[0, 0], [10, 20]], a.X, a.Y, "s-chem-line")}${poly([[0, 30], [10, 30]], a.X, a.Y, "s-ok-line")}
  <text x="${a.X(10) + 6}" y="${a.Y(50) + 5}" class="s-accent-text">甲</text>
  <text x="${a.X(10) + 6}" y="${a.Y(20) + 5}" class="s-chem-text">乙</text>
  <text x="${a.X(10) + 6}" y="${a.Y(30) + 5}" class="s-text">丙</text>
</svg>`;
  })();

  // ---------- 9A-1 速度–時間圖 ----------
  F.vtGraph = (() => {
    const a = axes({ x0: 60, y0: 220, w: 320, h: 180, xmin: 0, xmax: 8, ymin: 0, ymax: 10, xs: [1, 2, 3, 4, 5, 6, 7, 8], ys: [2, 4, 6, 8, 10], xl: "時間（s）", yl: "速度（m/s）" });
    return `<svg viewBox="0 0 440 280" width="440" role="img" aria-label="汽車的速度與時間">${a.g}
  ${poly([[0, 0], [4, 8], [8, 8]], a.X, a.Y, "s-accent-line")}
</svg>`;
  })();

  // ---------- 9A-3 槓桿 ----------
  F.lever = `<svg viewBox="0 0 560 210" width="560" role="img" aria-label="槓桿">
  <rect x="80" y="96" width="440" height="10" rx="3" class="s-wood"/>
  <polygon points="260,106 244,150 276,150" class="s-metal"/><line x1="220" y1="150" x2="300" y2="150" class="s-line"/>
  <rect x="82" y="56" width="40" height="40" rx="4" class="s-stone"/><text x="102" y="48" text-anchor="middle" class="s-text">30 kgw</text>
  <line x1="500" y1="40" x2="500" y2="92" class="s-chem-line"/><polygon points="494,82 500,94 506,82" class="s-chem-fill"/><text x="510" y="52" class="s-chem-text">F</text>
  <line x1="102" y1="128" x2="258" y2="128" class="s-tick"/><line x1="102" y1="122" x2="102" y2="134" class="s-tick"/><line x1="258" y1="122" x2="258" y2="134" class="s-tick"/>
  <text x="180" y="124" text-anchor="middle" class="s-small">40 cm</text>
  <line x1="262" y1="174" x2="500" y2="174" class="s-tick"/><line x1="262" y1="168" x2="262" y2="180" class="s-tick"/><line x1="500" y1="168" x2="500" y2="180" class="s-tick"/>
  <text x="381" y="196" text-anchor="middle" class="s-small">60 cm</text>
  <text x="260" y="168" text-anchor="middle" class="s-small">支點</text>
</svg>`;

  // ---------- 9A-4 電壓–電流圖 ----------
  F.viGraph = (() => {
    const a = axes({ x0: 60, y0: 220, w: 320, h: 180, xmin: 0, xmax: 1, ymin: 0, ymax: 12, xs: [0.2, 0.4, 0.6, 0.8, 1.0], ys: [2, 4, 6, 8, 10, 12], xl: "電流 I（A）", yl: "電壓 V（V）" });
    return `<svg viewBox="0 0 440 280" width="440" role="img" aria-label="兩個電阻的電壓與電流">${a.g}
  ${poly([[0, 0], [1, 12]], a.X, a.Y, "s-accent-line")}${poly([[0, 0], [1, 4]], a.X, a.Y, "s-chem-line")}
  <circle cx="${a.X(0.5)}" cy="${a.Y(6)}" r="4" class="s-dot"/>
  <text x="${a.X(1) + 6}" y="${a.Y(12) + 5}" class="s-accent-text">甲</text>
  <text x="${a.X(1) + 6}" y="${a.Y(4) + 5}" class="s-chem-text">乙</text>
</svg>`;
  })();

  // ---------- 9A-4 並聯電路 ----------
  F.circuitPar = (() => {
    const res = (x, y, label) => `<rect x="${x - 10}" y="${y - 26}" width="20" height="52" rx="3" class="s-board"/><text x="${x + 18}" y="${y + 5}" class="s-text">${label}</text>`;
    return `<svg viewBox="0 0 460 250" width="460" role="img" aria-label="兩個電阻並聯的電路">
  <path d="M80,60 L80,190 M80,60 L380,60 L380,190 L80,190" class="s-wire"/>
  <path d="M230,60 L230,190" class="s-wire"/>
  <rect x="64" y="110" width="32" height="30" fill="var(--card)" stroke="none"/>
  <line x1="66" y1="118" x2="94" y2="118" class="s-line"/><line x1="72" y1="130" x2="88" y2="130" class="s-wire"/>
  <text x="60" y="122" text-anchor="end" class="s-small">+</text><text x="48" y="144" text-anchor="end" class="s-small">6 V</text>
  ${res(230, 125, "6 Ω")}
  ${res(380, 125, "3 Ω")}
  <circle cx="150" cy="190" r="16" class="s-board"/><text x="150" y="196" text-anchor="middle" class="s-text">A</text>
  <text x="150" y="226" text-anchor="middle" class="s-small">安培計（量總電流）</text>
</svg>`;
  })();
})();
