const trackList = document.getElementById("trackList");
let currentAudio = null;
let crossfadeInterval = null; // To manage active intervals
let crossfadeDuration = 2; // Crossfade duration in seconds

// Fetch and render tracks
fetch("songs.json")
  .then((response) => response.json())
  .then((songs) => {
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

      // Create an audio element for this track
      const audio = new Audio(song.url);

      // Add play/pause functionality with crossfade
      playPauseBtn.addEventListener("click", () => {
        if (currentAudio && currentAudio !== audio) {
          // Perform crossfade if switching tracks
          crossfadeTracks(currentAudio, audio);
        } else if (audio.paused) {
          // Play this track
          audio.play();
          playPauseBtn.textContent = "Pause";
          currentAudio = audio;
        } else {
          // Pause this track
          audio.pause();
          playPauseBtn.textContent = "Play";
        }
      });

      // Update button state on audio end
      audio.addEventListener("ended", () => {
        playPauseBtn.textContent = "Play";
      });

      // Append the track to the list
      trackList.appendChild(trackDiv);
    });
  })
  .catch((error) => console.error("Error loading songs:", error));

// Crossfade function
function crossfadeTracks(outgoingAudio, incomingAudio) {
  let outgoingVolume = 1;
  let incomingVolume = 0;

  // Stop any active intervals
  if (crossfadeInterval) clearInterval(crossfadeInterval);

  // Set the incoming audio volume to 0 and start playing
  incomingAudio.volume = 0;
  incomingAudio.play();

  // Crossfade interval
  crossfadeInterval = setInterval(() => {
    // Decrease outgoing audio volume
    outgoingVolume -= 0.05 / crossfadeDuration;
    incomingVolume += 0.05 / crossfadeDuration;

    outgoingAudio.volume = Math.max(0, outgoingVolume); // Ensure no negative volume
    incomingAudio.volume = Math.min(1, incomingVolume); // Cap at full volume

    // End the crossfade
    if (outgoingVolume <= 0 && incomingVolume >= 1) {
      clearInterval(crossfadeInterval);
      outgoingAudio.pause();
      outgoingAudio.volume = 1; // Reset for future playback
      currentAudio = incomingAudio; // Set the new track as current
    }
  }, 50); // Adjust volume every 50ms for a smooth fade
}