const POINTS_KEY = "poikatsu_points";
const CHECKIN_KEY = "poikatsu_last_checkin";
const AD_KEY = "poikatsu_ad_count";
const MAX_ADS = 30;

let points = parseInt(localStorage.getItem(POINTS_KEY)) || 0;
let lastCheckin = localStorage.getItem(CHECKIN_KEY) || null;
let adCount = parseInt(localStorage.getItem(AD_KEY)) || 0;

const pointsDisplay = document.getElementById("pointsDisplay");
const adRemaining = document.getElementById("adRemaining");
const adButton = document.getElementById("adButton");
const rewardArea = document.getElementById("rewardArea");

// リンクリスト
const links = [
  "https://wallet.vaton.jp/xxxxx",
  "https://wallet.vaton.jp/yyyyy",
  "https://wallet.vaton.jp/zzzzz"
];

// ポイント表示更新
function updatePointsDisplay() {
  const yen = Math.floor(points / 100);
  document.querySelector("#pointsDisplay .yen").textContent = yen + "円";
  document.querySelector("#pointsDisplay .points").textContent = points + "ポイント";
}
updatePointsDisplay();
adRemaining.textContent = MAX_ADS - adCount;

// チェックイン処理
document.getElementById("checkinButton").addEventListener("click", () => {
  const today = new Date().toISOString().split("T")[0];
  if (lastCheckin === today) {
    alert("✅ 今日のチェックインは済んでいます！");
    return;
  }
  points += 100;
  lastCheckin = today;
  localStorage.setItem(POINTS_KEY, points);
  localStorage.setItem(CHECKIN_KEY, today);
  updatePointsDisplay();
  alert("🎉 今日のチェックインで100ポイントゲット！");
});

// 広告自動付与
function autoAdReward() {
  if (adCount >= MAX_ADS) {
    adButton.textContent = "広告視聴完了";
    adRemaining.textContent = 0;
    return;
  }
  points += 200;
  adCount++;
  localStorage.setItem(POINTS_KEY, points);
  localStorage.setItem(AD_KEY, adCount);
  updatePointsDisplay();
  adRemaining.textContent = MAX_ADS - adCount;

  if (adCount < MAX_ADS) {
    setTimeout(autoAdReward, 1000); // 1秒ごとに自動追加（テスト用）
  } else {
    adButton.textContent = "広告視聴完了";
  }
}

// ページ読み込み時に広告自動付与
window.addEventListener("load", () => {
  autoAdReward();
});

// 報酬リンク表示
function showRewardLink() {
  const unusedLink = links[Math.floor(Math.random() * links.length)];
  rewardArea.innerHTML = `<a href="${unusedLink}" target="_blank">🎁 選べるPayリンクはこちら！</a>`;
}
