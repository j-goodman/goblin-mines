let loadAudio = () => {
    game.soundLibrary = {}
    game.soundLibrary['footfall-dirt'] = document.getElementById('footfall-dirt');
    game.soundLibrary['door-dirt'] = document.getElementById('door-dirt');
}

game.playAudio = (file) => {
    if (!game.soundLibrary[file]) {
        console.log(`No audio file ${file}`)
        return false
    }
    // game.soundLibrary[file].currentTime = 0
    game.soundLibrary[file].play()
}
