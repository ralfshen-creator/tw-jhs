# LVUP 學習網

給孩子自學用的網站：依 108 課綱與孩子學校使用的課本版本，整理課程重點、圖解、測驗與錯題本。國中用翰林版；國小各科版本見 `es\README.md`。

## 結構

```
LVUP\                    網站根目錄（GitHub 儲存庫 tw-lvup）
├─ index.html            首頁：選擇學習階段
├─ es\                   國小高年級（五、六年級）。說明見 es\README.md
│   ├─ index.html        國小的科目總覽
│   ├─ Math\             數學學習站（康軒版五年級）
│   ├─ Science\          自然學習站（康軒版五年級）
│   ├─ Social\           社會學習站（康軒版五年級）
│   ├─ English\          英語學習站（康軒版五年級）
│   └─ Chinese\          國語學習站（南一版五年級）
├─ jhs\                  國中（七～九年級）。說明見 jhs\README.md
│   ├─ index.html        國中的科目總覽
│   ├─ Math\             數學學習站
│   ├─ Science\          自然科學學習站（生物、理化、地科）
│   └─ …                 其他科目的資料夾
```

## 共用的學習引擎

- 每個學習站的 `js/app.js`、`js/storage.js`、`js/cloud.js` 內容相同，改的時候要全部一起改（目前：`es\Math`、`es\Science`、`es\Social`、`es\English`、`es\Chinese`、`jhs\Math`、`jhs\Science\PhysChem_Learning`）。
- 科目差異寫在各站的 `data/site.js`：課本版本 `publisher`（預設翰林）、重點卡名稱 `formulasName`（預設「公式」）、有沒有會考 `capRange`（國小填 `null`）、學習紀錄前綴 `storagePrefix`。
- **學習紀錄的前綴不能重複**：國中數學 `ma.`、自然 `pc.`、國小數學 `esma.`、國小自然 `essc.`、國小社會 `esso.`、國小英語 `esen.`、國小國語 `esch.`。新增學習站時，也要把前綴加進首頁 `js\home-auth.js` 的 `SITE_PREFIXES`（登出時才會清掉）。

## 上線

整個儲存庫就是一個網站，首頁在根目錄。推到 GitHub 的 `main` 分支後即可部署（GitHub Pages 或 Netlify）。
