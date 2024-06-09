const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 60;
const PLAYER_COLOR = 'blue';
const PLAYER_GRAVITY = 1;
const PLAYER_JUMP_STRENGTH = 20;
const PLATFORM_WIDTH = 100;
const PLATFORM_HEIGHT = 20;
const PLATFORM_COLOR = 'black';

let player = {
    x: 100,
    y: canvas.height - PLAYER_HEIGHT - 100,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    color: PLAYER_COLOR,
    dx: 0,
    dy: 0,
    onGround: false,
    jump: false
};

let platforms = [
    { x: 0, y: canvas.height - PLATFORM_HEIGHT, width: canvas.width, height: PLATFORM_HEIGHT, color: PLATFORM_COLOR },
    { x: 300, y: 400, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT, color: PLATFORM_COLOR },
    { x: 500, y: 300, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT, color: PLATFORM_COLOR }
];

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function applyGravity() {
    player.dy += PLAYER_GRAVITY;
    player.y += player.dy;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.onGround = true;
    } else {
        player.onGround = false;
    }
}

function detectCollisions() {
    platforms.forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y) {
            if (player.dy > 0 && player.y + player.height - player.dy <= platform.y) {
                player.y = platform.y - player.height;
                player.dy = 0;
                player.onGround = true;
            }
        }
    });
}

function update() {
    applyGravity();
    detectCollisions();

    if (player.jump && player.onGround) {
        player.dy = -PLAYER_JUMP_STRENGTH;
        player.onGround = false;
        player.jump = false;
    }

    player.x += player.dx;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
    clearCanvas();
    drawPlatforms();
    drawPlayer();
    update();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') {
        player.dx = -5;
    } else if (e.code === 'ArrowRight') {
        player.dx = 5;
    } else if (e.code === 'Space' || e.code === 'ArrowUp') {
        player.jump = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        player.dx = 0;
    }
});

gameLoop();
