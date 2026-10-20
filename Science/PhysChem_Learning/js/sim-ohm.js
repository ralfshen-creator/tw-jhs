/*
 * 歐姆定律模擬器
 * 模型：電池 n 顆串聯（每顆 1.5 V，理想、無內電阻），一個定值電阻 R，理想安培計串聯。
 *   伏特計正確並聯：I = V ÷ R，伏特計讀數 = 電源電壓
 *   伏特計誤接成串聯：伏特計內電阻 RV = 10 MΩ，I = V ÷ (R + RV)，幾乎為 0；伏特計讀數 ≈ 電源電壓
 * 學習任務沿用 SimTasks（先預測 → 操作觀察 → 回答原因）。
 */
(function () {
  const CELL = 1.5, MAX_CELLS = 8, RS = [2, 4, 6, 12], RV = 1e7;
  const KEY = "pc.simOhm";
  const COLORS = { 2: "#e53935", 4: "#fb8c00", 6: "#43a047", 12: "#1e88e5" };
  const esc = s => window.SimTasks.esc(s);

  const TASKS = [
    {
      id: "vi", title: "任務一：電壓與電流",
      predict: { q: "電阻固定不變，把電壓加倍，電流會怎樣？", options: ["變一半", "加倍", "不變", "變 4 倍"], answer: 1 },
      observe: "選一個電阻（例如 4 Ω），把電池數依序調成 2、4、6、8 顆，每調一次按「記錄目前數值」。看看 V–I 圖上的點排成什麼形狀。",
      need: rows => RS.some(r => new Set(rows.filter(x => !x.wrong && x.R === r).map(x => x.cells)).size >= 3),
      needText: "同一個電阻下，記錄 3 組以上不同電壓",
      reason: { q: "為什麼電壓加倍時，電流也加倍？", options: ["電阻固定時 V ÷ I 是定值（就是電阻 R），所以 V 與 I 成正比", "電壓越大，電阻就越小", "電流和電壓沒有關係", "電池越多，電阻越大"], answer: 0 },
      explain: "定溫的金屬導體電阻固定，V = I × R，所以 V 與 I 成正比。V–I 圖是通過原點的直線，斜率就是電阻 —— 這就是歐姆定律。"
    },
    {
      id: "ri", title: "任務二：電阻與電流",
      predict: { q: "電壓固定不變，把電阻換成比較大的，電流會怎樣？", options: ["變大", "變小", "不變", "先變大再變小"], answer: 1 },
      observe: "電池數固定（例如 4 顆 = 6 V），依序選 2、4、6、12 Ω，各按一次「記錄目前數值」。",
      need: rows => [...new Set(rows.filter(x => !x.wrong).map(x => x.cells))].some(c => new Set(rows.filter(x => !x.wrong && x.cells === c).map(x => x.R)).size >= 3),
      needText: "同一個電壓下，記錄 3 個以上不同電阻",
      reason: { q: "電壓固定時，電流和電阻是什麼關係？", options: ["I = V ÷ R，電阻越大電流越小（成反比）", "電阻越大電流越大", "電流與電阻無關", "I = V × R"], answer: 0 },
      explain: "I = V ÷ R：電壓固定時，電阻變 2 倍，電流變一半。在 V–I 圖上，電阻大的直線比較陡，因為同樣的電流需要比較大的電壓。"
    },
    {
      id: "vm", title: "任務三：伏特計接錯了會怎樣？",
      predict: { q: "如果把伏特計誤接成和電阻「串聯」，安培計的讀數會怎樣？", options: ["幾乎變成 0", "變成兩倍", "不變", "一定會燒壞"], answer: 0 },
      observe: "把「伏特計接法」切換到「錯誤：串聯」，按「記錄目前數值」，比較安培計和伏特計的讀數，再切回正確接法比較。",
      need: rows => rows.some(x => x.wrong),
      needText: "用錯誤接法記錄 1 次",
      reason: { q: "為什麼會這樣？", options: ["伏特計本身電阻非常大，串聯後整個電路總電阻變得很大，電流幾乎為 0", "伏特計會產生反方向的電流", "伏特計會讓電池沒電", "安培計壞掉了"], answer: 0 },
      explain: "伏特計的內電阻非常大（本模擬設為 10 MΩ），串聯進電路後總電阻變得非常大，電流幾乎為 0；而電源電壓幾乎全部落在伏特計上，所以伏特計反而讀到接近電源電壓。伏特計要並聯在待測物兩端；安培計電阻很小，要串聯，而且絕不能直接接在電池兩極。"
    }
  ];

  let st = null;
  const panel = window.SimTasks.create({ tasks: TASKS, key: KEY, getState: () => st });

  function solve(s) {
    const V = s.cells * CELL;
    if (s.wrong) { const I = V / (s.R + RV); return { V, I, Vm: I * RV }; }
    return { V, I: V / s.R, Vm: V };
  }
  const fmtI = I => I < 0.005 ? "0.00 A（幾乎為 0）" : I.toFixed(2) + " A";

  function render(root) {
    st = { cells: 4, R: 4, wrong: false, rows: [] };
    window.SimOhm.state = st;
    root.innerHTML = `
<p class="small"><a href="#/sim">← 模擬實驗</a> ／ 九上 第4章 基本的靜電現象與電路</p>
<h1>🔌 歐姆定律模擬：電壓、電流與電阻</h1>
<p class="muted">改變電池數（電壓）和電阻，從安培計、伏特計讀數，自己畫出 V–I 圖。先預測，再動手，最後說出原因。</p>
<div class="card sim-card">
  <div class="ohm-wrap"><div id="ohmCircuit" class="ohm-circuit"></div><div id="ohmGraph" class="ohm-graph"></div></div>
  <div class="sim-readout" id="ohmReadout" aria-live="polite"></div>
  <div class="sim-controls">
    <div class="ohm-ctl"><span>電池</span>
      <button class="btn small ghost" id="ohmMinus" aria-label="減少一顆電池">－</button>
      <b id="ohmCells"></b>
      <button class="btn small ghost" id="ohmPlus" aria-label="增加一顆電池">＋</button></div>
    <div class="ohm-ctl"><span>電阻</span>${RS.map(r => `<label class="seg-radio"><input type="radio" name="ohmR" value="${r}" ${r === st.R ? "checked" : ""}> ${r} Ω</label>`).join("")}</div>
    <div class="ohm-ctl"><span>伏特計接法</span>
      <label class="seg-radio"><input type="radio" name="ohmVm" value="ok" checked> 正確：並聯</label>
      <label class="seg-radio"><input type="radio" name="ohmVm" value="wrong"> 錯誤：串聯</label></div>
  </div>
  <div class="row">
    <button class="btn small" id="ohmRecord">📋 記錄目前數值</button>
    <button class="btn small ghost" id="ohmClear">清除紀錄</button>
    <span class="small muted">黃色虛線的移動方向是<b>電流方向</b>（由正極經外電路流向負極），電子實際上是反方向移動。</span>
  </div>
  <div class="table-scroll"><table class="small" id="ohmTable" style="margin-top:10px"><tr><th>#</th><th>伏特計 V</th><th>安培計 I</th><th>電阻 R</th><th>V ÷ I</th><th>接法</th></tr></table></div>
</div>
<div class="box warn small"><b>模型的假設與適用範圍</b>
<ul style="margin:4px 0">
<li>電阻是<b>定溫的金屬導體</b>，電阻值固定，不會因電流而改變。燈泡的燈絲溫度升高時電阻會變大，不完全符合歐姆定律</li>
<li>電池每顆 1.5 V、沒有內電阻；導線電阻忽略不計</li>
<li>理想電表：安培計電阻為 0；伏特計正確並聯時不分走電流。伏特計接錯成串聯時，用 10 MΩ 示意它的內電阻很大</li>
<li>真實實驗中 2 Ω 接 12 V 會有 6 A 的大電流，導線與電阻會發燙，<b>不要在家用真電池這樣接</b></li>
</ul></div>
<div id="ohmTasks">${panel.html()}</div>`;

    const $ = id => root.querySelector("#" + id);
    const refresh = () => { draw(root); panel.update(); };
    $("ohmMinus").addEventListener("click", () => { st.cells = Math.max(1, st.cells - 1); refresh(); });
    $("ohmPlus").addEventListener("click", () => { st.cells = Math.min(MAX_CELLS, st.cells + 1); refresh(); });
    root.querySelectorAll("input[name=ohmR]").forEach(r => r.addEventListener("change", () => { st.R = +r.value; refresh(); }));
    root.querySelectorAll("input[name=ohmVm]").forEach(r => r.addEventListener("change", () => { st.wrong = r.value === "wrong"; refresh(); }));
    $("ohmRecord").addEventListener("click", () => {
      const s = solve(st);
      st.rows.push({ cells: st.cells, R: st.R, wrong: st.wrong, Vm: s.Vm, I: s.I });
      refresh();
    });
    $("ohmClear").addEventListener("click", () => { st.rows = []; refresh(); });
    panel.mount($("ohmTasks"));
    refresh();
  }

  function draw(root) {
    const s = solve(st);
    root.querySelector("#ohmCells").textContent = `${st.cells} 顆 × 1.5 V = ${(st.cells * CELL).toFixed(1)} V`;
    root.querySelector("#ohmCircuit").innerHTML = circuitSvg(s);
    root.querySelector("#ohmGraph").innerHTML = graphSvg();
    root.querySelector("#ohmReadout").innerHTML = `電源電壓 <b>${s.V.toFixed(1)} V</b>　電阻 R = <b>${st.R} Ω</b>　安培計讀數 I = <b>${fmtI(s.I)}</b>　伏特計讀數 = <b>${s.Vm.toFixed(2)} V</b>` +
      (st.wrong ? '　<span class="tag bad">伏特計接錯了（串聯）</span>' : `　V ÷ I = <b>${(s.Vm / s.I).toFixed(2)} Ω</b>`);
    const tb = root.querySelector("#ohmTable");
    tb.innerHTML = `<tr><th>#</th><th>伏特計 V</th><th>安培計 I</th><th>電阻 R</th><th>V ÷ I</th><th>接法</th></tr>` + st.rows.map((r, i) =>
      `<tr><td>${i + 1}</td><td>${r.Vm.toFixed(2)} V</td><td>${fmtI(r.I)}</td><td>${r.R} Ω</td><td>${r.wrong ? "—" : (r.Vm / r.I).toFixed(2) + " Ω"}</td><td>${r.wrong ? '<span class="tag bad">錯誤：串聯</span>' : "正確"}</td></tr>`).join("");
  }

  function circuitSvg(s) {
    // 電流方向：電池正極（上）→ 上方導線 → 安培計 → 電阻 → 下方導線 → 電池負極
    const flowing = s.I >= 0.01;
    const dur = flowing ? Math.max(0.25, Math.min(4, 2.4 / s.I)).toFixed(2) : 0;
    const vmOk = !st.wrong;
    return `<svg viewBox="0 0 460 260" role="img" aria-label="電路圖：電池、安培計、電阻${vmOk ? "，伏特計並聯在電阻兩端" : "，伏特計錯誤地串聯在電路中"}">
  <path d="M60,112 L60,50 L320,50 L320,210 L60,210 L60,150" class="s-wire"/>
  ${flowing ? `<path d="M60,112 L60,50 L320,50 L320,210 L60,210 L60,150" class="ohm-flow" style="animation-duration:${dur}s"/>` : ""}
  <rect x="34" y="110" width="52" height="42" fill="var(--card)" stroke="none"/>
  <line x1="40" y1="118" x2="80" y2="118" class="s-line"/><line x1="48" y1="130" x2="72" y2="130" stroke="var(--text)" stroke-width="5"/>
  <line x1="40" y1="140" x2="80" y2="140" class="s-line"/><line x1="48" y1="150" x2="72" y2="150" stroke="var(--text)" stroke-width="5"/>
  <text x="30" y="122" text-anchor="end" class="s-text">+</text><text x="30" y="156" text-anchor="end" class="s-text">−</text>
  <text x="94" y="136" class="s-text">${(st.cells * CELL).toFixed(1)} V</text>
  <circle cx="190" cy="50" r="18" class="ohm-meter"/><text x="190" y="56" text-anchor="middle" class="s-text">A</text>
  <text x="190" y="24" text-anchor="middle" class="s-accent-text">${fmtI(s.I)}</text>
  <rect x="308" y="100" width="24" height="60" rx="3" class="s-board"/>
  <text x="300" y="134" text-anchor="end" class="s-text">R = ${st.R} Ω</text>
  ${vmOk ? `<path d="M320,80 L400,80 L400,180 L320,180" class="s-wire"/>
  <circle cx="400" cy="130" r="18" class="ohm-meter"/><text x="400" y="136" text-anchor="middle" class="s-text">V</text>
  <text x="400" y="204" text-anchor="middle" class="s-accent-text">${s.Vm.toFixed(2)} V</text>
  <circle cx="320" cy="80" r="3" class="s-dot"/><circle cx="320" cy="180" r="3" class="s-dot"/>`
      : `<circle cx="190" cy="210" r="18" class="ohm-meter ohm-wrong"/><text x="190" y="216" text-anchor="middle" class="s-text">V</text>
  <text x="190" y="248" text-anchor="middle" class="s-chem-text">${s.Vm.toFixed(2)} V（串聯，接錯）</text>`}
</svg>`;
  }

  function graphSvg() {
    const x0 = 50, y0 = 220, w = 330, h = 190, IM = 6, VM = 12;
    const X = i => x0 + i / IM * w, Y = v => y0 - v / VM * h;
    let g = "";
    for (let i = 1; i <= 6; i++) g += `<line x1="${X(i)}" y1="${y0}" x2="${X(i)}" y2="${y0 - h}" class="s-grid"/><text x="${X(i)}" y="${y0 + 16}" text-anchor="middle" class="s-small">${i}</text>`;
    for (let v = 2; v <= 12; v += 2) g += `<line x1="${x0}" y1="${Y(v)}" x2="${x0 + w}" y2="${Y(v)}" class="s-grid"/><text x="${x0 - 6}" y="${Y(v) + 4}" text-anchor="end" class="s-small">${v}</text>`;
    const ok = st.rows.filter(r => !r.wrong);
    let lines = "";
    RS.forEach(R => {
      const pts = ok.filter(r => r.R === R);
      if (new Set(pts.map(p => p.cells)).size >= 2) {
        // 通過原點、斜率 = R 的直線，畫到圖框邊緣
        const iEnd = Math.min(IM, VM / R), vEnd = iEnd * R;
        lines += `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(iEnd)}" y2="${Y(vEnd)}" stroke="${COLORS[R]}" stroke-width="2" stroke-dasharray="5 3"/>
  <text x="${Math.min(X(iEnd) + 4, x0 + w - 40)}" y="${Math.max(Y(vEnd) + (vEnd >= VM ? 14 : -6), 16)}" fill="${COLORS[R]}" font-size="13" font-weight="700">${R} Ω</text>`;
      }
    });
    const dots = ok.map(r => `<circle cx="${X(Math.min(r.I, IM))}" cy="${Y(Math.min(r.Vm, VM))}" r="5" fill="${COLORS[r.R]}" stroke="var(--card)" stroke-width="1.5"/>`).join("");
    return `<svg viewBox="0 0 400 270" role="img" aria-label="V–I 圖：記錄的數據點與通過原點的直線">
  ${g}<line x1="${x0}" y1="${y0}" x2="${x0 + w + 8}" y2="${y0}" class="s-line"/><line x1="${x0}" y1="${y0}" x2="${x0}" y2="${y0 - h - 8}" class="s-line"/>
  <text x="${x0 - 6}" y="${y0 + 16}" text-anchor="end" class="s-small">0</text>
  <text x="${x0 + w / 2}" y="${y0 + 38}" text-anchor="middle" class="s-text">電流 I（A）</text>
  <text x="${x0 + 4}" y="${y0 - h - 12}" class="s-small">電壓 V（V）</text>
  ${lines}${dots}
  ${ok.length ? "" : `<text x="${x0 + w / 2}" y="${y0 - h / 2}" text-anchor="middle" class="s-small">按「記錄目前數值」，數據點會出現在這裡</text>`}
  <text x="${x0 + w}" y="${y0 - h - 12}" text-anchor="end" class="s-small">直線斜率 = 電阻 R</text>
</svg>`;
  }

  window.SimOhm = { render, TASKS, solve, state: null };
})();
