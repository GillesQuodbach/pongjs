"use strict";

let canvas;
let game;
let anim;
let ballImage;
let field;

const PLAYER_HEIGHT = 100;
const PLAYER_WIDTH = 5;

function draw() {
  let context = canvas.getContext("2d");

  //dessine le terrain
  context.drawImage(field, 0, 0, canvas.width, canvas.height);

  //dessine la ligne
  context.strokeStyle = "white";
  context.beginPath();
  context.moveTo(canvas.width / 2, 0);
  context.lineTo(canvas.width / 2, canvas.height);
  context.stroke();

  // dessine les joueurs
  context.fillStyle = "white";
  context.fillRect(0, game.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);
  context.fillRect(
    canvas.width - PLAYER_WIDTH,
    game.computer.y,
    PLAYER_WIDTH,
    PLAYER_HEIGHT
  );

  //dessine la balle
  // context.beginPath();
  // context.fillStyle = "white";
  // context.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2, false);
  // context.fill();
  context.drawImage(
    ballImage,
    game.ball.x - game.ball.r,
    game.ball.y - game.ball.r,
    game.ball.r * 2,
    game.ball.r * 2
  );
}

function play() {
  draw();
  ballMove(); // Corrected order

  computerMove();

  anim = requestAnimationFrame(play);
}

document.addEventListener("DOMContentLoaded", function () {
  canvas = document.getElementById("canvas");

  // Image a la place de la balle
  ballImage = new Image();
  ballImage.src = "max.png";

  // Image d'un court de tennis
  field = new Image();
  field.src = "/tennis.png";
  // Mouse move event
  canvas.addEventListener("mousemove", playerMove);
  game = {
    player: {
      y: canvas.height / 2 - PLAYER_HEIGHT / 2,
      score: 0,
    },
    computer: {
      y: canvas.height / 2 - PLAYER_HEIGHT / 2,
      score: 0,
    },
    ball: {
      x: canvas.width / 2,
      y: canvas.height / 2,
      r: 20,
      speed: {
        x: 2,
        y: 2,
      },
    },
  };
  document.getElementById("start-game").addEventListener("click", play);
  document.getElementById("stop-game").addEventListener("click", stop);
});

// Mouvement du joueur
function playerMove(event) {
  // Localise la souris sur le terrian
  let canvasLocation = canvas.getBoundingClientRect();
  let mouseLocation = event.clientY - canvasLocation.top;

  if (mouseLocation < PLAYER_HEIGHT / 2) {
    game.player.y = 0;
  } else if (mouseLocation > canvas.height - PLAYER_HEIGHT / 2) {
    game.player.y = canvas.height - PLAYER_HEIGHT;
  } else {
    game.player.y = mouseLocation - PLAYER_HEIGHT / 2;
  }

  draw();
}

// Mouvement de l'ordinateur
function computerMove() {
  game.computer.y += game.ball.speed.y * 0.85;
}

// Mouvement de la balle
function ballMove() {
  if (game.ball.y > canvas.height || game.ball.y < 0) {
    game.ball.speed.y *= -1;
  }
  if (
    game.ball.x > canvas.width - PLAYER_WIDTH &&
    game.ball.y > game.computer.y &&
    game.ball.y < game.computer.y + PLAYER_HEIGHT
  ) {
    collide(game.computer);
  } else if (
    game.ball.x < PLAYER_WIDTH &&
    game.ball.y > game.player.y &&
    game.ball.y < game.player.y + PLAYER_HEIGHT
  ) {
    collide(game.player);
  }

  game.ball.x += game.ball.speed.x;
  game.ball.y += game.ball.speed.y;
}

function collide(player) {
  if (player == game.player) {
    game.computer.score++;
    document.getElementById("computer-score").textContent = game.computer.score;
  } else {
    game.player.score++;
    document.getElementById("player-score").textContent = game.player.score;
  }
  if (game.ball.x < 0 || game.ball.x > canvas.width) {
    // Vérifie si la balle est touchée par le joueur
    game.ball.x = canvas.width / 2;
    game.ball.y = canvas.height / 2;
    game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
    game.computer.y = canvas.height / 2 - PLAYER_HEIGHT / 2;

    game.ball.speed.x = 2;
  } else {
    game.ball.speed.x *= -1.2;
    changeDirection(player.y);
  }
}

function changeDirection(playerPosition) {
  let impact = game.ball.y - (playerPosition + PLAYER_HEIGHT / 2);
  let ratio = 0.2; // controle de la vitesse de la balle

  // Vitesse max de la balle
  let maxSpeedChange = 5;
  let speedChange = impact * ratio;
  if (Math.abs(speedChange) > maxSpeedChange) {
    speedChange = maxSpeedChange * Math.sign(speedChange);
  }

  game.ball.speed.y = speedChange;
}

function stop() {
  cancelAnimationFrame(anim);

  game.ball.x = canvas.width / 2;
  game.ball.y = canvas.height / 2;
  game.player.y = canvas.height / 2 - PLAYER_HEIGHT / 2;
  game.computer.y = canvas.height / 2 - PLAYER_HEIGHT / 2;

  game.ball.speed.x = 2;
  game.ball.speed.y = 2;

  game.computer.score = 0;
  game.player.score = 0;

  document.getElementById("computer-score").textContent = game.computer.score;
  document.getElementById("player-score").textContent = game.player.score;

  draw();
}
