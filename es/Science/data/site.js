/*
 * 科目設定：國小高年級自然（康軒版）。學習引擎 js/app.js、js/storage.js 和其他站相同，只換這個檔案和 data/ 裡的課程、題庫。
 */
window.SITE = {
  name: "國小自然學習站",
  nameEn: "Science",
  publisher: "康軒",
  // 每一站的前綴都不同，放在同一個網址下時學習紀錄才不會混在一起
  storagePrefix: "essc.",
  backupName: "國小自然學習站備份",
  backupApp: "ES_Science_Learning",
  grades: [5],
  defaultGrade: 5,
  terms: {
    "5A": { grade: 5, half: "上" }, "5B": { grade: 5, half: "下" }
  },
  gradeName: { 5: "五年級" },
  subjectTags: { bio: "生物", phys: "物理", chem: "化學", earth: "地球科學" },
  lessonsIntro: `依 108 課綱、<b>康軒版</b>國小自然科學編排，五上、五下各 4 個單元，每個單元 3 個活動。點進去看重點整理、實驗和圖解。`,
  versionNote: `單元與活動名稱依據：學校公告的 115 學年度康軒版五年級自然科學教學進度總表。重點內容依該表列出的學習目標與 108 課綱學習內容（INa～INf）整理，是本站自編，不是課本原文。`,
  // 國小沒有會考
  capRange: null,
  formulasTip: "把每個單元的重點和實驗結論記熟",
  sims: []
};

// 「題庫 / 匯入」頁下載的範本
window.SITE.csvTemplate = [
  "章節,題型,題目,選項A,選項B,選項C,選項D,答案,解析,來源,年份,難度,圖片",
  '5A-4,單選,燃燒需要下列哪一種氣體幫忙？,氮氣,氧氣,二氧化碳,水蒸氣,B,氧氣可以幫助燃燒（助燃）,五上第二次評量,115,1,',
  '5A-3,是非,太陽是會自己發光發熱的恆星。,,,,,O,太陽是恆星；月球和行星不會自己發光,五上第二次評量,115,1,',
  '5B-1,填充,彈簧掛 1 個砝碼伸長 2 公分，在彈性限度內掛 3 個相同砝碼伸長幾公分？,,,,,6,伸長量隨重量增加,五下第一次評量,115,2,',
  ',單選,（考卷題，章節空白會歸到預設章節）下列何者是恆星？,月球,火星,太陽,地球,C,,五上練習卷,115,1,'
].join("\r\n");

window.SITE.jsonTemplate = JSON.stringify([
  { chapter: "5A-4", type: "single", q: "燃燒需要下列哪一種氣體幫忙？", options: ["氮氣", "氧氣", "二氧化碳", "水蒸氣"], answer: "B", explain: "氧氣可以幫助燃燒（助燃）。", source: "五上第二次評量", year: "115", difficulty: 1 },
  { chapter: "5A-3", type: "tf", q: "太陽是會自己發光發熱的恆星。", answer: "O", source: "五上第二次評量", year: "115" }
], null, 2);
