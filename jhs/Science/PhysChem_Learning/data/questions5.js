/*
 * 看圖題（2026-10-12）：配合課文新圖解出的自編原創題，圖用 figures7.js 的題目版（答案改成代號）。
 * id 以 f 開頭。需在 questions.js、figures7.js 之後載入。
 */
window.BUILTIN_QUESTIONS.push(
  { id: "f8A0-1", chapter: "8A-0", concept: "8A0-lamp", kind: "graph", type: "single", difficulty: 2,
    q: "如圖為酒精燈的火焰。用酒精燈加熱時，應該讓試管或燒杯放在火焰的哪一部分？",
    figure: FIG.qFlame,
    options: ["乙，因為它在火焰中間", "丙，因為最靠近燈芯", "甲，因為這裡和空氣接觸最多，燃燒最完全，溫度最高", "哪一部分都一樣"], answer: "C",
    explain: "甲是外焰，和空氣接觸最多、燃燒最完全，溫度最高，加熱要用外焰。丙是焰心，燃料還沒完全燃燒，溫度最低。常見錯誤是以為火焰中心或最靠近燈芯的地方最熱。" },

  { id: "f8B1-1", chapter: "8B-1", concept: "8B1-eq", kind: "graph", type: "single", difficulty: 2,
    q: "如圖為某反應在反應前、後的粒子模型。這個反應的化學反應式為何？",
    figure: FIG.qCOModel,
    options: ["CO + O₂ → CO₂", "2CO + O₂ → 2CO₂", "2CO + O → 2CO₂", "2CO₂ → 2CO + O₂"], answer: "B",
    explain: "反應前有 2 個 CO 分子（各一個碳、一個氧）和 1 個 O₂ 分子；反應後有 2 個 CO₂ 分子。數原子：反應前 C 2 個、O 4 個，反應後 C 2 個、O 4 個，原子數相同。A 沒有平衡；C 把氧氣寫成 O，但氧氣是 O₂ 分子；D 把反應物和生成物寫反了。" },

  { id: "f8B2-1", chapter: "8B-2", concept: "8B2-redox", kind: "graph", type: "single", difficulty: 3,
    q: "如圖，甲的氧化物和乙一起加熱，反應後得到甲和乙的氧化物。依圖判斷，下列何者正確？",
    figure: FIG.qOxTransfer,
    options: ["乙對氧的活性比甲大", "甲被氧化", "乙被還原", "甲是還原劑"], answer: "A",
    explain: "氧從甲轉移到乙：乙把甲的氧搶走，表示乙對氧的活性比甲大。甲失去氧，被還原；乙得到氧，被氧化，是還原劑。所以 B、C、D 都說反了。這和碳還原氧化銅（碳的活性比銅大）是同一類反應。" },

  { id: "f8B3-1", chapter: "8B-3", concept: "8B3-elec", kind: "graph", type: "single", difficulty: 3,
    q: "如圖，把兩個電極插入食鹽水並接上電池（電池符號中較長的一邊是正極）。通電後，食鹽水中帶正電的鈉離子（Na⁺）會往哪一個電極移動？",
    figure: FIG.qIons,
    options: ["乙", "甲", "不會移動", "兩個電極都去"], answer: "B",
    explain: "電池較短的一邊是負極，接到甲；較長的一邊是正極，接到乙。異性電相吸，帶正電的 Na⁺ 往負極（甲）移動；帶負電的 Cl⁻ 往正極（乙）移動。離子在溶液中移動，電路才能導通。" },

  { id: "f8B3-2", chapter: "8B-3", concept: "8B3-ph", kind: "graph", type: "multi", difficulty: 3,
    q: "如圖為甲、乙、丙、丁四種溶液的 pH 值（25 °C）。下列哪些敘述正確？",
    figure: FIG.qPh,
    options: ["甲的酸性最強", "丙是中性", "丁會使無色酚酞變成紅色", "甲的氫離子濃度是乙的 3 倍", "乙加入大量的水稀釋後，pH 會變成 8"], answer: "ABC",
    explain: "甲 pH 2、乙 5、丙 7、丁 11。pH 愈小酸性愈強，甲最酸；pH 7 是中性；丁大於 7 是鹼性，使酚酞變紅。D 錯：pH 差 3，氫離子濃度相差 10 × 10 × 10 = 1000 倍，不是 3 倍。E 錯：酸性溶液加水只會愈來愈接近 7，不會變成鹼性。" },

  { id: "f8B5-1", chapter: "8B-5", concept: "8B5-org", kind: "graph", type: "single", difficulty: 2,
    q: "如圖為某種烴的分子模型。這個分子的化學式為何？",
    figure: FIG.qButane,
    options: ["C₄H₈", "C₁₀H₄", "C₄H₁₀", "C₄H₁₂"], answer: "C",
    explain: "數一數：中間一排有 4 個碳原子；氫原子上面 4 個、下面 4 個、左右兩端各 1 個，共 10 個，所以是 C₄H₁₀（丁烷）。也可以用烷類的規律檢查：氫的數目 = 碳數 × 2 + 2 = 10。B 是把碳和氫的數目寫反了。" },

  { id: "f8B5-2", chapter: "8B-5", concept: "8B5-soap", kind: "graph", type: "single", difficulty: 2,
    q: "如圖，許多肥皂分子把一滴油汙圍起來，四周是水。肥皂分子的哪一端是「親油端」？",
    figure: FIG.qMicelle,
    options: ["甲", "乙", "兩端都是", "兩端都不是"], answer: "B",
    explain: "肥皂分子的一端親水、一端親油。乙這一端伸進油汙裡，是親油端，負責抓住油；甲這一端朝外接觸水，是親水端。所以油汙被包起來後能被水沖走。" },

  { id: "f8B6-1", chapter: "8B-6", concept: "8B6-fric", kind: "graph", type: "multi", difficulty: 3,
    q: "用彈簧秤水平拉桌上的木塊，外力由小慢慢變大，木塊受到的摩擦力如圖所示。下列關於甲、乙、丙三點的敘述，哪些正確？",
    figure: FIG.qFriction,
    options: ["甲點時木塊仍然靜止", "甲點時摩擦力的大小等於外力", "乙點的摩擦力是最大靜摩擦力", "丙點時木塊正在滑動", "丙點的摩擦力比乙點大"], answer: "ABCD",
    explain: "外力還小時木塊不動，靜摩擦力和外力一樣大，所以圖形是斜直線（甲）。到乙點時摩擦力達到最大靜摩擦力，木塊開始滑動；之後是動摩擦力（丙），大小固定，而且比最大靜摩擦力小，所以 E 錯。" },

  { id: "f8B6-2", chapter: "8B-6", concept: "8B6-press", kind: "graph", type: "single", difficulty: 2,
    q: "如圖，裝滿水的瓶子側面有甲、乙、丙三個用塞子塞住的孔。同時拔掉三個塞子，哪一個孔的水剛噴出時最急？",
    figure: FIG.qHoles,
    options: ["甲", "乙", "丙", "三個一樣急"], answer: "C",
    explain: "液體壓力 = 深度 × 密度，愈深的地方壓力愈大。丙離水面最深，壓力最大，所以水噴出得最急；甲最淺，噴出得最慢。" },

  { id: "f8B6-3", chapter: "8B-6", concept: "8B6-atm", kind: "graph", type: "multi", difficulty: 3,
    q: "如圖，一個物體完全沒入水中，甲、乙分別表示水對物體上表面和下表面施的力。下列哪些敘述正確？",
    figure: FIG.qBuoy,
    options: ["乙處受到的水壓比甲處大", "物體受到的浮力方向向上", "浮力的大小等於乙、甲兩個力的差", "物體左右兩側受到的水的力互相抵消", "把物體放到更深的地方，乙、甲兩力的差會變大"], answer: "ABCD",
    explain: "下表面比上表面深，水壓較大，所以向上的力乙大於向下的力甲（圖中箭頭只表示方向，沒有畫出大小），兩者的差就是向上的浮力；左右兩側同一深度的壓力相等，互相抵消。E 錯：物體再往下沉，上下表面都變深，兩邊的壓力都增加同樣多，差值不變，所以完全沒入後浮力和深度無關。" },

  { id: "f9A1-1", chapter: "9A-1", concept: "9A1-disp", kind: "graph", type: "single", difficulty: 2,
    q: "如圖，一個人從起點先向東走 40 m，再向西走 60 m。他的路徑長和位移分別是？",
    figure: FIG.qPath,
    options: ["路徑長 100 m，位移向東 20 m", "路徑長 100 m，位移向西 20 m", "路徑長 20 m，位移向西 100 m", "路徑長 20 m，位移向東 20 m"], answer: "B",
    explain: "路徑長是實際走過的總長度：40 + 60 = 100 m。位移只看起點到終點：最後停在起點西邊 20 m（圖中 −20 m 處），所以位移是向西 20 m。常見錯誤是忘了位移要看方向，以為向東。" },

  { id: "f9A2-1", chapter: "9A-2", concept: "9A2-n3", kind: "graph", type: "multi", difficulty: 3,
    q: "如圖，書靜止在桌上。甲是地球吸引書的力（書的重量），乙是桌子支撐書的力，丙是書壓在桌面上的力。下列哪些敘述正確？",
    figure: FIG.qBookForces,
    options: ["甲和乙是一對平衡力", "乙和丙是一對作用力與反作用力", "甲和丙是一對作用力與反作用力", "甲和乙都作用在書上", "乙和丙大小相等、方向相反，所以互相抵消"], answer: "ABD",
    explain: "甲、乙都作用在書上，大小相等、方向相反，書才會靜止，是一對平衡力。乙（桌子推書）和丙（書推桌子）是兩個物體之間互相施加的力，是作用力與反作用力，但它們作用在不同物體上，不能抵消，所以 E 錯。甲的反作用力是「書吸引地球的力」，不是丙，所以 C 錯。" },

  { id: "f9A2-2", chapter: "9A-2", concept: "9A2-circ", kind: "graph", type: "single", difficulty: 2,
    q: "如圖，用繩子綁著小球在水平面上依箭頭方向做等速率圓周運動，此刻小球在最右邊。若繩子在這一瞬間斷掉，小球會沿哪一個方向飛出？",
    figure: FIG.qCircle,
    options: ["甲", "乙", "丙", "丁"], answer: "A",
    explain: "小球依逆時針方向轉，在最右邊這一刻的速度是向上的（圓的切線方向，甲）。繩子斷掉後沒有向心力，小球因慣性保持當時的速度，沿甲的方向直線前進。常見錯誤是以為會往外（丙）飛出。" },

  { id: "f9A2-3", chapter: "9A-2", concept: "9A2-circ", kind: "graph", type: "single", difficulty: 2,
    q: "如圖，小球在水平面上做等速率圓周運動，此刻在最右邊。繩子對小球施的向心力是哪一個方向？",
    figure: FIG.qCircle,
    options: ["甲", "丁", "丙", "乙"], answer: "D",
    explain: "向心力永遠指向圓心。小球在最右邊，圓心在它的左邊，所以向心力是乙的方向。繩子就是一直把小球往圓心拉，小球的運動方向才會不斷改變。" },

  { id: "f9A3-1", chapter: "9A-3", concept: "9A3-energy", kind: "graph", type: "multi", difficulty: 3,
    q: "如圖，單擺從 A 點由靜止放開，擺到最低點 B，再擺到另一側的最高點 C。不計空氣阻力與摩擦，下列哪些敘述正確？",
    figure: FIG.qPendulum,
    options: ["擺錘在 B 點的速度最大", "擺錘在 A 點和 C 點的速度都是 0", "從 A 擺到 B 的過程中，位能轉換成動能", "C 點和 A 點一樣高", "擺錘在 B 點的位能最大"], answer: "ABCD",
    explain: "不計阻力時力學能守恆。A、C 是最高點，速度為 0，位能最大；B 是最低點，位能最小，所以動能最大、速度最快，E 錯。因為力學能不變，擺到另一側時會回到和出發點一樣的高度。" },

  { id: "f9A4-1", chapter: "9A-4", concept: "9A4-current", kind: "graph", type: "single", difficulty: 2,
    q: "如圖，要測量通過燈泡的電流和燈泡兩端的電壓，甲、乙兩個電表分別應該是？",
    figure: FIG.qMeters,
    options: ["甲是伏特計，乙是安培計", "甲、乙都是安培計", "甲是安培計，乙是伏特計", "甲、乙都是伏特計"], answer: "C",
    explain: "甲串聯在電路中，電流會從它裡面流過，是安培計；乙接在燈泡兩端（並聯），量的是燈泡兩端的電壓，是伏特計。若把安培計並聯在燈泡兩端，電流幾乎都從安培計流走，可能燒壞。" },

  { id: "f9A4-2", chapter: "9A-4", concept: "9A4-ohm", kind: "graph", type: "single", difficulty: 2,
    q: "如圖為甲、乙兩個電路，各有兩個燈泡①、②。若把兩個電路中的燈泡①都拿掉，哪一個電路的燈泡②仍然會亮？",
    figure: FIG.qTwoCircuits,
    options: ["只有乙", "只有甲", "兩個都會亮", "兩個都不亮"], answer: "A",
    explain: "甲是串聯，電流只有一條路，拿掉燈泡①電路就斷了，燈泡②不亮。乙是並聯，兩個燈泡各在一條支路上，拿掉①不影響②那一條，②照樣亮。家裡的電器都是並聯，就是這個原因。" },

  { id: "f9B1-1", chapter: "9B-1", concept: "9B1-cell", kind: "graph", type: "multi", difficulty: 3,
    q: "如圖為鋅片（甲）和銅片（乙）做成的電池，燈泡會發亮。下列哪些敘述正確？",
    figure: FIG.qCell,
    options: ["電子由甲經導線流向乙", "甲是負極", "甲會逐漸變細", "乙的表面會有銅析出", "電流由甲經導線流向乙"], answer: "ABCD",
    explain: "鋅的活性比銅大，鋅失去電子變成鋅離子溶入溶液，所以鋅片變細，是負極；電子經導線流到銅片，溶液中的銅離子在銅片表面得到電子析出銅。E 錯：電流方向規定和電子流動方向相反，是由銅（乙）經導線流向鋅（甲）。" },

  { id: "f9B1-2", chapter: "9B-1", concept: "9B1-elec", kind: "graph", type: "single", difficulty: 2,
    q: "如圖為電解水的裝置，通電一段時間後，甲管收集到的氣體體積約是乙管的 2 倍。甲管中的氣體和它連接的電極分別是？",
    figure: FIG.qElectrolysis,
    options: ["氧氣，正極", "氧氣，負極", "氫氣，正極", "氫氣，負極"], answer: "D",
    explain: "電解水產生的氫氣和氧氣體積比約 2 : 1，體積較多的甲是氫氣，氫氣在負極產生；乙是氧氣，在正極產生。也可以從圖中電池較短的一邊（負極）接到甲來判斷。" },

  { id: "f9B2-1", chapter: "9B-2", concept: "9B2-mag", kind: "graph", type: "single", difficulty: 2,
    q: "如圖為一根磁鐵周圍的磁力線，箭頭表示磁力線的方向，兩端分別標示為甲、乙。哪一端是 N 極？",
    figure: FIG.qMagnet,
    options: ["甲", "乙", "兩端都是 N 極", "無法判斷"], answer: "B",
    explain: "磁鐵外部的磁力線由 N 極出發、進入 S 極。圖中的箭頭都從乙端出發，繞過上下兩側，回到甲端，所以乙是 N 極、甲是 S 極。" },

  { id: "f9B2-2", chapter: "9B-2", concept: "9B2-em", kind: "graph", type: "single", difficulty: 3,
    q: "如圖為一根垂直紙面的通電直導線（俯視），電流從紙面流出、朝向你。不考慮地球磁場，在導線正上方甲處放一個小指北針，它的 N 極會指向哪裡？",
    figure: FIG.qWire,
    options: ["向左", "向右", "朝向導線（向下）", "遠離導線（向上）"], answer: "A",
    explain: "用右手定則：拇指指向電流方向（朝向你），四指彎曲的方向就是磁場方向，從你這邊看是逆時針的同心圓。在導線正上方的甲處，逆時針方向是向左，指北針的 N 極會指向磁場方向，所以向左。磁場是繞著導線的圓，不會指向或遠離導線。" },

  { id: "f9B2-3", chapter: "9B-2", concept: "9B2-induct", kind: "graph", type: "single", difficulty: 3,
    q: "如圖為磁鐵和連接電流計 G 的線圈的三種情況：甲是磁鐵移向線圈；乙是磁鐵靜止放在線圈裡；丙是磁鐵不動、線圈往遠離磁鐵的方向移動。哪些情況下電流計會偏轉？",
    figure: FIG.qInduction,
    options: ["只有甲", "甲和丙", "只有乙", "三種都會"], answer: "B",
    explain: "線圈中的磁場發生變化，才會產生感應電流。甲是磁鐵靠近，丙是線圈遠離磁鐵，在這兩種移近、移遠的情況下，通過線圈的磁場都在改變，所以都會產生電流。乙雖然磁鐵在線圈裡，但兩者都不動，磁場沒有變化，所以沒有電流。常見錯誤是以為一定要「磁鐵」動才行；其實關鍵是通過線圈的磁場有沒有改變，不是任何相對運動都可以，也不一定要有東西在動。" }
);
