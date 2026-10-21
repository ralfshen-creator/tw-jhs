/*
 * 考古題匯入：支援 CSV（Excel 另存）、從 Excel 直接複製貼上（Tab 分隔）、JSON。
 * 欄位名稱可用中文或英文，見 HEADER_ALIASES。
 */
(function () {
  const LETTERS = ["A", "B", "C", "D", "E", "F"];

  const HEADER_ALIASES = {
    chapter: ["章節", "章節代碼", "chapter", "單元"],
    type: ["題型", "type", "類型"],
    q: ["題目", "題幹", "question", "q"],
    A: ["選項a", "a", "optiona", "(a)"],
    B: ["選項b", "b", "optionb", "(b)"],
    C: ["選項c", "c", "optionc", "(c)"],
    D: ["選項d", "d", "optiond", "(d)"],
    E: ["選項e", "e", "optione", "(e)"],
    answer: ["答案", "answer", "ans", "正解"],
    explain: ["解析", "詳解", "explain", "explanation", "說明"],
    source: ["來源", "出處", "source", "考試"],
    year: ["年份", "年度", "學年度", "year"],
    difficulty: ["難度", "difficulty"],
    image: ["圖片", "圖", "image", "img"]
  };

  // ---------- 檔案讀取（自動判斷 UTF-8 / Big5） ----------
  function readFileText(file) {
    return file.arrayBuffer().then(buf => {
      try {
        return new TextDecoder("utf-8", { fatal: true }).decode(buf).replace(/^﻿/, "");
      } catch (e) {
        // Excel 在繁中 Windows 預設把 CSV 存成 Big5
        return new TextDecoder("big5").decode(buf);
      }
    });
  }

  // ---------- CSV / TSV 解析（支援引號、欄位內換行） ----------
  function parseDelimited(text) {
    const firstLine = text.split(/\r?\n/, 1)[0] || "";
    const delim = (firstLine.match(/\t/g) || []).length > (firstLine.match(/,/g) || []).length ? "\t" : ",";
    const rows = [];
    let row = [], field = "", inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
        } else field += c;
      } else if (c === '"' && field === "") {
        inQuotes = true;
      } else if (c === delim) {
        row.push(field); field = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field); field = "";
        rows.push(row); row = [];
      } else field += c;
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    return rows.filter(r => r.some(v => v.trim() !== ""));
  }

  function mapHeaders(headerRow) {
    const map = {};
    headerRow.forEach((h, idx) => {
      const key = h.trim().toLowerCase().replace(/\s+/g, "");
      for (const field in HEADER_ALIASES) {
        if (HEADER_ALIASES[field].includes(key) && map[field] === undefined) map[field] = idx;
      }
    });
    return map;
  }

  function rowsToObjects(rows) {
    if (rows.length < 2) throw new Error("至少需要標題列 + 一列題目");
    const map = mapHeaders(rows[0]);
    if (map.q === undefined) throw new Error("找不到「題目」欄。第一列必須是標題列，例如：章節,題型,題目,選項A,選項B,選項C,選項D,答案,解析,來源");
    return rows.slice(1).map((r, i) => {
      const o = { _line: i + 2 };
      for (const f in map) o[f] = (r[map[f]] || "").trim();
      o.options = LETTERS.slice(0, 5).map(L => o[L]).filter(v => v);
      return o;
    });
  }

  function jsonToObjects(text) {
    let data = JSON.parse(text);
    if (!Array.isArray(data)) data = data.questions;
    if (!Array.isArray(data)) throw new Error("JSON 必須是題目陣列，或 { \"questions\": [...] }");
    return data.map((o, i) => {
      const r = Object.assign({ _line: i + 1 }, o);
      if (r.question && !r.q) r.q = r.question;
      if (!Array.isArray(r.options)) r.options = LETTERS.slice(0, 5).map(L => r[L]).filter(v => v);
      return r;
    });
  }

  // ---------- 正規化 ----------
  function normType(t, o) {
    const s = String(t || "").trim().toLowerCase();
    if (/^(單選|single|選擇|單選題)$/.test(s)) return "single";
    if (/^(多選|複選|multi|multiple|多選題)$/.test(s)) return "multi";
    if (/^(是非|是非題|tf|判斷|true\/false)$/.test(s)) return "tf";
    if (/^(填充|填充題|fill|簡答|問答)$/.test(s)) return "fill";
    if (s) return null;
    // 沒填題型就猜
    const a = String(o.answer || "").trim();
    if (o.options.length) return normChoice(a).length > 1 ? "multi" : "single";
    if (normTF(a)) return "tf";
    return "fill";
  }

  function normChoice(a) {
    const s = String(a || "").toUpperCase()
      .replace(/[（）()\s,，、;；]/g, "")
      .replace(/[1-6]/g, d => LETTERS[+d - 1])
      .replace(/[Ａ-Ｆ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
    if (!/^[A-F]+$/.test(s)) return "";
    return Array.from(new Set(s.split(""))).sort().join("");
  }

  function normTF(a) {
    const s = String(a || "").trim().toLowerCase();
    if (["o", "○", "〇", "對", "是", "t", "true", "v", "✓", "y"].includes(s)) return "O";
    if (["x", "×", "錯", "否", "f", "false", "n", "✗"].includes(s)) return "X";
    return "";
  }

  function resolveChapter(val, fallback, chapters) {
    const s = String(val || "").trim();
    if (!s) return fallback;
    const byId = chapters.find(c => c.id.toLowerCase() === s.toLowerCase());
    if (byId) return byId.id;
    const byTitle = chapters.find(c => s.includes(c.title) || c.title.includes(s));
    if (byTitle) return byTitle.id;
    return null;
  }

  function normImage(v) {
    const s = String(v || "").trim();
    if (!s) return "";
    if (/^(https?:|data:|images\/|\.\/|\/)/i.test(s)) return s;
    return "images/" + s;
  }

  function fingerprint(q) {
    return (q.q + "|" + q.answer).replace(/\s+/g, "");
  }

  /*
   * 回傳 { questions, errors, skipped }
   * opts: { defaultChapter, source, year, batchId }
   */
  function build(rawText, isJson, opts) {
    const chapters = window.App.allChapters();
    const objs = isJson ? jsonToObjects(rawText) : rowsToObjects(parseDelimited(rawText));
    const existing = new Set(Store.allQuestions().map(fingerprint));
    const questions = [], errors = [];
    let skipped = 0;

    objs.forEach((o, idx) => {
      const line = "第 " + o._line + " 列";
      const type = normType(o.type, o);
      if (!o.q) { errors.push(line + "：題目是空的"); return; }
      if (!type) { errors.push(line + "：看不懂題型「" + o.type + "」（請用 單選／多選／是非／填充）"); return; }

      let answer = "";
      if (!String(o.answer || "").trim()) { errors.push(line + "：沒有填答案"); return; }
      if (type === "single" || type === "multi") {
        if (o.options.length < 2) { errors.push(line + "：選擇題至少要兩個選項"); return; }
        answer = normChoice(o.answer);
        if (!answer) { errors.push(line + "：答案「" + o.answer + "」不是 A～E"); return; }
        if (type === "single" && answer.length !== 1) { errors.push(line + "：單選題只能有一個答案（若是多選請把題型改成多選）"); return; }
        const maxLetter = LETTERS[o.options.length - 1];
        if (answer.split("").some(L => L > maxLetter)) { errors.push(line + "：答案 " + answer + " 超出選項範圍（只有 " + o.options.length + " 個選項）"); return; }
      } else if (type === "tf") {
        answer = normTF(o.answer);
        if (!answer) { errors.push(line + "：是非題答案請填 O 或 X"); return; }
      } else {
        answer = String(o.answer || "").trim();
        if (!answer) { errors.push(line + "：填充題沒有答案"); return; }
      }

      const chapter = resolveChapter(o.chapter, opts.defaultChapter, chapters);
      if (!chapter) { errors.push(line + "：找不到章節「" + o.chapter + "」（可填章節代碼如 8A-1，或章節名稱如 基本測量）"); return; }

      const q = {
        id: opts.batchId + "-" + idx,
        batchId: opts.batchId,
        chapter, type,
        q: String(o.q),
        options: (type === "single" || type === "multi") ? o.options.map(String) : undefined,
        answer,
        explain: String(o.explain || ""),
        source: String(o.source || opts.source || "匯入題目"),
        year: String(o.year || opts.year || ""),
        difficulty: Math.min(3, Math.max(1, parseInt(o.difficulty, 10) || 2)),
        image: normImage(o.image)
      };
      const fp = fingerprint(q);
      if (existing.has(fp)) { skipped++; return; }
      existing.add(fp);
      questions.push(q);
    });

    return { questions, errors, skipped };
  }

  window.Importer = { readFileText, build, parseDelimited };
})();
