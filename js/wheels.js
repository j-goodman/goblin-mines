window.forEachInMatrix = (width, height, action) => {
    let y = 0
    while (y < height) {
        let x = 0
        while (x < width) {
            action(x, y, width, height)
            x++
        }
        y++
    }
}
