const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; //800
canvas.height = window.innerHeight; //600

const playerImage = new Image();
const obstacleImage = new Image();
const backgroundImage = new Image();

playerImage.src = 'main.png'; // 주인공 이미지 경로
obstacleImage.src = 'obstacle.png'; // 장애물 이미지 경로
backgroundImage.src = 'background.jpg'; // 배경 이미지 경로

const player = { x: 50, y: canvas.height / 2, width: canvas.height/10, height: canvas.height/10, speed: 5 }; // 크기 조정
const lasers = [];
const obstacles = [];
let obstacleInterval = 2000; // 장애물 생성 간격 (ms)
let gameOver = false;
let moveUp = false;
let moveDown = false;
let score = 0; // 현재 점수
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0; // 최고 점수

// 점수 보드 업데이트
function updateScoreBoard() {
    document.getElementById('score').innerText = score;
    document.getElementById('highScore').innerText = highScore;
}

// 배경 그리기
function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

// 플레이어 그리기
function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

// 레이저 그리기
function drawLasers() {
    ctx.fillStyle = 'red';
    lasers.forEach(laser => {
        ctx.fillRect(laser.x, laser.y, canvas.height/25, canvas.height/100);
        laser.x += 5; // 레이저 이동
    });
}

// 장애물 그리기
function drawObstacles() {
    obstacles.forEach(obs => {
        ctx.drawImage(obstacleImage, obs.x, obs.y, canvas.height/10, canvas.height/10);
        obs.x -= 3; // 장애물 이동
        if (obs.x < 0) {
            gameOver = true; // 장애물이 왼쪽 끝 도달
        }
    });
}

// 장애물 생성
function spawnObstacle() {
    const y = Math.random() * (canvas.height - 30);
    obstacles.push({ x: canvas.width, y: y });
}

// 게임 업데이트
function update() {
    if (gameOver) {
        if (score > highScore) {
            highScore = score; // 최고 점수 업데이트
            localStorage.setItem('highScore', highScore); // 로컬 스토리지에 저장
        }
        alert('게임 종료! 새로 고침합니다.');
        location.reload(); // 새로 고침
        return;
    }

    // 플레이어 이동 처리
    if (moveUp && player.y > 0) {
        player.y -= player.speed; // 위로 이동
    }
    if (moveDown && player.y < canvas.height - player.height) {
        player.y += player.speed; // 아래로 이동
    }

    drawBackground(); // 배경 그리기
    drawPlayer(); // 플레이어 그리기
    drawLasers(); // 레이저 그리기
    drawObstacles(); // 장애물 그리기

    // 레이저와 장애물 충돌 처리
    lasers.forEach((laser, laserIndex) => {
        obstacles.forEach((obs, obsIndex) => {
            if (laser.x > obs.x && laser.x < obs.x + 30 &&
                laser.y > obs.y && laser.y < obs.y + 30) {
                obstacles.splice(obsIndex, 1); // 장애물 제거
                lasers.splice(laserIndex, 1); // 레이저 제거
                score += 10; // 점수 증가
                updateScoreBoard(); // 점수 보드 업데이트
            }
        });
    });

    requestAnimationFrame(update);
}

// 레이저 연속 발사 함수
function shootLasers() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            lasers.push({ x: player.x + player.width, y: player.y + player.height / 2 });
        }, i * 300); // 100ms 간격으로 발사
    }
}

// 키 입력 처리
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        moveUp = true; // 위로 이동
    } else if (e.key === 'ArrowDown') {
        moveDown = true; // 아래로 이동
    } else if (e.key === ' ') { // 스페이스바로 레이저 연속 발사
        shootLasers();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') {
        moveUp = false; // 위로 이동 중지
    } else if (e.key === 'ArrowDown') {
        moveDown = false; // 아래로 이동 중지
    }
});

// 장애물 생성 주기 설정
setInterval(() => {
    spawnObstacle();
}, obstacleInterval);

// 게임 시작
updateScoreBoard(); // 초기 점수 보드 업데이트
update();
