/*
 * Firebase 專案設定。填好之後網站才會出現登入功能；保持 null 時網站照舊只存在這台電腦。
 * 這幾個值不是密碼，放在網頁裡是 Firebase 的正常用法；資料安全靠 Firestore 安全規則（TW_JHS/firebase/firestore.rules）。
 * 每個科目站都放一份，內容要相同（同一個 Firebase 專案），同一個帳號才能在各科共用。
 * 設定步驟見 TW_JHS/firebase/設定說明.md。
 */
window.FIREBASE_CONFIG = null;
