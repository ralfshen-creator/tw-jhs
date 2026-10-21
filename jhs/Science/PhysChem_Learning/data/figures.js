/*
 * 課程與題目用的圖解（SVG）。顏色用 CSS class（見 style.css 的 .fig 區段），深色模式會自動變色。
 * curriculum.js 與 questions.js 以 ${FIG.xxx} 或 FIG.xxx(...) 引用，所以這個檔要先載入。
 */
(function () {
  // 圖外文字說明：依 SVG 的 aria-label 對到 FIG.NOTES（在 figures2.js），手機上看不清楚的標註也能讀到
  function fig(svg, caption) {
    const m = svg.match(/aria-label="([^"]+)"/);
    const notes = m && window.FIG && window.FIG.NOTES ? window.FIG.NOTES[m[1]] : null;
    return `<figure class="fig"><div class="fig-scroll">${svg}</div><div class="fig-hint">← 左右滑動看完整圖，或點圖放大 →</div>${caption ? `<figcaption>${caption}</figcaption>` : ""}${notes ? `<ul class="fig-notes">${notes.map(n => `<li>${n}</li>`).join("")}</ul>` : ""}</figure>`;
  }
  function eye(x, y) {
    return `<ellipse cx="${x}" cy="${y}" rx="13" ry="7" class="s-eye"/><circle cx="${x + 5}" cy="${y}" r="4" class="s-pupil"/>`;
  }
  const r1 = n => Math.round(n * 10) / 10;

  // ---------- 直尺讀數 ----------
  // start / end：物體兩端的刻度（cm）；尺畫 0~4 cm
  function ruler(o) {
    o = Object.assign({ start: 0, end: 2.37, note: true }, o || {});
    const x0 = 40, cm = 110;
    const X = v => r1(x0 + v * cm);
    let t = "";
    for (let i = 0; i <= 40; i++) {
      const x = X(i / 10), h = i % 10 === 0 ? 22 : i % 5 === 0 ? 15 : 9;
      t += `<line x1="${x}" y1="80" x2="${x}" y2="${80 + h}" class="s-tick"/>`;
      if (i % 10 === 0) t += `<text x="${x}" y="124" text-anchor="middle" class="s-text">${i / 10}</text>`;
    }
    const a = X(o.start), b = X(o.end);
    const svg = `<svg viewBox="0 0 520 ${o.note ? 175 : 140}" width="520" role="img" aria-label="直尺讀數">
  <rect x="20" y="80" width="475" height="55" rx="4" class="s-board"/>${t}
  <text x="512" y="96" text-anchor="end" class="s-small">cm</text>
  <rect x="${a}" y="46" width="${r1(b - a - 20)}" height="24" class="s-wood"/>
  <polygon points="${r1(b - 20)},46 ${b},58 ${r1(b - 20)},70" class="s-wood"/>
  <line x1="${a}" y1="40" x2="${a}" y2="80" class="s-guide"/>
  <line x1="${b}" y1="40" x2="${b}" y2="80" class="s-guide"/>
  ${o.note ? `<text x="${b}" y="34" text-anchor="middle" class="s-accent-text">${o.end.toFixed(2)} cm</text>
  <text x="260" y="162" text-anchor="middle" class="s-text">${(Math.floor(o.end * 10 + 1e-9) / 10).toFixed(1)}（準確值）＋ 最後一位 ${Math.round(o.end * 100) % 10}（估計值）</text>` : ""}
</svg>`;
    return svg;
  }

  // ---------- 量筒讀數（含視線） ----------
  function meniscus() {
    const Y = v => 220 - (v - 10) * 10;
    let g = "";
    for (let v = 10; v <= 26; v++) {
      const major = v % 5 === 0;
      g += `<line x1="232" y1="${Y(v)}" x2="${major ? 260 : 248}" y2="${Y(v)}" class="s-tick"/>`;
      if (major) g += `<text x="300" y="${Y(v) + 5}" class="s-small">${v}</text>`;
    }
    const sight = (ey, label, cls) => {
      const cx = 232, cy = r1(ey + (120 - ey) * (cx - 105) / (260 - 105));
      return `${eye(92, ey)}<line x1="105" y1="${ey}" x2="260" y2="120" class="${cls}"/>
  <circle cx="${cx}" cy="${cy}" r="4" class="s-dot"/><text x="20" y="${ey - 14}" class="s-text">${label}</text>`;
    };
    return `<svg viewBox="0 0 440 260" width="440" role="img" aria-label="量筒讀數的視線">
  <path d="M232,112 Q260,128 288,112 L288,228 L232,228 Z" class="s-water"/>
  ${g}
  <path d="M232,30 L232,230 L288,230 L288,30" class="s-glass"/>
  <rect x="212" y="230" width="96" height="10" rx="3" class="s-board"/>
  ${sight(50, "俯視：讀數偏大 ✘", "s-warn-line")}
  ${sight(120, "平視：正確 ✔", "s-ok-line")}
  ${sight(190, "仰視：讀數偏小 ✘", "s-warn-line")}
  <text x="330" y="124" class="s-accent-text">← 凹液面最低處</text>
  <text x="330" y="142" class="s-small">讀作 20.0 mL</text>
</svg>`;
  }

  // ---------- 量筒（題目用，不含答案） ----------
  function cylinder(o) {
    o = Object.assign({ min: 20, max: 50, value: 34, step: 1 }, o || {});
    const top = 30, bot = 230, Y = v => r1(bot - (v - o.min + 2) * (bot - top) / (o.max - o.min + 4));
    let g = "";
    for (let v = o.min; v <= o.max; v += o.step) {
      const major = v % 10 === 0, mid = v % 5 === 0;
      g += `<line x1="150" y1="${Y(v)}" x2="${major ? 180 : mid ? 172 : 164}" y2="${Y(v)}" class="s-tick"/>`;
      if (major) g += `<text x="218" y="${Y(v) + 5}" class="s-small">${v}</text>`;
    }
    const y = Y(o.value);
    return `<svg viewBox="0 0 280 255" width="280" role="img" aria-label="量筒">
  <path d="M150,${r1(y - 7)} Q180,${r1(y + 7)} 210,${r1(y - 7)} L210,${bot - 2} L150,${bot - 2} Z" class="s-water"/>
  ${g}
  <path d="M150,${top - 10} L150,${bot} L210,${bot} L210,${top - 10}" class="s-glass"/>
  <rect x="128" y="${bot}" width="104" height="10" rx="3" class="s-board"/>
  <text x="240" y="${top}" class="s-small">mL</text>
</svg>`;
  }

  // ---------- 排水法 ----------
  function displacement() {
    const Y = v => 230 - v * 4;
    const cyl = (x, v, stone) => {
      let g = "";
      for (let m = 5; m <= 50; m += 5) {
        g += `<line x1="${x}" y1="${Y(m)}" x2="${x + (m % 10 === 0 ? 24 : 14)}" y2="${Y(m)}" class="s-tick"/>`;
        if (m % 10 === 0) g += `<text x="${x + 70}" y="${Y(m) + 5}" class="s-small">${m}</text>`;
      }
      return `<path d="M${x},${Y(v) - 4} Q${x + 30},${Y(v) + 6} ${x + 60},${Y(v) - 4} L${x + 60},228 L${x},228 Z" class="s-water"/>${g}
  ${stone ? `<polygon points="${x + 14},226 ${x + 10},210 ${x + 22},196 ${x + 42},198 ${x + 50},214 ${x + 44},226" class="s-stone"/>` : ""}
  <path d="M${x},20 L${x},230 L${x + 60},230 L${x + 60},20" class="s-glass"/>
  <rect x="${x - 16}" y="230" width="92" height="9" rx="3" class="s-board"/>`;
    };
    return `<svg viewBox="0 0 470 300" width="470" role="img" aria-label="排水法測體積">
  ${cyl(70, 30, false)}${cyl(320, 42, true)}
  <path d="M190,120 L290,120" class="s-arrow" marker-end="url(#arr1)"/>
  <defs><marker id="arr1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0,0 L10,5 L0,10 Z" class="s-accent-fill"/></marker></defs>
  <text x="240" y="108" text-anchor="middle" class="s-text">放入石頭</text>
  <text x="100" y="262" text-anchor="middle" class="s-text">V₁ = 30.0 mL</text>
  <text x="350" y="262" text-anchor="middle" class="s-text">V₂ = 42.0 mL</text>
  <text x="235" y="290" text-anchor="middle" class="s-accent-text">石頭體積 = V₂ − V₁ = 12.0 mL = 12.0 cm³</text>
</svg>`;
  }

  // ---------- 上皿天平 ----------
  const balance = `<svg viewBox="0 0 460 240" width="460" role="img" aria-label="上皿天平">
  <rect x="120" y="200" width="220" height="18" rx="4" class="s-board"/>
  <rect x="224" y="140" width="12" height="60" class="s-board"/>
  <rect x="80" y="134" width="300" height="8" rx="3" class="s-metal"/>
  <circle cx="74" cy="138" r="7" class="s-metal"/><circle cx="386" cy="138" r="7" class="s-metal"/>
  <line x1="120" y1="134" x2="120" y2="112" class="s-line"/><line x1="340" y1="134" x2="340" y2="112" class="s-line"/>
  <ellipse cx="120" cy="108" rx="58" ry="7" class="s-metal"/><ellipse cx="340" cy="108" rx="58" ry="7" class="s-metal"/>
  <rect x="98" y="78" width="44" height="26" rx="4" class="s-stone"/>
  <rect x="316" y="82" width="18" height="22" rx="2" class="s-weight"/><rect x="340" y="90" width="14" height="14" rx="2" class="s-weight"/>
  <line x1="230" y1="142" x2="230" y2="190" class="s-ok-line"/>
  <path d="M206,194 Q230,186 254,194" class="s-tick"/>
  <text x="120" y="62" text-anchor="middle" class="s-text">左盤放「物體」</text>
  <text x="340" y="62" text-anchor="middle" class="s-text">右盤放「砝碼」</text>
  <text x="74" y="170" text-anchor="middle" class="s-small">歸零螺絲</text>
  <text x="386" y="170" text-anchor="middle" class="s-small">歸零螺絲</text>
  <text x="262" y="186" class="s-small">指針在中央 = 平衡</text>
  <text x="230" y="236" text-anchor="middle" class="s-small">砝碼用鑷子夾取，不可用手拿</text>
</svg>`;

  // ---------- 質量-體積圖 ----------
  function mvGraph(o) {
    o = Object.assign({ answer: true }, o || {});
    const X = v => 50 + v * 7.5, Y = m => 240 - m * 2;
    let g = "";
    for (let v = 10; v <= 40; v += 10) g += `<line x1="${X(v)}" y1="40" x2="${X(v)}" y2="240" class="s-grid"/><text x="${X(v)}" y="258" text-anchor="middle" class="s-small">${v}</text>`;
    for (let m = 20; m <= 100; m += 20) g += `<line x1="50" y1="${Y(m)}" x2="350" y2="${Y(m)}" class="s-grid"/><text x="42" y="${Y(m) + 4}" text-anchor="end" class="s-small">${m}</text>`;
    return `<svg viewBox="0 0 400 290" width="400" role="img" aria-label="質量-體積關係圖">
  ${g}
  <line x1="50" y1="240" x2="360" y2="240" class="s-line"/><line x1="50" y1="240" x2="50" y2="30" class="s-line"/>
  <text x="42" y="256" text-anchor="end" class="s-small">0</text>
  <line x1="50" y1="240" x2="${X(40)}" y2="${Y(100)}" class="s-accent-line"/>
  <line x1="50" y1="240" x2="${X(40)}" y2="${Y(40)}" class="s-chem-line"/>
  <text x="${X(36)}" y="${Y(100) + 4}" class="s-accent-text">甲</text>
  <text x="${X(40) + 4}" y="${Y(40) - 6}" class="s-chem-text">乙</text>
  <circle cx="${X(20)}" cy="${Y(50)}" r="4" class="s-dot"/>
  <line x1="${X(20)}" y1="${Y(50)}" x2="${X(20)}" y2="240" class="s-guide"/>
  <line x1="${X(20)}" y1="${Y(50)}" x2="50" y2="${Y(50)}" class="s-guide"/>
  <text x="205" y="282" text-anchor="middle" class="s-text">體積 V（cm³）</text>
  <text x="14" y="24" class="s-text">質量 M（g）</text>
  ${o.answer ? `<text x="${X(20) - 8}" y="${Y(50) - 10}" text-anchor="end" class="s-small">(20, 50)</text>` : ""}
</svg>`;
  }

  // ---------- 液體分層 ----------
  // 只用真的互不相溶的油和水（蜂蜜裡的糖會溶進水裡，不能當永久分層的例子）
  const layers = `<svg viewBox="0 0 360 230" width="360" role="img" aria-label="沙拉油和水互不相溶，靜置後分成兩層">
  <rect x="80" y="70" width="120" height="60" class="s-oil"/>
  <rect x="80" y="130" width="120" height="80" class="s-water"/>
  <path d="M80,30 L80,210 L200,210 L200,30" class="s-glass"/>
  <text x="215" y="105" class="s-text">沙拉油 約 0.9 g/cm³</text>
  <text x="215" y="175" class="s-text">水 1.0 g/cm³</text>
  <text x="140" y="24" text-anchor="middle" class="s-small">互不相溶，靜置後分層：密度小的在上</text>
</svg>`;

  // ---------- 物質分類 ----------
  function box(x, y, w, label, cls) {
    return `<rect x="${x - w / 2}" y="${y - 17}" width="${w}" height="34" rx="8" class="${cls || "s-node"}"/><text x="${x}" y="${y + 5}" text-anchor="middle" class="s-text">${label}</text>`;
  }
  const classify = `<svg viewBox="0 0 540 250" width="540" role="img" aria-label="物質的分類">
  <path d="M270,47 L150,78 M270,47 L400,78 M150,112 L80,148 M150,112 L220,148" class="s-tick"/>
  ${box(270, 30, 90, "物質", "s-node-main")}
  ${box(150, 95, 110, "純物質")}${box(400, 95, 110, "混合物", "s-node-chem")}
  ${box(80, 165, 90, "元素")}${box(220, 165, 90, "化合物")}
  <text x="80" y="200" text-anchor="middle" class="s-small">氧、氮、鐵、銅、碳</text>
  <text x="80" y="218" text-anchor="middle" class="s-small">不能再分解</text>
  <text x="220" y="200" text-anchor="middle" class="s-small">水、二氧化碳、食鹽</text>
  <text x="220" y="218" text-anchor="middle" class="s-small">兩種以上元素組成</text>
  <text x="400" y="134" text-anchor="middle" class="s-small">空氣、海水、汽水、合金</text>
  <text x="400" y="152" text-anchor="middle" class="s-small">沒有固定組成</text>
  <text x="400" y="170" text-anchor="middle" class="s-small">沒有固定熔點、沸點</text>
  <text x="150" y="242" text-anchor="middle" class="s-small">↑ 有固定組成、固定熔點與沸點</text>
</svg>`;

  // ---------- 三態粒子模型 ----------
  const states = (() => {
    let s = "";
    [48, 70, 92, 114].forEach(y => [46, 68, 90, 112, 134].forEach(x => { s += `<circle cx="${x}" cy="${y}" r="9" class="s-particle"/>`; }));
    let l = "";
    [[210, 128], [231, 124], [253, 130], [275, 126], [297, 129], [316, 123], [220, 107], [243, 104], [266, 109], [289, 103], [310, 105], [233, 85], [257, 88], [281, 82], [304, 86]]
      .forEach(([x, y]) => { l += `<circle cx="${x}" cy="${y}" r="9" class="s-particle"/>`; });
    let g = "";
    [[385, 45, 1, -1], [452, 40, 1, 1], [482, 92, -1, 1], [410, 100, 1, 0], [470, 128, -1, -1], [382, 126, 1, 1], [432, 66, -1, 1]]
      .forEach(([x, y, dx, dy]) => {
        g += `<circle cx="${x}" cy="${y}" r="9" class="s-particle"/><line x1="${x + dx * 11}" y1="${y + dy * 11}" x2="${x + dx * 22}" y2="${y + dy * 22}" class="s-guide"/>`;
      });
    return `<svg viewBox="0 0 520 200" width="520" role="img" aria-label="三態的粒子排列">
  <rect x="20" y="25" width="140" height="120" rx="6" class="s-board"/>${s}
  <rect x="190" y="25" width="140" height="120" rx="6" class="s-board"/><rect x="192" y="72" width="136" height="71" class="s-water"/>${l}
  <rect x="360" y="25" width="140" height="120" rx="6" class="s-board"/>${g}
  <text x="90" y="168" text-anchor="middle" class="s-text">固態</text><text x="90" y="188" text-anchor="middle" class="s-small">定形、定體積</text>
  <text x="260" y="168" text-anchor="middle" class="s-text">液態</text><text x="260" y="188" text-anchor="middle" class="s-small">不定形、定體積</text>
  <text x="430" y="168" text-anchor="middle" class="s-text">氣態</text><text x="430" y="188" text-anchor="middle" class="s-small">不定形、不定體積</text>
</svg>`;
  })();

  // ---------- 過濾 ----------
  const filtration = `<svg viewBox="0 0 470 300" width="470" role="img" aria-label="過濾裝置">
  <polygon points="104,72 196,72 152,134" class="s-paper"/>
  <polygon points="117,94 183,94 152,128" class="s-muddy"/>
  <path d="M92,62 L208,62 L157,138 L157,212 L150,222 L143,212 L143,138 Z" class="s-glass"/>
  <line x1="62" y1="12" x2="122" y2="96" class="s-rod"/>
  <path d="M140,175 L140,282 L270,282 L270,175" class="s-glass"/>
  <rect x="142" y="252" width="126" height="28" class="s-water"/>
    <line x1="122" y1="96" x2="300" y2="40" class="s-guide"/><text x="305" y="44" class="s-small">玻璃棒引流，輕靠濾紙三層處</text>
  <line x1="196" y1="72" x2="300" y2="78" class="s-guide"/><text x="305" y="82" class="s-small">濾紙邊緣低於漏斗邊緣</text>
  <line x1="183" y1="94" x2="300" y2="114" class="s-guide"/><text x="305" y="118" class="s-small">液面低於濾紙邊緣</text>
  <line x1="196" y1="66" x2="300" y2="150" class="s-guide"/><text x="305" y="154" class="s-small">濾紙緊貼漏斗內壁</text>
  <line x1="143" y1="212" x2="300" y2="200" class="s-guide"/><text x="305" y="204" class="s-small">漏斗尖端緊靠燒杯內壁</text>
  <line x1="240" y1="266" x2="300" y2="246" class="s-guide"/><text x="305" y="250" class="s-small">濾液（澄清）</text>
  <text x="60" y="118" text-anchor="middle" class="s-small">泥水 →</text>
</svg>`;

  // ---------- 製造氧氣 ----------
  const oxygen = `<svg viewBox="0 0 580 300" width="580" role="img" aria-label="雙氧水製造氧氣與排水集氣法">
  <path d="M60,210 L160,210 L180,250 L40,250 Z" class="s-water"/>
  <circle cx="70" cy="244" r="3" class="s-mno2"/><circle cx="90" cy="246" r="3" class="s-mno2"/><circle cx="112" cy="244" r="3" class="s-mno2"/><circle cx="134" cy="246" r="3" class="s-mno2"/><circle cx="152" cy="244" r="3" class="s-mno2"/><circle cx="80" cy="238" r="3" class="s-mno2"/><circle cx="125" cy="239" r="3" class="s-mno2"/>
  <circle cx="122" cy="226" r="3" class="s-bubble"/><circle cx="84" cy="220" r="2.5" class="s-bubble"/><circle cx="140" cy="216" r="2.5" class="s-bubble"/>
  <path d="M90,120 L90,150 L40,250 L180,250 L130,150 L130,120" class="s-glass"/>
  <rect x="84" y="110" width="52" height="14" rx="3" class="s-stopper"/>
  <path d="M100,52 L100,238" class="s-tube"/>
  <path d="M80,30 Q100,62 120,30" class="s-glass"/><path d="M80,30 L120,30" class="s-glass"/>
  <path d="M122,110 L122,84 L390,84 L390,244 L452,244 L452,226" class="s-tube"/>
  <rect x="340" y="166" width="210" height="96" class="s-water"/>
  <path d="M338,150 L338,264 L552,264 L552,150" class="s-glass"/>
  <rect x="424" y="160" width="58" height="72" class="s-water"/>
  <path d="M424,232 L424,108 Q424,100 432,100 L474,100 Q482,100 482,108 L482,232" class="s-glass"/>
  <circle cx="452" cy="212" r="3" class="s-bubble"/><circle cx="447" cy="190" r="3" class="s-bubble"/><circle cx="456" cy="172" r="3" class="s-bubble"/>
  <text x="453" y="135" text-anchor="middle" class="s-accent-text">氧氣</text>
  <text x="140" y="34" class="s-small">薊頭漏斗：倒入雙氧水</text>
  <text x="140" y="50" class="s-small">下端要伸入液面以下</text>
  <text x="196" y="226" class="s-small">← 雙氧水</text>
  <text x="110" y="274" text-anchor="middle" class="s-small">瓶底：二氧化錳（催化劑）</text>
  <text x="445" y="288" text-anchor="middle" class="s-text">排水集氣法</text>
  <text x="250" y="76" text-anchor="middle" class="s-small">導管</text>
</svg>`;

  // ---------- 三種集氣法 ----------
  const collect = `<svg viewBox="0 0 580 250" width="580" role="img" aria-label="三種集氣法">
  <rect x="17" y="118" width="156" height="80" class="s-water"/>
  <path d="M15,105 L15,200 L175,200 L175,105" class="s-glass"/>
  <rect x="68" y="100" width="52" height="72" class="s-water"/>
  <path d="M68,172 L68,48 Q68,40 76,40 L112,40 Q120,40 120,48 L120,172" class="s-glass"/>
  <path d="M28,60 L28,186 L94,186 L94,164" class="s-tube"/>
  <circle cx="94" cy="148" r="3" class="s-bubble"/><circle cx="90" cy="126" r="3" class="s-bubble"/>

  <rect x="248" y="130" width="54" height="58" class="s-gas"/>
  <path d="M245,62 L245,190 L305,190 L305,62" class="s-glass"/>
  <path d="M275,20 L275,180" class="s-tube"/>
  <path d="M258,72 L250,52 M292,72 L300,52" class="s-guide"/>
  <text x="312" y="160" class="s-small">CO₂</text>
  <text x="312" y="176" class="s-small">沉在下面</text>

  <rect x="438" y="44" width="54" height="56" class="s-gas"/>
  <path d="M435,172 L435,48 Q435,40 443,40 L487,40 Q495,40 495,48 L495,172" class="s-glass"/>
  <path d="M465,200 L465,52" class="s-tube"/>
  <path d="M446,160 L440,184 M484,160 L490,184" class="s-guide"/>
  <text x="502" y="66" class="s-small">輕的</text>
  <text x="502" y="82" class="s-small">浮在上面</text>

  <text x="95" y="222" text-anchor="middle" class="s-text">排水集氣法</text>
  <text x="95" y="240" text-anchor="middle" class="s-small">難溶於水：O₂、H₂</text>
  <text x="275" y="222" text-anchor="middle" class="s-text">向上排空氣法</text>
  <text x="275" y="240" text-anchor="middle" class="s-small">密度比空氣大：CO₂</text>
  <text x="465" y="222" text-anchor="middle" class="s-text">向下排空氣法</text>
  <text x="465" y="240" text-anchor="middle" class="s-small">密度比空氣小：H₂</text>
</svg>`;

  // ---------- 空氣組成 ----------
  const air = `<svg viewBox="0 0 520 120" width="520" role="img" aria-label="乾燥空氣的組成">
  <rect x="20" y="20" width="374" height="44" class="s-n2"/>
  <rect x="394" y="20" width="101" height="44" class="s-o2"/>
  <rect x="495" y="20" width="5" height="44" class="s-other"/>
  <text x="207" y="48" text-anchor="middle" class="s-text">氮氣 約 78%</text>
  <text x="444" y="48" text-anchor="middle" class="s-text">氧氣 約 21%</text>
  <line x1="497" y1="64" x2="497" y2="84" class="s-guide"/>
  <text x="500" y="100" text-anchor="end" class="s-small">其他約 1%：氬 0.93%、二氧化碳 約 0.04%、其他微量氣體</text>
</svg>`;

  // ---------- 溶液 = 溶質 + 溶劑 ----------
  const solution = `<svg viewBox="0 0 540 170" width="540" role="img" aria-label="溶質、溶劑與溶液">
  <polygon points="40,110 70,70 100,110" class="s-paper"/>
  <text x="70" y="136" text-anchor="middle" class="s-text">溶質：糖 20 g</text>
  <text x="140" y="100" text-anchor="middle" class="s-big">＋</text>
  <rect x="182" y="70" width="76" height="45" class="s-water"/>
  <path d="M180,40 L180,117 L260,117 L260,40" class="s-glass"/>
  <text x="220" y="136" text-anchor="middle" class="s-text">溶劑：水 80 g</text>
  <text x="300" y="100" text-anchor="middle" class="s-big">＝</text>
  <rect x="342" y="64" width="76" height="51" class="s-sugar"/>
  <path d="M340,40 L340,117 L420,117 L420,40" class="s-glass"/>
  <text x="380" y="136" text-anchor="middle" class="s-text">溶液：糖水 100 g</text>
  <text x="270" y="162" text-anchor="middle" class="s-accent-text">重量百分濃度 = 20 ÷ 100 × 100% = 20%</text>
</svg>`;

  // ---------- 溶解度曲線 ----------
  function solubility(o) {
    o = Object.assign({ example: true }, o || {});
    const X = t => 60 + t * 5, Y = s => r1(260 - s * 2);
    const kno3 = [[0, 13.3], [10, 20.9], [20, 31.6], [30, 45.8], [40, 63.9], [50, 85.5], [60, 110]];
    const nacl = [[0, 35.7], [20, 36.0], [40, 36.6], [60, 37.3]];
    const pts = a => a.map(([t, s]) => X(t) + "," + Y(s)).join(" ");
    let g = "";
    for (let t = 10; t <= 60; t += 10) g += `<line x1="${X(t)}" y1="20" x2="${X(t)}" y2="260" class="s-grid"/><text x="${X(t)}" y="278" text-anchor="middle" class="s-small">${t}</text>`;
    for (let s = 20; s <= 120; s += 20) g += `<line x1="60" y1="${Y(s)}" x2="360" y2="${Y(s)}" class="s-grid"/><text x="52" y="${Y(s) + 4}" text-anchor="end" class="s-small">${s}</text>`;
    return `<svg viewBox="0 0 440 310" width="440" role="img" aria-label="溶解度曲線">
  ${g}
  <line x1="60" y1="260" x2="370" y2="260" class="s-line"/><line x1="60" y1="260" x2="60" y2="12" class="s-line"/>
  <text x="52" y="276" text-anchor="end" class="s-small">0</text>
  <polyline points="${pts(kno3)}" class="s-accent-line"/>
  <polyline points="${pts(nacl)}" class="s-chem-line"/>
  <text x="${X(52)}" y="${Y(100)}" class="s-accent-text">硝酸鉀</text>
  <text x="${X(61)}" y="${Y(37.3) + 4}" class="s-chem-text">氯化鈉</text>
  ${o.example ? `<circle cx="${X(40)}" cy="${Y(63.9)}" r="4" class="s-dot"/>
  <line x1="${X(40)}" y1="${Y(63.9)}" x2="${X(40)}" y2="260" class="s-guide"/><line x1="${X(40)}" y1="${Y(63.9)}" x2="60" y2="${Y(63.9)}" class="s-guide"/>
  <text x="${X(40) + 8}" y="${Y(63.9) + 16}" class="s-small">40 °C 約 64 g</text>` : ""}
  <text x="210" y="302" text-anchor="middle" class="s-text">溫度（°C）</text>
  <text x="66" y="12" class="s-small">溶解度（g / 100 g 水）</text>
</svg>`;
  }

  window.FIG = {
    fig, ruler, meniscus, cylinder, displacement, balance, mvGraph, layers,
    classify, states, filtration, oxygen, collect, air, solution, solubility
  };
})();
