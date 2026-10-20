/*
 * 波動模擬器（第三階段）
 * 模型：一維橫波 y(x, t) = A sin(2π(f t − x / λ))，由左端波源發出向右傳播，λ = v ÷ f。
 * 同一介質波速 v 固定；只能調頻率 f 與振幅 A。
 * 學習任務採「先預測 → 操作觀察 → 回答原因」。
 */
(function () {
  const V = 1.0;            // 波速（m/s），固定介質
  const SPAN = 6;           // 畫面顯示 6 m 長的繩子
  const MARK_X = 1.5;       // 紅色標記點的位置（m）
  const KEY = "pc.simWave";

  const TASKS = [
    {
      id: "fl", title: "任務一：頻率與波長",
      predict: { q: "在同一條繩子上，把波源的頻率加倍，波長會怎樣？", options: ["變長", "變短（約變一半）", "不變", "無法預測"], answer: 1 },
      observe: "把振幅固定，依序把頻率調成 0.5、1.0、2.0 Hz，每調一次按「記錄目前數值」。觀察波長與波速的變化。",
      need: rows => new Set(rows.map(r => r.f)).size >= 3,
      needText: "至少記錄 3 組不同頻率的數值",
      reason: { q: "為什麼頻率變大，波長會變短？", options: ["同一介質波速固定，λ = v ÷ f，f 變大 λ 就變小", "頻率變大時波速也變大", "振幅變小造成的", "波長和頻率沒有關係"], answer: 0 },
      explain: "同一條繩子（同一介質）波速固定。v = f × λ，所以 f 加倍時 λ 變一半；你記錄的每一組 f × λ 都約等於 1.0 m/s。"
    },
    {
      id: "med", title: "任務二：介質振動與波的傳播",
      predict: { q: "波向右傳播時，紅色標記的那一小段介質會怎樣運動？", options: ["跟著波一起往右移動", "只在原處來回振動", "往左移動", "完全不動"], answer: 1 },
      observe: "打開「波峰追蹤」，同時看藍色三角形（跟著一個波峰走）和紅色標記點。可以按「暫停」再「繼續」仔細比較。",
      need: (rows, st) => st.trackerSeen,
      needText: "打開「波峰追蹤」觀察一次",
      reason: { q: "這個觀察說明波傳遞的是什麼？", options: ["介質本身被送到遠方", "能量與波形，介質只在原處振動", "空氣", "質量"], answer: 1 },
      explain: "藍色三角形（波峰或密部）一直往右走，但紅色標記點只在原處來回振動（橫波上下、縱波左右），沒有跟著往右移。波傳遞的是能量與波形，不是介質。"
    },
    {
      id: "amp", title: "任務三：振幅會不會影響波速？",
      predict: { q: "頻率不變，把振幅加大，波速和波長會怎樣？", options: ["波速、波長都變大", "波速、波長都不變", "波速變大、波長不變", "波速不變、波長變大"], answer: 1 },
      observe: "頻率固定在 1.0 Hz，分別把振幅調成 0.1 m 和 0.5 m，各按一次「記錄目前數值」。",
      need: rows => new Set(rows.filter(r => r.f === 1).map(r => r.A)).size >= 2,
      needText: "在頻率 1.0 Hz 下記錄 2 組不同振幅",
      reason: { q: "振幅代表的是什麼？", options: ["波的能量大小（振動幅度），不影響波速與波長", "波傳播的快慢", "波的長度", "每秒振動的次數"], answer: 0 },
      explain: "振幅是介質離開平衡位置的最大距離，代表能量大小（聲波中就是響度）。在這個理想模型中，波速只由介質決定，所以振幅改變時波速、波長都不變。"
    },
    {
      id: "long", title: "任務四：橫波和縱波的振動方向",
      predict: { q: "把彈簧（或聲音經過的空氣）當成介質，波向右傳播時，紅色標記的介質會往哪個方向振動？", options: ["上下振動，和波前進方向垂直", "左右來回振動，和波前進方向平行", "完全不動", "跟著波一直往右跑"], answer: 1 },
      observe: "把「波的種類」切換成「縱波」，打開「波峰追蹤」看密部怎麼移動，同時觀察紅色標記的介質；再切回「橫波」比較。",
      need: (rows, st) => st.longSeen && st.transSeenAfterLong,
      needText: "切換到縱波觀察，再切回橫波比較",
      reason: { q: "橫波和縱波的差別是什麼？", options: ["介質振動方向與波前進方向垂直的是橫波、平行的是縱波；聲波是縱波", "橫波比較快、縱波比較慢", "縱波不需要介質", "橫波只能在水中傳播"], answer: 0 },
      explain: "橫波（例如繩波）的介質上下振動，與前進方向垂直，形成波峰、波谷；縱波（例如前後推拉彈簧、聲波）的介質左右振動，與前進方向平行，形成疏部、密部。兩種波的介質都只在原處振動，波長都是相鄰兩個「相同狀態」的點之間的距離。"
    }
  ];

  const panel = window.SimTasks.create({ tasks: TASKS, key: KEY, getState: () => st });

  let st = null;   // 模擬狀態（供測試讀取）

  function render(root) {
    root.innerHTML = `
<p class="small"><a href="#/sim">← 模擬實驗</a> ／ 八上 第3章 波動與聲音</p>
<h1>🧪 波動模擬：頻率、波長與介質振動</h1>
<p class="muted">一條很長的繩子，左端的波源上下振動，產生向右傳播的橫波。先預測，再動手調整、觀察，最後說出原因。</p>
<div class="card sim-card">
  <canvas id="waveCanvas" aria-label="波動模擬畫面：繩子上的橫波向右傳播，紅色點是標記的介質"></canvas>
  <div class="sim-readout" id="simReadout" aria-live="polite"></div>
  <div class="sim-controls">
    <label>頻率 f <input type="range" id="simF" min="0.25" max="2" step="0.25" value="1"> <b id="simFv">1.00 Hz</b></label>
    <label>振幅 A <input type="range" id="simA" min="0.1" max="0.6" step="0.1" value="0.3"> <b id="simAv">0.30 m</b></label>
    <div class="ohm-ctl"><span>波的種類</span>
      <label class="seg-radio"><input type="radio" name="simKind" value="trans" checked> 橫波（繩波）</label>
      <label class="seg-radio"><input type="radio" name="simKind" value="long"> 縱波（彈簧、聲波）</label></div>
  </div>
  <div class="row">
    <button class="btn" id="simPause">⏸ 暫停</button>
    <button class="btn ghost" id="simReset">↺ 重設</button>
    <label><input type="checkbox" id="simTrack"> 波峰追蹤（藍色三角形跟著一個波峰或密部走）</label>
    <span class="spacer"></span>
    <button class="btn small" id="simRecord">📋 記錄目前數值</button>
  </div>
  <table class="small" id="simTable" style="margin-top:10px"><tr><th>#</th><th>頻率 f</th><th>振幅 A</th><th>波長 λ</th><th>波速 v</th><th>f × λ</th></tr></table>
</div>
<div class="box warn small"><b>模型的假設與適用範圍</b>
<ul style="margin:4px 0">
<li>理想化的一維橫波：介質均勻、沒有能量損失、繩子無限長（沒有畫出反射）</li>
<li>同一介質的波速固定為 ${V.toFixed(1)} m/s（為了方便觀察而設定的數值）。實際繩波的波速由繩子的張力與粗細（線密度）決定，聲波由介質種類與溫度決定</li>
<li>振幅只是放大畫出來方便觀察；真實的小振幅波，振幅不影響波速。振幅很大時，真實的介質不一定符合這個模型</li>
<li>波源開始振動後，波前以波速往右前進，所以剛重設時右邊的繩子還沒開始振動</li>
<li>縱波模式中，為了讓疏密看得清楚又不讓介質互相穿過，左右位移依比例縮小畫出（數值仍顯示實際振幅）</li>
</ul></div>
<div id="simTasks">${panel.html()}</div>`;

    const canvas = root.querySelector("#waveCanvas");
    st = { f: 1, A: 0.3, t: 0, running: true, track: false, trackerSeen: false, rows: [], last: null, canvas, kind: "trans", longSeen: false, transSeenAfterLong: false };
    window.SimWave.state = st;

    const $ = id => root.querySelector("#" + id);
    const sync = () => {
      st.f = parseFloat($("simF").value); st.A = parseFloat($("simA").value);
      $("simFv").textContent = st.f.toFixed(2) + " Hz"; $("simAv").textContent = st.A.toFixed(2) + " m";
      draw(); panel.update();
    };
    $("simF").addEventListener("input", sync);
    root.querySelectorAll("input[name=simKind]").forEach(r => r.addEventListener("change", () => {
      st.kind = r.value; st.trackK = null;
      if (st.kind === "long") st.longSeen = true; else if (st.longSeen) st.transSeenAfterLong = true;
      canvas.setAttribute("aria-label", st.kind === "long" ? "波動模擬畫面：縱波，介質左右振動形成疏部與密部，向右傳播，紅色是標記的介質" : "波動模擬畫面：繩子上的橫波向右傳播，紅色點是標記的介質");
      draw(); panel.update();
    }));
    $("simA").addEventListener("input", sync);
    $("simPause").addEventListener("click", () => { st.running = !st.running; $("simPause").textContent = st.running ? "⏸ 暫停" : "▶ 繼續"; st.last = null; });
    $("simReset").addEventListener("click", () => { st.t = 0; st.last = null; st.trackK = null; draw(); });
    $("simTrack").addEventListener("change", e => { st.track = e.target.checked; if (st.track) st.trackerSeen = true; draw(); panel.update(); });
    $("simRecord").addEventListener("click", () => {
      const lam = V / st.f;
      st.rows.push({ f: st.f, A: st.A, lam });
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${st.rows.length}</td><td>${st.f.toFixed(2)} Hz</td><td>${st.A.toFixed(2)} m</td><td>${lam.toFixed(2)} m</td><td>${V.toFixed(2)} m/s</td><td>${(st.f * lam).toFixed(2)} m/s</td>`;
      $("simTable").appendChild(tr);
      panel.update();
    });
    panel.mount(root.querySelector("#simTasks"));

    // 畫布寬度跟著容器走（手機上不縮小整張圖），高解析度螢幕用 devicePixelRatio 畫清楚
    const fit = () => {
      const w = Math.max(260, Math.min(900, canvas.parentElement.clientWidth - 2));
      const h = Math.round(Math.max(220, Math.min(300, w * 0.42)));
      const dpr = Math.min(3, window.devicePixelRatio || 1);
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      st.dpr = dpr; draw();
    };
    window.addEventListener("resize", fit);
    if ("ResizeObserver" in window) new ResizeObserver(fit).observe(canvas.parentElement);
    fit();
    sync();

    const loop = now => {
      if (!document.body.contains(canvas)) { window.removeEventListener("resize", fit); return; }   // 離開頁面就停止
      if (st.running) { if (st.last != null) st.t += Math.min(0.1, (now - st.last) / 1000); st.last = now; }
      draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // 位移（m）：波前還沒到的地方為 0
  function disp(x, t, f, A) {
    if (x > V * t) return 0;
    return A * Math.sin(2 * Math.PI * (f * t - x * f / V));
  }

  function draw() {
    if (!st || !st.canvas) return;
    const c = st.canvas, g = c.getContext("2d"), dpr = st.dpr || 1;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const W = c.width / dpr, H = c.height / dpr, mid = H / 2 - 10, ppm = (W - 20) / SPAN, x0 = 10;
    const label = (txt, x, y) => { const w = g.measureText(txt).width; g.fillText(txt, Math.min(W - w / 2 - 2, Math.max(w / 2 + 2, x)), y); };
    const css = getComputedStyle(document.body);
    const col = n => css.getPropertyValue(n).trim() || "#888";
    g.clearRect(0, 0, W, H);
    g.fillStyle = col("--card"); g.fillRect(0, 0, W, H);
    // 平衡位置與刻度
    g.strokeStyle = col("--line"); g.setLineDash([4, 4]); g.beginPath(); g.moveTo(x0, mid); g.lineTo(W - 10, mid); g.stroke(); g.setLineDash([]);
    g.fillStyle = col("--muted"); g.font = "12px sans-serif"; g.textAlign = "center";
    for (let m = 0; m <= SPAN; m += 0.5) {
      const px = x0 + m * ppm; g.beginPath(); g.moveTo(px, H - 34); g.lineTo(px, H - (m % 1 === 0 ? 24 : 29)); g.strokeStyle = col("--muted"); g.stroke();
      if (m % 1 === 0) label(m + " m", px, H - 10);
    }
    if (st.kind === "long") { drawLong(g, W, H, mid, ppm, x0, label, col); return; }
    // 繩子
    const yOf = x => mid - disp(x, st.t, st.f, st.A) * ppm;
    g.strokeStyle = col("--primary"); g.lineWidth = 3; g.beginPath();
    for (let px = 0; px <= W - 20; px += 2) { const x = px / ppm; const y = yOf(x); px ? g.lineTo(x0 + px, y) : g.moveTo(x0, y); }
    g.stroke(); g.lineWidth = 1;
    // 介質小點
    g.fillStyle = col("--muted");
    for (let x = 0.25; x < SPAN; x += 0.25) { g.beginPath(); g.arc(x0 + x * ppm, yOf(x), 2.5, 0, 7); g.fill(); }
    // 波長標示：在已經有波的範圍內，標出相鄰兩個波峰
    const lam = V / st.f;
    const front = V * st.t;
    {
      // 波峰位置：相位 f t − x/λ = 1/4 + k → x = (f t − 1/4 − k) λ；取最靠近波源的那一個
      const k = Math.floor(st.f * st.t - 0.25);
      const xc = (st.f * st.t - 0.25 - k) * lam;
      if (xc >= 0 && xc + lam <= Math.min(front, SPAN)) {
        const yT = mid - st.A * ppm - 16, a = x0 + xc * ppm, b = x0 + (xc + lam) * ppm;
        g.strokeStyle = col("--chem"); g.fillStyle = col("--chem"); g.beginPath(); g.moveTo(a, yT); g.lineTo(b, yT); g.stroke();
        [a, b].forEach(p => { g.beginPath(); g.moveTo(p, yT - 5); g.lineTo(p, yT + 5); g.stroke(); });
        g.font = "13px sans-serif"; label("波長 λ = " + lam.toFixed(2) + " m", (a + b) / 2, yT - 6);
      }
    }
    // 紅色標記介質點與它的垂直參考線
    const mx = x0 + MARK_X * ppm, my = yOf(MARK_X);
    g.strokeStyle = "#e53935"; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(mx, mid - st.A * ppm - 6); g.lineTo(mx, mid + st.A * ppm + 6); g.stroke(); g.setLineDash([]);
    g.fillStyle = "#e53935"; g.beginPath(); g.arc(mx, my, 7, 0, 7); g.fill();
    g.font = "13px sans-serif"; label("標記點", mx, mid + st.A * ppm + 22);
    // 波峰追蹤
    // 波峰追蹤：鎖定同一個波峰（固定 k），它以波速往右走；走出畫面才換下一個新產生的波峰
    if (st.track && front > 0) {
      const pos = k => (st.f * st.t - 0.25 - k) * lam;
      if (st.trackK == null || st.trackF !== st.f || pos(st.trackK) > Math.min(SPAN, front) || pos(st.trackK) < 0) {
        st.trackK = Math.floor(st.f * st.t - 0.25); st.trackF = st.f;
      }
      const xc = pos(st.trackK);
      if (xc >= 0 && xc <= Math.min(SPAN, front)) {
        const px = x0 + xc * ppm, py = mid - st.A * ppm - 4;
        g.fillStyle = col("--primary"); g.beginPath(); g.moveTo(px, py); g.lineTo(px - 7, py - 12); g.lineTo(px + 7, py - 12); g.closePath(); g.fill();
      }
    }
    // 數值
    const ro = document.getElementById("simReadout");
    if (ro) ro.innerHTML = `頻率 f = <b>${st.f.toFixed(2)} Hz</b>　週期 T = <b>${(1 / st.f).toFixed(2)} s</b>　振幅 A = <b>${st.A.toFixed(2)} m</b>　波速 v = <b>${V.toFixed(2)} m/s</b>（固定介質）　波長 λ = v ÷ f = <b>${lam.toFixed(2)} m</b>　時間 t = ${st.t.toFixed(1)} s　標記點位移 = ${disp(MARK_X, st.t, st.f, st.A).toFixed(2)} m`;
  }

  // ---------- 縱波：介質畫成直線，左右振動 ----------
  function drawLong(g, W, H, mid, ppm, x0, label, col) {
    const lam = V / st.f, front = V * st.t;
    // 位移縮放：讓相鄰介質不交錯（du/dx 最大 = 2πA·k/λ < 0.7）
    const k = Math.min(1, 0.7 * lam / (2 * Math.PI * st.A));
    const u = x => disp(x, st.t, st.f, st.A) * k;
    const half = Math.min(48, H * 0.22);
    g.strokeStyle = col("--primary"); g.lineWidth = 2;
    for (let x = 0.04; x < SPAN; x += 0.06) {
      const px = x0 + (x + u(x)) * ppm;
      g.beginPath(); g.moveTo(px, mid - half); g.lineTo(px, mid + half); g.stroke();
    }
    g.lineWidth = 1;
    // 波長：相鄰兩個密部（相位 f t − x/λ = 整數）
    const kk = Math.floor(st.f * st.t), xc = (st.f * st.t - kk) * lam;
    if (xc >= 0 && xc + lam <= Math.min(front, SPAN)) {
      const yT = mid - half - 14, a = x0 + xc * ppm, b = x0 + (xc + lam) * ppm;
      g.strokeStyle = col("--chem"); g.fillStyle = col("--chem"); g.beginPath(); g.moveTo(a, yT); g.lineTo(b, yT); g.stroke();
      [a, b].forEach(p => { g.beginPath(); g.moveTo(p, yT - 5); g.lineTo(p, yT + 5); g.stroke(); });
      g.font = "13px sans-serif"; g.textAlign = "center"; label("波長 λ = " + lam.toFixed(2) + " m（相鄰兩密部）", (a + b) / 2, yT - 6);
    }
    // 紅色標記介質：只在原處左右振動
    const mx0 = x0 + MARK_X * ppm, mx = x0 + (MARK_X + u(MARK_X)) * ppm, amp = st.A * k * ppm;
    g.strokeStyle = "#e53935"; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(mx0 - amp - 6, mid + half + 10); g.lineTo(mx0 + amp + 6, mid + half + 10); g.stroke(); g.setLineDash([]);
    g.lineWidth = 4; g.beginPath(); g.moveTo(mx, mid - half); g.lineTo(mx, mid + half); g.stroke(); g.lineWidth = 1;
    g.fillStyle = "#e53935"; g.font = "13px sans-serif"; g.textAlign = "center"; label("標記的介質（左右振動）", mx0, mid + half + 26);
    // 追蹤一個密部
    if (st.track && front > 0) {
      const pos = q => (st.f * st.t - q) * lam;
      if (st.trackK == null || st.trackF !== st.f || pos(st.trackK) > Math.min(SPAN, front) || pos(st.trackK) < 0) { st.trackK = Math.floor(st.f * st.t); st.trackF = st.f; }
      const xp = pos(st.trackK);
      if (xp >= 0 && xp <= Math.min(SPAN, front)) {
        const px = x0 + xp * ppm, py = mid - half - 2;
        g.fillStyle = col("--primary"); g.beginPath(); g.moveTo(px, py); g.lineTo(px - 7, py - 12); g.lineTo(px + 7, py - 12); g.closePath(); g.fill();
      }
    }
    const ro = document.getElementById("simReadout");
    if (ro) ro.innerHTML = `<b>縱波</b>　頻率 f = <b>${st.f.toFixed(2)} Hz</b>　週期 T = <b>${(1 / st.f).toFixed(2)} s</b>　振幅 A = <b>${st.A.toFixed(2)} m</b>　波速 v = <b>${V.toFixed(2)} m/s</b>（固定介質）　波長 λ = v ÷ f = <b>${lam.toFixed(2)} m</b>　時間 t = ${st.t.toFixed(1)} s　標記介質的左右位移 = ${disp(MARK_X, st.t, st.f, st.A).toFixed(2)} m`;
  }

  window.SimWave = { render, TASKS, V, disp, state: null };
})();
