const data = async () => {
    try {
        if (!fileExsist(`${mainURL}/src/music.json`)) {
            const notFound = new Message()(`Can't find <b>musics.json</b>`, false)
            notFound.render()
            return
        }
        let data = await fetch("../src/music.json")
        let response = await data.json()

        
        return response
    } catch (err) {
        console.log(err)
        return
    }
}

const localStoreageStore = async () => {
    try {
        // check if the array length is 0
        let result = await data()
        if (result.length == 0) {
            playbar.remove()
            mainAudio.remove()
            document.querySelector(".container").innerHTML = `<p class="null_m">You don't have any music, to add the music edit the <b>music.json</b></p>`
            return
        }
        localStorage.setItem("music", JSON.stringify(result))
    } catch (err) {
        localStoreageStore.remove("music")
        return
    }
}
// to check if the file exsist or not

const fileExsist = url => {
    const xhr = new XMLHttpRequest()
    xhr.open('HEAD', url, false)
    xhr.send()
    return xhr.status != 404
}

const mainURL = "http://localhost:5500"


// all variable

// * playbar dom selection
let playbar = document.querySelector(".playbar")
let cover = playbar.querySelector(".cover img")
let title = playbar.querySelector(".title span")
let artist = playbar.querySelector(".artist span")
let album = playbar.querySelector(".album span")
let year = playbar.querySelector(".year span")
let playPaused = playbar.querySelector(".play_paused")
let next = playbar.querySelector(".next")
let prev = playbar.querySelector(".prev")
let repeat = playbar.querySelector(".repeat")
let shuffle_playback = playbar.querySelector(".shuffle-playback")
let bar = playbar.querySelector(".bar")
let song_len = playbar.querySelector("#song_length")
let cureDura = playbar.querySelector("#current_time")
let timeline = playbar.querySelector(".timeline")
let songs = document.querySelector(".songs")
let volume = playbar.querySelector("#volume")

// * fullscreen dom selection
let fullscreenContainer = document.querySelector(".fullscreen-menu")
let bigCover = fullscreenContainer.querySelector(".cover img")
let playbackStatus = fullscreenContainer.querySelector(".status span")
let queueCollection = fullscreenContainer.querySelector(".collection")
let playingnowFullscreen = fullscreenContainer.querySelector(".playingnow")
let plyCover = playingnowFullscreen.querySelector(".cover img")
let plyTitle = playingnowFullscreen.querySelector(".title span")
let plyArtist = playingnowFullscreen.querySelector(".artist span")

// * icon
const playIco = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24"><path d="M8 19c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2v10c0 1.1.9 2 2 2zm6-12v10c0 1.1.9 2 2 2s2-.9 2-2V7c0-1.1-.9-2-2-2s-2 .9-2 2z"/></svg>`
const pausedIco = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ><path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/></svg>`
const muteIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M7 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L11 9H8c-.55 0-1 .45-1 1z"/></svg>`
const volumeLow = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L9 9H6c-.55 0-1 .45-1 1z"/></svg>`
const volumeHigh = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z"/></svg>`

// error message
let body = document.querySelector("body")
class Message {
    message
    timeout

    constructor(message, time) {
        if (!message) {
            console.error("can't fill without message")
            return
        }
        if (!time) this.timeout = 1000
        if (time === false) this.timeout = false

        this.message = message
        this.timeout = time
    }
    render() {
        let container = document.createElement("div")
        container.classList.add("message")
        container.innerHTML = `<span>${this.message}</span>`
        body.appendChild(container)
        container.classList.toggle("show")

        // remove the message
        container.addEventListener("click", () => {
            container.classList.remove("show")
            setTimeout(() => {
                container.remove()
            }, 1000);
            clearTimeout
        })

        if (this.timeout === false) return

        setTimeout(() => {
            container.classList.remove("show")
            setTimeout(() => {
                container.remove()
            }, 1000);
        }, this.timeout);
    }
}
class Loader {
    timeout
    loaderBars = 4

    constructor(container, timeout) {
        let containers = document.querySelector(".loader")
        this.container = containers

        // ! check the timeout param
        if (!timeout) this.timeout = false
        if (this.timeout === false) return // if the timeout is false, dont run the removeLoader function
        
        // setTimeout remove the loader
        setTimeout(() => {
            this.removeLoader()
        }, timeout);
    }
    ldsLoad() {
        this.createLoader()
    }
    createLoader() {
        let ldsRing = document.createElement("div")
        ldsRing.setAttribute("class", "lds-ring")
        for (let i = 0; i < this.loaderBars; i++) {
           let loaderBar = document.createElement("div")
           ldsRing.appendChild(loaderBar)
        }
        this.container.appendChild(ldsRing)
    }
    removeLoader() {
        this.container.remove()
    }
}

// todo: offline and online
let isOnline = navigator.onLine
window.addEventListener("load", () => {
    // !check the json file is exist
    if (!isOnline) {
        const offline = new Message("Yo're in offline mode now", 4000)
        offline.render()
    } else {
        const online = new Message("Hey, welcome back!. Yo're online now", 4000)
        online.render()
    }
    localStoreageStore()
    const loader = new Loader("", 500).ldsLoad()
})
window.addEventListener("offline", () => {
    const offline = new Message("Yo're offline, someother feature are not avaliable when you're offline", 4000)
    offline.render()
})
window.addEventListener("online", () => {
    const online = new Message("Hey, welcome back!", 4000)
    online.render()
})