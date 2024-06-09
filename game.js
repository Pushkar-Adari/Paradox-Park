const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const PLAYER_WIDTH = 70;
const PLAYER_HEIGHT = 70;
const PLAYER_GRAVITY = 0.3;
const PLAYER_JUMP_STRENGTH = 12;
const PLATFORM_WIDTH = 100;
const PLATFORM_HEIGHT = 20;
let highestPlatformY = canvas.height;
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
    { x: 1350, y: canvas.height - PLATFORM_HEIGHT, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT }
];
const fireImage = new Image();
fireImage.src = 'fire.png';

const FIRE_FRAME_WIDTH = 72;
const FIRE_FRAME_HEIGHT = 72;
const FIRE_FRAME_COUNT = 8;
let fireFrameIndex = 0;
const FIRE_ANIMATION_SPEED = 10; 
let fireAnimationCounter = 0;

const FIRE_COUNT = 20; 
const FIRE_SPACING = canvas.width / FIRE_COUNT;

function drawFire() {
    for (let i = 0; i < FIRE_COUNT; i++) {
        ctx.drawImage(
            fireImage,
            fireFrameIndex * FIRE_FRAME_WIDTH,
            0,
            FIRE_FRAME_WIDTH,
            FIRE_FRAME_HEIGHT,
            i * FIRE_SPACING,  
            canvas.height - FIRE_FRAME_HEIGHT,  
            FIRE_FRAME_WIDTH,
            FIRE_FRAME_HEIGHT
        );
    }

    if (fireAnimationCounter % FIRE_ANIMATION_SPEED === 0) {
        fireFrameIndex = (fireFrameIndex + 1) % FIRE_FRAME_COUNT;
    }

    fireAnimationCounter++;
}
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
        ctx.drawImage(platformImage, platform.x, platform.y, platform.width, platform.height);
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
    
    if (player.y < canvas.height / 2) {
        const scrollAmount = canvas.height / 2 - player.y;
        player.y = canvas.height / 2;
        platforms.forEach(platform => {
            platform.y += scrollAmount;
        });
        highestPlatformY += scrollAmount;
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
function endGame() {
    console.log("Game Over");
    cancelAnimationFrame(gameLoop);
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

    generateNewPlatforms();

    platforms = platforms.filter(platform => platform.y < canvas.height);

    highestPlatformY = Math.min(...platforms.map(platform => platform.y));
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function generateNewPlatforms() {
    const maxJumpDistance = 150; 
    const clusterSize = 2; 
    const clusterWidth = PLATFORM_WIDTH * clusterSize; 
    const clusterGap = 50; 
    const maxClusterHeight = 200; 
    const leftBound = canvas.width * 0.25;
    const rightBound = canvas.width * 0.75 - PLATFORM_WIDTH;

    while (highestPlatformY > player.y - canvas.height) {
        const isCluster = Math.random() < 0.2; 

        if (isCluster) {
            // Create a cluster of platforms
            const clusterX = Math.random() * (rightBound - leftBound - clusterWidth) + leftBound;
            const clusterY = highestPlatformY - (Math.random() * 50 + maxClusterHeight / clusterSize);
            
            for (let i = 0; i < clusterSize; i++) {
                platforms.push({
                    x: clusterX + i * PLATFORM_WIDTH,
                    y: clusterY,
                    width: PLATFORM_WIDTH,
                    height: PLATFORM_HEIGHT
                });
            }

            highestPlatformY = clusterY;
        } else {
            let newPlatformX = player.x + (Math.random() * 2 - 1) * maxJumpDistance;

            newPlatformX = Math.max(leftBound, Math.min(newPlatformX, rightBound));

            const newPlatformY = highestPlatformY - (Math.random() * 50 + maxClusterHeight / clusterSize);

            platforms.push({ x: newPlatformX, y: newPlatformY, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT });
            highestPlatformY = newPlatformY;
        }
    }
}
function gameLoop() {
    clearCanvas();

    drawPlatforms();
    drawPlayer();
    drawFire(); 

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
