/*
 * 看圖題用的圖（2026-10-12）：構圖與課文新圖解相同，但答案改成甲、乙、丙等代號，圖上不寫答案。
 * 需在 figures6.js 之後載入，只用在考題。
 */
(function () {
  const F = window.FIG;
  const mk = (id, cls) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" class="${cls}"/></marker>`;
  const defs = id => `<defs>${mk(id + "a", "s-accent-fill")}${mk(id + "c", "s-chem-fill")}</defs>`;
  const arr = (id, x1, y1, x2, y2, chem) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${chem ? "s-chem-arrow" : "s-arrow"}" marker-end="url(#${id}${chem ? "c" : "a"})"/>`;
  const T = (x, y, s, cls, anchor) => `<text x="${x}" y="${y}" text-anchor="${anchor || "middle"}" class="${cls || "s-text"}">${s}</text>`;
  const H = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 10}" class="s-atom-h"/>`;
  const O = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 14}" class="s-atom-o"/>`;
  const C = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 12}" class="s-atom-c"/>`;
  const bulb = (x, y) => `<circle cx="${x}" cy="${y}" r="13" class="s-board"/><path d="M${x - 7},${y - 7} L${x + 7},${y + 7} M${x - 7},${y + 7} L${x + 7},${y - 7}" class="s-tick"/>`;
  const meter = (x, y, l) => `<circle cx="${x}" cy="${y}" r="15" class="s-board"/>${T(x, y + 5, l)}`;
  const cellH = (x, y) => `<line x1="${x - 5}" y1="${y - 8}" x2="${x - 5}" y2="${y + 8}" class="s-line"/><line x1="${x + 5}" y1="${y - 14}" x2="${x + 5}" y2="${y + 14}" class="s-line"/>`;
  const r1 = n => Math.round(n * 10) / 10;

  // 酒精燈火焰：甲外焰、乙內焰、丙焰心
  F.qFlame = `<svg viewBox="0 0 340 250" width="340" role="img" aria-label="酒精燈火焰的三個部分">
  <path d="M120,232 L240,232 Q252,182 180,172 Q108,182 120,232 Z" class="s-glass-fill"/><rect x="170" y="150" width="20" height="24" class="s-board"/>
  <path d="M180,150 Q132,104 180,18 Q228,104 180,150 Z" class="s-flame"/>
  <path d="M180,148 Q154,110 180,58 Q206,110 180,148 Z" style="fill:#ffd54f;fill-opacity:.9"/>
  <path d="M180,146 Q168,126 180,100 Q192,126 180,146 Z" style="fill:#90caf9"/>
  <line x1="208" y1="64" x2="262" y2="52" class="s-guide"/>${T(268, 57, "甲", "s-text", "start")}
  <line x1="196" y1="96" x2="262" y2="104" class="s-guide"/>${T(268, 109, "乙", "s-text", "start")}
  <line x1="186" y1="128" x2="262" y2="146" class="s-guide"/>${T(268, 151, "丙", "s-text", "start")}
</svg>`;

  // 一氧化碳燃燒的粒子模型
  F.qCOModel = `<svg viewBox="0 0 470 170" width="470" role="img" aria-label="某反應的粒子模型">${defs("qco")}
  ${C(270, 20, 7)}${T(282, 25, "碳原子", "s-small", "start")}${O(360, 20, 8)}${T(374, 25, "氧原子", "s-small", "start")}
  ${C(34, 80)}${O(60, 80)}${C(34, 130)}${O(60, 130)}${T(98, 112, "+", "s-big")}${O(132, 106)}${O(160, 106)}
  ${arr("qco", 196, 106, 252, 106)}
  ${O(282, 90, 12)}${C(306, 90)}${O(330, 90, 12)}${O(372, 124, 12)}${C(396, 124)}${O(420, 124, 12)}
  ${T(110, 162, "反應前", "s-small")}${T(350, 162, "反應後", "s-small")}
</svg>`;

  // 氧的轉移：甲O + 乙 → 甲 + 乙O
  F.qOxTransfer = `<svg viewBox="0 0 440 150" width="440" role="img" aria-label="兩種元素之間氧的轉移">${defs("qox")}
  <circle cx="60" cy="96" r="17" class="s-metal"/>${T(60, 101, "甲", "s-small")}${O(90, 96, 12)}
  ${T(125, 104, "+", "s-big")}<circle cx="165" cy="96" r="15" class="s-node"/>${T(165, 101, "乙", "s-small")}
  <path d="M92,80 Q128,34 160,78" class="s-chem-arrow" marker-end="url(#qoxc)"/>${T(126, 40, "氧", "s-chem-text")}
  ${arr("qox", 195, 96, 250, 96)}
  <circle cx="290" cy="96" r="17" class="s-metal"/>${T(290, 101, "甲", "s-small")}${T(325, 104, "+", "s-big")}<circle cx="370" cy="96" r="15" class="s-node"/>${T(370, 101, "乙", "s-small")}${O(398, 96, 12)}
  ${T(220, 140, "（加熱後反應，紅色圓為氧原子）", "s-small")}
</svg>`;

  // 電解質導電：甲電極接電池短板、乙電極接長板
  F.qIons = `<svg viewBox="0 0 400 240" width="400" role="img" aria-label="食鹽水通電">
  <path d="M135,95 L135,40 L207,40" class="s-wire"/>${cellH(212, 40)}<path d="M217,40 L290,40 L290,95" class="s-wire"/>
  ${T(196, 26, "−", "s-minus", "end")}${T(228, 26, "+", "s-plus", "start")}${T(212, 72, "電池", "s-small")}
  <path d="M80,110 L84,114 L84,222 L336,222 L336,112" class="s-glass"/><rect x="86" y="140" width="248" height="80" class="s-water"/>
  <rect x="130" y="95" width="10" height="112" class="s-metal"/><rect x="285" y="95" width="10" height="112" class="s-metal"/>
  ${T(120, 108, "甲", "s-text", "end")}${T(305, 108, "乙", "s-text", "start")}${T(210, 186, "食鹽水", "s-small")}
</svg>`;

  // pH 色帶：甲 2、乙 5、丙 7、丁 11
  F.qPh = (() => {
    let s = "";
    for (let v = 0; v <= 14; v++) { const x = 10 + v * 34, hue = Math.round(v / 14 * 240); s += `<rect x="${x}" y="58" width="34" height="34" style="fill:hsl(${hue},70%,62%)"/><text x="${x + 17}" y="81" text-anchor="middle" style="fill:#1f2430;font-size:15px">${v}</text>`; }
    const mark = (v, label) => { const x = 10 + (v + 0.5) * 34; return `<line x1="${x}" y1="36" x2="${x}" y2="58" class="s-guide"/>${T(x, 30, label)}`; };
    return `<svg viewBox="0 0 530 110" width="530" role="img" aria-label="四種溶液的 pH 值">${s}
  ${mark(2, "甲")}${mark(5, "乙")}${mark(7, "丙")}${mark(11, "丁")}${T(265, 106, "pH", "s-small")}
</svg>`;
  })();

  // 丁烷的分子模型
  F.qButane = (() => {
    let s = "", y = 76; const xs = [80, 120, 160, 200];
    s += `<line x1="48" y1="${y}" x2="232" y2="${y}" class="s-tick"/>`;
    xs.forEach(x => { s += `<line x1="${x}" y1="${y - 32}" x2="${x}" y2="${y + 32}" class="s-tick"/>`; });
    xs.forEach(x => { s += C(x, y, 12) + H(x, y - 34, 8) + H(x, y + 34, 8); });
    s += H(46, y, 8) + H(234, y, 8);
    return `<svg viewBox="0 0 380 150" width="380" role="img" aria-label="某烴的分子模型">${s}
  ${C(290, 50, 9)}${T(304, 55, "碳原子", "s-small", "start")}${H(290, 80, 7)}${T(304, 85, "氫原子", "s-small", "start")}
</svg>`;
  })();

  // 肥皂分子包住油汙：甲頭部、乙尾部
  F.qMicelle = (() => {
    let ring = ""; const cx = 170, cy = 110;
    for (let i = 0; i < 12; i++) {
      const a = i / 12 * Math.PI * 2, hx = cx + 64 * Math.cos(a), hy = cy + 64 * Math.sin(a), tx = cx + 30 * Math.cos(a), ty = cy + 30 * Math.sin(a);
      ring += `<line x1="${r1(hx)}" y1="${r1(hy)}" x2="${r1(tx)}" y2="${r1(ty)}" class="s-tick"/><circle cx="${r1(hx)}" cy="${r1(hy)}" r="7" class="s-node"/>`;
    }
    return `<svg viewBox="0 0 360 225" width="360" role="img" aria-label="肥皂分子與油汙">
  <circle cx="${cx}" cy="${cy}" r="38" class="s-oil"/>${ring}${T(cx, cy + 5, "油汙", "s-text")}
  <line x1="234" y1="110" x2="290" y2="80" class="s-guide"/>${T(296, 84, "甲", "s-text", "start")}
  <line x1="209" y1="132" x2="290" y2="160" class="s-guide"/>${T(296, 166, "乙", "s-text", "start")}
  ${T(170, 214, "（四周是水）", "s-small")}
</svg>`;
  })();

  // 摩擦力與外力：甲、乙、丙三點
  F.qFriction = `<svg viewBox="0 0 450 260" width="450" role="img" aria-label="摩擦力隨外力變化的圖">
  <line x1="60" y1="220" x2="420" y2="220" class="s-line"/><line x1="60" y1="220" x2="60" y2="36" class="s-line"/>
  ${T(240, 252, "施加的水平外力")}${T(66, 28, "摩擦力", "s-small", "start")}
  <polyline points="60,220 240,80" class="s-accent-line"/><line x1="240" y1="80" x2="240" y2="112" class="s-guide"/><polyline points="240,112 410,112" class="s-chem-line"/>
  <circle cx="150" cy="150" r="5" class="s-dot"/>${T(136, 146, "甲", "s-text", "end")}
  <circle cx="240" cy="80" r="5" class="s-dot"/>${T(240, 66, "乙", "s-text")}
  <circle cx="330" cy="112" r="5" class="s-dot"/>${T(330, 100, "丙", "s-text")}
</svg>`;

  // 水瓶上三個塞住的孔
  F.qHoles = `<svg viewBox="0 0 280 240" width="280" role="img" aria-label="裝滿水的瓶子側面有三個孔">
  <path d="M80,30 L80,215 L160,215 L160,30" class="s-glass"/><rect x="82" y="44" width="76" height="169" class="s-water"/>
  <rect x="160" y="74" width="10" height="12" class="s-stopper"/><rect x="160" y="124" width="10" height="12" class="s-stopper"/><rect x="160" y="174" width="10" height="12" class="s-stopper"/>
  ${T(182, 85, "甲", "s-text", "start")}${T(182, 135, "乙", "s-text", "start")}${T(182, 185, "丙", "s-text", "start")}
  ${T(120, 234, "（孔都用塞子塞住）", "s-small")}
</svg>`;

  // 浮力：甲上表面、乙下表面
  F.qBuoy = `<svg viewBox="0 0 360 240" width="360" role="img" aria-label="完全沒入水中的物體">${defs("qby")}
  <path d="M40,40 L40,220 L300,220 L300,40" class="s-glass"/><rect x="42" y="60" width="256" height="158" class="s-water"/>
  <rect x="130" y="100" width="80" height="60" class="s-stone"/>
  ${arr("qby", 170, 70, 170, 98, true)}${arr("qby", 170, 190, 170, 162, true)}
  ${T(182, 84, "甲", "s-text", "start")}${T(182, 186, "乙", "s-text", "start")}
</svg>`;

  // 直線上的移動：先向東 40 m，再向西 60 m
  F.qPath = (() => {
    const X = m => 140 + m * 4;
    let ticks = ""; [-20, 0, 20, 40].forEach(m => { ticks += `<line x1="${X(m)}" y1="140" x2="${X(m)}" y2="148" class="s-tick"/>${T(X(m), 166, m + " m", "s-small")}`; });
    return `<svg viewBox="0 0 400 180" width="400" role="img" aria-label="一個人在直線上的移動">${defs("qpa")}
  <line x1="40" y1="144" x2="340" y2="144" class="s-line"/>${ticks}${T(345, 148, "東", "s-small", "start")}${T(35, 148, "西", "s-small", "end")}
  ${arr("qpa", X(0), 60, X(40), 60)}${T(X(20), 50, "① 向東走 40 m", "s-small")}
  ${arr("qpa", X(40), 96, X(-20), 96)}${T(X(10), 116, "② 向西走 60 m", "s-small")}
  <circle cx="${X(0)}" cy="144" r="5" class="s-dot"/>${T(X(0), 132, "起點", "s-small")}
</svg>`;
  })();

  // 書在桌上：甲、乙、丙三個力
  F.qBookForces = `<svg viewBox="0 0 360 250" width="360" role="img" aria-label="書靜止在桌上時的三個力">${defs("qbf")}
  <rect x="60" y="130" width="240" height="12" class="s-board"/><line x1="80" y1="142" x2="80" y2="230" class="s-line"/><line x1="280" y1="142" x2="280" y2="230" class="s-line"/>
  <rect x="120" y="100" width="120" height="30" class="s-wood"/>${T(180, 121, "書")}
  ${arr("qbf", 145, 116, 145, 182, true)}${T(138, 186, "甲", "s-text", "end")}
  ${arr("qbf", 210, 100, 210, 46)}${T(220, 52, "乙", "s-text", "start")}
  ${arr("qbf", 215, 134, 215, 196, true)}${T(225, 196, "丙", "s-text", "start")}
</svg>`;

  // 圓周運動：小球在最右側、逆時針轉；甲上、乙左、丙右、丁下
  F.qCircle = `<svg viewBox="0 0 400 300" width="400" role="img" aria-label="做圓周運動的小球與四個方向">${defs("qci")}
  <circle cx="160" cy="150" r="100" class="s-orbit"/><circle cx="160" cy="150" r="4" class="s-dot"/>
  <path d="M95,74 A100,100 0 0,0 85,216" class="s-arrow" marker-end="url(#qcia)"/>${T(70, 150, "轉動方向", "s-small", "end")}
  <line x1="160" y1="150" x2="260" y2="150" class="s-tick"/><circle cx="260" cy="150" r="11" class="s-metal"/>
  ${arr("qci", 260, 138, 260, 78, true)}${T(260, 68, "甲")}
  ${arr("qci", 248, 150, 200, 150, true)}${T(214, 140, "乙")}
  ${arr("qci", 272, 150, 330, 150, true)}${T(342, 155, "丙", "s-text", "start")}
  ${arr("qci", 260, 162, 260, 222, true)}${T(260, 240, "丁")}
</svg>`;

  // 單擺：A、B、C 三個位置
  F.qPendulum = (() => {
    const px = 200, py = 30, L = 160, th = 35 * Math.PI / 180;
    const A = [r1(px - L * Math.sin(th)), r1(py + L * Math.cos(th))], B = [px, py + L], Cc = [r1(px + L * Math.sin(th)), r1(py + L * Math.cos(th))];
    return `<svg viewBox="0 0 400 230" width="400" role="img" aria-label="單擺擺動的三個位置">
  <line x1="160" y1="${py}" x2="240" y2="${py}" class="s-line"/><path d="M${A[0]},${A[1]} Q${px},${py + L + 30} ${Cc[0]},${Cc[1]}" class="s-guide"/>
  ${[A, B, Cc].map(p => `<line x1="${px}" y1="${py}" x2="${p[0]}" y2="${p[1]}" class="s-tick"/><circle cx="${p[0]}" cy="${p[1]}" r="11" class="s-metal"/>`).join("")}
  ${T(A[0] - 18, A[1] + 4, "A", "s-text", "end")}${T(B[0], B[1] + 28, "B", "s-text")}${T(Cc[0] + 18, Cc[1] + 4, "C", "s-text", "start")}
</svg>`;
  })();

  // 電表接法：甲串聯、乙並聯在燈泡兩端
  F.qMeters = `<svg viewBox="0 0 420 240" width="420" role="img" aria-label="接有兩個電表的電路">
  <path d="M80,129 L80,70 L217,70 M243,70 L380,70 L380,200 L246,200 M214,200 L80,200 L80,139" class="s-wire"/>
  <line x1="64" y1="129" x2="96" y2="129" class="s-line"/><line x1="72" y1="139" x2="88" y2="139" class="s-line"/>
  ${bulb(230, 70)}${meter(230, 200, "甲")}
  <path d="M190,70 L190,26 L215,26 M245,26 L270,26 L270,70" class="s-wire"/>${meter(230, 26, "乙")}
  <circle cx="190" cy="70" r="3" class="s-dot"/><circle cx="270" cy="70" r="3" class="s-dot"/>${T(230, 98, "燈泡", "s-small")}
</svg>`;

  // 兩個電路：甲串聯、乙並聯，燈泡編號 ①②
  F.qTwoCircuits = `<svg viewBox="0 0 520 210" width="520" role="img" aria-label="甲、乙兩個電路">
  <path d="M30,180 L30,50 L77,50 M103,50 L147,50 M173,50 L220,50 L220,180 L130,180 M120,180 L30,180" class="s-wire"/>
  ${bulb(90, 50)}${bulb(160, 50)}${cellH(125, 180)}${T(90, 30, "①")}${T(160, 30, "②")}${T(125, 206, "甲")}
  <path d="M300,107 L300,50 L430,50 M300,123 L300,180 L430,180 M360,50 L360,102 M360,128 L360,180 M430,50 L430,102 M430,128 L430,180" class="s-wire"/>
  <line x1="284" y1="110" x2="316" y2="110" class="s-line"/><line x1="290" y1="120" x2="310" y2="120" class="s-line"/>
  ${bulb(360, 115)}${bulb(430, 115)}${T(380, 120, "①", "s-text", "start")}${T(450, 120, "②", "s-text", "start")}
  <circle cx="360" cy="50" r="3" class="s-dot"/><circle cx="360" cy="180" r="3" class="s-dot"/>${T(365, 206, "乙")}
</svg>`;

  // 鋅銅電池：甲鋅片、乙銅片
  F.qCell = `<svg viewBox="0 0 500 255" width="500" role="img" aria-label="鋅片與銅片做成的電池">
  <path d="M40,122 L44,126 L44,240 L200,240 L200,124" class="s-glass"/><rect x="46" y="150" width="152" height="88" class="s-water"/>
  <path d="M300,122 L304,126 L304,240 L460,240 L460,124" class="s-glass"/><rect x="306" y="150" width="152" height="88" class="s-water"/><rect x="306" y="150" width="152" height="88" style="fill:#2f6fed;fill-opacity:.12"/>
  <path d="M170,200 L170,108 Q250,72 330,108 L330,200" class="s-bridge"/>${T(250, 120, "鹽橋", "s-small")}
  <rect x="100" y="95" width="14" height="130" class="s-metal"/><rect x="400" y="95" width="14" height="130" class="s-copper"/>
  <path d="M107,95 L107,40 L242,40 M268,40 L407,40 L407,95" class="s-wire"/>${bulb(255, 40)}
  ${T(90, 90, "甲（鋅）", "s-text", "end")}${T(424, 90, "乙（銅）", "s-text", "start")}
  ${T(122, 210, "硫酸鋅", "s-small")}${T(382, 210, "硫酸銅", "s-small")}
</svg>`;

  // 電解水：甲管氣體多、乙管氣體少
  F.qElectrolysis = `<svg viewBox="0 0 440 280" width="440" role="img" aria-label="電解水的裝置">
  <path d="M60,140 L60,240 L380,240 L380,140" class="s-glass"/><rect x="62" y="160" width="316" height="78" class="s-water"/>
  <rect x="120" y="40" width="40" height="190" class="s-glass-fill"/><rect x="122" y="150" width="36" height="78" class="s-water"/>
  <rect x="280" y="40" width="40" height="190" class="s-glass-fill"/><rect x="282" y="95" width="36" height="133" class="s-water"/>
  <rect x="134" y="206" width="12" height="22" class="s-metal"/><rect x="294" y="206" width="12" height="22" class="s-metal"/>
  <path d="M140,228 L140,262 L215,262 M225,262 L300,262 L300,228" class="s-wire"/>${cellH(220, 262)}
  ${T(140, 30, "甲")}${T(300, 30, "乙")}
</svg>`;

  // 條形磁鐵：兩端未標示，磁力線由右端出發
  F.qMagnet = (() => {
    let lines = "";
    [40, 80, 130].forEach(h => {
      const ty = r1(125 - 0.75 * h), by = r1(135 + 0.75 * h);
      lines += `<path d="M180,125 C120,${125 - h} 360,${125 - h} 300,125" class="s-field"/><path d="M180,135 C120,${135 + h} 360,${135 + h} 300,135" class="s-field"/>`;
      lines += `<path d="M246,${ty - 5} L236,${ty} L246,${ty + 5} Z" class="s-accent-fill"/><path d="M246,${by - 5} L236,${by} L246,${by + 5} Z" class="s-accent-fill"/>`;
    });
    return `<svg viewBox="0 0 480 265" width="480" role="img" aria-label="一根磁鐵周圍的磁力線">${lines}
  <line x1="180" y1="130" x2="110" y2="130" class="s-field"/><path d="M174,125 L184,130 L174,135 Z" class="s-accent-fill"/>
  <line x1="370" y1="130" x2="300" y2="130" class="s-field"/><path d="M364,125 L374,130 L364,135 Z" class="s-accent-fill"/>
  <rect x="180" y="115" width="120" height="30" class="s-metal"/>${T(196, 136, "甲")}${T(284, 136, "乙")}
</svg>`;
  })();

  // 直導線（俯視）與四個位置
  F.qWire = `<svg viewBox="0 0 300 260" width="300" role="img" aria-label="通電直導線周圍的四個位置">
  <circle cx="150" cy="130" r="58" class="s-guide"/>
  <circle cx="150" cy="130" r="10" class="s-board"/><circle cx="150" cy="130" r="3" class="s-pupil"/>
  <circle cx="150" cy="72" r="5" class="s-dot"/>${T(150, 60, "甲")}
  <circle cx="208" cy="130" r="5" class="s-dot"/>${T(222, 135, "乙", "s-text", "start")}
  <circle cx="150" cy="188" r="5" class="s-dot"/>${T(150, 210, "丙")}
  <circle cx="92" cy="130" r="5" class="s-dot"/>${T(78, 135, "丁", "s-text", "end")}
  ${T(150, 246, "⊙ 表示電流從紙面流出、朝向你", "s-small")}
</svg>`;

  // 電磁感應：甲磁鐵插入、乙靜止在線圈中、丙線圈遠離磁鐵
  F.qInduction = (() => {
    const panel = (x0, magX, magArrow, coilArrow, label) => {
      let coil = ""; for (let x = x0 + 82; x <= x0 + 127; x += 15) coil += `<ellipse cx="${x}" cy="62" rx="6" ry="22" class="s-wire"/>`;
      return `<rect x="${x0 + magX}" y="51" width="26" height="22" class="s-mag-s"/><rect x="${x0 + magX + 26}" y="51" width="26" height="22" class="s-mag-n"/>${T(x0 + magX + 39, 67, "N", "s-tiny")}
  ${coil}<path d="M${x0 + 82},84 L${x0 + 82},140 L${x0 + 127},140 L${x0 + 127},84" class="s-wire"/><circle cx="${x0 + 104}" cy="140" r="12" class="s-board"/>${T(x0 + 104, 145, "G", "s-small")}
  ${magArrow ? arr("qin", x0 + 20, 34, x0 + 60, 34) : ""}${coilArrow ? arr("qin", x0 + 100, 108, x0 + 150, 108, true) : ""}
  ${T(x0 + 85, 190, label)}`;
    };
    return `<svg viewBox="0 0 520 205" width="520" role="img" aria-label="磁鐵與線圈的三種情況">${defs("qin")}
  ${panel(0, 12, true, false, "甲")}${panel(175, 64, false, false, "乙")}${panel(350, 12, false, true, "丙")}
</svg>`;
  })();
})();
