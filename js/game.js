onload = () => {
    window.canvas = document.getElementsByTagName('canvas')[0]
    window.ctx = canvas.getContext('2d')
    loadSprites()
    window.spritesLoaded = () => {
        setupGame()
    }
}

game = {}
game.objects = {}
game.nextId = 0
game.time = 0
game.framerate = 3
game.assignId = (thing) => {
    thing.id = game.nextId
    game.objects[thing.id] = thing
    game.nextId++
}

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

let drawLine = (ax, ay, bx, by) => {
    ctx.strokeStyle = '#333'
    ctx.beginPath()
    ctx.moveTo(ax, ay)
    ctx.lineTo(bx, by)
    ctx.stroke()
}

let drawRoom = (width, height) => {
    let x = 0 ; let y = 0
    let gridWidth = canvas.width - 40
    let gridHeight = canvas.height - 240
    game.displayOrigin = {x: 380, y: 550}
    game.cellSize = {width: gridWidth / width, height: gridHeight / height}
    while (y <= height) {
        drawLine(20, 180 + gridHeight / height * y, 1260, 180 + gridHeight / height * y)
        y++
    }
    while (x <= width) {
        drawLine(20 + gridWidth / width * x, 180, 20 + gridWidth / width * x, 900)
        x++
    }

    // Draw floors
    y = 0
    while (y < height) {
        x = 0
        while (x < width) {
            let type = Math.abs(x + y - (x * x)) % game.room.floorSmoothness
            type = type > 3 ? 2 : type
            game.spriteSets.floor[`dirt-${type}`].draw(x * game.cellSize.width + 400, y * game.cellSize.height + 440, game.cellSize.width + 8)
            x++
        }
        y++
    }
}

let setupGame = () => {
    game.room = new Room (10, 10)
    game.player = new Walker (3, 3, game.spriteSets.goblin, game.room)
    setupControls()
    game.update()
    game.interval = setInterval(() => {
        game.update()
        game.room.walkers.forEach(walker => {
            walker.act()
        })
        game.time++
    }, 30)
}

game.update = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawRoom(game.room.width, game.room.height)
    game.room.draw()
}

let Cell = function () {
    this.content = null
}

let Room = function (width, height) {
    game.assignId(this)
    this.width = width
    this.height = height
    this.floorSmoothness = Math.floor(Math.random() * 6) + 7
    this.walkers = []
    this.grid = {}
    forEachInMatrix(width, height, (x, y) => {
        this.grid[x] = this.grid[x] ? this.grid[x] : {}
        this.grid[x][y] = new Cell ()
    })
}

Room.prototype.draw = function () {
    forEachInMatrix(this.width, this.height, (x, y) => {
        let cell = this.grid[x][y]
        if (cell.content) {
            cell.content.draw()
        }
    })
}

let Walker = function (x, y, spriteSet, room) {
    game.assignId(this)
    this.room = room
    this.walking = false
    this.intervalAction = null
    this.speed = 8
    room.walkers.push(this)
    this.spriteSet = spriteSet
    this.sprite = spriteSet['walk-right']
    this.pos = {
        x: x,
        y: y,
    }
    this.offset = {
        x: 0,
        y: 0,
    }
    this.direction = {
        x: 0,
        y: 0,
    }
    room.grid[x][y].content = this
}

Walker.prototype.draw = function () {
    this.sprite.draw(
        game.displayOrigin.x + game.cellSize.width * this.pos.x + this.offset.x,
        game.displayOrigin.y + game.cellSize.height * this.pos.y + this.offset.y,
        game.cellSize.width * 1.1,
    )
}

Walker.prototype.move = function (x, y) {
    this.offset.x = 0
    this.offset.y = 0
    this.room.grid[this.pos.x][this.pos.y].content = null
    this.pos.x += x
    this.pos.y += y
    this.room.grid[this.pos.x][this.pos.y].content = this
    this.moving = false
    if (!this.direction.x && !this.direction.y) {
        this.sprite.frame = 0
    }
}

Walker.prototype.walk = function (x, y) {
    this.moving = true
    this.walkDirection = {
        x: x,
        y: y,
    }

    // Check for obstacles
    if (
        !this.room.grid[this.pos.x + this.walkDirection.x] ||
        !this.room.grid[this.pos.x + this.walkDirection.x][this.pos.y + this.walkDirection.y] ||
        this.room.grid[this.pos.x + this.walkDirection.x][this.pos.y + this.walkDirection.y].content
    ) {
        let xPath = this.room.grid[this.pos.x + this.walkDirection.x]
        let yPath = this.room.grid[this.pos.y + this.walkDirection.y]
        if (!xPath || xPath.content) {
            this.walkDirection.x = 0
        }
        if (!yPath || yPath.content) {
            this.walkDirection.y = 0
        }
    }

    // Assign directional sprite
    if (this.walkDirection.x === -1) {
        this.sprite = this.spriteSet['walk-left']
    } else if (this.walkDirection.x === 1) {
        this.sprite = this.spriteSet['walk-right']
    } else if ((this.pos.x + this.pos.y) % 4 === 0 && this.walkDirection.y) {
        this.sprite = this.sprite === this.spriteSet['walk-right'] ?
        this.spriteSet['walk-left']:
        this.spriteSet['walk-right']
    }
}

Walker.prototype.manageWalk = function () {
    let walkDirection = this.walkDirection
    if (game.time % game.framerate === 0) {
        this.sprite.advance()
    }
    this.offset.x += walkDirection.x * this.speed * game.cellSize.width / 100
    this.offset.y += walkDirection.y * this.speed * game.cellSize.height / 100
    if (Math.abs(this.offset.x) > game.cellSize.width) {
        this.offset.x = 0
        this.move(walkDirection.x, walkDirection.y)
    }
    if (Math.abs(this.offset.y) > game.cellSize.height) {
        this.offset.y = 0
        this.move(walkDirection.x, walkDirection.y)
    }
    if (walkDirection.x === 0 && walkDirection.y === 0) {
        this.offset.x = 0
        this.offset.y = 0
        this.move(0, 0)
    }
}

Walker.prototype.act = function (x, y) {
    if (this.moving) {
        this.manageWalk()
    } else if (this.direction.x || this.direction.y) {
        this.walk(this.direction.x, this.direction.y)
    }
}
