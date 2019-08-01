let Sprite = function (image, frames, offsetX = 0, offsetY = 0) {
    this.image = image
    this.frames = frames
    this.frame = 0
    this.offset = {
        x: offsetX,
        y: offsetY
    }
}

Sprite.prototype.draw = function (x, y, width = 0) {
    width = width ? width : this.image.width
    scale = width / (this.image.width / this.frames)
    ctx.drawImage(
        this.image,
        0 + (this.image.width / this.frames * this.frame),
        0,
        this.image.width / this.frames,
        this.image.height,
        x - (this.image.width / this.frames / 2) + 400 + this.offset.x,
        y - (this.image.height * scale) + 300 + this.offset.y,
        this.image.width / this.frames * scale,
        this.image.height * scale
    )
}

Sprite.prototype.advance = function () {
    this.frame += 1
    if (this.frame >= this.frames) {
        this.frame = 0
        return true
    }
    return false
}
