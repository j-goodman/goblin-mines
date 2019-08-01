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

    game.displayOrigin = {x: -7, y: -20}
    game.renderOrigin = {x: 100, y: 0}
    game.room = new Room (size, size)

    game.updateSizing()

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

game.updateSizing = () => {
    let gridWidth = canvas.width - 240
    let gridHeight = canvas.height - 240
    game.cellSize = {
        width: gridWidth / game.room.width, height: gridHeight / game.room.width
    }
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

let Door = function (x, y, from, into, side, twin = null) {
    this.pos = {
        x: x,
        y: y,
    }
    this.twin = twin
    this.from = from
    this.into = into
    this.name = 'door'
    this.side = side
    this.from.grid[x][y].door = this
    this.sprite = game.spriteSets.floor['dirt-0']
}

Door.prototype.draw = function () {
    this.sprite.draw(
        (this.pos.x + (this.side === 'left' ? -1 : 1)) * game.cellSize.width,
        this.pos.y * game.cellSize.height,
        game.cellSize.width + 8
    )
}

Door.prototype.makeRoom = function (inOrOut) {
    let size = Math.floor(Math.random() * 7) + 7
    let newSide = this.side === 'left' ? 'right' : 'left'
    let room = new Room (size, size, newSide)
    this.twin = new Door (newSide === 'left' ? 0 : size -1, Math.floor(Math.random() * size), room, this.from, newSide, this)
    room.doors.push(this.twin)
    this[inOrOut] = room
}

let Block = function (x, y, sprite, room) {
    game.assignId(this)
    this.room = room
    this.sprite = sprite
    this.blocking = true
    this.pos = {
        x: x,
        y: y
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
