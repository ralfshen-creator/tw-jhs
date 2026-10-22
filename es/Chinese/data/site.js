/*
 * 科目設定：國小高年級國語（南一版）。學習引擎 js/app.js、js/storage.js 和其他站相同，只換這個檔案和 data/ 裡的課程、題庫。
 */
window.SITE = {
  name: "國小國語學習站",
  nameEn: "Chinese",
  publisher: "南一",
  storagePrefix: "esch.",
  backupName: "國小國語學習站備份",
  backupApp: "ES_Chinese_Learning",
  grades: [5, 6],
  defaultGrade: 5,
  terms: {
    "5A": { grade: 5, half: "上" }, "5B": { grade: 5, half: "下" },
    "6A": { grade: 6, half: "上" }, "6B": { grade: 6, half: "下" }
  },
  gradeName: { 5: "五年級", 6: "六年級" },
  subjectTags: { phys: "閱讀與寫作" },
  lessonsIntro: `依 108 課綱、<b>南一版</b>國小國語五、六年級（115 學年度）的單元和課次編排。每課整理這一課要學的文體、修辭、句型和閱讀方法，例句和短文是本站自己寫的。`,
  versionNote: `單元、課名和每課的學習目標依據：屏東縣國小公告的 115 學年度五、六年級國語教學進度總表（版本欄標示南一；五年級三所、六年級兩所，彼此比對一致）。課文有著作權，本站不收錄課文、也沒有生字表，請以課本為準；古詩〈鳥鳴澗〉〈早發白帝城〉是古代作品，全文列出。`,
  capRange: null,
  formulasName: "重點",
  formulasTip: "把每一課的句型、修辭和文體特色記熟，並練習自己造句",
  sims: []
};

// 「題庫 / 匯入」頁下載的範本
window.SITE.csvTemplate = [
  "章節,題型,題目,選項A,選項B,選項C,選項D,答案,解析,來源,年份,難度,圖片",
  '5A-1,單選,「如果明天下雨，運動會就延期。」是哪一種句型？,假設句,轉折句,選擇句,並列句,A,如果…就…表示假設,五上第一次評量,115,1,',
  '5A-4,填充,〈早發白帝城〉的作者是誰？,,,,,李白,唐代詩人李白,五上第二次評量,115,1,'
].join("\r\n");

window.SITE.jsonTemplate = JSON.stringify([
  { chapter: "5A-1", type: "single", q: "「如果明天下雨，運動會就延期。」是哪一種句型？", options: ["假設句", "轉折句", "選擇句", "並列句"], answer: "A", explain: "如果…就…表示假設。", source: "五上第一次評量", year: "115", difficulty: 1 },
  { chapter: "5A-4", type: "fill", q: "〈早發白帝城〉的作者是誰？", answer: "李白", source: "五上第二次評量" }
], null, 2);
