/*
 * Firebase 專案設定（專案 tw-lvup）。保持 null 時網站照舊只存在這台電腦。
 * 這幾個值不是密碼，放在網頁裡是 Firebase 的正常用法；資料安全靠 Firestore 安全規則（jhs/firebase/firestore.rules）。
 * 每個科目站都放一份，內容要相同（同一個 Firebase 專案），同一個帳號才能在各科共用。
 * 設定步驟見 jhs/firebase/設定說明.md。
 */
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyDrGTxMHLYkwNROSAYO-m0Gqew25o09Im0",
  authDomain: "tw-lvup.firebaseapp.com",
  projectId: "tw-lvup",
  storageBucket: "tw-lvup.firebasestorage.app",
  messagingSenderId: "308095064632",
  appId: "1:308095064632:web:f13e57b238adf5581524cd"
};
