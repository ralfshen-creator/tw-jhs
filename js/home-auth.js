/*
 * LVUP 首頁的「存檔點」：在首頁登入或註冊。
 * Firebase 的登入狀態是整個網域共用的，所以在這裡登入後，各科學習站也會是登入狀態，
 * 學習紀錄的同步仍由各站的 js/cloud.js 負責（首頁不碰紀錄內容，只在登出時清掉本人的本機紀錄）。
 * 設定值沿用 jhs/Math/js/firebase-config.js（在 index.html 載入）。
 */
(function () {
  const CFG = window.FIREBASE_CONFIG;
  const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
  // 各學習站的 localStorage 前綴；新增學習站時要補上
  const SITE_PREFIXES = ["ma.", "pc.", "esma."];
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let auth = null, user = null, tab = "login";

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
    "auth/account-exists-with-different-credential": "這個電子郵件已經用另一種方式註冊過，請改用原本的方式登入。"
  };
  const say = (text, bad) => { const m = $("saveMsg"); m.className = "msg " + (bad ? "bad" : "ok"); m.textContent = text || ""; };
  const fail = e => say(MSG[e && e.code] || ("發生錯誤：" + (e && e.message ? e.message : e)), true);

  function loadScript(src) {
    return new Promise((ok, bad) => {
      const s = document.createElement("script");
      s.src = src; s.onload = ok; s.onerror = () => bad(new Error("load " + src));
      document.head.appendChild(s);
    });
  }

  function render() {
    $("save").hidden = false;
    const who = $("who");
    if (user) {
      const name = (user.email || "已登入").split("@")[0];
      who.textContent = "💾 " + name; who.title = "已登入：" + (user.email || "");
      $("saveTitle").textContent = `已存檔：${name}`;
      $("saveText").textContent = "各科的作答紀錄、錯題本都會自動存到雲端，換手機、電腦登入同一個帳號就能接著練。";
      $("saveActs").innerHTML = `<button class="btn ghost" type="button" data-a="logout">登出</button>`;
      $("mail").hidden = true;
      return;
    }
    who.textContent = "👤 登入"; who.title = "登入後，學習紀錄可以在不同電腦、手機上同步";
    $("saveTitle").textContent = "先登入，進度才不會不見";
    $("saveText").textContent = "登入後紀錄存在雲端，換手機也能接著練。不登入也可以直接選關卡開始。";
    $("saveActs").innerHTML = `<button class="btn g" type="button" data-a="google"><svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>用 Google 登入</button>
      <button class="btn ghost" type="button" data-a="mail">用電子郵件</button>`;
    renderForm();
  }

  function renderForm() {
    const reg = tab === "register";
    $("pwLabel").textContent = reg ? "密碼（至少 8 個字元）" : "密碼";
    $("mPw").autocomplete = reg ? "new-password" : "current-password";
    $("pw2Wrap").hidden = !reg;
    $("mPw2").required = reg;
    $("mSubmit").textContent = reg ? "註冊" : "登入";
    $("mReset").hidden = reg;
    $("mSwitch").innerHTML = reg ? `已經有帳號了？<a href="#save" data-a="tab-login">登入</a>` : `還沒有帳號？<a href="#save" data-a="tab-register">註冊一個</a>`;
  }

  async function google() {
    const p = new firebase.auth.GoogleAuthProvider();
    p.setCustomParameters({ prompt: "select_account" });   // 共用電腦時每次都讓人選帳號
    try { await auth.signInWithPopup(p); }
    catch (e) {
      if (e.code === "auth/popup-blocked" || e.code === "auth/operation-not-supported-in-this-environment") await auth.signInWithRedirect(p);
      else fail(e);
    }
  }

  async function submit() {
    const email = $("mEmail").value.trim(), pw = $("mPw").value;
    if (tab === "login") {
      try { await auth.signInWithEmailAndPassword(email, pw); say(""); } catch (e) { fail(e); }
      return;
    }
    if (pw.length < 8) return fail({ code: "auth/weak-password" });
    if (pw !== $("mPw2").value) return say("兩次輸入的密碼不一樣。", true);
    try {
      const cred = await auth.createUserWithEmailAndPassword(email, pw);
      await cred.user.sendEmailVerification();
      say(`註冊成功！已寄一封驗證信到 ${email}，點信裡的連結完成驗證（找不到請看垃圾郵件）。`);
    } catch (e) { fail(e); }
  }

  async function reset() {
    const email = $("mEmail").value.trim();
    if (!email) return say("請先填電子郵件，再按「忘記密碼」。", true);
    try {
      await auth.sendPasswordResetEmail(email);
      say(`如果 ${email} 有註冊，會收到一封重設密碼的信，點信裡的連結設定新密碼（找不到請看垃圾郵件）。`);
    } catch (e) { fail(e); }
  }

  async function logout() {
    if (!confirm("確定要登出？\n登出後，這台電腦上你的學習紀錄會清除（雲端上的不會刪），下次登入會拿回來。")) return;
    const uid = user.uid;
    await auth.signOut();
    // 和各站 cloud.js 的登出一樣：只清掉標記為這個帳號的本機紀錄
    SITE_PREFIXES.forEach(p => {
      if (localStorage.getItem(p + "owner") !== uid) return;
      Object.keys(localStorage).filter(k => k.indexOf(p) === 0).forEach(k => localStorage.removeItem(k));
    });
    say("已登出，這台電腦上的紀錄已清除；下次登入會從雲端拿回來。");
  }

  document.addEventListener("click", e => {
    const t = e.target.closest("[data-a]");
    if (!t || !auth) return;
    const a = t.dataset.a;
    if (a.indexOf("tab-") === 0) { e.preventDefault(); tab = a.slice(4); say(""); renderForm(); return; }
    if (a === "google") google();
    else if (a === "mail") { const m = $("mail"); m.hidden = !m.hidden; if (!m.hidden) $("mEmail").focus(); }
    else if (a === "logout") logout();
  });
  document.addEventListener("submit", e => { if (e.target.id === "mailForm") { e.preventDefault(); submit(); } });
  document.addEventListener("click", e => { if (e.target.id === "mReset" && auth) reset(); });

  async function init() {
    if (!(CFG && CFG.apiKey)) return;   // 沒有設定時不顯示存檔點
    try {
      await loadScript(SDK + "firebase-app-compat.js");
      await loadScript(SDK + "firebase-auth-compat.js");
      if (!firebase.apps.length) firebase.initializeApp(CFG);
      auth = firebase.auth();
      auth.languageCode = "zh-TW";
      auth.getRedirectResult().catch(fail);
      auth.onAuthStateChanged(u => { if (u && !user) say(""); user = u; render(); });
    } catch (e) { /* 沒網路：首頁照常使用，只是不顯示存檔點 */ }
  }
  init();
})();
