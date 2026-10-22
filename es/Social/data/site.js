/*
 * 科目設定：國小高年級社會（康軒版）。學習引擎 js/app.js、js/storage.js 和其他站相同，只換這個檔案和 data/ 裡的課程、題庫。
 */
window.SITE = {
  name: "國小社會學習站",
  nameEn: "Social Studies",
  publisher: "康軒",
  // 每一站的前綴都不同，放在同一個網址下時學習紀錄才不會混在一起
  storagePrefix: "esso.",
  backupName: "國小社會學習站備份",
  backupApp: "ES_Social_Learning",
  grades: [5, 6],
  defaultGrade: 5,
  terms: {
    "5A": { grade: 5, half: "上" }, "5B": { grade: 5, half: "下" },
    "6A": { grade: 6, half: "上" }, "6B": { grade: 6, half: "下" }
  },
  gradeName: { 5: "五年級", 6: "六年級" },
  // 用自然站已有的標籤顏色：earth 棕色＝地理、chem 橘色＝歷史、phys 藍色＝公民與經濟
  subjectTags: { earth: "地理", chem: "歷史", phys: "公民與經濟" },
  lessonsIntro: `依 108 課綱、<b>康軒版</b>國小社會編排，五上、五下各 4 個單元、共 21 課；六上 4 個單元 10 課、六下 2 個單元 6 課。點進去看重點整理、年代表、地圖示意和圖解。`,
  versionNote: `單元與課名依據：學校公告的 115 學年度五、六年級社會領域教學進度總表（課名與康軒版第五～八冊相同；六年級以屏東縣三所國小的計畫交叉比對）。重點內容依該表列出的學習目標與 108 課綱社會領域學習內容整理，是本站自編，不是課本原文。地圖都是示意圖，不是精確比例。`,
  // 國小沒有會考
  capRange: null,
  formulasName: "重點",
  formulasTip: "把重要的年代、人物、地名和名詞記熟，也要知道「為什麼」",
  sims: []
};

// 「題庫 / 匯入」頁下載的範本
window.SITE.csvTemplate = [
  "章節,題型,題目,選項A,選項B,選項C,選項D,答案,解析,來源,年份,難度,圖片",
  '5A-4,單選,荷蘭人在臺南安平建造的城堡是哪一座？,熱蘭遮城,聖薩爾瓦多城,億載金城,紅毛城,A,熱蘭遮城就是今天的安平古堡,五上第二次評量,115,1,',
  '5A-2,是非,臺灣的河川大多短而急。,,,,,O,山地多、距離海近，河川短、坡度陡,五上第一次評量,115,1,',
  ',單選,（考卷題，章節空白會歸到預設章節）臺灣西邊隔著哪一個海峽和中國大陸相望？,臺灣海峽,巴士海峽,麻六甲海峽,白令海峽,A,,五上練習卷,115,1,'
].join("\r\n");

window.SITE.jsonTemplate = JSON.stringify([
  { chapter: "5A-4", type: "single", q: "荷蘭人在臺南安平建造的城堡是哪一座？", options: ["熱蘭遮城", "聖薩爾瓦多城", "億載金城", "紅毛城"], answer: "A", explain: "熱蘭遮城就是今天的安平古堡。", source: "五上第二次評量", year: "115", difficulty: 1 },
  { chapter: "5A-2", type: "tf", q: "臺灣的河川大多短而急。", answer: "O", source: "五上第一次評量", year: "115" }
], null, 2);
