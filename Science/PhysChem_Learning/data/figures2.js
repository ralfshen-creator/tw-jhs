/*
 * 八上第 0、3～6 章與補充教材的圖解。擴充 figures.js 的 window.FIG，所以要在 figures.js 之後載入。
 */
(function () {
  const F = window.FIG;
  const r1 = n => Math.round(n * 10) / 10;
  const arrowDefs = id => `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" class="s-accent-fill"/></marker></defs>`;
  const flame = (x, y, s) => `<path d="M${x},${y} Q${x - 10 * s},${y - 16 * s} ${x},${y - 34 * s} Q${x + 10 * s},${y - 16 * s} ${x},${y} Z" class="s-flame"/>`;

  // ---------- 實驗室常用器材 ----------
  F.labware = `<svg viewBox="0 0 600 200" width="600" role="img" aria-label="實驗室常用器材">
  <path d="M18,58 L22,62 L22,150 L62,150 L62,60" class="s-glass"/><rect x="24" y="110" width="36" height="38" class="s-water"/>
  <path d="M108,40 L108,82 L86,150 L144,150 L122,82 L122,40" class="s-glass"/><path d="M95,128 L135,128 L141,148 L89,148 Z" class="s-water"/>
  <path d="M182,40 L182,135 Q190,152 198,135 L198,40" class="s-glass"/><path d="M184,110 L196,110 L196,135 Q190,146 184,135 Z" class="s-water"/>
  <path d="M255,30 L255,145 L275,145 L275,30" class="s-glass"/><rect x="246" y="145" width="38" height="7" rx="2" class="s-board"/>
  <line x1="255" y1="60" x2="263" y2="60" class="s-tick"/><line x1="255" y1="80" x2="263" y2="80" class="s-tick"/><line x1="255" y1="100" x2="263" y2="100" class="s-tick"/><line x1="255" y1="120" x2="263" y2="120" class="s-tick"/>
  <ellipse cx="340" cy="50" rx="10" ry="15" class="s-stopper"/><path d="M336,64 L336,128 L340,142 L344,128 L344,64" class="s-glass"/>
  <path d="M385,50 L445,50 L420,96 L420,150 L410,150 L410,96 Z" class="s-glass"/>
  <path d="M466,150 L514,150 Q520,112 490,106 Q460,112 466,150 Z" class="s-glass-fill"/><rect x="485" y="94" width="10" height="13" class="s-board"/>${flame(490, 94, 1)}
  <line x1="548" y1="40" x2="582" y2="148" class="s-rod"/>
  <text x="40" y="180" text-anchor="middle" class="s-text">燒杯</text>
  <text x="115" y="180" text-anchor="middle" class="s-text">錐形瓶</text>
  <text x="190" y="180" text-anchor="middle" class="s-text">試管</text>
  <text x="265" y="180" text-anchor="middle" class="s-text">量筒</text>
  <text x="340" y="180" text-anchor="middle" class="s-text">滴管</text>
  <text x="415" y="180" text-anchor="middle" class="s-text">漏斗</text>
  <text x="490" y="180" text-anchor="middle" class="s-text">酒精燈</text>
  <text x="565" y="180" text-anchor="middle" class="s-text">玻璃棒</text>
</svg>`;

  // ---------- 食鹽與細砂的分離 流程 ----------
  F.sepFlow = (() => {
    const step = (x, t1, t2) => `<rect x="${x}" y="40" width="110" height="60" rx="10" class="s-node"/>
  <text x="${x + 55}" y="66" text-anchor="middle" class="s-text">${t1}</text><text x="${x + 55}" y="88" text-anchor="middle" class="s-small">${t2}</text>`;
    return `<svg viewBox="0 0 560 150" width="560" role="img" aria-label="食鹽與細砂的分離步驟">${arrowDefs("arrSep")}
  ${step(10, "① 溶解", "加水攪拌")}${step(160, "② 過濾", "細砂留在濾紙")}${step(310, "③ 蒸發", "加熱濾液")}${step(440, "④ 得到食鹽", "白色晶體")}
  <line x1="122" y1="70" x2="156" y2="70" class="s-arrow" marker-end="url(#arrSep)"/>
  <line x1="272" y1="70" x2="306" y2="70" class="s-arrow" marker-end="url(#arrSep)"/>
  <line x1="422" y1="70" x2="436" y2="70" class="s-arrow" marker-end="url(#arrSep)"/>
  <text x="280" y="130" text-anchor="middle" class="s-small">食鹽溶於水、細砂不溶於水 → 先讓兩者分開，再把水蒸發掉</text>
</svg>`;
  })();

  // ---------- 橫波 ----------
  F.transWave = (() => {
    const A = 50, L = 160, x0 = 40, y0 = 110;
    let d = "";
    for (let x = 0; x <= 440; x += 4) d += (x ? " L" : "M") + (x0 + x) + "," + r1(y0 - A * Math.sin(2 * Math.PI * x / L));
    return `<svg viewBox="0 0 520 230" width="520" role="img" aria-label="橫波">${arrowDefs("arrTw")}
  <line x1="30" y1="${y0}" x2="500" y2="${y0}" class="s-guide"/>
  <path d="${d}" class="s-accent-line"/>
  <line x1="80" y1="24" x2="240" y2="24" class="s-arrow" marker-start="url(#arrTw)" marker-end="url(#arrTw)"/>
  <text x="160" y="16" text-anchor="middle" class="s-text">波長 λ</text>
  <line x1="80" y1="56" x2="80" y2="28" class="s-guide"/><line x1="240" y1="56" x2="240" y2="28" class="s-guide"/>
  <line x1="400" y1="${y0}" x2="400" y2="62" class="s-arrow" marker-start="url(#arrTw)" marker-end="url(#arrTw)"/>
  <text x="400" y="50" text-anchor="middle" class="s-small">振幅</text>
  <text x="126" y="60" class="s-small">← 波峰</text>
  <text x="160" y="182" text-anchor="middle" class="s-small">波谷</text>
  <line x1="40" y1="134" x2="40" y2="86" class="s-chem-line" marker-start="url(#arrTw)" marker-end="url(#arrTw)"/>
  <text x="28" y="212" class="s-chem-text">↕ 介質上下振動</text>
  <line x1="350" y1="208" x2="480" y2="208" class="s-arrow" marker-end="url(#arrTw)"/>
  <text x="340" y="213" text-anchor="end" class="s-text">波前進方向</text>
</svg>`;
  })();

  // ---------- 縱波（疏密波） ----------
  F.longWave = (() => {
    let lines = "";
    for (let s = 30; s <= 500; s += 11) {
      const x = r1(s + 12 * Math.sin(2 * Math.PI * (s - 30) / 160));
      lines += `<line x1="${x}" y1="40" x2="${x}" y2="90" class="s-tick"/>`;
    }
    return `<svg viewBox="0 0 530 170" width="530" role="img" aria-label="縱波">${arrowDefs("arrLw")}
  ${lines}
  <text x="110" y="110" text-anchor="middle" class="s-accent-text">密部</text>
  <text x="270" y="110" text-anchor="middle" class="s-accent-text">密部</text>
  <text x="430" y="110" text-anchor="middle" class="s-accent-text">密部</text>
  <text x="190" y="110" text-anchor="middle" class="s-small">疏部</text>
  <text x="350" y="110" text-anchor="middle" class="s-small">疏部</text>
  <line x1="110" y1="24" x2="270" y2="24" class="s-arrow" marker-start="url(#arrLw)" marker-end="url(#arrLw)"/>
  <text x="190" y="18" text-anchor="middle" class="s-small">波長（相鄰兩密部距離）</text>
  <line x1="40" y1="135" x2="100" y2="135" class="s-chem-line" marker-start="url(#arrLw)" marker-end="url(#arrLw)"/>
  <text x="110" y="140" class="s-chem-text">介質左右振動</text>
  <line x1="330" y1="155" x2="470" y2="155" class="s-arrow" marker-end="url(#arrLw)"/>
  <text x="320" y="160" text-anchor="end" class="s-text">波前進方向</text>
</svg>`;
  })();

  // ---------- 聲音三要素的波形 ----------
  F.waveforms = (() => {
    const curve = (x0, amp, cycles, shape, cls) => {
      let d = "";
      for (let i = 0; i <= 150; i += 2) {
        const ph = 2 * Math.PI * cycles * i / 150;
        const v = shape === "saw" ? (((cycles * i / 150) % 1) * 2 - 1) : shape === "mix" ? (Math.sin(ph) * 0.7 + Math.sin(3 * ph) * 0.3) : Math.sin(ph);
        d += (i ? " L" : "M") + (x0 + i) + "," + r1(85 - amp * v);
      }
      return `<path d="${d}" class="${cls}"/>`;
    };
    const panel = (x, title, sub, c1, c2) => `<rect x="${x - 8}" y="20" width="166" height="130" rx="8" class="s-board"/>
  <line x1="${x}" y1="85" x2="${x + 150}" y2="85" class="s-grid"/>${c1}${c2}
  <text x="${x + 75}" y="172" text-anchor="middle" class="s-text">${title}</text>
  <text x="${x + 75}" y="192" text-anchor="middle" class="s-small">${sub}</text>`;
    return `<svg viewBox="0 0 540 205" width="540" role="img" aria-label="聲音三要素的波形比較">
  ${panel(18, "響度", "看振幅：振幅大較大聲", curve(18, 50, 2, "sin", "s-accent-line"), curve(18, 20, 2, "sin", "s-chem-line"))}
  ${panel(196, "音調", "看頻率：波越密音調越高", curve(196, 40, 2, "sin", "s-accent-line"), curve(196, 40, 5, "sin", "s-chem-line"))}
  ${panel(374, "音色", "看波形：形狀不同", curve(374, 40, 2, "sin", "s-accent-line"), curve(374, 40, 2, "saw", "s-chem-line"))}
</svg>`;
  })();

  // ---------- 回聲測距 ----------
  F.echo = `<svg viewBox="0 0 520 170" width="520" role="img" aria-label="回聲測距">${arrowDefs("arrEc")}
  <path d="M30,92 L120,92 L105,112 L45,112 Z" class="s-metal"/><rect x="62" y="72" width="26" height="20" class="s-metal"/>
  <rect x="452" y="20" width="40" height="110" class="s-stone"/>
  <line x1="130" y1="70" x2="444" y2="70" class="s-arrow" marker-end="url(#arrEc)"/>
  <line x1="444" y1="100" x2="130" y2="100" class="s-chem-line" marker-end="url(#arrEc)"/>
  <text x="290" y="60" text-anchor="middle" class="s-text">發出聲波 →</text>
  <text x="290" y="122" text-anchor="middle" class="s-chem-text">← 遇到障礙物反射回來</text>
  <text x="472" y="148" text-anchor="middle" class="s-small">海底／山壁</text>
  <text x="260" y="160" text-anchor="middle" class="s-accent-text">距離 d = 聲速 × 來回時間 ÷ 2</text>
</svg>`;

  // ---------- 針孔成像 ----------
  F.pinhole = `<svg viewBox="0 0 520 210" width="520" role="img" aria-label="針孔成像">${arrowDefs("arrPh")}
  <line x1="80" y1="150" x2="80" y2="64" class="s-accent-line" marker-end="url(#arrPh)"/>
  <line x1="260" y1="20" x2="260" y2="100" class="s-line"/><line x1="260" y1="110" x2="260" y2="190" class="s-line"/>
  <line x1="440" y1="20" x2="440" y2="190" class="s-glass"/>
  <line x1="80" y1="60" x2="440" y2="150" class="s-guide"/><line x1="80" y1="150" x2="440" y2="60" class="s-guide"/>
  <line x1="440" y1="60" x2="440" y2="146" class="s-chem-line" marker-end="url(#arrPh)"/>
  <text x="80" y="176" text-anchor="middle" class="s-text">物體</text>
  <text x="260" y="206" text-anchor="middle" class="s-text">針孔</text>
  <text x="440" y="206" text-anchor="middle" class="s-text">屏幕</text>
  <text x="452" y="110" class="s-chem-text">倒立實像</text>
</svg>`;

  // ---------- 反射定律 ----------
  F.reflectionLaw = (() => {
    let hatch = "";
    for (let x = 64; x <= 356; x += 12) hatch += `<line x1="${x}" y1="190" x2="${x - 8}" y2="200" class="s-tick"/>`;
    return `<svg viewBox="0 0 420 230" width="420" role="img" aria-label="反射定律">${arrowDefs("arrRf")}
  <line x1="60" y1="190" x2="360" y2="190" class="s-line"/>${hatch}
  <line x1="210" y1="40" x2="210" y2="190" class="s-guide"/>
  <line x1="90" y1="70" x2="208" y2="188" class="s-accent-line" marker-end="url(#arrRf)"/>
  <line x1="210" y1="190" x2="328" y2="72" class="s-accent-line" marker-end="url(#arrRf)"/>
  <path d="M182,162 A40,40 0 0,1 210,150" class="s-chem-line"/><path d="M210,150 A40,40 0 0,1 238,162" class="s-chem-line"/>
  <text x="210" y="32" text-anchor="middle" class="s-small">法線（垂直鏡面）</text>
  <text x="150" y="140" text-anchor="end" class="s-chem-text">入射角</text>
  <text x="270" y="140" class="s-chem-text">反射角</text>
  <text x="80" y="64" class="s-text">入射光</text><text x="300" y="64" class="s-text">反射光</text>
  <text x="380" y="195" class="s-small">鏡面</text>
</svg>`;
  })();

  // ---------- 平面鏡成像 ----------
  F.planeMirror = `<svg viewBox="0 0 460 220" width="460" role="img" aria-label="平面鏡成像">${arrowDefs("arrPm")}
  <line x1="230" y1="30" x2="230" y2="180" class="s-line"/>
  <line x1="120" y1="160" x2="120" y2="84" class="s-accent-line" marker-end="url(#arrPm)"/>
  <line x1="340" y1="160" x2="340" y2="84" class="s-warn-line" marker-end="url(#arrPm)"/>
  <line x1="120" y1="196" x2="226" y2="196" class="s-arrow" marker-start="url(#arrPm)" marker-end="url(#arrPm)"/>
  <line x1="234" y1="196" x2="340" y2="196" class="s-arrow" marker-start="url(#arrPm)" marker-end="url(#arrPm)"/>
  <text x="175" y="214" text-anchor="middle" class="s-small">物距</text><text x="287" y="214" text-anchor="middle" class="s-small">像距（相等）</text>
  <text x="120" y="70" text-anchor="middle" class="s-text">物體</text>
  <text x="340" y="70" text-anchor="middle" class="s-text">像</text>
  <text x="230" y="22" text-anchor="middle" class="s-small">平面鏡</text>
  <text x="348" y="132" class="s-small">虛像</text>
  <text x="400" y="110" text-anchor="middle" class="s-small">正立</text><text x="400" y="128" text-anchor="middle" class="s-small">等大</text>
</svg>`;

  // ---------- 折射 ----------
  F.refraction = `<svg viewBox="0 0 420 260" width="420" role="img" aria-label="光的折射">${arrowDefs("arrRr")}
  <rect x="40" y="130" width="340" height="120" class="s-water"/>
  <line x1="40" y1="130" x2="380" y2="130" class="s-line"/>
  <line x1="210" y1="20" x2="210" y2="250" class="s-guide"/>
  <line x1="90" y1="20" x2="208" y2="128" class="s-accent-line" marker-end="url(#arrRr)"/>
  <line x1="210" y1="130" x2="278" y2="246" class="s-accent-line" marker-end="url(#arrRr)"/>
  <path d="M188,110 A30,30 0 0,1 210,100" class="s-chem-line"/><path d="M210,160 A30,30 0 0,0 225,156" class="s-chem-line"/>
  <text x="180" y="96" text-anchor="end" class="s-chem-text">入射角</text>
  <text x="232" y="176" class="s-chem-text">折射角（較小）</text>
  <text x="56" y="120" class="s-text">空氣</text><text x="56" y="152" class="s-text">水</text>
  <text x="290" y="226" class="s-small">偏向法線</text>
</svg>`;

  // ---------- 凸透鏡成像（物距 > 2f） ----------
  F.convexLens = `<svg viewBox="0 0 560 250" width="560" role="img" aria-label="凸透鏡成像光路">${arrowDefs("arrCl")}
  <line x1="20" y1="120" x2="540" y2="120" class="s-guide"/>
  <ellipse cx="280" cy="120" rx="10" ry="84" class="s-lens"/>
  <circle cx="190" cy="120" r="3.5" class="s-dot"/><circle cx="370" cy="120" r="3.5" class="s-dot"/>
  <circle cx="100" cy="120" r="3.5" class="s-dot"/><circle cx="460" cy="120" r="3.5" class="s-dot"/>
  <text x="190" y="140" text-anchor="middle" class="s-small">F</text><text x="370" y="140" text-anchor="middle" class="s-small">F</text>
  <text x="100" y="140" text-anchor="middle" class="s-small">2F</text><text x="460" y="140" text-anchor="middle" class="s-small">2F</text>
  <line x1="60" y1="120" x2="60" y2="74" class="s-accent-line" marker-end="url(#arrCl)"/>
  <polyline points="60,70 280,70 432,154.6" class="s-ray"/>
  <line x1="60" y1="70" x2="432" y2="154.6" class="s-ray"/>
  <polyline points="60,70 280,154.6 432,154.6" class="s-ray"/>
  <line x1="432" y1="120" x2="432" y2="151" class="s-chem-line" marker-end="url(#arrCl)"/>
  <text x="60" y="60" text-anchor="middle" class="s-text">物體</text>
  <text x="432" y="178" text-anchor="middle" class="s-chem-text">倒立縮小實像</text>
  <text x="280" y="226" text-anchor="middle" class="s-small">① 平行主軸 → 折射後經過焦點　② 經過鏡心 → 直線前進　③ 經過焦點 → 折射後平行主軸</text>
</svg>`;

  // ---------- 三稜鏡色散 ----------
  F.prism = (() => {
    const cols = ["#e53935", "#fb8c00", "#fdd835", "#43a047", "#1e88e5", "#3949ab", "#8e24aa"];
    const rays = cols.map((c, i) => `<line x1="318" y1="128" x2="470" y2="${150 + i * 11}" stroke="${c}" stroke-width="3"/>`).join("");
    return `<svg viewBox="0 0 520 240" width="520" role="img" aria-label="三稜鏡色散">
  <polygon points="160,200 260,30 360,200" class="s-prism"/>
  <line x1="20" y1="160" x2="200" y2="132" class="s-white-ray"/>
  <line x1="200" y1="132" x2="318" y2="128" class="s-white-ray"/>
  ${rays}
  <text x="40" y="150" class="s-text">白光</text>
  <text x="478" y="155" class="s-small">紅</text>
  <text x="478" y="221" class="s-small">紫</text>
  <text x="260" y="232" text-anchor="middle" class="s-small">紫光偏折最大、紅光偏折最小</text>
</svg>`;
  })();

  // ---------- 色光三原色 ----------
  F.rgb = `<svg viewBox="0 0 300 250" width="300" role="img" aria-label="色光三原色">
  <rect x="0" y="0" width="300" height="250" rx="10" fill="#111"/>
  <g style="mix-blend-mode:normal; isolation:isolate">
    <circle cx="150" cy="90" r="68" fill="#ff0000" style="mix-blend-mode:screen"/>
    <circle cx="112" cy="155" r="68" fill="#00ff00" style="mix-blend-mode:screen"/>
    <circle cx="188" cy="155" r="68" fill="#0000ff" style="mix-blend-mode:screen"/>
  </g>
  <text x="150" y="58" text-anchor="middle" fill="#fff" font-size="14">紅</text>
  <text x="80" y="185" text-anchor="middle" fill="#000" font-size="14">綠</text>
  <text x="220" y="185" text-anchor="middle" fill="#fff" font-size="14">藍</text>
  <text x="112" y="112" text-anchor="middle" fill="#000" font-size="13">黃</text>
  <text x="188" y="112" text-anchor="middle" fill="#000" font-size="13">洋紅</text>
  <text x="150" y="196" text-anchor="middle" fill="#000" font-size="13">青</text>
  <text x="150" y="140" text-anchor="middle" fill="#000" font-size="13">白</text>
</svg>`;

  // ---------- 近視與矯正 ----------
  F.eye = (() => {
    const eyeball = (cx) => `<circle cx="${cx}" cy="100" r="58" class="s-board"/><path d="M${cx + 42},60 A58,58 0 0,1 ${cx + 42},140" class="s-chem-line"/>
  <ellipse cx="${cx - 48}" cy="100" rx="7" ry="26" class="s-lens"/>`;
    return `<svg viewBox="0 0 540 220" width="540" role="img" aria-label="近視眼與凹透鏡矯正">
  ${eyeball(150)}
  <polyline points="10,82 102,82 180,100 228,116" class="s-ray"/><polyline points="10,118 102,118 180,100 228,84" class="s-ray"/>
  <circle cx="180" cy="100" r="4" class="s-dot"/>
  <text x="150" y="186" text-anchor="middle" class="s-text">近視：成像在視網膜前</text>
  ${eyeball(420)}
  <path d="M296,70 Q306,100 296,130 L312,130 Q302,100 312,70 Z" class="s-lens"/>
  <polyline points="270,86 304,86 372,78 466,100" class="s-ray"/><polyline points="270,114 304,114 372,122 466,100" class="s-ray"/>
  <circle cx="466" cy="100" r="4" class="s-dot"/>
  <text x="420" y="186" text-anchor="middle" class="s-text">戴凹透鏡：成像移到視網膜上</text>
  <text x="200" y="40" class="s-chem-text">視網膜</text>
</svg>`;
  })();

  // ---------- 攝氏與華氏 ----------
  F.tempScales = (() => {
    const Y = c => r1(220 - c * 1.8);
    const row = (c, f, label) => `<line x1="96" y1="${Y(c)}" x2="264" y2="${Y(c)}" class="s-guide"/>
  <text x="90" y="${Y(c) + 5}" text-anchor="end" class="s-text">${c} °C</text><text x="270" y="${Y(c) + 5}" class="s-text">${f} °F</text>
  <text x="180" y="${Y(c) - 6}" text-anchor="middle" class="s-small">${label}</text>`;
    return `<svg viewBox="0 0 360 260" width="360" role="img" aria-label="攝氏與華氏溫標">
  <rect x="124" y="20" width="18" height="210" rx="9" class="s-board"/><rect x="218" y="20" width="18" height="210" rx="9" class="s-board"/>
  <rect x="128" y="${Y(37)}" width="10" height="${r1(226 - Y(37))}" class="s-mercury"/><rect x="222" y="${Y(37)}" width="10" height="${r1(226 - Y(37))}" class="s-mercury"/>
  ${row(100, 212, "水的沸點")}${row(37, 98.6, "人的體溫")}${row(0, 32, "水的冰點")}
  <text x="133" y="250" text-anchor="middle" class="s-small">攝氏</text><text x="227" y="250" text-anchor="middle" class="s-small">華氏</text>
</svg>`;
  })();

  // ---------- 冰加熱曲線 ----------
  F.heatingCurve = (() => {
    const X = t => 60 + t * 42, Y = T => r1(230 - (T + 20) * 1.45);
    const pts = [[0, -20], [1, 0], [3, 0], [5, 100], [8, 100], [9, 120]];
    const lab = (x, y, text, a) => `<text x="${x}" y="${y}" text-anchor="${a || "middle"}" class="s-small">${text}</text>`;
    return `<svg viewBox="0 0 460 280" width="460" role="img" aria-label="冰加熱的溫度變化">
  <line x1="60" y1="230" x2="440" y2="230" class="s-line"/><line x1="60" y1="230" x2="60" y2="16" class="s-line"/>
  <line x1="60" y1="${Y(0)}" x2="440" y2="${Y(0)}" class="s-grid"/><line x1="60" y1="${Y(100)}" x2="440" y2="${Y(100)}" class="s-grid"/>
  <text x="52" y="${Y(0) + 5}" text-anchor="end" class="s-small">0</text><text x="52" y="${Y(100) + 5}" text-anchor="end" class="s-small">100</text>
  <polyline points="${pts.map(([t, T]) => X(t) + "," + Y(T)).join(" ")}" class="s-accent-line"/>
  ${lab(64, 196, "固態", "start")}${lab(X(2), Y(0) - 10, "熔化（固液共存）")}${lab(X(4) + 10, Y(50) + 10, "液態", "start")}${lab(X(6.5), Y(100) - 10, "沸騰（液氣共存）")}${lab(X(8.6), Y(110) - 14, "氣態")}
  <text x="250" y="262" text-anchor="middle" class="s-text">加熱時間</text>
  <text x="66" y="14" class="s-small">溫度（°C）</text>
  <text x="${X(0.3)}" y="${Y(70)}" class="s-chem-text">水平段：持續吸熱，</text><text x="${X(0.3)}" y="${Y(70) + 20}" class="s-chem-text">溫度不變</text>
</svg>`;
  })();

  // ---------- 比熱比較 ----------
  F.specificHeat = (() => {
    const X = t => 60 + t * 32, Y = T => r1(240 - T * 2.4);
    let g = "";
    for (let T = 20; T <= 80; T += 20) g += `<line x1="60" y1="${Y(T)}" x2="380" y2="${Y(T)}" class="s-grid"/><text x="52" y="${Y(T) + 4}" text-anchor="end" class="s-small">${T}</text>`;
    for (let t = 2; t <= 10; t += 2) g += `<text x="${X(t)}" y="258" text-anchor="middle" class="s-small">${t}</text>`;
    return `<svg viewBox="0 0 420 290" width="420" role="img" aria-label="水與沙拉油加熱的溫度變化">
  ${g}<line x1="60" y1="240" x2="390" y2="240" class="s-line"/><line x1="60" y1="240" x2="60" y2="20" class="s-line"/>
  <line x1="${X(0)}" y1="${Y(20)}" x2="${X(10)}" y2="${Y(80)}" class="s-chem-line"/>
  <line x1="${X(0)}" y1="${Y(20)}" x2="${X(10)}" y2="${Y(45)}" class="s-accent-line"/>
  <text x="${X(10) - 4}" y="${Y(80) - 8}" text-anchor="end" class="s-chem-text">沙拉油</text>
  <text x="${X(10) - 4}" y="${Y(45) - 8}" text-anchor="end" class="s-accent-text">水</text>
  <text x="225" y="282" text-anchor="middle" class="s-text">加熱時間（分）</text>
  <text x="66" y="16" class="s-small">溫度（°C）</text>
</svg>`;
  })();

  // ---------- 熱的傳播三方式 ----------
  F.heatTransfer = `<svg viewBox="0 0 560 230" width="560" role="img" aria-label="熱的傳導、對流、輻射">${arrowDefs("arrHt")}
  <rect x="20" y="60" width="150" height="10" rx="3" class="s-metal"/>
  ${flame(40, 110, 1.1)}
  <circle cx="80" cy="76" r="5" class="s-wax"/><circle cx="110" cy="76" r="5" class="s-wax"/><circle cx="140" cy="76" r="5" class="s-wax"/>
  <circle cx="80" cy="100" r="4" class="s-wax"/>
  <line x1="60" y1="46" x2="160" y2="46" class="s-arrow" marker-end="url(#arrHt)"/>
  <text x="95" y="160" text-anchor="middle" class="s-text">傳導</text>
  <text x="95" y="180" text-anchor="middle" class="s-small">固體中由高溫傳到低溫</text>
  <text x="95" y="198" text-anchor="middle" class="s-small">離火近的蠟先融化掉落</text>

  <path d="M220,30 L220,130 L330,130 L330,30" class="s-glass"/><rect x="222" y="50" width="106" height="78" class="s-water"/>
  ${flame(275, 158, 0.8)}
  <path d="M275,120 L275,64 M275,64 Q300,58 312,80 L312,110 Q300,124 285,122" class="s-chem-line" marker-end="url(#arrHt)"/>
  <path d="M275,64 Q250,58 238,80 L238,110 Q250,124 265,122" class="s-chem-line" marker-end="url(#arrHt)"/>
  <text x="275" y="180" text-anchor="middle" class="s-text">對流</text>
  <text x="275" y="198" text-anchor="middle" class="s-small">液體、氣體：熱的上升、冷的下降</text>

  <circle cx="420" cy="70" r="24" class="s-sun"/>
  <path d="M452,62 q8,-6 16,0 t16,0 t16,0" class="s-chem-line"/><path d="M452,78 q8,-6 16,0 t16,0 t16,0" class="s-chem-line" marker-end="url(#arrHt)"/>
  <circle cx="530" cy="70" r="14" class="s-node"/>
  <text x="470" y="160" text-anchor="middle" class="s-text">輻射</text>
  <text x="470" y="180" text-anchor="middle" class="s-small">不需要介質，</text>
  <text x="470" y="198" text-anchor="middle" class="s-small">真空也能傳（太陽 → 地球）</text>
</svg>`;

  // ---------- 原子模型 ----------
  F.atom = `<svg viewBox="0 0 440 240" width="440" role="img" aria-label="原子結構示意">
  <ellipse cx="150" cy="120" rx="110" ry="40" class="s-orbit"/><ellipse cx="150" cy="120" rx="110" ry="40" class="s-orbit" transform="rotate(60 150 120)"/>
  <circle cx="143" cy="114" r="9" class="s-proton"/><circle cx="157" cy="126" r="9" class="s-proton"/>
  <circle cx="157" cy="112" r="9" class="s-neutron"/><circle cx="143" cy="128" r="9" class="s-neutron"/>
  <circle cx="260" cy="120" r="7" class="s-electron"/><circle cx="95" cy="25" r="7" class="s-electron"/>
  <text x="148" y="119" text-anchor="middle" fill="#fff" font-size="11">+</text>
  <text x="270" y="30" class="s-small">質子（帶正電）</text>
  <text x="270" y="50" class="s-small">中子（不帶電）</text>
  <text x="270" y="70" class="s-small">電子（帶負電）</text>
  <circle cx="264" cy="26" r="5" class="s-proton"/><circle cx="264" cy="46" r="5" class="s-neutron"/><circle cx="264" cy="66" r="5" class="s-electron"/>
  <text x="150" y="200" text-anchor="middle" class="s-text">氦原子：2 個質子、2 個中子、2 個電子</text>
  <text x="150" y="222" text-anchor="middle" class="s-small">示意圖未依比例：實際原子核比原子小約十萬倍</text>
</svg>`;

  // ---------- 週期表（前 20 個元素） ----------
  F.ptable = (() => {
    const els = [
      [1, "H", 1, 1, "n"], [2, "He", 1, 18, "g"],
      [3, "Li", 2, 1, "m"], [4, "Be", 2, 2, "m"], [5, "B", 2, 13, "n"], [6, "C", 2, 14, "n"], [7, "N", 2, 15, "n"], [8, "O", 2, 16, "n"], [9, "F", 2, 17, "n"], [10, "Ne", 2, 18, "g"],
      [11, "Na", 3, 1, "m"], [12, "Mg", 3, 2, "m"], [13, "Al", 3, 13, "m"], [14, "Si", 3, 14, "n"], [15, "P", 3, 15, "n"], [16, "S", 3, 16, "n"], [17, "Cl", 3, 17, "n"], [18, "Ar", 3, 18, "g"],
      [19, "K", 4, 1, "m"], [20, "Ca", 4, 2, "m"]
    ];
    const cls = { m: "s-cell-metal", n: "s-cell-nonmetal", g: "s-cell-noble" };
    const W = 29, X = c => 40 + (c - 1) * W, Y = p => 40 + (p - 1) * 40;
    let s = els.map(([z, sym, p, g, k]) => `<rect x="${X(g)}" y="${Y(p)}" width="${W - 2}" height="38" rx="3" class="${cls[k]}"/>
  <text x="${X(g) + 3}" y="${Y(p) + 11}" class="s-tiny">${z}</text><text x="${X(g) + 13.5}" y="${Y(p) + 30}" text-anchor="middle" class="s-text">${sym}</text>`).join("");
    for (let p = 1; p <= 4; p++) s += `<text x="30" y="${Y(p) + 25}" text-anchor="end" class="s-small">${p}</text>`;
    [[1, "1族"], [2, "2族"], [17, "17族"], [18, "18族"]].forEach(([g, t]) => { s += `<text x="${X(g) + 13.5}" y="32" text-anchor="middle" class="s-small">${t}</text>`; });
    return `<svg viewBox="0 0 580 240" width="580" role="img" aria-label="週期表前 20 個元素">${s}
  <text x="8" y="32" class="s-small">週期</text>
  <rect x="160" y="172" width="14" height="14" class="s-cell-metal"/><text x="180" y="184" class="s-small">金屬</text>
  <rect x="230" y="172" width="14" height="14" class="s-cell-nonmetal"/><text x="250" y="184" class="s-small">非金屬</text>
  <rect x="314" y="172" width="14" height="14" class="s-cell-noble"/><text x="334" y="184" class="s-small">惰性氣體</text>
  <text x="290" y="220" text-anchor="middle" class="s-small">橫列 = 週期；直行 = 族（同族化學性質相似）。左上角數字是原子序</text>
</svg>`;
  })();

  // ---------- 分子模型 ----------
  F.molecules = `<svg viewBox="0 0 500 170" width="500" role="img" aria-label="分子模型">
  <circle cx="80" cy="70" r="26" class="s-atom-o"/><circle cx="50" cy="96" r="15" class="s-atom-h"/><circle cx="110" cy="96" r="15" class="s-atom-h"/>
  <circle cx="230" cy="70" r="26" class="s-atom-o"/><circle cx="272" cy="70" r="26" class="s-atom-o"/>
  <circle cx="370" cy="70" r="24" class="s-atom-o"/><circle cx="414" cy="70" r="22" class="s-atom-c"/><circle cx="458" cy="70" r="24" class="s-atom-o"/>
  <text x="80" y="140" text-anchor="middle" class="s-text">H₂O 水</text><text x="80" y="160" text-anchor="middle" class="s-small">2 個 H + 1 個 O</text>
  <text x="251" y="140" text-anchor="middle" class="s-text">O₂ 氧氣</text><text x="251" y="160" text-anchor="middle" class="s-small">2 個 O</text>
  <text x="414" y="140" text-anchor="middle" class="s-text">CO₂ 二氧化碳</text><text x="414" y="160" text-anchor="middle" class="s-small">1 個 C + 2 個 O</text>
</svg>`;

  // ---------- 八上預備章：正比與反比 ----------
  F.proportion = (() => {
    const panel = (x0, title, sub, pts, cls) => {
      const X = v => x0 + 40 + v * 36, Y = v => 200 - v * 36;
      let g = "";
      for (let i = 1; i <= 5; i++) g += `<line x1="${X(i)}" y1="20" x2="${X(i)}" y2="200" class="s-grid"/><text x="${X(i)}" y="216" text-anchor="middle" class="s-small">${i}</text>`
        + `<line x1="${X(0)}" y1="${Y(i)}" x2="${X(5)}" y2="${Y(i)}" class="s-grid"/><text x="${X(0) - 8}" y="${Y(i) + 4}" text-anchor="end" class="s-small">${i}</text>`;
      return `${g}<line x1="${X(0)}" y1="200" x2="${X(5) + 10}" y2="200" class="s-line"/><line x1="${X(0)}" y1="200" x2="${X(0)}" y2="12" class="s-line"/>
  <polyline points="${pts.map(([a, b]) => X(a) + "," + Y(b)).join(" ")}" class="${cls}"/>
  <text x="${X(5) + 14}" y="204" class="s-small">x</text><text x="${X(0) - 4}" y="10" class="s-small">y</text>
  <text x="${x0 + 130}" y="238" text-anchor="middle" class="s-text">${title}</text>
  <text x="${x0 + 130}" y="256" text-anchor="middle" class="s-small">${sub}</text>`;
    };
    const inv = [];
    for (let x = 0.8; x <= 5.001; x += 0.1) inv.push([Math.round(x * 100) / 100, Math.round(4 / x * 100) / 100]);
    return `<svg viewBox="0 0 560 265" width="560" role="img" aria-label="正比與反比的圖形">
  ${panel(0, "正比：y = kx", "通過原點的直線，y ÷ x 固定", [[0, 0], [5, 5]], "s-accent-line")}
  ${panel(290, "反比：x × y = k", "越來越平的曲線，x × y 固定", inv, "s-chem-line")}
</svg>`;
  })();

  // ---------- 感應起電（以帶負電的棒為例） ----------
  // o: { rod, ground: "on"|"cut"|"none", charges: "split"|"near"|"even"|"none", arrow, t1, t2 }
  function inductionPanel(x0, o) {
    const g = (x, y, s, cls) => `<text x="${x0 + x}" y="${y}" text-anchor="middle" class="${cls}">${s}</text>`;
    let s = "";
    if (o.rod) {
      s += `<rect x="${x0 + 6}" y="60" width="22" height="90" rx="4" class="s-rodneg"/>`;
      [80, 100, 120, 140].forEach(y => { s += g(17, y + 5, "−", "s-minus"); });
      s += `<text x="${x0 + 4}" y="52" class="s-tiny">帶負電的棒</text>`;
    }
    s += `<circle cx="${x0 + 88}" cy="105" r="34" class="s-sphere"/>
  <line x1="${x0 + 88}" y1="139" x2="${x0 + 88}" y2="178" class="s-line"/><line x1="${x0 + 66}" y1="178" x2="${x0 + 110}" y2="178" class="s-line"/>
  ${g(88, 192, "絕緣支架", "s-tiny")}`;
    if (o.charges === "split") {
      [90, 107, 124].forEach(y => { s += g(66, y, "+", "s-plus") + g(110, y, "−", "s-minus"); });
    } else if (o.charges === "near") {
      [90, 107, 124].forEach(y => { s += g(66, y, "+", "s-plus"); });
    } else if (o.charges === "even") {
      [[88, 86], [68, 109], [108, 109], [88, 128]].forEach(([x, y]) => { s += g(x, y, "+", "s-plus"); });
    }
    const groundSym = `<line x1="${x0 + 134}" y1="172" x2="${x0 + 158}" y2="172" class="s-line"/><line x1="${x0 + 138}" y1="178" x2="${x0 + 154}" y2="178" class="s-line"/><line x1="${x0 + 142}" y1="184" x2="${x0 + 150}" y2="184" class="s-line"/>`;
    if (o.ground === "on") {
      s += `<path d="M${x0 + 122},105 L${x0 + 146},105 L${x0 + 146},172" class="s-wire"/>${groundSym}`;
      if (o.arrow) s += g(132, 140, "e⁻", "s-minus") + `<path d="M${x0 + 140},120 L${x0 + 140},158" class="s-chem-line"/><path d="M${x0 + 135},151 L${x0 + 140},160 L${x0 + 145},151" class="s-chem-line"/>`;
      if (o.arrowUp) s += g(132, 140, "e⁻", "s-minus") + `<path d="M${x0 + 140},158 L${x0 + 140},120" class="s-chem-line"/><path d="M${x0 + 135},127 L${x0 + 140},118 L${x0 + 145},127" class="s-chem-line"/>`;
    } else if (o.ground === "cut") {
      s += `<path d="M${x0 + 122},105 L${x0 + 134},105" class="s-wire"/><path d="M${x0 + 146},116 L${x0 + 146},172" class="s-wire"/>${groundSym}`
        + g(146, 104, "✂", "s-small") + g(128, 132, "斷開", "s-tiny");
    }
    s += `<text x="${x0 + 80}" y="210" text-anchor="middle" class="s-text">${o.t1}</text>
  <text x="${x0 + 80}" y="228" text-anchor="middle" class="s-small">${o.t2}</text>`;
    return s;
  }
  F.induction = `<svg viewBox="0 0 640 240" width="640" role="img" aria-label="感應起電的四個步驟">
  ${inductionPanel(0, { rod: true, ground: "none", charges: "split", t1: "① 帶電棒靠近", t2: "近端感應出 +、遠端 −" })}
  ${inductionPanel(160, { rod: true, ground: "on", charges: "near", arrow: true, t1: "② 接地", t2: "電子被排斥流入大地" })}
  ${inductionPanel(320, { rod: true, ground: "cut", charges: "near", t1: "③ 先斷開接地", t2: "棒還在，+ 被吸在近端" })}
  ${inductionPanel(480, { rod: false, ground: "none", charges: "even", t1: "④ 再移走帶電棒", t2: "導體帶正電，均勻分布" })}
</svg>`;
  F.inductionWrong = `<svg viewBox="0 0 330 240" width="330" role="img" aria-label="感應起電順序錯誤的結果">
  ${inductionPanel(0, { rod: false, ground: "on", charges: "even", arrowUp: true, t1: "✘ 接地時先移走棒", t2: "正電吸引電子從大地流回" })}
  ${inductionPanel(165, { rod: false, ground: "none", charges: "none", t1: "再斷開接地", t2: "導體不帶電" })}
</svg>`;

  // ---------- 補充：自製溫度計 ----------
  F.selfThermo = `<svg viewBox="0 0 360 250" width="360" role="img" aria-label="自製溫度計">
  <path d="M110,110 L80,220 L200,220 L170,110 L170,80 L110,80 Z" class="s-glass-fill"/>
  <path d="M84,205 L196,205 L200,220 L80,220 Z" class="s-tint"/><path d="M89,186 L191,186 L196,205 L84,205 Z" class="s-tint"/>
  <path d="M110,110 L80,220 L200,220 L170,110 L170,80 L110,80 Z" class="s-glass"/>
  <rect x="104" y="70" width="72" height="16" rx="3" class="s-stopper"/>
  <rect x="134" y="20" width="12" height="186" class="s-tube-glass"/>
  <rect x="136" y="70" width="8" height="134" class="s-tint"/>
  <line x1="150" y1="70" x2="196" y2="70" class="s-guide"/><text x="200" y="74" class="s-small">受熱：液柱上升</text>
  <line x1="150" y1="110" x2="196" y2="110" class="s-guide"/><text x="200" y="114" class="s-small">原本的高度（做記號）</text>
  <text x="200" y="196" class="s-small">裝滿有色的水</text>
  <text x="180" y="244" text-anchor="middle" class="s-small">原理：液體熱脹冷縮，細管放大體積變化</text>
</svg>`;

  // ---------- 圖外文字說明（圖中重要標註的文字版） ----------
  F.NOTES = {
    "橫波": ["波長 λ：相鄰兩個波峰之間的距離", "振幅：介質離開平衡位置（虛線）的最大距離", "波峰是最高點、波谷是最低點", "介質上下振動，波向右前進：振動方向與前進方向垂直"],
    "縱波": ["密部：介質擠在一起的地方；疏部：介質分開的地方", "波長：相鄰兩個密部（或兩個疏部）之間的距離", "介質左右振動，波向右前進：振動方向與前進方向平行"],
    "聲音三要素的波形比較": ["響度：兩條波頻率相同、振幅不同 → 振幅大的較大聲", "音調：兩條波振幅相同、疏密不同 → 波越密（頻率越高）音調越高", "音色：兩條波頻率、振幅相同但形狀不同 → 音色不同"],
    "回聲測距": ["聲波從船發出，碰到海底或山壁反射回來", "量到的時間是「來回」的時間", "距離 = 聲速 × 來回時間 ÷ 2"],
    "量筒讀數的視線": ["正確：視線與凹液面最低處平齊（平視），讀作 20.0 mL", "俯視（由上往下看）：讀數偏大", "仰視（由下往上看）：讀數偏小"],
    "凸透鏡成像光路": ["F 是焦點、2F 是兩倍焦距的位置", "物體放在 2F 之外", "三條特殊光線的交點就是像的位置：成倒立、縮小的實像"],
    "冰加熱的溫度變化": ["第一段：冰（固態）溫度上升到 0 °C", "0 °C 水平段：熔化，固液共存，吸熱但溫度不變", "第三段：水（液態）溫度上升到 100 °C", "100 °C 水平段：沸騰，液氣共存，吸熱但溫度不變", "最後：水蒸氣（氣態）溫度上升"],
    "感應起電的四個步驟": ["① 帶負電的棒靠近：球的近端感應出正電、遠端負電", "② 接地：遠端的電子被排斥，流入大地", "③ 先斷開接地：棒還在，正電被吸在近端", "④ 再移走棒：正電均勻分布，球帶正電"],
    "溶解度曲線": ["橫軸是溫度（°C），縱軸是 100 g 水最多能溶解的克數", "硝酸鉀：溫度越高溶解度越大，變化很大", "氯化鈉：溶解度約 36 g，幾乎不隨溫度改變"],
    "質量-體積關係圖": ["橫軸是體積（cm³），縱軸是質量（g）", "甲：體積 20 cm³ 時質量 50 g，密度 2.5 g/cm³", "乙：體積 40 cm³ 時質量 40 g，密度 1 g/cm³", "直線越陡（斜率越大），密度越大"],
    "反射定律": ["法線：垂直鏡面的虛線", "入射角、反射角都是光線與法線的夾角，兩者相等"],
    "光的折射": ["上面是空氣、下面是水", "光由空氣斜射入水，折射光偏向法線（折射角比入射角小）"]
  };
})();
