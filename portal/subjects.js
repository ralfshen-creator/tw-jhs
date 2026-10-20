/*
 * 總入口的科目清單（依 108 課綱國中部定課程的領域排列，只列本站要做的科目）。
 * 2026-10-12 依家長決定拿掉：本土語文、音樂、視覺藝術、表演藝術、家政、童軍、輔導、生活科技、體育
 * （資料夾移到 Ralf_Claude\TW_JHS_removed_20261012\，要加回來時搬回去並在這裡補上那一科）。
 * 新科目做好時：把 status 改成 "ready"，並填入 href（相對於 TW_JHS\ 的路徑）。
 * status：ready 已完成、wip 製作中、todo 尚未開始
 */
window.PORTAL = {
  domains: [
    { name: "語文", icon: "📖", subjects: [
      { name: "國語文", folder: "Chinese", grades: "七～九年級", exam: "國文＋寫作測驗", status: "todo" },
      { name: "英語文", folder: "English", grades: "七～九年級", exam: "英語（閱讀＋聽力）", status: "todo" }
    ]},
    { name: "數學", icon: "📐", subjects: [
      { name: "數學", folder: "Math", grades: "七～九年級", exam: "數學", status: "ready", href: "Math/index.html", note: "翰林版七上～九下 24 章、185 題" }
    ]},
    { name: "社會", icon: "🌏", subjects: [
      { name: "歷史", folder: "Social/History", grades: "七～九年級", exam: "社會", status: "todo" },
      { name: "地理", folder: "Social/Geography", grades: "七～九年級", exam: "社會", status: "todo" },
      { name: "公民與社會", folder: "Social/Civics", grades: "七～九年級", exam: "社會", status: "todo" }
    ]},
    { name: "自然科學", icon: "🔬", subjects: [
      { name: "生物", folder: "Science/PhysChem_Learning", href: "Science/PhysChem_Learning/index.html#/lessons", grades: "七年級", exam: "自然", status: "ready",
        note: "七上～七下 11 章、103 題（含其他版本補充教材，在自然科學學習站裡）" },
      { name: "理化（物理、化學）", folder: "Science/PhysChem_Learning", href: "Science/PhysChem_Learning/index.html", grades: "八、九年級", exam: "自然", status: "ready",
        note: "課程、圖解、模擬實驗、600 多題題庫（和生物、地科同一個網站）" },
      { name: "地球科學", folder: "Science/PhysChem_Learning", href: "Science/PhysChem_Learning/index.html#/lessons", grades: "九年級", exam: "自然", status: "ready",
        note: "九上第 5～7 章、九下第 3～4 章、51 題（含其他版本補充教材，在自然科學學習站裡）" }
    ]},
    { name: "科技", icon: "💻", subjects: [
      { name: "資訊科技", folder: "Technology/Info_Tech", grades: "七～九年級", exam: "", status: "todo" }
    ]},
    { name: "健康與體育", icon: "🏃", subjects: [
      { name: "健康教育", folder: "Health_PE/Health", grades: "七～九年級", exam: "", status: "todo" }
    ]}
  ]
};
