// colisão do retângulo
function rectCollision({ rect1, rect2 }) {
    return (
        rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x
        && rect1.attackBox.position.x <= rect2.position.x + rect2.width
        && rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y
        && rect1.attackBox.position.y <= rect2.position.y + rect2.height
    )
}

// Finalização do jogo
function endgame({ player, enemy, timerId }) {
    clearTimeout(timerId);
    document.querySelector('#mostrar-resultado').style.display = 'flex'

        if (player.health === enemy.health) {
            player.attackValidation = false;
            enemy.attackValidation = false;
            document.querySelector('#mostrar-resultado').innerText = 'Empate'
        } else if (player.health > enemy.health) {
            document.querySelector('#mostrar-resultado').innerText = 'Jogador 1 venceu!'
        } else if (player.health < enemy.health) {
            document.querySelector('#mostrar-resultado').innerText = 'Jogador 2 venceu!'
        }
}

// temporizador
let timer = 10
let timerId
function decreaseTimer() {

    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#temporizador').innerText = timer
    }

    // Finalizar o jogo baseado no fim do tempo
    if (timer === 0) {
        endgame({ player, enemy, timerId })
    }
    
}