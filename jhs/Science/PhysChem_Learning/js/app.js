(function () {
  const $app = document.getElementById("app");
  const LETTERS = ["A", "B", "C", "D", "E", "F"];
  const TYPE_NAME = { single: "單選", multi: "多選", tf: "是非", fill: "填充" };
  // 課本版本（例如翰林、康軒）；國小沒有會考時 SITE.capRange 留空，首頁就不出現「會考」目標
  const PUB = window.SITE.publisher || "翰林";
  // 「公式」這個詞只適合數學、理化；社會、國小自然用 SITE.formulasName（例如「重點」）
  const FNAME = window.SITE.formulasName || "公式";
  const MISC_NAME = window.SITE.capRange ? "未分類 / 綜合（會考、模擬考）" : "未分類 / 綜合（考卷、練習卷）";
  const MISC = { id: "misc", no: "", title: MISC_NAME, subject: "mix", termId: "misc", termName: "其他" };

  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // 題目、選項、解析：先全部跳脫，再只放回幾個不帶屬性的排版標籤（粗體、上下標、換行、表格），其他 HTML 一律當文字顯示
  const rich = s => esc(s).replace(/&lt;(\/?)(b|i|sup|sub|br|table|tr|th|td)&gt;/g, "<$1$2>");
  const plain = s => String(s == null ? "" : s).replace(/<[^>]*>/g, "");

  // ================= 資料工具 =================
  const SITE = window.SITE || {};
  const TERM_INFO = SITE.terms;
  function allChapters() {
    const list = [];
    CURRICULUM.terms.forEach(t => t.chapters.forEach(c =>
      list.push(Object.assign({ termId: t.id, termName: t.name, termShort: t.short || t.name }, c))));
    list.push(MISC);
    return list;
  }
  function chapterById(id) { return allChapters().find(c => c.id === id) || MISC; }
  function chapterLabel(id) {
    const c = chapterById(id);
    return c.id === "misc" ? c.title : c.termShort + " " + c.no + " " + c.title;
  }
  function termOf(grade, half) {
    return grade + (half === "下" ? "B" : "A");
  }
  function suppTag(q) {
    return q.supplement ? `<span class="tag supp">補充教材（${esc(q.supplement)}）</span>` : "";
  }
  function hasSupp(c) { return (c.sections || []).some(s => s.html.includes('class="supp"')); }
  function subjectTag(s) {
    const name = (SITE.subjectTags || {})[s];
    return name ? `<span class="tag ${s}">${esc(name)}</span>` : '<span class="tag">綜合</span>';
  }
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function fmtDate(iso) {
    const d = new Date(iso);
    return (d.getMonth() + 1) + "/" + d.getDate() + " " + String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  }
  function fmtSec(s) { return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  function pct(a, b) { return b ? Math.round(a / b * 100) : 0; }
  // 測驗分數：有錯題時最多 99 分（避免四捨五入成 100 分卻不是全對）
  function scoreOf(c, t) { return c < t ? Math.min(pct(c, t), 99) : pct(c, t); }

  function chapterStats() {
    const qs = Store.allQuestions(), st = Store.qstats();
    const out = {};
    qs.forEach(q => {
      const s = st[q.id]; if (!s) return;
      const o = out[q.chapter] || (out[q.chapter] = { seen: 0, correct: 0 });
      o.seen += s.seen; o.correct += s.correct;
    });
    return out;
  }

  // 「讀完」= 學生自己勾選讀完；「已掌握」= 這章答過 10 題次以上且正確率 80% 以上
  const MASTER_MIN = 10, MASTER_PCT = 80;
  function chapterStatus(cid, cs, read, visits) {
    const s = cs[cid];
    return {
      read: !!read[cid],
      visited: visits[cid] || null,
      seen: s ? s.seen : 0,
      pct: s ? pct(s.correct, s.seen) : null,
      mastered: !!(s && s.seen >= MASTER_MIN && pct(s.correct, s.seen) >= MASTER_PCT),
      weak: !!(s && s.seen >= 5 && pct(s.correct, s.seen) < 60)
    };
  }
  function statusTags(st, c) {
    let h = "";
    if (st.read) h += '<span class="tag ok">讀完</span>';
    else if (st.visited) h += `<span class="tag">讀到 ${esc(sectionTitle(c, st.visited.sec).split(" ")[0])}</span>`;
    if (st.mastered) h += '<span class="tag master">已掌握</span>';
    else if (st.pct !== null) h += `<span class="tag ${st.weak ? "bad" : ""}">正確率 ${st.pct}%（${st.seen} 題次）</span>`;
    return h;
  }
  function sectionTitle(c, k) {
    return c && c.sections && c.sections[k] ? c.sections[k].title : "";
  }

  // ---------- 題目 → 小節 → 知識點 ----------
  function conceptInfo(q) {
    const c = window.conceptOf ? window.conceptOf(q) : null;
    const ch = chapterById(q.chapter);
    return { concept: c, chapter: ch, secTitle: c ? sectionTitle(ch, c.sec) : "" };
  }
  function lessonHref(q, from) {
    const info = conceptInfo(q);
    if (info.chapter.id === "misc") return "";
    return `#/lesson/${info.chapter.id}?${info.concept ? "sec=" + info.concept.sec + "&" : ""}from=${from}`;
  }
  // 解析區：答錯時給常見錯誤 + 回看觀念；答對時給相關觀念
  function explainBlock(q, ok, from) {
    const info = conceptInfo(q);
    const href = lessonHref(q, from);
    const where = info.concept ? `${esc(info.concept.name)}（${esc(chapterLabel(q.chapter))} › ${esc(info.secTitle)}）` : esc(chapterLabel(q.chapter));
    return `${q.explain ? `<div class="box"><b>解析</b>　${rich(q.explain)}</div>` : ""}
      ${!ok && info.concept && info.concept.pitfall ? `<div class="box warn"><b>常見錯誤</b>　${esc(info.concept.pitfall)}</div>` : ""}
      ${href ? `<div class="row small" style="margin-top:6px"><a class="btn small ${ok ? "ghost" : ""}" href="${href}">📖 ${ok ? "相關觀念" : "回看這個觀念"}：${where}</a></div>` : ""}`;
  }

  function download(filename, text, mime) {
    const blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  // ================= 答案判定 =================
  function normFill(s) {
    return String(s || "")
      .replace(/[！-～]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
      .replace(/[₀-₉]/g, c => String(c.charCodeAt(0) - 0x2080))
      .replace(/[−–—]/g, "-")
      .replace(/\s+/g, "").toLowerCase();
  }
  // 把「數字（或分數）＋單位」拆開；只用正規表示式，不用 eval。拆不出數字時回傳 null
  function parseNumber(s) {
    const t = s.replace(/^[a-z]=/, "").replace(/(\d),(?=\d{3}(\D|$))/g, "$1");
    // 帶分數：2又7/10
    const mx = t.match(/^([+-]?)(\d+)又(\d+)\/(\d+)(.*)$/);
    if (mx) {
      const d = parseInt(mx[4], 10), n = parseInt(mx[3], 10);
      if (!d) return null;
      return { value: (mx[1] === "-" ? -1 : 1) * (parseInt(mx[2], 10) + n / d), unit: mx[5], frac: n < d ? { n: mx[3], d } : { n: "x", d } };
    }
    const m = t.match(/^([+-]?)(\d+(?:\.\d*)?|\.\d+)(?:\/(\d+))?(.*)$/);
    if (!m) return null;
    const n = parseFloat(m[2]), d = m[3] ? parseInt(m[3], 10) : 1;
    if (!d) return null;
    return { value: (m[1] === "-" ? -1 : 1) * n / d, unit: m[4], frac: m[3] ? { n: m[2], d } : null };
  }
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  // 填充題的判定。題目可用 answerFormat 指定（只對有標示的題目生效，其他題照舊比數值）：
  //   （不填）數值題比數值、可帶標準答案列出的單位：5、5.0、５ 都算對；文字題比字串；帶分數寫成 2又7/10
  //   "fraction-simplest"  數值要相等，而且要寫成最簡分數
  //   "decimal"            數值要相等，而且要寫成小數或整數（0.875、.875 可以；7/8、帶分數不行）
  //   "ratio-equivalent"   比例 a:b，和標準答案等值就算對（10:6 = 5:3）；含 0 的比不算
  //   "exact"              只比字串（例如有效位數、估計值要照格式寫的題目）
  //   "english-text"       英文拼字：去掉頭尾空白、字和字之間的空白算一格，但不刪掉字裡面的空白（f o r t y 不算 forty）；
  //                        純數字的答案仍照數值比。英語站在 site.js 用 fillFormat 設成預設，數學等站不受影響
  function ratioParts(s) {
    const m = s.match(/^(\d+(?:\.\d+)?|\.\d+):(\d+(?:\.\d+)?|\.\d+)$/);
    if (!m) return null;
    const x = parseFloat(m[1]), y = parseFloat(m[2]);
    return x > 0 && y > 0 && isFinite(x) && isFinite(y) ? [x, y] : null;
  }
  // 英文拼字用：和 normFill 一樣換半形、轉小寫，但空白只收斂成一格
  function normWords(s) {
    return String(s || "")
      .replace(/[！-～]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
      .replace(/[−–—]/g, "-")
      .replace(/\s+/g, " ").trim().toLowerCase();
  }
  const fillFormat = q => q.answerFormat || (window.SITE && window.SITE.fillFormat) || "";
  function fillMatches(q, accepted, given) {
    if (fillFormat(q) === "english-text") {
      if (normWords(accepted) === normWords(given)) return true;
      // 純數字答案（例如 600）照數值比，但不接受數字中間夾空白
      if (/^[\d.,\/]+$/.test(normWords(accepted)) && !/\s/.test(normWords(given))) return fillMatches(Object.assign({}, q, { answerFormat: "number" }), accepted, given);
      return false;
    }
    const A = normFill(accepted), G = normFill(given);
    if (q.answerFormat === "ratio-equivalent") {
      const a = ratioParts(A), g = ratioParts(G);
      return !!(a && g) && Math.abs(a[0] * g[1] - a[1] * g[0]) <= 1e-9 * Math.max(1, a[0] * g[1]);
    }
    if (q.answerFormat !== "fraction-simplest" && q.answerFormat !== "decimal" && A === G) return true;
    if (q.answerFormat === "exact") return false;
    const a = parseNumber(A), g = parseNumber(G);
    if (!a || !g || a.unit !== g.unit) return false;
    if (Math.abs(a.value - g.value) > 1e-9 * Math.max(1, Math.abs(a.value))) return false;
    if (q.answerFormat === "fraction-simplest") {
      if (!g.frac) return !a.frac;
      return /^\d+$/.test(g.frac.n) && g.frac.d > 1 && gcd(+g.frac.n, g.frac.d) === 1;
    }
    if (q.answerFormat === "decimal") return !g.frac;
    return true;
  }
  // 答錯時，如果數值其實相等、只是沒照指定寫法，回傳提示文字
  function formatMiss(q, given) {
    if (q.type !== "fill" || given == null || given === "" || isCorrect(q, given)) return "";
    if (fillFormat(q) === "english-text")
      return q.answer.split("|").some(a => normFill(a) === normFill(given)) ? "請寫成完整的單字：字母中間不要有空格，兩個字之間只空一格。" : "";
    const loose = Object.assign({}, q, { answerFormat: undefined });
    const same = q.answer.split("|").some(a => fillMatches(loose, a, given)) ||
      (q.sameValue || "").split("|").some(a => a && normFill(a) === normFill(given));
    if (!same) return "";
    const want = { "fraction-simplest": "最簡分數", "decimal": "小數" }[q.answerFormat] || q.formatName || "題目指定的寫法";
    return `你的答案數值相等，但題目要求寫成${want}。`;
  }
  function isCorrect(q, given) {
    if (given == null || given === "") return false;
    if (q.type === "fill") return q.answer.split("|").some(a => fillMatches(q, a, given));
    if (q.type === "multi") return given.split("").sort().join("") === q.answer;
    return given === q.answer;
  }
  function answerText(q, a) {
    if (a == null || a === "") return "（未作答）";
    if (q.type === "tf") return a === "O" ? "O（對）" : "X（錯）";
    if (q.type === "fill") return a.split("|")[0];
    return a.split("").join("、");
  }

  // ================= 首頁 =================
  const GOALS = Object.assign({ preview: "預習", review: "本章複習", exam: "段考" }, SITE.capRange ? { cap: "會考" } : {});
  function profile() {
    const p = Object.assign({ grade: SITE.defaultGrade, half: "上", goal: window.EXAM_FOCUS ? "exam" : "review" }, Store.profile() || {});
    if (!SITE.grades.includes(+p.grade)) { p.grade = SITE.defaultGrade; p.half = "上"; }
    if (p.half !== "上" && p.half !== "下") p.half = "上";
    if (!GOALS[p.goal]) p.goal = "review";
    return p;
  }
  function seg(k, v, label, cur) {
    return `<button class="seg-btn ${String(cur) === String(v) ? "on" : ""}" data-action="set-profile" data-k="${k}" data-v="${v}">${label}</button>`;
  }

  function viewHome() {
    const p = profile();
    const st = Store.qstats();
    let seen = 0, correct = 0;
    Object.values(st).forEach(s => { seen += s.seen; correct += s.correct; });
    const wrongCount = Object.keys(Store.wrong()).length;
    const cs = chapterStats();
    const weak = Object.keys(cs).filter(id => cs[id].seen >= 3)
      .sort((a, b) => cs[a].correct / cs[a].seen - cs[b].correct / cs[b].seen).slice(0, 3);

    $app.innerHTML = `
${resumeBanner()}
<div class="card hero">
  <h1>嗨！今天想做什麼？</h1>
  <div class="seg-row"><span class="seg-label">年級</span>${SITE.grades.map(g => seg("grade", g, SITE.gradeName[g], p.grade)).join("")}</div>
  <div class="seg-row"><span class="seg-label">學期</span>${seg("half", "上", "上學期", p.half)}${seg("half", "下", "下學期", p.half)}</div>
  <div class="seg-row"><span class="seg-label">目標</span>${Object.keys(GOALS).map(g => seg("goal", g, GOALS[g], p.goal)).join("")}</div>
</div>
${planHtml(p)}
<div class="grid">
  <div class="card"><div class="muted">已作答題數</div><div class="stat-big">${seen}</div><div class="small muted">共測驗 ${Store.attempts().length} 次</div></div>
  <div class="card"><div class="muted">整體正確率</div><div class="stat-big">${seen ? pct(correct, seen) + "%" : "—"}</div></div>
  <div class="card"><div class="muted">錯題本</div><div class="stat-big">${wrongCount} 題</div><div class="small muted">連續答對 2 次自動移出</div>
    ${wrongCount ? '<a class="btn small" href="#/wrong">練習錯題</a>' : ""}</div>
</div>
${weak.length ? `
<div class="card">
  <h3 style="margin-top:0">建議加強</h3>
  ${weak.map(id => `<div class="row" style="margin:6px 0">
     <span>${esc(chapterLabel(id))}</span><span class="tag bad">${pct(cs[id].correct, cs[id].seen)}%</span>
     <span class="spacer"></span>
     ${id !== "misc" ? `<a class="btn small ghost" href="#/lesson/${id}">看重點</a>` : ""}
     <a class="btn small" href="#/quiz?ch=${id}&purpose=core">練習</a></div>`).join("")}
</div>` : ""}
<div class="card small muted">
  <b>讀完</b> = 你在章節最後勾選「我讀完這一章了」；<b>已掌握</b> = 這一章答過 ${MASTER_MIN} 題次以上、正確率 ${MASTER_PCT}% 以上。讀完不等於已掌握，要用測驗確認。<br>
  題庫目前共 <b>${Store.allQuestions().length}</b> 題（內建 ${BUILTIN_QUESTIONS.length} 題、匯入 ${Store.imported().length} 題）。學校考卷可以到 <a href="#/bank">題庫 / 匯入</a> 加進來。
</div>`;
  }

  // 依學生實際閱讀進度推薦「繼續讀」
  function continueTarget(termId) {
    const term = CURRICULUM.terms.find(t => t.id === termId);
    if (!term) return null;
    const read = Store.read(), visits = Store.visits();
    const unread = term.chapters.filter(c => !read[c.id]);
    if (!unread.length) return null;
    const visited = unread.filter(c => visits[c.id]).sort((a, b) => visits[b.id].last.localeCompare(visits[a.id].last));
    if (visited.length) return { c: visited[0], sec: visits[visited[0].id].sec, resumed: true };
    return { c: unread[0], sec: 0, resumed: false };
  }

  function planHtml(p) {
    const termId = termOf(p.grade, p.half);
    const term = CURRICULUM.terms.find(t => t.id === termId);
    const cs = chapterStats(), read = Store.read(), visits = Store.visits();
    const tgt = continueTarget(termId);
    const contCard = !term ? "" : `<div class="card">
  <h3 style="margin-top:0">📖 ${esc(term.name)}：繼續讀</h3>
  ${tgt ? `<p>${tgt.resumed ? "上次讀到" : "下一章"}：<b>${esc(tgt.c.no + " " + tgt.c.title)}</b>${tgt.resumed && sectionTitle(tgt.c, tgt.sec) ? `（${esc(sectionTitle(tgt.c, tgt.sec))}）` : ""}</p>
  <a class="btn" href="#/lesson/${tgt.c.id}?sec=${tgt.sec}">${tgt.resumed ? "從上次的地方繼續" : "開始讀"}</a>`
    : `<p>這學期的章節都勾選讀完了。用「本章複習」或測驗確認是不是都已掌握。</p>`}
</div>`;
    const chapterList = !term ? "" : `<div class="card"><h3 style="margin-top:0">${esc(term.name)}的章節</h3>
  ${term.chapters.map(c => { const s = chapterStatus(c.id, cs, read, visits); return `<div class="row chapter-row">
    <span><b>${esc(c.no)} ${esc(c.title)}</b> ${statusTags(s, c)}</span><span class="spacer"></span>
    <a class="btn small ghost" href="#/lesson/${c.id}">看重點</a>
    <a class="btn small" href="#/quiz?ch=${c.id}&purpose=core">練習本章</a></div>`; }).join("")}
</div>`;

    if (p.goal === "preview") {
      return `${contCard}<div class="card small muted">預習時先讀重點、看圖解，不用急著背；讀完一節可以做幾題練習模式，答錯會告訴你回看哪個觀念。</div>${chapterList}`;
    }
    if (p.goal === "review") return `${contCard}${chapterList}`;
    if (p.goal === "exam") {
      const f = window.EXAM_FOCUS;
      if (f && f.chapters.every(id => chapterById(id).termId === termId)) return examCard() + chapterList;
      return `<div class="card exam-card"><h2 style="margin-top:0">📝 ${term ? esc(term.name) : ""}段考準備</h2>
  <p>這學期的段考範圍還沒設定，可以先選要考的章節練習（只出${esc(PUB)}核心題）。</p>
  <a class="btn" href="#/quiz?ch=${term ? term.chapters.map(c => c.id).join(",") : ""}&purpose=core">選章節練習</a>
  <p class="small muted">家長或老師可以在 data/curriculum.js 的 EXAM_FOCUS 設定段考範圍，這裡就會出現模擬段考。</p></div>${chapterList}`;
    }
    // 會考
    const capPool = Store.allQuestions().filter(q => SITE.capRange.test(q.chapter) && !q.supplement);
    return `<div class="card exam-card"><h2 style="margin-top:0">🎯 會考綜合練習</h2>
  <p>從${esc(SITE.capRangeName)}所有章節的<b>${esc(PUB)}核心題</b>隨機出 ${SITE.capQuestions} 題，限時 ${SITE.capMinutes} 分鐘。題庫共 ${capPool.length} 題。</p>
  <p class="small muted">這是用本站自編題目做的綜合練習，<b>不是正式會考題</b>，題型與難度不代表會考。${esc(SITE.capNote || "")}會考考古題可以到「題庫 / 匯入」加進來，歸到「未分類 / 綜合」後一起練。</p>
  <button class="btn" data-action="cap-exam">開始會考綜合練習</button></div>
  ${weakByTerm()}`;
  }
  function weakByTerm() {
    const cs = chapterStats(), read = Store.read(), visits = Store.visits();
    const rows = allChapters().filter(c => SITE.capRange.test(c.id)).map(c => ({ c, s: chapterStatus(c.id, cs, read, visits) }));
    return `<div class="card"><h3 style="margin-top:0">${esc(SITE.capRangeName)}各章狀態</h3>
  ${rows.map(({ c, s }) => `<div class="row chapter-row"><span>${esc(chapterLabel(c.id))} ${statusTags(s, c)}</span><span class="spacer"></span>
    <a class="btn small" href="#/quiz?ch=${c.id}&purpose=core">練習</a></div>`).join("")}</div>`;
  }

  function examCard() {
    const f = window.EXAM_FOCUS;
    if (!f || !f.chapters || !f.chapters.length) return "";
    const chs = f.chapters.map(chapterById);
    const pool = Store.allQuestions().filter(q => f.chapters.includes(q.chapter) && !q.supplement);
    const cs = chapterStats(), read = Store.read(), wr = Store.wrong(), visits = Store.visits();
    const wrongN = pool.filter(q => wr[q.id]).length;
    return `
<div class="card exam-card">
  <h2>📝 段考衝刺：${esc(f.title)}</h2>
  <p class="muted">範圍：${chs.map(c => esc(c.no + " " + c.title)).join("、")}　・　${esc(PUB)}核心題 ${pool.length} 題</p>
  <ol class="checklist">
    ${chs.map(c => `<li>讀 <a href="#/lesson/${c.id}">${esc(c.no + " " + c.title)}</a> ${statusTags(chapterStatus(c.id, cs, read, visits), c)}</li>`).join("")}
    <li>看 <a href="#/formulas">${esc(FNAME)}卡</a>，${esc(SITE.formulasTip)}</li>
    <li><a href="#/quiz?ch=${f.chapters.join(",")}&purpose=core">練習模式</a>：每題對答案、看解析</li>
    <li>${wrongN ? `<a href="javascript:void 0" data-action="exam-wrong">重練範圍內錯題（${wrongN}）</a>` : "錯題重練（目前沒有錯題）"}</li>
    <li>最後做一次模擬考，目標 80 分以上</li>
  </ol>
  <button class="btn" data-action="mock-exam">開始模擬段考（${Math.min(f.questions, pool.length)} 題・${f.minutes} 分鐘）</button>
</div>`;
  }

  // ================= 課程 =================
  function viewLessons() {
    const read = Store.read(), visits = Store.visits(), cs = chapterStats();
    $app.innerHTML = `<h1>課程</h1>
<p class="muted">${SITE.lessonsIntro}</p>
<p class="small muted">${SITE.versionNote || ""}</p>${SITE.lessonsExtra || ""}` +
      CURRICULUM.terms.map(t => `
<div class="term"><h2>${esc(t.name)}</h2><div class="grid">
${t.chapters.map(c => `
  <a class="card chapter-card" href="#/lesson/${c.id}">
    <div class="no">${esc(c.no)} ${subjectTag(c.subject)} ${hasSupp(c) ? '<span class="tag supp">含補充</span>' : ""}</div>
    <div class="title">${esc(c.title)}</div>
    <div class="small muted">${esc(c.summary)}</div>
    <div style="margin-top:6px">${statusTags(chapterStatus(c.id, cs, read, visits), c)}</div>
  </a>`).join("")}
</div></div>`).join("");
  }

  let lessonObserver = null;
  function viewLesson(id, params) {
    if (lessonObserver) { lessonObserver.disconnect(); lessonObserver = null; }
    const c = allChapters().find(x => x.id === id && x.id !== "misc");
    if (!c) { $app.innerHTML = '<p>找不到這一章。</p><a href="#/lessons">回課程列表</a>'; return; }
    const read = Store.read();
    const chs = allChapters().filter(x => x.id !== "misc");
    const i = chs.findIndex(x => x.id === id);
    const prev = chs[i - 1], next = chs[i + 1];
    const qCount = Store.allQuestions().filter(q => q.chapter === id && !q.supplement).length;
    const from = params.get("from");
    const secParam = params.get("sec");
    const active = Store.activeQuiz();
    let back = "";
    if (from === "quiz" && active) back = `<button class="btn small" data-action="resume-quiz">↩ 回到測驗（第 ${active.idx + 1} / ${active.qids.length} 題）</button>`;
    else if (from === "result" && Store.lastResult()) back = `<a class="btn small" href="#/quiz/result">↩ 回到成績與檢討</a>`;
    else if (from === "wrong") back = `<a class="btn small" href="#/wrong">↩ 回到錯題本</a>`;

    $app.innerHTML = `
${back ? `<div class="back-bar">${back}<span class="small muted">讀完這個觀念後按這裡回去，進度都還在。</span></div>` : ""}
<p class="small"><a href="#/lessons">← 課程</a> ／ ${esc(c.termName)}</p>
<h1>${esc(c.no)} ${esc(c.title)} ${subjectTag(c.subject)}</h1>
<p class="muted">${esc(c.summary)}</p>
${hasSupp(c) ? `<div class="small muted" style="margin-bottom:12px">📘 本章有紫色虛線框的<b>補充教材</b>（其他版本才有的內容，已標示版本），段考以${esc(PUB)}版為準。</div>` : ""}
<div class="lesson-layout">
  <aside class="toc card">
    ${c.checklist ? `<a href="javascript:void 0" data-action="scroll" data-target="sec-check">必會重點</a>` : ""}
    ${c.sections.map((s, k) => `<a href="javascript:void 0" data-action="scroll" data-target="sec-${k}">${esc(s.title)}</a>`).join("")}
    ${c.formulas && c.formulas.length ? `<a href="javascript:void 0" data-action="scroll" data-target="sec-f">本章${esc(FNAME)}</a>` : ""}
  </aside>
  <div class="lesson-body">
    ${c.checklist ? `<section class="card exam-card" id="sec-check"><h3 style="margin-top:0">✅ 這一章必會</h3>
      <ul class="checklist">${c.checklist.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
      <div class="small muted">讀完下面的內容後回來對照，每一項都能說出來就準備好了。</div></section>` : ""}
    ${c.sections.map((s, k) => `<section class="card" id="sec-${k}" data-sec="${k}"><h3 style="margin-top:0">${esc(s.title)}</h3>${s.html}</section>`).join("")}
    ${c.formulas && c.formulas.length ? `<section class="card" id="sec-f"><h3 style="margin-top:0">本章${esc(FNAME)}</h3>
      <div class="formula-list">${c.formulas.map(f => `<div class="formula-item"><b>${esc(f.name)}</b><div class="f">${esc(f.f)}</div><div class="small muted">${esc(f.note)}</div></div>`).join("")}</div></section>` : ""}
    <div class="card row">
      <label><input type="checkbox" data-action="mark-read" data-id="${c.id}" ${read[c.id] ? "checked" : ""}> 我讀完這一章了</label>
      <span class="small muted">（讀完不等於已掌握：這章答過 ${MASTER_MIN} 題次以上、正確率 ${MASTER_PCT}% 以上才算已掌握）</span>
      <span class="spacer"></span>
      <a class="btn" href="#/quiz?ch=${c.id}&purpose=core">練習本章（${esc(PUB)}核心 ${qCount} 題）</a>
    </div>
    <div class="row">
      ${prev ? `<a class="btn ghost small" href="#/lesson/${prev.id}">← ${esc(prev.title)}</a>` : ""}
      <span class="spacer"></span>
      ${next ? `<a class="btn ghost small" href="#/lesson/${next.id}">${esc(next.title)} →</a>` : ""}
    </div>
  </div>
</div>`;

    // 指定小節：捲過去並標示
    const target = secParam !== null ? document.getElementById("sec-" + secParam) : null;
    if (target) {
      setTimeout(() => { target.scrollIntoView({ block: "start" }); target.classList.add("flash"); }, 50);
    }
    // 記錄閱讀進度：最近看到的小節
    Store.markVisit(c.id, target ? +secParam : (Store.visits()[c.id] ? Store.visits()[c.id].sec : 0));
    if ("IntersectionObserver" in window) {
      lessonObserver = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) Store.markVisit(c.id, +e.target.dataset.sec); });
      }, { rootMargin: "-30% 0px -60% 0px" });
      document.querySelectorAll(".lesson-body section[data-sec]").forEach(s => lessonObserver.observe(s));
    }
  }

  // ================= 模擬實驗 =================
  const SIMS = [
    { id: "wave", ready: true, ch: "8A-3", title: "波動：頻率、波長與介質振動", desc: "調整頻率與振幅，切換橫波與縱波，觀察同一介質中頻率與波長的關係，並比較介質振動與波的傳播。四個「預測 → 觀察 → 解釋」任務。" },
    { id: "ohm", ready: true, ch: "9A-4", title: "歐姆定律：電壓、電流與電阻", desc: "改變電池數與電阻，讀安培計與伏特計，自己畫出 V–I 圖、從斜率求電阻；也試試伏特計接錯會怎樣。三個「預測 → 觀察 → 解釋」任務。" },
    { id: "circuit", ready: true, ch: "9A-4", title: "串聯與並聯：電流、電壓與總電阻", desc: "兩個燈泡改成串聯或並聯，比較各處電流、電壓、亮度與總電阻，並觀察拿掉一個燈泡時另一個會不會亮。三個「預測 → 觀察 → 解釋」任務。" },
    { id: "lens", ready: true, ch: "8A-4", title: "凸透鏡成像：物距、像距與光學儀器", desc: "拖動物體改變物距、移動屏幕找清楚的像，看三條特殊光線，整理出 p > 2f、f < p < 2f、p < f 的成像規律與照相機、投影機、放大鏡。三個「預測 → 觀察 → 解釋」任務。" }
  ];
  function viewSims() {
    $app.innerHTML = `<h1>🧪 模擬實驗</h1>
<p class="muted">先預測、再動手調整觀察、最後說出原因。每個模擬都會寫清楚它的假設和適用範圍。</p>
<div class="grid">${SIMS.map(s => `<div class="card">
  <div class="small muted">${esc(chapterLabel(s.ch))}</div>
  <h3 style="margin:4px 0">${esc(s.title)} ${s.ready ? "" : '<span class="tag">規劃中</span>'}</h3>
  <p class="small">${esc(s.desc)}</p>
  ${s.ready ? `<a class="btn" href="#/sim/${s.id}">開始</a>` : '<span class="small muted">之後的版本會加入</span>'}
</div>`).join("")}</div>`;
  }

  function viewFormulas() {
    $app.innerHTML = `<div class="row"><h1>${esc(FNAME)}卡</h1><span class="spacer"></span>
<button class="btn ghost no-print" onclick="window.print()">列印</button></div>
<p class="muted">考前快速複習用。點章節名稱可回到該章重點。</p>` +
      CURRICULUM.terms.map(t => `<h2>${esc(t.name)}</h2>` + t.chapters.filter(c => c.formulas && c.formulas.length).map(c => `
<h3><a href="#/lesson/${c.id}">${esc(c.no)} ${esc(c.title)}</a></h3>
<div class="formula-list">${c.formulas.map(f => `<div class="formula-item"><b>${esc(f.name)}</b><div class="f">${esc(f.f)}</div><div class="small muted">${esc(f.note)}</div></div>`).join("")}</div>`).join("")).join("");
  }

  // ================= 圖解：放大檢視與手機排版 =================
  // 容器太窄時不再整張縮小，改用原尺寸並可左右滑動；每張圖都能點開放大
  function enhanceFigures(root) {
    (root || document).querySelectorAll(".fig-scroll, .q-fig").forEach(box => {
      const svg = box.querySelector("svg");
      if (!svg) return;
      if (!box.querySelector(".fig-zoom")) {
        const b = document.createElement("button");
        b.className = "fig-zoom"; b.type = "button"; b.dataset.action = "zoom-fig";
        b.textContent = "🔍 放大"; b.setAttribute("aria-label", "放大這張圖");
        box.appendChild(b);
      }
      const natural = parseFloat(svg.getAttribute("width")) || 0;
      box.classList.toggle("fig-natural", natural > 0 && box.clientWidth < natural * 0.97);
      box.classList.toggle("can-scroll", box.classList.contains("fig-natural"));
    });
  }

  let lbScale = 1;
  function openLightbox(svg) {
    closeLightbox();
    const label = svg.getAttribute("aria-label") || "";
    const notes = (window.FIG && FIG.NOTES && FIG.NOTES[label]) || [];
    const fig = svg.closest("figure");
    const cap = fig && fig.querySelector("figcaption") ? fig.querySelector("figcaption").textContent : "";
    const lb = document.createElement("div");
    lb.id = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-label", "放大檢視：" + label);
    lb.innerHTML = `<div class="lb-bar">
  <button class="btn small" data-action="lb-zoom" data-d="-0.5" aria-label="縮小">－</button>
  <span class="lb-scale" id="lbScale">100%</span>
  <button class="btn small" data-action="lb-zoom" data-d="0.5" aria-label="放大">＋</button>
  <button class="btn small ghost" data-action="lb-reset">重設</button>
  <span class="spacer"></span>
  <button class="btn small danger" data-action="lb-close">✕ 關閉</button></div>
<div class="lb-stage" id="lbStage"><div class="lb-inner" id="lbInner"></div></div>
${cap || notes.length ? `<div class="lb-notes">${cap ? `<div>${esc(cap)}</div>` : ""}${notes.length ? `<ul>${notes.map(n => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}</div>` : ""}`;
    document.body.appendChild(lb);
    const clone = svg.cloneNode(true);
    clone.removeAttribute("width");
    document.getElementById("lbInner").appendChild(clone);
    document.body.classList.add("lb-open");
    lbScale = 1; applyLbScale();
    lb.querySelector("[data-action=lb-close]").focus();
  }
  function applyLbScale() {
    const stage = document.getElementById("lbStage"), inner = document.getElementById("lbInner");
    if (!stage || !inner) return;
    inner.style.width = Math.round((stage.clientWidth - 16) * lbScale) + "px";
    document.getElementById("lbScale").textContent = Math.round(lbScale * 100) + "%";
  }
  function closeLightbox() {
    const lb = document.getElementById("lightbox");
    if (lb) lb.remove();
    document.body.classList.remove("lb-open");
  }

  // ================= 測驗：設定 =================
  let quiz = null;
  let timerId = null;
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

  // 題數、限時的驗證：只接受正整數（限時可為 0）。全形數字先轉半形。
  function readInt(raw, { min, max, name, allowZero }) {
    const s = String(raw == null ? "" : raw).trim().replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
    if (s === "") return { error: "請輸入" + name + "。" };
    if (!/^\d+$/.test(s)) return { error: name + "必須是" + (allowZero ? "0 或正整數" : "正整數") + "（不能有小數點、負號或其他符號），例如 10。" };
    const n = parseInt(s, 10);
    if (n < min) return { error: name + "至少要 " + min + "。" };
    if (n > max) return { error: name + "最多 " + max + "。" };
    return { value: n };
  }

  function setupFilters() {
    const val = id => document.getElementById(id);
    return {
      chs: Array.from(document.querySelectorAll('input[name=ch]:checked')).map(x => x.value),
      types: Array.from(document.querySelectorAll('input[name=tp]:checked')).map(x => x.value),
      src: val("src").value,
      purpose: (document.querySelector('input[name=purpose]:checked') || { value: "core" }).value,
      mode: document.querySelector('input[name=mode]:checked').value,
      order: val("order").value,
      qn: readInt(val("qn").value, { min: 1, max: 500, name: "題數" }),
      tl: readInt(val("tl").value, { min: 0, max: 180, name: "限時分鐘數", allowZero: true })
    };
  }

  function setupPool(f) {
    return Store.allQuestions().filter(q => f.chs.includes(q.chapter) && f.types.includes(q.type) && (!f.src || q.source === f.src));
  }

  // 依目前設定，即時算出可用題數與實際出題數；回傳是否可以開始
  function updateSetupPreview() {
    const box = document.getElementById("setupPreview");
    const btn = document.querySelector('[data-action=start-quiz]');
    if (!box || !btn) return false;
    const f = setupFilters();
    const problems = [];
    if (!f.chs.length) problems.push("請至少選一個章節。");
    if (!f.types.length) problems.push("請至少選一種題型。");
    if (f.qn.error) problems.push(f.qn.error);
    if (f.mode === "exam" && f.tl.error) problems.push(f.tl.error);
    let html = "";
    if (f.chs.length && f.types.length) {
      const all = setupPool(f);
      const core = all.filter(q => !q.supplement).length, supp = all.length - core;
      const avail = f.purpose === "core" ? core : f.purpose === "supp" ? supp : all.length;
      const which = f.purpose === "core" ? "只出核心題" : f.purpose === "supp" ? "只出補充題" : "核心＋補充都出";
      html += `<div>符合條件的題目：${esc(PUB)}核心 <b>${core}</b> 題、補充 <b>${supp}</b> 題（${which}），可用 <b>${avail}</b> 題。</div>`;
      if (!avail) problems.push("這個條件下沒有題目，換個章節、題型或來源試試。");
      else if (!f.qn.error) {
        const n = Math.min(f.qn.value, avail);
        html += f.qn.value > avail
          ? `<div class="msg warn" style="margin:6px 0 0">你要 ${f.qn.value} 題，但只有 ${avail} 題可出，<b>實際將出 ${n} 題</b>。</div>`
          : `<div>實際將出 <b>${n}</b> 題。</div>`;
      }
    }
    if (problems.length) html += `<div class="msg warn" style="margin:6px 0 0">${problems.map(esc).join("<br>")}</div>`;
    box.innerHTML = html;
    btn.disabled = problems.length > 0;
    return problems.length === 0;
  }

  function resumeBanner() {
    const s = Store.activeQuiz();
    if (!s) return "";
    const answered = s.answers.filter(Boolean).length;
    let timeInfo = "";
    if (s.timeLimitSec) {
      const left = s.timeLimitSec - Math.floor((Date.now() - s.startedAt) / 1000);
      timeInfo = left > 0 ? `，剩餘 ${fmtSec(left)}` : "，<b>時間已到</b>";
    }
    return `<div class="card exam-card">
  <b>你有一個未完成的測驗</b>：${esc(s.title)}（${s.mode === "exam" ? "考試模式" : "練習模式"}，已作答 ${answered} / ${s.qids.length} 題${timeInfo}）
  <div class="row" style="margin-top:8px">
    <button class="btn" data-action="resume-quiz">${s.timeLimitSec && Date.now() - s.startedAt >= s.timeLimitSec * 1000 ? "交卷看成績" : "繼續測驗"}</button>
    <button class="btn ghost" data-action="discard-quiz">放棄本次測驗</button>
  </div></div>`;
  }

  function viewQuizSetup(params) {
    const pre = (params.get("ch") || "").split(",").filter(Boolean);
    const purpose = ["core", "all", "supp"].includes(params.get("purpose")) ? params.get("purpose") : "core";
    const presetN = /^\d+$/.test(params.get("n") || "") ? params.get("n") : "10";
    const all = Store.allQuestions();
    const count = {};
    all.forEach(q => { count[q.chapter] = (count[q.chapter] || 0) + 1; });
    const sources = Array.from(new Set(all.map(q => q.source))).sort();

    const groups = CURRICULUM.terms.map(t => ({ id: t.id, name: t.name, chapters: t.chapters }));
    if (count.misc) groups.push({ id: "misc", name: "其他", chapters: [MISC] });

    $app.innerHTML = `<div id="setupRoot">
<h1>測驗</h1>
${resumeBanner()}
<div class="card">
  <h3 style="margin-top:0">1. 選章節</h3>
  ${groups.map(g => `
    <div class="row" style="margin-top:10px"><b>${esc(g.name)}</b>
      <button class="btn small ghost" data-action="pick-term" data-term="${g.id}">全選</button>
      <button class="btn small ghost" data-action="unpick-term" data-term="${g.id}">取消</button></div>
    <div class="chapter-pick">
      ${g.chapters.map(c => `<label><input type="checkbox" name="ch" value="${c.id}" data-term="${g.id}"
         ${pre.includes(c.id) ? "checked" : ""} ${count[c.id] ? "" : "disabled"}>
         ${esc((c.no ? c.no + " " : "") + c.title)}<span class="cnt">${count[c.id] || 0} 題</span></label>`).join("")}
    </div>`).join("")}
</div>
<div class="card">
  <h3 style="margin-top:0">2. 設定</h3>
  <div class="row" style="margin-bottom:10px">
    <label>題數 <input type="text" inputmode="numeric" id="qn" value="${presetN}" style="width:80px"></label>
    <label>題目來源
      <select id="src"><option value="">全部</option>${sources.map(s => `<option>${esc(s)}</option>`).join("")}</select></label>
    <label>出題方式
      <select id="order">
        <option value="smart">優先出沒做過與答錯的</option>
        <option value="random">完全隨機</option>
      </select></label>
  </div>
  <div class="row" style="margin-bottom:10px">題型：
    ${Object.keys(TYPE_NAME).map(t => `<label><input type="checkbox" name="tp" value="${t}" checked> ${TYPE_NAME[t]}</label>`).join("")}
  </div>
  <div style="margin-bottom:10px"><b>目的：</b>
    <label class="purpose"><input type="radio" name="purpose" value="core" ${purpose === "core" ? "checked" : ""}> <b>${esc(PUB)}段考複習</b>：只出${esc(PUB)}版核心題</label>
    <label class="purpose"><input type="radio" name="purpose" value="all" ${purpose === "all" ? "checked" : ""}> <b>跨版本加強</b>：核心題＋其他版本的補充題</label>
    <label class="purpose"><input type="radio" name="purpose" value="supp" ${purpose === "supp" ? "checked" : ""}> 只練補充教材題</label>
  </div>
  <div class="row">模式：
    <label><input type="radio" name="mode" value="practice" checked> 練習模式（每題立刻對答案、看解析）</label>
    <label><input type="radio" name="mode" value="exam"> 考試模式（交卷後才公布）</label>
    <label id="tlWrap">限時 <input type="text" inputmode="numeric" id="tl" value="0" style="width:70px"> 分鐘（0 = 不限時）</label>
  </div>
</div>
<div class="card small" id="setupPreview"></div>
<div id="setupMsg"></div>
<button class="btn" data-action="start-quiz">開始測驗</button></div>`;

    const card = document.getElementById("setupRoot");
    card.addEventListener("input", updateSetupPreview);
    card.addEventListener("change", updateSetupPreview);
    card.addEventListener("click", e => { if (e.target.closest('[data-action=pick-term],[data-action=unpick-term]')) setTimeout(updateSetupPreview, 0); });
    updateSetupPreview();
  }

  function startQuiz() {
    if (!updateSetupPreview()) return;
    const f = setupFilters();
    const pool = setupPool(f).filter(q => f.purpose === "all" || (f.purpose === "supp" ? !!q.supplement : !q.supplement));
    const picked = pickQuestions(pool, f.qn.value, f.order);
    const title = f.purpose === "core" ? PUB + "段考複習" : f.purpose === "supp" ? "補充教材練習" : "跨版本加強";
    beginQuiz(picked, { mode: f.mode, timeLimitSec: f.mode === "exam" ? f.tl.value * 60 : 0, chapters: f.chs, title });
  }

  function pickQuestions(pool, n, order) {
    pool = shuffle(pool.slice());
    if (order === "smart") {
      const st = Store.qstats(), wr = Store.wrong();
      const score = q => (wr[q.id] ? 0 : !st[q.id] ? 1 : 2 + st[q.id].correct / st[q.id].seen);
      pool.sort((a, b) => score(a) - score(b));
    }
    return shuffle(pool.slice(0, n));
  }

  // ---------- 測驗狀態保存 ----------
  function saveQuiz() {
    if (!quiz || quiz.finished) return;
    Store.saveActiveQuiz({
      v: 1, mode: quiz.mode, title: quiz.title, chapters: quiz.chapters,
      qids: quiz.questions.map(q => q.id), answers: quiz.answers, checked: quiz.checked,
      idx: quiz.idx, startedAt: quiz.startedAt, timeLimitSec: quiz.timeLimitSec
    });
  }

  // 從保存的狀態找回題目。題庫中已被刪除的題目會略過（連同它的作答）
  function restoreQuiz(s) {
    const byId = {};
    Store.allQuestions().forEach(q => { byId[q.id] = q; });
    const keep = s.qids.map((id, k) => k).filter(k => byId[s.qids[k]]);
    if (!keep.length) return null;
    return {
      mode: s.mode, title: s.title, chapters: s.chapters,
      questions: keep.map(k => byId[s.qids[k]]),
      answers: keep.map(k => s.answers[k] || ""),
      checked: keep.map(k => !!s.checked[k]),
      idx: Math.min(Math.max(0, keep.indexOf(s.idx) >= 0 ? keep.indexOf(s.idx) : 0), keep.length - 1),
      startedAt: s.startedAt, timeLimitSec: s.timeLimitSec || 0, finished: false,
      dropped: s.qids.length - keep.length
    };
  }

  function beginQuiz(questions, opt) {
    if (Store.activeQuiz() && !confirm("開始新測驗會放棄目前未完成的測驗，確定嗎？")) return;
    Store.clearActiveQuiz();
    quiz = {
      mode: opt.mode, title: opt.title, chapters: opt.chapters,
      questions, answers: questions.map(() => ""), checked: questions.map(() => false),
      idx: 0, startedAt: Date.now(),
      timeLimitSec: opt.timeLimitSec || 0, finished: false
    };
    saveQuiz();
    location.hash = "#/quiz/run";
  }

  function resumeQuiz() {
    const s = Store.activeQuiz();
    if (!s) { location.hash = "#/quiz"; return; }
    const q = restoreQuiz(s);
    if (!q) { Store.clearActiveQuiz(); alert("這次測驗的題目已從題庫刪除，無法接續。"); location.hash = "#/quiz"; return; }
    quiz = q;
    if (location.hash === "#/quiz/run") viewQuizRun(); else location.hash = "#/quiz/run";
  }

  // ================= 測驗：作答 =================
  function viewQuizRun() {
    if (!quiz) {
      // 重新整理或從別頁回來：先讓學生選擇繼續或放棄
      if (!Store.activeQuiz()) { location.hash = "#/quiz"; return; }
      $app.innerHTML = `<h1>測驗</h1>${resumeBanner()}`;
      return;
    }
    if (quiz.finished) { location.hash = "#/quiz"; return; }
    if (timerExpired()) { finishQuiz({ timeUp: true }); return; }
    if (quiz.timeLimitSec && !timerId) {
      timerId = setInterval(() => {
        if (!quiz || quiz.finished) { stopTimer(); return; }
        const left = quiz.timeLimitSec - Math.floor((Date.now() - quiz.startedAt) / 1000);
        const t = document.getElementById("timer");
        if (t) { t.textContent = "剩餘 " + fmtSec(Math.max(0, left)); t.classList.toggle("low", left < 60); }
        if (left <= 0) { stopTimer(); finishQuiz({ timeUp: true }); }
      }, 1000);
    }
    renderQuestion();
  }

  function renderQuestion() {
    const q = quiz.questions[quiz.idx];
    const given = quiz.answers[quiz.idx];
    const checked = quiz.mode === "practice" && quiz.checked[quiz.idx];
    const n = quiz.questions.length;

    let body = "";
    if (q.type === "single" || q.type === "multi" || q.type === "tf") {
      const opts = q.type === "tf" ? [["O", "O　對"], ["X", "X　錯"]] : q.options.map((o, k) => [LETTERS[k], o]);
      body = '<div class="options">' + opts.map(([key, text]) => {
        let cls = "opt";
        const chosen = given.includes(key);
        if (checked) {
          if (q.answer.includes(key)) cls += " right";
          else if (chosen) cls += " wrong";
        } else if (chosen) cls += " chosen";
        return `<button class="${cls}" data-action="choose" data-key="${key}" ${checked ? "disabled" : ""}>
          ${q.type === "tf" ? "" : `<span class="key">(${key})</span>`}<span>${rich(text)}</span></button>`;
      }).join("") + "</div>";
    } else {
      body = `<input type="text" id="fillAns" value="${esc(given)}" placeholder="輸入答案" style="width:100%;max-width:420px" ${checked ? "disabled" : ""}>`;
    }

    let feedback = "";
    if (checked) {
      const ok = isCorrect(q, given);
      feedback = `<div class="explain">
        <div class="msg ${ok ? "ok" : "bad"}">${ok ? "✔ 答對了！" : "✘ 答錯了，正確答案：" + esc(answerText(q, q.answer))}${ok ? "" : formatMiss(q, given) ? "<br>" + esc(formatMiss(q, given)) : ""}</div>
        ${explainBlock(q, ok, "quiz")}</div>`;
    }

    const dots = quiz.questions.map((qq, k) => {
      let c = "";
      if (quiz.mode === "practice" && quiz.checked[k]) c = isCorrect(qq, quiz.answers[k]) ? "right" : "wrong";
      else if (quiz.answers[k]) c = "done";
      return `<button class="${c} ${k === quiz.idx ? "cur" : ""}" data-action="goto" data-i="${k}">${k + 1}</button>`;
    }).join("");

    const isLast = quiz.idx === n - 1;
    let actions = "";
    if (quiz.mode === "practice") {
      actions = !checked
        ? `<button class="btn" data-action="check" ${given ? "" : "disabled"} id="checkBtn">確認答案</button>`
        : (isLast ? `<button class="btn" data-action="finish">看成績</button>` : `<button class="btn" data-action="next">下一題 →</button>`);
    } else {
      actions = `${quiz.idx > 0 ? `<button class="btn ghost" data-action="prev">← 上一題</button>` : ""}
        ${!isLast ? `<button class="btn" data-action="next">下一題 →</button>` : ""}
        <span class="spacer"></span><button class="btn danger" data-action="finish">交卷</button>`;
    }

    $app.innerHTML = `
<div class="row"><b>${esc(quiz.title)}</b><span class="muted" id="qPos">第 ${quiz.idx + 1} / ${n} 題</span><span class="spacer"></span>
  ${quiz.timeLimitSec ? `<span class="timer" id="timer">剩餘 ${fmtSec(Math.max(0, quiz.timeLimitSec - Math.floor((Date.now() - quiz.startedAt) / 1000)))}</span>` : ""}
  <button class="btn small ghost" data-action="quit">放棄</button></div>
${quiz.dropped ? `<div class="msg warn small">有 ${quiz.dropped} 題已從題庫刪除，這次測驗略過它們。</div>` : ""}
<div class="small muted">作答會自動保存，重新整理或離開這一頁後可以回來繼續。</div>
<div class="progress-dots">${dots}</div>
<div class="card">
  <div class="q-head"><span class="tag">${TYPE_NAME[q.type]}</span>${suppTag(q)}${q.type === "multi" ? '<span class="small muted">（可複選）</span>' : ""}
    <span class="small muted">${esc(chapterLabel(q.chapter))}</span>
    ${q.source && q.source !== "內建練習題" ? `<span class="tag">${esc(q.source)}${q.year ? " " + esc(q.year) : ""}</span>` : ""}</div>
  ${q.image ? `<img class="q-img" src="${esc(q.image)}" alt="題目附圖">` : ""}
  ${q.figure ? `<div class="q-fig">${q.figure}</div>` : ""}
  <div class="q-text">${rich(q.q)}</div>
  ${body}
  ${feedback}
</div>
<div class="row">${actions}</div>`;

    const fill = document.getElementById("fillAns");
    if (fill) {
      fill.focus();
      fill.addEventListener("input", () => {
        quiz.answers[quiz.idx] = fill.value.trim();
        saveQuiz();
        const b = document.getElementById("checkBtn"); if (b) b.disabled = !fill.value.trim();
      });
      fill.addEventListener("keydown", e => {
        if (e.key === "Enter") { const b = document.getElementById("checkBtn"); if (b && !b.disabled) b.click(); }
      });
    }
  }

  function choose(key) {
    const q = quiz.questions[quiz.idx];
    let g = quiz.answers[quiz.idx];
    if (q.type === "multi") g = g.includes(key) ? g.replace(key, "") : (g + key).split("").sort().join("");
    else g = key;
    quiz.answers[quiz.idx] = g;
    saveQuiz();
    renderQuestion();
  }

  function moveTo(i) {
    quiz.idx = Math.min(Math.max(i, 0), quiz.questions.length - 1);
    saveQuiz();
    renderQuestion();
  }

  function checkCurrent() {
    if (!quiz.answers[quiz.idx]) return;   // 空白答案不能確認
    quiz.checked[quiz.idx] = true;
    saveQuiz();
    renderQuestion();
  }

  function finishQuiz(opt) {
    opt = opt || {};
    if (!quiz || quiz.finished) return;
    const unanswered = quiz.answers.filter(a => !a).length;
    if (quiz.mode === "exam" && unanswered && !opt.timeUp && !timerExpired()) {
      if (!confirm("還有 " + unanswered + " 題沒作答，確定交卷？")) return;
    }
    stopTimer();
    quiz.finished = true;
    // 先清掉進行中的狀態再記成績：重新整理不會重複計分
    Store.clearActiveQuiz();
    // 練習模式中途看成績：只計已確認的題目
    const idxs = quiz.questions.map((_, k) => k).filter(k => quiz.mode === "exam" || quiz.checked[k]);
    const details = idxs.map(k => ({ qid: quiz.questions[k].id, given: quiz.answers[k], correct: isCorrect(quiz.questions[k], quiz.answers[k]) }));
    const limitedDuration = quiz.timeLimitSec ? Math.min(quiz.timeLimitSec, Math.round((Date.now() - quiz.startedAt) / 1000)) : Math.round((Date.now() - quiz.startedAt) / 1000);
    quiz.result = {
      date: new Date().toISOString(),
      mode: quiz.mode, title: quiz.title, chapters: quiz.chapters,
      total: details.length, correct: details.filter(d => d.correct).length,
      durationSec: limitedDuration,
      timeUp: !!opt.timeUp,
      details
    };
    if (details.length) Store.recordAttempt(quiz.result);
    Store.saveLastResult({ result: quiz.result });
    location.hash = "#/quiz/result";
  }
  function timerExpired() {
    return quiz && quiz.timeLimitSec && (Date.now() - quiz.startedAt) / 1000 >= quiz.timeLimitSec;
  }

  function viewQuizResult() {
    if (!quiz || !quiz.result) {
      // 重新整理成績頁：從最近一次成績找回（不會重新記分）
      const last = Store.lastResult();
      if (!last || !last.result) { location.hash = "#/quiz"; return; }
      const all = {}; Store.allQuestions().forEach(q => { all[q.id] = q; });
      quiz = { finished: true, result: last.result, questions: last.result.details.map(d => all[d.qid]).filter(Boolean) };
    }
    const r = quiz.result;
    // 有錯題時最多顯示 99 分，避免 204/205 四捨五入成 100 分卻說「全對」
    const score = scoreOf(r.correct, r.total);
    const byId = {}; quiz.questions.forEach(q => { byId[q.id] = q; });
    r.details = r.details.filter(d => byId[d.qid]);
    const wrongIds = r.details.filter(d => !d.correct).map(d => d.qid);
    const cheer = r.correct === r.total ? "太強了，全對！🎉" : score >= 80 ? "很棒！再把錯的看一遍就更穩了。" : score >= 60 ? "及格了，錯的題目回去看一下重點。" : "沒關係，先回去讀一下重點再試一次。";

    $app.innerHTML = `
<div class="card" style="text-align:center">
  <div class="muted">${esc(r.title)}・${r.mode === "exam" ? "考試模式" : "練習模式"}・用時 ${fmtSec(r.durationSec)}</div>
  ${r.timeUp ? '<div class="msg warn">時間到，已依作答內容自動交卷。</div>' : ""}
  ${r.total ? `<div class="score-ring">${score} 分</div>` : '<div class="msg warn">這次沒有確認任何一題，所以沒有成績。</div>'}
  <div>答對 ${r.correct} / ${r.total} 題</div>
  <p>${cheer}</p>
  <div class="row" style="justify-content:center">
    ${wrongIds.length ? `<button class="btn" data-action="redo-wrong">重做這次的錯題（${wrongIds.length}）</button>` : ""}
    <a class="btn ghost" href="#/quiz">再測一次</a>
    <a class="btn ghost" href="#/wrong">錯題本</a>
  </div>
</div>
<h2>逐題檢討</h2>
${r.details.map((d, k) => { const q = byId[d.qid]; return `
<div class="card">
  <div class="q-head"><b>${k + 1}.</b> <span class="tag ${d.correct ? "ok" : "bad"}">${d.correct ? "對" : "錯"}</span>${suppTag(q)}
    <span class="small muted">${esc(chapterLabel(q.chapter))}</span></div>
  ${q.image ? `<img class="q-img" src="${esc(q.image)}" alt="">` : ""}
  ${q.figure ? `<div class="q-fig">${q.figure}</div>` : ""}
  <div class="q-text">${rich(q.q)}</div>
  ${q.options ? `<ol type="A" class="small">${q.options.map(o => `<li>${rich(o)}</li>`).join("")}</ol>` : ""}
  <div>你的答案：<b>${esc(answerText(q, d.given))}</b>　正確答案：<b>${esc(answerText(q, q.answer))}</b></div>${formatMiss(q, d.given) ? `<div class="small muted">${esc(formatMiss(q, d.given))}</div>` : ""}
  ${explainBlock(q, d.correct, "result")}
</div>`; }).join("")}`;
    quiz._wrongIds = wrongIds;
  }

  // ================= 錯題本 =================
  function viewWrong() {
    const wr = Store.wrong();
    const qs = Store.allQuestions().filter(q => wr[q.id]);
    const groups = {};
    qs.forEach(q => { (groups[q.chapter] = groups[q.chapter] || []).push(q); });
    const order = allChapters().map(c => c.id).filter(id => groups[id]);

    $app.innerHTML = `
<div class="row"><h1>錯題本</h1><span class="spacer"></span>
  ${qs.length ? `<button class="btn" data-action="wrong-quiz" data-ch="">全部錯題重練（${qs.length}）</button>` : ""}</div>
<p class="muted">答錯的題目會自動收進來；重練時<b>連續答對 2 次</b>就會移出。</p>
${!qs.length ? '<div class="card">目前沒有錯題，很棒！去 <a href="#/quiz">測驗</a> 試試看。</div>' : ""}
${order.map(id => `
<h2>${esc(chapterLabel(id))} <button class="btn small ghost" data-action="wrong-quiz" data-ch="${id}">重練本章錯題</button></h2>
${groups[id].map(q => `
<div class="card">
  <div class="q-head"><span class="tag">${TYPE_NAME[q.type]}</span>${suppTag(q)}<span class="tag bad">錯 ${wr[q.id].count} 次</span>
    <span class="small muted">最近：${fmtDate(wr[q.id].last)}</span><span class="spacer"></span>
    <button class="btn small ghost" data-action="remove-wrong" data-id="${esc(q.id)}">我懂了，移除</button></div>
  ${q.image ? `<img class="q-img" src="${esc(q.image)}" alt="">` : ""}
  ${q.figure ? `<div class="q-fig">${q.figure}</div>` : ""}
  <div class="q-text">${rich(q.q)}</div>
  ${q.options ? `<ol type="A" class="small">${q.options.map(o => `<li>${rich(o)}</li>`).join("")}</ol>` : ""}
  <details><summary>看答案與解析</summary>
    <div>上次你選：<b>${esc(answerText(q, wr[q.id].lastGiven))}</b>　正確答案：<b>${esc(answerText(q, q.answer))}</b></div>
    ${explainBlock(q, false, "wrong")}
  </details>
</div>`).join("")}`).join("")}`;
  }

  // ================= 學習紀錄 =================
  function viewStats() {
    const cs = chapterStats();
    const attempts = Store.attempts().slice().reverse();
    const rows = allChapters().filter(c => cs[c.id]);
    $app.innerHTML = `
<h1>學習紀錄</h1>
<h2>各章正確率</h2>
<div class="card">
${rows.length ? `<table><tr><th>章節</th><th style="width:45%">正確率</th><th>作答</th></tr>
${rows.map(c => { const s = cs[c.id], p = pct(s.correct, s.seen); return `
<tr><td><a href="#/quiz?ch=${c.id}">${esc(chapterLabel(c.id))}</a></td>
<td><div class="row"><div class="bar" style="flex:1"><i style="width:${p}%;background:${p >= 80 ? "var(--ok)" : p >= 60 ? "var(--warn)" : "var(--bad)"}"></i></div><b>${p}%</b></div></td>
<td>${s.correct}/${s.seen}</td></tr>`; }).join("")}</table>` : '<span class="muted">還沒有作答紀錄。</span>'}
</div>
<h2>測驗歷史</h2>
<div class="card">
${attempts.length ? `<table><tr><th>時間</th><th>內容</th><th>模式</th><th>成績</th><th>用時</th></tr>
${attempts.slice(0, 50).map(a => `<tr><td>${fmtDate(a.date)}</td>
<td>${esc(a.title)}<div class="small muted">${esc((a.chapters || []).map(id => chapterById(id).title).join("、"))}</div></td>
<td>${a.mode === "exam" ? "考試" : "練習"}</td><td><b>${scoreOf(a.correct, a.total)}</b>（${a.correct}/${a.total}）</td><td>${fmtSec(a.durationSec)}</td></tr>`).join("")}
</table>` : '<span class="muted">還沒有測驗紀錄。</span>'}
</div>`;
  }

  // ================= 題庫 / 匯入 =================
  let pendingImport = null;

  function chapterOptions(selected) {
    return CURRICULUM.terms.map(t => `<optgroup label="${esc(t.name)}">${t.chapters.map(c =>
      `<option value="${c.id}" ${c.id === selected ? "selected" : ""}>${esc(c.id + " " + c.title)}</option>`).join("")}</optgroup>`).join("") +
      `<option value="misc" ${selected === "misc" ? "selected" : ""}>misc ${MISC_NAME}</option>`;
  }

  function viewBank() {
    const batches = Store.batches().slice().reverse();
    $app.innerHTML = `
<h1>題庫 / 匯入考古題</h1>

<div class="card">
  <h2 style="margin-top:0">匯入考古題</h2>
  <p class="small muted">支援三種方式：上傳 Excel 另存的 <b>CSV</b>、上傳 <b>JSON</b>、或在 Excel 裡選取整個表格（含標題列）<b>複製後貼到下面</b>。
  第一次用請先下載範本照著填。</p>
  <div class="row" style="margin-bottom:10px">
    <button class="btn small ghost" data-action="tpl-csv">下載 CSV 範本</button>
    <button class="btn small ghost" data-action="tpl-json">下載 JSON 範本</button>
    <button class="btn small ghost" data-action="toggle-help">欄位說明</button>
  </div>
  <div id="help" style="display:none">${formatHelp()}</div>
  <div class="row" style="margin-bottom:10px">
    <label>來源名稱 <input type="text" id="impSource" placeholder="例：八上第一次段考" style="width:220px"></label>
    <label>年份 <input type="text" id="impYear" placeholder="例：113" style="width:90px"></label>
    <label>章節欄空白時歸到 <select id="impChapter">${chapterOptions("misc")}</select></label>
  </div>
  <div class="row" style="margin-bottom:10px">
    <input type="file" id="impFile" accept=".csv,.tsv,.txt,.json">
  </div>
  <textarea id="impText" placeholder="或在這裡貼上從 Excel 複製的表格（第一列是標題列）"></textarea>
  <div class="row" style="margin-top:10px"><button class="btn" data-action="preview-import">檢查內容</button></div>
  <div id="impResult"></div>
</div>

<div class="card">
  <h2 style="margin-top:0">手動新增一題</h2>
  <p class="small muted">手邊只有紙本考卷時，一題一題打進來。</p>
  ${addForm()}
</div>

<div class="card">
  <h2 style="margin-top:0">已匯入的批次</h2>
  ${batches.length ? `<table><tr><th>名稱</th><th>題數</th><th>匯入時間</th><th></th></tr>
  ${batches.map(b => `<tr><td>${esc(b.name)}</td><td>${Store.imported().filter(q => q.batchId === b.id).length}</td><td>${fmtDate(b.date)}</td>
  <td><button class="btn small danger" data-action="del-batch" data-id="${b.id}">刪除</button></td></tr>`).join("")}</table>`
        : '<span class="muted">還沒有匯入任何題目。</span>'}
</div>

<div class="card">
  <h2 style="margin-top:0">瀏覽題庫</h2>
  <div class="row">
    <select id="bkCh"><option value="">全部章節</option>${chapterOptions("")}</select>
    <select id="bkSrc"><option value="">全部來源</option>${Array.from(new Set(Store.allQuestions().map(q => q.source))).map(s => `<option>${esc(s)}</option>`).join("")}</select>
    <input type="text" id="bkKw" placeholder="搜尋題目文字">
  </div>
  <div id="bkList"></div>
</div>

<div class="card">
  <h2 style="margin-top:0">備份與還原</h2>
  <p class="small muted">學習紀錄和匯入的題目都存在這個瀏覽器裡。換電腦、換瀏覽器或清除瀏覽資料前，請先匯出備份。</p>
  <div class="row">
    <button class="btn" data-action="backup">匯出備份檔</button>
    <label class="btn ghost">從備份還原<input type="file" id="restoreFile" accept=".json" style="display:none"></label>
    <span class="spacer"></span>
    <button class="btn small danger" data-action="reset">清除學習紀錄</button>
  </div>
</div>`;

    document.getElementById("impFile").addEventListener("change", e => {
      const f = e.target.files[0]; if (!f) return;
      Importer.readFileText(f).then(t => {
        document.getElementById("impText").value = t;
        if (!document.getElementById("impSource").value) document.getElementById("impSource").value = f.name.replace(/\.[^.]+$/, "");
      });
    });
    document.getElementById("restoreFile").addEventListener("change", e => {
      const f = e.target.files[0]; if (!f) return;
      Importer.readFileText(f).then(t => {
        try {
          Store.restoreAll(JSON.parse(t));
          alert("還原完成！"); route();
        } catch (err) { alert("還原失敗：" + err.message); }
      });
    });
    ["bkCh", "bkSrc", "bkKw"].forEach(id => document.getElementById(id).addEventListener("input", renderBankList));
    renderBankList();
  }

  function formatHelp() {
    return `<table class="small">
<tr><th>欄位</th><th>必填</th><th>說明</th></tr>
<tr><td>題目</td><td>✔</td><td>題目文字，可以換行（CSV 中要用雙引號包起來）</td></tr>
<tr><td>題型</td><td></td><td>單選／多選／是非／填充。空白時自動判斷</td></tr>
<tr><td>選項A～選項E</td><td>選擇題</td><td>至少兩個選項</td></tr>
<tr><td>答案</td><td>✔</td><td>單選：B　多選：ACD　是非：O 或 X　填充：可接受多個答案用 | 分隔，如 <code>水|H2O</code></td></tr>
<tr><td>章節</td><td></td><td>章節代碼（如 <code>8A-1</code>）或章節名稱（如 <code>基本測量</code>）。空白時用上面選的預設章節</td></tr>
<tr><td>解析</td><td></td><td>答錯時顯示</td></tr>
<tr><td>來源、年份</td><td></td><td>空白時用上面填的來源名稱與年份</td></tr>
<tr><td>難度</td><td></td><td>1 易、2 中、3 難</td></tr>
<tr><td>圖片</td><td></td><td>圖檔名稱。把圖片放進網站資料夾的 <code>images</code> 子資料夾，這裡填檔名（如 <code>113-05.png</code>）</td></tr>
</table>
<p class="small">章節代碼：${allChapters().map(c => `<code>${c.id}</code> ${esc(c.title)}`).join("、")}</p>
<p class="small muted">Excel 存檔時選「CSV UTF-8」最穩；一般 CSV（Big5）也能自動辨識。重複的題目（題目與答案相同）會自動略過。</p>`;
  }

  function addForm() {
    return `<div class="row" style="margin-bottom:8px">
  <select id="afCh">${chapterOptions("8A-1")}</select>
  <select id="afType"><option value="single">單選</option><option value="multi">多選</option><option value="tf">是非</option><option value="fill">填充</option></select>
  <input type="text" id="afSrc" placeholder="來源（例：八上第一次段考）">
</div>
<textarea id="afQ" placeholder="題目" style="min-height:70px;font-family:inherit;font-size:16px"></textarea>
<div class="grid" id="afOpts" style="margin:8px 0">
  ${["A", "B", "C", "D", "E"].map(L => `<input type="text" id="afO${L}" placeholder="選項 ${L}${L === "E" ? "（可空白）" : ""}">`).join("")}
</div>
<div class="row" style="margin-bottom:8px">
  <input type="text" id="afAns" placeholder="答案（B / ACD / O / X / 文字）" style="width:260px">
</div>
<textarea id="afEx" placeholder="解析（可空白）" style="min-height:60px;font-family:inherit;font-size:16px"></textarea>
<div class="row" style="margin-top:8px"><button class="btn" data-action="add-one">加入題庫</button><span id="afMsg"></span></div>`;
  }

  function renderBankList() {
    const ch = document.getElementById("bkCh").value;
    const src = document.getElementById("bkSrc").value;
    const kw = document.getElementById("bkKw").value.trim();
    const list = Store.allQuestions().filter(q => (!ch || q.chapter === ch) && (!src || q.source === src) && (!kw || q.q.includes(kw)));
    const shown = list.slice(0, 100);
    document.getElementById("bkList").innerHTML = `<p class="small muted">共 ${list.length} 題${list.length > 100 ? "（只顯示前 100 題）" : ""}</p>
<table><tr><th>題目</th><th>題型</th><th>答案</th><th>章節 / 來源</th><th></th></tr>
${shown.map(q => `<tr><td>${esc(plain(q.q).length > 60 ? plain(q.q).slice(0, 60) + "…" : plain(q.q))}</td><td>${TYPE_NAME[q.type]}</td><td>${esc(answerText(q, q.answer))}</td>
<td class="small">${esc(chapterById(q.chapter).title)}<br><span class="muted">${esc(q.source)}${q.year ? " " + esc(q.year) : ""}</span></td>
<td>${q.batchId ? `<button class="btn small ghost" data-action="del-q" data-id="${esc(q.id)}">刪除</button>` : ""}</td></tr>`).join("")}</table>`;
  }

  function previewImport() {
    const text = document.getElementById("impText").value.trim();
    const out = document.getElementById("impResult");
    if (!text) { out.innerHTML = '<div class="msg warn">請先選檔案或貼上內容。</div>'; return; }
    const source = document.getElementById("impSource").value.trim();
    const batchId = "imp" + Date.now();
    let res;
    try {
      res = Importer.build(text, /^[\[{]/.test(text), {
        defaultChapter: document.getElementById("impChapter").value,
        source, year: document.getElementById("impYear").value.trim(), batchId
      });
    } catch (e) {
      out.innerHTML = `<div class="msg bad">無法讀取：${esc(e.message)}</div>`; return;
    }
    pendingImport = { batch: { id: batchId, name: source || "匯入題目", date: new Date().toISOString() }, questions: res.questions };
    out.innerHTML = `
<div class="msg ${res.questions.length ? "ok" : "bad"}">可匯入 <b>${res.questions.length}</b> 題${res.skipped ? `，略過重複 ${res.skipped} 題` : ""}${res.errors.length ? `，有 <b>${res.errors.length}</b> 列有問題（不會匯入）` : ""}。</div>
${res.errors.length ? `<div class="msg warn small">${res.errors.slice(0, 30).map(esc).join("<br>")}${res.errors.length > 30 ? "<br>…" : ""}</div>` : ""}
${res.questions.length ? `<p class="small muted">前幾題預覽：</p>
<table class="small"><tr><th>題目</th><th>題型</th><th>答案</th><th>章節</th></tr>
${res.questions.slice(0, 5).map(q => `<tr><td>${esc(q.q.slice(0, 50))}</td><td>${TYPE_NAME[q.type]}</td><td>${esc(answerText(q, q.answer))}</td><td>${esc(chapterById(q.chapter).title)}</td></tr>`).join("")}</table>
<div class="row" style="margin-top:10px"><button class="btn" data-action="confirm-import">確認匯入 ${res.questions.length} 題</button></div>` : ""}`;
  }

  function addOne() {
    const type = document.getElementById("afType").value;
    const o = {
      chapter: document.getElementById("afCh").value, type,
      q: document.getElementById("afQ").value.trim(),
      options: (type === "single" || type === "multi") ? ["A", "B", "C", "D", "E"].map(L => document.getElementById("afO" + L).value.trim()).filter(Boolean) : [],
      answer: document.getElementById("afAns").value.trim(),
      explain: document.getElementById("afEx").value.trim(),
      source: document.getElementById("afSrc").value.trim() || "手動輸入"
    };
    const msg = document.getElementById("afMsg");
    const batchId = "man" + Date.now();
    const res = Importer.build(JSON.stringify([o]), true, { defaultChapter: o.chapter, source: o.source, batchId });
    if (res.errors.length) { msg.innerHTML = `<span class="tag bad">${esc(res.errors[0].replace("第 1 列：", ""))}</span>`; return; }
    if (!res.questions.length) { msg.innerHTML = '<span class="tag bad">題庫已經有這一題</span>'; return; }
    // 手動輸入的題目依來源名稱合併成同一批
    const name = o.source;
    let batch = Store.batches().find(b => b.name === name && b.id.startsWith("man"));
    if (batch) {
      res.questions.forEach(q => { q.batchId = batch.id; q.id = batch.id + "-" + Date.now(); });
      Store.addQuestions(res.questions);
    } else Store.addBatch({ id: batchId, name, date: new Date().toISOString() }, res.questions);
    ["afQ", "afOA", "afOB", "afOC", "afOD", "afOE", "afAns", "afEx"].forEach(id => { document.getElementById(id).value = ""; });
    msg.innerHTML = '<span class="tag ok">已加入！</span>';
    renderBankList();
  }

  // 匯入範本放在各站的 data/site.js
  const CSV_TEMPLATE = SITE.csvTemplate || "";
  const JSON_TEMPLATE = SITE.jsonTemplate || "[]";

  // ================= 事件 =================
  document.addEventListener("click", e => {
    // 點圖解本身也可以放大
    const svgHit = !e.target.closest("[data-action]") && e.target.closest(".fig-scroll svg, .q-fig svg");
    if (svgHit && !e.target.closest("#lightbox")) { openLightbox(svgHit.closest("svg")); return; }
    const t = e.target.closest("[data-action]");
    if (!t) return;
    const a = t.dataset.action;
    switch (a) {
      case "scroll": document.getElementById(t.dataset.target).scrollIntoView({ behavior: "smooth" }); break;
      case "pick-term": case "unpick-term":
        document.querySelectorAll(`input[name=ch][data-term="${t.dataset.term}"]:not(:disabled)`).forEach(x => { x.checked = a === "pick-term"; }); break;
      case "start-quiz": startQuiz(); break;
      case "choose": choose(t.dataset.key); break;
      case "check": checkCurrent(); break;
      case "next": moveTo(quiz.idx + 1); break;
      case "prev": moveTo(quiz.idx - 1); break;
      case "goto": moveTo(+t.dataset.i); break;
      case "finish": finishQuiz(); break;
      case "quit": case "discard-quiz":
        if (confirm("確定放棄這次測驗？（不會記錄成績）")) { stopTimer(); quiz = null; Store.clearActiveQuiz(); if (location.hash === "#/quiz") route(); else location.hash = "#/quiz"; }
        break;
      case "resume-quiz": resumeQuiz(); break;
      case "redo-wrong": {
        const ids = quiz._wrongIds, pool = quiz.questions.filter(q => ids.includes(q.id));
        beginQuiz(shuffle(pool.slice()), { mode: "practice", title: "重做錯題", chapters: Array.from(new Set(pool.map(q => q.chapter))) });
        break;
      }
      case "wrong-quiz": {
        const wr = Store.wrong();
        const pool = Store.allQuestions().filter(q => wr[q.id] && (!t.dataset.ch || q.chapter === t.dataset.ch));
        if (pool.length) beginQuiz(shuffle(pool), { mode: "practice", title: "錯題重練", chapters: Array.from(new Set(pool.map(q => q.chapter))) });
        break;
      }
      case "mock-exam": {
        const f = window.EXAM_FOCUS;
        const pool = Store.allQuestions().filter(q => f.chapters.includes(q.chapter) && !q.supplement);
        beginQuiz(pickQuestions(pool, f.questions, "random"), { mode: "exam", timeLimitSec: f.minutes * 60, chapters: f.chapters, title: "模擬段考：" + f.title });
        break;
      }
      case "exam-wrong": {
        const f = window.EXAM_FOCUS, wr = Store.wrong();
        const pool = Store.allQuestions().filter(q => wr[q.id] && f.chapters.includes(q.chapter));
        if (pool.length) beginQuiz(shuffle(pool), { mode: "practice", title: "段考範圍錯題", chapters: f.chapters });
        break;
      }
      case "remove-wrong": Store.removeWrong(t.dataset.id); viewWrong(); break;
      case "set-profile": {
        const p = profile(); p[t.dataset.k] = t.dataset.k === "grade" ? +t.dataset.v : t.dataset.v;
        Store.saveProfile(p); viewHome(); break;
      }
      case "cap-exam": {
        const pool = Store.allQuestions().filter(q => SITE.capRange.test(q.chapter) && !q.supplement);
        beginQuiz(pickQuestions(pool, SITE.capQuestions, "random"), { mode: "exam", timeLimitSec: SITE.capMinutes * 60, chapters: Array.from(new Set(pool.map(q => q.chapter))), title: "會考綜合練習" });
        break;
      }
      case "zoom-fig": { const svg = t.parentElement.querySelector("svg"); if (svg) openLightbox(svg); break; }
      case "lb-zoom": lbScale = Math.min(4, Math.max(1, lbScale + parseFloat(t.dataset.d))); applyLbScale(); break;
      case "lb-reset": lbScale = 1; applyLbScale(); break;
      case "lb-close": closeLightbox(); break;
      case "tpl-csv": download("考古題範本.csv", "﻿" + CSV_TEMPLATE, "text/csv;charset=utf-8"); break;
      case "tpl-json": download("考古題範本.json", JSON_TEMPLATE, "application/json"); break;
      case "toggle-help": { const h = document.getElementById("help"); h.style.display = h.style.display === "none" ? "" : "none"; break; }
      case "preview-import": previewImport(); break;
      case "confirm-import":
        if (pendingImport && Store.addBatch(pendingImport.batch, pendingImport.questions)) {
          alert("已匯入 " + pendingImport.questions.length + " 題！");
          pendingImport = null; viewBank();
        }
        break;
      case "add-one": addOne(); break;
      case "del-batch": if (confirm("刪除這一批匯入的題目？（作答紀錄會保留）")) { Store.deleteBatch(t.dataset.id); viewBank(); } break;
      case "del-q": if (confirm("刪除這一題？")) { Store.deleteQuestion(t.dataset.id); renderBankList(); } break;
      case "backup": download(SITE.backupName + "_" + new Date().toISOString().slice(0, 10) + ".json", JSON.stringify(Store.exportAll()), "application/json"); break;
      case "reset": if (confirm("確定清除所有作答紀錄、錯題本與閱讀進度？匯入的題目會保留。")) { Store.resetProgress(); alert("已清除。"); } break;
    }
  });

  // 題目附圖找不到時，顯示提示而不是破圖
  document.addEventListener("error", e => {
    const img = e.target;
    if (img.tagName !== "IMG" || !img.classList.contains("q-img")) return;
    const div = document.createElement("div");
    div.className = "msg warn small";
    div.textContent = "找不到題目附圖：" + img.getAttribute("src") + "（請把圖檔放進網站資料夾的 images 子資料夾）";
    img.replaceWith(div);
  }, true);

  document.addEventListener("change", e => {
    if (e.target.dataset && e.target.dataset.action === "mark-read") Store.markRead(e.target.dataset.id, e.target.checked);
  });

  // ================= 路由 =================
  function route() {
    const hash = location.hash.slice(1) || "/";
    const [path, qs] = hash.split("?");
    const parts = path.split("/").filter(Boolean);
    const params = new URLSearchParams(qs || "");

    // 進行中的測驗已自動保存；離開這一頁不會丟失，回到測驗頁可以接續
    stopTimer();
    closeLightbox();
    if (lessonObserver) { lessonObserver.disconnect(); lessonObserver = null; }

    document.querySelectorAll("nav a[href^='#']").forEach(a => {
      const p = a.getAttribute("href").slice(2).split("/")[0];
      a.classList.toggle("active", p === (parts[0] === "lesson" ? "lessons" : parts[0] || ""));
    });
    document.getElementById("nav").classList.remove("open");
    window.scrollTo(0, 0);

    switch (parts[0]) {
      case undefined: viewHome(); break;
      case "lessons": viewLessons(); break;
      case "lesson": viewLesson(parts[1], params); break;
      case "formulas": viewFormulas(); break;
      case "sim":
        // 這個科目沒有模擬實驗時，回到首頁
        if (!(SITE.sims || []).length) { viewHome(); break; }
        if (parts[1] === "wave" && window.SimWave) window.SimWave.render($app);
        else if (parts[1] === "ohm" && window.SimOhm) window.SimOhm.render($app);
        else if (parts[1] === "circuit" && window.SimCircuit) window.SimCircuit.render($app);
        else if (parts[1] === "lens" && window.SimLens) window.SimLens.render($app);
        else viewSims();
        break;
      case "quiz":
        if (parts[1] === "run") viewQuizRun();
        else if (parts[1] === "result") viewQuizResult();
        else viewQuizSetup(params);
        break;
      case "wrong": viewWrong(); break;
      case "stats": viewStats(); break;
      case "bank": viewBank(); break;
      case "account": if (window.Cloud) window.Cloud.view($app); else viewHome(); break;
      default: viewHome();
    }
  }

  document.getElementById("menuBtn").addEventListener("click", () => document.getElementById("nav").classList.toggle("open"));
  // 每次畫面更新後處理圖解（放大按鈕、窄螢幕改用原尺寸可滑動）
  new MutationObserver(() => enhanceFigures($app)).observe($app, { childList: true });
  let resizeT = null;
  window.addEventListener("resize", () => { clearTimeout(resizeT); resizeT = setTimeout(() => { enhanceFigures($app); applyLbScale(); }, 150); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });
  window.addEventListener("hashchange", route);
  window.App = { route, allChapters };
  route();
})();
