/*
 * 國小自然課文圖解（SVG），六上、六下。沿用 figures.js 的小工具（FIG._），畫好的圖加進 window.FIG。
 * 課文圖會標出答案；q 開頭的是看圖題用的圖，圖上不寫答案。
 */
(function () {
  const { r1, T, L, R, C, P, poly, defs, A } = FIG._;

  // ---------- 六上 1 水循環 ----------
  const waterCycle = `<svg viewBox="0 0 560 230" width="560" role="img" aria-label="水循環：蒸發、凝結、降水、地表逕流">${defs("wc")}
  ${R(0, 170, 300, 60, "s-earth-soft")}${R(300, 170, 260, 60, "s-ocean")}${T(430, 210, "海洋", "s-small")}${T(120, 210, "陸地", "s-small")}
  ${poly([[20, 170], [110, 90], [200, 170]], "s-rock")}
  ${C(500, 40, 22, "s-sun")}
  ${C(150, 50, 22, "s-node-main")}${C(180, 42, 26, "s-node-main")}${C(212, 52, 20, "s-node-main")}${T(182, 50, "雲", "s-small")}
  ${A("wc", 420, 160, 420, 80, "a")}${T(440, 120, "蒸發", "s-small", "start")}
  ${A("wc", 390, 60, 250, 50, "a")}${T(320, 44, "水蒸氣上升、遇冷凝結", "s-tiny")}
  ${[155, 180, 205].map(x => L(x, 78, x - 6, 104, "s-accent-line")).join("")}${T(222, 100, "降水", "s-small", "start")}
  ${A("wc", 210, 165, 300, 180, "e")}${T(250, 160, "河流、地下水流回海洋", "s-tiny")}
</svg>`;

  // ---------- 六上 1 天氣圖符號 ----------
  const front = (x, y, w, kind) => {
    let g = L(x, y, x + w, y, kind === "cold" ? "s-accent-line" : kind === "warm" ? "s-chem-line" : "s-line");
    for (let i = 0; i < 4; i++) {
      const cx = x + 12 + i * (w - 24) / 3;
      const k = kind === "stat" ? (i % 2 ? "warm" : "cold") : kind;
      g += k === "cold" ? poly([[cx - 8, y], [cx + 8, y], [cx, y - 12]], "s-accent-fill") : P(`M${r1(cx - 8)},${y} A8 8 0 0 ${i % 2 && kind === "stat" ? 0 : 1} ${r1(cx + 8)},${y} Z`, "s-chem-fill");
    }
    return g;
  };
  const weatherSymbols = (q) => `<svg viewBox="0 0 560 170" width="560" role="img" aria-label="${q ? "天氣圖上的四種符號，標有甲到丁" : "天氣圖上的高氣壓、低氣壓與鋒面符號"}">
  ${T(50, 50, "H", "s-big")}${T(50, 80, q ? "甲" : "高氣壓", "s-small")}
  ${T(140, 50, "L", "s-big")}${T(140, 80, q ? "乙" : "低氣壓", "s-small")}
  ${front(200, 50, 100, "cold")}${T(250, 80, q ? "丙" : "冷鋒", "s-small")}
  ${front(330, 50, 100, "warm")}${T(380, 80, q ? "丁" : "暖鋒", "s-small")}
  ${q ? "" : front(450, 50, 100, "stat") + T(500, 80, "滯留鋒", "s-small")}
  ${q ? "" : T(280, 120, "高氣壓：通常晴朗　低氣壓：多雲、容易下雨", "s-tiny") + T(280, 142, "冷鋒經過，氣溫下降；滯留鋒停留久，帶來連續降雨（例如梅雨）", "s-tiny")}
</svg>`;
  const weatherMap = weatherSymbols(false), qWeather = weatherSymbols(true);

  // ---------- 六上 2 石蕊試紙與水溶液的酸鹼性 ----------
  const litmus = `<svg viewBox="0 0 560 190" width="560" role="img" aria-label="酸性、中性、鹼性水溶液使石蕊試紙變色的情形">
  ${["", "酸性", "中性", "鹼性"].map((h, i) => i ? T(150 + (i - 1) * 140, 30, h, "s-text") : "").join("")}
  ${T(40, 76, "藍色試紙", "s-small")}${T(40, 136, "紅色試紙", "s-small")}
  ${[["s-chem-fill", "變紅"], ["s-accent-fill", "不變"], ["s-accent-fill", "不變"]].map((c, i) => R(125 + i * 140, 52, 50, 40, c[0], 4) + T(210 + i * 140, 78, c[1], "s-tiny", "start")).join("")}
  ${[["s-chem-fill", "不變"], ["s-chem-fill", "不變"], ["s-accent-fill", "變藍"]].map((c, i) => R(125 + i * 140, 112, 50, 40, c[0], 4) + T(210 + i * 140, 138, c[1], "s-tiny", "start")).join("")}
  ${T(290, 180, "例：醋、檸檬汁是酸性；食鹽水、糖水是中性；小蘇打水、肥皂水是鹼性", "s-tiny")}
</svg>`;

  // ---------- 六上 2 測試水溶液能不能導電 ----------
  const conduct = `<svg viewBox="0 0 480 190" width="480" role="img" aria-label="用電池和發光二極體測試水溶液的導電性">
  ${R(40, 40, 70, 30, "s-metal", 4)}${T(75, 60, "電池", "s-tiny")}
  ${C(240, 55, 14, "s-sun")}${T(240, 30, "發光二極體", "s-tiny")}
  ${L(110, 55, 226, 55, "s-wire")}${L(40, 55, 20, 55, "s-wire")}${L(20, 55, 20, 120, "s-wire")}${L(20, 120, 180, 120, "s-wire")}${L(254, 55, 290, 55, "s-wire")}${L(290, 55, 290, 120, "s-wire")}${L(290, 120, 220, 120, "s-wire")}
  ${R(160, 100, 80, 70, "s-glass", 4)}${R(162, 130, 76, 38, "s-water")}${L(180, 120, 180, 155, "s-rod")}${L(220, 120, 220, 155, "s-rod")}
  ${T(380, 80, "會亮：食鹽水、醋", "s-small")}${T(380, 108, "不亮：糖水、純水", "s-small")}
</svg>`;

  // ---------- 六上 3 手臂彎曲：肌肉、骨骼、關節 ----------
  const arm = `<svg viewBox="0 0 520 200" width="520" role="img" aria-label="手臂彎曲時，上臂前側的肌肉收縮拉動前臂骨骼">
  ${L(60, 120, 220, 120, "s-rod")}${L(220, 120, 300, 40, "s-rod")}${C(220, 120, 10, "s-node-chem")}
  ${P("M80,110 Q150,64 232,100", "s-blood-line")}${P("M80,132 Q150,156 214,134", "s-vein-line")}
  ${T(150, 62, "肌肉收縮（變短變粗）", "s-tiny")}${T(150, 172, "另一側的肌肉放鬆", "s-tiny")}${T(240, 148, "關節", "s-small", "start")}${T(280, 96, "骨骼", "s-small", "start")}
  ${T(430, 70, "骨骼：支撐、保護", "s-small")}${T(430, 98, "肌肉：收縮拉動骨骼", "s-small")}${T(430, 126, "關節：讓骨骼能彎曲", "s-small")}
</svg>`;

  // ---------- 六上 3 呼吸的路徑 ----------
  const breath = `<svg viewBox="0 0 520 210" width="520" role="img" aria-label="空氣由鼻進入，經過氣管到肺">${defs("br")}
  ${R(150, 14, 60, 30, "s-node", 8)}${T(180, 34, "鼻、口", "s-small")}
  ${L(180, 44, 180, 100, "s-blood-line")}${T(196, 76, "氣管", "s-small", "start")}
  ${L(180, 100, 140, 120, "s-blood-line")}${L(180, 100, 220, 120, "s-blood-line")}
  ${P("M140,110 Q90,120 100,180 Q130,200 160,180 Q165,140 140,110 Z", "s-bio-soft")}${P("M220,110 Q270,120 260,180 Q230,200 200,180 Q195,140 220,110 Z", "s-bio-soft")}${T(180, 200, "肺", "s-small")}
  ${T(400, 60, "吸氣：氧氣進入肺", "s-small")}${T(400, 90, "在肺裡交換氣體", "s-small")}${T(400, 120, "呼氣：排出二氧化碳", "s-small")}
  ${T(400, 152, "呼氣比吸入的空氣含更多二氧化碳，", "s-tiny")}${T(400, 168, "通入石灰水時較快變混濁", "s-tiny")}
</svg>`;

  // ---------- 六上 4 電磁鐵 ----------
  const electromagnet = `<svg viewBox="0 0 520 190" width="520" role="img" aria-label="把漆包線繞在鐵釘上，接上電池就成了電磁鐵">
  ${R(80, 70, 200, 20, "s-metal", 3)}${T(300, 85, "鐵釘", "s-small", "start")}
  ${Array.from({ length: 12 }, (_, i) => P(`M${100 + i * 14},66 Q${107 + i * 14},80 ${100 + i * 14},94`, "s-copper")).join("")}
  ${L(100, 94, 100, 150, "s-wire")}${L(254, 94, 254, 150, "s-wire")}${R(140, 138, 80, 26, "s-metal", 4)}${L(100, 150, 140, 150, "s-wire")}${L(220, 150, 254, 150, "s-wire")}${T(180, 156, "電池", "s-tiny")}
  ${[0, 1, 2].map(i => R(300 + i * 18, 110, 10, 4, "s-metal")).join("")}${T(330, 130, "迴紋針", "s-tiny")}
  ${T(430, 40, "磁力變強的方法：", "s-small")}${T(430, 66, "線圈圈數增加", "s-small")}${T(430, 92, "電池串聯增加", "s-small")}${T(430, 128, "電流方向改變", "s-small")}${T(430, 150, "→ 磁極對調", "s-small")}
</svg>`;

  // ---------- 六下 1 槓桿 ----------
  const lever = (q) => {
    const fx = q ? 200 : 180;
    return `<svg viewBox="0 0 560 190" width="560" role="img" aria-label="${q ? "槓桿：支點、左端掛重物、右端施力，標出長度" : "槓桿的支點、施力點、抗力點"}">${defs("lv")}
  ${L(40, 100, 520, 100, "s-wood")}${poly([[fx, 102], [fx - 16, 134], [fx + 16, 134]], "s-earth-soft")}
  ${R(28, 102, 24, 30, "s-stone", 3)}${A("lv", 500, 60, 500, 94, "r")}
  ${q ? T(40, 150, "重 30 公斤重", "s-tiny") + L(40, 88, fx, 88, "s-guide") + T((40 + fx) / 2, 82, (fx - 40) / 4 + " 公分", "s-tiny") + L(fx, 88, 500, 88, "s-guide") + T((fx + 500) / 2, 82, (500 - fx) / 4 + " 公分", "s-tiny") + T(500, 50, "施力？", "s-tiny")
      : T(fx, 154, "支點", "s-small") + T(40, 154, "抗力點", "s-small") + T(500, 50, "施力點", "s-small") + L(40, 84, fx, 84, "s-guide") + T((40 + fx) / 2, 78, "抗力臂", "s-tiny") + L(fx, 84, 500, 84, "s-guide") + T((fx + 500) / 2, 78, "施力臂", "s-tiny") + T(280, 180, "施力臂比抗力臂長 → 省力", "s-small")}
</svg>`;
  };
  const leverFig = lever(false), qLever = lever(true);

  // ---------- 六下 1 定滑輪和動滑輪 ----------
  const pulleys = `<svg viewBox="0 0 520 240" width="520" role="img" aria-label="定滑輪和動滑輪">${defs("pl")}
  ${L(20, 20, 500, 20, "s-wood")}
  ${L(120, 20, 120, 40, "s-line")}${C(120, 56, 16, "s-metal")}${L(104, 56, 104, 150, "s-line")}${L(136, 56, 136, 180, "s-line")}${R(90, 150, 28, 28, "s-stone", 3)}${A("pl", 136, 150, 136, 190, "r")}
  ${T(120, 232, "定滑輪：不省力，可以改變施力方向", "s-tiny")}
  ${L(330, 20, 330, 140, "s-line")}${C(350, 140, 20, "s-metal")}${L(370, 140, 370, 60, "s-line")}${L(350, 160, 350, 178, "s-line")}${R(336, 178, 28, 28, "s-stone", 3)}${A("pl", 370, 90, 370, 40, "r")}
  ${T(380, 232, "動滑輪：省力，但不能改變施力方向", "s-tiny")}
</svg>`;

  // ---------- 六下 1 齒輪 ----------
  const gears = (() => {
    const gear = (cx, cy, r, n) => { let d = ""; for (let i = 0; i < n * 2; i++) { const a = i * Math.PI / n, rr = i % 2 ? r : r + 7; d += (i ? " L" : "M") + r1(cx + rr * Math.cos(a)) + "," + r1(cy + rr * Math.sin(a)); } return P(d + " Z", "s-metal") + C(cx, cy, 5, "s-dot"); };
    return `<svg viewBox="0 0 520 170" width="520" role="img" aria-label="大小齒輪互相咬合，轉動方向相反">
  ${gear(120, 80, 54, 16)}${gear(204, 80, 26, 8)}
  ${P("M80,24 A64 64 0 0 1 150,22", "s-accent-line")}${T(110, 14, "順時針", "s-tiny")}${P("M214,40 A40 40 0 0 0 186,42", "s-chem-line")}${T(204, 30, "逆時針", "s-tiny")}
  ${T(380, 60, "互相咬合的兩個齒輪，轉動方向相反", "s-small")}${T(380, 88, "齒數少的齒輪轉得比較快", "s-small")}${T(380, 116, "用鏈條連接（例如腳踏車），轉向相同", "s-small")}
</svg>`;
  })();

  // ---------- 六下 2 能量轉換 ----------
  const energy = `<svg viewBox="0 0 560 170" width="560" role="img" aria-label="生活中的能量轉換">${defs("en")}
  ${[["太陽能板", "光能 → 電能"], ["電風扇", "電能 → 動能"], ["電燈", "電能 → 光能、熱能"], ["吃飯後跑步", "化學能 → 動能"]].map((p, i) => R(10 + i * 138, 30, 128, 70, i % 2 ? "s-node-chem" : "s-node", 8) + T(74 + i * 138, 58, p[0], "s-small") + T(74 + i * 138, 84, p[1], "s-tiny")).join("")}
  ${T(280, 140, "能量會從一種形式轉換成另一種形式，總量不會改變", "s-small")}
</svg>`;

  // ---------- 六下 3 食物鏈 ----------
  const chain = (q) => `<svg viewBox="0 0 560 160" width="560" role="img" aria-label="${q ? "一條食物鏈：草、蚱蜢、青蛙、蛇" : "食物鏈：箭頭指向吃的一方"}">${defs(q ? "qc" : "fc")}
  ${q ? "" : C(30, 40, 18, "s-sun") + T(30, 76, "太陽", "s-tiny") + A("fc", 50, 50, 64, 64, "a")}
  ${[["草", "生產者"], ["蚱蜢", "初級消費者"], ["青蛙", "次級消費者"], ["蛇", "三級消費者"]].map((p, i) => R(70 + i * 120, 60, 90, 44, i ? "s-node" : "s-bio-soft", 8) + T(115 + i * 120, 88, p[0], "s-text") + (q ? "" : T(115 + i * 120, 124, p[1], "s-tiny")) + (i < 3 ? A(q ? "qc" : "fc", 162 + i * 120, 82, 188 + i * 120, 82, "b") : "")).join("")}
  ${q ? "" : T(280, 150, "箭頭表示「被吃 → 吃的一方」，能量也沿著箭頭傳遞", "s-tiny")}
</svg>`;
  const chainFig = chain(false), qChain = chain(true);

  // ---------- 看圖題：電磁鐵的比較 ----------
  const qMagnets = `<svg viewBox="0 0 520 170" width="520" role="img" aria-label="甲乙丙丁四個電磁鐵，線圈圈數和電池個數不同">
  ${[["甲", 20, 1], ["乙", 40, 1], ["丙", 20, 2], ["丁", 40, 2]].map(([n, turns, bat], i) => {
    const x = 20 + i * 126;
    return R(x, 30, 100, 110, "s-node-main", 8) + T(x + 50, 22, n, "s-text") + R(x + 20, 50, 60, 12, "s-metal", 2) +
      T(x + 50, 84, `線圈 ${turns} 圈`, "s-tiny") + T(x + 50, 108, `電池 ${bat} 個串聯`, "s-tiny") + T(x + 50, 130, "鐵釘相同", "s-tiny");
  }).join("")}
</svg>`;

  Object.assign(window.FIG, { waterCycle, weatherMap, qWeather, litmus, conduct, arm, breath, electromagnet, leverFig, qLever, pulleys, gears, energy, chainFig, qChain, qMagnets });
})();
