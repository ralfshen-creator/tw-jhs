/*
 * 科目設定：國小高年級英語（康軒版）。學習引擎 js/app.js、js/storage.js 和其他站相同，只換這個檔案和 data/ 裡的課程、題庫。
 */
window.SITE = {
  name: "國小英語學習站",
  nameEn: "English",
  publisher: "康軒",
  storagePrefix: "esen.",
  backupName: "國小英語學習站備份",
  backupApp: "ES_English_Learning",
  grades: [5, 6],
  defaultGrade: 5,
  terms: {
    "5A": { grade: 5, half: "上" }, "5B": { grade: 5, half: "下" },
    "6A": { grade: 6, half: "上" }, "6B": { grade: 6, half: "下" }
  },
  gradeName: { 5: "五年級", 6: "六年級" },
  // 借用自然站的標籤顏色：earth＝準備單元、phys＝主題單元、chem＝節慶文化
  subjectTags: { earth: "準備單元", phys: "主題單元", chem: "節慶文化" },
  lessonsIntro: `依 108 課綱、<b>康軒版</b>國小英語五、六年級（115 學年度）的單元主題、單字、句型和字母拼讀編排。每個單元有單字、句型、對話和短文、字母拼讀四個部分。`,
  versionNote: `單元名稱、單字、句型和字母拼讀依據：屏東縣多所國小公告的 115 學年度五、六年級英語教學進度總表（版本：康軒；六年級是 Wonder World 7、8）。對話、短文和題目都是本站自己寫的，不是課本的故事或課文，人物名字也不同。`,
  capRange: null,
  formulasName: "句型",
  formulasTip: "把每一課的句型和單字念熟，會問也會答",
  sims: []
};

// 「題庫 / 匯入」頁下載的範本
window.SITE.csvTemplate = [
  "章節,題型,題目,選項A,選項B,選項C,選項D,答案,解析,來源,年份,難度,圖片",
  '5A-1,單選,Does she like tea? 正確的回答是哪一個？,"Yes, I do.","Yes, she does.","Yes, she is.","No, I don\'t.",B,用 Does 問就用 does 回答,五上第一次評量,115,1,',
  '5A-3,填充,星期五的英文是什麼？,,,,,Friday,星期的第一個字母要大寫,五上第一次評量,115,1,'
].join("\r\n");

window.SITE.jsonTemplate = JSON.stringify([
  { chapter: "5A-1", type: "single", q: "Does she like tea? 正確的回答是哪一個？", options: ["Yes, I do.", "Yes, she does.", "Yes, she is.", "No, I don't."], answer: "B", explain: "用 Does 問就用 does 回答。", source: "五上第一次評量", year: "115", difficulty: 1 },
  { chapter: "5A-3", type: "fill", q: "星期五的英文是什麼？", answer: "Friday", source: "五上第一次評量" }
], null, 2);
