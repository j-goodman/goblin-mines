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
