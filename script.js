
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreDisplay = document.getElementById("score");
const shareButton = document.getElementById("shareButton");
const bgm = document.getElementById("bgm");

let score = 0;
let speed = 2;
let stack = [];
let images = [];
let current;
let imgPaths = [
  "S__56541186_0.png", "S__56541188_0.png", "S__56541189_0.png", "S__56541190_0.png", "S__56541191_0.png",
  "S__56541192_0.png", "S__56541193_0.png", "S__56541194_0.png", "S__56541195_0.png", "S__56541199_0.png",
  "S__56541200_0.png", "S__56541201_0.png", "S__56541202_0.png", "S__56541203_0.png", "S__56541205_0.png",
  "S__56541206_0.png", "S__56541207_0.png", "S__56541208_0.png", "S__56541210_0.png", "S__56541211_0.png"
];

let loadedCount = 0;
let totalImages = imgPaths.length;

imgPaths.forEach(src => {
  const img = new Image();
  img.onload = checkStart;
  img.onerror = checkStart;
  img.src = `images/${src}`;
  images.push(img);
});

function checkStart() {
  loadedCount++;
  if (loadedCount >= totalImages) {
    current = createBlock();
    update();
    bgm.play();
  }
}

function createBlock() {
  const img = images[Math.floor(Math.random() * images.length)];
  return {
    x: canvas.width / 2 - 50,
    y: 0,
    width: 100,
    height: 100,
    img: img,
    dy: speed,
    rotation: 0
  };
}

function drawBlock(b) {
  ctx.save();
  ctx.translate(b.x + b.width / 2, b.y + b.height / 2);
  ctx.rotate((b.rotation || 0) * Math.PI / 180);
  ctx.drawImage(b.img, -b.width / 2, -b.height / 2, b.width, b.height);
  ctx.restore();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let b of stack) {
    drawBlock(b);
  }

  if (current) {
    current.y += current.dy;
    drawBlock(current);

    if (stack.length === 0 || current.y + current.height >= stack[stack.length - 1].y) {
      stack.push(current);
      score++;
      speed = 2 + Math.floor(score / 10);
      current = createBlock();
    }

    if (stack.length * 100 > canvas.height) {
      bgm.pause();
      shareButton.style.display = "block";
      return;
    }
  }

  scoreDisplay.textContent = `スコア: ${score}`;
  requestAnimationFrame(update);
}

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", e => {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

canvas.addEventListener("touchend", e => {
  const touch = e.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  if (!current) return;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 30) current.x += 20;
    else if (deltaX < -30) current.x -= 20;
  } else {
    if (deltaY > 30) {
      current.y += 10;
    } else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      current.rotation = (current.rotation || 0) + 90;
      if (current.rotation >= 360) current.rotation = 0;
    }
  }
});

shareButton.onclick = () => {
  const text = encodeURIComponent("OVER THE SUN組体操チャレンジ やってみた！ #ots組体操 #overthesun");
  const url = encodeURIComponent(location.href);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
};
