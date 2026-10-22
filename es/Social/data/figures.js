/*
 * 國小社會課文圖解（SVG），五上、五下。地圖都是示意圖：臺灣輪廓用經緯度大略描點，不是精確比例。
 * curriculum.js 以 ${FIG.fig(FIG.xxx, "圖說")} 引用。課文圖會標出答案；q 開頭的是看圖題用的圖，圖上不寫答案。
 */
(function () {
  function fig(svg, caption) {
    return `<figure class="fig"><div class="fig-scroll">${svg}</div><div class="fig-hint">← 左右滑動看完整圖，或點圖放大 →</div>${caption ? `<figcaption>${caption}</figcaption>` : ""}</figure>`;
  }
  const r1 = n => Math.round(n * 10) / 10;
  const T = (x, y, s, cls, anchor) => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${anchor || "middle"}" class="${cls || "s-text"}">${s}</text>`;
  const L = (x1, y1, x2, y2, cls, extra) => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" class="${cls || "s-line"}" ${extra || ""}/>`;
  const R = (x, y, w, h, cls, rx) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" ${rx ? `rx="${rx}"` : ""} class="${cls}"/>`;
  const C = (x, y, r, cls) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" class="${cls}"/>`;
  const P = (d, cls) => `<path d="${d}" class="${cls}"/>`;
  const poly = (pts, cls) => `<polygon points="${pts.map(p => r1(p[0]) + "," + r1(p[1])).join(" ")}" class="${cls}"/>`;
  const mk = (id, cls) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" class="${cls}"/></marker>`;
  const defs = id => `<defs>${mk(id + "a", "s-accent-fill")}${mk(id + "r", "s-chem-fill")}${mk(id + "e", "s-earth-fill")}</defs>`;
  const A = (id, x1, y1, x2, y2, kind) => { const k = kind || "a"; const cls = { a: "s-arrow", r: "s-chem-arrow", e: "s-earth-arrow" }[k]; return `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" class="${cls}" marker-end="url(#${id}${k})"/>`; };

  // 臺灣本島輪廓（經度、緯度大略描點），map() 把經緯度換成畫面座標
  const TW = [[121.53, 25.3], [121.75, 25.15], [122.0, 25.0], [121.85, 24.6], [121.65, 24.1], [121.55, 23.6], [121.35, 23.1], [121.15, 22.75], [120.92, 22.35], [120.85, 21.9],
    [120.72, 21.95], [120.62, 22.35], [120.3, 22.6], [120.15, 23.0], [120.1, 23.45], [120.25, 23.85], [120.5, 24.35], [120.85, 24.8], [121.1, 25.05], [121.38, 25.2]];
  const mapper = (o) => p => [o.x + (p[0] - o.lon0) * o.k, o.y + (o.lat0 - p[1]) * o.k];
  const island = (m, cls) => poly(TW.map(m), cls || "s-earth-soft");

  // ---------- 五上 1-1 臺灣的位置 ----------
  const position = (q) => {
    const m = mapper({ x: 20, y: 10, lon0: 117.5, lat0: 27, k: 45 });
    const shape = (pts, cls) => poly(pts.map(m), cls);
    const cn = [[114, 28.5], [121.6, 28.5], [121.0, 27.6], [120.0, 26.6], [119.5, 25.6], [118.6, 24.6], [117.6, 23.7], [116.6, 23.0], [114, 22.4]];
    const ryukyu = [[123.0, 24.45], [123.4, 24.3], [124.2, 24.4], [124.3, 24.6], [123.6, 24.6]];
    const luzon = [[120.5, 18.6], [121.0, 18.3], [122.3, 18.5], [122.2, 17.0], [120.4, 17.0]];
    const lab = q ? ["甲", "乙", "丙", "丁"] : ["臺灣海峽", "太平洋", "巴士海峽", "東海"];
    const at = (lon, lat, t, cls) => { const p = m([lon, lat]); return T(p[0], p[1], t, cls); };
    const tropic = m([0, 23.44])[1];
    return `<svg viewBox="0 0 460 400" width="460" role="img" aria-label="${q ? "臺灣附近的海域，標有甲乙丙丁" : "臺灣附近的國家和海域"}">
  ${R(0, 0, 460, 400, "s-water")}${shape(cn, "s-sand")}${shape(ryukyu, "s-sand")}${shape(luzon, "s-sand")}${island(m)}
  ${at(118.3, 26.7, "中國大陸", "s-small")}${at(121.4, 19.1, "菲律賓（呂宋島）", "s-small")}${at(124.2, 24.0, q ? "" : "日本（琉球群島）", "s-tiny")}${at(120.95, 23.9, "臺灣", "s-small")}
  ${at(119.55, 24.2, lab[0], "s-accent-text")}${at(123.6, 22.6, lab[1], "s-accent-text")}${at(121.0, 20.7, lab[2], "s-accent-text")}${at(123.0, 26.6, lab[3], "s-accent-text")}
  ${q ? "" : L(20, tropic, 440, tropic, "s-warn-line") + T(440, tropic - 6, "北回歸線（北緯約 23.5 度）", "s-tiny", "end")}
  ${T(450, 392, "示意圖，非精確比例", "s-tiny", "end")}
</svg>`;
  };
  const positionFig = position(false);
  const qPosition = position(true);

  // ---------- 五上 2-1 板塊擠壓與山脈 ----------
  const plates = (() => {
    const m = mapper({ x: 120, y: 20, lon0: 119.7, lat0: 25.5, k: 70 });
    const id = "pl";
    let s = "";
    [[121.2, 24.6], [121.1, 23.9], [120.95, 23.45], [120.72, 23.4], [121.35, 23.2]].forEach(p => { const q = m(p); s += C(q[0], q[1], 4, "s-earth-fill"); });
    s += T(340, 40, "五大山脈：", "s-small", "start") + ["雪山山脈", "中央山脈", "玉山山脈", "阿里山山脈", "海岸山脈"].map((n, i) => T(340, 60 + i * 18, n, "s-tiny", "start")).join("");
    return `<svg viewBox="0 0 460 300" width="460" role="img" aria-label="臺灣位在歐亞板塊和菲律賓海板塊交界，被擠壓隆起">${defs(id)}
  ${island(m)}${s}
  ${A(id, 30, 150, 120, 150, "r")}${A(id, 440, 200, 320, 200, "r")}
  ${T(70, 130, "歐亞板塊", "s-chem-text")}${T(390, 185, "菲律賓海板塊", "s-chem-text")}
  ${T(230, 290, "兩個板塊互相擠壓，臺灣的地面被推擠隆起，形成高山（示意圖）", "s-tiny")}
</svg>`;
  })();

  // ---------- 五上 2-2 季風 ----------
  const monsoon = (q) => {
    const m = mapper({ x: 140, y: 30, lon0: 119.7, lat0: 25.5, k: 60 });
    const id = q ? "qm" : "mo";
    return `<svg viewBox="0 0 470 300" width="470" role="img" aria-label="${q ? "吹向臺灣的兩種風甲和乙" : "冬季東北季風和夏季西南季風"}">${defs(id)}
  ${island(m)}${A(id, 380, 20, 300, 80, "a")}${A(id, 340, 0, 270, 60, "a")}${A(id, 40, 280, 130, 220, "r")}${A(id, 20, 240, 110, 190, "r")}
  ${q ? `${T(370, 70, "甲", "s-accent-text")}${T(40, 230, "乙", "s-chem-text")}` : `${T(320, 120, "冬季：東北季風", "s-accent-text", "start")}${T(320, 138, "北部、東北部多雨", "s-tiny", "start")}${T(20, 180, "夏季：西南季風", "s-chem-text", "start")}${T(20, 198, "南部多雨", "s-tiny", "start")}`}
  ${T(260, 290, "示意圖", "s-tiny")}
</svg>`;
  };
  const monsoonFig = monsoon(false);
  const qMonsoon = monsoon(true);

  // ---------- 年代表（時間軸） ----------
  function timeline(items, o) {
    const x0 = 20, w = o.w - 40, n = items.length;
    let g = L(x0, 60, x0 + w, 60, "s-line");
    items.forEach((it, i) => {
      const x = x0 + w * (i + 0.5) / n;
      g += C(x, 60, 6, it.cls || "s-accent-fill") + T(x, 40, it.year, "s-small") + T(x, 86, it.name, "s-text") + (it.note || "").split("；").map((ln, k) => T(x, 106 + k * 16, ln, "s-tiny")).join("");
    });
    return `<svg viewBox="0 0 ${o.w} ${o.h || 120}" width="${o.w}" role="img" aria-label="${o.label}">${g}</svg>`;
  }
  const prehistory = timeline([
    { year: "約 3 萬年前起", name: "舊石器時代", note: "打製石器；狩獵、採集；長濱文化" },
    { year: "約 7000 年前起", name: "新石器時代", note: "磨製石器、陶器；農耕、定居；大坌坑、卑南文化" },
    { year: "約 2000 年前起", name: "金屬器時代", note: "會煉鐵；和外地交易；十三行文化", cls: "s-chem-fill" }
  ], { w: 600, h: 160, label: "臺灣史前時代的三個階段" });
  const rulers = timeline([
    { year: "1624／1626", name: "荷蘭、西班牙", note: "荷蘭在南；西班牙在北" },
    { year: "1662", name: "鄭氏政權", note: "鄭成功打敗荷蘭" },
    { year: "1683", name: "清帝國", note: "施琅攻臺；鄭氏投降" },
    { year: "1895", name: "日治時期", note: "馬關條約割讓臺灣" },
    { year: "1945", name: "中華民國", note: "二次大戰結束", cls: "s-chem-fill" }
  ], { w: 700, h: 150, label: "臺灣歷史上不同時期的統治者" });

  // ---------- 五上 4-2 荷蘭、西班牙在臺灣 ----------
  const dutchSpain = (() => {
    const m = mapper({ x: 200, y: 30, lon0: 119.7, lat0: 25.5, k: 70 });
    const pin = (lon, lat, name, cls, anchor, dx, dy) => { const p = m([lon, lat]); return C(p[0], p[1], 5, cls) + T(p[0] + (dx || 0), p[1] + 5 + (dy || 0), name, "s-small", anchor); };
    return `<svg viewBox="0 0 600 310" width="600" role="img" aria-label="荷蘭人在南部大員、西班牙人在北部雞籠和淡水">
  ${island(m)}
  ${pin(121.74, 25.14, "雞籠：聖薩爾瓦多城（西班牙，1626）", "s-chem-fill", "start", 10, 14)}${pin(121.44, 25.17, "淡水：聖多明哥城（西班牙）", "s-chem-fill", "end", -10, -8)}
  ${pin(120.16, 23.0, "大員：熱蘭遮城（荷蘭，1624）", "s-accent-fill", "end", -10)}
  ${T(300, 300, "1642 年荷蘭把西班牙人趕出臺灣北部（示意圖）", "s-tiny")}
</svg>`;
  })();

  // ---------- 五下 1-1 生產活動 ----------
  const production = (() => {
    const id = "pd";
    const box = (x, title, ex, cls) => R(x, 40, 130, 90, cls, 10) + T(x + 65, 70, title, "s-text") + T(x + 65, 96, ex[0], "s-small") + T(x + 65, 116, ex[1], "s-small");
    return `<svg viewBox="0 0 470 170" width="470" role="img" aria-label="從甘蔗到一包糖：農業、工業、服務業">${defs(id)}
  ${box(10, "種甘蔗", ["農業（取得原料）", "農、林、漁、牧"], "s-node")}${A(id, 142, 85, 166, 85)}
  ${box(170, "製成糖", ["工業（加工製造）", "工廠"], "s-node-chem")}${A(id, 302, 85, 326, 85)}
  ${box(330, "運送、販賣", ["服務業", "運輸、商店"], "s-earth-soft")}
  ${T(235, 160, "一包糖要經過好幾種生產活動，才到我們手上", "s-tiny")}
</svg>`;
  })();

  // ---------- 五下 2-2 一府二鹿三艋舺、開港通商 ----------
  const ports = (q) => {
    const m = mapper({ x: 160, y: 30, lon0: 119.7, lat0: 25.5, k: 70 });
    const pin = (lon, lat, name, cls, anchor, dx, dy) => { const p = m([lon, lat]); return C(p[0], p[1], 5, cls) + T(p[0] + (dx || 0), p[1] + 5 + (dy || 0), name, "s-small", anchor); };
    if (q) return `<svg viewBox="0 0 560 310" width="560" role="img" aria-label="臺灣西部三個港口城鎮甲乙丙">${island(m)}
  ${pin(120.2, 23.0, "甲", "s-accent-fill", "end", -10)}${pin(120.43, 24.06, "乙", "s-accent-fill", "end", -10)}${pin(121.5, 25.04, "丙", "s-accent-fill", "start", 10)}
  ${T(280, 302, "示意圖", "s-tiny")}</svg>`;
    return `<svg viewBox="0 0 560 310" width="560" role="img" aria-label="一府二鹿三艋舺和開港通商的港口">${island(m)}
  ${pin(120.2, 23.0, "一府：府城（臺南）", "s-accent-fill", "end", -10)}${pin(120.43, 24.06, "二鹿：鹿港", "s-accent-fill", "end", -10)}${pin(121.5, 25.04, "三艋舺：萬華", "s-accent-fill", "start", 12, 16)}
  ${pin(121.44, 25.17, "淡水", "s-chem-fill", "end", -10, -8)}${pin(121.74, 25.14, "雞籠", "s-chem-fill", "start", 10, -8)}${pin(120.28, 22.62, "打狗（高雄）", "s-chem-fill", "end", -10)}
  ${T(390, 230, "藍點：清代前期三大城鎮", "s-accent-text", "start")}${T(390, 250, "紅點：開港通商的港口", "s-chem-text", "start")}${T(390, 268, "安平港在府城旁邊", "s-tiny", "start")}
</svg>`;
  };
  const portsFig = ports(false);
  const qPorts = ports(true);

  // ---------- 五下 4-1 日治時期的建設 ----------
  const japanBuild = (() => {
    const m = mapper({ x: 120, y: 20, lon0: 119.7, lat0: 25.5, k: 70 });
    const rail = [[121.74, 25.13], [121.5, 25.05], [121.2, 24.95], [120.97, 24.8], [120.68, 24.14], [120.45, 23.48], [120.21, 22.99], [120.3, 22.63]].map(m);
    const pin = (lon, lat, name, cls, anchor, dx) => { const p = m([lon, lat]); return C(p[0], p[1], 5, cls) + T(p[0] + (dx || 0), p[1] + 5, name, "s-small", anchor); };
    return `<svg viewBox="0 0 470 300" width="470" role="img" aria-label="日治時期的縱貫鐵路、嘉南大圳、阿里山林場和日月潭發電">
  ${island(m)}<polyline points="${rail.map(p => p.join(",")).join(" ")}" class="s-chem-line"/>
  ${pin(120.4, 23.2, "嘉南大圳（烏山頭水庫）", "s-accent-fill", "end", -10)}${pin(120.8, 23.5, "阿里山林場", "s-bio-fill", "start", 10)}${pin(120.92, 23.86, "日月潭發電", "s-accent-fill", "start", 10)}
  ${T(330, 40, "紅線：縱貫鐵路", "s-chem-text", "start")}${T(330, 58, "基隆到高雄，1908 年通車", "s-tiny", "start")}
  ${T(235, 292, "示意圖，位置大約", "s-tiny")}
</svg>`;
  })();

  window.FIG = { fig, positionFig, qPosition, plates, monsoonFig, qMonsoon, prehistory, rulers, dutchSpain, production, portsFig, qPorts, japanBuild,
    _: { timeline, r1, T, L, R, C, P, poly, defs, A, mapper, island } };
})();
