let Sprite = function (image, frames) {
    this.image = image
    this.frames = frames
    this.frame = 0
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
        x - (this.image.width / this.frames / 2),
        y - (this.image.height / 2),
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
