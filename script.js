document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.getElementById('search-bar');
  const searchButton = document.getElementById('search-button');
  const songContainer = document.getElementById('song-container'); // Div to display songs
  let songs = []; // Placeholder for songs fetched from JSON

  // Fetch songs from the JSON file
  const loadSongs = async () => {
    try {
      const response = await fetch('songs.json'); // Path to your JSON file
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      songs = await response.json(); // Assign the parsed JSON data to songs
      displaySongs(songs); // Initially display all songs
    } catch (error) {
      console.error("Error loading songs:", error);
      songContainer.innerHTML = `<p>Error loading songs. Please try again later.</p>`;
    }
  };

  // Function to display songs
  const displaySongs = (songList) => {
    songContainer.innerHTML = ""; // Clear current list
    if (songList.length === 0) {
      songContainer.innerHTML = `<p>No songs found.</p>`;
      return;
    }
    songList.forEach((song) => {
      const songItem = document.createElement("div");
      songItem.className = "song-item";
      songItem.innerHTML = `
        <h3>${song.title}</h3>
        <p>${song.artist}</p>
        <button class="play-button" data-src="${song.file}">Play</button>
      `;
      songContainer.appendChild(songItem);
    });

    // Add event listeners to play buttons
    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const audioSource = event.target.getAttribute('data-src');
        playSong(audioSource);
      });
    });
  };

  // Search function
  const searchSongs = () => {
    const query = searchBar.value.toLowerCase();
    const filteredSongs = songs.filter((song) =>
      song.title.toLowerCase().includes(query)
    );
    displaySongs(filteredSongs);
  };

  // Play song function
  const playSong = (src) => {
    const audioPlayer = document.getElementById('audio-player'); // Assume you have an audio player in your HTML
    audioPlayer.src = src;
    audioPlayer.play().catch((error) => {
      console.error("Error playing song:", error);
    });
  };

  // Event listeners
  searchButton.addEventListener("click", searchSongs);
  searchBar.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      searchSongs();
    }
  });

  // Load songs on page load
  loadSongs();
});
