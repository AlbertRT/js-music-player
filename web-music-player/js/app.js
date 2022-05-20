let index = 1
let mainAudio = document.querySelector("#mainAudio")
let music = JSON.parse(localStorage.getItem("music"))
let fullscreenCollection = fullscreenContainer.querySelector(".collection")
let currentVolLvl = 100
let container = document.querySelector(".container")
let shufflePlaylist = document.querySelector("#shuffle")

// ! keyboard function
document.addEventListener("keypress", e => {
    let key = e.key
    switch (key) {
        case " ":
            playPause()
            break
        case "s":
            shufflePlaybackE()
            break
        case "r":
            repeatE()
            break
        case "f":
            toggleFullscreen.classList.toggle("active")
            fullscreenMenu.classList.toggle("active")
            break
        case "d": 
            nextMusic()
            playingNow(true)
            break
        case "a":
            prevMusic()
            playingNow(true)
    }
})

const loadMusic = () => {
    let audioExist = fileExsist(`/src/audio/${music[index - 1].audio}.mp3`)
    let coverExist = fileExsist(`/src/cover/${music[index - 1].cover}`)
    // ! check the src audio file is exsist or not
    if (!audioExist) {
        const error = new Message(`Can't play ${music[index - 1].title}, so we skiped to next music`, 4000)
        error.render()
        nextMusic()
    } else {
        mainAudio.src = `/src/audio/${music[index - 1].audio}.mp3`
        if (!songs.classList.contains("play")) songs.classList.toggle("play")
    }

    // ! check if the cover exsist or not, if not show the default one
    if (!coverExist) {
        cover.src = "/src/cover/default.jpg"
        bigCover.src = "/src/cover/default.jpg"
        plyCover.src = "/src/cover/default.jpg"
    } else {
        cover.src = `/src/cover/${music[index - 1].cover}`
        bigCover.src = `/src/cover/${music[index - 1].cover}`
        plyCover.src = `/src/cover/${music[index - 1].cover}`
    }

    title.textContent = music[index - 1].title
    plyTitle.textContent = music[index - 1].title
    artist.textContent = music[index - 1].artist
    plyArtist.textContent = music[index - 1].artist
    album.textContent = music[index - 1].album
    year.textContent = music[index - 1].year
}

// todo: load the data from localstorage

window.addEventListener("load", () => {
    // load the all the musics
    loadMusic()
    playingNow(false)

    // todo: display the header thumbnails

    // ! check if the array less 4
    if (music.length < 4) {
        let cover = document.querySelector("#headCover")
        if (cover.classList.contains("covers")) cover.classList.remove("covers")
        cover.classList.toggle("cover")

        let img = `<img src="/src/cover/${music[0].cover}"</img>`
        cover.insertAdjacentHTML("beforeend", img)
    } else {
        let cover = document.querySelector("#headCover")
        if (cover.classList.contains("cover")) cover.classList.remove("cover")
        cover.classList.toggle("covers")
        for (let i = 0; i < 4; i++) {
            let imgs = `<img src="/src/cover/${music[i].cover}"</img>`
            cover.insertAdjacentHTML("beforeend", imgs)
        }
    }

    // todo: show how many songs that the user have
    let totalSongs = document.querySelector("#total")
    if (music.length < 1) {
        totalSongs.textContent = `${music.length} song`
    } else {
        totalSongs.textContent = `${music.length} songs`
    }

    // todo: handle if the music is ended
    mainAudio.addEventListener("ended", () => {
        let isShuffled = shuffle_playback.classList.contains("shuffle_on")
        let isContainPlay = songs.classList.contains("play")
        if (isContainPlay) songs.classList.remove("play")
        setTimeout(() => {
            songs.classList.toggle("play")
            if (isShuffled) {
                shuffle(true)
            } else {
                let isRepeat = repeat.classList.contains("repeat_one")

                // todo: if the user not repeated the song
                if (!isRepeat) nextMusic()

                // todo: if the user repeatd the song
                mainAudio.currentTime = 0
                loadMusic()
                playMusic()
                playingNow(true)
            }
        }, 250);

        // todo: if the user shuffle the song
    })

    // todo: timeupdate and playbar
    mainAudio.addEventListener("timeupdate", () => {
        let totalTime = mainAudio.duration
        let currentTime = mainAudio.currentTime
        bar.style.width = `${(currentTime / totalTime) * 100}%`

        mainAudio.addEventListener("loadeddata", () => {
            let audioDuration = mainAudio.duration
            let minutes = Math.floor(audioDuration / 60)
            let seconds = Math.floor(audioDuration % 60)

            if (seconds < 10) { // todo: add 0 if second less than 10
                seconds = `0${seconds}`
            }
            song_len.textContent = `${minutes}:${seconds}`
        })
        if (mainAudio.duration > 0) {
            playingNow(true)
        } else {
            playingNow(false)
        }
        let audioCurrentTime = mainAudio.currentTime
        let currentMinutes = Math.floor(audioCurrentTime / 60)
        let currentSeconds = Math.floor(audioCurrentTime % 60)

        if (currentSeconds < 10) { // todo: add 0 if second less than 10
            currentSeconds = `0${currentSeconds}`
        }
        cureDura.textContent = `${currentMinutes}:${currentSeconds}`
    })
    timeline.addEventListener("click", e => {
        let progressWidthVal = timeline.clientWidth
        let clickedX = e.offsetX

        mainAudio.currentTime = (clickedX / progressWidthVal) * mainAudio.duration
        playMusic()
    })

})
// * display all the musics
let ul = document.querySelector(".music-list .collection")
for (let i = 0; i < music.length; i++) {
    let li = `<li li-index="${i + 1}" class=${music[i].title}>
    <div class="order"><span>${i + 1}</span></div>
    <div class="cover"><img src="/src/cover/${music[i].cover}"></div>
    <div class="title"><span>${music[i].title}</span></div>
    <div class="artist"><span>${music[i].artist}</span></div>
    <div class="album"><span>${music[i].album}</span></div>
    <div class="duration" id="${music[i].id}"></div>
    <audio class="${music[i].id}" src="/src/audio/${music[i].audio}.mp3"></audio>
    </li>`

    ul.insertAdjacentHTML("beforeend", li)

    let audioTag = document.querySelector(`.${music[i].id}`)
    let audioDuration = document.querySelector(`#${music[i].id}`)
    audioTag.addEventListener("loadeddata", () => {
        let durations = audioTag.duration
        let min = Math.round(durations / 60)
        let sec = Math.round(durations % 60)
        if (sec < 10) sec = "0" + sec
        audioDuration.innerHTML = `<span>${min}:${sec}</span>`
        audioDuration.setAttribute("t-duration", `${min}:${sec}`)

        // todo: make a total time duration of all the songs

    })
}

// todo: play pause

const playMusic = () => {
    playbar.classList.toggle("paused")
    playPaused.innerHTML = playIco
    mainAudio.play()
}
const pauseMusic = () => {
    playbar.classList.remove("paused")
    playPaused.innerHTML = pausedIco
    mainAudio.pause()
}

playPaused.addEventListener("click", () => {
    playPause()
})
const playPause = () => {
    let isPaused = playbar.classList.contains("paused")
    if (isPaused) {
        pauseMusic()
        playingNow(false)
        return
    }
    playMusic()
    playingNow(true)
}

// todo: next and prev music
const nextMusic = () => {
    index++
    if (index > music.length) index = 1
    let isContainPlay = songs.classList.contains("play")
    if (isContainPlay) songs.classList.toggle("play")
    setTimeout(() => {
        songs.classList.toggle("play")
        loadMusic()
        playMusic()
        playingNow(true)
    }, 250);
}

const prevMusic = () => {
    index--
    if (index < 1) index = music.length
    let isContainPlay = songs.classList.contains("play")
    if (isContainPlay) songs.classList.toggle("play")
    setTimeout(() => {
        songs.classList.toggle("play")
        loadMusic()
        playMusic()
        playingNow(true)
    }, 250);
}

next.addEventListener("click", () => {
    nextMusic()
    playingNow(true)
})
prev.addEventListener("click", () => {
    prevMusic()
    playingNow(true)
})

// todo: repeat
repeat.addEventListener("click", () => {
    repeatE()
})
const repeatE = () => {
    // ! check if the user shuffle the song or not
    let isShuffle = shuffle_playback.classList.contains("shuffle_on")
    if (isShuffle) {
        shuffle_playback.classList.remove("shuffle_on")
        shuffle_playback.classList.remove("active")
    }
    repeat.classList.toggle("active")
    repeat.classList.toggle("repeat_one")
}

// todo: shuffle
const shuffle = (ended) => {
    let endsongs = false
    let isShuffleActive = shuffle_playback.classList.contains("active")
    let isRepeatOne = repeat.classList.contains("repeat_one")

    if (isRepeatOne) {
        shuffle_playback.classList.remove("shuffle_on")
        repeat.classList.remove("active")
    }

    if (!isShuffleActive) return
    let randIndex = Math.floor((Math.random() * music.length) + 1)
    shuffle_playback.classList.toggle("shuffle_on")

    endsongs = ended
    if (endsongs === true) {
        do {
            randIndex = Math.floor((Math.random() * music.length) + 1)
        } while (index == randIndex) {
            index = randIndex
            loadMusic()
            playMusic()
            playingNow(endsongs)
        }
    }
}

shuffle_playback.addEventListener("click", () => {
    // ! check if the playbar contain shuffle class or not
    shufflePlaybackE()
})
const shufflePlaybackE = () => {
    if (!shuffle_playback) {
        shuffle_playback.classList.remove('active')
        return
    } else {
        shuffle_playback.classList.toggle('active')
        shuffle()
    }
}
const shuffle_playlist = () => {
    let containerShuffle = container.classList.contains("shuffle")
    let isRepeatOne = repeat.classList.contains("repeat_one")

    if (isRepeatOne) {
        container.classList.remove("shuffle")
        repeat.classList.remove("active")
    }
    if (!containerShuffle) return
    let randIndex = Math.floor((Math.random() * music.length) + 1)
    container.classList.toggle("shuffle")

    do {
        randIndex = Math.floor((Math.random() * music.length) + 1)
    } while (index == randIndex) {
        index = randIndex
        loadMusic()
        playMusic()
        playingNow(endsongs)
    }
}
shufflePlaylist.addEventListener("click", () => {
    shuffle_playlist()
})

// todo: clicked song function

// show the playing status if the music is playing
let allLiTags = ul.querySelectorAll("li")
const playingNow = (playingStatus) => {
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector('.duration')

        if (playingStatus === false) {
            if (allLiTags[j].classList.contains('playing')) {
                allLiTags[j].classList.remove('playing')

                let adDuration = audioTag.getAttribute("t-duration")
                audioTag.innerText = adDuration
            }
            if (allLiTags[j].getAttribute("li-index") == index) {
                allLiTags[j].classList.toggle('playing')
            }
        } else {
            if (allLiTags[j].classList.contains('playing')) {
                allLiTags[j].classList.remove('playing')

                let adDuration = audioTag.getAttribute("t-duration")
                audioTag.innerText = adDuration
            }
            if (allLiTags[j].getAttribute("li-index") == index) {
                allLiTags[j].classList.toggle('playing')
                audioTag.innerText = 'Playing'
            }
        }
        allLiTags[j].setAttribute('onclick', 'clicked(this)')
    }
}

const clicked = (element) => {
    let getLiIndex = element.getAttribute("li-index")
    let isContainPlay = songs.classList.contains("play")
    if (isContainPlay) songs.classList.remove("play")
    setTimeout(() => {
        songs.classList.toggle("play")
        index = getLiIndex
        loadMusic(index)
        playMusic()
        playingNow(true)
    }, 250);
}

// todo: toggleing the fullscreen mode

const toggleFullscreen = document.querySelector(".fullscreen")
const fullscreenMenu = document.querySelector(".fullscreen-menu")

toggleFullscreen.addEventListener("click", () => {
    toggleFullscreen.classList.toggle("active")
    fullscreenMenu.classList.toggle("active")
})

// todo: show the queue collection
let queueCollections = fullscreenContainer.querySelector(".collection")
for (let i = 0; i < music.length; i++) {
    let li = `<li li-index="${i + 1}" onclick="clicked(this)">
                <div class="cover"><img src="/src/cover/${music[i].cover}"></div>
                <div class="more-data">
                    <div class="title"><span>${music[i].title}</span></div>
                    <div class="artist"><span>${music[i].artist}</span></div>
                </div>
                <div class="duration" id="f_${music[i].id}"><span></span></div>
                <audio class="${music[i].id}" src="/src/audio/${music[i].audio}.mp3"></audio>
            </li>`
    queueCollections.insertAdjacentHTML("beforeend", li)
    let audio = document.querySelector(`.${music[i].id}`)
    let durationTag = document.querySelector(`#f_${music[i].id}`)
    audio.addEventListener("loadeddata", () => {
        let durations = audio.duration
        let min = Math.round(durations / 60)
        let sec = Math.round(durations % 60)
        if (sec < 10) sec = "0" + sec
        durationTag.innerHTML = `<span>${min}:${sec}</span>`
        durationTag.setAttribute("t-duration", `${min}:${sec}`)

        // todo: make a total time duration of all the songs
    })
}

// todo: tabs
const tabs = document.querySelectorAll("[data-tab-target]")
const tabContetns = document.querySelectorAll("[data-tab-content]")
tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
        const target = document.querySelector(tab.dataset.tabTarget)
        tabContetns.forEach(tabContent => tabContent.classList.remove("active"))
        tabs.forEach(tab => tab.classList.remove("active"))
        tab.classList.add("active")
        target.classList.add("active")
    })
})

// todo: lyrics
const lyricsUI = async (title) => {
    let lyricsContent = document.querySelector(".lyrics-container p")
    let isTabLyricsActive = document.querySelector("#lyrics")
    if (!isTabLyricsActive.classList.contains("active")) return

    // ! if contain active class
    let data = await api()
    let lyrics = data.lyrics.split("\n")

    // todo: render the ui
    for (let i = 0; i < lyrics.length; i++) {
        let p = `<p>${lyrics[i]}</p>`
        lyricsContent.insertAdjacentHTML("beforeend", p)
    }
}

// todo: volume controls
let volumeIcon = document.querySelector(".volume-controls .icon")
volume.addEventListener("input", () => {
    let volumeVal = volume.value
    currentVolLvl = volumeVal / 100

    // todo: if the volume is low
    if (volumeVal > 50) {
        volumeIcon.innerHTML = volumeHigh
    }
    if (volumeVal < 50) {
        volumeIcon.innerHTML = volumeLow
    }
    if (volumeVal < 1) {
        volumeIcon.innerHTML = muteIcon
    }
    let mainAudioVol = currentVolLvl
    mainAudio.volume = mainAudioVol
})
volumeIcon.addEventListener("click", () => {
    let volumeControls = document.querySelector(".volume-controls")

    volumeControls.classList.toggle("muted")

    if (volumeControls.classList.contains("muted")) {
        volumeIcon.innerHTML = muteIcon
        mainAudio.volume = 0
        volume.value = 0
        return
    }
    if (currentVolLvl > 50) {
        volumeIcon.innerHTML = volumeHigh
    }
    if (currentVolLvl < 50) {
        volumeIcon.innerHTML = volumeLow
    }

    volume.value = currentVolLvl * 100
    mainAudio.volume = currentVolLvl / 100
})