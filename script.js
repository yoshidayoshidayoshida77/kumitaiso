
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
let current;
let running = false;

let imgPaths = [];
for (let i = 1; i <= 20; i++) {
  imgPaths.push(`images/S__5654118${i < 10 ? '0' + i : i}_0.png`);
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

function checkCollision(b1, b2) {
  return !(
    b1.x + b1.width < b2.x ||
    b1.x > b2.x + b2.width ||
    b1.y + b1.height < b2.y ||
    b1.y > b2.y + b2.height
  );
}

function update() {
  if (!running) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let b of stack) {
    drawBlock(b);
  }

  if (current) {
    current.y += current.dy;
    drawBlock(current);

    for (let b of stack) {
      if (checkCollision(current, b)) {
        if (Math.abs(current.x - b.x) > 100) {
          bgm.pause();
          shareButton.style.display = "block";
          running = false;
          return;
        }
        stack.push(current);
        score++;
        current = createBlock();
        break;
      }
    }

    if (current.y + current.height >= canvas.height) {
      stack.push(current);
      score++;
      current = createBlock();
    }
  }

  scoreDisplay.textContent = `スコア: ${score}`;
  requestAnimationFrame(update);
}

canvas.addEventListener("touchstart", e => {
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
});

canvas.addEventListener("touchend", e => {
  const touch = e.changedTouches[0];
  const deltaX = touch.clientX - startX;
  const deltaY = touch.clientY - startY;

  if (!current) return;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 30) current.x += 20;
    else if (deltaX < -30) current.x -= 20;
  } else if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
    current.rotation = (current.rotation + 90) % 360;
  }
});

shareButton.onclick = () => {
  const text = encodeURIComponent("OVER THE SUN組体操チャレンジ やってみた！ #ots組体操 #overthesun");
  const url = encodeURIComponent(location.href);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
};

startButton.onclick = () => {
  score = 0;
  stack = [];
  speed = 2;
  current = createBlock();
  running = true;
  bgm.play();
  update();
};
