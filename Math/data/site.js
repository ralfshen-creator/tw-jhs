/*
 * 科目設定：學習引擎（js/app.js、js/storage.js）裡跟科目有關的部分都放在這裡。
 * 之後別的科目沿用同一套引擎時，只要改這個檔案和 data/ 裡的課程、題庫。
 */
window.SITE = {
  name: "國中數學學習站",
  nameEn: "Math",
  // 每個科目用不同的前綴，放在同一個網址（TW_JHS 總入口）下時，學習紀錄才不會混在一起
  storagePrefix: "ma.",
  backupName: "數學學習站備份",
  backupApp: "Math_Learning",   // 備份檔的標記，避免把理化站的備份還原到數學站
  grades: [7, 8, 9],
  defaultGrade: 8,
  terms: {
    "7A": { grade: 7, half: "上" }, "7B": { grade: 7, half: "下" },
    "8A": { grade: 8, half: "上" }, "8B": { grade: 8, half: "下" },
    "9A": { grade: 9, half: "上" }, "9B": { grade: 9, half: "下" }
  },
  gradeName: { 7: "七年級", 8: "八年級", 9: "九年級" },
  // 章節卡片上的分類標籤（課綱的學習內容主題）
  subjectTags: {
    num: "數與量", alg: "代數", func: "函數", geo: "幾何", coord: "坐標幾何", stat: "資料與不確定性"
  },
  lessonsIntro: `依 108 課綱、<b>翰林版</b>國中數學編排，七上到九下共 6 冊、24 章，章名和節名都用翰林版的名稱。點進去看重點整理、例題與圖解。`,
  versionNote: `章節依據：升學王「108 課綱國中版本對照表」翰林七上、八上、九上（115 學年度）與七下、八下、九下（114 學年度）。對照表中翰林、康軒、南一三家涵蓋的單元相同，只是章節名稱與分節方式不同，所以數學目前沒有「其他版本才有」的補充教材。`,
  capRange: /^(7|8|9)/,
  capRangeName: "七、八、九年級",
  capQuestions: 30,
  capMinutes: 60,
  capNote: "會考數學實際是 80 分鐘，有選擇題與非選擇題；這裡只用選擇、填充題做綜合練習。",
  formulasTip: "把公式和定理背熟，並記得每個公式什麼時候用",
  sims: []
};

// 「題庫 / 匯入」頁下載的範本
window.SITE.csvTemplate = [
  "章節,題型,題目,選項A,選項B,選項C,選項D,答案,解析,來源,年份,難度,圖片",
  '8A-1,單選,(x + 3)² 展開後是多少？,x² + 9,x² + 3x + 9,x² + 6x + 9,x² + 6x + 3,C,(a + b)² = a² + 2ab + b²,八上第一次段考,113,1,',
  '因式分解,多選,"下列哪些是 x² − 4 的因式？\n（多選）",x − 2,x + 2,x − 4,x + 4,AB,x² − 4 = (x + 2)(x − 2),八上第二次段考,113,2,',
  '8A-2,是非,√9 = ±3。,,,,,X,√9 只表示正的平方根 3；9 的平方根才是 ±3。,八上第一次段考,113,1,',
  '8A-4,填充,一元二次方程式 x² − 5x + 6 = 0 的兩根之和是多少？,,,,,5,(x − 2)(x − 3) = 0，兩根 2 和 3，和為 5,八上第二次段考,113,2,',
  ',單選,（會考題，章節空白會歸到預設章節）下列何者是質數？,21,27,29,33,C,,113 會考,113,1,113-01.png'
].join("\r\n");

window.SITE.jsonTemplate = JSON.stringify([
  { chapter: "8A-1", type: "single", q: "(x + 3)² 展開後是多少？", options: ["x² + 9", "x² + 3x + 9", "x² + 6x + 9", "x² + 6x + 3"], answer: "C", explain: "(a + b)² = a² + 2ab + b²", source: "八上第一次段考", year: "113", difficulty: 1 },
  { chapter: "8A-2", type: "tf", q: "√9 = ±3。", answer: "X", explain: "√9 只表示正的平方根 3。", source: "八上第一次段考", year: "113" },
  { chapter: "8A-4", type: "fill", q: "x² − 5x + 6 = 0 的兩根之和是多少？", answer: "5", source: "八上第二次段考" }
], null, 2);
