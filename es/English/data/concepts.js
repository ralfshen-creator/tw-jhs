/*
 * 觀念對照：每題對應到一個觀念，答錯時顯示該觀念的常見錯誤，並連回課文那一節。
 * sec 是該單元 sections 的索引（從 0 開始）。題目用 concept 欄位指定觀念。
 */
window.CONCEPTS = {
  "5A-0": [
    { id: "5A0-ph", name: "長母音 a", sec: 0, kw: ["a_e", "ai", "ay"], pitfall: "a_e 的 e 不發音；ai 在字中間、ay 在字尾。" },
    { id: "5A0-num", name: "整十的數字", sec: 1, kw: ["twenty", "forty", "number"], pitfall: "forty 沒有 u；fifteen 和 fifty 重音不同。" }
  ],
  "5A-1": [
    { id: "5A1-w", name: "飲料單字", sec: 0, kw: ["drink"], pitfall: "bubble tea、hot chocolate、soy milk 是兩個字。" },
    { id: "5A1-s", name: "Do / Does … like …?", sec: 1, kw: ["like", "does", "do"], pitfall: "he、she 用 Does 問、does 回答；肯定句 like 加 s。" },
    { id: "5A1-p", name: "長母音 e", sec: 3, kw: ["ee", "ea", "e_e"], pitfall: "同一個 [i] 有 e_e、ee、ea 三種拼法。" }
  ],
  "5A-2": [
    { id: "5A2-w", name: "水果與單複數", sec: 0, kw: ["fruit", "an apple"], pitfall: "開頭是母音的聲音用 an（an apple），子音的聲音用 a；兩個以上加 s。" },
    { id: "5A2-s", name: "How many … need?", sec: 1, kw: ["How many", "need"], pitfall: "How many 接複數；She needs，但 does she need。" },
    { id: "5A2-p", name: "長母音 i", sec: 3, kw: ["i_e", "igh", "ie"], pitfall: "igh 的 gh 不發音。" }
  ],
  "5A-3": [
    { id: "5A3-w", name: "星期", sec: 0, kw: ["Monday", "day"], pitfall: "星期第一個字母大寫；Wednesday 的第一個 d 通常不發音，day 前的 d 要念。" },
    { id: "5A3-s", name: "What day is today?", sec: 1, kw: ["What day", "Is today"], pitfall: "Is today Monday? 用 Yes, it is. / No, it's … 回答。" },
    { id: "5A3-p", name: "長母音 o", sec: 3, kw: ["o_e", "oa", "ow"], pitfall: "ow 有時念 [aʊ]（cow），這課學念 [o] 的 ow。" }
  ],
  "5A-4": [
    { id: "5A4-w", name: "科目", sec: 0, kw: ["subject"], pitfall: "Chinese、English 第一個字母大寫。" },
    { id: "5A4-s", name: "favorite subject、his / her", sec: 1, kw: ["favorite", "his", "her"], pitfall: "問 your 答 My；問 his 答 His。" },
    { id: "5A4-p", name: "長母音 u", sec: 3, kw: ["u_e", "ue", "ui"], pitfall: "u_e 有 [ju]（cute）和 [u]（June）兩種念法。" }
  ],
  "5A-5": [
    { id: "5A5-cny", name: "春節", sec: 0, kw: ["New Year"], pitfall: "lucky money 是紅包；spring couplets 是春聯。" }
  ],
  "5B-0": [
    { id: "5B0-num", name: "百位數字", sec: 0, kw: ["hundred"], pitfall: "two hundred 的 hundred 不加 s；百位後面加 and。" },
    { id: "5B0-land", name: "世界地標", sec: 1, kw: ["Tower", "Wall"], pitfall: "the Eiffel Tower 在法國、Big Ben 在英國。" }
  ],
  "5B-1": [
    { id: "5B1-w", name: "社區場所", sec: 0, kw: ["place"], pitfall: "post office 是郵局、bakery 是麵包店。" },
    { id: "5B1-s", name: "be going to + 地方", sec: 1, kw: ["going to", "Where"], pitfall: "問 Are you…? 答 Yes, I am.；地方前加 the。" },
    { id: "5B1-p", name: "bl、pl、gl、cl", sec: 3, kw: ["bl", "cl"], pitfall: "兩個子音都要念出來。" }
  ],
  "5B-2": [
    { id: "5B2-w", name: "交通工具", sec: 0, kw: ["bus", "train"], pitfall: "MRT 是捷運、scooter 是機車。" },
    { id: "5B2-s", name: "How can we get to …?", sec: 1, kw: ["by", "get to"], pitfall: "by bus 中間不加 a；走路是 on foot。" },
    { id: "5B2-p", name: "br、pr、gr、cr", sec: 3, kw: ["br", "gr"], pitfall: "子音連在一起要快速念。" }
  ],
  "5B-3": [
    { id: "5B3-w", name: "衣物", sec: 0, kw: ["clothes"], pitfall: "pants、shorts、sneakers、socks 是複數。" },
    { id: "5B3-s", name: "How much is / are …?", sec: 1, kw: ["How much", "dollars"], pitfall: "一件用 is / It's；複數用 are / They're。" },
    { id: "5B3-p", name: "tr、dr", sec: 3, kw: ["tr", "dr"], pitfall: "t / d 和 r 都要念出來。" }
  ],
  "5B-4": [
    { id: "5B4-w", name: "隨身物品", sec: 0, kw: ["things"], pitfall: "glasses 是眼鏡，是複數。" },
    { id: "5B4-s", name: "Whose … is it / are they?", sec: 1, kw: ["Whose", "'s"], pitfall: "名字加 's 表示誰的；Whose 和 Who's 意思不同。" },
    { id: "5B4-p", name: "sp、st、sk", sec: 3, kw: ["sp", "st", "sk"], pitfall: "s 和後面的子音連在一起念。" }
  ],
  "5B-5": [
    { id: "5B5-earth", name: "地球日", sec: 0, kw: ["Earth Day", "recycle"], pitfall: "地球日是 4 月 22 日；reuse 是重複使用。" }
  ]
};
