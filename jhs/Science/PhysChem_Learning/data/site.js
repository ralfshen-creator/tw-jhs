/*
 * 科目設定：學習引擎（js/app.js、js/storage.js，各站共用同一份）裡跟科目有關的部分都放在這裡。
 */
window.SITE = {
  name: "國中自然科學學習站",
  nameEn: "Natural Science",
  // 沿用原本的前綴與備份標記：孩子已經存的理化紀錄、舊的備份檔都繼續有效
  storagePrefix: "pc.",
  backupName: "自然科學學習站備份",
  backupApp: "PhysChem_Learning",
  grades: [7, 8, 9],
  defaultGrade: 8,
  terms: {
    "7A": { grade: 7, half: "上" }, "7B": { grade: 7, half: "下" },
    "8A": { grade: 8, half: "上" }, "8B": { grade: 8, half: "下" },
    "9A": { grade: 9, half: "上" }, "9B": { grade: 9, half: "下" }
  },
  gradeName: { 7: "七年級", 8: "八年級", 9: "九年級" },
  subjectTags: { bio: "生物", phys: "物理", chem: "化學", earth: "地球科學" },
  lessonsIntro: `依 108 課綱、翰林版國中<b>自然科學</b>編排：七年級<b>生物</b>，八年級與九年級前半<b>理化（物理、化學）</b>，九年級後半<b>地球科學</b>。點進去看重點整理與例題。`,
  versionNote: `生物、地球科學章節依據：升學王「108 課綱國中版本對照表」翰林七上（115 學年度）、七下（114 學年度）、九上（115 學年度）、九下（114 學年度）。`,
  lessonsExtra: `<div class="supp small"><span class="supp-label">📘 補充教材</span><br>
紫色虛線框是<b>其他版本（康軒、南一）有、但翰林版同一單元沒有</b>的內容，框上會註明出自哪一版。
學校用翰林版，段考不一定會考這些，當作加強理解或比賽、會考的延伸。<br>
<span class="muted">理化版本差異依據：升學王「108 課綱國中理化八上版本對照表」（2022 年 8 月版），以章節與實驗為單位比對。</span></div>`,
  capRange: /^(7|8|9)/,
  capRangeName: "七、八、九年級",
  capQuestions: 30,
  capMinutes: 45,
  capNote: "",
  formulasTip: "把公式和單位換算背熟",
  sims: ["wave", "ohm", "circuit", "lens"]
};

// 「題庫 / 匯入」頁下載的範本
window.SITE.csvTemplate = [
  "章節,題型,題目,選項A,選項B,選項C,選項D,答案,解析,來源,年份,難度,圖片",
  '8A-1,單選,某金屬塊質量 54 g、體積 20 cm³，密度為何？,1.08 g/cm³,2.7 g/cm³,34 g/cm³,1080 g/cm³,B,D = M ÷ V = 54 ÷ 20 = 2.7,八上第一次段考,113,1,',
  '光,多選,"下列哪些現象與光的折射有關？\n（多選）",水中筷子看起來彎折,針孔成像,池底看起來變淺,照鏡子,AC,,八上第二次段考,113,2,',
  '溫度與熱,是非,熱的輻射不需要介質。,,,,,O,太陽的熱經由真空傳到地球。,八上第二次段考,113,1,',
  '8B-1,填充,水的分子量是多少？（H=1，O=16）,,,,,18,1×2 + 16 = 18,八下第一次段考,113,1,',
  ',單選,（會考題，章節空白會歸到預設章節）下列何者為化學變化？,冰融化,鐵生鏽,糖溶解,玻璃破裂,B,,113 會考,113,1,113-01.png'
].join("\r\n");

window.SITE.jsonTemplate = JSON.stringify([
  { chapter: "8A-1", type: "single", q: "某金屬塊質量 54 g、體積 20 cm³，密度為何？", options: ["1.08 g/cm³", "2.7 g/cm³", "34 g/cm³", "1080 g/cm³"], answer: "B", explain: "D = M ÷ V = 54 ÷ 20 = 2.7", source: "八上第一次段考", year: "113", difficulty: 1 },
  { chapter: "8A-5", type: "tf", q: "熱的輻射不需要介質。", answer: "O", explain: "太陽的熱經由真空傳到地球。", source: "八上第二次段考", year: "113" },
  { chapter: "8B-1", type: "fill", q: "水的分子量是多少？（H=1，O=16）", answer: "18", source: "八下第一次段考" }
], null, 2);
