let Room = function (width, height, enterFrom = 'left', secondDoor = false) {
    game.assignId(this)
    this.width = width
    this.height = height
    this.floorPatternSeed = Math.floor(Math.random() * 11) + 6
    this.wallPatternSeed = Math.floor(Math.random() * 40) + (40 - width)
    this.secondDoor = secondDoor
    this.walkers = []
    this.doors = []
    this.grid = {}
    forEachInMatrix(width, height, (x, y) => {
        this.grid[x] = this.grid[x] ? this.grid[x] : {}
        this.grid[x][y] = new Cell ()
    })
    this.buildColumns()
    this.buildDoors(enterFrom)
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

Room.prototype.buildDoors = function (side) {
    side = 'right'
    let firstY = (Math.floor(Math.random() * this.height))
    let door = new Door (
        side === 'right' ? this.width - 1 : 0,
        firstY,
        this,
        null,
        side
    )
    this.doors.push(door)
    if (this.secondDoor || (!Math.floor(Math.random() * 10))) {
        let i = 0
        let secondY = (Math.floor(Math.random() * this.height))
        while (i < 1000 && Math.abs(firstY - secondY) <= 2 ) {
          secondY = (Math.floor(Math.random() * this.height))
          i++
        }
        let secondDoor = new Door (
            side === 'right' ? this.width - 1 : 0,
            secondY,
            this,
            null,
            side
        )
        this.doors.push(secondDoor)
    }
}

Room.prototype.gridAt = function (x, y) {
    if (!this.grid[x]) {
        return 'offgrid'
    } else if (!this.grid[x][y]) {
        return 'offgrid'
    } else if (this.grid[x][y].door) {
        return this.grid[x][y].door
    } else {
        return this.grid[x][y].content
    }
}

Room.prototype.gridBlockedAt = function (x, y) {
    if (!this.grid[x]) {
        return 'offgrid'
    } else if (!this.grid[x][y]) {
        return 'offgrid'
    } else {
        if (this.grid[x][y].content) {
            return this.grid[x][y].content.blocking
        }
        return false
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

let Cell = function () {
    this.content = null
}
