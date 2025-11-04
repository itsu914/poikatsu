// Firebase設定
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAhzyGSVtxvd3DeReR13iVybxAbx8W8vrg",
  authDomain: "point-3d4a0.firebaseapp.com",
  projectId: "point-3d4a0",
  storageBucket: "point-3d4a0.firebasestorage.app",
  messagingSenderId: "920865912707",
  appId: "1:920865912707:web:608ea8cc097247f3d728b6",
  measurementId: "G-Z8JR2W1TC3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// ✅ ログイン機能
document.getElementById("loginGoogle").addEventListener("click", async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  showUser(result.user);
});

document.getElementById("loginEmail").addEventListener("click", async () => {
  const email = prompt("メールアドレス:");
  const password = prompt("パスワード:");
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch {
    await signInWithEmailAndPassword(auth, email, password);
  }
  showUser(auth.currentUser);
});

async function showUser(user) {
  document.getElementById("user-info").textContent = `ログイン中: ${user.email}`;
  await loadPoints(user.uid);
}

// ✅ ポイント機能
async function loadPoints(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  let points = snap.exists() ? snap.data().points : 0;
  document.getElementById("points").textContent = `現在のポイント: ${points} pt`;

  document.getElementById("watchAd").onclick = async () => {
    points += 200;
    await setDoc(ref, { points }, { merge: true });
    document.getElementById("points").textContent = `現在のポイント: ${points} pt`;
    document.getElementById("status").textContent = "🎉 200ポイント獲得！（2円相当）";
  };
}

// ✅ 管理者（PayギフトURL登録）
document.getElementById("saveUrl").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return alert("ログインしてください");
  const url = document.getElementById("payUrl").value;
  if (!url) return alert("URLを入力してください");
  await setDoc(doc(db, "payUrls", user.uid), { url });
  alert("登録しました ✅");
});
