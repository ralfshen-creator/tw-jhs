/*
 * 國小英語課文圖解（SVG），六上、六下。課文圖會標出答案；q 開頭的是看圖題用的圖，圖上不寫答案。
 */
(function () {
  const r1 = n => Math.round(n * 10) / 10;
  const T = (x, y, s, cls, anchor) => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${anchor || "middle"}" class="${cls || "s-text"}">${s}</text>`;
  const R = (x, y, w, h, cls, rx) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" ${rx ? `rx="${rx}"` : ""} class="${cls}"/>`;

  // 拼讀表：每列 [標題, 例字...]
  const table = (rows, label) => `<svg viewBox="0 0 560 ${rows.length * 40 + 20}" width="560" role="img" aria-label="${label}">
  ${rows.map((r, i) => R(10, 10 + i * 40, 90, 34, "s-node", 6) + T(55, 33 + i * 40, r[0], "s-text") + r.slice(1).map((c, j) => R(110 + j * 112, 10 + i * 40, 106, 34, "s-node-main", 6) + T(163 + j * 112, 33 + i * 40, c, "s-small")).join("")).join("")}
</svg>`;

  const phonics6A = table([["er / ir / ur", "teacher", "bird", "girl", "nurse"], ["ar", "car", "farm", "star", "park"], ["or", "fork", "corn", "horse", "short"], ["oi / oy", "coin", "oil", "boy", "toy"], ["ou / ow", "house", "mouth", "cow", "brown"]], "六上的字母拼讀");
  const phonics6B = table([["kn / wr / mb", "knee", "write", "lamb", "climb"], ["f / ph / gh", "fish", "phone", "photo", "laugh"], ["hard c [k]", "cat", "cup", "cake", "corn"], ["soft c [s]", "city", "face", "rice", "pencil"], ["hard g [g]", "go", "girl", "game", "bag"], ["soft g [dʒ]", "giant", "page", "orange", "giraffe"]], "六下的字母拼讀");

  // ---------- 看圖題：Amy 的一天 ----------
  const qDay = (() => {
    const items = [["6:30", "get up"], ["7:00", "have breakfast"], ["7:30", "go to school"], ["12:15", "have lunch"], ["4:00", "go home"], ["6:30", "have dinner"], ["7:30", "do homework"], ["9:30", "go to bed"]];
    return `<svg viewBox="0 0 560 210" width="560" role="img" aria-label="Amy 一天的作息時間表">
  ${T(280, 22, "Amy's Day", "s-text")}
  ${items.map(([t, a], i) => { const x = 10 + (i % 4) * 136, y = 36 + Math.floor(i / 4) * 84; return R(x, y, 128, 74, "s-node-main", 8) + T(x + 64, y + 30, t, "s-text") + T(x + 64, y + 56, a, "s-small"); }).join("")}
</svg>`;
  })();

  // ---------- 看圖題：大家昨天在哪裡 ----------
  const qWhere = (() => {
    const p = [["Ben", "the library"], ["Lily", "the museum"], ["Max", "the night market"], ["Nina", "the sports center"]];
    return `<svg viewBox="0 0 560 120" width="560" role="img" aria-label="Ben、Lily、Max、Nina 昨天下午各在哪裡">
  ${T(280, 20, "Yesterday afternoon", "s-small")}
  ${p.map(([n, w], i) => R(10 + i * 136, 32, 128, 76, "s-node-main", 8) + T(74 + i * 136, 62, n, "s-text") + T(74 + i * 136, 90, w, "s-small")).join("")}
</svg>`;
  })();

  Object.assign(window.FIG, { phonics6A, phonics6B, qDay, qWhere });
})();
