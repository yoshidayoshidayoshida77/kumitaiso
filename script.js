
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreDisplay = document.getElementById("score");
const shareButton = document.getElementById("shareButton");
const bgm = document.getElementById("bgm");
bgm.play();

let score = 0;
let speed = 2;
let stack = [];
let images = [];
let current;
let imgPaths = ["S__56541186_0.jpg","S__56541188_0.jpg","S__56541189_0.jpg","S__56541190_0.jpg","S__56541191_0.jpg","S__56541192_0.jpg","S__56541193_0.jpg","S__56541194_0.jpg","S__56541195_0.jpg","S__56541199_0.jpg","S__56541200_0.jpg","S__56541201_0.jpg","S__56541202_0.jpg","S__56541203_0.jpg","S__56541205_0.jpg","S__56541206_0.jpg","S__56541207_0.jpg","S__56541208_0.jpg","S__56541210_0.jpg","S__56541211_0.jpg"];

imgPaths.forEach(src => {
  const img = new Image();
  img.src = `images/${src}`;
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
    dy: speed
  };
}

function drawBlock(b) {
  ctx.drawImage(b.img, b.x, b.y, b.width, b.height);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let b of stack) {
    drawBlock(b);
  }

  if (current) {
    current.y += current.dy;
    drawBlock(current);

    const topY = stack.length ? stack[stack.length - 1].y : canvas.height - 100;
    if (current.y + current.height >= topY) {
      if (stack.length && (current.x + current.width < stack[stack.length - 1].x || current.x > stack[stack.length - 1].x + stack[stack.length - 1].width)) {
        bgm.pause();
        shareButton.style.display = "block";
        return;
      }
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

document.addEventListener("keydown", e => {
  if (!current) return;
  if (e.key === "ArrowLeft") current.x -= 10;
  if (e.key === "ArrowRight") current.x += 10;
  if (e.key === "ArrowUp") current.y -= 10;
  if (e.key === "ArrowDown") current.y += 10;
});

shareButton.onclick = () => {
  const text = encodeURIComponent("OVER THE SUN組体操 やってみた！ #ots組体操");
  const url = encodeURIComponent(location.href);
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
};

current = createBlock();
update();
