# advanced-music-player

## Add the music
1. Place the .mp3 into "/src/audio/"
2. After adding the .mp3 file, go to "/src/music.json"
3. Create the json file

## Dont run the index.html directly, run the app using a web server, for example using live server extention from Visual Studio Code

## JSON File 
{
    "title": "your-music-title",
    "artist": "artist",
    "album": "the music-album",
    "year": release-date, (integer)
    "cover": "album-cover", (for example "midnight-guest.jpg")
    "audio": "audio-src", (!important)
    "id": "the-music-id" (!important)
}

## Example JSON File

{
    "title": "DM",
    "artist": "fromis_9",
    "album": "Midnight Guest",
    "year": 2021,
    "cover": "midnight-guest.jpg",
    "audio": "dm",
    "id": "dm"
}
