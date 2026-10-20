/*
 * 模擬實驗共用的學習任務：「先預測 → 操作觀察 → 回答原因」。
 * 波動、歐姆定律等模擬器都用這一份，進度存在 localStorage（key 由各模擬器指定，並納入備份）。
 *
 * 用法：
 *   const panel = SimTasks.create({ tasks, key, getState });
 *   container.innerHTML = panel.html();   panel.mount(container);
 *   之後狀態有變時呼叫 panel.update()
 * 每個 task：{ id, title, predict:{q,options,answer}, observe, need(rows, state), needText, reason:{q,options,answer}, explain }
 */
(function () {
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function create(opts) {
    const { tasks, key, getState } = opts;
    let root = null;
    const load = () => { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { return {}; } };
    const store = p => { try { localStorage.setItem(key, JSON.stringify(p)); } catch (e) { /* 存不了不影響操作 */ } };

    function taskHtml(t, p) {
      const opt = (part, o) => o.options.map((s, k) => `<label class="task-opt"><input type="radio" name="${t.id}-${part}" value="${k}" ${p[part] === k ? "checked" : ""} ${p[part] != null ? "disabled" : ""}> ${s}</label>`).join("");
      const step = (n, label, on) => `<span class="task-step ${on ? "on" : ""}">${n}. ${label}</span>`;
      const done = p.reason != null;
      return `<div class="card task" data-task="${t.id}">
  <h3 style="margin-top:0">${t.title} ${done ? '<span class="tag ok">完成</span>' : ""}</h3>
  <div class="task-steps">${step(1, "先預測", true)}${step(2, "操作觀察", p.predict != null)}${step(3, "回答原因", p.observed)}</div>
  <div class="task-part"><b>① 先預測：</b>${t.predict.q}<div>${opt("predict", t.predict)}</div>
    ${p.predict == null ? `<button class="btn small" data-task-act="predict" data-task="${t.id}">送出預測</button>` : `<div class="small muted">你的預測已記錄。先不要看答案，動手做做看。</div>`}</div>
  <div class="task-part" ${p.predict == null ? "hidden" : ""}><b>② 操作觀察：</b>${t.observe}
    <div class="small" data-need="${t.id}"></div>
    ${!p.observed ? `<button class="btn small" data-task-act="observed" data-task="${t.id}" disabled>我觀察好了</button>` : '<div class="small muted">觀察完成。</div>'}</div>
  <div class="task-part" ${!p.observed ? "hidden" : ""}><b>③ 回答原因：</b>${t.reason.q}<div>${opt("reason", t.reason)}</div>
    <textarea data-task-note="${t.id}" placeholder="用自己的話寫下你觀察到什麼（可以不寫）" style="min-height:60px;font-family:inherit;font-size:15px" ${done ? "disabled" : ""}>${esc(p.note || "")}</textarea>
    ${!done ? `<button class="btn small" data-task-act="reason" data-task="${t.id}">送出答案</button>` : feedback(t, p)}</div>
</div>`;
    }
    function feedback(t, p) {
      const pOk = p.predict === t.predict.answer, rOk = p.reason === t.reason.answer;
      return `<div class="msg ${rOk ? "ok" : "bad"}">${rOk ? "✔ 原因答對了。" : "✘ 原因不太對，正確是：" + t.reason.options[t.reason.answer]}</div>
    <div class="box">${pOk ? "你一開始的預測是對的。" : `你一開始預測「${t.predict.options[p.predict]}」，實際是「${t.predict.options[t.predict.answer]}」—— 觀察結果和預測不同沒關係，這正是做實驗的意義。`}<br>${t.explain}</div>
    <button class="btn small ghost" data-task-act="redo" data-task="${t.id}">重做這個任務</button>`;
    }
    function html() { const prog = load(); return tasks.map(t => taskHtml(t, prog[t.id] || {})).join(""); }
    function update() {
      const st = getState();
      if (!root || !st) return;
      tasks.forEach(t => {
        const ok = t.need(st.rows, st);
        const n = root.querySelector(`[data-need="${t.id}"]`);
        if (n) n.innerHTML = (ok ? "✅ " : "⬜ ") + t.needText;
        const b = root.querySelector(`[data-task-act="observed"][data-task="${t.id}"]`);
        if (b) b.disabled = !ok;
      });
    }
    function rerender() { root.innerHTML = html(); update(); }
    function onClick(e) {
      const b = e.target.closest("[data-task-act]");
      if (!b) return;
      const t = tasks.find(x => x.id === b.dataset.task);
      const prog = load(); const p = prog[t.id] || {};
      const pick = part => { const r = root.querySelector(`input[name="${t.id}-${part}"]:checked`); return r ? +r.value : null; };
      const act = b.dataset.taskAct;
      if (act === "predict") { const v = pick("predict"); if (v == null) { alert("請先選一個預測。"); return; } p.predict = v; }
      if (act === "observed") p.observed = true;
      if (act === "reason") {
        const v = pick("reason"); if (v == null) { alert("請先選一個答案。"); return; }
        p.reason = v; p.note = (root.querySelector(`[data-task-note="${t.id}"]`) || {}).value || ""; p.date = new Date().toISOString();
      }
      if (act === "redo") { delete prog[t.id]; store(prog); rerender(); return; }
      prog[t.id] = p; store(prog); rerender();
    }
    function mount(el) { root = el; root.addEventListener("click", onClick); update(); }
    return { html, mount, update, progress: load };
  }

  window.SimTasks = { create, esc };
})();
