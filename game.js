let gameStarted = false;
const TOTAL_CHESTS = 6;
let collectedChests = 0;
let chestScreenActive = false;
let lastChestNumber = 0;
let gameWon = false;
const bgMusic = new Audio("assets/bgm.wav");
bgMusic.loop = true;
bgMusic.volume = 0.4;
const bushSound = new Audio("assets/bush_ruffle.mp3");
bushSound.volume = 0.3;
let winScreenActive = false;
let currentLevel = 1;

let pauseScreenActive = false;

const chestMessages = {
  1: "GOOD JOB!",
  2: "You're doing amazing",
  3: "Halfway there!",
  4: "So close now...",
  5: "All chests found WOOHOO"
};


// map
const levels = {

  1: [
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WQGGWFGHGCWGGFHGGGGWWWWWWWWWWWWWWWW",
    "WGFGWWWWWGWWWWWGGBGWGFHGGGWWWWGGCWW",
    "WGGGGHGGGGGGGGWWWWWWGWWWWGWWWGGGGWW",
    "WWWWWWWGWGWWWGWWGGGFGWGGWGGFFGWWGWW",
    "WWWWWWWGWGWGWGWWGWWWGWWWWGWWWGWWGWW",
    "WWGHHGWGWGWGWGGGGWGWGGWWGGWGWGGWGWW",
    "WWGWWHHGWGWGWWWWWGGGWFFGGWWGWWGWGWW",
    "WWGWWWWWWGWWWWWWWGGWWWWWWGHGGWGWGWW",
    "WWGGGHHGGGGGGGFFGGGGGGGGWGGGGWGGGWW",
    "WWWWWWWWWWWGWWGGGWGGWWWGGGGGWWWWGWW",
    "WWWCGGWWWGGGFWWGWWWGWGWGWGWWWWWWGCW",
    "WWWWWGWWFGWWWWWGGGGGWGWGWGWGGGGCWWW",
    "WWWWWGWWGWWGWWWWWWWWWWWGWGWGWWWGWWW",
    "WGGGWGWGGWGGWGGGGGGHFGGGWGWGWWWGWWW",
    "WGGGWFHGWWGGWGWWWWWWWWWWGGWGWWWGWWW",
    "WFFGGGWWWWWWWGWGGGGGGWWWWWWGWWWGWWW",
    "WWWGHGWGWGGGGGWWWWWWWWGGGGGGWWWGWWW",
    "WWWWWGWWWGWWWWWWGGGGGGGWWWWGGGGGWWW",
    "WWWWWGGGCBGGGGGGGWWWGWWWGGFWWWWWGGW",
    "WWWWWWWWWWWWWWWWWWGGGFFHGGFGGHHFGKW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
  ],

  2: [
    "WWWWWWWWWWWWWWWWWWWW",
    "WQGGGGGGGGGGGGGGGKWW",
    "WGGWWWWWWWWWWWWGGGWW",
    "WGGGGCGBGGGGGGGGGGWW",
    "WWWWWWWWWWWWWWWWWWWW"
  ]
};

let maze = levels[currentLevel].map(row => row);


const tileSize = 16; // 16x16 px tiles

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// making canvas fit the size of map
canvas.width = maze[0].length * tileSize;
canvas.height = maze.length * tileSize;

// create queen (tia)
const queen = {
  x: 0,
  y: 0
};

// create king (ryan)
const king = {
  x: 0,
  y: 0
};

// load images
const grass = new Image();
grass.src = "assets/grass.png";

const flower_grass_1 = new Image();
flower_grass_1.src = "assets/flower_grass_1.png";

const flower_grass_2 = new Image();
flower_grass_2.src = "assets/flower_grass_2.png";

const bush = new Image();
bush.src = "assets/bush.png";

const wall = new Image();
wall.src = "assets/wall.png";

const queenImg = new Image();
queenImg.src = "assets/queen.png"; // tia sprite

const kingImg = new Image();
kingImg.src = "assets/king.png"; // ryan sprite (goal)

const chestClosedImg = new Image();
chestClosedImg.src = "assets/chest_close.png";

const chestOpenImg = new Image();
chestOpenImg.src = "assets/chest_open.png";


// reusable function to find start position
function findStartPosition(symbol, character) {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {

      if (maze[y][x] === symbol) {
        character.x = x;
        character.y = y;
      }

    }
  }
}

// drawing map iterating thru 2d array
function drawMap() {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {

      const tile = maze[y][x];


      // ground-like tiles
      if (tile === "G" || tile === "Q" || tile === "K") {
        ctx.drawImage(grass, x * tileSize, y * tileSize, tileSize, tileSize);
      }

      if (tile === "F") {
        ctx.drawImage(flower_grass_1, x * tileSize, y * tileSize, tileSize, tileSize);
      }

      if (tile === "H") {
        ctx.drawImage(flower_grass_2, x * tileSize, y * tileSize, tileSize, tileSize);
      }

      if (tile === "B") {
        ctx.drawImage(bush, x * tileSize, y * tileSize, tileSize, tileSize);
      }


      // closed chest tile (includes grass)
      if (tile === "C") {
        ctx.drawImage(chestClosedImg, x * tileSize, y * tileSize, tileSize, tileSize);
      }

      // open chest tile (includes grass)
      if (tile === "O") {
        ctx.drawImage(chestOpenImg, x * tileSize, y * tileSize, tileSize, tileSize);
      }

      // walls
      if (tile === "W") {
        ctx.drawImage(wall, x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }
}

// draw queen (tia)
function drawQueen() {
  ctx.drawImage(
    queenImg,
    queen.x * tileSize,
    queen.y * tileSize,
    tileSize,
    tileSize
  );
}

// draw king (ryan)
function drawKing() {
  ctx.drawImage(
    kingImg,
    king.x * tileSize,
    king.y * tileSize,
    tileSize,
    tileSize
  );
}

function drawUI() {
  ctx.fillStyle = "white";
  ctx.font = "10px monospace";
  ctx.textBaseline = "top";

  ctx.fillText(
    "Chests: " + collectedChests + " / " + TOTAL_CHESTS,
    4, 4
  );
}

function drawStartScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  ctx.font = "24px monospace";
  ctx.fillText(
    "THE QUEEN'S QUEST",
    canvas.width / 2,
    canvas.height / 2 - 40
  );

  ctx.font = "14px monospace";
  ctx.fillText(
    "Collect all chests to reach the King",
    canvas.width / 2,
    canvas.height / 2
  );

  ctx.fillText(
    "Use Arrow Keys or WASD to move",
    canvas.width / 2,
    canvas.height / 2 + 25
  );

  ctx.fillText(
    "Press ENTER to start",
    canvas.width / 2,
    canvas.height / 2 + 60
  );

  ctx.textAlign = "left"; // reset for later
}

function drawChestScreen() {
  // dark transparent overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  // title
  ctx.font = "20px monospace";
  ctx.fillText(
    "You found the " +
    lastChestNumber +
    getOrdinal(lastChestNumber) +
    " chest",
    canvas.width / 2,
    canvas.height / 2 - 40
  );

  // custom message per chest
  ctx.font = "14px monospace";
  ctx.fillText(
    chestMessages[lastChestNumber] || "You found a chest!",
    canvas.width / 2,
    canvas.height / 2 - 10
  );

  // continue hint
  ctx.font = "12px monospace";
  ctx.fillText(
    "Press ENTER to continue",
    canvas.width / 2,
    canvas.height / 2 + 30
  );

  ctx.textAlign = "left";
}

function drawPauseScreen() {
  // dark overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  ctx.font = "22px monospace";
  ctx.fillText(
    "PAUSED",
    canvas.width / 2,
    canvas.height / 2 - 50
  );

  ctx.font = "14px monospace";
  ctx.fillText(
    "Press ENTER to resume",
    canvas.width / 2,
    canvas.height / 2 - 10
  );

  ctx.fillText(
    "Press R to restart",
    canvas.width / 2,
    canvas.height / 2 + 20
  );

  ctx.textAlign = "left";
}

function drawWinScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.9)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.textAlign = "center";

  ctx.font = "24px monospace";
  ctx.fillText(
    "YOU WON!",
    canvas.width / 2,
    canvas.height / 2 - 40
  );

  ctx.font = "14px monospace";
  ctx.fillText(
    "Press ENTER to go to the next level",
    canvas.width / 2,
    canvas.height / 2
  );

  ctx.textAlign = "left";
}

//recognises which block is next
function getTileAt(x, y) {
  return maze[y][x];
}

function redraw() {

  if (!gameStarted) {
    drawStartScreen();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawMap();
  drawKing();
  drawQueen();
  drawUI();

  // WIN SCREEN HAS HIGHEST PRIORITY
  if (winScreenActive) {
    drawWinScreen();
    return;
  }


  // CHEST SCREEN HAS PRIORITY
  if (chestScreenActive) {
    drawChestScreen();
    return;
  }

  // PAUSE SCREEN
  if (pauseScreenActive) {
    drawPauseScreen();
    return;
  }
}


function getOrdinal(n) {
  if (n === 1) return "st";
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  return "th";
}

function restartGame() {
  bgMusic.currentTime = 0;
  bgMusic.play();
  collectedChests = 0;
  lastChestNumber = 0;
  gameWon = false;
  chestScreenActive = false;
  pauseScreenActive = false;

  // reset maze chests (O → C)
  for (let y = 0; y < maze.length; y++) {
    maze[y] = maze[y].replace(/O/g, "C");
  }

  findStartPosition("Q", queen);
  redraw();
}

function loadNextLevel() {
  currentLevel++;

  if (!levels[currentLevel]) {
    alert("No more levels yet!");
    return;
  }

  maze = levels[currentLevel].map(row => row);

  collectedChests = 0;
  lastChestNumber = 0;
  gameWon = false;
  winScreenActive = false;
  pauseScreenActive = false;

  canvas.width = maze[0].length * tileSize;
  canvas.height = maze.length * tileSize;

  findStartPosition("Q", queen);
  findStartPosition("K", king);

  bgMusic.currentTime = 0;
  bgMusic.play();

  redraw();
}

function handleKeyDown(event) {

  // START SCREEN LOGIC
  if (!gameStarted) {
    if (event.key === "Enter") {
      gameStarted = true;
      bgMusic.play();   // START MUSIC
      redraw();
    }
    return;
  }

  // WIN SCREEN INPUT
  if (winScreenActive) {
    if (event.key === "Enter") {
      loadNextLevel();
    }
    return;
  }


  // TOGGLE PAUSE WITH ESC
  if (event.key === "Escape" && !chestScreenActive) {
    pauseScreenActive = !pauseScreenActive;

    if (pauseScreenActive) {
      bgMusic.pause();
    } else {
      bgMusic.play();
    }

    redraw();
    return;
  }

  // PAUSE SCREEN LOGIC
  if (pauseScreenActive) {
    if (event.key === "Enter") {
      pauseScreenActive = false; // resume
    }

    if (event.key === "r" || event.key === "R") {
      restartGame();
    }

    redraw();
    return; // block movement
  }



  // CHEST SCREEN LOGIC (PAUSE GAME)
  if (chestScreenActive) {
    if (event.key === "Enter") {
      chestScreenActive = false;
      redraw();
    }
    return; // block all other keys
  }


  if (event.key === "m" || event.key === "M") {
    bgMusic.muted = !bgMusic.muted;
  }

  if (gameWon) {
    return;
  }


  let newX = queen.x;
  let newY = queen.y;

  // decide direction
  if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
    newY--;
  }

  if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
    newY++;
  }

  if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
    newX--;
  }

  if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
    newX++;
  }

  // check the tile we want to move into
  const targetTile = getTileAt(newX, newY);
  // collect closed chest
  if (targetTile === "C") {
    collectedChests++;
    lastChestNumber = collectedChests;
    chestScreenActive = true;

    maze[newY] =
      maze[newY].substring(0, newX) +
      "O" +
      maze[newY].substring(newX + 1);

  }

  // block walls
  if (targetTile === "W") {
    return;
  }

  // move queen
  queen.x = newX;
  queen.y = newY;

  // play bush rustle sound
  if (targetTile === "B") {
    bushSound.currentTime = 0; // rewind so it can replay
    bushSound.play();
  }


  // check win condition
  if (queen.x === king.x && queen.y === king.y) {

    if (collectedChests < TOTAL_CHESTS) {
      return;
    }

    winScreenActive = true;
    gameWon = true;
    bgMusic.pause();
    redraw();
    return;
  }




  // redraw everything
  redraw();
}

// wait for images to load
queenImg.onload = function () {
  kingImg.onload = function () {
    chestClosedImg.onload = function () {
      chestOpenImg.onload = function () {

        findStartPosition("Q", queen);
        findStartPosition("K", king);

        redraw();

      };
    };
  };
};


document.addEventListener("keydown", handleKeyDown);




