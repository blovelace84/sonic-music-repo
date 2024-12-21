document.addEventListener("DOMContentLoaded", () => {
  const themeSelector = document.getElementById("theme-selector");
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const clearButton = document.getElementById("clear-button");
  const songListDiv = document.getElementById("song-list");

  let currentAudio = null; // Keep track of the currently playing song

  // Load songs from songs.json
  fetch("songs.json")
    .then((response) => response.json())
    .then((songs) => {
      displaySongs(songs);

      // Add search functionality
      searchButton.addEventListener("click", () => {
        const query = searchInput.value.toLowerCase();
        const filteredSongs = songs.filter((song) =>
          song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query)
        );
        displaySongs(filteredSongs);
      });

      clearButton.addEventListener("click", () => {
        searchInput.value = "";
        displaySongs(songs);
      });
    })
    .catch((error) => console.error("Error loading songs:", error));

  // Display songs dynamically
  function displaySongs(songs) {
    songListDiv.innerHTML = ""; // Clear previous songs
    songs.forEach((song) => {
      const songDiv = document.createElement("div");
      songDiv.className = "song-item";

      // Song Thumbnail
      const thumbnail = document.createElement("img");
      thumbnail.src = song.thumbnail || "default-thumbnail.jpg";
      thumbnail.alt = song.title;
      songDiv.appendChild(thumbnail);

      // Song Title and Artist
      const title = document.createElement("p");
      title.textContent = `${song.title} by ${song.artist}`;
      songDiv.appendChild(title);

      // Play Button
      const playButton = document.createElement("button");
      playButton.textContent = "Play";
      playButton.addEventListener("click", () => {
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0; // Reset previous audio
        }
        currentAudio = new Audio(song.file);
        currentAudio.play();
      });
      songDiv.appendChild(playButton);

      // Pause Button
      const pauseButton = document.createElement("button");
      pauseButton.textContent = "Pause";
      pauseButton.addEventListener("click", () => {
        if (currentAudio) {
          currentAudio.pause();
        }
      });
      songDiv.appendChild(pauseButton);

      songListDiv.appendChild(songDiv);
    });
  }

  // Theme Selector
  themeSelector.addEventListener("change", (event) => {
    const selectedTheme = event.target.value;
    document.body.className = selectedTheme; // Apply theme class to body
  });
});
