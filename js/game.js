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

let drawLine = (ax, ay, bx, by) => {
    ctx.strokeStyle = '#333'
    ctx.beginPath()
    ctx.moveTo(ax, ay)
    ctx.lineTo(bx, by)
    ctx.stroke()
}

let drawFloor = (width, height) => {
    let x = 0 ; let y = 0
    let gridWidth = canvas.width - 40
    let gridHeight = canvas.height - 240
    game.displayOrigin = {x: 368, y: 524}
    game.cellSize = {width: gridWidth / width, height: gridHeight / height}
    while (y < height) {
        x = 0
        while (x < width) {
            let type = Math.abs(2 + x + y * 2 - (x * x)) % game.room.floorPatternSeed
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
    drawFloor(game.room.width, game.room.height)
    game.room.draw()
}

let Cell = function () {
    this.content = null
}

let Room = function (width, height) {
    game.assignId(this)
    this.width = width
    this.height = height
    this.floorPatternSeed = Math.floor(Math.random() * 11) + 6
    this.walkers = []
    this.grid = {}
    forEachInMatrix(width, height, (x, y) => {
        this.grid[x] = this.grid[x] ? this.grid[x] : {}
        this.grid[x][y] = new Cell ()
    })
    this.buildColumns()
}

Room.prototype.draw = function () {
    forEachInMatrix(this.width, this.height, (x, y) => {
        let cell = this.grid[x][y]
        if (cell.content) {
            cell.content.draw()
        }
    })
}

Room.prototype.buildColumns = function () {
    // let column = new Block (7, 7, game.spriteSets.column['column-2'], this)
}

let Block = function (x, y, sprite, room) {
    game.assignId(this)
    this.room = room
    this.sprite = sprite
    this.pos = {
        x: x,
        y: y,
    }
    room.grid[x][y].content = this
}

Block.prototype.draw = function () {
    this.sprite.draw(
        game.displayOrigin.x + game.cellSize.width * this.pos.x,
        game.displayOrigin.y + game.cellSize.height * this.pos.y,
        game.cellSize.width,
    )
}
