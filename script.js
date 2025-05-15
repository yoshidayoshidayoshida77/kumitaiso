const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreDisplay = document.getElementById("score");
const shareButton = document.getElementById("shareButton");
const startButton = document.getElementById("startButton");
const bgm = document.getElementById("bgm");

let score = 0;
let stack = [];
let images = [];
let current = null;
let gameStarted = false;
let imgPaths = [];

for (let i = 0; i < 20; i++) {
  imgPaths.push(`images/S__5654118${6 + i}_0.png`);
}

imgPaths.forEach(src => {
  const img = new Image();
  img.src = src;
  images.push(img);
});

function createBlock() {
  const img = images[Math.floor(Math.random() * images.length)];
  return {
    x: canvas.width / 2 - 50,
    y: 0,
    width: 100,
    height: 100,
    img: img,
    dy: 2,
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

function drawBase() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
}

function update() {
  if (!gameStarted) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBase();

  stack.forEach(drawBlock);

  if (current) {
    current.y += current.dy;
    drawBlock(current);

    if (current.y + current.height >= canvas.height - 40) {
      stack.push(current);
      score++;
      current = createBlock();
    }
  }

  scoreDisplay.textContent = `スコア: ${score}`;
  requestAnimationFrame(update);
}

startButton.onclick = () => {
  gameStarted = true;
  bgm.play();
  current = createBlock();
  update();
};

shareButton.onclick = () => {
  const text = encodeURIComponent("OVER THE SUN組体操チャレンジ やってみた！ #ots組体操 #overthesun");
  const url = encodeURIComponent(location.href);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
};
