/*
 * 國小高年級入口的科目清單。版本依孩子學校目前使用的課本（2026-10 家長提供）。
 * 新科目做好時：把 status 改成 "ready"，並填入 href（相對於 es\ 的路徑）。
 * status：ready 已完成、wip 製作中、todo 尚未開始
 */
window.PORTAL = {
  domains: [
    { name: "語文", icon: "📖", subjects: [
      { name: "國語", folder: "Chinese", grades: "五年級", publisher: "南一", status: "todo" },
      { name: "英語", folder: "English", grades: "五年級", publisher: "康軒", status: "todo" }
    ]},
    { name: "數學", icon: "📐", subjects: [
      { name: "數學", folder: "Math", grades: "五年級", publisher: "康軒", status: "ready", href: "Math/index.html", note: "五上、五下共 20 個單元、180 題" }
    ]},
    { name: "社會", icon: "🌏", subjects: [
      { name: "社會", folder: "Social", grades: "五年級", publisher: "康軒", status: "todo" }
    ]},
    { name: "自然科學", icon: "🔬", subjects: [
      { name: "自然", folder: "Science", grades: "五年級", publisher: "康軒", status: "todo" }
    ]}
  ]
};
