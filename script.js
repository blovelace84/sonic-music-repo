document.addEventListener("DOMContentLoaded", () => {
  const songsContainer = document.getElementById("songsContainer");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const themeSelector = document.getElementById("themeSelector");
  let currentAudio = null;
  let fadeInterval = 50; // 50ms interval for fade

  // Fetch and display songs
  fetch("songs.json")
    .then(response => response.json())
    .then(songList => displaySongs(songList))
    .catch(error => console.error("Error loading songs:", error));

  function displaySongs(songList) {
    songsContainer.innerHTML = ""; // Clear existing songs
    songList.forEach(song => {
      const trackElement = document.createElement("div");
      trackElement.classList.add("track");

      trackElement.innerHTML = `
        <img src="${song.thumbnail}" alt="${song.title} thumbnail" class="thumbnail">
        <div class="info">
          <h3>${song.title}</h3>
          <p>${song.artist}</p>
        </div>
        <button data-audio="${song.audio}" class="play-button">Play</button>
      `;

      songsContainer.appendChild(trackElement);
    });

    addPlayListeners();
  }

  function addPlayListeners() {
    const playButtons = document.querySelectorAll(".play-button");
    playButtons.forEach(button => {
      button.addEventListener("click", () => {
        const audioSrc = button.getAttribute("data-audio");
        playSong(audioSrc);
      });
    });
  }

  function playSong(audioSrc) {
    if (currentAudio) {
      fadeOut(currentAudio, 1000);
    }

    const newAudio = new Audio(audioSrc);
    currentAudio = newAudio;
    fadeIn(newAudio, 1000);
    newAudio.play();
  }

  function fadeOut(audio, duration) {
    const step = 1 / (duration / fadeInterval);
    const fadeOutInterval = setInterval(() => {
      if (audio.volume > 0) {
        audio.volume = Math.max(0, audio.volume - step);
      } else {
        clearInterval(fadeOutInterval);
        audio.pause();
      }
    }, fadeInterval);
  }

  function fadeIn(audio, duration) {
    audio.volume = 0;
    const step = 1 / (duration / fadeInterval);
    const fadeInInterval = setInterval(() => {
      if (audio.volume < 1) {
        audio.volume = Math.min(1, audio.volume + step);
      } else {
        clearInterval(fadeInInterval);
      }
    }, fadeInterval);
  }

  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.toLowerCase();
    fetch("songs.json")
      .then(response => response.json())
      .then(songList => {
        const filteredSongs = songList.filter(song =>
          song.title.toLowerCase().includes(searchTerm) ||
          song.artist.toLowerCase().includes(searchTerm)
        );
        displaySongs(filteredSongs);
      });
  });

 // Get the theme selector dropdown

// Add an event listener to handle theme changes
themeSelector.addEventListener("change", (event) => {
  const selectedTheme = event.target.value;

  // Clear existing theme classes from the body
  document.body.classList.remove("theme-default", "theme-green-hill", "theme-chemical-plant", "theme-sky-sanctuary");

  // Apply the selected theme class
  switch (selectedTheme) {
    case "green-hill":
      document.body.classList.add("theme-green-hill");
      break;
    case "chemical-plant":
      document.body.classList.add("theme-chemical-plant");
      break;
    case "sky-sanctuary":
      document.body.classList.add("theme-sky-sanctuary");
      break;
    default:
      document.body.classList.add("theme-default");
      break;
  }
});
})