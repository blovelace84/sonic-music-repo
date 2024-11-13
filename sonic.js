// Get references to the HTML elements
const musicList = document.getElementById("music-list");
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");

// Function to fetch songs from JSON file
async function loadSongs() {
  try {
    const response = await fetch("songs.json");
    songs = await response.json();
    displaySongs(songs); // Display all songs initially
  } catch (error) {
    console.error("Error loading songs:", error);
  }
}

// Function to display songs in the music list
function displaySongs(filteredSongs) {
  musicList.innerHTML = ""; // Clear current list
  filteredSongs.forEach(song => {
    const songItem = document.createElement("div");
    songItem.classList.add("music-item");

    // Song title
    const songTitle = document.createElement("span");
    songTitle.textContent = song.title;

    // Play button
    const playButton = document.createElement("button");
    playButton.textContent = "Play";
    playButton.addEventListener("click", () => playSong(song.src));

    // Add elements to song item and list
    songItem.appendChild(songTitle);
    songItem.appendChild(playButton);
    musicList.appendChild(songItem);
  });
}

// Function to play a song
function playSong(src) {
  if (!src) {
    console.error("Source for song is undefined.");
    return;
  }

  const audioPlayer = document.createElement("audio");
  audioPlayer.src = src;
  audioPlayer.controls = true;
  audioPlayer.autoplay = true;

  // Remove any previous audio player and add the new one
  const previousAudio = document.querySelector("audio");
  if (previousAudio) {
    previousAudio.remove();
  }
  musicList.appendChild(audioPlayer);
}

// Function to handle search filtering
function filterSongs() {
  const query = searchBar.value.toLowerCase();

  // Filter songs based on the search query
  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(query)
  );

  // Display the filtered list of songs
  displaySongs(filteredSongs);
}

// Event listener for the search button
searchButton.addEventListener("click", filterSongs);

// Load songs when the page loads
loadSongs();

//Theme toggle checkbox
const themeToggle = document.getElementById('theme-toggle');

//function to switch between light and dark themes
function toggleTheme() {
  console.log("Theme toggle clicked!"); //Add this line for debugging
  if(themeToggle.checked) {
    document.body.setAttribute("data-theme", "dark");
  }else{
    document.body.removeAttribute("data-theme");
  }
}

//Adding an event listener for theme toggle
themeToggle.addEventListener("change", toggleTheme);