let setupControls = () => {
    window.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'a':
            case 'ArrowLeft':
                game.player.direction.x = -1
                game.player.sprite = game.player.spriteSet['walk-left']
                break
            case 'w':
            case 'ArrowUp':
                game.player.direction.y = -1
                break;
            case 'd':
            case 'ArrowRight':
                game.player.direction.x = 1
                game.player.sprite = game.player.spriteSet['walk-right']
                break;
            case 's':
            case 'ArrowDown':
                game.player.direction.y = 1
                break;
        }
    })

    window.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'a':
            case 'ArrowLeft':
                game.player.direction.x = 0
                break
            case 'w':
            case 'ArrowUp':
                game.player.direction.y = 0
                break;
            case 'd':
            case 'ArrowRight':
                game.player.direction.x = 0
                break;
            case 's':
            case 'ArrowDown':
                game.player.direction.y = 0
                break;
        }
    })
}
