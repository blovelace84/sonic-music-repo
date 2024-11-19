// Dual Audio Players
let audioPlayer1 = new Audio();
let audioPlayer2 = new Audio();
let isPlayingFirst = true; // Toggle between the two players
let crossfadeDuration = 3000; // 3 seconds for crossfade

// Songs Array and Current Index
let songs = [];
let currentSongIndex = 0;

// Fetch Songs from JSON
fetch("songs.json")
  .then((response) => response.json())
  .then((data) => {
    songs = data;
    populateSongList(songs);
    playSong(currentSongIndex); // Start the first song
  })
  .catch((error) => console.error("Error loading songs:", error));

// Populate Song List
function populateSongList(songs) {
  const songListElement = document.getElementById("songList");
  songListElement.innerHTML = "";
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

// Play Song with Crossfade
function playSong(index) {
  const song = songs[index];
  const outgoingPlayer = isPlayingFirst ? audioPlayer1 : audioPlayer2;
  const incomingPlayer = isPlayingFirst ? audioPlayer2 : audioPlayer1;

  incomingPlayer.src = song.file; // Set the source of the incoming player

  // Perform Crossfade
  crossfadeSongs(outgoingPlayer, incomingPlayer);

  isPlayingFirst = !isPlayingFirst; // Toggle active player
}

// Crossfade Songs
function crossfadeSongs(outgoingPlayer, incomingPlayer) {
  outgoingPlayer.volume = 1;
  incomingPlayer.volume = 0;

  incomingPlayer.play().catch((error) => {
    console.error("Error playing song:", error);
  });

  const step = 50; // Milliseconds between volume adjustments
  const fadeSteps = crossfadeDuration / step;
  let currentStep = 0;

  const interval = setInterval(() => {
    currentStep++;
    outgoingPlayer.volume = Math.max(1 - currentStep / fadeSteps, 0);
    incomingPlayer.volume = Math.min(currentStep / fadeSteps, 1);

    if (currentStep >= fadeSteps) {
      clearInterval(interval);
      outgoingPlayer.pause();
      outgoingPlayer.src = ""; // Clear outgoing player's source
    }
  }, step);
}

// Automatically Play Next Song
audioPlayer1.addEventListener("ended", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playSong(currentSongIndex);
});

audioPlayer2.addEventListener("ended", () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playSong(currentSongIndex);
});