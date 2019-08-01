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
