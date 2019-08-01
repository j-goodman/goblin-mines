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
