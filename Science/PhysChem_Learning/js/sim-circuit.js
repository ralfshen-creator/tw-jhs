/*
 * 串聯與並聯模擬器
 * 模型：理想電池（n 顆 × 1.5 V、無內電阻）接兩個燈泡（視為定值電阻 R1、R2），理想電表，導線電阻忽略。
 *   串聯：R總 = R1 + R2，I 處處相同，V1 = I × R1、V2 = I × R2；任一燈泡拿掉 → 斷路，電流為 0
 *   並聯：各支路電壓 = 電源電壓，I1 = V ÷ R1、I2 = V ÷ R2，I總 = I1 + I2，R總 = V ÷ I總
 * 燈泡亮度用電功率 P = V × I 示意（九下會學）。學習任務沿用 SimTasks。
 */
(function () {
  const CELL = 1.5, MAX_CELLS = 8, RS = [2, 4, 6, 12];
  const KEY = "pc.simCircuit";

  const TASKS = [
    {
      id: "series", title: "任務一：串聯時的電流與電壓",
      predict: { q: "兩個電阻不同的燈泡串聯在電池上，通過兩個燈泡的電流大小關係是？", options: ["電阻大的燈泡電流較大", "電阻小的燈泡電流較大", "兩個燈泡的電流相同", "無法判斷"], answer: 2 },
      observe: "選「串聯」，把燈泡 1、燈泡 2 設成不同電阻（例如 2 Ω 和 6 Ω），按「記錄目前數值」；再換另一組不同的電阻記錄一次。比較安培計 A₁、A₂ 和兩個燈泡的電壓。",
      need: rows => new Set(rows.filter(r => r.mode === "series" && r.on1 && r.on2 && r.R1 !== r.R2).map(r => r.R1 + "-" + r.R2)).size >= 2,
      needText: "串聯、兩個燈泡電阻不同，記錄 2 組不同的組合",
      reason: { q: "為什麼會這樣？", options: ["串聯只有一條路徑，電流處處相同；電壓則依電阻分配，電阻大的分到的電壓較多", "電流先經過的燈泡會把電流用掉一些", "電阻大的燈泡會擋住電流，所以它的電流較小", "兩個燈泡各自由電池的一端供電"], answer: 0 },
      explain: "串聯時電流只有一條路可以走，所以 A₁ = A₂，電流處處相同。兩個燈泡的電壓相加等於電源電壓（V₁ + V₂ = V），而且 V₁ : V₂ = R₁ : R₂，電阻大的分到較多電壓、也比較亮。電流不會被燈泡「用掉」，被轉換的是電能。"
    },
    {
      id: "parallel", title: "任務二：並聯後的總電阻",
      predict: { q: "兩個電阻並聯後的總電阻，和其中任何一個電阻相比？", options: ["比兩個都大", "比兩個都小", "介於兩者之間", "等於兩者相加"], answer: 1 },
      observe: "選「並聯」，記錄 2 組以上不同的電阻組合（例如 6 Ω 與 12 Ω、4 Ω 與 4 Ω），比較表中的總電阻和 R₁、R₂。",
      need: rows => new Set(rows.filter(r => r.mode === "parallel" && r.on1 && r.on2).map(r => r.R1 + "-" + r.R2)).size >= 2,
      needText: "並聯、兩個燈泡都在，記錄 2 組不同的電阻組合",
      reason: { q: "為什麼並聯後總電阻反而變小？", options: ["並聯多了一條讓電流通過的路徑，總電流變大，所以總電阻變小：1/R = 1/R₁ + 1/R₂", "並聯時電阻會相加", "並聯時電源電壓變小了", "並聯時總電流變小了"], answer: 0 },
      explain: "並聯時每條支路都直接接在電源兩端，電壓都等於電源電壓，總電流 = I₁ + I₂。多一條路，同樣電壓下流過的總電流變多，所以總電阻 R = V ÷ I總 比任何一個支路的電阻都小。例如 6 Ω 和 12 Ω 並聯：1/R = 1/6 + 1/12 = 3/12，R = 4 Ω。"
    },
    {
      id: "remove", title: "任務三：拿掉一個燈泡",
      predict: { q: "家裡的電燈是並聯的。在並聯電路中拿掉一個燈泡，另一個燈泡會怎樣？", options: ["跟著熄滅", "照常亮，亮度不變", "變得更亮", "變暗"], answer: 1 },
      observe: "分別在「串聯」和「並聯」時，按「拿掉燈泡 1」，各記錄一次，觀察燈泡 2 和各個安培計的變化。",
      need: rows => rows.some(r => r.mode === "series" && !r.on1) && rows.some(r => r.mode === "parallel" && !r.on1),
      needText: "串聯、並聯各拿掉燈泡 1 記錄一次",
      reason: { q: "為什麼串聯和並聯的結果不同？", options: ["並聯各支路獨立，另一條支路的電壓仍是電源電壓；串聯只有一條路徑，一斷開就全部沒有電流", "串聯的電池比較弱", "並聯的燈泡比較耐用", "拿掉燈泡後電池的電壓變了"], answer: 0 },
      explain: "串聯只有一條路，拿掉任何一個燈泡就斷路，電流變成 0，另一個燈泡也熄滅。並聯時另一條支路仍然直接接在電源兩端，電壓、電流都不變，所以亮度不變；只是總電流變小（少了一條支路）。家裡的電器都是並聯，才能各自開關。"
    }
  ];

  let st = null, narrow = false;
  const panel = window.SimTasks.create({ tasks: TASKS, key: KEY, getState: () => st });

  function solve(s) {
    const V = s.cells * CELL;
    const r = { V, I1: 0, I2: 0, It: 0, V1: 0, V2: 0, Rt: Infinity };
    if (s.mode === "series") {
      if (s.on1 && s.on2) { r.Rt = s.R1 + s.R2; r.It = r.I1 = r.I2 = V / r.Rt; r.V1 = r.I1 * s.R1; r.V2 = r.I2 * s.R2; }
    } else {
      if (s.on1) { r.I1 = V / s.R1; r.V1 = V; }
      if (s.on2) { r.I2 = V / s.R2; r.V2 = V; }
      r.It = r.I1 + r.I2;
      if (r.It > 0) r.Rt = V / r.It;
    }
    r.P1 = r.V1 * r.I1; r.P2 = r.V2 * r.I2;
    return r;
  }
  const fA = I => I.toFixed(2) + " A";
  const fV = V => V.toFixed(2) + " V";
  const fR = R => isFinite(R) ? (Math.round(R * 100) / 100) + " Ω" : "∞（斷路）";
  // 亮度示意：功率 0～約 24 W 對應 0～1，用平方根讓小功率也看得出差別
  const glow = P => Math.min(1, Math.sqrt(P / 24));

  function render(root) {
    st = { cells: 4, R1: 2, R2: 6, mode: "series", on1: true, on2: true, rows: [] };
    window.SimCircuit.state = st;
    root.innerHTML = `
<p class="small"><a href="#/sim">← 模擬實驗</a> ／ 九上 第4章 基本的靜電現象與電路</p>
<h1>💡 串聯與並聯模擬：電流、電壓與總電阻</h1>
<p class="muted">兩個燈泡可以串聯或並聯。改變電阻、拿掉燈泡，觀察安培計、燈泡電壓和亮度的變化。先預測，再動手，最後說出原因。</p>
<div class="card sim-card">
  <div id="cirSvg" class="cir-svg"></div>
  <ul class="cir-legend" id="cirLegend"></ul>
  <div class="sim-readout" id="cirReadout" aria-live="polite"></div>
  <div class="sim-controls">
    <div class="ohm-ctl"><span>接法</span>
      <label class="seg-radio"><input type="radio" name="cirMode" value="series" checked> 串聯</label>
      <label class="seg-radio"><input type="radio" name="cirMode" value="parallel"> 並聯</label></div>
    <div class="ohm-ctl"><span>電池</span>
      <button class="btn small ghost" id="cirMinus" aria-label="減少一顆電池">－</button>
      <b id="cirCells"></b>
      <button class="btn small ghost" id="cirPlus" aria-label="增加一顆電池">＋</button></div>
    <div class="ohm-ctl"><span>燈泡 1</span>${RS.map(r => `<label class="seg-radio"><input type="radio" name="cirR1" value="${r}" ${r === st.R1 ? "checked" : ""}> ${r} Ω</label>`).join("")}
      <label class="seg-radio"><input type="checkbox" id="cirOff1"> 拿掉燈泡 1</label></div>
    <div class="ohm-ctl"><span>燈泡 2</span>${RS.map(r => `<label class="seg-radio"><input type="radio" name="cirR2" value="${r}" ${r === st.R2 ? "checked" : ""}> ${r} Ω</label>`).join("")}
      <label class="seg-radio"><input type="checkbox" id="cirOff2"> 拿掉燈泡 2</label></div>
  </div>
  <div class="row">
    <button class="btn small" id="cirRecord">📋 記錄目前數值</button>
    <button class="btn small ghost" id="cirClear">清除紀錄</button>
    <span class="small muted">黃色虛線的移動方向是<b>電流方向</b>，跑得越快表示電流越大。</span>
  </div>
  <div class="table-scroll"><table class="small" id="cirTable" style="margin-top:10px"></table></div>
</div>
<div class="box warn small"><b>模型的假設與適用範圍</b>
<ul style="margin:4px 0">
<li>燈泡視為<b>電阻固定</b>的元件。真實燈泡的燈絲溫度升高時電阻會變大，所以實際數值會和這裡不同</li>
<li>電池每顆 1.5 V、沒有內電阻；理想電表（安培計電阻為 0、伏特計不分走電流）；導線電阻忽略</li>
<li>燈泡亮度用電功率 P = V × I 示意（九下會學），不是真實的亮度。功率越大畫得越亮</li>
<li>並聯 2 Ω 與 2 Ω 接 12 V 時總電流達 12 A，真實電池與導線會過熱，<b>不要在家用真電池這樣接</b></li>
</ul></div>
<div id="cirTasks">${panel.html()}</div>`;

    const $ = id => root.querySelector("#" + id);
    const refresh = () => { draw(root); panel.update(); };
    $("cirMinus").addEventListener("click", () => { st.cells = Math.max(1, st.cells - 1); refresh(); });
    $("cirPlus").addEventListener("click", () => { st.cells = Math.min(MAX_CELLS, st.cells + 1); refresh(); });
    root.querySelectorAll("input[name=cirMode]").forEach(r => r.addEventListener("change", () => { st.mode = r.value; refresh(); }));
    root.querySelectorAll("input[name=cirR1]").forEach(r => r.addEventListener("change", () => { st.R1 = +r.value; refresh(); }));
    root.querySelectorAll("input[name=cirR2]").forEach(r => r.addEventListener("change", () => { st.R2 = +r.value; refresh(); }));
    $("cirOff1").addEventListener("change", e => { st.on1 = !e.target.checked; refresh(); });
    $("cirOff2").addEventListener("change", e => { st.on2 = !e.target.checked; refresh(); });
    $("cirRecord").addEventListener("click", () => {
      const s = solve(st);
      st.rows.push({ mode: st.mode, cells: st.cells, R1: st.R1, R2: st.R2, on1: st.on1, on2: st.on2, s });
      refresh();
    });
    $("cirClear").addEventListener("click", () => { st.rows = []; refresh(); });
    panel.mount($("cirTasks"));
    if ("ResizeObserver" in window) new ResizeObserver(() => { if (document.body.contains(root.querySelector("#cirSvg"))) draw(root); }).observe($("cirSvg"));
    refresh();
  }

  function draw(root) {
    const s = solve(st);
    root.querySelector("#cirCells").textContent = `${st.cells} 顆 × 1.5 V = ${(st.cells * CELL).toFixed(1)} V`;
    // 窄螢幕：圖上燈泡只標號碼，詳細數值改列在圖下方（不是把整張圖縮小）
    const box = root.querySelector("#cirSvg");
    narrow = box.clientWidth > 0 && box.clientWidth < 520;
    box.innerHTML = st.mode === "series" ? seriesSvg(s) : parallelSvg(s);
    const item = (n, on, R, V, I, P) => `<li><b>燈泡 ${n}</b>：${on ? `${R} Ω，電壓 ${fV(V)}，電流 ${fA(I)}，${P < 0.01 ? "不亮" : "功率 " + P.toFixed(1) + " W"}` : "已拿掉"}</li>`;
    root.querySelector("#cirLegend").innerHTML = narrow ? item(1, st.on1, st.R1, s.V1, s.I1, s.P1) + item(2, st.on2, st.R2, s.V2, s.I2, s.P2) : "";
    const b = (on, R) => on ? R + " Ω" : "拿掉";
    root.querySelector("#cirReadout").innerHTML =
      `<b>${st.mode === "series" ? "串聯" : "並聯"}</b>　電源 <b>${s.V.toFixed(1)} V</b>　燈泡 1：${b(st.on1, st.R1)}　燈泡 2：${b(st.on2, st.R2)}<br>
      總電流 I = <b>${fA(s.It)}</b>　I₁ = <b>${fA(s.I1)}</b>　I₂ = <b>${fA(s.I2)}</b>　V₁ = <b>${fV(s.V1)}</b>　V₂ = <b>${fV(s.V2)}</b>　總電阻 = <b>${fR(s.Rt)}</b>
      ${st.mode === "series" && !(st.on1 && st.on2) ? '　<span class="tag bad">斷路</span>' : ""}`;
    const tb = root.querySelector("#cirTable");
    tb.innerHTML = `<tr><th>#</th><th>接法</th><th>電源</th><th>R₁</th><th>R₂</th><th>I₁</th><th>I₂</th><th>I總</th><th>V₁</th><th>V₂</th><th>總電阻</th></tr>` +
      st.rows.map((r, i) => `<tr><td>${i + 1}</td><td>${r.mode === "series" ? "串聯" : "並聯"}</td><td>${r.s.V.toFixed(1)} V</td>
      <td>${r.on1 ? r.R1 + " Ω" : "拿掉"}</td><td>${r.on2 ? r.R2 + " Ω" : "拿掉"}</td>
      <td>${fA(r.s.I1)}</td><td>${fA(r.s.I2)}</td><td>${fA(r.s.It)}</td><td>${fV(r.s.V1)}</td><td>${fV(r.s.V2)}</td><td>${fR(r.s.Rt)}</td></tr>`).join("");
  }

  // ---------- 繪圖元件 ----------
  const flow = (d, I) => I >= 0.01 ? `<path d="${d}" class="ohm-flow" style="animation-duration:${Math.max(0.25, Math.min(4, 2.4 / I)).toFixed(2)}s"/>` : "";
  const battery = () => `<rect x="34" y="128" width="52" height="44" fill="var(--card)" stroke="none"/>
  <line x1="40" y1="136" x2="80" y2="136" class="s-line"/><line x1="48" y1="148" x2="72" y2="148" stroke="var(--text)" stroke-width="5"/>
  <line x1="40" y1="158" x2="80" y2="158" class="s-line"/><line x1="48" y1="168" x2="72" y2="168" stroke="var(--text)" stroke-width="5"/>
  <text x="30" y="140" text-anchor="end" class="s-text">+</text><text x="30" y="172" text-anchor="end" class="s-text">−</text>
  <text x="94" y="156" class="s-text">${(st.cells * CELL).toFixed(1)} V</text>`;
  const meter = (x, y, name, I) => `<circle cx="${x}" cy="${y}" r="16" class="ohm-meter"/><text x="${x}" y="${y + 5}" text-anchor="middle" class="s-text">${name}</text>`;
  // 燈泡；side 決定文字放哪裡："below"（水平導線上）、"right" / "left"（垂直支路上，避免文字壓在導線上）
  function bulb(x, y, on, P, label, sub, vertical, side) {
    side = side || "below";
    const tx = side === "right" ? x + 30 : side === "left" ? x - 30 : x;
    const anchor = side === "right" ? "start" : side === "left" ? "end" : "middle";
    const ty = side === "below" ? y + 42 : y - 6;
    if (narrow) label = label.replace("燈泡 ", "");
    if (!on) {
      // 拿掉的燈泡：只剩空的燈座（斷開）
      const a = vertical ? [x, y - 16, x, y + 16] : [x - 16, y, x + 16, y];
      return `<rect x="${x - 20}" y="${y - 20}" width="40" height="40" fill="var(--card)" stroke="none"/>
  <circle cx="${a[0]}" cy="${a[1]}" r="4" class="s-dot"/><circle cx="${a[2]}" cy="${a[3]}" r="4" class="s-dot"/>
  <text x="${tx}" y="${ty}" text-anchor="${anchor}" class="s-chem-text">${label}</text>
  ${narrow ? "" : `<text x="${tx}" y="${ty + 20}" text-anchor="${anchor}" class="s-chem-text">已拿掉</text>`}`;
    }
    const g = glow(P);
    return `<circle cx="${x}" cy="${y}" r="${(20 + 18 * g).toFixed(1)}" fill="#ffd54f" fill-opacity="${(0.55 * g).toFixed(2)}"/>
  <circle cx="${x}" cy="${y}" r="20" fill="${g > 0.02 ? "#fff3c4" : "var(--card)"}" stroke="var(--text)" stroke-width="2"/>
  <path d="M${x - 9},${y - 9} L${x + 9},${y + 9} M${x + 9},${y - 9} L${x - 9},${y + 9}" class="s-line"/>
  <text x="${tx}" y="${ty}" text-anchor="${anchor}" class="s-text">${label}</text>
  ${narrow ? "" : `<text x="${tx}" y="${ty + 20}" text-anchor="${anchor}" class="s-small">${sub}</text>`}`;
  }

  function seriesSvg(s) {
    // 迴路：電池正極 → 上方導線（A₁、燈泡 1、A₂）→ 右側 → 下方導線（燈泡 2）→ 電池負極
    const loop = "M60,130 L60,60 L440,60 L440,240 L60,240 L60,170";
    return `<svg viewBox="0 0 480 310" role="img" aria-label="串聯電路：電池、安培計 A1、燈泡 1、安培計 A2、燈泡 2">
  <path d="${loop}" class="s-wire"/>${flow(loop, s.It)}
  ${battery()}
  ${meter(140, 60, "A₁")}<text x="140" y="32" text-anchor="middle" class="s-accent-text halo">${fA(s.I1)}</text>
  ${bulb(250, 60, st.on1, s.P1, "燈泡 1", `${st.R1} Ω・${fV(s.V1)}`)}
  ${meter(360, 60, "A₂")}<text x="360" y="32" text-anchor="middle" class="s-accent-text halo">${fA(s.I2)}</text>
  ${bulb(250, 240, st.on2, s.P2, "燈泡 2", `${st.R2} Ω・${fV(s.V2)}`)}
</svg>`;
  }

  function parallelSvg(s) {
    // 主線：電池 → 上方導線 → 分成兩條支路（x=260、x=420）→ 下方導線 → 電池
    const mainTop = "M60,130 L60,60 L260,60", mainBot = "M260,250 L60,250 L60,170";
    const br1 = "M260,60 L260,250", br2 = "M260,60 L420,60 L420,250 L260,250";
    return `<svg viewBox="0 0 ${narrow ? 515 : 560} 310" role="img" aria-label="並聯電路：電池、總電流安培計 A、兩條支路各有安培計與燈泡">
  <path d="M60,130 L60,60 L420,60 L420,250 L60,250 L60,170 M260,60 L260,250" class="s-wire"/>
  ${flow(mainTop, s.It)}${flow(mainBot, s.It)}${flow(br1, s.I1)}${flow(br2, s.I2)}
  <circle cx="260" cy="60" r="4" class="s-dot"/><circle cx="260" cy="250" r="4" class="s-dot"/>
  ${battery()}
  ${meter(160, 60, "A")}<text x="160" y="32" text-anchor="middle" class="s-accent-text halo">總 ${fA(s.It)}</text>
  ${meter(260, 110, "A₁")}<text x="282" y="115" class="s-accent-text halo">${fA(s.I1)}</text>
  ${meter(420, 110, "A₂")}<text x="442" y="115" class="s-accent-text halo">${fA(s.I2)}</text>
  ${bulb(260, 180, st.on1, s.P1, "燈泡 1", `${st.R1} Ω・${fV(s.V1)}`, true, "right")}
  ${bulb(420, 180, st.on2, s.P2, "燈泡 2", `${st.R2} Ω・${fV(s.V2)}`, true, "right")}
</svg>`;
  }

  window.SimCircuit = { render, TASKS, solve, state: null };
})();
