// YEP CANVAS

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

// valor da gravidade do jogo
const gravity = 0.5;


// background
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    }, imageSrc: './assets/background.png'
})

// lojinha massa
const shop = new Sprite({
    position: {
        x: 650,
        y: 160
    }, imageSrc: './assets/shop.png',
    scale: 2.5,
    framesMax: 6
})


// Jogador 1
const player = new Fighter({
    position: {
    x: 250,
    y: 380
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: 0,
        y: 0
    }, imageSrc: './assets/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2,
    offset: {
        x: 205,
        y: 145
    }, 
    sprites: {
        idle: {
            imageSrc: './assets/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './assets/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/samuraiMack/Jump.png',
            framesMax: 2
        }, 
        fall: {
            imageSrc: './assets/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack: {
            imageSrc: './assets/samuraiMack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './assets/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './assets/samuraiMack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: -50,
            y: 50
        }, 
        width: 150,
        height: 50
    }
});

// Jogador 2
const enemy = new Fighter({
    position: {
    x: 700,
    y: 380
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 50,
        y: 0
    }, imageSrc: './assets/kenji/Idle.png',
    framesMax: 4,
    scale: 2,
    offset: {
        x: 215,
        y: 157
    }, 
    sprites: {
        idle: {
            imageSrc: './assets/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './assets/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './assets/kenji/Jump.png',
            framesMax: 2
        }, 
        fall: {
            imageSrc: './assets/kenji/Fall.png',
            framesMax: 2
        },
        attack: {
            imageSrc: './assets/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './assets/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './assets/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: 170,
            y: 50
        }, 
        width: 150,
        height: 50
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}


// Função de animação dos jogadores
function animate() {

    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // Movimento do Jogador Um
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -3
        player.switchSpritePlayer('run');
        } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 3
        player.switchSpritePlayer('run');
    } else {
        player.switchSpritePlayer('idle');
    }

    // pulo
    if (player.velocity.y < 0) {
        player.switchSpritePlayer('jump');
    } else if (player.velocity.y > 0) {
        player.switchSpritePlayer('fall');
    }

    // Movimento do Jogador Dois
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -3
        enemy.switchSpriteEnemy('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 3
        enemy.switchSpriteEnemy('run');
    } else {
        enemy.switchSpriteEnemy('idle');
    }

    // pulo
    if (enemy.velocity.y < 0) {
        enemy.switchSpriteEnemy('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSpriteEnemy('fall');
    }

    // Detecção de "out of bounds"
    if (
        player.position.x <= -50 || player.position.x >= 1084) {
        player.position.x = 500
        player.position.y = 200
    }

    // Detecção de colisão e acertos
    if (
        rectCollision({ 
            rect1: player,
            rect2: enemy
         }) && 
        player.isAttacking && 
        player.attackValidation == true
        ) {
        player.attackValidation = false;
        enemy.takeHitEnemy();
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
        setTimeout(() => {
            player.attackValidation = true
        }, 650);

    }

    // validação de ataque serve pra evitar attack spam
    if (
        rectCollision({ 
            rect1: enemy,
            rect2: player
         }) && 
        enemy.isAttacking && 
        enemy.attackValidation == true
        ) {
        enemy.attackValidation = false;
        player.takeHitPlayer();
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
        setTimeout(() => {
            enemy.attackValidation = true
        }, 500)

        // Finalizar o jogo baseado na vida
        if (player.health <= 0) {
            player.alive = false;
            endgame({ player, enemy, timerId })
        } else if (enemy.health <= 0) {
            enemy.alive = false;
            endgame({ player, enemy, timerId })
        }

    }
}

// Detecção de teclas pressionadas
window.addEventListener('keydown',(event) => {
    if (player.alive) {
        switch(event.key) {

            // Jogador Um
            case 'd':
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
    
            case 'a':
                keys.a.pressed = true;
                player.lastKey = 'a';        
                break;
            case 'w':
                if (player.position.y > 370) {
                    player.velocity.y = -14
                    break
                } else break;
            case ' ':
                player.attackLate();
                break
        } 
    } 
    if (enemy.alive) {
        switch(event.key) {

            // Jogador Dois
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = 'ArrowLeft';
                break;
            case 'ArrowRight':
                keys.ArrowRight.pressed = true;
                enemy.lastKey = 'ArrowRight';
                break;
            case 'ArrowUp':
                if (enemy.position.y > 370) {
                    enemy.velocity.y = -14
                    break
                } else break;
            case 'Insert':
                enemy.attackEarly();
                break
        }
    }

    }
)

// Detecção de teclas NÃO pressionadas
window.addEventListener('keyup',(event) => {
    switch(event.key) {

        // Jogador Um
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;

        // Jogador Dois
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;

    }

})

decreaseTimer();

animate();
