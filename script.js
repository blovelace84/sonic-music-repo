//Audio players for crossingfading
let audioPlayer1 = new Audio();
let audioPlayer2 = new Audio();
let isPlayingFirst = true; //Toggle between two players
let crossingfadingDuration = 3000; //3 seconds for crossfade

//load songs from json file
let songs = [];
let currentSongIndex = 0;

// Fetch songs from JSON
fetch("songs.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load songs.json");
    }
    return response.json();
  })
  .then((data) => {
    console.log("Songs loaded successfully:", data);
    songs = data;
    populateSongList(songs);
    playSong(currentSongIndex); 
  })
  .catch((error) => console.error("Error loading songs:", error)); //"Error loading songs"

// Populate the song list in the UI
function populateSongList(songs) {
  console.log("Populating song list:", songs); // Debug log
  const songListElement = document.getElementById("songList");
  songListElement.innerHTML = ""; // Clear existing songs

  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.title;
    li.addEventListener("click", () => {
      currentSongIndex = index;
      playSong(currentSongIndex);
    });
    songListElement.appendChild(li);
  });
}

function crossfadeSongs(outgoingPlayer, incomingPlayer,) {
  //set initial volume
  outgoingPlayer.volume = 1;
  incomingPlayer.volume = 0;

  //play the incoming song
  incomingPlayer.player();

  //crossfade logic
  const step = 50; //time between volume adjustments (ms)
  const fadeSteps = crossfadeDuration / step;
  let currentStep = 0;

  const fadeInterval = setInterval(() => {
    currentStep++;
    outgoingPlayer.volume = Math.max(1 - currentStep / fadeSteps, 0) //fade out
    incomingPlayer.volume = Math.min(currentStep / fadeSteps, 1); // fade in

    //stop interval when crossfade is complete
    if(currentStep >= fadeSteps) {
      clearInterval(fadeInterval);
      outgoingPlayer.pause();
      outgoingPlayer.src = ""; //clear the outgoing song
    }
  }, step);
}

// Play a song with crossfade
function playSong(index) {
  const song = songs[index];
  const outgoingPlayer = isPlayingFirst ? audioPlayer1 : audioPlayer2;
  const incomingPlayer = isPlayingFirst ? audioPlayer2 : audioPlayer1;

  incomingPlayer.src = song.file; // Set the source for the new song

  crossfadeSongs(outgoingPlayer, incomingPlayer); // Perform crossfade
  isPlayingFirst = !isPlayingFirst; // Toggle between players
}

// Play the next song when the current one ends
audioPlayer1.addEventListener("ended", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playSong(currentSongIndex);
});

audioPlayer2.addEventListener("ended", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playSong(currentSongIndex);
});