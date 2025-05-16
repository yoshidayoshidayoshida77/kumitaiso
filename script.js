
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreDisplay = document.getElementById("score");
const shareButton = document.getElementById("shareButton");
const startButton = document.getElementById("startButton");
const bgm = document.getElementById("bgm");

let score = 0;
let speed = 2;
let stack = [];
let images = [];
let current = null;
let gameStarted = false;

let imgPaths = ["images/placeholder.png"];

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
  if (!gameStarted) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let b of stack) drawBlock(b);

  if (current) {
    current.y += current.dy;
    drawBlock(current);

    let collision = stack.length && current.y + current.height >= stack[stack.length - 1].y;
    if (!stack.length || collision) {
      stack.push(current);
      score++;
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
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      current.rotation = (current.rotation + 90) % 360;
    }
  }
});

shareButton.onclick = () => {
  const text = encodeURIComponent("OVER THE SUN組体操チャレンジ やってみた！ #ots組体操 #overthesun");
  const url = encodeURIComponent(location.href);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
};

startButton.onclick = () => {
  gameStarted = true;
  bgm.play();
  current = createBlock();
  update();
};
