/*
 * 課文圖解（2026-10-12）：補八下、九上、九下與八上少數小節的圖。擴充 window.FIG，需在 figures4.js 之後載入。
 * 這些圖只用在課文，不用在考題，避免學生先看課文就看到題目答案。
 */
(function () {
  const F = window.FIG;
  // 箭頭：每張圖用不同的 id，避免同一頁多張圖互相干擾
  const mk = (id, cls) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" class="${cls}"/></marker>`;
  const defs = id => `<defs>${mk(id + "a", "s-accent-fill")}${mk(id + "c", "s-chem-fill")}</defs>`;
  const arr = (id, x1, y1, x2, y2, chem) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${chem ? "s-chem-arrow" : "s-arrow"}" marker-end="url(#${id}${chem ? "c" : "a"})"/>`;
  const T = (x, y, s, cls, anchor) => `<text x="${x}" y="${y}" text-anchor="${anchor || "middle"}" class="${cls || "s-text"}">${s}</text>`;
  const H = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 10}" class="s-atom-h"/>`;
  const O = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 14}" class="s-atom-o"/>`;
  const C = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 12}" class="s-atom-c"/>`;
  const bulb = (x, y) => `<circle cx="${x}" cy="${y}" r="13" class="s-board"/><path d="M${x - 7},${y - 7} L${x + 7},${y + 7} M${x - 7},${y + 7} L${x + 7},${y - 7}" class="s-tick"/>`;
  // 電池：水平導線上，長板（+）在右
  const cellH = (x, y) => `<line x1="${x - 5}" y1="${y - 8}" x2="${x - 5}" y2="${y + 8}" class="s-line"/><line x1="${x + 5}" y1="${y - 14}" x2="${x + 5}" y2="${y + 14}" class="s-line"/>`;

  // ---------- 八上 0 酒精燈火焰 ----------
  F.lampFlame = `<svg viewBox="0 0 470 250" width="470" role="img" aria-label="酒精燈火焰的構造">
  <path d="M120,232 L240,232 Q252,182 180,172 Q108,182 120,232 Z" class="s-glass-fill"/>
  <rect x="170" y="150" width="20" height="24" class="s-board"/>
  <path d="M180,150 Q132,104 180,18 Q228,104 180,150 Z" class="s-flame"/>
  <path d="M180,148 Q154,110 180,58 Q206,110 180,148 Z" style="fill:#ffd54f;fill-opacity:.9"/>
  <path d="M180,146 Q168,126 180,100 Q192,126 180,146 Z" style="fill:#90caf9"/>
  <line x1="208" y1="64" x2="262" y2="52" class="s-guide"/>${T(266, 50, "外焰：燃燒最完全，溫度最高", "s-text", "start")}${T(266, 70, "加熱時用這一層", "s-small", "start")}
  <line x1="196" y1="96" x2="262" y2="104" class="s-guide"/>${T(266, 108, "內焰", "s-text", "start")}
  <line x1="186" y1="128" x2="262" y2="146" class="s-guide"/>${T(266, 150, "焰心：溫度最低", "s-text", "start")}
</svg>`;

  // ---------- 八上 5-2 熱的流動與熱平衡 ----------
  F.heatFlow = (() => {
    const scene = (x0, tIn, tOut, arrows, title) => `
  <path d="M${x0 + 10},70 L${x0 + 10},190 L${x0 + 190},190 L${x0 + 190},70" class="s-glass"/><rect x="${x0 + 12}" y="100" width="176" height="88" class="s-water"/>
  <path d="M${x0 + 70},60 L${x0 + 70},170 L${x0 + 130},170 L${x0 + 130},60" class="s-glass"/><rect x="${x0 + 72}" y="90" width="56" height="78" style="fill:#e53935;fill-opacity:${arrows ? ".35" : ".18"}"/>
  ${T(x0 + 100, 118, tIn[0], "s-small")}${T(x0 + 100, 140, tIn[1])}${T(x0 + 40, 180, tOut, "s-small")}
  ${arrows ? arr("hf", x0 + 70, 150, x0 + 40, 150, true) + arr("hf", x0 + 130, 150, x0 + 160, 150, true) + T(x0 + 100, 52, "熱由高溫流向低溫", "s-chem-text") : T(x0 + 100, 52, "溫度相同，熱不再流動", "s-accent-text")}
  ${T(x0 + 100, 220, title)}`;
    return `<svg viewBox="0 0 460 235" width="460" role="img" aria-label="熱的流動與熱平衡">${defs("hf")}
  ${scene(10, ["熱水", "80 °C"], "冷水 20 °C", true, "① 剛放進去")}${scene(250, ["熱水", "40 °C"], "冷水 40 °C", false, "② 達到熱平衡")}
</svg>`;
  })();

  // ---------- 八上 6-1 元素、化合物、混合物的粒子模型 ----------
  F.particleKinds = (() => {
    const box = (x0, title, sub, inner) => `<rect x="${x0}" y="30" width="140" height="120" rx="10" class="s-board"/>${inner}${T(x0 + 70, 172, title)}${T(x0 + 70, 192, sub, "s-small")}`;
    const o2 = (x, y) => O(x, y, 10) + O(x + 18, y, 10);
    const h2o = (x, y) => O(x, y, 11) + H(x - 12, y + 10, 7) + H(x + 12, y + 10, 7);
    const h2 = (x, y) => H(x, y, 8) + H(x + 15, y, 8);
    return `<svg viewBox="0 0 470 205" width="470" role="img" aria-label="元素、化合物與混合物的粒子模型">
  ${box(10, "元素（氧氣）", "只有一種原子", o2(35, 60) + o2(90, 60) + o2(50, 110) + o2(100, 115))}
  ${box(165, "化合物（水）", "不同原子以固定比例結合", h2o(200, 60) + h2o(260, 60) + h2o(215, 115) + h2o(270, 118))}
  ${box(320, "混合物", "好幾種分子混在一起", o2(340, 60) + h2o(410, 62) + h2(350, 115) + h2o(420, 118))}
</svg>`;
  })();

  // ---------- 八下 1-1 密閉與開口容器 ----------
  F.massSealed = `<svg viewBox="0 0 480 240" width="480" role="img" aria-label="密閉容器與開口容器中的質量變化">${defs("ms")}
  ${T(100, 28, "密閉容器", "s-accent-text")}${T(370, 28, "開口容器", "s-chem-text")}
  <path d="M90,62 L90,100 L60,170 L140,170 L110,100 L110,62" class="s-glass"/><rect x="85" y="50" width="30" height="13" rx="3" class="s-stopper"/>
  <path d="M70,150 L130,150 L140,170 L60,170 Z" class="s-water"/><circle cx="92" cy="140" r="4" class="s-bubble"/><circle cx="104" cy="128" r="3" class="s-bubble"/><circle cx="98" cy="114" r="3" class="s-bubble"/>
  <rect x="40" y="172" width="120" height="26" rx="4" class="s-board"/>${T(100, 190, "60.0 g")}
  <path d="M330,92 L334,96 L334,170 L410,170 L410,94" class="s-glass"/><rect x="336" y="130" width="72" height="38" class="s-water"/>
  <circle cx="362" cy="80" r="5" class="s-bubble"/><circle cx="376" cy="60" r="5" class="s-bubble"/><circle cx="388" cy="42" r="5" class="s-bubble"/>
  ${arr("ms", 410, 80, 440, 46, true)}${T(436, 76, "CO₂", "s-chem-text", "start")}
  <rect x="310" y="172" width="120" height="26" rx="4" class="s-board"/>${T(370, 190, "55.6 g")}
  ${T(100, 222, "反應前後都是 60.0 g")}${T(370, 222, "氣體跑掉 4.4 g")}
</svg>`;

  // ---------- 八下 1-2 反應式的粒子模型 ----------
  F.eqModel = `<svg viewBox="0 0 460 215" width="460" role="img" aria-label="氫氣燃燒的粒子模型">${defs("eq")}
  ${H(280, 22, 7)}${T(292, 27, "氫原子", "s-small", "start")}${O(370, 22, 8)}${T(384, 27, "氧原子", "s-small", "start")}
  ${H(40, 82)}${H(60, 82)}${H(40, 130)}${H(60, 130)}${T(95, 112, "+", "s-big")}${O(130, 106)}${O(158, 106)}
  ${arr("eq", 192, 106, 250, 106)}
  ${O(300, 92)}${H(283, 108)}${H(317, 108)}${O(390, 92)}${H(373, 108)}${H(407, 108)}
  ${T(50, 168, "2H₂")}${T(144, 168, "O₂")}${T(345, 168, "2H₂O")}
  ${T(100, 200, "H 4 個、O 2 個", "s-accent-text")}${T(345, 200, "H 4 個、O 2 個", "s-accent-text")}
</svg>`;

  // ---------- 八下 1-3 質量、莫耳、粒子數的換算 ----------
  F.moleMap = (() => {
    const node = (x, t1, t2) => `<rect x="${x}" y="52" width="110" height="64" rx="10" class="s-node"/>${T(x + 55, 80, t1)}${T(x + 55, 102, t2, "s-small")}`;
    return `<svg viewBox="0 0 530 180" width="530" role="img" aria-label="質量、莫耳數與粒子數的換算">${defs("mm")}
  ${node(10, "質量", "（g）")}${node(210, "莫耳數", "（mol）")}${node(410, "粒子數", "（個）")}
  ${arr("mm", 122, 72, 206, 72)}${T(164, 62, "÷ 分子量", "s-small")}${arr("mm", 206, 98, 122, 98, true)}${T(164, 122, "× 分子量", "s-small")}
  ${arr("mm", 322, 72, 406, 72)}${T(364, 62, "× 6×10²³", "s-small")}${arr("mm", 406, 98, 322, 98, true)}${T(364, 122, "÷ 6×10²³", "s-small")}
  ${T(265, 160, "例：36 g 水 ÷ 18 = 2 mol → 2 × 6×10²³ = 1.2×10²⁴ 個水分子")}
</svg>`;
  })();

  // ---------- 八下 2-1 燃燒的三個條件 ----------
  F.fireTriangle = `<svg viewBox="0 0 440 245" width="440" role="img" aria-label="燃燒的三個條件">
  <polygon points="220,48 90,186 350,186" class="s-node-chem"/>
  <path d="M220,178 Q196,150 220,104 Q244,150 220,178 Z" class="s-flame"/>
  ${T(220, 34, "助燃物（通常是氧氣）")}${T(90, 210, "可燃物")}${T(350, 210, "溫度達到燃點")}
  ${T(220, 236, "三個條件缺一個，火就會熄滅", "s-accent-text")}
</svg>`;

  // ---------- 八下 2-1 活性順序 ----------
  F.activity = (() => {
    const els = ["鉀", "鈉", "鈣", "鎂", "鋁", "碳", "鋅", "鐵", "錫", "鉛", "氫", "銅", "汞", "銀", "鉑", "金"];
    let s = "";
    els.forEach((e, i) => { const x = 8 + i * 32, nm = e === "碳" || e === "氫"; s += `<rect x="${x}" y="30" width="30" height="38" rx="4" class="${nm ? "s-node-chem" : "s-node"}"/>${T(x + 15, 55, e)}`; });
    return `<svg viewBox="0 0 530 120" width="530" role="img" aria-label="元素對氧的活性順序">${defs("ac")}${s}
  ${arr("ac", 250, 88, 18, 88)}${arr("ac", 270, 88, 510, 88)}
  ${T(130, 110, "活性大：容易和氧結合")}${T(400, 110, "活性小：不易和氧結合")}
</svg>`;
  })();

  // ---------- 八下 2-2 氧的轉移 ----------
  F.redoxPass = `<svg viewBox="0 0 440 210" width="440" role="img" aria-label="氧化銅與碳反應時氧的轉移">${defs("rp")}
  <circle cx="60" cy="96" r="17" class="s-metal"/>${T(60, 101, "Cu", "s-small")}${O(90, 96, 12)}
  ${T(125, 104, "+", "s-big")}${C(165, 96, 13)}
  <path d="M92,80 Q128,34 160,78" class="s-chem-arrow" marker-end="url(#rpc)"/>${T(126, 40, "氧被搶走", "s-chem-text")}
  ${arr("rp", 195, 96, 250, 96)}
  <circle cx="290" cy="96" r="17" class="s-metal"/>${T(290, 101, "Cu", "s-small")}${T(325, 104, "+", "s-big")}${O(360, 96, 11)}${C(383, 96, 12)}${O(406, 96, 11)}
  ${T(64, 142, "CuO 失去氧")}${T(64, 162, "被還原（氧化劑）", "s-small")}
  ${T(182, 142, "C 得到氧")}${T(182, 162, "被氧化（還原劑）", "s-small")}
  ${T(345, 142, "2CuO + C → 2Cu + CO₂", "s-small")}
  ${T(220, 196, "氧從氧化銅「傳」到碳：一方失去，一方得到，同時發生", "s-accent-text")}
</svg>`;

  // ---------- 八下 2-3 鐵釘生鏽實驗 ----------
  F.rustTubes = (() => {
    const tube = x => `<path d="M${x - 18},40 L${x - 18},190 Q${x},212 ${x + 18},190 L${x + 18},40" class="s-glass"/>`;
    const nail = x => `<rect x="${x - 2}" y="70" width="4" height="122" class="s-metal"/><rect x="${x - 6}" y="66" width="12" height="5" class="s-metal"/>`;
    return `<svg viewBox="0 0 480 260" width="480" role="img" aria-label="鐵釘生鏽的條件實驗">
  ${tube(90)}<rect x="74" y="28" width="32" height="13" rx="3" class="s-stopper"/>${nail(90)}<circle cx="82" cy="188" r="5" class="s-stone"/><circle cx="96" cy="190" r="5" class="s-stone"/>
  ${tube(240)}<path d="M224,120 L224,190 Q240,208 256,190 L256,120 Z" class="s-water"/>${nail(240)}<rect x="236" y="104" width="8" height="10" class="s-rust"/><rect x="236" y="118" width="8" height="8" class="s-rust"/><rect x="237" y="132" width="6" height="12" class="s-rust"/>
  ${tube(390)}<rect x="374" y="28" width="32" height="13" rx="3" class="s-stopper"/><path d="M374,74 L374,190 Q390,208 406,190 L406,74 Z" class="s-water"/><rect x="374" y="60" width="32" height="14" class="s-oil"/>${nail(390)}
  ${T(90, 232, "甲：乾燥空氣")}${T(240, 232, "乙：水＋空氣")}${T(390, 232, "丙：無氧的水＋油")}
  ${T(90, 252, "不易生鏽", "s-small")}${T(240, 252, "生鏽（水面附近最明顯）", "s-chem-text")}${T(390, 252, "不易生鏽", "s-small")}
</svg>`;
  })();

  // ---------- 八下 3-1 電解質導電實驗 ----------
  F.conductTest = `<svg viewBox="0 0 460 260" width="460" role="img" aria-label="電解質水溶液的導電實驗">${defs("ct")}
  <path d="M175,95 L175,40 L207,40" class="s-wire"/>${cellH(212, 40)}<path d="M217,40 L242,40" class="s-wire"/>
  ${bulb(255, 40)}<path d="M268,40 L285,40 L285,95" class="s-wire"/>
  <path d="M243,22 L238,14 M255,20 L255,10 M267,22 L272,14" class="s-chem-arrow"/>
  ${T(212, 70, "電池", "s-small")}
  <path d="M120,110 L124,114 L124,222 L336,222 L336,112" class="s-glass"/><rect x="126" y="140" width="208" height="80" class="s-water"/>
  <rect x="170" y="95" width="10" height="112" class="s-metal"/><rect x="280" y="95" width="10" height="112" class="s-metal"/>
  ${T(160, 108, "−", "s-minus", "end")}${T(302, 108, "+", "s-plus", "start")}
  <circle cx="236" cy="165" r="10" class="s-tint"/>${T(236, 170, "+", "s-small")}${arr("ct", 224, 165, 190, 165, true)}
  <circle cx="226" cy="198" r="10" class="s-node"/>${T(226, 203, "−", "s-small")}${arr("ct", 238, 198, 272, 198)}
  ${T(360, 165, "正離子（Na⁺）", "s-small", "start")}${T(360, 183, "游向負極", "s-small", "start")}
  ${T(360, 203, "負離子（Cl⁻）", "s-small", "start")}${T(360, 221, "游向正極", "s-small", "start")}
  ${T(230, 250, "食鹽水中的離子能自由移動，燈泡會亮；換成糖水，燈泡不亮", "s-accent-text")}
</svg>`;

  // ---------- 八下 3-3 pH 值 ----------
  F.phScale = (() => {
    let s = "";
    for (let v = 0; v <= 14; v++) { const x = 10 + v * 34, hue = Math.round(v / 14 * 240); s += `<rect x="${x}" y="58" width="34" height="34" style="fill:hsl(${hue},70%,62%)"/><text x="${x + 17}" y="81" text-anchor="middle" style="fill:#1f2430;font-size:15px">${v}</text>`; }
    const mark = (v, label, y) => { const x = 10 + (v + 0.5) * 34; return `<line x1="${x}" y1="${y + 4}" x2="${x}" y2="58" class="s-guide"/>${T(x, y, label, "s-small")}`; };
    return `<svg viewBox="0 0 530 160" width="530" role="img" aria-label="pH 值與生活中的物質">${defs("ph")}${s}
  ${mark(1.5, "胃液", 22)}${mark(2.5, "檸檬汁", 42)}${mark(7, "純水", 32)}${mark(9.5, "肥皂水", 32)}
  ${arr("ph", 220, 112, 14, 112, true)}${arr("ph", 310, 112, 516, 112)}${T(265, 117, "中性")}
  ${T(110, 132, "酸性愈強", "s-chem-text")}${T(420, 132, "鹼性愈強", "s-accent-text")}
  ${T(265, 154, "pH 每差 1，氫離子濃度相差 10 倍", "s-small")}
</svg>`;
  })();

  // ---------- 八下 4-1 碰撞與反應速率 ----------
  F.collision = (() => {
    const box = (x, pts, solid, label) => {
      let s = `<rect x="${x}" y="40" width="110" height="100" rx="8" class="s-board"/>`;
      pts.forEach(([a, b]) => { s += `<circle cx="${x + a}" cy="${40 + b}" r="5" class="s-particle"/>`; });
      return s + solid + T(x + 55, 162, label);
    };
    const few = [[20, 20], [80, 35], [50, 60]];
    const many = [[15, 15], [40, 22], [70, 14], [95, 26], [25, 45], [55, 40], [85, 50], [18, 70], [48, 66], [78, 72]];
    const mid = [[20, 18], [60, 14], [92, 22], [35, 45], [75, 42], [15, 62], [95, 60]];
    const slab = x => `<rect x="${x + 2}" y="118" width="106" height="20" class="s-stone"/>`;
    const lump = x => `<rect x="${x + 35}" y="88" width="40" height="40" class="s-stone"/>`;
    let bits = ""; [[12, 78], [36, 92], [62, 80], [86, 96], [24, 112], [50, 118], [76, 112], [98, 120]].forEach(([a, b]) => { bits += `<rect x="${395 + a - 6}" y="${b + 2}" width="12" height="12" class="s-stone"/>`; });
    return `<svg viewBox="0 0 520 210" width="520" role="img" aria-label="濃度與接觸面積對碰撞次數的影響">
  ${T(130, 26, "① 濃度", "s-accent-text")}${T(395, 26, "② 接觸面積", "s-accent-text")}
  ${box(10, few, slab(10), "濃度小")}${box(140, many, slab(140), "濃度大：碰撞多")}
  ${box(280, mid, lump(280), "塊狀")}${box(405, mid, bits, "粉末：接觸面大")}
  ${T(260, 196, "藍色是溶液中的粒子，灰色是固體。碰撞次數愈多，反應愈快", "s-small")}
</svg>`;
  })();

  // ---------- 八下 4-2 動態平衡 ----------
  F.dynEq = `<svg viewBox="0 0 380 245" width="380" role="img" aria-label="密閉瓶中水的動態平衡">${defs("de")}
  <rect x="150" y="26" width="80" height="14" rx="3" class="s-board"/>
  <path d="M130,48 L130,200 L250,200 L250,48 Z" class="s-glass"/><rect x="132" y="140" width="116" height="58" class="s-water"/>
  <circle cx="150" cy="70" r="4" class="s-particle"/><circle cx="200" cy="62" r="4" class="s-particle"/><circle cx="228" cy="90" r="4" class="s-particle"/><circle cx="172" cy="104" r="4" class="s-particle"/><circle cx="214" cy="120" r="4" class="s-particle"/>
  ${arr("de", 160, 150, 160, 92)}${arr("de", 220, 92, 220, 150, true)}
  ${T(120, 120, "蒸發", "s-accent-text", "end")}${T(260, 120, "凝結", "s-chem-text", "start")}
  ${T(190, 226, "兩邊速率相等 → 水量不再改變，但變化一直在進行", "s-small")}
</svg>`;

  // ---------- 八下 5-1 烷類的結構 ----------
  F.alkanes = (() => {
    const alk = (n, x0) => {
      let s = "", y = 76;
      const xs = []; for (let i = 0; i < n; i++) xs.push(x0 + i * 40);
      s += `<line x1="${xs[0] - 32}" y1="${y}" x2="${xs[n - 1] + 32}" y2="${y}" class="s-tick"/>`;
      xs.forEach(x => { s += `<line x1="${x}" y1="${y - 32}" x2="${x}" y2="${y + 32}" class="s-tick"/>`; });
      xs.forEach(x => { s += C(x, y, 12) + H(x, y - 34, 8) + H(x, y + 34, 8); });
      s += H(xs[0] - 34, y, 8) + H(xs[n - 1] + 34, y, 8);
      return s;
    };
    return `<svg viewBox="0 0 470 175" width="470" role="img" aria-label="甲烷、乙烷、丙烷的結構">
  ${alk(1, 50)}${alk(2, 160)}${alk(3, 320)}
  ${T(50, 140, "CH₄ 甲烷")}${T(180, 140, "C₂H₆ 乙烷")}${T(360, 140, "C₃H₈ 丙烷")}
  ${T(235, 166, "每個碳（黑）都和 4 個原子相連；氫（白）的數目 = 碳數 × 2 + 2", "s-small")}
</svg>`;
  })();

  // ---------- 八下 5-3 肥皂去汙 ----------
  F.soapMicelle = (() => {
    let ring = "";
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2, cx = 330, cy = 110;
      const hx = cx + 64 * Math.cos(a), hy = cy + 64 * Math.sin(a), tx = cx + 30 * Math.cos(a), ty = cy + 30 * Math.sin(a);
      ring += `<line x1="${hx.toFixed(1)}" y1="${hy.toFixed(1)}" x2="${tx.toFixed(1)}" y2="${ty.toFixed(1)}" class="s-tick"/><circle cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="7" class="s-node"/>`;
    }
    return `<svg viewBox="0 0 450 225" width="450" role="img" aria-label="肥皂分子把油汙包起來">
  <circle cx="40" cy="96" r="9" class="s-node"/><polyline points="49,96 59,88 69,104 79,88 89,104 99,88 109,104 119,96" class="s-tick"/>
  ${T(40, 76, "親水端", "s-accent-text")}${T(84, 132, "親油端", "s-chem-text")}${T(80, 160, "肥皂分子", "s-small")}
  <circle cx="330" cy="110" r="38" class="s-oil"/>${ring}${T(330, 115, "油汙", "s-text")}
  ${T(330, 206, "親油端朝內抓住油，親水端朝外接觸水", "s-small")}
</svg>`;
  })();
})();
