/*
 * 英語站專用：點英文就念出來（瀏覽器內建的英語語音，Web Speech API），不需要錄音檔。
 * 只有英語站載入這個檔案，共用引擎 app.js 不用改。
 *   - 課文、句型卡、題目題幹、解析、圖裡的英文字詞，自動加上可以點的念音標記
 *   - 母音音標（[æ]、[e]、[i]……）點了播放 audio/ 裡錄好的單獨母音，念 3 次、中間有停頓
 *     （用 Windows 內建美式英語語音 Zira 以 IPA 音標合成；[ɚ] 單獨念和 [ɝ] 一樣，所以 [ɚ] 改念例字）
 *   - 子音音標和拼讀組合（a_e、ai、er、kn……）點了念例字：語音沒辦法單獨念這些，
 *     所以改念「緊接在後面的例字」（例如「[æ]，例如 cap、man、tap」念 cap、man、tap）；後面沒有例字時，念內建的例字
 *   - 測驗的選項不加（點選項是作答，避免誤觸）；題幹裡的音標、拼法也不加（念例字可能念出答案）
 *   - 緊接在「不是」「不能拼成」後面的英文是錯誤示範，不念
 */
(function () {
  const synth = window.speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === "undefined") return;   // 不支援的瀏覽器就不加

  // 挑美式英語的聲音；沒有就用任何英語聲音
  let voice = null;
  const pickVoice = () => {
    const vs = synth.getVoices().filter(v => /^en(-|_|$)/i.test(v.lang));
    voice = vs.find(v => /en[-_]US/i.test(v.lang) && /natural|online|google|samantha|aria|jenny/i.test(v.name)) ||
      vs.find(v => /en[-_]US/i.test(v.lang)) || vs[0] || null;
  };
  pickVoice();
  if (typeof synth.addEventListener === "function") synth.addEventListener("voiceschanged", pickVoice);

  let slow = false;
  try { slow = localStorage.getItem("esen.speakSlow") === "1"; } catch (e) { /* 無痕模式 */ }

  function say(text, el) {
    text = text.replace(/[_]+/g, " ").replace(/\s+/g, " ").trim();
    if (!text) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    if (voice) u.voice = voice;
    u.rate = slow ? 0.6 : 0.9;
    if (el) { el.classList.add("speaking"); u.onend = u.onerror = () => el.classList.remove("speaking"); }
    synth.speak(u);
  }

  // 音標和拼讀組合沒有例字時，念這些內建的例字
  const EXAMPLES = {
    "[æ]": "cap, man, tap", "[e]": "cake, rain, day", "[i]": "tree, tea, these", "[aɪ]": "kite, pie, night", "[o]": "home, boat, snow",
    "[u]": "June, blue, juice", "[ju]": "cute, mule", "[ɛ]": "bed, pen", "[ɪ]": "big, sit", "[ʌ]": "cup, sun",
    "[ɝ]": "her, bird, nurse", "[ɚ]": "teacher, sister", "[ɑr]": "car, farm", "[ɔr]": "fork, horse", "[ɔɪ]": "coin, boy",
    "[aʊ]": "house, cow", "[k]": "cat, cup", "[s]": "city, rice", "[g]": "go, bag", "[dʒ]": "giant, page", "[f]": "fish, phone", "[b]": "bag, bed",
    a_e: "cake, game", e_e: "these, Pete", i_e: "kite, bike", o_e: "home, rope", u_e: "cute, June",
    ai: "rain, train", ay: "day, play", ee: "bee, tree", ea: "tea, sea", ie: "pie, tie", igh: "high, night", oa: "boat, coat",
    ow: "snow, cow", ue: "blue, glue", ui: "juice, fruit", er: "her, teacher", ir: "bird, girl", ur: "nurse, turtle",
    ar: "car, farm", or: "fork, corn", oi: "coin, oil", oy: "boy, toy", ou: "house, mouth",
    kn: "knee, know", wr: "write, wrong", mb: "lamb, climb", ph: "phone, photo", gh: "laugh",
    bl: "black, blue", pl: "play, plane", gl: "glass, glad", cl: "class, clock", br: "bread, brown", pr: "prize, print",
    gr: "green, grass", cr: "crab, cry", tr: "tree, train", dr: "dress, drink", sp: "spoon, sport", st: "star, stop", sk: "sky, skate"
  };
  // 單獨母音的錄音（網站用 KK 音標；[e]、[o] 合成時用 IPA 的 eɪ、oʊ）
  const VOWEL_AUDIO = { "[æ]": "ae", "[e]": "e", "[i]": "i", "[aɪ]": "ai", "[o]": "o", "[u]": "u", "[ju]": "ju", "[ɛ]": "eh", "[ɪ]": "ih",
    "[ʌ]": "uh", "[ɝ]": "er1", "[ɑr]": "ar", "[ɔr]": "or", "[ɔɪ]": "oi", "[aʊ]": "au" };
  let player = null;
  function playVowel(sym, el) {
    synth.cancel();
    if (player) player.pause();
    player = new Audio(`audio/${VOWEL_AUDIO[sym]}.wav?v=20261026a`);
    if (el) { el.classList.add("speaking"); player.onended = player.onerror = () => el.classList.remove("speaking"); }
    player.play().catch(() => { if (el) el.classList.remove("speaking"); say(EXAMPLES[sym], el); });   // 播不出來就改念例字
  }

  const GRAPH = Object.keys(EXAMPLES).filter(k => k[0] !== "[").sort((a, b) => b.length - a.length);
  const GRAPH_RE = `(?<![A-Za-z_])(${GRAPH.join("|")})(?![A-Za-z_])`;
  // 一個音標、一個拼讀組合（前後不能接著英文字母），或一段英文（可以用空白、逗號、連字號接起來）
  const TOKEN = new RegExp(`(\\[[^\\]\\sA-Z0-9]{1,4}\\])|${GRAPH_RE}|([A-Za-z][A-Za-z'’]*(?:[,.?!;:]*[ \\-]+[A-Za-z][A-Za-z'’]*)*[.?!]?)`, "g");
  const worth = s => s.replace(/[^A-Za-z]/g, "").length >= 3;
  const WRONG = /(不是|不能拼成|錯誤寫法[：:]?)\s*$/;

  const TARGETS = ".lesson-body section, .formula-item, .q-text, .explain, .lb-inner";
  const SKIP = "h3, button, .btn, .options, input, textarea, select, script, style, .speak, .speak-sym, .no-speak";

  function mk(cls, text) {
    const sp = document.createElement("span");
    sp.className = cls; sp.textContent = text; sp.setAttribute("role", "button"); sp.tabIndex = 0;
    sp.title = cls === "speak" ? "點一下念出來" : "點一下念例字";
    return sp;
  }

  function wrapTextNodes(root) {
    // 題目題幹裡的音標、拼法不加念音：念例字可能剛好念出選項裡的答案
    const inStem = root.classList.contains("q-text");
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => (!/[A-Za-z\[]/.test(n.nodeValue) || (n.parentElement && (n.parentElement.closest(SKIP) || n.parentElement.closest("svg"))))
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    const nodes = []; let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(node => {
      const s = node.nodeValue; let last = 0, m, frag = null;
      TOKEN.lastIndex = 0;
      while ((m = TOKEN.exec(s))) {
        let el = null;
        if (m[1] && EXAMPLES[m[1]]) el = (inStem && !VOWEL_AUDIO[m[1]]) ? null : mk("speak-sym", m[1]);   // 題幹只放單獨母音的錄音，不念例字
        else if (m[2]) el = inStem ? null : mk("speak-sym", m[2]);
        else if (m[3] && worth(m[3]) && !WRONG.test(s.slice(Math.max(0, m.index - 8), m.index))) el = mk("speak", m[3]);
        if (!el) continue;
        frag = frag || document.createDocumentFragment();
        if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
        frag.appendChild(el);
        last = m.index + m[0].length;
      }
      if (!frag) return;
      if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
    linkExamples(root);
    markSvg(root);
  }

  // 每個音標、拼讀組合找出緊接在後面的例字：中間只能隔「念」「、」「：」「例如」「（」這類字
  function linkExamples(root) {
    const blocks = new Set([...root.querySelectorAll(".speak-sym")].map(s => s.closest("li, td, p, div, .formula-item") || root));
    const gapText = (a, b) => { const r = document.createRange(); r.setStartAfter(a); r.setEndBefore(b); return r.toString(); };
    blocks.forEach(block => {
      const items = [...block.querySelectorAll(".speak, .speak-sym")];
      items.forEach((it, i) => {
        if (!it.classList.contains("speak-sym") || it.dataset.say || VOWEL_AUDIO[it.textContent]) return;
        let j = i + 1, prev = it, lastSym = it;
        const words = [];
        // 前面是「不一定念」「不是」這類否定說法時，後面的字是反例，不拿來當例字
        const before = document.createRange(); before.setStart(block, 0); before.setEndBefore(it);
        if (/(不一定念|不一定|不是|不念)\s*$/.test(before.toString())) return;
        // 先跳過串在一起的組合／音標（ar 念 [ɑr]、oi、oy 都念 [ɔɪ]）
        while (j < items.length && items[j].classList.contains("speak-sym") && /^[\s、和]*(都可以念|都念|念)?\s*$/.test(gapText(prev, items[j]))) { prev = lastSym = items[j]; j++; }
        if (j < items.length && items[j].classList.contains("speak") && /^[\s：:（(，,]*(例如|像是|像)?[\s：:（(]*$/.test(gapText(prev, items[j]))) {
          words.push(items[j].textContent); prev = items[j]; j++;
          while (j < items.length && words.length < 5 && items[j].classList.contains("speak") && /^[\s、，,和]*$/.test(gapText(prev, items[j]))) { words.push(items[j].textContent); prev = items[j]; j++; }
        }
        if (words.length) it.dataset.say = words.join(", ");
        // 沒有例字時用內建例字；只有 ow 有兩種念法（snow、cow），要跟著後面的音標（ou、ow 都可以念 [aʊ]）
        else if (it.textContent === "ow" && lastSym !== it && EXAMPLES[lastSym.textContent]) it.dataset.say = lastSym.textContent === "[aʊ]" ? "cow, brown" : lastSym.textContent === "[o]" ? "snow, slow" : EXAMPLES[lastSym.textContent];
      });
    });
  }

  // 圖（SVG）裡的英文：有英文字的 text 可以點；拼讀表最左邊的標題（例如「長 a」「er / ir / ur」）點了念同一列的例字
  const wordsIn = s => (s.replace(/\[[^\]]*\]/g, " ").replace(new RegExp(GRAPH_RE, "g"), " ").match(/[A-Za-z][A-Za-z'’]*(?:[ \-][A-Za-z][A-Za-z'’]*)*/g) || []).filter(worth);
  function markSvg(root) {
    root.querySelectorAll("svg").forEach(svg => {
      const texts = [...svg.querySelectorAll("text")];
      texts.forEach(t => {
        if (t.dataset.say) return;
        const raw = t.textContent || "";
        const words = wordsIn(raw);
        if (words.length && !/[一-鿿]/.test(raw)) { t.dataset.say = words.join(" "); t.classList.add("speak-svg"); return; }
        if (!new RegExp(`${GRAPH_RE}|\\[|^長 [a-z]$`).test(raw)) return;
        const y = +t.getAttribute("y"), x = +t.getAttribute("x");
        const row = texts.filter(o => o !== t && Math.abs(+o.getAttribute("y") - y) < 4 && +o.getAttribute("x") > x)
          .sort((a, b) => a.getAttribute("x") - b.getAttribute("x"))
          .map(o => wordsIn(o.textContent || "").join(" ")).filter(Boolean);
        if (row.length) { t.dataset.say = row.join(", "); t.classList.add("speak-svg"); }
      });
      texts.forEach(t => { if (t.classList.contains("speak-svg")) { t.setAttribute("role", "button"); t.setAttribute("tabindex", "0"); } });
    });
  }

  const textOf = el => el.dataset.say || (el.classList.contains("speak-sym") ? EXAMPLES[el.textContent] || "" : el.textContent);

  let busy = false;
  function scan() {
    if (busy) return; busy = true;
    try {
      document.querySelectorAll(TARGETS).forEach(el => { if (!el.dataset.speakDone) { el.dataset.speakDone = "1"; wrapTextNodes(el); } });
      addToggle();
    } finally { busy = false; }
  }

  // 課文頁最上面放一個說明和「慢速」開關
  function addToggle() {
    const body = document.querySelector(".lesson-body");
    if (!body || body.querySelector(".speak-bar")) return;
    const bar = document.createElement("div");
    bar.className = "speak-bar no-speak";
    bar.innerHTML = `<span>🔊 點有<span class="speak-demo">虛線</span>的英文就會念出來；點母音音標（例如 [æ]）會念 3 次單獨的音；點拼法（例如 ai）會念例字</span> <label><input type="checkbox"${slow ? " checked" : ""}> 慢速</label>`;
    bar.querySelector("input").addEventListener("change", e => { slow = e.target.checked; try { localStorage.setItem("esen.speakSlow", slow ? "1" : "0"); } catch (err) { /* 略過 */ } });
    body.insertBefore(bar, body.firstChild);
  }

  const isSpeak = el => el && el.classList && (el.classList.contains("speak") || el.classList.contains("speak-sym") || el.classList.contains("speak-svg"));
  document.addEventListener("click", e => {
    const t = e.target.closest && e.target.closest(".speak, .speak-sym, .speak-svg");
    if (!t) return;
    e.preventDefault(); e.stopPropagation();
    if (t.classList.contains("speak-sym") && VOWEL_AUDIO[t.textContent]) playVowel(t.textContent, t); else say(textOf(t), t);
  }, true);
  document.addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === " ") && isSpeak(e.target)) {
      e.preventDefault();
      if (e.target.classList.contains("speak-sym") && VOWEL_AUDIO[e.target.textContent]) playVowel(e.target.textContent, e.target); else say(textOf(e.target), e.target);
    }
  });

  // 樣式放在這裡，共用的 theme.css 不用改
  const css = document.createElement("style");
  css.textContent = `
.speak, .speak-sym { cursor: pointer; border-bottom: 1.5px dotted var(--accent, #3b82f6); border-radius: 3px; }
.speak-sym { padding: 0 1px; }
.speak:hover, .speak:focus-visible, .speak-sym:hover, .speak-sym:focus-visible { background: color-mix(in srgb, var(--accent, #3b82f6) 14%, transparent); outline: none; }
.speak.speaking, .speak-sym.speaking { background: color-mix(in srgb, var(--accent, #3b82f6) 26%, transparent); }
svg text.speak-svg { cursor: pointer; text-decoration: underline dotted; }
.speak-bar { font-size: .92rem; margin: 0 0 12px; padding: 8px 12px; border-radius: 10px; background: color-mix(in srgb, var(--accent, #3b82f6) 10%, transparent); line-height: 1.8; }
.speak-bar label { display: inline-flex; align-items: center; gap: 6px; min-height: 32px; margin-left: 10px; cursor: pointer; white-space: nowrap; }
.speak-bar input { width: 20px; height: 20px; }
.speak-demo { border-bottom: 1.5px dotted var(--accent, #3b82f6); }`;
  document.head.appendChild(css);

  new MutationObserver(() => { if (!busy) requestAnimationFrame(scan); }).observe(document.body, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", scan);
  window.addEventListener("hashchange", () => { synth.cancel(); });
  scan();
})();
