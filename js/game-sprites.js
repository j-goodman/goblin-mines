let loadSprites = () => {
    game.spriteSets = {}
    let allImages = []

    let goblinRight = new Image ()
    let goblinLeft = new Image ()
    goblinRight.src = 'images/goblin_walk-right.png'
    goblinLeft.src = 'images/goblin_walk-left.png'
    allImages.push(goblinRight)
    allImages.push(goblinLeft)
    game.spriteSets.goblin = {
      'walk-right': new Sprite (goblinRight, 8),
      'walk-left': new Sprite (goblinLeft, 8),
    }

    let trollRight = new Image ()
    let trollLeft = new Image ()
    trollRight.src = 'images/troll_walk-right.png'
    trollLeft.src = 'images/troll_walk-left.png'
    allImages.push(trollRight)
    allImages.push(trollLeft)
    game.spriteSets.troll = {
      'walk-right': new Sprite (trollRight, 8),
      'walk-left': new Sprite (trollLeft, 8),
    }

    let floors = [
        new Image (),
        new Image (),
        new Image (),
        new Image (),
    ]
    floors[0].src = 'images/floors/dirt-0.png'
    floors[1].src = 'images/floors/dirt-1.png'
    floors[2].src = 'images/floors/dirt-2.png'
    floors[3].src = 'images/floors/dirt-3.png'
    floors.forEach(floor => {
        allImages.push(floor)
    })
    game.spriteSets.floor = {
      'dirt-0': new Sprite (floors[0], 1),
      'dirt-1': new Sprite (floors[1], 1),
      'dirt-2': new Sprite (floors[2], 1),
      'dirt-3': new Sprite (floors[3], 1),
    }

    let columns = [
        new Image (),
        new Image (),
        new Image (),
        new Image (),
    ]
    columns[0].src = 'images/column-0.png'
    columns[1].src = 'images/column-1.png'
    columns[2].src = 'images/column-2.png'
    columns.forEach(column => {
        allImages.push(column)
    })
    game.spriteSets.column = {
      'column-0': new Sprite (columns[0], 1),
      'column-1': new Sprite (columns[1], 1),
      'column-2': new Sprite (columns[2], 1),
    }

    let loadInterval = setInterval(() => {
        let finished = true
        allImages.forEach(img => {
            if (finished && !img.complete) {
                finished = false
            }
        })
        if (finished) {
            clearInterval(loadInterval)
            window.spritesLoaded()
        }
    }, 250)
}
