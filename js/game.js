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
