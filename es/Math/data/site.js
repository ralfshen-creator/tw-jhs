/*
 * 科目設定：國小高年級數學（康軒版）。學習引擎 js/app.js、js/storage.js 和國中站相同，只換這個檔案和 data/ 裡的課程、題庫。
 */
window.SITE = {
  name: "國小數學學習站",
  nameEn: "Math",
  publisher: "康軒",
  // 和國中站（ma.）、自然站（pc.）分開，放在同一個網址下時學習紀錄才不會混在一起
  storagePrefix: "esma.",
  backupName: "國小數學學習站備份",
  backupApp: "ES_Math_Learning",
  grades: [5, 6],
  defaultGrade: 5,
  terms: {
    "5A": { grade: 5, half: "上" }, "5B": { grade: 5, half: "下" },
    "6A": { grade: 6, half: "上" }, "6B": { grade: 6, half: "下" }
  },
  gradeName: { 5: "五年級", 6: "六年級" },
  // 章節卡片上的分類標籤（108 課綱國小數學的學習內容主題）
  subjectTags: {
    num: "數與量", geo: "空間與形狀", alg: "關係", stat: "資料與不確定性"
  },
  lessonsIntro: `依 108 課綱、<b>康軒版</b>國小數學編排，五上、五下各 10 個單元；六上 9 個、六下 6 個單元。點進去看重點整理、例題與圖解。`,
  versionNote: `單元依據：康軒版五、六年級數學（115 學年度）。單元名稱對照學校公告的康軒版教學計畫（六年級以屏東縣兩所國小的計畫交叉比對）與均一教育平台「適康軒版」課程；小節名稱是本站整理，可能和課本的活動名稱不完全一樣。`,
  // 國小沒有會考
  capRange: null,
  formulasTip: "把公式和單位換算記熟，並記得每個公式什麼時候用",
  sims: []
};

// 「題庫 / 匯入」頁下載的範本
window.SITE.csvTemplate = [
  "章節,題型,題目,選項A,選項B,選項C,選項D,答案,解析,來源,年份,難度,圖片",
  '5A-2,單選,下列哪一個數是 18 的因數？,4,5,6,7,C,18 ÷ 6 = 3，可以整除,五上第一次評量,115,1,',
  '5A-4,填充,把 6/8 約成最簡分數是多少？,,,,,3/4,分子分母同除以 2,五上第一次評量,115,1,',
  '5A-5,是非,三角形的內角和是 180 度。,,,,,O,任何三角形的三個內角加起來都是 180 度,五上第一次評量,115,1,',
  ',單選,（考卷題，章節空白會歸到預設章節）下列哪一個數最大？,0.5,0.45,0.505,0.055,C,,五上練習卷,115,1,'
].join("\r\n");

window.SITE.jsonTemplate = JSON.stringify([
  { chapter: "5A-2", type: "single", q: "下列哪一個數是 18 的因數？", options: ["4", "5", "6", "7"], answer: "C", explain: "18 ÷ 6 = 3，可以整除。", source: "五上第一次評量", year: "115", difficulty: 1 },
  { chapter: "5A-5", type: "tf", q: "三角形的內角和是 180 度。", answer: "O", explain: "任何三角形的三個內角加起來都是 180 度。", source: "五上第一次評量", year: "115" },
  { chapter: "5A-4", type: "fill", q: "把 6/8 約成最簡分數是多少？", answer: "3/4", source: "五上第一次評量" }
], null, 2);
