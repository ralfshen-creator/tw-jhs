/*
 * 國小英語課程資料（五年級上、下學期）。單元名稱、單字、句型、字母拼讀依 115 學年度康軒版五年級英語教學進度總表。
 * 對話、短文、例句都是本站自編，不是課本的故事或課文；人物（Ben、Lily、Max、Nina）也是本站自己取的。
 *   - id 是題庫用來對應單元的代碼；formulas 會彙整到「句型卡」頁
 */
(function () {
  // 單字表：[英文, 中文]
  const words = list => `<table><tr><th>英文</th><th>中文</th></tr>${list.map(w => `<tr><td><b>${w[0]}</b></td><td>${w[1]}</td></tr>`).join("")}</table>`;
  // 對話：[說話的人, 英文, 中文]
  const talk = lines => `<div class="example">${lines.map(l => `<div><b>${l[0]}：</b>${l[1]}<br><span class="small muted">${l[2]}</span></div>`).join("")}</div>`;

  window.CURRICULUM = { terms: [
  {
    id: "5A", name: "五年級上學期", short: "五上",
    chapters: [
      {
        id: "5A-0", no: "Get Ready", title: "字母拼讀與數字", subject: "earth",
        summary: "短母音 a 和長母音 a；a_e、ai、ay 的拼讀；整十的數字 ten 到 one hundred。",
        checklist: ["聽得出短母音 a（cap）和長母音 a（cape）的不同", "會念 a_e、ai、ay 的字", "會說、會拼 ten 到 one hundred 的整十數字"],
        sections: [
          { title: "Phonics 長母音 a", html: `
<ul>
  <li><b>短母音 a</b>：念 [æ]，例如 cap、man、tap</li>
  <li><b>長母音 a</b>：念 [e]（和字母 A 的名字一樣），常見拼法有三種：</li>
  <li><b>a_e</b>：cake、game、name（字尾的 e 不發音，讓前面的 a 念長音）</li>
  <li><b>ai</b>：rain、train、mail</li>
  <li><b>ay</b>：day、play、May</li>
</ul>
<table><tr><th>短母音 a</th><th>加上 e，變長母音 a</th></tr><tr><td>cap 帽子</td><td>cape 披風</td></tr><tr><td>man 男人</td><td>mane 鬃毛</td></tr><tr><td>tap 輕拍</td><td>tape 膠帶</td></tr></table>
<div class="box analogy">💡 <b>打個比方</b>：a_e 的 e 是「魔法 e」，自己不出聲，卻讓前面的 a 念出自己的名字。</div>
<div class="box warn">易錯：ai 常在字的中間（rain），ay 常在字的最後面（day）。</div>` },
          { title: "Numbers 整十的數字", html: `
${words([["ten", "10"], ["twenty", "20"], ["thirty", "30"], ["forty", "40"], ["fifty", "50"], ["sixty", "60"], ["seventy", "70"], ["eighty", "80"], ["ninety", "90"], ["one hundred", "100"]])}
<div class="box warn">易錯：forty 沒有 u（不是 fourty）；fifteen（15）和 fifty（50）的重音不同，fif<b>teen</b> 重音在後面，<b>fif</b>ty 重音在前面。</div>` }
        ],
        formulas: [
          { name: "長母音 a", f: "a_e（cake）、ai（rain）、ay（day）", note: "" },
          { name: "整十", f: "twenty, thirty, forty, fifty …", note: "forty 沒有 u" }
        ]
      },
      {
        id: "5A-1", no: "Unit 1", title: "The Best Drink 飲料", subject: "phys",
        summary: "飲料的英文；用 Do you like…? 和 Does he/she like…? 問別人喜不喜歡；e_e、ee、ea 的長母音 e。",
        checklist: ["會說、會拼 7 種飲料", "會用 Do you like…? 問，用 Yes, I do. / No, I don't. 回答", "會用 Does he/she like…? 問，回答時用 does / doesn't，主詞是 he、she 時 like 要加 s", "會念 e_e、ee、ea 的字"],
        sections: [
          { title: "Words 單字", html: words([["coffee", "咖啡"], ["cola", "可樂"], ["lemonade", "檸檬汁"], ["tea", "茶"], ["bubble tea", "珍珠奶茶"], ["hot chocolate", "熱可可"], ["soy milk", "豆漿"]]) },
          { title: "Sentences 句型", html: `
<ul>
  <li><b>問「你」</b>：Do you like cola? → Yes, I do. ／ No, I don't. I like soy milk.</li>
  <li><b>問「他、她」</b>：Does he like tea? → Yes, he does. ／ No, he doesn't. He likes coffee.</li>
  <li>Does she like bubble tea? → Yes, she does. ／ No, she doesn't. She likes lemonade.</li>
</ul>
<table><tr><th>主詞</th><th>問句開頭</th><th>回答</th><th>喜歡</th></tr>
<tr><td>I、you、we、they</td><td>Do</td><td>do / don't</td><td>like</td></tr>
<tr><td>he、she、名字（Ben）</td><td>Does</td><td>does / doesn't</td><td>like<b>s</b></td></tr></table>
<div class="box warn">易錯：問句用 Does 的時候，後面的 like 不加 s（Does he like tea?）；只有肯定句才加 s（He likes tea.）。</div>` },
          { title: "Talk & Read 對話和短文", html: `
${talk([["Ben", "It's hot today. Do you like cola?", "今天好熱。你喜歡可樂嗎？"], ["Lily", "No, I don't. I like lemonade.", "不，我不喜歡。我喜歡檸檬汁。"], ["Ben", "Does your brother like lemonade?", "你哥哥喜歡檸檬汁嗎？"], ["Lily", "No, he doesn't. He likes bubble tea.", "不，他不喜歡。他喜歡珍珠奶茶。"]])}
<div class="box">🍵 <b>文化小知識</b>：英國人喜歡喝下午茶，會搭配小蛋糕或三明治。喝茶時輕輕攪拌、小口喝，是有禮貌的做法。</div>` },
          { title: "Phonics 長母音 e", html: `
<ul>
  <li>長母音 e 念 [i]，和字母 E 的名字一樣</li>
  <li><b>e_e</b>：these、Pete、eve</li>
  <li><b>ee</b>：bee、tree、green、see</li>
  <li><b>ea</b>：tea、sea、eat、read</li>
</ul>
${FIG.fig(FIG.phonics, "同一個長母音，有好幾種拼法")}
<div class="box warn">提醒：同一個聲音 [i] 有不同拼法，拼字時要記清楚是 ee 還是 ea（tree 不是 trea）。</div>` }
        ],
        formulas: [
          { name: "問你", f: "Do you like cola? — Yes, I do. / No, I don't.", note: "" },
          { name: "問他、她", f: "Does he like tea? — Yes, he does. / No, he doesn't.", note: "He likes coffee.（肯定句 like 加 s）" }
        ]
      },
      {
        id: "5A-2", no: "Unit 2", title: "Let's Make Fruit Salad 水果", subject: "phys",
        summary: "水果的英文和單複數；用 How many … do you need? 問需要幾個；i_e、ie、igh 的長母音 i。",
        checklist: ["會說、會拼 7 種水果，知道一個和很多個的說法不同", "會用 How many apples do you need? 問，用 I need two apples. 回答", "主詞是 he、she 時用 does 問，回答用 needs", "會念 i_e、ie、igh 的字"],
        sections: [
          { title: "Words 單字", html: `
${words([["apple → apples", "蘋果"], ["banana → bananas", "香蕉"], ["grape → grapes", "葡萄"], ["guava → guavas", "芭樂"], ["papaya → papayas", "木瓜"], ["pineapple → pineapples", "鳳梨"], ["orange → oranges", "柳橙"]])}
<ul>
  <li>一個：<b>an</b> apple、<b>an</b> orange（母音開頭用 an）；<b>a</b> banana、<b>a</b> guava</li>
  <li>兩個以上：字尾加 <b>s</b>，two apples、five grapes</li>
</ul>` },
          { title: "Sentences 句型", html: `
<ul>
  <li>How many apples do you need? → I need two apples.</li>
  <li>How many oranges does she need? → She needs seven oranges.</li>
  <li>How many 後面接<b>複數名詞</b>：How many bananas …（不是 How many banana）</li>
</ul>
<div class="box warn">易錯：He / She 後面的 need 要加 s（She needs…），但 does 的問句裡 need 不加 s（How many … does she need?）。</div>` },
          { title: "Talk & Read 對話和短文", html: `
${talk([["Mom", "Let's make fruit salad. How many bananas do you need, Max?", "我們來做水果沙拉吧。Max，你需要幾根香蕉？"], ["Max", "I need three bananas.", "我需要三根香蕉。"], ["Mom", "How many grapes does Nina need?", "Nina 需要幾顆葡萄？"], ["Max", "She needs ten grapes. She likes grapes!", "她需要十顆葡萄。她喜歡葡萄！"]])}
<div class="box">🍍 <b>文化小知識</b>：臺灣是水果王國，鳳梨、芭樂、木瓜、芒果、香蕉都很有名。吃當季水果，新鮮又不浪費運送的能源。</div>` },
          { title: "Phonics 長母音 i", html: `
<ul>
  <li>長母音 i 念 [aɪ]，和字母 I 的名字一樣</li>
  <li><b>i_e</b>：kite、bike、nine、like</li>
  <li><b>ie</b>：pie、tie、lie</li>
  <li><b>igh</b>：high、night、light（gh 不發音）</li>
</ul>
<div class="box warn">易錯：igh 的 g、h 都不發音，night 念 [naɪt]。</div>` }
        ],
        formulas: [
          { name: "問你需要幾個", f: "How many apples do you need? — I need two apples.", note: "How many + 複數" },
          { name: "問他、她", f: "How many oranges does she need? — She needs seven oranges.", note: "" }
        ]
      },
      {
        id: "5A-3", no: "Unit 3", title: "A Fun Day 星期", subject: "phys",
        summary: "星期一到星期日的英文；用 What day is today? 和 Is today Monday? 問星期幾；o_e、oa、ow 的長母音 o。",
        checklist: ["會說、會拼星期日到星期六，知道第一個字母要大寫", "會用 What day is today? 問，用 It's Sunday. 回答", "會用 Is today Monday? 問，用 Yes, it is. / No, it's Tuesday. 回答", "會念 o_e、oa、ow 的字"],
        sections: [
          { title: "Words 單字", html: `${FIG.fig(FIG.week, "一週七天")}
${words([["Sunday", "星期日"], ["Monday", "星期一"], ["Tuesday", "星期二"], ["Wednesday", "星期三"], ["Thursday", "星期四"], ["Friday", "星期五"], ["Saturday", "星期六"]])}
<div class="box warn">易錯：Wednesday 的 d 不發音，念 [ˈwɛnzde]；Tuesday 和 Thursday 很像，Tu 是星期二、Thur 是星期四。</div>` },
          { title: "Sentences 句型", html: `
<ul>
  <li>What day is today? → It's Sunday.</li>
  <li>Is today Monday? → Yes, it is. ／ No, it's Tuesday.</li>
  <li>也可以說：Is it Monday today?</li>
</ul>
<div class="box warn">易錯：問「星期幾」用 What <b>day</b>；回答用 It's，不是 Today's is。</div>` },
          { title: "Talk & Read 對話和短文", html: `
${talk([["Nina", "What day is today?", "今天星期幾？"], ["Ben", "It's Friday.", "今天星期五。"], ["Nina", "Is tomorrow Saturday?", "明天是星期六嗎？"], ["Ben", "Yes, it is. Let's go to the park on Saturday!", "是的。我們星期六去公園吧！"]])}
<div class="example"><b>Read</b>：On Monday, I play basketball. On Wednesday, I read books. On Saturday, I visit my grandma. Sunday is my favorite day. I sleep late on Sunday!<br><span class="small muted">星期一我打籃球，星期三我看書，星期六我去看奶奶。星期日是我最喜歡的一天，星期日我可以睡晚一點！（「在星期幾」用 on：on Monday）</span></div>` },
          { title: "Phonics 長母音 o", html: `
<ul>
  <li>長母音 o 念 [o]，和字母 O 的名字一樣</li>
  <li><b>o_e</b>：home、rope、nose</li>
  <li><b>oa</b>：boat、coat、road</li>
  <li><b>ow</b>：snow、slow、bowl</li>
</ul>
<div class="box warn">注意：ow 也可能念 [aʊ]，例如 cow、how；這一課學的是念 [o] 的 ow。</div>` }
        ],
        formulas: [
          { name: "問星期幾", f: "What day is today? — It's Sunday.", note: "星期第一個字母大寫" },
          { name: "確認星期", f: "Is today Monday? — Yes, it is. / No, it's Tuesday.", note: "在星期幾用 on：on Monday" }
        ]
      },
      {
        id: "5A-4", no: "Unit 4", title: "My Favorite Subject 科目", subject: "phys",
        summary: "科目的英文；用 What's your favorite subject? 問最喜歡的科目；his / her 的用法；u_e、ue、ui 的長母音 u。",
        checklist: ["會說、會拼 8 個科目", "會用 What's your favorite subject? 問，用 My favorite subject is … 回答", "問別人時用 his（他的）/ her（她的）", "會念 u_e、ue、ui 的字"],
        sections: [
          { title: "Words 單字", html: words([["art", "美術"], ["Chinese", "國語"], ["English", "英語"], ["math", "數學"], ["music", "音樂"], ["PE", "體育"], ["science", "自然科學"], ["social studies", "社會"]]) + `<div class="box warn">易錯：Chinese、English 是語言，第一個字母一定大寫；math、art 等科目平常小寫。</div>` },
          { title: "Sentences 句型", html: `
<ul>
  <li>What's your favorite subject? → My favorite subject is English.</li>
  <li>What's his favorite subject? → His favorite subject is science.</li>
  <li>What's her favorite subject? → Her favorite subject is music.</li>
</ul>
<table><tr><th>人</th><th>……的</th></tr><tr><td>I 我</td><td>my 我的</td></tr><tr><td>you 你</td><td>your 你的</td></tr><tr><td>he 他</td><td>his 他的</td></tr><tr><td>she 她</td><td>her 她的</td></tr></table>
<div class="box warn">易錯：問 your 就用 My 回答；問 his 就用 His 回答，不是 He favorite subject。</div>` },
          { title: "Talk & Read 對話和短文", html: `
${talk([["Ben", "What's your favorite subject, Lily?", "Lily，你最喜歡的科目是什麼？"], ["Lily", "My favorite subject is art. I like to draw.", "我最喜歡美術。我喜歡畫畫。"], ["Ben", "What's Max's favorite subject?", "Max 最喜歡的科目是什麼？"], ["Lily", "His favorite subject is PE. He runs fast!", "他最喜歡體育。他跑得很快！"]])}` },
          { title: "Phonics 長母音 u", html: `
<ul>
  <li><b>u_e</b> 有兩種念法：[ju]（cute、mule）和 [u]（June、rule）</li>
  <li><b>ue</b>：blue、glue、true</li>
  <li><b>ui</b>：juice、fruit、suit</li>
</ul>
<div class="box warn">注意：cute 的 u 念 [ju]（像 you），June 的 u 念 [u]，兩種都是 u_e。</div>` }
        ],
        formulas: [
          { name: "最喜歡的科目", f: "What's your favorite subject? — My favorite subject is English.", note: "" },
          { name: "他、她的", f: "What's his / her favorite subject? — His / Her favorite subject is …", note: "my、your、his、her" }
        ]
      },
      {
        id: "5A-5", no: "Festival", title: "Chinese New Year 春節", subject: "chem",
        summary: "春節的習俗與相關英文。",
        checklist: ["會說 6 個和春節有關的英文", "知道春節的習俗，會說 Happy New Year!"],
        sections: [
          { title: "Chinese New Year 春節", html: `
${words([["firecrackers", "鞭炮"], ["lion dance", "舞獅"], ["lucky money", "紅包、壓歲錢"], ["rice cake", "年糕"], ["spring couplets", "春聯"], ["tangerines", "橘子"]])}
<ul>
  <li>過年前大掃除、貼春聯；除夕全家吃團圓飯，長輩給小孩紅包</li>
  <li>大家見面互相說 <b>Happy New Year!</b>（新年快樂）</li>
  <li>年糕、橘子都有吉祥的意思（步步高升、大吉大利）</li>
</ul>` }
        ],
        formulas: [{ name: "新年", f: "Happy New Year!", note: "lucky money 紅包" }]
      }
    ]
  },
  {
    id: "5B", name: "五年級下學期", short: "五下",
    chapters: [
      {
        id: "5B-0", no: "Get Ready", title: "大數字與世界地標", subject: "earth",
        summary: "一百到九百多的數字說法；認識世界知名地標的英文名稱。",
        checklist: ["會說 one hundred 到 nine hundred", "會說三位數，例如 two hundred and fifty"],
        sections: [
          { title: "Numbers 百位數字", html: `
<ul>
  <li>100 one hundred、200 two hundred、500 five hundred、900 nine hundred（hundred 不加 s）</li>
  <li>三位數：百位 + and + 後面兩位</li>
  <li>250 → two hundred and fifty；299 → two hundred and ninety-nine；405 → four hundred and five</li>
</ul>
<div class="box warn">易錯：two hundred 的 hundred 不加 s（不是 two hundreds）；兩位數的十位和個位中間要加連字號：ninety-nine。</div>` },
          { title: "Landmarks 世界地標", html: `
<ul>
  <li><b>Taipei 101</b>：臺北 101（臺灣）</li>
  <li><b>the Eiffel Tower</b>：艾菲爾鐵塔（法國）</li>
  <li><b>the Great Wall</b>：長城（中國）</li>
  <li><b>the Statue of Liberty</b>：自由女神像（美國）</li>
  <li><b>Big Ben</b>：大笨鐘（英國）</li>
</ul>` }
        ],
        formulas: [{ name: "三位數", f: "250 = two hundred and fifty", note: "hundred 不加 s" }]
      },
      {
        id: "5B-1", no: "Unit 1", title: "A Surprise for Jello 社區場所", subject: "phys",
        summary: "社區場所的英文；用 Where are you going? 和 Are you going to…? 問要去哪裡；be going to 的用法；bl、pl、gl、cl 的發音。",
        checklist: ["會說、會拼 8 個社區場所", "會用 Where are you going? 問，用 I'm going to the park. 回答", "會用 Are you going to the bakery? 問，用 Yes, I am. / No, I'm not. 回答", "會念 bl、pl、gl、cl 開頭的字"],
        sections: [
          { title: "Words 單字", html: `${FIG.fig(FIG.townFig, "大街兩旁的社區場所")}
${words([["bakery", "麵包店"], ["bank", "銀行"], ["bookstore", "書店"], ["hospital", "醫院"], ["park", "公園"], ["post office", "郵局"], ["restaurant", "餐廳"], ["supermarket", "超級市場"]])}` },
          { title: "Sentences 句型", html: `
<ul>
  <li>Where are you going? → I'm going to the park.</li>
  <li>Are you going to the bakery? → Yes, I am. ／ No, I'm not. I'm going to the bank.</li>
  <li>Where is he going? → He's going to the hospital.</li>
  <li><b>be going to</b> + 地方：表示「要去（某個地方）」；地方前面通常加 <b>the</b></li>
</ul>
<table><tr><th>主詞</th><th>be 動詞</th><th>縮寫</th></tr><tr><td>I</td><td>am</td><td>I'm</td></tr><tr><td>you、we、they</td><td>are</td><td>you're、we're、they're</td></tr><tr><td>he、she</td><td>is</td><td>he's、she's</td></tr></table>
<div class="box warn">易錯：Are you going…? 用 I am 回答（問 you 答 I），不是 Yes, you are。</div>` },
          { title: "Talk & Read 對話和短文", html: `
${talk([["Max", "Where are you going, Nina?", "Nina，你要去哪裡？"], ["Nina", "I'm going to the bookstore. I need a new dictionary.", "我要去書店。我需要一本新字典。"], ["Max", "Are you going to the bakery, too?", "你也要去麵包店嗎？"], ["Nina", "Yes, I am. I want some bread for breakfast.", "對，我要買早餐的麵包。"]])}` },
          { title: "Phonics bl、pl、gl、cl", html: `
<ul>
  <li>兩個子音連在一起，兩個聲音都要念出來，快速連在一起</li>
  <li><b>bl</b>：black、blue、block</li>
  <li><b>pl</b>：play、plane、plum</li>
  <li><b>gl</b>：glass、glue、glad</li>
  <li><b>cl</b>：class、clock、clap</li>
</ul>` }
        ],
        formulas: [
          { name: "要去哪裡", f: "Where are you going? — I'm going to the park.", note: "" },
          { name: "確認", f: "Are you going to the bakery? — Yes, I am. / No, I'm not.", note: "" }
        ]
      },
      {
        id: "5B-2", no: "Unit 2", title: "City Adventure 交通工具", subject: "phys",
        summary: "交通工具的英文；用 How can we get to…? 問怎麼去；by + 交通工具；br、pr、gr、cr 的發音。",
        checklist: ["會說、會拼 8 種交通工具", "會用 How can we get to the park? 問，用 We can get there by bike. 回答", "會用 Can we get to … by bus? 問，用 Yes, we can. / No, we can't. 回答", "會念 br、pr、gr、cr 開頭的字"],
        sections: [
          { title: "Words 單字", html: words([["bike", "腳踏車"], ["bus", "公車"], ["car", "汽車"], ["MRT", "捷運"], ["plane", "飛機"], ["scooter", "機車"], ["taxi", "計程車"], ["train", "火車"]]) },
          { title: "Sentences 句型", html: `
<ul>
  <li>How can we get to the park? → We can get there by bike.</li>
  <li>Can we get to the zoo by MRT? → Yes, we can. ／ No, we can't.</li>
  <li><b>by + 交通工具</b>：by bus、by train、by plane（中間不加 a 或 the）</li>
  <li>走路去：on foot</li>
</ul>
<div class="box warn">易錯：by bus 不是 by a bus；走路是 on foot，不是 by foot。</div>` },
          { title: "Talk & Read 對話和短文", html: `
${talk([["Ben", "How can we get to the museum?", "我們要怎麼去博物館？"], ["Lily", "We can get there by MRT. It's fast.", "我們可以搭捷運去，很快。"], ["Ben", "Can we get there by bike?", "我們可以騎腳踏車去嗎？"], ["Lily", "No, we can't. It's too far.", "不行，太遠了。"]])}
<div class="box">🚲 <b>生活小知識</b>：很多城市有共享單車，借了可以在別的站還，短距離騎車又環保又運動。</div>` },
          { title: "Phonics br、pr、gr、cr", html: `
<ul>
  <li><b>br</b>：bread、brown、bring</li>
  <li><b>pr</b>：prize、print、pretty</li>
  <li><b>gr</b>：green、grape、grass</li>
  <li><b>cr</b>：crab、cry、crayon</li>
</ul>` }
        ],
        formulas: [
          { name: "怎麼去", f: "How can we get to the park? — We can get there by bike.", note: "by + 交通工具；走路 on foot" },
          { name: "可以…去嗎", f: "Can we get to the zoo by MRT? — Yes, we can. / No, we can't.", note: "" }
        ]
      },
      {
        id: "5B-3", no: "Unit 3", title: "Clothes Shopping for a Wedding 衣物", subject: "phys",
        summary: "衣物的英文；用 How much is…? 和 How much are…? 問價錢；百位數字的價錢；tr、dr 的發音。",
        checklist: ["會說、會拼 8 種衣物", "會用 How much is the dress? 問，用 It's nine hundred dollars. 回答", "成雙成對的衣物（pants、shorts、sneakers、socks）用 are 和 They're", "會念 tr、dr 開頭的字"],
        sections: [
          { title: "Words 單字", html: `${FIG.fig(FIG.shopFig, "服飾店的衣物和價錢")}
${words([["dress", "洋裝"], ["skirt", "裙子"], ["sweater", "毛衣"], ["T-shirt", "T 恤"], ["pants", "長褲"], ["shorts", "短褲"], ["sneakers", "運動鞋"], ["socks", "襪子"]])}` },
          { title: "Sentences 句型", html: `
<ul>
  <li>How much is the dress? → It's nine hundred dollars.</li>
  <li>How much are the pants? → They're four hundred and fifty dollars.</li>
</ul>
<table><tr><th>衣物</th><th>問句</th><th>回答</th></tr>
<tr><td>一件：dress、skirt、sweater、T-shirt</td><td>How much <b>is</b> …?</td><td><b>It's</b> … dollars.</td></tr>
<tr><td>成雙、複數：pants、shorts、sneakers、socks</td><td>How much <b>are</b> …?</td><td><b>They're</b> … dollars.</td></tr></table>
<div class="box warn">易錯：pants、shorts 雖然只是「一件」褲子，英文仍然是複數，要用 are、They're。</div>` },
          { title: "Talk & Read 對話和短文", html: `
${talk([["Lily", "My aunt is getting married. I need a new dress.", "我阿姨要結婚了，我需要一件新洋裝。"], ["Clerk", "How about this pink dress?", "這件粉紅色洋裝怎麼樣？"], ["Lily", "It's pretty! How much is it?", "好漂亮！多少錢？"], ["Clerk", "It's eight hundred dollars.", "八百元。"]])}` },
          { title: "Phonics tr、dr", html: `
<ul>
  <li><b>tr</b>：tree、train、truck</li>
  <li><b>dr</b>：dress、drink、drum</li>
</ul>
<div class="box warn">提醒：tr 聽起來有點像「ㄔㄨ」、dr 有點像「ㄐㄨ」，但英文要把 t / d 和 r 都念出來。</div>` }
        ],
        formulas: [
          { name: "一件", f: "How much is the dress? — It's nine hundred dollars.", note: "" },
          { name: "複數、成雙", f: "How much are the pants? — They're four hundred and fifty dollars.", note: "pants、shorts、sneakers、socks" }
        ]
      },
      {
        id: "5B-4", no: "Unit 4", title: "School Trip 所有物", subject: "phys",
        summary: "隨身物品的英文；用 Whose … is it? 和 Whose … are they? 問是誰的；所有格 's；sp、st、sk 的發音。",
        checklist: ["會說、會拼 7 種隨身物品", "會用 Whose jacket is it? 問，用 It's Ben's jacket. 回答", "複數的東西（glasses）用 Whose glasses are they? / They're my glasses.", "會念 sp、st、sk 開頭的字"],
        sections: [
          { title: "Words 單字", html: words([["jacket", "夾克"], ["smartphone", "智慧型手機"], ["umbrella", "雨傘"], ["watch", "手錶"], ["water bottle", "水壺"], ["key", "鑰匙"], ["glasses", "眼鏡"]]) },
          { title: "Sentences 句型", html: `
<ul>
  <li>Whose jacket is it? → It's Ben's jacket. ／ It's my jacket.</li>
  <li>Whose glasses are they? → They're my glasses. ／ They're Lily's glasses.</li>
  <li><b>名字 + 's</b> 表示「誰的」：Ben's（Ben 的）、my mom's（我媽媽的）</li>
</ul>
<div class="box warn">易錯：Whose（誰的）和 Who's（誰是）念起來一樣，意思不同；glasses（眼鏡）是複數，要用 are、They're。</div>` },
          { title: "Talk & Read 對話和短文", html: `
${talk([["Teacher", "Whose umbrella is it?", "這是誰的雨傘？"], ["Max", "It's Nina's umbrella.", "是 Nina 的雨傘。"], ["Teacher", "Whose glasses are they?", "這是誰的眼鏡？"], ["Ben", "They're my glasses. Thank you!", "是我的眼鏡，謝謝！"]])}
<div class="box">🎒 <b>生活小知識</b>：出門校外教學前列一張清單（list），水壺、雨傘、外套……打包時一項一項打勾，就不會忘記帶。</div>` },
          { title: "Phonics sp、st、sk", html: `
<ul>
  <li><b>sp</b>：spoon、spider、sport</li>
  <li><b>st</b>：star、stop、student</li>
  <li><b>sk</b>：sky、skirt、skate</li>
</ul>` }
        ],
        formulas: [
          { name: "一個東西", f: "Whose jacket is it? — It's Ben's jacket.", note: "名字 + 's" },
          { name: "複數", f: "Whose glasses are they? — They're my glasses.", note: "" }
        ]
      },
      {
        id: "5B-5", no: "Festival", title: "Earth Day 地球日", subject: "chem",
        summary: "地球日和愛護地球的英文。",
        checklist: ["知道每年 4 月 22 日是地球日", "會說 reduce、reuse、recycle 等愛護地球的英文"],
        sections: [
          { title: "Earth Day 地球日", html: `
<ul>
  <li>每年 <b>4 月 22 日</b>是<b>地球日（Earth Day）</b>，提醒大家愛護地球</li>
</ul>
${words([["reduce", "減少（少用、少買）"], ["reuse", "重複使用"], ["recycle", "回收"], ["save water", "節約用水"], ["turn off the lights", "關燈"]])}
<div class="example">Reduce, reuse, recycle! Turn off the lights. Save water. Let's love our Earth!</div>` }
        ],
        formulas: [{ name: "3R", f: "reduce、reuse、recycle", note: "地球日：4 月 22 日" }]
      }
    ]
  }
  ] };
})();
