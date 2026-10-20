/*
 * 雲端帳號與同步（Firebase）。
 * - js/firebase-config.js 沒有填設定時，整個功能關閉，網站照舊只把紀錄存在這台電腦。
 * - 登入方式：Google，或電子郵件＋密碼（可寄信重設密碼）。密碼由 Firebase 保管，網站碰不到。
 * - 雲端位置：users/{uid}/sites/{站代號}/keys/{紀錄名稱}，安全規則只允許本人讀寫（TW_JHS/firebase/firestore.rules）。
 * - 本機紀錄會標記是哪個帳號的（{前綴}owner），避免同學共用電腦時把別人的紀錄併進自己的帳號。
 * 這個檔案在每個科目站各放一份，內容相同；改的時候要一起改。
 */
(function () {
  const CFG = window.FIREBASE_CONFIG;
  const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
  const SITE_ID = Store.PREFIX.replace(/\.$/, "");
  const OWNER_KEY = Store.PREFIX + "owner";
  const S = { enabled: !!(CFG && CFG.apiKey), loading: true, user: null, status: "", error: "", info: "", tab: "login", lastSync: null };
  let auth = null, db = null, timer = null;
  const pending = new Set();

  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $app = () => document.getElementById("app");
  const onAccountPage = () => /^#\/account/.test(location.hash);

  function loadScript(src) {
    return new Promise((ok, bad) => {
      const s = document.createElement("script");
      s.src = src; s.onload = ok; s.onerror = () => bad(new Error("load " + src));
      document.head.appendChild(s);
    });
  }

  async function init() {
    updateNav();
    if (!S.enabled) { S.loading = false; return; }
    try {
      if (typeof firebase === "undefined") {
        await loadScript(SDK + "firebase-app-compat.js");
        await Promise.all([loadScript(SDK + "firebase-auth-compat.js"), loadScript(SDK + "firebase-firestore-compat.js")]);
      }
      if (!firebase.apps.length) firebase.initializeApp(CFG);
      auth = firebase.auth();
      auth.languageCode = "zh-TW";        // 驗證信、重設密碼信用中文
      db = firebase.firestore();
      auth.getRedirectResult().catch(showError);
      auth.onAuthStateChanged(onUser);
    } catch (e) {
      S.enabled = false; S.loading = false;
      S.error = "雲端帳號功能載入失敗（可能沒有網路）。網站仍可正常使用，紀錄會先存在這台電腦。";
      refresh();
    }
  }

  // ================= 同步 =================
  const keysCol = uid => db.collection("users").doc(uid).collection("sites").doc(SITE_ID).collection("keys");

  async function onUser(user) {
    S.loading = false;
    if (user && !S.user) { S.error = ""; S.info = ""; }   // 換了登入狀態，舊的提示訊息不再適用
    S.user = user;
    if (user) {
      try { await pullAndMerge(user); } catch (e) { showError(e); }
    }
    refresh();
  }

  // 登入時：把雲端紀錄拿下來，和這台電腦的紀錄合併，再把合併結果傳上去
  async function pullAndMerge(user) {
    S.status = "同步中…"; refreshStatus();
    const snap = await keysCol(user.uid).get();
    const cloud = {};
    snap.forEach(d => { try { cloud[d.id] = JSON.parse(d.data().v); } catch (e) { /* 壞掉的那一筆略過 */ } });

    const owner = localStorage.getItem(OWNER_KEY);
    let useLocal = owner === user.uid;
    if (!owner && Store.hasProgress()) {
      useLocal = confirm(`這台電腦上有登入前的學習紀錄。\n要把它併入帳號 ${user.email || ""} 嗎？\n\n按「取消」：改用帳號裡的紀錄，這台電腦上登入前的紀錄會清除。`);
    }

    const changed = [];
    Store.SYNC_KEYS.forEach(k => {
      const c = cloud[k] === undefined ? null : cloud[k];
      const merged = merge(k, useLocal ? Store.raw(k) : null, c);
      if (merged == null) { Store.rawRemove(k); return; }
      Store.rawSet(k, merged);
      if (JSON.stringify(merged) !== JSON.stringify(c)) changed.push(k);
    });
    if (!useLocal) Store.clearSession();
    localStorage.setItem(OWNER_KEY, user.uid);
    changed.forEach(k => pending.add(k));
    await flush();
    if (!pending.size) { S.status = "已同步"; S.lastSync = new Date(); }
    rerenderPage();
  }

  // 兩邊都有資料時怎麼合併：作答紀錄、題目取聯集；錯題本、閱讀進度取比較新的；統計取作答次數多的
  function merge(k, a, b) {
    if (a == null) return b;
    if (b == null) return a;
    const byKey = (list, keyOf) => { const m = new Map(); list.forEach(x => { if (x) m.set(keyOf(x), x); }); return Array.from(m.values()); };
    const newer = (x, y, t) => { const o = Object.assign({}, y); Object.keys(x).forEach(id => { if (!o[id] || String(t(x[id]) || "") >= String(t(o[id]) || "")) o[id] = x[id]; }); return o; };
    switch (k) {
      case "attempts":
        return byKey(b.concat(a), x => x.date + "|" + (x.title || "")).sort((x, y) => (x.date < y.date ? -1 : 1)).slice(-300);
      case "imported": case "batches":
        return byKey(b.concat(a), x => x.id);
      case "wrong": return newer(a, b, w => w.last);
      case "visits": return newer(a, b, v => v.last);
      case "read": return newer(a, b, t => t);
      case "qstats": {
        const o = Object.assign({}, b);
        Object.keys(a).forEach(id => { if (!o[id] || (a[id].seen || 0) >= (o[id].seen || 0)) o[id] = a[id]; });
        return o;
      }
      default: return a;   // 年級設定、模擬實驗設定：用這台電腦目前的
    }
  }

  Store.onChange = function (k) {
    if (!S.user || Store.SYNC_KEYS.indexOf(k) < 0) return;
    pending.add(k);
    S.status = "等待同步…"; refreshStatus();
    clearTimeout(timer);
    timer = setTimeout(flush, 1500);
  };

  async function flush() {
    clearTimeout(timer);
    if (!S.user || !pending.size) return;
    const uid = S.user.uid, keys = Array.from(pending);
    pending.clear();
    const col = keysCol(uid), batch = db.batch();
    // 站的那一層也寫一筆，刪除帳號時才列得出所有科目
    batch.set(db.collection("users").doc(uid).collection("sites").doc(SITE_ID), { updated: firebase.firestore.FieldValue.serverTimestamp() });
    keys.forEach(k => {
      const v = Store.raw(k);
      if (v == null) batch.delete(col.doc(k));
      else batch.set(col.doc(k), { v: JSON.stringify(v), t: firebase.firestore.FieldValue.serverTimestamp() });
    });
    try {
      await batch.commit();
      S.status = "已同步"; S.lastSync = new Date(); S.error = "";
    } catch (e) {
      keys.forEach(k => pending.add(k));
      S.status = "還有紀錄沒同步，有網路時會自動再試";
      showError(e, true);
      clearTimeout(timer);
      timer = setTimeout(flush, 30000);
    }
    refreshStatus();
  }

  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flush(); });
  window.addEventListener("online", () => flush());

  // ================= 帳號動作 =================
  const MSG = {
    "auth/invalid-email": "電子郵件格式不對。",
    "auth/missing-password": "請輸入密碼。",
    "auth/user-not-found": "電子郵件或密碼不對。",
    "auth/wrong-password": "電子郵件或密碼不對。",
    "auth/invalid-credential": "電子郵件或密碼不對。",
    "auth/invalid-login-credentials": "電子郵件或密碼不對。",
    "auth/email-already-in-use": "這個電子郵件已經註冊過了，請直接登入；忘記密碼可以按「忘記密碼」。",
    "auth/weak-password": "密碼太簡單，請至少 8 個字元。",
    "auth/too-many-requests": "嘗試太多次了，請過幾分鐘再試。",
    "auth/network-request-failed": "連不上網路，請確認網路後再試。",
    "auth/popup-closed-by-user": "登入視窗被關掉了，沒有登入。",
    "auth/cancelled-popup-request": "登入視窗被關掉了，沒有登入。",
    "auth/unauthorized-domain": "這個網址還沒加入 Firebase 的「授權網域」，請家長到 Firebase 主控台加入。",
    "auth/operation-not-allowed": "這種登入方式還沒在 Firebase 開啟。",
    "auth/account-exists-with-different-credential": "這個電子郵件已經用另一種方式註冊過，請改用原本的方式登入。",
    "auth/requires-recent-login": "為了安全，請先登出、重新登入一次，再做這個動作。",
    "permission-denied": "雲端拒絕存取（安全規則不允許）。",
    "unavailable": "暫時連不上雲端，紀錄先存在這台電腦，等有網路會再同步。"
  };
  function showError(e, keepPage) {
    const code = e && e.code ? String(e.code) : "";
    S.error = MSG[code] || ("發生錯誤：" + (e && e.message ? e.message : e));
    if (/exceeds|too large|maximum/i.test(e && e.message || "")) S.error = "有一筆紀錄太大（通常是匯入的題目含很多圖片），沒辦法同步到雲端；這台電腦上的紀錄不受影響。";
    S.info = "";
    if (!keepPage) refresh(); else refreshStatus();
  }
  const say = info => { S.info = info; S.error = ""; refresh(); };

  async function googleLogin() {
    const p = new firebase.auth.GoogleAuthProvider();
    p.setCustomParameters({ prompt: "select_account" });   // 共用電腦時每次都讓人選帳號
    try { await auth.signInWithPopup(p); }
    catch (e) {
      if (e.code === "auth/popup-blocked" || e.code === "auth/operation-not-supported-in-this-environment") await auth.signInWithRedirect(p);
      else showError(e);
    }
  }

  async function emailLogin(email, pw) {
    try { await auth.signInWithEmailAndPassword(email, pw); } catch (e) { showError(e); }
  }

  async function register(email, pw, pw2) {
    if (pw.length < 8) return showError({ code: "auth/weak-password" });
    if (pw !== pw2) { S.error = "兩次輸入的密碼不一樣。"; return refresh(); }
    try {
      const cred = await auth.createUserWithEmailAndPassword(email, pw);
      await cred.user.sendEmailVerification();
      S.info = `註冊成功！已寄一封驗證信到 ${email}，點信裡的連結完成驗證（找不到請看垃圾郵件）。`; refresh();
    } catch (e) { showError(e); }
  }

  async function resetPassword(email) {
    if (!email) { S.error = "請先在上面填電子郵件，再按「忘記密碼」。"; return refresh(); }
    try {
      await auth.sendPasswordResetEmail(email);
      say(`如果 ${email} 有註冊，會收到一封重設密碼的信，點信裡的連結設定新密碼（找不到請看垃圾郵件）。`);
    } catch (e) { showError(e); }
  }

  async function logout() {
    await flush();
    if (pending.size && !confirm("還有紀錄沒有同步到雲端（可能沒有網路）。現在登出，這些紀錄會遺失。確定要登出？")) return;
    await auth.signOut();
    // 紀錄都在雲端了，登出後把這台電腦的清掉，下一個人用才不會看到
    clearLocal();
    S.info = "已登出，這台電腦上的紀錄已清除；下次登入會從雲端拿回來。"; S.error = "";
    refresh(); rerenderPage();
  }

  function clearLocal() {
    pending.clear();
    Store.SYNC_KEYS.forEach(k => Store.rawRemove(k));
    Store.clearSession();
    localStorage.removeItem(OWNER_KEY);
  }

  async function deleteAccount() {
    const u = S.user;
    if (Date.now() - new Date(u.metadata.lastSignInTime).getTime() > 5 * 60 * 1000) {
      S.error = "為了安全，刪除帳號前請先登出、再重新登入一次（5 分鐘內），然後回來按刪除。"; return refresh();
    }
    if (!confirm(`確定要刪除帳號 ${u.email || ""}？\n帳號和雲端上「所有科目」的學習紀錄都會永久刪除，無法復原。`)) return;
    try {
      const sites = await db.collection("users").doc(u.uid).collection("sites").get();
      for (const s of sites.docs) {
        const keys = await s.ref.collection("keys").get();
        const b = db.batch();
        keys.forEach(d => b.delete(d.ref));
        b.delete(s.ref);
        await b.commit();
      }
      await u.delete();
      clearLocal();
      say("帳號和雲端紀錄都已刪除。");
      rerenderPage();
    } catch (e) { showError(e); }
  }

  // ================= 畫面 =================
  function updateNav() {
    const a = document.getElementById("accountLink");
    if (!a) return;
    a.textContent = S.user ? "👤 " + ((S.user.email || "已登入").split("@")[0]) : "👤 登入";
    a.title = S.user ? "已登入：" + (S.user.email || "") : "登入後，學習紀錄可以在不同電腦、手機上同步";
  }

  function refresh() { updateNav(); if (onAccountPage()) view($app()); }
  function refreshStatus() { const el = document.getElementById("cloudStatus"); if (el) el.textContent = statusText(); }
  function statusText() {
    if (!S.user) return "";
    return (S.status || "已登入") + (S.lastSync ? `（${S.lastSync.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}）` : "");
  }
  // 雲端紀錄合併進來之後，重畫目前這一頁（作答中的測驗頁不打斷）
  function rerenderPage() {
    if (onAccountPage() || /^#\/quiz\/run/.test(location.hash)) return;
    if (window.App && window.App.route) window.App.route();
  }

  function msgs() {
    return (S.error ? `<div class="cloud-msg bad">${esc(S.error)}</div>` : "") + (S.info ? `<div class="cloud-msg ok">${esc(S.info)}</div>` : "");
  }

  const PRIVACY = `<details class="cloud-privacy"><summary>登入後存了哪些資料？</summary>
<ul><li>你的電子郵件（用 Google 登入時還有 Google 帳號的名稱）。</li>
<li>學習紀錄：作答紀錄、錯題本、閱讀進度、年級設定、你自己匯入的題目。</li>
<li>這些資料只有你自己的帳號讀得到，其他同學看不到。</li>
<li>不想用了可以在這一頁「刪除帳號」，帳號和雲端紀錄會一起刪掉。</li></ul></details>`;

  function view(el) {
    if (!S.enabled) {
      el.innerHTML = `<h1>帳號</h1>${msgs()}<section class="card"><p>雲端帳號功能還沒開通。</p>
<p class="muted">現在學習紀錄只存在這台電腦的瀏覽器裡。換電腦前，請到「題庫 / 匯入」備份。</p></section>`;
      return;
    }
    if (S.loading) { el.innerHTML = `<h1>帳號</h1><section class="card"><p class="muted">載入中…</p></section>`; return; }
    if (S.user) {
      const u = S.user;
      const google = (u.providerData || []).some(p => p && p.providerId === "google.com");
      el.innerHTML = `<h1>帳號</h1>${msgs()}
<section class="card">
  <p>已登入：<b>${esc(u.email || "")}</b>${google ? "（Google）" : ""}</p>
  ${!google && !u.emailVerified ? `<p class="muted">電子郵件還沒驗證。驗證後，忘記密碼時才收得到重設信。 <button class="btn small ghost" data-cloud="verify">重寄驗證信</button></p>` : ""}
  <p>同步狀態：<span id="cloudStatus">${esc(statusText())}</span></p>
  <p class="muted">作答紀錄、錯題本、閱讀進度會自動存到雲端。在別的電腦或手機登入同一個帳號，就能接著用。</p>
  <div class="cloud-actions"><button class="btn" data-cloud="sync">立即同步</button><button class="btn ghost" data-cloud="logout">登出</button></div>
  <p class="muted">共用電腦（例如學校、圖書館）用完記得登出。登出後這台電腦上的紀錄會清除，資料仍保存在雲端。</p>
</section>
<section class="card">${PRIVACY}
  <p><button class="btn small danger" data-cloud="delete">刪除帳號</button></p></section>`;
      return;
    }
    const reg = S.tab === "register";
    el.innerHTML = `<h1>${reg ? "註冊帳號" : "登入"}</h1>${msgs()}
<section class="card cloud-box">
  <p class="muted">登入後，學習紀錄會存到雲端，在不同電腦、手機都能接著用。不登入也可以照常使用。</p>
  <button class="btn cloud-google" data-cloud="google">使用 Google 帳號${reg ? "註冊" : "登入"}</button>
  <div class="cloud-or">或用電子郵件</div>
  <form id="cloudForm" autocomplete="on">
    <label>電子郵件<input type="email" id="cEmail" autocomplete="email" required></label>
    <label>密碼${reg ? "（至少 8 個字元）" : ""}<input type="password" id="cPw" autocomplete="${reg ? "new-password" : "current-password"}" required></label>
    ${reg ? `<label>再輸入一次密碼<input type="password" id="cPw2" autocomplete="new-password" required></label>` : ""}
    <button class="btn" type="submit">${reg ? "註冊" : "登入"}</button>
    ${reg ? "" : `<button class="btn ghost" type="button" data-cloud="reset">忘記密碼</button>`}
  </form>
  <p class="cloud-switch">${reg ? `已經有帳號了？<a href="#/account" data-cloud="tab-login">登入</a>` : `還沒有帳號？<a href="#/account" data-cloud="tab-register">註冊一個</a>`}</p>
</section>
<section class="card">${PRIVACY}</section>`;
  }

  document.addEventListener("submit", e => {
    if (e.target.id !== "cloudForm") return;
    e.preventDefault();
    const email = document.getElementById("cEmail").value.trim(), pw = document.getElementById("cPw").value;
    if (S.tab === "register") register(email, pw, document.getElementById("cPw2").value);
    else emailLogin(email, pw);
  });

  document.addEventListener("click", e => {
    const t = e.target.closest("[data-cloud]");
    if (!t) return;
    const a = t.dataset.cloud;
    if (a.indexOf("tab-") === 0) { e.preventDefault(); S.tab = a.slice(4); S.error = S.info = ""; refresh(); return; }
    if (!auth) return;
    if (a === "google") googleLogin();
    else if (a === "reset") resetPassword((document.getElementById("cEmail") || {}).value ? document.getElementById("cEmail").value.trim() : "");
    else if (a === "logout") logout();
    else if (a === "sync") { S.error = S.info = ""; pullAndMerge(S.user).catch(e2 => showError(e2)); }
    else if (a === "verify") S.user.sendEmailVerification().then(() => say("驗證信已寄出，找不到請看垃圾郵件。"), showError);
    else if (a === "delete") deleteAccount();
  });

  window.Cloud = { view, state: S };
  init();
})();
