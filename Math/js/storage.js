/*
 * 本機儲存：所有學習紀錄與匯入的考古題都存在瀏覽器 localStorage。
 * 只存在這台電腦的這個瀏覽器，換電腦或清除瀏覽資料前請先「匯出備份」。
 */
(function () {
  const PREFIX = (window.SITE && window.SITE.storagePrefix) || "pc.";
  const APP = (window.SITE && window.SITE.backupApp) || "PhysChem_Learning";
  const KEYS = ["imported", "batches", "attempts", "wrong", "read", "qstats", "visits", "profile", "simWave", "simOhm", "simCircuit", "simLens"];

  function load(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      notify(key);
      return true;
    } catch (e) {
      alert("儲存失敗：瀏覽器空間可能已滿（題目中若有內嵌圖片會很占空間）。\n" + e.message);
      return false;
    }
  }

  // 紀錄有變動時通知雲端同步（cloud.js 會設定 Store.onChange；沒登入時什麼都不做）
  function notify(key) {
    try { if (window.Store && window.Store.onChange) window.Store.onChange(key); } catch (e) { /* 同步失敗不影響本機儲存 */ }
  }

  const Store = {
    PREFIX,
    SYNC_KEYS: KEYS,
    // ---- 題庫 ----
    imported() { return load("imported", []); },
    batches() { return load("batches", []); },

    addBatch(batch, questions) {
      const all = this.imported();
      const batches = this.batches();
      batches.push(batch);
      const ok = save("imported", all.concat(questions)) && save("batches", batches);
      return ok;
    },

    addQuestions(questions) {
      return save("imported", this.imported().concat(questions));
    },

    deleteBatch(batchId) {
      save("imported", this.imported().filter(q => q.batchId !== batchId));
      save("batches", this.batches().filter(b => b.id !== batchId));
    },

    deleteQuestion(qid) {
      save("imported", this.imported().filter(q => q.id !== qid));
    },

    allQuestions() {
      return window.BUILTIN_QUESTIONS.map(q => Object.assign({ source: "內建練習題" }, q))
        .concat(this.imported());
    },

    // ---- 測驗紀錄 ----
    attempts() { return load("attempts", []); },

    recordAttempt(attempt) {
      const list = this.attempts();
      list.push(attempt);
      save("attempts", list.slice(-300));

      const wrong = load("wrong", {});
      const stats = load("qstats", {});
      attempt.details.forEach(d => {
        const s = stats[d.qid] || { seen: 0, correct: 0 };
        s.seen++;
        if (d.correct) s.correct++;
        stats[d.qid] = s;

        if (!d.correct) {
          const w = wrong[d.qid] || { count: 0 };
          w.count++;
          w.last = attempt.date;
          w.lastGiven = d.given;
          w.streak = 0;
          wrong[d.qid] = w;
        } else if (wrong[d.qid]) {
          // 錯題連續答對 2 次就從錯題本移除
          wrong[d.qid].streak = (wrong[d.qid].streak || 0) + 1;
          if (wrong[d.qid].streak >= 2) delete wrong[d.qid];
        }
      });
      save("wrong", wrong);
      save("qstats", stats);
    },

    wrong() { return load("wrong", {}); },
    removeWrong(qid) { const w = this.wrong(); delete w[qid]; save("wrong", w); },
    qstats() { return load("qstats", {}); },

    // ---- 進行中的測驗（重新整理後可接續） ----
    // 只存題目 id，不存題目內容；接續時再從題庫找回來
    activeQuiz() { return load("activeQuiz", null); },
    saveActiveQuiz(state) { return save("activeQuiz", state); },
    clearActiveQuiz() { try { localStorage.removeItem(PREFIX + "activeQuiz"); } catch (e) { /* ignore */ } },
    lastResult() { return load("lastResult", null); },
    saveLastResult(r) { return save("lastResult", r); },

    // ---- 首頁偏好（年級、學期、目標）與閱讀進度 ----
    profile() { return load("profile", null); },
    saveProfile(p) { return save("profile", p); },
    visits() { return load("visits", {}); },
    markVisit(chapterId, sec) {
      const v = this.visits();
      v[chapterId] = { last: new Date().toISOString(), sec: sec || 0 };
      try { localStorage.setItem(PREFIX + "visits", JSON.stringify(v)); notify("visits"); } catch (e) { /* 閱讀進度存不了不影響使用 */ }
    },

    // ---- 課程閱讀 ----
    read() { return load("read", {}); },
    markRead(chapterId, done) {
      const r = this.read();
      if (done) r[chapterId] = new Date().toISOString(); else delete r[chapterId];
      save("read", r);
    },

    // ---- 備份 ----
    exportAll() {
      const data = { app: APP, version: 1, exportedAt: new Date().toISOString() };
      KEYS.forEach(k => { data[k] = load(k, null); });
      return data;
    },

    restoreAll(data) {
      if (!data || data.app !== APP) throw new Error("這不是本網站的備份檔");
      KEYS.forEach(k => {
        if (data[k] !== undefined && data[k] !== null) save(k, data[k]);
      });
    },

    resetProgress() {
      ["attempts", "wrong", "read", "qstats", "visits", "activeQuiz", "lastResult", "simWave", "simOhm", "simCircuit", "simLens"].forEach(k => { localStorage.removeItem(PREFIX + k); notify(k); });
    },

    // ---- 給雲端同步用：直接讀寫，不觸發 onChange ----
    raw(key) { return load(key, null); },
    rawSet(key, value) { try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch (e) { /* ignore */ } },
    rawRemove(key) { try { localStorage.removeItem(PREFIX + key); } catch (e) { /* ignore */ } },
    // 換人登入或登出時，清掉進行中的測驗與上一次成績（它們只存在這台電腦）
    clearSession() { ["activeQuiz", "lastResult"].forEach(k => this.rawRemove(k)); },
    hasProgress() {
      return ["attempts", "imported"].some(k => (load(k, []) || []).length) ||
        ["wrong", "qstats"].some(k => Object.keys(load(k, {}) || {}).length) || Object.keys(load("read", {}) || {}).length > 0;
    }
  };

  window.Store = Store;
})();
