/*
    Random integer
 */
function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

function gameOver() {
    const data = {
        name: player.name,
        points: points,
        type: type
    };
    points = 0;
    document.querySelector('.game-over').classList.add('on');
}
/*
    Restart Game
 */
function next() {
    player.hp -= 1;

    clearInterval(ints.enemy);
    clearInterval(ints.run);
    clearInterval(ints.bullet);
    clearInterval(ints.generateEnemy);
    clearInterval(ints.enemyBullet);
    clearInterval(ints.checkEnemyBulletForPlayer);
    clearInterval(ints.enemyShots);

    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach((enemy) => {
        enemy.parentNode.removeChild(enemy);
    });

    let enemyBullets = document.querySelectorAll('.enemy-bullet');
    enemyBullets.forEach((bullet) => {
        bullet.parentNode.removeChild(bullet);
    });

    let bullets = document.querySelectorAll('.bullet');
    bullets.forEach((bullet) => {
        bullet.parentNode.removeChild(bullet);
    });

    player.el.parentNode.removeChild(player.el);

    if (player.hp === 0) {
        return gameOver();
    }

    game();
}
/*
    Init
 */
function init() {
    if (player.hp === 0) {
        player.hp = 2;
        points = 0;
    }

    $('.inner-name').text(player.name);

    document.querySelector('.game-over').classList.remove('on');

    player.x = gameZone.getBoundingClientRect().width / 2 - player.w;
    player.y = gameZone.getBoundingClientRect().height - player.h;

    gameZone.innerHTML += `<div class="player" style="left: ${player.x}px; top: ${player.y}px;"></div>`;
    player.el = document.querySelector('.player');
    if (player.hp === 2){
        document.querySelector('.life').innerHTML = `<img src="tanks/sprites/heart-1.png" class="life__image">`;
    }
    if (player.hp === 1){
        document.querySelector('.life').innerHTML = `<img src="tanks/sprites/heart-2.png" class="life__image">`;
    }
    if (player.hp === 0){
        document.querySelector('.life').innerHTML = `<img src="tanks/sprites/heart-3.png" class="life__image">`;
    }
}
/*
    Intervals
 */
function intervals() {
    ints.run = setInterval(() => {
        if (player.run) {
            if (player.side === 1){
                if (player.y > 0) {
                    player.y -= player.step;
                    player.el.style.top = `${player.y}px`;
                }
            }
            if (player.side === 3){
                if (player.y < gameZone.getBoundingClientRect().bottom - player.h - 2) {
                    player.y += player.step;
                    player.el.style.top = `${player.y}px`;
                }
            }
            if (player.side === 2){
                if (player.x < gameZone.getBoundingClientRect().right - player.w - 2) {
                    player.x += player.step;
                    player.el.style.left = `${player.x}px`;
                }
            }
            if (player.side === 4){
                if (player.x > 0) {
                    player.x -= player.step;
                    player.el.style.left = `${player.x}px`;
                }
            }
        }
    }, fps);
    ints.bullet = setInterval(() => {
        let bullets = document.querySelectorAll('.bullet');
        bullets.forEach((bullet) => {
            let direction = bullet.getAttribute('direction');
            if (direction === 'top'){
                if (bullet.getBoundingClientRect().top < 0) {
                    bullet.parentNode.removeChild(bullet);
                } else {
                    bullet.style.top = bullet.getBoundingClientRect().top - bulletSpeed + 'px';
                }
            }
            if (direction === 'right'){
                if (bullet.getBoundingClientRect().right > gameZone.getBoundingClientRect().width) {
                    bullet.parentNode.removeChild(bullet);
                } else {
                    bullet.style.left = bullet.getBoundingClientRect().left + bulletSpeed + 'px';
                }
            }
            if (direction === 'bottom'){
                if (bullet.getBoundingClientRect().bottom > gameZone.getBoundingClientRect().height) {
                    bullet.parentNode.removeChild(bullet);
                } else {
                    bullet.style.top = bullet.getBoundingClientRect().top + bulletSpeed + 'px';
                }
            }
            if (direction === 'left'){
                if (bullet.getBoundingClientRect().left < 0) {
                    bullet.parentNode.removeChild(bullet);
                } else {
                    bullet.style.left = bullet.getBoundingClientRect().left - bulletSpeed + 'px';
                }
            }
        })
    }, fps);
    ints.enemyBullet = setInterval(() => {
        let bullets = document.querySelectorAll('.enemy-bullet');
        bullets.forEach((bullet) => {
            let direction = bullet.getAttribute('direction');
            if (direction === 'top'){
                if (bullet.getBoundingClientRect().top < 0) {
                    bullet.parentNode.removeChild(bullet);
                } else {
                    bullet.style.top = bullet.getBoundingClientRect().top - enemyBulletSpeed + 'px';
                }
            }
            if (direction === 'right'){
                if (bullet.getBoundingClientRect().right > gameZone.getBoundingClientRect().width) {
                    bullet.parentNode.removeChild(bullet);
                } else {
                    bullet.style.left = bullet.getBoundingClientRect().left + enemyBulletSpeed + 'px';
                }
            }
            if (direction === 'bottom'){
                if (bullet.getBoundingClientRect().bottom > gameZone.getBoundingClientRect().height) {
                    bullet.parentNode.removeChild(bullet);
                } else {
                    bullet.style.top = bullet.getBoundingClientRect().top + enemyBulletSpeed + 'px';
                }
            }
            if (direction === 'left'){
                if (bullet.getBoundingClientRect().left < 0) {
                    bullet.parentNode.removeChild(bullet);
                } else {
                    bullet.style.left = bullet.getBoundingClientRect().left - enemyBulletSpeed + 'px';
                }
            }
        })
    }, fps)
    ints.enemy = setInterval(() => {
        let enemies = document.querySelectorAll('.enemy');
        enemies.forEach((enemy) => {
            const playerPosTop = player.el.getBoundingClientRect().top,
                playerPosRight = player.el.getBoundingClientRect().right,
                playerPosBottom = player.el.getBoundingClientRect().bottom,
                playerPosLeft = player.el.getBoundingClientRect().left,
                enemyPosTop = enemy.getBoundingClientRect().top,
                enemyPosRight = enemy.getBoundingClientRect().right,
                enemyPosBottom = enemy.getBoundingClientRect().bottom,
                enemyPosLeft = enemy.getBoundingClientRect().left;
            if (
                playerPosTop < enemyPosBottom &&
                playerPosBottom > enemyPosTop &&
                playerPosRight > enemyPosLeft &&
                playerPosLeft < enemyPosRight
            ) {
                next();
            }
            let bullets = document.querySelectorAll('.bullet');

            bullets.forEach((bullet) => {
                let direction = bullet.getAttribute('direction');

                if (['top', 'left', 'right'].includes(direction)) {
                    if (
                        bullet.getBoundingClientRect().top < enemy.getBoundingClientRect().bottom &&
                        bullet.getBoundingClientRect().bottom > enemy.getBoundingClientRect().top &&
                        bullet.getBoundingClientRect().right > enemy.getBoundingClientRect().left &&
                        bullet.getBoundingClientRect().left < enemy.getBoundingClientRect().right
                    ) {
                        enemy.parentNode.removeChild(enemy);
                        bullet.parentNode.removeChild(bullet);
                        points += 1;
                        document.querySelector('.inner-points').innerText = points;
                    }
                } else {
                    if (
                        bullet.getBoundingClientRect().bottom > enemy.getBoundingClientRect().top &&
                        bullet.getBoundingClientRect().right > enemy.getBoundingClientRect().left &&
                        bullet.getBoundingClientRect().left < enemy.getBoundingClientRect().right
                    ) {
                        enemy.parentNode.removeChild(enemy);
                        bullet.parentNode.removeChild(bullet);
                        points += 1;
                        document.querySelector('.inner-points').innerText = points;
                    }
                }
            });
            let direction = enemy.getAttribute('direction');
            if (direction === 'top'){
                if (enemy.getBoundingClientRect().top <= 0) {
                    enemy.parentNode.removeChild(enemy);
                } else {
                    enemy.style.top = enemy.getBoundingClientRect().top - 3 + 'px';
                }
            }
            if (direction === 'right'){
                if (enemy.getBoundingClientRect().left <= 0) {
                    enemy.parentNode.removeChild(enemy);
                } else {
                    enemy.style.left = enemy.getBoundingClientRect().left - 3 + 'px';
                }
            }
            if (direction === 'bottom'){
                if (enemy.getBoundingClientRect().bottom >= gameZone.getBoundingClientRect().height) {
                    enemy.parentNode.removeChild(enemy);
                } else {
                    enemy.style.top = enemy.getBoundingClientRect().top + 3 + 'px';
                }
            }
            if (direction === 'left'){
                if (enemy.getBoundingClientRect().left >= gameZone.getBoundingClientRect().width) {
                    enemy.parentNode.removeChild(enemy);
                } else {
                    enemy.style.left = enemy.getBoundingClientRect().left + 3 + 'px';
                }
            }
        })
    }, fps);
    ints.generateEnemy = setInterval(() => {
        let direction = randomInteger(1, 4);
        if (direction === 1){
            gameZone.innerHTML += `<div class="enemy" style="transform: rotate(-90deg); top: ${gameZone.getBoundingClientRect().height - player.h}px; left: ${randomInteger(0, gameZone.getBoundingClientRect().width - player.w)}px" direction="top"></div>`;
        }
        if (direction === 2){
            gameZone.innerHTML += `<div class="enemy" style="transform: rotate(-180deg); top: ${randomInteger(0, gameZone.getBoundingClientRect().height - player.h)}px; left: ${gameZone.getBoundingClientRect().width - player.w}px;" direction="right"></div>`;
        }
        if (direction === 3){
            gameZone.innerHTML += `<div class="enemy" style="transform: rotate(90deg); top: 0; left: ${randomInteger(0, gameZone.getBoundingClientRect().width - player.w)}px;" direction="bottom"></div>`;
        }
        if (direction === 4){
            gameZone.innerHTML += `<div class="enemy" style="top: ${randomInteger(0, gameZone.getBoundingClientRect().height - player.h)}px; left: 0;" direction="left"></div>`;
        }
        player.el = document.querySelector('.player');
    }, enemyGenerateSpeed);
    ints.enemyShots = setInterval(() => {
        let enemies = document.querySelectorAll('.enemy');
        enemies.forEach((enemy) => {
            let direction = enemy.getAttribute('direction');
            if (direction === 'top'){
                if (
                    player.el.getBoundingClientRect().bottom < enemy.getBoundingClientRect().top &&
                    player.el.getBoundingClientRect().right > enemy.getBoundingClientRect().left &&
                    player.el.getBoundingClientRect().right < enemy.getBoundingClientRect().right
                ) {
                    gameZone.innerHTML += `<div class="enemy-bullet" direction="top" style="left: ${enemy.getBoundingClientRect().left + enemy.getBoundingClientRect().width / 2 - 10}px; top: ${enemy.getBoundingClientRect().top}px;"></div>`;
                    player.el = document.querySelector('.player');
                }
                if (enemy.getBoundingClientRect().top <= 0) {
                    enemy.parentNode.removeChild(enemy);
                } else {
                    enemy.style.top = enemy.getBoundingClientRect().top - 3 + 'px';
                }
            }
            if (direction === 'right'){
                if (
                    player.el.getBoundingClientRect().top > enemy.getBoundingClientRect().top &&
                    player.el.getBoundingClientRect().top < enemy.getBoundingClientRect().bottom &&
                    player.el.getBoundingClientRect().right < enemy.getBoundingClientRect().left
                ) {
                    gameZone.innerHTML += `<div class="enemy-bullet" direction="left" style="left: ${enemy.getBoundingClientRect().left}px; top: ${enemy.getBoundingClientRect().top + 30}px;"></div>`;
                    player.el = document.querySelector('.player');
                }
                if (enemy.getBoundingClientRect().left <= 0) {
                    enemy.parentNode.removeChild(enemy);
                } else {
                    enemy.style.left = enemy.getBoundingClientRect().left - 3 + 'px';
                }
            }
            if (direction === 'bottom'){
                if (
                    player.el.getBoundingClientRect().top > enemy.getBoundingClientRect().bottom &&
                    player.el.getBoundingClientRect().right > enemy.getBoundingClientRect().left &&
                    player.el.getBoundingClientRect().right < enemy.getBoundingClientRect().right
                ) {
                    gameZone.innerHTML += `<div class="enemy-bullet" direction="bottom" style="left: ${enemy.getBoundingClientRect().left + enemy.getBoundingClientRect().width / 2 - 10}px; top: ${enemy.getBoundingClientRect().bottom}px;"></div>`;
                    player.el = document.querySelector('.player');
                }
                if (enemy.getBoundingClientRect().bottom >= gameZone.getBoundingClientRect().height) {
                    enemy.parentNode.removeChild(enemy);
                } else {
                    enemy.style.top = enemy.getBoundingClientRect().top + 3 + 'px';
                }
            }
            if (direction === 'left'){
                if (
                    player.el.getBoundingClientRect().top > enemy.getBoundingClientRect().top &&
                    player.el.getBoundingClientRect().top < enemy.getBoundingClientRect().bottom &&
                    player.el.getBoundingClientRect().left > enemy.getBoundingClientRect().right
                ) {
                    gameZone.innerHTML += `<div class="enemy-bullet" direction="right" style="left: ${enemy.getBoundingClientRect().right}px; top: ${enemy.getBoundingClientRect().top + enemy.getBoundingClientRect().height / 2 - 10}px;"></div>`;
                    player.el = document.querySelector('.player');
                }
                if (enemy.getBoundingClientRect().left >= gameZone.getBoundingClientRect().width) {
                    enemy.parentNode.removeChild(enemy);
                } else {
                    enemy.style.left = enemy.getBoundingClientRect().left + 3 + 'px';
                }
            }
        })
    }, enemyShotsSpeed)
    ints.checkEnemyBulletForPlayer = setInterval(() => {
        let bullets = document.querySelectorAll('.enemy-bullet');
        bullets.forEach((bullet) => {

            let direction = bullet.getAttribute('direction');

            if (['top', 'left', 'right'].includes(direction)) {
                if (
                    bullet.getBoundingClientRect().top < player.el.getBoundingClientRect().bottom &&
                    bullet.getBoundingClientRect().bottom > player.el.getBoundingClientRect().top &&
                    bullet.getBoundingClientRect().right > player.el.getBoundingClientRect().left &&
                    bullet.getBoundingClientRect().left < player.el.getBoundingClientRect().right
                ) {
                    next();
                    bullet.parentNode.removeChild(bullet);
                }
            } else {
                if (
                    bullet.getBoundingClientRect().bottom > player.el.getBoundingClientRect().top &&
                    bullet.getBoundingClientRect().right > player.el.getBoundingClientRect().left &&
                    bullet.getBoundingClientRect().left < player.el.getBoundingClientRect().right
                ) {
                    next();
                    bullet.parentNode.removeChild(bullet);
                }
            }
        });
    }, fps)
}
/*
    Add Bullet
 */
function addBullet() {
    if (player.side === 1){
        gameZone.innerHTML += `<div class="bullet" direction="top" style="left: ${(player.x + (player.w / 2)) - 7}px; top: ${player.y - 16}px;"></div>`;
    }
    if (player.side === 2){
        gameZone.innerHTML += `<div class="bullet" direction="right" style="left: ${player.x + player.w}px; top: ${player.y + 30}px;"></div>`;
    }
    if (player.side === 3){
        gameZone.innerHTML += `<div class="bullet" direction="bottom" style="left: ${player.x + player.w / 2 - 5}px; top: ${player.y + player.h}px;"></div>`;
    }
    if (player.side === 4){
        gameZone.innerHTML += `<div class="bullet" direction="left" style="left: ${player.x}px; top: ${player.y + player.h / 2 - 10}px;"></div>`;
    }

    player.el = document.querySelector('.player');
}
/*
    Controllers
 */
function controllers() {
    document.addEventListener('keydown', (e) => {
        if (e.keyCode === 38){
            player.el.style.backgroundImage = `url(${player.sprites.top})`;
            player.run = true;
            player.side = 1;
        }
        if (e.keyCode === 40){
            player.el.style.backgroundImage = `url(${player.sprites.bottom})`;
            player.run = true;
            player.side = 3;
        }
        if (e.keyCode === 39){
            player.el.style.backgroundImage = `url(${player.sprites.right})`;
            player.run = true;
            player.side = 2;
        }
        if (e.keyCode === 37){
            player.el.style.backgroundImage = `url(${player.sprites.left})`;
            player.run = true;
            player.side = 4;
        }
        if (e.keyCode === 65){
            addBullet();
        }

    });
    document.addEventListener('keyup', (e) => {
        if ([38, 40, 39, 37].includes(e.keyCode))
            player.run = false;
    })
}
/*
    Start Game
 */
function game() {
    init();
    controllers();
    intervals();
}

let gameZone = document.querySelector('.game-zone'),
    points = 0,
    fps = 1000 / 60,
    player = {
        name: '',
        sprites: {
            top: 'tanks/sprites/player-top.png',
            right: 'tanks/sprites/player-right.png',
            bottom: 'tanks/sprites/player-bottom.png',
            left: 'tanks/sprites/player-left.png',
        },
        el: false,
        x: 500,
        y: 400,
        step: 10,
        run: false,
        side: 1, //1 (top), 2 (right), 3 (bottom), 4 (left),
        w: 78,
        h: 77,
        hp: 2
    },
    bulletSpeed = 10,
    enemyBulletSpeed = 10,
    enemyGenerateSpeed = 1000,
    enemyShotsSpeed = 1000,
    ints = {
        run: false,
        bullet: false,
        enemyBullet: false,
        enemy: false,
        generateEnemy: false,
        enemyShots: false,
        checkEnemyBulletForPlayer: false,
        test: false
    },
    type = '',
    test = []


$('.levels__item').click(function () {
    $('.levels__item').removeClass('active');
    $(this).addClass('active');
    type = $(this).attr('type');
    if (type === 'light'){
        enemyBulletSpeed = 5;
        enemyGenerateSpeed = 2000;
        enemyShotsSpeed = 1500;
    }
    if (type === 'medium'){
        enemyBulletSpeed = 10;
        enemyGenerateSpeed = 1000;
        enemyShotsSpeed = 1000;
    }
    if (type === 'hard'){
        enemyBulletSpeed = 15;
        enemyGenerateSpeed = 500;
        enemyShotsSpeed = 500;
    }
});

$('.start-btn').click(function () {
    player.name = $('.name-input').val();
    $('.start-panel').removeClass('on')
    game();
});