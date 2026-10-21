/*
 * 國小自然課文圖解（SVG），五上。顏色用 style.css 的 s-* class，深色模式會自動變色。
 * curriculum.js 以 ${FIG.fig(FIG.xxx, "圖說")} 引用。課文圖會標出答案；q 開頭的是看圖題用的圖，圖上不寫答案。
 * 五下的圖在 figures2.js（沿用這裡的小工具 FIG._）。
 */
(function () {
  function fig(svg, caption) {
    return `<figure class="fig"><div class="fig-scroll">${svg}</div><div class="fig-hint">← 左右滑動看完整圖，或點圖放大 →</div>${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
  }
  const r1 = n => Math.round(n * 10) / 10;
  const T = (x, y, s, cls, anchor) => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${anchor || "middle"}" class="${cls || "s-text"}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls, extra) => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" class="${cls || "s-line"}" ${extra || ""}/>`;
  const R = (x, y, w, h, cls, rx) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" ${rx ? `rx="${rx}"` : ""} class="${cls}"/>`;
  const C = (x, y, r, cls) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" class="${cls}"/>`;
  const P = (d, cls) => `<path d="${d}" class="${cls}"/>`;
  const poly = (pts, cls) => `<polygon points="${pts.map(p => r1(p[0]) + "," + r1(p[1])).join(" ")}" class="${cls}"/>`;
  const mk = (id, cls) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" class="${cls}"/></marker>`;
  const defs = id => `<defs>${mk(id + "a", "s-accent-fill")}${mk(id + "r", "s-chem-fill")}${mk(id + "b", "s-bio-fill")}${mk(id + "e", "s-earth-fill")}</defs>`;
  // 箭頭：kind a（藍）、r（橘紅）、b（綠）、e（棕）
  const A = (id, x1, y1, x2, y2, kind) => { const k = kind || "a"; const cls = { a: "s-arrow", r: "s-chem-arrow", b: "s-bio-arrow", e: "s-earth-arrow" }[k]; return `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" class="${cls}" marker-end="url(#${id}${k})"/>`; };
  // 正弦波：從 x0 開始，長 w，振幅 amp，n 個完整波
  const wave = (x0, y0, w, amp, n, cls) => { let d = ""; for (let i = 0; i <= 120; i++) { const x = x0 + w * i / 120, y = y0 - amp * Math.sin(2 * Math.PI * n * i / 120); d += (i ? " L" : "M") + r1(x) + "," + r1(y); } return P(d, cls || "s-accent-line"); };

  // ---------- 五上 1 鳥嘴的形狀和食物 ----------
  const beakFood = (() => {
    const bird = (x, beak, name, food) => `${C(x, 60, 26, "s-bio-soft")}${C(x - 8, 52, 4, "s-pupil")}${poly(beak.map(p => [x + p[0], 60 + p[1]]), "s-wood")}
  ${T(x + 10, 118, name, "s-text")}${T(x + 10, 140, food, "s-small")}`;
    return `<svg viewBox="0 0 470 160" width="470" role="img" aria-label="不同鳥嘴的形狀適合吃不同的食物">
  ${bird(40, [[24, -10], [44, -4], [46, 10], [38, 4], [24, 8]], "老鷹：鉤狀嘴", "撕開肉")}
  ${bird(150, [[24, -4], [76, -1], [76, 1], [24, 6]], "蜂鳥：細長嘴", "吸花蜜")}
  ${bird(270, [[24, -10], [42, 0], [24, 10]], "麻雀：短粗的嘴", "咬碎種子")}
  ${bird(380, [[24, -6], [56, -6], [60, 2], [56, 8], [24, 8]], "鴨子：扁平嘴", "在水中撈食物")}
</svg>`;
  })();

  // ---------- 五上 2 聲音的大小與高低 ----------
  const soundWaves = `<svg viewBox="0 0 470 230" width="470" role="img" aria-label="振動幅度和振動快慢對聲音的影響">
  ${T(120, 20, "聲音的大小（音量）", "s-text")}${T(350, 20, "聲音的高低（音高）", "s-text")}
  ${L(20, 70, 220, 70, "s-grid")}${wave(20, 70, 200, 30, 3)}${T(120, 120, "振動幅度大 → 聲音大", "s-accent-text")}
  ${L(20, 170, 220, 170, "s-grid")}${wave(20, 170, 200, 10, 3)}${T(120, 205, "振動幅度小 → 聲音小", "s-small")}
  ${L(250, 70, 450, 70, "s-grid")}${wave(250, 70, 200, 20, 7, "s-chem-line")}${T(350, 120, "振動得快 → 聲音高", "s-chem-text")}
  ${L(250, 170, 450, 170, "s-grid")}${wave(250, 170, 200, 20, 2, "s-chem-line")}${T(350, 205, "振動得慢 → 聲音低", "s-small")}
  ${T(235, 226, "示意圖：用線條表示物體來回振動的情形", "s-tiny")}
</svg>`;

  // ---------- 五上 2 光的折射：水中的吸管 ----------
  const refraction = `<svg viewBox="0 0 460 220" width="460" role="img" aria-label="吸管放在水中，看起來在水面處折斷">
  ${R(60, 90, 140, 110, "s-water")}${P("M60,40 L60,200 L200,200 L200,40", "s-glass")}${L(60, 90, 200, 90, "s-guide")}
  ${L(80, 20, 130, 90, "s-rod")}${L(130, 90, 190, 140, "s-rod")}${L(130, 90, 170, 166, "s-warn-line")}
  ${T(240, 50, "從旁邊看：吸管在水面", "s-text", "start")}${T(240, 72, "好像折斷了", "s-text", "start")}
  ${T(240, 110, "紅色虛線：吸管實際的位置", "s-small", "start")}
  ${T(240, 150, "光從水中斜斜進入空氣時，", "s-accent-text", "start")}${T(240, 172, "前進方向會偏折（折射）", "s-accent-text", "start")}
</svg>`;

  // ---------- 五上 2 放大鏡聚光 ----------
  const magnifier = (() => {
    let rays = "";
    [-36, -18, 0, 18, 36].forEach(dy => { rays += L(20, 100 + dy, 160, 100 + dy, "s-ray") + L(160, 100 + dy, 280, 100, "s-ray"); });
    return `<svg viewBox="0 0 520 210" width="520" role="img" aria-label="放大鏡把陽光聚集成一個亮點">
  ${rays}<ellipse cx="160" cy="100" rx="12" ry="56" class="s-lens"/>${C(280, 100, 6, "s-sun")}
  ${T(60, 40, "陽光（平行光）", "s-small")}${T(160, 180, "放大鏡（中間厚、邊緣薄）", "s-small")}
  ${T(300, 90, "光聚集成", "s-text", "start")}${T(300, 112, "又小又亮的點", "s-text", "start")}
  ${T(300, 150, "⚠ 不可以用放大鏡看太陽，", "s-chem-text", "start")}${T(300, 172, "也不可以對著人或易燃物", "s-chem-text", "start")}
</svg>`;
  })();

  // ---------- 五上 2 陽光分出色光 ----------
  const prism = (() => {
    const colors = ["#e03131", "#f76707", "#f59f00", "#2f9e44", "#1c7ed6", "#3b5bdb", "#7048e8"];
    const names = ["紅", "橙", "黃", "綠", "藍", "靛", "紫"];
    let s = "";
    colors.forEach((c, i) => { const y = 70 + i * 16; s += `<line x1="240" y1="${100 + i * 3}" x2="400" y2="${y}" stroke="${c}" stroke-width="3"/>` + `<text x="408" y="${y + 5}" class="s-small">${names[i]}</text>`; });
    return `<svg viewBox="0 0 460 220" width="460" role="img" aria-label="陽光經過三稜鏡分成好幾種顏色的色光">
  ${L(20, 110, 200, 110, "s-white-ray")}${poly([[180, 170], [260, 170], [220, 60]], "s-prism")}${s}
  ${T(80, 96, "陽光（白光）", "s-small")}${T(220, 194, "三稜鏡", "s-small")}
  ${T(230, 214, "陽光是由很多種顏色的光組成；彩虹也是同樣的道理", "s-tiny")}
</svg>`;
  })();

  // ---------- 五上 3 夏天和冬天太陽在天空的路徑（臺灣） ----------
  const sunPath = (() => {
    const cx = 230, cy = 170, rx = 190, ry = 50;
    // 地平面橢圓上的方位：0° 東（右）、90° 南（前）、180° 西（左）、270° 北（後）
    const at = deg => [cx + rx * Math.cos(deg * Math.PI / 180), cy + ry * Math.sin(deg * Math.PI / 180)];
    const arc = (rise, set, top, cls) => { const a = at(rise), b = at(set); return P(`M${r1(a[0])},${r1(a[1])} Q${cx},${top} ${r1(b[0])},${r1(b[1])}`, cls); };
    return `<svg viewBox="0 0 470 300" width="470" role="img" aria-label="臺灣夏天和冬天太陽在天空中移動的路徑">
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="s-earth-soft"/>
  ${arc(-30, 210, -10, "s-chem-line")}${arc(0, 180, 60, "s-ok-line")}${arc(30, 150, 120, "s-accent-line")}
  ${C(cx, cy, 5, "s-dot")}${T(cx, cy + 20, "觀察者", "s-small")}
  ${T(cx + rx + 6, cy + 5, "東", "s-text", "start")}${T(cx - rx - 6, cy + 5, "西", "s-text", "end")}${T(cx, cy + ry + 20, "南", "s-text")}${T(cx, cy - ry - 6, "北", "s-small")}
  ${T(20, 254, "紅：夏至，從東北方升起、西北方落下，中午最高，白天最長", "s-chem-text", "start")}
  ${T(20, 274, "綠：春分、秋分，從正東升起、正西落下", "s-small", "start")}
  ${T(20, 294, "藍：冬至，從東南方升起、西南方落下，中午最低，白天最短", "s-accent-text", "start")}
</svg>`;
  })();

  // ---------- 五上 3 太陽系 ----------
  const solarSystem = (() => {
    const pl = [["水星", 5], ["金星", 8], ["地球", 8], ["火星", 6], ["木星", 18], ["土星", 15], ["天王星", 11], ["海王星", 11]];
    let s = "", x = 80;
    pl.forEach(([n, r], i) => { x += i ? 26 + r : 18 + r; s += C(x, 100, r, i === 2 ? "s-ocean" : "s-earth-soft") + (n === "土星" ? `<ellipse cx="${x}" cy="100" rx="${r + 9}" ry="4" class="s-guide"/>` : "") + T(x, 100 + (i % 2 ? 44 : -28), n, "s-small"); x += r; });
    return `<svg viewBox="0 0 520 190" width="520" role="img" aria-label="太陽系八大行星的順序">
  ${P("M0,30 A90,90 0 0 1 0,170 Z", "s-sun")}${T(30, 104, "太陽", "s-text")}${s}
  ${T(260, 176, "離太陽由近到遠；大小與距離都不是真實比例", "s-tiny")}
</svg>`;
  })();

  // ---------- 五上 3 用北斗七星找北極星 ----------
  const dipper = (o) => {
    // 0–2 杓柄、3–6 杓身；5、6 是杓口的兩顆「指極星」，從 5 往 6 的方向延長約 5 倍就是北極星
    const st = [[40, 150], [80, 160], [115, 170], [150, 180], [160, 210], [210, 205], [215, 178]];
    const pole = [st[6][0] + (st[6][0] - st[5][0]) * 5, st[6][1] + (st[6][1] - st[5][1]) * 5];
    let s = "";
    [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]].forEach(([a, b]) => { s += L(st[a][0], st[a][1], st[b][0], st[b][1], "s-guide"); });
    st.forEach(p => s += C(p[0], p[1], 5, "s-sun"));
    if (o.q) {
      const lab = [["甲", st[0]], ["乙", st[5]], ["丙", pole], ["丁", [110, 60]]];
      s += C(pole[0], pole[1], 6, "s-sun") + C(110, 60, 5, "s-sun");
      lab.forEach(([n, p]) => s += T(p[0] + 12, p[1] + 5, n, "s-text", "start"));
      return `<svg viewBox="0 0 360 250" width="360" role="img" aria-label="北方夜空中的幾顆星，標有甲乙丙丁">${s}${T(180, 244, "北方的天空", "s-small")}</svg>`;
    }
    s += L(st[5][0], st[5][1], pole[0], pole[1], "s-warn-line") + C(pole[0], pole[1], 7, "s-sun");
    return `<svg viewBox="0 0 360 250" width="360" role="img" aria-label="用北斗七星的指極星找到北極星">${s}
  ${T(pole[0] + 12, pole[1] + 6, "北極星", "s-accent-text", "start")}${T(110, 232, "北斗七星", "s-text")}
  ${T(232, 120, "杓口兩顆星（指極星）", "s-small", "start")}${T(232, 138, "連線往外延長約 5 倍", "s-small", "start")}
</svg>`;
  };
  const bigDipper = dipper({});
  const qDipper = dipper({ q: true });

  // ---------- 五上 4 燃燒三要素 ----------
  const fireTriangle = `<svg viewBox="0 0 520 230" width="520" role="img" aria-label="燃燒三要素：可燃物、助燃物、溫度達到燃點">
  ${poly([[230, 30], [90, 200], [370, 200]], "s-warm")}
  ${P("M230,170 C200,150 210,120 230,95 C232,120 250,130 245,150 C258,140 255,125 252,118 C268,140 262,165 230,170 Z", "s-flame")}
  ${T(230, 22, "溫度達到燃點", "s-chem-text")}${T(80, 220, "可燃物（木材、紙）", "s-text")}${T(380, 220, "助燃物（氧氣）", "s-text")}
  ${T(395, 90, "少了任何一個", "s-small", "start")}${T(395, 110, "就燒不起來", "s-small", "start")}
</svg>`;

  // ---------- 五上 4 蓋上杯子的蠟燭 ----------
  const candleJar = (() => {
    const candle = (x) => `${R(x - 8, 150, 16, 50, "s-wax")}${L(x, 150, x, 140, "s-line")}`;
    return `<svg viewBox="0 0 460 240" width="460" role="img" aria-label="蓋上杯子的蠟燭過一會兒熄滅">
  ${candle(110)}${P("M110,138 C100,128 104,112 110,100 C116,112 120,128 110,138 Z", "s-flame")}
  ${candle(320)}${P("M260,200 L260,90 Q260,70 280,70 L360,70 Q380,70 380,90 L380,200", "s-glass")}
  ${T(110, 226, "沒有蓋杯子：繼續燃燒", "s-small")}${T(320, 226, "蓋上杯子：過一會兒熄滅", "s-small")}
  ${T(320, 120, "杯子裡的氧氣", "s-tiny")}${T(320, 134, "用完了", "s-tiny")}
</svg>`;
  })();

  // ---------- 五上 4 鐵生鏽的條件 ----------
  const rust = (o) => {
    const tube = x => `<path d="M${x - 18},40 L${x - 18},190 Q${x},212 ${x + 18},190 L${x + 18},40" class="s-glass"/>`;
    const nail = (x, rusty) => `<rect x="${x - 2}" y="70" width="4" height="122" class="s-metal"/><rect x="${x - 6}" y="66" width="12" height="5" class="s-metal"/>` + (rusty ? `<rect x="${x - 4}" y="104" width="8" height="10" class="s-rust"/><rect x="${x - 4}" y="120" width="8" height="8" class="s-rust"/>` : "");
    const lab = o.q ? ["甲", "乙", "丙"] : ["甲：乾燥的空氣", "乙：一半泡水", "丙：煮過的水＋油"];
    return `<svg viewBox="0 0 480 ${o.q ? 270 : 260}" width="480" role="img" aria-label="三支試管裡的鐵釘：乾燥空氣、一半泡在水中、泡在煮過並加油封住的水中">
  ${tube(90)}<rect x="74" y="28" width="32" height="13" rx="3" class="s-stopper"/>${nail(90, false)}<circle cx="82" cy="188" r="5" class="s-stone"/><circle cx="96" cy="190" r="5" class="s-stone"/>
  ${tube(240)}<path d="M224,120 L224,190 Q240,208 256,190 L256,120 Z" class="s-water"/>${nail(240, !o.q)}
  ${tube(390)}<rect x="374" y="28" width="32" height="13" rx="3" class="s-stopper"/><path d="M374,74 L374,190 Q390,208 406,190 L406,74 Z" class="s-water"/><rect x="374" y="60" width="32" height="14" class="s-oil"/>${nail(390, false)}
  ${T(90, 232, lab[0])}${T(240, 232, lab[1])}${T(390, 232, lab[2])}
  ${o.q ? T(240, 258, "甲：放乾燥劑；乙：鐵釘一半在水中、一半在空氣中；丙：水煮沸後放涼再用油封住", "s-tiny")
      : `${T(90, 252, "不易生鏽", "s-small")}${T(240, 252, "生鏽（水面附近最明顯）", "s-chem-text")}${T(390, 252, "不易生鏽", "s-small")}`}
</svg>`;
  };
  const rustTubes = rust({});
  const qRustTubes = rust({ q: true });

  // ================= 看圖題（圖上不寫答案） =================
  const qSunPath = (() => {
    const cx = 200, cy = 150, rx = 170, ry = 45;
    const at = deg => [cx + rx * Math.cos(deg * Math.PI / 180), cy + ry * Math.sin(deg * Math.PI / 180)];
    const arc = (rise, set, top, cls) => { const a = at(rise), b = at(set); return P(`M${r1(a[0])},${r1(a[1])} Q${cx},${top} ${r1(b[0])},${r1(b[1])}`, cls); };
    return `<svg viewBox="0 0 400 220" width="400" role="img" aria-label="臺灣某地看到的兩條太陽路徑甲和乙">
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="s-earth-soft"/>${arc(-30, 210, -10, "s-accent-line")}${arc(30, 150, 110, "s-accent-line")}
  ${C(cx, cy, 5, "s-dot")}${T(cx + rx + 6, cy + 5, "東", "s-text", "start")}${T(cx - rx - 6, cy + 5, "西", "s-text", "end")}${T(cx, cy + ry + 18, "南", "s-text")}${T(cx, cy - ry - 6, "北", "s-small")}
  ${T(cx, 46, "甲", "s-accent-text")}${T(cx, 132, "乙", "s-accent-text")}
</svg>`;
  })();

  window.FIG = { fig, beakFood, soundWaves, refraction, magnifier, prism, sunPath, solarSystem, bigDipper, fireTriangle, candleJar, rustTubes,
    qDipper, qRustTubes, qSunPath,
    _: { r1, T, L, R, C, P, poly, defs, A, wave } };
})();
