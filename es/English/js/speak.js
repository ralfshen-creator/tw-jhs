/*
 * 英語站專用：點英文就念出來（瀏覽器內建的英語語音，Web Speech API），不需要錄音檔。
 * 只有英語站載入這個檔案，共用引擎 app.js 不用改。
 *   - 課文、句型卡、題目題幹、解析、圖裡的英文字詞，自動加上可以點的念音標記
 *   - 測驗的選項不加（點選項是作答，避免誤觸）
 *   - 緊接在「不是」後面的英文是錯誤示範，不念
 *   - 太短的拼字片段（ai、er、kn 這類拼讀組合、單一字母）不念，避免念成奇怪的聲音
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

  // 一段英文：英文字（含撇號）可以用空白、逗號、連字號接起來，結尾可以有標點
  const RE = /[A-Za-z][A-Za-z'’]*(?:[,.?!;:]*[ \-]+[A-Za-z][A-Za-z'’]*)*[.?!]?/g;
  const worth = s => s.replace(/[^A-Za-z]/g, "").length >= 3;

  const TARGETS = ".lesson-body section, .formula-item, .q-text, .explain, .lb-inner";
  const SKIP = "h3, button, .btn, .options, input, textarea, select, script, style, .speak, .no-speak";

  function wrapTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: n => (!/[A-Za-z]{2}/.test(n.nodeValue) || (n.parentElement && n.parentElement.closest(SKIP)) || (n.parentElement && n.parentElement.closest("svg")))
        ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
    });
    const nodes = []; let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(node => {
      const s = node.nodeValue; let last = 0, m, frag = null;
      RE.lastIndex = 0;
      while ((m = RE.exec(s))) {
        if (!worth(m[0])) continue;
        if (/不是\s*$|錯誤寫法[：:]?\s*$/.test(s.slice(Math.max(0, m.index - 6), m.index))) continue;   // 「不是 fourty」這類錯誤示範不念
        frag = frag || document.createDocumentFragment();
        if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
        const sp = document.createElement("span");
        sp.className = "speak"; sp.textContent = m[0]; sp.title = "點一下念出來"; sp.setAttribute("role", "button"); sp.tabIndex = 0;
        frag.appendChild(sp);
        last = m.index + m[0].length;
      }
      if (!frag) return;
      if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
    // 圖（SVG）裡的英文字：整個 text 元素可以點
    root.querySelectorAll("svg text").forEach(t => {
      if (t.classList.contains("speak-svg")) return;
      const m = (t.textContent || "").match(RE);
      if (m && worth(m.join(" ")) && /^[\sA-Za-z'’,.?!:;\-]+$/.test(t.textContent.replace(/\d+[:.]?\d*/g, ""))) {
        t.classList.add("speak-svg"); t.setAttribute("role", "button"); t.setAttribute("tabindex", "0");
      }
    });
  }

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
    bar.innerHTML = `<span>🔊 點有<span class="speak-demo">虛線</span>的英文，就會念出來</span> <label><input type="checkbox"${slow ? " checked" : ""}> 慢速</label>`;
    bar.querySelector("input").addEventListener("change", e => { slow = e.target.checked; try { localStorage.setItem("esen.speakSlow", slow ? "1" : "0"); } catch (err) { /* 略過 */ } });
    body.insertBefore(bar, body.firstChild);
  }

  document.addEventListener("click", e => {
    const t = e.target.closest && e.target.closest(".speak, .speak-svg");
    if (!t) return;
    e.preventDefault(); e.stopPropagation();
    say(t.textContent, t);
  }, true);
  document.addEventListener("keydown", e => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList && (e.target.classList.contains("speak") || e.target.classList.contains("speak-svg"))) { e.preventDefault(); say(e.target.textContent, e.target); }
  });

  // 樣式放在這裡，共用的 theme.css 不用改
  const css = document.createElement("style");
  css.textContent = `
.speak { cursor: pointer; border-bottom: 1.5px dotted var(--accent, #3b82f6); border-radius: 3px; }
.speak:hover, .speak:focus-visible { background: color-mix(in srgb, var(--accent, #3b82f6) 14%, transparent); outline: none; }
.speak.speaking { background: color-mix(in srgb, var(--accent, #3b82f6) 26%, transparent); }
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
