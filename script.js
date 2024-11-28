const trackList = document.getElementById("trackList");
let currentAudio = null; // Currently playing audio
let currentIndex = -1; // Index of the currently playing track
let crossfadeInterval = null;
const crossfadeDuration = 2; // Duration of crossfade in seconds
let songs = []; // Will hold the loaded songs

// Fetch and render tracks
fetch("songs.json")
  .then((response) => response.json())
  .then((data) => {
    songs = data; // Store songs for navigation
    songs.forEach((song, index) => {
      // Create a container for each track
      const trackDiv = document.createElement("div");
      trackDiv.classList.add("track");

      // Add song title
      const title = document.createElement("p");
      title.textContent = song.title;
      trackDiv.appendChild(title);

      // Add play/pause button
      const playPauseBtn = document.createElement("button");
      playPauseBtn.textContent = "Play";
      playPauseBtn.classList.add("playPauseBtn");
      trackDiv.appendChild(playPauseBtn);

      // Add event listener for play/pause
      playPauseBtn.addEventListener("click", () => {
        playTrack(index);
      });

      // Append the track to the list
      trackList.appendChild(trackDiv);
    });
  })
  .catch((error) => console.error("Error loading songs:", error));

// Function to play a track
function playTrack(index) {
  if (index < 0 || index >= songs.length) return; // Ensure valid index

  const song = songs[index];
  const audio = new Audio(song.url);

  if (currentAudio) {
    // Crossfade to the new track
    crossfadeTracks(currentAudio, audio);
  } else {
    // Play the new track directly
    audio.play();
    currentAudio = audio;
    currentIndex = index;
    setupTrackEndListener();
  }
}

// Setup listener to auto-crossfade to the next track
function setupTrackEndListener() {
  currentAudio.addEventListener("ended", () => {
    const nextIndex = (currentIndex + 1) % songs.length; // Loop to the first track
    const nextSong = new Audio(songs[nextIndex].url);
    crossfadeTracks(currentAudio, nextSong);
    currentIndex = nextIndex;
  });
}

// Crossfade function
function crossfadeTracks(outgoingAudio, incomingAudio) {
  let outgoingVolume = 1;
  let incomingVolume = 0;

  if (crossfadeInterval) clearInterval(crossfadeInterval);

  incomingAudio.volume = 0; // Start with zero volume
  incomingAudio.play();

  crossfadeInterval = setInterval(() => {
    outgoingVolume -= 0.05 / crossfadeDuration;
    incomingVolume += 0.05 / crossfadeDuration;

    outgoingAudio.volume = Math.max(0, outgoingVolume);
    incomingAudio.volume = Math.min(1, incomingVolume);

    if (outgoingVolume <= 0 && incomingVolume >= 1) {
      clearInterval(crossfadeInterval);
      outgoingAudio.pause();
      outgoingAudio.volume = 1;
      currentAudio = incomingAudio;
      setupTrackEndListener(); // Set up next song to play
    }
  }, 50);
}