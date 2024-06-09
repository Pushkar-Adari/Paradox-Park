const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const PLAYER_WIDTH = 70;
const PLAYER_HEIGHT = 70;
const PLAYER_GRAVITY = 0.3;
const PLAYER_JUMP_STRENGTH = 10;
const PLATFORM_WIDTH = 100;
const PLATFORM_HEIGHT = 20;

let idleImage = new Image();
idleImage.src = 'idle.png'; 
let runImage = new Image();
runImage.src = 'run.png'; 
let jumpImage = new Image();
jumpImage.src = 'jump.png'; 
let platformImage = new Image();
platformImage.src = 'grass.png';

let player = {
    x: 100,
    y: canvas.height - PLAYER_HEIGHT - 100,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    dx: 0,
    dy: 0,
    onGround: false,
    jump: false,
    frameX: 0,
    frameY: 0,
    frameCount: 0,
    animationSpeed: 10, 
    jumpAnimationSpeed: 3, 
    frameWidth: 70, 
    frameHeight: 70, 
    idleFrameCount: 27, 
    runFrameCount: 16, 
    jumpFrameCount: 3, 
    state: 'idle', 
    facing: 'right' 
};

let platforms = [
    { x: 0, y: canvas.height - PLATFORM_HEIGHT, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT },
    { x: 90, y: canvas.height - PLATFORM_HEIGHT, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT },
    { x: 180, y: canvas.height - PLATFORM_HEIGHT, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT },
    { x: 270, y: canvas.height - PLATFORM_HEIGHT, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT },
    { x: 360, y: canvas.height - PLATFORM_HEIGHT, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT },
    { x: 450, y: canvas.height - PLATFORM_HEIGHT, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT },
    { x: 540, y: canvas.height - PLATFORM_HEIGHT, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT },
    { x: 630, y: canvas.height - PLATFORM_HEIGHT, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT },
    { x: 720, y: canvas.height - PLATFORM_HEIGHT, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT },
    { x: 810, y: canvas.height - PLATFORM_HEIGHT, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT },
    { x: 900, y: canvas.height - PLATFORM_HEIGHT, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT },
    { x: 990, y: canvas.height - PLATFORM_HEIGHT, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT },
    { x: 1080, y: canvas.height - PLATFORM_HEIGHT, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT },
    { x: 1170, y: canvas.height - PLATFORM_HEIGHT, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT },
    { x: 1260, y: canvas.height - PLATFORM_HEIGHT, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT },
    { x: 1350, y: canvas.height - PLATFORM_HEIGHT, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT },


    { x: 300, y: 400, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT },
    { x: 500, y: 300, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT }
];

function drawPlayer() {
    let currentImage;
    let frameCount;
    let animationSpeed;

    switch (player.state) {
        case 'running':
            currentImage = runImage;
            frameCount = player.runFrameCount;
            animationSpeed = player.animationSpeed;
            break;
        case 'jumping':
            currentImage = jumpImage;
            frameCount = player.jumpFrameCount;
            animationSpeed = player.jumpAnimationSpeed; 
            break;
        case 'idle':
        default:
            currentImage = idleImage;
            frameCount = player.idleFrameCount;
            animationSpeed = player.animationSpeed;
            break;
    }

    if (player.facing === 'right') {
        ctx.drawImage(
            currentImage,
            player.frameX * player.frameWidth, 
            player.frameY * player.frameHeight, 
            player.frameWidth, 
            player.frameHeight, 
            player.x, 
            player.y, 
            player.width, 
            player.height 
        );
    } else {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
            currentImage,
            player.frameX * player.frameWidth, 
            player.frameY * player.frameHeight, 
            player.frameWidth, 
            player.frameHeight, 
            -player.x - player.width, 
            player.y, 
            player.width, 
            player.height 
        );
        ctx.restore();
    }

    if (player.frameCount++ >= animationSpeed) { 
        player.frameCount = 0;
        player.frameX = (player.frameX + 1) % frameCount; 
    }
}

function drawPlatforms() {
    platforms.forEach(platform => {
        ctx.drawImage(platformImage, platform.x, platform.y, platform.width, platform.height)
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

    if (player.dy < 0 || player.dy > 0) {
        player.state = 'jumping';
    } else if (player.dx !== 0) {
        player.state = 'running';
    } else {
        player.state = 'idle';
    }

    if (player.dx < 0) {
        player.facing = 'left';
    } else if (player.dx > 0) {
        player.facing = 'right';
    }
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
        player.dx = -3;
    } else if (e.code === 'ArrowRight') {
        player.dx = 3;
    } else if (e.code === 'Space' || e.code === 'ArrowUp') {
        player.jump = true;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        player.dx = 0;
    }
});

Promise.all([
    new Promise((resolve) => { idleImage.onload = resolve; }),
    new Promise((resolve) => { runImage.onload = resolve; }),
    new Promise((resolve) => { jumpImage.onload = resolve; }),
]).then(() => {
    gameLoop();
});
