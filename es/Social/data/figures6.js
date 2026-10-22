/*
 * 國小社會課文圖解（SVG），六上、六下。沿用 figures.js 的小工具（FIG._），畫好的圖加進 window.FIG。
 * 地圖是示意圖，不是精確比例。課文圖會標出答案；q 開頭的是看圖題用的圖，圖上不寫答案。
 */
(function () {
  const { timeline, T, L, R, C, P, defs, A, mapper, island } = FIG._;

  // ---------- 六上 1-1 民主發展年代表 ----------
  const democracy = timeline([
    { year: "1921", name: "議會請願", note: "臺灣議會設置；請願運動開始" },
    { year: "1947", name: "二二八事件", note: "官民衝突；許多人受害" },
    { year: "1949", name: "實施戒嚴", note: "限制集會、結社；出版、言論" },
    { year: "1979", name: "美麗島事件", note: "要求民主改革；的群眾活動" },
    { year: "1987", name: "解除戒嚴", note: "開放組黨；和新報紙" },
    { year: "1996", name: "總統直選", note: "人民直接選出；總統、副總統", cls: "s-chem-fill" }
  ], { w: 760, h: 160, label: "臺灣民主發展的重要年代" });

  // 年代表以外的課文圖用小方塊排版
  const boxes = (items, o) => {
    const n = items.length, bw = o.bw || 120, gap = 10, w = n * bw + (n + 1) * gap;
    return `<svg viewBox="0 0 ${w} ${o.h || 130}" width="${w}" role="img" aria-label="${o.label}">
  ${items.map((it, i) => R(gap + i * (bw + gap), 20, bw, (o.h || 130) - 40, it.cls || "s-node", 8) + T(gap + i * (bw + gap) + bw / 2, 50, it.name, "s-text") +
    (it.note || "").split("；").map((ln, k) => T(gap + i * (bw + gap) + bw / 2, 74 + k * 18, ln, "s-tiny")).join("")).join("")}
</svg>`;
  };

  // ---------- 六上 1-2 人民的權利和義務 ----------
  const rights = boxes([
    { name: "平等權", note: "不分性別、宗教；種族、階級、黨派；法律上一律平等" },
    { name: "自由權", note: "人身、居住遷徙；言論、宗教；集會結社等自由" },
    { name: "受益權", note: "受國民教育；請願、訴願；訴訟" },
    { name: "參政權", note: "選舉、罷免；創制、複決" },
    { name: "義務", note: "納稅；服兵役；受國民教育", cls: "s-node-chem" }
  ], { bw: 130, h: 150, label: "憲法保障人民的權利，也規定人民的義務" });

  // ---------- 六上 1-3 中央政府的組織 ----------
  const gov = (() => {
    const yuan = [["行政院", "執行政策"], ["立法院", "制定法律；審查預算"], ["司法院", "審判"], ["考試院", "考選公務員"], ["監察院", "糾正、彈劾；審計"]];
    let g = R(260, 10, 140, 44, "s-node-chem", 8) + T(330, 38, "總統", "s-text");
    yuan.forEach(([n, d], i) => {
      const x = 10 + i * 130;
      g += L(330, 54, x + 60, 80, "s-guide") + R(x, 80, 120, 74, "s-node", 8) + T(x + 60, 106, n, "s-text") + d.split("；").map((ln, k) => T(x + 60, 128 + k * 16, ln, "s-tiny")).join("");
    });
    return `<svg viewBox="0 0 660 170" width="660" role="img" aria-label="中央政府：總統和五院">${g}</svg>`;
  })();

  // ---------- 六上 2-1 國民教育的延長 ----------
  const education = timeline([
    { year: "1968", name: "九年國民教育", note: "國小 6 年；＋國中 3 年" },
    { year: "2014", name: "十二年國教", note: "再加上；高中職 3 年", cls: "s-chem-fill" }
  ], { w: 460, h: 150, label: "國民教育從六年延長到九年、十二年" });

  // ---------- 六上 3 戰後經濟發展 ----------
  const economy = timeline([
    { year: "1950 年代", name: "土地改革", note: "三七五減租；耕者有其田" },
    { year: "1966", name: "加工出口區", note: "高雄設立；發展出口工業" },
    { year: "1970 年代", name: "十大建設", note: "高速公路、港口；鋼鐵、造船等" },
    { year: "1980", name: "科學園區", note: "新竹科學園區；發展高科技產業", cls: "s-chem-fill" }
  ], { w: 680, h: 150, label: "戰後臺灣經濟發展的重要建設" });

  // ---------- 六上 3-2 微笑曲線 ----------
  const smile = `<svg viewBox="0 0 520 210" width="520" role="img" aria-label="微笑曲線：研發和品牌、行銷的附加價值較高，製造較低">${defs("sm")}
  ${A("sm", 40, 180, 40, 14, "a")}${A("sm", 40, 180, 500, 180, "a")}${T(50, 14, "附加價值", "s-tiny", "start")}${T(490, 200, "產品的流程", "s-tiny", "end")}
  ${P("M80,50 Q270,250 460,50", "s-chem-line")}
  ${T(110, 50, "研發、設計", "s-small", "start")}${T(270, 168, "製造、組裝（代工）", "s-small")}${T(450, 40, "品牌、行銷", "s-small")}
</svg>`;

  // ---------- 六上 4 臺灣的區域 ----------
  const regions = (() => {
    const m = mapper({ x: 40, y: 10, lon0: 119.3, lat0: 25.4, k: 105 });
    const groups = [
      ["北部", "s-accent-fill", [[121.56, 25.04, "臺北"], [120.97, 24.8, "新竹"], [121.75, 24.75, "宜蘭"]]],
      ["中部", "s-bio-fill", [[120.68, 24.14, "臺中"], [120.97, 23.9, "南投"], [120.43, 23.7, "雲林"]]],
      ["南部", "s-chem-fill", [[120.45, 23.48, "嘉義"], [120.21, 22.99, "臺南"], [120.5, 22.6, "屏東"], [119.58, 23.57, "澎湖"]]],
      ["東部", "s-earth-fill", [[121.6, 23.98, "花蓮"], [121.15, 22.76, "臺東"]]]
    ];
    let g = island(m);
    groups.forEach(([, cls, pts]) => pts.forEach(([lon, lat, n]) => { const p = m([lon, lat]); g += C(p[0], p[1], 5, cls) + T(p[0] + 8, p[1] + 4, n, "s-tiny", "start"); }));
    groups.forEach(([name, cls], i) => { g += C(360, 60 + i * 26, 6, cls) + T(374, 65 + i * 26, name + "區域", "s-small", "start"); });
    return `<svg viewBox="0 0 480 400" width="480" role="img" aria-label="臺灣的北、中、南、東四大區域">${g}${T(410, 380, "示意圖，位置大約", "s-tiny")}</svg>`;
  })();

  // ---------- 六下 1-2 能源科技的變化 ----------
  const energyTech = timeline([
    { year: "18 世紀", name: "蒸汽機改良", note: "工業革命；機器取代人力" },
    { year: "清末", name: "輪船、鐵路", note: "蒸汽動力；傳入臺灣" },
    { year: "日治", name: "水力發電", note: "日月潭；發電廠" },
    { year: "現在", name: "再生能源", note: "太陽光電、風力；節能減碳", cls: "s-chem-fill" }
  ], { w: 640, h: 150, label: "能源科技的發展對臺灣的影響" });

  // ---------- 看圖題：臺灣民主發展的事件排序（不標年代） ----------
  const qDemocracy = boxes([
    { name: "甲", note: "解除戒嚴" },
    { name: "乙", note: "第一次總統直選" },
    { name: "丙", note: "臺灣議會；設置請願運動" },
    { name: "丁", note: "美麗島事件" }
  ], { bw: 120, h: 120, label: "四個民主發展的事件，標有甲乙丙丁" });

  Object.assign(window.FIG, { democracy, rights, gov, education, economy, smile, regions, energyTech, qDemocracy });
})();
