/*
 * 國小英語課文圖解（SVG）。課文圖會標出答案；q 開頭的是看圖題用的圖，圖上不寫答案。
 */
(function () {
  function fig(svg, caption) {
    return `<figure class="fig"><div class="fig-scroll">${svg}</div><div class="fig-hint">← 左右滑動看完整圖，或點圖放大 →</div>${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
  }
  const r1 = n => Math.round(n * 10) / 10;
  const T = (x, y, s, cls, anchor) => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${anchor || "middle"}" class="${cls || "s-text"}">${s}</text>`;
  const R = (x, y, w, h, cls, rx) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" ${rx ? `rx="${rx}"` : ""} class="${cls}"/>`;
  const L = (x1, y1, x2, y2, cls) => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" class="${cls || "s-line"}"/>`;

  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const DAYS_ZH = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

  // ---------- 星期（課文：英文＋中文） ----------
  const week = `<svg viewBox="0 0 560 120" width="560" role="img" aria-label="一週七天的英文">
  ${DAYS.map((d, i) => R(10 + i * 78, 20, 72, 80, i === 0 || i === 6 ? "s-node-chem" : "s-node", 8) + T(46 + i * 78, 54, d.slice(0, 3), "s-text") + T(46 + i * 78, 76, DAYS_ZH[i], "s-small")).join("")}
  ${T(280, 116, "Sun. Mon. Tue. Wed. Thu. Fri. Sat. 是縮寫；星期的第一個字母一定大寫", "s-tiny")}
</svg>`;

  // ---------- 看圖題：月曆上圈出今天 ----------
  const qCalendar = (() => {
    let g = "";
    DAYS.forEach((d, i) => { g += R(10 + i * 62, 10, 58, 28, "s-node", 4) + T(39 + i * 62, 29, d.slice(0, 3), "s-small"); });
    for (let n = 1; n <= 14; n++) { const i = (n - 1) % 7, r = Math.floor((n - 1) / 7); g += R(10 + i * 62, 42 + r * 40, 58, 36, "s-node-main", 4) + T(39 + i * 62, 66 + r * 40, n, "s-text"); }
    g += `<circle cx="${39 + 3 * 62}" cy="${60 + 40}" r="18" class="s-warn-line"/>`;   // 11 號（第二排星期三）
    return `<svg viewBox="0 0 450 130" width="450" role="img" aria-label="月曆，今天被圈起來">${g}</svg>`;
  })();

  // ---------- 看圖題：課表 ----------
  const qTimetable = (() => {
    const rows = [["", "Mon.", "Tue.", "Wed.", "Thu.", "Fri."], ["1", "Chinese", "math", "English", "Chinese", "science"], ["2", "math", "PE", "art", "music", "math"], ["3", "social studies", "English", "math", "PE", "Chinese"]];
    let g = "";
    rows.forEach((r, i) => r.forEach((c, j) => { const w = j === 0 ? 34 : 92, x = j === 0 ? 6 : 40 + (j - 1) * 92; g += R(x, 6 + i * 34, w, 32, i === 0 || j === 0 ? "s-node" : "s-node-main", 3) + T(x + w / 2, 27 + i * 34, c, c.length > 10 ? "s-tiny" : "s-small"); }));
    return `<svg viewBox="0 0 512 164" width="512" role="img" aria-label="Amy 的課表：星期一到星期五，每天三節課">${g}${T(256, 158, "Amy's class schedule", "s-tiny")}</svg>`;
  })();

  // ---------- 社區場所地圖 ----------
  const town = (q) => {
    const P = [["bakery", "麵包店", 20, 20], ["bank", "銀行", 150, 20], ["bookstore", "書店", 280, 20], ["hospital", "醫院", 20, 150], ["park", "公園", 150, 150], ["post office", "郵局", 280, 150], ["restaurant", "餐廳", 410, 20], ["supermarket", "超級市場", 410, 150]];
    let g = R(0, 108, 540, 34, "s-guide") + T(270, 130, q ? "Main Street" : "Main Street（大街）", "s-small");
    P.forEach(([en, zh, x, y], i) => { g += R(x, y, 110, 80, i === 4 ? "s-node" : "s-node-main", 8) + (q ? T(x + 55, y + 46, "甲乙丙丁戊己庚辛"[i], "s-accent-text") : T(x + 55, y + 38, en, "s-text") + T(x + 55, y + 60, zh, "s-small")); });
    return `<svg viewBox="0 0 540 240" width="540" role="img" aria-label="${q ? "大街兩旁的八個地方，標有甲到辛" : "大街兩旁的社區場所"}">${g}</svg>`;
  };
  const townFig = town(false);

  // ---------- 衣物和價錢 ----------
  const shop = (q) => {
    const items = [["a dress", "$900"], ["a skirt", "$450"], ["a sweater", "$680"], ["a T-shirt", "$250"], ["pants", "$520"], ["shorts", "$300"], ["sneakers", "$1200"], ["socks", "$99"]];
    let g = "";
    items.forEach(([n, p], i) => { const x = 10 + (i % 4) * 128, y = 10 + Math.floor(i / 4) * 92; g += R(x, y, 120, 84, "s-node-main", 8) + T(x + 60, y + 34, n, "s-text") + R(x + 30, y + 46, 60, 26, "s-node-chem", 6) + T(x + 60, y + 64, p, "s-small"); });
    return `<svg viewBox="0 0 524 200" width="524" role="img" aria-label="服飾店裡八種衣物和價錢">${g}${q ? "" : ""}</svg>`;
  };
  const shopFig = shop(false);
  const qShop = shop(true);

  // ---------- 字母拼讀：一個聲音、好幾種拼法 ----------
  const phonics = `<svg viewBox="0 0 560 210" width="560" role="img" aria-label="長母音的不同拼法">
  ${[["長 a", "a_e  cake", "ai  rain", "ay  day"], ["長 e", "e_e  these", "ee  tree", "ea  tea"], ["長 i", "i_e  kite", "ie  pie", "igh  night"], ["長 o", "o_e  home", "oa  boat", "ow  snow"], ["長 u", "u_e  cute / June", "ue  blue", "ui  juice"]].map((r, i) =>
    R(10, 10 + i * 40, 70, 34, "s-node", 6) + T(45, 33 + i * 40, r[0], "s-text") + r.slice(1).map((c, j) => R(90 + j * 156, 10 + i * 40, 150, 34, "s-node-main", 6) + T(165 + j * 156, 33 + i * 40, c, "s-small")).join("")).join("")}
</svg>`;

  window.FIG = { fig, week, qCalendar, qTimetable, townFig, shopFig, qShop, phonics };
})();
