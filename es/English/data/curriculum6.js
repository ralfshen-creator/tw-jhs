/*
 * 國小英語課程資料（六年級上、下學期）。單元名稱、單字、句型、字母拼讀依 115 學年度康軒版六年級英語教學計畫（Wonder World 7、8）。
 * 對話、短文、例句都是本站自編，不是課本的故事或課文；人物（Ben、Lily、Max、Nina）是本站自己取的。
 */
(function () {
  const words = list => `<table><tr><th>英文</th><th>中文</th></tr>${list.map(w => `<tr><td><b>${w[0]}</b></td><td>${w[1]}</td></tr>`).join("")}</table>`;
  const talk = lines => `<div class="example">${lines.map(l => `<div><b>${l[0]}：</b>${l[1]}<br><span class="small muted">${l[2]}</span></div>`).join("")}</div>`;

  window.CURRICULUM.terms.push({
    id: "6A", name: "六年級上學期", short: "六上",
    chapters: [
      {
        id: "6A-1", no: "Unit 1", title: "Whale Watching 國家", subject: "phys",
        summary: "國家的英文；用 Where are you from? 和 Is he/she from…? 問別人來自哪裡；er、ir、ur 的發音。",
        checklist: ["會說、會拼 8 個國家", "國家名稱第一個字母要大寫，the UK、the USA 前面有 the", "會用 Is he/she from…? 問，用 Yes, he/she is. / No, he's/she's not. 回答", "會念 er、ir、ur 的字"],
        sections: [
          { title: "Words 單字", html: words([["Australia", "澳洲"], ["Canada", "加拿大"], ["France", "法國"], ["India", "印度"], ["Japan", "日本"], ["Taiwan", "臺灣"], ["the UK", "英國"], ["the USA", "美國"]]) },
          { title: "Sentences 句型", html: `
<ul>
  <li>Where are you from? → I'm from Taiwan.</li>
  <li>Is he from the USA? → Yes, he is. ／ No, he's not. He's from Canada.</li>
  <li>Is she from Japan? → Yes, she is. ／ No, she's not. She's from France.</li>
</ul>
<div class="box warn">易錯：國家名稱第一個字母一定大寫（Japan，不是 japan）；英國、美國要寫 the UK、the USA。he's = he is，she's = she is。</div>` },
          { title: "Talk & Read 對話和短文", html: `
${talk([["Ben", "Look! The new students are here.", "看！新同學來了。"], ["Lily", "Is the boy from the USA?", "那個男生來自美國嗎？"], ["Ben", "No, he's not. He's from Australia.", "不，他不是。他來自澳洲。"], ["Lily", "Is the girl from India?", "那個女生來自印度嗎？"], ["Ben", "Yes, she is.", "是的，她是。"]])}
<div class="box">🌏 <b>文化小知識</b>：每個國家都有自己的國旗。日本國旗是白底紅色圓形；加拿大國旗中間是一片紅色楓葉。</div>` },
          { title: "Phonics er、ir、ur", html: `
<ul>
  <li><b>er</b>、<b>ir</b>、<b>ur</b> 都念 [ɚ]，同一個聲音有三種拼法</li>
  <li>er：teacher、sister、water；ir：bird、girl、shirt；ur：nurse、turtle、purple</li>
</ul>
${FIG.fig(FIG.phonics6A, "六上的字母拼讀")}` }
        ],
        formulas: [
          { name: "來自哪裡", f: "Where are you from? — I'm from Taiwan.", note: "" },
          { name: "問他、她", f: "Is he from the USA? — Yes, he is. / No, he's not.", note: "He's from the UK." }
        ]
      },
      {
        id: "6A-2", no: "Unit 2", title: "Having a Cold 病症", subject: "phys",
        summary: "常見病症的英文；用 What's wrong? 問怎麼了；用 Does he/she have…? 問別人的病症；ar、or 的發音。",
        checklist: ["會說、會拼 8 種病症", "會用 What's wrong? 問，用 I have a headache. 回答", "主詞是 he、she 時用 has；問句用 Does…have…?", "會念 ar、or 的字"],
        sections: [
          { title: "Words 單字", html: words([["a cold", "感冒"], ["a cough", "咳嗽"], ["a fever", "發燒"], ["a headache", "頭痛"], ["a stomachache", "胃痛、肚子痛"], ["a toothache", "牙痛"], ["a runny nose", "流鼻水"], ["a sore throat", "喉嚨痛"]]) },
          { title: "Sentences 句型", html: `
<ul>
  <li>What's wrong? → I have a headache.</li>
  <li>Does he have a fever? → Yes, he does. ／ No, he doesn't. He has a cough.</li>
  <li>Does she have a toothache? → Yes, she does. ／ No, she doesn't. She has a sore throat.</li>
</ul>
<table><tr><th>主詞</th><th>肯定句</th><th>問句</th></tr>
<tr><td>I、you</td><td>I <b>have</b> a cold.</td><td>Do you have a cold?</td></tr>
<tr><td>he、she</td><td>He <b>has</b> a cold.</td><td>Does he <b>have</b> a cold?</td></tr></table>
<div class="box warn">易錯：問句用 Does 時，後面還是 have，不是 has（Does she have a fever?）。</div>` },
          { title: "Talk & Read 對話和短文", html: `
${talk([["Nurse", "What's wrong, Max?", "Max，你怎麼了？"], ["Max", "I have a headache and a sore throat.", "我頭痛，喉嚨也痛。"], ["Nurse", "Do you have a fever?", "你有發燒嗎？"], ["Max", "No, I don't. But my sister has a fever.", "沒有。但是我妹妹發燒了。"]])}
<div class="box">💡 <b>健康小提醒</b>：感冒時多喝水、多休息，咳嗽要遮住口鼻，勤洗手。</div>` },
          { title: "Phonics ar、or", html: `
<ul>
  <li><b>ar</b> 念 [ɑr]：car、farm、star、park、art</li>
  <li><b>or</b> 念 [ɔr]：fork、corn、horse、short、sport</li>
</ul>` }
        ],
        formulas: [
          { name: "怎麼了", f: "What's wrong? — I have a headache.", note: "" },
          { name: "問他、她", f: "Does he have a fever? — Yes, he does. / No, he doesn't.", note: "He has a cough." }
        ]
      },
      {
        id: "6A-3", no: "Unit 3", title: "From Farm to Table 食物", subject: "phys",
        summary: "食物的英文；用 Would you like some…? 有禮貌的詢問和回答；可數和不可數的食物；oi、oy 的發音。",
        checklist: ["會說、會拼 8 種食物", "會用 Would you like some…? 問，用 Yes, please. / No, thank you. 回答", "分得出可數（dumplings、sandwiches）和不可數（rice、soup）的食物", "會念 oi、oy 的字"],
        sections: [
          { title: "Words 單字", html: words([["pizza", "披薩"], ["rice", "米飯"], ["soup", "湯"], ["steak", "牛排"], ["dumplings", "水餃"], ["noodles", "麵"], ["sandwiches", "三明治"], ["French fries", "薯條"]]) },
          { title: "Sentences 句型", html: `
<ul>
  <li>Would you like some soup? → Yes, please. ／ No, thank you.</li>
  <li>What would you like? → I'd like some dumplings.（I'd = I would）</li>
  <li><b>不可數</b>：rice、soup，不能加 s，要數的時候說 a bowl of rice（一碗飯）</li>
  <li><b>可數</b>：dumplings、sandwiches、noodles、French fries 通常用複數</li>
</ul>
<div class="box warn">易錯：Would you like…? 回答要用 Yes, please. 或 No, thank you.，不要用 Yes, I would like.。rice 不能說 rices。</div>` },
          { title: "Talk & Read 對話和短文", html: `
${talk([["Lily", "Would you like some steak?", "你想要來點牛排嗎？"], ["Ben", "No, thank you. I'd like some noodles.", "不了，謝謝。我想要一些麵。"], ["Lily", "Would you like some soup, too?", "也要來點湯嗎？"], ["Ben", "Yes, please.", "好，麻煩了。"]])}
<div class="box">🌾 <b>從農場到餐桌</b>：米、麵粉來自農田，牛排來自牧場。珍惜食物、不浪費，是對農夫的尊重。</div>` },
          { title: "Phonics oi、oy", html: `
<ul>
  <li><b>oi</b>、<b>oy</b> 都念 [ɔɪ]</li>
  <li>oi 常在字中間：coin、oil、point；oy 常在字尾：boy、toy、joy</li>
</ul>` }
        ],
        formulas: [
          { name: "禮貌詢問", f: "Would you like some pizza? — Yes, please. / No, thank you.", note: "" },
          { name: "可數 / 不可數", f: "dumplings、sandwiches 可數；rice、soup 不可數", note: "" }
        ]
      },
      {
        id: "6A-4", no: "Unit 4", title: "A Call in the Morning 生活作息", subject: "phys",
        summary: "日常作息的英文；用 What time do you…? 和 Do you…at…? 問作息時間；第三人稱動詞加 s；ou、ow 的發音。",
        checklist: ["會說 8 個日常作息", "會用 What time do you get up? 問時間，用 at 說幾點", "主詞是 he、she 時動詞加 s（gets up、goes、has）", "會念 ou、ow 的字"],
        sections: [
          { title: "Words 單字", html: words([["get up", "起床"], ["have breakfast", "吃早餐"], ["go to school", "上學"], ["have lunch", "吃午餐"], ["go home", "回家"], ["have dinner", "吃晚餐"], ["do my homework", "寫作業"], ["go to bed", "上床睡覺"]]) },
          { title: "Sentences 句型", html: `
<ul>
  <li>What time do you get up? → I get up at six thirty.（6:30）</li>
  <li>Do you have lunch at twelve? → Yes, I do. ／ No, I don't. I have lunch at twelve thirty.</li>
  <li>What time does he go to bed? → He goes to bed at nine forty-five.</li>
</ul>
<table><tr><th>I、you</th><th>he、she</th></tr>
<tr><td>get up</td><td>get<b>s</b> up</td></tr><tr><td>go to school</td><td>go<b>es</b> to school</td></tr><tr><td>have lunch</td><td><b>has</b> lunch</td></tr><tr><td>do my homework</td><td><b>does his / her</b> homework</td></tr></table>
<div class="box warn">易錯：時間前面用 at（at seven）。主詞是 he、she 時，go 變 goes、have 變 has、do 變 does。</div>` },
          { title: "Talk & Read 對話和短文", html: `
${talk([["Mom", "Nina, it's seven. Get up!", "Nina，七點了。起床！"], ["Nina", "Oh no! I usually get up at six thirty.", "糟糕！我平常六點半起床。"], ["Mom", "Have breakfast quickly. You go to school at seven thirty.", "快吃早餐。你七點半要上學。"], ["Nina", "OK. Thanks, Mom!", "好的。謝謝媽媽！"]])}` },
          { title: "Phonics ou、ow", html: `
<ul>
  <li><b>ou</b>、<b>ow</b> 都可以念 [aʊ]</li>
  <li>ou：house、mouth、cloud；ow：cow、brown、down</li>
</ul>
<div class="box warn">提醒：ow 有時念 [o]（snow、yellow），這單元學的是念 [aʊ] 的 ow。</div>` }
        ],
        formulas: [
          { name: "問時間", f: "What time do you get up? — I get up at six thirty.", note: "" },
          { name: "第三人稱", f: "He gets up / goes to school / has lunch.", note: "" }
        ]
      },
      {
        id: "6A-5", no: "Festival", title: "Moon Festival 中秋節", subject: "chem",
        summary: "中秋節的習俗與相關英文。",
        checklist: ["會說 4 個和中秋節有關的英文", "知道中秋節的習俗"],
        sections: [
          { title: "Moon Festival 中秋節", html: `
${words([["moon cake", "月餅"], ["pomelo", "柚子"], ["full moon", "滿月"], ["have a barbecue", "烤肉"]])}
<ul>
  <li>中秋節在農曆八月十五日，月亮又大又圓</li>
  <li>家人團聚、賞月、吃月餅和柚子；在臺灣，很多人會烤肉</li>
</ul>` }
        ],
        formulas: [{ name: "中秋節", f: "Happy Moon Festival!", note: "moon cake 月餅、pomelo 柚子" }]
      }
    ]
  });

  window.CURRICULUM.terms.push({
    id: "6B", name: "六年級下學期", short: "六下",
    chapters: [
      {
        id: "6B-1", no: "Unit 1", title: "The Farewell 過去的時間", subject: "phys",
        summary: "表示過去時間的英文；be 動詞過去式 was、were；用 Where was he/she…? 問過去在哪裡；kn、wr、mb 不發音的字母。",
        checklist: ["會說 yesterday、last night、two days ago 等過去時間", "知道 am、is 的過去式是 was，are 的過去式是 were", "會用 Where was he/she yesterday? 問和回答", "知道 kn 的 k、wr 的 w、mb 的 b 不發音"],
        sections: [
          { title: "Words 單字", html: words([["yesterday", "昨天"], ["last night", "昨晚"], ["an hour ago", "一小時前"], ["two hours ago", "兩小時前"], ["two days ago", "兩天前"]]) },
          { title: "Sentences 句型", html: `
<ul>
  <li>Where was he yesterday? → He was at the park.</li>
  <li>Where were you last night? → I was at home.</li>
</ul>
<table><tr><th>主詞</th><th>現在</th><th>過去</th></tr>
<tr><td>I</td><td>am</td><td><b>was</b></td></tr><tr><td>he、she、it</td><td>is</td><td><b>was</b></td></tr><tr><td>you、we、they</td><td>are</td><td><b>were</b></td></tr></table>
<div class="box warn">易錯：句子裡有 yesterday、last night、ago 這些過去的時間，be 動詞要用 was / were。you 不論一個人或很多人都用 were。</div>` },
          { title: "Talk & Read 對話和短文", html: `
${talk([["Lily", "Where was Max two hours ago?", "Max 兩小時前在哪裡？"], ["Ben", "He was at school. He was in the music room.", "他在學校。他在音樂教室。"], ["Lily", "Where were you last night?", "你昨晚在哪裡？"], ["Ben", "I was at home. I was sad. Max is moving to Canada.", "我在家。我很難過。Max 要搬去加拿大了。"]])}` },
          { title: "Phonics kn、wr、mb", html: `
<ul>
  <li><b>kn</b> 的 k 不發音：knee、knife、know</li>
  <li><b>wr</b> 的 w 不發音：write、wrong、wrist</li>
  <li><b>mb</b> 的 b 不發音：lamb、climb、thumb</li>
</ul>
${FIG.fig(FIG.phonics6B, "六下的字母拼讀")}` }
        ],
        formulas: [
          { name: "be 過去式", f: "am / is → was；are → were", note: "" },
          { name: "問過去在哪", f: "Where was he yesterday? — He was at the park.", note: "" }
        ]
      },
      {
        id: "6B-2", no: "Unit 2", title: "Friends Forever 地點", subject: "phys",
        summary: "休閒場所的英文；用 Was he/she at…? 問過去是否在某處；f、ph、gh 都可以念 [f]。",
        checklist: ["會說、會拼 6 個場所", "會用 Was he/she at the museum two days ago? 問，用 Yes, he/she was. / No, he/she wasn't. 回答", "會念 f、ph、gh 念 [f] 的字"],
        sections: [
          { title: "Words 單字", html: words([["the library", "圖書館"], ["the museum", "博物館"], ["the coffee shop", "咖啡店"], ["the movie theater", "電影院"], ["the night market", "夜市"], ["the sports center", "運動中心"]]) },
          { title: "Sentences 句型", html: `
<ul>
  <li>Was he at the museum two days ago? → Yes, he was. ／ No, he wasn't. He was at the sports center.</li>
  <li>Were you at the night market last night? → Yes, I was. ／ No, I wasn't.</li>
</ul>
<div class="box warn">易錯：wasn't = was not，weren't = were not。地點前面用 at：at the library。</div>` },
          { title: "Talk & Read 對話和短文", html: `
${talk([["Nina", "Was Lily at the library yesterday?", "Lily 昨天在圖書館嗎？"], ["Ben", "No, she wasn't. She was at the movie theater with Max.", "不，她不在。她和 Max 在電影院。"], ["Nina", "Were you there, too?", "你也在那裡嗎？"], ["Ben", "Yes, I was. We are friends forever!", "是的，我也在。我們是永遠的好朋友！"]])}` },
          { title: "Phonics f、ph、gh", html: `
<ul>
  <li><b>f</b>、<b>ph</b>、<b>gh</b> 都可以念 [f]</li>
  <li>f：fish、five；ph：phone、photo；gh（在字尾）：laugh、enough</li>
</ul>
<div class="box warn">提醒：gh 不一定念 [f]，例如 night、light 的 gh 不發音。</div>` }
        ],
        formulas: [
          { name: "過去是否在", f: "Was he at the museum? — Yes, he was. / No, he wasn't.", note: "" }
        ]
      },
      {
        id: "6B-3", no: "Unit 3", title: "A New Friend 休閒活動", subject: "phys",
        summary: "休閒活動的英文；用 What do you like to do in your free time? 問喜歡做什麼；hard c 和 soft c。",
        checklist: ["會說 7 種休閒活動", "會用 What do you like to do in your free time? 問，用 I like to… 回答", "主詞是 he、she 時用 likes；問句用 Does…like to…?", "知道 c 在 e、i、y 前面常念 [s]"],
        sections: [
          { title: "Words 單字", html: words([["listen to music", "聽音樂"], ["play basketball", "打籃球"], ["watch TV", "看電視"], ["go camping", "去露營"], ["go hiking", "去健行"], ["go shopping", "去購物"], ["go swimming", "去游泳"]]) },
          { title: "Sentences 句型", html: `
<ul>
  <li>What do you like to do in your free time? → I like to go hiking.</li>
  <li>Do you like to go camping in your free time? → Yes, I do. ／ No, I don't. I like to watch TV.</li>
  <li>What does she like to do? → She likes to go swimming.</li>
</ul>
<div class="box warn">易錯：like to 後面接原形動詞（like to go，不是 like to goes）；主詞是 he、she 時，是 like 加 s：She likes to…。</div>` },
          { title: "Talk & Read 對話和短文", html: `
${talk([["Max", "Hi! I'm Max. What do you like to do in your free time?", "嗨！我是 Max。你空閒時喜歡做什麼？"], ["Amy", "I like to go hiking. Do you like to go hiking?", "我喜歡去健行。你喜歡健行嗎？"], ["Max", "No, I don't. I like to play basketball.", "不，我不喜歡。我喜歡打籃球。"], ["Amy", "Let's play basketball this Sunday!", "這個星期日一起打籃球吧！"]])}` },
          { title: "Phonics hard c、soft c", html: `
<ul>
  <li><b>hard c</b> 念 [k]：cat、cup、cake、corn</li>
  <li><b>soft c</b> 念 [s]：city、face、rice、pencil（c 在 e、i、y 前面）</li>
</ul>` }
        ],
        formulas: [
          { name: "空閒時", f: "What do you like to do in your free time? — I like to go hiking.", note: "" },
          { name: "他、她", f: "She likes to go swimming.", note: "Does she like to…?" }
        ]
      },
      {
        id: "6B-4", no: "Unit 4", title: "Kevin's Dream Job 職業", subject: "phys",
        summary: "職業的英文；用 What do you want to be? 和 Do you want to be…? 問未來的夢想；a 和 an；hard g 和 soft g。",
        checklist: ["會說、會拼 7 種職業", "會用 What do you want to be? 問，用 I want to be… 回答", "母音開頭的職業前面用 an（an artist、an engineer）", "知道 g 在 e、i、y 前面常念 [dʒ]"],
        sections: [
          { title: "Words 單字", html: words([["an artist", "藝術家"], ["an engineer", "工程師"], ["a dentist", "牙醫"], ["a singer", "歌手"], ["a writer", "作家"], ["a basketball player", "籃球員"], ["a police officer", "警察"]]) },
          { title: "Sentences 句型", html: `
<ul>
  <li>What do you want to be? → I want to be a dentist.</li>
  <li>Do you want to be a writer? → Yes, I do. ／ No, I don't. I want to be a basketball player.</li>
  <li>What does he want to be? → He wants to be an engineer.</li>
</ul>
<div class="box warn">易錯：母音（a、e、i、o、u）發音開頭的字前面用 an：an artist、an engineer；其他用 a：a singer。</div>` },
          { title: "Talk & Read 對話和短文", html: `
${talk([["Lily", "What do you want to be, Ben?", "Ben，你想當什麼？"], ["Ben", "I want to be an engineer. I like to make robots.", "我想當工程師。我喜歡做機器人。"], ["Lily", "Cool! I want to be a writer. I like to write stories.", "好酷！我想當作家。我喜歡寫故事。"]])}
<div class="box">💡 <b>想一想</b>：你喜歡做什麼事？哪些職業會用到這個興趣？</div>` },
          { title: "Phonics hard g、soft g", html: `
<ul>
  <li><b>hard g</b> 念 [g]：go、game、bag</li>
  <li><b>soft g</b> 念 [dʒ]：giant、page、orange、giraffe（g 在 e、i、y 前面常念 [dʒ]）</li>
</ul>
<div class="box warn">提醒：也有例外，例如 girl、get 的 g 在 i、e 前面還是念 [g]。</div>` }
        ],
        formulas: [
          { name: "夢想職業", f: "What do you want to be? — I want to be a dentist.", note: "" },
          { name: "a / an", f: "an artist、an engineer；a singer、a writer", note: "" }
        ]
      }
    ]
  });
})();
