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

let setupGame = () => {
    let size = Math.floor(Math.random() * 7) + 7
    size = 10

    let gridWidth = canvas.width - 240
    let gridHeight = canvas.height - 240
    game.displayOrigin = {x: -7, y: -20}
    game.renderOrigin = {x: 100, y: 0}
    game.cellSize = {width: gridWidth / size, height: gridHeight / size}

    game.room = new Room (size, size)
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
    game.room.drawDoors()
    game.room.drawFloor()
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
    this.wallPatternSeed = Math.floor(Math.random() * 32) + (40 - width)
    this.walkers = []
    this.doors = []
    this.grid = {}
    forEachInMatrix(width, height, (x, y) => {
        this.grid[x] = this.grid[x] ? this.grid[x] : {}
        this.grid[x][y] = new Cell ()
    })
    this.buildColumns()
    this.buildDoors()
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
    let x = 2 ; let y = 2
    while (y < this.height) {
        x = 2
        while (x < this.width) {
            let type = Math.abs((x * x) + (y * y)) % this.wallPatternSeed
            type = type > 3 ? false : type
            if (type || type === 0) {
                let column = new Block (x - 1, y - 1, game.spriteSets.column[`column-${type}`], this)
            }
            x++
        }
        y++
    }
}

Room.prototype.buildDoors = function () {
    let door = new Door (this.width, (Math.floor(Math.random() * this.height)), this, null)
    this.doors.push(door)
}

Room.prototype.gridAt = function (x, y) {
    if (!this.grid[x]) {
        return 'Empty'
    } else if (!this.grid[x][y]) {
        return 'Empty'
    } else {
        return this.grid[x][y].content

    }
}

Room.prototype.drawFloor = function () {
    let x = 0 ; let y = 0
    let width = this.width; let height = this.height
    while (y < height) {
        x = 0
        while (x < width) {
            let type = Math.abs(2 + x + y * 2 - (x * x)) % game.room.floorPatternSeed
            type = type > 3 ? 2 : type
            game.spriteSets.floor[`dirt-${type}`].draw(x * game.cellSize.width, y * game.cellSize.height, game.cellSize.width + 8)
            x++
        }
        y++
    }
}

Room.prototype.drawDoors = function () {
    this.doors.forEach(door => {
        door.draw()
    })
}

let Door = function (x, y, from, to) {
    this.pos = {
        x: x,
        y: y
    }
    this.offset = {
        x: -3,
        y: 0
    }
    this.sprite = game.spriteSets.door['right']
}

Door.prototype.draw = function () {
    this.sprite.draw(
        game.displayOrigin.x + game.cellSize.width * this.pos.x + this.offset.x,
        game.displayOrigin.y + game.cellSize.height * this.pos.y + this.offset.y,
        game.cellSize.width * 0.78,
    )
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
