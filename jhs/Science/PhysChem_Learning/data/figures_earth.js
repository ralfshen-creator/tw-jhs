/*
 * 地球科學（九年級）課文圖解（2026-10-11）。課文用的圖會標出答案；考題用的圖（q 開頭）答案改成甲、乙、丙等代號。
 * 需在 figures.js 之後、curriculum_earth.js 之前載入。
 */
(function () {
  const F = window.FIG;
  const mk = (id, cls) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" class="${cls}"/></marker>`;
  const defs = id => `<defs>${mk(id + "a", "s-accent-fill")}${mk(id + "e", "s-earth-fill")}${mk(id + "r", "s-chem-fill")}</defs>`;
  const T = (x, y, s, cls, anchor) => `<text x="${x}" y="${y}" text-anchor="${anchor || "middle"}" class="${cls || "s-text"}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls || "s-guide"}"/>`;
  const A = (id, x1, y1, x2, y2, kind) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${kind === "e" ? "s-earth-arrow" : kind === "r" ? "s-chem-arrow" : "s-arrow"}" marker-end="url(#${id}${kind || "a"})"/>`;
  const box = (x, y, w, h, s, cls, tcls) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" class="${cls || "s-node"}"/>${T(x + w / 2, y + h / 2 + 5, s, tcls || "s-text")}`;
  const r1 = n => Math.round(n * 10) / 10;

  // ---------- 5-1 地球上的水 ----------
  F.earthWater = `<svg viewBox="0 0 460 170" width="460" role="img" aria-label="地球上水的分布比例">
  <rect x="20" y="40" width="397" height="40" class="s-ocean"/><rect x="417" y="40" width="23" height="40" class="s-cold"/>
  ${T(218, 66, "海水 約 97.5%", "s-text")}${L(428, 82, 428, 90)}${T(440, 104, "淡水 約 2.5%", "s-small", "end")}
  <rect x="20" y="130" width="300" height="26" class="s-cold"/><rect x="320" y="130" width="90" height="26" class="s-water"/><rect x="410" y="130" width="30" height="26" class="s-leaf"/>
  ${T(170, 148, "冰川（最多）", "s-small")}${T(365, 148, "地下水", "s-small")}
  ${T(230, 24, "地球上的水", "s-text")}${T(20, 124, "淡水再分：", "s-small", "start")}${T(440, 124, "湖、河", "s-small", "end")}
</svg>`;

  // ---------- 5-3 岩石循環 ----------
  F.earthRockCycle = `<svg viewBox="0 0 460 290" width="460" role="img" aria-label="三大類岩石的循環">${defs("rc")}
  ${box(170, 16, 120, 40, "沉積岩", "s-sand")}${box(20, 214, 120, 40, "火成岩", "s-magma")}${box(320, 214, 120, 40, "變質岩", "s-rock")}
  ${box(170, 130, 120, 36, "岩漿", "s-magma")}
  ${A("rc", 120, 210, 178, 60, "e")}${T(118, 126, "風化、侵蝕、", "s-small", "end")}${T(118, 144, "搬運、沉積、壓密", "s-small", "end")}
  ${A("rc", 280, 60, 360, 208, "e")}${T(338, 120, "高溫、高壓", "s-small", "start")}
  ${A("rc", 330, 212, 292, 166, "r")}${T(300, 202, "熔融", "s-small", "end")}${T(230, 280, "任何岩石熔融都會變成岩漿；岩漿冷卻凝固就成為火成岩", "s-small")}
  ${A("rc", 200, 168, 120, 210, "r")}${T(172, 208, "冷卻凝固", "s-small", "start")}
</svg>`;

  // ---------- 6-1 地球內部構造 ----------
  F.earthLayers = (() => {
    const cx = 170, cy = 250;
    const ring = (r, cls) => `<path d="M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy} Z" class="${cls}"/>`;
    return `<svg viewBox="0 0 500 270" width="500" role="img" aria-label="地球內部的分層構造">
  ${ring(220, "s-rock")}${ring(200, "s-earth-soft")}${ring(110, "s-magma")}${ring(56, "s-sun")}
  ${L(cx, cy - 214, 400, 30)}${T(404, 34, "地殼（最薄）", "s-text", "start")}
  ${L(cx + 120, cy - 120, 400, 90)}${T(404, 94, "地函", "s-text", "start")}
  ${L(cx + 70, cy - 60, 400, 150)}${T(404, 154, "外核（液態）", "s-text", "start")}
  ${L(cx + 24, cy - 30, 400, 210)}${T(404, 214, "內核（固態）", "s-text", "start")}
  ${T(cx, cy - 4, "地心", "s-small")}
</svg>`;
  })();

  // ---------- 6-1 板塊交界 ----------
  F.earthPlates = `<svg viewBox="0 0 460 230" width="460" role="img" aria-label="張裂性與聚合性板塊交界">${defs("pl")}
  <rect x="20" y="90" width="90" height="34" class="s-rock"/><rect x="124" y="90" width="90" height="34" class="s-rock"/>
  <rect x="20" y="124" width="194" height="60" class="s-magma"/><path d="M110,124 L117,96 L124,124 Z" class="s-magma"/>
  ${A("pl", 96, 80, 40, 80, "e")}${A("pl", 138, 80, 194, 80, "e")}
  ${T(117, 30, "張裂性交界", "s-text")}${T(117, 50, "（中洋脊、裂谷）", "s-small")}${T(117, 206, "岩漿上升，產生新的地殼", "s-small")}
  <path d="M250,90 L350,90 L350,124 L250,124 Z" class="s-rock"/><path d="M350,92 L440,82 L440,124 L370,124 Z" class="s-earth-soft"/>
  <path d="M250,124 L350,124 L380,184 L250,184 Z" class="s-magma"/><path d="M330,124 L380,184" class="s-line"/>
  ${A("pl", 268, 80, 324, 80, "e")}${A("pl", 432, 70, 376, 76, "e")}
  ${T(345, 30, "聚合性交界", "s-text")}${T(345, 50, "（海溝、山脈、島弧）", "s-small")}${T(345, 206, "一個板塊隱沒到另一個下方", "s-small")}
</svg>`;

  // ---------- 6-2 正斷層與逆斷層 ----------
  const faults = (q) => {
    const a = q ? "甲" : "正斷層：受張力，上盤下滑", b = q ? "乙" : "逆斷層：受擠壓，上盤上升";
    const blk = (ox, up) => {
      const d = up ? -24 : 24;
      return `<path d="M${ox},70 L${ox + 80},70 L${ox + 110},170 L${ox},170 Z" class="s-sand"/>` +
        `<path d="M${ox + 80},${70 + d} L${ox + 180},${70 + d} L${ox + 180},${170 + d} L${ox + 110},${170 + d} Z" class="s-earth-soft"/>` +
        `<line x1="${ox}" y1="110" x2="${ox + 92}" y2="110" class="s-tick"/><line x1="${ox + 92 + 0}" y1="${110 + d}" x2="${ox + 180}" y2="${110 + d}" class="s-tick"/>`;
    };
    return `<svg viewBox="0 0 460 260" width="460" role="img" aria-label="${q ? "兩種斷層的示意圖" : "正斷層與逆斷層"}">${defs(q ? "qf" : "fa")}
  ${blk(20, false)}${blk(250, true)}
  ${A(q ? "qf" : "fa", 70, 40, 20, 40, "e")}${A(q ? "qf" : "fa", 150, 40, 200, 40, "e")}
  ${A(q ? "qf" : "fa", 250, 30, 300, 30, "e")}${A(q ? "qf" : "fa", 430, 30, 380, 30, "e")}
  ${T(110, 230, a, q ? "s-text" : "s-earth-text")}${T(340, 230, b, q ? "s-text" : "s-earth-text")}
  ${q ? "" : T(230, 254, "斷面右邊那一塊是「上盤」；黑線是同一層岩層，用來看出錯動方向", "s-small")}
</svg>`;
  };
  F.earthFaults = faults(false);
  F.qEarthFaults = faults(true);

  // ---------- 6-3 地層疊置 ----------
  F.earthStrata = `<svg viewBox="0 0 460 240" width="460" role="img" aria-label="地層的疊置與化石">
  <rect x="40" y="40" width="240" height="40" class="s-sand"/><rect x="40" y="80" width="240" height="40" class="s-rock"/>
  <rect x="40" y="120" width="240" height="40" class="s-earth-soft"/><rect x="40" y="160" width="240" height="40" class="s-sand" style="fill-opacity:.9"/>
  <path d="M120,60 q8,-10 16,0 q-8,8 -16,0 Z" class="s-bio-soft"/><path d="M200,140 q10,-12 20,0 q-10,10 -20,0 Z" class="s-bio-soft"/>
  ${L(282, 60, 310, 60)}${T(316, 64, "最上層：年代最新", "s-text", "start")}
  ${L(282, 180, 310, 180)}${T(316, 184, "最下層：年代最老", "s-text", "start")}
  ${T(316, 120, "（沒有被翻轉時）", "s-small", "start")}
  ${T(160, 226, "疊置定律：先沉積的在下面，後沉積的在上面", "s-small")}
</svg>`;

  // ---------- 7-2 四季 ----------
  F.earthSeasons = (() => {
    const cx = 230, cy = 130, rx = 170, ry = 74;
    const earth = (x, y, label, sub) => `<circle cx="${x}" cy="${y}" r="16" class="s-ocean"/><line x1="${r1(x - 7)}" y1="${r1(y - 20)}" x2="${r1(x + 7)}" y2="${r1(y + 20)}" class="s-line"/>${T(x, y + (y > cy ? 40 : -26), label, "s-earth-text")}${sub ? T(x, y + (y > cy ? 58 : -44), sub, "s-small") : ""}`;
    return `<svg viewBox="0 0 460 300" width="460" role="img" aria-label="地球公轉與四季">
  <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="s-orbit"/><circle cx="${cx}" cy="${cy}" r="26" class="s-sun"/>${T(cx, cy + 5, "太陽", "s-small")}
  ${earth(cx - rx, cy, "", "")}${T(cx - rx, cy - 30, "冬至", "s-earth-text")}${T(cx - rx, cy + 40, "北半球", "s-small")}${T(cx - rx, cy + 56, "背向太陽", "s-small")}
  ${earth(cx + rx, cy, "", "")}${T(cx + rx, cy - 30, "夏至", "s-earth-text")}${T(cx + rx, cy + 40, "北半球", "s-small")}${T(cx + rx, cy + 56, "傾向太陽", "s-small")}
  ${earth(cx, cy + ry, "春分", "")}${earth(cx, cy - ry, "秋分", "")}
  ${T(cx, 270, "地軸傾斜約 23.5°，方向不變（圖中北極都朝左上），", "s-small")}${T(cx, 288, "所以太陽直射的位置會在南、北回歸線之間移動", "s-small")}
</svg>`;
  })();

  // ---------- 7-3 月相 ----------
  const moonPhases = (q) => {
    const cx = 230, cy = 165, R = 100;
    const names = ["新月", "眉月", "上弦月", "盈凸月", "滿月", "虧凸月", "下弦月", "殘月"];
    const qn = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛"];
    let s = "";
    // 太陽在右邊；位置 0 在地球右邊（日、月同方向 = 新月），逆時針排列
    for (let i = 0; i < 8; i++) {
      const ang = -i * Math.PI / 4, x = r1(cx + R * Math.cos(ang)), y = r1(cy + R * Math.sin(ang));
      // 月球受光的一半永遠朝右（太陽）
      s += `<circle cx="${x}" cy="${y}" r="13" class="s-moon-dark"/><path d="M${x},${y - 13} A13,13 0 0 1 ${x},${y + 13} Z" class="s-moon"/>`;
      const lx = r1(cx + (R + 32) * Math.cos(ang)), ly = r1(cy + (R + 32) * Math.sin(ang) + 5);
      s += T(lx, ly, q ? qn[i] : names[i], q ? "s-text" : "s-small");
    }
    // 課文版另外畫「從地球上看到的樣子」，和外圈的太空俯視分開（題目版不畫，避免提示答案）
    const look = (y, name, lit) => {
      const x = 500, r = 18;
      const shape = lit === "all" ? `<circle cx="${x}" cy="${y}" r="${r}" class="s-moon"/>`
        : `<circle cx="${x}" cy="${y}" r="${r}" class="s-moon-dark"/>` + (lit === "right" ? `<path d="M${x},${y - r} A${r},${r} 0 0 1 ${x},${y + r} Z" class="s-moon"/>` : lit === "left" ? `<path d="M${x},${y - r} A${r},${r} 0 0 0 ${x},${y + r} Z" class="s-moon"/>` : "");
      return shape + T(x + 28, y + 5, name, "s-small", "start");
    };
    const side = q ? "" : `<line x1="462" y1="40" x2="462" y2="300" class="s-guide"/>${T(530, 30, "從地球上看到的樣子", "s-small")}${T(530, 48, "（臺灣所在的北半球）", "s-tiny")}
  ${look(90, "新月", "none")}${look(150, "上弦月", "right")}${look(210, "滿月", "all")}${look(270, "下弦月", "left")}`;
    return `<svg viewBox="0 0 ${q ? 460 : 600} 350" width="${q ? 460 : 600}" role="img" aria-label="${q ? "月球繞地球的八個位置" : "月球在不同位置時從地球看到的月相"}">
  ${s}<circle cx="${cx}" cy="${cy}" r="22" class="s-ocean"/>${T(cx, cy + 5, "地球", "s-small")}
  ${T(14, 24, "太陽光從右邊照過來 →", "s-small", "start")}${side}
  ${T(230, 324, "從北極上空往下看，月球逆時針繞地球", "s-small")}${T(230, 342, "外圈是從太空俯視：白色的一半永遠朝向太陽，不是地球上看到的樣子", "s-small")}
</svg>`;
  };
  F.earthMoonPhases = moonPhases(false);
  F.qEarthMoonPhases = moonPhases(true);

  // ---------- 7-3 日食與月食 ----------
  F.earthEclipse = `<svg viewBox="0 0 460 210" width="460" role="img" aria-label="日食與月食時太陽、月球、地球的位置">
  ${T(230, 22, "日食：太陽 → 月球 → 地球（月球擋住太陽，發生在新月）", "s-text")}
  <circle cx="40" cy="64" r="26" class="s-sun"/><circle cx="250" cy="64" r="8" class="s-moon"/><circle cx="390" cy="64" r="22" class="s-ocean"/>
  <path d="M258,58 L380,62 L380,66 L258,70 Z" class="s-shade"/>${T(250, 96, "月球", "s-small")}${T(390, 104, "地球", "s-small")}
  ${T(230, 132, "月食：太陽 → 地球 → 月球（月球進入地球影子，發生在滿月）", "s-text")}
  <circle cx="40" cy="174" r="26" class="s-sun"/><circle cx="250" cy="174" r="22" class="s-ocean"/><circle cx="410" cy="174" r="8" class="s-moon"/>
  <path d="M272,160 L430,168 L430,180 L272,188 Z" class="s-shade"/>${T(250, 206, "地球", "s-small")}${T(410, 202, "月球", "s-small")}
</svg>`;

  // ---------- 九下 3-1 大氣分層 ----------
  F.earthAtmosphere = (() => {
    const X = t => 360 + t * 1.6, Y = h => 230 - h * 2;
    const prof = [[0, 15], [12, -56], [20, -56], [50, -2], [85, -90], [100, -70]].map(p => r1(X(p[1])) + "," + r1(Y(p[0]))).join(" ");
    const band = (h1, h2, name, cls) => `<rect x="20" y="${Y(h2)}" width="160" height="${Y(h1) - Y(h2)}" class="${cls}"/>${T(100, (Y(h1) + Y(h2)) / 2 + 5, name, "s-text")}`;
    return `<svg viewBox="0 0 460 260" width="460" role="img" aria-label="大氣的分層與溫度變化">
  ${band(0, 12, "對流層（天氣變化）", "s-cold")}${band(12, 50, "平流層（臭氧層）", "s-sky")}${band(50, 85, "中氣層", "s-water")}${band(85, 100, "增溫層", "s-warm")}
  <line x1="${X(-100)}" y1="${Y(0)}" x2="${X(40)}" y2="${Y(0)}" class="s-line"/><line x1="${X(0)}" y1="${Y(0)}" x2="${X(0)}" y2="${Y(100)}" class="s-tick"/>
  <polyline points="${prof}" class="s-earth-line"/>
  ${T(X(-100), Y(0) + 20, "−100", "s-small")}${T(X(0), Y(0) + 20, "0", "s-small")}${T(X(40), Y(0) + 20, "40 °C", "s-small", "end")}
  ${T(20, 16, "高度約 0～100 km（未依比例）", "s-small", "start")}
</svg>`;
  })();

  // ---------- 九下 3-3 冷鋒 ----------
  F.earthColdFront = `<svg viewBox="0 0 460 230" width="460" role="img" aria-label="冷鋒的剖面">${defs("cf")}
  <path d="M20,200 L20,90 Q120,110 230,200 Z" class="s-cold"/>
  <path d="M230,200 Q120,110 20,90 L20,30 L440,30 L440,200 Z" class="s-warm" style="fill-opacity:.2"/>
  <path d="M150,70 q12,-22 34,-12 q14,-18 32,0 q22,-6 24,14 q-2,12 -18,12 h-60 q-16,0 -12,-14 Z" class="s-node-main"/>
  ${[0, 1, 2, 3].map(i => `<line x1="${158 + i * 16}" y1="90" x2="${150 + i * 16}" y2="110" class="s-vein-line" style="stroke-width:2"/>`).join("")}
  ${A("cf", 50, 170, 130, 170, "a")}${A("cf", 320, 120, 270, 70, "r")}
  ${T(80, 160, "冷氣團", "s-accent-text")}${T(350, 140, "暖空氣被抬升", "s-chem-text")}
  ${T(230, 222, "冷氣團推著暖空氣：鋒面通過時下雨、之後氣溫下降", "s-small")}
</svg>`;

  // ---------- 九下 4-2 溫室效應 ----------
  F.earthGreenhouse = `<svg viewBox="0 0 480 230" width="480" role="img" aria-label="溫室效應">${defs("gh")}
  <rect x="20" y="180" width="440" height="40" class="s-earth-soft"/>${T(240, 206, "地表（吸收陽光變暖，放出紅外線）", "s-text")}
  <path d="M20,90 Q240,60 460,90" class="s-guide" style="stroke-width:2"/>${T(476, 108, "虛線：溫室氣體", "s-small", "end")}
  <circle cx="50" cy="34" r="20" class="s-sun"/>
  ${A("gh", 62, 54, 128, 176, "r")}${T(88, 130, "陽光", "s-chem-text", "end")}
  ${A("gh", 170, 176, 200, 50, "a")}${T(208, 44, "一部分散到太空", "s-small", "start")}
  ${A("gh", 260, 176, 300, 98, "a")}${A("gh", 302, 98, 340, 174, "a")}
  ${T(350, 134, "其餘被溫室氣體吸收，", "s-small", "start")}${T(350, 152, "再放回地表", "s-small", "start")}
</svg>`;
})();
