/*
 * 課文圖解（2026-10-12）第二部分：八下第 6 章、九上、九下的物理圖。擴充 window.FIG，需在 figures5.js 之後載入。
 * 只用在課文，不用在考題。
 */
(function () {
  const F = window.FIG;
  const mk = (id, cls) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" class="${cls}"/></marker>`;
  const defs = id => `<defs>${mk(id + "a", "s-accent-fill")}${mk(id + "c", "s-chem-fill")}</defs>`;
  const arr = (id, x1, y1, x2, y2, chem) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${chem ? "s-chem-arrow" : "s-arrow"}" marker-end="url(#${id}${chem ? "c" : "a"})"/>`;
  const T = (x, y, s, cls, anchor) => `<text x="${x}" y="${y}" text-anchor="${anchor || "middle"}" class="${cls || "s-text"}">${s}</text>`;
  const bulb = (x, y) => `<circle cx="${x}" cy="${y}" r="13" class="s-board"/><path d="M${x - 7},${y - 7} L${x + 7},${y + 7} M${x - 7},${y + 7} L${x + 7},${y - 7}" class="s-tick"/>`;
  const meter = (x, y, l) => `<circle cx="${x}" cy="${y}" r="15" class="s-board"/>${T(x, y + 5, l)}`;
  // 電池（水平導線上），短板（−）在左、長板（+）在右
  const cellH = (x, y) => `<line x1="${x - 5}" y1="${y - 8}" x2="${x - 5}" y2="${y + 8}" class="s-line"/><line x1="${x + 5}" y1="${y - 14}" x2="${x + 5}" y2="${y + 14}" class="s-line"/>`;
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

  // ---------- 八下 6-1 力的三要素 ----------
  F.forceElements = `<svg viewBox="0 0 440 190" width="440" role="img" aria-label="力的三要素">${defs("fe")}
  <line x1="40" y1="140" x2="400" y2="140" class="s-line"/><rect x="150" y="80" width="100" height="60" class="s-wood"/>
  <circle cx="250" cy="110" r="5" class="s-dot"/>${arr("fe", 250, 110, 360, 110)}
  ${T(305, 66, "大小：箭頭愈長，力愈大", "s-small")}<line x1="305" y1="72" x2="305" y2="104" class="s-guide"/>${T(380, 115, "方向", "s-accent-text", "start")}${T(250, 168, "作用點：力施在物體的哪裡", "s-small")}
  <line x1="250" y1="116" x2="250" y2="150" class="s-guide"/>
</svg>`;

  // ---------- 八下 6-2 摩擦力與外力 ----------
  F.frictionGraph = `<svg viewBox="0 0 450 270" width="450" role="img" aria-label="摩擦力隨外力變化">
  <line x1="60" y1="220" x2="420" y2="220" class="s-line"/><line x1="60" y1="220" x2="60" y2="36" class="s-line"/>
  ${T(240, 258, "施加的水平外力（愈往右愈大）")}${T(66, 28, "摩擦力", "s-small", "start")}
  <polyline points="60,220 240,80" class="s-accent-line"/><line x1="240" y1="80" x2="240" y2="112" class="s-guide"/><polyline points="240,112 410,112" class="s-chem-line"/>
  <circle cx="240" cy="80" r="5" class="s-dot"/>${T(246, 70, "最大靜摩擦力", "s-accent-text", "start")}
  ${T(122, 140, "靜摩擦力 = 外力", "s-accent-text", "start")}${T(325, 104, "動摩擦力", "s-chem-text")}
  <line x1="240" y1="220" x2="240" y2="228" class="s-tick"/>${T(150, 238, "木塊不動", "s-small")}${T(330, 238, "木塊滑動", "s-small")}
</svg>`;

  // ---------- 八下 6-3 液體壓力與深度 ----------
  F.waterJets = `<svg viewBox="0 0 380 262" width="380" role="img" aria-label="水深愈深壓力愈大">
  <path d="M60,30 L60,215 L140,215 L140,30" class="s-glass"/><rect x="62" y="44" width="76" height="169" class="s-water"/>
  <path d="M140,80 Q170,82 180,124" class="s-accent-line"/><path d="M140,130 Q185,132 200,176" class="s-accent-line"/><path d="M140,180 Q200,182 218,226" class="s-accent-line"/>
  <circle cx="140" cy="80" r="3" class="s-dot"/><circle cx="140" cy="130" r="3" class="s-dot"/><circle cx="140" cy="180" r="3" class="s-dot"/>
  ${T(240, 84, "淺：噴得慢", "s-small", "start")}${T(240, 134, "較深", "s-small", "start")}${T(240, 184, "深：噴得最急", "s-small", "start")}
  ${T(190, 254, "愈深的孔，水的壓力愈大", "s-accent-text")}
</svg>`;

  // ---------- 八下 6-3 液壓機（帕斯卡原理） ----------
  F.hydraulic = `<svg viewBox="0 0 440 215" width="440" role="img" aria-label="液壓機">${defs("hy")}
  <path d="M60,80 L90,80 L90,150 L210,150 L210,100 L330,100 L330,180 L60,180 Z" class="s-water"/>
  <path d="M60,60 L60,180 L330,180 L330,70 M90,60 L90,150 L210,150 L210,70" class="s-glass"/>
  <rect x="58" y="72" width="34" height="9" class="s-metal"/><rect x="208" y="92" width="124" height="9" class="s-metal"/>
  <rect x="235" y="52" width="70" height="40" class="s-wood"/>${T(270, 77, "重物")}
  ${arr("hy", 75, 24, 75, 68, true)}${T(100, 36, "小力 F₁", "s-chem-text", "start")}
  ${T(75, 202, "小面積 A₁", "s-small")}${T(270, 202, "大面積 A₂：舉起大力 F₂", "s-small")}
  ${T(330, 36, "F₁ ÷ A₁ = F₂ ÷ A₂", "s-accent-text")}
</svg>`;

  // ---------- 八下 6-4 托里切利實驗 ----------
  F.torricelli = `<svg viewBox="0 0 380 265" width="380" role="img" aria-label="托里切利實驗">${defs("tr")}
  <path d="M60,212 L60,242 L300,242 L300,212" class="s-glass"/><rect x="62" y="222" width="236" height="18" class="s-mercury"/>
  <path d="M165,30 L165,236 M195,30 L195,236 M165,30 L195,30" class="s-glass"/><rect x="167" y="80" width="26" height="156" class="s-mercury"/>
  <line x1="200" y1="52" x2="236" y2="44" class="s-guide"/>${T(240, 48, "真空", "s-text", "start")}
  <line x1="214" y1="80" x2="214" y2="222" class="s-arrow" marker-start="url(#tra)" marker-end="url(#tra)"/>${T(222, 156, "約 76 cm", "s-accent-text", "start")}
  ${arr("tr", 90, 180, 90, 218, true)}${arr("tr", 125, 180, 125, 218, true)}${arr("tr", 245, 180, 245, 218, true)}${arr("tr", 280, 180, 280, 218, true)}
  ${T(108, 170, "大氣壓力", "s-chem-text")}${T(190, 260, "大氣壓住水銀槽的液面，把管中的水銀撐在約 76 cm 高", "s-small")}
</svg>`;

  // ---------- 八下 6-4 浮力的來源 ----------
  F.buoyancy = `<svg viewBox="0 0 480 245" width="480" role="img" aria-label="浮力的來源">${defs("by")}
  <path d="M40,40 L40,220 L300,220 L300,40" class="s-glass"/><rect x="42" y="60" width="256" height="158" class="s-water"/>
  <rect x="130" y="100" width="80" height="60" class="s-stone"/>
  ${arr("by", 170, 74, 170, 98, true)}${arr("by", 170, 208, 170, 162, true)}${arr("by", 102, 130, 128, 130, true)}${arr("by", 238, 130, 212, 130, true)}
  ${T(312, 90, "上表面：較淺，壓力小", "s-small", "start")}${T(312, 186, "下表面：較深，壓力大", "s-small", "start")}${T(312, 134, "左右：互相抵消", "s-small", "start")}
  ${T(240, 240, "上下的壓力差 → 向上的浮力", "s-accent-text")}
</svg>`;

  // ---------- 九上 1-1 路徑長與位移 ----------
  F.pathDisp = (() => {
    const X = m => 60 + m * 10;
    let ticks = ""; [0, 10, 20, 30].forEach(m => { ticks += `<line x1="${X(m)}" y1="140" x2="${X(m)}" y2="148" class="s-tick"/>${T(X(m), 166, m + " m", "s-small")}`; });
    return `<svg viewBox="0 0 430 180" width="430" role="img" aria-label="路徑長與位移">${defs("pd")}
  <line x1="40" y1="144" x2="400" y2="144" class="s-line"/>${ticks}${T(405, 148, "東", "s-small", "start")}
  ${arr("pd", X(0), 50, X(30), 50)}${T(X(15), 40, "① 向東走 30 m", "s-small")}
  ${arr("pd", X(30), 76, X(20), 76)}${T(X(25) + 40, 92, "② 向西走 10 m", "s-small")}
  ${arr("pd", X(0), 118, X(20), 118, true)}${T(X(10), 110, "位移：向東 20 m", "s-chem-text")}
  <circle cx="${X(0)}" cy="144" r="5" class="s-dot"/>${T(X(0), 132, "起點", "s-small")}
</svg>`;
  })();

  // ---------- 九上 1-2 位置–時間圖的意義 ----------
  F.xtMeaning = (() => {
    const a = axes({ x0: 60, y0: 220, w: 300, h: 170, xmin: 0, xmax: 10, ymin: 0, ymax: 10, xs: [], ys: [], xl: "時間", yl: "位置" });
    return `<svg viewBox="0 0 510 270" width="510" role="img" aria-label="位置–時間圖的斜率代表速度">${a.g}
  <polyline points="${a.X(0)},${a.Y(0)} ${a.X(7)},${a.Y(10)}" class="s-accent-line"/>
  <polyline points="${a.X(0)},${a.Y(0)} ${a.X(10)},${a.Y(4)}" class="s-chem-line"/>
  <polyline points="${a.X(0)},${a.Y(6)} ${a.X(10)},${a.Y(6)}" class="s-ok-line"/>
  ${T(a.X(7) + 8, a.Y(10) + 6, "甲：線陡，速率大", "s-accent-text", "start")}
  ${T(a.X(10) + 6, a.Y(4) + 5, "乙：線緩，速率小", "s-chem-text", "start")}
  ${T(a.X(10) + 6, a.Y(6) + 5, "丙：水平，靜止", "s-text", "start")}
</svg>`;
  })();

  // ---------- 九上 1-3 v–t 圖：斜率與面積 ----------
  F.vtMeaning = (() => {
    const a = axes({ x0: 60, y0: 220, w: 300, h: 170, xmin: 0, xmax: 5, ymin: 0, ymax: 20, xs: [1, 2, 3, 4, 5], ys: [5, 10, 15, 20], xl: "時間（s）", yl: "速度（m/s）" });
    return `<svg viewBox="0 0 470 270" width="470" role="img" aria-label="速度–時間圖的斜率與面積">${a.g}
  <polygon points="${a.X(0)},${a.Y(0)} ${a.X(5)},${a.Y(20)} ${a.X(5)},${a.Y(0)}" class="s-shade"/>
  <polyline points="${a.X(0)},${a.Y(0)} ${a.X(5)},${a.Y(20)}" class="s-accent-line"/>
  ${T(a.X(1.6), a.Y(13), "斜率 = 加速度", "s-accent-text", "end")}${T(a.X(1.6), a.Y(11), "20 ÷ 5 = 4 m/s²", "s-small", "end")}
  ${T(a.X(3.6), a.Y(3.5), "面積 = 位移", "s-accent-text")}${T(a.X(3.6), a.Y(1.4), "20 × 5 ÷ 2 = 50 m", "s-small")}
</svg>`;
  })();

  // ---------- 九上 2-1 公車急煞 ----------
  F.inertiaBus = `<svg viewBox="0 0 450 215" width="450" role="img" aria-label="公車急煞時乘客往前傾">${defs("ib")}
  <rect x="40" y="60" width="340" height="110" rx="16" class="s-board"/><circle cx="110" cy="176" r="18" class="s-metal"/><circle cx="310" cy="176" r="18" class="s-metal"/>
  <line x1="120" y1="80" x2="300" y2="80" class="s-tick"/>
  <circle cx="236" cy="96" r="10" class="s-node-main"/><line x1="232" y1="106" x2="212" y2="150" class="s-line"/><line x1="230" y1="114" x2="246" y2="82" class="s-line"/><line x1="212" y1="150" x2="200" y2="168" class="s-line"/><line x1="212" y1="150" x2="222" y2="168" class="s-line"/>
  ${arr("ib", 252, 104, 300, 104, true)}${T(306, 108, "身體繼續往前", "s-chem-text", "start")}
  ${arr("ib", 60, 36, 130, 36)}${T(140, 40, "公車行進中突然煞車", "s-small", "start")}
  ${T(210, 208, "車子停了，乘客的身體因為慣性仍要往前，所以往前傾", "s-small")}
</svg>`;

  // ---------- 九上 2-2 合力 ----------
  F.netForce = `<svg viewBox="0 0 440 175" width="440" role="img" aria-label="兩個力的合力">${defs("nf")}
  <line x1="60" y1="120" x2="400" y2="120" class="s-line"/><rect x="170" y="62" width="100" height="58" class="s-wood"/>${T(220, 97, "3 kg")}
  ${arr("nf", 270, 90, 370, 90)}${T(320, 80, "10 N")}${arr("nf", 170, 90, 130, 90, true)}${T(150, 80, "4 N", "s-chem-text")}
  ${T(220, 150, "合力 = 10 − 4 = 6 N（向右）", "s-accent-text")}${T(220, 170, "a = 6 ÷ 3 = 2 m/s²（向右）", "s-small")}
</svg>`;

  // ---------- 九上 2-3 平衡力與作用反作用 ----------
  F.actionPairs = `<svg viewBox="0 0 520 280" width="520" role="img" aria-label="平衡力與作用力反作用力的比較">${defs("ap")}
  <rect x="60" y="100" width="110" height="30" class="s-wood"/>${T(115, 121, "書")}
  ${arr("ap", 115, 100, 115, 42)}${T(125, 50, "桌子撐書", "s-accent-text", "start")}
  ${arr("ap", 115, 130, 115, 188, true)}${T(125, 186, "書的重量", "s-chem-text", "start")}
  ${T(115, 248, "① 一對平衡力", "s-text")}${T(115, 268, "兩個力都作用在書上", "s-small")}
  <rect x="270" y="130" width="210" height="12" class="s-board"/><line x1="290" y1="142" x2="290" y2="196" class="s-line"/><line x1="460" y1="142" x2="460" y2="196" class="s-line"/>
  <rect x="320" y="100" width="110" height="30" class="s-wood"/>${T(375, 121, "書")}
  ${arr("ap", 345, 128, 345, 66)}${T(340, 58, "桌子撐書（作用在書）", "s-accent-text", "middle")}
  ${arr("ap", 405, 134, 405, 194, true)}${T(405, 214, "書壓桌子（作用在桌子）", "s-chem-text")}
  ${T(375, 248, "② 作用力與反作用力", "s-text")}${T(375, 268, "分別作用在書和桌子上", "s-small")}
</svg>`;

  // ---------- 九上 2-4 圓周運動 ----------
  F.circularMotion = `<svg viewBox="0 0 450 300" width="450" role="img" aria-label="圓周運動的速度與向心力">${defs("cm")}
  <circle cx="170" cy="160" r="100" class="s-orbit"/><circle cx="170" cy="160" r="4" class="s-dot"/>${T(170, 182, "圓心", "s-small")}
  <line x1="170" y1="160" x2="270" y2="160" class="s-tick"/><circle cx="270" cy="160" r="11" class="s-metal"/>
  ${arr("cm", 270, 148, 270, 70)}<line x1="270" y1="70" x2="270" y2="22" class="s-guide"/>
  ${arr("cm", 258, 160, 206, 160, true)}
  ${T(282, 100, "速度：沿切線方向", "s-accent-text", "start")}${T(282, 40, "繩斷後沿虛線飛出", "s-small", "start")}
  ${T(232, 150, "向心力", "s-chem-text")}${T(232, 196, "指向圓心", "s-small")}
</svg>`;

  // ---------- 九上 3-1 作功與不作功 ----------
  F.workCases = `<svg viewBox="0 0 530 200" width="530" role="img" aria-label="作功與不作功的情形">${defs("wc")}
  <line x1="10" y1="120" x2="160" y2="120" class="s-line"/><rect x="60" y="80" width="46" height="40" class="s-wood"/>
  ${arr("wc", 20, 100, 58, 100)}${T(30, 90, "力", "s-accent-text")}${arr("wc", 60, 140, 140, 140, true)}${T(100, 158, "移動", "s-chem-text")}
  ${T(85, 186, "有作功：W = F × S", "s-text")}
  <line x1="190" y1="120" x2="330" y2="120" class="s-line"/><rect x="300" y="44" width="16" height="76" class="s-stone"/>
  ${arr("wc", 220, 100, 298, 100)}${T(250, 90, "推力", "s-accent-text")}${T(255, 150, "牆沒有移動", "s-small")}
  ${T(260, 186, "不作功", "s-text")}
  <line x1="360" y1="150" x2="520" y2="150" class="s-line"/><rect x="420" y="96" width="32" height="30" class="s-wood"/>
  ${arr("wc", 436, 96, 436, 52)}${T(446, 60, "手的力", "s-accent-text", "start")}${arr("wc", 390, 140, 466, 140, true)}${T(470, 144, "水平走", "s-chem-text", "start")}
  ${T(440, 186, "力和移動垂直：不作功", "s-text")}
</svg>`;

  // ---------- 九上 3-2 單擺的能量轉換 ----------
  F.pendulumEnergy = (() => {
    const px = 240, py = 30, L = 160, th = 35 * Math.PI / 180;
    const A = [r1(px - L * Math.sin(th)), r1(py + L * Math.cos(th))], B = [px, py + L], Cc = [r1(px + L * Math.sin(th)), r1(py + L * Math.cos(th))];
    const bars = (x, u, k) => `<rect x="${x - 15}" y="${262 - u}" width="13" height="${Math.max(u, 1)}" class="s-accent-fill"/><rect x="${x + 2}" y="${262 - k}" width="13" height="${Math.max(k, 1)}" class="s-chem-fill"/><line x1="${x - 20}" y1="262" x2="${x + 20}" y2="262" class="s-tick"/>`;
    return `<svg viewBox="0 0 480 300" width="480" role="img" aria-label="單擺擺動時位能與動能的轉換">
  <line x1="200" y1="${py}" x2="280" y2="${py}" class="s-line"/>
  <path d="M${A[0]},${A[1]} Q${px},${py + L + 30} ${Cc[0]},${Cc[1]}" class="s-guide"/>
  ${[A, B, Cc].map(p => `<line x1="${px}" y1="${py}" x2="${p[0]}" y2="${p[1]}" class="s-tick"/><circle cx="${p[0]}" cy="${p[1]}" r="11" class="s-metal"/>`).join("")}
  ${T(A[0] - 18, A[1] + 4, "A", "s-text", "end")}${T(B[0], B[1] + 28, "B", "s-text")}${T(Cc[0] + 18, Cc[1] + 4, "C", "s-text", "start")}
  ${bars(A[0], 40, 0)}${bars(B[0], 0, 40)}${bars(Cc[0], 40, 0)}
  ${T(A[0], 282, "A：位能最大", "s-small")}${T(B[0], 282, "B：動能最大", "s-small")}${T(Cc[0], 282, "C：位能最大", "s-small")}
  <rect x="356" y="22" width="12" height="12" class="s-accent-fill"/>${T(374, 33, "位能", "s-small", "start")}<rect x="410" y="22" width="12" height="12" class="s-chem-fill"/>${T(428, 33, "動能", "s-small", "start")}
</svg>`;
  })();

  // ---------- 九上 3-3 定滑輪與動滑輪 ----------
  F.pulleys = `<svg viewBox="0 0 480 280" width="480" role="img" aria-label="定滑輪與動滑輪">${defs("pl")}
  <line x1="60" y1="20" x2="180" y2="20" class="s-line"/><line x1="120" y1="20" x2="120" y2="38" class="s-line"/>
  <circle cx="120" cy="60" r="22" class="s-board"/><circle cx="120" cy="60" r="3" class="s-dot"/>
  <path d="M98,60 L98,170 M142,60 L142,150" class="s-wire"/><path d="M98,60 A22,22 0 0,1 142,60" class="s-wire"/>
  <rect x="78" y="170" width="40" height="34" class="s-wood"/>${T(98, 192, "W")}
  ${arr("pl", 142, 150, 142, 204, true)}${T(150, 196, "F = W", "s-chem-text", "start")}
  ${T(120, 238, "定滑輪：不省力", "s-text")}${T(120, 258, "改變施力方向", "s-small")}
  <line x1="290" y1="20" x2="410" y2="20" class="s-line"/>
  <path d="M318,20 L318,150 M362,150 L362,60" class="s-wire"/><path d="M318,150 A22,22 0 0,0 362,150" class="s-wire"/>
  <circle cx="340" cy="150" r="22" class="s-board"/><circle cx="340" cy="150" r="3" class="s-dot"/>
  <line x1="340" y1="172" x2="340" y2="190" class="s-line"/><rect x="320" y="190" width="40" height="34" class="s-wood"/>${T(340, 212, "W")}
  ${arr("pl", 362, 70, 362, 26, true)}${T(370, 44, "F = W ÷ 2", "s-chem-text", "start")}
  ${T(350, 248, "動滑輪：省一半的力", "s-text")}${T(350, 268, "繩子要拉兩倍長", "s-small")}
</svg>`;

  // ---------- 九上 4-2 安培計與伏特計的接法 ----------
  F.meterCircuit = `<svg viewBox="0 0 470 250" width="470" role="img" aria-label="安培計串聯、伏特計並聯">
  <path d="M80,129 L80,70 L217,70 M243,70 L380,70 L380,200 L246,200 M214,200 L80,200 L80,139" class="s-wire"/>
  <line x1="64" y1="129" x2="96" y2="129" class="s-line"/><line x1="72" y1="139" x2="88" y2="139" class="s-line"/>${T(58, 132, "+", "s-plus", "end")}${T(40, 160, "電池", "s-small")}
  ${bulb(230, 70)}${meter(230, 200, "A")}
  <path d="M190,70 L190,26 L215,26 M245,26 L270,26 L270,70" class="s-wire"/>${meter(230, 26, "V")}
  <circle cx="190" cy="70" r="3" class="s-dot"/><circle cx="270" cy="70" r="3" class="s-dot"/>
  ${T(290, 30, "伏特計：並聯在燈泡兩端", "s-accent-text", "start")}${T(230, 98, "燈泡", "s-small")}
  ${T(230, 236, "安培計：串聯在電路中，電流要從它裡面流過", "s-accent-text")}
</svg>`;

  // ---------- 九上 4-3 串聯與並聯 ----------
  F.seriesParallel = `<svg viewBox="0 0 520 240" width="520" role="img" aria-label="串聯電路與並聯電路">
  <path d="M30,180 L30,50 L77,50 M103,50 L147,50 M173,50 L220,50 L220,180 L130,180 M120,180 L30,180" class="s-wire"/>
  ${bulb(90, 50)}${bulb(160, 50)}${cellH(125, 180)}
  ${T(125, 212, "串聯：只有一條路", "s-text")}${T(125, 232, "電流處處相同，一個燈壞全部熄滅", "s-small")}
  <path d="M300,107 L300,50 L430,50 M300,123 L300,180 L430,180 M360,50 L360,102 M360,128 L360,180 M430,50 L430,102 M430,128 L430,180" class="s-wire"/>
  <line x1="284" y1="110" x2="316" y2="110" class="s-line"/><line x1="290" y1="120" x2="310" y2="120" class="s-line"/>
  ${bulb(360, 115)}${bulb(430, 115)}
  <circle cx="360" cy="50" r="3" class="s-dot"/><circle cx="360" cy="180" r="3" class="s-dot"/>
  ${T(385, 212, "並聯：分岔成好幾條路", "s-text")}${T(385, 232, "各支路電壓相同，一個燈壞其他照亮", "s-small")}
</svg>`;

  // ---------- 九下 1-2 鋅銅電池 ----------
  F.znCuCell = `<svg viewBox="0 0 500 275" width="500" role="img" aria-label="鋅銅電池">${defs("zc")}
  <path d="M40,122 L44,126 L44,240 L200,240 L200,124" class="s-glass"/><rect x="46" y="150" width="152" height="88" class="s-water"/>
  <path d="M300,122 L304,126 L304,240 L460,240 L460,124" class="s-glass"/><rect x="306" y="150" width="152" height="88" class="s-water"/><rect x="306" y="150" width="152" height="88" style="fill:#2f6fed;fill-opacity:.12"/>
  <path d="M170,200 L170,108 Q250,72 330,108 L330,200" class="s-bridge"/>${T(250, 120, "鹽橋", "s-small")}
  <rect x="100" y="95" width="14" height="130" class="s-metal"/><rect x="400" y="95" width="14" height="130" class="s-copper"/>
  <path d="M107,95 L107,40 L242,40 M268,40 L407,40 L407,95" class="s-wire"/>${bulb(255, 40)}
  ${arr("zc", 150, 20, 360, 20, true)}${T(255, 14, "電子由鋅經導線流向銅", "s-chem-text")}
  ${T(122, 210, "硫酸鋅", "s-small")}${T(382, 210, "硫酸銅", "s-small")}
  ${T(120, 260, "鋅：負極（逐漸變細）")}${T(380, 260, "銅：正極（有銅析出）")}
</svg>`;

  // ---------- 九下 1-3 電解水 ----------
  F.electrolysisWater = `<svg viewBox="0 0 440 280" width="440" role="img" aria-label="電解水">
  <path d="M60,140 L60,240 L380,240 L380,140" class="s-glass"/><rect x="62" y="160" width="316" height="78" class="s-water"/>
  <rect x="120" y="40" width="40" height="190" class="s-glass-fill"/><rect x="122" y="150" width="36" height="78" class="s-water"/>
  <rect x="280" y="40" width="40" height="190" class="s-glass-fill"/><rect x="282" y="95" width="36" height="133" class="s-water"/>
  ${T(140, 100, "體積 2", "s-accent-text")}${T(300, 72, "體積 1", "s-chem-text")}
  <rect x="134" y="206" width="12" height="22" class="s-metal"/><rect x="294" y="206" width="12" height="22" class="s-metal"/>
  <path d="M140,228 L140,262 L215,262 M225,262 L300,262 L300,228" class="s-wire"/>${cellH(220, 262)}
  ${T(140, 30, "氫氣 H₂（負極）", "s-accent-text")}${T(300, 30, "氧氣 O₂（正極）", "s-chem-text")}
  ${T(106, 222, "−", "s-minus", "end")}${T(334, 222, "+", "s-plus", "start")}
</svg>`;

  // ---------- 九下 1-3 電鍍 ----------
  F.electroplate = `<svg viewBox="0 0 440 260" width="440" role="img" aria-label="在鑰匙上鍍銅">${defs("ep")}
  <path d="M60,92 L64,96 L64,232 L376,232 L376,94" class="s-glass"/><rect x="66" y="110" width="308" height="120" class="s-water"/><rect x="66" y="110" width="308" height="120" style="fill:#2f6fed;fill-opacity:.12"/>
  <circle cx="130" cy="84" r="13" class="s-metal"/><rect x="124" y="96" width="12" height="110" class="s-metal"/><rect x="136" y="170" width="10" height="6" class="s-metal"/><rect x="136" y="186" width="10" height="6" class="s-metal"/>
  <rect x="300" y="80" width="16" height="130" class="s-copper"/>
  <path d="M130,71 L130,30 L211,30 M221,30 L308,30 L308,80" class="s-wire"/>${cellH(216, 30)}
  <circle cx="250" cy="150" r="13" class="s-tint"/>${T(250, 155, "Cu²⁺", "s-tiny")}${arr("ep", 236, 150, 152, 150, true)}
  <circle cx="230" cy="194" r="13" class="s-tint"/>${T(230, 199, "Cu²⁺", "s-tiny")}${arr("ep", 216, 194, 152, 194, true)}
  ${T(110, 252, "鑰匙（被鍍物）接負極", "s-small")}${T(320, 252, "銅片接正極（逐漸變薄）", "s-small")}
  ${T(104, 60, "−", "s-minus", "end")}${T(330, 66, "+", "s-plus", "start")}
</svg>`;

  // ---------- 九下 2-1 條形磁鐵的磁力線 ----------
  F.magnetField = (() => {
    let lines = "";
    [40, 80, 130].forEach(h => {
      const ty = r1(125 - 0.75 * h), by = r1(135 + 0.75 * h);
      lines += `<path d="M180,125 C120,${125 - h} 360,${125 - h} 300,125" class="s-field"/><path d="M180,135 C120,${135 + h} 360,${135 + h} 300,135" class="s-field"/>`;
      lines += `<path d="M234,${ty - 5} L244,${ty} L234,${ty + 5} Z" class="s-accent-fill"/><path d="M234,${by - 5} L244,${by} L234,${by + 5} Z" class="s-accent-fill"/>`;
    });
    return `<svg viewBox="0 0 480 290" width="480" role="img" aria-label="條形磁鐵的磁力線">${lines}
  <line x1="180" y1="130" x2="110" y2="130" class="s-field"/><path d="M116,125 L106,130 L116,135 Z" class="s-accent-fill"/>
  <line x1="370" y1="130" x2="300" y2="130" class="s-field"/><path d="M316,125 L306,130 L316,135 Z" class="s-accent-fill"/>
  <rect x="180" y="115" width="60" height="30" class="s-mag-n"/><rect x="240" y="115" width="60" height="30" class="s-mag-s"/>
  ${T(210, 137, "N", "s-mag-label")}${T(270, 137, "S", "s-mag-label")}
  ${T(240, 282, "磁鐵外部的磁力線由 N 極出發、回到 S 極；兩極附近最密，磁力最強", "s-small")}
</svg>`;
  })();

  // ---------- 九下 2-2 直導線與螺線管的磁場 ----------
  F.currentField = (() => {
    const cx = 120, cy = 110;
    let rings = "";
    [32, 58].forEach(r => { rings += `<circle cx="${cx}" cy="${cy}" r="${r}" class="s-field"/><path d="M${cx + 6},${cy - r - 5} L${cx - 4},${cy - r} L${cx + 6},${cy - r + 5} Z" class="s-accent-fill"/><path d="M${cx - 6},${cy + r - 5} L${cx + 4},${cy + r} L${cx - 6},${cy + r + 5} Z" class="s-accent-fill"/>`; });
    let coil = "";
    for (let x = 290; x <= 410; x += 24) coil += `<ellipse cx="${x}" cy="110" rx="9" ry="40" class="s-wire"/><path d="M${x + 4},118 L${x + 9},106 L${x + 14},118 Z" class="s-chem-fill"/>`;
    return `<svg viewBox="0 0 480 240" width="480" role="img" aria-label="直導線與螺線管周圍的磁場">${rings}
  <circle cx="${cx}" cy="${cy}" r="9" class="s-board"/><circle cx="${cx}" cy="${cy}" r="3" class="s-pupil"/>
  ${T(cx, 196, "直導線（俯視，⊙ 電流朝向你）", "s-small")}${T(cx, 216, "磁場：逆時針的同心圓", "s-small")}
  ${coil}${T(266, 116, "N", "s-text", "end")}${T(434, 116, "S", "s-text", "start")}
  ${T(350, 176, "前側電流向上（紅色箭頭）", "s-small")}${T(350, 196, "螺線管", "s-text")}${T(350, 216, "右手四指沿電流方向彎曲，拇指指向 N 極", "s-small")}
</svg>`;
  })();

  // ---------- 九下 2-3 電磁感應 ----------
  F.inductionCoil = (() => {
    const panel = (x0, move, ang, label) => {
      let coil = ""; for (let x = x0 + 82; x <= x0 + 127; x += 15) coil += `<ellipse cx="${x}" cy="62" rx="6" ry="22" class="s-wire"/>`;
      const mx = x0 + 100, my = 152, a = ang * Math.PI / 180;
      return `<rect x="${x0 + 12}" y="51" width="26" height="22" class="s-mag-s"/><rect x="${x0 + 38}" y="51" width="26" height="22" class="s-mag-n"/>${T(x0 + 51, 67, "N", "s-tiny")}
  ${coil}<path d="M${x0 + 82},84 L${x0 + 82},${my} L${mx - 26},${my} M${x0 + 127},84 L${x0 + 127},${my} L${mx + 26},${my}" class="s-wire"/>
  <circle cx="${mx}" cy="${my}" r="24" class="s-board"/><line x1="${mx}" y1="${my + 10}" x2="${r1(mx + 26 * Math.sin(a))}" y2="${r1(my + 10 - 26 * Math.cos(a))}" class="s-chem-line"/>
  ${move ? arr("ic", move > 0 ? x0 + 20 : x0 + 60, 34, move > 0 ? x0 + 60 : x0 + 20, 34) : T(x0 + 40, 38, "不動", "s-small")}
  ${T(x0 + 85, 206, label)}`;
    };
    return `<svg viewBox="0 0 520 220" width="520" role="img" aria-label="磁鐵插入與拔出線圈時的感應電流">${defs("ic")}
  ${panel(0, 1, 40, "① 插入：偏轉")}${panel(175, 0, 0, "② 靜止：不偏轉")}${panel(350, -1, -40, "③ 拔出：反向偏轉")}
</svg>`;
  })();
})();
