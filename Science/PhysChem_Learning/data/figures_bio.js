/*
 * 生物（七年級）課文圖解（2026-10-11）。課文用的圖會標出答案；考題用的圖在後面，答案改成甲、乙、丙等代號。
 * 需在 figures.js 之後、curriculum_bio.js 之前載入。
 */
(function () {
  const F = window.FIG;
  const mk = (id, cls) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" class="${cls}"/></marker>`;
  const defs = id => `<defs>${mk(id + "a", "s-accent-fill")}${mk(id + "b", "s-bio-fill")}${mk(id + "r", "s-chem-fill")}</defs>`;
  const T = (x, y, s, cls, anchor) => `<text x="${x}" y="${y}" text-anchor="${anchor || "middle"}" class="${cls || "s-text"}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls || "s-guide"}"/>`;
  const A = (id, x1, y1, x2, y2, kind) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${kind === "b" ? "s-bio-arrow" : kind === "r" ? "s-chem-arrow" : "s-arrow"}" marker-end="url(#${id}${kind || "a"})"/>`;
  const box = (x, y, w, h, s, cls, tcls) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" class="${cls || "s-node"}"/>${T(x + w / 2, y + h / 2 + 5, s, tcls || "s-text")}`;

  // ---------- 2-2 動物細胞與植物細胞 ----------
  const cellParts = (q) => {
    const n = q ? ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛"] : ["細胞膜", "細胞核", "細胞質", "粒線體", "細胞壁", "液胞", "葉綠體", "細胞核"];
    return `<svg viewBox="0 0 460 280" width="460" role="img" aria-label="${q ? "動物細胞與植物細胞構造代號圖" : "動物細胞與植物細胞的構造"}">
  <ellipse cx="110" cy="130" rx="85" ry="65" class="s-bio-soft"/>
  <circle cx="95" cy="125" r="22" class="s-node"/><circle cx="95" cy="125" r="6" class="s-dot"/>
  <ellipse cx="152" cy="156" rx="15" ry="7" class="s-node-chem"/><ellipse cx="140" cy="96" rx="13" ry="6" class="s-node-chem"/>
  ${L(32, 112, 40, 46)}${L(98, 103, 112, 46)}${L(100, 168, 62, 212)}${L(152, 163, 160, 212)}
  ${T(40, 38, n[0], "s-text")}${T(116, 38, n[1], "s-text")}${T(58, 230, n[2], "s-text")}${T(162, 230, n[3], "s-text")}
  <rect x="255" y="65" width="180" height="130" rx="4" class="s-bio-soft"/><rect x="263" y="73" width="164" height="114" rx="3" class="s-line" style="stroke-width:1"/>
  <rect x="322" y="84" width="96" height="94" rx="14" class="s-water"/>
  <circle cx="292" cy="108" r="17" class="s-node"/><circle cx="292" cy="108" r="5" class="s-dot"/>
  <ellipse cx="282" cy="150" rx="11" ry="6" class="s-leaf"/><ellipse cx="302" cy="170" rx="11" ry="6" class="s-leaf"/><ellipse cx="300" cy="138" rx="10" ry="5" class="s-leaf"/>
  ${L(257, 90, 270, 46)}${L(380, 90, 384, 46)}${L(282, 156, 282, 212)}${L(300, 122, 356, 212)}
  ${T(270, 38, n[4], "s-text")}${T(388, 38, n[5], "s-text")}${T(282, 230, n[6], "s-text")}${T(360, 230, n[7], "s-text")}
  ${T(110, 268, "動物細胞", "s-bio-text")}${T(345, 268, "植物細胞", "s-bio-text")}
</svg>`;
  };
  F.bioCells = cellParts(false);
  F.qBioCells = cellParts(true);

  // ---------- 2-4 生物體的組成層次 ----------
  F.bioLevels = (() => {
    const items = ["細胞", "組織", "器官", "器官系統", "個體"];
    const ex = ["肌肉細胞", "肌肉組織", "胃", "消化系統", "人"];
    let s = "";
    items.forEach((t, i) => {
      const x = 14 + i * 90, w = i === 3 ? 82 : 74;
      s += box(x, 40, w, 40, t, "s-bio-soft") + T(x + w / 2, 104, ex[i], "s-small");
      if (i < 4) s += A("lv", x + w + 2, 60, x + 88, 60, "b");
    });
    return `<svg viewBox="0 0 460 150" width="460" role="img" aria-label="動物體的組成層次">${defs("lv")}${s}
  ${T(230, 136, "國中課程中，植物簡化成：細胞 → 組織 → 器官 → 個體（不列器官系統）", "s-small")}
</svg>`;
  })();

  // ---------- 2-3 擴散與滲透 ----------
  F.bioOsmosis = `<svg viewBox="0 0 460 220" width="460" role="img" aria-label="水分子由低濃度溶液往高濃度溶液滲透">${defs("os")}
  <rect x="40" y="40" width="380" height="130" rx="6" class="s-water"/>
  <line x1="230" y1="40" x2="230" y2="170" class="s-line" style="stroke-dasharray:6 5"/>
  ${[[70, 70], [100, 120], [140, 80], [180, 140], [90, 150], [160, 110], [200, 70], [120, 60]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="5" class="s-particle"/>`).join("")}
  ${[[260, 70], [300, 120], [340, 80], [380, 140], [290, 150], [360, 110], [400, 70], [320, 60], [270, 110], [390, 100], [310, 90], [350, 150]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="9" class="s-sugar"/>`).join("")}
  ${A("os", 190, 100, 270, 100, "b")}
  ${T(135, 30, "低濃度（水多）", "s-text")}${T(325, 30, "高濃度（糖多）", "s-text")}
  ${T(230, 196, "虛線是細胞膜：水分子能通過，大的糖分子過不去", "s-small")}
  ${T(230, 214, "水由低濃度那一邊，往高濃度那一邊移動（滲透）", "s-bio-text")}
</svg>`;

  // ---------- 3-2 酵素活性與溫度 ----------
  F.bioEnzyme = (() => {
    const X = t => 60 + t * 3.4, Y = v => 190 - v * 1.5;
    const pts = []; for (let t = 0; t <= 100; t += 2) { const v = t <= 37 ? 100 * Math.exp(-Math.pow((t - 37) / 18, 2)) : 100 * Math.exp(-Math.pow((t - 37) / 11, 2)); pts.push(X(t).toFixed(1) + "," + Y(v).toFixed(1)); }
    let g = ""; [0, 20, 40, 60, 80, 100].forEach(t => { g += `<line x1="${X(t)}" y1="${Y(0)}" x2="${X(t)}" y2="${Y(0) + 5}" class="s-tick"/>` + T(X(t), Y(0) + 22, t, "s-small"); });
    return `<svg viewBox="0 0 460 250" width="460" role="img" aria-label="酵素活性和溫度的關係">${defs("ez")}
  <line x1="${X(0)}" y1="${Y(0)}" x2="${X(100) + 10}" y2="${Y(0)}" class="s-line"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="20" class="s-line"/>${g}
  <polyline points="${pts.join(" ")}" class="s-bio-line"/>
  <line x1="${X(37)}" y1="${Y(100)}" x2="${X(37)}" y2="${Y(0)}" class="s-guide"/>
  ${T(X(37) + 8, Y(100) - 8, "約 37 °C 最快（人體的酵素）", "s-bio-text", "start")}
  ${T(X(72), Y(30), "太熱：酵素變性，", "s-small", "start")}${T(X(72), Y(30) + 18, "冷卻後也不能恢復", "s-small", "start")}
  ${T(X(1) + 6, 34, "反應速率", "s-small", "start")}${T(X(100) + 4, Y(0) + 40, "溫度 (°C)", "s-small", "end")}
</svg>`;
  })();

  // ---------- 3-3 光合作用 ----------
  F.bioPhoto = `<svg viewBox="0 0 460 230" width="460" role="img" aria-label="光合作用的原料與產物">${defs("ph")}
  <circle cx="60" cy="50" r="24" class="s-sun"/>${T(60, 96, "光能", "s-small")}
  <path d="M170,170 Q230,40 300,170 Q235,130 170,170 Z" class="s-leaf"/>${T(236, 156, "葉綠體", "s-bio-text")}
  ${A("ph", 86, 62, 182, 118)}
  ${box(14, 132, 110, 34, "二氧化碳", "s-node")}${box(14, 176, 110, 34, "水", "s-node")}
  ${A("ph", 126, 150, 172, 156)}${A("ph", 126, 192, 176, 172)}
  ${box(336, 112, 110, 34, "葡萄糖", "s-bio-soft")}${box(336, 160, 110, 34, "氧氣", "s-bio-soft")}
  ${A("ph", 294, 150, 334, 132, "b")}${A("ph", 296, 166, 334, 176, "b")}
  ${T(230, 24, "二氧化碳 ＋ 水 ──(光、葉綠體)──→ 葡萄糖 ＋ 氧氣", "s-text")}
</svg>`;

  // ---------- 4-4 血液循環 ----------
  F.bioCirculation = `<svg viewBox="0 0 460 316" width="460" role="img" aria-label="人體的肺循環與體循環">${defs("cc")}
  ${box(150, 14, 160, 40, "肺（換氣）", "s-node")}
  ${box(150, 246, 160, 40, "全身組織細胞", "s-node")}
  <rect x="150" y="104" width="160" height="96" rx="12" class="s-node-main"/>
  <line x1="230" y1="104" x2="230" y2="200" class="s-tick"/><line x1="150" y1="152" x2="310" y2="152" class="s-tick"/>
  ${T(190, 134, "右心房", "s-small")}${T(270, 134, "左心房", "s-small")}${T(190, 182, "右心室", "s-small")}${T(270, 182, "左心室", "s-small")}
  <path d="M170,104 Q100,80 170,56" class="s-vein-line" marker-end="url(#cca)"/>
  <path d="M290,56 Q360,80 290,104" class="s-blood-line" marker-end="url(#ccr)"/>
  <path d="M310,180 Q410,215 300,246" class="s-blood-line" marker-end="url(#ccr)"/>
  <path d="M160,246 Q50,215 150,128" class="s-vein-line" marker-end="url(#cca)"/>
  ${T(96, 70, "肺動脈", "s-small", "end")}${T(364, 70, "肺靜脈", "s-small", "start")}
  ${T(384, 236, "主動脈", "s-small", "start")}${T(76, 236, "大靜脈", "s-small", "end")}
  ${T(86, 92, "缺氧血", "s-accent-text", "end")}${T(374, 92, "充氧血", "s-chem-text", "start")}
  ${T(230, 308, "圖是從正面看人的心臟，所以左右和自己的身體相反", "s-small")}
</svg>`;

  // ---------- 5-2 反射路徑 ----------
  F.bioReflex = (() => {
    const steps = ["受器", "感覺神經", "脊髓", "運動神經", "動器"];
    const ex = ["手指皮膚", "傳入訊息", "不經過大腦", "傳出命令", "手臂肌肉"];
    let s = "";
    steps.forEach((t, i) => { const x = 10 + i * 90; s += box(x, 50, 80, 40, t, i === 2 ? "s-bio-soft" : "s-node") + T(x + 40, 114, ex[i], "s-small"); if (i < 4) s += A("rf", x + 82, 70, x + 88, 70, "b"); });
    return `<svg viewBox="0 0 460 170" width="460" role="img" aria-label="縮手反射的神經路徑">${defs("rf")}
  ${T(230, 30, "手碰到很燙的東西，會先縮手、後覺得燙", "s-text")}${s}
  ${T(230, 150, "反射的路徑短，所以反應快；之後訊息才傳到大腦，產生「燙」的感覺", "s-small")}
</svg>`;
  })();

  // ---------- 七下 3-1 演化的分支（脊椎動物，簡化示意，未依時間比例） ----------
  F.bioEvoTree = (() => {
    const tips = [["魚類", 40], ["兩生類", 120], ["爬蟲類", 200], ["鳥類", 280], ["哺乳類", 380]];
    const p = (x1, y1, x2, y2) => `<path d="M${x1},${y1} L${x2},${y1} L${x2},${y2}" class="s-bio-line" style="stroke-width:2.5"/>`;
    return `<svg viewBox="0 0 460 250" width="460" role="img" aria-label="脊椎動物演化的分支示意">
  ${p(70, 200, 40, 40)}${p(70, 200, 160, 160)}${p(160, 160, 120, 40)}${p(160, 160, 250, 120)}${p(250, 120, 380, 40)}${p(250, 120, 220, 90)}${p(220, 90, 200, 40)}${p(220, 90, 280, 40)}
  <line x1="70" y1="200" x2="70" y2="224" class="s-bio-line" style="stroke-width:2.5"/><circle cx="70" cy="224" r="5" class="s-bio-fill"/>
  ${tips.map(t => T(t[1], 30, t[0], "s-bio-text")).join("")}
  ${T(82, 240, "共同祖先", "s-small", "start")}${T(440, 200, "每個分岔點是一個共同祖先", "s-small", "end")}${T(440, 218, "五類都是「現在」還活著的生物", "s-small", "end")}
</svg>`;
  })();

  // ---------- 七下 1-1 細胞分裂與減數分裂 ----------
  F.bioDivision = (() => {
    const cell = (x, y, r, n, label) => `<circle cx="${x}" cy="${y}" r="${r}" class="s-bio-soft"/>${T(x, y + 6, n, "s-bio-text")}${label ? T(x, y + r + 18, label, "s-small") : ""}`;
    return `<svg viewBox="0 0 460 250" width="460" role="img" aria-label="細胞分裂與減數分裂的染色體數目">${defs("dv")}
  ${T(110, 24, "細胞分裂（生長、修補）", "s-text")}${T(345, 24, "減數分裂（產生生殖細胞）", "s-text")}
  ${cell(110, 70, 28, "46")}${A("dv", 96, 100, 70, 140, "b")}${A("dv", 124, 100, 150, 140, "b")}${cell(60, 168, 24, "46")}${cell(160, 168, 24, "46")}
  ${T(110, 222, "1 個變 2 個，染色體數目不變", "s-small")}
  ${cell(345, 70, 28, "46")}
  ${A("dv", 326, 100, 270, 142, "b")}${A("dv", 338, 100, 318, 142, "b")}${A("dv", 352, 100, 372, 142, "b")}${A("dv", 364, 100, 420, 142, "b")}
  ${cell(262, 166, 20, "23")}${cell(318, 166, 20, "23")}${cell(372, 166, 20, "23")}${cell(426, 166, 20, "23")}
  ${T(345, 222, "1 個變 4 個，染色體數目減半", "s-small")}
  ${T(230, 244, "數字是人類細胞的染色體數目", "s-small")}
</svg>`;
  })();

  // ---------- 七下 2-1 遺傳棋盤 ----------
  const punnett = (q) => {
    const c = q ? ["？", "？", "？", "？"] : ["AA", "Aa", "Aa", "aa"];
    return `<svg viewBox="0 0 340 240" width="340" role="img" aria-label="${q ? "兩個 Aa 親代的遺傳棋盤（空格待填）" : "兩個 Aa 親代產生子代的遺傳棋盤"}">
  ${T(190, 22, "父親 Aa 的精子", "s-small")}${T(28, 140, "母親", "s-small")}${T(28, 158, "Aa", "s-small")}${T(28, 176, "的卵", "s-small")}
  <rect x="110" y="34" width="80" height="40" class="s-node"/><rect x="190" y="34" width="80" height="40" class="s-node"/>${T(150, 60, "A", "s-accent-text")}${T(230, 60, "a", "s-accent-text")}
  <rect x="60" y="74" width="50" height="80" class="s-node-chem"/><rect x="60" y="154" width="50" height="80" class="s-node-chem"/>${T(85, 119, "A", "s-chem-text")}${T(85, 199, "a", "s-chem-text")}
  <rect x="110" y="74" width="80" height="80" class="s-node-main"/><rect x="190" y="74" width="80" height="80" class="s-node-main"/>
  <rect x="110" y="154" width="80" height="80" class="s-node-main"/><rect x="190" y="154" width="80" height="80" class="s-node-main"/>
  ${T(150, 120, c[0], "s-big")}${T(230, 120, c[1], "s-big")}${T(150, 200, c[2], "s-big")}${T(230, 200, c[3], "s-big")}
</svg>`;
  };
  F.bioPunnett = punnett(false);
  F.qBioPunnett = punnett(true);

  // ---------- 七下 3-2 分類階層 ----------
  F.bioRanks = (() => {
    const r = ["界", "門", "綱", "目", "科", "屬", "種"];
    const ex = ["動物界", "脊索動物門", "哺乳綱", "食肉目", "貓科", "豹屬", "老虎"];
    let s = "";
    r.forEach((t, i) => { const w = 420 - i * 46, x = 230 - w / 2, y = 20 + i * 32; s += `<rect x="${x}" y="${y}" width="${w}" height="28" rx="6" class="s-bio-soft" style="fill-opacity:${0.25 + i * 0.1}"/>` + T(x + 24, y + 19, t, "s-bio-text") + T(x + w - 12, y + 19, ex[i], "s-small", "end"); });
    return `<svg viewBox="0 0 460 290" width="460" role="img" aria-label="生物分類的七個階層">${s}
  ${T(230, 270, "愈往下，包含的生物種類愈少、彼此愈相似", "s-small")}
</svg>`;
  })();

  // ---------- 七下 4-3 能量金字塔 ----------
  F.bioPyramid = (() => {
    const lv = [["生產者（稻子）", "s-leaf"], ["初級消費者（蝗蟲）", "s-bio-soft"], ["次級消費者（青蛙）", "s-node"], ["三級消費者（蛇）", "s-node-chem"]];
    let s = "";
    lv.forEach((l, i) => { const y = 200 - i * 46, w = 320 - i * 54, x = 170 - w / 2; s += `<rect x="${x}" y="${y}" width="${w}" height="40" class="${l[1]}"/>` + T(170, y + 25, l[0], "s-text"); });
    return `<svg viewBox="0 0 460 260" width="460" role="img" aria-label="生態系的能量金字塔">${defs("py")}${s}
  ${A("py", 360, 220, 360, 72)}${T(372, 140, "能量", "s-small", "start")}${T(372, 158, "一層層", "s-small", "start")}${T(372, 176, "變少", "s-small", "start")}
  ${T(230, 254, "每往上一層，只有一小部分（約一成）能量傳下去，其餘變成熱散失", "s-small")}
</svg>`;
  })();
})();
