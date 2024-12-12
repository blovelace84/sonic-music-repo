document.addEventListener("DOMContentLoaded", () => {
  const songContainer = document.getElementById("song-container");
  const searchBar = document.getElementById("search-bar");
  const searchButton = document.getElementById("search-button");

  let currentAudio = null; // Track the currently playing song
  let songsList = []; // Store the full list of songs

  // Fetch and load songs from JSON
  fetch("songs.json")
    .then((response) => response.json())
    .then((songs) => {
      songsList = songs; // Save all songs
      displaySongs(songsList); // Display all songs initially
    })
    .catch((error) => {
      console.error("Error loading songs:", error);
    });

  function displaySongs(songs) {
    songContainer.innerHTML = ""; // Clear previous songs

    songs.forEach((song) => {
      const songDiv = document.createElement("div");
      songDiv.className = "song-item";

      // Add song title and artist
      const title = document.createElement("p");
      title.textContent = `${song.title} - ${song.artist}`;
      songDiv.appendChild(title);

      // Add play/pause button
      const playButton = document.createElement("button");
      playButton.textContent = "Play";
      playButton.className = "play-button";
      playButton.addEventListener("click", () => {
        handlePlayPause(song.file, playButton);
      });
      songDiv.appendChild(playButton);

      songContainer.appendChild(songDiv);
    });
  }

  function handlePlayPause(file, button) {
    if (currentAudio) {
      currentAudio.pause(); // Pause the current audio
      currentAudio = null; // Reset the current audio
    }

    // If the button was "Play," start playing the new song
    if (button.textContent === "Play") {
      const audio = new Audio(file); // Create a new audio object
      audio.play().catch((error) => {
        console.error("Error playing song:", error);
      });

      currentAudio = audio; // Set the new audio as the current audio

      // Update the button text and handle audio end
      button.textContent = "Pause";
      audio.addEventListener("ended", () => {
        button.textContent = "Play"; // Reset button when song ends
        currentAudio = null; // Clear current audio
      });
    } else {
      button.textContent = "Play"; // Reset button text if paused
    }
  }

  // Add search functionality
  searchButton.addEventListener("click", () => {
    const query = searchBar.value.toLowerCase(); // Get the search query
    const filteredSongs = songsList.filter((song) =>
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query)
    );
    displaySongs(filteredSongs); // Display only filtered songs
  });
});