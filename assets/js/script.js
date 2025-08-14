const box = document.getElementById("box");
const burst = document.getElementById("burst");
const envelope = document.getElementById("envelope");
const scene = document.getElementById("scene");
const popup = document.getElementById("popup");
const prizeName = document.getElementById("prizeName");
const closeBtn = document.getElementById("closeBtn");

let animLock = false;

const cards = [
  {
    name: "R Character",
    rarity: "R",
    rate: 70,
    variations: ["trai", "gái", "già", "trẻ"],
  },
  {
    name: "SR Character",
    rarity: "SR",
    rate: 20,
    variations: ["trai", "gái"],
  },
  {
    name: "SSR Character",
    rarity: "SSR",
    rate: 10,
    variations: ["trai", "gái"],
  },
];

function gachaDraw() {
  let total = 0;
  let rand = Math.random() * 100;
  for (let card of cards) {
    total += card.rate;
    if (rand <= total) {
      // Lấy random 1 biến thể trong variations
      const variation =
        card.variations[Math.floor(Math.random() * card.variations.length)];
      return {
        name: card.name,
        rarity: card.rarity,
        variation: variation,
      };
    }
  }
}

function launchEnvelopes(count) {
  const container = document.getElementById("envelopeContainer");
  let animations = [
    "envelopeFly1",
    "envelopeFly2",
    "envelopeFly3",
    "envelopeFly4",
    "envelopeFly5",
    "envelopeFly6",
    "envelopeFly7",
  ];

  // Trộn ngẫu nhiên mảng animations
  animations = animations.sort(() => Math.random() - 0.5);

  for (let i = 0; i < count; i++) {
    const env = document.createElement("div");
    env.classList.add("envelope");

    // Nếu số lượng nhiều hơn số animation, lặp lại từ đầu
    const anim = animations[i % animations.length];

    env.style.animation = `${anim} 500ms ease-in-out forwards`;
    env.style.animationDelay = `${i * 0.15}s`;
    env.style.animationDuration = `${200 + Math.random() * 500}ms`;

    env.innerHTML = `<img src="https://tirin2411.github.io/gacha-website/assets/img/la_thu.png" alt="Envelope" />`;
    container.appendChild(env);

    env.addEventListener("animationend", () => env.remove());
  }
}

box.addEventListener("click", async () => {
  if (animLock) return;
  document.getElementById("openBoxSound").play();
  animLock = true;
  // 1) Rung hộp
  // box.classList.add('shake');
  box.src = "https://tirin2411.github.io/gacha-website/assets/img/hop_qua_mo.png";
  // small delay so shake is visible
  // await wait(200);
  box.src = "https://tirin2411.github.io/gacha-website/assets/img/hop_qua_mo_thu.png";
  // 2) Burst + sparks
  burst.classList.add("show");
  document.querySelectorAll(".spark").forEach((s) => (s.style.opacity = 1));

  // small zoom/freeze on scene
  // scene.classList.add("freeze");

  // 3) Envelope fly out
  launchEnvelopes(10); // 7 lá thư

  // let envelope fly (timing tuned: ~1200ms)
  await wait(1200);

  // 4) giữ hình 1s rồi show popup
  await wait(700);
  const card = gachaDraw();
  // Tạo lá thư rơi tương ứng
  const dropEnv = document.createElement("div");
  dropEnv.classList.add("envelope-drop");

  let imgSrc = "https://tirin2411.github.io/gacha-website/assets/img/la_thu.png";
  document.getElementById("rCardSound").play();
  if (card.rarity === "SR") {
    imgSrc = "https://tirin2411.github.io/gacha-website/assets/img/la_thu_sr.png";
    document.getElementById("srCardSound").play();
  } else if (card.rarity === "SSR") {
    imgSrc = "https://tirin2411.github.io/gacha-website/assets/img/la_thu_ssr.png";
    document.getElementById("ssrCardSound").play();
  }

  dropEnv.innerHTML = `<img src="${imgSrc}" alt="Envelope" />`;
  scene.appendChild(dropEnv);

  // Đợi lá thư rơi xong rồi mới show popup
  await wait(800);

  prizeName.textContent = `${card.name} - ${card.variation} (${card.rarity})`;
  prizeName.className = `rarity-${card.rarity}`;
  popup.classList.add("show");

  // unlock after popup shown (optional: keep locked until user closes)
});

closeBtn.addEventListener("click", () => {
  popup.classList.remove("show");
  box.src = "https://tirin2411.github.io/gacha-website/assets/img/box_dong_1.png";
  // reset to initial state so user can open again
  resetScene();
  animLock = false;
});

function resetScene() {
  // remove animation classes and reflow to allow re-trigger next time
  burst.classList.remove("show");
  scene.classList.remove("freeze");
  box.classList.remove("shake");
  document.querySelectorAll(".spark").forEach((s) => {
    s.style.opacity = 0;
    s.style.transform = "";
  });
  document.querySelectorAll(".envelope-drop").forEach((e) => e.remove());
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}



