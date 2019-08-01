let Walker = function (x, y, spriteSet, room) {
    game.assignId(this)
    this.room = room
    this.walking = false
    this.speed = 8
    room.walkers.push(this)
    this.spriteSet = spriteSet
    this.blocking = true
    this.sprite = spriteSet['walk-right']
    this.onDoor = false
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

    if (this.onDoor) {
        if (
            (this.direction.x === 1 && this.onDoor.side === 'right') ||
            (this.direction.x === -1 && this.onDoor.side === 'left')
        ) {
            this.useDoor(this.onDoor)
            this.onDoor = false
        }
    }

    this.checkForObstacles()

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

Walker.prototype.checkForObstacles = function () {
    if (
        this.room.gridBlockedAt( // Check for obstacle at destination
            this.pos.x + this.walkDirection.x, this.pos.y + this.walkDirection.y
        ) ||
        this.walkDirection.x && this.walkDirection.y // if diagonal, check at waypoints
    ) {
        if (this.room.gridBlockedAt(this.pos.x + this.walkDirection.x, this.pos.y)) {
            this.walkDirection.x = 0
        }
        if (this.room.gridBlockedAt(this.pos.x, this.pos.y + this.walkDirection.y)) {
            this.walkDirection.y = 0
        }
        if (this.room.gridBlockedAt(this.pos.x + this.walkDirection.x, this.pos.y + this.walkDirection.y)) {
            this.walkDirection[['x', 'y'][(1 + this.pos.x + this.pos.y) % 2]] = 0
        }
    }
    let walkingOnto = this.room.gridAt(this.pos.x + this.walkDirection.x, this.pos.y + this.walkDirection.y)
    if (walkingOnto) {
        this.checkForDoor(walkingOnto)
    } else {
        this.onDoor = false
    }
}

Walker.prototype.checkForDoor = function (door) {
    if (door.name === 'door') {
        this.onDoor = door
    } else {
        this.onDoor = false
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

Walker.prototype.useDoor = function (door) {
    if (!door.into) {
        door.makeRoom('into')
    }
    if (!door.from) {
        door.makeRoom('from')
    }
    let destination = this.room === door.from ? door.into : door.from
    if (this === game.player) {
        game.room = destination
        game.updateSizing()
    }
    this.room.walkers = this.room.walkers.filter(walker => {
        return walker.id !== this.id
    })
    this.room.grid[this.pos.x][this.pos.y].content = null
    this.pos = {
        x: door.twin.pos.x,
        y: door.twin.pos.y
    }
    destination.walkers.push(this)
    destination.grid[this.pos.x][this.pos.y].content = this
    this.room = destination
}

Walker.prototype.act = function (x, y) {
    if (this.moving) {
        this.manageWalk()
    } else if (this.direction.x || this.direction.y) {
        this.walk(this.direction.x, this.direction.y)
    }
}
