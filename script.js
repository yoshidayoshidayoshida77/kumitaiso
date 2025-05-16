
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
let gameRunning = false;

const imgBaseURL = "https://yoshidayoshidayoshida77.github.io/kumitaiso/images/";
const imgPaths = [
  "S__56541801_0.png", "S__56541802_0.png", "S__56541803_0.png", "S__56541804_0.png", "S__56541805_0.png",
  "S__56541806_0.png", "S__56541807_0.png", "S__56541808_0.png", "S__56541809_0.png", "S__56541810_0.png"
];

const logo = new Image();
logo.src = imgBaseURL + "OTS_logo.png";

function preloadImages(srcs) {
  return Promise.all(srcs.map(src => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = imgBaseURL + src;
    });
  }));
}

function drawBaseAndLogo() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
  ctx.drawImage(logo, canvas.width / 2 - 150, canvas.height / 2 - 150, 300, 100);
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
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBaseAndLogo();

  stack.forEach(drawBlock);

  if (current) {
    current.y += current.dy;
    drawBlock(current);

    const topY = stack.length
      ? Math.min(...stack.map(b => b.y))
      : canvas.height - 100;

    if (current.y + current.height >= topY) {
      if (
        stack.length &&
        (current.x + current.width < stack[stack.length - 1].x ||
         current.x > stack[stack.length - 1].x + stack[stack.length - 1].width)
      ) {
        bgm.pause();
        gameRunning = false;
        shareButton.style.display = "block";
        return;
      }
      stack.push(current);
      score++;
      current = createBlock();
    }

    if (stack.length * 100 > canvas.height) {
      bgm.pause();
      gameRunning = false;
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
  if (!current || !gameRunning) return;

  const touch = e.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

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
  score = 0;
  speed = 2;
  stack = [];
  gameRunning = true;
  current = createBlock();
  bgm.currentTime = 0;
  bgm.play();
  shareButton.style.display = "none";
  update();
};

preloadImages(imgPaths).then(loaded => {
  images = loaded;
  startButton.disabled = false;
});
