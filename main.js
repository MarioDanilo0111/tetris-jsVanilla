import "./style.css";
import {
  BLOCK_SIZE,
  B0ARD_WIDTH,
  BOARD_HEIGHT,
  EVENT_MOVEMENTS,
} from "./public/consts.js";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const $score = document.querySelector("span");

let score = 0;

canvas.width = BLOCK_SIZE * B0ARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

// 3. board
const board = createBoard(B0ARD_WIDTH, BOARD_HEIGHT);

function createBoard(width, height) {
  return Array(height)
    .fill()
    .map(() => Array(width).fill(0));
}

// 4. Player
const piece = {
  position: { x: 5, y: 5 },
  shape: [
    [1, 1],
    [1, 1],
  ],
};
// 2. Game loop
// function update() {
//   draw();
//   window.requestAnimationFrame(update);
// }

// 9. auto Drop
let dropCounter = 0;
let lastTime = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropCounter += deltaTime;
  if (dropCounter > 1000) {
    piece.position.y++;
    dropCounter = 0;
  }

  if (checkCollision()) {
    piece.position.y--;
    solidifyPiece();
    removeRowes();
  }

  draw();
  window.requestAnimationFrame(update);
}

// 10. random shape
const PIECES = [
  [
    [1, 1],
    [1, 1],
  ],
  [[1, 1, 1, 1]],
  [
    [0, 1, 0],
    [0, 1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
];

function draw() {
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = "yellow";
        context.fillRect(x, y, 1, 1);
      }
    });
  });

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = "red";
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);
      }
    });
  });

  $score.innerHTML = score;
}

document.addEventListener("keydown", (event) => {
  if (event.key === EVENT_MOVEMENTS.LEFT) {
    piece.position.x--;
    if (checkCollision()) {
      piece.position.x++;
    }
  }
  if (event.key === EVENT_MOVEMENTS.RIGHT) {
    piece.position.x++;
    if (checkCollision()) {
      piece.position.x--;
    }
  }
  if (event.key === EVENT_MOVEMENTS.DOWN) {
    piece.position.y++;
    if (checkCollision()) {
      piece.position.y--;
      solidifyPiece();
      removeRowes();
    }
  }

  if (event.key === EVENT_MOVEMENTS.UP) {
    const rotated = [];

    for (let i = 0; i < piece.shape[0].length; i++) {
      const row = [];

      for (let j = piece.shape.length - 1; j >= 0; j--) {
        row.push(piece.shape[j][i]);
      }

      rotated.push(row);
    }

    piece.shape = rotated;
  }
});

function checkCollision() {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 && board[y + piece.position.y]?.[x + piece.position.x] !== 0
      );
    });
  });
}

function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1;
      }
    });
  });

  // Reset position
  piece.position.x = Math.floor(B0ARD_WIDTH / 2);
  piece.position.y = 0; // Reset position
  // Get random shape
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)];

  if (checkCollision()) {
    window.alert("GAME OVER");
    board.forEach((row) => row.fill(0));
    score = 0;
  }
}

function removeRowes() {
  const rowsToRemove = [];

  board.forEach((row, y) => {
    if (row.every((value) => value === 1)) {
      rowsToRemove.push(y);
    }
  });

  rowsToRemove.forEach((y) => {
    board.splice(y, 1);
    const newRow = Array(B0ARD_WIDTH).fill(0);
    board.unshift(newRow);
    score += 10;
  });
}

const $section = document.querySelector("section");

$section.addEventListener("click", () => {
  update();
  $section.remove();
  const audio = new Audio("./public/Tetris.mp3");
  audio.volume = 0.06;
  audio.play();
});
