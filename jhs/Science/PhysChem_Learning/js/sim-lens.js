/*
 * 凸透鏡成像模擬器
 * 模型：薄透鏡、近軸光線。透鏡公式 1/p + 1/q = 1/f（實物 p > 0）。
 *   p > f：q = p f / (p − f) > 0，在透鏡另一側成倒立實像；放大率 m = q / p
 *   p < f：q < 0，折射光發散，延長線在物體同側交成正立放大虛像
 *   p = f：折射光平行，不成像
 * 畫三條特殊光線：平行主軸→經過焦點、經過鏡心→直進、經過（或指向）焦點→平行主軸。
 * 學習任務沿用 SimTasks。
 */
(function () {
  const KEY = "pc.simLens";
  const H = 3;            // 物體高度（cm）
  const FS = [6, 8, 10];  // 可選焦距（cm）
  const PMAX = 40, TOL = 0.26;

  function region(p, f) {
    if (Math.abs(p - f) <= TOL) return "f";
    if (p < f) return "in";
    if (Math.abs(p - 2 * f) <= TOL) return "2f";
    if (p > 2 * f) return "far";
    return "mid";
  }
  const REGION = {
    far: { name: "物距 > 2f", img: "倒立、縮小、實像", use: "照相機、眼睛" },
    "2f": { name: "物距 = 2f", img: "倒立、等大、實像", use: "（像距也是 2f）" },
    mid: { name: "f < 物距 < 2f", img: "倒立、放大、實像", use: "投影機" },
    f: { name: "物距 = f", img: "不成像（折射光互相平行）", use: "" },
    in: { name: "物距 < f", img: "正立、放大、虛像", use: "放大鏡" }
  };

  function solve(p, f) {
    const reg = region(p, f);
    if (reg === "f") return { reg, q: Infinity, m: Infinity, hi: Infinity, real: false, none: true };
    const q = p * f / (p - f), m = q / p;
    return { reg, q, m: Math.abs(m), hi: -H * q / p, real: q > 0, none: false };
  }

  const TASKS = [
    {
      id: "move", title: "任務一：物體從遠處移近，像怎麼變？",
      predict: { q: "物體從很遠的地方慢慢移到 2F（兩倍焦距）的位置，凸透鏡另一側的實像會怎樣？", options: ["像越來越大，而且離透鏡越來越遠", "像越來越小，離透鏡越來越近", "像的大小和位置都不變", "一直都是虛像"], answer: 0 },
      observe: "拖動物體（或用滑桿），分別放在「物距 > 2f」「物距 = 2f」「f < 物距 < 2f」三個區域，每次把屏幕移到像清楚的位置，再按「記錄目前數值」。",
      need: rows => ["far", "2f", "mid"].every(r => rows.some(x => x.reg === r)),
      needText: "物距 > 2f、= 2f、在 f 與 2f 之間各記錄一次",
      reason: { q: "從紀錄表可以看出什麼規律？", options: ["物距越小（但仍大於 f），像距越大、像越大；物距 = 2f 時像和物體一樣大", "物距越小，像越小", "像距永遠等於物距", "像的大小只跟焦距有關"], answer: 0 },
      explain: "由 1/p + 1/q = 1/f：物距 p 變小時像距 q 變大，放大率 q ÷ p 也變大。p > 2f 時 q 在 f 與 2f 之間，像縮小（照相機）；p = 2f 時 q = 2f，等大；f < p < 2f 時 q > 2f，像放大（投影機）。這三種都是倒立的實像，屏幕接得到。"
    },
    {
      id: "inside", title: "任務二：物體放在焦點以內",
      predict: { q: "把物體放在凸透鏡的焦點以內，在透鏡另一側移動屏幕，能不能接到像？", options: ["可以，接到倒立放大的像", "不能；但從透鏡另一側往透鏡看，可以看到正立放大的虛像", "可以，接到正立縮小的像", "什麼都看不到"], answer: 1 },
      observe: "把物體拖到 F 與透鏡之間，前後移動屏幕看看能不能接到像，再按「記錄目前數值」。",
      need: rows => rows.some(x => x.reg === "in"),
      needText: "物距小於焦距時記錄一次",
      reason: { q: "為什麼屏幕接不到像？", options: ["折射後的光線互相遠離（發散），不會會聚在屏幕上；它們的延長線在物體同一側交會，形成正立放大的虛像", "光線被透鏡擋住了", "屏幕放得太遠", "透鏡變成了凹透鏡"], answer: 0 },
      explain: "物體在焦點以內時，三條光線經過透鏡後都是發散的，實際的光不會交在一起，所以屏幕接不到（虛像）。眼睛從透鏡另一側往回看，覺得光是從延長線的交點發出的，看到正立、放大的虛像 —— 這就是放大鏡。"
    },
    {
      id: "device", title: "任務三：光學儀器用的是哪一種成像？",
      predict: { q: "投影機要把投影片的像放大投在牆上，投影片應該放在？", options: ["2F 以外", "F 與 2F 之間", "焦點以內", "剛好在焦點上"], answer: 1 },
      observe: "把物體分別放到「物距 > 2f」「f < 物距 < 2f」「物距 < f」三個區域各記錄一次，看紀錄表中的「應用」。",
      need: rows => ["far", "mid", "in"].every(r => rows.some(x => x.reg === r)),
      needText: "> 2f、f～2f、< f 三個區域各記錄一次",
      reason: { q: "為什麼投影機的投影片要倒著放？", options: ["投影機成的是倒立放大的實像，投影片倒著放，投出來的像才是正的", "透鏡只會讓左右對調", "因為燈光從後面照過來", "這只是習慣"], answer: 0 },
      explain: "照相機：物體在 2f 以外，成倒立縮小實像在感光元件上。投影機：投影片在 f 與 2f 之間，成倒立放大實像在銀幕上，所以投影片要倒著放。放大鏡：物體在焦點以內，看到正立放大虛像。"
    }
  ];

  let st = null, narrow = false;
  const panel = window.SimTasks.create({ tasks: TASKS, key: KEY, getState: () => st });
  const fx = v => (Math.round(v * 10) / 10).toString();

  function render(root) {
    st = { f: 10, p: 30, xs: 15, rows: [] };
    window.SimLens.state = st;
    root.innerHTML = `
<p class="small"><a href="#/sim">← 模擬實驗</a> ／ 八上 第4章 光、影像與顏色</p>
<h1>🔍 凸透鏡成像模擬</h1>
<p class="muted">拖動左邊的物體（箭頭）改變物距，看三條特殊光線怎麼走、像成在哪裡；再拖動右邊的屏幕，找出能接到清楚的像的位置。</p>
<div class="card sim-card">
  <div id="lensBox" class="lens-box"></div>
  <div class="sim-readout" id="lensReadout" aria-live="polite"></div>
  <div class="sim-controls">
    <label>物距 p <input type="range" id="lensP" min="1" max="${PMAX}" step="0.5" value="${st.p}"> <b id="lensPv"></b></label>
    <label>屏幕位置 <input type="range" id="lensS" min="1" max="45" step="0.5" value="${st.xs}"> <b id="lensSv"></b></label>
    <div class="ohm-ctl"><span>焦距 f</span>${FS.map(f => `<label class="seg-radio"><input type="radio" name="lensF" value="${f}" ${f === st.f ? "checked" : ""}> ${f} cm</label>`).join("")}</div>
  </div>
  <div class="row">
    <button class="btn small" id="lensRecord">📋 記錄目前數值</button>
    <button class="btn small ghost" id="lensFocus">把屏幕移到像的位置</button>
    <button class="btn small ghost" id="lensClear">清除紀錄</button>
    <label class="small"><input type="checkbox" id="lensRays" checked> 顯示三條特殊光線</label>
  </div>
  <div class="table-scroll"><table class="small" id="lensTable" style="margin-top:10px"></table></div>
</div>
<div class="box small"><b>三條特殊光線</b>：<span style="color:#e53935">①</span> 平行主軸射入 → 折射後經過另一側焦點　<span style="color:#1e88e5">②</span> 經過鏡心 → 方向不變　<span style="color:#43a047">③</span> 經過（或延長線經過）物體側的焦點 → 折射後平行主軸。虛線是折射光的延長線（虛像時才有）。</div>
<div class="box warn small"><b>模型的假設與適用範圍</b>
<ul style="margin:4px 0">
<li><b>薄透鏡、近軸光線</b>：透鏡厚度不計，物體很小、光線與主軸的夾角很小。真實透鏡在這些條件之外會有像差（像變模糊、變形）</li>
<li>不考慮色差（不同顏色的光焦距略有不同）；只用焦距計算，透鏡形狀只是示意</li>
<li>位置用透鏡公式 1/p + 1/q = 1/f 計算（國中課本不要求這個公式，這裡只用來畫出正確的位置）；圖中距離依比例繪製</li>
<li>屏幕上像的模糊程度只是示意：屏幕離像越遠，畫得越模糊</li>
</ul></div>
<div id="lensTasks">${panel.html()}</div>`;

    const $ = id => root.querySelector("#" + id);
    const refresh = () => { draw(root); panel.update(); };
    $("lensP").addEventListener("input", e => { st.p = +e.target.value; refresh(); });
    $("lensS").addEventListener("input", e => { st.xs = +e.target.value; refresh(); });
    root.querySelectorAll("input[name=lensF]").forEach(r => r.addEventListener("change", () => { st.f = +r.value; refresh(); }));
    $("lensRays").addEventListener("change", refresh);
    $("lensFocus").addEventListener("click", () => {
      const s = solve(st.p, st.f);
      if (s.real && s.q <= 45) { st.xs = Math.round(s.q * 2) / 2; $("lensS").value = st.xs; }
      refresh();
    });
    $("lensRecord").addEventListener("click", () => {
      const s = solve(st.p, st.f);
      st.rows.push({ f: st.f, p: st.p, reg: s.reg, s, xs: st.xs });
      refresh();
    });
    $("lensClear").addEventListener("click", () => { st.rows = []; refresh(); });

    // 拖曳：監聽在不會被重畫的外框上，才不會因為 SVG 重繪而中斷拖曳
    const box = $("lensBox");
    let drag = null;
    const toCm = e => {
      const svg = box.querySelector("svg"); const pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
      const loc = pt.matrixTransform(svg.getScreenCTM().inverse());
      return (loc.x - geo().cx) / geo().S;
    };
    box.addEventListener("pointerdown", e => {
      const t = e.target.closest("[data-drag]"); if (!t) return;
      drag = t.dataset.drag; box.setPointerCapture(e.pointerId); e.preventDefault();
    });
    box.addEventListener("pointermove", e => {
      if (!drag) return;
      const x = toCm(e);
      if (drag === "obj") { st.p = Math.min(PMAX, Math.max(1, Math.round(-x * 2) / 2)); $("lensP").value = st.p; }
      else { st.xs = Math.min(45, Math.max(1, Math.round(x * 2) / 2)); $("lensS").value = st.xs; }
      refresh();
    });
    const end = () => { drag = null; };
    box.addEventListener("pointerup", end); box.addEventListener("pointercancel", end);
    if ("ResizeObserver" in window) new ResizeObserver(() => { if (document.body.contains(box)) draw(root); }).observe(box);
    panel.mount($("lensTasks"));
    refresh();
  }

  function geo() {
    // 窄螢幕用較窄的畫面，文字才不會縮得太小；縱向比例放大 2 倍讓物體和像看得清楚。
    // 只放大縱向是仿射變換，光線的交點（像的位置）不變，所以成像位置仍然正確
    return narrow ? { W: 480, Hh: 300, cx: 240, cy: 150, S: 5.2, Sy: 10.4 } : { W: 900, Hh: 340, cx: 450, cy: 170, S: 10, Sy: 10 };
  }

  function draw(root) {
    const box = root.querySelector("#lensBox");
    narrow = box.clientWidth > 0 && box.clientWidth < 860;
    const g = geo(), s = solve(st.p, st.f), f = st.f;
    const X = x => +(g.cx + x * g.S).toFixed(1), Y = y => +(g.cy - y * g.Sy).toFixed(1);
    const xL = -(g.cx - 4) / g.S, xR = (g.W - g.cx - 4) / g.S;
    const showRays = root.querySelector("#lensRays").checked;
    root.querySelector("#lensPv").textContent = fx(st.p) + " cm";
    root.querySelector("#lensSv").textContent = fx(st.xs) + " cm";

    // 光線
    let rays = "";
    if (showRays) {
      const seg = (a, b, c, dash) => `<line x1="${X(a[0])}" y1="${Y(a[1])}" x2="${X(b[0])}" y2="${Y(b[1])}" stroke="${c}" stroke-width="2"${dash ? ' stroke-dasharray="6 5"' : ""}/>`;
      const T = [-st.p, H];
      // 沿直線 (x0,y0)→(x1,y1) 延伸到 x = xe
      const ext = (a, b, xe) => [xe, a[1] + (b[1] - a[1]) * (xe - a[0]) / (b[0] - a[0])];
      // ① 平行主軸 → 經過右焦點
      rays += seg(T, [0, H], "#e53935") + seg([0, H], ext([0, H], [f, 0], xR), "#e53935");
      // ② 經過鏡心 → 直進
      rays += seg(T, ext(T, [0, 0], xR), "#1e88e5");
      // ③ 經過（或指向）左焦點 → 平行主軸
      if (!s.none) {
        const y3 = f * H / (f - st.p);
        rays += seg(T, [0, y3], "#43a047") + seg([0, y3], [xR, y3], "#43a047");
        if (!s.real) {
          // 虛像：三條折射光往回延長，交在物體同側
          rays += seg([0, H], ext([0, H], [f, 0], Math.max(s.q, xL)), "#e53935", true)
            + seg([0, 0], ext(T, [0, 0], Math.max(s.q, xL)), "#1e88e5", true)
            + seg([0, y3], [Math.max(s.q, xL), y3], "#43a047", true);
        }
      }
    }
    // 像
    let img = "";
    const inView = x => x >= xL && x <= xR;
    if (!s.none && inView(s.q) && Math.abs(s.hi) < 30) {
      img = `<line x1="${X(s.q)}" y1="${Y(0)}" x2="${X(s.q)}" y2="${Y(s.hi)}" stroke="${s.real ? "var(--chem)" : "var(--chem)"}" stroke-width="4" ${s.real ? "" : 'stroke-dasharray="6 4"'} marker-end="url(#lensArrI)"/>
  <text x="${X(s.q)}" y="${s.hi > 0 ? Y(s.hi) - 12 : Math.max(Y(s.hi) + 26, Y(0) + 48)}" text-anchor="middle" class="s-chem-text halo">${s.real ? "實像" : "虛像"}</text>`;
    }
    // 屏幕與屏幕上看到的像（模糊程度示意）
    const sx = X(st.xs);
    let onScreen = "";
    const sharp = s.real && Math.abs(st.xs - s.q) <= 0.5;
    if (s.real && st.xs > 0) {
      const blur = Math.min(12, Math.abs(st.xs - s.q) * 0.9);
      const hs = Math.max(-28, Math.min(28, s.hi));   // 屏幕上光斑高度示意
      onScreen = `<line x1="${sx - 8}" y1="${Y(0)}" x2="${sx - 8}" y2="${Y(hs)}" stroke="var(--chem)" stroke-width="${sharp ? 4 : 8}" stroke-opacity="${sharp ? 1 : Math.max(0.15, 0.7 - blur * 0.05)}" filter="${sharp ? "" : `url(#lensBlur)`}"/>`;
    }
    const screenLabel = s.none ? "接不到像" : !s.real ? "接不到像" : sharp ? "清楚的像" : (st.xs < s.q ? "模糊（像在更遠處）" : "模糊（像在更近處）");

    const tick = (x, label) => `<line x1="${X(x)}" y1="${Y(0) - 5}" x2="${X(x)}" y2="${Y(0) + 5}" class="s-line"/><text x="${X(x)}" y="${Y(0) + 22}" text-anchor="middle" class="s-small halo">${label}</text>`;
    box.innerHTML = `<svg viewBox="0 0 ${g.W} ${g.Hh}" role="img" aria-label="凸透鏡成像：物距 ${fx(st.p)} 公分，焦距 ${f} 公分，${REGION[s.reg].img}">
  <defs>
    <marker id="lensArrO" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="var(--primary)"/></marker>
    <marker id="lensArrI" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="var(--chem)"/></marker>
    <filter id="lensBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${Math.min(10, Math.abs(st.xs - (s.real ? s.q : 0)) * 0.8).toFixed(1)}"/></filter>
    <clipPath id="lensClip"><rect x="0" y="0" width="${g.W}" height="${g.Hh}"/></clipPath>
  </defs>
  <g clip-path="url(#lensClip)">
  <line x1="0" y1="${Y(0)}" x2="${g.W}" y2="${Y(0)}" class="s-guide"/>
  ${tick(-f, "F")}${tick(f, "F")}${tick(-2 * f, "2F")}${tick(2 * f, "2F")}
  <ellipse cx="${X(0)}" cy="${Y(0)}" rx="${narrow ? 9 : 12}" ry="${g.cy - 14}" class="s-lens"/>
  ${rays}${img}
  <rect x="${sx - 3}" y="${Y(0) - 32 * (narrow ? 0.9 : 1) * 3}" width="6" height="${32 * (narrow ? 0.9 : 1) * 6}" class="s-board" data-drag="screen" style="cursor:ew-resize"/>
  <rect x="${sx - 14}" y="12" width="28" height="${g.Hh - 24}" fill="transparent" data-drag="screen" style="cursor:ew-resize"/>
  ${onScreen}
  <text x="${Math.min(sx, g.W - 70)}" y="${narrow ? 26 : 30}" text-anchor="middle" class="s-small halo">屏幕：${screenLabel}</text>
  <line x1="${X(-st.p)}" y1="${Y(0)}" x2="${X(-st.p)}" y2="${Y(H)}" stroke="var(--primary)" stroke-width="5" marker-end="url(#lensArrO)"/>
  <rect x="${X(-st.p) - 18}" y="${Y(H) - 16}" width="36" height="${H * g.Sy + 26}" fill="transparent" data-drag="obj" style="cursor:ew-resize"/>
  <text x="${X(-st.p)}" y="${Y(H) - 12}" text-anchor="middle" class="s-accent-text halo">物體 ⇔</text>
  </g>
</svg>`;

    const r = REGION[s.reg];
    root.querySelector("#lensReadout").innerHTML = `焦距 f = <b>${f} cm</b>　物距 p = <b>${fx(st.p)} cm</b>（${r.name}）　` +
      (s.none ? "像距：<b>不成像</b>" : `像距 q = <b>${s.real ? "" : "−"}${fx(Math.abs(s.q))} cm</b>${s.real ? "（透鏡另一側）" : "（和物體同一側）"}　放大率 = <b>${fx(s.m)} 倍</b>`) +
      `<br>成像：<b>${r.img}</b>${r.use ? "　應用：<b>" + r.use + "</b>" : ""}` +
      (!s.none && (!inView(s.q) || Math.abs(s.hi) >= 30) ? '　<span class="tag">像超出畫面範圍</span>' : "");
    const tb = root.querySelector("#lensTable");
    tb.innerHTML = `<tr><th>#</th><th>焦距 f</th><th>物距 p</th><th>區域</th><th>像距 q</th><th>放大率</th><th>成像</th><th>應用</th></tr>` + st.rows.map((x, i) =>
      `<tr><td>${i + 1}</td><td>${x.f} cm</td><td>${fx(x.p)} cm</td><td>${REGION[x.reg].name}</td><td>${x.s.none ? "—" : (x.s.real ? "" : "−") + fx(Math.abs(x.s.q)) + " cm"}</td><td>${x.s.none ? "—" : fx(x.s.m) + " 倍"}</td><td>${REGION[x.reg].img}</td><td>${REGION[x.reg].use || "—"}</td></tr>`).join("");
  }

  window.SimLens = { render, TASKS, solve, region, state: null };
})();
